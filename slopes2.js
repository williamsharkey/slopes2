/* Slopes2: The Slopes of a Town by the Sea (V2)
 *
 * Built directly on the 2018 pi-shift pixel engine (120x75 canvas, bg(m) harmonic
 * color scaling, 6-pixel robot with binary P.e antenna tower, and ahoy_art_deco.64c
 * proportional bitmap font) while expanding it into an infinite vertical & horizontal
 * multi-screen world:
 *   - SURFACE (Layer 0): Poetic 5-Act sky narrative, Vermuna dropping Round Rocks,
 *     terraced Coastal Cottages/Lighthouses/Harps, Spooky Caves, rising Ember-Tar veins.
 *   - SUBTERRANEAN WORLDS (Layers -1, -2, -3...): Drill down through bedrock with the
 *     AUGER DRILL to discover algorithmically generated Aetherium Crystal Caverns
 *     (Castle in the Sky levitation stones), Bioluminescent Mushroom Grottos,
 *     Dwarf Forge & Digger Tunnels, Underwater Abyssal Trenches, and Magma Vaults.
 *   - SKY & CLOUD WORLDS (Layers +1, +2, +3...): Ascend into the clouds with an
 *     AETHERIUM CORE or SKY WING to board Friendly Airships, battle Pirate Airships,
 *     climb Raptor Mountains with hatching Raptor Eggs, and reach Floating Castles in the Sky.
 */
