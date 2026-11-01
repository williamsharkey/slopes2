import{signOutPlan as o,signOutLines as i,signOutOfThisComputer as r}from"./sign-out-DAQDFIoF.js";import"./index-3dop0BuN.js";import"./credentials-CrExaRSJ.js";const u=Object.freeze(Object.defineProperty({__proto__:null,get signoutCmd(){return g}},Symbol.toStringTag,{value:"Module"})),g={name:"signout",description:"Sign out of a shared computer: remove the sign-ins and every file from this browser",async exec(e){const s=e.args.includes("--yes")||e.args.includes("-y");if(e.args.filter(t=>t!=="--yes"&&t!=="-y").length)return e.stderr+=`usage: signout [--yes]
`,2;const n=await o(e.fs,localStorage,e.env.HOME||"/home/user");return e.stdout+=i(n),s?(e.stdout+=`
Signing out…
`,setTimeout(()=>{r(e.fs)},50),0):(e.stdout+=`
Nothing was deleted. Run "signout --yes" to do it.
`,n.unpushed.length?1:0)}};(globalThis.__tabcomputerLive??=new Map).set("src/commands/signout.ts",u);export{g as signoutCmd};
