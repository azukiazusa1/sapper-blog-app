import{S as $,i as aa,s as ta,u as b,B as G,E as T,j as J,v,w as _,C as K,d as m,F as D,k as N,x as u,a as j,G as p,m as U,D as ia,H as ea,c as la,b as S,t as A,p as W,q as sa,e as O,l as na,n as ca,g as oa,I as ra}from"./index-7100be2d.js";import{T as ha}from"./Tag-1baca220.js";import{T as da}from"./Time-81bf092e.js";function M(r,i,t){const e=r.slice();return e[5]=i[t],e}function Z(r,i){let t,e,o;const k=[i[5]];let d={};for(let a=0;a<k.length;a+=1)d=sa(d,k[a]);return e=new ha({props:d}),{key:r,first:null,c(){t=O(),J(e.$$.fragment),this.h()},l(a){t=O(),N(e.$$.fragment,a),this.h()},h(){this.first=t},m(a,c){j(a,t,c),U(e,a,c),o=!0},p(a,c){i=a;const w=c&4?na(k,[ca(i[5])]):{};e.$set(w)},i(a){o||(S(e.$$.fragment,a),o=!0)},o(a){A(e.$$.fragment,a),o=!1},d(a){a&&m(t),W(e,a)}}}function P(r){let i,t;return{c(){i=b("p"),t=G("これは下書き記事のプレビューです。内容は不正確な恐れがあります。"),this.h()},l(e){i=v(e,"P",{class:!0});var o=_(i);t=K(o,"これは下書き記事のプレビューです。内容は不正確な恐れがあります。"),o.forEach(m),this.h()},h(){u(i,"class","hint error my-4")},m(e,o){j(e,i,o),p(i,t)},d(e){e&&m(i)}}}function pa(r){let i,t,e,o,k,d,a=[],c=new Map,w,x,g,Q,q,f,y,H=r[2];const E=l=>l[5].slug;for(let l=0;l<H.length;l+=1){let s=M(r,H,l),n=E(s);c.set(n,a[l]=Z(n,s))}g=new da({props:{date:r[3]}});let h=r[4]&&P();return{c(){i=b("article"),t=b("div"),e=b("h1"),o=G(r[0]),k=T(),d=b("div");for(let l=0;l<a.length;l+=1)a[l].c();w=T(),x=b("p"),J(g.$$.fragment),Q=T(),h&&h.c(),q=T(),f=b("p"),this.h()},l(l){i=v(l,"ARTICLE",{class:!0});var s=_(i);t=v(s,"DIV",{class:!0});var n=_(t);e=v(n,"H1",{class:!0});var F=_(e);o=K(F,r[0]),F.forEach(m),k=D(n),d=v(n,"DIV",{class:!0});var I=_(d);for(let L=0;L<a.length;L+=1)a[L].l(I);I.forEach(m),w=D(n),x=v(n,"P",{class:!0});var B=_(x);N(g.$$.fragment,B),B.forEach(m),Q=D(n),h&&h.l(n),q=D(n),f=v(n,"P",{id:!0,class:!0});var Y=_(f);Y.forEach(m),n.forEach(m),s.forEach(m),this.h()},h(){u(e,"class","text-2xl md:text-4xl font-bold mb-8"),u(d,"class","flex flex-wrap items-center leading-none mt-2 mb-2"),u(x,"class","my-2"),u(f,"id","contents"),u(f,"class","mt-6"),u(t,"class","px-0 md:px-8"),u(i,"class","bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg max-w-5xl mx-auto")},m(l,s){j(l,i,s),p(i,t),p(t,e),p(e,o),p(t,k),p(t,d);for(let n=0;n<a.length;n+=1)a[n].m(d,null);p(t,w),p(t,x),U(g,x,null),p(t,Q),h&&h.m(t,null),p(t,q),p(t,f),f.innerHTML=r[1],y=!0},p(l,[s]){(!y||s&1)&&ia(o,l[0]),s&4&&(H=l[2],oa(),a=ea(a,s,E,1,l,H,c,d,ra,Z,null,M),la());const n={};s&8&&(n.date=l[3]),g.$set(n),l[4]?h||(h=P(),h.c(),h.m(t,q)):h&&(h.d(1),h=null),(!y||s&2)&&(f.innerHTML=l[1])},i(l){if(!y){for(let s=0;s<H.length;s+=1)S(a[s]);S(g.$$.fragment,l),y=!0}},o(l){for(let s=0;s<a.length;s+=1)A(a[s]);A(g.$$.fragment,l),y=!1},d(l){l&&m(i);for(let s=0;s<a.length;s+=1)a[s].d();W(g),h&&h.d()}}}function ka(r,i,t){let{title:e}=i,{contents:o}=i,{tags:k}=i,{createdAt:d}=i,{preview:a=!1}=i;return r.$$set=c=>{"title"in c&&t(0,e=c.title),"contents"in c&&t(1,o=c.contents),"tags"in c&&t(2,k=c.tags),"createdAt"in c&&t(3,d=c.createdAt),"preview"in c&&t(4,a=c.preview)},[e,o,k,d,a]}class X extends ${constructor(i){super(),aa(this,i,ka,pa,ta,{title:0,contents:1,tags:2,createdAt:3,preview:4})}}X.__docgen={version:3,name:"Card.svelte",data:[{visibility:"public",description:null,keywords:[],name:"title",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"contents",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"tags",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"createdAt",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"preview",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"boolean",type:"boolean"},defaultValue:!1}],computed:[],methods:[],components:[],description:null,keywords:[],events:[],slots:[],refs:[]};const ua={title:"Card",component:X,tags:["autodocs"],argTypes:{title:{control:{type:"text"}},contents:{control:{type:"text"}},tags:{control:{type:"array"}},createdAt:{control:{type:"date"}},preview:{control:{type:"boolean"},describe:"下書き記事のプレビューかどうか"}}},C={args:{title:"Card Title",contents:`
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
    `,tags:[{name:"tag1",slug:"tag1"},{name:"tag2",slug:"tag2"},{name:"tag3",slug:"tag3"}],createdAt:new Date().toISOString()}},z={args:{title:"Card Title",contents:`
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
    `,tags:[{name:"tag1",slug:"tag1"},{name:"tag2",slug:"tag2"},{name:"tag3",slug:"tag3"}],createdAt:new Date().toISOString(),preview:!0}};var R;C.parameters={...C.parameters,storySource:{source:`{
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
}`,...(R=C.parameters)==null?void 0:R.storySource}};var V;z.parameters={...z.parameters,storySource:{source:`{
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
    createdAt: new Date().toISOString(),
    preview: true
  }
}`,...(V=z.parameters)==null?void 0:V.storySource}};const ba=["Default","Preview"];export{C as Default,z as Preview,ba as __namedExportsOrder,ua as default};
//# sourceMappingURL=Card.stories-0a41e330.js.map
