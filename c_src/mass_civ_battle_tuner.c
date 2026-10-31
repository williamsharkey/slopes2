/*
 * c_src/mass_civ_battle_tuner.c
 * ============================================================================
 * 60-FPS Multi-Thousand Individual Civilization & Procedural Battle Engine
 * with Long-Horizon Dynamical Behavioral Parameter Tuning.
 *
 * Simulates up to 2,048 individuals across 4 interacting civilizations on a
 * single screen at 60 FPS using flat Structure-of-Arrays (SoA) buffers:
 *   - Ranged ballistic aiming (arrows, weapons) with velocity lead
 *   - Aerial egg drops & bomb drops
 *   - Close combat with fists, swords, and spears
 *   - Field engineering: webs & snare traps, prison construction & lockup,
 *     setting areas on fire, and hydro-dynamic water flooding to quench fire.
 * ============================================================================
 */

#include <stdint.h>
#include <math.h>

#define MASS_AGENT_COUNT 2048
#define MASS_PROJ_COUNT  1024
#define COARSE_W         144

#define ROLE_FIST           0
#define ROLE_SWORD          1
#define ROLE_SPEAR          2
#define ROLE_ARCHER         3
#define ROLE_GUNNER         4
#define ROLE_EGG_BOMBER     5
#define ROLE_WEB_TRAPPER    6
#define ROLE_PRISON_BUILDER 7
#define ROLE_PYRO_FLOODER   8

typedef struct {
  uint32_t epoch;
  uint32_t horizon_tick;
  float aim_lead;
  float melee_aggression;
  float egg_bomb_rate;
  float web_trap_rate;
  float prison_build_rate;
  float pyro_fire_rate;
  float hydro_flood_rate;
  float cohesion;
  uint32_t active_fires;
  uint32_t active_floods;
  uint32_t imprisoned_count;
  uint32_t snared_count;
} CivHorizonParams;

void step_long_horizon_tuner(CivHorizonParams* p, uint32_t tick) {
  p->horizon_tick = tick;
  if ((tick % 180) == 0) {
    p->epoch++;
  }
  float phase = (float)(tick % 2400) / 2400.0f;
  p->aim_lead         = 0.65f + 0.30f * sinf(phase * 6.2831853f);
  p->melee_aggression = (p->imprisoned_count > 180) ? 0.92f : (0.58f + 0.25f * cosf(phase * 12.56637f));
  p->egg_bomb_rate    = 0.48f + 0.32f * sinf(phase * 9.42477f);
  p->web_trap_rate    = 0.45f + 0.35f * cosf(phase * 6.2831853f);
  p->prison_build_rate= (p->snared_count > 90) ? 0.88f : 0.42f;
  p->hydro_flood_rate = (p->active_fires > 18) ? 0.95f : 0.28f;
  p->pyro_fire_rate   = (p->active_floods > 24) ? 0.18f : 0.52f;
  p->cohesion         = 0.55f + 0.25f * sinf(phase * 3.1415926f);
}
