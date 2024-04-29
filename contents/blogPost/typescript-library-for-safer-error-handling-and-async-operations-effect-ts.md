---
id: 3sHDSMAPAw4oIQRdfAkhW
title: "エラーや非同期処理をより安全に扱うための TypeScript ライブラリ Effect-TS"
slug: "typescript-library-for-safer-error-handling-and-async-operations-effect-ts"
about: "Effect-TS は、開発者が複雑なエラーや非同期処理をより安全に開発できるようにすることを目的とした TypeScript ライブラリです。Effect-TS は、TypeScript の型システムを活用して、本番のアプリケーションにおける実用的な問題を解決することを目指しています。"
createdAt: "2024-04-29T14:54+09:00"
updatedAt: "2024-04-29T14:54+09:00"
tags: ["TypeScript", "Effect-TS"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1m40UxozfoX4jJuCrUS16D/653a29fdce918b0a3ceaa0a6438a4d4b/may_koinobori_6826-768x753.png"
  title: "鯉のぼりのイラスト"
selfAssessment:
  quizzes:
    - question: "Effect.Either において成功を表す型は次のうちどちらか？"
      answers:
        - text: "Left"
          correct: false
          explanation: null
        - text: "Right"
          correct: true
          explanation: "英語では「正しい」と「右」が同じ意味であるため、成功を表す型は Right と覚えましょう。"
published: true
---
Effect-TS（正式名称は Effect）は、開発者が複雑なエラーや非同期処理をより安全に開発できるようにすることを目的とした TypeScript ライブラリです。[Effect System](https://en.wikipedia.org/wiki/Effect_system) という概念を取り入れており、Scala や Haskell といった関数型プログラミング言語に影響を受けています。

https://effect.website/

TypeScript の型システムを活用して、本番のアプリケーションにおける実用的な問題を解決することを目指しています。Effect-TS は、以下のような特徴を備えています。

- 並行性（concurrency）：[Fiber](<https://en.wikipedia.org/wiki/Fiber_(computer_science)>) ベースの並行モデルにより、高いスケーラビリティと低レイテンシを実現
- コンポーザビリティ（composability）：小さく再利用可能なパーツを組み合わせることで、メンテナンス性、可読性、柔軟性の高いソフトウェアを構築する
- リソースの安全な管理（resource-safety）：処理が失敗したとしても、安全にリソースを開放する
- 型安全性（type-safety）：TypeScript の型システムを活用した型推論と型安全性に焦点を当てている
- エラー処理（error handling）：構造化された信頼性の高い方法でエラーを処理する
- 非同期性（asynchronicity）：非同期処理を同期処理と同じように書ける
- オブザーバビリティ（observability）：トレース機能により、簡単にデバッグや監視ができる

Effect-TS を用いると、割り算を行う関数は以下のように記述できます。

```ts
import { Effect } from "effect";

const divide = (a: number, b: number): Effect.Effect<number, Error> =>
  b === 0
    ? Effect.fail(new Error("Cannot divide by zero"))
    : Effect.succeed(a / b);

Effect.runSync(divide(10, 2).pipe(Effect.map((result) => console.log(result)))); // 5
```

## Effect-TS を試してみる

実際に Effect-TS を使用して、より安全に API 通信を行う例を見てみましょう。Effect-TS を使用するには以下の要件が必要です。

- TypeScript 5.4 以上
- `compilerOptions` の `strict` フラグを有効にする

```json:tsconfig.json
{
  "compilerOptions": {
    "strict": true
  }
}
```

以下のコマンドで Effect-TS をインストールします。

```sh
npm install effect
```

### 素朴な API 通信の例

まずは Effect-TS を使わずに `fetch` API を使って API 通信を行う例を見てみましょう。

```ts
type User = {
  id: number;
  name: string;
};

const getUser = async (id: number): Promise<User> => {
  const data = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);

  if (!data.ok) {
    throw new Error("Failed to fetch user");
  }

  const user = (await data.json()) as User;

  return user;
};

getUser(1)
  .then((user) => {
    console.log(user);
  })
  .catch((error) => {
    console.error(error);
  });
```

このコードは、`fetch` API を使って JSONPlaceholder からユーザー情報を取得しています。しかし、このコードにはいくつかの問題があります。

- 型に守られていないエラー処理
- `as` による型キャストを行っており、スキーマが変更された場合にランタイムエラーが発生する可能性がある

エラー処理について詳しく見てみましょう。`fetch` API はステータスコードが 200 番台以外の場合に `ok` プロパティが `false` になります。このため `ok` プロパティの値を見て、通信処理が失敗したときには `throw new Error` でエラーを投げています。例外を投げることによるエラー処理は TypeScript（JavaScript）の標準の方法として備わっていますし、スタックトレースにも記録されるため異常系を表現するためによく使われているでしょう。

しかし、例外を投げる方法はいくつかの理由で安全とは言い難いです。1 つ目の理由として、`try/catch` もしくは `.catch` メソッドで例外を捕捉することを忘れると、エラーがスルーされてしまい、アプリケーションがクラッシュする可能性がある点があげられます。Java のように、どの関数が例外を投げるか型システムで保証されているわけではないため、`catch` を書くことをコード上で強制できません。

2 つ目の理由は `catch` で捉えた例外が常に `unknown` 型であるため、型安全性が保証されない点です。これは TypeScript ではどのような型であっても `throw` できてしまうことが原因です。コード上で `throw` されるものが `Error` オブジェクトのインスタンスであることは保証できないのです。

このような例外を投げることによるエラーハンドリングの問題を解決するために、いくつかの手法が提案されていました。その中でも特に有名だと思われるのが、`Result` 型を使ったアプローチです。Result 型は成功を表す型と失敗を表す型のユニオン型となっています。以下は簡易的なコード例です。

```ts
type Success<T> = { type: "success"; value: T };
type Failure<E> = { type: "failure"; error: E };
type Result<T, E> = Success<T> | Failure<E>;
```

Result 型の利点はエラー処理を忘れることがない点です。型ガードにより成功時の処理に絞り込まない限り値を取り出せないため、条件分岐を書くことが強制されます。また `Failure` 型についても例外を投げていた場合と異なり、型安全性が保証されます。

```ts
const getUser = async (id: number): Promise<Result<User, Error>> => {
  const data = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);

  if (!data.ok) {
    return { type: "failure", error: new Error("Failed to fetch user") };
  }

  const user = (await data.json()) as User;

  return { type: "success", value: user };
};

getUser(1).then((result) => {
  // この時点での result の型は Result<User, Error> となっているので、.value で値を取り出すことができない
  result;
  if (result.type === "success") {
    console.log(result.value);
  } else {
    console.error(result.error);
  }
});
```

ただし、`Result` 型を使ったアプローチも完全とは言えません。Scala や Rust のように言語仕様として `Result` 型が導入されているわけではないため、その他のライブラリや言語の標準機能との組み合わせが難しい点があります。いくら自身のコードは `Result` 型を使って丁寧なエラーハンドリングをしていても、その他のライブラリが例外を投げてくると破綻してしまいます。結局は外部のコードとの組み合わせの関係で `try/catch` や `.catch` を使わざるを得ない場面が出てくるため、完全なエラーハンドリングを実現することは難しいのです。

また `match` や `fold` といった機能も TypeScript の `Result` 型には存在しないため、Scala や Rust のようにパターンマッチングを使ったエラーハンドリングを実現することはできず、どうしてもコードが冗長になってしまいます。

### Effect-TS を使った API 通信の例

ここまでは TypeScript のみを使ったアプローチによる問題点や解決策について見てきました。続いて Effect-TS を導入したアプローチを見ていきます。Effect-TS で HTTP リクエストを行う処理は `@effect/platform` というパッケージに実装が分けられています。また、Node.js 環境で実行する場合 `@effect/platform-node` パッケージもインストールします。

```sh
npm install @effect/platform @effect/platform-node
```

コード例は以下のようになります。

```ts
import { NodeRuntime } from "@effect/platform-node";
import { HttpClientError } from "@effect/platform/Http/ClientError";
import * as Http from "@effect/platform/HttpClient";
import { Console, Effect } from "effect";

type User = {
  id: number;
  name: string;
};

const getUser = (id: number): Effect.Effect<unknown, HttpClientError> => {
  return Http.request
    .get(`https://jsonplaceholder.typicode.com/users/${id}`)
    .pipe(Http.client.fetchOK, Http.response.json);
};

NodeRuntime.runMain(
  getUser(1).pipe(Effect.andThen((user) => Console.log(user))),
);
```

Effect-TS では `Effect` という型を使って処理を表現します。`Effect` 型は引数の 1 つ目に成功を表す型（ここでは一旦 `User` 型ではなく `unknown` 型を使っています）を、2 つ目に失敗を表す型（`HttpClientError`）を指定します。さらに 3 つ目の型引数としてコンテキストデータを指定できます。

成功と失敗を表す型を併せ持つ点は、先に述べた `Result` 型とよく似ています。Effect-TS はこの `Effect` 型を使って同期処理・非同期処理・並行処理・リソース管理をモデル化します。`Effect` 型はイミュータブル（不変）であり、すべての関数は新しい Effect を作成します。

成功した場合の処理は `Effect.success()` で、失敗した場合の処理は `Effect.failure()` で表現できます。

```ts
import { Effect } from "effect";

const divide = (a: number, b: number): Effect.Effect<number, Error> =>
  b === 0
    ? Effect.fail(new Error("Cannot divide by zero"))
    : Effect.succeed(a / b);
```

ここで API リクエストのために使用している `Http.request.get` メソッドは `Effect` 型を返す関数です。

```ts
const getUser = (id: number): Effect.Effect<unknown, HttpClientError> => {
  return Http.request
    .get(`https://jsonplaceholder.typicode.com/users/${id}`)
    .pipe(Http.client.fetchOK, Http.response.json);
};
```

`Http.request.get()` 関数の結果は `.pipe()` メソッドに渡されています。`.pipe()` メソッドを使用することにより、モジュール化され逐次的な方法でデータの操作と変換を行うことができます。`.pipe()` メソッドは、`Effect` 型の値を受け取り、新しい `Effect` 型の値を返す関数です。好きな数だけ処理をチェーンできます。これはパイプライン処理として知られています。

このパイプラインではステータスコードによりデータのエラーハンドリング処理と、JSON へのパース処理が行われています。

`Http.request.get()` メソッドは `fetch` API と同じく、 2xx 以下のステータスコードが返ってきた場合でもデフォルトではエラーとして扱いません。`.pipe()` メソッドに `Http.client.fetchOk` を渡すことにより、ステータスコードが 200 番台の場合のみ次の処理に進み、それ以外の場合には `HTTPClientError` が返し処理を中断するようになります。

`Http.response.json` メソッドは、`fetch` API の `response.json()` メソッドと同じように JSON データをパースします。パイプラインとして構築されているため、`Http.client.fetchOk` の処理で成功した場合のみこの処理が実行されます。

パイプライン処理は拡張が容易であり、新しい処理を追加したり拡張するのも簡単です。例として、レスポンスのスキーマを検証する処理を追加してみましょう。`@effect/schema` パッケージをインストールします。

```sh
npm install @effect/schema
```

`@effect/schema@` は `tsconfig.json` の `exactOptionalPropertyTypes` フラグを有効にするとより適した型を扱えます。

```json:tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "exactOptionalPropertyTypes": true
  }
}
```

続いて以下のように `User` スキーマを定義します。

```ts
import { Schema } from "@effect/schema";

