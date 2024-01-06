import{T as f}from"./Tag-fWfLP2PJ.js";import{S as B,i as T,s as x,e as p,f as _,m as $,t as y,d as h,h as b}from"./index-kcN0G2eY.js";import{t as v,f as w,i as W,d as S}from"./lifecycle-uKOzxLRu.js";import{B as C}from"./Badge-rRixflwA.js";function D(r){let t;return{c(){t=v("3")},l(a){t=w(a,"3")},m(a,e){W(a,t,e)},d(a){a&&S(t)}}}function V(r){let t,a;return t=new C({props:{$$slots:{default:[D]},$$scope:{ctx:r}}}),{c(){p(t.$$.fragment)},l(e){_(t.$$.fragment,e)},m(e,n){$(t,e,n),a=!0},p(e,n){const s={};n&4&&(s.$$scope={dirty:n,ctx:e}),t.$set(s)},i(e){a||(y(t.$$.fragment,e),a=!0)},o(e){h(t.$$.fragment,e),a=!1},d(e){b(t,e)}}}function q(r){let t,a;return t=new f({props:{name:r[0],slug:r[1],$$slots:{default:[V]},$$scope:{ctx:r}}}),{c(){p(t.$$.fragment)},l(e){_(t.$$.fragment,e)},m(e,n){$(t,e,n),a=!0},p(e,[n]){const s={};n&1&&(s.name=e[0]),n&2&&(s.slug=e[1]),n&4&&(s.$$scope={dirty:n,ctx:e}),t.$set(s)},i(e){a||(y(t.$$.fragment,e),a=!0)},o(e){h(t.$$.fragment,e),a=!1},d(e){b(t,e)}}}function E(r,t,a){let{name:e=""}=t,{slug:n=""}=t;return r.$$set=s=>{"name"in s&&a(0,e=s.name),"slug"in s&&a(1,n=s.slug)},[e,n]}class k extends B{constructor(t){super(),T(this,t,E,q,x,{name:0,slug:1})}}k.__docgen={version:3,name:"TagWithBadge.svelte",data:[{visibility:"public",description:null,keywords:[],name:"name",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"string",type:"string"},defaultValue:""},{visibility:"public",description:null,keywords:[],name:"slug",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"string",type:"string"},defaultValue:""}],computed:[],methods:[],components:[],description:null,keywords:[],events:[],slots:[],refs:[]};const F={title:"Tag",component:f,tags:["autodocs"],argTypes:{name:{control:{type:"text"},describe:"タグ名"},slug:{control:{type:"text"},describe:"スラッグ"}}},o={args:{name:"tag",slug:"tag"}},i={render:r=>({Component:k,props:r}),args:{name:"tag",slug:"tag"}};var l,c,g;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    name: "tag",
    slug: "tag"
  }
}`,...(g=(c=o.parameters)==null?void 0:c.docs)==null?void 0:g.source}}};var m,u,d;i.parameters={...i.parameters,docs:{...(m=i.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: args => ({
    Component: TagWithBadge,
    props: args
  }),
  args: {
    name: "tag",
    slug: "tag"
  }
}`,...(d=(u=i.parameters)==null?void 0:u.docs)==null?void 0:d.source}}};const G=["Default","WithBadge"];export{o as Default,i as WithBadge,G as __namedExportsOrder,F as default};
