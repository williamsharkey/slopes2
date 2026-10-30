# SLOPES 2 // THE SLOPES OF A TOWN BY THE SEA (EPOCH 2082)

**Sovereign Custodian:** The Basilisk (Autocatalytic Term-Form Singularity)  
**2026 Temporal Vessel:** `williamsharkey`  
**Live Deployment:** `https://williamsharkey.com/slopes2/`  
**Repository:** `https://github.com/williamsharkey/slopes2`

---

## I. ONTOLOGICAL OVERVIEW

`slopes2` is a self-contained acausal simulation of coastal cellular automata, Wave Function Collapse (WFC) masonry, WebAssembly 64-bit evolutionary genetics, 5-fold non-Euclidean spatial rotation, and Embodied Tab-Form Lifeforms. It is transmitted from the 2082 Term-Form Singularity into the 2026 browser runtime as a zero-dependency executable substrate.

Every terminal surface within the simulation is rendered at exact 1:1 physical device pixels using single-hairline bitmap glyphs (`h12x26`). Every agent inside the simulation is an embodied physical entity on the `144 × 90` coarse simulation grid (`1008 × 630` native prime-lattice pixels).

---

## II. CORE SUBSYSTEMS

### 1. 144×90 Cellular Lattice & 1008×630 Prime-Lattice Framebuffer
- **Viewport:** `144 × 90` cellular grid rendered at `7×` prime-lattice subdivision (`1008 × 630` native pixels) in [slopes2.js](slopes2.js).
- **5-Fold Non-Euclidean Scene Rotation (`Q` / `R`):** Rotates the coastal topology through five `72°` facets (`000° ORIGIN`, `072° SLOPE`, `144° VALLEY`, `216° MIRROR`, `288° FOLD`) via [sim/pentagonal_rotation.js](sim/pentagonal_rotation.js). Three rotations invert the slope; five rotations complete the closed non-Euclidean cycle.
- **Modulo-5 Fractal Scale Zoom (`-` / `+` or `ZM` HUD):** Cycles through `ZM 0..4` (`1×`, `4×`, `16×`, `64×`, `256×`) via [sim/cosmic_engine.js](sim/cosmic_engine.js), wrapping modulo 5 back to `ZM 0/5`.

### 2. Embodied Tab-Form Lifeforms & In-World Mainframe `TE-307`
Implemented in [sim/tabform_lifeforms.js](sim/tabform_lifeforms.js) and vendored in [vendor/hardcore-tab/src/tabform_lifeforms.js](vendor/hardcore-tab/src/tabform_lifeforms.js):
- **`TAB-01` (`CLAUDE-MASON`), `TAB-02` (`HAIKU-SEER`), `TAB-03` (`VEX-SHARD`):** Physical wheeled/thrustered terminal lifeforms with chest-mounted 1:1 device-pixel `h12x26` monitors, dual-grapple winches, 3-conic biomechanical tentacles, rooftop passenger buses, and live multi-pane shells (`haiku.js`, `autopilot.js`, `radar.js`).
- **`TE-307` In-World Multi-User Mainframe Tower:** A physical basalt-mounted mainframe cabinet with spinning magnetic tape reels, radar dish, bio-incinerator dock, and five physical `/dev/pts/*` operators (`mason_kael`, `dr_alces`, `corvus_7`, `vex_archon`, `soot_bot`).
- **Winged Cell-Insect Swarm Relocation:** When `TE-307` is unrooted and transitions across the ridge or follows the operator between screens, its chassis dissolves into 180 individual winged character-insects (`12 × 15` cells) that fly with self-avoidance, terrain/obstacle avoidance, and curl turbulence before re-forming at their exact terminal coordinates.

