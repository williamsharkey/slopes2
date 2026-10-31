const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./manifest-locate-1cIU6myr.js","./manifest-BcVQSdj8.js","./toolchains-Cwsawl3t.js","./registry-BbB6rW5d.js","./lab-T0C4dWxF.js","./index-C6zxlZK4.js","./index-LZoznX6r.css","./gitstatus-BoVh_pdE.js","./run-url-BhZeBfd4.js","./link-fragment-DNd4gDx5.js","./app-pane-0ZStWx6C.js"])))=>i.map(i=>d[i]);
import{t as V,a as w,j as W,u as j}from"./index-C6zxlZK4.js";const G=Object.freeze(Object.defineProperty({__proto__:null,get CODE_HINT(){return O},get CODE_HINT_KEY(){return $},get CODE_HINT_PHONE(){return H},get buildEditorHtml(){return N},get codeEditorCmd(){return Y}},Symbol.toStringTag,{value:"Module"})),J="https://esm.sh",q=t=>`'${t.replace(/'/g,"'\\''")}'`;function A(t){const p=t.split(".").pop()?.toLowerCase()||"";return{js:"javascript",mjs:"javascript",cjs:"javascript",ts:"javascript",tsx:"javascript",jsx:"javascript",py:"python",python:"python",c:"cpp",h:"cpp",cpp:"cpp",cc:"cpp",cxx:"cpp",hpp:"cpp",html:"html",htm:"html",xml:"html",svg:"html",css:"css",scss:"css",less:"css",json:"json",md:"markdown",markdown:"markdown",sql:"sql",sh:"shell",bash:"shell",zsh:"shell",rs:"rust",go:"go",java:"java",yaml:"yaml",yml:"yaml",toml:"toml"}[p]||"javascript"}const $="tabcomputer-code-hint",O="File ▸ Open… in the menu bar opens a file or folder · Ctrl+S saves · ☰ (bottom left) shows the file list · Ctrl+F finds",H="Tap the pill twice for the menu: File ▸ Open… opens a file or folder · ☰ (bottom left) shows the file list";function N(t,p,i="",x=!1,b=!1){const k=JSON.stringify(t),v=JSON.stringify(p);return`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { display: flex; height: 100vh; background: #1e1e2e; color: #cdd6f4; font-family: system-ui, -apple-system, sans-serif; }

  /* File tree sidebar */
  #sidebar { width: 200px; background: #181825; border-right: 1px solid #313244; overflow-y: auto; flex-shrink: 0; font-size: 13px; }
  #sidebar.hidden { display: none; }
  .tree-item { padding: 4px 8px 4px 12px; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #a6adc8; }
  .tree-item:hover { background: #313244; }
  .tree-item.active { background: #45475a; color: #cdd6f4; }
  .tree-item.dir { color: #89b4fa; }
  .tree-dir-label { padding: 4px 8px; font-weight: 600; color: #585b70; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }

  /* Tab bar */
  #tabs { display: flex; background: #181825; border-bottom: 1px solid #313244; overflow-x: auto; flex-shrink: 0; }
  .tab { padding: 6px 12px; font-size: 12px; cursor: pointer; border-right: 1px solid #313244; color: #a6adc8; display: flex; align-items: center; gap: 6px; white-space: nowrap; }
  .tab:hover { background: #313244; }
  .tab.active { background: #1e1e2e; color: #cdd6f4; border-bottom: 2px solid #89b4fa; }
  .tab .dot { width: 6px; height: 6px; border-radius: 50%; background: #f9e2af; display: none; }
  .tab.modified .dot { display: block; }
  .tab .close { font-size: 14px; color: #585b70; margin-left: 4px; }
  .tab .close:hover { color: #f38ba8; }

  /* Editor area */
  #main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
  #editor-container { flex: 1; overflow: hidden; }

  /* Status bar */
  #status { height: 24px; background: #181825; border-top: 1px solid #313244; display: flex; align-items: center; padding: 0 12px; font-size: 11px; color: #585b70; gap: 16px; }
  #status .saved { color: #a6e3a1; }

  /* Toggle sidebar button */
  #toggle-sidebar { background: none; border: none; color: #585b70; font-size: 16px; cursor: pointer; padding: 2px 6px; }
  #toggle-sidebar:hover { color: #cdd6f4; }

  /* CodeMirror theme overrides */
  .cm-editor { height: 100%; font-size: 14px; }
  .cm-editor .cm-scroller { overflow: auto; }
  .cm-editor.cm-focused { outline: none; }

  /* First-open hint */
  #hint { display: flex; align-items: center; gap: 8px; padding: 6px 10px; background: #313244; color: #cdd6f4; font-size: 12px; border-bottom: 1px solid #45475a; flex-shrink: 0; }
  #hint span { flex: 1; }
  #hint button { background: none; border: 1px solid #585b70; color: #cdd6f4; border-radius: 4px; font: inherit; padding: 1px 8px; cursor: pointer; }

  /* Lab bar (src/lab.ts): Run, Test, Submit for a folder with .tabcomputer/lab.json */
  #lab { display: flex; align-items: center; gap: 6px; padding: 5px 10px; background: #181825; border-bottom: 1px solid #313244; font-size: 12px; flex-shrink: 0; flex-wrap: wrap; }
  #lab[hidden] { display: none; }
  #lab-name { color: #a6adc8; margin-right: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 14em; }
  #lab button { background: #313244; border: 1px solid #45475a; color: #cdd6f4; border-radius: 4px; font: inherit; padding: 2px 12px; cursor: pointer; }
  #lab button:hover { background: #45475a; }
  #lab button:disabled { opacity: .5; cursor: default; }
  #lab button[hidden] { display: none; }
  #lab-submit { background: #89b4fa; border-color: #89b4fa; color: #11111b; font-weight: 600; }
  #lab-submit:hover { background: #b4befe; }
  .cm-app-problem { text-decoration: underline wavy #f38ba8; text-decoration-skip-ink: none; text-underline-offset: 3px; }
  #lab-msg { flex: 1 1 12em; min-width: 0; color: #a6adc8; overflow-wrap: anywhere; user-select: text; -webkit-user-select: text; }
  #lab-msg.ok { color: #a6e3a1; }
  #lab-msg.bad { color: #f38ba8; }
  #status-git { margin-left: auto; white-space: nowrap; }
  #status-git.unsaved { color: #f9e2af; }
  #status-git.saved { color: #a6e3a1; }
  /* A phone (the desktop's phone layout) */
  body.phone #sidebar { position: absolute; z-index: 5; top: 0; bottom: 0; left: 0; width: min(280px, 80%); box-shadow: 8px 0 24px rgba(0, 0, 0, .4); }
  body.phone .tree-item { min-height: 44px; display: flex; align-items: center; }
  body.phone #toggle-sidebar { min-width: 44px; min-height: 44px; }
  body.phone #hint button { min-height: 44px; padding: 1px 14px; }
  body.phone #lab button { min-height: 44px; padding: 2px 16px; font-size: 14px; }
</style>
</head>
<body${x?' class="phone"':""}>
<div id="sidebar"></div>
<div id="main">
  ${i?`<div id="hint"><span>${i.replace(/&/g,"&amp;").replace(/</g,"&lt;")}</span><button type="button" onclick="this.parentElement.remove()">Got it</button></div>`:""}
  <div id="lab" hidden>
    <span id="lab-name"></span>
    <button id="lab-run" type="button" title="Save, then run the lab's run command in the Terminal">Run</button>
    <button id="lab-test" type="button" title="Save, then run the lab's tests in the Terminal">Test</button>
    <button id="lab-submit" type="button" title="Save, commit and push to GitHub">Submit</button>
    <button id="lab-app-run" type="button" title="Save, then load the app again" hidden>Run</button>
    <button id="lab-app-share" type="button" title="A link to the app" hidden>Share</button>
    <span id="lab-msg" role="status" aria-live="polite"></span>
  </div>
  <div id="tabs"></div>
  <div id="editor-container"></div>
  <div id="status">
    <button id="toggle-sidebar" title="Toggle sidebar">&#9776;</button>
    <span id="status-file"></span>
    <span id="status-pos"></span>
    <span id="status-msg"></span>
    <span id="status-git"></span>
  </div>
</div>

<script>
// The lab bar and the saved mark (src/lab.ts). Not a module, so it works before the editor
// has loaded; everything the window's host sends goes in as text.
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var lab = window.__lab = { saveAll: function () {} };
  var send = function (m) { window.parent.postMessage(m, '*'); };
  var actions = ['run', 'test', 'submit', 'app-run', 'app-share'];
  actions.forEach(function (a) {
    $('lab-' + a).onclick = function () { lab.saveAll(); send({ type: 'shiro-editor-action', action: a }); };
  });
  // The bar shows for a lab (src/lab.ts) or an app's folder (src/apps/app-pane.ts), or both
  var shown = { lab: false, app: false, labName: '', appName: '' };
  var bar = function () { $('lab').hidden = !(shown.lab || shown.app); $('lab-name').textContent = shown.lab ? shown.labName : shown.appName; };
  var say = function (text, cls) { var m = $('lab-msg'); m.textContent = text || ''; m.className = cls || ''; };
  window.addEventListener('message', function (e) {
    var d = e.data;
    if (e.source !== window.parent || !d) return;
    if (d.type === 'shiro-editor-app') {
      shown.app = !!d.show;
      shown.appName = d.name || '';
      $('lab-app-run').hidden = $('lab-app-share').hidden = !d.show;
      bar();
    } else if (d.type === 'shiro-editor-lab') {
      shown.lab = !!d.show;
      shown.labName = d.name || '';
      bar();
      $('lab-run').hidden = !d.run;
      $('lab-test').hidden = !d.test;
      $('lab-submit').hidden = !d.submit;
      if (d.problem) say(d.problem, 'bad');
      else if ($('lab-msg').className === 'bad' && $('lab-msg').dataset.config) say('');
      $('lab-msg').dataset.config = d.problem ? '1' : '';
    } else if (d.type === 'shiro-editor-git') {
      var g = $('status-git');
      g.textContent = d.text || '';
      g.className = d.tracked ? (d.unsaved ? 'unsaved' : 'saved') : '';
      g.title = d.detail || '';
    } else if (d.type === 'shiro-editor-result') {
      say(d.text, d.ok === true ? 'ok' : d.ok === false ? 'bad' : '');
      $('lab-msg').dataset.config = '';
      actions.forEach(function (a) { $('lab-' + a).disabled = !!d.busy; });
    }
  });
  send({ type: 'shiro-editor-ready' });
})();
<\/script>

<script type="module">
const CDN = ${JSON.stringify(J)};
const FILES = ${k};
const CWD = ${v};
const APP_MODE = ${b?"true":"false"};

// Dynamic import from CDN
const [
  { EditorState, StateEffect, StateField },
  { EditorView, Decoration, keymap, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, highlightActiveLine, rectangularSelection, crosshairCursor },
  { defaultKeymap, history, historyKeymap, indentWithTab },
  { syntaxHighlighting, defaultHighlightStyle, indentOnInput, bracketMatching, foldGutter, foldKeymap },
  { closeBrackets, closeBracketsKeymap, autocompletion, completionKeymap },
  { searchKeymap, highlightSelectionMatches },
  { javascript },
  { oneDark },
] = await Promise.all([
  import(CDN + '/@codemirror/state@6'),
  import(CDN + '/@codemirror/view@6'),
  import(CDN + '/@codemirror/commands@6'),
  import(CDN + '/@codemirror/language@6'),
  import(CDN + '/@codemirror/autocomplete@6'),
  import(CDN + '/@codemirror/search@6'),
  import(CDN + '/@codemirror/lang-javascript@6'),
  import(CDN + '/@codemirror/theme-one-dark@6'),
]);

// Additional language modules (loaded on demand)
const langModules = {};
async function getLang(name) {
  if (name === 'javascript') return javascript();
  if (langModules[name]) return langModules[name];
  try {
    const m = await import(CDN + '/@codemirror/lang-' + name + '@6');
    const fn = m[name] || m[Object.keys(m).find(k => typeof m[k] === 'function')];
    if (fn) { langModules[name] = fn(); return langModules[name]; }
  } catch {}
  return javascript(); // fallback
}

// An app's folder: app.json is checked as it is typed, each problem underlined at its key (src/apps/manifest-locate.ts)
const isManifest = (p) => APP_MODE && (p || '').split('/').pop() === 'app.json';
const setProblems = StateEffect.define();
const problemMarks = StateField.define({
  create: () => Decoration.none,
  update(marks, tr) {
    marks = marks.map(tr.changes);
    for (const e of tr.effects) {
      if (!e.is(setProblems)) continue;
      const len = tr.state.doc.length;
      const ranges = [];
      for (const p of e.value) {
        const from = Math.max(0, Math.min(p.from, len)), to = Math.max(0, Math.min(Math.max(p.to, p.from + 1), len));
        if (to > from) ranges.push(Decoration.mark({ class: 'cm-app-problem', attributes: { title: p.message } }).range(from, to));
      }
      marks = Decoration.set(ranges, true);
    }
    return marks;
  },
  provide: (f) => EditorView.decorations.from(f),
});
const problemsFor = new Map(); // path -> [{ from, to, message }]
let checkTimer = 0;
const askCheck = (path, text) => { clearTimeout(checkTimer); checkTimer = setTimeout(() => window.parent.postMessage({ type: 'shiro-editor-text', path, content: text }, '*'), 250); };
window.addEventListener('message', (e) => {
  const d = e.data;
  if (e.source !== window.parent || !d || d.type !== 'shiro-editor-problems' || typeof d.path !== 'string' || !Array.isArray(d.items)) return;
  problemsFor.set(d.path, d.items.map((p) => ({ from: Number(p.from) || 0, to: Number(p.to) || 0, message: String(p.message || '') })));
  if (d.path === activeFile && view) view.dispatch({ effects: setProblems.of(problemsFor.get(d.path)) });
});

// State
const openFiles = new Map(); // path -> { content, view, modified, original }
let activeFile = null;
let view = null;

const sidebar = document.getElementById('sidebar');
if (document.body.classList.contains('phone')) sidebar.classList.add('hidden');
const tabsEl = document.getElementById('tabs');
const editorContainer = document.getElementById('editor-container');
const statusFile = document.getElementById('status-file');
const statusPos = document.getElementById('status-pos');
const statusMsg = document.getElementById('status-msg');

// Build sidebar
function renderSidebar() {
  sidebar.innerHTML = '';
  const dirs = new Map();
  for (const f of FILES) {
    const parts = f.path.split('/');
    const dir = parts.length > 1 ? parts.slice(0, -1).join('/') : '.';
    if (!dirs.has(dir)) dirs.set(dir, []);
    dirs.get(dir).push(f);
  }
  for (const [dir, files] of dirs) {
    if (dirs.size > 1) {
      const label = document.createElement('div');
      label.className = 'tree-dir-label';
      label.textContent = dir;
      sidebar.appendChild(label);
    }
    for (const f of files) {
      const item = document.createElement('div');
      item.className = 'tree-item';
      item.textContent = f.path.split('/').pop();
      item.title = f.path;
      item.onclick = () => openFile(f.path);
      item.dataset.path = f.path;
      sidebar.appendChild(item);
    }
  }
}

// Tabs
function renderTabs() {
  tabsEl.innerHTML = '';
  for (const [path, state] of openFiles) {
    const tab = document.createElement('div');
    tab.className = 'tab' + (path === activeFile ? ' active' : '') + (state.modified ? ' modified' : '');
    const dot = document.createElement('span');
    dot.className = 'dot';
    const name = document.createElement('span');
    name.textContent = path.split('/').pop();
    const close = document.createElement('span');
    close.className = 'close';
    close.textContent = '\\u00d7';
    close.onclick = (e) => { e.stopPropagation(); closeFile(path); };
    tab.appendChild(dot);
    tab.appendChild(name);
    tab.appendChild(close);
    tab.onclick = () => switchTo(path);
    tabsEl.appendChild(tab);
  }
  // The window's host counts files with edits that are not saved (the lab's saved mark)
  let dirty = 0;
  for (const state of openFiles.values()) if (state.modified) dirty++;
  if (dirty !== lastDirty) { lastDirty = dirty; window.parent.postMessage({ type: 'shiro-editor-dirty', count: dirty }, '*'); }
}
let lastDirty = 0;

// Run, Test and Submit save every edited file first
window.__lab.saveAll = () => {
  for (const [path, state] of openFiles) {
    if (path === activeFile && view) state.content = view.state.doc.toString();
    if (state.content === state.original) continue;
    window.parent.postMessage({ type: 'shiro-editor-save', path, content: state.content }, '*');
    state.original = state.content;
    state.modified = false;
  }
  renderTabs();
};

async function openFile(path) {
  // A notebook opens in the Notebook app, not as its JSON
  if (path.slice(-6).toLowerCase() === '.ipynb') { window.parent.postMessage({ type: 'shiro-editor-open-notebook', path: path }, '*'); return; }
  if (!openFiles.has(path)) {
    const f = FILES.find(f => f.path === path);
    if (!f) return;
    const lang = await getLang(f.language);
    const state = EditorState.create({
      doc: f.content,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        foldGutter(),
        drawSelection(),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        autocompletion(),
        rectangularSelection(),
        crosshairCursor(),
        highlightActiveLine(),
        highlightSelectionMatches(),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        lang,
        problemMarks,
        oneDark,
        keymap.of([
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...searchKeymap,
          ...historyKeymap,
          ...foldKeymap,
          ...completionKeymap,
          indentWithTab,
          { key: 'Mod-s', run: () => { saveFile(activeFile); return true; } },
        ]),
        EditorView.updateListener.of(update => {
          if (update.docChanged && activeFile) {
            if (isManifest(activeFile)) askCheck(activeFile, update.state.doc.toString());
            const state = openFiles.get(activeFile);
            if (state) {
              state.content = update.state.doc.toString();
              state.modified = state.content !== state.original;
              renderTabs();
            }
          }
          if (update.selectionSet) {
            const pos = update.state.selection.main.head;
            const line = update.state.doc.lineAt(pos);
            statusPos.textContent = 'Ln ' + line.number + ', Col ' + (pos - line.from + 1);
          }
        }),
      ],
    });
    openFiles.set(path, { content: f.content, original: f.content, editorState: state, modified: false });
  }
  switchTo(path);
}

function switchTo(path) {
  // Save current view state
  if (activeFile && view) {
    openFiles.get(activeFile).editorState = view.state;
  }
  activeFile = path;

  const state = openFiles.get(path);
  if (!state) return;

  // Replace editor
  editorContainer.innerHTML = '';
  view = new EditorView({
    state: state.editorState,
    parent: editorContainer,
  });
  view.focus();
  if (isManifest(path)) {
    if (problemsFor.has(path)) view.dispatch({ effects: setProblems.of(problemsFor.get(path)) });
    askCheck(path, view.state.doc.toString());
  }

  statusFile.textContent = path;
  renderTabs();

  // Highlight sidebar
  sidebar.querySelectorAll('.tree-item').forEach(el => {
    el.classList.toggle('active', el.dataset.path === path);
  });
}

function closeFile(path) {
  openFiles.delete(path);
  if (activeFile === path) {
    const remaining = [...openFiles.keys()];
    if (remaining.length > 0) {
      switchTo(remaining[remaining.length - 1]);
    } else {
      activeFile = null;
      editorContainer.innerHTML = '';
      statusFile.textContent = '';
    }
  }
  renderTabs();
}

async function saveFile(path) {
  if (!path) return;
  const state = openFiles.get(path);
  if (!state) return;

  // Save current editor content
  if (view) state.content = view.state.doc.toString();

  // Send save message to parent
  window.parent.postMessage({
    type: 'shiro-editor-save',
    path: path,
    content: state.content,
  }, '*');

  state.original = state.content;
  state.modified = false;
  renderTabs();

  statusMsg.innerHTML = '<span class="saved">Saved</span>';
  setTimeout(() => { statusMsg.textContent = ''; }, 2000);
}

// Toggle sidebar
document.getElementById('toggle-sidebar').onclick = () => {
  sidebar.classList.toggle('hidden');
};

// Init
renderSidebar();
if (FILES.length > 0) openFile(FILES[0].path);
<\/script>
</body>
</html>`}const Y={name:"code",description:"Rich code editor (CodeMirror)",async exec(t){const p=t.args[0]||".",i=t.fs.resolvePath(p,t.cwd),x=globalThis.__shiroDesktop;if(/\.ipynb$/i.test(i)&&x?.openApp&&x.apps?.().some(n=>n.id==="notebook"))return await x.openApp("notebook",{path:i}),0;const b=[];let k=!1;try{if(k=(await t.fs.stat(i)).type==="dir",k){const c=await t.fs.readdir(i),s=[];for(const a of c){if(a.startsWith("."))continue;const h=i==="/"?`/${a}`:`${i}/${a}`;try{(await t.fs.stat(h)).type==="file"&&s.push(a)}catch{}}s.sort();for(const a of s.slice(0,50)){const h=i==="/"?`/${a}`:`${i}/${a}`;try{const d=await t.fs.readFile(h,"utf8"),y=typeof d=="string"?d:new TextDecoder().decode(d);if(y.includes("\0"))continue;const T=p==="."?a:`${p}/${a}`;b.push({path:T,content:y,language:A(a)})}catch{}}}else{const c=await t.fs.readFile(i,"utf8"),s=typeof c=="string"?c:new TextDecoder().decode(c),a=t.args[0]||i.split("/").pop()||"untitled";b.push({path:a,content:s,language:A(i)})}}catch(n){return t.stderr=`code: ${n.message}
`,1}b.length===0&&b.push({path:"untitled.js",content:"",language:"javascript"});const v=p==="."?t.cwd.split("/").pop()||"code":p,C=async n=>{try{if((await t.fs.stat(i)).type!=="dir")return i;const s=n.startsWith(p+"/")?n.slice(p.length+1):n;return i==="/"?`/${s}`:`${i}/${s}`}catch{return i}},_=globalThis.__shiroDesktop;if(_?.createWindow){const n=!!_.phone;let c="";try{localStorage.getItem($)||(c=n?H:O,localStorage.setItem($,String(Date.now())))}catch{}const s=k?i:i.slice(0,i.lastIndexOf("/"))||"/",a=await t.fs.exists(`${s==="/"?"":s}/app.json`).catch(()=>!1)?s:"",h=_.workArea?.(),d=_.createWindow({appId:"code",title:v,width:a&&h?Math.min(1240,Math.max(960,h.width-40)):960,height:a&&h?Math.min(700,Math.max(620,h.height-60)):620,minWidth:360,minHeight:220,content:{kind:"iframe",srcdoc:N(b,t.cwd,c,n,!!a)}});d.restoreCommand={cmd:V("code",t.args),cwd:t.cwd},d.codeDir=s;let y=Promise.resolve(),T=null,g=null;const M=e=>d.iframe?.contentWindow?.postMessage(e,"*"),E=()=>{g&&M({type:"shiro-editor-app",show:!0,name:g.name()||a.split("/").pop()})},R=async(e,o)=>{if(await C(e)!==`${a}/app.json`)return;const[{locateProblems:m},{pageBeside:l}]=await Promise.all([w(()=>import("./manifest-locate-1cIU6myr.js"),__vite__mapDeps([0,1,2]),import.meta.url),w(()=>import("./registry-BbB6rW5d.js"),__vite__mapDeps([3,1,2]),import.meta.url)]),u=new Set;for(const r of["index.html","public/index.html"])await t.fs.exists(`${a}/${r}`).catch(()=>!1)&&u.add(r);const f=m(o,{id:a.split("/").pop(),page:l(r=>u.has(r))});M({type:"shiro-editor-problems",path:e,items:f}),g?.problems(f.map(r=>r.message))},P=e=>{if(!(e.source!==d.iframe?.contentWindow||!e.data)){if(a&&e.data.type==="shiro-editor-text"&&typeof e.data.path=="string"&&typeof e.data.content=="string"){R(e.data.path,e.data.content);return}if(a&&e.data.type==="shiro-editor-ready"&&E(),a&&e.data.type==="shiro-editor-action"&&(e.data.action==="app-run"||e.data.action==="app-share")){const o=e.data.action;y.then(async()=>{if(!g)return;if(o==="app-share"){await g.share();return}const m=await g.run();M({type:"shiro-editor-result",ok:null,text:m}),E()});return}if(e.data.type==="shiro-editor-save"){const{path:o,content:m}=e.data;y=y.then(async()=>{try{const l=await C(o);await t.fs.writeFile(l,m),j(l)}catch(l){console.error(`code: save error: ${l.message}`)}})}else e.data.type==="shiro-editor-open-notebook"&&typeof e.data.path=="string"?C(e.data.path).then(o=>x?.openApp?.("notebook",{path:o})):T?.message(e.data)}};window.addEventListener("message",P);let D=!1,F=null;const K=(e,o,m)=>{const l=globalThis.__shiroDesktopCtx;if(!l)return"There is no Terminal to run it in.";const u=(_.windows?.()??[]).filter(L=>L.kind==="terminal"),f=F&&u.includes(F)?F:u.find(L=>L.content?.cwd?.()===e)??null,r=f?.content?.activeTerminal?.();return f&&r?(f.focus(),r.isBusy()?`The Terminal is still running a command. Stop it with Ctrl+C, then press ${m} again.`:(F=f,r.injectInput(`${f.content?.cwd?.()===e?"":`cd ${q(e)} && `}${o}\r`),null)):(F=l.openTerminal({cwd:e,command:o,title:v}),null)};if(w(async()=>{const{attachLab:e}=await import("./lab-T0C4dWxF.js");return{attachLab:e}},__vite__mapDeps([4,5,6,7,8,9]),import.meta.url).then(({attachLab:e})=>{D||(T=e({fs:t.fs,dir:s,post:o=>d.iframe?.contentWindow?.postMessage(o,"*"),setMark:o=>d.setTitle?.(o?`${v} · ${o}`:v),flush:()=>y,runInTerminal:K,exec:async(o,m)=>{const l=t.shell.fork();l.cwd=o;let u="";return{code:await l.execute(m,r=>{u+=r},r=>{u+=r}),out:u}}}))}),a){const e=d.body;e&&w(async()=>{const{appPane:o}=await import("./app-pane-0ZStWx6C.js");return{appPane:o}},__vite__mapDeps([10,5,6]),import.meta.url).then(({appPane:o})=>o({fs:t.fs,shell:t.shell,dir:a,container:e,onReload:E})).then(o=>{if(D){o.dispose();return}g=o,E(),setTimeout(E,1500)})}return d.on("close",()=>{D=!0,window.removeEventListener("message",P),T?.dispose(),g?.dispose()}),0}const z=N(b,t.cwd),S=W({mode:"iframe",title:v,width:"52em",height:"32em"});S.updateIframe(z);const I=async n=>{if(n.data?.type!=="shiro-editor-save")return;const{path:c,content:s}=n.data,a=await C(c);try{await t.fs.writeFile(a,s),j(a)}catch(h){console.error(`code: save error: ${h.message}`)}};window.addEventListener("message",I);const B=S.close;return S.close=()=>{window.removeEventListener("message",I),B()},0}};(globalThis.__tabcomputerLive??=new Map).set("src/commands/code-editor.ts",G);(globalThis.__tabcomputerLiveState??=new Map).set("src/commands/code-editor.ts",{get checkTimer(){return checkTimer},set checkTimer(t){checkTimer=t},get activeFile(){return activeFile},set activeFile(t){activeFile=t},get view(){return view},set view(t){view=t},get lastDirty(){return lastDirty},set lastDirty(t){lastDirty=t},get langModules(){return langModules},get problemsFor(){return problemsFor},get openFiles(){return openFiles}});(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/apps/manifest-locate.ts",()=>w(()=>import("./manifest-locate-1cIU6myr.js"),__vite__mapDeps([0,1,2]),import.meta.url));(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/apps/registry.ts",()=>w(()=>import("./registry-BbB6rW5d.js"),__vite__mapDeps([3,1,2]),import.meta.url));(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/lab.ts",()=>w(()=>import("./lab-T0C4dWxF.js"),__vite__mapDeps([4,5,6,7,8,9]),import.meta.url));(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/apps/app-pane.ts",()=>w(()=>import("./app-pane-0ZStWx6C.js"),__vite__mapDeps([10,5,6]),import.meta.url));export{O as CODE_HINT,$ as CODE_HINT_KEY,H as CODE_HINT_PHONE,N as buildEditorHtml,Y as codeEditorCmd};
