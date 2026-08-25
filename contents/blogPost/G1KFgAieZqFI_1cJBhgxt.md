---
id: G1KFgAieZqFI_1cJBhgxt
title: "IndexedDB の基礎から実践まで、React と Dexie.js でタスク管理アプリを作る"
slug: "indexeddb-react-dexie-task-app"
about: "IndexedDB は、構造化されたデータをブラウザへ保存できる非同期・トランザクション型のデータベースです。この記事では素の IndexedDB API で基本的な仕組みを確認した後、React と Dexie.js でタスク管理アプリを実装します。"
createdAt: "2026-08-22T14:56+09:00"
updatedAt: "2026-08-23T20:04+09:00"
tags: ["JavaScript", "React"]
audio: null
selfAssessment:
  quizzes:
    - question: "IndexedDB でオブジェクトストアやインデックスを作成・削除できるタイミングはいつですか?"
      answers:
        - text: "任意の readwrite トランザクションを開始したとき"
          correct: false
          explanation: "readwrite トランザクションは既存のオブジェクトストアにあるレコードを変更するためのものです。スキーマは変更できません。"
        - text: "データベースのバージョン更新で作られる versionchange トランザクションの中"
          correct: true
          explanation: "記事で説明した通り、オブジェクトストアやインデックスの変更は upgradeneeded イベントで作られる versionchange トランザクションの中で行います。"
        - text: "IDBRequest の success イベントが完了した後"
          correct: false
          explanation: "success イベントは個別のリクエスト結果を受け取るためのものです。スキーマを変更できるタイミングではありません。"
        - text: "データベースへの接続を close() した後"
          correct: false
          explanation: "接続を閉じた状態ではデータベースを操作できません。新しいバージョンで開き、versionchange トランザクションを使います。"
    - question: "IndexedDB の readwrite トランザクション内で fetch() の完了を待つべきではない理由はどれですか?"
      answers:
        - text: "IndexedDB からネットワークへのアクセスが仕様で禁止されているため"
          correct: false
          explanation: "fetch() 自体が禁止されているわけではありません。問題になるのは IndexedDB のトランザクションの寿命です。"
        - text: "fetch() を呼び出すとトランザクションが必ず abort されるため"
          correct: false
          explanation: "fetch() の呼び出しが直接 abort を発生させるわけではありません。待機中にトランザクションが自動コミットへ進む可能性があります。"
        - text: "待機中にトランザクションが自動コミットされ、後続の操作が TransactionInactiveError になる可能性があるため"
          correct: true
          explanation: "トランザクションに新しいリクエストがない状態でイベントループへ制御が戻ると、自動コミットへ進む可能性があります。"
        - text: "fetch() のレスポンスは structured clone algorithm に対応していないため"
          correct: false
          explanation: "この記事で扱った問題は保存可能な値の種類ではなく、トランザクションがアクティブである期間です。"

published: true
---

