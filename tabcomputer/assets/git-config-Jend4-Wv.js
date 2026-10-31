const f=Object.freeze(Object.defineProperty({__proto__:null,get GLOBAL_GITCONFIG(){return l},get formatGitConfig(){return g},get parseGitConfig(){return u}},Symbol.toStringTag,{value:"Module"})),l="/home/user/.gitconfig";function u(c){const o={};let e="";for(const s of c.split(`
`)){const n=s.trim();if(!n||n.startsWith("#")||n.startsWith(";"))continue;const t=n.match(/^\[([^\s\]"]+)(?:\s+"([^"]*)")?\]$/);if(t){e=t[2]!==void 0?`${t[1]}.${t[2]}`:t[1];continue}const i=n.match(/^([\w-]+)\s*(?:=\s*(.*))?$/);i&&e&&(o[`${e}.${i[1]}`.toLowerCase()]=(i[2]??"true").replace(/^"(.*)"$/,"$1"))}return o}function g(c){const o={};for(const[e,s]of Object.entries(c)){const n=e.lastIndexOf("."),t=e.slice(0,n),i=e.slice(n+1),r=t.indexOf("."),a=r<0?`[${t}]`:`[${t.slice(0,r)} "${t.slice(r+1)}"]`;(o[a]??=[]).push(`	${i} = ${s}`)}return Object.entries(o).map(([e,s])=>[e,...s].join(`
`)).join(`
`)+`
`}(globalThis.__tabcomputerLive??=new Map).set("src/commands/git-config.ts",f);export{l as G,g as f,u as p};
