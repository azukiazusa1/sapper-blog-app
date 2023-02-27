---
id: 6yMQgLEn1ir5MgJE6B96Dv
title: "Web アプリケーションエンジニアのためのウェブアクセシビリティの基礎"
slug: "web-accessibility-basics-every-web-application-engineer-needs-to-know"
about: "この記事は、ウェブアプリケーションエンジニアとして仕事をされている方を対象に書かれています。日々のウェブフロントエンドの開発の中で意識しておきたい基礎的な内容をメインに記載しています。"
createdAt: "2023-02-19T00:00+09:00"
updatedAt: "2023-02-19T00:00+09:00"
tags: ["アクセシビリティ"]
published: true
---
この記事は、ウェブアプリケーションエンジニアとして仕事をされているほうを対象に書かれています。日々のウェブフロントエンドの開発の中で意識しておきたい基礎的な内容をメインに記載しています。

そのため、ここでは以下に上げるような内容については取り上げておりません。

- 色や形などのデザイン面での観点や
- - JIS 規格・[WCAG (Web Content Accessiblity Guidelines) 2.1](https://www.w3.org/TR/WCAG21/) の達成基準
- アクセシビリティのテスト

アクセシビリティの対応はハードルの高いものだと感じられることもあるでしょう。確かに、WCAG 2.1 の達成基準の中には対応が難しいものがあるのも事実です。しかし、基本的なアクセシビリティの多くは特別な対応を行わずとも、正しい HTML を書くことで達成できる事項です。

導入してアクセシビリティにまつわるよくある誤解といったアクセシビリティの概要に触れ、その後実践的にアクセシビリティに考慮した開発を行う方法について見ていきます。

## アクセシビリティにまつわるよくある誤解

### 1. アクセシビリティは、障害者の方や高齢者を対象にしている

アクセシビリティと聞くと、障害者の方や高齢者の方に向けた対応というイメージを持たれている人が多いのではないでしょうか？

しかし、アクセシビリティとは特定の対象の範囲を持つものではなく、万人のためのものです。「誰でも」「どんな状況でも」ウェブで提供されているサービスを利用できることを目指します。

例えば、以下に上げるような状況も、アクセシビリティの対象となります。

- スキーで怪我して利き腕がうまく使えない
- マウスの充電が切れてしまった
- 電車内で動画を見ようとしたが、イヤホンを忘れた
- ギガが減って通信制限に引っかかった

一時的に利き腕の怪我であったり、充電が切れてしまったような状況では Web アプリケーションを操作するためにマウスを使用できません。このような場合には、代替手段としてキーボードのみを使用して操作することになるでしょう。

電車内でイヤホンを忘れた、という状況では音声による情報を得ることができません。このような状況において動画のキャプションが提供されていると、音声の代わりにテキストで動画のコンテンツを理解できます。

ギガが減って通信制限に引っかかっていたり、出先で通信環境の悪い場所にいる場合、すべてのウェブコンテンツを取得できないかもしれません。例えば画像が読み込めないような状況であっても、代替テキストが表示されていればコンテンツの意味を伝えることができます。

このように、一時的にハンディキャップを抱えるという状況は誰にとっても起こりうるでしょう。アクセシビリティの対象となる範囲は多岐にわたります。

#### ユーザビリティとアクセシビリティの関係

ユーザビリティとアクセシビリティはよく似た意味の言葉です。この 2 つの言葉の関係・違いは何でしょうか？端的に述べると、アクセシビリティはユーザビリティの土台となるものだと考えることができます。

特定の状況における使いやすさをユーザビリティ、使える度合いや状況の幅広さをアクセシビリティと定義できます。

![ユーザビリティとアクセシビリティの関係を表した図。ユーザビリティは特定のターゲット層に対する矢印の高さで使いやすさを表していて、アクセシビリティは一定の使いやすさの高さですべてのターゲット層をカバーしている](//images.ctfassets.net/in6v9lxmm5c8/X90KqBDYPJSR7bjTLE62R/39328fe3d9a630d11ca3992aae41569f/deee59913dec40a99387b377d5f3f767.png)
間嶋沙知、 読みにくい「困った！」を解決するデザイン、 マイナビ出版、 2022, P23。

ユーザビリティはまず土台となるアクセシビリティが確保されていて使える状態がある前提を元に、さらにどれだけ使いやすいか、と考えることができます。そもそもユーザーが情報を取得できないといったアクセシビリティの土台がない状態ではユーザビリティの問題を発見できません。

### 2. アクセシビリティ対応のために、特別な対応が必要

2 つ目のよくある誤解として、アクセシビリティ対応のために、特別な対応が必要であるという点です。例えば、文字サイズ・色合いの変更や音声読み上げといった機能は自治体や公共機関のウェブサイトでよく見かけます。

![藤沢市のウェブサイトのヘッダー。文字サイズ・色合い変更ボタンと音声読み上げボタンがある。](//images.ctfassets.net/in6v9lxmm5c8/56CBenEDs0jZwwgWlxdBtE/bee9597c3b9b9a335bdfc2784a193e71/e42d0d86fb8b45bfb6d11667821254ae.png)

このような機能はアクセシビリティに対応するために必須の機能だと思われがちですが、実はそうではありません。[みんなの公共サイト 運用ガイドライン - 総務省](https://www.soumu.go.jp/main_content/000439213.pdf)には次のように記載されています。

> 注意点！
<!-- textlint-disable -->
ホームページなどにおいて、音声読み上げ、文字拡大、文字色変更などの支援機能を提供する事例がありますが、これだけでは、ウェブアクセシビリティに対応しているとは言えません。
<!-- textlint-disable -->
利用者は、多くの場合、音声読み上げソフトや文字拡大ソフトなど、自分がホームページなどを利用するために必要な支援機能を、自身のパソコンなどにインストールし必要な設定を行ったうえで、その支援機能を活用してさまざまなホームページなどにアクセスしています。つまり、ホームページなどの提供者に求められるアクセシビリティ対応とは、ホームページなどにおいてそのような支援機能を提供することではなく、ホームページなどの個々のページを JIS X 8341-3:2016 の要件に則り作成し提供することにより、利用者がそのページを閲覧できるようにすることです。

文字の拡大機能や音声読み上げが必要なユーザーの多くは、OS やブラウザが提供している機能を利用して設定を行い、支援機能を活用してさまざまなサイトにアクセスしています。

例を見てみましょう。大半のブラウザにはフォントサイズを変更する機能が備わっています。例えば Google Chrome では、設定 > デザイン > フォントサイズからフォントサイズを変更できます。

![Google Chrome の設定画面。左のサイドメニューではデザインが選択されていた、フォントサイズの設定が選択されている。フォントサイズの設定には極小・小・中（推奨）・大・極大がある。](//images.ctfassets.net/in6v9lxmm5c8/4sjxKxfaAqEt1z11CKzF72/f998842703f6ca33d2485907efd242fc/____________________________2023-02-19_19.25.16.png)

また主要な OS には標準のスクリーンリーダが備えられています。

- Windows: ナレーター
- Mac OS X、iOS：VoiceOver

そのため、このようなユーザー補助機能をサイトに設置することは、アクセシビリティ対応のための必須の機能とは言えません。

ウェブアクセシビリティのためには特別な機能を提供するのではなく、ウェブサイトを正しく実装して、支援技術がサイトの情報を正しく読み取れるように実装することが大切になります。

## できるところから始める

初めは完璧な対応を目指すのではなく、できるところから少しずつ改善を進めていくのがおすすめです。現状〇ができないからダメ、といった減点方式で考えるのではなく、改善をするたびにできることが増えていく、という加点方式で進めていくのがいいでしょう。

アクセシビリティの改善を始める第一歩として、普段の開発の最中にマウスを使わずキーボードだけで操作できるか試してみるのがおすすめです。

## 正しい HTML を書く

ここからアプリケーションエンジニアとしてどのようにアクセシビリティを改善できるか、実践的な話に入ります。

アクセシビリティの向上で必要なことは、正しい HTML を書くということです。

Web は開発思想として、基本的にすべての人が利用できるように設計されています。

> The power of the Web is in its universality.
Access by everyone regardless of disability is an essential aspect.
Tim Berners-Lee, W3C Director and inventor of the World Wide Web

[Accessibility - W3C](https://www.w3.org/standards/webdesign/accessibility)

ですから私たち開発者が正しい実装を行うことで、特別な対応をすることなくアクセシビリティを担保できます。

### ボタンの実装

具体例として、ボタンの実装を見てみましょう。例として以下のように `<div>` タグを使用してマークアップされていても、CSS でスタイリングすることにより視覚的にボタンだと認知できます。

```html
<div class="btn btn-primary" onclick="tweet()">ツイート</div>
```

![ツイートボタン](//images.ctfassets.net/in6v9lxmm5c8/3jQTpmK252F2aLcdtyAic5/12f58331349aebbf1fe3b0c51ed93c0a/c58a985e46244b88b46ba8cdb2fb6119.png)

ですが、このように `<div>` タグをボタンとして扱う書き方はアクセシビリティ上好ましくありません。ボタンが本来保つ機能が失われているためです。

HTML には標準でボタンであることを表す `<button>` 要素があります。以下のように、正しく `<button>` タグを使うことが好ましいです。

```html
<button class="btn btn-primary" onclick="tweet()">ツイート</button>
```

`<button>` タグを使用することで、以下のようにボタン本来が持つ機能を提供できます。

- `<button>` 同士の間を Tab キーで移動できる
- マウスでクリックする代わりに、スペースキー・エンターキーで `<button>` を押すことができる
- 支援技術を使用するユーザーがボタンであることを認知できる

このように、ネイティブの HTML 要素にはデフォルトでアクセシビリティの機能が備わっています。適切な HTML を適切な場所で選択して使用することが大切になります。

### セマンティックな HTML
`<button>` のようなインタラクティブではない要素であっても、意味のある HTML 要素を使うことで支援技術を使用するユーザーが良い体験を得ることができます。このように HTML で正しく意味を伝えることはセマンティック HTML と呼ばれていたりします。

例えば、次の例を見てください。これはダメな例なのですが、ほぼすべての要素に `<div>` タグを使っています。

```html
<div class="header">
  <div>バナー</div>
</div>

<div class="navigation">
  <ul>
    <li><a href="/">トップ</a></li>
  </ul>
<div>

<div class="main">
  <div class="article">
    <div>記事のタイトル<div>
    <div>記事の内容<div>
  </div>
</div>

<div class="footer">
  <div>©Copyright 2022</div>
</div>
```

`<div>` は特に意味を持たない要素です。このようにウェブページが意味を持たない構造になっていると、機械的にどこが重要なコンテンツか判断できません。

私たちは普段 Web ページを見るときには、ヘッダーやナビゲーションをスキップしたり、見出しをななめ読みしたりしています。しかし、ウェブページの構造が意味を持たないと、支援技術を利用するユーザーはどこからどこまでがヘッダーで、ということが理解できませんし、文字の大きさで見出しであることもわかりません。

次にセマンティックな HTML の例を見てみましょう。最初の要素には `<header>` タグを使ってここがヘッダーであることを表しています。ナビゲーションには `<nav>` タグを、メインコンテンツには `<main>` タグを、フッターには `<footer>` タグをそれぞれ使用して意味をもたせています。また見出しとなるべき要素それぞれには `<h1>`,`<h2>` タグを使用しています。

```html
<header>
  <h1>バナー</h1>
</header>

<nav>
  <ul>
    <li><a href="/">ホーム</a></li>
  </ul>
</nav>

<main>
  <article>
    <h2>記事のタイトル</h2>
    <p>記事の内容</p>
  </article>
</main>

<footer>
  <small>©Copyright 2022</small>
</footer>
```

このようなセマンティックな要素を使用すると、スクリーンリーダーを使用するユーザーに道しるべを提供できます。実際に MacOS に内蔵されているスクリーンリーダーである VoiceOver を使って試してみましょう。

CapsLock キー + U をクリックすることで、ページ内に存在するランドマークの一覧を表示できます。ランドマークにはヘッダー、ナビゲーション、メイン（本文）、フッターといった要素があります。ここでは矢印キーを使用することでランドマーク間を移動でき、本文（メインのコンテンツ）にスキップすることが可能です。

![VoiceOver を使用してランドマーク間を移動している様子](//images.ctfassets.net/in6v9lxmm5c8/5TUaahKJNemtjdfcqtOje2/715d26d40f29633a5dec6f4ca5af25d1/voice-over-nav.gif)

ランドマークだけでなく、見出しやリンクを元に移動することも可能です。

### 仕様を遵守する

最後に、HTML の仕様を遵守しようという話です。HTML の仕様は [HTML Living Standard](https://html.spec.whatwg.org/multipage/) という文書で定義されています。HTML は基本的におおらかなので、仕様違反しているコードでもよしなに表示してくれます。しかし、正しく意味を表示してくれない可能性があるのでアクセシビリティが損なわれるおそれがあります。

例えば、`<a>` 要素の子要素にはインタラクティブな要素を入れることができません。

```html
<a href="https://example.com">
  <button>ここをクリック!</button>
</a>
```

このコードのアクセシビリティの問題点として、キーボードで操作している際に同じ要素に 2 回フォーカスされてしまうという点があります。

HTML の仕様について少し眺めてみましょう。例えば、HTML の各要素には許可されている内容、親要素、属性などが定められています。

- `<a>` の子要素には `<button>` や `<input>` のようなインタラクティブな要素を入れることはできない
- `<ul>` 要素の子要素には 0 個以上の `<li>`,`<script>`,`<template>` のみが許可されている。
- `href` 属性は `<a>` 要素のみつけることが許可されている属性。
- `<font>` や `<marquee>` タグのような非推奨な要素や属性は使ってはいけない

とはいえ、HTML は仕様に違反していてもエラーを出さないようになっていますので、普段の開発で仕様に違反しているかどうか確かめながらコードを書くのはなかなか大変です。仕様に従った HTML を書いているかどうか調べるためには、[Markuplint](https://markuplint.dev/) を使って検査するのがおすすめです。

Markuplint は HTML 標準、WAI-ARIA などの仕様を考慮して適合チェックを行うことができます。

## UI コンポーネントのアクセシビリティ

続いて、UI コンポーネント単位でのアクセシビリティについて考えてみましょう。ボタン、入力フォーム、タブといったパーツの単位です。

UI のパーツをデザインシステムとして提供することで、アクセシブルな詳細の実装を利用者が知ることなく使うことができます。例として、ボタンを使う際には React コンポーネントの `<Button>` として提供することで、誤って `<div>` タグを使用してしまうといったミスを防ぐことができます。

ボタンのような単純なコンポーネントではカプセル化する恩恵が少ないと感じますが、複雑な UI を実装する際に大切です。HTML にネイティブに存在しない複雑な　UI 要素は WAI ARIA 仕様にしたがって適切な実装する必要があるためです。

### アクセシビリティツリー

まずはじめに、HTML に含まれるアクセシビリティの情報がどのように支援技術に利用されているかという話から入ります。

ブラウザはまずマークアップを DOM ツリーに変換します。その後 DOM ツリーに基づいて[アクセシビリティツリー](https://developer.mozilla.org/ja/docs/Glossary/Accessibility_tree)が生成されます。アクセシビリティツリーは読み上げソフトなどの支援技術のために、アクセシビリティ API から使用されます。

アクセシビリティツリーには以下の 4 つの要素が含まれています。 
- role
- name
- description
- state

role はボタン、リンク、入力フォームなどの UI の種類を表して言います。name は文字通りの名前です。名前を持っていないと、同じロールの要素同士を識別できません。例えばフォームには大抵複数の入力項目があります。この入力フォームに名前がついていないと、どの項目を入力するべきなのか判断できないことになってしまいます。

description は UI の詳細な説明です。多くのスクリーンリーダーはロールと名前を読み上げた後、しばらくすると description が読み上げられます。

state は UI の状態を表します。例えば入力フォームであれば、入力不可となっている、バリデーションエラーが発生している、入力が必須であるといったさまざまな状態を持つことがあります。

例として入力フォームの HTML を見てみましょう。どのようなアクセシビリティツリーが生成されるのか見てみましょう。

```html
<label for="name">名前</label>
<input id="name" name="name" aria-describedby="rule" required />
<p id="rule">名前は3文字以上で入力してください</p>
```

- role：`<input>` 要素は暗黙で `textbox` というロールを持っているため、`textbox` ロールとなる
- name：`<input>` 要素の name は多くの場合紐付けられている `<label>` 要素によって付けられている。ここでは「名前」となる
- description：`aria-describedby` 属性により紐付けられている要素の内容が使われる。`aria-describedby` は紐付ける要素を ID で指定する。`id="rule"` 要素の中身のテキストである「名前は 3 文字以上で入力してください」が description となる
- state：この入力フォームには `requred` 属性が付与されている。この属性により、必須であるという情報が伝えられる。

アクセシビリティツリーはブラウザのデベロッパーツールから確認できます。Element タブで要素を選択した後、Accessibility タブを選択することで確認できます。

![前述した　HTML 要素のアクセシビリティツリーを Google Chrome のデベロッパーツールで表示している](//images.ctfassets.net/in6v9lxmm5c8/3cYlHjbqSKmAj7V0HSEho7/47be0e011d018e1fd8ca15e5f6c9d16f/____________________________2023-02-19_20.33.18.png)

また「Enable full-page accessibility tree」にチェックを入れることでページ全体のアクセシビリティツリーを確認することもできます。

![Google Chrome のデベロッパーツールでページ全体のアクセシビリティツリーを表示している](//images.ctfassets.net/in6v9lxmm5c8/38WpFHtLv3heCcoq2Kz9A1/6749b5e380ee5a454be2919b60f1d008/____________________________2023-02-19_20.39.42.png)

　実際に VoiceOver を使用してアクセシビリティツリーの情報がどのようにスクリーンリーダーに読み上げられるのか確認してみましょう。

 ![VoiceOver で入力フォームを選択している様子。「名前、必須、テキストを編集」と読み上げられている](//images.ctfassets.net/in6v9lxmm5c8/K4dvJsZ4wY0WJNhF6LY5J/9f54fc60c94595a92cbc485cf31a46cf/42866816c5834e8bae1253d4b7aad719.png)

名前（name）、必須（state）、テキストを編集（role）と順番に読み上げられていることがわかります。

![VoiceOver で入力フォームを選択している様子。「名前は3文字以上で入力してください」と読み上げられている](//images.ctfassets.net/in6v9lxmm5c8/4zMbAIAss4hRD7k4oaC3PO/8b4e586205de690255d17c0c63774ec5/c21c53048b2e469b919418efdd11c750.png)

その後「名前は 3 文字以上で入力してください」と description の情報が読み上げられています。

### 複雑な UI コンポーネント

さきほどの例で上げたようなボタンや入力フォームなどの HTML 要素は、もともと備わってる基本的な要素を使用することで適切なアクセシビリティ情報が得られます。しかし、既存の HTML に存在しない複雑な UI コンポーネントを使うような場面では、アクセシビリティツリーに十分に情報を提供できなせん。

例えば、タブやトグルスイッチのような UI は今日の Web では広く使われていますが、対応する HTML 要素は存在しません。またセレクトボックスのような要素は CSS でのカスタマイズが難しいので独自の実装がされることが多いかと思います。

このような複雑な UI を使用する場合には、[WAI-ARIA](https://www.w3.org/TR/wai-aria-1.1/) の仕様に従って適切な設定が必要です。

#### WAI-ARIA の機能

WAI-ARIA はロール、プロパティ、ステートの 3 の機能から構成されています。　アクセシビリティツリーオブジェクトに含まれているものとよく似ています。

- ロール：要素の種類定義する。 `role="button"`,`role="tab"`,`role="search"` のように `role` 属性で指定する。元の要素によって許可されているロールが決められているので注意が必要。
- プロパティ：要素の性質を定義する。`aria-label` で要素に名前を付けたり、`aria-haspopup` でポップアップ要素を起動する要素であることを示す。
- ステート：要素の現在の状態を示す。`aria-disabled="true"` は現在入力フォームが無効であることを伝える。`aria-selected="true"` は現在選択されている要素であることを示す。

プロパティとステートの違いは、ライフサイクルを通じて変化するかどうかです。例えば要素に付けられた名前が変化することは基本的にありません。一方で、サブミットボタンが無効かどうかはフォームの入力状態によって変化するかと思います。

ステートが変更される状況では、JavaScript を用いて適切に属性を変更する必要があります。

またプロパティやステートのような `aria-*` 属性はロールによって設定できるもの、できないものが決まっています。このような属性は闇雲に使用せずに、よく仕様を確認してから使用するようにしてください。

#### WAI-ARIA を使用するうえでの注意点

WAI-ARIA を使用するうえで注意すべき点が存在します。WAI-ARIA は本当に必要な場合のみ使用してください。

可能な限りネイティブの HTML 機能を使用するべき。例えば、ボタンを実装する際に `role="button"` 支援技術によって「ボタン」と読み上げられるようになります。

```html
 <div role="button" onclick="tweet">ツイートする</div>
```

ですが、`<button>` タグは暗黙のロールとして `role="button"` を持っていますので、素直に `<button>` タグを使うべきです。

```html
<button onclick="tweet">ツイートする</button>
```

なぜなら、ロールを宣言しただけではそのロールに対応する必要な機能は与えられないからです。ロールは単に役割を示すだけであり、必要な機能は開発者の責任によって実装する必要があります。ネイティブの `<button>` 要素を使用すればはじめから必要な機能が備わっています。

ロールごとにどのようなステート、プロパティ、キーボード操作を実装しなければいけないかは WAI-ARIA の仕様書に定義されています。

このことは「No ARIA is better than Bad ARIA（ARIA 無しのほうが、悪い ARIA よりも良い）」という言葉で説明されています。ロールは約束という原則があります。そのロールの約束を果たすことなくロールを使用することは、注文を放棄してショッピングカートを空にする「Place Order」ボタンを作ることに似ています。

WAI-ARIA を学ぶ際には、はじめに ARIA Authoring Practices Guide (APG) の Read Me First を一読することを強くおすすめします。

https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/

### タブコンポーネントを実装してみる

実際の例として、タブコンポーネントを実装してみましょう。タブの UI は以下の 3 つのロールから構成されています。

- `tablist`：タブコンポーネントのコンテナ
- `tab`：タブ自体
- `tabpanel` ：タブに対応するパネル

マークアップで書いてみると、以下のようになります。

```html
<ul role="tablist">
  <li role="tab">Tab 1</li>
  <li role="tab">Tab 2</li>
  <li role="tab">Tab 3</li>
</ul>
<div class="panels">
  <div role="tabpanel">...</div>
  <div role="tabpanel">...</div>
  <div role="tabpanel">...</div>
</div>
```

ただし、さきほどの話にあったようにただロールを定義するだけでは不十分です。それぞれのロールごとに必要なキーボード操作、プロパティ、ステートを実装する必要があります。例えば `tab` ロールには以下のような仕様が提示されいます。

> A grouping label providing a mechanism for selecting the tab content that is to be rendered to the user.

> If a tabpanel or item in a tabpanel has focus, the associated tab is the currently active tab in the tablist, as defined in Managing Focus. tablist elements, which contain a set of associated tab elements, are typically placed near a series of tabpanel elements, usually preceding it. See the WAI-ARIA Authoring Practices for details on implementing a tab set design pattern.

> Authors MUST ensure elements with role tab are contained in, or owned by, an element with the role tablist.

> Authors SHOULD ensure the tabpanel associated with the currently active tab is perceivable to the user.

> For a single-selectable tablist, authors SHOULD hide other tabpanel elements from the user until the user selects the tab associated with that tabpanel. For a multi-selectable tablist, authors SHOULD ensure that the tab for each visible tabpanel has the aria-expanded attribute set to true, and that the tabs associated with the remaining hidden tabpanel elements have their aria-expanded attributes set to false.

> In either case, authors SHOULD ensure that a selected tab has its aria-selected attribute set to true, that inactive tab elements have their aria-selected attribute set to false, and that the currently selected tab provides a visual indication that it is selected. In the absence of an aria-selected attribute on the current tab, user agents SHOULD indicate to assistive technologies through the platform accessibility API that the currently focused tab is selected.

https://www.w3.org/TR/2021/CRD-wai-aria-1.2-20211208/#tab

簡潔にタブ UI に必要な機能を上げてみると、以下のようになります（ほんの一部です）

- `tab` ロールは `tablist` の配下にいる必要がある
- `tab` と `tabpabel` は関連づけられるべき（`aria-controls`）を使って指定する
- アクティブなタブに関連する `tabpanel` が知覚可能であるべき
- タブが選択されるまで、そのタブに関連する `tablist` は隠されるべき
- 選択されている `tab` には `aria-selected="true"` を指定すべき
- `←` `→` キーでタブ間をフォーカスできる

このような機能は次のように JavaScript で実装する必要があるでしょう。

```ts:Tab.tsx
  const { setActiveIndex, tabIdPrefix } = useTabContext();
  const focusTab = (index: number) => {
    // 次にフォーカスするタブを取得する
    const tab = tabListRef.current?.querySelector(
      `[id="${tabIdPrefix}-${index}"]`
    );
    if (tab) {
      // タブにフォーカス
      (tab as HTMLElement).focus();
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      // ← キーが押されたとき
      case "ArrowLeft":
        event.preventDefault();
        setActiveIndex((prevIndex: number) => {
          // 現在選択されているタブが1つ目のタブなら、最後のタブにフォーカスする
          if (prevIndex === 0) {
            const nextIndex = TabCount - 1;
            focusTab(nextIndex);
            return nextIndex;
          } else {
          // それ以外なら右隣のタブにフォー化する
            const nextIndex = prevIndex - 1;
            focusTab(nextIndex);
            return nextIndex;
          }
        });

        break;
      // → キーが押されたとき
      case "ArrowRight":
        event.preventDefault();
        // ...
``` 

https://azukiazusa.dev/blog/react-accessible-tab/

このように、ロールに求められる機能は多くあり、仕様に従った適切な実装を行うのはなかなか大変です。必要な機能を十分に実装できる余裕がないのであれば、何もロールを宣言せずにタブ UI を作成するほうが好ましいです。タブの UI であることは伝わらないですが、嘘をつくよりもましと考えられるでしょう。

このように複雑な UI を実装する際には、ARIA Authoring Practices Guide に実装例が記載されていますので、参考にするとよいでしょう。

https://www.w3.org/WAI/ARIA/apg/patterns/

UI ライブラリを選定する際には、WAI-ARIA の仕様に従った実装をしているかどうかを基準の 1 つとすると良いでしょう。以下に上げる UI ライブラリはスタイルを除いてアクセシビリティの機能のみを提供しているのでおすすめです。見た目のカスタマイズを容易に行えるので、デザインシステムとして組み込みやすいです。

- [Primitives – Radix UI](https://www.radix-ui.com/)
-[Headless UI - Unstyled, fully accessible UI components](https://headlessui.com/)
- [Reach UI](https://reach.tech/)
- [Vuetensils](https://vuetensils.com/)
- [Angular Material](https://material.angular.io/cdk/a11y/overview)

## まとめ
- アクセシビリティとは幅広い状況で使えるようにすること
- Web フロントエンドにおいては、正しい HTML の実装をすればアクセシビリティが担保できる
- 既存の HTML で表現できない複雑な UI は WAI-ARIA を使用する

## 参考
- [Web Content Accessibility Guidelines (WCAG) 2.1 ](https://waic.jp/docs/WCAG21/#abstract)
- [WCAG 2.1 解説書](https://waic.jp/docs/WCAG21/Understanding/)
- [ARIA Authoring Practices Guide | APG | WAI | W3C ](https://www.w3.org/WAI/ARIA/apg/)
- [freeeアクセシビリティー・ガイドライン — freeeアクセシビリティー・ガイドライン Ver. 202210.0 ドキュメント](https://a11y-guidelines.freee.co.jp/)
- [Ameba Accessibility Guidelines](https://a11y-guidelines.ameba.design/)
- [Accessible & Usable](https://accessible-usable.net/)
- [アクセシビリティ | MDN](https://developer.mozilla.org/ja/docs/Web/Accessibility)
- [ウェブアクセシビリティ導入ガイドブック](https://www.digital.go.jp/assets/contents/node/basic_page/field_ref_resources/08ed88e1-d622-43cb-900b-84957ab87826/377fe31d/20221212_introduction_to_weba11y.pdf)
- [アクセシビリティとユーザビリティ｜基礎知識｜エー イレブン ワイ［WebA11y.jp］](https://weba11y.jp/basics/accessibility/usability/)

