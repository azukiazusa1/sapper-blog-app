---
id: rim--EWuXoYgodt9mDbZl
title: "CSS の `@property` ルールでカスタムプロパティを定義する"
slug: "define-custom-properties-with-css-property-rule"
about: "CSS の @property ルールを使うことで、CSS のカスタムプロパティを定義できます。カスタムプロパティを定義することでプロパティの構文チェック、デフォルト値の設定、プロパティが値を継承するかどうかの設定などが可能になります。カスタムプロパティに誤った値が代入されることを防いだり、グラデーションのアニメーションなど、従来は実装が難しかった機能をサポートすることができます。"
createdAt: "2024-07-13T16:16+09:00"
updatedAt: "2024-07-13T16:16+09:00"
tags: ["CSS"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/6XPepRCNVx6UbiH3LhkvCN/c0c1f29eca8869d867f84c68117f69b3/sea_surfing_9367.png"
  title: "海とサーフボードのイラスト"
selfAssessment:
  quizzes:
    - question: "`@property` ルールにおいて初期値を設定するために使用するフィールドはどれか？"
      answers:
        - text: "initial"
          correct: false
          explanation: ""
        - text: "initial-value"
          correct: true
          explanation: ""
        - text: "default"
          correct: false
          explanation: ""
        - text: "default-value"
          correct: false
          explanation: ""
    - question: "`@property` ルールの `syntax` フィールドにおいて `<number>+` と指定されている場合、次のうち代入可能な値はどれか？"
      answers:
        - text: "10 20 30 40"
          correct: true
          explanation: `<number>` は整数または小数部分のある数値、`+` はスペース区切りのリストを表すため、`0 0 0 0` は代入可能な値となります。
        - text: "1px"
          correct: false
          explanation: `<number>` には単位を含む数値を代入することはできません。
        - text: "10, 20, 30, 40"
          correct: false
          explanation: `+` はスペース区切りのリストを表すため、`,` 区切りのリストは代入可能な値となりません。
        - text: "10px 10px 10px #fff"
          correct: false
          explanation: `<number>` がデータ型に指定されているため、カラーコードなどの他のデータ型の値は代入できません。

published: true
---

CSS の `@property` ルールを使うことで、[CSS のカスタムプロパティ](https://developer.mozilla.org/ja/docs/Web/CSS/--*) を定義できます。カスタムプロパティを定義することでプロパティの構文チェック、デフォルト値の設定、プロパティが値を継承するかどうかの設定などが可能になります。

```css
@property --my-color {
  syntax: "<color>";
  inherits: false;
  initial-value: red;
}

/* カスタムプロパティを使用 */
.my-element {
  --my-color: blue;
  color: var(--my-color);
}
```

## `@property` ルールのメリット

`@property` ルールを使うことで、以下のようなメリットがあります。

- カスタムプロパティによりコードをドキュメント化する
- 誤った値の代入を防ぎ、適切なエラーメッセージを表示する
- グラデーションのアニメーションなど、従来は実装が難しかった機能をサポートする

### コードのドキュメント化・誤った値の代入を防ぐ

通常のカスタムプロパティの定義は以下のような記法で定義されます。

```css
:root {
  --primary: #7bd389;
  --secondary: #607466;
}
```

`:root` にカスタムプロパティを定義することで、全体で使用できるカスタムプロパティを定義できます。このような方法はプロダクトで統一されたテーマを適用したい場合によく使われます。カスタムプロパティを使うと、ボタンの `background-color` に `#7bd389` と記述されているよりも、`var(--primary)` とあるほうが意味がより伝わりやすいというメリットがあります。また、テーマを変更したくなった場合に、`--primary` の値を変更するだけで全体のテーマを変更できるため、保守性が高くなります。

一方でカスタムプロパティは意図しない値が代入される危険があります。ここでは `--primary` という変数にはカラーコードが入るべきであるという前提がありますが、`--primary` に文字列や数値が代入されてしまうと、意図しない挙動を引き起こす可能性があります。

`--primary` というカスタムプロパティがすでに存在することを知らずに、同じ名前のカスタムプロパティでうっかり上書きしてしまうかもしれません。

```css
.card {
  --primary: 100px;

  width: var(--primary);
}
```

カスタムプロパティが複数の場所で定義されていた場合には、最も近いスコープのカスタムプロパティが優先されます。もし `.ca
rd` クラスの配下で `--primary` に色の値が代入されていることを前提としていたコードが記述されていた場合、思わぬデザイン崩れが発生してしまうかもしれません。

```css
:root {
  --primary: #7bd389;
  --secondary: #607466;
}

.card {
  --primary: 100px;

  width: var(--primary);
}

.button {
  /* 意図せず無効な値が代入されてしまっている */
  background-color: var(--primary);
}
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/NWZqyjN?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/NWZqyjN">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

`@property` ルールでは `syntax` フィールドにデータ型を指定することで、カスタムプロパティに代入される値の型を制限できます。`:root` で行っていたカスタムプロパティの定義は以下のように記述できます。

```css
@property --primary {
  syntax: "<color>";
  inherits: true;
  initial-value: #7bd389;
}

@property --secondary {
  syntax: "<color>";
  inherits: true;
  initial-value: #607466;
}
```

第一に `syntax` フィールドに `<color>` と指定されているおかげで、開発者は `--primary` に代入される値がカラーコードであることを知ることができます。`@property` 静的型付け言語のようにコードをドキュメント化できるという点がメリットと言えるでしょう。

もし `--primary` に無効な値、つまりカラーコード以外の値が代入された場合にはプロパティの値は初期値（`initial-value` で設定した値）にフォールバックします。下記のコードでは `.card` クラスの `--primary` に `100px` が代入されていますが、これは無効な値であるため、`--primary` の値は初期値である `#7bd389` にフォールバックします。

```css
@property --primary {
  syntax: "<color>";
  inherits: true;
  initial-value: #7bd389;
}

@property --secondary {
  syntax: "<color>";
  inherits: true;
  initial-value: #607466;
}

.card {
  /** この値は `<color>` というデータ型に一致しないため */
  --primary: 100px;
  /** 初期値にフォールバックされるため、`var(--primary)` は `#7bd389` になる */
  width: var(--primary);
}
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/abgOYdx?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/abgOYdx">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

このように開発者はすぐにコードの誤りに気づくことができ、意図せぬデザイン崩れを未然に防ぐことができます。Developer Tools の Styles タブを見ると、誤った値が代入された場合には `invalid` と表示されるていることがわかります。適切なエラーメッセージを表示することで、開発者はすぐに問題を解決できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/2hrjky83hOBfaLr3MFpUew/b68e27c5bf69411452d2ea2c9ba765ce/__________2024-07-13_18.27.00.png)

