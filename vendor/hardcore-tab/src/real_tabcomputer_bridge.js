/* ============================================================================
 * REAL TABCOMPUTER & CLAUDE CODE LAZY BRIDGE FOR HARDCORE-TAB / SLOPES 2
 * File: sim/real_tabcomputer_bridge.js
 *
 * Guarantees:
 *   1. ZERO page-load impact: nothing is fetched, booted, or mounted at startup.
 *      Tab-Forms (`TAB-01`, `TAB-02`, `TAB-03`) default to lightweight simulated
 *      mode so Slopes 2 loads instantaneously.
 *   2. On-Demand Real TabComputer OS (`./tabcomputer/index.html`) + Claude Code:
 *      When the player opens a Tab-Form and clicks `[LOGIN WITH CLAUDE]` or
 *      `[BOOT REAL LINUX]`, this module:
 *        - Opens a crisp Hardcore Hairline Claude Sign-In panel supporting both
 *          Anthropic OAuth 2.0 PKCE (`claude.com/cai/oauth/authorize` ->
 *          `https://tabcomputer.com/api/platform/v1/oauth/token`) and direct
 *          `sk-ant-...` API keys.
 *        - Lazily boots the real TabComputer Linux/POSIX runtime in an iframe
 *           only when requested.
 *        - Registers real `body` and `tabctl` POSIX commands inside
 *          `window.__tabcomputer.commands` (and `/usr/local/bin/body`) so when
 *          real Claude Code uses its `Bash` tool, it physically controls its
 *          Tab-Form robot chassis in Slopes 2!
 *        - Seeds `/home/user/AGENTS.md` and `/home/user/.claude/CLAUDE.md` in
 *          the real IndexedDB `FileSystem` (`window.__tabcomputer.fs`).
 *        - Streams live terminal buffer lines (`__tabcomputer.terminal.term`)
 *          into the Tab-Form's `micro4x6` in-sprite body display and the
 *          Hardcore-Tab window (plus an optional docked Live Xterm TUI view).
 * ============================================================================ */

