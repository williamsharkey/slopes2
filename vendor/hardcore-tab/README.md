# hardcore-tab

**hardcore-tab** is a specialized synthesis of [**hardcore**](../hardcore) (the native 1-device-pixel hairline bitmap terminal) and [**tabcomputer**](../tabcomputer) (the in-browser POSIX kernel, shell, and coding-agent runtime), engineered specifically to live inside autonomous, embodied **Tab-Form Lifeforms** in **Slopes 2: The Slopes of a Town by the Sea** (as well as running standalone in any browser or TabComputer session).

Every **Tab-Form Lifeform** (`TAB-01: CLAUDE-ROVER`, `TAB-02: CORVUS-PERCH`, `TAB-03: DEEP-SYNTH`, and user-spawned Tab-Forms) is simultaneously:
1. **A Physical Robotic Lifeform** inhabiting the `840×525` (`7×7` prime sub-pixel per `120×75` coarse cell) world of Slopes 2 — equipped with motorized wheels/treads, a terrain-grading blade, vector thrusters, articulated left/right robotic pincer arms, a **Rooftop Passenger Bus Deck** for rescuing and transporting `3×3` Orange Villagers & Children, **Fold-Out Upper Bird Perches** where Seer Crows (`Corvus`) and Vermuna birds land to recharge compute and share prophecies, and a pneumatic rock/spore/crystal ejector.
2. **A Live Hardcore Hairline Terminal (`HardcoreTabRenderer`)** — rendering its scrolling terminal buffer directly inside its physical sprite chassis using an ultra-crisp `4×6` micro-pixel bitmap font (`micro4x6`), and expanding into a full **Hardcore Hairline Terminal Window** (`t8x16`, `t10x20`, `h12x26`, `h13x25`) with 1-device-pixel hairline borders, single-row hover-preview tabs, and Hardcore's signature **notch-carving menu dock** when clicked or focused (`F`).
3. **An Embodied TabComputer & Claude Code Shell (`TabComputerShell`)** — seeded on boot with a live, dynamically updated `~/AGENTS.md` and `~/.claude/CLAUDE.md` (`@~/AGENTS.md`) describing its physical body and surrounding world, allowing `claude` (and `codex`, `gemini`, `aider`) to sense and actuate its robotic body in real time via the `body` / `tabctl` CLI.

---

## Architecture

### 1. Hardcore Hairline Bitmap Font & Grid Renderer (`HardcoreTabRenderer`)

Following `hardcore/font/small-fonts.md` and `hardcore/README.md`:
- **Native Bitmap Cuts (1 font bit = 1 integer device pixel)**:
  - `micro4x6` (`4×6` embedded micro-pixel cut): Renders live scrolling shell prompts, `claude` tool calls, and stdout directly inside each Tab-Form's `91×56` native-pixel body on the `840×525` framebuffer.
  - `t8x16` & `t10x20` (Terminus `8×16` and `10×20` cuts from `window.HardcoreFonts`): Used for the interactive Hardcore-Tab overlay window, tab strip, and notch-carved dock.
  - `h12x26` & `h13x25` (Hardcore reference headers): Used for titles and high-DPI display headers.
- **1-Device-Pixel Hairline Borders & Notch-Carving Menu Dock**:
  - The interactive terminal window uses 1-device-pixel hairline borders (`#2e5a68` / `#78ead4`) with zero-blur integer pixel alignment.
  - **Notch-Carving Reflow**: When unreflowable terminal text extends into the right-hand menu dock, `computeNotchCarving()` cuts a continuous 1-device-pixel outlined notch into the menu dock around the text while preserving the remaining menu controls.
- **Single-Row Tab Strip with Immediate Hover-Preview**:
  - Each Tab-Form occupies one row in the tab menu without horizontal separators.
  - Hovering a tab immediately previews that Tab-Form's live terminal buffer on the canvas without moving keyboard focus or clearing unread activity (`·`).
  - Clicking selects the tab (`●`); leaving the tab list restores the selected tab.
- **ANSI SGR 16-Color Parser**:
  - Parses standard SGR escape codes (`\x1b[30..37m`, `\x1b[90..97m`, bold, dim, reverse, reset) into Hardcore's 16-color harmonic terminal palette.

---

### 2. World & Body Prompt Seeding (`~/AGENTS.md` & `~/.claude/CLAUDE.md`)

