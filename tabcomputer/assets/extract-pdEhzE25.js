const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./async-context-DQbbg4Ro.js","./module-transform-D_-bb1Rm.js"])))=>i.map(i=>d[i]);
import{a as E}from"./index-3dop0BuN.js";import{zstdDecodeAll as J}from"./zstd-codec-BYgKNVoq.js";const G=Object.freeze(Object.defineProperty({__proto__:null,get BUN_TRAILER(){return j},get BunLoader(){return F},get NeedBytes(){return Y},get arraySource(){return R},get findElfSection(){return N},get parseBunGraph(){return I}},Symbol.toStringTag,{value:"Module"})),H=Object.freeze(Object.defineProperty({__proto__:null,get adaptModule(){return B},get transformModules(){return z},get vmModuleTransform(){return C}},Symbol.toStringTag,{value:"Module"})),K=Object.freeze(Object.defineProperty({__proto__:null,get VM_CACHE(){return W},get VM_LAYOUT(){return L},get adaptModule(){return B},get ensureClaudeVm(){return se},get ensureClaudeVmLayout(){return q},get launcherSource(){return V},get layoutInProgress(){return ne},get vmModuleTransform(){return C},get wsShimSource(){return D}},Symbol.toStringTag,{value:"Module"})),j=`
---- Bun! ----
`,F={js:1,file:5,napi:10,text:13},X=[52,44,36];class Y extends Error{ranges;constructor(t){super(`need ${t.length} byte ranges`),this.ranges=t}}function R(e){return{size:e.length,need(){},bytes:(t,a)=>{if(t<0||t+a>e.length)throw new RangeError("out of range");return e.subarray(t,t+a)}}}const A=(e,t)=>e[t]|e[t+1]<<8,S=(e,t)=>(e[t]|e[t+1]<<8|e[t+2]<<16|e[t+3]<<24)>>>0,x=(e,t)=>S(e,t)+S(e,t+4)*2**32;function N(e,t){const a=e instanceof Uint8Array?R(e):e;if(a.size<64)return null;a.need([[0,64]]);const o=a.bytes(0,64);if(o[0]!==127||o[1]!==69||o[2]!==76||o[3]!==70||o[4]!==2||o[5]!==1)return null;const i=x(o,40),c=A(o,58),n=A(o,60),d=A(o,62);if(!i||c<64||d>=n||i+n*c>a.size)return null;a.need([[i,n*c]]);const l=a.bytes(i,n*c),s=_=>_*c,f=x(l,s(d)+24),w=x(l,s(d)+32);if(f+w>a.size)return null;a.need([[f,w]]);const m=a.bytes(f,w),y=new TextEncoder().encode(t+"\0");for(let _=0;_<n;_++){const O=S(l,s(_));let g=O+y.length<=m.length;for(let h=0;g&&h<y.length;h++)g=m[O+h]===y[h];if(g)return[x(l,s(_)+24),x(l,s(_)+32)]}return null}function I(e){const t=e instanceof Uint8Array?R(e):e,a=N(t,".bun");if(!a)throw new Error("not a Bun executable (no .bun section)");const[o,i]=a;if(o+i>t.size||i<8)throw new Error(".bun section: out of range");t.need([[o,8]]);const c=x(t.bytes(o,8),0),n=o+8;if(c<48||c>i-8)throw new Error(".bun section: bad payload length");const d=n+c,l=j.length+32;t.need([[d-l,l]]);const s=t.bytes(d-l,l);if(new TextDecoder().decode(s.subarray(32))!==j)throw new Error(".bun section: no Bun trailer");const w=S(s,8),m=S(s,12),y=S(s,16);if(w+m>c)throw new Error(".bun section: module table out of range");t.need([[n+w,m]]);const _=t.bytes(n+w,m),O=new TextDecoder,g=(h,b)=>h+b<=c;for(const h of X){if(m%h)continue;const b=m/h,p=(r,u)=>[S(_,r*h+8*u),S(_,r*h+8*u+4)];let v=!0;for(let r=0;v&&r<b;r++)v=g(...p(r,0))&&g(...p(r,1));if(!v)continue;t.need(Array.from({length:b},(r,u)=>[n+p(u,0)[0],p(u,0)[1]]));const $=[];for(let r=0;v&&r<b;r++){const u=O.decode(t.bytes(n+p(r,0)[0],p(r,0)[1]));v=u.startsWith("/$bunfs/")||/^B:[\\/]~BUN[\\/]/.test(u),$.push(u)}if(!v)continue;t.need(Array.from({length:b},(r,u)=>[n+p(u,1)[0],p(u,1)[1]]));const T=$.map((r,u)=>{const M=u*h+h-4;return{name:r,contents:t.bytes(n+p(u,1)[0],p(u,1)[1]),bytecodeLength:h>=36?p(u,3)[1]:0,encoding:_[M],loader:_[M+1],format:_[M+2]}});if(y>=T.length)throw new Error(".bun section: entry point out of range");return{entry:T[y],modules:T}}throw new Error(".bun section: unknown module record layout")}(globalThis.__tabcomputerLive??=new Map).set("src/claude-vm/bun-graph.ts",G);const P="/$bunfs/root/";function B(e,t){const a="\0bunfs\0";let o=e.replace(/(\b(?:from|import)\s*\(?\s*)(["'])\/\$bunfs\/root\//g,(i,c,n)=>c+n+a);return o=o.split(P).join(t+"/").split(a).join(P),o=o.replace(/\bimport\.meta\.require\b/g,"Bun.__require(require)"),o=o.replace(/\bimport\.meta\.(?:dirname|dir)\b/g,"__dirname"),o=o.replace(/\bimport\.meta\.filename\b/g,"__filename"),o=o.replace(/\bimport\.meta\.url\b/g,'require("url").pathToFileURL(__filename).href'),`var Bun = globalThis.Bun;
`+o}async function C(){const[{transformESModules:e},{liveModule:t},{carryAsyncContext:a,carriesAsyncContext:o}]=await Promise.all([E(()=>import("./module-transform-D_-bb1Rm.js").then(i=>i.d),[],import.meta.url),E(()=>import("./module-transform-D_-bb1Rm.js").then(i=>i._),[],import.meta.url),E(()=>import("./async-context-DQbbg4Ro.js"),__vite__mapDeps([0,1]),import.meta.url)]);return(i,c)=>{const n=t(B(i,c),{unshadowed:!0,settle:!1});return e(n,o(n)?a:void 0)}}const Z=4<<20;async function z(e,t,a=()=>{}){const o=typeof Worker<"u"&&typeof window<"u"?await Q(e,t,a).catch(()=>null):null;if(o)return o;const i=await C(),c=new TextDecoder,n=new TextEncoder,d=[];let l=performance.now();for(const s of t)d.push(n.encode(i(c.decode(s),e))),a(d.length),performance.now()-l>50&&(await new Promise(f=>setTimeout(f,0)),l=performance.now());return d}async function Q(e,t,a){const o=new Worker(new URL(""+new URL("layout-worker-W1iRzKf4.js",import.meta.url).href,import.meta.url),{type:"module",name:"claude-vm-layout"});try{const i=[];let c=[],n=0;for(const s of t)c.push(s),n+=s.length,n>=Z&&(i.push(c),c=[],n=0);c.length&&i.push(c);const d=new Array(i.length);let l=0;return await new Promise((s,f)=>{let w=i.length;w||s(),o.onerror=m=>f(new Error(m.message||"the layout worker failed")),o.onmessage=m=>{if(m.data.error||!m.data.code){f(new Error(m.data.error??"the layout worker answered nothing"));return}d[m.data.id]=m.data.code,l+=m.data.code.length,a(l),--w===0&&s()},i.forEach((m,y)=>o.postMessage({id:y,dir:e,sources:m}))}),d.flat()}finally{o.terminate()}}(globalThis.__tabcomputerLive??=new Map).set("src/claude-vm/vm-transform.ts",H);(globalThis.__tabcomputerLiveUrls??=new Map).set("src/claude-vm/vm-transform.ts",import.meta.url);globalThis.__tabcomputerLiveUrls.set("src/claude-vm/vm-transform.ts|./layout-worker.ts",new URL(""+new URL("layout-worker-W1iRzKf4.js",import.meta.url).href,import.meta.url).href);(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/commands/jseval/module-transform.ts",()=>E(()=>import("./module-transform-D_-bb1Rm.js").then(e=>e.d),[],import.meta.url));(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/commands/jseval/esm-live.ts",()=>E(()=>import("./module-transform-D_-bb1Rm.js").then(e=>e._),[],import.meta.url));(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/node-compat/async-context.ts",()=>E(()=>import("./async-context-DQbbg4Ro.js"),__vite__mapDeps([0,1]),import.meta.url));const W=".cache/tabcomputer/claude-vm",L=9,U="/$bunfs/root/",ee=["console","process","global","Buffer","globalThis","Function","setTimeout","clearTimeout","setInterval","clearInterval","setImmediate","clearImmediate","self","WorkerGlobalScope","DedicatedWorkerGlobalScope"];function V(){return["// tabcomputer: claude --vm (src/claude-vm/extract.ts, module-store.ts)","const __vmTrace = process.env.TABCOMPUTER_VM_TRACE ? (p) => { try { require('fs').appendFileSync(process.env.TABCOMPUTER_VM_TRACE, (performance.timeOrigin + performance.now()).toFixed(1) + ' ' + p + '\\n'); } catch {} } : () => {};","__vmTrace('launcher');","const vm = require('tabcomputer:claude-vm');","const fs = require('fs');","const [{ createBun }, store] = await Promise.all([vm.load(), vm.modules()]);","const assets = JSON.parse(fs.readFileSync(__dirname + '/bun-assets.json', 'utf8'));","globalThis.Bun = createBun({ fs, process: process, childProcess: require('child_process'), net: require('net'), http: require('http'), Buffer: Buffer, assets: assets, main: __dirname + '/cli.js', transform: vm.transformSync });","const [bytes, index] = [await store.loadModules(__dirname, () => fs.readFileSync(__dirname + '/modules.js')), JSON.parse(fs.readFileSync(__dirname + '/modules.json', 'utf8'))];","__vmTrace('modules read');",`const globals = { ${ee.map(e=>`${e}: typeof ${e} === 'undefined' ? undefined : ${e}`).join(", ")} };`,"const loader = store.createModuleLoader({ dir: __dirname, bytes, index, outer: require, globals, live: require.live, settle: require.settle });","if (process.env.TABCOMPUTER_VM_TRACE) for (const s of [1, 3, 10]) setTimeout(() => { const t = loader.stats(); __vmTrace(`modules compiled after ${s} s: ${t.compiled} of ${t.modules}, ${(t.compiledBytes / 1048576).toFixed(1)} of ${(t.bytes / 1048576).toFixed(1)} MB`); }, s * 1000).unref?.();","loader.require(__dirname)('./cli.js');","__vmTrace('cli.js returned');","process.stdout.write('', () => __vmTrace('first stdout flush'));",""].join(`
`)}function D(){return`const { EventEmitter } = require('events');
const PROXIED = /^wss:[/][/]api[.]anthropic[.]com(:443)?[/]/i;
function proxyUrl() {
  if (process.env.TABCOMPUTER_NETWORK_MODE === 'private' && !process.env.TABCOMPUTER_VM_WS_PROXY) return null;
  let o = process.env.TABCOMPUTER_VM_WS_PROXY || '';
  if (!o) { try { o = require('tabcomputer:claude-vm').origin() || ''; } catch (e) { o = ''; } }
  return o ? o.replace(/[/]+$/, '').replace(/^http/, 'ws') + '/api/ws-proxy' : null;
}
function headersOf(opts) {
  const h = {}, src = opts && opts.headers;
  if (!src || typeof src !== 'object') return h;
  if (typeof src.forEach === 'function' && !Array.isArray(src)) { src.forEach((v, k) => { h[k] = String(v); }); return h; }
  for (const k of Object.keys(src)) if (src[k] != null) h[k] = Array.isArray(src[k]) ? src[k].join(', ') : String(src[k]);
  return h;
}
class WebSocket extends EventEmitter {
  constructor(url, protocols, opts) {
    super();
    if (protocols && !Array.isArray(protocols) && typeof protocols === 'object') { opts = protocols; protocols = undefined; }
    this.url = String(url);
    this._state = 0;
    this._protocol = '';
    const via = PROXIED.test(this.url) ? proxyUrl() : null;
    let ws;
    try { ws = this._ws = new globalThis.WebSocket(via || this.url, via ? undefined : protocols); } catch (e) {
      this._ws = null;
      Promise.resolve().then(() => { this._error(e); this._closed(1006, ''); });
      return;
    }
    ws.binaryType = 'arraybuffer';
    let hello = !via;
    ws.onopen = () => {
      if (!via) return this._opened(ws.protocol);
      ws.send(JSON.stringify({ url: this.url, headers: headersOf(opts), protocols: protocols == null ? [] : [].concat(protocols) }));
    };
    ws.onmessage = (e) => {
      if (!hello) {
        hello = true;
        let m = {};
        try { m = JSON.parse(String(e.data)); } catch (_) { /* not the proxy's */ }
        if (m.type === 'open') return this._opened(m.protocol || '');
        if (m.type === 'unexpected-response') return this._unexpected(m);
        this._failure = m.message || 'ws-proxy refused the connection';
        return;
      }
      if (this._state !== 1) return;
      const d = typeof e.data === 'string' ? e.data : Buffer.from(e.data);
      this.emit('message', d, typeof e.data !== 'string');
      if (this.onmessage) this.onmessage({ data: d, target: this });
    };
    ws.onerror = () => { if (!this._rejected && !this._errored) this._error(new Error(this._failure || 'WebSocket error')); };
    ws.onclose = (e) => {
      if (!this._everOpen) {
        if (!this._rejected && !this._errored) this._error(new Error(this._failure || 'WebSocket error'));
        return this._closed(1006, '');
      }
      this._closed(e.code, e.reason || '');
    };
  }
  _opened(protocol) {
    if (this._state !== 0) return;
    this._state = 1; this._everOpen = true; this._protocol = protocol || '';
    this.emit('open');
    if (this.onopen) this.onopen({ target: this });
  }
  _error(err) {
    this._errored = true;
    this.emit('error', err);
    if (this.onerror) this.onerror({ error: err, message: err.message, target: this });
  }
  _closed(code, reason) {
    if (this._done) return;
    this._done = true; this._state = 3;
    this.emit('close', code, Buffer.from(reason || ''));
    if (this.onclose) this.onclose({ code: code, reason: reason, target: this });
  }
  // as ws: the upgrade was answered with an HTTP status (401, 403, ...)
  _unexpected(m) {
    this._rejected = true;
    this._state = 2;
    const res = Object.assign(new EventEmitter(), { statusCode: m.status || 0, statusMessage: m.statusText || '', headers: m.headers || {}, resume() {}, destroy() {} });
    const req = { destroy() {}, abort() {} };
    if (this.listenerCount('unexpected-response') > 0) this.emit('unexpected-response', req, res);
    else this._error(new Error('Unexpected server response: ' + res.statusCode));
  }
  get readyState() { return this._state; }
  get protocol() { return this._protocol; }
  get bufferedAmount() { return this._ws ? this._ws.bufferedAmount : 0; }
  send(data, opts, cb) {
    if (typeof opts === 'function') { cb = opts; opts = undefined; }
    if (this._state !== 1) {
      const err = new Error('WebSocket is not open: readyState ' + this._state);
      if (this._state === 0) throw err;
      if (cb) cb(err);
      return;
    }
    if (opts && opts.binary === false && typeof data !== 'string') data = Buffer.from(data).toString();
    try { this._ws.send(data); if (cb) cb(); } catch (e) { if (cb) cb(e); }
  }
  close(code, reason) {
    if (this._state >= 2 || !this._ws) return;
    this._state = 2;
    try { if (code === 1000 || (code >= 3000 && code <= 4999)) this._ws.close(code, reason); else this._ws.close(); } catch (e) { this._ws.close(); }
  }
  terminate() { if (this._ws && this._state < 3) { this._state = 2; this._ws.close(); } }
  ping() {} pong() {}
}
WebSocket.CONNECTING = 0; WebSocket.OPEN = 1; WebSocket.CLOSING = 2; WebSocket.CLOSED = 3;
class WebSocketServer extends EventEmitter { constructor() { super(); throw new Error('ws: no WebSocket server in claude --vm yet'); } }
module.exports = WebSocket;
module.exports.WebSocket = WebSocket;
module.exports.WebSocketServer = module.exports.Server = WebSocketServer;
module.exports.default = WebSocket;
`}const te=e=>e.length>=4&&e[0]===40&&e[1]===181&&e[2]===47&&e[3]===253;async function re(e){const t=await crypto.subtle.digest("SHA-256",e);return[...new Uint8Array(t)].map(a=>a.toString(16).padStart(2,"0")).join("")}const oe=()=>{const e="43f764d2df6b68df72d41c8fedb78c877c2f5502";let t=2166136261;for(const a of`${e}:${L}`)t^=a.charCodeAt(0),t=Math.imul(t,16777619);return(t>>>0).toString(16).padStart(8,"0")};async function se(e,t,a,o=()=>{}){const i=`${a}/${W}`,c=`${i}/index.json`;let n={};try{n=JSON.parse(await e.readFile(c,"utf8"))??{}}catch{}const d=await e.stat(t),l=typeof d.mtime=="number"?d.mtime:d.mtime.getTime();let s=null,f=n[t]?.size===d.size&&n[t]?.mtime===l?n[t].sha256:"";f||(o(`claude --vm: reading the native build (${Math.round(d.size/2**20)} MB)...
`),s=await e.readFile(t),f=await re(s));const w=await q(e,f,a,async()=>I(s??=await e.readFile(t)),o);return n[t]={size:d.size,mtime:l,sha256:f},await e.mkdir(i,{recursive:!0}),await e.writeFile(c,JSON.stringify(n,null,2)+`
`),w}const k=new Map,ne=(e,t)=>k.has(`${e}\0${t}`);function q(e,t,a,o,i=()=>{}){const c=`${a}\0${t}`;let n=k.get(c);return n||(n=ae(e,t,a,o,i).finally(()=>k.delete(c)),k.set(c,n)),n}async function ae(e,t,a,o,i){const c=`${a}/${W}`,n=Date.now(),d=()=>`${((Date.now()-n)/1e3).toFixed(1)} s`,l=`${c}/${t}`,s=`${l}/nc-${oe()}`,f=`${s}/vm-main.mjs`,w=new Set,m=async r=>{w.has(r)||(w.add(r),await e.mkdir(r,{recursive:!0}))};if((await(async r=>{try{return await e.readFile(r,"utf8")}catch{return null}})(`${s}/complete`))?.trim()===String(L))return{dir:s,launcher:f,sha256:t,extracted:!1};const _=await o();i(`claude --vm: preparing Claude Code's JavaScript (once per version and tabcomputer build)...
`);const{putModules:O}=await E(async()=>{const{putModules:r}=await import("./module-store-BCGCEDLt.js");return{putModules:r}},[],import.meta.url),g=[],h={};for(const r of _.modules){if(!r.name.startsWith(U))continue;const u=`${s}/${r===_.entry?"cli.js":r.name.slice(U.length)}`;if(r.loader===F.js){g.push({path:u,contents:r.contents});continue}await m(u.slice(0,u.lastIndexOf("/"))),h[u]=r.loader,await e.writeFile(u,te(r.contents)?J(r.contents):r.contents.slice())}let b=0;const p=await z(s,g.map(r=>r.contents),r=>{r-b<500&&r<g.length||(b=r,i(`  ${r}/${g.length} modules (${d()})
`))}),v={};let $=0;g.forEach((r,u)=>{v[r.path]=[$,p[u].length],$+=p[u].length});const T=new Uint8Array($);for(let r=0,u=0;r<p.length;u+=p[r].length,r++)T.set(p[r],u);p.length=0,await m(`${s}/node_modules/ws`),await e.writeFile(`${s}/modules.js`,T),await e.writeFile(`${s}/modules.json`,JSON.stringify(v)),await e.writeFile(`${s}/node_modules/ws/index.js`,D()),await e.writeFile(`${s}/node_modules/ws/package.json`,JSON.stringify({name:"ws",main:"index.js"})),await e.writeFile(`${s}/package.json`,JSON.stringify({type:"commonjs"})),await e.writeFile(`${s}/bun-assets.json`,JSON.stringify(h)),await e.writeFile(f,V()),await O(s,T).catch(()=>{}),await e.writeFile(`${s}/complete`,String(L)),i(`  ready (${d()}); starting Claude Code
`);for(const r of await e.readdir?.(l).catch?.(()=>[])??[])(r.startsWith("nc-")||r==="cjs")&&`${l}/${r}`!==s&&await e.rm?.(`${l}/${r}`,{recursive:!0,force:!0}).catch?.(()=>{});return{dir:s,launcher:f,sha256:t,extracted:!0}}(globalThis.__tabcomputerLive??=new Map).set("src/claude-vm/extract.ts",K);(globalThis.__tabcomputerLiveState??=new Map).set("src/claude-vm/extract.ts",{get making(){return k}});(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/claude-vm/module-store.ts",()=>E(()=>import("./module-store-BCGCEDLt.js"),[],import.meta.url));export{Y as N,K as _,q as e,I as p};
