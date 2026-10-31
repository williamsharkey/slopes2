import{c as y}from"./remote-panel-6kCOukeo.js";const S=Object.freeze(Object.defineProperty({__proto__:null,get groupCmd(){return E}},Symbol.toStringTag,{value:"Module"})),b=(location.protocol==="https:"?"wss://":"ws://")+location.host,g=3e4,C=9e4;async function _(e,o){const r=new TextEncoder,n=await crypto.subtle.importKey("raw",r.encode(e),"PBKDF2",!1,["deriveKey"]);return crypto.subtle.deriveKey({name:"PBKDF2",salt:r.encode("shiro-group-"+o),iterations:1e5,hash:"SHA-256"},n,{name:"AES-GCM",length:256},!0,["encrypt","decrypt"])}async function $(e){const o=await crypto.subtle.exportKey("raw",e),r=await crypto.subtle.digest("SHA-256",o),n=new Uint8Array(r);return Array.from(n.slice(0,16)).map(s=>s.toString(16).padStart(2,"0")).join("")}async function N(e,o){const r=crypto.getRandomValues(new Uint8Array(12)),n=new TextEncoder,s=await crypto.subtle.encrypt({name:"AES-GCM",iv:r},e,n.encode(o)),t=new Uint8Array(r.length+new Uint8Array(s).length);return t.set(r),t.set(new Uint8Array(s),r.length),btoa(String.fromCharCode(...t))}async function v(e,o){const r=Uint8Array.from(atob(o),c=>c.charCodeAt(0)),n=r.slice(0,12),s=r.slice(12),t=await crypto.subtle.decrypt({name:"AES-GCM",iv:n},e,s);return new TextDecoder().decode(t)}function U(e){return{type:"announce",peerId:e.peerId,name:e.peerName,capabilities:["exec","read","write","eval"],mcpUrl:void 0,remoteCode:e.remoteCode,timestamp:Date.now()}}async function d(e){if(e.ws.readyState!==WebSocket.OPEN)return;const o=JSON.stringify(U(e)),r=await N(e.key,o);e.ws.send(r)}function I(e){const o=Date.now();for(const[r,n]of e.peers)o-n.lastSeen>C&&(e.peers.delete(r),e.panel.log("info",`Peer left: ${n.name}`))}function A(){const e=window.__shiroGroup;e&&(clearInterval(e.heartbeatTimer),clearInterval(e.pruneTimer),(e.ws.readyState===WebSocket.OPEN||e.ws.readyState===WebSocket.CONNECTING)&&e.ws.close(),e.panel.setStatus("disconnected"),e.panel.close(),window.__shiroGroup=void 0)}const E={name:"group",description:"Encrypted group networking — peer discovery via relay",async exec(e){const o=e.args[0];if(!o||o==="help"||o==="--help")return e.stdout=`Usage: group <subcommand>

Subcommands:
  join <name> <password>   Join an encrypted group
  leave                    Leave current group
  peers                    List discovered peers
  status                   Show current group info
  share                    Share terminal with group peers
  unshare                  Stop sharing terminal
  watch <peer>             Watch a peer's terminal
  unwatch                  Stop watching
`,0;if(o==="join"){const r=e.args[1],n=e.args[2];if(!r||!n)return e.stderr=`Usage: group join <name> <password>
`,1;if(window.__shiroGroup)return e.stderr=`Already in group "${window.__shiroGroup.name}". Run: group leave
`,1;const s=await _(n,r),t=await $(s),c=`${b}/channel/${t}`,u=new WebSocket(c),i=y(`group-${t}`,`Group: ${r}`);i.setStatus("connecting"),i.log("info",`Joining group "${r}"...`),i.log("info",`Channel: ${t.slice(0,8)}...`);const l=crypto.randomUUID(),w=e.env.USER||e.env.HOSTNAME||"shiro-"+l.slice(0,6),p={name:r,channelId:t,key:s,ws:u,peers:new Map,peerId:l,peerName:w,heartbeatTimer:0,pruneTimer:0,panel:i};return u.onopen=()=>{i.setStatus("connected"),i.log("info","Connected to relay"),d(p),p.heartbeatTimer=window.setInterval(()=>d(p),g),p.pruneTimer=window.setInterval(()=>I(p),g)},u.onmessage=async h=>{try{const m=await v(s,h.data),a=JSON.parse(m);if(a.type==="announce"&&a.peerId!==l){if(Math.abs(Date.now()-a.timestamp)>12e4)return;const f=!p.peers.has(a.peerId);p.peers.set(a.peerId,{peerId:a.peerId,name:a.name,capabilities:a.capabilities||[],mcpUrl:a.mcpUrl,remoteCode:a.remoteCode,lastSeen:Date.now()}),f&&(i.log("info",`Peer joined: ${a.name}`),d(p))}}catch(m){const a=m?.message||String(m);a.includes("decrypt")?i.log("info","Received message with wrong key (different password?)"):i.log("error",`Failed to process message: ${a.slice(0,80)}`)}},u.onclose=()=>{i.log("error","Disconnected from relay"),i.setStatus("disconnected")},u.onerror=()=>{i.log("error","WebSocket error")},window.__shiroGroup=p,e.stdout=`Joining group "${r}" (channel: ${t.slice(0,8)}...)
Your name: ${w}
Peer ID: ${l.slice(0,8)}...
`,0}if(o==="leave"){if(!window.__shiroGroup)return e.stdout=`Not in a group
`,0;const r=window.__shiroGroup.name;return A(),e.stdout=`Left group "${r}"
`,0}if(o==="peers"){const r=window.__shiroGroup;if(!r)return e.stderr=`Not in a group. Use: group join <name> <password>
`,1;if(r.peers.size===0)return e.stdout=`No peers discovered yet
`,0;let n=`${r.peers.size} peer(s):
`;const s=Date.now();for(const t of r.peers.values()){const c=Math.round((s-t.lastSeen)/1e3);n+=`  ${t.name} (${t.peerId.slice(0,8)}...)`,n+=` — ${c}s ago`,t.capabilities.length&&(n+=` [${t.capabilities.join(",")}]`),t.mcpUrl&&(n+=` mcp:${t.mcpUrl}`),t.remoteCode&&(n+=` remote:${t.remoteCode}`),n+=`
`}return e.stdout=n,0}if(o==="status"){const r=window.__shiroGroup;if(!r)return e.stdout=`Not in a group
`,0;const n=["CONNECTING","OPEN","CLOSING","CLOSED"][r.ws.readyState]||"UNKNOWN";return e.stdout=`Group: ${r.name}
Channel: ${r.channelId.slice(0,8)}...
Your name: ${r.peerName}
Peer ID: ${r.peerId.slice(0,8)}...
WebSocket: ${n}
Peers: ${r.peers.size}
`,0}if(o==="share"){const r=window.__shiroGroup;if(!r)return e.stderr=`Not in a group. Use: group join <name> <password>
`,1;if(r.remoteCode)return e.stdout=`Already sharing (code: ${r.remoteCode})
`,0;let n="";await e.shell.execute("remote start",t=>{n+=t});const s=n.match(/Code:\s*(\S+)/i)||n.match(/copied.*?:\s*(\S+)/i)||n.match(/(\S+-\S+-\S+)/);if(s)r.remoteCode=s[1],d(r),e.stdout=`Sharing terminal with group. Code: ${r.remoteCode}
`;else return e.stderr=`group share: failed to start remote session
`,1;return 0}if(o==="unshare"){const r=window.__shiroGroup;return r?r.remoteCode?(r.remoteCode=void 0,d(r),await e.shell.execute("remote stop",()=>{}),e.stdout=`Stopped sharing terminal
`,0):(e.stdout=`Not currently sharing
`,0):(e.stderr=`Not in a group. Use: group join <name> <password>
`,1)}if(o==="watch"){const r=window.__shiroGroup;if(!r)return e.stderr=`Not in a group. Use: group join <name> <password>
`,1;const n=e.args[1];if(!n)return e.stderr=`Usage: group watch <peer-name>
`,1;let s;for(const t of r.peers.values())if(t.name===n){s=t;break}return s?s.remoteCode?(e.stdout=`Connecting to ${s.name}...
`,await e.shell.execute(`remote connect ${s.remoteCode}`,t=>{e.stdout+=t}),0):(e.stderr=`group watch: peer "${n}" is not sharing
`,1):(e.stderr=`group watch: unknown peer "${n}"
`,1)}return o==="unwatch"?(await e.shell.execute("remote disconnect",r=>{e.stdout+=r}),0):(e.stderr=`Unknown subcommand: ${o}. Try: group help
`,1)}};(globalThis.__tabcomputerLive??=new Map).set("src/commands/group.ts",S);export{E as groupCmd};
