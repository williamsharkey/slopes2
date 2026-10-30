/*
 * sim_civilization.c
 * Slopes 2 - Multi-Screen Ecosystem & Civilization Equilibrium Simulator (20,000+ steps)
 *
 * Simulates 9 connected screens across 3 vertical layers:
 *   - Layer +1 (Sky Islands): Seer Crow Roosts, Sky Spores, Aerial Cultists
 *   - Layer  0 (Surface Slopes): Orange Cottages, Watchtowers, Compute Vats, 2x2 Color-Cycling Ferns,
 *                                Builders/Harvesters/Defenders/Children, Skeksis Spires & Black Goo Webs
 *   - Layer -1 (Crystal/Vat Caves): Aetherium Crystal Veins, Deep Server Lakes, Subterranean Goo Tendrils
 *
 * Sweeps parameter space over 20,000-step trajectories to find the Golden Equilibrium where:
 *   1. Neither Orange Civilization nor Skeksis/Black Goo instantly wipes out the other.
 *   2. Towns organically grade slopes, build Cottages, Watchtowers, and Compute Vats, and spawn
 *      5x5 / 7x7 Permeable-Membrane Automata (WEB_CUTTER_GLIDER, TERRA_SHAPER_MEMBRANE, etc.).
 *   3. Periodic Black Goo & Skeksis Cultist crises threaten children with sticky webs, creating
 *      dramatic tension that rewards Seer Crow lookahead planning and Monolith interventions.
 *
 * Compile:
 *   clang -O3 -Wall -Wextra -o sim_civilization sim_civilization.c -lm
 */

#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>
#include <math.h>

#define NUM_SCREENS 9       /* 3 layers (-1, 0, +1) x 3 horizontal screens (0, 1, 2) */
#define SIM_STEPS   20000

/* Agent roles */
#define ROLE_BUILDER   0
#define ROLE_HARVESTER 1
#define ROLE_DEFENDER  2
#define ROLE_CHILD     3

/* Membrane Automata types spawned by Compute Vats */
#define AUTO_SOLARIS_OSC  0
#define AUTO_WEB_CUTTER   1
#define AUTO_TERRA_SHAPER 2
#define AUTO_AETHER_SYNTH 3
#define AUTO_CORVUS_CORE  4

/* Crow lookahead actions */
#define CROW_ACT_CATALYZE_VAT  0
#define CROW_ACT_SEVER_WEB     1
#define CROW_ACT_RESCUE_CHILD  2
#define CROW_ACT_GUIDE_MONOLITH 3

typedef struct {
    double fern_regrowth_prob;       /* Per-step regrowth probability per screen for 2x2 ferns */
    double ore_crystal_yield;        /* Resource yield per crystal/ore harvest in caves */
    int    cottage_build_cost;       /* Fern + ore cost to grade terrain & erect a new Cottage */
    int    watchtower_build_cost;    /* Cost to build a defensive Watchtower */
    int    vat_build_cost;           /* Cost to construct a new Compute Vat / Server Lake */
    int    vat_feed_pulse_cost;      /* Resources required to inject State-3 pulse into a Vat */
    int    automata_spawn_threshold; /* Output Port State-4 pulses needed to birth a 7x7 Membrane Automaton */
    int    automata_lifespan;        /* Steps a free-roaming Membrane Automaton persists before recycling */
    int    child_birth_cooldown;     /* Steps between child births per thriving cottage */
    int    child_mature_steps;       /* Steps for an Orange Child to grow into Builder/Harvester/Defender */
    int    skeksis_raid_period;      /* Base interval between Skeksis Dark Spire surge waves */
    double black_goo_spread_prob;    /* Per-step creeping probability of Black Goo cells */
    double web_trap_prob;            /* Probability a sticky web traps a passing child/villager */
    int    web_soul_leech_steps;     /* Steps until a trapped child's soul energy is leeched by Skeksis */
    int    crow_lookahead_horizon;   /* Rollout horizon (steps) for Hyper-Intelligent Seer Crows */
    double crow_catalyst_multiplier; /* Vat compute gain when a Seer Crow drops a catalyst */
    double monolith_harmony_boost;   /* Synergy multiplier when Monolith responds to Crow guidance */
} CivParams;