### グラデーションのアニメーションなど、従来は実装が難しかった機能をサポートする

CSS でグラデーションのアニメーションを実装する例を考えてみましょう。通常のカスタムプロパティを使って実装では以下のようなコードになるでしょう。

```css
@property --angle {
  syntax: "<angle>";
  inherits: true;
  initial-value: 0deg;
}

:root {
  --color1: #7bd389;
  --color2: #607466;

  --angle: 0deg;
}

@keyframes gradient {
  0% {
    --angle: 0deg;
  }

  100% {
    --angle: 360deg;
  }
}

.gradient {
  width: 100px;
  height: 100px;
  background: linear-gradient(var(--angle), var(--color1), var(--color2));
  animation: gradient 3s linear infinite;
}
```

`@keyframes` ルールでグラデーションのアニメーションを定義し、`--angle` カスタムプロパティがアニメーションの進行度に応じて増加するようにしています。`.gradient` クラスでは `animation` プロパティで `gradient` アニメーションを適用し、3 秒かけて 360 度回転するグラデーションを実装しています。

しかし、このコードは期待と反して正しく動作しません。

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/mdZJxwO?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/mdZJxwO">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

これは CSS のアニメーションがすべてのカスタムプロパティを文字列として解析しているためです。`0deg` → `360deg` を数値の増加として解釈できないため、アニメーションが正しく動作しないのです。

`@property` ルールを使い、`<angle>` というデータ型を指定することで、この問題を解決できます。

```css
@property --angle {
  syntax: "<angle>";
  inherits: true;
  initial-value: 0deg;
}
```

このように記述することで、`--angle` に代入される値が角度であることを明示できるため、正しくブラウザによって解釈されるようになります。下記の例で正しくグラデーションのアニメーションが行われていることが確認できます。

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/GRbJxEr?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/GRbJxEr">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## カスタムプロパティによる構文チェック

`@property` ルールの `syntax` フィールドには許容される構文を指定します。記述できる構文は、あらかじめ定義された[データ型](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_Types)、もしくは記号を使ってデータ型拡張して指定できます。

あらかじめ定義されたデータ型は以下のようなものがあります。

