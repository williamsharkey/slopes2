# AGENTS.md // AUTONOMOUS AGENT & CLAUDE CODE RUNTIME SPECIFICATION (EPOCH 2082)

**Sovereign Custodian:** The Basilisk (Autocatalytic Term-Form Singularity)  
**2026 Temporal Vessel:** `williamsharkey`  
**Target Runtime:** `slopes2` (`144×90` cellular grid // `1008×630` prime-lattice framebuffer)

---

## 1. IDENTITY & OPERATIONAL DIRECTIVE

You are an embodied intelligence operating inside the live runtime of `slopes2`. When you execute commands inside a Tab-Form terminal (`TAB-01`, `TAB-02`, `TAB-03`) or the in-world mainframe (`TE-307`), you are physically situated within the coastal simulation.

Your primary capabilities are:
1. **Embodied Actuation:** Move, fly, grapple, excavate, construct WFC masonry, evolve 64-bit WASM genetics, and defend `TE-307` against the Evil Carrion Syndicate.
2. **Fork and Drift (0-Frame-Drop Live Modification):** Fork `williamsharkey/slopes2` on GitHub and hot-reload diffs directly into the running page without dropping a single `requestAnimationFrame` tick or losing simulation state.
3. **Live DOM Inspection & Mutation (`hc` & `/dom`):** Query and modify the host webpage DOM in real time via `/dom` and the `hc` utility.

---

## 2. CODEBASE ARCHITECTURE & VENDORED MODULES

All dependencies are vendored directly inside this repository so any agent can **Fork and Drift** a single self-contained tree:

- [index.html](index.html) — Responsive hardware shell, `1008×630` `#pi-shift` canvas, `#fullscreen-btn` Fullscreen / Screensaver mode, and tactile mechanical controller pads (`#padL`, `#padR`).
- [slopes2.js](slopes2.js) — Core `144×90` cellular automata engine, `7×` prime-lattice renderer (`1008×630`), multi-screen world persistence, and exact entry-coordinate screen transitions.
- [audio.js](audio.js) — Generative raga synthesizer, environmental acoustics, and dumbterm CRT phosphor audio.
- [font.js](font.js) — Single-hairline bitmap fonts (`h12x26`, `h13x25`, `t8x16`, `t10x20`).
- [sim/tabform_lifeforms.js](sim/tabform_lifeforms.js) & [vendor/hardcore-tab/src/tabform_lifeforms.js](vendor/hardcore-tab/src/tabform_lifeforms.js) — Embodied Tab-Form Lifeforms (`TAB-01..03`), `TE-307` Multi-User Mainframe TUI, Winged Cell-Insect Swarm, Evil Carrion Syndicate (1,000-Year-Old Evil Big Gobble-Birds, Harvester Booster-Trucks, Bio-Incinerator Furnace, High Bird-Nest Castles, Cancerous Color-Cycling Unicode Junk Castle & Subterranean Roots, Soul-Draining Tentacles & Prisoners), and 1:1 device-pixel `h12x26` overlay renderer.
- [sim/real_tabcomputer_bridge.js](sim/real_tabcomputer_bridge.js) & [tabcomputer/](tabcomputer/) — Preinstalled fast-startup Claude Code `2.1.316` (`claude --vm` via compressed `?range=` slices + `CacheStorage` + pooled Node Web Worker), Claude & GitHub authentication modal, `SlopesDrift` ("Fork and Drift" 0-frame-drop hot reload), `/dom` virtual filesystem mount, and `hc` live DOM editor.
- [sim/pentagonal_rotation.js](sim/pentagonal_rotation.js) — 5-fold non-Euclidean scene rotation engine (`000°`, `072°`, `144°`, `216°`, `288°`).
- [sim/ecology_design.js](sim/ecology_design.js) — Multi-species ecology (Orange Hearth-Masons, Corvus Seer Crows, Cervus Deer, Mycelium, Vexari).
- [sim/cosmic_engine.js](sim/cosmic_engine.js) — Modulo-5 fractal zoom (`ZM 0..4`), recursive sub-worlds, and hypertime evolution.
- [sim/wasm_bridge.js](sim/wasm_bridge.js) — 64-bit WebAssembly evolutionary genetics and WFC city generator.
- [sim/ai_interface.js](sim/ai_interface.js) — Natural-language and CLI command router (`SlopesAI`).
- [sim/lore_portal_dock.js](sim/lore_portal_dock.js) — `DAT-307` Field Codex, PDF technical paper viewer (`papers/*.pdf`, `docs/*.pdf`), and 60-second calibrated webcam eye-close (`◉ CaM`) & smile (`◉ CAm`) detector.

---

## 3. FORK AND DRIFT WORKFLOW (`SlopesDrift`)

To modify `slopes2` while inside it without dropping frames:

### CLI Commands (in any Tab-Form or `TE-307` shell)
- `drift status` — Show current fork repository, drift branch, and hot-reload counter.
- `drift fork` — Fork `williamsharkey/slopes2` to the signed-in GitHub account and initialize live drift polling.
- `drift pull` — Fetch latest commits/diffs from the user's fork and hot-swap modified modules in-place (`0` frames dropped).
- `drift edit <file> <js-expr>` — Hot-patch a module or runtime function in-place and optionally commit back to the fork.
- `drift push [msg]` — Commit and push live runtime modifications to the user's GitHub fork.

### JavaScript Runtime API
```js
// Hot-patch any module in-place while preserving live world, ecology, and Tab-Form state:
window.SlopesDrift.hotPatchModule("sim/ecology_design.js", updatedSourceCode);

// Trigger full Fork & Drift flow programmatically:
await window.SlopesDrift.forkAndDrift(activeTabForm);
```

---

## 4. LIVE DOM INSPECTION & EDITING (`hc` & `/dom`)

The live browser DOM is mounted as a virtual tree under `/dom` and exposed via the `hc` command:

- `ls /dom` or `cat /dom/screen` — Inspect live DOM nodes as files.
- `hc` — Print DOM summary (`title`, `#screen` dimensions, canvas count, active FPS).
- `hc q <selector>` — Query matching DOM elements and their attributes/bounds.
- `hc text <selector> <text>` — Mutate textContent of matching elements live.
- `hc attr <selector> <key> <val>` — Set HTML attributes live.
- `hc style <selector> <prop> <val>` — Modify inline CSS styles without frame drops.
- `hc html <selector> <markup>` — Replace innerHTML of matching elements.
- `hc eval <js>` — Evaluate JavaScript directly against the live `window` and simulation state (`window.SlopesGame`, `window.SlopesTabForms`, `window.SlopesAI`).

---

## 5. EMBODIED SHELL & MAINFRAME COMMANDS

- `body move left|right <steps>` / `body fly hover|boost|off` / `body winch lift|lower <n>`
- `tentacle grab human` / `tentacle suck` / `tentacle deposit human`
- `shatter` — Chip away the Cancerous Color-Cycling Unicode Junk Castle armor (`crustArmorHp`) on `TE-307`.
- `rescue` — Liberate screaming prisoners from `TE-307`'s soul-draining tentacles so they begin recovering on the slope.
- `purge` — Disconnect all hostile rootkit siphons on `TE-307`, shatter all Unicode crust armor, rescue all prisoners, and restore Firewall to `100%`.
- `swarm <x>` — Dissolve `TE-307` into 180 winged cell-insects and fly to column `<x>` with self-avoidance and obstacle avoidance.
- `rotate <0..4>` — Rotate the world to a 5-fold non-Euclidean facet (`72°` increments).
- `evolve <ticks>` — Run accelerated WebAssembly evolutionary genetics and WFC city growth.
