#!/usr/bin/env node
/* ============================================================================
 * SLOPES 2 — MODEL CONTEXT PROTOCOL (MCP) SERVER, CLI REPL & DEMO AI AGENT
 * File: /mcp/slopes2_mcp_server.js
 *
 * Zero-dependency Node.js server that boots the full Slopes 2 engine
 * (font.js, audio.js, sim/wasm_bridge.js, sim/ecology_design.js,
 *  sim/cosmic_engine.js, sim/ai_interface.js, slopes2.js) inside a headless
 * HTML5 Canvas / DOM context and provides:
 *   1. Standards-compliant MCP Server over stdio (JSON-RPC 2.0, auto-detecting
 *      both newline-delimited JSON and Content-Length LSP/MCP framing)
 *   2. Interactive terminal REPL (--cli)
 *   3. 15-turn autonomous AI showcase (--demo-agent)
 * ============================================================================ */

"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const readline = require("readline");

const ROOT_DIR = path.resolve(__dirname, "..");

// ============================================================================
// 1. HEADLESS DOM / CANVAS / WEB-AUDIO SHIM FOR SLOPES 2 ENGINE
// ============================================================================
function setupHeadlessBrowserEnvironment() {
  const canvases = new Map();

  function createMockContext2D(canvas) {
    return {
      canvas,
      imageSmoothingEnabled: false,
      fillStyle: "#000000",
      strokeStyle: "#000000",
      lineWidth: 1,
      globalAlpha: 1,
      font: "10px monospace",
      createImageData(w, h) {
        const width = Math.max(1, w | 0);
        const height = Math.max(1, h | 0);
        return {
          width,
          height,
          data: new Uint8ClampedArray(width * height * 4),
        };
      },
      getImageData(x, y, w, h) {
        const width = Math.max(1, w | 0);
        const height = Math.max(1, h | 0);
        return {
          width,
          height,
          data: new Uint8ClampedArray(width * height * 4),
        };
      },
      putImageData() {},
      fillRect() {},
      clearRect() {},
      strokeRect() {},
      beginPath() {},
      closePath() {},
      moveTo() {},
      lineTo() {},
      stroke() {},
      fill() {},
      arc() {},
      save() {},
      restore() {},
      translate() {},
      scale() {},
      rotate() {},
      drawImage() {},
      fillText() {},
      measureText(str) {
        return { width: String(str || "").length * 6 };
      },
    };
  }

  function createMockCanvas(id = "canvas", width = 840, height = 525) {
    const canvas = {
      id,
      width,
      height,
       clientWidth: width,
      clientHeight: height,
      style: {
        backgroundColor: "rgb(42, 161, 152)",
        width: `${width}px`,
        height: `${height}px`,
      },
      dataset: {},
      classList: {
        add() {},
        remove() {},
        toggle() {},
        contains() {
          return false;
        },
      },
      addEventListener() {},
      removeEventListener() {},
      setAttribute() {},
      getBoundingClientRect() {
        return { left: 0, top: 0, width, height, right: width, bottom: height };
      },
      getContext() {
        if (!this._ctx2d) {
          this._ctx2d = createMockContext2D(this);
        }
        return this._ctx2d;
      },
    };
    return canvas;
  }

  // Headless WebAudio mock (remains suspended so audio.js setInterval doesn't block exit)
  class MockAudioNode {
    connect() {
      return this;
    }
    disconnect() {}
  }
  class MockAudioParam {
    constructor(v = 0) {
      this.value = v;
    }
    setValueAtTime(v) {
      this.value = v;
    }
    linearRampToValueAtTime(v) {
      this.value = v;
    }
    exponentialRampToValueAtTime(v) {
      this.value = v;
    }
    setTargetAtTime(v) {
      this.value = v;
    }
    cancelScheduledValues() {}
  }
  class MockAudioContext {
    constructor() {
      this.state = "suspended";
      this.currentTime = 0;
      this.sampleRate = 44100;
      this.destination = new MockAudioNode();
    }
    resume() {
      return Promise.resolve();
    }
    createOscillator() {
      const n = new MockAudioNode();
      n.type = "sine";
      n.frequency = new MockAudioParam(440);
      n.detune = new MockAudioParam(0);
      n.start = () => {};
      n.stop = () => {};
      n.setPeriodicWave = () => {};
      return n;
    }
    createGain() {
      const n = new MockAudioNode();
      n.gain = new MockAudioParam(1);
      return n;
    }
    createBiquadFilter() {
      const n = new MockAudioNode();
      n.type = "lowpass";
      n.frequency = new MockAudioParam(1000);
      n.Q = new MockAudioParam(1);
      n.gain = new MockAudioParam(0);
      return n;
    }
    createDelay() {
      const n = new MockAudioNode();
      n.delayTime = new MockAudioParam(0.2);
      return n;
    }
    createDynamicsCompressor() {
      const n = new MockAudioNode();
      n.threshold = new MockAudioParam(-12);
      n.knee = new MockAudioParam(10);
      n.ratio = new MockAudioParam(4);
      n.attack = new MockAudioParam(0.005);
      n.release = new MockAudioParam(0.15);
      return n;
    }
    createWaveShaper() {
      const n = new MockAudioNode();
      n.curve = null;
      n.oversample = "none";
      return n;
    }
    createConvolver() {
      const n = new MockAudioNode();
      n.buffer = null;
      n.normalize = true;
      return n;
    }
    createStereoPanner() {
      const n = new MockAudioNode();
      n.pan = new MockAudioParam(0);
      return n;
    }
    createAnalyser() {
      const n = new MockAudioNode();
      n.fftSize = 2048;
      n.getByteFrequencyData = () => {};
      n.getByteTimeDomainData = () => {};
      return n;
    }
    createPeriodicWave() {
      return {};
    }
    createBuffer(channels, length, sampleRate) {
      return {
        numberOfChannels: channels,
        length,
        sampleRate,
        getChannelData() {
          return new Float32Array(length);
        },
      };
    }
    createBufferSource() {
      const n = new MockAudioNode();
      n.buffer = null;
      n.loop = false;
      n.playbackRate = new MockAudioParam(1);
      n.start = () => {};
      n.stop = () => {};
      return n;
    }
  }

  let rafCallback = null;
  let virtualTimeMs = 1000;

  global.window = global;
  global.self = global;
  global.innerWidth = 1280;
  global.innerHeight = 800;
  global.devicePixelRatio = 1;
  global.AudioContext = MockAudioContext;
  global.webkitAudioContext = MockAudioContext;

  global.document = {
    body: createMockCanvas("body", 1280, 800),
    documentElement: createMockCanvas("html", 1280, 800),
    getElementById(id) {
      if (!canvases.has(id)) {
        canvases.set(id, createMockCanvas(id, 840, 525));
      }
      return canvases.get(id);
    },
    createElement(tag) {
      return createMockCanvas(tag, 840, 525);
    },
    querySelectorAll() {
      return [];
    },
    addEventListener() {},
    removeEventListener() {},
  };

  global.getComputedStyle = function (el) {
    return {
      backgroundColor:
        (el && el.style && el.style.backgroundColor) || "rgb(42, 161, 152)",
    };
  };

  global.matchMedia = function () {
    return { matches: false, addEventListener() {}, removeEventListener() {} };
  };

  global.addEventListener = function () {};
  global.removeEventListener = function () {};

  global.requestAnimationFrame = function (cb) {
    if (typeof cb === "function") {
      rafCallback = cb;
    }
    return 1;
  };
  global.cancelAnimationFrame = function () {};

  // Allow synchronous frame stepping of slopes2.js's main loop
  global.__slopesStepRaf = function (frames = 1) {
    const count = Math.max(1, frames | 0);
    for (let i = 0; i < count; i++) {
      virtualTimeMs += 36;
      if (typeof rafCallback === "function") {
        rafCallback(virtualTimeMs);
      }
    }
  };
}

