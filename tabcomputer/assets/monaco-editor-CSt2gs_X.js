import{j as b,t as v}from"./index-3dop0BuN.js";const y=Object.freeze(Object.defineProperty({__proto__:null,get monacoEditorCmd(){return C}},Symbol.toStringTag,{value:"Module"})),w="https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min";function f(e){const i=e.split(".").pop()?.toLowerCase()||"";return{js:"javascript",mjs:"javascript",cjs:"javascript",ts:"typescript",tsx:"typescript",jsx:"javascript",py:"python",python:"python",c:"cpp",h:"cpp",cpp:"cpp",cc:"cpp",cxx:"cpp",hpp:"cpp",html:"html",htm:"html",css:"css",scss:"scss",less:"less",json:"json",jsonc:"json",md:"markdown",markdown:"markdown",xml:"xml",svg:"xml",sql:"sql",sh:"shell",bash:"shell",zsh:"shell",rs:"rust",go:"go",java:"java",yaml:"yaml",yml:"yaml",rb:"ruby",php:"php",txt:"plaintext"}[i]||"plaintext"}function x(e,i){const t=JSON.stringify(e),n=JSON.stringify(i);return`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { display: flex; height: 100vh; background: #1e1e1e; color: #cccccc; font-family: system-ui, -apple-system, sans-serif; overflow: hidden; }

  /* File tree sidebar */
  #sidebar { width: 200px; background: #252526; border-right: 1px solid #3c3c3c; overflow-y: auto; flex-shrink: 0; font-size: 13px; }
  #sidebar.hidden { display: none; }
  .tree-item { padding: 4px 8px 4px 12px; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #bbbbbb; }
  .tree-item:hover { background: #2a2d2e; }
  .tree-item.active { background: #37373d; color: #ffffff; }
  .tree-item.dir { color: #75beff; }
  .tree-dir-label { padding: 4px 8px; font-weight: 600; color: #888888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }

  /* Tab bar */
  #tabs { display: flex; background: #252526; border-bottom: 1px solid #3c3c3c; overflow-x: auto; flex-shrink: 0; }
  .tab { padding: 6px 12px; font-size: 12px; cursor: pointer; border-right: 1px solid #3c3c3c; color: #969696; display: flex; align-items: center; gap: 6px; white-space: nowrap; background: #2d2d2d; }
  .tab:hover { background: #2a2d2e; }
  .tab.active { background: #1e1e1e; color: #ffffff; border-bottom: none; }
  .tab .dot { width: 6px; height: 6px; border-radius: 50%; background: #e8ab53; display: none; }
  .tab.modified .dot { display: block; }
  .tab .close { font-size: 14px; color: #666666; margin-left: 4px; }
  .tab .close:hover { color: #e06c75; }

  /* Editor area */
  #main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
  #editor-container { flex: 1; overflow: hidden; }

  /* Status bar */
  #status { height: 22px; background: #007acc; display: flex; align-items: center; padding: 0 12px; font-size: 11px; color: #ffffff; gap: 16px; }
  #status .saved { color: #73c991; font-weight: bold; }

  /* Toggle sidebar button */
  #toggle-sidebar { background: none; border: none; color: #ffffff; font-size: 14px; cursor: pointer; padding: 2px 6px; opacity: 0.8; }
  #toggle-sidebar:hover { opacity: 1; }

  /* Loading state */
  #loading { display: flex; align-items: center; justify-content: center; height: 100%; color: #888; font-size: 14px; }
</style>
</head>
<body>
<div id="sidebar"></div>
<div id="main">
  <div id="tabs"></div>
  <div id="editor-container"><div id="loading">Loading Monaco Editor...</div></div>
  <div id="status">
    <button id="toggle-sidebar" title="Toggle sidebar">&#9776;</button>
    <span id="status-file"></span>
    <span id="status-pos"></span>
    <span id="status-msg"></span>
  </div>
</div>

<script>
const MONACO_CDN = ${JSON.stringify(w)};
const FILES = ${t};
const CWD = ${n};

/* State */
const models = new Map();       /* path -> monaco.editor.ITextModel */
const viewStates = new Map();   /* path -> editor.saveViewState() */
const modified = new Set();     /* paths with unsaved changes */
const originals = new Map();    /* path -> original content */
let activeFile = null;
let editor = null;

const sidebar = document.getElementById('sidebar');
const tabsEl = document.getElementById('tabs');
const editorContainer = document.getElementById('editor-container');
const statusFile = document.getElementById('status-file');
const statusPos = document.getElementById('status-pos');
const statusMsg = document.getElementById('status-msg');

/* Load Monaco via AMD loader */
const loaderScript = document.createElement('script');
loaderScript.src = MONACO_CDN + '/vs/loader.js';
loaderScript.onload = function() {
  require.config({ paths: { vs: MONACO_CDN + '/vs' } });
  require(['vs/editor/editor.main'], function() {
    document.getElementById('loading')?.remove();
    initEditor();
  });
};
document.head.appendChild(loaderScript);

function initEditor() {
  /* Create the single editor instance */
  editor = monaco.editor.create(editorContainer, {
    theme: 'vs-dark',
    fontSize: 14,
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    wordWrap: 'on',
    renderWhitespace: 'selection',
    bracketPairColorization: { enabled: true },
    padding: { top: 4 },
  });

  /* Cmd/Ctrl+S save */
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, function() {
    saveFile(activeFile);
  });

  /* Cursor position tracking */
  editor.onDidChangeCursorPosition(function(e) {
    statusPos.textContent = 'Ln ' + e.position.lineNumber + ', Col ' + e.position.column;
  });

  /* Build sidebar + open first file */
  renderSidebar();
  if (FILES.length > 0) openFile(FILES[0].path);
}

/* Sidebar */
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
      item.onclick = function() { openFile(f.path); };
      item.dataset.path = f.path;
      sidebar.appendChild(item);
    }
  }
}

/* Tabs */
function renderTabs() {
  tabsEl.innerHTML = '';
  for (const path of models.keys()) {
    const tab = document.createElement('div');
    tab.className = 'tab' + (path === activeFile ? ' active' : '') + (modified.has(path) ? ' modified' : '');
    const dot = document.createElement('span');
    dot.className = 'dot';
    const name = document.createElement('span');
    name.textContent = path.split('/').pop();
    const close = document.createElement('span');
    close.className = 'close';
    close.textContent = '\\u00d7';
    close.onclick = function(e) { e.stopPropagation(); closeFile(path); };
    tab.appendChild(dot);
    tab.appendChild(name);
    tab.appendChild(close);
    tab.onclick = function() { switchTo(path); };
    tabsEl.appendChild(tab);
  }
}

function openFile(path) {
  if (!models.has(path)) {
    const f = FILES.find(function(f) { return f.path === path; });
    if (!f) return;
    const uri = monaco.Uri.parse('file:///' + path);
    const model = monaco.editor.createModel(f.content, f.language, uri);
    models.set(path, model);
    originals.set(path, f.content);

    model.onDidChangeContent(function() {
      const current = model.getValue();
      if (current !== originals.get(path)) {
        modified.add(path);
      } else {
        modified.delete(path);
      }
      renderTabs();
    });
  }
  switchTo(path);
}

function switchTo(path) {
  if (!models.has(path)) return;

  /* Save view state of current file */
  if (activeFile && editor) {
    viewStates.set(activeFile, editor.saveViewState());
  }

  activeFile = path;
  const model = models.get(path);
  editor.setModel(model);

  /* Restore view state if we had one */
  const vs = viewStates.get(path);
  if (vs) editor.restoreViewState(vs);

  editor.focus();
  statusFile.textContent = path;
  renderTabs();

  /* Highlight sidebar */
  sidebar.querySelectorAll('.tree-item').forEach(function(el) {
    el.classList.toggle('active', el.dataset.path === path);
  });
}

function closeFile(path) {
  const model = models.get(path);
  if (model) model.dispose();
  models.delete(path);
  viewStates.delete(path);
  modified.delete(path);
  originals.delete(path);

  if (activeFile === path) {
    const remaining = Array.from(models.keys());
    if (remaining.length > 0) {
      switchTo(remaining[remaining.length - 1]);
    } else {
      activeFile = null;
      editor.setModel(null);
      statusFile.textContent = '';
    }
  }
  renderTabs();
}

function saveFile(path) {
  if (!path) return;
  const model = models.get(path);
  if (!model) return;

  const content = model.getValue();

  window.parent.postMessage({
    type: 'shiro-editor-save',
    path: path,
    content: content,
  }, '*');

  originals.set(path, content);
  modified.delete(path);
  renderTabs();

  statusMsg.innerHTML = '<span class="saved">Saved</span>';
  setTimeout(function() { statusMsg.textContent = ''; }, 2000);
}

/* Toggle sidebar */
document.getElementById('toggle-sidebar').onclick = function() {
  sidebar.classList.toggle('hidden');
};
<\/script>
</body>
</html>`}const C={name:"monaco",description:"VS Code editor (Monaco)",async exec(e){const i=e.args[0]||".",t=e.fs.resolvePath(i,e.cwd),n=[];try{if((await e.fs.stat(t)).type==="dir"){const a=await e.fs.readdir(t),s=[];for(const o of a){if(o.startsWith("."))continue;const d=t==="/"?`/${o}`:`${t}/${o}`;try{(await e.fs.stat(d)).type==="file"&&s.push(o)}catch{}}s.sort();for(const o of s.slice(0,50)){const d=t==="/"?`/${o}`:`${t}/${o}`;try{const r=await e.fs.readFile(d,"utf8"),m=typeof r=="string"?r:new TextDecoder().decode(r);if(m.includes("\0"))continue;const g=i==="."?o:`${i}/${o}`;n.push({path:g,content:m,language:f(o)})}catch{}}}else{const a=await e.fs.readFile(t,"utf8"),s=typeof a=="string"?a:new TextDecoder().decode(a),o=e.args[0]||t.split("/").pop()||"untitled";n.push({path:o,content:s,language:f(t)})}}catch(c){return e.stderr=`monaco: ${c.message}
`,1}n.length===0&&n.push({path:"untitled.ts",content:"",language:"typescript"});const h=x(n,e.cwd),l=b({mode:"iframe",title:i==="."?e.cwd.split("/").pop()||"monaco":i,appId:"monaco",appName:"Monaco",restore:{cmd:v("monaco",e.args),cwd:e.cwd},width:"56em",height:"34em"});l.updateIframe(h);const p=async c=>{if(c.data?.type!=="shiro-editor-save")return;const{path:a,content:s}=c.data;let o;try{if((await e.fs.stat(t)).type==="dir"){const r=a.startsWith(i+"/")?a.slice(i.length+1):a;o=t==="/"?`/${r}`:`${t}/${r}`}else o=t}catch{o=t}try{await e.fs.writeFile(o,s)}catch(d){console.error(`monaco: save error: ${d.message}`)}};window.addEventListener("message",p);const u=l.close;return l.close=()=>{window.removeEventListener("message",p),u()},0}};(globalThis.__tabcomputerLive??=new Map).set("src/commands/monaco-editor.ts",y);(globalThis.__tabcomputerLiveState??=new Map).set("src/commands/monaco-editor.ts",{get activeFile(){return activeFile},set activeFile(e){activeFile=e},get editor(){return editor},set editor(e){editor=e},get models(){return models},get viewStates(){return viewStates},get modified(){return modified},get originals(){return originals}});export{C as monacoEditorCmd};
