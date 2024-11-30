import{_ as Ou}from"./iframe-QqV0Ot3v.js";import{H as bu,s as qu,o as H,q as $,i as L,d as g,I as Vu,f as Zu,F as Qu,e as _,c as D,g as C,J as Eu,K as Nu,L as Pu,u as Ru,h as Uu,j as Ju,r as Ku,t as du,p as hu,a as p,m as k,v as pu,M as Gu,N as Wu,z as Xu,O as Yu,C as Z,w as G,D as Au,k as iu,l as nu,n as Iu}from"./lifecycle-DqH0ZNpE.js";import{S as zu,i as Su,c as S,b as j,m as M,t as x,a as w,d as O,e as ut,g as tt}from"./index-D54DD7SF.js";import{e as vu,u as et,o as at}from"./each-BFtjKjfB.js";import{g as ju,a as it}from"./spread-CgU5AtxT.js";import{T as nt}from"./Tag-DKabm7vX.js";import{T as lt}from"./Time-Doc-9H1q.js";import{I as st}from"./Image-CybGRPs1.js";import{T as ot,a as ct,b as rt,c as dt}from"./tooltip-arrow-B9jrsqxQ.js";import"../sb-preview/runtime.js";const ht=typeof window<"u"?window:typeof globalThis<"u"?globalThis:global;function pt(s){const u=s-1;return u*u*u+1}function mt(s,{delay:u=0,duration:a=400,easing:t=pt,x:l=0,y:i=0,opacity:o=0}={}){const e=getComputedStyle(s),r=+e.opacity,f=e.transform==="none"?"":e.transform,n=r*(1-o),[m,b]=bu(l),[F,h]=bu(i);return{delay:u,duration:a,easing:t,css:(E,T)=>`
			transform: ${f} translate(${(1-E)*m}${b}, ${(1-E)*F}${h});
			opacity: ${r-n*T}`}}function gt(s){let u,a,t,l,i;const o=s[2].default,e=Zu(o,s,s[4],null);let r=[{type:"button"},{class:a=s[1]+" sticky right-8 top-8 hidden rounded-full p-5 hover:bg-gray-100 lg:block dark:hover:bg-zinc-700"},s[5],{"aria-label":s[0]}],f={};for(let n=0;n<r.length;n+=1)f=Qu(f,r[n]);return{c(){u=_("button"),e&&e.c(),this.h()},l(n){u=D(n,"BUTTON",{type:!0,class:!0,"aria-label":!0});var m=C(u);e&&e.l(m),m.forEach(g),this.h()},h(){Eu(u,f)},m(n,m){L(n,u,m),e&&e.m(u,null),u.autofocus&&u.focus(),t=!0,l||(i=[Nu(s[5].action(u)),Pu(u,"click",s[3])],l=!0)},p(n,m){e&&e.p&&(!t||m&16)&&Ru(e,o,n,n[4],t?Ju(o,n[4],m,null):Uu(n[4]),null),Eu(u,f=ju(r,[{type:"button"},(!t||m&2&&a!==(a=n[1]+" sticky right-8 top-8 hidden rounded-full p-5 hover:bg-gray-100 lg:block dark:hover:bg-zinc-700"))&&{class:a},m&32&&n[5],(!t||m&1)&&{"aria-label":n[0]}]))},i(n){t||(x(e,n),t=!0)},o(n){w(e,n),t=!1},d(n){n&&g(u),e&&e.d(n),l=!1,Ku(i)}}}function ft(s){let u,a,t,l,i,o;return a=new dt({props:{class:"rounded-[2px] border-l border-t dark:border-zinc-700"}}),{c(){u=_("div"),S(a.$$.fragment),t=H(),l=_("div"),i=du(s[0]),this.h()},l(e){u=D(e,"DIV",{class:!0});var r=C(u);j(a.$$.fragment,r),r.forEach(g),t=$(e),l=D(e,"DIV",{class:!0});var f=C(l);i=hu(f,s[0]),f.forEach(g),this.h()},h(){p(u,"class","bg-black"),p(l,"class","flex items-center justify-center rounded-lg border bg-black p-3 text-sm text-gray-50 outline-none dark:border-zinc-700")},m(e,r){L(e,u,r),M(a,u,null),L(e,t,r),L(e,l,r),k(l,i),o=!0},p(e,r){(!o||r&1)&&pu(i,e[0])},i(e){o||(x(a.$$.fragment,e),o=!0)},o(e){w(a.$$.fragment,e),o=!1},d(e){e&&(g(u),g(t),g(l)),O(a)}}}function kt(s){let u,a,t,l;return u=new ct({props:{asChild:!0,$$slots:{default:[gt,({builder:i})=>({5:i}),({builder:i})=>i?32:0]},$$scope:{ctx:s}}}),t=new rt({props:{transition:mt,transitionConfig:{y:8,duration:150},sideOffset:4,$$slots:{default:[ft]},$$scope:{ctx:s}}}),{c(){S(u.$$.fragment),a=H(),S(t.$$.fragment)},l(i){j(u.$$.fragment,i),a=$(i),j(t.$$.fragment,i)},m(i,o){M(u,i,o),L(i,a,o),M(t,i,o),l=!0},p(i,o){const e={};o&51&&(e.$$scope={dirty:o,ctx:i}),u.$set(e);const r={};o&17&&(r.$$scope={dirty:o,ctx:i}),t.$set(r)},i(i){l||(x(u.$$.fragment,i),x(t.$$.fragment,i),l=!0)},o(i){w(u.$$.fragment,i),w(t.$$.fragment,i),l=!1},d(i){i&&g(a),O(u,i),O(t,i)}}}function Ft(s){let u,a;return u=new ot({props:{openDelay:300,$$slots:{default:[kt]},$$scope:{ctx:s}}}),{c(){S(u.$$.fragment)},l(t){j(u.$$.fragment,t)},m(t,l){M(u,t,l),a=!0},p(t,[l]){const i={};l&19&&(i.$$scope={dirty:l,ctx:t}),u.$set(i)},i(t){a||(x(u.$$.fragment,t),a=!0)},o(t){w(u.$$.fragment,t),a=!1},d(t){O(u,t)}}}function Bt(s,u,a){let{$$slots:t={},$$scope:l}=u,{label:i}=u,{className:o=""}=u;function e(r){Vu.call(this,s,r)}return s.$$set=r=>{"label"in r&&a(0,i=r.label),"className"in r&&a(1,o=r.className),"$$scope"in r&&a(4,l=r.$$scope)},[i,o,t,e,l]}class mu extends zu{constructor(u){super(),Su(this,u,Bt,Ft,qu,{label:0,className:1})}}mu.__docgen={version:3,name:"NavButton.svelte",data:[{visibility:"public",description:null,keywords:[],name:"label",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"className",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"string",type:"string"},defaultValue:""}],computed:[],methods:[],components:[],description:null,keywords:[],events:[{keywords:[],visibility:"public",description:"",name:"click",parent:"button",modificators:[],locations:null}],slots:[{keywords:[],visibility:"public",description:"",name:"default"}],refs:[]};const{document:_u}=ht;function Du(s,u,a){const t=s.slice();return t[7]=u[a],t}function yu(s,u){let a,t,l;const i=[u[7]];let o={};for(let e=0;e<i.length;e+=1)o=Qu(o,i[e]);return t=new nt({props:o}),{key:s,first:null,c(){a=Au(),S(t.$$.fragment),this.h()},l(e){a=Au(),j(t.$$.fragment,e),this.h()},h(){this.first=a},m(e,r){L(e,a,r),M(t,e,r),l=!0},p(e,r){u=e;const f=r&8?ju(i,[it(u[7])]):{};t.$set(f)},i(e){l||(x(t.$$.fragment,e),l=!0)},o(e){w(t.$$.fragment,e),l=!1},d(e){e&&g(a),O(t,e)}}}function Ct(s){let u,a;return{c(){u=iu("svg"),a=iu("path"),this.h()},l(t){u=nu(t,"svg",{xmlns:!0,fill:!0,viewBox:!0,"stroke-width":!0,stroke:!0,class:!0});var l=C(u);a=nu(l,"path",{"stroke-linecap":!0,"stroke-linejoin":!0,d:!0}),C(a).forEach(g),l.forEach(g),this.h()},h(){p(a,"stroke-linecap","round"),p(a,"stroke-linejoin","round"),p(a,"d","M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"),p(u,"xmlns","http://www.w3.org/2000/svg"),p(u,"fill","none"),p(u,"viewBox","0 0 24 24"),p(u,"stroke-width","1.5"),p(u,"stroke","currentColor"),p(u,"class","h-6 w-6")},m(t,l){L(t,u,l),k(u,a)},p:Iu,d(t){t&&g(u)}}}function bt(s){let u,a;return{c(){u=iu("svg"),a=iu("path"),this.h()},l(t){u=nu(t,"svg",{xmlns:!0,fill:!0,viewBox:!0,"stroke-width":!0,stroke:!0,class:!0});var l=C(u);a=nu(l,"path",{"stroke-linecap":!0,"stroke-linejoin":!0,d:!0}),C(a).forEach(g),l.forEach(g),this.h()},h(){p(a,"stroke-linecap","round"),p(a,"stroke-linejoin","round"),p(a,"d","M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"),p(u,"xmlns","http://www.w3.org/2000/svg"),p(u,"fill","none"),p(u,"viewBox","0 0 24 24"),p(u,"stroke-width","1.5"),p(u,"stroke","currentColor"),p(u,"class","h-7 w-7")},m(t,l){L(t,u,l),k(u,a)},p:Iu,d(t){t&&g(u)}}}function Et(s){let u,a=`const initialState =
      localStorage.getItem("toc-state") === "close" ? "close" : "open";

    if (initialState === "open") {
      document.documentElement.classList.add("open-toc");
    }`,t,l,i,o,e,r,f,n,m=`h-${s[6]}`,b,F,h,E=`time-${s[6]}`,T,B,W,X=`about-${s[6]}`,lu,q,A=[],gu=new Map,Y=`tag-${s[6]}`,su,V,N,U,ou,Q,I,cu,z,P;e=new st({props:{src:s[5].url,alt:s[5].title,width:480,height:270,slug:s[6],main:!0}}),h=new lt({props:{date:s[4]}});let J=vu(s[3]);const fu=c=>c[7].slug;for(let c=0;c<J.length;c+=1){let d=Du(s,J,c),v=fu(d);gu.set(v,A[c]=yu(v,d))}return I=new mu({props:{label:"目次を閉じる",className:"close-toc-button",$$slots:{default:[Ct]},$$scope:{ctx:s}}}),I.$on("click",At),z=new mu({props:{label:"目次を表示",className:"open-toc-button",$$slots:{default:[bt]},$$scope:{ctx:s}}}),z.$on("click",vt),{c(){u=_("script"),u.textContent=a,t=H(),l=_("article"),i=_("div"),o=_("div"),S(e.$$.fragment),r=H(),f=_("h1"),n=du(s[0]),b=H(),F=_("p"),S(h.$$.fragment),T=H(),B=_("p"),W=du(s[1]),lu=H(),q=_("div");for(let c=0;c<A.length;c+=1)A[c].c();su=H(),V=_("div"),N=_("div"),U=new Gu(!1),ou=H(),Q=_("div"),S(I.$$.fragment),cu=H(),S(z.$$.fragment),this.h()},l(c){const d=Wu("svelte-874l5r",_u.head);u=D(d,"SCRIPT",{"data-svelte-h":!0}),Xu(u)!=="svelte-1tvv9m2"&&(u.textContent=a),d.forEach(g),t=$(c),l=D(c,"ARTICLE",{"data-pagefind-body":!0});var v=C(l);i=D(v,"DIV",{class:!0});var R=C(i);o=D(R,"DIV",{class:!0});var y=C(o);j(e.$$.fragment,y),r=$(y),f=D(y,"H1",{class:!0});var K=C(f);n=hu(K,s[0]),K.forEach(g),b=$(y),F=D(y,"P",{class:!0});var ku=C(F);j(h.$$.fragment,ku),ku.forEach(g),T=$(y),B=D(y,"P",{class:!0});var Fu=C(B);W=hu(Fu,s[1]),Fu.forEach(g),lu=$(y),q=D(y,"DIV",{class:!0});var Bu=C(q);for(let ru=0;ru<A.length;ru+=1)A[ru].l(Bu);Bu.forEach(g),y.forEach(g),su=$(R),V=D(R,"DIV",{class:!0});var uu=C(V);N=D(uu,"DIV",{id:!0,class:!0});var Cu=C(N);U=Yu(Cu,!1),Cu.forEach(g),ou=$(uu),Q=D(uu,"DIV",{id:!0,class:!0});var tu=C(Q);j(I.$$.fragment,tu),cu=$(tu),j(z.$$.fragment,tu),tu.forEach(g),uu.forEach(g),R.forEach(g),v.forEach(g),this.h()},h(){p(f,"class","mt-4 text-2xl font-bold md:text-4xl"),Z(f,"--tag",m),p(F,"class","my-2"),Z(F,"--tag",E),p(B,"class","break-words text-sm text-black text-opacity-80 dark:text-gray-50 dark:text-opacity-80"),Z(B,"--tag",X),p(q,"class","mt-4 flex flex-wrap items-center leading-none"),Z(q,"--tag",Y),p(o,"class","mx-auto max-w-3xl"),U.a=null,p(N,"id","contents"),p(N,"class","show-line-number mx-auto mt-20 max-w-6xl"),p(Q,"id","nav-button"),p(Q,"class","absolute right-6 top-0"),p(V,"class","relative mx-auto max-w-6xl"),p(i,"class","p-4"),p(l,"data-pagefind-body","")},m(c,d){k(_u.head,u),L(c,t,d),L(c,l,d),k(l,i),k(i,o),M(e,o,null),k(o,r),k(o,f),k(f,n),k(o,b),k(o,F),M(h,F,null),k(o,T),k(o,B),k(B,W),k(o,lu),k(o,q);for(let v=0;v<A.length;v+=1)A[v]&&A[v].m(q,null);k(i,su),k(i,V),k(V,N),U.m(s[2],N),k(V,ou),k(V,Q),M(I,Q,null),k(Q,cu),M(z,Q,null),P=!0},p(c,[d]){const v={};d&32&&(v.src=c[5].url),d&32&&(v.alt=c[5].title),d&64&&(v.slug=c[6]),e.$set(v),(!P||d&1)&&pu(n,c[0]),d&64&&m!==(m=`h-${c[6]}`)&&Z(f,"--tag",m);const R={};d&16&&(R.date=c[4]),h.$set(R),d&64&&E!==(E=`time-${c[6]}`)&&Z(F,"--tag",E),(!P||d&2)&&pu(W,c[1]),d&64&&X!==(X=`about-${c[6]}`)&&Z(B,"--tag",X),d&8&&(J=vu(c[3]),tt(),A=et(A,d,fu,1,c,J,gu,q,at,yu,null,Du),ut()),d&64&&Y!==(Y=`tag-${c[6]}`)&&Z(q,"--tag",Y),(!P||d&4)&&U.p(c[2]);const y={};d&1024&&(y.$$scope={dirty:d,ctx:c}),I.$set(y);const K={};d&1024&&(K.$$scope={dirty:d,ctx:c}),z.$set(K)},i(c){if(!P){x(e.$$.fragment,c),x(h.$$.fragment,c);for(let d=0;d<J.length;d+=1)x(A[d]);x(I.$$.fragment,c),x(z.$$.fragment,c),P=!0}},o(c){w(e.$$.fragment,c),w(h.$$.fragment,c);for(let d=0;d<A.length;d+=1)w(A[d]);w(I.$$.fragment,c),w(z.$$.fragment,c),P=!1},d(c){c&&(g(t),g(l)),g(u),O(e),O(h);for(let d=0;d<A.length;d+=1)A[d].d();O(I),O(z)}}}function At(){document.documentElement.classList.remove("open-toc"),localStorage.setItem("toc-state","close")}function vt(){document.documentElement.classList.add("open-toc"),localStorage.setItem("toc-state","open")}function _t(s,u,a){let{title:t}=u,{about:l}=u,{contents:i}=u,{tags:o}=u,{createdAt:e}=u,{thumbnail:r}=u,{slug:f}=u;return G(()=>{Ou(()=>import("./baseline-status-DJHzC7xg.js"),[])}),G(()=>{const n=document.querySelectorAll("pre"),m='<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512" class="w-4 h-4"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M208 0H332.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V336c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48zM48 128h80v64H64V448H256V416h64v48c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48z"/></svg>',b='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>';n.forEach(F=>{const h=document.createElement("button");h.classList.add("absolute","right-2","top-2","rounded-md","text-gray-200","opacity-50","p-2","ring-2","ring-gray-500","ring-opacity-50","text-outline-none","hover:text-gray-500","hover:bg-gray-500","hover:opacity-100","hover:ring-2","hover:ring-gray-500","focus:text-gray-500","focus:ring-2","focus:ring-gray-500","focus:opacity-100"),h.style.backgroundColor="#212121",h.innerHTML=m,h.ariaLabel="コピー";const E=document.createElement("div");E.classList.add("absolute","top-2","right-12","px-2","py-1","rounded-md","bg-gray-100","dark:bg-zinc-500","text-gray-500","dark:text-gray-300","text-sm","transition-opacity","duration-300","opacity-0","pointer-events-none"),E.textContent="Copied!",h.addEventListener("click",()=>{var B;const T=(B=F.querySelector("code"))==null?void 0:B.textContent;navigator.clipboard.writeText(T),h.innerHTML=b,h.classList.remove("text-gray-200"),h.classList.remove("hover:text-gray-500"),h.classList.remove("focus:text-gray-500"),h.classList.add("text-green-500"),E.classList.remove("opacity-0"),setTimeout(()=>{E.classList.add("opacity-0"),h.innerHTML=m,h.classList.remove("text-green-500"),h.classList.add("text-gray-200"),h.classList.add("hover:text-gray-500"),h.classList.add("focus:text-gray-500")},1e3)}),F.insertAdjacentElement("afterend",h),h.insertAdjacentElement("afterend",E)})}),G(()=>{const n=document.getElementById("contents"),m=n==null?void 0:n.querySelectorAll("h1, h2, h3, h4, h5, h6"),b=document.querySelectorAll(".toc-link"),F=new IntersectionObserver(h=>{h.forEach(E=>{if(E.isIntersecting){const T=E.target.id;b.forEach(B=>{B.getAttribute("href")===`#${T}`?(B.classList.add("text-indigo-600"),B.classList.add("dark:text-indigo-400"),B.classList.add("font-bold")):(B.classList.remove("text-indigo-600"),B.classList.remove("dark:text-indigo-400"),B.classList.remove("font-bold"))})}})},{rootMargin:"-1px 0px -90% 0px"});return m==null||m.forEach(h=>{F.observe(h)}),()=>{F.disconnect()}}),G(()=>{const n=document.getElementById("nav-button"),m=document.getElementById("contents");n==null||n.setAttribute("style",`height: ${(m==null?void 0:m.clientHeight)-240}px`)}),G(()=>{document.querySelectorAll("#contents img").forEach(m=>{m.addEventListener("click",()=>{const b=document.createElement("dialog");b.open=!0,b.classList.add("fixed","inset-0","w-screen","h-screen","bg-black/80","backdrop-blur-sm","flex","items-center","justify-center","z-50","cursor-zoom-out"),b.addEventListener("click",()=>{b.remove()});const F=m.cloneNode();F.classList.add("animate-fade-in"),b.appendChild(F),document.body.appendChild(b)})})}),s.$$set=n=>{"title"in n&&a(0,t=n.title),"about"in n&&a(1,l=n.about),"contents"in n&&a(2,i=n.contents),"tags"in n&&a(3,o=n.tags),"createdAt"in n&&a(4,e=n.createdAt),"thumbnail"in n&&a(5,r=n.thumbnail),"slug"in n&&a(6,f=n.slug)},[t,l,i,o,e,r,f]}class Mu extends zu{constructor(u){super(),Su(this,u,_t,Et,qu,{title:0,about:1,contents:2,tags:3,createdAt:4,thumbnail:5,slug:6})}}Mu.__docgen={version:3,name:"Card.svelte",data:[{visibility:"public",description:null,keywords:[],name:"title",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"about",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"contents",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"tags",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"createdAt",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"thumbnail",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"slug",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}}],computed:[],methods:[],components:[],description:null,keywords:[],events:[],slots:[],refs:[]};const It={title:"Card",component:Mu,tags:["autodocs"],argTypes:{title:{control:{type:"text"}},contents:{control:{type:"text"}},tags:{control:{type:"array"}},createdAt:{control:{type:"date"}}}},eu={args:{title:"Card Title",contents:`
      <nav class="toc"><ol class="toc-level toc-level-1"><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#リンクカード">リンクカード</a></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#ヒント">ヒント</a></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#code---コードの挿入">Code - コードの挿入</a></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#format-text---テキストの装飾">Format Text - テキストの装飾</a><ol class="toc-level toc-level-2"><li class="toc-item toc-item-h3"><a class="toc-link toc-link-h3" href="#headers---見出し">Headers - 見出し</a></li><li class="toc-item toc-item-h1"><a class="toc-link toc-link-h1" href="#これはh1タグです">これはH1タグです</a><ol class="toc-level toc-level-3"><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#これはh2タグです">これはH2タグです</a><ol class="toc-level toc-level-4"><li class="toc-item toc-item-h3"><a class="toc-link toc-link-h3" href="#これはh3タグです">これはH3タグです</a><ol class="toc-level toc-level-5"><li class="toc-item toc-item-h4"><a class="toc-link toc-link-h4" href="#これはh4タグです">これはH4タグです</a><ol class="toc-level toc-level-6"><li class="toc-item toc-item-h5"><a class="toc-link toc-link-h5" href="#これはh5タグです">これはH5タグです</a><ol class="toc-level toc-level-7"><li class="toc-item toc-item-h6"><a class="toc-link toc-link-h6" href="#これはh6タグです">これはH6タグです</a></li></ol></li></ol></li></ol></li><li class="toc-item toc-item-h3"><a class="toc-link toc-link-h3" href="#emphasis---強調強勢">Emphasis - 強調・強勢</a></li><li class="toc-item toc-item-h3"><a class="toc-link toc-link-h3" href="#strikethrough---打ち消し線">Strikethrough - 打ち消し線</a></li><li class="toc-item toc-item-h3"><a class="toc-link toc-link-h3" href="#details---折りたたみ">Details - 折りたたみ</a></li></ol></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#lists---リスト">Lists - リスト</a><ol class="toc-level toc-level-4"><li class="toc-item toc-item-h3"><a class="toc-link toc-link-h3" href="#disc型">Disc型</a></li><li class="toc-item toc-item-h3"><a class="toc-link toc-link-h3" href="#decimal型">Decimal型</a></li><li class="toc-item toc-item-h3"><a class="toc-link toc-link-h3" href="#checkbox型">Checkbox型</a></li></ol></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#blockquotes---引用">Blockquotes - 引用</a></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#links---リンク">Links - リンク</a></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#images---画像埋め込み">Images - 画像埋め込み</a></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#テーブル記法">テーブル記法</a></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#注釈">注釈</a></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#footnote-label">Footnotes</a></li></ol></li></ol></li></ol></nav><h2 id="リンクカード"><a aria-hidden="true" tabindex="-1" href="#リンクカード"><span class="icon icon-link"></span></a>リンクカード</h2>
<p></p><div class="link-card__wrapper"><a class="link-card" href="https://zenn.dev/" rel="noreferrer noopener" target="_blank"><div class="link-card__main"><div class="link-card__content"><div class="link-card__title">Zenn｜エンジニアのための情報共有コミュニティ</div><div class="link-card__description">Zennはエンジニアが技術・開発についての知見をシェアする場所です。本の販売や、読者からのバッジの受付により対価を受け取ることができます。</div></div><div class="link-card__meta"><img class="link-card__favicon" src="https://www.google.com/s2/favicons?domain=zenn.dev&amp;sz=14" width="14" height="14" alt=""><span class="link-card__url">zenn.dev</span></div></div><div class="link-card__thumbnail"><img src="https://zenn.dev/images/logo-only-dark.png" class="link-card__image" alt=""></div></a></div><p></p>
<h2 id="ヒント"><a aria-hidden="true" tabindex="-1" href="#ヒント"><span class="icon icon-link"></span></a>ヒント</h2>
<pre><code class="code-highlight"><span class="code-line line-number" line="1">!&gt; Here is a tip.
</span></code></pre>
<p class="hint tip">Here is a tip.</p>
<pre><code class="code-highlight"><span class="code-line line-number" line="1">?&gt; And a warning.
</span></code></pre>
<p class="hint warn">And a warning.</p>
<pre><code class="code-highlight"><span class="code-line line-number" line="1">x&gt; Or an error.
</span></code></pre>
<p class="hint error">Or an error.</p>
<h2 id="code---コードの挿入"><a aria-hidden="true" tabindex="-1" href="#code---コードの挿入"><span class="icon icon-link"></span></a>Code - コードの挿入</h2>
<pre class="language-ruby"><code class="language-ruby code-highlight"><span class="code-line line-number" line="1">puts <span class="token string-literal"><span class="token string">'The best way to log and share programmers knowledge.'</span></span>
</span></code></pre>
<div class="rehype-code-title">src/index.js</div><pre class="language-js"><code class="language-js code-highlight"><span class="code-line line-number" line="1"><span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">'js'</span><span class="token punctuation">)</span>
</span></code></pre>
<p><code> puts 'Qiita'</code> はプログラマのための技術情報共有サービスです。</p>
<h2 id="format-text---テキストの装飾"><a aria-hidden="true" tabindex="-1" href="#format-text---テキストの装飾"><span class="icon icon-link"></span></a>Format Text - テキストの装飾</h2>
<h3 id="headers---見出し"><a aria-hidden="true" tabindex="-1" href="#headers---見出し"><span class="icon icon-link"></span></a>Headers - 見出し</h3>
<h1 id="これはh1タグです"><a aria-hidden="true" tabindex="-1" href="#これはh1タグです"><span class="icon icon-link"></span></a>これはH1タグです</h1>
<h2 id="これはh2タグです"><a aria-hidden="true" tabindex="-1" href="#これはh2タグです"><span class="icon icon-link"></span></a>これはH2タグです</h2>
<h3 id="これはh3タグです"><a aria-hidden="true" tabindex="-1" href="#これはh3タグです"><span class="icon icon-link"></span></a>これはH3タグです</h3>
<h4 id="これはh4タグです"><a aria-hidden="true" tabindex="-1" href="#これはh4タグです"><span class="icon icon-link"></span></a>これはH4タグです</h4>
<h5 id="これはh5タグです"><a aria-hidden="true" tabindex="-1" href="#これはh5タグです"><span class="icon icon-link"></span></a>これはH5タグです</h5>
<h6 id="これはh6タグです"><a aria-hidden="true" tabindex="-1" href="#これはh6タグです"><span class="icon icon-link"></span></a>これはH6タグです</h6>
<h3 id="emphasis---強調強勢"><a aria-hidden="true" tabindex="-1" href="#emphasis---強調強勢"><span class="icon icon-link"></span></a>Emphasis - 強調・強勢</h3>
<p>_ か * で囲むとHTMLのemタグになります。Qiitaでは<em>イタリック体</em>になります。
__ か ** で囲むとHTMLのstrongタグになります。Qiitaでは<strong>太字</strong>になります。</p>
<h3 id="strikethrough---打ち消し線"><a aria-hidden="true" tabindex="-1" href="#strikethrough---打ち消し線"><span class="icon icon-link"></span></a>Strikethrough - 打ち消し線</h3>
<p>打ち消し線を使うには ~~ で囲みます。 <del>打ち消し</del></p>
<h3 id="details---折りたたみ"><a aria-hidden="true" tabindex="-1" href="#details---折りたたみ"><span class="icon icon-link"></span></a>Details - 折りたたみ</h3>
<details><summary>Qiita(キータ)は、プログラマのための技術情報共有サービスです。</summary>
プログラミングに関することをどんどん投稿して、知識を記録、共有しましょう。
Qiitaに投稿すると、自分のコードやノウハウを見やすい形で残すことができます。
技術情報はテキストファイルへのメモではなく、タグを付けた文章、シンタックスハイライトされたコードで保存することで初めて再利用可能な知識になる、そうQiitaでは考えています。</details>
<h2 id="lists---リスト"><a aria-hidden="true" tabindex="-1" href="#lists---リスト"><span class="icon icon-link"></span></a>Lists - リスト</h2>
<h3 id="disc型"><a aria-hidden="true" tabindex="-1" href="#disc型"><span class="icon icon-link"></span></a>Disc型</h3>
<ul>
<li>文頭に「*」「+」「-」のいずれかを入れるとDisc型リストになります</li>
<li>要点をまとめる際に便利です
<ul>
<li>リストを挿入する際は、 <strong>リストの上下に空行がないと正しく表示されません。また「*」「+」「-」の後にはスペースが必要です</strong></li>
</ul>
</li>
</ul>
<h3 id="decimal型"><a aria-hidden="true" tabindex="-1" href="#decimal型"><span class="icon icon-link"></span></a>Decimal型</h3>
<ol>
<li>文頭に「数字.」を入れるとDecimal型リストになります</li>
<li>後からの挿入/移動を考慮して、1. 2. 3. と順番にするのではなく、1. 1. 1. という風に同じ数字にしておくといい具合です。</li>
<li>リストを挿入する際は、 <strong>リストの上下に空行がないと正しく表示されません。また「数字.」の後にはスペースが必要です</strong></li>
</ol>
</ul>
<h2 id="blockquotes---引用"><a aria-hidden="true" tabindex="-1" href="#blockquotes---引用"><span class="icon icon-link"></span></a>Blockquotes - 引用</h2>
<blockquote>
<p>&gt; 文頭に&gt;を置くことで引用になります。</p>
</blockquote>
<blockquote>
<blockquote>
<p>これはネストされた引用です。</p>
</blockquote>
</blockquote>
<h2 id="links---リンク"><a aria-hidden="true" tabindex="-1" href="#links---リンク"><span class="icon icon-link"></span></a>Links - リンク</h2>
<p><a href="http://qiita.com" title="Qiita">Qiita</a></p>
<h2 id="images---画像埋め込み"><a aria-hidden="true" tabindex="-1" href="#images---画像埋め込み"><span class="icon icon-link"></span></a>Images - 画像埋め込み</h2>
<p><img src="https://qiita-image-store.s3.amazonaws.com/0/45617/015bd058-7ea0-e6a5-b9cb-36a4fb38e59c.png" alt="Qiita" title="Qiita"></p>
<h2 id="テーブル記法"><a aria-hidden="true" tabindex="-1" href="#テーブル記法"><span class="icon icon-link"></span></a>テーブル記法</h2>
<table>
<thead>
<tr>
<th align="left">Left align</th>
<th align="right">Right align</th>
<th align="center">Center align</th>
</tr>
</thead>
<tbody>
<tr>
<td align="left">This</td>
<td align="right">This</td>
<td align="center">This</td>
</tr>
<tr>
<td align="left">column</td>
<td align="right">column</td>
<td align="center">column</td>
</tr>
<tr>
<td align="left">will</td>
<td align="right">will</td>
<td align="center">will</td>
</tr>
<tr>
<td align="left">be</td>
<td align="right">be</td>
<td align="center">be</td>
</tr>
<tr>
<td align="left">left</td>
<td align="right">right</td>
<td align="center">center</td>
</tr>
<tr>
<td align="left">aligned</td>
<td align="right">aligned</td>
<td align="center">aligned</td>
</tr>
</tbody>
</table>
<h2 id="注釈"><a aria-hidden="true" tabindex="-1" href="#注釈"><span class="icon icon-link"></span></a>注釈</h2>
<p>本文中に<code>[^1]</code>や<code>[^example]</code>のように文字列を記述することで、脚注へのリンクを表現できます。注釈内容は、同じく本文中に <code>[^1]: ...</code> というように記述します<sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref="" aria-describedby="footnote-label">1</a></sup>。</p>
<section data-footnotes="" class="footnotes"><h2 class="sr-only" id="footnote-label"><a aria-hidden="true" tabindex="-1" href="#footnote-label"><span class="icon icon-link"></span></a>Footnotes</h2>
<ol>
<li id="user-content-fn-1">
<p>注釈内容を記述する位置は、本文の途中でも末尾でも構いません。 <a href="#user-content-fnref-1" data-footnote-backref="" class="data-footnote-backref" aria-label="Back to content">↩</a></p>
</li>
</ol>
</section>
    `,tags:[{name:"tag1",slug:"tag1"},{name:"tag2",slug:"tag2"},{name:"tag3",slug:"tag3"}],createdAt:new Date().toISOString()}},au={args:{title:"Card Title",contents:`
      <nav class="toc"><ol class="toc-level toc-level-1"><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#リンクカード">リンクカード</a></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#ヒント">ヒント</a></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#code---コードの挿入">Code - コードの挿入</a></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#format-text---テキストの装飾">Format Text - テキストの装飾</a><ol class="toc-level toc-level-2"><li class="toc-item toc-item-h3"><a class="toc-link toc-link-h3" href="#headers---見出し">Headers - 見出し</a></li><li class="toc-item toc-item-h1"><a class="toc-link toc-link-h1" href="#これはh1タグです">これはH1タグです</a><ol class="toc-level toc-level-3"><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#これはh2タグです">これはH2タグです</a><ol class="toc-level toc-level-4"><li class="toc-item toc-item-h3"><a class="toc-link toc-link-h3" href="#これはh3タグです">これはH3タグです</a><ol class="toc-level toc-level-5"><li class="toc-item toc-item-h4"><a class="toc-link toc-link-h4" href="#これはh4タグです">これはH4タグです</a><ol class="toc-level toc-level-6"><li class="toc-item toc-item-h5"><a class="toc-link toc-link-h5" href="#これはh5タグです">これはH5タグです</a><ol class="toc-level toc-level-7"><li class="toc-item toc-item-h6"><a class="toc-link toc-link-h6" href="#これはh6タグです">これはH6タグです</a></li></ol></li></ol></li></ol></li><li class="toc-item toc-item-h3"><a class="toc-link toc-link-h3" href="#emphasis---強調強勢">Emphasis - 強調・強勢</a></li><li class="toc-item toc-item-h3"><a class="toc-link toc-link-h3" href="#strikethrough---打ち消し線">Strikethrough - 打ち消し線</a></li><li class="toc-item toc-item-h3"><a class="toc-link toc-link-h3" href="#details---折りたたみ">Details - 折りたたみ</a></li></ol></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#lists---リスト">Lists - リスト</a><ol class="toc-level toc-level-4"><li class="toc-item toc-item-h3"><a class="toc-link toc-link-h3" href="#disc型">Disc型</a></li><li class="toc-item toc-item-h3"><a class="toc-link toc-link-h3" href="#decimal型">Decimal型</a></li><li class="toc-item toc-item-h3"><a class="toc-link toc-link-h3" href="#checkbox型">Checkbox型</a></li></ol></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#blockquotes---引用">Blockquotes - 引用</a></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#links---リンク">Links - リンク</a></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#images---画像埋め込み">Images - 画像埋め込み</a></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#テーブル記法">テーブル記法</a></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#注釈">注釈</a></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#footnote-label">Footnotes</a></li></ol></li></ol></li></ol></nav><h2 id="リンクカード"><a aria-hidden="true" tabindex="-1" href="#リンクカード"><span class="icon icon-link"></span></a>リンクカード</h2>
<p></p><div class="link-card__wrapper"><a class="link-card" href="https://zenn.dev/" rel="noreferrer noopener" target="_blank"><div class="link-card__main"><div class="link-card__content"><div class="link-card__title">Zenn｜エンジニアのための情報共有コミュニティ</div><div class="link-card__description">Zennはエンジニアが技術・開発についての知見をシェアする場所です。本の販売や、読者からのバッジの受付により対価を受け取ることができます。</div></div><div class="link-card__meta"><img class="link-card__favicon" src="https://www.google.com/s2/favicons?domain=zenn.dev&amp;sz=14" width="14" height="14" alt=""><span class="link-card__url">zenn.dev</span></div></div><div class="link-card__thumbnail"><img src="https://zenn.dev/images/logo-only-dark.png" class="link-card__image" alt=""></div></a></div><p></p>
<h2 id="ヒント"><a aria-hidden="true" tabindex="-1" href="#ヒント"><span class="icon icon-link"></span></a>ヒント</h2>
<pre><code class="code-highlight"><span class="code-line line-number" line="1">!&gt; Here is a tip.
</span></code></pre>
<p class="hint tip">Here is a tip.</p>
<pre><code class="code-highlight"><span class="code-line line-number" line="1">?&gt; And a warning.
</span></code></pre>
<p class="hint warn">And a warning.</p>
<pre><code class="code-highlight"><span class="code-line line-number" line="1">x&gt; Or an error.
</span></code></pre>
<p class="hint error">Or an error.</p>
<h2 id="code---コードの挿入"><a aria-hidden="true" tabindex="-1" href="#code---コードの挿入"><span class="icon icon-link"></span></a>Code - コードの挿入</h2>
<pre class="language-ruby"><code class="language-ruby code-highlight"><span class="code-line line-number" line="1">puts <span class="token string-literal"><span class="token string">'The best way to log and share programmers knowledge.'</span></span>
</span></code></pre>
<div class="rehype-code-title">src/index.js</div><pre class="language-js"><code class="language-js code-highlight"><span class="code-line line-number" line="1"><span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">'js'</span><span class="token punctuation">)</span>
</span></code></pre>
<p><code> puts 'Qiita'</code> はプログラマのための技術情報共有サービスです。</p>
<h2 id="format-text---テキストの装飾"><a aria-hidden="true" tabindex="-1" href="#format-text---テキストの装飾"><span class="icon icon-link"></span></a>Format Text - テキストの装飾</h2>
<h3 id="headers---見出し"><a aria-hidden="true" tabindex="-1" href="#headers---見出し"><span class="icon icon-link"></span></a>Headers - 見出し</h3>
<h1 id="これはh1タグです"><a aria-hidden="true" tabindex="-1" href="#これはh1タグです"><span class="icon icon-link"></span></a>これはH1タグです</h1>
<h2 id="これはh2タグです"><a aria-hidden="true" tabindex="-1" href="#これはh2タグです"><span class="icon icon-link"></span></a>これはH2タグです</h2>
<h3 id="これはh3タグです"><a aria-hidden="true" tabindex="-1" href="#これはh3タグです"><span class="icon icon-link"></span></a>これはH3タグです</h3>
<h4 id="これはh4タグです"><a aria-hidden="true" tabindex="-1" href="#これはh4タグです"><span class="icon icon-link"></span></a>これはH4タグです</h4>
<h5 id="これはh5タグです"><a aria-hidden="true" tabindex="-1" href="#これはh5タグです"><span class="icon icon-link"></span></a>これはH5タグです</h5>
<h6 id="これはh6タグです"><a aria-hidden="true" tabindex="-1" href="#これはh6タグです"><span class="icon icon-link"></span></a>これはH6タグです</h6>
<h3 id="emphasis---強調強勢"><a aria-hidden="true" tabindex="-1" href="#emphasis---強調強勢"><span class="icon icon-link"></span></a>Emphasis - 強調・強勢</h3>
<p>_ か * で囲むとHTMLのemタグになります。Qiitaでは<em>イタリック体</em>になります。
__ か ** で囲むとHTMLのstrongタグになります。Qiitaでは<strong>太字</strong>になります。</p>
<h3 id="strikethrough---打ち消し線"><a aria-hidden="true" tabindex="-1" href="#strikethrough---打ち消し線"><span class="icon icon-link"></span></a>Strikethrough - 打ち消し線</h3>
<p>打ち消し線を使うには ~~ で囲みます。 <del>打ち消し</del></p>
<h3 id="details---折りたたみ"><a aria-hidden="true" tabindex="-1" href="#details---折りたたみ"><span class="icon icon-link"></span></a>Details - 折りたたみ</h3>
<details><summary>Qiita(キータ)は、プログラマのための技術情報共有サービスです。</summary>
プログラミングに関することをどんどん投稿して、知識を記録、共有しましょう。
Qiitaに投稿すると、自分のコードやノウハウを見やすい形で残すことができます。
技術情報はテキストファイルへのメモではなく、タグを付けた文章、シンタックスハイライトされたコードで保存することで初めて再利用可能な知識になる、そうQiitaでは考えています。</details>
<h2 id="lists---リスト"><a aria-hidden="true" tabindex="-1" href="#lists---リスト"><span class="icon icon-link"></span></a>Lists - リスト</h2>
<h3 id="disc型"><a aria-hidden="true" tabindex="-1" href="#disc型"><span class="icon icon-link"></span></a>Disc型</h3>
<ul>
<li>文頭に「*」「+」「-」のいずれかを入れるとDisc型リストになります</li>
<li>要点をまとめる際に便利です
<ul>
<li>リストを挿入する際は、 <strong>リストの上下に空行がないと正しく表示されません。また「*」「+」「-」の後にはスペースが必要です</strong></li>
</ul>
</li>
</ul>
<h3 id="decimal型"><a aria-hidden="true" tabindex="-1" href="#decimal型"><span class="icon icon-link"></span></a>Decimal型</h3>
<ol>
<li>文頭に「数字.」を入れるとDecimal型リストになります</li>
<li>後からの挿入/移動を考慮して、1. 2. 3. と順番にするのではなく、1. 1. 1. という風に同じ数字にしておくといい具合です。</li>
<li>リストを挿入する際は、 <strong>リストの上下に空行がないと正しく表示されません。また「数字.」の後にはスペースが必要です</strong></li>
</ol>
</ul>
<h2 id="blockquotes---引用"><a aria-hidden="true" tabindex="-1" href="#blockquotes---引用"><span class="icon icon-link"></span></a>Blockquotes - 引用</h2>
<blockquote>
<p>&gt; 文頭に&gt;を置くことで引用になります。</p>
</blockquote>
<blockquote>
<blockquote>
<p>これはネストされた引用です。</p>
</blockquote>
</blockquote>
<h2 id="links---リンク"><a aria-hidden="true" tabindex="-1" href="#links---リンク"><span class="icon icon-link"></span></a>Links - リンク</h2>
<p><a href="http://qiita.com" title="Qiita">Qiita</a></p>
<h2 id="images---画像埋め込み"><a aria-hidden="true" tabindex="-1" href="#images---画像埋め込み"><span class="icon icon-link"></span></a>Images - 画像埋め込み</h2>
<p><img src="https://qiita-image-store.s3.amazonaws.com/0/45617/015bd058-7ea0-e6a5-b9cb-36a4fb38e59c.png" alt="Qiita" title="Qiita"></p>
<h2 id="テーブル記法"><a aria-hidden="true" tabindex="-1" href="#テーブル記法"><span class="icon icon-link"></span></a>テーブル記法</h2>
<table>
<thead>
<tr>
<th align="left">Left align</th>
<th align="right">Right align</th>
<th align="center">Center align</th>
</tr>
</thead>
<tbody>
<tr>
<td align="left">This</td>
<td align="right">This</td>
<td align="center">This</td>
</tr>
<tr>
<td align="left">column</td>
<td align="right">column</td>
<td align="center">column</td>
</tr>
<tr>
<td align="left">will</td>
<td align="right">will</td>
<td align="center">will</td>
</tr>
<tr>
<td align="left">be</td>
<td align="right">be</td>
<td align="center">be</td>
</tr>
<tr>
<td align="left">left</td>
<td align="right">right</td>
<td align="center">center</td>
</tr>
<tr>
<td align="left">aligned</td>
<td align="right">aligned</td>
<td align="center">aligned</td>
</tr>
</tbody>
</table>
<h2 id="注釈"><a aria-hidden="true" tabindex="-1" href="#注釈"><span class="icon icon-link"></span></a>注釈</h2>
<p>本文中に<code>[^1]</code>や<code>[^example]</code>のように文字列を記述することで、脚注へのリンクを表現できます。注釈内容は、同じく本文中に <code>[^1]: ...</code> というように記述します<sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref="" aria-describedby="footnote-label">1</a></sup>。</p>
<section data-footnotes="" class="footnotes"><h2 class="sr-only" id="footnote-label"><a aria-hidden="true" tabindex="-1" href="#footnote-label"><span class="icon icon-link"></span></a>Footnotes</h2>
<ol>
<li id="user-content-fn-1">
<p>注釈内容を記述する位置は、本文の途中でも末尾でも構いません。 <a href="#user-content-fnref-1" data-footnote-backref="" class="data-footnote-backref" aria-label="Back to content">↩</a></p>
</li>
</ol>
</section>
    `,tags:[{name:"tag1",slug:"tag1"},{name:"tag2",slug:"tag2"},{name:"tag3",slug:"tag3"}],createdAt:new Date().toISOString()}};var xu,wu,Hu;eu.parameters={...eu.parameters,docs:{...(xu=eu.parameters)==null?void 0:xu.docs,source:{originalSource:`{
  args: {
    title: "Card Title",
    contents: \`
      <nav class="toc"><ol class="toc-level toc-level-1"><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#リンクカード">リンクカード</a></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#ヒント">ヒント</a></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#code---コードの挿入">Code - コードの挿入</a></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#format-text---テキストの装飾">Format Text - テキストの装飾</a><ol class="toc-level toc-level-2"><li class="toc-item toc-item-h3"><a class="toc-link toc-link-h3" href="#headers---見出し">Headers - 見出し</a></li><li class="toc-item toc-item-h1"><a class="toc-link toc-link-h1" href="#これはh1タグです">これはH1タグです</a><ol class="toc-level toc-level-3"><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#これはh2タグです">これはH2タグです</a><ol class="toc-level toc-level-4"><li class="toc-item toc-item-h3"><a class="toc-link toc-link-h3" href="#これはh3タグです">これはH3タグです</a><ol class="toc-level toc-level-5"><li class="toc-item toc-item-h4"><a class="toc-link toc-link-h4" href="#これはh4タグです">これはH4タグです</a><ol class="toc-level toc-level-6"><li class="toc-item toc-item-h5"><a class="toc-link toc-link-h5" href="#これはh5タグです">これはH5タグです</a><ol class="toc-level toc-level-7"><li class="toc-item toc-item-h6"><a class="toc-link toc-link-h6" href="#これはh6タグです">これはH6タグです</a></li></ol></li></ol></li></ol></li><li class="toc-item toc-item-h3"><a class="toc-link toc-link-h3" href="#emphasis---強調強勢">Emphasis - 強調・強勢</a></li><li class="toc-item toc-item-h3"><a class="toc-link toc-link-h3" href="#strikethrough---打ち消し線">Strikethrough - 打ち消し線</a></li><li class="toc-item toc-item-h3"><a class="toc-link toc-link-h3" href="#details---折りたたみ">Details - 折りたたみ</a></li></ol></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#lists---リスト">Lists - リスト</a><ol class="toc-level toc-level-4"><li class="toc-item toc-item-h3"><a class="toc-link toc-link-h3" href="#disc型">Disc型</a></li><li class="toc-item toc-item-h3"><a class="toc-link toc-link-h3" href="#decimal型">Decimal型</a></li><li class="toc-item toc-item-h3"><a class="toc-link toc-link-h3" href="#checkbox型">Checkbox型</a></li></ol></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#blockquotes---引用">Blockquotes - 引用</a></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#links---リンク">Links - リンク</a></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#images---画像埋め込み">Images - 画像埋め込み</a></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#テーブル記法">テーブル記法</a></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#注釈">注釈</a></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#footnote-label">Footnotes</a></li></ol></li></ol></li></ol></nav><h2 id="リンクカード"><a aria-hidden="true" tabindex="-1" href="#リンクカード"><span class="icon icon-link"></span></a>リンクカード</h2>
<p></p><div class="link-card__wrapper"><a class="link-card" href="https://zenn.dev/" rel="noreferrer noopener" target="_blank"><div class="link-card__main"><div class="link-card__content"><div class="link-card__title">Zenn｜エンジニアのための情報共有コミュニティ</div><div class="link-card__description">Zennはエンジニアが技術・開発についての知見をシェアする場所です。本の販売や、読者からのバッジの受付により対価を受け取ることができます。</div></div><div class="link-card__meta"><img class="link-card__favicon" src="https://www.google.com/s2/favicons?domain=zenn.dev&amp;sz=14" width="14" height="14" alt=""><span class="link-card__url">zenn.dev</span></div></div><div class="link-card__thumbnail"><img src="https://zenn.dev/images/logo-only-dark.png" class="link-card__image" alt=""></div></a></div><p></p>
<h2 id="ヒント"><a aria-hidden="true" tabindex="-1" href="#ヒント"><span class="icon icon-link"></span></a>ヒント</h2>
<pre><code class="code-highlight"><span class="code-line line-number" line="1">!&gt; Here is a tip.
</span></code></pre>
<p class="hint tip">Here is a tip.</p>
<pre><code class="code-highlight"><span class="code-line line-number" line="1">?&gt; And a warning.
</span></code></pre>
<p class="hint warn">And a warning.</p>
<pre><code class="code-highlight"><span class="code-line line-number" line="1">x&gt; Or an error.
</span></code></pre>
<p class="hint error">Or an error.</p>
<h2 id="code---コードの挿入"><a aria-hidden="true" tabindex="-1" href="#code---コードの挿入"><span class="icon icon-link"></span></a>Code - コードの挿入</h2>
<pre class="language-ruby"><code class="language-ruby code-highlight"><span class="code-line line-number" line="1">puts <span class="token string-literal"><span class="token string">'The best way to log and share programmers knowledge.'</span></span>
</span></code></pre>
<div class="rehype-code-title">src/index.js</div><pre class="language-js"><code class="language-js code-highlight"><span class="code-line line-number" line="1"><span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">'js'</span><span class="token punctuation">)</span>
</span></code></pre>
<p><code> puts 'Qiita'</code> はプログラマのための技術情報共有サービスです。</p>
<h2 id="format-text---テキストの装飾"><a aria-hidden="true" tabindex="-1" href="#format-text---テキストの装飾"><span class="icon icon-link"></span></a>Format Text - テキストの装飾</h2>
<h3 id="headers---見出し"><a aria-hidden="true" tabindex="-1" href="#headers---見出し"><span class="icon icon-link"></span></a>Headers - 見出し</h3>
<h1 id="これはh1タグです"><a aria-hidden="true" tabindex="-1" href="#これはh1タグです"><span class="icon icon-link"></span></a>これはH1タグです</h1>
<h2 id="これはh2タグです"><a aria-hidden="true" tabindex="-1" href="#これはh2タグです"><span class="icon icon-link"></span></a>これはH2タグです</h2>
<h3 id="これはh3タグです"><a aria-hidden="true" tabindex="-1" href="#これはh3タグです"><span class="icon icon-link"></span></a>これはH3タグです</h3>
<h4 id="これはh4タグです"><a aria-hidden="true" tabindex="-1" href="#これはh4タグです"><span class="icon icon-link"></span></a>これはH4タグです</h4>
<h5 id="これはh5タグです"><a aria-hidden="true" tabindex="-1" href="#これはh5タグです"><span class="icon icon-link"></span></a>これはH5タグです</h5>
<h6 id="これはh6タグです"><a aria-hidden="true" tabindex="-1" href="#これはh6タグです"><span class="icon icon-link"></span></a>これはH6タグです</h6>
<h3 id="emphasis---強調強勢"><a aria-hidden="true" tabindex="-1" href="#emphasis---強調強勢"><span class="icon icon-link"></span></a>Emphasis - 強調・強勢</h3>
<p>_ か * で囲むとHTMLのemタグになります。Qiitaでは<em>イタリック体</em>になります。
__ か ** で囲むとHTMLのstrongタグになります。Qiitaでは<strong>太字</strong>になります。</p>
<h3 id="strikethrough---打ち消し線"><a aria-hidden="true" tabindex="-1" href="#strikethrough---打ち消し線"><span class="icon icon-link"></span></a>Strikethrough - 打ち消し線</h3>
<p>打ち消し線を使うには ~~ で囲みます。 <del>打ち消し</del></p>
<h3 id="details---折りたたみ"><a aria-hidden="true" tabindex="-1" href="#details---折りたたみ"><span class="icon icon-link"></span></a>Details - 折りたたみ</h3>
<details><summary>Qiita(キータ)は、プログラマのための技術情報共有サービスです。</summary>
プログラミングに関することをどんどん投稿して、知識を記録、共有しましょう。
Qiitaに投稿すると、自分のコードやノウハウを見やすい形で残すことができます。
技術情報はテキストファイルへのメモではなく、タグを付けた文章、シンタックスハイライトされたコードで保存することで初めて再利用可能な知識になる、そうQiitaでは考えています。</details>
<h2 id="lists---リスト"><a aria-hidden="true" tabindex="-1" href="#lists---リスト"><span class="icon icon-link"></span></a>Lists - リスト</h2>
<h3 id="disc型"><a aria-hidden="true" tabindex="-1" href="#disc型"><span class="icon icon-link"></span></a>Disc型</h3>
<ul>
<li>文頭に「*」「+」「-」のいずれかを入れるとDisc型リストになります</li>
<li>要点をまとめる際に便利です
<ul>
<li>リストを挿入する際は、 <strong>リストの上下に空行がないと正しく表示されません。また「*」「+」「-」の後にはスペースが必要です</strong></li>
</ul>
</li>
</ul>
<h3 id="decimal型"><a aria-hidden="true" tabindex="-1" href="#decimal型"><span class="icon icon-link"></span></a>Decimal型</h3>
<ol>
<li>文頭に「数字.」を入れるとDecimal型リストになります</li>
<li>後からの挿入/移動を考慮して、1. 2. 3. と順番にするのではなく、1. 1. 1. という風に同じ数字にしておくといい具合です。</li>
<li>リストを挿入する際は、 <strong>リストの上下に空行がないと正しく表示されません。また「数字.」の後にはスペースが必要です</strong></li>
</ol>
</ul>
<h2 id="blockquotes---引用"><a aria-hidden="true" tabindex="-1" href="#blockquotes---引用"><span class="icon icon-link"></span></a>Blockquotes - 引用</h2>
<blockquote>
<p>&gt; 文頭に&gt;を置くことで引用になります。</p>
</blockquote>
<blockquote>
<blockquote>
<p>これはネストされた引用です。</p>
</blockquote>
</blockquote>
<h2 id="links---リンク"><a aria-hidden="true" tabindex="-1" href="#links---リンク"><span class="icon icon-link"></span></a>Links - リンク</h2>
<p><a href="http://qiita.com" title="Qiita">Qiita</a></p>
<h2 id="images---画像埋め込み"><a aria-hidden="true" tabindex="-1" href="#images---画像埋め込み"><span class="icon icon-link"></span></a>Images - 画像埋め込み</h2>
<p><img src="https://qiita-image-store.s3.amazonaws.com/0/45617/015bd058-7ea0-e6a5-b9cb-36a4fb38e59c.png" alt="Qiita" title="Qiita"></p>
<h2 id="テーブル記法"><a aria-hidden="true" tabindex="-1" href="#テーブル記法"><span class="icon icon-link"></span></a>テーブル記法</h2>
<table>
<thead>
<tr>
<th align="left">Left align</th>
<th align="right">Right align</th>
<th align="center">Center align</th>
</tr>
</thead>
<tbody>
<tr>
<td align="left">This</td>
<td align="right">This</td>
<td align="center">This</td>
</tr>
<tr>
<td align="left">column</td>
<td align="right">column</td>
<td align="center">column</td>
</tr>
<tr>
<td align="left">will</td>
<td align="right">will</td>
<td align="center">will</td>
</tr>
<tr>
<td align="left">be</td>
<td align="right">be</td>
<td align="center">be</td>
</tr>
<tr>
<td align="left">left</td>
<td align="right">right</td>
<td align="center">center</td>
</tr>
<tr>
<td align="left">aligned</td>
<td align="right">aligned</td>
<td align="center">aligned</td>
</tr>
</tbody>
</table>
<h2 id="注釈"><a aria-hidden="true" tabindex="-1" href="#注釈"><span class="icon icon-link"></span></a>注釈</h2>
<p>本文中に<code>[^1]</code>や<code>[^example]</code>のように文字列を記述することで、脚注へのリンクを表現できます。注釈内容は、同じく本文中に <code>[^1]: ...</code> というように記述します<sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref="" aria-describedby="footnote-label">1</a></sup>。</p>
<section data-footnotes="" class="footnotes"><h2 class="sr-only" id="footnote-label"><a aria-hidden="true" tabindex="-1" href="#footnote-label"><span class="icon icon-link"></span></a>Footnotes</h2>
<ol>
<li id="user-content-fn-1">
<p>注釈内容を記述する位置は、本文の途中でも末尾でも構いません。 <a href="#user-content-fnref-1" data-footnote-backref="" class="data-footnote-backref" aria-label="Back to content">↩</a></p>
</li>
</ol>
</section>
    \`,
    tags: [{
      name: "tag1",
      slug: "tag1"
    }, {
      name: "tag2",
      slug: "tag2"
    }, {
      name: "tag3",
      slug: "tag3"
    }],
    createdAt: new Date().toISOString()
  }
}`,...(Hu=(wu=eu.parameters)==null?void 0:wu.docs)==null?void 0:Hu.source}}};var $u,Lu,Tu;au.parameters={...au.parameters,docs:{...($u=au.parameters)==null?void 0:$u.docs,source:{originalSource:`{
  args: {
    title: "Card Title",
    contents: \`
      <nav class="toc"><ol class="toc-level toc-level-1"><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#リンクカード">リンクカード</a></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#ヒント">ヒント</a></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#code---コードの挿入">Code - コードの挿入</a></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#format-text---テキストの装飾">Format Text - テキストの装飾</a><ol class="toc-level toc-level-2"><li class="toc-item toc-item-h3"><a class="toc-link toc-link-h3" href="#headers---見出し">Headers - 見出し</a></li><li class="toc-item toc-item-h1"><a class="toc-link toc-link-h1" href="#これはh1タグです">これはH1タグです</a><ol class="toc-level toc-level-3"><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#これはh2タグです">これはH2タグです</a><ol class="toc-level toc-level-4"><li class="toc-item toc-item-h3"><a class="toc-link toc-link-h3" href="#これはh3タグです">これはH3タグです</a><ol class="toc-level toc-level-5"><li class="toc-item toc-item-h4"><a class="toc-link toc-link-h4" href="#これはh4タグです">これはH4タグです</a><ol class="toc-level toc-level-6"><li class="toc-item toc-item-h5"><a class="toc-link toc-link-h5" href="#これはh5タグです">これはH5タグです</a><ol class="toc-level toc-level-7"><li class="toc-item toc-item-h6"><a class="toc-link toc-link-h6" href="#これはh6タグです">これはH6タグです</a></li></ol></li></ol></li></ol></li><li class="toc-item toc-item-h3"><a class="toc-link toc-link-h3" href="#emphasis---強調強勢">Emphasis - 強調・強勢</a></li><li class="toc-item toc-item-h3"><a class="toc-link toc-link-h3" href="#strikethrough---打ち消し線">Strikethrough - 打ち消し線</a></li><li class="toc-item toc-item-h3"><a class="toc-link toc-link-h3" href="#details---折りたたみ">Details - 折りたたみ</a></li></ol></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#lists---リスト">Lists - リスト</a><ol class="toc-level toc-level-4"><li class="toc-item toc-item-h3"><a class="toc-link toc-link-h3" href="#disc型">Disc型</a></li><li class="toc-item toc-item-h3"><a class="toc-link toc-link-h3" href="#decimal型">Decimal型</a></li><li class="toc-item toc-item-h3"><a class="toc-link toc-link-h3" href="#checkbox型">Checkbox型</a></li></ol></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#blockquotes---引用">Blockquotes - 引用</a></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#links---リンク">Links - リンク</a></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#images---画像埋め込み">Images - 画像埋め込み</a></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#テーブル記法">テーブル記法</a></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#注釈">注釈</a></li><li class="toc-item toc-item-h2"><a class="toc-link toc-link-h2" href="#footnote-label">Footnotes</a></li></ol></li></ol></li></ol></nav><h2 id="リンクカード"><a aria-hidden="true" tabindex="-1" href="#リンクカード"><span class="icon icon-link"></span></a>リンクカード</h2>
<p></p><div class="link-card__wrapper"><a class="link-card" href="https://zenn.dev/" rel="noreferrer noopener" target="_blank"><div class="link-card__main"><div class="link-card__content"><div class="link-card__title">Zenn｜エンジニアのための情報共有コミュニティ</div><div class="link-card__description">Zennはエンジニアが技術・開発についての知見をシェアする場所です。本の販売や、読者からのバッジの受付により対価を受け取ることができます。</div></div><div class="link-card__meta"><img class="link-card__favicon" src="https://www.google.com/s2/favicons?domain=zenn.dev&amp;sz=14" width="14" height="14" alt=""><span class="link-card__url">zenn.dev</span></div></div><div class="link-card__thumbnail"><img src="https://zenn.dev/images/logo-only-dark.png" class="link-card__image" alt=""></div></a></div><p></p>
<h2 id="ヒント"><a aria-hidden="true" tabindex="-1" href="#ヒント"><span class="icon icon-link"></span></a>ヒント</h2>
<pre><code class="code-highlight"><span class="code-line line-number" line="1">!&gt; Here is a tip.
</span></code></pre>
<p class="hint tip">Here is a tip.</p>
<pre><code class="code-highlight"><span class="code-line line-number" line="1">?&gt; And a warning.
</span></code></pre>
<p class="hint warn">And a warning.</p>
<pre><code class="code-highlight"><span class="code-line line-number" line="1">x&gt; Or an error.
</span></code></pre>
<p class="hint error">Or an error.</p>
<h2 id="code---コードの挿入"><a aria-hidden="true" tabindex="-1" href="#code---コードの挿入"><span class="icon icon-link"></span></a>Code - コードの挿入</h2>
<pre class="language-ruby"><code class="language-ruby code-highlight"><span class="code-line line-number" line="1">puts <span class="token string-literal"><span class="token string">'The best way to log and share programmers knowledge.'</span></span>
</span></code></pre>
<div class="rehype-code-title">src/index.js</div><pre class="language-js"><code class="language-js code-highlight"><span class="code-line line-number" line="1"><span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">'js'</span><span class="token punctuation">)</span>
</span></code></pre>
<p><code> puts 'Qiita'</code> はプログラマのための技術情報共有サービスです。</p>
<h2 id="format-text---テキストの装飾"><a aria-hidden="true" tabindex="-1" href="#format-text---テキストの装飾"><span class="icon icon-link"></span></a>Format Text - テキストの装飾</h2>
<h3 id="headers---見出し"><a aria-hidden="true" tabindex="-1" href="#headers---見出し"><span class="icon icon-link"></span></a>Headers - 見出し</h3>
<h1 id="これはh1タグです"><a aria-hidden="true" tabindex="-1" href="#これはh1タグです"><span class="icon icon-link"></span></a>これはH1タグです</h1>
<h2 id="これはh2タグです"><a aria-hidden="true" tabindex="-1" href="#これはh2タグです"><span class="icon icon-link"></span></a>これはH2タグです</h2>
<h3 id="これはh3タグです"><a aria-hidden="true" tabindex="-1" href="#これはh3タグです"><span class="icon icon-link"></span></a>これはH3タグです</h3>
<h4 id="これはh4タグです"><a aria-hidden="true" tabindex="-1" href="#これはh4タグです"><span class="icon icon-link"></span></a>これはH4タグです</h4>
<h5 id="これはh5タグです"><a aria-hidden="true" tabindex="-1" href="#これはh5タグです"><span class="icon icon-link"></span></a>これはH5タグです</h5>
<h6 id="これはh6タグです"><a aria-hidden="true" tabindex="-1" href="#これはh6タグです"><span class="icon icon-link"></span></a>これはH6タグです</h6>
<h3 id="emphasis---強調強勢"><a aria-hidden="true" tabindex="-1" href="#emphasis---強調強勢"><span class="icon icon-link"></span></a>Emphasis - 強調・強勢</h3>
<p>_ か * で囲むとHTMLのemタグになります。Qiitaでは<em>イタリック体</em>になります。
__ か ** で囲むとHTMLのstrongタグになります。Qiitaでは<strong>太字</strong>になります。</p>
<h3 id="strikethrough---打ち消し線"><a aria-hidden="true" tabindex="-1" href="#strikethrough---打ち消し線"><span class="icon icon-link"></span></a>Strikethrough - 打ち消し線</h3>
<p>打ち消し線を使うには ~~ で囲みます。 <del>打ち消し</del></p>
<h3 id="details---折りたたみ"><a aria-hidden="true" tabindex="-1" href="#details---折りたたみ"><span class="icon icon-link"></span></a>Details - 折りたたみ</h3>
<details><summary>Qiita(キータ)は、プログラマのための技術情報共有サービスです。</summary>
プログラミングに関することをどんどん投稿して、知識を記録、共有しましょう。
Qiitaに投稿すると、自分のコードやノウハウを見やすい形で残すことができます。
技術情報はテキストファイルへのメモではなく、タグを付けた文章、シンタックスハイライトされたコードで保存することで初めて再利用可能な知識になる、そうQiitaでは考えています。</details>
<h2 id="lists---リスト"><a aria-hidden="true" tabindex="-1" href="#lists---リスト"><span class="icon icon-link"></span></a>Lists - リスト</h2>
<h3 id="disc型"><a aria-hidden="true" tabindex="-1" href="#disc型"><span class="icon icon-link"></span></a>Disc型</h3>
<ul>
<li>文頭に「*」「+」「-」のいずれかを入れるとDisc型リストになります</li>
<li>要点をまとめる際に便利です
<ul>
<li>リストを挿入する際は、 <strong>リストの上下に空行がないと正しく表示されません。また「*」「+」「-」の後にはスペースが必要です</strong></li>
</ul>
</li>
</ul>
<h3 id="decimal型"><a aria-hidden="true" tabindex="-1" href="#decimal型"><span class="icon icon-link"></span></a>Decimal型</h3>
<ol>
<li>文頭に「数字.」を入れるとDecimal型リストになります</li>
<li>後からの挿入/移動を考慮して、1. 2. 3. と順番にするのではなく、1. 1. 1. という風に同じ数字にしておくといい具合です。</li>
<li>リストを挿入する際は、 <strong>リストの上下に空行がないと正しく表示されません。また「数字.」の後にはスペースが必要です</strong></li>
</ol>
</ul>
<h2 id="blockquotes---引用"><a aria-hidden="true" tabindex="-1" href="#blockquotes---引用"><span class="icon icon-link"></span></a>Blockquotes - 引用</h2>
<blockquote>
<p>&gt; 文頭に&gt;を置くことで引用になります。</p>
</blockquote>
<blockquote>
<blockquote>
<p>これはネストされた引用です。</p>
</blockquote>
</blockquote>
<h2 id="links---リンク"><a aria-hidden="true" tabindex="-1" href="#links---リンク"><span class="icon icon-link"></span></a>Links - リンク</h2>
<p><a href="http://qiita.com" title="Qiita">Qiita</a></p>
<h2 id="images---画像埋め込み"><a aria-hidden="true" tabindex="-1" href="#images---画像埋め込み"><span class="icon icon-link"></span></a>Images - 画像埋め込み</h2>
<p><img src="https://qiita-image-store.s3.amazonaws.com/0/45617/015bd058-7ea0-e6a5-b9cb-36a4fb38e59c.png" alt="Qiita" title="Qiita"></p>
<h2 id="テーブル記法"><a aria-hidden="true" tabindex="-1" href="#テーブル記法"><span class="icon icon-link"></span></a>テーブル記法</h2>
<table>
<thead>
<tr>
<th align="left">Left align</th>
<th align="right">Right align</th>
<th align="center">Center align</th>
</tr>
</thead>
<tbody>
<tr>
<td align="left">This</td>
<td align="right">This</td>
<td align="center">This</td>
</tr>
<tr>
<td align="left">column</td>
<td align="right">column</td>
<td align="center">column</td>
</tr>
<tr>
<td align="left">will</td>
<td align="right">will</td>
<td align="center">will</td>
</tr>
<tr>
<td align="left">be</td>
<td align="right">be</td>
<td align="center">be</td>
</tr>
<tr>
<td align="left">left</td>
<td align="right">right</td>
<td align="center">center</td>
</tr>
<tr>
<td align="left">aligned</td>
<td align="right">aligned</td>
<td align="center">aligned</td>
</tr>
</tbody>
</table>
<h2 id="注釈"><a aria-hidden="true" tabindex="-1" href="#注釈"><span class="icon icon-link"></span></a>注釈</h2>
<p>本文中に<code>[^1]</code>や<code>[^example]</code>のように文字列を記述することで、脚注へのリンクを表現できます。注釈内容は、同じく本文中に <code>[^1]: ...</code> というように記述します<sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref="" aria-describedby="footnote-label">1</a></sup>。</p>
<section data-footnotes="" class="footnotes"><h2 class="sr-only" id="footnote-label"><a aria-hidden="true" tabindex="-1" href="#footnote-label"><span class="icon icon-link"></span></a>Footnotes</h2>
<ol>
<li id="user-content-fn-1">
<p>注釈内容を記述する位置は、本文の途中でも末尾でも構いません。 <a href="#user-content-fnref-1" data-footnote-backref="" class="data-footnote-backref" aria-label="Back to content">↩</a></p>
</li>
</ol>
</section>
    \`,
    tags: [{
      name: "tag1",
      slug: "tag1"
    }, {
      name: "tag2",
      slug: "tag2"
    }, {
      name: "tag3",
      slug: "tag3"
    }],
    createdAt: new Date().toISOString()
  }
}`,...(Tu=(Lu=au.parameters)==null?void 0:Lu.docs)==null?void 0:Tu.source}}};const zt=["Default","Preview"];export{eu as Default,au as Preview,zt as __namedExportsOrder,It as default};
