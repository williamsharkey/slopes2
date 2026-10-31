const u=Object.freeze(Object.defineProperty({__proto__:null,get termcastCmd(){return w}},Symbol.toStringTag,{value:"Module"}));function m(t){const o=Math.floor(t/1e3),e=Math.floor(o/60),s=o%60;return e>0?`${e}m ${s}s`:`${s}s`}const w={name:"termcast",description:"Record terminal sessions in asciicast format",async exec(t){const o=t.args[0];if(!o||o==="--help"||o==="-h")return t.stdout+=`Usage: termcast <command> [args]

`,t.stdout+=`Commands:
`,t.stdout+=`  start [filename]   Start recording (default: recording.cast)
`,t.stdout+=`  stop               Stop recording and save to file
`,t.stdout+=`  status             Show recording status
`,t.stdout+=`  play <file>        Play back a recording (prints to terminal)
`,t.stdout+=`  export <file>      Export recording as JSON for embedding
`,t.stdout+=`
`,t.stdout+=`The output is in asciicast v2 format, compatible with:
`,t.stdout+=`  - asciinema-player (web)
`,t.stdout+=`  - asciinema (CLI)
`,t.stdout+=`  - Various converters (GIF, SVG, etc.)
`,0;switch(o){case"start":{if(window.__termcastSession)return t.stderr+=`termcast: already recording. Use "termcast stop" first.
`,1;const e=t.args[1]||"recording.cast",s=t.fs.resolvePath(e,t.cwd),n=window.__tabcomputer?.terminal,i=n?.cols||120,r=n?.rows||30;return window.__termcastSession={filename:s,startTime:Date.now(),events:[],width:i,height:r},n&&n.write&&!window.__termcastOriginalWrite&&(window.__termcastOriginalWrite=n.write.bind(n),n.write=a=>{if(window.__termcastSession){const d=(Date.now()-window.__termcastSession.startTime)/1e3;window.__termcastSession.events.push([d,"o",a])}window.__termcastOriginalWrite(a)}),t.stdout+=`Recording started: ${s}
`,t.stdout+=`Terminal size: ${i}x${r}
`,t.stdout+=`Run commands normally. Use "termcast stop" when done.
`,0}case"stop":{const e=window.__termcastSession;if(!e)return t.stderr+=`termcast: not recording. Use "termcast start" first.
`,1;const s=window.__tabcomputer?.terminal;s&&window.__termcastOriginalWrite&&(s.write=window.__termcastOriginalWrite,window.__termcastOriginalWrite=void 0);const n={version:2,width:e.width,height:e.height,timestamp:Math.floor(e.startTime/1e3),title:"tabcomputer Terminal Recording",env:{SHELL:"/bin/sh",TERM:"xterm-256color"}},i=[JSON.stringify(n)];for(const l of e.events)i.push(JSON.stringify(l));const r=i.join(`
`)+`
`;await t.fs.writeFile(e.filename,r);const a=m(Date.now()-e.startTime),d=e.events.length,c=(r.length/1024).toFixed(2);return t.stdout+=`Recording saved: ${e.filename}
`,t.stdout+=`Duration: ${a}
`,t.stdout+=`Events: ${d}
`,t.stdout+=`Size: ${c} KB
`,window.__termcastSession=null,0}case"status":{const e=window.__termcastSession;if(!e)t.stdout+=`Not recording.
`;else{const s=m(Date.now()-e.startTime);t.stdout+=`Recording: ${e.filename}
`,t.stdout+=`Duration: ${s}
`,t.stdout+=`Events: ${e.events.length}
`,t.stdout+=`Size: ${e.width}x${e.height}
`}return 0}case"play":{const e=t.args[1];if(!e)return t.stderr+=`termcast play: missing filename
`,1;try{const n=(await t.fs.readFile(t.fs.resolvePath(e,t.cwd),"utf8")).trim().split(`
`);if(n.length===0)return t.stderr+=`termcast: empty recording
`,1;const i=JSON.parse(n[0]);t.stdout+=`Playing: ${e}
`,t.stdout+=`Size: ${i.width}x${i.height}
`,t.stdout+=`---
`;for(let r=1;r<n.length;r++){const a=JSON.parse(n[r]);a[1]==="o"&&(t.stdout+=a[2])}return t.stdout+=`
---
End of recording.
`,0}catch(s){return t.stderr+=`termcast play: ${s.message}
`,1}}case"export":{const e=t.args[1];if(!e)return t.stderr+=`termcast export: missing filename
`,1;try{const s=await t.fs.readFile(t.fs.resolvePath(e,t.cwd),"utf8"),n=btoa(s);return t.stdout+=`data:application/json;base64,${n}
`,0}catch(s){return t.stderr+=`termcast export: ${s.message}
`,1}}default:return t.stderr+=`termcast: unknown command '${o}'
`,1}}};(globalThis.__tabcomputerLive??=new Map).set("src/commands/termcast.ts",u);export{w as termcastCmd};
