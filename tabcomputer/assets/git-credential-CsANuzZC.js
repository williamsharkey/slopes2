const u=Object.freeze(Object.defineProperty({__proto__:null,get GITCONFIG(){return l},get credentialAnswer(){return h},get ensureGitCredentialHelper(){return g},get helperSections(){return s}},Symbol.toStringTag,{value:"Module"})),l="/home/user/.gitconfig",a=["https://github.com","https://gist.github.com"];function s(){return a.map(e=>`[credential "${e}"]
	helper =
	helper = !gh auth git-credential
`).join("")}async function g(e,r=l){let t="";try{t=String(await e.readFile(r,"utf8"))}catch{}return t.includes("gh auth git-credential")?!1:(await e.writeFile(r,(t&&!t.endsWith(`
`)?t+`
`:t)+s()),!0)}function h(e,r,t){if(e!=="get"||!t)return null;const n={};for(const o of r.split(`
`)){const c=o.indexOf("=");c>0&&(n[o.slice(0,c).trim()]=o.slice(c+1).trim())}const i=n.host??"github.com";return i!=="github.com"&&i!=="gist.github.com"||n.protocol&&n.protocol!=="https"?null:`protocol=https
host=${i}
username=x-access-token
password=${t}
`}(globalThis.__tabcomputerLive??=new Map).set("src/git-credential.ts",u);export{l as GITCONFIG,h as credentialAnswer,g as ensureGitCredentialHelper,s as helperSections};
