/* ============================================================================
 * SLOPES 2 — UNIFIED 64-BIT GENETIC FLORA & FAUNA ENGINE
 * Drop-In Simulation & Device-Pixel Renderer (/sim/genetic_flora_engine.js)
 *
 * One shared 64-bit genome (16 genes x 4 bits) and one developmental
 * L-system / turtle grammar grow every plant on screen:
 *   Canopy Trees, Weeping Willows, Ancient Gnarled Bonsai Pines, Flowering
 *   Shrubs, Wildflowers, Moss Carpets, Hanging Cavern Vines, Fruiting Orchards,
 *   Root Vegetables, Cloud-Kelp (anchored in high clouds) and Bioluminescent
 *   Sea-Flora (below seaLevel).
 * The genome's FORM gene picks a body plan; the habitat a seed lands in can
 * override it (a willow seed in the sea grows as drooping sea-flora, a seed
 * stuck to a cave ceiling grows as a vine) while every other gene keeps
 * shaping the same grammar.
 *
 * Environment driving growth:
 *   - Per-cell sunlight with a sweeping sun angle and real cast shadows from
 *     terrain, cliffs, canopy leaves, airships, castles, labs, WFC megastructures
 *     and clouds (slanted ray-propagated transmission grid).
 *   - Per-column hydrology: Darcy groundwater flow from the sea, rain clouds,
 *     a mountain spring feeding a downhill river, cave drips, evaporation,
 *     root uptake, nutrient diffusion/decay and root-stabilized soil.
 *   - Multi-frequency wind: prevailing drift, travelling gust waves, log-profile
 *     altitude shear, domain-warped turbulence, hill lee rotors and Karman
 *     vortex streets behind airships/megastructures.
 * Evolution: wind-borne pollen, seeds and spores; two-point crossover with
 * point/reset/duplication mutations; establishment and survival filtered by
 * local sun/water/soil/altitude/wind fitness; small pollinator fauna.
 * Civilizations (Orange People, Good Builders, White Monoliths, WASM
 * Scientists) farm, irrigate, harvest, prune timber and splice genes live.
 *
 * Coordinate conventions (match slopes2.js):
 *   col    : coarse column 0..W-1
 *   y / e  : coarse ELEVATION measured up from the bottom of the screen
 *            (Blocks-style; the air cell just above col c's ground is y = Blocks[c])
 *   px, py : native device pixels (840x525 at 120x75, 1008x630 at 144x90 — the
 *            engine adapts to primeRenderer.COARSE_W/COARSE_H automatically)
 *
 * API (window.SlopesGeneticFlora / module.exports):
 *   init(world), step(world, eco, cosmic, tick),
 *   render(primeRenderer, world, eco, cosmic, tick),
 *   onCivilizationEditGenome(x, trait, world), getShadowFactorAt(col, y),
 *   getWindAt(col, y, tick), getStatus()  (+ getLightAt, getMoistureAt, sowAt ...)
 * ============================================================================ */

