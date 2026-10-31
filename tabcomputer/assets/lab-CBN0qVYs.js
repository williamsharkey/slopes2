const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./toolchain-CdqyZqe2.js","./index-C6zxlZK4.js","./index-LZoznX6r.css"])))=>i.map(i=>d[i]);
import{a as H}from"./index-C6zxlZK4.js";import{GH_OWNER as N,GH_REPO as I,labFolder as C,shq as $}from"./run-url-BhZeBfd4.js";import{G as L}from"./credentials-CrExaRSJ.js";import{readLabConfig as v,LAB_CONFIG_PATH as b,submitLab as A,labState as G,UNSAVED_TEXT as P,unsavedReason as j,SAVED_TEXT as D}from"./lab-T0C4dWxF.js";import"./link-fragment-DNd4gDx5.js";import"./gitstatus-BoVh_pdE.js";const K=Object.freeze(Object.defineProperty({__proto__:null,get labCmd(){return W}},Symbol.toStringTag,{value:"Module"})),U=`usage: lab open OWNER/REPO
       lab run | test | submit | status | check
`;function S(e){if(e.env.GITHUB_TOKEN||e.env.GH_TOKEN)return e.env.GITHUB_TOKEN||e.env.GH_TOKEN;try{return localStorage.getItem(L)||""}catch{return""}}const W={name:"lab",description:"Class repositories: open one, run it, test it, submit it",async exec(e){const E=t=>e.terminal?(e.terminal.writeOutput(t.replace(/\r?\n/g,`\r
`)),!0):!1,r=t=>{e.streamStdout?e.streamStdout(t):E(t)||(e.stdout+=t)},n=t=>{e.streamStderr?e.streamStderr(t):E(t)||(e.stderr+=t)},d=t=>e.shell.execute(t,r,n,!1,e.terminal,!0),w=e.env.HOME||"/home/user",_=t=>t===w||t.startsWith(w+"/")?"~"+t.slice(w.length):t,[i,...R]=e.args;if(i==="open"){const t=/^(?:https?:\/\/github\.com\/)?([^/\s]+)\/([^/\s]+?)(?:\.git)?\/?$/.exec(R[0]??"");if(!t||!N.test(t[1])||!I.test(t[2])||t[2].startsWith("."))return n(`lab: name the repository as OWNER/REPO
`),2;const[,l,p]=t,c=`${l}/${p}`;let f;try{f=await C(e.fs,w,l,p)}catch(o){return n(`lab: ${o.message}
`),1}const{dir:s}=f;if(!f.cloned){const o=async()=>(await e.fs.mkdir(s.slice(0,s.lastIndexOf("/")),{recursive:!0}),await d(`builtin git clone -- ${$(`https://github.com/${c}`)} ${$(s)}`)===0&&await e.fs.exists(`${s}/.git`).catch(()=>!1)?!0:(await d(`rm -rf -- ${$(s)}`),!1));r(`Copying ${c} from GitHub to ${_(s)}.
`);let u=await o();if(!u&&!S(e)){if(r(`GitHub did not give ${c} to a tab that is not signed in: the repository is private, or the name is wrong.
Sign in to GitHub to go on.
`),await d("gh auth login")!==0||!S(e))return n(`lab: not signed in to GitHub, so ${c} was not opened. Open the link again to retry.
`),1;u=await o()}if(!u)return n(`lab: GitHub did not let this account copy ${c}. Check the name, and ask the teacher whether this account has access.
`),1}const a=await v(e.fs,s);a?a.config||n(a.problems.map(o=>`lab: ${o}
`).join("")):r(`${c} has no ${b}, so the Code app shows no Run, Test or Submit buttons for it.
`);for(const o of a?.config?.toolchains??[]){let u=!1;try{const{listToolchains:h}=await H(async()=>{const{listToolchains:k}=await import("./toolchain-CdqyZqe2.js");return{listToolchains:k}},__vite__mapDeps([0,1,2]),import.meta.url),O=(await h(e.fs)).find(k=>k.id===o);if(!O){n(`lab: ${b} names the toolchain ${o}, which this computer does not have (toolchain list shows them).
`);continue}u=O.installed}catch{}u||(r(`Installing the ${o} toolchain, which ${b} names.
`),await d(`toolchain install ${o}`)!==0&&n(`lab: the ${o} toolchain did not install. Run "toolchain install ${o}" to try again.
`))}await d(`cd ${$(s)}`);const m=globalThis.__shiroDesktop,y=m?.windows().find(o=>o.appId==="code"&&o.codeDir===s);if(y)y.focus();else{await d("code .");const o=m?.windows().find(h=>h.kind==="terminal"&&!!e.terminal&&!!h.content?.terminals?.().includes(e.terminal)),u=m?.windows().find(h=>h.appId==="code"&&h.codeDir===s);m&&!m.compact&&o&&u&&(u.snap?.("left"),o.snap?.("right"))}let T="";const g=a?.config?.notebook;if(g&&a){const o=`${a.dir}/${g}`;await e.fs.exists(o).catch(()=>!1)?m&&await d(`jupyter notebook ${$(o)}`)===0?T=` The notebook ${g} is open in the Notebook app.`:m||(T=` Run the notebook with: jupyter execute ${g}`):n(`lab: ${b} names the notebook ${g}, which is not in the repository.
`)}return r(`${c} is open in ${_(s)}.${a?.config?" Run, Test and Submit are at the top of the Code app. Submit sends the work to GitHub.":""}${T}
`),0}if(i==="run"||i==="test"||i==="check"){const t=await v(e.fs,e.cwd);if(!t)return n(`lab: this folder has no ${b}
`),1;if(!t.config)return n(t.problems.map(p=>`lab: ${p}
`).join("")),1;if(i==="check")return r(`${_(t.dir)}/${b} is valid.
  toolchains: ${t.config.toolchains.join(", ")||"none"}
  run: ${t.config.run||"none"}
  test: ${t.config.test||"none"}
`),0;const l=i==="run"?t.config.run:t.config.test;return l?d(`( cd ${$(t.dir)} && ${l} )`):(n(`lab: ${b} names no ${i} command
`),1)}if(i==="submit"){const t=e.shell.fork(),l=await A(e.fs,e.cwd,{run:async p=>{const c=await G(e.fs,e.cwd);t.cwd=c?.root??e.cwd;let f="";return{code:await t.execute(p,a=>{f+=a},a=>{f+=a}),out:f}}});return(l.ok?r:n)(l.text+`
`),l.ok?0:1}if(i==="status"){const t=await G(e.fs,e.cwd);return t?t.remote?(r(t.unsaved?`${P}: ${j(t)} (github.com/${t.remote}).
`:`${D}: github.com/${t.remote}, branch ${t.branch??""}, commit ${t.head}.
`),t.unsaved?1:0):(r(`This repository has no GitHub address (no origin remote on github.com).
`),0):(n(`lab: this folder is not in a git repository
`),1)}return(i&&i!=="help"&&i!=="--help"?n:r)(U),i&&i!=="help"&&i!=="--help"?2:0}};(globalThis.__tabcomputerLive??=new Map).set("src/commands/lab.ts",K);(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/commands/toolchain.ts",()=>H(()=>import("./toolchain-CdqyZqe2.js"),__vite__mapDeps([0,1,2]),import.meta.url));export{W as labCmd};
