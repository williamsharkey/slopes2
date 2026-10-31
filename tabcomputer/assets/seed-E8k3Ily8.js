import{c as M,b as F,d as O,g as R}from"./index-BIxBofyG.js";const W=Object.freeze(Object.defineProperty({__proto__:null,get seedCmd(){return N}},Symbol.toStringTag,{value:"Module"})),v="0.1.0";function b(e){let n="";for(let r=0;r<e.length;r++)n+=String.fromCharCode(e[r]);return btoa(n)}async function x(e){const n=new CompressionStream("gzip"),r=n.writable.getWriter();r.write(e),r.close();const t=[],o=n.readable.getReader();for(;;){const{done:c,value:l}=await o.read();if(c)break;t.push(l)}const s=t.reduce((c,l)=>c+l.length,0),a=new Uint8Array(s);let m=0;for(const c of t)a.set(c,m),m+=c.length;return a}function T(e){const n=[],r=[{name:"OpenAI",pattern:/^sk-[a-zA-Z0-9-_]{20,}$/},{name:"Anthropic",pattern:/^sk-ant-[a-zA-Z0-9-_]{20,}$/},{name:"Google",pattern:/^AIza[a-zA-Z0-9-_]{30,}$/},{name:"GitHub",pattern:/^gh[ps]_[a-zA-Z0-9]{36,}$/},{name:"Stripe",pattern:/^sk_(test|live)_[a-zA-Z0-9]{20,}$/},{name:"AWS",pattern:/^AKIA[A-Z0-9]{16}$/}];for(const[t,o]of Object.entries(e)){const s=t.toLowerCase();if(s.includes("key")||s.includes("token")||s.includes("secret")){for(const{name:a,pattern:m}of r)if(m.test(o)){n.push(a);break}if(o.length>20&&/^[a-zA-Z0-9-_]+$/.test(o)&&!n.includes(t)){const a=t.replace(/^shiro_/,"").replace(/_/g," ");n.some(m=>a.toLowerCase().includes(m.toLowerCase()))||n.push(a)}}}return[...new Set(n)]}function j(e,n,r,t){const o=c=>c.replace(/\\/g,"\\\\").replace(/`/g,"\\`").replace(/\$/g,"\\$"),s=o(n),a=o(r);return`${`// shiro seed v${t.version} | ${t.files} files, ${t.dirs} dirs | ${t.sizeMB} MB`}
(function(){
  if(document.getElementById('shiro-seed')){console.log('tabcomputer already seeded');return}
  var host=document.createElement('div');host.id='shiro-seed';
  var root=host.attachShadow?host.attachShadow({mode:'open'}):host;
  var w=document.createElement('div');
  var S=w.style;S.position='fixed';S.bottom='20px';S.right='20px';S.width='32em';S.height='22em';
  S.zIndex='2147483647';S.borderRadius='8px';S.overflow='hidden';
  S.boxShadow='rgb(206,170,227) 0px 5px 11px -3px';S.opacity='0.88';S.backdropFilter='blur(8px)';
  S.fontFamily='-apple-system,BlinkMacSystemFont,sans-serif';S.display='flex';S.flexDirection='column';
  var tb=document.createElement('div');
  var T=tb.style;T.background='#1a1a2e';T.height='32px';T.display='flex';T.alignItems='center';
  T.padding='0 10px';T.cursor='grab';T.userSelect='none';T.flexShrink='0';
  var dots=document.createElement('div');dots.style.display='flex';dots.style.gap='6px';
  function mkDot(col,icon){
    var d=document.createElement('div');d.style.cssText='width:14px;height:14px;border-radius:50%;background:'+col+';cursor:pointer;position:relative;margin:auto 0';
    var ic=document.createElement('span');ic.textContent=icon;ic.style.cssText='position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:9px;line-height:1;color:#333;opacity:0;pointer-events:none;transition:opacity 0.12s';
    d.appendChild(ic);d.onmouseenter=function(){ic.style.opacity='0.8'};d.onmouseleave=function(){ic.style.opacity='0'};return d;
  }
  var close=mkDot('#ff5f57','\\u00b7');
  close.onclick=function(){host.remove()};
  var mini=mkDot('#febc2e','\\u2013');
  var minimized=false;
  mini.onclick=function(){
    minimized=!minimized;
    iframe.style.display=minimized?'none':'block';
    rh.style.display=minimized?'none':'block';
    w.style.height=minimized?'32px':savedH+'px';
    if(!minimized)setTimeout(focusShiro,0);
  };
  dots.appendChild(close);dots.appendChild(mini);
  var title=document.createElement('span');title.textContent='shiro';
  var ts=title.style;ts.color='#8888cc';ts.fontSize='13px';ts.fontWeight='600';ts.marginLeft='10px';ts.flex='1';
  /* Font size controls - hidden until hover */
  var fontSize=14;
  var zoomWrap=document.createElement('div');zoomWrap.style.cssText='display:flex;gap:4px;opacity:0;transition:opacity 0.15s';
  var zoomOut=document.createElement('div');zoomOut.textContent='\\u2212';
  zoomOut.style.cssText='width:14px;height:14px;border-radius:50%;background:#555;color:#fff;font-size:12px;line-height:14px;text-align:center;cursor:pointer';
  var zoomIn=document.createElement('div');zoomIn.textContent='+';
  zoomIn.style.cssText='width:14px;height:14px;border-radius:50%;background:#555;color:#fff;font-size:12px;line-height:14px;text-align:center;cursor:pointer';
  zoomOut.onclick=function(e){e.stopPropagation();fontSize=Math.max(8,fontSize-1);iframe.contentWindow.postMessage({type:'shiro-fontsize',size:fontSize},'*')};
  zoomIn.onclick=function(e){e.stopPropagation();fontSize=Math.min(24,fontSize+1);iframe.contentWindow.postMessage({type:'shiro-fontsize',size:fontSize},'*')};
  zoomWrap.appendChild(zoomOut);zoomWrap.appendChild(zoomIn);
  tb.onmouseenter=function(){zoomWrap.style.opacity='1'};
  tb.onmouseleave=function(){zoomWrap.style.opacity='0'};
  tb.appendChild(dots);tb.appendChild(title);tb.appendChild(zoomWrap);
  var iframe=document.createElement('iframe');iframe.src='${e}';
  var is=iframe.style;is.border='none';is.width='100%';is.flex='1';is.display='block';is.pointerEvents='auto';is.background='#0a0a1a';
  iframe.tabIndex=0;iframe.title='tabcomputer';
  iframe.allow='clipboard-read; clipboard-write; cross-origin-isolated';
  var rh=document.createElement('div');var rs=rh.style;
  rs.position='absolute';rs.bottom='0';rs.right='0';rs.width='16px';rs.height='16px';
  rs.cursor='nwse-resize';rs.background='linear-gradient(135deg,transparent 50%,#555 50%)';
  w.appendChild(tb);w.appendChild(iframe);w.appendChild(rh);
  root.appendChild(w);document.body.appendChild(host);
  function focusShiro(){
    iframe.style.pointerEvents='auto';
    try{iframe.focus()}catch(ex){}
    try{iframe.contentWindow&&iframe.contentWindow.focus&&iframe.contentWindow.focus()}catch(ex){}
    try{iframe.contentWindow&&iframe.contentWindow.postMessage({type:'shiro-focus-terminal'},'*')}catch(ex){}
  }
  var dx=0,dy=0,sx=0,sy=0,dragging=false;
  tb.onmousedown=function(e){dragging=true;sx=e.clientX;sy=e.clientY;
    var r=w.getBoundingClientRect();dx=r.left;dy=r.top;
    tb.style.cursor='grabbing';iframe.style.pointerEvents='none';e.preventDefault()};
  document.addEventListener('mousemove',function(e){
    if(dragging){w.style.left=(dx+e.clientX-sx)+'px';w.style.top=(dy+e.clientY-sy)+'px';
      w.style.right='auto';w.style.bottom='auto'}
    if(resizing){var rr=w.getBoundingClientRect();
      var nw=Math.max(300,e.clientX-rr.left);var nh=Math.max(200,e.clientY-rr.top);
      w.style.width=nw+'px';w.style.height=nh+'px';savedH=nh}});
  document.addEventListener('mouseup',function(){dragging=false;resizing=false;tb.style.cursor='grab';iframe.style.pointerEvents='auto'});
  var resizing=false,savedH=w.offsetHeight||352;
  rh.onmousedown=function(e){resizing=true;iframe.style.pointerEvents='none';e.preventDefault();e.stopPropagation()};
  /* Click on wrapper focuses iframe and terminal for keyboard input */
  iframe.onmousedown=function(){focusShiro()};
  iframe.ontouchstart=function(){focusShiro()};
  w.addEventListener('mousedown',function(e){if(e.target===iframe||iframe.contains(e.target)){focusShiro()}});
  /* NDJSON seed data - parsed incrementally */
  var SEED_FS=\`${s}\`;
  var SEED_STORAGE=\`${a}\`;
  function buildContext(){
    return {
      mode:'seed',
      injected:true,
      hcOuterAvailable:true,
      sameOriginParentAccess:false,
      hostUrl:location.href,
      hostOrigin:location.origin,
      hostTitle:document.title||'',
      createdAt:new Date().toISOString()
    };
  }
  var seeded=false,seedReady=false;
  function maybeSeed(){
    if(seeded||!seedReady||!iframe.contentWindow)return;
    seeded=true;
    iframe.contentWindow.postMessage({type:'shiro-seed-v2',ndjson:SEED_FS,storage:SEED_STORAGE,context:buildContext()},'*');
  }
  window.addEventListener('message',function(e){
    if(e.source===iframe.contentWindow&&e.data&&e.data.type==='shiro-seed-ready'){
      seedReady=true;
      maybeSeed();
    }
  });
  iframe.onload=function(){
    setTimeout(focusShiro,0);
    maybeSeed();
  };
  /* HC bridge: lets the Shiro iframe run HC commands against the host DOM */
  (function(){
    var cur=document.body,lastR=[],lastG=null;
    function _t(el,lim){var t=(el.textContent||'').replace(/\\s+/g,' ').trim();return lim&&t.length>lim?t.slice(0,lim)+'…':t}
    function _d(el){var d=0;while(el&&el!==document.body&&el!==document.documentElement){d++;el=el.parentElement}return d}
    function exec(cmd){
      cmd=cmd.trim();var m;
      if(cmd.includes(';')&&!cmd.startsWith(';'))return cmd.split(';').map(function(c){return c.trim()}).filter(Boolean).map(exec).join('\\n---\\n');
      if(cmd==='s')return 'p:outer c:'+lastR.length+' d:'+_d(cur)+' @'+(cur.tagName||'doc').toLowerCase();
      if(cmd==='t')return _t(cur);
      if((m=cmd.match(/^t(\\d+)$/)))return _t(cur,parseInt(m[1]));
      if(cmd.startsWith('q1 ')){try{var el=document.querySelector(cmd.slice(3).trim());if(!el)return '∅';cur=el;lastR=[el];return _t(el).slice(0,200)}catch(e){return '✗ '+e.message}}
      if(cmd.startsWith('q ')){try{var els=Array.from(document.querySelectorAll(cmd.slice(2).trim()));lastR=els;if(!els.length)return '∅';return els.slice(0,10).map(function(el,i){return '['+i+']'+_t(el).slice(0,60)}).join('\\n')}catch(e){return '✗ '+e.message}}
      if((m=cmd.match(/^n(\\d+)$/))){var idx=parseInt(m[1]);if(idx>=lastR.length)return '✗ out of range';cur=lastR[idx];return '✓ ['+idx+'] '+_t(cur).slice(0,100)}
      if(cmd==='up'){if(cur.parentElement)cur=cur.parentElement;return '✓ @'+(cur.tagName||'').toLowerCase()}
      if((m=cmd.match(/^up(\\d+)$/))){for(var i=0;i<parseInt(m[1]);i++)if(cur.parentElement)cur=cur.parentElement;return '✓ @'+(cur.tagName||'').toLowerCase()}
      if(cmd==='ch'){var ch=Array.from(cur.children);if(!ch.length)return '∅ no children';return ch.slice(0,15).map(function(c,i){var tag=c.tagName.toLowerCase();var cls=c.className?'.'+String(c.className).split(' ')[0]:'';return '['+i+']<'+tag+cls+'>'+_t(c).slice(0,30)}).join('\\n')}
      if(cmd.startsWith('g ')){var lines=(cur.textContent||'').split('\\n');var re=new RegExp(cmd.slice(2).trim(),'gi');var matches=[];lines.forEach(function(line,i){if(re.test(line)){var clean=line.replace(/\\s+/g,' ').trim();if(clean)matches.push('L'+(i+1)+': '+clean.slice(0,60))}});return matches.length?matches.slice(0,10).join('\\n'):'∅ no matches'}
      if(cmd==='look'){var inter=cur.querySelectorAll('a,button,input,select,textarea,[onclick],[href],.btn,[role=button]');var items=[];inter.forEach(function(el,idx){var text=(el.textContent||el.value||el.placeholder||el.getAttribute('title')||el.getAttribute('aria-label')||'').replace(/\\s+/g,' ').trim().slice(0,20);if(text||el.tagName.toLowerCase()==='input')items.push({text:text||'['+(el.type||'input')+']',el:el,idx:idx})});lastG=items;if(!items.length)return '∅ no interactive elements';var out=items.length+' elements\\n';items.slice(0,20).forEach(function(item,i){var tag=item.el.tagName.toLowerCase();var href=item.el.getAttribute('href');out+='@'+i+' <'+tag+'> "'+item.text+'"'+(href?' →'+href.slice(0,25):'')+' \\n'});return out.trim()}
      if((m=cmd.match(/^@(\\d+)$/))){if(!lastG||parseInt(m[1])>=lastG.length)return '✗ call look first or index out of range';var it=lastG[parseInt(m[1])];try{it.el.click()}catch(e){}return '✓ clicked "'+it.text+'"'}
      if(cmd==='a'){if(!cur.attributes)return '∅';var attrs=[];for(var j=0;j<cur.attributes.length;j++){var at=cur.attributes[j];attrs.push(at.name+'='+at.value.slice(0,30))}return attrs.length?attrs.join(' '):'∅ no attrs'}
      if(cmd==='h')return cur.outerHTML;
      if((m=cmd.match(/^h(\\d+)$/))){var html=cur.outerHTML;var lim=parseInt(m[1]);return html.length>lim?html.slice(0,lim)+'…[truncated]':html}
      return '✗ unknown: '+cmd;
    }
    window.addEventListener('message',function(e){
      if(e.data&&e.data.type==='shiro-hc'){
        var result;try{result=exec(e.data.cmd)}catch(err){result='✗ '+err.message}
        e.source.postMessage({type:'shiro-hc-result',id:e.data.id,result:result},'*');
      }
    });
  })();
})();`}function C(){if(typeof window>"u")return null;const n=window.location.hostname.match(/^([^.]+)\.shiro\.computer$/);return n?n[1]:null}function D(e){if(e)return`https://${e}.shiro.computer/`;const n=C();return n?`https://${n}.shiro.computer/`:"https://shiro.computer/"}async function B(){const e=window.location?.href||document.baseURI||"https://shiro.computer/",n=(()=>{try{return new URL(e,"https://shiro.computer/").origin}catch{return"https://shiro.computer"}})();let r=null;try{const c=await fetch(e,{cache:"no-store"});if(!c.ok)throw new Error(`HTTP ${c.status}`);const l=await c.text();typeof DOMParser<"u"&&(r=new DOMParser().parseFromString(l,"text/html"))}catch(c){console.warn(`Failed to fetch canonical HTML: ${e}`,c)}(!r||!r.documentElement)&&(r=document.cloneNode(!0)),r.getElementById("shiro-seed")?.remove();const t=r.getElementById("terminal");t&&(t.innerHTML="");let o=r.head;o||(o=r.createElement("head"),r.documentElement.insertBefore(o,r.body||null));let s=o.querySelector("base");s||(s=r.createElement("base"),o.insertBefore(s,o.firstChild)),s.setAttribute("href",`${n}/`);const a=r.querySelectorAll("script[src]");for(const c of a){const l=c.getAttribute("src");if(l)try{const u=new URL(l,e).href,f=await(await fetch(u)).text(),g=r.createElement("script"),d=c.getAttribute("type");d&&g.setAttribute("type",d),g.textContent=f,c.parentNode?.replaceChild(g,c)}catch(u){console.warn(`Failed to inline script: ${l}`,u)}}const m=r.querySelectorAll('link[rel="stylesheet"]');for(const c of m){const l=c.getAttribute("href");if(l)try{const u=new URL(l,e).href,f=await(await fetch(u)).text(),g=r.createElement("style");g.textContent=f,c.parentNode?.replaceChild(g,c)}catch(u){console.warn(`Failed to inline stylesheet: ${l}`,u)}}return`<!DOCTYPE html>
`+r.documentElement.outerHTML}function U(e,n,r,t){return`${`// shiro blob seed v${t.version} | ${t.files} files | ${(t.compressedSize/1024).toFixed(0)}KB compressed`}
(async function(){
  if(document.getElementById('shiro-seed')){console.log('tabcomputer already seeded');return}
  async function _dc(b){var a=atob(b),u=new Uint8Array(a.length),i=0;for(;i<a.length;)u[i]=a.charCodeAt(i++);var s=new DecompressionStream('gzip'),w=s.writable.getWriter();w.write(u);w.close();var r=s.readable.getReader(),c=[],v;while(!(v=await r.read()).done)c.push(v.value);var t=0,x;for(x of c)t+=x.length;var o=new Uint8Array(t),p=0;for(x of c){o.set(x,p);p+=x.length}return new TextDecoder().decode(o)}
  var html=await _dc('${e}');
  var blob=new Blob([html],{type:'text/html'});
  var blobUrl=URL.createObjectURL(blob);
  var _fsP=_dc('${n}');
  var _lsP=_dc('${r}');
  var host=document.createElement('div');host.id='shiro-seed';
  var root=host.attachShadow?host.attachShadow({mode:'open'}):host;
  var w=document.createElement('div');
  var S=w.style;S.position='fixed';S.bottom='20px';S.right='20px';S.width='32em';S.height='22em';
  S.zIndex='2147483647';S.borderRadius='8px';S.overflow='hidden';
  S.boxShadow='rgb(206,170,227) 0px 5px 11px -3px';S.opacity='0.88';S.backdropFilter='blur(8px)';
  S.fontFamily='-apple-system,BlinkMacSystemFont,sans-serif';S.display='flex';S.flexDirection='column';
  var tb=document.createElement('div');
  var T=tb.style;T.background='#1a1a2e';T.height='32px';T.display='flex';T.alignItems='center';
  T.padding='0 10px';T.cursor='grab';T.userSelect='none';T.flexShrink='0';
  var dots=document.createElement('div');dots.style.display='flex';dots.style.gap='6px';
  function mkDot(col,icon){
    var d=document.createElement('div');d.style.cssText='width:14px;height:14px;border-radius:50%;background:'+col+';cursor:pointer;position:relative;margin:auto 0';
    var ic=document.createElement('span');ic.textContent=icon;ic.style.cssText='position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:9px;line-height:1;color:#333;opacity:0;pointer-events:none;transition:opacity 0.12s';
    d.appendChild(ic);d.onmouseenter=function(){ic.style.opacity='0.8'};d.onmouseleave=function(){ic.style.opacity='0'};return d;
  }
  var close=mkDot('#ff5f57','\\u00b7');
  close.onclick=function(){URL.revokeObjectURL(blobUrl);host.remove()};
  var mini=mkDot('#febc2e','\\u2013');
  var minimized=false;
  mini.onclick=function(){
    minimized=!minimized;
    iframe.style.display=minimized?'none':'block';
    rh.style.display=minimized?'none':'block';
    w.style.height=minimized?'32px':savedH+'px';
    if(!minimized)setTimeout(focusShiro,0);
  };
  dots.appendChild(close);dots.appendChild(mini);
  var title=document.createElement('span');title.textContent='shiro';
  var ts=title.style;ts.color='#8888cc';ts.fontSize='13px';ts.fontWeight='600';ts.marginLeft='10px';ts.flex='1';
  var fontSize=14;
  var zoomWrap=document.createElement('div');zoomWrap.style.cssText='display:flex;gap:4px;opacity:0;transition:opacity 0.15s';
  var zoomOut=document.createElement('div');zoomOut.textContent='\\u2212';
  zoomOut.style.cssText='width:14px;height:14px;border-radius:50%;background:#555;color:#fff;font-size:12px;line-height:14px;text-align:center;cursor:pointer';
  var zoomIn=document.createElement('div');zoomIn.textContent='+';
  zoomIn.style.cssText='width:14px;height:14px;border-radius:50%;background:#555;color:#fff;font-size:12px;line-height:14px;text-align:center;cursor:pointer';
  zoomOut.onclick=function(e){e.stopPropagation();fontSize=Math.max(8,fontSize-1);iframe.contentWindow.postMessage({type:'shiro-fontsize',size:fontSize},'*')};
  zoomIn.onclick=function(e){e.stopPropagation();fontSize=Math.min(24,fontSize+1);iframe.contentWindow.postMessage({type:'shiro-fontsize',size:fontSize},'*')};
  zoomWrap.appendChild(zoomOut);zoomWrap.appendChild(zoomIn);
  tb.onmouseenter=function(){zoomWrap.style.opacity='1'};
  tb.onmouseleave=function(){zoomWrap.style.opacity='0'};
  tb.appendChild(dots);tb.appendChild(title);tb.appendChild(zoomWrap);
  var iframe=document.createElement('iframe');iframe.src=blobUrl;
  var is=iframe.style;is.border='none';is.width='100%';is.flex='1';is.display='block';is.pointerEvents='auto';is.background='#0a0a1a';
  iframe.tabIndex=0;iframe.title='tabcomputer';
  iframe.allow='clipboard-read; clipboard-write; cross-origin-isolated';
  var rh=document.createElement('div');var rs=rh.style;
  rs.position='absolute';rs.bottom='0';rs.right='0';rs.width='16px';rs.height='16px';
  rs.cursor='nwse-resize';rs.background='linear-gradient(135deg,transparent 50%,#555 50%)';
  w.appendChild(tb);w.appendChild(iframe);w.appendChild(rh);
  root.appendChild(w);document.body.appendChild(host);
  function focusShiro(){
    iframe.style.pointerEvents='auto';
    try{iframe.focus()}catch(ex){}
    try{iframe.contentWindow&&iframe.contentWindow.focus&&iframe.contentWindow.focus()}catch(ex){}
    try{iframe.contentWindow&&iframe.contentWindow.postMessage({type:'shiro-focus-terminal'},'*')}catch(ex){}
  }
  var dx=0,dy=0,sx=0,sy=0,dragging=false;
  tb.onmousedown=function(e){dragging=true;sx=e.clientX;sy=e.clientY;
    var r=w.getBoundingClientRect();dx=r.left;dy=r.top;
    tb.style.cursor='grabbing';iframe.style.pointerEvents='none';e.preventDefault()};
  document.addEventListener('mousemove',function(e){
    if(dragging){w.style.left=(dx+e.clientX-sx)+'px';w.style.top=(dy+e.clientY-sy)+'px';
      w.style.right='auto';w.style.bottom='auto'}
    if(resizing){var rr=w.getBoundingClientRect();
      var nw=Math.max(300,e.clientX-rr.left);var nh=Math.max(200,e.clientY-rr.top);
      w.style.width=nw+'px';w.style.height=nh+'px';savedH=nh}});
  document.addEventListener('mouseup',function(){dragging=false;resizing=false;tb.style.cursor='grab';iframe.style.pointerEvents='auto'});
  var resizing=false,savedH=w.offsetHeight||352;
  rh.onmousedown=function(e){resizing=true;iframe.style.pointerEvents='none';e.preventDefault();e.stopPropagation()};
  iframe.onmousedown=function(){focusShiro()};
  iframe.ontouchstart=function(){focusShiro()};
  w.addEventListener('mousedown',function(e){if(e.target===iframe||iframe.contains(e.target)){focusShiro()}});
  function buildContext(){
    return {
      mode:'seed-blob',
      injected:true,
      hcOuterAvailable:true,
      sameOriginParentAccess:true,
      hostUrl:location.href,
      hostOrigin:location.origin,
      hostTitle:document.title||'',
      createdAt:new Date().toISOString()
    };
  }
  var seeded=false,seedReady=false;
  async function maybeSeed(){
    if(seeded||!seedReady||!iframe.contentWindow)return;
    seeded=true;
    iframe.contentWindow.postMessage({type:'shiro-seed-v2',ndjson:await _fsP,storage:await _lsP,context:buildContext()},'*');
  }
  window.addEventListener('message',function(e){
    if(e.source===iframe.contentWindow&&e.data&&e.data.type==='shiro-seed-ready'){
      seedReady=true;
      maybeSeed();
    }
  });
  iframe.onload=function(){
    setTimeout(focusShiro,0);
    maybeSeed();
  };
  (function(){
    var cur=document.body,lastR=[],lastG=null;
    function _t(el,lim){var t=(el.textContent||'').replace(/\\s+/g,' ').trim();return lim&&t.length>lim?t.slice(0,lim)+'\\u2026':t}
    function _d(el){var d=0;while(el&&el!==document.body&&el!==document.documentElement){d++;el=el.parentElement}return d}
    function exec(cmd){
      cmd=cmd.trim();var m;
      if(cmd.includes(';')&&!cmd.startsWith(';'))return cmd.split(';').map(function(c){return c.trim()}).filter(Boolean).map(exec).join('\\n---\\n');
      if(cmd==='s')return 'p:outer c:'+lastR.length+' d:'+_d(cur)+' @'+(cur.tagName||'doc').toLowerCase();
      if(cmd==='t')return _t(cur);
      if((m=cmd.match(/^t(\\d+)$/)))return _t(cur,parseInt(m[1]));
      if(cmd.startsWith('q1 ')){try{var el=document.querySelector(cmd.slice(3).trim());if(!el)return '\\u2205';cur=el;lastR=[el];return _t(el).slice(0,200)}catch(e){return '\\u2717 '+e.message}}
      if(cmd.startsWith('q ')){try{var els=Array.from(document.querySelectorAll(cmd.slice(2).trim()));lastR=els;if(!els.length)return '\\u2205';return els.slice(0,10).map(function(el,i){return '['+i+']'+_t(el).slice(0,60)}).join('\\n')}catch(e){return '\\u2717 '+e.message}}
      if((m=cmd.match(/^n(\\d+)$/))){var idx=parseInt(m[1]);if(idx>=lastR.length)return '\\u2717 out of range';cur=lastR[idx];return '\\u2713 ['+idx+'] '+_t(cur).slice(0,100)}
      if(cmd==='up'){if(cur.parentElement)cur=cur.parentElement;return '\\u2713 @'+(cur.tagName||'').toLowerCase()}
      if((m=cmd.match(/^up(\\d+)$/))){for(var i=0;i<parseInt(m[1]);i++)if(cur.parentElement)cur=cur.parentElement;return '\\u2713 @'+(cur.tagName||'').toLowerCase()}
      if(cmd==='ch'){var ch=Array.from(cur.children);if(!ch.length)return '\\u2205 no children';return ch.slice(0,15).map(function(c,i){var tag=c.tagName.toLowerCase();var cls=c.className?'.'+String(c.className).split(' ')[0]:'';return '['+i+']<'+tag+cls+'>'+_t(c).slice(0,30)}).join('\\n')}
      if(cmd.startsWith('g ')){var lines=(cur.textContent||'').split('\\n');var re=new RegExp(cmd.slice(2).trim(),'gi');var matches=[];lines.forEach(function(line,i){if(re.test(line)){var clean=line.replace(/\\s+/g,' ').trim();if(clean)matches.push('L'+(i+1)+': '+clean.slice(0,60))}});return matches.length?matches.slice(0,10).join('\\n'):'\\u2205 no matches'}
      if(cmd==='look'){var inter=cur.querySelectorAll('a,button,input,select,textarea,[onclick],[href],.btn,[role=button]');var items=[];inter.forEach(function(el,idx){var text=(el.textContent||el.value||el.placeholder||el.getAttribute('title')||el.getAttribute('aria-label')||'').replace(/\\s+/g,' ').trim().slice(0,20);if(text||el.tagName.toLowerCase()==='input')items.push({text:text||'['+(el.type||'input')+']',el:el,idx:idx})});lastG=items;if(!items.length)return '\\u2205 no interactive elements';var out=items.length+' elements\\n';items.slice(0,20).forEach(function(item,i){var tag=item.el.tagName.toLowerCase();var href=item.el.getAttribute('href');out+='@'+i+' <'+tag+'> "'+item.text+'"'+(href?' \\u2192'+href.slice(0,25):'')+' \\n'});return out.trim()}
      if((m=cmd.match(/^@(\\d+)$/))){if(!lastG||parseInt(m[1])>=lastG.length)return '\\u2717 call look first or index out of range';var it=lastG[parseInt(m[1])];try{it.el.click()}catch(e){}return '\\u2713 clicked "'+it.text+'"'}
      if(cmd==='a'){if(!cur.attributes)return '\\u2205';var attrs=[];for(var j=0;j<cur.attributes.length;j++){var at=cur.attributes[j];attrs.push(at.name+'='+at.value.slice(0,30))}return attrs.length?attrs.join(' '):'\\u2205 no attrs'}
      if(cmd==='h')return cur.outerHTML;
      if((m=cmd.match(/^h(\\d+)$/))){var html2=cur.outerHTML;var lim=parseInt(m[1]);return html2.length>lim?html2.slice(0,lim)+'\\u2026[truncated]':html2}
      return '\\u2717 unknown: '+cmd;
    }
    window.addEventListener('message',function(e){
      if(e.data&&e.data.type==='shiro-hc'){
        var result;try{result=exec(e.data.cmd)}catch(err){result='\\u2717 '+err.message}
        e.source.postMessage({type:'shiro-hc-result',id:e.data.id,result:result},'*');
      }
    });
  })();
})();`}const N={name:"seed",description:"Export tabcomputer state (seed [blob|gif|html|share] [subdomain])",async exec(e){if(e.args[0]==="gif")return K(e);if(e.args[0]==="html")return G(e);if(e.args[0]==="share")return P(e);const n=e.args[0]==="blob",r=n?e.args[1]:e.args[0],t=D(r);try{let o="",s=0,a=0;if(n){e.stdout=`Inlining document resources...
`;const p=await B();s=p.length,e.stdout+=`  HTML size: ${(s/1024).toFixed(0)} KB
`,e.stdout+=`Compressing...
`;const y=new TextEncoder().encode(p),z=await x(y);a=z.length,o=b(z),e.stdout+=`  Compressed: ${(a/1024).toFixed(0)} KB (${((1-a/s)*100).toFixed(0)}% reduction)
`}const m=await e.fs.exportAll();let c=0,l=0,u=0;const i=[];for(const p of m){p.type==="file"?(c++,u+=p.size||0):p.type==="dir"&&l++;const y={path:p.path,type:p.type,content:p.content?b(p.content):null,mode:p.mode,mtime:p.mtime,ctime:p.ctime,size:p.size,symlinkTarget:p.symlinkTarget};i.push(JSON.stringify(y))}const f=i.join(`
`),g={};for(let p=0;p<localStorage.length;p++){const y=localStorage.key(p);g[y]=localStorage.getItem(y)}const d=JSON.stringify(g),w=T(g),E={version:v,files:c,dirs:l,totalBytes:u,sizeKB:Math.round(u/1024),sizeMB:(u/(1024*1024)).toFixed(2),detectedKeys:w};let S;if(n){e.stdout+=`Compressing filesystem data...
`;const p=await x(new TextEncoder().encode(f)),y=b(p),z=await x(new TextEncoder().encode(d)),A=b(z);e.stdout+=`  FS compressed: ${(p.length/1024).toFixed(0)} KB (was ${(f.length/1024).toFixed(0)} KB)
`,S=U(o,y,A,{...E,htmlSize:s,compressedSize:a})}else S=j(t,f,d,E);const k=S.length/1024,I=k.toFixed(0),_=(S.length/(1024*1024)).toFixed(2);await navigator.clipboard.writeText(S);let h=`
`;if(h+=`  tabcomputer ${n?"Blob ":""}Seed v${v}
`,h+=`  ${"─".repeat(30)}
`,n?(h+=`  Mode:        self-contained blob (CSP-safe)
`,h+=`  HTML size:   ${(s/1024).toFixed(0)} KB
`,h+=`  Compressed:  ${(a/1024).toFixed(0)} KB
`):h+=`  Target:      ${t}
`,h+=`  Files:       ${c}
`,h+=`  Directories: ${l}
`,h+=`  Data size:   ${E.sizeMB} MB
`,h+=`  Seed size:   ${_} MB (${I} KB)
`,w.length>0){h+=`
  API keys detected:
`;for(const p of w)h+=`    - ${p}
`}return k>1e4&&(h+=`
  Warning: Large seed may crash low-memory devices.
`,h+=`  Consider: rm -rf node_modules && seed
`),h+=`
  Copied. Open DevTools (F12 or Cmd+Opt+J) → Console → Paste.

`,e.stdout=h,0}catch(o){return e.stderr=`seed: ${o.message}
`,1}}};async function $(e){const n=await e.fs.exportAll();let r=0,t=0,o=0;const s=[];for(const i of n)i.type==="file"?(r++,o+=i.size||0):i.type==="dir"&&t++,s.push(JSON.stringify({path:i.path,type:i.type,content:i.content?b(i.content):null,mode:i.mode,mtime:i.mtime,ctime:i.ctime,size:i.size,symlinkTarget:i.symlinkTarget}));const a=s.join(`
`),m={};for(let i=0;i<localStorage.length;i++){const f=localStorage.key(i);m[f]=localStorage.getItem(f)}const c=JSON.stringify(m),l=T(m),u={version:v,files:r,dirs:t,totalBytes:o,sizeKB:Math.round(o/1024),sizeMB:(o/(1024*1024)).toFixed(2),detectedKeys:l};return{ndjson:a,storageJson:c,stats:u}}function L(e,n,r){const t=new Blob([e],{type:n}),o=URL.createObjectURL(t),s=document.createElement("a");s.href=o,s.download=r,document.body.appendChild(s),s.click(),document.body.removeChild(s),URL.revokeObjectURL(o)}async function K(e){try{e.stdout=`Capturing terminal...
`;const{ndjson:n,storageJson:r,stats:t}=await $(e),o=typeof window<"u"?window.location.hostname:"shiro.computer",s=JSON.stringify({version:v,hostname:o,timestamp:Date.now(),files:t.files,dirs:t.dirs,totalBytes:t.totalBytes,ndjson:n,storage:r}),a=await x(new TextEncoder().encode(s)),m=window.__tabcomputer?.terminal?.term;if(!m)return e.stderr=`seed gif: terminal not available
`,1;const c=M(m);F(c,{files:t.files,sizeMB:t.sizeMB},o),e.stdout+=`Encoding GIF...
`;const l=O(c,a);typeof window<"u"&&window.__tabcomputer&&(window.__tabcomputer.lastSeedGif=l);const u=C(),i=new Date().toISOString().slice(0,10),f=`${u||"shiro"}-${i}.gif`;L(l,"image/gif",f),H(l,f);const g=l.length-a.length;let d=`
`;if(d+=`  tabcomputer GIF Seed v${v}
`,d+=`  ${"─".repeat(30)}
`,d+=`  Files:       ${t.files}
`,d+=`  Directories: ${t.dirs}
`,d+=`  Data size:   ${t.sizeMB} MB
`,d+=`  GIF size:    ${(l.length/1024).toFixed(0)} KB (seed: ${(a.length/1024).toFixed(0)} KB + image: ${(g/1024).toFixed(0)} KB)
`,t.detectedKeys.length>0){d+=`
  API keys detected:
`;for(const w of t.detectedKeys)d+=`    - ${w}
`;d+=`
  Warning: This GIF contains your API keys.
`}return d+=`
  Downloaded: ${f}
`,d+=`  To restore: drag this GIF onto a tabcomputer tab.

`,e.stdout=d,0}catch(n){return e.stderr=`seed gif: ${n.message}
`,1}}function H(e,n){if(typeof document>"u")return;const r=document.getElementById("terminal");if(!r)return;const t=document.getElementById("seed-gif-thumb");t&&t.remove();const o=new Blob([e],{type:"image/gif"}),s=URL.createObjectURL(o),a=document.createElement("div");a.id="seed-gif-thumb",a.draggable=!0,a.style.cssText=["position:absolute","bottom:16px","right:16px","z-index:1000","background:#1a1a2e","border:2px solid #51cf66","border-radius:8px","padding:6px","cursor:grab","box-shadow:0 4px 12px rgba(0,0,0,0.5)","display:flex","flex-direction:column","align-items:center","gap:4px"].join(";");const m=document.createElement("img");m.src=s,m.style.cssText="width:120px;height:auto;border-radius:4px;pointer-events:none";const c=document.createElement("span");c.textContent="⬆ Drag to another tabcomputer tab",c.style.cssText="font-size:10px;color:#51cf66;font-family:system-ui;font-weight:600";const l=document.createElement("button");l.textContent="×",l.style.cssText=["position:absolute","top:2px","right:6px","background:none","border:none","color:#666","font-size:14px","cursor:pointer","line-height:1","padding:0"].join(";"),l.onclick=()=>{a.remove(),URL.revokeObjectURL(s)},a.appendChild(l),a.appendChild(m),a.appendChild(c),a.addEventListener("dragstart",u=>{const i=new File([e],n,{type:"image/gif"});u.dataTransfer.items.add(i),u.dataTransfer.effectAllowed="copy"}),r.appendChild(a),setTimeout(()=>{a.parentNode&&(a.remove(),URL.revokeObjectURL(s))},6e4)}async function P(e){try{e.stdout=`Serializing filesystem...
`;const{ndjson:n,storageJson:r,stats:t}=await $(e),o=JSON.stringify({version:v,hostname:typeof window<"u"?window.location.hostname:"shiro.computer",timestamp:Date.now(),files:t.files,dirs:t.dirs,totalBytes:t.totalBytes,ndjson:n,storage:r});e.stdout+=`Compressing...
`;const s=await x(new TextEncoder().encode(o));e.stdout+=`  Compressed: ${(s.length/1024).toFixed(0)} KB
`,e.stdout+=`Uploading...
`;const a=R(),m=await fetch(`${a}/api/seed`,{method:"POST",body:s,headers:{"Content-Type":"application/octet-stream"}});if(!m.ok){const f=await m.json().catch(()=>({error:m.statusText}));return e.stderr=`seed share: ${f.error}
`,1}const{id:c,url:l}=await m.json(),u=`${a}${l}`;try{await navigator.clipboard.writeText(u)}catch{}let i=`
`;if(i+=`  tabcomputer Shared Seed v${v}
`,i+=`  ${"─".repeat(30)}
`,i+=`  Files:       ${t.files}
`,i+=`  Directories: ${t.dirs}
`,i+=`  Data size:   ${t.sizeMB} MB
`,i+=`  Compressed:  ${(s.length/1024).toFixed(0)} KB
`,i+=`  ID:          ${c}
`,i+=`  URL:         ${u}
`,t.detectedKeys.length>0){i+=`
  API keys detected:
`;for(const f of t.detectedKeys)i+=`    - ${f}
`;i+=`
  Warning: This shared seed contains your API keys!
`}return i+=`
  URL copied to clipboard. Share it to give anyone a tabcomputer instance with your files.
`,i+=`  Link expires after 60 days of no visits.

`,e.stdout=i,0}catch(n){return e.stderr=`seed share: ${n.message}
`,1}}async function G(e){try{e.stdout=`Inlining document resources...
`;const n=await B();e.stdout+=`  HTML size: ${(n.length/1024).toFixed(0)} KB
`,e.stdout+=`Serializing filesystem...
`;const{ndjson:r,storageJson:t,stats:o}=await $(e);e.stdout+=`Compressing state...
`;const s=await x(new TextEncoder().encode(r)),a=b(s),m=await x(new TextEncoder().encode(t)),c=b(m);e.stdout+=`  FS compressed: ${(s.length/1024).toFixed(0)} KB (was ${(r.length/1024).toFixed(0)} KB)
`;const l=`<script>
(async function(){
  async function _dc(b){
    var a=atob(b),u=new Uint8Array(a.length);
    for(var i=0;i<a.length;i++)u[i]=a.charCodeAt(i);
    var s=new DecompressionStream('gzip'),w=s.writable.getWriter();
    w.write(u);w.close();
    var r=s.readable.getReader(),c=[],v;
    while(!(v=await r.read()).done)c.push(v.value);
    var t=0;for(var x of c)t+=x.length;
    var o=new Uint8Array(t),p=0;for(var x of c){o.set(x,p);p+=x.length}
    return new TextDecoder().decode(o);
  }
  var attempts=0;
  var timer=setInterval(async function(){
    if(window.__tabcomputer||attempts++>50){
      clearInterval(timer);
      if(window.__tabcomputer){
        window.postMessage({
          type:'shiro-seed-v2',
          ndjson:await _dc('${a}'),
          storage:await _dc('${c}')
        },'*');
      }
    }
  },100);
})();
<\/script>`,u=n.replace("</body>",l+`
</body>`),i=C(),f=new Date().toISOString().slice(0,10),g=`${i||"shiro"}-${f}.html`;L(u,"text/html",g);let d=`
`;if(d+=`  tabcomputer HTML Seed v${v}
`,d+=`  ${"─".repeat(30)}
`,d+=`  Files:       ${o.files}
`,d+=`  Directories: ${o.dirs}
`,d+=`  Data size:   ${o.sizeMB} MB
`,d+=`  HTML size:   ${(u.length/1024).toFixed(0)} KB
`,o.detectedKeys.length>0){d+=`
  API keys detected:
`;for(const w of o.detectedKeys)d+=`    - ${w}
`}return d+=`
  Downloaded: ${g}
`,d+=`  Open in any browser to boot with your filesystem.

`,e.stdout=d,0}catch(n){return e.stderr=`seed html: ${n.message}
`,1}}(globalThis.__tabcomputerLive??=new Map).set("src/commands/seed.ts",W);export{N as seedCmd};
