const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./relay-fetch-CRpq50db.js","./index-C6zxlZK4.js","./index-LZoznX6r.css"])))=>i.map(i=>d[i]);
import{j as y,k as h,g as p,l as _,m as v,a as f}from"./index-C6zxlZK4.js";import{p as E,G as d,f as T}from"./git-config-Jend4-Wv.js";import{ensureGitCredentialHelper as k}from"./git-credential-CdJe7MpX.js";const G=Object.freeze(Object.defineProperty({__proto__:null,get DEFAULT_GITHUB_SCOPES(){return x},get GITHUB_OAUTH_CLIENT_ID(){return u},get GITHUB_TOKEN_KEY(){return w},get ensureGitIdentity(){return L},get openGitHubLoginPanel(){return O},get pollForToken(){return I},get requestDeviceCode(){return H},get saveGitHubToken(){return S},get tokenScopes(){return C}},Symbol.toStringTag,{value:"Module"})),u="Ov23liznflO83ISe0lvr",x=["repo","read:org","gist","workflow","user:email"],w="tabcomputer_github_token";async function b(e,t,r){let o;if(v()==="private"){const{relayAvailable:a,relayFetch:n}=await f(async()=>{const{relayAvailable:s,relayFetch:c}=await import("./relay-fetch-CRpq50db.js");return{relayAvailable:s,relayFetch:c}},__vite__mapDeps([0,1,2]),import.meta.url);if(!a())throw new Error("private network mode needs the relay for GitHub sign-in, and this page has none (netmode proxy turns it off)");o=await n(`https://github.com${t}`,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded",Accept:"application/json"},body:new URLSearchParams(r).toString()})}else o=await e(`${p()}/api/github-login${t}`,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(r)});const i=await o.json().catch(()=>null);if(!o.ok&&!i?.error)throw new Error(`GitHub returned HTTP ${o.status}`);return i}async function H(e,t=fetch){const r=await b(t,"/login/device/code",{client_id:u,scope:e.join(" ")});if(r?.error)throw new Error(r.error==="device_flow_disabled"?"device flow is not enabled for the shiro.computer GitHub OAuth app":`${r.error}${r.error_description?": "+r.error_description:""}`);return r}async function I(e,t={}){const r=t.fetchImpl||fetch,o=t.sleep||(n=>new Promise(s=>setTimeout(s,n)));let i=Math.max(1,e.interval||5);const a=Date.now()+(e.expires_in||900)*1e3;for(;Date.now()<a;){if(await o(i*1e3),t.signal?.aborted)throw new Error("cancelled");const n=await b(r,"/login/oauth/access_token",{client_id:u,device_code:e.device_code,grant_type:"urn:ietf:params:oauth:grant-type:device_code"});if(n?.access_token)return n.access_token;switch(n?.error){case"authorization_pending":t.onStatus?.("waiting");break;case"slow_down":i=n.interval||i+5,t.onStatus?.("slow_down");break;case"expired_token":throw new Error("the code expired before it was approved");case"access_denied":throw new Error("access was denied on GitHub");default:throw new Error(n?.error_description||n?.error||"unexpected response from GitHub")}}throw new Error("the code expired before it was approved")}function S(e){try{localStorage.setItem(w,e)}catch{}}async function C(e,t=fetch){const r=await t(`${h(p())}/user`,{headers:{Authorization:`Bearer ${e}`,Accept:"application/vnd.github+json"}});if(!r.ok)throw new Error(`GitHub answered ${r.status}`);return(r.headers.get("x-oauth-scopes")??"").split(",").map(o=>o.trim()).filter(Boolean)}async function L(e,t,r=fetch){let o={};try{o=E(await e.readFile(d,"utf8"))}catch{}const i=()=>k(e,d).catch(()=>!1);if(o["user.name"]&&o["user.email"])return await i(),{};const a=c=>r(`${h(p())}${c}`,{headers:{Authorization:`Bearer ${t}`,Accept:"application/vnd.github+json"}}).then(l=>l.ok?l.json():null).catch(()=>null),n=await a("/user");if(!n?.login)return await i(),{};const s={};if(o["user.name"]||(s.name=o["user.name"]=n.name||n.login),!o["user.email"]){const c=await a("/user/emails"),l=Array.isArray(c)?c.find(m=>m.primary&&m.verified):null;s.email=o["user.email"]=l?.email||n.email||`${n.id}+${n.login}@users.noreply.github.com`}return await e.writeFile(d,T(o)),await i(),s}function g(e){return e.replace(/[&<>"']/g,t=>`&#${t.charCodeAt(0)};`)}function A(e){return`<!DOCTYPE html><html><head><meta charset="utf-8">
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
<\/script></body></html>`}function O(e){const t=new AbortController;let r=!1;const o=a=>{a.source!==i.iframe.contentWindow||!a.data||(a.data.type==="gh-login-copy"&&_(e.user_code),a.data.type==="gh-login-cancel"&&(t.abort(),i.close()))},i=y({mode:"iframe",title:"Sign in to GitHub",width:"24em",height:"22em",appId:"github-signin",appName:"GitHub Sign-in",onClose:()=>{r=!0,window.removeEventListener("message",o),t.signal.aborted||t.abort()}});return window.addEventListener("message",o),i.updateIframe(A(e)),{setStatus:(a,n)=>{r||i.iframe.contentWindow?.postMessage({type:"gh-login-status",text:a,cls:n},"*")},close:()=>{r||i.close()},signal:t.signal}}(globalThis.__tabcomputerLive??=new Map).set("src/github-auth.ts",G);(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/commands/relay-fetch.ts",()=>f(()=>import("./relay-fetch-CRpq50db.js"),__vite__mapDeps([0,1,2]),import.meta.url));export{x as DEFAULT_GITHUB_SCOPES,u as GITHUB_OAUTH_CLIENT_ID,w as GITHUB_TOKEN_KEY,L as ensureGitIdentity,O as openGitHubLoginPanel,I as pollForToken,H as requestDeviceCode,S as saveGitHubToken,C as tokenScopes};
