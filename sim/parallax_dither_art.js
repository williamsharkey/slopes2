/* Slopes2: Multi-Layer Parallax Dither Backgrounds, Transparent Surface Dither Screens
 * & Hyper-Detailed 1px Device-Pixel Artwork (SlopesParallaxDitherArt)
 *
 * Works directly on the prime renderer's native framebuffer (primeRenderer.data,
 * NATIVE_W x NATIVE_H, SCALE device pixels per coarse cell) so every device pixel counts:
 *
 *   renderBackgroundParallaxDither(primeRenderer, world, tick)
 *     Call right after the screen is cleared, before terrain. Four parallax depths:
 *       0.08x  far horizon mountains + atmospheric gradient (ordered 8x8 Bayer)
 *       0.22x  mid-distant cloud / mist veil (procedural blue-noise stipple)
 *       0.48x  foothills & ancient ruin silhouettes (ordered 8x8 Bayer)
 *       (1.0x  foreground screens -> renderSurfaceDitherScreens)
 *
 *   renderSurfaceDitherScreens(primeRenderer, world, tick)
 *     Call after terrain & water are drawn. 1.0x geological strata, cavern ceiling strata,
 *     water depth gradient, ripple highlights, mirrored horizon reflection & seabed caustics.
 *
 *   renderDetailedWorldObjects(primeRenderer, world, eco, cosmic, tick)
 *     Call after the base robot is drawn. 1px artwork for the Player Monolith, Towns, Caves,
 *     Aetherium & Time Crystals, Compute Vats & Labs, Villagers & Dwarf Automata.
 *
 * Camera: tracks world.worldX (screen index) and, while riding the airship village,
 * SlopesTabForms.state.airshipVillage.continuousScrollX, eased so screen hops glide.
 */
