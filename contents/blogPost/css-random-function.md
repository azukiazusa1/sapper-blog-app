---
id: hzE3Dp4-0Qhds6ytpigGe
title: "CSS でランダムな値を扱う `random()` と `random-item()` 関数"
slug: "css-random-function"
about: "`random()` と `random-item()` 関数は CSS でランダムな値を扱うための関数です。`random()` 関数は最小値と最大値を引数に取り、その範囲内のランダムな数値を返します。`random-item()` 関数は引数に渡したリストの中からランダムに 1 つの値を返します。"
createdAt: "2024-07-28T17:06+09:00"
updatedAt: "2024-07-28T17:06+09:00"
tags: ["CSS"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1bqQw9rxgBjXq2OvYb7nxZ/d9ba71d9cc533138ddff7430f3d8acfb/omikuji_6573.png"
  title: "omikuji 6573"
selfAssessment:
  quizzes:
    - question: "以下の `random()` 関数の引数に渡す値のうち、無効なものはどれか？"
      answers:
        - text: "random(--x, 100px, 200px)"
          correct: false
          explanation: "第 1 引数には任意のキャッシュオプションを指定することができます。"
        - text: "random(100px, 200%)"
          correct: false
          explanation: "データ型が同じであれば、単位が異なっていても問題ありません。"
        - text: "random(100px, 50deg)"
          correct: true
          explanation: "`random()` 関数の引数には同じデータ型の値を渡す必要があります。"
        - text: "random(100px, 200px, by 50px)"
          correct: false
          explanation: "任意の引数としてステップ数を指定することができます。"
published: true
---
!> `ramdom()`、`random-item()` 関数は 2024 年 7 月現在 [Editor Draft](https://www.w3.org/standards/types/#ED) として提案されている機能です。W3C によって標準化されておらず、将来仕様が変更される可能性があります。

[CSS Values and Units Module Level 5](https://drafts.csswg.org/css-values-5/) では、CSS でランダムな値を扱うための `random()` と `random-item()` 関数が提案されています。例えば毎回ランダムな色の組み合わせを表示したり、ランダムな回転をするアニメーションを表示するなどに使われるかもしれません。

## `random()` 関数

`random()` 関数は最小値と最大値を引数に取り、その範囲内のランダムな数値を返します。以下の例では `.card` 要素の横幅は 100px から 200px の間でランダムに設定されます。

```css
.card {
  width: random(100px, 200px);
}
```

上記の例の場合には `180px` や `123.5px`、`200px` などの値が返される可能性があります。`by 50px` のように先頭に `by` をつけた値を 3 番目の引数として渡すことで、ステップ数を指定できます。

```css
.card {
  width: random(100px, 200px, by 50px);
}
```

この場合、`100px`、`150px`、`200px` のいずれかの値のみが返される可能性があります。`50px` のステップから外れる `125px` や `175.5px` などの値は返されません。

関数の引数に渡す値は `calc()` 関数のように同じ[データ型](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_Types)であれば、単位が異なっていても問題ありません。例えば以下のように `px` と `%`、`rem` を混在させた指定も可能です。3 つの引数はすべて [`<length>`](https://developer.mozilla.org/ja/docs/Web/CSS/length) 型に解決されるためです。

```css
.card {
  width: random(100px, 200%, by 50rem);
}
```

ただし `random(100px, 50deg)` のように、異なるデータ型を混在させた場合には無効になります。

### キャッシュオプション

`random()` 関数は同じキャッシュキーで呼び出された場合、毎回同じ値を返すようになっています。`random()` 関数のキャッシュキーは以下のように決定されます。

- 最小値に使用された値
- 最大値に使用された値
- ステップ数に使用された値、未指定なら `null`
- 第 1 引数のキャッシュオプションに `--x` 形式で指定された値、未指定なら `null`
- 第 1 引数のキャッシュオプションに `per-element` が指定された場合、各要素ごとに異なるキャッシュキーを持つ

例えば以下のスタイルでは、`width` と `height` で指定されている `random()` 関数は同じキャッシュキーを持つため、常に同じ値が返されます。そのため、`.card` 要素は常に正方形として表示されることになります。

```css
.card {
  width: random(100px, 200px, by 50px);
  height: random(100px, 200px, by 50px);
}
```

それぞれの第 1 引数に異なるキャッシュオプションを指定することで、異なる値が返されるようになります。キャッシュオプションは `--x` のように [`<custom-ident>`](https://developer.mozilla.org/ja/docs/Web/CSS/custom-ident) 型として指定します。

```css
.card {
  width: random(--x, 100px, 200px, by 50px);
  height: random(--y, 100px, 200px, by 50px);
}
```

キャッシュキーに異なる単位が使われていたとしても、最終的な値が同じであれば同じキャッシュキーとして扱われます。以下の例は一見違う値を渡しているように見えますが、同一のキャッシュキーを持ち、常に同じ値が返されます。

```css
.card {
  font-size: 10px;
  width: random(100px, 200px, by 50px);
  height: random(10rem, 20rem, by 5rem);
}
```

#### `per-element` オプション

デフォルトでは `random()` が返す値はすべての要素で共有されます。例として `.card` 要素に対するスタイルがあるとします。

```css
.card {
  width: random(100px, 200px);
  height: random(100px, 200px);
}
```

HTML 上で `.card` 要素を複数配置した場合、すべての `.card` 要素は同じサイズで表示されることになります。

`random()` 関数の第 1 引数に `per-element` を指定することで、各要素ごとに異なる値を返すようになります。

```css
.card {
  width: random(per-element, 100px, 200px);
  height: random(per-element, 100px, 200px);
}
```

個の場合要素ごとでは異なる値が返されますが、同じ要素内であれば同一のキャッシュキーであるため、同じ値が返されます。つまり、`.card` 要素が 3 つあるとした場合。

1, `width: 150px; height: 150px;`
2, `width: 180px; height: 180px;`
3, `width: 120px; height: 120px;`

のようにそれぞれの要素ごとに異なる値が返されることになります。

## `random-item()` 関数

`random-item()` 関数は引数に渡したリストの中からランダムに 1 つの値を返します。`random()` 関数とは異なり、第 1 引数にキャッシュオプションを必ず指定する必要があります。

以下の例では `.card` 要素の背景色が `red`、`blue`、`green` のいずれかの色でランダムに設定されます。

```css
.card {
  background-color: random-item(--x; red; blue; green);
}
```

`random-item()` 関数では関数の引数の数がキャッシュキーとなります。以下の例では同一のキャッシュオプションの値と同じ個数の引数を持つため、常の同じインデックスの値が選択されます。

```css
.card {
  background-color: random-item(--x; red; blue; green);
  color: random-item(--x; white; black; gray);
}
```

`background-color` で `red` が選ばれた場合、`color` では同じインデックスである `white` が常に選ばれることになります。つまり、組み合わせは以下の 3 通りのみとなります。

- `red` と `white`
- `blue` と `black`
- `green` と `gray`

一方で同じキャッシュオプションを指定したとしても引数の数が異なる場合、それらは独立してランダムに選択されます。

```css
.card {
  background-color: random-item(--x; red; blue; green);
  color: random-item(--x; white; black;);
}
```

上記の例では 6 通りすべての組み合わせからランダムに選択されることになります。

## まとめ

- `random()` 関数は最小値と最大値を引数に取り、その範囲内のランダムな数値を返す
- `random-item()` 関数は引数に渡したリストの中からランダムに 1 つの値を返す
- `random()` 関数は同じキャッシュキーで呼び出された場合、毎回同じ値を返す。キャッシュキーは最小値、最大値、ステップ数、キャッシュオプションの値によって決定される
  - `random(100px, 200px)` と `random(100px, 200px)` は同じキャッシュキーを持つため、常に同じ値が返される
- `random-item()` 関数のキャッシュキーはキャッシュオプションの値と引数の数によって決定される
  - `random-item(--x; red; blue; green)` と `random-item(--x; white; black; gray)` は同じキャッシュキーを持つため、常に同じインデックスの値が選択される

## 参考

- [CSS Values and Units Module Level 5](https://drafts.csswg.org/css-values-5/#randomness)
- [\[css-values\] random() function · Issue #2826 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/2826)
- [CSS Values and Units Module Level 5 に追加された random() 関数が面白そう - WWW WATCH](https://hyper-text.org/archives/2023/11/css_random_functions/)
