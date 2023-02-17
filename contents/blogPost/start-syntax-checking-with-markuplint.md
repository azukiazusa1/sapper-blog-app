---
title: "markuplint で構文チェックを始めよう"
about: "HTML の構文チェックを実施するには適切なツールを導入するのがよいでしょう。この記事では markuplint と呼ばれる HTML の静的解析ツールを紹介します。markuplint は JSX(React),Vue,Svlete のようなテンプレートエンジンにも対応しています。"
createdAt: "2022-04-24T00:00+09:00"
updatedAt: "2022-04-24T00:00+09:00"
tags: ["HTML"]
published: true
---
ブラウザが HTML を解釈する方法はその他のプログラミング言語と比べてはるかに寛容です。つまりはブラウザは HTML 内に構文エラーを発見しても大抵の場合は問題なくページに表示されます。ブラウザには、誤って書かれたマークアップを解釈する方法を決定するための組み込みのルールがあるためです。

例として以下のコード例を確認してみましょう。`<ul>` タグは仕様でその子要素には0個以上の `<li>` タグまたは script supporting elements (`<script>` と `<template>`)のみが許可されています。従って、`<ul>` タグの子要素に `<a>` タグを配置している以下のコードは構文エラーとなります。

```html
<ul>
  <a href="/home">Home</a>
  <a href="/about">About</a>
  <a href="/blog">Blog</a>
  <a href="#top">Top</a>
</ul>
```

しかしながら、上記コードをブラウザで表示してもブラウザはエラーを報告することなく問題なく表示します。