(function () {
  const W = 144;
  const H = 90;
  const WH = 72;
  const TEXT_H = 28;

  const canvas = document.getElementById("pi-shift");
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  let cachedBgRgb = [72, 160, 148];

  // Multi-Scale Prime Sub-Pixel Renderer (840x525 native framebuffer = 7x7 per 120x75 coarse cell)
  // Renders 1x1 coarse blocks, 2x2 ferns/critters, 3x3 villagers/skeksis/crows, 5x5 lipid automata & 7x7 live Vat CA
  const primeRenderer =
    window.SlopesEcology && window.SlopesEcology.createPrimeRenderer
      ? window.SlopesEcology.createPrimeRenderer(ctx, () => cachedBgRgb)
      : null;
  const ecology =
    window.SlopesEcology && window.SlopesEcology.createEcologicalSystem
      ? window.SlopesEcology.createEcologicalSystem()
      : null;
  // WFC Multi-Resolution Seeping, Recursive Pocket Worlds, WASM Scientist Labs, 100x Time Crystals,
  // Energy/Compute Conduit Networks, Worker Swarms, Rideable Crafts & Transdimensional Beings
  const cosmic =
    window.SlopesCosmic && window.SlopesCosmic.createCosmicSystem
      ? window.SlopesCosmic.createCosmicSystem()
      : null;
  // 5-Fold Non-Euclidean Scene Rotation Manifold (rotFacet 0..4: 3 rotations = mirror reverse, 5 rotations = identity)
  // Unify with the global singleton `window.SlopesRotation` so any external or internal rotation triggers animate on the main screen!
  const rotation = window.SlopesRotation || null;
  // Embodied Tab-Form Lifeforms (Hardcore-Tab + TabComputer terminal organisms running Claude Code inside their bodies)
  const tabForms =
    window.SlopesTabForms && window.SlopesTabForms.createTabFormSystem
      ? window.SlopesTabForms.createTabFormSystem()
      : null;

  const screen = primeRenderer ? primeRenderer.screen : ctx.createImageData(W, H);
  const tB = ctx.createImageData(W, TEXT_H);
  const tC = ctx.createImageData(W, TEXT_H);

  const font = window.fontArt;

  // --- Original pi-shift pixel & harmonic color primitives ---
  function pix(s, x, y, r, g, b, a) {
    if (s === screen && primeRenderer) {
      primeRenderer.coarsePix(x, y, r, g, b, a);
      return;
    }
    x = Math.floor(x);
    y = Math.floor(y);
    if (x >= s.width || x < 0 || y >= s.height || y < 0) return;
    if (a === undefined) a = 1;
    const idx = (x + y * s.width) * 4;
    const isEmptySky = s === screen && s.data[idx + 3] === 0;
    const baseR = isEmptySky ? cachedBgRgb[0] : s.data[idx + 0];
    const baseG = isEmptySky ? cachedBgRgb[1] : s.data[idx + 1];
    const baseB = isEmptySky ? cachedBgRgb[2] : s.data[idx + 2];
    s.data[idx + 0] = r * a + baseR * (1 - a);
    s.data[idx + 1] = g * a + baseG * (1 - a);
    s.data[idx + 2] = b * a + baseB * (1 - a);
    s.data[idx + 3] = 255;
  }

  function pixc(s, x, y, c, a) {
    pix(s, x, y, c[0], c[1], c[2], a);
  }

  function bgTint(m, tr, tg, tb, mix) {
    const base = bg(m);
    return [
      base[0] * (1 - mix) + tr * mix,
      base[1] * (1 - mix) + tg * mix,
      base[2] * (1 - mix) + tb * mix,
    ];
  }

  function updateCachedBg() {
    const raw = window.getComputedStyle(canvas).backgroundColor;
    const parts = raw.substring(4, raw.length - 1).split(",");
    if (parts.length >= 3) {
      cachedBgRgb = [
        parseFloat(parts[0]) || 0,
        parseFloat(parts[1]) || 0,
        parseFloat(parts[2]) || 0,
      ];
    }
  }

  function bg(m) {
    if (m === undefined) m = 1;
    return [cachedBgRgb[0] * m, cachedBgRgb[1] * m, cachedBgRgb[2] * m];
  }

  function clean(s) {
    if (s === screen && primeRenderer) {
      primeRenderer.clearScreen();
      return;
    }
    for (let i = 0; i < s.data.length; i += 4) {
      s.data[i + 0] = 0;
      s.data[i + 1] = 0;
      s.data[i + 2] = 0;
      s.data[i + 3] = 0;
    }
  }

  function drawRect(s, x, y, w, h, c, a) {
    if (s === screen && primeRenderer) {
      primeRenderer.coarseRect(x, y, w, h, c, a);
      return;
    }
    for (let xi = x; xi < x + w; xi++) {
      for (let yi = y; yi < y + h; yi++) {
        pixc(s, xi, yi, c, a);
      }
    }
  }

  // --- Original pi-shift proportional font renderer (ahoy_art_deco.64c) ---
  function drawString(s, x, y, str, r, g, b, a) {
    if (!font) return;
    for (let i = 0; i < str.length; i++) {
      const letter = str.charCodeAt(i) & 0xff;
      for (let line = 0; line < 8; line++) {
        const c = font[letter * 8 + line];
        if (c & 0x80) pix(s, x + i * 8 + 0, y + line, r, g, b, a);
        if (c & 0x40) pix(s, x + i * 8 + 1, y + line, r, g, b, a);
        if (c & 0x20) pix(s, x + i * 8 + 2, y + line, r, g, b, a);
        if (c & 0x10) pix(s, x + i * 8 + 3, y + line, r, g, b, a);
        if (c & 0x08) pix(s, x + i * 8 + 4, y + line, r, g, b, a);
        if (c & 0x04) pix(s, x + i * 8 + 5, y + line, r, g, b, a);
        if (c & 0x02) pix(s, x + i * 8 + 6, y + line, r, g, b, a);
        if (c & 0x01) pix(s, x + i * 8 + 7, y + line, r, g, b, a);
      }
    }
  }

  function letterLR(c) {
    const code = c.charCodeAt(0) & 0xff;
    let acc = 0;
    for (let i = 0; i < 8; i++) {
      acc |= font[code * 8 + i];
    }
    let l = 0;
    while (l < 8) {
      if ((acc << l) & 0x80) break;
      l++;
    }
    let r = 0;
    while (r < 8) {
      if ((acc >> r) & 0x01) break;
      r++;
    }
    return [l, r];
  }

  function textProp(s, x, y, string, color) {
    let offset = 0;
    for (let i = 0; i < string.length; i++) {
      const ch = string[i];
      if (ch === " ") {
        offset += 4;
      } else {
        const lr = letterLR(ch);
        offset -= lr[0];
        drawString(s, x + offset, y, ch, color[0], color[1], color[2], 1);
        offset += 8 - lr[1];
        offset += 2;
      }
    }
    if (offset >= 2) offset -= 2;
    return offset;
  }

  function textCenter(s, string, y, color) {
    if (y === undefined) y = 0;
    if (color === undefined) color = [0, 0, 0];
    const r = textProp(tB, 0, 0, string, color);
    clean(tB);
    const x = WH - Math.round(r / 2);
    return textProp(s, x, y, string, color);
  }

  // --- Harmonic Sky & Biome Palettes ---
  const SKY_PALETTES = [
    "rgb(42, 161, 152)",   // Act I: Original pi-shift Cyan-Teal
    "rgb(58, 134, 168)",   // Act II: Coastal Cerulean
    "rgb(122, 118, 178)",  // Act III: Spooky Cave Violet-Slate
    "rgb(176, 124, 96)",   // Act IV: Amber Harbor Dusk
    "rgb(72, 158, 130)",   // Act V: Tachima Harmonic Emerald
    "rgb(92, 112, 162)",   // Starlight Indigo
  ];

  const BIOME_PALETTES = {
    surface:    "rgb(42, 161, 152)",
    crystal:    "rgb(46, 118, 156)", // Deep Laputa Aetherium Cavern
    mushroom:   "rgb(64, 136, 124)", // Bioluminescent Mycelial Grotto
    dwarf:      "rgb(138, 112, 88)", // Dwarf Forge & Digger Works
    underwater: "rgb(36, 114, 146)", // Abyssal Sunken Trench
    magma:      "rgb(164, 96, 82)",  // Magma Core & Obsidian Vault
    airships:   "rgb(74, 148, 182)", // Cloud Fleet Stratosphere
    raptors:    "rgb(112, 138, 168)",// Raptor Crags & Aerie Peaks
    castle:     "rgb(88, 156, 166)", // Floating Castle in the Sky (Laputa)
  };

  // --- The 5-Act Narrative Completing the 2018 Story + Multi-World Lore ---
  const STORY_ACTS = [
    {
      title: "ACT I: TACHIMA",
      lines: [
        ["YOU ARE MONOLITH", "GUARD THE TOWN"],
        ["ORANGE VILLAGERS", "BUILD AND GATHER"],
        ["TAMP (K) VEXARI", "AND BLACK GOO!"],
        ["SEER CROWS GUIDE", "YOU TO RELICS!"],
      ],
    },
    {
      title: "ACT II: AUTOMATA",
      lines: [
        ["FEED SPORES INTO", "COMPUTE VATS!"],
        ["7X7 VAT AUTOMATA", "BIRTH HELPERS!"],
        ["LIPID AUTOMATA", "SEVER GOO WEBS!"],
        ["ROLL ROCKS (L)", "INTO THE CAVE"],
      ],
    },
    {
      title: "ACT III: LUMINITE",
      lines: [
        ["DRILL DOWN (S)", "THROUGH BEDROCK"],
        ["BLUE LUMINITE", "HUMS IN CAVES"],
        ["HARVEST CRYSTALS", "TO FLOAT UPWARD"],
        ["DWARVES FORGE", "IN THE DEEP"],
      ],
    },
    {
      title: "ACT IV: SKY FLEET",
      lines: [
        ["WITH LUMINITE", "FLY UP (I / W)"],
        ["LAND ON FRIENDLY", "CLOUD AIRSHIPS"],
        ["WARM RAPTOR EGGS", "ON HIGH CRAGS"],
        ["SEEK VAELORIAN", "SKY CITADELS"],
      ],
    },
    {
      title: "ACT V: HARMONY",
      lines: [
        ["ABOVE AND BELOW", "WORLDS CONNECT"],
        ["LUMINITE ROOTS", "PULSE AS ONE"],
        ["THE SLOPES OF A", "TOWN BY THE SEA"],
      ],
    },
  ];

  // --- Seeded RNG ---
  let masterSeed = (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0;
  let worldSeed = masterSeed;
  function srandom() {
    worldSeed = (worldSeed * 1664525 + 1013904223) >>> 0;
    return worldSeed / 4294967296;
  }
  function srandInt(min, max) {
    return Math.floor(srandom() * (max - min + 1)) + min;
  }
  function coordSeed(wx, wy) {
    let h = (masterSeed ^ Math.imul(wx + 1024, 374761393) ^ Math.imul(wy + 1024, 668265263)) >>> 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
    return (h ^ (h >>> 16)) >>> 0;
  }

  // --- World Grid Coordinates & Persistent World Cache ---
  let worldX = 0;
  let worldLayer = 0; // 0 = Surface Sea/Slopes, <0 = Subterranean Caves, >0 = Cloud/Sky Worlds
  let currentBiome = "surface";
  let currentBiomeLabel = "SEA SLOPES";
  const visitedWorlds = new Map();

  // --- Terrain & Layer Geometry ---
  const Blocks = new Array(W).fill(15);      // Surface height from bottom (0 = open sky gap in Sky worlds!)
  const Ceiling = new Array(W).fill(0);      // Cavern roof thickness from top (for Subterranean worlds < 0)
  const IslandBase = new Array(W).fill(0);   // Bottom underside elevation of floating islands (for Sky worlds > 0)

  // --- Player State & Attachable Modules ---
  const P = {
    x: 58,
    y: 20,
    e: 7,                // Binary antenna energy tower
    vy: 0,
    hopTimer: 0,
    airJumps: 0,
    carryingRock: false,
    facing: 1,
    drill: false,        // AUGER DRILL: Drill down (S) through bedrock into subterranean worlds
    aether: 0,           // AETHERIUM CRYSTALS: Levitation power to ascend (W/I) into sky worlds
    wings: false,        // SKY WING / PROPELLER: High-altitude flight & airship boarding
    forge: false,        // DWARF FORGE RESONATOR: Double Sonic Tamp radius & magma bridging
    raptorPet: false,    // Loyal hatched Sky-Raptor companion flying alongside Tachima!
    onAirship: null,     // Reference to airship currently stood upon
  };

  let health = 100;
  let maxHealth = 100;
  let score = 0;
  let cavesFed = 0;
  let veinsShattered = 0;
  let ringsFound = 0;
  let actIndex = 0;
  let lineIndex = 0;
  let skyMessage = ["THE SLOPES OF A", "TOWN BY THE SEA"];
  let skyMessageAlpha = 0;
  let skyMessageTarget = 1;
  let skyMessageTimer = 220;
  let skyQueue = [];

  let seaSide = "left";
  let seaLevel = 12;
  let isMagmaBasin = false;
  let frameCount = 0;
  let shakeFrames = 0;
  let transitionFlash = 0;
  let paused = false;

  // --- Dynamic Entities per Screen ---
  let Rocks = [];
  let Caves = [];
  let TarVeins = [];
  let Worms = [];
  let Relics = [];          // type: "ring" | "led" | "drill" | "aether" | "wing"
  let Towns = [];           // type: "cottage" | "lighthouse" | "harp" | "beacon"
  let Crystals = [];        // Glowing blue Aetherium crystal clusters (Castle in the Sky)
  let Mushrooms = [];       // Giant bouncy bioluminescent mushrooms
  let Dwarves = [];         // Friendly subterranean Dwarf Tinkers & Forges
  let Kelp = [];            // Swaying underwater kelp & bubble vents
  let Airships = [];        // Floating Airships (type: "friendly" | "pirate")
  let Raptors = [];         // Swooping Sky Raptors & Mountain Nests with Eggs
  let Nests = [];           // Raptor mountain nests with hatchable eggs
  let Castles = [];         // Floating Castles in the Sky with Aetherium roots
  let Shafts = [];          // Vertical drill shafts / sky beams connecting screens
  let Shockwaves = [];
  let Particles = [];
  let Clouds = [];
  let Stars = [];

  // Vermuna (The Large Bird / Companion overhead)
  const Vermuna = {
    active: false,
    x: -10,
    y: 9,
    vx: 0.45,
    wingPhase: 0,
    dropX: 40,
    dropped: false,
    rescueMode: false,
    cooldown: 90,
  };

  function announceSky(line1, line2, holdFrames = 195) {
    skyQueue.push({
      lines: [line1 || "", line2 || ""],
      hold: holdFrames,
    });
  }

  function getAttachmentSummary() {
    const list = [];
    if (P.drill) list.push("DRL");
    if (P.aether > 0) list.push("AET:" + P.aether);
    if (P.wings) list.push("WNG");
    if (P.raptorPet) list.push("RPT");
    return list.length > 0 ? list.join("+") : "NONE";
  }

  function advanceActIfReady() {
    const progress =
      cavesFed * 2 +
      veinsShattered +
      Towns.length +
      ringsFound +
      (P.drill ? 3 : 0) +
      P.aether * 2 +
      (P.wings ? 4 : 0) +
      Math.abs(worldLayer) * 3;
    const targetAct = Math.min(STORY_ACTS.length - 1, Math.floor(progress / 5));
    if (targetAct > actIndex) {
      actIndex = targetAct;
      lineIndex = 0;
      if (worldLayer === 0) {
        canvas.style.backgroundColor = SKY_PALETTES[actIndex % SKY_PALETTES.length];
      }
      const act = STORY_ACTS[actIndex];
      announceSky(act.title, act.lines[0][0], 200);
      announceSky(act.lines[0][0], act.lines[0][1], 200);
      if (window.SlopesAudio) {
        window.SlopesAudio.playCaveFanfare(actIndex);
      }
    }
  }

  // ============================================================================
  // MULTI-WORLD SAVE / LOAD & ALGORITHMIC BIOME GENERATION
  // ============================================================================
  function worldKey(wx, wl) {
    return `${wx},${wl}`;
  }

  function saveCurrentWorldState() {
    visitedWorlds.set(worldKey(worldX, worldLayer), {
      biome: currentBiome,
      biomeLabel: currentBiomeLabel,
      seaSide,
      seaLevel,
      isMagmaBasin,
      blocks: Blocks.slice(),
      ceiling: Ceiling.slice(),
      islandBase: IslandBase.slice(),
      caves: JSON.parse(JSON.stringify(Caves)),
      tarVeins: JSON.parse(JSON.stringify(TarVeins)),
      worms: JSON.parse(JSON.stringify(Worms)),
      relics: JSON.parse(JSON.stringify(Relics)),
      towns: JSON.parse(JSON.stringify(Towns)),
      crystals: JSON.parse(JSON.stringify(Crystals)),
      mushrooms: JSON.parse(JSON.stringify(Mushrooms)),
      dwarves: JSON.parse(JSON.stringify(Dwarves)),
      kelp: JSON.parse(JSON.stringify(Kelp)),
      airships: JSON.parse(JSON.stringify(Airships)),
      raptors: JSON.parse(JSON.stringify(Raptors)),
      nests: JSON.parse(JSON.stringify(Nests)),
      castles: JSON.parse(JSON.stringify(Castles)),
      shafts: JSON.parse(JSON.stringify(Shafts)),
    });
  }

  function pickBiomeForLayer(wx, wl) {
    if (wl === 0) return { id: "surface", label: "SEA SLOPES" };
    const h = Math.abs(wx * 7 + wl * 13);
    if (wl < 0) {
      // Subterranean worlds: Layer -1 favors Crystal/Mushroom/Dwarf, deeper adds Underwater & Magma
      const subBiomes =
        wl === -1
          ? [
              { id: "crystal",    label: "LUMINITE CAVE" },
              { id: "mushroom",   label: "MYCELIAL GROTTO" },
              { id: "dwarf",      label: "DWARF FORGE" },
              { id: "underwater", label: "ABYSSAL SEA" },
            ]
          : [
              { id: "crystal",    label: "NOCTILITH GEODE" },
              { id: "magma",      label: "MAGMA VAULT" },
              { id: "dwarf",      label: "DIGGER DEPTHS" },
              { id: "underwater", label: "SUNKEN TRENCH" },
              { id: "mushroom",   label: "SPORE ABYSS" },
            ];
      return subBiomes[h % subBiomes.length];
    } else {
      // Sky worlds: Layer +1 favors Airships & Raptor Mountains, Layer >= +2 favors Floating Castles!
      const skyBiomes =
        wl === 1
          ? [
              { id: "airships", label: "SKY AIRSHIPS" },
              { id: "raptors",  label: "RAPTOR CRAGS" },
              { id: "castle",   label: "FLOATING CASTLE" },
            ]
          : [
              { id: "castle",   label: "VAELORIAN CITADEL" },
              { id: "airships", label: "CLOUD ARMADA" },
              { id: "raptors",  label: "AERIE PEAKS" },
            ];
      return skyBiomes[h % skyBiomes.length];
    }
  }

  function getWorldBundle() {
    return {
      Blocks,
      Ceiling,
      IslandBase,
      seaLevel,
      worldLayer,
      worldX,
      currentBiome,
      Towns,
      Caves,
      TarVeins,
      Worms,
      Shafts,
      Crystals,
      Relics,
      Airships,
      Raptors,
      Nests,
      Castles,
      Mushrooms,
      Dwarves,
      Kelp,
      Rocks,
      P,
      frameCount,
      healHealth,
      announceSky,
      eco: ecology ? ecology.eco : null,
      cosmic: cosmic ? cosmic.cosmic : null,
    };
  }

  function loadOrGenerateScreen(wx, wl, entryDir, prevPlayerState) {
    worldX = wx;
    worldLayer = wl;
    Rocks = [];
    Shockwaves = [];
    Particles = [];
    P.onAirship = null;

    const prevX = prevPlayerState && typeof prevPlayerState.x === "number" ? prevPlayerState.x : P.x;
    const prevY = prevPlayerState && typeof prevPlayerState.y === "number" ? prevPlayerState.y : P.y;
    const prevGroundH = prevPlayerState && typeof prevPlayerState.groundH === "number" ? prevPlayerState.groundH : (Blocks[prevX] || 16);
    const prevHopTimer = prevPlayerState && typeof prevPlayerState.hopTimer === "number" ? prevPlayerState.hopTimer : P.hopTimer;
    const airOffset = Math.max(0, prevY - prevGroundH);

    // Pre-assign P.x for the new screen BEFORE populating sub-engines!
    if (entryDir === "left") {
      P.x = W - 2;
    } else if (entryDir === "right") {
      P.x = 1;
    } else if (entryDir === "up" || entryDir === "down") {
      P.x = Math.max(2, Math.min(W - 3, prevX));
    }

    const key = worldKey(wx, wl);
    const wasVisited = visitedWorlds.has(key);
    if (wasVisited) {
      const saved = visitedWorlds.get(key);
      currentBiome = saved.biome;
      currentBiomeLabel = saved.biomeLabel;
      seaSide = saved.seaSide;
      seaLevel = saved.seaLevel;
      isMagmaBasin = saved.isMagmaBasin;
      for (let i = 0; i < W; i++) {
        Blocks[i] = saved.blocks[i];
        Ceiling[i] = saved.ceiling[i];
        IslandBase[i] = saved.islandBase[i];
      }
      Caves = JSON.parse(JSON.stringify(saved.caves));
      TarVeins = JSON.parse(JSON.stringify(saved.tarVeins));
      Worms = JSON.parse(JSON.stringify(saved.worms));
      Relics = JSON.parse(JSON.stringify(saved.relics));
      Towns = JSON.parse(JSON.stringify(saved.towns));
      Crystals = JSON.parse(JSON.stringify(saved.crystals));
      Mushrooms = JSON.parse(JSON.stringify(saved.mushrooms));
      Dwarves = JSON.parse(JSON.stringify(saved.dwarves));
      Kelp = JSON.parse(JSON.stringify(saved.kelp));
      Airships = JSON.parse(JSON.stringify(saved.airships));
      Raptors = JSON.parse(JSON.stringify(saved.raptors));
      Nests = JSON.parse(JSON.stringify(saved.nests));
      Castles = JSON.parse(JSON.stringify(saved.castles));
      Shafts = JSON.parse(JSON.stringify(saved.shafts));
    } else {
      generateFreshScreen(wx, wl, entryDir, prevGroundH);
    }

    // Apply biome sky/background palette
    canvas.style.backgroundColor = BIOME_PALETTES[currentBiome] || SKY_PALETTES[0];
    updateCachedBg();

    // Seamlessly stitch entry terrain & compute physically accurate entry (P.x, P.y) across frame borders!
    if (entryDir === "left" || entryDir === "right") {
      if (!wasVisited && worldLayer <= 0) {
        // Blend the entry edge of a fresh screen toward prevGroundH so the horizon slope is continuous
        const targetEdgeH = Math.max(seaLevel, Math.min(42, Math.round(prevGroundH)));
        const span = 10;
        for (let i = 0; i < span; i++) {
          const col = entryDir === "right" ? i : W - 1 - i;
          const u = i / span;
          Blocks[col] = Math.round(targetEdgeH * (1 - u) + Blocks[col] * u);
        }
      } else if (worldLayer > 0 && Blocks[P.x] <= 2) {
        // In Sky worlds, ensure a cloud landing ledge at the entry border at the player's arrival elevation
        const ledgeH = Math.max(10, Math.min(H - 16, Math.round(prevY)));
        for (let dx = -3; dx <= 3; dx++) {
          const cx = Math.max(1, Math.min(W - 2, P.x + dx));
          if (Blocks[cx] <= 2) {
            Blocks[cx] = ledgeH;
            IslandBase[cx] = Math.max(4, ledgeH - 5);
          }
        }
      }
      const entryGround = Blocks[P.x] > 0 ? Blocks[P.x] : Math.max(12, Math.round(prevY));
      P.y = Math.max(entryGround, Math.min(H - 4, entryGround + airOffset));
      if (airOffset > 0 || prevHopTimer > 0) {
        P.hopTimer = Math.max(prevHopTimer, 14);
      }
    } else if (entryDir === "down") {
      // Entered from ABOVE (dug/drilled down through floor or dropped out of sky):
      // Carve an entry skylight shaft in the ceiling at P.x and appear at the VERY TOP of the screen below!
      if (worldLayer < 0) {
        for (let dx = -2; dx <= 2; dx++) {
          const cx = Math.max(2, Math.min(W - 3, P.x + dx));
          Ceiling[cx] = 0;
        }
        if (!Shafts.some((s) => Math.abs(s.x - P.x) <= 3)) {
          Shafts.push({ x: P.x, dir: "up" });
        }
      }
      if (worldLayer <= 0 && Blocks[P.x] < 14) {
        Blocks[P.x] = 16;
      }
      // Appear right at the top border of the new screen (y = H - 3 = 72) and descend smoothly to the ground!
      P.y = H - 3;
      P.hopTimer = 140;
      P.descendingFromAbove = true;
    } else if (entryDir === "up") {
      // Entered from BELOW (climbed/flew up out of the top of the lower screen):
      // Appear at the VERY BOTTOM of the upper screen (y = 2) at the exact same P.x and rise onto the ledge!
      if (worldLayer > 0) {
        const entryLedgeH = 10;
        for (let dx = -3; dx <= 3; dx++) {
          const cx = Math.max(2, Math.min(W - 3, P.x + dx));
          if (Blocks[cx] <= 2 || Blocks[cx] > 22) {
            Blocks[cx] = entryLedgeH;
            IslandBase[cx] = 5;
          }
        }
        if (!Shafts.some((s) => Math.abs(s.x - P.x) <= 3)) {
          Shafts.push({ x: P.x, dir: "down" });
        }
        P.y = 2;
        P.hopTimer = 24;
      } else {
        P.y = 2;
        P.hopTimer = 24;
      }
    } else if (entryDir === "init") {
      P.x = 56;
      P.y = Blocks[P.x] || 20;
    }

    // Now populate ecology, cosmic, tabForms, and 5-fold rotation manifold WITH the updated P.x and P.y!
    worldSeed = coordSeed(wx, wl);
    if (ecology) {
      ecology.populateScreen(
        {
          Blocks,
          seaLevel,
          worldLayer: wl,
          Towns,
          TarVeins,
          Crystals,
          Relics,
          P,
        },
        srandom,
        srandInt
      );
    }
    if (cosmic) {
      cosmic.populateScreen(
        getWorldBundle(),
        ecology ? ecology.eco : null,
        srandom,
        srandInt
      );
    }
    if (tabForms) {
      tabForms.populateScreen(
        getWorldBundle(),
        ecology ? ecology.eco : null,
        cosmic ? cosmic.cosmic : null,
        srandom,
        srandInt
      );
    }

    if (rotation) {
      rotation.resetForNewWorld(
        getWorldBundle(),
        ecology ? ecology.eco : null,
        cosmic ? cosmic.cosmic : null,
        tabForms ? tabForms.tabForms : null
      );
    }

    saveCurrentWorldState();
  }

  function generateFreshScreen(wx, wl) {
    worldSeed = coordSeed(wx, wl);

    Caves = [];
    TarVeins = [];
    Worms = [];
    Relics = [];
    Towns = [];
    Crystals = [];
    Mushrooms = [];
    Dwarves = [];
    Kelp = [];
    Airships = [];
    Raptors = [];
    Nests = [];
    Castles = [];
    Shafts = [];
    Clouds = [];
    Stars = [];
    Ceiling.fill(0);
    IslandBase.fill(0);
    isMagmaBasin = false;

    const bInfo = pickBiomeForLayer(wx, wl);
    currentBiome = bInfo.id;
    currentBiomeLabel = bInfo.label;

    const phase1 = srandom() * Math.PI * 2;
    const phase2 = srandom() * Math.PI * 2;

    if (wl === 0) {
      // ======================================================================
      // LAYER 0: SURFACE COASTAL SLOPES & TOWN BY THE SEA
      // ======================================================================
      const archetypes = ["left_sea", "right_sea", "twin_cove", "fjord"];
      const arch = archetypes[srandInt(0, archetypes.length - 1)];
      seaSide = arch;
      seaLevel = srandInt(11, 15);
      const ridgeX = srandInt(40, 80);
      const ridgeH = srandInt(33, 42);

      for (let x = 0; x < W; x++) {
        let h = 21 + Math.sin(x * 0.065 + phase1) * 7.5 + Math.cos(x * 0.14 + phase2) * 3.5;
        const distRidge = Math.abs(x - ridgeX);
        h += Math.max(0, (27 - distRidge) * 0.55);

        if (arch === "left_sea" && x < 24) {
          h = Math.min(h, seaLevel - 4 + Math.floor(x * 0.35));
        } else if (arch === "right_sea" && x > W - 25) {
          h = Math.min(h, seaLevel - 4 + Math.floor((W - 1 - x) * 0.35));
        } else if (arch === "twin_cove" && (x < 18 || x > W - 19)) {
          const edge = Math.min(x, W - 1 - x);
          h = Math.min(h, seaLevel - 3 + Math.floor(edge * 0.4));
        } else if (arch === "fjord" && Math.abs(x - 34) < 9) {
          h = seaLevel - 3 + Math.floor(Math.abs(x - 34) * 0.8);
        }
        Blocks[x] = Math.max(4, Math.min(ridgeH, Math.round(h)));
      }

      // Initial coastal cottage on overlook
      const townX = Math.max(22, Math.min(W - 22, ridgeX + (srandom() < 0.5 ? -12 : 12)));
      const townElev = Math.max(seaLevel + 4, Blocks[townX]);
      Blocks[townX - 1] = townElev;
      Blocks[townX] = townElev;
      Blocks[townX + 1] = townElev;
      Towns.push({ x: townX, type: "cottage", pulse: 0 });

      // 3 Spooky Caves (feeding any cave or digging near it lets you drill into the Underground!)
      spawnCave(Math.max(18, Math.min(W - 19, ridgeX - srandInt(15, 26))));
      spawnCave(Math.max(18, Math.min(W - 19, ridgeX + srandInt(15, 26))));
      spawnCave();

      // 3 Subterranean Ember-Tar Veins
      spawnTarVein(Math.max(16, Math.min(W - 16, ridgeX + srandInt(-20, -7))), 0.45);
      spawnTarVein(Math.max(16, Math.min(W - 16, ridgeX + srandInt(7, 20))), 0.32);
      spawnTarVein(undefined, 0.2);

      // 2 Subterranean Rust-Worms
      spawnWorm();
      spawnWorm();

      // Bury an AUGER DRILL relic near the player + an AETHERIUM crystal cluster & Golden Rings!
      const drillX = Math.max(18, Math.min(W - 19, ridgeX + srandInt(-6, 6)));
      spawnRelic(drillX, Math.max(4, Blocks[drillX] - 3), "drill");
      spawnCrystalCluster(Math.max(16, Math.min(W - 17, ridgeX + srandInt(-14, 14))), true);

      for (let i = 0; i < 8; i++) {
        spawnRelic();
      }

      // Spawn 1 rolling Round Rock immediately
      const rockStart = Math.max(14, Math.min(W - 15, ridgeX + srandInt(-4, 4)));
      Rocks.push({
        x: rockStart,
        y: Blocks[rockStart] + 8,
        vx: srandom() < 0.5 ? -0.28 : 0.28,
        vy: 0,
        spin: 0,
      });

      triggerVermuna(false, 40);
    } else if (wl < 0) {
      // ======================================================================
      // SUBTERRANEAN WORLDS (Layers -1, -2, -3...):
      // Crystal Caverns, Mushroom Grottos, Dwarf Forges, Underwater, Magma
      // ======================================================================
      seaLevel = currentBiome === "underwater" ? 56 : currentBiome === "magma" ? 13 : 0;
      isMagmaBasin = currentBiome === "magma";

      for (let x = 0; x < W; x++) {
        let h = 16 + Math.sin(x * 0.08 + phase1) * 6 + Math.cos(x * 0.17 + phase2) * 3.5;
        if (currentBiome === "magma" && Math.abs(x - 60) < 22 && Math.sin(x * 0.18) > 0.1) {
          h = Math.min(h, seaLevel - 3); // Glowing magma lakes
        }
        Blocks[x] = Math.max(4, Math.min(34, Math.round(h)));

        // Cavern ceiling stalactites hanging from top of screen
        const ceil = 5 + Math.round((0.5 + 0.5 * Math.sin(x * 0.11 + phase2)) * 8);
        Ceiling[x] = (x > 8 && x < W - 9) ? ceil : ceil + 3;
      }

      // Spawn glowing blue Aetherium Crystals (Castle in the Sky levitation veins!)
      const crystalCount = currentBiome === "crystal" ? 7 : 4;
      for (let i = 0; i < crystalCount; i++) {
        const cx = srandInt(12, W - 13);
        const onCeiling = currentBiome === "crystal" && i % 2 === 1;
        spawnCrystalCluster(cx, !onCeiling);
      }

      // Biome-specific subterranean wonders
      if (currentBiome === "mushroom" || currentBiome === "crystal") {
        const mCount = currentBiome === "mushroom" ? 7 : 3;
        for (let i = 0; i < mCount; i++) {
          const mx = srandInt(12, W - 13);
          Mushrooms.push({
            x: mx,
            h: srandInt(5, 9),
            capW: srandInt(5, 7),
            glow: srandom() * 6,
          });
        }
      }

      if (currentBiome === "dwarf" || currentBiome === "magma") {
        // Spawn friendly Dwarf Tinkers & Forges
        for (let i = 0; i < 3; i++) {
          const dx = srandInt(18, W - 19);
          Dwarves.push({
            x: dx,
            vx: (srandom() < 0.5 ? 1 : -1) * 0.12,
            hasForge: i === 0,
            forgeX: dx,
            giftReady: true,
          });
        }
      }

      if (currentBiome === "underwater") {
        // Swaying underwater kelp forests & rising bubble vents
        for (let i = 0; i < 9; i++) {
          Kelp.push({
            x: srandInt(8, W - 9),
            h: srandInt(7, 15),
            hasBubbles: i % 2 === 0,
            phase: srandom() * 6,
          });
        }
      }

      // Subterranean caves, worms, tar veins, and relics
      spawnCave();
      spawnCave();
      spawnTarVein(undefined, 0.35);
      if (currentBiome === "magma") spawnTarVein(undefined, 0.55);
      spawnWorm();
      for (let i = 0; i < 7; i++) {
        spawnRelic(undefined, undefined, i === 0 ? "aether" : i === 1 ? "drill" : undefined);
      }
      Rocks.push({
        x: srandInt(25, W - 26),
        y: 26,
        vx: 0.25,
        vy: 0,
        spin: 0,
      });
    } else {
      // ======================================================================
      // SKY & CLOUD WORLDS (Layers +1, +2, +3...):
      // Floating Airships, Raptor Mountains with Eggs, Floating Castles (Laputa)
      // ======================================================================
      seaLevel = 0;
      isMagmaBasin = false;
      Blocks.fill(0);
      IslandBase.fill(0);

      if (currentBiome === "raptors") {
        // Jagged Raptor Mountain Crags rising from cloud floor + floating aerie ledges
        for (let x = 0; x < W; x++) {
          const crag = 12 + Math.sin(x * 0.075 + phase1) * 14 + Math.cos(x * 0.19 + phase2) * 7;
          if (crag > 8) {
            Blocks[x] = Math.min(48, Math.round(crag));
            IslandBase[x] = Math.max(0, Math.round( 4 + Math.sin(x * 0.12) * 4));
          }
        }
        // Place 3 Raptor Nests with speckled Eggs on the highest crags!
        for (let n = 0; n < 3; n++) {
          const nx = srandInt(18 + n * 30, 34 + n * 30);
          const peakH = Math.max(24, Blocks[nx] || 26);
          Blocks[nx - 1] = peakH;
          Blocks[nx] = peakH;
          Blocks[nx + 1] = peakH;
          IslandBase[nx - 1] = Math.min(IslandBase[nx - 1], 8);
          IslandBase[nx] = Math.min(IslandBase[nx], 6);
          IslandBase[nx + 1] = Math.min(IslandBase[nx + 1], 8);
          Nests.push({
            x: nx,
            hasEgg: true,
            warmth: 0,
            hatched: false,
          });
          Raptors.push({
            x: nx,
            y: H - peakH - 12,
            homeX: nx,
            homeY: H - peakH - 12,
            phase: srandom() * 6,
            friendly: false,
          });
        }
      } else {
        // Floating Sky Islands (with tapered Castle-in-the-Sky hanging roots & Aetherium underside!)
        const islandCenters = currentBiome === "castle"
          ? [24, 60, 96]
          : [20, 48, 78, 104];
        islandCenters.forEach((ic, idx) => {
          const halfW = currentBiome === "castle" && idx === 1 ? 20 : srandInt(9, 13);
          const topH = currentBiome === "castle" && idx === 1 ? 30 : srandInt(18, 34);
          for (let dx = -halfW; dx <= halfW; dx++) {
            const x = ic + dx;
            if (x < 2 || x >= W - 2) continue;
            const norm = 1 - Math.abs(dx) / (halfW + 1);
            const surface = Math.round(topH + Math.sin(dx * 0.3) * 1.5);
            const rootDepth = Math.round(norm * norm * (currentBiome === "castle" && idx === 1 ? 18 : 11));
            Blocks[x] = surface;
            IslandBase[x] = Math.max(2, surface - Math.max(3, rootDepth));
          }
        });
      }

      // If Floating Castle biome (or high layer), place a grand Laputa Floating Castle with Aetherium Root!
      if (currentBiome === "castle" || wl >= 2) {
        const cx = 60;
        const ch = Math.max(28, Blocks[cx] || 28);
        for (let dx = -9; dx <= 9; dx++) {
          Blocks[cx + dx] = ch;
          IslandBase[cx + dx] = Math.max(4, ch - 16 + Math.abs(dx));
        }
        Castles.push({
          x: cx,
          activated: false,
          pulse: 0,
        });
        // Giant Aetherium Root Crystal cluster beneath the castle
        spawnCrystalCluster(cx, false);
        spawnCrystalCluster(cx - 4, true);
        spawnCrystalCluster(cx + 4, true);
      }

      // Spawn Floating Airships (Friendly trader airships to land on + Pirate airships to battle!)
      const shipCount = currentBiome === "airships" ? 4 : 2;
      for (let i = 0; i < shipCount; i++) {
        const isFriendly = i % 2 === 0;
        Airships.push({
          x: 20 + i * 26,
          y: isFriendly ? srandInt(34, 46) : srandInt(22, 32), // Elevation from bottom (Blocks-style coordinate)
          vx: (i % 2 === 0 ? 1 : -1) * (0.14 + srandom() * 0.08),
          type: isFriendly ? "friendly" : "pirate",
          hp: isFriendly ? 99 : 2,
          bombTimer: srandInt(90, 180),
          propPhase: srandom() * 6,
        });
      }

      // Spawn a few Aetherium crystals & sky relics on the islands
      for (let i = 0; i < 4; i++) {
        const rx = srandInt(16, W - 17);
        if (Blocks[rx] > 0) {
          spawnCrystalCluster(rx, true);
        }
      }
    }

    // Populate atmospheric clouds & stars
    for (let i = 0; i < 5; i++) {
      Clouds.push({
        x: srandInt(0, W - 1),
        y: srandInt(25, 34),
        w: srandInt(9, 18),
        vx: (srandom() * 0.045 + 0.015) * (srandom() < 0.5 ? 1 : -1),
      });
    }
    for (let i = 0; i < 16; i++) {
      Stars.push({
        x: srandInt(2, W - 3),
        y: srandInt(2, 28),
        phase: srandom() * Math.PI * 2,
      });
    }
  }

  function spawnCrystalCluster(x, onFloor = true) {
    const clampedX = Math.max(6, Math.min(W - 7, x));
    Crystals.push({
      x: clampedX,
      onFloor,
      size: srandInt(3, 5),
      charges: 2,
      phase: srandom() * 6,
    });
  }

  function generateWorld(customSeed) {
    if (customSeed !== undefined) {
      masterSeed = customSeed >>> 0;
    } else {
      masterSeed = (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0;
    }
    visitedWorlds.clear();

    health = 100;
    score = 0;
    cavesFed = 0;
    veinsShattered = 0;
    ringsFound = 0;
    actIndex = 0;
    lineIndex = 0;

    P.e = 7;
    P.carryingRock = false;
    P.hopTimer = 0;
    P.airJumps = 0;
    P.drill = false;
    P.aether = 0;
    P.wings = false;
    P.forge = false;
    P.raptorPet = false;
    P.onAirship = null;

    loadOrGenerateScreen(0, 0, "init");

    // Place Player near center ridge
    P.x = 56;
    P.y = Blocks[P.x];

    skyMessage = ["THE SLOPES OF A", "TOWN BY THE SEA"];
    skyMessageAlpha = 0.95;
    skyMessageTarget = 1;
    skyMessageTimer = 170;
    skyQueue = [];

    announceSky("GUARD ORANGE TOWN!", "TAMP (K) BLACK GOO", 180);
    announceSky("SEER CROWS FEED", "7X7 COMPUTE VATS!", 180);
  }

  function spawnCave(forcedX) {
    if (Caves.length >= 3) return;
    for (let tries = 0; tries < 20; tries++) {
      const x = forcedX !== undefined ? forcedX : srandInt(12, W - 13);
      if (Blocks[x] <= seaLevel + 2) {
        if (forcedX !== undefined) Blocks[x] = seaLevel + 5;
        else continue;
      }
      if (Caves.some((c) => Math.abs(c.x - x) < 9)) {
        if (forcedX === undefined) continue;
      }
      const depth = Math.min(Blocks[x] - 2, srandInt(3, 6));
      Caves.push({
        x,
        depth,
        hunger: 1,
        glow: 0,
        fedCount: 0,
      });
      return;
    }
  }

  function spawnTarVein(forcedX, initialProgress) {
    if (TarVeins.length >= 4) return;
    const x = forcedX !== undefined ? forcedX : srandInt(10, W - 11);
    if (TarVeins.some((v) => Math.abs(v.x - x) < 6)) return;
    TarVeins.push({
      x,
      progress: initialProgress !== undefined ? initialProgress : 0.1,
      speed: 0.0012 + srandom() * 0.0012 + actIndex * 0.0002,
      erupted: false,
      spread: 0,
      pulse: srandom() * 6,
    });
  }

  function spawnWorm() {
    if (Worms.length >= 2) return;
    const goRight = srandom() < 0.5;
    const x = goRight ? srandInt(8, 25) : srandInt(W - 26, W - 9);
    Worms.push({
      x,
      y: Math.max(4, Math.min(14, (Blocks[x] || 12) - srandInt(4, 8))),
      vx: (goRight ? 1 : -1) * (0.06 + srandom() * 0.04),
      stunTimer: 0,
      segments: [
        { x, y: 8 },
        { x: x - (goRight ? 1 : -1), y: 8 },
        { x: x - (goRight ? 2 : -2), y: 8 },
        { x: x - (goRight ? 3 : -3), y: 8 },
      ],
    });
  }

  function spawnRelic(forcedX, forcedElev, forcedType) {
    if (Relics.length >= 12) return;
    const x = forcedX !== undefined ? forcedX : srandInt(10, W - 11);
    const maxElev = Math.max(3, (Blocks[x] || 10) - 2);
    const elev = forcedElev !== undefined ? forcedElev : srandInt(2, Math.max(2, maxElev));
    const r = srandom();
    const type =
      forcedType ||
      (r < 0.4 ? "ring" : r < 0.7 ? "led" : r < 0.86 ? "aether" : "drill");
    Relics.push({
      x,
      elev,
      type,
      sparkle: srandom() * 6,
    });
  }

  function triggerVermuna(rescue = false, delayFrames = 0) {
    if (delayFrames > 0) {
      Vermuna.cooldown = delayFrames;
      return;
    }
    Vermuna.active = true;
    Vermuna.rescueMode = rescue;
    const fromLeft = srandom() < 0.5;
    Vermuna.x = fromLeft ? -6 : W + 6;
    Vermuna.vx = (fromLeft ? 1 : -1) * (rescue ? 0.65 : 0.38);
    Vermuna.y = rescue ? Math.max(6, H - (Blocks[P.x] || 20) - 12) : srandInt(7, 13);
    Vermuna.dropX = rescue
      ? P.x
      : Math.max(12, Math.min(W - 13, P.x + srandInt(-14, 14)));
    Vermuna.dropped = false;
    if (window.SlopesAudio) {
      window.SlopesAudio.playVermunaCall();
    }
  }

  function addParticle(x, y, vx, vy, color, life) {
    if (Particles.length > 110) Particles.shift();
    Particles.push({ x, y, vx, vy, color, life, maxLife: life });
  }

  // ============================================================================
  // VERTICAL & HORIZONTAL SCREEN TRANSITIONS
  // ============================================================================
  function transitionToWorld(nextWX, nextWL, dir) {
    const prevPlayerState = {
      x: P.x,
      y: P.y,
      groundH: Blocks[P.x] || 16,
      hopTimer: P.hopTimer,
      prevLayer: worldLayer,
    };
    saveCurrentWorldState();
    transitionFlash = 14;
    loadOrGenerateScreen(nextWX, nextWL, dir, prevPlayerState);

    if (dir === "down") {
      if (window.SlopesAudio && window.SlopesAudio.playLayerTransition) {
        window.SlopesAudio.playLayerTransition(-1);
      }
      announceSky(
        worldLayer === 0 ? "RETURNED TO SEA" : `DEPTH ${Math.abs(worldLayer)}: ${currentBiomeLabel}`,
        worldLayer < 0 ? "MINE AETHERIUM!" : "DESCENDED FROM SKY!",
        185
      );
    } else if (dir === "up") {
      if (window.SlopesAudio && window.SlopesAudio.playLayerTransition) {
        window.SlopesAudio.playLayerTransition(1);
      }
      announceSky(
        worldLayer === 0 ? "RETURNED TO SEA" : `ALT +${worldLayer}: ${currentBiomeLabel}`,
        worldLayer > 0 ? "LAND ON AIRSHIPS!" : "THE COASTAL TOWN",
        185
      );
    } else if (dir === "left") {
      announceSky(`${currentBiomeLabel} (${worldX},${worldLayer})`, "NEW HORIZON", 140);
    } else if (dir === "right") {
      announceSky(`${currentBiomeLabel} (${worldX},${worldLayer})`, "NEW HORIZON", 140);
    }
    advanceActIfReady();
  }

  function damageHealth(amount, reasonText) {
    health = Math.max(0, health - amount);
    shakeFrames = Math.max(shakeFrames, 6);
    if (window.SlopesAudio) {
      window.SlopesAudio.noise(0.18, 220, 420);
    }
    if (reasonText && skyQueue.length === 0) {
      announceSky(reasonText[0], reasonText[1], 140);
    }
    if (health <= 0) {
      health = 70;
      P.e = Math.max(P.e, 6);
      TarVeins.forEach((v) => {
        if (Math.abs(v.x - P.x) <= 6) {
          v.erupted = false;
          v.progress = 0.15;
        }
      });
      let bestX = 58;
      let bestH = 0;
      for (let xi = 14; xi < W - 14; xi++) {
        if (Blocks[xi] > bestH) {
          bestH = Blocks[xi];
          bestX = xi;
        }
      }
      P.x = bestX;
      P.y = Math.max(18, Blocks[bestX] + 8);
      triggerVermuna(true, 0);
      announceSky("VERMUNA RESCUED", "TACHIMA IN TIME!", 190);
      if (window.SlopesAudio) {
        window.SlopesAudio.playCaveFanfare(actIndex);
      }
    }
  }

  function healHealth(amount) {
    health = Math.min(maxHealth, health + amount);
  }

  // ============================================================================
  // PLAYER CONTROLS & INTELLIGENT MULTI-WORLD ACTIONS
  // ============================================================================
  function moveHorizontal(dir) {
    if (paused) return;
    P.facing = dir;

    // If riding the Airship Castle Village, Left/Right steers the Airship!
    if (tabForms && tabForms.onAirshipPlayerControl && tabForms.onAirshipPlayerControl(dir < 0 ? "left" : "right", getWorldBundle())) {
      return;
    }

    const nx = P.x + dir;

    // Horizontal screen transition!
    if (nx < 1) {
      transitionToWorld(worldX - 1, worldLayer, "left");
      return;
    }
    if (nx >= W - 1) {
      transitionToWorld(worldX + 1, worldLayer, "right");
      return;
    }

    const curH = Blocks[P.x];
    const nextH = Blocks[nx];
    const maxStep = (P.aether > 0 || P.wings || P.raptorPet) ? 4 : 2;
    if (nextH - curH > maxStep && P.hopTimer <= 0 && !P.onAirship && nx > 2 && nx < W - 3) {
      if (window.SlopesAudio) {
        window.SlopesAudio.playPebble(420, 0.08);
      }
      Rocks.forEach((r) => {
        if (Math.abs(r.x - nx) < 2) r.vx += dir * 0.35;
      });
      return;
    }

    P.x = nx;
    if (P.hopTimer <= 0 && !P.onAirship && !P.descendingFromAbove && Blocks[P.x] > 0 && P.y <= Blocks[P.x] + 1.5) {
      P.y = Blocks[P.x];
    }
    if (window.SlopesAudio) {
      window.SlopesAudio.createOscillator(P.y);
      window.SlopesAudio.noise(0.04, 700, 1300);
    }
  }

  // Harvest nearby Aetherium Crystal cluster
  function checkCrystalHarvest(x, y) {
    for (let i = Crystals.length - 1; i >= 0; i--) {
      const cr = Crystals[i];
      const cy = cr.onFloor ? Blocks[cr.x] : H - Ceiling[cr.x] - cr.size;
      if (Math.abs(cr.x - x) <= 3 && Math.abs(cy - y) <= 6) {
        cr.charges--;
        P.aether = Math.min(9, P.aether + 1);
        P.e = Math.min(63, P.e + 6);
        healHealth(14);
        score += 250;

        for (let p = 0; p < 12; p++) {
          addParticle(
            cr.x,
            H - cy,
            (Math.random() - 0.5) * 1.4,
            -Math.random() * 1.5 - 0.2,
            [95, 245, 255],
            30
          );
        }
        if (window.SlopesAudio && window.SlopesAudio.playAetheriumChime) {
          window.SlopesAudio.playAetheriumChime();
        }
        if (cr.charges <= 0) {
          Crystals.splice(i, 1);
        }
        announceSky("LUMINITE CORE!", "LEVITATION +UP (I/W)", 175);
        advanceActIfReady();
        return true;
      }
    }
    return false;
  }

  // DOWN (S): Dig dirt into binary energy, harvest Aetherium/Relics, or DRILL DOWN into deeper world!
  function digAction() {
    if (paused) return;

    // 0. If riding the Airship Castle Village, pressing Down lowers you down the rope ladder
    //    (and slowly guides the Airship downward to meet you, or lets you off onto the ground!)
    if (tabForms && tabForms.onAirshipPlayerControl && tabForms.onAirshipPlayerControl("down", getWorldBundle())) {
      return;
    }

    // 1. Check if harvesting an Aetherium Crystal right beside us
    checkCrystalHarvest(P.x, P.y);

    // 1b. If the player is still descending through the air from the top of the screen
    //     (e.g. just dug down from the screen above), pressing Down accelerates downward descent
    //     rather than snapping P.y straight to the ground below!
    const groundHere = Blocks[P.x] || 2;
    if (P.y > groundHere + 1.5) {
      P.y = Math.max(groundHere, P.y - 2.6);
      if (P.y <= groundHere + 0.5) {
        P.descendingFromAbove = false;
        P.hopTimer = 0;
      }
      return;
    }
    P.descendingFromAbove = false;

    // 2. Check if standing inside a Spooky Cave entrance or at bottom bedrock -> DRILL DOWN!
    const inCaveHere = Caves.some(
      (c) => Math.abs(c.x - P.x) <= 2 && Blocks[P.x] <= c.depth + 3
    );

    if (Blocks[P.x] <= 3 || inCaveHere) {
      if (P.drill || inCaveHere || worldLayer > 0) {
        // Drill down into the next world below!
        if (!P.drill && inCaveHere) {
          P.drill = true;
        }
        Shafts.push({ x: P.x, dir: "down" });
        transitionToWorld(worldX, worldLayer - 1, "down");
        return;
      } else {
        // Grant Auger Drill right at bedrock if player dug all the way down with >= 8 binary energy!
        if (P.e >= 8) {
          P.drill = true;
          P.e -= 4;
          announceSky("AUGER DRILL FORGED", "FROM BINARY ENERGY!", 160);
          transitionToWorld(worldX, worldLayer - 1, "down");
          return;
        }
        if (window.SlopesAudio) {
          window.SlopesAudio.playPebble(0, 0.2);
        }
        announceSky("HARD BEDROCK!", "DIG 8 ENERGY OR CAVE", 150);
        return;
      }
    }

    // Standard digging (or faster 2-block Auger Drill digging!)
    const digAmt = P.drill && Blocks[P.x] > 5 ? 2 : 1;
    Blocks[P.x] = Math.max(2, Blocks[P.x] - digAmt);
    P.y = Blocks[P.x];
    P.e = Math.min(63, P.e + digAmt);
    score += 5 * digAmt;

    if (window.SlopesAudio) {
      window.SlopesAudio.createOscillator(P.y);
      window.SlopesAudio.playPebble(900 + P.y * 25, 0.14);
    }

    const sy = H - Blocks[P.x];
    for (let i = 0; i < 5; i++) {
      addParticle(
        P.x,
        sy,
        (Math.random() - 0.5) * 0.9,
        -Math.random() * 0.9 - 0.3,
        P.drill ? [255, 200, 85] : bg(0.45),
        18
      );
    }

    checkRelicPickup(P.x, Blocks[P.x]);

    Caves.forEach((c) => {
      if (Math.abs(c.x - P.x) <= 1 && c.depth > 1) {
        c.depth--;
      }
    });
  }

  // UP (W): Build dirt/cloud column, climb out of caverns, or ASCEND into the Sky Worlds!
  function buildAction() {
    if (paused) return;

    // If riding the Airship Castle Village, pressing Up climbs the rope or steers the Airship higher!
    if (tabForms && tabForms.onAirshipPlayerControl && tabForms.onAirshipPlayerControl("up", getWorldBundle())) {
      return;
    }

    // If near the top of the screen, check if we can ascend to worldLayer + 1!
    const topThreshold = worldLayer < 0 ? H - Math.max(4, Ceiling[P.x]) - 8 : H - 13;
    if (P.y >= topThreshold) {
      if (worldLayer < 0) {
        // Drill/climb back up through the cavern ceiling into the world above!
        Ceiling[P.x] = 0;
        transitionToWorld(worldX, worldLayer + 1, "up");
        return;
      } else if (P.aether > 0 || P.wings || P.raptorPet) {
        // Ascend into the Clouds / Sky Airships / Floating Castles!
        transitionToWorld(worldX, worldLayer + 1, "up");
        return;
      } else {
        announceSky("CLOUD CEILING!", "NEED AETHERIUM CORE", 160);
        return;
      }
    }

    // In Sky worlds, if standing over an open gap (Blocks[P.x] === 0), condense a cloud-stone bridge at P.y!
    if (worldLayer > 0 && Blocks[P.x] === 0) {
      const bridgeH = Math.max(10, Math.min(H - 14, Math.round(P.y)));
      Blocks[P.x] = bridgeH;
      IslandBase[P.x] = Math.max(4, bridgeH - 4);
      P.y = bridgeH;
    } else {
      Blocks[P.x]++;
      P.y = Blocks[P.x];
    }

    P.e = Math.max(-31, P.e - 1);
    score += 5;

    if (window.SlopesAudio) {
      window.SlopesAudio.createOscillator(P.y);
      window.SlopesAudio.playWood(58 + Math.floor(P.y / 2), 0.16);
    }

    TarVeins.forEach((v) => {
      if (Math.abs(v.x - P.x) <= 1 && v.erupted) {
        v.erupted = false;
        v.progress = Math.max(0.2, v.progress - 0.35);
        healHealth(6);
        score += 40;
      }
    });
  }

  // K (CROSS): Sonic Tamp — Shatter Tar Veins, Mine Aetherium, Attack Pirate Airships, or Activate Castles!
  function sonicTampAction() {
    if (paused) return;
    const startY = H - P.y;
    const maxR = P.forge ? 24 : 16;
    Shockwaves.push({
      x: P.x,
      y: startY,
      radius: 1,
      maxRadius: maxR,
    });

    let hits = 0;

    // 1. Resonant harvest of nearby Aetherium Crystals
    for (let i = Crystals.length - 1; i >= 0; i--) {
      const cr = Crystals[i];
      if (Math.abs(cr.x - P.x) <= 6) {
        checkCrystalHarvest(cr.x, cr.onFloor ? Blocks[cr.x] : H - Ceiling[cr.x] - cr.size);
        hits++;
      }
    }

    // 2. Attack Pirate Airships or Refuel on Friendly Airships!
    for (let i = Airships.length - 1; i >= 0; i--) {
      const sh = Airships[i];
      if (Math.abs(sh.x - P.x) <= 9 && Math.abs(sh.y - P.y) <= 14) {
        if (sh.type === "pirate") {
          sh.hp -= P.forge ? 2 : 1;
          hits++;
          score += 220;
          for (let p = 0; p < 14; p++) {
            addParticle(
              sh.x,
              H - sh.y,
              (Math.random() - 0.5) * 1.8,
              (Math.random() - 0.5) * 1.8,
              [255, 165, 75],
              28
            );
          }
          if (sh.hp <= 0) {
            P.aether = Math.min(9, P.aether + 2);
            P.wings = true;
            healHealth(25);
            score += 500;
            spawnCrystalCluster(Math.round(sh.x), true);
            Airships.splice(i, 1);
            announceSky("PIRATE SHIP DOWN!", "SKY WINGS ATTACHED!", 190);
          } else {
            announceSky("PIRATE HULL HIT!", "TAMP AGAIN (K)!", 130);
          }
        } else {
          // Friendly Airship trade/upgrade!
          P.wings = true;
          P.aether = Math.max(P.aether, 2);
          healHealth(30);
          P.e = Math.min(63, P.e + 8);
          announceSky("FRIENDLY AIRSHIP", "SKY WINGS EQUIPPED!", 175);
        }
      }
    }

    // 3. Activate Floating Castle Monolith!
    Castles.forEach((cas) => {
      if (Math.abs(cas.x - P.x) <= 9 && !cas.activated) {
        cas.activated = true;
        cas.pulse = 40;
        P.drill = true;
        P.wings = true;
        P.forge = true;
        P.aether = Math.min(9, P.aether + 3);
        healHealth(100);
        score += 1000;
        if (window.SlopesAudio && window.SlopesAudio.playAetheriumChime) {
          window.SlopesAudio.playAetheriumChime();
        }
        announceSky("CASTLE AWAKENED!", "ALL MODULES LINKED!", 220);
      }
    });

    // 4. Trade with subterranean Dwarf Forge
    Dwarves.forEach((dw) => {
      if (Math.abs(dw.x - P.x) <= 6) {
        P.drill = true;
        P.forge = true;
        healHealth(20);
        score += 250;
        announceSky("DWARF ANVIL RANG!", "DRILL + FORGE READY", 180);
        hits++;
      }
    });

    // 5. Cool Magma into solid Obsidian bridge in Magma Vaults!
    if (isMagmaBasin) {
      for (let dx = -4; dx <= 4; dx++) {
        const mx = Math.max(1, Math.min(W - 2, P.x + dx));
        if (Blocks[mx] < seaLevel) {
          Blocks[mx] = seaLevel + 1;
          hits++;
        }
      }
    }

    // 6. Shatter Tar Veins within radius
    const veinRange = P.forge ? 8 : 5;
    for (let i = TarVeins.length - 1; i >= 0; i--) {
      const v = TarVeins[i];
      if (Math.abs(v.x - P.x) <= veinRange) {
        hits++;
        veinsShattered++;
        score += 120;
        healHealth(10);
        const relicY = Math.max(3, Math.floor(v.progress * (Blocks[v.x] || 12)) - 1);
        // First shattered vein grants a Drill or Aetherium shard!
        const dropType = !P.drill ? "drill" : P.aether === 0 ? "aether" : "led";
        spawnRelic(v.x, relicY, dropType);
        for (let p = 0; p < 8; p++) {
          addParticle(
            v.x,
            H - relicY,
            (Math.random() - 0.5) * 1.2,
            (Math.random() - 0.5) * 1.2,
            [255, 220, 90],
            26
          );
        }
        TarVeins.splice(i, 1);
      }
    }

    // 7. Stun subterranean Rust-Worms
    Worms.forEach((w) => {
      if (Math.abs(w.x - P.x) <= 7 && w.stunTimer <= 0) {
        w.stunTimer = 180;
        hits++;
        score += 80;
        spawnRelic(Math.round(w.x), Math.round(w.y), "ring");
        announceSky("WORM STUNNED!", "RING UNEARTHED!", 150);
      }
    });

    // 8. Impulse nearby Round Rocks
    Rocks.forEach((r) => {
      const dx = r.x - P.x;
      if (Math.abs(dx) <= 6) {
        r.vx += (dx >= 0 ? 1 : -1) * 0.55;
        r.vy = 0.6;
      }
    });

    // 9. Purify Black Goo cells, sever Sticky Webs, banish Skeksis Cultists & catalyze Compute Vats!
    if (ecology) {
      const purified = ecology.onPlayerSonicTamp(
        { Blocks, Towns, P, healHealth, announceSky },
        P.x,
        P.forge ? 10 : 7
      );
      if (purified > 0) {
        hits += purified;
        score += purified * 95;
        healHealth(purified * 5);
        announceSky("MONOLITH PULSE!", "GOO & WEBS CLEAVED", 145);
      }
    }

    // 10. Activate nearby 100x Time-Dilation Crystal, trigger WASM Scientist Lab experiment, & seep WFC micro-masonry!
    if (cosmic) {
      const wb = getWorldBundle();
      const ecoRef = ecology ? ecology.eco : null;
      const nearCrystal = cosmic.cosmic.TimeCrystals.find((tc) => Math.abs(tc.x - P.x) <= 6);
      if (nearCrystal) {
        cosmic.activateTimeCrystal(wb, ecoRef, 100, 120);
        hits++;
        score += 350;
        if (window.SlopesAudio && window.SlopesAudio.playTimeCrystalWarp) {
          window.SlopesAudio.playTimeCrystalWarp(true);
        }
      }
      const nearLab = cosmic.cosmic.Labs.find((lb) => Math.abs(lb.x - P.x) <= 7);
      if (nearLab) {
        cosmic.triggerWasmExperiment(nearLab, wb, ecoRef);
        hits++;
        score += 280;
        if (window.SlopesAudio && window.SlopesAudio.playWasmDiscovery) {
          window.SlopesAudio.playWasmDiscovery(nearLab.faction);
        }
      }
      cosmic.triggerWfcSeepAt(P.x, P.y, undefined, "tamp");
    }

    if (window.SlopesAudio) {
      window.SlopesAudio.playSonicTamp(hits);
    }
    if (hits > 0) {
      advanceActIfReady();
    }
  }

  // L (CIRCLE): Grab / Form / Roll a Round Rock (feeds Caves, tames Raptors, cools Magma, hits Pirates)
  function rockAction() {
    if (paused) return;

    for (let i = 0; i < Rocks.length; i++) {
      const r = Rocks[i];
      if (Math.abs(r.x - P.x) <= 3) {
        if (!P.carryingRock) {
          P.carryingRock = true;
          Rocks.splice(i, 1);
          if (window.SlopesAudio) {
            window.SlopesAudio.playWood(66, 0.22);
          }
          return;
        }
      }
    }

    const baseElev = Math.max(P.y, Blocks[P.x] || 14);
    if (P.carryingRock) {
      P.carryingRock = false;
      const rx = Math.max(2, Math.min(W - 3, P.x + P.facing * 2));
      Rocks.push({
        x: rx,
        y: baseElev + 2,
        vx: P.facing * 0.65,
        vy: 0.3,
        spin: 0,
      });
      if (window.SlopesAudio) {
        window.SlopesAudio.playWood(62, 0.24);
      }
      return;
    }

    if (P.e >= 1 || Rocks.length === 0) {
      if (P.e >= 1) P.e -= 1;
      const rx = Math.max(2, Math.min(W - 3, P.x + P.facing * 2));
      Rocks.push({
        x: rx,
        y: baseElev + 2,
        vx: P.facing * 0.58,
        vy: 0.25,
        spin: 0,
      });
      if (window.SlopesAudio) {
        window.SlopesAudio.playWood(64, 0.22);
      }
    } else if (!Vermuna.active) {
      triggerVermuna(false, 0);
    }
  }

  // I (TRIANGLE): Jet Hop / Aetherium Levitation Flight / Ascend into Clouds!
  function hopAndCallAction() {
    if (paused) return;
    if (tabForms && tabForms.onAirshipPlayerControl && tabForms.onAirshipPlayerControl("up", getWorldBundle())) {
      return;
    }
    P.onAirship = null;

    const hasFlight = P.aether > 0 || P.wings || P.raptorPet || currentBiome === "underwater";
    const boost = hasFlight ? 6 : 4;
    P.hopTimer = hasFlight ? 22 : 14;
    P.y = Math.min(H - 6, P.y + boost);

    const nx = P.x + P.facing;
    if (nx < 1) {
      transitionToWorld(worldX - 1, worldLayer, "left");
      return;
    }
    if (nx >= W - 1) {
      transitionToWorld(worldX + 1, worldLayer, "right");
      return;
    }
    const stepDiff = Blocks[nx] - P.y;
    if (stepDiff <= (hasFlight ? 10 : 6)) {
      P.x = nx;
      if (Blocks[nx] > P.y) P.y = Blocks[nx] + 2;
    }

    // If leaping near the top of the screen with Aetherium / Wings / Raptor Pet, ascend to worldLayer + 1!
    if (P.y >= H - 10) {
      if (worldLayer < 0) {
        Ceiling[P.x] = 0;
        transitionToWorld(worldX, worldLayer + 1, "up");
        return;
      } else if (hasFlight) {
        transitionToWorld(worldX, worldLayer + 1, "up");
        return;
      }
    }

    if (window.SlopesAudio) {
      window.SlopesAudio.playTineBell(72 + Math.floor(P.y / 3), 0.9, 0.2);
    }
    if (!Vermuna.active && worldLayer >= 0) {
      triggerVermuna(false, 0);
    }
  }

  // J (SQUARE): Terrace & Build Cottage / Lighthouse / Wind-Harp / Sky-Beacon, or Hatch Raptor Eggs!
  function terraceAction() {
    if (paused) return;
    const x = Math.max(3, Math.min(W - 4, P.x));

    // 1. If standing near a Raptor Nest with an Egg, warming it hatches a loyal Raptor Companion!
    for (let i = 0; i < Nests.length; i++) {
      const nest = Nests[i];
      if (Math.abs(nest.x - x) <= 4 && nest.hasEgg && !nest.hatched) {
        nest.hatched = true;
        nest.hasEgg = false;
        P.raptorPet = true;
        P.wings = true;
        healHealth(30);
        score += 450;
        if (window.SlopesAudio && window.SlopesAudio.playAetheriumChime) {
          window.SlopesAudio.playAetheriumChime();
        }
        announceSky("RAPTOR EGG HATCHED", "SKY COMPANION JOINS!", 200);
        advanceActIfReady();
        return;
      }
    }

    // 2. If standing on a Friendly Airship deck, refuel & attach Sky Wings!
    if (P.onAirship) {
      P.wings = true;
      P.aether = Math.max(P.aether, 2);
      healHealth(25);
      P.e = Math.min(63, P.e + 6);
      announceSky("AIRSHIP DECK LINKED", "WINGS + ENERGY FULL", 170);
      return;
    }

    // 3. Terrace 3 columns (or create a floating sky terrace in Sky worlds!)
    const targetH = Math.max(seaLevel + 2, Blocks[x] > 0 ? Blocks[x] : Math.round(P.y));
    for (let dx = -1; dx <= 1; dx++) {
      Blocks[x + dx] = targetH;
      if (worldLayer > 0 && IslandBase[x + dx] === 0) {
        IslandBase[x + dx] = Math.max(4, targetH - 5);
      }
    }
    P.y = targetH;

    const existing = Towns.find((t) => Math.abs(t.x - x) <= 4);
    if (!existing) {
      const types = ["cottage", "lighthouse", "harp", "beacon"];
      const type = types[Towns.length % types.length];
      Towns.push({ x, type, pulse: 0 });
      healHealth(12);
      score += 150;
      if (Towns.length >= 3 && !P.forge) {
        P.forge = true;
      }
      if (window.SlopesAudio) {
        window.SlopesAudio.playGuitar(60 + (Towns.length % 5) * 2, 2.2, 0.26);
        window.SlopesAudio.playTineBell(72 + (Towns.length % 5) * 2, 1.8, 0.2);
      }
      const label =
        type === "cottage"
          ? ["COAST COTTAGE", "VILLAGERS EMERGE!"]
          : type === "lighthouse"
          ? ["SEA LIGHTHOUSE", "SHINES BRIGHT"]
          : type === "harp"
          ? ["WIND-HARP", "SINGS IN SKY"]
          : ["AETHER BEACON", "CONNECTS WORLDS"];
      announceSky(label[0], label[1], 160);

      // Spawn a new 3x3 Orange Villager (and a Compute Vat if needed) when expanding the Town!
      if (ecology) {
        const ecoState = ecology.eco;
        if (ecoState.OrangePeople.length < 7) {
          const roles = ["gatherer", "builder", "guardian"];
          ecoState.OrangePeople.push({
            x: x,
            vx: (ecoState.OrangePeople.length % 2 === 0 ? 1 : -1) * 0.11,
            facing: 1,
            role: roles[ecoState.OrangePeople.length % roles.length],
            carrying: "spore",
            workTimer: 0,
            stride: 0,
            homeX: x,
          });
        }
        if (
          ecoState.ComputeVats.length < 3 &&
          !ecoState.ComputeVats.some((v) => Math.abs(v.x - x) < 9) &&
          Towns.length % 2 === 0
        ) {
          const vx = Math.max(10, Math.min(W - 11, x + (x < 60 ? 6 : -6)));
          for (let dx = -2; dx <= 2; dx++) Blocks[vx + dx] = targetH;
          const newVat = ecology.createComputeVat(vx);
          ecoState.ComputeVats.push(newVat);
          ecology.igniteVat(newVat, [95, 255, 195], { Blocks, Towns, P });
          announceSky("COMPUTE VAT BUILT!", "7X7 CA RUNNING", 170);
        }
      }

      advanceActIfReady();
    } else {
      existing.pulse = 20;
      healHealth(4);
      if (ecology) {
        const nearVat = ecology.eco.ComputeVats.find((v) => Math.abs(v.x - x) <= 6);
        if (nearVat) {
          ecology.igniteVat(nearVat, [110, 255, 210], { Blocks, Towns, P });
          announceSky("VAT CATALYZED!", "7X7 CA BOOSTED!", 145);
        }
      }
      if (window.SlopesAudio) {
        window.SlopesAudio.playGuitar(64, 1.8, 0.2);
      }
    }

    // 4. Seed WFC High-Res Masonry, Lay Energy/Compute Conduit Pipe, or Board/Construct with Cosmic Engine!
    if (cosmic) {
      const wb = getWorldBundle();
      const ecoRef = ecology ? ecology.eco : null;
      const nearCraft = cosmic.cosmic.Crafts.find((cr) => Math.abs(cr.x - P.x) <= 3);
      if (nearCraft && !cosmic.cosmic.mountedCraft) {
        cosmic.boardOrExitCraft(wb);
      } else {
        cosmic.triggerWfcSeepAt(x, Blocks[x], 0, "town");
        cosmic.layConduitNearPlayer(wb, ecoRef);
      }
    }
  }

  function checkRelicPickup(x, elev) {
    for (let i = Relics.length - 1; i >= 0; i--) {
      const rel = Relics[i];
      if (Math.abs(rel.x - x) <= 2 && Math.abs(rel.elev - elev) <= 3) {
        ringsFound++;
        healHealth(15);
        P.e = Math.min(63, P.e + 5);
        score += 220;
        const rType = rel.type;
        Relics.splice(i, 1);

        let pCol = [255, 215, 70];
        if (rType === "drill") {
          P.drill = true;
          pCol = [255, 165, 75];
          announceSky("AUGER DRILL FOUND!", "PRESS S AT BEDROCK!", 185);
        } else if (rType === "aether") {
          P.aether = Math.min(9, P.aether + 1);
          pCol = [85, 240, 255];
          announceSky("LUMINITE CRYSTAL!", "FLY UP TO CLOUDS!", 185);
        } else if (rType === "wing") {
          P.wings = true;
          pCol = [160, 255, 210];
          announceSky("SKY WINGS ATTACHED!", "SOAR WITH I / UP!", 185);
        } else if (rType === "dna") {
          pCol = [110, 255, 235];
          const dnaName = ecology ? ecology.evolveVatDna({ Blocks, Towns, P }) : "SOLARIS_OSCILLATOR";
          announceSky("DNA HELIX EVOLVED!", dnaName.replace(/_/g, " ").slice(0, 16), 195);
        } else {
          announceSky(
            rType === "ring" ? "GOLDEN RING!" : "L.E.D. CORE!",
            "INTEGRITY +15%",
            150
          );
        }

        for (let p = 0; p < 10; p++) {
          addParticle(
            x,
            H - elev,
            (Math.random() - 0.5) * 1.4,
            -Math.random() * 1.3,
            pCol,
            28
          );
        }
        if (window.SlopesAudio) {
          window.SlopesAudio.playTineBell(74, 1.8, 0.26);
        }
        advanceActIfReady();
      }
    }
  }

  // ============================================================================
  // SIMULATION UPDATE STEP
  // ============================================================================
  function updateSimulation() {
    if (paused) return;
    frameCount++;
    updateCachedBg();

    if (shakeFrames > 0) shakeFrames--;
    if (transitionFlash > 0) transitionFlash--;

    // --- 0. Update Floating Airships & Player Boarding in Sky Worlds ---
    P.onAirship = null;
    for (let i = Airships.length - 1; i >= 0; i--) {
      const sh = Airships[i];
      const prevX = sh.x;
      sh.x += sh.vx;
      sh.propPhase += 0.45;
      if (sh.x < 12 || sh.x > W - 13) {
        sh.vx = -sh.vx;
      }

      // Check if player is standing on this Airship's deck (width 9, elevation sh.y)
      if (Math.abs(P.x - sh.x) <= 5 && Math.abs(P.y - sh.y) <= 4 && P.hopTimer <= 4) {
        P.onAirship = sh;
        P.y = sh.y;
        const dx = Math.round(sh.x) - Math.round(prevX);
        if (dx !== 0) {
          P.x = Math.max(2, Math.min(W - 3, P.x + dx));
        }
        if (sh.type === "friendly" && frameCount % 30 === 0) {
          healHealth(3);
          if (!P.wings) {
            P.wings = true;
            announceSky("BOARDED AIRSHIP!", "SKY WINGS ATTACHED!", 175);
          }
        }
      }

      // Pirate airships periodically drop ember-bombs onto islands below
      if (sh.type === "pirate") {
        sh.bombTimer--;
        if (sh.bombTimer <= 0) {
          sh.bombTimer = srandInt(110, 190);
          const bx = Math.max(4, Math.min(W - 5, Math.round(sh.x)));
          Rocks.push({
            x: bx,
            y: sh.y - 3,
            vx: sh.vx * 0.6,
            vy: -0.2,
            spin: 0,
            isBomb: true,
          });
        }
      }
    }

    // --- Player Vertical Physics (Ground, Mushroom Bounce, Underwater Bubble Lift, Sky Glide) ---
    if (!P.onAirship) {
      const targetGround = Blocks[P.x] || 0;
      if (P.hopTimer > 0) {
        P.hopTimer--;
        // Smooth physical descent from top of screen (when digging down) or hop apex,
        // or smooth physical ascent from bottom of screen (when climbing up)!
        if (P.y > targetGround) {
          const descStep = P.descendingFromAbove ? 0.65 : (frameCount % 2 === 0 ? 1 : 0);
          P.y = Math.max(targetGround, P.y - descStep);
          if (P.y <= targetGround + 0.5) {
            P.descendingFromAbove = false;
          }
        } else if (P.y < targetGround) {
          P.y = Math.min(targetGround, P.y + 0.85);
        }
      } else if (worldLayer > 0 && targetGround === 0) {
        // Stepping over an open cloud gap in a Sky World!
        const fallRate = (P.aether > 0 || P.wings || P.raptorPet) ? 0.45 : 1.0;
        P.y -= fallRate;
        if (P.y <= 2) {
          // Gently parachute down to worldLayer - 1 (no sudden death!)
          transitionToWorld(worldX, worldLayer - 1, "down");
          return;
        }
      } else if (P.y > targetGround + 0.75) {
        // Never snap from mid-air straight to the ground when hopTimer expires!
        P.y = Math.max(targetGround, P.y - 0.85);
        if (P.y <= targetGround + 0.5) {
          P.descendingFromAbove = false;
        }
      } else if (P.y < targetGround - 0.75) {
        P.y = Math.min(targetGround, P.y + 0.9);
      } else {
        P.y = targetGround;
        P.descendingFromAbove = false;
      }
    }

    // Giant Bioluminescent Mushroom Trampolines!
    Mushrooms.forEach((m) => {
      const mTop = (Blocks[m.x] || 12) + m.h;
      if (Math.abs(P.x - m.x) <= Math.floor(m.capW / 2) && Math.abs(P.y - mTop) <= 3) {
        P.hopTimer = 20;
        P.y = Math.min(H - 8, mTop + 8);
        m.glow = 18;
        healHealth(4);
        if (window.SlopesAudio) {
          window.SlopesAudio.playTineBell(69 + (m.x % 7), 1.1, 0.18);
        }
        for (let p = 0; p < 5; p++) {
          addParticle(m.x + (Math.random() - 0.5) * 4, H - mTop, (Math.random() - 0.5), -0.6, [120, 255, 195], 22);
        }
      }
    });

    // Underwater Bubble Vents carry Tachima upward!
    if (currentBiome === "underwater") {
      Kelp.forEach((k) => {
        if (k.hasBubbles && Math.abs(P.x - k.x) <= 2) {
          P.hopTimer = 12;
          P.y = Math.min(H - 9, P.y + 1);
        }
      });
    }

    // Dwarf Tinkers patrol subterranean ledges & gift upgrades
    Dwarves.forEach((dw) => {
      dw.x += dw.vx;
      if (dw.x < 12 || dw.x > W - 13 || Math.abs(dw.x - dw.forgeX) > 10) {
        dw.vx = -dw.vx;
      }
      if (dw.giftReady && Math.abs(dw.x - P.x) <= 3) {
        dw.giftReady = false;
        if (!P.drill) {
          P.drill = true;
          announceSky("DWARF GIFTED YOU", "THE AUGER DRILL!", 180);
        } else {
          P.aether = Math.min(9, P.aether + 1);
          P.forge = true;
          announceSky("DWARF FORGED YOUR", "AETHERIUM HAMMER!", 180);
        }
        healHealth(20);
        if (window.SlopesAudio) {
          window.SlopesAudio.playCaveFanfare(actIndex);
        }
      }
    });

    // Sky Raptors patrol around their Mountain Nests
    Raptors.forEach((rp) => {
      rp.phase += 0.06;
      rp.x = rp.homeX + Math.sin(rp.phase) * 14;
      rp.y = rp.homeY + Math.cos(rp.phase * 1.5) * 4;
    });

    // Check periodic pickups
    if (frameCount % 6 === 0) {
      checkRelicPickup(P.x, P.y);
      checkCrystalHarvest(P.x, P.y);
    }

    // 1. Update Sky Narrative Banner
    if (skyMessageTimer > 0) {
      skyMessageTimer--;
      skyMessageAlpha += (skyMessageTarget - skyMessageAlpha) * 0.08;
      if (skyMessageTimer < 25) {
        skyMessageTarget = 0;
      }
    } else if (skyQueue.length > 0) {
      const next = skyQueue.shift();
      skyMessage = next.lines;
      skyMessageAlpha = 0.05;
      skyMessageTarget = 1;
      skyMessageTimer = next.hold;
    } else if (frameCount % 320 === 0) {
      const act = STORY_ACTS[actIndex % STORY_ACTS.length];
      const pair = act.lines[lineIndex % act.lines.length];
      lineIndex++;
      skyMessage = pair;
      skyMessageAlpha = 0.05;
      skyMessageTarget = 1;
      skyMessageTimer = 190;
    }

    // 2. Update Vermuna (The Large Bird)
    if (Vermuna.active) {
      Vermuna.x += Vermuna.vx;
      Vermuna.wingPhase += 0.28;
      if (!Vermuna.dropped && Math.abs(Vermuna.x - Vermuna.dropX) < 1.2) {
        Vermuna.dropped = true;
        const dropCol = Math.max(4, Math.min(W - 5, Math.round(Vermuna.x)));
        Rocks.push({
          x: dropCol,
          y: H - Vermuna.y - 2,
          vx: Vermuna.vx * 0.5,
          vy: 0,
          spin: 0,
        });
        if (window.SlopesAudio) {
          window.SlopesAudio.playWood(69, 0.2);
        }
      }
      if (Vermuna.x < -10 || Vermuna.x > W + 10) {
        Vermuna.active = false;
        Vermuna.cooldown = srandInt(260, 420);
      }
    } else if (worldLayer >= 0) {
      if (Vermuna.cooldown > 0) {
        Vermuna.cooldown--;
      } else {
        triggerVermuna(false, 0);
      }
    }

    // 3. Update Rolling Round Rocks (Cave Feeding, Raptor Taming, Pirate Hits, Magma Cooling)
    for (let i = Rocks.length - 1; i >= 0; i--) {
      const r = Rocks[i];
      const col = Math.max(1, Math.min(W - 2, Math.round(r.x)));
      const groundH = Blocks[col];

      // Zero-G Aetherium levitation lift near crystals!
      const nearCrystal = Crystals.some((cr) => Math.abs(cr.x - r.x) <= 4);

      if (r.y > groundH) {
        r.vy -= nearCrystal ? 0.04 : 0.14;
        r.y += r.vy;
        if (groundH > 0 && r.y <= groundH) {
          r.y = groundH;
          if (Math.abs(r.vy) > 0.35 && window.SlopesAudio) {
            window.SlopesAudio.playWood(54 + Math.floor(groundH / 2), Math.min(0.25, Math.abs(r.vy) * 0.2));
          }
          r.vy = 0;
        }
      } else if (groundH > 0) {
        r.y = groundH;
        const leftH = Blocks[Math.max(0, col - 1)];
        const rightH = Blocks[Math.min(W - 1, col + 1)];
        const slope = (leftH - rightH) * 0.045;
        r.vx = (r.vx + slope) * 0.94;
        if (Math.abs(r.vx) < 0.02 && leftH !== rightH) {
          r.vx += slope * 0.5;
        }
      }

      r.x += r.vx;
      r.spin += r.vx * 2;

      let consumed = false;

      // Check if Rock fed a Spooky Cave (Awards AUGER DRILL on first cave fed!)
      for (let cIdx = Caves.length - 1; cIdx >= 0; cIdx--) {
        const c = Caves[cIdx];
        const caveElev = Math.max(2, Blocks[c.x] - c.depth);
        if (Math.abs(r.x - c.x) <= 2.4 && Math.abs(r.y - caveElev) <= 5) {
          cavesFed++;
          score += 300;
          healHealth(24);
          P.e = Math.min(63, P.e + 5);
          c.glow = 35;
          c.fedCount++;

          if (!P.drill) {
            P.drill = true;
            announceSky("CAVE GRANTED DRILL!", "HOLD S TO BORE DOWN!", 195);
          } else if (P.aether < 2) {
            P.aether++;
            announceSky("CAVE SANG AETHER!", "FLY UP WITH I / W!", 185);
          } else {
            announceSky("THE SPOOKY CAVE", "SANG WITH JOY!", 170);
          }

          for (let p = 0; p < 14; p++) {
            addParticle(
              c.x,
              H - caveElev,
              (Math.random() - 0.5) * 1.5,
              -Math.random() * 1.4 - 0.2,
              [255, 230, 110],
              32
            );
          }
          if (window.SlopesAudio) {
            window.SlopesAudio.playCaveFanfare(cavesFed);
          }
          if (c.fedCount >= 2) {
            Caves.splice(cIdx, 1);
            spawnCave();
          }
          advanceActIfReady();
          consumed = true;
          break;
        }
      }
      if (consumed) {
        Rocks.splice(i, 1);
        continue;
      }

      // Check if Rock warmed/fed a Raptor Nest!
      for (let nIdx = 0; nIdx < Nests.length; nIdx++) {
        const nest = Nests[nIdx];
        if (nest.hasEgg && !nest.hatched && Math.abs(r.x - nest.x) <= 3) {
          nest.hatched = true;
          nest.hasEgg = false;
          P.raptorPet = true;
          P.wings = true;
          healHealth(30);
          score += 450;
          announceSky("RAPTOR EGG HATCHED!", "COMPANION FLIES!", 195);
          consumed = true;
          break;
        }
      }
      if (consumed) {
        Rocks.splice(i, 1);
        continue;
      }

      // Check if Rock sealed an erupted Tar Vein
      for (let vIdx = TarVeins.length - 1; vIdx >= 0; vIdx--) {
        const v = TarVeins[vIdx];
        if (v.erupted && Math.abs(r.x - v.x) <= 2.2) {
          veinsShattered++;
          score += 140;
          healHealth(10);
          TarVeins.splice(vIdx, 1);
          if (window.SlopesAudio) {
            window.SlopesAudio.playSonicTamp(1);
          }
          announceSky("TAR VENT SEALED", "BY ROUND ROCK!", 150);
          consumed = true;
          break;
        }
      }
      if (consumed) {
        Rocks.splice(i, 1);
        continue;
      }

      // If Rock lands in a Magma lake, it cools the magma into a solid obsidian stepping stone!
      if (isMagmaBasin && groundH < seaLevel && r.y <= seaLevel) {
        Blocks[col] = seaLevel + 1;
        Rocks.splice(i, 1);
        announceSky("MAGMA COOLED INTO", "OBSIDIAN BRIDGE!", 145);
        continue;
      }

      // Check if Rock crushed a Black Goo node, severed a Sticky Web, or banished a Skeksis Cultist!
      if (ecology && Math.abs(r.vx) > 0.08) {
        const hitEco = ecology.onPlayerSonicTamp(
          { Blocks, Towns, P, healHealth, announceSky },
          r.x,
          2.2
        );
        if (hitEco > 0) {
          score += hitEco * 80;
          healHealth(4);
        }
      }

      // Physically accurate frame transitions for rolling/falling Round Rocks!
      if (r.x < 1) {
        const leftSaved = visitedWorlds.get(worldKey(worldX - 1, worldLayer));
        if (leftSaved && Array.isArray(leftSaved.Rocks) && leftSaved.Rocks.length < 8) {
          leftSaved.Rocks.push(Object.assign({}, r, { x: W - 2.2 }));
        }
        Rocks.splice(i, 1);
      } else if (r.x >= W - 1) {
        const rightSaved = visitedWorlds.get(worldKey(worldX + 1, worldLayer));
        if (rightSaved && Array.isArray(rightSaved.Rocks) && rightSaved.Rocks.length < 8) {
          rightSaved.Rocks.push(Object.assign({}, r, { x: 2.2 }));
        }
        Rocks.splice(i, 1);
      } else if (r.y <= 0) {
        const belowSaved = visitedWorlds.get(worldKey(worldX, worldLayer - 1));
        if (belowSaved && Array.isArray(belowSaved.Rocks) && belowSaved.Rocks.length < 8) {
          belowSaved.Rocks.push(Object.assign({}, r, { y: H - 3 }));
        }
        Rocks.splice(i, 1);
      } else if (groundH < seaLevel - 1 && Math.abs(r.vx) < 0.03) {
        Rocks.splice(i, 1);
      }
    }

    // 4. Update Subterranean Tar Veins
    if (worldLayer <= 0 && TarVeins.length < 2 && frameCount % 150 === 0) {
      spawnTarVein();
    }
    for (let i = 0; i < TarVeins.length; i++) {
      const v = TarVeins[i];
      v.pulse += 0.12;
      if (!v.erupted) {
        v.progress += v.speed;
        if (v.progress >= 1.0) {
          v.progress = 1.0;
          v.erupted = true;
          v.spread = 1;
          if (window.SlopesAudio) {
            window.SlopesAudio.playCricketBass(42, 3.0, 0.22);
          }
        }
      } else {
        if (frameCount % 90 === 0 && v.spread < 3) {
          v.spread++;
        }
        if (Math.abs(P.x - v.x) <= v.spread && frameCount % 32 === 0) {
          damageHealth(4, ["EMBER TAR SEEPS!", "PRESS K TO TAMP"]);
        }
        if (frameCount % 180 === 0 && Blocks[v.x] > seaLevel) {
          Blocks[v.x]--;
        }
      }
    }

    // 5. Update Subterranean Rust-Worms & Landslides
    if (worldLayer <= 0 && Worms.length < 1 && frameCount % 260 === 0) {
      spawnWorm();
    }
    for (let i = Worms.length - 1; i >= 0; i--) {
      const w = Worms[i];
      if (w.stunTimer > 0) {
        w.stunTimer--;
        continue;
      }
      w.x += w.vx;
      const col = Math.max(2, Math.min(W - 3, Math.round(w.x)));
      const maxWormY = Math.max(3, (Blocks[col] || 10) - 3);
      if (w.y > maxWormY) w.y = maxWormY;

      if (frameCount % 8 === 0) {
        w.segments.pop();
        w.segments.unshift({ x: Math.round(w.x), y: Math.round(w.y) });
      }

      if (frameCount % 140 === 0 && Blocks[col] > seaLevel + 3) {
        Blocks[col]--;
        for (let k = -2; k <= 2; k++) {
          const c1 = Math.max(2, Math.min(W - 3, col + k));
          const c2 = c1 + 1;
          if (Blocks[c1] - Blocks[c2] > 3) {
            Blocks[c1]--;
            Blocks[c2]++;
          } else if (Blocks[c2] - Blocks[c1] > 3) {
            Blocks[c2]--;
            Blocks[c1]++;
          }
        }
        if (window.SlopesAudio) {
          window.SlopesAudio.playPebble(520, 0.12);
        }
      }

      if (w.x < 4 || w.x > W - 5) {
        w.vx = -w.vx;
      }
    }

    // 6. Update Coastal Town Houses & Multi-Scale Ecology (Orange Civilization, Skeksis, Crows, Vats & Automata)
    if (ecology) {
      ecology.update({
        Blocks,
        Towns,
        TarVeins,
        Crystals,
        Relics,
        P,
        frameCount,
        seaLevel,
        worldLayer,
        healHealth,
        announceSky,
      });

      // Skeksis Cultist or Black Goo draining Monolith if player stands in corruption without tamping (K)
      if (frameCount % 42 === 0) {
        const touchingSkeksis = ecology.eco.Skeksis.some((sk) => Math.abs(sk.x - P.x) <= 1.8);
        const touchingGoo = ecology.eco.GooNodes.some((g) => Math.abs(g.x - P.x) <= g.radius);
        if (touchingSkeksis) {
          damageHealth(3, ["VEXARI CULTIST!", "PRESS K TO BANISH"]);
        } else if (touchingGoo) {
          damageHealth(2, ["BLACK GOO SEEPS!", "TAMP (K) OR VAT BOT"]);
        }
      }
    }

    // 6B. Update Cosmic Engine (WFC Multi-Resolution Seeping, Recursive Pocket Worlds, WASM Scientist Labs,
    // 100x Time-Dilation Crystals, Energy/Compute Conduits, Worker Swarms, Rideable Crafts & Transdimensionals)
    if (cosmic) {
      cosmic.update(getWorldBundle(), ecology ? ecology.eco : null);
      // When a Time-Dilation Crystal or Chronos Hyper-Sim is active, accelerate ecology with zero SFX lag!
      if (cosmic.cosmic.timeDilation > 1 && ecology) {
        const extraTicks = Math.min(2, Math.max(1, Math.floor(cosmic.cosmic.timeDilation / 8)));
        const prevSuppress = window.SlopesAudio ? window.SlopesAudio.suppressSfx : false;
        if (window.SlopesAudio) window.SlopesAudio.suppressSfx = true;
        try {
          for (let t = 0; t < extraTicks; t++) {
            ecology.update({
              Blocks,
              Towns,
              TarVeins,
              Crystals,
              Relics,
              P,
              frameCount: frameCount + t + 1,
              seaLevel,
              worldLayer,
              healHealth,
              announceSky,
            });
          }
        } finally {
          if (window.SlopesAudio) window.SlopesAudio.suppressSfx = prevSuppress;
        }
      }
    }

    // 6C. Update Embodied Tab-Form Lifeforms (Hardcore-Tab + TabComputer Claude Code Robotic Organisms)
    if (tabForms) {
      tabForms.update(
        getWorldBundle(),
        ecology ? ecology.eco : null,
        cosmic ? cosmic.cosmic : null,
        rotation
      );
    }

    // 6D. Update 5-Fold Non-Euclidean Scene Rotation Manifold
    if (rotation) {
      rotation.update(
        getWorldBundle(),
        ecology ? ecology.eco : null,
        cosmic ? cosmic.cosmic : null,
        tabForms ? tabForms.tabForms : null
      );
    }

    if (frameCount % 45 === 0 && Towns.length > 0) {
      const nearTown = Towns.some((t) => Math.abs(t.x - P.x) <= 6);
      if (nearTown && health < maxHealth) {
        healHealth(2);
      }
    }

    // 7. Update Sonic Tamp Shockwaves
    for (let i = Shockwaves.length - 1; i >= 0; i--) {
      const sw = Shockwaves[i];
      sw.radius += 0.9;
      if (sw.radius >= sw.maxRadius) {
        Shockwaves.splice(i, 1);
      }
    }

    // 8. Update Particles & Clouds
    for (let i = Particles.length - 1; i >= 0; i--) {
      const pt = Particles[i];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.vy += 0.04;
      pt.life--;
      if (pt.life <= 0) {
        Particles.splice(i, 1);
      }
    }
    Clouds.forEach((cl) => {
      cl.x += cl.vx;
      if (cl.x > W + 10) cl.x = -10;
      if (cl.x < -10) cl.x = W + 10;
    });

    // 8B. Step Procedural Genetic Flora/Fauna, Dynamic Sunlight/Shadow, Hydrology & Wind Simulation
    if (window.SlopesGeneticFlora && typeof window.SlopesGeneticFlora.step === "function") {
      window.SlopesGeneticFlora.step(
        getWorldBundle(),
        ecology ? ecology.eco : null,
        cosmic ? cosmic.cosmic : null,
        frameCount
      );
    }

    // 9. Step Generative Raga / Cosmic Italo / Aleatoric Soundtrack
    if (frameCount % 12 === 0 && window.SlopesAudio) {
      const activeTar = TarVeins.reduce((acc, v) => acc + (v.erupted ? 2 : v.progress), 0);
      window.SlopesAudio.stepSoundtrack({
        playerY: P.y,
        tarPressure: activeTar,
        townCount: Towns.length + Castles.length * 2,
        nearSea: seaLevel > 0 && Blocks[P.x] <= seaLevel + 3,
        worldLayer,
      });
    }
  }

  let fsScratchCanvas = null;
  let fsScratchCtx = null;

  function presentWorldToViewportCanvas(skipZoom) {
    ctx.putImageData(screen, 0, 0);
    if (!skipZoom && window.SlopesChronosAndCiv && typeof window.SlopesChronosAndCiv.stepAndRenderRecursiveZoom === "function") {
      window.SlopesChronosAndCiv.stepAndRenderRecursiveZoom(primeRenderer, getWorldBundle());
    }

    const vp = window.SlopesViewport;
    const baseW = 1008;
    const baseH = 630;
    if (!vp || !vp.isFullscreen || (vp.viewW === baseW && vp.viewH === baseH)) {
      if (canvas.width !== baseW || canvas.height !== baseH) {
        canvas.width = baseW;
        canvas.height = baseH;
        ctx.imageSmoothingEnabled = false;
        ctx.putImageData(screen, 0, 0);
        if (!skipZoom && window.SlopesChronosAndCiv && typeof window.SlopesChronosAndCiv.stepAndRenderRecursiveZoom === "function") {
          window.SlopesChronosAndCiv.stepAndRenderRecursiveZoom(primeRenderer, getWorldBundle());
        }
      }
      return;
    }

    const viewW = vp.viewW;
    const viewH = vp.viewH;
    const offX = vp.offsetX || 0;
    const offY = vp.offsetY || 0;
    if (canvas.width !== viewW || canvas.height !== viewH) {
      canvas.width = viewW;
      canvas.height = viewH;
      ctx.imageSmoothingEnabled = false;
    }

    if (!fsScratchCanvas) {
      fsScratchCanvas = document.createElement("canvas");
      fsScratchCanvas.width = baseW;
      fsScratchCanvas.height = baseH;
      fsScratchCtx = fsScratchCanvas.getContext("2d");
      fsScratchCtx.imageSmoothingEnabled = false;
    }
    fsScratchCtx.clearRect(0, 0, baseW, baseH);
    fsScratchCtx.drawImage(canvas, 0, 0, baseW, baseH, 0, 0, baseW, baseH);

    const bgR = cachedBgRgb[0] || 72;
    const bgG = cachedBgRgb[1] || 160;
    const bgB = cachedBgRgb[2] || 148;

    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, viewW, viewH);

    // 1. Extended Portrait Top Window (`0 .. offY`): Upper Stratosphere, Celestial Stars & Floating Sky Islands
    if (offY > 0) {
      const bandH = 7;
      for (let y = 0; y < offY; y += bandH) {
        const u = y / Math.max(1, offY);
        const shade = 0.66 + 0.34 * u;
        ctx.fillStyle = `rgb(${Math.round(bgR * shade)}, ${Math.round(bgG * shade)}, ${Math.round(bgB * (0.72 + 0.28 * u))})`;
        ctx.fillRect(0, y, viewW, Math.min(bandH, offY - y));
      }
      // Twinkling upper-stratosphere stars & high-altitude floating sky islands
      for (let si = 0; si < 42; si++) {
        const sx = ((si * 197 + worldX * 73) % (viewW - 14)) + 7;
        const sy = ((si * 131 + Math.abs(worldX) * 29) % Math.max(14, offY - 24)) + 7;
        const tw = 0.5 + 0.5 * Math.sin(frameCount * 0.05 + si * 1.7);
        if (tw > 0.55) {
          ctx.fillStyle = `rgba(215, 250, 245, ${((tw - 0.5) * 1.4).toFixed(2)})`;
          ctx.fillRect(sx - (sx % 7), sy - (sy % 7), 7, 7);
        }
      }
      // Distant Floating Sky-Island silhouettes in the upper stratosphere
      for (let isl = 0; isl < 3; isl++) {
        const ix = Math.round(((isl * 330 + 140 - ((frameCount * 0.12) | 0)) % (viewW - 180) + (viewW - 180)) % (viewW - 180)) + 40;
        const iy = Math.round(offY * (0.28 + isl * 0.24));
        const iw = 98 + (isl % 2) * 42;
        if (iy + 28 < offY) {
          ctx.fillStyle = `rgb(${Math.round(bgR * 0.48)}, ${Math.round(bgG * 0.52)}, ${Math.round(bgB * 0.56)})`;
          ctx.fillRect(ix, iy, iw, 14);
          ctx.fillRect(ix + 14, iy + 14, iw - 28, 7);
          ctx.fillStyle = `rgb(${Math.round(bgR * 0.64)}, ${Math.round(bgG * 0.78)}, ${Math.round(bgB * 0.72)})`;
          ctx.fillRect(ix + 7, iy - 7, iw - 14, 7);
          ctx.fillStyle = "rgba(95, 235, 255, 0.82)";
          ctx.fillRect(ix + Math.floor(iw * 0.5), iy + 14, 7, 7);
        }
      }
    }

    // 2. Extended Portrait Bottom Window (`offY + baseH .. viewH`): Deep Subterranean Lithosphere, Crystal Caverns & Mineral Veins
    const botStart = offY + baseH;
    if (botStart < viewH) {
      const botH = viewH - botStart;
      const cell = 7;
      for (let ry = 0; ry < botH; ry += cell) {
        const depthFrac = ry / Math.max(1, botH);
        const rowCourse = Math.floor(ry / cell);
        const shade = Math.max(0.18, 0.34 - depthFrac * 0.14 + Math.sin(rowCourse * 0.7) * 0.025);
        ctx.fillStyle = `rgb(${Math.round(bgR * shade)}, ${Math.round(bgG * shade)}, ${Math.round(bgB * shade)})`;
        ctx.fillRect(0, botStart + ry, viewW, Math.min(cell, botH - ry));
      }
      // Staggered subterranean stone bedding seams, glowing Aetherium crystal pockets & gold-quartz veins
      for (let ry = cell; ry < botH - cell; ry += cell * 2) {
        const rowIdx = Math.floor(ry / (cell * 2));
        const yPx = botStart + ry;
        for (let rx = ((rowIdx & 1) ? 14 : 0); rx < viewW; rx += 28) {
          const hVal = ((rx * 37 + rowIdx * 193 + worldX * 53) & 255);
          if (hVal < 36) {
            ctx.fillStyle = `rgba(${Math.round(bgR * 0.16)}, ${Math.round(bgG * 0.20)}, ${Math.round(bgB * 0.22)}, 0.85)`;
            ctx.fillRect(rx, yPx, 21, 2);
          } else if (hVal > 241) {
            // Glowing cyan Aetherium or warm gold-quartz mineral vein in deep bedrock
            const isGold = (hVal & 1) === 0;
            const pulse = 0.7 + 0.3 * Math.sin(frameCount * 0.08 + rowIdx + rx * 0.02);
            ctx.fillStyle = isGold
              ? `rgba(235, 192, 92, ${(0.82 * pulse).toFixed(2)})`
              : `rgba(92, 232, 248, ${(0.85 * pulse).toFixed(2)})`;
            ctx.fillRect(rx, yPx, 14, cell);
            ctx.fillRect(rx + 7, yPx + cell, 14, cell);
          }
        }
      }
    }

    // 3. Extended Wide Landscape Side Windows (`0 .. offX` and `offX + baseW .. viewW`): Panoramic Coastal Terrain & Sea
    if (offX > 0) {
      const cell = 7;
      const seaY = offY + (H - seaLevel) * cell;
      const leftElev = Blocks[0] || 16;
      const rightElev = Blocks[W - 1] || 16;
      const drawSideWing = (startX, widthPx, edgeElev, dirSign) => {
        for (let x = 0; x < widthPx; x += cell) {
          const colDist = Math.floor((dirSign < 0 ? widthPx - x : x) / cell);
          const hOff = Math.round(Math.sin((colDist + worldX * 17) * 0.18) * 2.5 + Math.cos(colDist * 0.07) * 1.5);
          const colElev = Math.max(4, Math.min(H - 12, edgeElev + hOff));
          const surfY = offY + (H - colElev) * cell;
          const drawX = startX + x;
          const colW = Math.min(cell, widthPx - x);
          if (surfY > seaY && seaLevel > 0) {
            ctx.fillStyle = `rgb(${Math.round(bgR * 0.58 + 12)}, ${Math.round(bgG * 0.62 + 45)}, ${Math.round(bgB * 0.62 + 65)})`;
            ctx.fillRect(drawX, seaY, colW, surfY - seaY);
            ctx.fillStyle = "rgba(210, 248, 255, 0.85)";
            ctx.fillRect(drawX, seaY, colW, cell);
          }
          // Crest & subterranean stone column
          ctx.fillStyle = `rgb(${Math.round(bgR * 0.56)}, ${Math.round(bgG * 0.56)}, ${Math.round(bgB * 0.56)})`;
          ctx.fillRect(drawX, surfY, colW, cell);
          ctx.fillStyle = `rgb(${Math.round(bgR * 0.48)}, ${Math.round(bgG * 0.48)}, ${Math.round(bgB * 0.48)})`;
          ctx.fillRect(drawX, surfY + cell, colW, cell * 3);
          ctx.fillStyle = `rgb(${Math.round(bgR * 0.34)}, ${Math.round(bgG * 0.34)}, ${Math.round(bgB * 0.34)})`;
          ctx.fillRect(drawX, surfY + cell * 4, colW, Math.max(0, viewH - (surfY + cell * 4)));
        }
      };
      drawSideWing(0, offX, leftElev, -1);
      drawSideWing(offX + baseW, viewW - (offX + baseW), rightElev, 1);
    }

    // 4. Composite the 1008x630 active world frame at `(offX, offY)` at exact 1:1 square pixels!
    ctx.drawImage(fsScratchCanvas, 0, 0, baseW, baseH, offX, offY, baseW, baseH);
    ctx.restore();
  }

  // ============================================================================
  // RENDER 120x75 FRAME (840x525 Multi-Scale Prime Sub-Pixel Framebuffer)
  // ============================================================================
  function renderFrame() {
    clean(screen);
    clean(tC);

    const _zs = window.SlopesLorePortalDock && window.SlopesLorePortalDock.zoomState;
    const _zMod = _zs && typeof _zs.depth === "number" ? ((Math.abs(_zs.depth) % 5) + 5) % 5 : 0;
    const _isZooming = _zMod > 0.004 && _zMod < 4.996;

    // 0. Multi-Layer Parallax Dither Gradients (Deep Zenith, Distant Mountain Ranges, Mid-ground Hills & Atmospheric Fog)
    if (
      !_isZooming &&
      primeRenderer &&
      window.SlopesParallaxDitherArt &&
      typeof window.SlopesParallaxDitherArt.renderBackgroundParallaxDither === "function"
    ) {
      window.SlopesParallaxDitherArt.renderBackgroundParallaxDither(primeRenderer, getWorldBundle(), frameCount);
    }

    // If a 5-Fold Non-Euclidean Scene Rotation is animating, render the live 3D rotating perspective + 3D Reynolds Boids flock!
    if (rotation && rotation.isAnimating && primeRenderer) {
      rotation.render(
        primeRenderer,
        getWorldBundle(),
        ecology ? ecology.eco : null,
        cosmic ? cosmic.cosmic : null,
        tabForms ? tabForms.tabForms : null
      );
      presentWorldToViewportCanvas(true);
      return;
    }

    // 1. Twinkling sky stars / subterranean crystal motes
    Stars.forEach((st) => {
      const tw = 0.5 + 0.5 * Math.sin(frameCount * 0.05 + st.phase);
      if (tw > 0.72) {
        const starCol = worldLayer < 0 ? [120, 240, 255] : bg(1.32);
        pixc(screen, st.x, st.y, starCol, (tw - 0.7) * 1.4);
      }
    });

    // 2. Whisper-subtle harmonic sky clouds (in surface & sky worlds)
    if (worldLayer >= 0) {
      Clouds.forEach((cl) => {
        drawRect(screen, Math.round(cl.x), cl.y, cl.w, 1, bg(1.05), 0.35);
        drawRect(screen, Math.round(cl.x) + 1, cl.y - 1, Math.max(2, cl.w - 2), 1, bg(1.07), 0.25);
      });
    }

    // 3. Subterranean Cavern Ceiling Stalactites (when worldLayer < 0)
    if (worldLayer < 0) {
      for (let x = 0; x < W; x++) {
        const ch = Ceiling[x];
        for (let y = 0; y < ch; y++) {
          const m = y === ch - 1 ? 0.46 : 0.32;
          pixc(screen, x, y, bg(m), 0.92);
        }
      }
    }

    // 4. Poetic Sky Narrative in original fontArt (ahoy_art_deco.64c) — prepared in `tC` and rendered
    //    as a sharp temporary overlay with a crisp 1px background outline shadow after sky objects!
    if (skyMessageAlpha > 0.02) {
      const inkColor = bg(0.16);
      if (skyMessage[0]) {
        textCenter(tC, skyMessage[0], 1, inkColor);
      }
      if (skyMessage[1]) {
        textCenter(tC, skyMessage[1], 14, inkColor);
      }
    }

    // 5. Sea Waves, Underwater Currents, or Molten Magma Basins
    if (seaLevel > 0) {
      for (let x = 0; x < W; x++) {
        const groundH = Blocks[x];
        if (groundH < seaLevel) {
          const wave = Math.round(Math.sin(frameCount * 0.08 + x * 0.35) * 0.6);
          const topWaterY = Math.max(0, H - (seaLevel + wave));
          const botWaterY = H - groundH;
          for (let y = topWaterY; y < botWaterY; y++) {
            if (isMagmaBasin) {
              // Glowing molten lava river in Magma Vaults
              const glow = 0.5 + 0.5 * Math.sin(frameCount * 0.14 + x * 0.4 + y * 0.3);
              if (y === topWaterY) {
                pix(screen, x, y, 255, 215, 95, 0.95);
              } else {
                pix(screen, x, y, 218 + glow * 32, 84 + glow * 40, 52, 0.9);
              }
            } else if (y === topWaterY && currentBiome !== "underwater") {
              pixc(screen, x, y, bgTint(1.35, 220, 250, 255, 0.45), 0.9);
            } else {
              const alpha = currentBiome === "underwater" ? 0.25 : 0.78;
              pixc(screen, x, y, bgTint(0.75, 30, 120, 175, 0.38), alpha);
            }
          }
        }
      }
    }

    // 6. Terrain Columns (Surface & Subterranean vs Floating Sky Islands with Hanging Roots!)
    for (let x = 0; x < W; x++) {
      const h = Blocks[x];
      if (h <= 0) continue;
      const topY = H - h;
      const botY = worldLayer > 0 ? H - IslandBase[x] : H;
      for (let y = topY; y < botY; y++) {
        const depth = y - topY;
        if (depth === 0) {
          pixc(screen, x, y, bg(0.56), 1);
        } else if (depth < 4) {
          pixc(screen, x, y, bg(0.48), 1);
        } else if (depth < 10) {
          pixc(screen, x, y, bg(0.41), 1);
        } else {
          pixc(screen, x, y, bg(0.34), 1);
        }
      }
      // Subtle glowing Aetherium veins on the hanging roots of Floating Sky Islands!
      if (worldLayer > 0 && botY < H && (x + Math.floor(frameCount / 10)) % 7 === 0) {
        pix(screen, x, botY - 1, 95, 235, 255, 0.85);
      }
    }

    // 6B. Semi-Transparent Surface Dither Screens (Geological Strata, Water Caustics, Mossy Cliff Overhangs)
    if (
      !_isZooming &&
      primeRenderer &&
      window.SlopesParallaxDitherArt &&
      typeof window.SlopesParallaxDitherArt.renderSurfaceDitherScreens === "function"
    ) {
      window.SlopesParallaxDitherArt.renderSurfaceDitherScreens(primeRenderer, getWorldBundle(), frameCount);
    }

    // 6C. Procedural Genetic Flora & Fauna Engine (Trees, Willows, Bonsai, Flowers, Shrubs, Moss, Vines, Fruit/Veg, Cloud-Kelp, Sea-Flora, Sun Shadows & Wind Sway)
    if (
      primeRenderer &&
      window.SlopesGeneticFlora &&
      typeof window.SlopesGeneticFlora.render === "function"
    ) {
      window.SlopesGeneticFlora.render(
        primeRenderer,
        getWorldBundle(),
        ecology ? ecology.eco : null,
        cosmic ? cosmic.cosmic : null,
        frameCount
      );
    }

    // 7. Underwater Kelp Forests & Rising Bubble Streams
    Kelp.forEach((k) => {
      const baseY = H - Blocks[k.x];
      for (let ky = 1; ky <= k.h; ky++) {
        const sway = Math.round(Math.sin(frameCount * 0.08 + ky * 0.35 + k.phase) * 0.8);
        pixc(screen, k.x + sway, baseY - ky, bgTint(0.7, 45, 210, 145, 0.55), 0.9);
      }
      if (k.hasBubbles) {
        const by = baseY - ((frameCount + k.x * 5) % 38);
        if (by > 6) {
          pix(screen, k.x, by, 185, 250, 255, 0.85);
        }
      }
    });

    // 8. Giant Bioluminescent Bounce Mushrooms
    Mushrooms.forEach((m) => {
      const baseY = H - Blocks[m.x];
      const topY = baseY - m.h;
      const pulse = m.glow > 0 ? (m.glow--, 1.0) : 0.65 + 0.35 * Math.sin(frameCount * 0.1 + m.x);
      // Glowing stem
      drawRect(screen, m.x, topY + 2, 1, m.h - 2, bgTint(0.85, 180, 240, 220, 0.4), 0.95);
      // Bioluminescent umbrella cap
      const half = Math.floor(m.capW / 2);
      const capCol = [75 + 45 * pulse, 235 * pulse, 195 * pulse];
      drawRect(screen, m.x - half, topY + 1, m.capW, 1, capCol, 0.95);
      drawRect(screen, m.x - half + 1, topY, m.capW - 2, 1, [195, 255, 235], 0.95);
    });

    // 9. Castle in the Sky Aetherium Crystal Clusters (Glowing Levitation Stones!)
    Crystals.forEach((cr) => {
      const pulse = 0.65 + 0.35 * Math.sin(frameCount * 0.14 + cr.phase);
      const cy = cr.onFloor
        ? H - (Blocks[cr.x] || 14)
        : Math.max(4, Ceiling[cr.x] + cr.size);
      const dir = cr.onFloor ? -1 : 1;
      const cOuter = [65, Math.round(215 * pulse), 255];
      const cCore = [205, 255, 255];

      for (let h = 0; h < cr.size; h++) {
        pixc(screen, cr.x, cy + dir * h, h === cr.size - 1 ? cCore : cOuter, 0.95);
        if (h < cr.size - 1) {
          pixc(screen, cr.x - 1, cy + dir * h, cOuter, 0.78);
          pixc(screen, cr.x + 1, cy + dir * h, cOuter, 0.78);
        }
      }
      // Rising antigravity light motes
      const moteY = cy - ((frameCount + cr.x * 3) % 12);
      pixc(screen, cr.x, moteY, cCore, 0.7);
    });

    // 10. Subterranean Dwarf Tinkers & Anvil Forges
    Dwarves.forEach((dw) => {
      if (dw.hasForge) {
        const fy = H - Blocks[dw.forgeX];
        drawRect(screen, dw.forgeX - 1, fy - 2, 3, 2, [215, 130, 70], 1);
        pix(screen, dw.forgeX, fy - 3, 255, 215, 95, 0.95);
      }
      const dx = Math.round(dw.x);
      const dy = H - Blocks[dx];
      // Little bearded Dwarf with glowing miner helmet lamp
      drawRect(screen, dx, dy - 3, 1, 3, [215, 115, 75], 1);
      pix(screen, dx, dy - 4, 255, 235, 115, 1);
      pix(screen, dx + (dw.vx >= 0 ? 1 : -1), dy - 2, 230, 210, 190, 0.9);
    });

    // 11. Buried Relics (Golden Rings, L.E.D. Cores, Auger Drills, Aetherium Shards)
    Relics.forEach((rel) => {
      const ry = H - rel.elev;
      const pulse = 0.65 + 0.35 * Math.sin(frameCount * 0.14 + rel.sparkle);
      if (rel.type === "ring") {
        const gold = [255 * pulse, 205 * pulse, 55];
        pixc(screen, rel.x, ry, gold, 0.95);
        if (pulse > 0.85) {
          pixc(screen, rel.x - 1, ry, gold, 0.45);
          pixc(screen, rel.x + 1, ry, gold, 0.45);
        }
      } else if (rel.type === "drill") {
        const drCol = [255, 165 * pulse, 65];
        pixc(screen, rel.x, ry, drCol, 1);
        pixc(screen, rel.x, ry + 1, [255, 235, 140], 0.9);
        pixc(screen, rel.x - 1, ry, drCol, 0.75);
        pixc(screen, rel.x + 1, ry, drCol, 0.75);
      } else if (rel.type === "aether") {
        const aeCol = [80, 235 * pulse, 255];
        pixc(screen, rel.x, ry, aeCol, 1);
        pixc(screen, rel.x, ry - 1, [215, 255, 255], 0.9);
      } else {
        const led = [90, 255 * pulse, 185 * pulse];
        pixc(screen, rel.x, ry, led, 0.95);
        pixc(screen, rel.x, ry - 1, [220, 255, 240], 0.55);
      }
    });

    // 12. Subterranean Rising Ember-Tar Veins & Surface Pools
    TarVeins.forEach((v) => {
      const groundH = Blocks[v.x] || 10;
      const maxTopY = H - groundH;
      const veinTopY = Math.round(H - groundH * v.progress);
      const span = Math.max(1, H - 1 - Math.max(maxTopY, veinTopY));
      for (let y = H - 1; y >= Math.max(maxTopY, veinTopY); y--) {
        const u = (H - 1 - y) / span;
        const shimmer = 0.5 + 0.5 * Math.sin(frameCount * 0.14 + y * 0.55 + v.pulse);
        const r = 192 + u * 36 + shimmer * 18;
        const g = 86 + u * 38 + shimmer * 22;
        const b = 58 + u * 18 + shimmer * 10;
        const veinCol = bgTint(0.58 + u * 0.18, r, g, b, 0.58);
        pixc(screen, v.x, y, veinCol, 0.92);

        const spark = Math.sin(frameCount * 0.24 - y * 0.9 + v.pulse * 1.7);
        if (spark > 0.82) {
          const sparkCol = bgTint(0.95, 252, 184, 112, 0.68);
          pixc(screen, v.x, y, sparkCol, 0.95);
        }
        if ((y + Math.floor(frameCount / 7)) % 3 === 0) {
          pixc(screen, v.x - 1, y, veinCol, 0.45);
        } else if ((y + Math.floor(frameCount / 7)) % 3 === 1) {
          pixc(screen, v.x + 1, y, veinCol, 0.45);
        }
      }
      if (v.erupted) {
        for (let dx = -v.spread; dx <= v.spread; dx++) {
          const tx = Math.max(0, Math.min(W - 1, v.x + dx));
          const ty = H - Blocks[tx];
          const bubble = (frameCount + dx * 7) % 18 < 4 ? 1 : 0;
          const crestCol = bgTint(0.82, 242, 142, 82, 0.62);
          const poolCol = bgTint(0.62, 204, 92, 58, 0.58);
          if (bubble) {
            pixc(screen, tx, ty - 1, crestCol, 0.88);
          }
          pixc(screen, tx, ty, poolCol, 0.95);
        }
      }
    });

    // 13. Subterranean Rust-Worms
    Worms.forEach((w) => {
      const wormColor = w.stunTimer > 0 ? [130, 220, 255] : [215, 105, 55];
      w.segments.forEach((seg, idx) => {
        const sy = H - seg.y;
        pixc(screen, seg.x, sy, idx === 0 ? [255, 165, 80] : wormColor, 0.95);
      });
    });

    // 14. Spooky Caves in the Hillside
    Caves.forEach((c) => {
      const caveElev = Math.max(2, Blocks[c.x] - c.depth);
      const cy = H - caveElev;
      const glow = c.glow > 0 ? (c.glow--, 1) : 0.5 + 0.5 * Math.sin(frameCount * 0.1 + c.x);
      drawRect(screen, c.x - 1, cy - 3, 3, 4, bg(0.26), 0.95);
      pixc(screen, c.x, cy - 4, bg(0.30), 0.9);
      const eyeColor = c.glow > 0 ? [255, 245, 140] : bgTint(0.9, 250, 195, 95, 0.65 * glow + 0.25);
      pixc(screen, c.x - 1, cy - 2, eyeColor, 0.95);
      pixc(screen, c.x + 1, cy - 2, eyeColor, 0.95);
    });

    // 15. Raptor Mountain Nests with Speckled Eggs & Swooping Sky Raptors!
    Nests.forEach((nest) => {
      const ny = H - Blocks[nest.x];
      // Woven nest bowl
      drawRect(screen, nest.x - 2, ny - 1, 5, 1, [195, 145, 85], 1);
      pix(screen, nest.x - 2, ny - 2, 180, 130, 75, 1);
      pix(screen, nest.x + 2, ny - 2, 180, 130, 75, 1);
      if (nest.hasEgg && !nest.hatched) {
        // Speckled cream-gold Raptor Egg!
        const pulse = 0.85 + 0.15 * Math.sin(frameCount * 0.15 + nest.x);
        drawRect(screen, nest.x, ny - 3, 1, 2, [255 * pulse, 245 * pulse, 200], 1);
        pix(screen, nest.x, ny - 2, 235, 175, 95, 1);
      }
    });

    Raptors.forEach((rp) => {
      const rx = Math.round(rp.x);
      const ry = Math.round(rp.y);
      const wing = Math.round(Math.sin(frameCount * 0.32 + rp.phase) * 2);
      const col = P.raptorPet ? [115, 245, 195] : [225, 145, 85];
      pixc(screen, rx, ry, col, 1);
      pixc(screen, rx - 1, ry, col, 1);
      pixc(screen, rx + 1, ry, [255, 220, 110], 1);
      pixc(screen, rx - 2, ry + wing, col, 0.9);
      pixc(screen, rx + 2, ry - wing, col, 0.9);
    });

    // 16. Floating Castles in the Sky (Laputa Citadel with Giant Aetherium Root!)
    Castles.forEach((cas) => {
      const cy = H - Blocks[cas.x];
      const stone = bg(0.82);
      const trim = bg(0.64);
      // Base fortress keep & twin towers
      drawRect(screen, cas.x - 6, cy - 6, 13, 6, stone, 1);
      drawRect(screen, cas.x - 6, cy - 10, 3, 4, stone, 1);
      drawRect(screen, cas.x + 4, cy - 10, 3, 4, stone, 1);
      drawRect(screen, cas.x - 2, cy - 13, 5, 7, trim, 1);
      // Glowing Aetherium crest & sanctuary gate
      const aethCol = cas.activated ? [110, 255, 255] : [80, 215, 250];
      drawRect(screen, cas.x - 1, cy - 3, 3, 3, bg(0.24), 1);
      pixc(screen, cas.x, cy - 9, aethCol, 1);
      pixc(screen, cas.x, cy - 14, [220, 255, 255], 0.95);
      // Giant glowing Aetherium root beneath the island!
      const rootY = H - IslandBase[cas.x];
      drawRect(screen, cas.x - 1, rootY, 3, 3, aethCol, 0.9);
      pix(screen, cas.x, rootY + 3, 210, 255, 255, 0.95);
    });

    // 17. Floating Airships (Friendly Dirigibles vs Pirate Dreadnoughts)
    Airships.forEach((sh) => {
      const sx = Math.round(sh.x);
      const sy = H - Math.round(sh.y); // Deck screen Y
      const isFriendly = sh.type === "friendly";
      const hullCol = isFriendly ? bg(0.84) : [185, 82, 68];
      const balloonCol = isFriendly ? bgTint(0.92, 235, 245, 215, 0.35) : bgTint(0.45, 195, 75, 65, 0.55);
      const lightCol = isFriendly ? [110, 255, 195] : [255, 135, 75];

      // Upper gas envelope / balloon (above deck so player can walk on deck sy!)
      drawRect(screen, sx - 5, sy - 8, 11, 3, balloonCol, 0.95);
      drawRect(screen, sx - 4, sy - 9, 9, 1, balloonCol, 0.9);
      // Struts
      pixc(screen, sx - 3, sy - 5, bg(0.35), 0.85);
      pixc(screen, sx + 3, sy - 5, bg(0.35), 0.85);
      // Solid walkable gondola deck at sy..sy+1
      drawRect(screen, sx - 5, sy, 11, 2, hullCol, 1);
      // Running beacon lights & spinning rear propeller
      pixc(screen, sx, sy, lightCol, 1);
      const propX = sh.vx >= 0 ? sx - 6 : sx + 6;
      const blade = Math.floor(sh.propPhase) & 1;
      pix(screen, propX, sy - blade, 240, 245, 255, 0.9);
      pix(screen, propX, sy + 1 - blade, 180, 220, 230, 0.8);
    });

    // 18. Terraced Coastal Town Structures
    Towns.forEach((t) => {
      const ty = H - Blocks[t.x];
      if (t.type === "cottage") {
        drawRect(screen, t.x - 1, ty - 3, 3, 3, bg(0.78), 1);
        pixc(screen, t.x, ty - 4, bg(0.62), 1);
        const warm = 0.8 + 0.2 * Math.sin(frameCount * 0.08 + t.x);
        pix(screen, t.x, ty - 2, 255 * warm, 215 * warm, 95, 1);
      } else if (t.type === "lighthouse") {
        drawRect(screen, t.x, ty - 6, 1, 6, bg(0.88), 1);
        pix(screen, t.x, ty - 7, 255, 240, 140, 1);
        const beamDir = Math.sin(frameCount * 0.06 + t.x) >= 0 ? 1 : -1;
        for (let b = 1; b <= 5; b++) {
          pix(screen, t.x + beamDir * b, ty - 7, 255, 245, 175, 0.55 - b * 0.09);
        }
      } else if (t.type === "beacon") {
        // Aetherium Sky-Link Beacon
        drawRect(screen, t.x, ty - 5, 1, 5, [95, 235, 255], 0.95);
        pix(screen, t.x, ty - 6, 225, 255, 255, 1);
      } else {
        drawRect(screen, t.x - 1, ty - 4, 1, 4, bg(0.82), 1);
        drawRect(screen, t.x + 1, ty - 5, 1, 5, bg(0.82), 1);
        const shimmer = 0.6 + 0.4 * Math.sin(frameCount * 0.18 + t.x);
        pix(screen, t.x, ty - 3, 160, 255 * shimmer, 235, 0.9);
      }
    });

    // 18B. Multi-Scale Ecological Layer (2x2 Ferns/Critters, 3x3 Orange Villagers/Skeksis/Seer Crows, 5x5/7x7 Vats & Automata)
    if (ecology && primeRenderer) {
      ecology.render(primeRenderer, {
        Blocks,
        Towns,
        TarVeins,
        Crystals,
        Relics,
        P,
        frameCount,
        seaLevel,
        worldLayer,
      });
    }

    // 18C. Cosmic Multi-Resolution Layer (WFC 3x3/5x5/7x7 Masonry Seepage, Conduits, WASM Labs,
    // Worker Swarms, Evolving DNA Flora, Rideable Crafts, 100x Time Crystals, Angels & PiP Pocket Lens)
    if (cosmic && primeRenderer) {
      cosmic.render(primeRenderer, getWorldBundle(), ecology ? ecology.eco : null);
    }

    // 18D. Embodied Tab-Form Lifeforms (Live Hardcore Hairline Terminal Bodies, Thrusters, Treads, Arms, Rooftop Bus & Perches)
    if (tabForms && primeRenderer) {
      tabForms.render(
        primeRenderer,
        getWorldBundle(),
        ecology ? ecology.eco : null,
        cosmic ? cosmic.cosmic : null
      );
    }

    // 19. Rolling Round Rocks
    Rocks.forEach((r) => {
      const rx = Math.round(r.x);
      const ry = H - Math.round(r.y) - 1;
      const rCol = r.isBomb ? [230, 95, 65] : bg(0.24);
      drawRect(screen, rx, ry - 1, 2, 2, rCol, 1);
      const hiX = rx + (Math.floor(r.spin) & 1);
      pixc(screen, hiX, ry - 1, r.isBomb ? [255, 210, 95] : bg(0.85), 0.9);
    });

    // 20. Vermuna (The Large Bird overhead)
    if (Vermuna.active) {
      const vx = Math.round(Vermuna.x);
      const vy = Math.round(Vermuna.y);
      const wingY = Math.round(Math.sin(Vermuna.wingPhase) * 1.6);
      const birdCol = Vermuna.rescueMode ? [255, 230, 110] : bg(0.28);
      pixc(screen, vx, vy, birdCol, 1);
      pixc(screen, vx + (Vermuna.vx > 0 ? 1 : -1), vy, birdCol, 1);
      pixc(screen, vx - 1, vy + wingY, birdCol, 0.95);
      pixc(screen, vx - 2, vy + wingY, birdCol, 0.85);
      pixc(screen, vx + 1, vy - wingY, birdCol, 0.95);
      pixc(screen, vx + 2, vy - wingY, birdCol, 0.85);
      if (!Vermuna.dropped && !Vermuna.rescueMode) {
        pixc(screen, vx, vy + 1, bg(0.18), 1);
      }
    }

    // 21. Sonic Tamp Shockwaves
    Shockwaves.forEach((sw) => {
      const r = Math.round(sw.radius);
      const alpha = Math.max(0.1, 1 - sw.radius / sw.maxRadius);
      const col = P.aether > 0 ? [115, 245, 255] : [255, 225, 110];
      for (let a = 0; a < 12; a++) {
        const ang = (a / 12) * Math.PI * 2;
        const px = Math.round(sw.x + Math.cos(ang) * r);
        const py = Math.round(sw.y + Math.sin(ang) * r);
        pixc(screen, px, py, col, alpha);
      }
    });

    // 22. Particles
    Particles.forEach((pt) => {
      pixc(screen, Math.round(pt.x), Math.round(pt.y), pt.color, pt.life / pt.maxLife);
    });

    // 23. Original 6-Pixel Robot (TACHIMA-307) + Attached Modules + Binary P.e Tower!
    const pyTop = H - Math.round(P.y) - 6;
    drawRect(screen, P.x, pyTop, 1, 6, bg(0.25), 1);

    // Attached SKY WINGS on shoulders
    if (P.wings) {
      const flap = P.hopTimer > 0 ? (frameCount & 1) : 0;
      pix(screen, P.x - 1, pyTop + 2 - flap, 195, 250, 235, 0.95);
      pix(screen, P.x + 1, pyTop + 2 - flap, 195, 250, 235, 0.95);
    }

    // Attached AETHERIUM CORE glowing on chest (Castle in the Sky blue levitation stone!)
    if (P.aether > 0) {
      pix(screen, P.x, pyTop + 2, 85, 240, 255, 1);
    }

    // Attached AUGER DRILL gleaming at feet
    if (P.drill) {
      pix(screen, P.x, pyTop + 6, 255, 185, 75, 1);
    }

    // Loyal Hatched Sky-Raptor Companion flying beside Tachima!
    if (P.raptorPet) {
      const rx = P.x - P.facing * 3;
      const ry = pyTop - 2 + Math.round(Math.sin(frameCount * 0.25) * 1.2);
      pix(screen, rx, ry, 115, 245, 195, 1);
      pix(screen, rx - 1, ry + (frameCount & 1), 185, 255, 220, 0.9);
      pix(screen, rx + 1, ry - (frameCount & 1), 185, 255, 220, 0.9);
    }

    // Glowing head diode
    if (P.carryingRock) {
      pix(screen, P.x, pyTop - 1, 255, 210, 75, 1);
    } else {
      pixc(screen, P.x, pyTop, bgTint(1.35, 220, 255, 240, 0.5), 1);
    }

    // Original binary P.e stack above robot's head
    let b = Math.abs(Math.round(P.e));
    let p = 2;
    while (b > 0) {
      if (b % 2) {
        pixc(screen, P.x, pyTop - p, P.forge ? [255, 220, 95] : bg(0.25), 1);
      }
      b = b >> 1;
      p++;
    }

    // 23B. Hyper-Detailed 1:1 Device-Pixel World Art Overhaul (Towns, Caves, Crystals, Mushrooms, Dwarves, Castles, Raptors, Worms, Relics, Vermuna, Rocks & TACHIMA-307)
    if (
      primeRenderer &&
      window.SlopesParallaxDitherArt &&
      typeof window.SlopesParallaxDitherArt.renderDetailedWorldObjects === "function"
    ) {
      window.SlopesParallaxDitherArt.renderDetailedWorldObjects(
        primeRenderer,
        getWorldBundle(),
        ecology ? ecology.eco : null,
        cosmic ? cosmic.cosmic : null,
        frameCount
      );
    }

    // 23C. Poetic Sky Narrative Temporary Fading Overlay with Sharp Background Outline Shadow
    //      Renders over sky objects (Airships, Castles, Birds, Tab-Forms, Labs) with a crisp, non-glowing
    //      background outline shadow around the pixels and fades out temporarily so the text is always legible.
    if (skyMessageAlpha > 0.02) {
      const inkColor = bg(0.14);
      const shadowBgColor = bg(1.02);
      const sharpAlpha = Math.min(1.0, skyMessageAlpha);
      // Pass 1: Sharp background outline shadow around active glyph pixels (solid sky-cutout silhouette, not a soft glow)
      for (let y = 0; y < TEXT_H; y++) {
        for (let x = 0; x < W; x++) {
          const idx = (x + y * W) * 4;
          if (tC.data[idx + 3]) continue;
          let touchesGlyph = false;
          for (let dy = -1; dy <= 1 && !touchesGlyph; dy++) {
            const ny = y + dy;
            if (ny < 0 || ny >= TEXT_H) continue;
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue;
              const nx = x + dx;
              if (nx < 0 || nx >= W) continue;
              if (tC.data[(nx + ny * W) * 4 + 3]) {
                touchesGlyph = true;
                break;
              }
            }
          }
          if (touchesGlyph) {
            pixc(screen, x, y + 3, shadowBgColor, sharpAlpha);
          }
        }
      }
      // Pass 2: Crisp foreground glyph pixels on top + 1-native-pixel sharp drop-offset shadow
      const dropColor = bg(1.18);
      for (let y = 0; y < TEXT_H; y++) {
        for (let x = 0; x < W; x++) {
          const idx = (x + y * W) * 4;
          if (tC.data[idx + 3]) {
            if (primeRenderer && typeof primeRenderer.fillNativeRect === "function") {
              const nx = x * 7;
              const ny = (y + 3) * 7;
              primeRenderer.fillNativeRect(nx - 1, ny - 1, 9, 9, shadowBgColor[0], shadowBgColor[1], shadowBgColor[2], sharpAlpha);
              primeRenderer.fillNativeRect(nx + 1, ny + 1, 7, 7, dropColor[0], dropColor[1], dropColor[2], sharpAlpha);
              primeRenderer.fillNativeRect(nx, ny, 7, 7, inkColor[0], inkColor[1], inkColor[2], sharpAlpha);
            } else {
              pixc(screen, x, y + 3, inkColor, sharpAlpha);
            }
          }
        }
      }
    }

    // 24. Subtle Pixel Health Bar + Attachment Indicator Diodes at top-left
    const barW = 12;
    const filled = Math.ceil((health / maxHealth) * barW);
    for (let i = 0; i < barW; i++) {
      if (i < filled) {
        const hCol =
          health > 40
            ? bg(1.28)
            : (frameCount >> 2) & 1
            ? [255, 95, 95]
            : bg(0.35);
        pixc(screen, 2 + i, 1, hCol, 0.88);
      } else {
        pixc(screen, 2 + i, 1, bg(0.35), 0.35);
      }
    }
    // Module LED pips next to health bar (Amber = Drill, Cyan = Aetherium, Mint = Wings, Gold = Raptor)
    if (P.drill) pix(screen, 16, 1, 255, 185, 75, 0.95);
    if (P.aether > 0) pix(screen, 18, 1, 85, 240, 255, 0.95);
    if (P.wings) pix(screen, 20, 1, 145, 255, 210, 0.95);
    if (P.raptorPet) pix(screen, 22, 1, 255, 235, 115, 0.95);

    // 24B. 5-Fold Pentagonal Rotation Compass Overlay at top-center + Post-Settle Flocking Swarm
    if (rotation && primeRenderer) {
      if (!rotation.isAnimating && rotation.state && rotation.state.postSettleFlockFrames > 0) {
        rotation.render(
          primeRenderer,
          getWorldBundle(),
          ecology ? ecology.eco : null,
          cosmic ? cosmic.cosmic : null,
          tabForms ? tabForms.tabForms : null
        );
      }
      rotation.renderCompassOverlay(primeRenderer);
    }

    presentWorldToViewportCanvas(false);

    // Update bottom Hairline Terminus pixel HUD with Layer, 5-Fold Facet, Civilization Pop, Vats, Tab-Forms & Integrity
    if (window.SlopesHUD && frameCount % 4 === 0) {
      const layerTag =
        worldLayer === 0
          ? "L0:SEA"
          : worldLayer < 0
          ? `L${worldLayer}:${currentBiomeLabel.split(" ")[0]}`
          : `L+${worldLayer}:${currentBiomeLabel.split(" ")[0]}`;
      const rotTag = rotation ? ` ROT:${rotation.rotFacet}/5` : "";
      const pop = ecology ? ecology.eco.OrangePeople.length + ecology.eco.Children.length : Towns.length;
      const vats = ecology ? ecology.eco.ComputeVats.length : 0;
      const bots = ecology ? ecology.eco.Automata.length : 0;
      const tabs = tabForms ? tabForms.tabForms.length : 0;
      const wfcCount = cosmic ? cosmic.cosmic.WfcZones.length : 0;
      const timeTag =
        cosmic && cosmic.cosmic.timeDilation > 1
          ? ` ${cosmic.cosmic.timeDilation}X`
          : cosmic && cosmic.cosmic.activePocket
          ? " PKT"
          : cosmic && cosmic.cosmic.mountedCraft
          ? " CRF"
          : ` WFC:${wfcCount}`;
      window.SlopesHUD.update(
        `MB ${Math.round(health)}% ${layerTag}${rotTag} POP:${pop} VAT:${vats} BOT:${bots} TAB:${tabs}${timeTag} MOD:${getAttachmentSummary()}`
      );
    }
  }

  // --- Main ~30fps Fixed-Step Loop ---
  let lastTick = 0;
  function loop(ts) {
    requestAnimationFrame(loop);
    if (ts - lastTick < 32) return;
    lastTick = ts;
    updateSimulation();
    renderFrame();
  }

  // Expose public controller interface (for Keyboard, Touch Pads, AI Text Console & MCP Server)
  window.SlopesGame = {
    action(btn, arg1, arg2) {
      if (window.SlopesAudio) window.SlopesAudio.unlock();
      const wb = getWorldBundle();
      const ecoRef = ecology ? ecology.eco : null;
      switch (btn) {
        case "l":
          moveHorizontal(-1);
          break;
        case "r":
          moveHorizontal(1);
          break;
        case "d":
          digAction();
          break;
        case "u":
          buildAction();
          break;
        case "crs":
          sonicTampAction();
          break;
        case "cir":
          rockAction();
          break;
        case "tri":
          hopAndCallAction();
          break;
        case "sqr":
          terraceAction();
          break;
        case "time":
          if (cosmic) {
            cosmic.activateTimeCrystal(wb, ecoRef, arg1 || 100, arg2 || 120);
            if (window.SlopesAudio && window.SlopesAudio.playTimeCrystalWarp) {
              window.SlopesAudio.playTimeCrystalWarp(true);
            }
          }
          break;
        case "wasm":
          if (cosmic) {
            cosmic.triggerWasmExperiment(arg1, wb, ecoRef);
            if (window.SlopesAudio && window.SlopesAudio.playWasmDiscovery) {
              window.SlopesAudio.playWasmDiscovery(0);
            }
          }
          break;
        case "portal":
          if (cosmic) {
            cosmic.enterOrExitRecursive(wb, ecoRef, arg1);
            if (window.SlopesAudio && window.SlopesAudio.playPortalShift) {
              window.SlopesAudio.playPortalShift(!!cosmic.cosmic.activePocket);
            }
          }
          break;
        case "craft":
          if (cosmic) {
            cosmic.boardOrExitCraft(wb, arg1);
            if (window.SlopesAudio && window.SlopesAudio.playClick) {
              window.SlopesAudio.playClick(true);
            }
          }
          break;
        case "conduit":
          if (cosmic) {
            cosmic.layConduitNearPlayer(wb, ecoRef, arg1, arg2);
            if (window.SlopesAudio && window.SlopesAudio.playTineBell) {
              window.SlopesAudio.playTineBell(69, 1.1, 0.16);
            }
          }
          break;
        case "wfc":
          if (cosmic) {
            cosmic.triggerWfcSeepAt(arg1 !== undefined ? arg1 : P.x, P.y, arg2, "manual");
          }
          break;
        case "slice":
          if (cosmic) {
            cosmic.shiftTopologySlice(wb, arg1);
            if (rotation) {
              rotation.rotateRight(
                wb,
                ecoRef,
                cosmic ? cosmic.cosmic : null,
                tabForms ? tabForms.tabForms : null
              );
            }
            if (window.SlopesAudio && window.SlopesAudio.playAngelChord) {
              window.SlopesAudio.playAngelChord(Math.round(cosmic.cosmic.topologySlice * 4));
            }
          }
          break;
        case "rotL":
          if (rotation) {
            rotation.rotateLeft(
              wb,
              ecoRef,
              cosmic ? cosmic.cosmic : null,
              tabForms ? tabForms.tabForms : null
            );
          }
          break;
        case "rotR":
          if (rotation) {
            rotation.rotateRight(
              wb,
              ecoRef,
              cosmic ? cosmic.cosmic : null,
              tabForms ? tabForms.tabForms : null
            );
          }
          break;
        case "rotRev":
          if (rotation) {
            rotation.rotateReverse(
              wb,
              ecoRef,
              cosmic ? cosmic.cosmic : null,
              tabForms ? tabForms.tabForms : null
            );
          }
          break;
        case "rotate":
          if (rotation) {
            const steps = arg1 !== undefined ? parseInt(arg1, 10) || 1 : 1;
            rotation.startRotation(
              steps,
              wb,
              ecoRef,
              cosmic ? cosmic.cosmic : null,
              tabForms ? tabForms.tabForms : null
            );
          }
          break;
        case "zoomIn":
          if (window.SlopesChronosAndCiv && typeof window.SlopesChronosAndCiv.zoomInAt === "function") {
            const zs = window.SlopesChronosAndCiv.zoomState;
            const fx = zs && zs.lastHoverX ? zs.lastHoverX : Math.round(P.x * 7);
            const fy = zs && zs.lastHoverY ? zs.lastHoverY : Math.round((H - P.y) * 7);
            const d = window.SlopesChronosAndCiv.zoomInAt(fx, fy);
            if (window.SlopesAudio && window.SlopesAudio.playClick) window.SlopesAudio.playClick(true);
            const lbl = d < 0 ? `WIDE ${d === -1 ? "0.7X" : "0.5X"}` : d === 0 ? "ORIGIN 1.0X" : `DEPTH ${d}/5`;
            announceSky("PRIME ZOOM IN", lbl, 90);
          }
          break;
        case "zoomOut":
          if (window.SlopesChronosAndCiv && typeof window.SlopesChronosAndCiv.zoomOutAt === "function") {
            const zs = window.SlopesChronosAndCiv.zoomState;
            const fx = zs && zs.lastHoverX ? zs.lastHoverX : Math.round(P.x * 7);
            const fy = zs && zs.lastHoverY ? zs.lastHoverY : Math.round((H - P.y) * 7);
            const d = window.SlopesChronosAndCiv.zoomOutAt(fx, fy);
            if (window.SlopesAudio && window.SlopesAudio.playClick) window.SlopesAudio.playClick(false);
            const lbl = d < 0 ? `WIDE ${d === -1 ? "0.7X" : "0.5X"}` : d === 0 ? "ORIGIN 1.0X" : `DEPTH ${d}/5`;
            announceSky("PRIME ZOOM OUT", lbl, 90);
          }
          break;
        case "tabform":
          if (tabForms) {
            if (typeof arg1 === "string" && arg1.length > 0 && typeof tabForms.executeCommand === "function") {
              if (arg2 !== undefined) {
                tabForms.executeCommand(arg1, arg2);
              } else {
                tabForms.executeCommand(arg1);
              }
            } else if (typeof tabForms.toggleTerminal === "function") {
              tabForms.toggleTerminal();
            }
          }
          break;
        case "sel":
          if (window.SlopesAudio) {
            const scaleName = window.SlopesAudio.cycleScale();
            const pIdx = (frameCount + actIndex + 1) % SKY_PALETTES.length;
            canvas.style.backgroundColor = SKY_PALETTES[pIdx];
            announceSky("HARMONIC SCALE", scaleName, 140);
          }
          break;
      }
    },
    step(frames = 1) {
      const n = Math.max(1, Math.min(500, Math.floor(frames)));
      const wasPaused = paused;
      paused = false;
      for (let i = 0; i < n; i++) {
        updateSimulation();
      }
      renderFrame();
      paused = wasPaused;
      return this.state;
    },
    render() {
      renderFrame();
    },
    newWorld(seed) {
      generateWorld(seed);
    },
    setPaused(p) {
      paused = !!p;
    },
    getWorldBundle,
    get ecologySystem() {
      return ecology;
    },
    get cosmicSystem() {
      return cosmic;
    },
    get rotationSystem() {
      return rotation;
    },
    get tabFormSystem() {
      return tabForms;
    },
    get primeRenderer() {
      return primeRenderer;
    },
    get state() {
      return {
        health,
        score,
        cavesFed,
        veinsShattered,
        ringsFound,
        worldX,
        worldLayer,
        rotFacet: rotation ? rotation.rotFacet : 0,
        rotation: rotation ? rotation.getStatus() : null,
        biome: currentBiome,
        biomeLabel: currentBiomeLabel,
        attachments: getAttachmentSummary(),
        actTitle: STORY_ACTS[actIndex % STORY_ACTS.length].title,
        seed: masterSeed,
        blocks: Blocks,
        ceiling: Ceiling,
        islandBase: IslandBase,
        seaLevel,
        isMagmaBasin,
        playerX: P.x,
        playerY: P.y,
        playerE: P.e,
        player: P,
        towns: Towns,
        caves: Caves,
        tarVeins: TarVeins,
        worms: Worms,
        relics: Relics,
        crystals: Crystals,
        airships: Airships,
        raptors: Raptors,
        nests: Nests,
        castles: Castles,
        mushrooms: Mushrooms,
        dwarves: Dwarves,
        kelp: Kelp,
        rocks: Rocks,
        skyMessage,
        frameCount,
        orangePop: ecology ? ecology.eco.OrangePeople.length + ecology.eco.Children.length : 0,
        vats: ecology ? ecology.eco.ComputeVats.length : 0,
        automata: ecology ? ecology.eco.Automata.length : 0,
        crows: ecology ? ecology.eco.SeerCrows.length : 0,
        skeksis: ecology ? ecology.eco.Skeksis.length : 0,
        goo: ecology ? ecology.eco.GooNodes.length : 0,
        webs: ecology ? ecology.eco.Webs.length : 0,
        ecology: ecology ? ecology.eco : null,
        cosmic: cosmic ? cosmic.cosmic : null,
        tabForms: tabForms ? tabForms.tabForms : [],
      };
    },
    evalInScope(code) {
      return eval(code);
    },
  };
  window.__slopes2EvalInScope = function (code) {
    return eval(code);
  };

  generateWorld();
  if (window.SlopesAI && typeof window.SlopesAI.attachGame === "function") {
    window.SlopesAI.attachGame(window.SlopesGame);
  }
  requestAnimationFrame(loop);
})();
