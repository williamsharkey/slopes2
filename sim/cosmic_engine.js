/* ============================================================================
 * SLOPES 2 — WFC MULTI-RESOLUTION SEEPING, RECURSIVE POCKET WORLDS,
 *            SCIENTIST LABS, ENERGY CONDUITS, WORKER SWARMS, RIDEABLE CRAFTS,
 *            100x CHRONOS TIME CRYSTALS & TRANSDIMENSIONAL BEINGS ENGINE
 * Module: /sim/cosmic_engine.js (window.SlopesCosmic & CommonJS module.exports)
 *
 * Expands the 840x525 (SCALE=7 per 120x75 coarse cell) Prime Pixel World with:
 *   1. Wave Function Collapse (WFC) Seeping Multi-Resolution Zones (cosmic.WfcZones)
 *   2. Recursive Objects & Pocket Micro-Worlds + 22x15 PiP Viewport (cosmic.RecursiveObjects)
 *   3. Scientist Lifeforms, Biological Fungal Compute Centers & Bird Sky Labs (cosmic.Labs, cosmic.Scientists)
 *   4. Energy & Compute Conduit Networks & Shuttling 7x7 Packets (cosmic.Conduits, cosmic.Packets)
 *   5. Multi-Species Worker Swarms & Evolutionary 15x12 City Builders (cosmic.Workers, cosmic.BuildSites)
 *   6. Evolving 32-Bit DNA Plants/Fauna & Rideable Crafts (cosmic.EvolvedFlora, cosmic.Crafts)
 *   7. Chronos Time-Dilation Crystals & 100x Hyper-Time (cosmic.TimeCrystals)
 *   8. 4 Transdimensional Beings / Angels on Non-Standard Topological Slices (cosmic.Transdimensionals)
 * ============================================================================ */