const UserSchema = Schema.Struct({
  id: Schema.Number,
  name: Schema.String,
});

type User = Schema.Type<typeof UserSchema>;
```

そして、`Http.response.json` の代わりに `Http.response.schemaBodyJson` メソッドを使ってスキーマ検証を行います。このメソッドの引数には先程定義した `UserSchema` を渡します。レスポンスの JSON の構造が `UserSchema` と一致しない場合、`ParseError` が返され処理が中断されます。

```ts
const getUser = (
  id: number,
): Effect.Effect<User, HttpClientError | ParseError> => {
  return Http.request
    .get(`https://jsonplaceholder.typicode.com/users/${id}`)
    .pipe(
      Http.client.fetchOk,
      Effect.andThen(Http.response.schemaBodyJson(UserSchema)),
      Effect.scoped,
    );
};
```

スキーマの検証を行ったことにより、正常系では `User` 型の値が返されることが保証されます。これにより、`getUser` 関数の戻り値の型で `unknown` から `User` に変更できます。

### Effect を実行する

作成した `Effect` を実行するためにはランタイムが必要です。`Runtime<R>` 型は Effect を実行できるランタイムを表します。`Effect` を実行するためにいくつかのユティリティ関数が提供されています。これらの関数はデフォルトのランタイムを使用します。多くの場合にはデフォルトのランタイムを使用すれば十分です。

- `Effect.runSync`
- `Effect.runSyncExit`
- `Effect.runPromise`
- `Effect.runPromiseExit`
- `Effect.runFork`

`Effect.runSync` `Effect<A, E>` を受け取り `A` を返す関数です。同期的に `Effect` を実行するため、即座に値が返却されます。

```ts
import { Effect, Runtime } from "effect";

