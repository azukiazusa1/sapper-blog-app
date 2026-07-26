---
id: yWVpTheHT_sTxvxqtpVwD
title: "CSS Grid Lanes で Masonry レイアウトを実装する"
slug: "css-grid-lanes"
about: "CSS Grid Lanes は、高さの異なるアイテムを複数のレーンへ隙間なく配置するレイアウト方式です。`display: grid-lanes` を指定することで、JavaScript を使わずに Masonry レイアウトを実装できます。この記事では `display: grid-lanes` の基本的な使い方を紹介します。"
createdAt: "2026-07-26T15:00+09:00"
updatedAt: "2026-07-26T15:00+09:00"
tags: ["CSS"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4WzPAvYMrOoAD3YYoMaHkW/90695b05f4991bce7942ac7d2ab9a0ab/paris_gaisenmon_6623-768x720.png"
  title: "凱旋門のイラスト"  
audio: null
selfAssessment:
  quizzes:
    - question: "列方向の Masonry レイアウトを Grid Lanes で作るための指定として正しいものはどれですか？"
      answers:
        - text: "`display: grid` と `grid-template-rows: masonry` を指定する"
          correct: false
          explanation: "これは Mozilla と WebKit が支持していた初期案の構文です。現在の記事で紹介している Grid Lanes の基本構文ではありません。"
        - text: "`display: grid-lanes` と `grid-template-columns` を指定する"
          correct: true
          explanation: "記事では、`display: grid-lanes` で Grid Lanes を有効にし、`grid-template-columns` で列の数と幅を定義しています。"
        - text: "`display: masonry` と `grid-template-rows` を指定する"
          correct: false
          explanation: "`display: masonry` は Chrome と Edge が提案した古い試験構文です。また、列方向のレイアウトでは記事は `grid-template-columns` を使用しています。"
        - text: "`display: flex` と `grid-template-columns` を指定する"
          correct: false
          explanation: "`display: flex` は Flexbox を有効にする指定です。Grid Lanes を有効にするには `display: grid-lanes` を使用します。"
    - question: "3 列の Grid Lanes に高さの異なる 6 つのアイテムを配置し、`flow-tolerance: infinite` を指定しました。アイテムはどのように配置されますか？"
      answers:
        - text: "すべてのアイテムが現在最も短い列へ配置される"
          correct: false
          explanation: "`infinite` ではレーンの高さを考慮しないため、最短の列を選択しません。"
        - text: "1〜3番目だけを配置し、4〜6番目は非表示になる"
          correct: false
          explanation: "`infinite` は表示数を制限する値ではありません。すべてのアイテムがレーンへ配置されます。"
        - text: "1列目に1と4、2列目に2と5、3列目に3と6が配置される"
          correct: true
          explanation: "記事の例の通り、`infinite` では高さにかかわらず、アイテムが各レーンへ順番に配置されます。"
        - text: "1列目に1〜2、2列目に3〜4、3列目に5〜6が配置される"
          correct: false
          explanation: "Grid Lanes はアイテムをレーン単位の連続したグループに分割しません。記事の例ではレーンを順番に巡回します。"
published: true
---

!> 2026 年 7 月現在、CSS Grid Lanes を実装しているのは Safari 26.4 以降のみです。仕様は策定中であり、今後構文や動作が変更される可能性があります。

Pinterest の画像ギャラリーのように、高さの異なるアイテムを複数の列へ隙間なく配置するレイアウトは、Masonry（石積み）レイアウトと呼ばれます。

![](https://images.ctfassets.net/in6v9lxmm5c8/6V9MlZauxgRB6jYwavWYvP/056009b93b568de33ae9d11b6eb26f89/image.png)

しかし、このような Masonry レイアウトを実現するのは簡単ではありません。従来の CSS Grid を使ってカードを並べた場合、同じ行にあるアイテムは 1 番背の高いアイテムに合わせて配置されます。そのため、カードの高さが異なるとアイテムの下に空白が残ります。

```html
<div class="grid">
  <article class="card">...</article>
  <article class="card">...</article>
  <article class="card">...</article>
</div>
```

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 15rem), 1fr));
  align-items: start;
  gap: 1rem;
}
```

![](https://images.ctfassets.net/in6v9lxmm5c8/4qtSgI7oNCZKodi39cqBny/b2ff4691719f7f47fbe9309b621a71c4/image.png)

Masonry レイアウトを実現する方法として、これまでは [Masonry](https://masonry.desandro.com/) のような JavaScript ライブラリを利用するか、CSS の Multi-column Layout を使って見た目を再現する方法が一般的でした。

```css
/* Masonry レイアウトを Multi-column Layout で実装する例 */
.gallery {
  columns: 3 15rem;
  column-gap: 1rem;
}

