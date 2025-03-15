---
id: CaY08P1qwKP0VwNMjJayF
title: "CSS で条件分岐を行う `@when/@else` ルール"
slug: "when-else-rule-in-css"
about: "`@when/@else` アットルールは条件付きスタイルをまとめて記述するためのルールです。`@media` や `@support` の条件を `@when` にわたすことで、`true` の場合には `@when` ブロック内のスタイルが、`false` の場合には `@else` ブロック内のスタイルが適用されます。このルールを使うことでより簡潔なコードを書くことができます。"
createdAt: "2024-06-22T15:36+09:00"
updatedAt: "2024-06-22T15:36+09:00"
tags: ["CSS"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/rIrCdSMM1pXR4pp61lGTv/c7c6594769f433827d72de586a180f2c/tropical-juice_illust_3389.png"
  title: "tropical-juice illust 3389"
selfAssessment:
  quizzes:
    - question: "画面サイズが 640px 以上の場合にスタイルを適用する CSS として正しいものはどれか？"
      answers:
        - text: "@when (min-width: 640px) { ... } @else { ... }"
          correct: false
          explanation: "@when の後には media　が必要です。"
        - text: "@if media(min-width: 640px) { ... } @else { ... }"
          correct: false
          explanation: "@if は存在しないルールです。"
        - text: "@when media(min-width: 640px) { ... } @else { ... }"
          correct: true
          explanation: null
        - text: "@when (min-width: 640px) { ... } @otherwise { ... }"
          correct: false
          explanation: "`@otherwise` は存在しないルールです。"
published: true
---
!> `@when/@else` アットルール 2024 年 6 月 22 日現在サポートされているブラウザはありません。実装状況については [Can I use](https://caniuse.com/css-when-else) を参照してください。

CSS `@when/@else` アットルールは `@media` や `@support` のような[条件付き規則](https://www.w3.org/TR/css-conditional-3/#conditional-group-rule)をまとめて記述するためのルールです。例えばメディアクエリを使って画面サイズが 640px 以上の場合には要素を表示し、それ以外の場合には非表示にするようなスタイルを記述する場合、以下のように記述できます。

```css
@when media (min-width: 600px) {
  .box {
    display: block;
  }
} @else  {
  .box {
    display: none;
  }
}
```

`@when` ルールには `boolean` を返す条件を記述し、条件が `true` の場合にブロック内のスタイルを適用します。`@else` ルールは条件が `false` の場合には `@else` ブロックのスタイルが適応されます。

`@else` にさらに条件を追加することも可能です。

```css
@when media (min-width: 640px) {
  .box {
    background-color: red;
  }
} @else media(min-width: 768px) {
  .box {
    background-color: blue;
  }
} @else  {
  .box {
    background-color: green;
  }
}
```

`@when/@else` ルールは、`@media` ルールや `@support` ルールと同様に、スタイルの適用を条件に基づいて変更するためのルールです。`@when` ルールには `@media` ルールと同様にメディアクエリを記述できますが、`@else` ルールはメディアクエリを記述することはできません。

-> この提案の初期段階では、`@when` を使用するか `@if` を使用するかについて議論がありました。`@if` 他の言語との一貫性があるものの、Sass などのプリプロセッサーですでに使用されており、既存のコードを壊す可能性があることから、`@when` が採用されました。

## `@when/@else` ルールの使用例

### 相互に排他的なスタイルを適用する

`@when/@else` ルールの使い所として、相互に排他的なスタイルを適用する場合があります。例えば `prefers-reduced-motion` メディアクエリを使って、ユーザーが動きを減らす設定をしている場合にはアニメーションを非表示にしたい場合を考えてみましょう。`@when/@else` を使わない場合、以下のように記述することになります。

```css
.animation {
  animation: slide-in 1s forwards;
}

@media (prefers-reduced-motion: reduce) {
  .animation {
    animation: none;
  }
}
```

動きを減らす設定をしているかどうかは ON/OFF の 2 通りであり、両方の値を同時に取ることがない相互排他的な条件です。上記のコードは設定が ON の場合のスタイルをトップレベルに記述し、設定が OFF の場合のスタイルをメディアクエリ内に記述しています。この書き方はメディアクエリを使用する際によく見かけますが、以下の理由からコードが複雑になる恐れがあります。

- スタイルの記述順によってはスタイルが上書きされる可能性がある
- 2 つのコードの間に他のスタイルが挟まると、ON/OFF のそれぞれのスタイルが分散してしまい、コードの可読性が低下する恐れがある

1 つ目の問題点について詳しく見てみましょう。CSS の優先度のルールでは、同じ詳細度のセレクタが複数ある場合後に記述されたスタイルが優先されます。下記のように `@media` ルールのスタイルを先に記述してしまうと、常に `animation: slide-in 1s forwards;` で上書きされてしまうため、`prefers-reduced-motion` メディアクエリのスタイルが適用されません。

```css
@media (prefers-reduced-motion: reduce) {
  .animation {
    animation: none;
  }
}

.animation {
  animation: slide-in 1s forwards;
}
```

`@when/@else` ルールを使えばこのように記述順を気にする必要がなくなります。

```css
@when media (prefers-reduced-motion: reduce) {
  .animation {
    animation: none;
  }
} @else  {
  .animation {
    animation: slide-in 1s forwards;
  }
}
```

### 複数の条件に基づくスタイルを記述する

複数の条件に同時に当てはまった場合のみスタイルを適用する場合に `@when/@else` ルールを使うことで簡潔に記述できます。例えば画面幅が 1024px 以上かつ、`grid` レイアウトがサポートされている場合に `grid` レイアウトを適用する場合、以下のように記述していました。

```css
@media (min-width: 1024px) {
  @supports (display: grid) {
    .container {
      display: grid;
    }
  }
}
```

上記のように複数の条件を同時に満たす場合のスタイルを書きたい場合には、ブロックをネストする必要がありました。さらに条件が増えるとネストがどんどん深くなり、コードが複雑になる恐れがあります。`@when/@else` ルールを使うと以下のよう `and` で条件を結合して記述できます。

```css
@when media (min-width: 1024px) and supports(display: grid) {
  .container {
    display: grid;
  }
}
```

## まとめ

- `@when/@else` ルールは条件付きスタイルをまとめて記述するためのルール
- `@when` ルールには条件を記述し、条件が `true` の場合にスタイルが適用される。`@else` ルールは条件が `false` の場合にスタイルが適用される。さらに `@else` にも条件を追加することができる
- できる相互に排他的にスタイルを適用する場合、`@when/@else` ルールを使うことでスタイルの記述順を気にする必要がなくなる
- 複数の条件に基づくスタイルを記述する場合、`@when/@else` ルールを使うことでネストを減らし、コードを簡潔に記述できる

## 参考

- [CSS Conditional Rules Module Level 5](https://www.w3.org/TR/css-conditional-5/#when-rule)
- [\[mediaqueries\]\[css-conditional\] else · Issue #112 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/112)
- [CSS 条件付き規則 （CSS Conditional Rules） Level 5 仕様 （草案） に追加された @when と @else 規則について - WWW WATCH](https://hyper-text.org/archives/2021/12/css_conditional_5_when_and_else/)