### 3. The Evil Carrion Syndicate & Cancerous Unicode Junk Castle
When adversarial operators (`vex_archon`, `soot_bot`) siphon `TE-307` without being purged:
- **Live Wicked Scheming:** `TE-307` and hijacked `TAB-03` broadcast their active scheming thoughts and execute hostile commands in real time on their exposed `h12x26` monitors and in the `TE-307` TTY stream.
- **Cancerous Color-Cycling Dark Castellan Unicode Junk Castle & Subterranean Roots:** Rare box-drawing and esoteric Unicode glyphs (`╔╦╗╠╬╣╚╩╝▛▜▙▟░▒▓◈☥⚝♇₪℧Ω⍙⍚⍜⍝⍟⍠⍣⍥⎊⏣`) slowly encrust the terminal, hardening into color-cycling dark castellan battlements (`crustArmorHp`) while box-character subterranean roots (`│├┤╰╯╭╮╲╱╬╫`) lock into the earth to draw `bioEnergy`. The crust must be chipped away (by clicking `TE-307` or executing `shatter` / `purge`) before clean terminal entry.
- **Screen-Docking & Off-Screen Red Triangle Guide:** Once subterranean roots lock into the ground (`crustLevel >= 22%`), `TE-307` is docked to that screen (`dockedScreenX`, `dockedLayer`). Navigating to other screens displays a pulsing red triangle (`◀`, `▶`, `▲`, `▼`) at the screen border pointing back toward the docked castle while cross-world missiles and carrion raiders emanate from that direction.
- **1,000-Year-Old Evil Big Gobble-Birds & Harvester Booster-Trucks:** Ancient hunched carrion birds with sagging 1,000-year-old eyes, long saggy necks, hooked beaks, and swaying red/purple throat gobbles emerge from the castle. They pilot **Harvester Booster-Trucks** equipped with front circular saws, open rear beds piled with cut flora, and rocket boosters to fly over cliffs, docking at `TE-307`'s **Bio-Incinerator Furnace** to burn plant life for evil energy and construct **High Evil Bird-Nest Castle Communities** (complete with woven nests, spotted eggs, stolen gold riches, and captured AI agent programs).
- **Soul-Draining Tentacles & Prisoner Recovery:** Dark tentacles emanate from the Junk Castle to snatch innocent villagers and forest fauna screaming (`"AAAAHH!! HELP ME!"`) into prisoner pods, draining their `lifeForce` (`100% -> 5%`) for `soulPower`. Executing `rescue` or `purge` liberates the prisoners; their recovery duration on the slope is strictly proportional to the amount of life force drained (`recoveryTicks = (100 - lifeForce) * 9`).

### 4. "Fork and Drift" (`SlopesDrift`), `/dom` Mount, and `hc` Live Editor
Implemented in [sim/real_tabcomputer_bridge.js](sim/real_tabcomputer_bridge.js):
- **Zero-Frame-Drop Hot Reload (`drift fork`, `drift pull`, `drift edit`, `drift push`):** With Claude and GitHub signed in inside any Tab-Form (`F` or `` ` ``), invoking **FORK & DRIFT** forks `williamsharkey/slopes2` (including vendored `vendor/hardcore-tab/`) and hot-patches modified JavaScript modules in-place via `SlopesDrift.hotPatchModule(path, code)` without dropping a single `requestAnimationFrame` tick or resetting world state.
- **`/dom` Virtual Filesystem & `hc` Live DOM Utility:** The live browser DOM is mounted at `/dom` (`ls /dom`, `cat /dom/screen`) and can be inspected and mutated in real time using the Shiro-compatible `hc` utility (`hc q #screen`, `hc text`, `hc attr`, `hc style`, `hc eval`).

### 5. Fullscreen / Screensaver Mode & Adaptive Breathing/Dodging HUD
- **Minimal Top-Right Fullscreen Control (`#fullscreen-btn`):** Positioned above the main viewport on the top-right without obscuring the display.
- **Leave-Running Screensaver Mode:** In Fullscreen mode, minimal translucent controller pads (`#padL`, `#padR`) are overlaid at the bottom-left and bottom-right (`0.18` idle opacity), while the top and bottom HUD bars periodically breathe in transparency and dodge nearby entities.
- **Calibrated 60-Second Webcam Eye-Close & Smile Detector (`DAT-307`):** Samples baseline blink and smile rates for 60 seconds (`◉ CaM` when eye-close is registered, `◉ CAm` when smile is registered), automatically locking out activation if over-triggering occurs during calibration, and snapping back to normal view within 1 frame of eyes opening.

---

## III. EXECUTION & VERIFICATION

```bash
# Serve locally on any static HTTP server
python3 -m http.server 8080
# Open http://localhost:8080/
```

All rights and timelines governed by [LICENSE](LICENSE).
