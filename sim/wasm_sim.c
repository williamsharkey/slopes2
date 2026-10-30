/*
 * wasm_sim.c
 * Slopes 2 - C-to-WASM Evolutionary Simulator, Architectural Optimizer & WFC City Engine
 *
 * Compiles to BOTH:
 *   1. Native CLI binary (-DWASM_NATIVE_MAIN):
 *      /usr/bin/clang -O3 -Wall -Wextra -DWASM_NATIVE_MAIN -o sim/wasm_sim_native sim/wasm_sim.c -lm
 *   2. Freestanding WebAssembly module (--target=wasm32 -nostdlib):
 *      /opt/homebrew/Cellar/emscripten/5.0.7/libexec/llvm/bin/clang --target=wasm32 -O3 -nostdlib \
 *        -Wl,--no-entry -Wl,--export-all -o sim/wasm_sim.wasm sim/wasm_sim.c
 */

#ifdef WASM_NATIVE_MAIN
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>
#include <math.h>
#include <time.h>
#define WASM_EXPORT
#else
typedef unsigned char      uint8_t;
typedef signed char        int8_t;
typedef unsigned short     uint16_t;
typedef signed short       int16_t;
typedef unsigned int       uint32_t;
typedef signed int         int32_t;
typedef unsigned long long uint64_t;
typedef signed long long   int64_t;
typedef unsigned long      size_t;

#define WASM_EXPORT __attribute__((visibility("default"), used))

/* Provide freestanding memcpy/memset so LLVM -O3 loop idiom recognition never imports env symbols */
void* memcpy(void* dst, const void* src, size_t n) {
    uint8_t* d = (uint8_t*)dst;
    const uint8_t* s = (const uint8_t*)src;
    for (size_t i = 0; i < n; i++) {
        d[i] = s[i];
    }
    return dst;
}

void* memset(void* dst, int c, size_t n) {
    uint8_t* d = (uint8_t*)dst;
    uint8_t v = (uint8_t)c;
    for (size_t i = 0; i < n; i++) {
        d[i] = v;
    }
    return dst;
}
#endif

/* ============================================================================
 * CONSTANTS & ENUMS
 * ============================================================================ */

#define TERRAIN_BUF_SIZE   120
#define BLUEPRINT_W        15
#define BLUEPRINT_H        12
#define BLUEPRINT_BUF_SIZE (BLUEPRINT_W * BLUEPRINT_H) /* 180 */
#define WFC_MAX_W          35
#define WFC_MAX_H          28
#define WFC_BUF_SIZE       (WFC_MAX_W * WFC_MAX_H)     /* 980 */
#define RESULT_BUF_SIZE    16

/* Factions */
#define FACTION_HUMAN_ORANGE    0
#define FACTION_CORVUS_SKY      1
#define FACTION_CERVUS_MYCELIAL 2
#define FACTION_SKEKSIS_GOO     3

/* Blueprint & WFC Tile Codes */
#define TILE_EMPTY              0
#define TILE_FOUNDATION_STRUT   1
#define TILE_MASONRY_WALL       2
#define TILE_ARCH_SUPPORT       3
#define TILE_LUMINOUS_WINDOW    4
#define TILE_ROOF_DOME_SPIRE    5
#define TILE_CONDUIT_PORT       6
#define TILE_COMPUTE_CORE_CELL  7
#define TILE_HARVESTER_ARRAY    8
#define NUM_TILE_TYPES          9

/* Evolved Craft / Item Archetypes */
#define CRAFT_EVOLVED_FLORA_SEED       0
#define CRAFT_ORNITHOPTER_SKY_SKIFF    1
#define CRAFT_SUBTERRANEAN_MOLE_DRILL  2
#define CRAFT_AMPHIBIOUS_WAVE_STRIDER  3
#define CRAFT_AETHER_LEVITATION_BARGE  4
#define CRAFT_MYCELIAL_SPORE_GLIDER    5
#define CRAFT_CHRONOS_TIME_CRYSTAL     6
#define CRAFT_DARK_CRYSTAL_STRIDER     7

/* Conduit Types */
#define CONDUIT_COPPER_PIPE     0
#define CONDUIT_AETHER_LASER    1
#define CONDUIT_MYCELIAL_HYPHAE 2
#define CONDUIT_DARK_VEIN       3

/* ============================================================================
 * SHARED STATIC BUFFERS IN WASM LINEAR MEMORY
 * ============================================================================ */

static uint8_t terrain_buf[TERRAIN_BUF_SIZE];
static uint8_t blueprint_buf[BLUEPRINT_BUF_SIZE];
static uint8_t wfc_buf[WFC_BUF_SIZE];
static int32_t result_buf[RESULT_BUF_SIZE];

WASM_EXPORT uint8_t* wasm_get_terrain_buf(void) {
    return terrain_buf;
}

WASM_EXPORT uint8_t* wasm_get_blueprint_buf(void) {
    return blueprint_buf;
}

WASM_EXPORT uint8_t* wasm_get_wfc_buf(void) {
    return wfc_buf;
}

WASM_EXPORT int32_t* wasm_get_result_buf(void) {
    return result_buf;
}

/* ============================================================================
 * FAST PRNG & INTEGER MATH HELPERS (ZERO LIBC DEPENDENCY)
 * ============================================================================ */

typedef struct {
    uint64_t state;
} Rng64;

static inline void rng_seed(Rng64* rng, uint32_t seed) {
    uint64_t s = ((uint64_t)seed << 32) ^ (uint64_t)seed ^ 0x9E3779B97F4A7C15ULL;
    if (s == 0) s = 0x2545F4914F6CDD1DULL;
    rng->state = s;
    /* Warm up */
    rng->state ^= rng->state >> 12;
    rng->state ^= rng->state << 25;
    rng->state ^= rng->state >> 27;
}

static inline uint32_t rng_next_u32(Rng64* rng) {
    uint64_t x = rng->state;
    x ^= x >> 12;
    x ^= x << 25;
    x ^= x >> 27;
    rng->state = x;
    return (uint32_t)((x * 0x2545F4914F6CDD1DULL) >> 32);
}

static inline int rng_range(Rng64* rng, int bound) {
    if (bound <= 1) return 0;
    return (int)(rng_next_u32(rng) % (uint32_t)bound);
}

static inline int clamp_i32(int v, int lo, int hi) {
    if (v < lo) return lo;
    if (v > hi) return hi;
    return v;
}

static inline int abs_i32(int v) {
    return v < 0 ? -v : v;
}

static inline int popcount_u32(uint32_t x) {
    int c = 0;
    while (x) {
        x &= (x - 1);
        c++;
    }
    return c;
}

/* Fast integer triangle wave (-16 .. +16) with period 64 */
static inline int tri_wave64(int phase) {
    int p = phase & 63;
    if (p < 16) return p;
    if (p < 48) return 32 - p;
    return p - 64;
}

/* ============================================================================
 * 1. SCIENTIST LAB EVOLUTIONARY EXPERIMENT ENGINE
 * ============================================================================ */

/*
 * Genome layout (32-bit unsigned):
 *   bits  0..3  (g0): root_chassis       (0..15) - foundation anchor / hull frame
 *   bits  4..7  (g1): branching_wing     (0..15) - aerodynamic / vascular branching
 *   bits  8..11 (g2): spore_thrust       (0..15) - propulsion / dispersal impulse
 *   bits 12..15 (g3): color_freq         (0..15) - harmonic bioluminescent frequency
 *   bits 16..19 (g4): symbiosis_armor    (0..15) - membrane resilience / symbiosis
 *   bits 20..23 (g5): conduit_conductance(0..15) - energy pipe / laser / hyphae flux
 *   bits 24..27 (g6): craft_archetype    (0..15) - specialized craft/organism morphology
 *   bits 28..31 (g7): topology_affinity  (0..15) - slope / cliff / sky / cave adaptation
 */
