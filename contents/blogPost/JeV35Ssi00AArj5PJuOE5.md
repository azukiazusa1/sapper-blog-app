---
id: JeV35Ssi00AArj5PJuOE5
title: "CSS の margin-trim でコンテナーの端の余白を取り除く"
slug: "css-margin-trim"
about: "カードの内側に padding を設定しても、先頭の見出しや最後の段落の margin が加わり、上下の余白が意図より大きくなることがあります。margin-trim を使うと、要素間の余白を保ったまま、コンテナーの端のマージンを取り除けます。カードの例を通して、基本的な使い方を紹介します。"
createdAt: "2026-09-27T17:32+09:00"
updatedAt: "2026-09-27T17:32+09:00"
tags: ["CSS"]
thumbnail:
  title: "鷹のイラスト"
  url: "https://images.ctfassets.net/in6v9lxmm5c8/54vAuSdF1IPhj0E6UjgyL2/e51c0f5b7c9518fa0ca3c09c7a6eb828/bird-hawk_22480.png"
audio: null
selfAssessment:
  quizzes:
    - question: "カード内の先頭と末尾の余分なマージンを取り除くには、margin-trim をどこに指定しますか？"
      answers:
        - text: "先頭の見出しと最後の段落に指定する"
          correct: false
          explanation: "margin-trim は、マージンを持つ要素自身ではなく、それらを含むコンテナーに指定します。"
        - text: "見出しと段落を含むカードに指定する"
          correct: true
          explanation: "コンテナーに margin-trim: block を指定することで、ブロック方向の両端で子要素のマージンを取り除きます。"
        - text: "カード内のすべての子要素に指定する"
          correct: false
          explanation: "すべての子要素への指定は不要です。今回の例ではカードへの指定で上下端を調整します。"
        - text: "カードの親要素に指定する"
          correct: false
          explanation: "margin-trim は、指定した要素の直接の内側の端で子要素のマージンを取り除きます。親要素に指定すると、カード内の見出しや段落ではなく、カード自身のマージンが対象になります。"
published: true
---

b> margin-trim

カードの内側に `padding: 24px` を指定して、上下左右の余白を揃えたいとします。しかし、カードの先頭にある見出しや最後の段落にも `margin` が設定されていると、上下の余白が意図より大きくなってしまいます。

