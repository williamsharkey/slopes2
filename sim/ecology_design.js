/* ============================================================================
 * SLOPES 2 — ECOLOGICAL AI, MULTI-SCALE PRIME PIXEL ENGINE & SEER CROW ORACLE
 * Reference & Drop-In Architecture Module (/sim/ecology_design.js)
 *
 * Implements:
 *  1. MULTI-SCALE PRIME SUB-PIXEL RENDERING ENGINE (1x1, 2x2, 3x3, 5x5, 7x7):
 *     - Coarse world grid: W = 120, H = 75
 *     - Native framebuffer: 840 x 525 (SCALE = 7 hardware pixels per coarse cell)
 *     - Zero-allocation O(1) lookup-table primitives on the 840x525 ImageData:
 *       * coarsePix(x, y, r, g, b, a)        -> 1x1 coarse cell = 7x7 native pixels
 *       * subPix2(cx, cy, sx, sy, c, a)      -> 2x2 sub-grid ([4,3]x[4,3]) for color-cycling Ferns, moss & small critters
 *       * subPix3(cx, cy, sx, sy, c, a)      -> 3x3 sub-grid ([2,3,2]x[2,3,2]) for Orange People, Children, Skeksis, Webs & Seer Crows
 *       * subPix5(cx, cy, sx, sy, c, a)      -> 5x5 sub-grid ([1,2,1,2,1]^2) for Lipid-Membrane Roaming Automata & Vat I/O Ports
 *       * subPix7(cx, cy, sx, sy, c, a)      -> 7x7 prime sub-grid (exact 1x1 native pixel) for Compute Vat CA & fine particles
 *
 *  2. HYPER-INTELLIGENT SEER CROWS (Corvus Oracle AI):
 *     - Forward-simulating rollout evaluator: evaluateWorldThreatsAndOpportunities()
 *     - 4 distinct intelligent behaviors with clear visual cues:
 *       * OMEN_CIRCLE    : Circling above a nascent Black Goo outbreak or Skeksis ambush before it strikes
 *       * VAT_CATALYST   : Plucking a 2x2 color-cycling fern spore / crystal mote & dropping it into a Compute Vat's IN port
 *       * WEB_SEVER      : High-speed swoop to slice sticky Black Goo webs snaring a child or forest critter
 *       * GUIDE_MONOLITH : Landing near the player's Monolith, hopping twice toward a critical objective, & calling harmonically
 *
 *  3. VISUAL LEGIBILITY & ECOLOGICAL SIMULATION:
 *     - Orange People & Children (3x3): emerging from cottages, carrying resources, grading steep slopes into flat terraces,
 *       building new cottages & Compute Vats, and shielding children.
 *     - Skeksis Bird-Cultists & Black Goo Webs (3x3 & 7x7): dark purple-crimson beaked cultists & creeping black-violet
 *       cancerous cells spinning sticky catenary webs that snare children/fauna and siphon golden-cyan soul-light.
 *     - Town Compute Vats / Server Lakes (1x1 frame + 5x5 IN/OUT ports + live 7x7 Belousov-Zhabotinsky CA substrate):
 *       accept catalyst spores at left IN port, run live 7x7 cellular automata with a crisp progress bar, and birth
 *       5x5/7x7 Permeable Lipid-Membrane Roaming Automata from the right OUT port when computation completes.
 * ============================================================================ */