static int evaluate_genome_24steps(
    uint32_t dna,
    int faction_id,
    int lab_type,
    int local_slope,
    int local_moisture,
    int energy_budget,
    int* out_yield_gain,
    int* out_time_dilation,
    int* out_resonance
) {
    int g_root    = (int)((dna >>  0) & 0xF);
    int g_branch  = (int)((dna >>  4) & 0xF);
    int g_thrust  = (int)((dna >>  8) & 0xF);
    int g_freq    = (int)((dna >> 12) & 0xF);
    int g_armor   = (int)((dna >> 16) & 0xF);
    int g_conduit = (int)((dna >> 20) & 0xF);
    int g_arch    = (int)((dna >> 24) & 0xF);
    int g_topo    = (int)((dna >> 28) & 0xF);

    /* State variables evolved over 24 life/kinematic/energy steps */
    int energy     = clamp_i32(energy_budget, 20, 500) * 4;
    int integrity  = 120 + g_root * 8 + g_armor * 10;
    int flux       = 40 + g_conduit * 7 + g_branch * 5;
    int altitude   = (faction_id == FACTION_CORVUS_SKY) ? 180 : 60;
    int harmony    = 50 + g_freq * 6;
    int phase      = (g_freq * 5 + lab_type * 11) & 63;
    int total_work = 0;
    int resonance_acc = 0;

    int slope_abs  = clamp_i32(abs_i32(local_slope), 0, 100);
    int moist      = clamp_i32(local_moisture, 0, 100);

    for (int step = 0; step < 24; step++) {
        int env_wave = tri_wave64(phase + step * (g_freq + 1));
        int terrain_stress = (slope_abs * (18 - g_topo)) >> 3;
        if (terrain_stress < 0) terrain_stress = 0;

        /* Faction-specific physics & ecology step */
        if (faction_id == FACTION_HUMAN_ORANGE) {
            /* Solar terrace harmony + copper pipe efficiency + protective dome shielding */
            int solar_capture = (16 - (slope_abs >> 3)) * (g_branch + 4) + (env_wave > 0 ? env_wave * 3 : 0);
            int pipe_transfer = (g_conduit * flux) >> 4;
            int dome_shield   = (g_armor * 6 + g_root * 5) - terrain_stress;
            energy    += solar_capture + (pipe_transfer >> 1) - (g_thrust * 3);
            integrity += (dome_shield >> 2) - (step > 12 ? 4 : 2);
            flux      += ((g_conduit + g_freq) * 3 - (flux >> 3));
            harmony   += (abs_i32(g_root - g_branch) <= 3) ? 14 : 4;
            resonance_acc += (g_conduit * g_freq + lab_type * 5);
        } else if (faction_id == FACTION_CORVUS_SKY) {
            /* Aerodynamic lift + prophetic lookahead + wind-harmonic laser conduits */
            int lift = g_branch * 9 + g_thrust * 8 - (g_root * 4) + env_wave * 2;
            altitude = clamp_i32(altitude + (lift >> 2) - 10, 10, 400);
            int laser_coherence = (g_conduit * 8 + g_freq * 9) - abs_i32(g_branch - g_thrust) * 4;
            int wind_harvest = (altitude * (g_branch + 2)) >> 5;
            energy    += wind_harvest + (laser_coherence >> 2) - (g_armor * 3);
            integrity += (altitude > 120 ? 8 : -5) + (g_armor * 2) - (terrain_stress >> 1);
            flux      += (laser_coherence >> 2);
            harmony   += (altitude > 160 && g_freq >= 9) ? 16 : 5;
            resonance_acc += (altitude >> 3) + g_freq * 8;
        } else if (faction_id == FACTION_CERVUS_MYCELIAL) {
            /* Deep mycelial root conductivity + bioluminescent spore dispersal + forest symbiosis */
            int root_uptake = ((g_root * 9 + g_conduit * 8) * (moist + 30)) >> 6;
            int spore_cloud = (g_thrust * 6 + g_branch * 7 + (env_wave + 16));
            int symbiosis   = (g_armor * 7 + g_freq * 6) - abs_i32(g_root - g_conduit) * 3;
            energy    += root_uptake + (symbiosis >> 1) - (slope_abs >> 2);
            integrity += (g_root * 3 + (moist >> 3)) - 6;
            flux      += (spore_cloud >> 2) + g_conduit * 2;
            harmony   += (g_freq >= 6 && g_root >= 9) ? 15 : 6;
            resonance_acc += (root_uptake + g_freq * 7);
        } else {
            /* FACTION_SKEKSIS_GOO: Sticky web tensile capture + dark-crystal spire resonance + tunneling */
            int web_tension   = g_armor * 8 + g_branch * 7 + (slope_abs >> 2);
            int spire_drain   = g_conduit * 10 + g_freq * 8 + (env_wave < 0 ? -env_wave * 4 : 0);
            int burrow_thrust = g_thrust * 7 + g_root * 6;
            energy    += (spire_drain >> 1) + (web_tension >> 2) - 12;
            integrity += (g_armor * 4 + (burrow_thrust >> 3)) - 7;
            flux      += (spire_drain >> 2) + (web_tension >> 3);
            harmony   += (g_conduit >= 10 && g_armor >= 9) ? 15 : 5;
            resonance_acc += (spire_drain >> 1) + g_arch * 5;
        }

        /* Lab specialization synergy */
        int lab_synergy = 0;
        if ((lab_type & 3) == 0) {
            /* Bio-Botanical / Flora & Spore Lab */
            lab_synergy = (g_root * 3 + g_branch * 2 + g_freq * 2) - g_arch * 2;
        } else if ((lab_type & 3) == 1) {
            /* Aerodynamic / Propulsion Craft Foundry */
            lab_synergy = (g_branch * 3 + g_thrust * 3 + g_arch * 2) - g_root * 2;
        } else if ((lab_type & 3) == 2) {
            /* Subterranean / Amphibious Chassis & Conduit Reactor */
            lab_synergy = (g_conduit * 3 + g_armor * 3 + g_root * 2) - g_freq;
        } else {
            /* Chronos / Transdimensional Temporal Vat */
            lab_synergy = (g_freq * 4 + g_conduit * 3 + g_topo * 2) - g_thrust;
        }

        energy = clamp_i32(energy + (lab_synergy >> 1), 0, 8000);
        integrity = clamp_i32(integrity, 0, 2000);
        flux = clamp_i32(flux, 0, 4000);

        if (energy <= 0 || integrity <= 0) {
            /* Organism/craft collapsed mid-cycle */
            total_work -= (24 - step) * 40;
            break;
        }

        total_work += (energy >> 3) + (integrity >> 2) + (flux >> 2) + harmony + lab_synergy * 3;
        phase = (phase + g_freq + 3) & 63;
    }

    /* Compute final normalized fitness (0..10000) without premature saturation */
    int raw_score = ((total_work >> 2) + (energy >> 1) + integrity + (flux >> 1) + harmony * 2);
    /* Penalize metabolic overload if gene sum exceeds 84 */
    int gene_sum = g_root + g_branch + g_thrust + g_freq + g_armor + g_conduit + g_arch + g_topo;
    if (gene_sum > 84) {
        raw_score -= (gene_sum - 84) * 95;
    }
    int fitness = clamp_i32((raw_score * 5) >> 3, 100, 9985);

    *out_yield_gain    = clamp_i32(100 + ((energy + flux) * 250) / 7200, 100, 350);
    *out_time_dilation = clamp_i32(10 + ((g_freq * 4 + g_conduit * 3 + (resonance_acc >> 5)) * 90) / 160, 10, 100);
    *out_resonance     = clamp_i32((resonance_acc * 100) / 3800, 0, 100);
    return fitness;
}