typedef struct {
    int    survived_all_steps;
    double mean_orange_pop;
    int    min_orange_pop;
    int    max_orange_pop;
    double mean_cottages;
    int    peak_cottages;
    int    peak_vats;
    int    total_automata_spawned;
    int    total_webs_cleaved;
    int    total_children_trapped;
    int    total_children_rescued;
    int    total_souls_leeched;
    int    crisis_wave_count;
    double mean_goo_coverage;
    double peak_goo_coverage;
    int    crow_catalysts_dropped;
    int    monolith_interventions;
    double equilibrium_score;
} CivMetrics;

static uint64_t sim_rng = 0x3141592653589793ULL;
static inline uint64_t next_u64(void) {
    uint64_t x = sim_rng;
    x ^= x >> 12;
    x ^= x << 25;
    x ^= x >> 27;
    sim_rng = x;
    return x * 0x2545F4914F6CDD1DULL;
}
static inline double next_f64(void) {
    return (double)(next_u64() >> 11) * (1.0 / 9007199254740992.0);
}
static inline int next_int(int bound) {
    return (int)(next_u64() % (uint64_t)bound);
}

/* State of the multi-screen world during simulation */
typedef struct {
    /* Orange Civilization state across screens */
    int builders;
    int harvesters;
    int defenders;
    int children;
    int trapped_children;
    int trapped_timer;

    int cottages;
    int watchtowers;
    int compute_vats;
    int active_automata;       /* Free-roaming 5x5 / 7x7 Permeable-Membrane Automata */
    int vat_excited_accum;     /* Accumulated State-3 -> State-4 compute pulses in Vats */

    double fern_patches;       /* 2x2 color-cycling ferns available across Surface & Sky */
    double crystal_ore;        /* Aetherium crystal & ore reserves in Caves */
    double stockpile;          /* Combined town store of harvested ferns + ore */
    double aetherium_energy;   /* Synthesized high-energy compute fuel */

    /* Skeksis & Black Goo state */
    int skeksis_spires;
    int skeksis_cultists;
    int goo_cells;             /* Creeping Black Goo cells (0..240 across screens) */
    int sticky_webs;           /* Active sticky web traps (0..120) */
    double skeksis_soul_power; /* Soul energy leeched by Skeksis */

    /* Hyper-Intelligent Seer Crows & Monolith */
    int seer_crows;
    int crow_catalyst_timer;
    int monolith_aura_timer;
} WorldState;

/*
 * Fast 1-step lookahead rollout model used by Hyper-Intelligent Seer Crows
 * to evaluate candidate actions over `horizon` steps before choosing what to do!
 */
static double crow_evaluate_rollout(
    const WorldState *w0,
    const CivParams *p,
    int candidate_action
) {
    WorldState w = *w0;

    /* Apply immediate candidate crow action */
    if (candidate_action == CROW_ACT_CATALYZE_VAT) {
        w.crow_catalyst_timer = 45;
        w.vat_excited_accum += 2;
    } else if (candidate_action == CROW_ACT_SEVER_WEB) {
        int cut = (w.sticky_webs >= 4) ? 4 : w.sticky_webs;
        w.sticky_webs -= cut;
        if (w.trapped_children > 0 && cut >= 2) {
            w.trapped_children--;
            w.children++;
        }
    } else if (candidate_action == CROW_ACT_RESCUE_CHILD) {
        if (w.trapped_children > 0) {
            w.trapped_children--;
            w.children++;
            w.trapped_timer = 0;
        }
        if (w.sticky_webs > 0) w.sticky_webs--;
    } else if (candidate_action == CROW_ACT_GUIDE_MONOLITH) {
        w.monolith_aura_timer = 50;
    }

    /* Deterministic expected-value rollout over `crow_lookahead_horizon` steps */
    int H = p->crow_lookahead_horizon;
    double score = 0.0;
    for (int t = 0; t < H; t++) {
        double cat_mult = (w.crow_catalyst_timer > 0) ? p->crow_catalyst_multiplier : 1.0;
        double mono_mult = (w.monolith_aura_timer > 0) ? p->monolith_harmony_boost : 1.0;
        if (w.crow_catalyst_timer > 0) w.crow_catalyst_timer--;
        if (w.monolith_aura_timer > 0) w.monolith_aura_timer--;

        /* Expected vat compute & automata web cleaving */
        double vat_rate = w.compute_vats * 0.12 * cat_mult * mono_mult;
        double web_cleave = (w.active_automata * 0.18 + w.defenders * 0.08) * mono_mult;
        w.sticky_webs = (int)fmax(0.0, w.sticky_webs + w.goo_cells * 0.015 - web_cleave);
        w.goo_cells   = (int)fmax(4.0, w.goo_cells + w.skeksis_cultists * p->black_goo_spread_prob - web_cleave * 0.7);

        if (w.trapped_children > 0) {
            w.trapped_timer++;
            if (w.trapped_timer >= p->web_soul_leech_steps) {
                w.trapped_children--;
                w.skeksis_soul_power += 10.0;
                score -= 120.0; /* Foreseen doom: child soul leeched! */
            }
        }

        int total_pop = w.builders + w.harvesters + w.defenders + w.children;
        score += total_pop * 1.5 + w.cottages * 4.0 + w.active_automata * 5.0 + vat_rate * 8.0;
        score -= w.trapped_children * 45.0 + w.sticky_webs * 2.2 + w.goo_cells * 0.8;
    }
    return score;
}

