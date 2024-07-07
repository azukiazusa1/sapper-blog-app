---
id: OjgDKvEuUWIjWv2sk7WhZ
title: "スタイルの適用範囲を限定する CSS の `@scope` ルール"
slug: "scope-rule-in-css"
about: "`@scope` アットルールは特定のセレクタの範囲に限定したスタイルを適用するためのルールです。`@scope` のルールセットに 1 つの CSS セレクタを指定すると、そのセレクタがスコープのルートとなります。`@scope` ルール内のスタイルはそのセレクタの範囲内でのみ適用されます。"
createdAt: "2024-07-07T16:46+09:00"
updatedAt: "2024-07-07T16:46+09:00"
tags: ["CSS"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1hJhnSPBTdd5dOh8MIJ6Yq/daac61a2f43b24424d106287e7fcbd15/kirikabu_kabutomushi_11493-768x709.png"
  title: "カブトムシと切り株のイラスト"
selfAssessment:
  quizzes:
    - question: "`@scope` ルール内でスコープのルート要素を指すために使用される擬似クラスはどれか？"
      answers:
        - text: ":root"
          correct: false
          explanation: ""
        - text: ":scope"
          correct: true
          explanation: ""
        - text: ":host"
          correct: false
          explanation: ""
        - text: ":current"
          correct: false
          explanation: ""

published: true
---

CSS の `@scope` アットルールは特定のセレクタの範囲に限定したスタイルを適用するためのルールです。`@scope` ルールは以下のように記述します。

```css
@scope (.card) {
  p {
    color: red;
  }
}
```

`@scope()` はルールセットとして CSS のセレクタを指定します。例えば `@scope(main)` や `@scope(.container)` といった感じです。ルールセットで指定したセレクタがスコープのルートとなり、`@scope` ルール内のスタイルはそのセレクタの範囲内でのみ適用されます。

上記のコード例では、`.card` クラスが付与された要素内の `p` 要素にのみ `color: red` が適用されます。それ以外の `p` 要素には適用されません。

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/xxoxwwZ?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/xxoxwwZ">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## `@scope` の基本構文

記事の冒頭でも触れたように、`@scope` のルールセットに 1 つの CSS セレクタを指定すると、そのセレクタがスコープのルートとなります。下記のコード例では、`article` 要素内にのみ適用されるスタイルを指定しています。

```css
@scope (article) {
  /**
}
```

### `@scope` のリミット

`to` を使用してスコープのリミットを指定することもできます。スコープのリミットは範囲の下限として機能します。例えば、次のような HTML があるとしましょう。

```html
<div class="container">
  <p>text 1</p>

  <div class="inner">
    <p>text 2</p>
  </div>
</div>
```

`@scope` ルールでは `.container` 要素をスコープのルートとし、`.inner` 要素をスコープのリミットとして指定します。

```css
@scope (.container) to (.inner) {
  p {
    color: red;
  }
}
```

この場合 `.inner` 要素は `.container` の範囲内に含まれていますが、同時に `.inner` 要素がスコープのリミットとして指定されているため、`.inner` 要素内の `p` 要素には `p { color: red; }` が適用されません。

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/poXojwX?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/poXojwX">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

-> スコープの下限にスコープのリミット自身を含めるかどうかは議論がありました。スコープのリミット自身を含めたい場合には `@scope (.container) to (.inner > *)` のように指定することで対応できることから、スコープのリミットを含めない仕様となりました。https://github.com/w3c/csswg-drafts/issues/6577

### インラインスタイル `@scope` ルール

HTML 内で `<style>` 要素を使用してインラインスタイルとして `@scope` ルールを記述できます。その場合、`@scope` のルールセットの指定は省略され、`<style>` 要素の親要素がスコープのルートとなります。なお、スコープのリミットはルートは自動で設定されません。

```html
<main class="main">
  <div class="container">
    <style>
      @scope {
        p {
          color: red;
        }
      }
    </style>

    <p>text 1</p>

    <div class="inner">
      <p>text 2</p>
    </div>
  </div>

  <p>test 3</p>
</main>
```

上記のコード例では、`<style>` の親要素である `.container` 要素がスコープのルートとなり、`.container` 要素内の `p` 要素にのみ `color: red` が適用されます。

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/wvLvKpR?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/wvLvKpR">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### `:scope` 擬似クラス

`@scope` ブロック内で `:scope` 擬似クラスを使用できます。`:scope` 擬似クラスはスコープのルート要素を指定するために使用されます。つまり、`scope(.card)` ルール内での `:scope` は `.card` 要素を指すということです。

```css
@scope (.card) {
  :scope {
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-width: 300px;
    padding: 16px;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0;
  }

  p {
    color: #333;
  }
}
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/LYKYpOy?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/LYKYpOy">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### `@scope` の競合の解決

ある要素が複数の `@scope` ルールに含まれる場合、どちらのスタイルが適用されるのでしょうか？以下のように入れ子の構造の HTML があるとします。

```html
<div class="section1">
  <div class="section2">
    <p>text</p>
  </div>
</div>
```

そして次の CSS では `.section1` と `.section2` それぞれに `@scope` ルールが適用されています。

```css
@scope (.section1 .section2) {
  p {
    color: yellow;
  }
}

@scope (.section2) {
  p {
    color: blue;
  }
}

@scope (.section1) {
  p {
    color: red;
  }
}
```

このとき、`p` 要素には `blue` と `red` のどちらの色が適用されるでしょうか？正解は `.section2` の `@scope` ルールによって `color: blue` です。

`@scope` ルール内では従来の CSS のカスケードとは異なる基準が適用されます。CSS の通常のカスケードでは、詳細度がより高いスタイルが、同じ詳細度の場合は後に記述されたスタイルが適用されました。`@scope` ルール内ではスコープルートまでの距離が最も近い `@scope` ルールが適用されます。これをスコープの近接性と呼びます。

この例では　`p` 要素に最も近い `.section2` 要素の `@scope` ルールが適用されます。なお、`@scope` のルールセットとして渡しているセレクタは優先度の計算に使用されません。そのため、`.section1 .section2` というセレクタは `.section2` というセレクタよりも詳細度が高いということにはならないため、より後ろに記述された `.section2` の `@scope` ルールが適用されます。

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/wvLvKyR?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/wvLvKyR">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

なお、スコープの近接性のルールはスタイルの記述順よりも優先して適用されるものの、スタイルの詳細度や `!important`、`@layer` ルールなどより強い優先度を持つものには勝つことができないことに注意してください。以下の例では `.section2` の `@scope` ルールのほうが近接しているにもかかわらず、`.section1` の `@scope` ルールで使用されているスタイルの詳細度がより高いため、`color: red` が適用されます。

```css
@scope (.section2) {
  p {
    color: blue;
  }
}

@scope (.section1) {
  :scope {
    p {
      color: red;
    }
  }
}
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/wvLvKEO?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/wvLvKEO">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

それでは `@scope` ルール内のスタイルと、通常の CSS のスタイルとの優先度の競合の場合にはどうなるでしょうか？

```css
@scope (section) {
  p {
    color: blue;
  }
}

p {
  color: red;
}
```

この場合にはどちらも同じ詳細度（`0-0-1`）を持ちますが、`@scope` ルール内のスタイルが優先して適用されます。

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/qBzBbev?default-tab=css" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/qBzBbev">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### `@scope` の詳細度

`@scope` ルールのルールセットで使用されているセレクタは、`@scope` ブロック内のセレクタに影響を与えないという特徴があります。以下の例における `p` 要素は `.card` 要素内にのみ適用されるスタイルを指定していますが、詳細度は `0-0-1` となっています。

```css
@scope (.card) {
  p {
    /* 詳細度 0-0-1 */
    color: red;
  }
}

/** スコープのルールセットのセレクタは影響しない */
@scope (.card p) {
  p {
    /* 詳細度 0-0-1 */
    color: blue;
  }
}

@scope (#card) {
  p {
    /* 詳細度 0-0-1 */
    color: green;
  }
}
```

## まとめ

- `@scope` ルールは特定のセレクタの範囲に限定したスタイルを適用するためのルール
- `@scope` のルールセットに 1 つの CSS セレクタを指定すると、そのセレクタがスコープのルートとなる
- `@scope` ルール内で `to` を使用してスコープのリミットを指定することができる
- `@scope` ルール内で `:scope` 擬似クラスを使用するとスコープのルート要素を指定できる
- `@scope` ルール内では新たなカスケードのルールとしてスコープの近接性が適用される。スコープの近接性はスコープルートまでの距離が最も近い `@scope` ルールが適用される
- `@scope` ルール内のスタイルと通常の CSS のスタイルとの優先度の競合の場合、`@scope` ルール内のスタイルが優先して適用される

## 参考

- [CSS Cascading and Inheritance Level 6](https://www.w3.org/TR/css-cascade-6/#scoped-styles)
- [@scope - CSS: カスケーディングスタイルシート | MDN](https://developer.mozilla.org/ja/docs/Web/CSS/@scope)
- [CSS @scope at-rule でセレクタのリーチを制限する  |  CSS and UI  |  Chrome for Developers](https://developer.chrome.com/docs/css-ui/at-scope?hl=ja)
- [CSSの適用範囲を限定する@scopeについて](https://mosya.dev/blog/scope)
- [CSSにそのうち導入されそうな@scopeとその関連概念](https://zenn.dev/uhyo/articles/css-cascading-6-scope)
