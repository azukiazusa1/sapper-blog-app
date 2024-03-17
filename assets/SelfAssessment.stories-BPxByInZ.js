import"./index-Qsbhl2Kk.js";import{s as U,e as h,t as M,o as b,c as E,g as D,p as $,d as F,q as g,a as x,i as _,m as p,v as H,n as j,G as Y,z}from"./lifecycle-D2dAEIN_.js";import{S as J,i as K,t as w,e as X,a as L,c as uu,b as eu,m as tu,d as au,g as nu}from"./index-CNIsqJ_B.js";import{e as q}from"./each-BWKBrYVq.js";import"./_commonjsHelpers-BosuxZz1.js";import"./index-DrFu-skq.js";function V(d,u,n){const e=d.slice();return e[1]=u[n],e}function lu(d){let u,n=`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>

                もう一度考えてみましょう`;return{c(){u=h("div"),u.innerHTML=n,this.h()},l(e){u=E(e,"DIV",{class:!0,"data-svelte-h":!0}),z(u)!=="svelte-h1qtio"&&(u.innerHTML=n),this.h()},h(){x(u,"class","flex items-center gap-2 text-red-500")},m(e,r){_(e,u,r)},d(e){e&&F(u)}}}function ru(d){let u,n=`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path></svg>

                正解！`;return{c(){u=h("div"),u.innerHTML=n,this.h()},l(e){u=E(e,"DIV",{class:!0,"data-svelte-h":!0}),z(u)!=="svelte-121llcx"&&(u.innerHTML=n),this.h()},h(){x(u,"class","flex items-center gap-1 text-green-500")},m(e,r){_(e,u,r)},d(e){e&&F(u)}}}function P(d){let u,n,e=d[1].text+"",r,C,f,B,o,l,t=d[1].explanation+"",i,a;function c(v,A){return v[1].correct?ru:lu}let s=c(d),m=s(d);return{c(){u=h("details"),n=h("summary"),r=M(e),C=b(),f=h("div"),B=h("p"),m.c(),o=b(),l=h("p"),i=M(t),a=b(),this.h()},l(v){u=E(v,"DETAILS",{class:!0});var A=D(u);n=E(A,"SUMMARY",{class:!0});var S=D(n);r=$(S,e),S.forEach(F),C=g(A),f=E(A,"DIV",{class:!0});var y=D(f);B=E(y,"P",{});var I=D(B);m.l(I),I.forEach(F),o=g(y),l=E(y,"P",{class:!0});var T=D(l);i=$(T,t),T.forEach(F),y.forEach(F),a=g(A),A.forEach(F),this.h()},h(){x(n,"class","cursor-pointer p-4 text-lg hover:bg-gray-100 dark:hover:bg-zinc-700"),x(l,"class","mt-4"),x(f,"class","p-4"),x(u,"class","border border-t-0 border-gray-300 font-medium text-gray-900 dark:border-zinc-600 dark:text-gray-50")},m(v,A){_(v,u,A),p(u,n),p(n,r),p(u,C),p(u,f),p(f,B),m.m(B,null),p(f,o),p(f,l),p(l,i),p(u,a)},p(v,A){A&1&&e!==(e=v[1].text+"")&&H(r,e),s!==(s=c(v))&&(m.d(1),m=s(v),m&&(m.c(),m.m(B,null))),A&1&&t!==(t=v[1].explanation+"")&&H(i,t)},d(v){v&&F(u),m.d()}}}function su(d){let u,n,e=d[0].question+"",r,C,f,B=q(d[0].answers),o=[];for(let l=0;l<B.length;l+=1)o[l]=P(V(d,B,l));return{c(){u=h("div"),n=h("h3"),r=M(e),C=b(),f=h("div");for(let l=0;l<o.length;l+=1)o[l].c();this.h()},l(l){u=E(l,"DIV",{class:!0});var t=D(u);n=E(t,"H3",{class:!0});var i=D(n);r=$(i,e),i.forEach(F),C=g(t),f=E(t,"DIV",{class:!0});var a=D(f);for(let c=0;c<o.length;c+=1)o[c].l(a);a.forEach(F),t.forEach(F),this.h()},h(){x(n,"class","rounded-ss-md bg-gray-200 px-4 py-8 text-lg font-medium dark:bg-zinc-600"),x(f,"class","flex flex-col justify-center"),x(u,"class","flex flex-col justify-center")},m(l,t){_(l,u,t),p(u,n),p(n,r),p(u,C),p(u,f);for(let i=0;i<o.length;i+=1)o[i]&&o[i].m(f,null)},p(l,[t]){if(t&1&&e!==(e=l[0].question+"")&&H(r,e),t&1){B=q(l[0].answers);let i;for(i=0;i<B.length;i+=1){const a=V(l,B,i);o[i]?o[i].p(a,t):(o[i]=P(a),o[i].c(),o[i].m(f,null))}for(;i<o.length;i+=1)o[i].d(1);o.length=B.length}},i:j,o:j,d(l){l&&F(u),Y(o,l)}}}function iu(d,u,n){let{quiz:e}=u;return d.$$set=r=>{"quiz"in r&&n(0,e=r.quiz)},[e]}class N extends J{constructor(u){super(),K(this,u,iu,su,U,{quiz:0})}}N.__docgen={version:3,name:"Question.svelte",data:[{visibility:"public",description:null,keywords:[],name:"quiz",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}}],computed:[],methods:[],components:[],description:null,keywords:[],events:[],slots:[],refs:[]};function Q(d,u,n){const e=d.slice();return e[1]=u[n],e}function Z(d){let u,n;return u=new N({props:{quiz:d[1]}}),{c(){uu(u.$$.fragment)},l(e){eu(u.$$.fragment,e)},m(e,r){tu(u,e,r),n=!0},p(e,r){const C={};r&1&&(C.quiz=e[1]),u.$set(C)},i(e){n||(w(u.$$.fragment,e),n=!0)},o(e){L(u.$$.fragment,e),n=!1},d(e){au(u,e)}}}function ou(d){let u,n=`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6"><path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"></path></svg>

  記事の理解度チェック`,e,r,C="以下の問題に答えて、記事の理解を深めましょう。",f,B,o,l=q(d[0]),t=[];for(let a=0;a<l.length;a+=1)t[a]=Z(Q(d,l,a));const i=a=>L(t[a],1,1,()=>{t[a]=null});return{c(){u=h("h2"),u.innerHTML=n,e=b(),r=h("p"),r.textContent=C,f=b(),B=h("div");for(let a=0;a<t.length;a+=1)t[a].c();this.h()},l(a){u=E(a,"H2",{class:!0,"data-svelte-h":!0}),z(u)!=="svelte-1pwxvxa"&&(u.innerHTML=n),e=g(a),r=E(a,"P",{class:!0,"data-svelte-h":!0}),z(r)!=="svelte-ir3uga"&&(r.textContent=C),f=g(a),B=E(a,"DIV",{class:!0});var c=D(B);for(let s=0;s<t.length;s+=1)t[s].l(c);c.forEach(F),this.h()},h(){x(u,"class","flex items-center gap-2 border-b border-gray-300 dark:border-zinc-700 svelte-12jxbwd"),x(r,"class","mb-8"),x(B,"class","flex flex-col gap-8")},m(a,c){_(a,u,c),_(a,e,c),_(a,r,c),_(a,f,c),_(a,B,c);for(let s=0;s<t.length;s+=1)t[s]&&t[s].m(B,null);o=!0},p(a,[c]){if(c&1){l=q(a[0]);let s;for(s=0;s<l.length;s+=1){const m=Q(a,l,s);t[s]?(t[s].p(m,c),w(t[s],1)):(t[s]=Z(m),t[s].c(),w(t[s],1),t[s].m(B,null))}for(nu(),s=l.length;s<t.length;s+=1)i(s);X()}},i(a){if(!o){for(let c=0;c<l.length;c+=1)w(t[c]);o=!0}},o(a){t=t.filter(Boolean);for(let c=0;c<t.length;c+=1)L(t[c]);o=!1},d(a){a&&(F(u),F(e),F(r),F(f),F(B)),Y(t,a)}}}function cu(d,u,n){let{quizzes:e}=u;return d.$$set=r=>{"quizzes"in r&&n(0,e=r.quizzes)},[e]}class W extends J{constructor(u){super(),K(this,u,cu,ou,U,{quizzes:0})}}W.__docgen={version:3,name:"SelfAssessment.svelte",data:[{visibility:"public",description:null,keywords:[],name:"quizzes",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}}],computed:[],methods:[],components:[],description:null,keywords:[],events:[],slots:[],refs:[]};const hu={title:"SelfAssessment",component:W,tags:["autodocs"]},k={args:{quizzes:[{question:"フォームにアクセシブルな名前つける際に、最も適した方法はどれですか？",answers:[{text:"label 要素を使用する",correct:!0,explanation:"label 要素は、視覚的に表示されるテキストとフォーム部品を関連付けるために使用されます。また、ラベルをクリックした場合にもフォームにフォーカスが移動するため、クリック領域が広がり、運動障害のあるユーザーにも優しいです。"},{text:"aria-label 属性を使用する",correct:!1,explanation:"aria-label 属性は、視覚的に表示されるラベルがない場合に使用します。そのような場合にアクセシブルな名前を提供する有効な手段ですが、視覚的に表示されるテキストに基づいてアクセシブルな名前を提供するのがよりよい方法です。"},{text:"aria-labelledby 属性を使用する",correct:!1,explanation:"aria-labelledby 属性は、他の要素を参照するために使用されます。しかし、視覚的に表示されるラベルと紐づけるのであれば、label 要素を使用するべきです。"},{text:"aria-describedby 属性を使用する",correct:!1,explanation:"aria-describedby 属性は、フォーム部品に関連する補足情報を提供するために使用されます。"}]},{question:"スクリーンリーダーにフォームの検証に失敗していることを伝えるために使われる属性はどれですか？",answers:[{text:"aria-invalid 属性",correct:!0,explanation:"aria-invalid 属性はフォームの検証に失敗していることを伝えるために使用されます。この属性を使用してユーザーにエラーを伝える場合には、適切なエラーメッセージの内容を aria-describedby 属性で提供し、ユーザーがエラーを修正するための手順を提供することが重要です。"},{text:"aria-disabled 属性",correct:!1,explanation:"aria-disabled 属性はフォームが無効であり、編集やその他の操作ができないことを伝えるために使用されます。"},{text:"aria-live 属性",correct:!1,explanation:"aria-live 属性は要素が動的に更新されることをスクリーンリーダーに伝えるために使用されます。"},{text:"aria-readonly 属性",correct:!1,explanation:"aria-readonly 属性は、フォームが読み取り専用であることを伝えるために使用されます。"}]}]}};var G,O,R;k.parameters={...k.parameters,docs:{...(G=k.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    quizzes: [{
      question: "フォームにアクセシブルな名前つける際に、最も適した方法はどれですか？",
      answers: [{
        text: "label 要素を使用する",
        correct: true,
        explanation: "label 要素は、視覚的に表示されるテキストとフォーム部品を関連付けるために使用されます。また、ラベルをクリックした場合にもフォームにフォーカスが移動するため、クリック領域が広がり、運動障害のあるユーザーにも優しいです。"
      }, {
        text: "aria-label 属性を使用する",
        correct: false,
        explanation: "aria-label 属性は、視覚的に表示されるラベルがない場合に使用します。そのような場合にアクセシブルな名前を提供する有効な手段ですが、視覚的に表示されるテキストに基づいてアクセシブルな名前を提供するのがよりよい方法です。"
      }, {
        text: "aria-labelledby 属性を使用する",
        correct: false,
        explanation: "aria-labelledby 属性は、他の要素を参照するために使用されます。しかし、視覚的に表示されるラベルと紐づけるのであれば、label 要素を使用するべきです。"
      }, {
        text: "aria-describedby 属性を使用する",
        correct: false,
        explanation: "aria-describedby 属性は、フォーム部品に関連する補足情報を提供するために使用されます。"
      }]
    }, {
      question: "スクリーンリーダーにフォームの検証に失敗していることを伝えるために使われる属性はどれですか？",
      answers: [{
        text: "aria-invalid 属性",
        correct: true,
        explanation: "aria-invalid 属性はフォームの検証に失敗していることを伝えるために使用されます。この属性を使用してユーザーにエラーを伝える場合には、適切なエラーメッセージの内容を aria-describedby 属性で提供し、ユーザーがエラーを修正するための手順を提供することが重要です。"
      }, {
        text: "aria-disabled 属性",
        correct: false,
        explanation: "aria-disabled 属性はフォームが無効であり、編集やその他の操作ができないことを伝えるために使用されます。"
      }, {
        text: "aria-live 属性",
        correct: false,
        explanation: "aria-live 属性は要素が動的に更新されることをスクリーンリーダーに伝えるために使用されます。"
      }, {
        text: "aria-readonly 属性",
        correct: false,
        explanation: "aria-readonly 属性は、フォームが読み取り専用であることを伝えるために使用されます。"
      }]
    }]
  }
}`,...(R=(O=k.parameters)==null?void 0:O.docs)==null?void 0:R.source}}};const Eu=["Default"];export{k as Default,Eu as __namedExportsOrder,hu as default};