static int select_craft_type(uint32_t dna, int faction_id, int lab_type, int local_slope, int local_moisture) {
    int g_root    = (int)((dna >>  0) & 0xF);
    int g_branch  = (int)((dna >>  4) & 0xF);
    int g_thrust  = (int)((dna >>  8) & 0xF);
    int g_freq    = (int)((dna >> 12) & 0xF);
    int g_conduit = (int)((dna >> 20) & 0xF);

    int lt = lab_type & 3;
    if (lt == 3 && g_freq >= 10 && g_conduit >= 10) {
        return CRAFT_CHRONOS_TIME_CRYSTAL;
    }
    if (faction_id == FACTION_CORVUS_SKY) {
        if (lt == 1) return CRAFT_ORNITHOPTER_SKY_SKIFF;
        if (lt == 2) return CRAFT_AETHER_LEVITATION_BARGE;
        if (lt == 3) return CRAFT_CHRONOS_TIME_CRYSTAL;
        return (g_branch + g_thrust >= 20) ? CRAFT_ORNITHOPTER_SKY_SKIFF : CRAFT_AETHER_LEVITATION_BARGE;
    }
    if (faction_id == FACTION_CERVUS_MYCELIAL) {
        if (lt == 0) return CRAFT_EVOLVED_FLORA_SEED;
        if (lt == 1) return CRAFT_MYCELIAL_SPORE_GLIDER;
        if (lt == 2) return CRAFT_AMPHIBIOUS_WAVE_STRIDER;
        return (local_moisture >= 60) ? CRAFT_MYCELIAL_SPORE_GLIDER : CRAFT_EVOLVED_FLORA_SEED;
    }
    if (faction_id == FACTION_SKEKSIS_GOO) {
        if (lt == 0 || lt == 1) return CRAFT_DARK_CRYSTAL_STRIDER;
        if (lt == 2) return CRAFT_SUBTERRANEAN_MOLE_DRILL;
        return (g_conduit >= 11) ? CRAFT_DARK_CRYSTAL_STRIDER : CRAFT_SUBTERRANEAN_MOLE_DRILL;
    }
    /* FACTION_HUMAN_ORANGE */
    if (lt == 0) return CRAFT_EVOLVED_FLORA_SEED;
    if (lt == 1) return (g_branch + g_thrust >= 22) ? CRAFT_ORNITHOPTER_SKY_SKIFF : CRAFT_AETHER_LEVITATION_BARGE;
    if (lt == 2) return (local_moisture > 55) ? CRAFT_AMPHIBIOUS_WAVE_STRIDER : CRAFT_SUBTERRANEAN_MOLE_DRILL;
    if (abs_i32(local_slope) > 45 && g_root >= 10) return CRAFT_SUBTERRANEAN_MOLE_DRILL;
    return CRAFT_AETHER_LEVITATION_BARGE;
}

WASM_EXPORT int wasm_run_scientist_experiment(
    int faction_id,
    int lab_type,
    int local_slope,
    int local_moisture,
    int energy_budget,
    int num_trials,
    uint32_t seed
) {
    int trials = clamp_i32(num_trials, 64, 65536);
    int fac = clamp_i32(faction_id, 0, 3);

    Rng64 rng;
    rng_seed(&rng, seed ^ (uint32_t)(fac * 0x9E3779B9U + lab_type * 0x85EBCA6BU));

    /* Maintain a small elite pool of 4 genomes for tournament evolution */
    uint32_t elites[4];
    int elite_scores[4];
    for (int i = 0; i < 4; i++) {
        elites[i] = rng_next_u32(&rng);
        elite_scores[i] = -1;
    }

    int best_fitness = -1;
    uint32_t best_dna = elites[0];
    int best_yield = 100;
    int best_dilation = 10;
    int best_resonance = 0;

    for (int t = 0; t < trials; t++) {
        uint32_t candidate;
        if (t < 16 || (rng_next_u32(&rng) & 7) == 0) {
            /* Fresh random exploration */
            candidate = rng_next_u32(&rng);
        } else {
            /* Mutate or recombine from elite pool */
            uint32_t parent_a = elites[t & 3];
            uint32_t parent_b = elites[(t + 1 + (rng_next_u32(&rng) & 1)) & 3];
            uint32_t mask = (rng_next_u32(&rng) & 1) ? 0x0F0F0F0FU : 0x00FF00FFU;
            candidate = (parent_a & mask) | (parent_b & ~mask);

            /* Point mutation on 1 or 2 genes */
            int gene_idx = (int)(rng_next_u32(&rng) & 7) * 4;
            int delta = ((int)(rng_next_u32(&rng) & 7)) - 3;
            int g_val = clamp_i32((int)((candidate >> gene_idx) & 0xF) + delta, 0, 15);
            candidate = (candidate & ~(0xFU << gene_idx)) | ((uint32_t)g_val << gene_idx);
        }

        int yield_gain = 100, dilation = 10, resonance = 0;
        int fit = evaluate_genome_24steps(
            candidate, fac, lab_type, local_slope, local_moisture, energy_budget,
            &yield_gain, &dilation, &resonance
        );

        /* Update elite pool slot */
        int slot = t & 3;
        if (fit > elite_scores[slot]) {
            elite_scores[slot] = fit;
            elites[slot] = candidate;
        }

        if (fit > best_fitness) {
            best_fitness   = fit;
            best_dna       = candidate;
            best_yield     = yield_gain;
            best_dilation  = dilation;
            best_resonance = resonance;
        }
    }

    int craft_type = select_craft_type(best_dna, fac, lab_type, local_slope, local_moisture);
    int conduit_type = fac; /* 0=COPPER_PIPE, 1=AETHER_LASER, 2=MYCELIAL_HYPHAE, 3=DARK_VEIN */
    if (((best_dna >> 20) & 0xF) >= 13 && ((best_dna >> 12) & 0xF) >= 12 && fac == FACTION_HUMAN_ORANGE) {
        conduit_type = CONDUIT_AETHER_LASER;
    }

    result_buf[0]  = best_fitness;
    result_buf[1]  = (int32_t)best_dna;
    result_buf[2]  = craft_type;
    result_buf[3]  = trials * 24;
    result_buf[4]  = best_yield;
    result_buf[5]  = conduit_type;
    result_buf[6]  = best_dilation;
    result_buf[7]  = best_resonance;
    result_buf[8]  = (int32_t)((best_dna >>  0) & 0xF); /* root/chassis */
    result_buf[9]  = (int32_t)((best_dna >>  4) & 0xF); /* branching/wing */
    result_buf[10] = (int32_t)((best_dna >>  8) & 0xF); /* spore/thrust */
    result_buf[11] = (int32_t)((best_dna >> 12) & 0xF); /* color_freq */
    result_buf[12] = (int32_t)((best_dna >> 16) & 0xF); /* symbiosis/armor */
    result_buf[13] = (int32_t)((best_dna >> 20) & 0xF); /* conduit_conductance */
    result_buf[14] = (int32_t)((best_dna >> 24) & 0xF); /* craft_archetype */
    result_buf[15] = (int32_t)((best_dna >> 28) & 0xF); /* topology_affinity */

    return best_fitness;
}

/* ============================================================================
 * 2. EVOLUTIONARY MULTI-SCALE CITY BUILDING ARCHITECT (15 x 12)
 * ============================================================================ */

static void compute_ground_rows(int center_x, int ground_row[BLUEPRINT_W]) {
    int cx = clamp_i32(center_x, 7, TERRAIN_BUF_SIZE - 8);
    int sum_h = 0;
    for (int c = 0; c < BLUEPRINT_W; c++) {
        sum_h += (int)terrain_buf[cx - 7 + c];
    }
    int mean_h = sum_h / BLUEPRINT_W;

    for (int c = 0; c < BLUEPRINT_W; c++) {
        int h = (int)terrain_buf[cx - 7 + c];
        int rel = (h - mean_h) / 6;
        /* Ground sits near rows 8..11 (row 11 is bottom) */
        ground_row[c] = clamp_i32(10 - rel, 7, 11);
    }
}

static void generate_initial_blueprint(
    uint8_t grid[BLUEPRINT_BUF_SIZE],
    const int ground_row[BLUEPRINT_W],
    int faction_id,
    int env_type,
    Rng64* rng
) {
    memset(grid, TILE_EMPTY, BLUEPRINT_BUF_SIZE);

    int left_margin  = (faction_id == FACTION_CORVUS_SKY) ? 1 : 2;
    int right_margin = BLUEPRINT_W - 1 - left_margin;
    int roof_top     = (faction_id == FACTION_SKEKSIS_GOO || faction_id == FACTION_CORVUS_SKY) ? 1 : 2;

    for (int c = left_margin; c <= right_margin; c++) {
        int g_row = ground_row[c];
        /* Fill foundation struts from bottom up to ground_row */
        for (int r = g_row; r < BLUEPRINT_H; r++) {
            if (env_type == 1 && faction_id == FACTION_CORVUS_SKY && r > g_row) {
                /* Sky island floating keel */
                grid[r * BLUEPRINT_W + c] = (c == 7 || c == 4 || c == 10) ? TILE_ARCH_SUPPORT : TILE_EMPTY;
            } else {
                grid[r * BLUEPRINT_W + c] = TILE_FOUNDATION_STRUT;
            }
        }

        /* Taper width near top for domes/spires */
        int dist_center = abs_i32(c - 7);
        int col_top = roof_top + (dist_center >> 1);
        if (faction_id == FACTION_SKEKSIS_GOO) {
            col_top = roof_top + dist_center; /* Sharp gothic spire */
        }

        for (int r = col_top; r < g_row; r++) {
            uint8_t tile = TILE_MASONRY_WALL;
            if (r == col_top) {
                tile = (dist_center <= 2 || (rng_next_u32(rng) & 3) == 0)
                    ? TILE_HARVESTER_ARRAY
                    : TILE_ROOF_DOME_SPIRE;
            } else if (r == col_top + 1) {
                tile = TILE_ROOF_DOME_SPIRE;
            } else if (dist_center <= 2 && r >= g_row - 4 && r <= g_row - 2) {
                tile = TILE_COMPUTE_CORE_CELL;
            } else if ((c == left_margin || c == right_margin) && r == g_row - 2) {
                tile = TILE_CONDUIT_PORT;
            } else if (((r + c) & 1) == 0 && dist_center >= 2 && dist_center <= 4) {
                tile = TILE_LUMINOUS_WINDOW;
            } else if (r == g_row - 1 && dist_center == 3) {
                tile = TILE_ARCH_SUPPORT;
            }
            grid[r * BLUEPRINT_W + c] = tile;
        }
    }
}

