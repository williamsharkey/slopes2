const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./psql-B4-cMBYR.js","./index-3dop0BuN.js","./index-LZoznX6r.css","./service-DVh5qVy_.js"])))=>i.map(i=>d[i]);
import{a as l}from"./index-3dop0BuN.js";import{serviceManager as a}from"./service-manager-B8I_W__n.js";const v=Object.freeze(Object.defineProperty({__proto__:null,get systemctlCmd(){return f}},Symbol.toStringTag,{value:"Module"})),f={name:"systemctl",description:"Control the system service manager",async exec(e){const r=e.args.includes("--help")||e.args.includes("-h")?["--help"]:e.args.filter(s=>!s.startsWith("-"));if(r.length===0||r[0]==="--help"||r[0]==="-h")return e.stdout+=`Usage: systemctl <command> [service]
`,e.stdout+=`
Commands:
`,e.stdout+=`  start <service>     Start a service
`,e.stdout+=`  stop <service>      Stop a service
`,e.stdout+=`  restart <service>   Restart a service
`,e.stdout+=`  status [service]    Show service status
`,e.stdout+=`  list-units          List all services
`,e.stdout+=`  enable <service>    Enable a service (no-op)
`,e.stdout+=`  disable <service>   Disable a service (no-op)
`,r[0]==="--help"||r[0]==="-h"?0:1;a.bind(e.fs,e.shell);const i=r[0],t=r[1]?.replace(/\.service$/,"");if(t&&/^postgres(ql)?(@.*)?$/.test(t)){const s=await(await l(async()=>{const{postgresUnit:o}=await import("./psql-B4-cMBYR.js");return{postgresUnit:o}},__vite__mapDeps([0,1,2,3]),import.meta.url)).postgresUnit(e,i,t);if(s!==null)return s}switch(i){case"start":return t?await a.start(t)?0:(e.stderr+=`Failed to start ${t}.service
`,1):(e.stderr+=`systemctl: missing service name
`,1);case"stop":return t?a.stop(t)?0:(e.stderr+=`Failed to stop ${t}.service
`,1):(e.stderr+=`systemctl: missing service name
`,1);case"restart":return t?await a.restart(t)?0:(e.stderr+=`Failed to restart ${t}.service
`,1):(e.stderr+=`systemctl: missing service name
`,1);case"status":{if(t){const s=a.getStatus(t);if(!s)return e.stderr+=`Unit ${t}.service could not be found.
`,4;const o=s.status==="active"?p(Date.now()-s.startTime):"n/a";e.stdout+=`● ${t}.service - ${s.config.description||t}
`,e.stdout+=`   Loaded: loaded (/etc/services/${t}.conf)
`,e.stdout+=`   Active: ${g(s.status)} since ${new Date(s.startTime).toLocaleString()}
`,e.stdout+=`  Process: ${s.pid}
`,e.stdout+=`   Uptime: ${o}
`,e.stdout+=` Restarts: ${s.restarts}
`;const c=a.getLogs(t,5);if(c.length>0){e.stdout+=`
Recent logs:
`;for(const u of c){const m=new Date(u.timestamp).toLocaleTimeString();e.stdout+=`  ${m} ${u.message}
`}}return s.status==="active"?0:3}return d(e)}case"list-units":return d(e);case"enable":case"disable":return t?(e.stdout+=`${i==="enable"?"Created":"Removed"} symlink for ${t}.service
`,0):(e.stderr+=`systemctl: missing service name
`,1);case"preset":case"preset-all":case"daemon-reload":case"daemon-reexec":case"mask":case"unmask":case"reenable":case"try-restart":case"reload-or-restart":return 0;case"is-enabled":return!e.args.includes("--quiet")&&!e.args.includes("-q")&&(e.stdout+=`disabled
`),1;case"is-active":{const s=!!t&&a.getStatus(t)?.status==="active";return!e.args.includes("--quiet")&&!e.args.includes("-q")&&(e.stdout+=s?`active
`:`inactive
`),s?0:3}default:return e.stderr+=`systemctl: unknown command '${i}'
`,1}}};function d(e){const n=a.listUnits();if(n.length===0)return e.stdout+=`No services registered.
`,0;e.stdout+=`UNIT                          LOAD   ACTIVE   SUB     DESCRIPTION
`;for(const r of n){const i=(r.config.name+".service").padEnd(30),t="loaded".padEnd(7),s=r.status.padEnd(9),o=(r.status==="active"?"running":r.status==="failed"?"failed":"dead").padEnd(8),c=r.config.description||r.config.name;e.stdout+=`${i}${t}${s}${o}${c}
`}return e.stdout+=`
${n.length} loaded units listed.
`,0}function g(e){switch(e){case"active":return"active (running)";case"inactive":return"inactive (dead)";case"failed":return"failed";case"activating":return"activating";default:return e}}function p(e){const n=Math.floor(e/1e3);if(n<60)return`${n}s`;const r=Math.floor(n/60);return r<60?`${r}min ${n%60}s`:`${Math.floor(r/60)}h ${r%60}min`}(globalThis.__tabcomputerLive??=new Map).set("src/commands/systemctl.ts",v);(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/commands/psql.ts",()=>l(()=>import("./psql-B4-cMBYR.js"),__vite__mapDeps([0,1,2,3]),import.meta.url));export{f as systemctlCmd};