Web アプリケーションで入力したデータをブラウザに残したいとき、よく使われる選択肢が `localStorage` です。しかし、構造化されたデータを大量に保存する用途では、単純な文字列の保存だけでは扱いづらくなります。[IndexedDB](https://w3c.github.io/IndexedDB/) は、このようなデータをブラウザ内に保存するための API です。キーによる検索、インデックス、トランザクションを備えており、JavaScript のオブジェクトを非同期に読み書きできます。

とはいえ、ブラウザへ保存したいデータのすべてが IndexedDB に向いているわけではありません。テーマの設定、サイドバーを開いているかどうか、直前に選択していたタブといった数 KB のキーと値であれば、`localStorage` のほうが簡潔です。`localStorage` は同期 API であるため、コードもシンプルになります。一方、IndexedDB は非同期 API であり、データベースを開いて値を取得するまでに何度かイベントループをまたぎます。

多くのサーバークライアントアプリの場合は `localStorage` で十分です。大量のデータを構造化して保存したいのならば、サーバー側のデータベースを使うほうが簡単でより信頼できるためです。オフライン環境でも動作するノートアプリやタスク管理アプリ、チャットアプリなどでは、IndexedDB が有効な選択肢になります。オフラインで編集した内容を IndexedDB に保存し、ネットワークが復帰したときにサーバーへ送信する、といった使い方です。

IndexedDB は、以下のような Web アプリケーションでも採用されています。パフォーマンス、オフライン編集、未送信データの保護、サーバーとの同期など、さまざまな用途で活用されていることがわかります。

- Linear: ワークスペースのデータと未送信の変更をローカルへ保存し、画面表示や楽観的更新をネットワークの応答から切り離す。[第三者による技術分析](https://performance.dev/how-is-linear-so-fast-a-technical-breakdown)では、IndexedDB からメモリ上のデータへ復元する構成が報告されている
- Figma: オフライン中に発生した編集内容をファイル全体ではなく差分として保存し、タブを閉じた後の復元と再接続後の送信に使う。[Figma の技術記事](https://www.figma.com/blog/behind-the-feature-autosave/)では、ファイルとノード単位に変更を分割して保存すると説明されている
- Slack: メモリ上の Redux store のコピーを保存し、次回起動時に高速に復元したり、以前に読んだ会話をオフラインで閲覧できる状態を作る。[Slack の技術記事](https://slack.engineering/service-workers-at-slack-our-quest-for-faster-boot-times-and-offline-support/)では、Service Worker のキャッシュと組み合わせた例が紹介されている
- Notion: ユーザーの操作をトランザクションとしてキューへ保存し、サーバーで永続化または拒否されるまで保持する。[Notion の技術記事](https://www.notion.com/blog/data-model-behind-notion)では、プラットフォームに応じて IndexedDB または SQLite を使用すると説明されている

この記事では、まず IndexedDB の基本的な仕組みを確認します。続いて [Dexie.js](https://dexie.org/) を使い、React でタスクの追加・更新・削除・絞り込みができるアプリを実装します。

## IndexedDB とは

IndexedDB はブラウザに組み込まれた、オブジェクト指向のデータベースです。[Indexed Database API 3.0](https://w3c.github.io/IndexedDB/#introduction) では、単純な値や階層を持つオブジェクトのレコードを保存する API として定義されています。文字列だけでなく、数値、日付、配列、`Blob`（画像など）といった [structured clone algorithm](https://html.spec.whatwg.org/multipage/structured-data.html#structured-clone) で複製できる値を保存できます。

IndexedDB は、リレーショナルデータベースのテーブルのように、すべてのプロパティ名や型を列として定義しません。同じオブジェクトストアの中でも異なるプロパティを持てるスキーマレスのデータベースです。オブジェクトストアのレコードは、JavaScript のオブジェクトとして保存されます。

基本的な操作は、リレーショナルデータベースに似ています。オブジェクトストアを作成し、レコードを追加・更新・削除し、キーやインデックスで検索します。たとえば、タスクを次のオブジェクトとして保存するとします。

```ts
interface Task {
  id: string;
  title: string;
  status: "todo" | "done";
  createdAt: number;
}
```

`tasks` オブジェクトストアへ `id` をキーとして保存した場合、特定の ID のタスクはオブジェクトストアの `get()` で取得できます。

```ts
const transaction = database.transaction("tasks", "readonly");
const store = transaction.objectStore("tasks");
const request = store.get(taskId);
```

一方、主キーではない `status` にインデックスがない場合、`status === "todo"` のレコードだけを指定して取得できません。単純な方法では、`getAll()` で全件を取得してから JavaScript で絞り込む必要があります。

```ts
const transaction = database.transaction("tasks", "readonly");
const store = transaction.objectStore("tasks");
const request = store.getAll();

// 取得に成功したら success イベントが発火する
request.addEventListener("success", () => {
  const todoTasks = request.result.filter(
    (task: Task) => task.status === "todo",
  );
});
```

`openCursor()` を使えばレコードを 1 件ずつ確認できるため、すべてのレコードを配列としてメモリに載せずに済みます。ただし、条件に一致するレコードを探すために全件を走査する点は同じです。

あらかじめ `status` にインデックスを作成しておけば、インデックスへ `"todo"` を指定して該当するレコードを取得できます。

```ts
const transaction = database.transaction("tasks", "readonly");
const store = transaction.objectStore("tasks");
const statusIndex = store.index("status");
const request = statusIndex.getAll("todo");
```

IndexedDB の処理は原則として非同期です。`success`、`error` イベントから結果を受け取るイベント駆動型の API として設計されています。

```ts
let task: Task | undefined;
const request = store.get(taskId);
request.addEventListener("success", () => {
  task = request.result;
});
```

## IndexedDB API でタスクを保存する

IndexedDB API を使用した処理を行うために、まずはデータベースを開く必要があります。`indexedDB.open()` の第 1 引数にはデータベース名、第 2 引数にはバージョンを渡します。ここでのバージョンは、データベースのスキーマを変更する際に使います。つまり、バージョンごとにオブジェクトストアやインデックスの構造が変わる可能性があるため、バージョン番号を上げることでスキーマ変更を通知するのです。

```ts:src/native-indexeddb.ts
const DATABASE_NAME = "native-indexeddb-task-app";
const STORE_NAME = "tasks";

// indexedDB はイベント駆動の API なので、そのままでは少し扱いづらい
// Promise として扱えるようにラップする
function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.addEventListener("success", () => resolve(request.result));
    request.addEventListener("error", () => reject(request.error));
  });
}

async function openTaskDatabase(): Promise<IDBDatabase> {
  // DB 名とバージョンを指定してデータベースを開く
  const request = indexedDB.open(DATABASE_NAME, 1);

  // データベースが初めて作られるときや、バージョンが上がったときに upgradeneeded イベントが発生する
  request.addEventListener("upgradeneeded", () => {
    const database = request.result;
    // オブジェクトストアやインデックスは upgradeneeded の中でのみ作成できる
    const store = database.createObjectStore(STORE_NAME, {
      // ここで指定した keyPath のプロパティが主キーになる
      keyPath: "id",
    });
    // status プロパティにインデックスを作成する
    store.createIndex("status", "status");
  });

  return requestToPromise(request);
}
```

初めてデータベースを開く場合や、`open()` に渡したバージョンが既存のバージョンより大きい場合には、`upgradeneeded` イベントが発生します。オブジェクトストアやインデックスを作成・削除できるのは、このとき自動的に作られる `versionchange` トランザクションの中だけです。

この例では `keyPath: "id"` を指定しているため、保存するオブジェクトの `id` プロパティが主キーになります。`createIndex` メソッドでインデックスを作成します。`createIndex("status", "status")` の第 1 引数はインデックスの名前、第 2 引数には検索対象として使うレコードのプロパティを指定します。

タスクを追加する処理では、`readwrite` トランザクションを作成して `add()` を呼び出します。データベース内のデータの読み取りや変更は必ずトランザクションの中で行う必要があります。

```ts:src/native-indexeddb.ts
function transactionDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.addEventListener("complete", () => resolve());
    transaction.addEventListener("abort", () => reject(transaction.error));
    transaction.addEventListener("error", () => reject(transaction.error));
  });
}

async function addTask(task: Task): Promise<void> {
  const database = await openTaskDatabase();
  // トランザクションの対象とするオブジェクトストア名とモードを指定する
  const transaction = database.transaction(STORE_NAME, "readwrite");

  // オブジェクトストアを取得して add() を呼び出す
  transaction.objectStore(STORE_NAME).add(task);

  // トランザクションの完了を `complete` イベントで待機する
  await transactionDone(transaction);
  database.close();
}
```

`add()` を呼び出した後はトランザクションの `complete` イベントを待機します。個々のリクエストが成功した後にトランザクション全体が失敗する可能性があるため、変更がコミットされたことを確認するにはトランザクションの完了を待ちます。

:::warning
トランザクションの処理中にユーザーがタブやブラウザを閉じた場合、未完了の書き込みが保存されない可能性があります。回避策として、アンロード時にトランザクションが完了していないことをユーザーに警告するための beforeunload イベントを追加するとよいでしょう。
:::

すべてのタスクを読み取る場合は、`readonly` トランザクションの中で `getAll()` を呼び出します。

```ts:src/native-indexeddb.ts
import type { Task } from "./db";

async function getTasks(): Promise<Task[]> {
  const database = await openTaskDatabase();
  const transaction = database.transaction(STORE_NAME, "readonly");
  const request = transaction.objectStore(STORE_NAME).getAll();

  const tasks = await requestToPromise(request);
  await transactionDone(transaction);
  database.close();
  return tasks;
}
```

:::note
`readwrite` トランザクションでもデータを読み取れますが、読み取りだけの処理で常に使うべきではありません。同じオブジェクトストアを対象とするトランザクションは、`readwrite` と実行期間が重なる場合に待機することがあります。一方、[`readonly` トランザクション同士は対象が重なっても並行して開始できます](https://w3c.github.io/IndexedDB/#transaction-scheduling)。不要な待機と意図しない書き込みを避けるため、取得だけなら `readonly`、追加・更新・削除を含む場合は `readwrite` を使います。
:::

### スキーマをバージョンアップする

アプリケーションを運用していると、あとからインデックスを追加したくなることがあります。たとえば、タスクの更新日時を `updatedAt` として保存し、更新日時の順で並べたくなったとします。

すでに説明したとおり、インデックスを作成できるのは `versionchange` トランザクションの中だけです。そのため、`open()` へ渡すバージョン番号を上げて `upgradeneeded` を発生させます。バージョンは 1 以上の整数であり、下げることはできません。現在よりも小さいバージョンを指定して `open()` を呼び出すと `VersionError` になります。

ここで注意したいのは、どのバージョンから更新されたのかによって必要な処理が変わる点です。すでに v1 を使っているユーザーの端末では v1 から v2 への差分だけが必要ですが、初めて訪れたユーザーの端末ではオブジェクトストアの作成から行う必要があります。イベントの `oldVersion` プロパティから変更前のバージョンを取得できるため、この値を使って条件分岐します。

```ts:src/native-indexeddb.ts
const DATABASE_VERSION = 2;

async function openTaskDatabase(): Promise<IDBDatabase> {
  // バージョンをあげて open() を呼び出す
  const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

  request.addEventListener("upgradeneeded", (event) => {
    const database = request.result;
    // upgradeneeded の中では request.transaction から versionchange トランザクションを取得できる
    const transaction = request.transaction!;

    // データベースが存在しなかった場合、oldVersion は 0 になる
    // この場合は初めて訪れたユーザーの端末なので、オブジェクトストアを作成する
    if (event.oldVersion < 1) {
      const store = database.createObjectStore(STORE_NAME, { keyPath: "id" });
      store.createIndex("status", "status");
    }

    // v1 からの更新でも、新規作成でもここを通る
    if (event.oldVersion < 2) {
      const store = transaction.objectStore(STORE_NAME);
      // 新しく updatedAt プロパティにインデックスを作成する
      store.createIndex("updatedAt", "updatedAt");

      // 既存のレコードへ updatedAt を書き込む
      const cursorRequest = store.openCursor();
      cursorRequest.addEventListener("success", () => {
        const cursor = cursorRequest.result;
        if (!cursor) return;

        cursor.update({ ...cursor.value, updatedAt: cursor.value.createdAt });
        cursor.continue();
      });
    }
  });

  return requestToPromise(request);
}
```

`oldVersion < 1`、`oldVersion < 2` のように条件を並べることで、v1 のユーザーは 2 つ目のブロックだけを、新規のユーザーは両方のブロックを実行します。しばらくアプリを訪れていなかったユーザーが v1 から v3 へ一度に更新する場合でも、同じ書き方で対応できます。

データの書き換えも、同じ `versionchange` トランザクションの中で行います。上記の例ではカーソルで既存のレコードを 1 件ずつ読み取り、`updatedAt` を追加してから `update()` で書き戻しています。`upgradeneeded` のリスナーを抜けた時点ではコミットされず、カーソルの走査を含むすべてのリクエストが完了してからコミットされます。

!> インデックスへ登録されるのは、対象のプロパティが有効なキーを持つレコードだけです。`undefined` や `null` はキーとして扱えないため、`updatedAt` を持たないレコードは `updatedAt` インデックスから取得できません。既存のレコードへ値を書き込んでいるのはこれが理由です。

最後に、複数のタブで開かれている場合を考えます。あるタブが v1 の接続を保持したまま別のタブが v2 で `open()` を呼び出すと、`upgradeneeded` は発生せず `blocked` イベントが発生します。古い接続が閉じられるまで、バージョンアップは始まりません。

```ts
const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

request.addEventListener("blocked", () => {
  // 古いバージョンを開いたままの接続が残っている
  // ほかのタブを閉じるようユーザーへ促す
});
```

これを避けるために、開いている接続の側で `versionchange` イベントを処理して接続を閉じます。

```ts
database.addEventListener("versionchange", () => {
  // ほかのタブがバージョンアップしようとしている
  database.close();
  // 以降このタブではデータベースを操作できないため、再読み込みを促す
});
```

`close()` を呼び出すと、待機していた `open()` の処理が進んでバージョンアップが行われます。この 2 つのイベントを扱わないと、ユーザーが古いタブを開いたままにしているあいだ、アプリケーションを更新できない状態が続いてしまいます。

### トランザクションの途中で別の非同期処理を待たない

IndexedDB のトランザクションは短時間で完了することを想定しています。仕様では、トランザクションに新しいリクエストがなく、イベントループへ制御が戻ると自動的にコミット処理へ進みます。

そのため、次のようにトランザクションの途中で `fetch()` を待つコードは安全ではありません。

```ts
const transaction = database.transaction("tasks", "readwrite");
const store = transaction.objectStore("tasks");
const task = await requestToPromise(store.get(taskId));

const response = await fetch(`/api/tasks/${taskId}`);
const changes = await response.json();

// fetch() を待っている間にトランザクションが終了している可能性がある
store.put({ ...task, ...changes });
```

この場合、`put()` で `TransactionInactiveError` が発生する可能性があります。ネットワークから必要な値を取得してからトランザクションを開始するか、トランザクション内では IndexedDB のリクエストだけを連続して実行してください。

## IndexedDB を扱うライブラリ

IndexedDB のラッパーは、Promise 化だけを行う小さなライブラリから、リアクティブなクエリや同期まで提供するデータベースライブラリまでさまざまです。ここでは `idb`、Dexie.js をそれぞれ紹介します。

### IndexedDB の構造を保ったまま Promise 化する `idb`

[`idb`](https://github.com/jakearchibald/idb) は、IndexedDB API をほぼそのまま保ちながら、`IDBRequest` を Promise に変換する小さなラッパーです。`openDB()` の `upgrade` コールバックでスキーマを定義し、`get()`、`put()` などの結果を `await` できます。

```ts
import { openDB } from "idb";

const database = await openDB("task-app", 1, {
  upgrade(database) {
    const store = database.createObjectStore("tasks", { keyPath: "id" });
    store.createIndex("status", "status");
  },
});

await database.add("tasks", task);
const tasks = await database.getAll("tasks");
```

オブジェクトストア、トランザクション、インデックスといった IndexedDB の考え方はそのままです。既存の IndexedDB コードを少しずつ Promise ベースへ移行したい場合や、ブラウザ API に近い抽象度を保ちたい場合に向いています。

### クエリとリアクティブな更新を提供する Dexie.js

[Dexie.js](https://dexie.org/docs/Dexie.js) も IndexedDB に特化したラッパーですが、スキーマ定義、クエリ、エラー処理、トランザクションなど、より高水準な API を提供します。`dexie-react-hooks` の `useLiveQuery()` を使うと、クエリ結果に影響する変更がコミットされたときに React コンポーネントを再レンダリングできます。

実際の使用方法は次の章で紹介します。

## React と Dexie.js でタスク管理アプリを作る

ここからは React と Dexie.js を使ってタスク管理アプリを実装します。プロジェクトを作成し、`dexie` と `dexie-react-hooks` をインストールします。

```bash
npm create vite@8 indexeddb-task-app -- --template react-ts
cd indexeddb-task-app
npm install
npm install dexie@4.4.5 dexie-react-hooks@4.4.0
npm run dev
```

### データベースとインデックスを定義する

`src/db.ts` ファイルを作成し、タスクの型とデータベースを定義します。

```ts:src/db.ts
import Dexie, { type Table } from "dexie";

export type TaskStatus = "todo" | "done";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  createdAt: number;
}

export const db = new Dexie("indexeddb-react-task-app") as Dexie & {
  // Task をレコード、string を主キーの型として指定する
  tasks: Table<Task, string>;
};

db.version(1).stores({
  tasks: "id, status, createdAt",
});
```

`new Dexie("indexeddb-react-task-app")` でデータベースを作成します。`as Dexie & { tasks: Table<Task, string> }` の部分は、TypeScript による型付けです。`db.tasks` が `Table<Task, string>` 型であることを明示することにより、`db.tasks.add()` へ渡す値や `db.tasks.get()` の戻り値、主キーの型を TypeScript が検査します。ただし、あくまでコンパイル時の型付けであり、実行時に Dexie.js が型を検証するわけではありません。

`version(1)` は IndexedDB のバージョンに対応します。`stores()` にはオブジェクトストアごとのキーとインデックスを指定します。`tasks: "id, status, createdAt"` は `id` が主キー、`status` と `createdAt` がインデックスであることを意味します。

Dexie.js のスキーマへ列をすべて列挙する必要はなく、主キーと検索に使うプロパティだけを指定します。`title` はレコードの一部として保存されますが、インデックスを作っていないため `where("title")` の検索には使用できません。

### `useLiveQuery()` でタスクを表示する

タスクの取得には `dexie-react-hooks` の [`useLiveQuery()`](https://dexie.org/docs/dexie-react-hooks/useLiveQuery%28%29) を使います。`useLiveQuery()` は初回にデータを取得するだけでなく、コールバック内で読み取った IndexedDB のデータを監視します。Dexie.js を通じた追加・更新・削除がクエリ結果へ影響する可能性がある場合、クエリを再実行して React コンポーネントを再レンダリングします。

この例では、フィルターが `all` の場合はすべてのタスクを取得し、それ以外では `status` インデックスを使って絞り込みます。

```tsx:src/App.tsx
import { type FormEvent, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, type TaskStatus } from "./db";

type Filter = "all" | TaskStatus;

export function App() {
  const [filter, setFilter] = useState<Filter>("all");
  const tasks = useLiveQuery(
    () =>
      filter === "all"
        ? db.tasks.orderBy("createdAt").reverse().toArray()
        : db.tasks
            .where("status")
            .equals(filter)
            .reverse()
            .sortBy("createdAt"),
    [filter],
    [],
  );

  // フォームと一覧は後で追加する
}
```

`useLiveQuery()` の第 1 引数は Dexie.js のクエリを実行する関数です。第 2 引数は React の `useEffect()` と同じ役割の依存配列であり、`filter` が変わると新しい条件でクエリを実行します。クエリは以下のように組み立てます。

1. `where("status").equals(filter)` で `status` インデックスを使って絞り込む
2. `reverse()` で降順にする
3. `sortBy("createdAt")` で `createdAt` の値を使ってソートする。`sortBy()` は `reverse()` の指定を引き継ぐため、結果は `createdAt` の降順になる

第 3 引数の `[]` は、初回の IndexedDB クエリが完了する前に `tasks` へ返す値です。この引数を省略した場合、初回レンダリング時の `tasks` は `undefined` になります。

同じタブだけでなく、同一オリジンの別のタブや Web Worker で Dexie.js を通じて行われた変更もライブクエリへ反映されます。

### タスクを追加する

フォームが送信されたら、`db.tasks.add()` でタスクを追加します。

```tsx:src/App.tsx
const addTask = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const formElement = event.currentTarget;
  const formData = new FormData(formElement);
  const title = String(formData.get("title") ?? "").trim();

  if (!title) return;

  await db.tasks.add({
    id: crypto.randomUUID(),
    title,
    status: "todo",
    createdAt: Date.now(),
  });
  formElement.reset();
};
```

`add()` が完了すると `useLiveQuery()` が変更を検知するため、取得したタスクを React の state へ手動で追加する必要はありません。テーブルの作成の際に型を指定しているため、`add()` へ渡すオブジェクトのプロパティが不足していると TypeScript が警告します。

フォームは以下のようになります。

```tsx:src/App.tsx
<form onSubmit={addTask}>
  <label htmlFor="task-title">新しいタスク</label>
  <input id="task-title" name="title" autoComplete="off" required />
  <button type="submit">追加</button>
</form>
```

### タスクを更新・削除する

チェックボックスが変更されたら、`db.tasks.update()` で `status` を切り替え、削除ボタンが押されたら `db.tasks.delete()` でタスクを削除します。それぞれ第 1 引数に主キーを渡すことで、該当するレコードを更新・削除できます。

```tsx:src/App.tsx
<ul>
  {tasks.map((task) => (
    <li key={task.id}>
      <label>
        <input
          type="checkbox"
          checked={task.status === "done"}
          onChange={async () => {
            // タスクを更新
            await db.tasks.update(task.id, {
              status: task.status === "done" ? "todo" : "done",
            });
          }}
        />
        <span>{task.title}</span>
      </label>
      <button
        type="button"
        // タスクを削除
        onClick={() => db.tasks.delete(task.id)}
      >
        削除
      </button>
    </li>
  ))}
</ul>
```

最後にフィルターを切り替えるボタンも追加しておきましょう。

```tsx:src/App.tsx
<div>
  {(["all", "todo", "done"] as const).map((value) => (
    <button
      type="button"
      key={value}
      onClick={() => setFilter(value)}
    >
      {{ all: "すべて", todo: "未完了", done: "完了" }[value]}
    </button>
  ))}
</div>
```

実際に試してみると、以下のようにタスクの CRUD 操作が行えることが確認できました。ページを再読み込みしても、IndexedDB に保存されたタスクが表示されます。

![IndexedDB に保存された未完了と完了のタスクを表示するタスク管理画面](https://images.ctfassets.net/in6v9lxmm5c8/2qx8N2sKTZAL7SzCKHm6ml/ba42c8a90034c0f4ca4fa107526c1cac/image.png)

Chrome の DevTools で Application パネルを開き、Storage の IndexedDB から `indexeddb-react-task-app`、`tasks` の順に選択すると、追加したキーと値が表示されます。`status`, `createdAt` インデックスも同様に確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/01KEuS4vLoeiTlPKqIhCtw/82c5f3b2b58f7e9fe3d7d43f9fefc3ee/image.png)

![](https://images.ctfassets.net/in6v9lxmm5c8/3oE9hO8zjenHbnbdVDNpqC/4465405242fc1f6a616299d92b90b1eb/image.png)

### あとからインデックスを追加する

Dexie.js でも、インデックスを追加するにはバージョンの更新が必要です。IndexedDB API で書いた `upgradeneeded` の分岐は、`version()` を並べる形に置き換えられます。ここでは先ほどと同じように、`updatedAt` インデックスを追加してみましょう。

```ts:src/db.ts
export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  createdAt: number;
  updatedAt?: number;
}

db.version(1).stores({
  tasks: "id, status, createdAt",
});

db.version(2)
  .stores({
    // 変更するオブジェクトストアは、インデックスをすべて書き直す
    tasks: "id, status, createdAt, updatedAt",
  })
  .upgrade((transaction) =>
    transaction
      .table<Task>("tasks")
      .toCollection()
      .modify((task) => {
        task.updatedAt = task.createdAt;
      }),
  );
```

`stores()` へ渡すのは変更のあったオブジェクトストアだけですが、そのオブジェクトストアについては主キーとインデックスをすべて列挙します。また、`version(1)` の定義は消さずに残す必要があります。まだ v1 のデータベースを持っているユーザーの端末では、v1 から v2 への変換が必要になるためです。

`upgrade()` に渡した関数は `upgradeneeded` と同じ `versionchange` トランザクションの中で実行されます。`modify()` で書き換えた値はそのまま保存されます。Dexie.js が `oldVersion` に応じて必要な `upgrade()` だけを順番に実行するため、元のコードのような分岐を自分で書く必要もありません。

## まとめ

- IndexedDB は、JavaScript の構造化された値をオブジェクトストアへ保存し、キー、インデックス、トランザクションを使って非同期に読み書きできるブラウザ標準 API
- 数 KB のキーと値を保存するだけであれば `localStorage` で十分であり、レコードの増加、条件による絞り込み、`Blob` の保存といった要件が出てきたときに IndexedDB を検討する
- IndexedDB API では、リクエストとトランザクションそれぞれの完了、スキーマ更新、短いトランザクション寿命を意識する必要がある
- インデックスの追加にはバージョンの更新が必要であり、`oldVersion` による分岐、既存レコードの書き換え、`blocked` と `versionchange` の処理を考える。Dexie.js では `version(2).stores().upgrade()` として宣言できる
- `idb` は IndexedDB に近い Promise ラッパーであり、Dexie.js はスキーマ、クエリ、React 向けライブクエリまで提供する
- React と Dexie.js で実装したタスク管理アプリでは、CRUD、`status` インデックスによる絞り込み、`useLiveQuery()` によるリアクティブな更新が行える

## 参考

- [Indexed Database API 3.0](https://w3c.github.io/IndexedDB/)
- [IndexedDB API - MDN](https://developer.mozilla.org/ja/docs/Web/API/IndexedDB_API)
- [Updates to Storage Policy - WebKit](https://webkit.org/blog/14403/updates-to-storage-policy/)
- [idb - GitHub](https://github.com/jakearchibald/idb)
- [Dexie.js Documentation](https://dexie.org/docs)
- [Get started with Dexie in React](https://dexie.org/docs/Tutorial/React)
