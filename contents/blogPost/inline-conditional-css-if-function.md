---
id: 0yb6M48xhQ-FaMOlBy_wy
title: "インラインで条件分岐する CSS の if() 関数"
slug: "inline-conditional-css-if-function"
about: "if() 関数は CSS Values and Units Module Level 5 という仕様で提案されている関数です。if() 関数は CSS でインラインの条件分岐を可能にします。"
createdAt: "2025-03-01T15:41+09:00"
updatedAt: "2025-03-01T15:41+09:00"
tags: [""]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2hoMlP7jAUdlsA61AOIPMk/af4d13ee23c92d7e5b4b431e0c67e797/kappamaki_sushi_21468-768x670.png"
  title: "かっぱ巻きのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "if() 関数の引数のリストの区切りとして使われる文字は何か？"
      answers:
        - text: ","
          correct: false
          explanation: null
        - text: ";"
          correct: true
          explanation: null
        - text: ":"
          correct: false
          explanation: null
        - text: "<ホワイトスペース>"
          correct: false
          explanation: null
published: true
---
!> 2025 年 3 月現在 `if()` 関数は Chrome Canary で Experimental Web Platform Features フラグを有効にすることで利用可能です。

`if()` 関数は [CSS Values and Units Module Level 5](https://drafts.csswg.org/css-values-5) という仕様で提案されている関数です。`if()` 関数は CSS でインラインの条件分岐を可能にします。

## `if()` 関数の概要

CSS の `if()` 関数は引数に `<条件>:<値>` のペアのリストを取り、最初に `<条件>` が真となる値を返します。条件のリストは `;` で区切られます。

```css
.foo {
  color: if(style(--variant: dark): white; else: black);
}
```

`<条件>` には以下を指定できます。

- `supports()`：指定した CSS の構文がサポートされている場合に真を返す
- `media()`：指定したメディアクエリがマッチする場合に真を返す
- `style()`：指定した CSS の宣言が要素に適用されている場合に真を返す
- `else`：常に真を返す

`if()` 関数の使用例を以下に示します。この例では、`--alert-type` カスタムプロパティの値に応じて `.alert` 要素の色を変更しています。`--alert-type` が `error` の場合には赤、`warning` の場合にはオレンジ、それ以外の場合には黒になります。

```css
.alert {
  color: if(
    style(--alert-type: error): red; 
    style(--alert-type: warning): orange;
    else: black
  );
}

.alert.error {
  --alert-type: error;
}

.alert.warning {
  --alert-type: warning;
}
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/raNjYby?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/raNjYby">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

カスタム関数を追加できる `@function` ルールと `attr()` 関数を組み合わせることで、より簡潔なスタイルを記述することもできます。

```css
@function --alert-color(--alert-type) {
  result: if(
    style(--alert-type: error): red; style(--alert-type: warning): orange;
      else: black
  );
}

.alert {
  color: --alert-color(attr(data-type type(<custom-ident>), none));
}
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/gbOgorV?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/gbOgorV">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>


`media()` 関数を使用して、画面サイズが小さい場合のみ要素を非表示にするスタイルを記述することもできます。

```css
.sidebar {
  display: if(media(screen and (max-width: 600px)): none; else: block);
}
```

## `if()` 関数の利点

`if()` 関数で実現できることは、今までも `@supports` や `@media` ルールを使用して実現できていました。

```css
@supports (display: grid) {
  .grid {
    display: grid;
  }
}

/* または */
.grid {
  display: if(supports(display: grid): grid; else: block);
}
```

`if()` 関数を使用することで有益になるのは `style()` を使用した場合です。`style()` を使用した例は[コンテナスタイルクエリ](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_containment/Container_size_and_style_queries#%E3%82%B3%E3%83%B3%E3%83%86%E3%83%8A%E3%83%BC%E3%82%B9%E3%82%BF%E3%82%A4%E3%83%AB%E3%82%AF%E3%82%A8%E3%83%AA%E3%83%BC)で行われていた条件分岐に似ているように見えます。

```css
.alert {
  color: black;
}

@container (--alert-type: error) {
  .alert {
    color: red;
  }
}

@container (--alert-type: warning) {
  .alert {
    color: orange;
  }
}

.container {
  container-type: alert;
}
```

しかし、コンテナスタイルクエリを使用する場合にはスタイルを適用したい要素に直接カスタムプロパティを適用できません。HTML に追加でコンテナ要素を追加する必要があります。

```html
<div class="container" style="--alert-type: error">
  <div class="alert">Error</div>
</div>
```

`--alert-type` が取りうる値ごとに `@container` ルールを追加する必要がある点も少々冗長に感じられます。また、フォールバック値を指定する際にも注意が必要です。CSS のスタイルの適用順の都合上、フォールバック値を `@container` ルールの後に記述してしまうと常にフォールバック値が適用されてしまいます。

`if()` 関数の仕様はコンテナスタイルクエリと比較して以下の利点があるといえるでしょう。

- 余分なコンテナ要素を追加する必要がない
- 1 つの `if()` 関数内で複数の条件を指定できるため、コードの記述量が少なくなる
- フォールバック値を `else` で明示的に指定できるため、より明確になる

```html
<style>
.alert {
  color: if(
    style(--alert-type: error): red;
    style(--alert-type: warning): orange;
    else: black
  );
}
</style>

<div class="alert" style="--alert-type: error">Error</div>
```

## まとめ

- `if()` 関数は CSS でインラインの条件分岐を可能にする
- `if()` 関数は `supports()`、`media()`、`style()`、`else` の 4 つの条件を指定できる
- `if()` 関数を使用することでコンテナスタイルクエリと比較して以下の利点がある
  - 余分なコンテナ要素を追加する必要がない
  - 1 つの `if()` 関数内で複数の条件を指定できるため、コードの記述量が少なくなる
  - フォールバック値を `else` で明示的に指定できるため、より明確になる

## 参考

- [7.3. Conditional Value Selection: the if() notation](https://drafts.csswg.org/css-values-5/#if-notation)
- [Explainer: CSS if() function - Google ドキュメント](https://docs.google.com/document/d/1mbHBUR40jUBay7QZxgbjX7qixs5UZXkdL9tVwGvbmt0/edit?tab=t.0)
- [Inline conditionals in CSS? • Lea Verou](https://lea.verou.me/blog/2024/css-conditionals/)
- [CSS @function + CSS if() = 🤯 – Bram.us](https://www.bram.us/2025/02/18/css-at-function-and-css-if/)