(function (global) {
  "use strict";

  const COARSE_W = 144;
  const COARSE_H = 90;
  const SCALE = 7;
  const NATIVE_W = COARSE_W * SCALE; // 1008
  const NATIVE_H = COARSE_H * SCALE; // 630

  // ==========================================================================
  // 1. MULTI-SCALE PRIME SUB-PIXEL PARTITION TABLES (Zero-Division O(1) LUTs)
  // ==========================================================================
  // Inside each 7x7 coarse pixel cell:
  //  - 2x2 sub-grid: spans [4, 3]         (4 + 3 = 7)
  //  - 3x3 sub-grid: spans [2, 3, 2]      (2 + 3 + 2 = 7, symmetric)
  //  - 5x5 sub-grid: spans [1, 2, 1, 2, 1](1 + 2 + 1 + 2 + 1 = 7, symmetric)
  //  - 7x7 sub-grid: spans [1,1,1,1,1,1,1](exact 1x1 native pixel in 840x525)
  const SUB2_OFF  = [0, 4];
  const SUB2_SPAN = [4, 3];

  const SUB3_OFF  = [0, 2, 5];
  const SUB3_SPAN = [2, 3, 2];

  const SUB5_OFF  = [0, 1, 3, 4, 6];
  const SUB5_SPAN = [1, 2, 1, 2, 1];

  const SUB2_W = COARSE_W * 2; // 240
  const SUB2_H = COARSE_H * 2; // 150
  const MAP2_OFF_X  = new Int16Array(SUB2_W);
  const MAP2_SPAN_X = new Uint8Array(SUB2_W);
  const MAP2_OFF_Y  = new Int16Array(SUB2_H);
  const MAP2_SPAN_Y = new Uint8Array(SUB2_H);

  for (let i = 0; i < SUB2_W; i++) {
    const cell = i >> 1;
    const rem = i & 1;
    MAP2_OFF_X[i]  = cell * SCALE + SUB2_OFF[rem];
    MAP2_SPAN_X[i] = SUB2_SPAN[rem];
  }
  for (let i = 0; i < SUB2_H; i++) {
    const cell = i >> 1;
    const rem = i & 1;
    MAP2_OFF_Y[i]  = cell * SCALE + SUB2_OFF[rem];
    MAP2_SPAN_Y[i] = SUB2_SPAN[rem];
  }

  const SUB3_W = COARSE_W * 3; // 360
  const SUB3_H = COARSE_H * 3; // 225
  const MAP3_OFF_X  = new Int16Array(SUB3_W);
  const MAP3_SPAN_X = new Uint8Array(SUB3_W);
  const MAP3_OFF_Y  = new Int16Array(SUB3_H);
  const MAP3_SPAN_Y = new Uint8Array(SUB3_H);

  for (let i = 0; i < SUB3_W; i++) {
    const cell = (i / 3) | 0;
    const rem = i - cell * 3;
    MAP3_OFF_X[i]  = cell * SCALE + SUB3_OFF[rem];
    MAP3_SPAN_X[i] = SUB3_SPAN[rem];
  }
  for (let i = 0; i < SUB3_H; i++) {
    const cell = (i / 3) | 0;
    const rem = i - cell * 3;
    MAP3_OFF_Y[i]  = cell * SCALE + SUB3_OFF[rem];
    MAP3_SPAN_Y[i] = SUB3_SPAN[rem];
  }

  const SUB5_W = COARSE_W * 5; // 600
  const SUB5_H = COARSE_H * 5; // 375
  const MAP5_OFF_X  = new Int16Array(SUB5_W);
  const MAP5_SPAN_X = new Uint8Array(SUB5_W);
  const MAP5_OFF_Y  = new Int16Array(SUB5_H);
  const MAP5_SPAN_Y = new Uint8Array(SUB5_H);

  for (let i = 0; i < SUB5_W; i++) {
    const cell = (i / 5) | 0;
    const rem = i - cell * 5;
    MAP5_OFF_X[i]  = cell * SCALE + SUB5_OFF[rem];
    MAP5_SPAN_X[i] = SUB5_SPAN[rem];
  }
  for (let i = 0; i < SUB5_H; i++) {
    const cell = (i / 5) | 0;
    const rem = i - cell * 5;
    MAP5_OFF_Y[i]  = cell * SCALE + SUB5_OFF[rem];
    MAP5_SPAN_Y[i] = SUB5_SPAN[rem];
  }

  // Detect little-endian byte order once for 32-bit Uint32Array fast pixel writes
  const IS_LITTLE_ENDIAN = (() => {
    const buf = new ArrayBuffer(4);
    const u8 = new Uint8Array(buf);
    const u32 = new Uint32Array(buf);
    u32[0] = 0x0a0b0c0d;
    return u8[0] === 0x0d;
  })();

  // ==========================================================================
  // CREATE PRIME SUB-PIXEL RENDERER (840 x 525 Framebuffer)
  // ==========================================================================
  function createPrimeRenderer(ctx, getCachedBgRgb) {
    const screen = ctx.createImageData(NATIVE_W, NATIVE_H);
    const data = screen.data;
    const u32 = new Uint32Array(data.buffer);

    function pack32(r, g, b) {
      const rc = r < 0 ? 0 : r > 255 ? 255 : r | 0;
      const gc = g < 0 ? 0 : g > 255 ? 255 : g | 0;
      const bc = b < 0 ? 0 : b > 255 ? 255 : b | 0;
      return IS_LITTLE_ENDIAN
        ? ((255 << 24) | (bc << 16) | (gc << 8) | rc) >>> 0
        : ((rc << 24) | (gc << 16) | (bc << 8) | 255) >>> 0;
    }

    // Core zero-allocation rectangle writer in 840x525 native pixel space
    function fillNativeRect(px0, py0, pw, ph, r, g, b, a) {
      if (px0 < 0) { pw += px0; px0 = 0; }
      if (py0 < 0) { ph += py0; py0 = 0; }
      if (px0 + pw > NATIVE_W) pw = NATIVE_W - px0;
      if (py0 + ph > NATIVE_H) ph = NATIVE_H - py0;
      if (pw <= 0 || ph <= 0) return;

      if (a === undefined) a = 1;
      if (a <= 0) return;

      // Fast path for opaque pixels: 32-bit word stores
      if (a >= 0.999) {
        const col32 = pack32(r, g, b);
        let rowIdx = py0 * NATIVE_W + px0;
        for (let dy = 0; dy < ph; dy++) {
          for (let dx = 0; dx < pw; dx++) {
            u32[rowIdx + dx] = col32;
          }
          rowIdx += NATIVE_W;
        }
        return;
      }

      // Translucent blend path (matches pi-shift sky background blending)
      const bgRgb = getCachedBgRgb ? getCachedBgRgb() : [72, 160, 148];
      const bgR = bgRgb[0];
      const bgG = bgRgb[1];
      const bgB = bgRgb[2];
      const invA = 1 - a;
      const ra = r * a;
      const ga = g * a;
      const ba = b * a;

      let rowByteIdx = (py0 * NATIVE_W + px0) << 2;
      const stride = NATIVE_W << 2;
      for (let dy = 0; dy < ph; dy++) {
        let idx = rowByteIdx;
        for (let dx = 0; dx < pw; dx++) {
          const isEmptySky = data[idx + 3] === 0;
          const baseR = isEmptySky ? bgR : data[idx];
          const baseG = isEmptySky ? bgG : data[idx + 1];
          const baseB = isEmptySky ? bgB : data[idx + 2];
          data[idx]     = (ra + baseR * invA) | 0;
          data[idx + 1] = (ga + baseG * invA) | 0;
          data[idx + 2] = (ba + baseB * invA) | 0;
          data[idx + 3] = 255;
          idx += 4;
        }
        rowByteIdx += stride;
      }
    }

    // 1x1 Coarse Cell = 7x7 Native Screen Pixels
    function coarsePix(x, y, r, g, b, a) {
      const cx = Math.floor(x);
      const cy = Math.floor(y);
      if (cx < 0 || cx >= COARSE_W || cy < 0 || cy >= COARSE_H) return;
      fillNativeRect(cx * SCALE, cy * SCALE, SCALE, SCALE, r, g, b, a);
    }

    function coarsePixc(x, y, c, a) {
      coarsePix(x, y, c[0], c[1], c[2], a);
    }

    function coarseRect(x, y, w, h, c, a) {
      const x0 = Math.max(0, Math.floor(x));
      const y0 = Math.max(0, Math.floor(y));
      const x1 = Math.min(COARSE_W, Math.floor(x + w));
      const y1 = Math.min(COARSE_H, Math.floor(y + h));
      if (x1 <= x0 || y1 <= y0) return;
      fillNativeRect(
        x0 * SCALE,
        y0 * SCALE,
        (x1 - x0) * SCALE,
        (y1 - y0) * SCALE,
        c[0],
        c[1],
        c[2],
        a
      );
    }

    // 2x2 Sub-Grid inside coarse cell (cx, cy) -> for Ferns, moss & small critters
    // Supports both (cx, cy, sx, sy, [r,g,b], a) and zero-alloc (cx, cy, sx, sy, r, g, b, a)
    function subPix2(cx, cy, sx, sy, cOrR, aOrG, b, a) {
      const gsx = Math.floor(cx * 2 + sx);
      const gsy = Math.floor(cy * 2 + sy);
      if (gsx < 0 || gsx >= SUB2_W || gsy < 0 || gsy >= SUB2_H) return;
      if (typeof cOrR === "number") {
        fillNativeRect(
          MAP2_OFF_X[gsx],
          MAP2_OFF_Y[gsy],
          MAP2_SPAN_X[gsx],
          MAP2_SPAN_Y[gsy],
          cOrR,
          aOrG,
          b,
          a
        );
      } else {
        fillNativeRect(
          MAP2_OFF_X[gsx],
          MAP2_OFF_Y[gsy],
          MAP2_SPAN_X[gsx],
          MAP2_SPAN_Y[gsy],
          cOrR[0],
          cOrR[1],
          cOrR[2],
          aOrG
        );
      }
    }

    // 3x3 Sub-Grid inside coarse cell (cx, cy) -> for Orange People, Children, Skeksis, Webs & Seer Crows
    function subPix3(cx, cy, sx, sy, cOrR, aOrG, b, a) {
      const gsx = Math.floor(cx * 3 + sx);
      const gsy = Math.floor(cy * 3 + sy);
      if (gsx < 0 || gsx >= SUB3_W || gsy < 0 || gsy >= SUB3_H) return;
      if (typeof cOrR === "number") {
        fillNativeRect(
          MAP3_OFF_X[gsx],
          MAP3_OFF_Y[gsy],
          MAP3_SPAN_X[gsx],
          MAP3_SPAN_Y[gsy],
          cOrR,
          aOrG,
          b,
          a
        );
      } else {
        fillNativeRect(
          MAP3_OFF_X[gsx],
          MAP3_OFF_Y[gsy],
          MAP3_SPAN_X[gsx],
          MAP3_SPAN_Y[gsy],
          cOrR[0],
          cOrR[1],
          cOrR[2],
          aOrG
        );
      }
    }

    // 5x5 Sub-Grid inside coarse cell (cx, cy) -> for Permeable Lipid-Membrane Automata & Vat I/O Ports
    function subPix5(cx, cy, sx, sy, cOrR, aOrG, b, a) {
      const gsx = Math.floor(cx * 5 + sx);
      const gsy = Math.floor(cy * 5 + sy);
      if (gsx < 0 || gsx >= SUB5_W || gsy < 0 || gsy >= SUB5_H) return;
      if (typeof cOrR === "number") {
        fillNativeRect(
          MAP5_OFF_X[gsx],
          MAP5_OFF_Y[gsy],
          MAP5_SPAN_X[gsx],
          MAP5_SPAN_Y[gsy],
          cOrR,
          aOrG,
          b,
          a
        );
      } else {
        fillNativeRect(
          MAP5_OFF_X[gsx],
          MAP5_OFF_Y[gsy],
          MAP5_SPAN_X[gsx],
          MAP5_SPAN_Y[gsy],
          cOrR[0],
          cOrR[1],
          cOrR[2],
          aOrG
        );
      }
    }

    // 7x7 Prime Sub-Grid inside coarse cell (cx, cy) = exact 1x1 native pixel in 840x525
    function subPix7(cx, cy, sx, sy, cOrR, aOrG, b, a) {
      const px = Math.floor(cx * SCALE + sx);
      const py = Math.floor(cy * SCALE + sy);
      if (px < 0 || px >= NATIVE_W || py < 0 || py >= NATIVE_H) return;
      if (typeof cOrR === "number") {
        fillNativeRect(px, py, 1, 1, cOrR, aOrG, b, a);
      } else {
        fillNativeRect(px, py, 1, 1, cOrR[0], cOrR[1], cOrR[2], aOrG);
      }
    }

    // Bresenham 1x1 native pixel line in 840x525 (for glistening web silk, beak slashes, omen rays)
    function nativeLine7(px0, py0, px1, py1, r, g, b, a, stepSkip) {
      let x0 = Math.round(px0);
      let y0 = Math.round(py0);
      const x1 = Math.round(px1);
      const y1 = Math.round(py1);
      const dx = Math.abs(x1 - x0);
      const dy = -Math.abs(y1 - y0);
      const sx = x0 < x1 ? 1 : -1;
      const sy = y0 < y1 ? 1 : -1;
      let err = dx + dy;
      let step = 0;
      const skip = stepSkip || 1;
      while (true) {
        if (step % skip === 0) {
          fillNativeRect(x0, y0, 1, 1, r, g, b, a);
        }
        if (x0 === x1 && y0 === y1) break;
        const e2 = 2 * err;
        if (e2 >= dy) { err += dy; x0 += sx; }
        if (e2 <= dx) { err += dx; y0 += sy; }
        step++;
        if (step > 1200) break;
      }
    }

    // Fast 32-bit buffer clear
    function clearScreen() {
      u32.fill(0);
    }

    return {
      COARSE_W,
      COARSE_H,
      SCALE,
      NATIVE_W,
      NATIVE_H,
      screen,
      data,
      u32,
      clearScreen,
      fillNativeRect,
      coarsePix,
      coarsePixc,
      coarseRect,
      subPix2,
      subPix3,
      subPix5,
      subPix7,
      nativeLine7,
    };
  }

  // ==========================================================================
  // 2. HYPER-INTELLIGENT SEER CROWS (Corvus Oracle AI) & ROLLOUT EVALUATOR
  // ==========================================================================
  // Behavior States:
  //  - "OMEN_CIRCLE"    : Circles above nascent Black Goo outbreak or Skeksis ambush before strike
  //  - "VAT_CATALYST"   : Plucks a 2x2 color-cycling fern spore / crystal mote & drops it into Vat inPort
  //  - "WEB_SEVER"      : Swoops down at high speed to slice sticky Black Goo webs snaring a child/critter
  //  - "GUIDE_MONOLITH" : Lands near player Monolith, hops twice toward objective, emits harmonic crow-call
  const CROW_BEHAVIORS = {
    OMEN_CIRCLE: "OMEN_CIRCLE",
    VAT_CATALYST: "VAT_CATALYST",
    WEB_SEVER: "WEB_SEVER",
    GUIDE_MONOLITH: "GUIDE_MONOLITH",
  };

  // ==========================================================================
  // 2B. C-EVOLVED 5-STATE CELLULAR AUTOMATA GENOMES & EQUILIBRIUM PARAMETERS
  //     (Discovered & verified by /sim/evolve_automata.c & /sim/sim_civilization.c)
  // ==========================================================================
  const DISCOVERED_DNA = [
    {
      name: "SOLARIS_VAT_OSCILLATOR",
      role: "Harmonic bioluminescent server lake oscillator; stabilizes town power grid & charges monolith",
      genome: {
        birth2_n2_mask: 364,
        birth2_active_mask: 492,
        birth3_n3_mask: 220,
        survive2_n2_mask: 320,
        survive2_active_mask: 46,
        excite_2to3_n3_mask: 130,
        excite_2to3_act_mask: 384,
        fire_3to4_n3_mask: 30,
        fire_3to4_n2_mask: 318,
        sustain3_n2_mask: 236,
        refract_3to2_n2_mask: 92,
        recover_4to2_act_mask: 388,
        recover_4to1_n1_mask: 382,
        mem_form_act_mask: 22,
        mem_form_n1_mask: 264,
        mem_survive_act_mask: 44,
        mem_survive_n1_mask: 220,
        protrude_thresh: 2,
        motility_bias: 1,
      },
      seed_7x7: [
        [0, 1, 1, 1, 1, 1, 0],
        [1, 1, 2, 2, 3, 3, 1],
        [1, 2, 2, 3, 4, 4, 1],
        [1, 4, 3, 3, 3, 2, 1],
        [1, 2, 2, 3, 1, 2, 1],
        [1, 1, 2, 3, 4, 1, 1],
        [0, 1, 1, 1, 1, 1, 0],
      ],
    },
    {
      name: "WEB_CUTTER_GLIDER",
      role: "Motile permeable-membrane glider; hunts and cleaves sticky Black Goo webs with State-4 effectors",
      genome: {
        birth2_n2_mask: 432,
        birth2_active_mask: 4,
        birth3_n3_mask: 404,
        survive2_n2_mask: 146,
        survive2_active_mask: 268,
        excite_2to3_n3_mask: 434,
        excite_2to3_act_mask: 384,
        fire_3to4_n3_mask: 484,
        fire_3to4_n2_mask: 210,
        sustain3_n2_mask: 10,
        refract_3to2_n2_mask: 304,
        recover_4to2_act_mask: 140,
        recover_4to1_n1_mask: 394,
        mem_form_act_mask: 118,
        mem_form_n1_mask: 298,
        mem_survive_act_mask: 390,
        mem_survive_n1_mask: 362,
        protrude_thresh: 2,
        motility_bias: 4,
      },
      seed_7x7: [
        [0, 1, 1, 1, 1, 1, 0],
        [1, 3, 3, 2, 3, 1, 1],
        [1, 2, 1, 3, 4, 2, 1],
        [1, 2, 3, 2, 3, 4, 1],
        [1, 2, 2, 3, 4, 3, 1],
        [1, 1, 2, 2, 3, 1, 1],
        [0, 1, 1, 1, 1, 1, 0],
      ],
    },
    {
      name: "TERRA_SHAPER_MEMBRANE",
      role: "Heavy lipid-shell terraforming automaton; grades steep slopes and builds foundations for cottages",
      genome: {
        birth2_n2_mask: 468,
        birth2_active_mask: 392,
        birth3_n3_mask: 36,
        survive2_n2_mask: 136,
        survive2_active_mask: 10,
        excite_2to3_n3_mask: 314,
        excite_2to3_act_mask: 488,
        fire_3to4_n3_mask: 212,
        fire_3to4_n2_mask: 104,
        sustain3_n2_mask: 280,
        refract_3to2_n2_mask: 168,
        recover_4to2_act_mask: 78,
        recover_4to1_n1_mask: 246,
        mem_form_act_mask: 30,
        mem_form_n1_mask: 70,
        mem_survive_act_mask: 206,
        mem_survive_n1_mask: 78,
        protrude_thresh: 3,
        motility_bias: 2,
      },
      seed_7x7: [
        [0, 1, 1, 1, 1, 1, 0],
        [1, 4, 4, 4, 1, 4, 1],
        [1, 2, 3, 3, 3, 2, 1],
        [1, 2, 3, 1, 3, 4, 1],
        [1, 2, 2, 3, 4, 2, 1],
        [1, 1, 2, 2, 3, 4, 1],
        [0, 1, 1, 1, 1, 1, 0],
      ],
    },
    {
      name: "AETHER_SYNTH_SERVER",
      role: "High-gain compute vat transducer; converts spore/ore input pulses into Aetherium crystals",
      genome: {
        birth2_n2_mask: 300,
        birth2_active_mask: 132,
        birth3_n3_mask: 356,
        survive2_n2_mask: 42,
        survive2_active_mask: 96,
        excite_2to3_n3_mask: 468,
        excite_2to3_act_mask: 0,
        fire_3to4_n3_mask: 288,
        fire_3to4_n2_mask: 42,
        sustain3_n2_mask: 50,
        refract_3to2_n2_mask: 0,
        recover_4to2_act_mask: 30,
        recover_4to1_n1_mask: 114,
        mem_form_act_mask: 198,
        mem_form_n1_mask: 48,
        mem_survive_act_mask: 274,
        mem_survive_n1_mask: 98,
        protrude_thresh: 1,
        motility_bias: 3,
      },
      seed_7x7: [
        [0, 1, 1, 1, 1, 1, 0],
        [1, 1, 2, 2, 3, 4, 1],
        [1, 2, 2, 3, 4, 2, 1],
        [1, 2, 3, 2, 3, 4, 1],
        [1, 2, 2, 2, 4, 2, 1],
        [1, 1, 2, 2, 3, 1, 1],
        [0, 1, 1, 1, 1, 1, 0],
      ],
    },
    {
      name: "CORVUS_ORACLE_CORE",
      role: "Low-latency prophetic compute core; feeds lookahead causal waves to Hyper-Intelligent Seer Crows",
      genome: {
        birth2_n2_mask: 268,
        birth2_active_mask: 196,
        birth3_n3_mask: 318,
        survive2_n2_mask: 358,
        survive2_active_mask: 456,
        excite_2to3_n3_mask: 288,
        excite_2to3_act_mask: 0,
        fire_3to4_n3_mask: 20,
        fire_3to4_n2_mask: 94,
        sustain3_n2_mask: 18,
        refract_3to2_n2_mask: 138,
        recover_4to2_act_mask: 410,
        recover_4to1_n1_mask: 210,
        mem_form_act_mask: 502,
        mem_form_n1_mask: 508,
        mem_survive_act_mask: 150,
        mem_survive_n1_mask: 198,
        protrude_thresh: 2,
        motility_bias: 1,
      },
      seed_7x7: [
        [0, 1, 1, 1, 1, 1, 0],
        [1, 1, 3, 4, 3, 1, 1],
        [1, 2, 4, 4, 4, 2, 1],
        [1, 2, 3, 2, 3, 4, 1],
        [1, 3, 3, 3, 3, 2, 1],
        [1, 1, 3, 2, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 0],
      ],
    },
    {
      name: "SKEKSIS_BLIGHT_VAT",
      role: "Hostile Skeksis dark-spire vat genome; pulses corrosive blight waves and spawns sticky web spores",
      genome: {
        birth2_n2_mask: 100,
        birth2_active_mask: 380,
        birth3_n3_mask: 152,
        survive2_n2_mask: 266,
        survive2_active_mask: 2,
        excite_2to3_n3_mask: 340,
        excite_2to3_act_mask: 320,
        fire_3to4_n3_mask: 40,
        fire_3to4_n2_mask: 4,
        sustain3_n2_mask: 300,
        refract_3to2_n2_mask: 56,
        recover_4to2_act_mask: 278,
        recover_4to1_n1_mask: 84,
        mem_form_act_mask: 118,
        mem_form_n1_mask: 4,
        mem_survive_act_mask: 446,
        mem_survive_n1_mask: 246,
        protrude_thresh: 1,
        motility_bias: 3,
      },
      seed_7x7: [
        [0, 1, 1, 1, 1, 1, 0],
        [1, 1, 2, 2, 3, 1, 1],
        [1, 2, 2, 3, 4, 2, 1],
        [1, 2, 3, 2, 3, 4, 1],
        [1, 2, 2, 3, 4, 2, 1],
        [1, 1, 2, 2, 3, 1, 1],
        [0, 1, 1, 1, 1, 1, 0],
      ],
    },
  ];

  const EQUILIBRIUM_PARAMS = {
    fern_regrowth_prob: 0.043,
    ore_crystal_yield: 1.76,
    cottage_build_cost: 36,
    watchtower_build_cost: 20,
    vat_build_cost: 44,
    vat_feed_pulse_cost: 6,
    automata_spawn_threshold: 5,
    automata_lifespan_steps: 460,
    child_birth_cooldown_steps: 88,
    child_mature_steps: 110,
    skeksis_raid_period_steps: 520,
    black_goo_spread_prob: 0.14,
    web_trap_prob: 0.064,
    web_soul_leech_steps: 54,
    crow_lookahead_horizon_steps: 48,
    crow_catalyst_multiplier: 1.45,
    monolith_harmony_boost: 1.35,
  };

  // Exact JS port of step_vat_cell() from /sim/evolve_automata.c (5-state bitmask CA)
  function stepVatCell(dna, x, y, vatH, self, n1, n2, n3, n4, step) {
    const g = dna.genome;
    const nAct = n2 + n3 + n4;
    const wavePhase = (x + step) % 5 === 0 ? 1 : 0;

    switch (self) {
      case 0: { // STATE_EMPTY
        if (((g.birth3_n3_mask >> n3) & 1) && n2 >= 1) return 3;
        if (((g.birth2_n2_mask >> n2) & 1) || (((g.birth2_active_mask >> nAct) & 1) && n2 >= 1)) return 2;
        if ((y === 0 || y === vatH - 1) && ((g.mem_form_act_mask >> nAct) & 1)) return 1;
        return 0;
      }
      case 1: { // STATE_MEMBRANE (Lipid Shell)
        if (n3 + n4 >= g.protrude_thresh + 1) return 2;
        if (((g.mem_survive_act_mask >> nAct) & 1) && ((g.mem_survive_n1_mask >> n1) & 1)) return 1;
        return nAct >= 2 ? 2 : 0;
      }
      case 2: { // STATE_CORE_A
        if (((g.excite_2to3_n3_mask >> n3) & 1) || (((g.excite_2to3_act_mask >> nAct) & 1) && wavePhase)) return 3;
        if (((g.survive2_n2_mask >> n2) & 1) && ((g.survive2_active_mask >> nAct) & 1)) return 2;
        return 0;
      }
      case 3: { // STATE_SIGNAL_B
        if (((g.fire_3to4_n3_mask >> n3) & 1) || ((g.fire_3to4_n2_mask >> n2) & 1)) return 4;
        if ((g.sustain3_n2_mask >> n2) & 1) return 3;
        if ((g.refract_3to2_n2_mask >> n2) & 1) return 2;
        return 0;
      }
      case 4: { // STATE_EFFECTOR (Output Port Transducer / Web-Cutter)
        if ((g.recover_4to2_act_mask >> nAct) & 1) return 2;
        if ((y === 0 || y === vatH - 1) && ((g.recover_4to1_n1_mask >> n1) & 1)) return 1;
        return 0;
      }
    }
    return 0;
  }

  /**
   * Forward-simulating Lookahead Rollout Evaluator for Seer Crows.
   * Projects trajectories over H_ROLLOUT = 48 frames to rank:
   *  1. Active or imminent sticky web snares on Children / Critters -> WEB_SEVER
   *  2. Uncharged Town Compute Vats + reachable Fern/Crystal spores -> VAT_CATALYST
   *  3. Skeksis Cultists marching on Cottages/Children or nascent Black Goo -> OMEN_CIRCLE
   *  4. High-value buried DNA/Drill/Aetherium relics or distant threats to show Player -> GUIDE_MONOLITH
   */
  function evaluateWorldThreatsAndOpportunities(eco, world, crow, claimedTargetIds) {
    const H_ROLLOUT = 48; // 48 frames (~1.6 seconds) forward kinematic rollout
    const Blocks = world.Blocks;
    const P = world.P;

    let bestAction = null;
    let bestScore = -1;

    function consider(type, score, targetX, targetY, targetRef, meta) {
      if (targetRef && claimedTargetIds && claimedTargetIds.has(targetRef)) {
        score *= 0.35; // Deconflict multiple crows so they divide duties intelligently
      }
      if (score > bestScore) {
        bestScore = score;
        bestAction = {
          type,
          score,
          targetX,
          targetY,
          targetRef,
          meta: meta || null,
        };
      }
    }

    // --- ROLLOUT 1: Check Active Sticky Web Snares on Children or Small Critters (WEB_SEVER) ---
    for (let i = 0; i < eco.Webs.length; i++) {
      const web = eco.Webs[i];
      if (!web.active || web.severed) continue;
      const victim = web.victim;
      if (!victim) continue;
      // Urgency rises sharply as victim's soulLight drains!
      const drainUrgency = (1.1 - (victim.soulLight || 0.5)) * 65;
      const distPenalty = Math.abs(crow.x - web.midX) * 0.45;
      const isChildBonus = victim.kind === "child" ? 45 : 22;
      const score = 140 + drainUrgency + isChildBonus - distPenalty;
      consider(
        CROW_BEHAVIORS.WEB_SEVER,
        score,
        web.midX,
        web.midY,
        web,
        { web, victim }
      );
    }

    // --- ROLLOUT 2: Forward-Simulate Skeksis & Black Goo Trajectories vs Cottages/Children (OMEN_CIRCLE) ---
    for (let i = 0; i < eco.Skeksis.length; i++) {
      const sk = eco.Skeksis[i];
      if (sk.banished) continue;
      // Roll out Skeksis position over H_ROLLOUT frames
      let minConflictStep = H_ROLLOUT + 1;
      let conflictX = sk.x;
      let conflictY = Blocks[Math.max(0, Math.min(COARSE_W - 1, Math.round(sk.x)))] || 16;

      for (let t = 6; t <= H_ROLLOUT; t += 6) {
        const projSkX = sk.x + sk.vx * t;
        // Check proximity to any Child at step t
        for (let c = 0; c < eco.Children.length; c++) {
          const ch = eco.Children[c];
          const projChX = ch.x + ch.vx * t;
          if (Math.abs(projSkX - projChX) <= 6.5) {
            minConflictStep = Math.min(minConflictStep, t);
            conflictX = (projSkX + projChX) * 0.5;
            conflictY = Blocks[Math.max(0, Math.min(COARSE_W - 1, Math.round(conflictX)))] || 16;
          }
        }
        // Check proximity to any Orange Cottage or Compute Vat at step t
        for (let tw = 0; tw < world.Towns.length; tw++) {
          const town = world.Towns[tw];
          if (Math.abs(projSkX - town.x) <= 7) {
            minConflictStep = Math.min(minConflictStep, t);
            conflictX = (projSkX + town.x) * 0.5;
            conflictY = Blocks[town.x] || 16;
          }
        }
      }

      const imminence = minConflictStep <= H_ROLLOUT ? (H_ROLLOUT - minConflictStep) * 1.4 : 12;
      const score = 88 + imminence - Math.abs(crow.x - conflictX) * 0.3;
      consider(
        CROW_BEHAVIORS.OMEN_CIRCLE,
        score,
        conflictX,
        conflictY + 9,
        sk,
        { threatKind: "skeksis", entity: sk }
      );
    }

    // Also check nascent Black Goo nodes & rising Tar Veins about to erupt
    for (let i = 0; i < eco.GooNodes.length; i++) {
      const g = eco.GooNodes[i];
      const futureSpread = g.radius + g.growthRate * H_ROLLOUT;
      const gElev = Blocks[Math.max(0, Math.min(COARSE_W - 1, Math.round(g.x)))] || 15;
      const score = 78 + futureSpread * 8 - Math.abs(crow.x - g.x) * 0.25;
      consider(
        CROW_BEHAVIORS.OMEN_CIRCLE,
        score,
        g.x,
        gElev + 8,
        g,
        { threatKind: "goo", entity: g }
      );
    }

    if (world.TarVeins) {
      for (let i = 0; i < world.TarVeins.length; i++) {
        const v = world.TarVeins[i];
        const futureProg = v.progress + v.speed * H_ROLLOUT;
        if (futureProg >= 0.72) {
          const vElev = Blocks[v.x] || 15;
          const score = 74 + futureProg * 24 - Math.abs(crow.x - v.x) * 0.25;
          consider(
            CROW_BEHAVIORS.OMEN_CIRCLE,
            score,
            v.x,
            vElev + 8,
            v,
            { threatKind: "tar", entity: v }
          );
        }
      }
    }

    // --- ROLLOUT 3: Uncharged Town Compute Vats Needing a 2x2 Fern/Crystal Catalyst (VAT_CATALYST) ---
    for (let i = 0; i < eco.ComputeVats.length; i++) {
      const vat = eco.ComputeVats[i];
      if (vat.state !== "IDLE") continue;

      // If crow is already carrying a catalyst spore, fly straight to vat.inPort!
      if (crow.carryingSpore) {
        const distToPort = Math.abs(crow.x - vat.inPortX);
        consider(
          CROW_BEHAVIORS.VAT_CATALYST,
          132 - distToPort * 0.4,
          vat.inPortX,
          vat.inPortY,
          vat,
          { vat, source: null, phase: "DELIVER" }
        );
        continue;
      }

      // Otherwise find best ripe 2x2 Fern or Crystal cluster to pluck a catalyst from
      let bestSource = null;
      let bestTripDist = 999;

      for (let f = 0; f < eco.Ferns.length; f++) {
        const fern = eco.Ferns[f];
        if (!fern.hasSpore) continue;
        const trip = Math.abs(crow.x - fern.x) + Math.abs(fern.x - vat.inPortX);
        if (trip < bestTripDist) {
          bestTripDist = trip;
          bestSource = { kind: "fern", ref: fern, x: fern.x, y: (Blocks[fern.x] || 14) + 2 };
        }
      }

      if (world.Crystals) {
        for (let c = 0; c < world.Crystals.length; c++) {
          const cr = world.Crystals[c];
          const trip = Math.abs(crow.x - cr.x) + Math.abs(cr.x - vat.inPortX);
          if (trip < bestTripDist) {
            bestTripDist = trip;
            bestSource = { kind: "crystal", ref: cr, x: cr.x, y: (Blocks[cr.x] || 14) + 2 };
          }
        }
      }

      if (bestSource) {
        const score = 112 - bestTripDist * 0.35 + (eco.Automata.length === 0 ? 18 : 0);
        consider(
          CROW_BEHAVIORS.VAT_CATALYST,
          score,
          bestSource.x,
          bestSource.y,
          vat,
          { vat, source: bestSource, phase: "PLUCK" }
        );
      }
    }

    // --- ROLLOUT 4: Buried DNA / Drill / Aether Relics or Distant Objectives -> GUIDE_MONOLITH ---
    let bestObjective = null;
    let bestObjPriority = 0;

    if (world.Relics) {
      for (let i = 0; i < world.Relics.length; i++) {
        const rel = world.Relics[i];
        const distFromPlayer = Math.abs(rel.x - P.x);
        if (distFromPlayer < 5) continue;
        const prio =
          rel.type === "dna"
            ? 96
            : rel.type === "drill" && !P.drill
            ? 94
            : rel.type === "aether" && P.aether === 0
            ? 90
            : 68;
        const val = prio - distFromPlayer * 0.25;
        if (val > bestObjPriority) {
          bestObjPriority = val;
          bestObjective = { x: rel.x, y: rel.elev, kind: rel.type, ref: rel };
        }
      }
    }

    if (bestObjective) {
      const score = bestObjPriority;
      consider(
        CROW_BEHAVIORS.GUIDE_MONOLITH,
        score,
        P.x,
        (Blocks[P.x] || P.y) + 2,
        bestObjective.ref,
        { objective: bestObjective }
      );
    }

    // Default fallback: Omen patrol above the slope midpoint
    if (!bestAction) {
      const midX = Math.max(16, Math.min(COARSE_W - 16, P.x + 14));
      bestAction = {
        type: CROW_BEHAVIORS.OMEN_CIRCLE,
        score: 20,
        targetX: midX,
        targetY: (Blocks[midX] || 18) + 10,
        targetRef: null,
        meta: { threatKind: "patrol", entity: null },
      };
    }

    return bestAction;
  }

  // ==========================================================================
  // 3. ECOLOGICAL WORLD STATE, ENTITIES & SIMULATION ENGINE
  // ==========================================================================
  function createEcologicalSystem() {
    const eco = {
      Ferns: [],          // 2x2 color-cycling botanical fronds + spore emitters
      Critters: [],       // 2x2 small forest/coastal fauna (hoppers/crabs)
      OrangePeople: [],   // 3x3 builders, gatherers & guardians
      Children: [],       // 3x3 playful orange children with soul-light halos
      Skeksis: [],        // 3x3 dark purple-crimson bird-cultists
      GooNodes: [],       // 3x3 creeping black-violet cancerous cells
      Webs: [],           // 3x3 + 7x7 sticky web strands snaring children/critters
      SeerCrows: [],      // 3x3 Corvus oracle AI agents
      ComputeVats: [],    // Glass-and-lipid server vats (5x5 IN/OUT + 7x7 live CA)
      Automata: [],       // 5x5 + 7x7 permeable lipid-membrane roaming helpers
      SubParticles: [],   // 7x7 fine native-pixel sparks, soul-light motes & slashes
      SlashArcs: [],      // 7x7 high-speed crow beak-slash arcs
    };

    function spawnSubParticle(cx, cy, vx, vy, r, g, b, life) {
      if (eco.SubParticles.length > 180) eco.SubParticles.shift();
      eco.SubParticles.push({
        px: cx * SCALE + 3,
        py: (COARSE_H - cy) * SCALE + 3,
        vx,
        vy,
        r,
        g,
        b,
        life,
        maxLife: life,
      });
    }

    // Seed a 19x12 Vat CA grid with the C-discovered 7x7 seed pattern of a DNA genome
    function seedVatWithDna(gridA, caW, caH, dna) {
      gridA.fill(0);
      const seed = dna.seed_7x7;
      const ox = Math.floor((caW - 7) / 2);
      const oy = Math.floor((caH - 7) / 2);
      for (let sy = 0; sy < 7; sy++) {
        for (let sx = 0; sx < 7; sx++) {
          gridA[(oy + sy) * caW + (ox + sx)] = seed[sy][sx];
        }
      }
      // Also place a secondary harmonic seed droplet near the left Input Port
      for (let sy = 0; sy < 7; sy++) {
        for (let sx = 0; sx < 7; sx++) {
          const v = seed[sy][sx];
          if (v === 1 || v === 2) {
            const tx = 1 + sx;
            const ty = oy + sy;
            if (tx < ox && ty >= 0 && ty < caH) {
              gridA[ty * caW + tx] = v;
            }
          }
        }
      }
    }

    // Create a new Town Compute Vat (Server Lake) on a flat terrace at coarse column x
    function createComputeVat(x, dnaIndex) {
      const cx = Math.max(8, Math.min(COARSE_W - 9, Math.round(x)));
      const caW = 19; // 19 native 7x7 pixels wide inside glass chamber
      const caH = 12; // 12 native 7x7 pixels tall inside glass chamber
      const gridA = new Uint8Array(caW * caH);
      const gridB = new Uint8Array(caW * caH);

      const idx = dnaIndex !== undefined ? (dnaIndex % 5) : (eco.ComputeVats.length % 5);
      const dna = DISCOVERED_DNA[idx];
      seedVatWithDna(gridA, caW, caH, dna);

      return {
        x: cx,
        inPortX: cx - 2,
        inPortY: 2,
        outPortX: cx + 2,
        outPortY: 2,
        state: "IDLE", // "IDLE" | "COMPUTING" | "BIRTHING"
        progress: 0,   // 0..100
        catalystColor: [90, 255, 195],
        dnaIndex: idx,
        dnaName: dna.name,
        dna,
        caW,
        caH,
        gridA,
        gridB,
        portFlash: 0,
        births: 0,
        effectorHits: 0,
      };
    }

    // Create a Free-Roaming Permeable Lipid-Membrane Automaton with its own 7x7 C-evolved CA core
    function createRoamingAutomaton(x, vx, dnaIndex) {
      const idx = dnaIndex !== undefined ? (dnaIndex % 5) : 1; // Default WEB_CUTTER_GLIDER
      const dna = DISCOVERED_DNA[idx];
      const cellGrid = new Uint8Array(49); // 7x7 live internal CA core
      const cellNext = new Uint8Array(49);
      for (let sy = 0; sy < 7; sy++) {
        for (let sx = 0; sx < 7; sx++) {
          cellGrid[sy * 7 + sx] = dna.seed_7x7[sy][sx];
        }
      }
      return {
        x,
        vx: vx || 0.14,
        phase: 0,
        energy: 100,
        carryingSpore: false,
        dnaIndex: idx,
        dnaName: dna.name,
        dna,
        cellGrid,
        cellNext,
      };
    }

    // Step the 7x7 internal 5-state CA + permeable lipid membrane of a roaming automaton
    function stepRoamingAutomatonCA(au, step) {
      const dna = au.dna || DISCOVERED_DNA[au.dnaIndex || 0];
      const grid = au.cellGrid;
      const next = au.cellNext;
      if (!grid || !next) return;

      const dirSign = au.vx >= 0 ? 1 : -1;
      let activeCount = 0;

      for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 7; x++) {
          const idx = y * 7 + x;
          const rx = x - 3;
          const ry = y - 3;
          const rad2 = rx * rx + ry * ry;

          // Keep corners outside lipid circle empty
          if (rad2 > 11.5) {
            next[idx] = 0;
            continue;
          }
          // Outer ring forms the permeable State-1 Lipid Membrane Shell
          if (rad2 >= 6.5) {
            const isLeading = rx * dirSign > 0;
            next[idx] = isLeading && ((step + x + y) % 5 === 0) ? 3 : 1;
            continue;
          }

          // Count Moore neighbors by state (1..4)
          let n1 = 0, n2 = 0, n3 = 0, n4 = 0;
          for (let dy = -1; dy <= 1; dy++) {
            const ny = y + dy;
            if (ny < 0 || ny >= 7) continue;
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue;
              const nx = x + dx;
              if (nx < 0 || nx >= 7) continue;
              const ns = grid[ny * 7 + nx];
              if (ns === 1) n1++;
              else if (ns === 2) n2++;
              else if (ns === 3) n3++;
              else if (ns === 4) n4++;
            }
          }

          let ns = stepVatCell(dna, x, y, 7, grid[idx], n1, n2, n3, n4, step);
          if (ns === 0 && rad2 <= 3.5 && (n2 + n3 + n4 >= 2)) {
            ns = 2; // Keep inner organelle core cohesive
          }
          if (ns >= 2) activeCount++;
          next[idx] = ns;
        }
      }

      // Self-heal core from DNA seed if depleted
      if (activeCount < 3) {
        for (let sy = 1; sy < 6; sy++) {
          for (let sx = 1; sx < 6; sx++) {
            next[sy * 7 + sx] = dna.seed_7x7[sy][sx];
          }
        }
      }
      grid.set(next);
    }

    // Ignite a Compute Vat when a catalyst enters its left IN port
    function igniteVat(vat, catalystColor, world) {
      const dna = vat.dna || DISCOVERED_DNA[vat.dnaIndex || 0];
      if (vat.state === "COMPUTING") {
        vat.progress = Math.min(99, vat.progress + 30);
        vat.portFlash = 16;
        // Inject additional Signal-B (state 3) pulse at left Input Port
        const { caW, caH, gridA } = vat;
        const midY = Math.floor(caH / 2);
        for (let dy = -1; dy <= 1; dy++) {
          gridA[(midY + dy) * caW + 0] = 3;
          gridA[(midY + dy) * caW + 1] = 3;
        }
        return;
      }
      vat.state = "COMPUTING";
      vat.progress = 8;
      vat.catalystColor = catalystColor || [95, 255, 185];
      vat.portFlash = 22;

      // Seed the C-evolved 7x7 DNA genome and inject Input Port Signal-B excitation at x=0..1!
      const { caW, caH, gridA } = vat;
      seedVatWithDna(gridA, caW, caH, dna);
      const midY = Math.floor(caH / 2);
      for (let dy = -1; dy <= 1; dy++) {
        gridA[(midY + dy) * caW + 0] = 3;
        gridA[(midY + dy) * caW + 1] = 3;
        gridA[(midY + dy) * caW + 2] = 2;
      }

      const elev = (world.Blocks[vat.x] || 16) + 2;
      for (let p = 0; p < 12; p++) {
        spawnSubParticle(
          vat.inPortX,
          elev,
          (Math.random() - 0.5) * 1.6,
          -Math.random() * 1.8 - 0.3,
          vat.catalystColor[0],
          vat.catalystColor[1],
          vat.catalystColor[2],
          24
        );
      }
      if (global.SlopesAudio && global.SlopesAudio.playTineBell) {
        global.SlopesAudio.playTineBell(76, 1.1, 0.16);
      }
    }

    // Upgrade all Compute Vats on screen when the player unearths a buried DNA double-helix relic!
    function evolveVatDna(world) {
      if (eco.ComputeVats.length === 0) {
        const px = world.P ? world.P.x : 60;
        const vx = Math.max(12, Math.min(COARSE_W - 13, px));
        eco.ComputeVats.push(createComputeVat(vx, 1));
      }
      let chosenName = DISCOVERED_DNA[0].name;
      for (let i = 0; i < eco.ComputeVats.length; i++) {
        const vat = eco.ComputeVats[i];
        vat.dnaIndex = ((vat.dnaIndex || 0) + 1) % 5;
        vat.dna = DISCOVERED_DNA[vat.dnaIndex];
        vat.dnaName = vat.dna.name;
        chosenName = vat.dnaName;
        igniteVat(vat, [110, 255, 240], world);
      }
      return chosenName;
    }

    // Step the 7x7 native-pixel 5-State C-Evolved Cellular Automaton inside a Compute Vat
    function stepVatCellularAutomata(vat, frameCount) {
      const { caW, caH, gridA, gridB } = vat;
      const dna = vat.dna || DISCOVERED_DNA[vat.dnaIndex || 0];
      const isComputing = vat.state === "COMPUTING";
      const step = frameCount >> 1;

      // During active computation, periodically pulse the left Input Port (x=0..1) just like evolve_automata.c
      if (isComputing && (step % 10 === 0 || vat.portFlash > 14)) {
        const midY = Math.floor(caH / 2);
        for (let dy = -1; dy <= 1; dy++) {
          gridA[(midY + dy) * caW + 0] = 3; // STATE_SIGNAL_B
          gridA[(midY + dy) * caW + 1] = 3;
        }
      }

      let activeCount = 0;
      let outPortEffectors = 0;

      for (let y = 0; y < caH; y++) {
        for (let x = 0; x < caW; x++) {
          const idx = y * caW + x;
          const s = gridA[idx];

          // Count Moore neighborhood states (1: Membrane, 2: Core A, 3: Signal B, 4: Effector)
          let n1 = 0, n2 = 0, n3 = 0, n4 = 0;
          for (let dy = -1; dy <= 1; dy++) {
            const ny = y + dy;
            if (ny < 0 || ny >= caH) continue;
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue;
              const nx = x + dx;
              if (nx < 0 || nx >= caW) continue;
              const ns = gridA[ny * caW + nx];
              if (ns === 1) n1++;
              else if (ns === 2) n2++;
              else if (ns === 3) {
                n3++;
                // Directed chemotactic/signal bias from left IN port to right OUT port
                if (dx === -1 && (dna.genome.motility_bias & 1) && n3 < 8) n3++;
              } else if (ns === 4) n4++;
            }
          }

          const ns = stepVatCell(dna, x, y, caH, s, n1, n2, n3, n4, step);
          gridB[idx] = ns;
          if (ns >= 2) activeCount++;

          // Detect State-4 Effector pulses arriving at the right Output Port wall (x >= caW - 2)
          if (x >= caW - 2 && y >= 2 && y <= caH - 3 && ns === 4) {
            outPortEffectors++;
          }
        }
      }

      // Ensure resting vat maintains its self-sustaining DNA seed organelle
      if (activeCount < 4) {
        seedVatWithDna(gridB, caW, caH, dna);
      }

      if (isComputing && outPortEffectors > 0) {
        vat.effectorHits = (vat.effectorHits || 0) + outPortEffectors;
        vat.progress = Math.min(100, vat.progress + Math.min(2.2, outPortEffectors * 0.65));
      }

      // Copy gridB -> gridA
      gridA.set(gridB);
    }

    // Populate a newly generated or loaded screen with rich multi-scale ecology
    function populateScreen(world, srandom, srandInt) {
      eco.Ferns = [];
      eco.Critters = [];
      eco.OrangePeople = [];
      eco.Children = [];
      eco.Skeksis = [];
      eco.GooNodes = [];
      eco.Webs = [];
      eco.SeerCrows = [];
      eco.ComputeVats = [];
      eco.Automata = [];
      eco.SubParticles = [];
      eco.SlashArcs = [];

      const Blocks = world.Blocks;
      const seaLevel = world.seaLevel || 0;
      const rand = srandom || Math.random;
      const rInt = srandInt || ((lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo);

      // 1. Add a buried DNA Helix relic on every screen so Crows can also guide to DNA!
      if (world.Relics && !world.Relics.some((r) => r.type === "dna")) {
        const dnaX = rInt(20, COARSE_W - 21);
        const dnaElev = Math.max(3, (Blocks[dnaX] || 14) - 3);
        world.Relics.push({
          x: dnaX,
          elev: dnaElev,
          type: "dna",
          sparkle: rand() * 6,
        });
      }

      // 2. Spawn 2x2 Color-Cycling Fern Fronds & Small Critters on dry ledges
      for (let x = 10; x < COARSE_W - 10; x += rInt(7, 12)) {
        const h = Blocks[x];
        if (h > seaLevel + 2) {
          eco.Ferns.push({
            x,
            fronds: rInt(2, 3),
            phase: rand() * Math.PI * 2,
            hasSpore: true,
            sporeTimer: 0,
            hueShift: rand() * 6,
          });
          if (eco.Critters.length < 5 && rand() < 0.55) {
            eco.Critters.push({
              kind: "critter",
              x: x + 0.5,
              vx: (rand() < 0.5 ? 1 : -1) * 0.08,
              hopY: 0,
              hopVy: 0,
              snared: false,
              soulLight: 1.0,
              phase: rand() * 6,
            });
          }
        }
      }

      // 3. Spawn a Town Compute Vat next to the initial Town (or on a high flat terrace)
      const baseTown = world.Towns && world.Towns[0];
      const vatX = baseTown
        ? Math.max(14, Math.min(COARSE_W - 15, baseTown.x + (baseTown.x < 60 ? 8 : -8)))
        : 66;
      if (Blocks[vatX] > seaLevel + 1) {
        const vatElev = Blocks[vatX];
        for (let dx = -2; dx <= 2; dx++) {
          Blocks[vatX + dx] = vatElev;
        }
        eco.ComputeVats.push(createComputeVat(vatX));
      }

      // 4. Spawn Orange People (Builders, Gatherers, Guardians) & Children near Towns
      const homeX = baseTown ? baseTown.x : 54;
      const roles = ["gatherer", "builder", "guardian"];
      for (let i = 0; i < 3; i++) {
        eco.OrangePeople.push({
          x: Math.max(10, Math.min(COARSE_W - 11, homeX + (i - 1) * 3)),
          vx: (i % 2 === 0 ? 1 : -1) * 0.11,
          facing: i % 2 === 0 ? 1 : -1,
          role: roles[i % roles.length],
          carrying: i === 0 ? "spore" : null, // Start 1 gatherer already carrying a visible spore!
          workTimer: 0,
          stride: rand() * 6,
          homeX,
        });
      }

      for (let i = 0; i < 2; i++) {
        eco.Children.push({
          kind: "child",
          x: Math.max(10, Math.min(COARSE_W - 11, homeX + (i === 0 ? -2 : 2))),
          vx: (i === 0 ? -1 : 1) * 0.07,
          facing: i === 0 ? -1 : 1,
          hopY: 0,
          snared: false,
          soulLight: 1.0,
          stride: rand() * 6,
          homeX,
        });
      }

      // 5. Spawn Skeksis Bird-Cultists & Nascent Black Goo Nodes near Tar Veins / Slopes
      const tarX =
        world.TarVeins && world.TarVeins.length > 0
          ? world.TarVeins[0].x
          : Math.max(16, Math.min(COARSE_W - 17, homeX > 60 ? 26 : 94));

      eco.GooNodes.push({
        x: tarX,
        radius: 1.4,
        growthRate: 0.0025,
        pulse: rand() * 6,
        webCooldown: 45,
      });

      const skeksisCount = world.worldLayer <= 0 ? 2 : 1;
      for (let i = 0; i < skeksisCount; i++) {
        const sx = i === 0
          ? tarX + (tarX < homeX ? -3 : 3)
          : Math.max(14, Math.min(COARSE_W - 15, COARSE_W - tarX));
        eco.Skeksis.push({
          x: sx,
          vx: sx < homeX ? 0.075 : -0.075,
          facing: sx < homeX ? 1 : -1,
          castTimer: 55 + i * 40,
          stride: rand() * 6,
          banished: false,
          flash: 0,
        });
      }

      // 6. Spawn 2 Hyper-Intelligent Seer Crows (Corvus Oracle AI)
      for (let i = 0; i < 2; i++) {
        const cx = Math.max(14, Math.min(COARSE_W - 15, homeX + (i === 0 ? -10 : 12)));
        const cy = (Blocks[cx] || 18) + 12 + i * 3;
        eco.SeerCrows.push({
          id: i,
          x: cx,
          y: cy,
          vx: 0.25,
          vy: 0,
          facing: 1,
          wingPhase: rand() * 6,
          state: i === 0 ? CROW_BEHAVIORS.VAT_CATALYST : CROW_BEHAVIORS.OMEN_CIRCLE,
          carryingSpore: i === 0, // First crow starts with a glowing catalyst spore ready to demonstrate!
          sporeColor: [95, 255, 175],
          evalTimer: i * 14,
          orbitAngle: rand() * Math.PI * 2,
          hopCount: 0,
          hopWait: 0,
          callCooldown: 0,
          plan: null,
        });
      }

      // 7. Spawn 1 initial Permeable Lipid-Membrane Roaming Automaton near the Compute Vat
      if (eco.ComputeVats.length > 0) {
        const v0 = eco.ComputeVats[0];
        eco.Automata.push(createRoamingAutomaton(v0.outPortX + 1.5, 0.12, 1));
      }
    }

    // Handle Player Sonic Tamp (K) or Rock impact purifying Goo, severing Webs & banishing Skeksis
    function onPlayerSonicTamp(world, px, radius) {
      let purified = 0;

      // 1. Sever any sticky webs within tamp radius
      for (let i = eco.Webs.length - 1; i >= 0; i--) {
        const w = eco.Webs[i];
        if (Math.abs(w.midX - px) <= radius + 2 || Math.abs(w.toX - px) <= radius + 2) {
          if (w.victim) {
            w.victim.snared = false;
            w.victim.soulLight = Math.min(1.0, (w.victim.soulLight || 0.5) + 0.45);
          }
          eco.Webs.splice(i, 1);
          purified++;
        }
      }

      // 2. Shrink / shatter Black Goo nodes within tamp radius
      for (let i = eco.GooNodes.length - 1; i >= 0; i--) {
        const g = eco.GooNodes[i];
        if (Math.abs(g.x - px) <= radius) {
          const gElev = world.Blocks[Math.round(g.x)] || 14;
          for (let p = 0; p < 10; p++) {
            spawnSubParticle(
              g.x,
              gElev + 1,
              (Math.random() - 0.5) * 1.8,
              -Math.random() * 1.6,
              195,
              95,
              255,
              22
            );
          }
          g.radius -= 1.2;
          if (g.radius <= 0.4) {
            eco.GooNodes.splice(i, 1);
          }
          purified++;
        }
      }

      // 3. Repel / banish Skeksis Cultists within tamp radius
      for (let i = eco.Skeksis.length - 1; i >= 0; i--) {
        const sk = eco.Skeksis[i];
        if (Math.abs(sk.x - px) <= radius) {
          sk.flash = 16;
          sk.vx = (sk.x >= px ? 1 : -1) * 0.25;
          sk.x = Math.max(4, Math.min(COARSE_W - 5, sk.x + (sk.x >= px ? 5 : -5)));
          const skElev = world.Blocks[Math.round(sk.x)] || 14;
          for (let p = 0; p < 12; p++) {
            spawnSubParticle(
              sk.x,
              skElev + 2,
              (Math.random() - 0.5) * 2.0,
              -Math.random() * 1.8,
              255,
              110,
              165,
              24
            );
          }
          // Sever webs owned by this Skeksis
          for (let wIdx = eco.Webs.length - 1; wIdx >= 0; wIdx--) {
            if (eco.Webs[wIdx].owner === sk) {
              if (eco.Webs[wIdx].victim) eco.Webs[wIdx].victim.snared = false;
              eco.Webs.splice(wIdx, 1);
            }
          }
          eco.Skeksis.splice(i, 1);
          purified++;
        }
      }

      // 4. Charge any nearby Town Compute Vat within tamp radius!
      for (let i = 0; i < eco.ComputeVats.length; i++) {
        const vat = eco.ComputeVats[i];
        if (Math.abs(vat.x - px) <= 7) {
          igniteVat(vat, [95, 245, 255], world);
          purified++;
        }
      }

      return purified;
    }

    // ========================================================================
    // STEP ECOLOGICAL SIMULATION (Called once per frame in updateSimulation)
    // ========================================================================
    function update(world) {
      const Blocks = world.Blocks;
      const P = world.P;
      const frameCount = world.frameCount || 0;
      const seaLevel = world.seaLevel || 0;

      // --- 1. Update 2x2 Color-Cycling Ferns & Spore Maturation ---
      for (let i = 0; i < eco.Ferns.length; i++) {
        const f = eco.Ferns[i];
        f.phase += 0.07;
        f.hueShift += 0.04;
        if (!f.hasSpore) {
          f.sporeTimer++;
          if (f.sporeTimer >= 160) {
            f.hasSpore = true;
            f.sporeTimer = 0;
          }
        }
      }

      // --- 2. Update 2x2 Small Forest Critters ---
      for (let i = 0; i < eco.Critters.length; i++) {
        const cr = eco.Critters[i];
        cr.phase += 0.15;
        if (cr.snared) {
          cr.soulLight = Math.max(0.08, cr.soulLight - 0.0022);
          continue;
        }
        cr.soulLight = Math.min(1.0, cr.soulLight + 0.005);
        cr.x += cr.vx;
        if (cr.x < 8 || cr.x > COARSE_W - 9 || Blocks[Math.round(cr.x)] <= seaLevel) {
          cr.vx = -cr.vx;
          cr.x += cr.vx * 2;
        }
        if ((frameCount + i * 19) % 45 === 0) {
          cr.hopVy = 0.55;
        }
        if (cr.hopVy > 0 || cr.hopY > 0) {
          cr.hopY += cr.hopVy;
          cr.hopVy -= 0.12;
          if (cr.hopY <= 0) {
            cr.hopY = 0;
            cr.hopVy = 0;
          }
        }
      }

      // --- 3. Update 3x3 Orange Children (Play near Cottages, Flee Skeksis, Snare/Soul-Light) ---
      for (let i = 0; i < eco.Children.length; i++) {
        const ch = eco.Children[i];
        ch.stride += 0.18;
        if (ch.snared) {
          ch.soulLight = Math.max(0.1, ch.soulLight - 0.0025);
          ch.hopY = 0;
          // Player touching a snared child immediately rescues them!
          if (Math.abs(P.x - ch.x) <= 2.5) {
            for (let wIdx = eco.Webs.length - 1; wIdx >= 0; wIdx--) {
              if (eco.Webs[wIdx].victim === ch) {
                eco.Webs.splice(wIdx, 1);
              }
            }
            ch.snared = false;
            ch.soulLight = 1.0;
            if (world.healHealth) world.healHealth(8);
            if (world.announceSky) world.announceSky("CHILD RESCUED!", "SOUL-LIGHT RESTORED", 145);
          }
          continue;
        }

        ch.soulLight = Math.min(1.0, ch.soulLight + 0.004);

        // Check if any Skeksis is nearby -> flee toward home cottage or player Monolith!
        let nearestSk = null;
        let minSkDist = 999;
        for (let s = 0; s < eco.Skeksis.length; s++) {
          const d = Math.abs(eco.Skeksis[s].x - ch.x);
          if (d < minSkDist) {
            minSkDist = d;
            nearestSk = eco.Skeksis[s];
          }
        }

        if (nearestSk && minSkDist < 14) {
          const fleeDir = ch.x >= nearestSk.x ? 1 : -1;
          ch.vx = fleeDir * 0.11;
          ch.facing = fleeDir;
        } else {
          if (Math.abs(ch.x - ch.homeX) > 9) {
            ch.vx = (ch.homeX > ch.x ? 1 : -1) * 0.07;
          } else if ((frameCount + i * 31) % 70 === 0) {
            ch.vx = -ch.vx;
          }
          ch.facing = ch.vx >= 0 ? 1 : -1;
        }

        const nx = ch.x + ch.vx;
        const col = Math.max(2, Math.min(COARSE_W - 3, Math.round(nx)));
        if (Blocks[col] > seaLevel + 1 && Math.abs(Blocks[col] - Blocks[Math.round(ch.x)]) <= 2) {
          ch.x = nx;
        } else {
          ch.vx = -ch.vx;
        }
        ch.hopY = (frameCount + i * 13) % 24 < 6 ? 0.5 : 0;
      }

      // --- 4. Update 3x3 Orange People (Gather Spores, Grade Land, Build Cottages & Vats, Guard Children) ---
      for (let i = 0; i < eco.OrangePeople.length; i++) {
        const op = eco.OrangePeople[i];
        op.stride += 0.16;
        if (op.workTimer > 0) {
          op.workTimer--;
          continue;
        }

        // GUARDIAN / RESCUE PRIORITY: If a Child is snared within 16 cells, rush to sever the web!
        const snaredChild = eco.Children.find((c) => c.snared && Math.abs(c.x - op.x) < 18);
        if (snaredChild) {
          const dir = snaredChild.x > op.x ? 1 : -1;
          op.facing = dir;
          op.x += dir * 0.15;
          if (Math.abs(op.x - snaredChild.x) <= 1.8) {
            for (let wIdx = eco.Webs.length - 1; wIdx >= 0; wIdx--) {
              if (eco.Webs[wIdx].victim === snaredChild) {
                eco.Webs.splice(wIdx, 1);
              }
            }
            snaredChild.snared = false;
            snaredChild.soulLight = 1.0;
            op.workTimer = 14;
          }
          continue;
        }

        // GATHERER ROLE: Pluck fern spores/crystals and deliver them to an IDLE Compute Vat's IN port!
        if (op.role === "gatherer") {
          const idleVat = eco.ComputeVats.find((v) => v.state === "IDLE");
          if (op.carrying === "spore" && idleVat) {
            const dir = idleVat.inPortX > op.x ? 1 : -1;
            op.facing = dir;
            op.x += dir * 0.13;
            if (Math.abs(op.x - idleVat.inPortX) <= 1.4) {
              op.carrying = null;
              op.workTimer = 16;
              igniteVat(idleVat, [95, 255, 175], world);
            }
            continue;
          } else if (!op.carrying) {
            const ripeFern = eco.Ferns.find((f) => f.hasSpore && Math.abs(f.x - op.x) < 28);
            if (ripeFern) {
              const dir = ripeFern.x > op.x ? 1 : -1;
              op.facing = dir;
              op.x += dir * 0.12;
              if (Math.abs(op.x - ripeFern.x) <= 1.4) {
                ripeFern.hasSpore = false;
                op.carrying = "spore";
                op.workTimer = 12;
              }
              continue;
            }
          }
        }

        // BUILDER ROLE: Grade steep terrain steps near town & construct new Compute Vats or Cottages
        if (op.role === "builder") {
          const col = Math.max(6, Math.min(COARSE_W - 7, Math.round(op.x)));
          const nextCol = Math.max(6, Math.min(COARSE_W - 7, col + op.facing));
          const stepDiff = Blocks[nextCol] - Blocks[col];

          // Grade land if step > 1 near town!
          if (Math.abs(stepDiff) >= 2 && Blocks[col] > seaLevel + 3 && frameCount % 35 === 0) {
            op.workTimer = 18;
            if (stepDiff > 0) {
              Blocks[nextCol]--;
              op.carrying = "soil";
            } else if (op.carrying === "soil") {
              Blocks[nextCol]++;
              op.carrying = null;
            }
            spawnSubParticle(nextCol, Blocks[nextCol], (Math.random() - 0.5), -0.8, 245, 180, 85, 16);
            continue;
          }

          // If standing on a flat 5-block terrace with soil and no nearby Vat/Town, build one!
          if (
            op.carrying === "soil" &&
            col > 16 &&
            col < COARSE_W - 17 &&
            Blocks[col] > seaLevel + 3 &&
            Math.abs(Blocks[col - 1] - Blocks[col]) <= 1 &&
            Math.abs(Blocks[col + 1] - Blocks[col]) <= 1
          ) {
            const nearTown = world.Towns && world.Towns.some((t) => Math.abs(t.x - col) < 8);
            const nearVat = eco.ComputeVats.some((v) => Math.abs(v.x - col) < 9);
            if (!nearTown && !nearVat) {
              op.carrying = null;
              op.workTimer = 28;
              if (eco.ComputeVats.length < 2) {
                for (let dx = -2; dx <= 2; dx++) Blocks[col + dx] = Blocks[col];
                eco.ComputeVats.push(createComputeVat(col));
              } else if (world.Towns && world.Towns.length < 5) {
                world.Towns.push({ x: col, type: "cottage", pulse: 15 });
              }
              continue;
            }
          }
        }

        // Standard patrol along the coastal terraces
        const nx = op.x + op.vx;
        const nCol = Math.max(5, Math.min(COARSE_W - 6, Math.round(nx)));
        if (Blocks[nCol] <= seaLevel + 1 || Math.abs(Blocks[nCol] - Blocks[Math.round(op.x)]) > 3) {
          op.vx = -op.vx;
        } else {
          op.x = nx;
        }
        op.facing = op.vx >= 0 ? 1 : -1;
      }

      // --- 5. Update Creeping Black Goo Nodes & Skeksis Bird-Cultists ---
      if (world.TarVeins) {
        for (let i = 0; i < world.TarVeins.length; i++) {
          const tv = world.TarVeins[i];
          if (tv.erupted && eco.GooNodes.length < 4 && !eco.GooNodes.some((g) => Math.abs(g.x - tv.x) < 6)) {
            eco.GooNodes.push({
              x: tv.x,
              radius: 1.2,
              growthRate: 0.0025,
              pulse: 0,
              webCooldown: 40,
            });
          }
        }
      }

      // Periodic Skeksis Cultist raid & Black Goo emergence (keeps equilibrium conflict dynamic!)
      if (eco.GooNodes.length === 0 && frameCount > 0 && frameCount % 220 === 0) {
        const homeX = world.Towns && world.Towns[0] ? world.Towns[0].x : 60;
        const gx = homeX > 60 ? 22 : 98;
        if (Blocks[gx] > seaLevel + 1) {
          eco.GooNodes.push({
            x: gx,
            radius: 1.3,
            growthRate: 0.0025,
            pulse: 0,
            webCooldown: 45,
          });
        }
      }
      if (eco.Skeksis.length === 0 && frameCount > 0 && frameCount % 260 === 0) {
        const homeX = world.Towns && world.Towns[0] ? world.Towns[0].x : 60;
        const sx = homeX > 60 ? 16 : 104;
        if (Blocks[sx] > seaLevel + 1) {
          eco.Skeksis.push({
            x: sx,
            vx: sx < homeX ? 0.075 : -0.075,
            facing: sx < homeX ? 1 : -1,
            castTimer: 50,
            stride: 0,
            banished: false,
            flash: 0,
          });
        }
      }

      for (let i = 0; i < eco.GooNodes.length; i++) {
        const g = eco.GooNodes[i];
        g.pulse += 0.14;
        g.radius = Math.min(4.2, g.radius + g.growthRate);
        if (g.webCooldown > 0) g.webCooldown--;
      }

      for (let i = 0; i < eco.Skeksis.length; i++) {
        const sk = eco.Skeksis[i];
        if (sk.flash > 0) sk.flash--;
        sk.stride += 0.14;

        // March toward the nearest unsnared Child, Critter, or Cottage
        let targetX = world.Towns && world.Towns[0] ? world.Towns[0].x : 60;
        let nearestPrey = null;
        let minPreyDist = 999;

        for (let c = 0; c < eco.Children.length; c++) {
          const ch = eco.Children[c];
          const d = Math.abs(ch.x - sk.x);
          if (d < minPreyDist) {
            minPreyDist = d;
            nearestPrey = ch;
            targetX = ch.x;
          }
        }
        for (let c = 0; c < eco.Critters.length; c++) {
          const cr = eco.Critters[c];
          const d = Math.abs(cr.x - sk.x);
          if (d < minPreyDist) {
            minPreyDist = d;
            nearestPrey = cr;
            targetX = cr.x;
          }
        }

        // If holding an active web snare, stay anchored and channel soul-light drain!
        const activeSnare = eco.Webs.find((w) => w.owner === sk && w.active);
        if (activeSnare && activeSnare.victim) {
          sk.facing = activeSnare.victim.x >= sk.x ? 1 : -1;
          const vCol = Math.max(1, Math.min(COARSE_W - 2, Math.round(activeSnare.victim.x)));
          const sCol = Math.max(1, Math.min(COARSE_W - 2, Math.round(sk.x)));
          activeSnare.fromX = sk.x;
          activeSnare.fromY = (Blocks[sCol] || 15) + 1.5;
          activeSnare.toX = activeSnare.victim.x;
          activeSnare.toY = (Blocks[vCol] || 15) + 1.0;
          activeSnare.midX = (activeSnare.fromX + activeSnare.toX) * 0.5;
          activeSnare.midY = (activeSnare.fromY + activeSnare.toY) * 0.5 + 1.2;
          continue;
        }

        const dir = targetX >= sk.x ? 1 : -1;
        sk.vx = dir * 0.068;
        sk.facing = dir;
        const nx = sk.x + sk.vx;
        const nCol = Math.max(4, Math.min(COARSE_W - 5, Math.round(nx)));
        if (Blocks[nCol] > seaLevel + 1) {
          sk.x = nx;
        }

        // Spin a sticky Black Goo Web if within 8.5 coarse cells of a Child or Critter!
        if (sk.castTimer > 0) {
          sk.castTimer--;
        } else if (nearestPrey && !nearestPrey.snared && minPreyDist <= 8.5 && eco.Webs.length < 3) {
          sk.castTimer = 170;
          nearestPrey.snared = true;
          const sCol = Math.max(1, Math.min(COARSE_W - 2, Math.round(sk.x)));
          const vCol = Math.max(1, Math.min(COARSE_W - 2, Math.round(nearestPrey.x)));
          const fromY = (Blocks[sCol] || 15) + 1.5;
          const toY = (Blocks[vCol] || 15) + 1.0;
          eco.Webs.push({
            active: true,
            severed: false,
            owner: sk,
            victim: nearestPrey,
            fromX: sk.x,
            fromY,
            toX: nearestPrey.x,
            toY,
            midX: (sk.x + nearestPrey.x) * 0.5,
            midY: (fromY + toY) * 0.5 + 1.2,
            phase: 0,
          });
        }
      }

      // Also allow mature Black Goo nodes to snare nearby Critters/Children within 5 cells
      for (let i = 0; i < eco.GooNodes.length; i++) {
        const g = eco.GooNodes[i];
        if (g.webCooldown > 0 || eco.Webs.length >= 3) continue;
        const victim =
          eco.Children.find((c) => !c.snared && Math.abs(c.x - g.x) <= 5.2) ||
          eco.Critters.find((c) => !c.snared && Math.abs(c.x - g.x) <= 4.5);
        if (victim) {
          g.webCooldown = 190;
          victim.snared = true;
          const gCol = Math.max(1, Math.min(COARSE_W - 2, Math.round(g.x)));
          const vCol = Math.max(1, Math.min(COARSE_W - 2, Math.round(victim.x)));
          const fromY = (Blocks[gCol] || 15) + 1.0;
          const toY = (Blocks[vCol] || 15) + 1.0;
          eco.Webs.push({
            active: true,
            severed: false,
            owner: g,
            victim,
            fromX: g.x,
            fromY,
            toX: victim.x,
            toY,
            midX: (g.x + victim.x) * 0.5,
            midY: (fromY + toY) * 0.5 + 1.0,
            phase: 0,
          });
        }
      }

      // --- 6. Update Town Compute Vats (IN Port -> 7x7 Live CA -> Progress Bar -> OUT Port Birth!) ---
      for (let i = 0; i < eco.ComputeVats.length; i++) {
        const vat = eco.ComputeVats[i];
        if (vat.portFlash > 0) vat.portFlash--;
        const vatElev = Blocks[vat.x] || 16;
        vat.inPortX = vat.x - 2;
        vat.inPortY = vatElev + 2;
        vat.outPortX = vat.x + 2;
        vat.outPortY = vatElev + 2;

        // Player standing at IN port with Aetherium or Binary Energy can also catalyze the Vat!
        if (vat.state === "IDLE" && Math.abs(P.x - vat.inPortX) <= 1.5 && P.e >= 4 && frameCount % 30 === 0) {
          igniteVat(vat, [95, 245, 255], world);
        }

        if (frameCount % 2 === 0) {
          stepVatCellularAutomata(vat, frameCount);
        }

        if (vat.state === "COMPUTING") {
          vat.progress += 0.55;
          if (vat.progress >= 100) {
            vat.progress = 0;
            vat.state = "IDLE";
            vat.portFlash = 28;
            vat.births++;

            // Birth a new 5x5 / 7x7 Permeable Lipid-Membrane Roaming Automaton from the right OUT port!
            if (eco.Automata.length < 4) {
              eco.Automata.push(createRoamingAutomaton(vat.outPortX + 1.0, 0.14, vat.dnaIndex));
            }
            for (let p = 0; p < 14; p++) {
              spawnSubParticle(
                vat.outPortX,
                vat.outPortY,
                Math.random() * 1.6 + 0.2,
                (Math.random() - 0.5) * 1.4,
                95,
                255,
                210,
                26
              );
            }
            if (global.SlopesAudio && global.SlopesAudio.playAetheriumChime) {
              global.SlopesAudio.playAetheriumChime();
            }
            if (world.announceSky && vat.births === 1) {
              world.announceSky("COMPUTE VAT READY!", "LIPID AUTOMATON BORN", 165);
            }
          }
        }
      }

      // --- 7. Update 5x5 Permeable Lipid-Membrane Roaming Automata ---
      for (let i = eco.Automata.length - 1; i >= 0; i--) {
        const au = eco.Automata[i];
        au.phase += 0.16;
        if (frameCount % 2 === 0) {
          stepRoamingAutomatonCA(au, frameCount >> 1);
        }

        // Seek nearest Black Goo node or active Web Snare to neutralize!
        let targetX = null;
        if (eco.Webs.length > 0) {
          targetX = eco.Webs[0].midX;
        } else if (eco.GooNodes.length > 0) {
          targetX = eco.GooNodes[0].x;
        } else if (au.carryingSpore) {
          const idleVat = eco.ComputeVats.find((v) => v.state === "IDLE");
          if (idleVat) targetX = idleVat.inPortX;
        }

        if (targetX !== null) {
          au.vx = (targetX >= au.x ? 1 : -1) * 0.14;
        }

        au.x += au.vx;
        if (au.x < 6 || au.x > COARSE_W - 7) {
          au.vx = -au.vx;
          au.x += au.vx * 2;
        }

        const auCol = Math.max(1, Math.min(COARSE_W - 2, Math.round(au.x)));
        const auElev = Blocks[auCol] || 15;

        // TERRA_SHAPER_MEMBRANE (or any roaming automaton on steep ledges) grades steep slopes into flat terraces!
        if (frameCount % 48 === 0 && auCol > 8 && auCol < COARSE_W - 9 && auElev > seaLevel + 2) {
          const nextCol = auCol + (au.vx >= 0 ? 1 : -1);
          const diff = Blocks[nextCol] - Blocks[auCol];
          if (Math.abs(diff) >= 3) {
            if (diff > 0) {
              Blocks[nextCol]--;
              Blocks[auCol]++;
            } else {
              Blocks[auCol]--;
              Blocks[nextCol]++;
            }
          }
        }

        // Neutralize Black Goo on contact through permeable lipid bilayer
        for (let gIdx = eco.GooNodes.length - 1; gIdx >= 0; gIdx--) {
          const g = eco.GooNodes[gIdx];
          if (Math.abs(g.x - au.x) <= 2.2) {
            g.radius -= 0.045;
            if (frameCount % 5 === 0) {
              spawnSubParticle(g.x, auElev + 1, (Math.random() - 0.5) * 1.2, -0.9, 95, 255, 220, 18);
            }
            if (g.radius <= 0.45) {
              eco.GooNodes.splice(gIdx, 1);
              au.carryingSpore = true; // Recycle purified carbon into a vat catalyst!
            }
          }
        }

        // Sever sticky webs trapping children/critters
        for (let wIdx = eco.Webs.length - 1; wIdx >= 0; wIdx--) {
          const w = eco.Webs[wIdx];
          if (Math.abs(w.midX - au.x) <= 2.2 || Math.abs(w.toX - au.x) <= 2.2) {
            if (w.victim) {
              w.victim.snared = false;
              w.victim.soulLight = 1.0;
            }
            eco.Webs.splice(wIdx, 1);
          }
        }

        // Deliver recycled catalyst spore into an IDLE Vat's IN port
        if (au.carryingSpore) {
          for (let vIdx = 0; vIdx < eco.ComputeVats.length; vIdx++) {
            const vat = eco.ComputeVats[vIdx];
            if (vat.state === "IDLE" && Math.abs(au.x - vat.inPortX) <= 1.6) {
              au.carryingSpore = false;
              igniteVat(vat, [110, 255, 225], world);
            }
          }
        }
      }

      // --- 8. Update Hyper-Intelligent Seer Crows (Corvus Oracle AI) ---
      const claimedTargets = new Set();
      for (let i = 0; i < eco.SeerCrows.length; i++) {
        const crow = eco.SeerCrows[i];
        crow.wingPhase += 0.34;
        if (crow.callCooldown > 0) crow.callCooldown--;

        // Re-evaluate world rollout periodically or when current plan completes
        crow.evalTimer--;
        if (crow.evalTimer <= 0 || !crow.plan) {
          crow.evalTimer = 22;
          crow.plan = evaluateWorldThreatsAndOpportunities(eco, world, crow, claimedTargets);
          crow.state = crow.plan.type;
        }
        if (crow.plan && crow.plan.targetRef) {
          claimedTargets.add(crow.plan.targetRef);
        }

        const plan = crow.plan;

        if (crow.state === CROW_BEHAVIORS.WEB_SEVER) {
          // BEHAVIOR 3: High-speed dive through sticky Black Goo web to sever it!
          const web = plan && plan.meta ? plan.meta.web : eco.Webs[0];
          if (!web || !web.active) {
            crow.evalTimer = 0;
            continue;
          }
          const dx = web.midX - crow.x;
          const dy = web.midY - crow.y;
          crow.vx = Math.max(-0.65, Math.min(0.65, dx * 0.16));
          crow.vy = Math.max(-0.65, Math.min(0.65, dy * 0.16));
          crow.x += crow.vx;
          crow.y += crow.vy;
          crow.facing = crow.vx >= 0 ? 1 : -1;

          if (Math.hypot(dx, dy) <= 1.8) {
            // Sever the web with a 7x7 silver-cyan beak slash!
            web.active = false;
            web.severed = true;
            if (web.victim) {
              web.victim.snared = false;
              web.victim.soulLight = 1.0;
            }
            eco.SlashArcs.push({
              cx: web.midX,
              cy: web.midY,
              dir: crow.facing,
              life: 14,
            });
            for (let p = 0; p < 10; p++) {
              spawnSubParticle(
                web.midX,
                web.midY,
                (Math.random() - 0.5) * 1.8,
                (Math.random() - 0.5) * 1.8,
                185,
                250,
                255,
                18
              );
            }
            const idx = eco.Webs.indexOf(web);
            if (idx >= 0) eco.Webs.splice(idx, 1);
            if (global.SlopesAudio && global.SlopesAudio.playTineBell) {
              global.SlopesAudio.playTineBell(81, 0.7, 0.15);
            }
            crow.vy = 0.45;
            crow.evalTimer = 0;
          }
        } else if (crow.state === CROW_BEHAVIORS.VAT_CATALYST) {
          // BEHAVIOR 2: Pluck 2x2 fern spore/crystal mote & drop into Compute Vat's left IN port!
          const vat = plan && plan.meta ? plan.meta.vat : eco.ComputeVats[0];
          if (!vat || vat.state !== "IDLE") {
            crow.evalTimer = 0;
            continue;
          }

          if (!crow.carryingSpore) {
            const src = plan && plan.meta ? plan.meta.source : null;
            if (!src) {
              crow.evalTimer = 0;
              continue;
            }
            const dx = src.x - crow.x;
            const dy = src.y - crow.y;
            crow.vx = Math.max(-0.48, Math.min(0.48, dx * 0.12));
            crow.vy = Math.max(-0.48, Math.min(0.48, dy * 0.12));
            crow.x += crow.vx;
            crow.y += crow.vy;
            crow.facing = crow.vx >= 0 ? 1 : -1;

            if (Math.hypot(dx, dy) <= 1.6) {
              crow.carryingSpore = true;
              crow.sporeColor = src.kind === "crystal" ? [95, 245, 255] : [110, 255, 165];
              if (src.kind === "fern" && src.ref) {
                src.ref.hasSpore = false;
              }
              spawnSubParticle(src.x, src.y, 0, -0.8, crow.sporeColor[0], crow.sporeColor[1], crow.sporeColor[2], 16);
            }
          } else {
            // Fly to Vat's left IN port (vat.inPortX, vat.inPortY + 2)
            const targetX = vat.inPortX;
            const targetY = vat.inPortY + 1.5;
            const dx = targetX - crow.x;
            const dy = targetY - crow.y;
            crow.vx = Math.max(-0.48, Math.min(0.48, dx * 0.13));
            crow.vy = Math.max(-0.48, Math.min(0.48, dy * 0.13));
            crow.x += crow.vx;
            crow.y += crow.vy;
            crow.facing = crow.vx >= 0 ? 1 : -1;

            if (Math.hypot(dx, dy) <= 1.5) {
              crow.carryingSpore = false;
              igniteVat(vat, crow.sporeColor, world);
              crow.vy = 0.4;
              crow.evalTimer = 0;
            }
          }
        } else if (crow.state === CROW_BEHAVIORS.GUIDE_MONOLITH) {
          // BEHAVIOR 4: Land near Player Monolith, hop twice toward objective, emit soft harmonic call!
          const obj = plan && plan.meta && plan.meta.objective ? plan.meta.objective : { x: P.x + 12, kind: "dna" };
          const dirToObj = obj.x >= P.x ? 1 : -1;
          const perchX = Math.max(4, Math.min(COARSE_W - 5, P.x + dirToObj * (3 + crow.hopCount * 1.4)));
          const perchY = (Blocks[Math.round(perchX)] || P.y) + 1;

          const dx = perchX - crow.x;
          const dy = perchY - crow.y;

          if (Math.hypot(dx, dy) > 1.8) {
            crow.vx = Math.max(-0.42, Math.min(0.42, dx * 0.12));
            crow.vy = Math.max(-0.42, Math.min(0.42, dy * 0.12));
            crow.x += crow.vx;
            crow.y += crow.vy;
            crow.facing = dirToObj;
          } else {
            // Landed near Monolith: execute the two deliberate directional hops!
            crow.x = perchX;
            crow.facing = dirToObj;
            crow.hopWait++;
            const hopArc = crow.hopWait % 16 < 7 ? 1.1 : 0;
            crow.y = perchY + hopArc;

            if (crow.hopWait % 16 === 1) {
              crow.hopCount = (crow.hopCount + 1) % 3;
              if (crow.callCooldown <= 0 && Math.abs(P.x - crow.x) <= 10) {
                crow.callCooldown = 140;
                if (global.SlopesAudio && global.SlopesAudio.playTineBell) {
                  global.SlopesAudio.playTineBell(74, 0.9, 0.12);
                }
              }
            }
          }
        } else {
          // BEHAVIOR 1: OMEN_CIRCLE — Circle in a banking figure-8 above nascent Black Goo or Skeksis ambush!
          crow.orbitAngle += 0.11;
          const centerX = plan ? plan.targetX : 60;
          const centerY = plan ? plan.targetY : 28;
          const desiredX = centerX + Math.cos(crow.orbitAngle) * 4.5;
          const desiredY = centerY + Math.sin(crow.orbitAngle * 2) * 1.4;
          crow.vx = (desiredX - crow.x) * 0.14;
          crow.vy = (desiredY - crow.y) * 0.14;
          crow.x += crow.vx;
          crow.y += crow.vy;
          crow.facing = -Math.sin(crow.orbitAngle) >= 0 ? 1 : -1;
        }
      }

      // --- 9. Update 7x7 Native Sub-Particles & Beak Slash Arcs ---
      for (let i = eco.SubParticles.length - 1; i >= 0; i--) {
        const pt = eco.SubParticles[i];
        pt.px += pt.vx;
        pt.py += pt.vy;
        pt.vy += 0.06;
        pt.life--;
        if (pt.life <= 0) {
          eco.SubParticles.splice(i, 1);
        }
      }
      for (let i = eco.SlashArcs.length - 1; i >= 0; i--) {
        eco.SlashArcs[i].life--;
        if (eco.SlashArcs[i].life <= 0) {
          eco.SlashArcs.splice(i, 1);
        }
      }
    }

    // ========================================================================
    // RENDER MULTI-SCALE ECOLOGY (2x2, 3x3, 5x5, 7x7) ONTO 840x525 BUFFER
    // ========================================================================
    function render(renderer, world) {
      const {
        COARSE_H: H,
        SCALE: S,
        fillNativeRect,
        subPix2,
        subPix3,
        subPix5,
        subPix7,
        nativeLine7,
      } = renderer;
      const Blocks = world.Blocks;
      const frameCount = world.frameCount || 0;

      // ----------------------------------------------------------------------
      // A. BURIED DNA HELIX RELICS (3x3 + 7x7 Double-Helix Base Pairs)
      // ----------------------------------------------------------------------
      if (world.Relics) {
        for (let i = 0; i < world.Relics.length; i++) {
          const rel = world.Relics[i];
          if (rel.type !== "dna") continue;
          const cy = H - rel.elev;
          for (let sy = -2; sy <= 4; sy++) {
            const wave = Math.sin(frameCount * 0.16 + sy * 0.9 + rel.sparkle);
            const sxA = Math.round(3 + wave * 2.2);
            const sxB = Math.round(3 - wave * 2.2);
            // Connecting base-pair rung in 7x7 native pixels
            const minX = Math.min(sxA, sxB);
            const maxX = Math.max(sxA, sxB);
            for (let rx = minX + 1; rx < maxX; rx++) {
              subPix7(rel.x, cy, rx, sy + 2, 255, 220, 110, 0.75);
            }
            // Twin phosphate-sugar strands in cyan & magenta
            subPix7(rel.x, cy, sxA, sy + 2, 85, 245, 255, 1);
            subPix7(rel.x, cy, sxB, sy + 2, 255, 105, 210, 1);
          }
        }
      }

      // ----------------------------------------------------------------------
      // B. 2x2 SCALE: DELICATE COLOR-CYCLING FERN FRONDS, MOSS & SMALL CRITTERS
      // ----------------------------------------------------------------------
      for (let i = 0; i < eco.Ferns.length; i++) {
        const f = eco.Ferns[i];
        const baseH = Blocks[f.x];
        if (baseH <= 0) continue;
        const cy = H - baseH;

        // Basal moss cushion in 2x2 sub-pixels
        subPix2(f.x, cy, 0, -1, 46, 168, 122, 0.92);
        subPix2(f.x, cy, 1, -1, 58, 188, 134, 0.92);

        // Unfurling color-cycling fern fronds (2x2 sub-pixel pinnae)
        for (let fr = -1; fr <= 1; fr++) {
          const sway = Math.round(Math.sin(f.phase + fr * 0.8) * 0.7);
          for (let h = 1; h <= 4; h++) {
            const cyc = 0.5 + 0.5 * Math.sin(f.hueShift + h * 0.75 + fr);
            const r = (48 + cyc * 95) | 0;
            const g = (185 + cyc * 68) | 0;
            const b = (135 + (1 - cyc) * 90) | 0;
            const sx = fr * h + sway;
            const sy = -1 - h;
            subPix2(f.x, cy, sx, sy, r, g, b, 0.95);
          }
        }

        // Glowing 2x2 catalyst spore at frond apex (ready for Seer Crow or Gatherer!)
        if (f.hasSpore) {
          const pulse = 0.65 + 0.35 * Math.sin(frameCount * 0.2 + f.x);
          subPix2(
            f.x,
            cy,
            0,
            -6,
            (110 * pulse) | 0,
            255,
            (195 * pulse) | 0,
            1
          );
        }
      }

      // Small 2x2 Forest Critters (Coastal Hoppers / Bioluminescent Beetles)
      for (let i = 0; i < eco.Critters.length; i++) {
        const cr = eco.Critters[i];
        const col = Math.max(0, Math.min(COARSE_W - 1, Math.round(cr.x)));
        const h = Blocks[col];
        if (h <= 0) continue;
        const cy = H - h - Math.round(cr.hopY);
        const leg = (Math.floor(cr.phase) & 1);
        // Carapace & antennae in 2x2 sub-grid
        subPix2(cr.x, cy, 0, -2, 110, 235, 175, 1);
        subPix2(cr.x, cy, 1, -2, 165, 255, 205, 1);
        subPix2(cr.x, cy, cr.vx >= 0 ? 2 : -1, -3, 255, 230, 115, 0.95);
        subPix2(cr.x, cy, leg, -1, 70, 175, 130, 0.95);
      }

      // ----------------------------------------------------------------------
      // C. TOWN COMPUTE VATS / SERVER LAKES (1x1 Frame + 5x5 Ports + 7x7 Live CA)
      // ----------------------------------------------------------------------
      for (let i = 0; i < eco.ComputeVats.length; i++) {
        const vat = eco.ComputeVats[i];
        const baseH = Blocks[vat.x] || 16;
        const topCy = H - baseH - 4; // 4 coarse cells tall (28 native pixels)
        const leftCx = vat.x - 2;    // 5 coarse cells wide (35 native pixels)

        const px0 = leftCx * S;
        const py0 = topCy * S;
        const vatW = 5 * S; // 35 native pixels
        const vatH = 4 * S; // 28 native pixels

        // 1. Anodized Teak/Steel Chassis Pedestal & Header Bar
        fillNativeRect(px0 + 3, py0 + 2, vatW - 6, vatH - 2, 14, 30, 36, 0.94);
        fillNativeRect(px0 + 2, py0 + vatH - 4, vatW - 4, 4, 38, 66, 74, 1); // Base plinth
        fillNativeRect(px0 + 3, py0 + 2, vatW - 6, 5, 34, 60, 68, 1);        // Top header bar
        // Glass walls (left & right vertical pillars)
        fillNativeRect(px0 + 6, py0 + 7, 2, vatH - 11, 88, 186, 196, 0.85);
        fillNativeRect(px0 + vatW - 8, py0 + 7, 2, vatH - 11, 88, 186, 196, 0.85);

        // 2. Crisp Pixel Progress Bar inside Top Header Beam (21 native pixels wide)
        const barX = px0 + 7;
        const barY = py0 + 4;
        const barW = 21;
        fillNativeRect(barX, barY, barW, 2, 8, 18, 22, 1);
        const fillW = vat.state === "COMPUTING"
          ? Math.max(2, Math.round((vat.progress / 100) * barW))
          : (frameCount >> 4) & 1 ? 2 : 1;
        const barCol = vat.state === "COMPUTING" ? [85, 255, 195] : [255, 195, 75];
        fillNativeRect(barX, barY, fillW, 2, barCol[0], barCol[1], barCol[2], 1);

        // 3. Live 7x7 Native-Pixel 5-State C-Evolved Cellular Automata Substrate inside Glass Chamber!
        const caOriginX = px0 + 8;
        const caOriginY = py0 + 9;
        const { caW, caH, gridA } = vat;
        for (let cy = 0; cy < caH; cy++) {
          for (let cx = 0; cx < caW; cx++) {
            const st = gridA[cy * caW + cx];
            if (st === 0) {
              // State 0 (EMPTY_FLUID): Translucent nutrient broth
              fillNativeRect(caOriginX + cx, caOriginY + cy, 1, 1, 18, 52, 62, 0.65);
            } else if (st === 1) {
              // State 1 (LIPID_MEMBRANE_SHELL): Amphiphilic emerald-teal lipid shell
              fillNativeRect(caOriginX + cx, caOriginY + cy, 1, 1, 52, 205, 155, 0.92);
            } else if (st === 2) {
              // State 2 (ACTIVE_CORE_COMPUTE_A): Deep bioluminescent cyan compute core
              fillNativeRect(caOriginX + cx, caOriginY + cy, 1, 1, 68, 205, 245, 0.95);
            } else if (st === 3) {
              // State 3 (EXCITED_SIGNAL_COMPUTE_B): Firing cyan-white signal wavefront
              fillNativeRect(caOriginX + cx, caOriginY + cy, 1, 1, 165, 255, 255, 1);
            } else {
              // State 4 (OUTPUT_EFFECTOR_STATE): Golden-amber effector transducer
              fillNativeRect(caOriginX + cx, caOriginY + cy, 1, 1, 255, 215, 95, 1);
            }
          }
        }

        // 4. Left IN Port (5x5 Sub-Grid Receptor Funnel at vat.x - 2)
        const inCy = H - baseH - 2;
        const inActive = vat.state === "COMPUTING" || vat.portFlash > 0;
        const inRingCol = inActive ? [95, 255, 185] : [255, 185, 65];
        // Funnel rim in 5x5 sub-pixels
        subPix5(vat.x - 2, inCy, 0, 0, inRingCol, 1);
        subPix5(vat.x - 2, inCy, 0, 4, inRingCol, 1);
        subPix5(vat.x - 2, inCy, 1, 1, inRingCol, 1);
        subPix5(vat.x - 2, inCy, 1, 3, inRingCol, 1);
        subPix5(vat.x - 2, inCy, 2, 2, 240, 255, 220, 1); // Intake chevron tip >

        // 5. Right OUT Port (5x5 Sub-Grid Discharge Nozzle at vat.x + 2)
        const outCy = H - baseH - 2;
        const outCol = vat.portFlash > 0 ? [150, 255, 255] : [75, 215, 205];
        subPix5(vat.x + 2, outCy, 2, 1, outCol, 1);
        subPix5(vat.x + 2, outCy, 2, 3, outCol, 1);
        subPix5(vat.x + 2, outCy, 3, 1, outCol, 1);
        subPix5(vat.x + 2, outCy, 3, 3, outCol, 1);
        subPix5(vat.x + 2, outCy, 4, 2, 220, 255, 245, 1); // Output nozzle >
      }

      // ----------------------------------------------------------------------
      // D. 5x5 & 7x7 SCALE: PERMEABLE LIPID-MEMBRANE ROAMING AUTOMATA
      // ----------------------------------------------------------------------
      for (let i = 0; i < eco.Automata.length; i++) {
        const au = eco.Automata[i];
        const col = Math.max(0, Math.min(COARSE_W - 1, Math.round(au.x)));
        const h = Blocks[col];
        if (h <= 0) continue;
        const cy = H - h - 1;

        // 5x5 Permeable Lipid Bilayer Ring (12 amphiphilic membrane nodes)
        for (let a = 0; a < 12; a++) {
          const ang = (a / 12) * Math.PI * 2;
          const wobble = 2.1 + 0.35 * Math.sin(au.phase + a * 1.5);
          const sx = Math.round(2 + Math.cos(ang) * wobble);
          const sy = Math.round(2 + Math.sin(ang) * wobble);
          const isHead = (a & 1) === 0;
          if (isHead) {
            subPix5(au.x, cy, sx, sy, 255, 215, 95, 0.95); // Golden phosphate head
          } else {
            subPix5(au.x, cy, sx, sy, 85, 245, 225, 0.92); // Cyan lipid tail pore
          }
        }

        // 7x7 Live C-Evolved 5-State CA Cytoplasm & Organelle Core inside the Lipid Membrane!
        if (au.cellGrid) {
          for (let sy = 0; sy < 7; sy++) {
            for (let sx = 0; sx < 7; sx++) {
              const st = au.cellGrid[sy * 7 + sx];
              if (st === 1) {
                subPix7(au.x, cy, sx, sy, 62, 215, 165, 0.85);
              } else if (st === 2) {
                subPix7(au.x, cy, sx, sy, 95, 230, 255, 0.95);
              } else if (st === 3) {
                subPix7(au.x, cy, sx, sy, 185, 255, 255, 1);
              } else if (st === 4) {
                subPix7(au.x, cy, sx, sy, 255, 225, 105, 1);
              }
            }
          }
        }
      }

      // ----------------------------------------------------------------------
      // E. 3x3 & 7x7 SCALE: CREEPING BLACK GOO CELLS & STICKY WEB STRANDS
      // ----------------------------------------------------------------------
      for (let i = 0; i < eco.GooNodes.length; i++) {
        const g = eco.GooNodes[i];
        const span = Math.ceil(g.radius);
        for (let dx = -span; dx <= span; dx++) {
          const gx = Math.max(0, Math.min(COARSE_W - 1, Math.round(g.x + dx)));
          const gh = Blocks[gx];
          if (gh <= 0) continue;
          const gy = H - gh;
          for (let sx = 0; sx < 3; sx++) {
            const wob = Math.sin(g.pulse + dx * 1.3 + sx);
            // Dark cancerous black-violet interior & pulsing magenta-violet membrane
            subPix3(gx, gy, sx, -1, 22, 8, 34, 0.96);
            subPix3(gx, gy, sx, 0, 18, 6, 28, 0.96);
            if (wob > 0.1) {
              subPix3(gx, gy, sx, -2, 145, 32, 170, 0.9);
            }
            if (wob > 0.65) {
              subPix7(gx, gy, sx * 2 + 1, -4, 235, 75, 255, 0.95);
            }
          }
        }
      }

      // Sticky Black Goo Web Strands & Soul-Light Siphoning Streams
      for (let i = 0; i < eco.Webs.length; i++) {
        const w = eco.Webs[i];
        if (!w.active) continue;
        w.phase += 0.16;

        const px0 = w.fromX * S + 3;
        const py0 = (H - w.fromY) * S + 3;
        const pxMid = w.midX * S + 3;
        const pyMid = (H - w.midY) * S + 3 + Math.sin(w.phase) * 2;
        const px1 = w.toX * S + 3;
        const py1 = (H - w.toY) * S + 3;

        // Primary sticky silk catenary in 7x7 native pixels
        nativeLine7(px0, py0, pxMid, pyMid, 195, 145, 220, 0.9, 1);
        nativeLine7(pxMid, pyMid, px1, py1, 195, 145, 220, 0.9, 1);
        // Secondary cross-web strand
        nativeLine7(px0, py0 + 3, px1, py1 - 2, 140, 85, 175, 0.75, 2);

        // 3x3 sticky web wrap around snared victim
        const vCy = H - w.toY;
        subPix3(w.toX, vCy, -1, -1, 185, 130, 215, 0.9);
        subPix3(w.toX, vCy, 1, -2, 185, 130, 215, 0.9);
        subPix3(w.toX, vCy, 0, 0, 145, 85, 180, 0.9);

        // Streaming golden-cyan Soul-Light motes being drained along the web toward the Skeksis/Goo!
        for (let m = 0; m < 3; m++) {
          const u = ((w.phase * 0.25 + m / 3) % 1);
          // Interpolate from victim (1) -> owner (0)
          const mx = px1 + (px0 - px1) * u;
          const my = py1 + (py0 - py1) * u - Math.sin(u * Math.PI) * 3;
          fillNativeRect(Math.round(mx), Math.round(my), 2, 2, 255, 235, 125, 0.95);
        }
      }

      // ----------------------------------------------------------------------
      // F. 3x3 SCALE: SKEKSIS BIRD-CULTISTS (Dark Purple-Crimson Beaked Cultists)
      // ----------------------------------------------------------------------
      for (let i = 0; i < eco.Skeksis.length; i++) {
        const sk = eco.Skeksis[i];
        const col = Math.max(0, Math.min(COARSE_W - 1, Math.round(sk.x)));
        const h = Blocks[col];
        if (h <= 0) continue;
        const cy = H - h;
        const dir = sk.facing;
        const step = Math.floor(sk.stride) & 1;

        const robeDark = sk.flash > 0 ? [255, 220, 240] : [92, 16, 52];
        const robeHi   = sk.flash > 0 ? [255, 255, 255] : [156, 32, 82];
        const beakCol  = [228, 210, 192];
        const eyeCol   = [255, 42, 108];

        // Hunched ragged carapace & cloak (-5..0 in 3x3 sub-grid)
        subPix3(sk.x, cy, 0, -2, robeDark, 1);
        subPix3(sk.x, cy, -dir, -2, robeHi, 1);
        subPix3(sk.x, cy, 0, -3, robeHi, 1);
        subPix3(sk.x, cy, -dir, -3, robeDark, 1);
        subPix3(sk.x, cy, -dir, -4, robeHi, 1); // Hunched dorsal ridge

        // Head & glowing magenta-red cultist eye
        subPix3(sk.x, cy, 0, -4, robeDark, 1);
        subPix3(sk.x, cy, dir, -4, eyeCol, 1);

        // Long projecting hooked bone beak (2 sub-pixels forward!)
        subPix3(sk.x, cy, dir * 2, -4, beakCol, 1);
        subPix3(sk.x, cy, dir * 3, -3, beakCol, 0.95);

        // Taloned legs
        subPix3(sk.x, cy, -dir + step, -1, 55, 12, 34, 1);
        subPix3(sk.x, cy, dir - step, -1, 55, 12, 34, 1);

        // Dark-crystal staff held in front
        subPix3(sk.x, cy, dir * 2, -2, 120, 75, 140, 0.95);
        subPix3(sk.x, cy, dir * 2, -5, 225, 65, 255, 0.95);
      }

      // ----------------------------------------------------------------------
      // G. 3x3 SCALE: ORANGE PEOPLE & CHILDREN (Warm Tangerine-Ochre Villagers)
      // ----------------------------------------------------------------------
      for (let i = 0; i < eco.OrangePeople.length; i++) {
        const op = eco.OrangePeople[i];
        const col = Math.max(0, Math.min(COARSE_W - 1, Math.round(op.x)));
        const h = Blocks[col];
        if (h <= 0) continue;
        const cy = H - h;
        const dir = op.facing;
        const step = Math.floor(op.stride) & 1;

        // Legs (walking stride in 3x3 sub-pixels)
        subPix3(op.x, cy, step ? -1 : 0, -1, 185, 78, 22, 1);
        subPix3(op.x, cy, step ? 1 : 0, -1, 185, 78, 22, 1);

        // Vibrant Tangerine-Orange Coat / Tunic
        subPix3(op.x, cy, 0, -2, 255, 134, 34, 1);
        subPix3(op.x, cy, -dir, -2, 228, 102, 22, 1);
        subPix3(op.x, cy, 0, -3, 255, 156, 52, 1);

        // Warm Apricot Head + dark eye dot
        subPix3(op.x, cy, 0, -4, 255, 216, 168, 1);
        subPix7(op.x, cy, dir >= 0 ? 2 : 0, -11, 24, 16, 12, 1);

        // Held Resource Bundle or Grading Tool!
        if (op.carrying === "spore") {
          subPix3(op.x, cy, dir, -3, 95, 255, 175, 1);
        } else if (op.carrying === "soil") {
          subPix3(op.x, cy, dir, -3, 235, 185, 85, 1);
        } else if (op.role === "guardian") {
          // Warm amber lantern shield
          subPix3(op.x, cy, dir, -3, 255, 235, 120, 1);
        } else if (op.workTimer > 0) {
          // Swinging grading pickaxe
          subPix3(op.x, cy, dir * 2, -3 + (op.workTimer & 1), 210, 230, 240, 1);
        }
      }

      // 3x3 Orange Children (Smaller stature + Golden Soul-Light Halo!)
      for (let i = 0; i < eco.Children.length; i++) {
        const ch = eco.Children[i];
        const col = Math.max(0, Math.min(COARSE_W - 1, Math.round(ch.x)));
        const h = Blocks[col];
        if (h <= 0) continue;
        const cy = H - h - Math.round(ch.hopY);
        const step = Math.floor(ch.stride) & 1;

        // Feet & Marigold-Orange Child Tunic
        subPix3(ch.x, cy, step, -1, 245, 130, 35, 1);
        subPix3(ch.x, cy, 0, -2, 255, 168, 52, 1);
        // Head
        subPix3(ch.x, cy, 0, -3, 255, 222, 175, 1);

        // Golden Soul-Light Halo above child's head (dims if snared, flashes "!" if trapped)
        const sl = ch.soulLight;
        subPix7(ch.x, cy, 1, -11, (255 * sl) | 0, (245 * sl) | 0, (165 * sl) | 0, 0.95);
        if (ch.snared && (frameCount >> 2) & 1) {
          // Bright distress "!" beacon above snared child
          subPix3(ch.x, cy, 0, -5, 255, 85, 95, 1);
          subPix3(ch.x, cy, 0, -6, 255, 225, 110, 1);
        }
      }

      // ----------------------------------------------------------------------
      // H. 3x3 & 7x7 SCALE: HYPER-INTELLIGENT SEER CROWS (Corvus Oracle AI)
      // ----------------------------------------------------------------------
      for (let i = 0; i < eco.SeerCrows.length; i++) {
        const crow = eco.SeerCrows[i];
        const cy = H - crow.y;
        const dir = crow.facing;
        const flap = Math.round(Math.sin(crow.wingPhase) * 1.4);

        // 1. Subtle Visual Cue for Active Oracle Behavior:
        if (crow.state === CROW_BEHAVIORS.OMEN_CIRCLE && crow.plan) {
          // Rotating 7x7 Omen Halo & faint dotted sightline to threat below
          for (let m = 0; m < 4; m++) {
            const a = crow.orbitAngle * 2 + (m * Math.PI) / 2;
            const ox = Math.round(1 + Math.cos(a) * 5);
            const oy = Math.round(-1 + Math.sin(a) * 3);
            subPix7(crow.x, cy, ox, oy, 255, 195, 95, 0.85);
          }
        } else if (crow.state === CROW_BEHAVIORS.GUIDE_MONOLITH) {
          // Directional Oracle Chevron (>> or <<) + harmonic call ring above crow
          const chevCol = [95, 245, 255];
          subPix7(crow.x, cy, dir * 2, -6, chevCol[0], chevCol[1], chevCol[2], 0.95);
          subPix7(crow.x, cy, dir * 3, -5, chevCol[0], chevCol[1], chevCol[2], 0.95);
          subPix7(crow.x, cy, dir * 2, -4, chevCol[0], chevCol[1], chevCol[2], 0.95);
        }

        // 2. Sleek Obsidian-Indigo Crow Body & Iridescent Wing-Tips in 3x3 Sub-Pixels
        const bodyCol = [20, 26, 42];
        const wingCol = [38, 52, 84];
        const beakCol = [215, 225, 240];

        // Core torso & tail feathers
        subPix3(crow.x, cy, 0, 0, bodyCol, 1);
        subPix3(crow.x, cy, -dir, 0, wingCol, 1);
        subPix3(crow.x, cy, -dir * 2, 1, bodyCol, 0.95);

        // Head, bright cyan-gold oracle eye & sharp beak
        subPix3(crow.x, cy, dir, -1, bodyCol, 1);
        subPix7(crow.x, cy, dir >= 0 ? 4 : -2, -2, 115, 245, 255, 1);
        subPix3(crow.x, cy, dir * 2, -1, beakCol, 1);

        // Animated wings (flapping in flight, folded when hopping near Monolith)
        if (crow.state !== CROW_BEHAVIORS.GUIDE_MONOLITH || crow.hopWait % 16 < 7) {
          subPix3(crow.x, cy, 0, -1 + flap, wingCol, 0.95);
          subPix3(crow.x, cy, -dir, -1 - flap, [65, 115, 165], 0.9);
        } else {
          // Perched legs
          subPix7(crow.x, cy, 1, 3, 185, 195, 210, 1);
          subPix7(crow.x, cy, 3, 3, 185, 195, 210, 1);
        }

        // 3. If in VAT_CATALYST mode carrying a 2x2 fern/crystal spore, draw it glowing in the beak!
        if (crow.carryingSpore) {
          const sc = crow.sporeColor || [95, 255, 175];
          subPix2(crow.x + dir * 0.6, cy, 0, 0, sc[0], sc[1], sc[2], 1);
        }
      }

      // ----------------------------------------------------------------------
      // I. 7x7 NATIVE-PIXEL BEAK-SLASH ARCS & SHIMMERING SUB-PARTICLES
      // ----------------------------------------------------------------------
      for (let i = 0; i < eco.SlashArcs.length; i++) {
        const sl = eco.SlashArcs[i];
        const px = sl.cx * S + 3;
        const py = (H - sl.cy) * S + 3;
        const alpha = sl.life / 14;
        nativeLine7(px - 6 * sl.dir, py - 5, px + 6 * sl.dir, py + 5, 195, 255, 255, alpha, 1);
        nativeLine7(px - 5 * sl.dir, py - 6, px + 7 * sl.dir, py + 4, 255, 255, 255, alpha, 1);
      }

      for (let i = 0; i < eco.SubParticles.length; i++) {
        const pt = eco.SubParticles[i];
        fillNativeRect(
          Math.round(pt.px),
          Math.round(pt.py),
          2,
          2,
          pt.r,
          pt.g,
          pt.b,
          pt.life / pt.maxLife
        );
      }
    }

    return {
      eco,
      createComputeVat,
      createRoamingAutomaton,
      igniteVat,
      evolveVatDna,
      populateScreen,
      onPlayerSonicTamp,
      update,
      render,
    };
  }

  // Expose on global window object (and CommonJS if tested in Node) for seamless integration
  const api = {
    COARSE_W,
    COARSE_H,
    SCALE,
    NATIVE_W,
    NATIVE_H,
    CROW_BEHAVIORS,
    DISCOVERED_DNA,
    EQUILIBRIUM_PARAMS,
    stepVatCell,
    createPrimeRenderer,
    evaluateWorldThreatsAndOpportunities,
    createEcologicalSystem,
    evalInScope: function (code) {
      return eval(code);
    },
  };
  global.__ecologyEvalInScope = function (code) {
    return eval(code);
  };
  global.SlopesEcology = api;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : this);
