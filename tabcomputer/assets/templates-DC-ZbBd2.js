import{i as x,A as _,R as y,p as v}from"./manifest-BcVQSdj8.js";import{AppError as d}from"./registry-BbB6rW5d.js";import"./toolchains-Cwsawl3t.js";const $=Object.freeze(Object.defineProperty({__proto__:null,get DEFAULT_TEMPLATE(){return b},get TEMPLATES(){return g},get idFromName(){return x},get scaffold(){return F},get templateFiles(){return w},get titleFromId(){return f}},Symbol.toStringTag,{value:"Module"})),k=`{
  "name": "Files",
  "about": "Makes a tidy, indented copy of each JSON file.",
  "accept": [".json"],
  "run": "jq . {in}",
  "out": "{name}.json"
}
`,E=`{
  "name": "Form",
  "about": "Counts from one number to another.",
  "fields": {
    "first": { "label": "From", "type": "number", "value": 1 },
    "step": { "label": "Step", "type": "number", "value": 1 },
    "last": { "label": "To", "type": "number", "value": 10 }
  },
  "run": "seq {first} {step} {last}"
}
`,j=`{
  "manifest": 1,
  "id": "page",
  "name": "Page",
  "description": "Drop files, run a program on each, download the results.",
  "version": "0.1.0",
  "icon": "icon.svg",
  "window": { "width": 560, "height": 520, "minWidth": 300, "minHeight": 300 },
  "entry": "public",
  "access": {
    "fs": [],
    "network": false,
    "commands": ["base64"]
  }
}
`,A=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="6" y="6" width="52" height="52" rx="12" fill="#2f7d5b"/><path d="M22 18h14l8 8v20H22z" fill="none" stroke="#fff" stroke-width="3.5" stroke-linejoin="round"/><path d="M27 37l5 5 5-5M32 28v13" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
`,S=`// File in → file out. Change PROGRAM and outName() to make it yours, and list
// the program in app.json under access.commands: the page may run only those.
(async function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const state = { rows: [], out: '' };
  window.__app = state; // for tests

  await tab.ready;
  // Results go to a folder of the app's own data; a new one each time the page loads
  state.out = \`\${tab.app.dataDir}/out/\${Date.now().toString(36)}\`;

  // The program run on each file, as [name, ...arguments]: no shell, so a file's name is only ever one argument
  const PROGRAM = (path) => ['base64', path];
  const outName = (rel) => rel + '.b64';

  function row(rel) {
    const li = document.createElement('li');
    const name = document.createElement('span');
    name.className = 'name';
    name.textContent = rel;
    const st = document.createElement('span');
    st.className = 'state';
    st.textContent = 'waiting';
    li.append(name, st);
    $('list').append(li);
    const r = { rel, li, st, status: 'waiting', error: '' };
    state.rows.push(r);
    return r;
  }
  function set(r, status, error) {
    r.status = status;
    r.error = error || '';
    r.st.textContent = status === 'failed' ? \`failed: \${r.error}\` : status;
    r.li.className = status === 'done' ? 'ok' : status === 'failed' ? 'bad' : '';
    const done = state.rows.filter((x) => x.status === 'done').length;
    const left = state.rows.filter((x) => x.status === 'waiting' || x.status === 'working').length;
    $('work').hidden = false;
    $('summary').textContent = left ? \`Working: \${state.rows.length - left} of \${state.rows.length}\` : \`\${done} done\${done < state.rows.length ? \`, \${state.rows.length - done} failed\` : ''}\`;
    $('zip').disabled = !done || left > 0;
  }

  async function take(imported) {
    // imported.files: [{ path, rel, size }], already in the tab's filesystem
    const rows = imported.files.map((f) => ({ f, r: row(f.rel) }));
    for (const { f, r } of rows) {
      set(r, 'working');
      try {
        const res = await tab.run(PROGRAM(f.path), { stdout: \`\${state.out}/\${outName(f.rel)}\` });
        if (res.code === 0) set(r, 'done');
        else set(r, 'failed', res.stderr.trim().split('\\n').pop() || \`exit \${res.code}\`);
      } catch (e) { set(r, 'failed', e.message); }
    }
  }

  const drop = $('drop');
  for (const t of ['dragenter', 'dragover']) drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.add('over'); });
  for (const t of ['dragleave', 'drop']) drop.addEventListener(t, () => drop.classList.remove('over'));
  // A file dropped beside the box must not replace the page
  window.addEventListener('dragover', (e) => e.preventDefault());
  window.addEventListener('drop', (e) => e.preventDefault());
  drop.addEventListener('drop', (e) => {
    e.preventDefault();
    // (call import inside the event: a dropped folder's entries can only be read now)
    tab.files.import(e.dataTransfer).then(take);
  });
  $('pick').addEventListener('click', () => tab.files.pick().then(take));
  $('zip').addEventListener('click', () => tab.download(state.out, { zip: true, name: 'results.zip' }));

  document.documentElement.setAttribute('data-ready', '1');
})();
`,T=`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{{name}}</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<main>
  <h1>{{name}}</h1>
  <p class="sub">Each file you drop is run through a program in this tab. Nothing is uploaded.</p>
  <section id="drop" tabindex="0" aria-label="Drop files or a folder here">
    <p class="big">Drop files or a folder here</p>
    <button id="pick" class="btn" type="button">Choose files</button>
  </section>
  <section id="work" hidden>
    <div class="bar">
      <span id="summary" role="status" aria-live="polite"></span>
      <button id="zip" class="btn primary" type="button" disabled>Download all (.zip)</button>
    </div>
    <ul id="list"></ul>
  </section>
</main>
<script src="/__tabcomputer/tab.js"><\/script>
<script src="app.js"><\/script>
</body>
</html>
`,D=`:root { color-scheme: light dark; }
* { box-sizing: border-box; }
body { margin: 0; font: 15px/1.5 system-ui, sans-serif; }
main { max-width: 640px; margin: 0 auto; padding: 18px 16px 32px; }
h1 { font-size: 20px; margin: 0 0 4px; }
.sub { margin: 0 0 14px; opacity: .7; }
#drop { border: 2px dashed #8886; border-radius: 12px; padding: 26px 16px; text-align: center; }
#drop.over { border-color: #2f7d5b; background: #2f7d5b18; }
.big { font-size: 17px; margin: 0 0 12px; }
.btn { font: inherit; min-height: 38px; padding: 6px 16px; border-radius: 9px; border: 1px solid #8886; background: transparent; color: inherit; cursor: pointer; }
.btn.primary { background: #2f7d5b; border-color: transparent; color: #fff; }
.btn:disabled { opacity: .5; cursor: default; }
.bar { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; justify-content: space-between; margin: 18px 0 8px; }
ul { list-style: none; margin: 0; padding: 0; }
li { display: flex; gap: 10px; justify-content: space-between; padding: 7px 0; border-top: 1px solid #8883; }
li .name { overflow-wrap: anywhere; }
li .state { flex: none; opacity: .7; }
li.ok .state { color: #2f7d5b; opacity: 1; }
li.bad .state { color: #c0392b; opacity: 1; flex: 0 1 60%; text-align: right; overflow-wrap: anywhere; }
`,L=`{
  "manifest": 1,
  "id": "script",
  "name": "Script",
  "description": "A script with a Run button: its output on the page as it is written.",
  "version": "0.1.0",
  "icon": "icon.svg",
  "window": { "width": 600, "height": 460, "minWidth": 300, "minHeight": 240 },
  "entry": "public",
  "access": {
    "fs": [],
    "network": false,
    "commands": ["sh"]
  }
}
`,M=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="6" y="6" width="52" height="52" rx="12" fill="#2b3a55"/><path d="M19 24l9 8-9 8M33 41h13" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
`,C=`// A script as an app (\`app new NAME --from script.sh\`): run.sh in the app's
// folder, started with the Run button, its output shown as it is written.
(async function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const state = { runs: 0, code: null, output: '' };
  window.__app = state; // for tests

  await tab.ready;
  let running = null;
  $('run').addEventListener('click', async () => {
    if (running) return;
    const out = $('out');
    out.textContent = '';
    state.output = '';
    state.code = null;
    $('run').disabled = true;
    $('stop').disabled = false;
    $('status').textContent = 'Running…';
    const show = (s) => { state.output += s; out.textContent += s; out.scrollTop = out.scrollHeight; };
    const args = $('args').value.split('\\n').filter((l) => l !== '');
    try {
      // The script runs in the app's data folder; each line of the box is one argument
      running = tab.run(['sh', \`\${tab.app.dir}/run.sh\`, ...args], { cwd: tab.app.dataDir, onStdout: show, onStderr: show });
      const { code } = await running;
      state.code = code;
      $('status').textContent = code === 0 ? 'Done' : \`Exit status \${code}\`;
    } catch (err) {
      state.code = -1;
      $('status').textContent = \`Failed: \${err.message}\`;
    }
    state.runs++;
    running = null;
    $('run').disabled = false;
    $('stop').disabled = true;
  });
  $('stop').addEventListener('click', () => running && running.kill());

  document.documentElement.setAttribute('data-ready', '1');
})();
`,z=`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{{name}}</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<main>
  <h1>{{name}}</h1>
  <label class="args">Arguments, one per line
    <textarea id="args" rows="2" spellcheck="false"></textarea>
  </label>
  <div class="row">
    <button id="run" class="btn primary" type="button">Run</button>
    <button id="stop" class="btn" type="button" disabled>Stop</button>
    <span id="status" role="status" aria-live="polite"></span>
  </div>
  <pre id="out" aria-label="Output"></pre>
</main>
<script src="/__tabcomputer/tab.js"><\/script>
<script src="app.js"><\/script>
</body>
</html>
`,N=`:root { color-scheme: light dark; }
* { box-sizing: border-box; }
body { margin: 0; font: 15px/1.5 system-ui, sans-serif; }
main { max-width: 720px; margin: 0 auto; padding: 18px 16px 24px; display: flex; flex-direction: column; min-height: 100vh; }
h1 { font-size: 20px; margin: 0 0 10px; }
.args { display: flex; flex-direction: column; gap: 3px; font-size: 13px; opacity: .85; }
textarea { font: 13px/1.45 ui-monospace, monospace; padding: 6px 10px; border-radius: 9px; border: 1px solid #8886; background: transparent; color: inherit; width: 100%; resize: vertical; }
.row { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-top: 10px; }
.btn { font: inherit; min-height: 38px; padding: 6px 18px; border-radius: 9px; border: 1px solid #8886; background: transparent; color: inherit; cursor: pointer; }
.btn.primary { background: #2b3a55; border-color: transparent; color: #fff; }
.btn:disabled { opacity: .5; cursor: default; }
pre { flex: 1; min-height: 140px; margin: 14px 0 0; padding: 10px 12px; overflow: auto; white-space: pre-wrap; overflow-wrap: anywhere; border: 1px solid #8884; border-radius: 9px; font: 13px/1.45 ui-monospace, monospace; }
`,O=`#!/bin/sh
# The script this app runs. Its arguments are what was typed in the app's
# "Arguments" box, one per line.
echo "Hello from $APP_ID."
echo "Arguments: $#"
for a in "$@"; do echo "  $a"; done
`,R=`{
  "name": "Table",
  "about": "A list of people, kept as a CSV file.",
  "table": "people.csv",
  "columns": [
    "Name",
    "Email",
    { "name": "Joined", "type": "date" },
    { "name": "Member", "type": "checkbox" }
  ]
}
`,g=[{name:"files",title:"A command on each file",description:"one file, app.json: give it files, a command runs on each, download the results"},{name:"form",title:"A form over a command",description:"one file, app.json: labelled fields fill a command; its output shows as it is written"},{name:"table",title:"A table in a file",description:"one file, app.json: a CSV or SQLite file as a table to add to, edit, sort and filter"},{name:"page",title:"An app with its own page",description:"five files: app.json, an icon, and a page (HTML, CSS, JavaScript) that uses tab.js"},{name:"script",title:"A script with a Run button",description:"what `app new NAME --from script.sh` makes"}],b="files",P=Object.assign({"../../apps/templates/files/app.json":k,"../../apps/templates/form/app.json":E,"../../apps/templates/page/app.json":j,"../../apps/templates/page/icon.svg":A,"../../apps/templates/page/public/app.js":S,"../../apps/templates/page/public/index.html":T,"../../apps/templates/page/public/style.css":D,"../../apps/templates/script/app.json":L,"../../apps/templates/script/icon.svg":M,"../../apps/templates/script/public/app.js":C,"../../apps/templates/script/public/index.html":z,"../../apps/templates/script/public/style.css":N,"../../apps/templates/script/run.sh":O,"../../apps/templates/table/app.json":R});function w(n){const t=`../../apps/templates/${n}/`,e=new Map;for(const[s,r]of Object.entries(P))s.startsWith(t)&&e.set(s.slice(t.length),r);return e}const f=n=>{const t=n.replace(/-+/g," ").trim();return t.charAt(0).toUpperCase()+t.slice(1)};async function F(n,t,e,s={}){if(!_.test(e))throw new d(`an app's id is 2 to 32 of a-z, 0-9 and -, starting with a letter (got ${JSON.stringify(e)})`);if(y.has(e))throw new d(`the id ${e} is taken by tabcomputer itself`);const r=s.script!==void 0?"script":s.template??b,c=w(r);if(!c.size)throw new d(`no template named ${r} (templates: ${g.map(a=>a.name).join(", ")})`);if(await n.exists(t)&&(!(await n.stat(t)).isDirectory()||(await n.readdir(t)).length))throw new d(`${t} already exists and is not empty`);const u=(s.name??f(e)).replace(/[<>]/g,"").slice(0,60)||f(e),h=[];for(const[a,p]of[...c].sort(([o],[i])=>o.localeCompare(i))){let o=p;if(a==="app.json"){const l=t.slice(t.lastIndexOf("/")+1);if(c.size===1)o=p.replace(/"name": "[^"]*"/,()=>`${l===e?"":`"id": ${JSON.stringify(e)},
  `}"name": ${JSON.stringify(u)}`);else{const m=JSON.parse(p);m.id=e,m.name=u,o=JSON.stringify(m,null,2)+`
`}v(o,{id:l})}else a.endsWith(".html")?o=p.replace(/\{\{name\}\}/g,u.replace(/[&<>]/g,l=>`&#${l.charCodeAt(0)};`)):a==="run.sh"&&s.script!==void 0&&(o=s.script.endsWith(`
`)?s.script:s.script+`
`);const i=`${t}/${a}`;await n.mkdir(i.slice(0,i.lastIndexOf("/")),{recursive:!0}),await n.writeFile(i,o),a.endsWith(".sh")&&await n.chmod?.(i,493).catch(()=>{}),h.push(a)}return h}(globalThis.__tabcomputerLive??=new Map).set("src/apps/templates.ts",$);export{b as DEFAULT_TEMPLATE,g as TEMPLATES,x as idFromName,F as scaffold,w as templateFiles,f as titleFromId};
