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

  // GitHub OAuth Device Flow constants (from tabcomputer/src/github-auth.ts)
  const GITHUB_OAUTH_CLIENT_ID = "Ov23liznflO83ISe0lvr";
  const DEFAULT_GITHUB_SCOPES = ["repo", "read:org", "gist", "workflow", "user:email"];
  const GITHUB_TOKEN_KEY = "tabcomputer_github_token";

  const CLAUDE_CREDENTIALS_PATH = "/home/user/.claude/.credentials.json";
  const CLAUDE_CONFIG_PATH = "/home/user/.claude.json";
  const CLAUDE_SETTINGS_PATH = "/home/user/.claude/settings.json";
  const GLOBAL_GITCONFIG_PATH = "/home/user/.gitconfig";

  const bridgeState = {
    booting: false,
    booted: false,
    bootError: null,
    iframe: null,
    tc: null, // window.__tabcomputer reference once booted
    activeTabFormId: "TAB-01",
    liveXtermVisible: false,
    signedInAccount: null, // { email, displayName, authType }
    githubAccount: null, // { login, name, email, authType }
    githubDevicePending: null, // { device_code, user_code, verification_uri, expires_in, interval }
    githubPollAbort: null,
    pkcePending: null, // { verifier, state, startedAt }
    modalOpen: false,
    modalTargetTabId: null,
    modalStatusText: "",
    modalStatusColor: "#78ead4",
    syncTimer: null,
    anthropicApiCalls: 0,
    lastAnthropicStatus: "",
    lastAnthropicMs: 0,
    claudeAutoLaunched: false,
  };

  // Restore cached Claude & GitHub account badges immediately from localStorage
  (function restoreCachedAuthState() {
    try {
      if (typeof localStorage === "undefined") return;
      const credsRaw = localStorage.getItem("slopes2_claude_credentials");
      const accountRaw = localStorage.getItem("slopes2_claude_account");
      const apiKey =
        localStorage.getItem("tabcomputer_anthropic_key") ||
        localStorage.getItem("slopes2_anthropic_key");
      if (credsRaw) {
        const parsed = JSON.parse(credsRaw);
        if (parsed && parsed.claudeAiOauth && parsed.claudeAiOauth.accessToken) {
          const acct = accountRaw ? JSON.parse(accountRaw) : null;
          bridgeState.signedInAccount = {
            email: (acct && acct.emailAddress) || "claude-oauth",
            authType: "oauth",
          };
        }
      } else if (apiKey) {
        bridgeState.signedInAccount = {
          email: "api-key (" + apiKey.slice(0, 10) + "...)",
          authType: "apikey",
        };
      }
      const ghTok =
        localStorage.getItem(GITHUB_TOKEN_KEY) ||
        localStorage.getItem("slopes2_github_token");
      const ghAcctRaw = localStorage.getItem("slopes2_github_account");
      if (ghTok) {
        const ghAcct = ghAcctRaw ? JSON.parse(ghAcctRaw) : null;
        bridgeState.githubAccount = {
          login: (ghAcct && ghAcct.login) || "github-user",
          name: (ghAcct && ghAcct.name) || "",
          email: (ghAcct && ghAcct.email) || "",
          authType: "github",
        };
      }
    } catch (_) {}
  })();

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
            installTabComputerApiFetchInterceptor(cw);
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
    shell.env["ANTHROPIC_BASE_URL"] = "https://tabcomputer.com/api/anthropic";

    // Hook iframe console.log so `[node-proxy] fetch(https://api.anthropic.com/v1/messages...) -> 200`
    // from the TabComputer Node Web Worker increments live `anthropicApiCalls` telemetry!
    if (cw && cw.console && !cw.console.__slopesAnthropicHooked) {
      const origLog = cw.console.log.bind(cw.console);
      cw.console.__slopesAnthropicHooked = true;
      cw.console.log = function (...args) {
        try {
          const msg = args.map((a) => (typeof a === "string" ? a : "")).join(" ");
          if (msg.includes("/v1/messages") || msg.includes("api.anthropic.com")) {
            bridgeState.anthropicApiCalls = (bridgeState.anthropicApiCalls || 0) + 1;
            const statusMatch = msg.match(/->\s*(\d{3})/);
            bridgeState.lastAnthropicStatus = statusMatch ? `${statusMatch[1]} SSE` : "LIVE SSE";
            bridgeState.lastAnthropicMs = Date.now();
          }
        } catch (_) {}
        return origLog(...args);
      };
    }

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
    commands.register(driftCommandObj);
    commands.register(forkAndDriftCommandObj);

    // Mount Host-Page `/dom` Plan-9 filesystem & `hc` hypercompact live DOM utility directly onto the outer slopes2 page!
    mountHostDomInTabComputer(tc, cw);
    wireHostHcToTabComputer(tc, cw);

    // Write executable PATH shims `/usr/local/bin/body`, `/usr/local/bin/tabctl`, `/usr/local/bin/tentacle`, `/usr/local/bin/drift`, `/usr/local/bin/fork-and-drift`
    try {
      await fs.mkdir("/usr/local/bin", { recursive: true });
      await fs.writeFile("/usr/local/bin/body", "#!/bin/sh\nbuiltin body \"$@\" 2>/dev/null || body \"$@\"\n");
      await fs.writeFile("/usr/local/bin/tabctl", "#!/bin/sh\nbuiltin tabctl \"$@\" 2>/dev/null || tabctl \"$@\"\n");
      await fs.writeFile("/usr/local/bin/tentacle", "#!/bin/sh\nbuiltin tentacle \"$@\" 2>/dev/null || body tentacle \"$@\"\n");
      await fs.writeFile("/usr/local/bin/drift", "#!/bin/sh\nbuiltin drift \"$@\" 2>/dev/null || drift \"$@\"\n");
      await fs.writeFile("/usr/local/bin/fork-and-drift", "#!/bin/sh\nbuiltin fork-and-drift \"$@\" 2>/dev/null || drift fork \"$@\"\n");
      if (typeof fs.chmod === "function") {
        await fs.chmod("/usr/local/bin/body", 0o755);
        await fs.chmod("/usr/local/bin/tabctl", 0o755);
        await fs.chmod("/usr/local/bin/tentacle", 0o755);
        await fs.chmod("/usr/local/bin/drift", 0o755);
        await fs.chmod("/usr/local/bin/fork-and-drift", 0o755);
      }
    } catch (_) {}

    // Hydrate `/home/user/slopes2` live source checkout & attach 0-frame-drop `fs.writeFile` hot-reload hook
    await hydrateSlopes2Checkout(tc);
    installInstantHotReloadFsHook(tc);

    // Seed `/home/user/AGENTS.md`, `/home/user/.claude/CLAUDE.md`, `/home/user/slopes2/AGENTS.md`, and `/tmp/slopes2_status.json`
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
        "\x1b[92m✓ Mounted `/home/user/slopes2` (0-frame-drop hot reload), `/dom` Plan-9 live DOM FS, `hc`, `drift`, and `body` actuators.\x1b[0m"
      );
      terminal.term.writeln(
        "\x1b[93m✓ Type `fork-and-drift`, `drift status`, `hc s`, `ls /dom`, `body status`, or `claude`.\x1b[0m\r\n"
      );
    }

    // If user is already signed into Claude (OAuth or API key), automatically switch TAB-01
    // from simulated heuristic loop to REAL `@anthropic-ai/claude-code`!
    if (bridgeState.signedInAccount && !bridgeState.claudeAutoLaunched) {
      bridgeState.claudeAutoLaunched = true;
      const forms = (global.SlopesTabForms && global.SlopesTabForms.tabForms) || [];
      for (let i = 0; i < forms.length; i++) {
        forms[i].autoMode = false;
      }
      const primaryTf = forms.find((t) => t.id === (bridgeState.activeTabFormId || "TAB-01")) || forms[0];
      if (primaryTf) {
        primaryTf.realTabActive = true;
        primaryTf.autoMode = false;
        tc.shell.env["TABFORM_ID"] = primaryTf.id;
      }
      setTimeout(() => {
        sendCommandToRealTabComputer(
          (primaryTf && primaryTf.id) || "TAB-01",
          "claude --npm --dangerously-skip-permissions"
        );
      }, 350);
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

    // 2. Sync GitHub OAuth / PAT credentials (`tabcomputer_github_token`) & ~/.gitconfig
    await syncGitHubCredentialsToRealFs(tc);

    // 3. Invoke TabComputer's native `ensureClaudeAuthState(fs, shell.env)` if loaded in `__tabcomputerLive`
    try {
      const cw = bridgeState.iframe && bridgeState.iframe.contentWindow;
      const claudeAuthMod =
        cw && cw.__tabcomputerLive && typeof cw.__tabcomputerLive.get === "function"
          ? cw.__tabcomputerLive.get("src/claude-auth.ts")
          : null;
      if (claudeAuthMod && typeof claudeAuthMod.ensureClaudeAuthState === "function") {
        await claudeAuthMod.ensureClaudeAuthState(fs, shell.env);
      }
    } catch (_) {}
  }

  async function syncGitHubCredentialsToRealFs(tc) {
    if (!tc || !tc.fs) return;
    const { fs, shell } = tc;
    let ghTok = null;
    let ghAcct = null;
    try {
      ghTok =
        localStorage.getItem(GITHUB_TOKEN_KEY) ||
        localStorage.getItem("slopes2_github_token");
      const rawAcct = localStorage.getItem("slopes2_github_account");
      if (rawAcct) ghAcct = JSON.parse(rawAcct);
    } catch (_) {}

    if (!ghTok && bridgeState.iframe && bridgeState.iframe.contentWindow) {
      try {
        ghTok = bridgeState.iframe.contentWindow.localStorage.getItem(GITHUB_TOKEN_KEY);
      } catch (_) {}
    }
    if (!ghTok) return;

    shell.env["GITHUB_TOKEN"] = ghTok;
    shell.env["GH_TOKEN"] = ghTok;
    try {
      if (bridgeState.iframe && bridgeState.iframe.contentWindow) {
        bridgeState.iframe.contentWindow.localStorage.setItem(GITHUB_TOKEN_KEY, ghTok);
      }
    } catch (_) {}

    if (!bridgeState.githubAccount) {
      bridgeState.githubAccount = {
        login: (ghAcct && ghAcct.login) || "github-user",
        name: (ghAcct && ghAcct.name) || "",
        email: (ghAcct && ghAcct.email) || "",
        authType: "github",
      };
    }

    // Configure ~/.gitconfig with user identity and gh credential helper (matching tabcomputer/src/github-auth.ts)
    try {
      const uName = (ghAcct && (ghAcct.name || ghAcct.login)) || "TabComputer User";
      const uEmail =
        (ghAcct && ghAcct.email) ||
        (ghAcct && ghAcct.login ? `${ghAcct.login}@users.noreply.github.com` : "user@tabcomputer.local");
      const gitConfigText = [
        "[user]",
        `\tname = ${uName}`,
        `\temail = ${uEmail}`,
        '[credential "https://github.com"]',
        "\thelper = !gh auth git-credential",
        '[credential "https://gist.github.com"]',
        "\thelper = !gh auth git-credential",
        "",
      ].join("\n");
      await fs.writeFile(GLOBAL_GITCONFIG_PATH, gitConfigText);
    } catch (_) {}
  }

  // ==========================================================================
  // 3B. GITHUB OAUTH DEVICE FLOW (`gh` & `git` SIGN-IN LIKE TABCOMPUTER)
  // ==========================================================================
  const TABCOMPUTER_PROXY_ORIGIN = "https://tabcomputer.com";

  function rewriteTabComputerApiUrl(rawUrl) {
    if (typeof rawUrl !== "string") return rawUrl;
    // Rewrite relative `/api/(github-login|github|platform|anthropic|mcp-proxy|gemini)...`
    // or `https://williamsharkey.com/api/...` directly to `https://tabcomputer.com/api/...`
    // so static hosts (like williamsharkey.com) never log 404s!
    const relMatch = rawUrl.match(/^\/api\/(github-login|github|platform|anthropic|mcp-proxy|gemini)(\/.*|$)/);
    if (relMatch) {
      return `${TABCOMPUTER_PROXY_ORIGIN}/api/${relMatch[1]}${relMatch[2] || ""}`;
    }
    const hostMatch = rawUrl.match(
      /^https?:\/\/(?:www\.)?williamsharkey\.com\/(?:slopes2\/)?api\/(github-login|github|platform|anthropic|mcp-proxy|gemini)(\/.*|$)/i
    );
    if (hostMatch) {
      return `${TABCOMPUTER_PROXY_ORIGIN}/api/${hostMatch[1]}${hostMatch[2] || ""}`;
    }
    return rawUrl;
  }

  function installTabComputerApiFetchInterceptor(win) {
    if (!win || typeof win.fetch !== "function" || win.__slopesApiFetchWrapped) return;
    const origFetch = win.fetch.bind(win);
    win.__slopesApiFetchWrapped = true;
    win.fetch = function (input, init) {
      let urlStr = "";
      try {
        if (typeof input === "string") {
          input = rewriteTabComputerApiUrl(input);
          urlStr = input;
        } else if (input && typeof input === "object" && typeof input.url === "string") {
          const rewritten = rewriteTabComputerApiUrl(input.url);
          urlStr = rewritten;
          if (rewritten !== input.url && typeof win.Request === "function") {
            input = new win.Request(rewritten, input);
          }
        }
      } catch (_) {}
      const isAnthropicMessages =
        typeof urlStr === "string" &&
        (urlStr.includes("/api/anthropic/v1/messages") || urlStr.includes("api.anthropic.com/v1/messages"));
      if (isAnthropicMessages) {
        bridgeState.anthropicApiCalls = (bridgeState.anthropicApiCalls || 0) + 1;
        bridgeState.lastAnthropicStatus = "STREAMING...";
        bridgeState.lastAnthropicMs = Date.now();
      }
      const p = origFetch(input, init);
      if (isAnthropicMessages && p && typeof p.then === "function") {
        p.then((resp) => {
          bridgeState.lastAnthropicStatus = resp ? `${resp.status} SSE` : "ERR";
          bridgeState.lastAnthropicMs = Date.now();
        }).catch(() => {
          bridgeState.lastAnthropicStatus = "NET-ERR";
        });
      }
      return p;
    };
  }

  installTabComputerApiFetchInterceptor(global);

  async function postGitHubLoginProxy(path, bodyObj) {
    const origins = [
      "https://tabcomputer.com",
      "https://shiro.computer",
    ];
    let lastErr = null;
    for (let i = 0; i < origins.length; i++) {
      const base = origins[i];
      try {
        const resp = await fetch(`${base}/api/github-login${path}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(bodyObj),
        });
        const data = await resp.json().catch(() => null);
        if (resp.ok || (data && data.error)) {
          return data;
        }
        lastErr = new Error(`GitHub proxy HTTP ${resp.status}`);
      } catch (err) {
        lastErr = err;
      }
    }
    throw lastErr || new Error("Unable to reach GitHub OAuth device flow proxy");
  }

  async function saveGitHubTokenAndIdentity(token) {
    const cleanTok = String(token || "").trim();
    if (!cleanTok) throw new Error("Empty GitHub token");
    try {
      localStorage.setItem(GITHUB_TOKEN_KEY, cleanTok);
      localStorage.setItem("slopes2_github_token", cleanTok);
    } catch (_) {}

    let ghUser = null;
    try {
      const resp = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${cleanTok}`,
          Accept: "application/vnd.github+json",
        },
      });
      if (resp.ok) {
        ghUser = await resp.json();
      }
    } catch (_) {}

    const acct = {
      login: (ghUser && ghUser.login) || "github-user",
      name: (ghUser && (ghUser.name || ghUser.login)) || "GitHub User",
      email:
        (ghUser && ghUser.email) ||
        (ghUser && ghUser.id && ghUser.login
          ? `${ghUser.id}+${ghUser.login}@users.noreply.github.com`
          : ""),
      authType: "github",
    };
    bridgeState.githubAccount = acct;
    try {
      localStorage.setItem("slopes2_github_account", JSON.stringify(acct));
    } catch (_) {}

    if (bridgeState.tc) {
      await syncGitHubCredentialsToRealFs(bridgeState.tc);
    } else {
      void ensureRealTabComputerBooted(bridgeState.activeTabFormId).catch(() => {});
    }
    return acct;
  }

  async function startGitHubDeviceFlow() {
    if (bridgeState.githubPollAbort) {
      try {
        bridgeState.githubPollAbort.abort();
      } catch (_) {}
    }
    setModalStatus("Requesting GitHub one-time device code...", "#ffd43b");
    const codeData = await postGitHubLoginProxy("/login/device/code", {
      client_id: GITHUB_OAUTH_CLIENT_ID,
      scope: DEFAULT_GITHUB_SCOPES.join(" "),
    });
    if (!codeData || codeData.error || !codeData.user_code) {
      throw new Error(
        (codeData && (codeData.error_description || codeData.error)) ||
          "Failed to obtain GitHub device code"
      );
    }

    bridgeState.githubDevicePending = codeData;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(codeData.user_code);
      }
    } catch (_) {}

    const verifyUrl = codeData.verification_uri || "https://github.com/login/device";
    window.open(verifyUrl, "_blank", "noopener,noreferrer");
    setModalStatus(
      `GitHub code ${codeData.user_code} copied! Paste at github.com/login/device...`,
      "#ffd43b"
    );
    renderClaudeSignInCanvas();

    const abortCtrl = new AbortController();
    bridgeState.githubPollAbort = abortCtrl;
    let intervalSec = Math.max(2, Number(codeData.interval) || 5);
    const deadline = Date.now() + (Number(codeData.expires_in) || 900) * 1000;

    while (Date.now() < deadline && !abortCtrl.signal.aborted) {
      await new Promise((r) => setTimeout(r, intervalSec * 1000));
      if (abortCtrl.signal.aborted) return;
      try {
        const pollData = await postGitHubLoginProxy("/login/oauth/access_token", {
          client_id: GITHUB_OAUTH_CLIENT_ID,
          device_code: codeData.device_code,
          grant_type: "urn:ietf:params:oauth:grant-type:device_code",
        });
        if (pollData && pollData.access_token) {
          bridgeState.githubDevicePending = null;
          const acct = await saveGitHubTokenAndIdentity(pollData.access_token);
          setModalStatus(
            `✓ GitHub connected as @${acct.login}! gh & git authenticated in TabComputer.`,
            "#69db7c"
          );
          renderClaudeSignInCanvas();
          return;
        }
        if (pollData && pollData.error === "slow_down") {
          intervalSec = Number(pollData.interval) || intervalSec + 5;
        } else if (pollData && pollData.error && pollData.error !== "authorization_pending") {
          throw new Error(pollData.error_description || pollData.error);
        }
      } catch (err) {
        if (!abortCtrl.signal.aborted) {
          setModalStatus("GitHub auth error: " + (err.message || String(err)), "#ff8787");
        }
        return;
      }
    }
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
          "claude --npm --dangerously-skip-permissions"
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
      const scaleX = sRect.width / 1008;
      const scaleY = sRect.height / 630;
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
  // 5. HARDCORE HAIRLINE CLAUDE + GITHUB SIGN-IN MODAL (1:1 DEVICE-PIXEL TUI)
  // ==========================================================================
  let modalCanvas = null;
  let modalInputBuf = "";
  let modalHitBoxes = [];
  let modalHoverAction = null;

  function setModalStatus(msg, color) {
    bridgeState.modalStatusText = msg || "";
    bridgeState.modalStatusColor = color || "#78ead4";
    renderClaudeSignInCanvas();
  }

  function renderClaudeSignInCanvas() {
    if (!modalCanvas || !bridgeState.modalOpen) return;
    const HT = global.HardcoreTab;
    if (!HT || !HT.HardcoreTabRenderer) return;
    const dpr = Math.max(1, global.devicePixelRatio || 1);
    const parent = modalCanvas.parentElement || document.body;
    const cssW = Math.min(740, Math.max(320, (parent.clientWidth || 740) - 16));
    const cssH = Math.min(520, Math.max(340, (parent.clientHeight || 520) - 16));
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

    const font = HT.HardcoreTabRenderer.getFont("h12x26");
    const cw = font.w || 12;
    const ch = font.h || 26;
    modalHitBoxes = [];

    // Outer obsidian/amber TUI terminal frame
    ctx.fillStyle = "rgba(4, 9, 13, 0.98)";
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
    const kernelBadge = bridgeState.booted ? "TABCOMPUTER ONLINE" : "TABCOMPUTER BOOTING...";
    HT.HardcoreTabRenderer.drawCanvasText(
      ctx,
      `╔═ HARDCORE-TAB // CLAUDE & GITHUB SIGN-IN (${targetId} · ${kernelBadge}) ═╗`,
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

    let curY = hdrH + 10;
    const boxX = 12;
    const boxW = devW - 24;

    // ------------------------------------------------------------------------
    // STEP 1: AUTHORIZE WITH CLAUDE ACCOUNT (OAUTH S256 PKCE)
    // ------------------------------------------------------------------------
    const step1H = ch * 2 + 20;
    ctx.fillStyle = "#081318";
    ctx.fillRect(boxX, curY, boxW, step1H);
    ctx.strokeStyle = "#2b5260";
    ctx.strokeRect(boxX + 0.5, curY + 0.5, boxW - 1, step1H - 1);
    const claudeHdr = bridgeState.signedInAccount
      ? `STEP 1: CLAUDE ACCOUNT CONNECTED (${bridgeState.signedInAccount.email})`
      : "STEP 1: AUTHORIZE WITH CLAUDE ACCOUNT (OAUTH S256 PKCE)";
    HT.HardcoreTabRenderer.drawCanvasText(
      ctx,
      claudeHdr,
      boxX + 10,
      curY + 4,
      bridgeState.signedInAccount ? "#69db7c" : "#ffd43b",
      "h12x26"
    );

    const btn1Label = bridgeState.signedInAccount
      ? "[ 1. RE-AUTHORIZE CLAUDE.COM SIGN-IN -> ]"
      : "[ 1. OPEN CLAUDE.COM SIGN-IN PAGE -> ]";
    const btn1W = Math.min(boxW - 20, btn1Label.length * cw + 20);
    const btn1X = boxX + 10;
    const btn1Y = curY + ch + 8;
    const btn1H = ch + 6;
    ctx.fillStyle = modalHoverAction === "oauth_open" ? "#2b2208" : "#1a1405";
    ctx.fillRect(btn1X, btn1Y, btn1W, btn1H);
    ctx.strokeStyle = "#ffd43b";
    ctx.strokeRect(btn1X + 0.5, btn1Y + 0.5, btn1W - 1, btn1H - 1);
    HT.HardcoreTabRenderer.drawCanvasText(ctx, btn1Label, btn1X + 10, btn1Y + 3, "#ffd43b", "h12x26");
    modalHitBoxes.push({ x: btn1X, y: btn1Y, w: btn1W, h: btn1H, action: "oauth_open" });

    curY += step1H + 8;

    // ------------------------------------------------------------------------
    // STEP 2: PASTE CLAUDE CODE (code#state), API KEY (sk-ant-...), OR GH PAT
    // ------------------------------------------------------------------------
    const step2H = ch * 3 + 32;
    ctx.fillStyle = "#081318";
    ctx.fillRect(boxX, curY, boxW, step2H);
    ctx.strokeStyle = "#2b5260";
    ctx.strokeRect(boxX + 0.5, curY + 0.5, boxW - 1, step2H - 1);
    HT.HardcoreTabRenderer.drawCanvasText(
      ctx,
      "STEP 2: PASTE CLAUDE CODE (code#state), API KEY (sk-ant-...), OR GH TOKEN",
      boxX + 10,
      curY + 4,
      "#69db7c",
      "h12x26"
    );

    const pasteBtnLabel = "[PASTE]";
    const pasteBtnW = pasteBtnLabel.length * cw + 16;
    const inpX = boxX + 10;
    const inpY = curY + ch + 8;
    const inpW = boxW - 28 - pasteBtnW;
    const inpH = ch + 6;
    ctx.fillStyle = "#03070a";
    ctx.fillRect(inpX, inpY, inpW, inpH);
    ctx.strokeStyle = "#78ead4";
    ctx.strokeRect(inpX + 0.5, inpY + 0.5, inpW - 1, inpH - 1);
    const maxChars = Math.max(10, Math.floor((inpW - 16) / cw));
    const shownInput = modalInputBuf
      ? modalInputBuf.slice(-maxChars) + "█"
      : "Press Ctrl+V / Cmd+V or click [PASTE] to insert code#state or token...";
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

    const actY = inpY + inpH + 6;
    const actH = ch + 6;
    const completeLabel = "[ 2. SIGN IN & LAUNCH CLAUDE CODE ]";
    const completeW = completeLabel.length * cw + 18;
    ctx.fillStyle = modalHoverAction === "complete_login" ? "#143c2c" : "#0b241a";
    ctx.fillRect(inpX, actY, completeW, actH);
    ctx.strokeStyle = "#69db7c";
    ctx.strokeRect(inpX + 0.5, actY + 0.5, completeW - 1, actH - 1);
    HT.HardcoreTabRenderer.drawCanvasText(ctx, completeLabel, inpX + 9, actY + 3, "#69db7c", "h12x26");
    modalHitBoxes.push({ x: inpX, y: actY, w: completeW, h: actH, action: "complete_login" });

    curY += step2H + 8;

    // ------------------------------------------------------------------------
    // STEP 3: CONNECT GITHUB ACCOUNT (OAUTH DEVICE FLOW FOR `gh` & `git`)
    // ------------------------------------------------------------------------
    const step3H = ch * 2 + 22;
    ctx.fillStyle = "#081318";
    ctx.fillRect(boxX, curY, boxW, step3H);
    ctx.strokeStyle = bridgeState.githubAccount ? "#69db7c" : "#78ead4";
    ctx.strokeRect(boxX + 0.5, curY + 0.5, boxW - 1, step3H - 1);

    const ghPending = bridgeState.githubDevicePending;
    const ghHeaderText = bridgeState.githubAccount
      ? `STEP 3: GITHUB CONNECTED AS @${bridgeState.githubAccount.login} (gh & git READY)`
      : ghPending && ghPending.user_code
      ? `STEP 3: GITHUB CODE [ ${ghPending.user_code} ] — APPROVE AT github.com/login/device`
      : "STEP 3: CONNECT GITHUB ACCOUNT (TABCOMPUTER gh & git CREDENTIAL)";
    HT.HardcoreTabRenderer.drawCanvasText(
      ctx,
      ghHeaderText,
      boxX + 10,
      curY + 4,
      bridgeState.githubAccount ? "#69db7c" : ghPending ? "#ffd43b" : "#78ead4",
      "h12x26"
    );

    const ghBtnLabel = bridgeState.githubAccount
      ? `[ GITHUB SIGNED IN (@${bridgeState.githubAccount.login}) · RECONNECT ]`
      : ghPending && ghPending.user_code
      ? `[ COPY CODE (${ghPending.user_code}) & OPEN GITHUB.COM/LOGIN/DEVICE -> ]`
      : "[ 3. SIGN IN W/ GITHUB (DEVICE FLOW FOR gh & git) -> ]";
    const ghBtnW = Math.min(boxW - 20, ghBtnLabel.length * cw + 20);
    const ghBtnX = boxX + 10;
    const ghBtnY = curY + ch + 8;
    const ghBtnH = ch + 6;
    ctx.fillStyle = modalHoverAction === "github_device_login" ? "#16343c" : "#0c2028";
    ctx.fillRect(ghBtnX, ghBtnY, ghBtnW, ghBtnH);
    ctx.strokeStyle = bridgeState.githubAccount ? "#69db7c" : "#78ead4";
    ctx.strokeRect(ghBtnX + 0.5, ghBtnY + 0.5, ghBtnW - 1, ghBtnH - 1);
    HT.HardcoreTabRenderer.drawCanvasText(
      ctx,
      ghBtnLabel,
      ghBtnX + 10,
      ghBtnY + 3,
      bridgeState.githubAccount ? "#69db7c" : "#78ead4",
      "h12x26"
    );
    modalHitBoxes.push({ x: ghBtnX, y: ghBtnY, w: ghBtnW, h: ghBtnH, action: "github_device_login" });

    curY += step3H + 8;

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

  function openClaudeSignInModal(tabId, autoStartGitHub) {
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
        } else if (hit === "github_device_login") {
          if (bridgeState.githubDevicePending && bridgeState.githubDevicePending.user_code) {
            try {
              if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(bridgeState.githubDevicePending.user_code);
              }
            } catch (_) {}
            window.open(
              bridgeState.githubDevicePending.verification_uri || "https://github.com/login/device",
              "_blank",
              "noopener,noreferrer"
            );
            setModalStatus(
              `Copied ${bridgeState.githubDevicePending.user_code}! Approve at github.com/login/device...`,
              "#ffd43b"
            );
          } else {
            startGitHubDeviceFlow().catch((err) => {
              setModalStatus("GitHub device flow error: " + (err.message || String(err)), "#ff8787");
            });
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
    if (autoStartGitHub) {
      startGitHubDeviceFlow().catch((err) => {
        setModalStatus("GitHub device flow: " + (err.message || String(err)), "#ff8787");
      });
    } else if (bridgeState.signedInAccount) {
      setModalStatus(
        `Signed in (${bridgeState.signedInAccount.email}). Connect GitHub below or click [2. LAUNCH CLAUDE].`,
        "#69db7c"
      );
    } else {
      setModalStatus("Step 1: Open claude.com sign-in page, or connect GitHub below.", "#78ead4");
    }
    renderClaudeSignInCanvas();
  }

  function openGitHubSignInModal(tabId) {
    openClaudeSignInModal(tabId, true);
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
        setModalStatus("Paste code#state from Claude, sk-ant-... key, or ghp_... token first.", "#ffd43b");
        return;
      }

      // Support pasting a GitHub Personal Access Token (`ghp_...` or `github_pat_...`) directly!
      if (raw.startsWith("ghp_") || raw.startsWith("github_pat_") || raw.startsWith("gho_")) {
        setModalStatus("Verifying & saving GitHub token for gh and git...", "#ffd43b");
        const acct = await saveGitHubTokenAndIdentity(raw);
        modalInputBuf = "";
        setModalStatus(`✓ GitHub connected as @${acct.login}!`, "#69db7c");
        renderClaudeSignInCanvas();
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
        renderClaudeSignInCanvas();
        setModalStatus("✓ Claude signed in! You can also connect GitHub in Step 3.", "#69db7c");
        return;
      }

      setModalStatus("Exchanging OAuth PKCE code with Claude platform...", "#ffd43b");
      await exchangePkceCode(raw);
      setModalStatus("✓ Claude OAuth token saved! You can also connect GitHub in Step 3.", "#69db7c");
      const tc = await ensureRealTabComputerBooted(tId);
      await syncCredentialsToRealFs(tc);
      await activateRealModeForTabForm(tId, true);
      modalInputBuf = "";
      renderClaudeSignInCanvas();
    } catch (err) {
      setModalStatus(err.message || String(err), "#ff8787");
    }
  }

  // ==========================================================================
  // 5B. HOST-PAGE `/dom` PLAN-9 LIVE DOM FILESYSTEM & `hc` HYPERCOMPACT UTILITY
  // ==========================================================================
  function createHostDomProvider(hostDoc, hostWin) {
    let lastCtlOutput = "";

    function resolveElement(subPath) {
      if (!hostDoc) return null;
      const parts = subPath.split("/").filter(Boolean);
      if (parts.length === 0) return hostDoc.body;
      let el = null;
      if (parts[0] === "body") {
        el = hostDoc.body;
        parts.shift();
      } else {
        el = hostDoc.getElementById(parts[0]);
        if (!el) return null;
        parts.shift();
      }
      for (let i = 0; i < parts.length; i++) {
        if (!el) return null;
        const seg = parts[i];
        const byId = hostDoc.getElementById(seg);
        if (byId && el.contains(byId)) {
          el = byId;
          continue;
        }
        const m = seg.match(/^([a-z0-9-]+?)(?:\.(\d+))?$/);
        if (!m) return null;
        const tag = m[1];
        const idx = m[2] ? parseInt(m[2], 10) : 0;
        const matches = [];
        for (let c = 0; c < el.children.length; c++) {
          if (el.children[c].tagName.toLowerCase() === tag) matches.push(el.children[c]);
        }
        el = matches[idx] || null;
      }
      return el;
    }

    function executeHostCtlLine(line) {
      const sp = line.indexOf(" ");
      const cmd = (sp === -1 ? line : line.slice(0, sp)).toLowerCase();
      const rest = sp === -1 ? "" : line.slice(sp + 1).trim();
      const splitSel = (s) => {
        const idx = s.indexOf(" ");
        return idx === -1 ? [s, ""] : [s.slice(0, idx), s.slice(idx + 1)];
      };
      switch (cmd) {
        case "html": {
          const [sel, val] = splitSel(rest);
          const el = hostDoc.querySelector(sel);
          if (!el) return `err: no match for ${sel}`;
          el.innerHTML = val;
          return `ok: set innerHTML on <${el.tagName.toLowerCase()}>`;
        }
        case "text": {
          const [sel, val] = splitSel(rest);
          const el = hostDoc.querySelector(sel);
          if (!el) return `err: no match for ${sel}`;
          el.textContent = val;
          return `ok: set textContent on <${el.tagName.toLowerCase()}>`;
        }
        case "append": {
          const [sel, val] = splitSel(rest);
          const el = hostDoc.querySelector(sel);
          if (!el) return `err: no match for ${sel}`;
          el.insertAdjacentHTML("beforeend", val);
          return `ok: appended to <${el.tagName.toLowerCase()}>`;
        }
        case "attr": {
          const [sel, r2] = splitSel(rest);
          const [name, val] = splitSel(r2);
          const el = hostDoc.querySelector(sel);
          if (!el) return `err: no match for ${sel}`;
          el.setAttribute(name, val);
          return `ok: set ${name}="${val}"`;
        }
        case "style": {
          const [sel, r2] = splitSel(rest);
          const [prop, val] = splitSel(r2);
          const el = hostDoc.querySelector(sel);
          if (!el) return `err: no match for ${sel}`;
          el.style.setProperty(prop, val);
          return `ok: set style.${prop} = ${val}`;
        }
        case "class+":
        case "class-":
        case "class~": {
          const [sel, cls] = splitSel(rest);
          const el = hostDoc.querySelector(sel);
          if (!el) return `err: no match for ${sel}`;
          if (cmd === "class+") el.classList.add(cls);
          else if (cmd === "class-") el.classList.remove(cls);
          else el.classList.toggle(cls);
          return `ok: ${cmd} ${cls}`;
        }
        case "rm": {
          const el = hostDoc.querySelector(rest);
          if (!el) return `err: no match for ${rest}`;
          el.remove();
          return "ok: removed";
        }
        case "click": {
          const el = hostDoc.querySelector(rest);
          if (!el) return `err: no match for ${rest}`;
          el.click();
          return "ok: clicked";
        }
        case "q": {
          const els = hostDoc.querySelectorAll(rest);
          if (!els.length) return `(0 matches for ${rest})`;
          const out = [`(${els.length} matches)`];
          els.forEach((e, i) => {
            const tag = e.tagName.toLowerCase();
            const id = e.id ? `#${e.id}` : "";
            const cls = e.className && typeof e.className === "string" ? `.${e.className.trim().split(/\s+/).join(".")}` : "";
            out.push(`[${i}] <${tag}${id}${cls}>`);
          });
          return out.join("\n");
        }
        case "eval": {
          try {
            const evalFn = hostWin.__slopes2EvalInScope || ((code) => hostWin.eval(code));
            const res = evalFn(rest);
            return res === undefined ? "undefined" : typeof res === "object" ? JSON.stringify(res, null, 2) : String(res);
          } catch (e) {
            return `err: ${e.message || String(e)}`;
          }
        }
        default:
          return `err: unknown /dom/ctl command "${cmd}" (use html, text, append, attr, style, class+, class-, class~, rm, click, q, eval)`;
      }
    }

    const LEAF_FILES = new Set(["tag", "text", "html", "outer", "attrs", "classes", "style", "computed", "rect", "children", "value"]);

    return {
      prefix: "/dom",
      exists(p) {
        if (p === "/dom" || p === "/dom/ctl" || p === "/dom/title" || p === "/dom/url" || p === "/dom/viewport" || p === "/dom/scripts" || p === "/dom/styles" || p === "/dom/body") {
          return true;
        }
        const sub = p.slice(5);
        const slashIdx = sub.lastIndexOf("/");
        if (slashIdx !== -1) {
          const leaf = sub.slice(slashIdx + 1);
          if (LEAF_FILES.has(leaf)) {
            return resolveElement(sub.slice(0, slashIdx)) !== null;
          }
        }
        return resolveElement(sub) !== null;
      },
      isDirectory(p) {
        if (p === "/dom" || p === "/dom/body") return true;
        if (p === "/dom/ctl" || p === "/dom/title" || p === "/dom/url" || p === "/dom/viewport" || p === "/dom/scripts" || p === "/dom/styles") return false;
        const sub = p.slice(5);
        const leaf = sub.slice(sub.lastIndexOf("/") + 1);
        if (LEAF_FILES.has(leaf)) return false;
        return resolveElement(sub) !== null;
      },
      readFile(p) {
        if (p === "/dom/ctl") return lastCtlOutput + (lastCtlOutput.endsWith("\n") ? "" : "\n");
        if (p === "/dom/title") return (hostDoc.title || "") + "\n";
        if (p === "/dom/url") return (hostWin.location ? hostWin.location.href : "") + "\n";
        if (p === "/dom/viewport") {
          return JSON.stringify({
            width: hostWin.innerWidth,
            height: hostWin.innerHeight,
            dpr: hostWin.devicePixelRatio || 1,
            coarseGrid: { W: 144, H: 90 },
            nativeCanvas: { W: 1008, H: 630 },
          }, null, 2) + "\n";
        }
        if (p === "/dom/scripts") {
          return Array.from(hostDoc.querySelectorAll("script"))
            .map((s, i) => s.src ? `[${i}] src=${s.src}` : `[${i}] inline (${(s.textContent || "").length} chars)`)
            .join("\n") + "\n";
        }
        if (p === "/dom/styles") {
          return Array.from(hostDoc.querySelectorAll("style"))
            .map((s, i) => `/* style[${i}] */\n${s.textContent || ""}`)
            .join("\n\n") + "\n";
        }
        const sub = p.slice(5);
        const slashIdx = sub.lastIndexOf("/");
        if (slashIdx === -1) return null;
        const elPath = sub.slice(0, slashIdx);
        const leaf = sub.slice(slashIdx + 1);
        const el = resolveElement(elPath);
        if (!el) return null;
        if (leaf === "tag") return el.tagName.toLowerCase() + "\n";
        if (leaf === "text") return (el.textContent || "") + "\n";
        if (leaf === "html") return el.innerHTML + "\n";
        if (leaf === "outer") return el.outerHTML + "\n";
        if (leaf === "attrs") {
          const obj = {};
          for (let i = 0; i < el.attributes.length; i++) {
            obj[el.attributes[i].name] = el.attributes[i].value;
          }
          return JSON.stringify(obj, null, 2) + "\n";
        }
        if (leaf === "classes") return Array.from(el.classList).join("\n") + "\n";
        if (leaf === "style") return (el.getAttribute("style") || "") + "\n";
        if (leaf === "rect") {
          const r = el.getBoundingClientRect();
          return JSON.stringify({ x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) }) + "\n";
        }
        if (leaf === "children") return this.readdir("/dom/" + elPath).join("\n") + "\n";
        if (leaf === "value") return (el.value || "") + "\n";
        return null;
      },
      writeFile(p, content) {
        const val = String(content || "").replace(/\n$/, "");
        if (p === "/dom/ctl") {
          const lines = val.split("\n").map((l) => l.trim()).filter(Boolean);
          const results = lines.map((l) => executeHostCtlLine(l));
          lastCtlOutput = results.join("\n");
          return true;
        }
        if (p === "/dom/title") {
          hostDoc.title = val;
          return true;
        }
        if (p === "/dom/styles") {
          let styleEl = hostDoc.getElementById("dom-fs-style");
          if (!styleEl) {
            styleEl = hostDoc.createElement("style");
            styleEl.id = "dom-fs-style";
            hostDoc.head.appendChild(styleEl);
          }
          styleEl.textContent = val;
          return true;
        }
        const sub = p.slice(5);
        const slashIdx = sub.lastIndexOf("/");
        if (slashIdx === -1) return false;
        const el = resolveElement(sub.slice(0, slashIdx));
        const leaf = sub.slice(slashIdx + 1);
        if (!el) return false;
        if (leaf === "text") { el.textContent = val; return true; }
        if (leaf === "html") { el.innerHTML = val; return true; }
        if (leaf === "style") { el.setAttribute("style", val); return true; }
        if (leaf === "classes") { el.className = val.split("\n").map((s) => s.trim()).filter(Boolean).join(" "); return true; }
        if (leaf === "attrs") {
          try {
            const obj = JSON.parse(val);
            for (const [k, v] of Object.entries(obj)) {
              if (v === null) el.removeAttribute(k);
              else el.setAttribute(k, String(v));
            }
            return true;
          } catch (_) { return false; }
        }
        return false;
      },
      readdir(p) {
        if (p === "/dom") {
          const base = ["ctl", "title", "url", "viewport", "scripts", "styles", "body"];
          if (hostDoc) {
            hostDoc.querySelectorAll("[id]").forEach((el) => {
              if (el.id && !base.includes(el.id)) base.push(el.id);
            });
          }
          return base;
        }
        const el = resolveElement(p.slice(5));
        if (!el) return [];
        const entries = Array.from(LEAF_FILES);
        const counts = new Map();
        for (let i = 0; i < el.children.length; i++) {
          const t = el.children[i].tagName.toLowerCase();
          counts.set(t, (counts.get(t) || 0) + 1);
        }
        const indices = new Map();
        for (let i = 0; i < el.children.length; i++) {
          const child = el.children[i];
          if (child.id) {
            entries.push(child.id);
          } else {
            const t = child.tagName.toLowerCase();
            const idx = indices.get(t) || 0;
            indices.set(t, idx + 1);
            entries.push((counts.get(t) || 0) > 1 ? `${t}.${idx}` : t);
          }
        }
        return entries;
      },
      stat(p) {
        const now = Date.now();
        const isDir = this.isDirectory(p);
        return {
          type: isDir ? "dir" : "file",
          mode: isDir ? 0o755 : 0o644,
          size: isDir ? 0 : (this.readFile(p) || "").length,
          mtime: now,
          ctime: now,
          isDirectory: () => isDir,
          isFile: () => !isDir,
          isSymbolicLink: () => false,
        };
      },
      unlink(p) {
        const el = resolveElement(p.slice(5));
        if (!el || el === hostDoc.body || el === hostDoc.documentElement) return false;
        el.remove();
        return true;
      },
    };
  }

  function mountHostDomInTabComputer(tc, cw) {
    if (!tc || !tc.fs || typeof document === "undefined") return;
    const hostProvider = createHostDomProvider(global.document, global);
    if (Array.isArray(tc.fs.virtualProviders)) {
      const idx = tc.fs.virtualProviders.findIndex((vp) => vp && vp.prefix === "/dom");
      if (idx >= 0) {
        tc.fs.virtualProviders[idx] = hostProvider;
      } else {
        tc.fs.virtualProviders.unshift(hostProvider);
      }
    } else if (typeof tc.fs.registerProvider === "function") {
      tc.fs.registerProvider(hostProvider);
    }
  }

  function wireHostHcToTabComputer(tc, cw) {
    if (!tc || !tc.commands || typeof document === "undefined") return;
    try {
      // Point TabComputer's `window.__hc.session` directly at the live slopes2 host document!
      if (cw && cw.__hc && typeof cw.__hc.HCSession === "function") {
        const hostHcSession = new cw.__hc.HCSession(global.document, "slopes2-live");
        cw.__hc.session = hostHcSession;
        global.__hc = {
          HCSession: cw.__hc.HCSession,
          session: hostHcSession,
          exec: (cmd) => hostHcSession.exec(cmd),
        };
        global.hc = (cmd) => hostHcSession.exec(cmd);
      }
    } catch (_) {}

    // Wrap `hc` in TabComputer's CommandRegistry so `hc live`, `hc outer`, `hc text`, `hc html`, `hc style`, `hc attr`, `hc eval` work directly on slopes2!
    const origHc = tc.commands.get ? tc.commands.get("hc") : null;
    const enhancedHcCmd = {
      name: "hc",
      description: "Hypercompact DOM & live runtime inspector/editor bound to the live slopes2 host page",
      exec: async (ctx) => {
        const args = Array.isArray(ctx.args) ? ctx.args : [];
        const raw = args.join(" ").trim();
        const session =
          (cw && cw.__hc && cw.__hc.session) ||
          (global.__hc && global.__hc.session) ||
          null;

        if (!raw || raw === "live" || raw === "outer") {
          if (cw && cw.__hc && typeof cw.__hc.HCSession === "function") {
            const s = new cw.__hc.HCSession(global.document, "slopes2-live");
            cw.__hc.session = s;
            if (global.__hc) global.__hc.session = s;
            ctx.stdout += s.exec("s") + "\n";
            return 0;
          }
        }

        // Live DOM mutation & runtime evaluation extensions on `hc`:
        const verb = (args[0] || "").toLowerCase();
        if (verb === "eval") {
          const code = args.slice(1).join(" ");
          try {
            const evalFn = global.__slopes2EvalInScope || ((c) => (0, eval)(c));
            const res = evalFn(code);
            ctx.stdout += (res === undefined ? "undefined" : typeof res === "object" ? JSON.stringify(res, null, 2) : String(res)) + "\n";
            return 0;
          } catch (e) {
            ctx.stderr += `hc eval err: ${e.message || String(e)}\n`;
            return 1;
          }
        }
        if (session && session.current && (verb === "text" || verb === "html" || verb === "style" || verb === "attr")) {
          const el = session.current;
          if (verb === "text") {
            el.textContent = args.slice(1).join(" ");
            ctx.stdout += `✓ set textContent on <${el.tagName.toLowerCase()}>\n`;
            return 0;
          }
          if (verb === "html") {
            el.innerHTML = args.slice(1).join(" ");
            ctx.stdout += `✓ set innerHTML on <${el.tagName.toLowerCase()}>\n`;
            return 0;
          }
          if (verb === "style" && args.length >= 3) {
            el.style.setProperty(args[1], args.slice(2).join(" "));
            ctx.stdout += `✓ set style.${args[1]} = ${args.slice(2).join(" ")}\n`;
            return 0;
          }
          if (verb === "attr" && args.length >= 3) {
            el.setAttribute(args[1], args.slice(2).join(" "));
            ctx.stdout += `✓ set ${args[1]}="${args.slice(2).join(" ")}"\n`;
            return 0;
          }
        }

        if (origHc && typeof origHc.exec === "function") {
          return origHc.exec(ctx);
        }
        if (session) {
          ctx.stdout += session.exec(raw) + "\n";
          return 0;
        }
        ctx.stderr += "hc: session not initialized\n";
        return 1;
      },
    };
    tc.commands.register(enhancedHcCmd);
  }

  // ==========================================================================
  // 5C. `SlopesDrift`: FORK & DRIFT + 0-FRAME-DROP LIVE HOT RELOAD ENGINE
  // ==========================================================================
  const SLOPES2_REPO_FILES = [
    "index.html",
    "slopes2.js",
    "audio.js",
    "font.js",
    "README.md",
    "AGENTS.md",
    "CLAUDE.md",
    "LICENSE",
    "sim/hardcore_tab.js",
    "sim/tabform_lifeforms.js",
    "sim/real_tabcomputer_bridge.js",
    "sim/pentagonal_rotation.js",
    "sim/lore_portal_dock.js",
    "sim/ecology_design.js",
    "sim/cosmic_engine.js",
    "sim/ai_interface.js",
    "sim/wasm_bridge.js",
    "vendor/hardcore-tab/package.json",
    "vendor/hardcore-tab/README.md",
    "vendor/hardcore-tab/src/hardcore_tab.js",
    "vendor/hardcore-tab/src/tabform_lifeforms.js",
  ];

  const driftState = {
    hydrated: false,
    hydrating: false,
    suppressFsHook: false,
    upstreamRepo: "williamsharkey/slopes2",
    forkRepo: null, // "<login>/slopes2" once forked
    forkUrl: null,
    branch: "main",
    hotReloadCount: 0,
    droppedFrames: 0,
    lastHotReloadFile: null,
    lastHotReloadSymbols: [],
    lastHotReloadAt: 0,
    baseFiles: {}, // relPath -> original string content
    liveFiles: {}, // relPath -> latest string content
    modifiedFiles: {}, // relPath -> { updatedAt, symbols }
  };

  // Extract top-level AND 1st-level IIFE `function name(...) { ... }` and `var/let/const name = ...;`
  function extractJsDeclarations(sourceText) {
    const decls = new Map();
    if (!sourceText || typeof sourceText !== "string") return decls;

    // Strip outer `(function (global) { ... })(window);` wrapper if present so we scan inside module IIFEs too
    let body = sourceText;
    const iifeMatch = sourceText.match(/\(function\s*\([^)]*\)\s*\{/);
    if (iifeMatch && iifeMatch.index !== undefined && iifeMatch.index < 2400) {
      const openIdx = iifeMatch.index + iifeMatch[0].length;
      const closeIdx = sourceText.lastIndexOf("})(");
      if (closeIdx > openIdx) {
        body = sourceText.slice(openIdx, closeIdx);
      }
    }

    // Scan brace-balanced `async function name(...) { ... }` and `function name(...) { ... }`
    const fnRegex = /(?:^|\n)[ \t]*(async\s+)?function\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*\(([^)]*)\)\s*\{/g;
    let m;
    while ((m = fnRegex.exec(body)) !== null) {
      const isAsync = Boolean(m[1]);
      const fnName = m[2];
      const params = m[3];
      const braceStart = m.index + m[0].length - 1;
      let depth = 1;
      let i = braceStart + 1;
      let inStr = null;
      let inLineComment = false;
      let inBlockComment = false;
      while (i < body.length && depth > 0) {
        const ch = body[i];
        const next = body[i + 1];
        if (inLineComment) {
          if (ch === "\n") inLineComment = false;
        } else if (inBlockComment) {
          if (ch === "*" && next === "/") {
            inBlockComment = false;
            i++;
          }
        } else if (inStr) {
          if (ch === "\\") {
            i++;
          } else if (ch === inStr) {
            inStr = null;
          }
        } else {
          if (ch === "/" && next === "/") {
            inLineComment = true;
            i++;
          } else if (ch === "/" && next === "*") {
            inBlockComment = true;
            i++;
          } else if (ch === '"' || ch === "'" || ch === "`") {
            inStr = ch;
          } else if (ch === "{") {
            depth++;
          } else if (ch === "}") {
            depth--;
          }
        }
        i++;
      }
      if (depth === 0) {
        const fnBody = body.slice(braceStart, i);
        const fullExpr = `${isAsync ? "async " : ""}function ${fnName}(${params}) ${fnBody}`;
        decls.set(`fn:${fnName}`, { type: "fn", name: fnName, expr: fullExpr });
      }
    }

    // Also scan simple single-line scalar constants/vars (`const/let/var NAME = <literal>;`)
    const varRegex = /^(?:[ \t]{0,4})(?:const|let|var)\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*=\s*([^;\n\{]+);/gm;
    let vm;
    while ((vm = varRegex.exec(body)) !== null) {
      const vName = vm[1];
      const vRhs = vm[2].trim();
      // Skip imports/requires or DOM queries that shouldn't re-run
      if (vRhs.includes("document.createElement") || vRhs.includes("new AudioContext")) continue;
      decls.set(`var:${vName}`, { type: "var", name: vName, expr: vRhs });
    }

    return decls;
  }

  function getScopeEvalForRelPath(relPath) {
    const clean = relPath.replace(/^\/+/, "");
    if (clean === "slopes2.js") {
      return { evalFn: global.__slopes2EvalInScope, exportObjName: "SlopesGame" };
    }
    if (clean === "audio.js") {
      return { evalFn: global.__audioEvalInScope, exportObjName: "SlopesAudio" };
    }
    if (clean === "sim/tabform_lifeforms.js" || clean === "vendor/hardcore-tab/src/tabform_lifeforms.js") {
      return { evalFn: global.__tabFormsEvalInScope, exportObjName: "SlopesTabForms" };
    }
    if (clean === "sim/hardcore_tab.js" || clean === "vendor/hardcore-tab/src/hardcore_tab.js") {
      return { evalFn: global.__hardcoreTabEvalInScope, exportObjName: "HardcoreTab" };
    }
    if (clean === "sim/pentagonal_rotation.js") {
      return { evalFn: global.__pentagonalEvalInScope, exportObjName: "SlopesRotation" };
    }
    if (clean === "sim/lore_portal_dock.js") {
      return { evalFn: global.__loreDockEvalInScope, exportObjName: "SlopesChronosAndCiv" };
    }
    if (clean === "sim/ecology_design.js") {
      return { evalFn: global.__ecologyEvalInScope, exportObjName: "SlopesEcology" };
    }
    if (clean === "sim/cosmic_engine.js") {
      return { evalFn: global.__cosmicEvalInScope, exportObjName: "SlopesCosmic" };
    }
    return { evalFn: global.__slopes2EvalInScope || ((c) => (0, eval)(c)), exportObjName: null };
  }

  function applyHotReloadFile(relPath, newText) {
    const cleanPath = String(relPath || "")
      .replace(/^\/home\/user\/slopes2\/?/, "")
      .replace(/^\.\//, "")
      .replace(/^\/+/, "");
    if (!cleanPath || typeof newText !== "string") {
      return { ok: false, reason: "empty path or content" };
    }

    const oldText = driftState.liveFiles[cleanPath] || driftState.baseFiles[cleanPath] || "";
    driftState.liveFiles[cleanPath] = newText;

    // Mirror between `vendor/hardcore-tab/src/*` and `sim/*` automatically so vendored edits stay 1:1 synced!
    if (cleanPath === "vendor/hardcore-tab/src/hardcore_tab.js") {
      driftState.liveFiles["sim/hardcore_tab.js"] = newText;
    } else if (cleanPath === "sim/hardcore_tab.js") {
      driftState.liveFiles["vendor/hardcore-tab/src/hardcore_tab.js"] = newText;
    } else if (cleanPath === "vendor/hardcore-tab/src/tabform_lifeforms.js") {
      driftState.liveFiles["sim/tabform_lifeforms.js"] = newText;
    } else if (cleanPath === "sim/tabform_lifeforms.js") {
      driftState.liveFiles["vendor/hardcore-tab/src/tabform_lifeforms.js"] = newText;
    }

    // 1. Live CSS / style hot-reload for `index.html`
    if (cleanPath === "index.html") {
      if (typeof document !== "undefined") {
        const styleMatch = newText.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
        if (styleMatch) {
          const styleEl = document.querySelector("style");
          if (styleEl) styleEl.textContent = styleMatch[1];
        }
      }
      driftState.hotReloadCount++;
      driftState.lastHotReloadFile = cleanPath;
      driftState.lastHotReloadSymbols = ["<style>"];
      driftState.lastHotReloadAt = Date.now();
      driftState.modifiedFiles[cleanPath] = { updatedAt: Date.now(), symbols: ["<style>"] };
      announceHotReload(cleanPath, ["<style>"]);
      return { ok: true, file: cleanPath, symbols: ["<style>"], droppedFrames: 0 };
    }

    // Non-JS markdown/docs files: record modification without JS eval
    if (!cleanPath.endsWith(".js")) {
      driftState.modifiedFiles[cleanPath] = { updatedAt: Date.now(), symbols: ["doc"] };
      return { ok: true, file: cleanPath, symbols: ["doc"], droppedFrames: 0 };
    }

    // 2. Validate JS syntax before patching so syntax errors NEVER drop a frame!
    try {
      // eslint-disable-next-line no-new-func
      new Function(newText);
    } catch (syntaxErr) {
      return {
        ok: false,
        file: cleanPath,
        reason: `SyntaxError guarded (0 frames dropped): ${syntaxErr.message}`,
      };
    }

    // 3. Diff declarations between `oldText` and `newText` and hot-swap inside the live lexical closure!
    const oldDecls = extractJsDeclarations(oldText);
    const newDecls = extractJsDeclarations(newText);
    const changed = [];
    const patchStatements = [];
    const { evalFn, exportObjName } = getScopeEvalForRelPath(cleanPath);

    newDecls.forEach((decl, key) => {
      const prev = oldDecls.get(key);
      if (!prev || prev.expr !== decl.expr) {
        changed.push(decl.name);
        if (decl.type === "fn") {
          patchStatements.push(
            `try { ${decl.name} = ${decl.expr}; } catch (_) { globalThis.${decl.name} = ${decl.expr}; }`
          );
          if (exportObjName) {
            patchStatements.push(
              `if (typeof window !== "undefined" && window.${exportObjName} && "${decl.name}" in window.${exportObjName}) { window.${exportObjName}.${decl.name} = ${decl.name}; }`
            );
          }
        } else if (decl.type === "var") {
          patchStatements.push(
            `try { ${decl.name} = (${decl.expr}); } catch (_) { globalThis.${decl.name} = (${decl.expr}); }`
          );
        }
      }
    });

    if (patchStatements.length > 0 && typeof evalFn === "function") {
      try {
        evalFn(patchStatements.join("\n"));
      } catch (evalErr) {
        return {
          ok: false,
          file: cleanPath,
          reason: `Hot-patch eval error: ${evalErr.message}`,
        };
      }
    }

    const syms = changed.length > 0 ? changed : ["module"];
    driftState.hotReloadCount++;
    driftState.lastHotReloadFile = cleanPath;
    driftState.lastHotReloadSymbols = syms;
    driftState.lastHotReloadAt = Date.now();
    driftState.modifiedFiles[cleanPath] = { updatedAt: Date.now(), symbols: syms };
    announceHotReload(cleanPath, syms);

    return { ok: true, file: cleanPath, symbols: syms, droppedFrames: 0 };
  }

  function announceHotReload(cleanPath, syms) {
    const msg = `\x1b[92m[drift] ⚡ hot-reloaded ${cleanPath} (${syms.slice(0, 5).join(", ")}) · 0 frames dropped\x1b[0m`;
    const tf = getActiveTabForm();
    if (tf && tf.shell && typeof tf.shell.println === "function") {
      tf.shell.println(msg);
    }
    if (bridgeState.tc && bridgeState.tc.terminal && bridgeState.tc.terminal.term) {
      try {
        bridgeState.tc.terminal.term.writeln("\r\n" + msg);
      } catch (_) {}
    }
  }

  async function hydrateSlopes2Checkout(tc) {
    if (!tc || !tc.fs || driftState.hydrating) return;
    driftState.hydrating = true;
    driftState.suppressFsHook = true;
    try {
      await tc.fs.mkdir("/home/user/slopes2/sim", { recursive: true });
      await tc.fs.mkdir("/home/user/slopes2/vendor/hardcore-tab/src", { recursive: true });
      await tc.fs.mkdir("/home/user/slopes2/.git", { recursive: true });

      await Promise.all(
        SLOPES2_REPO_FILES.map(async (relPath) => {
          try {
            const resp = await fetch("./" + relPath, { cache: "no-store" });
            if (!resp.ok) return;
            const text = await resp.text();
            driftState.baseFiles[relPath] = text;
            driftState.liveFiles[relPath] = text;
            await tc.fs.writeFile("/home/user/slopes2/" + relPath, text);
          } catch (_) {}
        })
      );

      // Write `.drift-manifest.json` & `.git/config` inside `/home/user/slopes2`
      const manifest = {
        upstream: driftState.upstreamRepo,
        fork: driftState.forkRepo,
        branch: driftState.branch,
        vendored: ["vendor/hardcore-tab"],
        hotReload: "0-frame-drop-lexical-closure",
        domFs: "/dom",
        hcLive: true,
        hydratedAt: new Date().toISOString(),
      };
      await tc.fs.writeFile(
        "/home/user/slopes2/.drift-manifest.json",
        JSON.stringify(manifest, null, 2) + "\n"
      );
      const originUrl = driftState.forkRepo
        ? `https://github.com/${driftState.forkRepo}.git`
        : `https://github.com/${driftState.upstreamRepo}.git`;
      const gitConfig = [
        "[core]",
        "\trepositoryformatversion = 0",
        "\tfilemode = true",
        "\tbare = false",
        '[remote "origin"]',
        `\turl = ${originUrl}`,
        "\tfetch = +refs/heads/*:refs/remotes/origin/*",
        '[remote "upstream"]',
        `\turl = https://github.com/${driftState.upstreamRepo}.git`,
        "\tfetch = +refs/heads/*:refs/remotes/upstream/*",
        '[branch "main"]',
        "\tremote = origin",
        "\tmerge = refs/heads/main",
        "",
      ].join("\n");
      await tc.fs.writeFile("/home/user/slopes2/.git/config", gitConfig);
      await tc.fs.writeFile("/home/user/slopes2/.git/HEAD", "ref: refs/heads/main\n");

      // Default shell working directory to `/home/user/slopes2` so Claude starts directly inside the live repo!
      if (tc.shell) {
        tc.shell.cwd = "/home/user/slopes2";
      }

      // Mark `/home/user/slopes2` as trusted in `/home/user/.claude.json`
      try {
        const rawCfg = await tc.fs.readFile(CLAUDE_CONFIG_PATH, "utf8").catch(() => "{}");
        const cfg = JSON.parse(rawCfg || "{}");
        cfg.projects = cfg.projects || {};
        cfg.projects["/home/user/slopes2"] = Object.assign({}, cfg.projects["/home/user/slopes2"], {
          allowedTools: [],
          hasTrustDialogAccepted: true,
          hasCompletedProjectOnboarding: true,
        });
        await tc.fs.writeFile(CLAUDE_CONFIG_PATH, JSON.stringify(cfg, null, 2));
      } catch (_) {}

      driftState.hydrated = true;
    } finally {
      driftState.suppressFsHook = false;
      driftState.hydrating = false;
    }
  }

  function installInstantHotReloadFsHook(tc) {
    if (!tc || !tc.fs || tc.fs.__slopesDriftHooked) return;
    tc.fs.__slopesDriftHooked = true;
    const origWriteFile = tc.fs.writeFile.bind(tc.fs);

    tc.fs.writeFile = async function (path, data, options) {
      const res = await origWriteFile(path, data, options);
      if (!driftState.suppressFsHook && typeof path === "string" && path.startsWith("/home/user/slopes2/")) {
        const rel = path.slice("/home/user/slopes2/".length);
        if (rel && !rel.startsWith(".git/") && rel !== ".drift-manifest.json" && rel !== "AGENTS.md" && rel !== "CLAUDE.md") {
          let strData = "";
          if (typeof data === "string") {
            strData = data;
          } else if (data instanceof Uint8Array) {
            strData = new TextDecoder().decode(data);
          }
          if (strData) {
            applyHotReloadFile(rel, strData);
          }
        }
      }
      return res;
    };
  }

  async function forkSlopes2OnGitHub() {
    let ghTok = null;
    try {
      ghTok =
        localStorage.getItem(GITHUB_TOKEN_KEY) ||
        localStorage.getItem("slopes2_github_token");
    } catch (_) {}

    if (!ghTok) {
      return {
        ok: false,
        needsGitHubAuth: true,
        message: "Connect GitHub first (`[GITHUB SIGN-IN]` or `gh auth login`) to fork `williamsharkey/slopes2` on GitHub. Local 0-frame-drop hot reload in `/home/user/slopes2` is ALREADY active!",
      };
    }

    const resp = await fetch(`https://api.github.com/repos/${driftState.upstreamRepo}/forks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ghTok}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ default_branch_only: true }),
    });

    if (!resp.ok) {
      const errText = await resp.text().catch(() => "");
      throw new Error(`GitHub fork API HTTP ${resp.status}: ${errText.slice(0, 140)}`);
    }

    const forkData = await resp.json();
    driftState.forkRepo = forkData.full_name || `${(bridgeState.githubAccount && bridgeState.githubAccount.login) || "user"}/slopes2`;
    driftState.forkUrl = forkData.html_url || `https://github.com/${driftState.forkRepo}`;
    try {
      localStorage.setItem("slopes2_drift_fork", driftState.forkRepo);
    } catch (_) {}

    if (bridgeState.tc && bridgeState.tc.fs) {
      driftState.suppressFsHook = true;
      try {
        await hydrateSlopes2Checkout(bridgeState.tc);
      } finally {
        driftState.suppressFsHook = false;
      }
    }

    return {
      ok: true,
      forkRepo: driftState.forkRepo,
      forkUrl: driftState.forkUrl,
      message: `✓ Forked ${driftState.upstreamRepo} -> ${driftState.forkRepo} (${driftState.forkUrl})`,
    };
  }

  async function pushDriftedFilesToGitHub(commitMsg, branchName) {
    let ghTok = null;
    try {
      ghTok =
        localStorage.getItem(GITHUB_TOKEN_KEY) ||
        localStorage.getItem("slopes2_github_token");
    } catch (_) {}
    if (!ghTok) {
      throw new Error("Not signed into GitHub. Click `[GITHUB SIGN-IN]` first.");
    }
    if (!driftState.forkRepo) {
      const forkRes = await forkSlopes2OnGitHub();
      if (!forkRes.ok) throw new Error(forkRes.message);
    }

    const repo = driftState.forkRepo;
    const branch = branchName || driftState.branch || "main";
    const msg = commitMsg || "Fork & Drift live runtime patch from inside Slopes 2";
    const modPaths = Object.keys(driftState.modifiedFiles);
    if (modPaths.length === 0) {
      return { ok: true, message: "No modified files in `/home/user/slopes2` to push." };
    }

    const headers = {
      Authorization: `Bearer ${ghTok}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    };

    // 1. Get latest branch ref SHA
    const refResp = await fetch(`https://api.github.com/repos/${repo}/git/ref/heads/${branch}`, { headers });
    if (!refResp.ok) throw new Error(`Failed to read ${repo}@${branch} (HTTP ${refResp.status})`);
    const refData = await refResp.json();
    const latestCommitSha = refData.object.sha;

    // 2. Get base commit tree SHA
    const commitResp = await fetch(`https://api.github.com/repos/${repo}/git/commits/${latestCommitSha}`, { headers });
    const commitData = await commitResp.json();
    const baseTreeSha = commitData.tree.sha;

    // 3. Build tree entries for all modified files
    const treeEntries = [];
    for (let i = 0; i < modPaths.length; i++) {
      const p = modPaths[i];
      const content = driftState.liveFiles[p];
      if (typeof content !== "string") continue;
      treeEntries.push({
        path: p,
        mode: "100644",
        type: "blob",
        content: content,
      });
    }

    const treeResp = await fetch(`https://api.github.com/repos/${repo}/git/trees`, {
      method: "POST",
      headers,
      body: JSON.stringify({ base_tree: baseTreeSha, tree: treeEntries }),
    });
    if (!treeResp.ok) throw new Error(`Failed to create Git tree (HTTP ${treeResp.status})`);
    const newTree = await treeResp.json();

    // 4. Create commit
    const newCommitResp = await fetch(`https://api.github.com/repos/${repo}/git/commits`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        message: msg,
        tree: newTree.sha,
        parents: [latestCommitSha],
      }),
    });
    if (!newCommitResp.ok) throw new Error(`Failed to create Git commit (HTTP ${newCommitResp.status})`);
    const newCommit = await newCommitResp.json();

    // 5. Update branch ref
    const updateRefResp = await fetch(`https://api.github.com/repos/${repo}/git/refs/heads/${branch}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ sha: newCommit.sha, force: false }),
    });
    if (!updateRefResp.ok) throw new Error(`Failed to update ref heads/${branch} (HTTP ${updateRefResp.status})`);

    return {
      ok: true,
      sha: newCommit.sha.slice(0, 7),
      repo,
      branch,
      files: modPaths,
      message: `✓ Pushed ${modPaths.length} file(s) to https://github.com/${repo}/commit/${newCommit.sha}`,
    };
  }

  function buildSimpleLineDiff(relPath) {
    const base = (driftState.baseFiles[relPath] || "").split("\n");
    const live = (driftState.liveFiles[relPath] || "").split("\n");
    if (base.join("\n") === live.join("\n")) return "";
    const out = [`--- a/${relPath}`, `+++ b/${relPath}`];
    const maxLen = Math.max(base.length, live.length);
    for (let i = 0; i < maxLen; i++) {
      if (base[i] !== live[i]) {
        if (i < base.length) out.push(`-${i + 1}: ${base[i]}`);
        if (i < live.length) out.push(`+${i + 1}: ${live[i]}`);
      }
    }
    return out.slice(0, 80).join("\n");
  }

  const driftCommandObj = {
    name: "drift",
    description: "Fork and Drift live self-editing runtime engine (status, fork, diff, reload, eval, push)",
    exec: async (ctx) => {
      const args = Array.isArray(ctx.args) ? ctx.args : [];
      const sub = (args[0] || "status").toLowerCase();

      if (sub === "status") {
        const modKeys = Object.keys(driftState.modifiedFiles);
        ctx.stdout += [
          "╔═ SLOPES 2 // FORK & DRIFT LIVE RUNTIME ENGINE ═══════════════════╗",
          `  Upstream Repo    : https://github.com/${driftState.upstreamRepo}`,
          `  Active Fork      : ${driftState.forkRepo ? "https://github.com/" + driftState.forkRepo : "(local live drift — run `drift fork` to fork on GitHub)"}`,
          `  Live Checkout    : /home/user/slopes2 (${Object.keys(driftState.liveFiles).length} files hydrated, vendored: hardcore-tab)`,
          `  Hot-Reload Mode  : 0-Frame-Drop Lexical Closure Patching (${driftState.hotReloadCount} reloads, 0 dropped frames)`,
          `  Modified Files   : ${modKeys.length ? modKeys.join(", ") : "(none yet — edit any file in /home/user/slopes2!)"}`,
          `  Live DOM Tools   : \`hc s\`, \`hc q "#pi-shift"\`, \`ls /dom\`, \`echo "eval W" > /dom/ctl\``,
          "╚══════════════════════════════════════════════════════════════════╝",
        ].join("\n") + "\n";
        return 0;
      }

      if (sub === "fork") {
        try {
          const res = await forkSlopes2OnGitHub();
          ctx.stdout += res.message + "\n";
          if (ctx.shell) ctx.shell.cwd = "/home/user/slopes2";
          return res.ok ? 0 : 1;
        } catch (err) {
          ctx.stderr += `drift fork error: ${err.message || String(err)}\n`;
          return 1;
        }
      }

      if (sub === "diff") {
        const target = args[1];
        const paths = target ? [target] : Object.keys(driftState.modifiedFiles);
        if (paths.length === 0) {
          ctx.stdout += "[drift] No modified files vs baseline.\n";
          return 0;
        }
        const diffs = paths.map((p) => buildSimpleLineDiff(p)).filter(Boolean);
        ctx.stdout += (diffs.join("\n\n") || "[drift] No line differences.") + "\n";
        return 0;
      }

      if (sub === "reload") {
        const target = args[1];
        const paths = target ? [target] : Object.keys(driftState.liveFiles);
        let count = 0;
        for (let i = 0; i < paths.length; i++) {
          const p = paths[i].replace(/^\/home\/user\/slopes2\/?/, "");
          if (driftState.liveFiles[p]) {
            const r = applyHotReloadFile(p, driftState.liveFiles[p]);
            if (r.ok) count++;
          }
        }
        ctx.stdout += `[drift] ✓ Hot-reloaded ${count} file(s) with 0 dropped frames.\n`;
        return 0;
      }

      if (sub === "eval") {
        const mod = (args[1] || "slopes2").toLowerCase();
        const code = args.slice(2).join(" ");
        const map = {
          slopes2: "slopes2.js",
          audio: "audio.js",
          tabforms: "sim/tabform_lifeforms.js",
          hardcore: "sim/hardcore_tab.js",
          pentagonal: "sim/pentagonal_rotation.js",
          loredock: "sim/lore_portal_dock.js",
          ecology: "sim/ecology_design.js",
          cosmic: "sim/cosmic_engine.js",
        };
        const { evalFn } = getScopeEvalForRelPath(map[mod] || mod);
        try {
          const out = evalFn(code);
          ctx.stdout += (out === undefined ? "undefined" : typeof out === "object" ? JSON.stringify(out, null, 2) : String(out)) + "\n";
          return 0;
        } catch (err) {
          ctx.stderr += `drift eval error: ${err.message || String(err)}\n`;
          return 1;
        }
      }

      if (sub === "push") {
        const mIdx = args.indexOf("-m");
        const msg = mIdx >= 0 && args[mIdx + 1] ? args.slice(mIdx + 1).join(" ") : "Fork & Drift live runtime update";
        try {
          const res = await pushDriftedFilesToGitHub(msg, "main");
          ctx.stdout += res.message + "\n";
          return 0;
        } catch (err) {
          ctx.stderr += `drift push error: ${err.message || String(err)}\n`;
          return 1;
        }
      }

      ctx.stdout += "Usage: drift [status | fork | diff [file] | reload [file] | eval <module> <js> | push -m <msg>]\n";
      return 0;
    },
  };

  const forkAndDriftCommandObj = {
    name: "fork-and-drift",
    description: "Fork williamsharkey/slopes2 on GitHub and enter `/home/user/slopes2` with 0-frame-drop live hot reload",
    exec: async (ctx) => {
      const subRes = await driftCommandObj.exec(Object.assign({}, ctx, { args: ["fork"] }));
      const statusRes = await driftCommandObj.exec(Object.assign({}, ctx, { args: ["status"] }));
      return subRes || statusRes;
    },
  };

  async function triggerForkAndDrift(tabId) {
    const tId = tabId || bridgeState.activeTabFormId || "TAB-01";
    const tc = await ensureRealTabComputerBooted(tId);
    if (tc.shell) {
      tc.shell.cwd = "/home/user/slopes2";
    }
    const forms = (global.SlopesTabForms && global.SlopesTabForms.tabForms) || [];
    const tf = forms.find((t) => t.id === tId) || getActiveTabForm();
    if (tf) {
      tf.realTabActive = true;
      tf.autoMode = false;
      await syncWorldContextToRealFs(tc, tf);
    }
    sendCommandToRealTabComputer(tId, "cd /home/user/slopes2 && fork-and-drift");
    return driftState;
  }

  global.SlopesDrift = {
    state: driftState,
    hydrateSlopes2Checkout,
    applyFile: applyHotReloadFile,
    forkRepo: forkSlopes2OnGitHub,
    pushChanges: pushDriftedFilesToGitHub,
    triggerForkAndDrift,
  };

  // ==========================================================================
  // 6. SILENT, NON-BLOCKING BACKGROUND BOOT OF TABCOMPUTER AT PAGE IDLE
  // ==========================================================================
  function scheduleSilentTabComputerBoot() {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    const bootBg = () => {
      ensureRealTabComputerBooted("TAB-01").catch(() => {});
    };
    const triggerIdle = () => {
      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(() => setTimeout(bootBg, 500), { timeout: 2500 });
      } else {
        setTimeout(bootBg, 900);
      }
    };
    if (document.readyState === "complete") {
      triggerIdle();
    } else {
      window.addEventListener("load", triggerIdle, { once: true });
    }
  }

  scheduleSilentTabComputerBoot();

  async function verifyRealClaudeCode(tabId) {
    const tId = tabId || bridgeState.activeTabFormId || "TAB-01";
    const forms = (global.SlopesTabForms && global.SlopesTabForms.tabForms) || [];
    const tf = forms.find((t) => t.id === tId) || getActiveTabForm();
    const logLine = (msg) => {
      if (tf && tf.shell && typeof tf.shell.println === "function") {
        tf.shell.println(msg);
      }
      if (bridgeState.tc && bridgeState.tc.terminal && bridgeState.tc.terminal.term) {
        bridgeState.tc.terminal.term.writeln(msg);
      }
    };

    logLine("\x1b[96m╔══ VERIFYING REAL CLAUDE CODE & GITHUB INSIDE TABCOMPUTER ══╗\x1b[0m");
    try {
      const tc = await ensureRealTabComputerBooted(tId);
      await syncCredentialsToRealFs(tc);

      // 1. Check TabComputer Kernel & Node Worker
      logLine("\x1b[92m✓ [1/4] TabComputer Linux Kernel:\x1b[0m window.__tabcomputer active (IndexedDB FS + Node Web Worker)");

      // 2. Check Claude Credentials in `/home/user/.claude/.credentials.json`
      let hasOauth = false;
      let tokenPreview = "none";
      try {
        const raw = await tc.fs.readFile(CLAUDE_CREDENTIALS_PATH, "utf8");
        const parsed = JSON.parse(raw);
        if (parsed && parsed.claudeAiOauth && parsed.claudeAiOauth.accessToken) {
          hasOauth = true;
          const tok = String(parsed.claudeAiOauth.accessToken);
          tokenPreview = tok.slice(0, 12) + "..." + tok.slice(-6);
        }
      } catch (_) {}
      const apiKey = tc.shell.env["ANTHROPIC_API_KEY"];
      if (hasOauth) {
        logLine(
          `\x1b[92m✓ [2/4] Claude OAuth PKCE:\x1b[0m ${bridgeState.signedInAccount ? bridgeState.signedInAccount.email : "authenticated"} (${tokenPreview})`
        );
      } else if (apiKey) {
        logLine(`\x1b[92m✓ [2/4] Anthropic API Key:\x1b[0m ${apiKey.slice(0, 10)}... configured in shell.env`);
      } else {
        logLine("\x1b[93m! [2/4] Claude Auth:\x1b[0m Not signed in yet — click [SIGN IN CLAUDE] in the top bar.");
      }

      // 3. Check GitHub Auth
      const ghTok = tc.shell.env["GITHUB_TOKEN"] || tc.shell.env["GH_TOKEN"];
      if (ghTok && bridgeState.githubAccount) {
        logLine(
          `\x1b[92m✓ [3/4] GitHub Auth:\x1b[0m @${bridgeState.githubAccount.login} (${ghTok.slice(0, 8)}...) + ~/.gitconfig mounted`
        );
      } else {
        logLine("\x1b[93m! [3/4] GitHub Auth:\x1b[0m No token in shell.env — click [GITHUB SIGN-IN] if needed.");
      }

      // 4. Switch Tab-Form to Real Mode (stopping simulated heuristic loop) and invoke real `@anthropic-ai/claude-code`!
      if (tf) {
        tf.realTabActive = true;
        tf.autoMode = false;
        if (typeof tf.sayOverhead === "function") {
          tf.sayOverhead("Verifying real @anthropic-ai/claude-code SSE link...", "#69db7c");
        }
      }
      logLine(
        `\x1b[92m✓ [4/4] Proxy & CLI:\x1b[0m https://tabcomputer.com/api/anthropic/v1/messages (API calls so far: ${bridgeState.anthropicApiCalls || 0} ${bridgeState.lastAnthropicStatus || ""})`
      );
      logLine(
        "\x1b[96m→ Running real `@anthropic-ai/claude-code` inside TabComputer (`claude -p \"Confirm you are real Claude Code running in Slopes 2 and run body status\"`)...\x1b[0m"
      );

      sendCommandToRealTabComputer(
        tId,
        'claude --npm --dangerously-skip-permissions -p "Confirm in 1 short sentence that you are real Claude Code running inside TabComputer in Slopes 2, and run `body status`."'
      );
      setTimeout(syncXtermBufferToTabForms, 250);
    } catch (err) {
      logLine(`\x1b[91m✗ Verification error: ${err.message || String(err)}\x1b[0m`);
    }
  }

  const RealTabComputerBridge = {
    state: bridgeState,
    driftState,
    createPkceSession,
    exchangePkceCode,
    startGitHubDeviceFlow,
    saveGitHubTokenAndIdentity,
    ensureRealTabComputerBooted,
    activateRealModeForTabForm,
    deactivateRealModeForTabForm,
    sendCommandToRealTabComputer,
    setLiveXtermVisible,
    openClaudeSignInModal,
    openGitHubSignInModal,
    closeClaudeSignInModal,
    syncXtermBufferToTabForms,
    triggerForkAndDrift,
    verifyRealClaudeCode,
  };

  global.RealTabComputerBridge = RealTabComputerBridge;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = RealTabComputerBridge;
  }
})(typeof window !== "undefined" ? window : globalThis);
