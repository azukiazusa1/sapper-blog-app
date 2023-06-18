---
id: k7tQmp1ih1DPgMogABr5D
title: "スクリーンリーダーに配慮したテキスト表記"
slug: "screen-reader-friendly-text-notation"
about: "文字を機械的に判断するスクリーンリーダーでは、人間の目によって判断できる文字について異なる解釈をするおそれがあります。そのような場合、利用者に正しい文章の意図を伝えられません。スクリーンリーダーに配慮したテキストの表記法を紹介します。"
createdAt: "2023-06-18T12:15+09:00"
updatedAt: "2023-06-18T12:15+09:00"
tags: ["アクセシビリティ"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1QnesRLUoMFlKtmKDg3TR4/c2ca3a4894497470ba5c308e2f1571b5/atlantic-footballfish_17516.png"
  title: "チョウチンアンコウ"
published: true
---
!> この記事の内容は VoiceOver で確認しています。他のスクリーンリーダーでは異なる場合があります。

目が見えている人は些細な文字の表記の違いを判断して理解できますが、文字を機械的に判断して読み上げるスクリーンリーダーは、そのような些細な違いを判断できません。例えばコンテンツの制作者は日付を想定した表記をしているのにもかからわず、スクリーンリーダーによっては日付を数字の羅列として読み上げてしまうことがあります。このように意図をしない読み上げられ方をすると、スクリーンリーダーを使っているユーザーはコンテンツを理解できません。

この記事では、以下の内容について正しくスクリーンリーダーに読み上げさせるためのテキスト表記について説明します。

- 日付の表示
- 空白や改行を入れない
- 絵文字を使いすぎない

## 日付の表示

日付に関する表記方法はぱっと思いつく限りでも複数の種類が存在します。

- 年,月,日のように単位を表記する：2021 年 12 月 01 日
- 年,月,日の区切りに記号を用いる
  - 2021/12/01
  - 2021-12-01
  - 2021.12.01

上記に上げた表示法の中では、`/` を用いた表記法はスクリーンリーダーに意図通りに読み上げられません。例えば「2021/12/31」という表記法は「にせんにじゅういちスラッシュ、じゅうにスラッシュ、ぜろいち」と読み上げられます。このように、/ はスラッシュとして読み上げられるため、日付の区切りとして認識されません。

一方で `-` や `.` を日付の区切りとして使用した場合には「にせんにじゅういちねん、じゅうにがつ、いちにち」と正しく日付として読み上げられます。このことから、何かの区切りとして記号を用いる際には `/` は避けることが望ましいと言えます。

よりベターな表記法としては、「2021 年 12 月 01 日」のように年,月,日を明示的に表記する方法があります。記号を使わずに明示的に記載しておくと誤解が生まれる余地がありません。このことは目に見える人にとっても同様です。

## 空白や改行を入れない

例えばレイアウトを整えるために、以下のように空白や改行を入れてしまうことがあります。

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/JjRoLXp?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/JjRoLXp">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

文字の間に空白や改行を入れてしまうと、スクリーンリーダーはそれぞれの文字を別の単語として読み上げてしまいます。「日　時：」という表記は本来「にちじ」と読み上げるべきところを「ひ、とき」と読み上げてしまいます。このように、スクリーンリーダーは空白や改行を入れることで意図しない読み上げ方をしてしまうことがあります。

対処方法は単語の間に空白や改行を入れないことです。レイアウトを整えるために空白や改行を入れるのではなく、CSS を用いてレイアウトを整えることが望ましいです。

CSS の `letter-spacing` や `margin` を用いて調整することです。

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/oNQxMLo?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/oNQxMLo">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

そもそも単語同士に空白を設けることをやめることを考えてみても良いでしょう。`letter-spacing` に大きすぎる値を設定すると目で見た場合にも読みづらくなってしまいます。

## 絵文字を使いすぎない

絵文字には代替テキストが設定されており、例えば「👍」は「いいね」、「🙌」は「ばんざい」と読み上げられます。絵文字は世界共通で用いられる言語ですし、昨今のコミュニケーションにおいても欠かせないものとなっています。スクリーンリーダーでも正しく読み上げられるため、通常の用途では問題ありません。

しかし、絵文字を多く使いすぎるとスクリーンリーダーが読み上げるテキストが長くなってしまいます。例えば以下のように装飾目的で絵文字を多く使うと、「チョコレート、クローバー、チョコレート、クローバー...」と読み上げられ、本来伝えたい文章に到達するまでに時間がかかってしまいます。

```html
🍫☘🍫☘🍫☘🍫☘🍫☘
チョコミントの季節だよ
🍫☘🍫☘🍫☘🍫☘🍫☘
```

絵文字を使うときには、スクリーンリーダーによってどのように読み上げられるのか一度文章を確認することをおすすめします。誤った意図を伝えてしまったり、ユーザーを混乱させてしまうような文章になっていることに気づいたら、絵文字を減らすことや、絵文字を入れる位置を文末にすることなどを検討してみてください。

## 参考

- [ウェブアクセシビリティ導入ガイドブック](https://www.digital.go.jp/assets/contents/node/basic_page/field_ref_resources/08ed88e1-d622-43cb-900b-84957ab87826/17f279b9/20221205_introduction_to_weba11y.pdf)
- [総務省｜東海総合通信局｜その4　音声読み上げに配慮したテキスト表記](https://www.soumu.go.jp/soutsu/tokai/siensaku/accessibility/L4_text2.html)
