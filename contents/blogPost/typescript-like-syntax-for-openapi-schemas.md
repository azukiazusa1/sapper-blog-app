---
id: -WGzyQn34XTGgdYaf_LXc
title: "TypeScript のような構文で OpenAPI のスキーマを定義する TypeSpec"
slug: "typescript-like-syntax-for-openapi-schemas"
about: "TypeSepc は TypeScript にインスパイアされた言語で、開発者が親しみやすい構文で OpenAPI のスキーマを定義できます。モデルを使ってデータの構造を定義し、`@route` デコレーターを使って REST API のエンドポイントを定義します。"
createdAt: "2024-01-27T13:48+09:00"
updatedAt: "2024-01-27T13:48+09:00"
tags: ["TypeScript", "OpenAPI", "TypeSpec"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4efwBKKVHcvQTjB8X6RLXA/947fcf1f6d7186446795e94c7f48f2cd/down-jacket_14978.png"
  title: "ダウンジャケットのイラスト"
published: true
---
TypeSpec は TypeScript にインスパイアされた言語で、開発者が親しみやすい構文で [OpenAPI v3.0](https://spec.openapis.org/oas/v3.0.3) のスキーマを定義できます。

https://typespec.io/

スキーマの定義は以下のようになります。

```ts:main.tsp
import "@typespec/http";

using TypeSpec.Http;

model User {
  id: string;
  name: string;
  birthday?: utcDateTime;
  address: Address;
}

model Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

@route("/users")
interface Users {
  list(@query limit: int32, @query skip: int32): User[];
  create(@body user: User): User;
  get(@path id: string): User;
}
```

上記のコードをコンパイルすると、以下のような OpenAPI のスキーマが出力されます。

```yaml:openapi.yaml
openapi: 3.0.0
info:
  title: (title)
  version: 0000-00-00
tags: []
paths:
  /users:
    get:
      operationId: Users_list
      parameters:
        - name: limit
          in: query
          required: true
          schema:
            type: integer
            format: int32
        - name: skip
          in: query
          required: true
          schema:
            type: integer
            format: int32
      responses:
        '200':
          description: The request has succeeded.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
    post:
      operationId: Users_create
      parameters: []
      responses:
        '200':
          description: The request has succeeded.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/User'
  /users/{id}:
    get:
      operationId: Users_get
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: The request has succeeded.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
components:
  schemas:
    Address:
      type: object
      required:
        - street
        - city
        - state
        - zip
      properties:
        street:
          type: string
        city:
          type: string
        state:
          type: string
        zip:
          type: string
    User:
      type: object
      required:
        - id
        - name
        - address
      properties:
        id:
          type: string
        name:
          type: string
        birthday:
          type: string
          format: date-time
        address:
          $ref: '#/components/schemas/Address'
```

また、TypeSpec は OpenAPI 形式だけでなく、JSON Schema や Protobuf、JSON RPC などの形式にも対応しています。

## インストール

はじめに、TypeSpec コンパイラをインストールします。

```sh
npm install -g @typespec/compiler
```

以下のコマンドで tsp のプロジェクトを初期化します。

```sh
tsp init
```

テンプレートを選択するように聞かれるので、`Generic Rest API` を選択します。

ライブラリはデフォルト選択のまま `@typespec/http`、`@typespec/rest`、`@typespec/openapi3` を選択します。

```sh
? Update the libraries? ›
Instructions:
    ↑/↓: Highlight option
    ←/→/[space]: Toggle selection
    a: Toggle all
    enter/return: Complete answer
◉   @typespec/http
◉   @typespec/rest
◉   @typespec/openapi3
```

セットアップが完了すると、以下のファイルが生成されます。

```sh
.
├── main.tsp
├── package.json
└── tsconfig.yaml
```

`.tsp` 拡張子は TypeSpec のソースコードを表します。もし VSCode を使っている場合には、以下のコマンドで TypeSpec の拡張機能をインストールすることをおすすめします。

```sh
tsp code install
```

!> この拡張機能はまだ Market Place では利用できないので、必ずコマンドでインストールする必要があります。

以下のコマンドでコンパイルします。

```sh
tsp compile .
```

デフォルトの状態では `tsp-ouput/@typespec/openapi3` に OpenAPI のスキーマが出力されます。

```yaml:title=tsp-ouput/@typespec/openapi3/openapi.yaml
openapi: 3.0.0
info:
  title: (title)
  version: 0000-00-00
tags: []
paths: {}
components: {}
```

## tsp コマンド

## REST API のスキーマを定義してみる

それでは TypeSpec で REST API のスキーマを定義していきましょう。`tsp compile . --watch` コマンドを実行すると、ファイルの変更を検知して自動的にコンパイルしてくれます。

HTTP API とのバインディングには `@typespec/http` ライブラリを使います。このライブラリには HTTP のルーティングを定義するための `@route` デコレーターや、Body リクエストを表す `body` モデルなどが含まれています。

https://typespec.io/docs/libraries/http/reference

ライブラリをインポートするには `import` キーワードを使います。TypeScript の `import` と同じく、ファイルパスが指定された場合には対応するファイルまたはディレクトリから探索されます。パッケージ名が指定された場合にはまず TypeSpec は `package.json` を探索し、ライブラリのエントリーポイントを探します。

```ts:main.tsp
import "@typespec/http";
```

`using` キーワードを使うことで [namespace](https://typespec.io/docs/language-basics/namespaces) を現在のスコープに公開できます。これにより、`@route` デコレーターなどパッケージで公開されているシンボルを参照できるようになります。

```ts:main.tsp {3}
import "@typespec/http";

using TypeSpec.Http;
```

## メタデータの定義

namespace に対して `@typespec/http` パッケージが提供する `@service`、`@server` デコレーターを使うことで、OpenAPI のメタデータを定義できます。

```ts:main.tsp
import "@typespec/http";

using TypeSpec.Http;

@service({
  title: "User API",
  version: "1.0.0",
})
@server("https://example.com/api", "production")
namespace UserAPI;
```

コンパイルすると以下のように変換されます。

```yaml:openapi.yaml
openapi: 3.0.0
info:
  title: User API
  version: 1.0.0
tags: []
paths: {}
components: {}
servers:
  - url: https://example.com/api
    description: production
    variables: {}
```

### モデルの定義

TypeSpec では [モデル](https://typespec.io/docs/language-basics/models) を使ってデータの構造を定義します。モデルは TypeScript のインターフェースと似たようなレコードの形式または配列です。

```ts:main.tsp
model User {
  id: string;
  name: string;
}
```

モデルはコンパイルされると `components/schemas` として OpenAPI のスキーマに変換されます。

```yaml:openapi.yaml
components:
  schemas:
    User:
      type: object
      required:
        - id
        - name
      properties:
        id:
          type: string
        name:
          type: string
```

ビルドインで用意されているプリミティブな型は [Built-in Types](https://typespec.io/docs/language-basics/built-in-types) を参照してください。別のモデルをデータ型として使うこともできます。

```ts:main.tsp {4, 7-12}
model User {
  id: string;
  name: string;
  address: Address;
}

model Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}
```

オプショナルなプロパティを定義するには `?` を使います。

```ts:main.tsp {4}
model User {
  id: string;
  name: string;
  birthday?: utcDateTime;
  address: Address;
}
```

オプショナルなプロパティにはデフォルト値を指定できます。

```ts:main.tsp {4}
model User {
  id: string;
  name: string;
  birthday?: utcDateTime = "2000-01-01T00:00:00Z";
  address: Address;
}
```

ビルドインのデコレーターを使うことで、プロパティに対してバリデーションを定義できます。

```ts:main.tsp {4-5}
model User {
  id: string;

  @minLength(1)
  @maxLength(10)
  name: string;

  birthday?: utcDateTime;
  address: Address;
}
```

`@doc` デコレーターはモデルやプロパティに対してドキュメントを定義します。

```ts:main.tsp {1, 5}
@doc("ユーザー")
model User {
  id: string;

  @doc("ユーザー名")
  @minLength(1)
  @maxLength(10)
  name: string;

  birthday?: utcDateTime;
  address: Address;
}
```

またはドキュメントコメント（`/** ... */`）を使うこともできます。

```ts:main.tsp {1-3, 7-9}
/**
 * ユーザー
 */
model User {
  id: string;

  /**
   * ユーザー名
   */
  @minLength(1)
  @maxLength(10)
  name: string;

  birthday?: utcDateTime;
  address: Address;
}
```

スプレッド演算子（`...`）を使うことで、他のモデルのプロパティをコンポジションできます。

```ts:main.tsp
model User {
  id: string;
  name: string;
  birthday?: utcDateTime = "2000-01-01T00:00:00Z";
  address: Address;
}

enum Role {
  read,
  write,
}

model Admin {
  ...User;
  role: Role;
}
```

`extends` キーワードを使うことで、他のモデルを継承できます。これは明示的に関係を表したい時に使います。

```ts:main.tsp
model User {
  id: string;
  name: string;
  birthday?: utcDateTime = "2000-01-01T00:00:00Z";
  address: Address;
}

enum Role {
  read,
  write,
}

model Admin extends User {
  role: Role;
}
```

[Template](https://typespec.io/docs/language-basics/templates) を使うことで、特定のパターンのデータ型を簡単に定義できます。例えば、ページネーションのレスポンスを表す `Pagination` モデルを定義してみましょう。

```ts:main.tsp
model Pagination<T> {
  items: T[];
  total: int32;
  offset: int32;
  limit: int32;
  count: int32;
}
```

この Pagination モデルは、`T` という型パラメーターを持っています。この型パラメーターは `Pagination` モデルを使う時に実際の型に置き換えられます。

```ts:main.tsp
mode UserPagination extends Pagination<User> {}
// => {
//   items: User[];
//   total: int32;
//   offset: int32;
//   limit: int32;
//   count: int32;
// }
```

### リソースの定義

リソースは REST API のエンドポイントを表します。リソースは `@route` デコレーターを使って定義します。`@route` デコレーターはパス名を引数に取ります。

```ts:main.tsp
@route("/users")
interface Users {}
```

`interface` のメソッドとしてエンドポイントに対する操作を定義します。リクエストパラメータをメソッドの引数に、レスポンスをメソッドの戻り値として定義します。

```ts:main.tsp
@error
model Error {
  code: int32;
  message: string;
}

@route("/users")
interface Users {
  // @query デコレーターはクエリパラメータ
  list(@query limit: int32, @query skip: int32): Pagination<User>;
  // @body デコレーターはリクエストボディ
  create(@body user: User): User | Error;
  // @path デコレーターはパスパラメータ
  get(@path id: string): User | Error;
}
```

このコードをコンパイルすると以下のように変換されます。

```yaml:openapi.yaml
paths:
  /users:
    get:
      operationId: Users_list
      parameters:
        - name: limit
          in: query
          required: true
          schema:
            type: integer
            format: int32
        - name: skip
          in: query
          required: true
          schema:
            type: integer
            format: int32
      responses:
        '200':
          description: The request has succeeded.
          content:
            application/json:
              schema:
                type: object
                required:
                  - items
                  - total
                  - offset
                  - limit
                  - count
                properties:
                  items:
                    type: array
                    items:
                      $ref: '#/components/schemas/User'
                  total:
                    type: integer
                    format: int32
                  offset:
                    type: integer
                    format: int32
                  limit:
                    type: integer
                    format: int32
                  count:
                    type: integer
                    format: int32
    post:
      operationId: Users_create
      parameters: []
      responses:
        '200':
          description: The request has succeeded.
          content:
            application/json:
              schema:
                anyOf:
                  - $ref: '#/components/schemas/User'
                  - $ref: '#/components/schemas/Error'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/User'
  /users/{id}:
    get:
      operationId: Users_get
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: The request has succeeded.
          content:
            application/json:
              schema:
                anyOf:
                  - $ref: '#/components/schemas/User'
                  - $ref: '#/components/schemas/Error'
```

デコレーターにより HTTP メソッドを指定しない場合にはデフォルトで `GET` メソッドとなり、`@body` デコレーターが指定されていない場合に限り `POST` メソッドとして扱われます。

それぞれの HTTP メソッドに対応するデコレーターを使うことで、明示的に HTTP メソッドを指定できます。

```ts:main.tsp
@route("/users")
interface Users {
  @get
  list(@query limit: int32, @query skip: int32): Pagination<User>;

  @post
  create(@body user: User): User | Error;

  @get
  get(@path id: string): User | Error;

  @put
  update(@path id: string, @body user: User): User | Error;

  @delete
  delete(@path id: string): User | Error;
}
```

`@header` デコレーターを使うとヘッダーを、`statusCodes` デコレーターを使うとステータスコードそれぞれ定義できます。

```ts:main.tsp
@route("/users")
interface Users {
  @get
  list(@query limit: int32, @query skip: int32, @header ifMatch?: string): {
    @header ETag: string;
    @body pagenationUser: Pagination<User>;
  };

  @post
  create(@body user: User): {
    @statusCode statusCode: 201 | 400;
    @body User: User | Error;
  };
}
```

## まとめ

- TypeSpec は TypeScript にインスパイアされた言語で、開発者が親しみやすい構文で OpenAPI のスキーマを定義できる
- モデルを使ってデータの構造を定義する
- `@route` デコレーターを使って REST API のエンドポイントを定義する

## 参考

- [TypeSpec](https://typespec.io/)
