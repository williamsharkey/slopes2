import{k as b,g as m,l as w}from"./index-BIxBofyG.js";import{p as y,G as d,f as _}from"./git-config-Jend4-Wv.js";import{ensureGitCredentialHelper as v}from"./git-credential-CsANuzZC.js";const E=Object.freeze(Object.defineProperty({__proto__:null,get DEFAULT_GITHUB_SCOPES(){return G},get GITHUB_OAUTH_CLIENT_ID(){return p},get GITHUB_TOKEN_KEY(){return f},get ensureGitIdentity(){return H},get openGitHubLoginPanel(){return C},get pollForToken(){return k},get requestDeviceCode(){return T},get saveGitHubToken(){return x}},Symbol.toStringTag,{value:"Module"})),p="Ov23liznflO83ISe0lvr",G=["repo","read:org","gist","workflow","user:email"],f="tabcomputer_github_token";async function h(e,t,o){const r=await e(`${m()}/api/github-login${t}`,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(o)}),i=await r.json().catch(()=>null);if(!r.ok&&!i?.error)throw new Error(`GitHub returned HTTP ${r.status}`);return i}async function T(e,t=fetch){const o=await h(t,"/login/device/code",{client_id:p,scope:e.join(" ")});if(o?.error)throw new Error(o.error==="device_flow_disabled"?"device flow is not enabled for the shiro.computer GitHub OAuth app":`${o.error}${o.error_description?": "+o.error_description:""}`);return o}async function k(e,t={}){const o=t.fetchImpl||fetch,r=t.sleep||(n=>new Promise(s=>setTimeout(s,n)));let i=Math.max(1,e.interval||5);const a=Date.now()+(e.expires_in||900)*1e3;for(;Date.now()<a;){if(await r(i*1e3),t.signal?.aborted)throw new Error("cancelled");const n=await h(o,"/login/oauth/access_token",{client_id:p,device_code:e.device_code,grant_type:"urn:ietf:params:oauth:grant-type:device_code"});if(n?.access_token)return n.access_token;switch(n?.error){case"authorization_pending":t.onStatus?.("waiting");break;case"slow_down":i=n.interval||i+5,t.onStatus?.("slow_down");break;case"expired_token":throw new Error("the code expired before it was approved");case"access_denied":throw new Error("access was denied on GitHub");default:throw new Error(n?.error_description||n?.error||"unexpected response from GitHub")}}throw new Error("the code expired before it was approved")}function x(e){try{localStorage.setItem(f,e)}catch{}}async function H(e,t,o=fetch){let r={};try{r=y(await e.readFile(d,"utf8"))}catch{}const i=()=>v(e,d).catch(()=>!1);if(r["user.name"]&&r["user.email"])return await i(),{};const a=c=>o(`${m()}/api/github${c}`,{headers:{Authorization:`Bearer ${t}`,Accept:"application/vnd.github+json"}}).then(l=>l.ok?l.json():null).catch(()=>null),n=await a("/user");if(!n?.login)return await i(),{};const s={};if(r["user.name"]||(s.name=r["user.name"]=n.name||n.login),!r["user.email"]){const c=await a("/user/emails"),l=Array.isArray(c)?c.find(u=>u.primary&&u.verified):null;s.email=r["user.email"]=l?.email||n.email||`${n.id}+${n.login}@users.noreply.github.com`}return await e.writeFile(d,_(r)),await i(),s}function g(e){return e.replace(/[&<>"']/g,t=>`&#${t.charCodeAt(0)};`)}function I(e){return`<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0d1117; color: #e6edf3;
    min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1.25rem; }
  .card { max-width: 360px; width: 100%; text-align: center; }
  h1 { font-size: 1.2rem; margin-bottom: 0.35rem; }
  p { color: #8b949e; font-size: 0.875rem; line-height: 1.4; }
  .code { font: 700 2rem/1 ui-monospace, Menlo, monospace; letter-spacing: 0.12em; margin: 1rem 0 0.75rem;
    padding: 0.75rem; border: 1px solid #30363d; border-radius: 8px; background: #010409; user-select: all; }
  .row { display: flex; gap: 0.5rem; }
  .btn { flex: 1; display: block; padding: 11px 14px; font-size: 0.95rem; font-weight: 600; border: 1px solid #30363d;
    border-radius: 8px; cursor: pointer; text-decoration: none; background: #21262d; color: #e6edf3; }
  .primary { background: #238636; border-color: #238636; color: #fff; }
  .status { margin-top: 0.9rem; font-size: 0.85rem; color: #8b949e; min-height: 1.2em; }
  .ok { color: #3fb950; } .err { color: #f85149; }
</style></head><body><div class="card">
  <h1>Sign in to GitHub</h1>
  <p>Copy the code, open GitHub, and paste it there to give gh and git access.</p>
  <div class="code" id="code">${g(e.user_code)}</div>
  <div class="row">
    <button class="btn" id="copy" type="button">Copy code</button>
    <a class="btn primary" id="open" href="${g(e.verification_uri)}" target="_blank" rel="noopener">Open GitHub</a>
  </div>
  <div class="status" id="status">Waiting for you to approve on GitHub…</div>
  <p style="margin-top:0.9rem"><a href="#" id="cancel" style="color:#8b949e">Cancel</a></p>
</div><script>
  var statusEl = document.getElementById('status');
  document.getElementById('copy').addEventListener('click', function () {
    parent.postMessage({ type: 'gh-login-copy' }, '*');
    this.textContent = 'Copied';
  });
  document.getElementById('open').addEventListener('click', function () {
    parent.postMessage({ type: 'gh-login-copy' }, '*');
  });
  document.getElementById('cancel').addEventListener('click', function (e) {
    e.preventDefault(); parent.postMessage({ type: 'gh-login-cancel' }, '*');
  });
  window.addEventListener('message', function (e) {
    if (e.source !== parent || !e.data) return;
    if (e.data.type === 'gh-login-status') { statusEl.textContent = e.data.text; statusEl.className = 'status ' + (e.data.cls || ''); }
  });
<\/script></body></html>`}function C(e){const t=new AbortController;let o=!1;const r=a=>{a.source!==i.iframe.contentWindow||!a.data||(a.data.type==="gh-login-copy"&&w(e.user_code),a.data.type==="gh-login-cancel"&&(t.abort(),i.close()))},i=b({mode:"iframe",title:"Sign in to GitHub",width:"24em",height:"22em",appId:"github-signin",appName:"GitHub Sign-in",onClose:()=>{o=!0,window.removeEventListener("message",r),t.signal.aborted||t.abort()}});return window.addEventListener("message",r),i.updateIframe(I(e)),{setStatus:(a,n)=>{o||i.iframe.contentWindow?.postMessage({type:"gh-login-status",text:a,cls:n},"*")},close:()=>{o||i.close()},signal:t.signal}}(globalThis.__tabcomputerLive??=new Map).set("src/github-auth.ts",E);export{G as DEFAULT_GITHUB_SCOPES,p as GITHUB_OAUTH_CLIENT_ID,f as GITHUB_TOKEN_KEY,H as ensureGitIdentity,C as openGitHubLoginPanel,k as pollForToken,T as requestDeviceCode,x as saveGitHubToken};
