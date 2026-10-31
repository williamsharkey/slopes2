const S=Object.freeze(Object.defineProperty({__proto__:null,get Driver(){return E},get Pointer(){return R},get TileCanvases(){return k},get cellSize(){return x},get createShaderEngine(){return y}},Symbol.toStringTag,{value:"Module"})),L="attribute vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }",M=`
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform float uDark; uniform float uMode; uniform vec2 uMouse; uniform float uTile;
float h21(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(h21(i), h21(i+vec2(1,0)), f.x), mix(h21(i+vec2(0,1)), h21(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float a = .5, s = 0.; for (int i=0;i<5;i++){ s += a*vn(p); p = p*2.03 + 17.1; a *= .5; } return s; }
float sdRound(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q,0.)) + min(max(q.x,q.y),0.) - r; }
vec3 pal(float t){ return .5 + .5*cos(6.28318*(vec3(0.,.33,.67) + t)); }
void main(){
  vec2 px = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  float idx = floor(px.x / uTile);
  vec2 lp = px - vec2(idx*uTile, 0.);
  float RAD = uTile * .24;
  float d = sdRound(lp - uTile*.5, vec2(uTile*.5), RAD);
  float inside = 1. - smoothstep(-.6, .6, d);
  vec2 uv = lp / uTile;
  float seed = idx * 1.91;
  float t = uTime;
  vec3 col;
  if (uMode < .5) {
    vec2 q = vec2(fbm(uv*1.7 + seed + t*.035), fbm(uv*1.7 + seed + 4.3 - t*.03));
    float n = fbm(uv*2.4 + q*2.2 + vec2(t*.02, -t*.015));
    float streams = pow(1. - abs(sin(n*26.)), 14.) * (0.55 + .45*fbm(uv*6. + seed));
    vec3 tint = pal(n*1.4 + uv.y*.25 + seed*.05 + t*.01);
    vec3 base = uDark > .5 ? vec3(.105,.105,.13) + tint*.05 : vec3(.968,.965,.978) - (1.-tint)*.035;
    col = base + tint * streams * (uDark > .5 ? .55 : .36);
    col += pal(uv.x*.6 + uv.y*.4 + t*.012 + .1) * (uDark > .5 ? .07 : .05) * smoothstep(1., .1, uv.y);
    col += (uDark > .5 ? .08 : .05) * smoothstep(.55, 0., uv.y) * (1. - abs(uv.x - .5));
  } else {
    vec2 m = uMouse - .5;
    float brushed = fbm(vec2(uv.x*40., uv.y*1.2) + seed) * .06;
    float film = uv.x*.55 + uv.y*.75 + dot(m, vec2(1.1, .8)) + t*.025 + fbm(uv*3. + seed + t*.02)*.55;
    vec3 rainbow = pal(film);
    vec3 silver = uDark > .5 ? vec3(.30,.30,.34) : vec3(.86,.86,.89);
    col = mix(silver, rainbow * (uDark > .5 ? .62 : .95), uDark > .5 ? .30 : .32) + brushed;
    float band = exp(-pow((uv.x + uv.y*.8 - fract(t*.06 + idx*.07)*3. + .6)*3.2, 2.));
    col += band * (uDark > .5 ? .18 : .22);
    float sparkle = step(.985, h21(floor(lp*1.5) + floor(t*6.))) * .35 * smoothstep(.2,.8,fbm(uv*5.+t*.1));
    col += sparkle;
  }
  float rim = smoothstep(-1.6, -.2, d) * (1. - smoothstep(-.2, .6, d));
  col += rim * (uDark > .5 ? .10 : .16);
  col *= 1. - .10 * smoothstep(-8., 0., d);
  gl_FragColor = vec4(col*inside, inside);
}`;class k{tiles=[];attach(e){for(const i of this.tiles)e.includes(i.el)||(i.c.remove(),i.el.classList.remove("sd-live"));this.tiles=e.map(i=>{const s=this.tiles.find(m=>m.el===i);if(s)return s;const t=document.createElement("canvas");return t.className="sd-ic-live",i.prepend(t),i.classList.add("sd-live"),{el:i,c:t,x:t.getContext("2d")}})}stage=document.createElement("canvas");sx=this.stage.getContext("2d");stageFrom(e){this.stage.width!==e.width||this.stage.height!==e.height?(this.stage.width=e.width,this.stage.height=e.height):this.sx.clearRect(0,0,e.width,e.height),this.sx.drawImage(e,0,0)}blit(e,i){this.stageFrom(e),this.slice(i)}slice(e){this.tiles.forEach((i,s)=>{(i.c.width!==e||i.c.height!==e)&&(i.c.width=e,i.c.height=e),i.x.clearRect(0,0,e,e),i.x.drawImage(this.stage,s*e,0,e,e,0,0,e,e)})}clear(){for(const e of this.tiles)e.c.remove(),e.el.classList.remove("sd-live");this.tiles=[],this.stage.width=this.stage.height=0}}class E{constructor(e,i){this.target=e,this.frame=i,this.io=new IntersectionObserver(s=>{this.onScreen=s[s.length-1].isIntersecting,this.kick()}),this.io.observe(e),document.addEventListener("visibilitychange",this.onVis),this.reduce.addEventListener("change",this.onMotion)}raf=0;onScreen=!0;io;reduce=matchMedia("(prefers-reduced-motion: reduce)");onVis=()=>this.kick();onMotion=()=>this.kick();get running(){return this.raf!==0}held=!1;live(){return!this.held&&this.onScreen&&!document.hidden&&!this.reduce.matches}hold(e){this.held=e,e||this.kick()}kick(){if(this.live()&&!this.raf){const e=i=>{this.frame(i),this.raf=this.live()?requestAnimationFrame(e):0};this.raf=requestAnimationFrame(e)}}dispose(){cancelAnimationFrame(this.raf),this.raf=0,this.io.disconnect(),document.removeEventListener("visibilitychange",this.onVis),this.reduce.removeEventListener("change",this.onMotion)}}class R{constructor(e){this.el=e,e.addEventListener("pointermove",this.move),e.addEventListener("pointerleave",this.leave)}pos=[.5,.5];target=[.5,.5];move=e=>{const i=this.el.getBoundingClientRect();this.target=[(e.clientX-i.left)/i.width,(e.clientY-i.top)/i.height]};leave=()=>{this.target=[.5,.5]};step(){this.pos[0]+=(this.target[0]-this.pos[0])*.06,this.pos[1]+=(this.target[1]-this.pos[1])*.06}on=!0;dispose(){this.on&&(this.on=!1,this.el.removeEventListener("pointermove",this.move),this.el.removeEventListener("pointerleave",this.leave))}}function x(a){const i=a.querySelector(".sd-ic")?.offsetWidth||45;return Math.max(16,Math.round(i*Math.min(window.devicePixelRatio||1,2)))}function y(a,e,i){const s=document.createElement("canvas"),t=s.getContext("webgl",{premultipliedAlpha:!0,alpha:!0,antialias:!1,preserveDrawingBuffer:!0});if(!t)return null;const m=(o,c)=>{const f=t.createShader(o);return t.shaderSource(f,c),t.compileShader(f),f},n=t.createProgram();if(t.attachShader(n,m(t.VERTEX_SHADER,L)),t.attachShader(n,m(t.FRAGMENT_SHADER,M)),t.linkProgram(n),!t.getProgramParameter(n,t.LINK_STATUS))return t.getExtension("WEBGL_lose_context")?.loseContext(),null;t.useProgram(n);const T=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,T),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),t.STATIC_DRAW);const b=t.getAttribLocation(n,"p");t.enableVertexAttribArray(b),t.vertexAttribPointer(b,2,t.FLOAT,!1,0,0);const h=o=>t.getUniformLocation(n,o),l={res:h("uRes"),time:h("uTime"),dark:h("uDark"),mode:h("uMode"),mouse:h("uMouse"),tile:h("uTile")};t.uniform1f(l.mode,a);let w=i==="dark";const u=new k,d=a===1?new R(e):null,_=performance.now()*(Math.random()*.3+1),A=matchMedia("(prefers-reduced-motion: reduce)");let r=x(e);const v=(o,c=Math.max(1,u.tiles.length),f=!0)=>{(s.width!==c*r||s.height!==r)&&(s.width=c*r,s.height=r,t.viewport(0,0,s.width,s.height)),d?.step(),t.uniform2f(l.res,s.width,s.height),t.uniform1f(l.tile,r),t.uniform1f(l.dark,w?1:0),t.uniform1f(l.time,A.matches?12:(o+_)/1e3),t.uniform2f(l.mouse,d?.pos[0]??.5,d?.pos[1]??.5),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),t.drawArrays(t.TRIANGLE_STRIP,0,4),f&&u.blit(s,r)},p=new E(e,o=>v(o));let g=0;return{prepare(o){v(performance.now(),Math.max(1,o.length),!1),u.stageFrom(s),g=Math.max(1,o.length)},attach(o){u.attach(o);const c=x(e);g===o.length&&c===r?u.slice(r):(r=c,v(performance.now())),g=0,p.kick()},setTheme(o){w=o==="dark",v(performance.now())},hold(o){p.hold(o)},freeze(){p.dispose(),d?.dispose()},dispose(){p.dispose(),d?.dispose(),u.clear(),t.getExtension("WEBGL_lose_context")?.loseContext(),s.width=s.height=0}}}(globalThis.__tabcomputerLive??=new Map).set("src/desktop/iconset-gl.ts",S);export{E as Driver,R as Pointer,k as TileCanvases,x as cellSize,y as createShaderEngine};
