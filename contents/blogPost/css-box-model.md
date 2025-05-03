---
id: 5vkcOSxIoSSWFgws8nFeoV
title: "ボックスモデル"
slug: "css-box-model"
about: "CSS にはボックスという概念があります。ブラウザは文書をレイアウトする際に、それぞれの要素を CSS のボックスモデルに基づいた長方形の箱（ボックス）として表現します。つまりは、HTMLの個々の要素はすべてボックスにからできており、それらのボックスが組み合わさることによってページ全体が表現されます。  ボックスは CSS において最も基本的な概念であり、ボックスを理解することは CSS でレイアウトを構成したり要素同士を揃えるための手助けとなることでしょう。"
createdAt: "2021-10-31T00:00+09:00"
updatedAt: "2021-10-31T00:00+09:00"
tags: [""]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2lwyC5xUSMgwbu56Pnt7tW/f64addf2d52d9adfebaa7e57ca9f6f18/____________________________2021-10-31_20.31.05.png"
  title: "スクリーンショット 2021-10-31 20.31.05"
audio: null
selfAssessment: null
published: true
---
CSS にはボックスという概念があります。ブラウザは文書をレイアウトする際に、それぞれの要素を
CSS のボックスモデルに基づいた長方形の箱（ボックス）として表現します。つまりは、HTML の個々の要素はすべてボックスにからできており、それらのボックスが組み合わさることによってページ全体が表現されます。

ボックスは CSS においてもっとも基本的な概念であり、ボックスを理解することは CSS でレイアウトを構成したり要素同士を揃えるための手助けとなることでしょう。

## ボックスの構成要素

ボックスは以下の 4 つの要素から構成されています。

- Content box
- Padding box
- Border box
- Margin box

