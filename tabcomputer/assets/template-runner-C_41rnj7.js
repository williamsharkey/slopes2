import{aV as y,ab as m}from"./index-BIxBofyG.js";const k=Object.freeze(Object.defineProperty({__proto__:null,get runLivingTemplate(){return I}},Symbol.toStringTag,{value:"Module"}));function b(a,t,r){const n=`
<script>
(function() {
  var templateId = ${JSON.stringify(t)};
  var checkpoints = ${JSON.stringify(r)};

  // Load saved progress (stored in parent's localStorage via postMessage)
  var progressKey = 'tabcomputer-template-progress-' + templateId;
  var completed = {};

  // Expose to guide page
  window.__bridge = {
    templateId: templateId,
    checkpoints: checkpoints,
    completed: completed,
    saveProgress: function() {
      parent.postMessage({
        type: 'shiro-guide-save-progress',
        key: progressKey,
        value: JSON.stringify(completed)
      }, '*');
    },
    // Send a check request to the parent
    checkFile: function(path, contains) {
      parent.postMessage({
        type: 'shiro-guide-check',
        checkType: contains ? 'file-contains' : 'file-exists',
        path: path,
        pattern: contains || null,
        requestId: Math.random().toString(36).slice(2)
      }, '*');
    },
    // Ask parent to run a command in the terminal
    execInTerminal: function(command) {
      parent.postMessage({
        type: 'shiro-guide-exec',
        command: command
      }, '*');
    },
    // Report progress
    reportProgress: function(step, total) {
      parent.postMessage({
        type: 'shiro-guide-progress',
        templateId: templateId,
        step: step,
        total: total
      }, '*');
    },
    // Mark a checkpoint as complete
    completeCheckpoint: function(id) {
      completed[id] = true;
      this.saveProgress();
      this.reportProgress(
        Object.keys(completed).length,
        checkpoints.length
      );
    }
  };

  // Listen for results from parent
  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'shiro-guide-result') {
      var evt = new CustomEvent('shiro-check-result', { detail: e.data });
      window.dispatchEvent(evt);
    }
    if (e.data && e.data.type === 'shiro-guide-fs-change') {
      var evt2 = new CustomEvent('shiro-fs-change', { detail: e.data });
      window.dispatchEvent(evt2);
    }
    if (e.data && e.data.type === 'shiro-guide-loaded-progress') {
      try {
        var saved = JSON.parse(e.data.value || '{}');
        for (var k in saved) { completed[k] = saved[k]; }
        window.dispatchEvent(new CustomEvent('shiro-progress-loaded', { detail: completed }));
      } catch(e) {}
    }
  });

  // Request saved progress from parent
  parent.postMessage({ type: 'shiro-guide-load-progress', key: progressKey }, '*');
})();
<\/script>`;return a.includes("</body>")?a.replace("</body>",n+`
</body>`):a+n}async function I(a,t){const r=a.fs;await r.mkdir(t.workDir,{recursive:!0});for(const e of t.setup)await a.execute(e,()=>{},()=>{});const n=`/tmp/.guides/${t.id}`;await r.mkdir(n,{recursive:!0});const f=b(t.guideHtml,t.id,t.checkpoints);await r.writeFile(`${n}/index.html`,f),await a.execute(`serve ${n} ${t.guidePort}`,()=>{},()=>{});const{pid:g}=y(a,`cd ${t.workDir}`,t.name,t.guidePort),l=async e=>{if(!e.data||typeof e.data.type!="string")return;const d=document.querySelector("[data-server-window]");if(!d)return;const c=d.querySelector(`iframe[data-virtual-port="${t.guidePort}"]`);if(e.data.type==="shiro-guide-check"){const{checkType:s,path:o,pattern:p,requestId:u}=e.data;let i=!1;try{s==="file-exists"?i=await r.exists(o):s==="file-contains"?i=(await r.readFile(o,"utf8")).includes(p):s==="command-succeeds"&&(i=await a.execute(e.data.command,()=>{},()=>{})===0)}catch{i=!1}c?.contentWindow?.postMessage({type:"shiro-guide-result",passed:i,requestId:u,checkType:s,path:o},"*")}if(e.data.type==="shiro-guide-exec"){const s=m.get(g);if(s?.windowTerminal){const o=s.windowTerminal,p=e.data.command;for(const u of p)o.term.paste(u),await new Promise(i=>setTimeout(i,30));o.term.paste("\r")}}if(e.data.type==="shiro-guide-save-progress")try{localStorage.setItem(e.data.key,e.data.value)}catch{}if(e.data.type==="shiro-guide-load-progress"){const s=localStorage.getItem(e.data.key)||"{}";c?.contentWindow?.postMessage({type:"shiro-guide-loaded-progress",value:s},"*")}e.data.type};window.addEventListener("message",l);const h=r.onChange((e,d,c)=>{const s=document.querySelectorAll(`iframe[data-virtual-port="${t.guidePort}"]`);for(const o of s)o.contentWindow?.postMessage({type:"shiro-guide-fs-change",event:e,path:d,newPath:c},"*")}),v=setInterval(()=>{const e=m.get(g);(!e||e.status!=="running")&&(window.removeEventListener("message",l),h(),clearInterval(v))},2e3)}(globalThis.__tabcomputerLive??=new Map).set("src/template-runner.ts",k);export{I as runLivingTemplate};