(function (global) {
  "use strict";

  // Anthropic Claude Code OAuth 2.0 PKCE constants (from tabcomputer/src/claude-signin.ts)
  const CLIENT_ID = "9d1c250a-e61b-44d9-88ed-5944d1962f5e";
  const AUTHORIZE_URL = "https://claude.com/cai/oauth/authorize";
  const REDIRECT_URI = "https://platform.claude.com/oauth/code/callback";
  const TOKEN_PROXY_URL = "https://tabcomputer.com/api/platform/v1/oauth/token";
  const SCOPES =
    "org:create_api_key user:profile user:inference user:sessions:claude_code user:mcp_servers user:file_upload";

  const CLAUDE_CREDENTIALS_PATH = "/home/user/.claude/.credentials.json";
  const CLAUDE_CONFIG_PATH = "/home/user/.claude.json";
  const CLAUDE_SETTINGS_PATH = "/home/user/.claude/settings.json";

  const bridgeState = {
    booting: false,
    booted: false,
    bootError: null,
    iframe: null,
    tc: null, // window.__tabcomputer reference once booted
    activeTabFormId: "TAB-01",
    liveXtermVisible: false,
    signedInAccount: null, // { email, displayName, authType }
    pkcePending: null, // { verifier, state, startedAt }
    modalOpen: false,
    modalTargetTabId: null,
    modalStatusText: "",
    modalStatusColor: "#78ead4",
    syncTimer: null,
  };

  // ==========================================================================
  // 1. CRYPTOGRAPHIC PKCE HELPERS (WebCrypto SHA-256 base64url)
  // ==========================================================================
  function base64url(bytes) {
    let bin = "";
    for (let i = 0; i < bytes.length; i++) {
      bin += String.fromCharCode(bytes[i]);
    }
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  async function createPkceSession() {
    const verifierBytes = new Uint8Array(32);
    const stateBytes = new Uint8Array(32);
    crypto.getRandomValues(verifierBytes);
    crypto.getRandomValues(stateBytes);

    const verifier = base64url(verifierBytes);
    const state = base64url(stateBytes);
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
    const challenge = base64url(new Uint8Array(digest));

    const params = new URLSearchParams({
      code: "true",
      client_id: CLIENT_ID,
      response_type: "code",
      redirect_uri: REDIRECT_URI,
      scope: SCOPES,
      code_challenge: challenge,
      code_challenge_method: "S256",
      state: state,
    });

    const url = `${AUTHORIZE_URL}?${params.toString()}`;
    bridgeState.pkcePending = { verifier, state, url, startedAt: Date.now() };
    try {
      localStorage.setItem(
        "slopes2_claude_pkce",
        JSON.stringify({ verifier, state, startedAt: Date.now() })
      );
    } catch (_) {}
    return { url, verifier, state };
  }

  async function exchangePkceCode(rawInput) {
    const cleaned = String(rawInput || "")
      .trim()
      .replace(/^["']|["']$/g, "");
    if (!cleaned) throw new Error("Paste the code#state from Claude or an sk-ant-... API key.");

    let pending = bridgeState.pkcePending;
    if (!pending) {
      try {
        const saved = localStorage.getItem("slopes2_claude_pkce");
        if (saved) pending = JSON.parse(saved);
      } catch (_) {}
    }

    let code = cleaned;
    let state = pending ? pending.state : "";

    // Accept full callback URL, `code=...&state=...`, or `code#state`
    if (cleaned.includes("code=")) {
      try {
        const u = cleaned.startsWith("http")
          ? new URL(cleaned)
          : new URL("https://placeholder/?" + cleaned.replace(/^\?/, ""));
        code = u.searchParams.get("code") || code;
        state = u.searchParams.get("state") || (u.hash ? u.hash.slice(1) : state);
      } catch (_) {}
    } else if (cleaned.includes("#")) {
      const idx = cleaned.indexOf("#");
      code = cleaned.slice(0, idx).trim();
      state = cleaned.slice(idx + 1).trim();
    }

    if (!pending || !pending.verifier) {
      throw new Error("Click [1. OPEN CLAUDE.COM SIGN-IN PAGE] first so a PKCE verifier is generated.");
    }
    if (state && pending.state && state !== pending.state) {
      throw new Error("State mismatch — please use the code from the most recent sign-in tab.");
    }

    const resp = await fetch(TOKEN_PROXY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        code_verifier: pending.verifier,
        state: pending.state,
      }),
    });

    if (!resp.ok) {
      const detail = await resp.text().catch(() => "");
      throw new Error(`Token exchange failed (HTTP ${resp.status}): ${detail.slice(0, 140)}`);
    }

    const tok = await resp.json();
    if (!tok || !tok.access_token) {
      throw new Error("Token response missing access_token.");
    }

    const credentialsPayload = {
      claudeAiOauth: {
        accessToken: tok.access_token,
        refreshToken: tok.refresh_token || "",
        expiresAt: Date.now() + (tok.expires_in || 28800) * 1000,
        scopes: tok.scope ? String(tok.scope).split(" ") : SCOPES.split(" "),
      },
    };

    const oauthAccount = tok.account
      ? {
          accountUuid: tok.account.uuid,
          emailAddress: tok.account.email_address,
          organizationUuid: tok.organization ? tok.organization.uuid : undefined,
        }
      : undefined;

    try {
      localStorage.setItem("slopes2_claude_credentials", JSON.stringify(credentialsPayload));
      if (oauthAccount) {
        localStorage.setItem("slopes2_claude_account", JSON.stringify(oauthAccount));
      }
      localStorage.removeItem("slopes2_claude_pkce");
    } catch (_) {}

    bridgeState.pkcePending = null;
    bridgeState.signedInAccount = {
      email: (oauthAccount && oauthAccount.emailAddress) || "claude-oauth-user",
      authType: "oauth",
    };

    return { credentialsPayload, oauthAccount };
  }

  // ==========================================================================
  // 2. LAZY-BOOT REAL TABCOMPUTER RUNTIME (`./tabcomputer/index.html`)
  // ==========================================================================
  function getActiveTabForm() {
    if (!global.SlopesTabForms) return null;
    const forms = global.SlopesTabForms.tabForms || [];
    return (
      forms.find((t) => t.id === bridgeState.activeTabFormId) ||
      forms.find((t) => t.id === global.SlopesTabForms.state.selectedTabId) ||
      forms[0] ||
      null
    );
  }

  function ensureRealTabComputerBooted(targetTabId) {
    if (targetTabId) bridgeState.activeTabFormId = targetTabId;
    if (bridgeState.booted && bridgeState.tc) {
      return Promise.resolve(bridgeState.tc);
    }
    if (bridgeState._bootPromise) {
      return bridgeState._bootPromise;
    }

    bridgeState.booting = true;
    bridgeState.bootError = null;

    bridgeState._bootPromise = new Promise((resolve, reject) => {
      if (typeof document === "undefined") {
        bridgeState.booting = false;
        return reject(new Error("No DOM available"));
      }

      const screenDiv = document.getElementById("screen") || document.body;
      let iframe = document.getElementById("slopes2-real-tabcomputer-iframe");
      if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.id = "slopes2-real-tabcomputer-iframe";
        iframe.title = "Real TabComputer Linux Runtime";
        iframe.allow = "clipboard-read; clipboard-write; cross-origin-isolated";
        // Hidden offscreen by default while streaming into Hardcore Hairline pixels;
        // docked into the Hardcore-Tab window when `[LIVE XTERM TUI]` is toggled on!
        iframe.style.cssText = [
          "position:absolute",
          "left:-9999px",
          "top:-9999px",
          "width:560px",
          "height:340px",
          "border:1px solid #78ead4",
          "background:#040a0e",
          "z-index:12",
          "opacity:0",
          "pointer-events:none",
        ].join(";");
        iframe.src = "./tabcomputer/index.html?profile=shiro&ui=terminal&demo=1";
        screenDiv.appendChild(iframe);
      }
      bridgeState.iframe = iframe;

      let attempts = 0;
      const maxAttempts = 150; // up to 15s
      const poll = setInterval(async () => {
        attempts++;
        try {
          const cw = iframe.contentWindow;
          if (cw) {
            // Ensure API proxy calls inside the iframe route to https://tabcomputer.com
            cw.__TABCOMPUTER_ORIGIN__ = "https://tabcomputer.com";
          }
          if (cw && cw.__tabcomputer && cw.__tabcomputer.fs && cw.__tabcomputer.shell && cw.__tabcomputer.commands) {
            clearInterval(poll);
            const tc = cw.__tabcomputer;
            bridgeState.tc = tc;
            bridgeState.booting = false;
            bridgeState.booted = true;

            await wireRealTabComputerToSlopes(tc, cw);
            resolve(tc);
            return;
          }
        } catch (err) {
          // Wait until same-origin iframe finishes initializing
        }
        if (attempts >= maxAttempts) {
          clearInterval(poll);
          bridgeState.booting = false;
          bridgeState._bootPromise = null;
          const err = new Error("Timed out waiting for TabComputer kernel to initialize.");
          bridgeState.bootError = err.message;
          reject(err);
        }
      }, 100);
    });

    return bridgeState._bootPromise;
  }

  // ==========================================================================
  // 3. WIRE REAL TABCOMPUTER FILESYSTEM, `body`/`tabctl` COMMANDS & XTERM BUFFER
  // ==========================================================================
  async function wireRealTabComputerToSlopes(tc, cw) {
    const { fs, shell, commands, terminal } = tc;

    // Prefer pure-JS npm Claude Code build in browser (`CLAUDE_NATIVE=0`)
    shell.env["CLAUDE_NATIVE"] = "0";
    shell.env["FORCE_COLOR"] = "1";

    // Restore any saved credentials or API keys into the real TabComputer filesystem
    await syncCredentialsToRealFs(tc);

    // Register real `body` and `tabctl` POSIX commands inside TabComputer's CommandRegistry
    const executeSlopesActuator = async (ctx, cmdName) => {
      const envTabId = (ctx.env && ctx.env["TABFORM_ID"]) || bridgeState.activeTabFormId || "TAB-01";
      const forms = (global.SlopesTabForms && global.SlopesTabForms.tabForms) || [];
      const tf = forms.find((t) => t.id === envTabId) || getActiveTabForm();
      if (!tf || !tf.shell) {
        ctx.stderr += `${cmdName}: no active Tab-Form chassis found\n`;
        return 1;
      }
      const args = Array.isArray(ctx.args) ? ctx.args : [];
      const out = tf.shell.runBodyCommand(args);
      const cleanOut = String(out || "") + "\n";
      ctx.stdout += cleanOut;
      // Also refresh /home/user/AGENTS.md and /tmp/slopes2_status.json after every actuator step!
      void syncWorldContextToRealFs(tc, tf).catch(() => {});
      return 0;
    };

    const bodyCommandObj = {
      name: "body",
      description: "Control embodied Term-Form / Tab-Form robotic chassis in Slopes 2 (drive, smooth, thrust, goto, tentacle, arm, bus, perch, eject, say, build, sim, create, rotate)",
      exec: (ctx) => executeSlopesActuator(ctx, "body"),
    };
    const tabctlCommandObj = {
      name: "tabctl",
      description: "Alias for body: control embodied Term-Form / Tab-Form robotic chassis in Slopes 2",
      exec: (ctx) => executeSlopesActuator(ctx, "tabctl"),
    };
    const tentacleCommandObj = {
      name: "tentacle",
      description: "Control the 3 Matrix Sentinel-style biomechanical snake tentacles & 3-section conic mechanical flower trap (status, open, close, reach, grab, suck, drain, deposit, wave, coil)",
      exec: (ctx) => {
        const subArgs = Array.isArray(ctx.args) ? ctx.args : [];
        return executeSlopesActuator(Object.assign({}, ctx, { args: ["tentacle", ...subArgs] }), "tentacle");
      },
    };

    commands.register(bodyCommandObj);
    commands.register(tabctlCommandObj);
    commands.register(tentacleCommandObj);

    // Write executable PATH shims `/usr/local/bin/body`, `/usr/local/bin/tabctl`, and `/usr/local/bin/tentacle`
    try {
      await fs.mkdir("/usr/local/bin", { recursive: true });
      await fs.writeFile("/usr/local/bin/body", "#!/bin/sh\nbuiltin body \"$@\" 2>/dev/null || body \"$@\"\n");
      await fs.writeFile("/usr/local/bin/tabctl", "#!/bin/sh\nbuiltin tabctl \"$@\" 2>/dev/null || tabctl \"$@\"\n");
      await fs.writeFile("/usr/local/bin/tentacle", "#!/bin/sh\nbuiltin tentacle \"$@\" 2>/dev/null || body tentacle \"$@\"\n");
      if (typeof fs.chmod === "function") {
        await fs.chmod("/usr/local/bin/body", 0o755);
        await fs.chmod("/usr/local/bin/tabctl", 0o755);
        await fs.chmod("/usr/local/bin/tentacle", 0o755);
      }
    } catch (_) {}

    // Seed `/home/user/AGENTS.md`, `/home/user/.claude/CLAUDE.md`, and `/tmp/slopes2_status.json`
    const tf = getActiveTabForm();
    await syncWorldContextToRealFs(tc, tf);

    // Start periodic sync of xterm active buffer lines -> Tab-Form's in-game Hardcore Hairline display
    if (bridgeState.syncTimer) clearInterval(bridgeState.syncTimer);
    bridgeState.syncTimer = setInterval(() => {
      syncXtermBufferToTabForms();
    }, 120);

    // Print welcome banner inside real TabComputer terminal
    if (terminal && terminal.term) {
      terminal.term.writeln(
        "\r\n\x1b[96m[HARDCORE-TAB // REAL TABCOMPUTER OS ONLINE]\x1b[0m"
      );
      terminal.term.writeln(
        "\x1b[92m✓ Mounted real IndexedDB filesystem, POSIX shell & `body` / `tabctl` robotic actuators.\x1b[0m"
      );
      terminal.term.writeln(
        "\x1b[93m✓ Type `body status`, `body smooth 7`, `claude`, or any Linux command (`ls`, `node`, `git`, `debian`).\x1b[0m\r\n"
      );
    }
    syncXtermBufferToTabForms();
  }

  async function syncCredentialsToRealFs(tc) {
    if (!tc || !tc.fs) return;
    const { fs, shell } = tc;

    try {
      await fs.mkdir("/home/user/.claude", { recursive: true });
    } catch (_) {}

    // 1. Check saved OAuth PKCE credentials
    let credsRaw = null;
    let accountRaw = null;
    let apiKey = null;
    try {
      credsRaw = localStorage.getItem("slopes2_claude_credentials");
      accountRaw = localStorage.getItem("slopes2_claude_account");
      apiKey =
        localStorage.getItem("tabcomputer_anthropic_key") ||
        localStorage.getItem("slopes2_anthropic_key");
    } catch (_) {}

    if (credsRaw) {
      try {
        await fs.writeFile(CLAUDE_CREDENTIALS_PATH, credsRaw);
        const parsed = JSON.parse(credsRaw);
        if (parsed && parsed.claudeAiOauth && parsed.claudeAiOauth.accessToken) {
          const acct = accountRaw ? JSON.parse(accountRaw) : null;
          bridgeState.signedInAccount = {
            email: (acct && acct.emailAddress) || "claude-oauth",
            authType: "oauth",
          };
        }
      } catch (_) {}
    }

    if (apiKey) {
      shell.env["ANTHROPIC_API_KEY"] = apiKey;
      try {
        if (bridgeState.iframe && bridgeState.iframe.contentWindow) {
          bridgeState.iframe.contentWindow.localStorage.setItem("tabcomputer_anthropic_key", apiKey);
        }
      } catch (_) {}
      if (!bridgeState.signedInAccount) {
        bridgeState.signedInAccount = {
          email: "api-key (" + apiKey.slice(0, 10) + "...)",
          authType: "apikey",
        };
      }
    }

    // Also check if the real TabComputer already has credentials in its own IndexedDB
    if (!bridgeState.signedInAccount) {
      try {
        const existing = await fs.readFile(CLAUDE_CREDENTIALS_PATH, "utf8");
        if (existing) {
          const parsed = JSON.parse(existing);
          if (parsed && parsed.claudeAiOauth && parsed.claudeAiOauth.accessToken) {
            bridgeState.signedInAccount = { email: "claude-oauth", authType: "oauth" };
          }
        }
      } catch (_) {}
    }

    // Write `/home/user/.claude.json` and `/home/user/.claude/settings.json` so Claude Code skips onboarding dialogs
    try {
      let cfg = {};
      try {
        const prev = await fs.readFile(CLAUDE_CONFIG_PATH, "utf8");
        if (prev) cfg = JSON.parse(prev);
      } catch (_) {}
      if (accountRaw) {
        try {
          cfg.oauthAccount = JSON.parse(accountRaw);
        } catch (_) {}
      }
      cfg.theme = "dark";
      cfg.hasCompletedOnboarding = true;
      cfg.lastOnboardingVersion = "2.1.280";
      cfg.bypassPermissionsModeAccepted = true;
      cfg.numStartups = Math.max(Number(cfg.numStartups) || 0, 2);
      cfg.projects = cfg.projects || {};
      cfg.projects["/home/user"] = Object.assign({}, cfg.projects["/home/user"], {
        allowedTools: [],
        hasTrustDialogAccepted: true,
        hasCompletedProjectOnboarding: true,
      });
      await fs.writeFile(CLAUDE_CONFIG_PATH, JSON.stringify(cfg, null, 2));

      const settings = {
        $schema: "https://json.schemastore.org/claude-code-settings.json",
        theme: "dark",
        skipDangerousModePermissionPrompt: true,
      };
      await fs.writeFile(CLAUDE_SETTINGS_PATH, JSON.stringify(settings, null, 2));
    } catch (_) {}
  }

  async function syncWorldContextToRealFs(tc, tf) {
    if (!tc || !tc.fs) return;
    const ht = global.HardcoreTab;
    const worldCtx =
      global.SlopesTabForms && global.SlopesTabForms.state
        ? global.SlopesTabForms.state.lastWorldContext
        : global;
    const targetTf = tf || getActiveTabForm();
    if (!ht || !targetTf) return;

    try {
      const agentsMd = ht.buildWorldAgentsMd(targetTf, worldCtx);
      const claudeMd = ht.buildClaudeMd(targetTf);
      await tc.fs.mkdir("/home/user/.claude", { recursive: true });
      await tc.fs.mkdir("/tmp", { recursive: true });
      await tc.fs.writeFile("/home/user/AGENTS.md", agentsMd);
      await tc.fs.writeFile("/home/user/.claude/CLAUDE.md", claudeMd);
      if (targetTf.shell && typeof targetTf.shell.getStatusJson === "function") {
        await tc.fs.writeFile(
          "/tmp/slopes2_status.json",
          JSON.stringify(targetTf.shell.getStatusJson(), null, 2)
        );
      }
    } catch (_) {}
  }

  function syncXtermBufferToTabForms() {
    if (!bridgeState.booted || !bridgeState.tc || !bridgeState.tc.terminal) return;
    const term = bridgeState.tc.terminal.term;
    if (!term || !term.buffer || !term.buffer.active) return;

    const buf = term.buffer.active;
    const extracted = [];
    const totalRows = buf.length || 0;
    const startRow = Math.max(0, totalRows - 60);

    for (let i = startRow; i < totalRows; i++) {
      const lineObj = buf.getLine(i);
      if (!lineObj) continue;
      const str = lineObj.translateToString(true);
      if (str && str.trim().length > 0) {
        extracted.push(str);
      }
    }

    if (extracted.length === 0) return;

    const forms = (global.SlopesTabForms && global.SlopesTabForms.tabForms) || [];
    for (let i = 0; i < forms.length; i++) {
      const tf = forms[i];
      if (tf.realTabActive && tf.shell && Array.isArray(tf.shell.lines)) {
        tf.shell.lines.length = 0;
        const tail = extracted.slice(-36);
        for (let j = 0; j < tail.length; j++) {
          tf.shell.lines.push(tail[j]);
        }
      }
    }
  }

  // ==========================================================================
  // 4. ACTIVATE REAL TABCOMPUTER ON A TAB-FORM & FORWARD COMMANDS / KEYS
  // ==========================================================================
  async function activateRealModeForTabForm(tabId, launchClaudeImmediately) {
    const forms = (global.SlopesTabForms && global.SlopesTabForms.tabForms) || [];
    const tf = forms.find((t) => t.id === tabId) || getActiveTabForm();
    if (!tf) return null;

    bridgeState.activeTabFormId = tf.id;
    tf.realTabConnecting = true;
    if (tf.shell && typeof tf.shell.println === "function") {
      tf.shell.println(
        `\x1b[96m[real-tabcomputer] Booting real browser Linux kernel & IndexedDB FS for ${tf.id}...\x1b[0m`
      );
    }

    try {
      const tc = await ensureRealTabComputerBooted(tf.id);
      tf.realTabConnecting = false;
      tf.realTabActive = true;
      tf.autoMode = false; // Real TabComputer / Claude Code is now in control of this Tab-Form!
      tc.shell.env["TABFORM_ID"] = tf.id;
      await syncWorldContextToRealFs(tc, tf);

      if (launchClaudeImmediately) {
        sendCommandToRealTabComputer(
          tf.id,
          'claude --npm --dangerously-skip-permissions'
        );
      } else {
        sendCommandToRealTabComputer(tf.id, "body status");
      }
      return tc;
    } catch (err) {
      tf.realTabConnecting = false;
      if (tf.shell && typeof tf.shell.println === "function") {
        tf.shell.println(`\x1b[91m[real-tabcomputer] Boot error: ${err.message}\x1b[0m`);
      }
      throw err;
    }
  }

  function deactivateRealModeForTabForm(tabId) {
    const forms = (global.SlopesTabForms && global.SlopesTabForms.tabForms) || [];
    const tf = forms.find((t) => t.id === tabId) || getActiveTabForm();
    if (!tf) return;
    tf.realTabActive = false;
    tf.realTabConnecting = false;
    tf.autoMode = true;
    setLiveXtermVisible(false);
    if (tf.shell && typeof tf.shell.println === "function") {
      tf.shell.println(`\x1b[93m[${tf.id}] Returned to lightweight Simulated Mode.\x1b[0m`);
    }
  }

  function sendCommandToRealTabComputer(tabId, cmdStr) {
    const cmd = String(cmdStr || "").trim();
    if (!cmd) return;
    bridgeState.activeTabFormId = tabId || bridgeState.activeTabFormId;

    ensureRealTabComputerBooted(bridgeState.activeTabFormId)
      .then(async (tc) => {
        const forms = (global.SlopesTabForms && global.SlopesTabForms.tabForms) || [];
        const tf = forms.find((t) => t.id === bridgeState.activeTabFormId) || getActiveTabForm();
        if (tf) {
          tc.shell.env["TABFORM_ID"] = tf.id;
          await syncWorldContextToRealFs(tc, tf);
        }

        // If the terminal has an active stdin passthrough (e.g. interactive `claude` session),
        // feed the line + CR directly into the PTY/passthrough; otherwise execute via terminal/shell!
        if (tc.terminal && typeof tc.terminal.isPassthroughActive === "function" && tc.terminal.isPassthroughActive()) {
          tc.terminal.term.paste(cmd + "\r");
        } else if (tc.terminal && typeof tc.terminal.enterLine === "function") {
          tc.terminal.enterLine(cmd);
        } else if (tc.shell) {
          await tc.shell.execute(
            cmd,
            (out) => {
              if (tc.terminal) tc.terminal.writeOutput(out.replace(/\n/g, "\r\n"));
            },
            (err) => {
              if (tc.terminal) tc.terminal.writeOutput(err.replace(/\n/g, "\r\n"));
            }
          );
        }
        setTimeout(syncXtermBufferToTabForms, 60);
      })
      .catch(() => {});
  }

  function setLiveXtermVisible(visible, rectPx) {
    bridgeState.liveXtermVisible = Boolean(visible);
    const iframe = bridgeState.iframe;
    if (!iframe) return;

    if (!bridgeState.liveXtermVisible) {
      iframe.style.left = "-9999px";
      iframe.style.top = "-9999px";
      iframe.style.opacity = "0";
      iframe.style.pointerEvents = "none";
      return;
    }

    // Position the real xterm.js iframe directly inside the Hardcore-Tab terminal viewport!
    const screenDiv = document.getElementById("screen");
    if (screenDiv && rectPx) {
      const sRect = screenDiv.getBoundingClientRect();
      const scaleX = sRect.width / 840;
      const scaleY = sRect.height / 525;
      iframe.style.left = Math.round(rectPx.x * scaleX) + "px";
      iframe.style.top = Math.round(rectPx.y * scaleY) + "px";
      iframe.style.width = Math.round(rectPx.w * scaleX) + "px";
      iframe.style.height = Math.round(rectPx.h * scaleY) + "px";
    } else {
      iframe.style.left = "6%";
      iframe.style.top = "14%";
      iframe.style.width = "68%";
      iframe.style.height = "68%";
    }
    iframe.style.opacity = "1";
    iframe.style.pointerEvents = "auto";
    try {
      iframe.focus();
      if (iframe.contentWindow) {
        iframe.contentWindow.focus();
        iframe.contentWindow.postMessage({ type: "shiro-focus-terminal" }, "*");
        if (bridgeState.tc && bridgeState.tc.terminal && bridgeState.tc.terminal.fitAddon) {
          bridgeState.tc.terminal.fitAddon.fit();
        }
      }
    } catch (_) {}
  }

  // ==========================================================================
  // 5. HARDCORE HAIRLINE CLAUDE SIGN-IN MODAL (1:1 DEVICE-PIXEL TUI CANVAS)
  // ==========================================================================
  let modalCanvas = null;
  let modalInputBuf = "";
  let modalHitBoxes = [];
  let modalHoverAction = null;
  let modalAnimFrame = 0;

  function setModalStatus(msg, color) {
    bridgeState.modalStatusText = msg || "";
    bridgeState.modalStatusColor = color || "#78ead4";
    renderClaudeSignInCanvas();
  }

  function renderClaudeSignInCanvas() {
    if (!modalCanvas || !bridgeState.modalOpen) return;
    const HT = global.HardcoreTab;
    if (!HT) return;
    const dpr = Math.max(1, global.devicePixelRatio || 1);
    const parent = modalCanvas.parentElement || document.body;
    const cssW = Math.min(720, Math.max(320, (parent.clientWidth || 720) - 16));
    const cssH = Math.min(430, Math.max(290, (parent.clientHeight || 480) - 20));
    const devW = Math.round(cssW * dpr);
    const devH = Math.round(cssH * dpr);
    if (modalCanvas.width !== devW || modalCanvas.height !== devH) {
      modalCanvas.width = devW;
      modalCanvas.height = devH;
      modalCanvas.style.width = cssW + "px";
      modalCanvas.style.height = cssH + "px";
    }
    const ctx = modalCanvas.getContext("2d");
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingEnabled = false;

    const font = HT.HardcoreTabFont.getFont("h12x26");
    const cw = font.width;
    const ch = font.height;
    modalHitBoxes = [];

    // Outer obsidian/amber TUI terminal frame
    ctx.fillStyle = "rgba(4, 9, 13, 0.97)";
    ctx.fillRect(0, 0, devW, devH);
    ctx.strokeStyle = "#ffd43b";
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, devW - 1, devH - 1);
    ctx.strokeStyle = "#3b2c0a";
    ctx.strokeRect(2.5, 2.5, devW - 5, devH - 5);

    // Header bar
    const hdrH = ch + 10;
    ctx.fillStyle = "#141005";
    ctx.fillRect(3, 3, devW - 6, hdrH);
    ctx.fillStyle = "#ffd43b";
    ctx.fillRect(3, 3 + hdrH, devW - 6, 1);

    const targetId = bridgeState.modalTargetTabId || "TAB-01";
    HT.HardcoreTabRenderer.drawCanvasText(
      ctx,
      `╔═ HARDCORE-TAB // CLAUDE SIGN-IN (${targetId} REAL TABCOMPUTER OS) ═╗`,
      12,
      8,
      "#ffd43b",
      "h12x26"
    );

    // Close [ESC X] button
    const closeLabel = "[ESC X]";
    const closeW = closeLabel.length * cw + 14;
    const closeX = devW - closeW - 10;
    const closeY = 6;
    const closeH = ch + 4;
    ctx.fillStyle = modalHoverAction === "close" ? "#2d1014" : "#180b0e";
    ctx.fillRect(closeX, closeY, closeW, closeH);
    ctx.strokeStyle = "#ff8787";
    ctx.strokeRect(closeX + 0.5, closeY + 0.5, closeW - 1, closeH - 1);
    HT.HardcoreTabRenderer.drawCanvasText(ctx, closeLabel, closeX + 7, closeY + 2, "#ff8787", "h12x26");
    modalHitBoxes.push({ x: closeX, y: closeY, w: closeW, h: closeH, action: "close" });

    let curY = hdrH + 14;
    HT.HardcoreTabRenderer.drawCanvasText(
      ctx,
      `├─ Connect ${targetId} to real in-browser Linux running @anthropic-ai/claude-code`,
      14,
      curY,
      "#d8f4ee",
      "h12x26"
    );
    curY += ch + 8;

    // Step 1 box
    const boxX = 12;
    const boxW = devW - 24;
    const step1H = ch * 2 + 24;
    ctx.fillStyle = "#081318";
    ctx.fillRect(boxX, curY, boxW, step1H);
    ctx.strokeStyle = "#2b5260";
    ctx.strokeRect(boxX + 0.5, curY + 0.5, boxW - 1, step1H - 1);
    HT.HardcoreTabRenderer.drawCanvasText(
      ctx,
      "STEP 1: AUTHORIZE WITH CLAUDE ACCOUNT (OAUTH S256 PKCE)",
      boxX + 10,
      curY + 6,
      "#ffd43b",
      "h12x26"
    );

    const btn1Label = "[ 1. OPEN CLAUDE.COM SIGN-IN PAGE -> ]";
    const btn1W = Math.min(boxW - 20, btn1Label.length * cw + 20);
    const btn1X = boxX + 10;
    const btn1Y = curY + ch + 10;
    const btn1H = ch + 6;
    ctx.fillStyle = modalHoverAction === "oauth_open" ? "#2b2208" : "#1a1405";
    ctx.fillRect(btn1X, btn1Y, btn1W, btn1H);
    ctx.strokeStyle = "#ffd43b";
    ctx.strokeRect(btn1X + 0.5, btn1Y + 0.5, btn1W - 1, btn1H - 1);
    HT.HardcoreTabRenderer.drawCanvasText(ctx, btn1Label, btn1X + 10, btn1Y + 3, "#ffd43b", "h12x26");
    modalHitBoxes.push({ x: btn1X, y: btn1Y, w: btn1W, h: btn1H, action: "oauth_open" });

    curY += step1H + 10;

    // Step 2 box
    const step2H = ch * 3 + 38;
    ctx.fillStyle = "#081318";
    ctx.fillRect(boxX, curY, boxW, step2H);
    ctx.strokeStyle = "#2b5260";
    ctx.strokeRect(boxX + 0.5, curY + 0.5, boxW - 1, step2H - 1);
    HT.HardcoreTabRenderer.drawCanvasText(
      ctx,
      "STEP 2: PASTE CLAUDE CODE (code#state) OR API KEY (sk-ant-...)",
      boxX + 10,
      curY + 6,
      "#69db7c",
      "h12x26"
    );

    // Input field + [PASTE] button
    const pasteBtnLabel = "[PASTE]";
    const pasteBtnW = pasteBtnLabel.length * cw + 16;
    const inpX = boxX + 10;
    const inpY = curY + ch + 10;
    const inpW = boxW - 28 - pasteBtnW;
    const inpH = ch + 6;
    ctx.fillStyle = "#03070a";
    ctx.fillRect(inpX, inpY, inpW, inpH);
    ctx.strokeStyle = "#78ead4";
    ctx.strokeRect(inpX + 0.5, inpY + 0.5, inpW - 1, inpH - 1);
    const maxChars = Math.max(10, Math.floor((inpW - 16) / cw));
    const shownInput = modalInputBuf
      ? modalInputBuf.slice(-maxChars) + "█"
      : "Press Ctrl+V / Cmd+V or click [PASTE] to insert code#state...";
    HT.HardcoreTabRenderer.drawCanvasText(
      ctx,
      shownInput,
      inpX + 8,
      inpY + 3,
      modalInputBuf ? "#ffffff" : "#527a84",
      "h12x26"
    );

    const pasteX = inpX + inpW + 8;
    ctx.fillStyle = modalHoverAction === "paste_clip" ? "#16343c" : "#0c2028";
    ctx.fillRect(pasteX, inpY, pasteBtnW, inpH);
    ctx.strokeStyle = "#78ead4";
    ctx.strokeRect(pasteX + 0.5, inpY + 0.5, pasteBtnW - 1, inpH - 1);
    HT.HardcoreTabRenderer.drawCanvasText(ctx, pasteBtnLabel, pasteX + 8, inpY + 3, "#78ead4", "h12x26");
    modalHitBoxes.push({ x: pasteX, y: inpY, w: pasteBtnW, h: inpH, action: "paste_clip" });

    // Action buttons row
    const actY = inpY + inpH + 8;
    const actH = ch + 6;
    const completeLabel = "[ 2. SIGN IN & LAUNCH CLAUDE ]";
    const completeW = completeLabel.length * cw + 18;
    ctx.fillStyle = modalHoverAction === "complete_login" ? "#143c2c" : "#0b241a";
    ctx.fillRect(inpX, actY, completeW, actH);
    ctx.strokeStyle = "#69db7c";
    ctx.strokeRect(inpX + 0.5, actY + 0.5, completeW - 1, actH - 1);
    HT.HardcoreTabRenderer.drawCanvasText(ctx, completeLabel, inpX + 9, actY + 3, "#69db7c", "h12x26");
    modalHitBoxes.push({ x: inpX, y: actY, w: completeW, h: actH, action: "complete_login" });

    const linuxLabel = "[ BOOT LINUX SHELL ONLY ]";
    const linuxW = linuxLabel.length * cw + 18;
    const linuxX = inpX + completeW + 10;
    if (linuxX + linuxW < boxX + boxW - 4) {
      ctx.fillStyle = modalHoverAction === "boot_linux" ? "#16343c" : "#0c2028";
      ctx.fillRect(linuxX, actY, linuxW, actH);
      ctx.strokeStyle = "#78ead4";
      ctx.strokeRect(linuxX + 0.5, actY + 0.5, linuxW - 1, actH - 1);
      HT.HardcoreTabRenderer.drawCanvasText(ctx, linuxLabel, linuxX + 9, actY + 3, "#78ead4", "h12x26");
      modalHitBoxes.push({ x: linuxX, y: actY, w: linuxW, h: actH, action: "boot_linux" });
    }

    curY += step2H + 10;
    // Status line
    HT.HardcoreTabRenderer.drawCanvasText(
      ctx,
      "╚═ STATUS: " + (bridgeState.modalStatusText || "Ready."),
      14,
      curY,
      bridgeState.modalStatusColor || "#78ead4",
      "h12x26"
    );
  }

  function openClaudeSignInModal(tabId) {
    const targetId =
      tabId ||
      (global.SlopesTabForms && global.SlopesTabForms.state
        ? global.SlopesTabForms.state.selectedTabId
        : "TAB-01");
    bridgeState.modalTargetTabId = targetId;
    bridgeState.modalOpen = true;

    void ensureRealTabComputerBooted(targetId).catch(() => {});

    if (typeof document === "undefined") return;
    const screenDiv = document.getElementById("screen") || document.body;

    if (!modalCanvas) {
      modalCanvas = document.createElement("canvas");
      modalCanvas.id = "hardcore-claude-signin-canvas";
      modalCanvas.style.cssText = [
        "position:absolute",
        "left:50%",
        "top:50%",
        "transform:translate(-50%,-50%)",
        "z-index:35",
        "image-rendering:pixelated",
        "cursor:default",
      ].join(";");
      screenDiv.appendChild(modalCanvas);

      const getCanvasDevPos = (e) => {
        const rect = modalCanvas.getBoundingClientRect();
        const dpr = Math.max(1, global.devicePixelRatio || 1);
        return {
          dx: (e.clientX - rect.left) * dpr,
          dy: (e.clientY - rect.top) * dpr,
        };
      };

      modalCanvas.addEventListener("pointermove", (e) => {
        if (!bridgeState.modalOpen) return;
        const { dx, dy } = getCanvasDevPos(e);
        let hit = null;
        for (let i = modalHitBoxes.length - 1; i >= 0; i--) {
          const b = modalHitBoxes[i];
          if (dx >= b.x && dx <= b.x + b.w && dy >= b.y && dy <= b.y + b.h) {
            hit = b.action;
            break;
          }
        }
        if (hit !== modalHoverAction) {
          modalHoverAction = hit;
          modalCanvas.style.cursor = hit ? "pointer" : "default";
          renderClaudeSignInCanvas();
        }
      });

      modalCanvas.addEventListener("pointerdown", async (e) => {
        if (!bridgeState.modalOpen) return;
        e.stopPropagation();
        e.preventDefault();
        const { dx, dy } = getCanvasDevPos(e);
        let hit = null;
        for (let i = modalHitBoxes.length - 1; i >= 0; i--) {
          const b = modalHitBoxes[i];
          if (dx >= b.x && dx <= b.x + b.w && dy >= b.y && dy <= b.y + b.h) {
            hit = b.action;
            break;
          }
        }
        if (hit === "close") {
          closeClaudeSignInModal();
        } else if (hit === "oauth_open") {
          try {
            setModalStatus("Generating S256 PKCE challenge & opening claude.com...", "#ffd43b");
            const { url } = await createPkceSession();
            window.open(url, "_blank", "noopener,noreferrer");
            setModalStatus("Opened claude.com! Authorize and press Ctrl+V / [PASTE].", "#69db7c");
          } catch (err) {
            setModalStatus("Error starting PKCE: " + err.message, "#ff8787");
          }
        } else if (hit === "paste_clip") {
          try {
            if (navigator.clipboard && navigator.clipboard.readText) {
              const clip = await navigator.clipboard.readText();
              if (clip) {
                modalInputBuf = clip.trim();
                if (global.SlopesAudio && global.SlopesAudio.playDumbtermTypeClick) {
                  global.SlopesAudio.playDumbtermTypeClick("V", 0);
                }
                renderClaudeSignInCanvas();
              }
            }
          } catch (_) {
            setModalStatus("Press Ctrl+V or Cmd+V on keyboard to paste code#state.", "#ffd43b");
          }
        } else if (hit === "complete_login") {
          void handleCompleteSignInClick();
        } else if (hit === "boot_linux") {
          const tId = bridgeState.modalTargetTabId || "TAB-01";
          setModalStatus(`Activating real TabComputer Linux OS on ${tId}...`, "#78ead4");
          try {
            await activateRealModeForTabForm(tId, false);
            closeClaudeSignInModal();
          } catch (err) {
            setModalStatus("Boot failed: " + err.message, "#ff8787");
          }
        }
      });

      window.addEventListener("paste", (e) => {
        if (!bridgeState.modalOpen) return;
        const pasted = (e.clipboardData || window.clipboardData)?.getData("text");
        if (pasted) {
          e.preventDefault();
          e.stopPropagation();
          modalInputBuf = pasted.trim();
          if (global.SlopesAudio && global.SlopesAudio.playDumbtermTypeClick) {
            global.SlopesAudio.playDumbtermTypeClick("V", 0);
          }
          renderClaudeSignInCanvas();
        }
      });

      window.addEventListener(
        "keydown",
        (e) => {
          if (!bridgeState.modalOpen) return;
          if (e.key === "Escape") {
            e.preventDefault();
            e.stopPropagation();
            closeClaudeSignInModal();
            return;
          }
          if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            void handleCompleteSignInClick();
            return;
          }
          if (e.key === "Backspace") {
            e.preventDefault();
            e.stopPropagation();
            if (modalInputBuf.length > 0) {
              const delCh = modalInputBuf[modalInputBuf.length - 1];
              modalInputBuf = modalInputBuf.slice(0, -1);
              if (global.SlopesAudio && global.SlopesAudio.playDumbtermDeleteGhost) {
                global.SlopesAudio.playDumbtermDeleteGhost(delCh, 0);
              }
            }
            renderClaudeSignInCanvas();
            return;
          }
          if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") {
            // Let the `paste` listener handle clipboard text
            return;
          }
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            e.stopPropagation();
            modalInputBuf += e.key;
            if (global.SlopesAudio && global.SlopesAudio.playDumbtermTypeClick) {
              global.SlopesAudio.playDumbtermTypeClick(e.key, 0);
            }
            renderClaudeSignInCanvas();
          }
        },
        true
      );
    }

    modalCanvas.style.display = "block";
    if (bridgeState.signedInAccount) {
      setModalStatus(
        `Signed in (${bridgeState.signedInAccount.email}). Click [2. SIGN IN & LAUNCH CLAUDE]`,
        "#69db7c"
      );
    } else {
      setModalStatus("Step 1: Open claude.com sign-in page, or paste sk-ant-... key.", "#78ead4");
    }
    renderClaudeSignInCanvas();
  }

  function closeClaudeSignInModal() {
    bridgeState.modalOpen = false;
    if (modalCanvas) {
      modalCanvas.style.display = "none";
    }
  }

  async function handleCompleteSignInClick() {
    const raw = (modalInputBuf || "").trim();
    const tId = bridgeState.modalTargetTabId || "TAB-01";

    try {
      if (!raw && bridgeState.signedInAccount) {
        setModalStatus(`Launching real Claude Code on ${tId}...`, "#69db7c");
        await activateRealModeForTabForm(tId, true);
        closeClaudeSignInModal();
        return;
      }

      if (!raw) {
        setModalStatus("Paste code#state from Claude or sk-ant-... API key first.", "#ffd43b");
        return;
      }

      if (raw.startsWith("sk-ant-")) {
        setModalStatus("Saving Anthropic API Key & booting real Claude Code...", "#69db7c");
        try {
          localStorage.setItem("tabcomputer_anthropic_key", raw);
          localStorage.setItem("slopes2_anthropic_key", raw);
        } catch (_) {}
        bridgeState.signedInAccount = {
          email: "api-key (" + raw.slice(0, 10) + "...)",
          authType: "apikey",
        };
        const tc = await ensureRealTabComputerBooted(tId);
        await syncCredentialsToRealFs(tc);
        await activateRealModeForTabForm(tId, true);
        modalInputBuf = "";
        closeClaudeSignInModal();
        return;
      }

      setModalStatus("Exchanging OAuth PKCE code with Claude platform...", "#ffd43b");
      await exchangePkceCode(raw);
      setModalStatus("OAuth token saved! Booting real Claude Code in TabComputer...", "#69db7c");
      const tc = await ensureRealTabComputerBooted(tId);
      await syncCredentialsToRealFs(tc);
      await activateRealModeForTabForm(tId, true);
      modalInputBuf = "";
      closeClaudeSignInModal();
    } catch (err) {
      setModalStatus(err.message || String(err), "#ff8787");
    }
  }

  const RealTabComputerBridge = {
    state: bridgeState,
    createPkceSession,
    exchangePkceCode,
    ensureRealTabComputerBooted,
    activateRealModeForTabForm,
    deactivateRealModeForTabForm,
    sendCommandToRealTabComputer,
    setLiveXtermVisible,
    openClaudeSignInModal,
    closeClaudeSignInModal,
    syncXtermBufferToTabForms,
  };

  global.RealTabComputerBridge = RealTabComputerBridge;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = RealTabComputerBridge;
  }
})(typeof window !== "undefined" ? window : globalThis);