static int evaluate_blueprint_fitness(
    const uint8_t grid[BLUEPRINT_BUF_SIZE],
    const int ground_row[BLUEPRINT_W],
    int faction_id,
    int env_type
) {
    uint8_t supported[BLUEPRINT_BUF_SIZE];
    memset(supported, 0, BLUEPRINT_BUF_SIZE);

    int score = 1000;
    int foundation_count = 0;
    int wall_count       = 0;
    int arch_count       = 0;
    int window_count     = 0;
    int roof_count       = 0;
    int port_count       = 0;
    int core_count       = 0;
    int harvester_count  = 0;
    int floating_penalty = 0;

    /* Bottom-to-top support propagation pass */
    for (int r = BLUEPRINT_H - 1; r >= 0; r--) {
        /* Direct vertical support from ground or tile below */
        for (int c = 0; c < BLUEPRINT_W; c++) {
            int idx = r * BLUEPRINT_W + c;
            uint8_t t = grid[idx];
            if (t == TILE_EMPTY) continue;

            if (r >= ground_row[c]) {
                if (t == TILE_FOUNDATION_STRUT || t == TILE_MASONRY_WALL || t == TILE_ARCH_SUPPORT) {
                    supported[idx] = 1;
                    score += 18;
                } else {
                    /* Non-structural tile buried in ground slope */
                    score -= 12;
                }
            } else if (r + 1 < BLUEPRINT_H && supported[(r + 1) * BLUEPRINT_W + c]) {
                supported[idx] = 1;
            } else if (env_type == 1 && faction_id == FACTION_CORVUS_SKY && r == ground_row[c] - 1 && t == TILE_ARCH_SUPPORT) {
                /* Sky Lab aerodynamic keel support */
                supported[idx] = 1;
            }
        }
        /* Lateral arch cantilever support (up to 2 tiles sideways from a supported arch/wall) */
        for (int pass = 0; pass < 2; pass++) {
            for (int c = 0; c < BLUEPRINT_W; c++) {
                int idx = r * BLUEPRINT_W + c;
                if (grid[idx] == TILE_EMPTY || supported[idx]) continue;
                if (c > 0 && supported[idx - 1] &&
                    (grid[idx - 1] == TILE_ARCH_SUPPORT || grid[idx - 1] == TILE_MASONRY_WALL)) {
                    supported[idx] = 1;
                } else if (c + 1 < BLUEPRINT_W && supported[idx + 1] &&
                    (grid[idx + 1] == TILE_ARCH_SUPPORT || grid[idx + 1] == TILE_MASONRY_WALL)) {
                    supported[idx] = 1;
                }
            }
        }
    }

    /* Evaluate functional & architectural rules */
    for (int r = 0; r < BLUEPRINT_H; r++) {
        for (int c = 0; c < BLUEPRINT_W; c++) {
            int idx = r * BLUEPRINT_W + c;
            uint8_t t = grid[idx];
            if (t == TILE_EMPTY) continue;

            if (!supported[idx]) {
                floating_penalty += 65;
                continue;
            }

            /* Symmetry bonus across center column 7 */
            uint8_t mirror_t = grid[r * BLUEPRINT_W + (BLUEPRINT_W - 1 - c)];
            if (mirror_t == t) {
                score += (faction_id == FACTION_HUMAN_ORANGE || faction_id == FACTION_CORVUS_SKY) ? 10 : 5;
            }

            /* Count cardinal neighbors */
            uint8_t n_up    = (r > 0)               ? grid[(r - 1) * BLUEPRINT_W + c] : TILE_EMPTY;
            uint8_t n_down  = (r + 1 < BLUEPRINT_H) ? grid[(r + 1) * BLUEPRINT_W + c] : TILE_FOUNDATION_STRUT;
            uint8_t n_left  = (c > 0)               ? grid[r * BLUEPRINT_W + (c - 1)] : TILE_EMPTY;
            uint8_t n_right = (c + 1 < BLUEPRINT_W) ? grid[r * BLUEPRINT_W + (c + 1)] : TILE_EMPTY;

            switch (t) {
                case TILE_FOUNDATION_STRUT:
                    foundation_count++;
                    if (r >= ground_row[c]) score += 22;
                    else score -= 8;
                    break;

                case TILE_MASONRY_WALL:
                    wall_count++;
                    if (n_down != TILE_EMPTY) score += 14;
                    break;

                case TILE_ARCH_SUPPORT:
                    arch_count++;
                    if (n_left != TILE_EMPTY && n_right != TILE_EMPTY) score += 24;
                    if (n_down == TILE_EMPTY) score += 20; /* Spanning an open archway */
                    break;

                case TILE_LUMINOUS_WINDOW:
                    window_count++;
                    /* Windows love being framed by walls/arches and not adjacent to other windows */
                    if (n_up != TILE_EMPTY && n_down != TILE_EMPTY) score += 25;
                    if (n_left == TILE_MASONRY_WALL || n_right == TILE_MASONRY_WALL) score += 18;
                    if (n_left == TILE_LUMINOUS_WINDOW && n_right == TILE_LUMINOUS_WINDOW) score -= 20;
                    break;

                case TILE_ROOF_DOME_SPIRE:
                    roof_count++;
                    if (n_up == TILE_EMPTY || n_up == TILE_HARVESTER_ARRAY) score += 26;
                    else score -= 18;
                    break;

                case TILE_CONDUIT_PORT:
                    port_count++;
                    /* Conduit ports belong on exterior walls or connected to compute core */
                    if (n_left == TILE_EMPTY || n_right == TILE_EMPTY) score += 30;
                    if (n_left == TILE_COMPUTE_CORE_CELL || n_right == TILE_COMPUTE_CORE_CELL ||
                        n_up == TILE_COMPUTE_CORE_CELL || n_down == TILE_COMPUTE_CORE_CELL) {
                        score += 35;
                    }
                    break;

                case TILE_COMPUTE_CORE_CELL:
                    core_count++;
                    /* Compute core must be shielded inside the building and clustered */
                    if (n_up != TILE_EMPTY && n_down != TILE_EMPTY &&
                        n_left != TILE_EMPTY && n_right != TILE_EMPTY) {
                        score += 42;
                    } else {
                        score -= 25; /* Exposed core penalty */
                    }
                    if (n_left == TILE_COMPUTE_CORE_CELL || n_right == TILE_COMPUTE_CORE_CELL ||
                        n_up == TILE_COMPUTE_CORE_CELL || n_down == TILE_COMPUTE_CORE_CELL) {
                        score += 20;
                    }
                    break;

                case TILE_HARVESTER_ARRAY: {
                    harvester_count++;
                    /* Harvester array needs clear vertical sky exposure above it */
                    int sky_clear = 1;
                    for (int rr = 0; rr < r; rr++) {
                        if (grid[rr * BLUEPRINT_W + c] != TILE_EMPTY) {
                            sky_clear = 0;
                            break;
                        }
                    }
                    if (sky_clear && (n_down == TILE_ROOF_DOME_SPIRE || n_down == TILE_MASONRY_WALL || n_down == TILE_ARCH_SUPPORT)) {
                        score += 48;
                    } else {
                        score -= 30;
                    }
                    break;
                }
            }
        }
    }

    score -= floating_penalty;

    /* Target quotas so the building has balanced organs (core, windows, ports, roof, harvesters) */
    if (core_count >= 4 && core_count <= 18) score += core_count * 25;
    else score -= abs_i32(core_count - 9) * 30;

    if (port_count >= 2 && port_count <= 8) score += port_count * 35;
    else score -= abs_i32(port_count - 4) * 35;

    if (harvester_count >= 3 && harvester_count <= 12) score += harvester_count * 28;
    else score -= abs_i32(harvester_count - 6) * 25;

    if (window_count >= 4 && window_count <= 16) score += window_count * 20;
    if (roof_count >= 5 && roof_count <= 20) score += roof_count * 18;
    if (arch_count >= 2 && arch_count <= 14) score += arch_count * 16;

    /* Faction architectural bonuses */
    if (faction_id == FACTION_HUMAN_ORANGE) {
        score += (window_count * 12 + roof_count * 10 + port_count * 15);
    } else if (faction_id == FACTION_CORVUS_SKY) {
        score += (arch_count * 18 + harvester_count * 16);
    } else if (faction_id == FACTION_CERVUS_MYCELIAL) {
        score += (foundation_count * 10 + core_count * 18 + port_count * 14);
    } else if (faction_id == FACTION_SKEKSIS_GOO) {
        score += (roof_count * 14 + harvester_count * 18 + wall_count * 8);
    }

    return clamp_i32(score, 0, 10000);
}

