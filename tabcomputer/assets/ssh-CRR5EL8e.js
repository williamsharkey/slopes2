import{ad as b}from"./index-BIxBofyG.js";const w=Object.freeze(Object.defineProperty({__proto__:null,get OPENSSH_HINT(){return m},get sshCmd(){return O}},Symbol.toStringTag,{value:"Module"})),f="https://shiro.computer/signal",O={name:"ssh",description:"Connect to a remote tabcomputer instance",async exec(e){const o=e.args;if(o.length===0||o[0]==="--help"||o[0]==="-h")return e.stdout+=`Usage: ssh <connection-code>
`,e.stdout+=`
Connect to a remote tabcomputer instance via WebRTC.
`,e.stdout+="The remote must have run `remote start` first.\n",e.stdout+=`
Examples:
`,e.stdout+=`  ssh fluffy-cloud-shimutako
`,e.stdout+=`  ssh mycode          # short codes work too
`,o[0]==="--help"||o[0]==="-h"?0:1;const l=b().shims.tabSsh;if(!l||!T(o)){const c=await N(e);if(c)return e.shell.execute([c,...o].map($).join(" "),r=>{e.stdout+=r.replace(/\r\n/g,`
`)},r=>{e.stderr+=r.replace(/\r\n/g,`
`)},!1,e.terminal,!0);if(!l||_(o))return e.stderr+=m,255}const s=e.terminal;if(!s)return e.stderr+=`ssh: requires a terminal
`,1;const t=o[0],i=c=>s.writeOutput(c);if(i(`Connecting to ${t}...\r
`),typeof RTCPeerConnection>"u")return e.stderr+=`ssh: WebRTC not available in this environment
`,1;try{return await v(t,s,e,i)}catch(c){return i(`\r
ssh: ${c.message}\r
`),1}}},m="ssh: this is tabcomputer's tab-to-tab ssh (ssh CONNECTION-CODE from `remote start`).\nFor OpenSSH: `pkg install openssh`, or `debian install && sudo apt install openssh-client`.\n";function T(e){return e.length===1&&/^[a-z0-9]+(-[a-z0-9]+)*$/i.test(e[0])}function _(e){return e.length>1||e.some(o=>o.startsWith("-")||/[@.:]/.test(o))}async function N(e){for(const o of["/usr/bin/ssh","/bin/ssh","/usr/local/bin/ssh"])try{const l=await e.fs.readFile(o),s=typeof l=="string"?new TextEncoder().encode(l.slice(0,4)):l;if(s[0]===127&&s[1]===69&&s[2]===76&&s[3]===70)return o}catch{}return null}function $(e){return/^[A-Za-z0-9_@%+=:,./-]+$/.test(e)?e:`'${e.replace(/'/g,"'\\''")}'`}async function v(e,o,l,s){const t=new RTCPeerConnection({iceServers:[{urls:"stun:stun.l.google.com:19302"}]}),i=t.createDataChannel("shiro-remote",{ordered:!0});let c=!1,r=!1,d;const g=new Promise(n=>{d=n}),h=[];t.onicecandidate=n=>{n.candidate&&h.push(n.candidate)};const S=await t.createOffer();await t.setLocalDescription(S),await new Promise(n=>{if(t.iceGatheringState==="complete")return n();const a=()=>{t.iceGatheringState==="complete"&&(t.removeEventListener("icegatheringstatechange",a),n())};t.addEventListener("icegatheringstatechange",a),setTimeout(n,5e3)});try{const n=await fetch(`${f}/answer/${e}`);if(!n.ok)return s(`ssh: Could not reach signaling server\r
`),t.close(),1;if((await n.json()).expired)return s(`ssh: Connection code expired\r
`),t.close(),1}catch{return s(`ssh: Could not reach signaling server\r
`),t.close(),1}try{const n=await fetch(`${f}/offer/${e}`);if(!n.ok)return s(`ssh: No remote host found for code '${e}'\r
`),t.close(),1;const a=await n.json();if(!a.offer)return s(`ssh: No offer available for code '${e}'\r
`),t.close(),1;if(await t.setRemoteDescription(new RTCSessionDescription(a.offer)),a.candidates)for(const C of a.candidates)await t.addIceCandidate(new RTCIceCandidate(C));const y=await t.createAnswer();await t.setLocalDescription(y),await fetch(`${f}/answer`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:e,answer:t.localDescription,candidates:h})})}catch(n){return s(`ssh: Signaling failed: ${n.message}\r
`),t.close(),1}i.onopen=()=>{c=!0,s(`Connected to ${e}\r
`),i.send(JSON.stringify({type:"hello",name:"ssh-client",requestId:1}));const{cols:n,rows:a}=o.getSize();i.send(JSON.stringify({type:"terminal_start",cols:n,rows:a,requestId:2}))},i.onclose=()=>{r||(r=!0,s(`\r
Connection closed.\r
`),u(),d(0))},i.onmessage=n=>{try{const a=JSON.parse(n.data);a.type==="terminal_output"?s(a.data):a.type==="terminal_end"&&(r=!0,s(`\r
Session ended.\r
`),u(),d(0))}catch{s(n.data)}},t.onconnectionstatechange=()=>{(t.connectionState==="failed"||t.connectionState==="disconnected")&&(r||(r=!0,s(`\r
Connection lost.\r
`),u(),d(1)))};function u(){o.exitRawMode();try{t.close()}catch{}}o.enterRawMode(n=>{!c||r||i.send(JSON.stringify({type:"terminal_input",data:n}))});const p=l.shell?.abortController?.signal;return p&&p.addEventListener("abort",()=>{if(!r){r=!0;try{i.send(JSON.stringify({type:"terminal_end"}))}catch{}u(),d(130)}},{once:!0}),setTimeout(()=>{!c&&!r&&(r=!0,s(`ssh: Connection timed out\r
`),u(),d(1))},3e4),g}(globalThis.__tabcomputerLive??=new Map).set("src/commands/ssh.ts",w);export{m as OPENSSH_HINT,O as sshCmd};
