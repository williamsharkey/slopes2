import{WasiExit as u}from"./wasi-runtime-EJk2g3FX.js";import{w as g,x as l}from"./index-C6zxlZK4.js";import{runWasiProgram as m}from"./run-command-DEqOoOqh.js";import"./host-3S1UOOxt.js";import"./worker-host-Bd9sHFIT.js";import"./stdio-BOf24ocS.js";const p=Object.freeze(Object.defineProperty({__proto__:null,get wasiCmd(){return c}},Symbol.toStringTag,{value:"Module"})),c={name:"wasi",description:"Run WASM+WASI binaries",async exec(a){const r=a.args[0];if(!r||r==="--help"||r==="-h")return a.stdout+=`Usage:
`,a.stdout+=`  wasi run <file.wasm|url> [args...]   Run a WASM binary
`,a.stdout+=`  wasi exec <package> [args...]        Run a package (auto-downloads)
`,a.stdout+=`
Run any WASM+WASI binary against tabcomputer's filesystem.
`,a.stdout+=`
Examples:
`,a.stdout+=`  wasi run ./program.wasm
`,a.stdout+=`  wasi run https://example.com/tool.wasm --flag
`,a.stdout+=`  wasi exec cowsay "hello world"
`,0;if(r==="exec")return f(a);if(r!=="run")return a.stderr+=`wasi: unknown subcommand '${r}'
`,a.stderr+=`Usage: wasi run <file.wasm|url> [args...] | wasi exec <package> [args...]
`,1;const s=a.args[1];if(!s)return a.stderr+=`wasi: missing WASM file path or URL
`,1;const i=a.args.slice(2);try{let e;if(s.startsWith("http://")||s.startsWith("https://")){const t=await fetch(s);if(!t.ok)return a.stderr+=`wasi: failed to fetch ${s}: ${t.status} ${t.statusText}
`,1;e=await t.arrayBuffer()}else{const t=a.fs.resolvePath(s,a.cwd);try{const o=await a.fs.readFile(t);e=new Uint8Array(o).buffer}catch(o){return a.stderr+=`wasi: ${t}: ${o.message}
`,1}}const n=new Uint8Array(e,0,4);if(n[0]!==0||n[1]!==97||n[2]!==115||n[3]!==109)return a.stderr+=`wasi: ${s}: not a valid WASM binary
`,1;const w=await WebAssembly.compile(e),d=s.split("/").pop()||s;return await m(a,{module:w,image:new Uint8Array(e),argv:[d,...i]})}catch(e){return e instanceof u?e.code:(a.stderr+=`wasi: ${e.message}
`,1)}}};async function f(a){const r=a.args[1];if(!r)return a.stderr+=`wasi exec: missing package name
`,a.stderr+=`Usage: wasi exec <package> [args...]
`,1;const s=g(r);if(!s)return a.stderr+=`wasi exec: unknown package '${r}'
`,a.stderr+=`Run "pkg available" to see available packages.
`,1;const i=a.args.slice(2);try{const e=await l(s.name,n=>{a.stderr+=`  ${n}
`});return await m(a,{module:e,argv:[s.name,...i]})}catch(e){return e instanceof u?e.code:(a.stderr+=`wasi exec: ${e.message}
`,1)}}(globalThis.__tabcomputerLive??=new Map).set("src/commands/wasi.ts",p);export{c as wasiCmd};