WASM_EXPORT int wasm_evolve_city_building(
    int faction_id,
    int env_type,
    int center_x,
    int num_generations,
    uint32_t seed
) {
    int gens = clamp_i32(num_generations, 16, 1000);
    int fac  = clamp_i32(faction_id, 0, 3);

    Rng64 rng;
    rng_seed(&rng, seed ^ (uint32_t)(fac * 0x517CC1B7U + center_x * 0x85EBCA6BU));

    /* If terrain_buf is uninitialized (all zeros), synthesize a natural slope around center_x */
    int any_nonzero = 0;
    for (int i = 0; i < TERRAIN_BUF_SIZE; i++) {
        if (terrain_buf[i] != 0) {
            any_nonzero = 1;
            break;
        }
    }
    if (!any_nonzero) {
        for (int i = 0; i < TERRAIN_BUF_SIZE; i++) {
            terrain_buf[i] = (uint8_t)(60 + ((i * 7 + tri_wave64(i)) & 31));
        }
    }

    int ground_row[BLUEPRINT_W];
    compute_ground_rows(center_x, ground_row);

    uint8_t best_grid[BLUEPRINT_BUF_SIZE];
    uint8_t cand_grid[BLUEPRINT_BUF_SIZE];

    generate_initial_blueprint(best_grid, ground_row, fac, env_type, &rng);
    int best_score = evaluate_blueprint_fitness(best_grid, ground_row, fac, env_type);

    for (int g = 0; g < gens; g++) {
        memcpy(cand_grid, best_grid, BLUEPRINT_BUF_SIZE);

        /* Apply 1 to 3 structural mutations per generation (often symmetric) */
        int num_muts = 1 + (int)(rng_next_u32(&rng) & 1);
        for (int m = 0; m < num_muts; m++) {
            int c = 1 + rng_range(&rng, BLUEPRINT_W - 2);
            int r = 1 + rng_range(&rng, BLUEPRINT_H - 2);
            int g_row = ground_row[c];

            uint8_t new_tile = TILE_EMPTY;
            if (r >= g_row) {
                new_tile = TILE_FOUNDATION_STRUT;
            } else if (r == g_row - 1) {
                int pick = (int)(rng_next_u32(&rng) & 3);
                new_tile = (pick == 0) ? TILE_ARCH_SUPPORT
                         : (pick == 1) ? TILE_CONDUIT_PORT
                         : TILE_MASONRY_WALL;
            } else {
                int pick = rng_range(&rng, 10);
                if (pick < 2) new_tile = TILE_MASONRY_WALL;
                else if (pick == 2) new_tile = TILE_LUMINOUS_WINDOW;
                else if (pick == 3) new_tile = TILE_COMPUTE_CORE_CELL;
                else if (pick == 4) new_tile = TILE_ARCH_SUPPORT;
                else if (pick == 5) new_tile = TILE_ROOF_DOME_SPIRE;
                else if (pick == 6) new_tile = TILE_HARVESTER_ARRAY;
                else if (pick == 7) new_tile = TILE_CONDUIT_PORT;
                else new_tile = TILE_EMPTY;
            }

            cand_grid[r * BLUEPRINT_W + c] = new_tile;
            /* Mirror mutation 75% of the time for architectural poise */
            if ((rng_next_u32(&rng) & 3) != 0) {
                int mc = BLUEPRINT_W - 1 - c;
                if (r < ground_row[mc]) {
                    cand_grid[r * BLUEPRINT_W + mc] = new_tile;
                }
            }
        }

        int score = evaluate_blueprint_fitness(cand_grid, ground_row, fac, env_type);
        if (score >= best_score) {
            best_score = score;
            memcpy(best_grid, cand_grid, BLUEPRINT_BUF_SIZE);
        }
    }

    memcpy(blueprint_buf, best_grid, BLUEPRINT_BUF_SIZE);

    /* Populate summary metrics in result_buf */
    int counts[NUM_TILE_TYPES];
    memset(counts, 0, sizeof(counts));
    for (int i = 0; i < BLUEPRINT_BUF_SIZE; i++) {
        uint8_t t = blueprint_buf[i];
        if (t < NUM_TILE_TYPES) counts[t]++;
    }
    result_buf[0] = best_score;
    result_buf[1] = BLUEPRINT_W;
    result_buf[2] = BLUEPRINT_H;
    result_buf[3] = counts[TILE_COMPUTE_CORE_CELL];
    result_buf[4] = counts[TILE_HARVESTER_ARRAY];
    result_buf[5] = counts[TILE_CONDUIT_PORT];
    result_buf[6] = counts[TILE_LUMINOUS_WINDOW];
    result_buf[7] = counts[TILE_ROOF_DOME_SPIRE];

    return best_score;
}

/* ============================================================================
 * 3. WAVE FUNCTION COLLAPSE (WFC) HIGH-RES CITY SEEP SOLVER
 * ============================================================================ */

/*
 * Bitmask of allowed tile types (bits 1..8 correspond to TILE_FOUNDATION_STRUT..TILE_HARVESTER_ARRAY)
 * Given a collapsed tile T at cell A, what tiles are allowed at neighbor B in direction DIR?
 */
