/* ============================================================================
 * SLOPES 2 — AI TEXT INTERFACE, IN-BROWSER AI TERMINAL & AUTONOMOUS AGENT
 * Module: /sim/ai_interface.js (window.SlopesAI & CommonJS module.exports)
 *
 * Provides a unified, multi-scale ASCII/Unicode viewport, structured JSON
 * observation telemetry, rich text command parser/executor, and utility-scoring
 * autonomous AI Monolith player across:
 *   - window.SlopesGame    (Core terrain, 5-Act story, subterranean/sky layers)
 *   - window.SlopesEcology (Multi-scale 2x2/3x3/5x5/7x7 CA Vats, Villagers, Crows, Skeksis)
 *   - window.SlopesCosmic  (WFC seepage, Recursive Pocket Worlds, Rideable Crafts,
 *                           Energy/Compute Conduits, 100x Time Crystals, Transdimensionals)
 *   - window.SlopesWasm    (C/WASM Evolutionary Scientist & City-Builder Simulator)
 * ============================================================================ */

(function (global) {
  "use strict";

  const COARSE_W = 144;
  const COARSE_H = 90;

  // ==========================================================================
  // 1. DETERMINISTIC PRNG & SYNCHRONOUS STEPPING BRIDGE
  // ==========================================================================
  let aiSeed = 0x5109e52a;
  function aiRand() {
    aiSeed = (Math.imul(aiSeed, 1664525) + 1013904223) >>> 0;
    return aiSeed / 4294967296;
  }
  function aiRandInt(min, max) {
    return Math.floor(aiRand() * (max - min + 1)) + min;
  }

  // Intercept requestAnimationFrame so SlopesAI can step slopes2.js's loop
  // synchronously in both browser and headless Node without breaking 30fps RAF.
  let capturedLoopFn = null;
  let syntheticTimeOffset = 0;
  let isSyncStepping = false;

  function installRafBridge() {
    if (typeof global.requestAnimationFrame === "function" && !global.__slopesRafBridged) {
      const origRaf = global.requestAnimationFrame.bind(global);
      global.__slopesRafBridged = true;
      global.requestAnimationFrame = function (cb) {
        if (typeof cb === "function") {
          capturedLoopFn = cb;
        }
        if (isSyncStepping) {
          return 0;
        }
        return origRaf(function (nativeTs) {
          const baseTs = typeof nativeTs === "number" ? nativeTs : Date.now();
          cb(baseTs + syntheticTimeOffset);
        });
      };
    }
  }
  installRafBridge();

  // ==========================================================================
  // 2. INTERNAL COSMIC / MULTI-SOCIETY STATE (Syncs with SlopesCosmic & SlopesWasm)
  // ==========================================================================
  const CRAFT_TYPES = ["ORNITHOPTER", "MOLE_DRILLER", "WAVE_STRIDER", "AETHER_BARGE"];
  const TRANSDIMENSIONAL_TYPES = ["SERAPH", "AETHER_ANGEL", "MYCELIAL_ARCHON", "VOID_EEL"];

  const aiState = {
    initialized: false,
    lastWorldKey: "",
    tickCount: 0,
    timeDilation: 1,
    hypertimeFramesRemaining: 0,
    topologySlice: 0.0,
    mountedCraft: null, // { id, type, x, y, speed, capability }
    inRecursivePocket: null, // { id, type, label, hostX, hostY, depth, width, height, interiorGrid, entities, playerX, playerY }
    wfcZones: [],
    recursiveObjects: [],
    timeCrystals: [],
    transdimensionals: [],
    conduits: [],
    crafts: [],
    evolvedBuildings: [],
    fungalCenters: [],
    deerScientists: [],
    evolvedFlora: [],
    skyLabs: [],
    gooLairs: [],
    sootballWorkers: [],
    workerSwarms: [],
    wasmExperiments: [],
    eventLog: [],
  };

  function logEvent(type, message, meta) {
    const entry = {
      tick: aiState.tickCount,
      type,
      message,
      meta: meta || {},
    };
    aiState.eventLog.push(entry);
    if (aiState.eventLog.length > 80) {
      aiState.eventLog.shift();
    }
    return entry;
  }

  function getGame() {
    return global.SlopesGame || null;
  }
  function getGameState() {
    const g = getGame();
    if (!g) {
      return {
        health: 100,
        score: 0,
        cavesFed: 0,
        veinsShattered: 0,
        ringsFound: 0,
        worldX: 0,
        worldLayer: 0,
        biome: "surface",
        biomeLabel: "SEA SLOPES",
        attachments: "NONE",
        actTitle: "ACT I: TACHIMA",
        seed: 1337,
        blocks: new Array(COARSE_W).fill(18),
        playerX: 56,
        playerE: 7,
        orangePop: 6,
        vats: 2,
        automata: 2,
        crows: 3,
        skeksis: 2,
        goo: 2,
        webs: 0,
        ecology: null,
      };
    }
    return g.state || {};
  }
  function getEcology() {
    const gs = getGameState();
    if (gs && gs.ecology) return gs.ecology;
    if (global.SlopesEcology && global.SlopesEcology.eco) return global.SlopesEcology.eco;
    return null;
  }
  function getCosmic() {
    return global.SlopesCosmic || null;
  }
  function getWasm() {
    return global.SlopesWasm || null;
  }

  function surfaceYAt(blocks, x) {
    const col = Math.max(0, Math.min(COARSE_W - 1, Math.round(x)));
    return (blocks && blocks[col]) || 16;
  }

  // Ensure rich 4-civilization, WFC, Recursive, Time-Crystal, Craft & Transdimensional entities exist
  function ensureCosmicStateSynced() {
    const gs = getGameState();
    const blocks = gs.blocks || new Array(COARSE_W).fill(16);
    const px = typeof gs.playerX === "number" ? gs.playerX : 56;
    const worldKey = `${gs.worldX || 0},${gs.worldLayer || 0}`;

    if (!aiState.initialized || aiState.lastWorldKey !== worldKey) {
      aiState.initialized = true;
      aiState.lastWorldKey = worldKey;
      aiSeed = ((gs.seed || 42) ^ Math.imul((gs.worldX || 0) + 17, 73856093) ^ Math.imul((gs.worldLayer || 0) + 31, 19349663)) >>> 0;
      if (aiSeed === 0) aiSeed = 0x5109e52a;

      // 1. WFC Zones (Wave Function Collapse High-Res Masonry/Terrace Regions)
      aiState.wfcZones = [
        {
          id: "wfc-orange-terrace",
          faction: "human",
          x: Math.max(10, Math.min(COARSE_W - 12, px - 8)),
          width: 12,
          height: 6,
          collapsePct: 86.4,
          entropy: 0.24,
          tileSet: "TERRACOTTA_SOLAR_ARCH",
          pattern: [
            "▓▓▒▒░░▒▒▓▓",
            "▓##====##▓",
            "▒#==TT==#▒",
            "░========░",
          ],
        },
        {
          id: "wfc-cervus-mycelium",
          faction: "deer",
          x: Math.max(12, Math.min(COARSE_W - 14, px + 10)),
          width: 10,
          height: 5,
          collapsePct: 92.0,
          entropy: 0.14,
          tileSet: "BIOLUMINESCENT_HYPHAE_LATTICE",
          pattern: [
            "░▒▓████▓▒░",
            "▒▓#====#▓▒",
            "▓#=F==D=#▓",
            "▒========▒",
          ],
        },
        {
          id: "wfc-corvus-aerie",
          faction: "bird",
          x: Math.max(14, Math.min(COARSE_W - 14, px - 18)),
          width: 9,
          height: 5,
          collapsePct: 78.5,
          entropy: 0.35,
          tileSet: "AETHER_WIND_SPIRE",
          pattern: [
            "░░▒▒▓▓▒▒░░",
            "▒##=MM=##▒",
            "▓========▓",
          ],
        },
      ];

      // 2. Civilizations: Fungal Centers (F), Deer Scientists (D), Bird Sky Labs (M), Goo Lairs (L)
      const fcX = Math.max(12, Math.min(COARSE_W - 12, px + 11));
      const slX = Math.max(12, Math.min(COARSE_W - 12, px - 13));
      const glX = Math.max(10, Math.min(COARSE_W - 10, px + 21));

      aiState.fungalCenters = [
        {
          id: "fungal-center-1",
          x: fcX,
          y: surfaceYAt(blocks, fcX),
          computeTflops: 42.8,
          sporeStock: 18,
          activeExperiment: "MYCELIAL_NEURAL_BRIDGE",
        },
      ];

      aiState.deerScientists = [
        {
          id: "deer-sci-1",
          name: "Dr. Alces-7",
          x: fcX - 2,
          y: surfaceYAt(blocks, fcX - 2),
          vx: 0.08,
          specialty: "DNA_FLORA_SYNTHESIS",
          iq: 240,
          discoveries: 3,
        },
        {
          id: "deer-sci-2",
          name: "Arch-Stag Sylvan",
          x: Math.max(8, px + 6),
          y: surfaceYAt(blocks, Math.max(8, px + 6)),
          vx: -0.06,
          specialty: "HYPHAE_SUPERCONDUCTOR",
          iq: 255,
          discoveries: 5,
        },
      ];

      aiState.evolvedFlora = [
        { id: "flora-1", name: "CHLORO_RESONATOR_FERN", x: fcX - 4, fitness: 488.2 },
        { id: "flora-2", name: "AETHER_SPORE_CANOPY", x: fcX + 3, fitness: 512.6 },
      ];

      aiState.skyLabs = [
        {
          id: "sky-lab-1",
          x: slX,
          y: surfaceYAt(blocks, slX) + 9,
          crowsAssigned: 2,
          windHarvestKw: 68.5,
          blueprint: "AETHER_SPIRE_MK2",
        },
      ];

      aiState.gooLairs = [
        {
          id: "goo-lair-1",
          x: glX,
          y: surfaceYAt(blocks, glX),
          corruptionRate: 0.42,
          spawnedSootballs: 3,
        },
      ];

      aiState.sootballWorkers = [
        { id: "soot-1", x: glX - 2, y: surfaceYAt(blocks, glX - 2), role: "web_anchor" },
        { id: "soot-2", x: glX + 1, y: surfaceYAt(blocks, glX + 1), role: "tar_harvester" },
      ];

      // 3. Worker Swarms (W) & Evolved Buildings ([B])
      const bldX1 = Math.max(10, Math.min(COARSE_W - 10, px - 5));
      const bldX2 = Math.max(10, Math.min(COARSE_W - 10, px + 7));
      aiState.evolvedBuildings = [
        {
          id: "bldg-solar-citadel",
          faction: "human",
          name: "SOLAR_HARMONIC_ARCHIVE",
          x: bldX1,
          y: surfaceYAt(blocks, bldX1),
          width: 4,
          height: 3,
          progress: 100,
          fitness: 518.4,
        },
        {
          id: "bldg-mycelial-dome",
          faction: "deer",
          name: "SYMBIOTIC_SPORE_DOME",
          x: bldX2,
          y: surfaceYAt(blocks, bldX2),
          width: 3,
          height: 3,
          progress: 85,
          fitness: 494.1,
        },
      ];

      aiState.workerSwarms = [
        {
          id: "swarm-human-1",
          species: "Human/Wisp",
          faction: "human",
          x: bldX1 + 1,
          y: surfaceYAt(blocks, bldX1 + 1),
          task: "constructing SOLAR_HARMONIC_ARCHIVE",
          count: 5,
        },
        {
          id: "swarm-deer-1",
          species: "Squirrel/Beetle",
          faction: "deer",
          x: bldX2 - 1,
          y: surfaceYAt(blocks, bldX2 - 1),
          task: "weaving SYMBIOTIC_SPORE_DOME",
          count: 6,
        },
      ];

      // 4. Rideable Crafts (K)
      const craftX1 = Math.max(8, Math.min(COARSE_W - 8, px + 3));
      const craftX2 = Math.max(8, Math.min(COARSE_W - 8, px - 10));
      aiState.crafts = [
        {
          id: "craft-ornithopter",
          type: "ORNITHOPTER",
          x: craftX1,
          y: surfaceYAt(blocks, craftX1) + 1,
          speed: 2.4,
          domain: "sky",
          description: "DaVinci-Laputa articulated flapping wing craft",
        },
        {
          id: "craft-mole-driller",
          type: "MOLE_DRILLER",
          x: craftX2,
          y: surfaceYAt(blocks, craftX2),
          speed: 1.8,
          domain: "subterranean",
          description: "Twin-auger subterranean bore vehicle",
        },
        {
          id: "craft-wave-strider",
          type: "WAVE_STRIDER",
          x: 16,
          y: Math.max(12, surfaceYAt(blocks, 16)),
          speed: 2.2,
          domain: "sea",
          description: "Hydrofoil catamaran skimming sea & magma basins",
        },
        {
          id: "craft-aether-barge",
          type: "AETHER_BARGE",
          x: Math.max(14, Math.min(COARSE_W - 14, px + 16)),
          y: surfaceYAt(blocks, Math.max(14, Math.min(COARSE_W - 14, px + 16))) + 7,
          speed: 1.9,
          domain: "aether",
          description: "Heavy levitation stone sky-barge",
        },
      ];

      // 5. Chronos Time-Dilation Crystals (Z)
      const tcX1 = Math.max(10, Math.min(COARSE_W - 10, px - 3));
      const tcX2 = Math.max(10, Math.min(COARSE_W - 10, px + 14));
      aiState.timeCrystals = [
        {
          id: "chronos-alpha",
          x: tcX1,
          y: surfaceYAt(blocks, tcX1) + 1,
          maxMultiplier: 100,
          activeMultiplier: aiState.timeDilation,
          radius: 9,
          charge: 100,
        },
        {
          id: "chronos-beta",
          x: tcX2,
          y: surfaceYAt(blocks, tcX2) + 1,
          maxMultiplier: 100,
          activeMultiplier: aiState.timeDilation,
          radius: 8,
          charge: 92,
        },
      ];

      // 6. Transdimensional / Angelic Beings (E)
      aiState.transdimensionals = [
        {
          id: "angel-seraph-1",
          type: "SERAPH",
          x: Math.max(12, Math.min(COARSE_W - 12, px - 6)),
          y: surfaceYAt(blocks, px) + 11,
          sliceW: 0.0,
          wings: 6,
          harmonicAura: "LYDIAN_FIFTH",
        },
        {
          id: "angel-aether-2",
          type: "AETHER_ANGEL",
          x: Math.max(12, Math.min(COARSE_W - 12, px + 8)),
          y: surfaceYAt(blocks, px) + 13,
          sliceW: 0.35,
          wings: 4,
          harmonicAura: "SOLARIS_CHORD",
        },
        {
          id: "angel-archon-3",
          type: "MYCELIAL_ARCHON",
          x: fcX,
          y: surfaceYAt(blocks, fcX) + 8,
          sliceW: -0.25,
          wings: 4,
          harmonicAura: "SPORE_TELEPATHY",
        },
        {
          id: "angel-eel-4",
          type: "VOID_EEL",
          x: glX,
          y: surfaceYAt(blocks, glX) + 10,
          sliceW: 0.7,
          wings: 2,
          harmonicAura: "ABYSSAL_PHASE",
        },
      ];

      // 7. Energy & Compute Conduit Pipes (- / : / +)
      aiState.conduits = [
        {
          id: "conduit-1",
          type: "aether_pipe",
          fromX: tcX1,
          fromY: surfaceYAt(blocks, tcX1) + 1,
          toX: bldX1,
          toY: surfaceYAt(blocks, bldX1) + 1,
          flowRate: 48.0,
          medium: "AETHER_COMPUTE_BUS",
        },
        {
          id: "conduit-2",
          type: "hyphae_fiber",
          fromX: bldX2,
          fromY: surfaceYAt(blocks, bldX2) + 1,
          toX: fcX,
          toY: surfaceYAt(blocks, fcX) + 1,
          flowRate: 64.5,
          medium: "OPTICAL_HYPHAE_LINK",
        },
      ];

      // 8. Seed initial C/WASM experiment record if empty
      if (aiState.wasmExperiments.length === 0) {
        aiState.wasmExperiments.push({
          id: "wasm-exp-init",
          faction: "deer",
          trials: 2048,
          bestFitness: 525.97,
          evolvedBlueprint: "WEB_CUTTER_GLIDER // SYMBIOTIC_SPORE_DOME",
          genomeHash: "0x9f4a2c81",
          metrics: {
            oscillationRate: 0.8867,
            ioSnr: 149.45,
            roamCoherence: 1.0,
            structuralStability: 0.96,
          },
        });
      }
    }

    // Keep dynamic elevations & recursive objects list synced with live world
    const eco = getEcology();
    const vats = (eco && eco.ComputeVats) || [];
    const primaryVatX = vats.length > 0 ? Math.round(vats[0].x) : Math.max(14, px - 7);
    const fc = aiState.fungalCenters[0] || { x: px + 11, y: surfaceYAt(blocks, px + 11) };
    const sl = aiState.skyLabs[0] || { x: px - 13, y: surfaceYAt(blocks, px - 13) + 9 };
    const tc = aiState.timeCrystals[0] || { x: px - 3, y: surfaceYAt(blocks, px - 3) + 1 };

    aiState.recursiveObjects = [
      {
        id: "rec-vat-1",
        type: "vat",
        label: "7x7 Compute Vat Server Lake",
        x: primaryVatX,
        y: surfaceYAt(blocks, primaryVatX) + 2,
        interiorSize: "30x15",
        enterable: true,
      },
      {
        id: "rec-crystal-1",
        type: "time_crystal",
        label: "100x Chronos Time-Dilation Crystal Lattice",
        x: tc.x,
        y: tc.y,
        interiorSize: "30x15",
        enterable: true,
      },
      {
        id: "rec-fungal-1",
        type: "fungal_center",
        label: "Cervus Biological Fungal Compute Center",
        x: fc.x,
        y: surfaceYAt(blocks, fc.x) + 1,
        interiorSize: "30x15",
        enterable: true,
      },
      {
        id: "rec-skylab-1",
        type: "sky_lab",
        label: "Corvus Orbital Sky Lab Aerie",
        x: sl.x,
        y: sl.y,
        interiorSize: "30x15",
        enterable: true,
      },
      {
        id: "rec-castle-1",
        type: "castle",
        label: "Laputa Floating Castle Aetherium Core",
        x: 60,
        y: surfaceYAt(blocks, 60) + 12,
        interiorSize: "30x15",
        enterable: true,
      },
      {
        id: "rec-airship-1",
        type: "airship",
        label: "Cloud Fleet Dirigible Engine Deck",
        x: Math.max(16, Math.min(COARSE_W - 16, px + 9)),
        y: surfaceYAt(blocks, px) + 10,
        interiorSize: "30x15",
        enterable: true,
      },
    ];

    // Merge any additional items exposed by window.SlopesCosmic if present
    const cosmic = getCosmic();
    if (cosmic && cosmic.state) {
      const cs = cosmic.state;
      if (typeof cs.timeDilation === "number" && cs.timeDilation > 1) {
        aiState.timeDilation = cs.timeDilation;
      }
      if (cs.mountedCraft && !aiState.mountedCraft) {
        aiState.mountedCraft = cs.mountedCraft;
      }
      if (cs.inRecursivePocket && !aiState.inRecursivePocket) {
        aiState.inRecursivePocket = cs.inRecursivePocket;
      }
    }
  }

  // Step internal cosmic entities alongside the main simulation
  function stepInternalCosmic(frames, dilationMultiplier) {
    ensureCosmicStateSynced();
    const gs = getGameState();
    const blocks = gs.blocks || new Array(COARSE_W).fill(16);
    const mult = Math.max(1, dilationMultiplier || aiState.timeDilation || 1);

    for (let f = 0; f < frames; f++) {
      aiState.tickCount += mult;
      if (aiState.hypertimeFramesRemaining > 0) {
        aiState.hypertimeFramesRemaining--;
        if (aiState.hypertimeFramesRemaining === 0) {
          aiState.timeDilation = 1;
        }
      }

      // Update Deer Scientists patrol & discoveries
      for (let i = 0; i < aiState.deerScientists.length; i++) {
        const ds = aiState.deerScientists[i];
        ds.x += ds.vx * Math.min(4, mult * 0.25);
        if (ds.x < 10 || ds.x > COARSE_W - 11) ds.vx = -ds.vx;
        ds.y = surfaceYAt(blocks, ds.x);
      }

      // Update Worker Swarms & Evolved Building construction
      for (let i = 0; i < aiState.evolvedBuildings.length; i++) {
        const b = aiState.evolvedBuildings[i];
        b.y = surfaceYAt(blocks, b.x);
        if (b.progress < 100) {
          b.progress = Math.min(100, b.progress + 0.8 * Math.min(10, mult));
        }
      }
      for (let i = 0; i < aiState.workerSwarms.length; i++) {
        const w = aiState.workerSwarms[i];
        w.x += Math.sin((aiState.tickCount + i * 17) * 0.1) * 0.25;
        w.y = surfaceYAt(blocks, w.x);
      }

      // Update WFC collapse progress
      for (let i = 0; i < aiState.wfcZones.length; i++) {
        const z = aiState.wfcZones[i];
        if (z.collapsePct < 100) {
          z.collapsePct = Math.min(100, +(z.collapsePct + 0.35 * Math.min(8, mult)).toFixed(1));
          z.entropy = +(Math.max(0.01, (100 - z.collapsePct) * 0.012)).toFixed(3);
        }
      }

      // Update Transdimensional beings orbit
      for (let i = 0; i < aiState.transdimensionals.length; i++) {
        const td = aiState.transdimensionals[i];
        td.x = Math.max(6, Math.min(COARSE_W - 7, td.x + Math.cos((aiState.tickCount * 0.04) + i * 2) * 0.35));
      }

      // Keep mounted craft aligned with player
      if (aiState.mountedCraft) {
        aiState.mountedCraft.x = gs.playerX;
        aiState.mountedCraft.y = surfaceYAt(blocks, gs.playerX) + (aiState.mountedCraft.domain === "sky" ? 4 : 1);
      }
    }
  }

  // Step the live Slopes 2 world forward by `frames` at `timeDilation`
  function stepWorld(frames = 1, timeDilation = 1) {
    const clampedFrames = Math.max(1, Math.min(500, Math.round(frames) || 1));
    const clampedMult = Math.max(1, Math.min(100, Math.round(timeDilation) || aiState.timeDilation || 1));

    if (clampedMult > 1) {
      aiState.timeDilation = clampedMult;
      aiState.hypertimeFramesRemaining = Math.max(aiState.hypertimeFramesRemaining, clampedFrames);
    }

    const beforeObs = getStructuredObservation();
    const g = getGame();
    const cosmic = getCosmic();

    // Effective simulation ticks (accelerated when timeDilation > 1, capped to keep response instantaneous)
    const simSubSteps = clampedMult > 1 ? Math.min(clampedFrames * Math.min(clampedMult, 6), 600) : clampedFrames;

    isSyncStepping = true;
    try {
      for (let i = 0; i < simSubSteps; i++) {
        if (g && typeof g.step === "function") {
          g.step(1);
        } else if (typeof global.__slopesStepRaf === "function") {
          global.__slopesStepRaf(1);
        } else if (typeof capturedLoopFn === "function") {
          syntheticTimeOffset += 36;
          const now = typeof performance !== "undefined" ? performance.now() : Date.now();
          capturedLoopFn(now + syntheticTimeOffset);
        }
        if (cosmic && typeof cosmic.step === "function") {
          cosmic.step(1, clampedMult);
        } else if (cosmic && typeof cosmic.update === "function") {
          cosmic.update(1, clampedMult);
        }
      }
    } finally {
      isSyncStepping = false;
    }

    stepInternalCosmic(clampedFrames, clampedMult);
    const afterObs = getStructuredObservation();

    const stepEvents = [];
    if (afterObs.civilizations.orangeHuman.roamingAutomata > beforeObs.civilizations.orangeHuman.roamingAutomata) {
      stepEvents.push("7x7 Compute Vat birthed a new Permeable Lipid-Membrane Roaming Automaton!");
    }
    if (afterObs.civilizations.skeksisGoo.gooNodes < beforeObs.civilizations.skeksisGoo.gooNodes) {
      stepEvents.push("Black Goo corruption node purified by ecological defenders!");
    }
    if (afterObs.civilizations.skeksisGoo.activeWebs < beforeObs.civilizations.skeksisGoo.activeWebs) {
      stepEvents.push("Sticky Black Goo web severed; snared victim rescued!");
    }
    if (clampedMult > 1) {
      stepEvents.push(`Chronos Time-Dilation Crystal accelerated local spacetime at ${clampedMult}x for ${clampedFrames} frames.`);
    }

    return {
      frames: clampedFrames,
      timeDilation: clampedMult,
      simSubSteps,
      events: stepEvents,
      observation: afterObs,
    };
  }

  // ==========================================================================
  // 3. RECURSIVE POCKET WORLD GENERATOR & INTERIOR INSPECTOR
  // ==========================================================================
  function createRecursivePocketInterior(recObj) {
    const w = 30;
    const h = 15;
    const grid = [];
    for (let y = 0; y < h; y++) {
      const row = new Array(w).fill(".");
      for (let x = 0; x < w; x++) {
        if (y === 0 || y === h - 1 || x === 0 || x === w - 1) {
          row[x] = "#";
        } else if (recObj.type === "vat") {
          if (y === 2 || y === h - 3) row[x] = "=";
          else if ((x + y) % 5 === 0) row[x] = "▓";
          else if ((x * y) % 4 === 0) row[x] = "▒";
          else if ((x + y) % 3 === 0) row[x] = "░";
        } else if (recObj.type === "time_crystal") {
          const d = Math.abs(x - 15) + Math.abs(y - 7);
          if (d <= 3) row[x] = "Z";
          else if (d <= 6) row[x] = "▓";
          else if (y === 7 || x === 15) row[x] = ":";
        } else if (recObj.type === "fungal_center") {
          if (y >= h - 3) row[x] = "▓";
          else if (x % 6 === 0) row[x] = ":";
          else if ((x + y) % 4 === 0) row[x] = "F";
        } else if (recObj.type === "sky_lab") {
          if (y === h - 3) row[x] = "=";
          else if (y === 3 && x % 4 === 0) row[x] = "M";
          else if ((x + y) % 6 === 0) row[x] = "-";
        } else {
          if (y >= h - 3) row[x] = "=";
          else if ((x + y) % 5 === 0) row[x] = "▒";
        }
      }
      grid.push(row);
    }
    // Place internal sub-entities
    grid[7][6] = "A";
    grid[7][22] = "D";
    grid[5][18] = "C";
    grid[11][10] = "W";
    grid[11][11] = "B";
    grid[7][14] = "V";

    return {
      id: recObj.id,
      type: recObj.type,
      label: recObj.label,
      hostX: recObj.x,
      hostY: recObj.y,
      depth: 1,
      width: w,
      height: h,
      playerX: 15,
      playerY: 8,
      interiorGrid: grid,
    };
  }

  // ==========================================================================
  // 4. MULTI-LAYER ASCII / UNICODE TEXT VIEWPORT (renderAsciiMap)
  // ==========================================================================
  function renderAsciiMap(options = {}) {
    ensureCosmicStateSynced();
    const gs = getGameState();
    const eco = getEcology();
    const blocks = gs.blocks || new Array(COARSE_W).fill(16);
    const px = typeof gs.playerX === "number" ? Math.round(gs.playerX) : 56;
    const py = surfaceYAt(blocks, px);
    const seaLevel = gs.worldLayer === 0 ? 13 : gs.biome === "underwater" ? 56 : gs.biome === "magma" ? 13 : 0;

    const mode = options.mode || "default";
    const viewW = options.width || (mode === "full" ? 120 : mode === "zoom" || mode === "wfc" ? 30 : 60);
    const viewH = options.height || (mode === "full" ? 38 : mode === "zoom" || mode === "wfc" ? 15 : 24);
    const includeLegend = options.includeLegend !== false;
    const includeInspector = options.includeInspector !== false;

    const outLines = [];
    const pocket = aiState.inRecursivePocket;
    const craftTag = aiState.mountedCraft ? `MOUNTED:${aiState.mountedCraft.type}` : "ON_FOOT";
    const rotFacet = typeof gs.rotFacet === "number" ? gs.rotFacet : 0;
    const rotTag = `ROT:${rotFacet}/5${rotFacet >= 3 ? "(REV)" : ""}`;
    const pocketTag = pocket ? `POCKET:${pocket.type.toUpperCase()}` : `WORLD:(${gs.worldX || 0},L${gs.worldLayer || 0}) ${rotTag}`;

    outLines.push(
      `╔══════════════════════════════════════════════════════════════════════════════╗`
    );
    outLines.push(
      `║ SLOPES 2 AI VIEWPORT [${viewW}x${viewH}] | ${pocketTag} | ${gs.biomeLabel || "SEA SLOPES"} | ${craftTag} | ${aiState.timeDilation}x CHRONOS ║`
    );
    outLines.push(
      `╚══════════════════════════════════════════════════════════════════════════════╝`
    );

    // If inside a Recursive Pocket World, render the recursive pocket interior!
    if (pocket && pocket.interiorGrid) {
      outLines.push(
        `  [RECURSIVE POCKET WORLD INTERIOR: ${pocket.label} @ Host (${pocket.hostX},${pocket.hostY}) Depth=${pocket.depth}]`
      );
      for (let ry = 0; ry < pocket.height; ry++) {
        let line = "";
        for (let rx = 0; rx < pocket.width; rx++) {
          if (rx === pocket.playerX && ry === pocket.playerY) {
            line += "*";
          } else {
            line += pocket.interiorGrid[ry][rx];
          }
        }
        outLines.push(`  ${String(ry).padStart(2, "0")} |${line}|`);
      }
    } else {
      // Macro World Multi-Layer Viewport around P.x
      const halfW = Math.floor(viewW / 2);
      const camX0 = viewW >= COARSE_W ? 0 : Math.max(0, Math.min(COARSE_W - viewW, px - halfW));
      const yScale = viewH >= 36 ? 2 : 2;
      const minElev = Math.max(0, Math.min(py - Math.floor((viewH * yScale) * 0.45), COARSE_H - viewH * yScale));

      const grid = [];
      for (let r = 0; r < viewH; r++) {
        grid.push(new Array(viewW).fill(" "));
      }

      const toCol = (wx) => {
        const c = Math.round(wx) - camX0;
        return c >= 0 && c < viewW ? c : -1;
      };
      const toRow = (elev) => {
        const r = viewH - 1 - Math.floor((elev - minElev) / yScale);
        return r >= 0 && r < viewH ? r : -1;
      };
      const put = (wx, elev, ch) => {
        const c = toCol(wx);
        const r = toRow(elev);
        if (c >= 0 && r >= 0) {
          grid[r][c] = ch;
        }
      };

      // 1. Terrain (# / =), Sea/Magma (~), & WFC Collapse Density (▓▒░)
      for (let c = 0; c < viewW; c++) {
        const wx = camX0 + c;
        const surfElev = blocks[wx] || 0;
        const surfRow = toRow(surfElev);

        // Check if column is inside an active WFC zone
        const wfcZone = aiState.wfcZones.find((z) => wx >= z.x && wx < z.x + z.width);

        for (let r = 0; r < viewH; r++) {
          const cellElev = minElev + (viewH - 1 - r) * yScale;
          if (surfElev > 0 && r === surfRow) {
            const prevH = blocks[Math.max(0, wx - 1)] || surfElev;
            const nextH = blocks[Math.min(COARSE_W - 1, wx + 1)] || surfElev;
            grid[r][c] = prevH === surfElev && nextH === surfElev ? "=" : "#";
          } else if (surfElev > 0 && r > surfRow) {
            if (wfcZone) {
              const depth = r - surfRow;
              grid[r][c] = depth === 1 ? "▓" : depth === 2 ? "▒" : "░";
            } else {
              grid[r][c] = "#";
            }
          } else if (seaLevel > 0 && cellElev <= seaLevel && r < surfRow) {
            grid[r][c] = "~";
          }
        }
      }

      // 2. Energy & Compute Conduit Pipes (- / : / +)
      for (let i = 0; i < aiState.conduits.length; i++) {
        const cd = aiState.conduits[i];
        const steps = Math.max(2, Math.abs(Math.round(cd.toX - cd.fromX)));
        for (let s = 0; s <= steps; s++) {
          const u = s / steps;
          const cx = cd.fromX + (cd.toX - cd.fromX) * u;
          const cy = surfaceYAt(blocks, cx) + 1;
          const ch = s === 0 || s === steps ? "+" : Math.abs(cd.toY - cd.fromY) > 3 && s % 2 === 1 ? ":" : "-";
          put(cx, cy, ch);
        }
      }

      // 3. Evolved Buildings ([B]) & Worker Swarms (W)
      for (let i = 0; i < aiState.evolvedBuildings.length; i++) {
        const b = aiState.evolvedBuildings[i];
        const by = surfaceYAt(blocks, b.x) + 1;
        put(b.x - 1, by, "[");
        put(b.x, by, "B");
        put(b.x + 1, by, "]");
      }
      for (let i = 0; i < aiState.workerSwarms.length; i++) {
        const w = aiState.workerSwarms[i];
        put(w.x, surfaceYAt(blocks, w.x) + 1, "W");
      }

      // 4. Biological Fungal Compute Centers (F), Bird Sky Labs (M), Goo Lairs (L), Deer Scientists (D)
      for (let i = 0; i < aiState.fungalCenters.length; i++) {
        const fc = aiState.fungalCenters[i];
        put(fc.x, surfaceYAt(blocks, fc.x) + 1, "F");
      }
      for (let i = 0; i < aiState.skyLabs.length; i++) {
        const sl = aiState.skyLabs[i];
        put(sl.x, sl.y, "M");
      }
      for (let i = 0; i < aiState.gooLairs.length; i++) {
        const gl = aiState.gooLairs[i];
        put(gl.x, surfaceYAt(blocks, gl.x) + 1, "L");
      }
      for (let i = 0; i < aiState.deerScientists.length; i++) {
        const ds = aiState.deerScientists[i];
        put(ds.x, surfaceYAt(blocks, ds.x) + 1, "D");
      }

      // 5. Rideable Crafts (K), Time-Dilation Crystals (Z), Transdimensional Beings (E)
      for (let i = 0; i < aiState.crafts.length; i++) {
        const cr = aiState.crafts[i];
        if (!aiState.mountedCraft || aiState.mountedCraft.id !== cr.id) {
          put(cr.x, cr.y, "K");
        }
      }
      for (let i = 0; i < aiState.timeCrystals.length; i++) {
        const tc = aiState.timeCrystals[i];
        put(tc.x, surfaceYAt(blocks, tc.x) + 2, "Z");
      }
      for (let i = 0; i < aiState.transdimensionals.length; i++) {
        const td = aiState.transdimensionals[i];
        put(td.x, td.y, "E");
      }

      // 6. Ecological Entities: Towns (T), Vats (V), Villagers (O), Children (c / !), Automata (A), Crows (C), Skeksis (S), Goo (G), Webs (x)
      put(Math.max(8, px - 9), surfaceYAt(blocks, Math.max(8, px - 9)) + 1, "T");
      if (eco) {
        (eco.ComputeVats || []).forEach((v) => {
          put(v.x, surfaceYAt(blocks, v.x) + 2, "V");
        });
        (eco.OrangePeople || []).forEach((op) => {
          put(op.x, surfaceYAt(blocks, op.x) + 1, "O");
        });
        (eco.Children || []).forEach((ch) => {
          put(ch.x, surfaceYAt(blocks, ch.x) + 1, ch.snared ? "!" : "c");
        });
        (eco.Automata || []).forEach((au) => {
          put(au.x, surfaceYAt(blocks, au.x) + 1, "A");
        });
        (eco.SeerCrows || []).forEach((cr) => {
          put(cr.x, cr.y, "C");
        });
        (eco.GooNodes || []).forEach((g) => {
          put(g.x, surfaceYAt(blocks, g.x) + 1, "G");
        });
        (eco.Webs || []).forEach((w) => {
          if (w.active) put(w.midX, w.midY, "x");
        });
        (eco.Skeksis || []).forEach((sk) => {
          put(sk.x, surfaceYAt(blocks, sk.x) + 1, "S");
        });
      }

      // 6B. Embodied Tab-Form Lifeforms ([T1], [T2], [T3]) running Claude Code in Hardcore-Tab bodies
      const liveTabForms =
        (gs && Array.isArray(gs.tabForms) && gs.tabForms) ||
        (global.SlopesTabForms && global.SlopesTabForms.tabForms) ||
        [];
      liveTabForms.forEach((tf, idx) => {
        const tx = Math.round(tf.x);
        const ty = surfaceYAt(blocks, tx) + 2;
        put(tx - 1, ty, "[");
        put(tx, ty, String((idx % 9) + 1));
        put(tx + 1, ty, "]");
      });

      // 7. Player Monolith (@ on foot, ^ when riding a Craft, * when inside a Recursive Pocket)
      const playerGlyph = pocket ? "*" : aiState.mountedCraft ? "^" : "@";
      const playerElev = aiState.mountedCraft ? aiState.mountedCraft.y : py + 1;
      put(px, playerElev, playerGlyph);

      for (let r = 0; r < viewH; r++) {
        const elevLabel = String(minElev + (viewH - 1 - r) * yScale).padStart(2, "0");
        outLines.push(`  ${elevLabel} |${grid[r].join("")}|`);
      }
      outLines.push(
        `      X:[${String(camX0).padStart(3, "0")} .. ${String(camX0 + viewW - 1).padStart(3, "0")}]  Monolith X=${px} Y=${py} E=${gs.playerE || 7} HP=${Math.round(gs.health || 100)}%`
      );
    }

    // High-Res Sub-Pixel & WFC Inspector Strip (3x3 / 5x5 / 7x7 micro-grid + recursive interior)
    if (includeInspector) {
      const eco = getEcology();
      const vat = eco && eco.ComputeVats && eco.ComputeVats[0];
      const caMap = [".", "░", "▒", "▓", "█"];
      outLines.push(
        `  ┌─ HIGH-RES SUB-PIXEL & WFC INSPECTOR STRIP (Around X=${px}) ─────────────────┐`
      );
      for (let row = 0; row < 5; row++) {
        // 3x3 sub-grid slice
        const sub3 = row === 0 ? " . @ . " : row === 1 ? " O | c " : row === 2 ? "===#===" : row === 3 ? "▓▓▓▒░░░" : " : + - ";
        // 5x5 lipid automaton + WFC masonry
        const sub5 =
          row === 0
            ? " .o+o.  ▓▓▒▒░"
            : row === 1
            ? " o▒█▒o  ▓#==▓"
            : row === 2
            ? " +█*█+  ▒=TT▒"
            : row === 3
            ? " o▒█▒o  ░===░"
            : " .o+o.  ░░░░░";
        // 7x7 Vat CA / Recursive Slice
        let sub7 = "";
        for (let col = 0; col < 7; col++) {
          if (vat && vat.gridA) {
            const st = vat.gridA[(row * 2) * (vat.caW || 19) + (col * 2)] || 0;
            sub7 += caMap[st % caMap.length];
          } else {
            sub7 += caMap[(row + col + aiState.tickCount) % caMap.length];
          }
        }
        outLines.push(
          `  │ 3x3:[${sub3}] | 5x5+WFC:[${sub5}] | 7x7-VAT:[${sub7}] | SLICE:${aiState.topologySlice.toFixed(2)} │`
        );
      }
      outLines.push(
        `  └─────────────────────────────────────────────────────────────────────────────┘`
      );
    }

    if (includeLegend) {
      outLines.push(
        `  LEGEND: @=Monolith (^=Craft *=Pocket) #/==Terrain ▓▒░=WFC ~=Sea T=Town V=7x7Vat`
      );
      outLines.push(
        `          O/c=Villager/Child(!=Snared) A=LipidBot C=SeerCrow S/G/x=Skeksis/Goo/Web`
      );
      outLines.push(
        `          F/M/L=FungalCtr/SkyLab/GooLair D=DeerSci W=Workers [B]=EvolvedBldg`
      );
      outLines.push(
        `          K=Craft Z=100xTimeCrystal E=Transdimensional -/:/+=ConduitPipes [1..3]=TabForms`
      );
    }

    return outLines.join("\n");
  }

  // ==========================================================================
  // 5. STRUCTURED OBSERVATION TELEMETRY (getStructuredObservation)
  // ==========================================================================
  function getStructuredObservation() {
    ensureCosmicStateSynced();
    const gs = getGameState();
    const eco = getEcology();
    const blocks = gs.blocks || new Array(COARSE_W).fill(16);
    const px = typeof gs.playerX === "number" ? gs.playerX : 56;
    const py = surfaceYAt(blocks, px);

    const orangeVillagers = eco && eco.OrangePeople ? eco.OrangePeople.length : 4;
    const orangeChildren = eco && eco.Children ? eco.Children.length : 2;
    const snaredChildren = eco && eco.Children ? eco.Children.filter((c) => c.snared).length : 0;
    const vats = eco && eco.ComputeVats ? eco.ComputeVats.length : 2;
    const automata = eco && eco.Automata ? eco.Automata.length : 2;
    const crows = eco && eco.SeerCrows ? eco.SeerCrows.length : 3;
    const ferns = eco && eco.Ferns ? eco.Ferns.length : 12;
    const critters = eco && eco.Critters ? eco.Critters.length : 6;
    const skeksis = eco && eco.Skeksis ? eco.Skeksis.length : 2;
    const gooNodes = eco && eco.GooNodes ? eco.GooNodes.length : 2;
    const activeWebs = eco && eco.Webs ? eco.Webs.filter((w) => w.active).length : 0;

    const recommendedActions = computeRecommendedActions(gs, eco);

    return {
      monolith: {
        x: px,
        y: py,
        energy: typeof gs.playerE === "number" ? gs.playerE : 7,
        health: typeof gs.health === "number" ? gs.health : 100,
        score: gs.score || 0,
        worldX: gs.worldX || 0,
        worldLayer: gs.worldLayer || 0,
        biome: gs.biome || "surface",
        biomeLabel: gs.biomeLabel || "SEA SLOPES",
        modules: gs.attachments ? gs.attachments.split("+").filter((m) => m !== "NONE") : [],
        mountedCraft: aiState.mountedCraft ? aiState.mountedCraft.type : null,
        inRecursivePocket: aiState.inRecursivePocket
          ? {
              id: aiState.inRecursivePocket.id,
              type: aiState.inRecursivePocket.type,
              label: aiState.inRecursivePocket.label,
              playerX: aiState.inRecursivePocket.playerX,
              playerY: aiState.inRecursivePocket.playerY,
            }
          : null,
        timeDilation: aiState.timeDilation,
        topologySlice: aiState.topologySlice,
        rotFacet: typeof gs.rotFacet === "number" ? gs.rotFacet : 0,
        rotation: gs.rotation || {
          rotFacet: typeof gs.rotFacet === "number" ? gs.rotFacet : 0,
          angleDeg: ((typeof gs.rotFacet === "number" ? gs.rotFacet : 0) * 72) % 360,
          isReverse: typeof gs.rotFacet === "number" && gs.rotFacet >= 3,
        },
      },
      tabForms: (
        (gs && Array.isArray(gs.tabForms) && gs.tabForms) ||
        (global.SlopesTabForms && global.SlopesTabForms.tabForms) ||
        []
      ).map((tf) => ({
        id: tf.id,
        name: tf.name,
        role: tf.role,
        x: Math.round(tf.x * 10) / 10,
        y: Math.round((tf.y || surfaceYAt(blocks, tf.x)) * 10) / 10,
        armState: tf.armState,
        busOpen: !!tf.busOpen,
        busPassengers: Array.isArray(tf.busPassengers) ? tf.busPassengers.length : 0,
        perchOpen: !!tf.perchOpen,
        perchedBirds: Array.isArray(tf.perchedBirds) ? tf.perchedBirds.length : 0,
        speechText: tf.speechText || "",
        claudeAuto: !!(tf.shell && tf.shell.claudeAuto),
        recentLines:
          tf.shell && typeof tf.shell.getRecentLines === "function"
            ? tf.shell.getRecentLines(4)
            : [],
      })),
      civilizations: {
        orangeHuman: {
          population: orangeVillagers + orangeChildren,
          adults: orangeVillagers,
          children: orangeChildren,
          snaredChildren,
          cottages: Math.max(1, aiState.evolvedBuildings.filter((b) => b.faction === "human").length + 1),
          computeVats: vats,
          roamingAutomata: automata,
          workers: aiState.workerSwarms.filter((w) => w.faction === "human").reduce((a, w) => a + w.count, 0),
          conduits: aiState.conduits.length,
        },
        corvusSky: {
          seerCrows: crows,
          skyLabs: aiState.skyLabs.length,
          airships: gs.worldLayer > 0 ? 3 : 1,
          raptors: gs.worldLayer > 0 ? 3 : 1,
          evolvedCrafts: aiState.crafts.map((c) => c.type),
        },
        cervusMycelial: {
          fungalCenters: aiState.fungalCenters.length,
          deerScientists: aiState.deerScientists.length,
          evolvedFlora: aiState.evolvedFlora.length,
          ferns,
          critters,
        },
        skeksisGoo: {
          skeksis,
          gooNodes,
          activeWebs,
          gooLairs: aiState.gooLairs.length,
          sootballWorkers: aiState.sootballWorkers.length,
        },
      },
      wfcZones: aiState.wfcZones.map((z) => ({
        id: z.id,
        faction: z.faction,
        x: z.x,
        width: z.width,
        height: z.height,
        collapsePct: z.collapsePct,
        entropy: z.entropy,
        tileSet: z.tileSet,
      })),
      recursiveObjects: aiState.recursiveObjects.map((r) => ({ ...r })),
      timeCrystals: aiState.timeCrystals.map((tc) => ({
        ...tc,
        activeMultiplier: aiState.timeDilation,
      })),
      transdimensionals: aiState.transdimensionals.map((td) => ({
        ...td,
        sliceDistance: +(Math.abs(td.sliceW - aiState.topologySlice)).toFixed(2),
      })),
      wasmExperiments: aiState.wasmExperiments.slice(-8),
      recommendedActions,
    };
  }

  function computeRecommendedActions(gs, eco) {
    const px = typeof gs.playerX === "number" ? gs.playerX : 56;
    const actions = [];

    if (eco) {
      const activeWeb = (eco.Webs || []).find((w) => w.active);
      if (activeWeb) {
        const dist = Math.abs(activeWeb.midX - px);
        if (dist <= 7) {
          actions.push({
            command: "tamp",
            priority: 98,
            reason: `Snared child/critter in sticky web at X=${Math.round(activeWeb.midX)} within Sonic Tamp range!`,
          });
        } else {
          const dir = activeWeb.midX > px ? "right" : "left";
          const steps = Math.min(8, Math.max(1, Math.round(dist - 4)));
          actions.push({
            command: `${dir} ${steps}`,
            priority: 95,
            reason: `Move toward snared victim at X=${Math.round(activeWeb.midX)} to sever Black Goo web.`,
          });
        }
      }

      const nearGoo = (eco.GooNodes || []).find((g) => Math.abs(g.x - px) <= 8);
      const nearSkeksis = (eco.Skeksis || []).find((s) => Math.abs(s.x - px) <= 8);
      if (nearGoo || nearSkeksis) {
        actions.push({
          command: "tamp",
          priority: 90,
          reason: `Purify nearby ${nearSkeksis ? "Skeksis Cultist" : "Black Goo corruption node"} with Sonic Tamp (K).`,
        });
      }

      const idleVat = (eco.ComputeVats || []).find((v) => v.state === "IDLE");
      if (idleVat) {
        actions.push({
          command: "pipe",
          priority: 84,
          reason: `Connect energy/compute conduit to idle 7x7 Compute Vat at X=${idleVat.x} to birth Lipid Automata.`,
        });
      }
    }

    if (aiState.wasmExperiments.length < 3) {
      actions.push({
        command: "evolve deer 4096",
        priority: 82,
        reason: "Run C/WASM Cervus Deer Scientist simulation (4096 trials) to evolve symbiotic architecture & flora.",
      });
    }

    if (aiState.timeDilation === 1) {
      actions.push({
        command: "hypertime 100 5",
        priority: 78,
        reason: "Ignite Chronos Time-Dilation Crystal for 100x accelerated civilization & WFC evolution.",
      });
    }

    if (!aiState.mountedCraft) {
      actions.push({
        command: "board",
        priority: 74,
        reason: "Board nearest rideable craft (ORNITHOPTER / MOLE_DRILLER) for high-mobility traversal.",
      });
    }

    if (!aiState.inRecursivePocket) {
      actions.push({
        command: "enter vat",
        priority: 70,
        reason: "Enter recursive 7x7 Compute Vat pocket world to inspect internal cellular automata.",
      });
    } else {
      actions.push({
        command: "exit",
        priority: 76,
        reason: "Exit recursive pocket world back to the coastal macro-layer.",
      });
    }

    actions.push({
      command: "town",
      priority: 65,
      reason: "Terrace slope & construct coastal cottage/lighthouse/vat to expand Orange society.",
    });

    return actions.sort((a, b) => b.priority - a.priority);
  }

  // ==========================================================================
  // 6. C/WASM EVOLUTIONARY SCIENTIST & CITY ARCHITECT RUNNER
  // ==========================================================================
  function runWasmScienceExperiment(faction = "deer", numTrials = 2048) {
    ensureCosmicStateSynced();
    const cleanFaction = String(faction || "deer").toLowerCase();
    const trials = Math.max(64, Math.min(65536, parseInt(numTrials, 10) || 2048));
    const gs = getGameState();
    const blocks = gs.blocks || new Array(COARSE_W).fill(16);
    const px = typeof gs.playerX === "number" ? gs.playerX : 56;

    // Invoke window.SlopesWasm real C-to-WASM functions if available
    const factionMap = { human: 0, orange: 0, bird: 1, corvus: 1, deer: 2, cervus: 2, goo: 3, skeksis: 3 };
    const factionId = factionMap[cleanFaction] !== undefined ? factionMap[cleanFaction] : 2;
    const wasm = getWasm();
    let wasmResult = null;
    let wasmBldg = null;
    if (wasm) {
      if (typeof wasm.runScientistExperiment === "function") {
        wasmResult = wasm.runScientistExperiment({
          factionId,
          labType: factionId,
          slope: 20,
          moisture: 55,
          energy: 240,
          trials,
          seed: (aiSeed ^ trials) >>> 0,
        });
      }
      if (typeof wasm.evolveCityBuilding === "function") {
        wasmBldg = wasm.evolveCityBuilding({
          factionId,
          envType: gs.worldLayer || 0,
          centerX: px,
          generations: Math.min(320, Math.max(64, Math.floor(trials / 16))),
          seed: (aiSeed + 0x9e3779b9) >>> 0,
          blocks,
        });
      }
    }

    // Deterministic high-precision C/WASM evolutionary rollout computation
    let bestScore = 420.0;
    let bestMask = 0x16c;
    for (let t = 0; t < Math.min(trials, 4096); t++) {
      const r = aiRand();
      const candidateScore = 440 + Math.log2(trials) * 14.5 + r * 62.0;
      if (candidateScore > bestScore) {
        bestScore = candidateScore;
        bestMask = (Math.floor(r * 511) | 0x104) >>> 0;
      }
    }

    const blueprintsByFaction = {
      human: {
        bldg: "TERRACOTTA_COMPUTE_AQUEDUCT",
        craft: "WAVE_STRIDER",
        dna: "SOLARIS_VAT_OSCILLATOR",
      },
      orange: {
        bldg: "TERRACOTTA_COMPUTE_AQUEDUCT",
        craft: "WAVE_STRIDER",
        dna: "SOLARIS_VAT_OSCILLATOR",
      },
      bird: {
        bldg: "CORVUS_AETHER_WIND_SPIRE",
        craft: "ORNITHOPTER",
        dna: "AETHER_THERMAL_GLIDER",
      },
      corvus: {
        bldg: "CORVUS_AETHER_WIND_SPIRE",
        craft: "ORNITHOPTER",
        dna: "AETHER_THERMAL_GLIDER",
      },
      deer: {
        bldg: "MYCELIAL_NEURAL_CATHEDRAL",
        craft: "AETHER_BARGE",
        dna: "SYMBIOTIC_HYPHAE_OSCILLATOR",
      },
      cervus: {
        bldg: "MYCELIAL_NEURAL_CATHEDRAL",
        craft: "AETHER_BARGE",
        dna: "SYMBIOTIC_HYPHAE_OSCILLATOR",
      },
      goo: {
        bldg: "OBSIDIAN_SINGULARITY_SPIRE",
        craft: "MOLE_DRILLER",
        dna: "ENTROPIC_WEB_CATALYST",
      },
      skeksis: {
        bldg: "OBSIDIAN_SINGULARITY_SPIRE",
        craft: "MOLE_DRILLER",
        dna: "ENTROPIC_WEB_CATALYST",
      },
    };

    const spec = blueprintsByFaction[cleanFaction] || blueprintsByFaction.deer;
    const spawnX = Math.max(10, Math.min(COARSE_W - 12, px + (aiState.wasmExperiments.length % 2 === 0 ? 5 : -6)));
    const spawnY = surfaceYAt(blocks, spawnX);

    // Spawn the evolved building, flora, and worker swarm in the live world!
    aiState.evolvedBuildings.push({
      id: `bldg-wasm-${aiState.wasmExperiments.length + 1}`,
      faction: cleanFaction,
      name: spec.bldg,
      x: spawnX,
      y: spawnY,
      width: 4,
      height: 3,
      progress: 100,
      fitness: +bestScore.toFixed(2),
    });

    aiState.evolvedFlora.push({
      id: `flora-wasm-${aiState.wasmExperiments.length + 1}`,
      name: spec.dna,
      x: spawnX + 2,
      fitness: +bestScore.toFixed(2),
    });

    const finalFitness = wasmResult && typeof wasmResult.fitness === "number" ? wasmResult.fitness : +bestScore.toFixed(2);
    const craftLabel = (wasmResult && wasmResult.craftName) || spec.craft;
    const expRecord = {
      id: `wasm-exp-${aiState.wasmExperiments.length + 1}`,
      faction: cleanFaction,
      trials,
      bestFitness: finalFitness,
      evolvedBlueprint: `${spec.bldg} + ${craftLabel} (${spec.dna})`,
      spawnedAt: { x: spawnX, y: spawnY },
      genomeHash: (wasmResult && wasmResult.dnaHex) || `0x${(bestMask * 2654435761 >>> 0).toString(16)}`,
      buildingFitness: wasmBldg ? wasmBldg.fitness : Math.round(bestScore * 15),
      metrics: wasmResult
        ? {
            cellsSimulated: wasmResult.cellsSimulated,
            energyYieldGainPct: wasmResult.energyYieldGain,
            conduitName: wasmResult.conduitName,
            timeDilationFactor: wasmResult.timeDilationFactor,
            transdimensionalResonance: wasmResult.transdimensionalResonance,
            computeCoreCells: wasmBldg ? wasmBldg.computeCoreCells : 18,
          }
        : {
            oscillationRate: +(0.78 + (bestMask % 19) * 0.01).toFixed(4),
            ioSnr: +(135.0 + (trials / 256)).toFixed(2),
            roamCoherence: 1.0,
            structuralStability: 0.98,
          },
    };

    aiState.wasmExperiments.push(expRecord);
    logEvent(
      "wasm_science",
      `WASM Scientist (${cleanFaction.toUpperCase()}) ran ${trials} trials -> evolved ${expRecord.evolvedBlueprint} (fitness ${expRecord.bestFitness}) at X=${spawnX}.`,
      expRecord
    );

    return expRecord;
  }

  // ==========================================================================
  // 7. COMMAND PARSER & EXECUTOR (executeCommand)
  // ==========================================================================
  function executeSingleCommand(rawCmd) {
    ensureCosmicStateSynced();
    const trimmed = String(rawCmd || "").trim();
    if (!trimmed) {
      return { ok: true, command: "noop", summary: "No command entered.", events: [] };
    }

    const parts = trimmed.split(/\s+/);
    const verb = parts[0].toLowerCase();
    const arg1 = parts[1];
    const arg2 = parts[2];
    const g = getGame();
    const cosmic = getCosmic();
    const events = [];

    const press = (btn, count = 1) => {
      const n = Math.max(1, Math.min(60, parseInt(count, 10) || 1));
      for (let i = 0; i < n; i++) {
        if (aiState.inRecursivePocket) {
          const p = aiState.inRecursivePocket;
          if (btn === "l") p.playerX = Math.max(1, p.playerX - 1);
          if (btn === "r") p.playerX = Math.min(p.width - 2, p.playerX + 1);
          if (btn === "u" || btn === "tri") p.playerY = Math.max(1, p.playerY - 1);
          if (btn === "d") p.playerY = Math.min(p.height - 2, p.playerY + 1);
        } else if (g && typeof g.action === "function") {
          g.action(btn);
        }
      }
      stepWorld(Math.min(n, 4), 1);
      return n;
    };

    switch (verb) {
      case "left":
      case "l": {
        const n = press("l", arg1 || 1);
        const msg = `Moved left ${n} step(s) to X=${getGameState().playerX}.`;
        events.push(msg);
        return { ok: true, command: trimmed, summary: msg, events };
      }

      case "right":
      case "r": {
        const n = press("r", arg1 || 1);
        const msg = `Moved right ${n} step(s) to X=${getGameState().playerX}.`;
        events.push(msg);
        return { ok: true, command: trimmed, summary: msg, events };
      }

      case "up":
      case "u":
      case "build": {
        const n = press("u", arg1 || 1);
        const msg = `Raised terrain / ascended ${n} time(s) at X=${getGameState().playerX}.`;
        events.push(msg);
        return { ok: true, command: trimmed, summary: msg, events };
      }

      case "down":
      case "d":
      case "dig": {
        const n = press("d", arg1 || 1);
        const msg = `Dug / drilled downward ${n} time(s) at X=${getGameState().playerX} (Layer ${getGameState().worldLayer}).`;
        events.push(msg);
        return { ok: true, command: trimmed, summary: msg, events };
      }

      case "tamp":
      case "k": {
        press("crs", 1);
        const eco = getEcology();
        let purified = 0;
        if (eco) {
          const px = getGameState().playerX;
          for (let i = (eco.Webs || []).length - 1; i >= 0; i--) {
            if (Math.abs(eco.Webs[i].midX - px) <= 9) {
              if (eco.Webs[i].victim) eco.Webs[i].victim.snared = false;
              eco.Webs.splice(i, 1);
              purified++;
            }
          }
        }
        const msg = `Triggered Sonic Tamp (K) shockwave at X=${getGameState().playerX}${purified > 0 ? ` (${purified} web/goo cleaved)` : ""}.`;
        events.push(msg);
        logEvent("tamp", msg);
        return { ok: true, command: trimmed, summary: msg, events };
      }

      case "rock":
      case "roll": {
        press("cir", 1);
        stepWorld(6, 1);
        const msg = `Formed/rolled Round Rock (L) from X=${getGameState().playerX}.`;
        events.push(msg);
        return { ok: true, command: trimmed, summary: msg, events };
      }

      case "hop":
      case "jump":
      case "i": {
        const n = press("tri", arg1 || 1);
        const msg = `Executed Aetherium Jet-Hop (I) ${n} time(s) at X=${getGameState().playerX}.`;
        events.push(msg);
        return { ok: true, command: trimmed, summary: msg, events };
      }

      case "town":
      case "terrace":
      case "j": {
        press("sqr", 1);
        const msg = `Terraced slope & catalyzed Coastal Town / Compute Vat at X=${getGameState().playerX}.`;
        events.push(msg);
        logEvent("town", msg);
        return { ok: true, command: trimmed, summary: msg, events };
      }

      case "scale":
      case "raga": {
        press("sel", 1);
        const msg = `Cycled harmonic Raga modal scale & sky palette.`;
        events.push(msg);
        return { ok: true, command: trimmed, summary: msg, events };
      }

      case "step": {
        const frames = Math.max(1, Math.min(500, parseInt(arg1, 10) || 10));
        const res = stepWorld(frames, aiState.timeDilation);
        const msg = `Stepped simulation forward ${frames} frame(s) at ${res.timeDilation}x dilation.`;
        events.push(msg, ...res.events);
        return { ok: true, command: trimmed, summary: msg, events };
      }

      case "hypertime": {
        const mult = Math.max(1, Math.min(100, parseInt(arg1, 10) || 100));
        const frames = Math.max(1, Math.min(500, parseInt(arg2, 10) || 10));
        aiState.timeDilation = mult;
        aiState.hypertimeFramesRemaining = frames;
        if (cosmic && typeof cosmic.setTimeDilation === "function") {
          cosmic.setTimeDilation(mult, frames);
        }
        const wasm = getWasm();
        let burstInfo = "";
        if (wasm && typeof wasm.simulateHypertimeBurst === "function") {
          const burst = wasm.simulateHypertimeBurst({
            factionId: 0,
            pop: 24,
            energy: 320,
            compute: 140,
            steps: mult * frames,
            seed: (aiSeed ^ (mult * frames)) >>> 0,
          });
          burstInfo = ` (WASM burst: +${burst.popDelta} pop, +${burst.computeDelta} compute, +${burst.buildingsEvolved} bldgs)`;
        }
        const res = stepWorld(frames, mult);
        const msg = `Activated ${mult}x Chronos Time-Dilation Crystal field for ${frames} frames!${burstInfo}`;
        events.push(msg, ...res.events);
        logEvent("hypertime", msg, { mult, frames });
        return { ok: true, command: trimmed, summary: msg, events };
      }

      case "seep": {
        const faction = (arg1 || "deer").toLowerCase();
        const gs = getGameState();
        const px = gs.playerX || 56;
        if (cosmic && typeof cosmic.triggerWfc === "function") {
          cosmic.triggerWfc(faction, px);
        }
        const wasm = getWasm();
        let collapsedCells = 980;
        if (wasm && typeof wasm.stepWfcSeep === "function") {
          const fMap = { human: 0, orange: 0, bird: 1, corvus: 1, deer: 2, cervus: 2, goo: 3, skeksis: 3 };
          collapsedCells = wasm.stepWfcSeep({
            width: 35,
            height: 28,
            factionId: fMap[faction] || 2,
            steps: 24,
            seed: (aiSeed ^ px) >>> 0,
          });
        }
        const tileSets = {
          human: "TERRACOTTA_SOLAR_ARCH",
          orange: "TERRACOTTA_SOLAR_ARCH",
          bird: "AETHER_WIND_SPIRE",
          corvus: "AETHER_WIND_SPIRE",
          deer: "BIOLUMINESCENT_HYPHAE_LATTICE",
          cervus: "BIOLUMINESCENT_HYPHAE_LATTICE",
          goo: "OBSIDIAN_VOID_MATRICES",
          skeksis: "OBSIDIAN_VOID_MATRICES",
        };
        const newZone = {
          id: `wfc-${faction}-${aiState.wfcZones.length + 1}`,
          faction,
          x: Math.max(6, Math.min(COARSE_W - 14, px - 4)),
          width: 10,
          height: 5,
          collapsePct: +((collapsedCells / 980) * 100).toFixed(1),
          entropy: 0.06,
          tileSet: tileSets[faction] || "HARMONIC_MASONRY",
        };
        aiState.wfcZones.push(newZone);
        const msg = `Wave Function Collapse (${newZone.tileSet}) seeped across X=[${newZone.x}..${newZone.x + newZone.width}] (${collapsedCells}/980 micro-cells = ${newZone.collapsePct}% collapsed).`;
        events.push(msg);
        logEvent("wfc_seep", msg, newZone);
        return { ok: true, command: trimmed, summary: msg, events };
      }

      case "enter": {
        const targetType = (arg1 || "").toLowerCase();
        const px = getGameState().playerX || 56;
        let target = null;
        if (targetType) {
          target = aiState.recursiveObjects.find(
            (r) => r.type.toLowerCase().includes(targetType) || r.id.toLowerCase().includes(targetType)
          );
        }
        if (!target) {
          target = aiState.recursiveObjects
            .slice()
            .sort((a, b) => Math.abs(a.x - px) - Math.abs(b.x - px))[0];
        }
        if (!target) {
          target = { id: "rec-vat-1", type: "vat", label: "7x7 Compute Vat Server Lake", x: px, y: 18 };
        }
        aiState.inRecursivePocket = createRecursivePocketInterior(target);
        if (cosmic && typeof cosmic.enterRecursive === "function") {
          cosmic.enterRecursive(target.type);
        }
        const msg = `Entered recursive pocket world: ${target.label} (${target.type}) at (${target.x},${target.y}).`;
        events.push(msg);
        logEvent("enter_recursive", msg, target);
        return { ok: true, command: trimmed, summary: msg, events };
      }

      case "exit": {
        const prev = aiState.inRecursivePocket;
        aiState.inRecursivePocket = null;
        if (cosmic && typeof cosmic.exitRecursive === "function") {
          cosmic.exitRecursive();
        }
        const msg = prev
          ? `Exited recursive pocket world (${prev.label}) back to macro world.`
          : `Already in macro world (not inside a recursive pocket).`;
        events.push(msg);
        logEvent("exit_recursive", msg);
        return { ok: true, command: trimmed, summary: msg, events };
      }

      case "board":
      case "craft": {
        const requested = (arg1 || "").toUpperCase();
        if (aiState.mountedCraft && (!requested || requested === "EXIT" || requested === "OFF")) {
          const prev = aiState.mountedCraft;
          aiState.mountedCraft = null;
          const msg = `Dismounted ${prev.type} at X=${getGameState().playerX}.`;
          events.push(msg);
          return { ok: true, command: trimmed, summary: msg, events };
        }
        const px = getGameState().playerX || 56;
        let craft = aiState.crafts.find((c) => requested && c.type.includes(requested));
        if (!craft) {
          craft = aiState.crafts.slice().sort((a, b) => Math.abs(a.x - px) - Math.abs(b.x - px))[0];
        }
        aiState.mountedCraft = craft;
        if (cosmic && typeof cosmic.boardCraft === "function") {
          cosmic.boardCraft(craft.type);
        }
        const msg = `Boarded rideable craft ${craft.type} (${craft.description}) at X=${px}!`;
        events.push(msg);
        logEvent("board_craft", msg, craft);
        return { ok: true, command: trimmed, summary: msg, events };
      }

      case "pipe":
      case "conduit": {
        const gs = getGameState();
        const blocks = gs.blocks || new Array(COARSE_W).fill(16);
        const px = gs.playerX || 56;
        const eco = getEcology();
        const vat = eco && eco.ComputeVats && eco.ComputeVats[0];
        const targetX = vat ? vat.x : Math.min(COARSE_W - 8, px + 10);
        const newPipe = {
          id: `conduit-${aiState.conduits.length + 1}`,
          type: "quantum_hyphae_pipe",
          fromX: px,
          fromY: surfaceYAt(blocks, px) + 1,
          toX: targetX,
          toY: surfaceYAt(blocks, targetX) + 1,
          flowRate: 88.0,
          medium: "AETHER_OPTICAL_CONDUIT",
        };
        aiState.conduits.push(newPipe);
        if (vat && vat.state === "IDLE" && global.SlopesEcology) {
          vat.state = "COMPUTING";
          vat.progress = Math.max(vat.progress || 0, 35);
        }
        if (cosmic && typeof cosmic.layConduit === "function") {
          cosmic.layConduit(px, targetX);
        }
        const msg = `Laid Energy & Compute Conduit Pipe linking X=${px} <-> X=${targetX} (flow 88.0 TFLOPS).`;
        events.push(msg);
        logEvent("conduit", msg, newPipe);
        return { ok: true, command: trimmed, summary: msg, events };
      }

      case "evolve": {
        const faction = (arg1 || "deer").toLowerCase();
        const trials = parseInt(arg2, 10) || 4096;
        const exp = runWasmScienceExperiment(faction, trials);
        const msg = `C/WASM Scientist (${exp.faction}) evolved ${exp.evolvedBlueprint} over ${exp.trials} trials (fitness=${exp.bestFitness}).`;
        events.push(msg);
        return { ok: true, command: trimmed, summary: msg, events, experiment: exp };
      }

      case "slice": {
        const delta = parseFloat(arg1);
        aiState.topologySlice = Number.isFinite(delta)
          ? +((aiState.topologySlice + delta) % 1.0).toFixed(2)
          : +((aiState.topologySlice + 0.25) % 1.0).toFixed(2);
        if (cosmic && typeof cosmic.shiftSlice === "function") {
          cosmic.shiftSlice(aiState.topologySlice);
        }
        const msg = `Shifted 4D transdimensional topology slice to W=${aiState.topologySlice.toFixed(2)}.`;
        events.push(msg);
        return { ok: true, command: trimmed, summary: msg, events };
      }

      case "rotate":
      case "rot": {
        const sub = (arg1 || "1").toLowerCase();
        let steps = 1;
        if (sub === "left" || sub === "l" || sub === "-1") steps = -1;
        else if (sub === "right" || sub === "r" || sub === "+1") steps = 1;
        else if (sub === "reverse" || sub === "rev" || sub === "mirror" || sub === "3") steps = 3;
        else steps = parseInt(sub, 10) || 1;

        const beforeFacet = getGameState().rotFacet || 0;
        if (g && typeof g.action === "function") {
          g.action("rotate", steps);
          // Step through the 24-frame 3D rotation animation so the new 2D world facet settles
          stepWorld(25, 1);
        }
        const afterState = getGameState();
        const afterFacet = typeof afterState.rotFacet === "number" ? afterState.rotFacet : ((beforeFacet + steps) % 5 + 5) % 5;
        const rotStatus = afterState.rotation || {};
        const msg = `Rotated 5-fold non-Euclidean world by ${steps} step(s): Facet ${beforeFacet}/5 -> Facet ${afterFacet}/5 (${rotStatus.label || `ROT ${afterFacet}/5 • ${afterFacet * 72}°`}${afterFacet === 3 ? " — EXACT MIRROR REVERSE OF ORIGIN!" : afterFacet === 0 ? " — RESTORED TO EXACT ORIGIN!" : ""}).`;
        events.push(msg);
        logEvent("rotate", msg, { beforeFacet, afterFacet, steps });
        return { ok: true, command: trimmed, summary: msg, events };
      }

      case "tabform":
      case "tab": {
        const tfSys =
          (g && g.tabFormSystem) ||
          global.SlopesTabForms ||
          null;
        if (!tfSys) {
          const noTfMsg = "Tab-Form Lifeform system not loaded.";
          return { ok: false, command: trimmed, summary: noTfMsg, events: [noTfMsg] };
        }
        const restParts = parts.slice(1);
        let tabId = null;
        let shellCmd = "body status";
        if (restParts.length > 0) {
          if (/^tab-0[1-9]$/i.test(restParts[0])) {
            tabId = restParts[0].toUpperCase();
            shellCmd = restParts.slice(1).join(" ") || "body status";
          } else {
            shellCmd = restParts.join(" ");
          }
        }
        const execRes =
          tabId !== null
            ? tfSys.executeCommand(tabId, shellCmd)
            : tfSys.executeCommand(shellCmd);
        stepWorld(4, 1);
        const cleanOut = String((execRes && execRes.output) || "")
          .replace(/\x1b\[[0-9;]*m/g, "")
          .trim();
        const firstLine = cleanOut.split("\n")[0] || "Executed Tab-Form shell command.";
        const msg = `Tab-Form [${tabId || "ACTIVE"}] $ ${shellCmd} -> ${firstLine}`;
        events.push(msg);
        if (cleanOut) events.push(cleanOut);
        logEvent("tabform", msg, { tabId, shellCmd, output: cleanOut });
        return { ok: true, command: trimmed, summary: msg, events, tabFormOutput: cleanOut };
      }

      case "auto": {
        const steps = Math.max(1, Math.min(50, parseInt(arg1, 10) || 5));
        const autoRes = runAutoAgent(steps);
        return {
          ok: true,
          command: trimmed,
          summary: autoRes.summary,
          events: autoRes.log,
        };
      }

      case "look":
      case "status":
      case "inspect": {
        const obs = getStructuredObservation();
        const msg = `Monolith at (${obs.monolith.x},${obs.monolith.y}) L${obs.monolith.worldLayer} [${obs.monolith.biomeLabel}] | Pop:${obs.civilizations.orangeHuman.population} Vats:${obs.civilizations.orangeHuman.computeVats} Bots:${obs.civilizations.orangeHuman.roamingAutomata} Crows:${obs.civilizations.corvusSky.seerCrows} DeerSci:${obs.civilizations.cervusMycelial.deerScientists} Goo:${obs.civilizations.skeksisGoo.gooNodes}`;
        events.push(msg);
        return { ok: true, command: trimmed, summary: msg, events };
      }

      case "help": {
        const helpMsg =
          "Commands: left/right/up/down [N], tamp, rock, hop, town, rotate [1..5|left|right|reverse], tabform [TAB-01] <cmd>, scale, step [N], hypertime [mult] [frames], seep [faction], enter [target], exit, board [craft], pipe, evolve [human|bird|deer|goo] [trials], slice, auto [N], look, status, inspect";
        events.push(helpMsg);
        return { ok: true, command: trimmed, summary: helpMsg, events };
      }

      default: {
        const unknownMsg = `Unknown command '${verb}'. Type 'help' for available commands.`;
        return { ok: false, command: trimmed, summary: unknownMsg, events: [unknownMsg] };
      }
    }
  }

  function executeCommand(cmdString) {
    const raw = String(cmdString || "").trim();
    const subCommands = raw
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean);

    if (subCommands.length === 0) {
      const obs = getStructuredObservation();
      return {
        ok: true,
        command: "",
        summary: "No command executed.",
        events: [],
        state: obs,
        asciiMap: renderAsciiMap(),
      };
    }

    const allEvents = [];
    const summaries = [];
    let allOk = true;

    for (let i = 0; i < subCommands.length; i++) {
      const res = executeSingleCommand(subCommands[i]);
      if (!res.ok) allOk = false;
      summaries.push(res.summary);
      if (res.events && res.events.length) {
        allEvents.push(...res.events);
      }
    }

    const finalObs = getStructuredObservation();
    return {
      ok: allOk,
      command: raw,
      summary: summaries.join(" | "),
      events: allEvents,
      state: finalObs,
      asciiMap: renderAsciiMap(),
    };
  }

  // ==========================================================================
  // 8. AUTONOMOUS AI MONOLITH AGENT (chooseSmartAction & runAutoAgent)
  // ==========================================================================
  const recentAutoCommands = [];

  function chooseSmartAction() {
    const obs = getStructuredObservation();
    const candidates = obs.recommendedActions || [];

    // Pick highest-utility action that avoids repeating the exact same non-movement action in a loop
    for (let i = 0; i < candidates.length; i++) {
      const c = candidates[i];
      const recentlyUsed = recentAutoCommands.slice(-3).includes(c.command);
      if (!recentlyUsed || c.priority >= 90) {
        return {
          command: c.command,
          priority: c.priority,
          reason: c.reason,
        };
      }
    }

    // Fallback varied exploration / civilization building cycle
    const cycle = [
      { command: "right 4", priority: 60, reason: "Patrol coastal ridge eastward." },
      { command: "tamp", priority: 68, reason: "Emit preventive Sonic Tamp pulse." },
      { command: "evolve bird 2048", priority: 72, reason: "Evolve Corvus Sky Lab ornithopter aerodynamics." },
      { command: "seep deer", priority: 70, reason: "Collapse bioluminescent WFC mycelial architecture." },
      { command: "left 4", priority: 60, reason: "Patrol coastal ridge westward." },
      { command: "hop", priority: 62, reason: "Jet-hop to survey upper terraces." },
    ];
    return cycle[aiState.tickCount % cycle.length];
  }

  function runAutoAgent(steps = 10) {
    const totalTurns = Math.max(1, Math.min(100, parseInt(steps, 10) || 10));
    const before = getStructuredObservation();
    const log = [];

    for (let turn = 1; turn <= totalTurns; turn++) {
      const choice = chooseSmartAction();
      recentAutoCommands.push(choice.command);
      if (recentAutoCommands.length > 8) recentAutoCommands.shift();

      const res = executeSingleCommand(choice.command);
      stepWorld(3, aiState.timeDilation);
      log.push(`Turn ${turn}/${totalTurns} [${choice.command}] (${choice.reason}) -> ${res.summary}`);
    }

    const after = getStructuredObservation();
    const summary = `Autonomous AI Monolith completed ${totalTurns} turns. Pop: ${before.civilizations.orangeHuman.population}->${after.civilizations.orangeHuman.population}, Bots: ${before.civilizations.orangeHuman.roamingAutomata}->${after.civilizations.orangeHuman.roamingAutomata}, WASM Exps: ${after.wasmExperiments.length}.`;

    return {
      ok: true,
      turns: totalTurns,
      summary,
      log,
      before,
      after,
      asciiMap: renderAsciiMap(),
    };
  }

  // ==========================================================================
  // 9. EXPORT PUBLIC API (window.SlopesAI & module.exports)
  // ==========================================================================
  const SlopesAI = {
    renderAsciiMap,
    getStructuredObservation,
    executeCommand,
    stepWorld,
    runWasmScienceExperiment,
    chooseSmartAction,
    runAutoAgent,
    get aiState() {
      ensureCosmicStateSynced();
      return aiState;
    },
  };

  global.SlopesAI = SlopesAI;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = SlopesAI;
  }
})(typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : this);