const program = Effect.log("Application started!");

Effect.runSync(program);
// timestamp=2024-04-29T09:36:34.919Z level=INFO fiber=#0 message="Application started!"

// 下記と同等
Runtime.runSync(Runtime.default)(program);
```

Effect-TS では `platform-browser`, `platform-node`, `platform-bun` のように、それぞれの実行環境に応じたランタイムシステムが提供されています。ここでは Node.js 環境で実行しているため、`@effect/platform-node` パッケージを使用します。

```ts
NodeRuntime.runMain(
  getUser(1).pipe(Effect.andThen((user) => Console.log(user))),
);
```

`NodeRuntime.runMain` 関数は、`Effect` を実行するためのエントリーポイントです。`getUser(1)` の結果の `Effect` を `.pipe` メソッドで `Console.log` に渡しています（`Console.log` もまた `Effect` を返す関数です）。

このアプリケーションを実行すると、ユーザー情報がコンソールに表示されます。

```sh
{ id: 1, name: 'Leanne Graham' }
```

また、URL を存在しないものに変更してみると、`HttpClientError` が発生し、エラーメッセージが表示されます。

```ts
timestamp=2024-04-29T09:47:44.978Z level=ERROR fiber=#0 cause="ResponseError: StatusCode error (404 GET https://jsonplaceholder.typicode.com/unknown): non 2xx status code
```

### より優れたエラーハンドリング

現状のコードでも概ね問題なく動作しますが、`Effect.andThen` の引数の型が `unknown` となっているという問題があります。またエラーは自動でキャッチされているものの、処理が不明瞭であるため好ましくないでしょう。ここでは `Effect.gen()` 関数を使用して、[ジェネレーター](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) を使ったより効果的な処理を記述します。

まずは基本的な `Effect.gen()` の使い方を見てみましょう。

```ts
const program = Effect.gen(function* () {
  const user = yield* getUser(1);
  yield* Console.log(user);
});

