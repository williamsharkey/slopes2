const l=Object.freeze(Object.defineProperty({__proto__:null,get scpCmd(){return w}},Symbol.toStringTag,{value:"Module"})),p="https://shiro.computer/signal";function u(e){const t=e.indexOf(":");return t<1?null:{code:e.substring(0,t),path:e.substring(t+1)}}const w={name:"scp",description:"Copy files over WebRTC",async exec(e){const t=e.args;if(t.length<2||t[0]==="--help"||t[0]==="-h")return e.stdout+=`Usage: scp <source> <destination>
`,e.stdout+=`
Copy files to/from a remote tabcomputer instance.
`,e.stdout+=`Remote paths use code:path notation.
`,e.stdout+=`
Examples:
`,e.stdout+=`  scp file.txt fluffy-cloud:~/file.txt     Upload
`,e.stdout+=`  scp fluffy-cloud:/home/user/file.txt .   Download
`,t[0]==="--help"||t[0]==="-h"?0:1;const n=t[0],a=t[1],s=u(n),r=u(a);if(s&&r)return e.stderr+=`scp: cannot copy between two remote hosts
`,1;if(!s&&!r)return e.stderr+=`scp: at least one argument must be remote (code:path)
`,1;if(r){const i=n.startsWith("/")?n:e.shell.cwd+"/"+n;try{await e.fs.stat(i)}catch{return e.stderr+=`scp: ${n}: No such file or directory
`,1}}return typeof RTCPeerConnection>"u"?(e.stderr+=`scp: WebRTC not available in this environment
`,1):r?m(e,n,r):y(e,s,a)}};async function m(e,t,n){const a=t.startsWith("/")?t:e.shell.cwd+"/"+t;let s;try{const r=await e.fs.readFile(a);r instanceof Uint8Array?s=r:s=new TextEncoder().encode(r)}catch{return e.stderr+=`scp: ${t}: No such file or directory
`,1}e.stdout+=`Uploading ${t} to ${n.code}:${n.path}...
`;try{const r=await f(n.code),i=n.path.startsWith("~")?"/home/user"+n.path.slice(1):n.path,o=btoa(String.fromCharCode(...s)),c=await h(r,{type:"write",path:i,content:o,requestId:Date.now()});return r.pc.close(),c.type==="error"?(e.stderr+=`scp: remote error: ${c.error}
`,1):(e.stdout+=`${t} → ${n.code}:${i} (${s.length} bytes)
`,0)}catch(r){return e.stderr+=`scp: ${r.message}
`,1}}async function y(e,t,n){e.stdout+=`Downloading ${t.code}:${t.path}...
`;try{const a=await f(t.code),s=t.path.startsWith("~")?"/home/user"+t.path.slice(1):t.path,r=await h(a,{type:"read",path:s,requestId:Date.now()});if(a.pc.close(),r.type==="error")return e.stderr+=`scp: remote error: ${r.error}
`,1;const i=atob(r.content),o=new Uint8Array(i.length);for(let d=0;d<i.length;d++)o[d]=i.charCodeAt(d);let c;if(n==="."){const d=s.split("/").pop()||"downloaded";c=e.shell.cwd+"/"+d}else c=n.startsWith("/")?n:e.shell.cwd+"/"+n;return await e.fs.writeFile(c,o),e.stdout+=`${t.code}:${s} → ${c} (${o.length} bytes)
`,0}catch(a){return e.stderr+=`scp: ${a.message}
`,1}}async function f(e){const t=new RTCPeerConnection({iceServers:[{urls:"stun:stun.l.google.com:19302"}]}),n=t.createDataChannel("shiro-remote",{ordered:!0}),a=[];t.onicecandidate=o=>{o.candidate&&a.push(o.candidate)},await new Promise(o=>{if(t.iceGatheringState==="complete")return o();const c=()=>{t.iceGatheringState==="complete"&&(t.removeEventListener("icegatheringstatechange",c),o())};t.addEventListener("icegatheringstatechange",c),setTimeout(o,5e3)});const s=await fetch(`${p}/offer/${e}`);if(!s.ok)throw new Error(`No remote host found for code '${e}'`);const r=await s.json();if(!r.offer)throw new Error(`No offer available for code '${e}'`);if(await t.setRemoteDescription(new RTCSessionDescription(r.offer)),r.candidates)for(const o of r.candidates)await t.addIceCandidate(new RTCIceCandidate(o));const i=await t.createAnswer();return await t.setLocalDescription(i),await fetch(`${p}/answer`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:e,answer:t.localDescription,candidates:a})}),await new Promise((o,c)=>{n.onopen=()=>o(),n.onerror=()=>c(new Error("Data channel failed")),setTimeout(()=>c(new Error("Connection timed out")),15e3)}),{dc:n,pc:t}}async function h(e,t,n=1e4){return new Promise((a,s)=>{const r=setTimeout(()=>s(new Error("Request timed out")),n);e.dc.onmessage=i=>{clearTimeout(r);try{a(JSON.parse(i.data))}catch{a({type:"raw",data:i.data})}},e.dc.send(JSON.stringify(t))})}(globalThis.__tabcomputerLive??=new Map).set("src/commands/scp.ts",l);export{w as scpCmd};
