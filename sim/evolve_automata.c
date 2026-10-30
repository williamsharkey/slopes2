/*
 * evolve_automata.c
 * Slopes 2 - 5-State Cellular Automata & Permeable-Membrane Alife DNA Evolution Engine
 *
 * States:
 *   0 = EMPTY / FLUID
 *   1 = LIPID MEMBRANE SHELL (semi-permeable boundary)
 *   2 = ACTIVE CORE / COMPUTE STATE A (resting excitable compute substrate)
 *   3 = EXCITED SIGNAL / COMPUTE STATE B (propagating action potential / wave)
 *   4 = OUTPUT / EFFECTOR STATE (triggers vat port output, membrane protrusion, web cutting, terraforming)
 *
 * Compile:
 *   clang -O3 -Wall -Wextra -o evolve_automata evolve_automata.c -lm
 */

#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>
#include <math.h>

#define STATE_EMPTY    0
#define STATE_MEMBRANE 1
#define STATE_CORE_A   2
#define STATE_SIGNAL_B 3
#define STATE_EFFECTOR 4
#define NUM_STATES     5

/* Vat dimensions (interior compute lake) */
#define VAT_W 14
#define VAT_H 7
#define VAT_CELLS (VAT_W * VAT_H)
#define VAT_STEPS_UNFORCED 400
#define VAT_STEPS_FORCED   800
#define VAT_TOTAL_STEPS    (VAT_STEPS_UNFORCED + VAT_STEPS_FORCED)

/* Open arena dimensions for Free-Roaming Permeable-Membrane Automaton evaluation */
#define ARENA_W 40
#define ARENA_H 18
#define ARENA_STEPS 1000

/*
 * Rule Genome (9-bit masks for Moore neighbor counts 0..8, bits 0..8 used):
 * All transitions are deterministic functions of the cell's current state,
 * its 8 Moore neighbors (n1, n2, n3, n4, n_active = n2+n3+n4), and a local
 * phase/polarity bias for asymmetric membrane motility.
 */
typedef struct {
    /* Core birth from empty (0 -> 2 or 0 -> 3) */
    uint16_t birth2_n2_mask;        /* Empty -> Core A based on n2 count */
    uint16_t birth2_active_mask;    /* Empty -> Core A based on n_active count */
    uint16_t birth3_n3_mask;        /* Empty -> Signal B wave jump based on n3 count */

    /* Core survival & excitation (2 -> 2, 2 -> 3) */
    uint16_t survive2_n2_mask;      /* Core A stays Core A based on n2 count */
    uint16_t survive2_active_mask;  /* Core A stays Core A based on n_active count */
    uint16_t excite_2to3_n3_mask;   /* Core A -> Signal B when excited by n3 neighbors */
    uint16_t excite_2to3_act_mask;  /* Spontaneous/oscillatory Core A -> Signal B from n_active */

    /* Signal propagation & effector firing (3 -> 4, 3 -> 2, 3 -> 0) */
    uint16_t fire_3to4_n3_mask;     /* Signal B -> Effector 4 based on n3 */
    uint16_t fire_3to4_n2_mask;     /* Signal B -> Effector 4 based on n2 */
    uint16_t sustain3_n2_mask;      /* Signal B stays Signal B (1 step) if n2 matches */
    uint16_t refract_3to2_n2_mask;  /* Signal B -> Core A recovery based on n2 */

    /* Effector recovery (4 -> 2, 4 -> 1, 4 -> 0) */
    uint16_t recover_4to2_act_mask; /* Effector 4 -> Core A based on n_active */
    uint16_t recover_4to1_n1_mask;  /* Effector 4 -> Membrane 1 at boundary based on n1 */

    /* Lipid Membrane self-assembly & motility (0 <-> 1 <-> 2) */
    uint16_t mem_form_act_mask;     /* Empty -> Membrane 1 when bordering n_active core cells */
    uint16_t mem_form_n1_mask;      /* Empty -> Membrane 1 when n1 neighbors match */
    uint16_t mem_survive_act_mask;  /* Membrane 1 survives when bordering n_active core cells */
    uint16_t mem_survive_n1_mask;   /* Membrane 1 survives when n1 is within bounds */
    uint8_t  protrude_thresh;       /* (n3 + n4) threshold to push membrane outward (1..4) */
    uint8_t  motility_bias;         /* Asymmetric wave/chemotaxis coupling strength (1..5) */
    uint8_t  seed_pattern[7][7];    /* 7x7 initial organism / vat seed pattern */
} AutomataDNA;

typedef struct {
    double avg_density;          /* Mean active fraction (states 2,3,4) in vat (target 0.18..0.65) */
    double min_density;          /* Minimum active fraction after warmup */
    double max_density;          /* Maximum active fraction */
    double oscillation_activity; /* Mean fraction of cells changing state per step */
    double state_entropy;        /* Shannon entropy across states 0..4 */
    double io_hit_rate;          /* Fraction of input port pulses producing causal output port pulse */
    double io_snr;               /* Ratio of forced output rate to unforced spontaneous output rate */
    double io_latency;           /* Mean propagation latency from Input Port to Output Port (steps) */
    double roam_displacement;    /* Net center-of-mass displacement of free-roaming membrane automaton */
    double roam_coherence;       /* Fraction of 1000 steps organism remains a bounded intact membrane cell */
    double roam_mem_ratio;       /* Mean fraction of organism cells in State 1 (lipid membrane) */
    int    spores_harvested;     /* External resource nodes harvested by free-roaming automaton */
    int    webs_cleaved;         /* Black goo web strands severed by State 4 effector boundary */
    double total_score;          /* Composite fitness for target archetype */
} EvalMetrics;

