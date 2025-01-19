---
id: RiRjuBiq5QrhhwSqp-XjL
title: "React の `<ViewTransition>` コンポーネントで宣言的にページ遷移アニメーションを追加する"
slug: "declarative-page-transition-animation-with-react-viewtransition-component"
about: "`<ViewTransition>` コンポーネントは React の実験的なバージョンとして導入されました。これは View Transition API を 宣言的な方法で使用できるようにするものです。"
createdAt: "2025-01-19T12:50+09:00"
updatedAt: "2025-01-19T12:50+09:00"
tags: ["React"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4LXuBOcOcy8qk7llZURFa3/f31fcdaa3a5f0ea1bb84c9267e2e5eaa/sobauchi_illust_3930-768x768.png"
  title: "sobauchi illust 3930-768x768"
selfAssessment:
  quizzes:
    - question: "`<ViewTransition>` コンポーネントを使用した場合、直近の子コンポーネントに対して何が追加されるか？"
      answers:
        - text: "`view-transition-name` CSS プロパティ"
          correct: true
          explanation: null
        - text: "`view-transition-id` CSS プロパティ"
          correct: false
          explanation: null
        - text: "`viewtransitionname` HTML 属性"
          correct: false
          explanation: null
        - text: "`.view-transition` CSS クラス"
          correct: false
          explanation: null
published: true
---
!> `<ViewTransition>` コンポーネントは 2025 年 1 月現在実験的な機能です。将来にわたって API が変更される可能性があります。

React の実験的なバージョンとして `<ViewTransition>` コンポーネントが導入されました。これは [View Transition API](https://developer.mozilla.org/ja/docs/Web/API/View_Transition_API) を宣言的な方法で使用できるようにするものです。

View Transition API はページを遷移する際に簡単にアニメーションを追加できる API です。単一ページアプリケーション（SPA）においては `document.startViewTransition()` メソッドを DOM が変更される前に呼び出すことでページ遷移アニメーションを追加できます。`<ViewTransition>` コンポーネントを使用はこの API を React で使用するための方法です。

b> view-transitions

`<ViewTransition>` コンポーネントを使用することでブラウザの標準的な機能を使用してページ遷移アニメーションを追加できるという利点があります。

## `<ViewTransition>` コンポーネントの使用

`<ViewTransition>` コンポーネントは React の実験的な機能であるため、`react@experimental` パッケージをインストールする必要があります。`package.json` に以下のように記述します。

```json
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  }
}
```

Next.js を使用している場合には `15.2.0-canary.6` 以降のバージョンが必要です。さらに `next.config.js` に以下の設定を追加します。

```js:next.config.js
const nextConfig = {
    experimental: {
        viewTransition: true,
    },
}
```

さらに `ViewTransition` は不安定な API であるため、`unstable_ViewTransition` という名前で import する必要があります。

```jsx
import { unstable_ViewTransition as ViewTransition } from "react";
```

基本的な使用方法は、以下のように条件により出し分けられるコンポーネントを `<ViewTransition>` コンポーネントでラップすることです。

```jsx
<ViewTransition>{condition ? <ComponentA /> : <ComponentB />}</ViewTransition>
```

`<ViewTransition>` コンポーネントは直近の子コンポーネントに対してランダムな値で `view-transition-name` CSS プロパティを追加します。View Transition API では前後の DOM ノードで同じ `view-transition-name` が設定されている場合にアニメーションが適用されるます。

View Transition API によるアニメーションを適用する場合には `condition` の変更を `startTransition` 関数でラップする必要があります。

```jsx
import { useState, unstable_startTransition as startTransition } from "react";

export function App() {
  const [page, setPage] = useState("A");

  const changePage = (newPage: string) => {
    startTransition(() => {
      setPage(newPage);
    });
  };

  return (
    <>
      <button onClick={() => changePage("A")}>A</button>
      <button onClick={() => changePage("B")}>B</button>
      <ViewTransition>{page === "A" ? <PageA /> : <PageB />}</ViewTransition>
    </>
  );
}
```

実際に試してみると、ページ遷移時にアニメーションが適用されることがわかります。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/66ewC0rq2SaM7GF1XyBued/6ceadeaee4bb18ef9afddb6f562ffcaa/_____2025-01-19_13.07.13.mov" controls></video>

## 適用するアニメーションをカスタマイズする

View Transition API はデフォルトでフェードイン/フェードアウトのアニメーションが適用されます。アニメーションをカスタマイズする場合には `::view-transition-old`, `::view-transition-new` という疑似要素を使用できます。それぞれページ遷移前の古いページ、ページ遷移後の新しいページに対して適用される疑似クラスです。

```css
@keyframes slide-in {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slide-out {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}

::view-transition-old(foo) {
  animation: slide-out 0.3s ease-out;
}

::view-transition-new(foo) {
  animation: slide-in 0.3s ease-out;
}
```

`::view-transition-old`, `::view-transition-new` にはそれぞれセレクター（ここでは `foo`）を指定します。このセレクターに指定する値は `transition-name` と一致する必要があります。`<ViewTransition>` コンポーネントをデフォルトで使用する場合にはランダムな `transition-name` が設定されるためこの CSS で対象を特定できません。

`<ViewTransition>` コンポーネントに `name` Props を指定することで子コンポーネントに対して固定の `transition-name` を設定できます。

```jsx
<ViewTransition name="foo">
  {page === "A" ? <PageA /> : <PageB />}
</ViewTransition>
```

これにより `::view-transition-old(foo)`, `::view-transition-new(foo)` が適用され、ページ遷移時にスライドアニメーションが適用されることがわかります。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/5MGYnGgBytEzJGIPPCqTCq/092b9c8bd43036369f274810a3d16f2e/_____2025-01-19_13.12.45.mov" controls></video>

## `<Suspense>` への適用

`<ViewTransition>` コンポーネントは `<Suspense>` コンポーネントと組み合わせて使用できます。`<Suspense>` コンポーネントは非同期でデータを取得する際に使用されるコンポーネントです。`<Suspense>` コンポーネントで非同期データの取得を行う場合には、`<ViewTransition>` コンポーネントをラップすると、`fallback` で指定したコンポーネントとコンテンツの遷移時にアニメーションが適用されます。

```jsx
import {
  Suspense,
  unstable_ViewTransition as ViewTransition,
  use,
} from "react";
let cache = new Map();

export function fetchData(url: string) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url: string) {
  if (url === "todos") {
    return await fetchTodos();
  } else {
    throw Error("Not implemented");
  }
}

const fetchTodos = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const todos = [
    { id: 1, title: "Buy milk" },
    { id: 2, title: "Take out the trash" },
    { id: 3, title: "Wash dishes" },
  ];
  return todos;
};

function PageA() {
  const todos = use(fetchData("todos"));
  return (
    <div>
      <h1>Page A</h1>

      <ul>
        {todos.map((todo: any) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}

const Skelton = () => {
  return <div>Loading...</div>;
};

function App() {
  return (
    <>
      <ViewTransition>
        <Suspense fallback={<Skelton />}>
          <PageA />
        </Suspense>
      </ViewTransition>
    </>
  );
}

export default App;
```

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/48Iw7WHbF95pBTQ9QGZCra/5111610a3441ce3600db80459925fa48/_____2025-01-19_13.28.50.mov" controls></video>

## まとめ

- `<ViewTransition>` コンポーネントは View Transition API を React で使用するための実験的な機能
- `<ViewTransition>` コンポーネントでラップしたコンポーネントにランダムな値で `view-transition-name` CSS プロパティが追加される
- `view-transition-name` の値を指定するためには `name` Props を使用する
- `<ViewTransition>` コンポーネントは `<Suspense>` コンポーネントと組み合わせて使用することができる

## 参考

- [Add <ViewTransition> Component by sebmarkbage · Pull Request #31975 · facebook/react](https://github.com/facebook/react/pull/31975)
- [Revealed: React's experimental animations API - Motion Blog](https://motion.dev/blog/reacts-experimental-view-transition-api)
