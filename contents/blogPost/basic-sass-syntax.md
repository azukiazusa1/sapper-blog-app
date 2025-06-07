---
id: rJoHnTp6n0BESbyfsh0Gz
title: "Sassの基礎文法"
slug: "basic-sass-syntax"
about: "SassはCSSのメタ言語です。CSSに比べてコード量が減り、保守性が優れるといった開発体験を向上させてくれる特徴があります。"
createdAt: "2021-03-28T00:00+09:00"
updatedAt: "2021-03-28T00:00+09:00"
tags: ["CSS", "Sass"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/6ADze8mrjH8iV9pCLekDeQ/27220daee3fa492a828aeae3a3cdb5d3/1200px-Sass_Logo_Color.svg.png"
  title: "sass"
audio: null
selfAssessment: null
published: true
---
# SASS記法とSCSS記法

Sass には、最初に作られた「SASS 記法」と「SCSS 記法」があります。
SASS 記法は、セレクタの後の `{}` の代わりにインデントを使用する、値の後の `;` セミコロンを省略できるといった、簡素化された記法が特徴です。
一方の SCSS 記法は CSS との互換性を高めた記法です。

実際にコードを書いてみると次のような違いがあります。

- sass

```sass
=card($color: #fff)
    background-color: $color;
    border: 1px solid rgba(0,0,0,.125);

.main
    font-size: 14px;
    width: 600px;
    .card
        +card(#888)
```

- scss

```scss
@mixin card($color: #fff) {
    background-color: $color;
    border: 1px solid rgba(0,0,0,.125);
}

.main {
    font-size: 14px;
    width: 600px;   

    .card {
        @include card(#888)
    }
}
```

現在では SCSS 記法が好まれて使用されています。そのため、この記事では SCSS 記法を中心に進めていきます。
なお動作確認は SassMeister で行っています。

https://www.sassmeister.com/

# ネスト

Sass の中でももっとも使われる機能の 1 つがネストです。
HTML の構造のように入れ子で書くことができます。実際に例を見てみましょう。

- scss

```scss
.main {
    width: 600px;
    font-size: 14px;

    section {
        margin-bottom: 50px;

        ui {
            list-style: none;
            overflow: hidden;
        }

        li {
            float: left;
        }
    }
}
```

- コンパイル結果

```css
.main {
  width: 600px;
  font-size: 14px;
}
.main section {
  margin-bottom: 50px;
}
.main section ui {
  list-style: none;
  overflow: hidden;
}
.main section li {
  float: left;
}
```

上記のように、`.main section` というセレクタを何度も書くことがなく入れ子構造に書くことができるのでスッキリしており、構造の把握も容易になります。
また `section` セレクタを `nav` セレクタに変更することになったとしても一箇所の修正だけで済むのでメンテナンス性が向上します。

## &(アンパサンド）

`&` を使用すると、ネストの中で親セレクタを参照できます。
例えば、次のように BEM ライクな記法をしたいときに重宝します。

- scss

```scss
.nav {
    margin-bottom: 50px;
    list-style: none;
    overflow: hidden;

    &__item {
        float: left;

        &--active {
            text-decoration: underline
        }
    }   
}
```

- コンパイル結果

```css
.nav {
  margin-bottom: 50px;
  list-style: none;
  overflow: hidden;
}
.nav__item {
  float: left;
}
.nav__item--active {
  text-decoration: underline;
}
```

ただし、デメリットとしてセレクタの検索可能性が損なわれることに注意してください。
例えば、HTML 内で `nav__item--active` というクラスが付与されているのを発見してそのクラス名でエディタ検索をかけてもヒットすることはありません。

## プロパティのネスト

ネストはルールセットだけでなくプロパティに使うこともできます。

- scss

```scss
.main {
    border: 1px solid #999 {
        bottom: 0;
    }
}
```

- コンパイル結果

```css
.main {
  border: 1px solid #999;
  border-bottom: 0;
}
```

しかしこれはあまり一般的とは言えません。可読性がそこまで高まるわけでもないので無理に使用する必要はないでしょう。

# 変数

[CSSのカスタムプロパティ](https://developer.mozilla.org/ja/docs/Web/CSS/Using_CSS_custom_properties)とは異なる文法で Sass の変数を使うことができます。
使用法は一般的なプログラミング言語で使われるものと大きく変わりません。

- scss

```scss
$primary: #1976D2;

.button {
    background-color: $primary;
}
```

- コンパイル結果

```css
.button {
  background-color: #1976D2;
}
```

## 変数のスコープ

Sass の変数のスコープには、以下のルールが存在します。

- 変数を使用する前に宣言する必要がある
- ルールセットの外部から使用できない

例えば、次のような書き方はコンパイルエラーとなります。

```scss
.main {
    $primary: #1976D2;

    /** スコープの範囲内で変数を使用しているのでOK */
    .card {
        color: $primary;
    }
}

/** ここはスコープの範囲外 *//
.button {
    background-color: $primary;
}
```

## インターポレーション（補完）

変数は基本的にプロパティの値として使用しますが、特にはセレクタや文字列の一部として変数を使用したい場合があります。
しかし、次のような書き方はコンパイルエラーとなってしまいます。

```scss
$selectorName: 'button';
$primary: #1976D2;

/** Erorr expected ":", */
$selectorName {
    background-color: #primary;
}
```

このような場合には、インターポレーション（補完）を使うことで解決します。参照したい変数名を `#{}` で囲って書きます。

- scss

```scss
$selectorName: 'button';
$primary: #1976D2;

#{$selectorName} {
    background-color: #primary;
}
```

- コンパイル結果

```css
button {
  background-color: #primary;
}
```

# 演算

数値に対して加算 `+`・減算 `-`・乗算 `*`・除算 `/`・`剰余`%`を用いて計算をできます。

- scss

```scss
.box1 {
    width: 500px + 10;
}

.box2 {
    width: 500px - 10;
}

.box3 {
    width: 500px * 10;
}

.box4 {
    width: (500px / 10);
}

.box5 {
    width: 500px % 10;
}
```

- コンパイル結果

```css
.box1 {
  width: 510px;
}

.box2 {
  width: 490px;
}

.box3 {
  width: 5000px;
}

.box4 {
  width: 50px;
}

.box5 {
  width: 0px;
}
```

除算については、font プロパティなどの指定で `/` が使われているため演算として機能させるために `()` で加工必要があります。
また加算では数値の計算だけでなく文字列の結合に使用することもできます。

ところで、CSS には `calc` という同じように演算ができる関数があります。
Sass の演算と `calc` の相違点は以下のとおりです。

- Sass
 - 計算済みの値を CSS にコンパイルする
 - 一部単位のことなる計算ができない

- CSS
 - ブラウザで動的に計算される
 - Sass にはできない単位の違う計算ができる

# @extend

`@extend` を用いると、指定したセレクタのスタイルを継承できます。
同じスタイルを継承によって使いまわすことができます。

- sass

```sass
.alert {
    position: relative;
    padding: .75rem 1.25rem;
    margin-bottom: 1rem;
    border: 1px solid transparent;
    border-radius: .25rem;

    &-primary {
        @extend .alert;
        color: #004085;
        background-color: #cce5ff;
        border-color: #b8daff;
    }
}
```

- コンパイル結果

```css
.alert, .alert-primary {
  position: relative;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
}
.alert-primary {
  color: #004085;
  background-color: #cce5ff;
  border-color: #b8daff;
}
```

`@extends` は次のセレクタに対して使うことができます。

- クラスセレクタ
- ID セレクタ
- 属性セレクタ
- 連結セレクタ
- 擬似クラス
- 疑似要素

一方で、子孫セレクタ・子セレクタ・隣接セレクタのように複数のパターンで成り立つセレクタには使うことができません。

## プレースホルダ

`@extend` はスタイルを継承する機能なので、継承元のセレクタも生成されます。
継承元のセレクタを生成したくないような場合には、継承元のセレクタに `#` を使い、継承先では `%` を用いて指定します。

- sass

```sass
%alert {
    position: relative;
    padding: .75rem 1.25rem;
    margin-bottom: 1rem;
    border: 1px solid transparent;
    border-radius: .25rem;
}

.alert {
    &-primary {
        @extend %alert;
        color: #004085;
        background-color: #cce5ff;
        border-color: #b8daff;
    }
}
```

- コンパイル結果

```css
.alert-primary {
  position: relative;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
}

.alert-primary {
  color: #004085;
  background-color: #cce5ff;
  border-color: #b8daff;
}
```

# @mixin

`@mixin` はスタイルを定義しておいて他の場所で使用するための機能です。
`@mixin` で定義したスタイルは `@include` で呼び出せます。

- scss

```scss
@mixin alert {
    position: relative;
    padding: .75rem 1.25rem;
    margin-bottom: 1rem;
    border: 1px solid transparent;
    border-radius: .25rem;
}

.alert {
    &-primary {
        @include alert;
        color: #004085;
        background-color: #cce5ff;
        border-color: #b8daff;
    }
}
```

- コンパイル結果

```css
.alert-primary {
  position: relative;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  color: #004085;
  background-color: #cce5ff;
  border-color: #b8daff;
}
```

この結果だけでは、`@extend` との違いがよくわからず使い分ける用途も感じられないでしょう。
しかし、`@mixin` を使うことで得られるメリットとして「引数」の存在が上げられます。

## 引数

`@mixin` を引数を使って利用することで、より柔軟にスタイルを適用できます。
引数を使うには、ミックスインの名称のあとに `()` を書きその中に引数となる変数を書きます。

- scss

```scss
@mixin alert($color, $backgroundColor, $borderColor) {
    position: relative;
    padding: .75rem 1.25rem;
    margin-bottom: 1rem;
    border: 1px solid transparent;
    border-radius: .25rem;
    color: $color;
    background-color: $backgroundColor;
    border-color: $borderColor;
}

.alert {
    &-primary {
        @include alert(#004085, #cce5ff, #b8daff);
    }

    &-danger {
        @include alert(#721c24, #f8d7da, #f5c6cb);
    }
}
```

- コンパイル結果

```css
.alert-primary {
  position: relative;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  color: #004085;
  background-color: #cce5ff;
  border-color: #b8daff;
}
.alert-danger {
  position: relative;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}
```

引数には初期値を設定できます。

- scss

```scss
@mixin alert($color: #004085, $backgroundColor: #cce5ff, $borderColor: #b8daff) {
    position: relative;
    padding: .75rem 1.25rem;
    margin-bottom: 1rem;
    border: 1px solid transparent;
    border-radius: .25rem;
    color: $color;
    background-color: $backgroundColor;
    border-color: $borderColor;
}

.alert {
    &-primary {
        @include alert;
    }

    &-danger {
        @include alert(#721c24, #f8d7da, #f5c6cb);
    }
}
```

- コンパイル結果

```css
.alert-primary {
  position: relative;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  color: #004085;
  background-color: #cce5ff;
  border-color: #b8daff;
}
.alert-danger {
  position: relative;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}
```

第一引数を省略して、第二引数のみを渡したいような場合には、引数を指定することで対応できます。

- scss

```scss
@mixin alert($color: #004085, $backgroundColor: #cce5ff, $borderColor: #b8daff) {
    position: relative;
    padding: .75rem 1.25rem;
    margin-bottom: 1rem;
    border: 1px solid transparent;
    border-radius: .25rem;
    color: $color;
    background-color: $backgroundColor;
    border-color: $borderColor;
}

.alert {
    &-primary {
        @include alert;
    }

    &-secondary {
        @include alert($backgroundColor: #d1ecf1);
    }
}
```

- コンパイル結果

```css
.alert-primary {
  position: relative;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  color: #004085;
  background-color: #cce5ff;
  border-color: #b8daff;
}
.alert-secondary {
  position: relative;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  color: #004085;
  background-color: #d1ecf1;
  border-color: #b8daff;
}
```

## 可変長引数

ところで、CSS のプロパティにはカンマ `,` を使うものがありますが、これを値として利用すると引数の区切りと認識されてエラーとなってしまうことがあります。

```scss
@mixin shadow($value) {
    box-shadow: $value;
}

.box {
    /** Error expected "{" */
    @include shadow(3px 3px red, -1em 0 .4em olive)
}
```

これを回避するには、文字列やリストとして渡す方法があります。

```scss
@mixin shadow($value) {
    box-shadow: $value;
}

.box {
    @include shadow((3px 3px red, -1em 0 .4em olive))
}

.box {
    @include shadow(unquote("3px 3px red, -1em 0 .4em olive"))
}
```

しかし、これらの方法は可読性がよくありません。
もう 1 つの方法として、引数の数を固定しないように可変長引数として `@mixin` を定義するという方法があります。

可変長引数は、引数の後に `...` と記述します。

- scss

```scss
@mixin shadow(...$value) {
    box-shadow: $value;
}

.box {
    @include shadow(3px 3px red, -1em 0 .4em olive)
}
```

- コンパイル結果

```css
.box {
  box-shadow: 3px 3px red, -1em 0 .4em olive;
}
```

可変長引数は、`@include` する際にも使用できます。

- scss

```scss
@mixin box($width, $height) {
   width: $width;
   height: $height;
}

$values: 300px, 200px;

.item {
    @include box($values...);
}
```

- コンパイル結果

```css
.item {
  width: 300px;
  height: 200px;
}
```
