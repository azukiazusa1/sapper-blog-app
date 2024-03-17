---
id: 4mKnhw2VkQHchTrPQTiWE
title: "Storybook v8 の React Server Components サポート"
slug: "storybook-v8-react-server-components"
about: "Storybook v8 では `experimentalNextRSC` オプションにより React Server Components をサポートしています。しかし、このオプションは React Server Components としての動作を再現しているわけではありません。サーバーサイドで Storybook が動作してるわけではなく、非同期コンポーネントをクライアントでレンダリングしているに過ぎないことに留意すべきです。"
createdAt: "2023-12-09T18:17+09:00"
updatedAt: "2023-12-09T18:17+09:00"
tags: ["storybook", "React", "React Server Components", "Next.js"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1KsxS6Ik4SjTKxllnuDYes/942fa2154243b3890c8e99e47e927cae/fireplace_renga_danro_illust_4172.png"
  title: "レンガの暖炉のイラスト"
selfAssessment: null
published: true
---
Storybook v8 より、`experimentalNextRSC` というオプションが追加されました。このオプションは `true` に設定することで、実験的に React Server Components をサポートします。

## Storybook v8 での React Server Components サポートを試す

実際に Storybook v8 における React Server Components のサポートを試してみます。以下のコマンドで Storybook をインストールします。

```bash
npx storybook@v8.0.0-alpha.1 init
```

`.storybook/main.ts` に `features.experimentalNextRSC: true` を追加します。

```ts
import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  features: {
    experimentalNextRSC: true,
  },
};
export default config;
```

Storybook に表示するためのコンポーネントを作成しましょう。TODO のリストを API から取得して表示する簡単なコンポーネントです。

```tsx:app/TodoList/TodoList.tsx
export async function TodoList() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos");
  const todoList = (await res.json()) as { id: number; title: string }[];

  if (todoList.length === 0) {
    return <p>There are no todos</p>;
  }

  return (
    <ul>
      {todoList.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
```

`TodoList` コンポーネントを Storybook に表示するためのストーリーを作成します。`TodoList` コンポーネントでは `fetch` API により外部の API からデータを取得しているため、サーバーのレスポンスをモックする必要があります。

サーバーをモックするために [msw](https://mswjs.io/) を使用します。`msw` をインストールしましょう。

```bash
npm install msw@1 --save-dev
```

なお、Storybook において `msw` を使用する場合には [msw-storybook-addon](https://storybook.js.org/addons/msw-storybook-addon) がよく使われていますが、現時点では正しく動作しないため、`msw` を直接使用します。また、`msw` の v2 では `Cannot find module ‘msw/node’` というエラーが発生するため、v1 を使用します。

```tsx:app/TodoList/TodoList.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { TodoList } from "./TodoList";

const server = setupServer();

const meta = {
  component: TodoList,
  tags: ["autodocs"],
  decorators: [
    (Story) => {
      server.listen();
      return <Story />;
    },
  ],
} satisfies Meta<typeof TodoList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => {
      server.use(
        rest.get(
          "https://jsonplaceholder.typicode.com/todos",
          (req, res, ctx) => {
            return res(
              ctx.json([
                { id: 1, title: "Do the dishes" },
                { id: 2, title: "Take out the trash" },
              ])
            );
          }
        )
      );
      return <Story />;
    },
  ],
};

export const Empty: Story = {
  decorators: [
    (Story) => {
      server.use(
        rest.get(
          "https://jsonplaceholder.typicode.com/todos",
          (req, res, ctx) => {
            return res(ctx.json([]));
          }
        )
      );
      return <Story />;
    },
  ],
};
```

以下のように、TodoList コンポーネントが Storybook に表示されることを確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/4kKoLwQRC5BfkhlmbAIFle/ab533a080bd1d1897be590c79ede42f2/__________2023-12-09_19.36.55.png)

## どのように動いているのか

Storybook は基本的にブラウザで動くはずなのですが、なぜサーバーサイドでのみ動作する React Server Components が動いているのでしょうか？

`experimentalNextRSC` オプションによる React Server Components のサポートは実際にサーバーサイドで動作しているわけではなく、`<Suspense>` でコンポーネントをラップすることで動かしているようです。

```ts
export default {
  component: MyServerComponent,
  decorators: [(Story) => <Suspense><Story /><Suspense />]
}
```

そのため、例えば `fs.readFile` などのサーバーサイドでのみ動作する API をコンポーネント内で使用している場合には、Storybook での表示時にエラーが発生します。

```sh
(0 , fs__WEBPACK_IMPORTED_MODULE_2__.readFile) is not a function
```

完全に React Server Components の動作を再現しているわけではなく、非同期コンポーネントをクライアントコンポーネントとしてレンダリングしているに過ぎない、ということに留意する必要があるでしょう。

またクライアントの非同期コンポーネントは、将来動作が変更される可能性があります。

> We strongly considered supporting not only async Server Components, but async Client Components, too. It's technically possible, but there are enough pitfalls and caveats involved that, as of now, we aren't comfortable with the pattern as a general recommendation. The plan is to implement support for async Client Components in the runtime, but log a warning during development. The documentation will also discourage their use.

[Why can't Client Components be async functions?](https://github.com/acdlite/rfcs/blob/first-class-promises/text/0000-first-class-support-for-promises.md#why-cant-client-components-be-async-functions)

このように現時点では動作が不安定であると考えられるため、Container/Presenter パターンを使用してデータ取得処理と表示処理を分離するなど、別の方法を検討することをおすすめします。

## まとめ

- Storybook v8 では `experimentalNextRSC` オプションにより React Server Components をサポートしている
- 実際には `<Suspense>` でコンポーネントをラップすることで動作している。そのため React Server Components としての動作を再現してるとは言えず、単に非同期コンポーネントをクライアントコンポーネントとしてレンダリングしているに過ぎない
- まだ `experimentalNextRSC` オプションによる React Server Components のサポートは実験的なものであり、動作が不安定であるため、べつの方法を検討することをおすすめする

## 参考

- [NextJS: Add experimental RSC support by shilman · Pull Request #25091 · storybookjs/storybook](https://github.com/storybookjs/storybook/pull/25091)
- [\[Feature Request\]: Support React Server Components (RSC) · Issue #21540 · storybookjs/storybook](https://github.com/storybookjs/storybook/issues/21540)
