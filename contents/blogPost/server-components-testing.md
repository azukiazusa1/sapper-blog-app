---
id: 9v9fGv_kT5zN14cBSa4PQ
title: "React Server Components のテスト手法"
slug: "server-components-testing"
about: "現代におけるコンポーネントのテストは Testing Library を用いてテストを行うことが一般的です。しかし、2023 年　11 月現在、Testing Library はまだ Server Components のテストを十分にサポートしていません。そのため、Server Components のテストを行うには、別の方法を用いる必要があります。この記事では、Testing Library を用いずに Server Components のテストを行う方法について説明します。"
createdAt: "2023-11-26T14:21+09:00"
updatedAt: "2023-11-26T14:21+09:00"
tags: ["Next.js", "React", "playwright", "テスト"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/7tWQTtv8kLxXKOQz2ZW3uH/7ee0bb4945c1c5efb95a314685cf5552/kinoko_autumn_onpu_8930.png"
  title: "キノコと音楽のイラスト"
published: true
---
現代では React におけるコンポーネントのテストは [Testing Library](https://testing-library.com/) を用いて、ユーザーの視点からテストを行うことが一般的です。`getByRole` のようなユーザーの視点のセレクタなどを提供しているため、実装の詳細に立ち入らずにテストを書けることが特徴です。

しかし、Server Components においては、2023 年　11 月現在、Testing Library はまだ Server Components のテストを十分にサポートしていません。そのため、Server Components のテストを行うには、別の方法を用いる必要があります。

https://github.com/testing-library/react-testing-library/issues/1209

この記事では、Testing Library を用いずに Server Components のテストを行う方法について説明します。

## Server Components のテストにおける課題

Testing Library による Server Components のテストは全く動作しないというわけではありません。次のように、`fetchArticles()` 関数で記事のデータを取得して表示するコンポーネントを例としてあげます。

```tsx:app/ArticleList.tsx
import { Article, fetchArticles } from "./lib/articles";

export const ArticleList = async () => {
  const articles = await fetchArticles();

  if (!articles) {
    return <p>No articles.</p>;
  }

  return (
    <ul>
      {articles.map((article) => (
        <ArticleItem key={article.id} article={article} />
      ))}
    </ul>
  );
};

const ArticleItem = ({ article }: { article: Article }) => {
  return (
    <li>
      <h2>{article.title}</h2>
      <p>{article.body}</p>
    </li>
  );
};
```

通常の React のコンポーネントのテストであれば、Testing Library の `render()` 関数を用いてコンポーネントをレンダリングし、`screen.getByXXX()` などのセレクタを用いて要素を取得することでコンポーネントのテストを行うことができます。

```tsx:app/ArticleList.test.tsx
import { render, screen } from "@testing-library/react";
import { ArticleList } from "./ArticleList";
import { describe, it, expect } from "vitest";

describe("ArticleList", () => {
  it("should render a list of articles", () => {
    // このテストは動作しない!
    render(<ArticleList />);

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });
});
```

しかし、Server Components を対する上記のテストは動作しません。これは `<ArticleList>` コンポーネントが `Promise` を返すためです。React Server Component の強力な点の 1 つとして、サーバーサイドであるならば `async` キーワードを用いて非同期コンポーネントとして扱える点なのですが、この挙動をまだ Testing Library はサポートしていないのです。

```sh
 FAIL  app/ArticleList.spec.tsx
  ArticleList
    ✕ should render a list of articles (34 ms)

  ● ArticleList › should render a list of articles

    Objects are not valid as a React child (found: [object Promise]). If you meant to render a collection of children, use an array instead.

      4 | describe("ArticleList", () => {
      5 |   it("should render a list of articles", () => {
    > 6 |     render(<ArticleList />);
        |           ^
      7 |
      8 |     expect(screen.getAllByRole("list")).toHaveLength(2);
      9 |   });
```

Server Components を Testing Library でテストするための対処療法として、Server Components を単なる関数として実行する方法があります。以下のコード例をご覧ください。`await ArticleList()` で 1 度関数として実行し、その結果を `render()` 関数に渡すことで、Server Components のテストを行えます。

```tsx:app/ArticleList.test.tsx
import { render, screen } from "@testing-library/react";
import { ArticleList } from "./ArticleList";
import { describe, it, expect } from "vitest";

describe("ArticleList", () => {
  it("should render a list of articles", async () => {
    const result = await ArticleList();

    render(result);

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });
});
```

しかし、この方法にはいくつかの問題点が存在します。1 つ目の問題点は、`async` コンポーネントがネストしたときに動作しなくなるということです。今日のコンポーネントの設計では、親コンポーネントですべてのデータをあらかじめ取得しておいて子コンポーネントに渡すという設計は見直されており、子コンポーネントは自身でデータを取得するように設計され、データが必要な場所で `fetch()` を行うようになってきています。

後から子コンポーネントで `fetch()` が必要になる場面はよくある出来事であり、このとき `async` コンポーネントがネストしてしまうようになってしまいます。そのため、コンポーネントのテストが意図せずに動作しなくなるおそれがあるという問題が発生することになります。

具体例を見てみましょう。`<ArticleList>` コンポーネントの中で `<ArticleItem>` コンポーネントをレンダリングしています。この `<ArticleItem>` コンポーネントの中で、`<Author>` コンポーネントを表示するように変更してみましょう。`<Author>` コンポーネントでは `article` に含まれる `userId` から作者のデータを取得して表示するようになっています。

```tsx:app/ArticleList.tsx{10, 15-19}
import { Article, fetchArticles, fetchAuthor } from "./lib/articles";

// ...

const ArticleItem = ({ article }: { article: Article }) => {
  return (
    <li>
      <h2>{article.title}</h2>
      <p>{article.body}</p>
      <Author userId={article.userId} />
    </li>
  );
};

const Author = async ({ userId }: { userId: number }) => {
  const author = await fetchAuthor(userId);

  return <p>{author.name}</p>;
};
```

この変更を加えた後に先程のテストを再度実行すると、テスト対象の実装を変更していないにも関わらず、テストが失敗してしまっていることがわかります。

```sh
  console.error
    Error: Uncaught [Error: Objects are not valid as a React child (found: [object Promise]). If you meant to render a collection of children, use an array instead.]
    ...
```

またこのような方法はライブラリの正統な使い方ではないため、将来的に動作しなくなる可能性があります。そのため、この方法はあくまで一時的な対処療法として用いるべきです。次の章からは、Server Components のテストを行うための以下の 2 つ方法について説明します。

- Container/Presentational Components パターン
- Playwright による E2E レベルのテスト

## Container/Presentational Components パターン

Container/Presentational Components パターンは、React のコンポーネントを 2 つのカテゴリに分けるパターンです。Container Components はデータの取得や更新などのロジックを担当し、Presentational Components はデータの表示を担当します。このパターンは、React に限らず、UI コンポーネントを設計する際によく用いられるパターンです。

つまり、先程まで非同期コンポーネントとして扱っていた `<ArticleList>` コンポーネントを単に `articles` を Props として受け取って表示する Presentational Components に変更することで、Testing Library としてテストを行うことができるようになります。

このパターンを用いる利点として、Storybook などテスト以外の用途についても親和性が高い点があげられます。Storybook の Testing Library と同様に現時点では Server Components の描画をサポートしていないのですが、表示の部分を Presentational Components に切り出すことで、Storybook での描画の確認も従来と変わらずに行うことができます。

`async` コンポーネントのネストに対応した Container/Presentational Components パターンのテストは Quramy さんの記事に詳しく書かれており、参考にさせていただきました。

https://quramy.medium.com/react-server-component-%E3%81%AE%E3%83%86%E3%82%B9%E3%83%88%E3%81%A8-container-presentation-separation-7da455d66576

実際の例で試してみましょう。まずは `<ArticleList>` コンポーネントを Container Components と Presentational Components に分割します。Container Components は `fetchArticles()` 関数を呼び出して `articles` を取得し、Presentational Components に `articles` を Props として渡します。

```tsx:app/ArticleList.tsx
import { Article, fetchArticles, fetchAuthor } from "./lib/articles";

export const ArticleListContainer = async () => {
  const articles = await fetchArticles();

  return <ArticleListPresentation articles={articles} />;
};

const ArticleListPresentation = ({ articles }: { articles: Article[] }) => {
  if (articles.length === 0) {
    return <p>No articles.</p>;
  }

  return (
    <ul>
      {articles.map((article) => (
        <ArticleItem key={article.id} article={article} />
      ))}
    </ul>
  );
};
```

`<ArticleListPresentation>` コンポーネントはもはや非同期コンポーネントではなくなり、Server Components としても Client Components としても扱えるようになりました。そのため、Testing Library を用いてテストを行うことができます。

```tsx:app/ArticleList.test.tsx
import { ArticleListPresentation } from "./ArticleList2";
import { Article } from "./lib/articles";
import { render, screen } from "@testing-library/react";

describe("ArticleListPresentation", () => {
  const articles: Article[] = [
    {
      id: 1,
      title: "title1",
      body: "body1",
      userId: 1,
    },
    {
      id: 2,
      title: "title2",
      body: "body2",
      userId: 2,
    },
  ];

  it("should render a list of articles", () => {
    render(<ArticleListPresentation articles={articles} />);

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("should render no articles message if articles is empty", () => {
    render(<ArticleListPresentation articles={[]} />);

    expect(screen.getByText("No articles.")).toBeInTheDocument();
  });
});
```

Container 側のテストは、通常の非同期関数をテストするのと同じ要領でテストを行えます。下記の例では `msw` による API のモックを行い、`fetchArticles()` 関数で正しく記事の一覧が取得できているかをテストしています。

```tsx:app/ArticleList.test.tsx
import { ArticleListContainer } from "./ArticleList2";
import { setupServer } from "msw/node";
import { HttpResponse, http } from "msw";
import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";

const server = setupServer(
  http.get("http://localhost:8080/api/articles", () => {
    return HttpResponse.json([
      {
        id: 1,
        title: "title1",
        body: "body1",
        userId: 1,
      },
      {
        id: 2,
        title: "title2",
        body: "body2",
        userId: 2,
      },
    ]);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("ArticleListContainer", () => {
  it("should fetch articles", async () => {
    const { type, props } = await ArticleListContainer();

    expect(props.articles).toHaveLength(2);
    expect(type).toBe(ArticleListPresentation);
  });
});
```

先程の TestingLibrary でテストしていた例と同じく、非同期コンポーネントをネストさせるために `<Author>` コンポーネントを表示変更を行ってみましょう。単に `<Author>` コンポーネントを表示するだけですと、やはりテストが失敗してしまいます。

そこで、`<ArticlePresentation>` コンポーネントでは、`<Author>` コンポーネントを React Node の Props として渡すように修正を行います。

```tsx:app/ArticleList.tsx
export const ArticleListPresentation = ({
  articles,
}: {
  articles: (Article & { Author: React.ReactNode })[];
}) => {
  if (articles.length === 0) {
    return <p>No articles.</p>;
  }

  return (
    <ul>
      {articles.map((article) => (
        <ArticleItem key={article.id} article={article} />
      ))}
    </ul>
  );
};

const ArticleItem = ({
  article,
}: {
  article: Article & { Author: React.ReactNode };
}) => {
  return (
    <li>
      <h2>{article.title}</h2>
      <p>{article.body}</p>
      {article.Author}
    </li>
  );
};
```

`<Author>` コンポーネントは、`ArticleListContainer` で渡されるようになります。

```tsx:app/ArticleList.tsx

export const ArticleListContainer = async () => {
  const articles = await fetchArticles();

  return (
    <ArticleListPresentation
      articles={articles.map((article) => ({
        ...article,
        Author: <Author userId={article.userId} />,
      }))}
    />
  );
};
```

この変更により、`<ArticleListPresentation>` コンポーネントに関しては、自身と子孫コンポーネントを含めてすべてのコンポーネントが非同期コンポーネントではなくなったので、Testing Library や Storybook を用いて描画を確認できるようになりました。

Server Components を既存の React のエコシステムと統合して使用した場合には、このような Container/Presentational Components パターンを用いて Server Components として振る舞う箇所と描画を担当する箇所で切り分けて考える必要があるでしょう。近い将来にエコシステムが Server Components に対応していけば、このようなパターンは不要になるかもしれません。

## Playwright による E2E レベルのテスト

2 つ目の方法は、現在 Next.js により experimental な機能として提供されている [Playwright](https://playwright.dev/) サポートによるテストです。この方法は Playwright による E2E レベルのテストを実行することで、Server Components が Client Components かの実装の詳細を気にせずにテストを実行できるという利点があります。

https://github.com/vercel/next.js/tree/canary/packages/next/src/experimental/testmode/playwright

ただし、ページ全体を描画する必要がある、ブラウザを起動して描画するといった E2E テストの特性上、テストの実行速度が遅くなるというデメリットがあります。

実際のコード例を見てみましょう。ますは `playwright` と `msw` をインストールします。

```sh
npm i -D @playwright/test msw
```

`package.json` に `test:e2e` スクリプトを追加します。

```json:package.json
{
  "scripts": {
    "test:e2e": "playwright test"
  }
}
```

`playwright.config.ts` ファイルを以下のように作成します。

```ts:playwright.config.ts
import { defineConfig } from 'next/experimental/testmode/playwright'

export default defineConfig({
  webServer: {
    command: 'npm run dev -- --experimental-test-proxy',
    url: 'http://localhost:3000',
  },
})
```

テストコードを作成しましょう。`next/experimental/testmode/playwright` というモジュールからテストに必要な関数を import します。`test` 関数の第 2 引数のコールバック関数の引数として、`next` プロパティが渡されるのが特徴です。この `next` には `msw` との統合機能が備わっており、`next.onFetch` 関数により API のモックを行うことができます。

```tsx:app/ArticleList.test.tsx
import { test } from "next/experimental/testmode/playwright";

test("should render a list of articles", async ({ page, next }) => {
  next.onFetch((request) => {
    if (request.url === "http://localhost:8080/articles") {
      return new Response(
        JSON.stringify([
          {
            id: 1,
            title: "title1",
            body: "body1",
            userId: 1,
          },
          {
            id: 2,
            title: "title2",
            body: "body2",
            userId: 2,
          },
        ])
      );
    }

    if (request.url === "http://localhost:8080/users/:userId") {
      return new Response(
        JSON.stringify({
          id: 1,
          name: "name1",
        })
      );
    }
  });

  await page.goto("/");
  expect(page.getByRole("listitem")).toHaveLength(2);
});
```

または、`next` を使用せずに `next/experimental/testmode/playwright/msw` モジュールから `test` 関数を import することで、`msw` の API を使用して　API のモックを行えます。`next` をコールバック関数の引数として受け取るかわりに、`msw` という引数を受け取るようになります。

```tsx:app/ArticleList.test.ts
import {
  test,
  http,
  HttpResponse,
} from "next/experimental/testmode/playwright/msw";

test.use({
  mswHandlers: [
    http.get("http://localhost:8080/articles", () => {
      return HttpResponse.json([
        {
          id: 1,
          title: "title1",
          body: "body1",
          userId: 1,
        },
        {
          id: 2,
          title: "title2",
          body: "body2",
          userId: 2,
        },
      ]);
    }),
    http.get("http://localhost:8080/users/*", () => {
      return HttpResponse.json({
        id: 1,
        name: "name1",
      });
    }),
  ],
});

test(`show "no articles" when there are no articles`, async ({ page, msw }) => {
  msw.use(
    http.get("http://localhost:8080/articles", () => {
      return HttpResponse.json([]);
    })
  );

  await page.goto("/");
  expect(page.getByRole("listitem")).toHaveLength(2);
});
```

## まとめ

- React Server Components は現在 Testing Library によるテストをサポートしていない
- Container/Presentational Components パターンを用いることで、非同期でデータを取得する処理と描画を担当する処理を分離してテストを行うことができる。この方法は、Storybook などのテスト以外の用途にも親和性が高い
- Playwright による E2E レベルのテストを行うことで、Server Components が Client Components かの実装の詳細を気にせずにテストを実行できる

## 参考

- [Next.js App Router での MPA フロントエンド刷新 - Speaker Deck](https://speakerdeck.com/mugi_uno/next-dot-js-app-router-deno-mpa-hurontoendoshua-xin)
- [React Server Component のテストと Container / Presentation Separation | by Yosuke Kurami | Medium](https://quramy.medium.com/react-server-component-%E3%81%AE%E3%83%86%E3%82%B9%E3%83%88%E3%81%A8-container-presentation-separation-7da455d66576)
