---
id: x3UPi9MKZk2AI9yijRq7P
title: "CSS のカスケードレイヤー `@layer` を使ってスタイルを階層化して管理する"
slug: "manage-styles-structurally-with-css-cascade-layer"
about: "CSS の `@layer` ルールは、カスケードレイヤーを宣言するために使用されます。カスケードレイヤーとは、スタイルの優先度をレイヤー（階層）に分けて管理する仕組みです。`@layer` ルールを使用することでスタイルの記述順や詳細度に関係なくスタイルを宣言できるため、新しい形式の CSS 設計を実現することができます。"
createdAt: "2024-06-30T16:47+09:00"
updatedAt: "2024-06-30T16:47+09:00"
tags: [""]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/60sgROl1HDyfT8JBv1y7vY/cf334b2265f7bd1488cef4acfa8dea39/bird_cute_benimashiko_10921-768x591.png"
  title: "ベニマシコのイラスト"
selfAssessment:
  quizzes:
    - question: "`@layer reset, components, utilities;` で定義されたレイヤーで最も優先されるレイヤーはどれか"
      answers:
        - text: "reset"
          correct: false
          explanation: null
        - text: "components"
          correct: false
          explanation: null
        - text: "utilities"
          correct: true
          explanation: "最後に定義されたレイヤーが最も優先されます。"
published: true
---
CSS の `@layer` ルールは、カスケードレイヤーを宣言するために使用されます。カスケードレイヤーとは、スタイルの優先度をレイヤー（階層）に分けて管理する仕組みです。`@layer` ルールを使用することでスタイルの記述順や詳細度に関係なくスタイルを宣言できるため、新しい形式の CSS 設計を実現できます。

`@layer` ルールは CSS カスケーディングレベル 5 で定義されており、以下のように記述します。

```css
/**
  * レイヤーの優先順位を宣言
  * 右側のレイヤーが左側のレイヤーよりも優先される
  * reset と utilities で同じセレクタが定義されている場合、utilities のスタイルが適用される
  */
@layer reset, components, utilities;

/** スタイルの宣言 */
@layer reset {
  button {
    border: none;
    margin: 0;
    padding: 0;
  }
}

@layer components {
  button {
    background-color: blue;
    color: white;
  }
}

@layer utilities {
  .mt-0 {
    margin-top: 0;
  }
}

/** レイヤー化されていないスタイルは最も優先度が高くなる */
button {
  background-color: red;
}
```

## CSS の抱える問題

CSS を記述する際に特定の要素に対するスタイルを定義しているのにも関わらず、うまくスタイルが適用されないという問題に遭遇したことがある人は多いでしょう。このような問題は、大抵の場合競合するスタイルが存在することが原因です。まずはじめに、CSS で競合するスタイルが定義されている場合、どのスタイルが適用されるかを振り返ってみましょう。

ある要素に対して複数のスタイルが定義されている場合には、カスケードおよび詳細度によってどのスタイルが適用されるかが決定されます。例として、以下のようなスタイルが定義されている場合を考えてみましょう。

```html
<button class="btn">ボタン</button>

<style>
  .btn {
    background-color: blue;
  }

  button {
    background-color: red;
  }
```

上記の例では `button` 要素に対して赤色の背景色を指定している一方で、`btn` クラスに対して青色の背景色を指定しています。`<button class="btn">{:html}` という要素にはどちらのセレクタも適用されます。この場合、`background-color` の値は `blue` と `red` のどちらが適用されるでしょうか？

結論から述べると、`background-color: blue;` が適用されます。これは `.btn` クラスに対するスタイルが `button` 要素に対するスタイルよりも詳細度が高いためです。

詳細度とは CSS のセレクタの宣言に対して重み付けを決定するアルゴリズムです。簡易的な説明をすると、セレクタの種類や数によって詳細度が決まり、詳細度が高いほど優先されるという仕組みです。セレクタの種類は `ID > クラス > 要素` の順に詳細度が高くなります。

それでは、以下のように同じ詳細度のセレクタが複数ある場合にどのスタイルが適用されるのでしょうか？

