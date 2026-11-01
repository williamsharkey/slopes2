import{bc as X}from"./index-3dop0BuN.js";import{extractTarGzToFS as je}from"./tar-utils-C8EqvByf.js";const Oe=Object.freeze(Object.defineProperty({__proto__:null,get coerce(){return Te},get compareSemVer(){return G},get increment(){return Ee},get maxSatisfying(){return se},get parseSemVer(){return M},get satisfiesRange(){return T}},Symbol.toStringTag,{value:"Module"})),Se=Object.freeze(Object.defineProperty({__proto__:null,get WASM_ALTERNATES(){return N},get WASM_COMPANIONS(){return R},get binDirOf(){return K},get binEntries(){return ie},get buildTree(){return ae},get pickVersion(){return re}},Symbol.toStringTag,{value:"Module"})),_e=Object.freeze(Object.defineProperty({__proto__:null,get SAVE_PREFIX(){return le},get dropFromLockfile(){return fe},get integrityOf(){return ue},get isRange(){return ce},get saveSpec(){return q},get serializeLockfile(){return Y},get updateLockfile(){return de}},Symbol.toStringTag,{value:"Module"})),Pe=Object.freeze(Object.defineProperty({__proto__:null,get NPM_VERSION(){return J},get initializerPackage(){return me},get npmCmd(){return ze}},Symbol.toStringTag,{value:"Module"}));function M(e){e=e.trim(),e.startsWith("v")&&(e=e.slice(1));const t=e.match(/^(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9.-]+))?(?:\+([a-zA-Z0-9.-]+))?$/);return t?{major:parseInt(t[1],10),minor:parseInt(t[2],10),patch:parseInt(t[3],10),prerelease:t[4],build:t[5],raw:e}:null}function G(e,t){if(e.major!==t.major)return e.major-t.major;if(e.minor!==t.minor)return e.minor-t.minor;if(e.patch!==t.patch)return e.patch-t.patch;if(!e.prerelease&&t.prerelease)return 1;if(e.prerelease&&!t.prerelease)return-1;if(e.prerelease&&t.prerelease){const n=e.prerelease.split("."),a=t.prerelease.split(".");for(let s=0;s<Math.max(n.length,a.length);s++){if(n[s]===void 0)return-1;if(a[s]===void 0)return 1;if(n[s]===a[s])continue;const r=/^\d+$/.test(n[s]),i=/^\d+$/.test(a[s]);return r&&i?parseInt(n[s],10)-parseInt(a[s],10):r!==i?r?-1:1:n[s]<a[s]?-1:1}}return 0}function Ae(e,t,n){const a=G(e,n);switch(t){case"=":return a===0;case">":return a>0;case">=":return a>=0;case"<":return a<0;case"<=":return a<=0}}function Ne(e){const t=e.trim().replace(/^[v=]+/,"").match(/^(\d+|[xX*])(?:\.(\d+|[xX*]))?(?:\.(\d+|[xX*]))?(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/);if(!t)return null;const n=i=>i===void 0||/^[xX*]$/.test(i)?void 0:parseInt(i,10),a=n(t[1]),s=a===void 0?void 0:n(t[2]),r=s===void 0?void 0:n(t[3]);return{major:a,minor:s,patch:r,prerelease:r===void 0?void 0:t[4]}}const y=(e,t,n,a)=>({major:e,minor:t,patch:n,prerelease:a,raw:`${e}.${t}.${n}${a?"-"+a:""}`});function W(e){const t=e.match(/^(\^|~>?|>=|<=|>|<|=)?\s*(.*)$/),n=t[1]||"",a=Ne(t[2]);if(!a)return null;const{major:s,minor:r,patch:i,prerelease:u}=a;if(s===void 0)return n==="<"||n===">"?[{op:"<",v:y(0,0,0,"0")}]:[];const o=y(s,r??0,i??0,u);switch(n){case"^":{const l=s>0||r===void 0?y(s+1,0,0,"0"):r>0||i===void 0?y(0,r+1,0,"0"):y(0,0,i+1,"0");return[{op:">=",v:o},{op:"<",v:l}]}case"~":case"~>":{const l=r===void 0?y(s+1,0,0,"0"):y(s,r+1,0,"0");return[{op:">=",v:o},{op:"<",v:l}]}case">":return r===void 0?[{op:">=",v:y(s+1,0,0)}]:i===void 0?[{op:">=",v:y(s,r+1,0)}]:[{op:">",v:o}];case"<=":return r===void 0?[{op:"<",v:y(s+1,0,0,"0")}]:i===void 0?[{op:"<",v:y(s,r+1,0,"0")}]:[{op:"<=",v:o}];case">=":return[{op:">=",v:o}];case"<":return[{op:"<",v:o}];default:return r===void 0?[{op:">=",v:o},{op:"<",v:y(s+1,0,0,"0")}]:i===void 0?[{op:">=",v:o},{op:"<",v:y(s,r+1,0,"0")}]:[{op:"=",v:o}]}}function Me(e){const t=e.match(/^(\S+)\s+-\s+(\S+)$/);if(t){const s=W(">="+t[1]),r=W("<="+t[2]);return s&&r?[...s,...r]:null}const n=e.replace(/(\^|~>?|>=|<=|>|<|=)\s+/g,"$1").split(/\s+/).filter(Boolean),a=[];for(const s of n){const r=W(s);if(!r)return null;a.push(...r)}return a}function T(e,t){if(t=t.trim(),t==="latest")return!0;const n=M(e);return n?t.split("||").some(a=>{const s=Me(a.trim());return!s||!s.every(r=>Ae(n,r.op,r.v))?!1:n.prerelease?s.some(r=>r.v.prerelease&&r.v.prerelease!=="0"&&r.v.major===n.major&&r.v.minor===n.minor&&r.v.patch===n.patch):!0}):!1}function se(e,t){const n=e.filter(s=>T(s,t));if(n.length===0)return null;const a=n.map(s=>M(s)).filter(s=>s!==null);return a.length===0?null:(a.sort((s,r)=>G(r,s)),a[0].raw)}function Te(e){e=e.trim(),e.startsWith("v")&&(e=e.slice(1));const t=e.match(/^(\d+)(?:\.(\d+))?(?:\.(\d+))?/);if(t){const n=t[1],a=t[2]||"0",s=t[3]||"0";return`${n}.${a}.${s}`}return"0.0.0"}function Ee(e,t){const n=M(e);if(!n)return e;switch(t){case"major":return`${n.major+1}.0.0`;case"minor":return`${n.major}.${n.minor+1}.0`;case"patch":return`${n.major}.${n.minor}.${n.patch+1}`;default:return e}}(globalThis.__tabcomputerLive??=new Map).set("src/utils/semver-utils.ts",Oe);const N={esbuild:"esbuild-wasm",rollup:"@rollup/wasm-node",rolldown:"@rolldown/browser",lightningcss:"lightningcss-wasm"},R={},z={os:"linux",cpu:"x64",libc:"glibc"};function De(e,t){return/\.node$/.test(e.main??"")||/\.node"/.test(JSON.stringify(e.exports??null))||Object.values(N).includes(t.source)?!1:!Object.keys(t.data?.optionalDependencies??{}).some(n=>/wasm/.test(n))}function L(e,t){if(!e?.length)return!0;const n=e.filter(s=>s.startsWith("!")).map(s=>s.slice(1)),a=e.filter(s=>!s.startsWith("!"));return n.includes(t)?!1:a.length===0||a.includes(t)}function re(e,t){const n=(t||"").trim();if(n===""||n==="*"||n==="latest"||n==="x")return e["dist-tags"].latest??null;if(e["dist-tags"][n])return e["dist-tags"][n];if(e.versions[n])return n;const a=Object.keys(e.versions),s=se(a,n),r=e["dist-tags"].latest;return r&&s&&r!==s&&T(r,n)?r:s}const Fe=(e,t)=>{for(let n=e;n;n=n.parent)if(n===t)return!0;return!1};function*oe(e){for(const t of e.children.values())yield t,yield*oe(t)}async function ae(e,t){const n={name:"",version:"",source:"",tarball:"",dir:"",parent:null,children:new Map,resolved:new Map},a=[],s=[],r=[];let i=e.map(u=>({from:n,want:u}));for(;i.length;){const u=new Set,o=p=>{let d=p.name,f=p.range;const g=/^npm:((?:@[^/@]+\/)?[^@]+)(?:@(.*))?$/.exec(f);return g&&(d=g[1],f=g[2]??"latest"),N[d]&&(d=N[d]),{source:d,range:f}};for(const{want:p}of i)/^(file:|link:|git\+|git:|github:|https?:|workspace:)/.test(p.range)||/^[^@/]+\/[^@/]+(#.*)?$/.test(p.range)||u.add(o(p).source);const l=new Map;await Promise.all([...u].map(async p=>{try{l.set(p,await t(p))}catch(d){l.set(p,d instanceof Error?d:new Error(String(d)))}}));const c=[];for(const{from:p,want:d}of i){const{name:f}=d;if(/^(file:|link:|git\+|git:|github:|https?:|workspace:)/.test(d.range)||/^[^@/]+\/[^@/]+(#.*)?$/.test(d.range)){r.push(`${f}@${d.range}: only registry packages are installed`);continue}const{source:g,range:m}=o(d);let h=null,w=null;for(let v=p;v;v=v.parent){const k=v.children.get(f);if(k){k.source===g&&(k.version===m||T(k.version,m)||m==="latest"||m==="*"||m==="")?w=k:h=v;break}}if(w){p.resolved.set(f,w);continue}const j=l.get(g);if(!j||j instanceof Error){d.optional||r.push(`${f}@${d.range}: ${j instanceof Error?j.message:"not found"}`);continue}const S=re(j,m),$=S?j.versions[S]:void 0;if(!S||!$){d.optional||r.push(`${f}@${d.range}: no matching version`);continue}const A=!!$.cpu?.includes("wasm32"),ye=L($.os,z.os)&&L($.cpu,z.cpu)&&L($.libc,z.libc);if(!A&&(!ye||d.optional&&($.os?.length||$.cpu?.length)&&!De($,p))){s.push(`${f}@${S}`);continue}const _=[];for(let v=p;v;v=v.parent)if(_.push(v),v===h){_.pop();break}if(!_.length){r.push(`${f}@${S}: ${p.name} keeps ${p.children.get(f).version}`),p.resolved.set(f,p.children.get(f));continue}let O=_[_.length-1];for(let v=_.length-1;v>0;v--){O=_[v];let k=!1;for(const be of oe(O)){const ee=be.resolved.get(f);if(ee&&!Fe(ee,O)){k=!0;break}}if(!k)break;O=_[v-1]}const P={name:f,version:S,source:g,tarball:$.dist.tarball,dir:`${O.dir?O.dir+"/":""}node_modules/${f}`,parent:O,children:new Map,resolved:new Map,bin:$.bin,data:$};O.children.set(f,P),p.resolved.set(f,P),a.push(P);for(const[v,k]of Object.entries($.dependencies??{}))c.push({from:P,want:{name:v,range:k}});R[g]&&c.push({from:P,want:{name:R[g],range:S,optional:!0}});for(const[v,k]of Object.entries($.optionalDependencies??{}))c.push({from:P,want:{name:v,range:k,optional:!0}});for(const[v,k]of Object.entries($.peerDependencies??{}))$.peerDependenciesMeta?.[v]?.optional||$.dependencies?.[v]||$.optionalDependencies?.[v]||c.push({from:O,want:{name:v,range:k}})}i=c}return{root:n,nodes:a,skipped:s,warnings:r}}function K(e){const t=e.dir.lastIndexOf("node_modules/");return e.dir.slice(0,t)+"node_modules/.bin"}function ie(e,t){return t?typeof t=="string"?[[e.replace(/^@[^/]+\//,""),t]]:Object.entries(t):[]}(globalThis.__tabcomputerLive??=new Map).set("src/commands/npm-tree.ts",Se);(globalThis.__tabcomputerLiveState??=new Map).set("src/commands/npm-tree.ts",{get WASM_COMPANIONS(){return R}});const le="^",Ie=e=>/^v?\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.+-]*)?$/.test(e.trim()),ce=e=>{const t=e.trim();return t===""||t==="*"||!Ie(t)&&/^[\s\d.xX*^~<>=|v-]+$/.test(t)};function Re(e,t){const n=M(e);return n?(n.major>0?[`${n.major}.${n.minor}.${n.patch}`,`${n.major}.${n.minor}.${n.patch+1}`,`${n.major}.${n.minor+1}.0`,`${n.major}.999999.999999`]:n.minor>0?[`0.${n.minor}.${n.patch}`,`0.${n.minor}.${n.patch+1}`,`0.${n.minor}.999999`]:[`0.0.${n.patch}`]).every(s=>T(s,t)):!1}function q(e,t,n={}){if(n.exact)return t;const a=(n.prefix??le)+t,s=e.trim();return!ce(s)||s===""||s==="*"||Re(t,s)?a:s}function ue(e){if(e?.integrity)return e.integrity;if(e?.shasum&&/^[0-9a-f]{40}$/i.test(e.shasum)){const t=e.shasum.match(/../g).map(n=>parseInt(n,16));return"sha1-"+btoa(String.fromCharCode(...t))}}function Ce(e,t){const n=e.data,a={};e.source&&e.source!==e.name&&(a.name=e.source),a.version=e.version,a.resolved=e.tarball;const s=ue(n?.dist);return s&&(a.integrity=s),t&&(a.dev=!0),n?.dependencies&&Object.keys(n.dependencies).length&&(a.dependencies={...n.dependencies}),n?.optionalDependencies&&Object.keys(n.optionalDependencies).length&&(a.optionalDependencies={...n.optionalDependencies}),n?.peerDependencies&&Object.keys(n.peerDependencies).length&&(a.peerDependencies={...n.peerDependencies}),n?.bin&&(a.bin=typeof n.bin=="string"?{[e.name.replace(/^@[^/]+\//,"")]:n.bin}:{...n.bin}),a}function de(e,t,n){const a=new Set([...Object.keys(t.dependencies??{}),...Object.keys(t.optionalDependencies??{})]),s=new Set,r=l=>{if(!s.has(l)){s.add(l);for(const c of l.resolved.values())r(c)}};for(const[l,c]of n.root.resolved)a.has(l)&&r(c);const i={...e?.packages??{}},u={};t.name&&(u.name=t.name),t.version&&(u.version=t.version);for(const l of["dependencies","devDependencies","optionalDependencies"])t[l]&&Object.keys(t[l]).length&&(u[l]={...t[l]});i[""]=u;for(const l of n.nodes){let c=!s.has(l);c&&i[l.dir]&&!i[l.dir].dev&&i[l.dir].version===l.version&&(c=!1),i[l.dir]=Ce(l,c)}const o={"":i[""]};for(const l of Object.keys(i).filter(c=>c!=="").sort())o[l]=i[l];return{...t.name?{name:t.name}:{},...t.version?{version:t.version}:{},lockfileVersion:3,requires:!0,packages:o}}function fe(e,t,n){const a={...e.packages};for(const r of n)for(const i of Object.keys(a))(i===`node_modules/${r}`||i.startsWith(`node_modules/${r}/`))&&delete a[i];const s={...a[""]??{}};for(const r of["dependencies","devDependencies","optionalDependencies"])t[r]&&Object.keys(t[r]).length?s[r]={...t[r]}:delete s[r];return a[""]=s,{...e,packages:a}}const Y=e=>JSON.stringify(e,null,2)+`
`;(globalThis.__tabcomputerLive??=new Map).set("src/commands/npm-lock.ts",_e);const J="10.8.2",b=new Map,Je=16<<20;function We(){let e=0;for(const t of b.values())e+=t.bytes;for(const[t,n]of b){if(e<=Je)break;b.delete(t),e-=n.bytes}}const B=3600*1e3,D=new Map;let C=0;const ze={name:"npm",description:"Browser-native package manager for Node.js packages",async exec(e){C++;try{return await pe(e)}finally{--C===0&&We()}}},Q=new WeakSet;async function pe(e){const t=e.args.indexOf("--"),n=t<0?e.args:e.args.slice(0,t);if(n.some((r,i)=>r==="-s"||r==="--silent"||r==="--loglevel=silent"||r==="--loglevel"&&n[i+1]==="silent")){Q.add(e);const r=[];for(let i=0;i<n.length;i++){const u=n[i];if(!(u==="-s"||u==="--silent"||u==="-q"||u==="--quiet"||u.startsWith("--loglevel="))){if(u==="--loglevel"){i++;continue}r.push(u)}}e.args=t<0?r:[...r,...e.args.slice(t)]}const s=e.args[0];if(!s||s==="--help"||s==="-h")return e.stdout+=`Usage: npm <command>

`,e.stdout+=`Commands:
`,e.stdout+=`  init              Create a package.json file
`,e.stdout+=`  create <name>     Run create-<name> (npm init <name>), e.g. npm create vite@latest app
`,e.stdout+=`  exec, x <pkg>     Run a package's bin (npx)
`,e.stdout+=`  install [pkg]     Install package(s) from registry.npmjs.org
`,e.stdout+=`  i [pkg]           Alias for install
`,e.stdout+=`  list              List installed packages
`,e.stdout+=`  ls                Alias for list
`,e.stdout+=`  run <script>      Run a script from package.json
`,e.stdout+=`  start             Run the start script (default: node server.js)
`,e.stdout+=`  test, t           Run the test script
`,e.stdout+=`  stop              Run the stop script
`,e.stdout+=`  uninstall [pkg]   Remove a package
`,e.stdout+=`  ci                Remove node_modules and install (needs package-lock.json)
`,e.stdout+=`  pkg get|set|delete  Read or edit package.json fields (scripts.test=...)
`,e.stdout+=`  version [major|minor|patch|<v>]  Show versions, or bump package.json's
`,e.stdout+=`  view <pkg> [field]  Show a package's registry data
`,e.stdout+=`  root              Print the node_modules directory
`,e.stdout+=`  cache clean       Clear the metadata cache
`,e.stdout+=`  cache status      Show cache statistics
`,e.stdout+=`  --version         Show npm version
`,e.stdout+=`
Note: Downloads real tarballs from registry.npmjs.org
`,e.stdout+=`Package metadata is cached for 1 hour to speed up installs.
`,0;if(s==="--version"||s==="-v")return e.stdout+=`${J}
`,0;switch(s){case"create":case"innit":return await te(e);case"init":return e.args[1]&&!e.args[1].startsWith("-")?await te(e):await Le(e);case"exec":case"x":{const r=e.args.slice(1).filter((i,u)=>!(u===0&&i==="--"));return e.shell.execute(X(["npx",...r]),i=>{e.stdout+=i.replace(/\r\n/g,`
`)},i=>{e.stderr+=i.replace(/\r\n/g,`
`)},!1,E(e),!0)}case"install":case"i":return await ve(e);case"list":case"ls":return await Ue(e);case"run":return await Ze(e);case"start":return await V(e,"start","node server.js");case"test":case"t":case"tst":return await V(e,"test");case"stop":return await V(e,"stop");case"uninstall":case"remove":case"rm":return await Xe(e);case"cache":return await Ge(e);case"config":case"c":return await ne(e);case"get":return e.args=["config","get",...e.args.slice(1)],await ne(e);case"prefix":return e.stdout+=(e.args.includes("-g")||e.args.includes("--global")?"/usr/local":e.cwd)+`
`,0;case"update":case"up":return e.stdout+=`up to date, audited 0 packages
`,0;case"outdated":return e.stdout+=`All packages are up to date.
`,0;case"audit":return e.stdout+=`found 0 vulnerabilities
`,0;case"pkg":return await Ke(e);case"ci":case"clean-install":case"install-clean":return await Ye(e);case"version":case"verison":return await et(e);case"view":case"info":case"show":case"v":return await tt(e);case"root":return e.stdout+=(e.args.includes("-g")||e.args.includes("--global")?"/usr/local/lib/node_modules":e.fs.resolvePath("node_modules",e.cwd))+`
`,0;case"help":return e.args=["--help"],pe(e);default:return e.stderr+=`npm: unknown command '${s}'
`,e.stderr+=`Run 'npm --help' for usage.
`,1}}function me(e){const t=/^(@[^/@]+)(?:\/([^@]+))?(@.*)?$/.exec(e);if(t)return`${t[1]}/${t[2]?"create-"+t[2]:"create"}${t[3]??""}`;const n=e.indexOf("@",1);return`create-${n>0?e.slice(0,n):e}${n>0?e.slice(n):""}`}async function te(e){const t=e.args[1];if(!t||t.startsWith("-"))return e.stderr+=`npm create: usage: npm create <initializer> [args]
`,1;const n=e.args.slice(2),a=n[0]==="--"?n.slice(1):n.filter((s,r)=>!(s==="--"&&r===n.indexOf("--")));return e.shell.execute(X(["npx",me(t),...a]),s=>{e.stdout+=s.replace(/\r\n/g,`
`)},s=>{e.stderr+=s.replace(/\r\n/g,`
`)},!1,E(e),!0)}async function Le(e){const t=e.fs.resolvePath("package.json",e.cwd);try{return await e.fs.readFile(t,"utf8"),e.stdout+=`package.json already exists.
`,0}catch{}const a={name:(e.cwd.split("/").filter(Boolean).pop()||"my-project").toLowerCase().replace(/[^a-z0-9._~-]+/g,"-"),version:"1.0.0",main:"index.js",scripts:{test:'echo "Error: no test specified" && exit 1'},keywords:[],author:"",license:"ISC",description:""},s=JSON.stringify(a,null,2)+`
`;return await e.fs.writeFile(t,s),e.stdout+=`Wrote to ${t}:

${s}

`,0}async function Ve(e){const t=b.get(e);if(t&&Date.now()-t.timestamp<B)return b.delete(e),b.set(e,t),t.data;const n=D.get(e);if(n)return n;const a=(async()=>{const s=`https://registry.npmjs.org/${e}`,r=await fetch(s,{headers:{Accept:"application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8"}});if(!r.ok)throw r.status===404?new Error(`Package '${e}' not found in npm registry`):new Error(`Failed to fetch package metadata: ${r.statusText}`);const i=await r.text(),u=JSON.parse(i);return b.set(e,{data:u,timestamp:Date.now(),bytes:i.length}),u})();D.set(e,a);try{return await a}finally{D.delete(e)}}async function ge(e,t,n,a={}){const s=t.replace(/\/$/,""),r=new Map;for(const d of n.nodes){const f=d.dir.split("/node_modules/").length;(r.get(f)??r.set(f,[]).get(f)).push(d)}let i=0,u=0;const o=[],l=`${s}/node_modules/.package-modes`,c=new Set(await e.fs.readFile(l,"utf8").then(d=>String(d).split(`
`).filter(Boolean),()=>[])),p=d=>`${d.dir}@${d.version}`;for(const d of[...r.keys()].sort((f,g)=>f-g)){const f=[...r.get(d)],g=async()=>{for(let m=f.shift();m;m=f.shift()){const h=`${s}/${m.dir}`;try{try{const $=JSON.parse(await e.fs.readFile(`${h}/package.json`,"utf8"));if($.version===m.version&&$.name===m.source&&c.has(p(m)))continue;await e.fs.rm(h,{recursive:!0,force:!0})}catch{}const w=await fetch(m.tarball);if(!w.ok)throw new Error(`download failed: ${w.status} ${w.statusText}`);const j=new Uint8Array(await w.arrayBuffer());await e.fs.mkdir(h,{recursive:!0}),await je(j,h,{writeFile:async($,A)=>{await e.fs.writeFile($,A)},mkdir:async $=>{try{await e.fs.mkdir($,{recursive:!0})}catch{}},chmod:async($,A)=>{await e.fs.chmod($,A)}}),c.add(p(m)),o.push(m),i++}catch(w){u++,e.stderr+=`npm: ${m.name}@${m.version}: ${w?.message??w}
`}}};await Promise.all(Array.from({length:Math.min(16,f.length)},g))}for(const d of n.nodes)for(const[f,g]of ie(d.name,d.bin)){const m=g.replace(/^\.\//,""),h=[[`${s}/${K(d)}/${f}`,`../${d.name}/${m}`]];a.globalBinDir&&d.parent?.dir===""&&h.push([`${a.globalBinDir}/${f}`,`${s}/${d.dir}/${m}`]);for(const[w,j]of h)try{await e.fs.mkdir(w.slice(0,w.lastIndexOf("/")),{recursive:!0});try{await e.fs.unlink(w)}catch{}await e.fs.symlink(j,w)}catch{}await e.fs.chmod(`${s}/${d.dir}/${m}`,493).catch(()=>{})}return n.nodes.length&&await e.fs.writeFile(l,[...c].sort().join(`
`)+`
`).catch(()=>{}),a.ignoreScripts||await qe(e,s,o),{added:i,failed:u}}async function he(e){if(e.args.includes("--ignore-scripts"))return!0;try{const t=await e.fs.readFile(`${e.env.HOME||"/home/user"}/.npmrc`,"utf8");return/^\s*ignore-scripts\s*=\s*true\s*$/m.test(t)}catch{return!1}}async function qe(e,t,n){const a=o=>`'${o.replace(/'/g,"'\\''")}'`,s=[],r=new Set,i=o=>{if(!r.has(o)){r.add(o);for(const l of o.resolved.values())i(l);s.push(o)}};n.forEach(i);const u=new Set(n);for(const o of s.filter(l=>u.has(l))){const l=`${t}/${o.dir}`;let c={};try{c=JSON.parse(await e.fs.readFile(`${l}/package.json`,"utf8")).scripts??{}}catch{continue}for(const p of["preinstall","install","postinstall"]){const d=c[p];if(!d)continue;const f={npm_lifecycle_event:p,npm_lifecycle_script:d,npm_package_name:o.name,npm_package_version:o.version,INIT_CWD:e.cwd,npm_command:"install"};let g="";const m=await e.shell.execute(`(cd ${a(l)} && export ${Object.entries(f).map(([h,w])=>`${h}=${a(w)}`).join(" ")} PATH=${a(`${l}/node_modules/.bin:${t}/${K(o)}`)}:"$PATH" && ${d})`,h=>{g+=h.replace(/\r\n/g,`
`)},h=>{g+=h.replace(/\r\n/g,`
`)},!1,void 0,!0);if(m!==0){e.stderr+=`npm warn ${o.name}@${o.version} ${p}: \`${d}\` exited with ${m}
`,g.trim()&&(e.stderr+=g.trimEnd().split(`
`).slice(-10).map(h=>`npm warn   ${h}`).join(`
`)+`
`);break}}}}async function $e(e,t){const n=await ae(t,Ve);for(const s of n.warnings)e.stderr+=`npm warn ${s}
`;for(const s of n.nodes)s.parent===n.root&&t.some(r=>r.name===s.name)&&(e.stdout+=`  + ${s.name}@${s.version}
`);const a=n.nodes.filter(s=>s.source!==s.name&&Object.values(N).includes(s.source));for(const s of a)e.stdout+=`  ${s.name}@${s.version}: the WebAssembly build (${s.source})
`;return n.skipped.length&&(e.stdout+=`  skipped ${n.skipped.length} native platform package(s): ${n.skipped.slice(0,6).join(", ")}${n.skipped.length>6?", ...":""}
`),n}async function ve(e){const t=e.args.includes("-g")||e.args.includes("--global"),n=e.args.includes("-D")||e.args.includes("--save-dev"),a=e.args.includes("-E")||e.args.includes("--save-exact"),s=e.args.slice(1).filter(f=>!f.startsWith("-"));if(t)return await He(e,s);const r=e.fs.resolvePath("package.json",e.cwd);let i;try{const f=await e.fs.readFile(r,"utf8");i=JSON.parse(f)}catch(f){if(!f.message.includes("ENOENT"))return e.stderr+=`npm: failed to parse package.json: ${f.message}
`,1;if(!s.length)return e.stdout+=`up to date, audited 0 packages
`,0;i={}}let u={};const o=n?"devDependencies":"dependencies";if(s.length===0){const f={...i.dependencies,...i.devDependencies};if(Object.keys(f).length===0)return e.stdout+=`No dependencies to install.
`,0;u=f,e.stdout+=`Installing dependencies...
`}else{for(const f of s){let g,m;if(f.startsWith("@")){const h=f.lastIndexOf("@");h>0?(g=f.slice(0,h),m=f.slice(h+1)):(g=f,m="latest")}else if(f.includes("@")){const h=f.indexOf("@");g=f.slice(0,h),m=f.slice(h+1)}else g=f,m="latest";u[g]=m}e.stdout+=`Installing packages...
`}const l=Date.now(),c=await $e(e,Object.entries(u).map(([f,g])=>({name:f,range:g})));if(s.length){i[o]||(i[o]={});for(const[f,g]of Object.entries(u)){const m=c.root.resolved.get(f);if(!m)continue;const h=/^npm:((?:@[^/@]+\/)?[^@]+)(?:@(.*))?$/.exec(g);i[o][f]=h?`npm:${h[1]}@${q(h[2]??"",m.version,{exact:a})}`:q(g==="latest"?"":g,m.version,{exact:a}),delete i[n?"dependencies":"devDependencies"]?.[f]}await e.fs.writeFile(r,JSON.stringify(i,null,2)+`
`)}const{added:p,failed:d}=await ge(e,e.cwd,c,{ignoreScripts:await he(e)});return e.stdout+=`
added ${p} package(s), ${c.nodes.length} in the tree, in ${((Date.now()-l)/1e3).toFixed(1)}s
`,d||c.warnings.length&&c.nodes.length===0?1:(await Be(e,i,c),e.stdout+=`Packages installed successfully.
`,0)}async function Be(e,t,n){const a=e.fs.resolvePath("package-lock.json",e.cwd);let s=null;try{const r=JSON.parse(await e.fs.readFile(a,"utf8"));r&&typeof r.packages=="object"&&(s=r)}catch{}try{await e.fs.writeFile(a,Y(de(s,t,n)))}catch(r){e.stderr+=`npm warn could not write package-lock.json: ${r?.message??r}
`}}async function He(e,t){if(t.length===0)return e.stderr+=`npm: please specify packages to install globally
`,1;const n="/usr/local/lib/node_modules",a="/usr/local/bin";for(const o of["/usr/local/lib",n,a])try{await e.fs.mkdir(o,{recursive:!0})}catch{}const s={};for(const o of t){let l,c;if(o.startsWith("@")){const p=o.lastIndexOf("@");p>0?(l=o.slice(0,p),c=o.slice(p+1)):(l=o,c="latest")}else if(o.includes("@")){const p=o.indexOf("@");l=o.slice(0,p),c=o.slice(p+1)}else l=o,c="latest";s[l]=c}e.stdout+=`Installing packages globally...
`;const r=await $e(e,Object.entries(s).map(([o,l])=>({name:o,range:l}))),{added:i,failed:u}=await ge(e,"/usr/local/lib",r,{globalBinDir:a,ignoreScripts:await he(e)});return e.stdout+=`
added ${i} package(s)
`,u?1:(e.stdout+=`Packages installed globally.
`,0)}async function Ue(e){const t=e.fs.resolvePath("package.json",e.cwd);let n;try{const r=await e.fs.readFile(t,"utf8");n=JSON.parse(r)}catch{return e.stderr+=`npm: package.json not found.
`,1}const a=n.dependencies||{},s=n.devDependencies||{};if(Object.keys(a).length===0&&Object.keys(s).length===0)return e.stdout+=`No packages installed.
`,0;if(e.stdout+=`${n.name}@${n.version}
`,Object.keys(a).length>0){e.stdout+=`
dependencies:
`;for(const[r,i]of Object.entries(a)){const u=e.fs.resolvePath(`node_modules/${r}/package.json`,e.cwd);let o=i;try{const l=await e.fs.readFile(u,"utf8");o=JSON.parse(l).version||i}catch{}e.stdout+=`  ${r} ${o}
`}}if(Object.keys(s).length>0){e.stdout+=`
devDependencies:
`;for(const[r,i]of Object.entries(s))e.stdout+=`  ${r} ${i}
`}return 0}async function Ze(e){const t=e.args[1];if(!t){const i=e.fs.resolvePath("package.json",e.cwd);let u;try{const l=await e.fs.readFile(i,"utf8");u=JSON.parse(l)}catch{return e.stderr+=`npm: package.json not found.
`,1}const o=u.scripts||{};if(Object.keys(o).length===0)return e.stdout+=`No scripts available.
`,0;e.stdout+=`Available scripts:
`;for(const[l,c]of Object.entries(o))e.stdout+=`  ${l}
`,e.stdout+=`    ${c}
`;return 0}const n=e.fs.resolvePath("package.json",e.cwd);let a;try{const i=await e.fs.readFile(n,"utf8");a=JSON.parse(i)}catch{return e.stderr+=`npm: package.json not found.
`,1}const s=a.scripts?.[t];if(!s){e.stderr+=`npm: missing script: ${t}
`,e.stderr+=`
Available scripts:
`;for(const i of Object.keys(a.scripts||{}))e.stderr+=`  ${i}
`;return 1}const r=we(s,e.args.slice(2));return ke(e,`> ${Z(a)}${t}
> ${r}

`),H(e,n,()=>e.shell.execute(r,F(e),U(e),!1,E(e),!0))}async function V(e,t,n){const a=e.fs.resolvePath("package.json",e.cwd);let s;try{const u=await e.fs.readFile(a,"utf8");s=JSON.parse(u)}catch{return e.stderr+=`npm: package.json not found.
`,1}const r=s.scripts?.[t];if(!r){if(n)return F(e)(`> ${Z(s)}${t}
> ${n}

`),await H(e,a,()=>e.shell.execute(n,F(e),U(e),!1,void 0,!0));e.stderr+=`npm: missing script: ${t}
`,e.stderr+=`
Available scripts:
`;for(const u of Object.keys(s.scripts||{}))e.stderr+=`  ${u}
`;return 1}const i=we(r,e.args.slice(1));return ke(e,`> ${Z(s)}${t}
> ${i}

`),await H(e,a,()=>e.shell.execute(i,F(e),U(e),!1,E(e),!0))}async function H(e,t,n){const a=[];for(let u=t.slice(0,t.lastIndexOf("/"))||"/";a.push(`${u==="/"?"":u}/node_modules/.bin`),u!=="/";u=u.slice(0,u.lastIndexOf("/"))||"/");const s=e.shell.env,r="PATH"in s,i=s.PATH;s.PATH=[...a,...i?[i]:[]].join(":");try{return await n()}finally{r?s.PATH=i:delete s.PATH}}function we(e,t){const n=t[0]==="--"?t.slice(1):t;return n.length?`${e} ${X(n)}`:e}const F=e=>t=>{t=t.replace(/\r\n/g,`
`),e.streamStdout?e.streamStdout(t):e.stdout+=t},U=e=>t=>{t=t.replace(/\r\n/g,`
`),e.streamStderr?e.streamStderr(t):e.stderr+=t},Z=e=>e.name?`${e.name}${e.version?"@"+e.version:""} `:"";function ke(e,t){if(Q.has(e))return;const n=E(e);n?.writeOutput?n.writeOutput(t.replace(/\n/g,`\r
`)):e.streamStdout?e.streamStdout(t):e.stdout+=t}function E(e){return e.terminal&&e.stdoutIsTTY!==!1?e.terminal:void 0}async function Xe(e){const t=e.args.slice(1);if(t.length===0)return e.stderr+=`npm: missing package name
`,e.stderr+=`Usage: npm uninstall <package>
`,1;const n=e.fs.resolvePath("package.json",e.cwd);let a;try{const r=await e.fs.readFile(n,"utf8");a=JSON.parse(r)}catch{return e.stderr+=`npm: package.json not found.
`,1}for(const r of t){a.dependencies?.[r]?(delete a.dependencies[r],e.stdout+=`Removed ${r} from dependencies.
`):a.devDependencies?.[r]?(delete a.devDependencies[r],e.stdout+=`Removed ${r} from devDependencies.
`):e.stderr+=`Package ${r} not found in dependencies.
`;const i=e.fs.resolvePath(`node_modules/${r}`,e.cwd);try{await e.fs.rm(i,{recursive:!0}),e.stdout+=`Removed ${r} from node_modules.
`}catch(u){e.stderr+=`Warning: Could not remove ${r} from node_modules: ${u.message}
`}}await e.fs.writeFile(n,JSON.stringify(a,null,2)+`
`);const s=e.fs.resolvePath("package-lock.json",e.cwd);try{const r=JSON.parse(await e.fs.readFile(s,"utf8"));r&&typeof r.packages=="object"&&await e.fs.writeFile(s,Y(fe(r,a,t)))}catch{}return 0}async function Ge(e){const t=e.args[1];if(!t||t==="--help")return e.stdout+=`Usage: npm cache <command>

`,e.stdout+=`Commands:
`,e.stdout+=`  clean     Clear the metadata cache
`,e.stdout+=`  status    Show cache statistics
`,0;switch(t){case"clean":case"clear":{const n=e.args.includes("--force")||e.args.includes("-f"),a=b.size;if(b.clear(),e.stdout+=`Cleared ${a} cached package metadata entries.
`,n){const s=e.fs.resolvePath("node_modules",e.cwd);try{await e.fs.rm(s,{recursive:!0}),e.stdout+=`Removed node_modules/ directory.
`}catch{e.stdout+=`No node_modules/ directory to remove.
`}}return 0}case"status":case"ls":if(e.stdout+=`npm metadata cache:
`,e.stdout+=`  Cached packages: ${b.size}
`,e.stdout+=`  TTL: ${B/1e3/60} minutes
`,b.size>0){e.stdout+=`
  Cached entries:
`;const n=Date.now();for(const[a,{timestamp:s}]of b){const r=Math.floor((n-s)/1e3),i=Math.floor(r/60),u=Math.floor((B-(n-s))/1e3/60);e.stdout+=`    ${a} (age: ${i}m, expires in: ${u}m)
`}}return 0;default:return e.stderr+=`npm cache: unknown command '${t}'
`,1}}async function ne(e){const t=e.env.HOME||"/home/user",n=`${t}/.npmrc`,a={registry:"https://registry.npmjs.org/",prefix:"/usr/local",cache:`${t}/.npm`,"user-agent":`npm/${J} node/v22.12.0 linux x64 workspaces/false`};let s="";try{s=await e.fs.readFile(n,"utf8")}catch{}const r=new Map;for(const l of s.split(`
`)){const c=/^\s*([^#;=\s][^=]*?)\s*=\s*(.*?)\s*$/.exec(l);c&&r.set(c[1],c[2])}const i=()=>e.fs.writeFile(n,[...r].map(([l,c])=>`${l}=${c}`).join(`
`)+(r.size?`
`:"")),[,u="list",...o]=e.args.filter(l=>l!=="--global"&&l!=="-g"&&l!=="--location=user");switch(u){case"get":{if(!o.length){for(const[l,c]of r)e.stdout+=`${l}=${c}
`;return 0}for(const l of o)e.stdout+=`${r.get(l)??a[l]??"undefined"}
`;return 0}case"set":{for(const l of o){const c=l.indexOf("=");if(c>0)r.set(l.slice(0,c),l.slice(c+1));else if(o.length>=2){r.set(o[0],o[1]);break}}return await i(),0}case"delete":case"rm":for(const l of o)r.delete(l);return await i(),0;case"list":case"ls":e.stdout+=`; "user" config from ${n}

`;for(const[l,c]of r)e.stdout+=`${l} = ${JSON.stringify(c)}
`;return e.stdout+=`
; node bin location = /usr/local/bin/node
; cwd = ${e.cwd}
; HOME = ${t}
`,0;default:return e.stderr+=`npm config: unknown command '${u}'
`,1}}async function x(e){const t=e.fs.resolvePath("package.json",e.cwd);try{return{path:t,pkg:JSON.parse(await e.fs.readFile(t,"utf8"))}}catch{return null}}const I=e=>e.replace(/\[(\d+)\]/g,".$1").split(".").filter(Boolean);async function Ke(e){const[,t,...n]=e.args,a=n.includes("--json"),s=n.filter(u=>u!=="--json"&&u!=="-w"&&!u.startsWith("--workspace")),r=await x(e);if(!r)return e.stderr+=`npm error code ENOENT
npm error Could not read package.json at ${e.fs.resolvePath("package.json",e.cwd)}
`,1;const i=u=>I(u).reduce((o,l)=>o?.[l],r.pkg);if(t==="get"||t===void 0){const u=s.length?s.length===1?i(s[0]):Object.fromEntries(s.map(o=>[o,i(o)]).filter(([,o])=>o!==void 0)):r.pkg;return u!==void 0&&!(s.length>1&&!Object.keys(u).length)&&(e.stdout+=JSON.stringify(u,null,2)+`
`),0}if(t==="set")for(const u of s){const o=u.indexOf("=");if(o<=0)return e.stderr+=`npm error npm pkg set expects a key=value pair of args.
`,1;const l=I(u.slice(0,o));let c=u.slice(o+1);if(a)try{c=JSON.parse(c)}catch(d){return e.stderr+=`npm error ${d.message}
`,1}let p=r.pkg;for(let d=0;d<l.length-1;d++)(p[l[d]]==null||typeof p[l[d]]!="object")&&(p[l[d]]=/^\d+$/.test(l[d+1])?[]:{}),p=p[l[d]];p[l[l.length-1]]=c}else if(t==="delete")for(const u of s){const o=I(u);let l=r.pkg;for(let c=0;c<o.length-1&&l;c++)l=l[o[c]];l&&typeof l=="object"&&(Array.isArray(l)?l.splice(Number(o[o.length-1]),1):delete l[o[o.length-1]])}else return e.stderr+=`npm error Unknown pkg command: ${t}
npm error Usage: npm pkg get|set|delete [<key>...]
`,1;return await e.fs.writeFile(r.path,JSON.stringify(r.pkg,null,2)+`
`),0}async function Ye(e){const t=async n=>e.fs.exists(e.fs.resolvePath(n,e.cwd));if(!await t("package-lock.json")&&!await t("npm-shrinkwrap.json"))return e.stderr+=`npm error code EUSAGE
npm error
npm error The \`npm ci\` command can only install with an existing package-lock.json or
npm error npm-shrinkwrap.json with lockfileVersion >= 1. Run an install with npm@5 or
npm error later to generate a package-lock.json file, then try again.
`,1;try{await e.fs.rm(e.fs.resolvePath("node_modules",e.cwd),{recursive:!0})}catch{}return e.args=["install",...e.args.slice(1).filter(n=>n.startsWith("-"))],ve(e)}const Qe=["major","minor","patch","premajor","preminor","prepatch","prerelease"];function xe(e,t,n){const a=/^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?/.exec(e);if(!a)return null;let[s,r,i]=[+a[1],+a[2],+a[3]];const u=a[4],o=n?`${n}.0`:"0";switch(t){case"major":return u&&r===0&&i===0?`${s}.0.0`:`${s+1}.0.0`;case"minor":return u&&i===0?`${s}.${r}.0`:`${s}.${r+1}.0`;case"patch":return u?`${s}.${r}.${i}`:`${s}.${r}.${i+1}`;case"premajor":return`${s+1}.0.0-${o}`;case"preminor":return`${s}.${r+1}.0-${o}`;case"prepatch":return`${s}.${r}.${i+1}-${o}`;case"prerelease":{if(!u)return`${s}.${r}.${i+1}-${o}`;const l=u.split("."),c=l.length-1;return/^\d+$/.test(l[c])?l[c]=String(+l[c]+1):l.push("0"),`${s}.${r}.${i}-${l.join(".")}`}}return null}async function et(e){const t=e.args.slice(1).filter(o=>!o.startsWith("-")),n=(()=>{const o=e.args.indexOf("--preid");return o>=0?e.args[o+1]:e.args.find(l=>l.startsWith("--preid="))?.slice(8)})(),a=e.args.includes("--json"),s=await x(e);if(!t.length||n&&t[0]===n){const o={};return s?.pkg?.name&&s.pkg.version&&(o[s.pkg.name]=s.pkg.version),Object.assign(o,{npm:J,node:"22.12.0",acorn:"8.14.0",ada:"2.9.2",brotli:"1.1.0",uv:"1.49.1",v8:"12.4.254.21-node.21",zlib:"1.3.0.1-motley-82a5fec"}),e.stdout+=a?JSON.stringify(o,null,2)+`
`:`{
${Object.entries(o).map(([l,c])=>`  ${/^[A-Za-z_$][\w$]*$/.test(l)?l:`'${l}'`}: '${c}'`).join(`,
`)}
}
`,0}if(!s)return e.stderr+=`npm error code ENOENT
npm error Could not read package.json
`,1;const r=t[0].replace(/^v/,""),i=Qe.includes(t[0])?xe(String(s.pkg.version??"0.0.0"),t[0],n):/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(r)?r:null;if(!i)return e.stderr+=`npm error Invalid version: ${t[0]}
`,1;if(i===s.pkg.version&&!e.args.includes("--allow-same-version"))return e.stderr+=`npm error Version not changed, might want --allow-same-version
`,1;s.pkg.version=i,await e.fs.writeFile(s.path,JSON.stringify(s.pkg,null,2)+`
`);const u=e.fs.resolvePath("package-lock.json",e.cwd);try{const o=JSON.parse(await e.fs.readFile(u,"utf8"));o.version=i,o.packages?.[""]&&(o.packages[""].version=i),await e.fs.writeFile(u,JSON.stringify(o,null,2)+`
`)}catch{}return e.stdout+=`v${i}
`,0}async function tt(e){const t=e.args.includes("--json"),[n,...a]=e.args.slice(1).filter(c=>!c.startsWith("-"));let s=n,r="latest";if(!n||n==="."){const c=await x(e);if(!c?.pkg?.name)return e.stderr+=`npm error code EUSAGE
npm error Usage: npm view [<package-spec>] [<field>[.subfield]...]
`,1;s=c.pkg.name}else{const c=n.lastIndexOf("@");c>0&&(s=n.slice(0,c),r=n.slice(c+1))}let i;try{const c=`https://registry.npmjs.org/${s.replace("/","%2F")}`,p=await fetch(c);if(p.status===404)return e.stderr+=`npm error code E404
npm error 404 Not Found - GET ${c} - Not found
`,1;i=await p.json()}catch(c){return e.stderr+=`npm error ${c?.message??c}
`,1}const u=i["dist-tags"]?.[r]??(i.versions?.[r]?r:void 0)??Object.keys(i.versions??{}).filter(c=>nt(c,r)).pop(),o=u?{...i,...i.versions[u],versions:Object.keys(i.versions??{}),"dist-tags":i["dist-tags"],time:i.time}:null;if(!o)return e.stderr+=`npm error code E404
npm error No match found for version ${r}
`,1;if(a.length){const c=d=>I(d).reduce((f,g)=>f?.[g],o);if(a.length===1){const d=c(a[0]);return d===void 0||(e.stdout+=t?JSON.stringify(d,null,2)+`
`:typeof d=="string"?d+`
`:JSON.stringify(d,null,2).replace(/"([A-Za-z_$][\w$]*)":/g,"$1:").replace(/"/g,"'")+`
`),0}const p=Object.fromEntries(a.map(d=>[d,c(d)]));return e.stdout+=t?JSON.stringify(p,null,2)+`
`:Object.entries(p).map(([d,f])=>`${d} = ${typeof f=="string"?`'${f}'`:JSON.stringify(f)}`).join(`
`)+`
`,0}if(t){const{versions:c,time:p,...d}=o;return e.stdout+=JSON.stringify({...d,versions:c},null,2)+`
`,0}const l=Object.keys(o.dependencies??{});return e.stdout+=`
${o.name}@${o.version} | ${o.license??"Proprietary"} | deps: ${l.length||"none"} | versions: ${o.versions.length}
`,o.description&&(e.stdout+=`${o.description}
`),o.homepage&&(e.stdout+=`${o.homepage}
`),o.bin&&(e.stdout+=`
bin: ${Object.keys(typeof o.bin=="string"?{[o.name]:1}:o.bin).join(", ")}
`),e.stdout+=`
dist
.tarball: ${o.dist?.tarball}
.shasum: ${o.dist?.shasum}
`,o.dist?.integrity&&(e.stdout+=`.integrity: ${o.dist.integrity}
`),l.length&&(e.stdout+=`
dependencies:
${l.map(c=>`${c}: ${o.dependencies[c]}`).join(`
`)}
`),e.stdout+=`
dist-tags:
${Object.entries(o["dist-tags"]??{}).map(([c,p])=>`${c}: ${p}`).join(`
`)}
`,o.time?.[o.version]&&(e.stdout+=`
published ${o.time[o.version]}
`),0}function nt(e,t){if(/-/.test(e))return!1;const[n,a,s]=e.split(".").map(Number),r=/^([~^]?)(\d+)(?:\.(\d+|x|\*))?(?:\.(\d+|x|\*))?$/.exec(t.trim());if(!r)return!1;const[,i,u,o,l]=r;return n!==+u?!1:i==="^"?o===void 0||o==="x"||o==="*"?!0:+u>0&&a>+o||a===+o&&s>=+(l??0):o===void 0||o==="x"||o==="*"?!0:a!==+o?!1:i==="~"?s>=+(l??0):l===void 0||l==="x"||l==="*"?!0:s===+l}(globalThis.__tabcomputerLive??=new Map).set("src/commands/npm.ts",Pe);(globalThis.__tabcomputerLiveState??=new Map).set("src/commands/npm.ts",{get activeCommands(){return C},set activeCommands(e){C=e},get metadataCache(){return b},get pendingMetadataRequests(){return D},get silentRuns(){return Q}});export{J as NPM_VERSION,me as initializerPackage,ze as npmCmd};
