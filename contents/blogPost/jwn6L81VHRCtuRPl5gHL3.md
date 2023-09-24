---
id: jwn6L81VHRCtuRPl5gHL3
title: "モーダルの開閉状態を URL で管理する"
slug: "manage-modal-state-with-url"
about: "モーダルの開閉状態を URL で管理することで、状態を復元したり、状態を共有できるなどのメリットがあります。この記事では、Next.js を例に URL でモーダルの開閉状態を管理する方法を紹介します。"
createdAt: "2023-09-24T16:38+09:00"
updatedAt: "2023-09-24T16:38+09:00"
tags: ["React", "Next.js"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/5Ekkx2HI8CGzI4EO8JJP3J/69d2554e1c746ddf8b07902393521da3/fish_sanma_5367.png"
  title: "さんまのイラスト"
published: true
---

よくあるモーダルの実装について考えてみましょう。モーダルは名前のとおり、現在開いているか閉じているかの状態（モード）があります。状態を管理するときには、React の `useState` フックを利用する方法がまっさきに思い浮かぶのではないでしょうか？

```tsx
import { useState } from "react";
import Dialog from '@ui/components/Dialog';
import Button from '@ui/components/Button';

const App = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="outlined" onClick={() => setIsOpen(true)}>
        Open dialog
      </Button>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        Content
      </Modal>}
    </>
  );
};
```

この実装では、モーダルの開閉状態を `isOpen` という変数で管理しています。この変数はボタンをクリックしてモーダルを開いたり、モーダルから閉じたりするときに更新されます。このように、JavaScript の変数で UI の状態を管理するのは、React に限らず一般的な方法です。

## URL で状態を管理する

モーダルの開閉状態を管理するもう 1 つの方法として、URL にモーダルが開いているかどうかを管理する方法が考えられます。URL でモーダルの開閉状態を管理する例として、X のポストボタンをクリックしたときに表示されるモーダルがあげられます。X のホーム画面よりポストボタンをクリックすると、ポストを投稿するモーダルが表示されるとともに、`https://twitter.com/compose/tweet` という URL に遷移します。

この URL は、モーダルが開いている状態を表しています。`https://twitter.com/compose/tweet` という URL に直接アクセスすると、モーダルがはじめから開いた状態でホーム画面が表示されます。また、モーダルを閉じると、`https://twitter.com/home` という URL に遷移します。この URL は、ホーム画面においてモーダルが閉じている状態を表しています。

URL で状態を管理するメリットは、以下の 3 つが挙げられます。

- モーダルを開いた状態を復元できる
- モーダルを開いた状態を共有できる
- Next.js の App Router において、Server Component として扱える

### モーダルを開いた状態を復元できる

URL で状態を管理することで、モーダルを開いた状態を復元できます。例えばタスクの一覧画面を表示していて、特定のタスクを編集するためのモーダルを開いていることを想定します。あなたは操作中に誤ってブラウザのタブを閉じてしまって経験はないでしょうか？私はタブを整理する時によく誤ったタブを閉じてしまうことがよくあるので、ブラウザの「最近閉じたタブ」から復元することを日常的に行っています。

JavaScript の変数でモーダルの開閉状態を管理していた場合には、タブを復元した時に表示されるのはタスクの一覧画面です。モーダルが開いていたという情報は失われてしまいます。おそらくあなたは数千個あるタスク一覧から再び特定のタスクを探し出して、再びモーダルを開く必要があるでしょう。

一方で URL でモーダルの開閉状態を管理していた場合には、特定のタスクの編集モーダルを開いた状態を復元できます。（おそらく編集中の内容は失われてしまうでしょうが。編集中の内容は LocalStorage などで保持することになるでしょう。）

### モーダルを開いた状態を共有できる

URL で状態した場合には、モーダルを開いた状態の画面を他の人に共有できます。たくさんのグラフが表示されたダッシュボード画面を想像してみてください。不穏な動きを示しているグラフが見つかれば、そのグラフの詳細な情報を確認するためのモーダルを開くことでしょう。特定のグラフのモーダルを開いた状態の URL があれば、その URL を他の人に共有することで、素早くグラフの詳細な情報を確認できます。

これらのメリットは、状態を持つ UI という観点で一般化できます。以下のような UI も一般的に状態を持ちますが、URL で状態を管理することで、同様のメリットを享受できます。

- タブ：特定のタブを開いた状態を復元できる
- 検索フォーム：特定の検索結果を表示した状態を復元できる
- アコーディオン：特定のアコーディオンを開いた状態を復元できる

### Next.js の App Router において、Server Component として扱える

Next.js という特定のフレームワークに限った話になりますが、App Router において URL で状態を管理することは有益です。Next.js の App Router においては、コンポーネントは以下の 2 つのタイプに分類されます。

- Server Component
- Client Component

デフォルトではコンポーネントは Server Component として扱われます。Server Component はクライアントに JavaScript のコードが送信されないため、バンドルサイズが小さくなるといったメリットがあります。その代わり、`useState` や `useEffect` といった状態やライフサイクルを管理するフックを利用できなかったり、`onClick` といったイベントハンドラを利用できない制約が存在します。

`useState` を使用せずに URL で状態を管理することによって、より多くのコンポーネントを Server Component として扱うことができます。

## URL でモーダルの状態を管理する実装

それでは実際に Next.js において URL でモーダルの開閉状態を管理する実装を行ってみましょう。まずは `Home` コンポーネントを作成します。これはモーダルが必要なホーム画面であり、Props としてモーダルが開いているかどうかを受け取ります。

このコンポーネントは `/` と `/todos/add` それぞれのページコンポーネントにおいて利用されます。

```tsx:app/Home.tsx
import { AddTodoDialog } from "./AddTodoDialog";

const TodoList = async () => {
  const todos = await fetch("https://jsonplaceholder.typicode.com/todos");
  const todosJson = await todos.json();

  return (
    <ul>
      {todosJson.map((todo: any) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
};

export const Home = ({ open }: { open: boolean }) => {
  return (
    <div>
      <h1>Home</h1>
      <AddTodoDialog open={open} />
      <TodoList />
    </div>
  );
};
```

`AddTodoDialog` は Todo を追加するためのモーダルを表示するコンポーネントです。モーダルを閉じる際にページ遷移するため `useRouter` を使用しているので、Client Component にする必要があります。

```tsx:app/AddTodoDialog.tsx {11, 14}
"use client";

import Dialog from "@/ui/components/Dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const AddTodoDialog = ({ open }: { open: boolean }) => {
  const router = useRouter();
  return (
    <>
      <Link href="/todos/add">Open Dialog</Link>
      <Dialog
        open={open}
        onClose={() => router.push("/")}
        aria-labelledby="add-todo-title"
      >
        <h2 id="add-todo-title">Add Todo</h2>
        <form>
          <label htmlFor="title">Title</label>
          <input type="text" id="title" />
          <button type="submit">Submit</button>
        </form>
      </Dialog>
    </>
  );
};
```

`useState` を使用した実装と比較して、以下の 2 つの違いが存在します。

- `<Button>{:tsx}` がクリックした時にモーダルを開くのではなく、`<Link>{:tsx}` によるページ遷移となっている
- `onClose` コールバックでモーダルを閉じる時、`router.push` によるページ遷移を行っている

この `<Home>{:tsx}` コンポーネントをページコンポーネントから使用しましょう。`/` という URL でページにアクセスした場合にはモーダルは閉じているはずです。そのため、`app/page.tsx` で `<Home>{:tsx}` コンポーネントを使用する際には `open` Props に `false` を渡します。

```tsx:app/pages/index.tsx
import { Home } from "./Home";
export default function App() {
  return (
    <main>
      <Home open={false} />
    </main>
  );
}
```

`/todos/add` という URL でページにアクセスした場合にはモーダルは開いているはずです。そのため、`app/todos/add/page.tsx` では `<Home>{:tsx}` の `open` Props に `true` を渡します。

```tsx:app/pages/todos/add.tsx
import { Home } from "@/app/Home";

export default function AddTodo() {
  return <Home open />;
}
```

これで URL でモーダルの開閉状態を管理する実装は完了です。モーダルを開いたり閉じたりする基本的な動作は変わりません。http://localhost:3000/todos/add に直接アクセスすると、はじめからモーダルが閉じた状態で表示されることがわかります。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/7b3S7Xq4DzIEtOFSCO3pYP/9381d7695610b48a8ed0ab0d9bc06cab/_____2023-09-24_18.42.47.mov" controls>

## まとめ

URL で状態を管理することは、JavaScript の変数で状態を管理することと比べて、状態を復元したり、状態を共有できるなどのメリットがあります。これはモーダルの開閉状態に限らず、状態を持つ UI において一般的に言えることです。