![パディング 24px のカード。先頭の見出しと最後の段落のマージン 16px が加わり、上下端の余白が意図より大きくなっている](https://images.ctfassets.net/in6v9lxmm5c8/7jQNLbuZaYMcjt1yuK8Rzb/69b8d97dd4ecd5930c5417dd5cdd1c93/css-margin-trim-1.png)

従来は余分な margin を取り除きたい場合、`:first-child` や `:last-child` で対象の要素を選び、マージンを `0` にして調整していました。

CSS の [`margin-trim`](https://drafts.csswg.org/css-box-4/#margin-trim) プロパティを使うと、コンテナー側の指定で端のマージンを取り除けます。この記事では、見出しと段落を含むカードを例に、`margin-trim` の使い方を紹介します。

:::warning
2026 年 9 月 27 日時点で、`margin-trim` はすべての主要ブラウザーで利用できる機能ではありません。[Safari 16.4 で導入](https://webkit.org/blog/13966/webkit-features-in-safari-16-4/)されていますが、Chromium や Firefox では未対応です。
:::

## カードの上下に余分な余白ができる

まずは、`margin-trim` を使わない場合の余白を確認しましょう。次のカードには、見出しと 2 つの段落があります。

```html
<article class="card">
  <h2>カードのタイトル</h2>
  <p>最初の段落です。</p>
  <p>最後の段落です。</p>
</article>
```

カードに `24px` のパディングを設定し、見出しと段落には上下に `16px` のマージンを設定します。

```css
.card {
  padding: 24px;
  border: 1px solid;
}

.card > h2,
.card > p {
  margin-block: 16px;
}
```

`margin-block` は、文章のブロック方向の両端にマージンを設定するプロパティです。通常の横書きでは上下方向に対応するので、この例では `margin-top: 16px` と `margin-bottom: 16px` を指定した場合と同じです。

カードの上端では、パディングの `24px` と見出しの上マージンの `16px` が加わります。下端でも同様です。そのため、枠線の内側から先頭・末尾の要素のボックスまでの距離は、それぞれ意図せず `40px` になってしまいます。

:::info
一方、見出しと段落の間や、段落同士の間隔は `16px` です。通常のブロック配置では、隣り合う上下のマージンが 1 つにまとめられる「マージンの相殺」が起こるためです。この例のように両方が正の値なら、大きい方の値が使われます。詳しくは [CSS 2 のマージンの相殺の定義](https://www.w3.org/TR/CSS2/box.html#collapsing-margins) を参照してください。
:::

### 先頭と末尾のマージンを取り除く従来の方法

このカードなら、次のように先頭と末尾の子要素だけを選んでマージンを取り除けます。

```css
.card > :first-child {
  margin-block-start: 0;
}

.card > :last-child {
  margin-block-end: 0;
}
```

しかし、この方法は子要素が直接マージンを持つ場合にしか対応できません。たとえば、段落を `div` でラップすると、`.card > :first-child` で選ばれるのはラッパーの `div` です。ラッパーのマージンは `0` になりますが、その中の段落のマージンは残ります。

```html
<article class="card">
  <div class="wrapper">
    <!-- この段落のマージンは .card > :first-child では取り除けない -->
    <p>段落です。</p>
  </div>
</article>
```

これに対応するには `.card > :first-child > :first-child` のようにセレクターを深くしていく必要があり、CSS の指定が HTML の構造に強く依存します。HTML の構造を変えるたびに CSS も修正しなければなりません。

## `margin-trim` をコンテナーに指定する

`margin-trim` を使う場合は、先ほどの `:first-child` と `:last-child` による指定の代わりに、カードへ `margin-trim: block` を追加します。

```css
.card {
  padding: 24px;
  border: 1px solid;
  margin-trim: block;
}

.card > h2,
.card > p {
  margin-block: 16px;
}
```

ポイントは、マージンを持つ見出しや段落ではなく、コンテナーである `.card` に指定することです。`block` は、ブロック方向の始端と終端でマージンを取り除く指定です。

次の画像は、同じ内容のカードを並べたものです。左には `margin-trim` を指定せず、右だけに `margin-trim: block` を指定しています。カードの上下端の余白と、段落同士の間隔を比較してください。

![左は上下端の余白が 40px のカード。右は margin-trim: block によって 24px になり、要素間の 16px の間隔は保たれている](https://images.ctfassets.net/in6v9lxmm5c8/28Ld1lY7fn3deTWtUwqTZq/313bc9449d5be22c22f125b10d613261/css-margin-trim-2.png)

右のカードでは、先頭の見出しの上マージンと、最後の段落の下マージンが取り除かれています。

<iframe height="300" style="width: 100%;" scrolling="no" title="margin-trim のデモ" src="https://codepen.io/azukiazusa1/embed/MYpEbxY?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/MYpEbxY">
  margin-trim のデモ</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## 取り除く方向を指定する

[現行の編集者草案](https://drafts.csswg.org/css-box-4/#margin-trim)では、次の値が定義されています。

| 値 | 動作 |
| --- | --- |
| `none` | マージンを取り除かない。初期値 |
| `block` | ブロック方向の始端と終端で取り除く |
| `block-start` | ブロック方向の始端だけで取り除く |
| `block-end` | ブロック方向の終端だけで取り除く |
| `block-start block-end` | `block` と同じく両端で取り除く |

たとえば、カードの末尾だけを調整する場合は、次のように指定します。

```css
.card {
  margin-trim: block-end;
}
```

この指定では、先頭の見出しの上マージンは残り、最後の段落の下マージンが取り除かれます。

## マージンの相殺と `margin-trim` の関係

`margin-trim` は、すべての子孫要素のマージンを `0` にする指定ではありません。[ブロックコンテナーでの定義](https://drafts.csswg.org/css-box-4/#margin-trim-block)では、先頭のブロック要素の始端マージン、末尾のブロック要素の終端マージンに加え、それらと相殺されるマージンも取り除きます。

たとえば、カード内の段落を `div` でラップした場合を考えます。

```html
<article class="card">
  <div class="wrapper">
    <p>段落です。</p>
  </div>
</article>
```

カードに `24px` のパディング、段落に上下 `16px` のマージンを設定します。`div` のマージンの初期値はもともと `0` ですが、相殺の関係をわかりやすくするために、ラッパーのマージンを明示的に `0` にしておきます。

```css
.card {
  padding: 24px;
  border: 1px solid;
}

.wrapper {
  margin: 0;
}

.wrapper > p {
  margin-block: 16px;
}
```

ラッパーにはパディングや枠線がないため、段落の上下マージンはラッパーの上下マージンと相殺されます。`0` と `16px` のマージンが相殺されても、`16px` の余白は残ります。その結果、カードの枠線の内側から段落のボックスまでの距離は、上下とも `24px + 16px = 40px` になります。

![段落を div でラップしたカード。段落のマージンがラッパーのマージンと相殺され、上下端の余白は 24px + 16px = 40px になっている](https://images.ctfassets.net/in6v9lxmm5c8/6JytTMYrHpZeizeCTUkSak/d90d7dcfabf976ba179bafeec725b316/css-margin-trim-3.png)

ここで、カードに `margin-trim: block` を追加します。

```css
.card {
  margin-trim: block;
}
```

ラッパーの端のマージンと相殺されている段落のマージンも対象になるため、`margin-trim` によって取り除かれます。パディングは残るので、上下端の余白は `24px` になります。

![margin-trim: block を指定したカード。ラッパー内の段落のマージンも取り除かれ、上下端の余白はパディングの 24px だけになっている](https://images.ctfassets.net/in6v9lxmm5c8/5AKbk2TBozHcOFulyfkL8/f1f82ad796b63ea00c5dd50d2fc45900/css-margin-trim-4.png)

## まとめ

- `margin-trim` をコンテナーに指定すると、端に接する子要素のマージンを取り除ける
- `margin-trim: block` はブロック方向の両端を対象とし、コンテナーのパディングや内部の要素間のマージンは残す
- ブロック配置では、端のマージンと相殺される子孫要素のマージンも対象になる

## 参考

- [CSS Box Model Module Level 4](https://drafts.csswg.org/css-box-4/#margin-trim)
- [CSS 2 — Collapsing margins](https://www.w3.org/TR/CSS2/box.html#collapsing-margins)
- [Easier layout with margin-trim | WebKit](https://webkit.org/blog/16854/margin-trim/)
- [WebKit Features in Safari 16.4](https://webkit.org/blog/13966/webkit-features-in-safari-16-4/)