.card {
  break-inside: avoid;
  margin-block-end: 1rem;
}
```

しかし JavaScript でアイテムの位置を計算する方法は実装が複雑になり、リサイズや画像の読み込みに合わせて位置を再計算する必要があります。Multi-column Layout を使う方法では、要素が上から下へ並んでから次の列へ移るため、HTML の順番と視覚的な順番が一致しないという問題があります。

CSS Grid Lanes はこのような課題を解決する、新しい CSS のレイアウト方式です。`display: grid-lanes` を指定することで、JavaScript を使わずに Masonry レイアウトを実装できます。

## CSS Grid Lanes の基本的な使い方

Grid Lanes で列方向の Masonry レイアウトを作成するには、コンテナに `display: grid-lanes` を指定します。列の数と幅は、CSS Grid と同じように `grid-template-columns` で定義します。

```css
.gallery {
  display: grid-lanes;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
```

通常の CSS Grid との違いは、行のトラックが作られないことです。それぞれのアイテムは、現在もっとも短い列へ順番に配置されます。アイテムの高さが異なっていても、前のアイテムの直後に配置されるため、行を基準とした余白が発生しません。

ただし厳密には、もっとも短い列だけが配置先の候補になるわけではありません。高さの差がわずかな列どうしは「同じ高さ」とみなされ、その中では HTML の順番が優先されます。この許容範囲は後述する `flow-tolerance` プロパティで調整できます。

`repeat()` と `minmax()` を組み合わせることで、メディアクエリを使わずにレスポンシブなレイアウトを実装できます。

```css
.gallery {
  display: grid-lanes;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 15rem), 1fr));
  gap: 1rem;
}
```

利用できる幅に応じて、最低 15rem の列が可能な限り作成されます。コンテナの幅が狭くなり 15rem の列を配置できなくなると、自動的に列数が減少します。`min(100%, 15rem)` と指定しているのは、コンテナ自体が 15rem より狭い場合に横方向へはみ出すことを防ぐためです。

以下のデモでは、それぞれ高さが異なる 8 枚のカードを Grid Lanes で配置しています。画面幅を変更すると、列数が自動的に変化することを確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5P1zuiStUZJi5f21C0DxnO/77302869a6fafc8fbf5dd84307c5c703/image.png)

<iframe height="300" style="width: 100%;" scrolling="no" title="grid lanes gallery" src="https://codepen.io/azukiazusa1/embed/QwdZwzK?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/QwdZwzK">
  grid lanes gallery</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## 行方向にアイテムを配置する

`grid-template-columns` の代わりに `grid-template-rows` を指定すると、行をレーンとして使用して横方向へアイテムを積み重ねられます。以下の例では、横幅が異なる 6 つのカードを 3 本の行レーンへ配置します。

```html
<section class="gallery">
  <article class="card">1</article>
  <article class="card">2</article>
  <article class="card">3</article>
  <!--... -->
</section>
```

```css
.gallery {
  display: inline-grid-lanes;
  grid-template-rows: repeat(3, 7rem);
  gap: 1rem;
}

.card {
  width: var(--card-width);
}

