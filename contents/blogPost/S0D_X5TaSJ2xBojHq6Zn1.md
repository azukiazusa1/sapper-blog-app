---
id: S0D_X5TaSJ2xBojHq6Zn1
title: "Zed の UI フレームワーク GPUI で Rust のデスクトップ ToDo アプリを作る"
slug: "gpui-todo-app"
about: "Electron 製のデスクトップアプリはブラウザエンジンを同梱するため、メモリ使用量や描画性能に課題があります。GPUI は Zed のために開発された、GPU で描画する Rust の UI フレームワークで、Discord も採用を表明しています。この記事では GPUI Kit と組み合わせて ToDo アプリを作りながら、Entity による状態管理、cx.notify() による再描画、Action とキーバインドの使い方を解説します。"
createdAt: "2026-11-08T23:53+09:00"
updatedAt: "2026-11-08T23:53+09:00"
tags: ["Rust", "GPUI"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3TUFNE3GWbPUh695ZVRtPO/50efec5409de8dc2a5439884a71426f5/kiritanpo_24066-768x571.png"
  title: "きりたんぽのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "クリックハンドラの中で View の状態を書き換えた後に cx.notify() を呼ぶ理由はどれですか？"
      answers:
        - text: "書き換えた値をディスクに保存するため"
          correct: false
          explanation: "cx.notify() は永続化とは関係ありません。状態が変わったことを GPUI に伝えるメソッドです。"
        - text: "クリックイベントが親要素へ伝わるのを止めるため"
          correct: false
          explanation: "イベントの伝播を止める機能ではありません。"
        - text: "Rust の借用チェッカーに書き換えを許可してもらうため"
          correct: false
          explanation: "借用の問題を解決するのは cx.listener() や update() による状態の貸し出しで、cx.notify() の役割ではありません。"
        - text: "GPUI はフィールドの変更を自動で検知しないため、状態の変化を伝えて再描画させる"
          correct: true
          explanation: "GPUI は Entity のフィールドが書き換えられたことを検知しないため、cx.notify() で変化を伝えると、監視しているウィンドウが再描画します。"
    - question: "div() に .on_click() でクリックハンドラを登録する前に必要な操作はどれですか？"
      answers:
        - text: ".key_context() でキーコンテキストの名前を付ける"
          correct: false
          explanation: ".key_context() は Action とキーバインドを対応付けるためのもので、クリックの処理には不要です。"
        - text: ".hover() でホバー時のスタイルを指定する"
          correct: false
          explanation: ".hover() は ID がなくても使えるスタイル指定で、.on_click() の前提ではありません。"
        - text: ".id() で ID を付けて Stateful<Div> にする"
          correct: true
          explanation: ".on_click() は StatefulInteractiveElement のメソッドで、再描画のたびに作り直される要素を再描画をまたいで識別するために ID が必要です。"
        - text: "cx.notify() を呼んでおく"
          correct: false
          explanation: "cx.notify() は状態を変更した後に呼ぶもので、ハンドラの登録前に必要な操作ではありません。"
published: true
---

デスクトップアプリを作るフレームワークとして、[Electron](https://www.electronjs.org/) が広く使われています。Visual Studio Code、Slack、Discord なども Electron で作られたアプリです。Electron は Web 開発の知識で macOS・Windows・Linux 向けのアプリを作れる一方、アプリごとにブラウザエンジンを同梱して動かすため、メモリ使用量やアプリのサイズが大きくなりやすいという課題があります。また、画面の描画も DOM のレイアウトや JavaScript のガベージコレクションの影響を受けるため、これらの処理が重なると画面の更新が間に合わずスクロールやアニメーションがカクつくことがあります。

こうした課題から、Electron 以外の選択肢も増えています。[Tauri](https://tauri.app/) は Chromium を同梱せず OS 標準の WebView で Web 技術の UI を表示し、[egui](https://github.com/emilk/egui) や [Iced](https://iced.rs/) は Web 技術を使わず Rust だけで UI を書けます。[GPUI](https://www.gpui.rs/) は後者に属するフレームワークで、コードエディタ [Zed](https://zed.dev/) の UI はすべて GPUI で描画されています。

GPUI は Zed 以外のアプリでも採用され始めています。2026 年 11 月には、Discord の共同創業者で CTO の Stanislav Vishnevskiy 氏が、Electron で作られているデスクトップアプリを GPUI で作り直す計画を[明らかにしました](https://x.com/svishnevskiy/status/2118081920194203799)。

この記事では、GPUI でシンプルな ToDo アプリを段階的に作りながら、GPUI 独自の状態管理モデルと、イベント処理の書き方を紹介します。

:::warning
GPUI は 1.0 前のフレームワークで、[公式 README](https://github.com/zed-industries/zed/blob/main/crates/gpui/README.md) でもバージョン間で破壊的変更が頻繁に入ると明記されています。この記事のコードは 2026 年 11 月 8 日に Rust 1.99.1、gpui-kit 0.9.0 の組み合わせで動作を確認しています。
:::

## GPUI とは

GPUI は Zed の開発元である Zed Industries が開発している UI フレームワークです。公式サイトでは、即時モード（immediate mode）と保持モード（retained mode）を組み合わせた、GPU で高速に描画する UI フレームワークだと紹介されています。即時モードは描画のたびにその時点のデータから UI 全体を組み立て直す方式で、Rust の UI ライブラリ egui などが採用しています。保持モードは UI の部品をオブジェクトとして残しておき、変化した部分だけを書き換える方式で、ブラウザの DOM がその代表です。

:::tip
Zed が独自の UI フレームワークを作った理由は、2023 年の Zed のブログ記事 [Leveraging Rust and the GPU to render user interfaces at 120 FPS](https://zed.dev/blog/videogame) に書かれています。Zed の開発チームは以前 Electron 製の Atom エディタを開発しており、ガベージコレクションによる停止や DOM の再レイアウトのせいで、画面の更新が 1 フレームの描画時間内に終わらない問題に悩まされていました。そこでビデオゲームのように、UI を矩形・影・文字などのプリミティブに分解して GPU のシェーダーで描画する方式を採用しました。
:::

GPUI の API は、「[レジスター](https://en.wikipedia.org/wiki/Register_(sociolinguistics))」と呼ばれる 3 つの概念で構成されています。

- `Entity`: アプリの状態を保持する。状態は GPUI が所有し、コードは `Rc` に似た参照カウント付きのハンドルを通じてアクセスする
- View: `Render` トレイトを実装した `Entity`。`div()` などで要素ツリーを組み立て、Tailwind CSS に似たメソッドチェーンでスタイルを指定する
- `Element`: レイアウトと描画を直接制御する低レベルの API。コードエディタのような特殊な描画が必要な場合に使う

この記事では低レベルの `Element` API は扱わず、`Entity` と View を使ってアプリを組み立てます。

## プロジェクトを作成する

GPUI は macOS における描画に Metal を使うため、Xcode と Xcode Command Line Tools が必要です。Rust は最新の stable 版を使います。

```bash
xcode-select --install
rustup update stable
```

Cargo でプロジェクトを作成し、`gpui-kit` を追加します。

```bash
cargo new gpui-todo-app
cd gpui-todo-app
cargo add gpui-kit@0.9.0
```

:::info
crates.io の [`gpui`](https://crates.io/crates/gpui) クレートは 2025 年 10 月の 0.2.2 から更新されておらず、アプリの起動処理などが現在の Zed の GPUI とは異なります。この記事で使う [GPUI Kit](https://gpui-kit.com/) は、Zed の main ブランチのスナップショットとして公開されている [`gpui-pre`](https://crates.io/crates/gpui-pre) クレートを固定して再エクスポートしています（gpui-kit 0.9.0 では Zed のコミット [`f816e1f`](https://github.com/zed-industries/zed/commit/f816e1f) 時点の 0.3.11）。
:::

`Cargo.toml` は以下のようになります。

```toml:Cargo.toml
[package]
name = "gpui-todo-app"
version = "0.1.0"
edition = "2024"

[dependencies]
gpui-kit = "0.9.0"
```

## ウィンドウを表示する

まずはタイトルだけを表示するウィンドウを作ります。`src/main.rs` を以下のように書き換えます。

```rust:src/main.rs
use gpui_kit::{prelude::*, *};

struct TodoApp {
    title: SharedString,
}

impl Render for TodoApp {
    fn render(&mut self, _window: &mut Window, _cx: &mut Context<Self>) -> impl IntoElement {
        div()
            .flex()
            .flex_col()
            .size_full()
            .p_4()
            .bg(rgb(0xffffff))
            .text_color(rgb(0x111827))
            .child(div().text_xl().child(self.title.clone()))
    }
}

fn main() {
    gpui_kit::application().run(|cx: &mut App| {
        let bounds = Bounds::centered(None, size(px(420.), px(480.)), cx);
        cx.open_window(
            WindowOptions {
                window_bounds: Some(WindowBounds::Windowed(bounds)),
                ..Default::default()
            },
            |_window, cx| {
                cx.new(|_cx| TodoApp {
                    title: "ToDo".into(),
                })
            },
        )
        .unwrap();
        cx.activate(true);
    });
}
```

`main` 関数から順に見ていきます。

- `gpui_kit::application()` は GPUI の `gpui_platform::application()` を再エクスポートしたもので、実行中の OS に合ったプラットフォーム実装で `Application` を作成する。`run()` に渡したクロージャはアプリの起動後に一度だけ呼ばれる
- クロージャの引数 `cx: &mut App` はアプリ全体の状態を所有するオブジェクト。ウィンドウを開く、アプリを終了するといった操作はすべて `App` を通じて行う
- `cx.open_window()` の第 2 引数は、ウィンドウのルートに置く View を返すクロージャ。`cx.new()` で `TodoApp` の状態を `App` に渡し、そのハンドルである `Entity<TodoApp>` を返している
- `cx.activate(true)` でアプリを前面に表示する

`TodoApp` には `Render` トレイトを実装しています。`render()` メソッドは要素ツリーを返し、GPUI はウィンドウを描画し直すたびにルート View の `render()` を呼び出します。ウィンドウが描画し直されるのは、後で説明する `cx.notify()` で状態の変化が伝えられたときなど、表示を更新する必要が生じたときです。`div()` は HTML の `div` 要素に相当する汎用の要素で、`.flex()`・`.p_4()`・`.text_xl()` のように Tailwind CSS のクラス名に近いメソッドでスタイルを指定します。`.child()` で子要素を追加し、文字列もそのまま子要素として渡せます。

```rs
div()
    .flex()
    .flex_col()
    .size_full()
    .p_4()
    .bg(rgb(0xffffff))
    .text_color(rgb(0x111827))
    .child(div().text_xl().child(self.title.clone()))
```

`SharedString` は GPUI の文字列型で、静的な文字列と参照カウント付きの文字列のどちらも保持できます。`render()` は描画し直すたびに呼ばれるため、`clone()` してもヒープ上の文字列はコピーされないこの型が使われます。`SharedString` は `&str` や `String` からの `From` トレイトを実装しているため、`"ToDo".into()` のように `.into()` で文字列リテラルを `SharedString` に変換できます。

1 行目の `prelude::*` は、後で使う `.when()` などのトレイトメソッドを読み込むためのものです。`cargo run` を実行すると、「ToDo」と書かれたウィンドウが表示されます。

```bash
cargo run
```

![GPUI で開いたウィンドウに「ToDo」と表示されている](https://images.ctfassets.net/in6v9lxmm5c8/4d19SuAQpfY7kPxd8ztQAu/2d96a585047d837bffe07e908d7f255d/gpui-todo-app-1.png)

## ToDo リストを描画してクリックで更新する

続いて ToDo の一覧を表示し、項目をクリックすると完了と未完了が切り替わるようにします。この節で完成する `src/main.rs` は以下のとおりです。

```rust:src/main.rs {3-6, 9, 13-14, 19, 24-50, 64-77}
use gpui_kit::{prelude::*, *};

struct Todo {
    title: SharedString,
    done: bool,
}

struct TodoApp {
    todos: Vec<Todo>,
}

impl Render for TodoApp {
    fn render(&mut self, _window: &mut Window, cx: &mut Context<Self>) -> impl IntoElement {
        let remaining = self.todos.iter().filter(|todo| !todo.done).count();

        div()
            .flex()
            .flex_col()
            .gap_2()
            .size_full()
            .p_4()
            .bg(rgb(0xffffff))
            .text_color(rgb(0x111827))
            .child(div().text_xl().child("ToDo"))
            .children(self.todos.iter().enumerate().map(|(ix, todo)| {
                div()
                    .id(ix)
                    .flex()
                    .gap_2()
                    .px_2()
                    .py_1()
                    .rounded_md()
                    .cursor_pointer()
                    .hover(|style| style.bg(rgb(0xf3f4f6)))
                    .when(todo.done, |this| {
                        this.line_through().text_color(rgb(0x9ca3af))
                    })
                    .on_click(cx.listener(move |this, _event: &ClickEvent, _window, cx| {
                        this.todos[ix].done = !this.todos[ix].done;
                        cx.notify();
                    }))
                    .child(if todo.done { "☑" } else { "☐" })
                    .child(todo.title.clone())
            }))
            .child(
                div()
                    .text_sm()
                    .text_color(rgb(0x6b7280))
                    .child(format!("残り {remaining} 件")),
            )
    }
}

fn main() {
    gpui_kit::application().run(|cx: &mut App| {
        let bounds = Bounds::centered(None, size(px(420.), px(480.)), cx);
        cx.open_window(
            WindowOptions {
                window_bounds: Some(WindowBounds::Windowed(bounds)),
                ..Default::default()
            },
            |_window, cx| {
                cx.new(|_cx| TodoApp {
                    todos: vec![
                        Todo {
                            title: "牛乳を買う".into(),
                            done: false,
                        },
                        Todo {
                            title: "GPUI のドキュメントを読む".into(),
                            done: true,
                        },
                        Todo {
                            title: "ブログ記事を書く".into(),
                            done: false,
                        },
                    ],
                })
            },
        )
        .unwrap();
        cx.activate(true);
    });
}
```

### ToDo のデータを状態として持つ

一覧に表示する ToDo を、View の状態として `TodoApp` に持たせます。ToDo 1 件分のタイトルと完了状態を表す `Todo` 構造体を定義し、`TodoApp` には `Todo` の配列 `todos` を持たせます。

```rust
struct Todo {
    title: SharedString,
    done: bool,
}

struct TodoApp {
    todos: Vec<Todo>,
}
```

GPUI の View は、表示に使うデータを自分のフィールドに持ち、`render()` でそのフィールドから要素を組み立てます。`render()` が返す要素は描画のたびに作り直されるため、要素の側に完了状態を持たせても次の描画で消えてしまいます。完了状態は描画をまたいで残る `TodoApp` の `todos` に持たせ、クリックされたらそこを書き換えます。

初期データは `main()` で `TodoApp` を作成するときに渡します。

```rust
cx.new(|_cx| TodoApp {
    todos: vec![
        Todo {
            title: "牛乳を買う".into(),
            done: false,
        },
        // 残りの 2 件は省略
    ],
})
```

### 状態から ToDo の一覧を組み立てる

`render()` では、`self.todos` の各要素を `div()` に変換して一覧を作ります。

```rust
.children(self.todos.iter().enumerate().map(|(ix, todo)| {
    div()
        .flex()
        .gap_2()
        .px_2()
        .py_1()
        .rounded_md()
        .child(if todo.done { "☑" } else { "☐" })
        .child(todo.title.clone())
}))
```

`.children()` はイテレーターを受け取り、複数の子要素をまとめて追加するメソッドです。`enumerate()` はイテレーターの各要素に 0 から始まる番号を付け、`(番号, 要素)` のタプルにします。`ix` は index の略で、その ToDo が `self.todos` の何番目にあるかを表します。この `ix` は、後でクリックされた ToDo を特定するために使います。

一覧の下には、未完了の ToDo の件数を表示します。`render()` の先頭で件数を数え、`format!` で文字列にして子要素に追加しています。

```rust
let remaining = self.todos.iter().filter(|todo| !todo.done).count();
```

```rust
.child(
    div()
        .text_sm()
        .text_color(rgb(0x6b7280))
        .child(format!("残り {remaining} 件")),
)
```

`render()` は `self.todos` から要素を組み立てているだけです。状態が変わって再描画されると、状態に合った要素ツリーが作り直されます。React の関数コンポーネントに近い考え方です。

### 完了済みの項目に取り消し線を付ける

完了済みの ToDo は、取り消し線と薄い文字色で表示します。

```rust
.when(todo.done, |this| {
    this.line_through().text_color(rgb(0x9ca3af))
})
```

`.when(条件, クロージャ)` は、条件 `true` のときだけクロージャでスタイルを追加するメソッドです。`if` 式で要素を作り分けなくても、メソッドチェーンの中で条件付きのスタイルを書けます。`.when()` は `prelude::*` で読み込まれる `FluentBuilder` トレイトのメソッドです。

### クリックで完了と未完了を切り替える

最後に、項目をクリックしたら `done` を反転させます。そのためには、次の 3 つが必要です。

- 要素に ID を付ける
- ハンドラから `TodoApp` の状態を書き換える
- GPUI に再描画を要求する

まず、`.id(ix)` で要素に ID を付けます。

```rust
div()
    .id(ix)
```

GPUI の要素ツリーは再描画のたびに作り直されるため、「マウスボタンを押した要素と離した要素が同じか」のように再描画をまたいで要素を識別するには ID が必要です。`div()` に `.id()` を付けると `Stateful<Div>` という型に変わります。この後で使う `.on_click()` は `Stateful` な要素だけが実装する `StatefulInteractiveElement` トレイトのメソッドなので、ID のない `div()` では呼べません。

あわせて、クリックできることがわかるように、カーソルの形とホバー時の背景色を指定しています。`.hover()` のように 1 フレーム内で完結するスタイル指定は、ID がなくても使えます。

```rust
.cursor_pointer()
.hover(|style| style.bg(rgb(0xf3f4f6)))
```

次に、`.on_click()` でクリックのハンドラを登録します。

```rust
.on_click(cx.listener(move |this, _event: &ClickEvent, _window, cx| {
    this.todos[ix].done = !this.todos[ix].done;
    cx.notify();
}))
```

ハンドラの中では `TodoApp` の `todos` を書き換える必要があります。しかし `.on_click()` が受け取るのは `Fn(&ClickEvent, &mut Window, &mut App)` 型のクロージャで、`self` を受け取る引数がありません。`render()` が受け取った `&mut self` をクロージャに取り込むこともできません。クロージャは `render()` が終わった後に呼ばれるためです。

`cx.listener()` は、この問題を解決するためのメソッドです。`Context<TodoApp>` の `listener()` に `|this: &mut TodoApp, event, window, cx|` という形のクロージャを渡すと、`.on_click()` が受け取れる形のクロージャに変換されます。変換後のクロージャは `TodoApp` への弱参照（`WeakEntity`）を保持しており、呼ばれた時点で `App` から `TodoApp` の可変参照を借りて元のクロージャを実行します。`move` を付けているのは、クロージャが `render()` の後に呼ばれても `ix` を使えるように、値をクロージャへ移すためです。

ハンドラの最後では `cx.notify()` を呼んでいます。GPUI は `Entity` のフィールドが書き換えられたことを自動では検知しません。`cx.notify()` は「この `Entity` の状態が変わった」と GPUI に伝え、その `Entity` を監視している他の `Entity` やウィンドウに通知するメソッドです。View を表示しているウィンドウはこの通知を受けて再描画します。`cx.notify()` を呼ばないと再描画されないため、`done` は書き換わっても画面は前の表示のままです。

`cargo run` で起動し、項目をクリックするとチェックと取り消し線が切り替わり、残り件数が更新されます。

!v(https://videos.ctfassets.net/in6v9lxmm5c8/2Q7a3bau5etIXa6NMZ5PSM/66aa93e490c368ed52d42ecc70eb99c3/gpui-todo-app-2.mp4 422x506)

## GPUI の状態管理モデル

ここまでのコードで `Entity`・`App`・`Context` が登場しました。これらの関係を整理しておきましょう。

GPUI では、`cx.new()` で作成したすべての状態を `App` が所有します。`cx.new()` が返す `Entity<T>` はハンドルにすぎず、`Rc` と同じように `clone()` すると参照カウントが増えます。ただし `Rc` と違い、`Entity<T>` だけでは中身を読み書きできません。状態にアクセスするには、`App` を一緒に渡して `read()` や `update()` を呼びます。

```rust
let counter: Entity<Counter> = cx.new(|_cx| Counter { count: 0 });

// App から Counter を借りて書き換える
counter.update(cx, |counter: &mut Counter, cx: &mut Context<Counter>| {
    counter.count += 1;
    cx.notify();
});

// App から Counter を借りて読み取る
let count = counter.read(cx).count;
```

`update()` のクロージャに渡される `Context<Counter>` は、`App` に「どの `Entity` を更新中か」という情報を加えたものです。`Context<T>` は `App` に参照外しできるため、`App` を受け取る関数にもそのまま渡せます。`cx.notify()` のような `Entity` 単位の操作は `Context<T>` にだけあります。

Zed の Nathan Sobo 氏はこの設計の理由を [Ownership and data flow in GPUI](https://zed.dev/blog/gpui-ownership) で説明しています。Rust の所有権は木構造のデータとは相性がよい一方、イベントのコールバックから `self` を参照するような UI でよく使うパターンとは相性がよくありません。最初は標準ライブラリの `Rc` を使った実装を試しましたがうまくいかず、`App` がすべての状態を所有し、更新中だけ状態を「貸し出す」現在の設計にたどり着いたとされています。

`Entity` 同士の連携には 2 つの仕組みがあります。

- `cx.observe()`: 監視対象の `Entity` で `cx.notify()` が呼ばれたときにコールバックを実行する
- `cx.subscribe()`: 監視対象の `Entity` が `cx.emit()` で発行した型付きのイベントを受け取る。発行する側は `EventEmitter<イベント型>` トレイトを実装する

この後に追加する入力欄では、`subscribe` を使って入力欄の Enter キーのイベントを受け取ります。

## GPUI Kit で入力欄を追加する

GPUI 本体には、ボタンやテキスト入力欄といった完成した部品がありません。GPUI のリポジトリには入力欄の[サンプル](https://github.com/zed-industries/zed/blob/main/crates/gpui/examples/input.rs)がありますが、カーソル移動、選択範囲、IME による変換中の文字の扱いまで自前で実装しており、900 行ほどあります。ここからは GPUI Kit の `Input`・`Checkbox`・`Button` を使い、入力欄から ToDo を追加できるようにします。

この節で完成する `src/main.rs` は以下のとおりです。

```rust:src/main.rs {1-6, 15, 17-51, 61, 64-65, 67-78, 82-101, 106, 113-129}
use gpui_kit::component::{
    ActiveTheme as _,
    button::{Button, ButtonVariants as _},
    checkbox::Checkbox,
    input::{Input, InputEvent, InputState},
};
use gpui_kit::{prelude::*, *};

struct Todo {
    title: SharedString,
    done: bool,
}

struct TodoApp {
    input: Entity<InputState>,
    todos: Vec<Todo>,
    _subscriptions: Vec<Subscription>,
}

impl TodoApp {
    fn new(window: &mut Window, cx: &mut Context<Self>) -> Self {
        let input = cx.new(|cx| InputState::new(window, cx).placeholder("やることを入力"));
        input.update(cx, |input, cx| input.focus(window, cx));

        // InputState が Enter で発行するイベントを購読する
        let subscription = cx.subscribe_in(&input, window, |this, _input, event, window, cx| {
            if let InputEvent::PressEnter { .. } = event {
                this.add_todo(window, cx);
            }
        });

        Self {
            input,
            todos: Vec::new(),
            _subscriptions: vec![subscription],
        }
    }

    fn add_todo(&mut self, window: &mut Window, cx: &mut Context<Self>) {
        let title = self.input.read(cx).value().trim().to_string();
        if title.is_empty() {
            return;
        }
        self.todos.push(Todo {
            title: title.into(),
            done: false,
        });
        self.input
            .update(cx, |input, cx| input.set_value("", window, cx));
        cx.notify();
    }
}

impl Render for TodoApp {
    fn render(&mut self, _window: &mut Window, cx: &mut Context<Self>) -> impl IntoElement {
        let remaining = self.todos.iter().filter(|todo| !todo.done).count();

        div()
            .flex()
            .flex_col()
            .gap_3()
            .size_full()
            .p_4()
            .bg(cx.theme().background)
            .text_color(cx.theme().foreground)
            .child(div().text_xl().child("ToDo"))
            .child(
                div()
                    .flex()
                    .gap_2()
                    .child(div().flex_1().child(Input::new(&self.input)))
                    .child(
                        Button::new("add")
                            .primary()
                            .label("追加")
                            .on_click(cx.listener(|this, _, window, cx| this.add_todo(window, cx))),
                    ),
            )
            .children(self.todos.iter().enumerate().map(|(ix, todo)| {
                div()
                    .flex()
                    .items_center()
                    .justify_between()
                    .child(
                        Checkbox::new(("todo", ix))
                            .label(todo.title.clone())
                            .checked(todo.done)
                            .on_change(cx.listener(move |this, checked: &bool, _, cx| {
                                this.todos[ix].done = *checked;
                                cx.notify();
                            })),
                    )
                    .child(
                        Button::new(("delete", ix))
                            .ghost()
                            .label("削除")
                            .on_click(cx.listener(move |this, _, _, cx| {
                                this.todos.remove(ix);
                                cx.notify();
                            })),
                    )
            }))
            .child(
                div()
                    .text_sm()
                    .text_color(cx.theme().muted_foreground)
                    .child(format!("残り {remaining} 件")),
            )
    }
}

fn main() {
    gpui_kit::application()
        .with_assets(gpui_kit::assets::Assets)
        .run(|cx: &mut App| {
            gpui_kit::init(cx);

            let bounds = Bounds::centered(None, size(px(420.), px(480.)), cx);
            gpui_kit::open_window(
                WindowOptions {
                    window_bounds: Some(WindowBounds::Windowed(bounds)),
                    ..Default::default()
                },
                cx,
                |window, cx| cx.new(|cx| TodoApp::new(window, cx)),
            )
            .unwrap();
            cx.activate(true);
        });
}
```

以降では、このコードを前の節のコードからどのような順に変更したのかを、変更ごとに説明します。

### GPUI Kit を初期化する

GPUI Kit のコンポーネントは、テーマやアイコンなどの初期設定が登録されていないと描画できません。そのため、コンポーネントを使う前に `main()` を書き換えます。

```rust
fn main() {
    gpui_kit::application()
        .with_assets(gpui_kit::assets::Assets)
        .run(|cx: &mut App| {
            gpui_kit::init(cx);

            let bounds = Bounds::centered(None, size(px(420.), px(480.)), cx);
            gpui_kit::open_window(
                WindowOptions {
                    window_bounds: Some(WindowBounds::Windowed(bounds)),
                    ..Default::default()
                },
                cx,
                |window, cx| cx.new(|cx| TodoApp::new(window, cx)),
            )
            .unwrap();
            cx.activate(true);
        });
}
```

GPUI だけを使っていたときから、次の 3 か所が変わっています。

- `.with_assets(gpui_kit::assets::Assets)` で、コンポーネントが使うアイコンの SVG を読み込めるようにする
- `gpui_kit::init(cx)` で GPUI Kit を初期化する。テーマや各コンポーネントの初期設定が登録されるため、コンポーネントを使う前に一度呼ぶ必要がある
- `cx.open_window()` の代わりに `gpui_kit::open_window()` を使う。この関数は、渡した View を GPUI Kit の `Root` でラップしてからウィンドウを開く。`Root` はダイアログや通知などを View の上に重ねて描画するための View

ルートの View は、構造体リテラルではなく `TodoApp::new(window, cx)` で作るように変えています。この関数は次の手順で実装します。

### 入力欄の状態を `Entity` として持つ

GPUI Kit のコンポーネントは `gpui_kit::component` から読み込みます。

```rust
use gpui_kit::component::{
    ActiveTheme as _,
    button::{Button, ButtonVariants as _},
    checkbox::Checkbox,
    input::{Input, InputEvent, InputState},
};
```

入力中の文字列やカーソル位置といった入力欄の状態は、GPUI Kit の `InputState` が持ちます。`InputState` は `TodoApp` とは別の `Entity` で、`TodoApp` はそのハンドルを `input` フィールドに保持します。`_subscriptions` フィールドは、後で Enter キーのイベントを購読するために使う `Subscription` を保持するためのものです。

```rust
struct TodoApp {
    input: Entity<InputState>,
    todos: Vec<Todo>,
    _subscriptions: Vec<Subscription>,
}
```

`InputState::new()` は引数に `Window` を必要とします。そのため、`TodoApp` を作る処理を `window` を受け取る `TodoApp::new()` にまとめました。

```rust
impl TodoApp {
    fn new(window: &mut Window, cx: &mut Context<Self>) -> Self {
        let input = cx.new(|cx| InputState::new(window, cx).placeholder("やることを入力"));
        input.update(cx, |input, cx| input.focus(window, cx));

        // ...
    }
}
```

`cx.new()` で作った `InputState` に対して、`input.update()` で `focus()` を呼んでいます。これにより起動した直後から、入力欄に自動でフォーカスが当たるようになります。

### 入力欄と追加ボタンを描画する

`render()` では、タイトルの下に入力欄と「追加」ボタンを横に並べます。

```rust
.child(
    div()
        .flex()
        .gap_2()
        .child(div().flex_1().child(Input::new(&self.input)))
        .child(
            Button::new("add")
                .primary()
                .label("追加")
                .on_click(cx.listener(|this, _, window, cx| this.add_todo(window, cx))),
        ),
)
```

GPUI Kit のコンポーネントも、`div()` と同じく要素ツリーの一部として `.child()` で追加します。`Input::new(&self.input)` は `InputState` を描画する要素で、状態は `TodoApp` が保持する `Entity` の側にあります。そのため `render()` が再描画のたびに `Input` を作り直しても、入力中の文字列は失われません。

`Button::new()` の引数は要素の ID です。前の節で `div()` に `.id()` を付けたのと同じく、クリックを扱う要素には ID が必要です。クリックのハンドラは前の節と同じく `cx.listener()` で変換し、次の手順で実装する `add_todo()` を呼び出します。

### 入力値から ToDo を追加する

`add_todo()` は、入力欄の値を読み取って ToDo を追加し、入力欄を空に戻すメソッドです。

```rust
fn add_todo(&mut self, window: &mut Window, cx: &mut Context<Self>) {
    let title = self.input.read(cx).value().trim().to_string();
    if title.is_empty() {
        return;
    }
    self.todos.push(Todo {
        title: title.into(),
        done: false,
    });
    self.input
        .update(cx, |input, cx| input.set_value("", window, cx));
    cx.notify();
}
```

入力値は `self.input.read(cx).value()` で読み取ります。入力欄を空に戻すときは、`self.input.update()` で `InputState` を借りて `set_value()` を呼びます。「GPUI の状態管理モデル」で説明した `Entity` の `read()` と `update()` が、そのまま使われていることがわかります。空白だけの文字列は先頭の `is_empty()` の判定で弾くため、追加されません。`todos` を書き換えた後は、前の節と同じく `cx.notify()` で再描画を要求します。

### Enter キーでも追加できるようにする

ボタンのクリックだけでなく、入力欄で Enter キーを押したときにも ToDo を追加します。`InputState` は Enter キーが押されると `InputEvent::PressEnter` を発行するので、`TodoApp::new()` の中でこのイベントを購読します。

```rust
// InputState が Enter で発行するイベントを購読する
let subscription = cx.subscribe_in(&input, window, |this, _input, event, window, cx| {
    if let InputEvent::PressEnter { .. } = event {
        this.add_todo(window, cx);
    }
});

Self {
    input,
    todos: Vec::new(),
    _subscriptions: vec![subscription],
}
```

`cx.subscribe_in()` は、指定した `Entity` が発行するイベントを購読するメソッドです。「GPUI の状態管理モデル」で紹介した `cx.subscribe()` との違いは、コールバックに `&mut Window` が渡される点です。`add_todo()` は入力欄を空に戻すために `Window` を必要とするので、ここでは `subscribe_in()` を使っています。

`subscribe_in()` が返す `Subscription` は購読の登録を表す値で、drop されると購読が解除されます。`new()` の中でローカル変数のまま捨てると、Enter キーを押しても何も起きません。そのため `TodoApp` の `_subscriptions` フィールドに保持し、`TodoApp` が存在する間は購読が続くようにしています。

### チェックボックスと削除ボタンに置き換える

前の節では `div()` のクリックで完了状態を切り替えていました。これを GPUI Kit の `Checkbox` に置き換え、ToDo を削除するボタンも追加します。

```rust
.children(self.todos.iter().enumerate().map(|(ix, todo)| {
    div()
        .flex()
        .items_center()
        .justify_between()
        .child(
            Checkbox::new(("todo", ix))
                .label(todo.title.clone())
                .checked(todo.done)
                .on_change(cx.listener(move |this, checked: &bool, _, cx| {
                    this.todos[ix].done = *checked;
                    cx.notify();
                })),
        )
        .child(
            Button::new(("delete", ix))
                .ghost()
                .label("削除")
                .on_click(cx.listener(move |this, _, _, cx| {
                    this.todos.remove(ix);
                    cx.notify();
                })),
        )
}))
```

クリックは `Checkbox` と `Button` が処理するので、外側の `div()` には `.id()` や `.on_click()` が不要になりました。`Checkbox` と `Button` の ID には `("todo", ix)` のようなタプルを渡しています。同じ名前の要素が複数並ぶため、`ix` を付けてユニークにしています。

`Checkbox` は自分では checked の状態を持ちません。`.checked(todo.done)` で表示する値を受け取り、クリックされると `.on_change()` に新しい値を渡します。`TodoApp` 側で `todos` を更新して `cx.notify()` を呼ぶと、再描画で新しい値の `Checkbox` が描画されます。状態の持ち主はあくまで `TodoApp` で、`Checkbox` はその値を表示するだけです。React の制御コンポーネントと同じ考え方です。

### テーマの色を使う

最後に、`rgb()` で直接指定していた色を GPUI Kit のテーマの色に置き換えます。

```rust
.bg(cx.theme().background)
.text_color(cx.theme().foreground)
```

```rust
.text_color(cx.theme().muted_foreground)
```

`cx.theme()` は `gpui_kit::init()` が登録したテーマを読み出すメソッドです。`ActiveTheme` トレイトのメソッドなので、`use` で `ActiveTheme as _` を読み込んでいます。GPUI Kit のコンポーネントもテーマの色で描画されるため、自分で書いた `div()` の色をテーマに合わせておくと、コンポーネントとの見た目がそろいます。

`cargo run` で起動すると、入力欄に文字を入力して Enter キーまたは「追加」ボタンで ToDo を追加できます。

!v(https://videos.ctfassets.net/in6v9lxmm5c8/5hF8Og3ENxIFzenJTfCqP9/fdc018834ae2e48a86258b16ec93d4f8/gpui-todo-app-3.mp4 422x506)

## Action でキーボード操作を定義する

最後に、完了済みの ToDo を `cmd-shift-backspace` でまとめて削除する操作を追加します。

GPUI の[キーディスパッチのドキュメント](https://github.com/zed-industries/zed/blob/main/crates/gpui/docs/key_dispatch.md)は、GPUI を「キーボード操作を第一に考えたフレームワーク」と位置付けています。マウス向けの操作はボタンのクリックハンドラで実装しますが、キーボード向けの操作は「Action」と「キーコンテキスト」の組み合わせで実装します。

この節で完成する `src/main.rs` は以下のとおりです。

```rust:src/main.rs {9, 55-63, 71-72, 132-136}
use gpui_kit::component::{
    ActiveTheme as _,
    button::{Button, ButtonVariants as _},
    checkbox::Checkbox,
    input::{Input, InputEvent, InputState},
};
use gpui_kit::{prelude::*, *};

actions!(todo_app, [ClearCompleted]);

struct Todo {
    title: SharedString,
    done: bool,
}

struct TodoApp {
    input: Entity<InputState>,
    todos: Vec<Todo>,
    _subscriptions: Vec<Subscription>,
}

impl TodoApp {
    fn new(window: &mut Window, cx: &mut Context<Self>) -> Self {
        let input = cx.new(|cx| InputState::new(window, cx).placeholder("やることを入力"));
        input.update(cx, |input, cx| input.focus(window, cx));

        // InputState が Enter で発行するイベントを購読する
        let subscription = cx.subscribe_in(&input, window, |this, _input, event, window, cx| {
            if let InputEvent::PressEnter { .. } = event {
                this.add_todo(window, cx);
            }
        });

        Self {
            input,
            todos: Vec::new(),
            _subscriptions: vec![subscription],
        }
    }

    fn add_todo(&mut self, window: &mut Window, cx: &mut Context<Self>) {
        let title = self.input.read(cx).value().trim().to_string();
        if title.is_empty() {
            return;
        }
        self.todos.push(Todo {
            title: title.into(),
            done: false,
        });
        self.input
            .update(cx, |input, cx| input.set_value("", window, cx));
        cx.notify();
    }

    fn clear_completed(
        &mut self,
        _: &ClearCompleted,
        _window: &mut Window,
        cx: &mut Context<Self>,
    ) {
        self.todos.retain(|todo| !todo.done);
        cx.notify();
    }
}

impl Render for TodoApp {
    fn render(&mut self, _window: &mut Window, cx: &mut Context<Self>) -> impl IntoElement {
        let remaining = self.todos.iter().filter(|todo| !todo.done).count();

        div()
            .key_context("TodoApp")
            .on_action(cx.listener(Self::clear_completed))
            .flex()
            .flex_col()
            .gap_3()
            .size_full()
            .p_4()
            .bg(cx.theme().background)
            .text_color(cx.theme().foreground)
            .child(div().text_xl().child("ToDo"))
            .child(
                div()
                    .flex()
                    .gap_2()
                    .child(div().flex_1().child(Input::new(&self.input)))
                    .child(
                        Button::new("add")
                            .primary()
                            .label("追加")
                            .on_click(cx.listener(|this, _, window, cx| this.add_todo(window, cx))),
                    ),
            )
            .children(self.todos.iter().enumerate().map(|(ix, todo)| {
                div()
                    .flex()
                    .items_center()
                    .justify_between()
                    .child(
                        Checkbox::new(("todo", ix))
                            .label(todo.title.clone())
                            .checked(todo.done)
                            .on_change(cx.listener(move |this, checked: &bool, _, cx| {
                                this.todos[ix].done = *checked;
                                cx.notify();
                            })),
                    )
                    .child(
                        Button::new(("delete", ix))
                            .ghost()
                            .label("削除")
                            .on_click(cx.listener(move |this, _, _, cx| {
                                this.todos.remove(ix);
                                cx.notify();
                            })),
                    )
            }))
            .child(
                div()
                    .text_sm()
                    .text_color(cx.theme().muted_foreground)
                    .child(format!("残り {remaining} 件")),
            )
    }
}

fn main() {
    gpui_kit::application()
        .with_assets(gpui_kit::assets::Assets)
        .run(|cx: &mut App| {
            gpui_kit::init(cx);

            cx.bind_keys([KeyBinding::new(
                "cmd-shift-backspace",
                ClearCompleted,
                Some("TodoApp"),
            )]);

            let bounds = Bounds::centered(None, size(px(420.), px(480.)), cx);
            gpui_kit::open_window(
                WindowOptions {
                    window_bounds: Some(WindowBounds::Windowed(bounds)),
                    ..Default::default()
                },
                cx,
                |window, cx| cx.new(|cx| TodoApp::new(window, cx)),
            )
            .unwrap();
            cx.activate(true);
        });
}
```

### Action を定義する

Action は「完了済みを削除する」のような論理的な操作を表す型です。`actions!` マクロで定義します。

```rust
actions!(todo_app, [ClearCompleted]);
```

`actions!` マクロは、第 2 引数に並べた名前ごとに、フィールドを持たない構造体を生成します。この 1 行で、次のような `ClearCompleted` 型が定義されます。

```rust
#[derive(Clone, PartialEq, Default, Debug, Action)]
#[action(namespace = todo_app)]
pub struct ClearCompleted;
```

第 1 引数は名前空間で、Action は `todo_app::ClearCompleted` のように「名前空間::型名」の形の名前で識別されます。Zed のショートカット設定でも、`"cmd-z": "editor::Undo"` のように同じ形式の名前で Action を指定しています。どのキーで実行するかは、Action の定義には含めません。キーとの対応付けは後で別に登録します。

### Action を処理するメソッドを追加する

`ClearCompleted` が実行されたときの処理を、`TodoApp` のメソッドとして実装します。

```rust
fn clear_completed(
    &mut self,
    _: &ClearCompleted,
    _window: &mut Window,
    cx: &mut Context<Self>,
) {
    self.todos.retain(|todo| !todo.done);
    cx.notify();
}
```

第 2 引数の型が `&ClearCompleted` になっている点が重要です。GPUI は、ハンドラの引数の型からどの Action を処理するかを決めます。処理の内容は、完了していない ToDo だけを残して `cx.notify()` を呼ぶだけです。

### 要素にキーコンテキストとハンドラを登録する

Action を処理する側は、要素に `.key_context()` でキーコンテキストの名前を付け、`.on_action()` でハンドラを登録します。ここでは `render()` が返すルートの `div()` に追加します。

```rust
div()
    .key_context("TodoApp")
    .on_action(cx.listener(Self::clear_completed))
```

`.on_action()` が受け取るクロージャにも `self` の引数がないため、クリックのハンドラと同じく `cx.listener()` で `clear_completed` メソッドを変換しています。キーコンテキストは、次の手順でキーバインドを有効にする範囲を指定するときに使います。

### キーと Action を対応付ける

キーと Action の対応付けは、要素とは別に `main()` で `cx.bind_keys()` を使って登録します。

```rust
cx.bind_keys([KeyBinding::new(
    "cmd-shift-backspace",
    ClearCompleted,
    Some("TodoApp"),
)]);
```

`KeyBinding::new()` の第 3 引数がキーコンテキストです。`Some("TodoApp")` を指定したキーバインドは、フォーカスを持つ要素から親へたどった経路に `TodoApp` のキーコンテキストが含まれるときだけ有効になります。この ToDo アプリでは、起動時に `input.focus(window, cx)` で入力欄にフォーカスを当てています。入力欄は `TodoApp` の要素の子孫なので、入力中に `cmd-shift-backspace` を押すと `ClearCompleted` が `TodoApp` まで届きます。

キーコンテキストが入れ子になっている場合は、フォーカスに近い内側のコンテキストのキーバインドが優先されます。例えば Zed ではエディタのキーバインドが、それを含むペインやワークスペースのキーバインドより優先されます。

`cargo run` で起動し、いくつかの ToDo を完了にしてから `cmd-shift-backspace` を押すと、完了済みの ToDo がまとめて削除されます。

!v(https://videos.ctfassets.net/in6v9lxmm5c8/g8QEr8XGCqtBgujDHYL1d/46b1a1e2f9153c803776a6b5c9af1eb2/gpui-todo-app-4.mp4 486x580)

## まとめ

- GPUI は Zed のために開発された Rust の UI フレームワークで、UI を矩形や文字などのプリミティブに分解して GPU で描画する
- アプリの状態は `cx.new()` で `App` に渡し、`Entity<T>` ハンドルと `App` を通じて `read()` / `update()` で読み書きする
- View は `Render` トレイトを実装した `Entity` で、`render()` は再描画のたびに状態から要素ツリーを作り直す
- 状態を変更したら `cx.notify()` を呼んで GPUI に再描画を要求する
- クリックなどのハンドラから View の状態を変更するには、`cx.listener()` でクロージャを変換する
- `div()` でクリックなどのイベントを扱うには `.id()` で ID を付ける必要がある
- GPUI 本体には入力欄などの部品がないため、GPUI Kit（gpui-component）の `Input`・`Checkbox`・`Button` で補える。GPUI Kit を使うときは `gpui_kit::init()` を呼び、`gpui_kit::open_window()` でウィンドウを開く
- キーボード操作は `actions!` で定義した Action を `.key_context()` と `.on_action()` で処理し、`cx.bind_keys()` でキーと対応付ける

## 参考

- [GPUI](https://www.gpui.rs/)
- [zed/crates/gpui at main · zed-industries/zed](https://github.com/zed-industries/zed/tree/main/crates/gpui)
- [Contexts（GPUI ドキュメント）](https://github.com/zed-industries/zed/blob/main/crates/gpui/docs/contexts.md)
- [Key Dispatch（GPUI ドキュメント）](https://github.com/zed-industries/zed/blob/main/crates/gpui/docs/key_dispatch.md)
- [Leveraging Rust and the GPU to render user interfaces at 120 FPS - Zed Blog](https://zed.dev/blog/videogame)
- [Ownership and data flow in GPUI - Zed Blog](https://zed.dev/blog/gpui-ownership)
- [Stanislav Vishnevskiy 氏の X への投稿（2026 年 11 月 4 日）](https://x.com/svishnevskiy/status/2118081920194203799)
- [「Discord」がクライアント全体を「Rust」で書き直し、「Electron」から脱却へ - 窓の杜](https://forest.watch.impress.co.jp/docs/news/2154396.html)
- [longbridge/gpui-kit](https://github.com/longbridge/gpui-kit)
- [GPUI Kit](https://gpui-kit.com/)
- [gpui - crates.io](https://crates.io/crates/gpui)
- [gpui-pre - crates.io](https://crates.io/crates/gpui-pre)
