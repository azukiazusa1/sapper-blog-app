---
id: XcdV_26xOuj7haXbgSgS-
title: "`clamp()` 関数を使用したレスポンシブなフォントサイズ"
slug: "responsive-font-size-clamp"
about: "レスポンシブデザインにおいてメディアクエリを使用して異なる画面サイズに対して異なるフォントサイズを指定する方法は一般的ですが、いくつかの課題点もあります。`clamp()` 関数を使用することで、画面幅の変化に対してフォントサイズが滑らかに変化するようにできます。また煩雑なメディアクエリの管理を減らすことができます。"
createdAt: "2026-03-01T09:50+09:00"
updatedAt: "2026-03-01T09:50+09:00"
tags: ["CSS"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/uua3nrvA2S9pIV6oFbHOv/046fab224e4ab143c8f8315b58575c98/image.png"
  title: "スパナのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "`clamp()` 関数の引数の順序として正しいものはどれか？"
      answers:
        - text: "理想値, 最小値, 最大値"
          correct: false
          explanation: null
        - text: "最小値, 理想値, 最大値"
          correct: true
          explanation: "`clamp()` 関数は最小値、理想値、最大値の順で 3 つの引数を取ります。"
        - text: "最大値, 理想値, 最小値"
          correct: false
          explanation: null
        - text: "最小値, 最大値, 理想値"
          correct: false
          explanation: null
published: true
---
CSS によるレスポンシブデザインにおいて、メディアクエリを使用して異なる画面サイズに対して異なるフォントサイズを指定する方法を真っ先に思い浮かべる人が多いと思います。例えば以下のスタイルは、画面幅が 768px 以上のときにフォントサイズを 1.125rem に、1280px 以上のときに 1.25rem というように段階的にフォントサイズを大きくしています。

```css
p {
  font-size: 1rem;
}

@media (min-width: 768px) {
  p {
    font-size: 1.125rem;
  }
}

@media (min-width: 1280px) {
  p {
    font-size: 1.25rem;
  }
}
```

メディアクエリを使用する方法は長らくレスポンシブデザインの定番として使用されていましたが、いくつかの課題点もあります。

- 画面全体幅というビューポートのサイズに基づいてフォントサイズが変化するため、同じコンポーネントでも配置されるコンテキストによって異なる振る舞いをさせることが難しい。例えばサイドバーが閉じているときと開いているときで利用可能な画面領域は異なるが、画面全体幅に変化はない
- Web が表示されるデバイスの多様化（折りたたみ式デバイス、マルチウィンドウなど）により、メディアクエリが肥大化してしまう。メディアクエリの条件式の中にカスタムプロパティを使用できないこともあり、マジックナンバーが増えてしまう
- 特定の画面幅に対してフォントサイズを段階的に変化させるため、画面幅の変化に対してフォントサイズが滑らかに変化せず、フォントサイズが急に大きくなったり小さくなったりする印象を与えてしまう

これらの課題に対してモダンな CSS ではいくつかの解決策が提供されています。

- コンテナクエリはビューポートではなく、親要素のサイズに基づいてスタイルを変更できる
- コンテナクエリユニット（`cqw`, `cqh`, `cqi`, `cqb`）を使用することで、コンテナのサイズに応じてフォントサイズを相対的に指定できる
- CSS Grid の `auto-fit` / `auto-fill` + `minmax()` を使用することで、コンテナのサイズに応じて自動的にカラム数やサイズを調整できる
- `clamp()` 関数を使用することで、最小値、理想値、最大値を指定して、画面幅の変化に対してフォントサイズが滑らかに変化するようにできる

この記事では、最後の `clamp()` 関数を使用した方法に焦点を当てて説明します。`clamp()` 関数を使用することにより、メディアクエリの管理の複雑さを減らし、フォントサイズが画面幅の変化に対して滑らかに変化するようにできます。`clamp()` 関数はすべてのモダンブラウザでサポートされています。

b> clamp

## `clamp()` 関数の基本的な使い方

`clamp()` 関数は CSS の関数で、3 つの引数を取ります。最小値、理想値、最大値の順で指定します。

```css
clamp(最小値, 理想値, 最大値)
```

例えば、以下のスタイルは、フォントサイズが 1rem から 2rem の範囲で、画面幅に応じて滑らかに変化するように指定しています。

```css
p {
  font-size: clamp(1rem, 0.5rem + 2.5vw, 2rem);
}
```

2 番目の引数である推奨値に `vw`（ビューポート幅の単位）を使用している点がポイントです。`2.5vw` はビューポート幅の 2.5% を意味します。つまり画面幅が変化するたびに実際のピクセル値もリアルタイムに変化するのです。大雑把に表すと以下のようになります。

| ビューポート幅 | `2.5vw` の値 | `0.5rem + 2.5vw` の値 | フォントサイズ（`clamp()` 適用後） |
| -------------- | ------------ | --------------------- | ---------------------------------- |
| 320px          | 8px          | 16px                  | 1rem (16px)                        |
| 768px          | 19.2px       | 27.2px                | 1.7rem (27.2px)                    |
| 1280px         | 32px         | 40px                  | 2rem (32px)                        |

`clamp()` 関数の内部では、ブラウザはまず 2 番目の引数である理想値を計算します。次に、計算された理想値が最小値より小さい場合は最小値を使用し、最大値より大きい場合は最大値を使用します。ただ単に `vw` だけを使用すると画面幅が極端に小さいときや大きいときにフォントサイズが極端に小さくなったり大きくなったりしてしまう可能性がありますが、`clamp()` を使用することで安全な範囲内でフォントサイズを変化させることができるというわけです。

:::note
clamp という単語は留め具や万力を意味します。範囲内に値を「留める」という関数の動作を表すのに適した名前ですね。
:::

実際の動作は以下のデモで確認できます。

<iframe height="300" style="width: 100%;" scrolling="no" title="clamp" src="https://codepen.io/azukiazusa1/embed/Eagjrmg?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/Eagjrmg">
  clamp</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/3MWIzPktzQFSeOtaGkwWfG/b074eada867e3bcfb89d0087f7aed31c/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2026-03-01_10.41.19.mov" controls></video>

Chrome の DevTools で適用されているスタイルを確認すると、現在適用されているフォントサイズが瞬時に確認できて便利です。

![](https://images.ctfassets.net/in6v9lxmm5c8/2CpkSvggToDQw2v4mbpnCT/7dcfeb18f86c47a169bb3af58248b4c7/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-03-01_10.44.11.png)

デモで動作を確認してみると、画面幅が `960px` 以上のときはフォントサイズが最大値の `2rem` に達していることがわかります。しかし、これでは最大値に達するまでの画面幅が早すぎると感じるかもしれません。画面幅が 1280px 以上のときに最大値に達するようにするには、理想値をどのように調整すればいいでしょうか？

推奨値を出すためには、傾きと切片を求める必要があります。

```txt
傾き = (最大値 - 最小値) / (最大幅 - 最小幅)
      = (32 - 16) / (1280 - 320)
      = 16 / 960
      ≈ 0.01667 → 1.667vw

切片 = 最小値 - 傾き × 最小幅
          = 16 - 0.01667 × 320
          = 16 - 5.333
          = 10.667px ≈ 0.667rem
```

つまり、実際のコードは以下のようになるわけです。

```css
p {
  font-size: clamp(1rem, 0.667rem + 1.667vw, 2rem);
}
```

<iframe height="300" style="width: 100%;" scrolling="no" title="clamp" src="https://codepen.io/azukiazusa1/embed/myrJvqj?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/myrJvqj">
  clamp</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

とはいえ、実際にはこのような計算を毎回行うのは大変でしょう。[Min-Max-Value Interpolation](https://min-max-calculator.9elements.com/?16,32,320,1280) のようなツールを使用することで、必要な値を簡単に計算できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/4uIVH84aHyRtdmoumT0NqE/8aaffa0e5ce046bec947cdc70147f920/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-03-01_11.02.35.png)

## `clamp()` 関数で余白を設計する

`clamp()` 関数はフォントサイズだけでなく、`<length>` 型のプロパティであれば何にでも使用できます。画面幅に応じて余白を滑らかに変化させるというのもよくあるユースケースの 1 つです。

```css
/* セクションの余白 */
.section {
  padding: clamp(2rem, 1rem + 4vw, 6rem);
}

/* カードの間の余白 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: clamp(1rem, 3vw, 2rem);
}

/* コンテナ幅の制限 */
.container {
  width: clamp(320px, 90vw, 1200px);
  margin-inline: auto;
}
```

## まとめ

- CSS によるレスポンシブデザインにおいて、メディアクエリを使用して異なる画面サイズに対して異なるフォントサイズを指定する方法は一般的だが、いくつかの課題点もある
- `clamp()` 関数を使用することで、最小値、理想値、最大値を指定して、画面幅の変化に対してフォントサイズが滑らかに変化するようにできる。また煩雑なメディアクエリの管理を減らすことができる
- `clamp()` の理想値を計算するためには、傾きと切片を求める必要があるが、Min-Max-Value Interpolation のようなツールを使用することで簡単に計算できる
- `clamp()` 関数はフォントサイズだけでなく、`<length>` 型のプロパティであれば何にでも使用できる。画面幅に応じて余白を滑らかに変化させるというのもよくあるユースケースの 1 つである

## 参考

- [clamp() - CSS | MDN](https://developer.mozilla.org/ja/docs/Web/CSS/Reference/Values/clamp)
- [clamp()を使った流体タイポグラフィの設計 - CSS Notes](https://css-notes.com/layout/fluid-typography/)
