---
id: pDLcGnNSxgFLzsaqZjHC9
title: "Void でフルスタックアプリを構築して Cloudflare にデプロイする"
slug: "void-vite-cloudflare-deploy"
about: "Void は VoidZero が開発した、Vite でフルスタックアプリを構築して Cloudflare にデプロイするためのツールキットです。void/db などの import から必要なリソースを推論し、void deploy コマンド 1 つでD1 データベースの作成、ビルド、マイグレーション、公開までを行います。この記事では、D1 を使ったメモアプリを React で構築し、Cloudflare にデプロイするまでの手順を紹介します。"
createdAt: "2026-10-17T15:48+09:00"
updatedAt: "2026-10-17T15:48+09:00"
tags: ["Vite", "Cloudflare", "Void"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/61nK7Q7xk5ZadYORsbxHte/c939a2391f7a9943ac44609635962503/matsutake_kagomori_5446-768x609.png"
  title: "松茸のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Pages モードで、ページコンポーネントが受け取る props の型を loader と同期させる方法はどれですか？"
      answers:
        - text: "コンポーネント側で props の型を手書きし、loader の戻り値と一致させる"
          correct: false
          explanation: "手書きでは loader の変更に追従できません。記事では InferProps で loader の戻り値から型を取り出しています。"
        - text: ".server.ts で InferProps<typeof loader> を Props として export し、コンポーネントで import する"
          correct: true
          explanation: "InferProps で loader の戻り値の型を取り出して export することで、loader を変更するとコンポーネント側の型も追従します。"
        - text: "void/client の fetch で loader を呼び出し、戻り値の型を利用する"
          correct: false
          explanation: "void/client の fetch は routes/ の API ルートを呼び出すためのもので、ページの props の型付けには InferProps を使います。"
        - text: "db/schema.ts のテーブル定義をそのまま props の型として使う"
          correct: false
          explanation: "props は loader の戻り値そのものなので、記事では InferProps<typeof loader> で型を導出しています。"
    - question: "routes/api/memos.ts が GET だけを export しているとき、void/client の fetch で起こることとして正しいものはどれですか？"
      answers:
        - text: "fetch('/api/memos', { method: 'POST' }) は実行時に 405 エラーになるが、型チェックは通る"
          correct: false
          explanation: "void/client の fetch は export されたメソッドから型を生成するため、POST を指定するとコンパイルエラーになります。"
        - text: "fetch('/api/memo') のように存在しないパスを指定するとコンパイルエラーになる"
          correct: true
          explanation: "fetch は routes/ の定義から型を生成するため、存在しないパスは型エラーになると記事で確認されています。"
        - text: "戻り値の型は unknown になるため、自分で型アサーションする必要がある"
          correct: false
          explanation: "戻り値はハンドラーの戻り値から推論され、記事の例では { total: number } になります。"
        - text: "fetch を使うには routes/ のハンドラーを withValidator で定義する必要がある"
          correct: false
          explanation: "withValidator はリクエストの検証に使うもので、記事の GET ルートは defineHandler だけで型付き fetch から呼び出せています。"
published: true
---

[Void](https://void.cloud) は Vite でフルスタックアプリを構築して Cloudflare にデプロイするためのツールキットです。Vite や Vitest、Oxc、Rolldown を開発している VoidZero が開発し、同社が Cloudflare に加わった後の 2026 年 10 月 15 日にオープンソース（MIT ライセンス）として公開されました。コードで `void/db` を import するだけでローカルのデータベースが使えるようになり、`void deploy` を実行すると Cloudflare の D1 データベースが自動で作成されます。

この記事では、Void を使って D1 にデータを保存するメモアプリを React で構築し、Cloudflare にデプロイするまでの手順を紹介します。

## Void とは

[Cloudflare の公式ブログ](https://blog.cloudflare.com/deploy-with-void/)によると、Void は次の 3 つで構成されています。

- Void SDK: Vite でフルスタックアプリを構築するための JavaScript SDK。ファイルベースのルーティング、プリレンダリング、データベースから UI までの型安全性などを提供する
- Void CLI: リソースのプロビジョニングとデプロイを行う CLI。Cloudflare の新しい `cf` CLI の上に構築されている
- Void Platform: チームで Void アプリをホスティングするためのデプロイ基盤。自分の Cloudflare アカウント上の Workers for Platforms でセルフホストできる

これらはすべて `void` という 1 つの npm パッケージと Vite プラグインとして提供されています。この記事では SDK と CLI を扱います。

公式ブログでは、Void を作った動機として次の 2 点が挙げられています。

- VoidZero のツール群はフロントエンドのツールチェーンをカバーしてきたが、フルスタックのアプリにはサーバーのルート、データベース、ローカルの開発環境、デプロイも必要になる。これらを 1 つの Vite のワークフローで扱えるようにしたい
- 企業は社内向けのアプリを手軽に作りたい一方で、全社員にクラウドの権限を渡すことにはセキュリティ上の懸念がある。管理者が制御する共有のデプロイ基盤（Void Platform）でこれに応える

Void の中心にあるのは「コードからリソースを推論する」という考え方です。Void は起動時に `routes/` や `pages/` などのディレクトリを走査し、どのモジュールを import しているかを調べます。たとえば `import { db } from "void/db"` があれば D1 データベースの `DB` バインディングが、`import { kv } from "void/kv"` があれば KV の `KV` バインディングが必要だと判断します。

バインディングとは、Cloudflare Workers のコードから D1 や KV などのリソースにアクセスするための接続設定のことです。開発中はこれらの import がローカルのリソースに解決され、デプロイ時には実際の Cloudflare のリソースが作成されます。そのため、`wrangler.jsonc` のような設定ファイルを手で書く必要がありません。

## プロジェクトを作成する

[Quickstart](https://void.cloud/guide/quickstart) に従って、空のディレクトリに Void をインストールし、`void init` コマンドでプロジェクトを作成します。

```bash
mkdir void-memo && cd void-memo
npm install -D void
npx void init
```

`void init` を実行すると、対話形式でいくつかの質問が表示されます。今回は次のように回答しました。

| 質問                                  | 選択肢                                   | 今回の回答              |
| ------------------------------------- | ---------------------------------------- | ----------------------- |
| Choose a Pages scaffold toolchain     | Vite+（デフォルト）/ Vite                 | Vite+                   |
| Choose a Pages framework to scaffold  | React / Vue / Svelte / Solid             | React                   |
| Choose a Pages starter                | D1 (SQLite) / PostgreSQL / MySQL / Static Pages | D1 (SQLite)      |
| Where should this project deploy?     | Cloudflare / Void / Skip deployment setup | Cloudflare              |

最初の質問にある [Vite+](https://viteplus.dev) は、VoidZero が開発している統合ツールチェーンです。Vite に加えて Vitest、Oxlint、Oxfmt などを `vp` という 1 つのコマンドから使えます。Vite+ をグローバルにインストールする必要はなく、`void init` がプロジェクトの依存関係として追加します。

`void init` が完了すると、次のようなファイルが作成されます。

```text
.
├── AGENTS.md
├── db
│   ├── migrations
│   ├── schema.ts
│   └── seed.ts
├── pages
│   ├── index.server.ts
│   └── index.tsx
├── routes
│   └── api
│       └── hello.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── void.config.ts
```

`vite.config.ts` には Void の Vite プラグインと React アダプターが追加されています。

```ts:vite.config.ts
import { defineConfig } from "vite";
import { voidPlugin } from "void";
import { voidReact } from "@void/react/plugin";

export default defineConfig({
  plugins: [
    voidPlugin(),
    voidReact({ react: { compiler: true } }),
  ],
});
```

`voidPlugin()` がルーティングやリソースの推論を担当し、`voidReact()` が React で Pages モードを使うためのアダプターです。`AGENTS.md` には、コーディングエージェント向けの Void の使い方が書かれています。`node_modules/void/docs/` に Void のドキュメントが同梱されていて、エージェントがそれを参照できるようになっています。

スターターには、すでにメッセージの一覧を表示して追加するページが含まれています。これを書き換えて、メモの追加と削除ができるアプリを作っていきましょう。

## スキーマとマイグレーション

Void は ORM として [Drizzle ORM](https://orm.drizzle.team/) を同梱しています。`db/schema.ts` にメモのテーブルを定義します。カラムの定義に使う関数は、データベースの種類に応じて `void/schema-d1`、`void/schema-pg`、`void/schema-mysql` から import します。

```ts:db/schema.ts
import { sql } from "void/db";
import { integer, sqliteTable, text } from "void/schema-d1";

export const memos = sqliteTable("memos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  body: text("body").notNull(),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});
```

開発用の初期データを投入する `db/seed.ts` も、テーブル名に合わせて書き換えておきます。

```ts:db/seed.ts
import { defineSeed } from "void/seed";

export default defineSeed<typeof import("./schema")>(async ({ db, schema }) => {
  await db.insert(schema.memos).values([{ body: "Void を試す" }]);
});
```

`void init` はスターターの `messages` テーブル用のマイグレーションを `db/migrations/` に生成しています。このマイグレーションはまだどこにも適用していないため、ディレクトリごと削除してから、`void db generate` コマンドでスキーマからマイグレーションファイルを生成し直します。

```bash
rm -rf db/migrations
npx void db generate
```

`db/migrations/` ディレクトリに次のような SQL ファイルが生成されます。

```sql:db/migrations/20261017063732_same_dreaming_celestial.sql
CREATE TABLE `memos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`body` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
```

続いて `void db seed` コマンドで、ローカルのデータベースをリセットし、マイグレーションを適用したうえで `db/seed.ts` を実行します。

```bash
npx void db seed
```

```text
◇ Reset database. Applied 1 migration.
✓ Seeded from db/seed.ts.
```

ローカルのデータベースは `.void` ディレクトリに保存されます。ここで作成したデータベースは開発サーバーからも参照されます。

## ページと loader・action

Void の Pages モードでは、`pages/` ディレクトリに置いたコンポーネントがそのままルートになります。`pages/index.tsx` は `/` に対応します。この仕組みは [Inertia.js](https://inertiajs.com/) から着想を得たもので、各ページに対応する `.server.ts` ファイルでサーバー側の処理を書きます（[Pages Routing](https://github.com/voidzero-dev/void/blob/main/docs/guide/pages-routing/overview.md)）。

`.server.ts` ファイルには、主に次の 2 種類の関数を export します。

- `loader`: GET リクエストで実行され、戻り値がページコンポーネントの props になる
- `action` / `actions`: フォームの送信などの変更処理を担当する。ページに複数の変更処理がある場合は、`actions` オブジェクトで名前付きのアクションとして定義する

`pages/index.server.ts` を次のように書き換えます。

```ts:pages/index.server.ts
import { defineHandler, type InferProps } from "void";
import { db, desc, eq } from "void/db";
import { createInsertSchema, createSelectSchema } from "void/drizzle-zod";
import { memos } from "@schema";

export type Props = InferProps<typeof loader>;

export const loader = defineHandler(async () => {
  const rows = await db.select().from(memos).orderBy(desc(memos.id));
  return { memos: rows };
});

export const actions = {
  create: defineHandler.withValidator({
    body: createInsertSchema(memos, {
      body: (schema) => schema.trim().min(1).max(280),
    }).pick({ body: true }),
  })(async (_c, { body }) => {
    await db.insert(memos).values(body);
  }),

  delete: defineHandler.withValidator({
    body: createSelectSchema(memos).pick({ id: true }),
  })(async (_c, { body }) => {
    await db.delete(memos).where(eq(memos.id, body.id));
  }),
};
```

ポイントは次のとおりです。

- `db` は `void/db` から import する。この import によって、Void は D1 の `DB` バインディングが必要だと推論する
- `InferProps<typeof loader>` で loader の戻り値の型を取り出し、ページコンポーネントの props の型として export する
- `defineHandler.withValidator()` でリクエストボディを検証する。`void/drizzle-zod` は [drizzle-zod](https://orm.drizzle.team/docs/zod) を再 export したもので、`createInsertSchema()` や `createSelectSchema()` を使うと Drizzle のスキーマから Zod のスキーマを生成できる

続いて `pages/index.tsx` でページコンポーネントを実装します。

```tsx:pages/index.tsx
import { useEffect } from "react";
import { action, Form, useForm } from "@void/react";
import type { Props } from "./index.server";

export default function HomePage({ memos }: Props) {
  const form = useForm("/?create", { body: "" });

  // 送信成功時は送信した値が新しい初期値になるため、reset() ではなく明示的に空にする
  useEffect(() => {
    if (form.wasSuccessful) form.setData("body", "");
  }, [form.wasSuccessful]);

  return (
    <main>
      <h1>メモ</h1>
      <Form form={form}>
        <label>
          メモ
          <input
            value={form.data.body}
            onChange={(event) => form.setData("body", event.target.value)}
          />
        </label>
        <button disabled={form.pending}>追加</button>
      </Form>
      <ul>
        {memos.map((memo) => (
          <li key={memo.id}>
            {memo.body} <small>{memo.createdAt}</small>{" "}
            <button onClick={() => action("/?delete", { data: { id: memo.id } })}>
              削除
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

ページコンポーネントは loader の戻り値を props として受け取ります。`Props` 型は `index.server.ts` から import しているため、loader の戻り値を変更するとコンポーネント側の型も追従します。

名前付きアクションは、URL の末尾に `?アクション名` を付けて呼び出します。`useForm("/?create", { body: "" })` は `create` アクションに送信するフォームの状態を管理するフックです。第 2 引数の初期値と `create` アクションのバリデーションスキーマから、`form.data` や `form.errors` の型が推論されます。`Form` コンポーネントに `form` を渡すと、送信時に `create` アクションが呼び出されます。送信中は `form.pending` が `true` になるため、追加ボタンを無効にしています。

削除ボタンのようにフォームの状態が不要な操作には、`action()` ヘルパーを使います。`action("/?delete", { data: { id: memo.id } })` は `delete` アクションに POST リクエストを送り、成功するとページを更新します。

`npm run dev`（中身は `vp dev`）で開発サーバーを起動し、`http://localhost:5173` にアクセスしてみましょう。

```bash
npm run dev
```

`db/seed.ts` で投入した「Void を試す」というメモが表示されます。入力欄にメモを入力して「追加」ボタンを押すと、一覧の先頭にメモが追加されます。「削除」ボタンを押すと、そのメモが一覧から消えます。

![](https://images.ctfassets.net/in6v9lxmm5c8/4W44Vw9Urvt3c9jDZ8QUnx/c6e2dd2a1828729d45595f1374db5b52/void-vite-cloudflare-deploy-1.png)

空白だけを入力して送信すると、`trim().min(1)` のバリデーションに失敗します。`Form` コンポーネントは `role="alert"` を付けた要素でエラーメッセージを自動的に表示します。

![](https://images.ctfassets.net/in6v9lxmm5c8/JR6jZxef9JB8XiCOXjdBV/8f8890a9199e1382a27090b8760c12ae/void-vite-cloudflare-deploy-2.png)

## Link と動的ルートで詳細ページを作る

続いて、メモをクリックすると詳細ページに移動できるようにしてみましょう。Pages モードでは、ファイル名を `[id]` のように角括弧で囲むと、その部分が URL のパラメーター（動的セグメント）になります。`pages/memos/[id].tsx` は `/memos/1` や `/memos/2` のような URL に対応します。

まずは詳細ページの loader を `pages/memos/[id].server.ts` に作成します。

```ts:pages/memos/[id].server.ts
import { defineHandler, type InferProps } from "void";
import { db, eq } from "void/db";
import { HTTPException } from "hono/http-exception";
import { memos } from "@schema";

export type Props = InferProps<typeof loader>;

export const loader = defineHandler(async (c) => {
  const [memo] = await db
    .select()
    .from(memos)
    .where(eq(memos.id, Number(c.req.param("id"))));

  if (!memo) {
    throw new HTTPException(404, { message: "メモが見つかりません" });
  }
  return { memo };
});
```

loader の引数 `c` は Hono のコンテキストです。URL のパラメーターは `c.req.param("id")` で取得できます。パラメーターは文字列なので、`Number()` で数値に変換してから検索しています。該当するメモがない場合は、Hono の [`HTTPException`](https://hono.dev/docs/api/exception) を throw して 404 を返します。throw した後の行では `memo` が `undefined` でないことが確定するため、`Props` の `memo` もメモの型として推論されます。

次に、ページコンポーネントを `pages/memos/[id].tsx` に作成します。

```tsx:pages/memos/[id].tsx
import { Link, useParams } from "@void/react";
import type { Props } from "./[id].server";

export default function MemoPage({ memo }: Props) {
  const { id } = useParams<{ id: string }>();

  return (
    <main>
      <h1>メモ #{id}</h1>
      <p>{memo.body}</p>
      <p>
        <small>{memo.createdAt}</small>
      </p>
      <Link href="/">一覧に戻る</Link>
    </main>
  );
}
```

コンポーネントの中で URL のパラメーターを参照したい場合は、`@void/react` の `useParams()` を使います。ここでは見出しの番号に使っています。

`Link` はページ間を移動するためのコンポーネントです。通常の `<a>` 要素として描画されますが、クリックを横取りして、ページ全体を読み込み直さずに遷移します。

一覧ページのメモの本文も、`Link` で詳細ページへのリンクにします。

```diff:pages/index.tsx
 import { useEffect } from "react";
-import { action, Form, useForm } from "@void/react";
+import { action, Form, Link, useForm } from "@void/react";
 import type { Props } from "./index.server";

 // ...

           <li key={memo.id}>
-            {memo.body} <small>{memo.createdAt}</small>{" "}
+            <Link href={`/memos/${memo.id}`}>{memo.body}</Link> <small>{memo.createdAt}</small>{" "}
             <button onClick={() => action("/?delete", { data: { id: memo.id } })}>
```

一覧のメモをクリックすると、`/memos/1` に移動して詳細ページが表示されます。「一覧に戻る」をクリックすると、一覧ページに戻ります。

![](https://images.ctfassets.net/in6v9lxmm5c8/1E4pJQzznq4KPf9sDscwTU/00b84b9888ab605b5355fabec4e1c8a0/void-vite-cloudflare-deploy-4.png)

遷移時に開発者ツールのネットワークパネルを見ると、`/memos/1` へのリクエストには次のような JSON が返っていました。

```json
{
  "component": "memos/[id]",
  "props": {
    "memo": { "id": 1, "body": "Void を試す", "pinned": false, "createdAt": "2026-10-18 01:55:59" }
  },
  "params": { "id": "1" },
  "shared": {},
  "url": "/memos/1",
  "errors": null
}
```

表示するページコンポーネントの名前（`component`）と、loader が返した `props`、URL のパラメーター（`params`）がまとめて返っています。クライアントはこの JSON を受け取って、ページコンポーネントを差し替えます。`Link` による遷移のリクエストには `X-VoidPages: true` ヘッダーが付いていて、同じ URL でもこのヘッダーがなければ、サーバーで描画された HTML が返ります。Inertia.js も、`X-Inertia` ヘッダーの付いたリクエストに対してコンポーネント名と props を含む JSON を返す[プロトコル](https://inertiajs.com/the-protocol)を採用していて、Void の Pages モードはこれとよく似た仕組みになっています。

存在しない ID の URL（たとえば `/memos/999`）に直接アクセスすると、ステータスコード 404 とともに `HTTPException` に渡した「メモが見つかりません」というメッセージがテキストで返りました。

## defer と Suspense で関連メモを後から表示する

ページによっては、表示に時間のかかるデータが含まれることがあります。loader はすべてのデータがそろうまで値を返せないため、遅いデータが 1 つあるだけでページ全体の表示が遅れてしまいます。

Void では、loader の戻り値の一部を `defer()` でラップすると、そのデータだけを後から送れます。ページはほかの props がそろった時点で表示され、`defer()` でラップしたデータは準備ができたときに届きます。

詳細ページに「関連メモ」を追加して試してみましょう。関連メモは外部の推薦サービスから取得することを想定し、ここでは 1.5 秒待ってからモックのデータを返す関数で代用します。

```diff:pages/memos/[id].server.ts
-import { defineHandler, type InferProps } from "void";
+import { defineHandler, defer, type InferProps } from "void";
 import { db, eq } from "void/db";
 import { HTTPException } from "hono/http-exception";
 import { memos } from "@schema";

 export type Props = InferProps<typeof loader>;

+// 関連メモを推薦する外部サービスの代わりに、1.5 秒待ってからモックを返す
+async function fetchRelatedMemos(memoId: number) {
+  await new Promise((resolve) => setTimeout(resolve, 1500));
+  return [
+    { id: `${memoId}-1`, body: "Pages モードの loader を調べる" },
+    { id: `${memoId}-2`, body: "D1 のマイグレーションを試す" },
+  ];
+}
+
 export const loader = defineHandler(async (c) => {
   // ...
-  return { memo };
+  return {
+    memo,
+    relatedMemos: defer(() => fetchRelatedMemos(memo.id)),
+  };
 });
```

`defer()` には、データを返す非同期関数を渡します。`fetchRelatedMemos()` を `await` していない点に注目してください。loader は関連メモを待たずに値を返すため、`memo` はすぐにクライアントへ送られます。

React のページコンポーネントでは、`defer()` でラップした props は Promise として渡されます。React 19 の `use()` で値を読み出し、そのコンポーネントを `<Suspense>` で囲みます。

```diff:pages/memos/[id].tsx
+import { Suspense, use } from "react";
 import { Link, useParams } from "@void/react";
 import type { Props } from "./[id].server";

-export default function MemoPage({ memo }: Props) {
+function RelatedMemos({ relatedMemos }: Pick<Props, "relatedMemos">) {
+  const related = use(relatedMemos);
+
+  return (
+    <ul>
+      {related.map((memo) => (
+        <li key={memo.id}>{memo.body}</li>
+      ))}
+    </ul>
+  );
+}
+
+export default function MemoPage({ memo, relatedMemos }: Props) {
   const { id } = useParams<{ id: string }>();

   return (
     <main>
       <h1>メモ #{id}</h1>
       <p>{memo.body}</p>
       <p>
         <small>{memo.createdAt}</small>
       </p>
+      <h2>関連メモ</h2>
+      <Suspense fallback={<p>関連メモを読み込み中...</p>}>
+        <RelatedMemos relatedMemos={relatedMemos} />
+      </Suspense>
       <Link href="/">一覧に戻る</Link>
     </main>
   );
 }
```

`use(relatedMemos)` は、データが届くまでコンポーネントの描画を中断（サスペンド）します。その間は最も近い `<Suspense>` の `fallback` が表示され、データが届くと `RelatedMemos` の描画が再開されます。`Pick<Props, "relatedMemos">` のように loader から推論した型をそのまま使えるため、`related` もモックの戻り値の型として推論されます。

一覧ページからメモのリンクをクリックし、詳細ページを開いてみましょう。メモの本文はすぐに表示され、関連メモの欄には「関連メモを読み込み中...」と表示されます。約 1.5 秒後に関連メモの一覧に置き換わります。

!v(https://videos.ctfassets.net/in6v9lxmm5c8/24uSrmvw4j6D8M7TWBLr1B/e18e2df6aa27f7b921b8727351e5cd86/bda6e53a-dae7-48f4-8b83-663078ac9eb3.mov)

このとき、`Link` による遷移のレスポンスは `application/x-ndjson`（改行区切りの JSON）形式で返っていました。1 行目には `memo` と、まだ読み込み中であることを示す `relatedMemos`（`loading: true`）、後から届く props の名前を示す `deferred` が含まれ、約 1.5 秒後に関連メモのデータを含む 2 行目が届きます。

```text
{"component":"memos/[id]","props":{"memo":{"id":1,"body":"Void を試す","pinned":false,"createdAt":"2026-10-18 01:55:59"},"relatedMemos":{"value":null,"loading":true,"error":null}},"params":{"id":"1"},"shared":{},"url":"/memos/1","errors":null,"deferred":["relatedMemos"],"deferredKeys":{"relatedMemos":"relatedMemos"}}
{"__deferred":"relatedMemos","data":[{"id":"1-1","body":"Pages モードの loader を調べる"},{"id":"1-2","body":"D1 のマイグレーションを試す"}]}
```

## API ルートと型付き fetch

Pages モードとは別に、`routes/` ディレクトリに API のルートを定義できます。ファイルのパスが URL のパスに対応し、`GET` や `POST` のように HTTP メソッド名で export した関数がハンドラーになります。

スターターの `routes/api/hello.ts` を削除し、メモの件数を返す `routes/api/memos.ts` を作成します。

```ts:routes/api/memos.ts
import { defineHandler } from "void";
import { count, db } from "void/db";
import { memos } from "@schema";

export const GET = defineHandler(async () => {
  const [{ total }] = await db.select({ total: count() }).from(memos);
  return { total };
});
```

`defineHandler` は [Hono](https://hono.dev/) のコンテキストを受け取るハンドラーを定義します。オブジェクトを返すと自動的に JSON のレスポンスに変換されるため、`/api/memos` にアクセスすると `{"total":1}` のような JSON が返ります。

このルートはクライアントから `void/client` の `fetch` を使って呼び出せます。`void/client` の `fetch` は `routes/` の定義から型を生成するため、存在しないパスや、ルートが export していない HTTP メソッドを指定するとコンパイルエラーになります。

```ts
import { fetch } from "void/client";

// 戻り値は { total: number } と推論される
const { total } = await fetch("/api/memos");

// エラー: Argument of type '"/api/memo"' is not assignable to parameter of type '"/api/memos"'.
await fetch("/api/memo");

// エラー: Type '"POST"' is not assignable to type '"GET"'.
await fetch("/api/memos", { method: "POST" });
```

名前は同じですが、`void/client` の `fetch` は標準の `fetch` とは戻り値が異なります。`void/client` の `fetch` はパース済みのレスポンスボディをそのまま返すので、上の例のように戻り値を直接分割代入できます。また、`void/client` の `fetch` はステータスコードが 2xx 以外のときに `FetchError` を投げます。`FetchError` の `status` でステータスコードを、`data` でパース済みのボディを参照できます。

```ts
import { fetch, FetchError } from "void/client";

try {
  const { total } = await fetch("/api/memos");
} catch (error) {
  if (error instanceof FetchError) {
    console.error(error.status, error.data);
  }
}
```

ルートのファイルを追加・変更すると型も更新されるため、サーバーとクライアントの間で API の形がずれていればコンパイル時に気付けます。

## Cloudflare にデプロイする

アプリケーションが完成したので、Cloudflare にデプロイしてみましょう。`void init` でデプロイ先に Cloudflare を選んでいる場合は、`void deploy` コマンドを実行するだけです。

```bash
npx void deploy
```

`void init` でデプロイ先を選んでいない場合は、`--platform cloudflare` オプションを指定します。Cloudflare にまだログインしていない場合は、ブラウザが開いてログインを求められます。ターミナルに表示されたコードとブラウザに表示されたコードが一致することを確認してから、アクセスを許可してください。

```bash
npx void deploy --platform cloudflare
```

`void deploy` は、次の処理を順番に実行します。

1. Vite でアプリケーションをビルドする
2. コードから推論したリソース（今回は D1 データベース）を作成する
3. `db/migrations/` にある未適用のマイグレーションを D1 に適用する
4. Worker を公開し、URL を表示する

:::info
公式ドキュメントによると、Void で作成したアプリは Workers Free プランの制限の範囲内で動作します。
:::

次のように表示されればデプロイは成功です。

```text
void-memo → Cloudflare
✓ 294 modules transformed.
✓ built in 128ms
✓ 26 modules transformed.
✓ built in 73ms
◇ Preparing deployment...
◇ Applying D1 migrations...
◇ Uploading the Worker and assets...
◇ Activating the Worker...
◇ Updating routes and triggers...
╭─ https://void-memo.<subdomain>.workers.dev ─╮
│                                            │
│  Worker: void-memo                         │
│  D1 migrations up to date                  │
│                                            │
╰────────────────────────────────────────────╯

✓ Successfully deployed!
```

デプロイ後のプロジェクトには `void.lock.json` というファイルが作成されています。ここには、デプロイ時に作成されたリソースの情報が記録されています。

```json:void.lock.json
{
  "version": 1,
  "source": {},
  "resolved": {
    "account_id": "<アカウント ID>",
    "d1_databases": [
      {
        "binding": "DB",
        "database_name": "void-memo-db",
        "database_id": "<データベース ID>",
        "migrations_dir": "./db/migrations"
      }
    ],
    "name": "void-memo"
  }
}
```

`void/db` の import から推論された `DB` バインディングに対して、`void-memo-db` という名前の D1 データベースが作成されたことがわかります。2 回目以降のデプロイではこのファイルを参照し、同じリソースを再利用します。公式ドキュメントでは、`void.config.ts` と `void.lock.json` を Git にコミットするよう推奨されています。

表示された URL にアクセスすると、メモアプリが表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/2x71VSDotiYMQqr3spgqaA/b02050c18f4123511a6063d16473d438/void-vite-cloudflare-deploy-3.png)

`void project status` コマンドでデプロイの状態を確認すると、適用済みのマイグレーションの数とデプロイの時刻が表示されます。

```bash
npx void project status
```

```text
│  id                                    status  migrations  deployed
│  42b607af-554e-4828-b064-638f23369a1f  live    1           5m ago
void-memo — 1 version
```

`void db status` コマンドでは、マイグレーションがローカルと本番（remote）のそれぞれに適用されているかを確認できます。

```bash
npx void db status
```

```text
●   20261017063732_same_dreaming_celestial.sql  local: applied  remote: applied
1 migration
```

### スキーマを変更してデプロイするとき

スキーマを変更したときの流れも確認してみましょう。`memos` テーブルに、メモをピン留めするための `pinned` カラムを追加します。

```diff:db/schema.ts
 export const memos = sqliteTable("memos", {
   id: integer("id").primaryKey({ autoIncrement: true }),
   body: text("body").notNull(),
+  pinned: integer("pinned", { mode: "boolean" }).notNull().default(false),
   createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
 });
```

マイグレーションを生成しないまま `void deploy` を実行すると、ビルドの後に次のエラーが表示されてデプロイが中止されます。マイグレーションの適用や Worker の公開は行われないため、本番の Worker とデータベースは変更前の状態のままです。

```text
◇ Preparing deployment...
■ Schema drift detected between your Drizzle schema and db/migrations/.
  Run `void db generate`, review the generated migration, commit it yourself,
  then rerun `void deploy`.
```

エラーメッセージのとおり、`void db generate` でマイグレーションを生成します。`void db migrate` でローカルのデータベースにも適用しておきましょう。

```bash
npx void db generate
npx void db migrate
```

カラムを追加する `ALTER TABLE` 文が生成されます。

```sql:db/migrations/20261017081352_bright_gateway.sql
ALTER TABLE `memos` ADD `pinned` integer DEFAULT false NOT NULL;
```

この時点で `void db status` を実行すると、新しいマイグレーションがローカルには適用済みで、本番には未適用（pending）であることがわかります。

```text
●   20261017063732_same_dreaming_celestial.sql  local: applied  remote: applied
    20261017081352_bright_gateway.sql  local: applied  remote: pending
2 migrations, 1 pending remotely
```

改めて `void deploy` を実行すると、未適用のマイグレーションが本番の D1 に適用されてからデプロイが完了します。

```text
◇ Preparing deployment...
◇ Applying D1 migrations...
? About to apply 1 migration(s)
Your database may not be available to serve requests during the migration, continue?
◇ Uploading the Worker and assets...
◇ Activating the Worker...
◇ Updating routes and triggers...
╭─ https://void-memo.<subdomain>.workers.dev ─╮
│                                            │
│  Worker: void-memo                         │
│  D1 migrations up to date                  │
│                                            │
╰────────────────────────────────────────────╯

✓ Successfully deployed!
```

`void db execute --remote` で本番のデータを確認すると、デプロイ前に保存していたメモが残っていて、追加した `pinned` カラムにはデフォルト値の `0`（`false`）が入っていました。

```bash
npx void db execute --remote "SELECT * FROM memos"
```

```text
id  body      created_at           pinned
─────────────────────────────────────────
2   本番のメモアプリ  2026-10-17 08:12:09  0
```

## ログとロールバック

デプロイしたアプリのログは `void project logs` コマンドで確認できます。Cloudflare にデプロイした場合はライブテールになっていて、コマンドの実行中にアプリへ届いたリクエストが表示されます。

```bash
npx void project logs
```

```text
GET https://void-memo.<subdomain>.workers.dev/api/memos - ok @ 10/17/2026, 3:47:37 PM
```

デプロイしたバージョンに問題があった場合は、`void project rollback` コマンドで以前のバージョンに戻せます。ただし、ロールバックではデータベースのマイグレーションは元に戻りません。ロールバックする前に、以前のコードが現在のデータベースのスキーマで動作することを確認する必要があります。

```bash
npx void project rollback
```

なお、`void init --github` を実行すると、`main` ブランチへのプッシュ時にデプロイする GitHub Actions のワークフローを生成できます。この場合はリポジトリのシークレットに `CLOUDFLARE_API_TOKEN` を設定します。

## まとめ

- Void は VoidZero が開発した、Vite でフルスタックアプリを構築して Cloudflare にデプロイするためのツールキットで、SDK・CLI・Platform が `void` という 1 つの npm パッケージで提供されている
- `void init` で UI フレームワーク、データベース、デプロイ先を選ぶと、Vite の設定、ページ、API ルート、スキーマを含むプロジェクトが作成される
- Void は `void/db` などの import からバインディングを推論するため、開発中はローカルのデータベースが使われ、デプロイ時には D1 データベースが自動で作成される
- Pages モードでは `.server.ts` の `loader` の戻り値がページの props になり、`InferProps` によって型がコンポーネントまでつながる
- `pages/memos/[id].tsx` のようにファイル名を角括弧で囲むと動的ルートになり、loader では `c.req.param()`、コンポーネントでは `useParams()` でパラメーターを取得する
- `Link` による遷移ではドキュメントを再読み込みせず、ページコンポーネント名と props を含む JSON を受け取ってページを差し替える
- loader の戻り値の一部を `defer()` で包むと、ページはそのデータを待たずに表示され、React では `<Suspense>` の中で `use()` を使って後から届いた値を読み出す
- 名前付きアクションは `?create` のように URL の末尾に名前を付けて呼び出し、`useForm` や `action()` から実行する
- `useForm` は送信に成功すると送信した値を新しい初期値にするため、入力欄を空にするには `reset()` ではなく `setData()` を使う
- Pages モードのアクションのバリデーションエラーはステータスコード 200 のページのデータの `errors` として返り、`Form` コンポーネントが自動的に表示する
- `void/client` の `fetch` は `routes/` の定義から型を生成し、存在しないパスや export されていないメソッドをコンパイルエラーにする
- `void deploy` を実行すると、D1 の作成、ビルド、マイグレーションの適用、Worker の公開までが 1 回で行われ、作成したリソースは `void.lock.json` に記録される
- スキーマを変更してマイグレーションを生成していない場合、`void deploy` は公開前に中止されるため、`void db generate` でマイグレーションを生成してからデプロイし直す
- ロールバックではマイグレーションが元に戻らないため、以前のコードが現在のスキーマで動作するかを確認してからロールバックする

## 参考

- [Deploy with Void](https://blog.cloudflare.com/deploy-with-void/)
- [Void](https://void.cloud)
- [Quickstart | Void](https://void.cloud/guide/quickstart)
- [Deployment | Void](https://void.cloud/guide/deployment)
- [Server Routing | Void](https://void.cloud/guide/server-routing)
- [voidzero-dev/void](https://github.com/voidzero-dev/void)
- [Pages Routing - voidzero-dev/void](https://github.com/voidzero-dev/void/blob/main/docs/guide/pages-routing/overview.md)
- [Actions & Forms - voidzero-dev/void](https://github.com/voidzero-dev/void/blob/main/docs/guide/pages-routing/actions-and-forms.md)
- [Typed Fetch - voidzero-dev/void](https://github.com/voidzero-dev/void/blob/main/docs/guide/typed-fetch.md)
- [Resource Inference - voidzero-dev/void](https://github.com/voidzero-dev/void/blob/main/docs/reference/resource-inference.md)
- [Loaders & Props - voidzero-dev/void](https://github.com/voidzero-dev/void/blob/main/docs/guide/pages-routing/loaders.md)
