const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./index-BIxBofyG.js","./index-LZoznX6r.css","./pip-Hy95NsG9.js"])))=>i.map(i=>d[i]);
import{a as y}from"./index-BIxBofyG.js";const S=Object.freeze(Object.defineProperty({__proto__:null,get pipCmd(){return E},get python3Cmd(){return b},get pythonCmd(){return O}},Symbol.toStringTag,{value:"Module"})),f="https://cdn.jsdelivr.net/pyodide/v0.27.2/full";let _=null,c=null;async function P(t){if(_)return _;if(c)return c;c=(async()=>{t.stdout+="Loading Python (Pyodide)... ";const e=await import(`${f}/pyodide.mjs`),i=e.loadPyodide||e.default?.loadPyodide;if(!i)throw new Error("Failed to load Pyodide loader");return _=await i({indexURL:f}),t.stdout+=`done.
`,_})();try{return await c}catch(n){throw c=null,n}}async function v(t,n,e){try{try{t.FS.mkdir("/shiro")}catch{}const i=await n.fs.readdir(e);for(const u of i){if(u===".git")continue;const o=e==="/"?"/"+u:e+"/"+u,r="/shiro"+o;try{const m=await n.fs.stat(o);if(m.isDirectory()){try{t.FS.mkdir(r)}catch{}await v(t,n,o)}else if(m.isFile()){const s=await n.fs.readFile(o),a=r.split("/").slice(0,-1).join("/");try{t.FS.mkdirTree(a)}catch{}s instanceof Uint8Array,t.FS.writeFile(r,s)}}catch{}}}catch{}}function w(t,n,e,i){let u="";t.runPython(`import sys, io
_shiro_out = io.StringIO()
_shiro_err = io.StringIO()
sys.stdout = _shiro_out
sys.stderr = _shiro_err`);try{t.runPython(e),t.runPython(i)}catch(o){u=String(o?.message??o).replace(/\n?$/,`
`)}return n.stdout+=t.runPython("_shiro_out.getvalue()"),n.stderr+=t.runPython("_shiro_err.getvalue()"),t.runPython("sys.stdout = sys.__stdout__; sys.stderr = sys.__stderr__"),n.stderr+=u,u?1:0}const O={name:"python",description:"Python interpreter (Pyodide)",async exec(t){const{pythonFrontend:n}=await y(async()=>{const{pythonFrontend:s}=await import("./index-BIxBofyG.js").then(a=>a.fK);return{pythonFrontend:s}},__vite__mapDeps([0,1]),import.meta.url);if(n(t.args)&&t.shell){const{quoteArgsForShell:s}=await y(async()=>{const{quoteArgsForShell:l}=await import("./index-BIxBofyG.js").then(h=>h.fM);return{quoteArgsForShell:l}},__vite__mapDeps([0,1]),import.meta.url),a=l=>{t.stdout+=l.replace(/\r\n/g,`
`)},p=l=>{t.stderr+=l.replace(/\r\n/g,`
`)};p(`python3 -m venv and -m pip need the CPython package: pkg install python3
`);const d=await t.shell.execute("pkg install python3 >/dev/null",a,p);return d!==0?d:t.shell.execute(`/usr/bin/python3 ${s(t.args)}`,a,p)}let e;try{e=await P(t)}catch(s){return t.stderr+=`error: failed to load Pyodide: ${s.message}
`,1}const i=t.args,u=i.indexOf("-c");if(u!==-1&&i[u+1]){const s=i[u+1];return w(e,t,`import sys; sys.argv = ['-c', *${JSON.stringify(i.slice(u+2))}]`,s)}const o=i.find(s=>!s.startsWith("-"));if(o){const s=t.fs.resolvePath(o,t.cwd);let a;try{a=await t.fs.readFile(s,"utf8")}catch{return t.stderr+=`python: can't open file '${o}': [Errno 2] No such file or directory
`,2}return await v(e,t,t.cwd),w(e,t,`import sys, os
sys.argv = ${JSON.stringify([o,...i.slice(i.indexOf(o)+1)])}
os.chdir('/shiro${t.cwd}')`,a)}if(!t.terminal)return t.stderr+=`python: interactive mode requires a terminal
`,1;const r=t.terminal,m=e.runPython("import sys; sys.version");return r.writeOutput(`Python ${m} (Pyodide)\r
Type "exit()" to quit.\r
`),new Promise(s=>{let a="";const p=">>> ";r.writeOutput(p),r.enterRawMode(d=>{if(d==="Enter"||d==="\r"||d===`
`){r.writeOutput(`\r
`);const l=a.trim();if(a="",l==="exit()"||l==="quit()"){r.exitRawMode(),s(0);return}if(l)try{e.runPython(`
import sys, io
_shiro_out = io.StringIO()
_shiro_err = io.StringIO()
sys.stdout = _shiro_out
sys.stderr = _shiro_err
`);try{const L=e.runPython(`
try:
    _r = eval(${JSON.stringify(l)})
    if _r is not None:
        print(repr(_r))
except SyntaxError:
    exec(${JSON.stringify(l)})
`)}catch{}const h=e.runPython("_shiro_out.getvalue()"),g=e.runPython("_shiro_err.getvalue()");e.runPython("sys.stdout = sys.__stdout__; sys.stderr = sys.__stderr__"),h&&r.writeOutput(h.replace(/\n/g,`\r
`)),g&&r.writeOutput(g.replace(/\n/g,`\r
`))}catch(h){r.writeOutput(h.message.replace(/\n/g,`\r
`)+`\r
`)}r.writeOutput(p)}else d==="Backspace"||d===""||d==="\b"?a.length>0&&(a=a.slice(0,-1),r.writeOutput("\b \b")):d==="Ctrl+C"||d===""?(r.writeOutput(`^C\r
`),a="",r.writeOutput(p)):d==="Ctrl+D"||d===""?(r.writeOutput(`\r
`),r.exitRawMode(),s(0)):d.length===1&&d.charCodeAt(0)>=32&&(a+=d,r.writeOutput(d))})})}},b={...O,name:"python3",description:"Python 3 interpreter (Pyodide)"},E={name:"pip",description:"Python package manager",async exec(t){const n=await y(()=>import("./pip-Hy95NsG9.js"),__vite__mapDeps([2,0,1]),import.meta.url);if(await n.havePython(t.fs))return n.pipMain(t,t.args,await n.pipTarget(t));const e=t.args;if(e[0]!=="install"||!e[1])return t.stderr+=`usage: pip install <package> [<package>...]
`,1;let i;try{i=await P(t)}catch(o){return t.stderr+=`error: failed to load Pyodide: ${o.message}
`,1}const u=e.slice(1).filter(o=>!o.startsWith("-"));try{await i.loadPackage("micropip");const o=i.pyimport("micropip");for(const r of u)t.stdout+=`Installing ${r}...
`,await o.install(r),t.stdout+=`Successfully installed ${r}
`;return 0}catch(o){return t.stderr+=`pip: error installing packages: ${o.message}
`,1}}};(globalThis.__tabcomputerLive??=new Map).set("src/commands/python.ts",S);(globalThis.__tabcomputerLiveState??=new Map).set("src/commands/python.ts",{get pyodide(){return _},set pyodide(t){_=t},get loadPromise(){return c},set loadPromise(t){c=t}});(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/pkg-manager.ts",()=>y(()=>import("./index-BIxBofyG.js").then(t=>t.fK),__vite__mapDeps([0,1]),import.meta.url));(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/shell.ts",()=>y(()=>import("./index-BIxBofyG.js").then(t=>t.fM),__vite__mapDeps([0,1]),import.meta.url));(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/commands/pip.ts",()=>y(()=>import("./pip-Hy95NsG9.js"),__vite__mapDeps([2,0,1]),import.meta.url));export{E as pipCmd,b as python3Cmd,O as pythonCmd};
