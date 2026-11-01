import{j as q,t as H,n as I,c5 as K}from"./index-3dop0BuN.js";const W=Object.freeze(Object.defineProperty({__proto__:null,get formatSize(){return P},get getFileIcon(){return B},get injectFinderStyles(){return T},get renderBreadcrumb(){return M},get renderFileGrid(){return j},get showContextMenu(){return _}},Symbol.toStringTag,{value:"Module"})),G=Object.freeze(Object.defineProperty({__proto__:null,get finderCmd(){return X}},Symbol.toStringTag,{value:"Module"}));function T(i){const s=document.createElement("style");s.textContent=`
    .finder-root {
      display: flex; flex-direction: column; height: 100%; background: #12121e;
      color: rgba(255,255,255,0.85); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 13px; user-select: none; -webkit-user-select: none;
    }
    .finder-toolbar {
      display: flex; align-items: center; gap: 6px; padding: 6px 10px;
      background: #1a1a2e; border-bottom: 1px solid rgba(255,255,255,0.06); flex-shrink: 0;
    }
    .finder-toolbar button {
      height: 26px; padding: 0 10px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1);
      background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.7); font-size: 12px;
      cursor: pointer; font-family: inherit; white-space: nowrap;
    }
    .finder-toolbar button:hover { background: rgba(255,255,255,0.1); }
    .finder-breadcrumb {
      display: flex; align-items: center; gap: 2px; flex: 1; overflow: hidden;
    }
    .finder-crumb {
      color: rgba(255,255,255,0.5); cursor: pointer; padding: 2px 4px; border-radius: 3px;
      white-space: nowrap; font-size: 12px;
    }
    .finder-crumb:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.8); }
    .finder-crumb-sep { color: rgba(255,255,255,0.2); font-size: 11px; }
    .finder-grid {
      flex: 1; overflow-y: auto; padding: 8px; display: grid;
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 4px;
      align-content: start;
    }
    .finder-item {
      display: flex; flex-direction: column; align-items: center; padding: 8px 4px;
      border-radius: 6px; cursor: default; min-width: 0;
    }
    .finder-item:hover { background: rgba(255,255,255,0.04); }
    .finder-item.selected { background: rgba(50,100,255,0.2); }
    .finder-item-icon { font-size: 28px; line-height: 1.2; }
    .finder-item-name {
      font-size: 11px; color: rgba(255,255,255,0.75); text-align: center;
      word-break: break-all; max-width: 100%; margin-top: 4px; line-height: 1.3;
    }
    .finder-item-name[contenteditable] {
      background: rgba(255,255,255,0.1); border-radius: 3px; padding: 1px 4px;
      outline: none; color: #fff;
    }
    .finder-ctx {
      position: fixed; z-index: 2147483647; background: #1e1e32;
      border: 1px solid rgba(255,255,255,0.1); border-radius: 6px;
      padding: 4px 0; min-width: 160px; box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    }
    .finder-ctx-item {
      padding: 6px 14px; cursor: pointer; font-size: 13px; color: rgba(255,255,255,0.8);
    }
    .finder-ctx-item:hover { background: rgba(50,100,255,0.3); }
    .finder-ctx-sep {
      height: 1px; background: rgba(255,255,255,0.06); margin: 4px 0;
    }
    .finder-empty {
      color: rgba(255,255,255,0.25); font-size: 13px; padding: 20px;
      text-align: center; grid-column: 1 / -1;
    }
  `,i.appendChild(s)}function B(i,s){if(s==="dir")return"📁";if(s==="symlink")return"🔗";const c=i.split(".").pop()?.toLowerCase()||"";return{js:"🟨",ts:"🔷",jsx:"⚛️",tsx:"⚛️",py:"🐍",html:"🌐",css:"🎨",json:"📋",md:"📝",txt:"📄",sh:"⚙️",yaml:"📋",yml:"📋",png:"🖼️",jpg:"🖼️",jpeg:"🖼️",gif:"🖼️",svg:"🖼️",webp:"🖼️",mp3:"🎵",wav:"🎵",mp4:"🎬",webm:"🎬",zip:"📦",gz:"📦",tar:"📦",wasm:"⚙️",toml:"📋",lock:"🔒"}[c]||"📄"}function M(i,s,c){i.innerHTML="";const a=s==="/"?[""]:s.split("/");for(let t=0;t<a.length;t++){if(t>0){const d=document.createElement("span");d.className="finder-crumb-sep",d.textContent="/",i.appendChild(d)}const l=document.createElement("span");l.className="finder-crumb",l.textContent=t===0?"/":a[t];const u=t===0?"/":a.slice(0,t+1).join("/");l.onclick=()=>c(u),i.appendChild(l)}}function j(i,s,c,a){if(i.innerHTML="",i.ondragover=t=>{t.preventDefault(),t.dataTransfer.dropEffect="copy"},i.ondrop=t=>{t.preventDefault(),t.dataTransfer?.files?.length&&a.onDrop(t.dataTransfer.files)},i.oncontextmenu=t=>{t.target===i&&(t.preventDefault(),a.onContextMenu(null,t))},s.length===0){const t=document.createElement("div");t.className="finder-empty",t.textContent="Empty folder",i.appendChild(t);return}for(const t of s){const l=document.createElement("div");l.className="finder-item",l.draggable=!0,l.setAttribute("data-name",t.name);const u=document.createElement("div");u.className="finder-item-icon",u.textContent=B(t.name,t.type);const d=document.createElement("div");d.className="finder-item-name",d.textContent=t.name,l.appendChild(u),l.appendChild(d),i.appendChild(l),l.onclick=m=>{m.stopPropagation(),a.onSelect(t.name,m)},l.ondblclick=()=>a.onOpen(t),l.oncontextmenu=m=>{m.preventDefault(),m.stopPropagation(),a.onContextMenu(t,m)},t.type==="dir"&&(l.ondragover=m=>{m.preventDefault(),m.stopPropagation(),l.style.outline="2px solid rgba(50,100,255,0.5)",m.dataTransfer.dropEffect="move"},l.ondragleave=()=>{l.style.outline=""},l.ondrop=m=>{m.preventDefault(),m.stopPropagation(),l.style.outline="";const h=m.dataTransfer?.getData("text/x-finder-name");h&&h!==t.name&&a.onMoveToDir(h,t.name)}),l.ondragstart=m=>{m.dataTransfer?.setData("text/x-finder-name",t.name)}}i.onclick=t=>{t.target===i&&a.onSelect("",t)}}function _(i,s,c,a){a.querySelectorAll(".finder-ctx").forEach(d=>d.remove());const t=document.createElement("div");t.className="finder-ctx",t.style.left=i+"px",t.style.top=s+"px";for(const d of c){if(d==="separator"){const h=document.createElement("div");h.className="finder-ctx-sep",t.appendChild(h);continue}const m=document.createElement("div");m.className="finder-ctx-item",m.textContent=d.label,m.onclick=h=>{h.stopPropagation(),l(),d.action()},t.appendChild(m)}a.appendChild(t),requestAnimationFrame(()=>{const d=t.getBoundingClientRect();d.right>window.innerWidth&&(t.style.left=window.innerWidth-d.width-8+"px"),d.bottom>window.innerHeight&&(t.style.top=window.innerHeight-d.height-8+"px")});const l=()=>t.remove(),u=d=>{t.contains(d.target)||(l(),document.removeEventListener("click",u,!0))};return setTimeout(()=>document.addEventListener("click",u,!0),0),l}function P(i){return i<1024?i+" B":i<1024*1024?(i/1024).toFixed(1)+" KB":(i/(1024*1024)).toFixed(1)+" MB"}(globalThis.__tabcomputerLive??=new Map).set("src/finder-ui.ts",W);const X={name:"finder",description:"Visual file manager",async exec(i){const s=i.fs;let c=i.args[0]?s.resolvePath(i.args[0],i.cwd):i.cwd;const a=new Set,t=q({mode:"terminal",title:"Finder",appId:"finder",appName:"Finder",restore:{cmd:H("finder",i.args),cwd:i.cwd},width:"36em",height:"26em",onClose:()=>{}}),l=t.contentDiv;l.style.cssText="flex:1;display:flex;flex-direction:column;overflow:hidden";const u=document.createElement("div");u.className="finder-root",u.style.cssText="display:flex;flex-direction:column;height:100%",l.appendChild(u),T(u);const d=document.createElement("div");d.className="finder-toolbar";const m=document.createElement("div");m.className="finder-breadcrumb";const h=document.createElement("button");h.textContent="+ Folder",h.onclick=()=>S();const C=document.createElement("button");C.textContent="Upload",C.onclick=()=>F(),d.appendChild(m),d.appendChild(h),d.appendChild(C),u.appendChild(d);const y=document.createElement("div");y.className="finder-grid",u.appendChild(y);let k=[];async function w(e){try{k=(await K(s,e)).sort((n,o)=>n.type==="dir"&&o.type!=="dir"?-1:n.type!=="dir"&&o.type==="dir"?1:n.name.localeCompare(o.name)),c=e,a.clear(),L(),t.setTitle("Finder — "+c)}catch(r){i.stderr+=`finder: ${r.message}
`}}function L(){M(m,c,w),j(y,k,c,{onSelect:(e,r)=>{if(!e)a.clear();else if(r.metaKey||r.ctrlKey)a.has(e)?a.delete(e):a.add(e);else if(r.shiftKey&&a.size>0){const n=k.map(v=>v.name),o=[...a].pop(),p=n.indexOf(o),g=n.indexOf(e),[f,b]=p<g?[p,g]:[g,p];for(let v=f;v<=b;v++)a.add(n[v])}else a.clear(),a.add(e);E()},onOpen:e=>{if(e.type==="dir"){const r=c==="/"?"/"+e.name:c+"/"+e.name;w(r)}else{const r=c==="/"?"/"+e.name:c+"/"+e.name,n=window.__tabcomputer?.shell,o=window.__tabcomputer?.terminal;n&&o&&(o.term.writeln(""),n.execute(`vi "${r}"`,p=>o.term.write(p),p=>o.term.write(`\x1B[31m${p}\x1B[0m`)).then(()=>o.showPrompt?.()))}},onContextMenu:(e,r)=>{e?(a.has(e.name)||(a.clear(),a.add(e.name),E()),$(r.clientX,r.clientY,e)):N(r.clientX,r.clientY)},onDrop:e=>z(e),onMoveToDir:async(e,r)=>{const n=x(c,e),o=x(x(c,r),e);try{await s.rename(n,o),await w(c)}catch(p){console.error("Move failed:",p)}}}),E()}function E(){y.querySelectorAll(".finder-item").forEach(e=>{const r=e.getAttribute("data-name")||"";e.classList.toggle("selected",a.has(r))})}function x(e,r){return e==="/"?"/"+r:e+"/"+r}function $(e,r,n){const o=[],p=x(c,n.name);o.push({label:"Open",action:()=>{if(n.type==="dir")w(p);else{const g=window.__tabcomputer?.shell,f=window.__tabcomputer?.terminal;g&&f&&(f.term.writeln(""),g.execute(`vi "${p}"`,b=>f.term.write(b),b=>f.term.write(`\x1B[31m${b}\x1B[0m`)).then(()=>f.showPrompt?.()))}}}),o.push("separator"),o.push({label:"Rename",action:()=>O(n.name)}),n.type==="file"&&o.push({label:`Download (${P(n.size)})`,action:()=>R(p,n.name)}),o.push("separator"),a.size>1&&(o.push({label:`Zip ${a.size} items`,action:()=>U()}),o.push("separator")),o.push({label:"Delete",action:()=>A()}),_(e,r,o,u)}function N(e,r){_(e,r,[{label:"New Folder",action:()=>S()},{label:"Upload",action:()=>F()}],u)}async function S(){const e=prompt("Folder name:");if(e)try{await s.mkdir(x(c,e),{recursive:!0}),await w(c)}catch(r){alert("Failed: "+r.message)}}function F(){const e=document.createElement("input");e.type="file",e.multiple=!0,e.onchange=()=>{e.files?.length&&z(e.files)},e.click()}async function z(e){for(const r of Array.from(e)){const n=new Uint8Array(await r.arrayBuffer());await s.writeFile(x(c,r.name),n),I(x(c,r.name))}await w(c)}async function R(e,r){try{const n=await s.readFile(e),o=n instanceof Uint8Array?n:new TextEncoder().encode(n),p=new Blob([new Uint8Array(o)]),g=URL.createObjectURL(p),f=document.createElement("a");f.href=g,f.download=r,f.click(),URL.revokeObjectURL(g)}catch(n){console.error("Download failed:",n)}}async function A(){const e=[...a];if(!e.length)return;const r=e.length===1?`Delete "${e[0]}"?`:`Delete ${e.length} items?`;if(confirm(r)){for(const n of e){const o=x(c,n);try{(await s.lstat(o)).isDirectory()?await D(o):await s.unlink(o)}catch{}}await w(c)}}async function D(e){const r=await s.readdir(e);for(const n of r){const o=x(e,n);(await s.lstat(o)).isDirectory()?await D(o):await s.unlink(o)}await s.rmdir(e)}function O(e){const r=y.querySelector(`[data-name="${CSS.escape(e)}"]`);if(!r)return;const n=r.querySelector(".finder-item-name");if(!n)return;n.contentEditable="true",n.focus();const o=document.createRange();o.selectNodeContents(n);const p=window.getSelection();p?.removeAllRanges(),p?.addRange(o);const g=async()=>{n.contentEditable="false";const f=n.textContent?.trim();if(!f||f===e){n.textContent=e;return}try{await s.rename(x(c,e),x(c,f)),await w(c)}catch(b){n.textContent=e,alert("Rename failed: "+b.message)}};n.onblur=g,n.onkeydown=f=>{f.key==="Enter"&&(f.preventDefault(),n.blur()),f.key==="Escape"&&(n.textContent=e,n.blur())}}async function U(){const e=[...a];if(e.length<2)return;const r=prompt("Zip file name:","archive.zip");if(!r)return;const n=window.__tabcomputer?.shell,o=window.__tabcomputer?.terminal;if(!n||!o)return;const p=e.map(g=>`"${x(c,g)}"`).join(" ");o.term.writeln(""),n.execute(`zip "${x(c,r)}" ${p}`,g=>o.term.write(g),g=>o.term.write(`\x1B[31m${g}\x1B[0m`)).then(()=>{o.showPrompt?.(),w(c)})}return await w(c),0}};(globalThis.__tabcomputerLive??=new Map).set("src/commands/finder.ts",G);export{X as finderCmd};
