const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./apps-DPGllJGR.js","./index-BIxBofyG.js","./index-LZoznX6r.css"])))=>i.map(i=>d[i]);
import{a as $,f as m}from"./index-BIxBofyG.js";const h=Object.freeze(Object.defineProperty({__proto__:null,get guiCmd(){return w}},Symbol.toStringTag,{value:"Module"})),w={name:"gui",description:"Linux GUI apps (xterm, GTK, Qt) from Debian, streamed on first use",async exec(s){const r=await $(()=>import("./apps-DPGllJGR.js"),__vite__mapDeps([0,1,2]),import.meta.url),d=m(),[n="list",...o]=s.args,i=e=>{s.streamStdout?s.streamStdout(e):s.stdout+=e},a=e=>{s.streamStderr?s.streamStderr(e):s.stderr+=e};let t;try{t=await r.guiManifest()}catch(e){return a(`gui: ${e.message}
`),1}const l=e=>(e/1e6).toFixed(1)+" MB";if(n==="list"||n==="ls"){i(`${"APP".padEnd(12)} ${"TOOLKIT".padEnd(7)} ${"FIRST RUN".padStart(9)}  INSTALLED  DESCRIPTION
`);for(const[e,c]of Object.entries(t.apps)){const _=await r.isAppInstalled(s.fs,e);i(`${e.padEnd(12)} ${c.toolkit.padEnd(7)} ${l(c.size).padStart(9)}  ${_?"yes":"no "}        ${c.description}
`)}return i(`
Debian ${t.suite} ${t.arch}; packages are shared between apps and cached by sha256.
`),0}if(n==="info"){const e=t.apps[o[0]];return e?(i(`${o[0]}: ${e.description} (${e.toolkit}), runs ${e.bin}
`),i(`first run: ${e.packages.length} packages, ${l(e.size)} (full Debian closure ${l(e.closureSize)})
`),i(`packages: ${e.packages.join(" ")}
`),e.dropped.length&&i(`left out (not needed to start): ${e.dropped.join(" ")}
`),0):(a(`gui: no app named ${o[0]}
`),1)}if(n==="install"){for(const e of o)if(await f(s,e,i,a)!==0)return 1;return 0}const p=n==="run"?o.shift():n;if(!p||!t.apps[p])return a(`gui: no app named ${p??""} (gui list)
`),1;if(!await r.isAppInstalled(s.fs,p)&&await f(s,p,i,a)!==0)return 1;const g=Date.now(),u=await r.launchApp(d,p,o);return i(`${p} started (pid ${u.pid}) on display :0
`),u.exited.then(e=>{e!==0&&console.warn(`[gui] ${p} exited with status ${e>>8||e} after ${Date.now()-g} ms:
${u.output().slice(-2e3)}`)}),0}};async function f(s,r,d,n){const o=await $(()=>import("./apps-DPGllJGR.js"),__vite__mapDeps([0,1,2]),import.meta.url);let i=0;try{const a=await o.installApp(s.fs,m(),r,t=>{t.phase==="unpack"&&(Date.now()-i>1e3||t.done===t.total)&&(i=Date.now(),d(`\r${r}: ${t.done}/${t.total} packages, ${(t.bytes/1e6).toFixed(1)}/${(t.totalBytes/1e6).toFixed(1)} MB`))},t=>d(`
${t}`));return d(`
${r}: installed ${a.packages-a.skipped} packages (${a.fetched} downloaded, ${(a.bytes/1e6).toFixed(1)} MB; ${a.cached} from cache; ${a.skipped} already there) in ${(a.ms.total/1e3).toFixed(1)} s
`),0}catch(a){return n(`
gui: ${r}: ${a.message}
`),1}}(globalThis.__tabcomputerLive??=new Map).set("src/commands/gui.ts",h);(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/gui/apps.ts",()=>$(()=>import("./apps-DPGllJGR.js"),__vite__mapDeps([0,1,2]),import.meta.url));export{w as guiCmd};