/* Fast xorshift64* PRNG */
static uint64_t rng_state = 0x853c49e6748fea9bULL;
static inline uint64_t xorshift64(void) {
    uint64_t x = rng_state;
    x ^= x >> 12;
    x ^= x << 25;
    x ^= x >> 27;
    rng_state = x;
    return x * 0x2545F4914F6CDD1DULL;
}
static inline uint32_t rand_u32(uint32_t bound) {
    return (uint32_t)(xorshift64() % bound);
}

/* Default canonical 7x7 seed with lipid membrane ring and excitable dipole core */
static const uint8_t BASE_SEED[7][7] = {
    {0, 1, 1, 1, 1, 1, 0},
    {1, 1, 2, 2, 3, 1, 1},
    {1, 2, 2, 3, 4, 2, 1},
    {1, 2, 3, 2, 3, 4, 1},
    {1, 2, 2, 3, 4, 2, 1},
    {1, 1, 2, 2, 3, 1, 1},
    {0, 1, 1, 1, 1, 1, 0}
};

/*
 * Step a single cell inside a Compute Vat (VAT_W x VAT_H).
 * Vat walls act as insulating containment with:
 *   - Input Port at left (x = 0, y = 2..4)
 *   - Output Port at right (x = VAT_W - 1, y = 2..4)
 */
static inline uint8_t step_vat_cell(
    const AutomataDNA *dna,
    int x, int y,
    uint8_t self,
    int n1, int n2, int n3, int n4,
    int step
) {
    int n_act = n2 + n3 + n4;
    /* Directional wave phase bias (helps propagate signals from left Input Port to right Output Port) */
    int wave_phase = ((x + step) % 5 == 0) ? 1 : 0;

    switch (self) {
        case STATE_EMPTY: {
            /* Signal jump across small gap */
            if (((dna->birth3_n3_mask >> n3) & 1) && n2 >= 1) {
                return STATE_SIGNAL_B;
            }
            /* Core nucleation */
            if (((dna->birth2_n2_mask >> n2) & 1) ||
                (((dna->birth2_active_mask >> n_act) & 1) && n2 >= 1)) {
                return STATE_CORE_A;
            }
            /* Peripheral lipid cushion along vat walls */
            if ((y == 0 || y == VAT_H - 1) && ((dna->mem_form_act_mask >> n_act) & 1)) {
                return STATE_MEMBRANE;
            }
            return STATE_EMPTY;
        }
        case STATE_MEMBRANE: {
            /* If strongly excited by internal signal, conduct into Core A */
            if (n3 + n4 >= dna->protrude_thresh + 1) {
                return STATE_CORE_A;
            }
            if (((dna->mem_survive_act_mask >> n_act) & 1) &&
                ((dna->mem_survive_n1_mask >> n1) & 1)) {
                return STATE_MEMBRANE;
            }
            return (n_act >= 2) ? STATE_CORE_A : STATE_EMPTY;
        }
        case STATE_CORE_A: {
            /* Excitation to Signal B by neighboring Signal B or oscillatory threshold */
            if (((dna->excite_2to3_n3_mask >> n3) & 1) ||
                (((dna->excite_2to3_act_mask >> n_act) & 1) && wave_phase)) {
                return STATE_SIGNAL_B;
            }
            /* Survival as resting Core A */
            if (((dna->survive2_n2_mask >> n2) & 1) &&
                ((dna->survive2_active_mask >> n_act) & 1)) {
                return STATE_CORE_A;
            }
            return STATE_EMPTY;
        }
        case STATE_SIGNAL_B: {
            /* Transition to Effector State 4 when signal converges */
            if (((dna->fire_3to4_n3_mask >> n3) & 1) ||
                ((dna->fire_3to4_n2_mask >> n2) & 1)) {
                return STATE_EFFECTOR;
            }
            if ((dna->sustain3_n2_mask >> n2) & 1) {
                return STATE_SIGNAL_B;
            }
            if ((dna->refract_3to2_n2_mask >> n2) & 1) {
                return STATE_CORE_A;
            }
            return STATE_EMPTY;
        }
        case STATE_EFFECTOR: {
            /* Refractory recovery from Effector 4 */
            if ((dna->recover_4to2_act_mask >> n_act) & 1) {
                return STATE_CORE_A;
            }
            if ((y == 0 || y == VAT_H - 1) && ((dna->recover_4to1_n1_mask >> n1) & 1)) {
                return STATE_MEMBRANE;
            }
            return STATE_EMPTY;
        }
    }
    return STATE_EMPTY;
}

/*
 * Evaluate candidate DNA inside the Compute Vat over 1,200 steps
 * and in the Free-Roaming Permeable-Membrane Arena over 1,000 steps.
 */
