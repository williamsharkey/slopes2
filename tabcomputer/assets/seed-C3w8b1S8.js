import{c as W,b as O,d as D,g as $}from"./index-3dop0BuN.js";import{collectSeedState as T,SEED_VERSION as A,describeSeedContents as E}from"./seed-state-BE0KFjs_.js";import"./credentials-CrExaRSJ.js";const j=Object.freeze(Object.defineProperty({__proto__:null,get seedCmd(){return K}},Symbol.toStringTag,{value:"Module"})),b=A;function S(e){let r="";for(let t=0;t<e.length;t++)r+=String.fromCharCode(e[t]);return btoa(r)}async function v(e){const r=new CompressionStream("gzip"),t=r.writable.getWriter();t.write(e),t.close();const d=[],l=r.readable.getReader();for(;;){const{done:n,value:i}=await l.read();if(n)break;d.push(i)}const a=d.reduce((n,i)=>n+i.length,0),o=new Uint8Array(a);let u=0;for(const n of d)o.set(n,u),u+=n.length;return o}function U(e,r,t,d){const l=n=>n.replace(/\\/g,"\\\\").replace(/`/g,"\\`").replace(/\$/g,"\\$"),a=l(r),o=l(t);return`${`// shiro seed v${d.version} | ${d.files} files, ${d.dirs} dirs | ${d.sizeMB} MB`}
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
  var SEED_FS=\`${a}\`;
  var SEED_STORAGE=\`${o}\`;
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
    iframe.contentWindow.postMessage({type:'shiro-seed-v2',ndjson:SEED_FS,storage:SEED_STORAGE,context:buildContext()},'${new URL(e).origin}');
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
})();`}function k(){if(typeof window>"u")return null;const r=window.location.hostname.match(/^([^.]+)\.shiro\.computer$/);return r?r[1]:null}function N(e){const r=typeof window<"u"&&/(^|\.)shiro\.computer$/.test(window.location.hostname);if(e){if(!r)throw new Error(`a subdomain target ("${e}") exists on shiro.computer only; without it the seed opens ${$()}`);return`https://${e}.shiro.computer/`}if(r){const t=k();return t?`https://${t}.shiro.computer/`:"https://shiro.computer/"}return`${$()}/`}async function L(){const e=window.location?.href||document.baseURI||"https://shiro.computer/",r=(()=>{try{return new URL(e,"https://shiro.computer/").origin}catch{return"https://shiro.computer"}})();let t=null;try{const n=await fetch(e,{cache:"no-store"});if(!n.ok)throw new Error(`HTTP ${n.status}`);const i=await n.text();typeof DOMParser<"u"&&(t=new DOMParser().parseFromString(i,"text/html"))}catch(n){console.warn(`Failed to fetch canonical HTML: ${e}`,n)}(!t||!t.documentElement)&&(t=document.cloneNode(!0)),t.getElementById("shiro-seed")?.remove();const d=t.getElementById("terminal");d&&(d.innerHTML="");let l=t.head;l||(l=t.createElement("head"),t.documentElement.insertBefore(l,t.body||null));let a=l.querySelector("base");a||(a=t.createElement("base"),l.insertBefore(a,l.firstChild)),a.setAttribute("href",`${r}/`);const o=t.querySelectorAll("script[src]");for(const n of o){const i=n.getAttribute("src");if(i)try{const c=new URL(i,e).href,f=await(await fetch(c)).text(),p=t.createElement("script"),g=n.getAttribute("type");g&&p.setAttribute("type",g),p.textContent=f,n.parentNode?.replaceChild(p,n)}catch(c){console.warn(`Failed to inline script: ${i}`,c)}}const u=t.querySelectorAll('link[rel="stylesheet"]');for(const n of u){const i=n.getAttribute("href");if(i)try{const c=new URL(i,e).href,f=await(await fetch(c)).text(),p=t.createElement("style");p.textContent=f,n.parentNode?.replaceChild(p,n)}catch(c){console.warn(`Failed to inline stylesheet: ${i}`,c)}}return`<!DOCTYPE html>
`+t.documentElement.outerHTML}function H(e,r,t,d){return`${`// shiro blob seed v${d.version} | ${d.files} files | ${(d.compressedSize/1024).toFixed(0)}KB compressed`}
(async function(){
  if(document.getElementById('shiro-seed')){console.log('tabcomputer already seeded');return}
  async function _dc(b){var a=atob(b),u=new Uint8Array(a.length),i=0;for(;i<a.length;)u[i]=a.charCodeAt(i++);var s=new DecompressionStream('gzip'),w=s.writable.getWriter();w.write(u);w.close();var r=s.readable.getReader(),c=[],v;while(!(v=await r.read()).done)c.push(v.value);var t=0,x;for(x of c)t+=x.length;var o=new Uint8Array(t),p=0;for(x of c){o.set(x,p);p+=x.length}return new TextDecoder().decode(o)}
  var html=await _dc('${e}');
  var blob=new Blob([html],{type:'text/html'});
  var blobUrl=URL.createObjectURL(blob);
  var _fsP=_dc('${r}');
  var _lsP=_dc('${t}');
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
})();`}const G=`Usage: seed [blob|gif|html|share] [--with-credentials] [--yes]
`,K={name:"seed",description:"Export tabcomputer state, without credentials (seed [blob|gif|html|share] [--with-credentials] [--yes])",async exec(e){const r=e.args.filter(o=>o.startsWith("-")),t=r.filter(o=>!["--with-credentials","--yes","-y"].includes(o));if(t.length)return e.stderr=`seed: unknown option ${t[0]}
${G}`,2;const d={withCredentials:r.includes("--with-credentials"),yes:r.includes("--yes")||r.includes("-y")};if(e=Object.assign(e,{args:e.args.filter(o=>!o.startsWith("-"))}),e.args[0]==="gif")return P(e,d);if(e.args[0]==="html")return X(e,d);if(e.args[0]==="share")return J(e,d);const l=e.args[0]==="blob",a=l?e.args[1]:e.args[0];try{const o=N(a);let u="",n=0,i=0;if(l){e.stdout=`Inlining document resources...
`;const x=await L();n=x.length,e.stdout+=`  HTML size: ${(n/1024).toFixed(0)} KB
`,e.stdout+=`Compressing...
`;const C=new TextEncoder().encode(x),z=await v(C);i=z.length,u=S(z),e.stdout+=`  Compressed: ${(i/1024).toFixed(0)} KB (${((1-i/n)*100).toFixed(0)}% reduction)
`}const c=await T(e.fs,d),{ndjson:m,storageJson:f,stats:p}=c,g=p.files,y=p.dirs;let s;if(l){e.stdout+=`Compressing filesystem data...
`;const x=await v(new TextEncoder().encode(m)),C=S(x),z=await v(new TextEncoder().encode(f)),F=S(z);e.stdout+=`  FS compressed: ${(x.length/1024).toFixed(0)} KB (was ${(m.length/1024).toFixed(0)} KB)
`,s=H(u,C,F,{...p,htmlSize:n,compressedSize:i})}else s=U(o,m,f,p);const w=s.length/1024,_=w.toFixed(0),M=(s.length/(1024*1024)).toFixed(2);await navigator.clipboard.writeText(s);let h=`
`;return h+=`  tabcomputer ${l?"Blob ":""}Seed v${b}
`,h+=`  ${"─".repeat(30)}
`,l?(h+=`  Mode:        self-contained blob (CSP-safe)
`,h+=`  HTML size:   ${(n/1024).toFixed(0)} KB
`,h+=`  Compressed:  ${(i/1024).toFixed(0)} KB
`):h+=`  Target:      ${o}
`,h+=`  Files:       ${g}
`,h+=`  Directories: ${y}
`,h+=`  Data size:   ${p.sizeMB} MB
`,h+=`  Seed size:   ${M} MB (${_} KB)
`,h+=E(c),l&&(h+=`
  A blob seed runs inside the page you paste it into: that site's scripts can read these files.
`),w>1e4&&(h+=`
  Warning: Large seed may crash low-memory devices.
`,h+=`  Consider: rm -rf node_modules && seed
`),h+=`
  Copied. Open DevTools (F12 or Cmd+Opt+J) → Console → Paste.

`,e.stdout=h,0}catch(o){return e.stderr=`seed: ${o.message}
`,1}}},I=(e,r)=>T(e.fs,r);function R(e,r,t){const d=new Blob([e],{type:r}),l=URL.createObjectURL(d),a=document.createElement("a");a.href=l,a.download=t,document.body.appendChild(a),a.click(),document.body.removeChild(a),URL.revokeObjectURL(l)}async function P(e,r){try{e.stdout=`Capturing terminal...
`;const t=await I(e,r),{ndjson:d,storageJson:l,stats:a}=t,o=typeof window<"u"?window.location.hostname:"shiro.computer",u=JSON.stringify({version:b,hostname:o,timestamp:Date.now(),files:a.files,dirs:a.dirs,totalBytes:a.totalBytes,ndjson:d,storage:l}),n=await v(new TextEncoder().encode(u)),i=window.__tabcomputer?.terminal?.term;if(!i)return e.stderr=`seed gif: terminal not available
`,1;const c=W(i);O(c,{files:a.files,sizeMB:a.sizeMB},o),e.stdout+=`Encoding GIF...
`;const m=D(c,n);typeof window<"u"&&window.__tabcomputer&&(window.__tabcomputer.lastSeedGif=m);const f=k(),p=new Date().toISOString().slice(0,10),g=`${f||"shiro"}-${p}.gif`;R(m,"image/gif",g),q(m,g);const y=m.length-n.length;let s=`
`;return s+=`  tabcomputer GIF Seed v${b}
`,s+=`  ${"─".repeat(30)}
`,s+=`  Files:       ${a.files}
`,s+=`  Directories: ${a.dirs}
`,s+=`  Data size:   ${a.sizeMB} MB
`,s+=`  GIF size:    ${(m.length/1024).toFixed(0)} KB (seed: ${(n.length/1024).toFixed(0)} KB + image: ${(y/1024).toFixed(0)} KB)
`,s+=E(t),s+=`
  Downloaded: ${g}
`,s+=`  To restore: drag this GIF onto a tabcomputer tab.

`,e.stdout=s,0}catch(t){return e.stderr=`seed gif: ${t.message}
`,1}}function q(e,r){if(typeof document>"u")return;const t=document.getElementById("terminal");if(!t)return;const d=document.getElementById("seed-gif-thumb");d&&d.remove();const l=new Blob([e],{type:"image/gif"}),a=URL.createObjectURL(l),o=document.createElement("div");o.id="seed-gif-thumb",o.draggable=!0,o.style.cssText=["position:absolute","bottom:16px","right:16px","z-index:1000","background:#1a1a2e","border:2px solid #51cf66","border-radius:8px","padding:6px","cursor:grab","box-shadow:0 4px 12px rgba(0,0,0,0.5)","display:flex","flex-direction:column","align-items:center","gap:4px"].join(";");const u=document.createElement("img");u.src=a,u.style.cssText="width:120px;height:auto;border-radius:4px;pointer-events:none";const n=document.createElement("span");n.textContent="⬆ Drag to another tabcomputer tab",n.style.cssText="font-size:10px;color:#51cf66;font-family:system-ui;font-weight:600";const i=document.createElement("button");i.textContent="×",i.style.cssText=["position:absolute","top:2px","right:6px","background:none","border:none","color:#666","font-size:14px","cursor:pointer","line-height:1","padding:0"].join(";"),i.onclick=()=>{o.remove(),URL.revokeObjectURL(a)},o.appendChild(i),o.appendChild(u),o.appendChild(n),o.addEventListener("dragstart",c=>{const m=new File([e],r,{type:"image/gif"});c.dataTransfer.items.add(m),c.dataTransfer.effectAllowed="copy"}),t.appendChild(o),setTimeout(()=>{o.parentNode&&(o.remove(),URL.revokeObjectURL(a))},6e4)}async function Y(e,r){const t=e.terminal;return!t?.waitForUserInput||e.stdinIsTTY===!1||e.stdoutIsTTY===!1?null:(t.writeOutput(r.replace(/\r?\n/g,`\r
`)),t.waitForUserInput())}async function J(e,r){try{if(r.withCredentials)return e.stderr=`seed share: a shared seed is kept on the server and anyone with the link can download it, so it never carries credentials.
To move your own machine with its sign-ins, make a file instead: seed gif --with-credentials (or seed html --with-credentials).
`,2;const t=$();if((await fetch(`${t}/api/seed`).then(w=>w.ok?w.json():null).catch(()=>null))?.enabled!==!0)return e.stderr=`seed share: this server does not keep shared seeds (it is a server setting, off here). Nothing was uploaded.
seed gif and seed html make a file you can send yourself.
`,1;const l=await T(e.fs,r),{ndjson:a,storageJson:o,stats:u}=l,n=JSON.stringify({version:b,hostname:typeof window<"u"?window.location.hostname:"shiro.computer",timestamp:Date.now(),files:u.files,dirs:u.dirs,totalBytes:u.totalBytes,ndjson:a,storage:o}),i=await v(new TextEncoder().encode(n));let c=`
`;if(c+=`  tabcomputer Shared Seed v${b}
`,c+=`  ${"─".repeat(30)}
`,c+=`  Files:       ${u.files}
`,c+=`  Directories: ${u.dirs}
`,c+=`  Data size:   ${u.sizeMB} MB
`,c+=`  Compressed:  ${(i.length/1024).toFixed(0)} KB
`,c+=E(l),c+=`
  This uploads every other file on this machine to ${t}.
`,c+=`  \x1B[1mAnyone with the link can download all of it.\x1B[0m The server keeps it, with your
`,c+=`  address, until 60 days after the link was last opened. There is no way to take it back.
`,i.length>B)return e.stdout=c,e.stderr=`seed share: too large to share (${(i.length/1024).toFixed(0)} KB compressed; the limit is ${B/1024} KB). Nothing was uploaded.
`,1;let m=!1;if(!r.yes){const w=await Y(e,`${c}
  Upload? Type yes to share, anything else to cancel: `);if(w===null)return e.stdout=c,e.stderr=`seed share: nothing was uploaded. This needs a yes: run it at a terminal, or pass --yes after reading the list above.
`,1;if(m=!0,w.trim().toLowerCase()!=="yes")return e.stdout=`
  Cancelled. Nothing was uploaded.

`,1}const f=await fetch(`${t}/api/seed`,{method:"POST",body:i,headers:{"Content-Type":"application/octet-stream"}});if(!f.ok){const w=await f.json().catch(()=>({error:f.statusText}));return e.stderr=`seed share: ${w.error}
`,1}const{id:p,url:g}=await f.json(),y=`${t}${g}`;try{await navigator.clipboard.writeText(y)}catch{}let s=m?`
`:c;return s+=`
  Uploaded.
`,s+=`  ID:          ${p}
`,s+=`  URL:         ${y}
`,s+=`
  URL copied to clipboard. Whoever opens it gets a tabcomputer with these files.
`,s+=`  Link expires after 60 days of no visits.

`,e.stdout=s,0}catch(t){return e.stderr=`seed share: ${t.message}
`,1}}const B=512*1024;async function X(e,r){try{e.stdout=`Inlining document resources...
`;const t=await L();e.stdout+=`  HTML size: ${(t.length/1024).toFixed(0)} KB
`,e.stdout+=`Serializing filesystem...
`;const d=await I(e,r),{ndjson:l,storageJson:a,stats:o}=d;e.stdout+=`Compressing state...
`;const u=await v(new TextEncoder().encode(l)),n=S(u),i=await v(new TextEncoder().encode(a)),c=S(i);e.stdout+=`  FS compressed: ${(u.length/1024).toFixed(0)} KB (was ${(l.length/1024).toFixed(0)} KB)
`;const m=`<script>
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
          ndjson:await _dc('${n}'),
          storage:await _dc('${c}')
        },'*');
      }
    }
  },100);
})();
<\/script>`,f=t.replace("</body>",m+`
</body>`),p=k(),g=new Date().toISOString().slice(0,10),y=`${p||"shiro"}-${g}.html`;R(f,"text/html",y);let s=`
`;return s+=`  tabcomputer HTML Seed v${b}
`,s+=`  ${"─".repeat(30)}
`,s+=`  Files:       ${o.files}
`,s+=`  Directories: ${o.dirs}
`,s+=`  Data size:   ${o.sizeMB} MB
`,s+=`  HTML size:   ${(f.length/1024).toFixed(0)} KB
`,s+=E(d),s+=`
  Downloaded: ${y}
`,s+=`  Open in any browser to boot with your filesystem.

`,e.stdout=s,0}catch(t){return e.stderr=`seed html: ${t.message}
`,1}}(globalThis.__tabcomputerLive??=new Map).set("src/commands/seed.ts",j);export{K as seedCmd};