function loadEngineScriptIfPresent(relPath) {
  const fullPath = path.join(ROOT_DIR, relPath);
  if (!fs.existsSync(fullPath)) {
    return false;
  }
  const code = fs.readFileSync(fullPath, "utf8");
  vm.runInThisContext(code, { filename: fullPath });
  return true;
}

function bootSlopes2Engine() {
  setupHeadlessBrowserEnvironment();

  const bootOrder = [
    "font.js",
    "audio.js",
    "sim/wasm_bridge.js",
    "sim/ecology_design.js",
    "sim/cosmic_engine.js",
    "sim/pentagonal_rotation.js",
    "sim/hardcore_tab.js",
    "sim/tabform_lifeforms.js",
    "slopes2.js",
    "sim/ai_interface.js",
  ];

  const loadedFiles = [];
  for (const rel of bootOrder) {
    if (loadEngineScriptIfPresent(rel)) {
      loadedFiles.push(rel);
    }
  }

  // Step 2 initial frames so slopes2.js and ecology populate & render their initial state
  if (typeof global.__slopesStepRaf === "function") {
    global.__slopesStepRaf(2);
  }

  return loadedFiles;
}

const LOADED_ENGINE_FILES = bootSlopes2Engine();
const SlopesAI = global.SlopesAI || require(path.join(ROOT_DIR, "sim/ai_interface.js"));

