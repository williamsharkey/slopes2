const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./build-B3nWvXAr.js","./index-BIxBofyG.js","./index-LZoznX6r.css","./index-rQLcFmgX.js","./async-context-y-8UcOOk.js","./module-transform-DDxltyUj.js","./require-DFw1zYAr.js"])))=>i.map(i=>d[i]);
import{a as v}from"./index-BIxBofyG.js";import{zstdDecodeAll as K}from"./zstd-codec-BYgKNVoq.js";const Y=Object.freeze(Object.defineProperty({__proto__:null,get BUN_TRAILER(){return N},get BunLoader(){return M},get findElfSection(){return W},get parseBunGraph(){return D}},Symbol.toStringTag,{value:"Module"})),Z=Object.freeze(Object.defineProperty({__proto__:null,get VM_CACHE(){return I},get VM_LAYOUT(){return C},get adaptModule(){return V},get bundleEntry(){return G},get bundleHeader(){return H},get ensureClaudeVm(){return oe},get launcherSource(){return P},get toCommonJS(){return J},get wsShimSource(){return z}},Symbol.toStringTag,{value:"Module"})),N=`
---- Bun! ----
`,M={js:1,file:5,napi:10,text:13},Q=[52,44,36];function W(e,r){if(e.length<64||e[0]!==127||e[1]!==69||e[2]!==76||e[3]!==70||e[4]!==2||e[5]!==1)return null;const t=new DataView(e.buffer,e.byteOffset,e.byteLength),c=Number(t.getBigUint64(40,!0)),u=t.getUint16(58,!0),d=t.getUint16(60,!0),l=t.getUint16(62,!0);if(!c||u<64||l>=d||c+d*u>e.length)return null;const a=s=>c+s*u,L=Number(t.getBigUint64(a(l)+24,!0)),m=new TextEncoder().encode(r+"\0");for(let s=0;s<d;s++){const w=L+t.getUint32(a(s),!0);let _=w+m.length<=e.length;for(let p=0;_&&p<m.length;p++)_=e[w+p]===m[p];if(_)return[Number(t.getBigUint64(a(s)+24,!0)),Number(t.getBigUint64(a(s)+32,!0))]}return null}function D(e){const r=W(e,".bun");if(!r)throw new Error("not a Bun executable (no .bun section)");const[t,c]=r,u=new DataView(e.buffer,e.byteOffset,e.byteLength),d=Number(u.getBigUint64(t,!0)),l=t+8;if(d<48||d>c-8)throw new Error(".bun section: bad payload length");const a=l+d;if(new TextDecoder().decode(e.subarray(a-N.length,a))!==N)throw new Error(".bun section: no Bun trailer");const m=a-N.length-32,s=u.getUint32(m+8,!0),w=u.getUint32(m+12,!0),_=u.getUint32(m+16,!0);if(s+w>d)throw new Error(".bun section: module table out of range");const p=new TextDecoder,g=(o,S)=>{if(o+S>d)throw new RangeError(".bun section: string out of range");return e.subarray(l+o,l+o+S)};for(const o of Q){if(w%o)continue;const S=w/o,y=[];try{for(let $=0;$<S;$++){const b=l+s+$*o,j=O=>[u.getUint32(b+8*O,!0),u.getUint32(b+8*O+4,!0)],i=p.decode(g(...j(0)));if(!i.startsWith("/$bunfs/")&&!/^B:[\\/]~BUN[\\/]/.test(i))throw new Error("not a module name");const E=b+o-4;y.push({name:i,contents:g(...j(1)),bytecodeLength:o>=36?j(3)[1]:0,encoding:e[E],loader:e[E+1],format:e[E+2]})}}catch{continue}if(_>=y.length)throw new Error(".bun section: entry point out of range");return{entry:y[_],modules:y}}throw new Error(".bun section: unknown module record layout")}(globalThis.__tabcomputerLive??=new Map).set("src/claude-vm/bun-graph.ts",Y);const I=".cache/tabcomputer/claude-vm",C=8,F="/$bunfs/root/";function V(e,r){let t=e.split(F).join(r+"/");return t=t.replace(/\bimport\.meta\.require\b/g,"Bun.__require(require)"),t=t.replace(/\bimport\.meta\.(?:dirname|dir)\b/g,"__dirname"),t=t.replace(/\bimport\.meta\.filename\b/g,"__filename"),t=t.replace(/\bimport\.meta\.url\b/g,'require("url").pathToFileURL(__filename).href'),`var Bun = globalThis.Bun;
`+t}async function J(e,r){return'"use strict";'+(await e.transform(r,{format:"cjs",loader:"js",target:"esnext",logLevel:"silent",minifyWhitespace:!0})).code}const X=[...["console","process","global","Buffer"].map(e=>`typeof ${e} === 'undefined' ? undefined : ${e}`),"{ url: 'file://' + __dirname + '/bundle.js', dirname: __dirname, filename: __dirname + '/bundle.js' }","m","require",...["__dynamic_import","__shiro_require_ready","globalThis","Function","setTimeout","clearTimeout","setInterval","clearInterval","setImmediate","clearImmediate","self","WorkerGlobalScope","DedicatedWorkerGlobalScope"].map(e=>`typeof ${e} === 'undefined' ? undefined : ${e}`)].join(", ");function P(){return["// tabcomputer: claude --vm (src/claude-vm/extract.ts)","const { createBun } = await require('tabcomputer:claude-vm').load();","const assets = JSON.parse(require('fs').readFileSync(__dirname + '/bun-assets.json', 'utf8'));","globalThis.Bun = createBun({ fs: require('fs'), process: process, childProcess: require('child_process'), net: require('net'), http: require('http'), Buffer: Buffer, assets: assets, main: __dirname + '/cli.js' });","const { loadCompiled } = await require('tabcomputer:claude-vm').codeCache();","const bundle = process.env.TABCOMPUTER_VM_CODECACHE === '0' ? null : await loadCompiled(__dirname, () => require('fs').readFileSync(__dirname + '/bundle.js', 'utf8')).catch(() => null);","if (bundle) {","  const file = __dirname + '/bundle.js';","  const m = { exports: {}, id: file, filename: file, loaded: false, children: [] };",`  bundle.apply(m.exports, [m, m.exports, require, file, __dirname, ${X}]);`,"} else require('./bundle.js');",""].join(`
`)}function z(){return`const { EventEmitter } = require('events');
class WebSocket extends EventEmitter {
  constructor(url, protocols, opts) {
    super();
    if (protocols && !Array.isArray(protocols) && typeof protocols === 'object') protocols = undefined;
    const ws = this._ws = new globalThis.WebSocket(String(url), protocols);
    ws.binaryType = 'arraybuffer';
    ws.onopen = () => { this.emit('open'); this.onopen?.({ target: this }); };
    ws.onmessage = (e) => { const d = typeof e.data === 'string' ? e.data : Buffer.from(e.data); this.emit('message', d, typeof e.data !== 'string'); this.onmessage?.({ data: d, target: this }); };
    ws.onerror = () => { const err = new Error('WebSocket error'); this.emit('error', err); this.onerror?.({ error: err, message: err.message, target: this }); };
    ws.onclose = (e) => { this.emit('close', e.code, Buffer.from(e.reason || '')); this.onclose?.({ code: e.code, reason: e.reason, target: this }); };
  }
  get readyState() { return this._ws.readyState; }
  get protocol() { return this._ws.protocol; }
  send(data, opts, cb) { if (typeof opts === 'function') cb = opts; try { this._ws.send(data); cb?.(); } catch (e) { cb?.(e); } }
  close(code, reason) { this._ws.close(code, reason); }
  terminate() { this._ws.close(); }
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
`}function G(e,r){return`__vmMods[${JSON.stringify(e)}] = function (module, exports, require, __filename, __dirname, __dynamic_import) {
${r}
};
`}const ee=e=>e.length>=4&&e[0]===40&&e[1]===181&&e[2]===47&&e[3]===253;async function te(e){const r=await crypto.subtle.digest("SHA-256",e);return[...new Uint8Array(r)].map(t=>t.toString(16).padStart(2,"0")).join("")}const U="/__tabcomputer_vm_root__",re=()=>{const e="f2c33f9a68f45a99818022fa9ba2e3a6fc794c30";let r=2166136261;for(const t of`${e}:${C}`)r^=t.charCodeAt(0),r=Math.imul(r,16777619);return(r>>>0).toString(16).padStart(8,"0")};async function oe(e,r,t,c=()=>{}){const u=`${t}/${I}`,d=`${u}/index.json`;let l={};try{l=JSON.parse(await e.readFile(d,"utf8"))??{}}catch{}const a=await e.stat(r),L=typeof a.mtime=="number"?a.mtime:a.mtime.getTime();let m=null,s=l[r]?.size===a.size&&l[r]?.mtime===L?l[r].sha256:"";const w=Date.now(),_=()=>`${((Date.now()-w)/1e3).toFixed(1)} s`;s||(c(`claude --vm: reading the native build (${Math.round(a.size/2**20)} MB)...
`),m=await e.readFile(r),s=await te(m));const p=`${u}/${s}`,g=`${p}/cjs`,o=`${p}/nc-${re()}`,S=`${o}/vm-main.mjs`,y=new Set,$=async i=>{y.has(i)||(y.add(i),await e.mkdir(i,{recursive:!0}))},b=async i=>{try{return await e.readFile(i,"utf8")}catch{return null}};let j=!1;if((await b(`${g}/complete`))?.trim()!==String(C)){c(`claude --vm: extracting Claude Code's JavaScript from the native build (once per version)...
`),m??=await e.readFile(r);const i=D(m),E=new TextDecoder,O=[],{withEsbuild:A}=await v(async()=>{const{withEsbuild:h}=await import("./build-B3nWvXAr.js");return{withEsbuild:h}},__vite__mapDeps([0,1,2,3]),import.meta.url);let k=0;const x=i.modules.filter(h=>h.loader===M.js).length;c(`  ${x} modules, ${i.modules.length-x} assets; converting to CommonJS (${_()})
`),await A(async h=>{for(const f of i.modules){if(!f.name.startsWith(F))continue;const B=f===i.entry?"cli.js":f.name.slice(F.length),n=`${g}/${B}`;await $(n.slice(0,n.lastIndexOf("/"))),O.push({rel:B,loader:f.loader}),f.loader===M.js?(await e.writeFile(n,await J(h,V(E.decode(f.contents),U))),++k%500===0&&c(`  ${k}/${x} modules (${_()})
`)):ee(f.contents)?await e.writeFile(n,K(f.contents)):await e.writeFile(n,f.contents.slice())}}),await e.writeFile(`${g}/files.json`,JSON.stringify(O)),await e.writeFile(`${g}/complete`,String(C)),c(`  extracted (${_()})
`),j=!0}if((await b(`${o}/complete`))?.trim()!==String(C)){c(`claude --vm: preparing Claude Code for this tabcomputer build...
`);const i=JSON.parse(await b(`${g}/files.json`)??"[]"),[{transformESModules:E},{carryAsyncContext:O,carriesAsyncContext:A},{PRETRANSFORMED:k}]=await Promise.all([v(()=>import("./module-transform-DDxltyUj.js"),[],import.meta.url),v(()=>import("./async-context-y-8UcOOk.js"),__vite__mapDeps([4,5]),import.meta.url),v(()=>import("./require-DFw1zYAr.js").then(n=>n._),__vite__mapDeps([6,1,2,5,4,0,3]),import.meta.url)]),x={},h=[k,H()],f=i.filter(n=>n.loader===M.js).length;let B=0;for(const n of i){const T=`${o}/${n.rel}`;if(await $(T.slice(0,T.lastIndexOf("/"))),n.loader===M.js){const R=(await b(`${g}/${n.rel}`)??"").split(U+"/").join(o+"/"),q=E(R,A(R)?O:void 0);await e.writeFile(T,k+q),h.push(G(T,q)),++B%500===0&&c(`  ${B}/${f} modules (${_()})
`)}else x[T]=n.loader,await e.writeFile(T,await e.readFile(`${g}/${n.rel}`))}await $(`${o}/node_modules/ws`),await e.writeFile(`${o}/node_modules/ws/index.js`,z()),await e.writeFile(`${o}/node_modules/ws/package.json`,JSON.stringify({name:"ws",main:"index.js"})),await e.writeFile(`${o}/package.json`,JSON.stringify({type:"commonjs"})),await e.writeFile(`${o}/bun-assets.json`,JSON.stringify(x)),h.push(`__vmRequire(${JSON.stringify(o)})(${JSON.stringify(o+"/cli.js")});
`),await e.writeFile(`${o}/bundle.js`,h.join("")),await e.writeFile(S,P()),await e.writeFile(`${o}/complete`,String(C)),c(`  ready (${_()}); starting Claude Code
`);for(const n of await e.readdir?.(p).catch?.(()=>[])??[])n.startsWith("nc-")&&`${p}/${n}`!==o&&await e.rm?.(`${p}/${n}`,{recursive:!0,force:!0}).catch?.(()=>{})}return l[r]={size:a.size,mtime:L,sha256:s},await e.mkdir(u,{recursive:!0}),await e.writeFile(d,JSON.stringify(l,null,2)+`
`),{dir:o,launcher:S,sha256:s,extracted:j}}(globalThis.__tabcomputerLive??=new Map).set("src/claude-vm/extract.ts",Z);(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/commands/build.ts",()=>v(()=>import("./build-B3nWvXAr.js"),__vite__mapDeps([0,1,2,3]),import.meta.url));(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/commands/jseval/module-transform.ts",()=>v(()=>import("./module-transform-DDxltyUj.js"),[],import.meta.url));(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/node-compat/async-context.ts",()=>v(()=>import("./async-context-y-8UcOOk.js"),__vite__mapDeps([4,5]),import.meta.url));(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/node-compat/require.ts",()=>v(()=>import("./require-DFw1zYAr.js").then(e=>e._),__vite__mapDeps([6,1,2,5,4,0,3]),import.meta.url));export{I as VM_CACHE,C as VM_LAYOUT,V as adaptModule,G as bundleEntry,H as bundleHeader,oe as ensureClaudeVm,P as launcherSource,J as toCommonJS,z as wsShimSource};
