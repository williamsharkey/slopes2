const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./build-CG7nRvKL.js","./index-C6zxlZK4.js","./index-LZoznX6r.css","./index-rQLcFmgX.js","./async-context-y-8UcOOk.js","./module-transform-DDxltyUj.js","./require-WZ4Unzai.js"])))=>i.map(i=>d[i]);
import{a as x}from"./index-C6zxlZK4.js";import{zstdDecodeAll as X}from"./zstd-codec-BYgKNVoq.js";const Y=Object.freeze(Object.defineProperty({__proto__:null,get BUN_TRAILER(){return R},get BunLoader(){return A},get NeedBytes(){return ee},get arraySource(){return q},get findElfSection(){return D},get parseBunGraph(){return P}},Symbol.toStringTag,{value:"Module"})),Z=Object.freeze(Object.defineProperty({__proto__:null,get VM_CACHE(){return N},get VM_LAYOUT(){return C},get adaptModule(){return V},get bundleEntry(){return G},get bundleHeader(){return H},get ensureClaudeVm(){return ne},get ensureClaudeVmLayout(){return K},get launcherSource(){return z},get layoutInProgress(){return ie},get toCommonJS(){return U},get wsShimSource(){return J}},Symbol.toStringTag,{value:"Module"})),R=`
---- Bun! ----
`,A={js:1,file:5,napi:10,text:13},Q=[52,44,36];class ee extends Error{ranges;constructor(t){super(`need ${t.length} byte ranges`),this.ranges=t}}function q(e){return{size:e.length,need(){},bytes:(t,r)=>{if(t<0||t+r>e.length)throw new RangeError("out of range");return e.subarray(t,t+r)}}}const M=(e,t)=>e[t]|e[t+1]<<8,O=(e,t)=>(e[t]|e[t+1]<<8|e[t+2]<<16|e[t+3]<<24)>>>0,k=(e,t)=>O(e,t)+O(e,t+4)*2**32;function D(e,t){const r=e instanceof Uint8Array?q(e):e;if(r.size<64)return null;r.need([[0,64]]);const c=r.bytes(0,64);if(c[0]!==127||c[1]!==69||c[2]!==76||c[3]!==70||c[4]!==2||c[5]!==1)return null;const u=k(c,40),d=M(c,58),s=M(c,60),_=M(c,62);if(!u||d<64||_>=s||u+s*d>r.size)return null;r.need([[u,s*d]]);const p=r.bytes(u,s*d),l=f=>f*d,n=k(p,l(_)+24),b=k(p,l(_)+32);if(n+b>r.size)return null;r.need([[n,b]]);const v=r.bytes(n,b),E=new TextEncoder().encode(t+"\0");for(let f=0;f<s;f++){const j=O(p,l(f));let m=j+E.length<=v.length;for(let h=0;m&&h<E.length;h++)m=v[j+h]===E[h];if(m)return[k(p,l(f)+24),k(p,l(f)+32)]}return null}function P(e){const t=e instanceof Uint8Array?q(e):e,r=D(t,".bun");if(!r)throw new Error("not a Bun executable (no .bun section)");const[c,u]=r;if(c+u>t.size||u<8)throw new Error(".bun section: out of range");t.need([[c,8]]);const d=k(t.bytes(c,8),0),s=c+8;if(d<48||d>u-8)throw new Error(".bun section: bad payload length");const _=s+d,p=R.length+32;t.need([[_-p,p]]);const l=t.bytes(_-p,p);if(new TextDecoder().decode(l.subarray(32))!==R)throw new Error(".bun section: no Bun trailer");const b=O(l,8),v=O(l,12),E=O(l,16);if(b+v>d)throw new Error(".bun section: module table out of range");t.need([[s+b,v]]);const f=t.bytes(s+b,v),j=new TextDecoder,m=(h,S)=>h+S<=d;for(const h of Q){if(v%h)continue;const S=v/h,w=(o,i)=>[O(f,o*h+8*i),O(f,o*h+8*i+4)];let y=!0;for(let o=0;y&&o<S;o++)y=m(...w(o,0))&&m(...w(o,1));if(!y)continue;t.need(Array.from({length:S},(o,i)=>[s+w(i,0)[0],w(i,0)[1]]));const $=[];for(let o=0;y&&o<S;o++){const i=j.decode(t.bytes(s+w(o,0)[0],w(o,0)[1]));y=i.startsWith("/$bunfs/")||/^B:[\\/]~BUN[\\/]/.test(i),$.push(i)}if(!y)continue;t.need(Array.from({length:S},(o,i)=>[s+w(i,1)[0],w(i,1)[1]]));const g=$.map((o,i)=>{const a=i*h+h-4;return{name:o,contents:t.bytes(s+w(i,1)[0],w(i,1)[1]),bytecodeLength:h>=36?w(i,3)[1]:0,encoding:f[a],loader:f[a+1],format:f[a+2]}});if(E>=g.length)throw new Error(".bun section: entry point out of range");return{entry:g[E],modules:g}}throw new Error(".bun section: unknown module record layout")}(globalThis.__tabcomputerLive??=new Map).set("src/claude-vm/bun-graph.ts",Y);const N=".cache/tabcomputer/claude-vm",C=8,B="/$bunfs/root/";function V(e,t){let r=e.split(B).join(t+"/");return r=r.replace(/\bimport\.meta\.require\b/g,"Bun.__require(require)"),r=r.replace(/\bimport\.meta\.(?:dirname|dir)\b/g,"__dirname"),r=r.replace(/\bimport\.meta\.filename\b/g,"__filename"),r=r.replace(/\bimport\.meta\.url\b/g,'require("url").pathToFileURL(__filename).href'),`var Bun = globalThis.Bun;
`+r}async function U(e,t){return'"use strict";'+(await e.transform(t,{format:"cjs",loader:"js",target:"esnext",logLevel:"silent",minifyWhitespace:!0})).code}const te=[...["console","process","global","Buffer"].map(e=>`typeof ${e} === 'undefined' ? undefined : ${e}`),"{ url: 'file://' + __dirname + '/bundle.js', dirname: __dirname, filename: __dirname + '/bundle.js' }","m","require",...["__dynamic_import","__shiro_require_ready","globalThis","Function","setTimeout","clearTimeout","setInterval","clearInterval","setImmediate","clearImmediate","self","WorkerGlobalScope","DedicatedWorkerGlobalScope"].map(e=>`typeof ${e} === 'undefined' ? undefined : ${e}`)].join(", ");function z(){return["// tabcomputer: claude --vm (src/claude-vm/extract.ts)","const { createBun } = await require('tabcomputer:claude-vm').load();","const assets = JSON.parse(require('fs').readFileSync(__dirname + '/bun-assets.json', 'utf8'));","globalThis.Bun = createBun({ fs: require('fs'), process: process, childProcess: require('child_process'), net: require('net'), http: require('http'), Buffer: Buffer, assets: assets, main: __dirname + '/cli.js', transform: require('tabcomputer:claude-vm').transformSync });","const { loadCompiled } = await require('tabcomputer:claude-vm').codeCache();","const bundle = process.env.TABCOMPUTER_VM_CODECACHE === '0' ? null : await loadCompiled(__dirname, () => require('fs').readFileSync(__dirname + '/bundle.js', 'utf8')).catch(() => null);","if (bundle) {","  const file = __dirname + '/bundle.js';","  const m = { exports: {}, id: file, filename: file, loaded: false, children: [] };",`  bundle.apply(m.exports, [m, m.exports, require, file, __dirname, ${te}]);`,"} else require('./bundle.js');",""].join(`
`)}function J(){return`const { EventEmitter } = require('events');
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
`}function H(e){return`const __vmMods = Object.create(null), __vmCache = Object.create(null), __vmOuter = require;
const __vmDir = (p) => p.slice(0, p.lastIndexOf('/')) || '/';
const __vmKey = (from, id) => {
  if (typeof id !== 'string') return null;
  let p = id.startsWith('/') ? id : id.startsWith('./') || id.startsWith('../') ? require('path').resolve(from, id) : null;
  if (p === null) return null;
  return __vmMods[p] ? p : __vmMods[p + '.js'] ? p + '.js' : null;
};
const __vmRequire = (from) => {
  const r = (id) => {
    const key = __vmKey(from, id);
    if (key === null) return __vmOuter(id);
    let m = __vmCache[key];
    if (m) return m.exports;
    m = __vmCache[key] = { exports: {}, id: key, filename: key, loaded: false, children: [] };
    const dir = __vmDir(key);
    __vmMods[key].call(m.exports, m, m.exports, __vmRequire(dir), key, dir, __vmImport(dir));
    m.loaded = true;
    return m.exports;
  };
  r.resolve = (id) => __vmKey(from, id) ?? __vmOuter.resolve(id);
  r.cache = __vmCache;
  return r;
};
// import(): the module's exports, as Bun's ES modules give their namespace
const __vmImport = (from) => (id) => Promise.resolve().then(() => {
  const e = __vmRequire(from)(String(id).replace(/^file:\\/\\//, ''));
  return e && (e.__esModule || typeof e !== 'object') ? (e.__esModule ? e : { default: e }) : Object.assign({ default: e }, e);
});
`}function G(e,t){return`__vmMods[${JSON.stringify(e)}] = function (module, exports, require, __filename, __dirname, __dynamic_import) {
${t}
};
`}const re=e=>e.length>=4&&e[0]===40&&e[1]===181&&e[2]===47&&e[3]===253;async function oe(e){const t=await crypto.subtle.digest("SHA-256",e);return[...new Uint8Array(t)].map(r=>r.toString(16).padStart(2,"0")).join("")}const I="/__tabcomputer_vm_root__",se=()=>{const e="e9562fd2479a15ba7f9988818c6f0b06e9f199c5";let t=2166136261;for(const r of`${e}:${C}`)t^=r.charCodeAt(0),t=Math.imul(t,16777619);return(t>>>0).toString(16).padStart(8,"0")};async function ne(e,t,r,c=()=>{}){const u=`${r}/${N}`,d=`${u}/index.json`;let s={};try{s=JSON.parse(await e.readFile(d,"utf8"))??{}}catch{}const _=await e.stat(t),p=typeof _.mtime=="number"?_.mtime:_.mtime.getTime();let l=null,n=s[t]?.size===_.size&&s[t]?.mtime===p?s[t].sha256:"";n||(c(`claude --vm: reading the native build (${Math.round(_.size/2**20)} MB)...
`),l=await e.readFile(t),n=await oe(l));const b=await K(e,n,r,async()=>P(l??=await e.readFile(t)),c);return s[t]={size:_.size,mtime:p,sha256:n},await e.mkdir(u,{recursive:!0}),await e.writeFile(d,JSON.stringify(s,null,2)+`
`),b}const L=new Map,ie=(e,t)=>L.has(`${e}\0${t}`);function K(e,t,r,c,u=()=>{}){const d=`${r}\0${t}`;let s=L.get(d);return s||(s=ae(e,t,r,c,u).finally(()=>L.delete(d)),L.set(d,s)),s}async function ae(e,t,r,c,u){const d=`${r}/${N}`,s=Date.now(),_=()=>`${((Date.now()-s)/1e3).toFixed(1)} s`,p=`${d}/${t}`,l=`${p}/cjs`,n=`${p}/nc-${se()}`,b=`${n}/vm-main.mjs`,v=new Set,E=async m=>{v.has(m)||(v.add(m),await e.mkdir(m,{recursive:!0}))},f=async m=>{try{return await e.readFile(m,"utf8")}catch{return null}};let j=!1;if((await f(`${l}/complete`))?.trim()!==String(C)){const m=await c();u(`claude --vm: extracting Claude Code's JavaScript from the native build (once per version)...
`);const h=new TextDecoder,S=[],{withEsbuild:w}=await x(async()=>{const{withEsbuild:g}=await import("./build-CG7nRvKL.js");return{withEsbuild:g}},__vite__mapDeps([0,1,2,3]),import.meta.url);let y=0;const $=m.modules.filter(g=>g.loader===A.js).length;u(`  ${$} modules, ${m.modules.length-$} assets; converting to CommonJS (${_()})
`),await w(async g=>{for(const o of m.modules){if(!o.name.startsWith(B))continue;const i=o===m.entry?"cli.js":o.name.slice(B.length),a=`${l}/${i}`;await E(a.slice(0,a.lastIndexOf("/"))),S.push({rel:i,loader:o.loader}),o.loader===A.js?(await e.writeFile(a,await U(g,V(h.decode(o.contents),I))),++y%500===0&&u(`  ${y}/${$} modules (${_()})
`)):re(o.contents)?await e.writeFile(a,X(o.contents)):await e.writeFile(a,o.contents.slice())}}),await e.writeFile(`${l}/files.json`,JSON.stringify(S)),await e.writeFile(`${l}/complete`,String(C)),u(`  extracted (${_()})
`),j=!0}if((await f(`${n}/complete`))?.trim()!==String(C)){u(`claude --vm: preparing Claude Code for this tabcomputer build...
`);const m=JSON.parse(await f(`${l}/files.json`)??"[]"),[{transformESModules:h},{carryAsyncContext:S,carriesAsyncContext:w},{PRETRANSFORMED:y}]=await Promise.all([x(()=>import("./module-transform-DDxltyUj.js"),[],import.meta.url),x(()=>import("./async-context-y-8UcOOk.js"),__vite__mapDeps([4,5]),import.meta.url),x(()=>import("./require-WZ4Unzai.js").then(a=>a._),__vite__mapDeps([6,1,2,5,4,0,3]),import.meta.url)]),$={},g=[y,H()],o=m.filter(a=>a.loader===A.js).length;let i=0;for(const a of m){const T=`${n}/${a.rel}`;if(await E(T.slice(0,T.lastIndexOf("/"))),a.loader===A.js){const W=(await f(`${l}/${a.rel}`)??"").split(I+"/").join(n+"/"),F=h(W,w(W)?S:void 0);await e.writeFile(T,y+F),g.push(G(T,F)),++i%500===0&&u(`  ${i}/${o} modules (${_()})
`)}else $[T]=a.loader,await e.writeFile(T,await e.readFile(`${l}/${a.rel}`))}await E(`${n}/node_modules/ws`),await e.writeFile(`${n}/node_modules/ws/index.js`,J()),await e.writeFile(`${n}/node_modules/ws/package.json`,JSON.stringify({name:"ws",main:"index.js"})),await e.writeFile(`${n}/package.json`,JSON.stringify({type:"commonjs"})),await e.writeFile(`${n}/bun-assets.json`,JSON.stringify($)),g.push(`__vmRequire(${JSON.stringify(n)})(${JSON.stringify(n+"/cli.js")});
`),await e.writeFile(`${n}/bundle.js`,g.join("")),await e.writeFile(b,z()),await e.writeFile(`${n}/complete`,String(C)),u(`  ready (${_()}); starting Claude Code
`);for(const a of await e.readdir?.(p).catch?.(()=>[])??[])a.startsWith("nc-")&&`${p}/${a}`!==n&&await e.rm?.(`${p}/${a}`,{recursive:!0,force:!0}).catch?.(()=>{})}return{dir:n,launcher:b,sha256:t,extracted:j}}(globalThis.__tabcomputerLive??=new Map).set("src/claude-vm/extract.ts",Z);(globalThis.__tabcomputerLiveState??=new Map).set("src/claude-vm/extract.ts",{get making(){return L}});(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/commands/build.ts",()=>x(()=>import("./build-CG7nRvKL.js"),__vite__mapDeps([0,1,2,3]),import.meta.url));(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/commands/jseval/module-transform.ts",()=>x(()=>import("./module-transform-DDxltyUj.js"),[],import.meta.url));(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/node-compat/async-context.ts",()=>x(()=>import("./async-context-y-8UcOOk.js"),__vite__mapDeps([4,5]),import.meta.url));(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/node-compat/require.ts",()=>x(()=>import("./require-WZ4Unzai.js").then(e=>e._),__vite__mapDeps([6,1,2,5,4,0,3]),import.meta.url));export{ee as N,Z as _,K as e,P as p};
