const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./package-sets-Dng57D6p.js","./index-C6zxlZK4.js","./index-LZoznX6r.css","./layers-Crne9TjB.js","./rootfs-D2Mghvib.js"])))=>i.map(i=>d[i]);
import{T as c,U as I,a as $,V as h,X as R,Y as F,Z as g,$ as k,a0 as b,a1 as V,a2 as w,a3 as v,a4 as P,a5 as K,a6 as _,a7 as q,a8 as B,a9 as Y}from"./index-C6zxlZK4.js";const Z=Object.freeze(Object.defineProperty({__proto__:null,get aptCmd(){return N},get aptGetCmd(){return ie},get pkgCmd(){return ne}},Symbol.toStringTag,{value:"Module"})),j=`Usage: pkg <command> [args]

Commands:
  install <name>...   Download, verify (sha256) and install packages
  remove <name>...    Remove installed packages
  list [--all]        Installed packages; --all lists the whole index
  available           Every package with its status
  search <query>      Search names, descriptions and commands
  info <name>         Package details (version, license, source, files)
  files <name>        Files an installed package owns
  update              Fetch extra index lists from ${h}
  outdated            Installed packages the index has a different version of
  upgrade [--dry-run] Upgrade installed packages to the index versions

Options: --force (install despite missing kernel features), --reinstall, -y (ignored)
Packages install to ${R}/<name>/ with commands linked into /usr/bin.
`,L={ok:"ok",partial:"partial",blocked:"needs kernel"};function y(e){const i=new Set(e.filter(a=>a.startsWith("-"))),t=e.filter(a=>!a.startsWith("-"));return{flags:i,names:t}}async function p(e,i){const{flags:t,names:a}=y(i);if(a.length===0)return e.stderr+=`pkg install: missing package name
`,1;const n=await c(e.fs);try{const s=F(n,a),d=await g(e.fs),r=s.filter(l=>!d[l.name]);r.length&&(e.stdout+=`The following NEW packages will be installed:
  ${r.map(l=>l.name).join(" ")}
`,e.stdout+=`Need to get ${k(r.reduce((l,u)=>l+b(u),0))} of archives.
`),await V(e.fs,n,a,{force:t.has("--force")||t.has("-f"),reinstall:t.has("--reinstall"),env:e.env,log:l=>{e.stdout+=l+`
`}});for(const l of s)w(l,l.wants||[]).length&&l.notes&&(e.stdout+=`Note: ${l.name}: ${l.notes}
`);return 0}catch(s){return e.stderr+=`E: ${s.message}
`,/^unable to locate package /.test(s.message)&&(e.stderr+=`   pkg installs tabcomputer's own packages (pkg available). Debian may have it: apt install NAME
`),100}}async function H(e,i){const{names:t}=y(i),a=i.filter(o=>o.startsWith("-")),n=await c(e.fs),s=t.filter(o=>I(n,o));if(s.length===t.length)return p(e,i);const d=await $(()=>import("./package-sets-Dng57D6p.js"),__vite__mapDeps([0,1,2,3,4]),import.meta.url),r=o=>{e.streamStdout?e.streamStdout(o):e.stdout+=o},l=o=>{e.streamStderr?e.streamStderr(o):e.stderr+=o};let u=t.filter(o=>!s.includes(o)),m=0;const U=u.filter(o=>!d.PACKAGE_NAME.test(o)),E=u.filter(o=>d.PACKAGE_NAME.test(o)),W=E.length?await d.askAboutSet(E):null,f=[...U,...W?.unknown??[]];if(f.length){for(const o of f)l(`E: unable to locate package ${o}: it is not one of tabcomputer's own packages, and Debian has no package of that name
`);u=u.filter(o=>!f.includes(o)),m=100}if(s.length){(u.length||f.length)&&r(`${s.join(", ")}: from tabcomputer's own packages.
`);const o=e.stdout.length,z=await p(e,[...a,...s]);e.streamStdout&&e.stdout.length>o&&(e.streamStdout(e.stdout.slice(o)),e.stdout=e.stdout.slice(0,o)),m||=z}if(!u.length)return m;const{installedRootfs:G}=await $(async()=>{const{installedRootfs:o}=await import("./rootfs-D2Mghvib.js");return{installedRootfs:o}},[],import.meta.url),S=!!await G(e.fs);r(`${u.join(", ")}: not in tabcomputer's own packages; installing from Debian${S?"":" (Debian is set up first, once)"}.
`);const A=o=>e.shell.fork().runScriptText(o,e.terminal,r,l);if(!S){const o=await A("debian install");if(o)return o}const M=await A(`/usr/bin/apt-get install -y -- ${u.join(" ")}`);return m||M}async function J(e,i){const{names:t}=y(i);if(t.length===0)return e.stderr+=`pkg remove: missing package name
`,1;let a=0;for(const n of t){const s=await B(e.fs,n);if(s.length){e.stderr+=`E: ${n} is needed by ${s.join(", ")}; remove those first
`,a=100;continue}await Y(e.fs,n)?e.stdout+=`Removing ${n} ...
`:e.stderr+=`Package '${n}' is not installed, so not removed
`}return a}function T(e,i=""){return`  ${e.name.padEnd(13)} ${e.version.padEnd(9)} ${k(b(e)).padEnd(8)} ${e.description}${i}
`}async function X(e,i){if(i.includes("--all")||i.includes("-a"))return O(e);const t=Object.values(await g(e.fs)).sort((n,s)=>n.name.localeCompare(s.name));if(t.length===0)return e.stdout+=`No packages installed. Run 'pkg available' to see what can be.
`,0;const a=new Map((await v(e.fs)).map(n=>[n.name,n]));for(const n of t){const s=a.get(n.name);e.stdout+=`  ${n.name.padEnd(13)} ${n.version.padEnd(9)} ${k(n.size).padEnd(8)} ${n.bins.slice(0,6).join(" ")}${n.bins.length>6?" …":""}${s?`  [installed ${s.installed}, index ${s.available}${s.broken?", known broken":""}]`:""}
`}return a.size&&(e.stdout+=`
${a.size} upgradable: pkg upgrade
`),0}async function O(e){const i=await c(e.fs),t=await g(e.fs);for(const a of[...i.packages].sort((n,s)=>n.name.localeCompare(s.name))){const n=L[_(a)],s=t[a.name],d=s?s.version===a.version?", installed":`, installed ${s.version}, index ${a.version}`:"";e.stdout+=T(a,`  [${n}${d}]`)}return e.stdout+=`
${i.packages.length} packages. 'pkg info <name>' for details, 'pkg install <name>' to install.
`,0}async function Q(e,i){const t=i.filter(n=>!n.startsWith("-")).join(" ");if(!t)return e.stderr+=`pkg search: missing query
`,1;const a=q(await c(e.fs),t);if(a.length===0)return e.stdout+=`No packages found matching '${t}'
`,0;for(const n of a)e.stdout+=T(n,_(n)==="blocked"?"  [needs kernel]":"");return 0}async function x(e,i){const t=i.find(r=>!r.startsWith("-"));if(!t)return e.stderr+=`pkg info: missing package name
`,1;const a=I(await c(e.fs),t);if(!a)return e.stderr+=`pkg info: package '${t}' not found
`,1;const n=(await g(e.fs))[a.name],s=_(a),d=[`Package:     ${a.name}`,`Version:     ${a.version}${n?`  (installed${n.version!==a.version?` ${n.version}`:""})`:""}`,`Description: ${a.description}`,`Section:     ${a.section}`,`License:     ${a.license}`,`Source:      ${a.source}`,...a.homepage?[`Homepage:    ${a.homepage}`]:[],`Origin:      ${a.origin==="shiro"?`built by tabcomputer (${a.recipe})`:"Wasmer registry"}`,`ABI:         ${a.abi}`,`Download:    ${k(b(a))}`,`Commands:    ${Object.keys(a.bin).join(", ")}`,...a.deps?.length?[`Depends:     ${a.deps.join(", ")}`]:[],`Status:      ${L[s]}`+(s==="blocked"?` (missing: ${w(a).join(", ")})`:s==="partial"?` (without: ${w(a,a.wants).join(", ")})`:""),...a.notes?[`Notes:       ${a.notes}`]:[],"Files:",...a.files.map(r=>`  ${r.path}  sha256:${r.sha256.slice(0,16)}…  ${r.url}${r.webc?` (${r.webc.atom?`atom ${r.webc.atom}`:`volume ${r.webc.volume}:${r.webc.dir}`})`:""}`)];return e.stdout+=d.join(`
`)+`
`,0}async function ee(e,i){const t=i.find(s=>!s.startsWith("-")),a=t?(await g(e.fs))[t]:void 0;if(!a)return e.stderr+=`pkg files: package '${t??""}' is not installed
`,1;const n=async s=>{for(const d of(await e.fs.readdir(s)).sort()){const r=`${s}/${d}`;(await e.fs.lstat(r)).type==="dir"?await n(r):e.stdout+=r+`
`}};await n(`${R}/${a.name}`);for(const s of a.bins)e.stdout+=`/usr/bin/${s}
`;return 0}async function ae(e){let i=[];try{i=(await e.fs.readFile(h,"utf8")).split(`
`).map(n=>n.replace(/#.*/,"").trim()).filter(Boolean)}catch{}const t=(await c(e.fs)).packages.length;if(e.stdout+=`Built-in index: ${t} packages
`,i.length===0)return e.stdout+=`No extra sources (add index URLs to ${h}).
`,0;await e.fs.mkdir(P,{recursive:!0});let a=0;for(const[n,s]of i.entries())try{const d=await fetch(s);if(!d.ok)throw new Error(`${d.status} ${d.statusText||""}`.trim());const r=K(await d.json()),l=`${P}/${String(n).padStart(2,"0")}-${s.replace(/[^a-zA-Z0-9.]+/g,"_").slice(-60)}.json`;await e.fs.writeFile(l,JSON.stringify(r)),e.stdout+=`Get:${n+1} ${s} [${r.packages.length} packages]
`}catch(d){e.stderr+=`Err:${n+1} ${s}: ${d.message}
`,a=100}return a}async function D(e){const i=await v(e.fs);if(i.length===0)return e.stdout+=`All packages are up to date.
`,0;for(const t of i)e.stdout+=`  ${t.name.padEnd(13)} installed ${t.installed}, index ${t.available}${t.broken?"  (installed build is known broken; upgraded at boot)":""}
`;return e.stdout+=`${i.length} upgradable: pkg upgrade
`,0}const se=["--dry-run","-s","--simulate","--just-print","--no-act"];async function te(e,i){const t=await v(e.fs);if(t.length===0)return e.stdout+=`All packages are up to date.
`,0;if(i.some(a=>se.includes(a))){for(const a of t)e.stdout+=`Inst ${a.name} [${a.installed}] (${a.available})${a.broken?" (installed build known broken)":""}
`;return e.stdout+=`${t.length} upgraded (dry run: nothing was changed)
`,0}return p(e,[...i.filter(a=>a.startsWith("-")),...t.map(a=>a.name)])}async function C(e,i,t,a){switch(t){case void 0:case"--help":case"-h":case"help":return e.stdout+=i==="pkg"?j:j.replace(/^Usage: pkg/,`Usage: ${i}`),0;case"install":case"i":case"add":return p(e,a);case"reinstall":return p(e,["--reinstall",...a]);case"remove":case"rm":case"uninstall":case"purge":case"del":return J(e,a);case"list":case"ls":return a.includes("--upgradable")||a.includes("--outdated")?D(e):X(e,i==="pkg"?a:a.includes("--installed")?[]:["--all"]);case"outdated":return D(e);case"available":case"avail":return O(e);case"search":case"s":return Q(e,a);case"info":case"show":return x(e,a);case"files":return ee(e,a);case"update":return ae(e);case"upgrade":case"dist-upgrade":case"full-upgrade":return te(e,a);case"autoremove":case"clean":case"autoclean":return 0;default:return e.stderr+=`${i}: unknown command '${t}'
Run '${i} --help' for usage.
`,1}}const ne={name:"pkg",description:"Package manager for WebAssembly programs (also apt, apt-get)",exec(e){return C(e,"pkg",e.args[0],e.args.slice(1))}},N={name:"apt",description:"Package manager (same as pkg; a package tabcomputer does not have comes from Debian)",exec(e){const i=e.args.filter(s=>s!=="-y"&&s!=="--yes"&&s!=="-q"),t=i.findIndex(s=>!s.startsWith("-")),a=t<0?i[0]:i[t],n=t<=0?i.slice(1):[...i.slice(0,t),...i.slice(t+1)];return(a==="install"||a==="i"||a==="add")&&n.some(s=>!s.startsWith("-"))?H(e,n):C(e,"apt",a,n)}},ie={...N,name:"apt-get",description:"Package manager (same as pkg)"};(globalThis.__tabcomputerLive??=new Map).set("src/commands/pkg.ts",Z);(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/debian/package-sets.ts",()=>$(()=>import("./package-sets-Dng57D6p.js"),__vite__mapDeps([0,1,2,3,4]),import.meta.url));(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/debian/rootfs.ts",()=>$(()=>import("./rootfs-D2Mghvib.js"),[],import.meta.url));export{N as aptCmd,ie as aptGetCmd,ne as pkgCmd};
