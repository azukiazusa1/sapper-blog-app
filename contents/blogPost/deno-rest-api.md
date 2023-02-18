---
id: 2DPBThQRS7e0xwtrJfeFvl
title: "DenoでREST API"
slug: "deno-rest-api"
about: "この記事では、Denoを使い簡単なCRUD操作を行うREST APIを構築します。"
createdAt: "2021-02-28T00:00+09:00"
updatedAt: "2021-02-28T00:00+09:00"
tags: ["TypeScript", "Deno", "MongoDB"]
published: true
---
この記事では、Denoを使い簡単なCRUD操作を行うREST APIを構築します。

# 環境構築

## Denoのインストール

はじめにDenoをインストールする必要があります。インストール方法は以下のリンクを参照してください。
[https://deno.land/#installation](https://deno.land/#installation)

よく使いそうな方法をいくつか記載しておきます。

### Shell (Mac, Linux):

```sh
curl -fsSL https://deno.land/x/install/install.sh | sh
```

### PowerShell (Windows):

```sh
iwr https://deno.land/x/install/install.ps1 -useb | iex
```

### Homebrew (Mac):

```sh
brew install deno
```

バージョンを確認します。

```sh
deno --version
deno 1.7.5 (release, x86_64-apple-darwin)
v8 9.0.123
typescript 4.1.4
```

## VSCodeの拡張の導入

以下の拡張をインストールします。
[Deno for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno)
（これを入れないと型が全く効きません・・・）

拡張をインストールしたら、プロジェクトのルートディレクトリで`Ctrl+Shift+P`でコマンドパレットを開き、`Deno Initialize Workspace Configuration`を選択します。

いくつか対話形式で選択肢が表示されますが、すべてYesで大丈夫です。
完了したら、`.vscode/setting.json`が生成されているはずです。

```json:.vscode/setting.json
{
  "deno.enable": true,
  "deno.lint": true,
  "deno.unstable": true
}
```

APIを叩くために、下記拡張も使用します。

[REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

curlやPostmanなどが好きなツールでも問題ありません。

# サーバーのセットアップ

まずは簡単な`Hello World!`を返すアプリケーションを構築します。
ルートディレクトリに`src`フォルダを作成しその中に`server.ts`ファイルを作成します。

```ts:src/server.ts
import { Application, Router, RouterContext } from "https://deno.land/x/oak@v6.5.0/mod.ts";

const app = new Application();
const router = new Router();

app.addEventListener("listen", ({ hostname, port, secure }) => {
  console.log(
    `Listening on: ${secure ? "https://" : "http://"}${hostname ??
      "localhost"}:${port}`,
  );
});

app.addEventListener("error", (evt) => {
  console.log(evt.error);
});

router.get('/', (ctx: RouterContext) => {
  ctx.response.body = "Hello World!";
})

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8080 });
```

サーバーのルーティングフレームワークには[Ork](https://github.com/oakserver/oak)を使います。Orkは、[Koa](https://github.com/koajs/koa/)に影響を受けています。

DenoではパッケージはURLからインポートします。このとき、`oak@v6.5.0`のように明示的にバージョンを指定するのがよいでしょう。

`Application`クラスは、`http`パッケージの`serve()`メソッドをラップしたものです。これは`use()`メソッドと`listen()`メソッドを持っています。
`use()`メソッドはミドルウェアの登録を、`listen()`はサーバーの起動します。

また、`Application`クラスのインスタンスは`.addEventListener()`メソッドでイベントを購読することもできます。
`listen`イベントはサーバーが起動した際に呼び出され、`error`イベントはサーバーでエラーが発生した際に呼び出されます。

`Router`クラスはルーティング機能を提供します。

第一引数にはルートのパス名を受け取り、第二引数のコールバック関数でリクエストの処理を行います。

コールバック関数の引数には[Context](https://github.com/oakserver/oak#context)オブジェクトが渡されます。

この簡単な例では、`ctx.response.body`でリクエストボディに`Hello World!`という文字列を代入することで`Hello World!`と返すようにしています。

サーバーを起動してみましょう。Denoを実行する際に、`--allow-net`フラグを付与してパーミッションを与える必要があります。

```sh
deno run --allow-net server.ts
```

APIをテストします。
`request.http`というファイルを作成します。

```http:request.http
### echo Hello World!
http://localhost:8080
```

`Send Request`と表示されていると思いますのでクリックしてください。
レスポンス結果が表示されます。

![hello-world-response](//images.ctfassets.net/in6v9lxmm5c8/5PuD6vadJY82w4R2cTFARy/a820ab29b13fc855c1f55f673978343d/____________________________2021-02-27_23.02.06.png)

しっかりと`Hello World!`という文字列が返されていることがわかります。

# denonの導入

セットアップが完了したのでここからどんどん実装していきたいところですが、今の状態ですと変更がある度に手動でサーバーを再起動しなければいけません。

それでは面倒ですので、[denon](https://deno.land/x/denon@2.4.7)と呼ばれるパッケージを利用します。

## インストール

次のコマンドでインストールします。

```sh
deno install -qAf --unstable https://deno.land/x/denon/denon.ts
```

:::message
インストールにはdenoのバージョン1.4.0以上が必要です。インストールに失敗した人は、`deno upgrade`コマンドを実行してみてください。
:::

## パスを通す

bashで実行できるようにパスを通します。
(Macの場合です）

```sh
echo 'export PATH="$HOME/.deno/bin:$PATH"' >> ~/.bash_profile
source ~/.bash_profile
```

## 設定ファイルの生成

下記コマンドで設定ファイルを生成します。
設定ファイルは必須ではないですが、生成しておくと毎回長いフラグオプションを指定しなくてもよくなります。`npm-scripts`に近いようなものです。

```sh
denon init --typescript
```

自動生成されるものがこちらです。

```ts:scripts.config.ts
import { DenonConfig } from "https://deno.land/x/denon@2.4.7/mod.ts";

const config: DenonConfig = {
  scripts: {
    start: {
      cmd: "deno run app.ts",
      desc: "run my app.ts file",
    },
  },
};

export default config;
```

フラグオプションを指定するなどの修正を行います。

```diff:scripts.config.ts

import { DenonConfig } from "https://deno.land/x/denon@2.4.7/mod.ts";

const config: DenonConfig = {
  scripts: {
    start: {
-      cmd: "deno run app.ts",
-      desc: "run my app.ts file",
+      cmd: "deno run src/server.ts",
+      desc: "run my server.ts file",
+      allow: ["net"],
+      unstable: true,
    },
  },
};

export default config;
```

下記コマンドで実行します。

```sh
denon start
```

これで変更を加える度に自動でサーバーが再起動してくれるようになります。

# ルーティングの作成

API用のルーティングを追加していきましょう。
`src/router.ts`を作成してそこにルーティングを記述していきます。

```ts:src/router.ts
import { Router } from "https://deno.land/x/oak@v6.5.0/mod.ts";

const router = new Router();

router.get('/api/v1/books', () => {})
router.get('/api/v1/books/:id', () => {})
router.post('/api/v1/books', () => {})
router.put('/api/v1/books/:id', () => {})
router.delete('/api/v1/books/:id', () => {})

export { router }
```

`server.ts`では、`router.ts`から`router`オブジェクトをインポートして使用します。

```diff:src/server.ts
- import { Application, Router, RouterContext } from "https://deno.land/x/oak@v6.5.0/mod.ts";
+ import { Application } from "https://deno.land/x/oak@v6.5.0/mod.ts";
+ import { router } from './router.ts'

const app = new Application();
- const router = new Router();

app.addEventListener("listen", ({ hostname, port, secure }) => {
  console.log(
    `Listening on: ${secure ? "https://" : "http://"}${hostname ??
      "localhost"}:${port}`,
  );
});

app.addEventListener("error", (evt) => {
  console.log(evt.error);
});

- router.get('/', (ctx: RouterContext) => {
-   ctx.response.body = "Hello World!";
- })

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8080 });
```

# コントローラーの作成

ルーティングの実際の処理は直接コールバックを記述するのではなく、コントローラーに任せます。

`src/controllers`フォルダを作成して、`booksController.ts`ファイルを作成します。

```ts:src/controllers/booksController.ts
import { RouterContext, helpers } from "https://deno.land/x/oak@v6.5.0/mod.ts";

export const booksController = {
  getAll(ctx: RouterContext) {
    ctx.response.body = 'Get All Books'
  },

  get(ctx: RouterContext) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.response.body = `Get Book By ID: ${id}`
  },

  create(ctx: RouterContext) {
    ctx.response.body = 'Create Book'
  },

  update(ctx: RouterContext) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.response.body = `Update Book By ID: ${id}`
  },

  delete(ctx: RouterContext) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.response.body = `Delete Book By ID: ${id}`
  }
}
```

`router.ts`において、コントローラーの処理と対応させます。

```ts:src/rotuer.ts
import { Router } from "https://deno.land/x/oak@v6.5.0/mod.ts";
import { booksController } from './controllers/booksController.ts'
const router = new Router();

router.get('/api/v1/books', booksController.getAll)
router.get('/api/v1/books/:id', booksController.get)
router.post('/api/v1/books', booksController.create)
router.put('/api/v1/books/:id', booksController.update)
router.delete('/api/v1/books/:id', booksController.delete)

export { router }
```

ここまで完了したら、APIをテストしてみましょう。
`request.http`を編集します。

```http:request.http
### echo Hello World!
GET http://localhost:8080

### Get All Books
GET http://localhost:8080/api/v1/books

### Get Books by ID
GET http://localhost:8080/api/v1/books/1

### Create Book
POST http://localhost:8080/api/v1/books
Content-Type: application/json

### Update Book By Id
PUT http://localhost:8080/api/v1/books/1
Content-Type: application/json

### Delete Book By ID
DELETE http://localhost:8080/api/v1/books/1
```

それぞれのルートにリクエストを送り、正しくレスポンスが帰ってくることを確認してみてください。

# MongoDBのセットアップ

コントローラーの実装に入る前に、データベースを使えるようにしておきます。
データベースにはMongoDBを利用します。MondoDBはドキュメント型のNoSQLであり、JSONの構造をそのままデータとして保存することができます。

## MondoDBのインストール

### Mac

次のコマンドを実行して、MongoDBをインストールします。
ここではHomebrewを使用してインストールしています。

```sh
brew tap mongodb/brew
brew install mongodb-community@4.2
```

以下のコマンドで起動します。

```sh
brew services start mongodb-community@4.2
```

### Window

以下の記事を参照お願いします。

[windows10にmongoDBをインストールする](https://mebee.info/2019/11/27/post-3520/)

## deno_mongoの設定

[deno_mongo](https://deno.land/x/mongo@v0.21.2)は、DenoのMongoDBのデータベースドライバーです。

`src`フォルダに`db.ts`ファイルを作成します。

```ts: src/db.ts
import { MongoClient } from "https://deno.land/x/mongo@v0.21.0/mod.ts";

const client = new MongoClient();
await client.connect("mongodb://127.0.0.1:27017");

export const db = client.database("deno_rest_api");
```

接続先は各自の環境に合わせてください。

公式のREADMEには`mongodb://localhost:27017`と記載されていますが、localhostを指定するとエラーになるので`mongodb://127.0.0.1:27017`にする必要がありました。

## envの導入

データベースへの接続先は、セキュアな属性でもありますので、`.env`ファイルを作成してそこから読み取るようにします。

`.env`ファイルを作成します。

```.env
MONGO_URI=mongodb://localhost:27017
```

`.env`ファイルを読み取るために[Dotenv](https://deno.land/x/dotenv@v2.0.0)パッケージを使用します。

`db.ts`を修正します。

```diff:src/db.ts
import { MongoClient } from "https://deno.land/x/mongo@v0.21.0/mod.ts";
+ import import "https://deno.land/x/dotenv@v2.0.0/load.ts";

const client = new MongoClient();
- await client.connect("mongodb://127.0.0.1:27017");
+ await client.connect(Deno.env.get('MONGO_URI')!);

export const db = client.database("deno_rest_api");
```

さらに、Deno`.env`ファイルを読み取るためには`--allow-env`フラグと`--allow-read`フラグを付与する必要があります。
`scripts.config.ts`を修正しましょう。

```diff:scripts.config.ts

import { DenonConfig } from "https://deno.land/x/denon@2.4.7/mod.ts";

const config: DenonConfig = {
  scripts: {
    start: {
      cmd: "deno run src/server.ts",
      desc: "run my server.ts file",
-       allow: ["net"],
+       allow: ["net", "read", "env"],
      unstable: true,
    },
  },
};

export default config;
```

`scripts.config.ts`を修正したら、`Ctrl + c`で一旦denonプロセスを終了し再度起動する必要があります。

# モデルの作成

MongoDBに接続できるようにしたので、DBとのやり取りを行うためのモデルを作成します。

`src/models`ファイルを作成し、`Books.ts`ファイルを作成します。

```ts: src/models/Books.ts
import { db } from "../db.ts";

interface BookSchema {
  _id: { $oid: string };
  title: string;
  author: string;
  price: number
}

const booksCollection = db.collection<BookSchema>("books");

type Payload = Pick<BookSchema, 'title' | 'author' | 'price'>

export class Book {

  private constructor(
    public title: string,
    public author: string,
    public price: number,
    public _id: object | undefined = undefined,
  ) {}

  static findAll() {
  }

  static async findById(id: string) {
  }

  static create({ title, author, price }: Payload) {
    return new this(title, author, price)
  }

  async save() {
  }

  async update() {
  }

  static async delete() {

  }
}
```

# コントローラーの実装

## createアクションの実装

それでは、コントローラーの実装に入ります。まずは、createアクションから実装していきます。

```ts:src/controller.ts
import { RouterContext, helpers } from "https://deno.land/x/oak@v6.5.0/mod.ts";
import { Book } from '../models/Book.ts'

// 省略

  async create(ctx: RouterContext) {
    const result = ctx.request.body()
    const { title, author, price }  = await result.value
    const book = await Book.create({
      title,
      author,
      price: Number(price)
    });

    await book.save()
    ctx.response.body = book
  },
```

`request.body()`からリクエストボディを取得して、`result.value`で値を取得します。
`result.value`は`Promise`を返しますので`await`する必要があります。

モデルの`save()`メソッドも実装しましょう。

```ts:src/models/Book.ts
export class Book {
  // 省略
  async save() {
    const _id = await booksCollection.insertOne({
      title: this.title,
      author: this.author,
      price: this.price
    })

    this._id = _id
  }
}
```

コレクションの`insertOne()`メソッドでプロパティを指定して挿入することができます。

`request.http`からPOSTリクエストを送信してみましょう。

```http:request.http
### Create Book
POST http://localhost:8080/api/v1/books
Content-Type: application/json

{
  "title": "test book",
  "author": "Alice",
  "price": 1000
}
```

次のようなレスポンスが返却されます。

```
HTTP/1.1 200 OK
content-length: 83
content-type: application/json; charset=utf-8

{
  "title": "test book",
  "author": "Alice",
  "price": 1000,
  "_id": "603b0164087250327b35addb"
}
```

データベースにデータが挿入されているか確認してみましょう。

ターミナルで以下のコマンドにより対話形式でMongoDBを操作できます。

```sh
mongo
```

`use [データベース名]`でデータベースを切り替えます。今回は`deno_rest_api`というデータベース名で作成しています。
(`db.ts`において、`client.database()`に指定した名前です)

```sh
> use deno_rest_api
switched to db deno_rest_api
```

データベースのコレクションのドキュメント一覧を参照するには、`db.[コレクション名].find();`というコマンドを使用します。
コレクション名は`books`です。
(`models/Book.ts`において`db.collection<T>()`で指定した名前です）

```sh
> db.books.find()
{ "_id" : ObjectId("603b0164087250327b35addb"), "title" : "test book", "author" : "Alice", "price" : 1000 }
```

データが挿入されれいることが確認できました。
何件か他のデータも作成してみると良いでしょう。

## getAllアクションの実装

続いていgetAllアクションを実装します。このアクションではbooksコレクションの全てのドキュメントを返すようにします。

```ts:src/controllers/booksController.ts
  async getAll(ctx: RouterContext) {
    const books = await Book.findAll()
    ctx.response.body = books
  },
```

モデルの`findAll()`メソッドを実装します。

```ts:src/models/Book.ts
export class Book {
  // 省略
  static async findAll() {
    const books = await booksCollection.find().toArray()
    return books.map(book => {
      return new this(
        book.title, 
        book.author,
        book.price,
        book._id
      )
    })
  }
}
```

レスポンスを確認します。

```
HTTP/1.1 200 OK
content-length: 354
content-type: application/json; charset=utf-8

[
  {
    "_id": "603b0164087250327b35addb",
    "title": "test book",
    "author": "Alice",
    "price": 1000
  },
  {
    "_id": "603b037a087250327b35addc",
    "title": "test book2",
    "author": "Bob",
    "price": 600
  },
  {
    "_id": "603b03a9087250327b35addd",
    "title": "test book3",
    "author": "Joe",
    "price": 1200
  },
]
```

## getアクションの実装

getアクションでは、IDを指定して特定のbookを取得します。
IDは動的パス`:id`から取得します。

これは`context.params.id`でも取得できますが、`helpers.getQuery()`メソッドを使うとよしなにオブジェクトで取得できます。

ドキュメントが取得できなかった場合には404を返すようにします。

```ts:src/controllers/booksController.ts
  async get(ctx: RouterContext) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    const book = await Book.findById(id)

    if (!book) {
      ctx.response.status = 404
      ctx.response.body = { message: "Not found." }
    } else {
      ctx.response.body = book
    }
  },
```

モデルの`findById()`メソッド実装です。

```ts:src/models/Book.ts
export class Book {
  // 省略
  static async findById(id: string) {
    const book = await booksCollection.findOne({ _id: new Bson.ObjectId(id) })
    if (!book) return null

    return new this(
        book.title, 
        book.author,
        book.price,
        book._id
      )
  }
}  
```

MongoDBのオブジェクトIDで取得する際には、文字列で渡された`id`を`mongo`パッケージの`Bson`によって変換する必要があります。

IDを指定してリクエストを送信しましょう。

```
### Get Books by ID
GET http://localhost:8080/api/v1/books/603b0164087250327b35addb
```

```
HTTP/1.1 200 OK
content-length: 84
content-type: application/json; charset=utf-8

{
  "_id": "603b0164087250327b35addb",
  "title": "test book",
  "author": "Alice",
  "price": 1000
}
```

## updateアクション

続いてupdateアクションです。
`findById()`でドキュメントを取得してから`update`メソッドを呼び出します。

リクエストパラメータの取得はcreateアクションと同様です。

```ts: src/controllers.ts
  async update(ctx: RouterContext) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    const book = await Book.findById(id)

    if (!book) {
      ctx.response.status = 404
      ctx.response.body = { message: "Not found." }
    } else {
      const result = ctx.request.body()
      const { title, author, price }  = await result.value
      await book.update({ title, author, price })
      ctx.response.body = book
    }
  },
```

モデルの`update`メソッドです。

```ts: src/models/Book.ts
export class Book {
  // 省略
  async update({ title, author, price }: Payload) {
    await booksCollection.updateOne(
      { _id: this?._id },
      { $set: { title, author, price } }
    );

    this.title = title
    this.author = author
    this.price = price
  }
}
```

コレクションの`updateOne()`メソッドは第一引数にクエリの条件を指定して、第二引数にセットするデータを渡します。

リクエストを送信してみましょう。

```
### Update Book By Id
PUT http://localhost:8080/api/v1/books/603b0164087250327b35addb
Content-Type: application/json

{
  "title": "update book1",
  "author": "Joe",
  "price": 1200
}
```

```
HTTP/1.1 200 OK
content-length: 85
content-type: application/json; charset=utf-8

{
  "title": "update book1",
  "author": "Joe",
  "price": 1200,
  "_id": "603b0164087250327b35addb"
}
```

## deleteアクション

最後にdeleteアクションです。

```ts:src/controllers/booksController.ts
  async delete(ctx: RouterContext) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    await Book.delete(id)

    ctx.response.status = 204
  }
```

モデルの`delete()`メソッドのジッどうです。

```ts:src/models/Book.ts
export class Book {
  // 省略
  static delete(id: string) {
    booksCollection.deleteOne({ _id: new Bson.ObjectId(id) });
  }
}
```

テストしてみます。

```
### Delete Book By ID
DELETE http://localhost:8080/api/v1/books/603b0164087250327b35addb
```

```
HTTP/1.1 204 No Content
content-length: 0
```

データベースの中身も確認してみてください。

# 終わりに

簡単なREST APIをDenoで作成してみました。

すべてのソースコードはこちらから参照できます。

[https://github.com/azukiazusa1/deno-rest-api](https://github.com/azukiazusa1/deno-rest-api)

サードパーティのパッケージも揃っていた特に困ることがなく実装することができました。
とはいえ、`unstatable`オプションを付与する必要があるのでまだ時期尚早といったところでしょうか。
