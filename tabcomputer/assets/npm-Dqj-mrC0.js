import{aP as Z}from"./index-BIxBofyG.js";import{extractTarGzToFS as je}from"./tar-utils-DTrZv144.js";const Oe=Object.freeze(Object.defineProperty({__proto__:null,get coerce(){return Me},get compareSemVer(){return X},get increment(){return Ee},get maxSatisfying(){return ne},get parseSemVer(){return N},get satisfiesRange(){return T}},Symbol.toStringTag,{value:"Module"})),Se=Object.freeze(Object.defineProperty({__proto__:null,get WASM_ALTERNATES(){return A},get WASM_COMPANIONS(){return I},get binDirOf(){return G},get binEntries(){return ae},get buildTree(){return oe},get pickVersion(){return se}},Symbol.toStringTag,{value:"Module"})),_e=Object.freeze(Object.defineProperty({__proto__:null,get SAVE_PREFIX(){return ie},get dropFromLockfile(){return de},get integrityOf(){return ce},get isRange(){return le},get saveSpec(){return V},get serializeLockfile(){return Y},get updateLockfile(){return ue}},Symbol.toStringTag,{value:"Module"})),Pe=Object.freeze(Object.defineProperty({__proto__:null,get NPM_VERSION(){return C},get initializerPackage(){return pe},get npmCmd(){return ze}},Symbol.toStringTag,{value:"Module"}));function N(e){e=e.trim(),e.startsWith("v")&&(e=e.slice(1));const t=e.match(/^(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9.-]+))?(?:\+([a-zA-Z0-9.-]+))?$/);return t?{major:parseInt(t[1],10),minor:parseInt(t[2],10),patch:parseInt(t[3],10),prerelease:t[4],build:t[5],raw:e}:null}function X(e,t){if(e.major!==t.major)return e.major-t.major;if(e.minor!==t.minor)return e.minor-t.minor;if(e.patch!==t.patch)return e.patch-t.patch;if(!e.prerelease&&t.prerelease)return 1;if(e.prerelease&&!t.prerelease)return-1;if(e.prerelease&&t.prerelease){const n=e.prerelease.split("."),a=t.prerelease.split(".");for(let s=0;s<Math.max(n.length,a.length);s++){if(n[s]===void 0)return-1;if(a[s]===void 0)return 1;if(n[s]===a[s])continue;const r=/^\d+$/.test(n[s]),l=/^\d+$/.test(a[s]);return r&&l?parseInt(n[s],10)-parseInt(a[s],10):r!==l?r?-1:1:n[s]<a[s]?-1:1}}return 0}function Ae(e,t,n){const a=X(e,n);switch(t){case"=":return a===0;case">":return a>0;case">=":return a>=0;case"<":return a<0;case"<=":return a<=0}}function Ne(e){const t=e.trim().replace(/^[v=]+/,"").match(/^(\d+|[xX*])(?:\.(\d+|[xX*]))?(?:\.(\d+|[xX*]))?(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/);if(!t)return null;const n=l=>l===void 0||/^[xX*]$/.test(l)?void 0:parseInt(l,10),a=n(t[1]),s=a===void 0?void 0:n(t[2]),r=s===void 0?void 0:n(t[3]);return{major:a,minor:s,patch:r,prerelease:r===void 0?void 0:t[4]}}const k=(e,t,n,a)=>({major:e,minor:t,patch:n,prerelease:a,raw:`${e}.${t}.${n}${a?"-"+a:""}`});function J(e){const t=e.match(/^(\^|~>?|>=|<=|>|<|=)?\s*(.*)$/),n=t[1]||"",a=Ne(t[2]);if(!a)return null;const{major:s,minor:r,patch:l,prerelease:u}=a;if(s===void 0)return n==="<"||n===">"?[{op:"<",v:k(0,0,0,"0")}]:[];const o=k(s,r??0,l??0,u);switch(n){case"^":{const i=s>0||r===void 0?k(s+1,0,0,"0"):r>0||l===void 0?k(0,r+1,0,"0"):k(0,0,l+1,"0");return[{op:">=",v:o},{op:"<",v:i}]}case"~":case"~>":{const i=r===void 0?k(s+1,0,0,"0"):k(s,r+1,0,"0");return[{op:">=",v:o},{op:"<",v:i}]}case">":return r===void 0?[{op:">=",v:k(s+1,0,0)}]:l===void 0?[{op:">=",v:k(s,r+1,0)}]:[{op:">",v:o}];case"<=":return r===void 0?[{op:"<",v:k(s+1,0,0,"0")}]:l===void 0?[{op:"<",v:k(s,r+1,0,"0")}]:[{op:"<=",v:o}];case">=":return[{op:">=",v:o}];case"<":return[{op:"<",v:o}];default:return r===void 0?[{op:">=",v:o},{op:"<",v:k(s+1,0,0,"0")}]:l===void 0?[{op:">=",v:o},{op:"<",v:k(s,r+1,0,"0")}]:[{op:"=",v:o}]}}function Te(e){const t=e.match(/^(\S+)\s+-\s+(\S+)$/);if(t){const s=J(">="+t[1]),r=J("<="+t[2]);return s&&r?[...s,...r]:null}const n=e.replace(/(\^|~>?|>=|<=|>|<|=)\s+/g,"$1").split(/\s+/).filter(Boolean),a=[];for(const s of n){const r=J(s);if(!r)return null;a.push(...r)}return a}function T(e,t){if(t=t.trim(),t==="latest")return!0;const n=N(e);return n?t.split("||").some(a=>{const s=Te(a.trim());return!s||!s.every(r=>Ae(n,r.op,r.v))?!1:n.prerelease?s.some(r=>r.v.prerelease&&r.v.prerelease!=="0"&&r.v.major===n.major&&r.v.minor===n.minor&&r.v.patch===n.patch):!0}):!1}function ne(e,t){const n=e.filter(s=>T(s,t));if(n.length===0)return null;const a=n.map(s=>N(s)).filter(s=>s!==null);return a.length===0?null:(a.sort((s,r)=>X(r,s)),a[0].raw)}function Me(e){e=e.trim(),e.startsWith("v")&&(e=e.slice(1));const t=e.match(/^(\d+)(?:\.(\d+))?(?:\.(\d+))?/);if(t){const n=t[1],a=t[2]||"0",s=t[3]||"0";return`${n}.${a}.${s}`}return"0.0.0"}function Ee(e,t){const n=N(e);if(!n)return e;switch(t){case"major":return`${n.major+1}.0.0`;case"minor":return`${n.major}.${n.minor+1}.0`;case"patch":return`${n.major}.${n.minor}.${n.patch+1}`;default:return e}}(globalThis.__tabcomputerLive??=new Map).set("src/utils/semver-utils.ts",Oe);const A={esbuild:"esbuild-wasm",rollup:"@rollup/wasm-node",rolldown:"@rolldown/browser",lightningcss:"lightningcss-wasm"},I={},W={os:"linux",cpu:"x64",libc:"glibc"};function De(e,t){return/\.node$/.test(e.main??"")||/\.node"/.test(JSON.stringify(e.exports??null))||Object.values(A).includes(t.source)?!1:!Object.keys(t.data?.optionalDependencies??{}).some(n=>/wasm/.test(n))}function z(e,t){if(!e?.length)return!0;const n=e.filter(s=>s.startsWith("!")).map(s=>s.slice(1)),a=e.filter(s=>!s.startsWith("!"));return n.includes(t)?!1:a.length===0||a.includes(t)}function se(e,t){const n=(t||"").trim();if(n===""||n==="*"||n==="latest"||n==="x")return e["dist-tags"].latest??null;if(e["dist-tags"][n])return e["dist-tags"][n];if(e.versions[n])return n;const a=Object.keys(e.versions),s=ne(a,n),r=e["dist-tags"].latest;return r&&s&&r!==s&&T(r,n)?r:s}const Fe=(e,t)=>{for(let n=e;n;n=n.parent)if(n===t)return!0;return!1};function*re(e){for(const t of e.children.values())yield t,yield*re(t)}async function oe(e,t){const n={name:"",version:"",source:"",tarball:"",dir:"",parent:null,children:new Map,resolved:new Map},a=[],s=[],r=[];let l=e.map(u=>({from:n,want:u}));for(;l.length;){const u=new Set,o=p=>{let d=p.name,f=p.range;const m=/^npm:((?:@[^/@]+\/)?[^@]+)(?:@(.*))?$/.exec(f);return m&&(d=m[1],f=m[2]??"latest"),A[d]&&(d=A[d]),{source:d,range:f}};for(const{want:p}of l)/^(file:|link:|git\+|git:|github:|https?:|workspace:)/.test(p.range)||/^[^@/]+\/[^@/]+(#.*)?$/.test(p.range)||u.add(o(p).source);const i=new Map;await Promise.all([...u].map(async p=>{try{i.set(p,await t(p))}catch(d){i.set(p,d instanceof Error?d:new Error(String(d)))}}));const c=[];for(const{from:p,want:d}of l){const{name:f}=d;if(/^(file:|link:|git\+|git:|github:|https?:|workspace:)/.test(d.range)||/^[^@/]+\/[^@/]+(#.*)?$/.test(d.range)){r.push(`${f}@${d.range}: only registry packages are installed`);continue}const{source:m,range:h}=o(d);let v=null,b=null;for(let g=p;g;g=g.parent){const w=g.children.get(f);if(w){w.source===m&&(w.version===h||T(w.version,h)||h==="latest"||h==="*"||h==="")?b=w:v=g;break}}if(b){p.resolved.set(f,b);continue}const O=i.get(m);if(!O||O instanceof Error){d.optional||r.push(`${f}@${d.range}: ${O instanceof Error?O.message:"not found"}`);continue}const _=se(O,h),$=_?O.versions[_]:void 0;if(!_||!$){d.optional||r.push(`${f}@${d.range}: no matching version`);continue}const ke=!!$.cpu?.includes("wasm32"),ye=z($.os,W.os)&&z($.cpu,W.cpu)&&z($.libc,W.libc);if(!ke&&(!ye||d.optional&&($.os?.length||$.cpu?.length)&&!De($,p))){s.push(`${f}@${_}`);continue}const S=[];for(let g=p;g;g=g.parent)if(S.push(g),g===v){S.pop();break}if(!S.length){r.push(`${f}@${_}: ${p.name} keeps ${p.children.get(f).version}`),p.resolved.set(f,p.children.get(f));continue}let j=S[S.length-1];for(let g=S.length-1;g>0;g--){j=S[g];let w=!1;for(const be of re(j)){const x=be.resolved.get(f);if(x&&!Fe(x,j)){w=!0;break}}if(!w)break;j=S[g-1]}const P={name:f,version:_,source:m,tarball:$.dist.tarball,dir:`${j.dir?j.dir+"/":""}node_modules/${f}`,parent:j,children:new Map,resolved:new Map,bin:$.bin,data:$};j.children.set(f,P),p.resolved.set(f,P),a.push(P);for(const[g,w]of Object.entries($.dependencies??{}))c.push({from:P,want:{name:g,range:w}});I[m]&&c.push({from:P,want:{name:I[m],range:_,optional:!0}});for(const[g,w]of Object.entries($.optionalDependencies??{}))c.push({from:P,want:{name:g,range:w,optional:!0}});for(const[g,w]of Object.entries($.peerDependencies??{}))$.peerDependenciesMeta?.[g]?.optional||$.dependencies?.[g]||$.optionalDependencies?.[g]||c.push({from:j,want:{name:g,range:w}})}l=c}return{root:n,nodes:a,skipped:s,warnings:r}}function G(e){const t=e.dir.lastIndexOf("node_modules/");return e.dir.slice(0,t)+"node_modules/.bin"}function ae(e,t){return t?typeof t=="string"?[[e.replace(/^@[^/]+\//,""),t]]:Object.entries(t):[]}(globalThis.__tabcomputerLive??=new Map).set("src/commands/npm-tree.ts",Se);(globalThis.__tabcomputerLiveState??=new Map).set("src/commands/npm-tree.ts",{get WASM_COMPANIONS(){return I}});const ie="^",Ie=e=>/^v?\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.+-]*)?$/.test(e.trim()),le=e=>{const t=e.trim();return t===""||t==="*"||!Ie(t)&&/^[\s\d.xX*^~<>=|v-]+$/.test(t)};function Re(e,t){const n=N(e);return n?(n.major>0?[`${n.major}.${n.minor}.${n.patch}`,`${n.major}.${n.minor}.${n.patch+1}`,`${n.major}.${n.minor+1}.0`,`${n.major}.999999.999999`]:n.minor>0?[`0.${n.minor}.${n.patch}`,`0.${n.minor}.${n.patch+1}`,`0.${n.minor}.999999`]:[`0.0.${n.patch}`]).every(s=>T(s,t)):!1}function V(e,t,n={}){if(n.exact)return t;const a=(n.prefix??ie)+t,s=e.trim();return!le(s)||s===""||s==="*"||Re(t,s)?a:s}function ce(e){if(e?.integrity)return e.integrity;if(e?.shasum&&/^[0-9a-f]{40}$/i.test(e.shasum)){const t=e.shasum.match(/../g).map(n=>parseInt(n,16));return"sha1-"+btoa(String.fromCharCode(...t))}}function Ce(e,t){const n=e.data,a={};e.source&&e.source!==e.name&&(a.name=e.source),a.version=e.version,a.resolved=e.tarball;const s=ce(n?.dist);return s&&(a.integrity=s),t&&(a.dev=!0),n?.dependencies&&Object.keys(n.dependencies).length&&(a.dependencies={...n.dependencies}),n?.optionalDependencies&&Object.keys(n.optionalDependencies).length&&(a.optionalDependencies={...n.optionalDependencies}),n?.peerDependencies&&Object.keys(n.peerDependencies).length&&(a.peerDependencies={...n.peerDependencies}),n?.bin&&(a.bin=typeof n.bin=="string"?{[e.name.replace(/^@[^/]+\//,"")]:n.bin}:{...n.bin}),a}function ue(e,t,n){const a=new Set([...Object.keys(t.dependencies??{}),...Object.keys(t.optionalDependencies??{})]),s=new Set,r=i=>{if(!s.has(i)){s.add(i);for(const c of i.resolved.values())r(c)}};for(const[i,c]of n.root.resolved)a.has(i)&&r(c);const l={...e?.packages??{}},u={};t.name&&(u.name=t.name),t.version&&(u.version=t.version);for(const i of["dependencies","devDependencies","optionalDependencies"])t[i]&&Object.keys(t[i]).length&&(u[i]={...t[i]});l[""]=u;for(const i of n.nodes){let c=!s.has(i);c&&l[i.dir]&&!l[i.dir].dev&&l[i.dir].version===i.version&&(c=!1),l[i.dir]=Ce(i,c)}const o={"":l[""]};for(const i of Object.keys(l).filter(c=>c!=="").sort())o[i]=l[i];return{...t.name?{name:t.name}:{},...t.version?{version:t.version}:{},lockfileVersion:3,requires:!0,packages:o}}function de(e,t,n){const a={...e.packages};for(const r of n)for(const l of Object.keys(a))(l===`node_modules/${r}`||l.startsWith(`node_modules/${r}/`))&&delete a[l];const s={...a[""]??{}};for(const r of["dependencies","devDependencies","optionalDependencies"])t[r]&&Object.keys(t[r]).length?s[r]={...t[r]}:delete s[r];return a[""]=s,{...e,packages:a}}const Y=e=>JSON.stringify(e,null,2)+`
`;(globalThis.__tabcomputerLive??=new Map).set("src/commands/npm-lock.ts",_e);const C="10.8.2",y=new Map,Je=16<<20;function We(){let e=0;for(const t of y.values())e+=t.bytes;for(const[t,n]of y){if(e<=Je)break;y.delete(t),e-=n.bytes}}const q=3600*1e3,E=new Map;let R=0;const ze={name:"npm",description:"Browser-native package manager for Node.js packages",async exec(e){R++;try{return await fe(e)}finally{--R===0&&We()}}},K=new WeakSet;async function fe(e){const t=e.args.indexOf("--"),n=t<0?e.args:e.args.slice(0,t);if(n.some((r,l)=>r==="-s"||r==="--silent"||r==="--loglevel=silent"||r==="--loglevel"&&n[l+1]==="silent")){K.add(e);const r=[];for(let l=0;l<n.length;l++){const u=n[l];if(!(u==="-s"||u==="--silent"||u==="-q"||u==="--quiet"||u.startsWith("--loglevel="))){if(u==="--loglevel"){l++;continue}r.push(u)}}e.args=t<0?r:[...r,...e.args.slice(t)]}const s=e.args[0];if(!s||s==="--help"||s==="-h")return e.stdout+=`Usage: npm <command>

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
`,0;if(s==="--version"||s==="-v")return e.stdout+=`${C}
`,0;switch(s){case"create":case"innit":return await ee(e);case"init":return e.args[1]&&!e.args[1].startsWith("-")?await ee(e):await Le(e);case"exec":case"x":{const r=e.args.slice(1).filter((l,u)=>!(u===0&&l==="--"));return e.shell.execute(Z(["npx",...r]),l=>{e.stdout+=l.replace(/\r\n/g,`
`)},l=>{e.stderr+=l.replace(/\r\n/g,`
`)},!1,M(e),!0)}case"install":case"i":return await ve(e);case"list":case"ls":return await Ue(e);case"run":return await Ze(e);case"start":return await L(e,"start","node server.js");case"test":case"t":case"tst":return await L(e,"test");case"stop":return await L(e,"stop");case"uninstall":case"remove":case"rm":return await Xe(e);case"cache":return await Ge(e);case"config":case"c":return await te(e);case"get":return e.args=["config","get",...e.args.slice(1)],await te(e);case"prefix":return e.stdout+=(e.args.includes("-g")||e.args.includes("--global")?"/usr/local":e.cwd)+`
`,0;case"update":case"up":return e.stdout+=`up to date, audited 0 packages
`,0;case"outdated":return e.stdout+=`All packages are up to date.
`,0;case"audit":return e.stdout+=`found 0 vulnerabilities
`,0;case"pkg":return await Ye(e);case"ci":case"clean-install":case"install-clean":return await Ke(e);case"version":case"verison":return await et(e);case"view":case"info":case"show":case"v":return await tt(e);case"root":return e.stdout+=(e.args.includes("-g")||e.args.includes("--global")?"/usr/local/lib/node_modules":e.fs.resolvePath("node_modules",e.cwd))+`
`,0;case"help":return e.args=["--help"],fe(e);default:return e.stderr+=`npm: unknown command '${s}'
`,e.stderr+=`Run 'npm --help' for usage.
`,1}}function pe(e){const t=/^(@[^/@]+)(?:\/([^@]+))?(@.*)?$/.exec(e);if(t)return`${t[1]}/${t[2]?"create-"+t[2]:"create"}${t[3]??""}`;const n=e.indexOf("@",1);return`create-${n>0?e.slice(0,n):e}${n>0?e.slice(n):""}`}async function ee(e){const t=e.args[1];if(!t||t.startsWith("-"))return e.stderr+=`npm create: usage: npm create <initializer> [args]
`,1;const n=e.args.slice(2),a=n[0]==="--"?n.slice(1):n.filter((s,r)=>!(s==="--"&&r===n.indexOf("--")));return e.shell.execute(Z(["npx",pe(t),...a]),s=>{e.stdout+=s.replace(/\r\n/g,`
`)},s=>{e.stderr+=s.replace(/\r\n/g,`
`)},!1,M(e),!0)}async function Le(e){const t=e.fs.resolvePath("package.json",e.cwd);try{return await e.fs.readFile(t,"utf8"),e.stdout+=`package.json already exists.
`,0}catch{}const a={name:(e.cwd.split("/").filter(Boolean).pop()||"my-project").toLowerCase().replace(/[^a-z0-9._~-]+/g,"-"),version:"1.0.0",main:"index.js",scripts:{test:'echo "Error: no test specified" && exit 1'},keywords:[],author:"",license:"ISC",description:""},s=JSON.stringify(a,null,2)+`
`;return await e.fs.writeFile(t,s),e.stdout+=`Wrote to ${t}:

${s}

`,0}async function Ve(e){const t=y.get(e);if(t&&Date.now()-t.timestamp<q)return y.delete(e),y.set(e,t),t.data;const n=E.get(e);if(n)return n;const a=(async()=>{const s=`https://registry.npmjs.org/${e}`,r=await fetch(s,{headers:{Accept:"application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8"}});if(!r.ok)throw r.status===404?new Error(`Package '${e}' not found in npm registry`):new Error(`Failed to fetch package metadata: ${r.statusText}`);const l=await r.text(),u=JSON.parse(l);return y.set(e,{data:u,timestamp:Date.now(),bytes:l.length}),u})();E.set(e,a);try{return await a}finally{E.delete(e)}}async function me(e,t,n,a={}){const s=t.replace(/\/$/,""),r=new Map;for(const i of n.nodes){const c=i.dir.split("/node_modules/").length;(r.get(c)??r.set(c,[]).get(c)).push(i)}let l=0,u=0;const o=[];for(const i of[...r.keys()].sort((c,p)=>c-p)){const c=[...r.get(i)],p=async()=>{for(let d=c.shift();d;d=c.shift()){const f=`${s}/${d.dir}`;try{try{const b=JSON.parse(await e.fs.readFile(`${f}/package.json`,"utf8"));if(b.version===d.version&&b.name===d.source)continue;await e.fs.rm(f,{recursive:!0,force:!0})}catch{}const m=await fetch(d.tarball);if(!m.ok)throw new Error(`download failed: ${m.status} ${m.statusText}`);const h=new Uint8Array(await m.arrayBuffer());await e.fs.mkdir(f,{recursive:!0}),await je(h,f,{writeFile:async(b,O)=>{await e.fs.writeFile(b,O)},mkdir:async b=>{try{await e.fs.mkdir(b,{recursive:!0})}catch{}}}),o.push(d),l++}catch(m){u++,e.stderr+=`npm: ${d.name}@${d.version}: ${m?.message??m}
`}}};await Promise.all(Array.from({length:Math.min(16,c.length)},p))}for(const i of n.nodes)for(const[c,p]of ae(i.name,i.bin)){const d=p.replace(/^\.\//,""),f=[[`${s}/${G(i)}/${c}`,`../${i.name}/${d}`]];a.globalBinDir&&i.parent?.dir===""&&f.push([`${a.globalBinDir}/${c}`,`${s}/${i.dir}/${d}`]);for(const[m,h]of f)try{await e.fs.mkdir(m.slice(0,m.lastIndexOf("/")),{recursive:!0});try{await e.fs.unlink(m)}catch{}await e.fs.symlink(h,m)}catch{}}return a.ignoreScripts||await qe(e,s,o),{added:l,failed:u}}async function ge(e){if(e.args.includes("--ignore-scripts"))return!0;try{const t=await e.fs.readFile(`${e.env.HOME||"/home/user"}/.npmrc`,"utf8");return/^\s*ignore-scripts\s*=\s*true\s*$/m.test(t)}catch{return!1}}async function qe(e,t,n){const a=o=>`'${o.replace(/'/g,"'\\''")}'`,s=[],r=new Set,l=o=>{if(!r.has(o)){r.add(o);for(const i of o.resolved.values())l(i);s.push(o)}};n.forEach(l);const u=new Set(n);for(const o of s.filter(i=>u.has(i))){const i=`${t}/${o.dir}`;let c={};try{c=JSON.parse(await e.fs.readFile(`${i}/package.json`,"utf8")).scripts??{}}catch{continue}for(const p of["preinstall","install","postinstall"]){const d=c[p];if(!d)continue;const f={npm_lifecycle_event:p,npm_lifecycle_script:d,npm_package_name:o.name,npm_package_version:o.version,INIT_CWD:e.cwd,npm_command:"install"};let m="";const h=await e.shell.execute(`(cd ${a(i)} && export ${Object.entries(f).map(([v,b])=>`${v}=${a(b)}`).join(" ")} PATH=${a(`${i}/node_modules/.bin:${t}/${G(o)}`)}:"$PATH" && ${d})`,v=>{m+=v.replace(/\r\n/g,`
`)},v=>{m+=v.replace(/\r\n/g,`
`)},!1,void 0,!0);if(h!==0){e.stderr+=`npm warn ${o.name}@${o.version} ${p}: \`${d}\` exited with ${h}
`,m.trim()&&(e.stderr+=m.trimEnd().split(`
`).slice(-10).map(v=>`npm warn   ${v}`).join(`
`)+`
`);break}}}}async function he(e,t){const n=await oe(t,Ve);for(const s of n.warnings)e.stderr+=`npm warn ${s}
`;for(const s of n.nodes)s.parent===n.root&&t.some(r=>r.name===s.name)&&(e.stdout+=`  + ${s.name}@${s.version}
`);const a=n.nodes.filter(s=>s.source!==s.name&&Object.values(A).includes(s.source));for(const s of a)e.stdout+=`  ${s.name}@${s.version}: the WebAssembly build (${s.source})
`;return n.skipped.length&&(e.stdout+=`  skipped ${n.skipped.length} native platform package(s): ${n.skipped.slice(0,6).join(", ")}${n.skipped.length>6?", ...":""}
`),n}async function ve(e){const t=e.args.includes("-g")||e.args.includes("--global"),n=e.args.includes("-D")||e.args.includes("--save-dev"),a=e.args.includes("-E")||e.args.includes("--save-exact"),s=e.args.slice(1).filter(f=>!f.startsWith("-"));if(t)return await He(e,s);const r=e.fs.resolvePath("package.json",e.cwd);let l;try{const f=await e.fs.readFile(r,"utf8");l=JSON.parse(f)}catch(f){if(!f.message.includes("ENOENT"))return e.stderr+=`npm: failed to parse package.json: ${f.message}
`,1;if(!s.length)return e.stdout+=`up to date, audited 0 packages
`,0;l={}}let u={};const o=n?"devDependencies":"dependencies";if(s.length===0){const f={...l.dependencies,...l.devDependencies};if(Object.keys(f).length===0)return e.stdout+=`No dependencies to install.
`,0;u=f,e.stdout+=`Installing dependencies...
`}else{for(const f of s){let m,h;if(f.startsWith("@")){const v=f.lastIndexOf("@");v>0?(m=f.slice(0,v),h=f.slice(v+1)):(m=f,h="latest")}else if(f.includes("@")){const v=f.indexOf("@");m=f.slice(0,v),h=f.slice(v+1)}else m=f,h="latest";u[m]=h}e.stdout+=`Installing packages...
`}const i=Date.now(),c=await he(e,Object.entries(u).map(([f,m])=>({name:f,range:m})));if(s.length){l[o]||(l[o]={});for(const[f,m]of Object.entries(u)){const h=c.root.resolved.get(f);if(!h)continue;const v=/^npm:((?:@[^/@]+\/)?[^@]+)(?:@(.*))?$/.exec(m);l[o][f]=v?`npm:${v[1]}@${V(v[2]??"",h.version,{exact:a})}`:V(m==="latest"?"":m,h.version,{exact:a}),delete l[n?"dependencies":"devDependencies"]?.[f]}await e.fs.writeFile(r,JSON.stringify(l,null,2)+`
`)}const{added:p,failed:d}=await me(e,e.cwd,c,{ignoreScripts:await ge(e)});return e.stdout+=`
added ${p} package(s), ${c.nodes.length} in the tree, in ${((Date.now()-i)/1e3).toFixed(1)}s
`,d||c.warnings.length&&c.nodes.length===0?1:(await Be(e,l,c),e.stdout+=`Packages installed successfully.
`,0)}async function Be(e,t,n){const a=e.fs.resolvePath("package-lock.json",e.cwd);let s=null;try{const r=JSON.parse(await e.fs.readFile(a,"utf8"));r&&typeof r.packages=="object"&&(s=r)}catch{}try{await e.fs.writeFile(a,Y(ue(s,t,n)))}catch(r){e.stderr+=`npm warn could not write package-lock.json: ${r?.message??r}
`}}async function He(e,t){if(t.length===0)return e.stderr+=`npm: please specify packages to install globally
`,1;const n="/usr/local/lib/node_modules",a="/usr/local/bin";for(const o of["/usr/local/lib",n,a])try{await e.fs.mkdir(o,{recursive:!0})}catch{}const s={};for(const o of t){let i,c;if(o.startsWith("@")){const p=o.lastIndexOf("@");p>0?(i=o.slice(0,p),c=o.slice(p+1)):(i=o,c="latest")}else if(o.includes("@")){const p=o.indexOf("@");i=o.slice(0,p),c=o.slice(p+1)}else i=o,c="latest";s[i]=c}e.stdout+=`Installing packages globally...
`;const r=await he(e,Object.entries(s).map(([o,i])=>({name:o,range:i}))),{added:l,failed:u}=await me(e,"/usr/local/lib",r,{globalBinDir:a,ignoreScripts:await ge(e)});return e.stdout+=`
added ${l} package(s)
`,u?1:(e.stdout+=`Packages installed globally.
`,0)}async function Ue(e){const t=e.fs.resolvePath("package.json",e.cwd);let n;try{const r=await e.fs.readFile(t,"utf8");n=JSON.parse(r)}catch{return e.stderr+=`npm: package.json not found.
`,1}const a=n.dependencies||{},s=n.devDependencies||{};if(Object.keys(a).length===0&&Object.keys(s).length===0)return e.stdout+=`No packages installed.
`,0;if(e.stdout+=`${n.name}@${n.version}
`,Object.keys(a).length>0){e.stdout+=`
dependencies:
`;for(const[r,l]of Object.entries(a)){const u=e.fs.resolvePath(`node_modules/${r}/package.json`,e.cwd);let o=l;try{const i=await e.fs.readFile(u,"utf8");o=JSON.parse(i).version||l}catch{}e.stdout+=`  ${r} ${o}
`}}if(Object.keys(s).length>0){e.stdout+=`
devDependencies:
`;for(const[r,l]of Object.entries(s))e.stdout+=`  ${r} ${l}
`}return 0}async function Ze(e){const t=e.args[1];if(!t){const l=e.fs.resolvePath("package.json",e.cwd);let u;try{const i=await e.fs.readFile(l,"utf8");u=JSON.parse(i)}catch{return e.stderr+=`npm: package.json not found.
`,1}const o=u.scripts||{};if(Object.keys(o).length===0)return e.stdout+=`No scripts available.
`,0;e.stdout+=`Available scripts:
`;for(const[i,c]of Object.entries(o))e.stdout+=`  ${i}
`,e.stdout+=`    ${c}
`;return 0}const n=e.fs.resolvePath("package.json",e.cwd);let a;try{const l=await e.fs.readFile(n,"utf8");a=JSON.parse(l)}catch{return e.stderr+=`npm: package.json not found.
`,1}const s=a.scripts?.[t];if(!s){e.stderr+=`npm: missing script: ${t}
`,e.stderr+=`
Available scripts:
`;for(const l of Object.keys(a.scripts||{}))e.stderr+=`  ${l}
`;return 1}const r=$e(s,e.args.slice(2));return we(e,`> ${U(a)}${t}
> ${r}

`),B(e,n,()=>e.shell.execute(r,D(e),H(e),!1,M(e),!0))}async function L(e,t,n){const a=e.fs.resolvePath("package.json",e.cwd);let s;try{const u=await e.fs.readFile(a,"utf8");s=JSON.parse(u)}catch{return e.stderr+=`npm: package.json not found.
`,1}const r=s.scripts?.[t];if(!r){if(n)return D(e)(`> ${U(s)}${t}
> ${n}

`),await B(e,a,()=>e.shell.execute(n,D(e),H(e),!1,void 0,!0));e.stderr+=`npm: missing script: ${t}
`,e.stderr+=`
Available scripts:
`;for(const u of Object.keys(s.scripts||{}))e.stderr+=`  ${u}
`;return 1}const l=$e(r,e.args.slice(1));return we(e,`> ${U(s)}${t}
> ${l}

`),await B(e,a,()=>e.shell.execute(l,D(e),H(e),!1,M(e),!0))}async function B(e,t,n){const a=[];for(let u=t.slice(0,t.lastIndexOf("/"))||"/";a.push(`${u==="/"?"":u}/node_modules/.bin`),u!=="/";u=u.slice(0,u.lastIndexOf("/"))||"/");const s=e.shell.env,r="PATH"in s,l=s.PATH;s.PATH=[...a,...l?[l]:[]].join(":");try{return await n()}finally{r?s.PATH=l:delete s.PATH}}function $e(e,t){const n=t[0]==="--"?t.slice(1):t;return n.length?`${e} ${Z(n)}`:e}const D=e=>t=>{t=t.replace(/\r\n/g,`
`),e.streamStdout?e.streamStdout(t):e.stdout+=t},H=e=>t=>{t=t.replace(/\r\n/g,`
`),e.streamStderr?e.streamStderr(t):e.stderr+=t},U=e=>e.name?`${e.name}${e.version?"@"+e.version:""} `:"";function we(e,t){if(K.has(e))return;const n=M(e);n?.writeOutput?n.writeOutput(t.replace(/\n/g,`\r
`)):e.streamStdout?e.streamStdout(t):e.stdout+=t}function M(e){return e.terminal&&e.stdoutIsTTY!==!1?e.terminal:void 0}async function Xe(e){const t=e.args.slice(1);if(t.length===0)return e.stderr+=`npm: missing package name
`,e.stderr+=`Usage: npm uninstall <package>
`,1;const n=e.fs.resolvePath("package.json",e.cwd);let a;try{const r=await e.fs.readFile(n,"utf8");a=JSON.parse(r)}catch{return e.stderr+=`npm: package.json not found.
`,1}for(const r of t){a.dependencies?.[r]?(delete a.dependencies[r],e.stdout+=`Removed ${r} from dependencies.
`):a.devDependencies?.[r]?(delete a.devDependencies[r],e.stdout+=`Removed ${r} from devDependencies.
`):e.stderr+=`Package ${r} not found in dependencies.
`;const l=e.fs.resolvePath(`node_modules/${r}`,e.cwd);try{await e.fs.rm(l,{recursive:!0}),e.stdout+=`Removed ${r} from node_modules.
`}catch(u){e.stderr+=`Warning: Could not remove ${r} from node_modules: ${u.message}
`}}await e.fs.writeFile(n,JSON.stringify(a,null,2)+`
`);const s=e.fs.resolvePath("package-lock.json",e.cwd);try{const r=JSON.parse(await e.fs.readFile(s,"utf8"));r&&typeof r.packages=="object"&&await e.fs.writeFile(s,Y(de(r,a,t)))}catch{}return 0}async function Ge(e){const t=e.args[1];if(!t||t==="--help")return e.stdout+=`Usage: npm cache <command>

`,e.stdout+=`Commands:
`,e.stdout+=`  clean     Clear the metadata cache
`,e.stdout+=`  status    Show cache statistics
`,0;switch(t){case"clean":case"clear":{const n=e.args.includes("--force")||e.args.includes("-f"),a=y.size;if(y.clear(),e.stdout+=`Cleared ${a} cached package metadata entries.
`,n){const s=e.fs.resolvePath("node_modules",e.cwd);try{await e.fs.rm(s,{recursive:!0}),e.stdout+=`Removed node_modules/ directory.
`}catch{e.stdout+=`No node_modules/ directory to remove.
`}}return 0}case"status":case"ls":if(e.stdout+=`npm metadata cache:
`,e.stdout+=`  Cached packages: ${y.size}
`,e.stdout+=`  TTL: ${q/1e3/60} minutes
`,y.size>0){e.stdout+=`
  Cached entries:
`;const n=Date.now();for(const[a,{timestamp:s}]of y){const r=Math.floor((n-s)/1e3),l=Math.floor(r/60),u=Math.floor((q-(n-s))/1e3/60);e.stdout+=`    ${a} (age: ${l}m, expires in: ${u}m)
`}}return 0;default:return e.stderr+=`npm cache: unknown command '${t}'
`,1}}async function te(e){const t=e.env.HOME||"/home/user",n=`${t}/.npmrc`,a={registry:"https://registry.npmjs.org/",prefix:"/usr/local",cache:`${t}/.npm`,"user-agent":`npm/${C} node/v22.12.0 linux x64 workspaces/false`};let s="";try{s=await e.fs.readFile(n,"utf8")}catch{}const r=new Map;for(const i of s.split(`
`)){const c=/^\s*([^#;=\s][^=]*?)\s*=\s*(.*?)\s*$/.exec(i);c&&r.set(c[1],c[2])}const l=()=>e.fs.writeFile(n,[...r].map(([i,c])=>`${i}=${c}`).join(`
`)+(r.size?`
`:"")),[,u="list",...o]=e.args.filter(i=>i!=="--global"&&i!=="-g"&&i!=="--location=user");switch(u){case"get":{if(!o.length){for(const[i,c]of r)e.stdout+=`${i}=${c}
`;return 0}for(const i of o)e.stdout+=`${r.get(i)??a[i]??"undefined"}
`;return 0}case"set":{for(const i of o){const c=i.indexOf("=");if(c>0)r.set(i.slice(0,c),i.slice(c+1));else if(o.length>=2){r.set(o[0],o[1]);break}}return await l(),0}case"delete":case"rm":for(const i of o)r.delete(i);return await l(),0;case"list":case"ls":e.stdout+=`; "user" config from ${n}

`;for(const[i,c]of r)e.stdout+=`${i} = ${JSON.stringify(c)}
`;return e.stdout+=`
; node bin location = /usr/local/bin/node
; cwd = ${e.cwd}
; HOME = ${t}
`,0;default:return e.stderr+=`npm config: unknown command '${u}'
`,1}}async function Q(e){const t=e.fs.resolvePath("package.json",e.cwd);try{return{path:t,pkg:JSON.parse(await e.fs.readFile(t,"utf8"))}}catch{return null}}const F=e=>e.replace(/\[(\d+)\]/g,".$1").split(".").filter(Boolean);async function Ye(e){const[,t,...n]=e.args,a=n.includes("--json"),s=n.filter(u=>u!=="--json"&&u!=="-w"&&!u.startsWith("--workspace")),r=await Q(e);if(!r)return e.stderr+=`npm error code ENOENT
npm error Could not read package.json at ${e.fs.resolvePath("package.json",e.cwd)}
`,1;const l=u=>F(u).reduce((o,i)=>o?.[i],r.pkg);if(t==="get"||t===void 0){const u=s.length?s.length===1?l(s[0]):Object.fromEntries(s.map(o=>[o,l(o)]).filter(([,o])=>o!==void 0)):r.pkg;return u!==void 0&&!(s.length>1&&!Object.keys(u).length)&&(e.stdout+=JSON.stringify(u,null,2)+`
`),0}if(t==="set")for(const u of s){const o=u.indexOf("=");if(o<=0)return e.stderr+=`npm error npm pkg set expects a key=value pair of args.
`,1;const i=F(u.slice(0,o));let c=u.slice(o+1);if(a)try{c=JSON.parse(c)}catch(d){return e.stderr+=`npm error ${d.message}
`,1}let p=r.pkg;for(let d=0;d<i.length-1;d++)(p[i[d]]==null||typeof p[i[d]]!="object")&&(p[i[d]]=/^\d+$/.test(i[d+1])?[]:{}),p=p[i[d]];p[i[i.length-1]]=c}else if(t==="delete")for(const u of s){const o=F(u);let i=r.pkg;for(let c=0;c<o.length-1&&i;c++)i=i[o[c]];i&&typeof i=="object"&&(Array.isArray(i)?i.splice(Number(o[o.length-1]),1):delete i[o[o.length-1]])}else return e.stderr+=`npm error Unknown pkg command: ${t}
npm error Usage: npm pkg get|set|delete [<key>...]
`,1;return await e.fs.writeFile(r.path,JSON.stringify(r.pkg,null,2)+`
`),0}async function Ke(e){const t=async n=>e.fs.exists(e.fs.resolvePath(n,e.cwd));if(!await t("package-lock.json")&&!await t("npm-shrinkwrap.json"))return e.stderr+=`npm error code EUSAGE
npm error
npm error The \`npm ci\` command can only install with an existing package-lock.json or
npm error npm-shrinkwrap.json with lockfileVersion >= 1. Run an install with npm@5 or
npm error later to generate a package-lock.json file, then try again.
`,1;try{await e.fs.rm(e.fs.resolvePath("node_modules",e.cwd),{recursive:!0})}catch{}return e.args=["install",...e.args.slice(1).filter(n=>n.startsWith("-"))],ve(e)}const Qe=["major","minor","patch","premajor","preminor","prepatch","prerelease"];function xe(e,t,n){const a=/^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?/.exec(e);if(!a)return null;let[s,r,l]=[+a[1],+a[2],+a[3]];const u=a[4],o=n?`${n}.0`:"0";switch(t){case"major":return u&&r===0&&l===0?`${s}.0.0`:`${s+1}.0.0`;case"minor":return u&&l===0?`${s}.${r}.0`:`${s}.${r+1}.0`;case"patch":return u?`${s}.${r}.${l}`:`${s}.${r}.${l+1}`;case"premajor":return`${s+1}.0.0-${o}`;case"preminor":return`${s}.${r+1}.0-${o}`;case"prepatch":return`${s}.${r}.${l+1}-${o}`;case"prerelease":{if(!u)return`${s}.${r}.${l+1}-${o}`;const i=u.split("."),c=i.length-1;return/^\d+$/.test(i[c])?i[c]=String(+i[c]+1):i.push("0"),`${s}.${r}.${l}-${i.join(".")}`}}return null}async function et(e){const t=e.args.slice(1).filter(o=>!o.startsWith("-")),n=(()=>{const o=e.args.indexOf("--preid");return o>=0?e.args[o+1]:e.args.find(i=>i.startsWith("--preid="))?.slice(8)})(),a=e.args.includes("--json"),s=await Q(e);if(!t.length||n&&t[0]===n){const o={};return s?.pkg?.name&&s.pkg.version&&(o[s.pkg.name]=s.pkg.version),Object.assign(o,{npm:C,node:"22.12.0",acorn:"8.14.0",ada:"2.9.2",brotli:"1.1.0",uv:"1.49.1",v8:"12.4.254.21-node.21",zlib:"1.3.0.1-motley-82a5fec"}),e.stdout+=a?JSON.stringify(o,null,2)+`
`:`{
${Object.entries(o).map(([i,c])=>`  ${/^[A-Za-z_$][\w$]*$/.test(i)?i:`'${i}'`}: '${c}'`).join(`,
`)}
}
`,0}if(!s)return e.stderr+=`npm error code ENOENT
npm error Could not read package.json
`,1;const r=t[0].replace(/^v/,""),l=Qe.includes(t[0])?xe(String(s.pkg.version??"0.0.0"),t[0],n):/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(r)?r:null;if(!l)return e.stderr+=`npm error Invalid version: ${t[0]}
`,1;if(l===s.pkg.version&&!e.args.includes("--allow-same-version"))return e.stderr+=`npm error Version not changed, might want --allow-same-version
`,1;s.pkg.version=l,await e.fs.writeFile(s.path,JSON.stringify(s.pkg,null,2)+`
`);const u=e.fs.resolvePath("package-lock.json",e.cwd);try{const o=JSON.parse(await e.fs.readFile(u,"utf8"));o.version=l,o.packages?.[""]&&(o.packages[""].version=l),await e.fs.writeFile(u,JSON.stringify(o,null,2)+`
`)}catch{}return e.stdout+=`v${l}
`,0}async function tt(e){const t=e.args.includes("--json"),[n,...a]=e.args.slice(1).filter(c=>!c.startsWith("-"));let s=n,r="latest";if(!n||n==="."){const c=await Q(e);if(!c?.pkg?.name)return e.stderr+=`npm error code EUSAGE
npm error Usage: npm view [<package-spec>] [<field>[.subfield]...]
`,1;s=c.pkg.name}else{const c=n.lastIndexOf("@");c>0&&(s=n.slice(0,c),r=n.slice(c+1))}let l;try{const c=`https://registry.npmjs.org/${s.replace("/","%2F")}`,p=await fetch(c);if(p.status===404)return e.stderr+=`npm error code E404
npm error 404 Not Found - GET ${c} - Not found
`,1;l=await p.json()}catch(c){return e.stderr+=`npm error ${c?.message??c}
`,1}const u=l["dist-tags"]?.[r]??(l.versions?.[r]?r:void 0)??Object.keys(l.versions??{}).filter(c=>nt(c,r)).pop(),o=u?{...l,...l.versions[u],versions:Object.keys(l.versions??{}),"dist-tags":l["dist-tags"],time:l.time}:null;if(!o)return e.stderr+=`npm error code E404
npm error No match found for version ${r}
`,1;if(a.length){const c=d=>F(d).reduce((f,m)=>f?.[m],o);if(a.length===1){const d=c(a[0]);return d===void 0||(e.stdout+=t?JSON.stringify(d,null,2)+`
`:typeof d=="string"?d+`
`:JSON.stringify(d,null,2).replace(/"([A-Za-z_$][\w$]*)":/g,"$1:").replace(/"/g,"'")+`
`),0}const p=Object.fromEntries(a.map(d=>[d,c(d)]));return e.stdout+=t?JSON.stringify(p,null,2)+`
`:Object.entries(p).map(([d,f])=>`${d} = ${typeof f=="string"?`'${f}'`:JSON.stringify(f)}`).join(`
`)+`
`,0}if(t){const{versions:c,time:p,...d}=o;return e.stdout+=JSON.stringify({...d,versions:c},null,2)+`
`,0}const i=Object.keys(o.dependencies??{});return e.stdout+=`
${o.name}@${o.version} | ${o.license??"Proprietary"} | deps: ${i.length||"none"} | versions: ${o.versions.length}
`,o.description&&(e.stdout+=`${o.description}
`),o.homepage&&(e.stdout+=`${o.homepage}
`),o.bin&&(e.stdout+=`
bin: ${Object.keys(typeof o.bin=="string"?{[o.name]:1}:o.bin).join(", ")}
`),e.stdout+=`
dist
.tarball: ${o.dist?.tarball}
.shasum: ${o.dist?.shasum}
`,o.dist?.integrity&&(e.stdout+=`.integrity: ${o.dist.integrity}
`),i.length&&(e.stdout+=`
dependencies:
${i.map(c=>`${c}: ${o.dependencies[c]}`).join(`
`)}
`),e.stdout+=`
dist-tags:
${Object.entries(o["dist-tags"]??{}).map(([c,p])=>`${c}: ${p}`).join(`
`)}
`,o.time?.[o.version]&&(e.stdout+=`
published ${o.time[o.version]}
`),0}function nt(e,t){if(/-/.test(e))return!1;const[n,a,s]=e.split(".").map(Number),r=/^([~^]?)(\d+)(?:\.(\d+|x|\*))?(?:\.(\d+|x|\*))?$/.exec(t.trim());if(!r)return!1;const[,l,u,o,i]=r;return n!==+u?!1:l==="^"?o===void 0||o==="x"||o==="*"?!0:+u>0&&a>+o||a===+o&&s>=+(i??0):o===void 0||o==="x"||o==="*"?!0:a!==+o?!1:l==="~"?s>=+(i??0):i===void 0||i==="x"||i==="*"?!0:s===+i}(globalThis.__tabcomputerLive??=new Map).set("src/commands/npm.ts",Pe);(globalThis.__tabcomputerLiveState??=new Map).set("src/commands/npm.ts",{get activeCommands(){return R},set activeCommands(e){R=e},get metadataCache(){return y},get pendingMetadataRequests(){return E},get silentRuns(){return K}});export{C as NPM_VERSION,pe as initializerPackage,ze as npmCmd};
