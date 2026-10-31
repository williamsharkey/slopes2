import{bzip2Compress as U,bzip2Decompress as A,bzip2DecompressDetailed as E,Bzip2Error as V}from"./bzip2-codec-BRq98koI.js";import{af as M,ag as N,ah as R,ai as L,o as j}from"./index-C6zxlZK4.js";const G=Object.freeze(Object.defineProperty({__proto__:null,get Bzip2Error(){return V},get bunzip2Cmd(){return X},get bzcatCmd(){return J},get bzip2Cmd(){return H},get bzip2Compress(){return U},get bzip2Decompress(){return A},get bzip2DecompressDetailed(){return E}},Symbol.toStringTag,{value:"Module"})),I=e=>`bzip2, a block-sorting file compressor.  Version 1.0.8 (tabcomputer).

   usage: ${e} [flags and input files in any order]

   -h --help           print this message
   -d --decompress     force decompression
   -z --compress       force compression
   -k --keep           keep (don't delete) input files
   -f --force          overwrite existing output files
   -t --test           test compressed file integrity
   -c --stdout         output to standard out
   -q --quiet          suppress noncritical error messages
   -v --verbose        be verbose (a 2nd -v gives more)
   -s --small          use less memory (ignored)
   -1 .. -9            set block size to 100k .. 900k
   --fast              alias for -1
   --best              alias for -9

   If invoked as \`bzip2', default action is to compress.
              as \`bunzip2',  default action is to decompress.
              as \`bzcat', default action is to decompress to stdout.

   If no file names are given, bzip2 compresses or decompresses
   from standard input to standard output.
`,q=`
It is possible that the compressed file(s) have become corrupted.
You can use the -tvv option to test integrity of such files.

You can use the \`bzip2recover' program to attempt to recover
data from undamaged sections of corrupted files.

`,D=[[".bz2",""],[".bz",""],[".tbz2",".tar"],[".tbz",".tar"]];async function _(e,r,W,Y){let a=W,k=Y,v=!1,u=!1,b=!1,h=0,y=9;const w=[];let O=!1;const T=t=>(e.stderr+=`${r}: Bad flag \`${t}'
`+I(r),1);for(const t of e.args){if(O||!t.startsWith("-")||t==="-"){w.push(t);continue}if(t==="--"){O=!0;continue}if(t.startsWith("--")){switch(t){case"--stdout":k=!0;break;case"--decompress":a="decompress";break;case"--compress":a="compress";break;case"--keep":v=!0;break;case"--force":u=!0;break;case"--test":a="test";break;case"--quiet":b=!0;break;case"--verbose":h++;break;case"--small":case"--repetitive-fast":case"--repetitive-best":case"--exponential":break;case"--fast":y=1;break;case"--best":y=9;break;case"--help":return e.stderr+=I(r),0;case"--version":case"--license":return e.stdout+=`bzip2, a block-sorting file compressor.  Version 1.0.8 (tabcomputer).
`,0;default:return T(t)}continue}for(const n of t.slice(1)){if(n>="1"&&n<="9"){y=n.charCodeAt(0)-48;continue}switch(n){case"c":k=!0;break;case"d":a="decompress";break;case"z":a="compress";break;case"k":v=!0;break;case"f":u=!0;break;case"t":a="test";break;case"q":b=!0;break;case"v":h++;break;case"s":break;case"h":return e.stderr+=I(r),0;case"L":case"V":return e.stdout+=`bzip2, a block-sorting file compressor.  Version 1.0.8 (tabcomputer).
`,0;default:return T(`-${n}`)}}}const S=w.length===0;if(S&&w.push("-"),a==="test"&&(k=!1),a==="compress"&&S&&!e.stdin&&e.stdoutIsTTY&&!u)return e.stderr+=`${r}: I won't write compressed data to a terminal.
${r}: For help, type: \`${r} --help'.
`,1;if(a!=="compress"&&S&&!e.stdin&&e.stdoutIsTTY&&!u)return e.stderr+=`${r}: I won't read compressed data from a terminal.
${r}: For help, type: \`${r} --help'.
`,1;let F=0;const l=t=>{t>F&&(F=t)},f=[];let B=!1,P=!1;for(const t of w){const n=t==="-",d=n?"(stdin)":t,p=n||k;let o,c="",z;if(n)o=P?new Uint8Array(0):M(e.stdin??"",a!=="compress"),P=!0;else{c=e.fs.resolvePath(t,e.cwd);let s;try{s=await e.fs.stat(c)}catch{e.stderr+=`${r}: Can't open input file ${t}: No such file or directory.
`,l(1);continue}if(s.isDirectory()){e.stderr+=`${r}: Input file ${t} is a directory.
`,l(1);continue}z=s.mode;const i=await e.fs.readFile(c);o=i instanceof Uint8Array?i:new TextEncoder().encode(i)}if(a==="compress"){let s="";if(!p){if(D.some(([g])=>t.endsWith(g))){b||(e.stderr+=`${r}: Input file ${t} already has ${D.find(([g])=>t.endsWith(g))[0]} suffix.
`),l(1);continue}if(s=c+".bz2",!u&&await e.fs.exists(s)){e.stderr+=`${r}: Output file ${t}.bz2 already exists.
`,l(1);continue}}const i=U(o,y);if(h)if(o.length===0)e.stderr+=`  ${d}: no data compressed.
`;else{const g=o.length/i.length;e.stderr+=`  ${d}: ${g.toFixed(3).padStart(6)}:1, ${(8*i.length/o.length).toFixed(3).padStart(6)} bits/byte, ${(100*(1-i.length/o.length)).toFixed(2).padStart(5)}% saved, ${o.length} in, ${i.length} out.
`}p?f.push(i):(await e.fs.writeFile(s,i,z!==void 0?{mode:z}:void 0),v||await e.fs.unlink(c));continue}let C="",m="(stdout)";if(a==="decompress"&&!p){const s=D.find(([i])=>t.endsWith(i)&&t.length>i.length);if(s?(C=c.slice(0,c.length-s[0].length)+s[1],m=t.slice(0,t.length-s[0].length)+s[1]):(C=c+".out",m=t+".out",b||(e.stderr+=`${r}: Can't guess original name for ${t} -- using ${m}
`)),!u&&await e.fs.exists(C)){e.stderr+=`${r}: Output file ${m} already exists.
`,l(1);continue}}let $;try{try{$=E(o)}catch(s){const i=n?null:N(o);if(!i)throw s;try{$=E(i)}catch{throw s}}}catch(s){if(!(s instanceof V))throw s;if(a==="test"){const i=s.kind==="magic"?"bad magic number (file not created by bzip2)":s.kind==="eof"?"file ends unexpectedly":"data integrity (CRC) error in data";e.stderr+=`${r}: ${d}: ${i}
`,B=!0,l(2);continue}if(s.kind==="magic"){if(u&&p){f.push(o);continue}e.stderr+=`${r}: ${d} is not a bzip2 file.
`,l(2);continue}p&&s.partial.length&&f.push(s.partial),s.kind==="eof"?e.stderr+=`
${r}: Compressed file ends unexpectedly;
	perhaps it is corrupted?  *Possible* reason follows.
${r}: Success
	Input file = ${d}, output file = ${m}
`+q:e.stderr+=`
${r}: Data integrity error when decompressing.
	Input file = ${d}, output file = ${m}
`+q,l(2);break}if($.trailingGarbage&&!b&&(e.stderr+=`${r}: ${d}: trailing garbage after EOF ignored
`),a==="test"){h&&(e.stderr+=`  ${d}: ok
`);continue}h&&(e.stderr+=`  ${d}: done
`),p?f.push($.data):(await e.fs.writeFile(C,$.data,z!==void 0?{mode:z}:void 0),v||await e.fs.unlink(c))}if(B&&(e.stderr+=`
You can use the \`bzip2recover' program to attempt to recover
data from undamaged sections of corrupted files.

`),f.length){const t=R(f);e.stdout+=a==="compress"?L(t):j(t)}return F}const H={name:"bzip2",description:"Compress or decompress files (bzip2 .bz2 format)",exec:e=>_(e,"bzip2","compress",!1)},X={name:"bunzip2",description:"Decompress bzip2 files",exec:e=>_(e,"bunzip2","decompress",!1)},J={name:"bzcat",description:"Decompress bzip2 files to standard output",exec:e=>_(e,"bzcat","decompress",!0)};(globalThis.__tabcomputerLive??=new Map).set("src/commands/bzip2.ts",G);export{V as Bzip2Error,X as bunzip2Cmd,J as bzcatCmd,H as bzip2Cmd,U as bzip2Compress,A as bzip2Decompress,E as bzip2DecompressDetailed};