.card:nth-child(1) { --card-width: 11rem; }
.card:nth-child(2) { --card-width: 16rem; }
.card:nth-child(3) { --card-width: 9rem; }
/* ... */
```

ここで `display` に指定しているのは `grid-lanes` ではなく `inline-grid-lanes` です。両者の違いはレーンの方向ではなく、コンテナ自身がブロックレベルの箱になるかインラインレベルの箱になるかという点にあります。この例ではコンテナの横幅をカードの合計幅にぴったり合わせたいため、インラインレベルの `inline-grid-lanes` を選んでいます。

列方向の Grid Lanes が現在もっとも短い列へ次のアイテムを配置するのと同様に、この例では現在もっとも横幅が詰まっていない行へ次のアイテムが配置されます。各カードの横幅が異なるため、アイテムは左から右へ石積み状に並びます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3xyEbSKube4P4qoDePdExy/f1728d939a83ff0c439f0031a92e3e59/image.png)

現在は、`grid-template-columns` と `grid-template-rows` のどちらを指定したかによってレーンの方向が決まります。方向を明示するために既存の `grid-auto-flow` を再利用するか、専用のプロパティ（`grid-lanes-direction` のような）を追加するかについては、CSS Working Group で引き続き議論されています。

- [CSS Grid Level 3 — Orienting Grid Lanes Layout](https://drafts.csswg.org/css-grid-3/#grid-lanes-orientation)
- [CSSWG Issue #12803](https://github.com/w3c/csswg-drafts/issues/12803)

## 複数のレーンにまたがるアイテムを配置する

Grid Lanes がトラックのサイズや配置に CSS Grid のプロパティを再利用していることの利点は、単に書き方が似ているという点だけではありません。CSS Grid で使えていた配置の機能をそのまま持ち込めます。

たとえば `grid-column` を使うと、特定のアイテムだけを複数のレーンにまたがって配置できます。以下の例では、`.card--featured` を持つカードだけが 2 列分の幅を占めます。

```css
.gallery {
  display: grid-lanes;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 15rem), 1fr));
  gap: 1rem;
}