```html
<button class="btn primary">ボタン</button>

<style>
  .btn {
    background-color: blue;
  }

  .primary {
    background-color: red;
  }
```

この場合はカスケードという仕組みによって、どのスタイル定義が適用されるか決定されます。カスケードの仕組みではスタイルが記述された順番によってスタイルの優先度が決定され、最も後に記述されたスタイルが適用されます。上記の例では、`.primary` クラスに対するスタイルが `.btn` クラスに対するスタイルよりも後に記述されているため、`background-color: red;` が適用されます。

さらに最も優先させたいスタイルを定義するために `!important` を使用することもできます。下記の例では、`button` 要素に対するスタイルに `!important` を付与しているため、スタイルの順番や詳細度に関係なく黄色の背景色が適用されます。

```html
<button class="btn primary">ボタン</button>

<style>
  .btn {
    background-color: blue;
  }

  button {
    background-color: yellow !important;
  }

  .primary {
    background-color: red;
  }
</style>
```

ここまで登場したコード例のように、小さなプロジェクトではスタイル定義がすべて目に見える範囲に収まっているため、どのスタイルが適用されるかといった問題は比較的簡単に解決できます。しかしプロジェクトが大きくなるにつれて、どの場所で定義されたスタイルが適用されているのか把握するのが徐々に難しくなります。

その場しのぎで `!important` を使用することでスタイルを上書きすることもできますが、これは CSS の管理をさらに破綻させる道への第一歩となります。次第に大半のスタイル定義に `!important` が付与されるようになり、認知負荷が増大してしまいます。

