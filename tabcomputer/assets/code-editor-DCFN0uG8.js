import{j as k,k as S}from"./index-BIxBofyG.js";const E=Object.freeze(Object.defineProperty({__proto__:null,get CODE_HINT(){return w},get CODE_HINT_KEY(){return m},get codeEditorCmd(){return L}},Symbol.toStringTag,{value:"Module"})),T="https://esm.sh";function v(e){const s=e.split(".").pop()?.toLowerCase()||"";return{js:"javascript",mjs:"javascript",cjs:"javascript",ts:"javascript",tsx:"javascript",jsx:"javascript",py:"python",python:"python",c:"cpp",h:"cpp",cpp:"cpp",cc:"cpp",cxx:"cpp",hpp:"cpp",html:"html",htm:"html",xml:"html",svg:"html",css:"css",scss:"css",less:"css",json:"json",md:"markdown",markdown:"markdown",sql:"sql",sh:"shell",bash:"shell",zsh:"shell",rs:"rust",go:"go",java:"java",yaml:"yaml",yml:"yaml",toml:"toml"}[s]||"javascript"}const m="tabcomputer-code-hint",w="File ▸ Open… in the menu bar opens a file or folder · Ctrl+S saves · ☰ (bottom left) shows the file list · Ctrl+F finds";function y(e,s,t=""){const r=JSON.stringify(e),d=JSON.stringify(s);return`<!DOCTYPE html>
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
</style>
</head>
<body>
<div id="sidebar"></div>
<div id="main">
  ${t?`<div id="hint"><span>${t.replace(/&/g,"&amp;").replace(/</g,"&lt;")}</span><button type="button" onclick="this.parentElement.remove()">Got it</button></div>`:""}
  <div id="tabs"></div>
  <div id="editor-container"></div>
  <div id="status">
    <button id="toggle-sidebar" title="Toggle sidebar">&#9776;</button>
    <span id="status-file"></span>
    <span id="status-pos"></span>
    <span id="status-msg"></span>
  </div>
</div>

<script type="module">
const CDN = ${JSON.stringify(T)};
const FILES = ${r};
const CWD = ${d};

// Dynamic import from CDN
const [
  { EditorState },
  { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, highlightActiveLine, rectangularSelection, crosshairCursor },
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

// State
const openFiles = new Map(); // path -> { content, view, modified, original }
let activeFile = null;
let view = null;

const sidebar = document.getElementById('sidebar');
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
}

async function openFile(path) {
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
</html>`}const L={name:"code",description:"Rich code editor (CodeMirror)",async exec(e){const s=e.args[0]||".",t=e.fs.resolvePath(s,e.cwd),r=[];let d=!1;try{if(d=(await e.fs.stat(t)).type==="dir",d){const i=await e.fs.readdir(t),o=[];for(const a of i){if(a.startsWith("."))continue;const c=t==="/"?`/${a}`:`${t}/${a}`;try{(await e.fs.stat(c)).type==="file"&&o.push(a)}catch{}}o.sort();for(const a of o.slice(0,50)){const c=t==="/"?`/${a}`:`${t}/${a}`;try{const l=await e.fs.readFile(c,"utf8"),b=typeof l=="string"?l:new TextDecoder().decode(l);if(b.includes("\0"))continue;const F=s==="."?a:`${s}/${a}`;r.push({path:F,content:b,language:v(a)})}catch{}}}else{const i=await e.fs.readFile(t,"utf8"),o=typeof i=="string"?i:new TextDecoder().decode(i),a=e.args[0]||t.split("/").pop()||"untitled";r.push({path:a,content:o,language:v(t)})}}catch(n){return e.stderr=`code: ${n.message}
`,1}r.length===0&&r.push({path:"untitled.js",content:"",language:"javascript"});const h=s==="."?e.cwd.split("/").pop()||"code":s,g=async n=>{try{if((await e.fs.stat(t)).type!=="dir")return t;const o=n.startsWith(s+"/")?n.slice(s.length+1):n;return t==="/"?`/${o}`:`${t}/${o}`}catch{return t}},f=globalThis.__shiroDesktop;if(f?.createWindow){let n="";try{localStorage.getItem(m)||(n=w,localStorage.setItem(m,String(Date.now())))}catch{}const i=f.createWindow({appId:"code",title:h,width:960,height:620,minWidth:360,minHeight:220,content:{kind:"iframe",srcdoc:y(r,e.cwd,n)}});i.restoreCommand={cmd:k("code",e.args),cwd:e.cwd},i.codeDir=d?t:t.slice(0,t.lastIndexOf("/"))||"/";const o=async a=>{if(!(a.data?.type!=="shiro-editor-save"||a.source!==i.iframe?.contentWindow))try{await e.fs.writeFile(await g(a.data.path),a.data.content)}catch(c){console.error(`code: save error: ${c.message}`)}};return window.addEventListener("message",o),i.on("close",()=>window.removeEventListener("message",o)),0}const x=y(r,e.cwd),p=S({mode:"iframe",title:h,width:"52em",height:"32em"});p.updateIframe(x);const u=async n=>{if(n.data?.type!=="shiro-editor-save")return;const{path:i,content:o}=n.data,a=await g(i);try{await e.fs.writeFile(a,o)}catch(c){console.error(`code: save error: ${c.message}`)}};window.addEventListener("message",u);const C=p.close;return p.close=()=>{window.removeEventListener("message",u),C()},0}};(globalThis.__tabcomputerLive??=new Map).set("src/commands/code-editor.ts",E);(globalThis.__tabcomputerLiveState??=new Map).set("src/commands/code-editor.ts",{get activeFile(){return activeFile},set activeFile(e){activeFile=e},get view(){return view},set view(e){view=e},get langModules(){return langModules},get openFiles(){return openFiles}});export{w as CODE_HINT,m as CODE_HINT_KEY,L as codeEditorCmd};
