import{serviceManager as a}from"./service-manager-B8I_W__n.js";const m=Object.freeze(Object.defineProperty({__proto__:null,get systemctlCmd(){return v}},Symbol.toStringTag,{value:"Module"})),v={name:"systemctl",description:"Control the system service manager",async exec(e){const t=e.args.includes("--help")||e.args.includes("-h")?["--help"]:e.args.filter(r=>!r.startsWith("-"));if(t.length===0||t[0]==="--help"||t[0]==="-h")return e.stdout+=`Usage: systemctl <command> [service]
`,e.stdout+=`
Commands:
`,e.stdout+=`  start <service>     Start a service
`,e.stdout+=`  stop <service>      Stop a service
`,e.stdout+=`  restart <service>   Restart a service
`,e.stdout+=`  status [service]    Show service status
`,e.stdout+=`  list-units          List all services
`,e.stdout+=`  enable <service>    Enable a service (no-op)
`,e.stdout+=`  disable <service>   Disable a service (no-op)
`,t[0]==="--help"||t[0]==="-h"?0:1;a.bind(e.fs,e.shell);const i=t[0],s=t[1]?.replace(/\.service$/,"");switch(i){case"start":return s?await a.start(s)?0:(e.stderr+=`Failed to start ${s}.service
`,1):(e.stderr+=`systemctl: missing service name
`,1);case"stop":return s?a.stop(s)?0:(e.stderr+=`Failed to stop ${s}.service
`,1):(e.stderr+=`systemctl: missing service name
`,1);case"restart":return s?await a.restart(s)?0:(e.stderr+=`Failed to restart ${s}.service
`,1):(e.stderr+=`systemctl: missing service name
`,1);case"status":{if(s){const r=a.getStatus(s);if(!r)return e.stderr+=`Unit ${s}.service could not be found.
`,4;const c=r.status==="active"?g(Date.now()-r.startTime):"n/a";e.stdout+=`● ${s}.service - ${r.config.description||s}
`,e.stdout+=`   Loaded: loaded (/etc/services/${s}.conf)
`,e.stdout+=`   Active: ${f(r.status)} since ${new Date(r.startTime).toLocaleString()}
`,e.stdout+=`  Process: ${r.pid}
`,e.stdout+=`   Uptime: ${c}
`,e.stdout+=` Restarts: ${r.restarts}
`;const o=a.getLogs(s,5);if(o.length>0){e.stdout+=`
Recent logs:
`;for(const d of o){const l=new Date(d.timestamp).toLocaleTimeString();e.stdout+=`  ${l} ${d.message}
`}}return r.status==="active"?0:3}return u(e)}case"list-units":return u(e);case"enable":case"disable":return s?(e.stdout+=`${i==="enable"?"Created":"Removed"} symlink for ${s}.service
`,0):(e.stderr+=`systemctl: missing service name
`,1);case"preset":case"preset-all":case"daemon-reload":case"daemon-reexec":case"mask":case"unmask":case"reenable":case"try-restart":case"reload-or-restart":return 0;case"is-enabled":return!e.args.includes("--quiet")&&!e.args.includes("-q")&&(e.stdout+=`disabled
`),1;case"is-active":{const r=!!s&&a.getStatus(s)?.status==="active";return!e.args.includes("--quiet")&&!e.args.includes("-q")&&(e.stdout+=r?`active
`:`inactive
`),r?0:3}default:return e.stderr+=`systemctl: unknown command '${i}'
`,1}}};function u(e){const n=a.listUnits();if(n.length===0)return e.stdout+=`No services registered.
`,0;e.stdout+=`UNIT                          LOAD   ACTIVE   SUB     DESCRIPTION
`;for(const t of n){const i=(t.config.name+".service").padEnd(30),s="loaded".padEnd(7),r=t.status.padEnd(9),c=(t.status==="active"?"running":t.status==="failed"?"failed":"dead").padEnd(8),o=t.config.description||t.config.name;e.stdout+=`${i}${s}${r}${c}${o}
`}return e.stdout+=`
${n.length} loaded units listed.
`,0}function f(e){switch(e){case"active":return"active (running)";case"inactive":return"inactive (dead)";case"failed":return"failed";case"activating":return"activating";default:return e}}function g(e){const n=Math.floor(e/1e3);if(n<60)return`${n}s`;const t=Math.floor(n/60);return t<60?`${t}min ${n%60}s`:`${Math.floor(t/60)}h ${t%60}min`}(globalThis.__tabcomputerLive??=new Map).set("src/commands/systemctl.ts",m);export{v as systemctlCmd};