/*
 * Run a full 20,000-step multi-screen simulation for a given parameter set.
 */
static void simulate_civilization(const CivParams *p, CivMetrics *m, int record_timeseries, FILE *ts_fp) {
    memset(m, 0, sizeof(*m));

    WorldState w;
    memset(&w, 0, sizeof(w));

    /* Initial conditions across the 9 connected screens */
    w.builders        = 4;
    w.harvesters      = 5;
    w.defenders       = 3;
    w.children        = 4;
    w.cottages        = 3;
    w.watchtowers     = 1;
    w.compute_vats    = 2;
    w.active_automata = 3;
    w.fern_patches    = 36.0;
    w.crystal_ore     = 28.0;
    w.stockpile       = 35.0;
    w.aetherium_energy= 15.0;

    w.skeksis_spires   = 2;
    w.skeksis_cultists = 4;
    w.goo_cells        = 18;
    w.sticky_webs      = 8;
    w.skeksis_soul_power = 10.0;

    w.seer_crows = 4;

    long sum_pop = 0;
    long sum_cottages = 0;
    double sum_goo = 0.0;
    m->min_orange_pop = 9999;
    m->max_orange_pop = 0;
    m->survived_all_steps = 1;

    int in_crisis = 0;
    int automata_age_acc = 0;

    for (int step = 0; step < SIM_STEPS; step++) {
        int total_pop = w.builders + w.harvesters + w.defenders + w.children;
        if (total_pop <= 0 || w.cottages <= 0) {
            m->survived_all_steps = 0;
            break;
        }

        if (total_pop < m->min_orange_pop) m->min_orange_pop = total_pop;
        if (total_pop > m->max_orange_pop) m->max_orange_pop = total_pop;
        if (w.cottages > m->peak_cottages) m->peak_cottages = w.cottages;
        if (w.compute_vats > m->peak_vats) m->peak_vats = w.compute_vats;

        sum_pop += total_pop;
        sum_cottages += w.cottages;
        double goo_cov = (double)(w.goo_cells + w.sticky_webs) / 300.0;
        if (goo_cov > 1.0) goo_cov = 1.0;
        sum_goo += goo_cov;
        if (goo_cov > m->peak_goo_coverage) m->peak_goo_coverage = goo_cov;

        /* Track dramatic crisis waves (when goo coverage exceeds 26%) */
        if (!in_crisis && goo_cov >= 0.26) {
            in_crisis = 1;
            m->crisis_wave_count++;
        } else if (in_crisis && goo_cov < 0.16) {
            in_crisis = 0;
        }

        /* 1. Regrow 2x2 color-cycling ferns on Surface/Sky and Crystal Ore in Caves */
        if (w.fern_patches < 90.0 && next_f64() < p->fern_regrowth_prob * NUM_SCREENS) {
            w.fern_patches += 2.2;
        }
        if (w.crystal_ore < 80.0 && next_f64() < 0.35) {
            w.crystal_ore += p->ore_crystal_yield * 0.45;
        }

        /* 2. Hyper-Intelligent Seer Crows run lookahead rollout every 15 steps */
        if (step % 15 == 0 && w.seer_crows > 0) {
            int best_act = CROW_ACT_CATALYZE_VAT;
            double best_val = -1e18;
            for (int act = 0; act < 4; act++) {
                double val = crow_evaluate_rollout(&w, p, act);
                if (val > best_val) {
                    best_val = val;
                    best_act = act;
                }
            }
            if (best_act == CROW_ACT_CATALYZE_VAT) {
                w.crow_catalyst_timer = 40;
                w.vat_excited_accum += 2;
                m->crow_catalysts_dropped++;
            } else if (best_act == CROW_ACT_SEVER_WEB) {
                int cut = (w.sticky_webs >= 3) ? 3 : w.sticky_webs;
                w.sticky_webs -= cut;
                m->total_webs_cleaved += cut;
            } else if (best_act == CROW_ACT_RESCUE_CHILD && w.trapped_children > 0) {
                w.trapped_children--;
                w.children++;
                w.trapped_timer = 0;
                m->total_children_rescued++;
            } else if (best_act == CROW_ACT_GUIDE_MONOLITH) {
                w.monolith_aura_timer = 45;
                m->monolith_interventions++;
            }
        }

        if (w.crow_catalyst_timer > 0) w.crow_catalyst_timer--;
        if (w.monolith_aura_timer > 0) w.monolith_aura_timer--;

        double cat_mult  = (w.crow_catalyst_timer > 0) ? p->crow_catalyst_multiplier : 1.0;
        double mono_mult = (w.monolith_aura_timer > 0) ? p->monolith_harmony_boost : 1.0;

        /* 3. Orange Harvesters gather 2x2 ferns & cave crystals and feed Compute Vats */
        if (step % 6 == 0 && w.harvesters > 0) {
            double gathered = 0.0;
            double fern_take = fmin(w.fern_patches, w.harvesters * 0.55);
            w.fern_patches -= fern_take;
            gathered += fern_take;

            double ore_take = fmin(w.crystal_ore, w.harvesters * 0.35 * p->ore_crystal_yield);
            w.crystal_ore -= ore_take * 0.5;
            gathered += ore_take;

            w.stockpile += gathered;
        }

        /* 4. Feed Compute Vats -> State-3 Input Port -> State-4 Output Port -> Spawn Membrane Automata */
        if (step % 8 == 0 && w.compute_vats > 0 && w.stockpile >= p->vat_feed_pulse_cost) {
            int pulses = (int)fmin((double)w.compute_vats, floor(w.stockpile / p->vat_feed_pulse_cost));
            if (pulses > 0) {
                w.stockpile -= pulses * p->vat_feed_pulse_cost * 0.65;
                int gain = (int)ceil(pulses * cat_mult * mono_mult);
                w.vat_excited_accum += gain;
                w.aetherium_energy += gain * 1.2;
            }
        }

        while (w.vat_excited_accum >= p->automata_spawn_threshold && w.active_automata < 14) {
            w.vat_excited_accum -= p->automata_spawn_threshold;
            w.active_automata++;
            m->total_automata_spawned++;
        }

        /* Free-Roaming Permeable-Membrane Automata cleave webs, harvest spores, and grade slopes */
        if (step % 8 == 0 && w.active_automata > 0) {
            int web_cut = (int)ceil(w.active_automata * 0.28 * mono_mult);
            if (web_cut > w.sticky_webs) web_cut = w.sticky_webs;
            w.sticky_webs -= web_cut;
            m->total_webs_cleaved += web_cut;

            int goo_clear = (int)ceil(w.active_automata * 0.22 * mono_mult);
            if (goo_clear > w.goo_cells - 8) goo_clear = (w.goo_cells > 8) ? (w.goo_cells - 8) : 0;
            w.goo_cells -= goo_clear;

            /* Terra-shaper membrane automata assist builders */
            w.stockpile += w.active_automata * 0.18;
        }

        automata_age_acc++;
        if (automata_age_acc >= p->automata_lifespan) {
            automata_age_acc = 0;
            if (w.active_automata > 2) w.active_automata--;
        }

        /* 5. Orange Builders grade slopes and construct Cottages, Watchtowers, and Compute Vats */
        if (step % 25 == 0 && w.builders > 0) {
            if (w.compute_vats < 6 && w.stockpile >= p->vat_build_cost && w.cottages >= w.compute_vats) {
                w.stockpile -= p->vat_build_cost;
                w.compute_vats++;
            } else if (w.cottages < 10 && w.stockpile >= p->cottage_build_cost && total_pop >= w.cottages * 3) {
                w.stockpile -= p->cottage_build_cost;
                w.cottages++;
            } else if (w.watchtowers < 5 && w.stockpile >= p->watchtower_build_cost && w.goo_cells > 25) {
                w.stockpile -= p->watchtower_build_cost;
                w.watchtowers++;
            }
        }

        /* 6. Orange Children birth & maturation into Builders / Harvesters / Defenders */
        if (step % p->child_birth_cooldown == 0 && w.cottages > 0 && total_pop < w.cottages * 4 + 4) {
            if (w.stockpile >= 8.0) {
                w.stockpile -= 6.0;
                w.children++;
            }
        }
        if (step % p->child_mature_steps == 0 && w.children > 1) {
            w.children--;
            int r = next_int(3);
            if (r == 0 || w.harvesters < 3) w.harvesters++;
            else if (r == 1 || w.builders < 2) w.builders++;
            else if (w.defenders < 8) w.defenders++;
            else w.harvesters++;
        }

        /* 7. Evil Skeksis Bird-Cultists & Creeping Black Goo Webs */
        if (step > 0 && step % p->skeksis_raid_period == 0) {
            /* Skeksis Dark Spire blight surge! */
            int surge = 3 + (int)(w.skeksis_soul_power / 22.0) + (step / 6000);
            if (surge > 7) surge = 7;
            w.skeksis_cultists = (w.skeksis_cultists + surge <= 14) ? (w.skeksis_cultists + surge) : 14;
            w.goo_cells += 34 + surge * 5;
            w.sticky_webs += 16 + surge * 3;
        }

        /* Creeping Black Goo cellular propagation */
        if (next_f64() < p->black_goo_spread_prob * (1.0 + w.skeksis_cultists * 0.14)) {
            if (w.goo_cells < 175) w.goo_cells += 3;
            if (w.sticky_webs < 90 && next_f64() < 0.68) w.sticky_webs += 2;
        }

        /* Sticky Webs trap children or villagers on the slopes */
        if (w.sticky_webs >= 6 && w.children > 0 && next_f64() < p->web_trap_prob * (w.sticky_webs / 35.0)) {
            w.children--;
            w.trapped_children++;
            m->total_children_trapped++;
        }

        /* Orange Defenders + Watchtowers + Monolith fight back against Cultists & Goo */
        if (step % 16 == 0) {
            int def_power = w.defenders + w.watchtowers * 2 + ((w.monolith_aura_timer > 0) ? 4 : 0);
            if (w.trapped_children > 0 && def_power >= 3 && next_f64() < 0.55 * mono_mult) {
                w.trapped_children--;
                w.children++;
                w.trapped_timer = 0;
                m->total_children_rescued++;
            }
            if (w.sticky_webs > 0) {
                int cut = (def_power / 3);
                if (cut > w.sticky_webs) cut = w.sticky_webs;
                w.sticky_webs -= cut;
                m->total_webs_cleaved += cut;
            }
            if (w.goo_cells > 8) {
                int burn = (def_power / 3);
                if (burn > w.goo_cells - 8) burn = w.goo_cells - 8;
                w.goo_cells -= burn;
            }
            if (w.skeksis_cultists > 2 && def_power >= 5 && next_f64() < 0.25) {
                w.skeksis_cultists--;
            }
        }

        /* Soul leeching if a child stays trapped too long in Black Goo webs */
        if (w.trapped_children > 0) {
            w.trapped_timer++;
            if (w.trapped_timer >= p->web_soul_leech_steps) {
                w.trapped_timer = 0;
                w.trapped_children--;
                w.skeksis_soul_power += 12.0;
                m->total_souls_leeched++;
                /* Leeching a soul spawns a new Black Goo surge */
                w.goo_cells += 6;
                w.sticky_webs += 3;
            }
        } else {
            w.trapped_timer = 0;
        }

        /* Extreme goo blight can damage peripheral cottages if unchecked */
        if (w.goo_cells > 135 && w.cottages > 2 && step % 80 == 0) {
            w.cottages--;
            w.goo_cells -= 20;
        }

        if (record_timeseries && ts_fp && (step % 1000 == 0 || step == SIM_STEPS - 1)) {
            fprintf(ts_fp, "      {\"step\": %d, \"orange_pop\": %d, \"cottages\": %d, \"vats\": %d, "
                           "\"automata\": %d, \"goo_cells\": %d, \"sticky_webs\": %d, \"crows\": %d}%s\n",
                    step, total_pop, w.cottages, w.compute_vats, w.active_automata,
                    w.goo_cells, w.sticky_webs, w.seer_crows,
                    (step == SIM_STEPS - 1) ? "" : ",");
        }
    }

    m->mean_orange_pop  = (double)sum_pop / (double)SIM_STEPS;
    m->mean_cottages    = (double)sum_cottages / (double)SIM_STEPS;
    m->mean_goo_coverage = sum_goo / (double)SIM_STEPS;

    /*
     * Score the parameter set for Dynamic Dramatic Equilibrium:
     *   - Must survive all 20,000 steps (m->survived_all_steps == 1)
     *   - Mean population in sweet spot [16..34], min_pop >= 8, max_pop <= 52
     *   - Organic town growth to 6..10 cottages and 4..6 compute vats
     *   - Active dramatic tension: mean_goo_coverage in [0.10..0.28], peak_goo in [0.30..0.68],
     *     4..12 crisis waves over 20,000 steps
     *   - High rescue ratio (> 75% of trapped children rescued by Crows / Automata / Defenders)
     */
    if (!m->survived_all_steps) {
        m->equilibrium_score = -500.0;
        return;
    }

    double score = 100.0;
    score -= fabs(m->mean_orange_pop - 24.0) * 2.5;
    if (m->min_orange_pop < 8) score -= (8 - m->min_orange_pop) * 10.0;
    score -= fabs(m->peak_cottages - 8.0) * 6.0;
    score -= fabs(m->peak_vats - 5.0) * 6.0;
    score -= fabs(m->mean_goo_coverage - 0.17) * 140.0;
    score -= fabs(m->peak_goo_coverage - 0.44) * 80.0;

    if (m->crisis_wave_count >= 4 && m->crisis_wave_count <= 14) {
        score += 35.0;
    } else {
        score -= fabs(m->crisis_wave_count - 8.0) * 5.0;
    }

    if (m->total_children_trapped > 0) {
        double rescue_rate = (double)m->total_children_rescued / (double)m->total_children_trapped;
        score += rescue_rate * 45.0;
    }
    score += fmin(m->total_automata_spawned, 60) * 0.6;
    score += fmin(m->total_webs_cleaved, 800) * 0.04;

    m->equilibrium_score = score;
}

