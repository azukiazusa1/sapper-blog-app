---
id: gNIodqa7n5ubUaAZBPpMA
title: "【書評】RustとWebAssemblyによるゲーム開発は Rust 開発における設計を学べる良書"
slug: rust-wasm-game-dev-book
about: "本のタイトルは「Rust と WebAssembly によるゲーム開発」となっていますが、反して WebAssembly についての話題はほとんど出てきません。主に Rust における開発の設計についての話題が中心となっています。"
createdAt: "2023-07-30T22:39+09:00"
updatedAt: "2023-07-30T22:39+09:00"
tags: ["Rust", "WebAssembly", "書評"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/iKyk7yx16RAbEZ7t26n8y/90db505fc06729d9f9ca6922ce894739/matsubagani_10878.png"
  title: "松葉ガニ"
published: true
---

本のタイトルは「Rust と WebAssembly によるゲーム開発」となっていますが、反して WebAssembly についての話題はほとんど出てきません。主に Rust における開発の設計についての話題が中心となっています。

![](https://images.ctfassets.net/in6v9lxmm5c8/4Rg0PcIpc8wRfw8kVhKSud/63f55a52663152ebab85d3c9f9818b01/51xr5OIL9-L._SX218_BO1_204_203_200_QL40_ML2_.jpg)

![ゲーム画面のスクリーンショット。緑の木や山の背景、左に赤い帽子の男の子、すぐ右隣に岩が、画面右端に見切れる形で台座が描画されている](https://images.ctfassets.net/in6v9lxmm5c8/3p2uxCz6nx7oNlEHFWgkk5/a2aa25efcce93b805231f70c6b0e0bf1/____________________________2023-07-29_23.28.22.png)

本書籍の中で Rust の基本を理解していることを前提としており、文法などの説明は行われていません。もし Rust に全く触れたことがない場合には、[Rust ツアー](https://tourofrust.com/00_ja.html) のようなチュートリアルをひと通り進めると良いでしょう。

## 本書の内容

HTML の `<canvas>` を用いて 1 つのゲームを完成させることが本書の目的の 1 つです。実際に完成させるゲームは以下からプレイできます。

https://rust-games-webassembly.netlify.app/

Rust から WebAssembly を通じて DOM にアクセスする際には [web-sys](https://rustwasm.github.io/wasm-bindgen/api/web_sys/) クレートによりバインディングされた JavaScript の関数を呼び出すことになるのですが、JavaScript と同じコードを Rust で再現すると以下に「ノイズが多い」かを初っ端から思い知らされます。

例えば JavaScript で `<canvas>` のコンテキストを取得するには次のように書きます。

```js
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
```

Rust で書くといかに `unwrap()` が多いかがわかります。

```rust
let document = web_sys::.document().unwrap();
let canvas = document
    .get_element_by_id("canvas")
    .unwrap()
    .dyn_into::<HtmlCanvasElement>()
    .unwrap();

let ctx = canvas
    .get_context("2d")
    .unwrap()
    .unwrap()
    .dyn_into::<CanvasRenderingContext2d>()
    .unwrap();
```

他にもイベントハンドリングのコードは所有権の関係もあってかなり複雑になっています。このあたりは Rust が学習コストが高いと呼ばれるゆえんでもありますが、明示的なキャストや `.unwrap()` は Rust が明示性と安全性を重視した結果であることが説明されています。

## コンパイラ駆動開発

この書籍では設計パターンとして**タイプステートパターン**が採用されています。設計の詳細は書籍に譲りますが、**「無効な状態を表現不可能にする」**方法とのことです。これはある状態に対して誤った操作を行おうとすると、コンパイルエラーが発生することでミスを犯すことができないようにするというものです。

このような方法は\*\*コンパイラ駆動開発（Compiler-Driven Development）と呼ばれることもあり、強力な型システムとエラーの整備されたコンパイラをもつ Rust のような言語では非常に有効だと述べられています。

実際にこの書籍のハンズオンでは驚くべきほどの量のリファクタリング(!)を行わされます。ハンズオン形式で 1 つの成果物を作る形式で多くのリファクタリングは行われるのは、珍しいことではないでしょうか。さらに面白いことに、書籍の中で行うべきリファクタリングのコードはすべて掲載されていません。「コンパイルエラーに従えばリファクタリングが完了するので、後は自分たちでやってみてくれ！」といったスタイルです。（そして本当にコンパイルエラーに従うだけで進められるのです！）

この大量のリファクタリング作業を通じて、Rust が以下に安全な言語が身にしみてわかるようになります。実際に書籍を手に取った際には、必ず写経をしながら読み進めることをおすすめします。

## 口語が多く親しみやすい

最後にこの本の特徴として、口語が多く親しみやすいという点が挙げられます。コードの内容は多少難しく感じることもありますが、筆者がジョークを交えて親しみやすい口調でともに連れ添ってくれるので、かなり読みやすい本となっています。特に冒頭のこの部分が気に入っています。

> しかし、正直に言えば性能のために Rust と Wasm を使うわけではない。いずれにしろ性能は保証されるわけではない。Rust と Wasm を使うのは、Rust が好きだからだ。

## 関連本

Rust についての基礎的な内容は、以下の書籍を読んでおくと良いでしょう。

- [The Rust Programming Language 日本語版](https://doc.rust-jp.rs/book-ja/)
- [実践 Rust プログラミング入門](https://www.amazon.co.jp/dp/4798061700)

また、冒頭でも紹介した通り、WebAssembly についての内容はほとんど出てきません。WebAssembly についてより深く学びたい場合には、[ハンズオン WebAssembly ―Emscripten と C++を使って学ぶ WebAssembly アプリケーションの開発方法](https://www.amazon.co.jp/dp/4814400101)
がおすすめです。Rust で WebAssembly を扱う場合には、[Rust🦀 and WebAssembly🕸](https://moshg.github.io/rustwasm-book-ja/) がよいでしょう。
