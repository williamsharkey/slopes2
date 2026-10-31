const f=Object.freeze(Object.defineProperty({__proto__:null,get hcCmd(){return d}},Symbol.toStringTag,{value:"Module"}));function l(){return window.__tabcomputer?.runtimeContext||null}class h{doc;source;current;lastResults=[];lastGrid=null;vars={};constructor(t,e="page"){this.doc=t,this.source=e,this.current=t.body||t.documentElement}_depth(t){let e=0;for(;t&&t!==this.doc.body&&t!==this.doc.documentElement;)e++,t=t.parentElement;return e}s(){const t=this.source.split("/").pop(),e=this.lastResults.length,n=this._depth(this.current),r=this.current.tagName?.toLowerCase()||"doc";return`p:${t} c:${e} d:${n} @${r}`}t(t){let e=(this.current.textContent||"").replace(/\s+/g," ").trim();return t&&e.length>t&&(e=e.slice(0,t)+"…"),e}q(t,e=10){try{const n=Array.from(this.doc.querySelectorAll(t));return this.lastResults=n,n.length===0?"∅":n.slice(0,e).map((r,i)=>{const o=(r.textContent||"").replace(/\s+/g," ").trim().slice(0,60);return`[${i}]${o}`}).join(`
`)}catch(n){return"✗ "+n.message}}q1(t){try{const e=this.doc.querySelector(t);return e?(this.current=e,this.lastResults=[e],(e.textContent||"").replace(/\s+/g," ").trim().slice(0,200)):"∅"}catch(e){return"✗ "+e.message}}n(t){return t>=this.lastResults.length?"✗ out of range":(this.current=this.lastResults[t],`✓ [${t}] ${(this.current.textContent||"").replace(/\s+/g," ").trim().slice(0,100)}`)}up(t=1){for(let e=0;e<t;e++)this.current.parentElement&&(this.current=this.current.parentElement);return`✓ @${this.current.tagName?.toLowerCase()}`}ch(){const t=Array.from(this.current.children);return t.length===0?"∅ no children":t.slice(0,15).map((e,n)=>{const r=e.tagName.toLowerCase(),i=e.className?"."+String(e.className).split(" ")[0]:"";return`[${n}]<${r}${i}>${(e.textContent||"").replace(/\s+/g," ").trim().slice(0,30)}`}).join(`
`)}g(t,e=10){const n=(this.current.textContent||"").split(`
`),r=new RegExp(t,"gi"),i=[];return n.forEach((o,a)=>{if(r.test(o)){const c=o.replace(/\s+/g," ").trim();c&&i.push(`L${a+1}: ${c.slice(0,60)}`)}}),i.length===0?"∅ no matches":i.slice(0,e).join(`
`)}look(){const t=this.current.querySelectorAll('a, button, input, select, textarea, [onclick], [href], .btn, [role="button"]'),e=[];if(t.forEach((r,i)=>{const o=(r.textContent||r.value||r.placeholder||r.getAttribute("title")||r.getAttribute("aria-label")||"").replace(/\s+/g," ").trim().slice(0,20);(o||r.tagName.toLowerCase()==="input")&&e.push({text:o||`[${r.type||"input"}]`,el:r,idx:i})}),this.lastGrid=e,e.length===0)return"∅ no interactive elements";let n=`${e.length} elements
`;return e.slice(0,20).forEach((r,i)=>{const o=r.el.tagName.toLowerCase(),a=r.el.getAttribute("href");n+=`@${i} <${o}> "${r.text}"${a?` →${a.slice(0,25)}`:""}
`}),n.trim()}click(t){if(!this.lastGrid||t>=this.lastGrid.length)return"✗ call look first or index out of range";const e=this.lastGrid[t];try{e.el.click()}catch{}return`✓ clicked "${e.text}"`}a(){if(!this.current.attributes)return"∅";const t=[];for(const e of Array.from(this.current.attributes))t.push(`${e.name}=${e.value.slice(0,30)}`);return t.length===0?"∅ no attrs":t.join(" ")}h(t){let e=this.current.outerHTML;return t&&e.length>t&&(e=e.slice(0,t)+"…[truncated]"),e}store(t){return this.vars[t]=this.current.textContent||"",`✓ $${t} (${this.vars[t].length} chars)`}recall(t){const e=t.match(/^\$(\w+)(\.(\w+))?$/);if(!e)return"✗ invalid var syntax";const n=e[1],r=e[3];return this.vars[n]?r==="length"?String(this.vars[n].length):r?"✗ unknown property":this.vars[n].slice(0,500):`✗ $${n} not set`}exec(t){t=t.trim();let e;return t.includes(";")&&!t.startsWith(";")?t.split(";").map(n=>n.trim()).filter(Boolean).map(n=>this.exec(n)).join(`
---
`):t==="s"?this.s():t==="t"?this.t():(e=t.match(/^t(\d+)$/))?this.t(parseInt(e[1])):t.startsWith("q1 ")?this.q1(t.slice(3).trim()):t.startsWith("q ")?this.q(t.slice(2).trim()):(e=t.match(/^n(\d+)$/))?this.n(parseInt(e[1])):t==="up"?this.up():(e=t.match(/^up(\d+)$/))?this.up(parseInt(e[1])):t==="ch"?this.ch():t.startsWith("g ")?this.g(t.slice(2).trim()):t==="look"?this.look():(e=t.match(/^@(\d+)$/))?this.click(parseInt(e[1])):t==="a"?this.a():t==="h"?this.h():(e=t.match(/^h(\d+)$/))?this.h(parseInt(e[1])):(e=t.match(/^>\$(\w+)$/))?this.store(e[1]):(e=t.match(/^(\$\w+(\.\w+)?)$/))?this.recall(e[1]):`✗ unknown: ${t}`}}class u{source="outer";_listener=null;_pending=new Map;constructor(){this._listener=t=>{if(t.data&&t.data.type==="shiro-hc-result"){const e=this._pending.get(t.data.id);e&&(clearTimeout(e.timer),this._pending.delete(t.data.id),e.resolve(t.data.result))}},window.addEventListener("message",this._listener)}exec(t){const e=Math.random().toString(36).slice(2,10);return new Promise(n=>{const r=setTimeout(()=>{this._pending.delete(e),n("✗ timeout: no response from host page (is tabcomputer injected?)")},5e3);this._pending.set(e,{resolve:n,timer:r}),window.parent.postMessage({type:"shiro-hc",id:e,cmd:t},"*")})}close(){this._listener&&(window.removeEventListener("message",this._listener),this._listener=null);for(const[,t]of this._pending)clearTimeout(t.timer);this._pending.clear()}}typeof window<"u"&&!window.__hc&&(window.__hc={session:null,HCSession:h},window.hc=s=>window.__hc.session?window.__hc.session.exec(s):"✗ no session");const d={name:"hc",description:"Hypercompact - token-efficient DOM navigation",async exec(s){const t=s.args,e=t[0];if(!e)return s.stdout=`Hypercompact - Token-efficient DOM navigation

Usage:
  hc open <file>     Load HTML file from filesystem
  hc live            Attach to live page DOM
  hc outer           Bridge to host page DOM (when injected)
  hc close           Close current session
  hc <cmd>           Run HC command

Commands:
  s              State: "p:file c:N d:N @tag"
  t, t100        Text content (optional limit)
  q <sel>        Query all matching elements
  q1 <sel>       Query one, set as current
  n<N>           Select Nth from results
  up, up<N>      Go to parent element
  ch             Show children
  g <pattern>    Grep for text
  look           List interactive elements
  @<N>           Click Nth element
  a              Show attributes
  h, h<N>        Show HTML
  >$name         Store to variable
  $name          Recall variable

Example:
  hc open page.html
  hc t100
  hc q .price
  hc n0
  hc a
`,l()?.hcOuterAvailable&&(s.stdout+=`
Detected host-page bridge. Run "hc outer" to inspect the page that spawned this tabcomputer instance.
`),0;if(e==="open"){const i=t[1];if(!i)return s.stderr=`hc open: missing file
`,1;try{const o=s.fs.resolvePath(i,s.cwd),a=await s.fs.readFile(o,"utf8"),p=new DOMParser().parseFromString(a,"text/html");return window.__hc.session=new h(p,i),s.stdout=`✓ opened ${i} (${a.length} chars)
`,0}catch(o){return s.stderr=`hc open: ${o.message}
`,1}}if(e==="live")return window.__hc.session=new h(document,"live"),s.stdout=`✓ attached to live DOM
`,0;if(e==="outer"){if(window.parent===window)return s.stderr=`hc outer: not running inside an iframe. Use "seed" first.
`,1;const i=new u;window.__hc.session=i;const o=await i.exec("s");return o.startsWith("✗ timeout")?(i.close(),window.__hc.session=null,s.stderr="hc outer: "+o+`
`,1):(s.stdout=`✓ connected to host page DOM
`+o+`
`,0)}if(e==="close")return window.__hc.session&&window.__hc.session instanceof u&&window.__hc.session.close(),window.__hc.session=null,s.stdout=`✓ session closed
`,0;if(!window.__hc.session)return l()?.hcOuterAvailable?s.stderr=`hc: no session. This tabcomputer instance was injected into a host page; run "hc outer" first.
`:s.stderr=`hc: no session. Use "hc open <file>", "hc live", or "hc outer" first.
`,1;const n=t.join(" "),r=await window.__hc.session.exec(n);return s.stdout=r+`
`,0}};(globalThis.__tabcomputerLive??=new Map).set("src/commands/hc.ts",f);export{d as hcCmd};
