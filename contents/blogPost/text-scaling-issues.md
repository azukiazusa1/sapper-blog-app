---
id: icU5sgOuwtllfvQ5em7nt
title: "テキストサイズの拡大設定の問題と解決策"
slug: "text-scaling-issues"
about: "WCAG 2.2 では、ユーザーが画像拡大ソフトや支援技術を使用せずに、200% までテキストを拡大してもコンテンツが正しく表示されることを要求しています。しかし、テキストサイズの拡大に関しては、ブラウザや OS の設定を尊重せず、ユーザーがテキストサイズを拡大してもコンテンツが拡大されないという問題が長年存在していました。この記事では、この問題の原因と解決策について解説します。"
createdAt: "2026-02-24T19:40+09:00"
updatedAt: "2026-02-24T19:40+09:00"
tags: ["アクセシビリティ", "CSS"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/17KXQOmVCVEgcnUvNriUKL/59a9be90f868ceee31b376cddf9197a6/microscope_23081.png"
  title: "顕微鏡のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Google Chrome でブラウザのテキストサイズの設定を「極大」にしている場合、設定が無視されてテキストが拡大されないフォントサイズの単位はどれですか？"
      answers:
        - text: "`px`"
          correct: true
          explanation: "絶対単位である `px` を使用している場合、Google Chrome ではユーザーのテキストサイズの設定が反映されなくなってしまいます。相対単位である `rem` や `%` を使用することが推奨されます。"
        - text: "`rem`"
          correct: false
          explanation: null
        - text: "`em`"
          correct: false
          explanation: null
        - text: "`%`"
          correct: false
          explanation: null
    - question: "`text-scale` meta タグの `content` 属性に指定できる値として正しい組み合わせはどれか？"
      answers:
        - text: "`none` と `auto`"
          correct: false
          explanation: null
        - text: "`legacy` と `scale`"
          correct: true
          explanation: "`legacy` は従来の挙動を維持し、`scale` はユーザーのテキストサイズの設定を尊重して拡大する挙動を指定します。"
        - text: "`default` と `responsive`"
          correct: false
          explanation: null
        - text: "`fixed` と `dynamic`"
          correct: false
          explanation: null
published: true
---
WCAG 2.2 では、ユーザーが画像拡大ソフトや支援技術を使用せずに、200% までテキストを拡大してもコンテンツが正しく表示されることを要求しています（[1.4.4 Resize Text](https://www.w3.org/TR/WCAG22/#resize-text)）。ロービジョンのユーザーの多くは OS やブラウザのテキストサイズの設定を使用してテキストを拡大しています。しかし、テキストサイズの拡大に関しては、ブラウザや OS の設定を尊重せず、ユーザーがテキストサイズを拡大してもコンテンツが拡大されないという問題が長年存在していました。大きく分けて以下の 2 つの問題があります。

- フォントサイズの単位に `px` を使用している場合、一部のブラウザではユーザーのテキストサイズの設定が無視され、テキストが拡大されない問題
- OS のテキストサイズの変更がブラウザに反映されない問題

## フォントサイズの単位に `px` を使用している場合の問題

ブラウザのテキストサイズの設定について見てみましょう。Google Chrome では、[設定 > デザイン > フォントサイズ](chrome://settings/appearance)からテキストサイズを「極小」から「極大」の 5 段階で設定できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/17HC9E9Q29tGv6SHLCtpEx/70bb6c1145730465db814859648bd9a2/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-23_19.54.00.png)

Firefox では、設定 > 一般 > 言語と外観 > フォントからピクセル単位でフォントサイズを設定できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/2SFY4AovvHgvDtOIQiTFNx/354c2be0b45b1ca8ec645cba9142d20f/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-23_21.02.24.png)

Safari では、設定 > 詳細 > アクセシビリティから最小のフォントサイズを設定できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/79DHOrVr6QUCsVDMuj416L/cf3f9409a0c69c9c2b60c02c8b7b0c1a/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-23_21.04.06.png)

しかし、Google Chrome ではフォントサイズの単位に `px` を使用している場合、ブラウザの設定が無視され、ユーザーがテキストサイズを拡大してもコンテンツが拡大されないという問題が存在します。Google Chrome のフォントサイズの拡大設定は実際にはルート要素 `<html>` のデフォルトのフォントサイズ（`16px`）を拡大するものであるためです。この問題を回避するために、CSS では `rem` や `em` などの相対単位や `%` を使用することが推奨されてきました。

実際に以下のコードで確認してみましょう。それぞれの要素のフォントサイズの単位を `px`, `rem`, `%` にしてみます。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Text Scaling Test</title>
    <style>
      .px {
        font-size: 16px;
      }
      .rem {
        font-size: 1rem;
      }
      .percent {
        font-size: 100%;
      }
    </style>
  </head>
  <body>
    <p class="px">This text uses px units.</p>
    <p class="rem">This text uses rem units.</p>
    <p class="percent">This text uses percent units.</p>
  </body>
</html>
```

Google Chrome のテキストサイズの設定を「極大」にしてみると、`.px` クラスのテキストは拡大されませんが、`.rem` と `.percent` クラスのテキストは拡大されることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/5mwcOu9OzpewlfJrkrVFRI/d689a1f4434054ecffe0b9e8f1fdc5d4/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-23_20.02.25.png)

一方で Firefox や Safari などのブラウザは、フォントサイズの単位が `px` であってもユーザーのテキストサイズの設定を尊重して拡大するため、この問題は発生しませんでした。

![](https://images.ctfassets.net/in6v9lxmm5c8/5SkZi333zCCCJgl7tyqagv/4c4714d68be90f10b6f757b3612abc3b/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-23_20.20.37.png)

![](https://images.ctfassets.net/in6v9lxmm5c8/75GWWRYPAl9KABR6M3J26z/5c4a44426d7f09d62e92d7e44ebb0cf5/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-23_20.21.29.png)

この問題を回避するために今日ではフォントサイズや `margin`, `padding`, `gap` などのレイアウトに関するプロパティの単位には `px` といった絶対値を使用せず、`rem` や `em` などの相対単位や `%` を使用することが推奨されています。このプラクティスは後者の OS のテキストサイズの変更がブラウザに反映されない問題にも関わってきます。

## OS のテキストサイズの変更がブラウザに反映されない問題

OS レベルでもテキストサイズを変更できます。macOS では、システム設定 > アクセシビリティ > ディスプレイ > テキスト > テキストサイズから変更できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/d4Y6S9YQ6ji220Z6O12iZ/c691899d66eede6366799bbe466786da/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-24_19.19.13.png)

iOS では、設定 > アクセシビリティ > 画面表示とテキストサイズ > さらに大きな文字から変更できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/6eCslqc4u1IouUtF8lxGUa/13a9e38688b9e02e98249e464b961b74/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-24_19.21.55.png)

OS やブラウザの組み合わせによっても異なりますが、OS のテキストサイズの変更がブラウザに反映されない問題も存在します。MacOS + Google Chrome の組み合わせや iOS + Safari の組み合わせではテキストサイズは拡大されませんでした。手元にないので検証できないのですが、Android + Firefox の組み合わせ、Windows 11 + Chrome or Edge、Firefox の組み合わせでは OS のテキストサイズの変更がブラウザに反映されるようです。

![](https://images.ctfassets.net/in6v9lxmm5c8/1YUbC7x28nj5V3Pvor1O3s/3f58e3d4febc50c3aedc2d3dcd634c23/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-24_19.23.28.png)

フォントサイズレベルでの拡大ができないと、ユーザーはブラウザのズーム機能を使用して拡大する必要がありますが、すべての要素が拡大されるため、レイアウトが崩れたりするといった問題が発生します。特に画面幅が狭いモバイルデバイスでは、より深刻な問題になります。このように OS のテキストサイズの変更がブラウザに反映されない問題はユーザーのアクセシビリティに大きな影響を与えることが広く知られていたため、いくつかの解決策が提案されています。

### iOS の非標準的なアプローチ

WebKit ベースのブラウザでは `font-family` の値として [`-apple-system-*`](https://webkit.org/blog/3709/using-the-system-font-in-web-content/) を使用することで iOS で最適なフォントが選択されるようになります。これにより OS レベルのフォントの設定が動的に反映されるようになるため、ブラウザで表示されるテキストのサイズも OS のテキストサイズの変更に応じて拡大されるようになります。

```css
:root {
  font: -apple-system-body;
}

body {
  font-family: sans-serif;
  font-style: initial;
  font-weight: initial;
}
```

https://ia11y.github.io/Coding-Patterns/iOS/text-resizing/ios-system-fonts.html でこの挙動を確認できます。iOS で確認するとたしかに OS のテキストサイズの変更に応じてテキストが拡大されることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/1xrzlloVrbOVrK9sKBNXFk/c17961c593d61821a701beefe94044a4/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-24_19.45.59.png)

### `env(preferred-text-scale)`

標準的なアプローチとしては、CSS の環境変数 `env(preferred-text-scale)` を使用する方法が提案されています。`env(preferred-text-scale)` はユーザーのテキストサイズの設定に基づいて拡大率を返す環境変数です。これを使用することで、ユーザーのテキストサイズの設定に応じてフォントサイズを拡大できます。

ページ全体のテキストをユーザーのテキストサイズの設定に応じて拡大するには、以下のようにルート要素のフォントサイズを `env(preferred-text-scale)` を使用して設定します。`rem` や `em` などの相対単位を使用している場合、ルート要素のフォントサイズが拡大されることで、ページ全体のテキストがユーザーのテキストサイズの設定に応じて拡大されるようになります。また `env` 関数の第 2 引数にデフォルト値も指定できます。

`env(preferred-text-scale)` を使用してフォントサイズを動的に拡大させる場合、2 重に拡大されるのを防止するために、`text-size-adjust: none` を指定することが推奨されます。`text-size-adjust` プロパティは、ユーザーのテキストサイズの設定に応じてフォントサイズを自動的に拡大するかどうかを制御するプロパティで、一部のモバイルブラウザでのみ機能します。

```css
:root {
  font-size: calc(100% * env(preferred-text-scale, 1));
  text-size-adjust: none;
}

p {
  font-size: 1rem;
}
```

ただし、この方法ではメディアクエリのブレークポイントはフォントスケールを考慮しないため、ユーザーが大きなフォントサイズを設定している場合にレイアウトが崩れる可能性があります。この制限を解決するのが、次に紹介する `text-scale` meta タグです。

### `text-scale` meta タグ

meta タグ `text-scale` ではページ全体にユーザーのテキストサイズの設定に応じて拡大するかどうかを指定します。`text-scale` meta タグは値として `legacy` と `scale` を取ります。`legacy` は従来の挙動を維持し、`scale` はユーザーのテキストサイズの設定を尊重して拡大する挙動を指定します。

```html
<meta name="text-scale" content="scale" />
```

この `text-scale` の値に `content="scale"` を指定している場合、以下の CSS を指定しているのと同義になります。

```css
:root {
  font-size: calc(100% * env(preferred-text-scale));
  text-size-adjust: none;
}
```

ウェブサイトの開発者は `rem` や `em` などの相対単位を使用している場合、`text-scale` meta タグを使用するだけで、ユーザーのテキストサイズの設定に応じてテキストが拡大されるようになるのです。`env(preferred-text-scale)` を使用して CSS でフォントサイズを動的に拡大する方法と比べて、CSS を変更することなく OS やブラウザのテキストサイズの設定を尊重してテキストを拡大できるようになるという点がこの meta タグの大きな利点です。

`text-scale` meta タグは現在 Android 版の Chrome でのみサポートされています。現時点では広くサポートされていないものの、将来の対応に備えてフォントサイズやレイアウトを設計する際には相対単位である `rem` や `em` を使用することが推奨されます。またデフォルトのフォントサイズを上書きしないことも重要です。`<meta name="text-scale" content="scale" />` を使用する場合、ユーザーの設定によりルートレベルのデフォルトのフォントサイズを変更できるようになりますが、これを上書きしてしまうとユーザーのテキストサイズの設定が反映されなくなってしまいます。

```html
<meta name="text-scale" content="scale" />
<style>
  :root {
    /* NG: ユーザーが設定したテキストサイズの拡大率が反映されなくなる */
    font-size: 10px;
  }
</style>
```

## まとめ

- フォントサイズの単位に `px` を使用している場合、一部のブラウザではユーザーのテキストサイズの設定が無視され、テキストが拡大されない問題が存在するため、フォントサイズやレイアウトの単位には `rem` や `em` などの相対単位や `%` を使用することが推奨される
- OS のテキストサイズの変更がブラウザに反映されない問題も存在する
- 非標準なアプローチとしては、iOS の非標準的なアプローチである `-apple-system-*` を使用する方法がある
- 標準的なアプローチとしては、CSS の環境変数 `env(preferred-text-scale)` を使用する方法がある。`env(preferred-text-scale)` はユーザーのテキストサイズの設定に基づいて拡大率を返す環境変数で、これを使用することでユーザーのテキストサイズの設定に応じてフォントサイズを拡大できる
- より簡単なアプローチとしては、`text-scale` meta タグを使用する方法がある。`text-scale` meta タグは値として `legacy` と `scale` を取り、`content="scale"` を指定することでユーザーのテキストサイズの設定を尊重して拡大する挙動を指定できる

## 参考

- [csswg-drafts/css-env-1/explainers/meta-text-scale.md at main · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/blob/main/css-env-1/explainers/meta-text-scale.md)
- [2. Text-Scale meta element](https://drafts.csswg.org/css-fonts-5/#text-scale-meta)
- [csswg-drafts/css-env-1/explainers/env-preferred-text-scale.md at main · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/blob/main/css-env-1/explainers/env-preferred-text-scale.md)
- [text-scale によるユーザ指定倍率での文字拡大 | blog.jxck.io](https://blog.jxck.io/entries/2026-02-11/text-scale.html)
- [A new meta tag for respecting text scaling on mobile - Manuel Matuzovic](https://matuzo.at/blog/2026/text-scaling-meta-tag)
- [Try text scaling support in Chrome Canary - Josh Tumath](https://www.joshtumath.uk/posts/2026-01-27-try-text-scaling-support-in-chrome-canary/)