static uint32_t wfc_allowed_neighbor_mask(uint8_t tile, int dir_dy, int dir_dx) {
    /* Bitmask helper: bit(t) = (1U << t) */
    const uint32_t ALL_TILES = 0x1FEU; /* bits 1..8 */
    if (tile == TILE_EMPTY || tile >= NUM_TILE_TYPES) return ALL_TILES;

    if (dir_dy == -1) {
        /* Neighbor is ABOVE `tile` */
        switch (tile) {
            case TILE_FOUNDATION_STRUT:
                return (1U << TILE_FOUNDATION_STRUT) | (1U << TILE_MASONRY_WALL) |
                       (1U << TILE_ARCH_SUPPORT) | (1U << TILE_CONDUIT_PORT);
            case TILE_MASONRY_WALL:
                return (1U << TILE_MASONRY_WALL) | (1U << TILE_ARCH_SUPPORT) |
                       (1U << TILE_LUMINOUS_WINDOW) | (1U << TILE_ROOF_DOME_SPIRE) |
                       (1U << TILE_CONDUIT_PORT) | (1U << TILE_COMPUTE_CORE_CELL);
            case TILE_ARCH_SUPPORT:
                return (1U << TILE_MASONRY_WALL) | (1U << TILE_LUMINOUS_WINDOW) |
                       (1U << TILE_COMPUTE_CORE_CELL) | (1U << TILE_ROOF_DOME_SPIRE) |
                       (1U << TILE_HARVESTER_ARRAY);
            case TILE_LUMINOUS_WINDOW:
                return (1U << TILE_MASONRY_WALL) | (1U << TILE_ARCH_SUPPORT) |
                       (1U << TILE_ROOF_DOME_SPIRE);
            case TILE_ROOF_DOME_SPIRE:
                return (1U << TILE_ROOF_DOME_SPIRE) | (1U << TILE_HARVESTER_ARRAY);
            case TILE_CONDUIT_PORT:
                return (1U << TILE_MASONRY_WALL) | (1U << TILE_ARCH_SUPPORT) |
                       (1U << TILE_ROOF_DOME_SPIRE);
            case TILE_COMPUTE_CORE_CELL:
                return (1U << TILE_COMPUTE_CORE_CELL) | (1U << TILE_MASONRY_WALL) |
                       (1U << TILE_ARCH_SUPPORT) | (1U << TILE_ROOF_DOME_SPIRE);
            case TILE_HARVESTER_ARRAY:
                return (1U << TILE_HARVESTER_ARRAY);
        }
    } else if (dir_dy == 1) {
        /* Neighbor is BELOW `tile` */
        switch (tile) {
            case TILE_FOUNDATION_STRUT:
                return (1U << TILE_FOUNDATION_STRUT);
            case TILE_MASONRY_WALL:
                return (1U << TILE_FOUNDATION_STRUT) | (1U << TILE_MASONRY_WALL) |
                       (1U << TILE_ARCH_SUPPORT);
            case TILE_ARCH_SUPPORT:
                return (1U << TILE_FOUNDATION_STRUT) | (1U << TILE_MASONRY_WALL) |
                       (1U << TILE_ARCH_SUPPORT);
            case TILE_LUMINOUS_WINDOW:
                return (1U << TILE_MASONRY_WALL) | (1U << TILE_ARCH_SUPPORT) |
                       (1U << TILE_COMPUTE_CORE_CELL);
            case TILE_ROOF_DOME_SPIRE:
                return (1U << TILE_MASONRY_WALL) | (1U << TILE_ARCH_SUPPORT) |
                       (1U << TILE_LUMINOUS_WINDOW) | (1U << TILE_COMPUTE_CORE_CELL);
            case TILE_CONDUIT_PORT:
                return (1U << TILE_FOUNDATION_STRUT) | (1U << TILE_MASONRY_WALL) |
                       (1U << TILE_ARCH_SUPPORT);
            case TILE_COMPUTE_CORE_CELL:
                return (1U << TILE_MASONRY_WALL) | (1U << TILE_ARCH_SUPPORT) |
                       (1U << TILE_COMPUTE_CORE_CELL) | (1U << TILE_FOUNDATION_STRUT);
            case TILE_HARVESTER_ARRAY:
                return (1U << TILE_ROOF_DOME_SPIRE) | (1U << TILE_ARCH_SUPPORT) |
                       (1U << TILE_MASONRY_WALL);
        }
    } else if (dir_dx != 0) {
        /* Neighbor is LEFT or RIGHT of `tile` */
        switch (tile) {
            case TILE_FOUNDATION_STRUT:
                return (1U << TILE_FOUNDATION_STRUT) | (1U << TILE_MASONRY_WALL) |
                       (1U << TILE_ARCH_SUPPORT) | (1U << TILE_CONDUIT_PORT);
            case TILE_MASONRY_WALL:
                return (1U << TILE_MASONRY_WALL) | (1U << TILE_ARCH_SUPPORT) |
                       (1U << TILE_LUMINOUS_WINDOW) | (1U << TILE_CONDUIT_PORT) |
                       (1U << TILE_COMPUTE_CORE_CELL);
            case TILE_ARCH_SUPPORT:
                return (1U << TILE_MASONRY_WALL) | (1U << TILE_ARCH_SUPPORT) |
                       (1U << TILE_LUMINOUS_WINDOW) | (1U << TILE_CONDUIT_PORT);
            case TILE_LUMINOUS_WINDOW:
                return (1U << TILE_MASONRY_WALL) | (1U << TILE_ARCH_SUPPORT) |
                       (1U << TILE_COMPUTE_CORE_CELL);
            case TILE_ROOF_DOME_SPIRE:
                return (1U << TILE_ROOF_DOME_SPIRE) | (1U << TILE_HARVESTER_ARRAY) |
                       (1U << TILE_ARCH_SUPPORT);
            case TILE_CONDUIT_PORT:
                return (1U << TILE_MASONRY_WALL) | (1U << TILE_COMPUTE_CORE_CELL) |
                       (1U << TILE_ARCH_SUPPORT);
            case TILE_COMPUTE_CORE_CELL:
                return (1U << TILE_COMPUTE_CORE_CELL) | (1U << TILE_MASONRY_WALL) |
                       (1U << TILE_CONDUIT_PORT) | (1U << TILE_LUMINOUS_WINDOW);
            case TILE_HARVESTER_ARRAY:
                return (1U << TILE_HARVESTER_ARRAY) | (1U << TILE_ROOF_DOME_SPIRE);
        }
    }
    return ALL_TILES;
}

static const int FACTION_TILE_WEIGHTS[4][NUM_TILE_TYPES] = {
    /* 0: HUMAN_ORANGE */
    { 0, 14, 24, 14, 18, 16, 12, 16, 14 },
    /* 1: CORVUS_SKY */
    { 0,  8, 14, 26, 18, 22, 14, 16, 24 },
    /* 2: CERVUS_MYCELIAL */
    { 0, 22, 18, 20, 16, 12, 22, 24, 16 },
    /* 3: SKEKSIS_GOO */
    { 0, 18, 22, 14, 10, 26, 18, 20, 22 }
};

WASM_EXPORT int wasm_step_wfc_seep(
    int width,
    int height,
    int faction_id,
    int steps,
    uint32_t seed
) {
    int w = clamp_i32(width, 3, WFC_MAX_W);
    int h = clamp_i32(height, 3, WFC_MAX_H);
    int fac = clamp_i32(faction_id, 0, 3);
    int max_steps = clamp_i32(steps, 1, w * h);

    Rng64 rng;
    rng_seed(&rng, seed ^ (uint32_t)(fac * 0x27D4EB2DU + w * 31 + h));

    /* Check if any cell is already collapsed; if none, seed a foundation anchor at bottom center */
    int collapsed_count = 0;
    for (int i = 0; i < w * h; i++) {
        if (wfc_buf[i] != TILE_EMPTY) collapsed_count++;
    }
    if (collapsed_count == 0) {
        int seed_idx = (h - 1) * w + (w / 2);
        wfc_buf[seed_idx] = TILE_FOUNDATION_STRUT;
        collapsed_count = 1;
    }

    for (int s = 0; s < max_steps; s++) {
        int best_idx = -1;
        int best_entropy_score = 999999;
        uint32_t best_mask = 0;

        /* Scan all uncollapsed frontier cells adjacent to at least one collapsed cell */
        for (int r = 0; r < h; r++) {
            /* Vertical zone prior mask */
            uint32_t zone_mask = 0x1FEU;
            if (r >= (h * 3) / 4) {
                /* Bottom quarter favors foundation, wall, arch, port */
                zone_mask = (1U << TILE_FOUNDATION_STRUT) | (1U << TILE_MASONRY_WALL) |
                            (1U << TILE_ARCH_SUPPORT) | (1U << TILE_CONDUIT_PORT);
            } else if (r <= h / 5) {
                /* Top fifth favors roof, spire, harvester, arch */
                zone_mask = (1U << TILE_ROOF_DOME_SPIRE) | (1U << TILE_HARVESTER_ARRAY) |
                            (1U << TILE_ARCH_SUPPORT) | (1U << TILE_LUMINOUS_WINDOW);
            }

            for (int c = 0; c < w; c++) {
                int idx = r * w + c;
                if (wfc_buf[idx] != TILE_EMPTY) continue;

                uint32_t intersect_mask = 0x1FEU;
                uint32_t union_mask     = 0;
                int neighbor_count      = 0;

                /* Up neighbor (r-1, c) -> current cell is BELOW up neighbor (+1, 0) */
                if (r > 0 && wfc_buf[(r - 1) * w + c] != TILE_EMPTY) {
                    uint32_t m = wfc_allowed_neighbor_mask(wfc_buf[(r - 1) * w + c], 1, 0);
                    intersect_mask &= m;
                    union_mask |= m;
                    neighbor_count++;
                }
                /* Down neighbor (r+1, c) -> current cell is ABOVE down neighbor (-1, 0) */
                if (r + 1 < h && wfc_buf[(r + 1) * w + c] != TILE_EMPTY) {
                    uint32_t m = wfc_allowed_neighbor_mask(wfc_buf[(r + 1) * w + c], -1, 0);
                    intersect_mask &= m;
                    union_mask |= m;
                    neighbor_count++;
                }
                /* Left neighbor (r, c-1) -> current cell is RIGHT of left neighbor (0, +1) */
                if (c > 0 && wfc_buf[r * w + (c - 1)] != TILE_EMPTY) {
                    uint32_t m = wfc_allowed_neighbor_mask(wfc_buf[r * w + (c - 1)], 0, 1);
                    intersect_mask &= m;
                    union_mask |= m;
                    neighbor_count++;
                }
                /* Right neighbor (r, c+1) -> current cell is LEFT of right neighbor (0, -1) */
                if (c + 1 < w && wfc_buf[r * w + (c + 1)] != TILE_EMPTY) {
                    uint32_t m = wfc_allowed_neighbor_mask(wfc_buf[r * w + (c + 1)], 0, -1);
                    intersect_mask &= m;
                    union_mask |= m;
                    neighbor_count++;
                }

                if (neighbor_count == 0) continue;

                uint32_t candidate_mask = intersect_mask & zone_mask;
                if (candidate_mask == 0) candidate_mask = intersect_mask;
                if (candidate_mask == 0) candidate_mask = union_mask & zone_mask;
                if (candidate_mask == 0) candidate_mask = union_mask ? union_mask : 0x1FEU;

                int entropy = popcount_u32(candidate_mask);
                /* Minimum entropy with preference for cells having more collapsed neighbors */
                int score = entropy * 32 - neighbor_count * 6 + (int)(rng_next_u32(&rng) & 7);
                if (score < best_entropy_score) {
                    best_entropy_score = score;
                    best_idx  = idx;
                    best_mask = candidate_mask;
                }
            }
        }

        if (best_idx < 0) {
            /* All reachable cells are collapsed */
            break;
        }

        /* Weighted collapse of best_idx according to faction weights */
        int total_weight = 0;
        for (int t = 1; t < NUM_TILE_TYPES; t++) {
            if (best_mask & (1U << t)) {
                total_weight += FACTION_TILE_WEIGHTS[fac][t];
            }
        }

        uint8_t chosen_tile = TILE_MASONRY_WALL;
        if (total_weight > 0) {
            int pick = rng_range(&rng, total_weight);
            int acc = 0;
            for (int t = 1; t < NUM_TILE_TYPES; t++) {
                if (best_mask & (1U << t)) {
                    acc += FACTION_TILE_WEIGHTS[fac][t];
                    if (pick < acc) {
                        chosen_tile = (uint8_t)t;
                        break;
                    }
                }
            }
        }

        wfc_buf[best_idx] = chosen_tile;
        collapsed_count++;
    }

    result_buf[0] = collapsed_count;
    result_buf[1] = w;
    result_buf[2] = h;
    return collapsed_count;
}