NodeRuntime.runMain(program);
```

`Effect.gen()` にはジェネレーター関数を渡します。ジェネレーター関数内では `yield*` を使って `Effect` を実行します。ジェネレーター関数内で `Effect` を実行することで、非同期処理を逐次的に記述することができます。

ジェネレーター関数を使用したコードは `async/await` によるフローとよく似ています。`yield*` は `await` に相当し、`getUser(1)` 関数の実行が完了するまで待機します。続いて `Console.log(user)` が実行されます。

`yield* getUser(1)` の結果は `User` 型となっています。`getUser()` 関数でエラーが返された場合にはそこで実行が中断されるため、エラーが発生した場合の型が存在しないのです。

エラーをキャッチして処理を行う場合には、`Effect.Either` を使います。`Either` は `Left` と `Right` の 2 つの値を持つデータ型です。習慣として、`Left` はエラーを表し、`Right` は成功を表します。

`Either.isLeft` 関数を使うことで、`Either` 型の値が `Left` かどうかを判定できます。`Effect.isLeft` で絞り込まれたブロックは失敗した場合の処理となります。

```ts
import { Console, Effect, Either } from "effect";

const program = Effect.gen(function* () {
  const failureOrSuccess = yield* Effect.either(getUser(1));

  if (Either.isLeft(failureOrSuccess)) {
    yield* Console.error(failureOrSuccess.left);
  } else {
    yield* Console.log(failureOrSuccess.right);
  }
});
```

エラーの場合には `HTTPClientError` だけでなく、`ParseError` などのエラーも発生する可能性があるため、それぞれで分岐した処理を書きたいことでしょう。その場合には、`_tag` プロパティを使ってエラーの種類を判定します。

```ts
import { Console, Effect, Either } from "effect";

