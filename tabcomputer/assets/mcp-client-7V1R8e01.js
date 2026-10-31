const T=Object.freeze(Object.defineProperty({__proto__:null,get mcpCmd(){return I}},Symbol.toStringTag,{value:"Module"}));function f(){return window.__shiroMCPConnections||(window.__shiroMCPConnections=new Map),window.__shiroMCPConnections}let g=1;async function w(t,r,o,n){const s={"Content-Type":"application/json",Accept:"application/json"};n&&(s["Mcp-Session-Id"]=n);const i=JSON.stringify({jsonrpc:"2.0",id:g++,method:r,...o!==void 0?{params:o}:{}}),e=new AbortController,c=setTimeout(()=>e.abort(),3e4);let a;try{a=await fetch(t,{method:"POST",headers:s,body:i,signal:e.signal})}catch(d){throw clearTimeout(c),d.name==="AbortError"?new Error("Request timed out (30s)"):d}if(clearTimeout(c),!a.ok){const d=await a.text().catch(()=>"");throw new Error(`HTTP ${a.status}: ${d.slice(0,200)}`)}const u=a.headers.get("Mcp-Session-Id")||n||null;if((a.headers.get("content-type")||"").includes("text/event-stream")){const S=(await a.text()).split(`
`),p=[];for(const l of S)if(l.startsWith("data: "))try{p.push(JSON.parse(l.slice(6)))}catch{}const y=p.find(l=>"id"in l&&"result"in l);if(y)return{result:y.result,sessionId:u};const $=p.find(l=>"id"in l&&"error"in l);if($){const l=$.error;throw new Error(`MCP error ${l.code}: ${l.message}`)}return{result:p[p.length-1]??null,sessionId:u}}const h=await a.json();if(h.error){const d=h.error;throw new Error(`MCP error ${d.code}: ${d.message}`)}return{result:h.result,sessionId:u}}async function b(t){const r=f(),n=(await w(t,"initialize",{protocolVersion:"2025-03-26",capabilities:{},clientInfo:{name:"shiro",version:"1.0.0"}})).sessionId,s={"Content-Type":"application/json"};n&&(s["Mcp-Session-Id"]=n),await fetch(t,{method:"POST",headers:s,body:JSON.stringify({jsonrpc:"2.0",method:"notifications/initialized"})});const e=(await w(t,"tools/list",{},n)).result?.tools,c=Array.isArray(e)?e:[],a={url:t,sessionId:n,tools:c,connectedAt:Date.now()};r.set(t,a);let u=`Connected to ${t}
`;n&&(u+=`Session: ${n}
`),u+=`${c.length} tool(s) available:
`;for(const m of c)u+=`  ${m.name}`,m.description&&(u+=` — ${m.description}`),u+=`
`;return{conn:a,output:u}}async function C(t){const r=f(),o=r.get(t);if(!o)return`Not connected to ${t}
`;try{const n={};o.sessionId&&(n["Mcp-Session-Id"]=o.sessionId),await fetch(t,{method:"DELETE",headers:n})}catch{}return r.delete(t),`Disconnected from ${t}
`}function v(t){const r=f();for(const o of r.values())if(o.tools.some(n=>n.name===t))return o;return null}const I={name:"mcp",description:"MCP Streamable HTTP client — connect to external MCP servers",async exec(t){const r=t.args[0];if(!r||r==="help"||r==="--help")return t.stdout=`Usage: mcp <subcommand>

Subcommands:
  connect <url>        Connect to an MCP server
  disconnect [url]     Disconnect from a server
  tools [url]          List tools (all or for a specific server)
  call <tool> [json]   Call a tool with optional JSON arguments
  status               Show all active connections

Note: Only works with CORS-enabled MCP servers (e.g. *.shiro.computer).
Localhost servers won't work from browser due to CORS restrictions.
`,0;if(r==="connect"){const o=t.args[1];if(!o)return t.stderr=`Usage: mcp connect <url>
`,1;try{const{output:n}=await b(o);return t.stdout=n,0}catch(n){return t.stderr=`Failed to connect: ${n.message}
`,1}}if(r==="disconnect"){const o=f();let n=t.args[1];if(!n){if(o.size===0)return t.stdout=`No active connections
`,0;let s="";for(const i of[...o.keys()])s+=await C(i);return t.stdout=s,0}return t.stdout=await C(n),0}if(r==="tools"){const o=f(),n=t.args[1];if(n){const i=o.get(n);if(!i)return t.stderr=`Not connected to ${n}
`,1;let e=`Tools on ${n}:
`;for(const c of i.tools)e+=`  ${c.name}`,c.description&&(e+=` — ${c.description}`),e+=`
`;return t.stdout=e,0}if(o.size===0)return t.stdout=`No active connections. Use: mcp connect <url>
`,0;let s="";for(const[i,e]of o){s+=`${i} (${e.tools.length} tools):
`;for(const c of e.tools)s+=`  ${c.name}`,c.description&&(s+=` — ${c.description}`),s+=`
`}return t.stdout=s,0}if(r==="call"){const o=t.args[1];if(!o)return t.stderr=`Usage: mcp call <tool> [json-args]
`,1;const n=v(o);if(!n)return t.stderr=`Tool "${o}" not found on any connection
`,1;let s={};const i=t.args.slice(2).join(" ");if(i)try{s=JSON.parse(i)}catch{return t.stderr=`Invalid JSON arguments: ${i}
`,1}try{const e=await w(n.url,"tools/call",{name:o,arguments:s},n.sessionId);e.sessionId&&(n.sessionId=e.sessionId);const c=e.result;if(c&&Array.isArray(c.content))for(const a of c.content)a.type==="text"?t.stdout+=a.text+`
`:t.stdout+=JSON.stringify(a,null,2)+`
`;else t.stdout=JSON.stringify(e.result,null,2)+`
`;return 0}catch(e){return t.stderr=`Tool call failed: ${e.message}
`,1}}if(r==="status"){const o=f();if(o.size===0)return t.stdout=`No active MCP connections
`,0;let n=`${o.size} active connection(s):
`;for(const[s,i]of o){const e=Math.round((Date.now()-i.connectedAt)/1e3);n+=`  ${s} — ${i.tools.length} tools, ${e}s ago`,i.sessionId&&(n+=`, session: ${i.sessionId.slice(0,12)}...`),n+=`
`}return t.stdout=n,0}return t.stderr=`Unknown subcommand: ${r}. Try: mcp help
`,1}};(globalThis.__tabcomputerLive??=new Map).set("src/commands/mcp-client.ts",T);(globalThis.__tabcomputerLiveState??=new Map).set("src/commands/mcp-client.ts",{get nextId(){return g},set nextId(t){g=t}});export{I as mcpCmd};
