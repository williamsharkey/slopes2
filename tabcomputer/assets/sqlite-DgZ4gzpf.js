const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./sql-wasm-DZa87jqp.js","./index-C6zxlZK4.js","./index-LZoznX6r.css","./index-rQLcFmgX.js","./empty-Cl2ND4lu.js","./index-RIDckRQ9.js","./index-DC8nVd1b.js","./index-DBFfHeKE.js","./index-CqfddgO8.js","./index-CrLMQL0U.js","./util-Bkiq_eO2.js","./sha1-Clvz3AxN.js"])))=>i.map(i=>d[i]);
import{a as b,q as _}from"./index-C6zxlZK4.js";const L=Object.freeze(Object.defineProperty({__proto__:null,get sqlite3Cmd(){return R}},Symbol.toStringTag,{value:"Module"}));let d=null,m=null;async function S(t){if(d)return d;if(m)return m;m=(async()=>{t.stdout+="Loading SQLite (sql.js)... ";const[s,{default:a}]=await Promise.all([b(()=>import("./sql-wasm-DZa87jqp.js").then(r=>r.s),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11]),import.meta.url),b(()=>import("./sql-wasm-DPpJKUHH.js"),[],import.meta.url)]),n=typeof _=="object"&&typeof _.versions?.node=="string"&&a.startsWith("/@fs/")?a.slice(4):a,e=s.default??s;if(typeof e!="function")throw new Error("sql.js: no initSqlJs");return d=await e({locateFile:()=>n}),t.stdout+=`done.
`,d})();try{return await m}catch(s){throw m=null,s}}async function y(t,s,a){if(a===":memory:")return new t.Database;const o=s.fs.resolvePath(a,s.cwd);try{const n=await s.fs.readFile(o);return n instanceof Uint8Array?new t.Database(n):new t.Database(new TextEncoder().encode(n))}catch{return new t.Database}}async function h(t,s,a){if(a===":memory:")return;const o=s.fs.resolvePath(a,s.cwd),n=t.export();await s.fs.writeFile(o,new Uint8Array(n))}function E(t){if(!t||t.length===0)return"";let s="";for(const a of t)if(a.columns&&a.columns.length>0){s+=a.columns.join("|")+`
`;for(const o of a.values)s+=o.map(n=>n===null?"NULL":String(n)).join("|")+`
`}return s}function O(t,s){const a=s.trim().split(/\s+/),o=a[0].toLowerCase();switch(o){case".tables":{const n=t.exec("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");return n.length>0?{output:n[0].values.map(e=>e[0]).join("  ")+`
`,quit:!1}:{output:"",quit:!1}}case".schema":{const n=a[1],e=n?`SELECT sql FROM sqlite_master WHERE name='${n.replace(/'/g,"''")}'`:"SELECT sql FROM sqlite_master WHERE sql IS NOT NULL ORDER BY name",r=t.exec(e);return r.length>0?{output:r[0].values.map(i=>i[0]+";").join(`
`)+`
`,quit:!1}:{output:"",quit:!1}}case".databases":return{output:`main
`,quit:!1};case".quit":case".exit":return{output:"",quit:!0};case".help":return{output:`.databases  List databases
.exit       Exit
.help       Show this help
.quit       Exit
.schema     Show CREATE statements
.tables     List tables
`,quit:!1};default:return{output:`Error: unknown command: "${o}"
`,quit:!1}}}const R={name:"sqlite3",description:"SQLite database engine",async exec(t){let s;try{s=await S(t)}catch(i){return t.stderr=`error: failed to load sql.js: ${i.message}
`,1}const a=t.args,o=a[0]||":memory:",n=a.slice(1).join(" ");let e;try{e=await y(s,t,o)}catch(i){return t.stderr=`Error: unable to open database "${o}": ${i.message}
`,1}if(t.stdin)try{const i=e.exec(t.stdin);return t.stdout+=E(i),await h(e,t,o),e.close(),0}catch(i){return t.stderr=`Error: ${i.message}
`,e.close(),1}if(n){if(n.startsWith(".")){const{output:i}=O(e,n);return t.stdout+=i,e.close(),0}try{const i=e.exec(n);return t.stdout+=E(i),await h(e,t,o),e.close(),0}catch(i){return t.stderr=`Error: ${i.message}
`,e.close(),1}}if(!t.terminal)return t.stderr=`sqlite3: interactive mode requires a terminal
`,e.close(),1;const r=t.terminal;return r.writeOutput(`SQLite (sql.js)\r
Connected to ${o}\r
Type ".help" for usage hints, ".quit" to exit.\r
`),new Promise(i=>{let u="",l="";const w=()=>l?"   ...> ":"sqlite> ";r.writeOutput(w()),r.enterRawMode(c=>{if(c==="\r"||c===`
`){r.writeOutput(`\r
`);const p=(l+u).trim();if(!l&&p.startsWith(".")){const{output:f,quit:q}=O(e,p);if(f&&r.writeOutput(f.replace(/\n/g,`\r
`)),q){h(e,t,o).then(()=>{e.close(),r.exitRawMode(),i(0)});return}u="",r.writeOutput(w());return}if(p&&!p.endsWith(";")&&p.toUpperCase()!=="BEGIN"&&p.toUpperCase()!=="END"){l=(l?l+" ":"")+u,u="",r.writeOutput(w());return}const g=l?l+" "+u:u;if(l="",u="",g.trim())try{const f=e.exec(g),q=E(f);q&&r.writeOutput(q.replace(/\n/g,`\r
`)),h(e,t,o).catch(()=>{})}catch(f){r.writeOutput(`Error: ${f.message}\r
`)}r.writeOutput(w())}else c===""||c==="\b"?u.length>0&&(u=u.slice(0,-1),r.writeOutput("\b \b")):c===""?(r.writeOutput(`^C\r
`),u="",l="",r.writeOutput(w())):c===""?(r.writeOutput(`\r
`),h(e,t,o).then(()=>{e.close(),r.exitRawMode(),i(0)})):c.charCodeAt(0)>=32&&(u+=c,r.writeOutput(c))})})}};(globalThis.__tabcomputerLive??=new Map).set("src/commands/sqlite.ts",L);(globalThis.__tabcomputerLiveState??=new Map).set("src/commands/sqlite.ts",{get SQL(){return d},set SQL(t){d=t},get loadPromise(){return m},set loadPromise(t){m=t}});export{R as sqlite3Cmd};