![スクリーンショット 2022-04-25 21.42.28](//images.ctfassets.net/in6v9lxmm5c8/4X9Vt8Cyz5MdnrhT0LctWG/155896be56ab32dc351d189b5d5c5542/____________________________2022-04-25_21.42.28.png)

このことは良い点と悪い点があります。良い点としては構文エラーをに対して寛容になることにより幅広い人々が Web を利用して情報を発信することができます。これは Web の基本理念である普遍性に沿っていると言えるでしょう。問題点としては Web サイトの作成者が構文エラーに気が付きづらいということです。HTML の構文エラーを放置しているとブラウザによっては意図しないレンダリングとなったり、正しい意味を解釈できない可能性があります。

実際にエラーの報告されない　HTML をデバッグするのはひどく難しいです。VS Code のような IDE を利用していても構文エラーをうまく検出することはできません。

HTML の構文チェックを実施するには適切なツールを導入するのがよいでしょう。この記事では markuplint と呼ばれる HTML の静的解析ツールを紹介します。markuplint は JSX(React),Vue,Svlete のようなテンプレートエンジンにも対応しています。

https://markuplint.dev/

## HTMLHint を始める

HTMLHint は npm でインストールすることができます。

```sh
$ npm install --save-dev markuplint
```

もし VS Code を使用している場合には HTMLHint の拡張機能をインストールすると良いでしょう。

https://marketplace.visualstudio.com/items?itemName=yusukehirao.vscode-markuplint

続いて、以下コマンドで `.marklintntrc` という名前の設定ファイルをプロジェクトルートに配置します。

```sh
$ npx markuplint --init
```

`package.json` に静的解析を実行する npm-scripts を追加しましょう。

```json
{
  "scripts": {
    "html:lint": "markuplint index.html"
  }
}
```

それでは実際にコマンドを実行してみましょう。

```sh
$ npm run html:lint

> html-check@1.0.0 html:lint
> markuplint index.html

<markuplint> error: HTMLの仕様において、要素「ul」の内容は妥当ではありません (permitted-contents) /work/html-check/index.html:12:3
  11: <body>
  12: ••<ul>
  13: ••••<a•href="/home">Home</a>
<markuplint> error: HTMLの仕様において、要素「a」の内容は妥当ではありません (permitted-contents) /work/html-check/index.html:13:5
  12: ••<ul>
  13: ••••<a href="/home">Home</a>
  14: ••••<a•href="/about">About</a>
<markuplint> error: HTMLの仕様において、要素「a」の内容は妥当ではありません (permitted-contents) /work/html-check/index.html:14:5
  13: ••••<a•href="/home">Home</a>
  14: ••••<a href="/about">About</a>
  15: ••••<a•href="/blog">Blog</a>
<markuplint> error: HTMLの仕様において、要素「a」の内容は妥当ではありません (permitted-contents) /work/html-check/index.html:15:5
  14: ••••<a•href="/about">About</a>
  15: ••••<a href="/blog">Blog</a>
  16: ••••<a•href="#top">Top</a>
<markuplint> error: HTMLの仕様において、要素「a」の内容は妥当ではありません (permitted-contents) /work/html-check/index.html:16:5
  15: ••••<a•href="/blog">Blog</a>
  16: ••••<a href="#top">Top</a>
  17: ••</ul>
```

複数のエラーが報告されました。エラーの内容と行数が表示されています。エラーの対象となったルールは全て [Permitted contents](https://markuplint.dev/rules/permitted-contents) によるものでこれは子要素が許可されていない要素またはテキストノードを持つ場合に警告を出します。

コードを次のように修正しましょう。

```
<ul>
  <li>
    <a href="/home">Home</a>
  </li>
  <li>
    <a href="/about">About</a>
  </li>
  <li>
    <a href="/blog">Blog</a>
  </li>
  <li>
    <a href="#top">Top</a>
  </li>
</ul>
```

再度コマンドを実行するとエラーが全て解消されていることが確認できます。

```sh
$ npm run html:lint

<markuplint> passed /work/html-check/index.html
```

## 特定の状況でのルールの無効化

Lint ツールをを使用している時特定の行のみでルールを無効化したいような状況が存在します。例えば ESLint であれば `// eslint-disable-next-line` というコメントで次の行の ESLint のルールを無効にすることができます。

markuplint ではセレクタによるルールを上書きして無効化することができます。例として以下のような HTML があるとします。

```html
<table class="foo">
  <td>1</td>
  <td>2</td>
</table>
```

`<table>` の子要素に `<td>` 要素を直接配置することはできないのでこれは Permitted contents ルールによってエラーが検出されます。

```sh
$ npm run html:lint

<markuplint> error: HTMLの仕様において、要素「table」の内容は妥当ではありません (permitted-contents) /work/html-check/index.html:14:3
  13: 
  14: ••<table class="foo">
  15: ••••<td>1</td>
```

例として不適切ではあるのですが、このエラーを無効化したいと考えたとしましょう。`.marklintntrc` ファイルに [nodeRules](https://markuplint.dev/configuration/#properties/node-rules-&-child-node-rules/node-rules) を追加します。

```json
{
  "nodeRules": [
    {
      "selector": ".foo",
      "rules": {
        "permitted-contents": false
      }
    }
  ]
}
```

`nodeRules` を使用することで特定要素のみに対してルールを上書きすることができます。`selector` には CSS のセレクターの記法を利用することができます。上記例では `foo` というクラスが付与されているクラスに対してルールを上書きします。`rules` において `marmitted-contents` を `false` に設定しているので、リントを実行してもエラーが報告されないようになります。

```sh
$ npm run html:lint

<markuplint> passed /work/html-check/index.html
```

`nodeRules` に似た設定に [childNodeRules](https://markuplint.dev/configuration/#properties/node-rules-&-child-node-rules/child-node-rules) が存在します。これはルールを上書きするのは `nodeRules` と同様ですが、`selector` で指定した要素の子要素に対してもルールを上書きします。`inheritance` プロパティを `true` にすることで子孫要素まで範囲を広げることができます。

## カスタム要素のエラーを検出する

React や Vue のようなフレームワークを使用している場合独自のコンポーネントを作成して利用します。ここで問題になるのはカスタム要素を利用している場合には HTML の構文エラーが明らかな場合にもエラーを検出できないというところです。以下の例を見てみましょう。

```js
const MyList = ({ children }) => {
  return <ul>{children}</ul>;
};

const MyListItem = ({ children }) => {
  return <li>{children}</li>;
};

const App = () => {
  return (
    <div>
      <MyList>
        <div>
          <MyListItem>1</MyListItem>
          <MyListItem>2</MyListItem>
          <MyListItem>3</MyListItem>
        </div>
      </MyList>
    </div>
  );
};
```

`MyList` コンポーネントは `<ul>` タグをラップしたコンポーネントで子要素には `<li>` タグまたは `<li>` タグをルートに使用しているコンポーネントを配置するべきです。ここでは `MyList` の直下に `<div>` を配置してしまっており、最終的なレンダリング結果では `<ul>` タグの子要素に `<div>` タグが配置されてしまうことがわかっているのですがこれを検出することができません。

このような場合には `.marklintntrc` ファイルを修正して対応することができます。`rules` プロパティの `permitted-contents` を次のように修正します。

```json
{
  "rules": {
    "permitted-contents": [
      {
        "tag": "MyList",
        "contents": [
          {
            "zeroOrMore": "MyListItem"
          }
        ]
      }
    ],
  }
}
```

`tag` でどのタグをルールの対象とするか選択します。`contents` には配列形式で `tag` で指定した要素に配置できる要素のルールを記述します。上記例では `<MyList>` タグの子要素には 0個以上の `<MyListItem>` タグが必要だと設定しています。

ルールとして設定できるキーワードは以下のとおりです。

- `require`：常にひとつ
- `optional`：0または1
- `oneOrMore`：1個以上
- `zeroOrMore`：0個以上
- `choice`：配列で指定するルールの中からどれか一つ
- `interleave`：配列で指定するルールを順序関係なく適用

リントを実行すると以下のようにエラーが検出されます。

```sh
$ npm run html:lint

<markuplint> error: 要素「MyList」の内容は妥当ではありません (permitted-contents) /work/html-check/src/components/App.jsx:12:7
  11: ••••<div>
  12: ••••••<MyList>
  13: ••••••••<div>
```

## アクセシビリティ

markuplint はアクセシビリティ上の問題を検知することができます。例えば [required-h1](https://markuplint.dev/rules/required-h1) はページ内に必ず `<h1>` タグが存在するように警告します。

[wai-aria](https://markuplint.dev/rules/wai-aria) は誤った `role` 属性や `aria-*` 属性の使用を検出します。誤った `role` の使用例として以下のようなコードがあげられます。

```html
<nav role="navigation">
  <ul>
    <li role="button">list 1</li>
  </ul>
</nav>
```

リントを実行すると以下のように表示されます。

```sh
$ npm run html:lint

<markuplint> error: ロール「navigation」は要素「nav」の暗黙のロールです (wai-aria) /work/html-check/index.html:13:8
  12: ••<h1>test</h1>
  13: ••<nav•role="navigation">
  14: ••••<ul>
<markuplint> error: ARIA in HTMLの仕様において、ロール「button」を要素「li」に上書きすることはできません (wai-aria) /work/html-check/index.html:15:11
  14: ••••<ul>
  15: ••••••<li•role="button">list•1</li>
  16: ••••</ul>
```

まず始めに `<nav>` タグに `navigation` ロールをを付与しています。これは一見正しいように思えますが、`<nav>` タグは暗黙のロールとしてすでに `navigation` ロールを持っているため冗長な指定となっています。このように暗黙的にロールを持っている属性をあえて指定することは冗長なので避けるべきです。

2つ目に `<li>` タグに `button` ロールを付与していますが、実は要素によって許可できる要素が決まっている場合があります。`<li>` タグには以下のロールのみが許可されています。

- menuitem
- menuitemcheckbox
- menuitemradio
- option
- none
- presentation
- radio
- separator
- tab
- treeitem

https://developer.mozilla.org/ja/docs/Web/HTML/Element/li

上記のコードは以下のとおりに修正できます。

```html
  <nav>
    <ul>
      <li><button>list 1</button></li>
    </ul>
  </nav>
```

その他興味深いルールに [use-list](https://markuplint.dev/rules/use-list) があります。これはい以下のように先頭に `•` を付与して文字列を列挙している場合には `<li>` タグを使うように警告をします。

```html
<div>
  <div>•Alice</div>
  <div>•Bob</div>
  <div>•charlie</div>
</div>
```

```sh
<markuplint> warning: Use li element (use-list) /work/html-check/index.html:14:10
  13: ••<div>
  14: ••••<div>•Alice</div>
  15: ••••<div>•Bob</div>
<markuplint> warning: Use li element (use-list) /work/html-check/index.html:15:10
  14: ••••<div>•Alice</div>
  15: ••••<div>•Bob</div>
  16: ••••<div>•charlie</div>
<markuplint> warning: Use li element (use-list) /work/html-check/index.html:16:10
  15: ••••<div>•Bob</div>
  16: ••••<div>•charlie</div>
  17: ••</div>
```

## 感想

markuplint は厳格に HTML 構文をチェックしてくれたり、カスタム要素などにもルールを追加可能であるなどの特徴を持ちます。

markuplint には playground もあるので普段 HTML の構文にあまり気を使っていなかったような場合には、一度試してみるとよいでしょう。

https://playground.markuplint.dev/
