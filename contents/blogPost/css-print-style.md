---
id: 2tqAKLOAHeVdKLRwmSnMPH
title: "CSS で印刷用のスタイルを設定できる"
slug: "css-print-style"
about: "大抵のブラウザでは Web ページを印刷することができます。 しかし Web ページをそのまま印刷しようとすると改ページがおかしくなったりレイアウトがおかしくなってしまうことがあるでしょう。そもそも Web ページはディスプレイで表示することを目的としているので印刷には不向きなものです。  とはいえ Web ページを印刷したいというニーズは少なからずあるとは思います、そのようば場合には `@media print` などのような印刷用の CSS を利用することで見た目を整えることができます"
createdAt: "2021-12-05T00:00+09:00"
updatedAt: "2021-12-05T00:00+09:00"
tags: ["CSS"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2JzEE4h7Xe5SHRr9iCPv4s/ac8cdc859f3af3a4c53cb7e5ba7af455/chounouryoku_woman.png"
  title: "pointer"
selfAssessment: null
published: true
---
大抵のブラウザでは Web ページを印刷できます。
しかし Web ページをそのまま印刷しようとすると改ページがおかしくなったりレイアウトがおかしくなってしまうことがあるでしょう。そもそも Web ページはディスプレイで表示することを目的としているので印刷には不向きなものです。

とはいえ Web ページを印刷したいというニーズは少なからずあることでしょう。そのような場合には `@media print` のような印刷用の CSS を利用することで見た目を整えることができます。

## @media print のサンプル

早速ですが `@media print` を使用した例を見てみましょう。下記のようにシンプルな Web サイトを用意しました。

![スクリーンショット 2021-12-04 23.52.46](//images.contentful.com/in6v9lxmm5c8/3Sr2gIGxqleugBNI49yphK/f876ce5bfe48b0cf200fa47961fea3af/____________________________2021-12-04_23.57.34.png)

コードは以下のとおりです。

```html
<!DOCTYPE html>
<html lang="ja">

<head>
  <title>CSS 印刷テスト</title>
  <style>
    @media print {
      .no-print {
        display: none;
      }
    }
  </style>
</head>

<body>
  <h1>CSS 印刷テスト</h1>
  <p>ここは常に表示されます。</p>
  <p class="no-print" style="color: red;">ここは印刷時に非表示になります。</p>
</body>

</html>
```

クラス `.no-print` はメディアクエリ `print` の中で指定されています。このスタイルはプリント時のみに適用されます。赤文字で表示されている箇所にはクラス `.no-print` を指定しているので印刷のプレビュー時だけこの文字は表示されなくなります。

実際に表示を確認してみましょう。Google Chrome において印刷プレビューを表示するには［ファイル］>[印刷]をクリックするか、次のキーボード ショートカットを使用します。
- Windows と Linux の場合： `Ctrl+P`
- Mac の場合： `⌘+P`

[Chrome から印刷する](https://support.google.com/chrome/answer/1069693?hl=ja&co=GENIE.Platform%3DDesktop)

![スクリーンショット 2021-12-05 0.04.15](//images.contentful.com/in6v9lxmm5c8/5ODrmAfsMVWKiMIvb8pE0a/71b1d33c22c879936fe88ad5695b15eb/____________________________2021-12-05_0.04.15.png)

確かに、印刷プレビュー画面では赤文字は表示されていません。

### その他の指定方法

大抵の場合には `@mdia print` で指定するのでこと足りると思いますがその他の指定方法でも印刷時にのみに適応するスタイルを指定できます。

#### link/style media="print"

`<link>` で CSS ファイルを読み込みときや `<style>` タグ内に CSS を記述する際に `media` 属性を指定できます。

```html
<style media="print">
  .no-print {
    display: none;
  }
</style>
```

#### @import print

`@import` を使用して CSS ファイルを読み込む際に `print` を付与すると読み込んだ CSS ファイルは印刷時にのみ適用するようになります。

- `index.html`

```html
<head>
  <title>CSS 印刷テスト</title>
  <link rel="stylesheet" href="style.css">
</head>
```

- `style.css`

```css
@import "./print.css" print;
```

- `print.css`

```css
.no-print {
  display: none;
}
```

## @page で用紙のサイズを指定する

[@page](https://developer.mozilla.org/ja/docs/Web/CSS/@page) は CSS のアットルールで文書を印刷するときに一部の CSS プロパティを変更するために使用します。特に [size](https://developer.mozilla.org/ja/docs/Web/CSS/@page/size) は `@page` 内のみで使用できるプロパティで `A4` ・ `B5` などの絶対的なサイズや `4in 6in` のような指定方法が可能です。

`size` プロパティは実験的な機能であり `Firefox` や `safari` などのブラウザでは使用できないことに注意してください。

![スクリーンショット 2021-12-05 0.12.41](//images.contentful.com/in6v9lxmm5c8/7a5Tgi8zDT3q78Q0Ls9gRt/4a766aad05281d801cb3ba7752977b38/____________________________2021-12-05_0.12.41.png)

https://developer.mozilla.org/ja/docs/Web/CSS/@page/size#browser_compatibility

実際に Google Chrome で `size` プロパティを指定してみるとたしかにプレビュー時のサイズが異なっていることがわかります。また `size` プロパティを指定すると印刷時の詳細設定でユーザーが用紙のサイズを選択できなくなっています。

![スクリーンショット 2021-12-05 0.15.13](//images.contentful.com/in6v9lxmm5c8/H1Mk26Mgf9DYZnqLWXNkV/a91f1a41815d84b04804d64f594e755c/____________________________2021-12-05_0.15.13.png)

## 印刷時の改ページを制御する

以下の CSS プロパティを使用すると印刷時の改ページを制御できます。

- [break-before](https://developer.mozilla.org/ja/docs/Web/CSS/break-before) 指定した要素の直前の改ページを制御
- [break-inside](https://developer.mozilla.org/ja/docs/Web/CSS/break-inside) 指定した要素の途中の改ページを制御
- [break-after](https://developer.mozilla.org/ja/docs/Web/CSS/break-after) 指定した要素の後の改ページを制御

`break-before`,`break-inside` には区切りを強制する値（`always`・`left`・`right`・`page`・`column`・`region`)または区切りを防止する値（`avoid`・`avoid-page`・`avoid-region`・`avoid-column`）を指定できます。`break-inside` には区切りを防止する値のみを指定できます。

また同時に複数のプロパティが指定された場合には以下の優先度のとおりに適用されます。

```
break-before > break-inside > break-after
```

このプロパティを使用した例を見てみましょう。`<h1>` 要素に `bread-before:page` を指定して各見出しごとに改ページが挿入されるようにします。

```html
<!DOCTYPE html>
<html lang="ja">

<head>
  <title>CSS 印刷テスト</title>
  <style>
    h1 {
      break-before: page;
    }
  </style>
</head>

<body>
  <h1>見出し１</h1>
  <p>ここに本文が入ります。</p>
  <h1>見出し２</h1>
  <p>ここに本文が入ります。</p>
  <h1>見出し３</h1>
  <p>ここに本文が入ります。</p>
  <h1>見出し４</h1>
  <p>ここに本文が入ります。</p>
</body>

</html>
```

通常の表示時には見た目に変化はありません。

![スクリーンショット 2021-12-05 10.07.20](//images.contentful.com/in6v9lxmm5c8/2frdJtnhhflyLVrgnHzKk6/97d35d72e88eb6a9bff7b2423b3e9791/____________________________2021-12-05_10.07.20.png)

印刷プレビューで表示すると改ページされていることがわかります。

![スクリーンショット 2021-12-05 10.11.06](//images.contentful.com/in6v9lxmm5c8/5H4hoHD9CAjTfIZ7ECRStF/04a8d804dc374b6153b4a5e960c0d6c0/____________________________2021-12-05_10.11.06.png)

![スクリーンショット 2021-12-05 10.11.25](//images.contentful.com/in6v9lxmm5c8/jFnALqCXWaLvAPbe0uoPZ/1ce5b92b3a2b3d5d6e3d972f87b507b9/____________________________2021-12-05_10.11.25.png)

## JavaScript から印刷プレビューを呼びだす

ブラウザの既定の方法から印刷をするのは慣れていない人にとっては少々分かりにくい操作です。「このページを印刷する」といったボタンを設置してボタンをクリックしたときに印刷ができるようにしたいところです。

そのような場合には [window.print()](https://developer.mozilla.org/ja/docs/Web/API/Window/print) メソッドを使用します。このメソッドを呼び出すと印刷ダイアログを表示します。

```html
<body>
  <h1>CSS 印刷テスト</h1>
  <p>ここは常に表示されます。</p>
  <button id="print" class="no-print">このページを印刷する</button>

  <script>
    document.querySelector('#print').addEventListener('click', () => {
      window.print();
    });
  </script>
</body>
```

## プリント画面のデバッグ

開発時に印刷ダイアログを毎回開いて表示を確認するのは非常に面倒です。ブラウザの開発者ツールを使用すれば印刷画面をエミュレートして表示できます。

まずは開発者ツールを開いて「⋮」>「More tools」>「Rendering」を選択します。

![スクリーンショット 2021-12-05 10.37.23](//images.contentful.com/in6v9lxmm5c8/5eQF3Ix2svG7Do0DgIvtRj/c8b150a26698fb4ff3b595df63297bf3/____________________________2021-12-05_10.37.23.png)

「Emulate CSS media type」を探して「print」を選択します。

![スクリーンショット 2021-12-05 10.39.22](//images.contentful.com/in6v9lxmm5c8/2vlsFz3ifj28IN9GHW109E/c7d32624ca31920921be44b59546756c/____________________________2021-12-05_10.39.22.png)

すると印刷プレビューで表示したときと同じく `.no-print` クラスを付与した要素が
非表示となります。

![スクリーンショット 2021-12-05 10.41.24](//images.contentful.com/in6v9lxmm5c8/cUzDP9ATLKEGtYYIt9kvE/776b38158f7c0c322ec1a7148bf3a492/____________________________2021-12-05_10.41.24.png)
