"use strict";

const assert = require("assert");
const HardcoreTab = require("../src/hardcore_tab.js");
const SlopesTabForms = require("../../slopes2/sim/tabform_lifeforms.js");

function createMockPrimeRenderer() {
  let pixelWrites = 0;
  return {
    get pixelWrites() {
      return pixelWrites;
    },
    fillNativeRect(px, py, pw, ph, r, g, b, a) {
      if (pw > 0 && ph > 0) pixelWrites++;
    },
  };
}

function createMockWorld() {
  const Blocks = new Array(120).fill(0).map((_, x) => Math.round(18 + Math.sin(x * 0.1) * 5));
  return {
    Blocks,
    IslandBase: new Array(120).fill(0),
    seaLevel: 12,
    worldLayer: 0,
    worldX: 0,
    currentBiome: "surface",
    Towns: [{ x: 30, type: "cottage", pulse: 0 }],
    Caves: [{ x: 70, depth: 4, hunger: 1, glow: 0, fedCount: 0 }],
    TarVeins: [],
    Crystals: [],
    Relics: [],
    Rocks: [],
    P: { x: 56, y: 20 },
  };
}

function createMockEco() {
  return {
    OrangePeople: [
      { x: 29, vx: 0.1, role: "builder" },
      { x: 31, vx: -0.1, role: "gatherer" },
      { x: 33, vx: 0.1, role: "guardian" },
    ],
    Children: [{ x: 30, vx: 0.08, homeX: 30 }],
    ComputeVats: [{ x: 42, progress: 0.4 }],
    Automata: [],
    SeerCrows: [{ x: 62, y: 28 }],
    Skeksis: [],
    GooNodes: [],
  };
}

console.log("=== Testing Hardcore-Tab & SlopesTabForms ===");

// 1. Test HardcoreTab Renderer & Fonts
assert.strictEqual(HardcoreTab.MICRO_4X6.w, 4);
assert.strictEqual(HardcoreTab.MICRO_4X6.h, 6);
assert.strictEqual(HardcoreTab.MICRO_4X6.glyphs.length, 95);

const parsed = HardcoreTab.HardcoreTabRenderer.parseAnsiLine("\x1b[96mTAB-01\x1b[0m: \x1b[92mONLINE\x1b[0m");
assert.ok(parsed.length >= 2, "ANSI SGR parser should split colored segments");
assert.strictEqual(HardcoreTab.HardcoreTabRenderer.stripAnsi("\x1b[96mTAB-01\x1b[0m"), "TAB-01");

const notches = HardcoreTab.HardcoreTabRenderer.computeNotchCarving(
  ["short", "this is a very long unreflowable terminal output line that cuts a notch into the right dock"],
  400,
  20,
  160,
  300,
  10,
  28,
  8,
  16
);
assert.strictEqual(notches.length, 1, "Notch carving should cut a 1px-outlined notch for long lines");
assert.ok(notches[0].notchWidth > 0);

// 2. Test SlopesTabForms Population (TAB-01, TAB-02, TAB-03)
const world = createMockWorld();
const eco = createMockEco();
const cosmic = {
  cosmic: { Crafts: [], EvolvedFlora: [], WfcZones: [] },
  triggerWasmExperiment: () => ({ dnaHex: "0xCAFEBEEF", fitness: 980 }),
  triggerWfcSeepAt: () => true,
  activateTimeCrystal: () => true,
  layConduitNearPlayer: () => true,
};

const tabs = SlopesTabForms.populateScreen(world, eco, cosmic);
assert.strictEqual(tabs.length, 3, "Should spawn 3 distinct Embodied Tab-Form Lifeforms");
assert.strictEqual(tabs[0].id, "TAB-01");
assert.strictEqual(tabs[1].id, "TAB-02");
assert.strictEqual(tabs[2].id, "TAB-03");

// 3. Verify AGENTS.md & CLAUDE.md world-prompt seeding
const agentsOut = SlopesTabForms.executeCommand("TAB-01", "cat ~/AGENTS.md");
assert.ok(agentsOut.ok && agentsOut.output.includes("TAB-01 (CLAUDE-ROVER)"));
assert.ok(agentsOut.output.includes("body smooth"));
const claudeMdOut = SlopesTabForms.executeCommand("TAB-01", "cat ~/.claude/CLAUDE.md");
assert.ok(claudeMdOut.ok && claudeMdOut.output.includes("@~/AGENTS.md"));