.card--featured {
  grid-column: span 2;
}
```

複数のレーンにまたがるアイテムは、またがるレーンのうち最も下まで埋まっているレーンの末尾に合わせて配置されます。そのため、短いレーン側に空白が残る場合がありますが、注目させたい商品や記事だけを大きく見せるレイアウトを JavaScript を使わずに表現できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/1MdSySb8K24BQutDt6fhHA/bbe92d88025d2778d0ae4d8ca3a75a33/image.png)

`span` による相対的な指定だけでなく、ライン番号による明示的な配置も利用できます。次の例では、負のライン番号を使ってヘッダーを常に最後の 2 列へ配置しています。列数がレスポンシブに変化しても、末尾の 2 列を占めるという指定は保たれます。

```css
.header {
  grid-column: -3 / -1;
}
```

## `flow-tolerance` で配置順を調整する

Grid Lanes は原則として、次のアイテムを現在もっとも短いレーンへ配置します。たとえば 3 つの列にアイテムを配置した結果、それぞれの高さが以下のようになっているとします。

```txt
1 列目: 200px
2 列目: 208px
3 列目: 260px
```

単純に最も短い列を選ぶ場合、次のアイテムは 1 列目へ配置されます。しかし 1 列目と 2 列目の差はわずか 8px です。この程度の違いでも常に最短の列を選ぶと、アイテムが左右に頻繁に移動し、HTML の順番と見た目の流れが大きく異なる場合があります。

![](https://images.ctfassets.net/in6v9lxmm5c8/6Al2rXKvxlP37Ixas8Sw9z/65c51caba984ac1b7b4224ecac80380d/image.png)

`flow-tolerance` は、レーン間の高さの差を「同じくらい」とみなす許容値を指定するプロパティです。

```css
.gallery {
  display: grid-lanes;
  grid-template-columns: repeat(3, 1fr);
  flow-tolerance: 10px;
}
```

この例では最も短い 1 列目から 10px 以内にあるレーンを、同じ高さの候補として扱います。2 列目との差は 8px なので、1 列目と 2 列目は同じ高さとみなされます。3 列目は 60px 高いため候補になりません。候補が複数ある場合、その中から直前にアイテムを配置したレーンより後ろにある最初のレーンが選ばれます。つまり高さが同程度である限り、アイテムは左から右へ順番に埋まっていきます。最後のレーンまで到達すると、再び先頭のレーンへ戻ります。

`flow-tolerance` の初期値は `normal` です。Grid Lanes における `normal` の使用値は `1em` であり、わずかな高さの違いは無視されます。`px` ではなく `em` が使われているのは、コンテナの文字サイズを基準にするためです。文字が大きいレイアウトほど許容値も自動的に大きくなり、本文 1 行分程度の差であれば同じ高さとして扱われます。

値を小さくすると、空いているスペースを埋めることが優先されます。`0` を指定した場合、実際に最も短いレーンだけが配置先の候補になります。

```css
.gallery {
  flow-tolerance: 0;
}
```

反対に値を大きくすると、多少高さが異なるレーンも同じ高さとみなされるため、HTML の順番に近い自然な並びを維持しやすくなります。ただし値が大きすぎると、短いレーンがあるにもかかわらずアイテムが長いレーンへ配置され、大きな空白や縦方向の移動が発生する可能性があります。

`infinite` を指定するとレーンの高さを考慮せず、厳密にレーンの順番でアイテムを配置します。

```css
.gallery {
  flow-tolerance: infinite;
}
```

たとえば 3 列の Grid Lanes に 6 つのアイテムがある場合、アイテムの高さにかかわらず、1・2・3 番目はそれぞれ 1・2・3 列目に配置され、4・5・6 番目もそれぞれ 1・2・3 列目に配置されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3stwWxtMnvnAfpe28vGCET/fd1187270a473c00b5e6d6913df96282/image.png)

この配置では HTML の順番に沿って左から右へ移動する流れが保たれます。一方でレーンの高さを一切考慮しないため、短いレーンが空いていても利用されず、大きな空白が生じる可能性があります。

## CSS の Masonry を巡る仕様策定の議論

CSS に Masonry レイアウトを追加する取り組みは、Mozilla が 2020 年に Firefox のフラグ付き機能として実装したことから始まりました。しかし、Masonry を CSS Grid の一部として扱うべきか、独立したレイアウト方式として扱うべきかについて長い議論が続きました。

### CSS Grid に統合する案

Mozilla が実装し、WebKit が支持していた初期の案では、`display: grid` と `grid-template-rows: masonry` を組み合わせていました。

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: masonry;
}
```

この案では Masonry を「片方の軸だけが折りたたまれた CSS Grid」と捉えます。CSS Grid のトラックサイズ、明示的な配置、複数トラックへの span、subgrid といった機能をそのまま利用できることが利点です。また、Grid と似たプロパティを Masonry 用に重複して定義する必要もありません。

### 独立したレイアウト方式にする案

一方、Chrome と Edge のチームは `display: masonry` という独立したレイアウト方式を提案しました。

```css
.gallery {
  display: masonry;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
```

CSS Grid は行と列の 2 つの軸でアイテムを配置するのに対して、Masonry がトラックを定義するのは片方の軸だけです。また CSS Grid ではアイテムを配置する前にトラックのサイズを決定しますが、Masonry ではアイテムの配置とトラックのサイズ計算が互いに影響します。このようなレイアウトアルゴリズムの違いを考えると、Masonry は Grid とは別のレイアウト方式として表現するほうが理解しやすいという考えです。

Chrome 140 以降には `display: masonry` を使った試験実装が搭載されていましたが、この構文は現在では古いものとなっています。

### 現行草案の `display: grid-lanes` 案

一時期は Grid、Flexbox、Masonry のアイテム配置を `item-flow` という共通のプロパティで制御する案も検討されました。現行の CSS Grid Level 3 Editor's Draft ではこの案は採用されず、Masonry レイアウトを Grid Lanes として扱っています。

```css
.gallery {
  display: grid-lanes;
  grid-template-columns: repeat(3, 1fr);
}
```

`display` に専用の値を用意する点では Chrome の提案に似ています。その一方で、トラックのサイズやアイテムの配置には CSS Grid のプロパティを再利用しており、WebKit が重視していた CSS Grid の強力な機能も組み合わせられます。現行草案では、両者の主張を取り入れた構文になっていると言えるでしょう。ただし仕様全体は引き続き策定中であり、未解決の事項も残っています。

