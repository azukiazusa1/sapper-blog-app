---
id: pquryiTjmbD5teU9cy-aR
title: "値の補間計算を簡潔に記述できる CSS の `progress` 関数"
slug: "css-progress-function"
about: "CSS の `progress` 関数は、2 つの長さの値の間の進捗を計算するための数学関数です。流体タイポグラフィやレスポンシブなレイアウト調整に利用できます。流体タイポグラフィは `clamp` 関数を使用して実装することもできますが、`progress` 関数を使用することでより意図を明確に記述できます。この記事では、CSS の `progress` 関数の構文と使用例について解説します。"
createdAt: "2025-07-06T09:41+09:00"
updatedAt: "2025-07-06T09:41+09:00"
tags: ["CSS"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3V9WXLk8920Vr9g2NPrtxY/99b5caacc38c244e5ce02c1309b9454b/mizumanjyu_16826-768x551.png"
  title: "水まんじゅうのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "CSS の `progress` 関数の構文で正しいものは次のうちどれでしょうか？"
      answers:
        - text: "progress(<現在値>, <開始値>, <終了値>)"
          correct: true
          explanation: "正解です。progress関数は現在値、開始値、終了値の3つの引数を取り、この順番で記述します。"
        - text: "progress(<開始値>, <終了値>, <現在値>)"
          correct: false
          explanation: "不正解です。引数の順番が間違っています。正しくは現在値が最初に来ます。"
        - text: "progress(<開始値>, <現在値>, <終了値>)"
          correct: false
          explanation: "不正解です。引数の順番が間違っています。現在値は最初の引数です。"
        - text: "progress(<終了値>, <開始値>, <現在値>)"
          correct: false
          explanation: "不正解です。引数の順番が完全に間違っています。"
    - question: "progress(100vw, 300px, 1200px) と定義した時、現在の画面サイズが 900px の場合、`progress` 関数はどのような値を返すでしょうか？"
      answers:
        - text: "約 0.67"
          correct: true
          explanation: "(900 - 300) / (1200 - 300) = 600 / 900 = 0.6666... ≈ 0.67となります。"
        - text: "67%"
          correct: false
          explanation: "progress関数は0から1の範囲で値を返すため、パーセンテージではなく小数で表現されます。"
        - text: "約 0.75"
          correct: false
          explanation: "不正解です。900 / 1200 = 0.75ですが、これは開始値を考慮していない計算です。"
        - text: "10.72px"
          correct: false
          explanation: "不正解です。progress関数は値を返すのではなく、0から1の範囲で進捗を表現します。"
published: true
---
CSS の `progress` 関数は、2 つの長さの値の間の進捗を計算するための数学関数です。フォントサイズをレスポンシブに調整する流体タイポグラフィ（Fluid typography）や、画面サイズに応じたレイアウトの調整、スクロール量に応じたプログレスバーの表示など、さまざまな場面で利用できます。`progress` 関数自体で新しい機能を提供できるわけではありませんが、既存の記述方法と比較してよりコードの意図を明確に記述できる点が特徴です。

:::message
2025 年 7 月現在、`progress` 関数は Chrome v138 以降でサポートされています。
:::

この記事では、CSS の `progress` 関数の構文と使用例について解説します。

## `progress` 関数の構文

`progress` 関数は現在値、開始値、終了値の 3 つの引数を取ります。構文は以下の通りです。

```css
progress(<現在値>, <開始値>, <終了値>)
```

この関数は、現在値が開始値と終了値の間でどの位置にあるかを計算し、その結果を 0 から 1 の範囲で返します。返される値は、現在値が開始値に近いほど 0 に、終了値に近いほど 1 に近づきます。

引数の型は [`<number>`](https://developer.mozilla.org/ja/docs/Web/CSS/number), [`<dimension>`](https://developer.mozilla.org/ja/docs/Web/CSS/dimension), [`<percentage>`](https://developer.mozilla.org/ja/docs/Web/CSS/percentage) のいずれかを取りますが、3 つの引数の型はすべて同じである必要があります。

例えば `px` と `%` を混在させることはできません。

```css
progress(100vw, 320px, 1200px) /* OK */
progress(100vw, 0px, 200%) /* NG */
progress(100vw, 0%, 200px) /* NG */
```

## 流体タイポグラフィの例

具体的な使用例として、流体タイポグラフィを考えてみましょう。以下の例では、フォントサイズを画面幅に応じて調整しています。

```css
.responsive-text {
  font-size: calc(16px + 24px * progress(100vw, 320px, 1200px));
}
```

この例では、画面幅が 320px のときにフォントサイズは 16px になり、画面幅が大きくなるにつれてフォントサイズが増加します。画面幅が 1200px に達すると、フォントサイズは 40px（16px + 24px × 1）になります。

第 1 引数の `100vw` は現在の画面幅を表し、この値が動的に変化することにより、`progress` 関数が返す値も変化します。例えば画面幅が 640px の場合、`progress` は以下のように計算されます。

```txt
progress(640px, 320px, 1200px) = (640 - 320) / (1200 - 320) = 320 / 880 ≈ 0.3636
```

`calc` 関数を使用して、フォントサイズは以下のように計算されます。

```txt
font-size = 16px + 24px * 0.3636 ≈ 16px + 8.7272px ≈ 24.7272px
```

以下の実装例で実際に画面サイズを変更してフォントサイズがどのように変化するかを確認できます。

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/KwpOMby?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/KwpOMby">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

流体タイポグラフィ自体は今までも [CSS の `clamp` 関数](https://developer.mozilla.org/ja/docs/Web/CSS/clamp) を使用して実装できました。

```css
.responsive-text {
  font-size: clamp(16px, 2vw + 1rem, 40px);
}
```

`progress` 関数を使用することで、より直感的に現在値と開始値、終了値の関係を表現できるようになります。

## 動的なレイアウト調整の例

レスポンシブにレイアウトを調整する場合にも `progress` 関数は有用です。以下の例では、`grid-template-columns` を使用して、画面幅に応じてカラムの数を動的に変更しています。

```css
.dynamic-grid {
  display: grid;
  grid-template-columns: repeat(
      calc(2 + 4 * progress(100vw, 375px, 1440px)),
      1fr
  );
  gap: calc(1rem + 1rem * progress(100vw, 375px, 1024px));
}
```

この例では、画面幅が 375px のときにカラム数は 2 になり、1440px に達するとカラム数は 6 になります。また、`gap` プロパティも画面幅に応じて動的に調整されます。

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/GgJVqeo?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/GgJVqeo">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## スクロールプログレスバーの例
スクロール量に応じてプログレスバーを表示する場合にも `progress` 関数が役立ちます。以下の例では、ページのスクロール量に応じてプログレスバーの幅を調整しています。

```css
/* カスタムプロパティを定義 */
@property --scroll-y {
  syntax: '<length>';
  initial-value: 0px;
  inherits: true;
}

@property --height {
  syntax: '<length>';
  initial-value: 100vh;
  inherits: true;
}

.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: calc(100vw * progress(var(--scroll-y), 0px, var(--height)));
  height: 4px;
  background: linear-gradient(to right, #00f260, #0575e6);
}
```

この例では、`--scroll-y` プロパティを使用して現在のスクロール量を取得し、`progress` 関数を使用してプログレスバーの幅を計算しています。スクロール量がページの高さに達すると、プログレスバーは画面幅いっぱいに広がります。

`--scroll-y` プロパティは、JavaScript を使用してスクロールイベントを監視し、ページのスクロール量を動的に更新することで実現できます。

```js
document.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  document.documentElement.style.setProperty('--scroll-y', `${scrollY}px`);
  // あふれて画面上に表示されない部分を含めた、要素の内容の高さ
  const scrollableHeight = document.documentElement.scrollHeight;
  // ブラウザの表示領域の高さ
  const viewportHeight = window.innerHeight;
  // スクロール可能な距離
  const height = scrollableHeight - viewportHeight;

  document.documentElement.style.setProperty('--height', `${height}px`);
});
```

以下が実際の実装例です。スクロールしてプログレスバーの動作を確認できます。

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/PwqMzvG?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/PwqMzvG">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## まとめ

- CSS の `progress` 関数は、2 つの長さの値の間の進捗を計算するための数学関数
- 現在値、開始値、終了値の 3 つの引数を取り、現在値が開始値と終了値の間でどの位置にあるかを計算して 0 から 1 の範囲で返す
- フォントサイズのレスポンシブ調整や、レイアウトの動的な変更、スクロールプログレスバーの表示などの使用例を示した
- `clamp` 関数を使用して流体タイポグラフィを実装できるが、`progress` 関数を使用することでより直感的に現在値と開始値、終了値の関係を表現できる

## 参考

- [CSS Values and Units Module Level 5](https://drafts.csswg.org/css-values-5/#progress)
- [\[css-values\] Proposal for a 'progress' function to calculate progress between two <length> values · Issue #7268 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/7268)
- [Modern Fluid Typography Using CSS Clamp — Smashing Magazine](https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/)
