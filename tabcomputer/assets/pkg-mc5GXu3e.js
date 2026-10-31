import{I as p,J as S,L as $,M as d,N as b,Q as U,T as c,U as C,V as k,X as u,Y as h,Z as g,$ as O,a0 as R,a1 as A,a2 as N,a3 as W}from"./index-BIxBofyG.js";const L=Object.freeze(Object.defineProperty({__proto__:null,get aptCmd(){return I},get aptGetCmd(){return J},get pkgCmd(){return K}},Symbol.toStringTag,{value:"Module"})),v=`Usage: pkg <command> [args]

Commands:
  install <name>...   Download, verify (sha256) and install packages
  remove <name>...    Remove installed packages
  list [--all]        Installed packages; --all lists the whole index
  available           Every package with its status
  search <query>      Search names, descriptions and commands
  info <name>         Package details (version, license, source, files)
  files <name>        Files an installed package owns
  update              Fetch extra index lists from ${p}
  outdated            Installed packages the index has a different version of
  upgrade [--dry-run] Upgrade installed packages to the index versions

Options: --force (install despite missing kernel features), --reinstall, -y (ignored)
Packages install to ${S}/<name>/ with commands linked into /usr/bin.
`,E={ok:"ok",partial:"partial",blocked:"needs kernel"};function j(e){const n=new Set(e.filter(a=>a.startsWith("-"))),s=e.filter(a=>!a.startsWith("-"));return{flags:n,names:s}}async function m(e,n){const{flags:s,names:a}=j(n);if(a.length===0)return e.stderr+=`pkg install: missing package name
`,1;const t=await d(e.fs);try{const i=N(t,a),l=await c(e.fs),r=i.filter(o=>!l[o.name]);r.length&&(e.stdout+=`The following NEW packages will be installed:
  ${r.map(o=>o.name).join(" ")}
`,e.stdout+=`Need to get ${u(r.reduce((o,w)=>o+h(w),0))} of archives.
`),await W(e.fs,t,a,{force:s.has("--force")||s.has("-f"),reinstall:s.has("--reinstall"),env:e.env,log:o=>{e.stdout+=o+`
`}});for(const o of i)g(o,o.wants||[]).length&&o.notes&&(e.stdout+=`Note: ${o.name}: ${o.notes}
`);return 0}catch(i){return e.stderr+=`E: ${i.message}
`,100}}async function T(e,n){const{names:s}=j(n);if(s.length===0)return e.stderr+=`pkg remove: missing package name
`,1;let a=0;for(const t of s){const i=await R(e.fs,t);if(i.length){e.stderr+=`E: ${t} is needed by ${i.join(", ")}; remove those first
`,a=100;continue}await A(e.fs,t)?e.stdout+=`Removing ${t} ...
`:e.stderr+=`Package '${t}' is not installed, so not removed
`}return a}function _(e,n=""){return`  ${e.name.padEnd(13)} ${e.version.padEnd(9)} ${u(h(e)).padEnd(8)} ${e.description}${n}
`}async function D(e,n){if(n.includes("--all")||n.includes("-a"))return P(e);const s=Object.values(await c(e.fs)).sort((t,i)=>t.name.localeCompare(i.name));if(s.length===0)return e.stdout+=`No packages installed. Run 'pkg available' to see what can be.
`,0;const a=new Map((await $(e.fs)).map(t=>[t.name,t]));for(const t of s){const i=a.get(t.name);e.stdout+=`  ${t.name.padEnd(13)} ${t.version.padEnd(9)} ${u(t.size).padEnd(8)} ${t.bins.slice(0,6).join(" ")}${t.bins.length>6?" …":""}${i?`  [installed ${i.installed}, index ${i.available}${i.broken?", known broken":""}]`:""}
`}return a.size&&(e.stdout+=`
${a.size} upgradable: pkg upgrade
`),0}async function P(e){const n=await d(e.fs),s=await c(e.fs);for(const a of[...n.packages].sort((t,i)=>t.name.localeCompare(i.name))){const t=E[k(a)],i=s[a.name],l=i?i.version===a.version?", installed":`, installed ${i.version}, index ${a.version}`:"";e.stdout+=_(a,`  [${t}${l}]`)}return e.stdout+=`
${n.packages.length} packages. 'pkg info <name>' for details, 'pkg install <name>' to install.
`,0}async function z(e,n){const s=n.filter(t=>!t.startsWith("-")).join(" ");if(!s)return e.stderr+=`pkg search: missing query
`,1;const a=O(await d(e.fs),s);if(a.length===0)return e.stdout+=`No packages found matching '${s}'
`,0;for(const t of a)e.stdout+=_(t,k(t)==="blocked"?"  [needs kernel]":"");return 0}async function F(e,n){const s=n.find(r=>!r.startsWith("-"));if(!s)return e.stderr+=`pkg info: missing package name
`,1;const a=C(await d(e.fs),s);if(!a)return e.stderr+=`pkg info: package '${s}' not found
`,1;const t=(await c(e.fs))[a.name],i=k(a),l=[`Package:     ${a.name}`,`Version:     ${a.version}${t?`  (installed${t.version!==a.version?` ${t.version}`:""})`:""}`,`Description: ${a.description}`,`Section:     ${a.section}`,`License:     ${a.license}`,`Source:      ${a.source}`,...a.homepage?[`Homepage:    ${a.homepage}`]:[],`Origin:      ${a.origin==="shiro"?`built by tabcomputer (${a.recipe})`:"Wasmer registry"}`,`ABI:         ${a.abi}`,`Download:    ${u(h(a))}`,`Commands:    ${Object.keys(a.bin).join(", ")}`,...a.deps?.length?[`Depends:     ${a.deps.join(", ")}`]:[],`Status:      ${E[i]}`+(i==="blocked"?` (missing: ${g(a).join(", ")})`:i==="partial"?` (without: ${g(a,a.wants).join(", ")})`:""),...a.notes?[`Notes:       ${a.notes}`]:[],"Files:",...a.files.map(r=>`  ${r.path}  sha256:${r.sha256.slice(0,16)}…  ${r.url}${r.webc?` (${r.webc.atom?`atom ${r.webc.atom}`:`volume ${r.webc.volume}:${r.webc.dir}`})`:""}`)];return e.stdout+=l.join(`
`)+`
`,0}async function G(e,n){const s=n.find(i=>!i.startsWith("-")),a=s?(await c(e.fs))[s]:void 0;if(!a)return e.stderr+=`pkg files: package '${s??""}' is not installed
`,1;const t=async i=>{for(const l of(await e.fs.readdir(i)).sort()){const r=`${i}/${l}`;(await e.fs.lstat(r)).type==="dir"?await t(r):e.stdout+=r+`
`}};await t(`${S}/${a.name}`);for(const i of a.bins)e.stdout+=`/usr/bin/${i}
`;return 0}async function q(e){let n=[];try{n=(await e.fs.readFile(p,"utf8")).split(`
`).map(t=>t.replace(/#.*/,"").trim()).filter(Boolean)}catch{}const s=(await d(e.fs)).packages.length;if(e.stdout+=`Built-in index: ${s} packages
`,n.length===0)return e.stdout+=`No extra sources (add index URLs to ${p}).
`,0;await e.fs.mkdir(b,{recursive:!0});let a=0;for(const[t,i]of n.entries())try{const l=await fetch(i);if(!l.ok)throw new Error(`${l.status} ${l.statusText||""}`.trim());const r=U(await l.json()),o=`${b}/${String(t).padStart(2,"0")}-${i.replace(/[^a-zA-Z0-9.]+/g,"_").slice(-60)}.json`;await e.fs.writeFile(o,JSON.stringify(r)),e.stdout+=`Get:${t+1} ${i} [${r.packages.length} packages]
`}catch(l){e.stderr+=`Err:${t+1} ${i}: ${l.message}
`,a=100}return a}async function y(e){const n=await $(e.fs);if(n.length===0)return e.stdout+=`All packages are up to date.
`,0;for(const s of n)e.stdout+=`  ${s.name.padEnd(13)} installed ${s.installed}, index ${s.available}${s.broken?"  (installed build is known broken; upgraded at boot)":""}
`;return e.stdout+=`${n.length} upgradable: pkg upgrade
`,0}const B=["--dry-run","-s","--simulate","--just-print","--no-act"];async function M(e,n){const s=await $(e.fs);if(s.length===0)return e.stdout+=`All packages are up to date.
`,0;if(n.some(a=>B.includes(a))){for(const a of s)e.stdout+=`Inst ${a.name} [${a.installed}] (${a.available})${a.broken?" (installed build known broken)":""}
`;return e.stdout+=`${s.length} upgraded (dry run: nothing was changed)
`,0}return m(e,[...n.filter(a=>a.startsWith("-")),...s.map(a=>a.name)])}async function f(e,n,s,a){switch(s){case void 0:case"--help":case"-h":case"help":return e.stdout+=n==="pkg"?v:v.replace(/^Usage: pkg/,`Usage: ${n}`),0;case"install":case"i":case"add":return m(e,a);case"reinstall":return m(e,["--reinstall",...a]);case"remove":case"rm":case"uninstall":case"purge":case"del":return T(e,a);case"list":case"ls":return a.includes("--upgradable")||a.includes("--outdated")?y(e):D(e,n==="pkg"?a:a.includes("--installed")?[]:["--all"]);case"outdated":return y(e);case"available":case"avail":return P(e);case"search":case"s":return z(e,a);case"info":case"show":return F(e,a);case"files":return G(e,a);case"update":return q(e);case"upgrade":case"dist-upgrade":case"full-upgrade":return M(e,a);case"autoremove":case"clean":case"autoclean":return 0;default:return e.stderr+=`${n}: unknown command '${s}'
Run '${n} --help' for usage.
`,1}}const K={name:"pkg",description:"Package manager for WebAssembly programs (also apt, apt-get)",exec(e){return f(e,"pkg",e.args[0],e.args.slice(1))}},I={name:"apt",description:"Package manager (same as pkg)",exec(e){const n=e.args.filter(a=>a!=="-y"&&a!=="--yes"&&a!=="-q"),s=n.findIndex(a=>!a.startsWith("-"));return s<=0?f(e,"apt",n[0],n.slice(1)):f(e,"apt",n[s],[...n.slice(0,s),...n.slice(s+1)])}},J={...I,name:"apt-get",description:"Package manager (same as pkg)"};(globalThis.__tabcomputerLive??=new Map).set("src/commands/pkg.ts",L);export{I as aptCmd,J as aptGetCmd,K as pkgCmd};