- `<length>`
- `<number>`
- `<percentage>`
- `<length-percentage>`
- `<color>`
- `<image>`
- `<url>`
- `<integer>`
- `<angle>`
- `<time>`
- `<resolution>`
- `<transform-function>`
- `<custom-ident>`

例えば `<length>` は長さの値を表すデータ型で、`width` や `height`、`margin` などのプロパティに使用されます。`<length>` は `42px`、`1.5rem`、`100%` などのように `<number>` 型と 1 つ以上の単位を組み合わせたものです。

### 記号を使ったデータ型の拡張

あらかじめ定義されたデータ型に加えて、以下の記号を使用してデータ型を指定できます。

- `+`：スペースで区切られたリスト
- `#`：カンマで区切られたリスト
- `|`：or で複数のデータ型を指定

例として `<length>+` と定義されたデータ型は `1rem 2rem 3rem` のように `padding` や `margin` などのプロパティに使用される複数の長さの値を表します。

```css
@property --my-padding {
  syntax: "<length>+";
  inherits: true;
  initial-value: 0;
}

.my-element {
  --my-padding: 1rem 2rem 3rem;
  padding: var(--my-padding);
}
```

`<color>#` と定義されたデータ型は `#7bd389, #607466` のようにカンマで区切られた複数の色の値を表します。これは `rgp()` や `hsl()` などの色の値を複数指定する際に使用されます。

```css
@property --my-color {
  syntax: "<color>#";
  inherits: true;
  initial-value: #7bd389;
}

.my-element {
  --my-color: #7bd389, #607466;
  background: linear-gradient(to right, var(--my-color));
}
```

`<length>|<percentage>` と定義されたデータ型は `1rem | 100%` のように長さとパーセンテージのどちらかの値を表します。これは `width` や `height` などのプロパティに使用されます。

```css
@property --my-size {
  syntax: "<length>|<percentage>";
  inherits: true;
  initial-value: 100%;
}

.my-element {
  --my-size: 1rem | 100%;
  width: var(--my-size);
}
```

`red | blue | green` のように具体的な値を指定することもできます。

```css
@property --my-color {
  syntax: "red | blue | green";
  inherits: true;
  initial-value: red;
}

.my-element {
  --my-color: blue;
  color: var(--my-color);
}
```

### あらゆるデータ型を指定する `*`

`syntax` に `*` を指定することで、あらゆるデータ型を指定できます。この場合、カスタムプロパティにはどのような値が代入されてもエラーが発生しません。

```css
@property --my-value {
  syntax: "*";
  inherits: true;
  initial-value: 0;
}

.my-element1 {
  --my-value: 24px;
  font-size: var(--my-value);
}

.my-element2 {
  --my-value: blue;
  background-color: var(--my-value);
}
```

## カスタムプロパティの値の継承を防ぐ

`@property` ルールの `inherits` フィールドに `false` を指定することでカスタムプロパティに代入した値の継承を防ぐことができます。`inherits` フィールドに `false` を指定した場合、カスタムプロパティに代入された値はその要素のみに適用され、その要素の子孫要素には適用されません。

例を見てみましょう。`inherits` フィールドに `true` を指定した場合、`.parent` クラスに `--my-color` に `blue` が代入されているため、`.child` クラスにも `blue` が適用されます。これは通常の方法でカスタムプロパティを定義した場合と同じ挙動です。

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/GRbJdvB?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/GRbJdvB">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

`inherits` フィールドに `false` を指定した場合、子要素の `.child` クラスには `--my-color` の初期値である `red` が適用されます。

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/WNqvJEB?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/WNqvJEB">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

`inherits: false` を指定することで意図せぬ子要素に影響を与えることを防ぐことができます。

## まとめ

- `@property` ルールを使うことで、カスタムプロパティに対してデータ型の指定、初期値の設定、値の継承の有無を設定できる
- カスタムプロパティに対してデータ型を指定することで、誤った値の代入を防ぎ、適切なエラーメッセージを表示することができる
- `@property` ルールでデータ型を指定することでグラデーションのアニメーションなど従来は実装が難しかった機能をサポートすることができる

## 参考

- [CSS Properties and Values API Level 1](https://drafts.css-houdini.org/css-properties-values-api/#at-property-rule)
- [@property: Next-gen CSS variables now with universal browser support  |  Blog  |  web.dev](https://web.dev/blog/at-property-baseline?hl=en)
- [【CSS】@property構文を使ってカスタムプロパティ（CSS変数）にルールを定義する](https://yuito-blog.com/property-rule/#index_id13)
