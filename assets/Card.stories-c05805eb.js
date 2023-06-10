import{S as ma,i as fa,s as ua,u as w,j as V,E as Q,B as G,v as H,w as q,k as J,F as L,C as K,d as b,x as T,I as y,a as W,G as p,m as N,D as ea,J as ba,c as va,b as B,t as O,p as U,q as _a,e as ia,l as xa,n as ya,g as wa,K as Ha}from"./index-5a36c319.js";import{T as qa}from"./Tag-ca66ef43.js";import{T as Ta}from"./Time-bd719f21.js";import{I as Da}from"./Image-33fb94f0.js";function la(c,i,a){const l=c.slice();return l[8]=i[a],l}function sa(c,i){let a,l,r;const h=[i[8]];let m={};for(let n=0;n<h.length;n+=1)m=_a(m,h[n]);return l=new qa({props:m}),{key:c,first:null,c(){a=ia(),V(l.$$.fragment),this.h()},l(n){a=ia(),J(l.$$.fragment,n),this.h()},h(){this.first=a},m(n,f){W(n,a,f),N(l,n,f),r=!0},p(n,f){i=n;const g=f&8?xa(h,[ya(i[8])]):{};l.$set(g)},i(n){r||(B(l.$$.fragment,n),r=!0)},o(n){O(l.$$.fragment,n),r=!1},d(n){n&&b(a),U(l,n)}}}function na(c){let i,a;return{c(){i=w("p"),a=G("これは下書き記事のプレビューです。内容は不正確な恐れがあります。"),this.h()},l(l){i=H(l,"P",{class:!0});var r=q(i);a=K(r,"これは下書き記事のプレビューです。内容は不正確な恐れがあります。"),r.forEach(b),this.h()},h(){T(i,"class","hint error my-4")},m(l,r){W(l,i,r),p(i,a)},d(l){l&&b(i)}}}function Qa(c){let i,a,l,r,h,m,n=`h-${c[7]}`,f,g,u,o=`time-${c[7]}`,M,_,S,A=`about-${c[7]}`,Z,v,k=[],X=new Map,E=`tag-${c[7]}`,P,j,x,D;l=new Da({props:{src:c[6].url,alt:c[6].title,width:480,height:270,slug:c[7]}}),u=new Ta({props:{date:c[4]}});let C=c[3];const Y=t=>t[8].slug;for(let t=0;t<C.length;t+=1){let e=la(c,C,t),s=Y(e);X.set(s,k[t]=sa(s,e))}let d=c[5]&&na();return{c(){i=w("article"),a=w("div"),V(l.$$.fragment),r=Q(),h=w("h1"),m=G(c[0]),f=Q(),g=w("p"),V(u.$$.fragment),M=Q(),_=w("p"),S=G(c[1]),Z=Q(),v=w("div");for(let t=0;t<k.length;t+=1)k[t].c();P=Q(),d&&d.c(),j=Q(),x=w("p"),this.h()},l(t){i=H(t,"ARTICLE",{});var e=q(i);a=H(e,"DIV",{class:!0});var s=q(a);J(l.$$.fragment,s),r=L(s),h=H(s,"H1",{class:!0});var z=q(h);m=K(z,c[0]),z.forEach(b),f=L(s),g=H(s,"P",{class:!0});var $=q(g);J(u.$$.fragment,$),$.forEach(b),M=L(s),_=H(s,"P",{class:!0});var aa=q(_);S=K(aa,c[1]),aa.forEach(b),Z=L(s),v=H(s,"DIV",{class:!0});var ta=q(v);for(let R=0;R<k.length;R+=1)k[R].l(ta);ta.forEach(b),P=L(s),d&&d.l(s),j=L(s),x=H(s,"P",{id:!0,class:!0});var ga=q(x);ga.forEach(b),s.forEach(b),e.forEach(b),this.h()},h(){T(h,"class","mt-4 text-2xl font-bold md:text-4xl"),y(h,"--tag",n),T(g,"class","my-2"),y(g,"--tag",o),T(_,"class","break-words text-sm text-black text-opacity-80 dark:text-gray-50 dark:text-opacity-80"),y(_,"--tag",A),T(v,"class","mt-4 flex flex-wrap items-center leading-none"),y(v,"--tag",E),T(x,"id","contents"),T(x,"class","mt-6"),T(a,"class","p-4")},m(t,e){W(t,i,e),p(i,a),N(l,a,null),p(a,r),p(a,h),p(h,m),p(a,f),p(a,g),N(u,g,null),p(a,M),p(a,_),p(_,S),p(a,Z),p(a,v);for(let s=0;s<k.length;s+=1)k[s].m(v,null);p(a,P),d&&d.m(a,null),p(a,j),p(a,x),x.innerHTML=c[2],D=!0},p(t,[e]){const s={};e&64&&(s.src=t[6].url),e&64&&(s.alt=t[6].title),e&128&&(s.slug=t[7]),l.$set(s),(!D||e&1)&&ea(m,t[0]),e&128&&n!==(n=`h-${t[7]}`)&&y(h,"--tag",n);const z={};e&16&&(z.date=t[4]),u.$set(z),e&128&&o!==(o=`time-${t[7]}`)&&y(g,"--tag",o),(!D||e&2)&&ea(S,t[1]),e&128&&A!==(A=`about-${t[7]}`)&&y(_,"--tag",A),e&8&&(C=t[3],wa(),k=ba(k,e,Y,1,t,C,X,v,Ha,sa,null,la),va()),e&128&&E!==(E=`tag-${t[7]}`)&&y(v,"--tag",E),t[5]?d||(d=na(),d.c(),d.m(a,j)):d&&(d.d(1),d=null),(!D||e&4)&&(x.innerHTML=t[2])},i(t){if(!D){B(l.$$.fragment,t),B(u.$$.fragment,t);for(let e=0;e<C.length;e+=1)B(k[e]);D=!0}},o(t){O(l.$$.fragment,t),O(u.$$.fragment,t);for(let e=0;e<k.length;e+=1)O(k[e]);D=!1},d(t){t&&b(i),U(l),U(u);for(let e=0;e<k.length;e+=1)k[e].d();d&&d.d()}}}function La(c,i,a){let{title:l}=i,{about:r}=i,{contents:h}=i,{tags:m}=i,{createdAt:n}=i,{preview:f=!1}=i,{thumbnail:g}=i,{slug:u}=i;return c.$$set=o=>{"title"in o&&a(0,l=o.title),"about"in o&&a(1,r=o.about),"contents"in o&&a(2,h=o.contents),"tags"in o&&a(3,m=o.tags),"createdAt"in o&&a(4,n=o.createdAt),"preview"in o&&a(5,f=o.preview),"thumbnail"in o&&a(6,g=o.thumbnail),"slug"in o&&a(7,u=o.slug)},[l,r,h,m,n,f,g,u]}class ka extends ma{constructor(i){super(),fa(this,i,La,Qa,ua,{title:0,about:1,contents:2,tags:3,createdAt:4,preview:5,thumbnail:6,slug:7})}}ka.__docgen={version:3,name:"Card.svelte",data:[{visibility:"public",description:null,keywords:[],name:"title",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"about",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"contents",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"tags",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"createdAt",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"preview",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"boolean",type:"boolean"},defaultValue:!1},{visibility:"public",description:null,keywords:[],name:"thumbnail",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}},{visibility:"public",description:null,keywords:[],name:"slug",kind:"let",static:!1,readonly:!1,type:{kind:"type",text:"any",type:"any"}}],computed:[],methods:[],components:[],description:null,keywords:[],events:[],slots:[],refs:[]};const Ea={title:"Card",component:ka,tags:["autodocs"],argTypes:{title:{control:{type:"text"}},contents:{control:{type:"text"}},tags:{control:{type:"array"}},createdAt:{control:{type:"date"}},preview:{control:{type:"boolean"},describe:"下書き記事のプレビューかどうか"}}},I={args:{title:"Card Title",contents:`
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
    `,tags:[{name:"tag1",slug:"tag1"},{name:"tag2",slug:"tag2"},{name:"tag3",slug:"tag3"}],createdAt:new Date().toISOString()}},F={args:{title:"Card Title",contents:`
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
    `,tags:[{name:"tag1",slug:"tag1"},{name:"tag2",slug:"tag2"},{name:"tag3",slug:"tag3"}],createdAt:new Date().toISOString(),preview:!0}};var ca,oa,ra;I.parameters={...I.parameters,docs:{...(ca=I.parameters)==null?void 0:ca.docs,source:{originalSource:`{
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
}`,...(ra=(oa=I.parameters)==null?void 0:oa.docs)==null?void 0:ra.source}}};var ha,da,pa;F.parameters={...F.parameters,docs:{...(ha=F.parameters)==null?void 0:ha.docs,source:{originalSource:`{
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
    createdAt: new Date().toISOString(),
    preview: true
  }
}`,...(pa=(da=F.parameters)==null?void 0:da.docs)==null?void 0:pa.source}}};const ja=["Default","Preview"];export{I as Default,F as Preview,ja as __namedExportsOrder,Ea as default};
//# sourceMappingURL=Card.stories-c05805eb.js.map