(function (global) {
  "use strict";

  const COARSE_W = 144;
  const COARSE_H = 90;
  const SCALE = 7;
  const NATIVE_W = COARSE_W * SCALE; // 1008
  const NATIVE_H = COARSE_H * SCALE; // 630

  // Tile constants matching sim/wasm_sim.c & sim/wasm_bridge.js
  const WFC_TILES = {
    UNCOLLAPSED: 0,
    FOUNDATION_STRUT: 1,
    MASONRY_WALL: 2,
    ARCH_SUPPORT: 3,
    LUMINOUS_WINDOW: 4,
    ROOF_DOME_SPIRE: 5,
    CONDUIT_PORT: 6,
    COMPUTE_CORE_CELL: 7,
    HARVESTER_ARRAY: 8,
  };

  // Faction constants
  const FACTIONS = {
    HUMAN_ORANGE: 0,
    CORVUS_SKY: 1,
    CERVUS_MYCELIAL: 2,
    SKEKSIS_GOO: 3,
  };

  const FACTION_NAMES = [
    "HUMAN_ORANGE",
    "CORVUS_SKY",
    "CERVUS_MYCELIAL",
    "SKEKSIS_GOO",
  ];

  // Conduit types
  const CONDUIT_TYPES = {
    COPPER_PIPE: "COPPER_PIPE",
    AETHER_LASER: "AETHER_LASER",
    MYCELIAL_HYPHAE: "MYCELIAL_HYPHAE",
    DARK_VEIN: "DARK_VEIN",
  };

  const CONDUIT_LIST = [
    CONDUIT_TYPES.COPPER_PIPE,
    CONDUIT_TYPES.AETHER_LASER,
    CONDUIT_TYPES.MYCELIAL_HYPHAE,
    CONDUIT_TYPES.DARK_VEIN,
  ];

  // Rideable Craft types
  const CRAFT_ARCHETYPES = [
    "ORNITHOPTER_SKY_SKIFF",
    "SUBTERRANEAN_MOLE_DRILLER",
    "AMPHIBIOUS_WAVE_STRIDER",
    "AETHER_LEVITATION_BARGE",
  ];

  // Transdimensional Beings
  const TRANSDIMENSIONAL_ARCHETYPES = [
    "SERAPH_LATTICE",
    "CORVUS_AETHER_ANGEL",
    "MYCELIAL_ARCHON",
    "QLIPHOTH_VOID_EEL",
  ];

  // ==========================================================================
  // DETERMINISTIC FAST PRNG & PURE-JS FALLBACKS FOR WASM BRIDGE
  // ==========================================================================
  function xorshift32(seed) {
    let x = (seed >>> 0) || 0x9e3779b9;
    x ^= (x << 13) >>> 0;
    x ^= x >>> 17;
    x ^= (x << 5) >>> 0;
    return x >>> 0;
  }

  function decodeDnaTraitsFallback(dna) {
    const u = dna >>> 0;
    return {
      rootChassis: (u >>> 0) & 0xf,
      branchingWing: (u >>> 4) & 0xf,
      sporeThrust: (u >>> 8) & 0xf,
      colorFreq: (u >>> 12) & 0xf,
      symbiosisArmor: (u >>> 16) & 0xf,
      conduitConductance: (u >>> 20) & 0xf,
      craftArchetype: (u >>> 24) & 0xf,
      topologyAffinity: (u >>> 28) & 0xf,
    };
  }

  // Adjacency rules for pure-JS entropy-minimizing WFC fallback
  // Bitmask of valid neighbors (bits 1..8)
  const WFC_COMPAT = [
    0x1fe, // 0: any
    (1 << 1) | (1 << 2) | (1 << 3) | (1 << 6), // 1: FOUNDATION_STRUT
    (1 << 1) | (1 << 2) | (1 << 3) | (1 << 4) | (1 << 5) | (1 << 6) | (1 << 7), // 2: MASONRY_WALL
    (1 << 1) | (1 << 2) | (1 << 3) | (1 << 4) | (1 << 5) | (1 << 7) | (1 << 8), // 3: ARCH_SUPPORT
    (1 << 2) | (1 << 3) | (1 << 4) | (1 << 5) | (1 << 7), // 4: LUMINOUS_WINDOW
    (1 << 2) | (1 << 3) | (1 << 4) | (1 << 5) | (1 << 8), // 5: ROOF_DOME_SPIRE
    (1 << 1) | (1 << 2) | (1 << 6) | (1 << 7) | (1 << 8), // 6: CONDUIT_PORT
    (1 << 2) | (1 << 3) | (1 << 4) | (1 << 6) | (1 << 7), // 7: COMPUTE_CORE_CELL
    (1 << 3) | (1 << 5) | (1 << 6) | (1 << 8), // 8: HARVESTER_ARRAY
  ];

  function countBits9(mask) {
    let m = mask & 0x1fe;
    let c = 0;
    while (m) {
      m &= m - 1;
      c++;
    }
    return c;
  }

  function stepWfcSeepFallback(opts) {
    const grid = opts.grid;
    const width = opts.width || 15;
    const height = opts.height || 12;
    const factionId = (opts.factionId || 0) & 3;
    const steps = opts.steps || 12;
    let s = (opts.seed || 0x89abcdef) >>> 0;
    if (!grid) return 0;

    // Ensure at least one seed tile is present near the bottom center
    let hasSeed = false;
    const total = width * height;
    for (let i = 0; i < total; i++) {
      if (grid[i] > 0) {
        hasSeed = true;
        break;
      }
    }
    if (!hasSeed) {
      const midX = (width >> 1);
      const botY = height - 1;
      grid[botY * width + midX] = WFC_TILES.FOUNDATION_STRUT;
      if (midX > 0) grid[botY * width + midX - 1] = WFC_TILES.FOUNDATION_STRUT;
      if (midX + 1 < width) grid[botY * width + midX + 1] = WFC_TILES.FOUNDATION_STRUT;
      if (botY > 0) grid[(botY - 1) * width + midX] = WFC_TILES.COMPUTE_CORE_CELL;
    }

    // Perform `steps` lowest-entropy collapses along the uncollapsed wave front
    for (let step = 0; step < steps; step++) {
      let bestIdx = -1;
      let bestEntropy = 99;
      let bestMask = 0x1fe;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = y * width + x;
          if (grid[idx] !== 0) continue;

          // Check 4-connected neighbors
          let hasCollapsedNeighbor = false;
          let domain = 0x1fe;
          if (y + 1 < height && grid[(y + 1) * width + x] > 0) {
            hasCollapsedNeighbor = true;
            domain &= WFC_COMPAT[grid[(y + 1) * width + x]] || 0x1fe;
          }
          if (y > 0 && grid[(y - 1) * width + x] > 0) {
            hasCollapsedNeighbor = true;
            domain &= WFC_COMPAT[grid[(y - 1) * width + x]] || 0x1fe;
          }
          if (x > 0 && grid[y * width + x - 1] > 0) {
            hasCollapsedNeighbor = true;
            domain &= WFC_COMPAT[grid[y * width + x - 1]] || 0x1fe;
          }
          if (x + 1 < width && grid[y * width + x + 1] > 0) {
            hasCollapsedNeighbor = true;
            domain &= WFC_COMPAT[grid[y * width + x + 1]] || 0x1fe;
          }

          if (!hasCollapsedNeighbor) continue;
          if (domain === 0) domain = 0x1fe;

          // Row bias: bottom rows favor foundations/walls, top rows favor domes/harvesters
          if (y >= height - 2) {
            domain &= (1 << 1) | (1 << 2) | (1 << 3) | (1 << 6);
          } else if (y <= 2) {
            domain &= (1 << 4) | (1 << 5) | (1 << 8) | (1 << 3);
          }
          if (domain === 0) domain = (1 << 2) | (1 << 3) | (1 << 4);

          const ent = countBits9(domain);
          s = xorshift32(s + idx + step);
          if (ent < bestEntropy || (ent === bestEntropy && (s & 3) === 0)) {
            bestEntropy = ent;
            bestIdx = idx;
            bestMask = domain;
          }
        }
      }

      if (bestIdx < 0) break;

      // Faction-weighted tile selection from bestMask
      s = xorshift32(s);
      const candidates = [];
      for (let t = 1; t <= 8; t++) {
        if (bestMask & (1 << t)) {
          let w = 1;
          if (factionId === FACTIONS.HUMAN_ORANGE && (t === 2 || t === 3 || t === 4)) w = 3;
          if (factionId === FACTIONS.CORVUS_SKY && (t === 5 || t === 8 || t === 3)) w = 3;
          if (factionId === FACTIONS.CERVUS_MYCELIAL && (t === 7 || t === 6 || t === 4)) w = 3;
          if (factionId === FACTIONS.SKEKSIS_GOO && (t === 5 || t === 3 || t === 6)) w = 3;
          for (let k = 0; k < w; k++) candidates.push(t);
        }
      }
      grid[bestIdx] = candidates.length > 0 ? candidates[s % candidates.length] : 2;
    }

    let collapsed = 0;
    for (let i = 0; i < total; i++) {
      if (grid[i] > 0) collapsed++;
    }
    return collapsed;
  }

  function runScientistExperimentFallback(opts) {
    const factionId = (opts.factionId || 0) & 3;
    const labType = (opts.labType || 0) & 3;
    const trials = opts.trials || 1024;
    let s = xorshift32((opts.seed || 0x1337beef) ^ (factionId * 7919) ^ (labType * 2971));

    let bestDna = s;
    let bestFit = 750;
    for (let i = 0; i < Math.min(trials, 256); i++) {
      s = xorshift32(s + i);
      const traits = decodeDnaTraitsFallback(s);
      const fit =
        680 +
        traits.branchingWing * 14 +
        traits.rootChassis * 12 +
        traits.conduitConductance * 15 +
        traits.colorFreq * 9 +
        ((factionId === traits.topologyAffinity % 4) ? 85 : 0);
      if (fit > bestFit) {
        bestFit = fit;
        bestDna = s;
      }
    }
    const craftMap = [1, 1, 2, 3];
    const craftType = (labType + factionId) % 8;
    const conduitType = factionId & 3;
    const craftNames = [
      "EVOLVED_FLORA_SEED",
      "ORNITHOPTER_SKY_SKIFF",
      "SUBTERRANEAN_MOLE_DRILLER",
      "AMPHIBIOUS_WAVE_STRIDER",
      "AETHER_LEVITATION_BARGE",
      "MYCELIAL_SPORE_GLIDER",
      "CHRONOS_TIME_CRYSTAL",
      "DARK_CRYSTAL_STRIDER",
    ];
    return {
      fitness: bestFit,
      dnaGenome: bestDna >>> 0,
      dnaHex: "0x" + (bestDna >>> 0).toString(16).toUpperCase().padStart(8, "0"),
      dnaTraits: decodeDnaTraitsFallback(bestDna),
      craftType: craftMap[factionId] || craftType,
      craftName: craftNames[craftType] || "ORNITHOPTER_SKY_SKIFF",
      cellsSimulated: trials * 38,
      energyYieldGain: 280 + (bestFit % 120),
      conduitType,
      conduitName: CONDUIT_LIST[conduitType],
      timeDilationFactor: 100,
      transdimensionalResonance: 95,
    };
  }

  function evolveCityBuildingFallback(opts) {
    const factionId = (opts.factionId || 0) & 3;
    const width = 15;
    const height = 12;
    const grid = new Uint8Array(width * height);
    const rows = [];
    let s = xorshift32((opts.seed || 0xcafebabe) ^ (factionId * 4099));

    let computeCoreCells = 0;
    let harvesterCells = 0;
    let conduitPorts = 0;
    let luminousWindows = 0;
    let roofDomeSpires = 0;

    for (let r = 0; r < height; r++) {
      const row = [];
      for (let c = 0; c < width; c++) {
        const distMid = Math.abs(c - 7);
        let tile = 0;
        if (r >= 10) {
          if (distMid <= 6) tile = WFC_TILES.FOUNDATION_STRUT;
        } else if (r >= 6 && r <= 9) {
          if (distMid <= 2) tile = WFC_TILES.COMPUTE_CORE_CELL;
          else if (distMid === 3 || distMid === 5) tile = ((r + c) & 1) ? WFC_TILES.LUMINOUS_WINDOW : WFC_TILES.MASONRY_WALL;
          else if (distMid === 4) tile = WFC_TILES.ARCH_SUPPORT;
          else if (distMid === 6 && r >= 8) tile = WFC_TILES.CONDUIT_PORT;
        } else if (r >= 3 && r <= 5) {
          if (distMid <= 1) tile = WFC_TILES.ROOF_DOME_SPIRE;
          else if (distMid <= 4) tile = ((r + c + factionId) % 3 === 0) ? WFC_TILES.HARVESTER_ARRAY : WFC_TILES.ARCH_SUPPORT;
        } else if (r === 1 || r === 2) {
          if (distMid === 0 || distMid === 3) tile = WFC_TILES.ROOF_DOME_SPIRE;
          else if (distMid === 1) tile = WFC_TILES.HARVESTER_ARRAY;
        }
        s = xorshift32(s + r * 15 + c);
        grid[r * width + c] = tile;
        row.push(tile);
        if (tile === WFC_TILES.COMPUTE_CORE_CELL) computeCoreCells++;
        else if (tile === WFC_TILES.HARVESTER_ARRAY) harvesterCells++;
        else if (tile === WFC_TILES.CONDUIT_PORT) conduitPorts++;
        else if (tile === WFC_TILES.LUMINOUS_WINDOW) luminousWindows++;
        else if (tile === WFC_TILES.ROOF_DOME_SPIRE) roofDomeSpires++;
      }
      rows.push(row);
    }

    return {
      fitness: 8120 + factionId * 95,
      width,
      height,
      grid,
      rows,
      computeCoreCells,
      harvesterCells,
      conduitPorts,
      luminousWindows,
      roofDomeSpires,
    };
  }

  function simulateHypertimeBurstFallback(opts) {
    const steps = opts.steps || 500;
    const pop = opts.pop || 16;
    const energy = opts.energy || 240;
    const compute = opts.compute || 120;
    return {
      popDelta: Math.max(4, Math.floor(steps * 0.08)),
      energyDelta: Math.floor(steps * 2.4 + energy * 0.5),
      computeDelta: Math.floor(steps * 6.5 + compute * 1.2),
      buildingsEvolved: Math.max(1, Math.floor(steps / 120)),
      craftsBirthed: Math.max(1, Math.floor(steps / 90)),
      dnaMutations: Math.max(2, Math.floor(steps / 40)),
      workDone: steps * (pop + compute),
    };
  }

  function getWasmBridge() {
    if (global.SlopesWasm && global.SlopesWasm.isReady) {
      return global.SlopesWasm;
    }
    return {
      isReady: true,
      decodeDnaTraits: decodeDnaTraitsFallback,
      runScientistExperiment: runScientistExperimentFallback,
      evolveCityBuilding: evolveCityBuildingFallback,
      stepWfcSeep: stepWfcSeepFallback,
      simulateHypertimeBurst: simulateHypertimeBurstFallback,
    };
  }

  // ==========================================================================
  // CREATE COSMIC SYSTEM INSTANCE
  // ==========================================================================
  function createCosmicSystem() {
    let prngState = 0x5109e52a;
    function nextRand() {
      prngState = xorshift32(prngState);
      return (prngState >>> 0) / 4294967296;
    }
    function nextRandInt(lo, hi) {
      return Math.floor(nextRand() * (hi - lo + 1)) + lo;
    }

    const cosmic = {
      frameCount: 0,
      timeDilation: 1,
      hypertimeTimer: 0,
      hypertimeAuraPhase: 0,
      topologySlice: 0.0,
      lastHypertimeMetrics: null,
      mountedCraft: null,
      activePocket: null,
      pipTarget: null,

      // 1. Wave Function Collapse Multi-Resolution Zones
      WfcZones: [],
      // 2. Recursive Objects & Pocket Micro-Worlds
      RecursiveObjects: [],
      // 3. Scientist Lifeforms & Research Labs (Fungal Compute Centers, Bird Sky Labs, Goo Lairs, Town Vat Labs)
      Labs: [],
      Scientists: [],
      ExperimentLogs: [],
      // 4. Energy & Compute Conduits + Shuttling Packets
      Conduits: [],
      Packets: [],
      // 5. Multi-Species Worker Swarms & Evolutionary Building Construction Sites
      BuildSites: [],
      Workers: [],
      // 6. Evolving 32-Bit DNA Flora/Fauna & Rideable Crafts
      EvolvedFlora: [],
      Crafts: [],
      // 7. Faceted Chronos Time-Dilation Crystals
      TimeCrystals: [],
      // 8. Transdimensional Beings / Angels
      Transdimensionals: [],
    };

    // Cached reference to last seen world & eco for zero-arg helper calls
    let lastWorldRef = null;
    let lastEcoRef = null;

    function elevAt(world, x) {
      const col = Math.max(0, Math.min(COARSE_W - 1, Math.round(x)));
      if (world && world.Blocks && world.Blocks[col] !== undefined) {
        return world.Blocks[col];
      }
      return 16;
    }

    function factionStringToId(f) {
      if (typeof f === "number") return f & 3;
      const s = String(f || "").toLowerCase();
      if (s.includes("bird") || s.includes("corvus") || s.includes("sky") || s.includes("airship")) return FACTIONS.CORVUS_SKY;
      if (s.includes("deer") || s.includes("cervus") || s.includes("fungal") || s.includes("mycel")) return FACTIONS.CERVUS_MYCELIAL;
      if (s.includes("goo") || s.includes("skeksis") || s.includes("evil") || s.includes("lair")) return FACTIONS.SKEKSIS_GOO;
      return FACTIONS.HUMAN_ORANGE;
    }

    // ========================================================================
    // 1. WAVE FUNCTION COLLAPSE (WFC) SEEPING ZONES
    // ========================================================================
    function createWfcZone(x, y, w, h, factionId, targetKind, resolution) {
      const res = resolution || 3; // 3 -> 3x3 subgrid, 5 -> 5x5, 7 -> 7x7
      const subW = Math.min(35, Math.max(6, w * res));
      const subH = Math.min(28, Math.max(6, h * res));
      const grid = new Uint8Array(subW * subH);

      // Seed initial foundation and core cell at bottom center so WFC seeps organically outward
      const midX = subW >> 1;
      const botY = subH - 1;
      grid[botY * subW + midX] = WFC_TILES.FOUNDATION_STRUT;
      if (midX > 0) grid[botY * subW + midX - 1] = WFC_TILES.FOUNDATION_STRUT;
      if (midX + 1 < subW) grid[botY * subW + midX + 1] = WFC_TILES.FOUNDATION_STRUT;
      if (botY > 0) grid[(botY - 1) * subW + midX] = WFC_TILES.COMPUTE_CORE_CELL;

      const zone = {
        id: `wfc-${targetKind || "zone"}-${cosmic.WfcZones.length + 1}`,
        x: Math.max(2, Math.min(COARSE_W - w - 2, Math.round(x))),
        y: Math.max(4, Math.min(COARSE_H - 4, Math.round(y))),
        w,
        h,
        subW,
        subH,
        resolution: res,
        factionId: factionId & 3,
        factionName: FACTION_NAMES[factionId & 3],
        targetKind: targetKind || "town",
        grid,
        collapsedCount: 4,
        totalCells: subW * subH,
        collapsePct: +((4 / (subW * subH)) * 100).toFixed(1),
        seed: xorshift32(prngState + x * 97 + y * 31),
        pulse: nextRand() * Math.PI * 2,
      };

      // Step once immediately so zone starts visibly seeded
      stepSingleWfcZone(zone, 18);
      return zone;
    }

    function stepSingleWfcZone(zone, steps) {
      if (!zone || !zone.grid) return 0;
      const wasm = getWasmBridge();
      zone.seed = xorshift32(zone.seed + steps + cosmic.frameCount);

      let collapsed = 0;
      if (wasm && typeof wasm.stepWfcSeep === "function") {
        collapsed = wasm.stepWfcSeep({
          grid: zone.grid,
          width: zone.subW,
          height: zone.subH,
          factionId: zone.factionId,
          steps: steps || 8,
          seed: zone.seed,
        });
      }
      // Also run pure-JS entropy solver pass if any cells remain uncollapsed and wasm returned 0
      if (collapsed <= zone.collapsedCount && zone.collapsedCount < zone.totalCells) {
        collapsed = stepWfcSeepFallback({
          grid: zone.grid,
          width: zone.subW,
          height: zone.subH,
          factionId: zone.factionId,
          steps: Math.max(2, steps >> 1),
          seed: zone.seed,
        });
      }
      zone.collapsedCount = collapsed;
      zone.collapsePct = +((collapsed / Math.max(1, zone.totalCells)) * 100).toFixed(1);
      return collapsed;
    }

    function triggerWfcSeepAt(x, y, factionId, targetKind) {
      const fId = factionStringToId(factionId);
      const cx = typeof x === "number" ? Math.round(x) : (lastWorldRef && lastWorldRef.P ? lastWorldRef.P.x : 60);
      const cy = typeof y === "number" ? Math.round(y) : elevAt(lastWorldRef, cx);

      // Check if a WFC zone already exists nearby; if so, boost its seeping and resolution!
      for (let i = 0; i < cosmic.WfcZones.length; i++) {
        const z = cosmic.WfcZones[i];
        if (Math.abs(z.x + z.w * 0.5 - cx) <= 6) {
          z.factionId = fId;
          stepSingleWfcZone(z, 32);
          return z;
        }
      }

      const w = 5;
      const h = 4;
      const res = fId === FACTIONS.CERVUS_MYCELIAL || fId === FACTIONS.CORVUS_SKY ? 5 : 3;
      const zone = createWfcZone(cx - 2, cy, w, h, fId, targetKind || "cliff", res);
      if (cosmic.WfcZones.length >= 8) cosmic.WfcZones.shift();
      cosmic.WfcZones.push(zone);
      stepSingleWfcZone(zone, 28);
      return zone;
    }

    // ========================================================================
    // 2. RECURSIVE OBJECTS & POCKET MICRO-WORLDS (+ 22x15 PiP VIEWPORT)
    // ========================================================================
    function createPocketMicroWorld(hostType, label, hostX, hostY, factionId, seed) {
      const pw = 44; // Micro-world terrain columns
      const ph = 28; // Micro-world elevation range
      const heights = new Uint8Array(pw);
      const caGrid = new Uint8Array(7 * 7);
      let s = xorshift32(seed || 0x12345678);

      for (let i = 0; i < pw; i++) {
        s = xorshift32(s + i);
        const wave = Math.sin((i / pw) * Math.PI * 2 * (hostType === "sky_lab" ? 1.5 : 1.0)) * 3.5;
        const arch = hostType === "time_crystal" ? Math.max(0, 6 - Math.abs(i - 22) * 0.45) : 0;
        heights[i] = Math.max(3, Math.min(ph - 6, Math.round(8 + wave + arch + (s % 3))));
      }

      for (let i = 0; i < 49; i++) {
        s = xorshift32(s + i * 19);
        caGrid[i] = s % 5;
      }

      // Internal worker wisps & DNA double-helices inside the pocket micro-world
      const wisps = [];
      for (let w = 0; w < 4; w++) {
        s = xorshift32(s + w * 71);
        wisps.push({
          x: 6 + w * 9,
          y: heights[6 + w * 9] + 2 + (w & 1) * 3,
          vx: (w % 2 === 0 ? 1 : -1) * 0.22,
          phase: (s % 100) * 0.06,
          role: w === 0 ? "dna_tuner" : w === 1 ? "crystal_keeper" : "ca_weaver",
        });
      }

      return {
        id: `pocket-${hostType}-${hostX}`,
        hostType,
        label,
        hostX,
        hostY,
        factionId: factionId & 3,
        pw,
        ph,
        heights,
        caGrid,
        wisps,
        dnaPhase: 0,
        innerCrystalX: 22,
        innerDnaX: 12,
        playerX: 20,
        playerY: heights[20] + 1,
        depth: 1,
      };
    }

    function stepPocketMicroWorld(pocket, dtMult) {
      if (!pocket) return;
      pocket.dnaPhase += 0.12 * Math.min(6, dtMult);

      // Step internal 7x7 CA core
      if ((cosmic.frameCount & 1) === 0) {
        const g = pocket.caGrid;
        for (let i = 0; i < 49; i++) {
          const left = g[(i + 48) % 49];
          const right = g[(i + 1) % 49];
          const up = g[(i + 42) % 49];
          const sum = left + right + up;
          if (g[i] === 0 && (sum === 3 || sum === 5)) g[i] = 2;
          else if (g[i] === 2 && sum >= 4) g[i] = 3;
          else if (g[i] === 3) g[i] = 4;
          else if (g[i] === 4) g[i] = 1;
          else if (g[i] === 1 && sum < 2) g[i] = 0;
        }
      }

      // Move internal worker wisps
      for (let i = 0; i < pocket.wisps.length; i++) {
        const w = pocket.wisps[i];
        w.x += w.vx * Math.min(4, dtMult * 0.5);
        w.phase += 0.16;
        if (w.x < 3) {
          w.x = 3;
          w.vx = Math.abs(w.vx);
        } else if (w.x > pocket.pw - 4) {
          w.x = pocket.pw - 4;
          w.vx = -Math.abs(w.vx);
        }
        const col = Math.max(0, Math.min(pocket.pw - 1, Math.round(w.x)));
        w.y = pocket.heights[col] + 2 + Math.sin(w.phase) * 1.5;
      }
    }

    function enterOrExitRecursive(world, eco, requestedType) {
      const w = world || lastWorldRef;
      if (cosmic.activePocket) {
        const exited = cosmic.activePocket;
        cosmic.activePocket = null;
        if (w && typeof w.announceSky === "function") {
          w.announceSky("EXITED POCKET WORLD", exited.label.slice(0, 18).toUpperCase(), 145);
        }
        return null;
      }

      const px = w && w.P ? w.P.x : 60;
      let bestObj = null;
      let bestDist = 999;

      for (let i = 0; i < cosmic.RecursiveObjects.length; i++) {
        const ro = cosmic.RecursiveObjects[i];
        if (requestedType && !ro.type.toLowerCase().includes(String(requestedType).toLowerCase())) {
          continue;
        }
        const d = Math.abs(ro.x - px);
        if (d < bestDist) {
          bestDist = d;
          bestObj = ro;
        }
      }

      if (!bestObj && cosmic.RecursiveObjects.length > 0) {
        bestObj = cosmic.RecursiveObjects[0];
      }

      if (bestObj && bestObj.pocket) {
        cosmic.activePocket = bestObj.pocket;
        cosmic.activePocket.playerX = Math.floor(cosmic.activePocket.pw / 2);
        cosmic.activePocket.playerY = cosmic.activePocket.heights[cosmic.activePocket.playerX] + 1;
        if (w && typeof w.announceSky === "function") {
          w.announceSky("ENTERED POCKET WORLD!", bestObj.label.slice(0, 18).toUpperCase(), 165);
        }
        return cosmic.activePocket;
      }
      return null;
    }

    // ========================================================================
    // 3. SCIENTIST LIFEFORMS, FUNGAL COMPUTE CENTERS, SKY LABS & WASM EXPERIMENTS
    // ========================================================================
    function createLabAndScientist(factionId, x, y, labKind, label) {
      const lab = {
        id: `lab-${labKind}-${x}`,
        factionId: factionId & 3,
        factionName: FACTION_NAMES[factionId & 3],
        kind: labKind, // "fungal_compute_center", "bird_sky_lab", "goo_lair_network", "human_vat_lab"
        label,
        x: Math.max(8, Math.min(COARSE_W - 9, Math.round(x))),
        y: Math.max(6, Math.min(COARSE_H - 8, Math.round(y))),
        computeBuffer: 65,
        energyBuffer: 80,
        experimentsRun: 0,
        lastFitness: 0,
        lastDna: 0x42e76bba,
        rotorPhase: nextRand() * Math.PI * 2,
        holoPhase: nextRand() * Math.PI * 2,
        activePulse: 0,
      };

      const sciNames = [
        "Savant Archim-9",
        "Dr. Corvus-Prime",
        "Arch-Stag Cervus-7",
        "Alchemist Skek-Tek",
      ];
      const scientist = {
        id: `sci-${FACTION_NAMES[factionId & 3].toLowerCase()}-${x}`,
        name: sciNames[factionId & 3],
        factionId: factionId & 3,
        species:
          factionId === FACTIONS.CERVUS_MYCELIAL
            ? "GENIUS_STAG_DEER"
            : factionId === FACTIONS.CORVUS_SKY
            ? "GENIUS_CORVUS_CROW"
            : factionId === FACTIONS.SKEKSIS_GOO
            ? "SKEKSIS_ALCHEMIST"
            : "HUMAN_SAVANT",
        labId: lab.id,
        labX: lab.x,
        x: lab.x + (factionId === FACTIONS.CORVUS_SKY ? 1 : -2),
        y: lab.y,
        vx: (factionId & 1 ? 1 : -1) * 0.08,
        facing: 1,
        state: "RESEARCHING",
        thoughtTimer: 0,
        hypothesis: "INIT_CA_ROLLOUT",
        discoveries: 0,
        crownGlow: 1.0,
      };

      return { lab, scientist };
    }

    function triggerWasmExperiment(labOrFaction, world, eco) {
      const w = world || lastWorldRef;
      const e = eco || lastEcoRef;
      const wasm = getWasmBridge();

      let lab = null;
      if (labOrFaction && typeof labOrFaction === "object" && labOrFaction.kind) {
        lab = labOrFaction;
      } else {
        const fId = factionStringToId(labOrFaction);
        lab = cosmic.Labs.find((l) => l.factionId === fId) || cosmic.Labs[0];
      }
      if (!lab) return null;

      const fId = lab.factionId;
      const col = Math.max(1, Math.min(COARSE_W - 2, Math.round(lab.x)));
      const localSlope = w && w.Blocks ? Math.abs((w.Blocks[col + 1] || 16) - (w.Blocks[col - 1] || 16)) * 10 : 20;
      const seed = xorshift32(prngState + cosmic.frameCount * 31 + lab.experimentsRun * 997 + fId * 131);

      const expResult = wasm.runScientistExperiment({
        factionId: fId,
        labType: lab.experimentsRun % 4,
        slope: localSlope,
        moisture: w && w.seaLevel > 0 ? 75 : 45,
        energy: lab.energyBuffer + 150,
        trials: 256,
        seed,
      });

      const bldgResult = wasm.evolveCityBuilding({
        factionId: fId,
        envType: w ? (w.worldLayer || 0) : 0,
        blocks: w && w.Blocks ? w.Blocks : null,
        centerX: lab.x,
        generations: 120,
        seed: xorshift32(seed + 73),
      });

      lab.experimentsRun++;
      lab.lastFitness = expResult.fitness;
      lab.lastDna = expResult.dnaGenome;
      lab.activePulse = 28;

      const sci = cosmic.Scientists.find((s) => s.labId === lab.id);
      if (sci) {
        sci.discoveries++;
        sci.thoughtTimer = 45;
        sci.hypothesis = `${expResult.craftName} (${expResult.dnaHex})`;
      }

      // Spawn evolved outcome in the live world!
      const spawnX = Math.max(10, Math.min(COARSE_W - 16, lab.x + ((lab.experimentsRun & 1) ? 6 : -7)));
      const spawnY = elevAt(w, spawnX);

      // 1. Create or reinforce a BuildSite with the WASM-evolved 15x12 blueprint
      if (cosmic.BuildSites.length < 6) {
        const site = createBuildSite(spawnX, spawnY, fId, bldgResult);
        cosmic.BuildSites.push(site);
        spawnWorkersForSite(site, fId);
      }

      // 2. Spawn an Evolving 32-Bit DNA Plant/Fauna or Rideable Craft or Time Crystal
      if (expResult.craftName === "CHRONOS_TIME_CRYSTAL" && cosmic.TimeCrystals.length < 4) {
        cosmic.TimeCrystals.push({
          id: `tc-wasm-${cosmic.TimeCrystals.length + 1}`,
          x: spawnX,
          y: spawnY + 1,
          multiplier: 100,
          auraRadius: 9,
          activeFrames: 0,
          phase: 0,
          facets: 7,
        });
      } else if (lab.experimentsRun % 2 === 1 && cosmic.Crafts.length < 6) {
        const arch = CRAFT_ARCHETYPES[fId % CRAFT_ARCHETYPES.length];
        cosmic.Crafts.push(createRideableCraft(arch, spawnX, spawnY + 1, fId, expResult.dnaGenome));
      } else if (cosmic.EvolvedFlora.length < 18) {
        cosmic.EvolvedFlora.push(createEvolvedFlora(spawnX, spawnY, fId, expResult.dnaGenome, expResult.fitness));
      }

      // 3. Also trigger WFC seeping around the lab
      triggerWfcSeepAt(lab.x, lab.y, fId, lab.kind);

      // 4. If a Town Compute Vat is nearby, ignite it with the discovered DNA
      if (e && e.ComputeVats && e.ComputeVats.length > 0 && typeof e.igniteVat === "function") {
        e.igniteVat(e.ComputeVats[0], [115, 255, 220], w);
      }

      const logLine = `${FACTION_NAMES[fId]} LAB SIMULATED ${expResult.cellsSimulated} CELLS -> EVOLVED ${expResult.craftName} (FIT ${expResult.fitness})`;
      const record = {
        tick: cosmic.frameCount,
        factionId: fId,
        factionName: FACTION_NAMES[fId],
        labId: lab.id,
        log: logLine,
        experiment: expResult,
        blueprintFitness: bldgResult.fitness,
      };
      cosmic.ExperimentLogs.push(record);
      if (cosmic.ExperimentLogs.length > 32) {
        cosmic.ExperimentLogs.shift();
      }

      if (w && typeof w.announceSky === "function" && cosmic.frameCount > 30) {
        w.announceSky(
          `${FACTION_NAMES[fId].split("_")[0]} LAB EVOLVED`,
          `${expResult.craftName.slice(0, 18)}!`,
          135
        );
      }

      return record;
    }

    // ========================================================================
    // 4. ENERGY & COMPUTE CONDUIT NETWORKS & SHUTTLING 7x7 PACKETS
    // ========================================================================
    function createConduit(fromX, fromY, toX, toY, conduitType, factionId, targetLabId) {
      return {
        id: `conduit-${cosmic.Conduits.length + 1}`,
        fromX: Math.max(4, Math.min(COARSE_W - 5, Math.round(fromX))),
        fromY: Math.round(fromY),
        toX: Math.max(4, Math.min(COARSE_W - 5, Math.round(toX))),
        toY: Math.round(toY),
        type: conduitType || CONDUIT_LIST[factionId & 3],
        factionId: factionId & 3,
        targetLabId: targetLabId || null,
        flowPhase: nextRand() * Math.PI * 2,
        packetsSent: 0,
      };
    }

    function spawnConduitPacket(conduit) {
      if (cosmic.Packets.length >= 36) return;
      const colors = [
        [255, 195, 95],  // COPPER_PIPE: warm solar-amber packet
        [110, 245, 255], // AETHER_LASER: cyan-gold photon packet
        [85, 255, 185],  // MYCELIAL_HYPHAE: bioluminescent emerald-teal action potential
        [235, 75, 255],  // DARK_VEIN: violet-magenta dark-crystal pulse
      ];
      const col = colors[conduit.factionId & 3] || colors[0];
      cosmic.Packets.push({
        conduitId: conduit.id,
        fromX: conduit.fromX,
        fromY: conduit.fromY,
        toX: conduit.toX,
        toY: conduit.toY,
        type: conduit.type,
        factionId: conduit.factionId,
        targetLabId: conduit.targetLabId,
        u: 0.0,
        speed: 0.022 + nextRand() * 0.014,
        color: col,
        computePayload: 18,
      });
      conduit.packetsSent++;
    }

    function layConduitNearPlayer(world, eco, explicitFromX, explicitToX) {
      const w = world || lastWorldRef;
      const e = eco || lastEcoRef;
      const px = typeof explicitFromX === "number" ? explicitFromX : (w && w.P ? w.P.x : 56);
      const py = elevAt(w, px);

      // Find nearest Lab or Compute Vat to connect to
      let targetX = typeof explicitToX === "number" ? explicitToX : Math.min(COARSE_W - 8, px + 12);
      let targetY = elevAt(w, targetX);
      let targetLabId = null;
      let factionId = FACTIONS.HUMAN_ORANGE;

      if (cosmic.Labs.length > 0 && explicitToX === undefined) {
        const sortedLabs = cosmic.Labs.slice().sort((a, b) => Math.abs(a.x - px) - Math.abs(b.x - px));
        const chosen = sortedLabs[0];
        if (chosen) {
          targetX = chosen.x;
          targetY = chosen.y;
          targetLabId = chosen.id;
          factionId = chosen.factionId;
        }
      } else if (e && e.ComputeVats && e.ComputeVats.length > 0 && explicitToX === undefined) {
        targetX = e.ComputeVats[0].x;
        targetY = elevAt(w, targetX);
      }

      const cType = CONDUIT_LIST[factionId & 3];
      const conduit = createConduit(px, py, targetX, targetY, cType, factionId, targetLabId);
      cosmic.Conduits.push(conduit);
      spawnConduitPacket(conduit);
      spawnConduitPacket(conduit);

      if (w && typeof w.announceSky === "function") {
        w.announceSky("CONDUIT LINKED!", `${cType.replace("_", " ")}`, 135);
      }
      return conduit;
    }

    // ========================================================================
    // 5. MULTI-SPECIES WORKER SWARMS & EVOLUTIONARY CITY BUILDERS
    // ========================================================================
    function createBuildSite(x, y, factionId, bldgResult) {
      const bp = bldgResult || evolveCityBuildingFallback({ factionId, centerX: x });
      const w = bp.width || 15;
      const h = bp.height || 12;
      const builtGrid = new Uint8Array(w * h);

      // Pre-build the bottom foundation row so workers immediately start raising walls/arches
      for (let c = 0; c < w; c++) {
        const idx = (h - 1) * w + c;
        if (bp.grid[idx] > 0) {
          builtGrid[idx] = bp.grid[idx];
        }
      }

      let totalNonZero = 0;
      let builtCount = 0;
      for (let i = 0; i < w * h; i++) {
        if (bp.grid[i] > 0) totalNonZero++;
        if (builtGrid[i] > 0) builtCount++;
      }

      return {
        id: `buildsite-${FACTION_NAMES[factionId & 3].toLowerCase()}-${cosmic.BuildSites.length + 1}`,
        x: Math.max(8, Math.min(COARSE_W - 10, Math.round(x))),
        y: Math.max(4, Math.round(y)),
        factionId: factionId & 3,
        factionName: FACTION_NAMES[factionId & 3],
        width: w,
        height: h,
        blueprintGrid: bp.grid,
        builtGrid,
        builtCount,
        totalNonZero: Math.max(1, totalNonZero),
        progressPct: +((builtCount / Math.max(1, totalNonZero)) * 100).toFixed(1),
        fitness: bp.fitness || 8200,
        complete: false,
      };
    }

    function spawnWorkersForSite(site, factionId) {
      const fId = factionId & 3;
      const speciesByFaction = [
        ["HUMAN_ARTISAN", "LUMINOUS_CYAN_WISP"],
        ["CORVUS_WEAVER", "LUMINOUS_CYAN_WISP"],
        ["FOREST_SQUIRREL", "IRIDESCENT_BEETLE"],
        ["EVIL_SOOTBALL", "BLACK_EEL_DRONE"],
      ];
      const pair = speciesByFaction[fId] || speciesByFaction[0];
      for (let i = 0; i < 3; i++) {
        if (cosmic.Workers.length >= 28) break;
        cosmic.Workers.push({
          id: `worker-${fId}-${cosmic.Workers.length + 1}`,
          factionId: fId,
          species: pair[i % pair.length],
          siteId: site.id,
          x: site.x + (i - 1) * 2,
          y: site.y,
          vx: (i % 2 === 0 ? 1 : -1) * 0.14,
          carryingBlock: true,
          phase: nextRand() * Math.PI * 2,
          blocksPlaced: 0,
        });
      }
    }

    function stepBuildSiteCell(site, steps) {
      if (!site || site.complete) return 0;
      const w = site.width;
      const h = site.height;
      let placed = 0;

      // Build bottom-up (from row h-1 up to 0) so structures rise physically from foundations!
      for (let s = 0; s < steps; s++) {
        let found = false;
        for (let r = h - 1; r >= 0; r--) {
          for (let c = 0; c < w; c++) {
            const idx = r * w + c;
            if (site.blueprintGrid[idx] > 0 && site.builtGrid[idx] === 0) {
              site.builtGrid[idx] = site.blueprintGrid[idx];
              site.builtCount++;
              placed++;
              found = true;
              break;
            }
          }
          if (found) break;
        }
        if (!found) {
          site.complete = true;
          break;
        }
      }
      site.progressPct = Math.min(100, +((site.builtCount / site.totalNonZero) * 100).toFixed(1));
      if (site.builtCount >= site.totalNonZero) {
        site.complete = true;
      }
      return placed;
    }

    // ========================================================================
    // 6. EVOLVING 32-BIT DNA FLORA/FAUNA & RIDEABLE CRAFTS
    // ========================================================================
    function createEvolvedFlora(x, y, factionId, dnaGenome, fitness) {
      const wasm = getWasmBridge();
      const dna = (dnaGenome >>> 0) || 0x42e76bba;
      const traits = wasm.decodeDnaTraits ? wasm.decodeDnaTraits(dna) : decodeDnaTraitsFallback(dna);

      return {
        id: `flora-${cosmic.EvolvedFlora.length + 1}`,
        x: Math.max(6, Math.min(COARSE_W - 7, Math.round(x))),
        y: Math.round(y),
        factionId: factionId & 3,
        dna,
        dnaHex: "0x" + dna.toString(16).toUpperCase().padStart(8, "0"),
        traits,
        fitness: fitness || 850,
        branchDepth: 2 + (traits.branchingWing & 3),
        rootDepth: 2 + (traits.rootChassis & 3),
        colorFreq: 0.06 + (traits.colorFreq & 7) * 0.025,
        phase: nextRand() * Math.PI * 2,
        sporeCharge: traits.sporeThrust * 6,
      };
    }

    function createRideableCraft(archetype, x, y, factionId, dnaGenome) {
      const arch = archetype || CRAFT_ARCHETYPES[factionId & 3];
      return {
        id: `craft-${arch.toLowerCase()}-${cosmic.Crafts.length + 1}`,
        type: arch,
        factionId: factionId & 3,
        x: Math.max(8, Math.min(COARSE_W - 9, Math.round(x))),
        y: Math.max(6, Math.min(COARSE_H - 10, Math.round(y))),
        vx: 0,
        vy: 0,
        facing: 1,
        dna: (dnaGenome >>> 0) || 0x01ffebfd,
        rotorPhase: nextRand() * Math.PI * 2,
        occupied: false,
      };
    }

    function boardOrExitCraft(world, requestedType) {
      const w = world || lastWorldRef;
      if (cosmic.mountedCraft) {
        const dismounted = cosmic.mountedCraft;
        dismounted.occupied = false;
        cosmic.mountedCraft = null;
        if (w && typeof w.announceSky === "function") {
          w.announceSky("DISMOUNTED CRAFT", dismounted.type.replace(/_/g, " ").slice(0, 18), 135);
        }
        return null;
      }

      const px = w && w.P ? w.P.x : 56;
      let chosen = null;
      let bestDist = 999;

      for (let i = 0; i < cosmic.Crafts.length; i++) {
        const c = cosmic.Crafts[i];
        if (requestedType && !c.type.toUpperCase().includes(String(requestedType).toUpperCase())) {
          continue;
        }
        const d = Math.abs(c.x - px);
        if (d < bestDist) {
          bestDist = d;
          chosen = c;
        }
      }

      if (!chosen && cosmic.Crafts.length > 0) {
        chosen = cosmic.Crafts[0];
      }

      if (chosen) {
        chosen.occupied = true;
        chosen.x = px;
        cosmic.mountedCraft = chosen;
        if (w && w.P) {
          // Grant flight/drill capabilities while piloting the craft
          if (chosen.type === "ORNITHOPTER_SKY_SKIFF" || chosen.type === "AETHER_LEVITATION_BARGE") {
            w.P.wings = true;
            w.P.aether = Math.max(w.P.aether || 0, 5);
          } else if (chosen.type === "SUBTERRANEAN_MOLE_DRILLER") {
            w.P.drill = true;
          }
        }
        if (w && typeof w.announceSky === "function") {
          w.announceSky("BOARDED CRAFT!", chosen.type.replace(/_/g, " ").slice(0, 18), 155);
        }
        return chosen;
      }
      return null;
    }

    // ========================================================================
    // 7. TIME-DILATION CRYSTALS & 100x HYPER-TIME
    // ========================================================================
    function activateTimeCrystal(world, eco, mult, durationFrames) {
      const w = world || lastWorldRef;
      const e = eco || lastEcoRef;
      const wasm = getWasmBridge();

      const targetMult = Math.max(1, Math.min(100, mult || 100));
      const frames = Math.max(15, Math.min(600, durationFrames || 90));

      cosmic.timeDilation = targetMult;
      cosmic.hypertimeTimer = frames;

      // Run C/WASM 100x Hyper-Time Burst calculation!
      const pop = e && e.OrangePeople ? e.OrangePeople.length + (e.Children ? e.Children.length : 0) : 12;
      const burst = wasm.simulateHypertimeBurst({
        factionId: FACTIONS.HUMAN_ORANGE,
        pop,
        energy: 320,
        compute: 180,
        steps: targetMult * 6,
        seed: xorshift32(prngState + cosmic.frameCount * 53),
      });
      cosmic.lastHypertimeMetrics = burst;

      // Immediately advance WFC zones, BuildSites, Packet delivery, and Flora DNA evolution!
      for (let i = 0; i < cosmic.WfcZones.length; i++) {
        stepSingleWfcZone(cosmic.WfcZones[i], 28);
      }
      for (let i = 0; i < cosmic.BuildSites.length; i++) {
        stepBuildSiteCell(cosmic.BuildSites[i], 24);
      }
      for (let i = 0; i < cosmic.EvolvedFlora.length; i++) {
        const fl = cosmic.EvolvedFlora[i];
        fl.dna = xorshift32(fl.dna + i * 17);
        fl.fitness += 12;
      }
      for (let i = 0; i < cosmic.TimeCrystals.length; i++) {
        cosmic.TimeCrystals[i].activeFrames = frames;
      }

      if (w && typeof w.announceSky === "function") {
        w.announceSky(
          `${targetMult}X CHRONOS HYPER-TIME!`,
          `WORK: +${burst.computeDelta} COMPUTE`,
          160
        );
      }
      return burst;
    }

    // ========================================================================
    // 8. TRANSDIMENSIONAL BEINGS / ANGELS ON NON-STANDARD TOPOLOGICAL SLICES
    // ========================================================================
    function createTransdimensionalBeing(archetype, x, y, factionId) {
      return {
        id: `angel-${archetype.toLowerCase()}`,
        type: archetype,
        factionId: factionId & 3,
        x: Math.max(8, Math.min(COARSE_W - 9, Math.round(x))),
        y: Math.max(6, Math.min(COARSE_H - 8, Math.round(y))),
        vx: (factionId & 1 ? 1 : -1) * 0.22,
        vy: 0.08,
        targetElev: y,
        sliceCoord: (factionId * 0.25) % 1.0,
        phase: nextRand() * Math.PI * 2,
        blessingsGiven: 0,
        banishedTimer: 0,
      };
    }

    function shiftTopologySlice(world, explicitSlice) {
      const w = world || lastWorldRef;
      if (typeof explicitSlice === "number" && Number.isFinite(explicitSlice)) {
        cosmic.topologySlice = ((explicitSlice % 1.0) + 1.0) % 1.0;
      } else {
        cosmic.topologySlice = +((cosmic.topologySlice + 0.25) % 1.0).toFixed(2);
      }
      if (w && typeof w.announceSky === "function") {
        w.announceSky(
          "TOPOLOGY SLICE SHIFT",
          `PHASE W = ${cosmic.topologySlice.toFixed(2)}`,
          125
        );
      }
      return cosmic.topologySlice;
    }

    // ========================================================================
    // POPULATE SCREEN WITH ALL 8 MULTI-SOCIETY COSMIC SYSTEMS
    // ========================================================================
    function populateScreen(world, eco, srandom, srandInt) {
      lastWorldRef = world || lastWorldRef;
      lastEcoRef = eco || lastEcoRef;

      const w = world || { Blocks: new Uint8Array(COARSE_W).fill(16), seaLevel: 12, worldLayer: 0, P: { x: 56, y: 16 } };
      const e = eco || (global.SlopesEcology && global.SlopesEcology.eco) || {};
      const Blocks = w.Blocks || new Uint8Array(COARSE_W).fill(16);
      const wl = w.worldLayer || 0;

      if (typeof srandom === "function") {
        prngState = Math.floor(srandom() * 0xffffffff) >>> 0 || 0x5109e52a;
      }

      cosmic.WfcZones = [];
      cosmic.RecursiveObjects = [];
      cosmic.Labs = [];
      cosmic.Scientists = [];
      cosmic.Conduits = [];
      cosmic.Packets = [];
      cosmic.BuildSites = [];
      cosmic.Workers = [];
      cosmic.EvolvedFlora = [];
      cosmic.Crafts = [];
      cosmic.TimeCrystals = [];
      cosmic.Transdimensionals = [];
      cosmic.activePocket = null;
      cosmic.pipTarget = null;

      const px = w.P && typeof w.P.x === "number" ? w.P.x : 56;
      const town0 = w.Towns && w.Towns[0] ? w.Towns[0] : { x: Math.max(18, px - 10) };

      // --------------------------------------------------------------------
      // 1. Seed WFC Multi-Resolution Zones on Town, Cliff, Cave/Fungal, & Airship/Castle
      // --------------------------------------------------------------------
      const humanWfcX = Math.max(10, Math.min(COARSE_W - 16, town0.x - 2));
      cosmic.WfcZones.push(
        createWfcZone(humanWfcX, elevAt(w, humanWfcX), 5, 4, FACTIONS.HUMAN_ORANGE, "town", 3)
      );

      const fungalWfcX = Math.max(14, Math.min(COARSE_W - 18, px + 14));
      cosmic.WfcZones.push(
        createWfcZone(fungalWfcX, elevAt(w, fungalWfcX), 5, 4, FACTIONS.CERVUS_MYCELIAL, "cave_mycelium", 5)
      );

      const skyWfcX = Math.max(14, Math.min(COARSE_W - 18, px - 18));
      const skyWfcY = wl > 0 ? elevAt(w, skyWfcX) + 8 : elevAt(w, skyWfcX) + 12;
      cosmic.WfcZones.push(
        createWfcZone(skyWfcX, skyWfcY, 5, 4, FACTIONS.CORVUS_SKY, "airship_hull", 5)
      );

      const gooWfcX =
        w.TarVeins && w.TarVeins[0]
          ? w.TarVeins[0].x
          : Math.max(16, Math.min(COARSE_W - 16, COARSE_W - town0.x));
      cosmic.WfcZones.push(
        createWfcZone(gooWfcX, elevAt(w, gooWfcX), 5, 4, FACTIONS.SKEKSIS_GOO, "goo_lair", 3)
      );

      // --------------------------------------------------------------------
      // 2. Spawn 3 Specialized Research Labs & Scientist Lifeforms (+ Human Vat Savant)
      // --------------------------------------------------------------------
      // Lab 1: Biological Fungal Compute Center + Genius Stag/Deer Scientist (faction 2)
      const fungalX = Math.max(14, Math.min(COARSE_W - 15, fungalWfcX + 2));
      const fungalPair = createLabAndScientist(
        FACTIONS.CERVUS_MYCELIAL,
        fungalX,
        elevAt(w, fungalX),
        "fungal_compute_center",
        "Cervus Biological Fungal Compute Center"
      );
      cosmic.Labs.push(fungalPair.lab);
      cosmic.Scientists.push(fungalPair.scientist);

      // Lab 2: High-Altitude Bird Sky Lab + Genius Corvus Scientist (faction 1)
      const skyLabX = Math.max(14, Math.min(COARSE_W - 15, skyWfcX + 2));
      const skyLabY = Math.min(COARSE_H - 12, Math.max(24, elevAt(w, skyLabX) + 13));
      const skyPair = createLabAndScientist(
        FACTIONS.CORVUS_SKY,
        skyLabX,
        skyLabY,
        "bird_sky_lab",
        "Corvus High-Altitude Sky Lab"
      );
      cosmic.Labs.push(skyPair.lab);
      cosmic.Scientists.push(skyPair.scientist);

      // Lab 3: Evil Goo Lair Cave Network + Skeksis Alchemist (faction 3)
      const gooLabX = Math.max(12, Math.min(COARSE_W - 14, gooWfcX));
      const gooPair = createLabAndScientist(
        FACTIONS.SKEKSIS_GOO,
        gooLabX,
        elevAt(w, gooLabX),
        "goo_lair_network",
        "Skeksis Dark-Crystal Lair Incubator"
      );
      cosmic.Labs.push(gooPair.lab);
      cosmic.Scientists.push(gooPair.scientist);

      // Lab 4: Human Savant at Town Compute Vat (faction 0)
      const vatX = e.ComputeVats && e.ComputeVats[0] ? e.ComputeVats[0].x : Math.max(14, town0.x + 6);
      const humanPair = createLabAndScientist(
        FACTIONS.HUMAN_ORANGE,
        vatX,
        elevAt(w, vatX),
        "human_vat_lab",
        "Tachima Town Compute Vat Sanctuary"
      );
      cosmic.Labs.push(humanPair.lab);
      cosmic.Scientists.push(humanPair.scientist);

      // --------------------------------------------------------------------
      // 3. Spawn Faceted Chronos Time-Dilation Crystals
      // --------------------------------------------------------------------
      const tcX1 = Math.max(12, Math.min(COARSE_W - 12, px - 4));
      const tcX2 = Math.max(12, Math.min(COARSE_W - 12, fungalX - 6));
      cosmic.TimeCrystals.push(
        {
          id: "chronos-crystal-1",
          x: tcX1,
          y: elevAt(w, tcX1) + 1,
          multiplier: 100,
          auraRadius: 7,
          activeFrames: 0,
          phase: 0,
          facets: 7,
        },
        {
          id: "chronos-crystal-2",
          x: tcX2,
          y: elevAt(w, tcX2) + 1,
          multiplier: 100,
          auraRadius: 7,
          activeFrames: 0,
          phase: 2.1,
          facets: 7,
        }
      );

      // --------------------------------------------------------------------
      // 4. Create Recursive Objects (Vats, Time Crystals, Fungal Centers, Sky Labs, Castles, Airships)
      // --------------------------------------------------------------------
      const recDefs = [
        { type: "compute_vat", label: "7x7 Compute Vat Micro-World", x: vatX, y: elevAt(w, vatX) + 2, f: FACTIONS.HUMAN_ORANGE },
        { type: "time_crystal", label: "100x Chronos Crystal Lattice", x: tcX1, y: elevAt(w, tcX1) + 2, f: FACTIONS.HUMAN_ORANGE },
        { type: "fungal_center", label: "Cervus Mycelial Neural Dome", x: fungalX, y: elevAt(w, fungalX) + 2, f: FACTIONS.CERVUS_MYCELIAL },
        { type: "sky_lab", label: "Corvus Orbital Sky Lab Aerie", x: skyLabX, y: skyLabY, f: FACTIONS.CORVUS_SKY },
        { type: "castle", label: "Laputa Floating Castle Core", x: 60, y: elevAt(w, 60) + (wl > 0 ? 8 : 3), f: FACTIONS.HUMAN_ORANGE },
        { type: "airship", label: "Cloud Dirigible Engine Deck", x: Math.max(18, px + 9), y: elevAt(w, px) + 10, f: FACTIONS.CORVUS_SKY },
      ];
      for (let i = 0; i < recDefs.length; i++) {
        const rd = recDefs[i];
        cosmic.RecursiveObjects.push({
          id: `rec-${rd.type}-${i + 1}`,
          type: rd.type,
          label: rd.label,
          x: rd.x,
          y: rd.y,
          factionId: rd.f,
          pocket: createPocketMicroWorld(rd.type, rd.label, rd.x, rd.y, rd.f, prngState + i * 313),
        });
      }

      // --------------------------------------------------------------------
      // 5. Connect Energy & Compute Conduit Networks between Harvesters & Labs/Vats
      // --------------------------------------------------------------------
      cosmic.Conduits.push(
        createConduit(town0.x, elevAt(w, town0.x), vatX, elevAt(w, vatX), CONDUIT_TYPES.COPPER_PIPE, FACTIONS.HUMAN_ORANGE, humanPair.lab.id),
        createConduit(vatX, elevAt(w, vatX) + 2, skyLabX, skyLabY, CONDUIT_TYPES.AETHER_LASER, FACTIONS.CORVUS_SKY, skyPair.lab.id),
        createConduit(tcX1, elevAt(w, tcX1), fungalX, elevAt(w, fungalX), CONDUIT_TYPES.MYCELIAL_HYPHAE, FACTIONS.CERVUS_MYCELIAL, fungalPair.lab.id),
        createConduit(gooLabX - 8, elevAt(w, gooLabX - 8), gooLabX, elevAt(w, gooLabX), CONDUIT_TYPES.DARK_VEIN, FACTIONS.SKEKSIS_GOO, gooPair.lab.id)
      );
      for (let i = 0; i < cosmic.Conduits.length; i++) {
        spawnConduitPacket(cosmic.Conduits[i]);
      }

      // --------------------------------------------------------------------
      // 6. Initial WASM-Evolved Building Sites & Multi-Species Worker Swarms
      // --------------------------------------------------------------------
      const humanSiteX = Math.max(12, Math.min(COARSE_W - 16, town0.x + 4));
      const humanSite = createBuildSite(humanSiteX, elevAt(w, humanSiteX), FACTIONS.HUMAN_ORANGE);
      cosmic.BuildSites.push(humanSite);
      spawnWorkersForSite(humanSite, FACTIONS.HUMAN_ORANGE);

      const deerSiteX = Math.max(12, Math.min(COARSE_W - 16, fungalX - 5));
      const deerSite = createBuildSite(deerSiteX, elevAt(w, deerSiteX), FACTIONS.CERVUS_MYCELIAL);
      cosmic.BuildSites.push(deerSite);
      spawnWorkersForSite(deerSite, FACTIONS.CERVUS_MYCELIAL);

      const gooSiteX = Math.max(12, Math.min(COARSE_W - 16, gooLabX + 3));
      const gooSite = createBuildSite(gooSiteX, elevAt(w, gooSiteX), FACTIONS.SKEKSIS_GOO);
      cosmic.BuildSites.push(gooSite);
      spawnWorkersForSite(gooSite, FACTIONS.SKEKSIS_GOO);

      // --------------------------------------------------------------------
      // 7. Initial Evolving 32-Bit DNA Flora & 4 Rideable Crafts
      // --------------------------------------------------------------------
      const initialDnas = [0xa0f9f4ff, 0xf0f0f9ff, 0x42e76bba, 0x11f7fe6d, 0xafd3e3ad, 0xf8fed3bb];
      for (let i = 0; i < 6; i++) {
        const fx = Math.max(10, Math.min(COARSE_W - 11, 16 + i * 17));
        if (Blocks[fx] > (w.seaLevel || 0) + 1) {
          cosmic.EvolvedFlora.push(
            createEvolvedFlora(fx, Blocks[fx], i % 3, initialDnas[i], 880 + i * 24)
          );
        }
      }

      const craftPositions = [
        { type: "ORNITHOPTER_SKY_SKIFF", x: Math.max(10, px + 3), y: elevAt(w, Math.max(10, px + 3)) + 1, f: FACTIONS.CORVUS_SKY, dna: 0x01ffebfd },
        { type: "SUBTERRANEAN_MOLE_DRILLER", x: Math.max(10, px - 8), y: elevAt(w, Math.max(10, px - 8)), f: FACTIONS.HUMAN_ORANGE, dna: 0x65feb5fd },
        { type: "AMPHIBIOUS_WAVE_STRIDER", x: 18, y: Math.max(w.seaLevel || 12, elevAt(w, 18)), f: FACTIONS.CERVUS_MYCELIAL, dna: 0xafd3e3ad },
        { type: "AETHER_LEVITATION_BARGE", x: Math.min(COARSE_W - 12, fungalX + 5), y: elevAt(w, fungalX) + 6, f: FACTIONS.CORVUS_SKY, dna: 0xf0fff6f3 },
      ];
      for (let i = 0; i < craftPositions.length; i++) {
        const cp = craftPositions[i];
        cosmic.Crafts.push(createRideableCraft(cp.type, cp.x, cp.y, cp.f, cp.dna));
      }

      // --------------------------------------------------------------------
      // 8. Spawn the 4 Transdimensional Beings / Angels on Topological Slices
      // --------------------------------------------------------------------
      cosmic.Transdimensionals.push(
        createTransdimensionalBeing("SERAPH_LATTICE", town0.x, elevAt(w, town0.x) + 6, FACTIONS.HUMAN_ORANGE),
        createTransdimensionalBeing("CORVUS_AETHER_ANGEL", skyLabX, skyLabY + 3, FACTIONS.CORVUS_SKY),
        createTransdimensionalBeing("MYCELIAL_ARCHON", fungalX, Math.max(4, elevAt(w, fungalX) - 4), FACTIONS.CERVUS_MYCELIAL),
        createTransdimensionalBeing("QLIPHOTH_VOID_EEL", gooLabX, elevAt(w, gooLabX), FACTIONS.SKEKSIS_GOO)
      );

      // Run 1 initial WASM Scientist Experiment so ExperimentLogs starts populated
      triggerWasmExperiment(fungalPair.lab, w, e);
    }

    // ========================================================================
    // UPDATE SIMULATION (STEPS ALL 8 SYSTEMS + HANDLES 100x CHRONOS DILATION)
    // ========================================================================
    function update(world, eco) {
      // Allow update(frames, mult) signature if called by external steppers
      if (typeof world === "number") {
        const frames = Math.max(1, Math.min(60, world));
        const mult = typeof eco === "number" ? eco : cosmic.timeDilation;
        if (mult > 1) {
          cosmic.timeDilation = mult;
          cosmic.hypertimeTimer = Math.max(cosmic.hypertimeTimer, frames);
        }
        for (let i = 0; i < frames; i++) {
          update(lastWorldRef, lastEcoRef);
        }
        return;
      }

      if (world) lastWorldRef = world;
      if (eco) lastEcoRef = eco;

      const w = lastWorldRef || { Blocks: new Uint8Array(COARSE_W).fill(16), seaLevel: 12, worldLayer: 0, P: { x: 56, y: 16 } };
      const e = lastEcoRef || (global.SlopesEcology && global.SlopesEcology.eco) || {};
      const Blocks = w.Blocks || new Uint8Array(COARSE_W).fill(16);
      const P = w.P || { x: 56, y: 16 };

      cosmic.frameCount++;
      cosmic.hypertimeAuraPhase += 0.18;

      // --------------------------------------------------------------------
      // A. Check Time Crystal proximity & 100x Hyper-Time Dilation
      // --------------------------------------------------------------------
      if (cosmic.hypertimeTimer > 0) {
        cosmic.hypertimeTimer--;
        if (cosmic.hypertimeTimer === 0) {
          cosmic.timeDilation = 1;
        }
      }

      for (let i = 0; i < cosmic.TimeCrystals.length; i++) {
        const tc = cosmic.TimeCrystals[i];
        tc.phase += 0.12;
        tc.y = elevAt(w, tc.x) + 1;
        if (tc.activeFrames > 0) tc.activeFrames--;

        // Auto-activate 100x burst when Tachima-307 stands inside a Time Crystal's aura!
        if (Math.abs(P.x - tc.x) <= 2.5 && cosmic.timeDilation === 1 && cosmic.frameCount % 90 === 0) {
          activateTimeCrystal(w, e, tc.multiplier || 100, 45);
        }
      }

      const effMult = cosmic.timeDilation > 1 ? Math.min(3, Math.ceil(cosmic.timeDilation / 8)) : 1;

      // --------------------------------------------------------------------
      // B. Update WFC Seeping Multi-Resolution Zones
      // --------------------------------------------------------------------
      for (let i = 0; i < cosmic.WfcZones.length; i++) {
        const z = cosmic.WfcZones[i];
        z.pulse += 0.09 * effMult;
        if (z.targetKind !== "airship_hull") {
          z.y = elevAt(w, z.x + (z.w >> 1));
        }
        if ((cosmic.frameCount % Math.max(1, Math.floor(8 / effMult)) === 0) && z.collapsedCount < z.totalCells) {
          stepSingleWfcZone(z, 2 * effMult);
        }
      }

      // --------------------------------------------------------------------
      // C. Update Recursive Objects, PiP Lens Selection & Active Pocket World
      // --------------------------------------------------------------------
      let nearestRec = null;
      let nearestRecDist = 6.5; // Within 6 coarse cells triggers PiP Recursive Zoom Viewport!
      for (let i = 0; i < cosmic.RecursiveObjects.length; i++) {
        const ro = cosmic.RecursiveObjects[i];
        if (ro.type !== "sky_lab" && ro.type !== "airship") {
          ro.y = elevAt(w, ro.x) + 2;
        }
        stepPocketMicroWorld(ro.pocket, effMult);
        const d = Math.abs(ro.x - P.x);
        if (d <= nearestRecDist) {
          nearestRecDist = d;
          nearestRec = ro;
        }
      }
      cosmic.pipTarget = nearestRec;

      if (cosmic.activePocket) {
        stepPocketMicroWorld(cosmic.activePocket, effMult);
      }

      // --------------------------------------------------------------------
      // D. Update Energy & Compute Conduits + Shuttling 7x7 Packets
      // --------------------------------------------------------------------
      for (let i = 0; i < cosmic.Conduits.length; i++) {
        const cd = cosmic.Conduits[i];
        cd.flowPhase += 0.14 * effMult;
        if (cd.type !== CONDUIT_TYPES.AETHER_LASER) {
          cd.fromY = elevAt(w, cd.fromX);
          cd.toY = elevAt(w, cd.toX);
        }
        if (cosmic.frameCount % Math.max(4, Math.floor(28 / effMult)) === (i * 7) % 28) {
          spawnConduitPacket(cd);
        }
      }

      for (let i = cosmic.Packets.length - 1; i >= 0; i--) {
        const pk = cosmic.Packets[i];
        pk.u += pk.speed * effMult;
        if (pk.u >= 1.0) {
          // Packet arrived at destination Lab / Compute Vat!
          const destLab = cosmic.Labs.find((l) => l.id === pk.targetLabId || Math.abs(l.x - pk.toX) <= 4);
          if (destLab) {
            destLab.computeBuffer += pk.computePayload;
            destLab.energyBuffer += 12;
            destLab.activePulse = 14;
            if (destLab.computeBuffer >= 100) {
              destLab.computeBuffer -= 100;
              triggerWasmExperiment(destLab, w, e);
            }
          }
          // Also feed any nearby Town Compute Vat
          if (e && e.ComputeVats) {
            for (let v = 0; v < e.ComputeVats.length; v++) {
              const vat = e.ComputeVats[v];
              if (Math.abs(vat.x - pk.toX) <= 5) {
                vat.progress = Math.min(100, (vat.progress || 0) + 12);
                vat.state = "COMPUTING";
              }
            }
          }
          cosmic.Packets.splice(i, 1);
        }
      }

      // --------------------------------------------------------------------
      // E. Update Labs & Scientist Lifeforms (Deer, Crow, Skeksis, Human Savant)
      // --------------------------------------------------------------------
      for (let i = 0; i < cosmic.Labs.length; i++) {
        const lab = cosmic.Labs[i];
        lab.rotorPhase += 0.22 * effMult;
        lab.holoPhase += 0.11 * effMult;
        if (lab.activePulse > 0) lab.activePulse--;
        if (lab.kind !== "bird_sky_lab") {
          lab.y = elevAt(w, lab.x);
        }
      }

      for (let i = 0; i < cosmic.Scientists.length; i++) {
        const sci = cosmic.Scientists[i];
        if (sci.thoughtTimer > 0) sci.thoughtTimer--;
        sci.x += sci.vx * Math.min(3, effMult);
        if (Math.abs(sci.x - sci.labX) > 4.5) {
          sci.vx = sci.x > sci.labX ? -Math.abs(sci.vx) : Math.abs(sci.vx);
        }
        sci.facing = sci.vx >= 0 ? 1 : -1;
        const lab = cosmic.Labs.find((l) => l.id === sci.labId);
        sci.y = lab && lab.kind === "bird_sky_lab" ? lab.y : elevAt(w, sci.x);
      }

      // --------------------------------------------------------------------
      // F. Update Multi-Species Worker Swarms & Evolutionary Building Sites
      // --------------------------------------------------------------------
      for (let i = 0; i < cosmic.BuildSites.length; i++) {
        const site = cosmic.BuildSites[i];
        site.y = elevAt(w, site.x);
      }

      for (let i = 0; i < cosmic.Workers.length; i++) {
        const wk = cosmic.Workers[i];
        wk.phase += 0.2 * effMult;
        const site = cosmic.BuildSites.find((s) => s.id === wk.siteId) || cosmic.BuildSites[0];
        if (site) {
          wk.x += wk.vx * Math.min(4, effMult);
          if (Math.abs(wk.x - site.x) > 4.0) {
            wk.vx = wk.x > site.x ? -Math.abs(wk.vx) : Math.abs(wk.vx);
            wk.carryingBlock = true;
          }
          wk.y = elevAt(w, wk.x);

          // When worker passes over build site carrying a block, construct cells of the WASM blueprint!
          if (wk.carryingBlock && Math.abs(wk.x - site.x) <= 2.2 && !site.complete) {
            const built = stepBuildSiteCell(site, effMult);
            if (built > 0) {
              wk.blocksPlaced += built;
              wk.carryingBlock = false;
            }
          }
        }
      }

      // --------------------------------------------------------------------
      // G. Update Evolving 32-Bit DNA Plants/Fauna & Rideable Crafts
      // --------------------------------------------------------------------
      for (let i = 0; i < cosmic.EvolvedFlora.length; i++) {
        const fl = cosmic.EvolvedFlora[i];
        fl.phase += fl.colorFreq * effMult;
        fl.y = elevAt(w, fl.x);
        // Periodically release catalyst spores toward nearby Ferns/Vats
        if (cosmic.frameCount % 160 === (i * 23) % 160 && e && e.Ferns && e.Ferns.length > 0) {
          e.Ferns[i % e.Ferns.length].hasSpore = true;
        }
      }

      for (let i = 0; i < cosmic.Crafts.length; i++) {
        const cr = cosmic.Crafts[i];
        cr.rotorPhase += 0.28 * effMult;
        if (cosmic.mountedCraft && cosmic.mountedCraft.id === cr.id) {
          // Piloted by Tachima-307!
          const dx = P.x - cr.x;
          if (dx !== 0) cr.facing = dx > 0 ? 1 : -1;
          cr.x = P.x;
          if (cr.type === "ORNITHOPTER_SKY_SKIFF" || cr.type === "AETHER_LEVITATION_BARGE") {
            cr.y = Math.max(elevAt(w, P.x) + 3, P.y);
            P.y = cr.y;
          } else if (cr.type === "AMPHIBIOUS_WAVE_STRIDER") {
            const surf = Math.max(w.seaLevel || 12, elevAt(w, P.x));
            cr.y = surf;
            P.y = surf;
          } else {
            // SUBTERRANEAN_MOLE_DRILLER
            cr.y = elevAt(w, P.x);
          }
        } else {
          // Idle craft gentle hover / bobbing
          if (cr.type === "AETHER_LEVITATION_BARGE") {
            cr.y = elevAt(w, cr.x) + 6 + Math.sin(cr.rotorPhase * 0.25) * 0.8;
          } else if (cr.type === "AMPHIBIOUS_WAVE_STRIDER") {
            cr.y = Math.max(w.seaLevel || 12, elevAt(w, cr.x));
          } else {
            cr.y = elevAt(w, cr.x) + (cr.type === "ORNITHOPTER_SKY_SKIFF" ? 1 : 0);
          }
        }
      }

      // --------------------------------------------------------------------
      // H. Update 4 Transdimensional Beings / Angels along Topological Slices
      // --------------------------------------------------------------------
      for (let i = 0; i < cosmic.Transdimensionals.length; i++) {
        const td = cosmic.Transdimensionals[i];
        td.phase += 0.11 * effMult;
        if (td.banishedTimer > 0) {
          td.banishedTimer--;
          continue;
        }

        if (td.type === "SERAPH_LATTICE") {
          // 1. Iso-Contour Toroidal Fold: moves & teleports along equal-elevation contour lines (Blocks[x] == const)
          td.x += td.vx * effMult;
          if (td.x < 8 || td.x > COARSE_W - 9) td.vx = -td.vx;
          const isoElev = td.targetElev || 20;
          // Periodically fold across space to another column sharing the same contour elevation
          if (cosmic.frameCount % 95 === 0) {
            for (let tries = 0; tries < 16; tries++) {
              const candX = nextRandInt(12, COARSE_W - 13);
              if (Math.abs(Blocks[candX] - Blocks[Math.round(td.x)]) <= 2) {
                td.x = candX;
                break;
              }
            }
            // Bless nearby Compute Vats
            if (e && e.ComputeVats && e.ComputeVats.length > 0) {
              e.ComputeVats[0].progress = Math.min(100, (e.ComputeVats[0].progress || 0) + 18);
              e.ComputeVats[0].state = "COMPUTING";
              td.blessingsGiven++;
            }
          }
          td.y = Math.max(elevAt(w, td.x) + 5, isoElev);
        } else if (td.type === "CORVUS_AETHER_ANGEL") {
          // 2. Spectral Standing-Wave Vertical Slice: harmonic vertical oscillation through rock & sky alike
          td.x += Math.sin(td.phase * 0.35) * 0.25 * effMult;
          td.y = 22 + Math.sin(td.phase * 0.6) * 14;
          if (cosmic.frameCount % 110 === 0) {
            const skyLab = cosmic.Labs.find((l) => l.kind === "bird_sky_lab");
            if (skyLab) {
              skyLab.computeBuffer += 35;
              td.blessingsGiven++;
            }
          }
        } else if (td.type === "MYCELIAL_ARCHON") {
          // 3. Subterranean Root-Graph Geodesic: travels beneath Blocks[x] along root networks, mutating flora DNA
          td.x += td.vx * 0.85 * effMult;
          if (td.x < 10 || td.x > COARSE_W - 11) td.vx = -td.vx;
          const surf = elevAt(w, td.x);
          td.y = Math.max(3, surf - 4 - Math.round(Math.sin(td.phase) * 2));
          if (cosmic.frameCount % 80 === 0 && cosmic.EvolvedFlora.length > 0) {
            const fl = cosmic.EvolvedFlora[cosmic.frameCount % cosmic.EvolvedFlora.length];
            fl.fitness += 8;
            td.blessingsGiven++;
          }
        } else if (td.type === "QLIPHOTH_VOID_EEL") {
          // 4. Negative-Space 1px Surface/Shadow Boundary: swims along exact surface contour
          td.x += td.vx * 1.1 * effMult;
          if (td.x < 8 || td.x > COARSE_W - 9) td.vx = -td.vx;
          td.y = elevAt(w, td.x);
          // Banished if Seraph Lattice or Player Sonic Tamp is close
          const seraph = cosmic.Transdimensionals[0];
          if (seraph && Math.abs(seraph.x - td.x) <= 4) {
            td.banishedTimer = 60;
            td.vx = -td.vx;
          }
        }
      }
    }

    // ========================================================================
    // RENDER ALL 8 MULTI-SCALE SYSTEMS ON THE 840x525 PRIME RENDERER
    // ========================================================================
    function render(renderer, world, eco) {
      if (!renderer) return;
      const w = world || lastWorldRef || { Blocks: new Uint8Array(COARSE_W).fill(16), seaLevel: 12, worldLayer: 0, P: { x: 56, y: 16 } };
      const H = COARSE_H;
      const S = SCALE;
      const {
        fillNativeRect,
        subPix2,
        subPix3,
        subPix5,
        subPix7,
        nativeLine7,
      } = renderer;

      // If Player is currently inside a Recursive Pocket Micro-World, render the full-screen Pocket World overlay!
      if (cosmic.activePocket) {
        renderActivePocketFullScreen(renderer, cosmic.activePocket, w);
        return;
      }

      // --------------------------------------------------------------------
      // 1. RENDER WFC SEEPING MULTI-RESOLUTION ZONES (3x3 / 5x5 / 7x7)
      // --------------------------------------------------------------------
      for (let i = 0; i < cosmic.WfcZones.length; i++) {
        const z = cosmic.WfcZones[i];
        const baseCy = H - z.y;
        const res = z.resolution || 3;
        const drawFn = res === 7 ? subPix7 : res === 5 ? subPix5 : subPix3;

        for (let r = 0; r < z.subH; r++) {
          for (let c = 0; c < z.subW; c++) {
            const tile = z.grid[r * z.subW + c];
            if (tile === 0) continue;

            const cx = z.x + Math.floor(c / res);
            const cy = baseCy - z.h + 1 + Math.floor(r / res);
            const sx = c % res;
            const sy = r % res;

            const col = getWfcTileColor(z.factionId, tile, r, c, z.pulse);
            drawFn(cx, cy, sx, sy, col[0], col[1], col[2], col[3]);
          }
        }
      }

      // --------------------------------------------------------------------
      // 2. RENDER ENERGY & COMPUTE CONDUIT NETWORKS & SHUTTLING 7x7 PACKETS
      // --------------------------------------------------------------------
      for (let i = 0; i < cosmic.Conduits.length; i++) {
        const cd = cosmic.Conduits[i];
        const x0 = cd.fromX;
        const x1 = cd.toX;
        const steps = Math.max(4, Math.abs(x1 - x0) * 2);

        if (cd.type === CONDUIT_TYPES.AETHER_LASER) {
          // Bird Sky Lab: crisp 7x7 dotted cyan-gold optical laser beam across the sky
          const px0 = x0 * S + 3;
          const py0 = (H - cd.fromY - 2) * S + 3;
          const px1 = x1 * S + 3;
          const py1 = (H - cd.toY - 2) * S + 3;
          nativeLine7(px0, py0, px1, py1, 95, 245, 255, 0.78, 2);
          nativeLine7(px0, py0 - 1, px1, py1 - 1, 255, 230, 115, 0.55, 3);
        } else {
          for (let s = 0; s <= steps; s++) {
            const u = s / steps;
            const cx = x0 + (x1 - x0) * u;
            const surfH = elevAt(w, cx);

            if (cd.type === CONDUIT_TYPES.COPPER_PIPE) {
              // Human: segmented 5x5 copper-ochre pipe with valve nodes along terrain
              const cy = H - surfH;
              const isValve = s % 4 === 0;
              subPix5(
                cx,
                cy,
                0,
                -1,
                isValve ? 245 : 210,
                isValve ? 185 : 122,
                isValve ? 95 : 54,
                0.92
              );
            } else if (cd.type === CONDUIT_TYPES.MYCELIAL_HYPHAE) {
              // Deer Fungal: subterranean 7x7 glowing emerald-cyan root fibers beneath Blocks[x]
              const cy = H - Math.max(2, surfH - 2);
              const wave = Math.round(Math.sin(cd.flowPhase + s * 0.5) * 2);
              subPix7(cx, cy, 3, wave, 55, 245, 185, 0.88);
              subPix7(cx, cy, 4, wave + 1, 110, 255, 235, 0.75);
            } else {
              // Goo Lair DARK_VEIN: pulsing magenta-violet peristaltic tendrils
              const cy = H - surfH;
              const pulse = 0.65 + 0.35 * Math.sin(cd.flowPhase * 1.5 + s * 0.6);
              subPix5(cx, cy, 0, 0, (195 * pulse) | 0, 38, (225 * pulse) | 0, 0.9);
            }
          }
        }
      }

      // Render Shuttling 7x7 Energy & Compute Packets
      for (let i = 0; i < cosmic.Packets.length; i++) {
        const pk = cosmic.Packets[i];
        const cx = pk.fromX + (pk.toX - pk.fromX) * pk.u;
        let cy;
        if (pk.type === CONDUIT_TYPES.AETHER_LASER) {
          const ly = pk.fromY + (pk.toY - pk.fromY) * pk.u + 2;
          cy = H - ly;
        } else if (pk.type === CONDUIT_TYPES.MYCELIAL_HYPHAE) {
          cy = H - Math.max(2, elevAt(w, cx) - 2);
        } else {
          cy = H - elevAt(w, cx);
        }
        const px = Math.round(cx * S + 2);
        const py = Math.round(cy * S - 2);
        fillNativeRect(px, py, 3, 3, pk.color[0], pk.color[1], pk.color[2], 0.98);
        fillNativeRect(px + 1, py + 1, 1, 1, 255, 255, 255, 1.0);
      }

      // --------------------------------------------------------------------
      // 3. RENDER WASM-EVOLVED 15x12 BUILDING CONSTRUCTION SITES & WORKER SWARMS
      // --------------------------------------------------------------------
      for (let i = 0; i < cosmic.BuildSites.length; i++) {
        const site = cosmic.BuildSites[i];
        const baseCy = H - site.y;

        for (let r = 0; r < site.height; r++) {
          for (let c = 0; c < site.width; c++) {
            const idx = r * site.width + c;
            const builtTile = site.builtGrid[idx];
            const planTile = site.blueprintGrid[idx];
            if (builtTile === 0 && planTile === 0) continue;

            // Map 15x12 blueprint onto 5x4 coarse cells using 3x3 sub-pixels!
            const coarseX = site.x - 2 + Math.floor(c / 3);
            const coarseY = baseCy - 4 + Math.floor(r / 3);
            const sx = c % 3;
            const sy = r % 3;

            if (builtTile > 0) {
              const col = getWfcTileColor(site.factionId, builtTile, r, c, cosmic.frameCount * 0.08);
              subPix3(coarseX, coarseY, sx, sy, col[0], col[1], col[2], 0.96);
            } else if ((r + c + cosmic.frameCount) % 4 === 0) {
              // Faint scaffolding wireframe for unbuilt blueprint cells
              subPix7(coarseX, coarseY, sx * 2 + 1, sy * 2 + 1, 160, 230, 245, 0.38);
            }
          }
        }
      }

      // Render Multi-Species Worker Swarms (Human/Wisps, Squirrels/Beetles, Sootballs/Eels)
      for (let i = 0; i < cosmic.Workers.length; i++) {
        const wk = cosmic.Workers[i];
        const cy = H - wk.y;
        const dir = wk.vx >= 0 ? 1 : -1;
        const hop = Math.round(Math.abs(Math.sin(wk.phase)) * 1.2);

        if (wk.species === "FOREST_SQUIRREL") {
          // 3x3 Russet Squirrel with bushy arched tail
          subPix3(wk.x, cy, 0, -1 - hop, 198, 108, 42, 1);
          subPix3(wk.x, cy, dir, -2 - hop, 224, 138, 62, 1);
          subPix3(wk.x, cy, -dir, -2 - hop, 242, 165, 85, 0.95); // Bushy tail
        } else if (wk.species === "IRIDESCENT_BEETLE") {
          // 3x3 Emerald-Gold Carapace Beetle
          subPix3(wk.x, cy, 0, -1, 45, 225, 165, 1);
          subPix7(wk.x, cy, 3, -3, 255, 240, 115, 1);
        } else if (wk.species === "EVIL_SOOTBALL" || wk.species === "BLACK_EEL_DRONE") {
          // 3x3 Spiky Sootball / Dark Eel with bright wide eyes
          subPix3(wk.x, cy, 0, -1 - hop, 28, 18, 38, 0.96);
          subPix7(wk.x, cy, 2, -3 - hop * 2, 255, 245, 255, 1);
          subPix7(wk.x, cy, 4, -3 - hop * 2, 255, 245, 255, 1);
        } else if (wk.species === "LUMINOUS_CYAN_WISP") {
          // 5x5 Floating Cyan-Gold Builder Wisp
          subPix5(wk.x, cy, 0, -3 - hop, 115, 250, 255, 0.95);
          subPix7(wk.x, cy, 3, -6 - hop * 2, 255, 255, 255, 1);
        } else {
          // HUMAN_ARTISAN / CORVUS_WEAVER
          subPix3(wk.x, cy, 0, -1, 245, 145, 48, 1);
          subPix3(wk.x, cy, 0, -2, 255, 215, 165, 1);
        }

        if (wk.carryingBlock) {
          subPix7(wk.x, cy, dir >= 0 ? 5 : 1, -5, 125, 255, 215, 0.95);
        }
      }

      // --------------------------------------------------------------------
      // 4. RENDER RESEARCH LABS & GENIUS SCIENTIST LIFEFORMS
      // --------------------------------------------------------------------
      for (let i = 0; i < cosmic.Labs.length; i++) {
        const lab = cosmic.Labs[i];
        const cy = H - lab.y;

        if (lab.kind === "fungal_compute_center") {
          // Biological Fungal Compute Center: glowing 5x5 & 7x7 mycelial dome mushroom-computer
          // Stalk & neural hyphae base
          for (let dy = 0; dy < 3; dy++) {
            subPix3(lab.x, cy, 0, -1 - dy, 65, 175, 148, 0.95);
          }
          // Bioluminescent mushroom dome cap
          for (let dx = -3; dx <= 3; dx++) {
            subPix3(lab.x, cy, dx, -4, 38, 225, 175, 0.96);
            if (Math.abs(dx) <= 2) {
              subPix3(lab.x, cy, dx, -5, 85, 255, 210, 0.96);
            }
          }
          // Blinking 7x7 neural compute synapses across the cap
          for (let s = 0; s < 5; s++) {
            const active = ((cosmic.frameCount + s * 3) & 3) === 0 || lab.activePulse > 0;
            subPix7(
              lab.x,
              cy,
              (s - 2) * 3 + 3,
              -11 - (s & 1) * 2,
              active ? 255 : 110,
              255,
              active ? 165 : 245,
              1
            );
          }
        } else if (lab.kind === "bird_sky_lab") {
          // High-Altitude Bird Sky Lab: aerodynamic floating platform + spinning 5x5 anemometer rotors + 7x7 star-chart
          for (let dx = -4; dx <= 4; dx++) {
            subPix3(lab.x, cy, dx, 0, 215, 185, 110, 0.95);
          }
          // Spinning 5x5 Anemometer Rotors at left & right wingtips
          const blade = Math.round(Math.sin(lab.rotorPhase) * 2);
          subPix5(lab.x - 1, cy, -2, -2 + blade, 145, 250, 255, 0.95);
          subPix5(lab.x + 1, cy, 2, -2 - blade, 145, 250, 255, 0.95);
          // 7x7 Holographic Star-Chart above the Sky Lab deck
          for (let p = 0; p < 6; p++) {
            const ang = lab.holoPhase + (p * Math.PI) / 3;
            const hx = Math.round(3 + Math.cos(ang) * 5);
            const hy = Math.round(-8 + Math.sin(ang) * 3);
            subPix7(lab.x, cy, hx, hy, 115, 245, 255, 0.92);
          }
        } else if (lab.kind === "goo_lair_network") {
          // Evil Goo Lair Cave Network: dark-crystal spire incubator
          for (let dy = 0; dy < 4; dy++) {
            subPix3(lab.x, cy, -1, -dy, 72, 18, 58, 0.95);
            subPix3(lab.x, cy, 1, -dy, 72, 18, 58, 0.95);
            subPix5(lab.x, cy, 0, -dy * 2, 215, 45, 185, 0.9);
          }
        }
      }

      // Render Genius Scientists (Antlered Stag/Deer, Genius Crow, Skeksis Alchemist, Human Savant)
      for (let i = 0; i < cosmic.Scientists.length; i++) {
        const sci = cosmic.Scientists[i];
        const cy = H - sci.y;
        const dir = sci.facing;

        if (sci.species === "GENIUS_STAG_DEER") {
          // 3x3 Graceful Stag Body & Legs + 7x7 Bioluminescent Antler Crown!
          subPix3(sci.x, cy, -1, -1, 165, 115, 68, 1);
          subPix3(sci.x, cy, 1, -1, 165, 115, 68, 1);
          subPix3(sci.x, cy, 0, -2, 195, 142, 88, 1);
          subPix3(sci.x, cy, -dir, -2, 180, 128, 76, 1);
          subPix3(sci.x, cy, dir, -3, 212, 162, 105, 1); // Stag neck & head
          // Glowing Emerald-Gold Antler Crown in 7x7 native pixels
          subPix7(sci.x, cy, 3 + dir * 2, -9, 110, 255, 205, 1);
          subPix7(sci.x, cy, 2 + dir * 3, -11, 255, 245, 130, 1);
          subPix7(sci.x, cy, 4 + dir * 1, -11, 110, 255, 205, 1);
          subPix7(sci.x, cy, 1 + dir * 4, -12, 255, 255, 210, 1);
        } else if (sci.species === "GENIUS_CORVUS_CROW") {
          // 3x3 Genius Crow Scientist with golden astrolabe visor
          subPix3(sci.x, cy, 0, -1, 24, 34, 58, 1);
          subPix3(sci.x, cy, dir, -2, 36, 52, 88, 1);
          subPix7(sci.x, cy, 3 + dir * 2, -5, 255, 235, 110, 1);
          subPix7(sci.x, cy, 3 + dir * 3, -5, 110, 250, 255, 1);
        } else if (sci.species === "SKEKSIS_ALCHEMIST") {
          // 3x3 Skeksis Alchemist holding glowing violet vial
          subPix3(sci.x, cy, 0, -1, 88, 20, 54, 1);
          subPix3(sci.x, cy, 0, -2, 135, 28, 78, 1);
          subPix3(sci.x, cy, dir, -2, 235, 65, 255, 1);
        } else {
          // HUMAN_SAVANT with white/cyan lab mantle
          subPix3(sci.x, cy, 0, -1, 235, 245, 255, 1);
          subPix3(sci.x, cy, 0, -2, 95, 235, 255, 1);
          subPix3(sci.x, cy, 0, -3, 255, 220, 175, 1);
        }

        // Floating 7x7 DNA / Formula thought-mote when running an experiment
        if (sci.thoughtTimer > 0) {
          subPix7(sci.x, cy, 3, -14, 115, 255, 240, 0.95);
          subPix7(sci.x, cy, 5, -15, 255, 235, 115, 0.95);
        }
      }

      // --------------------------------------------------------------------
      // 5. RENDER EVOLVING 32-BIT DNA PLANTS/FAUNA & RIDEABLE CRAFTS
      // --------------------------------------------------------------------
      for (let i = 0; i < cosmic.EvolvedFlora.length; i++) {
        const fl = cosmic.EvolvedFlora[i];
        const cy = H - fl.y;
        const t = fl.traits;
        const rCol = 60 + ((t.colorFreq * 12) & 127);
        const gCol = Math.min(255, 165 + Math.round(Math.sin(fl.phase) * 55) + (t.branchingWing * 2));
        const bCol = Math.min(255, 130 + (t.sporeThrust * 8));

        // Subterranean root chassis in 7x7 pixels
        for (let rd = 1; rd <= fl.rootDepth; rd++) {
          subPix7(fl.x, cy, 3 + ((rd & 1) ? 1 : -1), rd * 2, 75, 210, 165, 0.65);
        }
        // Branching 2x2 & 3x3 fronds controlled by 32-bit DNA genome
        for (let b = 1; b <= fl.branchDepth; b++) {
          const sway = Math.round(Math.sin(fl.phase + b * 0.7) * 1);
          subPix3(fl.x, cy, sway, -b, rCol, gCol, bCol, 0.95);
          if (b >= 2) {
            subPix2(fl.x, cy, -1, -b, rCol + 20, gCol, bCol + 25, 0.9);
            subPix2(fl.x, cy, 1, -b, rCol + 20, gCol, bCol + 25, 0.9);
          }
        }
        // Glowing DNA spore apex
        subPix7(fl.x, cy, 3, -fl.branchDepth * 3 - 2, 255, 245, 140, 0.98);
      }

      // Render Rideable Crafts (3x3 + 5x5 + 7x7 pixel art)
      for (let i = 0; i < cosmic.Crafts.length; i++) {
        const cr = cosmic.Crafts[i];
        const cy = H - cr.y;
        const dir = cr.facing || 1;
        const flap = Math.round(Math.sin(cr.rotorPhase) * 1.5);

        if (cr.type === "ORNITHOPTER_SKY_SKIFF") {
          // Brass-cyan skiff fuselage + articulated flapping wings
          for (let dx = -2; dx <= 2; dx++) {
            subPix3(cr.x, cy, dx, 0, 225, 175, 85, 0.98);
          }
          subPix3(cr.x, cy, -1, -1 + flap, 125, 245, 255, 0.92);
          subPix3(cr.x, cy, 1, -1 - flap, 125, 245, 255, 0.92);
          subPix5(cr.x, cy, dir * 2, -1, 255, 245, 150, 1);
        } else if (cr.type === "SUBTERRANEAN_MOLE_DRILLER") {
          // Heavy armored amber chassis + spinning forward auger cone
          for (let dx = -2; dx <= 1; dx++) {
            subPix3(cr.x, cy, dx * dir, -1, 215, 140, 48, 0.98);
          }
          // Spinning auger drill bit
          subPix3(cr.x, cy, dir * 2, -1, 220, 235, 245, 1);
          subPix5(cr.x, cy, dir * 4, -2 + (cosmic.frameCount & 1), 255, 215, 95, 1);
        } else if (cr.type === "AMPHIBIOUS_WAVE_STRIDER") {
          // Twin hydrofoil pontoons + emerald-cyan plasma sail
          for (let dx = -2; dx <= 2; dx++) {
            subPix3(cr.x, cy, dx, 0, 65, 225, 195, 0.96);
          }
          subPix3(cr.x, cy, 0, -2, 115, 250, 235, 0.92);
          subPix3(cr.x, cy, 0, -3, 215, 255, 250, 0.92);
        } else {
          // AETHER_LEVITATION_BARGE: wide Laputa stone deck with glowing blue levitation crystal core
          for (let dx = -3; dx <= 3; dx++) {
            subPix3(cr.x, cy, dx, 0, 155, 178, 195, 0.96);
          }
          subPix5(cr.x, cy, 0, 1, 95, 245, 255, 1);
          subPix7(cr.x, cy, 3, 2, 255, 255, 255, 1);
        }
      }

      // --------------------------------------------------------------------
      // 6. RENDER CHRONOS TIME-DILATION CRYSTALS & 100x HYPER-TIME AURA
      // --------------------------------------------------------------------
      for (let i = 0; i < cosmic.TimeCrystals.length; i++) {
        const tc = cosmic.TimeCrystals[i];
        const cy = H - tc.y;
        const pulse = 0.75 + 0.25 * Math.sin(tc.phase);

        // Faceted 5x5 & 7x7 golden-cyan diamond crystal
        subPix5(tc.x, cy, 0, -1, 95, 245, 255, 0.95);
        subPix5(tc.x, cy, -1, -2, 185, 245, 255, 0.92);
        subPix5(tc.x, cy, 1, -2, 185, 245, 255, 0.92);
        subPix5(tc.x, cy, 0, -3, 255, 235, 125, 0.98);
        subPix7(tc.x, cy, 3, -5, 255, 255, 255, 1);

        // Orbiting chronos motes
        const numMotes = cosmic.timeDilation > 1 ? 8 : 3;
        for (let m = 0; m < numMotes; m++) {
          const ang = tc.phase * (cosmic.timeDilation > 1 ? 3 : 1) + (m * Math.PI * 2) / numMotes;
          const ox = Math.round(3 + Math.cos(ang) * (cosmic.timeDilation > 1 ? 9 : 5));
          const oy = Math.round(-4 + Math.sin(ang) * 4);
          subPix7(
            tc.x,
            cy,
            ox,
            oy,
            (255 * pulse) | 0,
            235,
            m & 1 ? 255 : 115,
            0.92
          );
        }
      }

      // --------------------------------------------------------------------
      // 7. RENDER 4 TRANSDIMENSIONAL BEINGS / ANGELS
      // --------------------------------------------------------------------
      for (let i = 0; i < cosmic.Transdimensionals.length; i++) {
        const td = cosmic.Transdimensionals[i];
        if (td.banishedTimer > 0) continue;
        const cy = H - td.y;

        if (td.type === "SERAPH_LATTICE") {
          // Rotating 5x5 & 7x7 golden-cyan Ophanim/Tesseract wheel
          subPix5(td.x, cy, 0, 0, 255, 245, 160, 0.98);
          for (let r = 0; r < 6; r++) {
            const ang = td.phase + (r * Math.PI) / 3;
            const rx = Math.round(3 + Math.cos(ang) * 6);
            const ry = Math.round(3 + Math.sin(ang) * 6);
            subPix7(td.x, cy, rx, ry, r & 1 ? 115 : 255, 245, r & 1 ? 255 : 120, 0.95);
          }
        } else if (td.type === "CORVUS_AETHER_ANGEL") {
          // Spectral Standing-Wave Vertical Slice: harmonic vertical ray + prismatic wings
          const px = Math.round(td.x * S + 3);
          const py = Math.round(cy * S + 3);
          nativeLine7(px, Math.max(4, py - 24), px, Math.min(NATIVE_H - 4, py + 24), 145, 245, 255, 0.35, 2);
          subPix3(td.x, cy, 0, 0, 235, 255, 255, 0.96);
          subPix3(td.x, cy, -2, -1, 115, 235, 255, 0.88);
          subPix3(td.x, cy, 2, -1, 255, 225, 135, 0.88);
        } else if (td.type === "MYCELIAL_ARCHON") {
          // Subterranean Root-Graph Geodesic: antlered emerald-gold earth spirit
          subPix3(td.x, cy, 0, 0, 55, 245, 175, 0.92);
          subPix5(td.x, cy, -1, -2, 185, 255, 145, 0.9);
          subPix5(td.x, cy, 1, -2, 185, 255, 145, 0.9);
        } else if (td.type === "QLIPHOTH_VOID_EEL") {
          // Negative-Space 1px Surface/Shadow Boundary ribbon entity
          for (let seg = 0; seg < 6; seg++) {
            const sx = td.x - seg * (td.vx >= 0 ? 0.5 : -0.5);
            const sy = H - elevAt(w, sx);
            subPix5(sx, sy, 0, 0, 175, 42, 225, 0.9 - seg * 0.1);
          }
        }
      }

      // --------------------------------------------------------------------
      // 8. RENDER 22x15 COARSE-CELL (154x105 NATIVE PIXEL) RECURSIVE PiP VIEWPORT
      //    IN UPPER-RIGHT WHEN PLAYER IS WITHIN 6 COARSE CELLS OF A RECURSIVE OBJECT
      // --------------------------------------------------------------------
      if (cosmic.pipTarget && cosmic.pipTarget.pocket) {
        renderRecursivePipViewport(renderer, cosmic.pipTarget);
      }
    }

    // Helper: WFC tile colors by faction & tile type
    function getWfcTileColor(factionId, tile, r, c, pulse) {
      const shimmer = Math.round(Math.sin(pulse + r * 0.4 + c * 0.5) * 18);
      if (factionId === FACTIONS.HUMAN_ORANGE) {
        // Warm terracotta-ochre arches, illuminated micro-windows, copper aqueduct trim, hanging moss
        switch (tile) {
          case WFC_TILES.FOUNDATION_STRUT: return [142, 86, 52, 0.95];
          case WFC_TILES.MASONRY_WALL:     return [214, 124, 68, 0.95];
          case WFC_TILES.ARCH_SUPPORT:     return [232, 152, 86, 0.95];
          case WFC_TILES.LUMINOUS_WINDOW:  return [255, Math.min(255, 225 + shimmer), 115, 0.98];
          case WFC_TILES.ROOF_DOME_SPIRE:  return [195, 92, 54, 0.96];
          case WFC_TILES.CONDUIT_PORT:     return [218, 165, 92, 0.95];
          case WFC_TILES.COMPUTE_CORE_CELL:return [110, 245, 235, 0.98];
          case WFC_TILES.HARVESTER_ARRAY:  return [88, 215, 138, 0.95]; // Hanging moss garden
          default:                         return [205, 118, 64, 0.9];
        }
      } else if (factionId === FACTIONS.CORVUS_SKY) {
        // Airship / Sky Lab WFC: riveted brass ribs, glowing cyan portholes, spinning micro-rotors
        switch (tile) {
          case WFC_TILES.FOUNDATION_STRUT: return [138, 118, 72, 0.95];
          case WFC_TILES.MASONRY_WALL:     return [196, 166, 98, 0.95];
          case WFC_TILES.ARCH_SUPPORT:     return [225, 195, 118, 0.95];
          case WFC_TILES.LUMINOUS_WINDOW:  return [115, 250, 255, 0.98]; // Cyan porthole
          case WFC_TILES.ROOF_DOME_SPIRE:  return [238, 220, 145, 0.96];
          case WFC_TILES.CONDUIT_PORT:     return [95, 225, 245, 0.95];
          case WFC_TILES.COMPUTE_CORE_CELL:return [175, 255, 255, 0.98];
          case WFC_TILES.HARVESTER_ARRAY:  return [245, 248, 255, 0.95]; // Rotor vane
          default:                         return [185, 158, 92, 0.9];
        }
      } else if (factionId === FACTIONS.CERVUS_MYCELIAL) {
        // Fungal / Deer Cave WFC: bioluminescent emerald-teal mycelial neural lattice & crystal nodes
        switch (tile) {
          case WFC_TILES.FOUNDATION_STRUT: return [38, 115, 98, 0.94];
          case WFC_TILES.MASONRY_WALL:     return [52, 168, 138, 0.94];
          case WFC_TILES.ARCH_SUPPORT:     return [74, 212, 172, 0.95];
          case WFC_TILES.LUMINOUS_WINDOW:  return [135, 255, 220, 0.98];
          case WFC_TILES.ROOF_DOME_SPIRE:  return [64, 235, 185, 0.96];
          case WFC_TILES.CONDUIT_PORT:     return [95, 245, 255, 0.95];
          case WFC_TILES.COMPUTE_CORE_CELL:return [235, 255, 155, 0.98];
          case WFC_TILES.HARVESTER_ARRAY:  return [110, 250, 195, 0.95];
          default:                         return [55, 180, 148, 0.9];
        }
      } else {
        // Evil Goo Lair WFC: dark purple-crimson chitin ribs, pulsing violet cocoons, dark-crystal spikes
        switch (tile) {
          case WFC_TILES.FOUNDATION_STRUT: return [54, 14, 44, 0.95];
          case WFC_TILES.MASONRY_WALL:     return [86, 22, 68, 0.95];
          case WFC_TILES.ARCH_SUPPORT:     return [124, 28, 92, 0.95];
          case WFC_TILES.LUMINOUS_WINDOW:  return [235, Math.max(30, 65 + shimmer), 255, 0.98];
          case WFC_TILES.ROOF_DOME_SPIRE:  return [165, 32, 115, 0.96];
          case WFC_TILES.CONDUIT_PORT:     return [195, 48, 225, 0.95];
          case WFC_TILES.COMPUTE_CORE_CELL:return [255, 85, 215, 0.98];
          case WFC_TILES.HARVESTER_ARRAY:  return [145, 38, 175, 0.95];
          default:                         return [78, 20, 62, 0.9];
        }
      }
    }

    // Render 22x15 coarse-cell (154x105 native pixel) PiP Recursive Zoom Viewport in upper-right
    function renderRecursivePipViewport(renderer, recObj) {
      const { fillNativeRect, nativeLine7 } = renderer;
      const pocket = recObj.pocket;
      if (!pocket) return;

      const pipCoarseX = COARSE_W - 24; // 96
      const pipCoarseY = 3;
      const pipPx0 = pipCoarseX * SCALE; // 672
      const pipPy0 = pipCoarseY * SCALE; // 21
      const pipW = 22 * SCALE; // 154 native pixels
      const pipH = 15 * SCALE; // 105 native pixels

      // 1. Deep translucent backdrop & crisp double-bezel hardware frame
      fillNativeRect(pipPx0, pipPy0, pipW, pipH, 14, 26, 36, 0.92);
      fillNativeRect(pipPx0, pipPy0, pipW, 2, 115, 245, 255, 0.98);
      fillNativeRect(pipPx0, pipPy0 + pipH - 2, pipW, 2, 115, 245, 255, 0.98);
      fillNativeRect(pipPx0, pipPy0, 2, pipH, 115, 245, 255, 0.98);
      fillNativeRect(pipPx0 + pipW - 2, pipPy0, 2, pipH, 115, 245, 255, 0.98);

      // Sightline ray connecting the host object on screen to the PiP lens corner
      const hostPx = Math.round(recObj.x * SCALE + 3);
      const hostPy = Math.round((COARSE_H - recObj.y) * SCALE + 3);
      nativeLine7(hostPx, hostPy, pipPx0, pipPy0 + pipH, 115, 245, 255, 0.45, 3);

      // 2. Render internal pocket micro-landscape (44 columns x 3px wide = 132px)
      const innerX0 = pipPx0 + 11;
      const innerYBot = pipPy0 + pipH - 8;
      for (let c = 0; c < pocket.pw; c++) {
        const h = pocket.heights[c];
        const colPx = innerX0 + c * 3;
        const topPy = innerYBot - h * 3;
        fillNativeRect(colPx, topPy, 3, h * 3, 48, 148, 138, 0.92);
        fillNativeRect(colPx, topPy, 3, 2, 115, 250, 215, 0.98);
      }

      // 3. Render rotating 7x7 DNA double-helix & live 7x7 CA core inside the PiP lens
      const dnaBaseX = pipPx0 + 28;
      const dnaBaseY = pipPy0 + 18;
      for (let y = 0; y < 18; y++) {
        const s1 = Math.round(Math.sin(pocket.dnaPhase + y * 0.45) * 6);
        const s2 = -s1;
        fillNativeRect(dnaBaseX + s1, dnaBaseY + y * 2, 2, 2, 110, 255, 225, 0.98);
        fillNativeRect(dnaBaseX + s2, dnaBaseY + y * 2, 2, 2, 255, 220, 110, 0.98);
        if (y % 3 === 0) {
          const lx = Math.min(dnaBaseX + s1, dnaBaseX + s2);
          const rw = Math.abs(s1 - s2);
          fillNativeRect(lx, dnaBaseY + y * 2, rw, 1, 180, 245, 255, 0.65);
        }
      }

      // Live 7x7 CA matrix inside the PiP viewport
      const caX0 = pipPx0 + 74;
      const caY0 = pipPy0 + 16;
      for (let cy = 0; cy < 7; cy++) {
        for (let cx = 0; cx < 7; cx++) {
          const st = pocket.caGrid[cy * 7 + cx];
          if (st > 0) {
            const r = st === 4 ? 255 : st === 3 ? 115 : 55;
            const g = st === 4 ? 235 : st >= 2 ? 250 : 165;
            const b = st === 4 ? 120 : 235;
            fillNativeRect(caX0 + cx * 4, caY0 + cy * 4, 3, 3, r, g, b, 0.96);
          }
        }
      }

      // 4. Render internal worker wisps inside the pocket micro-world
      for (let i = 0; i < pocket.wisps.length; i++) {
        const wisp = pocket.wisps[i];
        const wx = Math.round(innerX0 + wisp.x * 3);
        const wy = Math.round(innerYBot - wisp.y * 3);
        fillNativeRect(wx, wy, 3, 3, 255, 245, 135, 0.98);
      }
    }

    // Full-screen Recursive Pocket World renderer when player enters inside an object
    function renderActivePocketFullScreen(renderer, pocket, world) {
      const { fillNativeRect, coarseRect, subPix3, subPix5, subPix7 } = renderer;

      // Shimmering quantum boundary border around screen
      fillNativeRect(0, 0, NATIVE_W, 4, 95, 245, 255, 0.95);
      fillNativeRect(0, NATIVE_H - 4, NATIVE_W, 4, 95, 245, 255, 0.95);
      fillNativeRect(0, 0, 4, NATIVE_H, 95, 245, 255, 0.95);
      fillNativeRect(NATIVE_W - 4, 0, 4, NATIVE_H, 95, 245, 255, 0.95);

      // Render micro-world heightmap across the 120 coarse columns
      for (let x = 0; x < COARSE_W; x++) {
        const pIdx = Math.min(pocket.pw - 1, Math.floor((x / COARSE_W) * pocket.pw));
        const h = pocket.heights[pIdx] * 2;
        const topY = COARSE_H - h;
        coarseRect(x, topY, 1, h, [36, 118, 112], 0.92);
        coarseRect(x, topY, 1, 1, [110, 250, 215], 0.98);
      }

      // Render giant central 7x7 CA core & inner recursive Time Crystal at center
      const midX = 60;
      const midCy = COARSE_H - pocket.heights[22] * 2 - 8;
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const st = pocket.caGrid[r * 7 + c];
          if (st > 0) {
            subPix3(midX - 3 + c, midCy - 3 + r, 0, 0, st === 4 ? 255 : 95, 245, st === 4 ? 120 : 255, 0.95);
          }
        }
      }

      // Internal worker wisps
      for (let i = 0; i < pocket.wisps.length; i++) {
        const wisp = pocket.wisps[i];
        const wx = (wisp.x / pocket.pw) * COARSE_W;
        const wy = COARSE_H - wisp.y * 2;
        subPix5(wx, wy, 0, 0, 255, 240, 130, 0.98);
        subPix7(wx, wy, 3, 3, 255, 255, 255, 1);
      }
    }

    // Convenience aliases matching ai_interface.js & external controllers
    return {
      cosmic,
      state: cosmic,
      populateScreen,
      update,
      step: update,
      render,
      triggerWfcSeepAt,
      triggerWfc(faction, x) {
        return triggerWfcSeepAt(x, undefined, faction, "seep");
      },
      triggerWasmExperiment,
      activateTimeCrystal,
      setTimeDilation(mult, frames) {
        return activateTimeCrystal(lastWorldRef, lastEcoRef, mult, frames);
      },
      boardOrExitCraft,
      boardCraft(craftType, world) {
        return boardOrExitCraft(world || lastWorldRef, craftType);
      },
      enterOrExitRecursive,
      enterRecursive(targetType, world, eco) {
        if (cosmic.activePocket) cosmic.activePocket = null;
        return enterOrExitRecursive(world || lastWorldRef, eco || lastEcoRef, targetType);
      },
      exitRecursive(world, eco) {
        if (cosmic.activePocket) {
          return enterOrExitRecursive(world || lastWorldRef, eco || lastEcoRef);
        }
        return null;
      },
      layConduitNearPlayer,
      layConduit(fromX, toX, world, eco) {
        return layConduitNearPlayer(world || lastWorldRef, eco || lastEcoRef, fromX, toX);
      },
      shiftTopologySlice,
      shiftSlice(sliceVal, world) {
        return shiftTopologySlice(world || lastWorldRef, sliceVal);
      },
    };
  }

  // Create default singleton instance + attach factory & constants on window.SlopesCosmic
  const defaultInstance = createCosmicSystem();

  const api = {
    COARSE_W,
    COARSE_H,
    SCALE,
    NATIVE_W,
    NATIVE_H,
    WFC_TILES,
    FACTIONS,
    FACTION_NAMES,
    CONDUIT_TYPES,
    CRAFT_ARCHETYPES,
    TRANSDIMENSIONAL_ARCHETYPES,
    createCosmicSystem,
    // Expose default instance state & methods directly on window.SlopesCosmic for convenience
    cosmic: defaultInstance.cosmic,
    state: defaultInstance.cosmic,
    populateScreen: defaultInstance.populateScreen,
    update: defaultInstance.update,
    step: defaultInstance.step,
    render: defaultInstance.render,
    triggerWfcSeepAt: defaultInstance.triggerWfcSeepAt,
    triggerWfc: defaultInstance.triggerWfc,
    triggerWasmExperiment: defaultInstance.triggerWasmExperiment,
    activateTimeCrystal: defaultInstance.activateTimeCrystal,
    setTimeDilation: defaultInstance.setTimeDilation,
    boardOrExitCraft: defaultInstance.boardOrExitCraft,
    boardCraft: defaultInstance.boardCraft,
    enterOrExitRecursive: defaultInstance.enterOrExitRecursive,
    enterRecursive: defaultInstance.enterRecursive,
    exitRecursive: defaultInstance.exitRecursive,
    layConduitNearPlayer: defaultInstance.layConduitNearPlayer,
    layConduit: defaultInstance.layConduit,
    shiftTopologySlice: defaultInstance.shiftTopologySlice,
    shiftSlice: defaultInstance.shiftSlice,
    evalInScope: function (code) {
      return eval(code);
    },
  };

  global.__cosmicEvalInScope = function (code) {
    return eval(code);
  };
  global.SlopesCosmic = api;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : this);