const program = Effect.gen(function* () {
  const failureOrSuccess = yield* Effect.either(getUser(1));

  if (Either.isLeft(failureOrSuccess)) {
    const error = failureOrSuccess.left;

    if (error._tag === "RequestError" || error._tag === "ResponseError") {
      yield* Console.error(`Http Error: ${error.error}`);
    } else if (error._tag === "ParseError") {
      yield* Console.error(`Parse Error: ${error.error}`);
    }
  } else {
    yield* Console.log(failureOrSuccess.right);
  }
});
```

`Either.match` 関数を使用するとより簡潔なコードを書くことができます。この関数は成功した場合と失敗した場合のコールバック関数を受け取ります。

```ts
import { Console, Effect, Either } from "effect";

const program = Effect.gen(function* () {
  const failureOrSuccess = yield* Effect.either(getUser(1));

  yield* Either.match(failureOrSuccess, {
    onLeft: function* (error) {
      if (error._tag === "RequestError" || error._tag === "ResponseError") {
        yield* Console.error(`Http Error: ${error.error}`);
      } else if (error._tag === "ParseError") {
        yield* Console.error(`Parse Error: ${error.error}`);
      }
    },
    onRight: function* (user) {
      yield* Console.log(user);
    },
  });
});
```

この記事で紹介した Effect-TS 機能のほんの一部にすぎません。興味を持った方はぜひ公式ドキュメントを参照してください。

https://effect.website/

## まとめ

- Effect-TS は、TypeScript の型システムを活用してエラーや非同期処理をより安全に扱うためのライブラリ
- Effect-TS は Effect System という概念を取り入れており、Scala や Haskell に影響を受けている
- TypeScript の言語仕様として備わっている `throw` によるエラーハンドリングは安全とは言い難い
- Effect-TS は `Effect` 型を使ってエラーや非同期処理をモデル化する。成功を表す型、失敗を表す型、コンテキストデータを型引数として指定する
- `Effect` 関数の結果は `.pipe()` メソッドに渡され、モジュール化され逐次的な方法でデータの操作と変換を行うことができる
- `Effect` を実行するためにはランタイムが必要で、`Effect.runSync` `Effect.runPromise` などの関数が提供されている
- `Effect.gen()` 関数を使うことでジェネレーターを使った処理を記述できる

## 参考

- [Effect – The best way to build robust apps in TypeScript](https://effect.website/)
- [effect/packages/platform at main · Effect-TS/effect](https://github.com/Effect-TS/effect/tree/main/packages/platform#http-client)
- [effect/packages/schema at main · Effect-TS/effect](https://github.com/Effect-TS/effect/tree/main/packages/schema)
