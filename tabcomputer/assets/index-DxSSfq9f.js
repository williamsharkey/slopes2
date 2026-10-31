/*!
 * Copyright (c) Squirrel Chat et al., All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */function L(e,l){let i=e.slice(0,l).split(/\r?\n/);return[i.length,i.pop().length+1]}function B(e,l,i){let n=e.split(/\r?\n/),a="",s=(Math.log10(l+1)|0)+1;for(let r=l-1;r<=l+1;r++){let f=n[r-1];f&&(a+=r.toString().padEnd(s," "),a+=":  ",a+=f,a+=`
`,r===l&&(a+=" ".repeat(s+i+2),a+=`^
`))}return a}class u extends Error{line;column;codeblock;constructor(l,i){const[n,a]=L(i.toml,i.ptr),s=B(i.toml,n,a);super(`Invalid TOML document: ${l}

${s}`,i),this.line=n,this.column=a,this.codeblock=s}static x(l,i,n){throw new u(l,{toml:i.s,ptr:n??i.p})}}/*!
 * Copyright (c) Squirrel Chat et al., All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */function I(e){let l=e.p,i=e.s.charCodeAt(e.p++),n=i,a=i===39,s=i===e.s.charCodeAt(e.p)&&i===e.s.charCodeAt(e.p+1);s&&((i=e.s.charCodeAt(e.p+=2))===10?e.p++:i===13&&e.s.charCodeAt(e.p+1)===10&&(e.p+=2));let r="",f=e.p,t=0;for(;e.p<e.s.length;e.p++)if(i=e.s.charCodeAt(e.p),s&&(i===10||i===13&&e.s.charCodeAt(e.p+1)===10))t=t&&3;else if(i<32&&i!==9||i===127)u.x("control characters are not allowed in strings",e);else if((!t||t===3)&&i===n&&(!s||e.s.charCodeAt(e.p+1)===n&&e.s.charCodeAt(e.p+2)===n)){if(s&&(e.s.charCodeAt(e.p+3)===n&&e.p++,e.s.charCodeAt(e.p+3)===n&&e.p++),!t){let o=e.s.slice(f,e.p);r=r?r+o:o}return e.p+=s?3:1,r}else if(!t)!a&&i===92&&(r+=e.s.slice(f,f=e.p),t=1);else if(t===1)if(i===120||i===117||i===85){let o=e.p++-1,p=0,d=i===120?2:i===117?4:8;for(let b=0;b<d;b++,e.p++){let A=e.s.charCodeAt(e.p),y=A>=48&&A<=57?A-48:A>=65&&A<=70?A-65+10:A>=97&&A<=102?A-97+10:-1;y<0&&u.x("invalid non-hex character in unicode escape",e),p=p<<4|y}(p<0||p>1114111||p>=55296&&p<=57343)&&u.x("invalid unicode escape",e,o),r+=String.fromCodePoint(p),f=e.p--,t=0}else s&&(i===32||i===9)?t=2:(i===98?r+="\b":i===116?r+="	":i===110?r+=`
`:i===102?r+="\f":i===114?r+="\r":i===101?r+="\x1B":i===34?r+='"':i===92?r+="\\":u.x("unrecognised escape sequence",e),f=e.p+1,t=0);else i!==32&&i!==9&&(t===2&&u.x("invalid escape: only line-ending whitespace may be escaped",e,f),t=!a&&i===92?1:0,f=e.p);u.x("unfinished string",e,l)}/*!
 * Copyright (c) Squirrel Chat et al., All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */let Z=/^(\d{4}-\d{2}-\d{2})?[Tt ]?(?:(\d{2}):\d{2}(?::\d{2}(?:\.\d+)?)?)?(Z|z|[-+]\d{2}:\d{2})?$/i;class C extends Date{#i=!1;#l=!1;#e=null;constructor(l,i,n){let a=!0,s=!0,r="Z",f;if(typeof l=="string")if(i)e:{if(i<3){if(+l.slice(11,13)>23){l="";break e}i===2?(r=null,l+="Z"):(f=l.charCodeAt(l.length-1))!==90&&f!==122&&(r=l.slice(l.length-6)),n&&(l=l.slice(0,10)+"T"+l.slice(11))}else i===4&&(l=+l.slice(0,2)>23?"":`0000-01-01T${l}Z`);a=i!==4,s=i!==3}else{let t=l.match(Z);t?(t[1]||(a=!1,l=`0000-01-01T${l}`),s=!!t[2],s&&l[10]===" "&&(l=l.replace(" ","T")),t[2]&&+t[2]>23?l="":(r=t[3]||null,!r&&s&&(l+="Z"))):l=""}super(l),isNaN(this.getTime())||(this.#i=a,this.#l=s,this.#e=r)}isDateTime(){return this.#i&&this.#l}isLocal(){return!this.#i||!this.#l||!this.#e}isDate(){return this.#i&&!this.#l}isTime(){return this.#l&&!this.#i}isValid(){return this.#i||this.#l}toISOString(){let l=super.toISOString();if(this.isDate())return l.slice(0,10);if(this.isTime())return l.slice(11,23);if(this.#e===null)return l.slice(0,-1);if(this.#e==="Z"||this.#e==="z")return l;let i=+this.#e.slice(1,3)*60+ +this.#e.slice(4,6);return i=this.#e[0]==="-"?i:-i,new Date(this.getTime()-i*6e4).toISOString().slice(0,-1)+this.#e}static wrapAsOffsetDateTime(l,i="Z"){let n=new C(l);return n.#e=i,n}static wrapAsLocalDateTime(l){let i=new C(l);return i.#e=null,i}static wrapAsLocalDate(l){let i=new C(l);return i.#l=!1,i.#e=null,i}static wrapAsLocalTime(l){let i=new C(l);return i.#i=!1,i.#e=null,i}}/*!
 * Copyright (c) Squirrel Chat et al., All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */function h(e,l=10){return l===16?e>47&&e<58||e>64&&e<71||e>96&&e<103:e>47&&e<48+l}function k(e,l){return e===32||e===9||e===10||e===13||l&&(e===l||e===44)||e===35}function O(e,l){let i=e.p,n=e.s.charCodeAt(e.p);if(n===91||n===123){e.d--||u.x("document contains excessively nested structures. aborting.",e);let a=n===91?V(e):P(e);return e.d++,a}return n===34||n===39?I(e):n===116?((e.s.charCodeAt(++e.p)!==114||e.s.charCodeAt(++e.p)!==117||e.s.charCodeAt(++e.p)!==101)&&u.x("invalid value",e,i),e.p++,!0):n===102?((e.s.charCodeAt(++e.p)!==97||e.s.charCodeAt(++e.p)!==108||e.s.charCodeAt(++e.p)!==115||e.s.charCodeAt(++e.p)!==101)&&u.x("invalid value",e,i),e.p++,!1):n===43||n===45?w(e,e.p,e.s.charCodeAt(++e.p),44-n,l):e.s.charCodeAt(e.p+4)===45&&e.s.charCodeAt(e.p+7)===45?E(e,n,l):e.s.charCodeAt(e.p+2)===58?N(e,n,l):w(e,e.p,n,0,l)}function w(e,l,i,n,a){let s=i,r=0,f=!1;if(s===105)return(e.s.charCodeAt(++e.p)!==110||e.s.charCodeAt(++e.p)!==102)&&u.x("invalid value",e,l),e.p++,(n||1)/0;if(s===110)return(e.s.charCodeAt(++e.p)!==97||e.s.charCodeAt(++e.p)!==110)&&u.x("invalid value",e,l),e.p++,NaN;if(s===48){if(++e.p>=e.s.length||k(s=e.s.charCodeAt(e.p),a))return e.bi===!0?0n:0;if(!n){if(s===120)return v(e,l,16,a);if(s===98)return v(e,l,2,a);if(s===111)return v(e,l,8,a)}s===46?r=2:s===101||s===69?r=4:u.x("illegal leading zero",e,l)}else h(s)||u.x("invalid value",e,l);for(;++e.p<e.s.length&&(s=e.s.charCodeAt(e.p),!k(s,a));)r||(r=1),s===95?(r&1||u.x("illegal underscore",e),r+=11,f=!0):r===1&&s===46?r=2:(r===1||r===3)&&(s===101||s===69)?r=4:r===4&&(s===43||s===45)||(h(s)?r>9?r-=11:r&1||r++:u.x("illegal character in numeric literal",e));if(!r){let o=(i-48)*(n||1);return e.bi===!0?BigInt(o):o}r&1||u.x("unfinished numeric value",e,l);let t=e.s.slice(l,e.p);return f&&(t=t.replaceAll("_","")),r>1?parseFloat(t):S(e,t,10,l)}function v(e,l,i,n){let a,s=1;for(;++e.p<e.s.length&&(a=e.s.charCodeAt(e.p),!k(a,n));)a===95?(s&1&&u.x("illegal underscore",e),s=3):h(a,i)?s&1&&s--:u.x("illegal character in numeric literal",e);s&1&&u.x("unfinished numeric value",e);let r=e.s.slice(l+2,e.p);return s&&(r=r.replaceAll("_","")),S(e,r,i,l)}function S(e,l,i,n){if(e.bi!==!0)e:{let a=parseInt(l,i);if(!Number.isSafeInteger(a)){if(e.bi)break e;u.x("integer value cannot be represented losslessly",e,n)}return a}return BigInt(i===10?l:(i===2?"0b":i===8?"0o":"0x")+l)}function E(e,l,i){let n=e.p++,a;if(!h(l)||!h(e.s.charCodeAt(e.p++))||!h(e.s.charCodeAt(e.p++))||!h(e.s.charCodeAt(e.p++)))return w(e,e.p=n,l,0,i);if(e.p+=5,h(e.s.charCodeAt(e.p++))||u.x("invalid date-time: date part is malformed",e,n),e.p>=e.s.length||((l=e.s.charCodeAt(e.p))!==32||(a=!0,!h(e.s.charCodeAt(e.p+1))))&&l!==84&&l!==116){let r=e.s.slice(n,e.p);return m(e,r,3,!1,n)}if(e.s.charCodeAt(e.p+=3)!==58&&u.x("invalid date-time: time part is malformed",e,n),e.s.charCodeAt(e.p+=3)===58&&(e.p+=3),e.s.charCodeAt(e.p)===46)for(;h(e.s.charCodeAt(++e.p)););if(l=e.s.charCodeAt(e.p)){if(l===90||l===122){let r=e.s.slice(n,++e.p);return m(e,r,1,a,n,"[+00:00]")}if(l===43||l===45){let r=e.s.slice(n,e.p+=6);return m(e,r,1,a,n,!e.ld&&"["+e.s.slice(e.p-6,e.p)+"]")}}let s=e.s.slice(n,e.p);return m(e,s,2,a,n)}function N(e,l,i){let n=e.p;if(!h(l)||!h(e.s.charCodeAt(++e.p)))return w(e,--e.p,l,0,i);if(e.s.charCodeAt(e.p+=4)===58&&(e.p+=3),e.s.charCodeAt(e.p)===46)for(;h(e.s.charCodeAt(++e.p)););let a=e.s.slice(n,e.p);return m(e,a,4,!1,n)}function m(e,l,i,n,a,s){if(e.ld){let r=new C(l,i,n);return r.isValid()||u.x("invalid date",e,a),r}try{switch(s&&(l+=s),i){case 1:return Temporal.ZonedDateTime.from(l);case 2:return Temporal.PlainDateTime.from(l);case 3:return Temporal.PlainDate.from(l);case 4:return Temporal.PlainTime.from(l)}}catch(r){u.x(r instanceof Error?r.message:""+r,e,a)}}/*!
 * Copyright (c) Squirrel Chat et al., All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */function _(e){for(;e.p<e.s.length;e.p++){let l=e.s.charCodeAt(e.p);if(l===10)break;if(l===13&&e.s.charCodeAt(e.p+1)===10){e.p++;break}(l<32&&l!==9||l===127)&&u.x("control characters are not allowed in comments",e)}}function g(e,l,i){let n;for(;e.p<e.s.length;){for(;e.p<e.s.length&&((n=e.s.charCodeAt(e.p))===32||n===9||!l&&(n===10||n===13&&e.s.charCodeAt(e.p+1)===10));)e.p++;if(i||n!==35)break;_(e)}}/*!
 * Copyright (c) Squirrel Chat et al., All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */function T(e,l=61){let i,n=0,a=[],s,r=e.s.charCodeAt(i=e.p);do{if(r===l)return n||u.x("unexpected end of key",e),n===1&&a.push(e.s.slice(s,e.p)),e.p++,a;r===46?(n||u.x("illegal empty bare key",e),n===1&&a.push(e.s.slice(s,e.p)),n=0):!n&&(r===34||r===39)?(r===e.s.charCodeAt(e.p+1)&&r===e.s.charCodeAt(e.p+2)&&u.x("illegal quoted key: multiline strings are not allowed",e),a.push(I(e)),n=2,e.p--):r===32||r===9?n===1&&(a.push(e.s.slice(s,e.p)),n=2):n===2||r<48&&r!==45||r>57&&r<65||r>90&&r<97&&r!==95||r>122?u.x("illegal character in key",e):n||(n=1,s=e.p)}while(r=e.s.charCodeAt(++e.p));u.x("incomplete key-value: cannot find end of key",e,i)}function P(e){let l=e.p++,i=Object.create(null),n=new Set,a;for(;e.p<e.s.length;){if(g(e),(a=e.s.charCodeAt(e.p))===125)return e.p++,i;let s,r=i,f=!1,t=e.p,o=T(e);for(let d=0;d<o.length;d++){d&&(r=f?r[s]:r[s]=Object.create(null)),s=o[d],(f=Object.hasOwn(r,s))&&(typeof r[s]!="object"||n.has(r[s]))&&u.x("trying to redefine an already defined value",e,t);let b=s==="__proto__";if(e.uk&&(b||s==="constructor")){r=e.uk!==1&&u.x("document contains an unsafe property",e,t);break}!f&&b&&Object.defineProperty(r,s,{enumerable:!0,configurable:!0,writable:!0})}f&&u.x("trying to redefine an already defined value",e,t),g(e,!0,!0);let p=O(e,125);if(r&&typeof(r[s]=p)=="object"&&n.add(p),g(e),(a=e.s.charCodeAt(e.p++))===125)return i;a!==44&&u.x("expected comma or end of structure",e,e.p-1)}u.x("unfinished table",e,l)}function V(e){let l=e.p++,i=[],n;for(;e.p<e.s.length;){if(g(e),(n=e.s.charCodeAt(e.p))===93)return e.p++,i;if(i.push(O(e,93)),g(e),(n=e.s.charCodeAt(e.p++))===93)return i;n!==44&&u.x("expected comma or end of structure",e,e.p-1)}u.x("unfinished array",e,l)}/*!
 * Copyright (c) Squirrel Chat et al., All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */function D(e,l,i,n,a){let s=i,r=n,f,t=!1,o;for(let p=0;p<l.length;p++){if(p){if(s=t?s[f]:s[f]=Object.create(null),r=(o=r[f]).c,a===0&&(o.t===1||o.t===2))return null;if(o.t===2){let d=s.length-1;s=s[d],r=r[d].c}}if(f=l[p],(t=Object.hasOwn(s,f))&&r[f]?.t===0&&r[f]?.d)return null;if(!t){let d=f==="__proto__";if(e.uk&&(d||f==="constructor"))return!1;d&&(Object.defineProperty(s,f,{enumerable:!0,configurable:!0,writable:!0}),Object.defineProperty(r,f,{enumerable:!0,configurable:!0,writable:!0})),r[f]={t:p<l.length-1&&a===2?3:a,d:!1,i:0,c:Object.create(null)}}}if(o=r[f],o.t!==a&&!(a===1&&o.t===3)||(a===2&&(o.d||(o.d=!0,s[f]=[]),s[f].push(s=Object.create(null)),o.c[o.i++]=o={t:1,d:!1,i:0,c:Object.create(null)}),o.d))return null;if(o.d=!0,a===1)s=t?s[f]:s[f]=Object.create(null);else if(a===0&&t)return null;return[f,s,o.c]}function j(e,l,i){(l===null||e.uk===2)&&u.x(l===null?"trying to redefine an already defined table or value":"document contains an unsafe property",e,i)}function $(e,l={}){let i={s:e,p:0,d:l.maxDepth??1e3,bi:l.integersAsBigInt??!1,ld:l.useLegacyDate??!0,uk:l.unsafeKeyBehaviour==="throw"?2:l.unsafeKeyBehaviour==="drop"?1:0},n=Object.create(null),a=Object.create(null),s,r=!1,f=n,t=a;for(e.charCodeAt(0)===65279&&i.p++,g(i);i.p<e.length;){if(e.charCodeAt(i.p)===91){let o=e.charCodeAt(++i.p)===91;s=i.p+=+o,r=!1;let p=T(i,93);o&&(e.charCodeAt(i.p)!==93&&u.x("expected end of table array declaration",i),i.p++);let d=D(i,p,n,a,o?2:1);d?(t=d[2],f=d[1]):(j(i,d,s),r=!0)}else{s=i.p;let o=T(i),p=D(i,o,f,t,0);!p&&!r&&j(i,p,s),g(i,!0,!0);let d=O(i,void 0);p&&!r&&(p[1][p[0]]=d)}g(i,!0),i.p<e.length&&(s=e.charCodeAt(i.p))!==10&&(s!==13||e.charCodeAt(i.p+1)!==10)&&u.x("each key-value declaration must be followed by an end-of-line",i),g(i)}return n}export{C as TomlDate,u as TomlError,$ as parse};
