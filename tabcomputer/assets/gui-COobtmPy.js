const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./apps-CRfB4XoS.js","./index-3dop0BuN.js","./index-LZoznX6r.css","./snapshot-setting-CAQlnARe.js","./launch-Rl3GZIEU.js"])))=>i.map(i=>d[i]);
import{a as l,i as w}from"./index-3dop0BuN.js";const y=Object.freeze(Object.defineProperty({__proto__:null,get guiCmd(){return D}},Symbol.toStringTag,{value:"Module"})),D={name:"gui",description:"Linux GUI apps (xterm, GTK, Qt) from Debian, streamed on first use",async exec(r){const d=await l(()=>import("./apps-CRfB4XoS.js"),__vite__mapDeps([0,1,2,3]),import.meta.url),p=w(),[o="list",...n]=r.args,s=e=>{r.streamStdout?r.streamStdout(e):r.stdout+=e},t=e=>{r.streamStderr?r.streamStderr(e):r.stderr+=e};let a;try{a=await d.guiManifest()}catch(e){return t(`gui: ${e.message}
`),1}const c=e=>(e/1e6).toFixed(1)+" MB";if(o==="list"||o==="ls"){s(`${"APP".padEnd(12)} ${"TOOLKIT".padEnd(7)} ${"FIRST RUN".padStart(9)}  INSTALLED  DESCRIPTION
`);for(const[e,g]of Object.entries(a.apps)){const k=await d.isAppInstalled(r.fs,e);s(`${e.padEnd(12)} ${g.toolkit.padEnd(7)} ${c(g.size).padStart(9)}  ${k?"yes":"no "}        ${g.description}
`)}return s(`
Debian ${a.suite} ${a.arch}; packages are shared between apps and cached by sha256.
`),0}if(o==="info"){const e=a.apps[n[0]];return e?(s(`${n[0]}: ${e.description} (${e.toolkit}), runs ${e.bin}
`),s(`first run: ${e.packages.length} packages, ${c(e.size)} (full Debian closure ${c(e.closureSize)})
`),s(`packages: ${e.packages.join(" ")}
`),e.dropped.length&&s(`left out (not needed to start): ${e.dropped.join(" ")}
`),0):(t(`gui: no app named ${n[0]}
`),1)}if(o==="install"){for(const e of n)if(await E(r,e,s,t)!==0)return 1;return 0}const i=o==="run"?n.shift():o;if(!i||!a.apps[i])return t(`gui: no app named ${i??""} (gui list)
`),1;const{startGuiApp:h}=await l(async()=>{const{startGuiApp:e}=await import("./launch-Rl3GZIEU.js");return{startGuiApp:e}},__vite__mapDeps([4,1,2]),import.meta.url),f=globalThis.__shiroDesktop?.app?.(i),b=Date.now();let _=0,$=!1;const u=await h(r.fs,p,i,{name:f?.name,icon:f?.icon,args:n,onProgress:e=>{e.phase==="unpack"&&(Date.now()-_>1e3||e.done===e.total)&&(_=Date.now(),$=!0,s(`\r${i}: ${e.done}/${e.total} packages, ${(e.bytes/1e6).toFixed(1)}/${(e.totalBytes/1e6).toFixed(1)} MB`))},log:e=>{$=!0,s(`
${e}`)}});if($&&s(`
`),u.status==="busy")return t(`gui: ${i} is already starting; its window has not appeared yet
`),0;if(u.status==="cancelled")return t(`gui: ${i}: cancelled
`),130;if(u.status==="failed")return t(`gui: ${u.error}
`),1;const m=u.app;return s(`${i} started (pid ${m.pid}) on display :0
`),m.exited.then(e=>{e!==0&&console.warn(`[gui] ${i} exited with status ${e>>8||e} after ${Date.now()-b} ms:
${m.output().slice(-2e3)}`)}),0}};async function E(r,d,p,o){const n=await l(()=>import("./apps-CRfB4XoS.js"),__vite__mapDeps([0,1,2,3]),import.meta.url);let s=0;try{const t=await n.installApp(r.fs,w(),d,a=>{a.phase==="unpack"&&(Date.now()-s>1e3||a.done===a.total)&&(s=Date.now(),p(`\r${d}: ${a.done}/${a.total} packages, ${(a.bytes/1e6).toFixed(1)}/${(a.totalBytes/1e6).toFixed(1)} MB`))},a=>p(`
${a}`));return p(`
${d}: installed ${t.packages-t.skipped} packages (${t.fetched} downloaded, ${(t.bytes/1e6).toFixed(1)} MB; ${t.cached} from cache; ${t.skipped} already there) in ${(t.ms.total/1e3).toFixed(1)} s
`),0}catch(t){return o(`
gui: ${d}: ${t.message}
`),1}}(globalThis.__tabcomputerLive??=new Map).set("src/commands/gui.ts",y);(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/gui/apps.ts",()=>l(()=>import("./apps-CRfB4XoS.js"),__vite__mapDeps([0,1,2,3]),import.meta.url));(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/gui/launch.ts",()=>l(()=>import("./launch-Rl3GZIEU.js"),__vite__mapDeps([4,1,2]),import.meta.url));export{D as guiCmd};
