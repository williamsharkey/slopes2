const f=Object.freeze(Object.defineProperty({__proto__:null,get psqlCmd(){return E}},Symbol.toStringTag,{value:"Module"})),m="https://esm.sh/@electric-sql/pglite@0.3.15",u=new Map;let i=null,c=null;async function g(e){if(i)return i;if(c)return c;c=(async()=>{e.stdout+="Loading PostgreSQL (PGlite)... ";const t=await import(m);if(i=t.PGlite||t.default?.PGlite,!i)throw new Error("Failed to load PGlite");return e.stdout+=`done.
`,i})();try{return await c}catch(t){throw c=null,i=null,t}}async function h(e,t){if(u.has(t))return u.get(t);const o=t===":memory:"?void 0:`idb://shiro-pg-${t}`,r=new e({dataDir:o});return await r.waitReady,u.set(t,r),r}function b(e){if(!e||!e.rows||e.rows.length===0)return e?.affectedRows!==void 0&&e.affectedRows>0?`${e.affectedRows} row(s) affected
`:"";const t=e.rows,o=e.fields||[],r=o.length>0?o.map(n=>n.name):Object.keys(t[0]);if(r.length===0)return"";const a=r.map(n=>n.length);for(const n of t)for(let s=0;s<r.length;s++){const d=String(n[r[s]]??"NULL");a[s]=Math.max(a[s],d.length)}let l=" "+r.map((n,s)=>n.padEnd(a[s])).join(" | ")+`
`;l+="-"+a.map(n=>"-".repeat(n)).join("-+-")+`-
`;for(const n of t)l+=" "+r.map((s,d)=>String(n[s]??"NULL").padEnd(a[d])).join(" | ")+`
`;return l+=`(${t.length} row${t.length!==1?"s":""})
`,l}const E={name:"psql",description:"PostgreSQL database (PGlite)",async exec(e){const t=e.args;if(t.includes("--version")||t.includes("-V"))return e.stdout=`psql (PGlite 0.3.15) — PostgreSQL in WebAssembly
`,0;if(t.includes("--help")||t.includes("-h"))return e.stdout=["psql (tabcomputer) — PostgreSQL powered by PGlite","","Usage:",'  psql "SELECT 1+1;"                         Run a query (in-memory)','  psql mydb "SELECT version();"              Use named database (persistent)','  psql mydb "CREATE TABLE t(x int);"         Create table','  echo "SELECT 42;" | psql                   Pipe SQL',"  psql --list                                List databases","  psql --version                             Show version","","Databases persist in IndexedDB across page reloads.",""].join(`
`),0;if(t.includes("--list")||t.includes("-l")){const s=Array.from(u.keys());if(s.length===0)e.stdout=`No databases currently open.
`,e.stdout+=`Use: psql <dbname> "SQL..." to create one.
`;else{e.stdout=`Open databases:
`;for(const d of s)e.stdout+=`  ${d}
`}return 0}let o=":memory:",r="";if(t.length>=2?(o=t[0],r=t.slice(1).join(" ")):t.length===1&&(t[0].match(/^(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|BEGIN|COMMIT|ROLLBACK|WITH|EXPLAIN|TRUNCATE|GRANT|REVOKE|SET|SHOW|COPY|VACUUM|ANALYZE)/i)?r=t[0]:o=t[0]),!r&&e.stdin&&(r=e.stdin.trim()),!r)return e.stderr=`psql: no SQL provided
`,e.stderr+=`Usage: psql [dbname] "SQL statement"
`,1;let a;try{a=await g(e)}catch(s){return e.stderr=`psql: failed to load: ${s.message}
`,1}let l;try{l=await h(a,o)}catch(s){return e.stderr=`psql: failed to open database "${o}": ${s.message}
`,1}const n=r.split(/;\s*/).filter(s=>s.trim());try{for(const s of n){const d=await l.query(s),p=b(d);p&&(e.stdout+=p)}return 0}catch(s){return e.stderr=`ERROR: ${s.message}
`,1}}};(globalThis.__tabcomputerLive??=new Map).set("src/commands/postgres.ts",f);(globalThis.__tabcomputerLiveState??=new Map).set("src/commands/postgres.ts",{get PGliteClass(){return i},set PGliteClass(e){i=e},get loadPromise(){return c},set loadPromise(e){c=e},get dbCache(){return u}});export{E as psqlCmd};
