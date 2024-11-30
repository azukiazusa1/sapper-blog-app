import{s as y,t as _,p as g,i as v,v as k,d as B}from"./lifecycle-DqH0ZNpE.js";import{S as b,i as $,c as h,b as w,m as S,t as L,a as x,d as V}from"./index-D54DD7SF.js";import{L as P}from"./LinkButton-DFkzrf5N.js";function q(n){let t;return{c(){t=_(n[0])},l(a){t=g(a,n[0])},m(a,e){v(a,t,e)},p(a,e){e&1&&k(t,a[0])},d(a){a&&B(t)}}}function C(n){let t,a;return t=new P({props:{href:"#",variant:n[1],$$slots:{default:[q]},$$scope:{ctx:n}}}),{c(){h(t.$$.fragment)},l(e){w(t.$$.fragment,e)},m(e,s){S(t,e,s),a=!0},p(e,[s]){const r={};s&2&&(r.variant=e[1]),s&5&&(r.$$scope={dirty:s,ctx:e}),t.$set(r)},i(e){a||(L(t.$$.fragment,e),a=!0)},o(e){x(t.$$.fragment,e),a=!1},d(e){V(t,e)}}}function E(n,t,a){let{slot:e}=t,{variant:s="secondary"}=t;return n.$$set=r=>{"slot"in r&&a(0,e=r.slot),"variant"in r&&a(1,s=r.variant)},[e,s]}class f extends b{constructor(t){super(),$(this,t,E,C,y,{slot:0,variant:1})}}f.__docgen={version:3,name:"LinkButtonView.svelte",data:[{visibility:"public",description:null,keywords:[],name:"slot",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"variant",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"string",type:"string"},defaultValue:"secondary"}],computed:[],methods:[],components:[],description:null,keywords:[],events:[],slots:[],refs:[]};const z={title:"LinkButton",component:f,tags:["autodocs"],argTypes:{}},o={args:{variant:"primary",slot:"もっと見る"}},i={args:{variant:"secondary",slot:"もっと見る"}};var c,l,u;o.parameters={...o.parameters,docs:{...(c=o.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    variant: "primary",
    slot: "もっと見る"
  }
}`,...(u=(l=o.parameters)==null?void 0:l.docs)==null?void 0:u.source}}};var m,d,p;i.parameters={...i.parameters,docs:{...(m=i.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    variant: "secondary",
    slot: "もっと見る"
  }
}`,...(p=(d=i.parameters)==null?void 0:d.docs)==null?void 0:p.source}}};const A=["Primary","Secondary"];export{o as Primary,i as Secondary,A as __namedExportsOrder,z as default};
