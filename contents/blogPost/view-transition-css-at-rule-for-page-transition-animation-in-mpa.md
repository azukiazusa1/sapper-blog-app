---
id: 27eFRM3ZBTsQ4GRWWBP3q
title: "MPA でページ遷移アニメーションを行う `@view-transition` CSS アットルール"
slug: "view-transition-css-at-rule-for-page-transition-animation-in-mpa"
about: "View Transition API はページを遷移する際に簡単にアニメーションを追加できる API です。SPA では `document.startViewTransition()` メソッドを DOM が変更される前に呼び出すことでページ遷移アニメーションを追加できます。MPA の場合 CSS アットルール `@view-transition` を使用できます。SPA の場合と異なり、JavaScript を使用せずに CSS だけでアニメーションを追加できる点が特徴です。"
createdAt: "2025-01-18T22:47+09:00"
updatedAt: "2025-01-18T22:47+09:00"
tags: ["CSS"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/lBFeoAMNCnBp1tX8St3D4/37a2bb61b643bdc7a827a1a561074262/sphinx_6644-768x585.png"
  title: "sphinx 6644-768x585"
selfAssessment:
  quizzes:
    - question: "MPA でページ遷移アニメーションを行うために必要な CSS はどれか？"
      answers:
        - text: "@view-transition { navigation: auto; }"
          correct: true
          explanation: null
        - text: "html { view-transition: auto; }"
          correct: false
          explanation: null
        - text: "::view-transition { navigation: auto; }"
          correct: false
          explanation: null
        - text: "html { navigation: auto; }"
          correct: false
          explanation: null
published: true
---
[View Transition API](https://developer.mozilla.org/ja/docs/Web/API/View_Transition_API) はページを遷移する際に簡単にアニメーションを追加できる API です。単一ページアプリケーション（SPA）においては `document.startViewTransition()` メソッドを DOM が変更される前に呼び出すことでページ遷移アニメーションを追加できます。

複数ページアプリケーション（MPA）においても同様のアニメーションを追加できるようにするために、CSS アットルール `@view-transition` を使用できます。SPA の場合と異なり、JavaScript を使用せずに CSS だけでアニメーションを追加できる点が特徴です。

b> cross-document-view-transitions

## ページ間の遷移アニメーションを有効にする

ページ空いた遷移アニメーションを有効にするには、`@view-transition` アットルールを使用します。`@view-transition` アットルールで `navigation` の値に `auto` を指定します。

?> ページ間のアニメーションが有効になるのは同一オリジンのページ間の遷移のみです。

```css
@view-transition {
  navigation: auto;
}
```

これにより [NavigationType](https://developer.mozilla.org/en-US/docs/Web/API/NavigateEvent/navigationType) のうち `traverse`, `push`, `replace` のいずれかに該当するナビゲーションが行われた際にページ遷移アニメーション発生します。`push`, `replace` の場合にはブラウザの UI のより発生したナビゲーションではなく、ユーザーの操作によって開始されたものである必要があります。

?> ページの読み込みに時間がかかりすぎる場合（Chrome では 4 秒以上）`TimeoutError` と ` `DOMException` が発生し、遷移アニメーションが無効になります。また一般にページ遷移アニメーションで十分な体験を提供するためにはページの読み込みが高速であることが必要でしょう。

実際に動作している動作を確認してみましょう。デフォルトではすべての要素に対してフェードイン/フェードアウトのアニメーションが適用されていることがわかります。

<video src="vhttps://videos.ctfassets.net/in6v9lxmm5c8/3OL7cGr2hmPR2IOrCPT7fc/02c596ecbc7dd98cba879b217a6a5786/_____2025-01-19_9.53.20.mov" controls></video>

## keyframes アニメーションの適用

[:view-transition-old](https://developer.mozilla.org/ja/docs/Web/CSS/::view-transition-old) と [:view-transition-new](https://developer.mozilla.org/ja/docs/Web/CSS/::view-transition-new) という擬似要素を使用して、遷移前後の要素に対して異なるアニメーションを適用できます。

`:view-transition-old` は遷移前の要素に対して、`:view-transition-new` は遷移後の要素に対して適用されます。それぞれに `@keyframes` を指定して定義したアニメーションを適用します。

```css
@keyframes slide-in {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slide-out {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}

@view-transition {
  navigation: auto;
}

::view-transition-old(root) {
  animation: slide-out 0.3s ease-out;
}

::view-transition-new(root) {
  animation: slide-in 0.3s ease-out;
}
```

実際に試してみると、スライドしながらページ遷移が行われることがわかります。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/7BUTf46DmA73hjyqKYHleG/215fb3535f85b04e5b1122a1e372454d/_____2025-01-19_9.59.14.mov" controls></video>

## ビューの遷移タイプを渡す

ページによってどのような遷移アニメーションを適用するか指定するために、`@view-transition` アットルールに `types` プロパティを追加します。

```css
@view-transition {
  navigation: auto;
  types: slide forward;
}
```

指定した遷移タイプは `:active-view-transition-type` 擬似クラスを使用してそれぞれの遷移タイプに対して異なるアニメーションを適用できます。

```css
html:active-view-transition-type(forward) {
  &::view-transition-old(root) {
    animation: slide-out-to-right 0.3s ease-out;
  }

  &::view-transition-new(root) {
    animation: slide-in-from-left 0.3s ease-out;
  }
}

html:active-view-transition-type(back) {
  &::view-transition-old(root) {
    animation: slide-out-to-left 0.3s ease-out;
  }

  &::view-transition-new(root) {
    animation: slide-in-from-right 0.3s ease-out;
  }
}
```

遷移先の URL に応じて動的に遷移タイプを変更したい場合には、`pageswap` と `pagereveal` イベントを使用して、`e.viewTransition.types` の値を操作します。

`pageswap` イベントはページの最後のフレームがレンダリングされた後に発生します。`pagereveal` イベントはページが初期化された後の最初のレンダリングが行われる前に発生します。

`e.viewTransition.types` は `Set` のようなオブジェクトであり、`.add()`, `.delete()`, `.clear()` などのメソッドを使用して値を操作できます。

```js
function determineTransitionType(from, entry) {
  // それぞれのページの遷移元と遷移先のページ番号を取得
  const fromPageNumber =
    from.url === undefined ? -1 : Number(from.url.split("page")[1]);
  const entryPageNumber =
    entry.url === null ? -1 : Number(entry.url.split("page")[1]);

  return fromPageNumber < entryPageNumber ? "back" : "forward";
}

// 新しいページが表示されるときに遷移タイプを決定する
document.addEventListener("pagereveal", (e) => {
  if (e.viewTransition) {
    const transitionType = determineTransitionType(
      navigation.activation.from,
      navigation.activation.entry,
    );
    e.viewTransition.types.add(transitionType);
  }
});
```

これによりページ番号が小さいページから大きなページへの遷移タイプは `forward`、大きなページから小さいページへの遷移タイプは `back` のように、リンク先によって異なる遷移アニメーションを適用できます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/Pk0TLZkQ9VqsP9kAH72Ni/05efc53daaee12735278e40136daa7da/_____2025-01-19_11.00.11.mov" controls></video>

## 特定の要素に遷移アニメーションを適用する

古いページと新しいページ両方に一意の `view-transition-name` が存在する場合、`view-transition-name` が一致する要素に対して遷移アニメーションが適用されます。もし同じページ内に複数の `view-transition-name` が存在する場合、`ViewTransition.ready` が拒否され遷移アニメーションが適用されません。

`view-transition-name` は CSS プロパティとして指定します。

```css
.image {
  view-transition-name: image;
}
```

この例では画像のがスケールしながらページ遷移が行われることがわかります。

## 特定の要素が出現するまで遷移アニメーションの開始を遅らせる

アニメーションを適用したい要素が JavaScript により動的に生成されるような場合には、遷移後の画面で要素が出現するまでアニメーションの開始を待つ必要があります。

`<head>` タグ内で以下の `meta` タグを追加することで、指定した `id` を持つ要素が出現するまでレンダリングをブロックできます。

```html
<link rel="expect" blocking="render" href="#block" />
```

## OS の設定に応じてアニメーションを無効化する

ユーザーが OS の「視差効果を減らす」などの設定を有効にしている場合、その設定を尊重してページ内のアニメーションを無効にすることが求められています。OS の設定によりアニメーションが無効にされているかどうかは `prefers-reduced-motion` メディアクエリを使用して判定できます。

もし `prefers-reduced-motion` メディアクエリによりアニメーションを無効にする場合、`animation` プロパティに `none` を指定してすべての View Transition アニメーションを無効にします。

```css
@media (prefers-reduced-motion) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation: none !important;
  }
}
```

## まとめ

- `@view-transition` アットルールを使用して MPA でページ遷移アニメーションを追加できる
- `:view-transition-old` と `:view-transition-new` を使用して遷移前後の要素に `@keyframes` アニメーションを適用できる
- `types` プロパティを使用して遷移タイプに応じて異なるアニメーションを適用できる
- `pageswap` と `pagereveal` イベントはそれぞれページ遷移前後に発生し、`viewTransition` プロパティを操作できる
- `view-transition-name` プロパティを使用して特定の要素に遷移アニメーションを適用できる
- `prefers-reduced-motion` メディアクエリを使用して OS の設定に応じてアニメーションを無効にできる

## 参考

- [CSS View Transitions Module Level 2](https://www.w3.org/TR/css-view-transitions-2/)
- [マルチページ アプリケーションのドキュメント間のビュー遷移  |  View Transitions  |  Chrome for Developers](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document?hl=ja)
- [ビュー遷移 API の使用 - Web API | MDN](https://developer.mozilla.org/ja/docs/Web/API/View_Transition_API/Using)
