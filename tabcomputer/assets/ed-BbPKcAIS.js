const L=Object.freeze(Object.defineProperty({__proto__:null,get edCmd(){return _}},Symbol.toStringTag,{value:"Module"})),_={name:"ed",description:"Line editor",async exec(n){const $=n.args[0]||"";let e=[],r=0,u=!1,f=$;if(f){const o=n.fs.resolvePath(f,n.cwd);try{const l=await n.fs.readFile(o),s=typeof l=="string"?l:new TextDecoder().decode(l);e=s.split(`
`),e.length>0&&e[e.length-1]===""&&e.pop(),r=e.length,n.stdout+=`${new TextEncoder().encode(s).length}
`}catch{n.stdout+=`${f}: No such file or directory
`}}const m=n.stdin?n.stdin.split(`
`):[];let k=0;function w(){return k>=m.length?null:m[k++]}function b(o){if(o===".")return r;if(o==="$")return e.length;if(/^\d+$/.test(o))return parseInt(o);if(o.startsWith("/")&&o.endsWith("/")){const l=new RegExp(o.slice(1,-1));for(let s=r;s<e.length;s++)if(l.test(e[s]))return s+1;for(let s=0;s<r;s++)if(l.test(e[s]))return s+1}return r}function y(o){if(o.startsWith("%"))return{start:1,end:e.length,op:o.slice(1)};const l=o.match(/^(\d+|\$|\.|\/.+?\/)?,?(\d+|\$|\.|\/.+?\/)?(.*)$/);if(!l)return{start:r,end:r,op:o};const s=l[3]||"";if(l[1]&&l[2])return{start:b(l[1]),end:b(l[2]),op:s};if(l[1]){const c=b(l[1]);return{start:c,end:c,op:s}}return{start:r,end:r,op:s}}for(;;){const o=w();if(o===null)break;const l=o.trim();if(l==="")continue;const{start:s,end:c,op:v}=y(l),d=v.trim()||l;switch(d[0]){case"q":return 0;case"w":{const t=d.startsWith("wq"),i=(t?d.slice(2).trim():d.slice(1).trim())||f;if(!i){n.stderr+=`?
`;continue}f=i;const a=e.join(`
`)+`
`,h=n.fs.resolvePath(f,n.cwd);if(await n.fs.writeFile(h,a),n.stdout+=`${new TextEncoder().encode(a).length}
`,u=!1,t)return 0;break}case"p":{for(let t=s-1;t<c&&t<e.length;t++)n.stdout+=e[t]+`
`;r=Math.min(c,e.length);break}case"n":{for(let t=s-1;t<c&&t<e.length;t++)n.stdout+=`${t+1}	${e[t]}
`;r=Math.min(c,e.length);break}case"d":{e.splice(s-1,c-s+1),r=Math.min(s,e.length),u=!0;break}case"a":{const t=[];for(;;){const i=w();if(i===null||i===".")break;t.push(i)}e.splice(s,0,...t),r=s+t.length,u=!0;break}case"i":{const t=[];for(;;){const i=w();if(i===null||i===".")break;t.push(i)}e.splice(s-1,0,...t),r=s-1+t.length,u=!0;break}case"c":{const t=[];for(;;){const i=w();if(i===null||i===".")break;t.push(i)}e.splice(s-1,c-s+1,...t),r=s-1+t.length,u=!0;break}case"s":{const t=d[1];if(!t)break;const i=d.slice(2).split(t),a=i[0]||"",h=i[1]||"",T=(i[2]||"").includes("g"),F=new RegExp(a,T?"g":"");for(let p=s-1;p<c&&p<e.length;p++)e[p]=e[p].replace(F,h);r=c,u=!0;break}case"e":{const t=d.slice(1).trim()||f;if(!t){n.stderr+=`?
`;continue}f=t;const i=n.fs.resolvePath(f,n.cwd);try{const a=await n.fs.readFile(i),h=typeof a=="string"?a:new TextDecoder().decode(a);e=h.split(`
`),e.length>0&&e[e.length-1]===""&&e.pop(),r=e.length,n.stdout+=`${new TextEncoder().encode(h).length}
`,u=!1}catch{n.stderr+=`${f}: No such file or directory
`}break}case"r":{const t=d.slice(1).trim();if(!t){n.stderr+=`?
`;continue}const i=n.fs.resolvePath(t,n.cwd);try{const a=await n.fs.readFile(i),h=typeof a=="string"?a:new TextDecoder().decode(a),g=h.split(`
`);g.length>0&&g[g.length-1]===""&&g.pop(),e.splice(r,0,...g),r+=g.length,n.stdout+=`${new TextEncoder().encode(h).length}
`,u=!0}catch{n.stderr+=`${t}: No such file or directory
`}break}case"=":{n.stdout+=`${e.length}
`;break}default:/^\d+$/.test(d)?(r=parseInt(d),r>0&&r<=e.length&&(n.stdout+=e[r-1]+`
`)):n.stderr+=`?
`}}return 0}};(globalThis.__tabcomputerLive??=new Map).set("src/commands/ed.ts",L);export{_ as edCmd};
