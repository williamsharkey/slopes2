const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./kernel-bWiZvCAx.js","./index-3dop0BuN.js","./index-LZoznX6r.css","./worker-host-BiOXmjwz.js","./boot-DwiH5R-F.js","./route-CIO1VAjh.js","./pyodide-dist-D3GPgcyI.js","./pep440-zsYL6T2i.js","./nbformat-VmXTDJ4c.js","./run-command-vwyq5hwx.js","./host-C5gDyGHy.js","./stdio-a63L4YLQ.js"])))=>i.map(i=>d[i]);
import{a as y}from"./index-3dop0BuN.js";import{p as L,n as I,a as j,N as $,O,i as P,o as N,s as F,b as A}from"./nbformat-VmXTDJ4c.js";import{PYODIDE_PYTHON as D}from"./pyodide-dist-D3GPgcyI.js";import"./pep440-zsYL6T2i.js";const T=Object.freeze(Object.defineProperty({__proto__:null,get jupyterAlias(){return C},get jupyterCmd(){return E}},Symbol.toStringTag,{value:"Module"})),S=`usage: jupyter notebook [FILE|DIR]     open a notebook (or list a folder's notebooks)
       jupyter lab [FILE|DIR]          the same
       jupyter execute FILE...         run a notebook here and print what it prints
                                       (--inplace saves the outputs in the file)
       jupyter nbconvert --to script FILE...
       jupyter nbconvert --to notebook --execute [--inplace] FILE...

Notebooks run in this computer's Python. Nothing needs to be installed.
`;async function R(e,t,n){let r;try{r=await e.fs.readFile(t,"utf8")}catch{return e.stderr+=`jupyter: ${t}: there is no such file
`,1}let a;try{a=j(r)}catch(o){return e.stderr+=`jupyter: ${t}: ${o instanceof $?o.message:o?.message??o}
`,1}const{NotebookKernel:s,kernelUnavailable:i}=await y(async()=>{const{NotebookKernel:o,kernelUnavailable:c}=await import("./kernel-bWiZvCAx.js");return{NotebookKernel:o,kernelUnavailable:c}},__vite__mapDeps([0,1,2,3,4,5,6,7,8]),import.meta.url),u=i();if(u)return e.stderr+=`jupyter: ${u}
`,1;const{kernelForContext:p}=await y(async()=>{const{kernelForContext:o}=await import("./run-command-vwyq5hwx.js");return{kernelForContext:o}},__vite__mapDeps([9,1,2,10,3,11]),import.meta.url),v=t.slice(0,t.lastIndexOf("/"))||"/",l=new s({kernel:p(e),fs:e.fs,shell:e.shell,cwd:v,name:t.slice(t.lastIndexOf("/")+1)}),f=e.streamStdout??(o=>{e.stdout+=o}),b=e.shell.abortController;let h=!1;const m=()=>{h=!0,l.shutdown()};b?.signal.addEventListener("abort",m);let k=!1;try{l.start();for(const o of a.cells){if(o.cell_type!=="code"||h)continue;const c=new O;if(o.execution_count=null,o.outputs=c.outputs,P(o.source))continue;let _=0;const w=await l.execute(o.source,{onOutput:d=>{c.apply(d),d.t==="stream"&&(f(d.text),_=c.outputs.length)}});o.outputs=c.outputs,o.execution_count=w.count||null;const g=c.outputs.slice(_).filter(d=>d.output_type!=="stream");if(g.length&&f(N(g)),w.status!=="ok"){k=!0;break}}l.python&&F(a,l.python),l.state==="dead"&&l.lastError&&!h&&(e.stderr+=`jupyter: Python stopped: ${l.lastError.trim()}
`)}finally{b?.signal.removeEventListener("abort",m),l.shutdown()}if(h)return 130;if(n){try{await e.fs.writeFile(n,A(a))}catch(o){return e.stderr+=`jupyter: ${n} was not written: ${o?.message??o}
`,1}e.stderr+=`jupyter: the notebook and its outputs are saved in ${n}
`}return k?1:0}const E={name:"jupyter",description:"Notebooks: open one in the Notebook app, or run one here",async exec(e){const t=L(e.args),n=r=>e.fs.resolvePath(r,e.cwd);switch(t.action){case"help":return e.stdout+=S,0;case"version":return e.stdout+=`Selected Jupyter core packages...
notebook         : tabcomputer (built in)
jupyterlab       : not installed
Python           : ${D} (Pyodide, in this tab)
`,0;case"kernelspec":return e.stdout+=`Available kernels:
  python3    this computer's Python (Pyodide), built in
`,0;case"error":return e.stderr+=`${t.message}
`,2;case"script":{let r=0;for(const a of t.files){const s=n(a);try{const i=I(j(await e.fs.readFile(s,"utf8")));if(t.stdout)e.stdout+=i;else{const u=s.replace(/\.ipynb$/i,"")+".py";await e.fs.writeFile(u,i),e.stderr+=`jupyter: ${a} is written as a script in ${u}
`}}catch(i){e.stderr+=`jupyter: ${a}: ${i instanceof $?i.message:"the file could not be read"}
`,r=1}}return r}case"execute":{let r=0;for(const a of t.files){const s=n(a),i=s.replace(/\.ipynb$/i,"");let u=null;if(t.inplace)u=s;else if(t.output){let p=t.output.replace("{stem}",i.slice(i.lastIndexOf("/")+1));/\.ipynb$/i.test(p)||(p+=".ipynb"),u=p.includes("/")?n(p):`${s.slice(0,s.lastIndexOf("/"))||""}/${p}`}if(r=Math.max(r,await R(e,s,u)),r===130)break}return r}case"open":{const r=globalThis.__shiroDesktop,a=t.path?n(t.path):e.cwd;if(!r?.apps().some(s=>s.id==="notebook"))return e.stderr+=t.path?`jupyter: the Notebook app is on the desktop, and this page shows the terminal only.
Run the notebook here with: jupyter execute ${t.path}
Or switch to the desktop with: desktop
`:`jupyter: the Notebook app is on the desktop, and this page shows the terminal only. Switch with: desktop
`,1;if(t.path&&!/\.ipynb$/i.test(a)){const s=await e.fs.stat(a).catch(()=>null);if(!s)return e.stderr+=`jupyter: ${t.path}: there is no such file or folder
`,1;if(!s.isDirectory())return e.stderr+=`jupyter: ${t.path} is not a notebook (a notebook's name ends in .ipynb)
`,1}return await r.openApp("notebook",{path:a}),0}}}},C=(e,t)=>({name:e,description:`The same as jupyter ${t}`,async exec(n){const r=n.args;n.args=[t,...r];try{return await E.exec(n)}finally{n.args=r}}});(globalThis.__tabcomputerLive??=new Map).set("src/commands/jupyter.ts",T);(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/notebook/kernel.ts",()=>y(()=>import("./kernel-bWiZvCAx.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8]),import.meta.url));(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/wasi/run-command.ts",()=>y(()=>import("./run-command-vwyq5hwx.js"),__vite__mapDeps([9,1,2,10,3,11]),import.meta.url));export{C as jupyterAlias,E as jupyterCmd};
