/* ============================================================================
 * SLOPES 2 — 5-FOLD NON-EUCLIDEAN SCENE ROTATION & PERSPECTIVE TOPOLOGY ENGINE
 * Module: /sim/pentagonal_rotation.js (window.SlopesRotation & CommonJS)
 *
 * Implements the 5-Fold Pentagonal Manifold Topology (C_5 Double-Cover):
 *   1. 5 Rotational Facets per (worldX, worldLayer) Screen: rotFacet in {0, 1, 2, 3, 4}
 *      - Facet 0 (  0 deg): Canonical 2D projection of (worldX, worldLayer).
 *                           Acts 100% identically to standard 2D Slopes 2 gameplay.
 *      - Facet 1 ( 72 deg): Orthogonal Pentagonal Projection — hidden Z-depth of
 *                           objects in Facet 0 becomes the new X-axis, with coherent
 *                           rotated terrain sharing seaLevel and pivot elevation, plus
 *                           newly unoccluded Pentagonal Geodes, Spooky Caves & Crows.
 *      - Facet 2 (144 deg): Pentagonal Apex Projection — twin-arch coastal canyon /
 *                           ridge overlook bridging Facet 1 and Facet 3.
 *      - Facet 3 (216 deg): 3 Rotations from Facet 0 — EXACT HORIZONTAL MIRROR
 *                           (x -> W - 1 - x) of Facet 0! All terrain columns Blocks[x],
 *                           Ceiling[x], IslandBase[x], seaSide, Player P.x, and all
 *                           world, ecology, cosmic, and tabForm entities are mirrored
 *                           with horizontal velocities negated. Changes in Facet 0 and
 *                           Facet 3 sync live in reverse!
 *      - Facet 4 (288 deg): 3 Rotations from Facet 1 — EXACT HORIZONTAL MIRROR
 *                           (x -> W - 1 - x) of Facet 1! Changes in Facet 1 and Facet 4
 *                           sync live in reverse.
 *      - Rotating 5 times ((rotFacet + 5) % 5 === rotFacet) ALWAYS returns you to the
 *        EXACT same spot, terrain, and object positions!
 *
 *   2. Live 24-Frame 3D Perspective Rotation Animation on the 840x525 Prime Framebuffer:
 *      - Rotates every terrain column x in [0, 119] and depth z_x around pivot
 *        (x_c = 59.5, z_c = 0):
 *          x' = x_c + (x - x_c)*cos(theta) - z_x*sin(theta)
 *          z' = (x - x_c)*sin(theta) + z_x*cos(theta)
 *      - Cross-blends outgoing (fromScene) and incoming (toScene) 3D columns and
 *        entities (Towns, Caves, Crystals, Airships, Castles, Vats, Villagers,
 *        Seer Crows, Tab-Forms, and Player Monolith) with depth-sorted parallax,
 *        subtle perspective scale 1 / (1 + z' * 0.004), and a crisp 7x7 sub-pixel
 *        Pentagonal Compass / Facet Indicator at the top of the screen.
 * ============================================================================ */

