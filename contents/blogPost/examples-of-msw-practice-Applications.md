---
id: 5v8Y64R9XV7V3q7zmuzvfx
title: "MSW の実践活用例"
slug: "examples-of-msw-practice-Applications"
about: "msw の実践で活用する例を紹介します"
createdAt: "2022-07-17T00:00+09:00"
updatedAt: "2022-07-10T00:00+09:00"
tags: ["msw"]
published: true
---
## `handlers.ts` にモックの実装を書かない

Mock Service Worker を始める場合、`src/mocks/handlers.ts` にリクエストハンドラを格納するモジュールを作成されるかと思います。しかし、1つのファイル内ですべての API のモックを実装しようとすると、すぐにファイルが肥大化してしまいます。

実際のモックの実装は `src/mocks/resolvers` 配下に REST API のリソースごとにファイルを配置し、`src/mocks/handler.ts` ではどのリクエストをどのハンドラに対応させるかの記述をするのがよい感じです。

```
src/mocks/
├── browser.ts
├── handler.ts
├── resolvers
│   ├── login.ts
│   ├── logout.ts
│   ├── posts.ts
│   └── users.ts
└── server.ts
```

`src/mocks/resolvers/posts.ts` の実装例としては以下のようになります。`get`、`post` のように対応するリクエストメソッドごとにハンドラを作成し、1つにまとめて `export default` しています。`ResponseResolver<RestRequest<never, PathParams<string>>, RestContext>` は Rest API のリクエストハンドラの型定義です。

```ts
import { PathParams, ResponseResolver, RestContext, RestRequest } from 'msw'

const get: ResponseResolver<RestRequest<never, PathParams<string>>, RestContext> = (req, res, ctx) => {
}

const getById: ResponseResolver<RestRequest<never, PathParams<string>>, RestContext> = (req, res, ctx) => {
}

const post: ResponseResolver<RestRequest<never, PathParams<string>>, RestContext> = (req, res, ctx) => {
}

const put: ResponseResolver<RestRequest<never, PathParams<string>>, RestContext> = (req, res, ctx) => {
}

const del: ResponseResolver<RestRequest<never, PathParams<string>>, RestContext> = (req, res, ctx) => {
}

const mockPosts = {
  get,
  getById,
  post,
  put,
  del
}

export default mockPosts
```

`src/mocks/handlers.ts` では以下のように、リクエストメソッドとパスを結びつけます。

```ts
import { rest } from 'msw'
import mockLogin from './resolvers/login'
import mockLogout from './resolvers/logout'
import mockPosts from './resolvers/posts'
import mockUsers from './resolvers/users'

export const handlers = [
  rest.get('/api/posts', mockPosts.get),
  rest.get('/api/posts/:id', mockPosts.getById),
  rest.post('/api/posts', mockPosts.post),
  rest.put('/api/posts/:id', mockPosts.put),
  rest.delete('/api/posts/:id', mockPosts.del),

  rest.post('/api/login', mockLogin.post),
  rest.post('/api/logout', mockLogout.post),

  rest.get('/api/users', mockUsers.get),
]
```

`handlers` 内の記述はリクエストの対応を記述することに集中できるので、かなりスッキリさせることができます。また、リクエストハンドラの実装を分離したので、リクエストハンドラの部分のみを他の箇所で使い回すことも可能です。

## baseURL を高階関数で実装する

msw では例えば axios のように `baseURL` を設定する機能が備えられておりません。すべてのハンドラの定義に際して絶対パスで記述するのは退屈な作業でありますので、公式で高階関数を利用して `baseURL` を設定する方法が推奨されています。

> It's officially recommended to create a custom high-order function if you wish to reuse the same base path for multiple handlers. Like so:
> 
> ```ts
> const github = (path) => {
>   return new URL(path, 'https://github.com').toString()
> }
> 
> rest.get(github('/repos/:owner/:repo'), resolver)
> ```

https://github.com/mswjs/msw/issues/397#issuecomment-751230924

## モックの実装に型制約を設ける

モックの実装でレスポンスを返す際には、実際の API のレスポンスの型定義を利用して型制約を設けることをおすすめします。実際の API と同じ形式で返されることを保証できますし、将来 API のレスポンスの型定義が変更になった際にも、型エラーが検出されることで修正漏れを防ぐことができます。

JSON レスポンスを返却する `ctx.json()` メソッドは型引数を受け取ることができます。`ctx.json()` の引数が型引数と一致しない場合には、型エラーが発生します。

