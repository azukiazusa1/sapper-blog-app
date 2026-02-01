---
id: lOMOK8vKeW2v1Gy_PZ4b4
title: "MoonBit で RESTful API サーバーを構築する"
slug: "moonbit-restful-api-server"
about: "MoonBit は、WebAssembly や JavaScript にコンパイルできる新しいプログラミング言語です。この記事では、MoonBit を使用してシンプルな RESTful API サーバーを作成する方法を紹介します。"
createdAt: "2026-02-01T13:50+09:00"
updatedAt: "2026-02-01T13:50+09:00"
tags: ["moonbit"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/77j9Skmuy8RkubgTLSMgIc/ff05e2a8bede4eedc8d0d231432ad726/komodo-dragon_23015-768x591.png"
  title: "コモドドラゴンのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "MoonBit の非同期関数を定義するキーワードは何ですか？"
      answers:
        - text: "await"
          correct: false
          explanation: "`await` は非同期関数内で他の非同期関数を呼び出す際に使用しますが、関数の定義には使用しません。"
        - text: "defer"
          correct: false
          explanation: "`defer` は関数の終了時に実行されるコードブロックを指定するためのキーワードであり、非同期関数の定義には使用しません。"
        - text: "async"
          correct: true
          explanation: "`async` キーワードを使用して非同期関数を定義します。"
        - text: "キーワードは不要"
          correct: false
          explanation: null
    - question: "MoonBit の `obj..method` の用途として正しいものはどれですか？"
      answers:
        - text: "1 つのオブジェクトに対して複数のメソッドを連続して呼び出す"
          correct: true
          explanation: "`.` を 2 つ連続して使用するカスケード記法により、1 つのオブジェクトに対して複数のメソッドを連続して呼び出すことができます。"
        - text: "メソッドの呼び出しを改行できる"
          correct: false
          explanation: "改行は関係なく、カスケード記法は複数のメソッドを連続して呼び出すための構文です。"
        - text: "エラーを無視してメソッドを呼び出す"
          correct: false
          explanation: null
        - text: "非同期メソッドを呼び出す"
          correct: false
          explanation: null
    - question: "`#cfg(target=\"native\")` 属性の役割は何ですか？"
      answers:
        - text: "ネイティブターゲットでコンパイルする場合にのみコードを含める"
          correct: true
          explanation: "`#cfg(target=\"native\")` は条件付きコンパイル属性で、ネイティブターゲット向けにのみコードをコンパイルします。`@socket` や `@http` パッケージがネイティブ環境のみ利用可能なため使用されています。"
        - text: "コードの実行速度を最適化する"
          correct: false
          explanation: "最適化のための属性ではなく、条件付きコンパイルのための属性です。"
        - text: "デバッグ情報を追加する"
          correct: false
          explanation: "デバッグ情報の追加ではなく、特定のターゲット向けにコードをコンパイルするための属性です。"
        - text: "ネイティブライブラリをリンクする"
          correct: false
          explanation: "ライブラリのリンクは `link` フィールドで設定します。`#cfg` は条件付きコンパイルのための属性です。"
published: true
---
[MoonBit](https://www.moonbitlang.com/) は、WebAssembly や JavaScript にコンパイルできる新しいプログラミング言語です。Rust のような構文とパフォーマンスを持ちつつ、ガベージコレクションを採用し所有権やライフタイムといった概念がないという点が特徴です。

この記事では、MoonBit を使用してシンプルな RESTful API サーバーを構築する方法を紹介します。TODO アイテムを管理するための基本的な CRUD 操作を提供する API サーバーの作成を通じて、以下の内容をカバーします。

- `moonbitlang/async` パッケージを使用して非同期処理による HTTP サーバー
- パターンマッチングを活用したルーティング機能の実装
- `mattn/postgres` パッケージを使用して PostgreSQL データベースと連携
- 構造体とトレイトを活用してデータベース操作を抽象化

## 環境構築

まず、MoonBit のコンパイラをインストールします。[公式のインストールガイド](https://www.moonbitlang.com/download/)に従って、最新のバージョンをインストールしてください。

```bash
# macOS/Linux
curl -fsSL https://cli.moonbitlang.com/install/unix.sh | bash
# Windows
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser; irm https://cli.moonbitlang.com/install/powershell.ps1 | iex
```

インストールが完了したら `moon` コマンドが使用できるようになります。ターミナルで以下のコマンドを実行して、インストールが成功したことを確認してください。

```bash
$ moon version
moon 0.1.20260119 (be99339 2026-01-19)

Feature flags enabled: rupes_recta
-> You're currently using the experimental build graph generator "Rupes Recta". If you encounter a problem, please verify whether it also reproduces with the legacy build (by setting NEW_MOON=0).
```

VSCode を使用している場合は、MoonBit 拡張機能をインストールするとよいでしょう。

https://marketplace.visualstudio.com/items?itemName=moonbit.moonbit-lang

MoonBit のプロジェクトを作成するには `moon new` コマンドを使用します。

```bash
moon new moonbit_rest_app
```

このコマンドにより、`moonbit_rest_app` というディレクトリが作成され、その中に基本的なプロジェクト構造が生成されます。

```sh
moonbit_rest_app
├── AGENTS.md
├── cmd
│   └── main
│       ├── main.mbt
│       └── moon.pkg.json
├── LICENSE
├── moon.mod.json
├── moon.pkg.json
├── moonbit_rest_app_test.mbt
├── moonbit_rest_app.mbt
├── README.mbt.md
└── README.md -> README.mbt.md
```

## RESTful API サーバーの作成

初めに、簡単な RESTful API サーバーを作成します。非同期でリクエストを処理するために [moonbitlang/async](https://mooncakes.io/docs/moonbitlang/async) パッケージを使用します。以下のコマンドで依存関係を追加します。

```moon
moon add moonbitlang/async
```

依存関係が追加されたら `moon.mod.json` ファイルの `deps` フィールドに `"moonbitlang/async"` が追加されます。

```json:moon.mod.json {4-6}
{
  "name": "username/moonbit_rest_app",
  "version": "0.1.0",
  "deps": {
    "moonbitlang/async": "0.16.4"
  },
  "readme": "README.mbt.md",
  "repository": "",
  "license": "Apache-2.0",
  "keywords": [],
  "description": ""
}
```

`backend/main.mbt` ファイルと `backend/moon.pkg.json` ファイルをそれぞれ作成し、最小限のサーバーを実装しましょう。`main.mbt` はアプリケーションのエントリーポイントとなるファイルです。`moon.pkg.json` はパッケージの設定ファイルであり、`moon.pkg.json` が存在することにより MoonBit のコンパイラはこのディレクトリをパッケージとして認識します。パッケージ名はディレクトリの名前が使用されます。

`"is-main": true` を指定するとこのパッケージが実行可能であることを示します。`import` フィールドで `moonbitlang/async` パッケージとそのサブパッケージをインポートするように指定します。

```json:backend/moon.pkg.json
{
  "is-main": true,
  "import": [
    "moonbitlang/async",
    "moonbitlang/async/http",
    "moonbitlang/async/socket"
  ]
}
```

`backend/main.mbt` ファイルには以下のコードを記述します。

```mbt:backend/main.mbt
///|
#cfg(target="native")
async fn server(listen_addr : @socket.Addr) -> Unit {
  @http.Server::new(listen_addr).run_forever((_request, _body, conn) => conn
    ..send_response(200, "OK")
    ..write("Hello, Moonbit!"))
}

///|
#cfg(target="native")
async fn main {
  let listen_addr = @socket.Addr::resolve("localhost", port=8080)
  println("Server running on http://localhost:8080")
  server(listen_addr)
}
```

`#cfg(target="native")` は、MoonBit の条件付きコンパイル属性です。この属性は、特定のコンパイルターゲット向けにのみコードをコンパイルするように指定します。`#cfg(target="native")` の場合、その直後の定義（関数や型など）はネイティブターゲットでコンパイルする場合にのみ含まれます。`@socket` や `@http` パッケージがネイティブ環境のみ利用可能なため、これらのコードをネイティブターゲットに限定しています。

`server` 関数と `main` 関数は先頭に `async` キーワードが付与されており、非同期関数として定義されています。これにより、関数内で非同期操作を実行できるようになります。JavaScript や Rust と異なり非同期関数で他の非同期関数を呼び出す際に `await` キーワードは必要ありません。

`@http.Server::run_forever(..)` メソッドは、HTTP サーバーを起動し、リクエストを永続的に処理します。`run_forever` メソッドにはコールバック関数を渡し、リクエストが到着するたびにこの関数が呼び出されます。関数の引数として `request`、`body`、および `conn`（接続オブジェクト）が渡されます。`conn..send_response(...)` メソッドで HTTP ステータスコードとステータスメッセージを送信し、`conn..write(...)` メソッドでレスポンスボディを書き込みます。`.` を 2 つ連続して使用するのは MoonBit のカスケード記法で、1 つのオブジェクトに対して複数のメソッドを連続して呼び出すことができます。

ここではすべてのリクエストに対して "Hello, Moonbit!" というレスポンスを返すようにしています。

`main` 関数では `@socket.Addr::resolve(...)` メソッドを使用してサーバーのアドレスを生成し、`server` 関数を呼び出してサーバーを起動します。

`moon run` コマンドを使用してサーバーを起動します。

```bash
$ moon run backend/main.mbt --target native
```

サーバーが起動したら `curl` コマンドでリクエストを送信してみましょう。

```bash
$ curl http://localhost:8080
Hello, Moonbit!
```

### ルーティングを追加してパスごとに異なるレスポンスを返す

`server` 関数のコールバック関数内でリクエストのパスを確認し、パスごとに異なるレスポンスを返すようにします。リクエストのパスとメソッドはそれぞれ `request.path` と `request.method` プロパティで取得できます。パターンマッチングを使用してルーティングを実装します。

```mbt:backend/main.mbt
///|
#cfg(target="native")
async fn server(listen_addr : @socket.Addr) -> Unit {
  @http.Server::new(listen_addr).run_forever((request, _body, conn) => match
    (request.meth, request.path) {
    // GET /
    (Get, "/") => conn..send_response(200, "OK")..write("Hello, Moonbit!")
    // GET /todos
    (Get, "/todos") => conn..send_response(200, "OK")..write("TODO List Route")
    // GET /todos/:id
    (Get, path) if path.has_prefix("/todos/") && path != "/todos/" => {
      let id = extract_path_param(path, "/todos/")
      conn..send_response(200, "OK")..write("Get Todo with ID: \{id}")
    }
    // 404 Not Found
    _ => conn..send_response(404, "Not Found")..write("404 - Route not found")
  })
}

///|
/// パスから指定されたプレフィックスの後の部分を抽出
fn extract_path_param(path : String, prefix : String) -> String raise {
  let prefix_len = prefix.length()
  path[prefix_len:].to_string()
}
```

MoonBit のパターンマッチング構文は `match` キーワードを使用します。ここではタプル `(request.meth, request.path)` を使用して HTTP メソッドとパスの組み合わせに基づいてルーティングを実装しています。`request.method` は HTTP メソッドを表す Enum 型であり、`Get` や `Post` などのバリアントが用意されています。`request.path` はリクエストのパスを表す文字列で完全一致する文字列の場合にマッチします。

動的なパスパラメータ（例: `/todos/:id`）を処理するために、`if` ガードを使用して、パスが特定のプレフィックスで始まるかどうかを確認しています。`if` ガードでは `(Get, path) if ...` のように `Get` リクエストとすべてのパスをキャプチャする `path` 変数にマッチさせた上で条件を指定します。

`extract_path_param` 関数は、指定されたプレフィックスの後の部分を抽出するユーティリティ関数です。ここでは単純に文字列のスライスを使用してパスパラメータを取得しています。`path[prefix_len:]` のようにスライスを使用して文字列の一部を取得する場合エラーを発生させる可能性があるため、`raise` キーワードを使用してこの関数がエラーをスローする可能性があることを示す必要があります。

再度サーバーを起動し、異なるパスにリクエストを送信してみましょう。

```bash
$ moon run backend/main.mbt --target native
Server running on http://localhost:8080
```

```bash
$ curl http://localhost:8080/
Hello, Moonbit!

$ curl http://localhost:8080/todos
TODO List Route

$ curl http://localhost:8080/todos/42
Get Todo with ID: 42

$ curl http://localhost:8080/unknown
404 - Route not found
```

### PostgreSQL データベースと連携する

API サーバーで作成した TODO アイテムを永続化するために、PostgreSQL データベースを使用します。まずは `docker-compose.yml` ファイルを作成し、PostgreSQL コンテナを起動します。

```yaml:docker-compose.yml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: moonbit
      POSTGRES_PASSWORD: moonbitpassword
      POSTGRES_DB: moonbit_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

`docker-compose up -d` コマンドでコンテナを起動します。

```bash
docker-compose up -d
```

MoonBit の PostgreSQL クライアントライブラリである [mattn/postgres](https://mooncakes.io/docs/mattn/postgres) を使用します。`moon add` コマンドで依存関係を追加します。

```bash
moon add mattn/postgres
```

`mattn/postgres` パッケージを使用するためには PostgreSQL のネイティブライブラリが必要です。macOS を使用している場合は Homebrew で以下のコマンドを実行してインストールします。

```bash
brew install postgresql
```

バックエンドのコードを追加する前に、TODO アイテムを保存するテーブルを作成する Seed スクリプトを `seed/seed.mbt` ファイルに記述します。`seed/moon.pkg.json` ファイルも作成し、`mattn/postgres` パッケージをインポートするように指定します。また `link.native` フィールドでネイティブライブラリのリンクを有効にします。

```json:seed/moon.pkg.json
{
  "is-main": true,
  "import": [
    {
      "path": "mattn/postgres"
    }
  ],
  "link": {
    "native": {
      "cc-link-flags": "-L/opt/homebrew/opt/postgresql@13/lib"
    }
  }
}
```

`homebrew` を使用して PostgreSQL をインストールした場合、`mattn/postgres` パッケージの `seed/moon.pkg.json` を直接編集して `stub-cc-flags` と `stub-cc-link-flags` を変更する必要がありました。もしかしたら別の方法で解決できるかもしれません。`.mooncakes` ディレクトリに依存パッケージがインストールされているので、そのファイルを直接編集しました。

```json:.mooncakes/mattn/postgres/moon.pkg.json
{
  ...
  "stub-cc-flags": "-I/opt/homebrew/opt/postgresql@13/include",
  "stub-cc-link-flags": "-L/opt/homebrew/opt/postgresql@13/lib -lpq",
  ...
}
```

`seed/main.mbt` ファイルには以下のコードを記述します。

```mbt:seed/main.mbt
///|
#cfg(target="native")
fn main {
  // PostgreSQL データベースに接続
  match
    @postgres.connect(
      "postgresql://moonbit:moonbitpassword@localhost/moonbit_db",
    ) {
    Ok(conn) => {
      // defer は関数の終了時に実行される
      defer conn.close()
      println("Connected to PostgreSQL database.")

      // todos テーブルを作成
      let create_table_query = "CREATE TABLE IF NOT EXISTS todos (id SERIAL PRIMARY KEY, title TEXT NOT NULL, completed BOOLEAN NOT NULL DEFAULT FALSE);"
      match conn.execute(create_table_query, ([] : Array[@postgres.Value])) {
        Ok(result) => result.free()
        Err(e) => {
          println("Error creating table: " + e.to_string())
          return
        }
      }

      // 初期データを挿入
      let insert_query = "INSERT INTO todos (title, completed) VALUES ('Sample Todo', FALSE);"
      match conn.execute(insert_query, ([] : Array[@postgres.Value])) {
        Ok(result) => result.free()
        Err(e) => {
          println("Error inserting data: " + e.to_string())
          return
        }
      }

      // データを取得して表示
      let select_query = "SELECT id, title, completed FROM todos;"
      match conn.query(select_query) {
        Ok(result) => {
          defer result.free()
          println("Query result:")
          for row in result.rows() {
            println("  " + row[0])
            println("  " + row[1])
            println("  " + row[2].to_string())
          }
        }
        Err(e) => println("Query error: " + e.to_string())
      }
    }
    Err(e) => println("Connection error: " + e.to_string())
  }
}
```

`@postgres.connect(...)` メソッドでデータベースに接続します。Result 型を返すため、`match` 式で成功時と失敗時の処理を分岐しています。接続に成功した場合は `conn` オブジェクトを使用して SQL クエリを実行します。`conn.execute(...)` メソッドでテーブルの作成やデータを挿入し、`conn.query(...)` メソッドでデータを取得します。

`moon run` コマンドで Seed スクリプトを実行します。

```bash
$ moon run seed/main.mbt --target native

Connected to PostgreSQL database.
Query result:
  1
  Sample Todo
  f
```

### TodoTable 構造体を使ってデータベース接続を管理する

バックエンドのコードに戻りましょう。データベース接続を管理するために `TodoTable` 構造体を定義します。この構造体はデータベース接続オブジェクトをフィールドとして持ち、TODO アイテムの CRUD 操作をメソッドとして提供します。`backend/table` パッケージを新たに作成して、そこにテーブル操作関連のコードをまとめます。

まずは `backend/table/moon.pkg.json` ファイルを作成し、`mattn/postgres`, `moonbitlang/core/json`, `moonbitlang/core/strconv` パッケージをインポートするように指定します。また `link.native` フィールドでネイティブライブラリのリンクを有効にします。

```json:backend/table/moon.pkg.json
{
  "import": [
    "moonbitlang/core/json",
    {
      "path": "mattn/postgres"
    },
    "moonbitlang/core/strconv"
  ],
  "link": {
    "native": {
      "cc-link-flags": "-L/opt/homebrew/opt/postgresql@13/lib"
    }
  }
}
```

`backend/table/todo_table.mbt` ファイルを作成し、以下のコードを記述します。まずは `Todo` 構造体と `TodoTable` 構造体を定義します。構造体の定義は `struct` キーワードを使用します。

```mbt:backend/table/todo_table.mbt
///|
/// Todo データ構造
pub struct Todo {
  id : Int
  title : String
  completed : Bool
} derive(FromJson, ToJson)

///|
/// Todo のコンストラクタ
pub fn Todo::new(id : Int, title : String, completed : Bool) -> Todo {
  { id, title, completed }
}

///|
/// TodoTable - PostgreSQL での Todo テーブルの CRUD 操作
pub struct TodoTable {
  conn : @postgres.Connection
}
```

`Todo` 構造体は TODO アイテムのデータ構造を表し、`FromJson` と `ToJson` トレイトを実装しています。それぞれのトレイトを実装することにより構造体は `.to_json` メソッドと `from_json` メソッドを持つようになり、JSON と構造体の相互変換が可能になります。

トレイトとは、構造体に実装すべきメソッドのセットを定義するインターフェイスのようなものです。`FromJson` トレイトの場合は `from_json` メソッドを実装する必要があると定義されています。

```mbt
///|
/// Trait for types that can be converted from `Json`
pub(open) trait FromJson {
  from_json(Json, JsonPath) -> Self raise JsonDecodeError
}
```

通常トレイトは `impl Trait for Struct` 構文でインターフェイスを満たすメソッドを実装しますが、特定のトレイトは `derive(...)` 属性を使用することで自動的に実装できます。

構造体を初期化するメソッドに `new` メソッドとして定義されます。`new` メソッドは自身の構造体を返す静的メソッドとして実装します。`new` メソッドには `pub` 修飾子を付与して公開メソッドとして定義します。

`TodoTable` 構造体はデータベース接続オブジェクトをフィールドとして持つ構造体です。この構造体に CRUD 操作をメソッドとして実装します。構造体にメソッドを実装するには `fn Struct::method_name` 構文を使用します。初めに `TodoTable::new` メソッドを実装します。メソッドの引数に `self: TodoTable` を指定しない場合は静的メソッドとして定義されます。

```mbt:backend/table/todo_table.mbt
///|
/// TodoTable の初期化
pub fn TodoTable::new() -> Result[TodoTable, String] {
  match
    @postgres.connect(
      "postgresql://moonbit:moonbitpassword@localhost/moonbit_db",
    ) {
    Ok(conn) => Ok({ conn, })
    Err(e) => Err("Failed to connect to database: " + e.to_string())
  }
}
```

`TodoTable::new` メソッドではデータベースに接続し、接続に成功した場合は `TodoTable` 構造体のインスタンスを返します。失敗した場合はエラーメッセージを返します。続いて `TodoTable::close` メソッドも実装しておきましょう。このメソッドは内部のパッケージのみで使用されるため `pub` 修飾子は不要です。

1 つめの引数（レシーバー）に `self: TodoTable` を指定することでインスタンスメソッドとして定義されます。インスタンスメソッドでは `self` 引数を通じて構造体のフィールドにアクセスできます。レシーバーは慣例的に `self` と命名されます。

```mbt:backend/table/todo_table.mbt
///|
/// データベース接続を閉じる
/// pub をつけないのでパッケージ内でのみ使用可能
fn TodoTable::close(self : TodoTable) -> Unit {
  self.conn.close()
}
```

`TodoTable::create`, `TodoTable::get_by_id`, `TodoTable::get_all`, `TodoTable::update`, `TodoTable::delete` メソッドもまとめてインスタンスメソッドとして実装します。

```mbt:backend/table/todo_table.mbt
///|
/// Create: 新しい Todo を作成
pub fn TodoTable::create(
  self : TodoTable,
  title : String,
  completed : Bool,
) -> Result[Int, String] {
  defer self.close()
  match
    self.conn.execute(
      "INSERT INTO todos (title, completed) VALUES ($1, $2) RETURNING id",
      [title, completed.to_string()],
    ) {
    Ok(result) => {
      defer result.free()
      let rows = result.rows()
      if rows.length() > 0 {
        let id = @strconv.parse_int(rows[0][0]) catch { _ => 0 }
        Ok(id)
      } else {
        Err("No rows returned from INSERT")
      }
    }
    Err(e) => Err("Failed to create todo: " + e.to_string())
  }
}

///|
/// Read: ID で Todo を取得
pub fn TodoTable::get_by_id(self : TodoTable, id : Int) -> Result[Todo, String] {
  defer self.close()
  match
    self.conn.execute(
      "SELECT id, title, completed FROM todos WHERE id = $1::int",
      [id],
    ) {
    Ok(result) => {
      defer result.free()
      let rows = result.rows()
      if rows.length() > 0 {
        let row = rows[0]
        let todo_id = @strconv.parse_int(row[0]) catch { _ => 0 }
        let title = row[1]
        let completed = row[2] == "t" || row[2] == "true"
        Ok({ id: todo_id, title, completed })
      } else {
        Err("Todo not found with ID: " + id.to_string())
      }
    }
    Err(e) => Err("Failed to get todo: " + e.to_string())
  }
}

///|
/// Read: すべての Todo を取得
pub fn TodoTable::get_all(self : TodoTable) -> Result[Array[Todo], String] {
  defer self.close()
  let query = "SELECT id, title, completed FROM todos ORDER BY id;"
  match self.conn.query(query) {
    Ok(result) => {
      defer result.free()
      let todos : Array[Todo] = []
      for row in result.rows() {
        let id = @strconv.parse_int(row[0]) catch { _ => 0 }
        let title = row[1]
        let completed = row[2] == "t" || row[2] == "true"
        todos.push({ id, title, completed })
      }
      Ok(todos)
    }
    Err(e) => Err("Failed to get all todos: " + e.to_string())
  }
}

///|
/// Update: Todo を更新
pub fn TodoTable::update(
  self : TodoTable,
  id : Int,
  title : String,
  completed : Bool,
) -> Result[Unit, String] {
  defer self.close()
  match
    self.conn.execute(
      "UPDATE todos SET title = $1, completed = $2 WHERE id = $3",
      [title, completed, id],
    ) {
    Ok(result) => {
      result.free()
      Ok(())
    }
    Err(e) => Err("Failed to update todo: " + e.to_string())
  }
}

///|
/// Delete: ID で Todo を削除
pub fn TodoTable::delete(self : TodoTable, id : Int) -> Result[Unit, String] {
  defer self.close()
  match self.conn.execute("DELETE FROM todos WHERE id = $1", [id]) {
    Ok(result) => {
      result.free()
      Ok(())
    }
    Err(e) => Err("Failed to delete todo: " + e.to_string())
  }
}
```

`conn.execute(...)` メソッドで SQL クエリを実行し、結果を処理しています。パラメタライズドクエリを使用するために、SQL クエリ内で `$1`, `$2` のようにプレースホルダを指定し、引数として値の配列を渡しています。`defer` キーワードを使用して、関数の終了時に接続を閉じるようにしています。

```mbt
self.conn.execute(
  "INSERT INTO todos (title, completed) VALUES ($1, $2) RETURNING id",
  [title, completed],
)
```

:::warning
コード例では `conn.execute(...)` メソッドを使用していますが、v0.10.4 では実行時に動作しない問題がありました。代わりに `conn.query(...)` メソッドを使用して文字列結合でパラメータを埋め込むことができますが、SQL インジェクションのリスクがあるため本番環境では決して使用しないでください。
:::

`@strconv.parse_int` メソッドを使用して文字列を整数に変換しています。`@strconv.parse_int` メソッドはエラーを `raise` する可能性があります。`raise` される可能性がある関数に対してエラーハンドリングを行わなければコンパイルエラーとなります。ここではエラーが発生した場合にデフォルト値 `0` を返すようにしています。

```mbt
let id = @strconv.parse_int(rows[0][0]) catch { _ => 0 }
```

### TODO API エンドポイントの実装

`backend/main.mbt` ファイルに戻り、TODO API エンドポイントを実装します。`TodoTable` 構造体をインポートし、各エンドポイントで対応するメソッドを呼び出します。`backend/moon.pkg.json` ファイルにも `backend/table` パッケージをインポートするように指定します。

```json:backend/moon.pkg.json {7-9}
{
  "is-main": true,
  "import": [
    "moonbitlang/async",
    "moonbitlang/async/http",
    "moonbitlang/async/socket",
    "moonbitlang/core/json",
    "moonbitlang/core/strconv",
    "username/moonbit_rest_app/backend/table"
  ]
}
```

`/todos` エンドポイントに対する GET リクエストで `TodoTable::get_all` メソッドを呼び出し、すべての TODO アイテムを取得して JSON 形式でレスポンスを返すようにします。

```mbt:backend/main.mbt
///|
#cfg(target="native")
async fn server(listen_addr : @socket.Addr) -> Unit {
  @http.Server::new(listen_addr).run_forever((request, _body, conn) => match
    (request.meth, request.path) {
          // GET /todos - すべての Todo を取得
    (Get, "/todos") =>
      match @table.TodoTable::new() {
        Ok(table) =>
          match table.get_all() {
            Ok(todos) =>
              conn
              ..send_response(200, "OK", extra_headers={
                "Content-Type": "application/json",
              })
              ..write(todos.to_json())
            Err(e) =>
              conn
              ..send_response(500, "Internal Server Error")
              ..write("Error: " + e)
          }
        Err(e) =>
          conn
          ..send_response(500, "Internal Server Error")
          ..write("Database connection error: " + e)
      }
    // その他のルーティング...
    _ => conn..send_response(404, "Not Found")..write("404 - Route not found")
  })
}
```

`Todo[]` 配列を JSON 形式に変換するために `to_json()` メソッドを使用しています。`to_json()` メソッドは `ToJson` トレイトを実装している型に対して使用できます。`send_response` メソッドの `extra_headers` 引数でレスポンスヘッダーに `Content-Type: application/json` を追加して、クライアントに JSON 形式のレスポンスであることを通知しています。

サーバーを再起動し、`curl` コマンドで `/todos` エンドポイントにリクエストを送信してみましょう。

```bash
$ moon run backend/main.mbt --target native
Server running on http://localhost:8080
```

```bash
$ curl http://localhost:8080/todos
[{"id":1,"title":"Sample Todo","completed":false}]
```

`GET /todos/:id` エンドポイントも同様に実装します。`@strconv.parse_int` メソッドを使用してパスパラメータを整数に変換し、`TodoTable::get_by_id` メソッドを呼び出して指定された ID の TODO アイテムを取得します。

```mbt:backend/main.mbt
///|
#cfg(target="native")
async fn server(listen_addr : @socket.Addr) -> Unit {
  @http.Server::new(listen_addr).run_forever((request, _body, conn) => match
    (request.meth, request.path) {
    // ...省略

    // GET /todos/:id - ID で Todo を取得
    (Get, path) if path.has_prefix("/todos/") && path != "/todos/" => {
      let id_str = extract_path_param(path, "/todos/")
      try @strconv.parse_int(id_str) catch {
        _ =>
          conn
          ..send_response(400, "Bad Request")
          ..write("Invalid ID: " + id_str)
      // noraise はエラーが発生しなかったときにのみ実行されるブロック
      } noraise {
        id =>
          match @table.TodoTable::new() {
            Ok(table) =>
              match table.get_by_id(id) {
                Ok(todo) =>
                  conn
                  ..send_response(200, "OK", extra_headers={
                    "Content-Type": "application/json",
                  })
                  ..write(todo.to_json())
                Err(e) =>
                  conn..send_response(404, "Not Found")..write("Error: " + e)
              }
            Err(e) =>
              conn
              ..send_response(500, "Internal Server Error")
              ..write("Database connection error: " + e)
          }
      }
    }
  })
}
```

`/todos/1` エンドポイントにリクエストを送信してみましょう。

```bash
$ curl http://localhost:8080/todos/1
{"id":1,"title":"Sample Todo","completed":false}
```

新しい TODO アイテムを作成する `POST /todos` エンドポイントも実装します。リクエストボディから JSON データを取得する必要があるので、JSON をパースしてフィールドを抽出する `parse_create_todo_body` 関数も実装します。

```mbt:backend/main.mbt
fn parse_create_todo_body(body : String) -> Result[(String, Bool), String] {
  // @json.parse を使ってJSONをパース
  let json = @json.parse(body) catch {
    e => return Err("Failed to parse JSON: " + e.to_string())
  }

  // オブジェクトナビゲーションでフィールドを抽出
  let title = if json is { "title": String(str), .. } { str } else { "" }
  let completed = if json is { "completed": True, .. } { true } else { false }
  Ok((title, completed))
}
```

`moonlang/core/json` パッケージの `@json.parse(...)` メソッドを使用して JSON 文字列をパースし `Json` 型として取得します。`Json` 型に対してパターンマッチングを使用してフィールドを抽出します。`is` キーワードを使用して特定のパターンにマッチさせることができます。例えば `if json is { "title": String(str), .. }` のように記述すると、`json` オブジェクトが `title` フィールドを持ち、その値が文字列である場合にマッチし、`str` 変数に `title` フィールドの値がバインドされます。`..` はワイルドカードパターンで、他のフィールドは無視することを示します。

`POST /todos` エンドポイントを実装します。`.run_forever(...)` メソッドのコールバック関数の第 2 引数 `body` はリクエストボディを表す文字列です。`body.read_all()` メソッドを使用してリクエストボディの内容を `io.Data` 型として取得し、`.text()` メソッドで文字列に変換します。

レスポンスは `Todo` 構造体を作成してから `to_json()` メソッドを使用して JSON 形式に変換して返しています。

```mbt:backend/main.mbt
///|
#cfg(target="native")
async fn server(listen_addr : @socket.Addr) -> Unit {
  @http.Server::new(listen_addr).run_forever((request, body, conn) => match
    (request.meth, request.path) {
    // ...省略
    // POST /todos - 新しい Todo を作成
    (Post, "/todos") => {
      let body_str = body.read_all().text()
      match parse_create_todo_body(body_str) {
        Ok((title, completed)) =>
          match @table.TodoTable::new() {
            Ok(table) =>
              match table.create(title, completed) {
                Ok(id) => {
                  let todo = @table.Todo::new(id, title, completed)
                  conn
                  ..send_response(201, "Created", extra_headers={
                    "Content-Type": "application/json",
                  })
                  ..write(todo.to_json())
                }
                Err(e) =>
                  conn
                  ..send_response(500, "Internal Server Error")
                  ..write("Error: " + e)
              }
            Err(e) =>
              conn
              ..send_response(500, "Internal Server Error")
              ..write("Database connection error: " + e)
          }
        Err(parse_error) =>
          conn
          ..send_response(400, "Bad Request")
          ..write("Invalid request body: " + parse_error)
      }
    }
    // その他のルーティング...
    _ => conn..send_response(404, "Not Found")..write("404 - Route not found")
  })
}
```

`curl` コマンドで `POST /todos` エンドポイントにリクエストを送信してみましょう。

```bash
$ curl -X POST http://localhost:8080/todos \
    -H "Content-Type: application/json" \
    -d '{"title": "New Todo Item", "completed": true}'
{"id":2,"title":"New Todo Item","completed":true}
```

最後に、`DELETE /todos/:id` エンドポイントを実装します。リクエストパスから ID を抽出し、`TodoTable::delete` メソッドを呼び出して指定された ID の TODO アイテムを削除します。

```mbt:backend/main.mbt
///|
#cfg(target="native")
async fn server(listen_addr : @socket.Addr) -> Unit {
  @http.Server::new(listen_addr).run_forever((request, _body, conn) => match
    (request.meth, request.path) {
    // ...省略
    // DELETE /todos/:id - Todo を削除
    (Delete, path) if path.has_prefix("/todos/") && path != "/todos/" => {
      let id_str = extract_path_param(path, "/todos/")
      try @strconv.parse_int(id_str) catch {
        _ =>
          conn
          ..send_response(400, "Bad Request")
          ..write("Invalid ID: " + id_str)
      } noraise {
        id =>
          match @table.TodoTable::new() {
            Ok(table) =>
              match table.delete(id) {
                Ok(_) =>
                  conn
                  ..send_response(200, "OK", extra_headers={
                    "Content-Type": "application/json",
                  })
                  ..write({"message":"Todo with ID \{id} deleted successfully."}.to_json())
                Err(e) =>
                  conn
                  ..send_response(500, "Internal Server Error")
                  ..write("Error: " + e)
              }
            Err(e) =>
              conn
              ..send_response(500, "Internal Server Error")
              ..write("Database connection error: " + e)
          }
      }
    }
    // 404 Not Found
    _ => conn..send_response(404, "Not Found")..write("404 - Route not found")
  })
}
```

`curl` コマンドで `DELETE /todos/:id` エンドポイントにリクエストを送信してみましょう。

```bash
$ curl -X DELETE http://localhost:8080/todos/2
{"message":"Todo with ID 2 deleted successfully."}

$ curl http://localhost:8080/todos
[{"id":1,"title":"Sample Todo","completed":false}]
```

## まとめ

- `moonbitlang/async` パッケージを使用して非同期処理による HTTP サーバーを実装した。`@http.Server::new(...).run_forever(...)` メソッドでサーバーを起動し、非同期コールバック関数でリクエストを処理する
- `match` キーワードを使用して HTTP メソッドとパスの組み合わせに基づいてルーティングを実装した。`if` ガードを使用して動的なパスパラメータを処理できる
- `mattn/postgres` パッケージを使用して PostgreSQL データベースと連携した。`@postgres.connect(...)` メソッドでデータベースに接続し、`conn.query(...)` メソッドや `conn.execute(...)` メソッドで SQL クエリを実行する
- 構造体とトレイトを活用してデータベース操作を抽象化した。`fn Struct::method_name` 構文で構造体にメソッドを実装する。引数の最初に `self: Struct` を指定することでインスタンスメソッドとして定義できる
- `moonbitlang/core/json` パッケージを使用して JSON データのパースと生成を行った。`@json.parse(...)` メソッドで JSON 文字列をパースし、`to_json()` メソッドで構造体や配列を JSON 形式に変換する。構造体に `FromJson` と `ToJson` トレイトを実装することで JSON との相互変換が容易になる

## 参考

- [Async programming support — MoonBit v0.7.1 documentation](https://docs.moonbitlang.com/en/latest/language/async-experimental.html)
- [moonbitlang/async](https://mooncakes.io/docs/moonbitlang/async)
- [moonbitlang/core/json](https://mooncakes.io/docs/moonbitlang/core/json)
- [mattn/postgres](https://mooncakes.io/docs/mattn/postgres)
- [mattn/moonbit-postgres-example](https://github.com/mattn/moonbit-postgres-example/tree/main)