![box-model](//images.contentful.com/in6v9lxmm5c8/6cksyqDsIJIdvpgqKG51mb/d273d870ec941c8f511c82579faf312f/ECuEOJEGnudhXW5JEFih.svg)

https://web.dev/learn/css/box-model/#the-areas-of-the-box-model

### Content box

`Content box` は文字や画像などのコンテンツが表示される領域です。ボックスモデルの既定では [width](https://developer.mozilla.org/ja/docs/Web/CSS/width) や [height](https://developer.mozilla.org/ja/docs/Learn/CSS/Building_blocks/The_box_model) はコンテンツ領域のみに適用され、ボックスサイズを変更します。

### Padding box

`Paddig box` はコンテンツの周囲に表示される空白の領域であり `border` より内側に表示されます。この領域は [padding](https://developer.mozilla.org/ja/docs/Web/CSS/padding) プロパティによってサイズが制御されます。

### Border box

`Border box` はパディング領域を取り囲み、コンテンツの境界を表します。[boder](https://developer.mozilla.org/ja/docs/Web/CSS/border) プロパティによって要素の色やサイズを変更できます。

### Margin box

`margin box` はボックスのもっとも外側の領域で、主に他の要素との間の空白を表現します。この領域は [margin](https://developer.mozilla.org/ja/docs/Web/CSS/margin) プロパティによって制御されます。

### Dev Tools のボックスモデル

実際の要素がどのようなボックスで構成されているのかは dev tools から確認できます。`Elements` タブから要素を選択した後 `Computed` タブを選択します。

![スクリーンショット 2021-10-31 18.37.04](//images.contentful.com/in6v9lxmm5c8/1bHJSlaKZloKZjBLRJ1hit/8969c5f9f23fd77581a5939cfae0f33b/____________________________2021-10-31_18.37.04.png)

`Computed` タブは実施の要素に対していくつの `margin` や `padding` が適用されているか知ることができるので非常に役に立ちます。さらに dev tools 上のボックスモデルにカーソルを合わせると実際の要素に対してもハイライトが表示されます。

![devtools-boxmodel](//images.contentful.com/in6v9lxmm5c8/4NQb7FvGTyHmbLSUoamJKV/3497b20fb0f87c029de6ddbd06c2b80f/devtools-boxmodel.gif)

## ボックスの width はどう決まる？

ボックスの基本的な構造を確認したところで実際にボックスを配置してみましょう。以下のように横ならびにボックスを配置します。

![スクリーンショット 2021-10-31 19.44.13](//images.contentful.com/in6v9lxmm5c8/6V6TZZQ6SsLBQHvGOXI8sq/f75c40767a6a5aaf199a5f4e0bdf69eb/____________________________2021-10-31_19.44.13.png)

コードは以下のとおりです。

- index.html

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="style.css">
  <title>Document</title>
</head>

<body>
  <div class="container">
    <div class="box1">I'm box1</div>
    <div class="box2">I'm box2</div>
  </div>
</body>

</html>
```

- style.css

```css
.container {
  max-width: 1080px;
  margin: 0 auto;
}

.box1 {
  float: left;
  width: 70%;
  padding: 20px;
  border: 1px solid #808080;
  background-color: aqua;
}

.box2 {
  float: left;
  width: 30%;
  padding: 20px;
  border: 1px solid #808080;
  background-color: lightgoldenrodyellow;
}
```

`.box1` には `width: 70%` を設定し `.box2` には `width: 30%` を設定しているので、2 つの要素を合わせてぴったり `100%` になるはずです。しかし、実際に表示されるレイアウトは以下のように想定とはことなる表示となってしまいます。

![スクリーンショット 2021-10-31 19.52.49](//images.contentful.com/in6v9lxmm5c8/2kdIsgVReCfrijGAfoEB1x/f25b46187a7a0bf16eeeedd72cb9f0b0/____________________________2021-10-31_19.52.49.png)

2 つ目のボックスが 1 つ目のボックスの下側に配置されてしまいました。なぜこのようなことが起きてしまったのでしょう。結論としては 2 つのボックスの長さの合計が `100%` を超えてしまったためです。

`Contents box` の説明で述べたとおり、ボックスモデルの既定では [width](https://developer.mozilla.org/ja/docs/Web/CSS/width) や [height](https://developer.mozilla.org/ja/docs/Learn/CSS/Building_blocks/The_box_model) はコンテンツ領域のみに適用されます。つまりは `70%` の `width` に対して padding・border・margin のサイズを加えた値が実際の要素の長さとなるわけです。

今回の例ではそれぞれのボックスのサイズは実際には以下のとおりになります。

|    | width     | paddibg     | border     | 合計     |
| ---------- | ---------- | ---------- | ---------- | ---------- |
| box1       | 1080px * 70% = 756px       | 20px + 20px      | 1px + 1px      | 798px       |
| box2       |  1080px * 30% = 324px       | 20px + 20px       | 1px + 1px       | 366px       |

2 つのボックスのサイズの合計は `798px + 366px = 1164px` で確かに親要素の `1080px` を超えてしまっています。

ですからボックスを 1 行に横並びさせたい場合には `width` を設定するときに `padding` と `border` の長さを引く必要があります。

```diff
 .box1 {
   float: left;
-  width: 70%;
+  width: calc(70% - 40px - 2px);
   padding: 20px;
   border: 1px solid #808080;
   background-color: aqua;
 }

 .box2 {
   float: left;
-  width: 30%;
+  width: calc(30% - 40px - 2px);
   padding: 20px;
   border: 1px solid #808080;
   background-color: lightgoldenrodyellow;
 }
 ```

 ### box-sizing プロパティ

 上記の方法で問題は解決したもののなんだか納得がいかない方法です。普通に考えたら見た目通りにボーダーまでを含めて要素のサイズ計算してほしいはずです。実際のサイズを取得するために毎回 `width` から `padding` と `border` のサイズを引かなければならないのはからり不便です。

 この挙動は `box-sizing` プロパティにより変更できます。デフォルトの `box-sizing` のプロパティには `content-box` が設定されてます。これはボックスモデルの既定通りコンテンツ領域のみに `widht` と `height` が設定されます。

 `box-sizing: border-box` はこの既定の挙動を変更し `border` と `padding` も含めて `width` および `height` が設定されるようになります。

 ```css
.box1 {
  box-sizing: border-box;
  float: left;
  width: 70%;
  padding: 20px;
  border: 1px solid #808080;
  background-color: aqua;
}
```

 `box-sizing: border-box` を付与した際に dev tools からコンテンツ領域のサイズの計算方法が変更されていることが確認できます。

- box-sizing: content-box

![スクリーンショット 2021-10-31 20.27.09](//images.contentful.com/in6v9lxmm5c8/3iiqXbd2ByCN9IWiewPVtx/77d8d9c7cd746fa3dd4b5e27c5161505/____________________________2021-10-31_20.27.09.png)

- box-sizing: border-box

![スクリーンショット 2021-10-31 20.31.05](//images.contentful.com/in6v9lxmm5c8/2lwyC5xUSMgwbu56Pnt7tW/f64addf2d52d9adfebaa7e57ca9f6f18/____________________________2021-10-31_20.31.05.png)

また `box-sizing: border-box` は多くの開発者にとって好ましい挙動であり一般的な選択になっています。実際に　Bootstrap や Vuetify などの UI フレームワークの多くは `box-sizing: border-box` をデフォルトの挙動としています。

実際に自分ですべての要素に対して `box-sizing: border-box` を適用したい場合には以下のようなコードが使われます。`<html>` 要素で `box-sizing: border-box;` を設定しその他のすべての要素において継承します。

```css
html {
  box-sizing: border-box;
}
*, *::before, *::after {
  box-sizing: inherit;
}
```

## margin の相殺

まずは次のコードをご覧ください。単純にヘッダー要素とメインコンテンツ要素を配置しただけのものです。

```html
<body>
  <header class="header">I'm a header</header>
  <main class="main">
    <p>I'm a main contents</p>
  </main>
</body>
```

```css
html {
  box-sizing: border-box;
}
*,
*::before,
*::after {
  box-sizing: inherit;
}

body {
  background-color: #f6f6f4;
}

.header {
  padding: 10px;
  margin-bottom: 30px;
  background-color: white;
}

.main {
  padding: 20px;
  margin-top: 20px;
  background-color: white;
}
```

ここで問題です。ヘッダー要素とメインコンテンツ要素の間は何 px 間が空いているでしょうか？

答えは `.header` の `margin-bottom: 30px` と `.main` の `margin-top: 20px;` を足した 50px… ではなく 30px です。

これは一般に **マージンの相殺** と呼ばれる挙動でありブロックの先頭と末尾のマージンは、それぞれのマージンのもっとも大きい寸法（または等しい場合はいずれか 1 つ）の単一のマージンに結合されます。

実際に dev tools で確認すると、よりマージンのサイズの大きい `.header` 要素の 30px だけ適用されていることが確認できます。

![スクリーンショット 2021-10-31 21.14.29](//images.contentful.com/in6v9lxmm5c8/2Ki86xCsxPJtiCGxW2rSsN/d0eae579b705978e4ffd5589d8390f43/____________________________2021-10-31_21.14.29.png)

![スクリーンショット 2021-10-31 21.17.15](//images.contentful.com/in6v9lxmm5c8/1AGyvSF52aFxYEMXv2uuu8/7b68559f1b50d6e33dc82223bacbf050/____________________________2021-10-31_21.17.15.png)

マージンの相殺は以下の条件に当てはまるとき発生します。

- 隣接兄弟要素
- 垂直マージンのみ横方向のマージンの相殺は起こりません

またマージンの相殺には例外条件もあり、例えば `float` プロパティや `position: abosolute` が設定されている場合にはマージンの相殺は発生しません。

## まとめ

- ボックスモデルは `contents`・`padding`・`border`・`margin` の 4 つの要素で構成される
- 要素のサイズを予測可能にするために常にすべての要素に対して `box-sizing: border-box` を設定する
- 縦に並んだ要素のマージンはより大きなサイズに 1 つにまとめられる
- dev tools はすごい

## 参考

- [ボックスモデル](https://developer.mozilla.org/ja/docs/Learn/CSS/Building_blocks/The_box_model)
- [box-sizing](https://developer.mozilla.org/ja/docs/Web/CSS/box-sizing)
- [Box Model](https://web.dev/learn/css/box-model/)
- [マージンの相殺](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing)
- [CSSにおけるマージンの相殺を徹底解説](https://coliss.com/articles/build-websites/operation/css/rules-of-margin-collapse.html)
