function oe(i){const e=typeof SharedArrayBuffer<"u"&&i.buffer instanceof SharedArrayBuffer;return _e.decode(e?i.slice():i)}const _e=new TextDecoder,U=0,pe=65536,w=-100,fe=256,he=512,me=(1<<30)-1,ge=2,$=12,Se=1073741824,V=32;function O(i){let e=0,t=0;for(const s of i)s>=1&&s<=32?e|=1<<s-1:s>32&&s<=64&&(t|=1<<s-33);return[e>>>0,t>>>0]}function A(i,e){const t=new Set;for(let s=0;s<32;s++)i>>>s&1&&t.add(s+1),e>>>s&1&&t.add(s+33);return t}const T=28,be=21505,ye=144;function x(i,e){return i.getUint32(e,!0)+i.getUint32(e+4,!0)*4294967296}function M(i){const e=new DataView(i.buffer,i.byteOffset,ye),t=n=>x(e,n)*1e3+Math.floor(x(e,n+8)/1e6),s=n=>x(e,n+8)%1e6;return{dev:x(e,0),ino:x(e,8),nlink:x(e,16),mode:e.getUint32(24,!0),uid:e.getUint32(28,!0),gid:e.getUint32(32,!0),rdev:x(e,40),size:x(e,48),blksize:x(e,56),blocks:x(e,64),atimeMs:t(72),mtimeMs:t(88),ctimeMs:t(104),...s(72)?{atimeNs:s(72)}:{},...s(88)?{mtimeNs:s(88)}:{}}}const y=0,we=1,ke=2,xe=3,Y=4,z=12,b=64,P=0,C=1,W=2,E=3,K=4,ve="sys";class q{constructor(e,t){this.sab=e,this.notify=t,this.i32=new Int32Array(e,0,b/4),this.data=new Uint8Array(e,b)}i32;data;onSignal;static spinMs=.1;call(e,...t){const s=this.i32;if(t.length>z)throw new Error(`syscall ${e}: too many args`);s[we]=e;for(let l=0;l<z;l++)s[Y+l]=t[l]??0;if(Atomics.compareExchange(s,y,P,E)!==P)throw new I;Atomics.notify(s,y),this.notify?.(),this.awaitReply();const n=s[ke],r=s[Y];if(Atomics.compareExchange(s,y,W,P)!==W)throw new I;const o=Atomics.exchange(s,xe,0);if(o)try{this.onSignal?.(o)}finally{this.call(15),s[Y]=r}return n}awaitReply(){const e=this.i32;if(Atomics.load(e,y)===E){const t=H()+q.spinMs;let s=0;for(;Atomics.load(e,y)===E&&!((++s&63)===0&&H()>t););}if(Atomics.compareExchange(e,y,E,C)===E)for(;Atomics.load(e,y)===C;)Atomics.wait(e,y,C);if(Atomics.load(e,y)===K)throw new I}park(){const e=this.i32;for(;;){const t=Atomics.load(e,y);if(t===K)throw new I;Atomics.wait(e,y,t)}}result64(e){return e<0&&e>-4096?e:(this.i32[Y]|0)*4294967296+(e>>>0)}}class I extends Error{constructor(){super("syscall channel closed"),this.name="ChannelClosed"}}const D=new TextEncoder,F=oe;class Ee extends Error{constructor(e,t){super(`${t}: errno ${e}`),this.errno=e}}class Ne{constructor(e){this.ch=e}putStr(e,t=0){const s=D.encode(e);return t+s.length>this.ch.data.length?-36:(this.ch.data.set(s,t),s.length)}read(e,t){const s=Math.min(t.length,this.ch.data.length),n=this.ch.call(0,e,s);return n>0&&t.set(this.ch.data.subarray(0,n)),n}write(e,t){const s=typeof t=="string"?D.encode(t):t;let n=0;for(;n<s.length;){const r=Math.min(s.length-n,this.ch.data.length);this.ch.data.set(s.subarray(n,n+r));const o=this.ch.call(1,e,r);if(o<0)return n>0?n:o;if(o===0)break;n+=o}return n}readAll(e){const t=[];let s=0;const n=new Uint8Array(Math.min(65536,this.ch.data.length));for(;;){const l=this.read(e,n);if(l<0)return l;if(l===0)break;t.push(n.slice(0,l)),s+=l}const r=new Uint8Array(s);let o=0;for(const l of t)r.set(l,o),o+=l.length;return r}open(e,t=U,s=438){const n=this.putStr(e);return n<0?n:this.ch.call(257,w,n,t,s)}close(e){return this.ch.call(3,e)}pipe(e=0){const t=this.ch.call(293,e);if(t<0)return t;const s=new DataView(this.ch.sab,b,8);return[s.getInt32(0,!0),s.getInt32(4,!0)]}dup(e){return this.ch.call(32,e)}dup2(e,t){return this.ch.call(33,e,t)}fcntl(e,t,s=0){return this.ch.call(72,e,t,s)}lseek(e,t,s){const n=this.ch.call(8,e,t>>>0,Math.floor(t/4294967296),s);return this.ch.result64(n)}fstat(e){const t=this.ch.call(5,e);return t<0?t:M(this.ch.data)}stat(e){const t=this.putStr(e);if(t<0)return t;const s=this.ch.call(4,t);return s<0?s:M(this.ch.data)}getpid(){return this.ch.call(39)}getppid(){return this.ch.call(110)}getpgrp(){return this.ch.call(111)}setpgid(e,t){return this.ch.call(109,e,t)}setsid(){return this.ch.call(112)}kill(e,t){return this.ch.call(62,e,t)}getcwd(){const e=this.ch.call(79,this.ch.data.length);return e<0?e:F(this.ch.data.subarray(0,e-1))}chdir(e){const t=this.putStr(e);return t<0?t:this.ch.call(80,t)}spawn(e,t=[e],s={}){const n=this.putStr(JSON.stringify({path:e,argv:t,...s}));return n<0?-7:this.ch.call(1e3,n)}waitpid(e,t=0){const s=this.ch.call(61,e,t),n=s>0?new DataView(this.ch.sab,b,4).getInt32(0,!0):0;return{pid:s,status:n}}sleep(e){return this.ch.call(35,Math.floor(e/1e3),e%1e3*1e6)}poll(e,t){const s=new DataView(this.ch.sab,b,Math.max(8,e.length*8));return e.forEach((r,o)=>{s.setInt32(o*8,r.fd,!0),s.setInt16(o*8+4,r.events,!0),s.setInt16(o*8+6,0,!0)}),{ready:this.ch.call(7,e.length,t),revents:e.map((r,o)=>s.getInt16(o*8+6,!0))}}putTwo(e,t){const s=this.putStr(e);if(s<0)return s;const n=this.putStr(t,s);return n<0?n:[s,n]}openat(e,t,s=U,n=438){const r=this.putStr(t);return r<0?r:this.ch.call(257,e,r,s,n)}fstatat(e,t,s=0){const n=t===""?0:this.putStr(t);if(n<0)return n;const r=this.ch.call(262,e,n,s);return r<0?r:M(this.ch.data)}mkdirat(e,t,s=511){const n=this.putStr(t);return n<0?n:this.ch.call(258,e,n,s)}mkdir(e,t=511){return this.mkdirat(w,e,t)}unlinkat(e,t,s=0){const n=this.putStr(t);return n<0?n:this.ch.call(263,e,n,s)}unlink(e){return this.unlinkat(w,e)}rmdir(e){return this.unlinkat(w,e,he)}renameat(e,t,s,n,r=0){const o=this.putTwo(t,n);return typeof o=="number"?o:this.ch.call(316,e,o[0],s,o[1],r)}rename(e,t){return this.renameat(w,e,w,t)}symlinkat(e,t,s){const n=this.putTwo(e,s);return typeof n=="number"?n:this.ch.call(266,n[0],t,n[1])}symlink(e,t){return this.symlinkat(e,w,t)}linkat(e,t,s,n,r=0){const o=this.putTwo(t,n);return typeof o=="number"?o:this.ch.call(265,e,o[0],s,o[1],r)}readlinkat(e,t){const s=this.putStr(t);if(s<0)return s;const n=this.ch.call(267,e,s,this.ch.data.length);return n<0?n:F(this.ch.data.subarray(0,n))}readlink(e){return this.readlinkat(w,e)}utimensat(e,t,s,n,r=0){const o=t===""?0:this.putStr(t);if(o<0)return o;const l=s!==void 0||n!==void 0;if(l){const a=new DataView(this.ch.sab,b+o,32),c=(d,p)=>{if(p===void 0){a.setUint32(d,0,!0),a.setUint32(d+4,0,!0),a.setUint32(d+8,me,!0),a.setUint32(d+12,0,!0);return}const u=Math.floor(p/1e3);a.setUint32(d,u>>>0,!0),a.setUint32(d+4,Math.floor(u/4294967296),!0),a.setUint32(d+8,Math.round(p%1e3*1e6),!0),a.setUint32(d+12,0,!0)};c(0,s),c(16,n)}return this.ch.call(280,e,o,r,l?1:0)}pread(e,t,s){const n=Math.min(t.length,this.ch.data.length),r=this.ch.call(17,e,n,s>>>0,Math.floor(s/4294967296));return r>0&&t.set(this.ch.data.subarray(0,r)),r}pwrite(e,t,s){let n=0;for(;n<t.length;){const r=Math.min(t.length-n,this.ch.data.length);this.ch.data.set(t.subarray(n,n+r));const o=s+n,l=this.ch.call(18,e,r,o>>>0,Math.floor(o/4294967296));if(l<0)return n>0?n:l;if(l===0)break;n+=l}return n}sigaction(e,t){const s=new DataView(this.ch.sab,b,V*2);if(t){const[o,l]=O(t.mask??[]);s.setUint32(0,t.handler>>>0,!0),s.setUint32(4,Math.floor(t.handler/4294967296),!0),s.setUint32(8,(t.flags??0)>>>0,!0),s.setUint32(12,0,!0),s.setUint32(16,0,!0),s.setUint32(20,0,!0),s.setUint32(24,o,!0),s.setUint32(28,l,!0)}const n=this.ch.call(13,e,t?1:0,1);if(n<0)return n;const r=V;return{handler:s.getUint32(r,!0)+s.getUint32(r+4,!0)*4294967296,flags:s.getUint32(r+8,!0),mask:[...A(s.getUint32(r+24,!0),s.getUint32(r+28,!0))]}}sigprocmask(e,t){const s=new DataView(this.ch.sab,b,16);if(t){const[r,o]=O(t);s.setUint32(0,r,!0),s.setUint32(4,o,!0)}const n=this.ch.call(14,e,t?1:0,1);return n<0?n:[...A(s.getUint32(8,!0),s.getUint32(12,!0))]}sigpending(){this.ch.call(127);const e=new DataView(this.ch.sab,b,8);return[...A(e.getUint32(0,!0),e.getUint32(4,!0))]}sigsuspend(e){const[t,s]=O(e),n=new DataView(this.ch.sab,b,8);return n.setUint32(0,t,!0),n.setUint32(4,s,!0),this.ch.call(130,8)}gettid(){return this.ch.call(186)}tgkill(e,t,s){return this.ch.call(234,e,t,s)}select(e,t=[],s=[],n=[],r=-1){const o=Math.ceil(e/64)*8;if(o*3>this.ch.data.length)return-22;const l=this.ch.data;l.fill(0,0,o*3),[t,s,n].forEach((u,_)=>u.forEach(f=>{l[_*o+(f>>3)]|=1<<(f&7)}));const a=(t.length?1:0)|(s.length?2:0)|(n.length?4:0),c=r<0?-1:Math.floor(r/1e3),d=this.ch.call(23,e,a,c,r<0?0:r%1e3*1e3);if(d<0)return d;const p=u=>{const _=[];for(let f=0;f<e;f++)l[u*o+(f>>3)]>>(f&7)&1&&_.push(f);return _};return{n:d,read:a&1?p(0):[],write:a&2?p(1):[],except:a&4?p(2):[]}}epollCreate(e=0){return this.ch.call(291,e)}epollCtl(e,t,s,n=0,r=s){return this.ch.call(233,e,t,s,n|0,r>>>0,Math.floor(r/4294967296))}epollWait(e,t,s=-1){const n=Math.min(t,Math.floor(this.ch.data.length/$)),r=this.ch.call(232,e,n,s);if(r<0)return r;const o=new DataView(this.ch.sab,b,r*$);return Array.from({length:r},(l,a)=>({events:o.getUint32(a*12,!0),data:o.getUint32(a*12+4,!0)+o.getUint32(a*12+8,!0)*4294967296}))}socket(e,t,s=0){return this.ch.call(41,e,t,s)}socketpair(e,t,s=0){const n=this.ch.call(53,e,t,s);if(n<0)return n;const r=new DataView(this.ch.sab,b,8);return[r.getInt32(0,!0),r.getInt32(4,!0)]}connect(e,t){return this.ch.data.set(t),this.ch.call(42,e,t.length)}bind(e,t){return this.ch.data.set(t),this.ch.call(49,e,t.length)}listen(e,t=128){return this.ch.call(50,e,t)}accept(e,t=0){const s=this.ch.call(288,e,t);return s<0?s:{fd:s,addr:this.ch.data.slice(0,T)}}sendto(e,t,s=0,n){const r=typeof t=="string"?D.encode(t):t,o=this.ch.data.length-T;if(n)return r.length>o?-90:(this.ch.data.set(r),this.ch.data.set(n,r.length),this.ch.call(44,e,r.length,s,n.length));let l=0;for(;l<r.length;){const a=Math.min(r.length-l,o);this.ch.data.set(r.subarray(l,l+a));const c=this.ch.call(44,e,a,s,0);if(c<0)return l>0?l:c;if(c===0)break;l+=c}return l}send(e,t,s=0){return this.sendto(e,t,s)}recvfrom(e,t,s=0){const n=Math.min(t.length,this.ch.data.length-T),r=this.ch.call(45,e,n,s);return r<0?r:(t.set(this.ch.data.subarray(0,r)),{n:r,addr:this.ch.data.slice(n,n+T)})}recv(e,t,s=0){const n=this.recvfrom(e,t,s);return typeof n=="number"?n:n.n}shutdown(e,t){return this.ch.call(48,e,t)}setsockopt(e,t,s,n){return this.ch.call(54,e,t,s,n)}getsockopt(e,t,s){return this.ch.call(55,e,t,s)}sockname(e,t){const s=this.ch.call(e,t);return s<0?s:this.ch.data.slice(0,s)}getsockname(e){return this.sockname(51,e)}getpeername(e){return this.sockname(52,e)}procInfo(){const e=this.ch.call(1001);if(e<0)throw new Ee(e,"getenv");return JSON.parse(F(this.ch.data.subarray(0,e)))}exitThread(e){return this.ch.call(60,e),this.ch.park()}exit(e){return this.ch.call(231,e),this.ch.park()}}function Ie(i){return!!i&&i.type==="shiro-start"&&i.sab instanceof SharedArrayBuffer}function R(i,e){return new Ne(new q(i.sab,i.wake==="atomics"?null:()=>e(ve)))}const H=typeof performance<"u"?()=>performance.now():()=>Date.now();Promise.resolve();new TextDecoder("utf-8",{fatal:!0,ignoreBOM:!0});new TextEncoder;class Te{cbs=new Set;add(e){return this.cbs.add(e),()=>this.cbs.delete(e)}fire(e=0){if(this.cbs.size)for(const t of[...this.cbs])try{t(e)}catch{}}}function Ye(i,e){return new Promise(t=>{if(e?.aborted){t(!1);return}const s=()=>{r(),t(!0)},n=()=>{r(),t(!1)},r=()=>{i.delete(s),e?.removeEventListener("abort",n)};i.add(s),e?.addEventListener("abort",n,{once:!0})})}class Oe{processes=new Map;nextPid=100;sources=[];allocatePid(){for(;this.taken.has(this.nextPid);)this.nextPid++;return this.nextPid++}taken=new Set;takePid(e){return!Number.isInteger(e)||e<100||e>=4e6||this.processes.has(e)?!1:(e>=this.nextPid&&this.taken.add(e),!0)}attachSource(e){return this.sources.push(e),()=>{this.sources=this.sources.filter(t=>t!==e)}}allocate(e){const t=this.allocatePid(),s={pid:t,command:e,status:"running",exitCode:0,startTime:Date.now(),windowTerminal:null,serverWindow:null,promise:Promise.resolve(0),kill:()=>{},abortController:null};return this.processes.set(t,s),s}kill(e,t,s){const n=this.processes.get(e);return n?n.status!=="running"?!1:(n.abortController&&n.abortController.abort(),n.kill(),n.status="killed",n.exitCode=130,!0):this.sources.some(r=>r.kill(e,t,s))}list(){const e=Array.from(this.processes.values());for(const t of this.sources)e.push(...t.list());return e.sort((t,s)=>t.pid-s.pid)}get(e){const t=this.processes.get(e);if(t)return t;for(const s of this.sources){const n=s.get(e);if(n)return n}}remove(e){this.processes.delete(e)}markExited(e,t){const s=this.processes.get(e);s&&s.status==="running"&&(s.status="exited",s.exitCode=t,setTimeout(()=>this.processes.delete(e),3e4))}}const Ae=typeof window<"u"&&window.__processTable?.allocate?window.__processTable:new Oe;typeof window<"u"&&(window.__processTable=Ae);const Me=9,le=19,Pe=20,Ce=21,De=22,Fe=65,N=i=>1n<<BigInt(i-1),ce={empty:0n,of:(...i)=>i.reduce((e,t)=>e|N(t),0n),has:(i,e)=>(i&N(e))!==0n,add:(i,e)=>i|N(e),del:(i,e)=>i&~N(e),first(i){for(let e=1;e<Fe;e++)if(i&N(e))return e;return 0}};ce.of(Me,le);ce.of(le,Pe,Ce,De);new TextEncoder;const J=Date.now(),je=3,Z=4,Le=0,Ue=0,Re=1,qe=2,Ge=3,X=4,Be=5,$e=6,Ve=7,ze=8,We=9,Ke=10,He=new TextEncoder;function Je(){const i=typeof performance<"u"?performance:void 0;return i&&typeof i.timeOrigin=="number"?Math.max(0,Math.round((i.timeOrigin+i.now()-J)*1e3)):(Date.now()-J)*1e3}function Q(i){const e=Math.floor(i/1e6),t=Math.floor(i%1e6);return`[${String(e).padStart(5)}.${String(t).padStart(6,"0")}]`}class Ze{constructor(e=64*1024,t=1e3){this.maxBytes=e,this.maxRecords=t}records=[];head=0;textBytes=0;nextSeq=0;clearSeq=0;readSeq=0;listeners=new Te;waiters=new Set;rates=new Map;consoleLevel=-1;clock=Je;get firstSeq(){return this.nextSeq-this.size}get lastSeq(){return this.nextSeq}get size(){return this.records.length-this.head}log(e,t,s=Le){e=Math.max(0,Math.min(7,e|0));const n=String(t).replace(/\n+$/,"").split(`
`);let r=-1;for(const o of n)r=this.append({seq:this.nextSeq,usec:this.clock(),facility:s,level:e,text:o});return r}append(e){for(this.nextSeq++,this.records.push(e),this.textBytes+=e.text.length+32;this.size>1&&(this.size>this.maxRecords||this.textBytes>this.maxBytes);){const t=this.records[this.head++];this.textBytes-=t.text.length+32}this.head>512&&this.head*2>this.records.length&&(this.records=this.records.slice(this.head),this.head=0),this.consoleLevel>=0&&e.level<=this.consoleLevel&&(e.level<=je?console.error:e.level<=Z?console.warn:console.log)(`[kernel] ${e.text}`);for(const t of[...this.waiters])t();return this.listeners.fire(),e.seq}logRatelimited(e,t,s={}){const n=s.burst??5,r=(s.intervalMs??5e3)*1e3,o=this.clock();let l=this.rates.get(t);if(!l||o-l.start>=r){const a=l?.suppressed??0;l={start:o,count:0,suppressed:0},this.rates.set(t,l),this.rates.size>256&&this.rates.delete(this.rates.keys().next().value),a&&this.log(Z,`${t.split(":")[0]}: ${a} similar messages suppressed`,s.facility)}return l.count>=n?(l.suppressed++,-1):(l.count++,this.log(e,t,s.facility))}get(e){if(!(e<this.firstSeq||e>=this.nextSeq))return this.records[this.head+(e-this.firstSeq)]}since(e=this.firstSeq){const t=Math.max(e,this.firstSeq);return this.records.slice(this.head+(t-this.firstSeq))}all(){return this.since(this.clearSeq)}clear(){this.clearSeq=this.nextSeq}get clearPoint(){return Math.max(this.clearSeq,this.firstSeq)}text(e=this.all()){return e.map(t=>`${Q(t.usec)} ${t.text}
`).join("")}onRecord(e){return this.listeners.add(e)}waitFor(e,t){return this.nextSeq>e?Promise.resolve(!0):Ye(this.waiters,t)}async syslogAction(e,t,s,n){switch(e){case Ue:case Re:case $e:case Ve:return 0;case ze:return s<1||s>8?-22:(this.consoleLevel=s-1,0);case Be:return this.clear(),0;case Ke:return this.maxBytes;case We:return this.syslogBytes(this.since(Math.max(this.readSeq,this.firstSeq))).length;case qe:{if(s<0)return-22;if(s===0)return 0;for(;Math.max(this.readSeq,this.firstSeq)>=this.nextSeq;)if(!await this.waitFor(this.readSeq,n))return-4;this.readSeq=Math.max(this.readSeq,this.firstSeq);let r=0;for(;this.readSeq<this.nextSeq;){const o=this.syslogBytes([this.get(this.readSeq)]);if(r+o.length>Math.min(s,t.length))break;t.set(o,r),r+=o.length,this.readSeq++}return r}case Ge:case X:{if(s<0)return-22;const r=Math.min(s,t.length),o=this.all(),l=[];let a=0;for(let d=o.length-1;d>=0;d--){const p=this.syslogBytes([o[d]]);if(a+p.length>r)break;l.unshift(p),a+=p.length}let c=0;for(const d of l)t.set(d,c),c+=d.length;return e===X&&this.clear(),c}default:return-22}}syslogBytes(e){return He.encode(e.map(t=>`<${t.facility*8+t.level}>${Q(t.usec)} ${t.text}
`).join(""))}}const ee=globalThis;ee.__tabcomputerKlog??(ee.__tabcomputerKlog=new Ze);const te=36,Xe=new Set([47,1047,1049]);[...Xe];new TextEncoder;const ne=3,j=64,Qe=128,L=61440,se=32768,re=16384,ie=40960,et={1:"EPERM",2:"ENOENT",4:"EINTR",5:"EIO",9:"EBADF",11:"EAGAIN",12:"ENOMEM",13:"EACCES",16:"EBUSY",17:"EEXIST",18:"EXDEV",19:"ENODEV",20:"ENOTDIR",21:"EISDIR",22:"EINVAL",23:"ENFILE",24:"EMFILE",25:"ENOTTY",27:"EFBIG",28:"ENOSPC",29:"ESPIPE",30:"EROFS",31:"EMLINK",32:"EPIPE",36:"ENAMETOOLONG",38:"ENOSYS",39:"ENOTEMPTY",40:"ELOOP",95:"ENOTSUP"};function tt(i,e){return e[et[i]??"EIO"]??e.EIO??29}function nt(i,e,t){const s=a=>{throw new i.ErrnoError(tt(-a,e))},n=a=>(typeof a=="number"&&a<0&&s(a),a),r=a=>{const c=[];for(;a.parent!==a;)c.push(a.name),a=a.parent;const d=a.mount.opts.root;return c.reverse(),c.length?(d==="/"?"":d)+"/"+c.join("/"):d},o=(a,c)=>{const d=r(a);return(d==="/"?"":d)+"/"+c},l={mount(a){const c=n(t.stat(a.opts.root,!0));return l.createNode(null,"/",c.mode,0)},createNode(a,c,d,p){const u=d&L;if(u!==se&&u!==re&&u!==ie)throw new i.ErrnoError(e.EINVAL);const _=i.createNode(a,c,d,p);return _.node_ops=l.node_ops,_.stream_ops=l.stream_ops,_},node_ops:{getattr(a){const c=n(t.stat(r(a),!1));return a.mode=c.mode,{dev:c.dev,ino:c.ino,mode:c.mode,nlink:c.nlink,uid:c.uid,gid:c.gid,rdev:c.rdev,size:c.size,atime:new Date(c.atimeMs),mtime:new Date(c.mtimeMs),ctime:new Date(c.ctimeMs),blksize:c.blksize||4096,blocks:c.blocks||Math.ceil(c.size/512)}},setattr(a,c){const d=r(a);c.mode!==void 0&&(n(t.chmod(d,c.mode&4095)),a.mode=c.mode),c.size!==void 0&&n(t.truncate(d,c.size));const p=c.atime??c.timestamp,u=c.mtime??c.timestamp;if(p!==void 0||u!==void 0){const _=f=>f instanceof Date?f.getTime():Number(f);n(t.utimes(d,_(p??u),_(u??p)))}},lookup(a,c){const d=n(t.stat(o(a,c),!1));return l.createNode(a,c,d.mode,0)},mknod(a,c,d,p){const u=l.createNode(a,c,d,p),_=r(u);try{(d&L)===re?n(t.mkdir(_,d&4095)):n(t.close(n(t.open(_,j|Qe|1,d&4095))))}catch(f){throw i.destroyNode?.(u),f}return u},rename(a,c,d){n(t.rename(r(a),o(c,d))),a.name=d},unlink(a,c){n(t.unlink(o(a,c)))},rmdir(a,c){n(t.rmdir(o(a,c)))},readdir(a){return[".","..",...n(t.readdir(r(a)))]},symlink(a,c,d){return n(t.symlink(d,o(a,c))),l.createNode(a,c,ie|511,0)},readlink(a){return n(t.readlink(r(a)))}},stream_ops:{open(a){if((a.node.mode&L)!==se)return;const c=r(a.node);let d=t.open(c,a.flags&ne,438);d===-2&&a.flags&j&&(d=t.open(c,a.flags&ne|j,438)),a.kfd=n(d),a.shared.refcount=1},close(a){a.kfd!==void 0&&--a.shared.refcount===0&&t.close(a.kfd)},dup(a){a.shared.refcount++},read(a,c,d,p,u){let _=0;for(;_<p;){const f=t.pread(a.kfd,c.subarray(d+_,d+p),u+_);if(f<0){if(_)break;s(f)}if(f===0)break;_+=f}return _},write(a,c,d,p,u){return p===0?0:n(t.pwrite(a.kfd,c.subarray(d,d+p),u))},llseek(a,c,d){let p=c;if(d===1?p+=a.position:d===2&&a.kfd!==void 0&&(p+=n(t.fstat(a.kfd)).size),p<0)throw new i.ErrnoError(e.EINVAL);return p}}};return l}const st=new Set(["lib","dev","proc"]);function rt(i,e){const t=i.FS,s=nt(t,i.ERRNO_CODES,e),n=e.readdir("/");if(typeof n!="number"){t.chdir("/");for(const r of n){if(st.has(r))continue;const o=e.stat("/"+r,!0);if(!(typeof o=="number"||(o.mode&61440)!==16384))try{t.mkdirTree("/"+r),t.mount(s,{root:"/"+r},"/"+r)}catch{}}}}const it=`"""Runs one program in Pyodide as python3 would (written by tabcomputer)."""
import os
import sys


def show_figure(path, title):
    import tabcomputer_js
    tabcomputer_js.show(path, title)


def _sleep(seconds):
    # time.sleep that ^C ends (tabcomputer#148). Pyodide's own switches stacks where the engine
    # can, and the interrupt is then raised in whatever Python runs first when it comes back: a
    # weak reference's callback, which ignores it, so a loop around sleep never stopped.
    import tabcomputer_js
    if seconds < 0:
        raise ValueError("sleep length must be non-negative")
    if tabcomputer_js.sleep(float(seconds)):
        raise KeyboardInterrupt


def _trim(tb):
    # (the frames of this file and of runpy are not the program's)
    while tb is not None:
        name = tb.tb_frame.f_code.co_filename
        if name != __file__ and "runpy" not in name:
            break
        tb = tb.tb_next
    return tb


def _flush():
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.flush()
        except Exception:
            pass


def main(kind, target, argv, sitedirs, env):
    import site
    import traceback

    for key, value in env.items():
        os.environ[key] = value
    for d in sitedirs:
        if os.path.isdir(d):
            site.addsitedir(d)
    import time
    time.sleep = _sleep
    sys.argv[:] = argv
    import __main__

    scope = __main__.__dict__
    for key in [k for k in scope if k not in ("__name__", "__builtins__", "__doc__", "__spec__", "__loader__", "__package__")]:
        del scope[key]
    rc = 0
    try:
        if kind == "file":
            sys.path.insert(0, os.path.dirname(os.path.abspath(target)))
            with open(target, "rb") as f:
                source = f.read()
            scope["__file__"] = target
            exec(compile(source, target, "exec"), scope)
        elif kind == "module":
            sys.path.insert(0, os.getcwd())
            import runpy

            runpy.run_module(target, run_name="__main__", alter_sys=True)
        elif kind == "code":
            sys.path.insert(0, "")
            exec(compile(target, "<string>", "exec"), scope)
        else:
            sys.path.insert(0, "")
            import code

            banner = "Python %s (Pyodide) on tabcomputer\\nType exit() or press Ctrl+D to leave." % sys.version.split()[0]
            code.interact(banner=banner, local=scope, exitmsg="")
    except SystemExit as e:
        c = e.code
        if c is None:
            rc = 0
        elif isinstance(c, int):
            rc = c & 0xFF
        else:
            _flush()
            print(c, file=sys.stderr)
            rc = 1
    except KeyboardInterrupt as e:
        _flush()
        traceback.print_exception(type(e), e, _trim(e.__traceback__))
        rc = 130
    except BaseException as e:
        _flush()
        traceback.print_exception(type(e), e, _trim(e.__traceback__))
        rc = 1
    _flush()
    return rc
`,at=`"""matplotlib backend for tabcomputer: Agg; show() opens each figure in a desktop window."""
import os

from matplotlib._pylab_helpers import Gcf
from matplotlib.backend_bases import FigureManagerBase
from matplotlib.backends.backend_agg import FigureCanvasAgg

_shown = 0


class FigureManagerTab(FigureManagerBase):
    @classmethod
    def pyplot_show(cls, *, block=None):
        global _shown
        import tabcomputer_run

        managers = Gcf.get_all_fig_managers()
        if not managers:
            return
        d = os.environ.get("TABCOMPUTER_PLOT_DIR") or "/tmp/tabcomputer-plots"
        os.makedirs(d, exist_ok=True)
        for manager in managers:
            _shown += 1
            path = "%s/figure-%s-%d.png" % (d, os.environ.get("TABCOMPUTER_PID", "0"), _shown)
            manager.canvas.figure.savefig(path)
            tabcomputer_run.show_figure(path, "Figure %s" % manager.num)
        Gcf.destroy_all()


class FigureCanvasTab(FigureCanvasAgg):
    manager_class = FigureManagerTab


FigureCanvas = FigureCanvasTab
FigureManager = FigureManagerTab
`;function ot(i){return`/lib/python${String(i.runPython('import sys; "%d.%d" % sys.version_info[:2]'))}/site-packages`}function lt(i){const e=ot(i);i.FS.mkdirTree(e),i.FS.writeFile(`${e}/tabcomputer_run.py`,it),i.FS.writeFile(`${e}/tabcomputer_mpl.py`,at)}const de=2e3;async function ct(i,e,t,s,n){const r=new TextEncoder,o=u=>n.write(2,r.encode(u));i.setStdin({read(u){const _=n.read(u);if(_<0)throw new i.FS.ErrnoError(_===-4?i.ERRNO_CODES.EINTR:i.ERRNO_CODES.EIO);return _},isatty:n.isatty(0)}),i.setStdout({write(u){return n.write(1,u),u.length},isatty:n.isatty(1)}),i.setStderr({write(u){return n.write(2,u),u.length},isatty:n.isatty(2)});const l=typeof SharedArrayBuffer=="function"?new Int32Array(new SharedArrayBuffer(4)):null;i.registerJsModule("tabcomputer_js",{show:(u,_)=>n.show(String(u),String(_)),sleep:u=>{const _=performance.now()+Math.max(0,Number(u)||0)*1e3;for(;;){if(n.interrupted?.())return n.clearInterrupt?.(),!0;const f=_-performance.now();if(f<=0)return!1;l&&Atomics.wait(l,0,0,Math.min(f,40))}}});try{i.FS.chdir(t)}catch{return o(`python3: the working directory ${t} is not reachable from Pyodide
`),1}if(e.kind==="stdin"){const u=[],_=new Uint8Array(65536);for(let k=n.read(_);k>0;k=n.read(_))u.push(_.slice(0,k));const f=new Uint8Array(u.reduce((k,v)=>k+v.length,0));u.reduce((k,v)=>(f.set(v,k),k+v.length),0),e={...e,kind:"code",target:new TextDecoder().decode(f)}}const a={messageCallback:()=>{},errorCallback:u=>o(`python3: ${u}
`)},c=n.isatty(2)?setTimeout(()=>o(`python3: fetching packages from Pyodide...
`),de):void 0;try{e.packages.length&&await i.loadPackage(e.packages,a);let u=e.kind==="code"?e.target:"";if(e.kind==="file")try{u=i.FS.readFile(e.target,{encoding:"utf8"})}catch{}u&&await i.loadPackagesFromImports(u,a)}catch(u){o(`python3: could not load a Pyodide package: ${u?.message??u}
`)}finally{clearTimeout(c)}if(e.kind==="file")try{i.FS.stat(e.target)}catch{return o(`python3: can't open file '${e.target}': [Errno 2] No such file or directory
`),2}const d=i.pyimport("tabcomputer_run"),p=[i.toPy(e.argv),i.toPy(e.sitePaths),i.toPy({MPLBACKEND:"module://tabcomputer_mpl",...s})];try{const u=d.main,_=s.TABCOMPUTER_PYODIDE_JSPI!=="0"&&typeof WebAssembly.Suspending=="function"&&typeof u.callPromising=="function";return Number(_?await u.callPromising(e.kind,e.target,...p):u(e.kind,e.target,...p))}catch(u){return o(`python3: ${u?.message??u}
`),1}finally{for(const u of p)try{u.destroy()}catch{}}}const dt=String.raw`"""The notebook kernel's Python side (written by tabcomputer)."""
import ast
import base64
import builtins
import io
import json
import linecache
import os
import re
import sys
import time
import tokenize
import traceback

import tabcomputer_nbjs as _js

user_ns = {"__name__": "__main__", "__builtins__": builtins, "__doc__": None}
_count = 0
_retina = False
_site_dirs = []
_rid = 0
_home = None
_entered = False


class UsageError(Exception):
    pass


def _flush():
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.flush()
        except Exception:
            pass


def _send(msg):
    _flush()
    _js.send(json.dumps(msg))


def _request(msg):
    """Ask the page for something and wait for its answer (input, a shell command)."""
    global _rid
    _rid += 1
    _flush()
    reply = _js.request(json.dumps(dict(msg, rid=_rid)), _rid)
    if not isinstance(reply, str):
        raise KeyboardInterrupt
    return json.loads(reply)


# ── Values as mime bundles ──

_REPRS = (
    ("_repr_html_", "text/html"),
    ("_repr_markdown_", "text/markdown"),
    ("_repr_svg_", "image/svg+xml"),
    ("_repr_png_", "image/png"),
    ("_repr_jpeg_", "image/jpeg"),
    ("_repr_latex_", "text/latex"),
    ("_repr_json_", "application/json"),
    ("_repr_javascript_", "application/javascript"),
)


def _clean(mime, value):
    if isinstance(value, (bytes, bytearray, memoryview)):
        return base64.b64encode(bytes(value)).decode("ascii")
    if mime == "application/json" or mime.endswith("+json"):
        # (NaN and Infinity are not JSON)
        return json.loads(json.dumps(value, default=str), parse_constant=lambda c: None)
    return value if isinstance(value, str) else str(value)


def _is_figure(obj):
    mod = sys.modules.get("matplotlib.figure")
    return mod is not None and isinstance(obj, mod.Figure)


def _figure_png(fig):
    buf = io.BytesIO()
    scale = 2 if _retina else 1
    fig.canvas.print_figure(buf, format="png", bbox_inches="tight", dpi=fig.dpi * scale,
                            facecolor=fig.get_facecolor(), edgecolor=fig.get_edgecolor())
    data = buf.getvalue()
    meta = {}
    if _retina and len(data) > 24:
        import struct
        w, h = struct.unpack(">II", data[16:24])
        meta = {"width": w // 2, "height": h // 2}
    return data, meta


def _bundle(obj):
    data, meta = {}, {}
    # (a class has the methods but they are not its own; an object that answers every name has none)
    plain = isinstance(obj, type)
    if not plain:
        try:
            plain = getattr(obj, "_ipython_canary_method_should_not_exist_", None) is not None
        except Exception:
            plain = True
    if not plain:
        mb = getattr(obj, "_repr_mimebundle_", None)
        if callable(mb):
            try:
                r = mb(include=None, exclude=None)
                if isinstance(r, tuple) and len(r) == 2:
                    r, md = r
                    meta.update(md or {})
                for mime, value in (r or {}).items():
                    data[mime] = _clean(mime, value)
            except Exception:
                pass
        for attr, mime in _REPRS:
            if mime in data:
                continue
            try:
                method = getattr(obj, attr, None)
                if not callable(method):
                    continue
                r = method()
            except Exception:
                continue
            if r is None:
                continue
            if isinstance(r, tuple) and len(r) == 2:
                r, md = r
                if md:
                    meta[mime] = md
            data[mime] = _clean(mime, r)
        if "image/png" not in data and _is_figure(obj):
            try:
                png, md = _figure_png(obj)
                data["image/png"] = _clean("image/png", png)
                if md:
                    meta["image/png"] = md
            except Exception:
                pass
    if "text/plain" not in data:
        try:
            data["text/plain"] = repr(obj)
        except Exception as e:
            data["text/plain"] = "<%s object: repr failed (%s)>" % (type(obj).__name__, e)
    return data, meta


# ── display() and the display classes ──

class DisplayHandle:
    def __init__(self, display_id=None):
        self.display_id = display_id or os.urandom(8).hex()

    def display(self, obj, **kwargs):
        display(obj, display_id=self.display_id, **kwargs)

    def update(self, obj, **kwargs):
        update_display(obj, display_id=self.display_id, **kwargs)


def display(*objs, include=None, exclude=None, metadata=None, transient=None, display_id=None,
            raw=False, clear=False, update=False, **kwargs):
    if display_id is True:
        display_id = os.urandom(8).hex()
    if clear:
        clear_output(wait=True)
    for obj in objs:
        if raw:
            data, meta = dict(obj), {}
        else:
            data, meta = _bundle(obj)
        if metadata:
            meta.update(metadata)
        msg = {"t": "display", "data": data, "metadata": meta}
        if display_id:
            msg["display_id"] = str(display_id)
            msg["update"] = bool(update)
        _send(msg)
    if display_id:
        return DisplayHandle(display_id)


def update_display(obj, *, display_id, **kwargs):
    display(obj, display_id=display_id, update=True, **kwargs)


def clear_output(wait=False):
    _send({"t": "clear", "wait": bool(wait)})


class DisplayObject:
    _mime = "text/plain"

    def __init__(self, data=None, url=None, filename=None, metadata=None):
        if data is None and filename is not None:
            with open(filename, "r", encoding="utf-8") as f:
                data = f.read()
        if data is None and url is not None:
            data = _fetch(url, binary=False)
        self.data = data
        self.url = url
        self.filename = filename
        self.metadata = metadata or {}

    def _repr_mimebundle_(self, include=None, exclude=None):
        return {self._mime: self.data, "text/plain": "<IPython.display.%s object>" % type(self).__name__}


def _fetch(url, binary=True):
    if not binary:
        from pyodide.http import open_url
        return open_url(url).read()
    from js import XMLHttpRequest
    req = XMLHttpRequest.new()
    req.open("GET", url, False)
    req.responseType = "arraybuffer"
    req.send(None)
    return bytes(req.response.to_py())


class HTML(DisplayObject):
    _mime = "text/html"


class Markdown(DisplayObject):
    _mime = "text/markdown"


class Latex(DisplayObject):
    _mime = "text/latex"


class Math(Latex):
    def __init__(self, data=None, **kwargs):
        super().__init__(data, **kwargs)
        self.data = "$\\displaystyle %s$" % str(self.data).strip("$")


class SVG(DisplayObject):
    _mime = "image/svg+xml"


class Javascript(DisplayObject):
    _mime = "application/javascript"


class Pretty(DisplayObject):
    _mime = "text/plain"

    def _repr_mimebundle_(self, include=None, exclude=None):
        return {"text/plain": self.data}


class Code(Pretty):
    def __init__(self, data=None, url=None, filename=None, language=None):
        super().__init__(data, url=url, filename=filename)


class JSON(DisplayObject):
    _mime = "application/json"

    def __init__(self, data=None, url=None, filename=None, **kwargs):
        if isinstance(data, str):
            data = json.loads(data)
        if data is None and filename is not None:
            with open(filename, "r", encoding="utf-8") as f:
                data = json.load(f)
        self.data = data
        self.metadata = {}


_IMAGE_MIMES = {"png": "image/png", "jpg": "image/jpeg", "jpeg": "image/jpeg", "gif": "image/gif", "svg": "image/svg+xml", "webp": "image/webp"}


class Image:
    def __init__(self, data=None, url=None, filename=None, format=None, embed=None, width=None, height=None,
                 retina=False, unconfined=False, metadata=None, alt=None):
        if isinstance(data, str) and (data.startswith("http://") or data.startswith("https://")):
            url, data = data, None
        elif isinstance(data, str) and filename is None and os.path.exists(data):
            filename, data = data, None
        if data is None and filename is not None:
            with open(filename, "rb") as f:
                data = f.read()
        if data is None and url is not None:
            data = _fetch(url)
        ext = format or os.path.splitext(str(filename or url or ""))[1].lstrip(".").lower() or "png"
        self.format = ext
        self.data = data
        self.width, self.height = width, height

    def _repr_mimebundle_(self, include=None, exclude=None):
        mime = _IMAGE_MIMES.get(self.format, "image/png")
        meta = {}
        if self.width:
            meta["width"] = self.width
        if self.height:
            meta["height"] = self.height
        data = self.data.decode("utf-8") if mime == "image/svg+xml" and isinstance(self.data, bytes) else self.data
        return {mime: data, "text/plain": "<IPython.core.display.Image object>"}, ({mime: meta} if meta else {})


class IFrame:
    def __init__(self, src, width, height, extras=None, **kwargs):
        self.src, self.width, self.height = src, width, height

    def __repr__(self):
        return "<IFrame %s (frames are not shown in this notebook)>" % self.src


class YouTubeVideo(IFrame):
    def __init__(self, id, width=400, height=300, **kwargs):
        super().__init__("https://www.youtube.com/embed/%s" % id, width, height)


# ── Figures ──

def flush_figures():
    """Draw every open figure under the cell and close it, as the inline backend does."""
    if "matplotlib.pyplot" not in sys.modules:
        return
    from matplotlib._pylab_helpers import Gcf
    managers = Gcf.get_all_fig_managers()
    if not managers:
        return
    try:
        for manager in managers:
            fig = manager.canvas.figure
            if not fig.axes and not fig.lines and not fig.images and not fig.texts and not fig.patches[1:]:
                continue
            display(fig)
    finally:
        sys.modules["matplotlib.pyplot"].close("all")


def set_matplotlib_formats(*formats, **kwargs):
    global _retina
    _retina = any(f in ("retina", "png2x") for f in formats)


# ── get_ipython() ──

class SList(list):
    @property
    def n(self):
        return "\n".join(self)

    @property
    def s(self):
        return " ".join(self)

    l = property(lambda self: self)


class _Captured:
    def __init__(self, stdout, stderr):
        self.stdout, self.stderr = stdout, stderr

    def show(self):
        sys.stdout.write(self.stdout)
        sys.stderr.write(self.stderr)

    __call__ = show

    def __str__(self):
        return self.stdout


_line_magics = {}
_cell_magics = {}


def _line(*names):
    def deco(fn):
        for n in names:
            _line_magics[n] = fn
        return fn
    return deco


def _cell(*names):
    def deco(fn):
        for n in names:
            _cell_magics[n] = fn
        return fn
    return deco


def _expand(cmd):
    """{expr} and $name in a shell line, from the notebook's variables."""
    def brace(m):
        try:
            return str(eval(m.group(1), user_ns))
        except Exception:
            return m.group(0)

    def dollar(m):
        name = m.group(1)
        return str(user_ns[name]) if name in user_ns else m.group(0)

    return re.sub(r"\$([A-Za-z_]\w*)", dollar, re.sub(r"\{([^{}]+)\}", brace, cmd))


class TabInteractiveShell:
    """What get_ipython() returns: the magics and shell lines a notebook uses."""
    user_ns = user_ns
    execution_count = 0
    kernel = None
    colors = "NoColor"

    def system(self, cmd):
        r = _request({"t": "shell", "cmd": _expand(cmd), "cwd": os.getcwd(), "capture": False})
        user_ns["_exit_code"] = r.get("code", 0)

    system_raw = system_piped = system

    def getoutput(self, cmd, split=True):
        r = _request({"t": "shell", "cmd": _expand(cmd), "cwd": os.getcwd(), "capture": True})
        user_ns["_exit_code"] = r.get("code", 0)
        out = r.get("out", "")
        return SList(out.splitlines()) if split else out

    def run_line_magic(self, name, line):
        fn = _line_magics.get(name)
        if fn is None:
            if name in _cell_magics:
                raise UsageError("%%%%%s is a cell magic: it goes on the first line of a cell, as %%%%%s." % (name, name))
            raise UsageError("Line magic function %s%s not found." % ("%", name))
        return fn(self, line)

    def run_cell_magic(self, name, line, cell):
        fn = _cell_magics.get(name)
        if fn is None:
            raise UsageError("Cell magic %s%s not found." % ("%%", name))
        return fn(self, line, cell)

    def magic(self, text):
        name, _, line = text.lstrip("%").partition(" ")
        return self.run_line_magic(name, line)

    def run_cell(self, source, **kwargs):
        _exec_sync(source, "<cell>")

    def register_magic_function(self, fn, magic_kind="line", magic_name=None):
        name = magic_name or fn.__name__
        if magic_kind in ("line", "line_cell"):
            _line_magics[name] = lambda shell, line: fn(line)
        if magic_kind in ("cell", "line_cell"):
            _cell_magics[name] = lambda shell, line, cell: fn(line, cell)

    def set_next_input(self, text, replace=False):
        print(text)

    def enable_matplotlib(self, gui=None):
        return "inline", "module://tabcomputer_nb_mpl"

    def ev(self, expr):
        return eval(expr, user_ns)

    def ex(self, code):
        exec(code, user_ns)

    def push(self, variables):
        user_ns.update(variables)

    @classmethod
    def instance(cls, *args, **kwargs):
        return _shell

    class events:
        @staticmethod
        def register(event, fn):
            pass

        @staticmethod
        def unregister(event, fn):
            pass


_shell = TabInteractiveShell()


def get_ipython():
    return _shell


def _run_system(name):
    return lambda shell, line: shell.system((name + " " + line).strip())


for _name in ("ls", "ll", "cat", "mkdir", "rmdir", "rm", "cp", "mv", "head", "tail", "less", "more", "man", "git", "wc", "grep", "find", "touch", "echo", "du", "df"):
    _line_magics[_name] = _run_system("ls -l" if _name == "ll" else "cat" if _name in ("less", "more") else _name)


def _noop(shell, line):
    return None


for _name in ("load_ext", "reload_ext", "unload_ext", "autoreload", "aimport", "precision", "colors", "xmode", "autosave",
              "notebook", "gui", "history", "hist", "store", "doctest_mode", "pprint", "automagic", "autocall",
              "logstart", "logstop", "logon", "logoff", "bookmark", "alias", "rehashx", "tb", "pdb", "debug", "matplotlib_inline"):
    _line_magics[_name] = _noop


@_line("matplotlib")
def _m_matplotlib(shell, line):
    arg = line.split()[0] if line.split() else "inline"
    if arg not in ("inline", "agg", "--list", "-l"):
        print("Plots are drawn under the cell here. %smatplotlib %s is not available." % ("%", arg), file=sys.stderr)
    if arg in ("--list", "-l"):
        print("Available matplotlib backends: ['inline']")


@_line("config")
def _m_config(shell, line):
    m = re.match(r"\s*InlineBackend\.figure_formats?\s*=\s*(.+)$", line)
    if m:
        set_matplotlib_formats(*re.findall(r"[A-Za-z0-9]+", m.group(1)))


@_line("pylab")
def _m_pylab(shell, line):
    exec("import numpy\nimport matplotlib\nfrom matplotlib import pyplot as plt\nnp = numpy\nfrom numpy import *\nfrom matplotlib.pyplot import *", user_ns)


@_line("pip")
def _m_pip(shell, line):
    import importlib
    shell.system("pip " + line)
    add_sites(_site_dirs)
    importlib.invalidate_caches()


@_line("conda", "mamba", "micromamba", "apt", "apt-get", "brew")
def _m_conda(shell, line):
    print("This notebook installs Python packages with pip: %spip install NAME" % "%", file=sys.stderr)


@_line("cd")
def _m_cd(shell, line):
    target = os.path.expanduser(line.strip().strip("'\"") or "~")
    os.chdir(target)
    print(os.getcwd())


@_line("pwd")
def _m_pwd(shell, line):
    return os.getcwd()


@_line("env", "set_env")
def _m_env(shell, line):
    line = line.strip()
    if not line:
        return dict(os.environ)
    name, sep, value = line.partition("=")
    if not sep:
        name, sep, value = line.partition(" ")
    if not sep:
        return os.environ.get(name)
    os.environ[name.strip()] = _expand(value.strip())
    print("env: %s=%s" % (name.strip(), os.environ[name.strip()]))


@_line("sx", "system")
def _m_sx(shell, line):
    return shell.getoutput(line)


@_line("clear", "cls")
def _m_clear(shell, line):
    clear_output()


@_line("who")
def _m_who(shell, line):
    names = sorted(k for k in user_ns if not k.startswith("_") and k not in _HIDDEN)
    print("\t ".join(names) if names else "Interactive namespace is empty.")


@_line("whos")
def _m_whos(shell, line):
    names = sorted(k for k in user_ns if not k.startswith("_") and k not in _HIDDEN)
    if not names:
        print("Interactive namespace is empty.")
        return
    print("%-20s %-16s %s" % ("Variable", "Type", "Data/Info"))
    print("-" * 60)
    for k in names:
        v = user_ns[k]
        try:
            info = repr(v).replace("\n", " ")
        except Exception:
            info = "?"
        print("%-20s %-16s %s" % (k, type(v).__name__, info[:60]))


@_line("reset")
def _m_reset(shell, line):
    for k in [k for k in user_ns if k not in _HIDDEN and k not in ("__name__", "__builtins__", "__doc__")]:
        del user_ns[k]
    _seed_ns()


@_line("run")
def _m_run(shell, line):
    import shlex
    args = shlex.split(line)
    args = [a for a in args if not (a.startswith("-") and a in ("-i", "-e", "-t", "-n"))]
    if not args:
        raise UsageError("%srun needs a file: %srun script.py" % ("%", "%"))
    path = os.path.expanduser(args[0])
    with open(path, "r", encoding="utf-8") as f:
        source = f.read()
    saved = sys.argv[:]
    sys.argv[:] = args
    try:
        scope = dict(user_ns, __file__=path)
        exec(compile(source, path, "exec"), scope)
        scope.pop("__file__", None)
        user_ns.update(scope)
    finally:
        sys.argv[:] = saved


@_line("lsmagic")
def _m_lsmagic(shell, line):
    print("Available line magics:\n" + "  ".join("%" + n for n in sorted(_line_magics)))
    print("\nAvailable cell magics:\n" + "  ".join("%%" + n for n in sorted(_cell_magics)))


@_line("pinfo", "pinfo2", "pdoc")
def _m_pinfo(shell, line):
    import inspect
    try:
        obj = eval(line, user_ns)
    except Exception:
        print("Object %s not found." % line)
        return
    try:
        print("Signature: %s%s" % (line.split(".")[-1], inspect.signature(obj)))
    except Exception:
        pass
    print("Type:      %s" % type(obj).__name__)
    doc = inspect.getdoc(obj)
    if doc:
        print("Docstring:\n" + doc)


def _span(seconds):
    if seconds >= 1:
        return "%.3g s" % seconds
    if seconds >= 1e-3:
        return "%.3g ms" % (seconds * 1e3)
    if seconds >= 1e-6:
        return "%.3g µs" % (seconds * 1e6)
    return "%.3g ns" % (seconds * 1e9)


@_line("time")
def _m_time(shell, line):
    t0 = time.perf_counter()
    try:
        return _exec_sync(line, "<timed exec>", want_value=True)
    finally:
        print("Wall time: %s" % _span(time.perf_counter() - t0))


@_cell("time")
def _c_time(shell, line, cell):
    t0 = time.perf_counter()
    try:
        value = _exec_sync(cell, "<timed exec>", want_value=True)
    finally:
        print("Wall time: %s" % _span(time.perf_counter() - t0))
    if value is not None:
        _result(value, _count)


def _timeit(stmt, setup="pass"):
    import timeit
    timer = timeit.Timer(stmt, setup, globals=user_ns)
    number, total = timer.autorange()
    best = min([total] + timer.repeat(repeat=2, number=number)) / number
    print("%s per loop (best of 3 runs, %d loop%s each)" % (_span(best), number, "" if number == 1 else "s"))


@_line("timeit")
def _m_timeit(shell, line):
    _timeit(re.sub(r"^(\s*-[nrtcpqo]\s*\S*)+\s*", "", line))


@_cell("timeit")
def _c_timeit(shell, line, cell):
    _timeit(cell, re.sub(r"^(\s*-[nrtcpqo]\s*\S*)+\s*", "", line) or "pass")


@_cell("capture")
def _c_capture(shell, line, cell):
    name = next((a for a in line.split() if not a.startswith("-")), None)
    out, err = io.StringIO(), io.StringIO()
    saved = sys.stdout, sys.stderr
    sys.stdout, sys.stderr = out, err
    try:
        _exec_sync(cell, "<capture>")
    finally:
        sys.stdout, sys.stderr = saved
    if name:
        user_ns[name] = _Captured(out.getvalue(), err.getvalue())


@_cell("python", "python3", "prun")
def _c_python(shell, line, cell):
    _exec_sync(cell, "<cell>")


@_cell("writefile", "file")
def _c_writefile(shell, line, cell):
    args = line.split()
    append = "-a" in args
    names = [a for a in args if a != "-a"]
    if not names:
        raise UsageError("%swritefile needs a file name." % "%%")
    path = os.path.expanduser(names[0].strip("'\""))
    existed = os.path.exists(path)
    with open(path, "a" if append else "w", encoding="utf-8") as f:
        f.write(cell if cell.endswith("\n") else cell + "\n")
    print(("Appending to %s" if append else "Overwriting %s" if existed else "Writing %s") % path)


@_cell("bash", "sh", "script", "shell", "system", "sx", "zsh")
def _c_bash(shell, line, cell):
    shell.system(cell)


@_cell("html", "HTML")
def _c_html(shell, line, cell):
    display(HTML(cell))


@_cell("markdown")
def _c_markdown(shell, line, cell):
    display(Markdown(cell))


@_cell("latex")
def _c_latex(shell, line, cell):
    display(Latex(cell))


@_cell("svg", "SVG")
def _c_svg(shell, line, cell):
    display(SVG(cell))


@_cell("javascript", "js")
def _c_js(shell, line, cell):
    display(Javascript(cell))


def register_line_magic(fn):
    _line_magics[fn.__name__] = lambda shell, line: fn(line)
    return fn


def register_cell_magic(fn):
    _cell_magics[fn.__name__] = lambda shell, line, cell: fn(line, cell)
    return fn


def register_line_cell_magic(fn):
    _line_magics[fn.__name__] = lambda shell, line: fn(line)
    _cell_magics[fn.__name__] = lambda shell, line, cell: fn(line, cell)
    return fn


# ── Running a cell ──

_FLAGS = ast.PyCF_ALLOW_TOP_LEVEL_AWAIT
_CO_COROUTINE = 0x80


def _quiet(source):
    """Whether the cell ends with a semicolon: its last value is then not shown."""
    try:
        skip = (tokenize.COMMENT, tokenize.NL, tokenize.NEWLINE, tokenize.ENDMARKER, tokenize.INDENT, tokenize.DEDENT)
        toks = [t for t in tokenize.generate_tokens(io.StringIO(source).readline) if t.type not in skip]
        return bool(toks) and toks[-1].string == ";"
    except Exception:
        return False


def _compile(source, filename, flags=_FLAGS):
    tree = ast.parse(source, filename, "exec")
    last = None
    if tree.body and isinstance(tree.body[-1], ast.Expr) and not _quiet(source):
        last = ast.Expression(tree.body.pop().value)
    main = compile(tree, filename, "exec", flags=flags) if tree.body else None
    last = compile(last, filename, "eval", flags=flags) if last is not None else None
    return main, last


def _exec_sync(source, filename, want_value=False):
    """Run Python that a magic was given (no top-level await)."""
    linecache.cache[filename] = (len(source), None, source.splitlines(True), filename)
    main, last = _compile(source, filename, flags=0)
    if main is not None:
        exec(main, user_ns)
    if last is not None:
        value = eval(last, user_ns)
        if want_value:
            return value
        if value is not None:
            _result(value, _count)
    return None


def _result(value, count):
    user_ns["_"] = value
    _Out[count] = value
    if _is_figure(value) and "matplotlib.pyplot" in sys.modules:
        # (an open figure is drawn once, when the cell ends)
        from matplotlib._pylab_helpers import Gcf
        if any(m.canvas.figure is value for m in Gcf.get_all_fig_managers()):
            return
    data, meta = _bundle(value)
    _send({"t": "result", "data": data, "metadata": meta, "count": count})


def _format_error(e, seen):
    seen.add(id(e))
    lines = []
    cause = e.__cause__
    context = None if e.__suppress_context__ else e.__context__
    if cause is not None and id(cause) not in seen:
        lines += _format_error(cause, seen) + ["\nThe above exception was the direct cause of the following exception:\n\n"]
    elif context is not None and id(context) not in seen:
        lines += _format_error(context, seen) + ["\nDuring handling of the above exception, another exception occurred:\n\n"]
    # (the frames of this file are the kernel's, not the notebook's)
    frames = [f for f in traceback.extract_tb(e.__traceback__) if f.filename != __file__]
    if isinstance(e, SyntaxError) and not any(f.filename.startswith("<") for f in frames):
        # (the cell did not compile: the compiler's own frames say nothing about it)
        frames = []
    if frames:
        lines += ["Traceback (most recent call last):\n"] + traceback.format_list(frames)
    return lines + traceback.format_exception_only(type(e), e)


def _error(e):
    text = "".join(_format_error(e, set())).rstrip("\n")
    _send({"t": "error", "ename": type(e).__name__, "evalue": str(e), "traceback": text.split("\n")})


_task = None


def cancel_current():
    """Stop pressed while the cell waits in an await: Python is not running, so nothing sees the interrupt."""
    if _task is not None and not _task.done():
        _task.cancel()


async def run_cell(source):
    global _count, _task
    import asyncio
    try:
        _task = asyncio.current_task()
    except RuntimeError:
        _task = None
    _count += 1
    n = _count
    _shell.execution_count = n
    filename = "<ipython-input-%d>" % n
    linecache.cache[filename] = (len(source), None, source.splitlines(True), filename)
    _In.append(source)
    status = "ok"
    try:
        try:
            main, last = _compile(source, filename)
            if main is not None:
                r = eval(main, user_ns)
                if main.co_flags & _CO_COROUTINE:
                    await r
            if last is not None:
                value = eval(last, user_ns)
                if last.co_flags & _CO_COROUTINE:
                    value = await value
                if value is not None:
                    _result(value, n)
        except UsageError as e:
            _flush()
            print("UsageError: %s" % e, file=sys.stderr)
            status = "error"
        except asyncio.CancelledError as e:
            _error(KeyboardInterrupt().with_traceback(e.__traceback__))
            status = "error"
        except BaseException as e:
            _error(e)
            status = "error"
        try:
            flush_figures()
        except BaseException as e:
            _error(e)
            status = "error"
    except BaseException:
        # (a second interrupt, while the first was being reported)
        status = "error"
    _flush()
    return json.dumps({"status": status, "count": n})


# ── Setup ──

_HIDDEN = ("In", "Out", "get_ipython", "display", "exit", "quit")


_In = [""]
_Out = {}


def _seed_ns():
    user_ns["In"] = _In
    user_ns["Out"] = _Out
    user_ns["get_ipython"] = get_ipython
    user_ns["display"] = display


def _input(prompt=""):
    return _request({"t": "input", "prompt": str(prompt), "password": False})["value"]


def _getpass(prompt="Password: ", stream=None):
    return _request({"t": "input", "prompt": str(prompt), "password": True})["value"]


def _sleep(seconds):
    if seconds < 0:
        raise ValueError("sleep length must be non-negative")
    if _js.sleep(float(seconds)):
        raise KeyboardInterrupt


def add_sites(dirs):
    import site
    for d in dirs:
        if d not in sys.path and os.path.isdir(d):
            site.addsitedir(d)


def enter():
    """At the first cell that runs: work in the notebook's folder, with it first on sys.path.

    Not when the notebook is opened. Until the person runs a cell, no file beside
    the notebook can be imported: packages are loaded ahead of that, and Python
    imports modules of its own while it loads them.
    """
    global _entered
    if _entered:
        return
    _entered = True
    try:
        os.chdir(_home)
    except (OSError, TypeError):
        pass
    if "" not in sys.path:
        sys.path.insert(0, "")


def init(env, sitedirs, cwd):
    """Once, when the notebook is opened. The notebook's folder is entered later (enter)."""
    import getpass
    global _site_dirs, _home
    for key, value in env.items():
        os.environ[key] = value
    os.environ["MPLBACKEND"] = "module://tabcomputer_nb_mpl"
    os.environ.setdefault("TERM", "dumb")
    _site_dirs = list(sitedirs)
    add_sites(_site_dirs)
    _home = cwd
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(write_through=True, errors="replace")
        except Exception:
            pass
    builtins.input = _input
    getpass.getpass = _getpass
    time.sleep = _sleep
    sys.argv[:] = [""]
    _seed_ns()
    return "%d.%d.%d" % sys.version_info[:3]
`,ut=String.raw`"""matplotlib backend for tabcomputer's notebook: Agg; figures are drawn under the cell."""
from matplotlib.backend_bases import FigureManagerBase
from matplotlib.backends.backend_agg import FigureCanvasAgg

import tabcomputer_nb


class FigureManagerNotebook(FigureManagerBase):
    @classmethod
    def pyplot_show(cls, *, block=None):
        tabcomputer_nb.flush_figures()

    def show(self):
        tabcomputer_nb.display(self.canvas.figure)


class FigureCanvasNotebook(FigureCanvasAgg):
    manager_class = FigureManagerNotebook


FigureCanvas = FigureCanvasNotebook
FigureManager = FigureManagerNotebook
show = tabcomputer_nb.flush_figures
flush_figures = tabcomputer_nb.flush_figures
set_matplotlib_formats = tabcomputer_nb.set_matplotlib_formats


def configure_inline_support(shell, backend):
    pass
`,ae="display, update_display, clear_output, DisplayHandle, DisplayObject, HTML, Markdown, Latex, Math, SVG, Javascript, Pretty, Code, JSON, Image, IFrame, YouTubeVideo, set_matplotlib_formats",_t={IPython:{"IPython/__init__.py":`"""The parts of IPython a notebook imports (written by tabcomputer; the real package is not installed)."""
from tabcomputer_nb import get_ipython, display, UsageError
from . import display as display  # noqa: F811
from .core.interactiveshell import InteractiveShell

__version__ = "8.30.0"
version_info = (8, 30, 0, "")


def embed(*args, **kwargs):
    raise RuntimeError("IPython.embed() is not available in this notebook")
`,"IPython/display.py":`from tabcomputer_nb import ${ae}
`,"IPython/core/__init__.py":"","IPython/core/display.py":`from tabcomputer_nb import ${ae}
`,"IPython/core/display_functions.py":`from tabcomputer_nb import display, update_display, clear_output, DisplayHandle
`,"IPython/core/getipython.py":`from tabcomputer_nb import get_ipython
`,"IPython/core/error.py":`from tabcomputer_nb import UsageError
`,"IPython/core/interactiveshell.py":`from tabcomputer_nb import TabInteractiveShell as InteractiveShell
`,"IPython/core/magic.py":`from tabcomputer_nb import register_line_magic, register_cell_magic, register_line_cell_magic


def needs_local_scope(fn):
    return fn
`,"IPython/utils/__init__.py":"","IPython/utils/io.py":`from tabcomputer_nb import _Captured as CapturedIO
`},matplotlib_inline:{"matplotlib_inline/__init__.py":`__version__ = "0.1.7"
`,"matplotlib_inline/backend_inline.py":`from tabcomputer_nb_mpl import *  # noqa: F401,F403
from tabcomputer_nb_mpl import FigureCanvas, FigureManager, show, flush_figures, set_matplotlib_formats, configure_inline_support
`}};function pt(i){const t=`/lib/python${String(i.runPython('import sys; "%d.%d" % sys.version_info[:2]'))}/site-packages`;i.FS.mkdirTree(t),i.FS.writeFile(`${t}/tabcomputer_nb.py`,dt),i.FS.writeFile(`${t}/tabcomputer_nb_mpl.py`,ut);for(const[s,n]of Object.entries(_t))if(!i.runPython(`import importlib.util; importlib.util.find_spec(${JSON.stringify(s)}) is not None`))for(const[r,o]of Object.entries(n))i.FS.mkdirTree(`${t}/${r.slice(0,r.lastIndexOf("/"))}`),i.FS.writeFile(`${t}/${r}`,o)}async function ft(i,e,t,s,n){const r=new TextEncoder,o=new TextDecoder,l=h=>n.ctlWrite(r.encode(JSON.stringify(h)+`
`));let a=new Uint8Array(0);const c=new Uint8Array(65536),d=()=>{for(;;){const h=a.indexOf(10);if(h>=0){const S=o.decode(a.subarray(0,h));return a=a.slice(h+1),S}const m=n.ctlRead(c);if(m===-4)return null;if(m<=0)return;const g=new Uint8Array(a.length+m);g.set(a),g.set(c.subarray(0,m),a.length),a=g}};i.setStdin({read:()=>0}),i.setStdout({write(h){return n.write(1,h),h.length}}),i.setStderr({write(h){return n.write(2,h),h.length}});const p=new Int32Array(new SharedArrayBuffer(4));i.registerJsModule("tabcomputer_nbjs",{send:h=>{n.ctlWrite(r.encode(String(h)+`
`))},sleep:h=>{const m=performance.now()+Math.max(0,Number(h)||0)*1e3;for(;;){if(n.interrupted())return n.clearInterrupt(),!0;const g=m-performance.now();if(g<=0)return!1;Atomics.wait(p,0,0,Math.min(g,40))}},request:(h,m)=>{for(n.ctlWrite(r.encode(String(h)+`
`));;){const g=d();if(g===void 0)throw new Error("the notebook was closed");if(g===null){n.clearInterrupt();return}try{const S=JSON.parse(g);if(S?.t==="reply"&&S.rid===m)return g}catch{}}}}),pt(i);const u=i.pyimport("tabcomputer_nb"),_=i.toPy(s),f=i.toPy(e.sitePaths),k=String(u.init(_,f,t));_.destroy(),f.destroy();const v=async(h,m)=>{const g={messageCallback:S=>{/^Loading /.test(S)&&l({t:"status",text:S})},errorCallback:S=>{n.write(2,r.encode(`${S}
`))}};try{h?.length&&await i.loadPackage(h,g),m&&await i.loadPackagesFromImports(m.replace(/^[ \t]*(?:from|import)[ \t]+(?:IPython|matplotlib_inline)\b.*$/gm,""),g)}catch(S){n.write(2,r.encode(`Could not load a package: ${S?.message??S}
`))}l({t:"status",text:""})};for(l({t:"ready",python:k});;){const h=d();if(h===void 0)return 0;if(h===null)continue;let m;try{m=JSON.parse(h)}catch{continue}if(m?.t==="shutdown")return 0;if(m?.t==="load")await v(m.packages,m.code),l({t:"done",id:m.id,status:"ok",count:0});else if(m?.t==="exec"){await v(m.packages,m.code);let g={status:"error",count:0};const S=setInterval(()=>{if(n.interrupted()){n.clearInterrupt();try{u.cancel_current()}catch{}}},100);try{if(n.interrupted())throw new Error("KeyboardInterrupt");u.enter(),g=JSON.parse(String(await u.run_cell(String(m.code))))}catch(G){const B=String(G?.message??G).trimEnd();l({t:"error",ename:"KernelError",evalue:B.split(`
`).pop()??"",traceback:B.split(`
`)})}clearInterval(S),n.clearInterrupt(),l({t:"done",id:m.id,...g})}}}function ht(i){const e=i.ch,t=new TextEncoder,s=n=>{const r=t.encode(n);return r.length>e.data.length?-36:(e.data.set(r),r.length)};return{stat:(n,r)=>r?i.stat(n):i.fstatat(w,n,fe),open:(n,r,o)=>i.open(n,r,o),close:n=>i.close(n),pread:(n,r,o)=>i.pread(n,r,o),pwrite:(n,r,o)=>i.pwrite(n,r,o),fstat:n=>i.fstat(n),readdir(n){const r=i.open(n,U|pe);if(r<0)return r;const o=[];try{for(;;){const l=e.call(217,r,e.data.length);if(l<0)return l;if(l===0)break;const a=e.data.slice(0,l),c=new DataView(a.buffer);for(let d=0;d<l;){const p=c.getUint16(d+16,!0);let u=d+19;for(;u<d+p&&a[u]!==0;)u++;const _=oe(a.subarray(d+19,u));_!=="."&&_!==".."&&o.push(_),d+=p}}}finally{i.close(r)}return o},mkdir:(n,r)=>i.mkdir(n,r),unlink:n=>i.unlink(n),rmdir:n=>i.rmdir(n),rename:(n,r)=>i.rename(n,r),symlink:(n,r)=>i.symlink(n,r),readlink:n=>i.readlink(n),truncate(n,r){const o=s(n);return o<0?o:e.call(76,o,r>>>0,Math.floor(r/4294967296))},chmod(n,r){const o=s(n);return o<0?o:e.call(268,w,o,r)},utimes:(n,r,o)=>i.utimensat(w,n,r,o)}}function ue(i,e){return i.ch.data.fill(0,0,te),i.ch.call(16,e,be,te)>=0}async function mt(i,e,t){const s=R(e,t);try{if(e.interrupt&&(i.setInterruptBuffer(new Uint8Array(e.interrupt)),s.sigaction(ge,{handler:2,flags:Se})),rt(i,ht(s)),e.notebook){const o=e.interrupt?new Uint8Array(e.interrupt):null,l=await ft(i,e.notebook,e.cwd,{...e.env,TABCOMPUTER_PID:String(e.pid)},{ctlRead:a=>s.read(3,a),ctlWrite:a=>{s.write(3,a)},write:(a,c)=>{s.write(a,c)},interrupted:()=>!!o&&Atomics.load(o,0)===2,clearInterrupt:()=>{o&&Atomics.store(o,0,0)}});s.exit(l);return}const n=e.interrupt?new Uint8Array(e.interrupt):null,r=await ct(i,e.pyodide,e.cwd,{...e.env,TABCOMPUTER_PID:String(e.pid)},{read:o=>s.read(0,o),write:(o,l)=>{s.write(o,l)},isatty:o=>ue(s,o),show:(o,l)=>t({type:"pyodide-show",path:o,title:l}),interrupted:()=>!!n&&Atomics.load(n,0)===2,clearInterrupt:()=>{n&&Atomics.store(n,0,0)}});s.exit(r)}catch(n){if(n instanceof I)return;try{s.write(2,`python3: ${n?.message??n}
`)}catch{}try{s.exit(1)}catch{}}}function gt(i,e){let t=null,s;const n=new Promise(r=>{s=r});n.catch(()=>{}),i(r=>{if(r?.type==="pyodide-boot"&&!t){const o=String(r.indexURL).replace(/\/?$/,"/");t=import(`${o}pyodide.mjs`).then(l=>l.loadPyodide({indexURL:o})).then(l=>(lt(l),e({type:"pyodide-ready"}),l)),t.catch(()=>{}),s(t);return}if(Ie(r)){const o=r,l=setTimeout(()=>{try{const a=R(o,e);ue(a,2)&&a.write(2,`python3: loading Pyodide...
`)}catch{}},de);n.finally(()=>clearTimeout(l)).then(a=>mt(a,o,e),a=>{const c=R(o,e);try{c.write(2,`python3: could not load Pyodide: ${a?.message??a}
`),c.exit(1)}catch{}})}})}const St=self.postMessage.bind(self);gt(i=>{self.addEventListener("message",e=>i(e.data))},i=>St(i));
