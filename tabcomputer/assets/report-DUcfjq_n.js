const u=Object.freeze(Object.defineProperty({__proto__:null,get emptyResult(){return f},get generateReport(){return p}},Symbol.toStringTag,{value:"Module"})),s="/home/user/github-player-report.md";async function p(o,n){const a=n.filter(e=>e.runOk),l=n.filter(e=>!e.runOk),i=n.reduce((e,r)=>e+r.durationMs,0);let t=`# GitHub Player Test Report

`;t+=`**Date:** ${new Date().toISOString().slice(0,10)}
`,t+=`**Total:** ${n.length} repos | `,t+=`**Passed:** ${a.length} | `,t+=`**Failed:** ${l.length} | `,t+=`**Time:** ${(i/1e3).toFixed(1)}s

`,t+=`## Results

`,t+=`| Repo | Expected | Actual | Clone | Install | Build | Run | Time |
`,t+=`|------|----------|--------|-------|---------|-------|-----|------|
`;for(const e of n){const r=d=>d?"✅":"❌";t+=`| ${e.repo} | ${e.expectedKind} | ${e.actualKind} | ${r(e.cloneOk)} | ${r(e.installOk)} | ${r(e.buildOk)} | ${r(e.runOk)} | ${(e.durationMs/1e3).toFixed(1)}s |
`}if(l.length>0){t+=`
## Failures

`;for(const e of l){t+=`### ${e.repo}
`,t+=`- Expected: ${e.expectedKind}, Actual: ${e.actualKind}
`;for(const r of e.errors)t+=`- ${r}
`;t+=`
`}}const c=n.filter(e=>e.expectedKind===e.actualKind).length;t+=`## Detection Accuracy

`,t+=`${c}/${n.length} repos detected correctly (${Math.round(100*c/n.length)}%)
`;try{await o.writeFile(s,new TextEncoder().encode(t))}catch{}return t}function f(o,n){return{repo:o,expectedKind:n,actualKind:"unknown",cloneOk:!1,installOk:!1,buildOk:!1,runOk:!1,errors:[],durationMs:0}}(globalThis.__tabcomputerLive??=new Map).set("src/github-player/report.ts",u);export{f as emptyResult,p as generateReport};
