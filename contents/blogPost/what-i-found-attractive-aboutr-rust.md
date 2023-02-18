---
id: 7bANHvvWNHjr9qeq6BNhhm
title: "Rust の魅力に感じた点"
slug: "what-i-found-attractive-aboutr-rust"
about: "最近は [Rust](https://www.rust-lang.org/) と呼ばれるプログラミング言語を趣味として触っています。[SWC](https://swc.rs/) や [Rome](https://rome.tools/) のように Rust で作成されたフロントエンドツールが増えていることから興味を持ったのですが、実際に触ってみて Rust が高い人気を誇る理由がよく分かるようになりました。  この記事では私が Rust を触ってみて魅力に感じた点を列挙していきます。"
createdAt: "2022-05-01T00:00+09:00"
updatedAt: "2022-05-01T00:00+09:00"
tags: ["Rust"]
published: true
---
最近は [Rust](https://www.rust-lang.org/) と呼ばれるプログラミング言語を趣味として触っています。[SWC](https://swc.rs/) や [Rome](https://rome.tools/) のように Rust で作成されたフロントエンドツールが増えていることから興味を持ったのですが、実際に触ってみて Rust が高い人気を誇る理由がよく分かるようになりました。

この記事では私が Rust を触ってみて魅力に感じた点を列挙していきます。

## 強い型推論

Rust の型推論は強力です。例えば、次のように `Vec` 型を宣言したタイミングでは `Vec<{unknown}>` という型に推論されます。この時点ではベクターにどのような型が入るか未確定だからです。

```rs
fn main() {
    let mut vec = Vec::new();
}
```

続いて `vec.push(1)` でベクターに要素を追加された時 `i32` 型が入るベクターであることが判明するのでさかのぼって `Vec<i32>` 型と推論されます。

## 関数型言語の機能

Rust 「手続き型」「オブジェクト指向型」「関数型」など様々なパラダイムを言語思想に取り入れていますが、とりわけ Haskel や scala などの関数型言語の影響を強く受けております。

例えば、値はデフォルトではイミュータブルであることが良い例です。Rust では値をミュータブルにする際には `mut` キーワードを付与する必要があります。

```rs
fn main () {
    let vec = Vec::new();

    vec.push(1);
    ^^^^^^^^^^^ cannot borrow as mutable
}
```

```rs
fn main () {
    let mut vec = Vec::new();

    vec.push(1);
}
```

`Option` 型や `Result` 型、パターンマッチングも Rust の重要な要素の1つです。`Option` は欠如しているかもしれない値を示します。

```rs
fn div(dividend: i32, divisor: i32) -> Option<i32> {
    if divisor == 0 {
        None
    } else {
        Some(dividend / divisor)
    }
}

fn try_division(dividend: i32, divisor: i32) {
    match div(dividend, divisor) {
        None => println!("{} / {} failed!", dividend, divisor),
        Some(quotient) => {
            println!("{} / {} = {}", dividend, divisor, quotient)
        },
    }
}
```

`Result` 型はエラーになる可能性がある表す値です。TypeScript でパターンマッチングを用いてエラーハンドリングを実施しようとするとどうしても言語仕様として　`try/catch` が入ってしまう危険性があったのですが、言語仕様として使えるのは嬉しいですね。

## エラーメッセージがわかりやすい

Rust のエラーメッセージはかなりわかりやすく設計されています。 Rust のコードを書いてる際に詰まったらとりあえずビルドしてみて、コンパイルエラーを発生させてみるのも良いでしょう。

例えば、`mut` キーワードを付与し忘れてイミュータブルなコードを書いてしまった場合には以下のようなメッセージが表示されます。

```sh
error[E0596]: cannot borrow `vec` as mutable, as it is not declared as mutable
 --> src/main.rs:3:5
  |
2 |     let vec = Vec::new();
  |         --- help: consider changing this to be mutable: `mut vec`
3 |     vec.push(1);
  |     ^^^^^^^^^^^ cannot borrow as mutable

For more information about this error, try `rustc --explain E0596`.
error: could not compile `hello1` due to previous error
```

`cannot borrow `vec` as mutable, as it is not declared as mutable` というなぜエラーが発生したかを示すメッセージが表示されるだけでなく、`help: consider changing this to be mutable: mut vec` のように行番号とともにコードの変更を提案してくれます。これのおかげでエディタの quick fix 機能を使用すれば大体のエラーは解決してくれます。

さらに、`rustc --explain [エラー番号]` コマンドによりエラーの詳細情報を取得することも可能です。

## 終わりに

簡単にですが、Rust を触ってみて魅力に感じた点をあげてみました。Rust は幅広い分野で活躍しているプログラミング言語であり、今後も活躍の幅が広がることが予想されるので、ぜひ一度触ってみてはいかがでしょうか？
