/**
 * wasm_bridge.js
 * Slopes 2 - Synchronous Universal WebAssembly Bridge (Browser + Node/MCP)
 *
 * Wraps the freestanding C-to-WASM simulation engine (sim/wasm_sim.c -> sim/wasm_sim.wasm)
 * and embeds the pre-evolved 25.16M-cell multi-society parameters (sim/evolved_world_params.json).
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    const inst = factory();
    module.exports = inst;
    if (typeof globalThis !== "undefined") globalThis.SlopesWasm = inst;
  } else {
    root.SlopesWasm = factory();
  }
})(typeof window !== "undefined" ? window : (typeof globalThis !== "undefined" ? globalThis : this), function () {
  "use strict";

  const WASM_BASE64 = "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IRIgAiARQQNxRSADIAJBFmxB0ABqIg5OcSIQaiECIAMgDkEBdkEAIBAbayEOAkAgAEEHcQ0AIA5BHkgNACAIIBFBD3FFIAhBJEhxaiEIIA9BAWohDwsgEkEtaiEUIAFBA3QgAkEDbGpBGGohAwJAAkAgAEEPcQ0AIAQgA04NAEEBIRMgBSAEQQNsSg0BC0EAIBFBH3FFIAQgA0pxayETCyAUIBIgEBshECAEIBNqIQQgBiAAQQFqIgBHDQALQQAgDjYCtIyEgABBACAFNgKwjISAAEEAIAQ2AqyMhIAAQQAgEDYCqIyEgABBACAPNgKkjISAAEEAIAI2AqCMhIAAQQAgATYCnIyEgABBACAOIA1rNgKYjISAAEEAIAUgDGs2ApSMhIAAQQAgBCAJazYCkIyEgAAgEAsL+QEBAEGAgAQL8AEAAAAADgAAABgAAAAOAAAAEgAAABAAAAAMAAAAEAAAAA4AAAAAAAAACAAAAA4AAAAaAAAAEgAAABYAAAAOAAAAEAAAABgAAAAAAAAAFgAAABIAAAAUAAAAEAAAAAwAAAAWAAAAGAAAABAAAAAAAAAAEgAAABYAAAAOAAAACgAAABoAAAASAAAAFAAAABYAAAACAAAADgAAAA4AAACMAAAAnAAAAA4AAACOAAAALAAAAE4AAAD8AAAAtAEAACwAAAAgAQAALAAAAKwAAAAAAQAATgAAANwAAABcAAAAjAAAACgBAACMAAAA1AAAACABAAAA4wIEbmFtZQAODXdhc21fc2ltLndhc20BggIMABFfX3dhc21fY2FsbF9jdG9ycwEGbWVtY3B5AgZtZW1zZXQDFHdhc21fZ2V0X3RlcnJhaW5fYnVmBBZ3YXNtX2dldF9ibHVlcHJpbnRfYnVmBRB3YXNtX2dldF93ZmNfYnVmBhN3YXNtX2dldF9yZXN1bHRfYnVmBx13YXNtX3J1bl9zY2llbnRpc3RfZXhwZXJpbWVudAgZd2FzbV9ldm9sdmVfY2l0eV9idWlsZGluZwkaZXZhbHVhdGVfYmx1ZXByaW50X2ZpdG5lc3MKEndhc21fc3RlcF93ZmNfc2VlcAsdd2FzbV9zaW11bGF0ZV9oeXBlcnRpbWVfYnVyc3QHOwQAD19fc3RhY2tfcG9pbnRlcgENX19tZW1vcnlfYmFzZQIMX190YWJsZV9iYXNlAwpfX3Rsc19iYXNlCQoBAAcucm9kYXRhACkJcHJvZHVjZXJzAQxwcm9jZXNzZWQtYnkBBWNsYW5nCTIzLjAuMGdpdACUAQ90YXJnZXRfZmVhdHVyZXMIKwtidWxrLW1lbW9yeSsPYnVsay1tZW1vcnktb3B0KxZjYWxsLWluZGlyZWN0LW92ZXJsb25nKwptdWx0aXZhbHVlKw9tdXRhYmxlLWdsb2JhbHMrE25vbnRyYXBwaW5nLWZwdG9pbnQrD3JlZmVyZW5jZS10eXBlcysIc2lnbi1leHQ=";

  const EVOLVED_WORLD_PARAMS = {
  "engine": "Slopes 2 - C-to-WASM Evolutionary Simulator & WFC City Architect",
  "societies": [
    {
      "faction_id": 0,
      "faction_name": "HUMAN_ORANGE",
      "labs": [
        {
          "lab_type": 0,
          "best_fitness": 9985,
          "dna_genome": 2700735743,
          "dna_hex": "0xA0F9F4FF",
          "craft_type": 0,
          "craft_name": "EVOLVED_FLORA_SEED",
          "recommended_conduit": 1,
          "conduit_name": "AETHER_LASER",
          "energy_yield_gain_pct": 350,
          "time_dilation_factor": 100,
          "transdimensional_resonance": 100,
          "traits": {
            "root_chassis": 15,
            "branching_wing": 15,
            "spore_thrust": 4,
            "color_freq": 15,
            "symbiosis_armor": 9,
            "conduit_conductance": 15,
            "craft_archetype": 0,
            "topology_affinity": 10
          }
        },
        {
          "lab_type": 1,
          "best_fitness": 9506,
          "dna_genome": 33549309,
          "dna_hex": "0x01FFEBFD",
          "craft_type": 1,
          "craft_name": "ORNITHOPTER_SKY_SKIFF",
          "recommended_conduit": 1,
          "conduit_name": "AETHER_LASER",
          "energy_yield_gain_pct": 350,
          "time_dilation_factor": 100,
          "transdimensional_resonance": 100,
          "traits": {
            "root_chassis": 13,
            "branching_wing": 15,
            "spore_thrust": 11,
            "color_freq": 14,
            "symbiosis_armor": 15,
            "conduit_conductance": 15,
            "craft_archetype": 1,
            "topology_affinity": 0
          }
        },
        {
          "lab_type": 2,
          "best_fitness": 9985,
          "dna_genome": 1711191549,
          "dna_hex": "0x65FEB5FD",
          "craft_type": 2,
          "craft_name": "SUBTERRANEAN_MOLE_DRILLER",
          "recommended_conduit": 0,
          "conduit_name": "COPPER_PIPE",
          "energy_yield_gain_pct": 350,
          "time_dilation_factor": 100,
          "transdimensional_resonance": 100,
          "traits": {
            "root_chassis": 13,
            "branching_wing": 15,
            "spore_thrust": 5,
            "color_freq": 11,
            "symbiosis_armor": 14,
            "conduit_conductance": 15,
            "craft_archetype": 5,
            "topology_affinity": 6
          }
        },
        {
          "lab_type": 3,
          "best_fitness": 9985,
          "dna_genome": 4177449915,
          "dna_hex": "0xF8FED3BB",
          "craft_type": 6,
          "craft_name": "CHRONOS_TIME_CRYSTAL",
          "recommended_conduit": 1,
          "conduit_name": "AETHER_LASER",
          "energy_yield_gain_pct": 350,
          "time_dilation_factor": 100,
          "transdimensional_resonance": 100,
          "traits": {
            "root_chassis": 11,
            "branching_wing": 11,
            "spore_thrust": 3,
            "color_freq": 13,
            "symbiosis_armor": 14,
            "conduit_conductance": 15,
            "craft_archetype": 8,
            "topology_affinity": 15
          }
        }
      ],
      "evolved_blueprint_15x12": {
        "fitness": 8296,
        "width": 15,
        "height": 12,
        "compute_core_cells": 18,
        "harvester_cells": 7,
        "conduit_ports": 7,
        "luminous_windows": 16,
        "roof_dome_spires": 17,
        "rows": [
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,5,0,0,8,0,8,0,0,5,0,0,0],
          [0,0,0,6,0,0,5,8,5,0,0,6,0,0,0],
          [0,5,0,2,8,8,3,5,3,8,8,2,0,5,0],
          [0,2,5,7,5,5,5,2,5,5,5,7,5,2,0],
          [0,2,3,4,2,4,3,7,3,4,2,4,3,2,0],
          [0,0,2,3,4,7,7,7,7,7,4,3,2,0,0],
          [0,5,3,4,2,7,4,7,4,7,2,4,2,5,0],
          [0,3,7,2,4,7,7,7,7,7,4,2,7,3,0],
          [0,6,2,4,2,4,3,6,3,4,2,4,6,6,0],
          [0,1,1,1,1,1,1,1,1,1,1,1,3,6,0],
          [0,0,1,1,1,1,1,1,1,1,1,1,1,0,0]
        ]
      },
      "wfc_sample_collapsed_cells": 980,
      "hypertime_10000_metrics": {
        "pop_delta": 625,
        "energy_delta": 16950,
        "compute_delta": 82434,
        "buildings_evolved": 1051,
        "crafts_birthed": 1861,
        "dna_mutations": 1250,
        "total_compute_work": 30235352
      }
    },
    {
      "faction_id": 1,
      "faction_name": "CORVUS_SKY",
      "labs": [
        {
          "lab_type": 0,
          "best_fitness": 9338,
          "dna_genome": 4042324479,
          "dna_hex": "0xF0F0F9FF",
          "craft_type": 1,
          "craft_name": "ORNITHOPTER_SKY_SKIFF",
          "recommended_conduit": 1,
          "conduit_name": "AETHER_LASER",
          "energy_yield_gain_pct": 350,
          "time_dilation_factor": 100,
          "transdimensional_resonance": 100,
          "traits": {
            "root_chassis": 15,
            "branching_wing": 15,
            "spore_thrust": 9,
            "color_freq": 15,
            "symbiosis_armor": 0,
            "conduit_conductance": 15,
            "craft_archetype": 0,
            "topology_affinity": 15
          }
        },
        {
          "lab_type": 1,
          "best_fitness": 9658,
          "dna_genome": 4093050864,
          "dna_hex": "0xF3F6FFF0",
          "craft_type": 1,
          "craft_name": "ORNITHOPTER_SKY_SKIFF",
          "recommended_conduit": 1,
          "conduit_name": "AETHER_LASER",
          "energy_yield_gain_pct": 350,
          "time_dilation_factor": 100,
          "transdimensional_resonance": 100,
          "traits": {
            "root_chassis": 0,
            "branching_wing": 15,
            "spore_thrust": 15,
            "color_freq": 15,
            "symbiosis_armor": 6,
            "conduit_conductance": 15,
            "craft_archetype": 3,
            "topology_affinity": 15
          }
        },
        {
          "lab_type": 2,
          "best_fitness": 9401,
          "dna_genome": 4043306739,
          "dna_hex": "0xF0FFF6F3",
          "craft_type": 4,
          "craft_name": "AETHER_LEVITATION_BARGE",
          "recommended_conduit": 1,
          "conduit_name": "AETHER_LASER",
          "energy_yield_gain_pct": 350,
          "time_dilation_factor": 100,
          "transdimensional_resonance": 100,
          "traits": {
            "root_chassis": 3,
            "branching_wing": 15,
            "spore_thrust": 6,
            "color_freq": 15,
            "symbiosis_armor": 15,
            "conduit_conductance": 15,
            "craft_archetype": 0,
            "topology_affinity": 15
          }
        },
        {
          "lab_type": 3,
          "best_fitness": 9985,
          "dna_genome": 4110214130,
          "dna_hex": "0xF4FCE3F2",
          "craft_type": 6,
          "craft_name": "CHRONOS_TIME_CRYSTAL",
          "recommended_conduit": 1,
          "conduit_name": "AETHER_LASER",
          "energy_yield_gain_pct": 350,
          "time_dilation_factor": 100,
          "transdimensional_resonance": 99,
          "traits": {
            "root_chassis": 2,
            "branching_wing": 15,
            "spore_thrust": 3,
            "color_freq": 14,
            "symbiosis_armor": 12,
            "conduit_conductance": 15,
            "craft_archetype": 4,
            "topology_affinity": 15
          }
        }
      ],
      "evolved_blueprint_15x12": {
        "fitness": 8148,
        "width": 15,
        "height": 12,
        "compute_core_cells": 18,
        "harvester_cells": 11,
        "conduit_ports": 8,
        "luminous_windows": 16,
        "roof_dome_spires": 12,
        "rows": [
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,5,0,8,8,8,0,5,0,0,0,0],
          [0,0,5,0,2,8,5,2,5,8,2,0,0,0,0],
          [0,0,8,8,3,5,2,6,2,5,4,8,8,0,0],
          [0,8,4,5,4,2,2,2,2,2,4,5,5,8,0],
          [0,5,3,7,3,4,3,2,3,4,3,7,3,5,0],
          [0,6,2,7,6,7,7,7,7,7,6,4,2,4,0],
          [0,6,2,4,3,7,7,7,7,7,3,4,2,4,0],
          [0,1,3,2,2,7,7,7,7,7,4,2,3,6,0],
          [0,1,1,1,1,4,2,2,2,4,2,4,0,6,0],
          [0,1,1,1,3,1,1,1,1,1,4,2,2,6,0],
          [0,0,0,0,3,0,0,3,0,0,1,1,1,1,0]
        ]
      },
      "wfc_sample_collapsed_cells": 980,
      "hypertime_10000_metrics": {
        "pop_delta": 625,
        "energy_delta": 9121,
        "compute_delta": 60772,
        "buildings_evolved": 1052,
        "crafts_birthed": 1878,
        "dna_mutations": 1250,
        "total_compute_work": 30570472
      }
    },
    {
      "faction_id": 2,
      "faction_name": "CERVUS_MYCELIAL",
      "labs": [
        {
          "lab_type": 0,
          "best_fitness": 9985,
          "dna_genome": 1122462650,
          "dna_hex": "0x42E76BBA",
          "craft_type": 0,
          "craft_name": "EVOLVED_FLORA_SEED",
          "recommended_conduit": 2,
          "conduit_name": "MYCELIAL_HYPHAE",
          "energy_yield_gain_pct": 350,
          "time_dilation_factor": 100,
          "transdimensional_resonance": 100,
          "traits": {
            "root_chassis": 10,
            "branching_wing": 11,
            "spore_thrust": 11,
            "color_freq": 6,
            "symbiosis_armor": 7,
            "conduit_conductance": 14,
            "craft_archetype": 2,
            "topology_affinity": 4
          }
        },
        {
          "lab_type": 1,
          "best_fitness": 9985,
          "dna_genome": 301465197,
          "dna_hex": "0x11F7FE6D",
          "craft_type": 5,
          "craft_name": "MYCELIAL_SPORE_GLIDER",
          "recommended_conduit": 2,
          "conduit_name": "MYCELIAL_HYPHAE",
          "energy_yield_gain_pct": 350,
          "time_dilation_factor": 100,
          "transdimensional_resonance": 100,
          "traits": {
            "root_chassis": 13,
            "branching_wing": 6,
            "spore_thrust": 14,
            "color_freq": 15,
            "symbiosis_armor": 7,
            "conduit_conductance": 15,
            "craft_archetype": 1,
            "topology_affinity": 1
          }
        },
        {
          "lab_type": 2,
          "best_fitness": 9985,
          "dna_genome": 2949899181,
          "dna_hex": "0xAFD3E3AD",
          "craft_type": 3,
          "craft_name": "AMPHIBIOUS_WAVE_STRIDER",
          "recommended_conduit": 2,
          "conduit_name": "MYCELIAL_HYPHAE",
          "energy_yield_gain_pct": 350,
          "time_dilation_factor": 100,
          "transdimensional_resonance": 100,
          "traits": {
            "root_chassis": 13,
            "branching_wing": 10,
            "spore_thrust": 3,
            "color_freq": 14,
            "symbiosis_armor": 3,
            "conduit_conductance": 13,
            "craft_archetype": 15,
            "topology_affinity": 10
          }
        },
        {
          "lab_type": 3,
          "best_fitness": 9985,
          "dna_genome": 3181753005,
          "dna_hex": "0xBDA5B2AD",
          "craft_type": 6,
          "craft_name": "CHRONOS_TIME_CRYSTAL",
          "recommended_conduit": 2,
          "conduit_name": "MYCELIAL_HYPHAE",
          "energy_yield_gain_pct": 350,
          "time_dilation_factor": 100,
          "transdimensional_resonance": 100,
          "traits": {
            "root_chassis": 13,
            "branching_wing": 10,
            "spore_thrust": 2,
            "color_freq": 11,
            "symbiosis_armor": 5,
            "conduit_conductance": 10,
            "craft_archetype": 13,
            "topology_affinity": 11
          }
        }
      ],
      "evolved_blueprint_15x12": {
        "fitness": 7903,
        "width": 15,
        "height": 12,
        "compute_core_cells": 18,
        "harvester_cells": 11,
        "conduit_ports": 8,
        "luminous_windows": 15,
        "roof_dome_spires": 15,
        "rows": [
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,5,6,0,6,5,0,0,0,0,0],
          [0,0,0,0,0,6,7,8,7,6,0,0,0,0,0],
          [0,0,3,8,8,8,4,5,4,8,8,8,3,5,0],
          [0,8,3,5,5,5,4,2,4,5,5,5,3,8,0],
          [0,5,3,5,3,4,3,6,3,4,3,2,5,0,0],
          [0,5,2,3,4,7,7,7,7,7,4,3,2,5,0],
          [0,0,6,7,8,7,7,7,7,7,8,4,2,0,0],
          [0,0,2,2,4,7,7,7,7,7,4,2,6,0,0],
          [0,0,1,4,2,4,3,3,3,4,2,4,2,6,0],
          [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
          [0,0,1,1,1,1,1,1,1,1,1,1,1,0,0]
        ]
      },
      "wfc_sample_collapsed_cells": 980,
      "hypertime_10000_metrics": {
        "pop_delta": 625,
        "energy_delta": 17005,
        "compute_delta": 61865,
        "buildings_evolved": 1185,
        "crafts_birthed": 1984,
        "dna_mutations": 1250,
        "total_compute_work": 35412288
      }
    },
    {
      "faction_id": 3,
      "faction_name": "SKEKSIS_GOO",
      "labs": [
        {
          "lab_type": 0,
          "best_fitness": 9985,
          "dna_genome": 1241494958,
          "dna_hex": "0x49FFB5AE",
          "craft_type": 7,
          "craft_name": "DARK_CRYSTAL_STRIDER",
          "recommended_conduit": 3,
          "conduit_name": "DARK_VEIN",
          "energy_yield_gain_pct": 350,
          "time_dilation_factor": 100,
          "transdimensional_resonance": 100,
          "traits": {
            "root_chassis": 14,
            "branching_wing": 10,
            "spore_thrust": 5,
            "color_freq": 11,
            "symbiosis_armor": 15,
            "conduit_conductance": 15,
            "craft_archetype": 9,
            "topology_affinity": 4
          }
        },
        {
          "lab_type": 1,
          "best_fitness": 9985,
          "dna_genome": 3254767296,
          "dna_hex": "0xC1FFCEC0",
          "craft_type": 7,
          "craft_name": "DARK_CRYSTAL_STRIDER",
          "recommended_conduit": 3,
          "conduit_name": "DARK_VEIN",
          "energy_yield_gain_pct": 350,
          "time_dilation_factor": 100,
          "transdimensional_resonance": 85,
          "traits": {
            "root_chassis": 0,
            "branching_wing": 12,
            "spore_thrust": 14,
            "color_freq": 12,
            "symbiosis_armor": 15,
            "conduit_conductance": 15,
            "craft_archetype": 1,
            "topology_affinity": 12
          }
        },
        {
          "lab_type": 2,
          "best_fitness": 9985,
          "dna_genome": 1761345398,
          "dna_hex": "0x68FBFF76",
          "craft_type": 2,
          "craft_name": "SUBTERRANEAN_MOLE_DRILLER",
          "recommended_conduit": 3,
          "conduit_name": "DARK_VEIN",
          "energy_yield_gain_pct": 350,
          "time_dilation_factor": 100,
          "transdimensional_resonance": 100,
          "traits": {
            "root_chassis": 6,
            "branching_wing": 7,
            "spore_thrust": 15,
            "color_freq": 15,
            "symbiosis_armor": 11,
            "conduit_conductance": 15,
            "craft_archetype": 8,
            "topology_affinity": 6
          }
        },
        {
          "lab_type": 3,
          "best_fitness": 9985,
          "dna_genome": 3537803966,
          "dna_hex": "0xD2DE9ABE",
          "craft_type": 7,
          "craft_name": "DARK_CRYSTAL_STRIDER",
          "recommended_conduit": 3,
          "conduit_name": "DARK_VEIN",
          "energy_yield_gain_pct": 350,
          "time_dilation_factor": 100,
          "transdimensional_resonance": 75,
          "traits": {
            "root_chassis": 14,
            "branching_wing": 11,
            "spore_thrust": 10,
            "color_freq": 9,
            "symbiosis_armor": 14,
            "conduit_conductance": 13,
            "craft_archetype": 2,
            "topology_affinity": 13
          }
        }
      ],
      "evolved_blueprint_15x12": {
        "fitness": 7743,
        "width": 15,
        "height": 12,
        "compute_core_cells": 18,
        "harvester_cells": 10,
        "conduit_ports": 8,
        "luminous_windows": 16,
        "roof_dome_spires": 13,
        "rows": [
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,2,0,8,0,0,0,8,0,0,0],
          [0,0,0,5,0,4,8,5,8,0,0,5,0,0,0],
          [0,0,5,6,0,8,5,4,5,8,0,6,5,0,0],
          [0,0,6,4,8,5,7,2,3,5,8,4,6,0,0],
          [0,8,6,4,5,4,2,3,2,4,5,2,6,8,0],
          [0,5,2,2,4,7,7,7,7,7,3,2,2,5,0],
          [0,4,2,7,4,7,7,7,7,7,4,4,2,2,0],
          [0,6,2,7,4,7,7,2,7,7,4,7,2,6,0],
          [0,3,3,3,2,4,3,3,3,4,2,3,1,1,0],
          [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
          [0,0,1,1,1,1,1,1,1,1,1,1,1,0,0]
        ]
      },
      "wfc_sample_collapsed_cells": 980,
      "hypertime_10000_metrics": {
        "pop_delta": 625,
        "energy_delta": 17775,
        "compute_delta": 43862,
        "buildings_evolved": 1051,
        "crafts_birthed": 1866,
        "dna_mutations": 1250,
        "total_compute_work": 30299481
      }
    }
  ],
  "sweep_summary": {
    "total_cells_simulated": 25165824,
    "total_blueprints_evolved": 3200,
    "total_wfc_cells_collapsed": 3920,
    "execution_time_ms": 98.77
  }
};

  const CRAFT_NAMES = [
    "EVOLVED_FLORA_SEED",
    "ORNITHOPTER_SKY_SKIFF",
    "SUBTERRANEAN_MOLE_DRILLER",
    "AMPHIBIOUS_WAVE_STRIDER",
    "AETHER_LEVITATION_BARGE",
    "MYCELIAL_SPORE_GLIDER",
    "CHRONOS_TIME_CRYSTAL",
    "DARK_CRYSTAL_STRIDER"
  ];

  const CONDUIT_NAMES = [
    "COPPER_PIPE",
    "AETHER_LASER",
    "MYCELIAL_HYPHAE",
    "DARK_VEIN"
  ];

  const TILE_NAMES = [
    "EMPTY",
    "FOUNDATION_STRUT",
    "MASONRY_WALL",
    "ARCH_SUPPORT",
    "LUMINOUS_WINDOW",
    "ROOF_DOME_SPIRE",
    "CONDUIT_PORT",
    "COMPUTE_CORE_CELL",
    "HARVESTER_ARRAY"
  ];

  function decodeBase64(b64) {
    if (typeof Buffer !== "undefined" && typeof Buffer.from === "function") {
      return new Uint8Array(Buffer.from(b64, "base64"));
    }
    const binStr = atob(b64);
    const bytes = new Uint8Array(binStr.length);
    for (let i = 0; i < binStr.length; i++) {
      bytes[i] = binStr.charCodeAt(i);
    }
    return bytes;
  }

  const wasmBytes = decodeBase64(WASM_BASE64);
  const wasmModule = new WebAssembly.Module(wasmBytes);
  const wasmInstance = new WebAssembly.Instance(wasmModule, {});
  const exportsObj = wasmInstance.exports;
  const memory = exportsObj.memory;

  const terrainPtr   = exportsObj.wasm_get_terrain_buf();
  const blueprintPtr = exportsObj.wasm_get_blueprint_buf();
  const wfcPtr       = exportsObj.wasm_get_wfc_buf();
  const resultPtr    = exportsObj.wasm_get_result_buf();

  function getTerrainView() {
    return new Uint8Array(memory.buffer, terrainPtr, 120);
  }

  function getBlueprintView() {
    return new Uint8Array(memory.buffer, blueprintPtr, 180);
  }

  function getWfcView() {
    return new Uint8Array(memory.buffer, wfcPtr, 980);
  }

  function getResultView() {
    return new Int32Array(memory.buffer, resultPtr, 16);
  }

  function decodeDnaTraits(dna) {
    const u = dna >>> 0;
    return {
      rootChassis:        (u >>>  0) & 0xF,
      branchingWing:      (u >>>  4) & 0xF,
      sporeThrust:        (u >>>  8) & 0xF,
      colorFreq:          (u >>> 12) & 0xF,
      symbiosisArmor:     (u >>> 16) & 0xF,
      conduitConductance: (u >>> 20) & 0xF,
      craftArchetype:     (u >>> 24) & 0xF,
      topologyAffinity:   (u >>> 28) & 0xF
    };
  }

  /**
   * 1. Run a Scientist Lab Evolutionary Experiment in C/WASM
   */
  function runScientistExperiment(opts) {
    const o = opts || {};
    const factionId = (o.factionId !== undefined ? o.factionId : 0) | 0;
    const labType   = (o.labType   !== undefined ? o.labType   : 0) | 0;
    const slope     = (o.slope     !== undefined ? o.slope     : 20) | 0;
    const moisture  = (o.moisture  !== undefined ? o.moisture  : 50) | 0;
    const energy    = (o.energy    !== undefined ? o.energy    : 200) | 0;
    const trials    = (o.trials    !== undefined ? o.trials    : 1024) | 0;
    const seed      = (o.seed      !== undefined ? o.seed      : 0x1337BEEF) >>> 0;

    const fitness = exportsObj.wasm_run_scientist_experiment(
      factionId, labType, slope, moisture, energy, trials, seed
    );

    const res = getResultView();
    const dnaGenome = res[1] >>> 0;
    const craftType = res[2] & 7;
    const conduitType = res[5] & 3;

    return {
      fitness:                   fitness,
      dnaGenome:                 dnaGenome,
      dnaHex:                    "0x" + dnaGenome.toString(16).toUpperCase().padStart(8, "0"),
      dnaTraits:                 decodeDnaTraits(dnaGenome),
      craftType:                 craftType,
      craftName:                 CRAFT_NAMES[craftType] || "EVOLVED_FLORA_SEED",
      cellsSimulated:            res[3],
      energyYieldGain:           res[4],
      conduitType:               conduitType,
      conduitName:               CONDUIT_NAMES[conduitType] || "COPPER_PIPE",
      timeDilationFactor:        res[6],
      transdimensionalResonance: res[7]
    };
  }

  /**
   * 2. Evolve a 15x12 Multi-Scale City Building Blueprint adapted to local slope
   */
  function evolveCityBuilding(opts) {
    const o = opts || {};
    const factionId   = (o.factionId   !== undefined ? o.factionId   : 0) | 0;
    const envType     = (o.envType     !== undefined ? o.envType     : 0) | 0;
    const rawCenterX  = (o.centerX     !== undefined ? o.centerX     : 60) | 0;
    const generations = (o.generations !== undefined ? o.generations : 160) | 0;
    const seed        = (o.seed        !== undefined ? o.seed        : 0xCAFEBABE) >>> 0;

    const terrain = getTerrainView();
    let centerX = rawCenterX;
    if (o.blocks && o.blocks.length) {
      const bLen = o.blocks.length;
      const offset = bLen > 120 ? Math.max(0, Math.min(bLen - 120, rawCenterX - 60)) : 0;
      centerX = Math.max(8, Math.min(111, rawCenterX - offset));
      const len = Math.min(120, bLen - offset);
      for (let i = 0; i < len; i++) {
        terrain[i] = o.blocks[offset + i] & 0xFF;
      }
    }

    const fitness = exportsObj.wasm_evolve_city_building(
      factionId, envType, centerX, generations, seed
    );

    const bpView = getBlueprintView();
    const gridCopy = new Uint8Array(180);
    gridCopy.set(bpView);

    const rows = [];
    for (let r = 0; r < 12; r++) {
      const row = [];
      for (let c = 0; c < 15; c++) {
        row.push(gridCopy[r * 15 + c]);
      }
      rows.push(row);
    }

    const res = getResultView();
    return {
      fitness:          fitness,
      width:            15,
      height:           12,
      grid:             gridCopy,
      rows:             rows,
      computeCoreCells: res[3],
      harvesterCells:   res[4],
      conduitPorts:     res[5],
      luminousWindows:  res[6],
      roofDomeSpires:   res[7]
    };
  }

  /**
   * 3. Step Wave Function Collapse (WFC) High-Res Micro-Tile City Seep
   */
  function stepWfcSeep(opts) {
    const o = opts || {};
    const width     = Math.max(3, Math.min(35, (o.width  !== undefined ? o.width  : 35) | 0));
    const height    = Math.max(3, Math.min(28, (o.height !== undefined ? o.height : 28) | 0));
    const factionId = (o.factionId !== undefined ? o.factionId : 0) | 0;
    const steps     = (o.steps     !== undefined ? o.steps     : 16) | 0;
    const seed      = (o.seed      !== undefined ? o.seed      : 0x89ABCDEF) >>> 0;

    const wfcView = getWfcView();
    const cellCount = width * height;

    if (o.grid && o.grid.length >= cellCount) {
      for (let i = 0; i < cellCount; i++) {
        wfcView[i] = o.grid[i] & 0xFF;
      }
    }

    const collapsed = exportsObj.wasm_step_wfc_seep(width, height, factionId, steps, seed);

    if (o.grid && o.grid.length >= cellCount) {
      for (let i = 0; i < cellCount; i++) {
        o.grid[i] = wfcView[i];
      }
    }

    return collapsed;
  }

  /**
   * 4. Simulate 100x Hypertime Civilization Burst in C/WASM
   */
  function simulateHypertimeBurst(opts) {
    const o = opts || {};
    const factionId = (o.factionId !== undefined ? o.factionId : 0) | 0;
    const pop       = (o.pop       !== undefined ? o.pop       : 20) | 0;
    const energy    = (o.energy    !== undefined ? o.energy    : 300) | 0;
    const compute   = (o.compute   !== undefined ? o.compute   : 100) | 0;
    const steps     = (o.steps     !== undefined ? o.steps     : 500) | 0;
    const seed      = (o.seed      !== undefined ? o.seed      : 0x42424242) >>> 0;

    const workDone = exportsObj.wasm_simulate_hypertime_burst(
      factionId, pop, energy, compute, steps, seed
    );

    const res = getResultView();
    return {
      popDelta:         res[0],
      energyDelta:      res[1],
      computeDelta:     res[2],
      buildingsEvolved: res[3],
      craftsBirthed:    res[4],
      dnaMutations:     res[5],
      workDone:         workDone
    };
  }

  return {
    isReady:                true,
    wasmExports:            exportsObj,
    wasmMemory:             memory,
    CRAFT_NAMES:            CRAFT_NAMES,
    CONDUIT_NAMES:          CONDUIT_NAMES,
    TILE_NAMES:             TILE_NAMES,
    EvolvedWorldParams:     EVOLVED_WORLD_PARAMS,
    decodeDnaTraits:        decodeDnaTraits,
    runScientistExperiment: runScientistExperiment,
    evolveCityBuilding:     evolveCityBuilding,
    stepWfcSeep:            stepWfcSeep,
    simulateHypertimeBurst: simulateHypertimeBurst
  };
});
