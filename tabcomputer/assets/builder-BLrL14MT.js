import{m as l}from"./index-BIxBofyG.js";const d=Object.freeze(Object.defineProperty({__proto__:null,get builderCmd(){return n}},Symbol.toStringTag,{value:"Module"})),n={name:"builder",description:"AI app builder (chat + live preview)",async exec(e){const t=e.args[0]||"/tmp/builder-app";try{await e.fs.mkdir(t,{recursive:!0}),await e.fs.exists(`${t}/index.html`)||await e.fs.writeFile(`${t}/index.html`,`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Builder App</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: #0f0f23;
      color: #cdd6f4;
    }
    .welcome {
      text-align: center;
      padding: 2rem;
    }
    h1 { color: #89b4fa; margin-bottom: 0.5rem; }
    p { color: #a6adc8; }
  </style>
</head>
<body>
  <div class="welcome">
    <h1>Builder</h1>
    <p>Describe what you want to build in the terminal on the left.</p>
    <p>Claude will write the code and this preview will update live.</p>
  </div>
</body>
</html>`)}catch{}const i=e.shell.commands.get("serve");if(!i)return e.stderr=`builder: serve command not available
`,1;const r=4e3+Math.floor(Math.random()*1e3);await i.exec({...e,args:[t,String(r),"--split","right"],stdout:"",stderr:""});const a=e.shell.commands.get("spawn");if(!a)return e.stderr=`builder: spawn command not available
`,1;try{await e.fs.writeFile(`${t}/AGENTS.md`,`# AGENTS.md

## Builder Mode

You are building a web app in this directory. The preview is live.

## Rules
- Write app files in this directory.
- The entry point is \`index.html\`.
- Keep the structure simple unless the user asks for more.
- Use vanilla HTML/CSS/JS unless the user requests a framework.
- After edits, the preview updates automatically.
`),await e.fs.writeFile(`${t}/CLAUDE.md`,`# CLAUDE.md

Deprecated. Read \`./AGENTS.md\`.
`)}catch{}const s=`cd ${t} && ${await l(e.fs)}`;return await a.exec({...e,args:[s],stdout:"",stderr:""}),e.stdout=`Builder started:
  App dir:  ${t}
  Preview:  localhost:${r} (split right)
  Claude:   spawned in windowed terminal

Describe what you want to build in the Claude window.
`,0}};(globalThis.__tabcomputerLive??=new Map).set("src/commands/builder.ts",d);export{n as builderCmd};
