---
id: 57I_Q2rPdOMkGmdMRwsB_
title: "はじめての MoonBit"
slug: "getting-started-with-moonbit"
about: "MoonBit は WebAssembly と JavaScript にコンパイル可能な新しいプログラミング言語です。Rust 風のシンタックスと関数型プログラミングの特徴を持ちながら、ガベージコレクションを採用しているという特徴があります。この記事では MoonBit の基本的な使い方をチュートリアル形式で紹介します。"
createdAt: "2026-01-25T13:41+09:00"
updatedAt: "2026-01-25T13:41+09:00"
tags: ["moonbit"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/5m1i8jyJWjJK7IfPJapmIe/d7eaec7bbe09c289ce0aec683f088f5d/tsukimi-udon_16432-768x630.png"
  title: "月見うどんのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "MoonBit で変数をミュータブルにするにはどのキーワードを使用しますか？"
      answers:
        - text: "var"
          correct: false
          explanation: null
        - text: "let mut"
          correct: true
          explanation: "変数をミュータブルにするには `let mut` キーワードを使用します。デフォルトの `let` で宣言した変数はイミュータブルです。"
        - text: "mut"
          correct: false
          explanation: null
        - text: "mutable"
          correct: false
          explanation: null
    - question: "MoonBit でエラーを投げるにはどのキーワードを使用しますか？"
      answers:
        - text: "throw"
          correct: false
          explanation: null
        - text: "raise"
          correct: true
          explanation: "MoonBit では `raise` キーワードを使用してエラーを投げます。"
        - text: "error"
          correct: false
          explanation: null
        - text: "panic"
          correct: false
          explanation: null
    - question: "MoonBit でパッケージ外から呼び出せる関数にするために必要なキーワードはどれですか？"
      answers:
        - text: "public"
          correct: false
          explanation: null
        - text: "export"
          correct: false
          explanation: null
        - text: "pub"
          correct: true
          explanation: "パッケージ外から呼び出せる関数にするには、関数の前に `pub` キーワードを付けます。"
        - text: "関数名の先頭を大文字にする"
          correct: false
          explanation: null

published: true
---

[MoonBit](https://moonbitlang.com/) は、WebAssembly (Wasm) や JavaScript (JS) へのコンパイルに対応した新しいプログラミング言語です。中国のスタートアップにより開発されており、以下のような特徴があります。

- 高速なコンパイル
- 出力される Wasm バイナリが軽量
- Rust 風のシンタックス
- パターンマッチングや代数データ型のような関数型プログラミングの特徴をサポート
- Rust のように所有権を管理せずに、ガベージコレクションを使用

この記事では MoonBit のチュートリアルを通じて、基本的な使い方を紹介します。

:::warning
MoonBit は現時点ベータプレビュー版として提供されており、本番環境での使用は推奨されていません。
:::

## 環境構築

はじめに VSCode に MoonBit 拡張機能をインストールします。VSCode の拡張機能マーケットプレイスで "MoonBit" を検索し、インストールしてください。

![](https://images.ctfassets.net/in6v9lxmm5c8/5ESNpwwUjIDnvtAwB9zsx9/5d7e95a41a6e37b2725ea614e0f8ecec/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-25_13.49.34.png)

https://marketplace.visualstudio.com/items?itemName=moonbit.moonbit-lang

次に、MoonBit のコマンドラインツールをインストールします。VSCode のコマンドパレットで "MoonBit: Install moonbit toolchain" を実行します。

![](https://images.ctfassets.net/in6v9lxmm5c8/dq7NIt2fQmBVMJ38OObnI/8cb10528c956fedda10b923067d72d61/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-25_13.52.49.png)

もしくは、以下のコマンドをターミナルで実行してもインストールできます。

```bash
curl -fsSL https://cli.moonbitlang.com/install/unix.sh | bash
```

インストールに成功すれば、`~/.moon` ディレクトリに MoonBit のバイナリが配置され、`moon` コマンドが使用可能になります。

```bash
$ moon version
moon 0.1.20260119 (be99339 2026-01-19)
```

新しい MoonBit プロジェクトを作成するには、`moon new <project-name>` コマンドを実行します。

```bash
$ moon new my_moonbit_project

Warning: Using default username. You may login with `moon login` to store your username, or provide one with `--user <username>`.
Initialized empty Git repository in /my_moonbit_project/.git/
Created username/my_moonbit_project at my_moonbit_project
```

ログインしていないという警告が表示されますが、今のところは無視して問題ないでしょう。`my_moonbit_project` ディレクトリが作成され、その中に MoonBit プロジェクトの雛形が生成されます。

```bash
my_moonbit_project
├── AGENTS.md
├── cmd
│   └── main
│       ├── main.mbt
│       └── moon.pkg.json
├── LICENSE
├── moon.mod.json
├── moon.pkg.json
├── my_moonbit_project_test.mbt
├── my_moonbit_project.mbt
├── README.mbt.md
└── README.md -> README.mbt.md
```

### コードを読む

`moon.mod.json` ファイルはプロジェクトのメタデータや依存関係を管理するファイルです。

```json:moon.mod.json
{
  "name": "username/my_moonbit_project",
  "version": "0.1.0",
  "deps": {},
  "readme": "README.mbt.md",
  "repository": "",
  "license": "Apache-2.0",
  "keywords": [],
  "description": ""
}
```

`cmd/main/main.mbt` ファイルの `main` 関数がエントリーポイントとなります。初期状態では `@lib.fib` 関数を呼び出してフィボナッチ数列を計算しています。

```mbt:cmd/main/main.mbt
///|
fn main {
  println(@lib.fib(10))
}
```

`println` 関数は標準ライブラリの関数で、引数の値をコンソールに出力します。ここでは `@lib.fib(10)` の結果を出力しています。

`@lib.fib` 関数はどこから来たのでしょうか？パッケージ設定ファイルである `moon.pkg.json` にインポートパスの alias が定義されています。

```json:cmd/main/moon.pkg.json
{
  "is-main": true,
  "import": [
    {
      "path": "username/my_moonbit_project",
      "alias": "lib"
    }
  ]
}
```

ここで `username/my_moonbit_project` パッケージを lib というエイリアス名でインポートしています。エイリアスで設定した名前を使って `@<alias>.<function>` という形で関数を呼び出せるようになります。外部のパッケージから呼び出せる関数はすべて `pub` キーワードで公開されている必要があります。

`my_moonbit_project` はプロジェクトのルートディレクトリに存在する `my_moonbit_project.mbt` ファイルです。確かにここでは `pub fn fib()` 関数が定義されています。

```mbt:my_moonbit_project.mbt
///|
pub fn fib(n : Int) -> Int64 {
  loop (n, 0L, 1L) {
    (0, _, b) => b
    (i, a, b) => continue (i - 1, b, a + b)
  }
}

///|
/// data is a labelled argument without default value having type Array[Int]
/// start is an optional labelled argument with default value 0 having type Int
/// length is an optional labelled argument without default value having type Option[Int]
pub fn sum(data~ : Array[Int], start? : Int = 0, length? : Int) -> Int {
  let end = if length is Some(length) { start + length } else { data.length() }
  for i = start, sum = 0; i < end; i = i + 1, sum = sum + data[i] {

  } else {
    sum
  }
}
```

### ビルドと実行

`main` 関数を実行してみましょう。プロジェクトのルートディレクトリで `moon run` コマンドを実行します。

```bash
$ moon run cmd/main
89
```

`fib(10)` の結果である 89 が出力されました。ビルドを行うには `moon build` コマンドを使用します。

```bash
$ moon build
Finished. moon: ran 3 tasks, now up to date
```

ビルドした成果物は `_build` ディレクトリに出力されます。Wasm バイナリが生成されているので、`moonrun` コマンドで実行することも可能です。

```bash
$ moonrun _build/wasm-gc/release/build/cmd/main/main.wasm
89
```

ターゲットを JavaScript に変更してビルドすることもできます。`--target js` オプションを指定して `moon build` コマンドを実行します。

```bash
$ moon build --target js
```

`node` コマンドで生成された JavaScript ファイルを実行できます。

```bash
$ node _build/js/release/build/cmd/main/main.js
89
```

### その他のコマンド

組み込みのコマンドだけでリントやフォーマット、テストなど現代の開発に必要な機能が揃っています。いくつか代表的なコマンドを見てみましょう。

`moon fmt` コマンドはコードのフォーマットを行います。

```bash
moon fmt
```

`moon check` コマンドはビルドを行わずにチェックのみを行います。

```bash
moon check
```

`moon test` コマンドはテストコードを実行します。プロジェクトのルートディレクトリにある `*_test.mbt` もしくは `*_wbtest.mbt` ファイルを自動的に検出して実行します。

```bash
moon test
```

`moon info` コマンドはパッケージが公開している関数のインターフェイスを `.mbti` ファイルとして生成します。

```bash
moon info
```

`moon info` コマンドを実行すると `pkg.generated.mbti` のようなファイルが生成されます。このファイルでは、パッケージが公開している関数や型の情報が記載されています。

```mbti:pkg.generated.mbti
// Generated using `moon info`, DON'T EDIT IT
package "username/my_moonbit_project"

// Values
pub fn fib(Int) -> Int64

pub fn sum(data~ : Array[Int], start? : Int, length? : Int) -> Int

// Errors

// Types and methods

// Type aliases

// Traits
```

すべてのコマンドは `moon help` コマンドで確認できます。

```bash
The build system and package manager for MoonBit.

Usage: moon [OPTIONS] <COMMAND>

Commands:
  new                    Create a new MoonBit module
  build                  Build the current package
  check                  Check the current package, but don't build object files
  run                    Run a main package
  test                   Test the current package
  clean                  Remove the target directory
  fmt                    Format source code
  doc                    Generate documentation or searching documentation for a symbol
  info                   Generate public interface (`.mbti`) files for all packages in the module
  bench                  Run benchmarks in the current package
  add                    Add a dependency
  remove                 Remove a dependency
  install                Install dependencies
  tree                   Display the dependency tree
  login                  Log in to your account
  register               Register an account at mooncakes.io
  publish                Publish the current module
  package                Package the current module
  update                 Update the package registry index
  coverage               Code coverage utilities
  generate-build-matrix  Generate build matrix for benchmarking (legacy feature)
  upgrade                Upgrade toolchains
  shell-completion       Generate shell completion for bash/elvish/fish/pwsh/zsh to stdout
  version                Print version information and exit
  help                   Print this message or the help of the given subcommand(s)

Options:
  -h, --help  Print help

Common Options:
  -C, --directory <SOURCE_DIR>
          The source code directory. Defaults to the current directory
      --target-dir <TARGET_DIR>
          The target directory. Defaults to `source_dir/target`
  -q, --quiet
          Suppress output
  -v, --verbose
          Increase verbosity
      --trace
          Trace the execution of the program
      --dry-run
          Do not actually run the command
  -Z, --unstable-feature <UNSTABLE_FEATURE>
          Unstable flags to MoonBuild [env: MOON_UNSTABLE=] [default: ]
```

## MoonBit チュートリアル - TODO アプリ

MoonBit のチュートリアルとしてコマンドラインで動作する TODO アプリを作成してみましょう。以下のようにコマンドライン引数を受け取り、TODO の追加、一覧表示、完了を行うアプリケーションを作成します。

```sh
$ moon run cmd/main -- add "Buy groceries"
Added TODO: Buy groceries
$ moon run cmd/main -- list
1. [ ] Buy groceries
$ moon run cmd/main -- complete 1
Completed TODO #1
$ moon run cmd/main -- add "Walk the dog"
Added TODO: Walk the dog
$ moon run cmd/main -- list
1. [x] Buy groceries
2. [ ] Walk the dog
```

完成後のコードは以下のリポジトリで確認できます。

https://github.com/azukiazusa1/moonbit-todo-example

### コマンドライン引数を受け取る

コマンドライン引数を受け取るには MoonBit の標準ライブラリの `@sys.get_cli_args()` 関数を使用します。はじめに [moonbitlang/x](http://mooncakes.io/docs/moonbitlang/x) パッケージを `moon add` コマンドでインストールします。

```bash
$ moon add moonbitlang/x
Registry index updated successfully
Downloading moonbitlang/x
```

インストールに成功すると `moon.mod.json` ファイルに依存関係が追加されます。

```json:moon.mod.json {4-6}
{
  "name": "username/my_moonbit_project",
  "version": "0.1.0",
  "deps": {
    "moonbitlang/x": "0.4.38"
  },
  "readme": "README.mbt.md",
  "repository": "",
  "license": "Apache-2.0",
  "keywords": [],
  "description": ""
}
```

`cmd/main/moon.pkg.json` ファイルに `moonbitlang/x` パッケージをインポートする設定を追加します。

```json:cmd/main/moon.pkg.json {4-7}
{
  "is-main": true,
  "import": ["moonbitlang/x/sys"]
}
```

これで `@sys` エイリアスを使って `moonbitlang/x/sys` パッケージの関数を呼び出せるようになります。コマンドライン引数の取得をテストする簡単なプログラムを作成しましょう。

`cmd/main/main.mbt` ファイルを以下のように編集します。

```mbt:cmd/main/main.mbt
///|
fn main {
  // コマンドライン引数を配列として取得
  let args = @sys.get_cli_args()
  println("引数の数: \{args.length()}")
  // 全ての引数を表示
  for i = 0; i < args.length(); i = i + 1 {
    println("引数[\{i}]: \{args[i]}")
  }
}
```

変数は `let` キーワードで定義します。変数の型定義は省略可能で、MoonBit の型推論によって自動的に型が決定されます。`args` 変数には `@sys.get_cli_args()` 関数の戻り値である `Array[String]` 型が代入されます。明示的に型を指定したい場合は、以下のようにコロン `:` の後に型名を記述します。

```mbt
let args : Array[String] = @sys.get_cli_args()
```

また MoonBit の配列はデフォルトでイミュータブルであるという特徴があります。つまり、一度作成した変数に対して再代入することができません。

```mbt
let foo = 42
foo = 100  // The variable foo is not mutable.
```

変数をミュータブルにするには、`let mut` キーワードを使用します。

```mbt
let mut counter = 0
counter = counter + 1
println(counter)  // 1
```

引数の一覧を `for` 式でループ処理し、すべての引数を表示しています。MoonBit は文字列補完をサポートしているため、`"\{変数名}"` のように記述することで文字列の中に変数の値を埋め込むことができます。

```mbt
println("引数[\{i}]: \{args[i]}")
```

`moon run` コマンドでプログラムを実行し、引数を渡してみましょう。`moon run` コマンドで引数を渡すには、`--` の後に引数を指定します。

```bash
$ moon run cmd/main -- add "Buy groceries"

引数の数: 3
引数[0]: /my_moonbit_project/_build/wasm-gc/release/build/cmd/main/main.wasm
引数[1]: add
引数[2]: Buy groceries
```

`args[0]` は実行ファイルのパス、`args[1]` 以降が実際の引数となります。`args[1]` の値によって処理を分岐し、`@todo` パッケージの関数を呼び出すようにしましょう。関数は [Result](https://mooncakes.io/docs/moonbitlang/core/result) 型を返すようにし、成功時と失敗時でメッセージを出力するようにします。`Result` 型の値は `match` 式でパターンマッチングで取得できるほか、`or_else` メソッドを使用して失敗時の処理を定義することもできます。

```mbt:cmd/main/main.mbt
///|
fn main {
  let args = @sys.get_cli_args()
  if args.length() < 2 {
    println("Usage: todo <command> [args...]")
    return
  }
  let command = args[1]
  if command == "add" {
    if args.length() < 3 {
      println("Usage: todo add <task>")
      return
    }
    let task = args[2]
    let msg = @todo.add_task(task).or_else(() => "Failed to add task.")
    println(msg)
  } else if command == "list" {
    let msg = @todo.list_tasks().or_else(() => "Failed to list tasks.")
    println(msg)
  } else if command == "complete" {
    if args.length() < 3 {
      println("Usage: todo complete <task_id>")
      return
    }
    let task_id = args[2]
    let msg = @todo.complete_task(task_id).or_else(() => "Failed to complete task.")
    println(msg)
  } else {
    println("Unknown command: \{command}")
  }
}
```

`cmd/main/pkg.json` ファイルに `todo` パッケージをインポートする設定を追加します。

```json:cmd/main/moon.pkg.json {5-8}
{
  "is-main": true,
  "import": [
    "moonbitlang/x/sys",
    {
      "path": "username/my_moonbit_project",
      "alias": "todo"
    }
  ]
}
```

### データ構造の定義

`todo` パッケージの関数を実装していきましょう。まずは TODO アイテムを格納するためのデータ構造を定義します。[struct](https://docs.moonbitlang.com/en/latest/language/fundamentals.html#struct) を使用すると独自のデータ型を定義できます。
`my_moonbit_project.mbt` ファイルに以下のように `TodoItem` 構造体を追加します。

```mbt:my_moonbit_project.mbt
///|
struct TodoItem {
  id : String
  description : String
  completed : Bool
}
```

`struct` のフィールドは `フィールド名 : 型` のように定義します。ここでは `id`、`description`、`completed` の 3 つのフィールドを持つ `TodoItem` 構造体を定義しています。フィールドはデフォルトでイミュータブルですが、`mut` キーワードを使用してミュータブルにすることも可能です。

一旦 `main` 関数をコンパイルできるように、`todo` パッケージの関数をスタブ実装します。関数は `fn` キーワードで定義します。関数の前に `pub` キーワードを付けると、パッケージ外からも呼び出せるようになります。関数の引数は `(引数名 : 型, ...)` のように定義し、戻り値の型は `-> 戻り値の型` のように指定します。引数と戻り値の型は必須です。

`Result` 型の戻り値は `Result[成功時の型, 失敗時の型]` のように定義します。ここでは成功時と失敗時の両方で `String` 型を返すようにしています。成功時は `Ok(値)`、失敗時は `Err(値)` を返すことで `Result` 型の値を生成できます。

```mbt:my_moonbit_project.mbt {13-25}
///|
pub fn add_task(description : String) -> Result[String, String] {
  // Implementation to add a task
  Ok("")
}

///|
pub fn list_tasks() -> Result[String, String] {
  // Implementation to list tasks
  Ok("")
}

///|
pub fn complete_task(task_id : String) -> Result[String, String] {
  // Implementation to complete a task
  Ok("")
}
```

### TODO アイテムの追加

TODO アイテムを追加する `add_task` 関数を実装します。TODO アイテムはファイルに JSON で保存します。MoonBit の標準ライブラリの [moonbitlang/x/fs](https://mooncakes.io/docs/moonbitlang/x/fs) パッケージを使用してファイルの読み書きを、[moonbitlang/core/json](https://mooncakes.io/docs/moonbitlang/core/json) パッケージを使用して JSON のパースとシリアライズを行います。`moonbitlang/core` パッケージは追加のインストールは不要ですが、`moon.pkg.json` ファイルにインポート設定を追加する必要があります。

プロジェクトルートにある `moon.pkg.json` ファイルにパッケージをインポートする設定を追加します。

```json:moon.pkg.json
{
  "import": ["moonbitlang/x/fs", "moonbitlang/core/json"]
}
```

はじめに `@fs.read_file_to_string` 関数で TODO ファイルを読み込み、JSON 形式で保存されているタスクを `@json.parse` 関数でパースします。新しいタスクを追加し、`@fs.write_string_to_file` 関数でファイルに書き戻します。`json_to_tasks` 関数と `tasks_to_json` 関数は後で実装します。

```mbt:my_moonbit_project.mbt
///|
let file_path = "todo_list.json"

///|
pub fn add_task(description : String) -> Result[String, String] {

  // 既存のタスクを読み込むか、新しいリストを作成
  let tasks = try {
    let content = @fs.read_file_to_string(file_path)
    let json = @json.parse(content)
    json_to_tasks(json)
  } catch {
    _ => []
  }

  // 新しいタスクを作成
  let new_id = (tasks.length() + 1).to_string()
  let new_task = { id: new_id, description, completed: false }

  // タスクを追加
  tasks.push(new_task)

  // JSON に変換してファイルに書き込む
  let json_content = tasks_to_json(tasks)
  try {
    @fs.write_string_to_file(file_path, json_content)
    Ok("Added TODO: \{description}")
  } catch {
    _ => Err("Failed to write TODO file.")
  }
}
```

`@fs.read_file_to_string` 関数は `@fs.IOError` を、`@json.parse` 関数は `@json.ParseError` をそれぞれ `raise` する可能性があります。エラーを `raise` するかどうかは関数の型定義を見ることで確認できます。例えば、`@fs.read_file_to_string` 関数の型定義は以下のようになっています。

```mbt
fn @moonbitlang/x/fs.read_file_to_string(path : String, encoding? : String) -> String raise @fs.IOError
```

`@fs.IOError` はファイルの読み書きに失敗した場合に発生するエラーで、MoonBit ではすべてのエラーは `Error` 型のサブタイプとして扱われます。エラーが発生する可能性がある関数は `raise` キーワードでエラーを宣言し、`raise` でエラーを発生させることができます。

```mbt
// Error は直接使用できないので、`suberror` キーワードでサブタイプを定義する
suberror DivError String

// raise DivError を宣言
fn div(x : Int, y : Int) -> Int raise DivError {
  if y == 0 {
    // raise でエラーを発生させる
    raise DivError("division by zero")
  }
  x / y
}
```

エラーをキャッチするには `try` 式を使用します。`try` 式はエラーが発生する可能性があるコードブロックを囲み、エラーが発生した場合に実行される `catch` ブロックを定義します。`catch` ブロックでは発生したエラーの型にマッチさせて処理を分岐できます。

ここでは、TODO ファイルの読み込みや JSON のパースに失敗した場合に空のタスクリストを返すようにしています。すべてのエラーにマッチさせるため、`catch` ブロックでワイルドカードパターン `_` を使用しています。

```mbt:my_moonbit_project.mbt
  let tasks = try {
    let content = @fs.read_file_to_string(file_path)
    let json = @json.parse(content)
    json_to_tasks(json)
  } catch {
    _ => []
  }
```

`try/catch` を使用する代わりに `try?` で `Result` 型に変換することも可能です。

```mbt
let tasks_result = try? {
  let content = @fs.read_file_to_string(file_path)
  let json = @json.parse(content)
  json_to_tasks(json)
}
let tasks = match tasks_result {
  Ok(tasks) => tasks
  Err(_) => []
}
```

TODO アイテムの現在の要素数を元に新しい ID を生成し、新しいタスクを作成してリストに追加します。`struct` 型を初期化するには、フィールド名と値のペアを `{ フィールド名: 値, ... }` のように指定します。

```mbt:my_moonbit_project.mbt
let new_id = (tasks.length() + 1).to_string()
let new_task = { id: new_id, description, completed: false }
```

最後に、タスクリストを JSON 形式に変換してファイルに書き込みます。ファイルの書き込みにもエラーが発生する可能性があるため、再度 `try` 式でエラーハンドリングを行います。成功した場合は `Ok` を、失敗した場合は `Err` を返すようにします。

```mbt:my_moonbit_project.mbt
let json_content = tasks_to_json(tasks)
try {
  @fs.write_string_to_file(file_path, json_content)
  Ok("Added TODO: \{description}")
} catch {
  _ => Err("Failed to write TODO file.")
}
```

未実装だった `json_to_tasks` 関数と `tasks_to_json` 関数も実装しましょう。`json_to_tasks` 関数は JSON データを受け取り、`Array[TodoItem]` 型に変換します。MoonBit では基本のデータ型として [Json](https://docs.moonbitlang.com/en/stable/language/fundamentals.html#json) がサポートされているので `Json` 型を関数の引数として受け取ります。

```mbt:my_moonbit_project.mbt
///|
fn json_to_tasks(json : Json) -> Array[TodoItem] {
  // ...
}
```

はじめに [guard](https://docs.moonbitlang.com/en/stable/language/fundamentals.html#guard-statement) 文を使用して、引数の JSON データが配列であることを確認します。`Json` 型の値が特定の型であるかどうかをチェックするには、`is` キーワードを使用します。`is` キーワードはパターンマッチングの一種で、型ガードとして使用でき、新しい変数 `items` にマッチした配列をバインドします。

```mbt:my_moonbit_project.mbt
fn json_to_tasks(json : Json) -> Array[TodoItem] {
  // JSON が配列であることを確認
  guard json is Array(items)
}
```

配列のそれぞれの要素が `TodoItem` 型を満たしているかどうかを確認しながら、`TodoItem` 型の配列に変換します。`for ... in` を使用して配列をループ処理します。MoonBit では JSON をパターンマッチングできるため、`for` 式の中で `is` キーワードを使用して要素の型をチェックします。`completed` フィールドは JSON では `True` または `False` として表現されるため、MoonBit の `Bool` 型に変換します。

最後に、変換したタスクの配列を返します。MoonBit では関数の最後の式がそのまま戻り値となるため、`return` キーワードは不要です。

```mbt:my_moonbit_project.mbt
fn json_to_tasks(json : Json) -> Array[TodoItem] {
  // ... 前略 ...
  let tasks = []
  // 各アイテムを TodoItem に変換
  for item in items {
    if item
      is {
        "id": String(id),
        "description": String(description),
        "completed": completed,
        ..
      } {
      // completed を Bool に変換
      let completed_bool = match completed {
        True => true
        False => false
        _ => false
      }
      tasks.push({ id, description, completed: completed_bool })
    }
  }
  tasks
}
```

`tasks_to_json` 関数は `Array[TodoItem]` 型の引数を受け取り、JSON 形式の文字列に変換する簡単な関数です。

```mbt:my_moonbit_project.mbt
///|
fn tasks_to_json(tasks : Array[TodoItem]) -> String {
  let items = []
  for task in tasks {
    items.push(
      "  {\n    \"id\": \"\{task.id}\",\n    \"description\": \"\{task.description}\",\n    \"completed\": \{task.completed}\n  }",
    )
  }
  "[\n" + items.join(",\n") + "\n]"
}
```

`add_task` 関数が正しく動作するかどうかコマンドを実行して確認しましょう。

```bash
$ moon run cmd/main -- add "Buy groceries"
Added TODO: Buy groceries
```

正しく動作していれば、`todo_list.json` ファイルが作成され、以下のような内容が保存されているはずです。

```json:todo_list.json
[
  {
    "id": "1",
    "description": "Buy groceries",
    "completed": false
  }
]
```

### TODO アイテムの追加のテスト

`add_task` 関数の動作を確認するために、テストコードを作成します。ビルドインでテストフレームワークが用意されているため追加の依存関係をインストールする必要はありません。

MoonBit では public 関数のみにアクセスできるブラックボックステストと、パッケージ内のすべての関数にアクセスできるホワイトボックステストの両方がサポートされています。ブラックボックステストを記述することで、例えば関数をパブリックにし忘れるといったミスを防止できます。ホワイトボックステストは `_wbtest.mbt` というファイル名で、ブラックボックステストは `_test.mbt` というファイル名で作成します。

まずはプライベート関数である `json_to_tasks` 関数と `tasks_to_json` 関数のホワイトボックステストを作成します。プロジェクトのルートディレクトリに `my_moonbit_project_wbtest.mbt` ファイルを作成し、以下のように記述します。

```mbt:my_moonbit_project_wbtest.mbt
///|
test "json_to_tasks converts valid JSON array to TodoItem array" {
  let json_str = "[{\"id\":\"1\",\"description\":\"Buy milk\",\"completed\":false},{\"id\":\"2\",\"description\":\"Write code\",\"completed\":true}]"
  let json = @json.parse(json_str)
  let tasks = json_to_tasks(json)
  assert_eq(tasks.length(), 2)
  inspect(tasks, content="")
}

///|
test "json_to_tasks returns empty array for empty JSON array" {
  let json = @json.parse("[]")
  let tasks = json_to_tasks(json)
  assert_eq(tasks.length(), 0)
}

///|
test "tasks_to_json converts TodoItem array to correct JSON string" {
  let tasks = [
    { id: "1", description: "Test task 1", completed: false },
    { id: "2", description: "Test task 2", completed: true },
  ]
  let json_str = tasks_to_json(tasks)

  // JSON文字列が正しく生成されることを確認
  inspect(json_str, content="")
}
```

テストは `test` ブロック内に記述します。テストの中で `assert_eq` 関数を使用して期待される値と実際の値が等しいことを確認したり、`inspect` 関数を使用して特定の条件が満たされているかどうかをチェックしたりできます。`TaskItem` 構造体の配列を `inspect` 関数で表示するために、`TodoItem` 構造体に `Show` トレイトを実装する必要があります。`TodoItem` 構造体の定義の最後に `derive()` を追加します。

```mbt:my_moonbit_project_wbtest.mbt {5}
struct TodoItem {
  id : String
  description : String
  completed : Bool
} derive(Show)
```

`inspect` 関数は第 2 引数の `content` パラメータで期待される内容を指定できます。ここでは空文字列 `""` を指定しているのですが、これは実際の値をスナップショットとして保存することを意味します。`moon test --update` コマンドでスナップショットを更新できます。

```bash
$ moon test --update
Total tests: 3, passed: 3, failed: 0.
```

スナップショットを更新するとテストファイルのコードの `content` パラメータにスナップショットの内容が自動的に挿入されます。

```mbt:my_moonbit_project_wbtest.mbt {7-9}
///|
test "json_to_tasks converts valid JSON array to TodoItem array" {
  let json_str = "[{\"id\":\"1\",\"description\":\"Buy milk\",\"completed\":false},{\"id\":\"2\",\"description\":\"Write code\",\"completed\":true}]"
  let json = @json.parse(json_str)
  let tasks = json_to_tasks(json)
  assert_eq(tasks.length(), 2)
  inspect(tasks, content=(
    #|[{id: "1", description: "Buy milk", completed: false}, {id: "2", description: "Write code", completed: true}]
  ))
}
```

テストが失敗する場合には、どのテストが失敗したのか、どのような値が期待されていたのかが表示されます。

```bash
$ moon test
[username/my_moonbit_project] test my_moonbit_project_wbtest.mbt:2 ("json_to_tasks converts valid JSON array to TodoItem array") failed: my_moonbit_project_wbtest.mbt:6:3-6:31@username/my_moonbit_project FAILED: `2 != 1`
Total tests: 3, passed: 2, failed: 1.
```

ブラックボックステストとして `add_task` 関数のテストも作成してみましょう。プロジェクトのルートディレクトリに `my_moonbit_project_test.mbt` ファイルを作成します。ここでは `add_task` 関数を呼び出し、TODO アイテムが正しく追加されることスナップショットテストで確認します。

ここでは JSON 文字列をそのままスナップショットとし保存するので、`inspect()` 関数を使用せずに `__snapshots__` ディレクトリにファイルとして保存する方法を使用します。`@test.T::write` や `@test.T::writelln` 関数を使用すると任意の文字列をスナップショットとして記録し、`t.snapshot()` メソッドで保存します。

まずは `"moonbitlang/core/test"` パッケージをインポートする設定を `moon.pkg.json` ファイルに追加します。

```json:moon.pkg.json {5}
{
  "import": [
    "moonbitlang/x/fs",
    "moonbitlang/core/json",
    "moonbitlang/core/test"
  ]
}
```

テストコードを以下のように記述します。 `@test.Test` 型の引数を受け取ることで、テストコンテキストにアクセスできます。

```mbt:my_moonbit_project_test.mbt
///|
let file_path = "todo_list.json"

///|
/// テスト用にファイルをクリアするユーティリティ関数
fn clear_tasks() -> Unit {
  @fs.write_string_to_file(file_path, "[]") catch {
    _ => ()
  }
}

///|
test "add_task creates multiple tasks with unique IDs" (t : @test.Test) {
  clear_tasks()
  let _ = add_task("First task")
  let _ = add_task("Second task")
  let content = @fs.read_file_to_string(file_path)
  let json = @json.parse(content)

  // スナップショットテスト
  t.write(json)
  t.snapshot(filename="add_task_multiple_tasks_snapshot")
}
```

スナップショットは `moon test --update` コマンドで更新できます。はじめてスナップショットテストを実行する場合や、スナップショットを更新したい場合に使用します。

```bash
Total tests: 4, passed: 4, failed: 0.
```

スナップショットは `__snapshots__` ディレクトリに保存されます。次回以降のテスト実行時には、生成されたスナップショットと保存されているスナップショットが比較され、一致しない場合にはテストが失敗します。

```txt:__snapshots__/add_task_multiple_tasks_snapshot
Array([Object({"id": String("1"), "description": String("First task"), "completed": False}), Object({"id": String("2"), "description": String("Second task"), "completed": False})])
```

スナップショットが一致しない場合にはテストを実行したときに以下のような差分が表示されます。

```bash
$ moon test
[username/my_moonbit_project] test my_moonbit_project_test.mbt:13 ("add_task creates multiple tasks with unique IDs") failed
expect test failed at/my_moonbit_project/my_moonbit_project_test.mbt:22:3
Diff: (- expected, + actual)
----
-Array([Object({"id": String("1"), "description": String("First task"), "completed": False}), Object({"id": String("2"), "description": String("Second task"), "completed": False})])
+Array([Object({"id": String("2"), "description": String("First task"), "completed": False}), Object({"id": String("3"), "description": String("Second task"), "completed": False})])
----

Total tests: 4, passed: 3, failed: 1.
```

### TODO アイテムの一覧表示と完了

残りの `list_tasks` 関数と `complete_task` 関数も実装しましょう。`list_tasks` 関数は TODO ファイルを読み込み、タスクの一覧を文字列として返します。

```mbt:my_moonbit_project.mbt
///|
pub fn list_tasks() -> Result[String, String] {
  let tasks = try {
    let content = @fs.read_file_to_string(file_path)
    let json = @json.parse(content)
    json_to_tasks(json)
  } catch {
    _ => []
  }
  if tasks.length() == 0 {
    return Ok("No tasks found.")
  }
  let lines = []
  for task in tasks {
    let status = if task.completed { "[✓]" } else { "[ ]" }
    lines.push("\{status} \{task.id}. \{task.description}")
  }
  Ok(lines.join("\n"))
}
```

`complete_task` 関数は指定された ID のタスクが存在するか `.any()` メソッドで確認し、存在する場合には `completed` フィールドを `.map()` メソッドで `true` に更新してファイルに書き戻します。

```mbt:my_moonbit_project.mbt
///|
pub fn complete_task(task_id : String) -> Result[String, String] {
  // 既存のタスクを読み込む
  let tasks = try {
    let content = @fs.read_file_to_string(file_path)
    let json = @json.parse(content)
    json_to_tasks(json)
  } catch {
    _ => []
  }

  // タスクが存在するかチェック
  if not(tasks.any(fn(task) { task.id == task_id })) {
    return Err("Error: Task ID \{task_id} not found.")
  }

  // map を使ってタスクを変換
  let updated_tasks = tasks.map(fn(task) {
    if task.id == task_id {
      { id: task.id, description: task.description, completed: true }
    } else {
      task
    }
  })

  // JSON に変換してファイルに書き込む
  let json_content = tasks_to_json(updated_tasks)
  try {
    @fs.write_string_to_file(file_path, json_content)
    Ok("Task \{task_id} marked as completed")
  } catch {
    _ => Err("Error: Failed to write to file")
  }
}
```

コマンドを実行して、TODO アプリが正しく動作するか確認しましょう。

```bash
$ moon run cmd/main -- add "Buy groceries"
Added TODO: Buy groceries
$ moon run cmd/main -- list
[ ] 1. Buy groceries
$ moon run cmd/main -- complete 1
Task 1 marked as completed
$ moon run cmd/main -- list
[✓] 1. Buy groceries
```

## まとめ

- MoonBit は WebAssembly や JavaScript にコンパイルできる新しいプログラミング言語。Rust に似た構文を採用しているが、所有権やライフタイムの概念はなく、ガベージコレクションを使用している。
- `moon` コマンドを使用してプロジェクトの作成、ビルド、テスト、パッケージ管理ができる。
- MoonBit の標準ライブラリを使用して、ファイル操作や JSON 処理、コマンドライン引数の取得などを行った
- 独自のデータ型を `struct` キーワードで定義し、関数は `fn` キーワードで定義する。引数と戻り値の型は必須。
- MoonBit では変数はデフォルトでイミュータブル。ミュータブルにするには `let mut` キーワードを使用する。
- MoonBit ではパターンマッチングに `match` 式と `is` キーワードを使用する。
- MoonBit ではエラーハンドリングに `try` 式と `raise` キーワードを使用する。
- MoonBit ではホワイトボックステストとブラックボックステストの両方がサポートされており、スナップショットテストも利用できる。

## 参考

- [MoonBit Documentation — MoonBit v0.7.1 documentation](https://docs.moonbitlang.com/en/latest/)
- [mooncakes.io](https://mooncakes.io/)
- [The MoonBit Blog | MoonBit](https://www.moonbitlang.com/blog/)
- [Updates | MoonBit](https://www.moonbitlang.com/updates)
- [MoonBit Language Tour](https://tour.moonbitlang.com/)
