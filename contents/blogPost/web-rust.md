---
id: 4zDMWNUeqabXITEdcA1jUn
title: "Web フロントエンドエンジニアなら当然 Rust も書けますよね？？"
slug: "web-rust"
about: "本記事では Yew を利用して Web アプリケーションを作成してみたいと思います。Yew は React や Vue などと同じくコンポーネントベースのフレームワークでインタラクティブな UI を作成できます。"
createdAt: "2022-02-27T00:00+09:00"
updatedAt: "2022-02-27T00:00+09:00"
tags: ["Rust", "Yew"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/79b4Pw5CDux1cMaTBi224f/3e993498c3f4c30a18a2164a4947c9ee/________________________.png"
  title: "rust"
audio: null
selfAssessment: null
published: true
---
!> 筆者はこの記事を書き始めてから Rust を学び始めた初心者です。

Rust と呼ばれる言語はわりかし新し目の言語であり、2016–2021 年の間 Stack Overflow Developer Survey で「もっとも愛されているプログラミング言語」で一位を獲得し続けている人気の高い言語であります。

Rust の得意とする分野は OS やコンパイラなどのいわゆる低レイヤーの領域ですが、Web サーバー、機械学習、コマンドラインアプリケーションなどさまざまな用途で利用されます。

Web フロントエンドの領域では高速化を目的として Rust から WebAssembly（以下、WASM）を生成して JavaScript から実行する用途がよく知られています。その他にも [SWC](https://swc.rs/) と呼ばれる Rust ベースで作成されているビルドツールが高速に動作することで注目を集めています。（実際に [jestの実行](https://swc.rs/docs/usage/jest) に試してみたところ実行時間が 3 倍ほどになって驚いています）

現状 WASM では JavaScript のように DOM や Web API を直接操作できないので計算負荷の高い特定の領域のパフォーマンスを改善する用途で使用されるのが主流となっています。そのため単に現状のコードを単に Rust に置き換えるだけでは望まれているパフォーマンスの工場は得られないでしょうし、単に複雑性をもたらすだけの結果になってしまうことでしょう。

そんな中、以下のような Rust で　Web フロントアプリケーションを作成するフレームワークも登場しています。

- [Yew](https://yew.rs/)
- [Percy](https://github.com/chinedufn/percy)
- [Seed](https://github.com/seed-rs/seed)
- [Perseus](https://github.com/arctic-hen7/perseus)
- [Sycamore](https://github.com/sycamore-rs/sycamore)

本記事では Yew を利用して Web アプリケーションを作成してみたいと思います。Yew は React や Vue などと同じくコンポーネントベースのフレームワークでインタラクティブな UI を作成できます。

## セットアップ

Yew を始めるには以下ツールが必要です。

- [Rust](https://www.rust-lang.org/)
- [Trunk](https://trunkrs.dev/) - Rust 用の WASM バンドラ
- [wasm32-unknown-unknown](https://doc.rust-lang.org/rustc/platform-support/wasm64-unknown-unknown.html) - 64 ビットメモリを使用する WebAssembly ターゲット。

まずは Rust のインストールが必要です。Yew を利用するには `1.56.0` 以上のバージョンが必要です。まだ Rust をインストールしていない場合には以下手順を参考にインストールします。

```sh
# macOS
$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

```sh
# インストールできたか確認
$ rustc --version 
rustc 1.59.0 (9d1b2106e 2022-02-23)

$ rustup --version 
rustup 1.24.3 (ce5817a94 2021-05-31)
info: This is the version for the rustup toolchain manager, not the rustc compiler.
info: The currently active rustc version is rustc 1.59.0 (9d1b2106e 2022-02-23)

$ cargo --version
cargo 1.59.0 (49d8809dc 2022-02-10)
```

https://www.rust-lang.org/tools/install

すでに Rust がコンピューターにインストールされているならば以下コマンドで最新版にアップデートしましょう。

```sh
$ rustup update
```

Rust のインストール or アップデートが完了したら [Cargo](https://doc.rust-lang.org/cargo/) を利用して Trunk をインストールします。Cargo は Rust におけるパッケージマネージャです。

```sh
$ cargo install trunk
```

最後に WASM ターゲットを追加します。

```sh
$ rustup target add wasm32-unknown-unknown
```

## プロジェクトの作成

ツールのインストールが完了したら、はじめての Cargo のプロジェクトを作成しましょう！

```sh
$ cargo new yew-app
```

以下のような構成のプロジェクトが作成されています。

```sh
tree yew-app/
yew-app/
├── Cargo.toml
└── src
    └── main.rs

1 directory, 2 files
```

プロジェクトが正常に作成されているか確認するために `cargo run` コマンドでコンパイルして実行してみましょう。「Hello, world!」が表示されるはずです。

```sh
$ cargo run
   Compiling yew-app v0.1.0 (~/yew-app)
    Finished dev [unoptimized + debuginfo] target(s) in 2.49s
     Running `target/debug/yew-app`
Hello, world!
```

それでは、作成した Cargo プロジェクトを Yew アプリケーションに変更しましょう。まずは `Cargo.toml` ファイルを編集します。

`[dependencies]` 配下に `yew` を追加します。

- Cargo.yaml

```diff
  [package]
  name = "yew-app"
  version = "0.1.0"
  edition = "2021"

  # See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

  [dependencies]
+ yew = { git = "https://github.com/yewstack/yew/" }
```

続いて `main.rs` ファイルを編集します。

- main.rs

```rs
use yew::prelude::*;

#[function_component(App)]
fn app() -> Html {
    html! {
        <h1>{ "Hello World" }</h1>
    }
}

fn main() {
    yew::start_app::<App>();
}
```

`yew::start_app` メソッドがアプリケーションのエントリーポインタになります。 `start_app` メソッドにより `<App>` コンポーネントを `<body>` タグにマウントします。

関数 `app` に対する `#[function_component(App)]` という表記は関数に対する [Attriutes](https://doc.rust-lang.org/reference/attributes.html) であり、この Attributes は関数コンポーネントであることを明示します。関数コンポーネントは React のそれとよく似ており Props を受け取り [Html](https://docs.rs/yew/latest/yew/) を返却します。

関数 `app` 内では `html!` マクロを使用しており `html!` マクロを使用することで jsx ライクなテンプレートを記述できます。

さらにルートディレクトリに `index.html` ファイルを生成します。

```index.html
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My first Yew app!</title>
</head>

<body>

</body>

</html>
```

ここまでの準備が完了したら以下コマンドで dev サーバーを立ち上げましょう！

```sh
$ trunk serve --open
```

コンパイルが完了すると http://127.0.0.1:8080/ が開かれブラウザで以下のように表示されます。

![スクリーンショット 2022-02-26 17.29.00](//images.ctfassets.net/in6v9lxmm5c8/7JuvUw2p51zGikGweTRCVw/9f7221494d89f4d7d7cf10185065f05b/____________________________2022-02-26_17.29.00.png)

またファイルを編集すると HMR のように変更を検知して自動で再ビルドされブラウザに反映されます。

![yew](//images.ctfassets.net/in6v9lxmm5c8/JaxWGxPP2AoHStCbtMk7s/4064294e67d2d963439891705a4d4630/yew.gif)

## TODO アプリの作成

それでは Yew を用いて簡単な TODO アプリを作成してみましょう。

完成形は以下のレポジトリを参照してください。

https://github.com/azukiazusa1/yew-todo-app

https://azukiazusa1.github.io/yew-todo-app/

まずは簡単に見た目を整えるために [Bootstrap](https://getbootstrap.com/) を追加しておきましょう。`index.html` の `<head>` タグ内に以下を追加します。

- index.html

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
```

### モジュールの分割

Yew は React や Vue などの人気のフロントエンドのフレームワークと同じくコンポーネントベースのフレームワークです。フロントエンドのアプリケーションにおいて、適切な粒度でコンポーネントに分割するのは至上命令と言えるでしょう。

コンポーネント分割の第一歩としてまずはヘッダーコンポーネントを作成してみましょう。`src` ディレクトリ配下に `components` ディレクトリを作成して `Header.rs` ファイルを作成しましょう。

```sh
src/
├── components
│   └── Header.rs
└── main.rs
```

関数コンポーネントを用いてヘッダーを作成します。

```rs
use yew::{function_component, html, Html};

#[function_component(Header)]
pub fn header() -> Html {
    html! {
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
          <a class="navbar-brand" href="#">{"Yew TODO App"}</a>
        </div>
      </nav>
    }
}
```

`#[function_component(_)]` Attributes を用いて関数コンポーネントであるということを明示します。`function_component` 関数の引数にはコンポーネントの名前を渡します。上記例では `Header` という名前を渡しているのでこのコンポーネントは `<Header />` として使用できます。

関数コンポーネントは必ず `Html` を返す必要があるので `html!` マクロを使用してテンプレートを定義します。

もう 1 つ大事な点として `fn` の関数宣言の前に `pub` を修飾していることに注意してください。これはパブリックな要素であることを意味します。デフォルトではモジュール内の要素はすべてプライベートとなっておりモジュールの外の要素からはアクセスできません。`pub` を修飾することによってはじめてモジュール外からアクセスできます。

#### モジュールを宣言する

それでは `main.rs` から作成したヘッダーコンポーネントを呼び出して使用したいところなのですが、今の状態ではこれを呼びだすことができません。

Rust ではルートファイル（この例では `src/main.rs`）において `mod` キーワードを用いてモジュールを宣言する必要があります。この宣言がなけらばそのファイルはないものとして扱われます。

また `src/main.ts` から見ると `header.rs` は `components/header.rs` という階層に存在しますが次のように階層的にモジュールを宣言することはできません。

```
mod components::Header; // error: expected one of `;` or `{`, found `/`
// or
mod components/Header; // error: expected one of `;` or `{`, found `/`
```

階層的なモジュールを宣言するにはまずディレクトリ名と同名のファイルを作成します。ここでは `src/components.rs` ファイルを作成します。

- src/components.rs

```rs
pub mod header;
```

このファイルの中で `components` フォルダの中で公開したいモジュールをすべて宣言します。ここでも `pub` を修飾する必要があります。

その後ルートファイル（`scr/main.rs`）において `components` モジュールを宣言することで `components/header.rs` を使用できます。

- main.rs

```rs
mod components
```

モジュールを読み込むには `use` キーワードを使用します。階層の区切りには `::` を使用します。`Header` コンポーネントを呼び出して `App` コンポーネント内で使用してみましょう。

- main.rs

```rs
use yew::prelude::*;
use components::header::Header;

mod components;

#[function_component(App)]
fn app() -> Html {
    html! {
        <Header />
    }
}

fn main() {
    yew::start_app::<App>();
}
```

ここまでで問題がなければヘッダーが描画されていることでしょう。

![スクリーンショット 2022-02-26 20.42.01](//images.ctfassets.net/in6v9lxmm5c8/40s52E1xqDvz2pIE7JdbNd/af2247ab1c166afb15622d2d966c2dd9/____________________________2022-02-26_20.42.01.png)

### Props 

続いて TODO アイテムのリストレンダリングを実装しましょう。まずは `components` ディレクトリ配下に以下のファイルを作成しましょう。

```sh
src/
├── components
│   ├── todo
│   │   ├── todo_item.rs
│   │   ├── todo_list.rs
│   │   └── types.rs
│   └── todo.rs
```

`components.rs` と `components/todo.rs` のそれぞれでモジュールを宣言します。

- components.rs

```diff rs
  pub mod header;
+ pub mod todo
```

- components/todo.rs

```rs
pub mod todo_item;
pub mod todo_list;
pub mod types;
```

初めに TODO の型を定義しておきましょう。Rust では `struct` キーワードを用いて構造体を定義できます。`components/todo/types.rs` に構造体を定義します。

```rs
#[derive(PartialEq, Clone)]
pub struct Todo {
  pub id: usize,
  pub title: String,
  pub completed: bool,
}
```

構造体の各フィールドに対しても `pub` 修飾子を付与する必要があることに注意してください。

続いて `TodoItem` コンポーネントを作成します。これは 1 つの TODO アイテムを Props として受け取り描画することとします。

Props を定義するには `Properties` トレイトを継承（[Derive](https://doc.rust-lang.org/reference/attributes/derive.html#derive)）する必要があります。

トレイトとはある任意の型に対して抽象的な共通の振る舞いを定義する仕組みです。これは他の言語におけるインターフェイスと呼ばれる機能によく似ています。

トレイトは `impl トレイトA for 型B` という構文で型 B に対してトレイトの振る舞いを実装でき、型 B はトレイト A のインスタンスであるということを制約します。

トレイトを実装するたびに毎回 `imple` キーワードを用いるのは面倒ですので `derive` アトリビュートがよく使用されます。

`derive` は `#[derive(トレイトA, トレイトB, ...)]` という構文で使用します。

```rs
use yew::{function_component, html, Html, Properties}; // Properties を yew から持ち込む
use components::todo::types::Todo;

#[derive(Properties, PartialEq)] // Properties, PartialEq を継承した構造体を作成
pub struct TodoItemProps {
  pub title: String,
  pub completed: bool,
}
```

ここでは Props 型を定義するために必要な `Properties` トレイトの他に `PartialEq` トレイトも継承しています。`Properties` トレイトは ` PartialEq` トレイトを実装している必要があるためです。

`PartialEq` トレイトは値の比較に関するトレイトです。 `Properties` トレイトが `PartialEq` トレイトを実装している必要があるのは Props の変更を Yew が検知する必要があるためです。

次に、コンポーネント内で Props を使用するために関数コンポーネントの引数として Props の参照を渡します。

```rs

#[function_component(TodoItem)]
pub fn todo_item(props: &TodoItemProps) -> Html {
  html! {
    <li class="list-group-item">
    <input class="form-check-input me-2" type="checkbox" checked={props.completed} />
      {&props.title}
    </li>
  }
}
```

`String` 型の変数を `html!` マクロを用いて描画する際には `{&props.title}` のように参照を渡さなけばいけないことに注意してください。`String` 型コピートレイトと呼ばれるトレイト（トレイトについては後述）を実装していないので値のコピーをできず所有権が `props.title` に残り続けているためコンパイルエラーとなります。`&` を付与して参照を渡すことにより所有権を借用させなければなりません。

正しく描画されているか確認してみましょう。`components/todo/todo_list.rs` ファイルを編集します。

- components/todo/todo_list.rs

```rs
use yew::{function_component, html, Html};
use crate::components::todo::todo_item::TodoItem;
use crate::components::todo::types::Todo;

#[function_component(TodoList)]
pub fn todo_list() -> Html {
  let todo = Todo {
    id: 1,
    title: "Learn Rust".to_string(),
    completed: false,
  };
  html! {
    <ul class="list-group">
      <TodoItem title={todo.title} completed={todo.completed} />
    </ul>
  }
}
```

`TodoItem` コンポーネントと `Todo` 構造体を読み込み簡単に 1 つだけ TODO を作成して描画しています。

` Todo { ... } ` の箇所で Todo 構造体のインスタンスを作成して `todo` 変数に代入しています。

```rs
  let todo = Todo {
    id: 1,
    title: "Learn Rust".to_string(),
    completed: false,
  };
```

`title` には `String` 型が要求されますが Rust においてダブルクォート `" "` で文字リテラルを宣言した場合には UTF-8 の配列のスライスである `&str` 型として生成されます。そのため `to_string()` メソッドを呼び出して `String` 型に変換する必要があります。

Props を渡すときは React と同じように属性として渡します。

```rs
<TodoItem title={todo.title} completed={todo.completed} />  
```

続いて `main.rs` ファイルを編集して `TodoList ` コンポーネントを描画しましょう。

```diff rs
  use yew::prelude::*;
  use components::header::Header;
+ use components::todo::todo_list::TodoList;

  mod components;

  #[function_component(App)]
  fn app() -> Html {
    html! {
-     <Header />
+     <>
+       <Header />
+       <main class="container-fluid mt-2">
+         <TodoList />
+       </main>
+     </>
+   }
+ }

  fn main() {
    yew::start_app::<App>();
  }
```

`html!` マクロの中ではルート要素はただ一つである必要があるのでフラグメント `<></>` を追加しています。ブラウザから表示を確認してみましょう。

1 つのリストが表示されているはずです。

![スクリーンショット 2022-02-27 9.49.25](//images.ctfassets.net/in6v9lxmm5c8/548eTBmyIpVE4PP05waXXo/8b2c03b18185067b65a52bd497fb10b9/____________________________2022-02-27_9.49.25.png)

### リストレンダリング

リストにただ一つのアイテムしか表示されないのは寂しいので TODO アイテムを配列で宣言してリストとして表示してみましょう。

Rust における配列は固定長であり、初めに定めたサイズ以上の要素を入れることができないのでユーザー操作の伴う操作には適さないでしょう。

可変長の配列を使用したい場合には標準ライブラリのベクタ [std::vec](https://doc.rust-lang.org/std/vec/) を利用します。ベクタ型はいつでも配列の要素を追加したり削除したりできます。

```rs
// `vec!` マクロでベクタを初期化する
// ベクタの要素を追加・削除する場合には `mut` キーワードで
// 変数がイミュータブルであることを宣言する必要がある
let mut xs = vec![1, 2, 3];
// 末尾に新しい要素を追加
xs.push(4);
println!("Vector: {:?}", xs); // Vector: [1, 2, 3, 4]
```

それでは `components/todo/todo_list.rs` を編集して TODO アイテムのベクタを宣言しましょう。

```rs
let todo_items= vec![
  Todo {
    id: 1,
    title: "Learn Rust".to_string(),
    completed: false,
  },
  Todo {
    id: 2,
    title: "Learn Yew".to_string(),
    completed: true,
  },
  Todo {
    id: 3,
    title: "Go shopping".to_string(),
    completed: false,
  },
];
```

このベクタをリストレンダリングするためにはベクタ内のそれぞれの要素を `Html` に変換する必要があります。それではやってみましょう。

```rs
html! {
  <ul class="list-group">
    {todo_items.iter().map(|todo| html! {
      <TodoItem title={todo.title.clone()} completed={todo.completed} />
    }).collect::<Html>()}
  </ul>
}
```

1 つ見ていきましょう。

`iter()` はベクタの要素に対するイテレータを生成します。イテレータを使用することでおなじみに `map`,`filter`,`for_each` のような連続の要素に対して一連の作業を行うことができます。

`map()` はイテレータの要素を変更し新たなイテレータを返します。これは React のリストレンダリングと同様のパターンですので理解しやすいでしょう。`map` にわたすクロージャーでは `html!` マクロを使用して `<TodoItem>` コンポーネントを描画しています。

ここで注意したいのは **`map` を呼び出しただけでは何も行わない**ということです。`map()` のようにイテレータを別の種類に変換するイテレータはイテレータアダプタとして知られています。イテレータアダプタは常に遅延評価されるため実際に消費されるまで `map` のクロージャーは決して呼ばれることはありません。

```rs
let xs1 = vec![1, 2, 3];
let xs2 = xs1.iter().map(|x| x * 2);

println!("{:?}", xs2); // Map { iter: Iter([1, 2, 3]) }
```

イテレータを消費するには `collect()` メソッドを使用します。`collect()` メソッドはイテレータを消費して結果の値をコレクション型として集結させます。

```rs
let xs1 = vec![1, 2, 3];
let xs2: Vec<i32> = xs1.iter().map(|x| x * 2).collect();

println!("{:?}", xs2); // [2, 4, 6]
```

`collect()` メソッドにはジェネリクスとして `Html` を渡しています。

ブラウザの表示を確認してみましょう。

![スクリーンショット 2022-02-27 11.05.38](//images.ctfassets.net/in6v9lxmm5c8/01476pN3vgcniwArbYQ66c/89567201625894be40794f40fb9df6b3/____________________________2022-02-27_11.05.38.png)

### hooks

つづいて新たに TODO を生成するためにフォーム入力を作成しましょう。`components/todo` 配下に `todo_form.rs` ファイルを作成します。

```sh
src/
├── components
│   ├── todo
│   │   ├── todo_form.rs
│   │   ├── todo_item.rs
│   │   ├── todo_list.rs
│   │   └── types.rs
│   └── todo.rs
```

`components/todo.rs` を編集してモジュールを宣言することも忘れないでください。

```diff rs
+ pub mod todo_form;
  pub mod todo_item;
  pub mod todo_list;
  pub mod types;
```

簡単に `TodoForm` コンポーネントを作成します。この時点ではただ `<input>` 要素が存在するだけで状態の管理は行いません。

- components/todo/todo_form

```rs
use yew::{function_component, html, Html};

#[function_component(TodoForm)]
pub fn todo_item() -> Html {
  html! {
    <form class="mb-5">
      <div class="mb-3">
        <label for="title" class="form-label">{"タイトル"}</label>
        <input type="text" class="form-control" id="title" />
      </div>
      <button type="submit" class="btn btn-primary">{"追加"}</button>
    </form>
  }
}
```

`main.rs` を編集して `<TodoForm>` コンポーネントを配置しましょう。

- main.rs

```diff rs
  use yew::prelude::*;
  use components::header::Header;
  use components::todo::todo_list::TodoList;
+ use components::todo::todo_form::TodoForm;

  mod components;

  #[function_component(App)]
  fn app() -> Html {
    html! {
      <>
        <Header />
        <main class="container-fluid mt-2">
+         <TodoForm />
          <TodoList />
        </main>
      </>
    }
  }

  fn main() {
    yew::start_app::<App>();
  }  
```

次のように描画されています。

![スクリーンショット 2022-02-27 13.40.32](//images.ctfassets.net/in6v9lxmm5c8/6N6TGo1esnfbngf9ZfOfPL/9345924a873f47ea222185d1c3b3c275/____________________________2022-02-27_13.40.32.png)

続いて、ユーザーの入力した値を保持できるように hooks を利用しましょう。そう、あの hooks です。

関数コンポーネント内で状態を管理するために [use_state](https://yew.rs/docs/concepts/function-components/pre-defined-hooks#use_state) フックを使用します。`use_state@ は初期値を返却する関数を引数に受け取ります。下記例では初期値を返す関数に[クロージャー](https://doc.rust-jp.rs/book-ja/ch13-01-closures.html)使用しています。クロージャーは簡単に言うと匿名関数です。クロージャーは `||` で定義され引数があれば `|arg1, arg2|` のように `||` の間に入れます。

```rs
let counter = use_state(|| 0)
```

`use_state` は `UseStateHandle` を返します。`UseStateHandle` は `set` メソッドにより値を設定します。また `UseStateHandle` より現在の状態を取得するには `*` 演算子により参照を外す必要があります。

```re
let counter = use_state(|| 0)
counter.set(*counter *+1);
```

`use_state` は新たな状態がセットされるたびにコンポーネントが再描画されます。新たな状態が前回の値と異なる場合のみに再描画をしたいような場合には [use_state_eq](https://yew.rs/docs/concepts/function-components/pre-defined-hooks#use_state_eq) が使えます。

それでは実際に `<TodoForm>` コンポーネントでフォームの値を `use_state` で保持するようにしましょう。

- components/todo/todo_form

```rs
use yew::{Callback, InputEvent, function_component, html, Html, use_state};

#[function_component(TodoForm)]
pub fn todo_item() -> Html {
  let title = use_state(|| "".to_string());

  let oninput = {
    let title = title.clone();
    Callback::from(move |e: InputEvent| {
      let value = e.data();

      match value {
        Some(value) => {
          title.set((*title).clone() + &value);
        }
        None => {
          title.set("".to_string());
        }
      }
    })
  };

  html! {
    <form class="mb-5">
      <div class="mb-3">
        <label for="title" class="form-label">{"タイトル"}</label>
        <input type="text" value={(*title).clone()} {oninput} class="form-control" id="title" />
      </div>
      <div class="mb-3">
        {&*title}
      </div>
      <button type="submit" class="btn btn-primary">{"追加"}</button>
    </form>
  }
}
```

順番に処理を見ていきましょう。まずは `use_state` で空の文字列を初期状態として定義します。

```rs
let title = use_state(|| "".to_string());
```

定義した状態を `<input>` 要素にバインドさせます。ついでに現在の状態を確認できるように状態を描画しておきましょう。

```rs
<div class="mb-3">
  <input type="text" value={(*title).clone()} {oninput} class="form-control" id="title" />
</div>
<div class="mb-3">
  {&*title}
</div>
```

また `<input>` 要素で `oninput` イベントを購読するようにします。`{oninput}` は `oninput={oninput}` と同様です。

イベントリスナーのコールバックとして `oninput` を定義します。イベントリスナーに対しては [Callback](https://docs.rs/yew/latest/yew/callback/enum.Callback.html) を割当します。

```rs
let oninput = {
  let title = title.clone();
  Callback::from(move |e: InputEvent| {
    let value = e.data();

    match value {
      Some(value) => {
        title.set((*title).clone() + &value);
      }
      None => {
        title.set("".to_string());
      }
    }
  })
};
```

初めに `title.clone()` で `title` のコピーを取得します。コピーを取得する理由は後ほど出現する `move` キーワードによって所有権が移動するためです。

`Callback::from()` ではクロージャーを使用していますがここでは `move` キーワードが出現しています。`move` キーワードを使用することでクロージャの外の環境からキャプチャして変数の所有権を奪うことをクロージャに強制できます。`move` キーワードがなければ所有権を単に借用するにすぎません。

まず、前提として Rust では値の所有権を有していなければその値を更新できません。クロージャーの中で `title` に値をセットしたいので所有権を奪う必要があるのです。

詳しくは以下を参照ください。

[クロージャで環境をキャプチャする](https://doc.rust-jp.rs/book-ja/ch13-01-closures.html#%E3%82%AF%E3%83%AD%E3%83%BC%E3%82%B8%E3%83%A3%E3%81%A7%E7%92%B0%E5%A2%83%E3%82%92%E3%82%AD%E3%83%A3%E3%83%97%E3%83%81%E3%83%A3%E3%81%99%E3%82%8B)

続いてクロージャの引数については `yew::InputEvent` を指定しています。`InputEvent` のような Web API に存在する型は [web-sys](https://rustwasm.github.io/wasm-bindgen/api/web_sys/) と呼ばれるクリートで定義されていますが、これらのイベントの型は yew によって再エクスポートされているので yew からインポートすることが推奨されています。

ユーザーの入力値は `InputEvent` の `data()` から取得できますが、これは [Option](https://doc.rust-jp.rs/rust-by-example-ja/std/option.html) という値に包まれています。`Option<T>` 型は取得できるかどうかわからない値を表現する列挙型です。

`Option<T>` 列挙型は値があることを示す `Some(value)` または値がないことを示す `None` のどちらかの値を取ります。

`Option<T>` 列挙型から値を取得するためには [match](https://doc.rust-jp.rs/book-ja/ch06-02-match.html) 演算子によるパターンマッチングを利用します。

```rs
let value = e.data();

match value {
  Some(value) => {
    title.set((*title).clone() + &value);
  }
  None => {
    title.set("".to_string());
  }
}
```

`Some(value)` にマッチした場合には入力された文字列が得られるのでこれを現在の状態に結合して新たな状態としてセットします。

うまくいけば、次のようにフォームをコントロールできます。

![form-control](//images.ctfassets.net/in6v9lxmm5c8/6Ar1MtUWkyuYMeicQ3CCZR/e15b8480af0ad95d6934233eda083e42/form-control.gif)

### コンポーネントをインタラクティブにする

現在の入力値を保持できたので、追加ボタンをクリックしたときに TODO リストに追加されるようにしましょう。まずは `onclick` イベントを購読するようにしましょう。

```rs
  let onclick = {
    let title = title.clone();
    Callback::from(move |_| {})
  };

  html! {
    <form class="mb-5">
      // ..
      <button type="submit" onclick={onclick} class="btn btn-primary">{"追加"}</button>
    </form>
  }
```

ここで本当にボタンが押されたときに `onclick` が呼ばれているのかどうか確認したいのですが、Rust からは直接 `console.log()` のような Web API にはアクセスできません。`console.log()` を呼び出せないのはちょっと不便なので [https://crates.io/crates/wasm-logger](https://crates.io/crates/wasm-logger) と呼ばれるクリートを追加しましょう。`Cargo.toml` ファイルを編集して `
[dependencies]` に追加します。

- Carto.toml

```
[dependencies]
log = "0.4.6"
wasm-logger = "0.2.0"
```

次に `main()` 関数で `wasm-logger` を初期化します。

- main.rs

```diff rs
  fn main() {
    yew::start_app::<App>();
+   wasm_logger::init(wasm_logger::Config::default());
  }
```

これで `log::info!()` を呼び出すことにより `cosole.log()` を呼ぶことができます。

- components/todo/todo_form.rs

```rs
  let onclick = {
    let title = title.clone();
    Callback::from(move |e: MouseEvent| {
      e.prevent_default();
      log::info!("title: {:?}", *title);
    })
  };
```

![console](//images.ctfassets.net/in6v9lxmm5c8/20TaKIOqkEJLmbcZql8Sjf/cecda7061276f6272c65205b26c5c131/console.gif)

ボタンをクリックすると devtools にログが表示されることがわかりました。

親コンポーネントに「追加」ボタンが押されたことを伝えるために `Props` に `on_add` コールバック関数を追加します。Props にコールバック関数を追加する際には `Callback<T>` 型とします。

```rs
#[derive(Properties, PartialEq)]
pub struct TodoFormProps {
  pub on_add: Callback<String>
}

#[function_component(TodoForm)]
pub fn todo_item(props: &TodoFormProps) -> Html {
```

`on_add` Props の `emit()` メソッドを呼び出すことで親コンポーネントに対してイベントが発生したことを伝えます。

```rs
  let onclick = {
    let on_add = props.on_add.clone();
    let title = title.clone();
    Callback::from(move |e: MouseEvent| {
      e.prevent_default();
      title.set("".to_string());
      on_add.emit((*title).clone());
    })
  };
```

親コンポーネントから `on_add` イベントを購読しましょう。

- main.rs

```rs
#[function_component(App)]
fn app() -> Html {
  let on_add = {
    Callback::from(move |title: String| {
      log::info!("on_add: {:?}", title);
    })
  };

  html! {
    <>
      <Header />
      <main class="container-fluid mt-2">
        <TodoForm {on_add} />
        <TodoList />
      </main>
    </>
  }
}
```

![on add](//images.ctfassets.net/in6v9lxmm5c8/7kTNfxQKraOxKtF3QS6JYT/f7846b2d42cc1218e53375e700b23f92/on_add.gif)

最後に、`on_add` 関数が呼ばれたときに `todo_items` ベクタに要素を追加するようにしましょう。

`main.rs` ファイルを編集します。

- main.rs

```rs
#[function_component(App)]
fn app() -> Html {
  let todo_items = use_state(|| Vec::<Todo>::new());
  let next_id = use_state(|| 1);

  let on_add = {
    let todo_items = todo_items.clone();
    Callback::from(move |title: String| {
      let mut current_todo_items = (*todo_items).clone();
      current_todo_items.push(Todo {
        id: *next_id,
        title,
        completed: false,
      });
      next_id.set(*next_id + 1);
      todo_items.set(current_todo_items);
    })
  };

  html! {
    <>
      <Header />
      <main class="container-fluid mt-2">
        <TodoForm {on_add} />
        <TodoList todo_items={(*todo_items).clone()} />
      </main>
    </>
  }
}
```

`use_state` で `todo_items` と `next_id` を定義します。`todo_items` の初期値には空のベクターを渡します。`next_id` は TODO アイテムが追加されるたびにインクリメントすることで一意な値とします。

`<TodoList>` コンポーネントでは `todo_list` をコンポーネント内部で定義していたのを Props で渡すように修正します。

- components/todo/todo_list

```rs
use yew::{function_component, html, Html, Properties};
use crate::components::todo::todo_item::TodoItem;
use crate::components::todo::types::Todo;

#[derive(Properties, PartialEq)]
pub struct TodoItemProps {
  pub todo_items: Vec<Todo>,
}

#[function_component(TodoList)]
pub fn todo_list(props: &TodoItemProps) -> Html {
  html! {
    <ul class="list-group">
      {props.todo_items.iter().map(|todo| html! {
        <TodoItem title={todo.title.clone()} completed={todo.completed} />
      }).collect::<Html>()}
    </ul>
  }
}
```

最終的に、以下のように TODO を追加できるようになりました。

![add todo](//images.ctfassets.net/in6v9lxmm5c8/5SslYgSJZTcGmP5rmcwoGz/3b57078ccdefbd6d29293af511327e64/add_todo.gif)

### アプリケーションをビルドする

それでは作成したアプリケーションをビルドしましょう。以下コマンドでビルドを実行します。

```sh
$ trunk build --release
```

GitHub Pages 向けの出力するには `--public-url` オプションでレポジトリ名を指定します。

```sh
$ trunk build --release --public-url <github-repository-name>
```

`dist` フォルダ配下にファイルが生成されます。

```sh
dist
├── index-847358c7c7fc82df.js
├── index-847358c7c7fc82df_bg.wasm
└── index.html
```

## 感想

Rust に触れるのははじめてでしたが、React に近い感じの要素が多かったので思ったよりも迷わず進められた感じですね。

まだまだ Web フロントエンドの分野での Rust は発展途上ではありますが、JavaScript/TypeScript 以外の選択肢が増えるのは好ましいことですので今後の動向に期待指定ですね。
