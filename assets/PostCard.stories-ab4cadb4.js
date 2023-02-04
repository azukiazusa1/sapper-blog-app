import{S as F,i as G,s as M,u as b,v as k,K as L,x as d,a as I,J as N,d as h,j as H,E as T,B as $,w as v,k as O,F as C,C as x,G as _,m as R,D as ee,b as z,t as S,c as te,p as q,g as le,H as ie,I as re,e as Q,r as oe,y as ue,z as ce,A as de}from"./index-7100be2d.js";import{T as fe}from"./Tag-1baca220.js";import{T as me}from"./Time-81bf092e.js";function ge(a){let e,s,r,n,t;return{c(){e=b("img"),this.h()},l(l){e=k(l,"IMG",{src:!0,alt:!0,srcset:!0,sizes:!0,loading:!0,decoding:!0,height:!0,width:!0,class:!0}),this.h()},h(){L(e.src,s=a[0])||d(e,"src",s),d(e,"alt",a[1]),d(e,"srcset",r=`${a[0]}&w=100 100w,
    ${a[0]}&w=200 200w,
    ${a[0]}&w=300 300w,
    ${a[0]}&w=400 400w,
    ${a[0]}&w=500 500w,
    ${a[0]}&w=600 600w,
    ${a[0]}&w=700 700w,
    ${a[0]}&w=800 800w,
    ${a[0]}&w=900 900w,
    ${a[0]}&w=1000 1000w,
    ${a[0]}&w=1100 1100w,
    ${a[0]}&w=1200 1200w`),d(e,"sizes","(max-width: 600px) 100vw, 600px"),d(e,"loading",n=a[4]?"lazy":"eager"),d(e,"decoding",t=a[4]?"async":"auto"),d(e,"height",a[2]),d(e,"width",a[3]),d(e,"class","svelte-14vipx3")},m(l,u){I(l,e,u)},p(l,[u]){u&1&&!L(e.src,s=l[0])&&d(e,"src",s),u&2&&d(e,"alt",l[1]),u&1&&r!==(r=`${l[0]}&w=100 100w,
    ${l[0]}&w=200 200w,
    ${l[0]}&w=300 300w,
    ${l[0]}&w=400 400w,
    ${l[0]}&w=500 500w,
    ${l[0]}&w=600 600w,
    ${l[0]}&w=700 700w,
    ${l[0]}&w=800 800w,
    ${l[0]}&w=900 900w,
    ${l[0]}&w=1000 1000w,
    ${l[0]}&w=1100 1100w,
    ${l[0]}&w=1200 1200w`)&&d(e,"srcset",r),u&16&&n!==(n=l[4]?"lazy":"eager")&&d(e,"loading",n),u&16&&t!==(t=l[4]?"async":"auto")&&d(e,"decoding",t),u&4&&d(e,"height",l[2]),u&8&&d(e,"width",l[3])},i:N,o:N,d(l){l&&h(e)}}}function ye(a,e,s){let{src:r}=e,{alt:n}=e,{width:t}=e,{height:l}=e,{lazy:u=!0}=e;return a.$$set=c=>{"src"in c&&s(0,r=c.src),"alt"in c&&s(1,n=c.alt),"width"in c&&s(2,t=c.width),"height"in c&&s(3,l=c.height),"lazy"in c&&s(4,u=c.lazy)},[r,n,t,l,u]}class ae extends F{constructor(e){super(),G(this,e,ye,ge,M,{src:0,alt:1,width:2,height:3,lazy:4})}}ae.__docgen={version:3,name:"Image.svelte",data:[{visibility:"public",description:null,keywords:[],name:"src",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"alt",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"width",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"height",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"lazy",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"boolean",type:"boolean"},defaultValue:!0}],computed:[],methods:[],components:[],description:null,keywords:[],events:[],slots:[],refs:[]};function U(a,e,s){const r=a.slice();return r[8]=e[s],r}function W(a){let e,s,r,n,t=[],l=new Map,u,c=a[5];const w=o=>o[8].slug;for(let o=0;o<c.length;o+=1){let i=U(a,c,o),y=w(i);l.set(y,t[o]=X(y,i))}return{c(){e=b("p"),s=$(a[2]),r=T(),n=b("footer");for(let o=0;o<t.length;o+=1)t[o].c();this.h()},l(o){e=k(o,"P",{class:!0});var i=v(e);s=x(i,a[2]),i.forEach(h),r=C(o),n=k(o,"FOOTER",{class:!0});var y=v(n);for(let p=0;p<t.length;p+=1)t[p].l(y);y.forEach(h),this.h()},h(){d(e,"class","mx-4 break-words text-sm text-opacity-80 text-black dark:text-gray-50 dark:text-opacity-80"),d(n,"class","flex flex-wrap items-center leading-none mt-2 p-2 md:p-4")},m(o,i){I(o,e,i),_(e,s),I(o,r,i),I(o,n,i);for(let y=0;y<t.length;y+=1)t[y].m(n,null);u=!0},p(o,i){(!u||i&4)&&ee(s,o[2]),i&32&&(c=o[5],le(),t=ie(t,i,w,1,o,c,l,n,re,X,null,U),te())},i(o){if(!u){for(let i=0;i<c.length;i+=1)z(t[i]);u=!0}},o(o){for(let i=0;i<t.length;i+=1)S(t[i]);u=!1},d(o){o&&h(e),o&&h(r),o&&h(n);for(let i=0;i<t.length;i+=1)t[i].d()}}}function X(a,e){let s,r,n;return r=new fe({props:{name:e[8].name,slug:e[8].slug}}),{key:a,first:null,c(){s=Q(),H(r.$$.fragment),this.h()},l(t){s=Q(),O(r.$$.fragment,t),this.h()},h(){this.first=s},m(t,l){I(t,s,l),R(r,t,l),n=!0},p(t,l){e=t;const u={};l&32&&(u.name=e[8].name),l&32&&(u.slug=e[8].slug),r.$set(u)},i(t){n||(z(r.$$.fragment,t),n=!0)},o(t){S(r.$$.fragment,t),n=!1},d(t){t&&h(s),q(r,t)}}}function he(a){let e,s,r,n,t,l,u,c,w,o,i,y,p,P,A;r=new ae({props:{alt:a[3].title,src:a[3].url,width:400,height:300,lazy:a[7]}}),p=new me({props:{date:a[4]}});let m=!a[6]&&W(a);return{c(){e=b("article"),s=b("a"),H(r.$$.fragment),t=T(),l=b("header"),u=b("h1"),c=b("a"),w=$(a[0]),i=T(),y=b("p"),H(p.$$.fragment),P=T(),m&&m.c(),this.h()},l(f){e=k(f,"ARTICLE",{class:!0});var g=v(e);s=k(g,"A",{href:!0});var E=v(s);O(r.$$.fragment,E),E.forEach(h),t=C(g),l=k(g,"HEADER",{class:!0});var D=v(l);u=k(D,"H1",{class:!0});var B=v(u);c=k(B,"A",{class:!0,href:!0});var J=v(c);w=x(J,a[0]),J.forEach(h),B.forEach(h),i=C(D),y=k(D,"P",{class:!0});var K=v(y);O(p.$$.fragment,K),K.forEach(h),D.forEach(h),P=C(g),m&&m.l(g),g.forEach(h),this.h()},h(){d(s,"href",n=`/blog/${a[1]}`),d(c,"class","no-underline hover:underline"),d(c,"href",o=`/blog/${a[1]}`),d(u,"class","text-2xl"),d(y,"class","mt-2"),d(l,"class","flex-row items-center justify-between leading-tight p-4 border-t border-gray-300 dark:border-gray-600"),d(e,"class","overflow-hidden h-full bg-white dark:bg-gray-700 rounded-lg shadow-lg border dark:border-gray-600")},m(f,g){I(f,e,g),_(e,s),R(r,s,null),_(e,t),_(e,l),_(l,u),_(u,c),_(c,w),_(l,i),_(l,y),R(p,y,null),_(e,P),m&&m.m(e,null),A=!0},p(f,[g]){const E={};g&8&&(E.alt=f[3].title),g&8&&(E.src=f[3].url),g&128&&(E.lazy=f[7]),r.$set(E),(!A||g&2&&n!==(n=`/blog/${f[1]}`))&&d(s,"href",n),(!A||g&1)&&ee(w,f[0]),(!A||g&2&&o!==(o=`/blog/${f[1]}`))&&d(c,"href",o);const D={};g&16&&(D.date=f[4]),p.$set(D),f[6]?m&&(le(),S(m,1,1,()=>{m=null}),te()):m?(m.p(f,g),g&64&&z(m,1)):(m=W(f),m.c(),z(m,1),m.m(e,null))},i(f){A||(z(r.$$.fragment,f),z(p.$$.fragment,f),z(m),A=!0)},o(f){S(r.$$.fragment,f),S(p.$$.fragment,f),S(m),A=!1},d(f){f&&h(e),q(r),q(p),m&&m.d()}}}function pe(a,e,s){let{title:r}=e,{slug:n}=e,{about:t}=e,{thumbnail:l}=e,{createdAt:u}=e,{tags:c}=e,{small:w=!1}=e,{lazy:o=!0}=e;return a.$$set=i=>{"title"in i&&s(0,r=i.title),"slug"in i&&s(1,n=i.slug),"about"in i&&s(2,t=i.about),"thumbnail"in i&&s(3,l=i.thumbnail),"createdAt"in i&&s(4,u=i.createdAt),"tags"in i&&s(5,c=i.tags),"small"in i&&s(6,w=i.small),"lazy"in i&&s(7,o=i.lazy)},[r,n,t,l,u,c,w,o]}class se extends F{constructor(e){super(),G(this,e,pe,he,M,{title:0,slug:1,about:2,thumbnail:3,createdAt:4,tags:5,small:6,lazy:7})}}se.__docgen={version:3,name:"PostCard.svelte",data:[{visibility:"public",description:null,keywords:[],name:"title",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"slug",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"about",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"thumbnail",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"createdAt",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"tags",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"small",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"boolean",type:"boolean"},defaultValue:!1},{visibility:"public",description:null,keywords:[],name:"lazy",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"boolean",type:"boolean"},defaultValue:!0}],computed:[],methods:[],components:[],description:null,keywords:[],events:[],slots:[],refs:[]};function we(a){let e,s;const r=a[1].default,n=oe(r,a,a[0],null);return{c(){e=b("div"),n&&n.c(),this.h()},l(t){e=k(t,"DIV",{class:!0});var l=v(e);n&&n.l(l),l.forEach(h),this.h()},h(){d(e,"class","mt-1 mb-4 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3")},m(t,l){I(t,e,l),n&&n.m(e,null),s=!0},p(t,[l]){n&&n.p&&(!s||l&1)&&ue(n,r,t,t[0],s?de(r,t[0],l,null):ce(t[0]),null)},i(t){s||(z(n,t),s=!0)},o(t){S(n,t),s=!1},d(t){t&&h(e),n&&n.d(t)}}}function _e(a,e,s){let{$$slots:r={},$$scope:n}=e;return a.$$set=t=>{"$$scope"in t&&s(0,n=t.$$scope)},[n,r]}class ne extends F{constructor(e){super(),G(this,e,_e,we,M,{})}}ne.__docgen={version:3,name:"Decorator.svelte",data:[],computed:[],methods:[],components:[],description:null,keywords:[],events:[],slots:[{keywords:[],visibility:"public",description:"",name:"default"}],refs:[]};const ze={title:"PostCard",component:se,tags:["autodocs"],argTypes:{title:{control:{type:"text"},description:"タイトル"},slug:{control:{type:"text"},description:"スラッグ"},about:{control:{type:"text"},description:"概要"},createdAt:{control:{type:"date"},description:"作成日"},tags:{control:{type:"array"},description:"タグ"},thumbnail:{control:{type:"object"},description:"サムネイル"},small:{control:{type:"boolean"},description:"フッターを表示するか",default:!1},lazy:{control:{type:"boolean"},description:"画像を遅延読み込みするか",default:!0}},decorators:[()=>ne]},V={args:{title:"title",slug:"slug",about:"about",createdAt:new Date,tags:[{name:"tag1",slug:"tag1"},{name:"tag2",slug:"tag2"}],thumbnail:{url:"https://picsum.photos/200/300",title:"title"}}},j={args:{title:"title",slug:"slug",about:"about",createdAt:new Date,tags:[{name:"tag1",slug:"tag1"},{name:"tag2",slug:"tag2"}],thumbnail:{url:"https://picsum.photos/200/300",title:"title"},small:!0}};var Y;V.parameters={...V.parameters,storySource:{source:`{
  args: {
    title: 'title',
    slug: 'slug',
    about: 'about',
    createdAt: new Date(),
    tags: [{
      name: 'tag1',
      slug: 'tag1'
    }, {
      name: 'tag2',
      slug: 'tag2'
    }],
    thumbnail: {
      url: 'https://picsum.photos/200/300',
      title: 'title'
    }
  }
}`,...(Y=V.parameters)==null?void 0:Y.storySource}};var Z;j.parameters={...j.parameters,storySource:{source:`{
  args: {
    title: 'title',
    slug: 'slug',
    about: 'about',
    createdAt: new Date(),
    tags: [{
      name: 'tag1',
      slug: 'tag1'
    }, {
      name: 'tag2',
      slug: 'tag2'
    }],
    thumbnail: {
      url: 'https://picsum.photos/200/300',
      title: 'title'
    },
    small: true
  }
}`,...(Z=j.parameters)==null?void 0:Z.storySource}};const Ae=["Default","Small"];export{V as Default,j as Small,Ae as __namedExportsOrder,ze as default};
//# sourceMappingURL=PostCard.stories-ab4cadb4.js.map