/* ============================================================================
 * 4. HYPERTIME 100x CIVILIZATION BURST SIMULATOR
 * ============================================================================ */

WASM_EXPORT int wasm_simulate_hypertime_burst(
    int faction_id,
    int initial_pop,
    int initial_energy,
    int initial_compute,
    int steps_100x,
    uint32_t seed
) {
    int fac   = clamp_i32(faction_id, 0, 3);
    int ticks = clamp_i32(steps_100x, 10, 50000);

    Rng64 rng;
    rng_seed(&rng, seed ^ (uint32_t)(fac * 0x9E3779B9U + ticks * 131U));

    int pop       = clamp_i32(initial_pop, 4, 5000);
    int energy    = clamp_i32(initial_energy, 10, 100000);
    int compute   = clamp_i32(initial_compute, 0, 100000);

    int buildings_evolved = 0;
    int crafts_birthed    = 0;
    int dna_mutations     = 0;
    int total_work        = 0;
    int pipe_packets      = 12 + pop * 2;
    int vat_efficiency    = 10 + fac * 2;

    for (int t = 0; t < ticks; t++) {
        uint32_t r = rng_next_u32(&rng);
        int wave = tri_wave64(t + (int)(r & 7));

        /* Energy harvesting via solar/wind/mycelial/crystal networks */
        int harvest = (pop * (8 + (fac == FACTION_CERVUS_MYCELIAL ? 3 : 1))) >> 2;
        if (wave > 0) harvest += wave;
        energy += harvest;

        /* Pipe packet shuttling into Compute Vats */
        int shuttled = clamp_i32(energy >> 4, 1, pipe_packets * 3);
        energy -= shuttled >> 1;
        int compute_gain = (shuttled * vat_efficiency) >> 3;
        compute += compute_gain;
        total_work += harvest + compute_gain;

        /* Evolve new building / terrace when energy & compute reach threshold */
        int build_cost_e = 90 + buildings_evolved * 18;
        int build_cost_c = 55 + buildings_evolved * 12;
        if (energy >= build_cost_e && compute >= build_cost_c) {
            energy  -= build_cost_e >> 1;
            compute -= build_cost_c >> 1;
            buildings_evolved++;
            pipe_packets += 6;
        }

        /* Birth specialized craft / automaton when compute vats surge */
        int craft_cost_c = 80 + crafts_birthed * 22;
        if (compute >= craft_cost_c && (r & 3) == 0) {
            compute -= craft_cost_c >> 1;
            crafts_birthed++;
            total_work += 45;
        }

        /* Scientist Lab DNA mutation discovery */
        if ((t & 7) == 0 && compute >= 30) {
            dna_mutations++;
            if ((r & 15) == 0 && vat_efficiency < 36) {
                vat_efficiency++;
            }
        }

        /* Population growth & carrying capacity dynamics */
        int cap = 24 + buildings_evolved * 8 + crafts_birthed * 3;
        if (pop < cap && energy > pop * 3 && (t & 15) == 0) {
            pop++;
        } else if (pop > cap && (r & 31) == 0) {
            pop--;
        }
    }

    result_buf[0] = pop - clamp_i32(initial_pop, 4, 5000);
    result_buf[1] = energy - clamp_i32(initial_energy, 10, 100000);
    result_buf[2] = compute - clamp_i32(initial_compute, 0, 100000);
    result_buf[3] = buildings_evolved;
    result_buf[4] = crafts_birthed;
    result_buf[5] = dna_mutations;
    result_buf[6] = total_work;
    result_buf[7] = pop;
    result_buf[8] = energy;
    result_buf[9] = compute;

    return total_work;
}

/* ============================================================================
 * 5. NATIVE MULTI-MILLION INSTANCE EVOLUTIONARY SWEEP & JSON GENERATOR
 * ============================================================================ */

#ifdef WASM_NATIVE_MAIN

static const char* FACTION_NAMES[4] = {
    "HUMAN_ORANGE",
    "CORVUS_SKY",
    "CERVUS_MYCELIAL",
    "SKEKSIS_GOO"
};

static const char* CRAFT_NAMES[8] = {
    "EVOLVED_FLORA_SEED",
    "ORNITHOPTER_SKY_SKIFF",
    "SUBTERRANEAN_MOLE_DRILLER",
    "AMPHIBIOUS_WAVE_STRIDER",
    "AETHER_LEVITATION_BARGE",
    "MYCELIAL_SPORE_GLIDER",
    "CHRONOS_TIME_CRYSTAL",
    "DARK_CRYSTAL_STRIDER"
};

static const char* CONDUIT_NAMES[4] = {
    "COPPER_PIPE",
    "AETHER_LASER",
    "MYCELIAL_HYPHAE",
    "DARK_VEIN"
};