static void evaluate_dna(const AutomataDNA *dna, int archetype, EvalMetrics *m) {
    memset(m, 0, sizeof(*m));

    uint8_t grid[VAT_H][VAT_W];
    uint8_t next[VAT_H][VAT_W];
    memset(grid, 0, sizeof(grid));

    /* Place 7x7 seed centered in the 14x7 vat */
    int ox = (VAT_W - 7) / 2;
    int oy = (VAT_H - 7) / 2;
    for (int sy = 0; sy < 7; sy++) {
        for (int sx = 0; sx < 7; sx++) {
            grid[oy + sy][ox + sx] = dna->seed_pattern[sy][sx];
        }
    }

    double sum_density = 0.0;
    double min_dens = 1.0;
    double max_dens = 0.0;
    double sum_osc = 0.0;
    long state_hist[NUM_STATES] = {0, 0, 0, 0, 0};

    int unforced_out_pulses = 0;
    int forced_in_pulses = 0;
    int forced_out_hits = 0;
    int forced_out_total = 0;
    double sum_latency = 0.0;
    int last_input_step = -1000;
    int hit_recorded_for_pulse = 0;

    for (int step = 0; step < VAT_TOTAL_STEPS; step++) {
        /* Inject Input Port pulse at left (x=0, y=2..4) during forced phase */
        if (step >= VAT_STEPS_UNFORCED) {
            int rel = step - VAT_STEPS_UNFORCED;
            /* Periodic + patterned input pulses every 18 or 24 steps */
            int trigger = (rel % 20 == 0) || (rel % 47 == 11);
            if (trigger && (step - last_input_step >= 12)) {
                grid[2][0] = STATE_SIGNAL_B;
                grid[3][0] = STATE_SIGNAL_B;
                grid[4][0] = STATE_SIGNAL_B;
                grid[3][1] = STATE_SIGNAL_B;
                last_input_step = step;
                hit_recorded_for_pulse = 0;
                forced_in_pulses++;
            }
        }

        int active_cnt = 0;
        int changed_cnt = 0;
        int out_port_effector = 0;

        for (int y = 0; y < VAT_H; y++) {
            for (int x = 0; x < VAT_W; x++) {
                int c[NUM_STATES] = {0, 0, 0, 0, 0};
                /* Moore neighborhood + left-to-right gradient bias near input/output ports */
                for (int dy = -1; dy <= 1; dy++) {
                    int ny = y + dy;
                    if (ny < 0 || ny >= VAT_H) continue;
                    for (int dx = -1; dx <= 1; dx++) {
                        if (dx == 0 && dy == 0) continue;
                        int nx = x + dx;
                        if (nx < 0 || nx >= VAT_W) continue;
                        uint8_t ns = grid[ny][nx];
                        c[ns]++;
                        /* Directed chemotactic/signal bias from left to right */
                        if (dx == -1 && ns == STATE_SIGNAL_B && (dna->motility_bias & 1)) {
                            if (c[STATE_SIGNAL_B] < 8) c[STATE_SIGNAL_B]++;
                        }
                    }
                }

                uint8_t s = grid[y][x];
                uint8_t ns = step_vat_cell(dna, x, y, s, c[1], c[2], c[3], c[4], step);
                next[y][x] = ns;

                state_hist[ns]++;
                if (ns >= STATE_CORE_A) active_cnt++;
                if (ns != s) changed_cnt++;

                /* Check Output Port on right wall (x >= VAT_W - 2, y = 2..4) */
                if (x >= VAT_W - 2 && y >= 1 && y <= VAT_H - 2 && ns == STATE_EFFECTOR) {
                    out_port_effector++;
                }
            }
        }

        memcpy(grid, next, sizeof(grid));

        double dens = (double)active_cnt / (double)VAT_CELLS;
        sum_density += dens;
        if (step >= 50) {
            if (dens < min_dens) min_dens = dens;
            if (dens > max_dens) max_dens = dens;
        }
        sum_osc += (double)changed_cnt / (double)VAT_CELLS;

        if (out_port_effector > 0) {
            if (step < VAT_STEPS_UNFORCED) {
                unforced_out_pulses++;
            } else {
                forced_out_total++;
                int dt = step - last_input_step;
                if (!hit_recorded_for_pulse && dt >= 2 && dt <= 14) {
                    forced_out_hits++;
                    sum_latency += (double)dt;
                    hit_recorded_for_pulse = 1;
                }
            }
        }
    }

    m->avg_density = sum_density / (double)VAT_TOTAL_STEPS;
    m->min_density = min_dens;
    m->max_density = max_dens;
    m->oscillation_activity = sum_osc / (double)VAT_TOTAL_STEPS;

    /* Compute Shannon entropy over the 5 states */
    double total_samples = (double)VAT_TOTAL_STEPS * VAT_CELLS;
    double ent = 0.0;
    for (int s = 0; s < NUM_STATES; s++) {
        double p = (double)state_hist[s] / total_samples;
        if (p > 1e-9) ent -= p * log2(p);
    }
    m->state_entropy = ent;

    m->io_hit_rate = (forced_in_pulses > 0) ? ((double)forced_out_hits / (double)forced_in_pulses) : 0.0;
    double unforced_rate = (double)unforced_out_pulses / (double)VAT_STEPS_UNFORCED;
    double forced_rate   = (double)forced_out_total / (double)VAT_STEPS_FORCED;
    m->io_snr = (forced_rate + 0.001) / (unforced_rate + 0.005);
    m->io_latency = (forced_out_hits > 0) ? (sum_latency / (double)forced_out_hits) : 0.0;

    /*
     * PART 2: Free-Roaming Permeable-Membrane Automaton Simulation (1,000 steps)
     * Arena has:
     *   - Nutrient Spores (value 10) scattered along the path
     *   - Black Goo Web strands (value 20) that can be severed by STATE_EFFECTOR (4)
     * The organism starts at (6, ARENA_H/2) as a 7x7 lipid-bounded automaton.
     * Its locomotion emerges from asymmetric internal excitation (State 3/4)
     * pushing against its State 1 lipid membrane toward external chemo-attractants!
     */
    uint8_t arena[ARENA_H][ARENA_W];
    uint8_t arena_next[ARENA_H][ARENA_W];
    uint8_t env_grid[ARENA_H][ARENA_W]; /* 0=none, 1=spore, 2=black_goo_web */
    memset(arena, 0, sizeof(arena));
    memset(env_grid, 0, sizeof(env_grid));

    /* Place spores and black goo web strands across the arena */
    for (int x = 10; x < ARENA_W - 3; x += 3) {
        int sy = 4 + ((x * 7) % (ARENA_H - 8));
        env_grid[sy][x] = 1; /* Spore */
        if (x % 2 == 0 && sy + 1 < ARENA_H - 2) {
            env_grid[sy + 1][x] = 2; /* Sticky Black Goo Web */
            env_grid[sy - 1][x] = 2;
        }
    }

    int start_x = 3;
    int start_y = (ARENA_H - 7) / 2;
    for (int sy = 0; sy < 7; sy++) {
        for (int sx = 0; sx < 7; sx++) {
            arena[start_y + sy][start_x + sx] = dna->seed_pattern[sy][sx];
        }
    }

    double init_cx = start_x + 3.0;
    double init_cy = start_y + 3.0;
    double cur_cx = init_cx;
    double cur_cy = init_cy;

    int coherent_steps = 0;
    double sum_mem_ratio = 0.0;
    int spores_eaten = 0;
    int webs_cut = 0;

    for (int step = 0; step < ARENA_STEPS; step++) {
        memset(arena_next, 0, sizeof(arena_next));

        /* Compute current center of mass & bounding box of organism */
        double sum_x = 0.0, sum_y = 0.0;
        int org_cells = 0, mem_cells = 0, core_cells = 0;
        int min_x = ARENA_W, max_x = 0, min_y = ARENA_H, max_y = 0;

        for (int y = 1; y < ARENA_H - 1; y++) {
            for (int x = 1; x < ARENA_W - 1; x++) {
                uint8_t s = arena[y][x];
                if (s != STATE_EMPTY) {
                    sum_x += x;
                    sum_y += y;
                    org_cells++;
                    if (s == STATE_MEMBRANE) mem_cells++;
                    else core_cells++;
                    if (x < min_x) min_x = x;
                    if (x > max_x) max_x = x;
                    if (y < min_y) min_y = y;
                    if (y > max_y) max_y = y;
                }
            }
        }

        if (org_cells >= 10 && org_cells <= 48 && core_cells >= 4 && mem_cells >= 6 &&
            (max_x - min_x) <= 9 && (max_y - min_y) <= 9) {
            coherent_steps++;
            cur_cx = sum_x / (double)org_cells;
            cur_cy = sum_y / (double)org_cells;
            sum_mem_ratio += (double)mem_cells / (double)org_cells;
        } else if (org_cells == 0) {
            break;
        } else {
            cur_cx = sum_x / (double)org_cells;
            cur_cy = sum_y / (double)org_cells;
        }

        /* Determine chemotactic gradient vector toward nearest spore/web or rightward patrol */
        double grad_x = 1.0, grad_y = 0.0;
        double best_dist2 = 1e9;
        for (int y = 1; y < ARENA_H - 1; y++) {
            for (int x = 1; x < ARENA_W - 1; x++) {
                if (env_grid[y][x] != 0) {
                    double dx = x - cur_cx;
                    double dy = y - cur_cy;
                    double d2 = dx * dx + dy * dy;
                    if (d2 < best_dist2) {
                        best_dist2 = d2;
                        grad_x = dx;
                        grad_y = dy;
                    }
                }
            }
        }

        for (int y = 1; y < ARENA_H - 1; y++) {
            for (int x = 1; x < ARENA_W - 1; x++) {
                int c[NUM_STATES] = {0, 0, 0, 0, 0};
                for (int dy = -1; dy <= 1; dy++) {
                    for (int dx = -1; dx <= 1; dx++) {
                        if (dx == 0 && dy == 0) continue;
                        uint8_t ns = arena[y + dy][x + dx];
                        c[ns]++;
                    }
                }

                uint8_t s = arena[y][x];
                int n1 = c[1], n2 = c[2], n3 = c[3], n4 = c[4];
                int n_act = n2 + n3 + n4;

                /* Distance from current center of mass & alignment with chemotactic gradient */
                double rx = x - cur_cx;
                double ry = y - cur_cy;
                double rad2 = rx * rx + ry * ry;
                double dot = rx * grad_x + ry * grad_y;
                int leading_edge = (dot > 0.25) ? 1 : 0;
                int trailing_edge = (dot < -1.2) ? 1 : 0;

                uint8_t ns = STATE_EMPTY;

                if (s == STATE_EMPTY) {
                    /* Outward membrane polymerization at leading edge when internal effectors push */
                    if (n1 >= 1 && (n3 + n4 >= dna->protrude_thresh) && leading_edge && rad2 <= 18.0) {
                        ns = STATE_MEMBRANE;
                    } else if (n_act >= 2 && rad2 <= 14.0 && ((dna->mem_form_act_mask >> n_act) & 1)) {
                        /* Self-healing lipid shell around exposed active core */
                        ns = STATE_MEMBRANE;
                    }
                } else if (s == STATE_MEMBRANE) {
                    /* Leading membrane assimilates into active core when pushed by excited states */
                    if (leading_edge && (n3 + n4 >= dna->protrude_thresh) && n_act >= 2 && rad2 <= 11.0) {
                        ns = STATE_CORE_A;
                    } else if (trailing_edge && (rad2 > 10.5 || n_act == 0)) {
                        /* Trailing lipid depolymerizes so the cell translocates */
                        ns = STATE_EMPTY;
                    } else if (n_act >= 1 && n_act <= 6 && rad2 <= 15.0) {
                        ns = STATE_MEMBRANE;
                    } else if (n_act > 6 && rad2 < 6.0) {
                        ns = STATE_CORE_A;
                    } else {
                        ns = STATE_EMPTY;
                    }
                } else {
                    /* Core states (2, 3, 4) inside the membrane */
                    if (rad2 > 11.5 || (trailing_edge && rad2 > 7.5)) {
                        /* Condense peripheral core into lipid membrane Shell */
                        ns = STATE_MEMBRANE;
                    } else {
                        ns = step_vat_cell(dna, x, y, s, n1, n2, n3, n4, step);
                        if (ns == STATE_EMPTY && rad2 <= 5.5 && n_act >= 2) {
                            /* Keep core cohesive inside the roaming cell */
                            ns = STATE_CORE_A;
                        }
                        /* Asymmetric excitation toward leading edge */
                        if (ns == STATE_CORE_A && leading_edge && ((step + x + y) % 3 == 0)) {
                            ns = STATE_SIGNAL_B;
                        }
                    }
                }

                arena_next[y][x] = ns;

                /* Surface interaction with Spores & Black Goo Webs! */
                if (ns != STATE_EMPTY && env_grid[y][x] != 0) {
                    if (env_grid[y][x] == 1) {
                        spores_eaten++;
                        env_grid[y][x] = 0;
                        /* Harvesting a spore injects an excitation pulse into the membrane */
                        arena_next[y][x] = STATE_SIGNAL_B;
                    } else if (env_grid[y][x] == 2 && (ns == STATE_EFFECTOR || ns == STATE_SIGNAL_B || n4 >= 1)) {
                        webs_cut++;
                        env_grid[y][x] = 0;
                        arena_next[y][x] = STATE_EFFECTOR;
                    }
                }
            }
        }

        memcpy(arena, arena_next, sizeof(arena));
    }

    double dx = cur_cx - init_cx;
    double dy = cur_cy - init_cy;
    m->roam_displacement = sqrt(dx * dx + dy * dy);
    m->roam_coherence = (double)coherent_steps / (double)ARENA_STEPS;
    m->roam_mem_ratio = (coherent_steps > 0) ? (sum_mem_ratio / (double)coherent_steps) : 0.0;
    m->spores_harvested = spores_eaten;
    m->webs_cleaved = webs_cut;

    /*
     * Compute composite fitness score:
     * 1) Bounded Vat Stability: avg_density in [0.18, 0.65], min_density >= 0.08, max_density <= 0.78
     * 2) Dynamic Oscillation & Entropy: oscillation_activity >= 0.12, state_entropy >= 1.35
     * 3) Real Input-to-Output Computation: io_hit_rate, io_snr
     * 4) Permeable-Membrane Motility & Surface Work: roam_coherence, roam_displacement, spores + webs
     */
    double score = 0.0;

    /* Density stability bell curve centered in [0.22, 0.58] */
    if (m->avg_density >= 0.18 && m->avg_density <= 0.65 && m->min_density >= 0.06 && m->max_density <= 0.82) {
        score += 35.0;
        double center_dist = fabs(m->avg_density - 0.38);
        score += (0.30 - center_dist) * 30.0;
    } else {
        score -= fabs(m->avg_density - 0.38) * 80.0;
        if (m->min_density < 0.04) score -= 50.0;
        if (m->max_density > 0.85) score -= 50.0;
    }

    /* Oscillation and multi-state richness */
    score += fmin(m->oscillation_activity, 0.45) * 45.0;
    score += fmin(m->state_entropy, 2.1) * 15.0;

    /* Input-to-Output computation quality */
    score += m->io_hit_rate * 55.0;
    score += fmin(m->io_snr, 8.0) * 6.0;

    /* Free-roaming membrane coherence & motility */
    score += m->roam_coherence * 45.0;
    score += fmin(m->roam_displacement, 30.0) * 2.2;
    score += m->spores_harvested * 3.5 + m->webs_cleaved * 4.5;

    /* Archetype-specific specialization bonuses */
    switch (archetype) {
        case 0: /* SOLARIS_VAT_OSCILLATOR: high oscillation + balanced harmonic entropy */
            score += m->oscillation_activity * 40.0 + m->state_entropy * 15.0;
            break;
        case 1: /* WEB_CUTTER_GLIDER: maximum motility + web cleaving effector output */
            score += m->webs_cleaved * 8.0 + m->roam_displacement * 2.5;
            break;
        case 2: /* TERRA_SHAPER_MEMBRANE: strong membrane ratio (0.42..0.58) + high coherence */
            score += (1.0 - fabs(m->roam_mem_ratio - 0.48) * 4.0) * 25.0 + m->roam_coherence * 30.0;
            break;
        case 3: /* AETHER_SYNTH_SERVER: maximum I/O hit rate and high SNR in server vat */
            score += m->io_hit_rate * 60.0 + fmin(m->io_snr, 10.0) * 8.0;
            break;
        case 4: /* CORVUS_ORACLE_CORE: fast low-latency signal routing + high 5-state entropy */
            if (m->io_latency > 1.5 && m->io_latency < 8.0) score += (10.0 - m->io_latency) * 6.0;
            score += m->state_entropy * 20.0 + m->io_hit_rate * 40.0;
            break;
        case 5: /* SKEKSIS_BLIGHT_VAT: aggressive high-density (0.45..0.64) high-effector pulse */
            if (m->avg_density >= 0.44 && m->avg_density <= 0.64) score += 35.0;
            score += m->oscillation_activity * 35.0;
            break;
    }

    m->total_score = score;
}

