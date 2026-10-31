const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./index-C6zxlZK4.js","./index-LZoznX6r.css","./boot-DgL9LUvX.js","./route-CqgUohJL.js","./pyodide-dist-C2xzJA0D.js","./pep440-zsYL6T2i.js","./host-RNF8_db9.js","./worker-host-Bd9sHFIT.js","./pip-B20XuZPx.js","./tar-DpC7QC2A.js"])))=>i.map(i=>d[i]);
import{a as p}from"./index-C6zxlZK4.js";import{pyodideIndexURL as L}from"./pyodide-dist-C2xzJA0D.js";import"./pep440-zsYL6T2i.js";const T=Object.freeze(Object.defineProperty({__proto__:null,get pipCmd(){return b},get python3Cmd(){return I},get pythonCmd(){return E}},Symbol.toStringTag,{value:"Module"}));let h=null,m=null;async function O(t){if(h)return h;if(m)return m;m=(async()=>{t.stdout+="Loading Python (Pyodide)... ";const e=await L(),r=await import(`${e}pyodide.mjs`),i=r.loadPyodide||r.default?.loadPyodide;if(!i)throw new Error("Failed to load Pyodide loader");return h=await i({indexURL:e}),t.stdout+=`done.
`,h})();try{return await m}catch(e){throw m=null,e}}async function v(t,e,_){try{try{t.FS.mkdir("/shiro")}catch{}const r=await e.fs.readdir(_);for(const i of r){if(i===".git")continue;const s=_==="/"?"/"+i:_+"/"+i,l="/shiro"+s;try{const a=await e.fs.stat(s);if(a.isDirectory()){try{t.FS.mkdir(l)}catch{}await v(t,e,s)}else if(a.isFile()){const g=await e.fs.readFile(s),o=l.split("/").slice(0,-1).join("/");try{t.FS.mkdirTree(o)}catch{}g instanceof Uint8Array,t.FS.writeFile(l,g)}}catch{}}}catch{}}async function P(t,e){try{await t.loadPackagesFromImports?.(e,{messageCallback:()=>{},errorCallback:()=>{}})}catch{}}function f(t,e,_,r){let i="";t.runPython(`import sys, io
_shiro_out = io.StringIO()
_shiro_err = io.StringIO()
sys.stdout = _shiro_out
sys.stderr = _shiro_err`);try{t.runPython(_),t.runPython(r)}catch(s){i=String(s?.message??s).replace(/\n?$/,`
`)}return e.stdout+=t.runPython("_shiro_out.getvalue()"),e.stderr+=t.runPython("_shiro_err.getvalue()"),t.runPython("sys.stdout = sys.__stdout__; sys.stderr = sys.__stderr__"),e.stderr+=i,i?1:0}const E={name:"python",description:"Python interpreter (Pyodide)",async exec(t){const{pythonFrontend:e}=await p(async()=>{const{pythonFrontend:o}=await import("./index-C6zxlZK4.js").then(n=>n.gy);return{pythonFrontend:o}},__vite__mapDeps([0,1]),import.meta.url);if(e(t.args)&&t.shell){const{quoteArgsForShell:o}=await p(async()=>{const{quoteArgsForShell:c}=await import("./index-C6zxlZK4.js").then(y=>y.gA);return{quoteArgsForShell:c}},__vite__mapDeps([0,1]),import.meta.url),n=c=>{t.stdout+=c.replace(/\r\n/g,`
`)},u=c=>{t.stderr+=c.replace(/\r\n/g,`
`)};u(`python3 -m venv and -m pip need the CPython package: pkg install python3
`);const d=await t.shell.execute("pkg install python3 >/dev/null",n,u);return d!==0?d:t.shell.execute(`/usr/bin/python3 ${o(t.args)}`,n,u)}const{pyodideWorkerMode:_}=await p(async()=>{const{pyodideWorkerMode:o}=await import("./boot-DgL9LUvX.js");return{pyodideWorkerMode:o}},__vite__mapDeps([2,0,1]),import.meta.url);if(_()){const{routePython:o}=await p(async()=>{const{routePython:u}=await import("./route-CqgUohJL.js");return{routePython:u}},__vite__mapDeps([3,4,5,0,1]),import.meta.url),n=await o(t.fs,["--pyodide",...t.args],{cwd:t.cwd,env:t.env,canPyodide:!0,stdinIsTTY:!!t.terminal&&!t.stdin});return n.engine==="pyodide"?(await p(async()=>{const{runPyodide:u}=await import("./host-RNF8_db9.js");return{runPyodide:u}},__vite__mapDeps([6,0,1,2,7,4,5]),import.meta.url)).runPyodide(t,n.run,"pyodide"):(t.stdout+=`Python ${(await p(async()=>{const{PYODIDE_PYTHON:u}=await import("./pyodide-dist-C2xzJA0D.js");return{PYODIDE_PYTHON:u}},__vite__mapDeps([4,5,0,1]),import.meta.url)).PYODIDE_PYTHON} (Pyodide ${(await p(async()=>{const{PYODIDE_VERSION:u}=await import("./pyodide-dist-C2xzJA0D.js");return{PYODIDE_VERSION:u}},__vite__mapDeps([4,5,0,1]),import.meta.url)).PYODIDE_VERSION})
`,0)}let r;try{r=await O(t)}catch(o){return t.stderr+=`error: failed to load Pyodide: ${o.message}
`,1}const i=t.args,s=i.indexOf("-c");if(s!==-1&&i[s+1]){const o=i[s+1];return await P(r,o),f(r,t,`import sys; sys.argv = ['-c', *${JSON.stringify(i.slice(s+2))}]`,o)}const l=i.find(o=>!o.startsWith("-"));if(l){const o=t.fs.resolvePath(l,t.cwd);let n;try{n=await t.fs.readFile(o,"utf8")}catch{return t.stderr+=`python: can't open file '${l}': [Errno 2] No such file or directory
`,2}return await v(r,t,t.cwd),await P(r,n),f(r,t,`import sys, os
sys.argv = ${JSON.stringify([l,...i.slice(i.indexOf(l)+1)])}
os.chdir('/shiro${t.cwd}')`,n)}if(!t.terminal)return t.stderr+=`python: interactive mode requires a terminal
`,1;const a=t.terminal,g=r.runPython("import sys; sys.version");return a.writeOutput(`Python ${g} (Pyodide)\r
Type "exit()" to quit.\r
`),new Promise(o=>{let n="";const u=">>> ";a.writeOutput(u),a.enterRawMode(d=>{if(d==="Enter"||d==="\r"||d===`
`){a.writeOutput(`\r
`);const c=n.trim();if(n="",c==="exit()"||c==="quit()"){a.exitRawMode(),o(0);return}if(c)try{r.runPython(`
import sys, io
_shiro_out = io.StringIO()
_shiro_err = io.StringIO()
sys.stdout = _shiro_out
sys.stderr = _shiro_err
`);try{const D=r.runPython(`
try:
    _r = eval(${JSON.stringify(c)})
    if _r is not None:
        print(repr(_r))
except SyntaxError:
    exec(${JSON.stringify(c)})
`)}catch{}const y=r.runPython("_shiro_out.getvalue()"),w=r.runPython("_shiro_err.getvalue()");r.runPython("sys.stdout = sys.__stdout__; sys.stderr = sys.__stderr__"),y&&a.writeOutput(y.replace(/\n/g,`\r
`)),w&&a.writeOutput(w.replace(/\n/g,`\r
`))}catch(y){a.writeOutput(y.message.replace(/\n/g,`\r
`)+`\r
`)}a.writeOutput(u)}else d==="Backspace"||d===""||d==="\b"?n.length>0&&(n=n.slice(0,-1),a.writeOutput("\b \b")):d==="Ctrl+C"||d===""?(a.writeOutput(`^C\r
`),n="",a.writeOutput(u)):d==="Ctrl+D"||d===""?(a.writeOutput(`\r
`),a.exitRawMode(),o(0)):d.length===1&&d.charCodeAt(0)>=32&&(n+=d,a.writeOutput(d))})})}},I={...E,name:"python3",description:"Python 3 interpreter (Pyodide)"},b={name:"pip",description:"Python package manager",async exec(t){const e=await p(()=>import("./pip-B20XuZPx.js"),__vite__mapDeps([8,0,1,5,9,4]),import.meta.url);if(await e.havePython(t.fs))return e.pipMain(t,t.args,await e.pipTarget(t));const _=t.args;if(_[0]!=="install"||!_[1])return t.stderr+=`usage: pip install <package> [<package>...]
`,1;let r;try{r=await O(t)}catch(s){return t.stderr+=`error: failed to load Pyodide: ${s.message}
`,1}const i=_.slice(1).filter(s=>!s.startsWith("-"));try{await r.loadPackage("micropip");const s=r.pyimport("micropip");for(const l of i)t.stdout+=`Installing ${l}...
`,await s.install(l),t.stdout+=`Successfully installed ${l}
`;return 0}catch(s){return t.stderr+=`pip: error installing packages: ${s.message}
`,1}}};(globalThis.__tabcomputerLive??=new Map).set("src/commands/python.ts",T);(globalThis.__tabcomputerLiveState??=new Map).set("src/commands/python.ts",{get pyodide(){return h},set pyodide(t){h=t},get loadPromise(){return m},set loadPromise(t){m=t}});(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/pkg-manager.ts",()=>p(()=>import("./index-C6zxlZK4.js").then(t=>t.gy),__vite__mapDeps([0,1]),import.meta.url));(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/shell.ts",()=>p(()=>import("./index-C6zxlZK4.js").then(t=>t.gA),__vite__mapDeps([0,1]),import.meta.url));(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/pyodide-worker/boot.ts",()=>p(()=>import("./boot-DgL9LUvX.js"),__vite__mapDeps([2,0,1]),import.meta.url));(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/python/route.ts",()=>p(()=>import("./route-CqgUohJL.js"),__vite__mapDeps([3,4,5,0,1]),import.meta.url));(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/pyodide-worker/host.ts",()=>p(()=>import("./host-RNF8_db9.js"),__vite__mapDeps([6,0,1,2,7,4,5]),import.meta.url));(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/python/pyodide-dist.ts",()=>p(()=>import("./pyodide-dist-C2xzJA0D.js"),__vite__mapDeps([4,5,0,1]),import.meta.url));(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/commands/pip.ts",()=>p(()=>import("./pip-B20XuZPx.js"),__vite__mapDeps([8,0,1,5,9,4]),import.meta.url));export{b as pipCmd,I as python3Cmd,E as pythonCmd};
