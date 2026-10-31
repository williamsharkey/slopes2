const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./build-BnQC6Yca.js","./index-BIxBofyG.js","./index-LZoznX6r.css"])))=>i.map(i=>d[i]);
import{r as l,a as g}from"./index-BIxBofyG.js";const w=Object.freeze(Object.defineProperty({__proto__:null,get reloadCmd(){return h}},Symbol.toStringTag,{value:"Module"}));async function p(e,s){const{buildSwap:a}=await g(async()=>{const{buildSwap:r}=await import("./build-BnQC6Yca.js");return{buildSwap:r}},__vite__mapDeps([0,1,2]),import.meta.url),{evaluateBundle:f,isCommand:n}=await g(async()=>{const{evaluateBundle:r,isCommand:c}=await import("./index-BIxBofyG.js").then(_=>_.g0);return{evaluateBundle:r,isCommand:c}},__vite__mapDeps([1,2]),import.meta.url),t=e.fs.resolvePath(s,e.cwd),o=t.lastIndexOf("/src/"),d=o>=0?t.slice(0,o)||"/":t.slice(0,t.lastIndexOf("/"))||"/",u=await a({readFile:async r=>e.fs.readFile(r,"utf8")},{root:d,files:[t]});for(const r of u.warnings)console.warn(`[reload] ${s}: ${r}`);const i=Object.values(await f(u.code))[0];if(i.default)return i.default;const m=Object.entries(i).filter(([r,c])=>!r.startsWith("__")&&n(c));return m.length===1?m[0][1]:i}const h={name:"reload",description:"Hot-reload modules from virtual filesystem",async exec(e){const s=e.args[0];if(s==="--list"||s==="-l"){const t=l.list();if(t.length===0)e.stdout+=`No modules registered.
`;else{e.stdout+=`Registered modules:
`;for(const o of t.sort())e.stdout+=`  ${o}
`}return 0}if(s==="--status"||s==="-s"){const t=l.list();if(t.length===0)e.stdout+=`No modules registered.
`;else{e.stdout+=`Module registry status:

`;for(const o of t.sort()){const d=l.getMetadata(o);if(d){const u=Math.floor((Date.now()-d.lastUpdatedAt)/1e3);e.stdout+=`  ${o}
`,e.stdout+=`    version: ${d.version}
`,e.stdout+=`    updated: ${u}s ago
`,d.source&&(e.stdout+=`    source: ${d.source}
`),e.stdout+=`
`}}}return 0}if(s==="--all"||s==="-a"){const t=l.list();let o=0,d=0;for(const u of t){const i=l.getMetadata(u);if(i?.source)try{e.stdout+=`Reloading ${u} from ${i.source}...
`;const m=await p(e,i.source),r=l.replace(u,m,i.source);r.migrated?e.stdout+=`  ✓ Reloaded with state migration
`:r.error?e.stdout+=`  ⚠ Reloaded but migration failed: ${r.error.message}
`:e.stdout+=`  ✓ Reloaded (no migration needed)
`,o++}catch(m){e.stderr+=`  ✗ Failed: ${m.message}
`,d++}}return e.stdout+=`
Reloaded ${o} module(s)`,d>0&&(e.stdout+=`, ${d} failed`),e.stdout+=`.
`,d>0?1:0}if(!s||s==="--help"||s==="-h")return e.stdout+=`Usage: reload <module-name> [source-path]
`,e.stdout+=`       reload --list          List registered modules
`,e.stdout+=`       reload --status        Show module versions and sources
`,e.stdout+=`       reload --all           Reload all modules with sources
`,e.stdout+=`
`,e.stdout+=`Examples:
`,e.stdout+=`  reload commands/ls                    # Reload from registered source
`,e.stdout+=`  reload commands/ls /src/commands/ls.ts  # Reload from specific path
`,e.stdout+=`
`,e.stdout+=`Modules can implement migrateFrom(old) to preserve state during reload.
`,0;const a=s,f=e.args[1]||l.getMetadata(a)?.source,n=f&&e.fs.resolvePath(f,e.cwd);if(!n)return e.stderr+=`reload: no source path for '${a}'
`,e.stderr+=`Specify a source path: reload ${a} /path/to/source.ts
`,1;try{await e.fs.stat(n)}catch{return e.stderr+=`reload: source not found: ${n}
`,1}e.stdout+=`Compiling ${n}...
`;try{const t=await p(e,n);if(l.has(a)){const o=l.replace(a,t,n);o.migrated?e.stdout+=`✓ Hot-reloaded '${a}' with state migration
`:o.error?e.stdout+=`⚠ Hot-reloaded '${a}' but migration failed: ${o.error.message}
`:e.stdout+=`✓ Hot-reloaded '${a}'
`}else l.register(a,t,n),e.stdout+=`✓ Registered new module '${a}'
`;return 0}catch(t){return e.stderr+=`reload: ${t.message}
`,1}}};(globalThis.__tabcomputerLive??=new Map).set("src/commands/reload.ts",w);(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/hotswap/build.ts",()=>g(()=>import("./build-BnQC6Yca.js"),__vite__mapDeps([0,1,2]),import.meta.url));(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/hotswap/swap.ts",()=>g(()=>import("./index-BIxBofyG.js").then(e=>e.g0),__vite__mapDeps([1,2]),import.meta.url));export{h as reloadCmd};
