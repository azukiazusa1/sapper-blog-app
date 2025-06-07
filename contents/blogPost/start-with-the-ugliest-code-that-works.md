---
id: RSnWuHQQUK1ByRV8K5eVD
title: "最小限のコードで動く最も汚いコードから始める"
slug: "start-with-the-ugliest-code-that-works"
about: "コードを書く際の重要な要点は、読みやすく他人に理解される「良いコード」を書くことです。しかし、完璧を目指して最初から書こうとすると行き詰まります。代わりに、荒削りながらも動くコードを作成し、徐々にリファクタリングして完成度を高めます。型エラーやリントエラーを無視しても構わないので、まずは動くものを作成しましょう。それからリファクタリングして「良いコード」を作成できます。"
createdAt: "2023-09-03T08:57+09:00"
updatedAt: "2023-09-03T08:57+09:00"
tags: ["React", "TypeScript"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/6UKhA7p9mC4BGDDc6bgNFp/8161de3f28245b8ab40795184e0f6e62/momiji_kouyou_11157.png"
  title: "イチョウのイラスト"
audio: null
selfAssessment: null
published: true
---
コードを書くときに最も大切なことってなんだろう？聡明な読者諸君ならご存知だろうが、コードは書く時間よりも読む時間のほうが長い。だから他人に読まれることを意識して、読みやすい「良いコード」を書かなくっちゃならない。コンポーネントは適切な粒度で分割されていて、適切な名前がつけられている。型システムに安全性だって守られてるし、最新のなんとかアーキテクチャにも準拠している。素晴らしいコードだ。

でも、そんなコードをはじめから書くのは難しい。はじめから完璧を目指そうとコードを書こうとすると、必ずどこかで行き詰まってしまう。まだ何も動いているものはないのに、机上の中であれこれ考えているうちに、いつの間にか時間が過ぎてしまう。それが本当に必要なものなのかまだわかってすらいないのに。完璧な見た目のコードを書けたと思ったら、うんともすんとも動かない。いったいどこのレイヤーで書いたコードが間違っていたんだ？頭をかきむしりながら、コードを読み返してはデバッグを繰り返す。上司に進捗を聞かれても、まだ何もできていないし、どのくらい進んでいるのかもわからない。どうしてこんなことになってしまったんだろう。いつの間にか、コードを書くことが苦痛になってしまった。

これは別にコードを書くときに限った話じゃない。いきなり 100% の成果を出そうとしても、そんなことはできない。ビジセスの世界じゃ「たたき台」ってものが重要だ。どれだけ荒削りなものでいいから、とりあえず企画案が出てこなくちゃ話にならない。そこから徐々に磨きをかけていく。そうやって、最終的には完成度の高いものを作り上げる。

コードを書くときも同じだ。まずはどんなに汚いコードでもいいから、とにかく動くものを作ってみる。それから徐々にリファクタリングをしていって、最終的に「良いコード」をレポジトリにプッシュすればよい。人がコードを書いてるところってなかなか見る機会がないから、シニア開発者のコードは突然魔法のように生まれたように見える。でも、そんなことはない。誰だって最初は汚いコードから書き始めているはずだ。[^1]最終的にレポジトリにプッシュされるコードしか見えないから、優秀な開発者はいきなり「良いコード」を書けるものだと思っていまう。

まずは動くものを作ってみよう。エディタが報告する型エラーやリントエラーも全部無視したって構わない。だってそのコードが動くって知ってるからね。ここからは実際に React でコードを書いていく様子を見ていこう。

## べた書きのコンポーネント

ここではユーザー一覧のテーブルを表示する画面を作っていく。ユーザーの ID・名前・ロール・作成日時・更新日時が表示され、編集や削除ができる。

まずはどこから始めようか？どのコンポーネントが必要か考える？それとも API からデータを取得するレイヤーのことを考えようか？いいや違う、まずは手を動かそう。`<App>` コンポーネントがアプリケーションのエントリーポイントとなっているはずだから、そこに直接コードを書いてしまおう。

API をコールするコードもいらない。テーブルを表示するだけなら適当なデータを用意しておけばいい。JSX 内に直接べた書きしてしまおう。丁寧に変数をループさせるのはもう少し後の話だ。

```tsx:App.tsx
function App() {
  return (
    <div className="app">
      <h1>ユーザー一覧</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>名前</th>
            <th>ロール</th>
            <th>作成日時</th>
            <th>更新日時</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Joe</td>
            <td>管理者</td>
            <td>2021-01-01 00:00:00</td>
            <td>2021-01-01 00:00:00</td>
            <td>
              <button>編集</button>
              <button>削除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;
```

うん、なかなかいい感じのコードができた。ユーザーの名前のところには自分の好きなアニメキャラの名前を入れたって構わない[^2]。どうせすぐに捨てるコードだからだ。何より大切なことはこのコードはもうすでに動くってことだ。ブラウザで確認してみよう。

![](https://images.ctfassets.net/in6v9lxmm5c8/2lyq8KSsPghJa9r47F1sXM/6d73c526412f6351c756697a26139535/__________2023-09-03_11.47.05.png)

うん、ちゃんと表示されている。でもちょっと間違えているみたいだ、テーブルのヘッダーのカラム数が足りてない。`<th>` タグを追加してあげよう。

```diff:App.tsx
  function App() {
    return (
      <div className="app">
        <h1>ユーザー一覧</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>名前</th>
              <th>ロール</th>
              <th>作成日時</th>
              <th>更新日時</th>
+             <th>操作</th>
            </tr>
          </thead>
```

とりあえずテーブルを表示させることを先決としていたから素早く誤りに気づくことができた。もしはじめから変数を使って表示するコードを書いていたら、まずは問題の切り分けに時間を費やしていたかもしれない。

もう少し本物のデータに見えるように、行を増やしてみよう。ここでもまだ変数を使う必要はない。僕らにはコピー・ペーストという強力な武器がある。`<tr>` タグをコピーして、`<tbody>` タグの中にペーストしてみよう。

```jsx:App.tsx
  function App() {
    return (
      <div className="app">
        <h1>ユーザー一覧</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>名前</th>
              <th>ロール</th>
              <th>作成日時</th>
              <th>更新日時</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Joe</td>
              <td>管理者</td>
              <td>2021-01-01 00:00:00</td>
              <td>2021-01-01 00:00:00</td>
              <td>
                <button>編集</button>
                <button>削除</button>
              </td>
            </tr>
            <tr>
              <td>1</td>
              <td>Joe</td>
              <td>管理者</td>
              <td>2021-01-01 00:00:00</td>
              <td>2021-01-01 00:00:00</td>
              <td>
                <button>編集</button>
                <button>削除</button>
              </td>
            </tr>
            <tr>
              <td>1</td>
              <td>Joe</td>
              <td>管理者</td>
              <td>2021-01-01 00:00:00</td>
              <td>2021-01-01 00:00:00</td>
              <td>
                <button>編集</button>
                <button>削除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
```

素晴らしい、もうすでに 3 人のユーザーが表示されている。ここまでわずか 5 分程で実装できた。これで僕らは次のステップに進む準備ができた。

![](https://images.ctfassets.net/in6v9lxmm5c8/LvzJffLcUppChF5xux6YR/06aca2b354450e82f068a2395f834fd9/__________2023-09-03_12.19.38.png)

## ユーザー一覧を取得するフックを呼び出す

これは単なる直感なんだけど、ユーザーの一覧を取得するのは `useUser` というフックを呼び出せばいい気がする。そういうコードをたくさん見てきたから多分正しいはずだ。たとえそれが間違っていたとしても、すぐに消してしまえばいい。まずは動かしてみなきゃわからない。

ところで、`useUser` というフックはどのファイルに配置すればいいんだ？コロケーションって言って、コンポーネントとそのコンポーネントで使うフックは近い場所に配置するのが良いと聞いたことがある。だけれど、もしかしたら `useUser` フックは別の場所でも使われるんじゃないか？こんがらがってきた。

何度も言ってるように、動かす前に考えるのは時間の無駄だ。もしかしたら `useUser` フックは捨てることになるかもしれないのに。ひとまず `App.tsx` ファイルに書いてしまおう。気に食わなかったら後で移動すればいい。

`useUser` フックの中では API をコールしてユーザーを取得する処理を...書くのはまだ早い。一旦ダミーデータを返しておけばいいだろう。単に `users` という配列を返すようにしておく。ちなみにこういったダミーデータを作るのは GitHub Copilot[^3] の得意技だ。特に、あらかじめ `User` 型を作っておけばその通りにダミーデータを作ってくれる。

というわけでちょっと順番を入れ替えて `User` 型を作ってしまおう。これを書くのも `App.tsx` ファイルの中でいい。

```tsx:App.tsx
type User = {
  id: number;
  name: string;
  role: "admin" | "editor" | "viewer";
  createdAt: string;
  updatedAt: string;
};
```

`useUser` フックを書いていく。このコードの大半は GitHub Copilot に書いてもらった。この場を借りて感謝を述べておきたい。

```tsx:App.tsx
const useUser = () => {
  const users: User[] = [
    {
      id: 1,
      name: "Joe",
      role: "admin",
      createdAt: "2021-01-01 00:00:00",
      updatedAt: "2021-01-01 00:00:00",
    },
    {
      id: 2,
      name: "Alice",
      role: "editor",
      createdAt: "2021-01-01 00:00:00",
      updatedAt: "2021-01-01 00:00:00",
    },
    {
      id: 3,
      name: "Bob",
      role: "viewer",
      createdAt: "2021-01-01 00:00:00",
      updatedAt: "2021-01-01 00:00:00",
    },
  ];

  return users;
};
```

`useUser` の返り値の型はこれでいいんだっけ？と思った方は抜け目がない。データを取得している最終は `undefined` になる可能性があるかもしれないからだ。でも、まだそんなことは考えなくていい。だって今は API をコールしてるわけじゃない。コンポーネントの中でフックが呼び出せるか確認することが目的だ。

`useUser` フックを呼び出してみよう。`App` コンポーネントの中で `useUser` フックを呼び出して、その返り値を `.map()` メソッドでループさせて表示する。

```tsx:App.tsx
function App() {
  const users = useUser();

  return (
    <div className="app">
      <h1>ユーザー一覧</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>名前</th>
            <th>ロール</th>
            <th>作成日時</th>
            <th>更新日時</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.role}</td>
              <td>{user.createdAt}</td>
              <td>{user.updatedAt}</td>
              <td>
                <button>編集</button>
                <button>削除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

ブラウザで確認すると変わらず 3 人のユーザーが表示され続けている。`useUser` の呼び出しがうまくいっている証拠だ。

![](https://images.ctfassets.net/in6v9lxmm5c8/7yNvNJGIWhxUc2REeqPNQf/3c590c2388523aa32e172ef8db7df0c3/__________2023-09-03_12.42.59.png)

ロールのキー名がそのまま表示されているのが不格好だから、おそらくキー名に対するラベルを表示するオブジェクトが必要なんだろう。これはこの記事を書いてる途中で気づいた。よくやった。ちょっとコードを追加しておこう。

```tsx
const roleLabels: { [key in User["role"]]: string } = {
  admin: "管理者",
  editor: "編集者",
  viewer: "閲覧者",
} as const;

// ...

<td>{roleLabels[user.role]}</td>;
```

うーん、`User["role"]` ってところがちょっと好みじゃないが、ひとまずこれでいいだろう。次のステップに進もう。

## ユーザー一覧の API をコールする

よし、ここからはついに本物のデータを取得する処理を書いていく。まずは API をコールする処理を書いていこう。`useUser` フックの中で `fetch()` 関数を使って API をコールする。よく見慣れた `useEffect()` フックを使ったコードだ。元のダミーデータはもう消してしまっても構わない。[^4]

```tsx:App.tsx
import { useEffect, useState } from "react";

const useUser = () => {
  const [users, setUsers] = useState<User[] | undefined>(undefined);

  useEffect(() => {
    let ignore = false;
    fetch("http://localhost:3000/api/users")
      .then((res) => res.json())
      .then((users) => {
        if (!ignore) {
          setUsers(users);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  return users;
};
```

この変更を加えたら画面が真っ白になってしまった！ただし原因を特定するのはたやすい。間違いなく、今回変更したコードに原因があるはずだからだ。

`useState` の初期値に `undefined` を渡してるけれど、これをコンポーネント側で使用してるときにチェックをしていなかった。ちゃんと型エラーも表示してくれている。ちょっと前の予感が的中したわけだ。`useUser` フックの返り値が `undefined` のときはローディング中の表示をするようにしておこう。

```tsx:App.tsx
<tbody>
  {users === undefined ? (
    <tr>
      <td colSpan={6}>読み込み中...</td>
    </tr>
  ) : (
    users.map((user) => (
      <tr key={user.id}>
        <td>{user.id}</td>
        <td>{user.name}</td>
        <td>{roleLabels[user.role]}</td>
        <td>{user.createdAt}</td>
        <td>{user.updatedAt}</td>
        <td>
          <button>編集</button>
          <button>削除</button>
        </td>
      </tr>
    ))
  )}
</tbody>
```

これで画面が表示されるようになった。ここまでだいぶ順調に進んでいる。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/5WZhMaL38tTz9djijWyn6E/23573a79a950e3a08ca572cfc9db0ce1/_____2023-09-03_13.44.01.mov" controls></video>

ただし全てのコードを `App.tsx` に書いてきたので、ちょっと見通しが悪くなってきた。次はコードを分割していこう。リファクタリングの時間だ。

## コードを分割する

とりあえず手を動かして勧めたおかげで、素早く動くアプリケーションができた。ただし、とてもじゃないけどこのコードは人には見せられない。コードを分割していこう。

`pages/users` というディレクトリを作ってそこにコードを移動していこう。最終的に `App.tsx` は `<UserList>` コンポーネントを呼び出すだけのコードになる。

```tsx:App.tsx
import UserList from "./pages/users/UserList";

function App() {
  return (
    <div className="app">
      <UserList />
    </div>
  );
}
```

`pages/users` ディレクトリに以下の 3 つのファイルを作成する。

- `UserList.tsx`：`<UserList>` コンポーネント
- `useUser.ts`：`useUser` フック
- `types.ts`：`User` 型

`UserList.tsx` には `<App>` コンポーネントの中身をそのままコピーして貼り付ける。`useUser` フックは `./useUser` からインポートして、`roleLabels` は `./types` からインポートする。

```tsx:UserList.tsx
import { useUser } from "./useUser";
import { roleLabels } from "./types";

export const UserList = () => {
  const users = useUser();

  return (
    <>
      <h1>ユーザー一覧</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>名前</th>
            <th>ロール</th>
            <th>作成日時</th>
            <th>更新日時</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {users === undefined ? (
            <tr>
              <td colSpan={6}>読み込み中...</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{roleLabels[user.role]}</td>
                <td>{user.createdAt}</td>
                <td>{user.updatedAt}</td>
                <td>
                  <button>編集</button>
                  <button>削除</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
};
```

`useUser.ts` には `useUser` フックの中身を持ってこよう。`UserList` から使えるように `export` しておく。`User` 型は `./types` からインポートする。

```tsx:useUser.ts
import { useEffect, useState } from "react";
import type { User } from "./types";

export const useUser = () => {
  const [users, setUsers] = useState<User[] | undefined>(undefined);

  useEffect(() => {
    let ignore = false;
    fetch("http://localhost:3000/api/users")
      .then((res) => res.json())
      .then((users) => {
        if (!ignore) {
          setUsers(users);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  return users;
};
```

最後に、`types.ts` には `User` 型と `roleLabels` を移動しておこう。

```tsx:types.ts
export type User = {
  id: number;
  name: string;
  role: "admin" | "editor" | "viewer";
  createdAt: string;
  updatedAt: string;
};

export const roleLabels: { [key in User["role"]]: string } = {
  admin: "管理者",
  editor: "編集者",
  viewer: "閲覧者",
} as const;
```

コードを分割することで見通しが良くなった。リファクタリングを実行したら、必ず画面の表示が壊れていないか都度確認しよう。リファクタリングのたびに画面を確認しておくことで、どの変更で画面が壊れたのかをすぐに特定できるようになる。

これでひとまずコードの見た目も良くなったんじゃなだろうか？編集と削除機能はまだ完成していないが、ここでひとまずプルリクエストを提出してもよいだろう。1 つのプルリクエストの変更差分が大きくなりすぎると、レビューする側も大変だ。プルリクエストは小さければ小さいほどよい。

とはいえ今作業をしているのは僕 1 人だけだ。レビューする人もいない。さっさと次のコードを書いていこう。

## ユーザーの編集モードの表示

ユーザーの編集機能を実装していこう。編集ボタンを押したら、その行が編集モードになるようにしたい。編集モードではユーザーの名前とロールを編集できるようにする。編集モードの行には「更新」ボタンと「キャンセル」ボタンを表示する。更新ボタンを押したら API をコールしてユーザーを更新する。キャンセルボタンを押したら編集モードを終了して、元の表示に戻る。これが編集機能の要件だ。

ここでも 1 ステップづつ進めていこう。おそらく編集中の行を表す状態を `useState` で管理する必要があるだろう。仮説を検証しよう。`UserList` コンポーネントの中で `useState` を使って `editingUserId` という状態を管理する。初期値は `undefined` にしておく。

```tsx:UserList.tsx
import { useState } from "react";

export const UserList = () => {
  const users = useUser();
  const [editingUserId, setEditingUserId] = useState<number | undefined>(
    undefined
  );

  // ...
};
```

編集ボタンが押されたら、その行のユーザー ID を `editingUserId` にセットするようにしてみよう。`handleEditButtonClick` という関数を作って、編集ボタンの `onClick` プロパティに渡す。編集ボタンの `onClick` では、`handleEditButtonClick` の引数に `id` を渡して呼び出すようにする。

`handleEditButtonClick` 関数の中ではいきなり状態を更新したりはしない。まずは `console.log()` で想定通りの ID が渡っているか確認してみよう。焦らず、一歩ずつだ。

```tsx:UserList.tsx
const UserList = () => {
  // ...

  const handleEditButtonClick = (id: number) => {
    console.log(`Edit button clicked: ${id}`);
  };

  return (
    <>
      { /* ... */ }
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{roleLabels[user.role]}</td>
                <td>{user.createdAt}</td>
                <td>{user.updatedAt}</td>
                <td>
                  <button onClick={() => handleEditButtonClick(user.id)}>
                    編集
                  </button>
                  <button>削除</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
```

デベロッパーツールのコンソールを開いて、編集ボタンを押してみよう。想定通りの ID が表示されているだろうか？うまくできていたらバッチリだ。素晴らしいコードを書いた自分を褒めてあげよう。

![](https://images.ctfassets.net/in6v9lxmm5c8/Wdi23BVcdoSQSWe942FcO/f687dd77120f7a0e545301550eb61eb6/__________2023-09-03_14.27.02.png)

ID がうまく渡っていることが確認できたら、`console.log` は消しておいて、`setEditingUserId` で状態を更新するようにしよう。

```tsx:UserList.tsx
const UserList = () => {
  // ...

  const handleEditButtonClick = (id: number) => {
    setEditingUserId(id);
  };

  return (
    <>
      { /* ... */ }
```

テーブルの行のユーザーの ID と `setEditingUserId` の値が一致していたら、その行は編集用のフォームを表示するようにすればいいはずだ。うまくいくか試してみよう。実験段階ではまた本物のフォームは表示しない。かわりに愉快なメッセージを表示しておこう。

```tsx:UserList.tsx
const UserList = () => {
  // ...

  return (
    <>
      {users === undefined ? (
        <tr>
          <td colSpan={6}>読み込み中...</td>
        </tr>
      ) : (
        users.map((user) => {
          return editingUserId === user.id ? (
            <div>Year!</div>
          ) : (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{roleLabels[user.role]}</td>
              <td>{user.createdAt}</td>
              <td>{user.updatedAt}</td>
              <td>
                <button onClick={() => handleEditButtonClick(user.id)}>
                  編集
                </button>
                <button>削除</button>
              </td>
            </tr>
          );
        })
      )}
    </>
  );
};
```

編集ボタンを押した行が「Year!」と表示されていたら成功だ。[^5]順調に進んでいる。

![](https://images.ctfassets.net/in6v9lxmm5c8/5WuLFNuA5qKAvbnAaAbbfg/512056b85ddfacac60c4f1d3680dfbc7/__________2023-09-03_14.45.17.png)

「Year!」という文字はもう削除してしまって、編集用のフォームを表示するコードを書こう。

```tsx:UserList.tsx
const UserList = () => {
  // ...

  return (
    <>
      {users === undefined ? (
        <tr>
          <td colSpan={6}>読み込み中...</td>
        </tr>
      ) : (
        users.map((user) => {
          return editingUserId === user.id ? (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                <input type="text" defaultValue={user.name} />
              </td>
              <td>
                <select defaultValue={user.role}>
                  <option value="admin">管理者</option>
                  <option value="editor">編集者</option>
                  <option value="viewer">閲覧者</option>
                </select>
              </td>
              <td>{user.createdAt}</td>
              <td>{user.updatedAt}</td>
              <td>
                <button>保存</button>
                <button onClick={() => setEditingUserId(undefined)}>
                  キャンセル
                </button>
              </td>
            </tr>
          ) : (
           // ...
          );
        })
      )}
    </>
  );
}
```

ブラウザで確認してみよう。編集ボタンを押した行がフォームになっているはずだ。これで編集機能の 1 つ目の要件は満たせた。

![](https://images.ctfassets.net/in6v9lxmm5c8/icUFNdxY1nwprAMMmirkW/4f217462ced26e711a3929fad6bd3c9d/__________2023-09-03_14.51.40.png)

## 行をコンポーネントに分割する

ここまでのコードを見ていると、`<tbody>` 要素の中身がだいぶ長くなってきた。なんだか嫌な匂いがする。React の条件分岐の中身が長くなるとコードはだいぶ読みづらくなってくる。どこからどこまでが条件が `true` のときに表示されるコードなのかわかりづらくなるからだ。一般的なアドバイスとして、条件分岐のブロックの中身はただ 1 つのコンポーネントを配置しておくのがよい。

まだ編集機能は完成していないが、区切りがいいのでここで一旦テーブルの行のコンポーネントに分割しておこう。以下の 3 つのコンポーネントを作成する。

- `<HeaderRow>`
- `<Loading>`
- `<UserRow>`
- `<EditingUserRow>`

こういった細かく分割されるコンポーネントは別のファイルに配置するか同じファイルに置いておくか結構迷う。まあひとまず `UserList.tsx` の中に書いておこう。気に入らなかったら後で移動すればいい。

`<HeaderRow>` と `<Loading>` は簡単だ。単にコピー・ペーストしてくればよい。

```tsx:UserList.tsx
const HeaderRow = () => {
  return (
    <tr>
      <th>ID</th>
      <th>名前</th>
      <th>ロール</th>
      <th>作成日時</th>
      <th>更新日時</th>
      <th>操作</th>
    </tr>
  );
};

const Loading = () => {
  return (
    <tr>
      <td colSpan={6}>読み込み中...</td>
    </tr>
  );
};
```

`<UserRow>` コンポーネントではユーザーのデータを表示するために `user` Props を渡す必要がある。さらに、編集ボタンが押されたときに `editingUserId` の状態を変更できるように、`onEditButtonClick` 関数を渡す。`onDeleteButtonClick` もそのうち必要になりそうだが、今必要ないことはやらない。

```tsx:UserList.tsx

type UserRowProps = {
  user: User;
  onClickEditButton: (id: number) => void;
};
const UserRow = ({ user, onClickEditButton }: UserRowProps) => {
  return (
    <tr key={user.id}>
      <td>{user.id}</td>
      <td>{user.name}</td>
      <td>{roleLabels[user.role]}</td>
      <td>{user.createdAt}</td>
      <td>{user.updatedAt}</td>
      <td>
        <button
          onClick={() => {
            onClickEditButton(user.id);
          }}
        >
          編集
        </button>
        <button>削除</button>
      </td>
    </tr>
  );
};
```

`<UserEditingRow>` でも同様に `user` 型を Props として渡す。さらに、編集モードを終了するために `onCanceled` 関数も渡す。

```tsx:UserList.tsx
type EditingUserRowProps = {
  user: User;
  onCanceled: () => void;
};

const EditingUserRow = ({ user, onCanceled }: EditingUserRowProps) => {
  return (
    <tr key={user.id}>
      <td>{user.id}</td>
      <td>
        <input type="text" defaultValue={user.name} />
      </td>
      <td>
        <select defaultValue={user.role}>
          <option value="admin">管理者</option>
          <option value="editor">編集者</option>
          <option value="viewer">閲覧者</option>
        </select>
      </td>
      <td>{user.createdAt}</td>
      <td>{user.updatedAt}</td>
      <td>
        <button>保存</button>
        <button onClick={() => onCanceled()}>キャンセル</button>
      </td>
    </tr>
  );
};
```

これでコンポーネントの分割が完了した。`UserList` コンポーネントの中身は以下のようになる。

```tsx:UserList.tsx
export const UserList = () => {
  const users = useUser();
  const [editingUserId, setEditingUserId] = useState<number | undefined>(
    undefined
  );

  const handleEditButtonClick = (id: number) => {
    setEditingUserId(id);
  };

  return (
    <>
      <h1>ユーザー一覧</h1>
      <table>
        <thead>
          <HeaderRow />
        </thead>
        <tbody>
          {users === undefined ? (
            <Loading />
          ) : (
            users.map((user) => {
              return editingUserId === user.id ? (
                <EditingUserRow
                  key={user.id}
                  user={user}
                  onCanceled={() => setEditingUserId(undefined)}
                />
              ) : (
                <UserRow
                  key={user.id}
                  user={user}
                  onClickEditButton={handleEditButtonClick}
                />
              );
            })
          )}
        </tbody>
      </table>
    </>
  );
};
```

だいぶスッキリしたんじゃないだろうか？リファクタリングが終わったら忘れずに画面を確認しよう。

## ユーザーの更新

後は更新ボタンを押したときに API をコールしてユーザーを更新する処理を書けば編集機能は完成だ。まずはフォームで編集した値を取得できるように、`EditingUserRow` コンポーネントの中で `useState` を使って `name` と `role` の状態を管理する。初期値は Props で渡ってきた `user` の値を使う。

```tsx:UserList.tsx
const EditingUserRow = ({ user, onCanceled }: EditingUserRowProps) => {
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);

  return (
    <tr key={user.id}>
      <td>{user.id}</td>
      <td>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </td>
      <td>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as User["role"])}
        >
          <option value="admin">管理者</option>
          <option value="editor">編集者</option>
          <option value="viewer">閲覧者</option>
        </select>
      </td>
      <td>{user.createdAt}</td>
      <td>{user.updatedAt}</td>
      <td>
        <button>保存</button>
        <button onClick={() => onCanceled()}>キャンセル</button>
      </td>
    </tr>
  );
};
```

更新ボタンを押したときに、API をコールするコードを書こう。ひとまず保存ボタンの `onClick` に渡す関数では、`console.log()` で `name` と `role` の値を表示してここまでの作業がうまく行っていることを確認する。

```tsx:UserList.tsx
const EditingUserRow = () => {
  // ...
  const handleSaveButtonClick = () => {
    console.log(name, role);
  };

  return (
    <tr key={user.id}>
      { /* ... */ }
      <td>
        <button
          onClick={() => {
            console.log(name, role);
          }}
        >
          保存
        </button>
        <button onClick={() => onCanceled()}>キャンセル</button>
      </td>
    </tr>
  );
};
```

さあ、いつものようにブラウザで確認してみよう。保存ボタンをクリックしたときに、フォームに入力した値がコンソールに表示されていれば成功だ。お祝いの準備をしておこう。

![](https://images.ctfassets.net/in6v9lxmm5c8/7BE3RLNOYh94Oru5qFklRE/03ed68c2e678782b77934f11fb453f8a/__________2023-09-03_15.26.26.png)

さあ、後は `console.log` の呼び出しを `fetch()` 関数の呼び出しに置き換えるだけだ。

```tsx:UserList.tsx
const EditingUserRow = ({ user, onCanceled }: EditingUserRowProps) => {
  const handleSaveButtonClick = async () => {
    await fetch(`http://localhost:3000/api/users/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        role,
      }),
    });

    // トーストメッセージで保存完了を表示するといいだろう。この記事では省略する。
  };
}
```

よし、データを更新する処理はうまくできているみたいだ。だが、1 つ問題を発見した。はじめは単に `fetch()` 関数を呼び出せば良いと思っていたが、更新した後にキャンセルボタンを押すと下のデータが表示されてしまう。そうだ、データを更新したのだからユーザーの一覧を再取得しないといけない。

いくつかの変更が必要だ。まずはデータを再取得できるようにするために、`useUser` の返り値に `refetch` を追加する。返り値の型は `User[] | undefined` から `{ user: User[] | undefined, refetch: () => void }` に変更する。破壊的変更ではあるものの、早めに変更の必要性に気づけてよかった。

```tsx:useUser.ts
import { useEffect, useState } from "react";
import type { User } from "./types";

export const useUser = () => {
  const [users, setUsers] = useState<User[] | undefined>(undefined);

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:3000/api/users");
    const users = await res.json();
    return users
  };

  useEffect(() => {
    let ignore = false;

    fetchUsers().then((users) => {
      if (!ignore) {
        setUsers(users);
      }
    });

    return () => {
      ignore = true;
    };
  }, []);

  return {
    users,
    refetch: async () => {
      setUsers(undefined);
      const users = await fetchUsers();
      setUsers(users);
    }
  }
};
```

コンポーネントで `useUser` を呼び出すときには、`users` と `refetch` を分割代入で受け取るようにする。

```tsx:UserList.tsx
const { users, refetch } = useUser();
```

さらに、`EditingUserRow` コンポーネントでユーザーの更新が完了したことが親コンポーネントから渡ってくるようにする。`onSaved` という Props を追加してする。`onSave` 関数では、ユーザーの再取得と編集モードの終了を行う。

```tsx:UserList.tsx
const UserList = () => {
  const { users, refetch } = useUser();
  const [editingUserId, setEditingUserId] = useState<number | undefined>(
    undefined
  );

  const onSaved = () => {
    refetch();
    setEditingUserId(undefined);
  };

  return (
    <>
      { /** ... */ }
            users.map((user) => {
              return editingUserId === user.id ? (
                <EditingUserRow
                  key={user.id}
                  user={user}
                  onCanceled={() => setEditingUserId(undefined)}
                  onSaved={() => onSaved()}
                />
            ) : (
              // ...
            );
    </>
  );
}
```

```tsx:UserList.tsx
type EditingUserRowProps = {
  user: User;
  onCanceled: () => void;
  onSaved: () => void;
};

const EditingUserRow = ({ user, onCanceled, onSaved }: EditingUserRowProps) => {
  const handleSaveButtonClick = async () => {
    await fetch(`http://localhost:3000/api/users/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        role,
      }),
    });

    onSaved();
  };
}
```

おっけー、これで編集機能は完成だ。ブラウザで確認してみよう。編集ボタンを押してフォームを表示し、フォームで値を変更して保存ボタンを押すと、ユーザーの一覧が再取得されて編集モードが終了して、元の表示に戻るはずだ。まだコードの中でちょっと気に入らないところがあるかもしれない、だがとりあえず完成だ。おめでとう！

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/5IbZrKvirdZVJmvSfVoelW/44d08e018e1397c0fcfe73bcf36ccde9/_____2023-09-03_15.55.15.mov" controls></video>

## ユーザーの削除

最後にユーザーの削除処理を実装する。削除ボタンを押したら、確認ダイアログを表示して、OK を押したら API をコールしてユーザーを削除する。おっと、削除が完了したらユーザー一覧を再取得するのを忘れないようにしよう。

```tsx
type UserRowProps = {
  user: User;
  onClickEditButton: (id: number) => void;
  onDeleted: () => void;
};
const UserRow = ({ user, onClickEditButton, onDeleted }: UserRowProps) => {
  const handleDeleteButtonClick = async () => {
    if (confirm("本当に削除しますか？")) {
      await fetch(`http://localhost:3000/api/users/${user.id}`, {
        method: "DELETE",
      });
      onDeleted();
    }
  };
  return (
    <tr key={user.id}>
      <td>{user.id}</td>
      <td>{user.name}</td>
      <td>{roleLabels[user.role]}</td>
      <td>{user.createdAt}</td>
      <td>{user.updatedAt}</td>
      <td>
        <button
          onClick={() => {
            onClickEditButton(user.id);
          }}
        >
          編集
        </button>
        <button
          onClick={() => {
            handleDeleteButtonClick();
          }}
        >
          削除
        </button>
      </td>
    </tr>
  );
};
```

```tsx:UserList.tsx
const UserList = () => {
  const { users, refetch } = useUser();

  const onDeleted = () => {
    refetch();
  };

  return (
    <>
      { /** ... */ }
            users.map((user) => {
              return editingUserId === user.id ? (
                // ...
              ) : (
                <UserRow
                  key={user.id}
                  user={user}
                  onClickEditButton={handleEditButtonClick}
                  onDeleted={() => onDeleted()}
                >
              );
            })
          )}
    </>
  );
};
```

削除処理はそんなに難しくない。一旦こんなものでいいだろう。ブラウザで確認してみよう。削除ボタンを押して確認ダイアログが表示され、OK を押すとユーザーが削除されるはずだ。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/3r6YuloHRduWpA2l4svrj2/80fce75075b05e9383b2d6807d0cb1ea/_____2023-09-03_16.02.45.mov" controls></video>

## リファクタリング！

とりあえず動くアプリケーションはできた！おめでとう！お待ちかねのリファクタリングの時間がやってきた。`<UserList>` のコンポーネントを分割するときに、ファイルを分割するかどうか迷ったところでそのままにしておいた。改めて `UserList.tsx` のファイルを見てみるとどうだろう。だいぶコードの行数も長くなってきた、お目当てのコンポーネントがどこにあるのか探すのが大変だ。

やっぱりファイルを分割するのがよく見える。判断が遅いと思うかもしれないが、実装が終わってから気づくことだっていっぱいある。はじめから完璧を目指すのは無理だ。

以下の 4 つのファイルに分割して、それぞれのファイルからコンポーネントを import するように変更しよう。ここでは詳細にコードの変更は書かないが、そう難しい作業でもないだろう。

- `pages/user/HeaderRow.tsx`
- `pages/user/Loading.tsx`
- `pages/user/UserRow.tsx`
- `pages/user/EditingUserRow.tsx`

分割が完了したら、忘れずに画面の確認を行おう。

次に、`<EditingUserRow>` コンポーネントを見てもらいたい。`<select>` のオプションは今のところべた書きにしているが、これは `User["role"]` 型と将来一致しなくなる危険性がある。`types.ts` で取りうるユーザーのロールの配列を定義しておき、`map()` で `<option>` を生成するように変更しよう。

さらに、`roles` から `Role` という型を生成しておくと、`User["role"]` と `Role` が一致するようになる。`User["role"]` という型を使っている箇所が好みじゃない、と言っていた伏線がここで回収される。

```tsx:types.ts
const roles = ["admin", "editor", "viewer"] as const;
export type Role = typeof roles[number];
export type User = {
  id: number;
  name: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
};
```

```tsx:EditingUserRow.tsx
import { Role, roles } from "../../types";

export const EditingUserRow = () => {
  const [role, setRole] = useState<Role>(user.role);

  return (
    <tr key={user.id}>
      { /* ... */ }
      <td>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {roleLabels[role]}
            </option>
          ))}
        </select>
      </td>
    </tr>
  );
};
```

これで `Role` 型を管理している箇所が 1 つになったので将来の変更に強くなれる。ここでも忘れずに画面の確認を行おう。

最後に、もう 1 箇所変更したいところがある。ユーザーの更新処理と削除処理では直接 `fetch()` 関数を呼び出しているが、`useUser` のようにフックで抽象化しておきたい。API クライアントが実際に何が使われているかコンポーネントからは意識したくないからだ。`useUserMutations` というフックを作成して、`{ updateUser, deleteUser }` というオブジェクトを返すようにする。

```tsx:useUserMutations.ts
import { UserInput } from "./types";

export const useUserMutations = () => {
  const updateUser = (input: UserInput) => {
    return fetch(`http://localhost:3000/api/users/${input.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
  };

  const deleteUser = (id: number) => {
    return fetch(`http://localhost:3000/api/users/${id}`, {
      method: "DELETE",
    });
  };

  return {
    updateUser,
    deleteUser,
  };
};
```

`type.ts` に `UserInput` という型も追加しておこう。

```tsx:types.ts
export type UserInput = {
  name: string;
  role: Role;
};
```

あとは、`<UserRow>` と `<EditingUserRow>` でそれぞれフックを呼び出すように修正するだけだ。この修正が完了したら、忘れずに画面の確認を行おう。

ここまでの作業でリファクタリングも終了だ！お疲れ様！リファクタリングごとになにか壊していないか確認を行ったことで、安心感と持ちながら進められたんじゃないだろうか？これをはじめからコード分割して進めようとしていたら、確認する指標がないので、途中で挫折してしまうかもしれない。まずは動くコードを書いて、その挙動を確認しつつリファクタリングするのがよいと思う。

実はこの考え方は、テスト駆動開発という手法にも通じるものがある。テスト駆動開発では、まずテストを書いて、テストが失敗することを確認する。その後でテストをパスするコードを書く。そして、リファクタリングを行う。リファクタリングの際には、テストが失敗しないことを確認する。今回はテストコードは書いていないが、それでもテスト駆動開発の考え方を取り入れることで、スムーズに開発を進めることができた。

## まとめ

- まずは動くコードを書く
- その後でリファクタリングしてコードをきれいにする
- リファクタリングのたびになにか壊していないか確認する

[^1]: そうじゃないって人もいるかも
[^2]: コードを誤ってコミットしないように注意しよう
[^3]: 僕の相棒だ
[^4]: すでに愛着が湧いてしまっているなら話は別だ
[^5]: Year!
