---
id: 55BBFuys9ZkddolY3fleLZ
title: "フロントエンドのテストのモックには msw を使うのが最近の流行りらしい"
slug: "using-msw-to-mock-front-end-tests-seems-to-be-the-latest-trend."
about: "最近のテスト手法として API コールをモックする際に Jest ではなく [Mock Service Worker](https://mswjs.io/) (以下 `msw` ）を使用する手法が注目されています。実施にどのように使用されているのか見ていきましょう。"
createdAt: "2022-01-09T00:00+09:00"
updatedAt: "2022-01-09T00:00+09:00"
tags: ["Vue.js", "Jest", "msw"]
published: true
---
皆様フロントエンドのテストを書いていらっしゃしますでしょうか？

フロントエンドのテストを書くときには API コールする処理を全てモックする必要があります。外部の API をコールする処理をテストに含めると API サーバーが落ちているなどの外部の要因によってテストが失敗してしまう可能性がありますし、テストを実行するたびに実際に API をコールしてしまうとサーバーに負荷がかかってしまうなど外部に対しても悪影響を与えてしまいます。

さて、従来のモックする手段としては [Jest](https://jestjs.io/) のモックを利用して `axios` や `fetch` などのモジュールをモック化する手法がよく使われていたかと思います。

最近のテスト手法として API コールをモックする際に Jest ではなく [Mock Service Worker](https://mswjs.io/) (以下 `msw` ）を使用する手法が注目されています。実施にどのように使用されているのか見ていきましょう。

## msw とは

msw とはフロントエンドの開発時に主に利用されるモックサーバーです。実際にローカルホストでモック用のサーバーを起動するのではなく、サービスワーカーレベルでリクエストをインターセプトしてリクエストを返却するという特徴があります。

https://mswjs.io/

モックハンドラーの実装も `Express` 風に書くことができるのでとっつきやすいかと思います。

## メリット

Jest のモックを使用する手法と比較した時のメリットを見てみましょう。

- テスト以外の箇所でも横断でモックを再利用できる
- モックのレイヤーがより低レイヤーになる

### テスト以外の箇所でも横断でモックを再利用できる

Jest の `mock()` や `spyOn()` などのメソッドは当然ですがテスト以外の場所で再利用をすることはできません。

msw を使用する場合には一度 `handlers` を定義すればローカル開発・Storybook・テストなどのあらゆる場所ででインポートしてモックの実装を使いまわすことができます。

例えば、Storybook では msw を使用するためのアドオンが公開されていたりします。

https://storybook.js.org/addons/msw-storybook-addon/

### モックのレイヤーがより低レイヤーになる

テストを書く時にベストプラクティスとして「できる限りモックを使用しない」という観点があります。モックを多く使用すると、テストの信頼性が損なわれるためです。

例えば、あるモジュール A がモジュール B に依存しており、 モジュール B をモックしたテストを記述しているとしましょう。始めてテストを記述するタイミングではモジュール B の実装にできる限り沿ったモックを作成することでしょう。

しかし、後々モジュール A に対して改修が入った際にモジュール B にバグが入り込んだり、インターフェイスが変更されるかもしれません。そのような状態になったとしたらモジュール B に依存しているモジュール B は本来壊れてしまうはずですがモジュール B のモックの実装が変わらなければテストが失敗することはありません。

その結果、テストが成功しているのにも関わらず実際に動かしてみるとバグは発生しているという状況に陥る可能性があります。（バグが発生するのは本番環境かもしれません！）

「できる限りモックを使用しない」ようにするためにはモックのレイヤーをより低レイヤーにすることが鍵になります。

例として、あるコンポーネントが `useFetch` というモジュールに依存しており、さらに `useFetch` は `axios` に依存しているという状況を想定しましょう。

- components/UserList.vue

```vue
<script setup lang="ts">
import useFetch from '@/composables/useFetch'

const { isLoading, data: users } = useFetch('/api/users)

</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <ul v-else>
    <li v-for="user in users" :key="user.id">...</li>
  </ul>
</template>
```

- composables/useFetch.ts

```ts
import axios from 'axios'

const useFetch = async (url: string) => {
  const { data } = await axios.get(url)
  // ...
}

export default useFetch
```

この時コンポーネントをテストする際に `useFetch` をモック化した場合には `useFetch` と `axios` 2つのモジュールの実装がテストに含まれません。

ここで、代わりに `axios` もモック化するとテストに含まれない実装は `axios` だけに抑えることができます。

さらに、msw を使用した場合にはネットワークレベルでモック化されるので `axios` の実装までもテスト対象に含まれせることができます。

## デメリット

一方で msw を使用することで以下のようなデメリットも考えられます。

- テストの実行に必要な依存が増える
- 引数などの検査が面倒

### テストの実行に必要な依存が増える

単純に Jest でモック化けしていた場合にはテスト時に依存するモジュールは Jest だけですが、msw を使用すると依存関係が増えることになります。

### 引数などの検査が面倒

Jest でモック化した場合には `toHaveBeenCalledWith` でどのような引数(クエリパラメータなどを想定）でモック化した関数が呼ばれたのかをテストできたり、 `toHaveBeenCalledTimes` でモック化した関数が何回呼び出されたのかをテストすることができます。

msw ではそのようなそのような機能はデフォルトでは備わっていないので API をコールした際のクエリパラメータや API がコールした回数をテストしたいような場合には少々不向きです。

ただし、機能の実際の振る舞いをベースにテストを記述しているような場合には大きな問題にはならないでしょう。

## 実際のコード例

### 依存パッケージのインストール

それでは実際に msw を使用したテストを書いていきましょう。プロジェクトを作成して、依存パッケージをインストールします。

```
npm init vue
Need to install the following packages:
  create-vue
Ok to proceed? (y) 

Vue.js - The Progressive JavaScript Framework

✔ Project name: … vue-project
✔ Add TypeScript? … No / Yes
✔ Add JSX Support? … No / Yes
✔ Add Vue Router for Single Page Application development? … No / Yes
✔ Add Pinia for state management? … No / Yes
✔ Add Cypress for testing? … No / Yes
✔ Add ESLint for code quality? … No / Yes
✔ Add Prettier for code formatting? … No / Yes
```

```
npm install @vueuse/core
npm --save-dev install jest @types/jest ts-jest vue-jest@next @testing-library/vue@next msw whatwg-fetch @testing-library/jest-dom
```

- jest.config.cjs

```js
module.exports = {
  moduleFileExtensions: ["js", "ts", "json", "vue"],
  transform: {
    "^.+\\.ts$": "ts-jest",
    "^.+\\.vue$": "vue-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

```

- ts.config.json

```json
{
  "compilerOptions": {
    ...
    "types": ["@types/jest"],
    ...
  },
  ...
}
```

- package.json

```json
{
  ...
  "scripts": {
    ...
    "test": "jest"
  },
  ...
}
```

### モックサーバーの作成

続いて msw によるモックサーバーを作成しましょう。`src/mocks` ディレクトリを作成します。

```sh
mkdir src/mocks
```

続いてモックの実装を記述するファイルを作成します。1つのファイルにまとめて記述してもよいのですが、後々 API のエンドポイントが増えた時に肥大化するのを防ぐためにエンドポイントごとにファイルを作成してモックの実装を行うようにします。

例えば `/api/users` に対するモックを実装する際には `src/mocks/api/users.ts` ファイルを作成して、リクエストメソッドごとに実装記述していきます。

- src/mocks/api/users.ts

```ts
import { ResponseResolver, MockedRequest, restContext } from "msw";

const get: ResponseResolver<MockedRequest, typeof restContext> = (
  req,
  res,
  ctx
) => {
  return res(
    ctx.status(200),
    ctx.json([
      {
        id: 1,
        name: "John",
      },
      {
        id: 2,
        name: "Alice",
      },
      {
        id: 3,
        name: "Bob",
      },
    ])
  );
};

export default { get };
```

作成したモックの実装は `src/mocks/handlers` にまとめてリクエストパスに紐付けるようにします。

- src/mocks/handlers.ts

```ts
import { rest } from "msw";
import users from "@/mocks/api/users";

const const handlers = [rest.get("/api/users", users.get)];
```

さらに、ブラウザ・Nodejsそれぞれの環境でサービスワーカーをスタートするためのファイルを作成します。テストで使用するのは　Nodejs 向けのコードです。

- src/mocks/browser.ts

```ts
import { setupWorker } from "msw";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);
```

- src/mocks/server.ts

```ts
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);
```

### テスト対象のコンポーネントの作成

簡単にテスト対象のコンポーネントを作成します。[VueUse](https://vueuse.org/) の提供する　[useFetch](https://vueuse.org/core/useFetch/) 関数を利用してユーザーの一覧を API から取得します。

コンポーネントの仕様は以下の通りです。
- API のコールが完了するまでの間は「Loading...」と表示する
- API のコールが正常に完了したらリスト形式で取得したユーザー一覧を表示する
- API のコールに失敗したら「Something went wrong...」と表示する

- src/components/UserList.vue

```vue
<script setup lang="ts">
import { useFetch } from "@vueuse/core";
import { watch } from "vue";

interface User {
  id: number;
  name: string;
}

const {
  isFetching,
  error,
  data: users,
} = useFetch<User[]>("/api/users").json();
</script>

<template>
  <div v-if="isFetching">Loading...</div>
  <div v-else-if="error">Something went wrong...</div>
  <ul v-else>
    <li v-for="user in users" :key="user.id" data-testid="user">
      {{ user.name }}
    </li>
  </ul>
</template>

```

### テストコードの作成

それでは準備が完了したのでテストコードを作成していきましょう。`src/components/__tests__/UserList.spec.ts` ファイルを作成します。

- src/components/__tests__/UserList.spec.ts

```ts
import UserList from "../UserList.vue";
import { server } from "@/mocks/server";
import "whatwg-fetch";

describe("UserList.vue", () => {
    // Establish API mocking before all tests.
    beforeAll(() => server.listen());
    // Reset any request handlers that we may add during the tests,
    // so they don't affect other tests.
    afterEach(() => server.resetHandlers());
    // Clean up after the tests are finished.
    afterAll(() => server.close());

    test("...");
});

```

作成したモックサーバーを `src/mocks/server` からインポートして使用します。`beforeAll()` で全てのテストの開始前にモックサーバーをスタートし `afterAll()` で全てのテストが完了したあとにモックサーバーをクローズするようにします。

さらに、個々のテストが干渉し合わないように `afterEach` で各テストが終了するごとにモックサーバーの状態をリセットします。

また、テストを実行する Node.js の環境には `fetch` が存在しないのでfetchのPolyfillが必要です。そのため `whatwg-fetch` をインポートしています。

まずはローディングが表示されるかどうかをテストしましょう。

```ts
import { render } from "@testing-library/vue";
import "@testing-library/jest-dom";

describe("UserList.vue", () => {
  // ...
    test("API コールが完了するまではローディングが表示されユーザー一覧が表示されない", async () => {
      const { findByText, queryAllByTestId } = render(UserList);

      expect(await findByText("Loading...")).toBeInTheDocument();
      expect(queryAllByTestId("user")).toHaveLength(0);
    });
  });
});
```

`findByText` で「Loading...」という文字が表示されるかどうかをテストしています。

続いて API コールが正常に完了するケースです。

```ts
    test("API コールが完了したらローディングの表示はなくなりユーザー名の一覧が表示される", async () => {
      const { findByText, queryByText, findAllByTestId } = render(UserList);

      expect(await findAllByTestId("user")).toHaveLength(3);
      expect(await findByText("John")).toBeInTheDocument();
      expect(queryByText("Loading...")).not.toBeInTheDocument();
    });
```

モックサーバーの実装ではユーザーを3人返すように実装したので `<li>` タグが3つ表示されていることを確認しています。ユーザー名が表示されていることと、「Loading...」がもはや表示されなくなることも確認しておきましょう。

`testing-liblary` では実際に要素が表示されるまで（APIコールが完了するまで）を `await` で待機することができます。

上記のテストのようにモックサーバーを作成してしまえば、それ以外のモック戦略を考えなくてよいのでテストの記述がスッキリして本来書きたいことに集中することができます。

続いて異常系のテストも記述しましょう。

```ts
import { msw } from "msw"

// ...

  test("API コールが失敗したらエラーメッセージが表示される", async () => {
    server.use(
      rest.get("/api/users", (req, res, ctx) => {
        return res.once(
          ctx.status(500),
          ctx.json({ message: "Internal Server Error" })
        );
      })
    );

    const { findByText, queryByText } = render(UserList);

    expect(await findByText("Something went wrong...")).toBeInTheDocument();
    expect(queryByText("Loading...")).not.toBeInTheDocument();
  });
```

インポートしたモックサーバーでは常に正常レスポンスを返却するので [server.use()](https://mswjs.io/docs/api/setup-server/use) を使ってリクエストハンドラーを上書きする必要があります。

リクエストハンドラーの上書きがそのテストのときだけ上書きされるようにするためにはレスポンスを返却するときに `res.once()` を使うようにします。

https://mswjs.io/docs/api/setup-server/use#one-time-override

## 終わりに

テストコードで msw を使用するメリット・デメリットと実際のコード例を書きました。

モックの実装は一度書けばあらゆる場所で使用できるので、モックの書き方に気を取られなくてよくなるのでいいですね。

実際のコード例は以下でも記載しているのでご参照ください。

https://github.com/azukiazusa1/msw-testing-sample

