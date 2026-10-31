import{findX86Package as r,removeX86Package as p,clearX86Cache as u,listX86Installed as d,searchX86Packages as c,downloadX86Package as g,listX86Available as f}from"./x86-packages-DlkaGcWi.js";const m=Object.freeze(Object.defineProperty({__proto__:null,get xpkgCmd(){return F}},Symbol.toStringTag,{value:"Module"})),o="/usr/local/bin";async function k(e){for(const s of["/usr","/usr/local",o])try{await e.stat(s)}catch{await e.mkdir(s)}}async function $(e,s){const a=r(s);if(!a)return;await k(e.fs);const n=`#!x86-pkg ${a.name}
`;await e.fs.writeFile(`${o}/${a.name}`,n);const t=a.aliases||[];for(const i of t)await e.fs.writeFile(`${o}/${i}`,n);if(a.applets)for(const i of a.applets){const l=`#!x86-pkg ${a.name} ${i}
`;await e.fs.writeFile(`${o}/${i}`,l)}}async function h(e,s){const a=r(s);if(!a)return;const n=[a.name,...a.aliases||[],...a.applets||[]];for(const t of n)try{await e.fs.unlink(`${o}/${t}`)}catch{}}async function y(e){const s=e.args[1];if(!s)return e.stderr+=`xpkg install: missing package name
`,1;try{await g(s,n=>{e.stdout+=n+`
`}),await $(e,s);const a=r(s);return a?.applets&&(e.stdout+=`Installed ${a.applets.length} applet stubs in ${o}
`),s==="python3"&&await b(e),0}catch(a){return e.stderr+=`xpkg install: ${a.message}
`,1}}async function b(e){const s=e.fs,a=["/usr","/usr/lib","/usr/lib/python3.12","/usr/lib/python3.12/lib-dynload","/usr/lib/python3.12/encodings"];for(const n of a)try{await s.mkdir(n)}catch{}await s.writeFile("/usr/lib/python3.12/site.py",`# Minimal site.py for tabcomputer
`),await s.writeFile("/usr/lib/python3.12/encodings/__init__.py",`# encodings package stub
import codecs
def search_function(name):
    return None
codecs.register(search_function)
`),await s.writeFile("/usr/lib/python3.12/encodings/utf_8.py",`import codecs
codec_info = codecs.lookup("utf-8")
`),await s.writeFile("/usr/lib/python3.12/encodings/aliases.py",`aliases = {}
`),e.stdout+=`Python 3.12 stdlib initialized in /usr/lib/python3.12/
`}async function w(e){const s=e.args.slice(1).join(" ");if(!s)return e.stderr+=`xpkg search: missing query
`,1;const a=c(s);if(a.length===0)return e.stdout+=`No packages found matching '${s}'
`,0;for(const n of a){const t=n.size>1e6?`${(n.size/1e6).toFixed(1)}MB`:`${(n.size/1e3).toFixed(0)}KB`;e.stdout+=`  ${n.name.padEnd(16)} ${n.version.padEnd(8)} ${t.padEnd(8)} ${n.description}
`}return 0}async function v(e){const s=await d();if(s.length===0)return e.stdout+=`No x86 packages installed.
`,e.stdout+=`Run 'xpkg available' to see available packages.
`,0;e.stdout+=`Installed x86-64 packages:
`;for(const a of s){const n=a.size>1e6?`${(a.size/1e6).toFixed(1)}MB`:`${(a.size/1e3).toFixed(0)}KB`,t=new Date(a.installedAt).toLocaleDateString();e.stdout+=`  ${a.name.padEnd(16)} ${a.version.padEnd(8)} ${n.padEnd(8)} installed ${t}
`}return 0}async function z(e){const s=f(),a=await d(),n=new Set(a.map(t=>t.name));e.stdout+=`Available x86-64 ELF packages:

`;for(const t of s){const i=t.size>1e6?`${(t.size/1e6).toFixed(1)}MB`:`${(t.size/1e3).toFixed(0)}KB`,l=n.has(t.name)?" [installed]":"";e.stdout+=`  ${t.name.padEnd(16)} ${t.version.padEnd(8)} ${i.padEnd(8)} ${t.description}${l}
`}return e.stdout+=`
${s.length} packages available. Use 'xpkg install <name>' to install.
`,0}async function S(e){const s=e.args[1];if(!s)return e.stderr+=`xpkg remove: missing package name
`,1;try{return await h(e,s),await p(s),u(s),e.stdout+=`Removed ${s}
`,0}catch(a){return e.stderr+=`xpkg remove: ${a.message}
`,1}}async function _(e){const s=e.args[1];if(!s)return e.stderr+=`xpkg info: missing package name
`,1;const a=r(s);if(!a)return e.stderr+=`xpkg info: package '${s}' not found
`,1;const n=a.size>1e6?`${(a.size/1e6).toFixed(1)}MB`:`${(a.size/1e3).toFixed(0)}KB`;return e.stdout+=`Name:        ${a.name}
`,e.stdout+=`Version:     ${a.version}
`,e.stdout+=`Description: ${a.description}
`,e.stdout+=`Category:    ${a.category}
`,e.stdout+=`Size:        ${n}
`,e.stdout+=`URL:         ${a.url}
`,e.stdout+=`Arch:        x86-64 (musl-static)
`,a.aliases?.length&&(e.stdout+=`Aliases:     ${a.aliases.join(", ")}
`),a.applets?.length&&(e.stdout+=`Applets:     ${a.applets.length} (${a.applets.slice(0,10).join(", ")}${a.applets.length>10?"...":""})
`),0}const F={name:"xpkg",description:"Binary (x86-64) package manager",async exec(e){const s=e.args[0];if(!s||s==="--help"||s==="-h")return e.stdout+=`Usage: xpkg <command> [args]

`,e.stdout+=`Commands:
`,e.stdout+=`  install <name>    Download and cache an x86-64 ELF binary
`,e.stdout+=`  search <query>    Search available packages
`,e.stdout+=`  list              Show installed packages
`,e.stdout+=`  available         Show all available packages
`,e.stdout+=`  remove <name>     Remove a cached package
`,e.stdout+=`  info <name>       Show package details
`,0;switch(s){case"install":case"i":return y(e);case"search":case"s":return w(e);case"list":case"ls":return v(e);case"available":case"avail":return z(e);case"remove":case"rm":case"uninstall":return S(e);case"info":return _(e);default:return e.stderr+=`xpkg: unknown command '${s}'
`,e.stderr+=`Run 'xpkg --help' for usage.
`,1}}};(globalThis.__tabcomputerLive??=new Map).set("src/commands/xpkg.ts",m);export{F as xpkgCmd};
