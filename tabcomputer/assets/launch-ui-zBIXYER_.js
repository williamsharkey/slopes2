import{r as F,p as O,e as N,a as R}from"./launch-state-CEX9REun.js";const D=Object.freeze(Object.defineProperty({__proto__:null,get initLaunchUI(){return B}},Symbol.toStringTag,{value:"Module"})),G=250,P=1e4,U=`
.sd-win.sd-launch-win {
  background: color-mix(in srgb, var(--sd-window) 62%, transparent);
  -webkit-backdrop-filter: saturate(160%) blur(22px); backdrop-filter: saturate(160%) blur(22px);
  box-shadow: var(--sd-shadow-blur), 0 0 0 .5px var(--sd-window-border);
}
.sd-launch-win > .sd-titlebar, .sd-launch-win.sd-focused > .sd-titlebar { background: transparent; border-bottom-color: transparent; }
/* The title bar says the stage too, with a thin progress line under it: when another window
   covers the middle of the placeholder, this strip is usually what still shows */
.sd-launch-win > .sd-titlebar .sd-title, .sd-launch-win.sd-focused > .sd-titlebar .sd-title { font-weight: 400; color: var(--sd-text-2); }
.sd-launch-line { position: absolute; left: 0; right: 0; top: 36px; height: 2px; overflow: hidden; pointer-events: none; background: var(--sd-sep); }
.sd-launch-line > i { display: block; height: 100%; background: linear-gradient(90deg, var(--sd-accent-2), var(--sd-accent)); transition: width .3s var(--sd-ease); }
.sd-launch-line.sd-indeterminate > i { width: 30%; animation: sd-launch-slide 1.5s ease-in-out infinite; }
/* in front, the body says it all: no second stage line, one bar */
.sd-launch-win.sd-focused > .sd-titlebar .sd-title { opacity: 0; }
.sd-launch-win.sd-focused > .sd-launch-line, .sd-launch-win.sd-launch-failed > .sd-launch-line { display: none; }
.sd-launch-win.sd-launch-failed { background: color-mix(in srgb, var(--sd-window) 88%, transparent); }
.sd-launch-win.sd-launch-flash { animation: sd-launch-flash .5s var(--sd-ease) 2; }
@keyframes sd-launch-flash { 50% { box-shadow: var(--sd-shadow-blur), 0 0 0 3px var(--sd-accent); } }
/* The app's window takes this one's place at once: no fade under it */
.sd-win.sd-launch-win.sd-launch-gone { display: none; }
.sd-launch {
  position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: safe center; gap: 6px;
  padding: 4px 20px 18px; overflow: auto; text-align: center; color: var(--sd-text); container-type: size;
}
.sd-launch-icon { width: 64px; height: 64px; flex: none; margin-bottom: 6px; display: grid; place-items: center; opacity: .92; }
.sd-launch-icon img, .sd-launch-icon > svg, .sd-launch-icon .sd-tile { width: 100%; height: 100%; margin: 0; display: block; object-fit: contain; }
.sd-launch-name { font-size: 24px; font-weight: 300; letter-spacing: -.01em; line-height: 1.2; max-width: 100%; overflow-wrap: anywhere; text-wrap: balance; flex: none; }
.sd-launch-stage { font-size: 13px; font-weight: 400; color: var(--sd-text-2); max-width: 100%; flex: none; }
.sd-launch-bar { width: min(280px, 78%); height: 4px; flex: none; margin: 8px 0 2px; border-radius: 2px; background: var(--sd-active); overflow: hidden; position: relative; }
.sd-launch-bar > i { display: block; height: 100%; border-radius: 2px; background: linear-gradient(90deg, var(--sd-accent-2), var(--sd-accent)); transition: width .3s var(--sd-ease); }
.sd-launch-bar.sd-indeterminate > i { width: 34%; animation: sd-launch-slide 1.5s ease-in-out infinite; }
@keyframes sd-launch-slide { from { transform: translateX(-110%); } to { transform: translateX(310%); } }
.sd-launch-amount { font-size: 11.5px; color: var(--sd-text-3); font-variant-numeric: tabular-nums; min-height: 16px; flex: none; }
.sd-launch-note { font-size: 11.5px; color: var(--sd-text-3); flex: none; }
.sd-launch-last { font: 11px/1.4 var(--sd-mono); color: var(--sd-text-3); max-width: min(520px, 100%); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: none; min-height: 15px; }
.sd-launch-error { font-size: 13px; color: var(--sd-text); max-width: min(520px, 100%); user-select: text; -webkit-user-select: text; cursor: text; overflow-wrap: anywhere; flex: none; }
.sd-launch-log {
  width: min(560px, 100%); max-height: 38%; min-height: 48px; flex: 0 1 auto; overflow: auto; margin: 4px 0 0; padding: 8px 10px; text-align: left;
  font: 11px/1.45 var(--sd-mono); white-space: pre-wrap; overflow-wrap: anywhere; color: var(--sd-text-2);
  background: var(--sd-field); border: 1px solid var(--sd-sep); border-radius: 8px; user-select: text; -webkit-user-select: text; cursor: text;
}
.sd-launch-actions { display: flex; gap: 8px; align-items: center; justify-content: center; flex-wrap: wrap; margin-top: 10px; flex: none; }
.sd-launch [hidden] { display: none; }
.sd-launch-more { font-size: 11.5px; }
@container (max-height: 300px) {
  .sd-launch-icon { width: 40px; height: 40px; margin-bottom: 2px; }
  .sd-launch-name { font-size: 18px; }
  .sd-launch-note { display: none; }
  .sd-launch-actions { margin-top: 4px; }
}
/* Shorter still: the name says which app, so the icon goes and Cancel stays in view (#166) */
@container (max-height: 240px) { .sd-launch-icon { display: none; } }
/* A phone on its side: the stage, the bar and the buttons (the menu bar has the name) */
@container (max-height: 190px) {
  .sd-launch { gap: 3px; padding: 0 16px 6px; }
  .sd-launch-icon, .sd-launch-last, .sd-launch-name { display: none; }
  .sd-launch-bar { margin: 4px 0 0; }
  .sd-launch-actions { margin-top: 2px; }
  .sd-launch-actions .sd-btn { height: 24px; }
}
@container (max-height: 150px) { .sd-launch-amount { display: none; } }
/* No motion: the bar of an unknown amount is a still, striped track */
@media (prefers-reduced-motion: reduce) {
  .sd-launch-bar.sd-indeterminate > i, .sd-launch-line.sd-indeterminate > i {
    width: 100%; opacity: .55; transform: none;
    background: repeating-linear-gradient(115deg, var(--sd-accent) 0 6px, transparent 6px 12px);
  }
}
`;function $(h,p){const k=p.geometry(),d=h.windows().filter(l=>l!==p&&l.state!=="minimized"&&l.state!=="closed").map(l=>{const o=l.geometry();return{x:o.x,y:o.y,r:o.x+o.width,b:o.y+o.height+(l.options.decorations==="none"||l.options.override?0:38)}}),f=k.y+19;return[.08,.3,.5,.7,.92].every(l=>{const o=k.x+k.width*l;return d.some(v=>o>=v.x&&o<v.r&&f>=v.y&&f<v.b)})}function X(h){return h.replace(/[&<>"]/g,p=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[p])}function B(h,p,k){if(!document.getElementById("sd-launch-style")){const e=document.createElement("style");e.id="sd-launch-style",e.textContent=U,document.head.appendChild(e)}const d=new Map,f=new Map,l=new Set;let o=null;const v=()=>{for(const e of d.values())e.launch.active&&e.paint();![...d.values()].some(e=>e.launch.active)&&o&&(clearInterval(o),o=null)},C=e=>{const n=d.get(e);if(n)return n;if(!e.info.placeholder||e.stage==="running"||e.stage==="cancelled")return null;const t=f.get(e);t&&(clearTimeout(t),f.delete(e));const a=h.workArea(),s=F(e.id,e.info.size,a),m=document.createElement("div");m.className="sd-launch";const w=e.info.icon??"";m.innerHTML=`
      <div class="sd-launch-icon" aria-hidden="true">${w.trim().startsWith("<")?w:w?`<img src="${X(w)}" alt="">`:""}</div>
      <div class="sd-launch-name"></div>
      <div class="sd-launch-stage" role="status" aria-live="polite"></div>
      <div class="sd-launch-error" role="alert" hidden></div>
      <div class="sd-launch-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100"><i></i></div>
      <div class="sd-launch-amount"></div>
      <div class="sd-launch-note" hidden></div>
      <div class="sd-launch-last" hidden></div>
      <button type="button" class="sd-link sd-launch-more" aria-expanded="false" hidden>Show details</button>
      <pre class="sd-launch-log" tabindex="0" hidden></pre>
      <div class="sd-launch-actions">
        <button type="button" class="sd-btn" data-act="cancel">Cancel</button>
        <button type="button" class="sd-btn" data-act="close" hidden>Close</button>
        <button type="button" class="sd-btn sd-primary" data-act="retry" hidden>Retry</button>
      </div>`;const g=u=>m.querySelector(u);g(".sd-launch-name").textContent=e.info.name;const y=h.compact;let r;const i=h.createWindow({id:O(e.id),appId:e.id,title:`${e.info.name} is starting`,width:s.width,height:s.height,x:s.x,y:s.y,minWidth:220,minHeight:150,behind:!y,focus:y,skipTaskbar:!0,content:{kind:"dom",element:m},onClose:()=>{q(r)}});i.element.classList.add("sd-launch-win"),i.element.dataset.launch=e.id;const c=document.createElement("div");if(c.className="sd-launch-line",c.setAttribute("aria-hidden","true"),c.appendChild(document.createElement("i")),i.element.appendChild(c),r={launch:e,win:i,remembered:s.remembered,touched:!1,details:!1,said:"",paint:()=>H(r,m)},!s.remembered&&!y&&i.state==="normal"&&$(h,i)){const u=i.geometry();i.move(u.x,0),$(h,i)&&i.move(u.x,u.y)}return i.on("move",()=>{r.touched=!0}),i.on("resize",()=>{r.touched=!0}),m.addEventListener("click",u=>{const b=u.target.closest("[data-act]")?.dataset.act;if(b==="cancel"||b==="close")i.close();else if(b==="retry"){const T=e.info.retry;i.close(),T?.()}else u.target.closest(".sd-launch-more")&&(r.details=!r.details,r.paint())}),d.set(e,r),r.paint(),o??=setInterval(v,1e3),r},q=e=>{if(!e||!d.has(e.launch))return;d.delete(e.launch);const n=e.launch;if(n.active){const t=n.cancel();t&&k.toast(t)}else p.dismiss(n)},H=(e,n)=>{const t=e.launch,a=S=>n.querySelector(S),s=t.stage==="failed";e.win.element.classList.toggle("sd-launch-failed",s);const m=a(".sd-launch-stage"),w=a(".sd-launch-error"),g=t.text();e.said!==g&&(e.said=g,s?w.textContent=g:m.textContent=g),m.hidden=s,w.hidden=!s;const y=Date.now()-t.stageAt,r=!s&&(t.stage==="starting"||t.stage==="window")&&y>=P,i=a(".sd-launch-bar");i.hidden=s;const c=t.fraction();i.classList.toggle("sd-indeterminate",c===null);const u=i.firstElementChild;c===null?(u.style.width="",i.removeAttribute("aria-valuenow")):(u.style.width=`${(c*100).toFixed(1)}%`,i.setAttribute("aria-valuenow",String(Math.round(c*100))));const b=e.win.element.querySelector(":scope > .sd-launch-line");b&&(b.classList.toggle("sd-indeterminate",c===null),b.firstElementChild.style.width=c===null?"":`${(c*100).toFixed(1)}%`),i.setAttribute("aria-label",`${t.info.name}: ${g}`);const T=a(".sd-launch-amount");T.textContent=s?"":t.amountText()||(r?N(y):""),T.hidden=s;const A=a(".sd-launch-note");A.textContent=t.info.note??"",A.hidden=s||!t.info.note||t.stage==="installing"||t.stage==="requested";const _=a(".sd-launch-last"),L=a(".sd-launch-more"),x=a(".sd-launch-log"),z=t.lines.length>0||!!t.lastLine(),E=e.details||s&&z;if(_.textContent=t.lastLine(),_.hidden=!z||E,L.hidden=!z||s,L.textContent=e.details?"Hide details":"Show details",L.setAttribute("aria-expanded",String(e.details)),x.hidden=!E,E){const S=t.lines.slice(-80).join(`
`);if(x.textContent!==S){const j=x.scrollTop+x.clientHeight>=x.scrollHeight-4;x.textContent=S,j&&(x.scrollTop=x.scrollHeight)}}a("[data-act=cancel]").hidden=s,a("[data-act=close]").hidden=!s,a("[data-act=retry]").hidden=!s||!t.info.retry,e.win.setTitle(s?`${t.info.name} did not start`:`${t.info.name} — ${g}`)},I=(e,n)=>{const t=n.firstWindow;if(t&&typeof t.geometry=="function"&&t.state!=="closed"){if(e&&e.win.state!=="closed"&&!h.compact&&t.state==="normal"&&(e.win.state==="normal"||e.win.state==="minimized")){const a=e.win.geometry();t.move(a.x,a.y),(e.remembered||e.touched)&&t.options.resizable!==!1&&t.resize(a.width,a.height);const s=t.element;s.style.transition="none",s.classList.remove("sd-opening"),s.offsetWidth,s.style.transition=""}M(n.id,t)}e&&(d.delete(n),e.win.element.classList.add("sd-launch-gone"),e.win.close(!0))},M=(e,n)=>{let t=null;const a=()=>{t=null,n.state==="normal"&&R(e,n.geometry())},s=()=>{t||(t=setTimeout(a,400))};n.on("move",s),n.on("resize",s),n.on("close",()=>{t&&clearTimeout(t)}),s()},W=p.on((e,n)=>{const t=d.get(n);if(e==="request"){n.info.placeholder&&f.set(n,setTimeout(()=>{f.delete(n),n.active&&C(n)},G));return}if(e==="again"){const a=t??C(n);if(!a)return;a.win.focus(),a.win.element.classList.remove("sd-launch-flash"),a.win.element.offsetWidth,a.win.element.classList.add("sd-launch-flash");return}if(e==="stage"){if(n.stage==="running"){I(t,n);return}if(n.stage==="cancelled"){t&&(d.delete(n),t.win.close(!0));return}if(n.stage==="failed"){const a=t??C(n);a&&(a.paint(),h.raise(a.win));return}if(!t&&n.stage==="installing"){C(n);return}}if(e==="end"){const a=f.get(n);a&&(clearTimeout(a),f.delete(n)),t&&d.get(n)===t&&(d.delete(n),t.win.close(!0));return}t&&!l.has(t)&&(l.add(t),requestAnimationFrame(()=>{l.delete(t),d.get(n)===t&&t.paint()}))});for(const e of p.list())e.info.placeholder&&C(e);return()=>{W(),o&&clearInterval(o);for(const e of f.values())clearTimeout(e)}}(globalThis.__tabcomputerLive??=new Map).set("src/desktop/launch-ui.ts",D);export{B as initLaunchUI};
