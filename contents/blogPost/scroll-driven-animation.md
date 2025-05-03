---
id: qbrgt8fUjyMAzv2ChBkbZ
title: "CSS だけで動くスクロールドリブンアニメーション"
slug: "scroll-driven-animation"
about: "Google Chrome 115 で追加されたスクロールドリブンアニメーションを使うことで、今まで JavaScript を使わなれけば実装できなかったようなスクロールと連動するアニメーションを CSS だけで実装できるようになりました。スクロールの進行状況に応じてバーを伸縮させるようなアニメーションや、要素が画面内に入ったタイミングでアニメーションを開始するようなことが実装できます。"
createdAt: "2023-12-17T13:29+09:00"
updatedAt: "2023-12-17T13:29+09:00"
tags: [""]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/NuUlK0j73dc9UzGCLdWR2/c1e4a3d559c7c609ef238d88f83f0b46/winter_image_yuki-usagi_14924.png"
  title: "雪のうさぎ冬の夜のイラスト"
audio: null
selfAssessment: null
published: true
---
Google Chrome 115 で追加されたスクロールドリブンアニメーションを使うことで、今まで JavaScript を使わなれけば実装できなかったようなスクロールと連動するアニメーションを CSS だけで実装できるようになりました。

スクロールドリブンアニメーションを利用することで、例えばスクロールの進行状況を表すバーであったり、要素が画面内に出現したタイミングでアニメーションを開始するようなことが実装できます。

従来の CSS のアニメーションは、ページが読み込まれた後に時間の経過に応じてアニメーションが再生されていました。これはアニメーションタイムラインのデフォルトであるドキュメントタイムラインと呼ばれるものです。

