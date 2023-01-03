import{S as J,i as K,s as N,u as v,B as U,E as T,j as M,v as _,w as x,C as W,d as g,F as D,k as O,x as f,a as Z,G as d,m as R,D as X,H as Y,c as $,b as L,t as C,p as P,q as aa,e as j,l as ta,n as ea,g as ia,I as la}from"./index-7100be2d.js";import{T as sa}from"./Tag-1baca220.js";import{T as na}from"./Time-fcc3e4ac.js";function I(o,s,e){const l=o.slice();return l[4]=s[e],l}function F(o,s){let e,l,r;const h=[s[4]];let c={};for(let a=0;a<h.length;a+=1)c=aa(c,h[a]);return l=new sa({props:c}),{key:o,first:null,c(){e=j(),M(l.$$.fragment),this.h()},l(a){e=j(),O(l.$$.fragment,a),this.h()},h(){this.first=e},m(a,k){Z(a,e,k),R(l,a,k),r=!0},p(a,k){s=a;const y=k&4?ta(h,[ea(s[4])]):{};l.$set(y)},i(a){r||(L(l.$$.fragment,a),r=!0)},o(a){C(l.$$.fragment,a),r=!1},d(a){a&&g(e),P(l,a)}}}function ca(o){let s,e,l,r,h,c,a=[],k=new Map,y,u,p,H,m,b,w=o[2];const A=t=>t[4].slug;for(let t=0;t<w.length;t+=1){let i=I(o,w,t),n=A(i);k.set(n,a[t]=F(n,i))}return p=new na({props:{date:o[3]}}),{c(){s=v("article"),e=v("div"),l=v("h1"),r=U(o[0]),h=T(),c=v("div");for(let t=0;t<a.length;t+=1)a[t].c();y=T(),u=v("p"),M(p.$$.fragment),H=T(),m=v("p"),this.h()},l(t){s=_(t,"ARTICLE",{class:!0});var i=x(s);e=_(i,"DIV",{class:!0});var n=x(e);l=_(n,"H1",{class:!0});var E=x(l);r=W(E,o[0]),E.forEach(g),h=D(n),c=_(n,"DIV",{class:!0});var z=x(c);for(let q=0;q<a.length;q+=1)a[q].l(z);z.forEach(g),y=D(n),u=_(n,"P",{class:!0});var S=x(u);O(p.$$.fragment,S),S.forEach(g),H=D(n),m=_(n,"P",{id:!0,class:!0});var G=x(m);G.forEach(g),n.forEach(g),i.forEach(g),this.h()},h(){f(l,"class","text-2xl md:text-4xl font-bold mb-8"),f(c,"class","flex flex-wrap items-center leading-none mt-2 mb-2"),f(u,"class","my-2"),f(m,"id","contents"),f(m,"class","mt-6"),f(e,"class","px-0 md:px-8"),f(s,"class","bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg max-w-5xl mx-auto")},m(t,i){Z(t,s,i),d(s,e),d(e,l),d(l,r),d(e,h),d(e,c);for(let n=0;n<a.length;n+=1)a[n].m(c,null);d(e,y),d(e,u),R(p,u,null),d(e,H),d(e,m),m.innerHTML=o[1],b=!0},p(t,[i]){(!b||i&1)&&X(r,t[0]),i&4&&(w=t[2],ia(),a=Y(a,i,A,1,t,w,k,c,la,F,null,I),$());const n={};i&8&&(n.date=t[3]),p.$set(n),(!b||i&2)&&(m.innerHTML=t[1])},i(t){if(!b){for(let i=0;i<w.length;i+=1)L(a[i]);L(p.$$.fragment,t),b=!0}},o(t){for(let i=0;i<a.length;i+=1)C(a[i]);C(p.$$.fragment,t),b=!1},d(t){t&&g(s);for(let i=0;i<a.length;i+=1)a[i].d();P(p)}}}function oa(o,s,e){let{title:l}=s,{contents:r}=s,{tags:h}=s,{createdAt:c}=s;return o.$$set=a=>{"title"in a&&e(0,l=a.title),"contents"in a&&e(1,r=a.contents),"tags"in a&&e(2,h=a.tags),"createdAt"in a&&e(3,c=a.createdAt)},[l,r,h,c]}class V extends J{constructor(s){super(),K(this,s,oa,ca,N,{title:0,contents:1,tags:2,createdAt:3})}}V.__docgen={version:3,name:"Card.svelte",data:[{visibility:"public",description:null,keywords:[],name:"title",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"contents",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"tags",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"createdAt",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}}],computed:[],methods:[],components:[],description:null,keywords:[],events:[],slots:[],refs:[]};const pa={title:"Card",component:V,tags:["autodocs"],argTypes:{title:{control:{type:"text"}},contents:{control:{type:"text"}},tags:{control:{type:"array"}},createdAt:{control:{type:"date"}}}},Q={args:{title:"Card Title",contents:`
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
    `,tags:[{name:"tag1",slug:"tag1"},{name:"tag2",slug:"tag2"},{name:"tag3",slug:"tag3"}],createdAt:new Date().toISOString()}};var B;Q.parameters={...Q.parameters,storySource:{source:`{
  args: {
    title: 'Card Title',
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
      name: 'tag1',
      slug: 'tag1'
    }, {
      name: 'tag2',
      slug: 'tag2'
    }, {
      name: 'tag3',
      slug: 'tag3'
    }],
    createdAt: new Date().toISOString()
  }
}`,...(B=Q.parameters)==null?void 0:B.storySource}};const ma=["Default"];export{Q as Default,ma as __namedExportsOrder,pa as default};
//# sourceMappingURL=Card.stories-3ecce8e9.js.map
