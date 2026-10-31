const a=Object.freeze(Object.defineProperty({__proto__:null,get TKINTER_STUB(){return i},get ensurePythonHints(){return s}},Symbol.toStringTag,{value:"Module"})),o="/usr/lib/pkg/python3/lib/python3.13/site-packages",i=`# Written by tabcomputer (src/python-hints.ts). Its built-in Python has no Tk.
import glob as _glob
if _glob.glob('/usr/lib/python3*/tkinter/__init__.py'):
    raise ModuleNotFoundError(
        "No module named 'tkinter' in tabcomputer's built-in Python. Debian's Python is installed and has it. "
        "Use it for this: python3 --debian FILE.py, or python3 --debian for its prompt.",
        name='tkinter')
raise ModuleNotFoundError(
    "No module named 'tkinter': tabcomputer's built-in Python has no Tk, so no tkinter and no turtle. "
    "Debian's Python has both and draws in a window. Run: toolchain install python   "
    "(python3 then runs a program that imports tkinter or turtle on Debian's Python)",
    name='tkinter')
`,e=new WeakSet;async function s(t){if(!e.has(t)){e.add(t);try{if(!await t.exists(o)){e.delete(t);return}const r=`${o}/tkinter/__init__.py`,n=await t.readFile(r,"utf8").catch(()=>null);if(n===i||n!==null&&!(typeof n=="string"&&n.startsWith("# Written by tabcomputer")))return;await t.mkdir(`${o}/tkinter`,{recursive:!0}),await t.writeFile(r,i)}catch{}}}(globalThis.__tabcomputerLive??=new Map).set("src/python-hints.ts",a);(globalThis.__tabcomputerLiveState??=new Map).set("src/python-hints.ts",{get done(){return e}});export{i as TKINTER_STUB,s as ensurePythonHints};