static void random_dna(AutomataDNA *dna) {
    dna->birth2_n2_mask       = (uint16_t)(rand_u32(512) & 0x01FC); /* bits 2..8 */
    dna->birth2_active_mask   = (uint16_t)(rand_u32(512) & 0x01FC);
    dna->birth3_n3_mask       = (uint16_t)(rand_u32(512) & 0x01FC);
    dna->survive2_n2_mask     = (uint16_t)(rand_u32(512) & 0x01FE);
    dna->survive2_active_mask = (uint16_t)(rand_u32(512) & 0x01FE);
    dna->excite_2to3_n3_mask  = (uint16_t)(rand_u32(512) & 0x01FE);
    dna->excite_2to3_act_mask = (uint16_t)(rand_u32(512) & 0x01F8);
    dna->fire_3to4_n3_mask    = (uint16_t)(rand_u32(512) & 0x01FE);
    dna->fire_3to4_n2_mask    = (uint16_t)(rand_u32(512) & 0x01FE);
    dna->sustain3_n2_mask     = (uint16_t)(rand_u32(512) & 0x003C);
    dna->refract_3to2_n2_mask = (uint16_t)(rand_u32(512) & 0x01FE);
    dna->recover_4to2_act_mask= (uint16_t)(rand_u32(512) & 0x01FE);
    dna->recover_4to1_n1_mask = (uint16_t)(rand_u32(512) & 0x007E);
    dna->mem_form_act_mask    = (uint16_t)(rand_u32(512) & 0x007E);
    dna->mem_form_n1_mask     = (uint16_t)(rand_u32(512) & 0x007E);
    dna->mem_survive_act_mask = (uint16_t)(rand_u32(512) & 0x00FE);
    dna->mem_survive_n1_mask  = (uint16_t)(rand_u32(512) & 0x007E);
    dna->protrude_thresh      = (uint8_t)(1 + rand_u32(3));
    dna->motility_bias        = (uint8_t)(1 + rand_u32(4));
    memcpy(dna->seed_pattern, BASE_SEED, sizeof(BASE_SEED));
}