// ============================================================================
// 2. MCP TOOL DEFINITIONS & EXECUTION HANDLERS
// ============================================================================
const MCP_TOOLS = [
  {
    name: "slopes2_observe",
    description:
      "Returns the live ASCII/Unicode multi-scale map, high-res WFC strip, and structured JSON telemetry of all 4 societies (Orange Human, Corvus Sky, Cervus Mycelial, Skeksis Goo), 7x7 Compute Vats, conduits, recursive objects, 100x Time Crystals, and transdimensional beings.",
    inputSchema: {
      type: "object",
      properties: {
        mode: {
          type: "string",
          enum: ["default", "full", "zoom", "wfc"],
          description: "Viewport resolution mode: 'default' (60x24), 'full' (120x38), or 'zoom'/'wfc' (30x15).",
        },
        includeLegend: {
          type: "boolean",
          description: "Whether to append the symbol legend below the viewport (default true).",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "slopes2_execute",
    description:
      "Executes any text command or semicolon-separated sequence of commands (e.g. 'right 4; tamp; evolve deer 4096; hypertime 100 5; town') and returns the resulting ASCII observation & event log.",
    inputSchema: {
      type: "object",
      properties: {
        command: {
          type: "string",
          description:
            "Command or semicolon-separated command chain (e.g. 'right 4; tamp; pipe; evolve deer 4096; hypertime 100 5; town').",
        },
      },
      required: ["command"],
      additionalProperties: false,
    },
  },
  {
    name: "slopes2_step",
    description:
      "Steps the Slopes 2 world forward by `frames` (1..500) at `time_dilation` (1..100x) and reports all emergent civilization, WFC, 7x7 Vat, and scientist events.",
    inputSchema: {
      type: "object",
      properties: {
        frames: {
          type: "integer",
          minimum: 1,
          maximum: 500,
          default: 10,
          description: "Number of simulation frames to advance (1..500).",
        },
        time_dilation: {
          type: "integer",
          minimum: 1,
          maximum: 100,
          default: 1,
          description: "Chronos Time-Crystal dilation multiplier (1..100x).",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "slopes2_run_wasm_science",
    description:
      "Directly invokes the C/WASM evolutionary simulator & city architect (window.SlopesWasm) for a faction ('human', 'bird', 'deer', 'goo') with `num_trials` (up to 65536), spawning the evolved building blueprint, rideable craft, or DNA flora in the live world!",
    inputSchema: {
      type: "object",
      properties: {
        faction: {
          type: "string",
          enum: ["human", "bird", "deer", "goo"],
          default: "deer",
          description: "Civilization faction conducting the C/WASM scientist experiment.",
        },
        num_trials: {
          type: "integer",
          minimum: 64,
          maximum: 65536,
          default: 4096,
          description: "Number of evolutionary rollout trials to execute in WASM/C (up to 65536).",
        },
      },
      required: ["faction"],
      additionalProperties: false,
    },
  },
  {
    name: "slopes2_enter_recursive",
    description:
      "Enters or exits a recursive object ('vat', 'time_crystal', 'fungal_center', 'sky_lab', 'castle', 'airship', or 'exit') and renders its internal pocket world.",
    inputSchema: {
      type: "object",
      properties: {
        target: {
          type: "string",
          enum: ["vat", "time_crystal", "fungal_center", "sky_lab", "castle", "airship", "exit"],
          description: "Recursive object type to enter, or 'exit' to return to the macro world.",
        },
      },
      required: ["target"],
      additionalProperties: false,
    },
  },
  {
    name: "slopes2_auto_play",
    description:
      "Runs the autonomous AI Monolith utility-scoring player for `turns` steps and returns the play-by-play narrative, before/after civilization metrics, and live ASCII viewport.",
    inputSchema: {
      type: "object",
      properties: {
        turns: {
          type: "integer",
          minimum: 1,
          maximum: 50,
          default: 10,
          description: "Number of autonomous AI decision turns to run.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "slopes2_rotate_world",
    description:
      "Rotates the 5-fold non-Euclidean 2D world projection by `steps` (1..5 or -1). Rotating 3 times from Facet 0 produces the exact same 2D world horizontally reversed (Facet 3); rotating 5 times returns to the exact origin (Facet 0).",
    inputSchema: {
      type: "object",
      properties: {
        steps: {
          type: "integer",
          minimum: -5,
          maximum: 5,
          default: 1,
          description: "Number of 72-degree pentagonal rotation steps (+1 right, -1 left, +3 reverse mirror, +5 full cycle).",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "slopes2_tabform_exec",
    description:
      "Executes a TabComputer / Claude Code / `body` robotic actuator command inside an Embodied Tab-Form Lifeform (`TAB-01`, `TAB-02`, `TAB-03`), such as `body status`, `body smooth 8`, `body bus open`, `body bus board`, `body perch open`, `body eject rock`, `body say HELLO`, `claude --auto`, or `cat ~/AGENTS.md`.",
    inputSchema: {
      type: "object",
      properties: {
        tab_id: {
          type: "string",
          default: "TAB-01",
          description: "Target Tab-Form ID ('TAB-01', 'TAB-02', 'TAB-03').",
        },
        command: {
          type: "string",
          description: "Shell command to run inside the Tab-Form's Hardcore-Tab terminal body.",
        },
      },
      required: ["command"],
      additionalProperties: false,
    },
  },
];

function handleToolCall(name, args = {}) {
  switch (name) {
    case "slopes2_observe": {
      const asciiMap = SlopesAI.renderAsciiMap({
        mode: args.mode || "default",
        includeLegend: args.includeLegend !== false,
      });
      const observation = SlopesAI.getStructuredObservation();
      return {
        content: [
          {
            type: "text",
            text: `${asciiMap}\n\n=== STRUCTURED TELEMETRY ===\n${JSON.stringify(observation, null, 2)}`,
          },
        ],
        structuredContent: { asciiMap, observation },
        isError: false,
      };
    }

    case "slopes2_execute": {
      const cmd = args.command || "look";
      const res = SlopesAI.executeCommand(cmd);
      return {
        content: [
          {
            type: "text",
            text: `COMMAND: ${res.command}\nSUMMARY: ${res.summary}\nEVENTS:\n- ${(res.events || []).join("\n- ")}\n\n${res.asciiMap}\n\n=== TELEMETRY ===\n${JSON.stringify(res.state, null, 2)}`,
          },
        ],
        structuredContent: res,
        isError: !res.ok,
      };
    }

    case "slopes2_step": {
      const frames = args.frames != null ? args.frames : 10;
      const dilation = args.time_dilation != null ? args.time_dilation : 1;
      const res = SlopesAI.stepWorld(frames, dilation);
      const asciiMap = SlopesAI.renderAsciiMap();
      return {
        content: [
          {
            type: "text",
            text: `STEPPED ${res.frames} FRAMES @ ${res.timeDilation}x DILATION\nEVENTS: ${res.events.join(" | ") || "Steady harmonic evolution."}\n\n${asciiMap}`,
          },
        ],
        structuredContent: { ...res, asciiMap },
        isError: false,
      };
    }

    case "slopes2_run_wasm_science": {
      const faction = args.faction || "deer";
      const trials = args.num_trials || 4096;
      const exp = SlopesAI.runWasmScienceExperiment(faction, trials);
      const asciiMap = SlopesAI.renderAsciiMap();
      const observation = SlopesAI.getStructuredObservation();
      return {
        content: [
          {
            type: "text",
            text: `C/WASM SCIENCE EXPERIMENT COMPLETE:\n${JSON.stringify(exp, null, 2)}\n\n${asciiMap}`,
          },
        ],
        structuredContent: { experiment: exp, observation, asciiMap },
        isError: false,
      };
    }

    case "slopes2_enter_recursive": {
      const target = String(args.target || "vat").toLowerCase();
      const cmd = target === "exit" ? "exit" : `enter ${target}`;
      const res = SlopesAI.executeCommand(cmd);
      return {
        content: [
          {
            type: "text",
            text: `${res.summary}\n\n${res.asciiMap}`,
          },
        ],
        structuredContent: res,
        isError: !res.ok,
      };
    }

    case "slopes2_auto_play": {
      const turns = args.turns != null ? args.turns : 10;
      const res = SlopesAI.runAutoAgent(turns);
      return {
        content: [
          {
            type: "text",
            text: `${res.summary}\n\nPLAY-BY-PLAY LOG:\n${res.log.map((l) => "  * " + l).join("\n")}\n\n${res.asciiMap}`,
          },
        ],
        structuredContent: res,
        isError: false,
      };
    }

    case "slopes2_rotate_world": {
      const steps = args.steps != null ? args.steps : 1;
      const res = SlopesAI.executeCommand(`rotate ${steps}`);
      return {
        content: [
          {
            type: "text",
            text: `${res.summary}\n\n${res.asciiMap}`,
          },
        ],
        structuredContent: res,
        isError: !res.ok,
      };
    }

    case "slopes2_tabform_exec": {
      const tabId = args.tab_id || "TAB-01";
      const cmd = args.command || "body status";
      const res = SlopesAI.executeCommand(`tabform ${tabId} ${cmd}`);
      return {
        content: [
          {
            type: "text",
            text: `${res.summary}\n${(res.events || []).slice(1).join("\n")}\n\n${res.asciiMap}`,
          },
        ],
        structuredContent: res,
        isError: !res.ok,
      };
    }

    default:
      throw new Error(`Unknown MCP tool: ${name}`);
  }
}

// ============================================================================
// 3. MCP RESOURCES
// ============================================================================
const MCP_RESOURCES = [
  {
    uri: "slopes2://world/ascii-map",
    name: "Slopes 2 Live Multi-Scale ASCII/Unicode Viewport",
    description: "Real-time ASCII/Unicode viewport with WFC inspector strip and entity legend.",
    mimeType: "text/plain",
  },
  {
    uri: "slopes2://world/observation",
    name: "Slopes 2 Structured Civilization & Cosmic Telemetry",
    description: "JSON telemetry for Monolith, 4 societies, WFC zones, recursive objects, time crystals, and WASM science.",
    mimeType: "application/json",
  },
];

function handleResourceRead(uri) {
  if (uri === "slopes2://world/ascii-map") {
    return {
      contents: [
        {
          uri,
          mimeType: "text/plain",
          text: SlopesAI.renderAsciiMap(),
        },
      ],
    };
  }
  if (uri === "slopes2://world/observation") {
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(SlopesAI.getStructuredObservation(), null, 2),
        },
      ],
    };
  }
  throw new Error(`Resource not found: ${uri}`);
}

// ============================================================================
// 4. JSON-RPC 2.0 STDIO SERVER (Supports both Content-Length & Newline Framing)
// ============================================================================
function startMcpStdioServer() {
  let framingMode = null; // "content-length" | "newline"
  let inputBuffer = Buffer.alloc(0);

  function sendMessage(msgObj) {
    const json = JSON.stringify(msgObj);
    if (framingMode === "content-length") {
      const byteLen = Buffer.byteLength(json, "utf8");
      process.stdout.write(`Content-Length: ${byteLen}\r\n\r\n${json}`);
    } else {
      process.stdout.write(`${json}\n`);
    }
  }

  function handleRpcRequest(req) {
    if (!req || typeof req !== "object") return;
    const { id, method, params } = req;

    // Notifications have no id and expect no response
    if (id === undefined || id === null) {
      return;
    }

    try {
      switch (method) {
        case "initialize": {
          const clientProto = (params && params.protocolVersion) || "2024-11-05";
          sendMessage({
            jsonrpc: "2.0",
            id,
            result: {
              protocolVersion: clientProto,
              capabilities: {
                tools: { listChanged: false },
                resources: { subscribe: false, listChanged: false },
              },
              serverInfo: {
                name: "slopes2-mcp-server",
                version: "2.0.0",
                loadedEngineFiles: LOADED_ENGINE_FILES,
              },
            },
          });
          break;
        }

        case "ping": {
          sendMessage({ jsonrpc: "2.0", id, result: {} });
          break;
        }

        case "tools/list": {
          sendMessage({
            jsonrpc: "2.0",
            id,
            result: { tools: MCP_TOOLS },
          });
          break;
        }

        case "tools/call": {
          const toolName = params && params.name;
          const toolArgs = (params && params.arguments) || {};
          const result = handleToolCall(toolName, toolArgs);
          sendMessage({
            jsonrpc: "2.0",
            id,
            result,
          });
          break;
        }

        case "resources/list": {
          sendMessage({
            jsonrpc: "2.0",
            id,
            result: { resources: MCP_RESOURCES },
          });
          break;
        }

        case "resources/read": {
          const uri = params && params.uri;
          const result = handleResourceRead(uri);
          sendMessage({
            jsonrpc: "2.0",
            id,
            result,
          });
          break;
        }

        default: {
          sendMessage({
            jsonrpc: "2.0",
            id,
            error: {
              code: -32601,
              message: `Method not found: ${method}`,
            },
          });
        }
      }
    } catch (err) {
      sendMessage({
        jsonrpc: "2.0",
        id,
        error: {
          code: -32603,
          message: err && err.message ? err.message : String(err),
        },
      });
    }
  }

  function processBuffer() {
    while (inputBuffer.length > 0) {
      // Auto-detect framing from first non-whitespace bytes
      const preview = inputBuffer.toString("utf8", 0, Math.min(inputBuffer.length, 64));
      if (!framingMode) {
        const trimmedStart = preview.trimStart();
        if (!trimmedStart) return;
        if (/^Content-Length:/i.test(trimmedStart)) {
          framingMode = "content-length";
        } else {
          framingMode = "newline";
        }
      }

      if (framingMode === "content-length" || /^Content-Length:/i.test(preview.trimStart())) {
        let sepIdx = inputBuffer.indexOf("\r\n\r\n");
        let sepLen = 4;
        if (sepIdx === -1) {
          sepIdx = inputBuffer.indexOf("\n\n");
          sepLen = 2;
        }
        if (sepIdx === -1) return; // Wait for full header

        const headerStr = inputBuffer.toString("utf8", 0, sepIdx);
        const match = headerStr.match(/Content-Length:\s*(\d+)/i);
        if (!match) {
          inputBuffer = inputBuffer.slice(sepIdx + sepLen);
          continue;
        }
        const contentLen = parseInt(match[1], 10);
        const totalNeeded = sepIdx + sepLen + contentLen;
        if (inputBuffer.length < totalNeeded) return; // Wait for full body

        const bodyStr = inputBuffer.toString("utf8", sepIdx + sepLen, totalNeeded);
        inputBuffer = inputBuffer.slice(totalNeeded);
        try {
          const msg = JSON.parse(bodyStr);
          handleRpcRequest(msg);
        } catch (_e) {
          // Ignore malformed frame
        }
      } else {
        const nlIdx = inputBuffer.indexOf("\n");
        if (nlIdx === -1) return;
        const lineStr = inputBuffer.toString("utf8", 0, nlIdx).trim();
        inputBuffer = inputBuffer.slice(nlIdx + 1);
        if (!lineStr) continue;
        try {
          const msg = JSON.parse(lineStr);
          handleRpcRequest(msg);
        } catch (_e) {
          // Ignore malformed line
        }
      }
    }
  }

  process.stdin.on("data", (chunk) => {
    inputBuffer = Buffer.concat([inputBuffer, Buffer.from(chunk)]);
    processBuffer();
  });

  process.stdin.on("end", () => {
    processBuffer();
    process.exit(0);
  });
}

// ============================================================================
// 5. 15-TURN AUTONOMOUS AI SHOWCASE (--demo-agent)
// ============================================================================
function runDemoAgentMode() {
  console.log("================================================================================");
  console.log("  SLOPES 2 — 15-TURN AUTONOMOUS AI MONOLITH & COSMIC ENGINE SHOWCASE (--demo-agent)");
  console.log("  Loaded Engine Modules:", LOADED_ENGINE_FILES.join(", "));
  console.log("================================================================================\n");

  const scriptedShowcaseTurns = [
    { cmd: "look", note: "Initial multi-scale survey of Coastal Town, 7x7 Vats, 4 Civilizations & Tab-Forms" },
    { cmd: "tabform TAB-01 body status", note: "Inspect Embodied Tab-Form TAB-01 (CLAUDE-ROVER) Hardcore-Tab shell" },
    { cmd: "tabform TAB-01 body bus open", note: "Open Rooftop Passenger Bus on TAB-01 to board Orange Villagers" },
    { cmd: "tabform TAB-02 body perch open", note: "Deploy upper Bird Perches on TAB-02 for Seer Crows to land" },
    { cmd: "tabform TAB-01 claude --auto", note: "Run autonomous Claude Code robotic agent turn inside TAB-01" },
    { cmd: "rotate 3", note: "Rotate 5-fold non-Euclidean world 3 times -> exact horizontal mirror reverse (Facet 3/5)" },
    { cmd: "rotate 2", note: "Rotate 2 more times (5 total) -> returns to exact original 2D world (Facet 0/5)" },
    { cmd: "tamp", note: "Emit Sonic Tamp (K) shockwave to purify Black Goo & sever sticky webs" },
    { cmd: "pipe", note: "Lay Aether/Hyphae Energy & Compute Conduit linking Monolith to 7x7 Vat" },
    { cmd: "evolve deer 4096", note: "Run C/WASM Cervus Deer Scientist experiment (4096 trials)" },
    { cmd: "seep deer", note: "Collapse high-res Wave Function Collapse (WFC) mycelial masonry" },
    { cmd: "hypertime 100 5", note: "Ignite Chronos Time-Dilation Crystal at 100x acceleration" },
    { cmd: "enter vat", note: "Enter Recursive 7x7 Compute Vat Server Lake pocket world" },
    { cmd: "exit", note: "Exit Recursive Pocket World back to coastal macro-layer" },
    { cmd: "auto 3", note: "Delegate final 3 sub-steps to utility-scoring AI Monolith Oracle" },
  ];

  for (let i = 0; i < scriptedShowcaseTurns.length; i++) {
    const t = scriptedShowcaseTurns[i];
    const res = SlopesAI.executeCommand(t.cmd);
    console.log(`[TURN ${String(i + 1).padStart(2, "0")}/15] CMD: "${t.cmd}" — ${t.note}`);
    console.log(`  -> ${res.summary}`);
    if (i === 0 || i === 7 || i === 14) {
      console.log("");
      console.log(res.asciiMap);
      console.log("");
    }
  }

  const finalObs = SlopesAI.getStructuredObservation();
  console.log("=== FINAL STRUCTURED OBSERVATION TELEMETRY ===");
  console.log(JSON.stringify(finalObs, null, 2));
  process.exit(0);
}

// ============================================================================
// 6. INTERACTIVE TERMINAL CLI REPL (--cli)
// ============================================================================
function runInteractiveCli() {
  console.log(SlopesAI.renderAsciiMap());
  console.log("\nSLOPES 2 Interactive AI Terminal (--cli). Type 'help' for commands, 'quit' to exit.");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "slopes2> ",
  });

  rl.prompt();
  rl.on("line", (line) => {
    const trimmed = line.trim();
    if (trimmed === "quit" || trimmed === "exit-cli") {
      rl.close();
      process.exit(0);
      return;
    }
    if (trimmed) {
      const res = SlopesAI.executeCommand(trimmed);
      console.log(res.asciiMap);
      console.log(`\n> ${res.summary}`);
    }
    rl.prompt();
  });

  rl.on("close", () => {
    process.exit(0);
  });
}

// ============================================================================
// 7. ENTRYPOINT DISPATCH
// ============================================================================
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.includes("--demo-agent")) {
    runDemoAgentMode();
  } else if (args.includes("--cli")) {
    runInteractiveCli();
  } else {
    startMcpStdioServer();
  }
}

module.exports = {
  SlopesAI,
  MCP_TOOLS,
  MCP_RESOURCES,
  handleToolCall,
  handleResourceRead,
};