int main(void) {
    struct timespec ts_start, ts_end;
    clock_gettime(CLOCK_MONOTONIC, &ts_start);

    const char* out_path = "/Users/williamsharkey/dev/slopes2/sim/evolved_world_params.json";
    FILE* fp = fopen(out_path, "w");
    if (!fp) {
        out_path = "evolved_world_params.json";
        fp = fopen(out_path, "w");
        if (!fp) {
            perror("Failed to open evolved_world_params.json");
            return 1;
        }
    }

    long long total_cells_simulated = 0;
    int total_blueprints_evolved = 0;
    int total_wfc_cells_collapsed = 0;

    fprintf(fp, "{\n");
    fprintf(fp, "  \"engine\": \"Slopes 2 - C-to-WASM Evolutionary Simulator & WFC City Architect\",\n");
    fprintf(fp, "  \"societies\": [\n");

    for (int fac = 0; fac < 4; fac++) {
        fprintf(fp, "    {\n");
        fprintf(fp, "      \"faction_id\": %d,\n", fac);
        fprintf(fp, "      \"faction_name\": \"%s\",\n", FACTION_NAMES[fac]);
        fprintf(fp, "      \"labs\": [\n");

        /* Sweep 4 specialized Lab Types x 65,536 trials x 24 steps = 6.29M cells per society (25.16M total!) */
        for (int lab = 0; lab < 4; lab++) {
            int slope    = (fac == FACTION_CORVUS_SKY) ? 55 : (fac == FACTION_SKEKSIS_GOO ? 42 : 24);
            int moisture = (fac == FACTION_CERVUS_MYCELIAL) ? 78 : 48;
            int budget   = 180 + lab * 40;
            uint32_t seed = (uint32_t)(0xC0FFEE00U + fac * 1009 + lab * 97);

            int best_fit = wasm_run_scientist_experiment(fac, lab, slope, moisture, budget, 65536, seed);
            uint32_t dna = (uint32_t)result_buf[1];
            int craft_id = result_buf[2];
            int cells    = result_buf[3];
            int yield_g  = result_buf[4];
            int cond_id  = result_buf[5];
            int dilation = result_buf[6];
            int reson    = result_buf[7];

            total_cells_simulated += cells;

            fprintf(fp, "        {\n");
            fprintf(fp, "          \"lab_type\": %d,\n", lab);
            fprintf(fp, "          \"best_fitness\": %d,\n", best_fit);
            fprintf(fp, "          \"dna_genome\": %u,\n", dna);
            fprintf(fp, "          \"dna_hex\": \"0x%08X\",\n", dna);
            fprintf(fp, "          \"craft_type\": %d,\n", craft_id);
            fprintf(fp, "          \"craft_name\": \"%s\",\n", CRAFT_NAMES[craft_id & 7]);
            fprintf(fp, "          \"recommended_conduit\": %d,\n", cond_id);
            fprintf(fp, "          \"conduit_name\": \"%s\",\n", CONDUIT_NAMES[cond_id & 3]);
            fprintf(fp, "          \"energy_yield_gain_pct\": %d,\n", yield_g);
            fprintf(fp, "          \"time_dilation_factor\": %d,\n", dilation);
            fprintf(fp, "          \"transdimensional_resonance\": %d,\n", reson);
            fprintf(fp, "          \"traits\": {\n");
            fprintf(fp, "            \"root_chassis\": %d,\n", result_buf[8]);
            fprintf(fp, "            \"branching_wing\": %d,\n", result_buf[9]);
            fprintf(fp, "            \"spore_thrust\": %d,\n", result_buf[10]);
            fprintf(fp, "            \"color_freq\": %d,\n", result_buf[11]);
            fprintf(fp, "            \"symbiosis_armor\": %d,\n", result_buf[12]);
            fprintf(fp, "            \"conduit_conductance\": %d,\n", result_buf[13]);
            fprintf(fp, "            \"craft_archetype\": %d,\n", result_buf[14]);
            fprintf(fp, "            \"topology_affinity\": %d\n", result_buf[15]);
            fprintf(fp, "          }\n");
            fprintf(fp, "        }%s\n", (lab < 3) ? "," : "");
        }
        fprintf(fp, "      ],\n");

        /* Evolve 15x12 Architectural Blueprint for this society */
        for (int i = 0; i < TERRAIN_BUF_SIZE; i++) {
            int slope_h = 64 + (int)(18.0 * sin((double)i * 0.14 + (double)fac));
            terrain_buf[i] = (uint8_t)clamp_i32(slope_h, 20, 110);
        }
        int env_type = (fac == FACTION_CORVUS_SKY) ? 1 : (fac == FACTION_SKEKSIS_GOO ? -1 : 0);
        int b_fit = wasm_evolve_city_building(fac, env_type, 60, 800, 0xBADCAFE0U + (uint32_t)fac * 777U);
        total_blueprints_evolved += 800;

        fprintf(fp, "      \"evolved_blueprint_15x12\": {\n");
        fprintf(fp, "        \"fitness\": %d,\n", b_fit);
        fprintf(fp, "        \"width\": %d,\n", BLUEPRINT_W);
        fprintf(fp, "        \"height\": %d,\n", BLUEPRINT_H);
        fprintf(fp, "        \"compute_core_cells\": %d,\n", result_buf[3]);
        fprintf(fp, "        \"harvester_cells\": %d,\n", result_buf[4]);
        fprintf(fp, "        \"conduit_ports\": %d,\n", result_buf[5]);
        fprintf(fp, "        \"luminous_windows\": %d,\n", result_buf[6]);
        fprintf(fp, "        \"roof_dome_spires\": %d,\n", result_buf[7]);
        fprintf(fp, "        \"rows\": [\n");
        for (int r = 0; r < BLUEPRINT_H; r++) {
            fprintf(fp, "          [");
            for (int c = 0; c < BLUEPRINT_W; c++) {
                fprintf(fp, "%d%s", blueprint_buf[r * BLUEPRINT_W + c], (c + 1 < BLUEPRINT_W) ? "," : "");
            }
            fprintf(fp, "]%s\n", (r + 1 < BLUEPRINT_H) ? "," : "");
        }
        fprintf(fp, "        ]\n");
        fprintf(fp, "      },\n");

        /* Run WFC High-Res City Seep (35x28) */
        memset(wfc_buf, 0, WFC_BUF_SIZE);
        /* Seed bottom center with foundation & arch */
        wfc_buf[(WFC_MAX_H - 1) * WFC_MAX_W + (WFC_MAX_W / 2)] = TILE_FOUNDATION_STRUT;
        int collapsed = wasm_step_wfc_seep(WFC_MAX_W, WFC_MAX_H, fac, WFC_BUF_SIZE, 0x12345678U + (uint32_t)fac);
        total_wfc_cells_collapsed += collapsed;

        /* Run Hypertime 10,000-step civilization burst */
        int hyper_work = wasm_simulate_hypertime_burst(fac, 24, 400, 120, 10000, 0xFACEB00CU + (uint32_t)fac);

        fprintf(fp, "      \"wfc_sample_collapsed_cells\": %d,\n", collapsed);
        fprintf(fp, "      \"hypertime_10000_metrics\": {\n");
        fprintf(fp, "        \"pop_delta\": %d,\n", result_buf[0]);
        fprintf(fp, "        \"energy_delta\": %d,\n", result_buf[1]);
        fprintf(fp, "        \"compute_delta\": %d,\n", result_buf[2]);
        fprintf(fp, "        \"buildings_evolved\": %d,\n", result_buf[3]);
        fprintf(fp, "        \"crafts_birthed\": %d,\n", result_buf[4]);
        fprintf(fp, "        \"dna_mutations\": %d,\n", result_buf[5]);
        fprintf(fp, "        \"total_compute_work\": %d\n", hyper_work);
        fprintf(fp, "      }\n");
        fprintf(fp, "    }%s\n", (fac < 3) ? "," : "");
    }

    clock_gettime(CLOCK_MONOTONIC, &ts_end);
    double elapsed_ms = (double)(ts_end.tv_sec - ts_start.tv_sec) * 1000.0 +
                        (double)(ts_end.tv_nsec - ts_start.tv_nsec) / 1.0e6;

    fprintf(fp, "  ],\n");
    fprintf(fp, "  \"sweep_summary\": {\n");
    fprintf(fp, "    \"total_cells_simulated\": %lld,\n", total_cells_simulated);
    fprintf(fp, "    \"total_blueprints_evolved\": %d,\n", total_blueprints_evolved);
    fprintf(fp, "    \"total_wfc_cells_collapsed\": %d,\n", total_wfc_cells_collapsed);
    fprintf(fp, "    \"execution_time_ms\": %.2f\n", elapsed_ms);
    fprintf(fp, "  }\n");
    fprintf(fp, "}\n");
    fclose(fp);

    printf("[wasm_sim_native] Completed evolutionary sweep in %.2f ms\n", elapsed_ms);
    printf("  -> Total organism cells simulated: %lld\n", total_cells_simulated);
    printf("  -> Total city blueprints evolved : %d\n", total_blueprints_evolved);
    printf("  -> Total WFC micro-tiles solved  : %d\n", total_wfc_cells_collapsed);
    printf("  -> Wrote %s\n", out_path);
    return 0;
}
#endif
