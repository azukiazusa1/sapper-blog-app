---
id: Kdikhh4XOL7trfX6PgHEW
title: "scroll-state() CSS コンテナクエリを使用して sticky で張り付いたときに境界線を出す"
slug: "scroll-state-function-to-show-border-when-sticky"
about: "scroll-state() はコンテナ要素のスクロール状態に応じてスタイルを変更することができるコンテナクエリです。例えば、スクロール中にヘッダーを sticky な場合の境界線を表示することが挙げられます。"
createdAt: "2025-01-18T19:59+09:00"
updatedAt: "2025-01-18T19:59+09:00"
tags: ["CSS"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/csohw4ouPaQG4zqoEiYMa/f537169c1916a02da33973932a6eea56/banrinochoujou_6743-768x605.png"
  title: "万里の長城のイラスト"
selfAssessment:
  quizzes:
    - question: "scroll-state() が受け入れる名前として存在しないものはどれか？"
      answers:
        - text: "stuck"
          correct: false
          explanation: null
        - text: "snapped"
          correct: false
          explanation: null
        - text: "scrollable"
          correct: false
          explanation: null
        - text: "scrolling"
          correct: true
          explanation: null

published: true
---

!> `scroll-state()` は 2025 年 1 月現在 Chrome v133 以降のみでサポートされています。

`scroll-state()` は[コンテナクエリ](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_containment/Container_queries)の一種であり、コンテナ要素のスクロール状態に応じてスタイルを変更できます。
よくある使い方としては、スクロール中にヘッダーを sticky な場合の境界線を表示することが挙げられます。従来は要素が sticky によりスナップされているかどうかを JavaScript を使って判定する必要がありましたが、`scroll-state()` を使うことで CSS だけで実現できます。

## スクロールがスタックされている状態

はじめに [container-type](https://developer.mozilla.org/ja/docs/Web/CSS/container-type) プロパティを使ってコンテナを定義します。`container-type` の値には `scroll-state` を指定します。

```css
.scroll-container {
  position: sticky;
  top: 0;
  container-type: scroll-state;
}
```

続いて [@container](https://developer.mozilla.org/ja/docs/Web/CSS/@container) アットルールを使い先ほど定義したコンテナの状態に応じてスタイルを変更するルールを定義します。`scroll-state(stuck: top)` はコンテナがスクロールにより上部にスタックされている状態を表します。このルールはコンテナ要素自身は選択できません。

```css
@container scroll-state(stuck: top) {
  .header {
    border-bottom: 1px solid #e0e0e0;
  }
}
```

`stuck` の値には以下のいずれかを指定できます。

- none
- top
- right
- bottom
- left
- block-start
- inline-start
- block-end
- inline-end

それでは実際にスクロールがスタックされたときに境界線が表示されるか確認してみましょう。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/597BwfheVzBEISKnD5jEi/bf054c78ee797bb86d87c32ae8208606/_____2025-01-18_20.28.57.mov" controls></video>

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/VYZBMGx?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/VYZBMGx">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## スクロールがスナップされた状態

`scroll-state(snapped: xxx)` は [CSS スクロールスナップ](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_scroll_snap/Basic_concepts) でスクロールがスナップした状態を表します。このクエリは [scrollsnapchanging](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollsnapchanging_event) イベントの代替として使用できます。

`snap` の値には以下のいずれかを指定できます。

- none
- x：スクロールスナップが水平（`scroll-snap-type: x`）の場合にスナップされた状態にマッチする
- y：スクロールスナップが垂直（`scroll-snap-type: y`）の場合にスナップされた状態にマッチする
- block：スクロールスナップがブロック（`scroll-snap-type: block`）の場合にスナップされた状態にマッチする
- inline：スクロールスナップがインライン（`scroll-snap-type: inline`）の場合にスナップされた状態にマッチする

例としてスナップされた要素のみを強調して表示するスタイルを定義してみましょう。

```css
.snap-scroll-container {
  /* 水平方向のスクロールスナップを有効にする */
  scroll-snap-type: x mandatory;
}

.card {
  /** スクロールが中央でスナップされる */
  scroll-snap-align: center;
  container-type: scroll-state;
}

.card > * {
  transform: scale(0.9);
  opacity: 0.5;
  transition:
    transform 0.5s,
    opacity 0.5s;
}

@container scroll-state(snapped: x) {
  .card > * {
    transform: scale(1.2);
    opacity: 1;
  }
}
```

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/3kSt7lxwTrBeoF9Hsxx3yM/1eebdbe5fc1e16797529f92b6194c8ae/_____2025-01-18_20.57.23.mov" controls></video>

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/NPKBaQW?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/NPKBaQW">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## スクロール可能な状態

`scroll-state(scrollable: xxx)` はスクロール領域が実際にスクロール可能な状態を表します。`scrollable` の値には以下のいずれかを指定できます。

- none
- top
- right
- bottom
- left
- block-start
- inline-start
- block-end
- inline-end
- x
- y
- block
- inline

`scrollable` を使う例として、トップへ戻るボタンの表示を切り替えてみましょう。トップへ戻るボタンは上方向にスクロール可能なときのみ表示されるようにしたいはずです。`scrollable: top` はスクロールが上方向に可能な状態を表します。

```css
.scrollable-container {
  container-type: scroll-state;
}

.top-button {
  transform: translateY(100px);
  transition: transform 0.3s;
  position: fixed;
  bottom: 20px;
  right: 20px;
}

@container scroll-state(scrollable: top) {
  .top-button {
    transform: translateY(0);
  }
}
```

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/5MwlN6RwgiDjJt2jeit5Er/ec1a6688d2ff0aefaeebd1f14a5b335f/_____2025-01-18_21.48.37.mov" controls></video>

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/gbYjXoO?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/gbYjXoO">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## まとめ

- `scroll-state()` はスクロール状態に応じてスタイルを変更するためのコンテナクエリです。
- `scroll-state(stuck: xxx)` はスクロールがスタックされた状態を表します。
- `scroll-state(snapped: xxx)` はスクロールがスナップされた状態を表します。
- `scroll-state(scrollable: xxx)` はスクロール領域が実際にスクロール可能な状態を表します。

## 参考

- [6.3. Scroll State Container Features](https://drafts.csswg.org/css-conditional-5/#scroll-state-container)
- [CSS scroll-state()  |  Blog  |  Chrome for Developers](https://developer.chrome.com/blog/css-scroll-state-queries?hl=ja)
