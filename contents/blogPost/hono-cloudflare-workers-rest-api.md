---
id: 7nzkZNrXGOwJ1fBtyGekAJ
title: "Hono + Cloudflare Workers で REST API を作ってみよう"
slug: "hono-cloudflare-workers-rest-api"
about: "Hono は TypeScript/JavaScript のシンプルな Web フレームワークです。Hono という名前は日本語の「炎」に由来します。  Hono の特徴としては以下の点が挙げられています。  - ウルトラファスト - 依存関係なし - ミドルウェア - TypeScript - マルチプラットフォーム"
createdAt: "2022-08-28T00:00+09:00"
updatedAt: "2022-08-28T00:00+09:00"
tags: ["TypeScript", "Cloudflare Workers", "Hono"]
published: true
---
## Hono とは？

[Hono](https://honojs.dev/) は TypeScript/JavaScript のシンプルな Web フレームワークです。Hono という名前は日本語の「炎」に由来します。

Hono の特徴としては以下の点が挙げられています。

- ウルトラファスト
- 依存関係なし
- ミドルウェア
- TypeScript
- マルチプラットフォーム

### ウルトラファスト

[Benchmarks](https://honojs.dev/#benchmarks) の示すとおり、Hono はその他のルーターに比べて早い結果がでています。Hono が早い理由としては URL のパスマッチングに**Trie 木**を使用した「TrieRouter」もしくは「RegExpRouter」を使っていることが述べられています。

「TrieRouter」「RegExpRouter」の解説については Hono の開発者の記事に譲りたいと思います。

- [trie木](https://yusukebe.com/posts/2022/how-i-got-2k-stars/#trie%E6%9C%A8)
- [RegExpRouter](https://yusukebe.com/posts/2022/how-i-got-2k-stars/#regexprouter)
- [JSのウェブフレームワークで高速なルーターを実装する方法 - Speaker Deck](https://speakerdeck.com/usualoma/ultrafast-js-router)

### 依存関係なし

Serviec Worker と Web Standard API に準拠して提供されています。例えばルーティングのハンドラにおいてレスポンスを返却する際には Web API の [Response](https://developer.mozilla.org/ja/docs/Web/API/Response) を返却することができます。

```ts
app.get("/", () => {
  return new Response("Hey!", {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
});
```

### ミドルウェア

多くの[ビルドインミドルウェア](https://honojs.dev/docs/builtin-middleware/)、[サードパーティミドルウェア](https://honojs.dev/docs/third-party-middleware/)を備えており、またカスタムミドルウェアも簡単に定義することができます。

### TypeScript 

TypeScript をファーストクラスでサポートしています。

### マルチプラットフォーム

Hono は現在以下のプラットフォームをサポートしています。

- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Fastly Compute@Edge](https://www.fastly.com/jp/products/edge-compute)
- [Deno](https://deno.land/)
- [Bun](https://bun.sh/)

import やエントリーポイントはプラットフォームごとに若干頃なるものの、大半のコードは全く同じコードで多くのプラットフォームで動作するのは大きな特徴です。

## 初めての Hono

それでは早速 Hono を使用してアプリケーションを作成してみましょう。前述のとおり Hono は様々なプラットフォームで実行させることができるのですが、今回は [Cloudflare Workers](https://developers.cloudflare.com/workers/) を選択します。Cloudflare Workers はエッジサーバーで JavaScript を実行してくれるサーバーレスのサービスです。

### Cloudflare Workers アカウントの作成

Cloudflare Workersを動かすためには（ローカル環境も含めて）Cloudflare Workers のアカウントを作成する必要があります。アカウントを作成するには下記サイトから「Sign up」をクリックします。

https://workers.cloudflare.com/

![スクリーンショット 2022-08-27 20.53.23](//images.ctfassets.net/in6v9lxmm5c8/2B5th0yGYIcqVVlytjIe8h/bc718884e967478637bf5624058ed973/____________________________2022-08-27_20.53.23.png)

プランの選択は無料プランである「Free」プランで問題ありません。

### プロジェクトの作成

Cloudflare Workers のプロジェクトを作成するためにはコマンドラインツールである [wrangler](https://www.npmjs.com/package/wrangler) をインストールします。

```sh
npm install -g wrangler
```

インストールが完了したことを確認しましょう。

```sh
wrangler --version
 ⛅️ wrangler 2.0.27 
--------------------
```

Cloudflare のリソースにアクセスするためには認証が必要です。以下のコマンドを実行して認証を完了させましょう。

```sh
wrangler login
```

コマンドを実行するとブラウザのタブが開きアクセスを許可するか聞かれますので「Allow」を選択します。認証が完了するとターミナルには「Successfully logged in.」と表示されます。

Cloudflare Workers のプロジェクトを作成するために以下のコマンドを実行します。

```sh
wrangler init -y hono-todo-app
cd hono-todo-app
```

`hono` をインストールします。

```sh
npm install hono
```

### Hello World

はじめに簡単な Hello World を表示するコードを作成しましょう。`src/index.ts` に以下を記述します。

```ts
import { Hono } from "hono";

const app = new Hono(); // ①
app.get("/", (c) => c.text("Hello 🔥")); // ②

export default app; // ③
```

①：`new Hono()` で `Hono` インスタンスを作成します。`Hono` インスタンスに対してルーティングやミドルウェアを追加することでサーバーの処理を記述します。

②：ルーティング関数は指定したルートと HTTP メソッドへのリクエストを受け取った時に呼び出されるコールバック関数（ハンドラ）を指定します。ここでは `app.get("/", (c) => c.text("Hello 🔥"));` で `/` パスへの GET リクエストに対するハンドラを記述します。このような書き方は [Express](https://expressjs.com/) のルーティング関数ともよく似ていています。

コールバック関数の引数に [Context](https://honojs.dev/docs/api/context/) オブジェクトを受け取ります。Context オブジェクトはリクエストとレスポンスをハンドリングするために使用されます。例えば `c.req.query()` メソッドからクエリパラメータを取得したり、`c.body()` メソッドでレスポンスボディを返却したりなどです。ここでは `c.text()` メソッドを呼び出しています。これは `Content-Type:text/plain` としてテキストをレスポンスとして返却します。

③：Cloudflare Workers においては、`export default app` で `Hono` インスタンスを公開することにより Worker がリクエストを受け取ることができます。ここがアプリケーションのエントリーポイントとなります。

!> アプリケーションのエントリーポイントは JavaScript のランタイムにより異なります。例えば Deno においては `serve(app.fetch)` と記述します。

コードの記述が完了したら、ローカル環境で開発サーバーを起動して確認しましょう。以下コマンドを実行して http://localhost:8787 にアクセスします。

```sh
npm start
```

ブラウザに次のように表示されているはずです🔥

![スクリーンショット 2022-08-27 12.14.51](//images.ctfassets.net/in6v9lxmm5c8/2yMg4zcNi7u5IC0MO9JhJp/42a7340ef5ce2e714449ba6141f470d0/____________________________2022-08-27_12.14.51.png)

## TODO アプリの作成

それでは Hono を使用して簡単な CRUD 操作を備えた API サーバーを作成してみましょう。`src/todos/api.ts` ファイルを作成します。

```ts
import { Hono } from "hono";

let todoList = [
  { id: "1", title: "Learning Hono", completed: false },
  { id: "2", title: "Watch the movie", completed: true },
  { id: "3", title: "Buy milk", completed: false },
];

const todos = new Hono();
todos.get("/", (c) => c.json(todoList));

export { todos };
```

先程の Hello World と同様に `Hono` のインスタンスを作成してルーティングを設定しています。まずはじめに TODO の一覧を返却するエンドポイントを作成します。ひとまずダミーデータとして `todoList` を定義して `c.json()` メソッドで JSON 形式として返却しています。

`index.ts` ファイルにおいて作成した `todos` ルーティングを使用するように変更します。

```ts
import { Hono } from "hono";
import { todos } from "./todos/api";

const app = new Hono();
app.route("/api/todos", todos)
export default app;
```

`app.route()` メソッドで先程作成した `todos` インスタンスを指定しています。`app.route()` を使用すると、ルーティングの定義をモジュール化できます。Todo 一覧取得のパスは `/api/todos/` としてマッチングします。

作成したエンドポイントを実際にテストしてみましょう。この記事では HTTP クライアントに [Thunder Client](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client) と呼ばれる VSCode の拡張機能を使用しますが、お好みのツールを使用して頂いて構いません。

http://localhost:8787/api/todos に対して GET リクエストを送信します。Thunder Client の拡張機能をインストールしたら左のメニューから Thunder Client のアイコンをクリックします。その後、サイドメニューから「New Request」ボタンをクリックすると API をコールする画面が表示されます。上部の入力欄に `http://localhost:8787/api/todos` と入力した後「Send」ボタンをクリックしましょう。ここまででうまくいけば、`TodoList` がレスポンスとして返却されるはずです。

![スクリーンショット 2022-08-27 15.12.54](//images.ctfassets.net/in6v9lxmm5c8/39p5n0KTq7FbktDtjJRl3b/ed88c781b49d6f18f1c336b3d7f81057/____________________________2022-08-27_15.12.54.png)

### Todo の作成

続いて Todo を作成するエンドポイントを実装しましょう。`src/todos/api.ts` の続きに書いていきます。

```ts
todos.post("/", async (c) => {
  const param = await c.req.json<{ title: string }>();
  const newTodo = {
    id: String(todoList.length + 1),
    completed: false,
    title: param.title,
  };
  todoList = [...todoList, newTodo];

  return c.json(newTodo, 201);
});
```

Todo の作成には POST リクエストを使用するので `app.post()` メソッドを使用します。リクエストボディを取得するためには `c.req.json()` メソッドを使用します。その後 `todoList` の末尾に追加した後新たに作成した Todo を `c.json()` で返却します。`c.json()` の第2引数には HTTP ステータスコードを渡すことができるので、`201 Created` を指定しています。

作成したエンドポイントをテストしましょう。Thunder Client では「Body」タブからリクエストボディを指定できます。「Json」形式を選択して `title` プロパティを持った JSON を記述し POST リクエストを送信してみましょう。

![スクリーンショット 2022-08-27 20.42.08](//images.ctfassets.net/in6v9lxmm5c8/6G0sumsLJ6vSpRUZiS5hwb/b59b7844765cd0a06ab5121dad1203c9/____________________________2022-08-27_20.42.08.png)

正しく実装されていれば、新たに作成された Todo がレスポンスとして返却されるはずです。Todo 一覧の API をコールしてたった今作成した Todo が追加されていることを確認してみましょう。

![スクリーンショット 2022-08-27 20.46.00](//images.ctfassets.net/in6v9lxmm5c8/2VfZSkhArw6C3TzDeiqhPT/6cc3d6b5377f7016ec3d06042caf1b38/____________________________2022-08-27_20.46.00.png)

### Todo の更新

続いて ID を指定して Todo を更新するエンドポイントを実装します。

```ts
todos.put("/:id", async (c) => {
  const id = c.req.param("id");
  const todo = todoList.find((todo) => todo.id === id);
  if (!todo) {
    return c.json({ message: "not found" }, 404);
  }
  const param = (await c.req.parseBody()) as {
    title?: string;
    completed?: boolean;
  };
  todoList = todoList.map((todo) => {
    if (todo.id === id) {
      return {
        ...todo,
        ...param,
      };
    } else {
      return todo;
    }
  });
  return new Response(null, { status: 204 });
});
```

ID はパスパラメータにおいて指定しています。パスパラメータは `c.req.param()` メソッドで取得できます。素晴らしいことに `c.req.param()` メソッドはルート定義から補完が効くようになります。

![スクリーンショット 2022-08-27 21.27.57](//images.ctfassets.net/in6v9lxmm5c8/4Lz4pJ8vGSsTcB9lrzyR0a/acb3bffd34073a89b290817ad274c555/____________________________2022-08-27_21.27.57.png)

パスパラメータの ID を元に `todoList` から対象の Todo を取得し、もし存在しない ID であった場合には `404 Not Found` を返却して処理を終了します。Todo が存在する場合には `c.req.json()` メソッドでリクエストボディを取得して `todoList.map()` を利用して対象の Todo を更新します。

Todo の更新が完了したら `204 No Content` を返却します。ルーティングのハンドラは `c.text()` や `c.json()` を返却する代わりに Web API の [Response](https://developer.mozilla.org/ja/docs/Web/API/Response) オブジェクトを直接返却することもできます。

実装が完了したらエンドポイントをテストしましょう。作成時と同様に「Body」タブからボディリクエストを指定します。

![スクリーンショット 2022-08-27 22.37.45](//images.ctfassets.net/in6v9lxmm5c8/5KIdHpXAFvxW04EcIty4wn/603ecfd5815eeffd6d3eeabfec358fcb/____________________________2022-08-27_22.37.45.png)

### Todo の削除

最後に ID を指定して Todo を削除するエンドポイントです。

```ts
todos.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const todo = todoList.find((todo) => todo.id === id);
  if (!todo) {
    return c.json({ message: "not found" }, 404);
  }
  todoList = todoList.filter((todo) => todo.id !== id);

  return new Response(null, { status: 204 });
});
```

更新のエンドポイントと大きく内容は変わりません。パスパラメータから ID を取得し、存在しない ID であれば `404 Not Found` を返却します。Todo が存在する場合には `todoList.filter()` で指定した ID の要素を取り除きます。処理が完了したら更新時と同様に `204 No Content` を返却します。

![スクリーンショット 2022-08-27 22.40.13](//images.ctfassets.net/in6v9lxmm5c8/50IbkwTmLbPGz1cIPrB6GE/77267b55e830aa731f0b10be4b06473f/____________________________2022-08-27_22.40.13.png)

DELETE リクエストの送信後一覧取得 API から要素が取り除かれていることを確認しておきましょう。

![スクリーンショット 2022-08-27 22.41.32](//images.ctfassets.net/in6v9lxmm5c8/c0rXi5Fk6OAP7baWLAnIF/048c8145d3ccd8e8dac0e199f3e43014/____________________________2022-08-27_22.41.32.png)

### ミドルウェア

Hono はルーティングの他にミドルウェアを備えています。ミドルウェアはハンドラの前後で動作し、リクエストオブジェクトやレスポンスオブジェクトを変更できます。Hono にはロギング、認証、CORS など多くのビルドインミドルウェアが用意されています。

#### Basic 認証

ここまで Todo API の実装を行ってきましたが、世界中の誰でも Todo の閲覧・作成・削除が行えることを望むユーザーはほとんどいないでしょう。通常このような操作は認証したユーザーのみが実行できるはずです。ここでは認証機能として Basic 認証を導入してみましょう。通常 Cloudflare Workers に Basic 認証を実装するのは案外面倒なのですが、Hono のビルドインミドルウェアを使用すれば簡単に実装できます。`src/index.ts` に以下のようにミドルウェアを記述します。

```ts
app.use(
  "/api/*",
  basicAuth({
    username: "charizard",
    password: "super-secret",
  })
);
```

`app.use()` メソッドでミドルウェアを登録することができます。`app.use()` の第1引数はミドルウェアを適用させるパスです。ここでは `/api` 配下のすべてのパスに対して Basic 認証を有効にします。

Basic 認証が有効となっているか確認しましょう。Todo 一覧取得 API にリクエストを送信すると `401 Unauthorized` が返却されます。

![スクリーンショット 2022-08-28 11.36.56](//images.ctfassets.net/in6v9lxmm5c8/57flMXZFQUGcfG4gXzuImR/b5c8eeb0737625dcf6384a80116f2608/____________________________2022-08-28_11.36.56.png)

Thunder Client では「Auth」のタブから「Basic」を選択することで認証情報を入力できます。ミドルウェアで指定したユーザー名とパスワードを入力してリクエストを送信すると、正しくレスポンスが返却されます。

![スクリーンショット 2022-08-28 11.39.23](//images.ctfassets.net/in6v9lxmm5c8/48TW2FLbUZxPigIax7vkkA/356d0d3638ba6550013b24ac6668c136/____________________________2022-08-28_11.39.23.png)

#### バリデーションミドルウェア

更にミドルウェアを追加してみましょう。サードパーティのミドルウェアであるバリデーションミドルウェアを導入します。

https://github.com/honojs/validator

このミドルウェアは [validator.js](https://github.com/validatorjs/validator.js) をラップしたものです。サードパーティとビルドインのミドルウェアの違いは外部のライブラリに依存しているかどうかです。ビルドインのミドルウェアは外部ライブラリに一切依存しません。

まずは Validator Middleware をインストールします。

```sh
npm install @honojs/validator
```

Todo を作成する際にはタイトルを必須項目とするように修正しましょう。以下のように Todo 作成 API に対してバリデーションミドルウェアを挟み込みます。

```ts
import { validation } from "@honojs/validator";

todos.post(
  "/",
  validation((v, message) => ({
    body: {
      title: [v.trim, [v.required, message("Title is required")]],
    },
  })),
  async (c) => {
    const param = await c.req.json<{ title: string }>();
    const newTodo = {
      id: String(todoList.length + 1),
      completed: false,
      title: param.title,
    };
    todoList = [...todoList, newTodo];

    return c.json(newTodo, 201);
  }
);
```

`body.title` に対して `v.trim` と `v.required` ルールを指定しています。まずは `v.trim` でバリデーションを実施する前にサニタイズを実行します。`v.required` ルールは JSON のプロパティに `title` が存在しないか、`title` の値が空文字のときエラーを返却します。`message` を使用するとエラーメッセージをカスタマイズできます。

実際リクエストを送信してバリデーションが実施されるか確認しましょう。`title` が空文字の時や空白のみの場合には `400 Bad Request` が返されるはずです。

![スクリーンショット 2022-08-28 11.59.45](//images.ctfassets.net/in6v9lxmm5c8/HETbCJqVPY74EoAxguffM/d51b7fcd255a0279290aee21fcafa935/____________________________2022-08-28_11.59.45.png)

### Workers KV に永続化する

ここまでは Todo のデータを変数に保存していたため、プロセスを終了するたびにデータが失われてしまいます。[Workers KV](https://developers.cloudflare.com/workers/runtime-apis/kv/) にデータを保存して永続化されるように実装しましょう。Workers KV は Cloudflare のエッジサーバからアクセスできる、グローバルなキーバリューストアです。

#### Workers KV の作成

Workers KV を wrangler コマンドを利用して作成します。

```sh
wrangler kv:namespace create "HONO_TODO"

🌀 Creating namespace with title "worker-HONO_TODO"
✨ Success!
Add the following to your configuration file in your kv_namespaces array:
{ binding = "HONO_TODO", id = "1a136855b23f4b14aab395ab6247282a" }
```

```sh
wrangler kv:namespace create "HONO_TODO" --preview

🌀 Creating namespace with title "worker-HONO_TODO_preview"
✨ Success!
Add the following to your configuration file in your kv_namespaces array:
{ binding = "HONO_TODO", preview_id = "9d766fea526043be8e40f6550436bc96" }
```

ここでは「HONO_TODO」という名前で KV を作成しました。`--preview` を付与したものは開発環境用の KV です。それぞれコマンドの実行結果に `id` と `preview_id` が記載されているので、これを `wrangler.toml` に追記します。

```toml
kv_namespaces = [
  { binding = "HONO_TODO", preview_id = "9d766fea526043be8e40f6550436bc96", id = "1a136855b23f4b14aab395ab6247282a" }
]
```

#### アプリケーションコードから Workers KB にアクセスする

Workers KV の作成が完了したのでアプリケーションコードから KV からデータを取得したり保存したりできるように修正しましょう。`wrangler.toml` にバインディング（binding）した nemespace はハンドラ関数の `c.env` から利用できるようになります。`bindings.d.ts` ファイルを作成して `c.env` の型定義を作成しましょう。

```ts
export interface Bindings {
  HONO_TODO: KVNamespace;
}
```

`new Hono()` に対して `Bindings` の型引数を与えることで `c.env` の型に型を付けることができます。

```ts
import { Bindings } from "../bindings";

const todos = new Hono<Bindings>();
```

![スクリーンショット 2022-08-28 15.09.47](//images.ctfassets.net/in6v9lxmm5c8/2W5cHOMXZGuUfA8XXazKzd/8bc601e81768d608c6898d6eb49c0a6d/____________________________2022-08-28_15.09.47.png)

データの操作は `Model` 層で抽象化するように実装しましょう。`src/todos/model.ts` ファイルを作成します。

```ts
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export interface CreateTodo {
  title: string;
}

export interface UpdateTodo {
  title?: string;
  completed?: boolean;
}

export const PREFIX = "v1:todo:";
```

はじめに TODO の型定義と、定数として `PREFIX` を定義しています。`PREFIX` は KV のキーのプレフィックで、KV からリストで値を取得する際にプレフィックを使用してフィルタリングすることができます。プレフィックはキー名をコロンで区切って構成します（`v1:todo:<key>`）。

はじめに Todo の一覧を取得する関数です。

```ts
export const getTodos = async (KV: KVNamespace): Promise<Todo[]> => {
  const list = await KV.list({ prefix: PREFIX });
  const todos: Todo[] = [];

  for (const key of list.keys) {
    const value = await KV.get<Todo>(key.name, "json");
    if (value) {
      todos.push(value);
    }
  }

  return todos;
};
```

引数として `KV` を受け取っています。これはルーティングのハンドラ関数から `e.env.HONO_TODO` を渡してもらうことで Workers KV の API にアクセスするために使用します。引数として `KV` を受け取るのはすべての関数で共通です。

`KV.list()` メソッドで特定のプレフィックを持つキーを全て取得しています。`list.keys` からキーの一覧を取得できるので `for...of` でループしてすべての値を取得しています。キーから値を取得するためには　`KV.get()` メソッドを使用します。`KV.get()` の第2引数ではどのような形式に値を取得するかを指定することができます。デフォルトは `"text"` として取得しますが、`"json"` 形式を選択するとオブジェクトに変換してから値を返却してくれます。

続いて `id` を指定して特定の Todo を取得する関数です。ただ単にラップしているだけですので、あまり特筆すべき点もないでしょう。

```ts
export const getTodo = (KV: KVNamespace, id: string): Promise<Todo | null> => {
  return KV.get<Todo>(`${PREFIX}${id}`, "json");
};
```

Todo を作成する関数は引数にボディパラメータを受け取ります。

```ts
export const createTodo = async (KV: KVNamespace, param: CreateTodo): Promise<Todo> => {
  const id = crypto.randomUUID();
  const newTodo: Todo = {
    id,
    title: param.title,
    completed: false,
  };
  await KV.put(`${PREFIX}${id}`, JSON.stringify(newTodo));

  return newTodo;
};
```

`id` の生成には [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) である [crypto.randomUUID()](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID) を使用しています。このように Cloudflare Workers は Web Crypto もサポートしています。

KV にデータを保存するには `KV.put()` メソッドを使用します。キーにはプレフィックを含めるのと、値を `string` 型として書き込むために `JSON.stringify` を使用していることに注意してください。

続いて Todo を更新する関数です。

```ts
export const updateTodo = async (
  KV: KVNamespace,
  id: string,
  param: UpdateTodo
): Promise<void> => {
  const todo = await getTodo(KV, id);
  if (!todo) {
    return;
  }

  const updateTodo = {
    ...todo,
    ...param,
  };

  await KV.put(`${PREFIX}${id}`, JSON.stringify(updateTodo));
};
```

`getTodo` 関数で Todo を取得してから引数のパラメータで値を更新してから `KV.put` で KV に保存します。

最後に Todo の削除を行う関数です。この関数も単に KV の操作をラップしています。

```ts
export const deleteTodo = (KV: KVNamespace, id: string) => {
  return KV.delete(`${PREFIX}${id}`);
};
```

モデルの作成が完了したら `src/todos/api.ts` ファイルでモデルを使用するように修正しましょう。

```ts
import { Hono } from "hono";
import { validation } from "@honojs/validator";
import {
  createTodo,
  CreateTodo,
  deleteTodo,
  getTodo,
  getTodos,
  updateTodo,
  UpdateTodo,
} from "./model";
import { Bindings } from "../bindings";

const todos = new Hono<Bindings>();

todos.get("/", async (c) => {
  const todos = await getTodos(c.env.HONO_TODO);
  return c.json(todos);
});

todos.post(
  "/",
  validation((v, message) => ({
    body: {
      title: [v.trim, [v.required, message("Title is required")]],
    },
  })),
  async (c) => {
    const param = await c.req.json<CreateTodo>();
    const newTodo = await createTodo(c.env.HONO_TODO, param);

    return c.json(newTodo, 201);
  }
);

todos.put("/:id", async (c) => {
  const id = c.req.param("id");
  const todo = await getTodo(c.env.HONO_TODO, id);
  if (!todo) {
    return c.json({ message: "not found" }, 404);
  }
  const param = await c.req.json<UpdateTodo>();
  await updateTodo(c.env.HONO_TODO, id, param);
  return new Response(null, { status: 204 });
});

todos.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const todo = await getTodo(c.env.HONO_TODO, id);
  if (!todo) {
    return c.json({ message: "not found" }, 404);
  }

  await deleteTodo(c.env.HONO_TODO, id);

  return new Response(null, { status: 204 });
});

export { todos };
```

ここまでの修正が完了したらそれぞれの API をテストしてみてください。

### テストコードの実装

最後に作成したコードに対してテストコードを実装しましょう。`Hono` では `app.fetch()` メソッドを使用することで API に対するリクエストを送信し、テストを記述することができます。

```ts
test('GET /hello is ok', async () => {
  const res = await app.request('http://localhost/hello')
  expect(res.status).toBe(200)
})
```

#### テスト環境の構築

まずはテストに必要なパッケージをインストールします。

```sh
npm install -D jest jest-environment-miniflare @types/jest esbuild-jest
```

[Miniflare](https://miniflare.dev/) は Cloudflare Workers テストするためのシミュレータです。Miniflare は Jest の実行環境として指定できます（Jest 27 以降が必要です）。

`jest.config.js` に Jest の設定を記述します。

```js
module.exports = {
  testEnvironment: "miniflare",
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": "esbuild-jest",
  },
  moduleNameMapper: {
    "jsonpath-plus":
      "<rootDir>/node_modules/jsonpath-plus/dist/index-node-cjs.cjs",
  },
};
```

`tsconfig.json` の `types` に `"@types/jest"` を追加します。

```json
{
	"compilerOptions": {
    "types": [
			"@cloudflare/workers-types",
			"@types/jest"
		]
  }
}
```

テストファイルの中では `env` は `getMiniflareBindings()` という関数から取得できます。このグローバル関数が存在することを TypeScript に伝えるために `src/bindings.d.ts` ファイルで宣言します。

```ts
declare global {
  function getMiniflareBindings(): Bindings
}
```

`package.json` にテスト用のコマンドを追加します。

```json
{
  "scripts": {
    "test": "jest --verbose --watch"
  },
}
```

#### テストを記述する

テスト環境の準備が完了したので、実際にテストを記述していきましょう。`src/todos/api.spec.ts` ファイルを作成します。

```ts
import { Hono } from "hono";
import { todos, app } from "./api";
import { PREFIX, Todo } from "./model";

const env = getMiniflareBindings();
const seed = async () => {
  const todoList: Todo[] = [
    { id: "1", title: "Learning Hono", completed: false },
    { id: "2", title: "Watch the movie", completed: true },
    { id: "3", title: "Buy milk", completed: false },
  ];
  for (const todo of todoList) {
    await env.HONO_TODO.put(`${PREFIX}${todo.id}`, JSON.stringify(todo));
  }
};

describe("Todos API", () => {
  beforeEach(() => {
    seed();
  });
});
```

`getMiniflareBindings` 関数から `env` を取得しています。`seed` 関数では Todo の初期データを投入しています。`seed` 関数は `beforeEach` で各テストごとに呼び出しています。Miniflare 環境では各テストで KV、キャッシュなどに分離ストレージを使用します。これは基本的に、`test` または `describe` ブロックで行った変更は、その後自動的に取り消されることを意味します。

はじめに Todo 一覧を取得するテストです。

```ts
test("Todo 一覧を取得する", async () => {
  const res = await app.fetch(new Request("http://localhost"), env);
  expect(res.status).toBe(200);

  const body = await res.json();
  expect(body).toEqual([
    { id: "1", title: "Learning Hono", completed: false },
    { id: "2", title: "Watch the movie", completed: true },
    { id: "3", title: "Buy milk", completed: false },
  ]);
});
```

`app.fetch()` メソッドでリクエストを送信しています。ハンドラ関数がバインディングされた KV を使用するために `app.fetch` の第2引数に `getMiniflareBindings` 関数から取得した `env` を含める必要がある点に注意してください。

テストを実行して Pass するか確認してみましょう。

```sh
npm runt test

 PASS  src/todos/api.test.ts
  Todos API
    ✓ Todo 一覧を取得する (43 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        2.488 s
```

この調子で残りのテストも実装していきます。

```ts

test("Todo を作成する", async () => {
  const newTodo: CreateTodo = { title: "new-todo" };
  const res1 = await app.fetch(
    new Request("http://localhost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    }),
    env
  );
  expect(res1.status).toBe(201);
  const body = await res1.json();
  expect(body).toEqual({
    id: expect.any(String),
    title: "new-todo",
    completed: false,
  });

  const res2 = await app.fetch(new Request("http://localhost"), env);
  const list = await res2.json();
  expect(list).toEqual([
    { id: "1", title: "Learning Hono", completed: false },
    { id: "2", title: "Watch the movie", completed: true },
    { id: "3", title: "Buy milk", completed: false },
    { id: expect.any(String), title: "new-todo", completed: false },
  ]);
});

test("Todo を作成する：title は必須", async () => {
  const newTodo: CreateTodo = { title: " " };
  const res = await app.fetch(
    new Request("http://localhost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    }),
    env
  );
  expect(res.status).toBe(400);
});

test("Todo を更新する", async () => {
  const updateTodo: UpdateTodo = { completed: true };
  const res1 = await app.fetch(
    new Request("http://localhost/3", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateTodo),
    }),
    env
  );
  expect(res1.status).toBe(204);

  const res2 = await app.fetch(new Request("http://localhost"), env);
  const list = await res2.json();
  expect(list).toEqual([
    { id: "1", title: "Learning Hono", completed: false },
    { id: "2", title: "Watch the movie", completed: true },
    { id: "3", title: "Buy milk", completed: true },
  ]);
});

test("Todo を削除する", async () => {
  const res1 = await app.fetch(
    new Request("http://localhost/2", {
      method: "DELETE",
    }),
    env
  );
  expect(res1.status).toBe(204);

  const res2 = await app.fetch(new Request("http://localhost"), env);
  const list = await res2.json();
  expect(list).toEqual([
    { id: "1", title: "Learning Hono", completed: false },
    { id: "3", title: "Buy milk", completed: false },
  ]);
});
```

Todo の作成・更新・削除のテストを実装しました。それぞれレスポンスが正しいことを確認してから一覧取得 API をコールして実際にデータが変更されているかどうかを確認しています。

### アプリケーションのデプロイ

それでは、作成したアプリケーションを実際に Cloudflare Workers にデプロイしてみましょう。以下のコマンドで簡単にデプロイできます。

```sh
npm run deploy

Retrieving cached values for userId from node_modules/.cache/wrangler
Your worker has access to the following bindings:
- KV Namespaces:
  - HONO_TODO: 1a136855b23f4b14aab395ab6247282a
Total Upload: 275.07 KiB / gzip: 54.50 KiB
Uploaded hono-todo (1.16 sec)
Published hono-todo (0.22 sec)
  https://hono-todo.azukiazusa.workers.dev
```

デプロイが完了すると URL が表示されるので確認してみましょう。