static void mutate_dna(AutomataDNA *dna) {
    uint16_t *masks = &dna->birth2_n2_mask;
    int num_masks = 17;
    int edits = 1 + (int)rand_u32(3);
    for (int i = 0; i < edits; i++) {
        int idx = (int)rand_u32(num_masks);
        int bit = 1 + (int)rand_u32(8); /* flip bit 1..8 (never bit 0 so empty space doesn't explode) */
        masks[idx] ^= (uint16_t)(1u << bit);
    }
    if (rand_u32(4) == 0) {
        dna->protrude_thresh = (uint8_t)(1 + rand_u32(3));
    }
    if (rand_u32(4) == 0) {
        dna->motility_bias = (uint8_t)(1 + rand_u32(4));
    }
    /* Occasionally mutate interior 5x5 of the 7x7 seed while preserving the outer lipid ring */
    if (rand_u32(3) == 0) {
        int sx = 1 + (int)rand_u32(5);
        int sy = 1 + (int)rand_u32(5);
        dna->seed_pattern[sy][sx] = (uint8_t)(1 + rand_u32(4));
    }
}

static void crossover_dna(const AutomataDNA *a, const AutomataDNA *b, AutomataDNA *child) {
    *child = *a;
    const uint16_t *mb = &b->birth2_n2_mask;
    uint16_t *mc = &child->birth2_n2_mask;
    for (int i = 0; i < 17; i++) {
        if (rand_u32(2) == 0) mc[i] = mb[i];
    }
    if (rand_u32(2) == 0) child->protrude_thresh = b->protrude_thresh;
    if (rand_u32(2) == 0) child->motility_bias = b->motility_bias;
}

