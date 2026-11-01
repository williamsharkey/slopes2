import{bX as Jt,a as Yt}from"./index-3dop0BuN.js";import{B as Ke}from"./index-rQLcFmgX.js";function Ht(p,q){for(var P=0;P<q.length;P++){const L=q[P];if(typeof L!="string"&&!Array.isArray(L)){for(const z in L)if(z!=="default"&&!(z in p)){const J=Object.getOwnPropertyDescriptor(L,z);J&&Object.defineProperty(p,z,J.get?J:{enumerable:!0,get:()=>L[z]})}}}return Object.freeze(Object.defineProperty(p,Symbol.toStringTag,{value:"Module"}))}const Kt=Object.freeze(Object.defineProperty({__proto__:null,get buildCmd(){return ln},get createVirtualFSPlugin(){return yt},get ensureEsbuildInitialized(){return pt},get esbuildRunning(){return rn},get setEsbuildIdleMs(){return sn},get stopEsbuild(){return gt},get withEsbuild(){return Qe}},Symbol.toStringTag,{value:"Module"}));var Xe={exports:{}},ut;function Xt(){return ut||(ut=1,(function(p){(q=>{var P=Object.defineProperty,L=Object.getOwnPropertyDescriptor,z=Object.getOwnPropertyNames,J=Object.prototype.hasOwnProperty,re=(e,t)=>{for(var r in t)P(e,r,{get:t[r],enumerable:!0})},te=(e,t,r,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let g of z(t))!J.call(e,g)&&g!==r&&P(e,g,{get:()=>t[g],enumerable:!(a=L(t,g))||a.enumerable});return e},ae=e=>te(P({},"__esModule",{value:!0}),e),ne=(e,t,r)=>new Promise((a,g)=>{var w=f=>{try{S(r.next(f))}catch(I){g(I)}},h=f=>{try{S(r.throw(f))}catch(I){g(I)}},S=f=>f.done?a(f.value):Promise.resolve(f.value).then(w,h);S((r=r.apply(e,t)).next())}),se={};re(se,{analyzeMetafile:()=>Ut,analyzeMetafileSync:()=>Wt,build:()=>At,buildSync:()=>Mt,context:()=>Dt,default:()=>zt,formatMessages:()=>It,formatMessagesSync:()=>Nt,initialize:()=>Lt,stop:()=>Bt,transform:()=>Rt,transformSync:()=>Ft,version:()=>Ct}),q.exports=ae(se);function ve(e){let t=a=>{if(a===null)r.write8(0);else if(typeof a=="boolean")r.write8(1),r.write8(+a);else if(typeof a=="number")r.write8(2),r.write32(a|0);else if(typeof a=="string")r.write8(3),r.write(G(a));else if(a instanceof Uint8Array)r.write8(4),r.write(a);else if(a instanceof Array){r.write8(5),r.write32(a.length);for(let g of a)t(g)}else{let g=Object.keys(a);r.write8(6),r.write32(g.length);for(let w of g)r.write(G(w)),t(a[w])}},r=new Re;return r.write32(0),r.write32(e.id<<1|+!e.isRequest),t(e.value),de(r.buf,r.len-4,0),r.buf.subarray(0,r.len)}function De(e){let t=()=>{switch(r.read8()){case 0:return null;case 1:return!!r.read8();case 2:return r.read32();case 3:return H(r.read());case 4:return r.read();case 5:{let h=r.read32(),S=[];for(let f=0;f<h;f++)S.push(t());return S}case 6:{let h=r.read32(),S={};for(let f=0;f<h;f++)S[H(r.read())]=t();return S}default:throw new Error("Invalid packet")}},r=new Re(e),a=r.read32(),g=(a&1)===0;a>>>=1;let w=t();if(r.ptr!==e.length)throw new Error("Invalid packet");return{id:a,isRequest:g,value:w}}var Re=class{constructor(e=new Uint8Array(1024)){this.buf=e,this.len=0,this.ptr=0}_write(e){if(this.len+e>this.buf.length){let t=new Uint8Array((this.len+e)*2);t.set(this.buf),this.buf=t}return this.len+=e,this.len-e}write8(e){let t=this._write(1);this.buf[t]=e}write32(e){let t=this._write(4);de(this.buf,e,t)}write(e){let t=this._write(4+e.length);de(this.buf,e.length,t),this.buf.set(e,t+4)}_read(e){if(this.ptr+e>this.buf.length)throw new Error("Invalid packet");return this.ptr+=e,this.ptr-e}read8(){return this.buf[this._read(1)]}read32(){return Ie(this.buf,this._read(4))}read(){let e=this.read32(),t=new Uint8Array(e),r=this._read(t.length);return t.set(this.buf.subarray(r,r+e)),t}},G,H,Ee;if(typeof TextEncoder<"u"&&typeof TextDecoder<"u"){let e=new TextEncoder,t=new TextDecoder;G=r=>e.encode(r),H=r=>t.decode(r),Ee='new TextEncoder().encode("")'}else if(typeof Ke<"u")G=e=>Ke.from(e),H=e=>{let{buffer:t,byteOffset:r,byteLength:a}=e;return Ke.from(t,r,a).toString()},Ee='Buffer.from("")';else throw new Error("No UTF-8 codec found");if(!(G("")instanceof Uint8Array))throw new Error(`Invariant violation: "${Ee} instanceof Uint8Array" is incorrectly false

This indicates that your JavaScript environment is broken. You cannot use
esbuild in this environment because esbuild relies on this invariant. This
is not a problem with esbuild. You need to fix your environment instead.
`);function Ie(e,t){return e[t++]|e[t++]<<8|e[t++]<<16|e[t++]<<24}function de(e,t,r){e[r++]=t,e[r++]=t>>8,e[r++]=t>>16,e[r++]=t>>24}var Y=JSON.stringify,Se="warning",Ue="silent";function $e(e,t){const r=[];for(const a of e){if(le(a,t),a.indexOf(",")>=0)throw new Error(`Invalid ${t}: ${a}`);r.push(a)}return r.join(",")}var Be=()=>null,X=e=>typeof e=="boolean"?null:"a boolean",O=e=>typeof e=="string"?null:"a string",Le=e=>e instanceof RegExp?null:"a RegExp object",_e=e=>typeof e=="number"&&e===(e|0)?null:"an integer",wt=e=>typeof e=="number"&&e===(e|0)&&e>=0&&e<=65535?null:"a valid port number",Ze=e=>typeof e=="function"?null:"a function",pe=e=>Array.isArray(e)?null:"an array",ie=e=>Array.isArray(e)&&e.every(t=>typeof t=="string")?null:"an array of strings",ue=e=>typeof e=="object"&&e!==null&&!Array.isArray(e)?null:"an object",bt=e=>typeof e=="object"&&e!==null?null:"an array or an object",vt=e=>e instanceof WebAssembly.Module?null:"a WebAssembly.Module",et=e=>typeof e=="object"&&!Array.isArray(e)?null:"an object or null",tt=e=>typeof e=="string"||typeof e=="boolean"?null:"a string or a boolean",_t=e=>typeof e=="string"||typeof e=="object"&&e!==null&&!Array.isArray(e)?null:"a string or an object",nt=e=>typeof e=="string"||Array.isArray(e)&&e.every(t=>typeof t=="string")?null:"a string or an array of strings",rt=e=>typeof e=="string"||e instanceof Uint8Array?null:"a string or a Uint8Array",xt=e=>typeof e=="string"||e instanceof URL?null:"a string or a URL";function i(e,t,r,a){let g=e[r];if(t[r+""]=!0,g===void 0)return;let w=a(g);if(w!==null)throw new Error(`${Y(r)} must be ${w}`);return g}function Z(e,t,r){for(let a in e)if(!(a in t))throw new Error(`Invalid option ${r}: ${Y(a)}`)}function kt(e){let t=Object.create(null),r=i(e,t,"wasmURL",xt),a=i(e,t,"wasmModule",vt),g=i(e,t,"worker",X);return Z(e,t,"in initialize() call"),{wasmURL:r,wasmModule:a,worker:g}}function st(e){let t;if(e!==void 0){t=Object.create(null);for(let r in e){let a=e[r];if(typeof a=="string"||a===!1)t[r]=a;else throw new Error(`Expected ${Y(r)} in mangle cache to map to either a string or false`)}}return t}function Ve(e,t,r,a,g){let w=i(t,r,"color",X),h=i(t,r,"logLevel",O),S=i(t,r,"logLimit",_e);w!==void 0?e.push(`--color=${w}`):a&&e.push("--color=true"),e.push(`--log-level=${h||g}`),e.push(`--log-limit=${S||0}`)}function le(e,t,r){if(typeof e!="string")throw new Error(`Expected value for ${t}${r!==void 0?" "+Y(r):""} to be a string, got ${typeof e} instead`);return e}function it(e,t,r){let a=i(t,r,"legalComments",O),g=i(t,r,"sourceRoot",O),w=i(t,r,"sourcesContent",X),h=i(t,r,"target",nt),S=i(t,r,"format",O),f=i(t,r,"globalName",O),I=i(t,r,"mangleProps",Le),U=i(t,r,"reserveProps",Le),D=i(t,r,"mangleQuoted",X),V=i(t,r,"minify",X),R=i(t,r,"minifySyntax",X),N=i(t,r,"minifyWhitespace",X),W=i(t,r,"minifyIdentifiers",X),j=i(t,r,"lineLimit",_e),Q=i(t,r,"drop",ie),T=i(t,r,"dropLabels",ie),$=i(t,r,"charset",O),y=i(t,r,"treeShaking",X),c=i(t,r,"ignoreAnnotations",X),s=i(t,r,"jsx",O),o=i(t,r,"jsxFactory",O),d=i(t,r,"jsxFragment",O),_=i(t,r,"jsxImportSource",O),k=i(t,r,"jsxDev",X),u=i(t,r,"jsxSideEffects",X),m=i(t,r,"define",ue),x=i(t,r,"logOverride",ue),n=i(t,r,"supported",ue),l=i(t,r,"pure",ie),v=i(t,r,"keepNames",X),b=i(t,r,"platform",O),A=i(t,r,"tsconfigRaw",_t),K=i(t,r,"absPaths",ie);if(a&&e.push(`--legal-comments=${a}`),g!==void 0&&e.push(`--source-root=${g}`),w!==void 0&&e.push(`--sources-content=${w}`),h&&e.push(`--target=${$e(Array.isArray(h)?h:[h],"target")}`),S&&e.push(`--format=${S}`),f&&e.push(`--global-name=${f}`),b&&e.push(`--platform=${b}`),A&&e.push(`--tsconfig-raw=${typeof A=="string"?A:JSON.stringify(A)}`),V&&e.push("--minify"),R&&e.push("--minify-syntax"),N&&e.push("--minify-whitespace"),W&&e.push("--minify-identifiers"),j&&e.push(`--line-limit=${j}`),$&&e.push(`--charset=${$}`),y!==void 0&&e.push(`--tree-shaking=${y}`),c&&e.push("--ignore-annotations"),Q)for(let E of Q)e.push(`--drop:${le(E,"drop")}`);if(T&&e.push(`--drop-labels=${$e(T,"drop label")}`),K&&e.push(`--abs-paths=${$e(K,"abs paths")}`),I&&e.push(`--mangle-props=${qe(I)}`),U&&e.push(`--reserve-props=${qe(U)}`),D!==void 0&&e.push(`--mangle-quoted=${D}`),s&&e.push(`--jsx=${s}`),o&&e.push(`--jsx-factory=${o}`),d&&e.push(`--jsx-fragment=${d}`),_&&e.push(`--jsx-import-source=${_}`),k&&e.push("--jsx-dev"),u&&e.push("--jsx-side-effects"),m)for(let E in m){if(E.indexOf("=")>=0)throw new Error(`Invalid define: ${E}`);e.push(`--define:${E}=${le(m[E],"define",E)}`)}if(x)for(let E in x){if(E.indexOf("=")>=0)throw new Error(`Invalid log override: ${E}`);e.push(`--log-override:${E}=${le(x[E],"log override",E)}`)}if(n)for(let E in n){if(E.indexOf("=")>=0)throw new Error(`Invalid supported: ${E}`);const B=n[E];if(typeof B!="boolean")throw new Error(`Expected value for supported ${Y(E)} to be a boolean, got ${typeof B} instead`);e.push(`--supported:${E}=${B}`)}if(l)for(let E of l)e.push(`--pure:${le(E,"pure")}`);v&&e.push("--keep-names")}function Et(e,t,r,a,g){var w;let h=[],S=[],f=Object.create(null),I=null,U=null;Ve(h,t,f,r,a),it(h,t,f);let D=i(t,f,"sourcemap",tt),V=i(t,f,"bundle",X),R=i(t,f,"splitting",X),N=i(t,f,"preserveSymlinks",X),W=i(t,f,"metafile",X),j=i(t,f,"outfile",O),Q=i(t,f,"outdir",O),T=i(t,f,"outbase",O),$=i(t,f,"tsconfig",O),y=i(t,f,"resolveExtensions",ie),c=i(t,f,"nodePaths",ie),s=i(t,f,"mainFields",ie),o=i(t,f,"conditions",ie),d=i(t,f,"external",ie),_=i(t,f,"packages",O),k=i(t,f,"alias",ue),u=i(t,f,"loader",ue),m=i(t,f,"outExtension",ue),x=i(t,f,"publicPath",O),n=i(t,f,"entryNames",O),l=i(t,f,"chunkNames",O),v=i(t,f,"assetNames",O),b=i(t,f,"inject",ie),A=i(t,f,"banner",ue),K=i(t,f,"footer",ue),E=i(t,f,"entryPoints",bt),B=i(t,f,"absWorkingDir",O),F=i(t,f,"stdin",ue),M=(w=i(t,f,"write",X))!=null?w:g,oe=i(t,f,"allowOverwrite",X),ee=i(t,f,"mangleCache",ue);if(f.plugins=!0,Z(t,f,`in ${e}() call`),D&&h.push(`--sourcemap${D===!0?"":`=${D}`}`),V&&h.push("--bundle"),oe&&h.push("--allow-overwrite"),R&&h.push("--splitting"),N&&h.push("--preserve-symlinks"),W&&h.push("--metafile"),j&&h.push(`--outfile=${j}`),Q&&h.push(`--outdir=${Q}`),T&&h.push(`--outbase=${T}`),$&&h.push(`--tsconfig=${$}`),_&&h.push(`--packages=${_}`),y&&h.push(`--resolve-extensions=${$e(y,"resolve extension")}`),x&&h.push(`--public-path=${x}`),n&&h.push(`--entry-names=${n}`),l&&h.push(`--chunk-names=${l}`),v&&h.push(`--asset-names=${v}`),s&&h.push(`--main-fields=${$e(s,"main field")}`),o&&h.push(`--conditions=${$e(o,"condition")}`),d)for(let C of d)h.push(`--external:${le(C,"external")}`);if(k)for(let C in k){if(C.indexOf("=")>=0)throw new Error(`Invalid package name in alias: ${C}`);h.push(`--alias:${C}=${le(k[C],"alias",C)}`)}if(A)for(let C in A){if(C.indexOf("=")>=0)throw new Error(`Invalid banner file type: ${C}`);h.push(`--banner:${C}=${le(A[C],"banner",C)}`)}if(K)for(let C in K){if(C.indexOf("=")>=0)throw new Error(`Invalid footer file type: ${C}`);h.push(`--footer:${C}=${le(K[C],"footer",C)}`)}if(b)for(let C of b)h.push(`--inject:${le(C,"inject")}`);if(u)for(let C in u){if(C.indexOf("=")>=0)throw new Error(`Invalid loader extension: ${C}`);h.push(`--loader:${C}=${le(u[C],"loader",C)}`)}if(m)for(let C in m){if(C.indexOf("=")>=0)throw new Error(`Invalid out extension: ${C}`);h.push(`--out-extension:${C}=${le(m[C],"out extension",C)}`)}if(E)if(Array.isArray(E))for(let C=0,we=E.length;C<we;C++){let ce=E[C];if(typeof ce=="object"&&ce!==null){let he=Object.create(null),be=i(ce,he,"in",O),fe=i(ce,he,"out",O);if(Z(ce,he,"in entry point at index "+C),be===void 0)throw new Error('Missing property "in" for entry point at index '+C);if(fe===void 0)throw new Error('Missing property "out" for entry point at index '+C);S.push([fe,be])}else S.push(["",le(ce,"entry point at index "+C)])}else for(let C in E)S.push([C,le(E[C],"entry point",C)]);if(F){let C=Object.create(null),we=i(F,C,"contents",rt),ce=i(F,C,"resolveDir",O),he=i(F,C,"sourcefile",O),be=i(F,C,"loader",O);Z(F,C,'in "stdin" object'),he&&h.push(`--sourcefile=${he}`),be&&h.push(`--loader=${be}`),ce&&(U=ce),typeof we=="string"?I=G(we):we instanceof Uint8Array&&(I=we)}let ye=[];if(c)for(let C of c)C+="",ye.push(C);return{entries:S,flags:h,write:M,stdinContents:I,stdinResolveDir:U,absWorkingDir:B,nodePaths:ye,mangleCache:st(ee)}}function St(e,t,r,a){let g=[],w=Object.create(null);Ve(g,t,w,r,a),it(g,t,w);let h=i(t,w,"sourcemap",tt),S=i(t,w,"sourcefile",O),f=i(t,w,"loader",O),I=i(t,w,"banner",O),U=i(t,w,"footer",O),D=i(t,w,"mangleCache",ue);return Z(t,w,`in ${e}() call`),h&&g.push(`--sourcemap=${h===!0?"external":h}`),S&&g.push(`--sourcefile=${S}`),f&&g.push(`--loader=${f}`),I&&g.push(`--banner=${I}`),U&&g.push(`--footer=${U}`),{flags:g,mangleCache:st(D)}}function $t(e){const t={},r={didClose:!1,reason:""};let a={},g=0,w=0,h=new Uint8Array(16*1024),S=0,f=$=>{let y=S+$.length;if(y>h.length){let s=new Uint8Array(y*2);s.set(h),h=s}h.set($,S),S+=$.length;let c=0;for(;c+4<=S;){let s=Ie(h,c);if(c+4+s>S)break;c+=4,N(h.subarray(c,c+s)),c+=s}c>0&&(h.copyWithin(0,c,S),S-=c)},I=$=>{r.didClose=!0,$&&(r.reason=": "+($.message||$));const y="The service was stopped"+r.reason;for(let c in a)a[c](y,null);a={}},U=($,y,c)=>{if(r.didClose)return c("The service is no longer running"+r.reason,null);let s=g++;a[s]=(o,d)=>{try{c(o,d)}finally{$&&$.unref()}},$&&$.ref(),e.writeToStdin(ve({id:s,isRequest:!0,value:y}))},D=($,y)=>{if(r.didClose)throw new Error("The service is no longer running"+r.reason);e.writeToStdin(ve({id:$,isRequest:!1,value:y}))},V=($,y)=>ne(null,null,function*(){try{if(y.command==="ping"){D($,{});return}if(typeof y.key=="number"){const c=t[y.key];if(!c)return;const s=c[y.command];if(s){yield s($,y);return}}throw new Error("Invalid command: "+y.command)}catch(c){const s=[xe(c,e,null,void 0,"")];try{D($,{errors:s})}catch{}}}),R=!0,N=$=>{if(R){R=!1;let c=String.fromCharCode(...$);if(c!=="0.27.2")throw new Error(`Cannot start service: Host version "0.27.2" does not match binary version ${Y(c)}`);return}let y=De($);if(y.isRequest)V(y.id,y.value);else{let c=a[y.id];delete a[y.id],y.value.error?c(y.value.error,{}):c(null,y.value)}};return{readFromStdout:f,afterClose:I,service:{buildOrContext:({callName:$,refs:y,options:c,isTTY:s,defaultWD:o,callback:d})=>{let _=0;const k=w++,u={},m={ref(){++_===1&&y&&y.ref()},unref(){--_===0&&(delete t[k],y&&y.unref())}};t[k]=u,m.ref(),Tt($,k,U,D,m,e,u,c,s,o,(x,n)=>{try{d(x,n)}finally{m.unref()}})},transform:({callName:$,refs:y,input:c,options:s,isTTY:o,fs:d,callback:_})=>{const k=lt();let u=m=>{try{if(typeof c!="string"&&!(c instanceof Uint8Array))throw new Error('The input to "transform" must be a string or a Uint8Array');let{flags:x,mangleCache:n}=St($,s,o,Ue),l={command:"transform",flags:x,inputFS:m!==null,input:m!==null?G(m):typeof c=="string"?G(c):c};n&&(l.mangleCache=n),U(y,l,(v,b)=>{if(v)return _(new Error(v),null);let A=Te(b.errors,k),K=Te(b.warnings,k),E=1,B=()=>{if(--E===0){let F={warnings:K,code:b.code,map:b.map,mangleCache:void 0,legalComments:void 0};"legalComments"in b&&(F.legalComments=b?.legalComments),b.mangleCache&&(F.mangleCache=b?.mangleCache),_(null,F)}};if(A.length>0)return _(Me("Transform failed",A,K),null);b.codeFS&&(E++,d.readFile(b.code,(F,M)=>{F!==null?_(F,null):(b.code=M,B())})),b.mapFS&&(E++,d.readFile(b.map,(F,M)=>{F!==null?_(F,null):(b.map=M,B())})),B()})}catch(x){let n=[];try{Ve(n,s,{},o,Ue)}catch{}const l=xe(x,e,k,void 0,"");U(y,{command:"error",flags:n,error:l},()=>{l.detail=k.load(l.detail),_(Me("Transform failed",[l],[]),null)})}};if((typeof c=="string"||c instanceof Uint8Array)&&c.length>1024*1024){let m=u;u=()=>d.writeFile(c,m)}u(null)},formatMessages:({callName:$,refs:y,messages:c,options:s,callback:o})=>{if(!s)throw new Error(`Missing second argument in ${$}() call`);let d={},_=i(s,d,"kind",O),k=i(s,d,"color",X),u=i(s,d,"terminalWidth",_e);if(Z(s,d,`in ${$}() call`),_===void 0)throw new Error(`Missing "kind" in ${$}() call`);if(_!=="error"&&_!=="warning")throw new Error(`Expected "kind" to be "error" or "warning" in ${$}() call`);let m={command:"format-msgs",messages:ge(c,"messages",null,"",u),isWarning:_==="warning"};k!==void 0&&(m.color=k),u!==void 0&&(m.terminalWidth=u),U(y,m,(x,n)=>{if(x)return o(new Error(x),null);o(null,n.messages)})},analyzeMetafile:({callName:$,refs:y,metafile:c,options:s,callback:o})=>{s===void 0&&(s={});let d={},_=i(s,d,"color",X),k=i(s,d,"verbose",X);Z(s,d,`in ${$}() call`);let u={command:"analyze-metafile",metafile:c};_!==void 0&&(u.color=_),k!==void 0&&(u.verbose=k),U(y,u,(m,x)=>{if(m)return o(new Error(m),null);o(null,x.result)})}}}}function Tt(e,t,r,a,g,w,h,S,f,I,U){const D=lt(),V=e==="context",R=(j,Q)=>{const T=[];try{Ve(T,S,{},f,Se)}catch{}const $=xe(j,w,D,void 0,Q);r(g,{command:"error",flags:T,error:$},()=>{$.detail=D.load($.detail),U(Me(V?"Context failed":"Build failed",[$],[]),null)})};let N;if(typeof S=="object"){const j=S.plugins;if(j!==void 0){if(!Array.isArray(j))return R(new Error('"plugins" must be an array'),"");N=j}}if(N&&N.length>0){if(w.isSync)return R(new Error("Cannot use plugins in synchronous API calls"),"");jt(t,r,a,g,w,h,S,N,D).then(j=>{if(!j.ok)return R(j.error,j.pluginName);try{W(j.requestPlugins,j.runOnEndCallbacks,j.scheduleOnDisposeCallbacks)}catch(Q){R(Q,"")}},j=>R(j,""));return}try{W(null,(j,Q)=>Q([],[]),()=>{})}catch(j){R(j,"")}function W(j,Q,T){const $=w.hasFS,{entries:y,flags:c,write:s,stdinContents:o,stdinResolveDir:d,absWorkingDir:_,nodePaths:k,mangleCache:u}=Et(e,S,f,Se,$);if(s&&!w.hasFS)throw new Error('The "write" option is unavailable in this environment');const m={command:"build",key:t,entries:y,flags:c,write:s,stdinContents:o,stdinResolveDir:d,absWorkingDir:_||I,nodePaths:k,context:V};j&&(m.plugins=j),u&&(m.mangleCache=u);const x=(v,b)=>{const A={errors:Te(v.errors,D),warnings:Te(v.warnings,D),outputFiles:void 0,metafile:void 0,mangleCache:void 0},K=A.errors.slice(),E=A.warnings.slice();v.outputFiles&&(A.outputFiles=v.outputFiles.map(Ot)),v.metafile&&(A.metafile=JSON.parse(v.metafile)),v.mangleCache&&(A.mangleCache=v.mangleCache),v.writeToStdout!==void 0&&console.log(H(v.writeToStdout).replace(/\n$/,"")),Q(A,(B,F)=>{if(K.length>0||B.length>0){const M=Me("Build failed",K.concat(B),E.concat(F));return b(M,null,B,F)}b(null,A,B,F)})};let n,l;V&&(h["on-end"]=(v,b)=>new Promise(A=>{x(b,(K,E,B,F)=>{const M={errors:B,warnings:F};l&&l(K,E),n=void 0,l=void 0,a(v,M),A()})})),r(g,m,(v,b)=>{if(v)return U(new Error(v),null);if(!V)return x(b,(E,B)=>(T(),U(E,B)));if(b.errors.length>0)return U(Me("Context failed",b.errors,b.warnings),null);let A=!1;const K={rebuild:()=>(n||(n=new Promise((E,B)=>{let F;l=(oe,ee)=>{F||(F=()=>oe?B(oe):E(ee))};const M=()=>{r(g,{command:"rebuild",key:t},(ee,ye)=>{ee?B(new Error(ee)):F?F():M()})};M()})),n),watch:(E={})=>new Promise((B,F)=>{if(!w.hasFS)throw new Error('Cannot use the "watch" API in this environment');const M={},oe=i(E,M,"delay",_e);Z(E,M,"in watch() call");const ee={command:"watch",key:t};oe&&(ee.delay=oe),r(g,ee,ye=>{ye?F(new Error(ye)):B(void 0)})}),serve:(E={})=>new Promise((B,F)=>{if(!w.hasFS)throw new Error('Cannot use the "serve" API in this environment');const M={},oe=i(E,M,"port",wt),ee=i(E,M,"host",O),ye=i(E,M,"servedir",O),C=i(E,M,"keyfile",O),we=i(E,M,"certfile",O),ce=i(E,M,"fallback",O),he=i(E,M,"cors",ue),be=i(E,M,"onRequest",Ze);Z(E,M,"in serve() call");const fe={command:"serve",key:t,onRequest:!!be};if(oe!==void 0&&(fe.port=oe),ee!==void 0&&(fe.host=ee),ye!==void 0&&(fe.servedir=ye),C!==void 0&&(fe.keyfile=C),we!==void 0&&(fe.certfile=we),ce!==void 0&&(fe.fallback=ce),he){const Ne={},je=i(he,Ne,"origin",nt);Z(he,Ne,'on "cors" object'),Array.isArray(je)?fe.corsOrigin=je:je!==void 0&&(fe.corsOrigin=[je])}r(g,fe,(Ne,je)=>{if(Ne)return F(new Error(Ne));be&&(h["serve-request"]=(Gt,qt)=>{be(qt.args),a(Gt,{})}),B(je)})}),cancel:()=>new Promise(E=>{if(A)return E();r(g,{command:"cancel",key:t},()=>{E()})}),dispose:()=>new Promise(E=>{if(A)return E();A=!0,r(g,{command:"dispose",key:t},()=>{E(),T(),g.unref()})})};g.ref(),U(null,K)})}}var jt=(e,t,r,a,g,w,h,S,f)=>ne(null,null,function*(){let I=[],U=[],D={},V={},R=[],N=0,W=0,j=[],Q=!1;S=[...S];for(let y of S){let c={};if(typeof y!="object")throw new Error(`Plugin at index ${W} must be an object`);const s=i(y,c,"name",O);if(typeof s!="string"||s==="")throw new Error(`Plugin at index ${W} is missing a name`);try{let o=i(y,c,"setup",Ze);if(typeof o!="function")throw new Error("Plugin is missing a setup function");Z(y,c,`on plugin ${Y(s)}`);let d={name:s,onStart:!1,onEnd:!1,onResolve:[],onLoad:[]};W++;let k=o({initialOptions:h,resolve:(u,m={})=>{if(!Q)throw new Error('Cannot call "resolve" before plugin setup has completed');if(typeof u!="string")throw new Error("The path to resolve must be a string");let x=Object.create(null),n=i(m,x,"pluginName",O),l=i(m,x,"importer",O),v=i(m,x,"namespace",O),b=i(m,x,"resolveDir",O),A=i(m,x,"kind",O),K=i(m,x,"pluginData",Be),E=i(m,x,"with",ue);return Z(m,x,"in resolve() call"),new Promise((B,F)=>{const M={command:"resolve",path:u,key:e,pluginName:s};if(n!=null&&(M.pluginName=n),l!=null&&(M.importer=l),v!=null&&(M.namespace=v),b!=null&&(M.resolveDir=b),A!=null)M.kind=A;else throw new Error('Must specify "kind" when calling "resolve"');K!=null&&(M.pluginData=f.store(K)),E!=null&&(M.with=Pt(E,"with")),t(a,M,(oe,ee)=>{oe!==null?F(new Error(oe)):B({errors:Te(ee.errors,f),warnings:Te(ee.warnings,f),path:ee.path,external:ee.external,sideEffects:ee.sideEffects,namespace:ee.namespace,suffix:ee.suffix,pluginData:f.load(ee.pluginData)})})})},onStart(u){let m='This error came from the "onStart" callback registered here:',x=ze(new Error(m),g,"onStart");I.push({name:s,callback:u,note:x}),d.onStart=!0},onEnd(u){let m='This error came from the "onEnd" callback registered here:',x=ze(new Error(m),g,"onEnd");U.push({name:s,callback:u,note:x}),d.onEnd=!0},onResolve(u,m){let x='This error came from the "onResolve" callback registered here:',n=ze(new Error(x),g,"onResolve"),l={},v=i(u,l,"filter",Le),b=i(u,l,"namespace",O);if(Z(u,l,`in onResolve() call for plugin ${Y(s)}`),v==null)throw new Error("onResolve() call is missing a filter");let A=N++;D[A]={name:s,callback:m,note:n},d.onResolve.push({id:A,filter:qe(v),namespace:b||""})},onLoad(u,m){let x='This error came from the "onLoad" callback registered here:',n=ze(new Error(x),g,"onLoad"),l={},v=i(u,l,"filter",Le),b=i(u,l,"namespace",O);if(Z(u,l,`in onLoad() call for plugin ${Y(s)}`),v==null)throw new Error("onLoad() call is missing a filter");let A=N++;V[A]={name:s,callback:m,note:n},d.onLoad.push({id:A,filter:qe(v),namespace:b||""})},onDispose(u){R.push(u)},esbuild:g.esbuild});k&&(yield k),j.push(d)}catch(o){return{ok:!1,error:o,pluginName:s}}}w["on-start"]=(y,c)=>ne(null,null,function*(){f.clear();let s={errors:[],warnings:[]};yield Promise.all(I.map(o=>ne(null,[o],function*({name:d,callback:_,note:k}){try{let u=yield _();if(u!=null){if(typeof u!="object")throw new Error(`Expected onStart() callback in plugin ${Y(d)} to return an object`);let m={},x=i(u,m,"errors",pe),n=i(u,m,"warnings",pe);Z(u,m,`from onStart() callback in plugin ${Y(d)}`),x!=null&&s.errors.push(...ge(x,"errors",f,d,void 0)),n!=null&&s.warnings.push(...ge(n,"warnings",f,d,void 0))}}catch(u){s.errors.push(xe(u,g,f,k&&k(),d))}}))),r(y,s)}),w["on-resolve"]=(y,c)=>ne(null,null,function*(){let s={},o="",d,_;for(let k of c.ids)try{({name:o,callback:d,note:_}=D[k]);let u=yield d({path:c.path,importer:c.importer,namespace:c.namespace,resolveDir:c.resolveDir,kind:c.kind,pluginData:f.load(c.pluginData),with:c.with});if(u!=null){if(typeof u!="object")throw new Error(`Expected onResolve() callback in plugin ${Y(o)} to return an object`);let m={},x=i(u,m,"pluginName",O),n=i(u,m,"path",O),l=i(u,m,"namespace",O),v=i(u,m,"suffix",O),b=i(u,m,"external",X),A=i(u,m,"sideEffects",X),K=i(u,m,"pluginData",Be),E=i(u,m,"errors",pe),B=i(u,m,"warnings",pe),F=i(u,m,"watchFiles",ie),M=i(u,m,"watchDirs",ie);Z(u,m,`from onResolve() callback in plugin ${Y(o)}`),s.id=k,x!=null&&(s.pluginName=x),n!=null&&(s.path=n),l!=null&&(s.namespace=l),v!=null&&(s.suffix=v),b!=null&&(s.external=b),A!=null&&(s.sideEffects=A),K!=null&&(s.pluginData=f.store(K)),E!=null&&(s.errors=ge(E,"errors",f,o,void 0)),B!=null&&(s.warnings=ge(B,"warnings",f,o,void 0)),F!=null&&(s.watchFiles=Ge(F,"watchFiles")),M!=null&&(s.watchDirs=Ge(M,"watchDirs"));break}}catch(u){s={id:k,errors:[xe(u,g,f,_&&_(),o)]};break}r(y,s)}),w["on-load"]=(y,c)=>ne(null,null,function*(){let s={},o="",d,_;for(let k of c.ids)try{({name:o,callback:d,note:_}=V[k]);let u=yield d({path:c.path,namespace:c.namespace,suffix:c.suffix,pluginData:f.load(c.pluginData),with:c.with});if(u!=null){if(typeof u!="object")throw new Error(`Expected onLoad() callback in plugin ${Y(o)} to return an object`);let m={},x=i(u,m,"pluginName",O),n=i(u,m,"contents",rt),l=i(u,m,"resolveDir",O),v=i(u,m,"pluginData",Be),b=i(u,m,"loader",O),A=i(u,m,"errors",pe),K=i(u,m,"warnings",pe),E=i(u,m,"watchFiles",ie),B=i(u,m,"watchDirs",ie);Z(u,m,`from onLoad() callback in plugin ${Y(o)}`),s.id=k,x!=null&&(s.pluginName=x),n instanceof Uint8Array?s.contents=n:n!=null&&(s.contents=G(n)),l!=null&&(s.resolveDir=l),v!=null&&(s.pluginData=f.store(v)),b!=null&&(s.loader=b),A!=null&&(s.errors=ge(A,"errors",f,o,void 0)),K!=null&&(s.warnings=ge(K,"warnings",f,o,void 0)),E!=null&&(s.watchFiles=Ge(E,"watchFiles")),B!=null&&(s.watchDirs=Ge(B,"watchDirs"));break}}catch(u){s={id:k,errors:[xe(u,g,f,_&&_(),o)]};break}r(y,s)});let T=(y,c)=>c([],[]);U.length>0&&(T=(y,c)=>{ne(null,null,function*(){const s=[],o=[];for(const{name:d,callback:_,note:k}of U){let u,m;try{const x=yield _(y);if(x!=null){if(typeof x!="object")throw new Error(`Expected onEnd() callback in plugin ${Y(d)} to return an object`);let n={},l=i(x,n,"errors",pe),v=i(x,n,"warnings",pe);Z(x,n,`from onEnd() callback in plugin ${Y(d)}`),l!=null&&(u=ge(l,"errors",f,d,void 0)),v!=null&&(m=ge(v,"warnings",f,d,void 0))}}catch(x){u=[xe(x,g,f,k&&k(),d)]}if(u){s.push(...u);try{y.errors.push(...u)}catch{}}if(m){o.push(...m);try{y.warnings.push(...m)}catch{}}}c(s,o)})});let $=()=>{for(const y of R)setTimeout(()=>y(),0)};return Q=!0,{ok:!0,requestPlugins:j,runOnEndCallbacks:T,scheduleOnDisposeCallbacks:$}});function lt(){const e=new Map;let t=0;return{clear(){e.clear()},load(r){return e.get(r)},store(r){if(r===void 0)return-1;const a=t++;return e.set(a,r),a}}}function ze(e,t,r){let a,g=!1;return()=>{if(g)return a;g=!0;try{let w=(e.stack+"").split(`
`);w.splice(1,1);let h=ot(t,w,r);if(h)return a={text:e.message,location:h},a}catch{}}}function xe(e,t,r,a,g){let w="Internal error",h=null;try{w=(e&&e.message||e)+""}catch{}try{h=ot(t,(e.stack+"").split(`
`),"")}catch{}return{id:"",pluginName:g,text:w,location:h,notes:a?[a]:[],detail:r?r.store(e):-1}}function ot(e,t,r){let a="    at ";if(e.readFileSync&&!t[0].startsWith(a)&&t[1].startsWith(a))for(let g=1;g<t.length;g++){let w=t[g];if(w.startsWith(a))for(w=w.slice(a.length);;){let h=/^(?:new |async )?\S+ \((.*)\)$/.exec(w);if(h){w=h[1];continue}if(h=/^eval at \S+ \((.*)\)(?:, \S+:\d+:\d+)?$/.exec(w),h){w=h[1];continue}if(h=/^(\S+):(\d+):(\d+)$/.exec(w),h){let S;try{S=e.readFileSync(h[1],"utf8")}catch{break}let f=S.split(/\r\n|\r|\n|\u2028|\u2029/)[+h[2]-1]||"",I=+h[3]-1,U=f.slice(I,I+r.length)===r?r.length:0;return{file:h[1],namespace:"file",line:+h[2],column:G(f.slice(0,I)).length,length:G(f.slice(I,I+U)).length,lineText:f+`
`+t.slice(1).join(`
`),suggestion:""}}break}}return null}function Me(e,t,r){let a=5;e+=t.length<1?"":` with ${t.length} error${t.length<2?"":"s"}:`+t.slice(0,a+1).map((w,h)=>{if(h===a)return`
...`;if(!w.location)return`
error: ${w.text}`;let{file:S,line:f,column:I}=w.location,U=w.pluginName?`[plugin: ${w.pluginName}] `:"";return`
${S}:${f}:${I}: ERROR: ${U}${w.text}`}).join("");let g=new Error(e);for(const[w,h]of[["errors",t],["warnings",r]])Object.defineProperty(g,w,{configurable:!0,enumerable:!0,get:()=>h,set:S=>Object.defineProperty(g,w,{configurable:!0,enumerable:!0,value:S})});return g}function Te(e,t){for(const r of e)r.detail=t.load(r.detail);return e}function at(e,t,r){if(e==null)return null;let a={},g=i(e,a,"file",O),w=i(e,a,"namespace",O),h=i(e,a,"line",_e),S=i(e,a,"column",_e),f=i(e,a,"length",_e),I=i(e,a,"lineText",O),U=i(e,a,"suggestion",O);if(Z(e,a,t),I){const D=I.slice(0,(S&&S>0?S:0)+(f&&f>0?f:0)+(r&&r>0?r:80));!/[\x7F-\uFFFF]/.test(D)&&!/\n/.test(I)&&(I=D)}return{file:g||"",namespace:w||"",line:h||0,column:S||0,length:f||0,lineText:I||"",suggestion:U||""}}function ge(e,t,r,a,g){let w=[],h=0;for(const S of e){let f={},I=i(S,f,"id",O),U=i(S,f,"pluginName",O),D=i(S,f,"text",O),V=i(S,f,"location",et),R=i(S,f,"notes",pe),N=i(S,f,"detail",Be),W=`in element ${h} of "${t}"`;Z(S,f,W);let j=[];if(R)for(const Q of R){let T={},$=i(Q,T,"text",O),y=i(Q,T,"location",et);Z(Q,T,W),j.push({text:$||"",location:at(y,W,g)})}w.push({id:I||"",pluginName:U||a,text:D||"",location:at(V,W,g),notes:j,detail:r?r.store(N):-1}),h++}return w}function Ge(e,t){const r=[];for(const a of e){if(typeof a!="string")throw new Error(`${Y(t)} must be an array of strings`);r.push(a)}return r}function Pt(e,t){const r=Object.create(null);for(const a in e){const g=e[a];if(typeof g!="string")throw new Error(`key ${Y(a)} in object ${Y(t)} must be a string`);r[a]=g}return r}function Ot({path:e,contents:t,hash:r}){let a=null;return{path:e,contents:t,hash:r,get text(){const g=this.contents;return(a===null||g!==t)&&(t=g,a=H(g)),a}}}function qe(e){let t=e.source;return e.flags&&(t=`(?${e.flags})${t}`),t}var Ct="0.27.2",At=e=>Fe().build(e),Dt=e=>Fe().context(e),Rt=(e,t)=>Fe().transform(e,t),It=(e,t)=>Fe().formatMessages(e,t),Ut=(e,t)=>Fe().analyzeMetafile(e,t),Mt=()=>{throw new Error('The "buildSync" API only works in node')},Ft=()=>{throw new Error('The "transformSync" API only works in node')},Nt=()=>{throw new Error('The "formatMessagesSync" API only works in node')},Wt=()=>{throw new Error('The "analyzeMetafileSync" API only works in node')},Bt=()=>(Je&&Je(),Promise.resolve()),ke,Je,Ye,Fe=()=>{if(Ye)return Ye;throw ke?new Error('You need to wait for the promise returned from "initialize" to be resolved before calling this'):new Error('You need to call "initialize" before calling this')},Lt=e=>{e=kt(e||{});let t=e.wasmURL,r=e.wasmModule,a=e.worker!==!1;if(!t&&!r)throw new Error('Must provide either the "wasmURL" option or the "wasmModule" option');if(ke)throw new Error('Cannot call "initialize" more than once');return ke=Vt(t||"",r,a),ke.catch(()=>{ke=void 0}),ke},Vt=(e,t,r)=>ne(null,null,function*(){let a,g;const w=new Promise(D=>g=D);if(r){let D=new Blob([`onmessage=((postMessage) => {
      // Copyright 2018 The Go Authors. All rights reserved.
      // Use of this source code is governed by a BSD-style
      // license that can be found in the LICENSE file.
      var __async = (__this, __arguments, generator) => {
        return new Promise((resolve, reject) => {
          var fulfilled = (value) => {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          };
          var rejected = (value) => {
            try {
              step(generator.throw(value));
            } catch (e) {
              reject(e);
            }
          };
          var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
          step((generator = generator.apply(__this, __arguments)).next());
        });
      };
      let onmessage;
      let globalThis = {};
      for (let o = self; o; o = Object.getPrototypeOf(o))
        for (let k of Object.getOwnPropertyNames(o))
          if (!(k in globalThis))
            Object.defineProperty(globalThis, k, { get: () => self[k] });
      "use strict";
      (() => {
        const enosys = () => {
          const err = new Error("not implemented");
          err.code = "ENOSYS";
          return err;
        };
        if (!globalThis.fs) {
          let outputBuf = "";
          globalThis.fs = {
            constants: { O_WRONLY: -1, O_RDWR: -1, O_CREAT: -1, O_TRUNC: -1, O_APPEND: -1, O_EXCL: -1, O_DIRECTORY: -1 },
            // unused
            writeSync(fd, buf) {
              outputBuf += decoder.decode(buf);
              const nl = outputBuf.lastIndexOf("\\n");
              if (nl != -1) {
                console.log(outputBuf.substring(0, nl));
                outputBuf = outputBuf.substring(nl + 1);
              }
              return buf.length;
            },
            write(fd, buf, offset, length, position, callback) {
              if (offset !== 0 || length !== buf.length || position !== null) {
                callback(enosys());
                return;
              }
              const n = this.writeSync(fd, buf);
              callback(null, n);
            },
            chmod(path, mode, callback) {
              callback(enosys());
            },
            chown(path, uid, gid, callback) {
              callback(enosys());
            },
            close(fd, callback) {
              callback(enosys());
            },
            fchmod(fd, mode, callback) {
              callback(enosys());
            },
            fchown(fd, uid, gid, callback) {
              callback(enosys());
            },
            fstat(fd, callback) {
              callback(enosys());
            },
            fsync(fd, callback) {
              callback(null);
            },
            ftruncate(fd, length, callback) {
              callback(enosys());
            },
            lchown(path, uid, gid, callback) {
              callback(enosys());
            },
            link(path, link, callback) {
              callback(enosys());
            },
            lstat(path, callback) {
              callback(enosys());
            },
            mkdir(path, perm, callback) {
              callback(enosys());
            },
            open(path, flags, mode, callback) {
              callback(enosys());
            },
            read(fd, buffer, offset, length, position, callback) {
              callback(enosys());
            },
            readdir(path, callback) {
              callback(enosys());
            },
            readlink(path, callback) {
              callback(enosys());
            },
            rename(from, to, callback) {
              callback(enosys());
            },
            rmdir(path, callback) {
              callback(enosys());
            },
            stat(path, callback) {
              callback(enosys());
            },
            symlink(path, link, callback) {
              callback(enosys());
            },
            truncate(path, length, callback) {
              callback(enosys());
            },
            unlink(path, callback) {
              callback(enosys());
            },
            utimes(path, atime, mtime, callback) {
              callback(enosys());
            }
          };
        }
        if (!globalThis.process) {
          globalThis.process = {
            getuid() {
              return -1;
            },
            getgid() {
              return -1;
            },
            geteuid() {
              return -1;
            },
            getegid() {
              return -1;
            },
            getgroups() {
              throw enosys();
            },
            pid: -1,
            ppid: -1,
            umask() {
              throw enosys();
            },
            cwd() {
              throw enosys();
            },
            chdir() {
              throw enosys();
            }
          };
        }
        if (!globalThis.path) {
          globalThis.path = {
            resolve(...pathSegments) {
              return pathSegments.join("/");
            }
          };
        }
        if (!globalThis.crypto) {
          throw new Error("globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)");
        }
        if (!globalThis.performance) {
          throw new Error("globalThis.performance is not available, polyfill required (performance.now only)");
        }
        if (!globalThis.TextEncoder) {
          throw new Error("globalThis.TextEncoder is not available, polyfill required");
        }
        if (!globalThis.TextDecoder) {
          throw new Error("globalThis.TextDecoder is not available, polyfill required");
        }
        const encoder = new TextEncoder("utf-8");
        const decoder = new TextDecoder("utf-8");
        globalThis.Go = class {
          constructor() {
            this.argv = ["js"];
            this.env = {};
            this.exit = (code) => {
              if (code !== 0) {
                console.warn("exit code:", code);
              }
            };
            this._exitPromise = new Promise((resolve) => {
              this._resolveExitPromise = resolve;
            });
            this._pendingEvent = null;
            this._scheduledTimeouts = /* @__PURE__ */ new Map();
            this._nextCallbackTimeoutID = 1;
            const setInt64 = (addr, v) => {
              this.mem.setUint32(addr + 0, v, true);
              this.mem.setUint32(addr + 4, Math.floor(v / 4294967296), true);
            };
            const setInt32 = (addr, v) => {
              this.mem.setUint32(addr + 0, v, true);
            };
            const getInt64 = (addr) => {
              const low = this.mem.getUint32(addr + 0, true);
              const high = this.mem.getInt32(addr + 4, true);
              return low + high * 4294967296;
            };
            const loadValue = (addr) => {
              const f = this.mem.getFloat64(addr, true);
              if (f === 0) {
                return void 0;
              }
              if (!isNaN(f)) {
                return f;
              }
              const id = this.mem.getUint32(addr, true);
              return this._values[id];
            };
            const storeValue = (addr, v) => {
              const nanHead = 2146959360;
              if (typeof v === "number" && v !== 0) {
                if (isNaN(v)) {
                  this.mem.setUint32(addr + 4, nanHead, true);
                  this.mem.setUint32(addr, 0, true);
                  return;
                }
                this.mem.setFloat64(addr, v, true);
                return;
              }
              if (v === void 0) {
                this.mem.setFloat64(addr, 0, true);
                return;
              }
              let id = this._ids.get(v);
              if (id === void 0) {
                id = this._idPool.pop();
                if (id === void 0) {
                  id = this._values.length;
                }
                this._values[id] = v;
                this._goRefCounts[id] = 0;
                this._ids.set(v, id);
              }
              this._goRefCounts[id]++;
              let typeFlag = 0;
              switch (typeof v) {
                case "object":
                  if (v !== null) {
                    typeFlag = 1;
                  }
                  break;
                case "string":
                  typeFlag = 2;
                  break;
                case "symbol":
                  typeFlag = 3;
                  break;
                case "function":
                  typeFlag = 4;
                  break;
              }
              this.mem.setUint32(addr + 4, nanHead | typeFlag, true);
              this.mem.setUint32(addr, id, true);
            };
            const loadSlice = (addr) => {
              const array = getInt64(addr + 0);
              const len = getInt64(addr + 8);
              return new Uint8Array(this._inst.exports.mem.buffer, array, len);
            };
            const loadSliceOfValues = (addr) => {
              const array = getInt64(addr + 0);
              const len = getInt64(addr + 8);
              const a = new Array(len);
              for (let i = 0; i < len; i++) {
                a[i] = loadValue(array + i * 8);
              }
              return a;
            };
            const loadString = (addr) => {
              const saddr = getInt64(addr + 0);
              const len = getInt64(addr + 8);
              return decoder.decode(new DataView(this._inst.exports.mem.buffer, saddr, len));
            };
            const testCallExport = (a, b) => {
              this._inst.exports.testExport0();
              return this._inst.exports.testExport(a, b);
            };
            const timeOrigin = Date.now() - performance.now();
            this.importObject = {
              _gotest: {
                add: (a, b) => a + b,
                callExport: testCallExport
              },
              gojs: {
                // Go's SP does not change as long as no Go code is running. Some operations (e.g. calls, getters and setters)
                // may synchronously trigger a Go event handler. This makes Go code get executed in the middle of the imported
                // function. A goroutine can switch to a new stack if the current stack is too small (see morestack function).
                // This changes the SP, thus we have to update the SP used by the imported function.
                // func wasmExit(code int32)
                "runtime.wasmExit": (sp) => {
                  sp >>>= 0;
                  const code = this.mem.getInt32(sp + 8, true);
                  this.exited = true;
                  delete this._inst;
                  delete this._values;
                  delete this._goRefCounts;
                  delete this._ids;
                  delete this._idPool;
                  this.exit(code);
                },
                // func wasmWrite(fd uintptr, p unsafe.Pointer, n int32)
                "runtime.wasmWrite": (sp) => {
                  sp >>>= 0;
                  const fd = getInt64(sp + 8);
                  const p = getInt64(sp + 16);
                  const n = this.mem.getInt32(sp + 24, true);
                  globalThis.fs.writeSync(fd, new Uint8Array(this._inst.exports.mem.buffer, p, n));
                },
                // func resetMemoryDataView()
                "runtime.resetMemoryDataView": (sp) => {
                  sp >>>= 0;
                  this.mem = new DataView(this._inst.exports.mem.buffer);
                },
                // func nanotime1() int64
                "runtime.nanotime1": (sp) => {
                  sp >>>= 0;
                  setInt64(sp + 8, (timeOrigin + performance.now()) * 1e6);
                },
                // func walltime() (sec int64, nsec int32)
                "runtime.walltime": (sp) => {
                  sp >>>= 0;
                  const msec = (/* @__PURE__ */ new Date()).getTime();
                  setInt64(sp + 8, msec / 1e3);
                  this.mem.setInt32(sp + 16, msec % 1e3 * 1e6, true);
                },
                // func scheduleTimeoutEvent(delay int64) int32
                "runtime.scheduleTimeoutEvent": (sp) => {
                  sp >>>= 0;
                  const id = this._nextCallbackTimeoutID;
                  this._nextCallbackTimeoutID++;
                  this._scheduledTimeouts.set(id, setTimeout(
                    () => {
                      this._resume();
                      while (this._scheduledTimeouts.has(id)) {
                        console.warn("scheduleTimeoutEvent: missed timeout event");
                        this._resume();
                      }
                    },
                    getInt64(sp + 8)
                  ));
                  this.mem.setInt32(sp + 16, id, true);
                },
                // func clearTimeoutEvent(id int32)
                "runtime.clearTimeoutEvent": (sp) => {
                  sp >>>= 0;
                  const id = this.mem.getInt32(sp + 8, true);
                  clearTimeout(this._scheduledTimeouts.get(id));
                  this._scheduledTimeouts.delete(id);
                },
                // func getRandomData(r []byte)
                "runtime.getRandomData": (sp) => {
                  sp >>>= 0;
                  crypto.getRandomValues(loadSlice(sp + 8));
                },
                // func finalizeRef(v ref)
                "syscall/js.finalizeRef": (sp) => {
                  sp >>>= 0;
                  const id = this.mem.getUint32(sp + 8, true);
                  this._goRefCounts[id]--;
                  if (this._goRefCounts[id] === 0) {
                    const v = this._values[id];
                    this._values[id] = null;
                    this._ids.delete(v);
                    this._idPool.push(id);
                  }
                },
                // func stringVal(value string) ref
                "syscall/js.stringVal": (sp) => {
                  sp >>>= 0;
                  storeValue(sp + 24, loadString(sp + 8));
                },
                // func valueGet(v ref, p string) ref
                "syscall/js.valueGet": (sp) => {
                  sp >>>= 0;
                  const result = Reflect.get(loadValue(sp + 8), loadString(sp + 16));
                  sp = this._inst.exports.getsp() >>> 0;
                  storeValue(sp + 32, result);
                },
                // func valueSet(v ref, p string, x ref)
                "syscall/js.valueSet": (sp) => {
                  sp >>>= 0;
                  Reflect.set(loadValue(sp + 8), loadString(sp + 16), loadValue(sp + 32));
                },
                // func valueDelete(v ref, p string)
                "syscall/js.valueDelete": (sp) => {
                  sp >>>= 0;
                  Reflect.deleteProperty(loadValue(sp + 8), loadString(sp + 16));
                },
                // func valueIndex(v ref, i int) ref
                "syscall/js.valueIndex": (sp) => {
                  sp >>>= 0;
                  storeValue(sp + 24, Reflect.get(loadValue(sp + 8), getInt64(sp + 16)));
                },
                // valueSetIndex(v ref, i int, x ref)
                "syscall/js.valueSetIndex": (sp) => {
                  sp >>>= 0;
                  Reflect.set(loadValue(sp + 8), getInt64(sp + 16), loadValue(sp + 24));
                },
                // func valueCall(v ref, m string, args []ref) (ref, bool)
                "syscall/js.valueCall": (sp) => {
                  sp >>>= 0;
                  try {
                    const v = loadValue(sp + 8);
                    const m = Reflect.get(v, loadString(sp + 16));
                    const args = loadSliceOfValues(sp + 32);
                    const result = Reflect.apply(m, v, args);
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 56, result);
                    this.mem.setUint8(sp + 64, 1);
                  } catch (err) {
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 56, err);
                    this.mem.setUint8(sp + 64, 0);
                  }
                },
                // func valueInvoke(v ref, args []ref) (ref, bool)
                "syscall/js.valueInvoke": (sp) => {
                  sp >>>= 0;
                  try {
                    const v = loadValue(sp + 8);
                    const args = loadSliceOfValues(sp + 16);
                    const result = Reflect.apply(v, void 0, args);
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 40, result);
                    this.mem.setUint8(sp + 48, 1);
                  } catch (err) {
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 40, err);
                    this.mem.setUint8(sp + 48, 0);
                  }
                },
                // func valueNew(v ref, args []ref) (ref, bool)
                "syscall/js.valueNew": (sp) => {
                  sp >>>= 0;
                  try {
                    const v = loadValue(sp + 8);
                    const args = loadSliceOfValues(sp + 16);
                    const result = Reflect.construct(v, args);
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 40, result);
                    this.mem.setUint8(sp + 48, 1);
                  } catch (err) {
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 40, err);
                    this.mem.setUint8(sp + 48, 0);
                  }
                },
                // func valueLength(v ref) int
                "syscall/js.valueLength": (sp) => {
                  sp >>>= 0;
                  setInt64(sp + 16, parseInt(loadValue(sp + 8).length));
                },
                // valuePrepareString(v ref) (ref, int)
                "syscall/js.valuePrepareString": (sp) => {
                  sp >>>= 0;
                  const str = encoder.encode(String(loadValue(sp + 8)));
                  storeValue(sp + 16, str);
                  setInt64(sp + 24, str.length);
                },
                // valueLoadString(v ref, b []byte)
                "syscall/js.valueLoadString": (sp) => {
                  sp >>>= 0;
                  const str = loadValue(sp + 8);
                  loadSlice(sp + 16).set(str);
                },
                // func valueInstanceOf(v ref, t ref) bool
                "syscall/js.valueInstanceOf": (sp) => {
                  sp >>>= 0;
                  this.mem.setUint8(sp + 24, loadValue(sp + 8) instanceof loadValue(sp + 16) ? 1 : 0);
                },
                // func copyBytesToGo(dst []byte, src ref) (int, bool)
                "syscall/js.copyBytesToGo": (sp) => {
                  sp >>>= 0;
                  const dst = loadSlice(sp + 8);
                  const src = loadValue(sp + 32);
                  if (!(src instanceof Uint8Array || src instanceof Uint8ClampedArray)) {
                    this.mem.setUint8(sp + 48, 0);
                    return;
                  }
                  const toCopy = src.subarray(0, dst.length);
                  dst.set(toCopy);
                  setInt64(sp + 40, toCopy.length);
                  this.mem.setUint8(sp + 48, 1);
                },
                // func copyBytesToJS(dst ref, src []byte) (int, bool)
                "syscall/js.copyBytesToJS": (sp) => {
                  sp >>>= 0;
                  const dst = loadValue(sp + 8);
                  const src = loadSlice(sp + 16);
                  if (!(dst instanceof Uint8Array || dst instanceof Uint8ClampedArray)) {
                    this.mem.setUint8(sp + 48, 0);
                    return;
                  }
                  const toCopy = src.subarray(0, dst.length);
                  dst.set(toCopy);
                  setInt64(sp + 40, toCopy.length);
                  this.mem.setUint8(sp + 48, 1);
                },
                "debug": (value) => {
                  console.log(value);
                }
              }
            };
          }
          run(instance) {
            return __async(this, null, function* () {
              if (!(instance instanceof WebAssembly.Instance)) {
                throw new Error("Go.run: WebAssembly.Instance expected");
              }
              this._inst = instance;
              this.mem = new DataView(this._inst.exports.mem.buffer);
              this._values = [
                // JS values that Go currently has references to, indexed by reference id
                NaN,
                0,
                null,
                true,
                false,
                globalThis,
                this
              ];
              this._goRefCounts = new Array(this._values.length).fill(Infinity);
              this._ids = /* @__PURE__ */ new Map([
                // mapping from JS values to reference ids
                [0, 1],
                [null, 2],
                [true, 3],
                [false, 4],
                [globalThis, 5],
                [this, 6]
              ]);
              this._idPool = [];
              this.exited = false;
              let offset = 4096;
              const strPtr = (str) => {
                const ptr = offset;
                const bytes = encoder.encode(str + "\\0");
                new Uint8Array(this.mem.buffer, offset, bytes.length).set(bytes);
                offset += bytes.length;
                if (offset % 8 !== 0) {
                  offset += 8 - offset % 8;
                }
                return ptr;
              };
              const argc = this.argv.length;
              const argvPtrs = [];
              this.argv.forEach((arg) => {
                argvPtrs.push(strPtr(arg));
              });
              argvPtrs.push(0);
              const keys = Object.keys(this.env).sort();
              keys.forEach((key) => {
                argvPtrs.push(strPtr(\`\${key}=\${this.env[key]}\`));
              });
              argvPtrs.push(0);
              const argv = offset;
              argvPtrs.forEach((ptr) => {
                this.mem.setUint32(offset, ptr, true);
                this.mem.setUint32(offset + 4, 0, true);
                offset += 8;
              });
              const wasmMinDataAddr = 4096 + 8192;
              if (offset >= wasmMinDataAddr) {
                throw new Error("total length of command line and environment variables exceeds limit");
              }
              this._inst.exports.run(argc, argv);
              if (this.exited) {
                this._resolveExitPromise();
              }
              yield this._exitPromise;
            });
          }
          _resume() {
            if (this.exited) {
              throw new Error("Go program has already exited");
            }
            this._inst.exports.resume();
            if (this.exited) {
              this._resolveExitPromise();
            }
          }
          _makeFuncWrapper(id) {
            const go = this;
            return function() {
              const event = { id, this: this, args: arguments };
              go._pendingEvent = event;
              go._resume();
              return event.result;
            };
          }
        };
      })();
      onmessage = ({ data: wasm }) => {
        let decoder = new TextDecoder();
        let fs = globalThis.fs;
        let stderr = "";
        fs.writeSync = (fd, buffer) => {
          if (fd === 1) {
            postMessage(buffer);
          } else if (fd === 2) {
            stderr += decoder.decode(buffer);
            let parts = stderr.split("\\n");
            if (parts.length > 1) console.log(parts.slice(0, -1).join("\\n"));
            stderr = parts[parts.length - 1];
          } else {
            throw new Error("Bad write");
          }
          return buffer.length;
        };
        let stdin = [];
        let resumeStdin;
        let stdinPos = 0;
        onmessage = ({ data }) => {
          if (data.length > 0) {
            stdin.push(data);
            if (resumeStdin) resumeStdin();
          }
          return go;
        };
        fs.read = (fd, buffer, offset, length, position, callback) => {
          if (fd !== 0 || offset !== 0 || length !== buffer.length || position !== null) {
            throw new Error("Bad read");
          }
          if (stdin.length === 0) {
            resumeStdin = () => fs.read(fd, buffer, offset, length, position, callback);
            return;
          }
          let first = stdin[0];
          let count = Math.max(0, Math.min(length, first.length - stdinPos));
          buffer.set(first.subarray(stdinPos, stdinPos + count), offset);
          stdinPos += count;
          if (stdinPos === first.length) {
            stdin.shift();
            stdinPos = 0;
          }
          callback(null, count);
        };
        let go = new globalThis.Go();
        go.argv = ["", \`--service=\${"0.27.2"}\`];
        tryToInstantiateModule(wasm, go).then(
          (instance) => {
            postMessage(null);
            go.run(instance);
          },
          (error) => {
            postMessage(error);
          }
        );
        return go;
      };
      function tryToInstantiateModule(wasm, go) {
        return __async(this, null, function* () {
          if (wasm instanceof WebAssembly.Module) {
            return WebAssembly.instantiate(wasm, go.importObject);
          }
          const res = yield fetch(wasm);
          if (!res.ok) throw new Error(\`Failed to download \${JSON.stringify(wasm)}\`);
          if ("instantiateStreaming" in WebAssembly && /^application\\/wasm($|;)/i.test(res.headers.get("Content-Type") || "")) {
            const result2 = yield WebAssembly.instantiateStreaming(res, go.importObject);
            return result2.instance;
          }
          const bytes = yield res.arrayBuffer();
          const result = yield WebAssembly.instantiate(bytes, go.importObject);
          return result.instance;
        });
      }
      return (m) => onmessage(m);
    })(postMessage)`],{type:"text/javascript"});a=new Worker(URL.createObjectURL(D))}else{let D=(R=>{var N=(T,$,y)=>new Promise((c,s)=>{var o=k=>{try{_(y.next(k))}catch(u){s(u)}},d=k=>{try{_(y.throw(k))}catch(u){s(u)}},_=k=>k.done?c(k.value):Promise.resolve(k.value).then(o,d);_((y=y.apply(T,$)).next())});let W,j={};for(let T=self;T;T=Object.getPrototypeOf(T))for(let $ of Object.getOwnPropertyNames(T))$ in j||Object.defineProperty(j,$,{get:()=>self[$]});(()=>{const T=()=>{const c=new Error("not implemented");return c.code="ENOSYS",c};if(!j.fs){let c="";j.fs={constants:{O_WRONLY:-1,O_RDWR:-1,O_CREAT:-1,O_TRUNC:-1,O_APPEND:-1,O_EXCL:-1,O_DIRECTORY:-1},writeSync(s,o){c+=y.decode(o);const d=c.lastIndexOf(`
`);return d!=-1&&(console.log(c.substring(0,d)),c=c.substring(d+1)),o.length},write(s,o,d,_,k,u){if(d!==0||_!==o.length||k!==null){u(T());return}const m=this.writeSync(s,o);u(null,m)},chmod(s,o,d){d(T())},chown(s,o,d,_){_(T())},close(s,o){o(T())},fchmod(s,o,d){d(T())},fchown(s,o,d,_){_(T())},fstat(s,o){o(T())},fsync(s,o){o(null)},ftruncate(s,o,d){d(T())},lchown(s,o,d,_){_(T())},link(s,o,d){d(T())},lstat(s,o){o(T())},mkdir(s,o,d){d(T())},open(s,o,d,_){_(T())},read(s,o,d,_,k,u){u(T())},readdir(s,o){o(T())},readlink(s,o){o(T())},rename(s,o,d){d(T())},rmdir(s,o){o(T())},stat(s,o){o(T())},symlink(s,o,d){d(T())},truncate(s,o,d){d(T())},unlink(s,o){o(T())},utimes(s,o,d,_){_(T())}}}if(j.process||(j.process={getuid(){return-1},getgid(){return-1},geteuid(){return-1},getegid(){return-1},getgroups(){throw T()},pid:-1,ppid:-1,umask(){throw T()},cwd(){throw T()},chdir(){throw T()}}),j.path||(j.path={resolve(...c){return c.join("/")}}),!j.crypto)throw new Error("globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)");if(!j.performance)throw new Error("globalThis.performance is not available, polyfill required (performance.now only)");if(!j.TextEncoder)throw new Error("globalThis.TextEncoder is not available, polyfill required");if(!j.TextDecoder)throw new Error("globalThis.TextDecoder is not available, polyfill required");const $=new TextEncoder("utf-8"),y=new TextDecoder("utf-8");j.Go=class{constructor(){this.argv=["js"],this.env={},this.exit=n=>{n!==0&&console.warn("exit code:",n)},this._exitPromise=new Promise(n=>{this._resolveExitPromise=n}),this._pendingEvent=null,this._scheduledTimeouts=new Map,this._nextCallbackTimeoutID=1;const c=(n,l)=>{this.mem.setUint32(n+0,l,!0),this.mem.setUint32(n+4,Math.floor(l/4294967296),!0)},s=n=>{const l=this.mem.getUint32(n+0,!0),v=this.mem.getInt32(n+4,!0);return l+v*4294967296},o=n=>{const l=this.mem.getFloat64(n,!0);if(l===0)return;if(!isNaN(l))return l;const v=this.mem.getUint32(n,!0);return this._values[v]},d=(n,l)=>{if(typeof l=="number"&&l!==0){if(isNaN(l)){this.mem.setUint32(n+4,2146959360,!0),this.mem.setUint32(n,0,!0);return}this.mem.setFloat64(n,l,!0);return}if(l===void 0){this.mem.setFloat64(n,0,!0);return}let b=this._ids.get(l);b===void 0&&(b=this._idPool.pop(),b===void 0&&(b=this._values.length),this._values[b]=l,this._goRefCounts[b]=0,this._ids.set(l,b)),this._goRefCounts[b]++;let A=0;switch(typeof l){case"object":l!==null&&(A=1);break;case"string":A=2;break;case"symbol":A=3;break;case"function":A=4;break}this.mem.setUint32(n+4,2146959360|A,!0),this.mem.setUint32(n,b,!0)},_=n=>{const l=s(n+0),v=s(n+8);return new Uint8Array(this._inst.exports.mem.buffer,l,v)},k=n=>{const l=s(n+0),v=s(n+8),b=new Array(v);for(let A=0;A<v;A++)b[A]=o(l+A*8);return b},u=n=>{const l=s(n+0),v=s(n+8);return y.decode(new DataView(this._inst.exports.mem.buffer,l,v))},m=(n,l)=>(this._inst.exports.testExport0(),this._inst.exports.testExport(n,l)),x=Date.now()-performance.now();this.importObject={_gotest:{add:(n,l)=>n+l,callExport:m},gojs:{"runtime.wasmExit":n=>{n>>>=0;const l=this.mem.getInt32(n+8,!0);this.exited=!0,delete this._inst,delete this._values,delete this._goRefCounts,delete this._ids,delete this._idPool,this.exit(l)},"runtime.wasmWrite":n=>{n>>>=0;const l=s(n+8),v=s(n+16),b=this.mem.getInt32(n+24,!0);j.fs.writeSync(l,new Uint8Array(this._inst.exports.mem.buffer,v,b))},"runtime.resetMemoryDataView":n=>{this.mem=new DataView(this._inst.exports.mem.buffer)},"runtime.nanotime1":n=>{n>>>=0,c(n+8,(x+performance.now())*1e6)},"runtime.walltime":n=>{n>>>=0;const l=new Date().getTime();c(n+8,l/1e3),this.mem.setInt32(n+16,l%1e3*1e6,!0)},"runtime.scheduleTimeoutEvent":n=>{n>>>=0;const l=this._nextCallbackTimeoutID;this._nextCallbackTimeoutID++,this._scheduledTimeouts.set(l,setTimeout(()=>{for(this._resume();this._scheduledTimeouts.has(l);)console.warn("scheduleTimeoutEvent: missed timeout event"),this._resume()},s(n+8))),this.mem.setInt32(n+16,l,!0)},"runtime.clearTimeoutEvent":n=>{n>>>=0;const l=this.mem.getInt32(n+8,!0);clearTimeout(this._scheduledTimeouts.get(l)),this._scheduledTimeouts.delete(l)},"runtime.getRandomData":n=>{n>>>=0,crypto.getRandomValues(_(n+8))},"syscall/js.finalizeRef":n=>{n>>>=0;const l=this.mem.getUint32(n+8,!0);if(this._goRefCounts[l]--,this._goRefCounts[l]===0){const v=this._values[l];this._values[l]=null,this._ids.delete(v),this._idPool.push(l)}},"syscall/js.stringVal":n=>{n>>>=0,d(n+24,u(n+8))},"syscall/js.valueGet":n=>{n>>>=0;const l=Reflect.get(o(n+8),u(n+16));n=this._inst.exports.getsp()>>>0,d(n+32,l)},"syscall/js.valueSet":n=>{n>>>=0,Reflect.set(o(n+8),u(n+16),o(n+32))},"syscall/js.valueDelete":n=>{n>>>=0,Reflect.deleteProperty(o(n+8),u(n+16))},"syscall/js.valueIndex":n=>{n>>>=0,d(n+24,Reflect.get(o(n+8),s(n+16)))},"syscall/js.valueSetIndex":n=>{n>>>=0,Reflect.set(o(n+8),s(n+16),o(n+24))},"syscall/js.valueCall":n=>{n>>>=0;try{const l=o(n+8),v=Reflect.get(l,u(n+16)),b=k(n+32),A=Reflect.apply(v,l,b);n=this._inst.exports.getsp()>>>0,d(n+56,A),this.mem.setUint8(n+64,1)}catch(l){n=this._inst.exports.getsp()>>>0,d(n+56,l),this.mem.setUint8(n+64,0)}},"syscall/js.valueInvoke":n=>{n>>>=0;try{const l=o(n+8),v=k(n+16),b=Reflect.apply(l,void 0,v);n=this._inst.exports.getsp()>>>0,d(n+40,b),this.mem.setUint8(n+48,1)}catch(l){n=this._inst.exports.getsp()>>>0,d(n+40,l),this.mem.setUint8(n+48,0)}},"syscall/js.valueNew":n=>{n>>>=0;try{const l=o(n+8),v=k(n+16),b=Reflect.construct(l,v);n=this._inst.exports.getsp()>>>0,d(n+40,b),this.mem.setUint8(n+48,1)}catch(l){n=this._inst.exports.getsp()>>>0,d(n+40,l),this.mem.setUint8(n+48,0)}},"syscall/js.valueLength":n=>{n>>>=0,c(n+16,parseInt(o(n+8).length))},"syscall/js.valuePrepareString":n=>{n>>>=0;const l=$.encode(String(o(n+8)));d(n+16,l),c(n+24,l.length)},"syscall/js.valueLoadString":n=>{n>>>=0;const l=o(n+8);_(n+16).set(l)},"syscall/js.valueInstanceOf":n=>{n>>>=0,this.mem.setUint8(n+24,o(n+8)instanceof o(n+16)?1:0)},"syscall/js.copyBytesToGo":n=>{n>>>=0;const l=_(n+8),v=o(n+32);if(!(v instanceof Uint8Array||v instanceof Uint8ClampedArray)){this.mem.setUint8(n+48,0);return}const b=v.subarray(0,l.length);l.set(b),c(n+40,b.length),this.mem.setUint8(n+48,1)},"syscall/js.copyBytesToJS":n=>{n>>>=0;const l=o(n+8),v=_(n+16);if(!(l instanceof Uint8Array||l instanceof Uint8ClampedArray)){this.mem.setUint8(n+48,0);return}const b=v.subarray(0,l.length);l.set(b),c(n+40,b.length),this.mem.setUint8(n+48,1)},debug:n=>{console.log(n)}}}}run(c){return N(this,null,function*(){if(!(c instanceof WebAssembly.Instance))throw new Error("Go.run: WebAssembly.Instance expected");this._inst=c,this.mem=new DataView(this._inst.exports.mem.buffer),this._values=[NaN,0,null,!0,!1,j,this],this._goRefCounts=new Array(this._values.length).fill(1/0),this._ids=new Map([[0,1],[null,2],[!0,3],[!1,4],[j,5],[this,6]]),this._idPool=[],this.exited=!1;let s=4096;const o=x=>{const n=s,l=$.encode(x+"\0");return new Uint8Array(this.mem.buffer,s,l.length).set(l),s+=l.length,s%8!==0&&(s+=8-s%8),n},d=this.argv.length,_=[];this.argv.forEach(x=>{_.push(o(x))}),_.push(0),Object.keys(this.env).sort().forEach(x=>{_.push(o(`${x}=${this.env[x]}`))}),_.push(0);const u=s;if(_.forEach(x=>{this.mem.setUint32(s,x,!0),this.mem.setUint32(s+4,0,!0),s+=8}),s>=12288)throw new Error("total length of command line and environment variables exceeds limit");this._inst.exports.run(d,u),this.exited&&this._resolveExitPromise(),yield this._exitPromise})}_resume(){if(this.exited)throw new Error("Go program has already exited");this._inst.exports.resume(),this.exited&&this._resolveExitPromise()}_makeFuncWrapper(c){const s=this;return function(){const o={id:c,this:this,args:arguments};return s._pendingEvent=o,s._resume(),o.result}}}})(),W=({data:T})=>{let $=new TextDecoder,y=j.fs,c="";y.writeSync=(k,u)=>{if(k===1)R(u);else if(k===2){c+=$.decode(u);let m=c.split(`
`);m.length>1&&console.log(m.slice(0,-1).join(`
`)),c=m[m.length-1]}else throw new Error("Bad write");return u.length};let s=[],o,d=0;W=({data:k})=>(k.length>0&&(s.push(k),o&&o()),_),y.read=(k,u,m,x,n,l)=>{if(k!==0||m!==0||x!==u.length||n!==null)throw new Error("Bad read");if(s.length===0){o=()=>y.read(k,u,m,x,n,l);return}let v=s[0],b=Math.max(0,Math.min(x,v.length-d));u.set(v.subarray(d,d+b),m),d+=b,d===v.length&&(s.shift(),d=0),l(null,b)};let _=new j.Go;return _.argv=["","--service=0.27.2"],Q(T,_).then(k=>{R(null),_.run(k)},k=>{R(k)}),_};function Q(T,$){return N(this,null,function*(){if(T instanceof WebAssembly.Module)return WebAssembly.instantiate(T,$.importObject);const y=yield fetch(T);if(!y.ok)throw new Error(`Failed to download ${JSON.stringify(T)}`);if("instantiateStreaming"in WebAssembly&&/^application\/wasm($|;)/i.test(y.headers.get("Content-Type")||""))return(yield WebAssembly.instantiateStreaming(y,$.importObject)).instance;const c=yield y.arrayBuffer();return(yield WebAssembly.instantiate(c,$.importObject)).instance})}return T=>W(T)})(R=>a.onmessage({data:R})),V;a={onmessage:null,postMessage:R=>setTimeout(()=>{try{V=D({data:R})}catch(N){g(N)}}),terminate(){if(V)for(let R of V._scheduledTimeouts.values())clearTimeout(R)}}}let h,S;const f=new Promise((D,V)=>{h=D,S=V});a.onmessage=({data:D})=>{a.onmessage=({data:V})=>I(V),D?S(D):h()},a.postMessage(t||new URL(e,location.href).toString());let{readFromStdout:I,service:U}=$t({writeToStdin(D){a.postMessage(D)},isSync:!1,hasFS:!1,esbuild:se});yield f,Je=()=>{a.terminate(),ke=void 0,Je=void 0,Ye=void 0},Ye={build:D=>new Promise((V,R)=>{w.then(R),U.buildOrContext({callName:"build",refs:null,options:D,isTTY:!1,defaultWD:"/",callback:(N,W)=>N?R(N):V(W)})}),context:D=>new Promise((V,R)=>{w.then(R),U.buildOrContext({callName:"context",refs:null,options:D,isTTY:!1,defaultWD:"/",callback:(N,W)=>N?R(N):V(W)})}),transform:(D,V)=>new Promise((R,N)=>{w.then(N),U.transform({callName:"transform",refs:null,input:D,options:V||{},isTTY:!1,fs:{readFile(W,j){j(new Error("Internal error"),null)},writeFile(W,j){j(null)}},callback:(W,j)=>W?N(W):R(j)})}),formatMessages:(D,V)=>new Promise((R,N)=>{w.then(N),U.formatMessages({callName:"formatMessages",refs:null,messages:D,options:V,callback:(W,j)=>W?N(W):R(j)})}),analyzeMetafile:(D,V)=>new Promise((R,N)=>{w.then(N),U.analyzeMetafile({callName:"analyzeMetafile",refs:null,metafile:typeof D=="string"?D:JSON.stringify(D),options:V,callback:(W,j)=>W?N(W):R(j)})})}}),zt=se})(p)})(Xe)),Xe.exports}var Pe=Xt();const Qt=Jt(Pe),dt=Ht({__proto__:null,default:Qt},[Pe]),Zt="tabcomputer-wasm-cache",Oe="wasm-binaries",ht=`esbuild-${Pe.version}`;async function en(){return(await Yt(async()=>{const{default:p}=await import("./esbuild-DS0OdHEu.js");return{default:p}},[],import.meta.url)).default}let Ce=!1,me=null;function mt(){return new Promise((p,q)=>{const P=indexedDB.open(Zt,1);P.onerror=()=>q(P.error),P.onsuccess=()=>p(P.result),P.onupgradeneeded=()=>{const L=P.result;L.objectStoreNames.contains(Oe)||L.createObjectStore(Oe)}})}async function tn(){try{const p=await mt();return new Promise(q=>{const P=p.transaction(Oe,"readonly"),z=P.objectStore(Oe).get(ht);z.onsuccess=()=>q(z.result||null),z.onerror=()=>q(null),P.oncomplete=()=>p.close()})}catch{return null}}async function nn(p){try{const q=await mt();return new Promise((P,L)=>{const z=q.transaction(Oe,"readwrite"),re=z.objectStore(Oe).put(p,ht);re.onsuccess=()=>P(),re.onerror=()=>L(re.error),z.oncomplete=()=>q.close()})}catch{}}function ct(){return typeof Worker=="function"&&typeof window<"u"}async function pt(){if(!Ce){if(me){await me;return}me=(async()=>{try{let p=await tn();if(p)await Pe.initialize({wasmModule:await WebAssembly.compile(p),worker:ct()});else{const q=await en(),P=await fetch(q);if(!P.ok)throw new Error(`${q}: HTTP ${P.status}`);p=await P.arrayBuffer(),await Pe.initialize({wasmModule:await WebAssembly.compile(p),worker:ct()}),nn(p)}Ce=!0}catch(p){throw me=null,new Error(`Failed to initialize esbuild: ${p.message}`)}})(),await me}}let He=6e4,Ae=0,We;async function Qe(p){Ae++,clearTimeout(We);try{return await pt(),await p(dt)}finally{--Ae===0&&(We=setTimeout(gt,He))}}async function gt(){if(!(Ae||!me)){clearTimeout(We);try{await me}catch{return}Ae||(Pe.stop(),Ce=!1,me=null)}}function rn(){return Ce}function sn(p){He=p}function yt(p){return{name:"shiro-virtual-fs",setup(q){q.onResolve({filter:/.*/},async P=>{if(!P.path.startsWith(".")&&!P.path.startsWith("/")){const J=[`/node_modules/${P.path}/package.json`,`/node_modules/${P.path}/index.js`,`/node_modules/${P.path}/index.ts`,`/node_modules/${P.path}.js`,`/node_modules/${P.path}.ts`,`${p.cwd}/node_modules/${P.path}/package.json`,`${p.cwd}/node_modules/${P.path}/index.js`,`${p.cwd}/node_modules/${P.path}/index.ts`,`${p.cwd}/node_modules/${P.path}.js`,`${p.cwd}/node_modules/${P.path}.ts`];for(const re of J)try{if(re.endsWith("package.json")){const te=await p.fs.readFile(re,"utf8"),ne=JSON.parse(te).main||"index.js",se=re.replace("/package.json","");return{path:p.fs.resolvePath(ne,se),namespace:"shiro-fs"}}else return await p.fs.readFile(re,"utf8"),{path:re,namespace:"shiro-fs"}}catch{continue}return{path:P.path,external:!0}}let L;if(P.path.startsWith("/"))L=P.path;else{const J=P.importer?P.importer.split("/").slice(0,-1).join("/")||"/":p.cwd;L=p.fs.resolvePath(P.path,J)}const z=["",".ts",".tsx",".js",".jsx",".json"];for(const J of z){const re=L+J;try{return await p.fs.readFile(re,"utf8"),{path:re,namespace:"shiro-fs"}}catch{continue}}return{path:L,namespace:"shiro-fs"}}),q.onLoad({filter:/.*/,namespace:"shiro-fs"},async P=>{try{const L=await p.fs.readFile(P.path,"utf8");let z="js";return P.path.endsWith(".ts")?z="ts":P.path.endsWith(".tsx")?z="tsx":P.path.endsWith(".jsx")?z="jsx":P.path.endsWith(".json")?z="json":P.path.endsWith(".css")&&(z="css"),{contents:L,loader:z}}catch(L){return{errors:[{text:`Failed to load ${P.path}: ${L.message}`,location:null}]}}})}}}async function ft(p,q,P,L,z){const J=await Qe(te=>te.build({entryPoints:[q],bundle:L.bundle,minify:L.minify,sourcemap:L.sourcemap,format:L.format,target:L.target,write:!1,metafile:!0,plugins:[yt(p)],logLevel:"silent"}));if(J.errors.length>0){for(const te of J.errors)z(`Error: ${te.text}
`),te.location&&z(`  at ${te.location.file}:${te.location.line}:${te.location.column}
`);return{ok:!1,inputs:[]}}for(const te of J.warnings)z(`Warning: ${te.text}
`);if(J.outputFiles&&J.outputFiles.length>0){const te=J.outputFiles[0],ae=p.fs.resolvePath(P,p.cwd),ne=ae.split("/").slice(0,-1).join("/");if(ne)try{await p.fs.mkdir(ne)}catch{}await p.fs.writeFile(ae,te.contents);const se=(te.contents.length/1024).toFixed(2);if(z(`✓ Built: ${ae} (${se} KB)
`),L.sourcemap&&J.outputFiles.length>1){const ve=J.outputFiles[1];await p.fs.writeFile(ae+".map",ve.contents)}}return{ok:!0,inputs:J.metafile?Object.keys(J.metafile.inputs):[q]}}const ln={name:"build",description:"Bundle TypeScript/JavaScript using esbuild-wasm",async exec(p){if(p.args.length===0||p.args[0]==="--help"||p.args[0]==="-h")return p.stdout+=`Usage: build <entry-point> [options]

`,p.stdout+=`Options:
`,p.stdout+=`  --outfile=FILE    Output file path
`,p.stdout+=`  --bundle          Bundle all dependencies
`,p.stdout+=`  --minify          Minify the output
`,p.stdout+=`  --sourcemap       Generate source maps
`,p.stdout+=`  --format=FORMAT   Output format (iife, cjs, esm)
`,p.stdout+=`  --target=TARGET   Target environment (es2015, es2020, etc.)
`,p.stdout+=`  --watch           Rebuild on file changes and auto-reload served iframes
`,p.stdout+=`
Example:
`,p.stdout+=`  build src/index.ts --outfile=dist/bundle.js --bundle --minify
`,p.stdout+=`  build app.tsx --bundle --watch --outfile=bundle.js &
`,0;try{p.stdout+=`Initializing esbuild...
`,await Qe(async()=>{});const q=p.args[0],P={bundle:!1,minify:!1,sourcemap:!1,format:"esm",target:"es2020"};let L="out.js",z=!1;for(let G=1;G<p.args.length;G++){const H=p.args[G];H.startsWith("--outfile=")?L=H.slice(10):H==="--bundle"?P.bundle=!0:H==="--minify"?P.minify=!0:H==="--sourcemap"?P.sourcemap=!0:H.startsWith("--format=")?P.format=H.slice(9):H.startsWith("--target=")?P.target=H.slice(9):H==="--watch"&&(z=!0)}const J=p.fs.resolvePath(q,p.cwd),re=G=>{p.stdout+=G};re(`Building ${J}...
`);const te=await ft(p,J,L,P,re);if(!te.ok&&!z)return 1;if(!z)return te.ok?0:1;const ae=p.terminal,ne=G=>{ae?ae.writeOutput(G.replace(/\n/g,`\r
`)):p.stdout+=G},se=new Map;for(const G of te.inputs)try{const H=await p.fs.stat(G);H&&se.set(G,H.mtimeMs??H.mtime.getTime())}catch{}ne(`[watching ${se.size} files, Ctrl+C to stop]
`);const ve=typeof window<"u"&&window.__tabcomputer?.iframeServer;let De=!1;const Re=setInterval(async()=>{if(De)return;let G=!1;for(const[de,Y]of se)try{const Se=await p.fs.stat(de);if(!Se)continue;const Ue=Se.mtimeMs??Se.mtime.getTime();Ue>Y&&(G=!0,se.set(de,Ue))}catch{}if(!G)return;const H=performance.now(),Ee=await ft(p,J,L,P,ne),Ie=Math.round(performance.now()-H);if(Ee.ok){ne(`[rebuilt in ${Ie}ms]
`);for(const de of Ee.inputs)if(!se.has(de))try{const Y=await p.fs.stat(de);Y&&se.set(de,Y.mtimeMs??Y.mtime.getTime())}catch{}ve?.broadcastReload&&ve.broadcastReload()}else ne(`[build failed after ${Ie}ms]
`)},500);return await new Promise(G=>{ae?ae.enterStdinPassthrough(H=>{H===""&&(De=!0,clearInterval(Re),ae.exitStdinPassthrough(),ne(`[watch stopped]
`),G())}):globalThis.__buildWatchCleanup=()=>{De=!0,clearInterval(Re),G()}}),0}catch(q){return p.stderr+=`build: ${q.message}
`,q.stack&&(p.stderr+=q.stack+`
`),1}}};(globalThis.__tabcomputerLive??=new Map).set("src/commands/build.ts",Kt);globalThis.__tabcomputerLive.set("npm:esbuild-wasm",dt);(globalThis.__tabcomputerLiveState??=new Map).set("src/commands/build.ts",{get esbuildInitialized(){return Ce},set esbuildInitialized(p){Ce=p},get initPromise(){return me},set initPromise(p){me=p},get idleMs(){return He},set idleMs(p){He=p},get inUse(){return Ae},set inUse(p){Ae=p},get idleTimer(){return We},set idleTimer(p){We=p}});export{ln as buildCmd,yt as createVirtualFSPlugin,pt as ensureEsbuildInitialized,rn as esbuildRunning,sn as setEsbuildIdleMs,gt as stopEsbuild,Qe as withEsbuild};
