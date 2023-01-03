import{T as u}from"./Tag-1baca220.js";import{S as y,i as h,s as b,j as m,k as c,m as p,b as f,t as d,p as _,B as k,C as B,a as T,d as x}from"./index-7100be2d.js";import{B as S}from"./Badge-53d02eeb.js";function v(r){let t;return{c(){t=k("3")},l(a){t=B(a,"3")},m(a,e){T(a,t,e)},d(a){a&&x(t)}}}function w(r){let t,a;return t=new S({props:{$$slots:{default:[v]},$$scope:{ctx:r}}}),{c(){m(t.$$.fragment)},l(e){c(t.$$.fragment,e)},m(e,n){p(t,e,n),a=!0},p(e,n){const s={};n&4&&(s.$$scope={dirty:n,ctx:e}),t.$set(s)},i(e){a||(f(t.$$.fragment,e),a=!0)},o(e){d(t.$$.fragment,e),a=!1},d(e){_(t,e)}}}function W(r){let t,a;return t=new u({props:{name:r[0],slug:r[1],$$slots:{default:[w]},$$scope:{ctx:r}}}),{c(){m(t.$$.fragment)},l(e){c(t.$$.fragment,e)},m(e,n){p(t,e,n),a=!0},p(e,[n]){const s={};n&1&&(s.name=e[0]),n&2&&(s.slug=e[1]),n&4&&(s.$$scope={dirty:n,ctx:e}),t.$set(s)},i(e){a||(f(t.$$.fragment,e),a=!0)},o(e){d(t.$$.fragment,e),a=!1},d(e){_(t,e)}}}function C(r,t,a){let{name:e=""}=t,{slug:n=""}=t;return r.$$set=s=>{"name"in s&&a(0,e=s.name),"slug"in s&&a(1,n=s.slug)},[e,n]}class $ extends y{constructor(t){super(),h(this,t,C,W,b,{name:0,slug:1})}}$.__docgen={version:3,name:"TagWithBadge.svelte",data:[{visibility:"public",description:null,keywords:[],name:"name",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"string",type:"string"},defaultValue:""},{visibility:"public",description:null,keywords:[],name:"slug",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"string",type:"string"},defaultValue:""}],computed:[],methods:[],components:[],description:null,keywords:[],events:[],slots:[],refs:[]};const q={title:"Tag",component:u,tags:["autodocs"],argTypes:{name:{control:{type:"text"},describe:"タグ名"},slug:{control:{type:"text"},describe:"スラッグ"}}},o={args:{name:"tag",slug:"tag"}},l={render:r=>({Component:$,props:r}),args:{name:"tag",slug:"tag"}};var i;o.parameters={...o.parameters,storySource:{source:`{
  args: {
    name: 'tag',
    slug: 'tag'
  }
}`,...(i=o.parameters)==null?void 0:i.storySource}};var g;l.parameters={...l.parameters,storySource:{source:`{
  render: args => ({
    Component: TagWithBadge,
    props: args
  }),
  args: {
    name: 'tag',
    slug: 'tag'
  }
}`,...(g=l.parameters)==null?void 0:g.storySource}};const E=["Default","WithBadge"];export{o as Default,l as WithBadge,E as __namedExportsOrder,q as default};
//# sourceMappingURL=Tag.stories-7221bf64.js.map