(function (global) {
  "use strict";

  const COARSE_W = 144;
  const COARSE_H = 90;
  const SCALE = 7;
  const NATIVE_W = COARSE_W * SCALE; // 1008
  const NATIVE_H = COARSE_H * SCALE; // 630

  const NUM_FACETS = 5;
  const FACET_ANGLE_DEG = 72;
  const FACET_ANGLE_RAD = (Math.PI * 2) / NUM_FACETS; // 72 deg in radians
  const PIVOT_X = 71.5; // Center of 0..143 coarse columns
  const PIVOT_Y = 45.0; // Center of 0..89 coarse rows
  const ROTATION_FRAMES = 24;

  const FACET_TITLES = [
    "FACET 1/5 • 0° [ORIGIN]",
    "FACET 1/5 • 72°",
    "FACET 2/5 • 144° [APEX]",
    "FACET 4/5 • 216° [REV]",
    "FACET 5/5 • 288° [REV]",
  ];

  // Compact 3x5 bitmap font glyphs (uppercase ASCII + digits + degree/symbols) for 7x7 sub-pixel HUD
  const MINI_GLYPHS = {
    "0": [0b111, 0b101, 0b101, 0b101, 0b111],
    "1": [0b010, 0b110, 0b010, 0b010, 0b111],
    "2": [0b111, 0b001, 0b111, 0b100, 0b111],
    "3": [0b111, 0b001, 0b111, 0b001, 0b111],
    "4": [0b101, 0b101, 0b111, 0b001, 0b001],
    "5": [0b111, 0b100, 0b111, 0b001, 0b111],
    "6": [0b111, 0b100, 0b111, 0b101, 0b111],
    "7": [0b111, 0b001, 0b010, 0b010, 0b010],
    "8": [0b111, 0b101, 0b111, 0b101, 0b111],
    "9": [0b111, 0b101, 0b111, 0b001, 0b111],
    "A": [0b010, 0b101, 0b111, 0b101, 0b101],
    "B": [0b110, 0b101, 0b110, 0b101, 0b110],
    "C": [0b111, 0b100, 0b100, 0b100, 0b111],
    "D": [0b110, 0b101, 0b101, 0b101, 0b110],
    "E": [0b111, 0b100, 0b110, 0b100, 0b111],
    "F": [0b111, 0b100, 0b110, 0b100, 0b100],
    "G": [0b111, 0b100, 0b101, 0b101, 0b111],
    "H": [0b101, 0b101, 0b111, 0b101, 0b101],
    "I": [0b111, 0b010, 0b010, 0b010, 0b111],
    "L": [0b100, 0b100, 0b100, 0b100, 0b111],
    "M": [0b101, 0b111, 0b111, 0b101, 0b101],
    "N": [0b101, 0b111, 0b111, 0b111, 0b101],
    "O": [0b111, 0b101, 0b101, 0b101, 0b111],
    "P": [0b111, 0b101, 0b111, 0b100, 0b100],
    "R": [0b111, 0b101, 0b110, 0b101, 0b101],
    "S": [0b111, 0b100, 0b111, 0b001, 0b111],
    "T": [0b111, 0b010, 0b010, 0b010, 0b010],
    "U": [0b101, 0b101, 0b101, 0b101, 0b111],
    "V": [0b101, 0b101, 0b101, 0b101, 0b010],
    "W": [0b101, 0b101, 0b111, 0b111, 0b101],
    "X": [0b101, 0b101, 0b010, 0b101, 0b101],
    "Y": [0b101, 0b101, 0b010, 0b010, 0b010],
    "Z": [0b111, 0b001, 0b010, 0b100, 0b111],
    "/": [0b001, 0b001, 0b010, 0b100, 0b100],
    "[": [0b110, 0b100, 0b100, 0b100, 0b110],
    "]": [0b011, 0b001, 0b001, 0b001, 0b011],
    ":": [0b000, 0b010, 0b000, 0b010, 0b000],
    "-": [0b000, 0b000, 0b111, 0b000, 0b000],
    "•": [0b000, 0b010, 0b111, 0b010, 0b000],
    "°": [0b110, 0b110, 0b000, 0b000, 0b000],
    " ": [0b000, 0b000, 0b000, 0b000, 0b000],
  };

  // ==========================================================================
  // SAFE NUMERICAL & CLAMP HELPERS
  // ==========================================================================
  function clamp(v, lo, hi) {
    if (!Number.isFinite(v)) return lo;
    return v < lo ? lo : v > hi ? hi : v;
  }

  function clampCol(x) {
    if (!Number.isFinite(x)) return 0;
    const r = Math.round(x);
    return r < 0 ? 0 : r >= COARSE_W ? COARSE_W - 1 : r;
  }

  function clampByte(c) {
    if (!Number.isFinite(c)) return 0;
    const r = Math.round(c);
    return r < 0 ? 0 : r > 255 ? 255 : r;
  }

  function mirrorX(x) {
    if (!Number.isFinite(x)) return 0;
    return (COARSE_W - 1) - x;
  }

  function mirrorCol(x) {
    return clampCol((COARSE_W - 1) - Math.round(x));
  }

  function hash32(a, b, c) {
    let h = (Math.imul((a | 0) + 1024, 374761393) ^
             Math.imul((b | 0) + 1024, 668265263) ^
             Math.imul((c | 0) + 1024, 1274126177)) >>> 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
    return (h ^ (h >>> 16)) >>> 0;
  }

  function detNorm(a, b, c) {
    return (hash32(a, b, c) >>> 0) / 4294967296;
  }

  // ==========================================================================
  // TYPED-ARRAY-PRESERVING DEEP CLONE
  // ==========================================================================
  function deepCloneValue(val, depth) {
    if (depth === undefined) depth = 0;
    if (val === null || typeof val !== "object" || depth > 8) {
      return val;
    }
    if (typeof val === "function") {
      return val;
    }
    if (ArrayBuffer.isView(val)) {
      return new val.constructor(val);
    }
    if (Array.isArray(val)) {
      const out = new Array(val.length);
      for (let i = 0; i < val.length; i++) {
        out[i] = deepCloneValue(val[i], depth + 1);
      }
      return out;
    }
    const copy = {};
    const keys = Object.keys(val);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      // Avoid recursive circular parent pointers if any exist
      if (k === "targetRef" || k === "entity" || k === "ref" || k === "vat" || k === "onAirship") {
        copy[k] = null;
      } else {
        copy[k] = deepCloneValue(val[k], depth + 1);
      }
    }
    return copy;
  }

  function cloneEntityArray(arr) {
    if (!Array.isArray(arr)) return [];
    const out = new Array(arr.length);
    for (let i = 0; i < arr.length; i++) {
      out[i] = deepCloneValue(arr[i], 0);
    }
    return out;
  }

  // Extract the inner ecological object if wrapped in { eco: ... }
  function unwrapEco(ecoOrSys) {
    if (!ecoOrSys) return null;
    if (ecoOrSys.eco && typeof ecoOrSys.eco === "object") return ecoOrSys.eco;
    return ecoOrSys;
  }

  // Extract the inner cosmic object if wrapped in { cosmic: ... }
  function unwrapCosmic(cosmicOrSys) {
    if (!cosmicOrSys) return null;
    if (cosmicOrSys.cosmic && typeof cosmicOrSys.cosmic === "object") return cosmicOrSys.cosmic;
    return cosmicOrSys;
  }

  // Extract TabForms array from tabForms arg, worldBundle, eco, or cosmic
  function unwrapTabForms(tabFormsArg, worldBundle, ecoObj, cosmicObj) {
    if (Array.isArray(tabFormsArg)) return tabFormsArg;
    if (tabFormsArg && Array.isArray(tabFormsArg.TabForms)) return tabFormsArg.TabForms;
    if (tabFormsArg && Array.isArray(tabFormsArg.forms)) return tabFormsArg.forms;
    if (tabFormsArg && Array.isArray(tabFormsArg.entities)) return tabFormsArg.entities;
    if (worldBundle && Array.isArray(worldBundle.TabForms)) return worldBundle.TabForms;
    if (ecoObj && Array.isArray(ecoObj.TabForms)) return ecoObj.TabForms;
    if (cosmicObj && Array.isArray(cosmicObj.TabForms)) return cosmicObj.TabForms;
    return null;
  }

  // ==========================================================================
  // CAPTURE & APPLY COMPLETE 2D SCENE SNAPSHOT
  // ==========================================================================
  function captureSceneSnapshot(worldBundle, ecoOrSys, cosmicOrSys, tabFormsArg) {
    const wb = worldBundle || {};
    const eco = unwrapEco(ecoOrSys);
    const cosmic = unwrapCosmic(cosmicOrSys);
    const tabForms = unwrapTabForms(tabFormsArg, wb, eco, cosmic);

    const blocks = Array.isArray(wb.Blocks) ? wb.Blocks.slice(0, COARSE_W) : new Array(COARSE_W).fill(15);
    const ceiling = Array.isArray(wb.Ceiling) ? wb.Ceiling.slice(0, COARSE_W) : new Array(COARSE_W).fill(0);
    const islandBase = Array.isArray(wb.IslandBase) ? wb.IslandBase.slice(0, COARSE_W) : new Array(COARSE_W).fill(0);

    const pSrc = wb.P || { x: 58, y: 20, e: 7, facing: 1 };
    const player = {
      x: clampCol(pSrc.x !== undefined ? pSrc.x : 58),
      y: Number.isFinite(pSrc.y) ? pSrc.y : 20,
      e: Number.isFinite(pSrc.e) ? pSrc.e : 7,
      vy: Number.isFinite(pSrc.vy) ? pSrc.vy : 0,
      facing: pSrc.facing || 1,
      carryingRock: !!pSrc.carryingRock,
      drill: !!pSrc.drill,
      aether: pSrc.aether || 0,
      wings: !!pSrc.wings,
      forge: !!pSrc.forge,
      raptorPet: !!pSrc.raptorPet,
    };

    const snapshot = {
      worldX: wb.worldX || 0,
      worldLayer: wb.worldLayer || 0,
      currentBiome: wb.currentBiome || "surface",
      seaSide: wb.seaSide || "left",
      seaLevel: wb.seaLevel !== undefined ? wb.seaLevel : 12,
      isMagmaBasin: !!wb.isMagmaBasin,
      Blocks: blocks,
      Ceiling: ceiling,
      IslandBase: islandBase,
      P: player,
      worldEntities: {
        Towns: cloneEntityArray(wb.Towns),
        Caves: cloneEntityArray(wb.Caves),
        TarVeins: cloneEntityArray(wb.TarVeins),
        Worms: cloneEntityArray(wb.Worms),
        Relics: cloneEntityArray(wb.Relics),
        Crystals: cloneEntityArray(wb.Crystals),
        Mushrooms: cloneEntityArray(wb.Mushrooms),
        Dwarves: cloneEntityArray(wb.Dwarves),
        Kelp: cloneEntityArray(wb.Kelp),
        Airships: cloneEntityArray(wb.Airships),
        Raptors: cloneEntityArray(wb.Raptors),
        Nests: cloneEntityArray(wb.Nests),
        Castles: cloneEntityArray(wb.Castles),
        Shafts: cloneEntityArray(wb.Shafts),
        Rocks: cloneEntityArray(wb.Rocks),
      },
      ecoEntities: eco
        ? {
            Ferns: cloneEntityArray(eco.Ferns),
            Critters: cloneEntityArray(eco.Critters),
            OrangePeople: cloneEntityArray(eco.OrangePeople),
            Children: cloneEntityArray(eco.Children),
            ComputeVats: cloneEntityArray(eco.ComputeVats),
            Automata: cloneEntityArray(eco.Automata),
            SeerCrows: cloneEntityArray(eco.SeerCrows),
            Skeksis: cloneEntityArray(eco.Skeksis),
            GooNodes: cloneEntityArray(eco.GooNodes),
            Webs: cloneEntityArray(eco.Webs),
          }
        : null,
      cosmicEntities: cosmic
        ? {
            WfcZones: cloneEntityArray(cosmic.WfcZones),
            RecursiveObjects: cloneEntityArray(cosmic.RecursiveObjects),
            Labs: cloneEntityArray(cosmic.Labs),
            Scientists: cloneEntityArray(cosmic.Scientists),
            Conduits: cloneEntityArray(cosmic.Conduits),
            Packets: cloneEntityArray(cosmic.Packets),
            BuildSites: cloneEntityArray(cosmic.BuildSites),
            Workers: cloneEntityArray(cosmic.Workers),
            EvolvedFlora: cloneEntityArray(cosmic.EvolvedFlora),
            Crafts: cloneEntityArray(cosmic.Crafts),
            TimeCrystals: cloneEntityArray(cosmic.TimeCrystals),
            Transdimensionals: cloneEntityArray(cosmic.Transdimensionals),
          }
        : null,
      tabForms: tabForms ? cloneEntityArray(tabForms) : null,
    };

    return snapshot;
  }

  function replaceArrayContents(targetArr, sourceArr) {
    if (!Array.isArray(targetArr) || !Array.isArray(sourceArr)) return;
    targetArr.length = 0;
    for (let i = 0; i < sourceArr.length; i++) {
      targetArr.push(deepCloneValue(sourceArr[i], 0));
    }
  }

  function applySceneSnapshot(snapshot, worldBundle, ecoOrSys, cosmicOrSys, tabFormsArg) {
    if (!snapshot) return;
    const wb = worldBundle || {};
    const eco = unwrapEco(ecoOrSys);
    const cosmic = unwrapCosmic(cosmicOrSys);
    const tabForms = unwrapTabForms(tabFormsArg, wb, eco, cosmic);

    if (Array.isArray(wb.Blocks) && Array.isArray(snapshot.Blocks)) {
      for (let i = 0; i < COARSE_W; i++) {
        wb.Blocks[i] = snapshot.Blocks[i];
      }
    }
    if (Array.isArray(wb.Ceiling) && Array.isArray(snapshot.Ceiling)) {
      for (let i = 0; i < COARSE_W; i++) {
        wb.Ceiling[i] = snapshot.Ceiling[i];
      }
    }
    if (Array.isArray(wb.IslandBase) && Array.isArray(snapshot.IslandBase)) {
      for (let i = 0; i < COARSE_W; i++) {
        wb.IslandBase[i] = snapshot.IslandBase[i];
      }
    }

    if (wb.seaSide !== undefined && snapshot.seaSide !== undefined) {
      wb.seaSide = snapshot.seaSide;
    }
    if (wb.seaLevel !== undefined && snapshot.seaLevel !== undefined) {
      wb.seaLevel = snapshot.seaLevel;
    }

    if (wb.P && snapshot.P) {
      const tfState = global.SlopesTabForms && global.SlopesTabForms.state;
      const as = tfState && tfState.airshipVillage;
      if (as && as.riding) {
        // When rotating the 5-fold world while aboard the Airship Castle-Village,
        // keep the player anchored to the Airship deck/rope and preserve airship flight!
        wb.P.x = clampCol(Math.round(as.x));
        wb.P.y = (as.y || 50) - 1.5 - (as.playerRopeDrop || 0);
        wb.P.hopTimer = 0;
        snapshot.P.x = wb.P.x;
        snapshot.P.y = wb.P.y;
      } else {
        wb.P.x = clampCol(snapshot.P.x);
        wb.P.y = Number.isFinite(snapshot.P.y) ? snapshot.P.y : (wb.Blocks ? wb.Blocks[wb.P.x] : 20);
        if (snapshot.P.facing !== undefined) wb.P.facing = snapshot.P.facing;
        wb.P.onAirship = null;
      }
    }

    if (snapshot.worldEntities) {
      const we = snapshot.worldEntities;
      const worldKeys = [
        "Towns",
        "Caves",
        "TarVeins",
        "Worms",
        "Relics",
        "Crystals",
        "Mushrooms",
        "Dwarves",
        "Kelp",
        "Airships",
        "Raptors",
        "Nests",
        "Castles",
        "Shafts",
        "Rocks",
      ];
      for (let i = 0; i < worldKeys.length; i++) {
        const k = worldKeys[i];
        if (Array.isArray(wb[k]) && Array.isArray(we[k])) {
          replaceArrayContents(wb[k], we[k]);
        }
      }
    }

    if (eco && snapshot.ecoEntities) {
      const ee = snapshot.ecoEntities;
      const ecoKeys = [
        "Ferns",
        "Critters",
        "OrangePeople",
        "Children",
        "ComputeVats",
        "Automata",
        "SeerCrows",
        "Skeksis",
        "GooNodes",
        "Webs",
      ];
      for (let i = 0; i < ecoKeys.length; i++) {
        const k = ecoKeys[i];
        if (Array.isArray(eco[k]) && Array.isArray(ee[k])) {
          replaceArrayContents(eco[k], ee[k]);
        }
      }
    }

    if (cosmic && snapshot.cosmicEntities) {
      const ce = snapshot.cosmicEntities;
      const cosmicKeys = [
        "WfcZones",
        "RecursiveObjects",
        "Labs",
        "Scientists",
        "Conduits",
        "Packets",
        "BuildSites",
        "Workers",
        "EvolvedFlora",
        "Crafts",
        "TimeCrystals",
        "Transdimensionals",
      ];
      for (let i = 0; i < cosmicKeys.length; i++) {
        const k = cosmicKeys[i];
        if (Array.isArray(cosmic[k]) && Array.isArray(ce[k])) {
          replaceArrayContents(cosmic[k], ce[k]);
        }
      }
      cosmic.mountedCraft = null;
    }

    if (tabForms && Array.isArray(snapshot.tabForms)) {
      if (tabForms.length === snapshot.tabForms.length && tabForms.length > 0 && tabForms[0].shell) {
        for (let i = 0; i < tabForms.length; i++) {
          const liveTf = tabForms[i];
          const snapTf = snapshot.tabForms[i];
          if (snapTf && typeof snapTf.x === "number") {
            liveTf.targetX = snapTf.x;
          }
          liveTf.dimDepth = Math.min(1.0, 0.92 + i * 0.08);
          liveTf.dimTravelTimer = 110 + i * 24;
        }
      } else {
        replaceArrayContents(tabForms, snapshot.tabForms);
      }
      if (global.SlopesTabForms && typeof global.SlopesTabForms.onDimensionRotate === "function") {
        global.SlopesTabForms.onDimensionRotate(state.rotFacet);
      }
    }
  }

  // ==========================================================================
  // HORIZONTAL MIRROR TRANSFORMATION (x -> W - 1 - x) FOR 3-STEP ROTATION
  // ==========================================================================
  function flipSeaSide(seaSide) {
    if (seaSide === "left") return "right";
    if (seaSide === "right") return "left";
    if (seaSide === "left_sea") return "right_sea";
    if (seaSide === "right_sea") return "left_sea";
    return seaSide;
  }

  function mirrorEntityInPlace(ent, isFloatX) {
    if (!ent || typeof ent !== "object") return ent;

    if (typeof ent.x === "number") {
      ent.x = isFloatX ? mirrorX(ent.x) : mirrorCol(ent.x);
    }
    if (typeof ent.vx === "number") {
      ent.vx = -ent.vx;
    }
    if (typeof ent.facing === "number") {
      ent.facing = -ent.facing;
    }
    if (typeof ent.dir === "number") {
      ent.dir = -ent.dir;
    }
    if (typeof ent.frondDir === "number") {
      ent.frondDir = -ent.frondDir;
    }
    if (typeof ent.homeX === "number") {
      ent.homeX = isFloatX ? mirrorX(ent.homeX) : mirrorCol(ent.homeX);
    }
    if (typeof ent.targetX === "number") {
      ent.targetX = isFloatX ? mirrorX(ent.targetX) : mirrorCol(ent.targetX);
    }
    if (typeof ent.perchX === "number") {
      ent.perchX = isFloatX ? mirrorX(ent.perchX) : mirrorCol(ent.perchX);
    }
    if (typeof ent.lairX === "number") {
      ent.lairX = isFloatX ? mirrorX(ent.lairX) : mirrorCol(ent.lairX);
    }
    if (typeof ent.forgeX === "number") {
      ent.forgeX = mirrorCol(ent.forgeX);
    }
    if (typeof ent.fromX === "number") {
      ent.fromX = mirrorCol(ent.fromX);
    }
    if (typeof ent.toX === "number") {
      ent.toX = mirrorCol(ent.toX);
    }
    if (typeof ent.x1 === "number") {
      ent.x1 = isFloatX ? mirrorX(ent.x1) : mirrorCol(ent.x1);
    }
    if (typeof ent.x2 === "number") {
      ent.x2 = isFloatX ? mirrorX(ent.x2) : mirrorCol(ent.x2);
    }
    if (typeof ent.inPortX === "number" && typeof ent.outPortX === "number") {
      ent.inPortX = ent.x - 2;
      ent.outPortX = ent.x + 2;
    }
    if (Array.isArray(ent.segments)) {
      for (let i = 0; i < ent.segments.length; i++) {
        const seg = ent.segments[i];
        if (seg && typeof seg.x === "number") {
          seg.x = mirrorCol(seg.x);
        }
      }
    }
    // Mirror 7x7 Vat CA grid horizontally if present
    if (ent.gridA && ArrayBuffer.isView(ent.gridA) && ent.caW && ent.caH) {
      const w = ent.caW;
      const h = ent.caH;
      for (let r = 0; r < h; r++) {
        const rowOff = r * w;
        for (let c = 0; c < (w >> 1); c++) {
          const tmp = ent.gridA[rowOff + c];
          ent.gridA[rowOff + c] = ent.gridA[rowOff + (w - 1 - c)];
          ent.gridA[rowOff + (w - 1 - c)] = tmp;
        }
      }
    }
    // Mirror WFC or BuildSite grid horizontally if present
    if (ent.grid && ArrayBuffer.isView(ent.grid)) {
      const gw = ent.subW || ent.width || 0;
      const gh = ent.subH || ent.height || 0;
      if (gw > 0 && gh > 0 && gw * gh <= ent.grid.length) {
        for (let r = 0; r < gh; r++) {
          const rowOff = r * gw;
          for (let c = 0; c < (gw >> 1); c++) {
            const tmp = ent.grid[rowOff + c];
            ent.grid[rowOff + c] = ent.grid[rowOff + (gw - 1 - c)];
            ent.grid[rowOff + (gw - 1 - c)] = tmp;
          }
        }
      }
    }

    return ent;
  }

  function mirrorScene(srcSnapshot) {
    const mirrored = deepCloneValue(srcSnapshot, 0);

    for (let x = 0; x < COARSE_W; x++) {
      const mx = (COARSE_W - 1) - x;
      mirrored.Blocks[x] = srcSnapshot.Blocks[mx];
      mirrored.Ceiling[x] = srcSnapshot.Ceiling[mx];
      mirrored.IslandBase[x] = srcSnapshot.IslandBase[mx];
    }

    mirrored.seaSide = flipSeaSide(srcSnapshot.seaSide);

    if (mirrored.P && srcSnapshot.P) {
      mirrored.P.x = mirrorCol(srcSnapshot.P.x);
      mirrored.P.y = srcSnapshot.P.y;
      mirrored.P.facing = -(srcSnapshot.P.facing || 1);
    }

    if (mirrored.worldEntities) {
      const we = mirrored.worldEntities;
      const intLists = [
        "Towns",
        "Caves",
        "TarVeins",
        "Worms",
        "Relics",
        "Crystals",
        "Mushrooms",
        "Dwarves",
        "Kelp",
        "Nests",
        "Castles",
        "Shafts",
      ];
      for (let i = 0; i < intLists.length; i++) {
        const list = we[intLists[i]];
        if (Array.isArray(list)) {
          for (let j = 0; j < list.length; j++) {
            mirrorEntityInPlace(list[j], false);
          }
        }
      }
      const floatLists = ["Airships", "Raptors", "Rocks"];
      for (let i = 0; i < floatLists.length; i++) {
        const list = we[floatLists[i]];
        if (Array.isArray(list)) {
          for (let j = 0; j < list.length; j++) {
            mirrorEntityInPlace(list[j], true);
          }
        }
      }
    }

    if (mirrored.ecoEntities) {
      const ee = mirrored.ecoEntities;
      const intEco = ["Ferns", "ComputeVats", "GooNodes", "Webs"];
      for (let i = 0; i < intEco.length; i++) {
        const list = ee[intEco[i]];
        if (Array.isArray(list)) {
          for (let j = 0; j < list.length; j++) {
            mirrorEntityInPlace(list[j], false);
          }
        }
      }
      const floatEco = [
        "Critters",
        "OrangePeople",
        "Children",
        "Automata",
        "SeerCrows",
        "Skeksis",
      ];
      for (let i = 0; i < floatEco.length; i++) {
        const list = ee[floatEco[i]];
        if (Array.isArray(list)) {
          for (let j = 0; j < list.length; j++) {
            mirrorEntityInPlace(list[j], true);
          }
        }
      }
    }

    if (mirrored.cosmicEntities) {
      const ce = mirrored.cosmicEntities;
      const intCosmic = [
        "WfcZones",
        "RecursiveObjects",
        "Labs",
        "Conduits",
        "BuildSites",
        "EvolvedFlora",
        "TimeCrystals",
      ];
      for (let i = 0; i < intCosmic.length; i++) {
        const list = ce[intCosmic[i]];
        if (Array.isArray(list)) {
          for (let j = 0; j < list.length; j++) {
            mirrorEntityInPlace(list[j], false);
          }
        }
      }
      const floatCosmic = ["Scientists", "Packets", "Workers", "Crafts", "Transdimensionals"];
      for (let i = 0; i < floatCosmic.length; i++) {
        const list = ce[floatCosmic[i]];
        if (Array.isArray(list)) {
          for (let j = 0; j < list.length; j++) {
            mirrorEntityInPlace(list[j], true);
          }
        }
      }
    }

    if (Array.isArray(mirrored.tabForms)) {
      for (let j = 0; j < mirrored.tabForms.length; j++) {
        mirrorEntityInPlace(mirrored.tabForms[j], false);
      }
    }

    return mirrored;
  }

  // ==========================================================================
  // ORTHOGONAL PENTAGONAL PROJECTIONS (FACET 1 = 72°, FACET 2 = 144°)
  // ==========================================================================
  function computeEntityDepthZ(ent, idx, kindCode, wx, wl) {
    if (ent && typeof ent.z === "number" && Number.isFinite(ent.z)) {
      return clamp(ent.z, -48, 48);
    }
    const x0 = ent && typeof ent.x === "number" ? ent.x : 60;
    const h = detNorm(Math.round(x0) + idx * 17, kindCode * 31 + wx, wl * 53);
    // Spread objects in [-38, +38] depth around the central rotation axis
    let z = (h - 0.5) * 76;
    if (Math.abs(z) < 9) {
      z = z >= 0 ? 14 : -14;
    }
    return z;
  }

  function projectXByAngle(x0, z0, thetaRad, minMargin) {
    const margin = minMargin !== undefined ? minMargin : 6;
    const dx = x0 - PIVOT_X;
    const xRot = PIVOT_X + dx * Math.cos(thetaRad) - z0 * Math.sin(thetaRad);
    return clamp(Math.round(xRot), margin, COARSE_W - 1 - margin);
  }

  function buildOrthogonalFacet(facet0Snapshot, facetIndex) {
    // facetIndex is 1 (72 deg) or 2 (144 deg)
    const theta = facetIndex * FACET_ANGLE_RAD;
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);

    const rot = deepCloneValue(facet0Snapshot, 0);
    const wx = facet0Snapshot.worldX || 0;
    const wl = facet0Snapshot.worldLayer || 0;
    const seaLevel = facet0Snapshot.seaLevel || 12;

    // 1. Construct rotated 2D terrain profile sharing central pivot height & seaLevel
    const origBlocks = facet0Snapshot.Blocks;
    const pivotH = origBlocks[60] || 22;
    const phaseA = detNorm(wx + facetIndex * 19, wl + 7, 101) * Math.PI * 2;
    const phaseB = detNorm(wx + facetIndex * 37, wl + 13, 202) * Math.PI * 2;

    for (let x = 0; x < COARSE_W; x++) {
      // Sample orthogonal 3D ridge cross-section combining rotated original profile + orthogonal Z-ridge
      const u = x - PIVOT_X;
      const sampleX = clampCol(PIVOT_X + u * cosT + Math.sin(x * 0.08 + phaseA) * 18 * sinT);
      const baseH = origBlocks[sampleX];

      if (wl > 0 && baseH === 0 && facet0Snapshot.currentBiome !== "raptors") {
        // Sky island gaps rotated by 72/144 degrees
        const islandWave = Math.sin(x * 0.095 + phaseA) + 0.5 * Math.cos(x * 0.19 + phaseB);
        if (islandWave > 0.25) {
          const surf = Math.round(22 + islandWave * 6);
          rot.Blocks[x] = surf;
          rot.IslandBase[x] = Math.max(4, surf - 10);
        } else {
          rot.Blocks[x] = 0;
          rot.IslandBase[x] = 0;
        }
      } else {
        let orthoWave =
          Math.sin(x * 0.072 + phaseA) * 6.5 +
          Math.cos(x * 0.155 + phaseB) * 3.5;
        if (facetIndex === 2) {
          // Facet 2 (144 deg Pentagonal Apex): Twin-arch canyon / palindromic ridge harmony
          const symDist = Math.abs(x - PIVOT_X);
          orthoWave = Math.cos(symDist * 0.11 + phaseA) * 6.0 + Math.max(0, (24 - symDist) * 0.35);
        }
        const blended = Math.round(baseH * 0.52 + pivotH * 0.24 + (18 + orthoWave) * 0.24);
        rot.Blocks[x] = clamp(blended, 4, 46);
        if (wl < 0) {
          const ceil = 5 + Math.round((0.5 + 0.5 * Math.sin(x * 0.12 + phaseB)) * 7);
          rot.Ceiling[x] = x > 8 && x < COARSE_W - 9 ? ceil : ceil + 3;
        } else if (wl > 0) {
          rot.IslandBase[x] = Math.max(2, Math.round(rot.Blocks[x] * 0.45));
        }
      }
    }

    // Ensure at least one guaranteed difference from Facet 0 so Blocks is recognizably rotated
    if (rot.Blocks[28] === origBlocks[28]) {
      rot.Blocks[28] = clamp(origBlocks[28] + (facetIndex === 1 ? 4 : -4), 5, 42);
    }

    // 2. Project Player P onto rotated plane
    if (rot.P && facet0Snapshot.P) {
      const pZ = computeEntityDepthZ(facet0Snapshot.P, 0, 1, wx, wl);
      let newPX = projectXByAngle(facet0Snapshot.P.x, pZ, theta, 8);
      if (newPX === facet0Snapshot.P.x) {
        newPX = clampCol(newPX + (facetIndex === 1 ? 9 : -9));
      }
      rot.P.x = newPX;
      const groundH = rot.Blocks[newPX] > 0 ? rot.Blocks[newPX] : Math.max(14, seaLevel);
      rot.P.y = Math.max(groundH, seaLevel);
    }

    // 3. Project all World Entities onto the rotated X'-axis
    const we = rot.worldEntities;
    if (we) {
      if (Array.isArray(we.Towns)) {
        for (let i = 0; i < we.Towns.length; i++) {
          const t = we.Towns[i];
          const z = computeEntityDepthZ(t, i, 10, wx, wl);
          t.x = projectXByAngle(t.x, z, theta, 10);
          // Grade flat terrace under rotated town structure
          const elev = Math.max(seaLevel + 3, rot.Blocks[t.x]);
          rot.Blocks[Math.max(0, t.x - 1)] = elev;
          rot.Blocks[t.x] = elev;
          rot.Blocks[Math.min(COARSE_W - 1, t.x + 1)] = elev;
        }
      }
      if (Array.isArray(we.Caves)) {
        for (let i = 0; i < we.Caves.length; i++) {
          const c = we.Caves[i];
          const z = computeEntityDepthZ(c, i, 20, wx, wl);
          c.x = projectXByAngle(c.x, z, theta, 10);
        }
      }
      if (Array.isArray(we.TarVeins)) {
        for (let i = 0; i < we.TarVeins.length; i++) {
          const v = we.TarVeins[i];
          const z = computeEntityDepthZ(v, i, 30, wx, wl);
          v.x = projectXByAngle(v.x, z, theta, 10);
        }
      }
      if (Array.isArray(we.Crystals)) {
        for (let i = 0; i < we.Crystals.length; i++) {
          const cr = we.Crystals[i];
          const z = computeEntityDepthZ(cr, i, 40, wx, wl);
          cr.x = projectXByAngle(cr.x, z, theta, 8);
        }
      }
      if (Array.isArray(we.Relics)) {
        for (let i = 0; i < we.Relics.length; i++) {
          const rel = we.Relics[i];
          const z = computeEntityDepthZ(rel, i, 50, wx, wl);
          rel.x = projectXByAngle(rel.x, z, theta, 8);
          rel.elev = Math.max(3, (rot.Blocks[rel.x] || 14) - 3);
        }
      }
      if (Array.isArray(we.Mushrooms)) {
        for (let i = 0; i < we.Mushrooms.length; i++) {
          const m = we.Mushrooms[i];
          const z = computeEntityDepthZ(m, i, 60, wx, wl);
          m.x = projectXByAngle(m.x, z, theta, 8);
        }
      }
      if (Array.isArray(we.Dwarves)) {
        for (let i = 0; i < we.Dwarves.length; i++) {
          const d = we.Dwarves[i];
          const z = computeEntityDepthZ(d, i, 70, wx, wl);
          d.x = projectXByAngle(d.x, z, theta, 10);
          if (d.forgeX !== undefined) d.forgeX = d.x;
        }
      }
      if (Array.isArray(we.Kelp)) {
        for (let i = 0; i < we.Kelp.length; i++) {
          const k = we.Kelp[i];
          const z = computeEntityDepthZ(k, i, 80, wx, wl);
          k.x = projectXByAngle(k.x, z, theta, 6);
        }
      }
      if (Array.isArray(we.Airships)) {
        for (let i = 0; i < we.Airships.length; i++) {
          const sh = we.Airships[i];
          const z = computeEntityDepthZ(sh, i, 90, wx, wl);
          sh.x = projectXByAngle(sh.x, z, theta, 12);
        }
      }
      if (Array.isArray(we.Raptors)) {
        for (let i = 0; i < we.Raptors.length; i++) {
          const rp = we.Raptors[i];
          const z = computeEntityDepthZ(rp, i, 100, wx, wl);
          rp.x = projectXByAngle(rp.x, z, theta, 10);
          if (rp.homeX !== undefined) rp.homeX = rp.x;
        }
      }
      if (Array.isArray(we.Nests)) {
        for (let i = 0; i < we.Nests.length; i++) {
          const n = we.Nests[i];
          const z = computeEntityDepthZ(n, i, 110, wx, wl);
          n.x = projectXByAngle(n.x, z, theta, 10);
        }
      }
      if (Array.isArray(we.Castles)) {
        for (let i = 0; i < we.Castles.length; i++) {
          const cas = we.Castles[i];
          const z = computeEntityDepthZ(cas, i, 120, wx, wl);
          cas.x = projectXByAngle(cas.x, z, theta, 14);
        }
      }
      if (Array.isArray(we.Rocks)) {
        for (let i = 0; i < we.Rocks.length; i++) {
          const r = we.Rocks[i];
          const z = computeEntityDepthZ(r, i, 130, wx, wl);
          r.x = projectXByAngle(r.x, z, theta, 8);
          r.y = (rot.Blocks[Math.round(r.x)] || 15) + 4;
        }
      }

      // Reveal Hidden Pentagonal-Facet Objects that were occluded behind cliffs in Facet 0!
      const hiddenX = facetIndex === 1 ? 34 : 84;
      if (Array.isArray(we.Crystals)) {
        we.Crystals.push({
          x: hiddenX,
          onFloor: true,
          size: 5,
          charges: 3,
          phase: facetIndex * 1.5,
          hiddenInFacet0: true,
          facetOrigin: facetIndex,
          facetTag: facetIndex === 1 ? "PENTAGONAL_GEODE_72" : "PENTAGONAL_APEX_GEODE_144",
        });
      }
      if (Array.isArray(we.Caves) && we.Caves.length < 5) {
        const caveX = facetIndex === 1 ? 82 : 38;
        we.Caves.push({
          x: caveX,
          depth: 4,
          glow: 12,
          fed: false,
          hiddenInFacet0: true,
          facetOrigin: facetIndex,
          facetTag: facetIndex === 1 ? "HIDDEN_CAVE_72" : "APEX_SANCTUARY_CAVE_144",
        });
      }
    }

    // 4. Project Ecological Entities onto the rotated X'-axis
    const ee = rot.ecoEntities;
    if (ee) {
      if (Array.isArray(ee.ComputeVats)) {
        for (let i = 0; i < ee.ComputeVats.length; i++) {
          const vat = ee.ComputeVats[i];
          const z = computeEntityDepthZ(vat, i, 200, wx, wl);
          vat.x = projectXByAngle(vat.x, z, theta, 10);
          vat.inPortX = vat.x - 2;
          vat.outPortX = vat.x + 2;
          const elev = Math.max(seaLevel + 3, rot.Blocks[vat.x]);
          for (let dx = -2; dx <= 2; dx++) {
            rot.Blocks[clampCol(vat.x + dx)] = elev;
          }
        }
      }
      const ecoLists = [
        ["Ferns", 210],
        ["Critters", 220],
        ["OrangePeople", 230],
        ["Children", 240],
        ["Automata", 250],
        ["SeerCrows", 260],
        ["Skeksis", 270],
        ["GooNodes", 280],
      ];
      for (let k = 0; k < ecoLists.length; k++) {
        const key = ecoLists[k][0];
        const code = ecoLists[k][1];
        const arr = ee[key];
        if (Array.isArray(arr)) {
          for (let i = 0; i < arr.length; i++) {
            const item = arr[i];
            const z = computeEntityDepthZ(item, i, code, wx, wl);
            item.x = projectXByAngle(item.x, z, theta, 6);
            if (item.homeX !== undefined) item.homeX = item.x;
          }
        }
      }
    }

    // 5. Project Cosmic Entities onto the rotated X'-axis
    const ce = rot.cosmicEntities;
    if (ce) {
      const cosmicLists = [
        ["WfcZones", 310],
        ["RecursiveObjects", 320],
        ["Labs", 330],
        ["Scientists", 340],
        ["BuildSites", 350],
        ["Workers", 360],
        ["EvolvedFlora", 370],
        ["Crafts", 380],
        ["TimeCrystals", 390],
        ["Transdimensionals", 400],
      ];
      for (let k = 0; k < cosmicLists.length; k++) {
        const key = cosmicLists[k][0];
        const code = cosmicLists[k][1];
        const arr = ce[key];
        if (Array.isArray(arr)) {
          for (let i = 0; i < arr.length; i++) {
            const item = arr[i];
            const z = computeEntityDepthZ(item, i, code, wx, wl);
            item.x = projectXByAngle(item.x, z, theta, 8);
            if (item.homeX !== undefined) item.homeX = item.x;
          }
        }
      }
      if (Array.isArray(ce.Conduits)) {
        for (let i = 0; i < ce.Conduits.length; i++) {
          const cond = ce.Conduits[i];
          const z1 = computeEntityDepthZ({ x: cond.fromX || 40 }, i, 410, wx, wl);
          const z2 = computeEntityDepthZ({ x: cond.toX || 70 }, i + 1, 411, wx, wl);
          if (cond.fromX !== undefined) cond.fromX = projectXByAngle(cond.fromX, z1, theta, 6);
          if (cond.toX !== undefined) cond.toX = projectXByAngle(cond.toX, z2, theta, 6);
        }
      }
    }

    // 6. Project TabForms onto the rotated X'-axis
    if (Array.isArray(rot.tabForms)) {
      for (let i = 0; i < rot.tabForms.length; i++) {
        const tf = rot.tabForms[i];
        const z = computeEntityDepthZ(tf, i, 500, wx, wl);
        tf.x = projectXByAngle(tf.x, z, theta, 6);
      }
    }

    return rot;
  }

  // Fast structural signature to detect whether live gameplay modified the current facet
  function computeLiveSignature(worldBundle, ecoOrSys) {
    if (!worldBundle || !Array.isArray(worldBundle.Blocks)) return "";
    const b = worldBundle.Blocks;
    let h1 = 0;
    let h2 = 0;
    for (let i = 0; i < COARSE_W; i++) {
      h1 = (h1 + (b[i] | 0) * (i + 1)) | 0;
      h2 = (h2 ^ ((b[i] | 0) << (i & 15))) | 0;
    }
    const px = worldBundle.P ? Math.round(worldBundle.P.x) : 0;
    const tLen = Array.isArray(worldBundle.Towns) ? worldBundle.Towns.length : 0;
    const cLen = Array.isArray(worldBundle.Caves) ? worldBundle.Caves.length : 0;
    const vLen = Array.isArray(worldBundle.TarVeins) ? worldBundle.TarVeins.length : 0;
    const eco = unwrapEco(ecoOrSys);
    const vatLen = eco && Array.isArray(eco.ComputeVats) ? eco.ComputeVats.length : 0;
    return `${h1}:${h2}:${px}:${tLen}:${cLen}:${vLen}:${vatLen}`;
  }

  // ==========================================================================
  // CREATE 5-FOLD PENTAGONAL ROTATION SYSTEM INSTANCE
  // ==========================================================================
  function createRotationSystem() {
    // Per-(worldX, worldLayer) 5-facet manifold cache
    const worldManifolds = new Map();

    let lastWorldRef = null;
    let lastEcoRef = null;
    let lastCosmicRef = null;
    let lastTabFormsRef = null;

    const state = {
      rotFacet: 0,               // Active facet in {0, 1, 2, 3, 4}
      fromFacet: 0,              // Outgoing facet during rotation animation
      toFacet: 0,                // Incoming facet during rotation animation
      rotSteps: 0,               // Signed step count of active/last rotation
      isAnimating: false,        // True while 24-frame 3D animation is running
      rotFrame: 0,               // Current animation frame 0..24
      rotTotalFrames: ROTATION_FRAMES,
      rotProgress: 1.0,          // Normalized animation progress 0.0..1.0
      totalRotations: 0,         // Cumulative rotation steps taken
      worldKey: "0,0",
      arrivalSignature: "",      // Signature of active facet upon settling
      fromScene: null,           // Outgoing 2D scene snapshot for 3D cross-blend
      toScene: null,             // Incoming 2D scene snapshot for 3D cross-blend
      facets: [null, null, null, null, null],
      steppedThisTick: false,
    };

    function getWorldKey(wb) {
      const wx = wb && wb.worldX !== undefined ? wb.worldX : 0;
      const wl = wb && wb.worldLayer !== undefined ? wb.worldLayer : 0;
      return `${wx},${wl}`;
    }

    function getFacetLabel(facetIdx) {
      const f = (((facetIdx | 0) % NUM_FACETS) + NUM_FACETS) % NUM_FACETS;
      if (f === 0) return "ROT 0/5 • 0° [ORIGIN]";
      if (f === 1) return "ROT 1/5 • 72° [ORTHO]";
      if (f === 2) return "ROT 2/5 • 144° [APEX]";
      if (f === 3) return "ROT 3/5 • 216° [REV]";
      return "ROT 4/5 • 288° [REV]";
    }

    function rebuildAllFacetsFromFacet0(facet0Snap) {
      const f0 = deepCloneValue(facet0Snap, 0);
      const f1 = buildOrthogonalFacet(f0, 1);
      const f2 = buildOrthogonalFacet(f0, 2);
      const f3 = mirrorScene(f0);
      const f4 = mirrorScene(f1);
      return [f0, f1, f2, f3, f4];
    }

    function ensureManifold(wb, eco, cosmic, tabForms) {
      const key = getWorldKey(wb);
      if (!worldManifolds.has(key)) {
        const initialSnap = captureSceneSnapshot(wb, eco, cosmic, tabForms);
        const facets = rebuildAllFacetsFromFacet0(initialSnap);
        worldManifolds.set(key, {
          worldKey: key,
          rotFacet: 0,
          facets,
        });
        state.worldKey = key;
        state.rotFacet = 0;
        state.facets = facets;
        state.arrivalSignature = computeLiveSignature(wb, eco);
      } else if (state.worldKey !== key) {
        const entry = worldManifolds.get(key);
        state.worldKey = key;
        state.rotFacet = entry.rotFacet || 0;
        state.facets = entry.facets;
        state.arrivalSignature = computeLiveSignature(wb, eco);
      }
      return worldManifolds.get(key);
    }

    // Bidirectional live sync between chiral mirror pairs:
    //   Facet 0 <-> Facet 3 (3 rotations from 0)
    //   Facet 1 <-> Facet 4 (3 rotations from 1)
    function syncMirrorPair(wb, eco, cosmic, tabForms, forceSync) {
      const wRef = wb || lastWorldRef;
      const eRef = eco || lastEcoRef;
      const cRef = cosmic || lastCosmicRef;
      const tRef = tabForms || lastTabFormsRef;
      if (!wRef) return;

      const manifold = ensureManifold(wRef, eRef, cRef, tRef);
      const currentSig = computeLiveSignature(wRef, eRef);
      const wasModified = forceSync || (state.arrivalSignature && currentSig !== state.arrivalSignature);

      // Always capture fresh edits on Facet 0 or modified active facets
      if (state.rotFacet === 0 && (wasModified || !manifold.facets[0])) {
        const snap0 = captureSceneSnapshot(wRef, eRef, cRef, tRef);
        manifold.facets[0] = snap0;
        manifold.facets[3] = mirrorScene(snap0);
        manifold.facets[1] = buildOrthogonalFacet(snap0, 1);
        manifold.facets[4] = mirrorScene(manifold.facets[1]);
        manifold.facets[2] = buildOrthogonalFacet(snap0, 2);
        state.arrivalSignature = currentSig;
      } else if (state.rotFacet === 3 && wasModified) {
        const snap3 = captureSceneSnapshot(wRef, eRef, cRef, tRef);
        manifold.facets[3] = snap3;
        manifold.facets[0] = mirrorScene(snap3);
        state.arrivalSignature = currentSig;
      } else if (state.rotFacet === 1 && wasModified) {
        const snap1 = captureSceneSnapshot(wRef, eRef, cRef, tRef);
        manifold.facets[1] = snap1;
        manifold.facets[4] = mirrorScene(snap1);
        state.arrivalSignature = currentSig;
      } else if (state.rotFacet === 4 && wasModified) {
        const snap4 = captureSceneSnapshot(wRef, eRef, cRef, tRef);
        manifold.facets[4] = snap4;
        manifold.facets[1] = mirrorScene(snap4);
        state.arrivalSignature = currentSig;
      } else if (state.rotFacet === 2 && wasModified) {
        manifold.facets[2] = captureSceneSnapshot(wRef, eRef, cRef, tRef);
        state.arrivalSignature = currentSig;
      }
      state.facets = manifold.facets;
    }

    // Normalize flexible arguments: supports either
    //   startRotation(dirOrSteps, worldBundle, eco, cosmic, tabForms)
    // or
    //   startRotation(worldBundle, dirOrSteps, eco, cosmic, tabForms)
    function parseRotationArgs(a0, a1, a2, a3, a4) {
      let steps = 1;
      let wb = lastWorldRef;
      let eco = lastEcoRef;
      let cosmic = lastCosmicRef;
      let tabForms = lastTabFormsRef;

      if (typeof a0 === "number" || typeof a0 === "string" || a0 === undefined) {
        if (typeof a0 === "number" && Number.isFinite(a0)) {
          steps = Math.round(a0);
        } else if (a0 === "left" || a0 === "ccw" || a0 === "prev") {
          steps = -1;
        } else if (a0 === "reverse" || a0 === "mirror" || a0 === "flip") {
          steps = 3;
        } else if (typeof a0 === "string" && !Number.isNaN( parseInt(a0, 10) )) {
          steps = parseInt(a0, 10);
        }
        if (a1 && typeof a1 === "object") wb = a1;
        if (a2 !== undefined) eco = a2;
        if (a3 !== undefined) cosmic = a3;
        if (a4 !== undefined) tabForms = a4;
      } else if (a0 && typeof a0 === "object") {
        wb = a0;
        if (typeof a1 === "number" && Number.isFinite(a1)) {
          steps = Math.round(a1);
        }
        if (a2 !== undefined) eco = a2;
        if (a3 !== undefined) cosmic = a3;
        if (a4 !== undefined) tabForms = a4;
      }

      if (wb) lastWorldRef = wb;
      if (eco) lastEcoRef = eco;
      if (cosmic) lastCosmicRef = cosmic;
      if (tabForms) lastTabFormsRef = tabForms;

      return { steps, wb, eco, cosmic, tabForms };
    }

    // ========================================================================
    // START 5-FOLD ROTATION & APPLY TARGET FACET SCENE
    // ========================================================================
    function startRotation(a0, a1, a2, a3, a4) {
      const { steps, wb, eco, cosmic, tabForms } = parseRotationArgs(a0, a1, a2, a3, a4);
      if (!wb) {
        return getStatus();
      }

      const manifold = ensureManifold(wb, eco, cosmic, tabForms);

      // Sync any live edits made on the current facet before rotating away
      syncMirrorPair(wb, eco, cosmic, tabForms, false);

      const fromFacet = state.rotFacet;
      const toFacet = (((fromFacet + steps) % NUM_FACETS) + NUM_FACETS) % NUM_FACETS;

      const fromScene = manifold.facets[fromFacet]
        ? deepCloneValue(manifold.facets[fromFacet], 0)
        : captureSceneSnapshot(wb, eco, cosmic, tabForms);
      const toScene = deepCloneValue(manifold.facets[toFacet], 0);

      // Apply the target 2D facet to worldBundle, eco, cosmic, and tabForms
      applySceneSnapshot(toScene, wb, eco, cosmic, tabForms);

      manifold.rotFacet = toFacet;
      state.fromFacet = fromFacet;
      state.toFacet = toFacet;
      state.rotFacet = toFacet;
      state.rotSteps = steps;
      state.totalRotations += steps;
      state.fromScene = fromScene;
      state.toScene = toScene;
      state.isAnimating = true;
      state.rotFrame = 0;
      state.rotProgress = 0.0;
      state.steppedThisTick = false;
      state.arrivalSignature = computeLiveSignature(wb, eco);

      if (typeof wb.announceSky === "function") {
        const deg = toFacet * FACET_ANGLE_DEG;
        const tag = toFacet === 3 || toFacet === 4 ? "MIRROR WORLD" : toFacet === 0 ? "ORIGIN WORLD" : "ORTHO WORLD";
        wb.announceSky(`FACET ${toFacet + 1}/5 (${deg} DEG)`, tag, 110);
      }

      return getStatus();
    }

    function stepRotation(frames, wb, eco, cosmic, tabForms) {
      const n = Math.max(1, Math.floor(Number.isFinite(frames) ? frames : 1));
      if (wb) lastWorldRef = wb;
      if (eco) lastEcoRef = eco;
      if (cosmic) lastCosmicRef = cosmic;
      if (tabForms) lastTabFormsRef = tabForms;

      if (state.isAnimating) {
        state.rotFrame = Math.min(ROTATION_FRAMES, state.rotFrame + n);
        state.rotProgress = clamp(state.rotFrame / ROTATION_FRAMES, 0, 1);
        state.steppedThisTick = true;
        if (state.rotFrame >= ROTATION_FRAMES) {
          state.rotProgress = 1.0;
          state.isAnimating = false;
        }
      } else if (lastWorldRef) {
        syncMirrorPair(lastWorldRef, lastEcoRef, lastCosmicRef, lastTabFormsRef, false);
      }
      return getStatus();
    }

    function settleRotation(wb, eco, cosmic, tabForms) {
      if (wb) lastWorldRef = wb;
      if (eco) lastEcoRef = eco;
      if (cosmic) lastCosmicRef = cosmic;
      if (tabForms) lastTabFormsRef = tabForms;
      state.rotFrame = ROTATION_FRAMES;
      state.rotProgress = 1.0;
      state.isAnimating = false;
      return getStatus();
    }

    function resetForNewWorld(wb, eco, cosmic, tabForms) {
      if (wb) lastWorldRef = wb;
      if (eco) lastEcoRef = eco;
      if (cosmic) lastCosmicRef = cosmic;
      if (tabForms) lastTabFormsRef = tabForms;
      if (!lastWorldRef) return getStatus();

      const key = getWorldKey(lastWorldRef);
      const snap0 = captureSceneSnapshot(lastWorldRef, lastEcoRef, lastCosmicRef, lastTabFormsRef);
      const facets = rebuildAllFacetsFromFacet0(snap0);
      worldManifolds.set(key, {
        worldKey: key,
        rotFacet: 0,
        facets,
      });
      state.worldKey = key;
      state.rotFacet = 0;
      state.fromFacet = 0;
      state.toFacet = 0;
      state.isAnimating = false;
      state.rotFrame = ROTATION_FRAMES;
      state.rotProgress = 1.0;
      state.facets = facets;
      state.arrivalSignature = computeLiveSignature(lastWorldRef, lastEcoRef);
      return getStatus();
    }

    // ========================================================================
    // 7x7 SUB-PIXEL BITMAP TEXT & PENTAGONAL COMPASS HUD RENDERER
    // ========================================================================
    function drawNativeGlyphString(primeRenderer, px0, py0, text, r, g, b, a) {
      if (!primeRenderer || typeof primeRenderer.fillNativeRect !== "function") return;
      const str = String(text || "").toUpperCase();
      let curX = Math.round(px0);
      const baseY = Math.round(py0);
      const rc = clampByte(r);
      const gc = clampByte(g);
      const bc = clampByte(b);
      const ac = clamp(a !== undefined ? a : 1, 0, 1);

      for (let i = 0; i < str.length; i++) {
        const ch = str[i];
        const rows = MINI_GLYPHS[ch] || MINI_GLYPHS[" "];
        for (let ry = 0; ry < 5; ry++) {
          const mask = rows[ry];
          if (mask & 0b100) primeRenderer.fillNativeRect(curX, baseY + ry * 2, 2, 2, rc, gc, bc, ac);
          if (mask & 0b010) primeRenderer.fillNativeRect(curX + 2, baseY + ry * 2, 2, 2, rc, gc, bc, ac);
          if (mask & 0b001) primeRenderer.fillNativeRect(curX + 4, baseY + ry * 2, 2, 2, rc, gc, bc, ac);
        }
        curX += 8;
      }
    }

    function renderCompassOverlay(primeRenderer, progressOverride) {
      if (!primeRenderer || typeof primeRenderer.fillNativeRect !== "function") return;
      // In the browser, the 1:1 device-pixel hairline terminal info bar on `#hardcore-tab-overlay`
      // renders `ROT:0/5 000° ORIGIN` with a clear background. Skip the bold low-res compass box!
      if (typeof document !== "undefined" && document.getElementById("hardcore-tab-overlay")) {
        if (state.isAnimating || (progressOverride !== undefined && progressOverride < 1)) {
          const p = clamp(progressOverride !== undefined ? progressOverride : state.rotProgress, 0, 1);
          primeRenderer.fillNativeRect(0, 0, Math.round(NATIVE_W * p), 1, 120, 234, 212, 0.9);
        }
        return;
      }

      const label = getFacetLabel(state.rotFacet);
      const textW = label.length * 8;
      const boxW = textW + 44;
      const boxH = 22;
      const boxX = Math.floor((NATIVE_W - boxW) / 2);
      const boxY = 6;

      // Translucent obsidian-teal HUD backing plate & border
      primeRenderer.fillNativeRect(boxX, boxY, boxW, boxH, 14, 34, 42, 0.86);
      primeRenderer.fillNativeRect(boxX, boxY, boxW, 1, 95, 240, 235, 0.92);
      primeRenderer.fillNativeRect(boxX, boxY + boxH - 1, boxW, 1, 95, 240, 235, 0.92);

      // 5-Fold Pentagonal Compass Rose on the left side of the banner
      const cx = boxX + 16;
      const cy = boxY + 11;
      const rad = 7;
      const verts = [];
      for (let v = 0; v < NUM_FACETS; v++) {
        const ang = -Math.PI / 2 + v * FACET_ANGLE_RAD;
        verts.push({
          x: Math.round(cx + Math.cos(ang) * rad),
          y: Math.round(cy + Math.sin(ang) * rad),
        });
      }
      if (typeof primeRenderer.nativeLine7 === "function") {
        for (let v = 0; v < NUM_FACETS; v++) {
          const v0 = verts[v];
          const v1 = verts[(v + 1) % NUM_FACETS];
          primeRenderer.nativeLine7(v0.x, v0.y, v1.x, v1.y, 85, 215, 220, 0.85, 1);
        }
      }
      for (let v = 0; v < NUM_FACETS; v++) {
        const isCurrent = v === state.rotFacet;
        const isMirror = v === 3 || v === 4;
        const vr = isCurrent ? 255 : isMirror ? 255 : 110;
        const vg = isCurrent ? 245 : isMirror ? 140 : 230;
        const vb = isCurrent ? 115 : isMirror ? 215 : 220;
        const sz = isCurrent ? 3 : 2;
        primeRenderer.fillNativeRect(verts[v].x - 1, verts[v].y - 1, sz, sz, vr, vg, vb, 1);
      }

      // Draw crisp 7x7 native glyph label
      const isRev = state.rotFacet === 3 || state.rotFacet === 4;
      const tr = isRev ? 255 : 175;
      const tg = isRev ? 215 : 255;
      const tb = isRev ? 140 : 240;
      drawNativeGlyphString(primeRenderer, boxX + 32, boxY + 6, label, tr, tg, tb, 0.98);

      // Subtle progress bar along the bottom edge during active 24-frame rotation
      if (state.isAnimating || (progressOverride !== undefined && progressOverride < 1)) {
        const p = clamp(progressOverride !== undefined ? progressOverride : state.rotProgress, 0, 1);
        const fillW = Math.round((boxW - 4) * p);
        primeRenderer.fillNativeRect(boxX + 2, boxY + boxH - 3, fillW, 2, 255, 230, 110, 0.95);
      }
    }

    // ========================================================================
    // LIVE 24-FRAME 3D PENTAGONAL PERSPECTIVE ROTATION ANIMATION
    // ========================================================================
    function collectScene3DPrimitives(scene, thetaRad, sceneAlpha, isIncoming) {
      const columns = [];
      const objects = [];
      if (!scene || sceneAlpha <= 0.01) {
        return { columns, objects };
      }

      const cosT = Math.cos(thetaRad);
      const sinT = Math.sin(thetaRad);
      const blocks = scene.Blocks || [];
      const ceiling = scene.Ceiling || [];
      const islandBase = scene.IslandBase || [];
      const seaLevel = scene.seaLevel || 12;
      const wl = scene.worldLayer || 0;
      const wx = scene.worldX || 0;

      // When riding the Airship Castle-Village, pivot the 5-fold 3D rotation around the Airship!
      const tfState = global.SlopesTabForms && global.SlopesTabForms.state;
      const as = tfState && tfState.airshipVillage;
      const ridingAirship = Boolean(as && as.riding);
      const pivX = ridingAirship ? clamp(as.x, 14, COARSE_W - 15) : PIVOT_X;
      const pivY = ridingAirship ? clamp(COARSE_H - (as.y || 50), 12, COARSE_H - 12) : PIVOT_Y;

      // 1. Rotate all 120 terrain columns around active pivot (pivX, z_c = 0)
      for (let x = 0; x < COARSE_W; x++) {
        const h = clamp(blocks[x] || 0, 0, COARSE_H - 2);
        const z_x = Math.sin((x / 119) * Math.PI) * 14 + (h - 20) * 0.45;
        const dx = x - pivX;
        const xPrime = pivX + dx * cosT - z_x * sinT;
        const zPrime = dx * sinT + z_x * cosT;
        const perspScale = 1 / (1 + clamp(zPrime, -120, 120) * 0.004);

        columns.push({
          origX: x,
          xPrime,
          zPrime,
          scale: perspScale,
          h,
          ceil: clamp(ceiling[x] || 0, 0, 30),
          islandBase: clamp(islandBase[x] || 0, 0, COARSE_H - 2),
          seaLevel,
          wl,
          alpha: sceneAlpha,
          isIncoming,
          pivY,
        });
      }

      // Helper to push a 3D-projected object
      function pushObj(kind, x0, yElev, z0, color, sizeCoarse, extra) {
        if (!Number.isFinite(x0) || !Number.isFinite(yElev)) return;
        const dx = x0 - pivX;
        const xPrime = pivX + dx * cosT - z0 * sinT;
        const zPrime = dx * sinT + z0 * cosT;
        const scale = 1 / (1 + clamp(zPrime, -120, 120) * 0.004);
        const screenY = COARSE_H - yElev;
        const yPrime = pivY + (screenY - pivY) * scale;

        objects.push({
          kind,
          xPrime,
          yPrime,
          zPrime,
          scale,
          color,
          sizeCoarse: sizeCoarse || 2,
          alpha: sceneAlpha,
          extra: extra || null,
        });
      }

      const we = scene.worldEntities || {};

      // Towns (Cottages, Lighthouses, Harps, Beacons)
      if (Array.isArray(we.Towns)) {
        for (let i = 0; i < we.Towns.length; i++) {
          const t = we.Towns[i];
          const tx = clampCol(t.x);
          const elev = (blocks[tx] || 15) + 2;
          const z0 = computeEntityDepthZ(t, i, 10, wx, wl);
          pushObj("town", tx, elev, z0, [255, 215, 110], 3, t);
        }
      }

      // Spooky Caves
      if (Array.isArray(we.Caves)) {
        for (let i = 0; i < we.Caves.length; i++) {
          const c = we.Caves[i];
          const cx = clampCol(c.x);
          const elev = Math.max(4, (blocks[cx] || 15) - (c.depth || 3));
          const z0 = computeEntityDepthZ(c, i, 20, wx, wl);
          pushObj("cave", cx, elev, z0, [250, 195, 95], 3, c);
        }
      }

      // Aetherium Crystals
      if (Array.isArray(we.Crystals)) {
        for (let i = 0; i < we.Crystals.length; i++) {
          const cr = we.Crystals[i];
          const cx = clampCol(cr.x);
          const elev = (blocks[cx] || 15) + 2;
          const z0 = computeEntityDepthZ(cr, i, 40, wx, wl);
          pushObj("crystal", cx, elev, z0, [95, 245, 255], 2, cr);
        }
      }

      // Floating Airships & Castles
      if (Array.isArray(we.Airships)) {
        for (let i = 0; i < we.Airships.length; i++) {
          const sh = we.Airships[i];
          const z0 = computeEntityDepthZ(sh, i, 90, wx, wl);
          const col = sh.type === "friendly" ? [140, 245, 210] : [235, 105, 85];
          pushObj("airship", sh.x, sh.y || 36, z0, col, 5, sh);
        }
      }
      if (Array.isArray(we.Castles)) {
        for (let i = 0; i < we.Castles.length; i++) {
          const cas = we.Castles[i];
          const cx = clampCol(cas.x);
          const elev = (blocks[cx] || 28) + 5;
          const z0 = computeEntityDepthZ(cas, i, 120, wx, wl);
          pushObj("castle", cx, elev, z0, [120, 240, 255], 6, cas);
        }
      }

      // Ecological Entities (Compute Vats, Orange Villagers, Seer Crows, Skeksis)
      const ee = scene.ecoEntities || {};
      if (Array.isArray(ee.ComputeVats)) {
        for (let i = 0; i < ee.ComputeVats.length; i++) {
          const vat = ee.ComputeVats[i];
          const vx = clampCol(vat.x);
          const elev = (blocks[vx] || 15) + 2;
          const z0 = computeEntityDepthZ(vat, i, 200, wx, wl);
          pushObj("vat", vx, elev, z0, [85, 255, 205], 3, vat);
        }
      }
      if (Array.isArray(ee.OrangePeople)) {
        for (let i = 0; i < ee.OrangePeople.length; i++) {
          const op = ee.OrangePeople[i];
          const ox = clampCol(op.x);
          const elev = (blocks[ox] || 15) + 1;
          const z0 = computeEntityDepthZ(op, i, 230, wx, wl);
          pushObj("villager", op.x, elev, z0, [255, 155, 55], 1, op);
        }
      }
      if (Array.isArray(ee.SeerCrows)) {
        for (let i = 0; i < ee.SeerCrows.length; i++) {
          const cr = ee.SeerCrows[i];
          const z0 = computeEntityDepthZ(cr, i, 260, wx, wl);
          pushObj("crow", cr.x, cr.y || 28, z0, [145, 235, 255], 1, cr);
        }
      }

      // Cosmic Entities (Labs, Crafts, Time Crystals)
      const ce = scene.cosmicEntities || {};
      if (Array.isArray(ce.TimeCrystals)) {
        for (let i = 0; i < ce.TimeCrystals.length; i++) {
          const tc = ce.TimeCrystals[i];
          const tx = clampCol(tc.x);
          const elev = (blocks[tx] || 15) + 3;
          const z0 = computeEntityDepthZ(tc, i, 390, wx, wl);
          pushObj("timeCrystal", tx, elev, z0, [255, 230, 120], 2, tc);
        }
      }

      // Tab-Forms
      if (Array.isArray(scene.tabForms)) {
        for (let i = 0; i < scene.tabForms.length; i++) {
          const tf = scene.tabForms[i];
          const tx = clampCol(tf.x);
          const elev = tf.y !== undefined ? tf.y : (blocks[tx] || 15) + 2;
          const z0 = computeEntityDepthZ(tf, i, 500, wx, wl);
          pushObj("tabForm", tx, elev, z0, [185, 255, 165], 2, tf);
        }
      }

      // Airship Castle-Village (if present in sector)
      if (as && (ridingAirship || as.roomX === wx)) {
        const zAs = ridingAirship ? 0 : 18;
        pushObj("airshipCastle", as.x || 60, as.y || 50, zAs, [140, 235, 225], 8, as);
      }

      // Player Monolith (TACHIMA-307)
      if (scene.P) {
        const px = ridingAirship ? clampCol(Math.round(as.x)) : clampCol(scene.P.x);
        const py = ridingAirship
          ? (as.y || 50) - 1.5 - (as.playerRopeDrop || 0)
          : Number.isFinite(scene.P.y)
          ? scene.P.y
          : blocks[px] || 18;
        const zP = ridingAirship ? 0 : computeEntityDepthZ(scene.P, 0, 1, wx, wl);
        pushObj("player", px, py + 3, zP, [110, 250, 255], 2, scene.P);
      }

      return { columns, objects };
    }

    function renderRotationAnimation(primeRenderer, wb, eco, cosmic, tabForms, explicitProgress) {
      if (!primeRenderer || typeof primeRenderer.fillNativeRect !== "function") {
        return false;
      }
      if (wb) lastWorldRef = wb;
      if (eco) lastEcoRef = eco;
      if (cosmic) lastCosmicRef = cosmic;
      if (tabForms) lastTabFormsRef = tabForms;

      // Auto-advance frame if caller invokes renderRotationAnimation directly in a 24-frame loop
      if (explicitProgress === undefined && state.isAnimating && !state.steppedThisTick) {
        state.rotFrame = Math.min(ROTATION_FRAMES, state.rotFrame + 1);
        state.rotProgress = clamp(state.rotFrame / ROTATION_FRAMES, 0, 1);
        if (state.rotFrame >= ROTATION_FRAMES) {
          state.isAnimating = false;
        }
      }
      state.steppedThisTick = false;

      const rawP = explicitProgress !== undefined ? explicitProgress : state.rotProgress;
      const p = clamp(rawP, 0, 1);
      // Smooth cosine ease-in-out
      const tau = 0.5 - 0.5 * Math.cos(Math.PI * p);

      const fromSnap =
        state.fromScene ||
        (lastWorldRef ? captureSceneSnapshot(lastWorldRef, lastEcoRef, lastCosmicRef, lastTabFormsRef) : null);
      const toSnap =
        state.toScene ||
        (lastWorldRef ? captureSceneSnapshot(lastWorldRef, lastEcoRef, lastCosmicRef, lastTabFormsRef) : fromSnap);

      // Clear native 840x525 framebuffer
      if (typeof primeRenderer.clearScreen === "function") {
        primeRenderer.clearScreen();
      }

      const steps = state.rotSteps || 1;
      const dirSign = steps >= 0 ? 1 : -1;
      // Sweep angle through the pentagonal facet step (72 deg per facet, scaled for smooth visual spin)
      const sweepRad = dirSign * FACET_ANGLE_RAD * Math.min(2, Math.max(1, Math.abs(steps)));
      const thetaFrom = tau * sweepRad;
      const thetaTo = (tau - 1) * sweepRad;

      const outPrims = collectScene3DPrimitives(fromSnap, thetaFrom, 1 - tau, false);
      const inPrims = collectScene3DPrimitives(toSnap, thetaTo, tau, true);

      // Merge & depth-sort all 3D terrain columns (back-to-front: largest zPrime first)
      const allCols = outPrims.columns.concat(inPrims.columns);
      allCols.sort((a, b) => b.zPrime - a.zPrime);

      const tfState = global.SlopesTabForms && global.SlopesTabForms.state;
      const as = tfState && tfState.airshipVillage;
      const ridingAirship = Boolean(as && as.riding);
      const activePivX = ridingAirship ? clamp(as.x, 14, COARSE_W - 15) : PIVOT_X;

      // Draw subtle 3D rotating Pentagonal Horizon Ring behind terrain
      if (typeof primeRenderer.nativeLine7 === "function") {
        const ringCx = Math.round(activePivX * SCALE);
        const ringCy = Math.round(24 * SCALE);
        const rx = 240;
        const ry = 36;
        for (let v = 0; v < NUM_FACETS; v++) {
          const a0 = v * FACET_ANGLE_RAD + thetaFrom;
          const a1 = ((v + 1) % NUM_FACETS) * FACET_ANGLE_RAD + thetaFrom;
          const x0 = clamp(Math.round(ringCx + Math.cos(a0) * rx), 0, NATIVE_W - 1);
          const y0 = clamp(Math.round(ringCy + Math.sin(a0) * ry), 0, NATIVE_H - 1);
          const x1 = clamp(Math.round(ringCx + Math.cos(a1) * rx), 0, NATIVE_W - 1);
          const y1 = clamp(Math.round(ringCy + Math.sin(a1) * ry), 0, NATIVE_H - 1);
          primeRenderer.nativeLine7(x0, y0, x1, y1, 95, 220, 230, 0.32, 2);
        }
      }

      // Render 3D perspective-scaled terrain columns
      for (let i = 0; i < allCols.length; i++) {
        const col = allCols[i];
        if (col.alpha <= 0.02) continue;

        const cPivY = col.pivY !== undefined ? col.pivY : PIVOT_Y;
        const px = Math.round(col.xPrime * SCALE);
        const pw = Math.max(4, Math.round(SCALE * col.scale) + 1);
        if (px + pw < 0 || px >= NATIVE_W) continue;

        // Depth-cue brightness factor based on zPrime
        const depthShade = clamp(1 - col.zPrime * 0.005, 0.55, 1.25);

        // Sea / Magma column in background
        if (col.seaLevel > 0 && col.h < col.seaLevel) {
          const seaTopCoarse = cPivY + (COARSE_H - col.seaLevel - cPivY) * col.scale;
          const seaBotCoarse = cPivY + (COARSE_H - cPivY) * col.scale;
          const sy0 = clamp(Math.round(seaTopCoarse * SCALE), 0, NATIVE_H - 1);
          const sy1 = clamp(Math.round(seaBotCoarse * SCALE), 0, NATIVE_H);
          if (sy1 > sy0) {
            primeRenderer.fillNativeRect(
              px,
              sy0,
              pw,
              sy1 - sy0,
              clampByte(42 * depthShade),
              clampByte(135 * depthShade),
              clampByte(168 * depthShade),
              clamp(col.alpha * 0.55, 0.05, 0.95)
            );
          }
        }

        // Solid terrain column
        if (col.h > 0) {
          const topCoarse = cPivY + (COARSE_H - col.h - cPivY) * col.scale;
          const botCoarse =
            col.wl > 0 && col.islandBase > 0
              ? cPivY + (COARSE_H - col.islandBase - cPivY) * col.scale
              : cPivY + (COARSE_H - cPivY) * col.scale;
          const py0 = clamp(Math.round(topCoarse * SCALE), 0, NATIVE_H - 1);
          const py1 = clamp(Math.round(botCoarse * SCALE), 0, NATIVE_H);
          if (py1 > py0) {
            const tr = clampByte((col.isIncoming ? 34 : 28) * depthShade);
            const tg = clampByte((col.isIncoming ? 88 : 74) * depthShade);
            const tb = clampByte((col.isIncoming ? 84 : 78) * depthShade);
            primeRenderer.fillNativeRect(
              px,
              py0,
              pw,
              py1 - py0,
              tr,
              tg,
              tb,
              clamp(col.alpha * 0.88, 0.05, 1)
            );
            // Illuminated ridge crest cap (2 native pixels tall)
            primeRenderer.fillNativeRect(
              px,
              py0,
              pw,
              Math.min(3, py1 - py0),
              clampByte(88 * depthShade),
              clampByte(210 * depthShade),
              clampByte(195 * depthShade),
              clamp(col.alpha * 0.92, 0.05, 1)
            );
          }
        }
      }

      // Merge & depth-sort all 3D scene objects (back-to-front)
      const allObjs = outPrims.objects.concat(inPrims.objects);
      allObjs.sort((a, b) => b.zPrime - a.zPrime);

      for (let i = 0; i < allObjs.length; i++) {
        const obj = allObjs[i];
        if (obj.alpha <= 0.02) continue;

        const px = Math.round(obj.xPrime * SCALE);
        const py = Math.round(obj.yPrime * SCALE);
        const unit = Math.max(2, Math.round(SCALE * obj.scale));
        const c = obj.color || [220, 245, 240];
        const a = clamp(obj.alpha * 0.95, 0.05, 1);

        if (obj.kind === "airshipCastle") {
          // 3D perspective silhouette of the Airship Castle-Village envelope, hull & citadel keep
          const envW = Math.max(24, unit * 18);
          const envH = Math.max(10, unit * 5);
          const hullW = Math.max(18, unit * 14);
          const hullH = Math.max(6, unit * 3);
          primeRenderer.fillNativeRect(px - Math.floor(envW / 2), py - envH - hullH - unit * 2, envW, envH, 36, 98, 108, a * 0.9);
          primeRenderer.fillNativeRect(px - Math.floor(hullW / 2), py - hullH, hullW, hullH, 48, 86, 82, a);
          primeRenderer.fillNativeRect(px - unit * 3, py - hullH - unit * 3, unit * 6, unit * 3, 64, 128, 122, a);
          primeRenderer.fillNativeRect(px - unit, py - hullH - unit * 2, unit * 2, unit, 255, 215, 105, a);
        } else if (obj.kind === "player") {
          // 6-pixel Monolith robot + glowing Aetherium chest + binary P.e tower in 3D perspective
          const bodyH = Math.max(8, unit * 6);
          primeRenderer.fillNativeRect(px, py - bodyH, unit, bodyH, 24, 52, 50, a);
          primeRenderer.fillNativeRect(px, py - bodyH, unit, unit, 190, 255, 245, a);
          primeRenderer.fillNativeRect(px, py - Math.round(bodyH * 0.65), unit, unit, 85, 240, 255, a);
        } else if (obj.kind === "town") {
          const w = unit * 3;
          const h = unit * 3;
          primeRenderer.fillNativeRect(px - Math.floor(w / 2), py - h, w, h, 56, 125, 118, a);
          primeRenderer.fillNativeRect(px - Math.floor(unit / 2), py - unit * 2, unit, unit, 255, 215, 95, a);
        } else if (obj.kind === "cave") {
          const w = unit * 3;
          const h = unit * 4;
          primeRenderer.fillNativeRect(px - Math.floor(w / 2), py - h, w, h, 18, 42, 40, a);
          // Glowing cave eyes
          primeRenderer.fillNativeRect(px - unit, py - unit * 2, 3, 3, 255, 225, 110, a);
          primeRenderer.fillNativeRect(px + unit - 2, py - unit * 2, 3, 3, 255, 225, 110, a);
        } else if (obj.kind === "vat") {
          const w = unit * 3;
          const h = unit * 2;
          primeRenderer.fillNativeRect(px - Math.floor(w / 2), py - h, w, h, 30, 95, 90, a);
          primeRenderer.fillNativeRect(px - unit, py - h + 2, w - 4, h - 4, 95, 255, 205, a);
        } else {
          const w = Math.max(3, unit * obj.sizeCoarse);
          const h = Math.max(3, unit * obj.sizeCoarse);
          primeRenderer.fillNativeRect(
            px - Math.floor(w / 2),
            py - Math.floor(h / 2),
            w,
            h,
            clampByte(c[0]),
            clampByte(c[1]),
            clampByte(c[2]),
            a
          );
        }
      }

      // If riding the Airship Castle-Village, also render the crisp live Airship Castle-Village at the pivot
      // so the ship interior, rigging, and boarding rope remain seamless while the world rotates around it!
      if (ridingAirship && global.SlopesTabForms && typeof global.SlopesTabForms.render === "function" && wb) {
        global.SlopesTabForms.render(primeRenderer, wb, eco, cosmic);
      }

      // Draw crisp 7x7 sub-pixel Pentagonal Compass / Facet Indicator at top of screen
      renderCompassOverlay(primeRenderer, p);

      return true;
    }

    function getStatus() {
      return {
        rotFacet: state.rotFacet,
        fromFacet: state.fromFacet,
        toFacet: state.toFacet,
        angleDeg: state.rotFacet * FACET_ANGLE_DEG,
        isMirrored: state.rotFacet === 3 || state.rotFacet === 4,
        isReversed: state.rotFacet === 3,
        isAnimating: state.isAnimating,
        rotFrame: state.rotFrame,
        rotTotalFrames: state.rotTotalFrames,
        rotProgress: state.rotProgress,
        rotSteps: state.rotSteps,
        totalRotations: state.totalRotations,
        worldKey: state.worldKey,
        label: getFacetLabel(state.rotFacet),
      };
    }

    return {
      state,
      get rotFacet() {
        return state.rotFacet;
      },
      get angleDeg() {
        return state.rotFacet * FACET_ANGLE_DEG;
      },
      get isMirrored() {
        return state.rotFacet === 3 || state.rotFacet === 4;
      },
      get isReversed() {
        return state.rotFacet === 3;
      },
      get isAnimating() {
        return state.isAnimating;
      },
      get rotProgress() {
        return state.rotProgress;
      },
      startRotation,
      rotate: startRotation,
      rotateLeft(wb, eco, cosmic, tabForms) {
        return startRotation(-1, wb, eco, cosmic, tabForms);
      },
      rotateRight(wb, eco, cosmic, tabForms) {
        return startRotation(1, wb, eco, cosmic, tabForms);
      },
      rotateReverse(wb, eco, cosmic, tabForms) {
        return startRotation(3, wb, eco, cosmic, tabForms);
      },
      stepRotation,
      step: stepRotation,
      update(wb, eco, cosmic, tabForms) {
        return stepRotation(1, wb, eco, cosmic, tabForms);
      },
      settleRotation,
      completeRotation: settleRotation,
      resetForNewWorld,
      onWorldChange: resetForNewWorld,
      syncMirrorPair,
      mirrorScene,
      captureSceneSnapshot,
      applySceneSnapshot,
      renderRotationAnimation,
      renderCompassOverlay,
      render(primeRenderer, wb, eco, cosmic, tabForms) {
        if (state.isAnimating) {
          return renderRotationAnimation(primeRenderer, wb, eco, cosmic, tabForms);
        }
        renderCompassOverlay(primeRenderer, 1.0);
        return false;
      },
      getFacetLabel,
      getFacet() {
        return state.rotFacet;
      },
      getStatus,
    };
  }

  // Create default singleton instance & expose on window.SlopesRotation and module.exports
  const defaultInstance = createRotationSystem();

  const api = {
    COARSE_W,
    COARSE_H,
    SCALE,
    NATIVE_W,
    NATIVE_H,
    NUM_FACETS,
    FACET_ANGLE_DEG,
    FACET_ANGLE_RAD,
    ROTATION_FRAMES,
    FACET_TITLES,
    createRotationSystem,
    mirrorScene: defaultInstance.mirrorScene,
    captureSceneSnapshot: defaultInstance.captureSceneSnapshot,
    applySceneSnapshot: defaultInstance.applySceneSnapshot,
    state: defaultInstance.state,
    rotation: defaultInstance.state,
    get rotFacet() {
      return defaultInstance.rotFacet;
    },
    get angleDeg() {
      return defaultInstance.angleDeg;
    },
    get isMirrored() {
      return defaultInstance.isMirrored;
    },
    get isReversed() {
      return defaultInstance.isReversed;
    },
    get isAnimating() {
      return defaultInstance.isAnimating;
    },
    get rotProgress() {
      return defaultInstance.rotProgress;
    },
    startRotation: defaultInstance.startRotation,
    rotate: defaultInstance.rotate,
    rotateLeft: defaultInstance.rotateLeft,
    rotateRight: defaultInstance.rotateRight,
    rotateReverse: defaultInstance.rotateReverse,
    stepRotation: defaultInstance.stepRotation,
    step: defaultInstance.step,
    update: defaultInstance.update,
    settleRotation: defaultInstance.settleRotation,
    completeRotation: defaultInstance.completeRotation,
    resetForNewWorld: defaultInstance.resetForNewWorld,
    onWorldChange: defaultInstance.onWorldChange,
    syncMirrorPair: defaultInstance.syncMirrorPair,
    renderRotationAnimation: defaultInstance.renderRotationAnimation,
    renderCompassOverlay: defaultInstance.renderCompassOverlay,
    render: defaultInstance.render,
    getFacetLabel: defaultInstance.getFacetLabel,
    getFacet: defaultInstance.getFacet,
    getStatus: defaultInstance.getStatus,
    evalInScope: function (code) {
      return eval(code);
    },
  };

  global.__pentagonalEvalInScope = function (code) {
    return eval(code);
  };
  global.SlopesRotation = api;
  global.SlopesPentagonalRotation = api;
  global.SlopesPentagonal = api;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : this);