(function (root) {
  "use strict";

  const CONFIG = {
    enabled: true,
    background: true,
    screens: true,
    objects: true,
    intensity: 1.0, // global multiplier on all dither transparencies
  };

  // ==========================================================================
  // 1. CONSTRAINED MUTED MODERN PALETTE & DRIPPING COLOR CYCLE
  // ==========================================================================
  const PAL = {
    ink: [17, 20, 26],
    obsidian: [27, 30, 37],
    slate: [50, 58, 68],
    slateHi: [86, 96, 106],
    fog: [198, 205, 205],
    bone: [229, 222, 205],
    sage: [134, 158, 140],
    moss: [94, 120, 82],
    ochre: [196, 160, 104],
    rust: [158, 96, 76],
    brass: [182, 144, 88],
    gold: [224, 188, 112],
    cyan: [126, 206, 212],
    teal: [70, 138, 144],
    mauve: [148, 120, 150],
    ember: [232, 148, 86],
    hearth: [248, 198, 122],
    skin: [214, 172, 134],
    tangerine: [206, 116, 60],
    glass: [168, 214, 218],
  };
  const DRIP_RING = [PAL.cyan, PAL.sage, PAL.gold, PAL.mauve, PAL.teal];

  // Smoothly cycles through DRIP_RING; phase grows downward so color appears to drip.
  function drip(phase, out) {
    const n = DRIP_RING.length;
    let p = phase % n;
    if (p < 0) p += n;
    const i = (p | 0) % n;
    const f = p - (p | 0);
    const s = f * f * (3 - 2 * f);
    const a = DRIP_RING[i];
    const b = DRIP_RING[(i + 1) % n];
    out[0] = a[0] + (b[0] - a[0]) * s;
    out[1] = a[1] + (b[1] - a[1]) * s;
    out[2] = a[2] + (b[2] - a[2]) * s;
    return out;
  }

  function mix(a, b, t, out) {
    out = out || [0, 0, 0];
    out[0] = a[0] + (b[0] - a[0]) * t;
    out[1] = a[1] + (b[1] - a[1]) * t;
    out[2] = a[2] + (b[2] - a[2]) * t;
    return out;
  }

  function scale(c, m, out) {
    out = out || [0, 0, 0];
    out[0] = c[0] * m;
    out[1] = c[1] * m;
    out[2] = c[2] * m;
    return out;
  }

  // ==========================================================================
  // 2. ORDERED 8x8 BAYER & PROCEDURAL BLUE-NOISE STIPPLE MATRICES
  // ==========================================================================
  const BAYER8 = (function buildBayer() {
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

  // 64x64 tileable blue noise via energy-minimising void filling (Gaussian, toroidal).
  // Built lazily once (~10-20ms); thresholds in (0,1).
  const BN = 64;
  let BLUE = null;
  function getBlueNoise() {
    if (BLUE) return BLUE;
    const n = BN * BN;
    const energy = new Float32Array(n);
    const taken = new Uint8Array(n);
    const rank = new Float32Array(n);
    const R = 5;
    const kern = [];
    for (let dy = -R; dy <= R; dy++) {
      for (let dx = -R; dx <= R; dx++) {
        kern.push(dx, dy, Math.exp(-(dx * dx + dy * dy) / (2 * 1.9 * 1.9)));
      }
    }
    let seed = 0x2545f491;
    for (let i = 0; i < n; i++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      energy[i] = (seed / 4294967296) * 1e-4;
    }
    for (let k = 0; k < n; k++) {
      let best = -1;
      let bestE = Infinity;
      for (let i = 0; i < n; i++) {
        if (!taken[i] && energy[i] < bestE) {
          bestE = energy[i];
          best = i;
        }
      }
      taken[best] = 1;
      rank[best] = (k + 0.5) / n;
      const bx = best & (BN - 1);
      const by = best >> 6;
      for (let j = 0; j < kern.length; j += 3) {
        const xx = (bx + kern[j]) & (BN - 1);
        const yy = (by + kern[j + 1]) & (BN - 1);
        energy[(yy << 6) | xx] += kern[j + 2];
      }
    }
    BLUE = rank;
    return BLUE;
  }

  // ==========================================================================
  // 3. HASH & VALUE NOISE
  // ==========================================================================
  function h32(n) {
    n = Math.imul(n ^ (n >>> 16), 0x7feb352d);
    n = Math.imul(n ^ (n >>> 15), 0x846ca68b);
    n ^= n >>> 16;
    return (n >>> 0) / 4294967296;
  }

  function h2(x, y) {
    return h32(Math.imul(x | 0, 0x27d4eb2d) ^ Math.imul(y | 0, 0x165667b1) ^ 0x5bd1e995);
  }

  function vn1(u, seed) {
    const i = Math.floor(u);
    const f = u - i;
    const s = f * f * (3 - 2 * f);
    const k = Math.imul(seed | 0, 668265263);
    const a = h32((Math.imul(i, 374761393) + k) | 0);
    const b = h32((Math.imul(i + 1, 374761393) + k) | 0);
    return a + (b - a) * s;
  }

  // Periodic 2D value noise for the tiling mist texture
  function vn2p(x, y, lx, ly, seed) {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const fx = x - xi;
    const fy = y - yi;
    const sx = fx * fx * (3 - 2 * fx);
    const sy = fy * fy * (3 - 2 * fy);
    const x0 = ((xi % lx) + lx) % lx;
    const y0 = ((yi % ly) + ly) % ly;
    const x1 = (x0 + 1) % lx;
    const y1 = (y0 + 1) % ly;
    const a = h2(x0 + seed * 131, y0);
    const b = h2(x1 + seed * 131, y0);
    const c = h2(x0 + seed * 131, y1);
    const d = h2(x1 + seed * 131, y1);
    return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
  }

  const MW = 256;
  const MH = 128;
  let MIST = null;
  function getMist() {
    if (MIST) return MIST;
    MIST = new Float32Array(MW * MH);
    const octs = [
      [32, 0.5],
      [16, 0.26],
      [8, 0.15],
      [4, 0.09],
    ];
    let lo = Infinity;
    let hi = -Infinity;
    for (let y = 0; y < MH; y++) {
      for (let x = 0; x < MW; x++) {
        let v = 0;
        for (let o = 0; o < octs.length; o++) {
          const cs = octs[o][0];
          v += vn2p(x / cs, (y / cs) * 1.6, MW / cs, Math.max(1, Math.round((MH / cs) * 1.6)), o + 3) * octs[o][1];
        }
        MIST[y * MW + x] = v;
        if (v < lo) lo = v;
        if (v > hi) hi = v;
      }
    }
    const inv = 1 / Math.max(1e-6, hi - lo);
    for (let i = 0; i < MIST.length; i++) MIST[i] = (MIST[i] - lo) * inv;
    return MIST;
  }

  // ==========================================================================
  // 4. NATIVE FRAMEBUFFER BINDING & 1px BLEND PRIMITIVES
  // ==========================================================================
  let D = null;
  let NW = 1008;
  let NH = 630;
  let S = 7;
  let CW = 144;
  let CH = 90;
  const BG = [72, 160, 148];
  let bgTick = -1e9;

  function refreshBg() {
    if (typeof document === "undefined" || typeof getComputedStyle !== "function") return;
    const cv = document.getElementById("pi-shift");
    if (!cv) return;
    const m = /(\d+(?:\.\d+)?)\D+(\d+(?:\.\d+)?)\D+(\d+(?:\.\d+)?)/.exec(getComputedStyle(cv).backgroundColor || "");
    if (m) {
      BG[0] = +m[1];
      BG[1] = +m[2];
      BG[2] = +m[3];
    }
  }

  function bind(pr, tick) {
    D = pr.data;
    S = pr.SCALE || 7;
    NW = pr.NATIVE_W || 1008;
    NH = pr.NATIVE_H || 630;
    CW = pr.COARSE_W || ((NW / S) | 0);
    CH = pr.COARSE_H || ((NH / S) | 0);
    if (tick - bgTick >= 30 || tick < bgTick) {
      bgTick = tick;
      refreshBg();
    }
    ensureColumnBuffers();
  }

  function resolveTick(world, tick) {
    if (typeof tick === "number") return tick;
    return world && typeof world.frameCount === "number" ? world.frameCount : 0;
  }

  // Alpha-blend one device pixel (empty sky pixels blend against the CSS sky color)
  function px(x, y, r, g, b, a) {
    if (a <= 0 || x < 0 || y < 0) return;
    x |= 0;
    y |= 0;
    if (x >= NW || y >= NH) return;
    if (a > 1) a = 1;
    const i = (y * NW + x) << 2;
    let br, bgc, bb;
    if (D[i + 3] === 0) {
      br = BG[0];
      bgc = BG[1];
      bb = BG[2];
    } else {
      br = D[i];
      bgc = D[i + 1];
      bb = D[i + 2];
    }
    D[i] = br + (r - br) * a;
    D[i + 1] = bgc + (g - bgc) * a;
    D[i + 2] = bb + (b - bb) * a;
    D[i + 3] = 255;
  }

  function pc(x, y, c, a) {
    px(x, y, c[0], c[1], c[2], a);
  }

  // Additive light (glows, flares, lamp halos)
  function glow(x, y, c, a) {
    if (a <= 0 || x < 0 || y < 0) return;
    x |= 0;
    y |= 0;
    if (x >= NW || y >= NH) return;
    const i = (y * NW + x) << 2;
    if (D[i + 3] === 0) {
      D[i] = BG[0];
      D[i + 1] = BG[1];
      D[i + 2] = BG[2];
      D[i + 3] = 255;
    }
    D[i] += c[0] * a;
    D[i + 1] += c[1] * a;
    D[i + 2] += c[2] * a;
  }

  // Sub-pixel bilinear splat: lets motes / bubbles / strings move smoothly between device pixels
  function splat(fx, fy, c, a) {
    const x0 = Math.floor(fx);
    const y0 = Math.floor(fy);
    const dx = fx - x0;
    const dy = fy - y0;
    pc(x0, y0, c, a * (1 - dx) * (1 - dy));
    pc(x0 + 1, y0, c, a * dx * (1 - dy));
    pc(x0, y0 + 1, c, a * (1 - dx) * dy);
    pc(x0 + 1, y0 + 1, c, a * dx * dy);
  }

  function glowSplat(fx, fy, c, a) {
    const x0 = Math.floor(fx);
    const y0 = Math.floor(fy);
    const dx = fx - x0;
    const dy = fy - y0;
    glow(x0, y0, c, a * (1 - dx) * (1 - dy));
    glow(x0 + 1, y0, c, a * dx * (1 - dy));
    glow(x0, y0 + 1, c, a * (1 - dx) * dy);
    glow(x0 + 1, y0 + 1, c, a * dx * dy);
  }

  function rect(x, y, w, h, c, a) {
    for (let yy = 0; yy < h; yy++) {
      for (let xx = 0; xx < w; xx++) pc(x + xx, y + yy, c, a);
    }
  }

  function line(x0, y0, x1, y1, c, a) {
    x0 = Math.round(x0);
    y0 = Math.round(y0);
    x1 = Math.round(x1);
    y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0);
    const dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (let guard = 0; guard < 512; guard++) {
      pc(x0, y0, c, a);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) {
        err += dy;
        x0 += sx;
      }
      if (e2 <= dx) {
        err += dx;
        y0 += sy;
      }
    }
  }

  // Soft radial halo (additive), used sparingly for lanterns, hearths & cores
  function halo(cx, cy, r, c, a) {
    const r2 = r * r;
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        const d2 = dx * dx + dy * dy;
        if (d2 > r2) continue;
        const f = 1 - d2 / r2;
        glow(cx + dx, cy + dy, c, a * f * f);
      }
    }
  }

  // Spoked gear with crisp 1px rim and teeth
  function gear(cx, cy, r, teeth, ang, rim, tooth, a) {
    const steps = Math.max(12, Math.ceil(Math.PI * 2 * r * 1.6));
    for (let i = 0; i < steps; i++) {
      const t = (i / steps) * Math.PI * 2;
      pc(Math.round(cx + Math.cos(t) * r), Math.round(cy + Math.sin(t) * r), rim, a);
    }
    for (let k = 0; k < teeth; k++) {
      const t = ang + (k / teeth) * Math.PI * 2;
      pc(Math.round(cx + Math.cos(t) * (r + 1)), Math.round(cy + Math.sin(t) * (r + 1)), tooth, a);
    }
    for (let k = 0; k < (r >= 2 ? 3 : 0); k++) {
      const t = ang + (k / 3) * Math.PI * 2;
      for (let d = 1; d < r - 0.5; d += 0.9) {
        pc(Math.round(cx + Math.cos(t) * d), Math.round(cy + Math.sin(t) * d), rim, a * 0.75);
      }
    }
    pc(Math.round(cx), Math.round(cy), PAL.gold, a);
  }

  // Rotated 3D ring projected to 1px (gimbals, orbits)
  function ring3(cx, cy, r, yaw, pitch, col, aFront, aBack) {
    const steps = Math.max(16, Math.ceil(r * 7));
    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);
    const cw = Math.cos(yaw);
    const sw = Math.sin(yaw);
    for (let i = 0; i < steps; i++) {
      const t = (i / steps) * Math.PI * 2;
      const x = Math.cos(t) * r;
      const y0 = Math.sin(t) * r;
      const y = y0 * cp;
      const z0 = y0 * sp;
      const xx = x * cw + z0 * sw;
      const z = -x * sw + z0 * cw;
      pc(Math.round(cx + xx), Math.round(cy + y), col, z >= 0 ? aFront : aBack);
    }
  }

  // ==========================================================================
  // 5. CAMERA: SMOOTH CONTINUOUS WORLD SCROLL TRACKING
  // ==========================================================================
  const cam = {
    x: null, // coarse-cell world units
    riding: false,
    rideBase: 0,
    rideScroll0: 0,
  };

  function airshipVillage() {
    const tf = root.SlopesTabForms;
    return tf && tf.state && tf.state.airshipVillage ? tf.state.airshipVillage : null;
  }

  function updateCamera(world, tick) {
    const as = airshipVillage();
    const riding = !!(as && as.riding && typeof as.continuousScrollX === "number");
    const wx = (world && typeof world.worldX === "number" ? world.worldX : 0) * CW;
    const P = world && world.P;
    const lean = P ? (P.x - CW / 2) * 0.35 : 0;
    if (riding && !cam.riding) {
      cam.rideBase = cam.x !== null ? cam.x : wx + lean;
      cam.rideScroll0 = as.continuousScrollX;
    }
    cam.riding = riding;
    const target = riding ? cam.rideBase + (as.continuousScrollX - cam.rideScroll0) : wx + lean;
    if (cam.x === null || Math.abs(target - cam.x) > CW * 6) cam.x = target;
    else cam.x += (target - cam.x) * 0.12;
    return cam.x;
  }

  // 1.0x foreground anchor: locked to the terrain. While riding, the airship shifts Blocks
  // one column at a time, so we detect that shift instead of trusting a scroll rate.
  const fg = { anchor: 0, lastWorldX: null, prev: null, riding: false };

  function updateForegroundAnchor(world) {
    const blocks = world && world.Blocks;
    const wx = world && typeof world.worldX === "number" ? world.worldX : 0;
    const as = airshipVillage();
    const riding = !!(as && as.riding);
    if (!riding) {
      if (fg.lastWorldX !== wx || fg.riding) fg.anchor = wx * NW;
    } else if (blocks && fg.prev && fg.prev.length === blocks.length) {
      let shifted = true;
      let same = true;
      for (let c = 0; c < blocks.length - 1; c++) {
        if (blocks[c] !== fg.prev[c + 1]) shifted = false;
        if (blocks[c] !== fg.prev[c]) same = false;
        if (!shifted && !same) break;
      }
      if (shifted && !same) fg.anchor += S;
    }
    fg.riding = riding;
    fg.lastWorldX = wx;
    if (blocks) {
      if (!fg.prev || fg.prev.length !== blocks.length) fg.prev = new Float32Array(blocks.length);
      for (let c = 0; c < blocks.length; c++) fg.prev[c] = blocks[c];
    }
    return fg.anchor;
  }

  // ==========================================================================
  // 6. MULTI-LAYER PARALLAX DITHER BACKGROUND (0.08x / 0.22x / 0.48x)
  // ==========================================================================
  let ridgeFar = null; // 0.08x mountain ridge (or cavern stalactite ridge)
  let ridgeFarB = null; // cavern stalagmite ridge (underground only)
  let litFar = null;
  let snowFar = null;
  let ridgeNear = null; // 0.48x foothills + ruins top
  let holeA = null; // ruin window/arch gap [holeA, holeB)
  let holeB = null;
  let rimNear = null;
  let atmo = null;
  let mistProf = null;
  let ridgeFrameTick = -1;
  let ridgeFrameMode = -1;

  function ensureColumnBuffers() {
    if (ridgeFar && ridgeFar.length >= NW && atmo.length >= NH) return;
    ridgeFar = new Float32Array(NW);
    ridgeFarB = new Float32Array(NW);
    litFar = new Float32Array(NW);
    snowFar = new Float32Array(NW);
    ridgeNear = new Float32Array(NW);
    holeA = new Int16Array(NW);
    holeB = new Int16Array(NW);
    rimNear = new Float32Array(NW);
    atmo = new Float32Array(NH);
    mistProf = new Float32Array(NH);
  }

  function horizonFor(mode, world) {
    const sea = (world && world.seaLevel) || 0;
    if (mode === 0) return Math.min(NH * 0.72, (CH - Math.max(sea, 10)) * S);
    if (mode === 1) return NH * 0.86;
    return NH * 0.8;
  }

  function farRidgeAt(u, mode, hz) {
    // ridged multi-octave mountains; amplitude ~ 26% of screen height
    const n1 = vn1(u / 260, 11);
    const n2 = 1 - Math.abs(2 * vn1(u / 92, 12) - 1);
    const n3 = vn1(u / 31, 13);
    const amp = mode === 1 ? NH * 0.12 : NH * 0.26;
    return hz - amp * (0.5 * n1 + 0.36 * n2 + 0.14 * n3) - (mode === 1 ? 0 : NH * 0.03);
  }

  // Ancient ruins along the 0.48x foothills: colonnades, arches & broken towers
  function ruinAt(u, hill, outHole) {
    const SEG = 132;
    const seg = Math.floor(u / SEG);
    const hs = h32(Math.imul(seg, 7919) + 11);
    outHole[0] = 0;
    outHole[1] = 0;
    if (hs > 0.58) return hill;
    const local = u - seg * SEG;
    const type = (hs * 3 / 0.58) | 0;
    const start = 18 + ((h32(seg * 31 + 5) * 40) | 0);
    const lx = local - start;
    if (type === 0) {
      // Colonnade: 5px columns every 12px, broken heights, partial lintel
      if (lx < 0 || lx >= 64) return hill;
      const colI = (lx / 12) | 0;
      const inCol = lx - colI * 12;
      const colH = 18 + h32(seg * 97 + colI) * 20;
      const lintel = h32(seg * 13 + 7) > 0.4 && colI < 3;
      if (inCol < 5) return Math.min(hill, hill - colH - (inCol === 0 || inCol === 4 ? 0 : 1));
      if (lintel && colH > 26) return Math.min(hill, hill - 40);
      return hill;
    }
    if (type === 1) {
      // Arch: two piers and a semicircular gap
      if (lx < 0 || lx >= 44) return hill;
      const top = hill - 42;
      const ax = lx - 22;
      if (Math.abs(ax) < 13) {
        const ry = 13;
        const k = 1 - (ax * ax) / (ry * ry);
        const archTop = hill - 18 - Math.sqrt(Math.max(0, k)) * 12;
        outHole[0] = archTop | 0;
        outHole[1] = hill | 0;
      }
      if (lx < 3 || lx > 40) return top + 4; // weathered pier caps
      return top;
    }
    // Broken tower with crenellations and a lancet window
    if (lx < 0 || lx >= 22) return hill;
    const broken = h32(seg * 53 + ((lx / 4) | 0)) * 9;
    let top = hill - 50 + broken;
    if (((lx / 3) | 0) & 1) top -= 3;
    if (lx >= 9 && lx <= 12) {
      outHole[0] = (hill - 36) | 0;
      outHole[1] = (hill - 26) | 0;
    }
    return top;
  }

  const _hole = [0, 0];

  function computeRidges(world, tick, mode, camN) {
    const hz = horizonFor(mode, world);
    const off0 = camN * 0.08;
    const off2 = camN * 0.48;
    for (let x = 0; x < NW; x++) {
      const u0 = x + off0;
      if (mode === 2) {
        // Distant cavern back wall: stalactites from above, stalagmites below
        const a = 1 - Math.abs(2 * vn1(u0 / 22, 21) - 1);
        const b = vn1(u0 / 70, 22);
        ridgeFar[x] = NH * 0.06 + Math.pow(a, 3) * NH * 0.22 + b * NH * 0.06;
        const c = 1 - Math.abs(2 * vn1(u0 / 27 + 9.3, 23) - 1);
        ridgeFarB[x] = hz - Math.pow(c, 2.6) * NH * 0.24 - vn1(u0 / 90, 24) * NH * 0.05;
        litFar[x] = 0;
        snowFar[x] = 0;
      } else {
        const r = farRidgeAt(u0, mode, hz);
        ridgeFar[x] = r;
        const slope = farRidgeAt(u0 + 2, mode, hz) - farRidgeAt(u0 - 2, mode, hz);
        litFar[x] = slope > 0 ? Math.min(1, slope * 0.35) : 0;
        // snow only on high peaks
        const height = hz - r;
        snowFar[x] = height > NH * 0.17 ? 2 + h32(Math.floor(u0) * 3) * 4 + (height - NH * 0.17) * 0.12 : 0;
      }
      const u2 = x + off2;
      let hill;
      if (mode === 2) {
        // near rock pillars / ancient dwarf ruins rising from the cavern floor
        const pillar = vn1(u2 / 46, 31);
        hill = pillar > 0.72 ? hz - 30 - (pillar - 0.72) * 420 : hz + 6 - vn1(u2 / 18, 32) * 14;
      } else {
        const base = mode === 1 ? NH * 0.97 : hz + 4;
        hill = base - NH * 0.11 * (0.62 * vn1(u2 / 140, 41) + 0.38 * vn1(u2 / 47, 42));
      }
      const top = ruinAt(u2, hill, _hole);
      ridgeNear[x] = top;
      holeA[x] = _hole[0];
      holeB[x] = _hole[1];
      rimNear[x] = 0;
    }
    // rim light along the near silhouette (left-facing edges catch light)
    for (let x = 1; x < NW; x++) rimNear[x] = ridgeNear[x - 1] - ridgeNear[x] > 1.5 ? 1 : 0;
    ridgeFrameTick = tick;
    ridgeFrameMode = mode;
    return hz;
  }

  function renderBackgroundParallaxDither(primeRenderer, world, tick) {
    if (!CONFIG.enabled || !CONFIG.background || !primeRenderer || !primeRenderer.data || !world) return;
    tick = resolveTick(world, tick);
    bind(primeRenderer, tick);
    const blue = getBlueNoise();
    const mist = getMist();
    const camX = updateCamera(world, tick);
    const camN = camX * S;
    const layer = world.worldLayer | 0;
    const mode = layer < 0 ? 2 : layer > 0 ? 1 : 0;
    const blocks = world.Blocks;
    const ceil = world.Ceiling;
    const islandBase = world.IslandBase;
    const I = CONFIG.intensity;

    const hz = computeRidges(world, tick, mode, camN);

    // Layer colors derive from the live sky color so the dither melts into it
    const bgc = BG;
    const atmoCol = mix(scale(bgc, 1.16), PAL.fog, 0.45);
    const farCol = mode === 2 ? mix(scale(bgc, 0.42), PAL.slate, 0.5) : mix(scale(bgc, 0.7), PAL.slate, 0.35);
    const farLit = mix(scale(bgc, 0.95), PAL.fog, 0.3);
    const snowCol = mix(scale(bgc, 1.25), PAL.bone, 0.6);
    const mistCol =
      mode === 2
        ? mix(scale(bgc, 1.1), drip(tick * 0.004, [0, 0, 0]), 0.55)
        : mix(scale(bgc, 1.22), PAL.bone, 0.55);
    const nearCol = mode === 2 ? mix(scale(bgc, 0.3), PAL.ink, 0.5) : mix(scale(bgc, 0.52), PAL.ink, 0.35);
    const nearRim = mix(scale(bgc, 0.85), PAL.sage, 0.35);

    const aAtmo = 0.06 * I;
    const aFar = 0.12 * I;
    const aFarLit = 0.15 * I;
    const aSnow = 0.17 * I;
    const aMist = 0.09 * I;
    const aNear = 0.15 * I;
    const aRim = 0.22 * I;

    // Per-row atmosphere density & mist band profile
    for (let y = 0; y < NH; y++) {
      const t = y / Math.max(1, hz);
      if (mode === 2) {
        atmo[y] = 0.05 + 0.18 * Math.max(0, Math.sin(Math.PI * Math.min(1, y / NH)));
      } else {
        atmo[y] = y < hz ? 0.03 + 0.44 * Math.pow(t, 2.2) : 0.42;
      }
      let prof;
      if (mode === 0) {
        prof = Math.exp(-Math.pow((y - NH * 0.2) / (NH * 0.07), 2)) + 0.8 * Math.exp(-Math.pow((y - hz * 0.86) / (NH * 0.05), 2));
      } else if (mode === 1) {
        prof = 0.55 + 0.45 * Math.sin(y * 0.021) + 1.1 * Math.exp(-Math.pow((y - NH * 0.88) / (NH * 0.08), 2));
      } else {
        prof = 0.9 * Math.exp(-Math.pow((y - hz * 0.95) / (NH * 0.08), 2)) + 0.5 * Math.exp(-Math.pow((y - NH * 0.45) / (NH * 0.1), 2));
      }
      mistProf[y] = prof;
    }

    const off0 = camN * 0.08;
    const off1 = camN * 0.22 + tick * (mode === 1 ? 0.18 : 0.09); // veil also drifts on the wind
    const off2 = camN * 0.48;

    for (let x = 0; x < NW; x++) {
      const cx = (x / S) | 0;
      let yTop = 0;
      let yBot = NH;
      let skipA = NH;
      let skipB = NH;
      const h = blocks ? blocks[cx] | 0 : 0;
      if (mode === 1) {
        if (h > 0 && islandBase) {
          skipA = (CH - h) * S;
          skipB = (CH - (islandBase[cx] | 0)) * S;
        }
      } else if (h > 0) {
        yBot = Math.min(NH, (CH - h) * S);
      }
      if (mode === 2 && ceil) yTop = Math.max(0, (ceil[cx] | 0) * S);

      const u0 = Math.floor(x + off0);
      const u1 = Math.floor(x + off1);
      const u2 = Math.floor(x + off2);
      const bx0 = u0 & 7;
      const bx2 = u2 & 7;
      const bnx = u1 & 63;
      const mx = (u1 >> 1) & (MW - 1);
      const rF = ridgeFar[x];
      const rFB = ridgeFarB[x];
      const lit = litFar[x];
      const snow = snowFar[x];
      const rN = ridgeNear[x];
      const hA = holeA[x];
      const hB = holeB[x];
      const rim = rimNear[x];

      for (let y = yTop; y < yBot; y++) {
        if (y >= skipA && y < skipB) {
          y = skipB - 1;
          continue;
        }
        const by = (y & 7) << 3;
        let T = 1;
        let cr = 0;
        let cg = 0;
        let cb = 0;

        // L0a: atmospheric gradient (0.08x Bayer)
        if (atmo[y] > BAYER8[by | bx0]) {
          cr = cr * (1 - aAtmo) + atmoCol[0] * aAtmo;
          cg = cg * (1 - aAtmo) + atmoCol[1] * aAtmo;
          cb = cb * (1 - aAtmo) + atmoCol[2] * aAtmo;
          T *= 1 - aAtmo;
        }

        // L0b: far horizon mountains / distant cavern wall (0.08x Bayer)
        let inFar = false;
        let depth = 0;
        if (mode === 2) {
          if (y <= rF) {
            inFar = true;
            depth = rF - y;
          } else if (y >= rFB) {
            inFar = true;
            depth = y - rFB;
          }
        } else if (y >= rF) {
          inFar = true;
          depth = y - rF;
        }
        if (inFar) {
          const t = BAYER8[by | bx0];
          let col = farCol;
          let a = aFar;
          let dens = 0.14 + 0.36 * Math.exp(-depth / 34);
          if (snow > 0 && depth < snow) {
            col = snowCol;
            a = aSnow;
            dens = 0.62;
          } else if (lit > 0 && depth < 40) {
            col = farLit;
            a = aFarLit * lit;
          }
          if (depth < 1) dens = 0.8;
          if (dens > t) {
            cr = cr * (1 - a) + col[0] * a;
            cg = cg * (1 - a) + col[1] * a;
            cb = cb * (1 - a) + col[2] * a;
            T *= 1 - a;
          }
        }

        // L1: mid-distant cloud / mist veil (0.22x blue-noise stipple)
        const prof = mistProf[y];
        if (prof > 0.04) {
          const n = mist[((y >> 1) & (MH - 1)) * MW + mx];
          const d = (n - 0.44) * 2.3 * prof;
          if (d > 0 && d > blue[((y & 63) << 6) | bnx]) {
            cr = cr * (1 - aMist) + mistCol[0] * aMist;
            cg = cg * (1 - aMist) + mistCol[1] * aMist;
            cb = cb * (1 - aMist) + mistCol[2] * aMist;
            T *= 1 - aMist;
          }
        }

        // L2: foothills & ancient ruins silhouette (0.48x Bayer)
        if (y >= rN && !(y >= hA && y < hB)) {
          const dn = y - rN;
          const isRim = dn < 1 || (rim > 0 && dn < 3);
          const dens = isRim ? 0.85 : Math.max(0.2, 0.46 - dn * 0.004);
          if (dens > BAYER8[by | bx2]) {
            const col = isRim ? nearRim : nearCol;
            const a = isRim ? aRim : aNear;
            cr = cr * (1 - a) + col[0] * a;
            cg = cg * (1 - a) + col[1] * a;
            cb = cb * (1 - a) + col[2] * a;
            T *= 1 - a;
          }
        }

        if (T < 1) {
          const i = (y * NW + x) << 2;
          let br, bgg, bb;
          if (D[i + 3] === 0) {
            br = BG[0];
            bgg = BG[1];
            bb = BG[2];
          } else {
            br = D[i];
            bgg = D[i + 1];
            bb = D[i + 2];
          }
          D[i] = br * T + cr;
          D[i + 1] = bgg * T + cg;
          D[i + 2] = bb * T + cb;
          D[i + 3] = 255;
        }
      }
    }
  }

  // ==========================================================================
  // 7. 1.0x FOREGROUND TRANSPARENT SURFACE DITHER SCREENS
  //    (geological strata, cavern ceilings, water depths & reflections)
  // ==========================================================================
  const STRATA_TINTS = [PAL.ochre, PAL.rust, PAL.slate, PAL.sage, PAL.mauve];

  function renderSurfaceDitherScreens(primeRenderer, world, tick) {
    if (!CONFIG.enabled || !CONFIG.screens || !primeRenderer || !primeRenderer.data || !world) return;
    tick = resolveTick(world, tick);
    bind(primeRenderer, tick);
    const blue = getBlueNoise();
    const anchor = updateForegroundAnchor(world);
    const blocks = world.Blocks;
    if (!blocks) return;
    const layer = world.worldLayer | 0;
    const mode = layer < 0 ? 2 : layer > 0 ? 1 : 0;
    const ceil = world.Ceiling;
    const islandBase = world.IslandBase;
    const sea = world.seaLevel || 0;
    const magma = world.currentBiome === "magma";
    const I = CONFIG.intensity;

    // Reflections mirror the 0.08x ridge; recompute if the background pass didn't run this tick
    if (ridgeFrameTick !== tick || ridgeFrameMode !== mode) {
      computeRidges(world, tick, mode, (cam.x !== null ? cam.x : updateCamera(world, tick)) * S);
    }

    const bedCol = PAL.ink;
    const speckCol = PAL.bone;
    const deepCol = mix(PAL.ink, PAL.teal, 0.35);
    const hiCol = mix(PAL.bone, scale(BG, 1.2), 0.3);
    const reflCol = mix(scale(BG, 0.55), PAL.slate, 0.4);
    const causticCol = PAL.gold;
    const emberCol = PAL.ember;
    const aStrata = 0.13 * I;
    const aBed = 0.2 * I;
    const aSpeck = 0.26 * I;
    const aDeep = 0.16 * I;
    const aHi = 0.3 * I;
    const aRefl = 0.12 * I;
    const aCaustic = 0.24 * I;

    for (let x = 0; x < NW; x++) {
      const cx = (x / S) | 0;
      const h = blocks[cx] | 0;
      const uF = Math.floor(x + anchor);
      const bxF = uF & 7;
      const bnx = uF & 63;
      const sw = Math.sin(uF * 0.011) * 9 + Math.sin(uF * 0.037 + 1.3) * 3.5 + Math.sin(uF * 0.0041) * 16;

      // --- Geological strata through terrain ---
      if (h > 0) {
        const topY = (CH - h) * S;
        const botY = mode === 1 && islandBase ? (CH - (islandBase[cx] | 0)) * S : NH;
        for (let y = Math.max(0, topY + 3); y < botY && y < NH; y++) {
          const d = y - topY;
          const fade = d < 12 ? (d - 2) / 10 : 1;
          const s = y + sw + (mode === 2 ? 40 : 0);
          const band = Math.floor(s / 11);
          const fr = s - band * 11;
          const hb = h32(Math.imul(band, 977) + 31);
          const t = BAYER8[((y & 7) << 3) | bxF];
          if (fr < 1) {
            if (0.55 > t) pc(x, y, bedCol, aBed * fade);
            continue;
          }
          const bnv = blue[((y & 63) << 6) | bnx];
          if (bnv > 0.988 && h2(uF >> 3, y >> 3) > 0.6) {
            pc(x, y, speckCol, aSpeck * fade);
            continue;
          }
          const dens = 0.06 + h32(band * 13 + 7) * 0.16;
          if (dens > t) pc(x, y, STRATA_TINTS[(hb * STRATA_TINTS.length) | 0], aStrata * fade);
        }
      }

      // --- Cavern ceiling strata ---
      if (mode === 2 && ceil) {
        const cBot = Math.min(NH, (ceil[cx] | 0) * S);
        for (let y = 0; y < cBot - 2; y++) {
          const s = y - sw * 0.7;
          const band = Math.floor(s / 9);
          const fr = s - band * 9;
          const t = BAYER8[((y & 7) << 3) | bxF];
          if (fr < 1) {
            if (0.5 > t) pc(x, y, bedCol, aBed);
          } else if (0.07 + h32(band * 29 + 3) * 0.12 > t) {
            pc(x, y, STRATA_TINTS[(h32(band * 11 + 1) * STRATA_TINTS.length) | 0], aStrata * 0.9);
          }
        }
      }

      // --- Water depths, reflections & caustics (or magma embers) ---
      if (sea > 0 && h < sea) {
        const wy = (CH - sea) * S + S; // skip the wave-crest row
        const botY = Math.min(NH, h > 0 ? (CH - h) * S : NH);
        const ripX = Math.sin(uF * 0.045 + tick * 0.06) * 2.2;
        for (let y = wy; y < botY; y++) {
          const dd = y - wy;
          if (magma) {
            const e = Math.sin(uF * 0.05 + y * 0.11 - tick * 0.07) + Math.sin(uF * 0.017 - y * 0.05 + tick * 0.04);
            if (e > 1.2 && blue[(((y + tick) & 63) << 6) | bnx] > 0.7) pc(x, y, emberCol, 0.2 * I);
            continue;
          }
          const t = BAYER8[((y & 7) << 3) | bxF];
          // depth gradient
          if (Math.min(0.62, 0.06 + dd * 0.006) > t) pc(x, y, deepCol, aDeep);
          // mirrored far-horizon reflection, rippled sideways
          if (dd < 70 && mode !== 2) {
            const rx = Math.max(0, Math.min(NW - 1, Math.round(x + ripX * (1 + dd * 0.05))));
            const mirrorY = wy - dd * 1.25;
            if (mirrorY >= ridgeFar[rx] && 0.4 * (1 - dd / 70) > t) pc(x, y, reflCol, aRefl);
          }
          // ripple highlights
          const rp = Math.sin(y * 0.85 + ripX - tick * 0.11);
          if (rp > 0.86) {
            const bn = blue[(((y + (tick >> 1)) & 63) << 6) | ((uF + tick) & 63)];
            if (bn < (1 - dd / 80) * 0.55) pc(x, y, hiCol, aHi);
          }
          // seabed caustics
          if (botY - y < 10) {
            const c = Math.sin(uF * 0.21 + tick * 0.09) + Math.sin(uF * 0.13 - tick * 0.07 + y * 0.4);
            if (c > 1.45) pc(x, y, causticCol, aCaustic * (1 - (botY - y) / 10));
          }
        }
      }
    }
  }

  // ==========================================================================
  // 8. HYPER-DETAILED 1px DEVICE-PIXEL ARTWORK
  // ==========================================================================
  const _c = [0, 0, 0];
  const _d = [0, 0, 0];
  const _e = [0, 0, 0];

  function groundY(blocks, cx) {
    const c = Math.max(0, Math.min(CW - 1, Math.round(cx)));
    const h = blocks ? blocks[c] : 16;
    return (CH - (h === undefined ? 16 : h)) * S;
  }

  // ---- a) PLAYER MONOLITH ------------------------------------------------
  // Local polylines for circuit traces on an 11x42 chassis (avoid visor & aperture)
  const GOLD_TRACES = [
    [[2, 8], [2, 10], [5, 10], [5, 11]],
    [[8, 26], [8, 29], [4, 29], [4, 33], [6, 33]],
    [[2, 35], [2, 38], [7, 38]],
  ];
  const CYAN_TRACES = [
    [[8, 7], [8, 9], [6, 9]],
    [[2, 26], [2, 31], [3, 31]],
    [[8, 31], [8, 36], [5, 36]],
  ];

  function tracePixels(poly) {
    const pts = [];
    for (let i = 0; i < poly.length - 1; i++) {
      let [x0, y0] = poly[i];
      const [x1, y1] = poly[i + 1];
      const sx = Math.sign(x1 - x0);
      const sy = Math.sign(y1 - y0);
      while (x0 !== x1 || y0 !== y1) {
        pts.push(x0, y0);
        if (x0 !== x1) x0 += sx;
        else y0 += sy;
      }
    }
    const last = poly[poly.length - 1];
    pts.push(last[0], last[1]);
    return pts;
  }
  const GOLD_PTS = GOLD_TRACES.map(tracePixels);
  const CYAN_PTS = CYAN_TRACES.map(tracePixels);

  function drawTraces(list, X0, Y0, col, tick, flip, Wd, seed) {
    for (let k = 0; k < list.length; k++) {
      const pts = list[k];
      const n = pts.length >> 1;
      const p = (tick * 0.22 + k * 9 + seed) % (n + 8);
      for (let i = 0; i < n; i++) {
        const lx = pts[i * 2];
        const ly = pts[i * 2 + 1];
        const b = 0.42 + 0.58 * Math.max(0, 1 - Math.abs(i - p) / 2.2);
        pc(X0 + (flip ? Wd - 1 - lx : lx), Y0 + ly, col, b);
      }
      const ex = pts[(n - 1) * 2];
      pc(X0 + (flip ? Wd - 1 - ex : ex), Y0 + pts[(n - 1) * 2 + 1], PAL.bone, 0.7); // via pad
    }
  }

  function drawMonolith(world, tick) {
    const P = world.P;
    if (!P) return;
    const pcx = Math.round(P.x);
    const pyTop = CH - Math.round(P.y) - 6;
    const Wd = 11;
    const Ht = 42;
    const X0 = pcx * S - 2;
    const Y0 = pyTop * S;
    const f = P.facing < 0 ? -1 : 1;
    const flip = f < 0;
    const gh = world.Blocks ? world.Blocks[pcx] || 0 : 0;
    const airborne = (P.hopTimer || 0) > 0 || Math.abs(P.vy || 0) > 0.02 || P.y > gh + 0.5;

    // 1. Obsidian-slate chassis with chamfers, sheen & bioluminescent dripping bevels
    for (let yy = 0; yy < Ht; yy++) {
      const ch = yy === 0 ? 2 : yy === 1 ? 1 : yy === Ht - 1 ? 1 : 0;
      const v = yy / Ht;
      for (let xx = ch; xx < Wd - ch; xx++) {
        const bevel = xx === ch || xx === Wd - 1 - ch || yy === 0;
        if (bevel) {
          drip(yy * 0.09 - tick * 0.035 + (xx > 5 ? 2.5 : 0), _c);
          mix(PAL.obsidian, _c, 0.58, _d);
          pc(X0 + xx, Y0 + yy, _d, 1);
          continue;
        }
        const sheenX = flip ? Wd - 3 : 2;
        const sheen = xx === sheenX ? 16 : xx === Wd - 2 - (flip ? Wd - 4 : 0) ? -6 : 0;
        const grain = (h2(xx, yy) - 0.5) * 5;
        const m = 0.15 + 0.35 * (1 - v);
        px(
          X0 + xx,
          Y0 + yy,
          PAL.obsidian[0] + (PAL.slate[0] - PAL.obsidian[0]) * m + sheen + grain,
          PAL.obsidian[1] + (PAL.slate[1] - PAL.obsidian[1]) * m + sheen + grain,
          PAL.obsidian[2] + (PAL.slate[2] - PAL.obsidian[2]) * m + sheen + grain,
          1
        );
      }
    }

    // Glowing droplets sliding down both bevels
    for (let k = 0; k < 2; k++) {
      const side = k === 0 ? 0 : Wd - 1;
      const yd = (tick * 0.32 + k * 23 + pcx * 7) % (Ht + 14);
      drip(yd * 0.09 - tick * 0.035 + k * 2.5, _c);
      mix(_c, PAL.bone, 0.35, _e);
      for (let tr = 0; tr < 4; tr++) {
        const yy = Math.floor(yd) - tr;
        if (yy >= 2 && yy < Ht - 1) pc(X0 + side, Y0 + yy, _e, 0.9 - tr * 0.22);
      }
    }

    // 2. Visor slit with scanning optic
    for (let xx = 2; xx <= 8; xx++) {
      pc(X0 + xx, Y0 + 4, PAL.ink, 1);
      pc(X0 + xx, Y0 + 5, PAL.ink, 1);
    }
    const scan = 5 + f * 1 + Math.round(Math.sin(tick * 0.07) * 2);
    pc(X0 + scan, Y0 + 4, PAL.cyan, 1);
    pc(X0 + scan, Y0 + 5, PAL.cyan, 0.6);
    glow(X0 + scan - f, Y0 + 4, PAL.cyan, 0.25);
    pc(X0 + 5, Y0 + 1, PAL.gold, 1); // antenna socket

    // 3. Hair-thin gold & cyan circuit traces with travelling pulses
    drawTraces(GOLD_PTS, X0, Y0, PAL.gold, tick, flip, Wd, 0);
    drawTraces(CYAN_PTS, X0, Y0, PAL.cyan, tick, flip, Wd, 5);

    // 4. Crystal chest aperture with counter-rotating Antikythera brass gears
    const AX0 = X0 + 1;
    const AY0 = Y0 + 12;
    const AW = 9;
    const AH = 13;
    for (let yy = 0; yy < AH; yy++) {
      for (let xx = 0; xx < AW; xx++) {
        const corner = (xx === 0 || xx === AW - 1) && (yy === 0 || yy === AH - 1);
        if (corner) continue;
        const edge = xx === 0 || xx === AW - 1 || yy === 0 || yy === AH - 1;
        if (edge) pc(AX0 + xx, AY0 + yy, (xx + yy) % 4 === 0 ? PAL.brass : PAL.slateHi, 1);
        else {
          mix(PAL.ink, PAL.cyan, 0.1 + 0.04 * Math.sin(tick * 0.05 + yy * 0.5), _c);
          pc(AX0 + xx, AY0 + yy, _c, 1);
        }
      }
    }
    const spin = tick * 0.045;
    gear(AX0 + 3.2, AY0 + 4.2, 2.2, 8, spin, PAL.brass, PAL.gold, 0.95);
    gear(AX0 + 5.6, AY0 + 8.6, 1.6, 6, -spin * 1.4 + 0.3, PAL.ochre, PAL.gold, 0.95);
    gear(AX0 + 2.4, AY0 + 9.8, 1.0, 4, spin * 2.1, PAL.rust, PAL.ochre, 0.8);
    // pointer hand of the "calendar" dial
    const ha = -spin * 0.2;
    splat(AX0 + 3.2 + Math.cos(ha) * 1.4, AY0 + 4.2 + Math.sin(ha) * 1.4, PAL.bone, 0.7);
    // crystal glass specular
    pc(AX0 + 1, AY0 + 2, PAL.bone, 0.45);
    pc(AX0 + 2, AY0 + 1, PAL.bone, 0.35);
    pc(AX0 + AW - 2, AY0 + AH - 3, PAL.glass, 0.25);
    if ((P.aether || 0) > 0) {
      const pulse = 0.55 + 0.45 * Math.sin(tick * 0.12);
      for (let yy = 1; yy < AH - 1; yy++) {
        for (let xx = 1; xx < AW - 1; xx++) glow(AX0 + xx, AY0 + yy, PAL.cyan, 0.08 * pulse);
      }
      halo(AX0 + 4, AY0 + 6, 6, PAL.cyan, 0.05 * pulse);
    }

    // 5. Vent grille & feet
    for (let xx = 3; xx <= 7; xx += 2) {
      pc(X0 + xx, Y0 + Ht - 3, PAL.ink, 1);
      pc(X0 + xx, Y0 + 24, PAL.ink, 0.85);
    }

    // 6. Wings: hair-thin vane feathers fanning from the shoulders
    if (P.wings) {
      const flap = airborne ? Math.sin(tick * 0.45) : 0.15;
      for (let side = -1; side <= 1; side += 2) {
        const sx = side < 0 ? X0 - 1 : X0 + Wd;
        const sy = Y0 + 9;
        for (let v = 0; v < 4; v++) {
          const ang = -0.9 + v * 0.38 - flap * 0.5;
          const len = 9 - v;
          line(sx, sy + v, sx + side * Math.cos(ang) * len, sy + v + Math.sin(ang) * len, v & 1 ? PAL.sage : PAL.fog, 0.8);
        }
      }
    }

    // 7. Thruster micro-mechanisms (airborne) / landing struts
    const by = Y0 + Ht;
    if (airborne) {
      for (let k = 0; k < 2; k++) {
        const nx = X0 + (k === 0 ? 2 : Wd - 4);
        pc(nx, by, PAL.brass, 1);
        pc(nx + 1, by, PAL.gold, 1);
        pc(nx, by + 1, PAL.slateHi, 1);
        pc(nx + 1, by + 1, PAL.brass, 1);
        const flen = 4 + h2(tick, k) * 4 + ((P.vy || 0) > 0 ? 3 : 0);
        for (let d = 0; d < flen; d++) {
          const tcol = d < 2 ? PAL.bone : d < 4 ? PAL.gold : PAL.ember;
          const jit = h2(tick + d, k * 7) > 0.7 ? (h2(tick, d) > 0.5 ? 1 : -1) : 0;
          pc(nx + (d & 1) + jit * (d > 3 ? 1 : 0), by + 2 + d, tcol, 0.95 - d / (flen + 2));
        }
        glowSplat(nx + 0.5, by + 3, PAL.ember, 0.35);
      }
    } else if (!P.drill) {
      pc(X0 + 1, by, PAL.slateHi, 0.9);
      pc(X0 + Wd - 2, by, PAL.slateHi, 0.9);
    }

    // 8. Auger drill: helical steel flutes with brass highlight, spinning
    if (P.drill) {
      const rate = P.drilling || P.isDrilling ? 0.9 : 0.25;
      for (let yy = 0; yy < 8; yy++) {
        const half = Math.max(0, 4 - Math.floor(yy / 2));
        for (let xx = -half; xx <= half; xx++) {
          const flute = ((xx + yy * 2 + Math.floor(tick * rate)) & 3) === 0;
          pc(X0 + 5 + xx, by + yy, flute ? PAL.gold : xx < 0 ? PAL.slateHi : PAL.slate, 1);
        }
      }
      pc(X0 + 5, by + 8, PAL.bone, 1);
    }
  }

  // ---- b) TOWNS -------------------------------------------------------
  function drawCottage(t, cxN, gy, tick) {
    const L = cxN - 10;
    const R = cxN + 10;
    const wallTop = gy - 13;
    // Stone masonry: staggered courses, per-stone weathering
    for (let y = wallTop; y < gy; y++) {
      const course = Math.floor((gy - 1 - y) / 3);
      const inCourse = (gy - 1 - y) % 3;
      const offs = course & 1 ? 2 : 0;
      for (let x = L; x <= R; x++) {
        const bi = Math.floor((x - L + offs) / 5);
        const mortar = inCourse === 2 || (x - L + offs) % 5 === 0;
        if (mortar) {
          pc(x, y, PAL.slate, 1);
          continue;
        }
        const v = h2(bi + t.x * 17, course);
        mix([150, 142, 128], [116, 110, 102], v, _c);
        if (x === L || x === R) scale(_c, 0.82, _c);
        pc(x, y, _c, 1);
      }
    }
    // Door with brass knob
    for (let y = gy - 7; y < gy; y++) {
      for (let x = cxN - 4; x <= cxN - 1; x++) pc(x, y, y === gy - 7 ? PAL.ink : PAL.rust, 1);
    }
    pc(cxN - 2, gy - 4, PAL.gold, 1);
    // Warm flickering hearth windows (4-pane, cross mullion)
    const flick = 0.72 + 0.18 * Math.sin(tick * 0.13 + t.x) + 0.1 * h2(tick >> 2, t.x);
    const warm = Math.min(1, flick + (t.pulse || 0) * 0.05);
    const wins = [
      [cxN + 2, gy - 11],
      [L + 2, gy - 11],
    ];
    for (let w = 0; w < wins.length; w++) {
      const [wx, wy] = wins[w];
      for (let yy = -1; yy <= 5; yy++) {
        for (let xx = -1; xx <= 5; xx++) {
          const frame = yy === -1 || yy === 5 || xx === -1 || xx === 5;
          const mull = xx === 2 || yy === 2;
          if (frame) pc(wx + xx, wy + yy, PAL.ink, 1);
          else if (mull) pc(wx + xx, wy + yy, PAL.obsidian, 1);
          else {
            const lv = warm * (0.85 + 0.15 * (yy > 2 ? 1 : 0.6));
            px(wx + xx, wy + yy, PAL.hearth[0] * lv, PAL.hearth[1] * lv * 0.95, PAL.hearth[2] * lv * 0.8, 1);
          }
        }
      }
      pc(wx, wy + 6, PAL.slateHi, 1); // sill
      pc(wx + 4, wy + 6, PAL.slateHi, 1);
      halo(wx + 2, wy + 2, 5, PAL.hearth, 0.035 * warm);
    }
    // Gable roof with individual slate shingles
    const roofBase = wallTop - 1;
    const roofH = 12;
    for (let k = 0; k < roofH; k++) {
      const y = roofBase - k;
      const half = 12 - k;
      const row = (k / 2) | 0;
      const offs = row & 1 ? 1 : 0;
      for (let x = cxN - half; x <= cxN + half; x++) {
        const edge = x === cxN - half || x === cxN + half;
        const sh = Math.floor((x - cxN + 30 + offs) / 3);
        const shingleEdge = (k & 1) === 0;
        const v = h2(sh, row + t.x * 5);
        mix(PAL.slate, PAL.slateHi, v * 0.6, _c);
        if (shingleEdge) scale(_c, 0.72, _c);
        if ((x - cxN + 30 + offs) % 3 === 0 && !shingleEdge) scale(_c, 0.85, _c);
        if (edge) mix(_c, PAL.ink, 0.5, _c);
        pc(x, y, _c, 1);
      }
    }
    pc(cxN, roofBase - roofH, PAL.slateHi, 1); // ridge cap
    // Brick chimney
    const chX = cxN + 5;
    for (let y = roofBase - 12; y <= roofBase - 5; y++) {
      for (let x = chX; x <= chX + 2; x++) {
        const mortar = (roofBase - y) % 3 === 0;
        pc(x, y, mortar ? PAL.slate : (x + y) & 1 ? PAL.rust : [138, 86, 70], 1);
      }
    }
    pc(chX - 1, roofBase - 12, PAL.slateHi, 1);
    pc(chX + 3, roofBase - 12, PAL.slateHi, 1);
    // Smoke wisps
    for (let k = 0; k < 9; k++) {
      const age = (tick * 0.45 + k * 7.3 + t.x * 3) % 64;
      const sx = chX + 1 + Math.sin(age * 0.11 + k) * age * 0.07 + age * 0.12;
      const sy = roofBase - 13 - age * 0.55;
      splat(sx, sy, PAL.fog, 0.32 * (1 - age / 64));
    }
  }

  function drawLighthouse(t, cxN, gy, tick) {
    const towerH = 36;
    const base = gy - 1;
    for (let k = 0; k < towerH; k++) {
      const y = base - k;
      const half = 5 - Math.floor((k / towerH) * 2.6);
      const band = ((k / 6) | 0) & 1;
      const bc = band ? PAL.rust : PAL.bone;
      for (let dx = -half; dx <= half; dx++) {
        const lit = 1.06 - ((dx + half) / (2 * half)) * 0.4;
        const course = k % 3 === 0 ? 0.93 : 1;
        px(cxN + dx, y, bc[0] * lit * course, bc[1] * lit * course, bc[2] * lit * course, 1);
      }
    }
    // Glazed slits revealing the spiral stair + a keeper's lantern climbing it
    const keeper = (tick * 0.12 + t.x * 5) % towerH;
    const slits = [[7, 13], [17, 23], [27, 32]];
    for (let s = 0; s < slits.length; s++) {
      for (let k = slits[s][0]; k <= slits[s][1]; k++) {
        const y = base - k;
        for (let dx = -1; dx <= 1; dx++) pc(cxN + dx, y, PAL.ink, 1);
        const st = Math.sin(k * 0.9);
        const sdx = Math.round(st * 1.2);
        pc(cxN + sdx, y, PAL.brass, Math.cos(k * 0.9) > 0 ? 0.95 : 0.4);
        if (Math.abs(k - keeper) < 1) {
          pc(cxN + sdx, y, PAL.hearth, 1);
          glow(cxN + sdx, y - 1, PAL.hearth, 0.35);
        }
      }
    }
    // Door
    rect(cxN - 1, base - 4, 3, 5, PAL.obsidian, 1);
    // Gallery & railing
    const gal = base - towerH;
    for (let dx = -6; dx <= 6; dx++) {
      pc(cxN + dx, gal, PAL.slate, 1);
      pc(cxN + dx, gal - 3, PAL.slateHi, 0.9);
      if ((dx & 1) === 0) {
        pc(cxN + dx, gal - 1, PAL.slateHi, 0.9);
        pc(cxN + dx, gal - 2, PAL.slateHi, 0.9);
      }
    }
    // Lantern room with rotating Fresnel lens
    const theta = tick * 0.035 + t.x * 0.7;
    const cth = Math.cos(theta);
    const sth = Math.sin(theta);
    const face = Math.max(0, sth);
    const lr = gal - 4;
    for (let ry = 0; ry < 7; ry++) {
      for (let dx = -3; dx <= 3; dx++) {
        const y = lr - ry;
        if (dx === -3 || dx === 3 || ry === 0 || ry === 6) {
          pc(cxN + dx, y, PAL.obsidian, 1);
          continue;
        }
        const dist = Math.sqrt(dx * dx + (ry - 3) * (ry - 3) * 0.6);
        const ringB = (Math.floor(dist * 2 + theta * 0.5) & 1) ? 0.62 : 1;
        const lv = (0.45 + 0.55 * face) * ringB;
        px(cxN + dx, y, PAL.gold[0] * (0.6 + lv * 0.5), PAL.gold[1] * (0.55 + lv * 0.5), PAL.gold[2] * (0.5 + lv * 0.45), 1);
      }
    }
    // Dome & finial
    for (let k = 0; k < 3; k++) {
      const half = 3 - k;
      for (let dx = -half; dx <= half; dx++) pc(cxN + dx, lr - 7 - k, dx < 0 ? PAL.slateHi : PAL.slate, 1);
    }
    pc(cxN, lr - 10, PAL.gold, 1);
    pc(cxN, lr - 11, PAL.slateHi, 0.8);
    // Sweeping beam (dithered transparent wedge)
    const ly = lr - 3;
    const dir = cth >= 0 ? 1 : -1;
    const L = 10 + 96 * Math.abs(cth);
    const strength = (0.35 + 0.65 * Math.abs(cth)) * (sth < 0 ? 0.6 : 1);
    const beamCol = mix(PAL.hearth, PAL.bone, 0.5, _e);
    for (let d = 1; d < L; d++) {
      const half = 1 + d * 0.15;
      const x = cxN + dir * (3 + d);
      const fall = 1 - d / L;
      for (let dy = -Math.ceil(half); dy <= Math.ceil(half); dy++) {
        const edge = 1 - Math.abs(dy) / (half + 0.5);
        if (edge <= 0) continue;
        const a = 0.5 * strength * Math.pow(fall, 0.7) * edge;
        const t8 = BAYER8[(((ly + dy) & 7) << 3) | (x & 7)];
        if (a * 3.2 > t8) pc(x, ly + dy, beamCol, Math.min(0.55, a * 1.5));
      }
    }
    if (sth > 0.9) {
      const fl = (sth - 0.9) * 10;
      for (let r = 0; r < 8; r++) {
        const a = (r / 8) * Math.PI * 2 + tick * 0.01;
        for (let d = 2; d < 7; d++) glowSplat(cxN + Math.cos(a) * d, ly + Math.sin(a) * d, PAL.hearth, 0.18 * fl * (1 - d / 7));
      }
    }
  }

  function drawWindHarp(t, cxN, gy, tick) {
    const Lx = cxN - 8;
    const Rx = cxN + 7;
    const lTop = gy - 27;
    const rTop = gy - 34;
    // Carved posts with notches
    for (let y = lTop; y < gy; y++) {
      const notch = (gy - y) % 4 === 0;
      pc(Lx, y, notch ? PAL.rust : PAL.ochre, 1);
      pc(Lx + 1, y, notch ? PAL.ink : PAL.rust, 1);
    }
    for (let y = rTop; y < gy; y++) {
      const notch = (gy - y) % 4 === 0;
      pc(Rx, y, notch ? PAL.rust : PAL.ochre, 1);
      pc(Rx + 1, y, notch ? PAL.ink : PAL.rust, 1);
    }
    // Soundbox
    for (let x = Lx; x <= Rx + 1; x++) {
      pc(x, gy - 1, PAL.rust, 1);
      pc(x, gy - 2, PAL.ochre, 1);
      pc(x, gy - 3, x & 1 ? PAL.brass : PAL.ochre, 1);
    }
    pc(cxN, gy - 2, PAL.ink, 1); // sound hole
    // Curved neck (quadratic arch between post tops)
    const neckY = new Float32Array(Rx - Lx + 2);
    for (let i = 0; i <= Rx + 1 - Lx; i++) {
      const s = i / (Rx + 1 - Lx);
      const y = lTop + (rTop - lTop) * s - Math.sin(Math.PI * s) * 4;
      neckY[i] = y;
      pc(Lx + i, Math.round(y), PAL.ochre, 1);
      pc(Lx + i, Math.round(y) - 1, PAL.rust, 0.8);
    }
    pc(Lx, lTop - 2, PAL.gold, 1);
    pc(Rx + 1, rTop - 2, PAL.gold, 1);
    // 7 hair-thin strings vibrating in standing waves
    const wind = 0.6 + 0.4 * Math.sin(tick * 0.013 + t.x);
    for (let i = 0; i < 7; i++) {
      const sx = Lx + 2.5 + i * 2;
      const ni = Math.round(sx - Lx);
      const yTop = neckY[Math.max(0, Math.min(neckY.length - 1, ni))] + 1;
      const yBot = gy - 4;
      const len = yBot - yTop;
      const amp = wind * (0.5 + 0.5 * Math.sin(tick * 0.031 + i * 1.7)) * 1.1;
      const osc = Math.sin(tick * (0.8 + i * 0.13));
      drip(i * 0.6 - tick * 0.02, _c);
      mix(PAL.fog, _c, 0.45, _d);
      for (let y = Math.ceil(yTop); y <= yBot; y++) {
        const s = (y - yTop) / Math.max(1, len);
        const off = amp * Math.sin(Math.PI * s) * osc;
        splat(sx + off, y, _d, 0.85);
      }
    }
  }

  function drawSkyBeacon(t, cxN, gy, tick) {
    const mastH = 33;
    // Lattice truss mast with X-bracing
    for (let k = 0; k < mastH; k++) {
      const y = gy - 1 - k;
      pc(cxN - 1, y, PAL.slateHi, 1);
      pc(cxN + 1, y, PAL.slate, 1);
      const ph = k % 6;
      if (ph === 0) pc(cxN, y, PAL.brass, 1);
      else if (ph < 3) pc(cxN + (ph === 1 ? -1 : 1) * 0, y, PAL.slate, 0.6);
      else pc(cxN, y, PAL.obsidian, 0.5);
    }
    for (let dx = -3; dx <= 3; dx++) pc(cxN + dx, gy - 1, PAL.slate, 1); // footing
    // Gimbal rings
    const cy = gy - mastH - 8;
    const yaw = tick * 0.021 + t.x;
    const pitch = tick * 0.033;
    ring3(cxN, cy, 7.5, yaw, 0, PAL.brass, 0.95, 0.35);
    ring3(cxN, cy, 5.5, yaw + Math.PI / 2, pitch, PAL.gold, 0.95, 0.35);
    ring3(cxN, cy, 3.6, -tick * 0.05, pitch + Math.PI / 2, PAL.ochre, 0.95, 0.4);
    // Pivot pins on the outer ring
    pc(cxN, cy - 8, PAL.gold, 1);
    pc(cxN, cy + 8, PAL.gold, 1);
    for (let k = 0; k < 1; k++) line(cxN, cy + 9, cxN, gy - mastH - 1, PAL.slateHi, 1);
    // Aetherium core
    const pulse = 0.6 + 0.4 * Math.sin(tick * 0.09 + t.x);
    pc(cxN, cy - 1, PAL.bone, 1);
    pc(cxN - 1, cy, PAL.cyan, 1);
    pc(cxN, cy, PAL.bone, 1);
    pc(cxN + 1, cy, PAL.teal, 1);
    pc(cxN, cy + 1, PAL.cyan, 1);
    halo(cxN, cy, 5, PAL.cyan, 0.07 * pulse);
    // Sky-link pulse ring rising
    const age = (tick + t.x * 13) % 90;
    if (age < 40) ring3(cxN, cy - age * 0.8, 2 + age * 0.25, 0, 1.25, PAL.cyan, 0.4 * (1 - age / 40), 0.15 * (1 - age / 40));
  }

  function drawTowns(world, tick) {
    const towns = world.Towns;
    if (!towns) return;
    for (let i = 0; i < towns.length; i++) {
      const t = towns[i];
      const gy = groundY(world.Blocks, t.x);
      const cxN = t.x * S + 3;
      if (t.type === "cottage") drawCottage(t, cxN, gy, tick);
      else if (t.type === "lighthouse") drawLighthouse(t, cxN, gy, tick);
      else if (t.type === "harp") drawWindHarp(t, cxN, gy, tick);
      else if (t.type === "beacon") drawSkyBeacon(t, cxN, gy, tick);
    }
  }

  // ---- c) SPOOKY CAVES & ANCIENT RUINS -------------------------------
  const RUNES = [0x5ad, 0x7a7, 0x4f2, 0x2bd, 0x6b6, 0x3e9]; // 3x4 glyph bitmasks

  function drawRune(x, y, glyph, col, a) {
    for (let i = 0; i < 12; i++) {
      if ((glyph >> i) & 1) pc(x + (i % 3), y + ((i / 3) | 0), col, a);
    }
  }

  function drawCave(c, world, tick) {
    const blocks = world.Blocks;
    const elev = Math.max(2, (blocks ? blocks[c.x] : 16) - c.depth);
    const cy = CH - elev;
    const cxN = c.x * S + 3;
    const yb = (cy + 1) * S - 1;
    const archCy = yb - 13;
    const rx = 7;
    const ry = 12;
    const fed = (c.glow || 0) > 0;

    // Dark opening (semi-ellipse + shaft), darker toward the back
    for (let y = archCy - ry; y <= yb; y++) {
      for (let dx = -rx; dx <= rx; dx++) {
        if (y < archCy) {
          const k = (dx * dx) / (rx * rx) + ((y - archCy) * (y - archCy)) / (ry * ry);
          if (k > 1) continue;
        }
        const deep = 1 - Math.abs(dx) / (rx + 1);
        mix(PAL.obsidian, PAL.ink, deep, _c);
        pc(cxN + dx, y, _c, 1);
      }
    }
    // Carved voussoir stones around the arch
    const STONES = 11;
    for (let y = archCy - ry - 3; y <= yb; y++) {
      for (let dx = -rx - 3; dx <= rx + 3; dx++) {
        let inBand = false;
        let stoneId = 0;
        if (y < archCy) {
          const kIn = (dx * dx) / (rx * rx) + ((y - archCy) * (y - archCy)) / (ry * ry);
          const kOut = (dx * dx) / ((rx + 3) * (rx + 3)) + ((y - archCy) * (y - archCy)) / ((ry + 3) * (ry + 3));
          inBand = kIn > 1 && kOut <= 1;
          const ang = Math.atan2(archCy - y, dx); // 0..PI
          stoneId = Math.floor((ang / Math.PI) * STONES);
        } else {
          inBand = Math.abs(dx) > rx && Math.abs(dx) <= rx + 3;
          stoneId = 100 + Math.floor((y - archCy) / 4) * 2 + (dx < 0 ? 0 : 1);
        }
        if (!inBand) continue;
        const v = h2(stoneId + c.x * 37, 3);
        mix([128, 122, 112], [92, 90, 86], v, _c);
        const seam = h2(dx * 3 + stoneId, y) > 0.93; // weathering cracks
        if (seam) scale(_c, 0.6, _c);
        const key = stoneId === (STONES >> 1) && y < archCy;
        if (key) mix(_c, PAL.bone, 0.18, _c);
        pc(cxN + dx, y, _c, 1);
      }
    }
    // Mortar joints between voussoirs
    for (let s = 1; s < STONES; s++) {
      const ang = (s / STONES) * Math.PI;
      for (let r = 0; r < 3.2; r += 0.7) {
        const ex = Math.cos(ang) * (rx + r);
        const ey = -Math.sin(ang) * (ry + r);
        pc(Math.round(cxN + ex), Math.round(archCy + ey), PAL.obsidian, 0.85);
      }
    }
    // Keystone rune (glows when fed)
    const runeGlow = fed ? 1 : 0.35 + 0.25 * Math.sin(tick * 0.06 + c.x);
    drip(tick * 0.01 + c.x, _d);
    drawRune(cxN - 1, archCy - ry - 2, RUNES[c.x % RUNES.length], _d, runeGlow);
    // Jamb runes cycling
    for (let j = 0; j < 3; j++) {
      const on = ((tick >> 4) + j) % 3 === 0 || fed;
      drip(j * 0.8 - tick * 0.015, _e);
      drawRune(cxN - rx - 3, archCy + 1 + j * 5, RUNES[(c.x + j) % RUNES.length], _e, on ? 0.75 : 0.18);
      drawRune(cxN + rx + 1, archCy + 1 + j * 5, RUNES[(c.x + j + 3) % RUNES.length], _e, on ? 0.18 : 0.6);
    }
    // Moss draping over the stones
    for (let dx = -rx - 3; dx <= rx + 3; dx++) {
      const kTop = 1 - (dx * dx) / ((rx + 3) * (rx + 3));
      if (kTop < 0) continue;
      const topY = Math.round(archCy - Math.sqrt(kTop) * (ry + 3));
      if (h2(dx, c.x) > 0.35) {
        pc(cxN + dx, topY, PAL.moss, 0.95);
        const dl = (h2(dx * 7, c.x) * 3) | 0;
        for (let d = 1; d <= dl; d++) pc(cxN + dx, topY + d, PAL.moss, 0.7 - d * 0.15);
      }
    }
    // Stalactites inside, with falling drip
    for (let s = 0; s < 5; s++) {
      const sx = cxN - 5 + s * 2 + (s > 2 ? 1 : 0);
      const k = 1 - ((sx - cxN) * (sx - cxN)) / (rx * rx);
      const top = Math.round(archCy - Math.sqrt(Math.max(0, k)) * ry) + 1;
      const len = 2 + ((h2(s, c.x) * 4) | 0);
      for (let d = 0; d < len; d++) pc(sx, top + d, d === len - 1 ? PAL.slateHi : PAL.slate, 1);
      const dropT = (tick * 0.5 + s * 29 + c.x * 11) % 80;
      if (dropT < 24) pc(sx, top + len + Math.floor(dropT * dropT * 0.03), PAL.glass, 0.7);
    }
    // Glowing subterranean eyes
    const pairs = [
      [-3, archCy + 3, 0],
      [2, archCy + 8, 41],
    ];
    for (let p = 0; p < pairs.length; p++) {
      const [ox, oy, ph] = pairs[p];
      const blink = (tick + ph + c.x * 13) % 170 < 6;
      if (blink) continue;
      const col = fed ? PAL.hearth : PAL.ember;
      const a = fed ? 1 : 0.55 + 0.35 * Math.sin(tick * 0.08 + p + c.x);
      pc(cxN + ox, oy, col, a);
      pc(cxN + ox + 2, oy, col, a);
      if (fed) {
        pc(cxN + ox, oy - 1, col, 0.5);
        pc(cxN + ox + 2, oy - 1, col, 0.5);
      }
      glow(cxN + ox + 1, oy, col, 0.12 * a);
    }
    // Ancient mossy ruined pillar beside the arch
    const rpx = cxN - rx - 7;
    const pH = 9 + ((h2(c.x, 9) * 6) | 0);
    for (let k = 0; k < pH; k++) {
      const y = yb - k;
      const broken = k === pH - 1 ? 1 : 0;
      for (let dx = broken; dx < 3; dx++) {
        const flute = dx === 1 ? 0.9 : 1;
        mix([132, 126, 116], [104, 100, 94], h2(dx, k + c.x), _c);
        scale(_c, flute, _c);
        pc(rpx + dx, y, _c, 1);
      }
      if (h2(k, c.x * 5) > 0.75) pc(rpx + (k & 1 ? 0 : 2), y, PAL.moss, 0.85);
    }
    for (let dx = -1; dx <= 3; dx++) pc(rpx + dx, yb, PAL.slateHi, 1); // plinth
  }

  // ---- d) AETHERIUM & TIME CRYSTALS ----------------------------------
  // Faceted hexagonal prism: left lit face, center face, dark right face, internal caustics
  function drawPrism(bx, by, dir, len, half, tilt, tick, phase, a) {
    const tipLen = Math.max(2, Math.round(half * 1.6));
    for (let t = 0; t < len; t++) {
      const y = by + dir * t;
      const w = t < len - tipLen ? half : half * ((len - t) / tipLen);
      const xc = bx + t * tilt;
      const xl = Math.round(xc - w);
      const xr = Math.round(xc + w);
      for (let x = xl; x <= xr; x++) {
        const rel = (x - xl) / Math.max(1, xr - xl);
        let base;
        if (rel < 0.34) base = PAL.glass;
        else if (rel < 0.67) base = PAL.cyan;
        else base = PAL.teal;
        const caust =
          Math.sin(x * 0.9 + t * 0.45 - tick * 0.1 + phase) + Math.sin(x * -0.6 + t * 0.7 + tick * 0.07 + phase * 2);
        if (caust > 1.55) base = PAL.bone;
        const edge = x === xl || x === xr || Math.abs(rel - 0.34) < 0.12 || Math.abs(rel - 0.67) < 0.12;
        pc(x, y, base, edge ? Math.min(1, a + 0.15) : a * 0.78);
      }
    }
    pc(Math.round(bx + (len - 1) * tilt), by + dir * (len - 1), PAL.bone, 1);
  }

  function drawCrystal(cr, world, tick) {
    const blocks = world.Blocks;
    const ceil = world.Ceiling;
    const cxN = cr.x * S + 3;
    let baseY;
    let dir;
    let len;
    if (cr.onFloor) {
      const cy = CH - (blocks ? blocks[cr.x] || 14 : 14);
      baseY = (cy + 1) * S - 1;
      dir = -1;
      len = cr.size * S;
    } else {
      const ch = ceil ? ceil[cr.x] | 0 : 0;
      baseY = ch * S;
      dir = 1;
      len = Math.max(cr.size * S, (Math.max(4, ch + cr.size) + cr.size - ch) * S);
    }
    const pulse = 0.65 + 0.35 * Math.sin(tick * 0.14 + (cr.phase || 0));
    const ph = cr.phase || 0;
    drawPrism(cxN - 6, baseY, dir, Math.round(len * 0.5), 2, -0.18, tick, ph + 1, 0.8);
    drawPrism(cxN + 6, baseY, dir, Math.round(len * 0.62), 2, 0.16, tick, ph + 2, 0.8);
    drawPrism(cxN, baseY, dir, len, 3, 0, tick, ph, 0.88);
    // Inner glow & orbiting sub-pixel motes
    const midY = baseY + dir * len * 0.55;
    halo(cxN, Math.round(midY), 7, PAL.cyan, 0.05 * pulse);
    for (let m = 0; m < 4; m++) {
      const ang = tick * 0.05 + m * (Math.PI / 2) + ph;
      const z = Math.sin(ang);
      const mx = cxN + Math.cos(ang) * 9;
      const my = midY + z * 2.5 + Math.sin(tick * 0.03 + m) * 2;
      splat(mx, my, z > 0 ? PAL.bone : PAL.cyan, z > 0 ? 0.9 : 0.35);
    }
    // rising antigravity mote
    const rise = (tick * 0.6 + cr.x * 21) % 50;
    splat(cxN + Math.sin(rise * 0.2) * 1.5, baseY + dir * (len + rise * 0.7), PAL.glass, 0.6 * (1 - rise / 50));
  }

  function drawTimeCrystal(tc, cosmic, tick) {
    const cy = CH - tc.y;
    const cxN = tc.x * S + 3;
    const cyN = cy * S - 6;
    const ph = tc.phase || tick * 0.05;
    const dil = cosmic && cosmic.timeDilation > 1;
    // Octahedral gem: gold upper facets, cyan lower facets
    for (let dy = -6; dy <= 4; dy++) {
      const half = dy < 0 ? Math.round((6 + dy) * 0.6) : Math.round((4 - dy) * 0.9);
      for (let dx = -half; dx <= half; dx++) {
        const upper = dy < 0;
        const left = dx < 0;
        let col = upper ? (left ? PAL.bone : PAL.gold) : left ? PAL.cyan : PAL.teal;
        const caust = Math.sin(dx * 1.3 + dy * 0.7 - tick * 0.12 + ph) > 0.93;
        if (caust) col = PAL.bone;
        const edge = Math.abs(dx) === half || dy === 0 || dx === 0;
        pc(cxN + dx, cyN + dy, col, edge ? 1 : 0.82);
      }
    }
    // Clock hand sweeping inside the gem
    const ha = tick * (dil ? 0.2 : 0.04);
    splat(cxN + Math.cos(ha) * 2, cyN - 1 + Math.sin(ha) * 2, PAL.ink, 0.7);
    halo(cxN, cyN, 8, PAL.gold, dil ? 0.07 : 0.035);
    // Tilted orbits of sub-pixel motes (one per facet)
    const facets = tc.facets || 7;
    const speed = dil ? 3 : 1;
    for (let m = 0; m < facets; m++) {
      const ang = ph * speed + (m * Math.PI * 2) / facets + tick * 0.02 * speed;
      const tilt = 0.45 + (m % 3) * 0.25;
      const r = dil ? 11 : 7.5;
      const z = Math.sin(ang);
      const mx = cxN + Math.cos(ang) * r;
      const my = cyN + z * r * tilt * 0.5 - (m % 2) * 1.5;
      splat(mx, my, m & 1 ? PAL.cyan : PAL.gold, z > 0 ? 0.95 : 0.3);
    }
  }

  // ---- e) COMPUTE VATS & SCIENTIST LABS ------------------------------
  function drawGovernor(cx, topY, h, phase, spread, a) {
    // vertical spindle
    for (let y = 0; y < h; y++) pc(cx, topY + y, y === 0 ? PAL.gold : PAL.brass, a);
    // two flyballs on arms, spinning about the spindle
    for (let s = 0; s < 2; s++) {
      const ang = phase + s * Math.PI;
      const bx = cx + Math.cos(ang) * spread;
      const by = topY + 2 + (4 - spread) * 0.6;
      const front = Math.sin(ang) > 0;
      line(cx, topY + 1, bx, by, PAL.brass, front ? a : a * 0.5);
      splat(bx - 0.5, by - 0.5, front ? PAL.gold : PAL.ochre, a);
      splat(bx, by, front ? PAL.bone : PAL.brass, a * 0.6);
    }
    // sliding collar
    pc(cx - 1, topY + h - 2, PAL.brass, a);
    pc(cx + 1, topY + h - 2, PAL.brass, a);
  }

  function drawFlywheel(cx, cy, r, ang, a) {
    gear(cx, cy, r, 0, ang, PAL.brass, PAL.gold, a);
    for (let k = 0; k < 6; k++) {
      const t = ang + (k / 6) * Math.PI * 2;
      pc(Math.round(cx + Math.cos(t) * r), Math.round(cy + Math.sin(t) * r), k === 0 ? PAL.bone : PAL.ochre, a);
    }
  }

  function drawPipe(points, a) {
    for (let i = 0; i < points.length - 1; i++) {
      const [x0, y0] = points[i];
      const [x1, y1] = points[i + 1];
      const horiz = y0 === y1;
      line(x0, y0, x1, y1, PAL.brass, a);
      if (horiz) line(x0, y0 - 1, x1, y1 - 1, PAL.gold, a * 0.8);
      else line(x0 - 1, y0, x1 - 1, y1, PAL.gold, a * 0.8);
      pc(x1, y1, PAL.ochre, a); // flange joint
    }
  }

  function drawComputeVat(vat, world, tick) {
    const blocks = world.Blocks;
    const baseH = blocks ? blocks[vat.x] || 16 : 16;
    const px0 = (vat.x - 2) * S;
    const py0 = (CH - baseH - 4) * S;
    const vatW = 5 * S;
    const vatH = 4 * S;
    const computing = vat.state === "COMPUTING";
    // Glass cylinder: curved rim lips & vertical speculars (thin, so the live CA stays readable)
    const gx0 = px0 + 6;
    const gx1 = px0 + vatW - 7;
    const gw = gx1 - gx0;
    for (let i = 0; i <= gw; i++) {
      const s = i / gw;
      const lip = Math.round(Math.sin(Math.PI * s) * 1.5);
      pc(gx0 + i, py0 + 7 + lip, PAL.glass, 0.4);
      pc(gx0 + i, py0 + vatH - 4 + lip, PAL.glass, 0.32);
    }
    for (let y = py0 + 8; y < py0 + vatH - 4; y++) {
      pc(gx0 + 1, y, PAL.bone, 0.32);
      if ((y & 3) === 0) pc(gx1 - 1, y, PAL.glass, 0.25);
    }
    // Rising micro-bubbles
    const nb = computing ? 12 : 6;
    const innerH = vatH - 12;
    for (let b = 0; b < nb; b++) {
      const sp = 0.25 + h32(b * 13 + vat.x) * 0.35;
      const age = (tick * sp + b * 17) % innerH;
      const bxp = gx0 + 3 + h32(b * 7 + vat.x * 3) * (gw - 5) + Math.sin(age * 0.5 + b) * 0.8;
      const byp = py0 + vatH - 5 - age;
      splat(bxp, byp, PAL.bone, 0.42 * (0.4 + age / innerH));
    }
    // Brass pipes from the header to the IN/OUT ports
    const topRail = py0 - 4;
    drawPipe([[px0 + 3, py0 + 2], [px0 + 3, topRail], [px0 + 13, topRail]], 0.95);
    drawPipe([[px0 + vatW - 4, py0 + 2], [px0 + vatW - 4, topRail], [px0 + 21, topRail]], 0.95);
    // valve wheel
    const vAng = tick * (computing ? 0.12 : 0.02);
    ring3(px0 + 3, topRail - 3, 2, 0, 0, PAL.rust, 0.9, 0.9);
    splat(px0 + 3 + Math.cos(vAng) * 2 - 0.5, topRail - 3 + Math.sin(vAng) * 2 - 0.5, PAL.gold, 0.8);
    // Spinning flyball governor on top
    const gPhase = tick * (computing ? 0.28 : 0.07) + vat.x;
    drawGovernor(px0 + 17, py0 - 13, 11, gPhase, computing ? 4.5 : 2.6, 0.95);
    // Side flywheel
    drawFlywheel(px0 + vatW + 3, py0 + vatH - 8, 4, tick * (computing ? 0.22 : 0.05), 0.9);
    line(px0 + vatW - 2, py0 + vatH - 8, px0 + vatW, py0 + vatH - 8, PAL.brass, 0.9);
    // Port flash ripple
    if (vat.portFlash > 0) halo(px0 + vatW - 4, py0 + 2, 5, PAL.cyan, 0.008 * vat.portFlash);
  }

  function drawLabApparatus(lab, cosmic, tick) {
    const cy = CH - lab.y;
    const gy = cy * S;
    const cxN = lab.x * S + 3 + 15;
    const tubeH = 15;
    const top = gy - tubeH - 1;
    // Glass cylinder with liquid
    const liquid = lab.kind === "goo_lair_network" ? PAL.mauve : lab.kind === "fungal_compute_center" ? PAL.sage : PAL.teal;
    const level = top + 5 + Math.round(Math.sin(tick * 0.02 + lab.x) * 1.5);
    for (let y = top; y < gy - 1; y++) {
      for (let dx = -2; dx <= 2; dx++) {
        const wall = dx === -2 || dx === 2;
        if (wall) pc(cxN + dx, y, PAL.glass, 0.55);
        else if (y >= level) pc(cxN + dx, y, liquid, 0.55);
      }
    }
    for (let dx = -3; dx <= 3; dx++) {
      pc(cxN + dx, top - 1, PAL.brass, 1);
      pc(cxN + dx, gy - 1, PAL.brass, 1);
    }
    pc(cxN - 1, top + 2, PAL.bone, 0.5);
    for (let b = 0; b < 5; b++) {
      const span = gy - 2 - level;
      if (span <= 1) break;
      const age = (tick * (0.3 + b * 0.07) + b * 11) % span;
      splat(cxN - 1 + h32(b + lab.x) * 2 + Math.sin(age + b) * 0.4, gy - 2 - age, PAL.bone, 0.5);
    }
    // Brass pipe linking back to the lab, and governor on the cap
    drawPipe([[cxN - 3, gy - 6], [cxN - 9, gy - 6], [cxN - 9, gy - 10]], 0.9);
    const active = (lab.activePulse || 0) > 0;
    drawGovernor(cxN, top - 11, 10, lab.rotorPhase !== undefined ? lab.rotorPhase : tick * 0.1, active ? 4 : 2.5, 0.95);
  }

  // ---- f) VILLAGERS & DWARF AUTOMATA --------------------------------
  const ROLE_HOOD = { gatherer: PAL.sage, builder: PAL.ochre, guardian: PAL.slateHi };

  function drawVillager(op, world, tick) {
    const blocks = world.Blocks;
    const col = Math.max(0, Math.min(CW - 1, Math.round(op.x)));
    const h = blocks ? blocks[col] : 16;
    if (!(h > 0)) return;
    const yb = (CH - h) * S - 1;
    const xc = Math.round(op.x * S + 3);
    const f = (op.facing || 1) < 0 ? -1 : 1;
    const walking = Math.abs(op.vx || 0) > 0.005;
    const sw = walking ? Math.sin((op.stride || 0) * Math.PI) : 0;
    const seed = (op.homeX || 0) + (op.x | 0) * 0.37;
    const breath = Math.sin(tick * 0.06 + seed) > 0.55 ? 1 : 0;
    const coat = PAL.tangerine;
    const coatShade = scale(coat, 0.72, _e);

    // Legs with knee articulation
    const la = Math.round(sw * 1.4);
    const legs = [
      [xc - 1, la],
      [xc + 1, -la],
    ];
    for (let l = 0; l < 2; l++) {
      const [lx, off] = legs[l];
      pc(lx, yb - 3, PAL.rust, 1);
      pc(lx + Math.round(off * 0.4), yb - 2, PAL.rust, 1);
      pc(lx + Math.round(off * 0.7), yb - 1, PAL.rust, 1);
      pc(lx + off, yb, PAL.ink, 1);
    }
    // Torso (coat), belt & hem; shoulders rise when breathing
    const tTop = yb - 9 - breath;
    for (let y = tTop; y <= yb - 4; y++) {
      const hem = y === yb - 4;
      const half = hem ? 2 : y === tTop ? 1 : 2;
      for (let dx = -half; dx <= half; dx++) {
        const shade = dx * f < 0 ? coatShade : coat;
        pc(xc + dx, y, y === yb - 6 ? PAL.brass : shade, 1);
      }
    }
    // Head & hood
    const hy = tTop - 3;
    for (let dy = 0; dy < 3; dy++) {
      for (let dx = -1; dx <= 1; dx++) pc(xc + dx, hy + dy, dy === 0 ? ROLE_HOOD[op.role] || PAL.ochre : PAL.skin, 1);
    }
    pc(xc - f, hy + 1, ROLE_HOOD[op.role] || PAL.ochre, 1);
    pc(xc + f, hy + 1, PAL.ink, 1); // eye
    // Back arm swings opposite the front arm
    const arm = Math.round(sw * 1.2);
    pc(xc - f * 2 - arm * f * 0, tTop + 2, coatShade, 1);
    pc(xc - f * 3, tTop + 3 + (arm > 0 ? 1 : 0), PAL.skin, 0.9);
    // Front arm & hand
    const hx = xc + f * 3;
    const hyh = tTop + 3 - (arm < 0 ? 1 : 0);
    pc(xc + f * 2, tTop + 2, coat, 1);
    pc(hx, hyh, PAL.skin, 1);

    if (op.role === "guardian") {
      // Lantern on a pole, flickering
      for (let k = 1; k <= 7; k++) pc(hx, hyh - k, PAL.brass, 0.95);
      const lx = hx + f;
      const ly = hyh - 7;
      const fl = 0.75 + 0.25 * h2(tick >> 2, seed * 10);
      pc(lx, ly, PAL.brass, 1);
      pc(lx - 1, ly + 1, PAL.brass, 1);
      pc(lx + 1, ly + 1, PAL.brass, 1);
      pc(lx, ly + 1, PAL.hearth, fl);
      pc(lx - 1, ly + 2, PAL.brass, 1);
      pc(lx, ly + 2, PAL.hearth, fl * 0.8);
      pc(lx + 1, ly + 2, PAL.brass, 1);
      halo(lx, ly + 1, 5, PAL.hearth, 0.06 * fl);
    } else if (op.role === "builder") {
      // Hammer: swings when working
      const working = (op.workTimer || 0) > 0;
      const ang = working ? -1.2 + Math.abs(Math.sin(tick * 0.25)) * 1.6 : -0.5;
      const ex = hx + f * Math.cos(ang) * 3;
      const ey = hyh + Math.sin(ang) * 3;
      line(hx, hyh, ex, ey, PAL.ochre, 1);
      pc(Math.round(ex), Math.round(ey) - 1, PAL.slateHi, 1);
      pc(Math.round(ex), Math.round(ey), PAL.slate, 1);
      pc(Math.round(ex) + f, Math.round(ey), PAL.slate, 1);
    } else {
      // Woven basket at the hip, maybe carrying a glowing spore
      for (let dx = 0; dx < 3; dx++) {
        pc(hx + f * dx, hyh + 1, (dx & 1) ? PAL.brass : PAL.ochre, 1);
        pc(hx + f * dx, hyh + 2, (dx & 1) ? PAL.ochre : PAL.rust, 1);
      }
      if (op.carrying) {
        const b = 0.6 + 0.4 * Math.sin(tick * 0.2 + seed);
        pc(hx + f, hyh, PAL.sage, 1);
        glow(hx + f, hyh, PAL.sage, 0.3 * b);
      }
    }
  }

  function drawForge(dw, world, tick) {
    const fx = dw.forgeX * S + 3;
    const gy = groundY(world.Blocks, dw.forgeX);
    // Stone hearth housing with arched fire mouth
    for (let y = gy - 20; y < gy; y++) {
      for (let dx = -10; dx <= 10; dx++) {
        const course = Math.floor((gy - 1 - y) / 3);
        const mortar = (gy - 1 - y) % 3 === 2 || (dx + 20 + (course & 1) * 2) % 5 === 0;
        const crown = y < gy - 17 && Math.abs(dx) > 10 - (gy - 17 - y) * 2;
        if (crown) continue;
        if (mortar) pc(fx + dx, y, PAL.slate, 1);
        else pc(fx + dx, y, mix([126, 116, 104], [98, 92, 86], h2(dx + course * 9, course), _c), 1);
      }
    }
    // Fire mouth
    for (let y = gy - 9; y < gy - 1; y++) {
      for (let dx = -4; dx <= 4; dx++) {
        if (y < gy - 7 && Math.abs(dx) > 2) continue;
        const heat = h2(dx + (tick >> 1), y) * 0.5 + 0.5 * Math.sin(tick * 0.2 + dx);
        mix(PAL.ember, PAL.hearth, Math.max(0, heat), _c);
        pc(fx + dx, y, y > gy - 4 ? _c : PAL.ink, y > gy - 4 ? 1 : 1);
      }
    }
    halo(fx, gy - 3, 7, PAL.ember, 0.06);
    // Anvil in front
    const ax = fx + 13;
    for (let dx = -4; dx <= 4; dx++) pc(ax + dx, gy - 7, PAL.slateHi, 1);
    pc(ax + 5, gy - 7, PAL.slate, 1);
    pc(ax + 6, gy - 7, PAL.slate, 0.7); // horn
    for (let dx = -3; dx <= 3; dx++) pc(ax + dx, gy - 6, PAL.slate, 1);
    for (let y = gy - 5; y < gy - 2; y++) for (let dx = -1; dx <= 1; dx++) pc(ax + dx, y, PAL.obsidian, 1);
    for (let dx = -3; dx <= 3; dx++) {
      pc(ax + dx, gy - 2, PAL.slate, 1);
      pc(ax + dx, gy - 1, PAL.obsidian, 1);
    }
    // Sparks
    for (let k = 0; k < 6; k++) {
      const age = (tick + k * 11 + dw.forgeX * 3) % 30;
      const vx = (h32(k * 19 + dw.forgeX) - 0.5) * 0.8;
      splat(ax + vx * age, gy - 8 - age * 0.9 + age * age * 0.035, PAL.hearth, 0.9 * (1 - age / 30));
    }
  }

  function drawDwarf(dw, world, tick) {
    const blocks = world.Blocks;
    const col = Math.max(0, Math.min(CW - 1, Math.round(dw.x)));
    const h = blocks ? blocks[col] : 16;
    if (!(h > 0)) return;
    const yb = (CH - h) * S - 1;
    const xc = Math.round(dw.x * S + 3);
    const f = (dw.vx || 0) >= 0 ? 1 : -1;
    const seed = (dw.forgeX || 0) * 1.7;
    const walk = Math.sin(tick * 0.18 + seed);
    const breath = Math.sin(tick * 0.05 + seed) > 0.6 ? 1 : 0;

    // Piston legs
    const lo = walk > 0 ? 1 : 0;
    for (let k = 0; k < 4; k++) {
      pc(xc - 2, yb - k + (k === 0 ? 0 : lo * 0), k === 0 ? PAL.ink : PAL.slateHi, 1);
      pc(xc + 2, yb - k, k === 0 ? PAL.ink : PAL.slateHi, 1);
    }
    pc(xc - 2 - lo, yb, PAL.ink, 1);
    pc(xc + 2 + (1 - lo), yb, PAL.ink, 1);
    // Stocky riveted body
    const bTop = yb - 13 - breath;
    for (let y = bTop; y <= yb - 4; y++) {
      for (let dx = -4; dx <= 4; dx++) {
        if ((y === bTop || y === yb - 4) && Math.abs(dx) === 4) continue;
        const plate = ((y - bTop) / 3) | 0;
        let c = plate & 1 ? PAL.rust : PAL.brass;
        if (dx * f < -2) c = scale(c, 0.78, _c);
        const rivet = (y - bTop) % 3 === 1 && Math.abs(dx) === 3;
        pc(xc + dx, y, rivet ? PAL.gold : c, 1);
      }
    }
    // Chest gauge with sweeping needle
    pc(xc + f, bTop + 4, PAL.bone, 1);
    const na = tick * 0.06 + seed;
    pc(xc + f + Math.round(Math.cos(na)), bTop + 4 + Math.round(Math.sin(na)), PAL.ink, 1);
    // Back gear
    gear(xc - f * 5, bTop + 5, 1.6, 6, tick * 0.09 * f, PAL.ochre, PAL.gold, 0.95);
    // Beard (wavy bone strands) over the chest
    for (let y = bTop - 1; y < bTop + 4; y++) {
      for (let dx = -1; dx <= 2; dx++) {
        const xx = xc + f * dx;
        const wavy = h2(dx, y + ((tick >> 4) & 1)) > 0.22;
        if (wavy && !(y === bTop + 3 && Math.abs(dx - 0.5) > 1)) pc(xx, y, dx === 2 ? PAL.fog : PAL.bone, 1);
      }
    }
    // Helmet dome with brass brim & lamp
    const hY = bTop - 6;
    for (let y = hY; y < bTop - 1; y++) {
      const half = y === hY ? 2 : 3;
      for (let dx = -half; dx <= half; dx++) pc(xc + dx, y, y === bTop - 2 ? PAL.brass : dx * f < 0 ? PAL.slate : PAL.slateHi, 1);
    }
    pc(xc + f * 2, bTop - 2, PAL.ink, 1); // eye under the brim
    const lampX = xc + f * 4;
    const lampY = hY + 2;
    pc(lampX, lampY, PAL.hearth, 1);
    pc(lampX - f, lampY, PAL.gold, 1);
    for (let d = 1; d < 16; d++) {
      const half = d * 0.32;
      for (let dy = -Math.ceil(half); dy <= Math.ceil(half); dy++) {
        const x = lampX + f * d;
        const y = lampY + dy + Math.round(d * 0.15);
        if (0.3 * (1 - d / 16) * 2.2 > BAYER8[((y & 7) << 3) | (x & 7)]) pc(x, y, PAL.hearth, 0.16 * (1 - d / 16));
      }
    }
    // Pickaxe resting over the shoulder, swinging gently
    const ang = -2.2 + Math.sin(tick * 0.08 + seed) * 0.35;
    const sx = xc - f * 3;
    const sy = bTop + 1;
    const ex = sx + Math.cos(ang) * 8 * f;
    const ey = sy + Math.sin(ang) * 8;
    line(sx, sy, ex, ey, PAL.ochre, 1);
    const pxA = ang + Math.PI / 2;
    line(ex - Math.cos(pxA) * 3 * f, ey - Math.sin(pxA) * 3, ex + Math.cos(pxA) * 3 * f, ey + Math.sin(pxA) * 3, PAL.slateHi, 1);
  }

  // ---- Orchestration --------------------------------------------------
  function renderDetailedWorldObjects(primeRenderer, world, eco, cosmic, tick) {
    if (!CONFIG.enabled || !CONFIG.objects || !primeRenderer || !primeRenderer.data || !world) return;
    tick = resolveTick(world, tick);
    bind(primeRenderer, tick);

    if (world.Caves) for (let i = 0; i < world.Caves.length; i++) drawCave(world.Caves[i], world, tick);
    drawTowns(world, tick);
    if (world.Crystals) for (let i = 0; i < world.Crystals.length; i++) drawCrystal(world.Crystals[i], world, tick);
    if (cosmic && cosmic.TimeCrystals) for (let i = 0; i < cosmic.TimeCrystals.length; i++) drawTimeCrystal(cosmic.TimeCrystals[i], cosmic, tick);
    if (eco && eco.ComputeVats) for (let i = 0; i < eco.ComputeVats.length; i++) drawComputeVat(eco.ComputeVats[i], world, tick);
    if (cosmic && cosmic.Labs) for (let i = 0; i < cosmic.Labs.length; i++) drawLabApparatus(cosmic.Labs[i], cosmic, tick);
    if (world.Dwarves) {
      for (let i = 0; i < world.Dwarves.length; i++) if (world.Dwarves[i].hasForge) drawForge(world.Dwarves[i], world, tick);
      for (let i = 0; i < world.Dwarves.length; i++) drawDwarf(world.Dwarves[i], world, tick);
    }
    if (eco && eco.OrangePeople) for (let i = 0; i < eco.OrangePeople.length; i++) drawVillager(eco.OrangePeople[i], world, tick);
    drawMonolith(world, tick);
  }

  const API = {
    CONFIG,
    PALETTE: PAL,
    BAYER8,
    getBlueNoise,
    renderBackgroundParallaxDither,
    renderSurfaceDitherScreens,
    renderDetailedWorldObjects,
  };

  root.SlopesParallaxDitherArt = API;
  if (typeof module !== "undefined" && module.exports) module.exports = API;
})(typeof window !== "undefined" ? window : globalThis);