新しい CSS プロパティである [`animation-timeline`](https://developer.mozilla.org/ja/docs/Web/CSS/animation-timeline) を使うことで、以下の 2 種類のタイムラインでアニメーションを再生できます。

- スクロールの進行状況タイムライン
- ビューの進行状況（ビューポートの中に要素が入っているかどうか）タイムライン

なお、`animation-timeline` は 2023 年現在 Google Chrome と Edge でのみ利用可能であることに注意してください。

["animation-timeline" | Can I use... Support tables for HTML5, CSS3, etc](https://caniuse.com/?search=animation-timeline)

## スクロールの進行状況タイムライン

`animation-timeline` プロパティを使って、スクロールの進行状況を表すバーを実装してみます。

スクロールの進行状況タイムラインは、スクロール範囲内の位置をアニメーションのタイムライン上の割合に変換します。スクロールの進行状況は 0% から 100% までの範囲で表され、下にスクロールすることで進行状況が 100% に近づきます。

スクロールの進行状況タイムラインを使用するには、[scroll()](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline/scroll) 関数を `animation-timeline` プロパティに指定します。

```css
.bar {
  width: 0%;
  background-color: blue;
  animation: linear progress;
  animation-duration: auto;
  animation-timeline: scroll();
}

@keyframes progress {
  0% {
    width: 0%;
  }

  100% {
    width: 100%;
  }
}
```

これにより、以下のようにスクロール量に応じてバーが伸縮していることが確認できます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/1I7EjIkcIRsB98082fFmiA/3391a22679c72834d34dee646ac350f0/_____2023-12-17_14.15.10.mov" controls></video>

完全なコード例は以下のレポジトリで確認できます。

https://github.com/azukiazusa1/scroll-driven-animation-example/blob/main/scroll-progress.html

### スクローラーを指定する

スクローラーとは、スクロールの進行状況を表すバーの進行状況を計算するための要素のことです。デフォルトでは、要素に一番近い要素（`nearest`）となります。

以下の例では、画面全体をスクロールしてもバーが伸縮せずに、ボックス内でスクロールしたときにバーが伸縮していることが確認できます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/1oppSsxrTnU6jayH4gBGNA/7dd3750134e472981bc07fc3b8bbe753/_____2023-12-17_15.04.41.mov" controls></video>

スクローラーは `scroll()` 関数の第 1 引数で指定できます。指定できる値は以下の 3 種類です。

- `nearest`
- `root`：画面全体
- `self`：要素自身

先の例で `scroll(root)` を指定することで、画面全体をスクロールしたときにバーが伸縮するようになります。

```css
.bar {
  animation: linear progress;
  animation-duration: auto;
  animation-timeline: scroll(root);
}
```

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/6ixZwa3DxoqW8OKdFRVHWU/2a6376faae3e7fe69eba26cafca592b9/_____2023-12-17_15.08.58.mov" controls></video>

`scroll(self)` を指定することでその要素自身がアニメーションの進行状況を表すようになります。以下の例ではボックス自体に背景色が変更するアニメーションを指定しています。

```css
.box {
  animation: linear change-color;
  animation-duration: auto;
  animation-timeline: scroll(self);
}

@keyframes change-color {
  0% {
    background-color: #60a5fa;
  }

  50% {
    background-color: #a855f7;
  }

  100% {
    background-color: #ec4899;
  }
}
```

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/2dF78lTNp4zOAMCtX5rNST/974d736f36e71157fe42df664eff2d15/_____2023-12-17_15.13.51.mov" controls></video>

## スクロールの方向

`scroll()` 関数の第 2 引数では、スクロールの方向を指定できます。指定できる値は以下の 4 種類です。

- `block`：文章が縦書きの場合は縦方向、横書きの場合は横方向（デフォルト）
- `inline`：文章が縦書きの場合は横方向、横書きの場合は縦方向
- `y`：縦方向
- `x`：横方向

次の例では、`scroll(self inline)` を指定して、横方向にスクロールに対するアニメーションを指定しています。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/4EfIsbJR9hB0zEStpQ8HQR/3009a9e1a3314946d964f42b9246f110/_____2023-12-17_15.27.53.mov" controls></video>

## ビューの進行状況タイムライン

ビューの進行状況タイムラインを使用することで、要素が画面内に入ったタイミングでフェードインするようなアニメーションを実装できます。要素が画面内に入ったかどうかの判定は、`IntersectionObserver` のものとよく似ています。

ビューの進行状況タイムラインを使用するには、[view()](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline/view) 関数を `animation-timeline` プロパティに指定します。

```css
.block {
  animation: fade-in linear both;
  animation-timeline: view();
  animation-range: cover 30% cover 50%;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
```

ビューの施行状況タイムラインのデフォルトの範囲（`cover`）は全範囲となっています。つまり、要素が画面内に入ったタイミングでアニメーションが開始され、要素が完全に画面外に出たタイミングでアニメーションが終了します。

このデフォルトの範囲を使用すると、要素が完全に画面外になるまで `opacity` の値が 1 にならないため、画面内に見えている間には要素がフェードインしきっていないように見えてしまいます。

[animation-range](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-range) プロパティを使用することで、アニメーションの範囲を指定できます。上記の例では、範囲が全範囲であることは変わらず、対象要素が画面内に入ったタイミングから 30% の位置でアニメーションが開始され、50% の位置でアニメーションが終了するようになります。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/5ErZdOP2N2nB82cx1aLw8I/3c99f0b49c8d82ddb2e61661e34c9f7f/_____2023-12-17_14.48.17.mov" controls></video>

完全なコード例は以下のレポジトリで確認できます。

https://github.com/azukiazusa1/scroll-driven-animation-example/blob/main/fade-in.html

`animation-range` プロパティには、`cover` 以外にも以下タイムラインの範囲を指定できます。

- `contain`
- `entry`
- `exit`
- `entry-crossing`
- `exit-crossing`

それぞれ範囲の意味を文章で説明するのは困難なのですが、幸いなことに以下のページで視覚的に確認ができます。

[View Timeline Ranges Visualizer](https://scroll-driven-animations.style/tools/view-timeline/ranges/#range-start-name=contain&range-start-percentage=0&range-end-name=cover&range-end-percentage=100&view-timeline-axis=block&view-timeline-inset=0&subject-size=smaller&subject-animation=reveal&interactivity=clicktodrag&show-areas=yes&show-fromto=yes&show-labels=yes)

### ビューの進行状況タイムラインの方向

ビューの進行状況タイムラインの方向は、`scroll()` 関数と同じように `view()` 関数の引数で指定できます。指定できる値は以下の 4 種類です。

- `block`：文章が縦書きの場合は縦方向、横書きの場合は横方向（デフォルト）
- `inline`：文章が縦書きの場合は横方向、横書きの場合は縦方向
- `y`：縦方向
- `x`：横方向

### 要素が画面内にあるとみなされる境界のオフセット

`view()` 関数の引数で、要素が画面内にあるとみなされる境界のオフセットを指定できます（`view()` 関数は引数の順番を問いません）。

この値は 1 つまたは 2 つの値で指定でき、1 つの値はスクロールポートの銭湯から内側へのオフセット、2 つの値はスクロールポートの端から内側へのオフセットを表します。

```css
view(10px 20px);
view(10px);

view(inset 10px 20px);

view(20% 30% block);
```

## まとめ

- 従来は時間経過によるドキュメントタイムラインのみでアニメーションを再生できたが、スクロールドリブンアニメーションを使うことでスクロールの進行状況やビューの進行状況に応じてアニメーションを再生できるようになった
- スクロールドリブンアニメーションは `animation-timeline` プロパティを使って指定する
- スクロールの進行状況タイムラインは `scroll()` 関数を使って指定する
- ビューの進行状況タイムラインは `view()` 関数を使って指定する

## 参考

- [CSSだけでスクロールアニメーションが作れる！？ 新技術Scroll-driven Animationsとは - ICS MEDIA](https://ics.media/entry/230718/)
- [CSS でスクロールドリブン アニメーションを使ってみる](https://codelabs.developers.google.com/scroll-driven-animations?hl=ja#0)
- [CSSだけで実現できるスクロール連動アニメーションの紹介](https://mosya.dev/blog/scroll-driven-animations)
