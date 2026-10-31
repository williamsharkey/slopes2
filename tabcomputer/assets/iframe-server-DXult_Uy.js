class _{peer;inbox=[];waiter=null;eof=!1;closed=!1;deliver(e){if(!this.eof)if(this.waiter){const s=this.waiter;this.waiter=null,s(e)}else this.inbox.push(e)}end(){if(this.eof=!0,this.waiter&&!this.inbox.length){const e=this.waiter;this.waiter=null,e(void 0)}}read(){return this.inbox.length?Promise.resolve(this.inbox.shift()):this.eof?Promise.resolve(void 0):new Promise(e=>{this.waiter=e})}write(e){return this.closed||this.peer.closed?Promise.reject(new Error("EPIPE: connection closed")):(e.length&&this.peer.deliver(e.slice()),Promise.resolve())}close(){this.closed||(this.closed=!0,this.end(),this.peer.end())}}function C(){const l=new _,e=new _;return l.peer=e,e.peer=l,[l,e]}const G=globalThis.fetch.bind(globalThis),R=globalThis.setTimeout,P=globalThis.clearTimeout,B=globalThis.setTimeout.bind(globalThis),X=globalThis.clearTimeout.bind(globalThis),q=globalThis.setInterval.bind(globalThis),V=globalThis.clearInterval.bind(globalThis),J=["setTimeout","clearTimeout","setInterval","clearInterval","setImmediate","clearImmediate"];function U(l){const e=globalThis.setTimeout,s=globalThis.clearTimeout;if(e===R&&s===P)return l();globalThis.setTimeout=R,globalThis.clearTimeout=P;try{return l()}finally{globalThis.setTimeout=e,globalThis.clearTimeout=s}}if(typeof window<"u"&&globalThis.crypto){const l=globalThis.crypto;try{Object.defineProperty(globalThis,"crypto",{get:()=>l,set:()=>{},configurable:!0,enumerable:!0})}catch{}}const E=new TextEncoder,N=new TextDecoder("latin1");class I{constructor(e){this.s=e}buf=new Uint8Array(0);eof=!1;async fill(){if(this.eof)return!1;const e=await this.s.read();if(!e)return this.eof=!0,!1;if(!this.buf.length)this.buf=e;else{const s=new Uint8Array(this.buf.length+e.length);s.set(this.buf),s.set(e,this.buf.length),this.buf=s}return!0}async line(e=64*1024){let s=0;for(;;){const t=this.buf.indexOf(10,s);if(t>=0){const n=t>0&&this.buf[t-1]===13?t-1:t,o=N.decode(this.buf.subarray(0,n));return this.buf=this.buf.subarray(t+1),o}if(s=this.buf.length,this.buf.length>e)throw new Error("header line too long");if(!await this.fill())throw new Error("connection closed before the response head")}}async some(e){if(!this.buf.length&&!await this.fill())return;const s=Math.min(e,this.buf.length),t=this.buf.subarray(0,s);return this.buf=this.buf.subarray(s),t}async exactly(e){for(;this.buf.length<e;)if(!await this.fill())throw new Error("connection closed mid-body");const s=this.buf.subarray(0,e);return this.buf=this.buf.subarray(e),s}get buffered(){return this.buf.length}get atEof(){return this.eof&&!this.buf.length}}function v(l,e){const s=e.toLowerCase(),t=l.filter(([n])=>n.toLowerCase()===s).map(([,n])=>n);return t.length?t.join(", "):null}function W(l,e,s,t){const n=(e.pathname||"/")+e.search;if(/[\s]/.test(n)||/[^A-Z]/.test(l))throw new Error("bad request line");const o=[`${l} ${n} HTTP/1.1`],r=i=>s.some(([a])=>a.toLowerCase()===i);r("host")||o.push(`Host: ${e.host}`);for(const[i,a]of s){if(/[\r\n]/.test(i)||/[\r\n]/.test(a)||!/^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/.test(i))throw new Error(`bad header ${JSON.stringify(i)}`);o.push(`${i}: ${a}`)}return t!==null&&!r("content-length")&&!r("transfer-encoding")&&o.push(`Content-Length: ${t}`),E.encode(o.join(`\r
`)+`\r
\r
`)}async function x(l){const e=await l.line(),s=/^HTTP\/1\.[01] (\d{3})(?: (.*))?$/.exec(e);if(!s)throw new Error(`bad status line: ${e.slice(0,80)}`);const t=[];let n=0;for(;;){const o=await l.line();if(o==="")break;if(n+=o.length,n>256*1024||t.length>500)throw new Error("response head too large");if(/^[ \t]/.test(o)&&t.length){t[t.length-1][1]+=" "+o.trim();continue}const r=o.indexOf(":");r<=0||t.push([o.slice(0,r).trim(),o.slice(r+1).trim()])}return{status:Number(s[1]),statusText:s[2]??"",headers:t}}async function z(l,e){let s=await x(l);for(;s.status>=100&&s.status<200&&s.status!==101;)s=await x(l);const t=v(s.headers,"transfer-encoding")?.toLowerCase()??"",n=v(s.headers,"content-length"),o=v(s.headers,"connection")?.toLowerCase()??"",r=e==="HEAD"||s.status===204||s.status===304||s.status===101;let i,a=0;if(r)i="none";else if(t.split(",").map(m=>m.trim()).includes("chunked"))i="chunked";else if(n!==null){const m=Number(n.split(",")[0].trim());if(!Number.isSafeInteger(m)||m<0)throw new Error("bad content-length");i="length",a=m}else i="close";let c;const d=new Promise(m=>{c=m}),u=!o.includes("close")&&i!=="close";let p=0,h=!1;const f=m=>{h||(h=!0,c(m&&u))},y=new ReadableStream({async pull(m){try{if(i==="none"){f(!0),m.close();return}if(i==="length"){if(a===0){f(!0),m.close();return}const b=await l.some(Math.min(a,256*1024));if(!b)throw new Error("connection closed mid-body");a-=b.length,m.enqueue(b.slice()),a===0&&(f(!0),m.close());return}if(i==="close"){const b=await l.some(262144);if(!b){f(!1),m.close();return}m.enqueue(b.slice());return}if(p===0){const b=await l.line(),g=parseInt(b.split(";")[0].trim(),16);if(!Number.isFinite(g)||g<0)throw new Error("bad chunk size");if(g===0){for(;await l.line()!=="";);f(!0),m.close();return}p=g}const w=await l.some(Math.min(p,256*1024));if(!w)throw new Error("connection closed mid-chunk");p-=w.length,m.enqueue(w.slice()),p===0&&await l.exactly(2)}catch(w){f(!1),m.error(w)}},cancel(){f(!1)}},{highWaterMark:0});return i==="none"&&f(!0),{...s,body:y,reusable:d}}async function Y(l,e,s){if(!e)return;if(e instanceof Uint8Array){e.length&&await l.write(e);return}const t=e.getReader();for(;;){const{value:n,done:o}=await t.read();if(o)break;n?.length&&(s?(await l.write(E.encode(n.length.toString(16)+`\r
`)),await l.write(n),await l.write(E.encode(`\r
`))):await l.write(n))}s&&await l.write(E.encode(`0\r
\r
`))}const S=new TextEncoder;function k(l){let e="";for(const s of l)e+=String.fromCharCode(s);return btoa(e)}async function H(l){const e=await crypto.subtle.digest("SHA-1",S.encode(l+"258EAFA5-E914-47DA-95CA-C5AB0DC85B11"));return k(new Uint8Array(e))}function D(l,e,s=!0){const t=e.length,n=t<126?2:t<65536?4:10,o=new Uint8Array(n+4+t);o[0]=(s?128:0)|l,t<126?o[1]=128|t:t<65536?(o[1]=254,o[2]=t>>8,o[3]=t&255):(o[1]=255,new DataView(o.buffer).setBigUint64(2,BigInt(t)));const r=crypto.getRandomValues(new Uint8Array(4));o.set(r,n);for(let i=0;i<t;i++)o[n+4+i]=e[i]^r[i&3];return o}class M{constructor(e,s){this.s=e,this.h=s,this.reader=new I(e)}reader;closed=!1;closeSent=!1;async run(e,s,t){const n=k(crypto.getRandomValues(new Uint8Array(16))),o=new URL(e.href.replace(/^ws/,"http")),r=[["Host",o.host],["Upgrade","websocket"],["Connection","Upgrade"],["Sec-WebSocket-Key",n],["Sec-WebSocket-Version","13"],...s];t.length&&r.push(["Sec-WebSocket-Protocol",t.join(", ")]),await this.s.write(W("GET",o,r,null));const i=await x(this.reader);if(i.status!==101)throw new Error(`WebSocket handshake: HTTP ${i.status}`);if(v(i.headers,"sec-websocket-accept")!==await H(n))throw new Error("WebSocket handshake: bad accept key");const a=v(i.headers,"sec-websocket-protocol")??"";if(a&&!t.includes(a))throw new Error("WebSocket handshake: unexpected subprotocol");this.h.open(a,v(i.headers,"sec-websocket-extensions")??""),await this.readLoop()}async readLoop(){let e=[],s=0;const t=new TextDecoder("utf-8",{fatal:!0});try{for(;;){const n=await this.reader.exactly(2),o=(n[0]&128)!==0,r=n[0]&15;if(n[1]&128)throw new Error("masked frame from server");let i=n[1]&127;if(i===126){const d=await this.reader.exactly(2);i=d[0]<<8|d[1]}else if(i===127){const d=await this.reader.exactly(8);i=Number(new DataView(d.buffer,d.byteOffset,8).getBigUint64(0))}if(i>64*1024*1024)throw new Error("frame too large");const a=i?(await this.reader.exactly(i)).slice():new Uint8Array(0);if(r===8){const d=a.length>=2?a[0]<<8|a[1]:1005,u=a.length>2?new TextDecoder().decode(a.subarray(2)):"";this.closeSent||await this.sendFrame(8,a.subarray(0,2)),this.finish(d,u,!0);return}if(r===9){await this.sendFrame(10,a);continue}if(r===10)continue;if(r===1||r===2)s=r,e=[a];else if(r===0)e.push(a);else throw new Error(`bad opcode ${r}`);if(!o)continue;let c=e.length===1?e[0]:new Uint8Array(e.reduce((d,u)=>d+u.length,0));if(e.length>1){let d=0;for(const u of e)c.set(u,d),d+=u.length}e=[],this.h.message(s===1?t.decode(c):c.buffer.slice(c.byteOffset,c.byteOffset+c.byteLength))}}catch(n){this.closed||(this.h.error(n),this.finish(1006,"",!1))}}finish(e,s,t){this.closed||(this.closed=!0,this.s.close(),this.h.close(e,s,t))}sendFrame(e,s){return this.s.write(D(e,s))}async send(e){this.closed||this.closeSent||await this.sendFrame(typeof e=="string"?1:2,typeof e=="string"?S.encode(e):new Uint8Array(e))}async close(e=1e3,s=""){if(this.closed||this.closeSent)return;this.closeSent=!0;const t=S.encode(s).subarray(0,123),n=new Uint8Array(2+t.length);n[0]=e>>8,n[1]=e&255,n.set(t,2),await this.sendFrame(8,n).catch(()=>{}),setTimeout(()=>this.finish(e,s,!0),3e3)}abort(){this.finish(1006,"",!1)}}function $(l,e){return`
<script>
(function() {
  var PORT = ${l};
  var PREFIX = ${e?JSON.stringify(e):"null"};
  var P = 'p' + Math.random().toString(36).slice(2) + '_';
  var seq = 0, streams = {}, sockets = {};
  var parentWin = window.parent;
  function post(m, transfer) { parentWin.postMessage(m, '*', transfer || []); }
  // {port, path} for a URL the in-tab servers answer, else null
  function local(u) {
    u = String(u);
    if (PREFIX !== null) {
      var abs;
      try { abs = new URL(u, location.href); } catch (x) { return null; }
      if (abs.host === location.host && abs.protocol.replace(/^ws/, 'http') === location.protocol) {
        var p = abs.pathname;
        if (p === PREFIX || p.indexOf(PREFIX + '/') === 0) p = p.slice(PREFIX.length) || '/';
        return { port: PORT, path: p + abs.search };
      }
      u = abs.href;
    }
    if (/^(\\/(?!\\/)|\\.\\.?\\/)/.test(u)) return { port: PORT, path: u };
    var m = /^(https?|wss?):\\/\\/([^\\/?#]*)(.*)$/i.exec(u);
    if (!m) return null;
    var hm = /^(\\[[^\\]]*\\]|[^:]*)(?::(\\d+))?$/.exec(m[2]);
    if (!hm) return null;
    var host = hm[1].toLowerCase();
    if (host !== '' && host !== 'localhost' && host !== '127.0.0.1' && host !== '0.0.0.0' && host !== '[::1]') return null;
    var port = hm[2] ? +hm[2] : (host === '' ? PORT : (/^(https|wss)/i.test(m[1]) ? 443 : 80));
    return { port: port, path: m[3] || '/' };
  }
  window.addEventListener('message', function(e) {
    var d = e.data;
    if (!d || typeof d.type !== 'string' || d.type.indexOf('vfs-') !== 0) return;
    if (d.type === 'vfs-ws-event') { var w = sockets[d.id]; if (w) w._event(d); return; }
    var s = streams[d.id];
    if (!s) return;
    if (d.type === 'vfs-stream-head') s.head(d);
    else if (d.type === 'vfs-stream-chunk') { try { s.ctrl.enqueue(new Uint8Array(d.chunk)); } catch (x) {} }
    else if (d.type === 'vfs-stream-end') { delete streams[d.id]; try { s.ctrl.close(); } catch (x) {} }
    else if (d.type === 'vfs-stream-error') { delete streams[d.id]; s.fail(new TypeError('Failed to fetch: ' + d.message)); }
  });

  // ── fetch, streamed ──
  function bodyOf(b) {
    if (b == null) return Promise.resolve(null);
    if (typeof b === 'string') return Promise.resolve(b);
    if (b instanceof ArrayBuffer) return Promise.resolve(new Uint8Array(b.slice(0)));
    if (ArrayBuffer.isView(b)) return Promise.resolve(new Uint8Array(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)));
    if (b instanceof URLSearchParams) return Promise.resolve(b.toString());
    return new Response(b).arrayBuffer().then(function(a) { return new Uint8Array(a); });
  }
  function streamFetch(t, init) {
    init = init || {};
    var headers = {};
    if (init.headers) new Headers(init.headers).forEach(function(v, k) { headers[k] = v; });
    if (init.body instanceof URLSearchParams && !headers['content-type']) headers['content-type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
    return bodyOf(init.body).then(function(body) {
      return new Promise(function(resolve, reject) {
        var id = P + (++seq), ctrl, started = false;
        var rs = new ReadableStream({
          start: function(c) { ctrl = c; },
          cancel: function() { delete streams[id]; post({ type: 'vfs-stream-cancel', id: id }); }
        });
        streams[id] = {
          get ctrl() { return ctrl; },
          head: function(d) {
            started = true;
            var nobody = d.status === 204 || d.status === 205 || d.status === 304 || (init.method || 'GET').toUpperCase() === 'HEAD';
            var r = new Response(nobody ? null : rs, { status: d.status < 200 ? 200 : d.status, statusText: d.statusText || '', headers: d.headers || {} });
            try { Object.defineProperty(r, 'url', { value: t.url }); } catch (x) {}
            resolve(r);
          },
          fail: function(err) { if (started) { try { ctrl.error(err); } catch (x) {} } else reject(err); }
        };
        if (init.signal) {
          if (init.signal.aborted) { delete streams[id]; reject(new DOMException('The operation was aborted.', 'AbortError')); return; }
          init.signal.addEventListener('abort', function() {
            if (!streams[id]) return;
            delete streams[id];
            post({ type: 'vfs-stream-cancel', id: id });
            var err = new DOMException('The operation was aborted.', 'AbortError');
            if (started) { try { ctrl.error(err); } catch (x) {} } else reject(err);
          });
        }
        post({ type: 'vfs-stream-fetch', id: id, port: t.port, url: t.path, method: (init.method || 'GET').toUpperCase(), headers: headers, body: body });
      });
    });
  }
  var baseFetch = window.fetch;
  window.fetch = function(input, init) {
    var u = typeof input === 'string' ? input : input instanceof URL ? input.href : (input && input.url) || String(input);
    var t = local(u);
    if (!t) return baseFetch.apply(this, arguments);
    t.url = u;
    if (input && typeof input === 'object' && !(input instanceof URL) && input.method) {
      init = Object.assign({ method: input.method, headers: input.headers, signal: input.signal }, init || {});
      if (!init.body && input.method !== 'GET' && input.method !== 'HEAD') return input.arrayBuffer().then(function(b) { init.body = b; return streamFetch(t, init); });
    }
    return streamFetch(t, init);
  };

  // ── XMLHttpRequest (socket.io-client long-polls with it) ──
  var BaseXHR = window.XMLHttpRequest;
  var XHR_EVENTS = ['readystatechange', 'loadstart', 'progress', 'load', 'error', 'abort', 'timeout', 'loadend'];
  function LocalXHR() {
    var x = this;
    x._et = new EventTarget(); x._real = null; x._headers = {}; x._resHeaders = {};
    x.readyState = 0; x.status = 0; x.statusText = ''; x.response = ''; x.responseText = ''; x.responseURL = '';
    x.responseType = ''; x.timeout = 0; x.withCredentials = false; x.upload = new EventTarget();
  }
  LocalXHR.UNSENT = 0; LocalXHR.OPENED = 1; LocalXHR.HEADERS_RECEIVED = 2; LocalXHR.LOADING = 3; LocalXHR.DONE = 4;
  LocalXHR.prototype = {
    constructor: LocalXHR, UNSENT: 0, OPENED: 1, HEADERS_RECEIVED: 2, LOADING: 3, DONE: 4,
    addEventListener: function(t, f, o) { this._et.addEventListener(t, f, o); },
    removeEventListener: function(t, f, o) { this._et.removeEventListener(t, f, o); },
    dispatchEvent: function(e) { return this._et.dispatchEvent(e); },
    _fire: function(t) {
      var e = t === 'readystatechange' ? new Event(t) : new ProgressEvent(t);
      var h = this['on' + t];
      if (typeof h === 'function') h.call(this, e);
      this._et.dispatchEvent(e);
    },
    open: function(method, url) {
      var t = local(url);
      if (!t) {
        // Not ours: a real XHR does it all; its events and state are mirrored here
        var x = this, r = this._real = new BaseXHR();
        XHR_EVENTS.forEach(function(ev) {
          r.addEventListener(ev, function() {
            ['readyState', 'status', 'statusText', 'responseURL'].forEach(function(k) { x[k] = r[k]; });
            if (r.readyState === 4 || ev === 'progress') { try { x.response = r.response; } catch (e) {} try { x.responseText = r.responseText; } catch (e) {} }
            x._fire(ev);
          });
        });
        r.upload = r.upload; this.upload = r.upload;
        return r.open.apply(r, arguments);
      }
      this._t = t; this._method = String(method || 'GET').toUpperCase(); this._url = url;
      this.readyState = 1; this._fire('readystatechange');
    },
    setRequestHeader: function(k, v) { if (this._real) return this._real.setRequestHeader(k, v); this._headers[k] = v; },
    overrideMimeType: function(m) { if (this._real) this._real.overrideMimeType(m); },
    getResponseHeader: function(k) { if (this._real) return this._real.getResponseHeader(k); var v = this._resHeaders[String(k).toLowerCase()]; return v === undefined ? null : v; },
    getAllResponseHeaders: function() { if (this._real) return this._real.getAllResponseHeaders(); var h = this._resHeaders; return Object.keys(h).map(function(k) { return k + ': ' + h[k] + '\\r\\n'; }).join(''); },
    abort: function() {
      if (this._real) return this._real.abort();
      if (this._ac) this._ac.abort();
      if (this.readyState > 0 && this.readyState < 4) { this.readyState = 4; this._fire('readystatechange'); this._fire('abort'); this._fire('loadend'); }
      this.readyState = 0;
    },
    send: function(body) {
      var x = this;
      if (x._real) { ['timeout', 'withCredentials', 'responseType'].forEach(function(k) { try { x._real[k] = x[k]; } catch (e) {} }); return x._real.send(body); }
      x._ac = new AbortController();
      var timer = x.timeout ? setTimeout(function() { x._ac.abort(); x.readyState = 4; x._fire('readystatechange'); x._fire('timeout'); x._fire('loadend'); }, x.timeout) : 0;
      x._fire('loadstart');
      var t = Object.assign({ url: x._url }, x._t);
      streamFetch(t, { method: x._method, headers: x._headers, body: x._method === 'GET' || x._method === 'HEAD' ? null : body, signal: x._ac.signal }).then(function(r) {
        x.status = r.status; x.statusText = r.statusText; x.responseURL = x._url;
        r.headers.forEach(function(v, k) { x._resHeaders[k] = v; });
        x.readyState = 2; x._fire('readystatechange');
        x.readyState = 3; x._fire('readystatechange');
        return r.arrayBuffer();
      }).then(function(buf) {
        clearTimeout(timer);
        var text = '';
        if (x.responseType === '' || x.responseType === 'text' || x.responseType === 'json') text = new TextDecoder().decode(buf);
        if (x.responseType === 'arraybuffer') x.response = buf;
        else if (x.responseType === 'blob') x.response = new Blob([buf], { type: x._resHeaders['content-type'] || '' });
        else if (x.responseType === 'json') { try { x.response = JSON.parse(text); } catch (e) { x.response = null; } }
        else { x.response = text; x.responseText = text; }
        x.readyState = 4; x._fire('readystatechange'); x._fire('progress'); x._fire('load'); x._fire('loadend');
      }, function(err) {
        clearTimeout(timer);
        if (err && err.name === 'AbortError') return;
        x.readyState = 4; x.status = 0; x._fire('readystatechange'); x._fire('error'); x._fire('loadend');
      });
    }
  };
  window.XMLHttpRequest = LocalXHR;

  // ── EventSource ──
  var BaseES = window.EventSource;
  function LocalES(url, opts) {
    var t = local(url);
    if (!t && BaseES) return new BaseES(url, opts);
    var es = this;
    es._et = new EventTarget(); es.url = String(url); es.withCredentials = !!(opts && opts.withCredentials);
    es.readyState = 0; es._retry = 3000; es._last = ''; es._t = t;
    setTimeout(function() { es._connect(); }, 0);
  }
  LocalES.CONNECTING = 0; LocalES.OPEN = 1; LocalES.CLOSED = 2;
  LocalES.prototype = {
    constructor: LocalES, CONNECTING: 0, OPEN: 1, CLOSED: 2,
    addEventListener: function(t, f, o) { this._et.addEventListener(t, f, o); },
    removeEventListener: function(t, f, o) { this._et.removeEventListener(t, f, o); },
    dispatchEvent: function(e) { return this._et.dispatchEvent(e); },
    _fire: function(e) { var h = this['on' + e.type]; if (typeof h === 'function') h.call(this, e); this._et.dispatchEvent(e); },
    close: function() { this.readyState = 2; if (this._ac) this._ac.abort(); clearTimeout(this._timer); },
    _again: function() {
      var es = this;
      if (es.readyState === 2) return;
      es.readyState = 0; es._fire(new Event('error'));
      es._timer = setTimeout(function() { es._connect(); }, es._retry);
    },
    _connect: function() {
      var es = this;
      if (es.readyState === 2) return;
      es._ac = new AbortController();
      var headers = { accept: 'text/event-stream', 'cache-control': 'no-cache' };
      if (es._last) headers['last-event-id'] = es._last;
      streamFetch(Object.assign({ url: es.url }, es._t), { headers: headers, signal: es._ac.signal }).then(function(r) {
        if (es.readyState === 2) return;
        if (r.status !== 200 || !/^text\\/event-stream/i.test(r.headers.get('content-type') || '')) {
          es.readyState = 2; es._fire(new Event('error')); return;
        }
        es.readyState = 1; es._fire(new Event('open'));
        var reader = r.body.getReader(), dec = new TextDecoder(), buf = '', data = [], type = '', id = null;
        function line(l) {
          if (l === '') {
            if (id !== null) es._last = id;
            if (data.length) es._fire(new MessageEvent(type || 'message', { data: data.join('\\n'), lastEventId: es._last, origin: location.origin }));
            data = []; type = ''; id = null; return;
          }
          if (l[0] === ':') return;
          var c = l.indexOf(':'), f = c < 0 ? l : l.slice(0, c), v = c < 0 ? '' : l.slice(c + 1);
          if (v[0] === ' ') v = v.slice(1);
          if (f === 'data') data.push(v);
          else if (f === 'event') type = v;
          else if (f === 'id' && v.indexOf('\\0') < 0) id = v;
          else if (f === 'retry' && /^\\d+$/.test(v)) es._retry = +v;
        }
        (function pump() {
          reader.read().then(function(x) {
            if (x.done) { es._again(); return; }
            buf += dec.decode(x.value, { stream: true });
            var m;
            while ((m = /\\r\\n|\\r|\\n/.exec(buf))) {
              if (m[0] === '\\r' && m.index === buf.length - 1) break; // a \\r\\n split across chunks
              line(buf.slice(0, m.index)); buf = buf.slice(m.index + m[0].length);
            }
            pump();
          }, function() { es._again(); });
        })();
      }, function(err) { if (!err || err.name !== 'AbortError') es._again(); });
    }
  };
  window.EventSource = LocalES;

  // ── WebSocket ──
  var BaseWS = window.WebSocket;
  function LocalWS(url, protocols) {
    var t = local(url);
    if (!t) return protocols === undefined ? new BaseWS(url) : new BaseWS(url, protocols);
    var ws = this;
    ws._et = new EventTarget(); ws.url = String(url); ws.readyState = 0; ws.protocol = ''; ws.extensions = '';
    ws.bufferedAmount = 0; ws.binaryType = 'blob';
    ws._id = P + (++seq); sockets[ws._id] = ws;
    var list = protocols === undefined ? [] : typeof protocols === 'string' ? [protocols] : Array.prototype.slice.call(protocols);
    post({ type: 'vfs-ws-open', id: ws._id, port: t.port, path: t.path, protocols: list });
  }
  LocalWS.CONNECTING = 0; LocalWS.OPEN = 1; LocalWS.CLOSING = 2; LocalWS.CLOSED = 3;
  LocalWS.prototype = {
    constructor: LocalWS, CONNECTING: 0, OPEN: 1, CLOSING: 2, CLOSED: 3,
    addEventListener: function(t, f, o) { this._et.addEventListener(t, f, o); },
    removeEventListener: function(t, f, o) { this._et.removeEventListener(t, f, o); },
    dispatchEvent: function(e) { return this._et.dispatchEvent(e); },
    _fire: function(e) { var h = this['on' + e.type]; if (typeof h === 'function') h.call(this, e); this._et.dispatchEvent(e); },
    send: function(data) {
      if (this.readyState === 0) throw new DOMException("Failed to execute 'send' on 'WebSocket': Still in CONNECTING state.", 'InvalidStateError');
      if (this.readyState !== 1) return;
      var id = this._id;
      if (typeof data === 'string') post({ type: 'vfs-ws-send', id: id, data: data });
      else if (data instanceof Blob) data.arrayBuffer().then(function(b) { post({ type: 'vfs-ws-send', id: id, data: b }, [b]); });
      else {
        var b = data instanceof ArrayBuffer ? data.slice(0) : data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
        post({ type: 'vfs-ws-send', id: id, data: b }, [b]);
      }
    },
    close: function(code, reason) {
      if (this.readyState >= 2) return;
      this.readyState = 2;
      post({ type: 'vfs-ws-close', id: this._id, code: code, reason: reason });
    },
    _event: function(d) {
      if (d.kind === 'open') { this.readyState = 1; this.protocol = d.protocol || ''; this.extensions = d.extensions || ''; this._fire(new Event('open')); }
      else if (d.kind === 'message') {
        var data = d.data;
        if (typeof data !== 'string' && this.binaryType === 'blob') data = new Blob([data]);
        this._fire(new MessageEvent('message', { data: data, origin: 'ws://localhost:' + PORT }));
      }
      else if (d.kind === 'error') this._fire(new Event('error'));
      else if (d.kind === 'close') {
        delete sockets[this._id];
        this.readyState = 3;
        this._fire(new CloseEvent('close', { code: d.code, reason: d.reason || '', wasClean: !!d.wasClean }));
      }
    }
  };
  window.WebSocket = LocalWS;
})();
<\/script>`}const L=new TextEncoder;function j(l,e=window){const s=e;if(s.__vfsStreamProxy)return;s.__vfsStreamProxy=!0;const t=new Map,n=new Map;e.addEventListener("message",async o=>{const r=o.data;if(!r||typeof r.type!="string"||!r.type.startsWith("vfs-"))return;const i=o.source;if(!i)return;const a=(c,d=[])=>{try{i.postMessage(c,"*",d)}catch{}};if(r.type==="vfs-stream-fetch"){try{const c=await l.fetch(r.port,r.url,{method:r.method,headers:r.headers,body:r.body});a({type:"vfs-stream-head",id:r.id,status:c.status??200,statusText:c.statusText??"",headers:c.headers??{}});const d=c.body;if(d instanceof ReadableStream){const p=d.getReader();t.set(r.id,p);try{for(let h=await p.read();!h.done;h=await p.read()){const f=h.value.slice().buffer;a({type:"vfs-stream-chunk",id:r.id,chunk:f},[f])}a({type:"vfs-stream-end",id:r.id})}catch(h){a({type:"vfs-stream-error",id:r.id,message:String(h?.message??h)})}finally{t.delete(r.id)}return}const u=d==null?new Uint8Array(0):typeof d=="string"?L.encode(d):d instanceof Uint8Array?d.slice():L.encode(JSON.stringify(d));u.length&&a({type:"vfs-stream-chunk",id:r.id,chunk:u.buffer},[u.buffer]),a({type:"vfs-stream-end",id:r.id})}catch(c){a({type:"vfs-stream-error",id:r.id,message:String(c?.message??c)})}return}if(r.type==="vfs-stream-cancel"){t.get(r.id)?.cancel().catch(()=>{}),t.delete(r.id);return}if(r.type==="vfs-ws-open"){const c=(f,y)=>a({type:"vfs-ws-event",id:r.id,...f},y);let d;try{d=l.connect(r.port)}catch{c({kind:"error"}),c({kind:"close",code:1006,reason:"",wasClean:!1});return}let u=!1;const p=new M(d,{open:(f,y)=>c({kind:"open",protocol:f,extensions:y}),message:f=>typeof f=="string"?c({kind:"message",data:f}):c({kind:"message",data:f},[f]),close:(f,y,m)=>{u||(u=!0,n.delete(r.id),c({kind:"close",code:f,reason:y,wasClean:m}))},error:()=>c({kind:"error"})});n.set(r.id,p);const h=new URL(`ws://localhost:${r.port}${r.path.startsWith("/")?r.path:"/"+r.path}`);p.run(h,[["Origin",`http://localhost:${r.port}`]],r.protocols??[]).catch(()=>{d.close(),!u&&(u=!0,n.delete(r.id),c({kind:"error"}),c({kind:"close",code:1006,reason:"",wasClean:!1}))});return}if(r.type==="vfs-ws-send"){n.get(r.id)?.send(r.data);return}r.type==="vfs-ws-close"&&n.get(r.id)?.close(r.code??1e3,r.reason??"")})}class F{servers=new Map;defaultContainer=null;resourceProxySetup=!1;portListeners=new Set;onPortChange(e){return this.portListeners.add(e),()=>{this.portListeners.delete(e)}}emitPort(e,s){U(()=>{for(const t of this.portListeners)try{t(e,s)}catch{}})}setDefaultContainer(e){this.defaultContainer=e}serve(e,s,t,n){if(this.servers.has(e))throw new Error(`Port ${e} already in use`);return this.servers.set(e,{port:e,handler:s,name:t,connect:n?.connect}),console.log(`[IframeServer] Server "${t||"unnamed"}" listening on port ${e}`),this.emitPort(e,!0),()=>this.close(e)}connect(e){const s=this.servers.get(e);if(!s)throw new Error(`ECONNREFUSED: no server listening on port ${e}`);if(!s.connect)throw new Error(`ECONNREFUSED: the server on port ${e} takes no connections`);const[t,n]=C();return s.connect(n),t}async fetch(e,s="/",t){const n=this.servers.get(e);if(!n)return{status:404,body:`No server listening on port ${e}`};const o=s.indexOf("#"),r=o>=0?s.substring(0,o):s;let i=r,a={};const c=r.indexOf("?");c>=0&&(i=r.substring(0,c),new URLSearchParams(r.substring(c+1)).forEach((h,f)=>{a[f]=h}));const d={...t?.headers||{}};Object.keys(d).some(p=>p.toLowerCase()==="host")||(d.host=`localhost:${e}`);const u={method:t?.method||"GET",path:i,headers:d,body:t?.body||null,query:a};try{return await n.handler(u)}catch(p){return{status:500,body:p instanceof Error?p.message:"Internal server error"}}}async createIframe(e,s,t){const n=s||this.defaultContainer;if(!n)throw new Error("No container specified and no default container set");const o=this.servers.get(e);if(!o)throw new Error(`No server listening on port ${e}`);const r=t?.path||"/",i=await this.fetch(e,r),a=document.createElement("iframe");a.setAttribute("data-virtual-port",String(e)),a.setAttribute("data-virtual-path",r),a.style.border="none",a.style.background="#fff",a.style.width=t?.width||"100%",a.style.height=t?.height||"400px",a.style.visibility="visible",a.style.opacity="1",a.style.display="block",t?.style&&Object.assign(a.style,t.style);let c;typeof i.body=="string"?c=i.body:i.body instanceof Uint8Array?c=new TextDecoder().decode(i.body):i.body&&typeof i.body=="object"?c=`<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>JSON</title></head>
<body><pre>${JSON.stringify(i.body,null,2)}</pre></body>
</html>`:c="<!DOCTYPE html><html><body></body></html>",this.ensureResourceProxy();const d=`
<script>
(function() {
  var PORT = ${e};
  var pendingResources = new Map();
  var resourceId = 0;

  // Listen for resource responses from parent
  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'vfs-resource-response' && e.data.id) {
      var pending = pendingResources.get(e.data.id);
      if (pending) {
        pendingResources.delete(e.data.id);
        pending.resolve(e.data);
      }
    }
  });

  // Request resource from parent
  function fetchFromParent(url, options) {
    return new Promise(function(resolve, reject) {
      var id = 'res_' + (++resourceId);
      pendingResources.set(id, { resolve: resolve, reject: reject });
      window.parent.postMessage({
        type: 'vfs-fetch',
        id: id,
        port: PORT,
        url: url,
        method: (options && options.method) || 'GET',
        headers: options && options.headers,
        body: options && options.body
      }, '*');
      // Timeout after 30s
      setTimeout(function() {
        if (pendingResources.has(id)) {
          pendingResources.delete(id);
          reject(new Error('Resource fetch timeout: ' + url));
        }
      }, 30000);
    });
  }

  // Override fetch
  var originalFetch = window.fetch;
  window.fetch = function(url, options) {
    var urlStr = typeof url === 'string' ? url : url.toString();
    if (urlStr.startsWith('/') || urlStr.startsWith('./') || urlStr.startsWith('../')) {
      return fetchFromParent(urlStr, options).then(function(data) {
        return new Response(data.body, {
          status: data.status || 200,
          headers: data.headers || {}
        });
      });
    }
    return originalFetch.apply(this, arguments);
  };

  // Override XMLHttpRequest
  var OrigXHR = window.XMLHttpRequest;
  window.XMLHttpRequest = function() {
    var xhr = new OrigXHR();
    var openArgs = null;
    var origOpen = xhr.open;
    xhr.open = function(method, url) {
      openArgs = { method: method, url: url };
      if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
        // Will intercept in send()
      }
      return origOpen.apply(xhr, arguments);
    };
    var origSend = xhr.send;
    xhr.send = function(body) {
      if (openArgs && (openArgs.url.startsWith('/') || openArgs.url.startsWith('./') || openArgs.url.startsWith('../'))) {
        fetchFromParent(openArgs.url, { method: openArgs.method, body: body }).then(function(data) {
          Object.defineProperty(xhr, 'status', { value: data.status || 200 });
          Object.defineProperty(xhr, 'responseText', { value: data.body || '' });
          Object.defineProperty(xhr, 'response', { value: data.body || '' });
          Object.defineProperty(xhr, 'readyState', { value: 4 });
          if (xhr.onload) xhr.onload();
          if (xhr.onreadystatechange) xhr.onreadystatechange();
        }).catch(function(err) {
          if (xhr.onerror) xhr.onerror(err);
        });
        return;
      }
      return origSend.apply(xhr, arguments);
    };
    return xhr;
  };

  // Intercept dynamically added elements
  function loadResourceViaParent(el, attr, type) {
    var url = el.getAttribute(attr);
    if (!url || url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('http://') || url.startsWith('https://')) {
      return;
    }
    el.removeAttribute(attr);
    fetchFromParent(url, { method: 'GET' }).then(function(data) {
      if (type === 'css') {
        var style = document.createElement('style');
        style.textContent = data.body || '';
        el.parentNode.replaceChild(style, el);
      } else if (type === 'js') {
        el.textContent = data.body || '';
      } else if (type === 'img') {
        el.src = 'data:image/png;base64,' + btoa(data.body || '');
      }
    }).catch(function(err) {
      console.error('Failed to load resource:', url, err);
    });
  }

  // MutationObserver for dynamic elements
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(m) {
      m.addedNodes.forEach(function(node) {
        if (node.nodeType !== 1) return;
        if (node.tagName === 'SCRIPT' && node.src) loadResourceViaParent(node, 'src', 'js');
        if (node.tagName === 'LINK' && node.rel === 'stylesheet') loadResourceViaParent(node, 'href', 'css');
        if (node.tagName === 'IMG' && node.src) loadResourceViaParent(node, 'src', 'img');
      });
    });
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  // Load deferred resources (converted from href/src to data-vfs-href/data-vfs-src)
  function loadDeferredResources() {
    // Load deferred stylesheets
    document.querySelectorAll('link[data-vfs-href]').forEach(function(link) {
      var href = link.getAttribute('data-vfs-href');
      link.removeAttribute('data-vfs-href');
      fetchFromParent(href, { method: 'GET' }).then(function(data) {
        var style = document.createElement('style');
        style.textContent = data.body || '';
        link.parentNode.replaceChild(style, link);
      }).catch(function(err) {
        console.error('Failed to load stylesheet:', href, err);
      });
    });

    // Load deferred scripts
    document.querySelectorAll('script[data-vfs-src]').forEach(function(script) {
      var src = script.getAttribute('data-vfs-src');
      script.removeAttribute('data-vfs-src');
      fetchFromParent(src, { method: 'GET' }).then(function(data) {
        var newScript = document.createElement('script');
        newScript.textContent = data.body || '';
        script.parentNode.replaceChild(newScript, script);
      }).catch(function(err) {
        console.error('Failed to load script:', src, err);
      });
    });

    // Recursively resolve ES module imports and convert to blob URLs
    var blobCache = {};  // Cache: original path -> blob URL
    var pendingModules = {};  // Prevent circular dependency infinite loops

    function resolveModulePath(base, relative) {
      if (relative.startsWith('/')) return relative;
      var baseParts = base.split('/').slice(0, -1);
      var relParts = relative.split('/');
      for (var i = 0; i < relParts.length; i++) {
        if (relParts[i] === '..') baseParts.pop();
        else if (relParts[i] !== '.') baseParts.push(relParts[i]);
      }
      return '/' + baseParts.filter(Boolean).join('/');
    }

    function extractImports(code) {
      var imports = [];
      // Match: import ... from "..." or import ... from '...'
      // Also match: import "..." or import '...' (side-effect imports)
      // Also match: export ... from "..."
      // Capture paths starting with ./ ../ or / (but not http:// https://)
      var regex = /(?:import|export)\\s+(?:[^'"]*\\s+from\\s+)?['"]([^'"]+)['"]|import\\s*\\(\\s*['"]([^'"]+)['"]\\s*\\)/g;
      var match;
      while ((match = regex.exec(code)) !== null) {
        var path = match[1] || match[2];
        if (path && (path.startsWith('./') || path.startsWith('../') || (path.startsWith('/') && !path.startsWith('//')))) {
          imports.push(path);
        }
      }
      return imports;
    }

    function loadModuleRecursive(modulePath) {
      // Return cached blob URL if available
      if (blobCache[modulePath]) {
        return Promise.resolve(blobCache[modulePath]);
      }
      // Prevent circular dependencies
      if (pendingModules[modulePath]) {
        return pendingModules[modulePath];
      }

      var promise = fetchFromParent(modulePath, { method: 'GET' }).then(function(data) {
        var code = data.body || '';
        var imports = extractImports(code);

        if (imports.length === 0) {
          // No imports - just create blob URL
          var blob = new Blob([code], { type: 'application/javascript' });
          var blobUrl = URL.createObjectURL(blob);
          blobCache[modulePath] = blobUrl;
          return blobUrl;
        }

        // Recursively resolve all imports
        var importPromises = imports.map(function(imp) {
          var resolvedPath = resolveModulePath(modulePath, imp);
          return loadModuleRecursive(resolvedPath).then(function(blobUrl) {
            return { original: imp, blobUrl: blobUrl };
          });
        });

        return Promise.all(importPromises).then(function(resolved) {
          // Rewrite imports to use blob URLs via simple string replacement
          var rewrittenCode = code;
          resolved.forEach(function(r) {
            // Replace both single and double quoted versions
            rewrittenCode = rewrittenCode.split('"' + r.original + '"').join('"' + r.blobUrl + '"');
            rewrittenCode = rewrittenCode.split("'" + r.original + "'").join("'" + r.blobUrl + "'");
          });

          var blob = new Blob([rewrittenCode], { type: 'application/javascript' });
          var blobUrl = URL.createObjectURL(blob);
          blobCache[modulePath] = blobUrl;
          return blobUrl;
        });
      });

      pendingModules[modulePath] = promise;
      return promise;
    }

    // Load deferred ES module scripts using recursive blob URL resolution
    document.querySelectorAll('script[data-vfs-module-src]').forEach(function(script) {
      var src = script.getAttribute('data-vfs-module-src');
      script.removeAttribute('data-vfs-module-src');
      loadModuleRecursive(src).then(function(blobUrl) {
        var newScript = document.createElement('script');
        newScript.type = 'module';
        newScript.src = blobUrl;
        script.parentNode.replaceChild(newScript, script);
      }).catch(function(err) {
        console.error('Failed to load module:', src, err);
      });
    });
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadDeferredResources);
  } else {
    loadDeferredResources();
  }
})();
<\/script>`,u=`
<script>
(function() {
  // Auto-reload: listen for shiro-reload from parent (build --watch)
  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'shiro-reload') {
      location.reload();
    }
  });

  // Intercept link clicks for virtual navigation
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href]');
    if (link && link.href) {
      const href = link.getAttribute('href');
      // Only intercept relative and same-origin links
      if (href && !href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('//')) {
        e.preventDefault();
        window.parent.postMessage({
          type: 'virtual-navigate',
          port: ${e},
          path: href
        }, '*');
      }
    }
  });

  // Intercept form submissions
  document.addEventListener('submit', function(e) {
    const form = e.target;
    if (form.tagName === 'FORM') {
      e.preventDefault();
      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => data[key] = value);
      window.parent.postMessage({
        type: 'virtual-submit',
        port: ${e},
        path: form.getAttribute('action') || '/',
        method: form.method || 'GET',
        data: data
      }, '*');
    }
  });
})();
<\/script>
`;o.resourceInterceptorScript=d,o.navigationScript=u,c=this.prepareHtmlForIframe(c,d,u,e),a.srcdoc=c,o.iframe=a,n.appendChild(a);const p=async h=>{if(h.source===a.contentWindow){if(h.data?.type==="virtual-navigate"&&h.data?.port===e)await this.navigateIframe(e,h.data.path);else if(h.data?.type==="virtual-submit"&&h.data?.port===e){const f=await this.fetch(e,h.data.path,{method:h.data.method,body:JSON.stringify(h.data.data)});if(typeof f.body=="string"){let y=f.body;y.includes("</body>")&&(y=y.replace("</body>",u+"</body>")),a.srcdoc=y}}}};return window.addEventListener("message",p),a._messageHandler=p,a}prepareHtmlForIframe(e,s,t,n){return n!==void 0&&(s+=$(n)),e=e.replace(/<link([^>]*)\shref=(["'])([^"']+)\2/gi,(o,r,i,a)=>a.startsWith("/")||a.startsWith("./")||a.startsWith("../")?`<link${r} data-vfs-href=${i}${a}${i}`:o),e=e.replace(/<script([^>]*)\ssrc=(["'])([^"']+)\2/gi,(o,r,i,a)=>a.startsWith("/")||a.startsWith("./")||a.startsWith("../")?r.includes('type="module"')||r.includes("type='module'")?`<script${r} data-vfs-module-src=${i}${a}${i}`:`<script${r} data-vfs-src=${i}${a}${i}`:o),e.includes("<head>")?e=e.replace("<head>","<head>"+s):e.includes("<html>")?e=e.replace("<html>","<html><head>"+s+"</head>"):e=s+e,e.includes("</body>")?e=e.replace("</body>",t+"</body>"):e.includes("</html>")?e=e.replace("</html>",t+"</html>"):e+=t,e}async navigateIframe(e,s){const t=this.servers.get(e);if(!t?.iframe)throw new Error(`No iframe for port ${e}`);if(t.iframe.hasAttribute("data-preview-sw")){const{previewUrl:r}=await import("./preview-sw-host-PLO-VNKL.js"),i=await r(e,s);if(i){t.iframe.setAttribute("data-virtual-path",s),t.iframe.src=i;return}}const n=await this.fetch(e,s);let o;typeof n.body=="string"?o=n.body:n.body instanceof Uint8Array?o=new TextDecoder().decode(n.body):o=`<pre>${JSON.stringify(n.body,null,2)}</pre>`,t.resourceInterceptorScript&&t.navigationScript&&(o=this.prepareHtmlForIframe(o,t.resourceInterceptorScript,t.navigationScript,e)),t.iframe.setAttribute("data-virtual-path",s),t.iframe.srcdoc=o}broadcastReload(e){const s=e!==void 0?[this.servers.get(e)].filter(Boolean):Array.from(this.servers.values());for(const t of s)if(t?.iframe?.contentWindow&&t.iframe.hasAttribute("data-preview-sw"))try{t.iframe.contentWindow.location.reload()}catch{}else t?.iframe?.contentWindow&&t.iframe.contentWindow.postMessage({type:"shiro-reload"},"*")}close(e){const s=this.servers.get(e);if(s){if(s.iframe){const t=s.iframe._messageHandler;t&&window.removeEventListener("message",t),s.iframe.remove()}this.servers.delete(e),console.log(`[IframeServer] Server on port ${e} closed`),this.emitPort(e,!1)}}list(){return Array.from(this.servers.values()).map(e=>({port:e.port,name:e.name,hasIframe:!!e.iframe}))}isPortInUse(e){return this.servers.has(e)}ensureResourceProxy(){this.resourceProxySetup||(this.resourceProxySetup=!0,j(this),window.addEventListener("message",async e=>{if(e.data?.type!=="vfs-fetch")return;const{id:s,port:t,url:n,method:o,headers:r,body:i}=e.data,a=e.source;try{const c=await this.fetch(t,n,{method:o||"GET",headers:r||{},body:i||null});let d;typeof c.body=="string"?d=c.body:c.body instanceof Uint8Array?d=new TextDecoder().decode(c.body):c.body instanceof ReadableStream?d=await new Response(c.body).text():c.body?d=JSON.stringify(c.body):d="",a.postMessage({type:"vfs-resource-response",id:s,status:c.status||200,headers:c.headers||{},body:d},"*")}catch(c){a.postMessage({type:"vfs-resource-response",id:s,status:500,body:`Error fetching resource: ${c}`},"*")}}),console.log("[IframeServer] Resource proxy enabled"))}getServer(e){return this.servers.get(e)}cleanup(){console.log("[IframeServer] cleanup() called, closing",this.servers.size,"servers");for(const[e]of this.servers)this.close(e);console.log("[IframeServer] All servers cleaned up")}}const T=typeof window<"u"&&window.__iframeServer?.serve?window.__iframeServer:new F;function O(l,e,s){const t=s?.index||["index.html","index.htm"],n={".html":"text/html",".htm":"text/html",".css":"text/css",".js":"text/javascript",".mjs":"text/javascript",".json":"application/json",".png":"image/png",".jpg":"image/jpeg",".jpeg":"image/jpeg",".gif":"image/gif",".svg":"image/svg+xml",".ico":"image/x-icon",".woff":"font/woff",".woff2":"font/woff2",".ttf":"font/ttf",".txt":"text/plain",".md":"text/markdown",...s?.mimeTypes};return async o=>{let r=e+(o.path==="/"?"":o.path);try{if((await l.stat(r))?.isDirectory())for(const c of t){const d=r+(r.endsWith("/")?"":"/")+c;try{const u=await l.stat(d);if(u&&!u.isDirectory()){r=d;break}}catch{}}}catch{}if(!r.substring(r.lastIndexOf("/")+1).includes("."))try{const a=r+".html",c=await l.stat(a);c&&!c.isDirectory()&&(r=a)}catch{}try{const a=await l.readFile(r),c=r.substring(r.lastIndexOf(".")),d=n[c]||"application/octet-stream";return{status:200,contentType:d,headers:{"Content-Type":d},body:a}}catch{return{status:404,contentType:"text/html",body:`<!DOCTYPE html>
<html>
<head><title>404 Not Found</title></head>
<body>
<h1>404 Not Found</h1>
<p>The requested path "${o.path}" was not found.</p>
</body>
</html>`}}}}function A(){const l=[];function e(t,n,o){const r=[],i=new RegExp("^"+n.replace(/:(\w+)/g,(a,c)=>(r.push(c),"([^/]+)"))+"$");l.push({method:t,pattern:i,keys:r,handler:o})}const s={get:(t,n)=>e("GET",t,n),post:(t,n)=>e("POST",t,n),put:(t,n)=>e("PUT",t,n),delete:(t,n)=>e("DELETE",t,n),all:(t,n)=>{e("GET",t,n),e("POST",t,n),e("PUT",t,n),e("DELETE",t,n)},async handle(t){for(const n of l){if(n.method!==t.method&&n.method!=="*")continue;const o=t.path.match(n.pattern);if(o){const r={};return n.keys.forEach((i,a)=>{r[i]=o[a+1]}),n.handler({...t,params:r})}}return{status:404,body:"Not Found"}},serve(t,n){return T.serve(t,o=>s.handle(o),n||`router:${t}`)}};return s}typeof window<"u"&&(window.__iframeServer=T,window.__createStaticServer=O,window.__createRouter=A);var K=Object.freeze({__proto__:null,createRouter:A,createStaticServer:O,iframeServer:T});export{B as P,J as S,G as a,X as b,q as c,V as d,j as e,I as f,K as g,v as h,T as i,$ as p,z as r,W as s,Y as w};
