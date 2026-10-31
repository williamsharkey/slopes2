import{serviceManager as a}from"./service-manager-B8I_W__n.js";import{ao as m}from"./index-C6zxlZK4.js";const b=Object.freeze(Object.defineProperty({__proto__:null,get crontabCmd(){return w},get journalctlCmd(){return v}},Symbol.toStringTag,{value:"Module"})),w={name:"crontab",description:"Maintain crontab files",async exec(t){a.bind(t.fs,t.shell);const e=t.args;if(e.length===0||e[0]==="--help"||e[0]==="-h")return t.stdout+=`Usage: crontab [-l | -e | -r] [file]
`,t.stdout+=`
Options:
`,t.stdout+=`  -l    List current crontab
`,t.stdout+=`  -e    Edit crontab (loads from file or stdin)
`,t.stdout+=`  -r    Remove crontab
`,t.stdout+=`  file  Install crontab from file
`,e[0]==="--help"||e[0]==="-h"?0:1;if(e[0]==="-l"){const i=await a.loadCrontab();if(i.length===0)return t.stderr+=`no crontab for user
`,1;for(const o of i)t.stdout+=o.raw+`
`;return 0}if(e[0]==="-r"){try{await t.fs.unlink("/var/spool/cron/crontabs/user")}catch{}return a.stopCronDaemon(),t.stdout+=`crontab removed
`,0}if(e[0]==="-e")return t.stderr+=`crontab: interactive editing not supported
`,t.stderr+=`Use: crontab <file> to install from file
`,t.stderr+=`Or:  echo "* * * * * command" | crontab -
`,1;let n;if(e[0]==="-")n=t.stdin||"";else{const i=e[0].startsWith("/")?e[0]:t.shell.cwd+"/"+e[0];try{const o=await t.fs.readFile(i,"utf8");n=typeof o=="string"?o:new TextDecoder().decode(o)}catch{return t.stderr+=`crontab: cannot open '${e[0]}': No such file
`,1}}await a.saveCrontab(n);const r=a.getCrontab();return t.stdout+=`crontab: installing new crontab (${r.length} entries)
`,r.length>0&&!a.isCronRunning()&&a.startCronDaemon(),0}},v={name:"journalctl",description:"Query the journal",async exec(t){a.bind(t.fs,t.shell);const e=t.args;if(e[0]==="--help"||e[0]==="-h")return t.stdout+=`Usage: journalctl [-u unit] [-n lines] [-f] [--no-pager]
`,t.stdout+=`
Options:
`,t.stdout+=`  -u <unit>   Show logs for a specific unit
`,t.stdout+=`  -n <lines>  Number of recent entries to show (default: 10)
`,t.stdout+=`  -f          Follow log output (poll every 2s)
`,t.stdout+=`  --no-pager  Do not pipe through pager
`,0;let n,r=10,i=!1;for(let s=0;s<e.length;s++)switch(e[s]){case"-u":n=e[++s]?.replace(/\.service$/,"");break;case"-n":r=parseInt(e[++s],10)||10;break;case"-f":i=!0;break;case"--no-pager":break;default:e[s].startsWith("-")||(n=e[s].replace(/\.service$/,""));break}if(i)return y(t,n,r);const o=a.getLogs(n,r);if(o.length===0)return t.stdout+=`-- No entries --
`,0;for(const s of o)t.stdout+=c(s)+`
`;return 0}};function c(t){const e=new Date(t.timestamp),n=e.toLocaleString("en",{month:"short"}),r=String(e.getDate()).padStart(2,"0"),i=e.toLocaleTimeString("en",{hour12:!1}),o=t.priority==="error"?"[ERROR]":t.priority==="warn"?"[WARN]":"";return`${n} ${r} ${i} ${m().hostname} ${t.unit}: ${o}${o?" ":""}${t.message}`}async function y(t,e,n){const r=t.terminal;if(!r){const l=a.getLogs(e,n);for(const f of l)t.stdout+=c(f)+`
`;return t.stdout+=`-- follow mode requires a terminal --
`,0}const i=l=>r.writeOutput(l),o=a.getLogs(e,n);for(const l of o)i(c(l)+`\r
`);let s=a.getLogs(e).length;return new Promise(l=>{const f=setInterval(()=>{const u=a.getLogs(e);if(u.length>s){const p=u.slice(s);for(const h of p)i(c(h)+`\r
`);s=u.length}},2e3),d=t.shell?.abortController?.signal,g=()=>{clearInterval(f),l(0)};d&&d.addEventListener("abort",g,{once:!0}),r.enterRawMode(u=>{(u===""||u==="Ctrl+C"||u==="q")&&(r.exitRawMode(),g())})})}(globalThis.__tabcomputerLive??=new Map).set("src/commands/cron.ts",b);export{w as crontabCmd,v as journalctlCmd};