int main(void) {
    printf("=== SLOPES 2: MULTI-SCREEN CIVILIZATION EQUILIBRIUM SIMULATOR (20,000 STEPS) ===\n");
    printf("Sweeping parameter space across 9 connected screens (Surface, Crystal/Vat Caves, Sky Islands)...\n\n");

    CivParams best_p;
    CivMetrics best_m;
    best_m.equilibrium_score = -1e9;
    int best_t = 0;

    const int SWEEP_TRIALS = 240;
    for (int t = 0; t < SWEEP_TRIALS; t++) {
        sim_rng = 0xCAFEBABE12345678ULL ^ ((uint64_t)(t + 1) * 0x9E3779B97F4A7C15ULL);

        CivParams cand;
        cand.fern_regrowth_prob       = 0.035 + (t % 7) * 0.008;
        cand.ore_crystal_yield        = 1.10  + ((t / 7) % 5) * 0.22;
        cand.cottage_build_cost       = 26    + (t % 5) * 5;
        cand.watchtower_build_cost    = 20    + (t % 4) * 4;
        cand.vat_build_cost           = 32    + (t % 5) * 6;
        cand.vat_feed_pulse_cost      = 6     + (t % 4) * 2;
        cand.automata_spawn_threshold = 5     + (t % 4) * 2;
        cand.automata_lifespan        = 320   + (t % 5) * 70;
        cand.child_birth_cooldown     = 48    + (t % 6) * 10;
        cand.child_mature_steps       = 110   + (t % 4) * 25;
        cand.skeksis_raid_period      = 340   + (t % 6) * 45;
        cand.black_goo_spread_prob    = 0.065 + ((t / 3) % 6) * 0.015;
        cand.web_trap_prob            = 0.040 + (t % 5) * 0.012;
        cand.web_soul_leech_steps     = 38    + (t % 5) * 8;
        cand.crow_lookahead_horizon   = 45    + (t % 4) * 15;
        cand.crow_catalyst_multiplier = 1.45  + (t % 4) * 0.20;
        cand.monolith_harmony_boost   = 1.35  + (t % 4) * 0.15;

        CivMetrics cm;
        simulate_civilization(&cand, &cm, 0, NULL);

        if (cm.equilibrium_score > best_m.equilibrium_score) {
            best_m = cm;
            best_p = cand;
            best_t = t;
        }
    }

    printf("Best Equilibrium Parameter Set Found (Score: %.2f over %d steps):\n",
           best_m.equilibrium_score, SIM_STEPS);
    printf("  Survived All Steps : %s\n", best_m.survived_all_steps ? "YES (100%)" : "NO");
    printf("  Orange Population  : mean %.1f (min %d, max %d)\n",
           best_m.mean_orange_pop, best_m.min_orange_pop, best_m.max_orange_pop);
    printf("  Town Growth        : mean %.1f cottages (peak %d cottages, %d compute vats)\n",
           best_m.mean_cottages, best_m.peak_cottages, best_m.peak_vats);
    printf("  Membrane Automata  : %d spawned | %d sticky webs cleaved\n",
           best_m.total_automata_spawned, best_m.total_webs_cleaved);
    printf("  Skeksis & Goo Crises: %d dramatic crisis waves | mean goo %.1f%% (peak %.1f%%)\n",
           best_m.crisis_wave_count, best_m.mean_goo_coverage * 100.0, best_m.peak_goo_coverage * 100.0);
    printf("  Children & Crows   : %d trapped, %d rescued (%.1f%%), %d souls leeched | %d Crow catalysts, %d Monolith guidance\n\n",
           best_m.total_children_trapped, best_m.total_children_rescued,
           best_m.total_children_trapped > 0 ? (100.0 * best_m.total_children_rescued / best_m.total_children_trapped) : 100.0,
           best_m.total_souls_leeched, best_m.crow_catalysts_dropped, best_m.monolith_interventions);

    /*
     * Combine /Users/williamsharkey/dev/slopes2/sim/automata_rules.json and the tuned
     * civilization parameters + 20,000-step trajectory into
     * /Users/williamsharkey/dev/slopes2/sim/discovered_dna.json
     */
    FILE *ar_fp = fopen("/Users/williamsharkey/dev/slopes2/sim/automata_rules.json", "r");
    char *ar_buf = NULL;
    long ar_len = 0;
    if (ar_fp) {
        fseek(ar_fp, 0, SEEK_END);
        ar_len = ftell(ar_fp);
        fseek(ar_fp, 0, SEEK_SET);
        ar_buf = (char *)malloc((size_t)ar_len + 1);
        if (ar_buf) {
            size_t nread = fread(ar_buf, 1, (size_t)ar_len, ar_fp);
            ar_buf[nread] = '\0';
        }
        fclose(ar_fp);
    }

    FILE *out = fopen("/Users/williamsharkey/dev/slopes2/sim/discovered_dna.json", "w");
    if (!out) {
        perror("fopen discovered_dna.json");
        free(ar_buf);
        return 1;
    }

    fprintf(out, "{\n");
    fprintf(out, "  \"engine\": \"Slopes 2 - 5-State Cellular Automata & Multi-Screen Alife Civilization Engine\",\n");
    fprintf(out, "  \"states\": {\n");
    fprintf(out, "    \"0\": \"EMPTY_FLUID\",\n");
    fprintf(out, "    \"1\": \"LIPID_MEMBRANE_SHELL\",\n");
    fprintf(out, "    \"2\": \"ACTIVE_CORE_COMPUTE_A\",\n");
    fprintf(out, "    \"3\": \"EXCITED_SIGNAL_COMPUTE_B\",\n");
    fprintf(out, "    \"4\": \"OUTPUT_EFFECTOR_STATE\"\n");
    fprintf(out, "  },\n");

    if (ar_buf) {
        /* Extract array inside automata_rules.json */
        char *start = strstr(ar_buf, "\"automata_rules\":");
        if (start) {
            /* Strip trailing }\n */
            size_t slen = strlen(start);
            while (slen > 0 && (start[slen - 1] == '\n' || start[slen - 1] == ' ' || start[slen - 1] == '}')) {
                slen--;
            }
            fprintf(out, "  %.*s,\n", (int)slen, start);
        }
        free(ar_buf);
    }

    fprintf(out, "  \"civilization_equilibrium_params\": {\n");
    fprintf(out, "    \"fern_regrowth_prob\": %.4f,\n", best_p.fern_regrowth_prob);
    fprintf(out, "    \"ore_crystal_yield\": %.4f,\n", best_p.ore_crystal_yield);
    fprintf(out, "    \"cottage_build_cost\": %d,\n", best_p.cottage_build_cost);
    fprintf(out, "    \"watchtower_build_cost\": %d,\n", best_p.watchtower_build_cost);
    fprintf(out, "    \"vat_build_cost\": %d,\n", best_p.vat_build_cost);
    fprintf(out, "    \"vat_feed_pulse_cost\": %d,\n", best_p.vat_feed_pulse_cost);
    fprintf(out, "    \"automata_spawn_threshold\": %d,\n", best_p.automata_spawn_threshold);
    fprintf(out, "    \"automata_lifespan_steps\": %d,\n", best_p.automata_lifespan);
    fprintf(out, "    \"child_birth_cooldown_steps\": %d,\n", best_p.child_birth_cooldown);
    fprintf(out, "    \"child_mature_steps\": %d,\n", best_p.child_mature_steps);
    fprintf(out, "    \"skeksis_raid_period_steps\": %d,\n", best_p.skeksis_raid_period);
    fprintf(out, "    \"black_goo_spread_prob\": %.4f,\n", best_p.black_goo_spread_prob);
    fprintf(out, "    \"web_trap_prob\": %.4f,\n", best_p.web_trap_prob);
    fprintf(out, "    \"web_soul_leech_steps\": %d,\n", best_p.web_soul_leech_steps);
    fprintf(out, "    \"crow_lookahead_horizon_steps\": %d,\n", best_p.crow_lookahead_horizon);
    fprintf(out, "    \"crow_catalyst_multiplier\": %.2f,\n", best_p.crow_catalyst_multiplier);
    fprintf(out, "    \"monolith_harmony_boost\": %.2f\n", best_p.monolith_harmony_boost);
    fprintf(out, "  },\n");

    fprintf(out, "  \"civilization_simulation_summary\": {\n");
    fprintf(out, "    \"total_steps_simulated\": %d,\n", SIM_STEPS);
    fprintf(out, "    \"connected_screens\": %d,\n", NUM_SCREENS);
    fprintf(out, "    \"equilibrium_score\": %.2f,\n", best_m.equilibrium_score);
    fprintf(out, "    \"survived_all_steps\": true,\n");
    fprintf(out, "    \"mean_orange_population\": %.2f,\n", best_m.mean_orange_pop);
    fprintf(out, "    \"min_orange_population\": %d,\n", best_m.min_orange_pop);
    fprintf(out, "    \"max_orange_population\": %d,\n", best_m.max_orange_pop);
    fprintf(out, "    \"mean_cottages\": %.2f,\n", best_m.mean_cottages);
    fprintf(out, "    \"peak_cottages\": %d,\n", best_m.peak_cottages);
    fprintf(out, "    \"peak_compute_vats\": %d,\n", best_m.peak_vats);
    fprintf(out, "    \"total_membrane_automata_spawned\": %d,\n", best_m.total_automata_spawned);
    fprintf(out, "    \"total_sticky_webs_cleaved\": %d,\n", best_m.total_webs_cleaved);
    fprintf(out, "    \"crisis_wave_count\": %d,\n", best_m.crisis_wave_count);
    fprintf(out, "    \"mean_goo_coverage_ratio\": %.4f,\n", best_m.mean_goo_coverage);
    fprintf(out, "    \"peak_goo_coverage_ratio\": %.4f,\n", best_m.peak_goo_coverage);
    fprintf(out, "    \"children_trapped\": %d,\n", best_m.total_children_trapped);
    fprintf(out, "    \"children_rescued\": %d,\n", best_m.total_children_rescued);
    fprintf(out, "    \"souls_leeched\": %d,\n", best_m.total_souls_leeched);
    fprintf(out, "    \"crow_catalysts_dropped\": %d,\n", best_m.crow_catalysts_dropped);
    fprintf(out, "    \"monolith_interventions\": %d,\n", best_m.monolith_interventions);
    fprintf(out, "    \"timeseries_1000_step_snapshots\": [\n");

    sim_rng = 0xCAFEBABE12345678ULL ^ ((uint64_t)(best_t + 1) * 0x9E3779B97F4A7C15ULL);
    CivMetrics dummy;
    simulate_civilization(&best_p, &dummy, 1, out);

    fprintf(out, "    ]\n");
    fprintf(out, "  }\n");
    fprintf(out, "}\n");
    fclose(out);

    printf("Saved complete DNA rules + civilization equilibrium parameters to /Users/williamsharkey/dev/slopes2/sim/discovered_dna.json\n");
    return 0;
}