(function (global) {
  "use strict";

  const VERSION = "1.0.0";
  const SCALE = 7;
  const DEG = Math.PI / 180;
  const TAU = Math.PI * 2;

  let W = 120;
  let H = 75;
  let NW = W * SCALE;
  let NH = H * SCALE;

  const MAX_PLANTS = 150;
  const MAX_PTS = 3200;
  const MAX_PARTICLES = 900;
  const MAX_FAUNA = 14;
  const PHYS_INTERVAL = 6;
  const DAY_TICKS = 7200;
  const DAYS_PER_YEAR = 6;

  // ==========================================================================
  // 1. RNG, HASH & LUTS
  // ==========================================================================
  function mulberry32(seed) {
    let s = seed >>> 0;
    return function () {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hash2(x, y) {
    let h = Math.imul(x | 0, 0x27d4eb2d) ^ Math.imul((y | 0) + 0x9e3779b9, 0x165667b1);
    h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  }

  function clamp(v, a, b) {
    return v < a ? a : v > b ? b : v;
  }

  const SINL = new Float32Array(256);
  for (let i = 0; i < 256; i++) SINL[i] = Math.sin((i / 256) * TAU);

  let rng = mulberry32(0x5eed1e57);

  // ==========================================================================
  // 2. THE 64-BIT GENOME (16 genes x 4 bits, stored as two uint32 words)
  // ==========================================================================
  const GENE = {
    FORM: 0, APICAL: 1, ANGLE: 2, DEPTH: 3, DROOP: 4, GNARL: 5, LEAF_DENSITY: 6, LEAF_SHAPE: 7,
    HUE: 8, YIELD: 9, ROOT_DEPTH: 10, SHADE_TOL: 11, DROUGHT_TOL: 12, ALTITUDE: 13, BIOLUM: 14, TIMBER: 15,
  };
  const GENE_NAMES = Object.keys(GENE);

  function getGene(g, i) {
    return i < 8 ? (g.lo >>> (i << 2)) & 15 : (g.hi >>> ((i - 8) << 2)) & 15;
  }

  function setGene(g, i, v) {
    v = clamp(v | 0, 0, 15);
    if (i < 8) {
      const s = i << 2;
      g.lo = ((g.lo & ~(15 << s)) | (v << s)) >>> 0;
    } else {
      const s = (i - 8) << 2;
      g.hi = ((g.hi & ~(15 << s)) | (v << s)) >>> 0;
    }
  }

  function genomeFromGenes(arr) {
    const g = { lo: 0, hi: 0 };
    for (let i = 0; i < 16; i++) setGene(g, i, arr[i] | 0);
    return g;
  }

  function cloneGenome(g) {
    return { lo: g.lo >>> 0, hi: g.hi >>> 0 };
  }

  function genomeHex(g) {
    return (g.hi >>> 0).toString(16).padStart(8, "0") + (g.lo >>> 0).toString(16).padStart(8, "0");
  }

  function genomeFromHex(hex) {
    const s = String(hex || "").replace(/[^0-9a-f]/gi, "").padStart(16, "0").slice(-16);
    return { hi: parseInt(s.slice(0, 8), 16) >>> 0, lo: parseInt(s.slice(8), 16) >>> 0 };
  }

  function geneticDistance(a, b) {
    let d = 0;
    for (let i = 0; i < 16; i++) d += Math.abs(getGene(a, i) - getGene(b, i));
    return d / 240;
  }

  // Two-point crossover over the 16-gene chromosome, with occasional uniform mixing
  function crossover(a, b, r) {
    r = r || rng;
    const child = { lo: 0, hi: 0 };
    let c1 = (r() * 16) | 0;
    let c2 = (r() * 16) | 0;
    if (c1 > c2) { const tmp = c1; c1 = c2; c2 = tmp; }
    const uniform = r() < 0.1;
    for (let i = 0; i < 16; i++) {
      const fromB = uniform ? r() < 0.5 : i >= c1 && i < c2;
      setGene(child, i, getGene(fromB ? b : a, i));
    }
    state.stats.crossovers++;
    return child;
  }

  // Point nudges (78%), allele resets (16%) and gene conversion/duplication (6%)
  function mutate(g, rate, r) {
    r = r || rng;
    let m = 0;
    for (let i = 0; i < 16; i++) {
      if (r() >= rate) continue;
      const roll = r();
      let v = getGene(g, i);
      if (roll < 0.78) v += (r() < 0.5 ? -1 : 1) * (r() < 0.2 ? 2 : 1);
      else if (roll < 0.94) v = (r() * 16) | 0;
      else v = getGene(g, (r() * 16) | 0);
      setGene(g, i, v);
      m++;
    }
    state.stats.mutations += m;
    return g;
  }

  // ==========================================================================
  // 3. BODY PLANS (one grammar, eleven archetypes)
  // ==========================================================================
  const FORM = {
    CANOPY: 0, WILLOW: 1, BONSAI: 2, SHRUB: 3, WILDFLOWER: 4, MOSS: 5,
    VINE: 6, ORCHARD: 7, ROOTVEG: 8, CLOUDKELP: 9, SEAFLORA: 10,
  };
  const FORM_NAMES = [
    "CANOPY_TREE", "WEEPING_WILLOW", "GNARLED_BONSAI_PINE", "FLOWERING_SHRUB", "WILDFLOWER", "MOSS_CARPET",
    "HANGING_CAVERN_VINE", "FRUITING_ORCHARD", "ROOT_VEGETABLE", "CLOUD_KELP", "BIOLUMINESCENT_SEA_FLORA",
  ];

  // Ground-habitat expression of the FORM gene (0..15)
  const FORM_TABLE = [
    FORM.CANOPY, FORM.CANOPY, FORM.WILLOW, FORM.BONSAI, FORM.SHRUB, FORM.SHRUB, FORM.WILDFLOWER, FORM.WILDFLOWER,
    FORM.MOSS, FORM.MOSS, FORM.ORCHARD, FORM.ORCHARD, FORM.ROOTVEG, FORM.ROOTVEG, FORM.CANOPY, FORM.WILLOW,
  ];
  const FORM_GENE_CHOICES = [[0, 1, 14], [2, 15], [3], [4, 5], [6, 7], [8, 9], [9, 5], [10, 11], [12, 13], [7], [8]];

  // Native-pixel size multipliers per body plan (tuned for the 7x prime lattice)
  const GROWTH_SCALE = [1.75, 1.7, 1.45, 1.4, 1.5, 1, 1.35, 1.6, 1.3, 1.3, 1.45];

  const FORM_INFO = [
    { maxStage: 6, mature: 4, life: 52000, sexual: true, woody: true, growK: 1.5, layer: 0, seedW: 1.4, deciduous: true, tree: true },
    { maxStage: 5, mature: 3, life: 46000, sexual: true, woody: true, growK: 1.4, layer: 0, seedW: 0.5, deciduous: true, tree: true },
    { maxStage: 5, mature: 3, life: 110000, sexual: true, woody: true, growK: 1.8, layer: 1, seedW: 1.1, deciduous: false, tree: false },
    { maxStage: 4, mature: 2, life: 26000, sexual: true, woody: true, growK: 0.9, layer: 2, seedW: 2.0, deciduous: true, tree: false },
    { maxStage: 3, mature: 1, life: 8000, sexual: true, woody: false, growK: 0.45, layer: 3, seedW: 0.55, deciduous: false, tree: false },
    { maxStage: 3, mature: 1, life: 20000, sexual: false, woody: false, growK: 0.35, layer: 4, seedW: 0.2, deciduous: false, tree: false },
    { maxStage: 5, mature: 2, life: 24000, sexual: false, woody: false, growK: 0.6, layer: 5, seedW: 0.9, deciduous: false, tree: false },
    { maxStage: 5, mature: 3, life: 48000, sexual: true, woody: true, growK: 1.3, layer: 1, seedW: 3.0, deciduous: true, tree: true },
    { maxStage: 3, mature: 2, life: 14000, sexual: true, woody: false, growK: 0.5, layer: 3, seedW: 1.0, deciduous: false, tree: false },
    { maxStage: 4, mature: 2, life: 16000, sexual: false, woody: false, growK: 0.5, layer: 7, seedW: 0.3, deciduous: false, tree: false },
    { maxStage: 5, mature: 2, life: 26000, sexual: false, woody: false, growK: 0.6, layer: 2, seedW: 0.4, deciduous: false, tree: false },
  ];

  // Archetype gene templates
  //            form apic angl dpth droo gnar lden lshp hue  yld  root shad drgt alt  bio  timb
  const FORM_TEMPLATES = [
    /* CANOPY    */ [0, 9, 8, 13, 3, 4, 12, 11, 2, 3, 10, 3, 7, 5, 1, 11],
    /* WILLOW    */ [2, 6, 7, 11, 14, 3, 11, 13, 1, 2, 12, 7, 2, 3, 2, 6],
    /* BONSAI    */ [3, 4, 10, 10, 2, 14, 9, 2, 0, 2, 13, 6, 12, 13, 1, 13],
    /* SHRUB     */ [4, 3, 11, 8, 4, 6, 13, 9, 6, 5, 7, 9, 8, 6, 1, 5],
    /* WILDFLWR  */ [6, 12, 9, 6, 2, 3, 7, 6, 9, 4, 5, 6, 9, 7, 2, 2],
    /* MOSS      */ [8, 2, 8, 4, 1, 8, 15, 1, 3, 1, 2, 15, 3, 6, 4, 1],
    /* VINE      */ [9, 5, 9, 9, 13, 9, 11, 10, 11, 6, 6, 13, 5, 3, 11, 3],
    /* ORCHARD   */ [10, 6, 11, 11, 5, 5, 12, 12, 12, 14, 9, 5, 7, 5, 1, 8],
    /* ROOTVEG   */ [12, 2, 9, 5, 3, 2, 10, 12, 13, 13, 9, 6, 7, 5, 1, 1],
    /* CLOUDKELP */ [7, 5, 6, 10, 12, 7, 10, 13, 5, 3, 3, 8, 14, 15, 8, 2],
    /* SEAFLORA  */ [8, 9, 5, 10, 6, 10, 9, 13, 4, 2, 4, 12, 1, 0, 13, 2],
  ];

  function templateGenome(form, r, jitter) {
    r = r || rng;
    const j = jitter === undefined ? 2 : jitter;
    const t = FORM_TEMPLATES[form];
    const arr = new Array(16);
    const choices = FORM_GENE_CHOICES[form];
    arr[0] = choices[(r() * choices.length) | 0];
    for (let i = 1; i < 16; i++) arr[i] = clamp(Math.round(t[i] + (r() - 0.5) * 2 * j), 0, 15);
    return genomeFromGenes(arr);
  }

  function expressedForm(g, habitat) {
    if (habitat === "sea") return FORM.SEAFLORA;
    if (habitat === "ceiling" || habitat === "island") return FORM.VINE;
    if (habitat === "cloud") return FORM.CLOUDKELP;
    return FORM_TABLE[getGene(g, GENE.FORM)];
  }

  // ==========================================================================
  // 4. MUTED MODERN PALETTE (6-stop ramps expanded to 24 entries)
  // ==========================================================================
  function expandRamp(stops) {
    const out = new Uint8Array(24 * 3);
    for (let i = 0; i < 24; i++) {
      const u = (i / 23) * (stops.length - 1);
      const k = Math.min(stops.length - 2, Math.floor(u));
      const f = u - k;
      for (let c = 0; c < 3; c++) out[i * 3 + c] = Math.round(stops[k][c] * (1 - f) + stops[k + 1][c] * f);
    }
    return out;
  }

  const RAMP = {
    bark: expandRamp([[44, 38, 36], [60, 51, 46], [78, 66, 58], [96, 83, 72], [118, 104, 90], [146, 132, 116]]),
    barkWillow: expandRamp([[52, 50, 44], [68, 66, 56], [86, 84, 70], [106, 102, 86], [128, 124, 106], [154, 148, 128]]),
    barkPine: expandRamp([[50, 36, 34], [68, 48, 42], [90, 64, 52], [114, 84, 64], [138, 106, 82], [164, 132, 106]]),
    sage: expandRamp([[50, 68, 56], [66, 88, 70], [84, 108, 84], [104, 126, 96], [128, 146, 112], [156, 168, 134]]),
    olive: expandRamp([[58, 62, 38], [76, 82, 50], [96, 102, 62], [118, 122, 76], [142, 144, 94], [168, 166, 118]]),
    pine: expandRamp([[32, 52, 48], [42, 68, 60], [56, 86, 74], [72, 104, 88], [92, 122, 102], [118, 142, 122]]),
    teal: expandRamp([[28, 58, 68], [38, 78, 86], [52, 100, 104], [70, 122, 122], [94, 144, 138], [126, 168, 158]]),
    plum: expandRamp([[56, 44, 58], [74, 58, 74], [94, 76, 90], [116, 96, 108], [138, 118, 126], [164, 144, 148]]),
    rust: expandRamp([[84, 52, 38], [108, 68, 46], [132, 86, 56], [154, 106, 68], [176, 128, 86], [196, 154, 110]]),
    lichen: expandRamp([[54, 70, 42], [70, 90, 52], [88, 110, 62], [110, 130, 74], [134, 150, 90], [160, 172, 112]]),
    cloud: expandRamp([[108, 126, 134], [126, 144, 150], [146, 162, 166], [168, 180, 182], [190, 198, 198], [212, 216, 214]]),
  };

  const PETALS = [
    [200, 150, 150], [176, 134, 160], [150, 140, 178], [132, 152, 182], [206, 180, 124], [214, 160, 130],
    [224, 214, 196], [190, 120, 120], [168, 180, 150], [210, 170, 180], [140, 120, 150], [226, 196, 150],
    [180, 160, 200], [196, 128, 140], [236, 226, 214], [170, 200, 196],
  ];
  const FRUITS = [[196, 96, 78], [150, 70, 96], [220, 150, 86], [186, 62, 72], [212, 180, 96], [120, 76, 120], [204, 124, 92], [168, 118, 72]];
  const TUBERS = [[150, 64, 84], [206, 122, 66], [184, 156, 116], [176, 150, 188]];
  const GLOWS = [[120, 226, 210], [168, 150, 250], [110, 200, 250], [200, 240, 170]];
  const TRAIT_COLORS = {
    bioluminescence: [130, 236, 214], yield: [226, 168, 96], timber: [176, 140, 104], drought: [214, 196, 132],
    shade: [126, 150, 196], wind: [190, 200, 210], flower: [214, 160, 180], random: [220, 220, 220],
  };
  const UNRIPE = [118, 138, 86];
  const STRAW = [170, 150, 104];

  // ==========================================================================
  // 5. ENGINE STATE & GRIDS
  // ==========================================================================
  const FACTIONS = ["ORANGE_PEOPLE", "GOOD_BUILDERS", "WHITE_MONOLITHS", "WASM_SCIENTISTS", "CIVILIZATION"];

  function freshLedger() {
    const L = {};
    for (const f of FACTIONS) L[f] = { harvests: 0, energy: 0, timber: 0, irrigations: 0, sown: 0, edits: 0 };
    return L;
  }

  const state = {
    initialized: false,
    worldSig: "",
    simTime: 0,
    lastTick: 0,
    plants: [],
    drawOrder: [],
    drawDirty: true,
    nextPlantId: 1,
    nextCloudId: 1,
    clouds: [],
    fx: [],
    fauna: [],
    structures: [],
    sun: { theta: 0, sdx: 0, intensity: 1, skyI: 0.35, dayPhase: 0.15, isDay: true, yearPhase: 0, season: "spring", autumn: 0 },
    wind: { prevailing: 0.45, gustiness: 0.5 },
    stats: {
      mutations: 0, crossovers: 0, hybrids: 0, germinations: 0, deaths: 0, edits: 0, harvests: 0, seedsReleased: 0,
      sporesReleased: 0, pollinations: 0, emigrants: 0, generationMax: 0, meanFitness: 0,
    },
    ledger: freshLedger(),
    seedVault: [],
    geneBank: [],
    worldCache: new Map(),
    lastEdits: [],
    bgEst: [72, 160, 148],
    world: null,
    eco: null,
    cosmic: null,
  };

  let occ, direct, skyV, lightG, glowF, windX, windY;
  let moist, gw, nut, surf, stab, rootMass, erosion, lee, leeTop, waterDist, tmpA;
  let buckets = [];

  function allocGrids() {
    const N = W * H;
    occ = new Float32Array(N);
    direct = new Float32Array(N);
    skyV = new Float32Array(N);
    lightG = new Float32Array(N);
    glowF = new Float32Array(N);
    windX = new Float32Array(N);
    windY = new Float32Array(N);
    moist = new Float32Array(W);
    gw = new Float32Array(W);
    nut = new Float32Array(W);
    surf = new Float32Array(W);
    stab = new Float32Array(W);
    rootMass = new Float32Array(W);
    erosion = new Float32Array(W);
    lee = new Float32Array(W);
    leeTop = new Float32Array(W);
    waterDist = new Float32Array(W);
    tmpA = new Float32Array(W);
    buckets = [];
    for (let c = 0; c < W; c++) buckets.push([]);
  }

  function setDims(w, h) {
    w = clamp(w | 0, 16, 1024);
    h = clamp(h | 0, 16, 1024);
    if (occ && w === W && h === H) return false;
    W = w;
    H = h;
    NW = W * SCALE;
    NH = H * SCALE;
    allocGrids();
    return true;
  }
  allocGrids();

  // Particle pool (SoA)
  const PK = { POLLEN: 1, SEED: 2, SPORE: 3, LITTER: 4, DROP: 5, SPARK: 6, SOIL: 7 };
  const P_X = new Float32Array(MAX_PARTICLES);
  const P_Y = new Float32Array(MAX_PARTICLES);
  const P_VX = new Float32Array(MAX_PARTICLES);
  const P_VY = new Float32Array(MAX_PARTICLES);
  const P_LIFE = new Float32Array(MAX_PARTICLES);
  const P_KIND = new Uint8Array(MAX_PARTICLES);
  const P_AUX = new Uint8Array(MAX_PARTICLES);
  const P_FORM = new Uint8Array(MAX_PARTICLES);
  const P_GLO = new Uint32Array(MAX_PARTICLES);
  const P_GHI = new Uint32Array(MAX_PARTICLES);
  const P_GEN = new Uint16Array(MAX_PARTICLES);
  const P_SRC = new Int32Array(MAX_PARTICLES);
  let pCount = 0;

  function spawnParticle(kind, x, y, vx, vy, life, g, form, aux, gen, src) {
    if (pCount >= MAX_PARTICLES) return -1;
    const i = pCount++;
    P_KIND[i] = kind;
    P_X[i] = x;
    P_Y[i] = y;
    P_VX[i] = vx;
    P_VY[i] = vy;
    P_LIFE[i] = life;
    P_GLO[i] = g ? g.lo : 0;
    P_GHI[i] = g ? g.hi : 0;
    P_FORM[i] = form || 0;
    P_AUX[i] = aux || 0;
    P_GEN[i] = gen || 0;
    P_SRC[i] = src || 0;
    return i;
  }

  function killParticle(i) {
    const j = --pCount;
    if (i === j) return;
    P_KIND[i] = P_KIND[j]; P_X[i] = P_X[j]; P_Y[i] = P_Y[j]; P_VX[i] = P_VX[j]; P_VY[i] = P_VY[j];
    P_LIFE[i] = P_LIFE[j]; P_GLO[i] = P_GLO[j]; P_GHI[i] = P_GHI[j]; P_FORM[i] = P_FORM[j];
    P_AUX[i] = P_AUX[j]; P_GEN[i] = P_GEN[j]; P_SRC[i] = P_SRC[j];
  }

  // ==========================================================================
  // 6. WORLD QUERIES
  // ==========================================================================
  function W_() {
    return state.world;
  }
  function layerOf() {
    const w = state.world;
    return w ? w.worldLayer | 0 : 0;
  }
  function seaOf() {
    const w = state.world;
    return w && w.seaLevel > 0 ? w.seaLevel : 0;
  }
  function isMagma() {
    const w = state.world;
    return !!(w && (w.currentBiome === "magma" || w.isMagmaBasin));
  }
  function groundElev(c) {
    const w = state.world;
    if (!w || !w.Blocks) return 0;
    c = c < 0 ? 0 : c >= W ? W - 1 : c | 0;
    return w.Blocks[c] | 0;
  }
  function ceilingRows(c) {
    const w = state.world;
    if (!w || layerOf() >= 0 || !w.Ceiling) return 0;
    c = c < 0 ? 0 : c >= W ? W - 1 : c | 0;
    return w.Ceiling[c] | 0;
  }
  function islandBase(c) {
    const w = state.world;
    if (!w || layerOf() <= 0 || !w.IslandBase) return 0;
    c = c < 0 ? 0 : c >= W ? W - 1 : c | 0;
    return w.IslandBase[c] | 0;
  }
  function isSubmerged(c) {
    const sea = seaOf();
    return sea > 0 && !isMagma() && groundElev(c) < sea;
  }
  function waterAtCell(c, e) {
    const sea = seaOf();
    return sea > 0 && !isMagma() && e < sea && e >= groundElev(c);
  }
  function airGap(c) {
    return H - groundElev(c) - ceilingRows(c);
  }
  function groundTopPx(c) {
    const h = groundElev(c);
    return h > 0 ? (H - h) * SCALE : NH + 999;
  }

  function habitatValidAt(c, habitat) {
    if (c < 0 || c >= W) return false;
    const h = groundElev(c);
    const L = layerOf();
    switch (habitat) {
      case "ground":
        if (h <= 0 || h >= H - 2 || isSubmerged(c)) return false;
        if (isMagma() && h < seaOf() + 2) return false;
        return L >= 0 || airGap(c) > 4;
      case "sea":
        return isSubmerged(c) && seaOf() - h >= 2;
      case "ceiling":
        return L < 0 && ceilingRows(c) > 0 && airGap(c) > 5;
      case "island":
        return L > 0 && h > 0 && islandBase(c) > 2;
      case "cloud":
        return true;
      default:
        return false;
    }
  }

  function worldSignature(w) {
    return `${w.worldX | 0},${w.worldLayer | 0},${w.currentBiome || "surface"}`;
  }

  // ==========================================================================
  // 7. DEVELOPMENTAL GRAMMAR: L-SYSTEM REWRITING + TURTLE RASTERIZER
  // ==========================================================================
  const PT = { BARK: 1, STEM: 2, LEAF: 3, PETAL: 4, PISTIL: 5, GLOW: 7, ROOT: 8, TUBER: 9, MOSS: 10, SPORO: 11 };
  const PRIO = new Uint8Array([0, 2, 2, 3, 5, 6, 0, 6, 1, 4, 3, 4]);

  const BLD = {
    xs: [], ys: [], ts: [], ss: [], fs: [], ph: [], map: new Map(), fruits: [], flowers: [], n: 0,
    sMin: -100, sMax: 0, rMin: 1, rMax: 40, xMax: 150,
    reset(b) {
      this.xs.length = 0; this.ys.length = 0; this.ts.length = 0; this.ss.length = 0; this.fs.length = 0; this.ph.length = 0;
      this.map.clear();
      this.fruits.length = 0;
      this.flowers.length = 0;
      this.n = 0;
      this.sMin = b.sMin; this.sMax = b.sMax; this.rMin = b.rMin; this.rMax = b.rMax; this.xMax = b.xMax || 150;
    },
    add(x, y, t, s, f, ph) {
      const xi = Math.round(x);
      const yi = Math.round(y);
      if (xi < -this.xMax || xi > this.xMax) return;
      if (t === PT.ROOT) {
        if (yi < this.rMin || yi > this.rMax) return;
      } else if (t === PT.TUBER) {
        if (yi < -2 || yi > this.rMax) return;
      } else if (t === PT.MOSS || t === PT.SPORO) {
        if (yi < -60 || yi > 30) return;
      } else if (yi < this.sMin || yi > this.sMax) return;
      const key = (xi + 1024) * 4096 + (yi + 2048);
      const old = this.map.get(key);
      if (old !== undefined) {
        if (PRIO[t] >= PRIO[this.ts[old]]) {
          this.ts[old] = t; this.ss[old] = s; this.fs[old] = f; this.ph[old] = ph & 255;
          if (t === PT.PISTIL) this.flowers.push(old);
        }
        return;
      }
      if (this.n >= MAX_PTS) return;
      this.map.set(key, this.n);
      this.xs.push(xi); this.ys.push(yi); this.ts.push(t); this.ss.push(s); this.fs.push(f); this.ph.push(ph & 255);
      if (t === PT.PISTIL) this.flowers.push(this.n);
      this.n++;
    },
  };

  function pickRule(rule, r) {
    if (typeof rule === "string") return rule;
    let total = 0;
    for (let i = 0; i < rule.length; i++) total += rule[i][0];
    let u = r() * total;
    for (let i = 0; i < rule.length; i++) {
      u -= rule[i][0];
      if (u <= 0) return rule[i][1];
    }
    return rule[rule.length - 1][1];
  }

  function rewrite(axiom, rules, iters, r, cap) {
    let s = axiom;
    for (let k = 0; k < iters; k++) {
      let out = "";
      for (let i = 0; i < s.length; i++) {
        const ch = s[i];
        const rule = rules[ch];
        out += rule ? pickRule(rule, r) : ch;
        if (out.length > cap) break;
      }
      s = out;
      if (s.length > cap) break;
    }
    return s;
  }

  function lightGradientAround(p) {
    const e = clamp(Math.round(groundElev(p.col) + 4), 0, H - 1);
    const l = direct[e * W + clamp(p.col - 4, 0, W - 1)];
    const rr = direct[e * W + clamp(p.col + 4, 0, W - 1)];
    return clamp(rr - l, -1, 1);
  }

  function paramsFor(p) {
    const G = p.G;
    const f = p.form;
    const st = p.stage;
    const info = FORM_INFO[f];
    const gs = (0.5 + 0.5 * Math.min(1, (st + 1) / (info.maxStage + 1))) * GROWTH_SCALE[f];
    const ang = (14 + G[2] * 44) * DEG;
    const ap = G[1];
    const P = {
      axiom: "A", rules: {}, iters: 1, len0: 3, lenRatio: 0.8, w0: 1, wRatio: 0.66, angle: ang,
      gnarl: 0.05 + G[5] * 0.35, tropTarget: Math.PI, tropK: 0, tropDepth: 0, horiz: false, photo: 0, lean: 0,
      woody: info.woody, terminal: "L", leafScale: 1, heading: 0, gscale: gs,
    };
    if (p.habitat === "ground") P.photo = lightGradientAround(p) * 0.03 * (1 - G[11]);
    switch (f) {
      case FORM.CANOPY:
        P.axiom = "F".repeat(2 + Math.round(ap * 2)) + "A";
        P.rules.A = [[1.0 - ap * 0.6, "F[+A][-A]L"], [0.25 + ap * 0.5, "FL[+A]F[-A]"], [0.2, "F[-A]~[+A]L"]];
        P.iters = Math.min(st, 2 + Math.round(G[3] * 3));
        P.len0 = (3.2 + ap * 2.2 + G[15] * 0.8) * gs;
        P.lenRatio = 0.79; P.w0 = 1.3 + G[15] * 2.4 + st * 0.3; P.wRatio = 0.64;
        P.tropK = G[4] * 0.012; P.tropDepth = 0.6; P.leafScale = 1.1;
        break;
      case FORM.WILLOW:
        P.axiom = "FF~F" + (ap > 0.5 ? "F" : "") + "A";
        P.rules.A = [[0.6, "F[+A][-A]P"], [0.4, "F[+A]P[-A]"]];
        P.iters = Math.min(st, 2 + Math.round(G[3] * 2));
        P.len0 = (3.4 + ap * 1.6) * gs; P.lenRatio = 0.82; P.w0 = 1.2 + G[15] * 2 + st * 0.3; P.wRatio = 0.66;
        P.angle = ang * 1.15; P.tropK = 0.03 + G[4] * 0.06; P.tropDepth = 0.8; P.terminal = "PL";
        break;
      case FORM.BONSAI:
        P.axiom = "F~F~A";
        P.rules.A = [[0.45, "F~[+A]~[-A]"], [0.3, "F~[-A]C"], [0.25, "~F[+A]C"]];
        P.iters = Math.min(st, 2 + Math.round(G[3] * 2));
        P.len0 = (2.4 + ap * 1.2) * gs; P.lenRatio = 0.84; P.w0 = 1.8 + G[15] * 2.2 + st * 0.35; P.wRatio = 0.7;
        P.gnarl = 0.2 + G[5] * 0.6; P.horiz = true; P.tropK = 0.02 + G[4] * 0.03;
        P.lean = state.wind.prevailing * 0.012 * (0.4 + G[5]); P.terminal = "C";
        break;
      case FORM.SHRUB: {
        const stems = 2 + Math.round(G[6] * 2);
        P.axiom = ["[-A]", "[+A]", "[A]", "[--A]", "[++A]"].slice(0, stems + 1).join("");
        P.rules.A = [[0.5, "F[+A]L[-A]"], [0.5, "FL[+A]A"]];
        P.iters = Math.min(st + 1, 2 + Math.round(G[3] * 2));
        P.len0 = (2.0 + ap) * gs; P.lenRatio = 0.86; P.w0 = 1 + G[15] * 0.9; P.wRatio = 0.8;
        P.angle = ang * 0.8; P.tropK = G[4] * 0.02; P.terminal = G[9] > 0.55 ? "LBR" : "LB"; P.leafScale = 0.8;
        break;
      }
      case FORM.WILDFLOWER:
        P.axiom = "S[+L]A";
        P.rules.A = G[3] > 0.6 ? [[0.55, "S[-L]SA"], [0.45, "S[+A][-A]"]] : "S[-L]S[+L]A";
        P.iters = Math.min(st + 1, 2 + Math.round(G[3] * 2));
        P.len0 = (1.6 + ap * 1.4) * gs; P.lenRatio = 0.94; P.angle = ang * 0.45;
        P.tropTarget = 0; P.tropK = 0.02; P.terminal = "B"; P.leafScale = 0.45;
        break;
      case FORM.ORCHARD:
        P.axiom = "FF" + (ap > 0.5 ? "F" : "") + "A";
        P.rules.A = [[0.6, "F[+A][-A]L"], [0.4, "F[+A]L[-A]"]];
        P.iters = Math.min(st, 2 + Math.round(G[3] * 2));
        P.len0 = (2.8 + ap * 1.2) * gs; P.lenRatio = 0.78; P.w0 = 1.2 + G[15] * 2 + st * 0.25; P.wRatio = 0.66;
        P.angle = Math.min(1.1, ang * 1.2); P.tropK = 0.006 + G[4] * 0.02; P.terminal = "LBR";
        break;
      case FORM.ROOTVEG: {
        const n = 2 + Math.min(4, st + Math.round(G[6] * 2));
        const fan = ["[SL]", "[+SL]", "[-SL]", "[++SL]", "[--SL]", "[+S+L]"];
        let axm = "T";
        for (let k = 0; k < n; k++) axm += fan[k];
        if (p.bolted) axm += "SSSB";
        P.axiom = axm; P.iters = 0; P.len0 = (1.4 + G[6] * 1.2) * gs; P.lenRatio = 1; P.angle = 0.42;
        P.tropTarget = 0; P.tropK = 0.01; P.leafScale = 0.55;
        break;
      }
      case FORM.VINE:
        P.heading = Math.PI; P.axiom = "A";
        P.rules.A = [[0.72, "F~[+L]F~[-L]A"], [0.28, "F~[+A]L[-L]A"]];
        P.iters = Math.min(st + 1, 3 + Math.round(G[3] * 3));
        P.len0 = (2.0 + G[4] * 1.6) * gs; P.lenRatio = 0.97; P.angle = ang * 0.7;
        P.gnarl = 0.2 + G[5] * 0.4; P.tropK = 0.04;
        P.terminal = "L" + (G[14] > 0.35 ? "O" : "") + (G[9] > 0.4 ? "R" : ""); P.leafScale = 0.55;
        break;
      case FORM.CLOUDKELP:
        P.heading = Math.PI; P.axiom = "[+A][A][-A]";
        P.rules.A = [[0.8, "F~[+L]F~O[-L]A"], [0.2, "F~[+A][-A]"]];
        P.iters = Math.min(st + 1, 2 + Math.round(G[3] * 3));
        P.len0 = (2.2 + G[4] * 1.4) * gs; P.lenRatio = 0.95; P.angle = ang * 0.55;
        P.gnarl = 0.25 + G[5] * 0.3; P.tropK = 0.03; P.terminal = "LO"; P.leafScale = 0.6;
        break;
      case FORM.SEAFLORA:
        P.axiom = G[3] > 0.5 ? "[-A][+A]A" : "A";
        P.rules.A = [[0.7, "F~[+L]F~[-O]A"], [0.3, "F~[+A]O"]];
        P.iters = Math.min(st + 1, 3 + Math.round(G[1] * 3));
        P.len0 = (2.4 + G[1] * 1.2) * gs; P.lenRatio = 0.96; P.angle = ang * 0.6;
        P.gnarl = 0.3 + G[5] * 0.3; P.tropTarget = 0; P.tropK = 0.03; P.terminal = "O"; P.leafScale = 0.6;
        break;
      default:
        break;
    }
    return P;
  }

  // ---- turtle primitives ----
  function leafCluster(x, y, dist, P, r, p) {
    const G = p.G;
    const n = Math.round((2 + G[6] * 6) * P.leafScale * (0.6 + 0.4 * P.gscale));
    const spread = (1 + G[6] * 2.2) * P.leafScale;
    const shape = G[7];
    for (let k = 0; k < n; k++) {
      const ang = r() * TAU;
      const rad = Math.sqrt(r()) * spread;
      const lx = x + Math.cos(ang) * rad * 1.25;
      const ly = y + Math.sin(ang) * rad * 0.85 - spread * 0.25;
      const ph = (r() * 255) | 0;
      const s = ly < y ? 3 + ((r() * 2) | 0) : 1 + ((r() * 2) | 0);
      const f = dist + rad;
      BLD.add(lx, ly, PT.LEAF, s, f, ph);
      if (shape > 0.66) {
        BLD.add(lx + 1, ly, PT.LEAF, s, f, ph);
        BLD.add(lx, ly + 1, PT.LEAF, Math.max(0, s - 1), f, ph);
        if (r() < 0.5) BLD.add(lx + 1, ly + 1, PT.LEAF, Math.max(0, s - 2), f, ph);
      } else if (shape > 0.33) {
        BLD.add(lx + Math.cos(ang), ly + Math.sin(ang), PT.LEAF, s, f, ph);
      } else {
        BLD.add(lx + (r() < 0.5 ? 1 : -1), ly - 1, PT.LEAF, s, f, ph);
      }
    }
  }

  function blossom(x, y, a, dist, r, p) {
    const G = p.G;
    const np = 4 + Math.round(G[7] * 4);
    const rad = 1.2 + G[9] * 0.6 + (p.form === FORM.WILDFLOWER ? 0.6 : 0);
    const cx = x + Math.sin(a);
    const cy = y - Math.cos(a);
    const ph = (r() * 255) | 0;
    const rot = r() * TAU;
    BLD.add(cx, cy, PT.PISTIL, 0, dist + 1, ph);
    for (let k = 0; k < np; k++) {
      const t = rot + (k / np) * TAU;
      const order = Math.floor((k * 8) / np);
      BLD.add(cx + Math.cos(t) * rad, cy + Math.sin(t) * rad * 0.8, PT.PETAL, order, dist + 1.5, ph);
      if (rad > 1.7) BLD.add(cx + Math.cos(t) * (rad - 0.9), cy + Math.sin(t) * (rad - 0.9) * 0.8, PT.PETAL, order, dist + 1.5, ph);
    }
  }

  function strand(x, y, dist, P, r, p) {
    const len = (5 + p.G[4] * 15) * (0.45 + 0.55 * P.gscale) * (0.8 + r() * 0.4);
    const ph0 = (r() * 255) | 0;
    let sx = x;
    let sy = y;
    for (let j = 0; j < len; j++) {
      sx += Math.sin(j * 0.4 + ph0) * 0.15;
      sy += 1;
      const ph = (ph0 + j * 5) & 255;
      BLD.add(sx, sy, PT.LEAF, 1, dist + j * 1.8, ph);
      if (j % 2 === 1) BLD.add(sx + ((j >> 1) & 1 ? 1 : -1), sy, PT.LEAF, j % 3 === 0 ? 4 : 3, dist + j * 1.8, ph);
    }
  }

  function pad(x, y, dist, P, r, p) {
    const G = p.G;
    const rx = 2.4 + G[6] * 3 * (0.6 + 0.4 * P.gscale);
    const ry = 1.2 + G[6] * 1.1;
    const cy = y - ry * 0.4;
    const ph = (r() * 255) | 0;
    const ix0 = Math.ceil(rx);
    const iy0 = Math.ceil(ry);
    for (let iy = -iy0; iy <= iy0; iy++) {
      for (let ix = -ix0; ix <= ix0; ix++) {
        const d = (ix * ix) / (rx * rx) + (iy * iy) / (ry * ry);
        if (d > 1 || r() < 0.18 + d * 0.25) continue;
        const s = iy < -ry * 0.3 ? 4 : iy < ry * 0.3 ? 3 : 1;
        BLD.add(x + ix, cy + iy, PT.LEAF, Math.max(0, s - (r() < 0.3 ? 1 : 0)), dist + Math.abs(ix) * 0.5, (ph + ix * 9) & 255);
      }
    }
  }

  function tuber(P, p) {
    const G = p.G;
    const gs = P.gscale;
    const th = (2 + G[9] * 6) * gs + 1;
    const tw = (1 + G[9] * 2.2) * gs + 0.5;
    const roundish = G[7] > 0.5;
    for (let iy = -1; iy <= th; iy++) {
      const u = (iy + 1) / (th + 1);
      const prof = roundish ? Math.sin(Math.PI * Math.min(1, u * 0.95 + 0.06)) : Math.max(0.15, 1 - u * 0.9);
      const hw = tw * prof;
      const lim = Math.ceil(hw);
      for (let ix = -lim; ix <= lim; ix++) {
        if (Math.abs(ix) > hw + 0.3) continue;
        const edge = Math.abs(ix) > hw - 0.8;
        const s = iy < 0 ? 5 : edge ? 1 : hash2(ix + (p.seed & 255), iy) < 0.12 ? 0 : 3;
        BLD.add(ix, iy, PT.TUBER, s, 0, (u * 255) | 0);
      }
    }
    const tail = 4 + G[10] * 6;
    for (let k = 0; k < tail; k++) {
      BLD.add(Math.sin(k * 0.7) * 0.4, th + 1 + k, PT.ROOT, 3, 0, k * 6);
      if (k % 3 === 0) BLD.add((k & 1 ? 1 : -1) * 1.4, th + 1 + k, PT.ROOT, 3, 0, k * 6);
    }
  }

  function interpret(str, P, r, p) {
    let x = 0, y = 0, a = P.heading, depth = 0, dist = 0;
    const stack = [];
    const seedMix = p.seed & 1023;
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      switch (ch) {
        case "F":
        case "S": {
          const len = P.len0 * Math.pow(P.lenRatio, depth) * (0.85 + r() * 0.3);
          const herb = ch === "S" || !P.woody;
          const width = herb ? 1 : Math.max(1, P.w0 * Math.pow(P.wRatio, depth) * (dist < 2 ? 1.35 : 1));
          const type = herb ? PT.STEM : PT.BARK;
          const steps = Math.max(1, Math.ceil(len / 0.75));
          const sl = len / steps;
          const hw = (width - 1) / 2;
          for (let k = 0; k < steps; k++) {
            let tgt = depth === 0 ? P.heading : P.tropTarget;
            if (P.horiz && depth > 0) tgt = a >= 0 ? Math.PI / 2 : -Math.PI / 2;
            const tk = depth === 0 ? 0.04 : P.tropK * (1 + depth * P.tropDepth);
            a += (r() - 0.5) * P.gnarl * 0.5 - tk * Math.sin(a - tgt) * sl + (P.photo + P.lean) * sl;
            const dx = Math.sin(a);
            const dy = -Math.cos(a);
            x += dx * sl;
            y += dy * sl;
            dist += sl;
            if (hw <= 0.01) {
              BLD.add(x, y, type, 3, dist, (hash2(seedMix, (dist * 0.5) | 0) * 255) | 0);
            } else {
              const nx = Math.cos(a);
              const ny = Math.sin(a);
              for (let o = -hw; o <= hw + 0.001; o += 0.5) {
                const lateral = (nx * o) / hw;
                const s = clamp(Math.round(lateral * 3) + 3, 0, 6);
                const ph = (hash2(Math.round(o * 1.5) + seedMix, (dist * 0.5) | 0) * 255) | 0;
                BLD.add(x + nx * o, y + ny * o, type, s, dist, ph);
              }
            }
          }
          break;
        }
        case "+": a += P.angle * (0.75 + r() * 0.5); break;
        case "-": a -= P.angle * (0.75 + r() * 0.5); break;
        case "~": a += (r() - 0.5) * P.gnarl * 2.2; break;
        case "[": stack.push(x, y, a, depth, dist); depth++; break;
        case "]":
          if (stack.length >= 5) {
            dist = stack.pop(); depth = stack.pop(); a = stack.pop(); y = stack.pop(); x = stack.pop();
          }
          break;
        case "L": leafCluster(x, y, dist, P, r, p); break;
        case "B": blossom(x, y, a, dist, r, p); break;
        case "R":
          BLD.add(x, y + 0.5, PT.STEM, 3, dist + 1, 0);
          BLD.fruits.push({ x: x + (r() - 0.5) * 1.5, y: y + 1.6, f: dist + 2, size: 1 + p.G[9] * 1.6 + (p.form === FORM.ORCHARD ? 0.4 : 0), ph: (r() * 255) | 0 });
          break;
        case "P": strand(x, y, dist, P, r, p); break;
        case "C": pad(x, y, dist, P, r, p); break;
        case "O":
          BLD.add(x, y, PT.GLOW, (r() * 7) | 0, dist, (r() * 255) | 0);
          if (p.G[14] > 0.6) BLD.add(x + 1, y, PT.GLOW, (r() * 7) | 0, dist, (r() * 255) | 0);
          break;
        case "T": tuber(P, p); break;
        default: break;
      }
    }
  }

  // Root capillary grammar (separate turtle; grows away from the anchor into soil or rock)
  function growRoots(p, r) {
    const G = p.G;
    const f = p.form;
    const up = p.habitat === "ceiling" || p.habitat === "island";
    const heading = up ? 0 : Math.PI;
    const its = 1 + Math.round(G[10] * 2.5 * Math.min(1, (p.stage + 1) / (p.maxStage * 0.6 + 1)));
    const sizeK = FORM_INFO[f].tree ? 1.4 : f === FORM.BONSAI ? 1.2 : f === FORM.SEAFLORA ? 0.5 : f === FORM.MOSS ? 0.4 : 0.75;
    const len0 = (1.6 + G[10] * 3.2) * sizeK;
    const str = rewrite("r", { r: [[0.55, "f[+r][-r]"], [0.3, "f[-r]fr"], [0.15, "f~[+r]r"]] }, its, r, 900);
    const ang = 0.45 + G[5] * 0.3;
    let x = 0, y = up ? -1 : 1, a = heading, depth = 0, dist = 0;
    const stack = [];
    const thick = FORM_INFO[f].woody && G[15] > 0.5;
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (ch === "f") {
        const len = len0 * Math.pow(0.8, depth) * (0.8 + r() * 0.4);
        const steps = Math.max(1, Math.ceil(len / 0.8));
        const sl = len / steps;
        for (let k = 0; k < steps; k++) {
          a += (r() - 0.5) * (0.3 + G[5] * 0.4) - 0.05 * Math.sin(a - heading) * sl;
          x += Math.sin(a) * sl;
          y += -Math.cos(a) * sl;
          dist += sl;
          const s = Math.min(3, depth);
          const ph = Math.min(255, (dist * 5) | 0);
          BLD.add(x, y, PT.ROOT, s, 0, ph);
          if (thick && depth === 0) BLD.add(x + 1, y, PT.ROOT, 0, 0, ph);
        }
      } else if (ch === "+") a += ang * (0.7 + r() * 0.6);
      else if (ch === "-") a -= ang * (0.7 + r() * 0.6);
      else if (ch === "~") a += (r() - 0.5) * 0.6;
      else if (ch === "[") { stack.push(x, y, a, depth, dist); depth++; }
      else if (ch === "]" && stack.length >= 5) {
        // root hairs at each tip before returning
        const hairPh = Math.min(255, (dist * 5) | 0);
        BLD.add(x + (r() < 0.5 ? 1 : -1), y + (up ? -1 : 1) * (r() < 0.5 ? 1 : 0), PT.ROOT, 3, 0, hairPh);
        dist = stack.pop(); depth = stack.pop(); a = stack.pop(); y = stack.pop(); x = stack.pop();
      }
    }
  }

  function buildMoss(p) {
    const G = p.G;
    const w = state.world;
    const span = Math.round((1 + G[6] * 2.5) * (0.4 + (0.6 * (p.stage + 1)) / (p.maxStage + 1)) * SCALE);
    let sig = 0;
    for (let sx = -span; sx <= span; sx++) {
      const ax = p.ax + sx;
      const c = Math.floor(ax / SCALE);
      if (c < 0 || c >= W) continue;
      if (!habitatValidAt(c, "ground")) continue;
      const gy = (H - w.Blocks[c]) * SCALE - p.ay;
      if (Math.abs(gy) > 3 * SCALE) continue;
      const edgeFade = 1 - Math.abs(sx) / (span + 1);
      const hseed = p.seed & 4095;
      if (hash2(sx + hseed, 7) > 0.35 + edgeFade * 0.65) continue;
      const hgt = 1 + (hash2(sx, hseed) < 0.45 * G[6] + 0.2 ? 1 : 0) + (hash2(sx * 3, hseed) < 0.15 * edgeFade ? 1 : 0);
      const ph = (hash2(sx, hseed + 5) * 255) | 0;
      for (let k = 0; k < hgt; k++) BLD.add(sx, gy - 1 - k, PT.MOSS, Math.min(4, k + (hash2(sx, k + 31) < 0.3 ? 1 : 0)), k + 1, ph);
      if (hash2(sx, hseed + 1) < 0.5) BLD.add(sx, gy, PT.MOSS, 0, 0, ph);
      if (p.stage >= 2 && hash2(sx, hseed + 11) < 0.05 + 0.04 * G[9]) {
        const sh = 2 + ((hash2(sx, hseed + 13) * 3) | 0);
        for (let k = 0; k < sh; k++) BLD.add(sx, gy - 1 - hgt - k, PT.SPORO, 0, hgt + k + 1, ph);
        BLD.add(sx, gy - 1 - hgt - sh, PT.SPORO, 1, hgt + sh + 1, ph);
      }
      if (hash2(sx, hseed + 17) < 0.3) BLD.add(sx, gy + 1, PT.MOSS, 0, 0, ph);
    }
    for (let c = Math.max(0, p.col - 4); c <= Math.min(W - 1, p.col + 4); c++) sig = (sig * 31 + w.Blocks[c]) | 0;
    p.groundSig = sig;
  }

  function growthBounds(p) {
    const c = p.col;
    const h = groundElev(c);
    const L = layerOf();
    const b = { sMin: -100, sMax: 1, rMin: 1, rMax: 40, xMax: 150 };
    switch (p.habitat) {
      case "ground": {
        const soil = (L > 0 ? h - islandBase(c) : h) * SCALE;
        b.sMin = -Math.max(6, (L < 0 ? airGap(c) : H - h) * SCALE - 4);
        b.rMax = clamp(soil - 2, 2, 64);
        break;
      }
      case "sea":
        b.sMin = -Math.max(6, (seaOf() - h) * SCALE + 5);
        b.rMax = 14;
        break;
      case "ceiling": {
        let gap = airGap(c);
        const sea = seaOf();
        if (sea > 0 && h < sea) gap = H - ceilingRows(c) - sea;
        b.sMin = -1;
        b.sMax = Math.max(6, gap * SCALE - 4);
        b.rMin = -Math.min(ceilingRows(c) * SCALE, 30);
        b.rMax = -1;
        break;
      }
      case "island":
        b.sMin = -1;
        b.sMax = Math.min(80, islandBase(c) * SCALE - 2);
        b.rMin = -Math.max(2, (h - islandBase(c)) * SCALE - 1);
        b.rMax = -1;
        break;
      case "cloud": {
        const cl = cloudById(p.cloudId);
        b.sMin = -10;
        b.sMax = cl ? clamp((cl.y - groundElev(c)) * SCALE - 6, 8, 84) : 40;
        b.rMin = 999;
        b.rMax = -999;
        break;
      }
      default:
        break;
    }
    return b;
  }

  function choosePalette(p) {
    const f = p.form;
    const hue = getGene(p.genome, GENE.HUE);
    const G = p.G;
    let leaf;
    switch (f) {
      case FORM.CANOPY: leaf = [RAMP.sage, RAMP.olive, RAMP.pine][hue % 3]; break;
      case FORM.WILLOW: leaf = hue & 1 ? RAMP.olive : RAMP.sage; break;
      case FORM.BONSAI: leaf = RAMP.pine; break;
      case FORM.SHRUB: leaf = hue > 11 ? RAMP.plum : hue & 1 ? RAMP.sage : RAMP.olive; break;
      case FORM.WILDFLOWER: leaf = RAMP.lichen; break;
      case FORM.MOSS: leaf = G[14] > 0.6 ? RAMP.teal : RAMP.lichen; break;
      case FORM.VINE: leaf = G[14] > 0.5 ? RAMP.teal : RAMP.pine; break;
      case FORM.ORCHARD: leaf = hue & 1 ? RAMP.sage : RAMP.olive; break;
      case FORM.ROOTVEG: leaf = RAMP.sage; break;
      case FORM.CLOUDKELP: leaf = RAMP.cloud; break;
      case FORM.SEAFLORA: leaf = hue & 1 ? RAMP.teal : RAMP.plum; break;
      default: leaf = RAMP.sage;
    }
    const lineage = hash2(p.genome.lo, p.genome.hi);
    p.pal = {
      leaf,
      bark: f === FORM.BONSAI ? RAMP.barkPine : f === FORM.WILLOW ? RAMP.barkWillow : RAMP.bark,
      petal: PETALS[hue],
      fruit: FRUITS[(hue + getGene(p.genome, GENE.YIELD)) & 7],
      glow: GLOWS[hue & 3],
      tuber: TUBERS[hue & 3],
      tint: [(lineage - 0.5) * 14, (hash2(p.genome.hi, 3) - 0.5) * 10, (hash2(p.genome.lo, 9) - 0.5) * 14],
    };
  }

  function develop(p) {
    if (!state.world) return;
    const r = mulberry32((p.seed ^ Math.imul(p.stage + 1, 0x9e3779b1) ^ (p.bolted ? 0x51 : 0)) >>> 0);
    BLD.reset(growthBounds(p));
    if (p.form === FORM.MOSS) {
      buildMoss(p);
    } else {
      const P = paramsFor(p);
      let str = rewrite(P.axiom, P.rules, P.iters, r, 2400);
      str = str.replace(/A/g, P.terminal);
      interpret(str, P, r, p);
    }
    if (p.habitat !== "cloud" && p.form !== FORM.MOSS) growRoots(p, r);
    p.morph = finishMorph(p);
    choosePalette(p);
    state.drawDirty = true;
  }

  function finishMorph(p) {
    const n = BLD.n;
    let maxF = 1;
    let minX = 0, maxX = 0, minY = 0, maxY = 0;
    let leafN = 0;
    for (let i = 0; i < n; i++) {
      const t = BLD.ts[i];
      if (t === PT.ROOT || t === PT.TUBER) continue;
      if (t !== PT.MOSS && t !== PT.SPORO && BLD.fs[i] > maxF) maxF = BLD.fs[i];
      const x = BLD.xs[i], y = BLD.ys[i];
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      if (t === PT.LEAF || t === PT.MOSS) leafN++;
    }
    const m = {
      n,
      xs: Int16Array.from(BLD.xs),
      ys: Int16Array.from(BLD.ys),
      ts: Uint8Array.from(BLD.ts),
      ss: Uint8Array.from(BLD.ss),
      ph: Uint8Array.from(BLD.ph),
      fs: new Uint8Array(n),
      fruits: BLD.fruits.map((fr) => ({ x: Math.round(fr.x), y: Math.round(fr.y), flex: Math.min(1, fr.f / maxF), size: fr.size, ph: fr.ph })),
      flowers: BLD.flowers.slice(),
      minX, maxX, minY, maxY, leafN,
      heightPx: Math.max(-minY, maxY),
      occDc: null, occDr: null, occW: null, occN: 0,
    };
    const inv = 255 / maxF;
    for (let i = 0; i < n; i++) {
      const t = BLD.ts[i];
      if (t === PT.ROOT || t === PT.TUBER) m.fs[i] = 0;
      else if (t === PT.MOSS || t === PT.SPORO) m.fs[i] = Math.min(255, BLD.fs[i] * 18);
      else m.fs[i] = Math.min(255, Math.round(BLD.fs[i] * inv));
    }
    // light-occupancy per coarse cell, relative to the anchor cell
    const ox = ((p.ax % SCALE) + SCALE) % SCALE;
    const oy = ((p.ay % SCALE) + SCALE) % SCALE;
    const cells = new Map();
    for (let i = 0; i < n; i++) {
      const t = BLD.ts[i];
      const wgt = t === PT.LEAF ? 1 : t === PT.BARK ? 1.4 : t === PT.PETAL || t === PT.STEM ? 0.6 : t === PT.GLOW ? 0.2 : 0;
      if (!wgt) continue;
      const dc = Math.floor((ox + BLD.xs[i]) / SCALE);
      const dr = Math.floor((oy + BLD.ys[i]) / SCALE);
      const key = (dc + 512) * 1024 + (dr + 512);
      cells.set(key, (cells.get(key) || 0) + wgt);
    }
    m.occN = cells.size;
    m.occDc = new Int16Array(m.occN);
    m.occDr = new Int16Array(m.occN);
    m.occW = new Float32Array(m.occN);
    let k = 0;
    cells.forEach((v, key) => {
      m.occDc[k] = Math.floor(key / 1024) - 512;
      m.occDr[k] = (key % 1024) - 512;
      m.occW[k] = Math.min(0.85, (v / 49) * 1.4);
      k++;
    });
    return m;
  }

  // ==========================================================================
  // 8. PLANT LIFECYCLE
  // ==========================================================================
  function expressGenes(p) {
    if (!p.G) p.G = new Float32Array(16);
    for (let i = 0; i < 16; i++) p.G[i] = getGene(p.genome, i) / 15;
    p.form = expressedForm(p.genome, p.habitat);
    p.maxStage = FORM_INFO[p.form].maxStage;
    p.stage = Math.min(p.stage, p.maxStage);
  }

  function cloudById(id) {
    for (let i = 0; i < state.clouds.length; i++) if (state.clouds[i].id === id) return state.clouds[i];
    return null;
  }

  function reanchor(p) {
    const c = p.col;
    switch (p.habitat) {
      case "ground":
      case "sea":
        if (!habitatValidAt(c, p.habitat)) return false;
        p.ax = c * SCALE + p.sub;
        p.ay = (H - groundElev(c)) * SCALE;
        return true;
      case "ceiling":
        if (!habitatValidAt(c, "ceiling")) return false;
        p.ax = c * SCALE + p.sub;
        p.ay = ceilingRows(c) * SCALE;
        return true;
      case "island":
        if (!habitatValidAt(c, "island")) return false;
        p.ax = c * SCALE + p.sub;
        p.ay = (H - islandBase(c)) * SCALE;
        return true;
      case "cloud": {
        const cl = cloudById(p.cloudId);
        if (!cl) return false;
        p.ax = Math.round(cl.x * SCALE + p.cloudOff);
        p.ay = Math.round((H - cl.y) * SCALE + cl.h * SCALE * 0.3);
        p.col = clamp(Math.floor(p.ax / SCALE), 0, W - 1);
        return true;
      }
      default:
        return false;
    }
  }

  function createPlant(genome, col, habitat, opts) {
    opts = opts || {};
    const r = rng;
    const p = {
      id: state.nextPlantId++,
      genome: cloneGenome(genome),
      G: null,
      form: 0,
      habitat,
      col: clamp(col | 0, 0, W - 1),
      sub: 1 + ((r() * 5) | 0),
      cloudId: opts.cloud ? opts.cloud.id : 0,
      cloudOff: opts.cloud ? (r() - 0.5) * opts.cloud.w * SCALE * 0.6 : 0,
      ax: 0, ay: 0,
      age: 0,
      stage: opts.stage || 0,
      maxStage: 1,
      energy: opts.energy !== undefined ? opts.energy : 0.3,
      health: 1,
      fitness: 0.5,
      lightMem: 0.6,
      bloom: 0,
      pollen: null,
      fruitSet: false,
      ripeness: 0,
      ripeHold: 0,
      bolted: false,
      lifespan: 0,
      gen: opts.gen || 0,
      cultivated: !!opts.cultivated,
      faction: opts.faction || null,
      edited: null,
      editFx: 0,
      dying: 0,
      dead: false,
      sway: 0,
      swayV: 0,
      seed: (r() * 4294967296) >>> 0,
      huePhase: (r() * 255) | 0,
      sporeTimer: 200 + r() * 800,
      pruneCooldown: 0,
      groundSig: 0,
      env: null,
      morph: null,
      pal: null,
    };
    expressGenes(p);
    p.lifespan = FORM_INFO[p.form].life * (0.7 + r() * 0.6) * (0.6 + p.G[GENE.TIMBER] * 0.6);
    if (!reanchor(p)) return null;
    develop(p);
    state.plants.push(p);
    state.drawDirty = true;
    if (p.gen > state.stats.generationMax) state.stats.generationMax = p.gen;
    return p;
  }

  function startDying(p, cause) {
    if (p.dying > 0) return;
    p.dying = 0.01;
    p.deathCause = cause || "senescence";
  }

  function removePlantAt(i) {
    const p = state.plants[i];
    if (p && p.morph) nut[p.col] = Math.min(1, nut[p.col] + p.morph.n * 0.00025);
    state.plants.splice(i, 1);
    state.stats.deaths++;
    state.drawDirty = true;
  }

  function crowdingOK(col, habitat, form) {
    const info = FORM_INFO[form];
    let crowd = 0;
    const R = info.tree ? 3 : 1;
    for (let c = Math.max(0, col - R); c <= Math.min(W - 1, col + R); c++) {
      const b = buckets[c];
      for (let k = 0; k < b.length; k++) {
        const q = b[k];
        if (q.habitat !== habitat || q.dead) continue;
        if (form === FORM.MOSS) { if (q.form === FORM.MOSS && Math.abs(c - col) <= 1) crowd += 1; continue; }
        if (q.form === FORM.MOSS) continue;
        if (info.tree && FORM_INFO[q.form].tree) return false;
        if (Math.abs(c - col) <= 1) crowd += FORM_INFO[q.form].tree ? 0.5 : 1;
      }
    }
    return crowd < (form === FORM.MOSS ? 2 : 2.5);
  }

  function sampleEnvAt(col, habitat, heightPx) {
    const c = clamp(col | 0, 0, W - 1);
    const L = layerOf();
    const h = groundElev(c);
    let e;
    if (habitat === "ceiling") e = H - ceilingRows(c) - 2;
    else if (habitat === "island") e = islandBase(c) - 2;
    else if (habitat === "cloud") e = H - 8;
    else e = h + Math.max(0, Math.round(heightPx / SCALE * 0.6));
    e = clamp(e, 0, H - 1);
    const idx = e * W + c;
    const sea = seaOf();
    let alt;
    if (habitat === "cloud") alt = 1;
    else if (habitat === "sea") alt = 0;
    else if (L < 0) alt = 0.15;
    else if (L > 0) alt = clamp(0.75 + h / (H * 2), 0, 1);
    else alt = clamp((h - sea) / (H * 0.5), 0, 1);
    return {
      light: Math.min(1, 0.8 * direct[idx] + 0.2 * skyV[idx] + glowF[idx] + (L < 0 ? 0.03 : 0)),
      moist: moist[c],
      gw: gw[c],
      nut: nut[c],
      alt,
      wind: Math.abs(windX[idx]),
      heightF: clamp(heightPx / (H * SCALE * 0.2), 0, 1.5),
      dark: L < 0 || habitat === "sea" || habitat === "ceiling" || habitat === "island",
    };
  }

  function computeFitness(G, form, habitat, env) {
    const L = env.light;
    const tol = G[11];
    const k = 0.06 + (1 - tol) * 0.5;
    const Lmax = 1 - 0.32 * tol;
    let fL = Lmax * (1 - Math.exp(-L / k));
    if (env.dark) fL += G[14] * 0.5 * (1 - L); // symbiotic bioluminescent chemosynthesis
    else fL -= G[14] * 0.06; // glowing in daylight wastes sugar
    let fW;
    if (habitat === "sea") fW = 1 - G[12] * 0.3;
    else if (habitat === "cloud") fW = clamp(0.45 + env.moist * 0.4 + G[12] * 0.3, 0, 1);
    else {
      const need = 0.55 - 0.45 * G[12];
      const avail = env.moist + G[10] * env.gw * 0.6;
      fW = clamp(1 - Math.max(0, need - avail) * 2.4, 0, 1);
      if (avail > 0.85 && G[12] > 0.55) fW -= (avail - 0.85) * 2.2 * (G[12] - 0.55);
    }
    if (form === FORM.MOSS) fW *= 1 - Math.max(0, L - 0.55) * (1 - G[12]) * 1.3;
    const fA = 1 - Math.abs(env.alt - G[13]) * 0.75;
    const resist = 0.25 + G[15] * 0.45 + G[5] * 0.3;
    const fWd = 1 - clamp(env.wind * env.heightF * 1.2 - resist, 0, 0.7);
    const fN = 0.7 + 0.3 * env.nut;
    return clamp(clamp(fL, 0, 1.2) * (0.35 + 0.65 * clamp(fW, 0, 1)) * (0.5 + 0.5 * clamp(fA, 0, 1)) * fWd * fN, 0, 1.2);
  }

  function predictFitness(genome, col, habitat) {
    const G = new Float32Array(16);
    for (let i = 0; i < 16; i++) G[i] = getGene(genome, i) / 15;
    const form = expressedForm(genome, habitat);
    const env = sampleEnvAt(col, habitat, FORM_INFO[form].tree ? 30 : 8);
    return computeFitness(G, form, habitat, env);
  }

  function trySow(genome, col, habitat, opts) {
    opts = opts || {};
    if (state.plants.length >= MAX_PLANTS) return null;
    col = clamp(col | 0, 0, W - 1);
    if (!habitatValidAt(col, habitat)) return null;
    const form = expressedForm(genome, habitat);
    if (!opts.force && habitat !== "cloud" && !crowdingOK(col, habitat, form)) return null;
    if (!opts.force && rng() > predictFitness(genome, col, habitat) * 1.25) return null;
    const p = createPlant(genome, col, habitat, opts);
    if (p) {
      buckets[p.col].push(p);
      state.stats.germinations++;
    }
    return p;
  }

  function sampleEnv(p) {
    const m = p.morph;
    const L = layerOf();
    const acol = Math.floor(p.ax / SCALE);
    const arow = Math.floor(p.ay / SCALE);
    let ls = 0, lw = 0, ws = 0, lmax = 0;
    for (let i = 0; i < m.occN; i++) {
      const c = acol + m.occDc[i];
      const e = H - 1 - (arow + m.occDr[i]);
      if (c < 0 || c >= W || e < 0 || e >= H) continue;
      const idx = e * W + c;
      const wgt = m.occW[i];
      const li = 0.8 * direct[idx] + 0.2 * skyV[idx] + glowF[idx];
      if (li > lmax) lmax = li;
      ls += li * wgt;
      ws += Math.abs(windX[idx]) * wgt;
      lw += wgt;
    }
    const env = sampleEnvAt(p.col, p.habitat, m.heightPx);
    if (lw > 0) {
      // sunlit outer crown carries most of the photosynthesis; inner leaves add the rest
      env.light = Math.min(1, 0.5 * (ls / lw) + 0.5 * lmax + (L < 0 ? 0.03 : 0));
      env.wind = ws / lw;
    }
    // Daily integration: photosynthesis uses remembered daytime light through the night
    if (L >= 0 && state.sun.isDay) p.lightMem += (env.light - p.lightMem) * 0.3 * state.sun.intensity;
    else if (L < 0) p.lightMem = env.light;
    env.light = p.lightMem;
    if (p.habitat === "cloud") {
      const cl = cloudById(p.cloudId);
      env.moist = cl ? cl.water : 0.3;
    } else {
      // root span moisture
      const span = 1 + Math.round(p.G[10] * 2);
      let s = 0, n = 0;
      for (let c = Math.max(0, p.col - span); c <= Math.min(W - 1, p.col + span); c++) { s += moist[c]; n++; }
      env.moist = n ? s / n : env.moist;
    }
    return env;
  }

  function physiology(p, dt, t) {
    if (!reanchor(p)) {
      startDying(p, "uprooted");
      p.dying = Math.max(p.dying, 0.5);
    }
    if (p.form === FORM.MOSS && p.dying === 0) {
      let sig = 0;
      for (let c = Math.max(0, p.col - 4); c <= Math.min(W - 1, p.col + 4); c++) sig = (sig * 31 + state.world.Blocks[c]) | 0;
      if (sig !== p.groundSig) develop(p);
    }
    if (p.dying > 0) {
      p.dying += 0.012 * (dt / PHYS_INTERVAL);
      if (rng() < 0.4 && p.morph && p.morph.leafN) spawnLitter(p);
      if (p.dying >= 1) p.dead = true;
      return;
    }
    p.age += dt;
    const env = sampleEnv(p);
    p.env = env;
    const fit = computeFitness(p.G, p.form, p.habitat, env);
    p.fitness += (fit - p.fitness) * 0.25;
    const m = p.morph;
    const info = FORM_INFO[p.form];
    const maint = 0.18 + Math.min(0.16, Math.sqrt(m.n) / 350) + p.G[14] * 0.08 + p.G[9] * 0.05;
    p.energy = clamp(p.energy + (p.fitness - maint) * 0.0028 * dt, -1, 3);
    p.health = clamp(p.health + (p.energy < 0 ? -0.0016 : 0.0007) * dt, 0, 1);
    // Root uptake (transpiration) & nutrient draw
    if (p.habitat === "ground" || p.habitat === "island") {
      const span = 1 + Math.round(p.G[10] * 2);
      const up = 0.000035 * dt * (1 + m.n / 600) * (1 - p.G[12] * 0.4) / (span * 2 + 1);
      for (let c = Math.max(0, p.col - span); c <= Math.min(W - 1, p.col + span); c++) {
        moist[c] = Math.max(0.02, moist[c] - up);
        nut[c] = Math.max(0, nut[c] - up * 0.25);
      }
    }
    // Growth
    const cost = (0.18 + 0.08 * p.stage) * info.growK;
    if (p.stage < p.maxStage && p.energy > cost + 0.1) {
      p.stage++;
      p.energy -= cost;
      develop(p);
    }
    reproduce(p, dt, t);
    if (p.pruneCooldown > 0) p.pruneCooldown -= dt;
    if (p.health <= 0) startDying(p, "starvation");
    else if (p.age > p.lifespan) startDying(p, "senescence");
  }

  function mutationRateFor(p) {
    const dil = state.cosmic && state.cosmic.timeDilation > 1 ? 0.01 : 0;
    return 0.035 + (1 - clamp(p.fitness, 0, 1)) * 0.05 + dil;
  }

  function anchorPointPx(p, out) {
    const m = p.morph;
    if (m && m.flowers.length) {
      const i = m.flowers[(rng() * m.flowers.length) | 0];
      out.x = p.ax + m.xs[i];
      out.y = p.ay + m.ys[i];
    } else if (m && m.fruits.length) {
      const fr = m.fruits[(rng() * m.fruits.length) | 0];
      out.x = p.ax + fr.x;
      out.y = p.ay + fr.y;
    } else if (m && m.n) {
      // any shoot pixel near the crown
      for (let tries = 0; tries < 8; tries++) {
        const i = (rng() * m.n) | 0;
        const ty = m.ts[i];
        if (ty === PT.ROOT || ty === PT.TUBER) continue;
        out.x = p.ax + m.xs[i];
        out.y = p.ay + m.ys[i];
        return out;
      }
      out.x = p.ax;
      out.y = p.ay - 2;
    } else {
      out.x = p.ax;
      out.y = p.ay - 2;
    }
    return out;
  }
  const tmpPt = { x: 0, y: 0 };

  function reproduce(p, dt, t) {
    const info = FORM_INFO[p.form];
    const k = dt / PHYS_INTERVAL;
    if (p.stage < info.mature) {
      p.bloom = Math.max(0, p.bloom - 0.01 * k);
      return;
    }
    if (p.form === FORM.ROOTVEG) {
      if (!p.bolted) {
        p.ripeness = Math.min(1, p.ripeness + 0.0005 * dt * (0.4 + p.fitness));
        if (p.ripeness >= 1) {
          p.ripeHold += dt;
          if (p.ripeHold > 1800) {
            p.bolted = true; // unharvested roots bolt into a flowering stalk
            develop(p);
          }
        }
        return;
      }
    }
    if (info.sexual) {
      const win = Math.sin((state.sun.yearPhase + p.G[GENE.HUE] * 0.35 + (p.cultivated ? 0.1 : 0)) * TAU);
      const want = !p.fruitSet && win > -0.25 && p.energy > 0.15 ? 1 : 0;
      const prevBloom = p.bloom;
      p.bloom = clamp(p.bloom + (want - p.bloom) * 0.02 * k, 0, 1);
      if (p.bloom > 0.6 && rng() < 0.22 * p.bloom * k) {
        anchorPointPx(p, tmpPt);
        spawnParticle(PK.POLLEN, tmpPt.x, tmpPt.y, (rng() - 0.5) * 0.4, -0.15 - rng() * 0.2, 420, p.genome, p.form, 0, p.gen, p.id);
      }
      if (p.bloom > 0.4 && !p.fruitSet && p.pollen) {
        p.fruitSet = true;
        p.ripeness = 0;
        p.ripeHold = 0;
      }
      // self-pollination fallback when the bloom fades unvisited
      if (!p.fruitSet && !p.pollen && prevBloom > 0.3 && p.bloom <= 0.3 && rng() < 0.35) {
        p.pollen = mutate(cloneGenome(p.genome), 0.02);
        p.pollenGen = p.gen;
        p.fruitSet = true;
        p.ripeness = 0;
      }
      if (p.fruitSet) {
        p.ripeness = Math.min(1, p.ripeness + 0.0007 * dt * (0.4 + p.fitness));
        if (p.ripeness >= 1) {
          p.ripeHold += dt;
          const hold = p.morph.fruits.length ? (p.cultivated ? 2400 : 900) : 60;
          if (p.ripeHold > hold) dropSeeds(p);
        }
      }
    } else {
      p.sporeTimer -= dt;
      if (p.sporeTimer <= 0 && p.energy > 0.3) {
        const n = 1 + Math.round(p.G[GENE.YIELD] * 2);
        for (let s = 0; s < n; s++) {
          let g = cloneGenome(p.genome);
          // wild gamete fusion with a neighbour of the same body plan
          const mate = randomNeighbour(p, 10, true);
          if (mate && rng() < 0.3) g = crossover(g, mate.genome);
          mutate(g, mutationRateFor(p));
          anchorPointPx(p, tmpPt);
          spawnParticle(PK.SPORE, tmpPt.x, tmpPt.y, (rng() - 0.5) * 0.5, (rng() - 0.6) * 0.3, 900, g, p.form, 0, p.gen + 1, p.id);
        }
        state.stats.sporesReleased += n;
        p.energy -= 0.05;
        p.sporeTimer = 500 + rng() * 900;
      }
    }
  }

  function randomNeighbour(p, radius, sameForm) {
    let best = null;
    let n = 0;
    for (let c = Math.max(0, p.col - radius); c <= Math.min(W - 1, p.col + radius); c++) {
      const b = buckets[c];
      for (let k = 0; k < b.length; k++) {
        const q = b[k];
        if (q === p || q.dead || (sameForm && q.form !== p.form)) continue;
        n++;
        if (rng() * n < 1) best = q;
      }
    }
    return best;
  }

  function dropSeeds(p) {
    const n = 1 + Math.round(p.G[GENE.YIELD] * 3) + (p.form === FORM.ORCHARD ? 1 : 0);
    const mate = p.pollen || p.genome;
    const info = FORM_INFO[p.form];
    for (let s = 0; s < n; s++) {
      const g = mutate(crossover(p.genome, mate), mutationRateFor(p) + (p.pollen === null ? 0.02 : 0));
      anchorPointPx(p, tmpPt);
      const fluffy = info.seedW < 0.8 ? 1 : 0;
      spawnParticle(PK.SEED, tmpPt.x, tmpPt.y, (rng() - 0.5) * 0.6, -0.2 - rng() * 0.3, 1400, g, p.form, fluffy, Math.max(p.gen, p.pollenGen || 0) + 1, p.id);
    }
    state.stats.seedsReleased += n;
    p.energy -= 0.03 * n;
    nut[p.col] = Math.min(1, nut[p.col] + 0.01 * n);
    p.fruitSet = false;
    p.pollen = null;
    p.pollenGen = 0;
    p.ripeness = 0;
    p.ripeHold = 0;
    p.bloom = 0;
    if (p.form === FORM.ROOTVEG) startDying(p, "biennial seed set");
  }

  function spawnLitter(p) {
    const m = p.morph;
    for (let tries = 0; tries < 6; tries++) {
      const i = (rng() * m.n) | 0;
      if (m.ts[i] !== PT.LEAF) continue;
      const rampIdx = 6 + ((rng() * 10) | 0);
      spawnParticle(PK.LITTER, p.ax + m.xs[i], p.ay + m.ys[i], (rng() - 0.5) * 0.3, 0.05, 600, null, p.form, rampIdx, 0, p.id);
      return;
    }
  }

  // ==========================================================================
  // 9. SUNLIGHT & DYNAMIC SHADOW MAP
  // ==========================================================================
  function updateSun() {
    const s = state.sun;
    const L = layerOf();
    const dayPos = (state.simTime / DAY_TICKS + 0.12) % 1;
    s.dayPhase = dayPos;
    s.yearPhase = (state.simTime / (DAY_TICKS * DAYS_PER_YEAR)) % 1;
    const yp = s.yearPhase;
    s.season = yp < 0.25 ? "spring" : yp < 0.5 ? "summer" : yp < 0.75 ? "autumn" : "winter";
    s.autumn = clamp(Math.sin((yp - 0.5) * TAU + Math.PI / 2) * 1.4 - 0.4, 0, 1);
    const dayLen = 0.62;
    if (dayPos < dayLen) {
      const u = dayPos / dayLen;
      s.isDay = true;
      s.theta = (-1 + 2 * u) * 78 * DEG;
      s.intensity = Math.pow(Math.sin(Math.PI * u), 0.6);
      s.skyI = 0.1 + 0.25 * s.intensity;
    } else {
      const u = (dayPos - dayLen) / (1 - dayLen);
      s.isDay = false;
      s.theta = (-1 + 2 * u) * 70 * DEG; // moon arc
      s.intensity = 0.07 * Math.sin(Math.PI * u);
      s.skyI = 0.06;
    }
    if (L < 0) {
      s.intensity = 0;
      s.skyI = 0.03;
    }
    s.sdx = clamp(Math.tan(s.theta), -4, 4);
  }

  function collectStructures() {
    const w = state.world;
    const cosmic = state.cosmic;
    const out = [];
    const push = (x, e0, e1, hw, opacity, vx) => out.push({ x, e0, e1, hw, opacity, vx: vx || 0, y: (e0 + e1) / 2, h: Math.max(1, (e1 - e0) / 2) });
    if (Array.isArray(w.Airships)) for (const a of w.Airships) if (a && isFinite(a.x) && isFinite(a.y)) push(a.x, a.y - 1, a.y + 5, 5, 0.8, a.vx || 0);
    if (Array.isArray(w.Castles)) for (const c of w.Castles) if (c && isFinite(c.x)) { const b = groundElev(c.x); push(c.x, b, b + 14, 8, 0.95, 0); }
    if (Array.isArray(w.Towns)) for (const t of w.Towns) if (t && isFinite(t.x)) { const b = groundElev(t.x); push(t.x, b, b + 3, 1, 0.9, 0); }
    if (cosmic) {
      if (Array.isArray(cosmic.Labs)) for (const l of cosmic.Labs) if (l && isFinite(l.x) && isFinite(l.y)) push(l.x, l.y, l.y + 6, 3, 0.9, 0);
      if (Array.isArray(cosmic.WfcZones)) for (const z of cosmic.WfcZones) if (z && isFinite(z.x) && isFinite(z.y)) push(z.x + (z.w || 4) / 2, z.y, z.y + (z.h || 4), (z.w || 4) / 2, 0.9, 0);
    }
    const tf = global.SlopesTabForms && global.SlopesTabForms.state && global.SlopesTabForms.state.tabForms;
    if (Array.isArray(tf)) for (const m of tf) if (m && isFinite(m.x) && isFinite(m.y)) push(m.x, m.y, m.y + 5, 2, 0.7, m.vx || 0);
    if (w.P && isFinite(w.P.x) && isFinite(w.P.y)) push(w.P.x, w.P.y, w.P.y + 3, 1, 0.85, 0);
    return out;
  }

  function addBox(cx, hw, e0, e1, o) {
    const c0 = Math.max(0, Math.floor(cx - hw));
    const c1 = Math.min(W - 1, Math.ceil(cx + hw));
    const r0 = Math.max(0, Math.floor(e0));
    const r1 = Math.min(H - 1, Math.ceil(e1));
    for (let e = r0; e <= r1; e++) {
      const row = e * W;
      for (let c = c0; c <= c1; c++) occ[row + c] = Math.min(1, occ[row + c] + o);
    }
  }

  function rebuildOccupancy() {
    const w = state.world;
    const Bk = w.Blocks;
    const L = layerOf();
    const sea = seaOf();
    const magma = isMagma();
    occ.fill(0);
    glowF.fill(0);
    rootMass.fill(0);
    for (let c = 0; c < W; c++) buckets[c].length = 0;
    for (let c = 0; c < W; c++) {
      const h = Math.min(H, Bk[c] | 0);
      const base = L > 0 ? islandBase(c) : 0;
      for (let e = base; e < h; e++) occ[e * W + c] = 1;
      if (L < 0) {
        const ch = ceilingRows(c);
        for (let r = 0; r < ch && r < H; r++) occ[(H - 1 - r) * W + c] = 1;
      }
      if (sea > 0 && h < sea) {
        for (let e = Math.max(0, h); e < Math.min(H, sea); e++) {
          if (magma) glowF[e * W + c] += 0.12;
          else occ[e * W + c] = Math.min(1, occ[e * W + c] + 0.07);
        }
      }
    }
    for (const cl of state.clouds) addBox(cl.x, cl.w * 0.45, cl.y - cl.h * 0.5, cl.y + cl.h * 0.5, 0.1 + cl.water * 0.18);
    state.structures = collectStructures();
    for (const s of state.structures) addBox(s.x, s.hw, s.e0, s.e1, s.opacity);
    if (Array.isArray(w.Crystals)) {
      for (const cr of w.Crystals) {
        if (!cr || !isFinite(cr.x)) continue;
        const cc = clamp(cr.x | 0, 0, W - 1);
        const e = clamp(isFinite(cr.y) ? cr.y | 0 : groundElev(cc), 0, H - 1);
        for (let dc = -2; dc <= 2; dc++) for (let de = -2; de <= 2; de++) {
          const c2 = cc + dc, e2 = e + de;
          if (c2 >= 0 && c2 < W && e2 >= 0 && e2 < H) glowF[e2 * W + c2] += 0.05;
        }
      }
    }
    for (const p of state.plants) {
      if (p.dead) continue;
      buckets[p.col].push(p);
      const m = p.morph;
      if (!m) continue;
      const acol = Math.floor(p.ax / SCALE);
      const arow = Math.floor(p.ay / SCALE);
      const leafK = p.dying > 0 ? 1 - p.dying : FORM_INFO[p.form].deciduous ? 1 - state.sun.autumn * 0.45 : 1;
      for (let i = 0; i < m.occN; i++) {
        const c = acol + m.occDc[i];
        const e = H - 1 - (arow + m.occDr[i]);
        if (c < 0 || c >= W || e < 0 || e >= H) continue;
        const idx = e * W + c;
        occ[idx] = Math.min(1, occ[idx] + m.occW[i] * leafK);
      }
      const span = 1 + Math.round(p.G[10] * 2);
      const mass = m.n * (0.3 + p.G[10]);
      for (let c = Math.max(0, p.col - span); c <= Math.min(W - 1, p.col + span); c++) rootMass[c] += mass / (span * 2 + 1);
      const bio = p.G[14];
      if (bio > 0.4 && p.dying === 0) {
        const ce = clamp(H - 1 - (arow + ((m.minY + m.maxY) / 2 / SCALE) | 0), 0, H - 1);
        for (let dc = -2; dc <= 2; dc++) for (let de = -2; de <= 2; de++) {
          const c2 = acol + dc, e2 = ce + de;
          if (c2 >= 0 && c2 < W && e2 >= 0 && e2 < H) glowF[e2 * W + c2] += bio * 0.03;
        }
      }
    }
  }

  function propagateLight() {
    const sun = state.sun;
    const sdx = sun.sdx;
    const n = Math.max(1, Math.ceil(Math.abs(sdx)));
    const pathL = Math.sqrt(1 + sdx * sdx) / n;
    const top = (H - 1) * W;
    for (let c = 0; c < W; c++) {
      direct[top + c] = 1 - occ[top + c] * 0.5;
      skyV[top + c] = 1;
    }
    for (let e = H - 2; e >= 0; e--) {
      const row = e * W;
      const up = row + W;
      for (let c = 0; c < W; c++) {
        skyV[row + c] = skyV[up + c] * (1 - occ[up + c]);
        let T = 1;
        for (let k = 1; k <= n; k++) {
          let sc = Math.round(c + (sdx * k) / n);
          sc = sc < 0 ? 0 : sc >= W ? W - 1 : sc;
          const o = occ[up + sc];
          T *= o >= 1 ? 0 : 1 - Math.min(1, o * pathL);
        }
        let src = c + sdx;
        src = src < 0 ? 0 : src > W - 1 ? W - 1 : src;
        const s0 = src | 0;
        const s1 = s0 < W - 1 ? s0 + 1 : s0;
        const fr = src - s0;
        direct[row + c] = (direct[up + s0] * (1 - fr) + direct[up + s1] * fr) * T;
      }
    }
    const sunI = sun.intensity;
    const skyI = sun.skyI;
    for (let i = 0; i < W * H; i++) lightG[i] = Math.min(1, sunI * 0.82 * direct[i] + skyI * (0.25 + 0.75 * skyV[i]) + glowF[i]);
  }

  // ==========================================================================
  // 10. MULTI-FREQUENCY WIND FIELD & TURBULENCE
  // ==========================================================================
  function updatePrevailing(t) {
    const w = state.wind;
    w.prevailing = 0.55 * Math.sin(t * 0.00041 + 0.7) + 0.25 * Math.sin(t * 0.0013 + 2.1) + 0.12;
    w.gustiness = 0.5 + 0.5 * Math.sin(t * 0.0031);
  }

  function computeLee() {
    const dir = state.wind.prevailing >= 0 ? 1 : -1;
    for (let c = 0; c < W; c++) {
      const ground = groundElev(c);
      let best = -1;
      for (let k = 1; k <= 16; k++) {
        const u = c - dir * k;
        if (u < 0 || u >= W) break;
        const hh = groundElev(u) - k * 0.42;
        if (hh > best) best = hh;
      }
      lee[c] = clamp((best - ground) / 7, 0, 1);
      leeTop[c] = Math.max(ground, best + 2);
    }
  }

  const windOut = { x: 0, y: 0, speed: 0, gust: 0, turbulence: 0, shear: 0, wake: 0 };
  function computeWind(col, e, t) {
    const c = col < 0 ? 0 : col >= W ? W - 1 : col | 0;
    const ground = groundElev(c);
    const above = e - ground;
    const L = layerOf();
    const prev = state.wind.prevailing;
    const dir = prev >= 0 ? 1 : -1;
    let shear = above <= 0 ? 0.12 : 0.3 + 0.7 * Math.min(1, Math.log1p(above) / 3.6);
    if (L < 0) shear *= 0.22;
    const g =
      0.55 * Math.sin(col * 0.11 - dir * t * 0.021 + 1.3) +
      0.3 * Math.sin(col * 0.27 - dir * t * 0.047 + e * 0.05) +
      0.15 * Math.sin(col * 0.61 - dir * t * 0.093 + e * 0.13);
    const gust = g * state.wind.gustiness * (0.5 + 0.5 * Math.sin(t * 0.0047 + col * 0.02));
    // domain-warped sinusoidal turbulence (cheap, temporally coherent)
    const warp = Math.sin(e * 0.29 + t * 0.017) * 2.1;
    const turb = 0.5 * Math.sin(col * 0.37 + t * 0.031 + warp) * Math.sin(e * 0.41 - t * 0.027 + col * 0.13) + 0.25 * Math.sin((col + e) * 0.83 - t * 0.061);
    const turbY = 0.5 * Math.sin(col * 0.33 - t * 0.029 + warp * 0.7 + 1.7) * Math.cos(e * 0.37 + t * 0.023);
    let vx = prev * shear * (1 + gust * 0.75) + turb * 0.55 * (0.35 + Math.abs(prev)) * shear;
    let vy = turbY * 0.35 * shear;
    let wake = 0;
    // Hill lee rotors
    if (above >= 0 && e < leeTop[c] && lee[c] > 0) {
      const sh = lee[c];
      const depthFrac = clamp(above / Math.max(1, leeTop[c] - ground), 0, 1);
      vx *= 1 - 0.75 * sh;
      vx -= prev * sh * 0.45 * (1 - depthFrac);
      vy += sh * 0.38 * Math.sin(col * 0.8 - t * 0.06 * dir + e * 0.4);
      wake += sh;
    }
    // Windward up-slope lift
    if (above >= 0 && above < 6) {
      const slope = groundElev(c + dir) - groundElev(c - dir);
      vy += clamp(slope * 0.12, -0.3, 0.4) * Math.abs(prev) * (1 - above / 6);
    }
    // Karman vortex streets behind airships & megastructures
    const S = state.structures;
    for (let i = 0; i < S.length; i++) {
      const o = S[i];
      if (o.hw < 1.5) continue;
      const rel = vx - o.vx * 0.5;
      const sgn = rel >= 0 ? 1 : -1;
      const d = (col - o.x) * sgn - o.hw;
      if (d < 0 || d > 30) continue;
      const dy = e - o.y;
      const hh = o.h * o.h;
      if (dy * dy > hh * 5) continue;
      const decay = Math.exp(-d / 11) * Math.exp(-(dy * dy) / (hh * 1.5 + 1));
      const phase = d * 0.55 - t * 0.12 * (0.4 + Math.abs(rel));
      vy += Math.sin(phase) * decay * 0.9;
      vx = vx * (1 - 0.55 * decay) + Math.cos(phase) * (dy >= 0 ? 1 : -1) * decay * 0.35;
      wake += decay;
    }
    windOut.x = vx;
    windOut.y = vy;
    windOut.speed = Math.sqrt(vx * vx + vy * vy);
    windOut.gust = gust;
    windOut.turbulence = turb;
    windOut.shear = shear;
    windOut.wake = wake;
    return windOut;
  }

  let windRowParity = 0;
  function computeWindGrid(t, full) {
    windRowParity ^= 1;
    for (let e = full ? 0 : windRowParity; e < H; e += full ? 1 : 2) {
      const row = e * W;
      for (let c = 0; c < W; c++) {
        const wv = computeWind(c, e, t);
        windX[row + c] = wv.x;
        windY[row + c] = wv.y;
      }
    }
  }

  function windXAtPx(x, y) {
    const c = clamp((x / SCALE) | 0, 0, W - 1);
    const e = clamp(H - 1 - ((y / SCALE) | 0), 0, H - 1);
    return windX[e * W + c];
  }

  // ==========================================================================
  // 11. CLOUDS & RAIN
  // ==========================================================================
  function makeCloud(r) {
    const L = layerOf();
    const w = 7 + r() * 10;
    const h = 2 + r() * 2.2;
    const cl = {
      id: state.nextCloudId++,
      x: r() * W,
      y: L > 0 ? H - 8 - r() * 16 : H - 6 - r() * 9,
      w, h,
      water: 0.2 + r() * 0.6,
      raining: false,
      puffs: [],
    };
    const n = 5 + ((r() * 4) | 0);
    for (let i = 0; i < n; i++) {
      cl.puffs.push({
        dx: (i / (n - 1) - 0.5) * w * 0.8 * SCALE + (r() - 0.5) * 6,
        dy: (r() - 0.5) * h * SCALE * 0.5,
        rad: (0.35 + r() * 0.35) * h * SCALE + 3,
      });
    }
    return cl;
  }

  function cloudsAllowed() {
    const w = state.world;
    return layerOf() >= 0 && w.currentBiome !== "underwater";
  }

  function stepClouds(t, dil) {
    if (!cloudsAllowed()) return;
    for (const cl of state.clouds) {
      const wv = computeWind(cl.x | 0, cl.y | 0, t);
      cl.x += wv.x * 0.035 * Math.min(dil, 4);
      if (cl.x > W + cl.w) cl.x = -cl.w;
      if (cl.x < -cl.w) cl.x = W + cl.w;
      const c = clamp(cl.x | 0, 0, W - 1);
      if (isSubmerged(c) || seaOf() > 0 && groundElev(c) < seaOf() + 2) cl.water = Math.min(1, cl.water + 0.0004 * dil);
      else cl.water = Math.min(1, cl.water + (layerOf() > 0 ? 0.0003 : 0.00008) * dil); // ambient humidity
      if (!cl.raining && cl.water > 0.78 && rng() < 0.004) cl.raining = true;
      if (cl.raining) {
        cl.water -= 0.0012 * dil;
        const c0 = Math.max(0, Math.floor(cl.x - cl.w * 0.4));
        const c1 = Math.min(W - 1, Math.ceil(cl.x + cl.w * 0.4));
        for (let cc = c0; cc <= c1; cc++) if (!isSubmerged(cc)) surf[cc] = Math.min(2, surf[cc] + 0.0012 * dil);
        if (cl.water < 0.25) cl.raining = false;
      }
    }
  }

  // ==========================================================================
  // 12. SOIL MOISTURE, HYDROLOGY & NUTRIENT DIFFUSION
  // ==========================================================================
  let springCol = -1;
  function findSpring() {
    springCol = -1;
    if (layerOf() !== 0) return;
    let best = -1, bh = -1;
    for (let c = 6; c < W - 6; c++) {
      const h = groundElev(c);
      if (h > bh) { bh = h; best = c; }
    }
    if (best >= 0 && bh - seaOf() > 10) springCol = best;
  }

  function computeWaterDist() {
    let d = 999;
    for (let c = 0; c < W; c++) { d = isSubmerged(c) ? 0 : d + 1; waterDist[c] = d; }
    d = 999;
    for (let c = W - 1; c >= 0; c--) { d = isSubmerged(c) ? 0 : d + 1; waterDist[c] = Math.min(waterDist[c], d); }
  }

  function initHydrology(r) {
    computeWaterDist();
    const L = layerOf();
    for (let c = 0; c < W; c++) {
      const wd = waterDist[c];
      gw[c] = isSubmerged(c) ? 1 : clamp(0.75 - wd * 0.012 + (L < 0 ? 0.15 : 0), 0.2, 0.95);
      moist[c] = isSubmerged(c) ? 1 : clamp(gw[c] * 0.8 + (r() - 0.5) * 0.1, 0.1, 1);
      nut[c] = clamp(0.45 + (r() - 0.5) * 0.3, 0, 1);
      surf[c] = 0;
      stab[c] = 0.3;
      erosion[c] = 0;
    }
    findSpring();
  }

  function stepHydrology(dt, t) {
    const Bk = state.world.Blocks;
    const L = layerOf();
    const k = dt / 4;
    const sunI = state.sun.intensity;
    for (let c = 0; c < W; c++) {
      if (isSubmerged(c)) { gw[c] = 1; moist[c] = 1; surf[c] = 0; }
      if ((Bk[c] | 0) <= 0) { moist[c] = 0; gw[c] = 0; surf[c] = 0; }
    }
    if (springCol >= 0) surf[springCol] = Math.min(2, surf[springCol] + 0.004 * k);
    if (L < 0) {
      // cave drips beneath stalactite tips
      for (let c = 1; c < W - 1; c++) {
        const ch = ceilingRows(c);
        if (ch > ceilingRows(c - 1) && ch >= ceilingRows(c + 1)) {
          moist[c] = Math.min(1, moist[c] + 0.0009 * k);
          if (rng() < 0.01 * k) spawnParticle(PK.DROP, c * SCALE + 3, ch * SCALE + 1, 0, 0.2, 400, null, 0, 0, 0, 0);
        }
      }
    }
    // Darcy groundwater flow down the hydraulic head gradient
    tmpA.fill(0);
    for (let c = 0; c < W - 1; c++) {
      if ((Bk[c] | 0) <= 0 || (Bk[c + 1] | 0) <= 0) continue;
      const hA = Bk[c] * 0.03 + gw[c];
      const hB = Bk[c + 1] * 0.03 + gw[c + 1];
      let flux = (hA - hB) * 0.05 * k;
      flux = flux > 0 ? Math.min(flux, gw[c] * 0.2) : Math.max(flux, -gw[c + 1] * 0.2);
      tmpA[c] -= flux;
      tmpA[c + 1] += flux;
    }
    for (let c = 0; c < W; c++) gw[c] = clamp(gw[c] + tmpA[c], 0, 1);
    // Surface runoff & rivers (kinematic flow to the lowest neighbour, carrying nutrients)
    tmpA.fill(0);
    for (let c = 0; c < W; c++) {
      if (surf[c] < 0.0005) continue;
      const hl = c > 0 ? Bk[c - 1] : 9999;
      const hr = c < W - 1 ? Bk[c + 1] : 9999;
      const low = hl < hr ? c - 1 : c + 1;
      const lowH = Math.min(hl, hr);
      if (lowH < Bk[c]) {
        const slope = Bk[c] - lowH;
        const flow = surf[c] * Math.min(0.6, 0.15 + slope * 0.12) * k;
        tmpA[c] -= flow;
        if (low >= 0 && low < W && !isSubmerged(low)) {
          tmpA[low] += flow;
          const carried = nut[c] * flow * 0.05;
          nut[c] -= carried;
          nut[low] = Math.min(1, nut[low] + carried);
        }
        erosion[c] += (slope * flow * (1 - stab[c]) - erosion[c]) * 0.05;
      } else {
        erosion[c] *= 0.98;
      }
    }
    for (let c = 0; c < W; c++) {
      surf[c] = clamp(surf[c] + tmpA[c], 0, 2);
      const inf = Math.min(surf[c], 0.004 * k * (1 - moist[c]));
      surf[c] -= inf;
      moist[c] += inf * 1.6;
      // capillary rise / drainage recharge
      const ex = (gw[c] - moist[c]) * 0.004 * k;
      moist[c] += ex;
      gw[c] -= ex * 0.5;
    }
    // lateral soil diffusion
    for (let c = 0; c < W; c++) tmpA[c] = moist[c];
    for (let c = 1; c < W - 1; c++) moist[c] += (tmpA[c - 1] + tmpA[c + 1] - 2 * tmpA[c]) * 0.02 * k;
    for (let c = 0; c < W; c++) tmpA[c] = nut[c];
    for (let c = 1; c < W - 1; c++) nut[c] += (tmpA[c - 1] + tmpA[c + 1] - 2 * tmpA[c]) * 0.008 * k;
    // evaporation, mineralization & root stabilization
    for (let c = 0; c < W; c++) {
      if (isSubmerged(c) || (Bk[c] | 0) <= 0) continue;
      const e = clamp(Bk[c] | 0, 0, H - 1);
      const idx = e * W + c;
      const ev = 0.0009 * k * sunI * direct[idx] * (1 + Math.abs(windX[idx]) * 0.6) * (1 - 0.35 * stab[c]);
      moist[c] = clamp(moist[c] - ev, 0.02, 1);
      surf[c] = Math.max(0, surf[c] - ev * 1.5);
      nut[c] = clamp(nut[c] + 0.00005 * k * moist[c], 0, 1);
      stab[c] += (Math.min(1, rootMass[c] * 0.004) - stab[c]) * 0.02 * k;
      if (erosion[c] > 0.004 && rng() < erosion[c] * 4 * k) {
        const dir = c > 0 && Bk[c - 1] < Bk[c] ? -1 : 1;
        spawnParticle(PK.SOIL, c * SCALE + 3 + dir * 3, (H - Bk[c]) * SCALE, dir * 0.4, -0.2, 160, null, 0, 0, 0, 0);
      }
    }
  }

  // ==========================================================================
  // 13. PARTICLES: POLLEN, SEEDS, SPORES, LITTER, DROPS
  // ==========================================================================
  const tmpG = { lo: 0, hi: 0 };
  function stepParticles(t) {
    const L = layerOf();
    for (let i = pCount - 1; i >= 0; i--) {
      const kind = P_KIND[i];
      let x = P_X[i];
      let y = P_Y[i];
      const col = clamp((x / SCALE) | 0, 0, W - 1);
      const row = (y / SCALE) | 0;
      const e = H - 1 - row;
      let wx = 0, wy = 0;
      if (row >= 0 && row < H) {
        const idx = e * W + col;
        wx = windX[idx];
        wy = windY[idx];
      }
      if (waterAtCell(col, e)) {
        wx = 0.3 * Math.sin(t * 0.01 + e * 0.2 + col * 0.05);
        wy = 0.08 * Math.sin(t * 0.013 + col * 0.3);
      }
      let vx = P_VX[i], vy = P_VY[i];
      switch (kind) {
        case PK.POLLEN:
          vx += (wx * 0.9 - vx) * 0.08 + (rng() - 0.5) * 0.05;
          vy += (wy * 0.5 + 0.012 - vy) * 0.08 + (rng() - 0.5) * 0.04;
          break;
        case PK.SPORE:
          vx += (wx * 0.8 - vx) * 0.07 + (rng() - 0.5) * 0.04;
          vy += (wy * 0.5 + 0.008 - vy) * 0.07 + (rng() - 0.5) * 0.03;
          break;
        case PK.SEED: {
          const wt = FORM_INFO[P_FORM[i]].seedW;
          const drag = 0.06 / wt;
          vx += (wx * 0.9 - vx) * Math.min(0.2, drag);
          vy += 0.018 * wt + (wy * 0.4 - vy) * Math.min(0.2, drag) * 0.5;
          if (vy > 0.4 * wt + 0.2) vy = 0.4 * wt + 0.2;
          break;
        }
        case PK.LITTER:
          vx += (wx * 0.6 - vx) * 0.05 + Math.sin(P_LIFE[i] * 0.2) * 0.04;
          vy = Math.min(0.35, vy + 0.012);
          break;
        case PK.DROP:
          vx += wx * 0.01;
          vy = Math.min(3, vy + 0.12);
          break;
        case PK.SPARK:
          vx *= 0.96;
          vy = vy * 0.96 - 0.01;
          break;
        case PK.SOIL:
          vy = Math.min(2, vy + 0.1);
          break;
        default:
          break;
      }
      x += vx;
      y += vy;
      P_X[i] = x; P_Y[i] = y; P_VX[i] = vx; P_VY[i] = vy;
      P_LIFE[i] -= 1;
      if (x < -8 || x > NW + 8) {
        if (kind === PK.SEED || kind === PK.SPORE) emigrate(i);
        killParticle(i);
        continue;
      }
      if (P_LIFE[i] <= 0 || y > NH + 4 || y < -60) { killParticle(i); continue; }
      if (kind === PK.SPARK) continue;
      const nc = clamp((x / SCALE) | 0, 0, W - 1);
      const top = groundTopPx(nc);
      const bot = L > 0 ? (H - islandBase(nc)) * SCALE : NH + 999;
      if (y >= top && y <= bot) {
        land(i, nc, kind);
        killParticle(i);
        continue;
      }
      if (L < 0 && y <= ceilingRows(nc) * SCALE) {
        if ((kind === PK.SEED || kind === PK.SPORE) && rng() < 0.5) {
          tmpG.lo = P_GLO[i]; tmpG.hi = P_GHI[i];
          trySow(tmpG, nc, "ceiling", { gen: P_GEN[i] });
          killParticle(i);
          continue;
        }
        P_VY[i] = Math.abs(vy) + 0.05;
      }
      if ((kind === PK.SEED || kind === PK.SPORE) && (t + i) % 4 === 0 && state.clouds.length) catchInCloud(i, x, y);
      else if (kind === PK.POLLEN && (t + i) % 2 === 0) capturePollen(i, x, y, nc);
    }
  }

  function land(i, col, kind) {
    if (kind === PK.SEED || kind === PK.SPORE) {
      tmpG.lo = P_GLO[i]; tmpG.hi = P_GHI[i];
      const gen = P_GEN[i];
      if (isSubmerged(col)) { trySow(tmpG, col, "sea", { gen }); return; }
      const L = layerOf();
      if (L > 0 && (groundElev(col - 1) <= 0 || groundElev(col + 1) <= 0) && rng() < 0.3) {
        trySow(tmpG, col, "island", { gen }); // edge spill: seed tumbles under the sky-island rim
        return;
      }
      trySow(tmpG, col, "ground", { gen });
    } else if (kind === PK.LITTER) {
      nut[col] = Math.min(1, nut[col] + 0.002);
    } else if (kind === PK.DROP) {
      moist[col] = Math.min(1, moist[col] + 0.003);
    }
  }

  function emigrate(i) {
    state.stats.emigrants++;
    const g = { lo: P_GLO[i], hi: P_GHI[i] };
    state.geneBank.push({ genome: g, form: P_FORM[i], gen: P_GEN[i] });
    if (state.geneBank.length > 64) state.geneBank.splice(0, state.geneBank.length - 64);
  }

  function catchInCloud(i, x, y) {
    for (const cl of state.clouds) {
      const dx = (x - cl.x * SCALE) / (cl.w * SCALE * 0.5);
      const dy = (y - (H - cl.y) * SCALE) / (cl.h * SCALE * 0.5);
      if (dx * dx + dy * dy < 1 && rng() < 0.02) {
        tmpG.lo = P_GLO[i]; tmpG.hi = P_GHI[i];
        if (trySow(tmpG, clamp(cl.x | 0, 0, W - 1), "cloud", { cloud: cl, gen: P_GEN[i] })) killParticle(i);
        return;
      }
    }
  }

  function capturePollen(i, x, y, col) {
    for (let c = Math.max(0, col - 2); c <= Math.min(W - 1, col + 2); c++) {
      const b = buckets[c];
      for (let k = 0; k < b.length; k++) {
        const p = b[k];
        if (p.dead || p.dying || p.bloom < 0.45 || p.fruitSet || p.pollen || p.id === P_SRC[i] || !p.morph) continue;
        const m = p.morph;
        if (x < p.ax + m.minX - 1 || x > p.ax + m.maxX + 1 || y < p.ay + m.minY - 1 || y > p.ay + Math.max(0, m.maxY) + 1) continue;
        tmpG.lo = P_GLO[i]; tmpG.hi = P_GHI[i];
        const srcForm = P_FORM[i];
        const compatible = srcForm === p.form || geneticDistance(tmpG, p.genome) < 0.42;
        if (!compatible || rng() > 0.35 + p.G[GENE.BIOLUM] * 0.2) continue;
        fertilize(p, cloneGenome(tmpG), srcForm, P_GEN[i]);
        killParticle(i);
        return;
      }
    }
  }

  function fertilize(p, g, srcForm, gen) {
    p.pollen = g;
    p.pollenGen = gen || 0;
    state.stats.pollinations++;
    if (srcForm !== p.form) state.stats.hybrids++;
  }

  // ==========================================================================
  // 14. POLLINATOR FAUNA (bees by day, fireflies by night, glow-moths in caves)
  // ==========================================================================
  function stepFauna(t) {
    const L = layerOf();
    const F = state.fauna;
    let blooming = 0;
    for (const p of state.plants) if (p.bloom > 0.5 && !p.fruitSet && FORM_INFO[p.form].sexual) blooming++;
    const want = state.world.currentBiome === "underwater" ? 0 : Math.min(MAX_FAUNA, Math.ceil(blooming * 0.6) + (L < 0 ? 3 : 0));
    while (F.length < want) {
      F.push({
        x: rng() * NW, y: rng() * NH * 0.6, vx: 0, vy: 0, target: 0, carry: null, carryForm: 0, carryGen: 0,
        pref: (rng() * 16) | 0, phase: rng() * TAU, visits: 0,
      });
    }
    if (F.length > want + 2) F.length = want;
    for (const b of F) {
      b.kind = L < 0 ? "glowmoth" : state.sun.isDay ? "bee" : "firefly";
      let tgt = null;
      if (b.target) for (const p of state.plants) if (p.id === b.target) { tgt = p; break; }
      if (!tgt || tgt.bloom < 0.4 || tgt.fruitSet) {
        b.target = 0;
        let best = null, bs = -1;
        for (let k = 0; k < 6; k++) {
          const p = state.plants[(rng() * state.plants.length) | 0];
          if (!p || p.bloom < 0.5 || p.fruitSet || !FORM_INFO[p.form].sexual || !p.morph) continue;
          const hueD = Math.abs(getGene(p.genome, GENE.HUE) - b.pref);
          const s = 1 / (1 + hueD) + p.G[GENE.BIOLUM] * (state.sun.isDay ? 0 : 0.8) + rng() * 0.2;
          if (s > bs) { bs = s; best = p; }
        }
        if (best) { b.target = best.id; tgt = best; }
      }
      let tx, ty;
      if (tgt) {
        const m = tgt.morph;
        tx = tgt.ax + (m.minX + m.maxX) * 0.5;
        ty = tgt.ay + m.minY * 0.7;
      } else {
        tx = b.x + Math.sin(t * 0.01 + b.phase) * 40;
        ty = b.y + Math.cos(t * 0.013 + b.phase) * 20;
      }
      const wv = windXAtPx(b.x, b.y);
      b.vx += clamp((tx - b.x) * 0.004, -0.06, 0.06) + Math.sin(t * 0.21 + b.phase) * 0.05 + wv * 0.01;
      b.vy += clamp((ty - b.y) * 0.004, -0.06, 0.06) + Math.cos(t * 0.17 + b.phase) * 0.05;
      b.vx *= 0.92;
      b.vy *= 0.92;
      b.x = clamp(b.x + b.vx, 0, NW - 1);
      b.y = clamp(b.y + b.vy, 0, NH - 1);
      if (tgt && Math.abs(b.x - tx) < 3 && Math.abs(b.y - ty) < 3) {
        if (b.carry && !tgt.pollen && (b.carryForm === tgt.form || geneticDistance(b.carry, tgt.genome) < 0.42)) {
          fertilize(tgt, b.carry, b.carryForm, b.carryGen);
        }
        b.carry = cloneGenome(tgt.genome);
        b.carryForm = tgt.form;
        b.carryGen = tgt.gen;
        b.pref += Math.sign(getGene(tgt.genome, GENE.HUE) - b.pref); // pollinator preference co-evolves
        b.visits++;
        b.target = 0;
      }
    }
  }

  // ==========================================================================
  // 15. CIVILIZATIONS: FARMING, IRRIGATION, HARVEST, TIMBER & GENE EDITING
  // ==========================================================================
  function gatherActors() {
    const w = state.world;
    const eco = state.eco;
    const cosmic = state.cosmic;
    const A = [];
    if (eco && Array.isArray(eco.OrangePeople)) {
      for (const o of eco.OrangePeople) if (o && isFinite(o.x)) A.push({ faction: "ORANGE_PEOPLE", x: o.x, e: groundElev(o.x) + 1 });
    }
    if (!A.length && Array.isArray(w.Towns) && w.Towns.length) {
      // virtual farmers tending the town fields when no ecology layer is attached
      for (let i = 0; i < w.Towns.length; i++) {
        const tw = w.Towns[i];
        if (!tw || !isFinite(tw.x)) continue;
        const x = clamp(tw.x + Math.sin(state.simTime * 0.002 + i * 2.3) * 8, 0, W - 1);
        A.push({ faction: "ORANGE_PEOPLE", x, e: groundElev(x) + 1, virtual: true });
      }
    }
    if (Array.isArray(w.Airships)) {
      for (const as of w.Airships) {
        if (!as || as.type === "pirate" || !isFinite(as.x)) continue;
        if (Array.isArray(as.builders) && as.builders.length) {
          for (const b of as.builders) A.push({ faction: "GOOD_BUILDERS", x: clamp(as.x + (b.dx || 0), 0, W - 1), e: as.y, airborne: true });
        } else A.push({ faction: "GOOD_BUILDERS", x: clamp(as.x, 0, W - 1), e: as.y, airborne: true });
      }
    }
    if (cosmic && Array.isArray(cosmic.Workers)) {
      for (const wk of cosmic.Workers) if (wk && isFinite(wk.x) && wk.factionId === 0) A.push({ faction: "GOOD_BUILDERS", x: clamp(wk.x, 0, W - 1), e: wk.y || groundElev(wk.x) + 1 });
    }
    const tf = global.SlopesTabForms && global.SlopesTabForms.state && global.SlopesTabForms.state.tabForms;
    if (Array.isArray(tf)) for (const m of tf) if (m && isFinite(m.x)) A.push({ faction: "WHITE_MONOLITHS", x: clamp(m.x, 0, W - 1), e: isFinite(m.y) ? m.y : groundElev(m.x) + 1 });
    if (cosmic && Array.isArray(cosmic.Scientists)) {
      for (const s of cosmic.Scientists) if (s && isFinite(s.x)) A.push({ faction: "WASM_SCIENTISTS", x: clamp(s.x, 0, W - 1), e: isFinite(s.y) ? s.y : groundElev(s.x) + 1 });
    }
    return A;
  }

  function nearestPlant(col, radius, filter) {
    let best = null, bd = 1e9;
    for (const p of state.plants) {
      if (p.dead || p.dying) continue;
      const d = Math.abs(p.col - col);
      if (d > radius || d >= bd) continue;
      if (filter && !filter(p)) continue;
      bd = d;
      best = p;
    }
    return best;
  }

  function farmZoneCenter(col) {
    const towns = state.world.Towns;
    if (!Array.isArray(towns)) return -1;
    let best = -1, bd = 1e9;
    for (const t of towns) {
      if (!t || !isFinite(t.x)) continue;
      const d = Math.abs(t.x - col);
      if (d < bd) { bd = d; best = t.x; }
    }
    return bd <= 14 ? best : -1;
  }

  function vaultSeed(form) {
    const pool = state.seedVault.filter((v) => v.form === form);
    if (!pool.length) return templateGenome(form, rng, 1);
    pool.sort((a, b) => b.score - a.score);
    return mutate(cloneGenome(pool[(rng() * Math.min(3, pool.length)) | 0].genome), 0.03);
  }

  function storeInVault(p) {
    state.seedVault.push({ genome: cloneGenome(p.genome), form: p.form, score: p.G[GENE.YIELD] * 0.6 + p.fitness * 0.4 });
    if (state.seedVault.length > 24) {
      state.seedVault.sort((a, b) => b.score - a.score);
      state.seedVault.length = 24;
    }
  }

  function actorPx(a) {
    return { x: a.x * SCALE + 3, y: (H - a.e) * SCALE - 4 };
  }

  function harvestPlant(p, faction, a) {
    const L = state.ledger[faction];
    const fruits = p.form === FORM.ROOTVEG ? 1 : Math.max(1, p.morph.fruits.length);
    const energy = (1 + p.G[GENE.YIELD] * 4) * fruits * 0.1 * (p.form === FORM.ROOTVEG ? 3 : 1);
    L.harvests++;
    L.energy += energy;
    state.stats.harvests++;
    storeInVault(p);
    const src = actorPx(a);
    for (let k = 0; k < Math.min(8, fruits + 2); k++) {
      anchorPointPx(p, tmpPt);
      const dx = src.x - tmpPt.x, dy = src.y - tmpPt.y;
      spawnParticle(PK.SPARK, tmpPt.x, tmpPt.y, dx * 0.02 + (rng() - 0.5) * 0.3, dy * 0.02 - 0.3, 60, null, 0, 1, 0, 0);
    }
    if (p.form === FORM.ROOTVEG) {
      p.dead = true; // pulled whole from the soil
    } else {
      p.ripeness = 0;
      p.ripeHold = 0;
      if (p.cultivated && p.pollen === null) {
        const mate = randomNeighbour(p, 12, true);
        p.pollen = mate ? cloneGenome(mate.genome) : null; // hand pollination for next crop
        p.fruitSet = false;
      } else {
        p.fruitSet = false;
        p.pollen = null;
      }
    }
    if (state.eco) state.eco.GeneticFloraLedger = state.ledger;
    return energy;
  }

  function irrigate(col, a, faction) {
    for (let c = Math.max(0, col - 2); c <= Math.min(W - 1, col + 2); c++) if (!isSubmerged(c)) surf[c] = Math.min(2, surf[c] + 0.05);
    state.ledger[faction].irrigations++;
    const src = actorPx(a);
    for (let k = 0; k < 4; k++) {
      spawnParticle(PK.DROP, src.x + (rng() - 0.5) * 4, src.y, (rng() - 0.5) * 0.8 + (col * SCALE - src.x) * 0.01, -0.6 - rng() * 0.4, 200, null, 0, 0, 0, 0);
    }
  }

  function stepCivilizations(t) {
    const actors = gatherActors();
    const night = !state.sun.isDay || layerOf() < 0;
    for (const a of actors) {
      if (rng() > 0.25) continue;
      const col = clamp(Math.round(a.x), 0, W - 1);
      const L = state.ledger[a.faction];
      switch (a.faction) {
        case "ORANGE_PEOPLE": {
          const ripe = nearestPlant(col, 3, (p) => p.ripeness >= 0.92 && (p.form === FORM.ROOTVEG ? !p.bolted : p.fruitSet && p.morph.fruits.length > 0));
          if (ripe) { harvestPlant(ripe, a.faction, a); break; }
          const fz = farmZoneCenter(col);
          if (fz >= 0 && moist[col] < 0.42 && rng() < 0.5) { irrigate(col, a, a.faction); break; }
          if (fz >= 0 && rng() < 0.15) {
            let cultivated = 0;
            for (const p of state.plants) if (p.cultivated && Math.abs(p.col - fz) <= 12) cultivated++;
            if (cultivated < 7) {
              const form = rng() < 0.6 ? FORM.ROOTVEG : FORM.ORCHARD;
              const c = clamp(fz + Math.round((rng() - 0.5) * 22), 1, W - 2);
              const p = trySow(vaultSeed(form), c, "ground", { cultivated: true, faction: a.faction, force: rng() < 0.5 });
              if (p) L.sown++;
            }
          } else if (rng() < 0.1) nut[col] = Math.min(1, nut[col] + 0.05); // compost
          break;
        }
        case "GOOD_BUILDERS": {
          if (a.airborne && moist[col] < 0.35 && rng() < 0.3) { irrigate(col, a, a.faction); break; }
          const tree = nearestPlant(col, 4, (p) => (FORM_INFO[p.form].tree || p.form === FORM.BONSAI) && p.stage >= p.maxStage - 1 && p.G[GENE.TIMBER] >= 0.6 && p.pruneCooldown <= 0);
          if (tree && rng() < 0.2) {
            L.timber += tree.morph.n * tree.G[GENE.TIMBER] * 0.01;
            tree.stage = Math.max(1, tree.stage - 1);
            tree.pruneCooldown = 6000;
            for (let k = 0; k < 6; k++) spawnLitter(tree);
            develop(tree);
            break;
          }
          if (!nearestPlant(col, 6, (p) => FORM_INFO[p.form].tree) && rng() < 0.05) {
            const g = templateGenome(FORM.CANOPY, rng, 2);
            setGene(g, GENE.TIMBER, 15);
            if (trySow(g, col, "ground", { faction: a.faction })) L.sown++;
          }
          break;
        }
        case "WHITE_MONOLITHS": {
          if (rng() > 0.04) break;
          const p = nearestPlant(col, 6);
          if (!p) break;
          const env = p.env || sampleEnvAt(p.col, p.habitat, 8);
          const trait = night ? "bioluminescence" : env.moist < 0.3 ? "drought" : env.light < 0.35 ? "shade" : rng() < 0.5 ? "timber" : "yield";
          applyEdit(p, trait, a.faction, actorPx(a));
          break;
        }
        case "WASM_SCIENTISTS": {
          if (rng() > 0.06) break;
          const p = nearestPlant(col, 10);
          if (!p) break;
          const traits = ["bioluminescence", "yield", "timber"];
          applyEdit(p, traits[(L.edits + (t >> 8)) % 3], a.faction, actorPx(a));
          break;
        }
        default:
          break;
      }
    }
  }

  function normalizeTrait(trait) {
    const s = String(trait || "random").toLowerCase();
    if (/biolum|glow|light|lumin/.test(s)) return "bioluminescence";
    if (/yield|fruit|crop|harvest|veg/.test(s)) return "yield";
    if (/timber|wood|struct|lumber/.test(s)) return "timber";
    if (/drought|dry|desert/.test(s)) return "drought";
    if (/shade|dark|under/.test(s)) return "shade";
    if (/wind|storm|gnarl/.test(s)) return "wind";
    if (/flower|petal|bloom|color|colour/.test(s)) return "flower";
    return "random";
  }

  // Splice: copy the strongest allele found in the living population (or a synthetic one) into the target
  function donorAllele(gene, min) {
    let best = min;
    for (const q of state.plants) best = Math.max(best, getGene(q.genome, gene));
    return clamp(best, min, 15);
  }

  function applyEdit(p, trait, faction, fromPx) {
    const T = normalizeTrait(trait);
    const g = p.genome;
    switch (T) {
      case "bioluminescence":
        setGene(g, GENE.BIOLUM, donorAllele(GENE.BIOLUM, 14));
        setGene(g, GENE.SHADE_TOL, Math.max(getGene(g, GENE.SHADE_TOL), 10));
        break;
      case "yield":
        setGene(g, GENE.YIELD, 15);
        if (p.habitat === "ground" && [FORM.CANOPY, FORM.SHRUB, FORM.WILLOW].indexOf(p.form) >= 0) setGene(g, GENE.FORM, 10);
        break;
      case "timber":
        setGene(g, GENE.TIMBER, 15);
        setGene(g, GENE.APICAL, Math.max(getGene(g, GENE.APICAL), 13));
        setGene(g, GENE.GNARL, Math.max(0, getGene(g, GENE.GNARL) - 4));
        setGene(g, GENE.DEPTH, Math.max(getGene(g, GENE.DEPTH), 11));
        break;
      case "drought":
        setGene(g, GENE.DROUGHT_TOL, 15);
        setGene(g, GENE.ROOT_DEPTH, Math.max(getGene(g, GENE.ROOT_DEPTH), 14));
        break;
      case "shade":
        setGene(g, GENE.SHADE_TOL, 15);
        break;
      case "wind":
        setGene(g, GENE.GNARL, 13);
        setGene(g, GENE.TIMBER, Math.max(getGene(g, GENE.TIMBER), 12));
        setGene(g, GENE.DROOP, Math.min(getGene(g, GENE.DROOP), 4));
        break;
      case "flower":
        setGene(g, GENE.HUE, (getGene(g, GENE.HUE) + 5) & 15);
        setGene(g, GENE.LEAF_SHAPE, (getGene(g, GENE.LEAF_SHAPE) + 3) & 15);
        break;
      default: {
        const i = 1 + ((rng() * 15) | 0);
        setGene(g, i, (rng() * 16) | 0);
      }
    }
    expressGenes(p);
    p.edited = T;
    p.editFx = 120;
    p.editFaction = faction;
    develop(p);
    state.stats.edits++;
    const L = state.ledger[faction] || state.ledger.CIVILIZATION;
    L.edits++;
    const m = p.morph;
    const to = { x: p.ax + (m.minX + m.maxX) * 0.5, y: p.ay + (m.minY + m.maxY) * 0.5 };
    const from = fromPx || { x: to.x, y: Math.max(4, to.y - 70) };
    state.fx.push({ kind: "helix", x0: from.x, y0: from.y, plantId: p.id, x1: to.x, y1: to.y, t: 0, life: 110, trait: T });
    if (state.fx.length > 24) state.fx.shift();
    const rec = { tick: state.lastTick, faction, trait: T, plantId: p.id, form: FORM_NAMES[p.form], col: p.col, genome: genomeHex(g) };
    state.lastEdits.unshift(rec);
    if (state.lastEdits.length > 12) state.lastEdits.length = 12;
    return rec;
  }

  // ==========================================================================
  // 16. WORLD SEEDING & PER-SCREEN PERSISTENCE
  // ==========================================================================
  function seedWorld(r) {
    const w = state.world;
    const L = layerOf();
    const biome = w.currentBiome || "surface";
    const plan = [];
    const add = (form, habitat, n, opts) => { for (let i = 0; i < n; i++) plan.push({ form, habitat, opts: opts || {} }); };
    if (biome === "underwater") {
      add(FORM.SEAFLORA, "sea", 16);
      add(FORM.MOSS, "ground", 4);
      add(FORM.VINE, "ceiling", 6);
    } else if (L < 0) {
      add(FORM.VINE, "ceiling", 12);
      add(FORM.MOSS, "ground", 10);
      add(FORM.SHRUB, "ground", 3, { glow: true });
      add(FORM.WILDFLOWER, "ground", 3, { glow: true });
      add(FORM.SEAFLORA, "sea", 6);
    } else if (L > 0) {
      add(FORM.BONSAI, "ground", 5);
      add(FORM.WILDFLOWER, "ground", 8);
      add(FORM.MOSS, "ground", 5);
      add(FORM.SHRUB, "ground", 3);
      add(FORM.CANOPY, "ground", 2);
      add(FORM.VINE, "island", 6);
      add(FORM.CLOUDKELP, "cloud", 8);
    } else {
      const hasTowns = Array.isArray(w.Towns) && w.Towns.length > 0;
      add(FORM.CANOPY, "ground", 5);
      add(FORM.WILLOW, "ground", 3);
      add(FORM.BONSAI, "ground", 3);
      add(FORM.SHRUB, "ground", 5);
      add(FORM.WILDFLOWER, "ground", 10);
      add(FORM.ORCHARD, "ground", 3, { cultivated: hasTowns });
      add(FORM.ROOTVEG, "ground", 5, { cultivated: hasTowns });
      add(FORM.MOSS, "ground", 8);
      add(FORM.SEAFLORA, "sea", 6);
      add(FORM.CLOUDKELP, "cloud", 3);
    }
    // Trees first so moss can seek their shade
    plan.sort((a, b) => (FORM_INFO[b.form].tree ? 1 : 0) - (FORM_INFO[a.form].tree ? 1 : 0));
    for (const item of plan) {
      let g = null;
      const banked = state.geneBank.filter((b) => b.form === item.form);
      if (banked.length && r() < 0.35) g = cloneGenome(banked[(r() * banked.length) | 0].genome);
      else g = templateGenome(item.form, r, 2);
      if (item.opts.glow) setGene(g, GENE.BIOLUM, 12 + ((r() * 4) | 0));
      if (L < 0) setGene(g, GENE.SHADE_TOL, Math.max(getGene(g, GENE.SHADE_TOL), 11));
      if (item.habitat === "cloud") {
        if (!state.clouds.length) continue;
        const cl = state.clouds[(r() * state.clouds.length) | 0];
        placeSeeded(g, clamp(cl.x | 0, 0, W - 1), "cloud", item, r, cl);
        continue;
      }
      const col = pickColumn(item, r);
      if (col >= 0) placeSeeded(g, col, item.habitat, item, r, null);
    }
  }

  function pickColumn(item, r) {
    const w = state.world;
    let best = -1, bestS = -1e9;
    for (let k = 0; k < 14; k++) {
      const c = 2 + ((r() * (W - 4)) | 0);
      if (!habitatValidAt(c, item.habitat)) continue;
      if (!crowdingOK(c, item.habitat, item.form)) continue;
      let s = r() * 0.3;
      switch (item.form) {
        case FORM.WILLOW: s -= waterDist[c] * 0.1 + groundElev(c) * 0.03; break;
        case FORM.BONSAI: s += groundElev(c) * 0.12; break;
        case FORM.ORCHARD:
        case FORM.ROOTVEG: {
          const fz = farmZoneCenter(c);
          s -= fz >= 0 ? Math.abs(fz - c) * 0.05 : 2;
          break;
        }
        case FORM.MOSS: {
          for (let cc = Math.max(0, c - 4); cc <= Math.min(W - 1, c + 4); cc++) for (const q of buckets[cc]) if (FORM_INFO[q.form].tree) s += 0.5;
          break;
        }
        default: break;
      }
      if (s > bestS) { bestS = s; best = c; }
    }
    return best;
  }

  function placeSeeded(g, col, habitat, item, r, cloud) {
    const info = FORM_INFO[expressedForm(g, habitat)];
    const stage = Math.max(1, Math.round(info.maxStage * (0.5 + r() * 0.5)));
    const p = createPlant(g, col, habitat, { stage, energy: 0.5, cultivated: !!item.opts.cultivated, cloud });
    if (!p) return null;
    buckets[p.col].push(p);
    p.age = stage * 1500;
    if (info.sexual && p.stage >= info.mature) {
      if (r() < 0.5) { p.fruitSet = true; p.ripeness = r(); p.pollen = cloneGenome(p.genome); }
      else if (r() < 0.6) p.bloom = 0.7 + r() * 0.3;
    }
    if (p.form === FORM.ROOTVEG) p.ripeness = r();
    return p;
  }

  function stashWorld() {
    if (!state.worldSig) return;
    state.worldCache.set(state.worldSig, {
      plants: state.plants,
      clouds: state.clouds,
      moist: moist.slice(), gw: gw.slice(), nut: nut.slice(), surf: surf.slice(), stab: stab.slice(),
      W, H,
    });
    if (state.worldCache.size > 24) state.worldCache.delete(state.worldCache.keys().next().value);
  }

  function enterWorld(world) {
    const sig = worldSignature(world);
    const cached = state.worldCache.get(sig);
    state.world = world;
    state.worldSig = sig;
    state.fx.length = 0;
    state.fauna.length = 0;
    pCount = 0;
    const seedHash = (Math.imul((world.worldX | 0) + 7919, 0x9e3779b1) ^ Math.imul((world.worldLayer | 0) + 104729, 0x85ebca6b)) >>> 0;
    const r = mulberry32(seedHash);
    if (cached && cached.W === W && cached.H === H) {
      state.plants = cached.plants;
      state.clouds = cached.clouds;
      moist.set(cached.moist); gw.set(cached.gw); nut.set(cached.nut); surf.set(cached.surf); stab.set(cached.stab);
      computeWaterDist();
      findSpring();
      for (const p of state.plants) if (!reanchor(p)) p.dead = true; else if (p.form === FORM.MOSS) develop(p);
    } else {
      state.plants = [];
      state.clouds = [];
      if (cloudsAllowed()) {
        const n = layerOf() > 0 ? 7 : 4;
        for (let i = 0; i < n; i++) state.clouds.push(makeCloud(r));
      }
      initHydrology(r);
      rebuildOccupancy();
      computeLee();
      propagateLight();
      seedWorld(r);
    }
    rebuildOccupancy();
    computeLee();
    propagateLight();
    computeWindGrid(state.lastTick, true);
    state.drawDirty = true;
  }

  // ==========================================================================
  // 17. PUBLIC: INIT & STEP
  // ==========================================================================
  function init(world) {
    if (!world || !world.Blocks) return api;
    const w = world.Blocks.length | 0 || 120;
    const h = world.H || world.COARSE_H || Math.round(w * 0.625);
    setDims(w, h);
    state.worldCache.clear();
    state.worldSig = "";
    state.ledger = freshLedger();
    updateSun();
    enterWorld(world);
    state.initialized = true;
    return api;
  }

  function step(world, eco, cosmic, tick) {
    if (!world || !world.Blocks) return;
    state.eco = eco || null;
    state.cosmic = cosmic || null;
    const t = typeof tick === "number" ? tick | 0 : state.lastTick + 1;
    state.lastTick = t;
    if (!state.initialized || (world.Blocks.length | 0) !== W) init(world);
    state.world = world;
    const sig = worldSignature(world);
    if (sig !== state.worldSig) {
      stashWorld();
      enterWorld(world);
    }
    const dil = clamp(cosmic && cosmic.timeDilation > 0 ? cosmic.timeDilation : 1, 1, 100);
    state.simTime += dil;
    updateSun();
    updatePrevailing(state.simTime);
    if (t % 30 === 0) computeLee();
    if (t % 2 === 0) computeWindGrid(t, false);
    stepClouds(t, dil);
    if (t % 3 === 0) {
      rebuildOccupancy();
      propagateLight();
    }
    if (t % 4 === 0) stepHydrology(4 * Math.min(dil, 10), t);
    const dt = PHYS_INTERVAL * Math.min(dil, 25);
    const plants = state.plants;
    for (let i = plants.length - 1; i >= 0; i--) {
      const p = plants[i];
      if (p.editFx > 0) p.editFx--;
      if (p.dead) { removePlantAt(i); continue; }
      if ((p.id + t) % PHYS_INTERVAL === 0) physiology(p, dt, t);
    }
    stepParticles(t);
    stepFauna(t);
    if (t % 12 === 0) stepCivilizations(t);
    for (let i = state.fx.length - 1; i >= 0; i--) if (++state.fx[i].t > state.fx[i].life) state.fx.splice(i, 1);
    if (t % 60 === 0) updateStats();
  }

  function updateStats() {
    let f = 0;
    let n = 0;
    for (const p of state.plants) if (!p.dead) { f += p.fitness; n++; }
    state.stats.meanFitness = n ? f / n : 0;
  }

  // ==========================================================================
  // 18. DEVICE-PIXEL RENDERER
  // ==========================================================================
  let R = null;
  let D = null;
  let bgTimer = 0;

  function plot(x, y, r, g, b, a) {
    if (x < 0 || y < 0 || x >= NW || y >= NH || a <= 0.003) return;
    const i = (y * NW + x) << 2;
    if (D[i + 3] === 0) {
      R.fillNativeRect(x, y, 1, 1, r, g, b, a > 1 ? 1 : a);
      return;
    }
    if (a >= 0.999) {
      D[i] = r; D[i + 1] = g; D[i + 2] = b;
      return;
    }
    D[i] = D[i] + (r - D[i]) * a;
    D[i + 1] = D[i + 1] + (g - D[i + 1]) * a;
    D[i + 2] = D[i + 2] + (b - D[i + 2]) * a;
  }

  function updateBgEstimate() {
    if (--bgTimer > 0) return;
    bgTimer = 90;
    try {
      if (typeof document === "undefined" || typeof window === "undefined" || !window.getComputedStyle) return;
      const cv = document.getElementById("pi-shift");
      if (!cv) return;
      const m = window.getComputedStyle(cv).backgroundColor.match(/[\d.]+/g);
      if (m && m.length >= 3) state.bgEst = [+m[0], +m[1], +m[2]];
    } catch (e) {
      /* keep previous estimate */
    }
  }

  function lightAtPx(x, y) {
    const c = (x / SCALE) | 0;
    const e = H - 1 - ((y / SCALE) | 0);
    if (c < 0 || c >= W || e < 0 || e >= H) return 1;
    return lightG[e * W + c];
  }

  function rebuildDrawOrder() {
    state.drawOrder = state.plants.slice().sort((a, b) => {
      const la = FORM_INFO[a.form].layer, lb = FORM_INFO[b.form].layer;
      if (la !== lb) return la - lb;
      return (b.morph ? b.morph.heightPx : 0) - (a.morph ? a.morph.heightPx : 0);
    });
    state.drawDirty = false;
  }

  function renderLightShafts(t) {
    const sun = state.sun;
    if (sun.intensity < 0.15) return;
    const sdx = sun.sdx;
    for (let c = 0; c < W; c++) {
      const h = groundElev(c);
      if (h <= 0 || h >= H - 1) continue;
      if (isSubmerged(c)) {
        // underwater caustic shafts from the surface down to the seabed
        if ((c + (t >> 5)) % 3 !== 0) continue;
        const y0 = (H - seaOf()) * SCALE + 2;
        const y1 = (H - h) * SCALE;
        const sh = 0.5 + 0.5 * Math.sin(t * 0.03 + c * 1.3);
        for (let y = y0; y < y1; y++) {
          const k = (y - y0) / Math.max(1, y1 - y0);
          const x = (c * SCALE + 3 + sdx * (y - y0) * 0.3) | 0;
          plot(x, y, 190, 230, 236, 0.05 * sun.intensity * sh * (1 - k));
        }
        continue;
      }
      const e = h;
      const idx = e * W + c;
      const dl = direct[idx];
      if (dl < 0.45 || skyV[idx] > 0.85) continue;
      let len = 0;
      for (let k = 1; k <= 14; k++) {
        const ee = e + k;
        const cc = Math.round(c + sdx * k);
        if (ee >= H || cc < 0 || cc >= W) break;
        if (occ[ee * W + cc] > 0.25) { len = k; break; }
      }
      if (!len) continue;
      const Lp = len * SCALE;
      const x0 = c * SCALE + 3;
      const y0 = (H - h) * SCALE - 1;
      const shimmer = 0.55 + 0.45 * Math.sin(t * 0.021 + c * 1.7);
      const base = 0.07 * sun.intensity * dl * shimmer;
      for (let k = 0; k < Lp; k++) {
        const x = Math.round(x0 + sdx * k);
        const a = base * (1 - k / Lp);
        plot(x, y0 - k, 255, 238, 200, a);
        if ((k & 1) === 0) plot(x + 1, y0 - k, 255, 238, 200, a * 0.5);
      }
    }
  }

  function renderSoilAndShadows(t) {
    const sunI = state.sun.intensity;
    const sdx = state.sun.sdx;
    for (let c = 0; c < W; c++) {
      const h = groundElev(c);
      if (h <= 0 || h > H) continue;
      const sub = isSubmerged(c);
      const py0 = (H - h) * SCALE;
      const eAir = Math.min(H - 1, h);
      const shadow = 1 - direct[eAir * W + c];
      const m = moist[c];
      const wob = windX[eAir * W + c] * 3;
      for (let yy = 0; yy < 14; yy++) {
        const y = py0 + yy;
        if (y >= NH) break;
        const fall = 1 - yy / 14;
        for (let xx = 0; xx < SCALE; xx++) {
          const x = c * SCALE + xx;
          if (!sub && m > 0.05) plot(x, y, 22, 34, 44, m * 0.13 * (0.4 + 0.6 * fall));
          if (sunI > 0.04 && shadow > 0.04 && yy < 9 && !sub) {
            if (shadow > 0.12 && shadow < 0.9) {
              const d = Math.sin(x * 0.9 + wob + t * 0.01 + sdx * y * 0.2) * Math.sin(y * 1.3 + x * 0.4 - t * 0.013) + 0.5 * Math.sin((x + y) * 0.37 + t * 0.02 + wob);
              if (d > 0.62) { plot(x, y, 255, 236, 196, 0.12 * sunI * fall); continue; }
            }
            plot(x, y, 16, 20, 28, shadow * sunI * 0.34 * fall);
          }
        }
      }
      if (sub) continue;
      // surface water film & river glints flowing downhill
      if (surf[c] > 0.06) {
        const dir = c > 0 && groundElev(c - 1) < h ? -1 : 1;
        const thick = surf[c] > 0.4 ? 2 : 1;
        for (let xx = 0; xx < SCALE; xx++) {
          const x = c * SCALE + xx;
          const glint = ((x * dir + (t >> 1)) & 7) === 0;
          for (let k = 0; k < thick; k++) plot(x, py0 - 1 + k, glint ? 196 : 118, glint ? 220 : 156, glint ? 228 : 176, Math.min(0.75, 0.25 + surf[c]));
        }
      }
      // capillary moisture glints & nutrient specks in the soil
      const glints = (m * 3) | 0;
      for (let k = 0; k < glints; k++) {
        const x = c * SCALE + ((hash2(c, k) * SCALE) | 0);
        const y = py0 + 2 + ((hash2(c, k + 9) * 18) | 0);
        plot(x, y, 140, 176, 196, 0.16 + 0.14 * SINL[(k * 40 + t * 2 + c * 11) & 255]);
      }
      const specks = (nut[c] * 2.5) | 0;
      for (let k = 0; k < specks; k++) {
        plot(c * SCALE + ((hash2(c, k + 40) * SCALE) | 0), py0 + 3 + ((hash2(c, k + 50) * 22) | 0), 188, 150, 96, 0.16);
      }
    }
  }

  function renderClouds(t) {
    if (!state.clouds.length || !cloudsAllowed()) return;
    const sunI = state.sun.intensity;
    const lit = 0.55 + 0.45 * sunI;
    for (const cl of state.clouds) {
      const cx = cl.x * SCALE;
      const cy = (H - cl.y) * SCALE;
      const hw = cl.w * SCALE * 0.5 + 8;
      const top = cy - cl.h * SCALE - 4;
      const bot = cy + cl.h * SCALE * 0.3;
      const x0 = Math.max(0, (cx - hw) | 0), x1 = Math.min(NW - 1, (cx + hw) | 0);
      const y0 = Math.max(0, top | 0), y1 = Math.min(NH - 1, bot | 0);
      const dark = cl.water * 0.45;
      for (let y = y0; y <= y1; y++) {
        const v = (y - top) / Math.max(1, bot - top);
        const r = (234 - (234 - 170) * v) * (1 - dark * v) * lit;
        const g = (236 - (236 - 178) * v) * (1 - dark * v) * lit;
        const b = (232 - (232 - 192) * v) * (1 - dark * v * 0.7) * lit;
        for (let x = x0; x <= x1; x++) {
          let best = 9;
          for (let k = 0; k < cl.puffs.length; k++) {
            const pf = cl.puffs[k];
            const dx = x - (cx + pf.dx), dy = y - (cy + pf.dy);
            const d = (dx * dx + dy * dy) / (pf.rad * pf.rad);
            if (d < best) best = d;
          }
          if (best >= 1) continue;
          if (best > 0.8 && hash2(x, y + (t >> 4)) < 0.5) continue;
          plot(x, y, r | 0, g | 0, b | 0, (0.16 + 0.22 * (1 - best)) * (0.9 + 0.1 * SINL[(x + y * 3 + (t >> 1)) & 255]));
        }
      }
      if (cl.raining) {
        const wx = windXAtPx(cx, bot + 10) * 0.6;
        const drops = (cl.w * 2) | 0;
        for (let k = 0; k < drops; k++) {
          const dxs = (hash2(cl.id, k) - 0.5) * cl.w * SCALE * 0.8;
          const c = clamp(((cx + dxs) / SCALE) | 0, 0, W - 1);
          const ground = Math.min(groundTopPx(c), NH);
          const span = Math.max(8, ground - bot);
          const yy = bot + ((hash2(k, cl.id) * span + t * 4) % span);
          const xx = cx + dxs + wx * (yy - bot) * 0.1;
          for (let s = 0; s < 3; s++) plot((xx - wx * s) | 0, (yy - s) | 0, 150, 170, 190, 0.35 - s * 0.1);
        }
      }
    }
  }

  function renderPlant(p, t) {
    const m = p.morph;
    if (!m || !m.n) return;
    const pal = p.pal;
    const G = p.G;
    const ax = p.ax, ay = p.ay;
    const sun = state.sun;
    const sunSide = sun.sdx >= 0 ? 1 : -1;
    const sunI = sun.intensity;
    const night = 1 - Math.min(1, sunI * 1.6);
    const autumn = FORM_INFO[p.form].deciduous ? sun.autumn : 0;
    const dying = p.dying;
    const hanging = p.habitat === "ceiling" || p.habitat === "island" || p.habitat === "cloud";
    const bg = state.bgEst;
    const tint = pal.tint;
    // spring-damped sway driven by the local wind field (or sea currents)
    const topY = hanging ? ay + m.maxY * 0.7 : ay + m.minY * 0.7;
    let target;
    if (p.habitat === "sea") target = (Math.sin(t * 0.013 + p.col * 0.4) * 0.8 + Math.sin(t * 0.031 + p.id) * 0.3) * 2.6;
    else target = windXAtPx(ax, topY) * (1.5 + m.heightPx * 0.07) * (1 - G[15] * 0.6) * (p.form === FORM.BONSAI ? 0.35 : 1);
    const springK = 0.03 + 0.05 / (1 + m.heightPx * 0.05);
    p.swayV += (target - p.sway) * springK - p.swayV * 0.09;
    p.sway += p.swayV;
    const sway = p.sway;
    const flutter = Math.min(1.2, 0.25 + Math.abs(target) * 0.35);
    const lift = hanging ? -0.22 : 0.22;
    const leaf = pal.leaf, bark = pal.bark;
    const glowK = G[14] * (1 - 0.65 * Math.min(1, sunI * 1.4));
    const bloomOpen = p.bloom * (0.55 + 0.45 * Math.min(1, sunI * 2 + (G[14] > 0.5 ? 0.6 : 0)));
    const pulseBase = (t * 0.8 + p.id * 29) % 96;
    const n = m.n, XS = m.xs, YS = m.ys, TS = m.ts, SS = m.ss, FS = m.fs, PH = m.ph;
    for (let i = 0; i < n; i++) {
      const ty = TS[i];
      let x = ax + XS[i];
      let y = ay + YS[i];
      let r, g, b, a = 1;
      if (ty === PT.ROOT) {
        if (x < 0 || x >= NW || y < 0 || y >= NH) continue;
        const c = (x / SCALE) | 0;
        const wet = moist[c] || 0;
        const s = SS[i];
        a = 0.16 + (3 - s) * 0.07 + wet * 0.1;
        r = 128 + (132 - 128) * wet; g = 112 + (142 - 112) * wet; b = 94 + (146 - 94) * wet;
        if (Math.abs(PH[i] - pulseBase) < 2.5) {
          if (G[14] > 0.5) { r = pal.glow[0]; g = pal.glow[1]; b = pal.glow[2]; } else { r = 196; g = 186; b = 140; }
          a = 0.65;
        }
        if (dying) a *= 1 - dying;
        plot(x, y, r | 0, g | 0, b | 0, a);
        continue;
      }
      if (ty === PT.TUBER) {
        const rip = p.ripeness;
        const tc = pal.tuber;
        const s = SS[i];
        if (PH[i] > 255 * (0.35 + 0.65 * Math.min(1, p.stage / Math.max(1, p.maxStage) + 0.2))) continue;
        r = 206 + (tc[0] - 206) * rip; g = 196 + (tc[1] - 196) * rip; b = 170 + (tc[2] - 170) * rip;
        if (s === 1) { r *= 0.8; g *= 0.8; b *= 0.8; }
        else if (s === 0) { r *= 0.62; g *= 0.6; b *= 0.6; }
        else if (s === 5) { r = r * 0.6 + 90 * 0.4; g = g * 0.6 + 120 * 0.4; b = b * 0.6 + 80 * 0.4; }
        a = YS[i] < 0 ? 1 : 0.9;
        plot(x, y, r | 0, g | 0, b | 0, a * (1 - dying));
        continue;
      }
      const f = FS[i] * (1 / 255);
      const f2 = f * f;
      let dx = sway * f2;
      if (ty === PT.LEAF || ty === PT.PETAL || ty === PT.MOSS) dx += SINL[(PH[i] + t * 4) & 255] * flutter * (0.3 + f);
      x += Math.round(dx);
      y += Math.round(Math.abs(sway) * f2 * lift);
      if (x < 0 || x >= NW || y < 0 || y >= NH) continue;
      if (dying && (ty === PT.LEAF || ty === PT.PETAL) && PH[i] < dying * 255) continue;
      const light = lightAtPx(x, y);
      const lm = 0.42 + 0.58 * light;
      const drip = SINL[((y * 3 - t * 2 + p.huePhase) & 255)];
      switch (ty) {
        case PT.BARK:
        case PT.STEM: {
          if (ty === PT.STEM) {
            const k = clamp(Math.round(6 + drip * 1.6), 0, 23) * 3;
            r = leaf[k]; g = leaf[k + 1]; b = leaf[k + 2];
          } else {
            let k = 9 + (SS[i] - 3) * sunSide * 2.4 * sunI + drip * 1.2 - p.stage * 0.3;
            const ph = PH[i];
            if (ph < 64) k -= 5;
            k = clamp(Math.round(k), 0, 23) * 3;
            r = bark[k]; g = bark[k + 1]; b = bark[k + 2];
            if (ph > 244 && p.stage >= 3) { r = (r + 138) >> 1; g = (g + 150) >> 1; b = (b + 120) >> 1; }
          }
          break;
        }
        case PT.LEAF: {
          const k = clamp(Math.round(SS[i] * 4 + 2 + drip * 1.6 + (light - 0.5) * 6), 0, 23) * 3;
          r = leaf[k]; g = leaf[k + 1]; b = leaf[k + 2];
          if (autumn > 0) {
            const am = autumn * (PH[i] > 128 ? 1 : 0.5);
            r += (RAMP.rust[k] - r) * am; g += (RAMP.rust[k + 1] - g) * am; b += (RAMP.rust[k + 2] - b) * am;
          }
          if (glowK > 0.45 && (PH[i] & 7) === 0) {
            const gl = glowK * (0.6 + 0.4 * drip);
            r += (pal.glow[0] - r) * gl; g += (pal.glow[1] - g) * gl; b += (pal.glow[2] - b) * gl;
          }
          break;
        }
        case PT.MOSS: {
          const k = clamp(Math.round(SS[i] * 5 + 3 + drip * 1.6), 0, 23) * 3;
          r = leaf[k]; g = leaf[k + 1]; b = leaf[k + 2];
          break;
        }
        case PT.SPORO:
          if (SS[i] === 1) {
            if (G[14] > 0.5) { r = pal.glow[0]; g = pal.glow[1]; b = pal.glow[2]; } else { r = 180; g = 150; b = 96; }
          } else { r = 130; g = 110; b = 80; }
          break;
        case PT.PETAL: {
          if (bloomOpen * 8 <= SS[i] + 0.5 || p.fruitSet) continue;
          const pc = pal.petal;
          const v = 1 + drip * 0.06 + (PH[i] & 1 ? 0.04 : -0.04);
          r = pc[0] * v; g = pc[1] * v; b = pc[2] * v;
          break;
        }
        case PT.PISTIL:
          if (p.bloom < 0.3 && !p.fruitSet) continue;
          r = 228; g = 206; b = 142;
          break;
        case PT.GLOW: {
          const pulse = 0.55 + 0.45 * drip;
          const gi = Math.max(G[14], 0.25) * pulse;
          r = pal.glow[0]; g = pal.glow[1]; b = pal.glow[2];
          a = 0.5 + 0.5 * gi;
          if (gi > 0.4 && glowK > 0.3) {
            const ha = 0.14 * gi;
            plot(x - 1, y, r, g, b, ha); plot(x + 1, y, r, g, b, ha); plot(x, y - 1, r, g, b, ha); plot(x, y + 1, r, g, b, ha);
          }
          plot(x, y, r, g, b, a);
          continue;
        }
        default:
          continue;
      }
      // shared lighting, night cooling, lineage tint, sky harmonization & wilting
      r = (r + tint[0]) * lm; g = (g + tint[1]) * lm; b = (b + tint[2]) * lm;
      if (night > 0) { r *= 1 - 0.18 * night; g *= 1 - 0.1 * night; b *= 1 + 0.04 * night; }
      r = r * 0.88 + bg[0] * 0.12 * lm; g = g * 0.88 + bg[1] * 0.12 * lm; b = b * 0.88 + bg[2] * 0.12 * lm;
      if (dying > 0) { r += (STRAW[0] * lm - r) * dying; g += (STRAW[1] * lm - g) * dying; b += (STRAW[2] * lm - b) * dying; }
      if (p.editFx > 0 && ((PH[i] + t * 3) & 31) < 3) {
        const tc = TRAIT_COLORS[p.edited] || TRAIT_COLORS.random;
        const k2 = p.editFx / 120;
        r += (tc[0] - r) * k2; g += (tc[1] - g) * k2; b += (tc[2] - b) * k2;
      }
      plot(x, y, r | 0, g | 0, b | 0, a);
    }
    // ripening fruit & berries
    if (m.fruits.length && p.fruitSet && !p.dying) {
      const rip = p.ripeness;
      const sm = rip * rip * (3 - 2 * rip);
      const fc = pal.fruit;
      for (const fr of m.fruits) {
        const f2 = fr.flex * fr.flex;
        const x = Math.round(ax + fr.x + sway * f2 + SINL[(fr.ph + t * 2) & 255] * 0.4);
        const y = Math.round(ay + fr.y + Math.abs(sway) * f2 * lift);
        const lm = 0.45 + 0.55 * lightAtPx(x, y);
        let r = (UNRIPE[0] + (fc[0] - UNRIPE[0]) * sm) * lm;
        let g = (UNRIPE[1] + (fc[1] - UNRIPE[1]) * sm) * lm;
        let b = (UNRIPE[2] + (fc[2] - UNRIPE[2]) * sm) * lm;
        if (G[14] > 0.5 && glowK > 0.3) { r = pal.glow[0]; g = pal.glow[1]; b = pal.glow[2]; }
        const size = fr.size * (0.35 + 0.65 * Math.min(1, rip * 1.4));
        plot(x, y - 1, 90, 80, 60, 0.6);
        if (size < 1.4) {
          plot(x, y, r | 0, g | 0, b | 0, 1);
        } else if (size < 2.2) {
          plot(x, y, r | 0, g | 0, b | 0, 1); plot(x + 1, y, r * 0.85 | 0, g * 0.85 | 0, b * 0.85 | 0, 1);
          plot(x, y + 1, r * 0.8 | 0, g * 0.8 | 0, b * 0.8 | 0, 1); plot(x + 1, y + 1, r * 0.7 | 0, g * 0.7 | 0, b * 0.7 | 0, 1);
        } else {
          for (let oy = 0; oy < 3; oy++) for (let ox = -1; ox <= 1; ox++) {
            if (oy !== 1 && ox !== 0 && (oy === 0 || oy === 2)) continue;
            const sh = 1 - oy * 0.12 - (ox * sunSide < 0 ? 0.1 : 0);
            plot(x + ox, y + oy, r * sh | 0, g * sh | 0, b * sh | 0, 1);
          }
        }
        if (rip > 0.6) plot(x - (sunSide < 0 ? 0 : 0), y, Math.min(255, r * 1.35) | 0, Math.min(255, g * 1.3) | 0, Math.min(255, b * 1.25) | 0, 0.7);
      }
    }
  }

  function renderParticles(t) {
    const night = !state.sun.isDay;
    for (let i = 0; i < pCount; i++) {
      const x = P_X[i] | 0, y = P_Y[i] | 0;
      switch (P_KIND[i]) {
        case PK.POLLEN:
          plot(x, y, 228, 206, 142, 0.7 + 0.25 * SINL[(i * 13 + t * 6) & 255]);
          break;
        case PK.SEED:
          plot(x, y, 196, 178, 140, 0.95);
          if (P_AUX[i] & 1) { plot(x, y - 1, 232, 228, 218, 0.6); plot(x - 1, y - 1, 232, 228, 218, 0.3); plot(x + 1, y - 1, 232, 228, 218, 0.3); }
          break;
        case PK.SPORE: {
          const glow = ((P_GHI[i] >>> ((GENE.BIOLUM - 8) << 2)) & 15) > 9;
          if (glow && (night || layerOf() < 0)) plot(x, y, 130, 236, 214, 0.55 + 0.35 * SINL[(i * 7 + t * 5) & 255]);
          else plot(x, y, 160, 204, 186, 0.6);
          break;
        }
        case PK.LITTER: {
          const k = P_AUX[i] * 3;
          const ramp = state.sun.autumn > 0.3 ? RAMP.rust : RAMP.olive;
          plot(x, y, ramp[k], ramp[k + 1], ramp[k + 2], 0.9);
          if ((t + i) & 8) plot(x + 1, y, ramp[k], ramp[k + 1], ramp[k + 2], 0.6);
          break;
        }
        case PK.DROP:
          plot(x, y, 150, 180, 200, 0.6);
          plot(x, y - 1, 150, 180, 200, 0.3);
          break;
        case PK.SPARK:
          plot(x, y, 236, 206, 130, Math.min(1, P_LIFE[i] / 40));
          break;
        case PK.SOIL:
          plot(x, y, 96, 78, 62, 0.8);
          break;
        default:
          break;
      }
    }
  }

  function renderFauna(t) {
    for (const b of state.fauna) {
      const x = b.x | 0, y = b.y | 0;
      const flap = SINL[((t * 40 + b.phase * 40) | 0) & 255] > 0;
      if (b.kind === "bee") {
        plot(x, y, 70, 60, 48, 1);
        plot(x + 1, y, 206, 170, 96, 0.9);
        plot(x, y - 1, 220, 226, 230, flap ? 0.55 : 0.2);
      } else {
        const pulse = 0.5 + 0.5 * SINL[((t * 3 + b.phase * 50) | 0) & 255];
        const c = b.kind === "firefly" ? [214, 230, 140] : [150, 220, 236];
        plot(x, y, 60, 56, 52, 0.8);
        plot(x, y + 1, c[0], c[1], c[2], 0.4 + 0.6 * pulse);
        if (pulse > 0.7) { plot(x - 1, y + 1, c[0], c[1], c[2], 0.2); plot(x + 1, y + 1, c[0], c[1], c[2], 0.2); }
        plot(x - 1, y, 200, 200, 210, flap ? 0.35 : 0.1);
      }
    }
  }

  function renderFx(t) {
    for (const fx of state.fx) {
      if (fx.kind !== "helix") continue;
      let x1 = fx.x1, y1 = fx.y1;
      for (const p of state.plants) if (p.id === fx.plantId && p.morph) { x1 = p.ax + (p.morph.minX + p.morph.maxX) * 0.5; y1 = p.ay + (p.morph.minY + p.morph.maxY) * 0.5; break; }
      const dx = x1 - fx.x0, dy = y1 - fx.y0;
      const len = Math.max(1, Math.sqrt(dx * dx + dy * dy));
      const nx = -dy / len, ny = dx / len;
      const prog = fx.t / fx.life;
      const reach = Math.min(1, prog * 1.6);
      const fade = 1 - Math.max(0, prog - 0.6) / 0.4;
      const ca = TRAIT_COLORS[fx.trait] || TRAIT_COLORS.random;
      const N = (len * reach) | 0;
      for (let k = 0; k <= N; k++) {
        const u = k / len;
        const bx = fx.x0 + dx * u, by = fx.y0 + dy * u;
        const s = Math.sin(k * 0.35 - t * 0.25) * 3;
        plot(Math.round(bx + nx * s), Math.round(by + ny * s), ca[0], ca[1], ca[2], 0.75 * fade);
        plot(Math.round(bx - nx * s), Math.round(by - ny * s), 230, 232, 236, 0.6 * fade);
        if (k % 4 === 0) {
          const steps = Math.abs(s) | 0;
          for (let j = -steps + 1; j < steps; j++) plot(Math.round(bx + nx * j), Math.round(by + ny * j), ca[0], ca[1], ca[2], 0.22 * fade);
        }
      }
      if (prog > 0.5) {
        const rad = 3 + (prog - 0.5) * 24;
        for (let k = 0; k < 16; k++) {
          const ang = (k / 16) * TAU + t * 0.05;
          plot(Math.round(x1 + Math.cos(ang) * rad), Math.round(y1 + Math.sin(ang) * rad * 0.7), ca[0], ca[1], ca[2], 0.5 * fade);
        }
      }
    }
  }

  function render(primeRenderer, world, eco, cosmic, tick) {
    if (!primeRenderer || !primeRenderer.data || !world || !world.Blocks) return;
    const cw = primeRenderer.COARSE_W || world.Blocks.length;
    const ch = primeRenderer.COARSE_H || Math.round(cw * 0.625);
    if (!state.initialized || cw !== W || ch !== H) {
      setDims(cw, ch);
      state.initialized = false;
      init(Object.assign({}, world, { H: ch, Blocks: world.Blocks }));
      state.world = world;
    }
    if (eco) state.eco = eco;
    if (cosmic) state.cosmic = cosmic;
    R = primeRenderer;
    D = primeRenderer.data;
    const t = typeof tick === "number" ? tick | 0 : state.lastTick;
    updateBgEstimate();
    if (state.drawDirty) rebuildDrawOrder();
    renderLightShafts(t);
    renderSoilAndShadows(t);
    const order = state.drawOrder;
    for (let i = 0; i < order.length; i++) if (!order[i].dead && order[i].form !== FORM.CLOUDKELP) renderPlant(order[i], t);
    for (let i = 0; i < order.length; i++) if (!order[i].dead && order[i].form === FORM.CLOUDKELP) renderPlant(order[i], t);
    renderClouds(t);
    renderParticles(t);
    renderFauna(t);
    renderFx(t);
  }

  // ==========================================================================
  // 19. PUBLIC QUERIES & CIVILIZATION HOOK
  // ==========================================================================
  function getShadowFactorAt(col, y) {
    const c = clamp(Math.round(col), 0, W - 1);
    const e = Math.floor(y);
    if (e >= H) return 0;
    if (e < 0) return 1;
    return clamp(1 - direct[e * W + c], 0, 1);
  }

  function getLightAt(col, y) {
    const c = clamp(Math.round(col), 0, W - 1);
    const e = clamp(Math.floor(y), 0, H - 1);
    return lightG[e * W + c];
  }

  function getWindAt(col, y, tick) {
    const t = typeof tick === "number" ? tick : state.simTime;
    const w = computeWind(col, y, t);
    return { x: w.x, y: w.y, speed: w.speed, gust: w.gust, turbulence: w.turbulence, shear: w.shear, wake: w.wake };
  }

  function getMoistureAt(col) {
    const c = clamp(Math.round(col), 0, W - 1);
    return { moisture: moist[c], groundwater: gw[c], nutrients: nut[c], surfaceWater: surf[c], stability: stab[c], erosion: erosion[c] };
  }

  function onCivilizationEditGenome(x, trait, world, faction) {
    const w = world || state.world;
    if (!w || !w.Blocks) return { ok: false, message: "no world" };
    if (!state.initialized) init(w);
    const col = clamp(Math.round(x), 0, W - 1);
    const fac = FACTIONS.indexOf(faction) >= 0 ? faction : "CIVILIZATION";
    let p = nearestPlant(col, 8);
    if (!p) {
      const T = normalizeTrait(trait);
      const form = T === "yield" ? FORM.ORCHARD : T === "timber" ? FORM.CANOPY : T === "drought" ? FORM.BONSAI : T === "shade" ? FORM.MOSS : T === "flower" ? FORM.WILDFLOWER : FORM.SHRUB;
      const habitat = isSubmerged(col) ? "sea" : layerOf() < 0 && !habitatValidAt(col, "ground") ? "ceiling" : "ground";
      p = trySow(templateGenome(form, rng, 1), col, habitat, { force: true, cultivated: true, faction: fac, stage: 1 });
      if (!p) return { ok: false, message: `no viable site near x=${col}` };
    }
    const rec = applyEdit(p, trait, fac, { x: col * SCALE + 3, y: Math.max(4, (H - groundElev(col)) * SCALE - 60) });
    return {
      ok: true,
      plantId: p.id,
      form: FORM_NAMES[p.form],
      trait: rec.trait,
      genome: rec.genome,
      generation: p.gen,
      message: `Spliced ${rec.trait} into ${FORM_NAMES[p.form]} #${p.id} at x=${p.col} -> genome 0x${rec.genome}`,
    };
  }

  function sowAt(x, formName, opts) {
    if (!state.world) return null;
    const form = typeof formName === "number" ? formName : Math.max(0, FORM_NAMES.indexOf(String(formName || "").toUpperCase()));
    const col = clamp(Math.round(x), 0, W - 1);
    const habitat = form === FORM.SEAFLORA ? "sea" : form === FORM.VINE ? (layerOf() > 0 ? "island" : "ceiling") : form === FORM.CLOUDKELP ? "cloud" : "ground";
    let cloud = null;
    if (habitat === "cloud") {
      let bd = 1e9;
      for (const cl of state.clouds) { const d = Math.abs(cl.x - col); if (d < bd) { bd = d; cloud = cl; } }
      if (!cloud) return null;
    }
    const p = trySow(templateGenome(form, rng, 1), col, habitat, Object.assign({ force: true, cloud }, opts || {}));
    return p ? { id: p.id, form: FORM_NAMES[p.form], col: p.col, genome: genomeHex(p.genome) } : null;
  }

  function getPlants() {
    return state.plants.map((p) => ({
      id: p.id, form: FORM_NAMES[p.form], habitat: p.habitat, col: p.col, stage: p.stage, maxStage: p.maxStage,
      gen: p.gen, fitness: +p.fitness.toFixed(3), energy: +p.energy.toFixed(3), health: +p.health.toFixed(3),
      bloom: +p.bloom.toFixed(2), ripeness: +p.ripeness.toFixed(2), cultivated: p.cultivated, edited: p.edited,
      genome: genomeHex(p.genome), pixels: p.morph ? p.morph.n : 0,
    }));
  }

  function getStatus() {
    const byForm = {};
    for (const nm of FORM_NAMES) byForm[nm] = 0;
    const alleles = new Float64Array(16);
    let best = null;
    let live = 0;
    for (const p of state.plants) {
      if (p.dead) continue;
      live++;
      byForm[FORM_NAMES[p.form]]++;
      for (let i = 0; i < 16; i++) alleles[i] += getGene(p.genome, i);
      if (!best || p.fitness > best.fitness) best = p;
    }
    const alleleMeans = {};
    for (let i = 0; i < 16; i++) alleleMeans[GENE_NAMES[i]] = live ? +(alleles[i] / live).toFixed(2) : 0;
    let pollen = 0, seeds = 0, spores = 0;
    for (let i = 0; i < pCount; i++) {
      if (P_KIND[i] === PK.POLLEN) pollen++;
      else if (P_KIND[i] === PK.SEED) seeds++;
      else if (P_KIND[i] === PK.SPORE) spores++;
    }
    let mm = 0, gg = 0, nn = 0, ss = 0, rivers = 0, er = 0, land = 0;
    for (let c = 0; c < W; c++) {
      if (isSubmerged(c) || groundElev(c) <= 0) continue;
      land++;
      mm += moist[c]; gg += gw[c]; nn += nut[c]; ss += stab[c]; er += erosion[c];
      if (surf[c] > 0.15) rivers++;
    }
    const ld = Math.max(1, land);
    return {
      version: VERSION,
      dims: { W, H, SCALE, NATIVE_W: NW, NATIVE_H: NH },
      world: state.worldSig,
      simTime: state.simTime,
      plants: live,
      byForm,
      generationMax: state.stats.generationMax,
      meanFitness: +state.stats.meanFitness.toFixed(3),
      evolution: {
        mutations: state.stats.mutations, crossovers: state.stats.crossovers, hybrids: state.stats.hybrids,
        pollinations: state.stats.pollinations, germinations: state.stats.germinations, deaths: state.stats.deaths,
        seedsReleased: state.stats.seedsReleased, sporesReleased: state.stats.sporesReleased, emigrants: state.stats.emigrants,
        geneBank: state.geneBank.length, alleleMeans,
        fittest: best ? { id: best.id, form: FORM_NAMES[best.form], fitness: +best.fitness.toFixed(3), genome: genomeHex(best.genome), gen: best.gen } : null,
      },
      particles: { total: pCount, pollen, seeds, spores },
      fauna: state.fauna.length,
      sun: {
        dayPhase: +state.sun.dayPhase.toFixed(3), angleDeg: +(state.sun.theta / DEG).toFixed(1), intensity: +state.sun.intensity.toFixed(3),
        isDay: state.sun.isDay, season: state.sun.season,
      },
      wind: { prevailing: +state.wind.prevailing.toFixed(3), gustiness: +state.wind.gustiness.toFixed(3), structuresCastingWakes: state.structures.length },
      hydrology: {
        meanMoisture: +(mm / ld).toFixed(3), meanGroundwater: +(gg / ld).toFixed(3), meanNutrient: +(nn / ld).toFixed(3),
        meanStability: +(ss / ld).toFixed(3), erosionRisk: +(er / ld).toFixed(4), riverColumns: rivers, springCol,
        clouds: state.clouds.length, raining: state.clouds.filter((c) => c.raining).length,
      },
      civilizations: JSON.parse(JSON.stringify(state.ledger)),
      seedVault: state.seedVault.length,
      lastEdits: state.lastEdits.slice(),
    };
  }

  function reset() {
    state.initialized = false;
    state.worldCache.clear();
    state.plants = [];
    state.clouds = [];
    state.geneBank = [];
    state.seedVault = [];
    state.lastEdits = [];
    state.ledger = freshLedger();
    pCount = 0;
  }

  const api = {
    VERSION,
    SCALE,
    FORM,
    FORM_NAMES,
    GENE,
    GENE_NAMES,
    get COARSE_W() { return W; },
    get COARSE_H() { return H; },
    init,
    step,
    render,
    onCivilizationEditGenome,
    getShadowFactorAt,
    getLightAt,
    getWindAt,
    getMoistureAt,
    getStatus,
    getPlants,
    sowAt,
    reset,
    genomeHex,
    genomeFromHex,
    templateGenome: (form, seed) => templateGenome(form, seed !== undefined ? mulberry32(seed) : rng, 2),
    crossover: (a, b) => crossover(a, b, rng),
    mutate: (g, rate) => mutate(cloneGenome(g), rate === undefined ? 0.05 : rate, rng),
    state,
  };

  global.SlopesGeneticFlora = api;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : this);
