import{H as bu,s as Lu,o as w,q as H,i as $,d as m,I as Ou,f as Vu,F as Qu,e as v,c as _,g as B,J as Eu,K as Zu,L as Nu,u as Ru,h as Pu,j as Uu,r as Ju,t as du,p as hu,a as p,m as k,v as pu,M as Ku,N as Gu,z as Wu,O as Xu,C as Z,w as ru,D as Au,k as au,l as iu,n as Iu}from"./lifecycle-D2dAEIN_.js";import{S as zu,i as Su,c as S,b as j,m as M,t as y,a as x,d as O,e as Yu,g as ut}from"./index-CNIsqJ_B.js";import{e as vu,u as tt,o as et}from"./each-BWKBrYVq.js";import{g as ju,a as at}from"./spread-CgU5AtxT.js";import{T as it}from"./Tag-6iNGuTkv.js";import{T as nt}from"./Time-7Y_HPOpj.js";import{I as lt}from"./Image-C8g5O75I.js";import{T as st,a as ct,b as ot,c as rt}from"./tooltip-arrow-CTOauHUK.js";const dt=typeof window<"u"?window:typeof globalThis<"u"?globalThis:global;function ht(s){const u=s-1;return u*u*u+1}function pt(s,{delay:u=0,duration:a=400,easing:t=ht,x:l=0,y:i=0,opacity:c=0}={}){const e=getComputedStyle(s),r=+e.opacity,f=e.transform==="none"?"":e.transform,n=r*(1-c),[g,T]=bu(l),[C,h]=bu(i);return{delay:u,duration:a,easing:t,css:(b,q)=>`
			transform: ${f} translate(${(1-b)*g}${T}, ${(1-b)*C}${h});
			opacity: ${r-n*q}`}}function mt(s){let u,a,t,l,i;const c=s[2].default,e=Vu(c,s,s[4],null);let r=[{type:"button"},{class:a=s[1]+" sticky right-8 top-8 hidden rounded-full p-2 hover:bg-gray-100 lg:block dark:hover:bg-zinc-700"},s[5],{"aria-label":s[0]}],f={};for(let n=0;n<r.length;n+=1)f=Qu(f,r[n]);return{c(){u=v("button"),e&&e.c(),this.h()},l(n){u=_(n,"BUTTON",{type:!0,class:!0,"aria-label":!0});var g=B(u);e&&e.l(g),g.forEach(m),this.h()},h(){Eu(u,f)},m(n,g){$(n,u,g),e&&e.m(u,null),u.autofocus&&u.focus(),t=!0,l||(i=[Zu(s[5].action(u)),Nu(u,"click",s[3])],l=!0)},p(n,g){e&&e.p&&(!t||g&16)&&Ru(e,c,n,n[4],t?Uu(c,n[4],g,null):Pu(n[4]),null),Eu(u,f=ju(r,[{type:"button"},(!t||g&2&&a!==(a=n[1]+" sticky right-8 top-8 hidden rounded-full p-2 hover:bg-gray-100 lg:block dark:hover:bg-zinc-700"))&&{class:a},g&32&&n[5],(!t||g&1)&&{"aria-label":n[0]}]))},i(n){t||(y(e,n),t=!0)},o(n){x(e,n),t=!1},d(n){n&&m(u),e&&e.d(n),l=!1,Ju(i)}}}function gt(s){let u,a,t,l,i,c;return a=new rt({props:{class:"rounded-[2px] border-l border-t dark:border-zinc-700"}}),{c(){u=v("div"),S(a.$$.fragment),t=w(),l=v("div"),i=du(s[0]),this.h()},l(e){u=_(e,"DIV",{class:!0});var r=B(u);j(a.$$.fragment,r),r.forEach(m),t=H(e),l=_(e,"DIV",{class:!0});var f=B(l);i=hu(f,s[0]),f.forEach(m),this.h()},h(){p(u,"class","bg-black"),p(l,"class","flex items-center justify-center rounded-lg border bg-black p-3 text-sm text-gray-50 outline-none dark:border-zinc-700")},m(e,r){$(e,u,r),M(a,u,null),$(e,t,r),$(e,l,r),k(l,i),c=!0},p(e,r){(!c||r&1)&&pu(i,e[0])},i(e){c||(y(a.$$.fragment,e),c=!0)},o(e){x(a.$$.fragment,e),c=!1},d(e){e&&(m(u),m(t),m(l)),O(a)}}}function ft(s){let u,a,t,l;return u=new ct({props:{asChild:!0,$$slots:{default:[mt,({builder:i})=>({5:i}),({builder:i})=>i?32:0]},$$scope:{ctx:s}}}),t=new ot({props:{transition:pt,transitionConfig:{y:8,duration:150},sideOffset:4,$$slots:{default:[gt]},$$scope:{ctx:s}}}),{c(){S(u.$$.fragment),a=w(),S(t.$$.fragment)},l(i){j(u.$$.fragment,i),a=H(i),j(t.$$.fragment,i)},m(i,c){M(u,i,c),$(i,a,c),M(t,i,c),l=!0},p(i,c){const e={};c&51&&(e.$$scope={dirty:c,ctx:i}),u.$set(e);const r={};c&17&&(r.$$scope={dirty:c,ctx:i}),t.$set(r)},i(i){l||(y(u.$$.fragment,i),y(t.$$.fragment,i),l=!0)},o(i){x(u.$$.fragment,i),x(t.$$.fragment,i),l=!1},d(i){i&&m(a),O(u,i),O(t,i)}}}function kt(s){let u,a;return u=new st({props:{openDelay:300,$$slots:{default:[ft]},$$scope:{ctx:s}}}),{c(){S(u.$$.fragment)},l(t){j(u.$$.fragment,t)},m(t,l){M(u,t,l),a=!0},p(t,[l]){const i={};l&19&&(i.$$scope={dirty:l,ctx:t}),u.$set(i)},i(t){a||(y(u.$$.fragment,t),a=!0)},o(t){x(u.$$.fragment,t),a=!1},d(t){O(u,t)}}}function Ft(s,u,a){let{$$slots:t={},$$scope:l}=u,{label:i}=u,{className:c=""}=u;function e(r){Ou.call(this,s,r)}return s.$$set=r=>{"label"in r&&a(0,i=r.label),"className"in r&&a(1,c=r.className),"$$scope"in r&&a(4,l=r.$$scope)},[i,c,t,e,l]}class mu extends zu{constructor(u){super(),Su(this,u,Ft,kt,Lu,{label:0,className:1})}}mu.__docgen={version:3,name:"NavButton.svelte",data:[{visibility:"public",description:null,keywords:[],name:"label",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"className",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"string",type:"string"},defaultValue:""}],computed:[],methods:[],components:[],description:null,keywords:[],events:[{keywords:[],visibility:"public",description:"",name:"click",parent:"button",modificators:[],locations:null}],slots:[{keywords:[],visibility:"public",description:"",name:"default"}],refs:[]};const{document:_u}=dt;function Du(s,u,a){const t=s.slice();return t[7]=u[a],t}function yu(s,u){let a,t,l;const i=[u[7]];let c={};for(let e=0;e<i.length;e+=1)c=Qu(c,i[e]);return t=new it({props:c}),{key:s,first:null,c(){a=Au(),S(t.$$.fragment),this.h()},l(e){a=Au(),j(t.$$.fragment,e),this.h()},h(){this.first=a},m(e,r){$(e,a,r),M(t,e,r),l=!0},p(e,r){u=e;const f=r&8?ju(i,[at(u[7])]):{};t.$set(f)},i(e){l||(y(t.$$.fragment,e),l=!0)},o(e){x(t.$$.fragment,e),l=!1},d(e){e&&m(a),O(t,e)}}}function Bt(s){let u,a;return{c(){u=au("svg"),a=au("path"),this.h()},l(t){u=iu(t,"svg",{xmlns:!0,fill:!0,viewBox:!0,"stroke-width":!0,stroke:!0,class:!0});var l=B(u);a=iu(l,"path",{"stroke-linecap":!0,"stroke-linejoin":!0,d:!0}),B(a).forEach(m),l.forEach(m),this.h()},h(){p(a,"stroke-linecap","round"),p(a,"stroke-linejoin","round"),p(a,"d","M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"),p(u,"xmlns","http://www.w3.org/2000/svg"),p(u,"fill","none"),p(u,"viewBox","0 0 24 24"),p(u,"stroke-width","1.5"),p(u,"stroke","currentColor"),p(u,"class","h-6 w-6")},m(t,l){$(t,u,l),k(u,a)},p:Iu,d(t){t&&m(u)}}}function Ct(s){let u,a;return{c(){u=au("svg"),a=au("path"),this.h()},l(t){u=iu(t,"svg",{xmlns:!0,fill:!0,viewBox:!0,"stroke-width":!0,stroke:!0,class:!0});var l=B(u);a=iu(l,"path",{"stroke-linecap":!0,"stroke-linejoin":!0,d:!0}),B(a).forEach(m),l.forEach(m),this.h()},h(){p(a,"stroke-linecap","round"),p(a,"stroke-linejoin","round"),p(a,"d","M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"),p(u,"xmlns","http://www.w3.org/2000/svg"),p(u,"fill","none"),p(u,"viewBox","0 0 24 24"),p(u,"stroke-width","1.5"),p(u,"stroke","currentColor"),p(u,"class","h-7 w-7")},m(t,l){$(t,u,l),k(u,a)},p:Iu,d(t){t&&m(u)}}}function bt(s){let u,a=`const initialState =
      localStorage.getItem("toc-state") === "close" ? "close" : "open";

    if (initialState === "open") {
      document.documentElement.classList.add("open-toc");
    }`,t,l,i,c,e,r,f,n,g=`h-${s[6]}`,T,C,h,b=`time-${s[6]}`,q,F,G,W=`about-${s[6]}`,nu,L,E=[],gu=new Map,X=`tag-${s[6]}`,lu,V,N,U,su,Q,I,cu,z,R;e=new lt({props:{src:s[5].url,alt:s[5].title,width:480,height:270,slug:s[6],main:!0}}),h=new nt({props:{date:s[4]}});let J=vu(s[3]);const fu=o=>o[7].slug;for(let o=0;o<J.length;o+=1){let d=Du(s,J,o),A=fu(d);gu.set(A,E[o]=yu(A,d))}return I=new mu({props:{label:"目次を閉じる",className:"close-toc-button",$$slots:{default:[Bt]},$$scope:{ctx:s}}}),I.$on("click",Et),z=new mu({props:{label:"目次を表示",className:"open-toc-button",$$slots:{default:[Ct]},$$scope:{ctx:s}}}),z.$on("click",At),{c(){u=v("script"),u.textContent=a,t=w(),l=v("article"),i=v("div"),c=v("div"),S(e.$$.fragment),r=w(),f=v("h1"),n=du(s[0]),T=w(),C=v("p"),S(h.$$.fragment),q=w(),F=v("p"),G=du(s[1]),nu=w(),L=v("div");for(let o=0;o<E.length;o+=1)E[o].c();lu=w(),V=v("div"),N=v("div"),U=new Ku(!1),su=w(),Q=v("div"),S(I.$$.fragment),cu=w(),S(z.$$.fragment),this.h()},l(o){const d=Gu("svelte-874l5r",_u.head);u=_(d,"SCRIPT",{"data-svelte-h":!0}),Wu(u)!=="svelte-1tvv9m2"&&(u.textContent=a),d.forEach(m),t=H(o),l=_(o,"ARTICLE",{"data-pagefind-body":!0});var A=B(l);i=_(A,"DIV",{class:!0});var P=B(i);c=_(P,"DIV",{class:!0});var D=B(c);j(e.$$.fragment,D),r=H(D),f=_(D,"H1",{class:!0});var K=B(f);n=hu(K,s[0]),K.forEach(m),T=H(D),C=_(D,"P",{class:!0});var ku=B(C);j(h.$$.fragment,ku),ku.forEach(m),q=H(D),F=_(D,"P",{class:!0});var Fu=B(F);G=hu(Fu,s[1]),Fu.forEach(m),nu=H(D),L=_(D,"DIV",{class:!0});var Bu=B(L);for(let ou=0;ou<E.length;ou+=1)E[ou].l(Bu);Bu.forEach(m),D.forEach(m),lu=H(P),V=_(P,"DIV",{class:!0});var Y=B(V);N=_(Y,"DIV",{id:!0,class:!0});var Cu=B(N);U=Xu(Cu,!1),Cu.forEach(m),su=H(Y),Q=_(Y,"DIV",{id:!0,class:!0});var uu=B(Q);j(I.$$.fragment,uu),cu=H(uu),j(z.$$.fragment,uu),uu.forEach(m),Y.forEach(m),P.forEach(m),A.forEach(m),this.h()},h(){p(f,"class","mt-4 text-2xl font-bold md:text-4xl"),Z(f,"--tag",g),p(C,"class","my-2"),Z(C,"--tag",b),p(F,"class","break-words text-sm text-black text-opacity-80 dark:text-gray-50 dark:text-opacity-80"),Z(F,"--tag",W),p(L,"class","mt-4 flex flex-wrap items-center leading-none"),Z(L,"--tag",X),p(c,"class","mx-auto max-w-3xl"),U.a=null,p(N,"id","contents"),p(N,"class","show-line-number mx-auto mt-20 max-w-5xl"),p(Q,"id","nav-button"),p(Q,"class","absolute right-0 top-0"),p(V,"class","relative mx-auto max-w-5xl"),p(i,"class","p-4"),p(l,"data-pagefind-body","")},m(o,d){k(_u.head,u),$(o,t,d),$(o,l,d),k(l,i),k(i,c),M(e,c,null),k(c,r),k(c,f),k(f,n),k(c,T),k(c,C),M(h,C,null),k(c,q),k(c,F),k(F,G),k(c,nu),k(c,L);for(let A=0;A<E.length;A+=1)E[A]&&E[A].m(L,null);k(i,lu),k(i,V),k(V,N),U.m(s[2],N),k(V,su),k(V,Q),M(I,Q,null),k(Q,cu),M(z,Q,null),R=!0},p(o,[d]){const A={};d&32&&(A.src=o[5].url),d&32&&(A.alt=o[5].title),d&64&&(A.slug=o[6]),e.$set(A),(!R||d&1)&&pu(n,o[0]),d&64&&g!==(g=`h-${o[6]}`)&&Z(f,"--tag",g);const P={};d&16&&(P.date=o[4]),h.$set(P),d&64&&b!==(b=`time-${o[6]}`)&&Z(C,"--tag",b),(!R||d&2)&&pu(G,o[1]),d&64&&W!==(W=`about-${o[6]}`)&&Z(F,"--tag",W),d&8&&(J=vu(o[3]),ut(),E=tt(E,d,fu,1,o,J,gu,L,et,yu,null,Du),Yu()),d&64&&X!==(X=`tag-${o[6]}`)&&Z(L,"--tag",X),(!R||d&4)&&U.p(o[2]);const D={};d&1024&&(D.$$scope={dirty:d,ctx:o}),I.$set(D);const K={};d&1024&&(K.$$scope={dirty:d,ctx:o}),z.$set(K)},i(o){if(!R){y(e.$$.fragment,o),y(h.$$.fragment,o);for(let d=0;d<J.length;d+=1)y(E[d]);y(I.$$.fragment,o),y(z.$$.fragment,o),R=!0}},o(o){x(e.$$.fragment,o),x(h.$$.fragment,o);for(let d=0;d<E.length;d+=1)x(E[d]);x(I.$$.fragment,o),x(z.$$.fragment,o),R=!1},d(o){o&&(m(t),m(l)),m(u),O(e),O(h);for(let d=0;d<E.length;d+=1)E[d].d();O(I),O(z)}}}function Et(){document.documentElement.classList.remove("open-toc"),localStorage.setItem("toc-state","close")}function At(){document.documentElement.classList.add("open-toc"),localStorage.setItem("toc-state","open")}function vt(s,u,a){let{title:t}=u,{about:l}=u,{contents:i}=u,{tags:c}=u,{createdAt:e}=u,{thumbnail:r}=u,{slug:f}=u;return ru(()=>{const n=document.querySelectorAll("pre"),g='<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512" class="w-4 h-4"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M208 0H332.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V336c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48zM48 128h80v64H64V448H256V416h64v48c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48z"/></svg>',T='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>';n.forEach(C=>{const h=document.createElement("button");h.classList.add("absolute","right-2","top-2","rounded-md","text-gray-200","opacity-50","p-2","ring-2","ring-gray-500","ring-opacity-50","text-outline-none","hover:text-gray-500","hover:bg-gray-500","hover:opacity-100","hover:ring-2","hover:ring-gray-500","focus:text-gray-500","focus:ring-2","focus:ring-gray-500","focus:opacity-100"),h.style.backgroundColor="#212121",h.innerHTML=g,h.ariaLabel="コピー";const b=document.createElement("div");b.classList.add("absolute","top-2","right-12","px-2","py-1","rounded-md","bg-gray-100","dark:bg-zinc-500","text-gray-500","dark:text-gray-300","text-sm","transition-opacity","duration-300","opacity-0","pointer-events-none"),b.textContent="Copied!",h.addEventListener("click",()=>{var F;const q=(F=C.querySelector("code"))==null?void 0:F.textContent;navigator.clipboard.writeText(q),h.innerHTML=T,h.classList.remove("text-gray-200"),h.classList.remove("hover:text-gray-500"),h.classList.remove("focus:text-gray-500"),h.classList.add("text-green-500"),b.classList.remove("opacity-0"),setTimeout(()=>{b.classList.add("opacity-0"),h.innerHTML=g,h.classList.remove("text-green-500"),h.classList.add("text-gray-200"),h.classList.add("hover:text-gray-500"),h.classList.add("focus:text-gray-500")},1e3)}),C.insertAdjacentElement("afterend",h),h.insertAdjacentElement("afterend",b)})}),ru(()=>{const n=document.getElementById("contents"),g=n==null?void 0:n.querySelectorAll("h1, h2, h3, h4, h5, h6"),T=document.querySelectorAll(".toc-link"),C=new IntersectionObserver(h=>{h.forEach(b=>{if(b.isIntersecting){const q=b.target.id;T.forEach(F=>{F.getAttribute("href")===`#${q}`?(F.classList.add("text-indigo-600"),F.classList.add("dark:text-indigo-400")):(F.classList.remove("text-indigo-600"),F.classList.remove("dark:text-indigo-400"))})}})},{rootMargin:"-1px 0px -90% 0px"});return g==null||g.forEach(h=>{C.observe(h)}),()=>{C.disconnect()}}),ru(()=>{const n=document.getElementById("nav-button"),g=document.getElementById("contents");n==null||n.setAttribute("style",`height: ${(g==null?void 0:g.clientHeight)-240}px`)}),s.$$set=n=>{"title"in n&&a(0,t=n.title),"about"in n&&a(1,l=n.about),"contents"in n&&a(2,i=n.contents),"tags"in n&&a(3,c=n.tags),"createdAt"in n&&a(4,e=n.createdAt),"thumbnail"in n&&a(5,r=n.thumbnail),"slug"in n&&a(6,f=n.slug)},[t,l,i,c,e,r,f]}class Mu extends zu{constructor(u){super(),Su(this,u,vt,bt,Lu,{title:0,about:1,contents:2,tags:3,createdAt:4,thumbnail:5,slug:6})}}Mu.__docgen={version:3,name:"Card.svelte",data:[{visibility:"public",description:null,keywords:[],name:"title",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"about",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"contents",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"tags",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"createdAt",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"thumbnail",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"slug",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}}],computed:[],methods:[],components:[],description:null,keywords:[],events:[],slots:[],refs:[]};const qt={title:"Card",component:Mu,tags:["autodocs"],argTypes:{title:{control:{type:"text"}},contents:{control:{type:"text"}},tags:{control:{type:"array"}},createdAt:{control:{type:"date"}}}},tu={args:{title:"Card Title",contents:`
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
    `,tags:[{name:"tag1",slug:"tag1"},{name:"tag2",slug:"tag2"},{name:"tag3",slug:"tag3"}],createdAt:new Date().toISOString()}},eu={args:{title:"Card Title",contents:`
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
    `,tags:[{name:"tag1",slug:"tag1"},{name:"tag2",slug:"tag2"},{name:"tag3",slug:"tag3"}],createdAt:new Date().toISOString()}};var xu,wu,Hu;tu.parameters={...tu.parameters,docs:{...(xu=tu.parameters)==null?void 0:xu.docs,source:{originalSource:`{
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
}`,...(Hu=(wu=tu.parameters)==null?void 0:wu.docs)==null?void 0:Hu.source}}};var $u,Tu,qu;eu.parameters={...eu.parameters,docs:{...($u=eu.parameters)==null?void 0:$u.docs,source:{originalSource:`{
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
}`,...(qu=(Tu=eu.parameters)==null?void 0:Tu.docs)==null?void 0:qu.source}}};const Lt=["Default","Preview"];export{tu as Default,eu as Preview,Lt as __namedExportsOrder,qt as default};