// 4. Verify all `body` / `tabctl` robotic actuator commands
const statusRes = SlopesTabForms.executeCommand("TAB-01", "body status --json");
assert.ok(statusRes.ok && statusRes.status.id === "TAB-01");

const driveRes = SlopesTabForms.executeCommand("TAB-01", "body drive right 5");
assert.ok(driveRes.ok && driveRes.action === "drive");

const smoothRes = SlopesTabForms.executeCommand("TAB-01", "body smooth 7");
assert.ok(smoothRes.ok && smoothRes.action === "smooth");
const cx = Math.round(tabs[0].x);
assert.strictEqual(world.Blocks[cx - 1], world.Blocks[cx], "Terrain should be smoothed flat");
assert.strictEqual(world.Blocks[cx + 1], world.Blocks[cx], "Terrain should be smoothed flat");

const thrustRes = SlopesTabForms.executeCommand("TAB-02", "body thrust hover 6");
assert.ok(thrustRes.ok && tabs[1].thrusterActive === true);

const gotoRes = SlopesTabForms.executeCommand("TAB-02", "body goto 68 26");
assert.ok(gotoRes.ok && gotoRes.action === "goto");

const armRes = SlopesTabForms.executeCommand("TAB-01", "body arm grab");
assert.ok(armRes.ok && tabs[0].heldItem !== null);

const busBoardRes = SlopesTabForms.executeCommand("TAB-01", "body bus board");
assert.ok(busBoardRes.ok && tabs[0].busPassengers.length > 0, "Should board villagers/children into rooftop bus");

const busUnloadRes = SlopesTabForms.executeCommand("TAB-01", "body bus unload");
assert.ok(busUnloadRes.ok && tabs[0].busPassengers.length === 0, "Should unload rooftop bus passengers");

const perchRes = SlopesTabForms.executeCommand("TAB-02", "body perch call");
assert.ok(perchRes.ok && tabs[1].perchedBirds.length > 0, "Seer Crows should perch on roof");

const rocksBefore = world.Rocks.length;
const ejectRes = SlopesTabForms.executeCommand("TAB-02", "body eject rock right");
assert.ok(ejectRes.ok && world.Rocks.length === rocksBefore + 1, "Should eject a rolling Round Rock");

const sayRes = SlopesTabForms.executeCommand("TAB-01", 'body say "HELLO COASTAL TOWN"');
assert.ok(sayRes.ok && tabs[0].sayText === "HELLO COASTAL TOWN" && tabs[0].sayTimer > 0);

const townsBefore = world.Towns.length;
const buildRes = SlopesTabForms.executeCommand("TAB-01", "body build lighthouse");
assert.ok(buildRes.ok && world.Towns.length === townsBefore + 1, "Should construct a lighthouse");

const simWasmRes = SlopesTabForms.executeCommand("TAB-03", "body sim wasm");
assert.ok(simWasmRes.ok && simWasmRes.detail.includes("0xCAFEBEEF"));

const simWfcRes = SlopesTabForms.executeCommand("TAB-03", "body sim wfc");
assert.ok(simWfcRes.ok);

const simTimeRes = SlopesTabForms.executeCommand("TAB-03", "body sim hypertime");
assert.ok(simTimeRes.ok);

const rotateRes = SlopesTabForms.executeCommand("TAB-01", "body rotate 3");
assert.ok(rotateRes.ok && rotateRes.facetIndex === 3);

const createBotRes = SlopesTabForms.executeCommand("TAB-03", "body create automaton");
assert.ok(createBotRes.ok && eco.Automata.length === 1);

const createTabRes = SlopesTabForms.executeCommand("TAB-03", "body create tabform");
assert.ok(createTabRes.ok && SlopesTabForms.tabForms.length === 4, "Should spawn TAB-04");

// 5. Verify `claude -p` & autonomous update/render
const claudePromptRes = SlopesTabForms.executeCommand("TAB-01", 'claude -p "smooth the slope and rescue children"');
assert.ok(claudePromptRes.ok && claudePromptRes.command.startsWith("body "));

for (let step = 0; step < 15; step++) {
  SlopesTabForms.update(world, eco, cosmic);
}

const mockPR = createMockPrimeRenderer();
SlopesTabForms.render(mockPR, world, eco, cosmic);
assert.ok(mockPR.pixelWrites > 500, `Expected >500 native pixel writes for 4 Tab-Forms, got ${mockPR.pixelWrites}`);

console.log("ALL HARDCORE-TAB & SLOPES-TABFORMS TESTS PASSED! Pixel writes:", mockPR.pixelWrites);
process.exit(0);
