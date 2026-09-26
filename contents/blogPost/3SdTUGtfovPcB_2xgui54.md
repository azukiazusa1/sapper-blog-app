---
id: 3SdTUGtfovPcB_2xgui54
title: "CSS の scroll-axis-lock で斜め方向にスクロールできる UI を作る"
slug: "css-scroll-axis-lock"
about: "ブラウザはスクロール操作の方向を縦か横の一方向に固定することがあります。scroll-axis-lock プロパティを使うと、この軸ロックを解除できます。この記事で scroll-axis-lock の基本的な使い方を紹介します。"
createdAt: "2026-09-26T14:12+09:00"
updatedAt: "2026-09-26T14:12+09:00"
tags: ["CSS"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/01odA2iSnszkFjVUwzGqb0/0aa55a1a401a16d81e5c20d2d807a40a/ei_13954-768x630.png"
  title: "かわいいエイのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "scroll-axis-lock の初期値 auto は、どのような指定ですか？"
      answers:
        - text: "ブラウザが軸ロックすることを許可する"
          correct: true
          explanation: "auto は軸ロックをブラウザの判断に委ねます。すべての操作で軸ロックが発生するわけではありません。"
        - text: "縦か横の一方向への固定を強制する"
          correct: false
          explanation: "auto は軸ロックを強制しません。現在の仕様に強制用の値は定義されていません。"
        - text: "入力にかかわらず斜め方向へ動かす"
          correct: false
          explanation: "scroll-axis-lock は入力方向を変換する機能ではありません。auto は軸ロックを許可します。"
        - text: "縦方向の軸ロックだけを解除する"
          correct: false
          explanation: "auto は特定の軸のロックを解除する指定ではありません。軸ロックを解除する値は none です。"
published: true
---

地図やスプレッドシートをトラックパッドでスクロールしているとき、斜めに動かしたつもりが縦方向にしか動かなかったことはないでしょうか。ブラウザは操作の開始方向からユーザーの意図を判断し、スクロールを縦か横の一方向に固定することがあります。この動作を「軸ロック」と呼びます。

軸ロックは、縦に読み進めているときに意図せず横へずれることを防ぎます。一方で、地図のように縦横を自由に移動したい UI では操作の妨げになる場合があります。

CSS の [scroll-axis-lock](https://drafts.csswg.org/css-overflow-5/#scroll-axis-lock) プロパティを使うと、スクロール領域ごとに軸ロックを解除できます。この記事では基本的な使い方を紹介します。

!> 2026 年 9 月 22 日現在、`scroll-axis-lock` は [Chrome 153 の新機能](https://developer.chrome.com/release-notes/153#the_scroll-axis-lock_property)として提供されています。仕様は CSS Overflow Module Level 5 の Editor's Draft です。

## スクロールの軸ロックとは

例えば、指をほぼ縦方向に動かす操作には、わずかな横方向の動きも含まれます。この横方向の動きを厳密にスクロールに反映させると、ユーザーの意図とは異なるスクロールが発生することがあります。そのため、ブラウザが「縦へスクロールしたい」と判断すると、横方向の移動量を無視することがあります。これを軸ロックと呼びます。

[仕様の説明](https://drafts.csswg.org/css-overflow-5/#scroll-axis-locking)では、縦方向の移動量が 500px、横方向の移動量が 3px という例が挙げられています。ブラウザが縦方向に軸ロックした場合、横方向の 3px はスクロールに反映されません。

縦に読み進めるときには便利ですが、地図やスプレッドシート、キャンバスのように縦横を自由に移動したい UI では、軸ロックが操作の妨げになる場合があります。軸ロックによってその動きが制限されると、一度指を離して別の角度から操作し直す必要が生じます。

`scroll-axis-lock: none` は、このような入力を一方向へ固定する処理を無効にします。縦横両方向の入力がある場合に、その横方向の成分を軸ロックによって無視されないようにします。

## `scroll-axis-lock` の使い方

スクロールする要素に `scroll-axis-lock: none` を指定します。

```css
.table-container {
  width: 420px;
  height: 360px;
  overflow: auto;
  scroll-axis-lock: none;
}
```

`overflow: auto` は、内容がはみ出したときにスクロールできる領域を作ります。その要素に `scroll-axis-lock: none` を追加すると、ブラウザによる軸ロックを解除できます。縦横にスクロールするためには、内容が両方向にはみ出している必要があります。

指定できる値は次の 2 つです。

| 値 | 意味 |
| --- | --- |
| `auto` | ブラウザは軸ロックしてもよい。初期値 |
| `none` | ブラウザは軸ロックしてはならない |

:::info
`auto` は軸ロックを強制する指定ではありません。どのような操作で固定されるかは、ブラウザや入力デバイスに依存します。
:::

:::warning
親要素に `scroll-axis-lock: none` を指定しても、子要素には自動で継承されません。実際にスクロールする要素へ指定する必要があります。
:::

### なぜ新しいプロパティが必要なのか

[最初の提案](https://github.com/w3c/csswg-drafts/issues/13207)では、地図や大きな図などの 2 次元の UI で、軸ロックが自由な移動を妨げることが課題として挙げられています。

[Explainer](https://github.com/explainers-by-googlers/scroll-axis-lock#current-workarounds)では、既存の回避策として JavaScript で指の移動量を追跡し、位置を更新する実装が紹介されています。ただし、この方法ではジェスチャーの処理を自前で管理しなければなりません。JavaScript を実行するメインスレッドがほかの処理で忙しい場合、操作への反応も遅れる可能性があります。

```js
const container = document.querySelector(".table-container");
let previous = null;

container.addEventListener("touchstart", (event) => {
  const touch = event.touches[0];
  // 1 本指の操作だけを対象に、移動量の基準となる座標を記録する
  previous =
    event.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : null;
});

container.addEventListener(
  "touchmove",
  (event) => {
    if (!previous || event.touches.length !== 1) return;
    // ブラウザの標準のスクロール処理を無効にし、自前でスクロール位置を更新する
    event.preventDefault();

    const touch = event.touches[0];
    container.scrollLeft += previous.x - touch.clientX;
    container.scrollTop += previous.y - touch.clientY;
    previous = { x: touch.clientX, y: touch.clientY };
  },
  { passive: false },
);

const reset = () => {
  previous = null;
};
container.addEventListener("touchend", reset);
container.addEventListener("touchcancel", reset);
```

このような JavaScript による回避策の問題点を解決するために、標準の CSS で軸ロックの挙動を制御する `scroll-axis-lock` プロパティが提案されました。

:::info
初期案の名前と値は `overflow-axis-lock: proximity | none` でした。[2026 年 1 月の CSSWG の議論](https://github.com/w3c/csswg-drafts/issues/13207#issuecomment-3808193000)で、初期の動作をブラウザの判断に委ねる `auto` と、スクロールの制御を示す `scroll-` という名前に変更されました。
:::

## 大きな表で操作を比較する

実際にどのような違いがあるかを確認してみましょう。同じ内容の表を 2 つ並べ、片方だけに `scroll-axis-lock: none` を指定して比較します。

<iframe height="300" style="width: 100%;" scrolling="no" title="scroll-axis-lock の比較" src="https://codepen.io/azukiazusa1/embed/gbmRMWp?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/gbmRMWp">
  scroll-axis-lock の比較</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

違いを確認するためにはトラックパッドで縦方向にスクロールしてみるとわかりやすいです。`scroll-axis-lock: none` を指定していない方は真っ直ぐにスクロールされる一方で、`scroll-axis-lock: none` を指定した方はわずかに横方向にずれながらスクロールされることがわかります。

!v(https://videos.ctfassets.net/in6v9lxmm5c8/h1HC3QOcqBw75KeTkLGod/54b5600ff22b75879d2f9b33f0785600/css-scroll-axis-lock-1.mp4 938x522)

## まとめ

- `scroll-axis-lock: none` は、ブラウザがスクロールを縦か横の一方向に固定する軸ロックを解除する
- 初期値の `auto` はブラウザの判断に委ねる指定であり、軸ロックを強制しない
- `scroll-axis-lock` は継承されないため、実際にスクロールする要素へ指定する

## 参考

- [CSS Overflow Module Level 5 — Scroll Axis Locking](https://drafts.csswg.org/css-overflow-5/#scroll-axis-locking)
- [Explainer for scroll-axis-lock](https://github.com/explainers-by-googlers/scroll-axis-lock)
- [CSSWG Issue #13207: Allow controlling scroll axis locking behavior](https://github.com/w3c/csswg-drafts/issues/13207)
- [CSSWG PR #14152: Introduce scroll-axis-lock](https://github.com/w3c/csswg-drafts/pull/14152)
- [Chrome 153 Release notes](https://developer.chrome.com/release-notes/153)
- [Intent to Prototype and Ship: scroll-axis-lock](https://groups.google.com/a/chromium.org/g/blink-dev/c/hKqC91rcSG0)
