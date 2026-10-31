const $=Object.freeze(Object.defineProperty({__proto__:null,get imageCmd(){return w},get shiroImageCmd(){return E}},Symbol.toStringTag,{value:"Module"}));async function v(e,t,n,i){const l=await e.readdir(t);for(const r of l){const a=t+(t.endsWith("/")?"":"/")+r,o=await e.stat(a);if(o){if(o.type==="dir")i.directories++,await v(e,a,n,i);else if(o.type==="file"){const d=await e.readFile(a),c=typeof d=="string"||y(d);let g,s;typeof d=="string"?(g=d,s="utf8"):c?(g=new TextDecoder().decode(d),s="utf8"):(g=btoa(String.fromCharCode(...d)),s="base64"),n.push({path:a,content:g,encoding:s,mode:o.mode||420,mtime:o.mtime?.getTime()||Date.now()}),i.fileCount++,i.totalSize+=d.length}}}}function y(e){const t=e.slice(0,1e3);let n=0;for(const i of t)(i<9||i>13&&i<32||i===127)&&n++;return n/t.length<.1}async function b(e,t,n,i){const l=e.fs,r="/home/user/shiro-images";await l.exists(r)||await l.mkdir(r,{recursive:!0});const a={version:"1.0",created:new Date().toISOString(),description:n,files:[],stats:{fileCount:0,totalSize:0,directories:0}};e.stdout=`Collecting files...
`;for(const s of i){const m=l.resolvePath(s,e.cwd);let f;try{f=await l.stat(m)}catch{e.stderr=`image: directory not found: ${s}
`;continue}if(f.type!=="dir"){e.stderr=`image: not a directory: ${s}
`;continue}a.stats.directories++,await v(l,m,a.files,a.stats)}const o=["HOME","USER","PWD","PATH","SHELL","TERM","NODE_ENV"];a.env={};for(const s of o)e.env[s]&&(a.env[s]=e.env[s]);const d=`${r}/${t}.json`,c=JSON.stringify(a,null,2);await l.writeFile(d,c);const g=(c.length/1024).toFixed(1);return e.stdout=`Saved image "${t}" to ${d}
`,e.stdout+=`  Files: ${a.stats.fileCount}
`,e.stdout+=`  Directories: ${a.stats.directories}
`,e.stdout+=`  Size: ${g} KB
`,e.stdout+=`  Description: ${n}
`,0}async function S(e,t,n){const i=e.fs,l=[`/home/user/shiro-images/${t}.json`,`/home/user/shiro-images/${t}`,t];let r=null;for(const s of l){const m=i.resolvePath(s,e.cwd);if(await i.exists(m)){r=m;break}}if(!r){e.stderr=`image: image not found: ${t}
`,e.stderr+=`Searched:
`;for(const s of l)e.stderr+=`  ${i.resolvePath(s,e.cwd)}
`;return 1}const a=await i.readFile(r,"utf8");let o;try{o=JSON.parse(a)}catch(s){return e.stderr=`image: invalid image file: ${s instanceof Error?s.message:"parse error"}
`,1}if(!o.version||!o.files)return e.stderr=`image: invalid image format
`,1;e.stdout=`Loading image "${t}"...
`,e.stdout+=`  Description: ${o.description}
`,e.stdout+=`  Created: ${o.created}
`,e.stdout+=`  Files: ${o.stats?.fileCount||o.files.length}
`;const d=n?i.resolvePath(n,e.cwd):"";let c=0,g=0;for(const s of o.files)try{let m=s.path;if(d){const u=s.path.indexOf("/",1),h=u>0?s.path.substring(u):s.path;m=d+h}const f=m.substring(0,m.lastIndexOf("/"));f&&!await i.exists(f)&&await i.mkdir(f,{recursive:!0});let p;if(s.encoding==="base64"){const u=atob(s.content);p=new Uint8Array(u.length);for(let h=0;h<u.length;h++)p[h]=u.charCodeAt(h)}else p=s.content;await i.writeFile(m,p),c++}catch(m){e.stderr+=`  Error restoring ${s.path}: ${m instanceof Error?m.message:"unknown"}
`,g++}if(o.env)for(const[s,m]of Object.entries(o.env))e.env[s]=m;return e.stdout+=`Restored ${c} files
`,g>0&&(e.stdout+=`Errors: ${g}
`),g>0?1:0}async function C(e){const t=e.fs,n="/home/user/shiro-images";if(!await t.exists(n))return e.stdout=`No images found
`,e.stdout+=`Images are stored in ${n}
`,0;const l=(await t.readdir(n)).filter(r=>r.endsWith(".json"));if(l.length===0)return e.stdout=`No images found
`,0;e.stdout=`Available images:
`;for(const r of l){const a=`${n}/${r}`;try{const o=await t.readFile(a,"utf8"),d=JSON.parse(o),c=(o.length/1024).toFixed(1),g=r.replace(".json","");e.stdout+=`  ${g}
`,e.stdout+=`    ${d.description||"No description"}
`,e.stdout+=`    ${d.stats?.fileCount||d.files?.length||"?"} files, ${c} KB
`,e.stdout+=`    Created: ${d.created||"unknown"}
`}catch{e.stdout+=`  ${r.replace(".json","")} (unreadable)
`}}return 0}async function D(e,t){const n=e.fs,i=`/home/user/shiro-images/${t}.json`;return await n.exists(i)?(await n.unlink(i),e.stdout=`Deleted image: ${t}
`,0):(e.stderr=`image: image not found: ${t}
`,1)}const P=`shiro image <command> [options]

Commands:
  save <name> [directories...]   Save filesystem state to an image
  load <name> [target]           Load an image into the filesystem
  list                           List available images
  delete <name>                  Delete an image

Options:
  -d, --description <text>       Description for saved image

Examples:
  # Save node_modules as an image
  shiro image save react-18 /home/user/myapp/node_modules -d "React 18 + deps"

  # Load an image
  shiro image load react-18

  # Load image to a specific directory
  shiro image load react-18 /home/user/newproject

  # List images
  shiro image list

  # Delete an image
  shiro image delete old-image

Use Cases:
  - Fast test setup: Pre-install dependencies once, load instantly in tests
  - Share configurations: Export and share development environments
  - Backup state: Save filesystem state before risky operations`,w={name:"image",description:"Manage tabcomputer images (filesystem snapshots)",async exec(e){const t=e.args;if(t.length===0||t[0]==="--help"||t[0]==="-h")return e.stdout=P+`
`,0;const n=t[0];switch(n){case"save":{if(t.length<2)return e.stderr=`image save: missing name
`,1;const i=t[1];let l="";const r=[];for(let a=2;a<t.length;a++)t[a]==="-d"||t[a]==="--description"?l=t[++a]||"":r.push(t[a]);return r.length===0&&r.push(e.cwd),b(e,i,l||`Image created ${new Date().toLocaleDateString()}`,r)}case"load":{if(t.length<2)return e.stderr=`image load: missing name
`,1;const i=t[1],l=t[2];return S(e,i,l)}case"list":case"ls":return C(e);case"delete":case"rm":return t.length<2?(e.stderr=`image delete: missing name
`,1):D(e,t[1]);default:return e.stderr=`image: unknown command: ${n}
`,e.stderr+=`Run 'image --help' for usage
`,1}}},E=w;(globalThis.__tabcomputerLive??=new Map).set("src/commands/image.ts",$);export{w as imageCmd,E as shiroImageCmd};
