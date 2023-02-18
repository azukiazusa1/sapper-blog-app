---
id: 3Mtv7V8TMzj1oRjnQV4zd5
title: "イベントのバブリングは DOM ツリーではなく React ツリーに従う"
slug: "event-bubbling-follows-the-react-tree-not-the-dom-tree"
about: "イベントのバブリングとは、ある要素で発生したイベントがその親要素まで伝播することです。React でポータルを使用した場合、DOM ツリー状親子関係でなかったとしても、React ツリー上親子関係であればイベントがバブリングされます。"
createdAt: "2022-10-09T00:00+09:00"
updatedAt: "2022-10-09T00:00+09:00"
tags: ["React"]
published: true
---
## イベントのバブリングとは

ブラウザ上でイベントが発生したとき、キャプチャリングとバブリングの2つの段階に分けて動作します。キャプチャリングではまず最上位の親要素（通常 `<html>`）にイベントハンドラが登録されているか調べて、あればそれを実行します。次に内側の要素に写って同様のことを繰り返し、実際にイベントが発生した要素が到達するまで繰り返します。バブリングの段階ではキャプチャリングの逆のことが起こります。実際にイベントが発生した要素にイベントハンドラがあるか調べ、あればそれを実行し、これを最上位の親要素に到達するまで繰り返します。

![eventflow](//images.ctfassets.net/in6v9lxmm5c8/7CpmmYB78ZdY5a0FCymdgu/e0f32a1e69458862ec48d22022629699/eventflow.svg)

https://www.w3.org/TR/DOM-Level-3-Events/#event-flow

キャプチャリングは実際のコードの中ではほとんど使われません。`onclick` や `addEventListener` で追加されたイベントハンドラはキャプチャリングについて何も知らないからです。キャプチャリングフェーズでイベントをキャッチするには `addEventListener` の第3引数に `true` を渡す必要があります。

よく問題に挙げられるのはバブリングフェーズです。具体例を見てみましょう。

<iframe height="500" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/vYjVMJL?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/vYjVMJL">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

上記の例では `<div>` の子要素に `<button>` 要素が存在し、それぞれのイベントに `onclick` イベントハンドラが登録されてみます。`<button>` をクリックすると、`<button>` に登録されたアラートが表示された後に、`<div>` に登録されたアラートが表示されるかと思います。これはバブリングにより `<button>` 要素のイベントハンドラが実行された後、`<button>` の親要素までさかのぼり `<div>` のイベントハンドラが実行されたためです。

## React におけるイベントバブリング

もちろん React においてイベントを登録している場合にも同様にバブリングが発生します。下記の例で確認してみてください。

<iframe height="300" style="width: 100%;" src="https://stackblitz.com/edit/react-ts-dkt66b?embed=1&file=App.tsx"></iframe>

`<button>` 要素は `Button` コンポーネントとして切り出されていますが、DOM の階層は変わらないため変わらずバブリングにより `<button>` のアラートと `<div>` のアラートが表示されます。

## ポータルを使用した場合のイベントのバブリング

さて、ここまでで DOM の階層によりバブリングがされることがわかったかと思いますが、[ポータル](https://ja.reactjs.org/docs/portals.html#event-bubbling-through-portals) を使用した場合には少々特殊な挙動となります。

ポータルとは親コンポーネントの DOM 階層外にある DOM ノードに対して子コンポーネントをレンダリングする仕組みです。これは例えばモーダルのように `z-index` を気にする必要があるコンポーネントを要素の重なるを意識することなく使用するために使われることがあります。

先程の React のイベントバブリングの例をポータルを使用して作成した場合以下の通りになります。

<iframe height="500" style="width: 100%;" src="https://stackblitz.com/edit/react-ts-wwtren?embed=1&file=App.tsx"></iframe>

ここで `<button>` をクリックしたとき、どのような挙動になるでしょうか？前回の例とは異なり `<button>` 要素はポータルにより別の DOM 階層に配置されているので、もはや`<button>` 要素の親には `onClick` イベントハンドラを登録した `<div>` 要素は存在しません。見た目からもわかりますが、描画される DOM の構造は次のようになっています。

```html
<body>
  <span id="root">
    <div></div>
  </span>
  <span id="modal">
    <button>Button</button>
  </span>
</body>
```

このことからイベントのバブリングは発生しないように思えます。しかし、実際には `<button>` 要素をクリックしたときバブリングにより `<button>` のアラートと `<div>` のアラートの両方が表示されます。

これはポータルは DOM ツリーのどこにも存在できますが、他のあら言うる点では通常の React の子要素と変わらず振る舞うためです。つまり、ポータルの内部で発火したイベントは DOM ツリー上の親要素でなくとも React ツリー上の親要素であれば伝播されるということです。

このことは一見直感に反するようにも思えますが、ポータルに本質的に依存することのない、より柔軟な抽象化が可能であること示していると説明されています。つまり、`<Modal>` の実装がポータルを使っているかどうか関係なく、親コンポーネントからは `<Modal>` コンポーネントのイベントを捕捉できるということです。

