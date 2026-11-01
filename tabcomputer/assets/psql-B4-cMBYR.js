import{cg as le,ad as ce,ch as ue,i as de,ci as F,aB as pe}from"./index-3dop0BuN.js";import{F as fe,s as he,p as ge,c as B,q as me,m as R,i as q,b as I,P as A,d as x,f as J,g as Ee,h as we,j as K,k as $}from"./service-DVh5qVy_.js";const be=Object.freeze(Object.defineProperty({__proto__:null,get PgClient(){return D},get PgError(){return w}},Symbol.toStringTag,{value:"Module"})),ye=Object.freeze(Object.defineProperty({__proto__:null,get defaultFormat(){return z},get formatTable(){return C}},Symbol.toStringTag,{value:"Module"})),Se=Object.freeze(Object.defineProperty({__proto__:null,get createdbCmd(){return se},get dropdbCmd(){return re},get pgDumpCmd(){return ne},get pgIsreadyCmd(){return ae},get postgresCommands(){return He},get postgresFor(){return v},get postgresUnit(){return ie},get psqlCmd(){return ee},get serviceCmd(){return oe}},Symbol.toStringTag,{value:"Module"}));class w extends Error{constructor(e,r={}){super(e),this.fields=r}}class D{constructor(e,r){this.sock=e,this.options=r}params={};status="I";frames=new fe;buf=new Uint8Array(65536);closed=!1;static async connect(e){const{stack:r,host:s,port:o}=e,a=`connection to server at "${s}", port ${o} failed`,n=r.socket(s.includes(":")?le:ce,1);if(!(n instanceof ue))throw new w(`${a}: no socket`);const d=await n.connectHost(s,o);if(d<0)throw n.close(),new w(`${a}: ${d===-111?"Connection refused":d===-101?"Network is unreachable":`errno ${-d}`}
	Is the server running on that host and accepting TCP/IP connections?`);const l=new D(n,e);await l.write(he({user:e.user,database:e.database,application_name:e.appName??"psql",client_encoding:"UTF8"}));const c=await l.read(),i=c.results.find(u=>u.error)?.error;if(i)throw l.close(),new w(`${a}: ${i.S??"FATAL"}:  ${i.M??""}`,i);if(c.authRequest)throw l.close(),new w(`${a}: the server asks for a password, which the built-in psql does not send (apt install postgresql-client has a psql that does)`);if(!c.status)throw l.close(),new w(`${a}: server closed the connection unexpectedly`);return l}async write(e){for(let r=0;r<e.length;){const s=await this.sock.send(e.subarray(r));if(s<=0)throw new w("server closed the connection unexpectedly");r+=s}}async read(){const e=[];for(;;){let r=this.frames.next();for(;!r;){const o=await this.sock.recv(this.buf);if(o<=0)return this.closed=!0,this.take(e);this.frames.push(this.buf.slice(0,o)),r=this.frames.next()}e.push(r);const s=r[0];if(s===90||s===71)return this.take(e);if(s===82&&!(r[5]===0&&r[6]===0&&r[7]===0&&r[8]===0))return this.take(e)}}take(e){const r=ge(e.length?B(e):new Uint8Array(0));return Object.assign(this.params,r.params),r.status&&(this.status=r.status),r}async query(e,r){if(this.closed)throw new w("server closed the connection unexpectedly");await this.write(me(e));let s=await this.read();for(;s.copyIn&&!s.status;){const o=r?await r():null;o===null?await this.write(R("f","no data was given\0")):await this.write(B([...o.length?[R("d",o)]:[],R("c")]));const a=await this.read();s={...a,results:[...s.results,...a.results],notices:[...s.notices,...a.notices],copyIn:a.copyIn}}if(!s.status&&this.closed&&!s.results.find(a=>a.error)?.error)throw new w("server closed the connection unexpectedly");return s}get open(){return!this.closed}close(){this.closed||(this.closed=!0,this.sock.send(R("X")).catch(()=>{}),this.sock.close())}}(globalThis.__tabcomputerLive??=new Map).set("src/postgres/client.ts",be);const z=()=>({format:"aligned",expanded:!1,tuplesOnly:!1,fieldSep:"|",nullText:""}),Ne=new Set([20,21,23,26,28,700,701,790,1700]),N=t=>[...t].length,V=(t,e,r=!1)=>r?" ".repeat(Math.max(0,e-N(t)))+t:t+" ".repeat(Math.max(0,e-N(t)));function U(t){return`(${t} row${t===1?"":"s"})`}function j(t){return/[",\n\r]/.test(t)?'"'+t.replace(/"/g,'""')+'"':t}function C(t,e){const r=c=>c??e.nullText;if(e.format==="csv"){let c=e.tuplesOnly?"":t.columns.map(i=>j(i.name)).join(",")+`
`;for(const i of t.rows)c+=i.map(u=>j(r(u))).join(",")+`
`;return c}if(e.expanded)return Te(t,e);if(e.format==="unaligned"){let c="";e.tuplesOnly||(t.title&&(c+=t.title+`
`),c+=t.columns.map(i=>i.name).join(e.fieldSep)+`
`);for(const i of t.rows)c+=i.map(r).join(e.fieldSep)+`
`;return e.tuplesOnly||(c+=t.footers?t.footers.join(`
`)+(t.footers.length?`
`:""):U(t.rows.length)+`
`),c}const s=t.columns.length,o=t.columns.map(c=>Ne.has(c.typeOid)),a=t.rows.map(c=>c.map(i=>r(i).split(`
`))),n=t.columns.map((c,i)=>Math.max(...c.name.split(`
`).map(N),...a.map(u=>Math.max(0,...u[i].map(N)))));let d="";const l=n.reduce((c,i)=>c+i+2,0)+Math.max(0,s-1);e.tuplesOnly||(t.title&&(d+=" ".repeat(Math.max(0,Math.floor((l-N(t.title))/2)))+t.title+`
`),d+=t.columns.map((c,i)=>{const u=Math.floor((n[i]-N(c.name))/2);return" "+" ".repeat(u)+c.name+" ".repeat(n[i]-N(c.name)-u)+" "}).join("|")+`
`,d+=n.map(c=>"-".repeat(c+2)).join("+")+`
`);for(const c of a){const i=Math.max(1,...c.map(u=>u.length));for(let u=0;u<i;u++){let p="";for(let f=0;f<s;f++){const h=c[f][u]??"",b=u+1<c[f].length,y=f===s-1;let m=V(h,n[f],o[f]&&c[f].length===1);y&&!b&&!o[f]&&(m=h),p+=" "+m+(b?"+":y?"":" ")+(y?"":"|")}d+=p+`
`}}return e.tuplesOnly||(d+=t.footers?t.footers.join(`
`)+(t.footers.length?`
`:""):U(t.rows.length)+`
`),d+`
`}function Te(t,e){const r=d=>d??e.nullText;if(!t.rows.length)return e.tuplesOnly?"":`(0 rows)

`;const s=t.columns.map(d=>d.name);if(e.format==="unaligned")return t.rows.map(d=>d.map((l,c)=>`${s[c]}${e.fieldSep}${r(l)}`).join(`
`)).join(`

`)+`
`;const o=Math.max(...s.map(N)),a=Math.max(...t.rows.flatMap(d=>d.flatMap(l=>r(l).split(`
`).map(N))));let n=t.title&&!e.tuplesOnly?t.title+`
`:"";return t.rows.forEach((d,l)=>{if(e.tuplesOnly)l>0&&(n+=`
`);else{const c=`-[ RECORD ${l+1} ]`,i=o+3+a;n+=(c.length<=o+1?c+"-".repeat(o+1-c.length)+"+"+"-".repeat(a+1):c+"-".repeat(Math.max(0,i-c.length)))+`
`}d.forEach((c,i)=>{r(c).split(`
`).forEach((p,f)=>{n+=`${V(f===0?s[i]:"",o)} | ${p}
`})})}),n+`
`}(globalThis.__tabcomputerLive??=new Map).set("src/postgres/psql-format.ts",ye);function v(t){const e=de();F(e)||pe(e);const r=F(e);return(!r.onDemand.has(x)||!J())&&Ee({fs:t.fs,stack:r,kernel:e}),{stack:r,service:we({fs:t.fs,stack:r,kernel:e})}}const X=/^(localhost|127\.0\.0\.1|::1|)$/;function k(t){const e=t.PGUSER||t.USER||"user";return{host:t.PGHOST&&!t.PGHOST.startsWith("/")?t.PGHOST:"localhost",port:parseInt(t.PGPORT||"",10)||x,user:e,database:t.PGDATABASE||e,databaseGiven:!!t.PGDATABASE}}function L(t,e){if(/^postgres(ql)?:\/\//.test(t)){try{const r=new URL(t.replace(/^postgres(ql)?:/,"http:"));r.hostname&&(e.host=decodeURIComponent(r.hostname)),r.port&&(e.port=parseInt(r.port,10)),r.username&&(e.user=decodeURIComponent(r.username));const s=decodeURIComponent(r.pathname.replace(/^\//,""));s?e.database=s:r.username&&(e.database=e.user);for(const[o,a]of r.searchParams)G(o,a,e)}catch{return!1}return!0}if(!t.includes("="))return!1;for(const r of t.matchAll(/(\w+)\s*=\s*('(?:[^'\\]|\\.)*'|\S*)/g))G(r[1],r[2].replace(/^'|'$/g,""),e);return!0}function G(t,e,r){t==="host"&&!e.startsWith("/")?r.host=e:t==="port"?r.port=parseInt(e,10)||r.port:t==="user"?r.user=e:t==="dbname"&&(r.database=e)}async function Z(t,e,r){e.status==="running"||!t.terminal||t.stderrIsTTY===!1||await t.fs.exists(`${K}/PG_VERSION`)||t.terminal.writeOutput(`${r}: starting PostgreSQL ${A} for the first time (a 4 MB download, then a new database cluster)\r
`)}async function M(t,e,r){const{stack:s,service:o}=v(t);X.test(e.host)&&e.port===o.port&&await Z(t,o,r);const a=await D.connect({stack:s,host:e.host||"localhost",port:e.port,user:e.user,database:e.database,appName:r});if(o.info?.fresh&&!H){H=!0;const n=await _e();n.length&&(t.stderr+=`${r}: this is a new PostgreSQL server; the databases the earlier built-in psql kept (${n.join(", ")}) are not in it.
`)}return a}let H=!1;async function _e(){try{return(await globalThis.indexedDB?.databases?.()??[]).map(e=>/^\/pglite\/shiro-pg-(.+)$/.exec(e.name??"")?.[1]).filter(e=>!!e)}catch{return[]}}const $e=`psql is the PostgreSQL interactive terminal (the tab's built-in one).

Usage:
  psql [OPTION]... [DBNAME [USERNAME]]

  -c, --command=COMMAND    run only single command (SQL or internal) and exit
  -d, --dbname=DBNAME      database name to connect to
  -f, --file=FILENAME      execute commands from file, then exit
  -l, --list               list available databases, then exit
  -v, --set=NAME=VALUE     set a variable (ON_ERROR_STOP=1 stops a script at an error)
  -1, --single-transaction execute as a single transaction
  -q, --quiet              run quietly (no messages, only query output)
  -A, --no-align           unaligned table output mode
      --csv                CSV (Comma-Separated Values) table output mode
  -F, --field-separator=STRING   field separator for unaligned output (default: "|")
  -t, --tuples-only        print rows only
  -x, --expanded           turn on expanded table output
  -o, --output=FILENAME    send query results to file
  -h, --host=HOSTNAME      database server host (default: "localhost")
  -p, --port=PORT          database server port (default: "5432")
  -U, --username=USERNAME  database user name

At the prompt: \\l databases, \\dt tables, \\d NAME a table, \\du roles, \\c DBNAME connect,
\\i FILE run a file, \\copy, \\x, \\timing, \\conninfo, \\q quit.
The server is the tab's own PostgreSQL ${A}; it starts when something connects to localhost:${x}.
`,Ae=`General
  \\q                     quit psql
  \\c DBNAME [USER]       connect to another database
  \\conninfo              show the connection
  \\i FILE                run the commands in a file
  \\! [COMMAND]           run a shell command
  \\echo TEXT             print text
Informational
  \\l                     list databases
  \\d [NAME]              list tables, views and sequences, or describe one
  \\dt [PATTERN]          list tables      \\dv views   \\ds sequences   \\di indexes
  \\dn                    list schemas
  \\du                    list roles
Formatting
  \\x [on|off]            expanded output
  \\t [on|off]            rows only
  \\a                     aligned or unaligned output
  \\timing [on|off]       show how long each statement took
Copy
  \\copy TABLE FROM 'FILE' [OPTIONS]   load a file of the tab into a table
  \\copy TABLE TO 'FILE' [OPTIONS]     write a table (or "(SELECT ...)") to a file
`;class O extends Error{}function Oe(t,e){const r=k(e),s={target:{host:r.host,port:r.port,user:r.user,database:r.database},commands:[],files:[],list:!1,quiet:!1,single:!1,onErrorStop:!1,echoAll:!1,output:"",format:z()};let o=r.databaseGiven,a=!1;const n=[],d={command:"c",dbname:"d",file:"f",list:"l",set:"v",variable:"v","single-transaction":"1",quiet:"q","no-align":"A","field-separator":"F","tuples-only":"t",expanded:"x",output:"o",host:"h",port:"p",username:"U","no-psqlrc":"X","no-password":"w",password:"W","echo-all":"a","echo-queries":"e","echo-errors":"b","echo-hidden":"E",pset:"P","no-readline":"n"},l=new Set(["c","d","f","v","F","o","h","p","U","P","L","R","T"]);for(let c=0;c<t.length;c++){const i=t[c];let u="",p;if(i==="--"){n.push(...t.slice(c+1));break}if(i==="--help"||i==="-?")return"help";if(i==="--version"||i==="-V")return"version";if(i==="--csv"){s.format.format="csv";continue}if(i.startsWith("--")){const f=i.indexOf("="),h=f<0?i.slice(2):i.slice(2,f);if(u=d[h],!u)throw new O(`unrecognized option '${i}'`);f>=0&&(p=i.slice(f+1))}else if(i.startsWith("-")&&i.length>1)u=i[1],i.length>2&&(l.has(u)?p=i.slice(2):t.splice(c+1,0,"-"+i.slice(2)));else{n.push(i);continue}if(l.has(u)&&p===void 0){if(c+1>=t.length)throw new O(`option requires an argument -- '${u}'`);p=t[++c]}switch(u){case"c":s.commands.push(p);break;case"f":s.files.push(p);break;case"d":L(p,s.target)||(s.target.database=p),o=!0;break;case"U":s.target.user=p,a=!0;break;case"h":p.startsWith("/")||(s.target.host=p);break;case"p":s.target.port=parseInt(p,10)||s.target.port;break;case"l":s.list=!0;break;case"q":s.quiet=!0;break;case"1":s.single=!0;break;case"A":s.format.format="unaligned";break;case"t":s.format.tuplesOnly=!0;break;case"x":s.format.expanded=!0;break;case"F":s.format.fieldSep=p;break;case"o":s.output=p;break;case"a":s.echoAll=!0;break;case"v":/^ON_ERROR_STOP=(1|on|true)$/i.test(p)&&(s.onErrorStop=!0);break;case"P":{const[f,h=""]=p.split("=");f==="format"&&(h==="aligned"||h==="unaligned"||h==="csv")?s.format.format=h:f==="tuples_only"||f==="t"?s.format.tuplesOnly=h!=="off":f==="null"?s.format.nullText=h:f==="fieldsep"&&(s.format.fieldSep=h);break}case"X":case"w":case"W":case"e":case"b":case"E":case"n":case"L":case"R":case"T":break;default:throw new O(`invalid option -- '${u}'`)}}if(n[0]!==void 0&&(L(n[0],s.target)||(s.target.database=n[0]),o=!0),n[1]!==void 0&&(s.target.user=n[1],a=!0),n.length>2)throw new O(`extra command-line argument "${n[2]}" ignored`);return!o&&a&&(s.target.database=s.target.user),s.list&&!o&&(s.target.database="postgres"),s}function Y(t){let e=t.includes(".")?t.slice(t.lastIndexOf(".")+1):t;return/^".*"$/.test(e)?e=e.slice(1,-1).replace(/""/g,'"'):e=e.toLowerCase(),"^("+e.replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*/g,".*").replace(/\?/g,".")+")$"}const ve={t:"'r','p'",v:"'v'",m:"'m'",s:"'S'",i:"'i','I'",E:"'f'"};class Re{constructor(e,r,s,o,a){this.client=e,this.ctx=r,this.out=o,this.err=a,this.format=s.format,this.quiet=s.quiet,this.onErrorStop=s.onErrorStop}format;timing=!1;quiet;onErrorStop;where="";failed=!1;outText=null;get database(){return this.client.options.database}get superuser(){return this.client.params.is_superuser==="on"}print(e){this.outText?this.outText.push(e):this.out(e)}showError(e,r){let s=`${this.where}${e.S??"ERROR"}:  ${e.M??""}
`;const o=parseInt(e.P??"",10);if(o>0&&o<=r.length+1){const a=r.slice(0,o-1),n=a.split(`
`).length,d=a.lastIndexOf(`
`)+1,l=r.indexOf(`
`,d),c=r.slice(d,l<0?r.length:l),i=`LINE ${n}: `;s+=`${i}${c}
${" ".repeat(i.length+[...r.slice(d,o-1)].length)}^
`}e.D&&(s+=`DETAIL:  ${e.D}
`),e.H&&(s+=`HINT:  ${e.H}
`),this.err(s)}showReply(e,r){let s=!0;for(const o of e.notices)this.err(`${o.S??"NOTICE"}:  ${o.M??""}
${o.D?`DETAIL:  ${o.D}
`:""}${o.H?`HINT:  ${o.H}
`:""}`);for(const o of e.results){if(o.error){this.showError(o.error,r),s=!1;continue}if(o.copyOut){for(const a of o.copyOut)this.print(new TextDecoder().decode(a));continue}o.columns?this.print(C({columns:o.columns,rows:o.rows},this.format)):o.tag&&!this.quiet&&this.print(o.tag+`
`)}return s||(this.failed=!0),s}async run(e,r){const s=performance.now();let o;try{o=await this.client.query(e,r)}catch(n){return this.err(`${this.where}${n.message}
`),this.failed=!0,!1}const a=this.showReply(o,e);return this.client.open?(this.timing&&this.print(`Time: ${(performance.now()-s).toFixed(3)} ms
`),a):(this.err(`${this.where}server closed the connection unexpectedly
`),this.failed=!0,!1)}async ask(e){try{const s=(await this.client.query(e)).results[0];return!s||s.error?(s?.error&&this.showError(s.error,""),this.failed=!0,null):s}catch(r){return this.err(`${r.message}
`),this.failed=!0,null}}async table(e,r,s){const o=await this.ask(r);if(o?.columns){if(!o.rows.length&&s){this.err(s+`
`);return}this.print(C({title:e,columns:o.columns,rows:o.rows},this.format))}}async listRelations(e,r){const s=r?`AND c.relname OPERATOR(pg_catalog.~) ${I(Y(r))}`:"AND n.nspname <> 'pg_catalog' AND n.nspname !~ '^pg_toast' AND n.nspname <> 'information_schema'";await this.table("List of relations",`SELECT n.nspname AS "Schema", c.relname AS "Name",
  CASE c.relkind WHEN 'r' THEN 'table' WHEN 'v' THEN 'view' WHEN 'm' THEN 'materialized view' WHEN 'i' THEN 'index' WHEN 'S' THEN 'sequence' WHEN 'f' THEN 'foreign table' WHEN 'p' THEN 'partitioned table' WHEN 'I' THEN 'partitioned index' END AS "Type",
  pg_catalog.pg_get_userbyid(c.relowner) AS "Owner"
FROM pg_catalog.pg_class c LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
WHERE c.relkind IN (${e}) ${s} AND pg_catalog.pg_table_is_visible(c.oid)
ORDER BY 1, 2`,r?`Did not find any relation named "${r}".`:"Did not find any relations.")}async describe(e){const r=await this.ask(`SELECT c.oid, n.nspname, c.relname, c.relkind
FROM pg_catalog.pg_class c LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
WHERE c.relname OPERATOR(pg_catalog.~) ${I(Y(e))} AND pg_catalog.pg_table_is_visible(c.oid)
ORDER BY 2, 3`);if(r){if(!r.rows.length){this.err(`Did not find any relation named "${e}".
`);return}for(const[s,o,a,n]of r.rows){const d=`"${o}.${a}"`;if(n==="S"){await this.table(`Sequence ${d}`,`SELECT pg_catalog.format_type(seqtypid, NULL) AS "Type", seqstart AS "Start", seqmin AS "Minimum", seqmax AS "Maximum", seqincrement AS "Increment", CASE WHEN seqcycle THEN 'yes' ELSE 'no' END AS "Cycles?", seqcache AS "Cache" FROM pg_catalog.pg_sequence WHERE seqrelid = ${s}`);continue}const l=await this.ask(n==="i"||n==="I"?`SELECT a.attname AS "Column", pg_catalog.format_type(a.atttypid, a.atttypmod) AS "Type", CASE WHEN a.attnum <= (SELECT i.indnkeyatts FROM pg_catalog.pg_index i WHERE i.indexrelid = ${s}) THEN 'yes' ELSE 'no' END AS "Key?", pg_catalog.pg_get_indexdef(a.attrelid, a.attnum, TRUE) AS "Definition"
FROM pg_catalog.pg_attribute a WHERE a.attrelid = ${s} AND a.attnum > 0 AND NOT a.attisdropped ORDER BY a.attnum`:`SELECT a.attname AS "Column", pg_catalog.format_type(a.atttypid, a.atttypmod) AS "Type",
  (SELECT c.collname FROM pg_catalog.pg_collation c, pg_catalog.pg_type t WHERE c.oid = a.attcollation AND t.oid = a.atttypid AND a.attcollation <> t.typcollation) AS "Collation",
  CASE WHEN a.attnotnull THEN 'not null' END AS "Nullable",
  CASE WHEN a.attidentity = 'a' THEN 'generated always as identity' WHEN a.attidentity = 'd' THEN 'generated by default as identity'
       WHEN a.attgenerated <> '' THEN 'generated always as (' || pg_catalog.pg_get_expr(d.adbin, d.adrelid, true) || ')' || CASE a.attgenerated WHEN 's' THEN ' stored' ELSE '' END
       ELSE pg_catalog.pg_get_expr(d.adbin, d.adrelid, true) END AS "Default"
FROM pg_catalog.pg_attribute a LEFT JOIN pg_catalog.pg_attrdef d ON d.adrelid = a.attrelid AND d.adnum = a.attnum
WHERE a.attrelid = ${s} AND a.attnum > 0 AND NOT a.attisdropped ORDER BY a.attnum`);if(!l?.columns)return;const c=[],i=async(p,f)=>{const h=await this.ask(f);if(h?.rows.length){c.push(p);for(const b of h.rows)c.push("    "+b[0])}};if(n==="r"||n==="p"||n==="m")await i("Indexes:",`SELECT '"' || c2.relname || '"' ||
    CASE WHEN i.indisprimary THEN ' PRIMARY KEY,' WHEN i.indisunique THEN CASE WHEN con.contype = 'u' THEN ' UNIQUE CONSTRAINT,' ELSE ' UNIQUE,' END ELSE '' END ||
    ' ' || pg_catalog.regexp_replace(pg_catalog.pg_get_indexdef(i.indexrelid, 0, true), '^.*? USING ', '')
FROM pg_catalog.pg_index i JOIN pg_catalog.pg_class c2 ON c2.oid = i.indexrelid
  LEFT JOIN pg_catalog.pg_constraint con ON con.conrelid = i.indrelid AND con.conindid = i.indexrelid AND con.contype IN ('p', 'u', 'x')
WHERE i.indrelid = ${s} ORDER BY i.indisprimary DESC, c2.relname`),await i("Check constraints:",`SELECT '"' || conname || '" ' || pg_catalog.pg_get_constraintdef(oid, true) FROM pg_catalog.pg_constraint WHERE conrelid = ${s} AND contype = 'c' ORDER BY conname`),await i("Foreign-key constraints:",`SELECT '"' || conname || '" ' || pg_catalog.pg_get_constraintdef(oid, true) FROM pg_catalog.pg_constraint WHERE conrelid = ${s} AND contype = 'f' AND conparentid = 0 ORDER BY conname`),await i("Referenced by:",`SELECT 'TABLE "' || conrelid::pg_catalog.regclass || '" CONSTRAINT "' || conname || '" ' || pg_catalog.pg_get_constraintdef(oid, true) FROM pg_catalog.pg_constraint WHERE confrelid = ${s} AND contype = 'f' ORDER BY conname`);else if(n==="i"||n==="I"){const p=await this.ask(`SELECT CASE WHEN i.indisprimary THEN 'primary key, ' WHEN i.indisunique THEN 'unique, ' ELSE '' END || am.amname || ', for table "' || i.indrelid::pg_catalog.regclass || '"'
FROM pg_catalog.pg_index i JOIN pg_catalog.pg_class c ON c.oid = i.indexrelid JOIN pg_catalog.pg_am am ON am.oid = c.relam WHERE i.indexrelid = ${s}`);p?.rows[0]?.[0]&&c.push(p.rows[0][0])}const u=n==="v"?"View":n==="m"?"Materialized view":n==="i"||n==="I"?"Index":n==="f"?"Foreign table":n==="p"?"Partitioned table":"Table";this.print(C({title:`${u} ${d}`,columns:l.columns,rows:l.rows,footers:c},this.format))}}}async copy(e){const r=/^\s*(\(.*\)|"[^"]+"(?:\s*\([^)]*\))?|[^\s(]+(?:\s*\([^)]*\))?)\s+(from|to)\s+(?:'((?:[^']|'')*)'|(\S+))\s*([\s\S]*)$/i.exec(e);if(!r){this.err(`\\copy: write it as \\copy TABLE FROM 'FILE' [OPTIONS] or \\copy TABLE TO 'FILE' [OPTIONS]
`),this.failed=!0;return}const[,s,o,a,n,d]=r,l=a!==void 0?a.replace(/''/g,"'"):n,c=/^(stdin|stdout|pstdin|pstdout)$/i.test(l)&&a===void 0,i=c?"":this.ctx.fs.resolvePath(l,this.ctx.cwd);if(/^from$/i.test(o)){let u;try{u=c?new TextEncoder().encode(this.ctx.stdin??""):await this.ctx.fs.readFile(i)}catch{this.err(`${l}: No such file or directory
`),this.failed=!0;return}await this.run(`COPY ${s} FROM STDIN ${d}`,async()=>u);return}try{const p=(await this.client.query(`COPY ${s} TO STDOUT ${d}`)).results[0];if(!p||p.error){p?.error&&this.showError(p.error,""),this.failed=!0;return}const f=p.copyOut??[],h=new Uint8Array(f.reduce((y,m)=>y+m.length,0));let b=0;for(const y of f)h.set(y,b),b+=y.length;c?this.print(new TextDecoder().decode(h)):await this.ctx.fs.writeFile(i,h),this.quiet||this.print(p.tag+`
`)}catch(u){this.err(`${u.message}
`),this.failed=!0}}async reconnect(e,r){const s={...this.client.options},o={host:s.host,port:s.port,user:r&&r!=="-"?r:s.user,database:e&&e!=="-"?e:s.database};try{const a=await M(this.ctx,o,"psql");this.client.close(),this.client=a,this.quiet||this.print(`You are now connected to database "${o.database}" as user "${o.user}".
`)}catch(a){this.err(`${a.message}
Previous connection kept
`),this.failed=!0}}async meta(e){const r=/^\\(\S*)\s*([\s\S]*)$/.exec(e.trim());if(!r)return;const s=r[1].replace(/;$/,""),o=r[2].trim().replace(/;$/,""),a=o.match(/"[^"]*"|'[^']*'|\S+/g)?.map(d=>/^'.*'$/.test(d)?d.slice(1,-1):d)??[],n=d=>a[0]==="on"?!0:a[0]==="off"?!1:!d;switch(s){case"q":case"quit":return"quit";case"?":this.print(Ae);return;case"h":case"help":this.print(`SQL help is at https://www.postgresql.org/docs/current/sql-commands.html; \\? lists the backslash commands.
`);return;case"l":case"list":case"l+":await this.table("List of databases",`SELECT d.datname AS "Name", pg_catalog.pg_get_userbyid(d.datdba) AS "Owner", pg_catalog.pg_encoding_to_char(d.encoding) AS "Encoding",
  CASE d.datlocprovider WHEN 'b' THEN 'builtin' WHEN 'c' THEN 'libc' WHEN 'i' THEN 'icu' END AS "Locale Provider",
  d.datcollate AS "Collate", d.datctype AS "Ctype", d.datlocale AS "Locale", d.daticurules AS "ICU Rules",
  pg_catalog.array_to_string(d.datacl, E'\\n') AS "Access privileges"
FROM pg_catalog.pg_database d ORDER BY 1`);return;case"du":case"dg":await this.table("List of roles",`SELECT r.rolname AS "Role name", pg_catalog.array_to_string(pg_catalog.array_remove(ARRAY[
  CASE WHEN r.rolsuper THEN 'Superuser' END, CASE WHEN r.rolcreaterole THEN 'Create role' END, CASE WHEN r.rolcreatedb THEN 'Create DB' END,
  CASE WHEN NOT r.rolcanlogin THEN 'Cannot login' END, CASE WHEN r.rolreplication THEN 'Replication' END, CASE WHEN r.rolbypassrls THEN 'Bypass RLS' END], NULL), ', ') AS "Attributes"
FROM pg_catalog.pg_roles r WHERE r.rolname !~ '^pg_' ORDER BY 1`);return;case"dn":await this.table("List of schemas",`SELECT n.nspname AS "Name", pg_catalog.pg_get_userbyid(n.nspowner) AS "Owner" FROM pg_catalog.pg_namespace n WHERE n.nspname !~ '^pg_' AND n.nspname <> 'information_schema' ORDER BY 1`);return;case"d":case"d+":a[0]?await this.describe(a[0]):await this.listRelations("'r','p','v','m','S','f'","");return;case"dt":case"dv":case"dm":case"ds":case"di":case"dE":case"dt+":case"dv+":case"ds+":case"di+":await this.listRelations(ve[s[1]],a[0]??"");return;case"c":case"connect":await this.reconnect(a[0],a[1]);return;case"conninfo":this.print(`You are connected to database "${this.database}" as user "${this.client.options.user}" on host "${this.client.options.host}" at port "${this.client.options.port}".
`);return;case"x":this.format.expanded=n(this.format.expanded),this.quiet||this.print(`Expanded display is ${this.format.expanded?"on":"off"}.
`);return;case"t":this.format.tuplesOnly=n(this.format.tuplesOnly),this.quiet||this.print(`Tuples only is ${this.format.tuplesOnly?"on":"off"}.
`);return;case"a":this.format.format=this.format.format==="aligned"?"unaligned":"aligned",this.quiet||this.print(`Output format is ${this.format.format}.
`);return;case"timing":this.timing=n(this.timing),this.quiet||this.print(`Timing is ${this.timing?"on":"off"}.
`);return;case"echo":this.print(a.join(" ")+`
`);return;case"qecho":this.print(a.join(" ")+`
`);return;case"pset":case"set":case"unset":case"encoding":case"pager":s==="set"&&/^ON_ERROR_STOP$/i.test(a[0]??"")&&(this.onErrorStop=!/^(0|off|false)$/i.test(a[1]??"on"));return;case"i":case"include":case"ir":case"include_relative":{if(!a[0]){this.err(`\\${s}: missing required argument
`),this.failed=!0;return}const d=this.ctx.fs.resolvePath(a[0],this.ctx.cwd);let l;try{l=await this.ctx.fs.readFile(d,"utf8")}catch{this.err(`${a[0]}: No such file or directory
`),this.failed=!0;return}await this.script(l,a[0]);return}case"copy":await this.copy(o);return;case"!":{await this.ctx.shell.execute(o||"true",l=>this.print(l),l=>this.err(l))!==0&&(this.failed=!0);return}case"cd":a[0]&&(this.ctx.cwd=this.ctx.fs.resolvePath(a[0],this.ctx.cwd));return;case"g":case"gx":return;default:this.err(`invalid command \\${s}
Try \\? for help.
`),this.failed=!0}}async script(e,r=""){const s=e.split(`
`),o=this.where;let a="";for(let n=0;n<s.length;n++){const d=s[n].replace(/\r$/,"");r&&(this.where=`psql:${r}:${n+1}: `);const l=$(a);if(!l.open&&!l.restHasCode&&/^\s*\\/.test(d)){if(a="",await this.meta(d)==="quit")return this.where=o,"quit";if(this.failed&&this.onErrorStop)return this.where=o,!1;continue}a+=(a?`
`:"")+d;const c=$(a);if(c.statements.length){a=c.rest.replace(/^\s*\n/,"");for(const i of c.statements)if(!await this.run(i,async()=>{const p=[];for(;n+1<s.length;){const f=s[++n].replace(/\r$/,"");if(f==="\\.")break;p.push(f)}return new TextEncoder().encode(p.length?p.join(`
`)+`
`:"")})&&this.onErrorStop)return this.where=o,!1}}return $(a).restHasCode&&!await this.run(a.trim())&&this.onErrorStop?(this.where=o,!1):(this.where=o,!0)}}function Q(t,e){const r=$(e),s=e.trim()?r.open==="$"?"$":r.open==="*"?"*":r.open||"-":"=";return`${t.database}${s}${t.superuser?"#":">"} `}const qe={Enter:"\r",Backspace:"",Tab:"	",Escape:"\x1B",Delete:"\x1B[3~",Home:"\x1B[H",End:"\x1B[F",ArrowUp:"\x1B[A",ArrowDown:"\x1B[B",ArrowRight:"\x1B[C",ArrowLeft:"\x1B[D"};function Ce(t,e){const r=t.terminal,s=o=>r.writeOutput(o.replace(/\r?\n/g,`\r
`));return new Promise(o=>{let a="",n=0,d="",l=!1;const c=[],i=[];let u=0;const p=()=>s(Q(e,d)),f=()=>{r.writeOutput("\r\x1B[K"+Q(e,d)+a+(n<a.length?`\x1B[${a.length-n}D`:""))},h=m=>{r.exitRawMode(),e.client.close(),o(m)},b=async m=>{l=!0;try{m.trim()&&(i.push(m),u=i.length);const S=$(d);if(!S.open&&!S.restHasCode&&/^\s*\\/.test(m)){if(d="",await e.meta(m)==="quit"){h(0);return}}else if(!d.trim()&&/^\s*(quit|exit)\s*;?\s*$/i.test(m)){h(0);return}else if(!d.trim()&&/^\s*help\s*;?\s*$/i.test(m))s(`You are using psql, the command-line interface to PostgreSQL.
Type:  \\? for help with psql commands
       \\q to quit
`);else{d+=(d?`
`:"")+m;const g=$(d);if(g.statements.length){d=g.rest.trim();for(const E of g.statements)await e.run(E)}}}finally{l=!1}p();const T=c.shift();T!==void 0&&b(T)},y=()=>{r.writeOutput(`\r
`);const m=a;a="",n=0,l?c.push(m):b(m)};p(),r.enterRawMode(m=>{const T=qe[m]??(/^Ctrl\+[A-Z]$/.test(m)?String.fromCharCode(m.charCodeAt(5)-64):m);for(let S=0;S<T.length;S++){const g=T[S];if(g==="\x1B"){const E=/^\x1b(?:\[[0-9;]*[A-Za-z~]|O[A-Za-z])/.exec(T.slice(S))?.[0]??g;S+=E.length-1;const _=E[E.length-1];if(_==="A"||_==="B"){if(!i.length)continue;u=Math.max(0,Math.min(i.length,u+(_==="A"?-1:1))),a=i[u]??"",n=a.length,f()}else _==="C"?n<a.length&&(n++,r.writeOutput("\x1B[C")):_==="D"?n>0&&(n--,r.writeOutput("\x1B[D")):_==="H"?(n=0,f()):_==="F"?(n=a.length,f()):E==="\x1B[3~"&&n<a.length&&(a=a.slice(0,n)+a.slice(n+1),f());continue}if(g==="\r"||g===`
`){if(g===`
`&&T[S-1]==="\r")continue;y();continue}if(g===""||g==="\b")n>0&&(a=a.slice(0,n-1)+a.slice(n),n--,f());else if(g==="")r.writeOutput(`^C\r
`),a="",n=0,d="",l||p();else if(g===""){if(!a&&!l){r.writeOutput(`\\q\r
`),h(0);return}}else if(g==="")n=0,f();else if(g==="")n=a.length,f();else if(g==="")a=a.slice(n),n=0,f();else if(g==="\v")a=a.slice(0,n),f();else if(g===""){const E=a.slice(0,n).replace(/\S+\s*$/,"");a=E+a.slice(n),n=E.length,f()}else if(g==="\f")r.writeOutput("\x1B[2J\x1B[H"),f();else if(g>=" "||g==="	"){const E=g==="	"?" ":g;a=a.slice(0,n)+E+a.slice(n),n++,n===a.length?r.writeOutput(E):f()}}})})}function Le(t,e,r){return t.stderr+=`${e}: error: ${r?.message??r}
`,2}const ee={name:"psql",description:"PostgreSQL interactive terminal (the tab's own PostgreSQL starts on first use)",async exec(t){let e;try{e=Oe([...t.args],t.env)}catch(u){if(!(u instanceof O))throw u;return t.stderr+=`psql: ${u.message}
psql: hint: Try "psql --help" for more information.
`,2}if(e==="help")return t.stdout+=$e,0;if(e==="version")return t.stdout+=`psql (PostgreSQL) ${A} (tabcomputer)
`,0;const r=e.commands.length>0||e.files.length>0||e.list,s=!r&&(t.stdinIsTTY===!1||!t.terminal||!!t.stdin);let o;try{o=await M(t,e.target,"psql")}catch(u){if(!(u instanceof w))throw u;return Le(t,"psql",u)}const a=!r&&!s,n=a?u=>t.terminal.writeOutput(u.replace(/\r?\n/g,`\r
`)):u=>{t.stdout+=u},d=a?u=>t.terminal.writeOutput(u.replace(/\r?\n/g,`\r
`)):u=>{t.stderr+=u},l=new Re(o,t,e,n,d);e.output&&(l.outText=[]);const c=async()=>{e.output&&l.outText&&await t.fs.writeFile(t.fs.resolvePath(e.output,t.cwd),l.outText.join(""))};if(a){n(`psql (${o.params.server_version??A})
Type "help" for help.

`);const u=await Ce(t,l);return await c(),u}let i=!1;try{e.list&&await l.meta("\\l"),e.single&&await l.run("BEGIN");for(const u of e.commands){if(i)break;if(/^\s*\\/.test(u)){if(await l.meta(u)==="quit")break}else!await l.run(u)&&e.onErrorStop&&(i=!0);l.failed&&e.onErrorStop&&(i=!0)}for(const u of e.files){if(i)break;let p;if(u==="-")p=t.stdin??"";else try{p=await t.fs.readFile(t.fs.resolvePath(u,t.cwd),"utf8")}catch{return t.stderr+=`psql: error: ${u}: No such file or directory
`,o.close(),1}const f=await l.script(p,u==="-"?"":u);if(f===!1&&(i=!0),f==="quit")break}if(s){const u=t.stdin||(t.readStdin?await t.readStdin():"");await l.script(u)===!1&&(i=!0)}e.single&&await l.run(i?"ROLLBACK":"COMMIT")}finally{o.close(),await c()}return i?3:l.failed&&e.commands.length&&!e.files.length?1:0}};function W(t,e){const r=k(t.env),s={host:r.host,port:r.port,user:r.user,database:"postgres"},o=[],a=new Set,n=t.args;for(let d=0;d<n.length;d++){const l=n[d],c=(u,p)=>{if(l===p||l===u)return n[++d]??"";if(l.startsWith(u+"="))return l.slice(u.length+1);if(l.startsWith(p)&&l.length>2&&!l.startsWith("--"))return l.slice(2)};let i;if(l==="--help"||l==="-?")return t.stdout+=e,0;if((i=c("--host","-h"))!==void 0)i.startsWith("/")||(s.host=i);else if((i=c("--port","-p"))!==void 0)s.port=parseInt(i,10)||s.port;else if((i=c("--username","-U"))!==void 0)s.user=i;else if((i=c("--dbname","-d"))!==void 0)L(i,s)||a.add("dbname="+i);else if((i=c("--owner","-O"))!==void 0)a.add("owner="+i);else if((i=c("--template","-T"))!==void 0)a.add("template="+i);else if((i=c("--encoding","-E"))!==void 0)a.add("encoding="+i);else if((i=c("--timeout","-t"))!==void 0)a.add("timeout="+i);else if(l==="--if-exists")a.add("if-exists");else if(l==="-q"||l==="--quiet")a.add("quiet");else if(l==="-e"||l==="--echo")a.add("echo");else{if(l==="-w"||l==="-W"||l==="--no-password"||l==="--password"||l==="-f"||l==="--force"||l==="-i"||l==="--interactive")continue;if(l.startsWith("-"))return t.stderr+=`${e.split(" ")[1]}: invalid option ${l}
`,1;o.push(l)}}return{t:s,names:o,flags:a}}async function te(t,e,r,s,o){let a;try{a=await M(t,r,e)}catch(n){if(!(n instanceof w))throw n;return t.stderr+=`${e}: error: ${n.message}
`,1}try{o&&(t.stdout+=s+`;
`);const n=await a.query(s);for(const l of n.notices)t.stderr+=`${l.S??"NOTICE"}:  ${l.M??""}
`;const d=n.results.find(l=>l.error)?.error;return d?(t.stderr+=`${e}: error: ${e==="createdb"?"database creation":"database removal"} failed: ERROR:  ${d.M??""}
`,1):0}finally{a.close()}}const se={name:"createdb",description:"Create a PostgreSQL database",async exec(t){const e=W(t,`Usage: createdb [-O OWNER] [-T TEMPLATE] [-h HOST] [-p PORT] [-U USERNAME] [DBNAME]
`);if(typeof e=="number")return e;const r=e.names[0]??t.env.PGDATABASE??e.t.user,s=a=>[...e.flags].find(n=>n.startsWith(a+"="))?.slice(a.length+1);let o=`CREATE DATABASE ${q(r)}`;return s("owner")&&(o+=` OWNER ${q(s("owner"))}`),s("template")&&(o+=` TEMPLATE ${q(s("template"))}`),s("encoding")&&(o+=` ENCODING ${I(s("encoding"))}`),te(t,"createdb",e.t,o,e.flags.has("echo"))}},re={name:"dropdb",description:"Remove a PostgreSQL database",async exec(t){const e=W(t,`Usage: dropdb [--if-exists] [-h HOST] [-p PORT] [-U USERNAME] DBNAME
`);return typeof e=="number"?e:e.names[0]?te(t,"dropdb",e.t,`DROP DATABASE ${e.flags.has("if-exists")?"IF EXISTS ":""}${q(e.names[0])}`,e.flags.has("echo")):(t.stderr+=`dropdb: error: missing required argument database name
`,1)}},ae={name:"pg_isready",description:"Check whether a PostgreSQL server accepts connections",async exec(t){const e=W(t,`Usage: pg_isready [-h HOST] [-p PORT] [-U USERNAME] [-d DBNAME] [-q]
`);if(typeof e=="number")return e;const r=`${e.t.host}:${e.t.port}`,s=o=>{e.flags.has("quiet")||(t.stdout+=o)};try{return(await M(t,e.t,"pg_isready")).close(),s(`${r} - accepting connections
`),0}catch(o){if(!(o instanceof w))throw o;return o.fields.C&&o.fields.C!=="57P03"?(s(`${r} - accepting connections
`),0):(s(`${r} - no response
`),2)}}},ne={name:"pg_dump",description:"Write a PostgreSQL database as a script of SQL",async exec(t){const e=k(t.env),r={host:e.host,port:e.port,user:e.user,database:e.database},s=[];let o="",a=e.databaseGiven;const n=t.args;for(let c=0;c<n.length;c++){const i=n[c],u=(f,h)=>{if(i===h||i===f)return n[++c]??"";if(i.startsWith(f+"="))return i.slice(f.length+1);if(i.startsWith(h)&&i.length>2&&!i.startsWith("--"))return i.slice(2)};let p;if(i==="--help"||i==="-?")return t.stdout+=`Usage: pg_dump [-U USERNAME] [-f FILE] [-s | -a] [-t TABLE] [-n SCHEMA] [-c] [-C] [-O] [-x] [--if-exists] [DBNAME]
PostgreSQL's pg_dump, for the tab's own server. Rows are written as INSERT statements.
`,0;if(i==="--version"||i==="-V")return t.stdout+=`pg_dump (PostgreSQL) ${A} (tabcomputer)
`,0;if((p=u("--host","-h"))!==void 0)p.startsWith("/")||(r.host=p);else if((p=u("--port","-p"))!==void 0)r.port=parseInt(p,10)||r.port;else if((p=u("--username","-U"))!==void 0)r.user=p,a||(r.database=p);else if((p=u("--dbname","-d"))!==void 0)L(p,r)||(r.database=p),a=!0;else if((p=u("--file","-f"))!==void 0)o=p;else{if(i==="-w"||i==="-W"||i==="--no-password"||i==="--password")continue;if(i==="-j"||i==="--jobs"||i==="-F"||i==="--format"){const f=n[++c]??"";if((i==="-F"||i==="--format")&&!/^(p|plain)$/.test(f))return t.stderr+=`pg_dump: error: this pg_dump writes the plain format only (a script of SQL)
`,1}else i.startsWith("-")?(s.push(i),/^(-t|-T|-n|-N|-E|-S|--table|--exclude-table|--schema|--exclude-schema|--encoding|--superuser|--exclude-table-data|--extra-float-digits|--rows-per-insert|--section|--role)$/.test(i)&&c+1<n.length&&s.push(n[++c])):(r.database=i,a=!0)}}const{service:d}=v(t);if(!X.test(r.host)||r.port!==d.port)return t.stderr+=`pg_dump: error: this pg_dump reads the tab's own server only (localhost:${d.port}); apt install postgresql-client has one for other servers
`,1;await Z(t,d,"pg_dump");let l;try{l=await d.dump(r.user,r.database,s)}catch(c){return t.stderr+=`pg_dump: error: ${c?.message??c}
`,1}return l.error?(t.stderr+=`pg_dump: error: ${l.error.replace(/^pg_dump: (error: )?/,"").trim()}
`,1):(o?await t.fs.writeFile(t.fs.resolvePath(o,t.cwd),l.text):t.stdout+=l.text,0)}},P=/^postgres(ql)?(@.*)?(\.service)?$/;async function ie(t,e,r){if(!P.test(r))return null;const{service:s}=v(t),o=()=>s.running?`postgresql: active (running), PostgreSQL ${A} on 127.0.0.1:${s.port}, data in ${K}, ${s.clients} connection${s.clients===1?"":"s"}
`:`postgresql: inactive${s.error?` (${s.error})`:""}. It starts when something connects to localhost:${s.port}; psql does.
`;try{switch(e){case"start":return await s.start(),0;case"stop":return await s.stop(),0;case"restart":case"reload":case"force-reload":return await s.stop(),await s.start(),0;case"status":case"is-active":return t.stdout+=e==="is-active"?s.running?`active
`:`inactive
`:o(),s.running?0:3;case"enable":case"disable":return 0;default:return t.stderr+=`Usage: service postgresql {start|stop|restart|status}
`,1}}catch(a){return t.stderr+=`postgresql: did not start: ${a?.message??a}
`,1}}const oe={name:"service",description:"Start, stop or ask about a service (service postgresql status)",keepOverPackage:t=>P.test(t[0]??""),async exec(t){const[e,r=""]=t.args;if(!e||e==="--help"||e==="-h")return t.stdout+=`Usage: service NAME {start|stop|restart|status}
       service --status-all
`,e?0:1;const s=n=>"'"+n.replace(/'/g,"'\\''")+"'",o=n=>t.shell.execute(n,d=>{t.stdout+=d},d=>{t.stderr+=d});if(await t.fs.exists("/usr/sbin/service")&&await t.fs.exists(`/etc/init.d/${e}`))return P.test(e)&&/^(start|restart)$/.test(r)&&await J()?.stop(),o(`/usr/sbin/service ${t.args.map(s).join(" ")}`);if(e==="--status-all"){const{service:n}=v(t);return t.stdout+=` [ ${n.running?"+":"-"} ]  postgresql
`,0}const a=await ie(t,r,e);return a!==null?a:r?o(`systemctl ${s(r)} ${s(e)}`):(t.stderr+=`Usage: service NAME {start|stop|restart|status}
`,1)}},He=[ee,se,re,ae,ne,oe];(globalThis.__tabcomputerLive??=new Map).set("src/commands/psql.ts",Se);(globalThis.__tabcomputerLiveState??=new Map).set("src/commands/psql.ts",{get toldOfOld(){return H},set toldOfOld(t){H=t}});export{se as createdbCmd,re as dropdbCmd,ne as pgDumpCmd,ae as pgIsreadyCmd,He as postgresCommands,v as postgresFor,ie as postgresUnit,ee as psqlCmd,oe as serviceCmd};
