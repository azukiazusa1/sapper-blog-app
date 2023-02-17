---
id: 7E8bLyCzCNmLnK9pWTMOxq
title: "msw でリクエストを検証する方法"
slug: "msw-request-assertions"
about: "msw 使ってテストを記述した時期待したリクエストが送信されているのか検査したくなるかもしれません。リクエストを検証する方法と、それを回避する方法を紹介します。"
createdAt: "2022-03-13T00:00+09:00"
updatedAt: "2022-03-13T00:00+09:00"
tags: ["msw", "Jest", "Vue.js"]
published: true
---
[msw](https://mswjs.io/) を使ってテストを記述した時期待したリクエストが送信されているのか検査したくなるかもしれません。

例えば

- 特定の API がコールされている
- 期待したクエリパラメータ or リクエストボディ or ヘッダーでリクエストが送信された
- リクエストが n 回送信された

具体例として、下記のような検索フォームを考えてみましょう。`input` に `"test"` と入力しボタンをクリックすると `q=test` をクエリパラメータに付与し、何も入力されていないのであればクエリパラメータを付与せずに全件取得するという例を考えてみましょう。

```vue
<script lang="ts" setup>
import { ref, computed } from "vue";

interface User {
  id: number;
  name: string;
}

const users = ref<User[]>([]);
const query = ref("");

const url = computed(() => {
  if (query.value) {
    return `/users?q=${query.value}`;
  } else {
    return "/users";
  }
});

const fetchUsers = async () => {
  const response = await fetch(url.value);
  const data = await response.json();
  users.value = data;
};
</script>

<template>
  <form @submit.prevent>
    <label for="query">Search</label>
    <input type="text" id="query" v-model="query" />
    <button type="submit" @click="fetchUsers">Fetch</button>
    <ul>
      <li v-for="user in users" :key="user.id">
        {{ user.name }}
      </li>
    </ul>
  </form>
</template>

```

この時、おそらく `input` になにか入力した場合と入力していない場合の2つのパターンでそれぞれリクエストにクエリパラメータが付与されているかどうか確認したいと思うことでしょう。

しかし、通常 msw をテストで使用した場合例えば `fetch` をスパイ引数を検査するといった方法は使用できません。

```js
jest.spyOn(global, "fetch")

test('input に入力していない場合', () => {
  // ..
  fetch.toHaveBeenCalledWith('/api/users')
})

test('input "Alice" と入力した場合', () => {
  // ..
  fetch.toHaveBeenCalledWith('/api/users?q=Alice')
})
```

msw を使用してでリクエストを検査したい場合には以下のような方法が考えられます。

1. `server.use 内に `jest.fn` を仕込む
2. ライフサイクルイベントを利用する

## `server.use` 内に `jest.fn` を仕込む

1つの方法は以下の記事において紹介されています。

https://zenn.dev/takepepe/articles/jest-msw-mocking

`server.use` で既存のハンドラーを上書きしてハンドラー内で `jest.fn()` で生成したモック関数を検査したい項目を引数に呼び出すことで `fetch` をスパイする方法のように検査することができます。

```ts
import UserList from "./UserList.vue";
import { server } from "@/mocks/server";
import { fireEvent, render } from "@testing-library/vue";
import { rest } from "msw";
import "@testing-library/jest-dom";
import "whatwg-fetch";

describe("UserList.vue", () => {
  const mockFn = jest.fn();
  beforeEach(() => {
    server.use(
      rest.get("/api/users", (req, res, ctx) => {
        const target = req.url.searchParams.get("q"); // クエリパラメータを取得する
        mockFn(target); // クエリパラメータを引数にモック関数を呼び出す
        return res(ctx.json([]));
      })
    );
  });

  beforeAll(() => server.listen());

  afterEach(() => {
    server.resetHandlers();
    mockFn.mockClear();
  });

  afterAll(() => server.close());

  test("input に入力せずにボタンをクリックした場合クエリパラメータが付与されない", async () => {
    const { getByText } = render(UserList);
    const button = getByText("Fetch");

    await fireEvent.click(button);

    expect(mockFn).toHaveBeenCalledWith(null);
  });

  test('input に "Alice" と入力してボタンをクリックした場合 ?q=Alice がリクエストに付与される', async () => {
    const { getByText, getByLabelText } = render(UserList);
    const button = getByText("Fetch");
    const input = getByLabelText("Search");

    await fireEvent.update(input, "Alice");
    await fireEvent.click(button);

    expect(mockFn).toHaveBeenCalledWith("Alice");
  });
});
```

この方法は簡単に実施できることがメリットです。`toHaveBeenCalledWith()` のように従来の方法と同じ方式で検査を書けるのでわかりやすいでしょう。

## ライフサイクルイベントを利用する

2つ目の方法は msw の[ライフサイクルイベント](https://mswjs.io/docs/extensions/life-cycle-events)を利用する方法です。ライフサイクルイベントはリクエストが送信された時やレスポンスが返された時などをフックすることができます。

ライフサイクルイベントを以下のように利用することでリクエストを検査することができます。

```ts
import { MockedRequest, DefaultRequestBody, matchRequestUrl } from "msw";
import { server } from "./server";

export const waitForRequest = (method: string, url: string) => {
  let requestId = "";
  return new Promise<MockedRequest<DefaultRequestBody>>((resolve, reject) => {
    server.events.on("request:start", (req) => {
      const matchesMethod = req.method.toLowerCase() === method.toLowerCase();
      const matchesUrl = matchRequestUrl(req.url, url).matches;
      if (matchesMethod && matchesUrl) {
        requestId = req.id;
      }
    });
    server.events.on("request:match", (req) => {
      if (req.id === requestId) {
        resolve(req);
      }
    });
    server.events.on("request:unhandled", (req) => {
      if (req.id === requestId) {
        reject(
          new Error(`The ${req.method} ${req.url.href} request was unhandled.`)
        );
      }
    });
  });
};
```

https://mswjs.io/docs/extensions/life-cycle-events#asserting-request-payload

`waitForRequest` 関数はリクエストメソッドとパスを引数に受け取りリクエストが送信されるまで `Promise` を pending します。

リクエストが送信されると [request:start](https://mswjs.io/docs/extensions/life-cycle-events#requeststart) が呼ばれます。このイベントのコールバックではリクエストメソッドとパスが一致しているかどうか確認し、一致した場合 `requestId` を保持しておきます。

[request:match](https://mswjs.io/docs/extensions/life-cycle-events#requestmatch) リクエストメソッドとパスにハンドラーが存在する場合に呼ばれます。ここで `requestId` が一致した場合 `Promosise` を解決し受け取った `req` オブジェクトを返却します。

[request:unhandled](https://mswjs.io/docs/extensions/life-cycle-events#requestunhandled) リクエストメソッドとパスに対応するハンドラーが存在しない場合に呼ばれます。ここでは `requestId` が一致した場合 `Promosise` を拒絶します。

`waitForRequest` 関数はテストで次のように使用します。

```ts
import UserList from "./UserList.vue";
import { server } from "@/mocks/server";
import { fireEvent, render } from "@testing-library/vue";
import "@testing-library/jest-dom";
import "whatwg-fetch";
import { waitForRequest } from "@/mocks/waitForRequest";

describe("UserList.vue", () => {
  beforeAll(() => server.listen());

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => server.close());

  test("input に入力せずにボタンをクリックした場合クエリパラメータが付与されない", async () => {
    const { getByText } = render(UserList);
    // /api/users に対応するリクエストを監視する
    const pendingRequest = waitForRequest("GET", "/api/users");

    const button = getByText("Fetch");
    await fireEvent.click(button);

    // リクエストが到達するまで待機して、リクエストを取得する
    const request = await pendingRequest;
    expect(request.url.searchParams.get("q")).toBeNull();
  });

  test('input に "Alice" と入力してボタンをクリックした場合 ?q=Alice がリクエストに付与される', async () => {
    const { getByText, getByLabelText } = render(UserList);
    const pendingRequest = waitForRequest("GET", "/api/users");

    const button = getByText("Fetch");
    const input = getByLabelText("Search");

    await fireEvent.update(input, "Alice");
    await fireEvent.click(button);

    const request = await pendingRequest;
    expect(request.url.searchParams.get("q")).toBe("Alice");
  });
});
```

各テストの始めに `waitForRequest("GET", "/api/users")` で `/api/user` に対する `GET` リクエストを待機します。ボタンクリックにより `fetch` リクエストが送信された後 `await pendingRequest` によりリクエストが到達するまで待機して、リクエストを取得します。

取得したリクエストに対して `expect` で検査を記述できます。

このライフサイクルを利用する利点として、テストごとに `server.use` でハンドラーを記述する必要がないという点があります。

## リクエストの詳細をテストせずにアプリケーションの仕様をテストする

ここまで msw のハンドラーに対するリクエストを取得して検証する方法を紹介しましたが、これは実装の詳細のテストとなり推奨されません。このようなテストは「仕様は変わっていないのに実装が変わったら失敗してしまう脆いテスト」になる危機　があります。

リクエストに対してどのようなデータ送信されたか検査する代わりに、レスポンスの結果アプリケーションにどのような変化が行われるのかを検査するテストがより好ましいです。そのようなテストの書き方を見ていきましょう。

始めに msw のリクエストハンドラーを次のように修正します。

```ts
import { ResponseResolver, MockedRequest, restContext } from "msw";

