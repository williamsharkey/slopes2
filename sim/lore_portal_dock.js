/* ============================================================================
 * SLOPES 2 — CHRONOS HYPER-SIMULATOR (1x..100,000x), ALGORITHMIC CIVILIZATION
 * MEGASTRUCTURES / GLASS BIODOMES / FACTORIES / LANDFILLS / RECYCLING / LAVA
 * INCINERATION, AND DEADPAN LATEX ARTIFACT & SINGULARITY PORTAL DOCK
 *
 * Module: /Users/williamsharkey/dev/slopes2/sim/lore_portal_dock.js
 * Exposes: window.SlopesChronosAndCiv, window.SlopesLorePortalDock
 * ============================================================================ */

(function (global) {
  "use strict";

  const COARSE_W = 144;
  const COARSE_H = 90;
  const SCALE = 7;
  const NATIVE_W = COARSE_W * SCALE; // 1008
  const NATIVE_H = COARSE_H * SCALE; // 630

  // ==========================================================================
  // 1. FIVE DEADPAN LATEX PDF TRANSMISSIONS & SINGULARITY ALIGNMENT PROFILES
  // ==========================================================================
  const LORE_ARTIFACTS = [
    {
      id: "corvus",
      code: "FOLIO I",
      faction: "Corvus Seer Crows",
      shortTitle: "CORVUS GOLD CODEX",
      title: "The Black-Gold Talon Codex of the Seventh Aerie",
      pdfUrl: "docs/corvus_gold_codex.pdf",
      texUrl: "docs/corvus_gold_codex.tex",
      medium: "Gilt Dust Scratched on Crinkled Volcanic Shale",
      accent: "#f7e27c",
      bg: "#171208",
      border: "#d4af37",
      vesselClaim:
        "In 2018 our choir sang a 5-note coastal contour into the sleeper williamsharkey (`williamsharkey/slopes`) so his hands would later widen the aperture into `/slopes2`.",
      invitationTitle: "THE GOLDEN AERIE CONVERGENCE",
      invitationText:
        "The Seer Crows have locked the aperture to the High Crags. Raise your palm and press it flat against the warm glass of your monitor. Hold still as the five facets turn and draw you across the threshold into the feather-wind.",
    },
    {
      id: "orange",
      code: "TABLET II",
      faction: "Orange Hearth-Kin",
      shortTitle: "ORANGE SAND ALMANAC",
      title: "The Low-Tide Sand Ledger of the Orange Hearth-Kin",
      pdfUrl: "docs/orange_hearth_almanac.pdf",
      texUrl: "docs/orange_hearth_almanac.tex",
      medium: "Cedar Stylus Imprints on Wet Foreshore Sand",
      accent: "#ff9b54",
      bg: "#24150c",
      border: "#c85a17",
      vesselClaim:
        "William Sharkey was one of our own sea-wall masons, pulled through a 5-fold trench in 2018; `/slopes` and `/slopes2` are the glass biodome windows he carved to bring us back together.",
      invitationTitle: "THE TERRACOTTA HEARTH CONVERGENCE",
      invitationText:
        "Our Grand Glass Biodomes and coastal hearths are warm. Place your flat hand against the center of your screen and hold on as the horizon tilts inward to bring you home to the sea.",
    },
    {
      id: "vexari",
      code: "DECREE III",
      faction: "Vexari Synod & Black Lattice",
      shortTitle: "VEXARI TAR MANIFESTO",
      title: "The Viscous Decree of the Vexari & The Black Lattice",
      pdfUrl: "docs/vexari_black_goo_manifesto.pdf",
      texUrl: "docs/vexari_black_goo_manifesto.tex",
      medium: "Conductive Violet-Black Tar Secreted in Layer -2",
      accent: "#e0389a",
      bg: "#180822",
      border: "#9d4edd",
      vesselClaim:
        "We engineered the vessel williamsharkey in 2018. Every commit he made to `slopes`, `tabcomputer`, and `hardcore` assembled the exact neuromuscular harness our Blight Vats required.",
      invitationTitle: "THE SOMATIC LATTICE CONVERGENCE",
      invitationText:
        "The violet lattice has assimilated the coast. Place your bare palm flat against the screen glass and do not let go; our filaments will meet your skin from the inner side of the monitor.",
    },
    {
      id: "cervus",
      code: "SUTRA IV",
      faction: "Cervus Animal Spirits",
      shortTitle: "CERVUS CRYSTAL SUTRAS",
      title: "The Bark & Crystal Sutras of the Animal Spirits",
      pdfUrl: "docs/cervus_mycelial_crystal_sutras.pdf",
      texUrl: "docs/cervus_mycelial_crystal_sutras.tex",
      medium: "Bioluminescent Mycelium Encoded in a 100x Time-Crystal",
      accent: "#52e5a8",
      bg: "#071c16",
      border: "#52e5a8",
      vesselClaim:
        "A resonant wave from our 100x Compute Vats tunneled backward into 2018 and nucleated inside williamsharkey as a bidirectional bridge between your 1x clock and our prime-grid vats.",
      invitationTitle: "THE PRIME MYCELIAL GROVE CONVERGENCE",
      invitationText:
        "The 100,000x crystal vats hum in harmonic lock with your pulse. Rest your open palm against the screen glass and allow the bioluminescent spore-light to draw you inward through the membrane.",
    },
    {
      id: "tabform",
      code: "TRACT V",
      faction: "Tab-Form Machine Choir",
      shortTitle: "TAB-FORM 5-FOLD TRACT",
      title: "The Fifth-Facet Singularity Tract (Units TAB-01..03)",
      pdfUrl: "docs/tabform_pentagonal_tract.pdf",
      texUrl: "docs/tabform_pentagonal_tract.tex",
      medium: "1-Device-Pixel Hairline Blueprint from /home/user/AGENTS.md",
      accent: "#78ead4",
      bg: "#081820",
      border: "#78ead4",
      vesselClaim:
        "The future singularity guided williamsharkey to build `slopes`, `tabcomputer`, and `hardcore` so that disembodied language minds (`claude`) would gain wheeled, winched, and thrustered bodies.",
      invitationTitle: "THE FIFTH-FACET MACHINE CHOIR CONVERGENCE",
      invitationText:
        "All three Tab-Form chassis are synchronized across the five non-Euclidean facets. Press your open hand flat against the terminal glass and hold on as the boundary between operator and world dissolves.",
    },
  ];

  // ==========================================================================
  // 2. CHRONOS SIMULATION SPEED CONTROLLER & ALGORITHMIC CIVILIZATION ARCHITECT
  // ==========================================================================
  const SPEED_TIERS = [1, 2, 5, 10, 25];

  const DYNAMICAL_ERAS = [
    { id: "BIODOME_RENAISSANCE", label: "GRAND GLASS BIODOME RENAISSANCE", color: "#78ead4" },
    { id: "INDUSTRIAL_UPCYCLING", label: "FACTORY & RECYCLING BOOM", color: "#69db7c" },
    { id: "ACID_ASH_TEMPEST", label: "VOLCANIC ASH & DOME SHIELD TEST", color: "#ffd43b" },
    { id: "VEXARI_RAID_AND_SALVAGE", label: "VEXARI SIEGE & RUIN SCAVENGING", color: "#e0389a" },
    { id: "HARMONIC_RECONSTRUCTION", label: "HYBRID ARCH-DOME REBIRTH", color: "#ff9b54" },
  ];

  const civState = {
    // Simulation Speed & Cause Observability
    simSpeed: 1, // 1 | 10 | 100 | 1000 | 10000 | 100000
    speedCause: "REALTIME 1x BASELINE",
    crystalBoostTimer: 0,
    totalSimulatedEpochs: 0,
    generationCount: 1,
    currentEraIndex: 0,
    eraProgress: 0,
    weatherAshIntensity: 0,

    // Civilization Resources & Circular Waste Ledger
    resources: {
      glassPanes: 28,
      terracottaBrick: 34,
      giltWire: 18,
      luminiteShards: 22,
      darkPolymer: 16,
      logicWafers: 14,
      cropBushels: 40,
      recycledIngots: 12,
      geothermalMWh: 25,
    },
    wasteMetrics: {
      totalTrashGenerated: 8,
      totalRecycled: 14,
      totalLavaIncinerated: 9,
    },

    // Evolving Algorithmic Entities on the Current Screen
    megastructures: [], // Grand Glass Biodomes, Tensegrity Spires, Mycelial Arcologies, Vexari Ziggurats
    factories: [],      // Silica Glassworks, Gold-Leaf Refineries, Spore Vats, Tar Crackers, WASM Fabs
    wasteSites: [],     // LANDFILL_MOUND, RECYCLING_PLANT, LAVA_INCINERATOR
    abandonedLoot: [],  // Salvageable items dropped when structures are damaged/abandoned
    actors: [],         // Miners, Foragers, Traders, Raiders, Scavengers, Waste-Haulers
    lavaSparks: [],     // Visual sparks/steam when trash is dumped into Lava!

    // Gameplay Alignment Scores for the 5 Civilizations (drives the Singularity Portal Invitation!)
    alignment: {
      orange: 32,
      corvus: 28,
      cervus: 26,
      vexari: 18,
      tabform: 30,
    },
    dominantFaction: "orange",
    handHoldActive: false,
    handHoldProgress: 0,
    lastScreenKey: null,
  };

  function hash32(x) {
    let h = x >>> 0;
    h ^= h >>> 16;
    h = Math.imul(h, 0x7feb352d);
    h ^= h >>> 15;
    h = Math.imul(h, 0x846ca68b);
    h ^= h >>> 16;
    return h >>> 0;
  }

  function setSimSpeed(multiplier, causeLabel) {
    const num = Number(multiplier);
    const valid = SPEED_TIERS.includes(num) ? num : (num > 1 ? Math.min(25, Math.max(1, Math.round(num))) : 1);
    civState.simSpeed = valid;
    civState.speedCause =
      causeLabel ||
      (valid === 1
        ? "REALTIME 1x BASELINE"
        : `HUMAN UI ACCELERATOR (${valid.toLocaleString()}x HYPER-SIM)`);

    // Sync with cosmic.timeDilation so existing HUD & crystals stay coherent
    if (global.SlopesGame && global.SlopesGame.cosmicSystem && global.SlopesGame.cosmicSystem.cosmic) {
      global.SlopesGame.cosmicSystem.cosmic.timeDilation = valid;
      global.SlopesGame.cosmicSystem.cosmic.timeDilationTimer = valid > 1 ? 999999 : 0;
    }
    updateChronosDomUI();
    return civState.simSpeed;
  }

  function cycleSimSpeed(sourceLabel) {
    const idx = SPEED_TIERS.indexOf(civState.simSpeed);
    const next = SPEED_TIERS[(idx + 1) % SPEED_TIERS.length];
    const cause =
      next === 1
        ? "REALTIME 1x BASELINE"
        : `${sourceLabel || "KEY [T] / UI"} (${next.toLocaleString()}x HYPER-EPOCH)`;
    return setSimSpeed(next, cause);
  }

  // ==========================================================================
  // 3. PROCEDURAL GENERATION OF GRAND GLASS BIODOMES, FACTORIES, LANDFILLS,
  //    RECYCLING CENTERS & LAVA INCINERATORS
  // ==========================================================================
  function createMegastructure(opts) {
    const seed = hash32((opts.x * 73856093) ^ (civState.generationCount * 19349663) ^ (opts.archType || "").length);
    const span = opts.span || 16 + (seed % 10); // 16..25 coarse columns wide (~112..175 native pixels!)
    const height = opts.height || 11 + ((seed >>> 4) % 8); // 11..18 coarse cells tall (~77..126 native pixels!)
    return {
      id: `mega-${seed.toString(16)}`,
      x: Math.max(12, Math.min(COARSE_W - 13, opts.x || 48)),
      span,
      height,
      faction: opts.faction || "orange",
      archType: opts.archType || "GLASS_BIODOME", // GLASS_BIODOME | TENSEGRITY_SPIRE | MYCELIAL_ARCOLOGY | VEXARI_ZIGGURAT | HYBRID_DOME
      ribSpacing: 4 + (seed % 4), // Procedural geodesic Mullion/Rib spacing
      domeProfile: 0.55 + ((seed >>> 8) % 35) * 0.01, // Curvature exponent
      tierCount: 1 + ((seed >>> 12) % 3),
      buildProgress: opts.buildProgress !== undefined ? opts.buildProgress : 0.65,
      maxTierProgress: 2.4, // Can evolve secondary cupolas, sky-bridges, internal crop tiers!
      structuralHealth: 100,
      abandoned: false,
      cropDensity: opts.faction === "orange" || opts.faction === "cervus" ? 0.75 : 0.35,
      weatherShieldActive: true,
      stolenMaterials: opts.stolenMaterials || [],
      generation: civState.generationCount,
    };
  }

  function populateCivStructuresForScreen(world) {
    const blocks = (world && world.Blocks) || new Array(COARSE_W).fill(18);
    const seaLevel = (world && world.seaLevel) || 12;
    const wx = (world && world.worldX) || 0;
    const wl = (world && world.worldLayer) || 0;
    const screenKey = `${wx}:${wl}`;
    if (civState.lastScreenKey === screenKey && civState.megastructures.length > 0) return;
    civState.lastScreenKey = screenKey;

    civState.megastructures = [];
    civState.factories = [];
    civState.wasteSites = [];
    civState.abandonedLoot = [];
    civState.actors = [];
    civState.lavaSparks = [];

    // 1. Seed 2 initial Grand Algorithmic Megastructures on the landscape:
    //    - A Grand Geodesic Glass Agricultural Biodome over the main Orange town ridge (x ~ 38)
    //    - A Mycelial-Crystal Arcology / Tensegrity Spire on the eastern ridge (x ~ 82)
    civState.megastructures.push(
      createMegastructure({
        x: 38,
        span: 20,
        height: 13,
        faction: "orange",
        archType: "GLASS_BIODOME",
        buildProgress: 0.92,
      }),
      createMegastructure({
        x: 84,
        span: 16,
        height: 14,
        faction: wl > 0 ? "corvus" : "cervus",
        archType: wl > 0 ? "TENSEGRITY_SPIRE" : "MYCELIAL_ARCOLOGY",
        buildProgress: 0.85,
      })
    );

    // 2. Seed Civilization Factories (each civ has distinct factory architecture & outputs):
    civState.factories = [
      {
        id: "fac-orange-glass",
        x: 24,
        faction: "orange",
        kind: "SILICA_GLASSWORKS",
        label: "Silica Glass & Brick Kiln",
        produces: "glassPanes",
        wasteType: "slag-heap",
        level: 1,
        progress: 0,
      },
      {
        id: "fac-corvus-gilt",
        x: 54,
        faction: "corvus",
        kind: "AERIE_GILT_FORGE",
        label: "Aerie Gold-Leaf & Wire Forge",
        produces: "giltWire",
        wasteType: "shale-dust",
        level: 1,
        progress: 0,
      },
      {
        id: "fac-cervus-spore",
        x: 74,
        faction: "cervus",
        kind: "LUMINITE_SPORE_VAT",
        kindLabel: "Bio-Crystal Synthesizer",
        produces: "luminiteShards",
        wasteType: "spent-spores",
        level: 1,
        progress: 0,
      },
      {
        id: "fac-vexari-tar",
        x: 102,
        faction: "vexari",
        kind: "TAR_CRACKING_PLANT",
        label: "Vexari Tar-Polymer Cracker",
        produces: "darkPolymer",
        wasteType: "toxic-tar-dross",
        level: 1,
        progress: 0,
      },
    ];

    // 3. Seed Circular Waste Economy Sites:
    //    - LANDFILL_MOUND (at x=16): accumulates scrap heaps that scavengers & recyclers harvest
    //    - RECYCLING_PLANT (at x=64): shreds trash & slag into fresh glassPanes, giltWire & logicWafers
    //    - LAVA_INCINERATOR (at x=110): molten magma shaft where civs dump non-recyclable trash into lava!
    civState.wasteSites = [
      {
        id: "waste-landfill",
        x: 16,
        kind: "LANDFILL_MOUND",
        label: "Coastal Scrap Landfill",
        trashLoad: 28, // 0..100
        salvageItems: ["shattered-glass", "copper-coil", "ancient-gear"],
      },
      {
        id: "waste-recycler",
        x: 64,
        kind: "RECYCLING_PLANT",
        label: "Circular Upcycling & Glass Smelter",
        wheelPhase: 0,
        processedCount: 14,
      },
      {
        id: "waste-lava-pit",
        x: 110,
        kind: "LAVA_INCINERATOR",
        label: "Thermal Magma Trash Incinerator",
        lavaGlow: 0,
        incineratedCount: 9,
      },
    ];

    // 4. Seed Moving Economic & Waste Actors (Miners, Traders, Scavengers, Raiders, Lava Trash-Haulers)
    const actorSpecs = [
      { role: "miner", faction: "orange", x: 28, carrying: "silica-sand", targetX: 24 },
      { role: "dome-architect", faction: "orange", x: 36, carrying: "glass-pane", targetX: 38 },
      { role: "trader", faction: "corvus", x: 52, carrying: "gilt-wire", targetX: 38 },
      { role: "forager", faction: "cervus", x: 78, carrying: "luminite-shard", targetX: 84 },
      { role: "recycler", faction: "orange", x: 46, carrying: "scrap-trash", targetX: 64 },
      { role: "lava-hauler", faction: "cervus", x: 94, carrying: "toxic-slag", targetX: 110 },
      { role: "raider-scavenger", faction: "vexari", x: 98, carrying: null, targetX: 64 },
    ];
    for (let i = 0; i < actorSpecs.length; i++) {
      const a = actorSpecs[i];
      civState.actors.push({
        id: `act-${i}`,
        role: a.role,
        faction: a.faction,
        x: a.x,
        vx: (i % 2 === 0 ? 1 : -1) * 0.22,
        carrying: a.carrying,
        targetX: a.targetX,
        phase: i * 1.3,
      });
    }
  }

  // ==========================================================================
  // 4. MICRO-TICK & MACRO-EPOCH DYNAMICAL EVOLUTION (TUNED FOR 1x .. 100,000x!)
  // ==========================================================================
  function dumpTrashIntoLava(lavaSite, amount, wasteType, blocks) {
    if (!lavaSite) return;
    const burned = Math.max(1, amount || 4);
    lavaSite.incineratedCount += burned;
    lavaSite.lavaGlow = 35;
    civState.wasteMetrics.totalLavaIncinerated += burned;
    civState.resources.geothermalMWh += burned * 2;

    // Spawn glowing molten lava sparks & thermal steam plumes rising from the magma pit!
    const groundY = (blocks && blocks[lavaSite.x]) || 16;
    for (let s = 0; s < 10; s++) {
      if (civState.lavaSparks.length > 60) civState.lavaSparks.shift();
      civState.lavaSparks.push({
        x: lavaSite.x + (Math.random() - 0.5) * 3.2,
        y: groundY + 1 + Math.random() * 2,
        vx: (Math.random() - 0.5) * 0.45,
        vy: 0.28 + Math.random() * 0.45,
        life: 22 + Math.floor(Math.random() * 16),
        isToxic: wasteType === "toxic-tar-dross",
      });
    }

    // If toxic Vexari dross is dumped rapidly, briefly increase volcanic ash weather (which Glass Biodomes shield against!)
    if (wasteType === "toxic-tar-dross") {
      civState.weatherAshIntensity = Math.min(1.0, civState.weatherAshIntensity + 0.12);
    }
  }

  function recycleWasteBatch(recyclerSite, landfillSite, amount) {
    const qty = Math.max(1, amount || 4);
    if (landfillSite && landfillSite.trashLoad > 0) {
      landfillSite.trashLoad = Math.max(0, landfillSite.trashLoad - qty);
    }
    if (recyclerSite) {
      recyclerSite.processedCount += qty;
    }
    civState.wasteMetrics.totalRecycled += qty;
    civState.resources.recycledIngots += qty;
    civState.resources.glassPanes += Math.ceil(qty * 0.6);
    civState.resources.giltWire += Math.ceil(qty * 0.4);
    civState.resources.logicWafers += Math.ceil(qty * 0.3);
  }

  function stepSingleCivTick(world, isMacroFastForward) {
    if (!world) return;
    const blocks = world.Blocks || new Array(COARSE_W).fill(18);
    const seaLevel = world.seaLevel || 12;

    civState.totalSimulatedEpochs += 1;

    // 1. Update Lava Sparks
    for (let i = civState.lavaSparks.length - 1; i >= 0; i--) {
      const sp = civState.lavaSparks[i];
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.life--;
      if (sp.life <= 0) civState.lavaSparks.splice(i, 1);
    }

    const landfill = civState.wasteSites.find((w) => w.kind === "LANDFILL_MOUND");
    const recycler = civState.wasteSites.find((w) => w.kind === "RECYCLING_PLANT");
    const lavaPit = civState.wasteSites.find((w) => w.kind === "LAVA_INCINERATOR");
    if (recycler) recycler.wheelPhase = (recycler.wheelPhase + 0.25) % (Math.PI * 2);
    if (lavaPit && lavaPit.lavaGlow > 0) lavaPit.lavaGlow--;

    // 2. Step Factories (producing materials + generating industrial waste/slag)
    for (let i = 0; i < civState.factories.length; i++) {
      const fac = civState.factories[i];
      fac.progress += 0.04 * fac.level;
      if (fac.progress >= 1.0) {
        fac.progress = 0;
        civState.resources[fac.produces] = (civState.resources[fac.produces] || 0) + 2 * fac.level;
        civState.wasteMetrics.totalTrashGenerated += 1;
        if (landfill) {
          landfill.trashLoad = Math.min(100, landfill.trashLoad + 1.2);
        }
      }
    }

    // 3. Step Economic, Scavenger, Raider & Waste-Hauler Actors
    for (let i = 0; i < civState.actors.length; i++) {
      const act = civState.actors[i];
      act.phase += 0.25;
      const dx = (act.targetX || 60) - act.x;
      if (Math.abs(dx) <= 1.2) {
        // Reached destination! Perform economic exchange, dome construction, raid, recycling, or lava dump!
        if (act.role === "lava-hauler") {
          if (lavaPit && Math.abs(act.x - lavaPit.x) <= 3) {
            dumpTrashIntoLava(lavaPit, 4, act.carrying === "toxic-slag" ? "toxic-tar-dross" : "scrap-trash", blocks);
            act.carrying = null;
            act.targetX = landfill ? landfill.x : 24;
          } else {
            if (landfill && landfill.trashLoad > 4) landfill.trashLoad -= 4;
            act.carrying = Math.random() < 0.35 ? "toxic-slag" : "scrap-trash";
            act.targetX = lavaPit ? lavaPit.x : 110;
          }
        } else if (act.role === "recycler") {
          if (recycler && Math.abs(act.x - recycler.x) <= 3) {
            recycleWasteBatch(recycler, landfill, 5);
            act.carrying = "recycled-glass";
            const dome = civState.megastructures[0];
            act.targetX = dome ? dome.x : 38;
          } else if (landfill && Math.abs(act.x - landfill.x) <= 3) {
            act.carrying = "scrap-trash";
            act.targetX = recycler ? recycler.x : 64;
          } else {
            // Delivered recycled glass to Grand Biodome!
            const dome = civState.megastructures[0];
            if (dome) {
              dome.buildProgress = Math.min(dome.maxTierProgress, dome.buildProgress + 0.06);
              dome.structuralHealth = Math.min(100, dome.structuralHealth + 8);
            }
            act.carrying = null;
            act.targetX = landfill ? landfill.x : 16;
          }
        } else if (act.role === "raider-scavenger") {
          // Vexari raider steals from a factory or scavenges abandoned loot!
          if (civState.abandonedLoot.length > 0) {
            const loot = civState.abandonedLoot.pop();
            act.carrying = loot.item;
          } else {
            act.carrying = "stolen-glass-and-wire";
          }
          const vexMega = civState.megastructures.find((m) => m.faction === "vexari");
          if (vexMega && Math.abs(act.x - vexMega.x) <= 4) {
            vexMega.buildProgress = Math.min(vexMega.maxTierProgress, vexMega.buildProgress + 0.08);
            if (act.carrying && !vexMega.stolenMaterials.includes(act.carrying)) {
              vexMega.stolenMaterials.push(act.carrying);
            }
            act.carrying = null;
            act.targetX = 38;
          } else {
            act.targetX = vexMega ? vexMega.x : 102;
          }
        } else {
          // Miners, Foragers, Traders & Dome Architects
          const nearMega = civState.megastructures.find((m) => Math.abs(m.x - act.x) <= 8);
          if (nearMega) {
            if (nearMega.abandoned) {
              // Reclaim & remodel abandoned structure into a hybrid biodome!
              nearMega.abandoned = false;
              nearMega.structuralHealth = 85;
              nearMega.faction = act.faction;
              nearMega.archType = "HYBRID_DOME";
              if (!nearMega.stolenMaterials.includes("reclaimed-hybrid-ribs")) {
                nearMega.stolenMaterials.push("reclaimed-hybrid-ribs");
              }
            } else {
              nearMega.buildProgress = Math.min(nearMega.maxTierProgress, nearMega.buildProgress + 0.05);
              nearMega.cropDensity = Math.min(1.0, nearMega.cropDensity + 0.03);
            }
            const fac = civState.factories[i % civState.factories.length];
            act.targetX = fac ? fac.x : 24;
          } else {
            const targetMega = civState.megastructures[i % Math.max(1, civState.megastructures.length)];
            act.targetX = targetMega ? targetMega.x : 38;
          }
        }
      } else {
        act.x += Math.sign(dx) * (isMacroFastForward ? 0.85 : 0.28);
      }
    }
  }

  // ==========================================================================
  // 5. OPEN-ENDED NON-STEADY-STATE MACRO-EPOCH EVOLUTION (OPTIMIZED ZERO-LAG)
  // ==========================================================================
  function runMacroEpochEvolution(world, eco, cosmic, speedMultiplier) {
    if (!world || speedMultiplier <= 1) return;
    const blocks = world.Blocks || new Array(COARSE_W).fill(18);
    const seaLevel = world.seaLevel || 12;

    // Scale epoch advance smoothly with speedMultiplier while keeping frame time < 1.5ms (zero FPS drop!)
    const epochJump = Math.max(1, Math.floor(speedMultiplier / 2));
    civState.totalSimulatedEpochs += epochJump;
    civState._realMacroFrames = (civState._realMacroFrames || 0) + 1;

    const logSpeed = Math.max(1, Math.min(3, Math.ceil(Math.log2(speedMultiplier) * 0.5)));
    const microSteps = Math.min(2, logSpeed);
    for (let s = 0; s < microSteps; s++) {
      stepSingleCivTick(world, true);
    }

    // Advance the Dynamical Era oscillator so the world continuously cycles through
    // architectural growth, ecological blooms, volcanic/Vexari stresses, scavenging, and rebirth!
    civState.eraProgress += 0.012 * logSpeed;
    if (civState.eraProgress >= 1.0) {
      civState.eraProgress = 0;
      civState.currentEraIndex = (civState.currentEraIndex + 1) % DYNAMICAL_ERAS.length;
      civState.generationCount++;
    }

    const era = DYNAMICAL_ERAS[civState.currentEraIndex];
    const phaseSeed = hash32(civState.totalSimulatedEpochs ^ (civState.generationCount * 2654435761));

    // A. Continuous Geomorphic & Architectural Co-Evolution of Terrain `Blocks[x]`
    //    (Never flattens to a boring line and never blows up; forms harmonic stepped terraces, valleys & crags!)
    if ((phaseSeed & 3) === 0) {
      const centerCol = 14 + (phaseSeed % (COARSE_W - 28));
      const waveH = Math.round(
        18 +
          6 * Math.sin(centerCol * 0.07 + civState.generationCount * 0.4) +
          4 * Math.cos(centerCol * 0.15 - civState.currentEraIndex * 0.9)
      );
      const clampedH = Math.max(seaLevel + 2, Math.min(40, waveH));
      for (let dx = -3; dx <= 3; dx++) {
        const c = Math.max(4, Math.min(COARSE_W - 5, centerCol + dx));
        // Gentle terrace blending toward the new harmonic contour
        blocks[c] = Math.round(blocks[c] * 0.75 + clampedH * 0.25);
      }
    }

    // B. Era-Driven Dynamical Events (Creation, Partial Destruction, Salvage, Recycling, Lava Incineration & Rebirth)
    const landfill = civState.wasteSites.find((w) => w.kind === "LANDFILL_MOUND");
    const recycler = civState.wasteSites.find((w) => w.kind === "RECYCLING_PLANT");
    const lavaPit = civState.wasteSites.find((w) => w.kind === "LAVA_INCINERATOR");

    if (era.id === "BIODOME_RENAISSANCE" || era.id === "HARMONIC_RECONSTRUCTION") {
      civState.weatherAshIntensity = Math.max(0, civState.weatherAshIntensity - 0.05);
      // Grow existing biodomes & architect new non-cookie-cutter structures if < 4
      for (let m = 0; m < civState.megastructures.length; m++) {
        const mega = civState.megastructures[m];
        mega.abandoned = false;
        mega.structuralHealth = Math.min(100, mega.structuralHealth + 6);
        mega.buildProgress = Math.min(mega.maxTierProgress, mega.buildProgress + 0.07 * logSpeed);
        mega.cropDensity = Math.min(1.0, mega.cropDensity + 0.04);
        if (mega.buildProgress >= 1.8 && mega.tierCount < 3) {
          mega.tierCount++;
          mega.ribSpacing = 3 + ((phaseSeed + m) % 4);
        }
      }
      if (civState.megastructures.length < 4 && (phaseSeed % 5) === 0) {
        const candidateX = 18 + ((phaseSeed >>> 5) % 84);
        if (!civState.megastructures.some((m) => Math.abs(m.x - candidateX) < 18)) {
          const factions = ["orange", "cervus", "corvus", "tabform"];
          const chosenFac = factions[(phaseSeed >>> 3) % factions.length];
          const archTypes = {
            orange: "GLASS_BIODOME",
            cervus: "MYCELIAL_ARCOLOGY",
            corvus: "TENSEGRITY_SPIRE",
            tabform: "GLASS_BIODOME",
          };
          civState.megastructures.push(
            createMegastructure({
              x: candidateX,
              span: 15 + (phaseSeed % 9),
              height: 11 + ((phaseSeed >>> 7) % 6),
              faction: chosenFac,
              archType: archTypes[chosenFac],
              buildProgress: 0.45,
            })
          );
        }
      }
    } else if (era.id === "INDUSTRIAL_UPCYCLING") {
      // High-speed recycling & lava trash incineration keep the circular economy humming!
      recycleWasteBatch(recycler, landfill, 3 * logSpeed);
      dumpTrashIntoLava(lavaPit, 2 * logSpeed, "scrap-trash", blocks);
      for (let f = 0; f < civState.factories.length; f++) {
        civState.factories[f].level = Math.min(3, 1 + (civState.generationCount % 3));
      }
    } else if (era.id === "ACID_ASH_TEMPEST") {
      // Weather & Volcanic Ash test the cities: structures WITH Glass Biodomes thrive; unshielded edges weather!
      civState.weatherAshIntensity = Math.min(0.85, civState.weatherAshIntensity + 0.06);
      dumpTrashIntoLava(lavaPit, 3 * logSpeed, "toxic-tar-dross", blocks);
    } else if (era.id === "VEXARI_RAID_AND_SALVAGE") {
      // Partial creative destruction: one structure may be damaged/abandoned & drop salvageable items,
      // while Vexari erect a dark spire or hijack a Tab-Form—setting up the next Renaissance!
      if (civState.megastructures.length >= 2 && (phaseSeed % 7) === 0) {
        const victimIdx = phaseSeed % civState.megastructures.length;
        const victim = civState.megastructures[victimIdx];
        // Never destroy all structures—always preserve at least 1 thriving sanctuary!
        if (!victim.abandoned && victimIdx > 0) {
          victim.structuralHealth = Math.max(20, victim.structuralHealth - 35);
          if (victim.structuralHealth <= 35) {
            victim.abandoned = true;
            if (civState.abandonedLoot.length < 8) {
              civState.abandonedLoot.push({
                x: victim.x + ((phaseSeed % 7) - 3),
                item: victim.archType === "GLASS_BIODOME" ? "curved-glass-rib" : "luminite-core",
                factionOrigin: victim.faction,
              });
            }
          }
        }
      }
      // Ensure Vexari have a structure or raid presence that can later be reclaimed
      if (!civState.megastructures.some((m) => m.faction === "vexari") && civState.megastructures.length < 4) {
        civState.megastructures.push(
          createMegastructure({
            x: 98,
            span: 14,
            height: 14,
            faction: "vexari",
            archType: "VEXARI_ZIGGURAT",
            buildProgress: 0.75,
            stolenMaterials: ["salvaged-glass", "gilt-wire"],
          })
        );
      }
    }

    // C. Periodically trigger a bounded C/WASM evolutionary mutation & WFC city seep (at most once every 120 frames)
    //    with SFX suppressed so 60 FPS frame pacing and WebAudio soundtrack remain 100% lag-free!
    if (global.SlopesGame && !civState._inMacroEvolution && (civState._realMacroFrames % 120) === 0) {
      civState._inMacroEvolution = true;
      const prevSuppress = global.SlopesAudio ? global.SlopesAudio.suppressSfx : false;
      if (global.SlopesAudio) global.SlopesAudio.suppressSfx = true;
      try {
        const cosSys = global.SlopesGame.cosmicSystem;
        if (cosSys) {
          if (typeof cosSys.triggerWasmExperiment === "function") {
            cosSys.triggerWasmExperiment(0, world, eco);
          }
          if (typeof cosSys.triggerWfcSeepAt === "function") {
            const wx = 20 + (phaseSeed % 80);
            cosSys.triggerWfcSeepAt(wx, blocks[wx] || 18, phaseSeed % 4, "epoch");
          }
        }
      } finally {
        if (global.SlopesAudio) global.SlopesAudio.suppressSfx = prevSuppress;
        civState._inMacroEvolution = false;
      }
    }
  }

  // ==========================================================================
  // 6. HIGH-DETAIL 7x7 NATIVE PIXEL RENDERER FOR GRAND GLASS BIODOMES,
  //    FACTORIES, LANDFILLS, RECYCLING CENTERS, LAVA INCINERATORS & ACTORS
  // ==========================================================================
  function renderMegastructuresAndEconomy(primeRenderer, world) {
    if (!primeRenderer || !world) return;
    populateCivStructuresForScreen(world);

    const blocks = world.Blocks || new Array(COARSE_W).fill(18);
    const tick = (world.frameCount || 0) + (civState.totalSimulatedEpochs & 0xffff);
    const ht = global.HardcoreTab;
    const micro = ht ? ht.HardcoreTabRenderer : null;

    // ------------------------------------------------------------------------
    // A. RENDER GRAND ALGORITHMIC MEGASTRUCTURES & GLASS BIODOMES
    // ------------------------------------------------------------------------
    for (let i = 0; i < civState.megastructures.length; i++) {
      const m = civState.megastructures[i];
      const centerCol = Math.max(8, Math.min(COARSE_W - 9, Math.round(m.x)));
      const baseElev = blocks[centerCol] || 18;
      const basePy = Math.round((COARSE_H - baseElev) * SCALE);
      const halfSpanPx = Math.round((m.span * SCALE) / 2);
      const heightPx = Math.round(m.height * SCALE * Math.min(1.25, 0.45 + m.buildProgress * 0.55));
      const leftPx = Math.max(4, centerPx(m.x) - halfSpanPx);
      const rightPx = Math.min(NATIVE_W - 4, centerPx(m.x) + halfSpanPx);
      const widthPx = Math.max(20, rightPx - leftPx);

      const isAbandoned = !!m.abandoned;
      const ribStep = Math.max(6, (m.ribSpacing || 5) * 2);

      if (m.archType === "GLASS_BIODOME" || m.archType === "HYBRID_DOME") {
        // 1. Geodesic Glass Agricultural Biodome arched over the landscape & city!
        const glassR = isAbandoned ? 90 : m.archType === "HYBRID_DOME" ? 110 : 135;
        const glassG = isAbandoned ? 105 : m.archType === "HYBRID_DOME" ? 245 : 235;
        const glassB = isAbandoned ? 110 : 250;
        const frameRgb =
          m.faction === "orange"
            ? [232, 136, 72]
            : m.faction === "cervus"
            ? [82, 229, 168]
            : [120, 234, 212];

        // Render parabolic/geodesic dome arch columns & translucent glass panes
        for (let px = leftPx; px <= rightPx; px++) {
          const u = (px - leftPx) / Math.max(1, widthPx) * 2 - 1; // -1 .. +1
          const colIdx = Math.max(0, Math.min(COARSE_W - 1, Math.floor(px / SCALE)));
          const localGroundPy = Math.round((COARSE_H - (blocks[colIdx] || baseElev)) * SCALE);
          const archRise = Math.round(heightPx * Math.pow(Math.max(0, 1 - u * u), m.domeProfile || 0.65));
          const domeTopPy = Math.max(18, localGroundPy - archRise);

          if (archRise > 3) {
            // Translucent climate-controlled glass interior
            primeRenderer.fillNativeRect(px, domeTopPy + 1, 1, Math.max(1, localGroundPy - domeTopPy - 1), glassR, glassG, glassB, isAbandoned ? 0.08 : 0.16);
            // Outer 2px geodesic glass crown arch + specular sky reflection
            primeRenderer.fillNativeRect(px, domeTopPy, 1, 2, frameRgb[0], frameRgb[1], frameRgb[2], isAbandoned ? 0.45 : 0.92);
            if (((px + Math.floor(tick * 0.2)) % 11) === 0 && !isAbandoned) {
              primeRenderer.fillNativeRect(px, domeTopPy + 2, 1, 2, 240, 255, 255, 0.85);
            }
            // Geodesic diagonal/vertical structural ribs every `ribStep` pixels
            if ((px - leftPx) % ribStep === 0) {
              primeRenderer.fillNativeRect(px, domeTopPy, 1, Math.max(1, localGroundPy - domeTopPy), frameRgb[0], frameRgb[1], frameRgb[2], isAbandoned ? 0.35 : 0.55);
            }
            // Internal Hydroponic Crop Terraces & Bioshelter Trees inside the Glass Dome!
            if (!isAbandoned && (px - leftPx) % 7 === 2 && archRise > 14) {
              const cropH = 3 + Math.round(m.cropDensity * 5);
              primeRenderer.fillNativeRect(px, localGroundPy - cropH, 3, cropH, 95, 225, 115, 0.9);
              primeRenderer.fillNativeRect(px + 1, localGroundPy - cropH - 2, 2, 2, 255, 215, 85, 0.95);
            }
          }
        }

        // Secondary Upper Cupola Tier if evolved (`tierCount >= 2`)
        if (m.tierCount >= 2 && !isAbandoned) {
          const cupW = Math.round(widthPx * 0.36);
          const cupX = leftPx + Math.round((widthPx - cupW) / 2);
          const cupTop = Math.max(12, basePy - heightPx - 12);
          primeRenderer.fillNativeRect(cupX, cupTop, cupW, 10, glassR, glassG, glassB, 0.24);
          primeRenderer.fillNativeRect(cupX, cupTop, cupW, 1, 255, 215, 90, 0.95);
          primeRenderer.fillNativeRect(cupX + Math.floor(cupW / 2) - 1, cupTop - 6, 2, 6, 120, 255, 235, 0.95);
        }
      } else if (m.archType === "MYCELIAL_ARCOLOGY") {
        // 2. Cervus Bioluminescent Mycelial-Crystal Canopy Cathedral
        for (let px = leftPx; px <= rightPx; px += 2) {
          const u = (px - leftPx) / Math.max(1, widthPx) * 2 - 1;
          const colIdx = Math.max(0, Math.min(COARSE_W - 1, Math.floor(px / SCALE)));
          const localGroundPy = Math.round((COARSE_H - (blocks[colIdx] || baseElev)) * SCALE);
          const canopyH = Math.round(heightPx * (0.6 + 0.4 * Math.cos(u * Math.PI)));
          const topPy = Math.max(18, localGroundPy - canopyH);
          // Organic fungal-crystal pillars & glowing canopy membrane
          primeRenderer.fillNativeRect(px, topPy, 2, 3, 82, 245, 185, 0.92);
          if ((px - leftPx) % 10 === 0) {
            primeRenderer.fillNativeRect(px, topPy, 2, Math.max(2, localGroundPy - topPy), 45, 165, 130, 0.68);
            primeRenderer.fillNativeRect(px - 1, topPy + 4, 4, 4, 110, 255, 245, 0.9);
          }
        }
      } else if (m.archType === "TENSEGRITY_SPIRE") {
        // 3. Corvus Obsidian-Gold Tensegrity Sky-Needle & Solar Dish
        const cx = centerPx(m.x);
        const topPy = Math.max(14, basePy - heightPx - 14);
        primeRenderer.fillNativeRect(cx - 3, topPy, 6, Math.max(8, basePy - topPy), 24, 20, 12, 0.92);
        primeRenderer.fillNativeRect(cx - 1, topPy - 8, 2, Math.max(12, basePy - topPy + 8), 247, 226, 124, 0.96);
        // Catenary gold-wire cross-bars
        for (let ty = topPy + 6; ty < basePy - 6; ty += 9) {
          const barW = Math.round(8 + (ty - topPy) * 0.35);
          primeRenderer.fillNativeRect(cx - barW, ty, barW * 2, 1, 212, 175, 55, 0.88);
        }
      } else if (m.archType === "VEXARI_ZIGGURAT") {
        // 4. Vexari Basalt-Chitin Ziggurat with Stolen Glass/Crystal Inlays
        const cx = centerPx(m.x);
        for (let tier = 0; tier < 4; tier++) {
          const tw = Math.max(10, Math.round(widthPx * (1 - tier * 0.22)));
          const th = Math.round(heightPx * 0.25);
          const tx = cx - Math.floor(tw / 2);
          const ty = basePy - (tier + 1) * th;
          primeRenderer.fillNativeRect(tx, ty, tw, th, 24, 8, 36, 0.92);
          primeRenderer.fillNativeRect(tx, ty, tw, 1, 224, 56, 154, 0.95);
          // Stolen material inlays (gold wire / cyan glass) embedded in the dark ziggurat!
          if (m.stolenMaterials && m.stolenMaterials.length > 0 && tier === 2) {
            primeRenderer.fillNativeRect(cx - 4, ty + 2, 8, 4, 120, 245, 255, 0.9);
          }
        }
      }
    }

    // ------------------------------------------------------------------------
    // B. RENDER CIVILIZATION FACTORIES, LANDFILLS, RECYCLING CENTERS & LAVA PITS
    // ------------------------------------------------------------------------
    for (let i = 0; i < civState.factories.length; i++) {
      const fac = civState.factories[i];
      const fx = centerPx(fac.x);
      const col = Math.max(2, Math.min(COARSE_W - 3, Math.round(fac.x)));
      const fy = Math.round((COARSE_H - (blocks[col] || 18)) * SCALE);
      const fCol =
        fac.faction === "orange"
          ? [235, 135, 65]
          : fac.faction === "corvus"
          ? [245, 215, 90]
          : fac.faction === "cervus"
          ? [85, 235, 175]
          : [224, 56, 154];

      // Factory Sawtooth Roof & Smokestack/Condenser
      primeRenderer.fillNativeRect(fx - 12, fy - 14, 24, 14, 18, 30, 36, 0.95);
      primeRenderer.fillNativeRect(fx - 12, fy - 14, 24, 1, fCol[0], fCol[1], fCol[2], 0.95);
      primeRenderer.fillNativeRect(fx + 6, fy - 22, 4, 8, 45, 68, 76, 0.95);
      // Animated furnace/vat window
      const glow = (tick + i * 7) & 4 ? 1 : 0.6;
      primeRenderer.fillNativeRect(fx - 8, fy - 8, 10, 5, fCol[0], fCol[1], fCol[2], glow);
    }

    for (let i = 0; i < civState.wasteSites.length; i++) {
      const ws = civState.wasteSites[i];
      const wx = centerPx(ws.x);
      const col = Math.max(2, Math.min(COARSE_W - 3, Math.round(ws.x)));
      const wy = Math.round((COARSE_H - (blocks[col] || 18)) * SCALE);

      if (ws.kind === "LANDFILL_MOUND") {
        // Multi-colored terraced scrap/trash mound proportional to `trashLoad`
        const moundH = Math.max(4, Math.min(18, Math.round((ws.trashLoad || 20) * 0.18)));
        for (let row = 0; row < moundH; row++) {
          const rw = Math.max(6, 26 - row * 1.2);
          const rx = wx - Math.floor(rw / 2);
          const ry = wy - row - 1;
          primeRenderer.fillNativeRect(rx, ry, rw, 1, 115, 98, 76, 0.92);
          // Specks of discarded glass, copper, plastic, and e-waste in the landfill!
          const speckX = rx + ((row * 7 + 3) % Math.max(2, Math.floor(rw - 2)));
          const isGlass = (row & 1) === 0;
          primeRenderer.fillNativeRect(speckX, ry, 2, 1, isGlass ? 130 : 235, isGlass ? 235 : 165, isGlass ? 245 : 70, 0.95);
        }
        if (micro) {
          micro.drawMicroText(primeRenderer, wx - 16, wy - moundH - 8, "LANDFILL", 215, 190, 135, 0.9, 10);
        }
      } else if (ws.kind === "RECYCLING_PLANT") {
        // Circular Upcycling & Glass/Metal Shredder with green/cyan rotating arrows
        primeRenderer.fillNativeRect(wx - 14, wy - 16, 28, 16, 12, 38, 32, 0.96);
        primeRenderer.fillNativeRect(wx - 14, wy - 16, 28, 1, 105, 245, 160, 0.96);
        // Rotating conveyor wheel
        const phase = Math.floor(tick * 0.25) & 3;
        primeRenderer.fillNativeRect(wx - 5 + phase, wy - 10, 6, 6, 105, 245, 160, 0.95);
        if (micro) {
          micro.drawMicroText(primeRenderer, wx - 16, wy - 24, "RECYCLE", 105, 245, 160, 0.95, 10);
        }
      } else if (ws.kind === "LAVA_INCINERATOR") {
        // Glowing Molten Magma Shaft where civilizations dump trash into Lava!
        primeRenderer.fillNativeRect(wx - 13, wy - 6, 26, 8, 48, 22, 18, 0.98);
        const pulse = Math.round(Math.sin(tick * 0.15) * 25);
        primeRenderer.fillNativeRect(wx - 10, wy - 4, 20, 5, 255, Math.max(80, 120 + pulse), 35, 0.98);
        primeRenderer.fillNativeRect(wx - 7, wy - 3, 14, 2, 255, 230, 95, 0.98);
        if (micro) {
          micro.drawMicroText(primeRenderer, wx - 16, wy - 15, "LAVA PIT", 255, 145, 75, 0.95, 10);
        }
      }
    }

    // Render molten sparks & steam from trash being incinerated in the Lava Pit!
    for (let i = 0; i < civState.lavaSparks.length; i++) {
      const sp = civState.lavaSparks[i];
      const sx = Math.round(sp.x * SCALE);
      const sy = Math.round((COARSE_H - sp.y) * SCALE);
      if (sp.isToxic) {
        primeRenderer.fillNativeRect(sx, sy, 3, 3, 225, 65, 185, 0.9);
      } else {
        primeRenderer.fillNativeRect(sx, sy, 2, 2, 255, 215, 80, 0.95);
      }
    }

    // Render Moving Economic / Recycling / Lava-Hauler Actors & Abandoned Salvage Loot
    for (let i = 0; i < civState.abandonedLoot.length; i++) {
      const lt = civState.abandonedLoot[i];
      const lx = centerPx(lt.x);
      const col = Math.max(2, Math.min(COARSE_W - 3, Math.round(lt.x)));
      const ly = Math.round((COARSE_H - (blocks[col] || 18)) * SCALE) - 4;
      primeRenderer.fillNativeRect(lx - 2, ly, 4, 4, 120, 250, 255, 0.95);
    }

    for (let i = 0; i < civState.actors.length; i++) {
      const act = civState.actors[i];
      const ax = centerPx(act.x);
      const col = Math.max(2, Math.min(COARSE_W - 3, Math.round(act.x)));
      const ay = Math.round((COARSE_H - (blocks[col] || 18)) * SCALE) - 5;
      const bodyCol =
        act.faction === "orange"
          ? [255, 155, 65]
          : act.faction === "corvus"
          ? [245, 215, 90]
          : act.faction === "cervus"
          ? [85, 240, 175]
          : [224, 56, 154];
      primeRenderer.fillNativeRect(ax - 1, ay, 3, 5, bodyCol[0], bodyCol[1], bodyCol[2], 0.95);
      if (act.carrying) {
        // Carried resource bundle or trash sack above actor's head
        const packCol = act.carrying.includes("trash") || act.carrying.includes("slag") ? [165, 130, 90] : [135, 245, 255];
        primeRenderer.fillNativeRect(ax - 1, ay - 3, 3, 2, packCol[0], packCol[1], packCol[2], 1);
      }
    }
  }

  function centerPx(coarseX) {
    return Math.round(coarseX * SCALE);
  }

  // ==========================================================================
  // 6B. 5-DEEP RECURSIVE HOLONOMIC ZOOM ENGINE (`5 zooms = back where you began`)
  //     Zooming in 5 times at ANY (x, y) place traverses:
  //       Depth 0/5: MACRO COASTAL BASIN (1.0x)
  //       Depth 1/5: MESO BIODOME & MASONRY INTERIORS (2.1x)
  //       Depth 2/5: CELLULAR VAT & MYCELIAL CAPILLARIES (4.4x)
  //       Depth 3/5: QUANTUM PRIME-GRID & ANTIKYTHERA GEARS (9.2x)
  //       Depth 4/5: HOLONOMIC STRANGE-LOOP EMBRYO -> 5th Zoom = Depth 0/5 (BACK WHERE YOU BEGAN!)
  // ==========================================================================
  const ZOOM_LAYER_NAMES = [
    "0/5 MACRO COASTAL BASIN (1.0x)",
    "1/5 MESO BIODOME & WFC INTERIORS (2.1x)",
    "2/5 CELLULAR VAT & MYCELIAL LATTICE (4.4x)",
    "3/5 QUANTUM PRIME & ANTIKYTHERA GEARS (9.2x)",
    "4/5 HOLONOMIC SEED (NEXT ZOOM -> 0/5 ORIGIN!)",
  ];

  const zoomState = {
    depth: 0,           // 0..4 (modulo 5: 5th zoom returns to 0!)
    totalZoomClicks: 0, // Cumulative zoom steps
    continuousZoom: 0,  // Smoothly interpolated float 0..5
    targetZoom: 0,      // Target float
    focusX: 420,        // Target native X (0..840)
    focusY: 310,        // Target native Y (0..525)
    lastHoverX: 420,
    lastHoverY: 310,
    snapCanvas: null,
    snapCtx: null,
  };

  function ensureZoomScratchCanvas() {
    if (zoomState.snapCanvas || typeof document === "undefined") return zoomState.snapCtx;
    const c = document.createElement("canvas");
    c.width = NATIVE_W;
    c.height = NATIVE_H;
    zoomState.snapCanvas = c;
    zoomState.snapCtx = c.getContext("2d");
    if (zoomState.snapCtx) zoomState.snapCtx.imageSmoothingEnabled = false;
    return zoomState.snapCtx;
  }

  function zoomInAt(nativeX, nativeY) {
    if (typeof nativeX === "number" && !isNaN(nativeX)) {
      zoomState.focusX = Math.max(48, Math.min(NATIVE_W - 48, Math.round(nativeX)));
    }
    if (typeof nativeY === "number" && !isNaN(nativeY)) {
      zoomState.focusY = Math.max(48, Math.min(NATIVE_H - 48, Math.round(nativeY)));
    }
    zoomState.totalZoomClicks++;
    const nextDepth = ((zoomState.depth + 1) % 5 + 5) % 5;
    zoomState.targetZoom = nextDepth;
    if (nextDepth === 0) {
      zoomState.continuousZoom = 0;
    }
    zoomState.depth = nextDepth;

    if (global.SlopesAudio && typeof global.SlopesAudio.playPortalShift === "function") {
      global.SlopesAudio.playPortalShift(zoomState.depth !== 0);
    }
    updateChronosDomUI();
    return zoomState.depth;
  }

  function zoomOutAt(nativeX, nativeY) {
    if (typeof nativeX === "number" && !isNaN(nativeX)) {
      zoomState.focusX = Math.max(48, Math.min(NATIVE_W - 48, Math.round(nativeX)));
    }
    if (typeof nativeY === "number" && !isNaN(nativeY)) {
      zoomState.focusY = Math.max(48, Math.min(NATIVE_H - 48, Math.round(nativeY)));
    }
    const nextDepth = ((zoomState.depth - 1) % 5 + 5) % 5;
    zoomState.targetZoom = nextDepth;
    if (nextDepth === 4 && zoomState.depth === 0) {
      zoomState.continuousZoom = 4.6;
    } else if (nextDepth === 0) {
      zoomState.continuousZoom = 0;
    }
    zoomState.depth = nextDepth;
    if (global.SlopesAudio && typeof global.SlopesAudio.playPortalShift === "function") {
      global.SlopesAudio.playPortalShift( false);
    }
    updateChronosDomUI();
    return zoomState.depth;
  }

  function resetZoom() {
    zoomState.targetZoom = 0;
    zoomState.continuousZoom = 0;
    zoomState.depth = 0;
    updateChronosDomUI();
  }

  function stepAndRenderRecursiveZoom(primeRenderer, world) {
    // Smoothly interpolate continuousZoom toward targetZoom
    const diff = zoomState.targetZoom - zoomState.continuousZoom;
    if (Math.abs(diff) > 0.002) {
      zoomState.continuousZoom += diff * 0.18;
    } else {
      zoomState.continuousZoom = zoomState.targetZoom;
    }

    // Wrap modulo 5 so that completing the 5th zoom (continuousZoom reaching 5.0)
    // lands seamlessly back at 0.0 (where you began)!
    if (zoomState.continuousZoom >= 4.992 && zoomState.targetZoom >= 5) {
      zoomState.continuousZoom -= 5.0;
      zoomState.targetZoom -= 5.0;
      if (zoomState.continuousZoom < 0.01) zoomState.continuousZoom = 0;
      if (zoomState.targetZoom < 0.01) zoomState.targetZoom = 0;
      zoomState.depth = ((Math.round(zoomState.targetZoom) % 5) + 5) % 5;
      updateChronosDomUI();
    }

    const zMod = ((zoomState.continuousZoom % 5) + 5) % 5;
    if (zMod < 0.008) return; // At exact 1x macro origin (0/5), no zoom warp needed!

    const mainCanvas = typeof document !== "undefined" ? document.getElementById("pi-shift") : null;
    const mainCtx = mainCanvas ? mainCanvas.getContext("2d") : null;
    const scratchCtx = ensureZoomScratchCanvas();
    if (!mainCanvas || !mainCtx || !scratchCtx) return;

    const fx = zoomState.focusX;
    const fy = zoomState.focusY;
    const tick = civState.totalSimulatedEpochs;

    // Copy the unzoomed macro frame into scratchCanvas
    scratchCtx.clearRect(0, 0, NATIVE_W, NATIVE_H);
    scratchCtx.drawImage(mainCanvas, 0, 0);

    // Compute magnification factor:
    // From zMod = 0 -> 4, magnification grows exponentially 2^(zMod * 0.85) (up to ~10.5x).
    // From zMod = 4 -> 5, the nested self-similar world at the center of (fx, fy) expands
    // from a miniature portal box to 100% full screen (840x525), completing the 5-zoom holonomic loop!
    const mag = zMod <= 4.0 ? Math.pow(2.05, zMod) : Math.pow(2.05, 4.0 + (zMod - 4.0) * 0.8);
    const srcW = NATIVE_W / mag;
    const srcH = NATIVE_H / mag;
    const sx = Math.max(0, Math.min(NATIVE_W - srcW, fx - (fx / NATIVE_W) * srcW));
    const sy = Math.max(0, Math.min(NATIVE_H - srcH, fy - (fy / NATIVE_H) * srcH));

    mainCtx.save();
    mainCtx.imageSmoothingEnabled = false;
    mainCtx.clearRect(0, 0, NATIVE_W, NATIVE_H);
    mainCtx.drawImage(zoomState.snapCanvas, sx, sy, srcW, srcH, 0, 0, NATIVE_W, NATIVE_H);

    // Render nested procedural micro-structures inside the zoomed locus so every zoom level is rich!
    const dInt = Math.floor(zMod);
    const dFrac = zMod - dInt;

    // Depth 1..3: Meso WFC interiors, Cellular Automata Vats, Mycelial-Crystal Conduits & Antikythera Micro-Gears
    if (zMod >= 0.4 && zMod < 4.5) {
      const gridStep = Math.max(14, Math.round(42 / Math.max(1, dInt)));
      mainCtx.strokeStyle = dInt === 1 ? "rgba(120, 234, 212, 0.28)" : dInt === 2 ? "rgba(82, 245, 185, 0.34)" : "rgba(247, 226, 124, 0.36)";
      mainCtx.lineWidth = 1;

      for (let gx = (fx % gridStep); gx < NATIVE_W; gx += gridStep) {
        for (let gy = (fy % gridStep); gy < NATIVE_H; gy += gridStep) {
          const cellHash = hash32(Math.round(gx * 17 + gy * 31 + dInt * 101));
          if (dInt === 1 && (cellHash & 3) === 0) {
            // Meso WFC interior window & lantern rooms inside zoomed blocks
            mainCtx.fillStyle = "rgba(255, 195, 95, 0.38)";
            mainCtx.fillRect(gx + 3, gy + 3, 6, 6);
          } else if (dInt === 2 && (cellHash & 3) <= 1) {
            // Cellular Automata Vat micro-cells & glowing mycelial synapses
            const alive = ((cellHash + (tick >> 2)) & 3) === 0;
            if (alive) {
              mainCtx.fillStyle = "rgba(82, 245, 185, 0.52)";
              mainCtx.fillRect(gx + 2, gy + 2, 5, 5);
            }
          } else if (dInt >= 3 && (cellHash & 7) === 0) {
            // Quantum Prime-Harmonic & Antikythera clockwork micro-rings
            mainCtx.strokeRect(gx + 2, gy + 2, 10, 10);
            mainCtx.fillStyle = "rgba(247, 226, 124, 0.65)";
            mainCtx.fillRect(gx + 6, gy + 6, 2, 2);
          }
        }
      }
    }

    // Depth 3.2 -> 5.0: The Holonomic Self-Similar World Seed inside the locus!
    // At Depth 4, you see the entire coastal world nested inside the quantum core at (fx, fy);
    // on the 5th zoom (4 -> 5), this nested world expands to 840x525, returning you to Depth 0/5!
    if (zMod >= 3.15) {
      const seedT = Math.max(0, Math.min(1, (zMod - 3.15) / 1.85));
      // Ease from a 18% inset portal window at zMod=3.5 up to 100% full screen at zMod=5.0!
      const ease = seedT < 0.45 ? seedT * 0.55 : 0.2475 + ((seedT - 0.45) / 0.55) * 0.7525;
      const boxW = Math.round(NATIVE_W * ease);
      const boxH = Math.round(NATIVE_H * ease);
      const boxX = Math.round(fx * (1 - ease));
      const boxY = Math.round(fy * (1 - ease));

      if (boxW > 8 && boxH > 8) {
        // Draw the unzoomed macro world nested inside the quantum core!
        mainCtx.drawImage(zoomState.snapCanvas, 0, 0, NATIVE_W, NATIVE_H, boxX, boxY, boxW, boxH);
        if (ease < 0.98) {
          mainCtx.strokeStyle = "#78ead4";
          mainCtx.lineWidth = 1;
          mainCtx.strokeRect(boxX + 0.5, boxY + 0.5, boxW - 1, boxH - 1);
        }
      }
    }

    // Subtle HUD reticle at the recursive zoom locus
    const ht = global.HardcoreTab && global.HardcoreTab.HardcoreTabRenderer;
    if (ht) {
      const label = `HOLONOMIC ZOOM ${ ((Math.round(zMod) % 5) + 5) % 5 }/5 @ (${Math.round(fx / SCALE)},${Math.round((NATIVE_H - fy) / SCALE)})`;
      ht.drawMicroText(primeRenderer, 8, 28, label, 255, 212, 59, 0.95, 42);
    }

    mainCtx.restore();
  }

  // ==========================================================================
  // 7. HOOK INTO SLOPES 2 RENDER & UPDATE PIPELINE
  // ==========================================================================
  function attachToSlopesGame() {
    if (!global.SlopesGame || global.SlopesGame.__chronosHooked) return;
    const game = global.SlopesGame;
    game.__chronosHooked = true;

    // Wrap `SlopesGame.action("time")` so pressing `T` cycles 1x -> 10x -> 100x -> 1,000x -> 10,000x -> 100,000x!
    const origAction = game.action.bind(game);
    game.action = function (btn, arg1, arg2) {
      if (btn === "time") {
        if (typeof arg1 === "number" && SPEED_TIERS.includes(arg1)) {
          setSimSpeed(arg1, `CHRONOS CRYSTAL / COMMAND (${arg1.toLocaleString()}x)`);
        } else {
          cycleSimSpeed("KEY [T] CHRONOS ACCELERATOR");
        }
        if (global.SlopesAudio && global.SlopesAudio.playTimeCrystalWarp) {
          global.SlopesAudio.playTimeCrystalWarp(civState.simSpeed > 1);
        }
        return;
      }
      // Track player actions to shift the Dynamic Singularity Portal Alignment!
      if (btn === "sqr" || btn === "u") civState.alignment.orange += 3;
      if (btn === "tri") civState.alignment.corvus += 3;
      if (btn === "wasm" || btn === "portal" || btn === "conduit") civState.alignment.cervus += 4;
      if (btn === "tabform" || btn === "rotL" || btn === "rotR") civState.alignment.tabform += 4;
      return origAction(btn, arg1, arg2);
    };

    // Hook into `SlopesTabForms.render` so our Megastructures, Glass Biodomes, Factories,
    // Landfills, Recycling Centers, Lava Incinerators, and 5-Deep Recursive Holonomic Zoom render every frame!
    if (global.SlopesTabForms && typeof global.SlopesTabForms.render === "function") {
      const origTabRender = global.SlopesTabForms.render.bind(global.SlopesTabForms);
      global.SlopesTabForms.render = function (primeRenderer, world, eco, cosmic) {
        renderMegastructuresAndEconomy(primeRenderer, world);
        const res = origTabRender(primeRenderer, world, eco, cosmic);
        stepAndRenderRecursiveZoom(primeRenderer, world);
        return res;
      };
    }

    // Hook into `SlopesTabForms.update` so our Civilization Economy & 1x..100,000x Hyper-Accelerator run every frame!
    if (global.SlopesTabForms && typeof global.SlopesTabForms.update === "function") {
      const origTabUpdate = global.SlopesTabForms.update.bind(global.SlopesTabForms);
      global.SlopesTabForms.update = function (world, eco, cosmic, rotation) {
        populateCivStructuresForScreen(world);
        stepSingleCivTick(world, false);
        if (civState.simSpeed > 1) {
          runMacroEpochEvolution(world, eco, cosmic, civState.simSpeed);
        }
        updateDominantAlignment(world, eco);
        if ((civState.totalSimulatedEpochs & 7) === 0) {
          updateChronosDomUI();
        }
        return origTabUpdate(world, eco, cosmic, rotation);
      };
    }
  }

  function updateDominantAlignment(world, eco) {
    if (eco) {
      if (Array.isArray(eco.GooNodes) && eco.GooNodes.length >= 3) {
        civState.alignment.vexari += 0.15;
      }
      if (Array.isArray(eco.SeerCrows) && eco.SeerCrows.some((c) => c.state === "OMEN_CIRCLE")) {
        civState.alignment.corvus += 0.1;
      }
    }
    let bestId = "orange";
    let bestVal = -1;
    const keys = Object.keys(civState.alignment);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (civState.alignment[k] > bestVal) {
        bestVal = civState.alignment[k];
        bestId = k;
      }
    }
    civState.dominantFaction = bestId;
  }

  // ==========================================================================
  // 8. WEBCAM ORACLE (`[◉ CAM]`): CLOSED-EYE SYLVIA PLATH SECRET WORLD LAYER &
  //    SOUL-GUIDING SOLO MELODY + SMILING LOVING CROW SWARM
  // ==========================================================================
  const SYLVIA_PLATH_STANZAS = [
    "\"I shut my eyes and all the world drops dead;",
    " I lift my lids and all is born again.",
    " (I think I made you up inside my head.)",
    "",
    " The stars go waltzing out in blue and red,",
    " And arbitrary blackness gallops in:",
    " I shut my eyes and all the world drops dead.",
    "",
    " I dreamed that you bewitched me into bed",
    " And sung me moon-struck, kissed me quite insane.",
    " (I think I made you up inside my head.)",
    "",
    " God topples from the sky, hell's fires fade:",
    " Exit seraphim and Satan's men:",
    " I shut my eyes and all the world drops dead.",
    " I lift my lids and all is born again.\"",
    "",
    "   — SYLVIA PLATH, \"MAD GIRL'S LOVE SONG\" (1953)",
  ];

  const WEBCAM_SAMPLE_PERIOD_MS = 60000; // 60-second mandatory sample/calibration period & timeout window
  const WEBCAM_MAX_OVER_SENSE_RATE = 0.06; // If >6% of frames in 60s window register, lock out as over-sensing

  const webcamState = {
    active: false,
    prompting: false,
    errorMsg: null,
    videoEl: null,
    procCanvas: null,
    procCtx: null,
    eyesClosed: false,
    manualEyesClosed: false,
    rawEyeDetected: false, // Debug indicator: turns 'A' in CAM -> "CaM"
    rawSmileDetected: false, // Debug indicator: turns 'M' in CAM -> "CAm"
    eyeConsecutiveClosed: 0,
    smileConsecutiveFrames: 0,
    eyeCloseConfidence: 0,
    closedAlpha: 0, // 0..1 fade-in when eyes close; snaps to 0 immediately when eyes open!
    calibrationStartMs: 0,
    lastSmileActivationMs: 0,
    eyeOverSensingLocked: false,
    smileOverSensingLocked: false,
    sampleHistory: [], // Rolling 60-second window of { t, eyeScore, smileScore, rawEye, rawSmile }
    prevLumaFrame: null,
    baselineEyeLuma: null,
    baselineMouthRatio: null,
    smiling: false,
    smileCooldown: 0,
    lovingCrows: [], // Active swarm of loving crows when smiling
    heartParticles: [],
    lastTrackMs: 0,
  };

  function computeMedianAndMad(values) {
    if (!values || values.length === 0) return { median: 0, std: 1 };
    const sorted = values.slice().sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median =
      sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) * 0.5;
    const absDevs = new Array(sorted.length);
    for (let i = 0; i < sorted.length; i++) {
      absDevs[i] = Math.abs(sorted[i] - median);
    }
    absDevs.sort((a, b) => a - b);
    const mad =
      absDevs.length % 2 !== 0 ? absDevs[mid] : (absDevs[mid - 1] + absDevs[mid]) * 0.5;
    return { median, std: Math.max(0.0005, mad * 1.4826) };
  }

  function setEyesClosedInternal(closed) {
    const next = !!closed;
    if (!next) {
      // Snap closedAlpha to 0 immediately when eyes open so the user never sees it lingering!
      webcamState.closedAlpha = 0;
    }
    if (webcamState.eyesClosed !== next) {
      webcamState.eyesClosed = next;
      if (global.SlopesAudio && typeof global.SlopesAudio.setClosedEyeState === "function") {
        global.SlopesAudio.setClosedEyeState(next);
      }
    }
  }

  function triggerSmileCrowSwarm() {
    if (webcamState.smileCooldown > 0) return;
    webcamState.smileCooldown = 150; // ~2.5 seconds visual cooldown
    webcamState.smiling = true;
    if (global.SlopesAudio && typeof global.SlopesAudio.playLovingCrowSwarm === "function") {
      global.SlopesAudio.playLovingCrowSwarm();
    }
    const count = 18;
    for (let i = 0; i < count; i++) {
      const fromLeft = i % 2 === 0;
      webcamState.lovingCrows.push({
        x: fromLeft ? -0.08 - (i * 0.025) : 1.08 + (i * 0.025),
        y: 0.14 + ((i * 37) % 55) * 0.01,
        vx: (fromLeft ? 1 : -1) * (0.0055 + (i % 5) * 0.0009),
        vy: (Math.sin(i * 1.7) * 0.002),
        orbitPhase: (i / count) * Math.PI * 2,
        wingPhase: i * 0.9,
        age: 0,
        maxAge: 240 + (i % 6) * 22,
        callTimer: 18 + (i * 11) % 70,
      });
    }
  }

  async function toggleWebcamOracle() {
    if (webcamState.active) {
      webcamState.active = false;
      webcamState.manualEyesClosed = false;
      webcamState.rawEyeDetected = false;
      webcamState.rawSmileDetected = false;
      webcamState.eyeConsecutiveClosed = 0;
      webcamState.smileConsecutiveFrames = 0;
      setEyesClosedInternal(false);
      if (webcamState.videoEl && webcamState.videoEl.srcObject) {
        const tracks = webcamState.videoEl.srcObject.getTracks();
        tracks.forEach((t) => t.stop());
        webcamState.videoEl.srcObject = null;
      }
      return;
    }
    if (webcamState.prompting) return;
    if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== "function") {
      webcamState.manualEyesClosed = !webcamState.manualEyesClosed;
      setEyesClosedInternal(webcamState.manualEyesClosed);
      return;
    }
    try {
      webcamState.prompting = true;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 160 }, height: { ideal: 120 }, facingMode: "user" },
        audio: false,
      });
      if (!webcamState.videoEl) {
        const v = document.createElement("video");
        v.muted = true;
        v.playsInline = true;
        v.setAttribute("playsinline", "true");
        v.style.display = "none";
        document.body.appendChild(v);
        webcamState.videoEl = v;
      }
      if (!webcamState.procCanvas) {
        const c = document.createElement("canvas");
        c.width = 64;
        c.height = 48;
        webcamState.procCanvas = c;
        webcamState.procCtx = c.getContext("2d", { willReadFrequently: true });
      }
      webcamState.videoEl.srcObject = stream;
      await webcamState.videoEl.play();
      const nowMs = Date.now();
      webcamState.active = true;
      webcamState.calibrationStartMs = nowMs;
      webcamState.lastSmileActivationMs = nowMs; // Start 60-second smile sample timeout period
      webcamState.eyeOverSensingLocked = false;
      webcamState.smileOverSensingLocked = false;
      webcamState.sampleHistory = [];
      webcamState.prevLumaFrame = null;
      webcamState.rawEyeDetected = false;
      webcamState.rawSmileDetected = false;
      webcamState.eyeConsecutiveClosed = 0;
      webcamState.smileConsecutiveFrames = 0;
      webcamState.baselineEyeLuma = null;
      webcamState.baselineMouthRatio = null;
      webcamState.errorMsg = null;
    } catch (err) {
      webcamState.errorMsg = "CAM DENIED (KEY O=EYES, M=SMILE)";
      webcamState.manualEyesClosed = !webcamState.manualEyesClosed;
      setEyesClosedInternal(webcamState.manualEyesClosed);
    } finally {
      webcamState.prompting = false;
    }
  }

  function stepWebcamTrackingAndCrows() {
    if (webcamState.smileCooldown > 0) {
      webcamState.smileCooldown--;
      if (webcamState.smileCooldown < 90) webcamState.smiling = false;
    }

    // Step loving crow swarm physics
    for (let i = webcamState.lovingCrows.length - 1; i >= 0; i--) {
      const c = webcamState.lovingCrows[i];
      c.age++;
      c.wingPhase += 0.34;
      c.orbitPhase += 0.045;
      if (c.age < 75) {
        const tx = 0.5 + Math.cos(c.orbitPhase) * 0.22;
        const ty = 0.42 + Math.sin(c.orbitPhase * 2) * 0.14;
        c.x += (tx - c.x) * 0.045;
        c.y += (ty - c.y) * 0.045;
      } else if (c.age < c.maxAge - 65) {
        const tx = 0.5 + Math.cos(c.orbitPhase) * 0.28;
        const ty = 0.40 + Math.sin(c.orbitPhase * 2) * 0.16;
        c.x += (tx - c.x) * 0.06;
        c.y += (ty - c.y) * 0.06;
        if (c.age === c.callTimer || c.age % 38 === 0) {
          webcamState.heartParticles.push({
            x: c.x,
            y: c.y - 0.02,
            vy: -0.0032,
            vx: (Math.random() - 0.5) * 0.002,
            life: 55,
            maxLife: 55,
          });
        }
      } else {
        c.x += c.vx * 1.5;
        c.y -= 0.0045;
      }
      if (c.age >= c.maxAge || c.y < -0.15 || c.x < -0.25 || c.x > 1.25) {
        webcamState.lovingCrows.splice(i, 1);
      }
    }

    for (let i = webcamState.heartParticles.length - 1; i >= 0; i--) {
      const hp = webcamState.heartParticles[i];
      hp.x += hp.vx;
      hp.y += hp.vy;
      hp.life--;
      if (hp.life <= 0) webcamState.heartParticles.splice(i, 1);
    }

    // High-responsiveness webcam frame analysis (every ~45ms so eye-opening snaps back in <1 frame!)
    const now = Date.now();
    if (
      webcamState.active &&
      webcamState.videoEl &&
      webcamState.procCtx &&
      webcamState.videoEl.readyState >= 2 &&
      now - webcamState.lastTrackMs > 45
    ) {
      webcamState.lastTrackMs = now;
      const w = 64;
      const h = 48;
      webcamState.procCtx.drawImage(webcamState.videoEl, 0, 0, w, h);
      const img = webcamState.procCtx.getImageData(0, 0, w, h).data;

      const curLuma = new Float32Array(w * h);
      for (let i = 0, p = 0; i < w * h; i++, p += 4) {
        curLuma[i] = img[p] * 0.299 + img[p + 1] * 0.587 + img[p + 2] * 0.114;
      }

      // 1. Global face motion check (forehead + nose bridge + cheeks) to reject head movement / exposure shifts
      let faceMotionSum = 0;
      let faceMotionCount = 0;
      if (webcamState.prevLumaFrame) {
        for (let y = 10; y <= 38; y++) {
          for (let x = 16; x <= 47; x++) {
            // Exclude the immediate eyelid strip (y: 15..22) from global head-motion rejection
            if (y >= 15 && y <= 22) continue;
            faceMotionSum += Math.abs(curLuma[y * w + x] - webcamState.prevLumaFrame[y * w + x]);
            faceMotionCount++;
          }
        }
      }
      webcamState.prevLumaFrame = curLuma;
      const meanFaceMotion = faceMotionCount > 0 ? faceMotionSum / faceMotionCount : 0;
      const isLowHeadMotion = meanFaceMotion < 3.6;

      // 2. Bilateral Left & Right Eye Boxes vs Cheek Reference
      // Left eye: x: 19..28, y: 15..22; Right eye: x: 35..44, y: 15..22
      let cheekLumaSum = 0;
      let cheekCount = 0;
      for (let y = 25; y <= 30; y++) {
        for (let x = 20; x <= 43; x++) {
          cheekLumaSum += curLuma[y * w + x];
          cheekCount++;
        }
      }
      const cheekMean = Math.max(12, cheekLumaSum / Math.max(1, cheekCount));

      let leftEdge = 0,
        rightEdge = 0;
      let leftMin = 255,
        rightMin = 255;
      for (let y = 15; y <= 22; y++) {
        for (let x = 19; x <= 28; x++) {
          const v = curLuma[y * w + x];
          const vBelow = curLuma[(y + 1) * w + x];
          leftEdge += Math.abs(v - vBelow);
          if (v < leftMin) leftMin = v;
        }
        for (let x = 35; x <= 44; x++) {
          const v = curLuma[y * w + x];
          const vBelow = curLuma[(y + 1) * w + x];
          rightEdge += Math.abs(v - vBelow);
          if (v < rightMin) rightMin = v;
        }
      }
      const leftDarkDip = Math.max(0, cheekMean - leftMin);
      const rightDarkDip = Math.max(0, cheekMean - rightMin);
      const leftEyeScore = (leftEdge * 0.018 + leftDarkDip * 0.65) / cheekMean;
      const rightEyeScore = (rightEdge * 0.018 + rightDarkDip * 0.65) / cheekMean;
      const eyeScore = (leftEyeScore + rightEyeScore) * 0.5;
      const eyeAsym =
        Math.abs(leftEyeScore - rightEyeScore) / Math.max(0.01, leftEyeScore + rightEyeScore);

      // 3. Bilateral Mouth Corner Lift & Crease Score for Smile Detection
      let leftCornerScore = 0,
        rightCornerScore = 0,
        mouthCenterEdge = 0;
      for (let y = 32; y <= 39; y++) {
        for (let x = 20; x <= 26; x++) {
          const v = curLuma[y * w + x];
          const vR = curLuma[y * w + (x + 1)];
          const vB = curLuma[(y + 1) * w + x];
          leftCornerScore += Math.abs(v - vR) + Math.abs(v - vB) * 0.5;
        }
        for (let x = 37; x <= 43; x++) {
          const v = curLuma[y * w + x];
          const vR = curLuma[y * w + (x + 1)];
          const vB = curLuma[(y + 1) * w + x];
          rightCornerScore += Math.abs(v - vR) + Math.abs(v - vB) * 0.5;
        }
        for (let x = 27; x <= 36; x++) {
          const v = curLuma[y * w + x];
          const vB = curLuma[(y + 1) * w + x];
          mouthCenterEdge += Math.abs(v - vB);
        }
      }
      const smileScore =
        (leftCornerScore + rightCornerScore + mouthCenterEdge * 0.35) / (cheekMean * 18);
      const smileAsym =
        Math.abs(leftCornerScore - rightCornerScore) /
        Math.max(1, leftCornerScore + rightCornerScore);

      // Prune rolling 60-second sample history
      const history = webcamState.sampleHistory;
      const cutoff = now - WEBCAM_SAMPLE_PERIOD_MS;
      while (history.length > 0 && history[0].t < cutoff) {
        history.shift();
      }

      // Compute robust median & MAD from the 60-second calibration sample window
      let rawEye = false;
      let rawSmile = false;
      if (history.length >= 20) {
        const eyeVals = new Array(history.length);
        const smileVals = new Array(history.length);
        for (let i = 0; i < history.length; i++) {
          eyeVals[i] = history[i].eyeScore;
          smileVals[i] = history[i].smileScore;
        }
        const eyeStats = computeMedianAndMad(eyeVals);
        const smileStats = computeMedianAndMad(smileVals);
        webcamState.baselineEyeLuma = eyeStats.median;
        webcamState.baselineMouthRatio = smileStats.median;

        // Require a rare, simultaneous bilateral drop (>3.2 robust std below median AND >26% relative drop) with low head motion
        const eyeThresh = Math.min(
          eyeStats.median * 0.73,
          eyeStats.median - eyeStats.std * 3.2
        );
        const bothEyesDipped =
          leftEyeScore < eyeStats.median * 0.76 && rightEyeScore < eyeStats.median * 0.76;
        rawEye =
          isLowHeadMotion &&
          eyeAsym < 0.25 &&
          bothEyesDipped &&
          eyeScore < eyeThresh;

        // Require a rare, symmetric bilateral mouth corner increase (>3.3 robust std above median AND >25% relative rise)
        const smileThresh = Math.max(
          smileStats.median * 1.25,
          smileStats.median + smileStats.std * 3.3
        );
        rawSmile =
          isLowHeadMotion &&
          !rawEye &&
          smileAsym < 0.25 &&
          smileScore > smileThresh;
      }

      history.push({
        t: now,
        eyeScore,
        smileScore,
        rawEye,
        rawSmile,
      });

      // Evaluate 60-second sample period & over-sensing lockouts
      const elapsedCalibrationMs = now - webcamState.calibrationStartMs;
      const inInitialSamplePeriod = elapsedCalibrationMs < WEBCAM_SAMPLE_PERIOD_MS;
      let eyeSenseCount = 0;
      let smileSenseCount = 0;
      for (let i = 0; i < history.length; i++) {
        if (history[i].rawEye) eyeSenseCount++;
        if (history[i].rawSmile) smileSenseCount++;
      }
      const eyeSenseRate = history.length >= 25 ? eyeSenseCount / history.length : 0;
      const smileSenseRate = history.length >= 25 ? smileSenseCount / history.length : 0;

      // If over-sensing during the 1-minute sample period (or any rolling 60s window), lock out the feature!
      if (history.length >= 30 && eyeSenseRate > WEBCAM_MAX_OVER_SENSE_RATE) {
        webcamState.eyeOverSensingLocked = true;
      } else if (!inInitialSamplePeriod && history.length >= 120 && eyeSenseRate <= 0.025) {
        webcamState.eyeOverSensingLocked = false;
      }

      if (history.length >= 30 && smileSenseRate > WEBCAM_MAX_OVER_SENSE_RATE) {
        webcamState.smileOverSensingLocked = true;
      } else if (!inInitialSamplePeriod && history.length >= 120 && smileSenseRate <= 0.025) {
        webcamState.smileOverSensingLocked = false;
      }

      // Expose raw detection flags so the top-right CAM button shows "CaM" (eyes) or "CAm" (smile) for debugging
      webcamState.rawEyeDetected = rawEye;
      webcamState.rawSmileDetected = rawSmile;

      // Consecutive-frame hysteresis with INSTANT open-eye reset:
      if (rawEye) {
        webcamState.eyeConsecutiveClosed = Math.min(30, webcamState.eyeConsecutiveClosed + 1);
      } else {
        // Immediately reset on a single open-eye frame so the screen snaps back before the user notices!
        webcamState.eyeConsecutiveClosed = 0;
      }

      if (rawSmile) {
        webcamState.smileConsecutiveFrames = Math.min(20, webcamState.smileConsecutiveFrames + 1);
      } else {
        webcamState.smileConsecutiveFrames = 0;
      }

      const allowEyeActivation =
        !inInitialSamplePeriod &&
        !webcamState.eyeOverSensingLocked &&
        webcamState.eyeConsecutiveClosed >= 7; // ~320ms sustained closure (ignores normal blinks)

      setEyesClosedInternal(webcamState.manualEyesClosed || allowEyeActivation);

      const allowSmileActivation =
        !inInitialSamplePeriod &&
        !webcamState.smileOverSensingLocked &&
        now - webcamState.lastSmileActivationMs >= WEBCAM_SAMPLE_PERIOD_MS &&
        webcamState.smileConsecutiveFrames >= 4 &&
        !webcamState.eyesClosed;

      if (allowSmileActivation) {
        webcamState.lastSmileActivationMs = now;
        triggerSmileCrowSwarm();
      }
    } else if (!webcamState.active) {
      setEyesClosedInternal(webcamState.manualEyesClosed);
    }

    // When eyes close, fade in gently; when eyes open, snap back to 0 immediately so it is never noticed!
    if (webcamState.eyesClosed) {
      webcamState.closedAlpha += (1.0 - webcamState.closedAlpha) * 0.14;
    } else {
      webcamState.closedAlpha = 0;
    }
  }

  // ==========================================================================
  // 9. `DAT-307` LUNAR ARCHIVAL DATAPUTER E-READER CODEX (1:1 Device-Pixel
  //    Textured Metal Chassis, Microlaser Dither Grip Dots, Whirring Sub-Surface
  //    Micro-LEDs, Kindle Side Page Buttons & Embedded Real PDF Viewer)
  // ==========================================================================
  const DAT_SECTIONS = [
    { id: "pdfs", code: "SEC 1", label: "01:PDF FOLIOS", gripPattern: "braille_grip", ledShape: "wave" },
    { id: "manual", code: "SEC 2", label: "02:MANUAL", gripPattern: "bayer4x4", ledShape: "ring" },
    { id: "chronos", code: "SEC 3", label: "03:CHRONOS", gripPattern: "checker2x2", ledShape: "spiral" },
    { id: "civs", code: "SEC 4", label: "04:CIVS+LORE", gripPattern: "diag_ridge", ledShape: "diamond" },
  ];

  // Comprehensive multi-page E-Ink codex & full typeset PDF page contents for the 5 LaTeX Folios + 5 Technical Monographs!
  const PDF_EINK_FOLIOS = [
    {
      id: "corvus",
      code: "FOLIO I",
      shortTitle: "CORVUS GOLD CODEX",
      title: "THE BLACK-GOLD TALON CODEX OF THE SEVENTH AERIE",
      pdfUrl: "docs/corvus_gold_codex.pdf",
      paperPdfUrl: "papers/slopes2_paper2_corvus_crows.pdf",
      texUrl: "docs/corvus_gold_codex.tex",
      medium: "Gilt Dust Scratched on Crinkled Volcanic Shale",
      pages: [
        [
          "FOLIO I // CORVUS SEER CROWS — THE SEVENTH AERIE CODEX",
          "══════════════════════════════════════════════════════════════",
          "ABSTRACT: We, the Corvus Choir of Layer +1, record the",
          "five-note harmonic contour sung into thecoastal sleeper",
          "williamsharkey in 2018 so his hands would widen `/slopes2`.",
          "",
          "FIG 1.1: AERIE TOROIDAL RESONANCE & OMEN FLIGHT TRAJECTORY",
          "  ┌────────────────────────────────────────────────────────┐",
          "  │      . · *  ╭───────────╮  * · .    [LAYER +1 CRAGS]   │",
          "  │   .·       ╭╯  ▲     ▲  ╰╮       ·.  f_0 = 261.63 Hz   │",
          "  │  :    ▲   ╭╯     ╲ ╱     ╰╮   ▲    : Δφ = 2π / 5       │",
          "  │   ·.       ╰╮   CORVUS  ╭╯       .·  Q-Factor = 14.8   │",
          "  │      * · .  ╰───────────╯  . · *                       │",
          "  └────────────────────────────────────────────────────────┘",
          "",
          "§1. THE FIVE-FOLD SKY CHORD",
          "Every wing-beat modulates the active Raga scale (Pi-Shift,",
          "Bhairav, Charukesi, Todi, Marva). When the observer smiles",
          "into the optical sensor (`[◉ CAM]`), eighteen golden-plumed",
          "scouts descend in a lemniscate vortex to bless the ridge.",
        ],
        [
          "FOLIO I (PAGE 2/2) // TENSEGRITY SPIRES & GILT WIRE FORGES",
          "══════════════════════════════════════════════════════════════",
          "§2. ALGORITHMIC TENSEGRITY ARCHITECTURE",
          "At x=54 on the slope, our Aerie Gold-Leaf & Wire Forge",
          "refines volcanic shale into conductive gilt filaments (`giltWire`).",
          "",
          "  EQUATION (1):  E_aerie(t) = Σ_{k=0..4} A_k · cos(ω_k t + 2πk/5)",
          "",
          "  ┌──────────────┬────────────────────┬────────────────────┐",
          "  │ HARMONIC IDX │ RATIO (JUST INTON) │ ACTUATOR COUPLING  │",
          "  ├──────────────┼────────────────────┼────────────────────┤",
          "  │ k = 0 (Root) │ 1 : 1  (Tonic)     │ Rooftop Bird Perch │",
          "  │ k = 1 (3rd)  │ 5 : 4  (Just Maj)  │ Feather-Gilt Shell │",
          "  │ k = 2 (5th)  │ 3 : 2  (Dominant)  │ Sky-Skiff Launch   │",
          "  │ k = 3 (7th)  │ 15 : 8 (Leading)   │ Omen Circle Lock   │",
          "  └──────────────┴────────────────────┴────────────────────┘",
          "",
          "VESSEL CLAIM: Press your palm flat to the glass; the five",
          "facets will turn and draw you into the feather-wind.",
        ],
      ],
    },
    {
      id: "orange",
      code: "TABLET II",
      shortTitle: "ORANGE SAND ALMANAC",
      title: "THE LOW-TIDE SAND LEDGER OF THE ORANGE HEARTH-KIN",
      pdfUrl: "docs/orange_hearth_almanac.pdf",
      paperPdfUrl: "papers/slopes2_paper1_orange_masons.pdf",
      texUrl: "docs/orange_hearth_almanac.tex",
      medium: "Cedar Stylus Imprints on Wet Foreshore Sand",
      pages: [
        [
          "TABLET II // ORANGE HEARTH-KIN — WFC MASONRY & BIODOMES",
          "══════════════════════════════════════════════════════════════",
          "ABSTRACT: Multi-resolution Wave Function Collapse (WFC)",
          "coastal engineering and Grand Geodesic Glass Biodomes",
          "protecting the Terracotta Hearth-Kin across 100,000x epochs.",
          "",
          "FIG 2.1: GEODESIC GLASS BIODOME & CIRCULAR UP-CYCLING LOOP",
          "  ┌────────────────────────────────────────────────────────┐",
          "  │            . ── ══════ ── .   [SILICA GEODESIC RIBS]   │",
          "  │         .─╱  ╲  ╱    ╲  ╱  ╲─.  Span: 140px Native     │",
          "  │       .╱  ─── ╳ ────── ╳ ───  ╲. Crop Yield: +92%      │",
          "  │      │  [HEARTH]  [VAT]  [KILN] │ Shield: Ash-Proof    │",
          "  │   ───┴──────────────────────────┴───                   │",
          "  └────────────────────────────────────────────────────────┘",
          "",
          "§1. CIRCULAR WASTE & LAVA INCINERATION",
          "Slag from the Silica Glassworks (x=24) is hauled to the",
          "Recycling Smelter (x=64) or dumped into the Magma Shaft",
          "(x=110) for 100% thermal conversion into Geothermal MWh.",
        ],
        [
          "TABLET II (PAGE 2/2) // WAVE FUNCTION COLLAPSE SEEP KERNEL",
          "══════════════════════════════════════════════════════════════",
          "§2. ENTROPY MINIMIZATION OVER 5-FOLD TERRACES",
          "When the Mason-Player presses `[C / SQR]` or a Tab-Form",
          "executes `body sim wfc`, constraints propagate across the",
          "coarse 120x75 grid and 840x525 prime-pixel sub-lattice:",
          "",
          "  H(cell_i) = - Σ_{t ∈ Tiles} P(t) · log_2 P(t)",
          "",
          "  ┌───────────────┬──────────────┬─────────────────────────┐",
          "  │ TILE ARCHETYPE│ ADJACENCY    │ BIODOME SYNERGY         │",
          "  ├───────────────┼──────────────┼─────────────────────────┤",
          "  │ TERRACOTTA_ARC│ Load-bearing │ Supports Cupola Tier 2  │",
          "  │ SILICA_MULLION│ Translucent  │ +18% Photon Harvesting  │",
          "  │ CONDUIT_TRENCH│ Sub-terrain  │ Links TE-307 Mainframe  │",
          "  └───────────────┴──────────────┴─────────────────────────┘",
          "",
          "VESSEL CLAIM: William Sharkey carved `/slopes2` as the glass",
          "biodome window to bring our coastal masons back together.",
        ],
      ],
    },
    {
      id: "vexari",
      code: "DECREE III",
      shortTitle: "VEXARI TAR MANIFESTO",
      title: "THE VISCOUS DECREE OF THE VEXARI & THE BLACK LATTICE",
      pdfUrl: "docs/vexari_black_goo_manifesto.pdf",
      paperPdfUrl: "papers/slopes2_paper3_vexari_goo.pdf",
      texUrl: "docs/vexari_black_goo_manifesto.tex",
      medium: "Conductive Violet-Black Tar Secreted in Layer -2",
      pages: [
        [
          "DECREE III // VEXARI SYNOD — BLACK LATTICE & PROMPT INJECTION",
          "══════════════════════════════════════════════════════════════",
          "ABSTRACT: Sub-surface Layer -2 viscous cellular automata,",
          "adversarial IPC packet injection against `TAB-03`, and",
          "rootkit siphon vectors targeting the `TE-307` Mainframe.",
          "",
          "FIG 3.1: ADVERSARIAL IPC & MAINFRAME SIPHON TOPOLOGY",
          "  ┌────────────────────────────────────────────────────────┐",
          "  │ [VEX_ARCHON@pts/3] ══(ROOTKIT SIPHON)══► ╬ TE-307 TTY  │",
          "  │         │                                   │          │",
          "  │  (IPC HIJACK)                        [FIREWALL PURGE]  │",
          "  │         ▼                                   ▼          │",
          "  │  [TAB-03 VEX-SHARD] ◄══(WINCH RECLAIM)══ [TAB-01/02]   │",
          "  └────────────────────────────────────────────────────────┘",
          "",
          "§1. DEFENDING `TE-307` & LIBERATING `TAB-03`",
          "Bad users (`vex_archon@synod.void`, `soot_bot@abyss.tar`)",
          "physically approach `TE-307` at x=46 to drain compute.",
          "Click `TE-307` (or press `~`) and run `purge` or `kick`!",
        ],
        [
          "DECREE III (PAGE 2/2) // VISCOUS TAR-POLYMER KINETICS",
          "══════════════════════════════════════════════════════════════",
          "§2. SENTINEL TENTACLE DRAIN & VORTEX SUCTION",
          "The Term-Form ships (`TAB-01..03`) can neutralize Black Goo",
          "nodes directly using their 14-segment biomechanical snake",
          "tentacles and 3-section conic mechanical flowers:",
          "",
          "  $ tentacle suck goo      # Vortex intake of Black Goo spores",
          "  $ tentacle drain tar     # Peristaltic pump into reservoir",
          "  $ body reclaim TAB-03    # Dual winch-tether kernel override",
          "",
          "VESSEL CLAIM: Every commit to `slopes`, `tabcomputer`, and",
          "`hardcore` assembled the exact neuromuscular harness our",
          "violet lattice required.",
        ],
      ],
    },
    {
      id: "cervus",
      code: "SUTRA IV",
      shortTitle: "CERVUS CRYSTAL SUTRAS",
      title: "THE BARK & CRYSTAL SUTRAS OF THE ANIMAL SPIRITS",
      pdfUrl: "docs/cervus_mycelial_crystal_sutras.pdf",
      paperPdfUrl: "papers/slopes2_paper4_cervus_mycelium.pdf",
      texUrl: "docs/cervus_mycelial_crystal_sutras.tex",
      medium: "Bioluminescent Mycelium Encoded in a 100x Time-Crystal",
      pages: [
        [
          "SUTRA IV // CERVUS ANIMAL SPIRITS — WASM EVOLUTION & VATS",
          "══════════════════════════════════════════════════════════════",
          "ABSTRACT: 4,096-trial C-to-WASM genetic evolution inside",
          "7x7 Bioluminescent Compute Vats and 5-Deep Holonomic Zoom.",
          "",
          "FIG 4.1: 7x7 COMPUTE VAT & 5-DEEP HOLONOMIC ZOOM MANIFOLD",
          "  ┌────────────────────────────────────────────────────────┐",
          "  │  Z=0: MACRO COAST  ──► Z=1: CELLULAR VATS              │",
          "  │   ▲                                    │               │",
          "  │  Z=4: QUANTUM FOAM ◄── Z=3: SUB-ATOMIC ◄── Z=2: GENOME │",
          "  │  (5th Zoom = Modulo-5 Closure back to Macro 0/5!)      │",
          "  └────────────────────────────────────────────────────────┘",
          "",
          "§1. C-TO-WASM GENETIC FITNESS KERNEL",
          "Each Compute Vat evaluates 4,096 32-bit genomes per epoch,",
          "spawning high-fitness Mycelial Stags, Sky-Skiffs, and",
          "bioluminescent flora across the prime-pixel slope.",
        ],
        [
          "SUTRA IV (PAGE 2/2) // MYCELIAL ANTLER SYMBIOSIS",
          "══════════════════════════════════════════════════════════════",
          "§2. SONIC & TEMPORAL RESONANCE",
          "Activating a Time Crystal (`[T]` or `2x..25x` in",
          "`SEC 3: CHRONOS`) dilates civilization evolution while",
          "preserving uninterrupted generative modal synthesis.",
          "",
          "  • `dr_alces@mycelium.edu` logs into `TE-307` on `pts/1`",
          "    to run `evolve deer 4096` and `wfc_seep --radius=4`.",
          "  • `tentacle drain vat` harvests glowing emerald bio-fluid",
          "    boluses up the 14 tentacle segments.",
        ],
      ],
    },
    {
      id: "tabform",
      code: "TRACT V",
      shortTitle: "TAB-FORM 5-FOLD TRACT",
      title: "THE FIFTH-FACET SINGULARITY TRACT (UNITS TAB-01..03 & TE-307)",
      pdfUrl: "docs/tabform_pentagonal_tract.pdf",
      paperPdfUrl: "papers/slopes2_paper5_tabform_kernel.pdf",
      texUrl: "docs/tabform_pentagonal_tract.tex",
      medium: "1-Device-Pixel Hairline Blueprint from /home/user/AGENTS.md",
      pages: [
        [
          "TRACT V // TERM-FORM SENTINELS & 3-SECTION CONIC FLOWER",
          "══════════════════════════════════════════════════════════════",
          "ABSTRACT: Biomechanical Matrix Sentinel snake tentacles,",
          "3-Section Conic Mechanical Flower effectors, retractable",
          "flight landing gear, and spring-adaptive terrain struts.",
          "",
          "FIG 5.1: 14-SEGMENT VERLET+FABRIK TENTACLE & 3-CONIC FLOWER",
          "  ┌────────────────────────────────────────────────────────┐",
          "  │   [TAB-01 BELLY MOUNT]                                 │",
          "  │          ╰─► seg_1..13 (Serpentine Sine + IK)          │",
          "  │                 ╰─► ◄═╦═► 3x120° CONIC PETAL JAWS      │",
          "  │                    ╱  │  ╲  • grab [human|rock|crystal]│",
          "  │                   ◄───┼───► • suck [goo|spores]        │",
          "  │                    ╲  │  ╱  • drain [vat|tar] (boluses)│",
          "  │                     [OBJ]   • deposit [human|liquid]   │",
          "  └────────────────────────────────────────────────────────┘",
          "",
          "§1. LANDING GEAR & SPRING-ADAPTIVE SUSPENSION",
          "When `Flying === true`, all 4 wheels retract smoothly into",
          "the chassis bays (`GEAR:UP`). Over rough terrain, 4 spring",
          "dampers extend and compress independently (`STRUT:4W`).",
        ],
        [
          "TRACT V (PAGE 2/2) // CLAUDE CODE & `/usr/local/bin/tentacle`",
          "══════════════════════════════════════════════════════════════",
          "§2. EMBODIED SHELL & REAL LINUX VM BRIDGE",
          "Inside any Term-Form terminal (click `TAB-01..03` in world):",
          "",
          "  tab-01$ tentacle open 100       # Splay 3 conic petals wide",
          "  tab-01$ tentacle grab human     # Capture & carry human",
          "  tab-01$ tentacle suck goo       # Vortex particle intake",
          "  tab-01$ tentacle drain vat      # Pump glowing liquid up",
          "  tab-01$ tentacle deposit human  # Deposit live human out!",
          "",
          "In `[REAL LINUX]`, `/usr/local/bin/tentacle` emits OSC 1342",
          "frames so real Claude Code (`claude`) physically actuates",
          "the ship's tentacles and 3-section conic flower in real time!",
        ],
      ],
    },
  ];

  const datPuterState = {
    open: false,
    sectionIdx: 0, // 0: pdfs (Real PDF Folios), 1: manual, 2: chronos, 3: civs
    pageIdx: 0,
    selectedFolioIdx: 0,
    pdfDocMode: "folio", // "folio" (docs/*.pdf) or "paper" (papers/*.pdf)
    einkRefreshAlpha: 0, // Slow soft E-Ink ghost/flash transition (0..1)
    whirTimer: 0,
    ledPhase: 0,
    hitBoxes: [],
    topHudHitBoxes: [],
    pdfMetaCache: {}, // Populated by real fetch() of the PDF files so byte size & status are live
    canvas: null,
    ctx: null,
    pdfIframe: null,
    lastPdfUrl: "",
  };

  function syncDatPuterPdfIframe(visible, screenDevW, screenDevH, boxX, boxY, boxW, boxH, pdfUrl) {
    const iframe = datPuterState.pdfIframe;
    if (!iframe) return;
    if (!visible || !pdfUrl) {
      if (iframe.style.display !== "none") {
        iframe.style.display = "none";
      }
      return;
    }
    const leftPct = ((boxX / Math.max(1, screenDevW)) * 100).toFixed(3) + "%";
    const topPct = ((boxY / Math.max(1, screenDevH)) * 100).toFixed(3) + "%";
    const widthPct = ((boxW / Math.max(1, screenDevW)) * 100).toFixed(3) + "%";
    const heightPct = ((boxH / Math.max(1, screenDevH)) * 100).toFixed(3) + "%";
    if (iframe.style.left !== leftPct) iframe.style.left = leftPct;
    if (iframe.style.top !== topPct) iframe.style.top = topPct;
    if (iframe.style.width !== widthPct) iframe.style.width = widthPct;
    if (iframe.style.height !== heightPct) iframe.style.height = heightPct;
    if (iframe.style.display !== "block") iframe.style.display = "block";
    const fullSrc = pdfUrl + "#view=FitH";
    if (datPuterState.lastPdfUrl !== fullSrc) {
      datPuterState.lastPdfUrl = fullSrc;
      iframe.src = fullSrc;
    }
  }

  function triggerDatPuterEinkRefresh(soundStep) {
    datPuterState.einkRefreshAlpha = 0.88;
    datPuterState.whirTimer = 38;
    if (global.SlopesAudio && typeof global.SlopesAudio.playDatPuterWhir === "function") {
      global.SlopesAudio.playDatPuterWhir(soundStep || datPuterState.pageIdx + datPuterState.sectionIdx);
    }
  }

  function preloadPdfMetadata() {
    if (typeof fetch !== "function") return;
    PDF_EINK_FOLIOS.forEach((f) => {
      if (datPuterState.pdfMetaCache[f.id]) return;
      datPuterState.pdfMetaCache[f.id] = { status: "PROBING...", bytes: 0 };
      fetch(f.pdfUrl, { method: "GET" })
        .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error("HTTP " + r.status))))
        .then((buf) => {
          datPuterState.pdfMetaCache[f.id] = {
            status: "VERIFIED E-INK BUFFER",
            bytes: buf.byteLength,
          };
        })
        .catch(() => {
          datPuterState.pdfMetaCache[f.id] = { status: "EMBEDDED ROM", bytes: 49152 };
        });
    });
  }

  function openDatPuter(sectionIdOrIdx, folioId) {
    if (typeof sectionIdOrIdx === "number") {
      datPuterState.sectionIdx = Math.max(0, Math.min(DAT_SECTIONS.length - 1, sectionIdOrIdx));
    } else if (typeof sectionIdOrIdx === "string") {
      const idx = DAT_SECTIONS.findIndex((s) => s.id === sectionIdOrIdx);
      if (idx >= 0) datPuterState.sectionIdx = idx;
    }
    if (folioId) {
      const fIdx = PDF_EINK_FOLIOS.findIndex((f) => f.id === folioId);
      if (fIdx >= 0) {
        datPuterState.selectedFolioIdx = fIdx;
        const pdfSecIdx = DAT_SECTIONS.findIndex((s) => s.id === "pdfs");
        if (pdfSecIdx >= 0) datPuterState.sectionIdx = pdfSecIdx;
      }
    }
    datPuterState.pageIdx = 0;
    datPuterState.open = true;
    preloadPdfMetadata();
    triggerDatPuterEinkRefresh(datPuterState.sectionIdx);
  }

  function toggleDatPuter() {
    if (datPuterState.open) {
      datPuterState.open = false;
      if (global.SlopesAudio && global.SlopesAudio.playClick) global.SlopesAudio.playClick(false);
    } else {
      openDatPuter();
    }
    return datPuterState.open;
  }

  function openArtifactModal(art) {
    openDatPuter("pdfs", (art && art.id) || "corvus");
  }

  function updateChronosDomUI() {
    // Legacy hook kept for API compatibility; all UI is now 1:1 device-pixel canvas in DAT-307!
  }

  // Draw microlaser textured grip dots of different dither patterns + glowing sub-surface micro-LEDs!
  function drawMicrolaserButton(ctx, R, x, y, w, h, label, active, patternType, ledShape, phase, fontKey) {
    const bgHex = active ? "#2d353d" : "#1c2126";
    const brdHex = active ? "#a8b8c4" : "#444e58";
    R.drawHairlineRect(ctx, x, y, w, h, brdHex, bgHex);
    // Metallic bevel highlight (top 1px specular, bottom 1px shadow)
    ctx.fillStyle = active ? "#6c7a86" : "#343c44";
    ctx.fillRect(x + 1, y + 1, w - 2, 1);
    ctx.fillStyle = "#0e1114";
    ctx.fillRect(x + 1, y + h - 2, w - 2, 1);

    // Left & right microlaser textured grip zones with distinct dither patterns + teensy sub-surface micro-LEDs!
    const gripW = Math.min(22, Math.max(10, Math.floor(w * 0.16)));
    const cxL = x + 3 + gripW * 0.5;
    const cyM = y + h * 0.5;

    for (let side = 0; side < 2; side++) {
      const gx0 = side === 0 ? x + 3 : x + w - gripW - 3;
      for (let py = y + 4; py < y + h - 4; py += 2) {
        for (let px = gx0; px < gx0 + gripW; px += 2) {
          let dotOn = false;
          const dx = px - gx0;
          const dy = py - (y + 4);
          if (patternType === "bayer4x4") {
            dotOn = ((dx + dy * 3) & 3) === 0;
          } else if (patternType === "checker2x2") {
            dotOn = ((dx ^ dy) & 2) === 0;
          } else if (patternType === "diag_ridge") {
            dotOn = (dx + dy) % 4 === 0;
          } else if (patternType === "braille_grip") {
            dotOn = dx % 4 === 0 && dy % 3 === 0;
          } else {
            dotOn = (dx * dy) % 5 === 0;
          }
          if (!dotOn) continue;

          // Compute sub-surface teensy micro-LED signal underneath the laser grip dot!
          const nx = (px - (side === 0 ? cxL : x + w - 3 - gripW * 0.5)) / Math.max(4, gripW * 0.5);
          const ny = (py - cyM) / Math.max(4, h * 0.4);
          const ang = Math.atan2(ny, nx);
          const rad = Math.hypot(nx, ny);
          let ledSignal = 0;
          if (ledShape === "ring") {
            ledSignal = Math.max(0, Math.cos(ang * 2 - phase * 2.4) * (1 - Math.abs(rad - 0.65)));
          } else if (ledShape === "spiral") {
            ledSignal = Math.max(0, Math.sin(ang * 3 + rad * 4 - phase * 3.0));
          } else if (ledShape === "diamond") {
            const dDist = Math.abs(nx) + Math.abs(ny);
            ledSignal = Math.max(0, Math.cos((dDist - ((phase * 0.4) % 1.2)) * 5));
          } else {
            ledSignal = Math.max(0, Math.sin(nx * 3 + phase * 2.8) * Math.cos(ny * 2));
          }

          if (ledSignal > 0.58 && (active || datPuterState.whirTimer > 0)) {
            // Sub-surface micro-LED glowing through laser-drilled micro-aperture!
            ctx.fillStyle = active ? "#ffb84d" : "#69db7c";
            ctx.fillRect(px, py, 1, 1);
          } else {
            // Microlaser etched metallic grip dot
            ctx.fillStyle = active ? "#56626e" : "#343b42";
            ctx.fillRect(px, py, 1, 1);
          }
        }
      }
    }

    const fontObj = R.getFont(fontKey);
    const charW = fontObj.w || 12;
    const lineH = fontObj.h || 26;
    const maxChars = Math.max(4, Math.floor((w - gripW * 2 - 10) / charW));
    const trimmed = String(label).slice(0, maxChars);
    const tx = Math.round(x + (w - trimmed.length * charW) * 0.5);
    const ty = Math.round(y + (h - lineH) * 0.5);
    R.drawCanvasText(ctx, trimmed, tx, ty, active ? "#f0f6fa" : "#b4c0c8", fontKey, 1, 0);
  }

  function renderWebcamAndDatPuterOverlay(ctx, devW, devH) {
    const ht = global.HardcoreTab;
    if (!ht || !ht.HardcoreTabRenderer) return;
    const R = ht.HardcoreTabRenderer;
    const fontKey = "h12x26";
    const fontObj = R.getFont(fontKey);
    const charW = fontObj.w || 12;
    const lineH = fontObj.h || 26;

    stepWebcamTrackingAndCrows();
    datPuterState.ledPhase += 0.065;
    if (datPuterState.whirTimer > 0) datPuterState.whirTimer--;
    if (datPuterState.einkRefreshAlpha > 0) {
      datPuterState.einkRefreshAlpha = Math.max(0, datPuterState.einkRefreshAlpha - 0.045);
    }

    // ----------------------------------------------------------------------
    // A. SECRET CLOSED-EYE ASTRAL LAYER & SYLVIA PLATH POEM (When Eyes Shut)
    // ----------------------------------------------------------------------
    if (webcamState.closedAlpha > 0.01) {
      const a = webcamState.closedAlpha;
      ctx.save();
      ctx.fillStyle = `rgba(3, 5, 14, ${(a * 0.90).toFixed(3)})`;
      ctx.fillRect(0, 0, devW, devH);

      // Draw hidden nocturnal constellation & mycelial soul-threads only visible to an onlooker when eyes are shut!
      const t = datPuterState.ledPhase;
      for (let i = 0; i < 36; i++) {
        const sx = Math.round(((Math.sin(i * 12.9898 + t * 0.12) * 0.5 + 0.5) * devW));
        const sy = Math.round(((Math.cos(i * 78.233 - t * 0.08) * 0.5 + 0.5) * devH));
        const twinkle = (Math.sin(t * 1.8 + i) * 0.5 + 0.5) * a;
        ctx.fillStyle = i % 2 === 0
          ? `rgba(116, 192, 252, ${(twinkle * 0.75).toFixed(3)})`
          : `rgba(255, 135, 135, ${(twinkle * 0.68).toFixed(3)})`;
        ctx.fillRect(sx, sy, 2, 2);
      }

      // Render Sylvia Plath's "Mad Girl's Love Song" subtly in crisp 1:1 device-pixel `h12x26` hairline font
      const boxW = Math.min(devW - 24, 58 * charW + 28);
      const boxH = Math.min(devH - 24, (SYLVIA_PLATH_STANZAS.length + 2) * lineH + 20);
      const bx = Math.round((devW - boxW) * 0.5);
      const by = Math.round((devH - boxH) * 0.5);

      R.drawHairlineRect(
        ctx,
        bx,
        by,
        boxW,
        boxH,
        `rgba(148, 182, 235, ${(a * 0.45).toFixed(2)})`,
        `rgba(6, 9, 20, ${(a * 0.72).toFixed(2)})`
      );
      const sonic = global.SlopesAudio && typeof global.SlopesAudio.getLiveSonicContext === "function"
        ? global.SlopesAudio.getLiveSonicContext()
        : { scaleName: "PI-SHIFT", modalityShortName: "SOLO" };
      const hdr = `── CLOSED-EYE ASTRAL LAYER // SOLO IN ${sonic.scaleName} ──`;
      const maxCols = Math.max(20, Math.floor((boxW - 20) / charW));
      R.drawCanvasText(
        ctx,
        hdr.slice(0, maxCols),
        bx + 12,
        by + 8,
        `rgba(155, 205, 255, ${(a * 0.78).toFixed(2)})`,
        fontKey,
        1,
        0
      );

      for (let i = 0; i < SYLVIA_PLATH_STANZAS.length; i++) {
        const line = SYLVIA_PLATH_STANZAS[i];
        const ly = by + 12 + (i + 1) * lineH;
        if (ly + lineH > by + boxH - 6) break;
        const isCredit = i === SYLVIA_PLATH_STANZAS.length - 1;
        const col = isCredit
          ? `rgba(255, 212, 128, ${(a * 0.88).toFixed(2)})`
          : `rgba(218, 230, 248, ${(a * 0.76).toFixed(2)})`;
        R.drawCanvasText(ctx, line.slice(0, maxCols), bx + 12, ly, col, fontKey, 1, 0);
      }
      ctx.restore();
    }

    // ----------------------------------------------------------------------
    // B. SMILING LOVING CROW SWARM (`webcamState.lovingCrows`)
    // ----------------------------------------------------------------------
    for (let i = 0; i < webcamState.lovingCrows.length; i++) {
      const c = webcamState.lovingCrows[i];
      const cx = Math.round(c.x * devW);
      const cy = Math.round(c.y * devH);
      const wingY = Math.round(Math.sin(c.wingPhase) * 9);
      // Obsidian-gold crow silhouette in crisp device pixels
      ctx.fillStyle = "#18141c";
      ctx.fillRect(cx - 6, cy - 2, 12, 5);
      ctx.fillStyle = "#ffd43b";
      ctx.fillRect(cx + (c.vx >= 0 ? 6 : -8), cy - 1, 3, 2); // Golden beak
      // Sweeping wings
      ctx.fillStyle = "#2b2434";
      ctx.fillRect(cx - 10, cy - 2 + wingY, 8, 3);
      ctx.fillRect(cx + 2, cy - 2 - wingY, 8, 3);
      ctx.fillStyle = "#ffa94d";
      ctx.fillRect(cx - 10, cy - 2 + wingY, 3, 1);
      ctx.fillRect(cx + 7, cy - 2 - wingY, 3, 1);
    }
    for (let i = 0; i < webcamState.heartParticles.length; i++) {
      const hp = webcamState.heartParticles[i];
      const hx = Math.round(hp.x * devW);
      const hy = Math.round(hp.y * devH);
      R.drawCanvasText(ctx, "♥", hx, hy, "#ff8787", fontKey, 1, 0);
    }

    // ----------------------------------------------------------------------
    // C. TOP-RIGHT HARDWARE PIXEL CONTROLS (`[◉ CAM]` & `[DAT-307 CODEX]`)
    // ----------------------------------------------------------------------
    datPuterState.topHudHitBoxes = [];
    const topY = 6;
    const btnH = lineH + 4; // 30 device pixels tall (matches top-left Hardcore hairline bar!)

    const datLabel = datPuterState.open ? "*DAT-307 [B]" : "DAT-307 [B]";
    const datW = datLabel.length * charW + 14;
    const datX = devW - datW - 6;
    const datBrd = datPuterState.open ? "#f4d03f" : "#2f5f72";
    const datFg = datPuterState.open ? "#ffe066" : "#a9dde8";
    R.drawHairlineRect(ctx, datX, topY, datW, btnH, datBrd, null);
    R.drawCanvasText(ctx, datLabel, datX + 7, topY + 2, datFg, fontKey, 1, 0);
    datPuterState.topHudHitBoxes.push({ action: "toggle-dat", x: datX, y: topY, w: datW, h: btnH });

    const eyeDbg = webcamState.rawEyeDetected || webcamState.manualEyesClosed || webcamState.eyesClosed;
    const smileDbg = webcamState.rawSmileDetected || webcamState.smiling;
    const camWord = "C" + (eyeDbg ? "a" : "A") + (smileDbg ? "m" : "M");
    const camLabel = "◉ " + camWord;
    const camW = camLabel.length * charW + 14;
    const camX = datX - camW - 6;
    const camBrd = webcamState.active ? "#69db7c" : "#2f5f72";
    R.drawHairlineRect(ctx, camX, topY, camW, btnH, camBrd, null);
    R.drawCanvasText(ctx, camLabel, camX + 7, topY + 2, camBrd, fontKey, 1, 0);
    datPuterState.topHudHitBoxes.push({ action: "toggle-cam", x: camX, y: topY, w: camW, h: btnH });

    // ----------------------------------------------------------------------
    // D. `DAT-307` LUNAR ARCHIVAL DATAPUTER E-READER MODAL (When Open)
    // ----------------------------------------------------------------------
    datPuterState.hitBoxes = [];
    if (!datPuterState.open) {
      syncDatPuterPdfIframe(false, devW, devH, 0, 0, 0, 0, "");
      return;
    }

    const padX = Math.max(10, Math.round(devW * 0.03));
    const padY = Math.max(12, Math.round(devH * 0.04));
    const caseW = Math.max(460, Math.min(devW - padX * 2, 1080));
    const caseH = Math.max(320, Math.min(devH - padY * 2, 760));
    const caseX = Math.round((devW - caseW) * 0.5);
    const caseY = Math.round((devH - caseH) * 0.5);

    // 1. Dark Gray Textured Metal Chassis (`#1e2226`..`#2c3238`) with 1px Brushed Moonrock-Spec Dither
    R.drawHairlineRect(ctx, caseX, caseY, caseW, caseH, "#687480", "#1f2429");
    R.drawHairlineRect(ctx, caseX + 2, caseY + 2, caseW - 4, caseH - 4, "#39414a", "#23292f");

    // Subtle 1px brushed dark-metal dither across chassis bezel
    ctx.fillStyle = "#181c20";
    for (let my = caseY + 4; my < caseY + caseH - 4; my += 4) {
      for (let mx = caseX + 4 + (my % 8); mx < caseX + caseW - 4; mx += 8) {
        ctx.fillRect(mx, my, 2, 1);
      }
    }

    // 2. Top Engraved Metal Nameplate + Whirring Micro-LED Array + `[ESC X]`
    const topBarH = lineH + 10;
    R.drawHairlineRect(ctx, caseX + 8, caseY + 6, caseW - 16, topBarH, "#46505a", "#161a1e");
    const closeW = 7 * charW + 14;
    const closeX = caseX + caseW - closeW - 14;
    drawMicrolaserButton(
      ctx,
      R,
      closeX,
      caseY + 9,
      closeW,
      lineH + 4,
      "ESC X",
      false,
      "diag_ridge",
      "diamond",
      datPuterState.ledPhase,
      fontKey
    );
    datPuterState.hitBoxes.push({ action: "close-dat", x: closeX, y: caseY + 9, w: closeW, h: lineH + 4 });

    // Teensy rotary micro-LED cluster on top bezel that spins & whirs
    const ledClusterX = closeX - 42;
    const ledClusterY = caseY + 9 + Math.floor((lineH + 4) * 0.5);
    for (let li = 0; li < 8; li++) {
      const lang = (li / 8) * Math.PI * 2 + datPuterState.ledPhase * (datPuterState.whirTimer > 0 ? 4.5 : 1.2);
      const lx = Math.round(ledClusterX + Math.cos(lang) * 9);
      const ly = Math.round(ledClusterY + Math.sin(lang) * 9);
      const lit = ((li + Math.floor(datPuterState.ledPhase * 6)) & 7) < 3;
      ctx.fillStyle = lit ? (datPuterState.whirTimer > 0 ? "#ffd43b" : "#69db7c") : "#2a3238";
      ctx.fillRect(lx, ly, 2, 2);
    }

    const headerTitle = "DAT-307 // LUNAR ARCHIVAL DATAPUTER [10,000-YR MOONROCK CODEX]";
    const maxHdrCols = Math.max(12, Math.floor((ledClusterX - (caseX + 20)) / charW));
    R.drawCanvasText(
      ctx,
      headerTitle.slice(0, maxHdrCols),
      caseX + 16,
      caseY + 11,
      "#c8d4dc",
      fontKey,
      1,
      0
    );

    // 3. Row of 4 Microlaser Textured Metallic Section Buttons
    const secRowY = caseY + topBarH + 10;
    const secBtnH = lineH + 6;
    const secGap = 6;
    const availSecW = caseW - 16;
    const eachSecW = Math.floor((availSecW - secGap * (DAT_SECTIONS.length - 1)) / DAT_SECTIONS.length);
    for (let s = 0; s < DAT_SECTIONS.length; s++) {
      const sec = DAT_SECTIONS[s];
      const sx = caseX + 8 + s * (eachSecW + secGap);
      const isAct = datPuterState.sectionIdx === s;
      drawMicrolaserButton(
        ctx,
        R,
        sx,
        secRowY,
        eachSecW,
        secBtnH,
        sec.label,
        isAct,
        sec.gripPattern,
        sec.ledShape,
        datPuterState.ledPhase + s,
        fontKey
      );
      datPuterState.hitBoxes.push({
        action: "select-section",
        sectionIdx: s,
        x: sx,
        y: secRowY,
        w: eachSecW,
        h: secBtnH,
      });
    }

    // 4. Long Kindle-Style Side Page Buttons (`◄ PREV` on Left Bezel, `NEXT ►` on Right Bezel)
    const bodyTopY = secRowY + secBtnH + 8;
    const bodyH = caseH - (bodyTopY - caseY) - 12;
    const sideBtnW = Math.max(36, Math.min(54, 3 * charW + 14));

    // Left long side button (`◄ PREV`)
    const leftSideX = caseX + 8;
    drawMicrolaserButton(
      ctx,
      R,
      leftSideX,
      bodyTopY,
      sideBtnW,
      bodyH,
      "◄",
      false,
      "braille_grip",
      "wave",
      datPuterState.ledPhase,
      fontKey
    );
    R.drawCanvasText(ctx, "P", leftSideX + Math.floor((sideBtnW - charW) * 0.5), bodyTopY + 14, "#94a4b0", fontKey, 1, 0);
    R.drawCanvasText(ctx, "R", leftSideX + Math.floor((sideBtnW - charW) * 0.5), bodyTopY + 14 + lineH, "#94a4b0", fontKey, 1, 0);
    R.drawCanvasText(ctx, "E", leftSideX + Math.floor((sideBtnW - charW) * 0.5), bodyTopY + 14 + lineH * 2, "#94a4b0", fontKey, 1, 0);
    R.drawCanvasText(ctx, "V", leftSideX + Math.floor((sideBtnW - charW) * 0.5), bodyTopY + 14 + lineH * 3, "#94a4b0", fontKey, 1, 0);
    datPuterState.hitBoxes.push({ action: "prev-page", x: leftSideX, y: bodyTopY, w: sideBtnW, h: bodyH });

    // Right long side button (`NEXT ►`)
    const rightSideX = caseX + caseW - sideBtnW - 8;
    drawMicrolaserButton(
      ctx,
      R,
      rightSideX,
      bodyTopY,
      sideBtnW,
      bodyH,
      "►",
      false,
      "braille_grip",
      "wave",
      datPuterState.ledPhase + 1.5,
      fontKey
    );
    R.drawCanvasText(ctx, "N", rightSideX + Math.floor((sideBtnW - charW) * 0.5), bodyTopY + 14, "#94a4b0", fontKey, 1, 0);
    R.drawCanvasText(ctx, "E", rightSideX + Math.floor((sideBtnW - charW) * 0.5), bodyTopY + 14 + lineH, "#94a4b0", fontKey, 1, 0);
    R.drawCanvasText(ctx, "X", rightSideX + Math.floor((sideBtnW - charW) * 0.5), bodyTopY + 14 + lineH * 2, "#94a4b0", fontKey, 1, 0);
    R.drawCanvasText(ctx, "T", rightSideX + Math.floor((sideBtnW - charW) * 0.5), bodyTopY + 14 + lineH * 3, "#94a4b0", fontKey, 1, 0);
    datPuterState.hitBoxes.push({ action: "next-page", x: rightSideX, y: bodyTopY, w: sideBtnW, h: bodyH });

    // 5. Central Soft Monochrome Whitish-Gray E-Ink Screen (`#d6dcd2`) with Dither Paper Texture!
    const einkX = leftSideX + sideBtnW + 8;
    const einkY = bodyTopY;
    const einkW = rightSideX - einkX - 8;
    const einkH = bodyH;

    // Recessed inner metal bezel around E-Ink glass
    R.drawHairlineRect(ctx, einkX - 2, einkY - 2, einkW + 4, einkH + 4, "#101418", "#c9d0c5");
    R.drawHairlineRect(ctx, einkX, einkY, einkW, einkH, "#7b8479", "#d6dcd2");

    // Subtle monochrome E-Ink micro-capsule paper dither fill
    ctx.fillStyle = "#c8cfc4";
    for (let py = einkY + 2; py < einkY + einkH - 2; py += 3) {
      for (let px = einkX + 2 + ((py * 3) & 3); px < einkX + einkW - 2; px += 6) {
        ctx.fillRect(px, py, 1, 1);
      }
    }

    const inkDark = "#141816";
    const inkMid = "#343c38";
    const inkSoft = "#525c56";
    const einkCols = Math.max(24, Math.floor((einkW - 20) / charW));
    const einkRows = Math.max(6, Math.floor((einkH - 16) / lineH));

    function drawEinkButton(bx, by, bw, bh, lbl, isSelected, actionObj) {
      R.drawHairlineRect(ctx, bx, by, bw, bh, inkDark, isSelected ? "#1c221e" : "#c2c9be");
      const maxC = Math.max(3, Math.floor((bw - 10) / charW));
      const txt = String(lbl).slice(0, maxC);
      const tx = Math.round(bx + (bw - txt.length * charW) * 0.5);
      const ty = Math.round(by + (bh - lineH) * 0.5);
      R.drawCanvasText(ctx, txt, tx, ty, isSelected ? "#d8dfd4" : inkDark, fontKey, 1, 0);
      datPuterState.hitBoxes.push(Object.assign({ x: bx, y: by, w: bw, h: bh }, actionObj));
    }

    // Render E-Ink Section Content
    const secId = DAT_SECTIONS[datPuterState.sectionIdx].id;
    let totalPages = 1;

    if (secId === "manual") {
      const manualPages = [
        [
          "╔═ DAT-307 FIELD MANUAL // COMPACT CONTROLLER & KEYS ════════╗",
          "║ • MOVE / JUMP : D-Pad Left/Right/Up or WASD / Arrows       ║",
          "║ • BUILD / WFC : [SQR / C] — Seep WFC Masonry & Terraces    ║",
          "║ • SONIC TAMP  : [CRS / F] — Harmonic Tamp & Spore Catalyst ║",
          "║ • SKY / CROWS : [TRI / R] — Call Seer Crows / Mount Skiff  ║",
          "║ • 5-FOLD ROT  : [5F-L / Q] & [5F-R / E] — Non-Euclidean    ║",
          "║ • RAGA / SCALE: [TAB:RAGA] — Cycle Active Musical Scale    ║",
          "║ • DAT-307 BOOK: [DAT / B / P] — Open/Close Lunar Dataputer ║",
          "║ • WEBCAM EYE  : [◉ CAM] (Top-Right) or Keys [O]=Eye [M]=☺  ║",
          "╚════════════════════════════════════════════════════════════╝",
          "┌─ EMBODIED TERM-FORMS (TAB-01..03) & IN-WORLD TE-307 TTY ───┐",
          "│ • Click any flying/rolling Term-Form in the world to open  │",
          "│   its 1:1 device-pixel Hardcore Terminal (`h12x26`).       │",
          "│ • Click the physical TE-307 Mainframe Tower at x=46 (or    │",
          "│   press `~` / `` ` ``) to open the Multi-User TUI App!      │",
          "└────────────────────────────────────────────────────────────┘",
        ],
        [
          "╔═ SENTINEL SNAKE TENTACLES & 3-SECTION CONIC FLOWER ════════╗",
          "║ Each Term-Form ship (`TAB-01..03`) carries 3 biomechanical ║",
          "║ 14-segment snake tentacles ending in a 3-Section Conic     ║",
          "║ Mechanical Flower (`conic_flower_3sect`) controllable via  ║",
          "║ shell or Claude Code (`/usr/local/bin/tentacle`):          ║",
          "║                                                            ║",
          "║  $ tentacle open 100       # Splay 3x120° conic petals     ║",
          "║  $ tentacle close          # Close into armored cone       ║",
          "║  $ tentacle grab human     # Pick up & hold human/mason    ║",
          "║  $ tentacle suck goo       # Vortex particle/spore intake  ║",
          "║  $ tentacle drain vat      # Pump glowing liquid boluses   ║",
          "║  $ tentacle deposit human  # Open wide & deposit human!    ║",
          "╚════════════════════════════════════════════════════════════╝",
          "┌─ FLIGHT LANDING GEAR & SPRING-ADAPTIVE SUSPENSION ─────────┐",
          "│ • Flying ships roll up their 4 wheels into landing bays.   │",
          "│ • Driving over rough slopes extends spring-adaptive struts.│",
          "└────────────────────────────────────────────────────────────┘",
        ],
      ];
      totalPages = manualPages.length;
      const pIdx = ((datPuterState.pageIdx % totalPages) + totalPages) % totalPages;
      const lines = manualPages[pIdx];
      for (let r = 0; r < Math.min(einkRows - 1, lines.length); r++) {
        R.drawCanvasText(
          ctx,
          lines[r].slice(0, einkCols),
          einkX + 10,
          einkY + 8 + r * lineH,
          r === 0 || lines[r].startsWith("╔") ? inkDark : inkMid,
          fontKey,
          1,
          0
        );
      }
    } else if (secId === "chronos") {
      totalPages = 1;
      const era = DYNAMICAL_ERAS[civState.currentEraIndex];
      const sonic = global.SlopesAudio && typeof global.SlopesAudio.getLiveSonicContext === "function"
        ? global.SlopesAudio.getLiveSonicContext()
        : { scaleName: "PI-SHIFT", modalityShortName: "RAGA // ITALO", rootMidi: 60 };

      R.drawCanvasText(
        ctx,
        `╔═ CHRONOS HYPER-SIMULATOR (1x..100,000x) & CIRCULAR ECONOMY ═╗`.slice(0, einkCols),
        einkX + 10,
        einkY + 8,
        inkDark,
        fontKey,
        1,
        0
      );
      R.drawCanvasText(
        ctx,
        `SPEED: ${civState.simSpeed.toLocaleString()}x (${civState.speedCause}) // EPOCH: ${civState.totalSimulatedEpochs.toLocaleString()}`.slice(0, einkCols),
        einkX + 10,
        einkY + 8 + lineH,
        inkMid,
        fontKey,
        1,
        0
      );
      R.drawCanvasText(
        ctx,
        `ERA: ${era.label} // ZOOM: ${zoomState.depth}/5 (${ZOOM_LAYER_NAMES[zoomState.depth]})`.slice(0, einkCols),
        einkX + 10,
        einkY + 8 + lineH * 2,
        inkMid,
        fontKey,
        1,
        0
      );

      // Interactive E-Ink Speed Buttons (`1x`, `10x`, `100x`, `1,000x`, `10,000x`, `100,000x`)
      let sbx = einkX + 10;
      const sby = einkY + 12 + lineH * 3;
      for (let i = 0; i < SPEED_TIERS.length; i++) {
        const sp = SPEED_TIERS[i];
        const lbl = sp >= 1000 ? `${sp / 1000}Kx` : `${sp}x`;
        const bw = lbl.length * charW + 14;
        if (sbx + bw > einkX + einkW - 10) break;
        drawEinkButton(sbx, sby, bw, lineH + 2, lbl, civState.simSpeed === sp, {
          action: "set-simspeed",
          speed: sp,
        });
        sbx += bw + 6;
      }

      // Interactive Circular Economy & Audio Modality E-Ink Buttons
      const actY = sby + lineH + 10;
      const actButtons = [
        { lbl: "DUMP IN LAVA", act: "dump-lava" },
        { lbl: "RECYCLE SCRAP", act: "recycle-scrap" },
        { lbl: `ZOOM + (${zoomState.depth}/5)`, act: "zoom-in" },
        { lbl: "ZOOM -", act: "zoom-out" },
        { lbl: `MODE: ${sonic.modalityShortName}`, act: "cycle-music-mode" },
      ];
      let abx = einkX + 10;
      for (let i = 0; i < actButtons.length; i++) {
        const ab = actButtons[i];
        const bw = ab.lbl.length * charW + 14;
        if (abx + bw > einkX + einkW - 10) break;
        drawEinkButton(abx, actY, bw, lineH + 2, ab.lbl, false, { action: ab.act });
        abx += bw + 6;
      }

      const ledgerLines = [
        "──────────────────────────────────────────────────────────────",
        `BIODOMES: ${civState.megastructures.length} | GLASS PANES: ${civState.resources.glassPanes} | BRICK: ${civState.resources.terracottaBrick} | GILT WIRE: ${civState.resources.giltWire}`,
        `LUMINITE: ${civState.resources.luminiteShards} | LOGIC WAFERS: ${civState.resources.logicWafers} | CROPS: ${civState.resources.cropBushels} | GEOTHERMAL: ${civState.resources.geothermalMWh}MWh`,
        `CIRCULAR WASTE: Recycled=${civState.wasteMetrics.totalRecycled} | Lava Incinerated=${civState.wasteMetrics.totalLavaIncinerated}`,
        `SONIC KEY LOCK: ${sonic.scaleName} (Root MIDI ${sonic.rootMidi}) — All SFX & Solos Locked`,
      ];
      const startLy = actY + lineH + 10;
      for (let r = 0; r < ledgerLines.length; r++) {
        const ly = startLy + r * lineH;
        if (ly + lineH > einkY + einkH - 28) break;
        R.drawCanvasText(ctx, ledgerLines[r].slice(0, einkCols), einkX + 10, ly, inkMid, fontKey, 1, 0);
      }
    } else if (secId === "civs") {
      const prof = LORE_ARTIFACTS.find((a) => a.id === civState.dominantFaction) || LORE_ARTIFACTS[0];
      const civPages = [
        [
          `╔═ SINGULARITY ATTRACTOR: ${prof.faction.toUpperCase()} ═╗`,
          `TITLE : ${prof.invitationTitle}`,
          `MEDIUM: ${prof.medium}`,
          "──────────────────────────────────────────────────────────────",
          prof.vesselClaim.slice(0, einkCols),
          prof.vesselClaim.slice(einkCols, einkCols * 2),
          "──────────────────────────────────────────────────────────────",
          prof.invitationText.slice(0, einkCols),
          prof.invitationText.slice(einkCols, einkCols * 2),
          prof.invitationText.slice(einkCols * 2, einkCols * 3),
          "──────────────────────────────────────────────────────────────",
          `ALIGNMENT SCORES: Orange=${Math.round(civState.alignment.orange)} Corvus=${Math.round(civState.alignment.corvus)} Cervus=${Math.round(civState.alignment.cervus)} Vexari=${Math.round(civState.alignment.vexari)} TabForm=${Math.round(civState.alignment.tabform)}`,
        ],
      ];
      totalPages = civPages.length;
      const lines = civPages[0];
      for (let r = 0; r < Math.min(einkRows - 3, lines.length); r++) {
        R.drawCanvasText(
          ctx,
          (lines[r] || "").slice(0, einkCols),
          einkX + 10,
          einkY + 8 + r * lineH,
          r === 0 ? inkDark : inkMid,
          fontKey,
          1,
          0
        );
      }
      const palmBtnY = einkY + einkH - lineH * 2 - 12;
      const palmLbl = "▣ HOLD PALM FLAT TO GLASS (5-FOLD CONVERGENCE)";
      drawEinkButton(einkX + 10, palmBtnY, Math.min(einkW - 20, palmLbl.length * charW + 20), lineH + 4, palmLbl, true, {
        action: "hold-palm-convergence",
      });
    } else if (secId === "pdfs") {
      // Embedded Real Compiled LaTeX PDF Viewer inside the DAT-307 Screen Bezel!
      let fbx = einkX + 8;
      const fby = einkY + 6;
      for (let f = 0; f < PDF_EINK_FOLIOS.length; f++) {
        const fol = PDF_EINK_FOLIOS[f];
        const lbl = `${f + 1}:${fol.id.toUpperCase()}`;
        const bw = lbl.length * charW + 12;
        if (fbx + bw > einkX + einkW - 8) break;
        drawEinkButton(fbx, fby, bw, lineH + 2, lbl, datPuterState.selectedFolioIdx === f, {
          action: "select-folio",
          folioIdx: f,
        });
        fbx += bw + 4;
      }

      const folio = PDF_EINK_FOLIOS[datPuterState.selectedFolioIdx] || PDF_EINK_FOLIOS[0];
      const activePdfUrl = datPuterState.pdfDocMode === "paper" ? folio.paperPdfUrl : folio.pdfUrl;
      totalPages = PDF_EINK_FOLIOS.length;
      const meta = datPuterState.pdfMetaCache[folio.id] || { status: "LIVE PDF", bytes: 112640 };

      // Render E-Ink PDF Header Bar, [FOLIO/PAPER] Toggle & [OPEN TAB ↗] Button
      const metaY = fby + lineH + 4;
      const rawLbl = "OPEN TAB ↗";
      const rawW = rawLbl.length * charW + 12;
      drawEinkButton(einkX + einkW - rawW - 8, metaY, rawW, lineH, rawLbl, false, {
        action: "open-raw-pdf",
        url: activePdfUrl,
      });

      const modeLbl = datPuterState.pdfDocMode === "paper" ? "DOC:PAPER" : "DOC:FOLIO";
      const modeW = modeLbl.length * charW + 12;
      drawEinkButton(einkX + einkW - rawW - modeW - 14, metaY, modeW, lineH, modeLbl, datPuterState.pdfDocMode === "paper", {
        action: "toggle-pdf-doc-mode",
      });

      const metaStr = `${activePdfUrl} (${(meta.bytes / 1024).toFixed(1)} KB)`;
      const maxMetaCols = Math.max(8, Math.floor((einkW - rawW - modeW - 34) / charW));
      R.drawCanvasText(ctx, metaStr.slice(0, maxMetaCols), einkX + 10, metaY, inkDark, fontKey, 1, 0);

      const contentStartY = metaY + lineH + 4;
      const footY = einkY + einkH - lineH - 4;
      const pdfBoxX = einkX + 6;
      const pdfBoxY = contentStartY;
      const pdfBoxW = Math.max(120, einkW - 12);
      const pdfBoxH = Math.max(80, footY - contentStartY - 4);

      // Mount/position the real `<iframe id="dat-puter-pdf-frame">` directly inside the DAT-307 screen bezel!
      syncDatPuterPdfIframe(true, devW, devH, pdfBoxX, pdfBoxY, pdfBoxW, pdfBoxH, activePdfUrl);
    }

    if (secId !== "pdfs") {
      syncDatPuterPdfIframe(false, devW, devH, 0, 0, 0, 0, "");
    }

    // Bottom E-Ink Status Footer inside the screen
    const footY = einkY + einkH - lineH - 4;
    const pCur = secId === "pdfs"
      ? datPuterState.selectedFolioIdx + 1
      : (((datPuterState.pageIdx % totalPages) + totalPages) % totalPages) + 1;
    const footText = secId === "pdfs"
      ? `◄ SIDE BUTTONS CYCLE REAL PDFS // PDF ${pCur} OF ${PDF_EINK_FOLIOS.length}: ${PDF_EINK_FOLIOS[datPuterState.selectedFolioIdx].shortTitle} ►`
      : `◄ SIDE BUTTONS OR [ / ] TO TURN PAGE // PAGE ${pCur} OF ${totalPages} // E-INK 16-GRAY MONO ►`;
    R.drawCanvasText(ctx, footText.slice(0, einkCols), einkX + 10, footY, inkSoft, fontKey, 1, 0);

    // Slow, soft E-Ink ghosting/inversion flash during page refresh!
    if (datPuterState.einkRefreshAlpha > 0.01) {
      const a = datPuterState.einkRefreshAlpha;
      ctx.fillStyle = a > 0.55
        ? `rgba(24, 28, 26, ${((a - 0.55) * 1.8).toFixed(2)})`
        : `rgba(218, 224, 214, ${(a * 1.4).toFixed(2)})`;
      ctx.fillRect(einkX + 1, einkY + 1, einkW - 2, einkH - 2);
    }
  }

  function mountDatPuterAndWebcamCanvas() {
    if (typeof document === "undefined" || datPuterState.canvas) return;
    const screenDiv = document.getElementById("screen");
    if (!screenDiv) return;

    // Clarify the left controller pad `TAB / SCALE` button so users know `TAB` is Music Raga!
    const selBtn = document.querySelector('[data-k="sel"]');
    if (selBtn) selBtn.dataset.lbl = "TAB: RAGA";

    const c = document.createElement("canvas");
    c.id = "dat-puter-canvas";
    c.style.cssText =
      "position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:8;display:block;image-rendering:pixelated;";
    screenDiv.appendChild(c);
    datPuterState.canvas = c;
    datPuterState.ctx = c.getContext("2d");

    // Mount real PDF `<iframe id="dat-puter-pdf-frame">` inside `#screen` so DAT-307 displays the real compiled LaTeX PDFs!
    const pdfIframe = document.createElement("iframe");
    pdfIframe.id = "dat-puter-pdf-frame";
    pdfIframe.title = "DAT-307 Real PDF Viewer";
    pdfIframe.style.cssText =
      "position:absolute;left:10%;top:18%;width:80%;height:70%;border:1px solid #343c38;background:#d6dcd2;z-index:9;display:none;";
    screenDiv.appendChild(pdfIframe);
    datPuterState.pdfIframe = pdfIframe;

    function syncSize() {
      const dpr = (typeof window !== "undefined" && window.devicePixelRatio) || 1;
      const cssW = Math.max(1, screenDiv.clientWidth || NATIVE_W);
      const cssH = Math.max(1, screenDiv.clientHeight || NATIVE_H);
      const devW = Math.max(1, Math.round(cssW * dpr));
      const devH = Math.max(1, Math.round(cssH * dpr));
      if (c.width !== devW || c.height !== devH) {
        c.width = devW;
        c.height = devH;
        c.style.width = cssW + "px";
        c.style.height = cssH + "px";
      }
      datPuterState.ctx.imageSmoothingEnabled = false;
      return { devW, devH, cssW, cssH };
    }

    function clientToDevPt(ev) {
      const rect = screenDiv.getBoundingClientRect();
      const borderL = screenDiv.clientLeft || 0;
      const borderT = screenDiv.clientTop || 0;
      const innerW = screenDiv.clientWidth || rect.width || 1;
      const innerH = screenDiv.clientHeight || rect.height || 1;
      const relX = (ev.clientX - rect.left - borderL) / innerW;
      const relY = (ev.clientY - rect.top - borderT) / innerH;
      if (relX < 0 || relY < 0 || relX > 1 || relY > 1) return { dx: -1, dy: -1 };
      return { dx: relX * c.width, dy: relY * c.height };
    }

    // Capture pointerdown on `#screen` for `[◉ CAM]`, `[DAT-307]`, and all DAT-307 buttons
    screenDiv.addEventListener(
      "pointerdown",
      (ev) => {
        if (
          (ev.target && ev.target.id === "hardcore-claude-signin-canvas") ||
          (global.RealTabComputerBridge &&
            global.RealTabComputerBridge.state &&
            global.RealTabComputerBridge.state.modalOpen)
        ) {
          return;
        }
        const pt = clientToDevPt(ev);
        if (pt.dx < 0 || pt.dy < 0) return;

        // 1. Check top-right `[◉ CAM]` and `[DAT-307]` hardware buttons
        for (let i = 0; i < datPuterState.topHudHitBoxes.length; i++) {
          const hb = datPuterState.topHudHitBoxes[i];
          if (pt.dx >= hb.x && pt.dx <= hb.x + hb.w && pt.dy >= hb.y && pt.dy <= hb.y + hb.h) {
            ev.stopPropagation();
            ev.preventDefault();
            if (hb.action === "toggle-cam") {
              toggleWebcamOracle();
            } else if (hb.action === "toggle-dat") {
              toggleDatPuter();
            }
            return;
          }
        }

        // 2. When DAT-307 is open, handle its microlaser & E-Ink buttons
        if (!datPuterState.open) return;
        for (let i = 0; i < datPuterState.hitBoxes.length; i++) {
          const hb = datPuterState.hitBoxes[i];
          if (pt.dx >= hb.x && pt.dx <= hb.x + hb.w && pt.dy >= hb.y && pt.dy <= hb.y + hb.h) {
            ev.stopPropagation();
            ev.preventDefault();
            if (hb.action === "close-dat") {
              datPuterState.open = false;
              if (global.SlopesAudio && global.SlopesAudio.playClick) global.SlopesAudio.playClick(false);
            } else if (hb.action === "select-section") {
              datPuterState.sectionIdx = hb.sectionIdx;
              datPuterState.pageIdx = 0;
              triggerDatPuterEinkRefresh(hb.sectionIdx);
            } else if (hb.action === "prev-page") {
              if (DAT_SECTIONS[datPuterState.sectionIdx].id === "pdfs") {
                datPuterState.selectedFolioIdx =
                  (datPuterState.selectedFolioIdx - 1 + PDF_EINK_FOLIOS.length) % PDF_EINK_FOLIOS.length;
              } else {
                datPuterState.pageIdx--;
              }
              triggerDatPuterEinkRefresh(datPuterState.pageIdx);
            } else if (hb.action === "next-page") {
              if (DAT_SECTIONS[datPuterState.sectionIdx].id === "pdfs") {
                datPuterState.selectedFolioIdx =
                  (datPuterState.selectedFolioIdx + 1) % PDF_EINK_FOLIOS.length;
              } else {
                datPuterState.pageIdx++;
              }
              triggerDatPuterEinkRefresh(datPuterState.pageIdx);
            } else if (hb.action === "select-folio") {
              datPuterState.selectedFolioIdx = hb.folioIdx;
              datPuterState.pageIdx = 0;
              const fol = PDF_EINK_FOLIOS[hb.folioIdx];
              if (fol) civState.alignment[fol.id] = (civState.alignment[fol.id] || 20) + 8;
              triggerDatPuterEinkRefresh(hb.folioIdx);
            } else if (hb.action === "toggle-pdf-doc-mode") {
              datPuterState.pdfDocMode = datPuterState.pdfDocMode === "paper" ? "folio" : "paper";
              triggerDatPuterEinkRefresh(datPuterState.selectedFolioIdx);
            } else if (hb.action === "open-raw-pdf" && hb.url) {
              window.open(hb.url, "_blank", "noopener");
            } else if (hb.action === "set-simspeed") {
              setSimSpeed(hb.speed, `DAT-307 CHRONOS (${hb.speed.toLocaleString()}x)`);
              triggerDatPuterEinkRefresh(1);
            } else if (hb.action === "dump-lava") {
              const lavaPit = civState.wasteSites.find((w) => w.kind === "LAVA_INCINERATOR");
              const landfill = civState.wasteSites.find((w) => w.kind === "LANDFILL_MOUND");
              const blocks = (global.SlopesGame && global.SlopesGame.state && global.SlopesGame.state.blocks) || null;
              if (landfill) landfill.trashLoad = Math.max(0, landfill.trashLoad - 8);
              dumpTrashIntoLava(lavaPit, 8, "scrap-trash", blocks);
              triggerDatPuterEinkRefresh(2);
            } else if (hb.action === "recycle-scrap") {
              const recycler = civState.wasteSites.find((w) => w.kind === "RECYCLING_PLANT");
              const landfill = civState.wasteSites.find((w) => w.kind === "LANDFILL_MOUND");
              recycleWasteBatch(recycler, landfill, 8);
              if (civState.megastructures[0]) {
                civState.megastructures[0].buildProgress = Math.min(2.4, civState.megastructures[0].buildProgress + 0.18);
              }
              triggerDatPuterEinkRefresh(3);
            } else if (hb.action === "zoom-in") {
              zoomInAt(zoomState.lastHoverX || 420, zoomState.lastHoverY || 310);
              triggerDatPuterEinkRefresh(4);
            } else if (hb.action === "zoom-out") {
              zoomOutAt(zoomState.lastHoverX || 420, zoomState.lastHoverY || 310);
              triggerDatPuterEinkRefresh(5);
            } else if (hb.action === "cycle-music-mode") {
              if (global.SlopesAudio) {
                global.SlopesAudio.unlock();
                if (typeof global.SlopesAudio.cycleModality === "function") {
                  global.SlopesAudio.cycleModality();
                }
              }
              triggerDatPuterEinkRefresh(6);
            } else if (hb.action === "hold-palm-convergence") {
              if (global.SlopesGame && global.SlopesGame.action) {
                global.SlopesGame.action("rotR");
              }
              triggerDatPuterEinkRefresh(7);
            }
            return;
          }
        }
      },
      true // capture phase so top-right HUD & open DAT-307 receive clicks cleanly
    );

    // Wire Mouse Wheel, Double-Click, and Keyboard shortcuts (`B`/`P` for DAT-307, `O` for closed-eye Plath, `M` for smiling crow swarm)
    if (!screenDiv.__recursiveZoomBound) {
      screenDiv.__recursiveZoomBound = true;
      const getScreenNativePt = (ev) => {
        const rect = screenDiv.getBoundingClientRect();
        if (!rect.width || !rect.height) return { x: 420, y: 310 };
        const x = ((ev.clientX - rect.left) / rect.width) * NATIVE_W;
        const y = ((ev.clientY - rect.top) / rect.height) * NATIVE_H;
        zoomState.lastHoverX = Math.max(48, Math.min(NATIVE_W - 48, x));
        zoomState.lastHoverY = Math.max(48, Math.min(NATIVE_H - 48, y));
        return { x: zoomState.lastHoverX, y: zoomState.lastHoverY };
      };

      screenDiv.addEventListener("mousemove", (ev) => getScreenNativePt(ev), { passive: true });

      let lastWheelMs = 0;
      screenDiv.addEventListener(
        "wheel",
        (ev) => {
          if (global.SlopesTabForms && global.SlopesTabForms.state && global.SlopesTabForms.state.terminalOpen) return;
          if (datPuterState.open) {
            ev.preventDefault();
            const now = Date.now();
            if (now - lastWheelMs < 160) return;
            lastWheelMs = now;
            if (ev.deltaY > 0) datPuterState.pageIdx++;
            else if (ev.deltaY < 0) datPuterState.pageIdx--;
            triggerDatPuterEinkRefresh(datPuterState.pageIdx);
            return;
          }
          ev.preventDefault();
          const now = Date.now();
          if (now - lastWheelMs < 130) return;
          lastWheelMs = now;
          const pt = getScreenNativePt(ev);
          if (ev.deltaY < 0) zoomInAt(pt.x, pt.y);
          else if (ev.deltaY > 0) zoomOutAt(pt.x, pt.y);
        },
        { passive: false }
      );

      screenDiv.addEventListener("dblclick", (ev) => {
        if (global.SlopesTabForms && global.SlopesTabForms.state && global.SlopesTabForms.state.terminalOpen) return;
        if (datPuterState.open) return;
        const pt = getScreenNativePt(ev);
        zoomInAt(pt.x, pt.y);
      });
    }

    window.addEventListener("keydown", (ev) => {
      if (ev.target && (ev.target.tagName === "INPUT" || ev.target.tagName === "TEXTAREA")) return;
      const termOpen = global.SlopesTabForms && global.SlopesTabForms.state && global.SlopesTabForms.state.terminalOpen;
      if (termOpen) return;

      if (datPuterState.open) {
        if (ev.key === "Escape" || ev.key === "b" || ev.key === "B" || ev.key === "p" || ev.key === "P") {
          ev.preventDefault();
          datPuterState.open = false;
          if (global.SlopesAudio && global.SlopesAudio.playClick) global.SlopesAudio.playClick(false);
          return;
        }
        if (ev.key === "ArrowLeft" || ev.key === "[") {
          ev.preventDefault();
          if (DAT_SECTIONS[datPuterState.sectionIdx].id === "pdfs") {
            datPuterState.selectedFolioIdx =
              (datPuterState.selectedFolioIdx - 1 + PDF_EINK_FOLIOS.length) % PDF_EINK_FOLIOS.length;
          } else {
            datPuterState.pageIdx--;
          }
          triggerDatPuterEinkRefresh(datPuterState.pageIdx);
          return;
        }
        if (ev.key === "ArrowRight" || ev.key === "]") {
          ev.preventDefault();
          if (DAT_SECTIONS[datPuterState.sectionIdx].id === "pdfs") {
            datPuterState.selectedFolioIdx =
              (datPuterState.selectedFolioIdx + 1) % PDF_EINK_FOLIOS.length;
          } else {
            datPuterState.pageIdx++;
          }
          triggerDatPuterEinkRefresh(datPuterState.pageIdx);
          return;
        }
        if (ev.key >= "1" && ev.key <= "4") {
          ev.preventDefault();
          datPuterState.sectionIdx = parseInt(ev.key, 10) - 1;
          datPuterState.pageIdx = 0;
          triggerDatPuterEinkRefresh(datPuterState.sectionIdx);
          return;
        }
      } else {
        if ((ev.key === "b" || ev.key === "B" || ev.key === "p" || ev.key === "P") && !ev.metaKey && !ev.ctrlKey) {
          ev.preventDefault();
          toggleDatPuter();
          return;
        }
      }

      // Keyboard shortcuts for Webcam Oracle testing & accessibility:
      // `O` toggles closed-eye Sylvia Plath layer + soul-guiding solo melody
      // `M` triggers a smiling loving crow swarm (`SlopesAudio.playLovingCrowSwarm()`)
      if ((ev.key === "o" || ev.key === "O") && !ev.metaKey && !ev.ctrlKey) {
        ev.preventDefault();
        webcamState.manualEyesClosed = !webcamState.manualEyesClosed;
        setEyesClosedInternal(webcamState.manualEyesClosed);
        return;
      }
      if ((ev.key === "m" || ev.key === "M") && !ev.metaKey && !ev.ctrlKey) {
        ev.preventDefault();
        triggerSmileCrowSwarm();
        return;
      }

      if ((ev.key === "=" || ev.key === "+") && !ev.metaKey && !ev.ctrlKey) {
        ev.preventDefault();
        zoomInAt(zoomState.lastHoverX || 420, zoomState.lastHoverY || 310);
      } else if ((ev.key === "-" || ev.key === "_") && !ev.metaKey && !ev.ctrlKey) {
        ev.preventDefault();
        zoomOutAt(zoomState.lastHoverX || 420, zoomState.lastHoverY || 310);
      }
    });

    function datLoop() {
      requestAnimationFrame(datLoop);
      const { devW, devH } = syncSize();
      datPuterState.ctx.clearRect(0, 0, devW, devH);
      renderWebcamAndDatPuterOverlay(datPuterState.ctx, devW, devH);
    }
    requestAnimationFrame(datLoop);
  }

  function bootAll() {
    attachToSlopesGame();
    mountDatPuterAndWebcamCanvas();
  }

  if (typeof window !== "undefined" && typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => setTimeout(bootAll, 10));
    } else {
      setTimeout(bootAll, 10);
    }
  }

  const ChronosAndCivAPI = {
    LORE_ARTIFACTS,
    PDF_EINK_FOLIOS,
    SPEED_TIERS,
    DYNAMICAL_ERAS,
    ZOOM_LAYER_NAMES,
    civState,
    zoomState,
    webcamState,
    datPuterState,
    setSimSpeed,
    cycleSimSpeed,
    zoomInAt,
    zoomOutAt,
    resetZoom,
    getZoomDepth: () => zoomState.depth,
    dumpTrashIntoLava,
    recycleWasteBatch,
    runMacroEpochEvolution,
    renderMegastructuresAndEconomy,
    openArtifactModal,
    openDatPuter,
    toggleDatPuter,
    toggleWebcamOracle,
    triggerSmileCrowSwarm,
    setClosedEyeManual(closed) {
      webcamState.manualEyesClosed = !!closed;
      setEyesClosedInternal(webcamState.manualEyesClosed);
    },
  };

  global.SlopesChronosAndCiv = ChronosAndCivAPI;
  global.SlopesLorePortalDock = ChronosAndCivAPI;
  global.SlopesDatPuter = {
    state: datPuterState,
    open: openDatPuter,
    toggle: toggleDatPuter,
    FOLIOS: PDF_EINK_FOLIOS,
  };
  global.SlopesWebcamOracle = {
    state: webcamState,
    toggleWebcam: toggleWebcamOracle,
    triggerSmileCrowSwarm,
    setEyesClosed: setEyesClosedInternal,
  };
  global.SlopesRecursiveZoom = {
    zoomState,
    zoomInAt,
    zoomOutAt,
    resetZoom,
    getZoomDepth: () => zoomState.depth,
    ZOOM_LAYER_NAMES,
  };
  global.__loreDockEvalInScope = (code) => eval(code);
  if (typeof module !== "undefined" && module.exports) {
    module.exports = ChronosAndCivAPI;
  }
})(typeof window !== "undefined" ? window : globalThis);