static const char *ARCHETYPE_NAMES[6] = {
    "SOLARIS_VAT_OSCILLATOR",
    "WEB_CUTTER_GLIDER",
    "TERRA_SHAPER_MEMBRANE",
    "AETHER_SYNTH_SERVER",
    "CORVUS_ORACLE_CORE",
    "SKEKSIS_BLIGHT_VAT"
};

static const char *ARCHETYPE_ROLES[6] = {
    "Harmonic bioluminescent server lake oscillator; stabilizes town power grid & charges monolith",
    "Motile permeable-membrane glider; hunts and cleaves sticky Black Goo webs with State-4 effectors",
    "Heavy lipid-shell terraforming automaton; grades steep slopes and builds foundations for cottages",
    "High-gain compute vat transducer; converts spore/ore input pulses into Aetherium crystals",
    "Low-latency prophetic compute core; feeds lookahead causal waves to Hyper-Intelligent Seer Crows",
    "Hostile Skeksis dark-spire vat genome; pulses corrosive blight waves and spawns sticky web spores"
};

int main(void) {
    printf("=== SLOPES 2: 5-STATE CELLULAR AUTOMATA & PERMEABLE-MEMBRANE ALIFE EVOLVER ===\n");
    printf("Substrate states: 0=EMPTY, 1=LIPID_MEMBRANE, 2=CORE_A, 3=SIGNAL_B, 4=EFFECTOR_OUT\n");
    printf("Vat: %dx%d (%d steps) | Free-Roaming Arena: %dx%d (%d steps)\n\n",
           VAT_W, VAT_H, VAT_TOTAL_STEPS, ARENA_W, ARENA_H, ARENA_STEPS);

    AutomataDNA best_dna[6];
    EvalMetrics best_metrics[6];

    const int POP_SIZE = 64;
    const int GENERATIONS = 45;

    for (int arch = 0; arch < 6; arch++) {
        /* Distinct deterministic seed per archetype so each explores a rich evolutionary basin */
        rng_state = 0x9E3779B97F4A7C15ULL ^ ((uint64_t)(arch + 1) * 0xBF58476D1CE4E5B9ULL);

        AutomataDNA pop[POP_SIZE];
        EvalMetrics metrics[POP_SIZE];

        for (int i = 0; i < POP_SIZE; i++) {
            random_dna(&pop[i]);
            evaluate_dna(&pop[i], arch, &metrics[i]);
        }

        for (int gen = 0; gen < GENERATIONS; gen++) {
            /* Find elite */
            int best_idx = 0;
            for (int i = 1; i < POP_SIZE; i++) {
                if (metrics[i].total_score > metrics[best_idx].total_score) {
                    best_idx = i;
                }
            }

            AutomataDNA next_pop[POP_SIZE];
            EvalMetrics next_metrics[POP_SIZE];

            /* Keep top elite */
            next_pop[0] = pop[best_idx];
            next_metrics[0] = metrics[best_idx];

            for (int i = 1; i < POP_SIZE; i++) {
                /* Tournament selection */
                int p1 = (int)rand_u32(POP_SIZE);
                int p2 = (int)rand_u32(POP_SIZE);
                int pa = (metrics[p1].total_score > metrics[p2].total_score) ? p1 : p2;

                int p3 = (int)rand_u32(POP_SIZE);
                int p4 = (int)rand_u32(POP_SIZE);
                int pb = (metrics[p3].total_score > metrics[p4].total_score) ? p3 : p4;

                AutomataDNA child;
                crossover_dna(&pop[pa], &pop[pb], &child);
                mutate_dna(&child);
                /* Ensure no two archetypes converge to identical masks */
                for (int prev = 0; prev < arch; prev++) {
                    if (child.birth2_n2_mask == best_dna[prev].birth2_n2_mask &&
                        child.excite_2to3_n3_mask == best_dna[prev].excite_2to3_n3_mask) {
                        mutate_dna(&child);
                    }
                }
                next_pop[i] = child;
                evaluate_dna(&next_pop[i], arch, &next_metrics[i]);
            }

            memcpy(pop, next_pop, sizeof(pop));
            memcpy(metrics, next_metrics, sizeof(metrics));
        }

        int best_idx = 0;
        for (int i = 1; i < POP_SIZE; i++) {
            if (metrics[i].total_score > metrics[best_idx].total_score) {
                best_idx = i;
            }
        }
        best_dna[arch] = pop[best_idx];
        best_metrics[arch] = metrics[best_idx];

        printf("[%d] %-24s | Score: %6.2f | VatDensity: %4.1f%% (min %4.1f%%, max %4.1f%%) | "
               "Osc: %4.1f%% | Entropy: %.2f bits\n",
               arch + 1, ARCHETYPE_NAMES[arch],
               best_metrics[arch].total_score,
               best_metrics[arch].avg_density * 100.0,
               best_metrics[arch].min_density * 100.0,
               best_metrics[arch].max_density * 100.0,
               best_metrics[arch].oscillation_activity * 100.0,
               best_metrics[arch].state_entropy);
        printf("    I/O HitRate: %5.1f%% | SNR: %4.2fx | Latency: %4.1f steps | "
               "RoamCoherence: %5.1f%% | Disp: %5.2f px | Spores: %2d | WebsCut: %2d\n\n",
               best_metrics[arch].io_hit_rate * 100.0,
               best_metrics[arch].io_snr,
               best_metrics[arch].io_latency,
               best_metrics[arch].roam_coherence * 100.0,
               best_metrics[arch].roam_displacement,
               best_metrics[arch].spores_harvested,
               best_metrics[arch].webs_cleaved);
    }

    /* Write evolved automata rules to /Users/williamsharkey/dev/slopes2/sim/automata_rules.json */
    FILE *fp = fopen("/Users/williamsharkey/dev/slopes2/sim/automata_rules.json", "w");
    if (!fp) {
        perror("fopen automata_rules.json");
        return 1;
    }

    fprintf(fp, "{\n  \"automata_rules\": [\n");
    for (int a = 0; a < 6; a++) {
        const AutomataDNA *d = &best_dna[a];
        const EvalMetrics *m = &best_metrics[a];
        fprintf(fp, "    {\n");
        fprintf(fp, "      \"name\": \"%s\",\n", ARCHETYPE_NAMES[a]);
        fprintf(fp, "      \"role\": \"%s\",\n", ARCHETYPE_ROLES[a]);
        fprintf(fp, "      \"genome\": {\n");
        fprintf(fp, "        \"birth2_n2_mask\": %u,\n", d->birth2_n2_mask);
        fprintf(fp, "        \"birth2_active_mask\": %u,\n", d->birth2_active_mask);
        fprintf(fp, "        \"birth3_n3_mask\": %u,\n", d->birth3_n3_mask);
        fprintf(fp, "        \"survive2_n2_mask\": %u,\n", d->survive2_n2_mask);
        fprintf(fp, "        \"survive2_active_mask\": %u,\n", d->survive2_active_mask);
        fprintf(fp, "        \"excite_2to3_n3_mask\": %u,\n", d->excite_2to3_n3_mask);
        fprintf(fp, "        \"excite_2to3_act_mask\": %u,\n", d->excite_2to3_act_mask);
        fprintf(fp, "        \"fire_3to4_n3_mask\": %u,\n", d->fire_3to4_n3_mask);
        fprintf(fp, "        \"fire_3to4_n2_mask\": %u,\n", d->fire_3to4_n2_mask);
        fprintf(fp, "        \"sustain3_n2_mask\": %u,\n", d->sustain3_n2_mask);
        fprintf(fp, "        \"refract_3to2_n2_mask\": %u,\n", d->refract_3to2_n2_mask);
        fprintf(fp, "        \"recover_4to2_act_mask\": %u,\n", d->recover_4to2_act_mask);
        fprintf(fp, "        \"recover_4to1_n1_mask\": %u,\n", d->recover_4to1_n1_mask);
        fprintf(fp, "        \"mem_form_act_mask\": %u,\n", d->mem_form_act_mask);
        fprintf(fp, "        \"mem_form_n1_mask\": %u,\n", d->mem_form_n1_mask);
        fprintf(fp, "        \"mem_survive_act_mask\": %u,\n", d->mem_survive_act_mask);
        fprintf(fp, "        \"mem_survive_n1_mask\": %u,\n", d->mem_survive_n1_mask);
        fprintf(fp, "        \"protrude_thresh\": %u,\n", d->protrude_thresh);
        fprintf(fp, "        \"motility_bias\": %u\n", d->motility_bias);
        fprintf(fp, "      },\n");
        fprintf(fp, "      \"seed_7x7\": [\n");
        for (int sy = 0; sy < 7; sy++) {
            fprintf(fp, "        [%u, %u, %u, %u, %u, %u, %u]%s\n",
                    d->seed_pattern[sy][0], d->seed_pattern[sy][1], d->seed_pattern[sy][2],
                    d->seed_pattern[sy][3], d->seed_pattern[sy][4], d->seed_pattern[sy][5],
                    d->seed_pattern[sy][6], (sy < 6) ? "," : "");
        }
        fprintf(fp, "      ],\n");
        fprintf(fp, "      \"verification_metrics\": {\n");
        fprintf(fp, "        \"fitness_score\": %.2f,\n", m->total_score);
        fprintf(fp, "        \"vat_avg_density\": %.4f,\n", m->avg_density);
        fprintf(fp, "        \"vat_min_density\": %.4f,\n", m->min_density);
        fprintf(fp, "        \"vat_max_density\": %.4f,\n", m->max_density);
        fprintf(fp, "        \"oscillation_rate\": %.4f,\n", m->oscillation_activity);
        fprintf(fp, "        \"state_entropy_bits\": %.4f,\n", m->state_entropy);
        fprintf(fp, "        \"io_hit_rate\": %.4f,\n", m->io_hit_rate);
        fprintf(fp, "        \"io_snr\": %.4f,\n", m->io_snr);
        fprintf(fp, "        \"io_latency_steps\": %.2f,\n", m->io_latency);
        fprintf(fp, "        \"roam_coherence\": %.4f,\n", m->roam_coherence);
        fprintf(fp, "        \"roam_displacement_px\": %.2f,\n", m->roam_displacement);
        fprintf(fp, "        \"roam_membrane_ratio\": %.4f,\n", m->roam_mem_ratio);
        fprintf(fp, "        \"spores_harvested\": %d,\n", m->spores_harvested);
        fprintf(fp, "        \"webs_cleaved\": %d\n", m->webs_cleaved);
        fprintf(fp, "      }\n");
        fprintf(fp, "    }%s\n", (a < 5) ? "," : "");
    }
    fprintf(fp, "  ]\n}\n");
    fclose(fp);

    printf("Saved verified DNA rule-sets to /Users/williamsharkey/dev/slopes2/sim/automata_rules.json\n");
    return 0;
}
