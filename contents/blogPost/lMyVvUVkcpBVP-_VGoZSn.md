---
id: lMyVvUVkcpBVP-_VGoZSn
title: Cloudflare Workers のためのフルスタックツールキット Superflare を試してみた
slug: null
about: null
createdAt: "2023-04-01T11:23+09:00"
updatedAt: "2023-04-01T11:23+09:00"
tags: [Cloudflare Workers,superflare]
thumbnail: null
published: false
---

Superflare は Cloudflare Workers 用のフルスタックツールキットです。[D1 Database](https://developers.cloudflare.com/d1/) 向けの ORM や [R2 Storage](https://developers.cloudflare.com/r2/) 向けのユーティリティなどの機能を提供しています。

https://superflare.dev/

Superflare 自体はフレームワークを謳っておりません。実際に、Superflare は [Remix](https://remix.run/)、[Next.js](https://nextjs.org/)、[Nuxt.js](https://nuxt.com/) などのフレームワークと組み合わせることで効果を発揮します。

!> 2023 年 4 月 1 日現在、Superflare Remix のみに対応しています。

## Superflare の設計思想

## Getting Started

### Cloudflare Workers アカウントの作成

Cloudflare Workers を動かすためには（ローカル環境も含めて）Cloudflare Workers のアカウントを作成する必要があります。アカウントを作成するには下記サイトから「Sign up」をクリックします。

https://workers.cloudflare.com/

![スクリーンショット 2022-08-27 20.53.23](//images.ctfassets.net/in6v9lxmm5c8/2B5th0yGYIcqVVlytjIe8h/bc718884e967478637bf5624058ed973/____________________________2022-08-27_20.53.23.png)

プランの選択は無料プランである「Free」プランで問題ありません。

### プロジェクトの作成

Cloudflare Workers のプロジェクトを作成するためにはコマンドラインツールである [wrangler](https://www.npmjs.com/package/wrangler) をインストールします。

```sh
npm install -g wrangler
```

インストールが完了したことを確認しましょう。

```sh
wrangler --version
 ⛅️ wrangler 2.0.27 
--------------------
```

アカウントの作成が完了したら、以下のコマンドを実行して Superflare のプロジェクトを作成します。

```bash
npx superflare@latest new
```

Cloudflare のリソースにアクセスするためには認証が必要です。ログインしていない状態で上記のコマンドを実行すると、以下のようにログインを促されます。Yes を選択してログインします。

```bash
◇  Hmm. Looks like you're not logged in yet.
│
◆  You need to be logged into Wrangler to create a Superflare app. Log in now?
│  ● Yes / ○ No
└
```

コマンドを実行するとブラウザのタブが開きアクセスを許可するか聞かれますので「Allow」を選択します。認証に成功していると、ターミナルに以下のように表示されます。

```bash
◇  Everything looks good!
│
◇  👋 Heads-up: ───────────────────────────────────────────────╮
│                                                              │
│  Before using R2, Queues, and Durable objects,               │
│  make sure you've enabled them in the Cloudflare Dashboard.  │
│  https://dash.cloudflare.com/                                │
│  Otherwise, the following commands might fail! 😬            │
│                                                              │
├──────────────────────────────────────────────────────────────╯
│
◆  Where would you like to create your app?
│  ./my-superflare-app
└
```

Hands-up にあるように、R2、Queues、Durable objects を使用する前に Cloudflare のダッシュボードで有効化する必要があります。今回のチュートリアルでは R2 を使用するため、ダッシュボードで有効化しておきます。https://dash.cloudflare.com/ にアクセスして、左のメニューから「R2」を選択し、「Purchase R2 Plan」をクリックします。

![](https://images.ctfassets.net/in6v9lxmm5c8/13sxkxZxTxVjpdXAAg8O11/7b11fbcc562fb6f22276de85f260fb86/__________2023-04-01_11.42.46.png)

x> R2 プランを有効にすると、利用料に応じて課金が発生します。[R2 の Pricing](https://developers.cloudflare.com/r2/pricing) をよく確認して自己責任で有効化してください。

有効化が完了したら、ターミナルに戻りプロジェクトのディレクトリ名（ここでは `./my-superflare-app` ）を入力して Enter キーを押します。

有効化する機能を選択する画面が表示されます。`Database Models ` と `Storage` のみを選択します。

```bash
◆  What features of Superflare do you plan to use? We'll create the resources
for you.
│  ◼ Database Models (We'll create D1 a database for you)
│  ◼ Storage
│  ◻ Queues
│  ◻ Broadcasting
└
```

選択したリソースを作成するかどうか聞かれます。Yes を選択しましょう。

```bash
◆  We'll create the following resources for you:

- D1 Database: my-superflare-app-db (bound as DB)
- R2 Bucket: my-superflare-app-bucket (bound as BUCKET)

Do you want to continue?
│  ● Yes / ○ No
└
```
<details>
<summary>D1 の作成でエラーが発生した場合</summary>


私が実行した際には、以下のようにエラーが発生して D1 Database の作成に失敗しました。

```bash
│  ❌ D1 Database:                                                                                                      │
│                                                                                                                      │
│  ✘ [ERROR] A request to the Cloudflare API (/accounts/xxxxxx/d1/database) failed.          │
│                                                                                                                      │
│    Authentication error [code: 10000] 
```

このエラーが表示された場合、一度ログアウトして再度ログインしてみてください。

```bash
wrangler logout
wrangler login
```

ログインし直した後、以下のコマンドで D1 Database の作成を再試行します。

```bash
wrangler d1 create my-superflare-app-db
```

その後、`wrangler.json` データベースの設定を手動で追記します。`database_id` は `wrangler d1 create` コマンドの実行時に表示されるほか、`wrangler d1 list` コマンドで確認できます。

```json:wrangler.json
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "my-superflare-app-db",
      "database_id": "xxxxxx"
    }
  ],
}
```

`superflare.config.ts` にも追加が必要です。

```diff:superflare.config.ts
  import { defineConfig } from "superflare";

  export default defineConfig<Env>((ctx) => {
    return {
      appKey: ctx.env.APP_KEY,
+     database: {
+       default: ctx.env.DB,
+     },
      storage: {
        default: {
          binding: ctx.env.BUCKET,
        },
      },
    };
  });
```

</details>

リソースの作成が完了したら、以下のコマンドでプロジェクトの作成を完了します。

```bash
cd ./my-superflare-app
npm install --legacy-peer-deps
npx superflare migrate
```

`npx superflare migrate` は D1 Database のマイグレーションを行うコマンドです。デフォルトの状態では `users` テーブルが作成されます。

プロジェクトの作成が完了したら、以下のコマンドでローカルサーバーを起動します。

```bash
npm run dev
```

http://127.0.0.1:8788 にアクセスすると、以下のように表示されます。

![ブラウザで表示される画面。Hello, Superflare と表示されている](https://images.ctfassets.net/in6v9lxmm5c8/67DiAyaAwa3m8UjWqVcWV4/cb19b4888b92331b936a8b5af09c7dd7/__________2023-04-01_12.17.42.png)

## 認証機能

新しく Superflare のプロジェクトを作成したときのデフォルトのコードを見て見ましょう。Superflare ではデフォルトで認証機能が備わっています。

`/auth/regiser/` と `/auth/login/` は Superflare により提供された基本的な認証画面です。`/auth/register` にアクセスすると素朴なユーザー登録画面が表示されます。適当なメールアドレスとパスワードを入力して登録してみましょう。

![ユーザー登録画面。Register という見出しが表示され、その下に Email と Password を入力するフォームが表示されている。](https://images.ctfassets.net/in6v9lxmm5c8/3GDGtjHb7dUdGUEufWgiYa/fa179bf30c5dc068bdb63fc86afc1286/__________2023-04-01_12.25.48.png)

ログインに成功すると、`/dashboard` にリダイレクトされ。ログイン状態であることが確認できます。

![ログイン後の画面。Dashboard You're logged in as test@example.com と表示されている](https://images.ctfassets.net/in6v9lxmm5c8/5JePgXnPic0IB5brG266S8/cf06606d90c85391d37243e3a3485816/__________2023-04-01_12.39.35.png)

「Log out」ボタンをクリックするとログアウトできます。ログアウト後再度ダッシュボードにアクセスし用とすると、ログイン画面にリダイレクトされます。ログイン画面では登録画面で入力したメールアドレスとパスワードを入力することでログインできます。

### 登録画面の実装

それでは、Superflare ではどのように認証機能が実装されているのかを見ていきましょう。まずは、ユーザー登録画面です。Remix はファイルベースのルーティングを提供しています。`/auth/register` に該当するファイルは `app/routes/auth/register.tsx` です。

ここでは `action` 関数によってフォームから送信されたデータを受け取り処理が行われています。

```tsx:app/routes/auth/register.tsx
import { json, redirect, type ActionArgs } from "@remix-run/cloudflare";
import { User } from "~/models/User";
import { hash } from "superflare";

export async function action({ request, context: { auth } }: ActionArgs) {
  if (await auth.check(User)) {
    return redirect("/dashboard");
  }

  const formData = new URLSearchParams(await request.text());
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (await User.where("email", email).count()) {
    return json({ error: "Email already exists" }, { status: 400 });
  }

  const user = await User.create({
    email,
    password: await hash().make(password),
  });

  auth.login(user);

  return redirect("/dashboard");
}
```

この `action` 関数は Remix により提供されている機能です。`action` 関数はサーバーのみで実行される関数であり、主にデータの更新などの処理を行います。サーバー側で実行される関数には同じく `loader` 関数があります。`loader` と `action` 関数の違いは処理が実行される順番です。`GET` 以外のリクエストが送信された場合は、`action` 関数が先に実行され、その後 `loader` 関数が実行されます。

https://remix.run/docs/en/main/route/action

`action` 関数の中引数では `request` と `context` が渡されています。`request` は [Fetch API の Request オブジェクト](https://developer.mozilla.org/ja/docs/Web/API/Request) であり、フォームから送信したデータを取得できます。

`context` に含まれる `auth` は Superflare により提供されている [Superflare Auth](https://superflare.dev/security/authentication#superflare-auth-api) です。API は Laravel の [Auth Facade](https://laravel.com/api/9.x/Illuminate/Support/Facades/Auth.html) とよく似ています。

`auth.check` はログイン状態を確認する関数です。`UserModel` を引数に受け取り、ログインしている場合は `true` を返します。

```tsx:app/routes/auth/register.tsx
import { User } from "~/models/User";

if (await auth.check(User)) {
  return redirect("/dashboard");
}
```

#### `UserModel`

この `UserModel` は認証機能を利用する場合必須です。モデルとは D1 データベースのテーブルに対応するアプリケーション層の抽象化されたレイヤーです。Superflare ではモデルを作成することで、モデル間の関係を定義したり、データの操作が簡単に行えます。

`UserModel` は `users` テーブルに対応するモデルです。プロジェクトを作成したときにあらかじめ `UserModel` に対応する `users` テーブルのマイグレーションが作成されているはずです。

`users` テーブルは `id`、`email`、`password` カラムを持っています。

```ts:db/migrations/0000_create_users_table.ts
import { Schema } from "superflare";

export default function () {
  return Schema.create("users", (table) => {
    table.increments("id");
    table.string("email").unique();
    table.string("password");
    table.timestamps();
  });
}
```

モデルは TypeScript の Class として定義されています。モデルのクラス名はテーブル名の単数形として対応しており、`Model` クラスを継承しています。モデルクラスを作成した後 `Model.register` を呼び出すことでモデルを登録し、モデルを利用できるようになります。

`UserModel` のクラスは `app/models/User.ts` にあります。

```ts:app/models/User.ts
import { Model } from "superflare";

export class User extends Model {
  toJSON(): Omit<UserRow, "password"> {
    const { password, ...rest } = super.toJSON();
    return rest;
  }
}

Model.register(User);

export interface User extends UserRow {}
```

`UserRow` interface は `users` テーブルのレコードを表しています。この型定義は `superflare.env.d.ts` ファイルに配置されています。これは `npx superflare migrate` を実行したときに自動的に生成されます。

```ts:superflare.env.d.ts
// This file is automatically generated by Superflare. Do not edit directly.

interface UserRow {
  id: number;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}
```

`toJSON` メソッドは `User` モデルのインスタンスがどのように JSON にシリアライズされるかを定義しています。デフォルトではリレーションを含む全てのカラムがプロパティとして返されます。ここでは `password` カラムを除外してシリアライズされるようにしています。

#### ユーザーの作成

`UserModel` の機能を一通り説明したので、`action` 関数の実装に戻りましょう。`request` オブジェクトからフォームから送信されたデータを取得してします。前述の通り、`request` オブジェクトは Fetch API の `Request` オブジェクトですから、Web API の標準的な方法でフォームデータを取得できます。

```ts:app/routes/auth/register.tsx
const formData = new URLSearchParams(await request.text());
const email = formData.get("email") as string;
const password = formData.get("password") as string;
```

続いて既に登録されているメールアドレスかどうかを確認します。モデルの `where()` メソッドを使うことで、テーブルのレコードを検索できます。`count()` メソッドは取得したレコードの数を返します。レコードの数が 1 以上であれば 400 エラーを返します。Remix では [json](https://remix.run/docs/en/1.15.0/utils/json) 関数を使うことで簡単に `application/json` レスポンスを返すことができます。

```ts:app/routes/auth/register.tsx
if (await User.where("email", email).count()) {
  return json({ error: "Email already exists" }, { status: 400 });
}
```

登録されていないメールアドレスであればユーザーを作成します。`create()` メソッドを使うことで、モデルのインスタンスを作成し、データベースに保存されます。パスワードは Superflare が提供する `hash()` 関数を使ってハッシュ化します。

```ts:app/routes/auth/register.tsx
const user = await User.create({
  email,
  password: await hash().make(password),
});
```

`create()` メソッドは作成したモデルのインスタンスを返します。このインスタンスを `auth.login()` 関数に渡すことで、ログイン状態にします。ログイン状態とした後 `redirect()` 関数を使って `/dashboard` にリダイレクトします。

```ts:app/routes/auth/register.tsx
auth.login(user);

return redirect("/dashboard");
```

ログイン状態は [SuperflareSession](https://superflare.dev/sessions) クラスにより保存されています。

### ダッシュボード画面

ダッシュボード画面はログイン状態でないと表示できないようになっています。このような典型的な処理はサーバー側で実行される `loader` 関数において `auth.check` を呼び出してログイン状態かどうかチェックすることで実現しています。ログイン状態でない場合は `redirect()` 関数を使って `/login` にリダイレクトします。

```tsx:app/routes/dashboard.tsx
import { type LoaderArgs, redirect, json } from "@remix-run/cloudflare";
import { User } from "~/models/User";

export async function loader({ context: { auth } }: LoaderArgs) {
  if (!(await auth.check(User))) {
    return redirect("/auth/login");
  }

  return json({
    user: (await auth.user(User)) as User,
  });
}
```

`loader` 関数はログインしているユーザーを `user` プロパティに含む JSON として返します。Remix において `loader` 関数が返すデータを取得するには 
[useLoaderData()](https://remix.run/docs/en/1.15.0/hooks/use-loader-data) 関数を使います。

```tsx:app/routes/dashboard.tsx
import { useLoaderData } from "@remix-run/react";

export default function Dashboard() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Dashboard</h1>
      <p>You're logged in as {user.email}</p>

      <form method="post" action="/auth/logout">
        <button type="submit">Log out</button>
      </form>
    </>
  );
}
```

### ログアウト

ダッシュボード画面でログアウトボタンを押すと、`/auth/logout` に POST リクエストが送信されます。`app/routes/auth/logout.ts` では `action` 関数内で `auth.logout()` 関数を呼び出してログアウト状態にします。

```tsx:app/routes/auth/logout.ts
import { type ActionArgs, redirect } from "@remix-run/server-runtime";

export async function action({ context: { auth } }: ActionArgs) {
  auth.logout();

  return redirect("/");
}
```

### ログイン画面

ログイン画面の実装は登録画面と大きく変わりません。ここでは、`auth.login` 関数の代わりに `auth.attempt` 関数を使っています。`auth.attempt` 関数は、ユーザーのクレデンシャル情報（=メールアドレスとパスワード）を引数に取り、ログインに成功した場合は `true` を返します。ログインに失敗した場合は `false` を返します。

```tsx:app/routes/auth/login.tsx
import { Form, Link, useActionData } from "@remix-run/react";
import { json, redirect, type ActionArgs } from "@remix-run/cloudflare";
import { User } from "~/models/User";

export async function action({ request, context: { auth } }: ActionArgs) {
  if (await auth.check(User)) {
    return redirect("/dashboard");
  }

  const formData = new URLSearchParams(await request.text());
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (await auth.attempt(User, { email, password })) {
    return redirect("/dashboard");
  }

  return json({ error: "Invalid credentials" }, { status: 400 });
}
```

## アルバムアプリの作成

ここまで Superflare プロジェクトを作成した時点での基本的な実装を確認しました。ここからは実際に簡単なアルバムアプリを作成していきましょう。

このアプリケーションでは、ユーザーは自由に画像をアップロードして、アルバムを作成することができます。また、アルバムにはタイトルと説明をつけることができます。

テーブルの設計は以下のように提案していただきました。この設計を元に、モデルを作成していきます。

```
## ユーザー(users)テーブル

ID (主キー)
ユーザー名
パスワード
メールアドレス

## アルバム(albums)テーブル

ID (主キー)
タイトル
説明
ユーザーID (外部キー)

## 画像(images)テーブル

ID (主キー)
キー （R1 Storage のキー）
アルバムID (外部キー)
ユーザーID (外部キー)
アップロード日時
```

### マイグレーションの作成

まずはアルバムモデルから作成しましょう。まず始めにモデルに対応するテーブルを作成する必要があります。テーブルを作成するには、マイグレーションファイルを作成して、マイグレーションを実行します。

以下のコマンドでマイグレーションを作成できます。

```bash
npx superflare generate migration albums
```

コマンドの実行に成功すると `db/migrations` ディレクトリにマイグレーションファイルが作成されます。

```ts:db/migrations/0001_albums.ts
import { Schema } from 'superflare';

export default function () {
  // return ...
}
```

マイグレーションフィルでは `Schema` インスタンスを返す関数を default export する必要があります。`Schema` の `create()` メソッドを使ってテーブルを作成します。

```ts:db/migrations/0001_albums.ts
import { Schema } from "superflare";

export default function () {
  return Schema.create("albums", (table) => {
    table.increments("id");
    table.string("title");
    table.string("description");
    table.integer("userId");
    table.timestamps();
  });
}
```

`id` はテーブルの主キーになります。Superflare ではテーブルの主キーは必ず `id` という名前であることが求められます。

`userId` は `users` テーブルの `id` と紐付けるための外部キーです。`users` テーブルと `albums` テーブルは、1対多の関係となります。

`timestamps()` メソッドを呼び出すと、`createdat` と `updatedAt` のカラムが追加されます。これらのカラムは、レコードの作成日時と更新日時を自動で管理するためのものです。

同じように、画像モデルに対応するマイグレーションを作成します。

```bash
npx superflare generate migration images
```

```ts:db/migrations/0002_images.ts
import { Schema } from "superflare";

export default function () {
  return Schema.create("images", (table) => {
    table.increments("id");
    table.string("key");
    table.integer("albumId");
    table.integer("userId");
    table.timestamps();
  });
}
```

マイグレーションファイルを作成できたので、マイグレーションを実行しましょう。`npx superflare migrate` コマンドを実行すると、マイグレーションが実行されます。`--create` オプションを渡すと、自動でモデルを作成してくれます。

```bash
npx superflare migrate --create
```

コマンドが成功すると、`migrations` ディレクトリに実行された SQL が出力されます。

```sql:migrations/0001_albums.sql
-- Migration number: 0001 	 2023-04-01T06:45:58.421Z
-- Autogenerated by Superflare. Do not edit this file directly.
CREATE TABLE albums (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  userId INTEGER NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);
```

### モデルの作成

`--create` オプションを渡してマイグレーションを実行した場合、`app/models` ディレクトリに `Album.ts` と `Image.ts` が作成されます。モデル同士のリレーションを定義するために、それぞれのファイルを編集する必要があります。

それぞれのテーブルのリレーションを確認しておきましょう。ユーザーは複数のアルバムを所有できます。アルバムは複数の画像を含むことができ、画像は特定のアルバムに所属し、また、アップロードしたユーザーにも関連しています。

![](https://images.ctfassets.net/in6v9lxmm5c8/4IEKLlQSfG1rgqH8etxNIv/2104a43927d997cef66ec02125dcbf1a/__________2023-04-01_15.58.31.png)

1 人のユーザーが複数のアルバムを所有できるというリレーションは `one-to-many` リレーションと呼ばれています。このリレーションを表現するために、ユーザーモデルに `hasMany()` メソッドを使います。

```diff:app/models/User.ts
+ import { Album } from "./Album";
+ import { Image } from "./Image";

  export class User extends Model {
+   albums!: Album[] | Promise<Album[]>;
+   images!: Image[] | Promise<Image[]>;
+
+   $alubms() {
+     return this.hasMany(Album);
+   }
+
+   $images() {
+     return this.hasMany(Image);
+   }

    toJSON(): Omit<UserRow, "password"> {
      const { password, ...rest } = super.toJSON();
      return rest;
    }
  }
```

`one-to-many` の many 側のモデルには、`belongsTo()` メソッドを使います。

```ts:app/models/Album.ts
import { Model } from "superflare";
import { Image } from "./Image";
import { User } from "./User";

export class Album extends Model {
  images!: Image[] | Promise<Image[]>;
  user!: User | Promise<User>;

  $images() {
    return this.hasMany(Image);
  }

  $user() {
    return this.belongsTo(User);
  }

  toJSON(): AlbumRow {
    return super.toJSON();
  }
}
Model.register(Album);

export interface Album extends AlbumRow {}
```

```ts:app/models/Image.ts
import { Model } from "superflare";
import { Album } from "./Album";
import { User } from "./User";

export class Image extends Model {
  album!: Album | Promise<Album>;
  user!: User | Promise<User>;

  $album() {
    return this.belongsTo(Album);
  }

  $user() {
    return this.belongsTo(User);
  }

  toJSON(): ImageRow {
    return super.toJSON();
  }
}

Model.register(Image);

export interface Image extends ImageRow {}
```

これでモデルの定義が完了しました。

### ダッシュボードからアルバムを作成する

ダッシュボードからアルバムを作成するために、アルバムを作成するフォームを作成します。Remix ではプレーンな HTML でフォームを作成します。つまり、React や Vue.js などのライブラリで作成するフォームのように JavaScript を用いて状態管理やフォームのサブミットの制御を行わないということです。

```diff:app/routes/dashboard.tsx
  export default function Dashboard() {
    const { user } = useLoaderData<typeof loader>();

    return (
      <>
        <h1>Dashboard</h1>
        <p>You're logged in as {user.email}</p>

+       <form method="post">
+         <fieldset>
+           <legend>Create Album</legend>
+
+           <div>
+             <label htmlFor="title">Title</label>
+             <input name="title" type="text" required />
+           </div>
+
+           <div>
+             <label htmlFor="description">Description</label>
+             <input name="description" type="text" required />
+           </div>
+
+           <button type="submit">Create</button>
+         </fieldset>
+       </form>

        <form method="post" action="/auth/logout" style={{ marginTop: "2rem" }}>
          <button type="submit">Log out</button>
        </form>
      </>
    );
  }
```

![](https://images.ctfassets.net/in6v9lxmm5c8/3HurTmwz3I2omp0qQgbgzS/707ab0e81ac171bbac4e19f70a0a2c3d/__________2023-04-01_17.55.09.png)

フォームを作成したら、フォームのサブミットを処理するための `action` 関数を作成します。`form` の `action` 属性を指定しない場合、フォームは同じページに POST リクエストとして送信されるので、`app/routes/dashboard.tsx` ファイルに `action` 関数を定義します。

フォームデータは `await request.formData()` メソッドで取得できます。取得したフォームフォームデータを引数とし、`AlbumModel` の `create()` メソッドでアルバムを作成します。

現在ログインしているユーザーの ID は `auth.id()` メソッドで取得できます。

?> ここでは簡単のため、バリデーションやエラー処理を無視しています。

```ts:app/routes/dashboard.tsx
export async function action({ request, context: { auth, session } }: LoaderArgs) {
  // ログインしているか確認
  if (!(await auth.check(User))) {
    return redirect("/auth/login");
  }

  // フォームデータを取得
  const body = await request.formData();
  const title = body.get("title") as string;
  const description = body.get("description") as string;

  // ログインしているユーザーのIDを取得
  const userId = await auth.id();

  // アルバムを作成
  await Album.create({
    title,
    description,
    userId,
  });

  // フラッシュメッセージをセット
  session.flash("success", "Album created successfully");

  // ダッシュボードにリダイレクト
  return redirect("/dashboard");
}
```

アルバムを作成した後は `session` オブジェクトを使ってフラッシュメッセージをセットしています。

フラッシュメッセージは一度だけ表示されるメッセージです。フラッシュメッセージはセッションに保存されるので、リダイレクトされた先のページで表示されます。

`session` は `auth` オブジェクトと同じく `loader`、`action` 関数の引数から受け取ることで利用できます。

アルバムを作成した後は、ダッシュボードにリダイレクトします。

フラッシュメッセージを表示するためには、`session.getFlash()` メソッドでセッションから読み取る必要があります。フラッシュメッセージが存在する場合にはその要素が、存在しない場合には `undefined` が返ります。

フラッシュメッセージはすべてのページに共通で存在すれば表示したいため、`app/routes/root.tsx` ファイル内の `loader` 関数内でフラッシュメッセージを読み取ります。コンポーネント側では `undefined` 以外の場合にのみフラッシュメッセージを表示するように制御します。

```tsx:app/root.tsx
import { json, LoaderArgs, MetaFunction } from "@remix-run/cloudflare";
import {
  useLoaderData,
} from "@remix-run/react";

export async function loader({ context: { session } }: LoaderArgs) {
  const flash = session.getFlash("success");

  return json({
    flash,
  });
}

export default function App() {
  const { flash } = useLoaderData<typeof loader>();

  return (
    <html lang="en" className="h-full bg-gray-100 dark:bg-black">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {flash && <div style={{ color: "green" }}>{flash}</div>}
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
```

![](https://images.ctfassets.net/in6v9lxmm5c8/2rWUb8VkI0kl9o7738UeLd/7661aaf4d55a385118d1490edce8d7d4/__________2023-04-01_18.03.56.png)

### アルバム一覧を表示する

ダッシュボード画面で作成したアルバムの一覧を表示するようにします。`app/routes/dashboard.tsx` ファイルの `loader` 関数内で `Album` の `where()` メソッドを使ってログインしているユーザーに属するアルバムをすべて取得します。

```diff:app/routes/dashboard.tsx
+ import { Album } from "~/models/Album";

  export async function loader({ context: { auth } }: LoaderArgs) {
    if (!(await auth.check(User))) {
      return redirect("/auth/login");
    }

+   // ログインしているユーザーのアルバムを取得
+   const albums = await Album.where("userId", await auth.id()).orderBy(
+     "createdAt",
+     "desc"
+   );

    return json({
      user: (await auth.user(User)) as User,
+     albums,
    });
  }
```

コンポーネント側では `useLoaderData` 関数から取得した `albums` プロパティを使ってアルバムの一覧を表示します。

```diff tsx:app/routes/dashboard.tsx
  export default function Dashboard() {
-   const { user } = useLoaderData<typeof loader>();
+   const { user, albums } = useLoaderData<typeof loader>();

    return (
      <>
        <h1>Dashboard</h1>
        <p>You're logged in as {user.email}</p>

        <form method="post">
          // ...
        </form>

+       <h2>Albums</h2>
+       {albums.length ? (
+         <ul>
+           {albums.map((album) => (
+             <li key={album.id}>
+               <a href={`/albums/${album.id}`}>{album.title}</a>
+             </li>
+           ))}
+         </ul>
+       ) : (
+         <p>You don't have any albums yet</p>
+       )}

        <form method="post" action="/auth/logout" style={{ marginTop: "2rem" }}>
          <button type="submit">Log out</button>
        </form>
      </>
    );
  }
```

![](https://images.ctfassets.net/in6v9lxmm5c8/2rVj8LVtzOwfHImDbrVhxO/5e7694368631d0a613dbc3cc199c3552/__________2023-04-01_18.19.47.png)

もう少し一覧から情報を取得できるように、アルバムが持っている写真の数を表示するようにします。アルバムと写真のリレーションは `one-to-many` です。クエリを発行する際にリレーションを先にロードするため `with` メソッドを使います。

これは eager load と呼ばれるもので、N + 1 問題を回避するために ORM でよく使われる手法です。

```diff:app/routes/dashboard.tsx
  const albums = await Album.where("userId", await auth.id())
    .orderBy("createdAt", "desc")
+   .with("images");
```

さらに、`Album` モデルの仮想プロパティとして `imageCount` を定義します。あるモデルに対してゲッターメソッドとして定義することで、データベースに保存されていないフィールドも追加できます。

```ts:app/models/Album.ts
export class Album extends Model {
  images!: Image[] | Promise<Image[]>;
  user!: User | Promise<User>;

  $images() {
    return this.hasMany(Image);
  }

  $user() {
    return this.belongsTo(User);
  }

  get imageCount(): number {
    return this.$images.length;
  }

  toJSON(): AlbumRow & { imageCount: number } {
    return {
      ...super.toJSON(),
      imageCount: this.imageCount,
    };
  }
}
```

アルバムの一覧を表示している箇所に `album.imageCount` を表示するようにします。

```diff tsx:app/routes/dashboard.tsx
  <ul>
    {albums.map((album) => (
      <li key={album.id}>
        <a href={`/albums/${album.id}`}>{album.title}</a>
+       <span> - {album.imageCount} images</span>
      </li>
    ))}
  </ul>
```

![](https://images.ctfassets.net/in6v9lxmm5c8/2Nl1ks2EO6KbUdafXbZFhj/218c6c9be226d546b923edbc0e99d9cd/__________2023-04-01_18.42.03.png)

### アルバム詳細ページを作成する

### 画像をアップロードする

### 画像を削除する