このような問題を対応するために、[BEM](https://en.bem.info/) や [SMACSS](https://smacss.com/ja/) のような CSS 設計手法が提案されてきました。これらの手法はスタイルを構造化するためのルールを提供することで、スタイルの管理を容易にできます。

しかし、このような設計手法を用いたとしても、サードパーティのライブラリやフレームワークとの競合によりスタイルが上書きされてしまうという問題は解決されていません。

このように、カスケードと詳細度の管理は CSS を利用するうえで最も難しい問題の 1 つとして挙げられています。カスケードの詳細度の仕組みは開発者自身によって明示的に制御できるものではなく、問題を回避することに重点を置かざるを得ない点が一因となっています。

## カスケードレイヤー `@layer` の導入

カスケードレイヤーの導入は開発者自身により明示的な方法でスタイルを管理することを可能にします。レイヤー間のスタイルの競合に詳細度は適用されず、レイヤー自身が持つ優先度によってスタイルが適用できるためです。

```css
@layer components {
  #button {
    background-color: blue;
    color: white;
  }
}

@layer utilities {
  .bg-red {
    background-color: red;
    color: white;
  }
}
```

上記のコード例では `#button` という ID セレクタと `.bg-red` というクラスセレクタがそれぞれ `components` レイヤーと `utilities` レイヤーに定義されています。レイヤーを考慮しない場合、ID セレクタがクラスセレクタよりも詳細度が高いため、`background-color: blue;` が適用されるはずです。

ただしここではどちらのスタイルもレイヤーに属しているため、詳細度の高低は考慮されず、レイヤー同士の優先度によってスタイルが適用されます。レイヤーの優先度は後に記述されたレイヤーが優先されるため、`utilities` レイヤーに定義されたスタイルが適用されます。

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/WNBqzVR?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/WNBqzVR">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

カスケードレイヤーはスタイルを割り当てずに単に名前付きレイヤーを宣言する方法でも作成できます。

```css
@layer reset;
```

この方法では複数のレイヤーを一度に定義できます。レイヤーを宣言する方法は、レイヤーの優先順位を示す目的で有効です。膨大な CSS ファイルをすべて把握することなく、1 行の宣言を見るだけでどのレイヤーが優先されるかを把握できます。

```css
@layer reset, components, utilities;

@layer reset {
  /** リセットスタイル */
}

@layer components {
  /** コンポーネントスタイル */
}

@layer utilities {
  /** ユーティリティスタイル */
}
```

`@import` ルールを使用して他の CSS ファイルを読み込む場合にも、`@layer` ルールを使用できます。これはサードパーティのライブラリやフレームワークのスタイルを低いレイヤーに配置することで、自身のスタイルが上書きされることを防ぐために有効です。

```css
@layer reset, framework, components, utilities;

@import "bootstrap.css" layer(framework);
```

このように `@layer` ルールを使用することで CSS のカスケードと詳細度の問題を意識せずに、開発者自身により定義されたレイヤーに基づいてスタイルを管理できます。

## カスケードレイヤーの注意点

カスケードレイヤーはあらゆる優先度の問題を解決するわけではないことに注意が必要です。カスケードレイヤーはセレクタの詳細度よりも高い優先度を持つものの、インラインスタイルや `!important` よりも低い優先度を持ちます。そのため、カスケードレイヤー内で `!important` を使用してしまうと、他のレイヤーに定義されたスタイルを上書きしてしまう可能性があります。

以下のコードでは `components` レイヤーよりも `utilities` レイヤーに定義されたスタイルが適用されるはずですが、`!important` により `components` レイヤーで定義されたスタイルに上書きされてしまいます。

```css
@layer components, utilities;

@layer components {
  .btn {
    background-color: blue !important;
    color: white;
  }
}

@layer utilities {
  .bg-red {
    background-color: red;
    color: white;
  }
}
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/wvbLjWo?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/wvbLjWo">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

また、どのレイヤーにも属さないスタイルは最も優先度が高くなるという仕様があります。下記のコードでは `components` レイヤーと `utilities` レイヤーに定義されたスタイルよりも、トップレベルに定義された `button { background-color: yellow; }`（レイヤーなし）が適用されます。

```css
@layer components, utilities;

@layer components {
  .btn {
    background-color: blue;
    color: white;
  }
}

@layer utilities {
  .bg-red {
    background-color: red;
    color: white;
  }
}

button {
  background-color: yellow;
  color: black;
}
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/VwOJxmZ?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/VwOJxmZ">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

この仕様は最も優先度を低くしたいスタイルを定義したい場合に有効に働きます。例えばリセット CSS を `@layer reset` と宣言しておくと、既存のレイヤー化されていないすべてのスタイルで必ず上書きされることが保証されます。従来の記述順に依存したスタイルの定義方法よりも管理が容易になります。

```css
@layer reset;

@layer reset {
  /** リセットスタイル */
}

/** この後に記述されるスタイルは常に reset レイヤーよりも優先度が高い */

button {
  /* ... */
}
input {
  /* ... */
}
```

ただし、複雑な CSS アーキテクチャをカスケードレイヤーで管理したいような場合には、カスケードレイヤーの仕様を理解した上で設計することが重要です。レイヤーなしのスタイルを定義すると常に上書きされてしまうため、意図せずスタイルが上書きされる可能性があります。

カスケードレイヤーを使用した CSS アーキテクチャを実現したい場合には、チーム内でよく議論したうえで事前に定義されたレイヤーのみを使用するといったルールを設ける必要があるでしょう。

## まとめ

- カスケードレイヤー `@layer` ルールを使用することで、スタイルの優先度をレイヤーに分けて管理することができる
- 従来の CSS はカスケードと詳細度によってスタイルの優先度が決定される。これは開発者自身によるできる従来明示的なスタイル管理ができないため、問題を回避することに重点を置かざるを得ないといった点で問題がある
- カスケードレイヤーを使用することでカスケードと詳細度の問題を意識せずに、開発者自身により定義されたレイヤーに基づいてスタイルを管理することができる
- `@layer` で定義されたスタイルはインラインスタイルや `!important` よりも低い優先度を持つ
- レイヤーなしのスタイルは最も優先度が高くなるため、常に上書きされる

## 参考

- [CSS Cascading and Inheritance Level 5](https://www.w3.org/TR/css-cascade-5/#layering)
- [@layer - CSS: カスケーディングスタイルシート | MDN](https://developer.mozilla.org/ja/docs/Web/CSS/@layer)
- [カスケード、詳細度、継承 - ウェブ開発を学ぶ | MDN](https://developer.mozilla.org/ja/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance)
- [A Complete Guide To CSS Cascade Layers | CSS-Tricks](https://css-tricks.com/css-cascade-layers/)
