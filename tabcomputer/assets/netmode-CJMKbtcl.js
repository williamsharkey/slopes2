import{aw as s,m as r,ax as i}from"./index-3dop0BuN.js";const h=Object.freeze(Object.defineProperty({__proto__:null,get netmodeCmd(){return d}},Symbol.toStringTag,{value:"Module"})),o=`Usage: netmode            which mode this tab is in
       netmode private    keep tokens, code and prompts from this site's server
       netmode proxy      let this site's server make those requests (the default)

proxy    git, gh and Claude go through this site's server, which makes the
         request for the page. It is the faster and more dependable way, and
         the server can read what passes.
private  gh and git on github.com call GitHub's API straight from the
         browser. Everything else (GitHub sign-in, other git hosts, Claude and
         other model APIs) is encrypted in this tab and carried by the TCP
         relay, which sees a host name and byte counts. Slower, and voice
         input in Claude is off.

One command the other way: ${s}=proxy git push
dataflow shows what the server can read in the current mode.
`,a={proxy:`proxy: this site's server makes requests for git, gh and Claude, and can read them.
`,private:`private: GitHub's API is called from the browser, the rest is encrypted here and carried by the relay.
`},d={name:"netmode",description:"Network mode: proxy (this site's server makes requests) or private (it cannot read them)",async exec(e){const t=e.args[0];if(t==="-h"||t==="--help"||t==="help")return e.stdout=o,0;if(t===void 0){const n=r(e.env);return e.stdout=a[n],e.env[s]&&e.env[s]!==r()&&(e.stdout+=`(from ${s} in this shell; the saved choice is ${r()})
`),0}return t!=="proxy"&&t!=="private"?(e.stderr=o,2):(i(t),e.stdout=a[t],e.env[s]&&e.env[s]!==t&&(e.stdout+=`(this shell still has ${s}=${e.env[s]}, which wins here: unset ${s})
`),0)}};(globalThis.__tabcomputerLive??=new Map).set("src/commands/netmode.ts",h);export{d as netmodeCmd};
