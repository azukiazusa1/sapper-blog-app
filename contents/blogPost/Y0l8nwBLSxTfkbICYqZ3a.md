---
id: Y0l8nwBLSxTfkbICYqZ3a
title: "Canvas 内に直接 HTML を描画できる HTML in Canvas API について"
slug: "html-in-canvas-api"
about: "HTML in Canvas API は WICG で提案されている API で、Canvas 内に直接 HTML を描画できるようにするものです。現在の `<canvas>` 要素にはリッチテキストや HTML コンテンツを描画する標準的な方法が存在しないという課題があります。この記事では HTML in Canvas の使用方法やユースケースについて説明します。"
createdAt: "2026-04-10T19:17+09:00"
updatedAt: "2026-04-10T19:17+09:00"
tags: ["Web API", "canvas"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2XFLFPVE4flo0iwpx3MCmS/c32d6999b93000d4a7cbbb44e10a2cec/chess_14477-768x768.png"
  title: "チェスの駒のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "HTML in Canvas API が従来の `fillText()` による描画よりも優れている点として、記事の説明に最も合っているものはどれですか？"
      answers:
        - text: "Canvas 上のテキストを自動的にベクター形式へ変換し、印刷品質を上げられる"
          correct: false
          explanation: "記事では印刷品質やベクター変換には触れておらず、主な論点はレイアウトやアクセシビリティです。"
        - text: "HTML のレイアウト結果を Canvas に転写できるため、複雑な表現をしつつテキスト選択や支援技術との両立を目指せる"
          correct: true
          explanation: "記事の中心的な利点です。HTML のレイアウトエンジンを使いながら Canvas 上で表現でき、アクセシビリティ上の利点も期待できます。"
        - text: "どのブラウザでも追加設定なしで `<canvas>` の既定機能として使える"
          correct: false
          explanation: "記事では WICG 提案段階の実験的 API であり、Chrome Canary のフラグが必要だと説明されています。"
        - text: "Canvas API を使わずに CSS だけで同じ描画結果を得られるようになる"
          correct: false
          explanation: "HTML in Canvas API は Canvas への描画を行う API であり、CSS のみで代替するものではありません。"
    - question: "HTML in Canvas API を使うとき、canvas 要素に追加して描画対象の HTML を定義する属性はどれですか？"
      answers:
        - text: "`paintsubtree`"
          correct: false
          explanation: "記事で紹介されている属性名ではありません。`paint` はイベント名として登場します。"
        - text: "`renderhtml`"
          correct: false
          explanation: "HTML in Canvas API にそのような属性は登場しません。"
        - text: "`layoutsubtree`"
          correct: true
          explanation: "記事では、canvas 要素に `layoutsubtree` 属性を追加して描画したい HTML を定義すると説明されています。"
        - text: "`drawElementImage`"
          correct: false
          explanation: "これは属性ではなく、子要素を描画するためのメソッド名です。"

published: true
---

HTML in Canvas API は WICG で提案されている実験的な API で、Canvas 内に直接 HTML を描画できるようにするものです。現在の `<canvas>` 要素にはリッチテキストや HTML コンテンツを描画する標準的な方法が存在しないという課題があります。`fillText()` メソッドはテキストを描画するための基本的な機能を提供していますが、レイアウトやスタイリングの制御が限られており、開発者は複雑なテキスト描画を実現するためにサードパーティのライブラリや独自の実装に頼る必要がありました。その結果、アクセシビリティ上の問題やパフォーマンスの低下が生じることがありました。

参考までに、`fillText()` を使用してテキストを描画する例は以下のようになります。

```javascript
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.font = "16px sans-serif";
ctx.fillStyle = "#333";
// 第2引数でx座標、第3引数でy座標を指定
// 実用的にテキストを描画するためには、テキストの幅を計測して改行処理などを実装する必要がある
ctx.fillText("こんにちは", 10, 30);
```

このように `fillText()` を使用してテキストを描画する場合は改行されないため、一部の文字を太字にするといったインラインスタイルを適用できない、テキストの折り返しやレイアウトの制御を自前で実装する必要があります。またアクセシビリティの観点からも問題があります。アクセシビリティツリーにテキストが含まれないため、スクリーンリーダーなどの支援技術がテキストを認識できません。さらに、テキストの選択やコピーもできないため、ユーザーエクスペリエンスが損なわれる可能性があります。

HTML in Canvas API を使用すると、ブラウザのレイアウトエンジンでレイアウト・描画した HTML を canvas に画像のように転写することで、これらの問題を解決できます。ユースケースとして凡例やラベルのようなグラフのテキスト、ゲーム内の UI テキスト、インタラクティブなコンテンツなどが挙げられます。

この記事では、HTML in Canvas API をどのように使用するのかについて説明します。

:::note
HTML in Canvas API は WICG の提案段階にある実験的な API です。現時点では Chrome Canary の `chrome://flags/#canvas-draw-element` フラグを有効にすることで利用できます。
:::

## HTML in Canvas API の使用方法

HTML in Canvas API は以下の 3 つの要素で構成されています。

- `layoutsubtree` 属性
- `drawElementImage()` メソッド
- `paint` イベント

canvas 要素に `layoutsubtree` 属性を追加することで、canvas 内に描画したい HTML を定義できます。この段階ではまだ canvas 内には描画されません。

```html
<canvas id="canvas" width="400" height="300" layoutsubtree>
  <div id="content">
    <h2>こんにちは</h2>
    <p>Canvas 内の HTML です</p>

    <input type="text" placeholder="入力もできます" />
  </div>
</canvas>
```

次に、`drawElementImage()` メソッドを呼び出すことで、canvas の子要素を描画できます。使用方法は `drawImage()` メソッドと似ています。戻り値の `DOMMatrix` オブジェクトを使用して、描画された HTML の位置やサイズを取得できます。この戻り値を使用して、描画された HTML と DOM の位置が一致するように transform を適用できます。これはヒットテストやアクセシビリティ上の問題を解決するために重要です。

```javascript
const canvas = document.getElementById("canvas");
const content = document.getElementById("content");
const ctx = canvas.getContext("2d");

// content 要素を座標 (100, 0) に描画
const transform = ctx.drawElementImage(content, 100, 0);
// DOM の位置が描画された位置と一致するように transform を適用
content.style.transform = transform.toString();
```

上記のコードを実行すると、以下のように HTML が描画されることが確認できます。もちろん `<input>` 要素に入力するといったインタラクションも可能です。

![](https://images.ctfassets.net/in6v9lxmm5c8/UIah4qCytG43jtYrAgANc/881045270fb52b12b046258705814c71/image.png)

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/dPpgVRX?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/dPpgVRX">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

canvas の子要素のレンダリングが変更されたとき、`paint` イベントが発火します。このイベントを購読することにより、canvas 内の HTML が変更されたときに再描画できます。例えば、以下のようにボタンをクリックした時に canvas 内のテキストを変更するコードがあるとしましょう。

```html
<canvas id="canvas" width="400" height="300" layoutsubtree>
  <div id="content">
    <h2>こんにちは</h2>
    <p>Canvas 内の HTML です</p>
  </div>
</canvas>

<button id="button">テキストを変更</button>

<script>
  const content = document.getElementById("content");
  const button = document.getElementById("button");
  button.addEventListener("click", () => {
    content.querySelector("h2").textContent = "こんにちは、世界！";
  });
</script>
```

このままでは、canvas は自動で DOM 再描画と同期されないため、canvas 内のテキストが変更されても変更が反映されません。`paint` イベントを購読して、canvas 内の HTML が変更されたときに再描画するようにしましょう。`event.changedElements` には変更された要素が渡されるため、これを `drawElementImage()` メソッドに渡します。

```javascript
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.addEventListener("paint", (event) => {
  ctx.reset();

  ctx.drawElementImage(event.changedElements[0], 100, 0);
});
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/vEXVejm?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/vEXVejm">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

毎フレーム描画する必要があるゲームのようなユースケースでは、`requestPaint()` を使用して、次のフレームで `paint` イベントを発火させることができます。これにより、canvas 内の HTML が変更されたときに毎フレーム再描画できます。

```javascript
let t = 0;
function gameLoop() {
  t += 0.01;
  canvas.requestPaint();
  requestAnimationFrame(gameLoop);
}
```

## WebGL との組み合わせ

WebGL コンテキストを使用している場合、3D 空間内に HTML を描画できます。WebGL コンテキストを使用している場合は `drawElementImage()` の代わりに `texElementImage2D()` メソッドを使用します。このメソッドの使用方法は `texImage2D()` メソッドと似ています。`texElementImage2D()` メソッドは `drawElementImage()` と異なり、描画された HTML の位置やサイズを取得するための戻り値はありません。そのため、描画された HTML と DOM の位置を一致させるためには、別途 `canvas.getElementTransform()` メソッドを使用して transform を取得する必要があります。

```javascript
const canvas = document.getElementById("c");
const el = document.getElementById("el");
const gl = canvas.getContext("webgl");

canvas.onpaint = () => {
  gl.texElementImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    el,
  );

  // シェーダーと同じ回転を DOMMatrix で再現
  const drawTransform = new DOMMatrix([
    // ...
  ]);

  const cssTransform = canvas.getElementTransform(el, drawTransform);
  el.style.transform = cssTransform.toString();
};
```

<video controls src="https://videos.ctfassets.net/in6v9lxmm5c8/1ZWGnXom8yXlM4uZxzKLOV/0e0e9a553418b5b9760579f174b1196a/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2026-04-10_20.50.28.mov"></video>

## 主なユースケース

HTML in Canvas を使用したケースをいくつか紹介します。ここで紹介する例は Codex に作ってもらったものです。

1 つ目のサンプルは HTML コンテンツ全体に霧のようなエフェクトをかける例です。マウスホバーしたときに、その円の内側に HTML を再描画することで、霧の中から HTML が見えるような表現をしています。

<video controls src="https://videos.ctfassets.net/in6v9lxmm5c8/1saP1SNYQQKBwkyV4I69yS/4c7587e041293fbe07d181a41cc71717/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2026-04-10_21.55.17.mov"></video>

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/JoRmOQv?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/JoRmOQv">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

2 つ目のサンプルはライトモードとダークモードの切り替え時に波のようなエフェクトをかける例です。中身の UI は通常の HTML として持ちつつ、アニメーション効果のみを canvas に逃がすことで、複雑なアニメーションも実装できます。

<video controls src="https://videos.ctfassets.net/in6v9lxmm5c8/5OXlOT6aaoFWtVG48PvmPL/6fc9f0bfaa05d9f908fe7f4f0cb0d7fe/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2026-04-10_22.00.06.mov"></video>

<iframe height="300" style="width: 100%;" scrolling="no" title="Theme Wave Wipe" src="https://codepen.io/azukiazusa1/embed/jEMeYNr?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/jEMeYNr">
  Theme Wave Wipe</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

最後のサンプルは、canvas 上に実装されたゲームの例です。ゲームのロジック自体は canvas 内で完結させつつ、名前の入力フォームを HTML で実装しています。Canvas だけで入力フォームを実装すると、日本語入力やフォーカス制御、アクセシビリティ対応まで個別に作り込む必要がありますが、HTML in Canvas を使えばゲーム画面の描画は Canvas に任せつつ、入力 UI は HTML の標準機能をそのまま利用できます。

<video controls src="https://videos.ctfassets.net/in6v9lxmm5c8/4NEEMXapeU1J23gfcEQChl/6604102a4739a1e942429b60149dd90f/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2026-04-10_22.03.23.mov"></video>

<iframe height="300" style="width: 100%;" scrolling="no" title="canvas game" src="https://codepen.io/azukiazusa1/embed/GgjYygb?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/GgjYygb">
  canvas game</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## まとめ

- HTML in Canvas API を使用すると、Canvas 内に直接 HTML を描画できるようになる
- これにより、Canvas 内にテキストを配置するためにサードパーティのライブラリや独自の実装に頼る必要がなくなり、アクセシビリティの向上やパフォーマンスの改善が期待できる
- HTML in Canvas API は `layoutsubtree` 属性、`drawElementImage()` メソッド、`paint` イベントの 3 つの要素で構成されている
- WebGL コンテキストを使用している場合は、`texElementImage2D()` メソッドを使用して、3D 空間内に HTML を描画できる
- HTML in Canvas API を使用することで、HTML コンテンツ全体にエフェクトをかけられる
- ライトモードとダークモードの切り替え時に波のようなエフェクトをかけたり、canvas 上に実装されたゲームの UI を HTML で実装したりできる

## 参考

- [WICG/html-in-canvas](https://github.com/WICG/html-in-canvas)