## 視覚的な順番とアクセシビリティ

Grid Lanes を利用しても HTML の順番自体は変わりません。Tab キーによるフォーカス移動やスクリーンリーダーの読み上げは、基本的に HTML に記述された順番に従います。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/OPDMNSeGrNQ6TlNggiMcw/3ec8e661482d4f3b07fe926ef4cbad5b/b951b3fc-0d84-4b2d-8988-ead91c9711d4.mov" controls></video>

[WCAG 2.2 Understanding 2.4.3](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html) では、コンテンツの順番が意味に影響する場合、正しい読み上げ順をプログラムで判別できることが求められます。フォーカス順と視覚的な順番は必ずしも完全に一致する必要はありませんが、フォーカスがランダムに飛んでいるように見え、ユーザーを混乱させる配置は避ける必要があります。

`flow-tolerance` が小さすぎると、フォーカスリングが左右へ頻繁に移動し、視覚的に追いかけにくくなる可能性があります。一方で値が大きすぎる場合も、フォーカスが縦方向へ大きく移動する可能性があります。単に隙間を最小化するのではなく、コンテンツの高さのばらつきや操作順を確認しながら適切な値を選ぶことが重要です。

商品の一覧や検索結果のようにコンテンツの順番に意味がある場合には、見た目を詰めるためだけに Grid Lanes を使うべきか検討する必要があります。写真ギャラリーのように各アイテムが独立しており、順番の重要性が低いコンテンツに適しています。

## 未対応ブラウザにフォールバックする

Grid Lanes に対応していないブラウザでは `display: grid-lanes` の宣言が無効になります。先に通常の CSS Grid を指定し、`@supports` の中で Grid Lanes に切り替えることでフォールバックを用意できます。

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 15rem), 1fr));
  gap: 1rem;
}

@supports (display: grid-lanes) {
  .gallery {
    display: grid-lanes;
  }
}
```

未対応ブラウザでは通常の Grid として表示されるため、アイテム間に行単位の余白は生じるものの、コンテンツを問題なく閲覧できます。Grid Lanes はレイアウトをより魅力的にするプログレッシブエンハンスメントとして導入しやすい機能です。

## まとめ

- CSS Grid Lanes を使うことで、高さの異なるアイテムを JavaScript なしで Masonry レイアウトとして配置できる
- `display: grid-lanes` と、CSS Grid で使われている `grid-template-columns`、`grid-template-rows` などのプロパティを組み合わせる
- `grid-column: span 2` のような CSS Grid の配置機能をそのまま利用して、特定のアイテムを複数のレーンにまたがって配置できる
- Masonry を CSS Grid に統合するか、独立したレイアウト方式にするかについて長い議論があり、現行草案では両方の特徴を持つ Grid Lanes が採用されている
- `flow-tolerance` は、レーン間の高さの差を同じとみなす許容値であり、空間の詰め込みと自然な配置順のバランスを調整する
- 未対応ブラウザに備えて、`@supports` を使って通常の CSS Grid へフォールバックする

## 参考

- [CSS Grid Layout Module Level 3](https://drafts.csswg.org/css-grid-3/)
- [Introducing CSS Grid Lanes | WebKit](https://webkit.org/blog/17660/introducing-css-grid-lanes/)
- [WebKit Features for Safari 26.4](https://webkit.org/blog/17862/webkit-features-for-safari-26-4/)
- [When will CSS Grid Lanes arrive? How long until we can use it? | WebKit](https://webkit.org/blog/17758/when-will-css-grid-lanes-arrive-how-long-until-we-can-use-it/)
- [Help us choose the final syntax for Masonry in CSS | WebKit](https://webkit.org/blog/16026/css-masonry-syntax/)
- [Brick by brick: Help us build CSS Masonry | Chrome for Developers](https://developer.chrome.com/blog/masonry-update)
- [Masonry layout - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Masonry_layout)
