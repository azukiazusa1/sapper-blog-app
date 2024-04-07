---
id: _p-ckYwx65PpHzsPDgM0h
title: "Promise や Context から値を読み取る use React フック"
slug: "promise-context-value-react-hook"
about: "React の Canary および experimental チャンネルでのみ利用可能な `use` フックについて解説します。`use` フックは Promise や Context から値を読み取るためのフックで、Promise の値を同期的に読み取ることができます。その他の React フックと異なり、`if` 文やループ内で呼び出すことができる点が特徴として挙げられます。"
createdAt: "2024-04-07T10:33+09:00"
updatedAt: "2024-04-07T10:33+09:00"
tags: ["React"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/h9e0lS5nchLizCA53q8VX/eaa63ff30823317a38bd79f85f384d50/sakura_hanabira_illust_2837-768x656.png"
  title: "桜の花びらのイラスト"
selfAssessment:
  quizzes:
    - question: "次のうち、`use` フックの引数として渡せないものはどれか？"
      answers:
        - text: "非同期関数 () => Promise<T>"
          correct: true
        - text: "Promise オブジェクト"
          correct: false
        - text: "React.Context オブジェクト"
          correct: false
    - question: "次のうち、`use` フックの特徴として正しくないものはどれか？"
      answers:
        - text: "`if` 文やループ内で呼び出すことができる"
          correct: false
        - text: "コンポーネント内またはフック内に限らず、どこからでも呼び出すことができる"
          correct: true
        - text: "Promise が解決するまでレンダリングが中断される"
          correct: false
        - text: "Promise が reject された場合、Error Boundary によりエラーがキャッチされる"
          correct: false

published: true
---

!> `use` フックは 2024 年 4 月現在、React の Canary および experimental チャンネルでのみ利用可能です。

`use` は、Promise や Context から値を読み取るための React フックです。以下のコードのように Promise の値を同期的に読み取ることができます。

```jsx
import { use } from "react";

const fetchUsers = async () => {
  const response = await fetch("/api/users");
  return response.json();
};

const Users = () => {
  const users = use(fetchUsers());
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};
```

`use` フックの大きな特徴の 1 つとして、`useState` や `useEffect` などの他のフックのルールと異なり、`if` 文やループ内で呼び出すことができる点が挙げられます。例えば以下のように、ログイン状態に応じてユーザーの情報を取得するかどうかを決定できます。

```jsx
import { use } from "react";

const Header = () => {
  const isLoggedIn = use(AuthContext);
  let user = null;

  if (!isLoggedIn) {
    user = use(fetchUser);
  }

  return (
    <header>
      {user ? <p>Welcome, {user.name}!</p> : <p>Please log in.</p>}
    </header>
  );
};
```

`use` を呼び出す関数はコンポーネントもしくはフック内に限られるというルールはその他の React フックと同様に適用されます。

この記事では `use` フックの使用例や注意点を見ていきます。なお、Canary チャンネルの React を使用するため、`package.json` で以下の通り React のバージョンを指定しています。

```json:pacakge.json
{
  "dependencies": {
    "react": "19.0.0-canary-e3ebcd54b-20240405",
    "react-dom": "19.0.0-canary-e3ebcd54b-20240405"
  },
}
```

## Promise での使用例

冒頭で紹介したコードを再掲します。`use` フックは Promise の値を同期的に読み取ることができるのが特徴でした。

```jsx
import { use } from "react";

const fetchUsers = async () => {
  const response = await fetch("/api/users");
  return response.json();
};

const Users = () => {
  const users = use(fetchUsers());
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};
```

`use` フックを使用する利点は非同期処理をコンポーネント内で扱いやすくなることと言えるでしょう。従来までのコードですと、`useState` の初期値に `null` を設定し、コンポーネントが 1 度描画された後に `useEffect` で非同期処理を行い、その結果を `useState` で更新するという手順がよく取られていました。

```tsx
import { useEffect, useState } from "react";

const Users = () => {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  if (!users) {
    return <p>Loading...</p>;
  }

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};
```

もしくは `useSWR` や `useQuery` などのライブラリを使用して、非同期処理を簡素化する方法も使われていました。

従来までのコードの扱いづらい点として、非同期処理が完了したかどうかに問わず、データが `null` である可能性がつきまとうことが挙げられます。つまり、非同期処理を扱い場合には必然的に `null` チェックを行う条件分岐が必要となりますから、同期処理と比較してコードの複雑性が常に +1 されるということです。

このような非同期処理の課題を解決したのは React 18 以降の [Suspense](https://ja.react.dev/reference/react/Suspense) でした。Suspense では非同期処理が完了していない間、コンポーネントそのものが「まだレンダリングできない状態」という状態になります。従来では `<Users>` コンポーネントにおいてデータが `null` かどうかの条件分岐を行い、ローディング UI を表示する責務を担っていましたが、Suspense を使う場合では `<Users>` コンポーネントはデータが取得できるまでそもそもレンダリングされていないため、データは常に存在することが保証されます。

```tsx
import { useData } from "./useData";

export const Users = () => {
  // useData は Suspense に対応した非同期処理を行うカスタムフック
  const users = useData(fetchUsers);

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};
```

このとき、非同期処理が完了したかの状態によりローディング UI を表示するかどうかを決定する処理は親コンポーネントに移譲されます。`<Suspense>` の子要素が「まだレンダリングできない状態」である場合、`<Suspense>` は `fallback` プロパティで指定されたコンポーネントを表示します。非同期処理が例外をスローした場合には [Error Boundary](https://ja.react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) によりエラーがキャッチされます。

```tsx
import { Suspense } from "react";
import { Users } from "./Users";
import { ErrorBoundary } from "./ErrorBoundary";

export const App = () => {
  return (
    <ErrorBoundary fallback={<p>Failed to load users.</p>}>
      <Suspense fallback={<p>Loading...</p>}>
        <Users />
      </Suspense>
    </Suspense>
  );
};
```

Suspense によりデータを表示するコンポーネントの責務が明確になり、宣言的な方法でフォールバック UI を表示できるようになります。Suspense を使用するうえで 1 点ウィークポイントとしてあげられるのが、非同期のデータ取得処理の内部実装がやや複雑になることです。Suspense ではコンポーネントが「まだレンダリングできない状態」であることを Promise を throw することで表現しています。

上記のコード例では `useData` と呼ばれるカスタムフックを使用していました。このフックの最も単純な実装は以下のようになります。

```tsx
let data: unknown | null = null;
export const useData = <T>(fetcher: () => Promise<T>) => {
  const promise = fetcher();
  if (data === null) {
    throw promise.then((d) => (data = d));
  }
  return promise;
};
```

ここではグローバル変数として `data` を定義しています。`useData` フックが呼び出された際に `data` が `null` である場合には Promise を throw することで「まだレンダリングできない状態」を表現しています。React で状態を管理するためには真っ先に `useState` を思い浮かべるかもしれませんが、それではうまく動きません。コンソールには以下のような警告が表示されます。

```sh
Warning: Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously later calls tries to update the component. Move this work to useEffect instead.
```

React のコンポーネントがマウントされる前に状態を更新できないという警告です。Promise を throw して「まだレンダリングできない状態」である場合には、コンポーネントのレンダリングが中断されるのが原因です。`useState` の裏側の仕組みとしてコンポーネントに記憶領域が紐づいています。Promise が throw される限り状態を記憶する領域は永遠に確保されないため、`useData` フックを使用したコンポーネントはレンダリングが開始されることがなく、ずっとローディング UI が表示され続けることになります。

これが `useState()` を使わずにグローバル変数を使用する理由です。実際に本番環境に耐えうる実装をする場合には、グローバル変数として状態を管理するのではなく、もう少し複雑な実装が必要になることが予想できるでしょう。そのため我々が Suspense を使うような場合には、`useSWR` や `TanStack Query`、`Relay` といった Suspense に対応した非同期処理ライブラリを使用することが推奨されていました。

さて、`use` フックに話を戻しましょう。`use` フックは Promise の値を同期的に読み取ることができると説明しましたが、コード例は Suspense に対応した `useData` フックのものと非常によく似ています。

```tsx
import { use } from "react";

const Users = () => {
  const users = use(fetchUsers());
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};
```

もうお気づきかもしれないですが、`use` フックは Promise を引数に取る場合 Suspense や Error Boundary と協調して動作します。つまり `use` フックの内部の実装では、Promise を throw する処理が行われているのです。

`use` フックがもたらす利点は、Suspense に対応したデータ取得処理の複雑さを隠蔽して、ライブラリを使用せずとも非同期処理を扱いやすくなることだと言えるでしょう。`use` フックは `async/await` を使うことができない React コンポーネントの世界において、`await` によるシーケンシャルな非同期処理の実行と同じモデルを提供することを目的としています。

ただし `async/await` と異なり、レンダリングが再開された場合最後に中断した箇所から再開されるわけではないため、コンポーネントの先頭からすべてのコードが再実行されることに注意してください。この挙動は、React コンポーネントが冪等であるという特性に依存しています。コンポーネント内で外部にトラッキングデータを送信するといった副作用が発生するコードを実行している場合、それが複数回実行されるおそれがあるということです。なお、パフォーマンスの最適化として、この処理は React ランタイムにより計算の一部がメモ化されます。

### `use` フックとキャッシュ

ここまで使用していた `use` フックのコード例には 1 点問題があります。実際にコードを実行してみると、コンソールに以下の警告が表示されます。

```sh
Warning: A component was suspended by an uncached promise. Creating promises inside a Client Component or hook is not yet supported, except via a Suspense-compatible library or framework.
```

警告は「キャッシュされていない Promise によりコンポーネントが中断された」という内容です。これは `use` フックが前回の値を再利用するかどうかを Promise オブジェクトがレンダリング間で変更されなかったかどうかで判断していることに関係しています。ほとんどの Promise ベースの API は呼び出し毎に新しい Promise オブジェクトを返すため、前回の値を再利用できるケースはほぼありません。

これはコンポーネントが無関係な状態に応じて再レンダリングされる場合に問題となります。コード例として使用している `<Users>` コンポーネントを少し変更して再掲します。

```tsx:Users.tsx
import { use } from "react";

const fetchUsers = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const data = await response.json();
  return data;
};

export const Users = ({ selectedId }) => {
  const users = use(fetchUsers());

  return (
    <ul>
      {users.map((user) => (
        <li
          key={user.id}
          style={{ color: user.id === selectedId ? "red" : "currentColor" }}
        >
          {user.name}
        </li>
      ))}
    </ul>
  );
};
```

Props として `selectedId` を受け取り、その ID に対応するユーザー名を赤色で表示するようにしています。この `selectedId` はデータ取得には無関係の状態ではあるものの、`selectedId` が変化してコンポーネントの再レンダリングが発生するたびに、`fetchUsers` 関数が呼び出され毎回新しい Promise オブジェクトが生成されるため、Suspense のフォールバック UI が表示されるという問題が発生します。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/5GWCF1w3a8rqKfOTrYsBhy/f6115bd032288e813663ba8da62952bb/_____2024-04-07_18.09.45.mov" controls></video>

この問題はデータフェッチがキャッシュされることで回避できます。キャッシュされたデータを返す新しい `fetchUsersFromCache` 関数を考えてみましょう。

```tsx:Users.tsx
import { use } from "react";
import { fetchUsersFromCache } from "./fetchUsersFromCache";

const fetchUsers = async () => {
  return fetchUsersFromCache();
};

export const Users = ({ selectedId }) => {
  const users = use(fetchUsersFromCache());

  return (
    <ul>
      {users.map((user) => (
        <li
          key={user.id}
          style={{ color: user.id === selectedId ? "red" : "currentColor" }}
        >
          {user.name}
        </li>
      ))}
    </ul>
  );
};
```

データはキャッシュから取り出されるため、再レンダリングされたとしてもレンダリングを中断してほしくないということがわかっています。ただし、Promise オブジェクトの同一性により前回の値を使用するかどうかというルールに従うと、この目的は達成できません。

このようなケースのために、React は `fetchUser` 関数が返す Promise がマイクロタスクで解決されるという事実に依存します。React はレンダリングを中断するのではなく、マイクロタスクがフラッシュされるまで待機します。その期間内に Promise が解決された場合には、Suspense のフォールバック UI を表示することなくコンポーネントを再レンダリングします。

このレンダリングが中断される前にマイクロタスクがフラッシュされるまで待機するメカニズムは、データフェッチングがキャッシュされている場合（より正確には、新しい入力を受け取らずに再レンダリングする非同期関数は、マイクロタスク内で解決しなければならない）に限り動作します。

一般的に `use` に渡すリクエストはすべてキャシュされているのが好ましいと言えるでしょう。キャッシュを簡単に実装するために React の [cache](https://ja.react.dev/reference/react/cache) 関数が提案されています。実際に、`use` フックが `cache` 関数なしで安定版リリースに登場する可能性は低いと述べられています。

`cache` 関数は以下のように、非同期関数をラップしてキャッシュされたデータを返す関数を返します。

```tsx
import { use, cache } from "react";

const fetchUsers = cache(async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const data = await response.json();
  return data;
});
```

`fetchUsers` 関数を `cache` 関数でラップすることで警告が表示されなくなり、再レンダリングが実行されたとしてもフォールバック UI が表示されることなくコンポーネントが再レンダリングされるようになります。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/OFR3yBhLbnq3AYHKEbug9/1f7ec13e0d7ce6f3b7e45617f813159c/_____2024-04-07_18.29.50.mov" controls></video>

### サーバーコンポーネントとの比較

`use` フックは React コンポーネントにおいて非同期処理を扱いやすくするためのフックであると説明してきました。「非同期処理を扱いやすくする」という点で [React Server Components](https://ja.react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components) が頭によぎったかもしれません。React Server Components の最大の利点の 1 つはコンポーネントの `async/await` をサポートしたことにより、シンプルなデータ取得処理を実現できる点です。

```tsx
export default async function Users() {
  const response = await fetch("/api/users");
  const users = await response.json();

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

サーバーコンポーネントと `use` フックはどちらを使うべきかなのでしょうか？

一般的にはサーバーコンポーネントを実行できる環境であれば、`use` フックよりも `async/await` を使うことが推奨されます。`async/await` では `await` によりレンダリングが中断したとき、Promise が解決すると `await` が呼び出された時点から再開されます。一方、`use` フックは Promise が解決した後はコンポーネントを最初からレンダリングするためです。また文法の観点からも通常の JavaScript と同じように使える `async/await` の方が優位と言えるでしょう。

`use` のユースケースとしてクライアントコンポーネントでデータフェッチを行う場合が挙げられます。`async/await` は技術的な制約により、サーバーで実行されるコンポーネントでのみ使用できます。クライアントサイドでも `async/await` と同じように非同期処理を扱えることが `use` フックの目的とされています。

`use` フックは React 専用バージョンの `await` とも考えることができるでしょう。

サーバーコンポーネントを実行できる環境で `use` を使うべきケースとして、クリティカルではないデータの取得を待たずにコンポーネントをレンダリングしたい場合が挙げられます。例えば記事の詳細画面を表示する画面を考えてみましょう。記事の本文を取得するのに 1 秒、記事のコメントを取得するのに 3 秒かかると仮定します。素朴にサーバーコンポーネントで実装すると、以下のようになるでしょう。

```tsx:ArticleDetail.tsx
export default async function ArticleDetail() {
  const [articles, comments] = await Promise.all([
    fetch("/api/articles/1").then((res) => res.json()),
    fetch("/api/articles/1/comments").then((res) => res.json()),
  ]);

  return (
    <div>
      <h1>{article.title}</h1>
      <p>{article.body}</p>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>{comment.body}</li>
        ))}
      </ul>
    </div>
  );
}
```

ここで問題となるのは、画面全体を表示するために最も遅いリクエストが完了するまで待たなければならないという点です。多くの場合、ユーザーは記事の本文を読むことが最優先であり、コメントを読むことはそれほど重要ではありません。記事の本文を読むために 3 秒待たなければならないのはユーザーにとってよい体験ではありません。

この問題の改善点として、サーバーコンポーネントではコメントの取得を待たずに、クライアントコンポーネント側で後から `use` フックを使ってコメントを取得するという方法が考えられます。これにより記事の本文が取得したタイミングで画面が表示され、コメント部分はローディング UI が表示されることになります。

```tsx:ArticleDetail.tsx
import { Comments } from "./Comments";
export default async function ArticleDetail() {
  const article = await fetch("/api/articles/1").then((res) => res.json());
  // ここでは await せずに Promise のまま `<Comments>` コンポーネントに渡す
  const comments = fetch("/api/articles/1/comments").then((res) => res.json());

  return (
    <div>
      <h1>{article.title}</h1>
      <p>{article.body}</p>
      <Suspense fallback={<p>Loading comments...</p>}>
        <Comments commentsPromise={comments} />
      </Suspense>
    </div>
  );
}
```

`<Comments>` コンポーネントでは Props として Promise を受け取り、`use` フックを使ってコメントを取得します。

```tsx:Comments.tsx
"use client";
import { use } from "react";

export const Comments = ({ commentsPromise }) => {
  const comments = use(commentsPromise);

  return (
    <ul>
      {comments.map((comment) => (
        <li key={comment.id}>{comment.body}</li>
      ))}
    </ul>
  );
};
```

なお、サーバーコンポーネントからクライアントコンポーネントに Promise を渡す場合には、解決された値がシリアライズ可能な形式であることが求められます。例えば、関数などの値を渡すことはできません。

## Context での使用例

`use` フックは Promsie だけでなく、Context から値を読み取るためにも使用できます。

```tsx
import { createContext, use, useState } from "react";

type Theme = {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
};

const themeContext = createContext<Theme | null>(null);

const Title = () => {
  const { theme } = use(themeContext);
  return <h1 style={{ color: theme === "dark" ? "white" : "black" }}>Title</h1>;
};

const ThemeSwitcher = () => {
  const { theme, setTheme } = use(themeContext);
  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      {theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
    </button>
  );
};

const App = () => {
  const [theme, setTheme] = useState("light");
  return (
    <themeContext.Provider value={{ theme, setTheme }}>
      <Title />
      <ThemeSwitcher />
    </themeContext.Provider>
  );
};

export default App;
```

このとき `use` フックは `useContext` と同様に Context の値を読み取ります。`use` フックを使用する利点として、if 文やループ内で呼び出すことができる点が挙げられます。

```tsx
const Profile = ({ isLoggedIn }) => {
  if (isLoggedIn) {
    const { theme } = use(themeContext);
    return (
      <p style={{ color: theme === "dark" ? "white" : "black" }}>
        Welcome, {user.name}!
      </p>
    );
  } else {
    return <p>Please log in.</p>;
  }
};
```

## まとめ

- `use` フックは Promise や Context から値を読み取るための React フック
- `use` フックはその他のフックのルールと異なり if 文やループ内で呼び出すことができる
- Promise の値を同期的に読み取ることができ、Suspense や Error Boundary と協調して動作する
- `use` フックに渡す非同期関数は常にキャッシュされているのが好ましい。キャッシュを簡単に実装するために React の `cache` 関数が提案されている
- サーバーコンポーネントを使用できる環境であれば、非同期処理に `async/await` を使うことが推奨される。`use` フックはクライアントコンポーネントでデータフェッチを行う場合に使用する、React 専用バージョンの `await` と考えることができる
- Context から値を読み取るためにも使用できる

## 参考

- [use – React](https://ja.react.dev/reference/react/use)
- [RFC: First class support for promises and async/await by acdlite · Pull Request #229 · reactjs/rfcs](https://github.com/reactjs/rfcs/pull/229)
- [最速攻略！　Reactの `use` RFC](https://zenn.dev/uhyo/articles/react-use-rfc#use%E3%81%AE%E9%AD%94%E6%B3%95)
- [ReactのSuspense対応非同期処理を手書きするハンズオン](https://zenn.dev/uhyo/books/react-concurrent-handson)
- [React 18に備えるにはどうすればいいの？　5分で理解する #React - Qiita](https://qiita.com/uhyo/items/bbc22022fe846fd2b763)
