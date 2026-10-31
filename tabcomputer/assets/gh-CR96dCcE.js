import{g as le,a as H}from"./index-BIxBofyG.js";import{g as z}from"./git-cached-DDnCZD_q.js";import{evaluateJq as K}from"./jq-sGNk0jr0.js";import{DEFAULT_GITHUB_SCOPES as I,GITHUB_TOKEN_KEY as de,ensureGitIdentity as X,requestDeviceCode as fe,openGitHubLoginPanel as ce,pollForToken as pe,saveGitHubToken as me}from"./github-auth-CWA0I1yx.js";import"./index-HJ_vY-y5.js";import"./index-rQLcFmgX.js";import"./sha1-Dawy5LEM.js";import"./index-YkV0U4e7.js";import"./git-config-Jend4-Wv.js";import"./git-credential-CsANuzZC.js";const ge=Object.freeze(Object.defineProperty({__proto__:null,get ghApiHandler(){return Y}},Symbol.toStringTag,{value:"Module"})),he=Object.freeze(Object.defineProperty({__proto__:null,get ghIssueHandler(){return Q}},Symbol.toStringTag,{value:"Module"})),$e=Object.freeze(Object.defineProperty({__proto__:null,get ghPrHandler(){return Z}},Symbol.toStringTag,{value:"Module"})),be=Object.freeze(Object.defineProperty({__proto__:null,get ghReleaseHandler(){return x}},Symbol.toStringTag,{value:"Module"})),we=Object.freeze(Object.defineProperty({__proto__:null,get ghRunHandler(){return re},get ghWorkflowHandler(){return te}},Symbol.toStringTag,{value:"Module"})),ye=Object.freeze(Object.defineProperty({__proto__:null,get ghLabelHandler(){return se}},Symbol.toStringTag,{value:"Module"})),_e=Object.freeze(Object.defineProperty({__proto__:null,get ghSearchHandler(){return oe}},Symbol.toStringTag,{value:"Module"})),ve=Object.freeze(Object.defineProperty({__proto__:null,get GhUsageError(){return P},get finishJson(){return ie},get normalizeGhArgs(){return ne},get takeJsonFlags(){return ae}},Symbol.toStringTag,{value:"Module"})),Te=Object.freeze(Object.defineProperty({__proto__:null,get detectRepo(){return E},get getRepoFromFlags(){return L},get getToken(){return ue},get ghApi(){return m},get ghCmd(){return Je},get isDryRun(){return v},get parseFlags(){return S},get timeAgo(){return O}},Symbol.toStringTag,{value:"Module"}));function U(e,i){return K(e,i).split(`
`).map(n=>{if(!n.startsWith('"'))return n;try{const t=JSON.parse(n);return typeof t=="string"?t:n}catch{return n}}).join(`
`)}async function Y(e,i){const n=["X","method","f","F","H","input","repo","R","jq","q","template"],{flags:t,positional:a}=S(e.args.slice(1),n),u=a[0];if(!u)return e.stderr=`usage: gh api <path> [-X METHOD] [-f key=value] [--input FILE] [--jq EXPR] [--paginate] [--dry-run]
`,1;const d=t.X||t.method;let o=(d||"GET").toUpperCase(),s;const r=e.args.slice(1);for(let h=0;h<r.length;h++)if((r[h]==="-f"||r[h]==="-F")&&r[h+1]){const w=r[++h],y=w.indexOf("=");if(y>0){s||(s={});const _=w.slice(0,y),T=w.slice(y+1);if(r[h-1]==="-F")if(T.startsWith("@")){const j=T.slice(1);if(j==="-")s[_]=e.stdin;else try{const A=await e.fs.readFile(e.fs.resolvePath(j,e.cwd),"utf8");s[_]=typeof A=="string"?A:new TextDecoder().decode(A)}catch{return e.stderr=`open ${j}: no such file or directory
`,1}}else try{s[_]=JSON.parse(T)}catch{s[_]=T}else s[_]=T}}let l;if(t.input!==void 0){const h=t.input;if(h==="-")l=e.stdin;else try{const w=await e.fs.readFile(e.fs.resolvePath(h,e.cwd),"utf8");l=typeof w=="string"?w:new TextDecoder().decode(w)}catch{return e.stderr=`open ${h}: no such file or directory
`,1}}(s||l!==void 0)&&!d&&(o="POST");const f={};for(let h=0;h<r.length;h++)if(r[h]==="-H"&&r[h+1]){const w=r[++h],y=w.indexOf(":");y>0&&(f[w.slice(0,y).trim()]=w.slice(y+1).trim())}let c=u;if(c.includes("{owner}")||c.includes("{repo}")){const h=L(t)||await E(e);h&&(c=c.replace("{owner}",h.owner).replace("{repo}",h.repo))}if((c==="graphql"||c==="/graphql")&&(o="POST"),(o==="GET"||l!==void 0)&&s){const h=c.includes("?")?"&":"?",w=Object.entries(s).map(([y,_])=>`${encodeURIComponent(y)}=${encodeURIComponent(String(_))}`).join("&");c+=h+w,s=void 0}if(v(t)&&o!=="GET"){if(e.stdout=`[dry-run] Would ${o} /${c.replace(/^\//,"")}
`,s)for(const[h,w]of Object.entries(s))e.stdout+=`  ${h}: ${JSON.stringify(w)}
`;return l!==void 0&&(e.stdout+=l.endsWith(`
`)?l:l+`
`),0}i||(e.stderr=`warning: no token set, request may fail for private resources
`);const p=t.jq??t.q;if(t.paginate==="true"){const h=c.includes("?")?"&":"?";c.includes("per_page=")||(c+=h+"per_page=100");let w=[],y=c;for(;y;){const{status:T,data:j,headers:A}=await m(i,o,y,l??s,f);if(T>=400)return e.stderr=`error: API returned ${T}
`,e.stdout=JSON.stringify(j,null,2)+`
`,1;Array.isArray(j)?w=w.concat(j):w.push(j),y=null;const k=A.get("link")||A.get("Link");if(k){const N=k.match(/<([^>]+)>;\s*rel="next"/);N&&(y=N[1])}}const _=w;return p?e.stdout=U(_,p):e.stdout=JSON.stringify(_,null,2)+`
`,0}const{status:$,data:b}=await m(i,o,c,l??s,f);return $>=400&&(e.stderr=`error: API returned ${$}
`),p?e.stdout=U(b,p):e.stdout=JSON.stringify(b,null,2)+`
`,$>=400?1:0}(globalThis.__tabcomputerLive??=new Map).set("src/commands/gh-api.ts",ge);const Se="list, create, view, close, reopen, comment, edit, delete, lock, label",je=["state","L","limit","label","title","body","repo","R","assignee","search","milestone","json","t","b","m","p","add-label","remove-label","add","remove","project"];async function Q(e,i){const n=e.args[1];if(!n||n==="--help")return e.stdout=`usage: gh issue <command> [flags]

Commands:
  list     List issues [--state open|closed|all] [--assignee] [--search] [--milestone] [--json fields] [--label]
  create   Create an issue --title "..." [--body "..."] [--label] [--dry-run]
  view     View an issue [--json fields]
  close    Close an issue
  reopen   Reopen an issue
  comment  Add a comment --body "..."
  edit     Edit an issue [--title] [--body] [--add-label]
  delete   Delete an issue (admin only)
  lock     Lock an issue
  label    Manage labels --add/--remove
`,0;const{flags:t,positional:a}=S(e.args.slice(2),je);if(!i&&!v(t))return e.stderr=`error: not signed in to GitHub. Run: gh auth login
`,1;const u=L(t)||await E(e);if(!u)return e.stderr=`error: could not detect repository. Use --repo owner/repo.
`,1;const d=`/repos/${u.owner}/${u.repo}`;switch(n){case"list":{const o=t.state||"open",s=parseInt(t.L||t.limit||"30",10),r=t.json;if(t.search){const g=encodeURIComponent(`${t.search} repo:${u.owner}/${u.repo} is:issue`),{status:$,data:b}=await m(i,"GET",`/search/issues?q=${g}&per_page=${s}`);if($!==200)return e.stderr=`error: API returned ${$}: ${b?.message||""}
`,1;const h=(b.items||[]).filter(w=>!w.pull_request);return h.length===0?(e.stdout=`No issues match your search
`,0):r?R(e,h,r):F(e,h)}let l=`${d}/issues?state=${o}&per_page=${s}`;t.label&&(l+=`&labels=${encodeURIComponent(t.label)}`),t.assignee&&(l+=`&assignee=${encodeURIComponent(t.assignee)}`),t.milestone&&(l+=`&milestone=${encodeURIComponent(t.milestone)}`);const{status:f,data:c}=await m(i,"GET",l);if(f!==200)return e.stderr=`error: API returned ${f}: ${c?.message||""}
`,1;const p=c.filter(g=>!g.pull_request);return p.length===0?(e.stdout=`No issues match your search
`,0):r?R(e,p,r):F(e,p)}case"create":{const o=t.title||t.t,s=t.body||t.b||"";if(!o)return e.stderr=`error: --title is required
`,1;const r={title:o,body:s};t.label&&(r.labels=t.label.split(",")),t.assignee&&(r.assignees=t.assignee.split(",").map(g=>g.trim()));const l=t.milestone||t.m;l&&(r.milestone=parseInt(l,10));const f=t.project||t.p;if(f&&(r.project=f),v(t))return e.stdout=`[dry-run] Would POST ${d}/issues
`,e.stdout+=`  title: ${JSON.stringify(o)}
`,s&&(e.stdout+=`  body: ${JSON.stringify(s)}
`),r.labels&&(e.stdout+=`  labels: ${r.labels.join(", ")}
`),r.assignees&&(e.stdout+=`  assignees: ${r.assignees.join(", ")}
`),r.milestone&&(e.stdout+=`  milestone: ${r.milestone}
`),r.project&&(e.stdout+=`  project: ${r.project}
`),0;const{status:c,data:p}=await m(i,"POST",`${d}/issues`,r);if(c===201)e.stdout=`Created issue #${p.number}: ${p.title}
${p.html_url}
`;else return e.stderr=`error: failed to create issue (HTTP ${c}): ${p?.message||""}
`,1;break}case"view":{const o=a[0];if(!o)return e.stderr=`usage: gh issue view <number> [--json fields]
`,1;const{status:s,data:r}=await m(i,"GET",`${d}/issues/${o}`);if(s!==200)return e.stderr=`error: API returned ${s}: ${r?.message||""}
`,1;if(t.json)return R(e,r,t.json);e.stdout=`#${r.number} ${r.title}
`,e.stdout+=`State: ${r.state.toUpperCase()}  |  Author: ${r.user?.login}
`;const l=(r.labels||[]).map(f=>f.name).join(", ");l&&(e.stdout+=`Labels: ${l}
`),e.stdout+=`Created: ${O(r.created_at)}`,r.closed_at&&(e.stdout+=`  |  Closed: ${O(r.closed_at)}`),e.stdout+=`
`,r.body&&(e.stdout+=`
${r.body}
`),e.stdout+=`
${r.html_url}
`;break}case"close":{const o=a[0];if(!o)return e.stderr=`usage: gh issue close <number>
`,1;if(v(t))return e.stdout=`[dry-run] Would close issue #${o}
`,0;const{status:s,data:r}=await m(i,"PATCH",`${d}/issues/${o}`,{state:"closed"});if(s===200)e.stdout=`Closed issue #${o}
`;else return e.stderr=`error: failed to close issue (HTTP ${s}): ${r?.message||""}
`,1;break}case"reopen":{const o=a[0];if(!o)return e.stderr=`usage: gh issue reopen <number>
`,1;const{status:s,data:r}=await m(i,"PATCH",`${d}/issues/${o}`,{state:"open"});if(s===200)e.stdout=`Reopened issue #${o}
`;else return e.stderr=`error: failed to reopen issue (HTTP ${s}): ${r?.message||""}
`,1;break}case"comment":{const o=a[0],s=t.body||t.b;if(!o||!s)return e.stderr=`usage: gh issue comment <number> --body "..."
`,1;if(v(t))return e.stdout=`[dry-run] Would comment on issue #${o}
  body: ${JSON.stringify(s)}
`,0;const{status:r,data:l}=await m(i,"POST",`${d}/issues/${o}/comments`,{body:s});if(r===201)e.stdout=`Added comment to issue #${o}
${l.html_url}
`;else return e.stderr=`error: failed to comment (HTTP ${r}): ${l?.message||""}
`,1;break}case"edit":{const o=a[0];if(!o)return e.stderr=`usage: gh issue edit <number> [--title "..."] [--body "..."] [--add-label label]
`,1;const s={};if((t.title||t.t)&&(s.title=t.title||t.t),(t.body||t.b)&&(s.body=t.body||t.b),t["add-label"]&&(s.labels=t["add-label"].split(",")),Object.keys(s).length===0)return e.stderr=`error: specify --title, --body, or --add-label
`,1;if(v(t)){e.stdout=`[dry-run] Would edit issue #${o}
`;for(const[f,c]of Object.entries(s))e.stdout+=`  ${f}: ${JSON.stringify(c)}
`;return 0}const{status:r,data:l}=await m(i,"PATCH",`${d}/issues/${o}`,s);if(r===200)e.stdout=`Updated issue #${o}
`;else return e.stderr=`error: failed to edit issue (HTTP ${r}): ${l?.message||""}
`,1;break}case"delete":{const o=a[0];if(!o)return e.stderr=`usage: gh issue delete <number> (admin only)
`,1;if(v(t))return e.stdout=`[dry-run] Would delete issue #${o}
`,0;const{status:s,data:r}=await m(i,"DELETE",`${d}/issues/${o}`);if(s===204||s===200)e.stdout=`Deleted issue #${o}
`;else return e.stderr=`error: failed to delete issue (HTTP ${s}): ${r?.message||""}
`,1;break}case"lock":{const o=a[0];if(!o)return e.stderr=`usage: gh issue lock <number>
`,1;const{status:s,data:r}=await m(i,"PUT",`${d}/issues/${o}/lock`,{});if(s===204||s===200)e.stdout=`Locked issue #${o}
`;else return e.stderr=`error: failed to lock issue (HTTP ${s}): ${r?.message||""}
`,1;break}case"label":{const o=a[0];if(!o)return e.stderr=`usage: gh issue label <number> --add label1,label2 | --remove label
`,1;const s=t.add,r=t.remove;if(s){const l=s.split(",").map(p=>p.trim()),{status:f,data:c}=await m(i,"POST",`${d}/issues/${o}/labels`,{labels:l});if(f===200)e.stdout=`Added labels to issue #${o}: ${l.join(", ")}
`;else return e.stderr=`error: failed to add labels (HTTP ${f}): ${c?.message||""}
`,1}else if(r){const{status:l,data:f}=await m(i,"DELETE",`${d}/issues/${o}/labels/${encodeURIComponent(r)}`);if(l===200||l===204)e.stdout=`Removed label '${r}' from issue #${o}
`;else return e.stderr=`error: failed to remove label (HTTP ${l}): ${f?.message||""}
`,1}else return e.stderr=`usage: gh issue label <number> --add label1,label2 | --remove label
`,1;break}default:return e.stderr=`gh issue: '${n}' is not a valid subcommand. Valid: ${Se}
`,1}return 0}function F(e,i){for(const n of i){const t=`#${n.number}`.padEnd(6),a=n.title.slice(0,50).padEnd(50),u=(n.labels||[]).map(s=>s.name).join(","),d=n.state.toUpperCase().padEnd(8),o=O(n.created_at);e.stdout+=`${t}  ${a}  ${u.padEnd(20)}  ${d}  ${o}
`}return 0}function R(e,i,n){if(n==="*")return e.stdout=JSON.stringify(i)+`
`,0;const t=n.split(",").map(a=>a.trim());if(Array.isArray(i)){const a=i.map(u=>J(u,t));e.stdout=JSON.stringify(a,null,2)+`
`}else e.stdout=JSON.stringify(J(i,t),null,2)+`
`;return 0}function J(e,i){const n={};for(const t of i)t in e&&(n[t]=e[t]);return n}(globalThis.__tabcomputerLive??=new Map).set("src/commands/gh-issue.ts",he);const Pe="list, create, view, merge, close, reopen, comment, diff, checks, review, edit, ready",Ee=["state","L","limit","title","body","base","head","repo","R","json","t","b","add-label","remove-label","label","reviewer","assignee"];async function Z(e,i){const n=e.args[1];if(!n||n==="--help")return e.stdout=`usage: gh pr <command> [flags]

Commands:
  list     List pull requests [--state open|closed|all] [--json fields]
  create   Create a pull request --title "..." [--body] [--base] [--head] [--dry-run]
  view     View a pull request [--json fields]
  merge    Merge a pull request [--merge|--squash|--rebase] [--dry-run]
  close    Close a pull request
  reopen   Reopen a pull request
  comment  Add a comment --body "..."
  diff     Show pull request diff
  checks   Show CI check status
  review   Submit a review [--approve|--comment|--request-changes] [--body]
  edit     Edit a pull request [--title] [--body] [--base]
  ready    Mark as ready for review
`,0;const{flags:t,positional:a}=S(e.args.slice(2),Ee);if(!i&&!v(t))return e.stderr=`error: not signed in to GitHub. Run: gh auth login
`,1;const u=L(t)||await E(e);if(!u)return e.stderr=`error: could not detect repository. Use --repo owner/repo or run from a git repo with a GitHub remote.
`,1;const d=`/repos/${u.owner}/${u.repo}`;switch(n){case"list":{const o=t.state||"open",s=parseInt(t.L||t.limit||"30",10),{status:r,data:l}=await m(i,"GET",`${d}/pulls?state=${o}&per_page=${s}`);if(r!==200)return e.stderr=`error: API returned ${r}: ${l?.message||""}
`,1;if(!l||l.length===0)return e.stdout=`No pull requests match your search
`,0;if(t.json)return M(e,l,t.json);for(const f of l){const c=`#${f.number}`.padEnd(6),p=f.title.slice(0,50).padEnd(50),g=`${f.head?.ref||"?"} -> ${f.base?.ref||"?"}`,$=f.state.toUpperCase().padEnd(8),b=O(f.created_at);e.stdout+=`${c}  ${p}  ${g.padEnd(30)}  ${$}  ${b}
`}return 0}case"create":{const o=t.title||t.t,s=t.body||t.b||"",r=t.base||"main";let l=t.head||"";const f=t.draft==="true";if(!o)return e.stderr=`error: --title is required
`,1;if(!l)try{const $=e.fs.toIsomorphicGitFS();l=await z.currentBranch({fs:$,dir:e.cwd})||""}catch{}if(!l)return e.stderr=`error: could not detect current branch. Use --head <branch>
`,1;if(v(t))return e.stdout=`[dry-run] Would POST ${d}/pulls
`,e.stdout+=`  title: ${JSON.stringify(o)}
`,e.stdout+=`  head: ${l} -> base: ${r}
`,s&&(e.stdout+=`  body: ${JSON.stringify(s)}
`),f&&(e.stdout+=`  draft: true
`),t.label&&(e.stdout+=`  labels: ${t.label}
`),t.reviewer&&(e.stdout+=`  reviewers: ${t.reviewer}
`),t.assignee&&(e.stdout+=`  assignees: ${t.assignee}
`),0;const c={title:o,body:s,head:l,base:r};f&&(c.draft=!0);const{status:p,data:g}=await m(i,"POST",`${d}/pulls`,c);if(p===201){if(e.stdout=`Created PR #${g.number}: ${g.title}
${g.html_url}
`,t.label){const $=t.label.split(",").map(b=>b.trim());await m(i,"POST",`${d}/issues/${g.number}/labels`,{labels:$})}if(t.reviewer){const $=t.reviewer.split(",").map(b=>b.trim());await m(i,"POST",`${d}/pulls/${g.number}/requested_reviewers`,{reviewers:$})}if(t.assignee){const $=t.assignee.split(",").map(b=>b.trim());await m(i,"POST",`${d}/issues/${g.number}/assignees`,{assignees:$})}}else return e.stderr=`error: failed to create PR (HTTP ${p}): ${g?.message||JSON.stringify(g?.errors)}
`,1;return 0}case"view":{const o=a[0];if(!o)return e.stderr=`usage: gh pr view <number> [--json fields]
`,1;const{status:s,data:r}=await m(i,"GET",`${d}/pulls/${o}`);return s!==200?(e.stderr=`error: API returned ${s}: ${r?.message||""}
`,1):t.json?M(e,r,t.json):(e.stdout=`#${r.number} ${r.title}
`,e.stdout+=`State: ${r.state.toUpperCase()}  |  ${r.head?.ref} -> ${r.base?.ref}
`,e.stdout+=`Author: ${r.user?.login}  |  Created: ${O(r.created_at)}
`,r.body&&(e.stdout+=`
${r.body}
`),e.stdout+=`
${r.html_url}
`,0)}case"merge":{const o=a[0];if(!o)return e.stderr=`usage: gh pr merge <number> [--merge|--squash|--rebase] [--delete-branch] [--auto] [--body MSG] [--dry-run]
`,1;let s="merge";t.squash==="true"&&(s="squash"),t.rebase==="true"&&(s="rebase");const r=t["delete-branch"]==="true"||t.d==="true",l=t.auto==="true",f=t.body||t.b||"";if(v(t))return e.stdout=`[dry-run] Would merge PR #${o} (${s})
`,l&&(e.stdout+=`[dry-run] Would enable auto-merge
`),f&&(e.stdout+=`[dry-run] Commit message: ${f}
`),r&&(e.stdout+=`[dry-run] Would delete head branch
`),0;const c={merge_method:s};f&&(c.commit_message=f),l&&(c.auto_merge=!0);const{status:p,data:g}=await m(i,"PUT",`${d}/pulls/${o}/merge`,c);if(p===200){if(e.stdout=`Merged PR #${o} (${s})
`,r){const{data:$}=await m(i,"GET",`${d}/pulls/${o}`),b=$?.head?.ref;if(b){const{status:h}=await m(i,"DELETE",`${d}/git/refs/heads/${b}`);h===204&&(e.stdout+=`Deleted branch ${b}
`)}}}else return e.stderr=`error: merge failed (HTTP ${p}): ${g?.message||""}
`,1;return 0}case"close":{const o=a[0];if(!o)return e.stderr=`usage: gh pr close <number>
`,1;if(v(t))return e.stdout=`[dry-run] Would close PR #${o}
`,0;const{status:s,data:r}=await m(i,"PATCH",`${d}/pulls/${o}`,{state:"closed"});if(s===200)e.stdout=`Closed PR #${o}
`;else return e.stderr=`error: failed to close PR (HTTP ${s}): ${r?.message||""}
`,1;return 0}case"reopen":{const o=a[0];if(!o)return e.stderr=`usage: gh pr reopen <number>
`,1;const{status:s,data:r}=await m(i,"PATCH",`${d}/pulls/${o}`,{state:"open"});if(s===200)e.stdout=`Reopened PR #${o}
`;else return e.stderr=`error: failed to reopen PR (HTTP ${s}): ${r?.message||""}
`,1;return 0}case"comment":{const o=a[0],s=t.body||t.b;if(!o||!s)return e.stderr=`usage: gh pr comment <number> --body "..."
`,1;if(v(t))return e.stdout=`[dry-run] Would comment on PR #${o}
  body: ${JSON.stringify(s)}
`,0;const{status:r,data:l}=await m(i,"POST",`${d}/issues/${o}/comments`,{body:s});if(r===201)e.stdout=`Added comment to PR #${o}
${l.html_url}
`;else return e.stderr=`error: failed to comment (HTTP ${r}): ${l?.message||""}
`,1;return 0}case"diff":{const o=a[0];if(!o)return e.stderr=`usage: gh pr diff <number>
`,1;const{status:s,data:r}=await m(i,"GET",`${d}/pulls/${o}`,void 0,{Accept:"application/vnd.github.diff"});if(s!==200)return e.stderr=`error: API returned ${s}: ${r?.message||""}
`,1;if(r===null){const f=`${typeof location<"u"?location.origin+"/api/github":"https://api.github.com"}${d}/pulls/${o}`,c=await fetch(f,{headers:{Accept:"application/vnd.github.diff",Authorization:`Bearer ${i}`,"X-GitHub-Api-Version":"2022-11-28"}});e.stdout=await c.text()}else e.stdout=typeof r=="string"?r:JSON.stringify(r,null,2)+`
`;return 0}case"checks":{const o=a[0];if(!o)return e.stderr=`usage: gh pr checks <number>
`,1;const{status:s,data:r}=await m(i,"GET",`${d}/pulls/${o}`);if(s!==200)return e.stderr=`error: API returned ${s}: ${r?.message||""}
`,1;const l=r.head?.sha;if(!l)return e.stderr=`error: could not determine head commit SHA
`,1;const{status:f,data:c}=await m(i,"GET",`${d}/commits/${l}/check-runs`);if(f!==200)return e.stderr=`error: API returned ${f}: ${c?.message||""}
`,1;const p=c.check_runs||[];if(p.length===0)return e.stdout=`No checks found
`,0;for(const g of p){const $=g.conclusion==="success"?"pass":g.conclusion==="failure"?"fail":g.status,b=g.name.padEnd(40);e.stdout+=`${$.padEnd(10)}  ${b}  ${g.conclusion||g.status}
`}return 0}case"review":{const o=a[0];if(!o)return e.stderr=`usage: gh pr review <number> [--approve|--comment|--request-changes] [--body "..."]
`,1;let s="COMMENT";t.approve==="true"&&(s="APPROVE"),t["request-changes"]==="true"&&(s="REQUEST_CHANGES");const r=t.body||t.b||"";if(s==="REQUEST_CHANGES"&&!r)return e.stderr=`error: --body is required when requesting changes
`,1;if(v(t))return e.stdout=`[dry-run] Would submit ${s} review on PR #${o}
`,r&&(e.stdout+=`  body: ${JSON.stringify(r)}
`),0;const{status:l,data:f}=await m(i,"POST",`${d}/pulls/${o}/reviews`,{event:s,body:r});if(l===200)e.stdout=`Submitted ${s.toLowerCase()} review on PR #${o}
`;else return e.stderr=`error: failed to submit review (HTTP ${l}): ${f?.message||""}
`,1;return 0}case"edit":{const o=a[0];if(!o)return e.stderr=`usage: gh pr edit <number> [--title "..."] [--body "..."] [--base branch]
`,1;const s={};if((t.title||t.t)&&(s.title=t.title||t.t),(t.body||t.b)&&(s.body=t.body||t.b),t.base&&(s.base=t.base),Object.keys(s).length===0)return e.stderr=`error: specify --title, --body, or --base
`,1;if(v(t)){e.stdout=`[dry-run] Would edit PR #${o}
`;for(const[f,c]of Object.entries(s))e.stdout+=`  ${f}: ${JSON.stringify(c)}
`;return 0}const{status:r,data:l}=await m(i,"PATCH",`${d}/pulls/${o}`,s);if(r===200)e.stdout=`Updated PR #${o}
`;else return e.stderr=`error: failed to edit PR (HTTP ${r}): ${l?.message||""}
`,1;return 0}case"ready":{const o=a[0];if(!o)return e.stderr=`usage: gh pr ready <number>
`,1;const{status:s,data:r}=await m(i,"PUT",`${d}/pulls/${o}`,{draft:!1});if(s===200)e.stdout=`PR #${o} marked as ready for review
`;else return e.stderr=`error: failed to mark as ready (HTTP ${s}): ${r?.message||""}
`,1;return 0}default:return e.stderr=`gh pr: '${n}' is not a valid subcommand. Valid: ${Pe}
`,1}}function M(e,i,n){if(n==="*")return e.stdout=JSON.stringify(i)+`
`,0;const t=n.split(",").map(a=>a.trim());return Array.isArray(i)?e.stdout=JSON.stringify(i.map(a=>W(a,t)),null,2)+`
`:e.stdout=JSON.stringify(W(i,t),null,2)+`
`,0}function W(e,i){const n={};for(const t of i)t in e&&(n[t]=e[t]);return n}(globalThis.__tabcomputerLive??=new Map).set("src/commands/gh-pr.ts",$e);const Oe=["title","notes","target","repo","R","json","L","limit"];async function x(e,i){const n=e.args[1];if(!n||n==="--help")return e.stdout=`usage: gh release <command> [flags]

Commands:
  list       List releases
  create     Create a release <tag> [--title] [--notes] [--target] [--draft] [--prerelease]
  view       View a release <tag>
  download   Download release assets <tag>
`,0;if(!i)return e.stderr=`error: not signed in to GitHub. Run: gh auth login
`,1;const{flags:t,positional:a}=S(e.args.slice(2),Oe),u=L(t)||await E(e);if(!u)return e.stderr=`error: could not detect repository. Use --repo owner/repo.
`,1;const d=`/repos/${u.owner}/${u.repo}`;switch(n){case"list":{const o=parseInt(t.L||t.limit||"30",10),{status:s,data:r}=await m(i,"GET",`${d}/releases?per_page=${o}`);if(s!==200)return e.stderr=`error: API returned ${s}: ${r?.message||""}
`,1;if(t.json)return e.stdout=JSON.stringify(r??[])+`
`,0;if(!r||r.length===0)return e.stdout=`No releases found
`,0;for(const l of r){const f=l.tag_name.padEnd(20),c=(l.name||"").slice(0,40).padEnd(40),p=l.draft?"DRAFT":l.prerelease?"PRE":"LATEST",g=O(l.published_at||l.created_at);e.stdout+=`${f}  ${c}  ${p.padEnd(8)}  ${g}
`}return 0}case"create":{const o=a[0];if(!o)return e.stderr=`error: tag name is required
usage: gh release create <tag> [--title] [--notes]
`,1;const s=t.title||o,r=t.notes||"",l=t.target||"",f=t.draft==="true",c=t.prerelease==="true";if(v(t))return e.stdout=`[dry-run] Would POST ${d}/releases
`,e.stdout+=`  tag: ${o}
`,e.stdout+=`  title: ${JSON.stringify(s)}
`,r&&(e.stdout+=`  notes: ${JSON.stringify(r)}
`),f&&(e.stdout+=`  draft: true
`),c&&(e.stdout+=`  prerelease: true
`),0;const p={tag_name:o,name:s,body:r,draft:f,prerelease:c};l&&(p.target_commitish=l);const{status:g,data:$}=await m(i,"POST",`${d}/releases`,p);if(g===201)e.stdout=`Created release ${$.tag_name}: ${$.name}
${$.html_url}
`;else return e.stderr=`error: failed to create release (HTTP ${g}): ${$?.message||""}
`,1;return 0}case"view":{const o=a[0];if(!o)return e.stderr=`usage: gh release view <tag>
`,1;const{status:s,data:r}=await m(i,"GET",`${d}/releases/tags/${o}`);if(s!==200)return e.stderr=`error: API returned ${s}: ${r?.message||""}
`,1;if(t.json)return e.stdout=JSON.stringify(r)+`
`,0;e.stdout=`${r.tag_name}  ${r.name||""}
`,e.stdout+=`Author: ${r.author?.login||"unknown"}
`,e.stdout+=`Published: ${O(r.published_at||r.created_at)}
`,r.draft&&(e.stdout+=`Status: DRAFT
`),r.prerelease&&(e.stdout+=`Status: PRE-RELEASE
`),r.body&&(e.stdout+=`
${r.body}
`);const l=r.assets||[];if(l.length>0){e.stdout+=`
Assets:
`;for(const f of l)e.stdout+=`  ${f.name} (${(f.size/1024).toFixed(1)} KB, ${f.download_count} downloads)
`}return e.stdout+=`
${r.html_url}
`,0}case"download":{const o=a[0];if(!o)return e.stderr=`usage: gh release download <tag>
`,1;const{status:s,data:r}=await m(i,"GET",`${d}/releases/tags/${o}`);if(s!==200)return e.stderr=`error: API returned ${s}: ${r?.message||""}
`,1;const l=r.assets||[];if(l.length===0)return e.stdout=`No assets found for this release
`,0;e.stdout=`Assets for ${o}:
`;for(const f of l)e.stdout+=`  ${f.name} (${(f.size/1024).toFixed(1)} KB)
`,e.stdout+=`    ${f.browser_download_url}
`;return e.stdout+=`
Note: binary download is limited in browser environments. Use the URLs above.
`,0}default:return e.stderr=`gh release: '${n}' is not a valid subcommand. Valid: list, create, view, download
`,1}}(globalThis.__tabcomputerLive??=new Map).set("src/commands/gh-release.ts",be);const ee=["repo","R","L","limit","json"];async function te(e,i){const n=e.args[1];if(!n||n==="--help")return e.stdout=`usage: gh workflow <command> [flags]

Commands:
  list     List workflows

Related:
  gh run list    List workflow runs
  gh run view    View a workflow run
`,0;if(!i)return e.stderr=`error: not signed in to GitHub. Run: gh auth login
`,1;const{flags:t,positional:a}=S(e.args.slice(2),ee),u=L(t)||await E(e);if(!u)return e.stderr=`error: could not detect repository. Use --repo owner/repo.
`,1;const d=`/repos/${u.owner}/${u.repo}`;if(n==="list"){const{status:o,data:s}=await m(i,"GET",`${d}/actions/workflows`);if(o!==200)return e.stderr=`error: API returned ${o}: ${s?.message||""}
`,1;const r=s.workflows||[];if(t.json)return e.stdout=JSON.stringify(r)+`
`,0;if(r.length===0)return e.stdout=`No workflows found
`,0;for(const l of r){const f=(l.name||"").padEnd(30),c=(l.state||"").padEnd(10);e.stdout+=`${f}  ${c}  ${l.path||""}
`}return 0}return e.stderr=`gh workflow: '${n}' is not a valid subcommand. Valid: list
`,1}async function re(e,i){const n=e.args[1];if(!n||n==="--help")return e.stdout=`usage: gh run <command> [flags]

Commands:
  list     List workflow runs
  view     View a workflow run <id>
`,0;if(!i)return e.stderr=`error: not signed in to GitHub. Run: gh auth login
`,1;const{flags:t,positional:a}=S(e.args.slice(2),ee),u=L(t)||await E(e);if(!u)return e.stderr=`error: could not detect repository. Use --repo owner/repo.
`,1;const d=`/repos/${u.owner}/${u.repo}`;switch(n){case"list":{const o=parseInt(t.L||t.limit||"20",10),{status:s,data:r}=await m(i,"GET",`${d}/actions/runs?per_page=${o}`);if(s!==200)return e.stderr=`error: API returned ${s}: ${r?.message||""}
`,1;const l=r.workflow_runs||[];if(t.json)return e.stdout=JSON.stringify(l)+`
`,0;if(l.length===0)return e.stdout=`No runs found
`,0;for(const f of l){const c=(f.status||"").padEnd(12),p=(f.conclusion||"").padEnd(10),g=(f.name||"").slice(0,30).padEnd(30),$=(f.head_branch||"").padEnd(20),b=O(f.created_at);e.stdout+=`${f.id}  ${c}  ${p}  ${g}  ${$}  ${b}
`}return 0}case"view":{const o=a[0];if(!o)return e.stderr=`usage: gh run view <run-id>
`,1;const{status:s,data:r}=await m(i,"GET",`${d}/actions/runs/${o}`);return s!==200?(e.stderr=`error: API returned ${s}: ${r?.message||""}
`,1):(e.stdout=`${r.name||"Run"} #${r.run_number||o}
`,e.stdout+=`Status: ${r.status}  Conclusion: ${r.conclusion||"pending"}
`,e.stdout+=`Branch: ${r.head_branch}  Event: ${r.event}
`,e.stdout+=`Started: ${O(r.created_at)}
`,e.stdout+=`
${r.html_url}
`,0)}default:return e.stderr=`gh run: '${n}' is not a valid subcommand. Valid: list, view
`,1}}(globalThis.__tabcomputerLive??=new Map).set("src/commands/gh-workflow.ts",we);const Ae=["repo","R","color","description","L","limit","json"];async function se(e,i){const n=e.args[1];if(!n||n==="--help")return e.stdout=`usage: gh label <command> [flags]

Commands:
  list     List labels
  create   Create a label <name> [--color HEX] [--description TEXT]
`,0;if(!i)return e.stderr=`error: not signed in to GitHub. Run: gh auth login
`,1;const{flags:t,positional:a}=S(e.args.slice(2),Ae),u=L(t)||await E(e);if(!u)return e.stderr=`error: could not detect repository. Use --repo owner/repo.
`,1;const d=`/repos/${u.owner}/${u.repo}`;switch(n){case"list":{const o=parseInt(t.L||t.limit||"30",10),{status:s,data:r}=await m(i,"GET",`${d}/labels?per_page=${o}`);if(s!==200)return e.stderr=`error: API returned ${s}: ${r?.message||""}
`,1;if(t.json)return e.stdout=JSON.stringify(r??[])+`
`,0;if(!r||r.length===0)return e.stdout=`No labels found
`,0;for(const l of r){const f=(l.name||"").padEnd(25),c=`#${l.color||"000000"}`,p=l.description||"";e.stdout+=`${f}  ${c}  ${p}
`}return 0}case"create":{const o=a[0];if(!o)return e.stderr=`error: label name is required
usage: gh label create <name> [--color HEX] [--description TEXT]
`,1;const s={name:o};if(t.color&&(s.color=t.color.replace(/^#/,"")),t.description&&(s.description=t.description),v(t))return e.stdout=`[dry-run] Would POST ${d}/labels
`,e.stdout+=`  name: ${o}
`,s.color&&(e.stdout+=`  color: #${s.color}
`),s.description&&(e.stdout+=`  description: ${s.description}
`),0;const{status:r,data:l}=await m(i,"POST",`${d}/labels`,s);if(r===201)e.stdout=`Created label "${l.name}" (#${l.color})
`;else return e.stderr=`error: failed to create label (HTTP ${r}): ${l?.message||""}
`,1;return 0}default:return e.stderr=`gh label: '${n}' is not a valid subcommand. Valid: list, create
`,1}}(globalThis.__tabcomputerLive??=new Map).set("src/commands/gh-label.ts",ye);const Le=["L","limit","json"];async function oe(e,i){const n=e.args[1];if(!n||n==="--help")return e.stdout=`usage: gh search <command> <query> [flags]

Commands:
  issues   Search issues
  repos    Search repositories
`,0;const{flags:t,positional:a}=S(e.args.slice(2),Le),u=a.join(" ");if(!u)return e.stderr=`error: search query is required
usage: gh search ${n} <query>
`,1;const d=parseInt(t.L||t.limit||"30",10);switch(n){case"issues":{const{status:o,data:s}=await m(i,"GET",`/search/issues?q=${encodeURIComponent(u)}&per_page=${d}`);if(o!==200)return e.stderr=`error: API returned ${o}: ${s?.message||""}
`,1;const r=s.items||[];if(t.json)return e.stdout=JSON.stringify(r)+`
`,0;if(r.length===0)return e.stdout=`No issues found
`,0;for(const l of r){const f=l.repository_url?.split("/").slice(-2).join("/")||"",c=`#${l.number}`.padEnd(7),p=(l.title||"").slice(0,60);e.stdout+=`${f}  ${c}  ${p}
`}return e.stdout+=`
${s.total_count} results
`,0}case"repos":{const{status:o,data:s}=await m(i,"GET",`/search/repositories?q=${encodeURIComponent(u)}&per_page=${d}`);if(o!==200)return e.stderr=`error: API returned ${o}: ${s?.message||""}
`,1;const r=s.items||[];if(t.json)return e.stdout=JSON.stringify(r)+`
`,0;if(r.length===0)return e.stdout=`No repositories found
`,0;for(const l of r){const f=(l.full_name||"").padEnd(35),c=`★${l.stargazers_count||0}`.padEnd(8),p=(l.description||"").slice(0,50);e.stdout+=`${f}  ${c}  ${p}
`}return e.stdout+=`
${s.total_count} results
`,0}default:return e.stderr=`gh search: '${n}' is not a valid subcommand. Valid: issues, repos
`,1}}(globalThis.__tabcomputerLive??=new Map).set("src/commands/gh-search.ts",_e);const qe={"issue list":"state|s= limit|L= label|l= assignee|a= search|S= milestone|m= json= jq|q= template|t=","issue create":"title|t= body|b= body-file|F= label|l= assignee|a= milestone|m= project|p= dry-run","issue view":"json= jq|q= template|t=","issue close":"dry-run","issue reopen":"","issue comment":"body|b= body-file|F= dry-run","issue edit":"title|t= body|b= body-file|F= add-label= dry-run","issue delete":"yes dry-run","issue lock":"","issue label":"add= remove=","pr list":"state|s= limit|L= json= jq|q= template|t=","pr create":"title|t= body|b= body-file|F= base|B= head|H= draft|d label|l= reviewer|r= assignee|a= dry-run","pr view":"json= jq|q= template|t=","pr merge":"merge|m squash|s rebase|r delete-branch|d auto body|b= body-file|F= dry-run","pr close":"dry-run","pr reopen":"","pr comment":"body|b= body-file|F= dry-run","pr diff":"","pr checks":"","pr review":"approve|a request-changes|r comment|c body|b= body-file|F= dry-run","pr edit":"title|t= body|b= body-file|F= base|B= dry-run","pr ready":"","release list":"limit|L= json= jq|q= template|t=","release create":"title|t= notes|n= notes-file|F= target= draft|d prerelease|p dry-run","release view":"json= jq|q= template|t=","release download":"","label list":"limit|L= json= jq|q= template|t=","label create":"color|c= description|d=","search issues":"limit|L= json= jq|q= template|t=","search repos":"limit|L= json= jq|q= template|t=","workflow list":"limit|L= json= jq|q= template|t=","workflow view":"","run list":"limit|L= json= jq|q= template|t=","run view":"","repo view":"json= jq|q= template|t=","repo list":"limit|L=","repo create":"public private internal source|s= description|d= homepage|h= remote|r= push clone","repo delete":"yes confirm","repo clone":"","auth status":"hostname|h= show-token|t","auth login":"scopes|s= hostname|h= git-protocol|p= with-token web|w","auth logout":"hostname|h=","auth refresh":"scopes|s= remove-scopes|r= hostname|h=","auth token":"hostname|h=","auth setup-git":"hostname|h= force|f","auth git-credential":"",api:"method|X= raw-field|f= field|F= header|H= input= jq|q= template|t= paginate dry-run"};class P extends Error{}function Re(e){const i=new Map;for(const n of["repo|R=","help|h",...e.split(/\s+/).filter(Boolean)]){const t=n.endsWith("="),[a,u]=n.replace(/=$/,"").split("|");i.set("--"+a,{long:a,value:t}),u&&i.set("-"+u,{long:a,value:t})}return i}async function ne(e,i){const n=i[0],t=n==="api"?"api":`${n} ${i[1]??""}`,a=qe[t];if(a===void 0)return null;const u=n==="api"?1:2,d=Re(a),o=i.slice(0,u),s=i.slice(u);let r=!1;for(let l=0;l<s.length;l++){const f=s[l];if(r||f==="-"||!f.startsWith("-")||/^-\d/.test(f)){o.push(f);continue}if(f==="--"){r=!0;continue}let c=f,p;if(f.startsWith("--")){const b=f.indexOf("=");b>0&&(c=f.slice(0,b),p=f.slice(b+1))}else f.length>2&&(c=f.slice(0,2),p=f.slice(2));const g=d.get(c);if(!g)throw new P(f.startsWith("--")?`unknown flag: ${c}`:`unknown shorthand flag: '${f[1]}' in ${f}`);if(!g.value){if(p!==void 0&&c.startsWith("-")&&!c.startsWith("--"))throw new P(`unknown shorthand flag: '${p[0]}' in ${f}`);(p===void 0||p==="true")&&o.push("--"+g.long);continue}let $=p;if($===void 0){if(l+1>=s.length)throw new P(`flag needs an argument: ${c}`);$=s[++l]}if(g.long==="body-file"||g.long==="notes-file"){let b;if($==="-")b=e.stdin;else try{const h=await e.fs.readFile(e.fs.resolvePath($,e.cwd),"utf8");b=typeof h=="string"?h:new TextDecoder().decode(h)}catch{throw new P(`open ${$}: no such file or directory`)}o.push(g.long==="body-file"?"--body":"--notes",b);continue}if(n==="api"&&(g.long==="raw-field"||g.long==="field"||g.long==="header"||g.long==="method")){o.push({"raw-field":"-f",field:"-F",header:"-H",method:"-X"}[g.long],$);continue}o.push("--"+g.long,$)}return o}const q=e=>e?{login:e.login,...e.name?{name:e.name}:{},...e.type==="Bot"?{is_bot:!0}:{}}:null,He=e=>({id:e.node_id,name:e.name,description:e.description??"",color:e.color}),C=e=>String(e??"").toUpperCase(),G={assignees:e=>(e.assignees??[]).map(q),author:e=>q(e.user),body:e=>e.body??"",closed:e=>e.state==="closed",closedAt:e=>e.closed_at,comments:e=>e.comments,createdAt:e=>e.created_at,id:e=>e.node_id,isPinned:()=>!1,labels:e=>(e.labels??[]).map(He),locked:e=>!!e.locked,milestone:e=>e.milestone?{number:e.milestone.number,title:e.milestone.title,description:e.milestone.description??"",dueOn:e.milestone.due_on}:null,number:e=>e.number,state:e=>C(e.state),stateReason:e=>C(e.state_reason??""),title:e=>e.title,updatedAt:e=>e.updated_at,url:e=>e.html_url},Ce={...G,additions:e=>e.additions,baseRefName:e=>e.base?.ref,changedFiles:e=>e.changed_files,deletions:e=>e.deletions,headRefName:e=>e.head?.ref,headRefOid:e=>e.head?.sha,headRepositoryOwner:e=>q(e.head?.repo?.owner),isDraft:e=>!!e.draft,mergeable:e=>e.mergeable===!0?"MERGEABLE":e.mergeable===!1?"CONFLICTING":"UNKNOWN",mergedAt:e=>e.merged_at,mergeCommit:e=>e.merge_commit_sha?{oid:e.merge_commit_sha}:null,reviewRequests:e=>(e.requested_reviewers??[]).map(q),state:e=>e.merged_at?"MERGED":C(e.state)},Ge={assets:e=>(e.assets??[]).map(i=>({name:i.name,size:i.size,url:i.browser_download_url,contentType:i.content_type,downloadCount:i.download_count})),author:e=>q(e.author),body:e=>e.body??"",createdAt:e=>e.created_at,id:e=>e.node_id,isDraft:e=>!!e.draft,isPrerelease:e=>!!e.prerelease,name:e=>e.name??"",publishedAt:e=>e.published_at,tagName:e=>e.tag_name,targetCommitish:e=>e.target_commitish,url:e=>e.html_url},ke={color:e=>e.color,description:e=>e.description??"",id:e=>e.node_id,isDefault:e=>!!e.default,name:e=>e.name,url:e=>e.url},Ne={createdAt:e=>e.created_at,description:e=>e.description??"",forksCount:e=>e.forks_count,fullName:e=>e.full_name,isArchived:e=>!!e.archived,isFork:e=>!!e.fork,isPrivate:e=>!!e.private,language:e=>e.language??"",name:e=>e.name,owner:e=>q(e.owner),stargazersCount:e=>e.stargazers_count,updatedAt:e=>e.updated_at,url:e=>e.html_url,visibility:e=>e.visibility},Ie={conclusion:e=>e.conclusion??"",createdAt:e=>e.created_at,databaseId:e=>e.id,displayTitle:e=>e.display_title,event:e=>e.event,headBranch:e=>e.head_branch,headSha:e=>e.head_sha,name:e=>e.name,number:e=>e.run_number,status:e=>e.status,updatedAt:e=>e.updated_at,url:e=>e.html_url,workflowDatabaseId:e=>e.workflow_id,workflowName:e=>e.name},Ue={id:e=>e.id,name:e=>e.name,path:e=>e.path,state:e=>e.state};function Fe(e,i){return e==="issue"?G:e==="pr"?Ce:e==="release"?Ge:e==="label"?ke:e==="search"?i==="repos"?Ne:G:e==="run"?Ie:e==="workflow"?Ue:null}function ae(e){const i=[];let n,t,a;for(let o=0;o<e.length;o++)e[o]==="--json"?n=e[++o]:e[o]==="--jq"?t=e[++o]:e[o]==="--template"?a=e[++o]:i.push(e[o]);if(e[0]==="api"){if(a!==void 0)throw new P("--template is not supported by the built-in gh; use --jq");return{args:[...i,...t!==void 0?["--jq",t]:[]],req:null}}if(a!==void 0)throw new P("--template is not supported by the built-in gh; use --jq");if(n===void 0){if(t!==void 0)throw new P("cannot use `--jq` without specifying `--json`");return{args:i,req:null}}const u=Fe(e[0],e[1]),d=n.split(",").map(o=>o.trim()).filter(Boolean);if(u){const o=d.find(s=>!(s in u));if(!d.length||o)throw new P((o?`Unknown JSON field: "${o}"
`:"Specify one or more comma-separated fields for `--json`:\n")+`Available fields:
${Object.keys(u).sort().map(s=>"  "+s).join(`
`)}`);return{args:[...i,"--json","*"],req:{fields:d,jq:t,table:u}}}return{args:[...i,"--json",n],req:{fields:null,jq:t,table:null}}}function ie(e,i,n){let t;try{t=JSON.parse(e.stdout)}catch{if(n==="list"||n==="issues"||n==="repos")t=[];else return 0}if(i.table&&i.fields){const a=u=>Object.fromEntries(i.fields.map(d=>[d,i.table[d](u)]));t=Array.isArray(t)?t.map(a):a(t)}if(i.jq!==void 0){let a;try{a=K(t,i.jq,!0,!0)}catch(u){return e.stdout="",e.stderr+=`failed to parse jq expression: ${u?.message??u}
`,1}return e.stdout=a.split(`
`).map(u=>{if(!u.startsWith('"'))return u;try{const d=JSON.parse(u);return typeof d=="string"?d:u}catch{return u}}).join(`
`),e.stdout&&!e.stdout.endsWith(`
`)&&(e.stdout+=`
`),0}return e.stdout=JSON.stringify(t,null,2)+`
`,0}(globalThis.__tabcomputerLive??=new Map).set("src/commands/gh-cli.ts",ve);function ue(e){return e.env.GITHUB_TOKEN||e.env.GH_TOKEN||typeof localStorage<"u"&&localStorage.getItem("tabcomputer_github_token")||""}async function E(e){try{const i=e.fs.toIsomorphicGitFS(),n=await z.listRemotes({fs:i,dir:e.cwd}),t=n.find(u=>u.remote==="origin")||n[0];if(!t)return null;const a=t.url.match(/github\.com[/:]([^/]+)\/([^/.]+)/);return a?{owner:a[1],repo:a[2]}:null}catch{return null}}async function m(e,i,n,t,a){const u=`${le()}/api/github`,d=n.startsWith("http")?n:`${u}${n.startsWith("/")?n:"/"+n}`,o={Accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28"};e&&(o.Authorization=`Bearer ${e}`);const s=typeof t=="string";(s||t)&&(o["Content-Type"]="application/json"),a&&Object.assign(o,a);const r=await fetch(d,{method:i,headers:o,body:s?t:t?JSON.stringify(t):void 0}),l=await r.json().catch(()=>null);return{status:r.status,data:l,headers:r.headers}}function S(e,i){const n={},t=[];for(let a=0;a<e.length;a++){const u=e[a];if(u.startsWith("--")||u.startsWith("-")&&u.length===2){const d=u.replace(/^-+/,"");if(i.includes(d)||i.includes(u))n[d]=e[++a]||"";else{const o=u.indexOf("=");o>0?n[u.slice(2,o)]=u.slice(o+1):n[d]="true"}}else t.push(u)}return{flags:n,positional:t}}function O(e){const i=Date.now(),n=new Date(e).getTime(),t=Math.floor((i-n)/1e3);if(t<60)return`${t}s ago`;const a=Math.floor(t/60);if(a<60)return`${a}m ago`;const u=Math.floor(a/60);if(u<24)return`${u}h ago`;const d=Math.floor(u/24);if(d<7)return`${d}d ago`;const o=Math.floor(d/7);return o<4?`${o}w ago`:`${Math.floor(d/30)}mo ago`}function L(e){const i=e.repo||e.R;if(!i)return null;const n=i.split("/");return n.length!==2?null:{owner:n[0],repo:n[1]}}function v(e){return e["dry-run"]==="true"}function D(e){return(e.get("x-oauth-scopes")||"").split(",").map(i=>i.trim()).filter(Boolean)}async function B(e,i){const n=r=>{e.terminal?e.terminal.writeOutput(r.replace(/\n/g,`\r
`)):e.stdout+=r};let t;try{t=await fe(i)}catch(r){return e.stderr+=`error: could not start GitHub sign-in: ${r?.message||r}
`,1}n(`! First copy your one-time code: ${t.user_code}
`),n(`Open this URL to continue in your web browser: ${t.verification_uri}
`);const a=typeof window<"u"&&typeof document<"u"?ce(t):null;a&&n(`(A sign-in panel opened with Copy and Open buttons.)
`);let u;try{u=await pe(t,{signal:a?.signal,onStatus:r=>a?.setStatus(r==="slow_down"?"Still waiting…":"Waiting for you to approve on GitHub…")})}catch(r){return a?.setStatus(`Sign-in failed: ${r?.message||r}`,"err"),e.stderr+=`error: GitHub sign-in ${r?.message==="cancelled"?"cancelled":"failed: "+(r?.message||r)}
`,1}me(u),e.env.GITHUB_TOKEN=u;const{status:d,data:o}=await m(u,"GET","/user"),s=d===200?o.login:"your account";a?.setStatus(`Signed in as ${s}.`,"ok"),setTimeout(()=>a?.close(),1200),n(`✓ Authentication complete.
✓ Logged in as ${s}
`);try{const r=await X(e.fs,u);r.name&&n(`✓ Set git user.name to "${r.name}"
`),r.email&&n(`✓ Set git user.email to ${r.email}
`)}catch{}return 0}function V(e){return(e.scopes??e.s??"").split(/[\s,]+/).filter(Boolean)}const Je={name:"gh",description:"GitHub CLI",async exec(e){const i=e.args[0];if(i==="--version"||i==="-v")return e.stdout=`gh 0.1.0 (tabcomputer)
`,0;if(!i||i==="--help"||i==="-h")return e.stdout=`usage: gh <command> <subcommand> [flags]

Commands:
  pr        Pull requests (list, create, view, merge, close, comment, diff, checks, review, edit, ready)
  issue     Issues (list, create, view, close, reopen, comment, edit, delete, lock, label)
  release   Releases (list, create, view, download)
  api       Make GitHub API requests
  auth      Authentication (status, login, logout)
  repo      Repository (view, list, create, clone)
  workflow  Workflows (list)
  run       Workflow runs (list, view)
  label     Labels (list, create)
  search    Search (issues, repos)
`,0;let n=null;try{const a=await ne(e,e.args);if(a){if(a.includes("--help"))return e.stdout=`usage: gh ${e.args.slice(0,i==="api"?1:2).join(" ")} [flags]
`,0;const u=ae(a);e.args=u.args,n=u.req}}catch(a){if(!(a instanceof P))throw a;return e.stderr+=`${a.message}

Usage:  gh ${e.args.slice(0,i==="api"?1:2).join(" ")} [flags]
`,1}const t=await Me(e,i);return n&&t===0?ie(e,n,e.args[1]??""):t}};async function Me(e,i){const n=ue(e);switch(i){case"auth":{const t=e.args[1]||"status";if(t==="status"){if(!n)return e.stderr=`You are not logged into any GitHub hosts. To log in, run: gh auth login
`,1;const{status:a,data:u,headers:d}=await m(n,"GET","/user");if(a!==200)return e.stderr=`error: authentication failed (HTTP ${a})
`,1;e.stdout=`github.com
  ✓ Logged in to github.com account ${u.login} (${u.name||""})
`,e.stdout+=`  - Token: ${n.slice(0,4)}${"*".repeat(Math.max(0,n.length-4))}
`;const o=D(d);o.length&&(e.stdout+=`  - Token scopes: ${o.map(s=>`'${s}'`).join(", ")}
`)}else if(t==="login"){const{flags:a}=S(e.args.slice(2),["scopes","s","hostname","h","git-protocol","p"]);if(a["with-token"]!=="true"){const u=V(a);return B(e,[...new Set([...I,...u])])}if(a["with-token"]==="true"){const u=(e.stdin||"").trim();if(!u)return e.stderr=`error: pipe a token via stdin: echo ghp_xxx | gh auth login --with-token
`,1;typeof localStorage<"u"&&localStorage.setItem(de,u),e.env.GITHUB_TOKEN=u,e.stdout=`Logged in. Token saved.
`,await X(e.fs,u).catch(()=>{})}else return 1}else if(t==="refresh"){const{flags:a}=S(e.args.slice(2),["scopes","s","remove-scopes","r","hostname","h"]);let u=[];n&&(u=D((await m(n,"GET","/user")).headers));const d=new Set((a["remove-scopes"]??a.r??"").split(/[\s,]+/).filter(Boolean)),o=[...new Set([...I,...u,...V(a)])].filter(s=>!d.has(s));return B(e,o)}else if(t==="token"){if(!n)return e.stderr=`no oauth token found for github.com
`,1;e.stdout=n+`
`}else if(t==="setup-git"){if(!n)return e.stderr=`You are not logged into any GitHub hosts. Run gh auth login first.
`,1;const{ensureGitCredentialHelper:a}=await H(async()=>{const{ensureGitCredentialHelper:u}=await import("./git-credential-CsANuzZC.js");return{ensureGitCredentialHelper:u}},[],import.meta.url);await a(e.fs)}else if(t==="git-credential"){const{credentialAnswer:a}=await H(async()=>{const{credentialAnswer:d}=await import("./git-credential-CsANuzZC.js");return{credentialAnswer:d}},[],import.meta.url),u=a(e.args[2]??"",e.stdin||"",n);u&&(e.stdout=u)}else if(t==="logout")typeof localStorage<"u"&&localStorage.removeItem("tabcomputer_github_token"),delete e.env.GITHUB_TOKEN,delete e.env.GH_TOKEN,e.stdout=`Logged out.
`;else return e.stderr=`gh auth: '${t}' is not a valid subcommand. Valid: login, logout, refresh, status, token, setup-git, git-credential
`,1;return 0}case"repo":{const t=e.args[1];if(!t||t==="--help")return e.stdout=`usage: gh repo <command> [flags]

Commands:
  view     View a repository [--json fields]
  list     List repositories [owner]
  create   Create a repository [owner/]<name> --public|--private [-d desc] [--source dir [--push] [--remote name]] [--clone]
  clone    Clone a repository <owner/repo> [dir]
  delete   Delete a repository <owner/repo> --yes
`,0;if(t==="view"){if(!n)return e.stderr=`error: not signed in to GitHub. Run: gh auth login
`,1;const{flags:a,positional:u}=S(e.args.slice(2),["repo","R","json","q","jq"]);let d=null;if(u[0]){const r=u[0].split("/");r.length===2&&(d={owner:r[0],repo:r[1]})}if(d||(d=L(a)||await E(e)),!d)return e.stderr=`error: could not detect repository. Use --repo owner/repo.
`,1;const{status:o,data:s}=await m(n,"GET",`/repos/${d.owner}/${d.repo}`);if(o!==200)return e.stderr=`error: API returned ${o}: ${s?.message||""}
`,1;if(a.json!==void 0){const r={name:s.name,nameWithOwner:s.full_name,owner:{login:s.owner?.login},description:s.description??"",url:s.html_url,sshUrl:s.ssh_url,visibility:String(s.visibility||(s.private?"private":"public")).toUpperCase(),isPrivate:!!s.private,isFork:!!s.fork,defaultBranchRef:{name:s.default_branch},stargazerCount:s.stargazers_count,createdAt:s.created_at,pushedAt:s.pushed_at},l=a.json&&a.json!=="true"?a.json.split(","):Object.keys(r),f={};for(const c of l)c in r&&(f[c]=r[c]);return e.stdout=JSON.stringify(f,null,2)+`
`,0}return e.stdout=`${s.full_name}
`,s.description&&(e.stdout+=`${s.description}
`),e.stdout+=`
Stars: ${s.stargazers_count}  Forks: ${s.forks_count}  Open Issues: ${s.open_issues_count}
`,e.stdout+=`Default branch: ${s.default_branch}
`,e.stdout+=`Language: ${s.language||"N/A"}  License: ${s.license?.spdx_id||"N/A"}
`,e.stdout+=`
${s.html_url}
`,0}if(t==="list"){if(!n)return e.stderr=`error: not signed in to GitHub. Run: gh auth login
`,1;const{flags:a,positional:u}=S(e.args.slice(2),["L","limit"]),d=parseInt(a.L||a.limit||"30",10),o=u[0],s=o?`/users/${o}/repos?per_page=${d}&sort=updated`:`/user/repos?per_page=${d}&sort=updated`,{status:r,data:l}=await m(n,"GET",s);if(r!==200)return e.stderr=`error: API returned ${r}: ${l?.message||""}
`,1;if(!l||l.length===0)return e.stdout=`No repositories found
`,0;for(const f of l){const c=(f.full_name||"").padEnd(35),p=(f.description||"").slice(0,45),g=f.private?"private":"public";e.stdout+=`${c}  ${g.padEnd(8)}  ${p}
`}return 0}if(t==="create"){if(!n)return e.stderr=`error: not signed in to GitHub. Run: gh auth login
`,1;const{flags:a,positional:u}=S(e.args.slice(2),["description","d","source","s","remote","r","homepage","h","team","t","template","p","gitignore","g","license","l"]),d=a.private==="true"?"private":a.public==="true"?"public":a.internal==="true"?"internal":"",o=a.source??a.s;let s=u[0]||"";if(!s&&o&&(s=e.fs.resolvePath(o,e.cwd).split("/").filter(Boolean).pop()||""),!s)return e.stderr=`error: repository name is required
usage: gh repo create [owner/]<name> --public|--private [--source dir [--push]]
`,1;if(!d)return e.stderr=`--public, --private, or --internal required when not running interactively
`,1;const[r,l]=s.includes("/")?s.split("/",2):["",s],f={name:l,private:d!=="public"};d==="internal"&&(f.visibility="internal");const c=a.description??a.d;c&&(f.description=c);const p=a.homepage??a.h;p&&(f.homepage=p);let g="/user/repos";r&&(await m(n,"GET","/user")).data?.login?.toLowerCase()!==r.toLowerCase()&&(g=`/orgs/${r}/repos`);const{status:$,data:b}=await m(n,"POST",g,f);if($!==201)return e.stderr=`error: failed to create repository (HTTP ${$}): ${b?.message||""}${b?.errors?" "+JSON.stringify(b.errors):""}
`,1;e.stdout=`✓ Created repository ${b.full_name} on GitHub
  ${b.html_url}
`;const h=b.clone_url,w=_=>e.shell.execute(_,T=>{e.stdout+=T},T=>{e.stderr+=T}),y=_=>"'"+_.replace(/'/g,"'\\''")+"'";if(o){const _=e.fs.resolvePath(o,e.cwd),T=a.remote??a.r??"origin",j=await w(`cd ${y(_)} && git remote add ${y(T)} ${y(h)}`);if(j!==0)return j;if(e.stdout+=`✓ Added remote ${h}
`,a.push==="true"){const A=await w(`cd ${y(_)} && git push ${y(T)}`);if(A!==0)return A;e.stdout+=`✓ Pushed commits to ${h}
`}}else if(a.clone==="true")return w(`git clone ${y(h)}`);return 0}if(t==="delete"){if(!n)return e.stderr=`error: not signed in to GitHub. Run: gh auth login
`,1;const{flags:a,positional:u}=S(e.args.slice(2),[]),d=u[0]?.includes("/")?{owner:u[0].split("/")[0],repo:u[0].split("/")[1]}:await E(e);if(!d)return e.stderr=`usage: gh repo delete <owner/repo> --yes
`,1;if(a.yes!=="true"&&a.confirm!=="true")return e.stderr=`--yes required to delete ${d.owner}/${d.repo} when not running interactively
`,1;const{status:o,data:s}=await m(n,"DELETE",`/repos/${d.owner}/${d.repo}`);if(o!==204){const r=o===403?" (the token needs the delete_repo scope)":"";return e.stderr=`error: failed to delete repository (HTTP ${o}): ${s?.message||""}${r}
`,1}return e.stdout=`✓ Deleted repository ${d.owner}/${d.repo}
`,0}if(t==="clone"){const a=e.args[2];if(!a)return e.stderr=`usage: gh repo clone <owner/repo> [directory]
`,1;const u=a.includes("/")?`https://github.com/${a}.git`:a,d=e.args[3]||"",o=d?`git clone ${u} ${d}`:`git clone ${u}`;return e.shell.execute(o,s=>{e.stdout+=s},s=>{e.stderr+=s})}return e.stderr=`gh repo: '${t}' is not a valid subcommand. Valid: view, list, create, clone, delete
`,1}case"pr":return Z(e,n);case"issue":return Q(e,n);case"release":return x(e,n);case"api":return Y(e,n);case"workflow":return te(e,n);case"run":return re(e,n);case"label":return se(e,n);case"search":return oe(e,n);default:return e.stderr=`gh: '${i}' is not a valid command. See 'gh --help'.
`,1}}(globalThis.__tabcomputerLive??=new Map).set("src/commands/gh.ts",Te);(globalThis.__tabcomputerLiveLoaders??=new Map).set("src/git-credential.ts",()=>H(()=>import("./git-credential-CsANuzZC.js"),[],import.meta.url));export{E as detectRepo,L as getRepoFromFlags,ue as getToken,m as ghApi,Je as ghCmd,v as isDryRun,S as parseFlags,O as timeAgo};