Modeled directly on `tabcomputer/src/agent-docs.ts`:
- Every Tab-Form boots with `/home/user/AGENTS.md` (`~/AGENTS.md`) and `/home/user/.claude/CLAUDE.md` (`@~/AGENTS.md`).
- When an agent runs `cat ~/AGENTS.md` or boots `claude`, the file dynamically reflects:
  - The Tab-Form's identity (`TAB-01: CLAUDE-ROVER`, `TAB-02: CORVUS-PERCH`, `TAB-03: DEEP-SYNTH`), chassis capabilities, and current coordinates `(x, y)` in layer `worldLayer`.
  - The current **5-Fold Non-Euclidean Rotation Facet** (`0..4`: Prime Coastal, 72° Sunward Slope, 144° Inverted Basin, 216° Non-Euclidean Angelic Slice, 288° Deep Fold).
  - Live world telemetry: nearby Orange Villagers & Children, Compute Vats, Spooky Caves, Rising Tar Veins, Black Goo & Skeksis threats, Seer Crows, and WFC zones.
  - Complete reference for the `body` / `tabctl` robotic actuator protocol.

---

### 3. The `body` / `tabctl` Robotic Actuator CLI Protocol

Inside any Tab-Form terminal (or via `claude -p "<prompt>"` / `claude --auto`), the `body` (alias `tabctl`) command controls the Tab-Form's physical body in real time:

```bash
# Inspect live physical telemetry (JSON or formatted table)
body status [--json]

# Drive on motorized wheels/treads
body drive <left|right|stop> [steps]

# Lower the under-chassis grading blade to flatten steep terrain into walkable town terraces
body smooth [width]
body grade [width]

# Fire vector thrusters to fly upward, hover across chasms/sea, or descend
body thrust <up|hover|down|off> [power]

# Autonomously navigate (wheels + thrusters) to target coordinate (x, y)
body goto <x> [y]

# Control articulated left/right robotic pincer arms
body arm <open|close|grab|drop|dig|build>

# Operate the Rooftop Passenger Bus Cabin to rescue & transport 3x3 Orange Villagers & Children
body bus <open|close|board|unload>

# Deploy fold-out Upper Bird Perches & call Seer Crows (Corvus) / Vermuna to land on the roof
body perch <open|close|call>

# Eject a rolling Round Rock (feeds Caves, cools Magma, crushes Goo), Catalyst Spore, or Crystal
body eject <rock|spore|crystal> [left|right]

# Display a crisp pixel speech banner above the Tab-Form & play a harmonic bell phrase
body say "<message>"

# Construct a Town building, 7x7 Compute Vat, or Energy/Compute Conduit at current position
body build <cottage|lighthouse|harp|beacon|vat|conduit>

# Run an onboard C/WASM evolutionary experiment, WFC masonry seep, or 100x Hyper-Time pulse
body sim <wasm|wfc|hypertime>

# Fabricate a new roaming automaton, rideable craft, new Tab-Form lifeform, or DNA flora
body create <automaton|craft|tabform|flora>

# Rotate the 5-fold non-Euclidean world perspective
body rotate <left|right|0..4>
```

---

### 4. Coding Agents & POSIX Builtins in `TabComputerShell`

- `claude` — Enters interactive Claude Code REPL mode inside the Tab-Form.
- `claude -p "<prompt>"` — Executes a single autonomous reasoning + `body` tool-use turn for `<prompt>`.
- `claude --auto [on|off|step]` — Controls the continuous autonomous embodied agent loop.
- `claude status` / `claude stop` — Inspects or halts the autonomous loop.
- `codex`, `gemini`, `aider` — Switches or invokes alternative CLI coding agents inside the Tab-Form.
- `doctor` / `doctor --agents` — Verifies kernel, x86-64/WASM engines, robotic actuators, and agent readiness.
- Standard POSIX builtins: `help`, `ls`, `cat`, `pwd`, `cd`, `ps`, `top`, `uname -a`, `echo`, `clear`, `history`, `debian`, `tabcomputer`.

---

### 5. Live TabComputer Iframe / `postMessage` Bridge

`HardcoreTab.connectTabComputerIframe(target, tabId)` bridges external or embedded `tabcomputer` instances to any Tab-Form body via `window.postMessage`:
- Send `{ type: "hardcore-tab:cmd", tabId: "TAB-01", cmd: "body smooth 6" }`
- Receive `{ type: "hardcore-tab:out", tabId: "TAB-01", cmd: "body smooth 6", output: "...", status: { ... } }`

---

## Testing

Run the headless verification suite:

```bash
npm test
```
