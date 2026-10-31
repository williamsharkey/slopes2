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

  function scrollCivWorldBy(deltaCols) {
    if (!deltaCols) return;
    const shiftX = -deltaCols;
    const wrapRange = COARSE_W + 56;
    const minX = -28;
    const wrapCoord = (val) => {
      let v = val + shiftX;
      while (v < minX) v += wrapRange;
      while (v >= minX + wrapRange) v -= wrapRange;
      return v;
    };
    for (let i = 0; i < civState.megastructures.length; i++) {
      civState.megastructures[i].x = wrapCoord(civState.megastructures[i].x);
    }
    for (let i = 0; i < civState.factories.length; i++) {
      civState.factories[i].x = wrapCoord(civState.factories[i].x);
    }
    for (let i = 0; i < civState.wasteSites.length; i++) {
      civState.wasteSites[i].x = wrapCoord(civState.wasteSites[i].x);
    }
    for (let i = 0; i < civState.abandonedLoot.length; i++) {
      civState.abandonedLoot[i].x = wrapCoord(civState.abandonedLoot[i].x);
    }
    for (let i = 0; i < civState.actors.length; i++) {
      civState.actors[i].x = wrapCoord(civState.actors[i].x);
      if (typeof civState.actors[i].targetX === "number") {
        civState.actors[i].targetX = wrapCoord(civState.actors[i].targetX);
      }
    }
    for (let i = 0; i < civState.lavaSparks.length; i++) {
      civState.lavaSparks[i].x += shiftX;
    }
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
      const halfSpanPx = Math.round((m.span * SCALE) / 2);
      const trueCenterPx = centerPx(m.x);
      const trueLeftPx = trueCenterPx - halfSpanPx;
      const trueRightPx = trueCenterPx + halfSpanPx;
      if (trueRightPx < 0 || trueLeftPx >= NATIVE_W) continue;

      const centerCol = Math.max(0, Math.min(COARSE_W - 1, Math.round(m.x)));
      const baseElev = blocks[centerCol] || 18;
      const basePy = Math.round((COARSE_H - baseElev) * SCALE);
      const heightPx = Math.round(m.height * SCALE * Math.min(1.25, 0.45 + m.buildProgress * 0.55));
      const trueWidthPx = Math.max(20, trueRightPx - trueLeftPx);
      const leftPx = Math.max(0, trueLeftPx);
      const rightPx = Math.min(NATIVE_W - 1, trueRightPx);
      const widthPx = trueWidthPx;

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
          const u = ((px - trueLeftPx) / Math.max(1, trueWidthPx)) * 2 - 1; // -1 .. +1
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
            if ((px - trueLeftPx) % ribStep === 0) {
              primeRenderer.fillNativeRect(px, domeTopPy, 1, Math.max(1, localGroundPy - domeTopPy), frameRgb[0], frameRgb[1], frameRgb[2], isAbandoned ? 0.35 : 0.55);
            }
            // Internal Hydroponic Crop Terraces & Bioshelter Trees inside the Glass Dome!
            if (!isAbandoned && (px - trueLeftPx) % 7 === 2 && archRise > 14) {
              const cropH = 3 + Math.round(m.cropDensity * 5);
              primeRenderer.fillNativeRect(px, localGroundPy - cropH, 3, cropH, 95, 225, 115, 0.9);
              primeRenderer.fillNativeRect(px + 1, localGroundPy - cropH - 2, 2, 2, 255, 215, 85, 0.95);
            }
          }
        }

        // Secondary Upper Cupola Tier if evolved (`tierCount >= 2`)
        if (m.tierCount >= 2 && !isAbandoned) {
          const cupW = Math.round(trueWidthPx * 0.36);
          const cupX = trueLeftPx + Math.round((trueWidthPx - cupW) / 2);
          const cupTop = Math.max(12, basePy - heightPx - 12);
          primeRenderer.fillNativeRect(cupX, cupTop, cupW, 10, glassR, glassG, glassB, 0.24);
          primeRenderer.fillNativeRect(cupX, cupTop, cupW, 1, 255, 215, 90, 0.95);
          primeRenderer.fillNativeRect(cupX + Math.floor(cupW / 2) - 1, cupTop - 6, 2, 6, 120, 255, 235, 0.95);
        }
      } else if (m.archType === "MYCELIAL_ARCOLOGY") {
        // 2. Cervus Bioluminescent Mycelial-Crystal Canopy Cathedral
        for (let px = leftPx; px <= rightPx; px += 2) {
          const u = ((px - trueLeftPx) / Math.max(1, trueWidthPx)) * 2 - 1;
          const colIdx = Math.max(0, Math.min(COARSE_W - 1, Math.floor(px / SCALE)));
          const localGroundPy = Math.round((COARSE_H - (blocks[colIdx] || baseElev)) * SCALE);
          const canopyH = Math.round(heightPx * (0.6 + 0.4 * Math.cos(u * Math.PI)));
          const topPy = Math.max(18, localGroundPy - canopyH);
          // Organic fungal-crystal pillars & glowing canopy membrane
          primeRenderer.fillNativeRect(px, topPy, 2, 3, 82, 245, 185, 0.92);
          if ((px - trueLeftPx) % 10 === 0) {
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
      if (fac.x < -4 || fac.x > COARSE_W + 4) continue;
      const fx = centerPx(fac.x);
      const col = Math.max(0, Math.min(COARSE_W - 1, Math.round(fac.x)));
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
      if (ws.x < -4 || ws.x > COARSE_W + 4) continue;
      const wx = centerPx(ws.x);
      const col = Math.max(0, Math.min(COARSE_W - 1, Math.round(ws.x)));
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
  const WIDE_ZOOM_NAMES = {
    "-1": "-1 WIDE PANORAMA (0.72x)",
    "-2": "-2 MULTI-SECTOR HORIZON (0.50x)",
  };

  const zoomState = {
    depth: 0,           // -2..4 (positive depths 1..4 wrap on 5th zoom to 0; negative depths -1..-2 zoom out wide!)
    totalZoomClicks: 0, // Cumulative zoom steps
    continuousZoom: 0,  // Smoothly interpolated float (-2..5)
    targetZoom: 0,      // Target float
    focusX: 504,        // Target native X (0..1008)
    focusY: 315,        // Target native Y (0..630)
    lastHoverX: 504,
    lastHoverY: 315,
    animTick: 0,
    bgRgb: [42, 161, 152],
    bgSampleTick: -9999,
    snapCanvas: null,
    snapCtx: null,
    hiResImgData: null,
    colWorldX: null,
    colSurfNativeY: null,
    colSurfZoomY: null,
    colFarRidgeY: null,
    colMistTopY: null,
    colMistBotY: null,
    colFoothillY: null,
    colLightWarm: null,
    colLightCyan: null,
  };

  // Ordered 8x8 Bayer threshold matrix (0..1) for 1:1 device-pixel multi-parallax moiré dither screens
  const ZOOM_BAYER8 = (function buildZoomBayer8() {
    let m = [0];
    let n = 1;
    while (n < 8) {
      const nn = n * 2;
      const next = new Array(nn * nn);
      for (let y = 0; y < nn; y++) {
        for (let x = 0; x < nn; x++) {
          const v = m[(y % n) * n + (x % n)];
          const q = x < n ? (y < n ? 0 : 3) : y < n ? 2 : 1;
          next[y * nn + x] = 4 * v + q;
        }
      }
      m = next;
      n = nn;
    }
    const out = new Float32Array(64);
    for (let i = 0; i < 64; i++) out[i] = (m[i] + 0.5) / 64;
    return out;
  })();

  // Monolith circuit trace polylines in 11x42 local coords (plus sub-branches revealed at high zoom)
  const MONO_GOLD_TRACES = [
    [[2, 8], [2, 10], [5, 10], [5, 11]],
    [[8, 26], [8, 29], [4, 29], [4, 33], [6, 33]],
    [[2, 35], [2, 38], [7, 38]],
  ];
  const MONO_CYAN_TRACES = [
    [[8, 7], [8, 9], [6, 9]],
    [[2, 26], [2, 31], [3, 31]],
    [[8, 31], [8, 36], [5, 36]],
  ];

  function zoomValNoise1D(u, seed) {
    const i = Math.floor(u);
    const f = u - i;
    const s = f * f * (3 - 2 * f);
    const k = Math.imul(seed | 0, 668265263);
    const a = (hash32((Math.imul(i, 374761393) + k) | 0) >>> 0) / 4294967296;
    const b = (hash32((Math.imul(i + 1, 374761393) + k) | 0) >>> 0) / 4294967296;
    return a + (b - a) * s;
  }

  function ensureZoomScratchCanvas(mainCtx) {
    if (!zoomState.snapCanvas && typeof document !== "undefined") {
      const c = document.createElement("canvas");
      c.width = NATIVE_W;
      c.height = NATIVE_H;
      zoomState.snapCanvas = c;
      zoomState.snapCtx = c.getContext("2d");
      if (zoomState.snapCtx) zoomState.snapCtx.imageSmoothingEnabled = false;
    }
    if (!zoomState.hiResImgData && mainCtx) {
      zoomState.hiResImgData = mainCtx.createImageData(NATIVE_W, NATIVE_H);
      zoomState.colWorldX = new Float32Array(NATIVE_W);
      zoomState.colSurfNativeY = new Float32Array(NATIVE_W);
      zoomState.colSurfZoomY = new Float32Array(NATIVE_W);
      zoomState.colFarRidgeY = new Float32Array(NATIVE_W);
      zoomState.colMistTopY = new Float32Array(NATIVE_W);
      zoomState.colMistBotY = new Float32Array(NATIVE_W);
      zoomState.colFoothillY = new Float32Array(NATIVE_W);
      zoomState.colLightWarm = new Float32Array(NATIVE_W);
      zoomState.colLightCyan = new Float32Array(NATIVE_W);
    }
    return zoomState.snapCtx;
  }

  function zoomInAt(nativeX, nativeY) {
    if (typeof nativeX === "number" && !isNaN(nativeX)) {
      zoomState.focusX = Math.max(16, Math.min(NATIVE_W - 16, Math.round(nativeX)));
      zoomState.customFocusFrames = 90;
    } else {
      zoomState.customFocusFrames = 0;
    }
    if (typeof nativeY === "number" && !isNaN(nativeY)) {
      zoomState.focusY = Math.max(16, Math.min(NATIVE_H - 16, Math.round(nativeY)));
    }
    zoomState.totalZoomClicks++;
    // Unwrapped monotonic zoom step (+1) on the cyclic 5-step holonomic loop:
    // Zooming in 0 -> 1 -> 2 -> 3 -> 4 -> 5 zooms continuously INTO the 2x1 gear-room screen
    // until at 5 (≡ 0 mod 5) that new screen fills 1008x630 and you are already back at origin!
    zoomState.targetZoom = Math.round(zoomState.targetZoom) + 1;
    zoomState.depth = ((zoomState.targetZoom % 5) + 5) % 5;

    if (global.SlopesAudio && typeof global.SlopesAudio.playPortalShift === "function") {
      global.SlopesAudio.playPortalShift(zoomState.depth !== 0);
    }
    updateChronosDomUI();
    return zoomState.depth;
  }

  function zoomOutAt(nativeX, nativeY) {
    if (typeof nativeX === "number" && !isNaN(nativeX)) {
      zoomState.focusX = Math.max(16, Math.min(NATIVE_W - 16, Math.round(nativeX)));
      zoomState.customFocusFrames = 90;
    } else {
      zoomState.customFocusFrames = 0;
    }
    if (typeof nativeY === "number" && !isNaN(nativeY)) {
      zoomState.focusY = Math.max(16, Math.min(NATIVE_H - 16, Math.round(nativeY)));
    }
    zoomState.totalZoomClicks++;
    // Unwrapped monotonic zoom-out step (-1) on the cyclic 5-step holonomic loop:
    // Zooming out from 0 (≡ 5 mod 5) -> 4 -> 3 -> 2 -> 1 -> 0 shrinks the current screen
    // into the 2x1 gear-room slot of the outer Monolith until at 0 you are back at origin!
    zoomState.targetZoom = Math.round(zoomState.targetZoom) - 1;
    zoomState.depth = ((zoomState.targetZoom % 5) + 5) % 5;

    if (global.SlopesAudio && typeof global.SlopesAudio.playPortalShift === "function") {
      global.SlopesAudio.playPortalShift(false);
    }
    updateChronosDomUI();
    return zoomState.depth;
  }

  function resetZoom() {
    // Snap to the nearest multiple of 5 so reset never winds backward across multiple layers
    const nearestOrigin = Math.round(zoomState.continuousZoom / 5) * 5;
    zoomState.targetZoom = nearestOrigin;
    zoomState.continuousZoom = nearestOrigin;
    zoomState.depth = 0;
    zoomState.customFocusFrames = 0;
    updateChronosDomUI();
  }

  function stepAndRenderRecursiveZoom(primeRenderer, world) {
    // Smoothly interpolate continuousZoom toward targetZoom along the unbounded real line
    const diff = zoomState.targetZoom - zoomState.continuousZoom;
    if (Math.abs(diff) > 0.0015) {
      zoomState.continuousZoom += diff * 0.18;
    } else {
      zoomState.continuousZoom = zoomState.targetZoom;
    }

    // Cyclic modulo-5 zoom phase in [0, 5):
    // Travelling ONLY IN (0 -> 1 -> 2 -> 3 -> 4 -> 5 ≡ 0) or ONLY OUT (0 ≡ 5 -> 4 -> 3 -> 2 -> 1 -> 0)
    // both traverse the full recursive Monolith loop and land seamlessly back at origin!
    const zMod = ((zoomState.continuousZoom % 5) + 5) % 5;

    // Continuously track the exact 2x1 pixel Gear-Room Mechanism Slot (`dx=4..6, dy=18..19`)
    // inside the Player Monolith (`TACHIMA-307`)!
    let slotX = NATIVE_W * 0.5 - 1;
    let slotY = NATIVE_H * 0.5;
    if (world && world.P) {
      const pcx = Math.round(world.P.x);
      const pyTop = COARSE_H - Math.round(world.P.y) - 6;
      const monoX0 = pcx * SCALE - 2;
      const monoY0 = pyTop * SCALE;
      slotX = monoX0 + 4;
      slotY = monoY0 + 18;
      zoomState.focusX = slotX + 1.0;
      zoomState.focusY = slotY + 0.5;
      zoomState.monoX0 = monoX0;
      zoomState.monoY0 = monoY0;
    }

    // At exact 1x macro origin (zMod ≈ 0 or zMod ≈ 5 when settled), the 2x1 slot already fills 1008x630 1:1!
    if ((zMod < 0.002 || zMod > 4.998) && Math.abs(diff) <= 0.0015) return;

    const mainCanvas = typeof document !== "undefined" ? document.getElementById("pi-shift") : null;
    const mainCtx = mainCanvas ? mainCanvas.getContext("2d") : null;
    const scratchCtx = ensureZoomScratchCanvas(mainCtx);
    if (!mainCanvas || !mainCtx || !scratchCtx) return;

    zoomState.animTick = ((zoomState.animTick || 0) + 1) & 0x7fffffff;
    const tick = ((world && typeof world.frameCount === "number" ? world.frameCount : 0) + zoomState.animTick) | 0;

    // Sample live CSS harmonic sky color every 30 ticks so zoomed palettes match the active Raga scale
    if (tick - zoomState.bgSampleTick >= 30 || tick < zoomState.bgSampleTick) {
      zoomState.bgSampleTick = tick;
      if (typeof getComputedStyle === "function") {
        const m = /(\d+(?:\.\d+)?)\D+(\d+(?:\.\d+)?)\D+(\d+(?:\.\d+)?)/.exec(
          getComputedStyle(mainCanvas).backgroundColor || ""
        );
        if (m) {
          zoomState.bgRgb[0] = +m[1];
          zoomState.bgRgb[1] = +m[2];
          zoomState.bgRgb[2] = +m[3];
        }
      }
    }
    const bgR = zoomState.bgRgb[0];
    const bgG = zoomState.bgRgb[1];
    const bgB = zoomState.bgRgb[2];

    // 5 Coprime Prime-Period Meshing Color Cycles (P1=211, P2=307, P3=499, P4=757, P5=1103 ticks; LCM > 26.9 trillion!)
    const TAU = Math.PI * 2;
    const p211 = Math.sin((tick * TAU) / 211);   // Aether-cyan shimmer cycle
    const p307 = Math.sin((tick * TAU) / 307);   // Brass-gold specular glint cycle
    const p499 = Math.sin((tick * TAU) / 499);   // Sage-emerald bioluminescence cycle
    const p757 = Math.sin((tick * TAU) / 757);   // Warm terracotta-hearth ember cycle
    const p1103 = Math.sin((tick * TAU) / 1103); // Deep violet-mauve harmonic cycle

    // Copy the unzoomed macro frame into scratchCanvas WITH opaque sky background!
    // (`mainCanvas` has alpha=0 sky pixels because the sky color comes from CSS background-color;
    // filling `rgb(bgR, bgG, bgB)` first prevents transparent sky holes from showing gear-room moiré!)
    scratchCtx.fillStyle = `rgb(${bgR}, ${bgG}, ${bgB})`;
    scratchCtx.fillRect(0, 0, NATIVE_W, NATIVE_H);
    scratchCtx.drawImage(mainCanvas, 0, 0);

    // Exact homothety anchoring the 2x1 Gear-Room slot `[slotX..slotX+2, slotY..slotY+1]` to `[0..NATIVE_W, 0..NATIVE_H]`:
    // - At zMod = 0: magX = 1, magY = 1 -> srcW = 1008, srcH = 630, sx = 0, sy = 0.
    // - At zMod = 5: magX = 504, magY = 630 -> srcW = 2, srcH = 1, sx = slotX, sy = slotY,
    //   so `rectZ(4, 18, 2, 1)` expands directly into `(0, 0, 1008, 630)` and you are already back at origin!
    const magX = Math.pow(NATIVE_W / 2, zMod / 5.0);
    const magY = Math.pow(NATIVE_H / 1, zMod / 5.0);
    const mag = Math.sqrt(magX * magY);
    const srcW = NATIVE_W / magX;
    const srcH = NATIVE_H / magY;
    const u0 = Math.max(0, Math.min(1, slotX / (NATIVE_W - 2)));
    const v0 = Math.max(0, Math.min(1, slotY / (NATIVE_H - 1)));
    const sx = u0 * (NATIVE_W - srcW);
    const sy = v0 * (NATIVE_H - srcH);

    // Helper to project unzoomed native coordinates (nx, ny) into zoomed screen coordinates
    const toZoomX = (nx) => (nx - sx) * magX;
    const toZoomY = (ny) => (ny - sy) * magY;

    const eco = (global.SlopesGame && global.SlopesGame.ecologySystem && global.SlopesGame.ecologySystem.eco) || null;
    const cosmic = (global.SlopesGame && global.SlopesGame.cosmicSystem && global.SlopesGame.cosmicSystem.cosmic) || null;
    const blocks = (world && world.Blocks) || null;
    const snapRaw = (primeRenderer && primeRenderer.data) || null;

    mainCtx.save();
    mainCtx.imageSmoothingEnabled = false;

    if (!blocks || !zoomState.hiResImgData) {
      mainCtx.clearRect(0, 0, NATIVE_W, NATIVE_H);
      mainCtx.drawImage(zoomState.snapCanvas, sx, sy, srcW, srcH, 0, 0, NATIVE_W, NATIVE_H);
      mainCtx.restore();
      return;
    }

    // =========================================================================
    // 1. CONTINUOUS CATMULL-ROM TERRAIN SPLINE, PARALLAX HORIZON CURVES &
    //    ADJACENT-OBJECT LIGHT FIELD PRECOMPUTATION (1008 DEVICE PIXEL COLUMNS)
    // =========================================================================
    const colWorldX = zoomState.colWorldX;
    const colSurfNativeY = zoomState.colSurfNativeY;
    const colSurfZoomY = zoomState.colSurfZoomY;
    const colFarRidgeY = zoomState.colFarRidgeY;
    const colMistTopY = zoomState.colMistTopY;
    const colMistBotY = zoomState.colMistBotY;
    const colFoothillY = zoomState.colFoothillY;
    const colLightWarm = zoomState.colLightWarm;
    const colLightCyan = zoomState.colLightCyan;

    const seaLevel = (world && world.seaLevel) || 12;
    const seaNativeY = (COARSE_H - seaLevel) * SCALE;
    const seaZoomY = toZoomY(seaNativeY);
    const worldScroll = ((world && world.worldX) || 0) * NATIVE_W;

    // Smooth Catmull-Rom spline evaluator across coarse terrain columns `blocks[c]`
    const sampleSmoothElev = (coarseF) => {
      const c1 = Math.floor(coarseF);
      const t = coarseF - c1;
      const idx0 = Math.max(0, Math.min(COARSE_W - 1, c1 - 1));
      const idx1 = Math.max(0, Math.min(COARSE_W - 1, c1));
      const idx2 = Math.max(0, Math.min(COARSE_W - 1, c1 + 1));
      const idx3 = Math.max(0, Math.min(COARSE_W - 1, c1 + 2));
      const h0 = blocks[idx0] || 0;
      const h1 = blocks[idx1] || 0;
      const h2 = blocks[idx2] || 0;
      const h3 = blocks[idx3] || 0;
      const t2 = t * t;
      const t3 = t2 * t;
      const catmull =
        0.5 *
        (2 * h1 +
          (-h0 + h2) * t +
          (2 * h0 - 5 * h1 + 4 * h2 - h3) * t2 +
          (-h0 + 3 * h1 - 3 * h2 + h3) * t3);
      // Add fine 1px micro-topographic rock relief so zoomed ridges have natural crags instead of flat lines
      const micro = (zoomValNoise1D(coarseF * 6.5, 19) - 0.5) * 0.28 + (zoomValNoise1D(coarseF * 23.0, 73) - 0.5) * 0.09;
      return Math.max(0, catmull + micro);
    };

    for (let px = 0; px < NATIVE_W; px++) {
      const wx = sx + px / magX;
      colWorldX[px] = wx;
      const coarseF = wx / SCALE - 0.5;
      const elev = sampleSmoothElev(coarseF);
      const surfNY = (COARSE_H - elev) * SCALE;
      colSurfNativeY[px] = surfNY;
      colSurfZoomY[px] = toZoomY(surfNY);

      // Multi-depth parallax horizon curves in zoomed device space:
      // Depth 0.08x: Far mountain ridge
      const uFar = (wx + worldScroll) * 0.08;
      const farNY =
        NATIVE_H * 0.26 +
        zoomValNoise1D(uFar * 0.011, 11) * NATIVE_H * 0.19 +
        zoomValNoise1D(uFar * 0.031, 29) * NATIVE_H * 0.07 +
        Math.abs(zoomValNoise1D(uFar * 0.075, 53) - 0.5) * NATIVE_H * 0.05;
      colFarRidgeY[px] = toZoomY(farNY);

      // Depth 0.22x: Mid-distant cloud / mist veil
      const uMist = (wx + worldScroll) * 0.22 + tick * 0.09;
      const mistCenterNY = NATIVE_H * 0.34 + zoomValNoise1D(uMist * 0.014, 101) * NATIVE_H * 0.14;
      const mistHalfNY = 22 + zoomValNoise1D(uMist * 0.029, 137) * 28;
      colMistTopY[px] = toZoomY(mistCenterNY - mistHalfNY);
      colMistBotY[px] = toZoomY(mistCenterNY + mistHalfNY);

      // Depth 0.48x: Foothills & ancient ruin silhouettes
      const uFoot = (wx + worldScroll) * 0.48;
      const footNY =
        NATIVE_H * 0.46 +
        zoomValNoise1D(uFoot * 0.017, 173) * NATIVE_H * 0.16 +
        zoomValNoise1D(uFoot * 0.051, 211) * NATIVE_H * 0.06;
      colFoothillY[px] = toZoomY(footNY);

      colLightWarm[px] = 0;
      colLightCyan[px] = 0;
    }

    // Accumulate adjacent-object illumination (Town hearths/braziers, Dwarf forges, Crystals, TimeCrystals, Vats, Lava)
    const addLightSource = (arr, nativeX, radiusNative, strength) => {
      const zCx = toZoomX(nativeX);
      const zRad = radiusNative * magX;
      if (zCx + zRad < 0 || zCx - zRad >= NATIVE_W || zRad < 1) return;
      const x0 = Math.max(0, Math.floor(zCx - zRad));
      const x1 = Math.min(NATIVE_W - 1, Math.ceil(zCx + zRad));
      const invR = 1 / zRad;
      for (let x = x0; x <= x1; x++) {
        const u = 1 - Math.abs(x - zCx) * invR;
        if (u > 0) arr[x] = Math.min(1.5, arr[x] + u * u * strength);
      }
    };

    const warmPulse = 0.82 + 0.12 * p307 + 0.06 * p757;
    const cyanPulse = 0.82 + 0.12 * p211 + 0.06 * p499;
    if (Array.isArray(world.Towns)) {
      for (let i = 0; i < world.Towns.length; i++) {
        addLightSource(colLightWarm, (world.Towns[i].x + 0.5) * SCALE, 26, 0.75 * warmPulse);
      }
    }
    if (Array.isArray(world.Dwarves)) {
      for (let i = 0; i < world.Dwarves.length; i++) {
        if (world.Dwarves[i].hasForge) {
          addLightSource(colLightWarm, (world.Dwarves[i].forgeX + 0.5) * SCALE, 28, 0.85 * warmPulse);
        }
      }
    }
    if (Array.isArray(world.Crystals)) {
      for (let i = 0; i < world.Crystals.length; i++) {
        addLightSource(colLightCyan, (world.Crystals[i].x + 0.5) * SCALE, 22, 0.72 * cyanPulse);
      }
    }
    if (cosmic && Array.isArray(cosmic.TimeCrystals)) {
      for (let i = 0; i < cosmic.TimeCrystals.length; i++) {
        addLightSource(colLightCyan, (cosmic.TimeCrystals[i].x + 0.5) * SCALE, 24, 0.80 * cyanPulse);
      }
    }
    if (eco && Array.isArray(eco.ComputeVats)) {
      for (let i = 0; i < eco.ComputeVats.length; i++) {
        addLightSource(colLightCyan, (eco.ComputeVats[i].x + 0.5) * SCALE, 25, 0.65 * cyanPulse);
      }
    }

    // =========================================================================
    // 2. 1:1 DEVICE-PIXEL (`1008x630`) MULTI-PARALLAX MOIRÉ DITHER & SPLINE
    //    STRATA FRAMEBUFFER SYNTHESIS (ZERO BLOCKY UPSCALED PIXELS!)
    // =========================================================================
    const hiData = zoomState.hiResImgData.data;
    // Parallax shifts in device pixels for multi-screen moiré interference:
    const parShift04X = Math.round((sx + worldScroll) * 0.18 + tick * 0.08);
    const parShift04Y = Math.round(sy * 0.14);
    const parShift11X = Math.round((sx + worldScroll) * 0.47 - tick * 0.05);
    const parShift11Y = Math.round(sy * 0.39);
    const parShift22X = Math.round((sx + worldScroll) * 0.95 + tick * 0.22);
    const parShift48X = Math.round((sx + worldScroll) * 1.85);
    const parShift100X = Math.round(sx * 3.1);
    const parShift119X = Math.round(sx * 3.7 + sy * 1.3);

    // Prime-period harmonic tint offsets
    const skyTintR = p307 * 7 + p757 * 5;
    const skyTintG = p211 * 6 + p499 * 6;
    const skyTintB = p211 * 9 + p1103 * 6;

    for (let y = 0; y < NATIVE_H; y++) {
      const wy = sy + y / magY;
      const skyV = Math.max(0, Math.min(1, wy / NATIVE_H));
      const rowOff = y * NATIVE_W * 4;
      const bRowA = ((y + parShift04Y) & 7) << 3;
      const bRowB = ((y + parShift11Y) & 7) << 3;

      for (let x = 0; x < NATIVE_W; x++) {
        const idx = rowOff + (x << 2);
        const wx = colWorldX[x];
        const surfZY = colSurfZoomY[x];
        const warmL = colLightWarm[x];
        const cyanL = colLightCyan[x];

        // Two-layer 1:1 device-pixel Bayer & rotated halftone thresholds at mismatched parallax depths -> Moiré!
        const bayerA = ZOOM_BAYER8[bRowA | ((x + parShift04X) & 7)];
        const bayerB = ZOOM_BAYER8[bRowB | (((x + parShift11X) + ((y + parShift04Y) >> 1)) & 7)];
        const moireBeat = 0.5 * (bayerA + bayerB);

        if (y < surfZY) {
          // -------------------------------------------------------------------
          // A. ABOVE TERRAIN SPLINE: MULTI-PARALLAX SKY, RIDGES, MIST & SEA
          // -------------------------------------------------------------------
          // 1. Atmospheric sky gradient with multi-parallax moiré dither screen
          const grad = 0.76 + 0.38 * (1 - skyV) + (moireBeat - 0.5) * 0.14;
          let r = bgR * grad + skyTintR;
          let g = bgG * grad + skyTintG;
          let b = bgB * grad + skyTintB;

          // High-altitude cirrus / astral moiré filaments in upper sky
          if (wy < NATIVE_H * 0.42) {
            const cirrusPhase = Math.sin((x + parShift04X) * 0.045 + (y - parShift04Y) * 0.09) *
                                Math.cos((x - parShift11X) * 0.038 - y * 0.07);
            if (cirrusPhase > bayerA * 0.85 + 0.1) {
              r += (212 - r) * 0.24;
              g += (234 - g) * 0.26;
              b += (238 - b) * 0.28;
            }
          }

          // 2. Parallax 0.08x Far Horizon Mountains (1px stepped Bayer + diagonal hatch screen)
          const farZY = colFarRidgeY[x];
          if (y >= farZY) {
            const dFar = (y - farZY) / Math.max(8, NATIVE_H * 0.25 * mag);
            const farScreen = ZOOM_BAYER8[((y & 7) << 3) | ((x + parShift04X) & 7)];
            const snowCap = dFar < 0.06 && farScreen < 0.62 - dFar * 6;
            const mR = snowCap ? 210 : 42 + bgR * 0.32;
            const mG = snowCap ? 222 : 56 + bgG * 0.34;
            const mB = snowCap ? 226 : 68 + bgB * 0.38;
            const blend = farScreen < 0.78 ? 0.68 : 0.38;
            r += (mR - r) * blend;
            g += (mG - g) * blend;
            b += (mB - b) * blend;
          }

          // 3. Parallax 0.22x Drifting Cloud / Mist Veil (transparent dither screen bleeding over far mountains!)
          const mTop = colMistTopY[x];
          const mBot = colMistBotY[x];
          if (y >= mTop && y <= mBot) {
            const mMid = 0.5 * (mTop + mBot);
            const mHalf = Math.max(2, 0.5 * (mBot - mTop));
            const env = 1 - Math.abs(y - mMid) / mHalf;
            const mistDither = ZOOM_BAYER8[(((y + (tick >> 2)) & 7) << 3) | ((x + parShift22X) & 7)];
            if (env * 0.82 > mistDither) {
              const aMist = env * 0.42;
              r += (216 - r) * aMist;
              g += (228 - g) * aMist;
              b += (228 - b) * aMist;
            }
          }

          // 4. Parallax 0.48x Foothills & Ancient Ruin Silhouettes (multi-fill moiré dither screen)
          const footZY = colFoothillY[x];
          if (y >= footZY) {
            const footScreenA = ZOOM_BAYER8[((y & 7) << 3) | ((x + parShift48X) & 7)];
            const footScreenB = ((x + parShift48X + y * 2) & 3) * 0.25;
            if (0.5 * (footScreenA + footScreenB) < 0.66) {
              const fR = 28 + bgR * 0.22;
              const fG = 40 + bgG * 0.25;
              const fB = 48 + bgB * 0.28;
              r += (fR - r) * 0.58;
              g += (fG - g) * 0.58;
              b += (fB - b) * 0.58;
            }
          }

          // 5. Coastal Sea / Basin Water with 3-Layer Parallax Moiré Caustics & Prime-Cycled Glints
          if (y >= seaZoomY && colSurfNativeY[x] > seaNativeY - 1.5) {
            const waterDepthPx = y - seaZoomY;
            const waterDepthN = waterDepthPx / mag;
            const waveFoam = waterDepthPx < Math.max(2, mag * 0.28);
            const wScreen1 = ZOOM_BAYER8[(((y + (tick >> 1)) & 7) << 3) | ((x + parShift22X) & 7)];
            const wScreen2 = ZOOM_BAYER8[(((y - (tick >> 2)) & 7) << 3) | ((x - parShift48X + (y >> 1)) & 7)];
            const causticMoire = Math.abs(wScreen1 - wScreen2) < 0.16;
            if (waveFoam && ((x + y + (tick >> 1)) & 1) === 0) {
              r = 218;
              g = 244;
              b = 246;
            } else {
              const deepT = Math.min(1, waterDepthN / 28);
              const wR = 16 + (1 - deepT) * 28;
              const wG = 62 + (1 - deepT) * 76;
              const wB = 78 + (1 - deepT) * 84;
              r = r * 0.22 + wR * 0.78;
              g = g * 0.22 + wG * 0.78;
              b = b * 0.22 + wB * 0.78;
              if (causticMoire) {
                const cBoost = (1 - deepT * 0.6) * (0.35 + 0.15 * p211);
                r += (156 - r) * cBoost;
                g += (238 - g) * cBoost;
                b += (245 - b) * cBoost;
              }
              // Specular prime-cycle water glints when P1=211 and P2=307 constructively interfere
              if (waterDepthPx < mag * 2.2 && p211 + p307 > 0.45 && ((x * 5 + y * 3 + tick) & 31) === 0) {
                r = 248;
                g = 236;
                b = 188;
              }
            }
          }

          // 6. Preserve non-sky foreground objects from `snapRaw` (e.g., flying Tab-Forms, Airships, HUD text)
          //    filtered through a 1px device-pixel anti-block dither screen so they never look like flat giant squares!
          if (snapRaw) {
            const sxi = Math.max(0, Math.min(NATIVE_W - 1, wx | 0));
            const syi = Math.max(0, Math.min(NATIVE_H - 1, wy | 0));
            // Skip the Monolith bounding box (`X0-3..X0+14, Y0-2..Y0+45`) because Section 4 redraws the Monolith in full 1px zoom!
            const inMonoBox =
              world.P &&
              wx >= zoomState.monoX0 - 3 &&
              wx <= zoomState.monoX0 + 14 &&
              wy >= zoomState.monoY0 - 2 &&
              wy <= zoomState.monoY0 + 45;
            if (!inMonoBox) {
              const sIdx = (syi * NATIVE_W + sxi) << 2;
              const sr = snapRaw[sIdx];
              const sg = snapRaw[sIdx + 1];
              const sb = snapRaw[sIdx + 2];
              const sa = snapRaw[sIdx + 3];
              const diffSky = Math.abs(sr - bgR) + Math.abs(sg - bgG) + Math.abs(sb - bgB);
              if (sa > 120 && diffSky > 68 && wy < colSurfNativeY[x] - 4) {
                // Blend via 1px device-pixel dither screen so zoomed sprites gain crisp woven dither texture
                const fgBlend = moireBeat < 0.72 ? 0.76 : 0.42;
                r += (sr - r) * fgBlend;
                g += (sg - g) * fgBlend;
                b += (sb - b) * fgBlend;
              }
            }
          }

          // Apply subtle warm/cyan ambient light scatter in lower atmosphere
          if (warmL > 0 || cyanL > 0) {
            const nearGround = Math.max(0, 1 - (surfZY - y) / Math.max(12, 24 * mag));
            if (nearGround > 0) {
              r += warmL * nearGround * 38;
              g += warmL * nearGround * 22 + cyanL * nearGround * 32;
              b += cyanL * nearGround * 42;
            }
          }

          hiData[idx] = r < 0 ? 0 : r > 255 ? 255 : r | 0;
          hiData[idx + 1] = g < 0 ? 0 : g > 255 ? 255 : g | 0;
          hiData[idx + 2] = b < 0 ? 0 : b > 255 ? 255 : b | 0;
          hiData[idx + 3] = 255;
        } else {
          // -------------------------------------------------------------------
          // B. BELOW CONTINUOUS TERRAIN SPLINE: 1PX TOPSOIL, INTERLOCKING COBBLES,
          //    MULTI-PARALLAX GEOLOGICAL MOIRÉ STRATA & PRIME-CYCLED VEINS
          // -------------------------------------------------------------------
          const depthPx = y - surfZY;
          const depthN = depthPx / mag;

          // Multi-layer subterranean parallax dither screens (1.0x bedding vs 1.19x cleavage)
          const rockBayerA = ZOOM_BAYER8[(((y + parShift04Y) & 7) << 3) | ((x + parShift100X) & 7)];
          const rockHatchB = (((x + parShift119X) + ((y - parShift04Y) << 1)) & 7) * 0.125;
          const rockMoire = 0.5 * (rockBayerA + rockHatchB);

          let r, g, b;
          const crestPx = Math.max(2.5, Math.min(10, mag * 0.55));
          if (depthPx < crestPx) {
            // 1. Crisp 1px topsoil & moss ridge crest following the smooth spline
            const mossMix = rockMoire < 0.52 ? 1 : 0;
            r = mossMix ? 88 : 64;
            g = mossMix ? 148 + p499 * 12 : 124;
            b = mossMix ? 112 + p211 * 10 : 108;
            // Morning dew / mineral glint on the very top 1px edge when prime cycles align
            if (depthPx < 1.5 && ((x + tick) & 7) === 0 && p211 + p307 > 0.2) {
              r = 186;
              g = 242;
              b = 228;
            }
          } else {
            // 2. Staggered interlocking stone cobbles & sedimentary bedding courses
            const courseH = Math.max(3, Math.min(18, Math.round(mag * 1.35)));
            const courseIdx = Math.floor(depthPx / courseH);
            const inCourseY = Math.floor(depthPx) % courseH;
            const brickW = Math.max(5, Math.min(28, Math.round(mag * 2.2)));
            const brickStagger = (courseIdx & 1) ? (brickW >> 1) : 0;
            const brickIdx = Math.floor((x + parShift100X + brickStagger) / brickW);
            const inBrickX = Math.floor(x + parShift100X + brickStagger) % brickW;

            const isMortar = inCourseY === 0 || inBrickX === 0;
            const stoneHash = ((hash32(brickIdx * 193 + courseIdx * 37) >>> 0) & 255) / 255;
            const deepFade = Math.max(0.32, 1 - depthN / 62);

            if (isMortar && depthN < 24) {
              r = 22 * deepFade;
              g = 36 * deepFade;
              b = 44 * deepFade;
            } else {
              // Base slate/basalt/ochre stone tone modulated by 2-layer geological moiré dither
              const moireShift = (rockMoire - 0.5) * 26 + (stoneHash - 0.5) * 18;
              r = (44 + stoneHash * 22 + moireShift) * deepFade;
              g = (66 + stoneHash * 24 + moireShift) * deepFade;
              b = (74 + stoneHash * 20 + moireShift) * deepFade;
            }

            // 3. Continuous Neighbor-Connected Glowing Aetherium & Gold-Quartz Veins (Prime-Cycled!)
            if (depthN > 2.2) {
              const veinWave =
                Math.sin(wx * 0.21 + depthN * 0.34 + Math.sin(depthN * 0.15) * 1.4) +
                Math.cos(wx * 0.09 - depthN * 0.42);
              if (veinWave > 1.66) {
                const isGoldVein = ((Math.floor(wx * 0.1 + depthN * 0.1) & 1) === 0);
                const pulse = isGoldVein
                  ? 0.72 + 0.28 * (0.5 * p307 + 0.5 * p757)
                  : 0.72 + 0.28 * (0.5 * p211 + 0.5 * p499);
                if (isGoldVein) {
                  r = 228 * pulse;
                  g = 186 * pulse;
                  b = 96 * pulse;
                } else {
                  r = 98 * pulse;
                  g = 228 * pulse;
                  b = 238 * pulse;
                }
              }
            }
          }

          // Adjacent-artwork warm hearth/fire & cyan crystal illumination on the rock/soil
          if (warmL > 0 || cyanL > 0) {
            const surfProx = Math.max(0, 1 - depthN / 16);
            r += warmL * surfProx * 54;
            g += warmL * surfProx * 32 + cyanL * surfProx * 44;
            b += cyanL * surfProx * 56;
          }

          hiData[idx] = r < 0 ? 0 : r > 255 ? 255 : r | 0;
          hiData[idx + 1] = g < 0 ? 0 : g > 255 ? 255 : g | 0;
          hiData[idx + 2] = b < 0 ? 0 : b > 255 ? 255 : b | 0;
          hiData[idx + 3] = 255;
        }
      }
    }

    mainCtx.putImageData(zoomState.hiResImgData, 0, 0);

    // Helper to draw a 2-layer parallax moiré dither-screened translucent rectangle on `mainCtx`
    const fillMoireScreenRect = (rx, ry, rw, rh, colA, colB, density, depthShift) => {
      const x0 = Math.max(0, Math.round(rx));
      const y0 = Math.max(0, Math.round(ry));
      const x1 = Math.min(NATIVE_W, Math.round(rx + rw));
      const y1 = Math.min(NATIVE_H, Math.round(ry + rh));
      if (x1 <= x0 || y1 <= y0) return;
      const shA = Math.round(sx * depthShift + tick * 0.15);
      const shB = Math.round(sy * depthShift * 1.3 - tick * 0.11);
      for (let py = y0; py < y1; py++) {
        const bRow = ((py + shB) & 7) << 3;
        for (let px = x0; px < x1; px++) {
          const tA = ZOOM_BAYER8[bRow | ((px + shA) & 7)];
          const tB = (((px - shA) * 3 + (py + shB) * 5) & 7) * 0.125;
          if (tA < density) {
            mainCtx.fillStyle = (tB < 0.5 && colB) ? colB : colA;
            mainCtx.fillRect(px, py, 1, 1);
          }
        }
      }
    };

    // =========================================================================
    // 3. KINETIC WIND-BLOWING STRANDS, NEIGHBOR-INTERACTIVE GRASS/KELP, ROOT
    //    CAPILLARIES & SWINGING CATENARY ROPES ALONG THE CONTINUOUS SPLINE
    // =========================================================================
    const monoFootLeftN = world.P ? zoomState.monoX0 - 1 : -999;
    const monoFootRightN = world.P ? zoomState.monoX0 + 12 : -999;

    const grassStepPx = mag > 18 ? 3 : 2;
    for (let px = 0; px < NATIVE_W; px += grassStepPx) {
      const gy = Math.round(colSurfZoomY[px]);
      if (gy < -20 || gy >= NATIVE_H + 20) continue;
      const wx = colWorldX[px];
      const seed = hash32(Math.round(wx * 13.7) * 131 + 71);

      // Underwater basin columns: swaying bioluminescent kelp strands
      if (colSurfNativeY[px] > seaNativeY + 3 && gy > seaZoomY + 4) {
        if ((seed & 7) === 0) {
          const kelpSegs = Math.min(12, Math.max(4, Math.round(mag * 1.6)));
          let kx = px;
          let ky = gy;
          mainCtx.fillStyle = (seed & 8) ? "rgba(82, 229, 168, 0.72)" : "rgba(70, 178, 164, 0.68)";
          for (let s = 0; s < kelpSegs; s++) {
            const sway = Math.sin(tick / 37 + wx * 0.18 + s * 0.45) * 1.4;
            kx += sway * 0.45;
            ky -= Math.max(1, Math.round(mag * 0.28));
            if (ky <= seaZoomY) break;
            mainCtx.fillRect(Math.round(kx), Math.round(ky), 1, Math.max(1, Math.round(mag * 0.3)));
          }
        }
        continue;
      }

      // Surface grass blades, fern fronds & wildflowers along the spline crest:
      // Calculate neighbor-interactive parting push away from the Monolith's feet & Villagers!
      let partPush = 0;
      if (wx >= monoFootLeftN - 4 && wx <= monoFootRightN + 4) {
        const monoCenter = 0.5 * (monoFootLeftN + monoFootRightN);
        const dist = wx - monoCenter;
        if (Math.abs(dist) < 8.5) {
          partPush = (dist >= 0 ? 1 : -1) * (1 - Math.abs(dist) / 8.5) * 3.2;
        }
      }

      // Travelling prime-harmonic wind wave across the slope
      const windWave =
        Math.sin(tick / 43 + wx * 0.14) * 1.2 +
        Math.sin(tick / 89 - wx * 0.07) * 0.7 +
        p211 * 0.4 +
        partPush;

      const bladeLen = Math.min(16, Math.max(3, Math.round(((seed & 3) + 2) * Math.min(3.8, 0.7 + mag * 0.32))));
      const warm = colLightWarm[px];
      const cyan = colLightCyan[px];
      if (warm > 0.25) {
        mainCtx.fillStyle = (seed & 1) ? "rgba(232, 198, 118, 0.82)" : "rgba(168, 194, 124, 0.78)";
      } else if (cyan > 0.25) {
        mainCtx.fillStyle = (seed & 1) ? "rgba(126, 236, 224, 0.84)" : "rgba(96, 204, 188, 0.78)";
      } else {
        mainCtx.fillStyle = (seed & 1) ? "rgba(134, 188, 152, 0.78)" : "rgba(94, 146, 112, 0.74)";
      }

      // Draw articulated multi-segment 1px grass blade bending in the wind
      for (let b = 0; b < bladeLen; b++) {
        const u = b / bladeLen;
        const bx = Math.round(px + windWave * u * u * 1.8);
        const by = gy - b;
        mainCtx.fillRect(bx, by, 1, 1);
      }
      // Wildflower / glowing spore tip on every 11th stalk, prime-cycled!
      if ((seed % 11) === 0 && bladeLen >= 5) {
        const tipX = Math.round(px + windWave * 1.8);
        const tipY = gy - bladeLen;
        mainCtx.fillStyle = (p307 + p499 > 0) ? "#f8c67a" : "#7eced4";
        mainCtx.fillRect(tipX, tipY - 1, 2, 2);
      }

      // Subterranean root capillaries & mycelial filaments extending down from the spline
      if ((seed & 7) === 0) {
        const rootLen = Math.min(18, Math.max(4, Math.round(mag * 1.8)));
        mainCtx.fillStyle = "rgba(148, 212, 172, 0.38)";
        let rx = px;
        for (let r = 1; r <= rootLen; r++) {
          rx += Math.sin(r * 0.7 + seed) * 0.35;
          mainCtx.fillRect(Math.round(rx), gy + r, 1, 1);
        }
      }
    }

    // Swinging Catenary Ropes & Lantern Lines strung between Towns, Caves, and the Monolith!
    const drawSwingingCatenaryRope = (x0N, y0N, x1N, y1N, seed, hasLanterns) => {
      const zx0 = toZoomX(x0N);
      const zy0 = toZoomY(y0N);
      const zx1 = toZoomX(x1N);
      const zy1 = toZoomY(y1N);
      if ((zx0 < -80 && zx1 < -80) || (zx0 > NATIVE_W + 80 && zx1 > NATIVE_W + 80)) return;
      const spanPx = Math.hypot(zx1 - zx0, zy1 - zy0);
      const steps = Math.min(160, Math.max(16, Math.round(spanPx * 0.5)));
      const swing = Math.sin(tick / 53 + seed * 1.7) * Math.min(8, 2.2 * mag * 0.25);
      const sag = Math.min(48, Math.max(4, spanPx * 0.14)) + swing;

      for (let s = 0; s <= steps; s++) {
        const u = s / steps;
        const uSag = 4 * u * (1 - u);
        const rx = Math.round(zx0 + (zx1 - zx0) * u + swing * uSag * 0.35);
        const ry = Math.round(zy0 + (zy1 - zy0) * u + sag * uSag);
        if (rx < 0 || rx >= NATIVE_W || ry < 0 || ry >= NATIVE_H) continue;
        mainCtx.fillStyle = (s & 1) ? "#b69058" : "#86683c";
        mainCtx.fillRect(rx, ry, 1, 1);

        // Hanging swaying micro-lanterns along the catenary rope
        if (hasLanterns && s > 2 && s < steps - 2 && s % Math.max(4, Math.floor(steps / 4)) === 0) {
          const pendAng = Math.sin(tick / 29 + s + seed) * 0.35;
          const pendLen = Math.min(9, Math.max(3, Math.round(mag * 0.6)));
          const lx = Math.round(rx + Math.sin(pendAng) * pendLen);
          const ly = Math.round(ry + Math.cos(pendAng) * pendLen);
          mainCtx.fillStyle = "#b69058";
          mainCtx.fillRect(rx, ry + 1, 1, Math.max(1, ly - ry - 1));
          mainCtx.fillStyle = (p307 + p757 > -0.4) ? "#f8c67a" : "#e89456";
          mainCtx.fillRect(lx - 1, ly, 3, 3);
          mainCtx.fillStyle = "#fff3d6";
          mainCtx.fillRect(lx, ly + 1, 1, 1);
        }
      }
    };

    // Connect adjacent Towns/Caves with catenary lantern lines, and tether the Monolith when near a Town!
    if (Array.isArray(world.Towns)) {
      for (let i = 0; i < world.Towns.length; i++) {
        const t = world.Towns[i];
        const txN = t.x * SCALE + 3;
        const tyN = (COARSE_H - (blocks[t.x] || 16)) * SCALE - 12;
        if (i + 1 < world.Towns.length && Math.abs(world.Towns[i + 1].x - t.x) < 28) {
          const t2 = world.Towns[i + 1];
          const tx2N = t2.x * SCALE + 3;
          const ty2N = (COARSE_H - (blocks[t2.x] || 16)) * SCALE - 12;
          drawSwingingCatenaryRope(txN, tyN, tx2N, ty2N, i + 1, true);
        }
        if (world.P && Math.abs(t.x - world.P.x) < 16) {
          drawSwingingCatenaryRope(txN, tyN, zoomState.monoX0 + 1, zoomState.monoY0 + 14, i + 9, true);
        }
      }
    }

    // =========================================================================
    // 4. WHOLE-OBJECT & NEIGHBOR-INTERACTIVE 1:1 ZOOMED WORLD STRUCTURES
    //    (WITH TRANSPARENT MULTI-PARALLAX MOIRÉ SCREENS, LITTLE FIRES & ENGINES)
    // =========================================================================
    // 4A. Grand Glass Biodomes & Megastructures (`civState.megastructures`)
    if (Array.isArray(civState.megastructures)) {
      for (let i = 0; i < civState.megastructures.length; i++) {
        const m = civState.megastructures[i];
        const halfSpanN = (m.span * SCALE) * 0.5;
        const centerN = m.x * SCALE;
        const leftZ = toZoomX(centerN - halfSpanN);
        const rightZ = toZoomX(centerN + halfSpanN);
        if (rightZ < 0 || leftZ >= NATIVE_W) continue;
        const centerCol = Math.max(0, Math.min(COARSE_W - 1, Math.round(m.x)));
        const baseNY = (COARSE_H - (blocks[centerCol] || 18)) * SCALE;
        const heightN = m.height * SCALE * Math.min(1.25, 0.45 + (m.buildProgress || 0.7) * 0.55);
        const x0 = Math.max(0, Math.floor(leftZ));
        const x1 = Math.min(NATIVE_W - 1, Math.ceil(rightZ));
        const spanZ = Math.max(1, rightZ - leftZ);
        const ribStepZ = Math.max(6, Math.round(SCALE * mag * 0.8));

        for (let px = x0; px <= x1; px++) {
          const u = ((px - leftZ) / spanZ) * 2 - 1;
          const archN = heightN * Math.pow(Math.max(0, 1 - u * u), m.domeProfile || 0.65);
          if (archN <= 2) continue;
          const groundZY = Math.round(colSurfZoomY[px]);
          const topZY = Math.round(toZoomY(baseNY - archN));
          // 1px Geodesic Arch Crown & Glint
          mainCtx.fillStyle = ((px + tick) % 23 === 0 && p211 + p307 > 0) ? "#ffffff" : "#78ead4";
          mainCtx.fillRect(px, topZY, 1, 2);

          // Multi-Layer Transparent Parallax Moiré Glass Screen inside the Biodome!
          for (let py = Math.max(0, topZY + 2); py < Math.min(NATIVE_H, groundZY); py += 2) {
            const gScreenA = ZOOM_BAYER8[(((py + parShift04Y) & 7) << 3) | ((px + parShift22X) & 7)];
            const gScreenB = (((px - parShift11X) + (py * 3)) & 7) * 0.125;
            if (Math.abs(gScreenA - gScreenB) < 0.22) {
              mainCtx.fillStyle = "rgba(168, 228, 234, 0.22)";
              mainCtx.fillRect(px, py, 1, 1);
            }
          }
          // Vertical geodesic ribs
          if ((px - Math.floor(leftZ)) % ribStepZ === 0) {
            mainCtx.fillStyle = "rgba(126, 206, 212, 0.52)";
            mainCtx.fillRect(px, Math.max(0, topZY), 1, Math.max(1, groundZY - topZY));
          }
        }
      }
    }

    // 4B. Zoomed Towns: Cottages, Lighthouses, Wind Harps, Sky Beacons + Little Fires + Pumping Engines!
    if (Array.isArray(world.Towns)) {
      for (let i = 0; i < world.Towns.length; i++) {
        const t = world.Towns[i];
        const cxN = t.x * SCALE + 3;
        const gyN = (COARSE_H - (blocks[t.x] || 16)) * SCALE;
        const cxZ = Math.round(toZoomX(cxN));
        const gyZ = Math.round(toZoomY(gyN));
        if (cxZ < -180 || cxZ > NATIVE_W + 180 || gyZ < -180 || gyZ > NATIVE_H + 180) continue;

        const wZ = Math.max(14, Math.round(20 * mag));
        const hZ = Math.max(10, Math.round(13 * mag));
        const leftZ = cxZ - (wZ >> 1);
        const topZ = gyZ - hZ;

        // 1. Dressed stone masonry wall with 1px mortar courses & weathered moss
        mainCtx.fillStyle = "#7a746c";
        mainCtx.fillRect(leftZ, topZ, wZ, hZ);
        const courseStep = Math.max(2, Math.round(3 * mag));
        const brickStep = Math.max(4, Math.round(5 * mag));
        mainCtx.fillStyle = "#323a44";
        for (let y = topZ; y < gyZ; y += courseStep) {
          mainCtx.fillRect(leftZ, y, wZ, 1);
          const stagger = (Math.floor((y - topZ) / courseStep) & 1) ? (brickStep >> 1) : 0;
          for (let x = leftZ + stagger; x < leftZ + wZ; x += brickStep) {
            mainCtx.fillRect(x, y, 1, Math.min(courseStep, gyZ - y));
          }
        }

        // 2. Gable roof with individual overlapping slate shingles & brick chimney with curling smoke
        const roofH = Math.max(8, Math.round(12 * mag));
        for (let r = 0; r < roofH; r++) {
          const u = r / roofH;
          const span = Math.round((wZ + 4 * mag) * (1 - u * 0.88));
          const rx = cxZ - (span >> 1);
          const ry = topZ - r - 1;
          mainCtx.fillStyle = (r % Math.max(2, Math.round(2 * mag)) === 0) ? "#242c34" : "#485460";
          mainCtx.fillRect(rx, ry, span, 1);
        }
        // Chimney & drifting 1px smoke particles
        const chimX = cxZ + Math.round(4 * mag);
        const chimW = Math.max(2, Math.round(2.5 * mag));
        const chimTop = topZ - roofH;
        mainCtx.fillStyle = "#9e604c";
        mainCtx.fillRect(chimX, chimTop, chimW, Math.round(roofH * 0.65));
        for (let sm = 0; sm < 8; sm++) {
          const age = (tick * 0.45 + sm * 8 + t.x * 5) % 48;
          const sxZ = Math.round(chimX + chimW * 0.5 + (Math.sin(age * 0.15 + sm) * 2.5 + age * 0.14) * Math.min(3, mag * 0.5));
          const syZ = Math.round(chimTop - age * Math.min(2.5, 0.55 * mag));
          mainCtx.fillStyle = `rgba(210, 218, 218, ${(0.45 * (1 - age / 48)).toFixed(2)})`;
          mainCtx.fillRect(sxZ, syZ, 2, 2);
        }

        // 3. Mullioned windows with transparent moiré lace curtains & warm interior room (table, bookshelf, lantern!)
        const winW = Math.max(4, Math.round(5 * mag));
        const winH = Math.max(4, Math.round(5 * mag));
        const winPositions = [leftZ + Math.round(2.5 * mag), cxZ + Math.round(1.5 * mag)];
        for (let wIdx = 0; wIdx < winPositions.length; wIdx++) {
          const wx = winPositions[wIdx];
          const wy = gyZ - Math.round(10.5 * mag);
          // Warm hearth interior glow modulated by prime cycles 307 & 757
          mainCtx.fillStyle = (p307 + p757 > -0.2) ? "#f8c67a" : "#e89456";
          mainCtx.fillRect(wx, wy, winW, winH);
          // Interior room micro-furniture when zoomed in (tiny table, bookshelf, hanging lantern)
          if (winW >= 8) {
            mainCtx.fillStyle = "#6e422e";
            mainCtx.fillRect(wx + 1, wy + winH - 3, Math.max(2, winW - 2), 2); // table
            mainCtx.fillStyle = "#fff4d2";
            mainCtx.fillRect(wx + (winW >> 1), wy + 2, 2, 2); // hanging lantern
          }
          // Semi-transparent 1px dither curtain screen over upper window
          fillMoireScreenRect(wx, wy, winW, winH >> 1, "rgba(255, 245, 220, 0.35)", "rgba(182, 144, 88, 0.25)", 0.42, 0.8);
          // 1px window frame & cross mullions
          mainCtx.fillStyle = "#171c22";
          mainCtx.fillRect(wx + (winW >> 1), wy, 1, winH);
          mainCtx.fillRect(wx, wy + (winH >> 1), winW, 1);
        }

        // 4. LITTLE FIRE / STONE BRAZIER beside each Town with flickering 1px flames & rising embers!
        const fireX = leftZ - Math.round(6 * mag);
        const fireY = Math.round(colSurfZoomY[Math.max(0, Math.min(NATIVE_W - 1, fireX))]);
        const pitW = Math.max(4, Math.round(4 * mag));
        mainCtx.fillStyle = "#505864";
        mainCtx.fillRect(fireX - (pitW >> 1), fireY - 2, pitW, 2); // stone ring
        const flameCount = Math.max(3, Math.min(12, Math.round(3 * mag)));
        for (let fl = 0; fl < flameCount; fl++) {
          const flFrac = (fl / Math.max(1, flameCount - 1)) - 0.5;
          const flickerH = Math.max(3, Math.round((3.5 + 2.2 * Math.sin(tick * 0.31 + fl * 1.9 + t.x)) * Math.min(3.5, mag * 0.65)));
          const fxFl = Math.round(fireX + flFrac * pitW * 0.8 + Math.sin(tick * 0.23 + fl) * 1.2);
          mainCtx.fillStyle = "#e87846";
          mainCtx.fillRect(fxFl, fireY - 2 - flickerH, 1, flickerH);
          mainCtx.fillStyle = "#f8c67a";
          mainCtx.fillRect(fxFl, fireY - 2 - (flickerH >> 1), 1, Math.max(1, flickerH >> 1));
          mainCtx.fillStyle = "#fff4d8";
          mainCtx.fillRect(fxFl, fireY - 3, 1, 1);
        }
        // Rising 1px glowing ember sparks
        for (let em = 0; em < 4; em++) {
          const eAge = (tick * 0.65 + em * 13 + t.x * 7) % 28;
          const ex = Math.round(fireX + Math.sin(eAge * 0.25 + em) * 3);
          const ey = Math.round(fireY - 4 - eAge * Math.min(2, mag * 0.4));
          mainCtx.fillStyle = (em & 1) ? "#ffd43b" : "#ff922b";
          mainCtx.fillRect(ex, ey, 1, 1);
        }

        // 5. PUMPING WORKSHOP ENGINE beside the right wall (spinning flywheel + reciprocating piston + steam puffs!)
        const engX = leftZ + wZ + Math.round(4 * mag);
        const engY = Math.round(colSurfZoomY[Math.max(0, Math.min(NATIVE_W - 1, engX))]);
        const cylW = Math.max(3, Math.round(3 * mag));
        const cylH = Math.max(5, Math.round(6 * mag));
        mainCtx.fillStyle = "#8a683a";
        mainCtx.fillRect(engX - (cylW >> 1), engY - cylH, cylW, cylH);
        const pumpPhase = tick * 0.21 + t.x;
        const pistonLift = Math.round((0.5 + 0.5 * Math.sin(pumpPhase)) * Math.max(2, Math.round(3.5 * mag)));
        mainCtx.fillStyle = "#e0bc70";
        mainCtx.fillRect(engX, engY - cylH - pistonLift - 2, Math.max(1, Math.round(0.8 * mag)), pistonLift + 2);
        mainCtx.fillStyle = "#c49852";
        mainCtx.fillRect(engX - Math.round(1.5 * mag), engY - cylH - pistonLift - 3, Math.max(3, Math.round(3 * mag)), 2);
        // Periodic 1px white steam puff at top-dead-center of piston stroke
        if (Math.sin(pumpPhase) > 0.75) {
          mainCtx.fillStyle = "rgba(229, 236, 236, 0.75)";
          mainCtx.fillRect(engX + (tick & 1), engY - cylH - pistonLift - 6, 2, 2);
        }
      }
    }

    // 4C. Spooky Caves & Ancient Ruins (`world.Caves`) with Multi-Parallax Subterranean Moiré Void & Dripping Stalactites
    if (Array.isArray(world.Caves)) {
      for (let i = 0; i < world.Caves.length; i++) {
        const c = world.Caves[i];
        const elev = Math.max(2, (blocks[c.x] || 16) - (c.depth || 0));
        const cxN = c.x * SCALE + 3;
        const ybN = (COARSE_H - elev + 1) * SCALE - 1;
        const cxZ = Math.round(toZoomX(cxN));
        const ybZ = Math.round(toZoomY(ybN));
        if (cxZ < -120 || cxZ > NATIVE_W + 120 || ybZ < -120 || ybZ > NATIVE_H + 120) continue;

        const rxZ = Math.max(6, Math.round(7 * mag));
        const ryZ = Math.max(10, Math.round(18 * mag));
        mainCtx.fillStyle = "#12161c";
        mainCtx.fillRect(cxZ - rxZ, ybZ - ryZ, rxZ * 2, ryZ);
        // Multi-parallax dithered subterranean depth screen inside cave mouth
        fillMoireScreenRect(
          cxZ - rxZ + 2,
          ybZ - ryZ + 2,
          rxZ * 2 - 4,
          ryZ - 2,
          "rgba(70, 138, 144, 0.24)",
          "rgba(148, 120, 150, 0.20)",
          0.36,
          1.45
        );
        // Dressed arch voussoir stones & dripping stalactites
        mainCtx.strokeStyle = "#847e74";
        mainCtx.lineWidth = Math.max(1, Math.round(1.8 * mag));
        mainCtx.strokeRect(cxZ - rxZ + 0.5, ybZ - ryZ + 0.5, rxZ * 2, ryZ);
        for (let st = -2; st <= 2; st++) {
          const sxSt = cxZ + Math.round(st * rxZ * 0.36);
          const stLen = Math.max(3, Math.round((3 + ((st + 3) & 1) * 2) * mag));
          mainCtx.fillStyle = "#687480";
          mainCtx.fillRect(sxSt, ybZ - ryZ + 1, Math.max(1, Math.round(0.8 * mag)), stLen);
          const dropAge = (tick * 0.55 + st * 19 + c.x * 11) % 40;
          if (dropAge < 22) {
            mainCtx.fillStyle = "#a8d6da";
            mainCtx.fillRect(sxSt, ybZ - ryZ + stLen + Math.round(dropAge * mag * 0.35), 1, 2);
          }
        }
      }
    }

    // 4D. Aetherium & Time Crystals (`world.Crystals`, `cosmic.TimeCrystals`) with Internal Moiré Refraction & Energy Arcs to Monolith
    if (Array.isArray(world.Crystals)) {
      for (let i = 0; i < world.Crystals.length; i++) {
        const cr = world.Crystals[i];
        const ch = blocks[cr.x] || 15;
        const cxN = (cr.x + 0.5) * SCALE;
        const cyN = (COARSE_H - ch - 2) * SCALE;
        const cxZ = Math.round(toZoomX(cxN));
        const cyZ = Math.round(toZoomY(cyN));
        if (cxZ < -90 || cxZ > NATIVE_W + 90 || cyZ < -90 || cyZ > NATIVE_H + 90) continue;

        const radX = Math.max(4, Math.round(4.5 * mag));
        const radY = Math.max(7, Math.round(9.5 * mag));
        // Multi-layer transparent parallax moiré refraction inside crystal facets!
        fillMoireScreenRect(
          cxZ - radX,
          cyZ - radY,
          radX * 2,
          radY * 2,
          "rgba(126, 206, 212, 0.58)",
          "rgba(229, 222, 205, 0.48)",
          0.62,
          1.75
        );
        // Crisp 1px prism facet edges + prime-cycled specular glint
        mainCtx.strokeStyle = (p211 + p307 > 0.35) ? "#ffffff" : "#7eced4";
        mainCtx.lineWidth = 1;
        mainCtx.beginPath();
        mainCtx.moveTo(cxZ, cyZ - radY);
        mainCtx.lineTo(cxZ + radX, cyZ);
        mainCtx.lineTo(cxZ, cyZ + radY);
        mainCtx.lineTo(cxZ - radX, cyZ);
        mainCtx.closePath();
        mainCtx.stroke();
        mainCtx.beginPath();
        mainCtx.moveTo(cxZ, cyZ - radY);
        mainCtx.lineTo(cxZ, cyZ + radY);
        mainCtx.stroke();

        // Neighbor-interactive 1px energy filament arcing directly to the Monolith when nearby!
        if (world.P && Math.abs(cr.x - world.P.x) <= 18) {
          const targetX = toZoomX(zoomState.monoX0 + 5.5);
          const targetY = toZoomY(zoomState.monoY0 + 18.5);
          const arcSteps = 28;
          mainCtx.fillStyle = (p211 > 0) ? "#a8f4ff" : "#78ead4";
          for (let a = 0; a <= arcSteps; a++) {
            const u = a / arcSteps;
            const ax = Math.round(cxZ + (targetX - cxZ) * u + Math.sin(u * Math.PI * 3 + tick * 0.25) * 4 * (1 - Math.abs(2 * u - 1)));
            const ay = Math.round(cyZ + (targetY - cyZ) * u - Math.sin(u * Math.PI) * 12);
            mainCtx.fillRect(ax, ay, 1, 1);
          }
        }
      }
    }

    // 4E. Zoomed Villagers, Dwarf Forges & Seer Crows (`eco.OrangePeople`, `world.Dwarves`, `eco.SeerCrows`)
    if (eco && Array.isArray(eco.OrangePeople)) {
      for (let i = 0; i < eco.OrangePeople.length; i++) {
        const op = eco.OrangePeople[i];
        const col = Math.max(0, Math.min(COARSE_W - 1, Math.round(op.x)));
        const h = blocks[col] || 16;
        const vxZ = Math.round(toZoomX(op.x * SCALE + 3));
        const vyZ = Math.round(colSurfZoomY[Math.max(0, Math.min(NATIVE_W - 1, vxZ))]);
        if (vxZ < -40 || vxZ > NATIVE_W + 40 || vyZ < -40 || vyZ > NATIVE_H + 40) continue;
        const uS = Math.max(1, Math.round(mag * 0.85));
        const stride = Math.round(Math.sin((op.stride || 0) * Math.PI + tick * 0.18) * uS);
        // Boots & articulated legs
        mainCtx.fillStyle = "#9e604c";
        mainCtx.fillRect(vxZ - uS + stride, vyZ - 3 * uS, uS, 3 * uS);
        mainCtx.fillRect(vxZ + uS - stride, vyZ - 3 * uS, uS, 3 * uS);
        // Woven dithered tangerine coat & brass belt
        fillMoireScreenRect(vxZ - 2 * uS, vyZ - 9 * uS, 5 * uS, 6 * uS, "#ce743c", "#9e522c", 0.85, 1.1);
        mainCtx.fillStyle = "#e0bc70";
        mainCtx.fillRect(vxZ - 2 * uS, vyZ - 6 * uS, 5 * uS, uS);
        // Hooded head & blinking 1px eye
        mainCtx.fillStyle = "#d6ac86";
        mainCtx.fillRect(vxZ - uS, vyZ - 12 * uS, 3 * uS, 3 * uS);
        mainCtx.fillStyle = "#c4a068";
        mainCtx.fillRect(vxZ - uS, vyZ - 12 * uS, 3 * uS, uS);
        if ((tick + i * 19) % 97 > 4) {
          mainCtx.fillStyle = "#11141a";
          mainCtx.fillRect(vxZ + (op.facing < 0 ? -uS : uS), vyZ - 11 * uS, Math.max(1, uS >> 1), Math.max(1, uS >> 1));
        }
      }
    }

    if (eco && Array.isArray(eco.SeerCrows)) {
      for (let i = 0; i < eco.SeerCrows.length; i++) {
        const crw = eco.SeerCrows[i];
        const cxZ = Math.round(toZoomX(crw.x * SCALE));
        const cyZ = Math.round(toZoomY((COARSE_H - crw.y) * SCALE));
        if (cxZ < -40 || cxZ > NATIVE_W + 40 || cyZ < -40 || cyZ > NATIVE_H + 40) continue;
        const uS = Math.max(1, Math.round(mag * 0.75));
        const flap = Math.sin(tick * 0.35 + i * 1.7) * 3 * uS;
        mainCtx.fillStyle = "#1b1e25";
        mainCtx.fillRect(cxZ - 2 * uS, cyZ - uS, 4 * uS, 2 * uS);
        // Individual primary wing feathers
        for (let f = 0; f < 4; f++) {
          mainCtx.fillStyle = (f === 0 && p307 > 0.2) ? "#e0bc70" : "#2c323d";
          mainCtx.fillRect(cxZ - (3 + f) * uS, Math.round(cyZ - flap * (0.4 + f * 0.2)), uS, uS);
          mainCtx.fillRect(cxZ + (2 + f) * uS, Math.round(cyZ - flap * (0.4 + f * 0.2)), uS, uS);
        }
        mainCtx.fillStyle = "#e0bc70";
        mainCtx.fillRect(cxZ + 2 * uS, cyZ, Math.max(1, uS), Math.max(1, uS));
      }
    }

    // =========================================================================
    // 5. WHOLE-OBJECT, ENVIRONMENT-INTERACTIVE MULTI-SCALE MONOLITH (`TACHIMA-307`)
    //    & ITS EXACT 2x1 GEAR-ROOM MECHANISM WORLD-SLOT (`dx=4..6, dy=18..19`)
    // =========================================================================
    if (world && world.P) {
      const P = world.P;
      const pcx = Math.round(P.x);
      const pyTop = COARSE_H - Math.round(P.y) - 6;
      const X0 = pcx * SCALE - 2; // 11 native px wide
      const Y0 = pyTop * SCALE;   // 42 native px tall
      const pxSize = Math.max(1, mag);
      const flip = (P.facing || 1) < 0;

      // Helper to project a 1x native rectangle (X0 + dx, Y0 + dy, w, h) into integer zoomed device pixels
      const rectZ = (dx, dy, w, h) => {
        const x0 = Math.round(toZoomX(X0 + dx));
        const y0 = Math.round(toZoomY(Y0 + dy));
        const x1 = Math.round(toZoomX(X0 + dx + w));
        const y1 = Math.round(toZoomY(Y0 + dy + h));
        return {
          x: x0,
          y: y0,
          w: Math.max(1, x1 - x0),
          h: Math.max(1, y1 - y0),
          cx: (x0 + x1) * 0.5,
          cy: (y0 + y1) * 0.5,
        };
      };

      const monoBox = rectZ(0, 0, 11, 42);
      const monoScreenX = Math.max(0, Math.min(NATIVE_W - 1, Math.round(monoBox.cx)));
      const nearWarm = colLightWarm[monoScreenX] || 0;
      const nearCyan = colLightCyan[monoScreenX] || 0;

      // -----------------------------------------------------------------------
      // A. CHAMFERED OBSIDIAN-SLATE EXO-CHASSIS WITH 2-LAYER PARALLAX MOIRÉ
      //    ARMOR PLATES, MICRO-RIVETS & ENVIRONMENT-INTERACTIVE BEVEL DRIPS
      // -----------------------------------------------------------------------
      if (monoBox.x + monoBox.w > -20 && monoBox.x < NATIVE_W + 20 && monoBox.y + monoBox.h > -20 && monoBox.y < NATIVE_H + 20) {
        // Draw each of the 42 vertical native rows with smooth chamfered corners (zero giant 11x42 blocks!)
        for (let yy = 0; yy < 42; yy++) {
          const ch = yy === 0 ? 2 : yy === 1 || yy === 41 ? 1 : 0;
          const rowR = rectZ(ch, yy, 11 - ch * 2, 1);
          if (rowR.y + rowR.h < 0 || rowR.y >= NATIVE_H) continue;

          // Base dark obsidian-slate chassis plate
          const v = yy / 42;
          const baseR = Math.round(24 + (1 - v) * 14 + nearWarm * 26);
          const baseG = Math.round(29 + (1 - v) * 16 + nearWarm * 14 + nearCyan * 18);
          const baseB = Math.round(36 + (1 - v) * 18 + nearCyan * 24);
          mainCtx.fillStyle = `rgb(${baseR}, ${baseG}, ${baseB})`;
          mainCtx.fillRect(rowR.x, rowR.y, rowR.w, rowR.h);

          // Left & right chamfered bevels with prime-cycled bioluminescent drip & neighbor light reflection!
          const bevW = Math.max(1, Math.round(0.85 * pxSize));
          const dripPhaseL = yy * 0.14 - tick * 0.035 + p211 * 1.5;
          const dripPhaseR = yy * 0.14 - tick * 0.035 + 2.4 + p499 * 1.5;
          const bL_R = Math.round(62 + 38 * Math.sin(dripPhaseL) + nearWarm * 65);
          const bL_G = Math.round(146 + 48 * Math.cos(dripPhaseL * 0.8) + nearCyan * 45);
          const bL_B = Math.round(158 + 46 * Math.sin(dripPhaseL + 1.2) + nearCyan * 55);
          mainCtx.fillStyle = `rgb(${Math.min(255, bL_R)}, ${Math.min(255, bL_G)}, ${Math.min(255, bL_B)})`;
          mainCtx.fillRect(rowR.x, rowR.y, bevW, rowR.h);

          const bR_R = Math.round(58 + 42 * Math.sin(dripPhaseR) + nearWarm * 65);
          const bR_G = Math.round(138 + 46 * Math.cos(dripPhaseR * 0.8) + nearCyan * 45);
          const bR_B = Math.round(152 + 48 * Math.sin(dripPhaseR + 1.2) + nearCyan * 55);
          mainCtx.fillStyle = `rgb(${Math.min(255, bR_R)}, ${Math.min(255, bR_G)}, ${Math.min(255, bR_B)})`;
          mainCtx.fillRect(rowR.x + rowR.w - bevW, rowR.y, bevW, rowR.h);
        }

        // 2-Layer Parallax Carbon-Weave Moiré Dither Screen across the Monolith's armor plates
        fillMoireScreenRect(
          monoBox.x + Math.round(pxSize),
          monoBox.y + Math.round(pxSize),
          monoBox.w - Math.round(2 * pxSize),
          monoBox.h - Math.round(2 * pxSize),
          "rgba(86, 106, 118, 0.24)",
          "rgba(17, 20, 26, 0.28)",
          0.46,
          1.28
        );

        // Sliding bioluminescent prime-cycled droplets down left & right bevels
        for (let side = 0; side < 2; side++) {
          const yd = (tick * 0.32 + side * 23 + pcx * 7) % 52;
          if (yd >= 2 && yd <= 40) {
            const dropRect = rectZ(side === 0 ? 0.1 : 10.1, yd, 0.8, 1.8);
            mainCtx.fillStyle = (p211 + p307 > 0) ? "#e5decd" : "#7eced4";
            mainCtx.fillRect(dropRect.x, dropRect.y, dropRect.w, dropRect.h);
          }
        }

        // Reciprocating Hydraulic Spine Pistons & Ankle Struts pumping on the Monolith's flanks
        const pistonStroke = Math.sin(tick * 0.19) * 0.45;
        for (let side = 0; side < 2; side++) {
          const pxOff = side === 0 ? 1.15 : 9.15;
          const cylRect = rectZ(pxOff, 14, 0.7, 9);
          const rodRect = rectZ(pxOff + 0.15, 11.5 + pistonStroke, 0.4, 3.5);
          mainCtx.fillStyle = "#505864";
          mainCtx.fillRect(cylRect.x, cylRect.y, cylRect.w, cylRect.h);
          mainCtx.fillStyle = "#e0bc70";
          mainCtx.fillRect(rodRect.x, rodRect.y, rodRect.w, rodRect.h);
        }

        // Superconducting Gold & Cyan Circuit Bus Traces with Prime-Cycled Travelling Light Pulses
        const drawZoomedTraces = (traceList, baseHex, pulseHex, seedOff) => {
          for (let tIdx = 0; tIdx < traceList.length; tIdx++) {
            const poly = traceList[tIdx];
            for (let s = 0; s < poly.length - 1; s++) {
              const xA = flip ? 10 - poly[s][0] : poly[s][0];
              const yA = poly[s][1];
              const xB = flip ? 10 - poly[s + 1][0] : poly[s + 1][0];
              const yB = poly[s + 1][1];
              const minX = Math.min(xA, xB);
              const minY = Math.min(yA, yB);
              const segW = Math.max(0.28, Math.abs(xB - xA) + 0.28);
              const segH = Math.max(0.28, Math.abs(yB - yA) + 0.28);
              const tr = rectZ(minX + 0.35, minY + 0.35, segW, segH);
              const isPulsing = ((Math.floor(tick * 0.18 + tIdx * 3 + s + seedOff) % 5) === 0);
              mainCtx.fillStyle = isPulsing ? pulseHex : baseHex;
              mainCtx.fillRect(tr.x, tr.y, tr.w, tr.h);
            }
          }
        };
        drawZoomedTraces(MONO_GOLD_TRACES, "#b69058", "#fff0b8", 0);
        drawZoomedTraces(MONO_CYAN_TRACES, "#468a90", "#a8f8ff", 3);

        // Articulated Shoulder Feather-Vanes when `P.wings` is active
        if (P.wings) {
          const flap = Math.sin(tick * 0.25) * 0.35;
          for (let side = -1; side <= 1; side += 2) {
            const sxW = toZoomX(X0 + (side < 0 ? 0 : 11));
            const syW = toZoomY(Y0 + 9);
            for (let v = 0; v < 4; v++) {
              const ang = -0.85 + v * 0.36 - flap * 0.45;
              const lenZ = (9 - v) * pxSize;
              const exW = sxW + side * Math.cos(ang) * lenZ;
              const eyW = syW + v * pxSize + Math.sin(ang) * lenZ;
              mainCtx.strokeStyle = (v & 1) ? "#869e8c" : "#e5decd";
              mainCtx.lineWidth = Math.max(1, Math.round(0.32 * pxSize));
              mainCtx.beginPath();
              mainCtx.moveTo(sxW, syW + v * pxSize);
              mainCtx.lineTo(exW, eyW);
              mainCtx.stroke();
            }
          }
        }
      }

      // -----------------------------------------------------------------------
      // B. FULL-DETAIL ANTIKYTHERA GEAR ROOM (`rectZ(1, 12, 9, 13)`) WITH
      //    INVOLUTE GEARS, ESCAPEMENT PENDULUM, HAIRSPRING & DOVETAIL RAILS
      // -----------------------------------------------------------------------
      const drawDetailedGear = (gx, gy, rPx, teeth, angle, rimCol, spokeCol, hubCol) => {
        if (rPx < 2 || gx + rPx < -60 || gx - rPx > NATIVE_W + 60 || gy + rPx < -60 || gy - rPx > NATIVE_H + 60) return;
        mainCtx.save();
        mainCtx.translate(gx, gy);
        mainCtx.rotate(angle);
        // Outer involute gear teeth
        mainCtx.fillStyle = rimCol;
        const toothW = Math.max(1.2, Math.min(12, (Math.PI * rPx) / Math.max(6, teeth * 1.32)));
        const toothLen = Math.max(1.5, Math.min(14, rPx * 0.18));
        for (let t = 0; t < teeth; t++) {
          const a = (t / teeth) * TAU;
          mainCtx.save();
          mainCtx.rotate(a);
          mainCtx.fillRect(rPx - toothLen * 0.4, -toothW * 0.5, toothLen, toothW);
          // Specular prime-cycled tooth tip glint when P2=307 aligns
          if (rPx >= 12 && ((t + Math.floor(tick * 0.2)) % teeth) === 0 && p307 > -0.2) {
            mainCtx.fillStyle = "#fff6d6";
            mainCtx.fillRect(rPx + toothLen * 0.3, -toothW * 0.3, Math.max(1, toothLen * 0.25), Math.max(1, toothW * 0.6));
            mainCtx.fillStyle = rimCol;
          }
          mainCtx.restore();
        }
        // Outer & inner gear rings
        mainCtx.strokeStyle = rimCol;
        mainCtx.lineWidth = Math.max(1, Math.min(7, rPx * 0.14));
        mainCtx.beginPath();
        mainCtx.arc(0, 0, rPx - toothLen * 0.4, 0, TAU);
        mainCtx.stroke();
        if (rPx > 18) {
          mainCtx.lineWidth = 1;
          mainCtx.strokeStyle = spokeCol;
          mainCtx.beginPath();
          mainCtx.arc(0, 0, (rPx - toothLen * 0.4) * 0.62, 0, TAU);
          mainCtx.stroke();
        }
        // Spokes
        mainCtx.strokeStyle = spokeCol;
        mainCtx.lineWidth = Math.max(1, Math.min(5, rPx * 0.08));
        const numSpokes = rPx > 28 ? 8 : 6;
        for (let s = 0; s < numSpokes; s++) {
          const sa = (s / numSpokes) * TAU;
          mainCtx.beginPath();
          mainCtx.moveTo(0, 0);
          mainCtx.lineTo(Math.cos(sa) * (rPx - toothLen * 0.5), Math.sin(sa) * (rPx - toothLen * 0.5));
          mainCtx.stroke();
        }
        // Ruby jewel bearing / brass hub with 1px specular pinpoint
        const hubR = Math.max(1.5, Math.min(11, rPx * 0.22));
        mainCtx.fillStyle = hubCol;
        mainCtx.beginPath();
        mainCtx.arc(0, 0, hubR, 0, TAU);
        mainCtx.fill();
        if (hubR >= 3) {
          mainCtx.fillStyle = "#ffffff";
          mainCtx.fillRect(-Math.ceil(hubR * 0.35), -Math.ceil(hubR * 0.35), Math.max(1, Math.round(hubR * 0.3)), Math.max(1, Math.round(hubR * 0.3)));
        }
        mainCtx.restore();
      };

      const gearRoom = rectZ(1, 12, 9, 13);
      if (gearRoom.w >= 10) {
        // 1. Deep recessed dark-obsidian & brushed-brass clockwork chamber with multi-parallax moiré backing screen
        mainCtx.fillStyle = "rgb(11, 16, 22)";
        mainCtx.fillRect(gearRoom.x, gearRoom.y, gearRoom.w, gearRoom.h);
        fillMoireScreenRect(
          gearRoom.x + 2,
          gearRoom.y + 2,
          gearRoom.w - 4,
          gearRoom.h - 4,
          "rgba(70, 138, 144, 0.18)",
          "rgba(182, 144, 88, 0.16)",
          0.38,
          1.92
        );

        // 2. Micro-machined horizontal & vertical escapement bridge plates with 1px brass rivets
        const bridge1 = rectZ(1.2, 16.0, 8.6, 0.34);
        const bridge2 = rectZ(1.2, 20.6, 8.6, 0.34);
        const pillarL = rectZ(3.6, 12.4, 0.30, 12.2);
        const pillarR = rectZ(6.1, 12.4, 0.30, 12.2);
        mainCtx.fillStyle = "rgba(50, 78, 88, 0.90)";
        mainCtx.fillRect(bridge1.x, bridge1.y, bridge1.w, bridge1.h);
        mainCtx.fillRect(bridge2.x, bridge2.y, bridge2.w, bridge2.h);
        mainCtx.fillRect(pillarL.x, pillarL.y, pillarL.w, pillarL.h);
        mainCtx.fillRect(pillarR.x, pillarR.y, pillarR.w, pillarR.h);

        // 1px brass rivets along the bridge plates
        if (pxSize >= 3) {
          mainCtx.fillStyle = "#e0bc70";
          for (let rx = 1.6; rx <= 9.4; rx += 1.3) {
            const rv1 = rectZ(rx, 16.1, 0.14, 0.14);
            const rv2 = rectZ(rx, 20.7, 0.14, 0.14);
            mainCtx.fillRect(rv1.x, rv1.y, Math.max(1, rv1.w), Math.max(1, rv1.h));
            mainCtx.fillRect(rv2.x, rv2.y, Math.max(1, rv2.w), Math.max(1, rv2.h));
          }
        }

        // 3. Reciprocating Escapement Anchor Pendulum & Coiling Hairspring inside the Gear Room!
        const spin = tick * 0.045;
        const pendPivotX = toZoomX(X0 + 5.0);
        const pendPivotY = toZoomY(Y0 + 13.2);
        const pendSwing = Math.sin(tick * 0.24) * 0.52;
        const pendBobX = pendPivotX + Math.sin(pendSwing) * (2.2 * pxSize);
        const pendBobY = pendPivotY + Math.cos(pendSwing) * (2.2 * pxSize);
        mainCtx.strokeStyle = "#e0bc70";
        mainCtx.lineWidth = Math.max(1, Math.round(0.14 * pxSize));
        mainCtx.beginPath();
        mainCtx.moveTo(pendPivotX, pendPivotY);
        mainCtx.lineTo(pendBobX, pendBobY);
        mainCtx.stroke();
        mainCtx.fillStyle = "#ff5e7e";
        mainCtx.beginPath();
        mainCtx.arc(pendBobX, pendBobY, Math.max(1.5, 0.28 * pxSize), 0, TAU);
        mainCtx.fill();

        // 4. Multi-scale meshing Antikythera gears surrounding the central 2x1 World-Slot (`dx=4..6, dy=18..19`)
        drawDetailedGear(
          toZoomX(X0 + 2.8),
          toZoomY(Y0 + 15.2),
          2.1 * pxSize,
          mag > 24 ? 36 : mag > 8 ? 24 : 12,
          spin,
          "#d8a648",
          "#9c7228",
          "#ff5e7e"
        );
        drawDetailedGear(
          toZoomX(X0 + 7.4),
          toZoomY(Y0 + 21.4),
          1.8 * pxSize,
          mag > 24 ? 32 : mag > 8 ? 20 : 10,
          -spin * 1.25,
          "#c88a38",
          "#8c5a1e",
          "#5ef2ff"
        );
        drawDetailedGear(
          toZoomX(X0 + 2.5),
          toZoomY(Y0 + 22.1),
          1.25 * pxSize,
          mag > 20 ? 24 : 12,
          spin * 1.75,
          "#b69058",
          "#785a32",
          "#e0bc70"
        );
        drawDetailedGear(
          toZoomX(X0 + 7.6),
          toZoomY(Y0 + 15.4),
          1.2 * pxSize,
          mag > 20 ? 22 : 12,
          -spin * 1.85,
          "#7eced4",
          "#468a90",
          "#ffd43b"
        );

        // Fine planetary pinion gears directly engaging the top, bottom, left, and right edges of the 2x1 World-Slot!
        drawDetailedGear(
          toZoomX(X0 + 3.35),
          toZoomY(Y0 + 18.5),
          0.62 * pxSize,
          mag > 25 ? 24 : 12,
          -spin * 2.4,
          "#e8c268",
          "#a88234",
          "#ffd43b"
        );
        drawDetailedGear(
          toZoomX(X0 + 6.65),
          toZoomY(Y0 + 18.5),
          0.62 * pxSize,
          mag > 25 ? 24 : 12,
          spin * 2.4,
          "#e8c268",
          "#a88234",
          "#ffd43b"
        );
        drawDetailedGear(
          toZoomX(X0 + 4.5),
          toZoomY(Y0 + 17.35),
          0.58 * pxSize,
          mag > 25 ? 20 : 10,
          spin * 3.0,
          "#78ead4",
          "#3a8c82",
          "#e8f8f4"
        );
        drawDetailedGear(
          toZoomX(X0 + 5.5),
          toZoomY(Y0 + 19.65),
          0.58 * pxSize,
          mag > 25 ? 20 : 10,
          -spin * 3.0,
          "#78ead4",
          "#3a8c82",
          "#e8f8f4"
        );

        // 5. Progressive Sub-Mechanisms around the 2x1 World-Slot (`dx = 4..6, dy = 18..19`) as `mag` increases:
        //    Precision brass gear-rack teeth, dovetail guide rails, vernier ticks & pumping micro-clamps!
        if (mag >= 4.0) {
          const slotRect = rectZ(4, 18, 2, 1);
          const rackH = Math.max(1, Math.round(0.08 * pxSize));
          const toothStep = Math.max(2, Math.round(0.11 * pxSize));
          mainCtx.fillStyle = "#d8a84e";
          for (let tx = slotRect.x; tx < slotRect.x + slotRect.w; tx += toothStep) {
            mainCtx.fillRect(tx, slotRect.y - rackH, Math.max(1, Math.floor(toothStep * 0.55)), rackH);
            mainCtx.fillRect(tx, slotRect.y + slotRect.h, Math.max(1, Math.floor(toothStep * 0.55)), rackH);
          }
          const clampW = Math.max(1, Math.round(0.08 * pxSize));
          for (let ty = slotRect.y; ty < slotRect.y + slotRect.h; ty += toothStep) {
            mainCtx.fillRect(slotRect.x - clampW, ty, clampW, Math.max(1, Math.floor(toothStep * 0.55)));
            mainCtx.fillRect(slotRect.x + slotRect.w, ty, clampW, Math.max(1, Math.floor(toothStep * 0.55)));
          }
          // Sub-pixel vernier scale & planetary micro-pinions at high zoom (`mag >= 18`)
          if (mag >= 18.0) {
            const subR = Math.max(2, 0.16 * pxSize);
            drawDetailedGear(slotRect.x - subR * 1.4, slotRect.y - subR * 1.2, subR, 14, spin * 5.2, "#e0bc70", "#9c7228", "#ff5e7e");
            drawDetailedGear(slotRect.x + slotRect.w + subR * 1.4, slotRect.y - subR * 1.2, subR, 14, -spin * 5.2, "#e0bc70", "#9c7228", "#5ef2ff");
            drawDetailedGear(slotRect.x - subR * 1.4, slotRect.y + slotRect.h + subR * 1.2, subR, 14, -spin * 5.2, "#7eced4", "#468a90", "#ffd43b");
            drawDetailedGear(slotRect.x + slotRect.w + subR * 1.4, slotRect.y + slotRect.h + subR * 1.2, subR, 14, spin * 5.2, "#7eced4", "#468a90", "#ffd43b");
          }
        }
      }

      // -----------------------------------------------------------------------
      // C. MULTIPLE MODIFIED / FLIPPED / PIXEL-AVERAGED RECURSIVE COPIES OF THE
      //    WORLD INSIDE DIFFERENT SECTIONS OF THE MONOLITH!
      // -----------------------------------------------------------------------
      // Helper to draw a crisp miniature world into any slot (combining area-averaged
      // `snapCanvas` downsampling with a 1-device-pixel miniature terrain/town/monolith pass
      // so tiny slots show the actual recognizable world instead of dither-aliasing moiré!)
      const renderMiniatureWorldIntoRect = (box, flipX, flipY, miniAlpha) => {
        if (box.w < 2 || box.h < 1) return;
        mainCtx.save();
        mainCtx.beginPath();
        mainCtx.rect(box.x, box.y, box.w, box.h);
        mainCtx.clip();

        // 1. Base live `snapCanvas` with high-quality area averaging when downscaled
        mainCtx.save();
        mainCtx.imageSmoothingEnabled = box.w < NATIVE_W * 0.65;
        if (mainCtx.imageSmoothingEnabled) mainCtx.imageSmoothingQuality = "high";
        if (flipX || flipY) {
          mainCtx.translate(box.x + (flipX ? box.w : 0), box.y + (flipY ? box.h : 0));
          mainCtx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
          mainCtx.drawImage(zoomState.snapCanvas, 0, 0, NATIVE_W, NATIVE_H, 0, 0, box.w, box.h);
        } else {
          mainCtx.drawImage(zoomState.snapCanvas, 0, 0, NATIVE_W, NATIVE_H, box.x, box.y, box.w, box.h);
        }
        mainCtx.restore();

        // 2. Direct 1-device-pixel miniature world synthesis when the slot is tiny/mid-sized (`miniAlpha > 0.01`)
        //    so the actual sky, ocean, mountain ridge, slope contour, towns, castles, trees & tiny Monolith
        //    are 100% sharp and unmistakable at every small scale!
        if (miniAlpha > 0.01 && blocks) {
          mainCtx.save();
          mainCtx.globalAlpha = miniAlpha;
          if (flipX || flipY) {
            mainCtx.translate(box.x + (flipX ? box.w : 0), box.y + (flipY ? box.h : 0));
            mainCtx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
          }
          const ox = flipX || flipY ? 0 : box.x;
          const oy = flipX || flipY ? 0 : box.y;
          const bw = box.w;
          const bh = box.h;

          // Sky gradient fill
          mainCtx.fillStyle = `rgb(${bgR}, ${bgG}, ${bgB})`;
          mainCtx.fillRect(ox, oy, bw, bh);
          if (bh >= 6) {
            mainCtx.fillStyle = `rgba(255, 248, 220, 0.14)`;
            mainCtx.fillRect(ox, oy, bw, Math.max(1, Math.round(bh * 0.28)));
          }

          // Distant mountain silhouette
          if (bh >= 8) {
            mainCtx.fillStyle = `rgb(${Math.max(12, Math.round(bgR * 0.58))}, ${Math.max(20, Math.round(bgG * 0.64))}, ${Math.max(28, Math.round(bgB * 0.72))})`;
            for (let dx = 0; dx < bw; dx++) {
              const u = dx / Math.max(1, bw);
              const mH = 0.34 + 0.14 * Math.sin(u * 9.0 + 0.7) + 0.07 * Math.cos(u * 21.0);
              const my = oy + Math.round(mH * bh);
              mainCtx.fillRect(ox + dx, my, 1, Math.max(1, oy + bh - my));
            }
          }

          // Sea level water band
          const seaY = oy + Math.round(((COARSE_H - seaLevel) / COARSE_H) * bh);
          if (seaY < oy + bh) {
            mainCtx.fillStyle = "rgb(26, 98, 128)";
            mainCtx.fillRect(ox, Math.max(oy, seaY), bw, oy + bh - Math.max(oy, seaY));
            mainCtx.fillStyle = "rgb(118, 224, 238)";
            mainCtx.fillRect(ox, Math.max(oy, seaY), bw, 1);
          }

          // Crisp 1px terrain slope columns from live `world.Blocks`
          for (let dx = 0; dx < bw; dx++) {
            const coarseF = (dx / Math.max(1, bw)) * (COARSE_W - 1);
            const c0 = Math.floor(coarseF);
            const c1 = Math.min(COARSE_W - 1, c0 + 1);
            const f = coarseF - c0;
            const elev = (blocks[c0] || 0) * (1 - f) + (blocks[c1] || 0) * f;
            const ty = oy + Math.max(0, Math.min(bh - 1, Math.round(((COARSE_H - elev) / COARSE_H) * bh)));
            const colH = oy + bh - ty;
            if (colH > 0) {
              // Sub-surface rock/earth body
              mainCtx.fillStyle = "rgb(34, 62, 58)";
              mainCtx.fillRect(ox + dx, ty, 1, colH);
              if (colH > 3) {
                mainCtx.fillStyle = "rgb(22, 42, 44)";
                mainCtx.fillRect(ox + dx, ty + Math.max(1, Math.round(bh * 0.08)), 1, colH);
              }
              // Bright emerald/sage surface grass crest (1-2px)
              mainCtx.fillStyle = elev > seaLevel + 1 ? "rgb(102, 214, 152)" : "rgb(218, 194, 118)";
              mainCtx.fillRect(ox + dx, ty, 1, Math.max(1, Math.min(2, Math.round(bh / 36))));
            }
          }

          // Miniature Towns, Castles, Crystals & Trees on the slope
          if (bw >= 12 && bh >= 6) {
            if (Array.isArray(world.Towns)) {
              for (let i = 0; i < world.Towns.length; i++) {
                const t = world.Towns[i];
                const tx = ox + Math.round((t.x / COARSE_W) * bw);
                const tElev = blocks[Math.max(0, Math.min(COARSE_W - 1, Math.round(t.x)))] || seaLevel;
                const ty = oy + Math.round(((COARSE_H - tElev) / COARSE_H) * bh);
                const tw = Math.max(2, Math.round((bw * 4) / COARSE_W));
                const th = Math.max(2, Math.round((bh * 4) / COARSE_H));
                mainCtx.fillStyle = "#d97348";
                mainCtx.fillRect(tx - (tw >> 1), ty - th, tw, th);
                mainCtx.fillStyle = "#ffe066";
                mainCtx.fillRect(tx, ty - Math.max(1, th - 1), 1, 1);
              }
            }
            if (Array.isArray(world.Castles)) {
              for (let i = 0; i < world.Castles.length; i++) {
                const c = world.Castles[i];
                const cx = ox + Math.round((c.x / COARSE_W) * bw);
                const cElev = blocks[Math.max(0, Math.min(COARSE_W - 1, Math.round(c.x)))] || seaLevel;
                const cy = oy + Math.round(((COARSE_H - cElev) / COARSE_H) * bh);
                const cw = Math.max(2, Math.round((bw * 5) / COARSE_W));
                const ch = Math.max(3, Math.round((bh * 7) / COARSE_H));
                mainCtx.fillStyle = "#8fa6b2";
                mainCtx.fillRect(cx - (cw >> 1), cy - ch, cw, ch);
              }
            }
            if (Array.isArray(world.Crystals)) {
              mainCtx.fillStyle = "#66f2ff";
              for (let i = 0; i < world.Crystals.length; i++) {
                const cr = world.Crystals[i];
                const cx = ox + Math.round((cr.x / COARSE_W) * bw);
                const cElev = blocks[Math.max(0, Math.min(COARSE_W - 1, Math.round(cr.x)))] || seaLevel;
                const cy = oy + Math.round(((COARSE_H - cElev) / COARSE_H) * bh);
                mainCtx.fillRect(cx, cy - Math.max(1, Math.round((bh * 2) / COARSE_H)), 1, Math.max(1, Math.round((bh * 2) / COARSE_H)));
              }
            }
          }

          // Miniature Tab-Form Ships in the sky
          const tfSys = global.SlopesTabForms && Array.isArray(global.SlopesTabForms.tabForms) ? global.SlopesTabForms.tabForms : null;
          if (tfSys && bw >= 16) {
            for (let i = 0; i < tfSys.length; i++) {
              const tf = tfSys[i];
              const tx = ox + Math.round(((tf.x || 40) / COARSE_W) * bw);
              const ty = oy + Math.round(((COARSE_H - (tf.y || 30)) / COARSE_H) * bh);
              const tw = Math.max(2, Math.round((bw * 6) / COARSE_W));
              const th = Math.max(1, Math.round((bh * 3) / COARSE_H));
              mainCtx.fillStyle = tf.accentHex || "#78ead4";
              mainCtx.fillRect(tx - (tw >> 1), ty - th, tw, th);
            }
          }

          // Miniature Player Monolith (`TACHIMA-307`) + its nested 2x1 glowing gear-room slot!
          const mX = ox + Math.round((X0 / NATIVE_W) * bw);
          const mY = oy + Math.round((Y0 / NATIVE_H) * bh);
          const mW = Math.max(1, Math.round((11 / NATIVE_W) * bw));
          const mH = Math.max(2, Math.round((42 / NATIVE_H) * bh));
          mainCtx.fillStyle = "#1c262e";
          mainCtx.fillRect(mX, mY, mW, mH);
          mainCtx.fillStyle = "#78ead4";
          mainCtx.fillRect(mX, mY, 1, mH);
          if (mW >= 3 && mH >= 5) {
            const innerSlotX = ox + Math.round(((X0 + 4) / NATIVE_W) * bw);
            const innerSlotY = oy + Math.round(((Y0 + 18) / NATIVE_H) * bh);
            mainCtx.fillStyle = `rgb(${bgR}, ${bgG}, ${bgB})`;
            mainCtx.fillRect(innerSlotX, innerSlotY, Math.max(1, Math.round((2 / NATIVE_W) * bw)), Math.max(1, Math.round((1 / NATIVE_H) * bh)));
          }
          mainCtx.restore();
        }

        mainCtx.restore();
      };

      // 1. Head Visor Optic Slot (`dx = 3..7, dy = 4..5`): Horizontally flipped (mirror) + cyan-phosphor filtered world
      const visorSlot = rectZ(3, 4, 4, 1);
      if (visorSlot.w >= 4 && visorSlot.h >= 2 && visorSlot.x + visorSlot.w > 0 && visorSlot.x < NATIVE_W) {
        renderMiniatureWorldIntoRect(visorSlot, true, false, 0.85);
        mainCtx.fillStyle = "rgba(45, 225, 245, 0.22)";
        mainCtx.fillRect(visorSlot.x, visorSlot.y, visorSlot.w, visorSlot.h);
      }

      // 2. Upper-Left & Upper-Right Gear-Room Escapement Windows (`dx = 2..4, dy = 13..14` and `dx = 6..8, dy = 13..14`):
      const auxLeft = rectZ(2, 13, 2, 1);
      if (auxLeft.w >= 3 && auxLeft.h >= 2) {
        renderMiniatureWorldIntoRect(auxLeft, false, true, 0.85);
        mainCtx.fillStyle = "rgba(245, 190, 65, 0.24)";
        mainCtx.fillRect(auxLeft.x, auxLeft.y, auxLeft.w, auxLeft.h);
      }
      const auxRight = rectZ(6, 13, 2, 1);
      if (auxRight.w >= 3 && auxRight.h >= 2) {
        renderMiniatureWorldIntoRect(auxRight, true, true, 0.85);
        mainCtx.fillStyle = "rgba(105, 245, 185, 0.22)";
        mainCtx.fillRect(auxRight.x, auxRight.y, auxRight.w, auxRight.h);
      }

      // 3. Lower Torso & Chassis Pixel-Averaged Recursive World Mosaic (`dy = 25..37, dx = 2..8`):
      if (mag >= 2.2 && mag <= 110) {
        for (let my = 25; my <= 37; my += 2) {
          for (let mx = 2; mx <= 7; mx += 2) {
            const cell = rectZ(mx, my, 2, 1);
            if (cell.w < 3 || cell.h < 2) continue;
            if (cell.x + cell.w < 0 || cell.x >= NATIVE_W || cell.y + cell.h < 0 || cell.y >= NATIVE_H) continue;

            let pR = 38, pG = 68, pB = 78;
            if (snapRaw) {
              const sxSample = Math.max(0, Math.min(NATIVE_W - 1, Math.round(X0 + mx)));
              const sySample = Math.max(0, Math.min(NATIVE_H - 1, Math.round(Y0 + my)));
              const sOff = (sySample * NATIVE_W + sxSample) << 2;
              pR = snapRaw[sOff];
              pG = snapRaw[sOff + 1];
              pB = snapRaw[sOff + 2];
            }

            const mode = (mx + my) % 6;
            renderMiniatureWorldIntoRect(cell, mode === 0, mode === 2, 0.80);
            mainCtx.fillStyle = `rgba(${pR}, ${pG}, ${pB}, 0.42)`;
            mainCtx.fillRect(cell.x, cell.y, cell.w, cell.h);
          }
        }
      }

      // -----------------------------------------------------------------------
      // D. PRIMARY 2x1 GEAR-ROOM MECHANISM SLOT (`dx = 4..6, dy = 18..19` —
      //    Exact 2 Pixels Across by 1 Pixel High inside the Monolith Gear Room!):
      //    - Locked to the exact 2x1 slot (`rectZ(4, 18, 2, 1)`) at ALL zoom levels!
      //    - Shows the ACTUAL LIVE WORLD at miniature size (sky, mountain ridge, ocean,
      //      terrain slope, towns, castles, ships, and nested Monolith) with ZERO moiré
      //      static over it, and smoothly resolves to 100% 1:1 `snapCanvas` across
      //      `(0, 0, 1008, 630)` as `zMod -> 5.0`!
      // -----------------------------------------------------------------------
      if (zMod < 0.30) {
        // Smooth C0 cross-fade across the 0/5 origin seam so starting to zoom in (0 -> 1)
        // or finishing zooming out (1 -> 0) transitions seamlessly from the 1x macro frame
        mainCtx.save();
        mainCtx.globalAlpha = Math.max(0, Math.min(1, 1 - zMod / 0.30));
        mainCtx.drawImage(zoomState.snapCanvas, sx, sy, srcW, srcH, 0, 0, NATIVE_W, NATIVE_H);
        mainCtx.restore();
      }

      const primarySlot = rectZ(4, 18, 2, 1);
      if (primarySlot.w >= 2 && primarySlot.h >= 1) {
        // At small/medium sizes (`zMod < 4.35`), blend the crisp 1-device-pixel miniature world
        // synthesis (`miniAlpha`) with the area-averaged `snapCanvas` so the miniature world is
        // crystal-clear and unmistakable, decaying to 0 by `zMod = 4.35` so `zMod: 4.35 -> 5.0`
        // is 100% exact 1:1 `snapCanvas`!
        const miniAlpha = Math.max(0, Math.min(0.88, ((4.35 - zMod) / 1.1) * 0.88));
        renderMiniatureWorldIntoRect(primarySlot, false, false, miniAlpha);
      }
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
    // Landfills, Recycling Centers, and Lava Incinerators render every frame!
    if (global.SlopesTabForms && typeof global.SlopesTabForms.render === "function") {
      const origTabRender = global.SlopesTabForms.render.bind(global.SlopesTabForms);
      global.SlopesTabForms.render = function (primeRenderer, world, eco, cosmic) {
        renderMegastructuresAndEconomy(primeRenderer, world);
        return origTabRender(primeRenderer, world, eco, cosmic);
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
  const WEBCAM_MAX_OVER_SENSE_RATE = 0.48; // Only lock out if >48% of a 60s window continuously false-triggers

  const MEDIAPIPE_VISION_CDN = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs";
  const MEDIAPIPE_WASM_DIR = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm";
  const MEDIAPIPE_FACE_MODEL_URL =
    "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

  const webcamState = {
    active: false,
    prompting: false,
    errorMsg: null,
    videoEl: null,
    procCanvas: null,
    procCtx: null,
    faceLandmarker: null,
    landmarkerLoading: false,
    landmarkerFailed: false,
    lastVideoTime: -1,
    eyesClosed: false,
    manualEyesClosed: false,
    rawEyeDetected: false, // Debug indicator: turns 'A' in CAM -> "CaM"
    rawSmileDetected: false, // Debug indicator: turns 'M' in CAM -> "CAm"
    eyeDebugHoldUntil: 0, // Short visual hold on "CaM" so user can see it right as they open their eyes
    smileDebugHoldUntil: 0,
    eyeConsecutiveClosed: 0,
    smileConsecutiveFrames: 0,
    eyeCloseConfidence: 0,
    closedAlpha: 0, // 0..1 fade-in when eyes close; snaps to 0 immediately when eyes open!
    calibrationStartMs: 0,
    lastSmileActivationMs: 0,
    eyeOverSensingLocked: false,
    smileOverSensingLocked: false,
    sampleHistory: [], // Rolling 60-second window of { t, earScore, blinkScore, smileScore, rawEye, rawSmile }
    prevLumaFrame: null,
    baselineEar: 0.28,
    baselineBlink: 0.08,
    baselineSmile: 0.06,
    baselineMouthW: 0.38,
    baselineEyeLuma: null,
    baselineMouthRatio: null,
    smiling: false,
    smileCooldown: 0,
    lovingCrows: [], // Active swarm of loving crows when smiling
    heartParticles: [],
    lastTrackMs: 0,
  };

  async function ensureMediaPipeFaceLandmarker() {
    if (webcamState.faceLandmarker || webcamState.landmarkerLoading || webcamState.landmarkerFailed) {
      return webcamState.faceLandmarker;
    }
    webcamState.landmarkerLoading = true;
    try {
      const vision = await import(MEDIAPIPE_VISION_CDN);
      const { FaceLandmarker, FilesetResolver } = vision;
      const filesetResolver = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_DIR);
      let landmarker = null;
      try {
        landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: MEDIAPIPE_FACE_MODEL_URL,
            delegate: "GPU",
          },
          outputFaceBlendshapes: true,
          runningMode: "VIDEO",
          numFaces: 1,
        });
      } catch (_) {
        landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: MEDIAPIPE_FACE_MODEL_URL,
            delegate: "CPU",
          },
          outputFaceBlendshapes: true,
          runningMode: "VIDEO",
          numFaces: 1,
        });
      }
      webcamState.faceLandmarker = landmarker;
      return landmarker;
    } catch (_) {
      webcamState.landmarkerFailed = true;
      return null;
    } finally {
      webcamState.landmarkerLoading = false;
    }
  }

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
      // Start loading MediaPipe FaceLandmarker in parallel with getUserMedia
      void ensureMediaPipeFaceLandmarker();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 320 }, height: { ideal: 240 }, facingMode: "user" },
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
        c.width = 96;
        c.height = 72;
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
      webcamState.eyeDebugHoldUntil = 0;
      webcamState.smileDebugHoldUntil = 0;
      webcamState.eyeConsecutiveClosed = 0;
      webcamState.smileConsecutiveFrames = 0;
      webcamState.baselineEar = 0.28;
      webcamState.baselineBlink = 0.08;
      webcamState.baselineSmile = 0.06;
      webcamState.baselineMouthW = 0.38;
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
      if (!webcamState.faceLandmarker && !webcamState.landmarkerLoading && !webcamState.landmarkerFailed) {
        void ensureMediaPipeFaceLandmarker();
      }

      let rawEye = false;
      let rawSmile = false;
      let earMean = webcamState.baselineEar || 0.28;
      let blinkMean = 0;
      let smileScore = 0;
      let usedMediaPipe = false;

      // ----------------------------------------------------------------------
      // A. PRIMARY DETECTOR: MediaPipe FaceLandmarker (478 3D Landmarks + ARKit Blendshapes)
      // ----------------------------------------------------------------------
      if (webcamState.faceLandmarker && webcamState.videoEl.videoWidth > 0) {
        try {
          const ts = Math.max(webcamState.lastVideoTime + 1, Math.round(performance.now()));
          webcamState.lastVideoTime = ts;
          const res = webcamState.faceLandmarker.detectForVideo(webcamState.videoEl, ts);
          if (res && res.faceLandmarks && res.faceLandmarks.length > 0) {
            usedMediaPipe = true;
            const lm = res.faceLandmarks[0];
            const dist2d = (a, b) => Math.hypot(lm[a].x - lm[b].x, lm[a].y - lm[b].y);

            // 1. 3D Landmark Eye Aspect Ratio (EAR) for Left & Right Eyes
            const leftEar =
              (dist2d(159, 145) + dist2d(158, 153)) / (2 * Math.max(0.001, dist2d(33, 133)));
            const rightEar =
              (dist2d(386, 374) + dist2d(385, 380)) / (2 * Math.max(0.001, dist2d(362, 263)));
            earMean = (leftEar + rightEar) * 0.5;

            // 2. 3D Landmark Mouth Width & Corner Lift for Smile
            const faceW = Math.max(0.02, dist2d(234, 454));
            const mouthW = dist2d(61, 291) / faceW;
            const lipCenterY = (lm[13].y + lm[14].y) * 0.5;
            const cornerMeanY = (lm[61].y + lm[291].y) * 0.5;
            const cornerLift = (lipCenterY - cornerMeanY) / faceW;

            // 3. ARKit Blendshapes (`eyeBlinkLeft`, `eyeBlinkRight`, `mouthSmileLeft`, `mouthSmileRight`)
            let blinkL = 0,
              blinkR = 0,
              smileL = 0,
              smileR = 0;
            if (res.faceBlendshapes && res.faceBlendshapes.length > 0 && res.faceBlendshapes[0].categories) {
              const cats = res.faceBlendshapes[0].categories;
              for (let c = 0; c < cats.length; c++) {
                const name = cats[c].categoryName;
                const sc = cats[c].score || 0;
                if (name === "eyeBlinkLeft") blinkL = sc;
                else if (name === "eyeBlinkRight") blinkR = sc;
                else if (name === "mouthSmileLeft") smileL = sc;
                else if (name === "mouthSmileRight") smileR = sc;
              }
            }
            blinkMean = (blinkL + blinkR) * 0.5;
            const smileBlend = (smileL + smileR) * 0.5;
            smileScore = Math.max(smileBlend, (mouthW - 0.34) * 2.2 + Math.max(0, cornerLift) * 4.5);

            // Update adaptive per-user open-eye & neutral-mouth baselines from rolling history
            const baseEar = webcamState.baselineEar || 0.28;
            const baseBlink = webcamState.baselineBlink || 0.08;
            const baseSmile = webcamState.baselineSmile || 0.06;
            const baseMouthW = webcamState.baselineMouthW || 0.38;

            // Detect Smile: either ARKit blendshapes or landmark mouth corner widening + lift
            rawSmile =
              (smileL > 0.28 && smileR > 0.28) ||
              smileBlend > Math.max(0.28, baseSmile + 0.16) ||
              (mouthW > baseMouthW * 1.075 && cornerLift > 0.008);

            // Detect Eyes Closed: bilateral blink blendshapes OR bilateral EAR drop below user baseline
            const blinkTriggered =
              blinkL > Math.max(0.36, baseBlink + 0.22) &&
              blinkR > Math.max(0.36, baseBlink + 0.22);
            const earTriggered =
              earMean < Math.min(0.215, baseEar * 0.75) &&
              leftEar < baseEar * 0.80 &&
              rightEar < baseEar * 0.80;

            rawEye = (blinkTriggered || earTriggered) && !(smileBlend > 0.58 && blinkMean < 0.55);

            // Gently adapt baselines when in neutral open-eye state
            if (!rawEye && earMean > 0.18 && earMean < 0.42) {
              webcamState.baselineEar = baseEar * 0.94 + earMean * 0.06;
              webcamState.baselineBlink = baseBlink * 0.94 + blinkMean * 0.06;
            }
            if (!rawSmile && mouthW > 0.25 && mouthW < 0.55) {
              webcamState.baselineSmile = baseSmile * 0.94 + smileBlend * 0.06;
              webcamState.baselineMouthW = baseMouthW * 0.94 + mouthW * 0.06;
            }
          }
        } catch (_) {}
      }

      // ----------------------------------------------------------------------
      // B. FALLBACK DETECTOR (while MediaPipe WASM is downloading or if offline):
      //    Dynamic Skin-Tone Face Bounding Box + Dark Pupil/Iris Disappearance & Mouth Width
      // ----------------------------------------------------------------------
      if (!usedMediaPipe) {
        const w = 96;
        const h = 72;
        webcamState.procCtx.drawImage(webcamState.videoEl, 0, 0, w, h);
        const img = webcamState.procCtx.getImageData(0, 0, w, h).data;
        const curLuma = new Float32Array(w * h);
        let skinXSum = 0,
          skinYSum = 0,
          skinCnt = 0;

        for (let y = 6; y < h - 6; y++) {
          for (let x = 12; x < w - 12; x++) {
            const idx = y * w + x;
            const p = idx * 4;
            const r = img[p],
              g = img[p + 1],
              b = img[p + 2];
            curLuma[idx] = r * 0.299 + g * 0.587 + b * 0.114;
            if (r > 60 && g > 40 && b > 25 && r > g && r > b && r - Math.min(g, b) > 12) {
              skinXSum += x;
              skinYSum += y;
              skinCnt++;
            }
          }
        }

        const fcx = skinCnt > 80 ? Math.round(skinXSum / skinCnt) : 48;
        const fcy = skinCnt > 80 ? Math.round(skinYSum / skinCnt) : 36;
        const eyeY0 = Math.max(6, fcy - 10);
        const eyeY1 = Math.min(h - 6, fcy - 2);
        const lEyeX0 = Math.max(6, fcx - 16);
        const lEyeX1 = Math.max(lEyeX0 + 4, fcx - 4);
        const rEyeX0 = Math.min(w - 12, fcx + 4);
        const rEyeX1 = Math.min(w - 6, fcx + 16);

        let cheekSum = 0,
          cheekCnt = 0;
        for (let y = Math.min(h - 4, fcy); y <= Math.min(h - 3, fcy + 5); y++) {
          for (let x = lEyeX0; x <= rEyeX1; x++) {
            cheekSum += curLuma[y * w + x];
            cheekCnt++;
          }
        }
        const cheekMean = Math.max(20, cheekSum / Math.max(1, cheekCnt));

        // Measure dark pupil/iris dip + sclera contrast in left & right eye boxes
        let lMin = 255,
          rMin = 255,
          lMax = 0,
          rMax = 0;
        for (let y = eyeY0; y <= eyeY1; y++) {
          for (let x = lEyeX0; x <= lEyeX1; x++) {
            const v = curLuma[y * w + x];
            if (v < lMin) lMin = v;
            if (v > lMax) lMax = v;
          }
          for (let x = rEyeX0; x <= rEyeX1; x++) {
            const v = curLuma[y * w + x];
            if (v < rMin) rMin = v;
            if (v > rMax) rMax = v;
          }
        }
        const lContrast = (lMax - lMin + (cheekMean - lMin)) / cheekMean;
        const rContrast = (rMax - rMin + (cheekMean - rMin)) / cheekMean;
        earMean = (lContrast + rContrast) * 0.25;

        // Mouth corner gradient & teeth brightness in lower face box
        let mouthContrast = 0;
        const mY0 = Math.min(h - 8, fcy + 6);
        const mY1 = Math.min(h - 3, fcy + 15);
        for (let y = mY0; y <= mY1; y++) {
          for (let x = lEyeX0; x <= rEyeX1; x++) {
            mouthContrast += Math.abs(curLuma[y * w + x] - curLuma[y * w + (x + 1)]);
          }
        }
        smileScore = mouthContrast / (cheekMean * 18);

        if (webcamState.sampleHistory.length >= 8) {
          const earVals = webcamState.sampleHistory.map((s) => s.earScore);
          const smVals = webcamState.sampleHistory.map((s) => s.smileScore);
          const earStats = computeMedianAndMad(earVals);
          const smStats = computeMedianAndMad(smVals);
          rawEye = earMean < earStats.median - Math.max(0.025, earStats.std * 1.8);
          rawSmile = !rawEye && smileScore > smStats.median + Math.max(0.03, smStats.std * 1.8);
        }
      }

      // Prune rolling 60-second sample history
      const history = webcamState.sampleHistory;
      const cutoff = now - WEBCAM_SAMPLE_PERIOD_MS;
      while (history.length > 0 && history[0].t < cutoff) {
        history.shift();
      }
      history.push({
        t: now,
        earScore: earMean,
        blinkScore: blinkMean,
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
      const eyeSenseRate = history.length >= 40 ? eyeSenseCount / history.length : 0;
      const smileSenseRate = history.length >= 40 ? smileSenseCount / history.length : 0;

      if (history.length >= 60 && eyeSenseRate > WEBCAM_MAX_OVER_SENSE_RATE) {
        webcamState.eyeOverSensingLocked = true;
      } else if (eyeSenseRate <= 0.35) {
        webcamState.eyeOverSensingLocked = false;
      }

      if (history.length >= 60 && smileSenseRate > WEBCAM_MAX_OVER_SENSE_RATE) {
        webcamState.smileOverSensingLocked = true;
      } else if (smileSenseRate <= 0.35) {
        webcamState.smileOverSensingLocked = false;
      }

      // Expose raw detection flags (with short 320ms visual hold on "CaM"/"CAm" so user can see "CaM" right as they open their eyes!)
      if (rawEye) webcamState.eyeDebugHoldUntil = now + 320;
      if (rawSmile) webcamState.smileDebugHoldUntil = now + 320;
      webcamState.rawEyeDetected = rawEye || now < webcamState.eyeDebugHoldUntil;
      webcamState.rawSmileDetected = rawSmile || now < webcamState.smileDebugHoldUntil;

      // Consecutive-frame hysteresis with INSTANT open-eye reset for the actual Sylvia Plath overlay:
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
        webcamState.eyeConsecutiveClosed >= 5; // ~225ms sustained closure (ignores normal rapid blinks)

      setEyesClosedInternal(webcamState.manualEyesClosed || allowEyeActivation);

      const allowSmileActivation =
        !inInitialSamplePeriod &&
        !webcamState.smileOverSensingLocked &&
        now - webcamState.lastSmileActivationMs >= WEBCAM_SAMPLE_PERIOD_MS &&
        webcamState.smileConsecutiveFrames >= 3 &&
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
    // Hide when Tab-Form Terminal Window or Claude Sign-In Modal is open so
    // they NEVER obscure or steal clicks from the top-bar [SIGN IN CLAUDE] button!
    // ----------------------------------------------------------------------
    datPuterState.topHudHitBoxes = [];
    const termOrModalOpen = Boolean(
      (global.SlopesTabForms && global.SlopesTabForms.state && global.SlopesTabForms.state.terminalOpen) ||
        (global.RealTabComputerBridge &&
          global.RealTabComputerBridge.state &&
          global.RealTabComputerBridge.state.modalOpen)
    );
    if (!termOrModalOpen || datPuterState.open) {
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
    }

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
            global.RealTabComputerBridge.state.modalOpen) ||
          (!datPuterState.open &&
            global.SlopesTabForms &&
            global.SlopesTabForms.state &&
            global.SlopesTabForms.state.terminalOpen)
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
    stepAndRenderRecursiveZoom,
    getZoomDepth: () => zoomState.depth,
    dumpTrashIntoLava,
    recycleWasteBatch,
    runMacroEpochEvolution,
    renderMegastructuresAndEconomy,
    scrollCivWorldBy,
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
    stepAndRenderRecursiveZoom,
    getZoomDepth: () => zoomState.depth,
    ZOOM_LAYER_NAMES,
  };
  global.__loreDockEvalInScope = (code) => eval(code);
  if (typeof module !== "undefined" && module.exports) {
    module.exports = ChronosAndCivAPI;
  }
})(typeof window !== "undefined" ? window : globalThis);