const get: ResponseResolver<MockedRequest, typeof restContext> = (
  req,
  res,
  ctx
) => {
  let users = [
    { id: 1, name: "John" },
    { id: 2, name: "Alice" },
    { id: 3, name: "Bob" },
  ];

  const q = req.url.searchParams.get("q");
  if (q) {
    users = users.filter((user) => user.name.includes(q));
  }

  return res(ctx.status(200), ctx.json(users));
};

export default { get };

```

クエリパラメータに `q` が存在する場合にはユーザー一覧をフィルタリングして返し、存在しない場合にはそのまま返します。このようにモックの中にロジックを含めることでリクエストによってレスポンスが変化することを模倣します。

テストコードは次のように表示されるユーザーの一覧の数が変化することで正しいリクエストが送信されていることを検証します。

```ts
import UserList from "./UserList.vue";
import { server } from "@/mocks/server";
import { fireEvent, render, waitFor } from "@testing-library/vue";
import "@testing-library/jest-dom";
import "whatwg-fetch";

describe("UserList.vue", () => {
  beforeAll(() => server.listen());

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => server.close());

  test("input に入力せずにボタンをクリックした場合すべてのユーザーを取得する", async () => {
    const { getByText, getAllByRole } = render(UserList);

    const button = getByText("Fetch");
    await fireEvent.click(button);

    await waitFor(() => {
      const users = getAllByRole("listitem");
      expect(users).toHaveLength(3);
    });
  });

  test('input に "Alice" と入力してボタンをクリックした場合ユーザー名が "Alice" のユーザーのみ取得する', async () => {
    const { getByText, getByLabelText, getAllByRole } = render(UserList);

    const button = getByText("Fetch");
    const input = getByLabelText("Search");

    await fireEvent.update(input, "Alice");
    await fireEvent.click(button);

    await waitFor(() => {
      const users = getAllByRole("listitem");
      expect(users).toHaveLength(1);
      expect(users[0]).toHaveTextContent("Alice");
    });
  });
});
```

## まとめ

msw をテストで使用した際にリクエストを検証する方法を紹介しましたが、基本的にこの手法のテストは多用せずにアプリケーションの仕様をテストする方針するのがよいでしょう。

リクエストの検証は、例えばポーリング処理など見た目は変化しないけれど API がコールされていることを検証したい時のように特別な場合のみ用いるのがよいでしょう。

今回記載したコードは以下をご参照ください。

https://github.com/azukiazusa1/msw-request-assertions-sample
