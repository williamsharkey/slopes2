import{ap as o,aq as w,ar as b,as as _,at as M,au as O,av as T}from"./index-C6zxlZK4.js";const E=Object.freeze(Object.defineProperty({__proto__:null,get dmesgCmd(){return N},get formatRecord(){return S}},Symbol.toStringTag,{value:"Module"})),L=`Usage:
 dmesg [options]

Display or control the kernel ring buffer.

Options:
 -C, --clear                 clear the kernel ring buffer
 -c, --read-clear            read and clear all messages
 -f, --facility <list>       restrict output to defined facilities
 -k, --kernel                display kernel messages
 -l, --level <list>          restrict output to defined levels
 -r, --raw                   print the raw message buffer
 -T, --ctime                 show human-readable timestamp
 -t, --notime                don't show any timestamp with messages
 -u, --userspace             display userspace messages
 -w, --follow                wait for new messages
 -W, --follow-new            wait and print only new messages
 -x, --decode                decode facility and level to readable string
 -h, --help                  display this help
`,A=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],C=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];function D(t){const e=new Date(t),s=r=>String(r).padStart(2,"0");return`${A[e.getDay()]} ${C[e.getMonth()]} ${String(e.getDate()).padStart(2)} ${s(e.getHours())}:${s(e.getMinutes())}:${s(e.getSeconds())} ${e.getFullYear()}`}function k(t,e,s){if(!t)return`dmesg: option requires an argument -- '${s}'`;const r=new Set;for(const c of t.split(",")){const d=e.indexOf(c.trim().toLowerCase());if(d<0)return`dmesg: unknown ${s==="l"?"level":"facility"} '${c}'`;r.add(d)}return r}function S(t,e){let s="";e.raw?s=`<${t.facility*8+t.level}>`:e.decode&&(s=`${(w[t.facility]??String(t.facility)).padEnd(6)}:${(b[t.level]??"").padEnd(6)}: `);const r=e.notime?"":e.ctime&&!e.raw?`[${D(_+t.usec/1e3)}] `:`${M(t.usec)} `;return`${s}${r}${t.text}
`}const N={name:"dmesg",description:"Print or control the kernel ring buffer",async exec(t){const e={ctime:!1,notime:!1,raw:!1,decode:!1,levels:null,facilities:null};let s=!1,r=!1,c=!1,d=!1;const m=t.args;for(let a=0;a<m.length;a++){const l=m[a],$=/^-[A-Za-z]{2,}$/.test(l)?[...l.slice(1)].map(i=>"-"+i):[l];for(const i of $)switch(i){case"-C":case"--clear":s=!0;break;case"-c":case"--read-clear":r=!0;break;case"-T":case"--ctime":e.ctime=!0;break;case"-t":case"--notime":e.notime=!0;break;case"-r":case"--raw":e.raw=!0;break;case"-x":case"--decode":e.decode=!0;break;case"-k":case"--kernel":e.facilities=new Set([T]);break;case"-u":case"--userspace":e.facilities=new Set([O]);break;case"-w":case"--follow":c=!0;break;case"-W":case"--follow-new":c=d=!0;break;case"-l":case"--level":case"-f":case"--facility":{const n=i==="-l"||i==="--level",f=k(m[++a],n?b:w,n?"l":"f");if(typeof f=="string")return t.stderr+=f+`
`,1;n?e.levels=f:e.facilities=f;break}case"-h":case"--help":return t.stdout+=L,0;default:if(/^--(level|facility)=/.test(i)){const[n,f]=i.slice(2).split("="),u=k(f,n==="level"?b:w,n==="level"?"l":"f");if(typeof u=="string")return t.stderr+=u+`
`,1;n==="level"?e.levels=u:e.facilities=u;break}return t.stderr+=`dmesg: invalid option -- '${i.replace(/^-+/,"")}'
Try 'dmesg --help' for more information.
`,1}}if((s||r)&&t.shell.uid!==0)return t.stderr+=`dmesg: klogctl failed: Operation not permitted
`,1;if(s)return o.clear(),0;const y=a=>(!e.levels||e.levels.has(a.level))&&(!e.facilities||e.facilities.has(a.facility)),v=a=>a.filter(y).map(l=>S(l,e)).join("");let p=o.lastSeq;if(d||(t.stdout+=v(o.all()),r&&o.clear()),!c)return 0;const g=t.streamStdout??(t.terminal?a=>t.terminal.writeOutput(a.replace(/\n/g,`\r
`)):null);if(!g)return 0;t.stdout&&(g(t.stdout),t.stdout="");const h=t.shell?.abortController?.signal;for(;!h?.aborted&&await o.waitFor(p,h);){const a=o.since(p);p=o.lastSeq;const l=v(a);l&&g(l)}return 130}};(globalThis.__tabcomputerLive??=new Map).set("src/commands/dmesg.ts",E);export{N as dmesgCmd,S as formatRecord};