```ts
import { PathParams, ResponseResolver, RestContext, RestRequest } from 'msw'
import { Post } from '../../services/posts'

const dummyPosts: Post[] = [
  // ..
]

const get: ResponseResolver<RestRequest<never, PathParams<string>>, RestContext> = (req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.json<Post[]>(dummyPosts) // `dummyPosts` が `Post[]` 型に適合しない場合、型エラーとなる
  )
}
```

## テストのセットアップで API モッキングを設定する

個別のテストファイル中ではなく、セットアップの中で API モッキングを設定することを推奨します。そうすれば、テストコード中ではモックの設定を行う必要がないため、テストの重要な部分の記述に集中することができます。

テストのセットアップには　Jest の設定の [setupFilesAfterEnv](https://jestjs.io/docs/configuration) を利用します。`src/setupTests.ts` ファイルを作成して次のように記述します。

```ts
import { server } from './mocks/server';
// Establish API mocking before all tests.
beforeAll(() => server.listen())
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())
// Clean up after the tests are finished.
afterAll(() => server.close())
```

その後、`jest.config.js` にセットアップファイルの配置場所を指定します。

```js
// jest.config.js
module.exports = {
  setupFilesAfterEnv: ['./src/setupTests'],
}
```

これにより、各テストファイルではモックサーバを起動するコードを書く必要がありません。さらに、後述のようにモックの実装を詳細を行っている場合には、モックサーバを呼び出すのは 500 エラーのような異常系の検証のみで済むことでしょう。

## できるだけ詳細にハンドラを実装する

モックハンドラの実装をする際には、できる限り実際の API のロジックに合わせて実装することを推奨します。具体的には、ただ単にモックデータをレスポンスとして返却するのではなく、リクエストパラメータによって返却するデータをフィルタリングしたり、データが存在しない場合にはエラーレスポンスを返却するようにします。

これはアプリケーションの振る舞いをテストすることを推進します。どのようなリクエストが送信されたとしても、毎回同じモックデータを返している場合、外部のふるまい（返却されたレスポンス）から正しいリクエストパラメータを送信できているかどうかを確認することができません。そのため、リクエストパラメータを検証するための「スパイ」を用意してクエリ文字列を検証する仕組みが必要となります。しかし、このようなアサーションを追加することは実装の詳細なテストとなってしまいます。

リクエストに対してどのようなデータ送信されたか検査する代わりに、レスポンスの結果アプリケーションにどのような変化が行われるのかアプリケーションの仕様を検査するテストがより好ましいです。実際にどのように記述するのか見ていきましょう。

`src/mocks/resolvers/posts.ts` の `get` 関数は記事一覧取得 API のリゾルバです。この API はクエリパラメータ `q` を受け取り文字列でタイトルを絞り込む仕様を持つこととします。その場合、リゾルバの実装は次のようになります。

```ts
const get: ResponseResolver<RestRequest<never, PathParams<string>>, RestContext> = (req, res, ctx) => {
  // `req.url.searchParams` からクエリパラメータを取得
  const query = req.url.searchParams.get('q') || ''

  // クエリパラメータ `q` でフィルタリングする
  const filterdPosts = dummyPosts.filter(post => {
    if (!query) return true
    return post.title.includes(query)
  })

  return res(
    ctx.status(200),
    // フィルタリングされたデータを返す
    ctx.json<Post[]>(filterdPosts)
  )
}
```

続いて記事一覧取得 API を利用してテストを記述しましょう。テスト対象のコンポーネントは次のような実装となっています。フォームをサブミットした時に、検索フォームで入力した文字列で記事一覧を取得する簡単な画面です。

```tsx
import { useState } from "react";
import { findPosts, Post } from "../services/posts";

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchPosts = async () => {
    setPosts([])
    setLoading(true);
    setError(false);
    try {
      const data = await findPosts({ q: query });
      setPosts(data);
    } catch (error) {
      setError(true);
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Posts</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchPosts();
        }}
      >
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={fetchPosts}>Search</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>Error</p>}
      {posts.length <= 0 && <p>No posts found</p>}
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <a href={`/posts/${post.id}`}>{post.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Posts;
```

テストコードは以下のように記述できます。

```tsx
import { findByText, fireEvent, render, screen } from "@testing-library/react";
import Posts from "./Posts";

describe("components/Posts/Posts", () => {
  test("input に入力せずにボタンをクリックした場合すべての記事を取得する", async () => {
    render(<Posts />);

    const button = screen.getByRole("button", { name: "Search" });
    await fireEvent.click(button);

    const posts = await screen.findAllByRole("listitem");
    expect(posts).toHaveLength(3);
  });

  test("input に入力してボタンをクリックした場合検索結果の記事を取得する", async () => {
    render(<Posts />);

    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "React" } });

    const button = screen.getByRole("button", { name: "Search" });
    await fireEvent.click(button);

    const posts = await screen.findAllByRole("listitem");
    expect(posts).toHaveLength(1);
  });

  test("検索結果が0件の場合はNo posts foundを表示する", async () => {
    render(<Posts />);

    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "hoge" } });

    const button = screen.getByRole("button", { name: "Search" });
    await fireEvent.click(button);

    expect(await screen.findByText("No posts found")).toBeInTheDocument();
  });
});
```

1つ目のテストケースは検索フォームに何も入力せずに、記事を取得するケースです。クエリパラーメーターが送信されていないはずですので、すべての記事を取得できていることを期待してリスト項目が3つ存在することを検証しています。

2つ目のテストケースは検索フォームに「React」と入力して記事を取得するケースです。モックデータの中で記事のタイトル中に「React」が含まれているのは1件だけですので、クエリパラメーターが正しく送信されていることを検証するためには、リスト項目が1つ存在することを検証すればよいわけです。

3つ目のテストでは、記事が1件も取得できなかった場合に「No posts found」が表示されるかどうかを検証しています。このケースに置いても、`server.use` でモックの実装を差し替えることなく、1件も引っかからないような文字列を送信することで検証をすることができます。

## エラーを返す高階関数を利用する

テストを記述していると、異常系の 500 エラーをモックサーバーに差し込みたいというケースが多く存在します。

```tsx
test('記事の取得に失敗した場合は"Error"を表示する', async () => {
  server.use(
    rest.get("/api/posts", (req, res, ctx) => {
      return res(
        ctx.status(500),
        ctx.json({
          error: "Internal Server Error",
          code: 500,
        })
      );
    })
  );
  render(<Posts />);

  const button = screen.getByRole("button", { name: "Search" });
  await fireEvent.click(button);

  expect(await screen.findByText("Error")).toBeInTheDocument();
});
```

このような単純なエラーを返すレスポンスはよく使われるので、高階関数として定義しておくと便利です。

```ts
// src/mocks/helpers.ts

import { PathParams, ResponseResolver, RestContext, RestRequest } from 'msw'

type ErrorResolverArgs = {
  status?: number;
  message?: string;
  code?: number
}

export const errorResolver = ({
  status = 500,
  message = 'Internal Server Error',
  code = 500
}: ErrorResolverArgs = {}): ResponseResolver<RestRequest<never, PathParams<string>>, RestContext> => (req, res, ctx) => {
  return res(ctx.status(status),
    ctx.json({
      message,
      code
    })
  )
}
```

この関数は次のように利用します。

```tsx
test('記事の取得に失敗した場合は"Error"を表示する', async () => {
  server.use(rest.get("/api/posts", errorResolver()));

  render(<Posts />);

  const input = screen.getByRole("searchbox");
  fireEvent.change(input, { target: { value: "hoge" } });

  const button = screen.getByRole("button", { name: "Search" });
  await fireEvent.click(button);

  expect(await screen.findByText("Error")).toBeInTheDocument();
});
```

## `createResponseComposition` で `res` をカスタマイズする

`createResponseComposition` 関数を使うことで、カスタムレスポンスを作成することができます。例えば、以下のようにテスト環境以外の場合のみ delay させるレスポンスを作成します。

```ts
import { createResponseComposition, context } from 'msw'

export const delayedResponse = createResponseComposition(undefined, [
  context.delay(process.env.NODE_ENV === 'test' ? 0 : 1000),
])
```

`delayedResponse` はリゾルバの引数で受け取る `res` の代わりに利用できます。

```ts
const get: ResponseResolver<RestRequest<never, PathParams<string>>, RestContext> = (req, _res, ctx) => {
  const query = req.url.searchParams.get('q') || ''
  const filterdPosts = dummyPosts.filter(post => {
    if (!query) return true
    return post.title.includes(query)
  })

  return delayedResponse(
    ctx.status(200),
    ctx.json<Post[]>(filterdPosts)
  )
}
```

