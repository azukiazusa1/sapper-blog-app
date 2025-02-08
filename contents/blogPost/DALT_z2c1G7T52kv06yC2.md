---
id: DALT_z2c1G7T52kv06yC2
title: "パスキーによる認証をブラウザで実装してみる"
slug: "implement-path-key-in-browser"
about: "パスキーとはパスワードに代わる認証方法で、生体認証やデバイス PIN を使ってログインができる仕組みです。ユーザーはパスワードを覚える必要がなく、またフィッシング攻撃にも強いという点からよりセキュア認証方法として注目を集めています。この記事では WebAuthn を使ってパスキーをブラウザで実装する方法を紹介します。"
createdAt: "2025-02-08T10:13+09:00"
updatedAt: "2025-02-08T10:13+09:00"
tags: ["セキュリティ", "WebAuthn", "パスキー"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/5d88yYF5D3BDifuwlZcIKK/b476f43d366a486c026796636fed81c9/key_smart-tag_15599.png"
  title: "キーとスマートタグのイラスト"
selfAssessment:
  quizzes:
    - question: "ブラウザでパスキーを作成するために使われるメソッドはどれか？"
      answers:
        - text: "navigator.credentials.get()"
          correct: false
          explanation: ""
        - text: "navigator.credentials.create()"
          correct: true
          explanation: ""
        - text: "navigator.credentials.register()"
          correct: false
          explanation: ""
        - text: "navigator.credentials.authenticate()"
          correct: false
          explanation: ""
    - question: "パスキーによる自動入力を有効にするために input 要素に指定する属性はどれか？"
      answers:
        - text: "autocomplete='password'"
          correct: false
          explanation: ""
        - text: "autocomplete='webauthn'"
          correct: true
          explanation: ""
        - text: "autocomplete='username'"
          correct: false
          explanation: ""
        - text: "autocomplete='one-time-code'"
          correct: false
          explanation: ""

published: true
---

パスキーとはパスワードに代わる認証方法で、生体認証やデバイス PIN を使ってログインができる仕組みです。ユーザーはパスワードを覚える必要がなく、フィッシング攻撃にも強いという点からよりセキュア認証方法として注目を集めています。また指紋認証や顔認証のように簡単な操作で Web サービスにアクセスできるようになるため、ユーザビリティの向上にもつながります。

パスキーは 2022 年頃から企業や団体により対応が表明されており、2025 年現在では Amazon, Google, Microsoft, 任天堂, NTT ドコモといった企業で採用されています。今後もパスキーを採用する企業は増えていくと予想されており、さまざまな Web サービスでパスキーが使われていくことかと思います。

パスキーが普及した背景には、WebAuthn という Web 認証の標準が策定されたことが挙げられます。WebAuthn は W3C により策定された Web 認証の標準で、FIDO2（Fast Identity Online パスワード認証に代わる、より安全で便利な認証技術）を実現するための Web API です。WebAuthn は生体認証やデバイス PIN などの認証方法を Web アプリケーションで利用できるようにするため、パスキーの普及に大きく貢献しました。

この記事では WebAuthn を使ってパスキーをブラウザで実装する方法を紹介します。すべてのコードは以下のリポジトリで確認できます。

https://github.com/azukiazusa1/webauthen-example

## パスキーのオートフィルを使った認証

まずはユーザーがサービスを利用するためにアカウントを登録する画面を作成します。ここではユーザーを識別するための文字列（典型的にはユーザー名はメールアドレス）の入力を求めるフォームを作成します。

```html:frontend/signin.html {8}
<div>
  <label for="username">Username</label>
  <input
    type="text"
    id="username"
    name="username"
    required
    autocomplete="username webauthn"
  />

  <button id="register">Sign in</button>
</div>
```

`autocomplete` 属性に　`webauthn` を指定している点がポイントです。この属性によりブラウザに保存されているパスキーの情報を表示する必要があることを示します。`autocomplete` 属性に `webauthn` を指定しただけではオートフィルはまだ表示されません。JavaScript で `navigator.credentials.get()` を呼び出す必要があります。

パスキーのオートオフィルを使用しない場合、例えば「パスキーでログイン」ボタンを押したタイミングで認証を行うことになります。しかし、すべてのユーザーがパスキーに移行するまでパスワードの入力フォームは残しておく必要があるため、パスワード入力フォームとパスキーボタンを両方表示することになるでしょう。その場合ユーザーはどちらかを選択する必要があるため混乱を招く恐れがあります。

パスキーのオートフィルはブラウザに標準搭載されているパスワードマネージャーによるパスワードの自動入力と同じ流れで認証を実施できるため、ユーザーとって使いやすい形でパスキーによる認証を提供できます。このオートフィルは「条件付き UI」と呼ばれています。

まずはじめにユーザーが利用している環境が条件付き UI に対応しているかどうかを確認します。これを判定するために `PublicKeyCredential.isConditionalMediationAvailable()` という API が用意されています。

```js:frontend/signin.html
async function isCMA() {
  if (
    typeof window.PublicKeyCredential !== "undefined" &&
    typeof window.PublicKeyCredential.isConditionalMediationAvailable ===
      "function"
  ) {
    const available =
      await PublicKeyCredential.isConditionalMediationAvailable();

    return available;
  }
}
```

もし `isAutofillAvailable()` が `true` を返した場合は、`navigator.credentials.get()` を呼び出します。`navigator.credentials.get()` に渡すオプションはバックエンドで生成して渡す必要があります。`challenge` と呼ばれる毎回ランダムに生成される値をオプションとして渡す必要があるためです。この値は第三者による不正なパスキー生成を防ぐために必要です。実際のアプリケーションでは `challenge` はサーバーサイドで生成してセッションに紐づけて保存して後の検証に利用されます。

ここでは実装を簡単にするために `challenge` を固定の値としてクライアント側でオプションを作成します。

```js:frontend/signin.html
const publicKeyCredentialCreationOptions = {
  // サーバーサイドで生成されるランダムな値
  challenge: new Uint8Array(32),
  // rp は Relying Party の略で、パスキーによる認証を受け入れる Web サービスのこと
  rp: {
    id: "localhost",
    name: "Example Corp.",
  },
  // ユーザーに関する情報
  user: {
    id: new Uint8Array([65, 66, 67, 68, 69]).buffer,
    // ユーザーがログインに利用するユーザー名
    name: "test user",
    // アカウントを見分けるための表示名。し
    displayName: "Test User",
  },
  pubKeyCredParams: [
    {
      type: "public-key",
      alg: -7,
    },
    {
      type: "public-key",
      alg: -8,
    },
    {
      type: "public-key",
      alg: -257,
    },
  ],
  // 同じパスキープロバイダk上で同じユーザーに対して 2 つ以上のパスキーが登録されることを防ぐためのオプション
  // すでにサーバーに保存されている当該ユーザーに紐づく公開鍵のクレデンシャルの ID を配列として返す
  excludeCredentials: [
    {
      type: "public-key",
      id: new Uint8Array([70, 71, 72, 73, 74]).buffer,
    },
  ],
  authenticatorSelection: {
    // パスキープロバイダにパスキーを作成する場合には platform を指定
    // YubiKey などの外部デバイスを使う場合には cross-platform を指定
    authenticatorAttachment: "platform",
    //オートフィルを使った認証を行う場合には true を指定
    requireResidentKey: true,
    // パスキー作成時にデバイスのユーザー確認を行うかどうかを指定
    // "required"|"preferred"|"discouraged" のいずれかを指定
    // デフォルトは "preferred" でユーザー確認をスキップすることがある
    // "required" を指定するとユーザー確認を必須にする
    userVerification: "preferred",
  },
  /// 認証ダイアログに表示されるヒントを指定
  hints: ["client-device"],
};

async function getAuthenticationOptions() {
  return publicKeyCredentialCreationOptions;
}
```

クライアント側で作成した `publicKeyCredentialCreationOptions` を使って `navigator.credentials.get()` を呼び出します。

```js:frontend/signin.html
async function signin() {
  const options = await getAuthenticationOptions();

  try {
    const webAuthnResponse = await navigator.credentials.get({
      // 条件付き UI を使う場合には conditional を指定
      mediation: "conditional",
      publicKey: options,
    });

    // レスポンスをサーバーに送信して検証し、ユーザーを認証する処理
    // ...
  } catch (error) {
    console.error(error);
  }
}
```

条件付き UI を使う場合には `navigator.credentials.get()` のオプションに `mediation: "conditional"` を指定します。このオプションを指定しない場合、`navigator.credentials.get()` を呼び出したタイミング（＝ページが読み込まれた瞬間）にパスキーを使用するためのダイアログが表示されます。

これらのコードはページが読み込まれた直後に呼び出すようにします。

```js:frontend/signin.html
<script>
  (async () => {
    const isAvailable = await isCMA();

    if (isAvailable) {
      await signin();
    }
  })();
</script>
```

Google Chrome の場合には、ユーザー名の入力欄にフォーカスした際に「パスキーを使用する」というメッセージが表示されます。この時点では localhost にパスキーを何も登録していないため、利用可能なパスキーが表示はされません。

![](https://images.ctfassets.net/in6v9lxmm5c8/5p8tIxsc1GvAlGSPpKt8bm/c38afc82057d4d0b967350443139a122/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-02-08_11.46.07.png)

## パスキーを登録する

localhost ではまだパスキーを登録していないため、オートフィルを使っても利用可能なパスキーが表示されなかったのでした。実際にパスキーを登録する流れを確認しましょう。

認証画面と同じようにユーザー名を入力するフォームを作成します。

```html:frontend/register.html
<div>
  <label for="username">Username</label>
  <input
    type="text"
    id="username"
    name="username"
    required
    autocomplete="username"
  />

  <button id="register">Register</button>
</div>
```

はじめに `PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()` メソッドを呼び出してパスキーを作成して認証できる環境かどうかを判定します。

```js:frontend/register.html
function isPlatformAuthenticatorAvailable() {
  if (
    typeof window.PublicKeyCredential !== "undefined" &&
    typeof window.PublicKeyCredential
      .isUserVerifyingPlatformAuthenticatorAvailable === "function"
  ) {
    return PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  }
}
```

パスキーを作成するには `navigator.credentials.create()` を呼び出します。`navigator.credentials.create()` は `navigator.credentials.get()` と同様に `publicKey` オプションを渡す必要があります。`challenge` と `user.id` はセキュリティ上のサーバーサイドで生成された値を使用する必要があります。オプションの内容は `navigator.credentials.get()` と同じです。

```js:frontend/register.html
async function create(username) {
  try {
    const webAuthnResponse = await navigator.credentials.create({
      publicKey: {
        challenge: new Uint8Array(32),
        rp: {
          id: "localhost",
          name: "Example Corp.",
        },
        user: {
          id: Uint8Array.from("foobar", (c) => c.charCodeAt(0)),
          name: username,
          displayName: username,
        },
        pubKeyCredParams: [
          {
            type: "public-key",
            alg: -7,
          },
          {
            type: "public-key",
            alg: -8,
          },
          {
            type: "public-key",
            alg: -257,
          },
        ],
        excludeCredentials: [],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          requireResidentKey: true,
          userVerification: "preferred",
        },
        timeout: 60000,
        hints: ["client-device"],
      },
    });

    // ...
  } catch (error) {
    console.error(error);
  }
}
```

このコードはフォームが送信されたタイミングで呼び出すようにします。

```js:frontend/register.html
const form = document.querySelector("form");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const username = formData.get("username");

  if (!isPlatformAuthenticatorAvailable()) {
    alert("Platform authenticator is not available");
    return;
  }

  await create(username);
});
```

実際にブラウザで試してみましょう。フォームを送信したタイミングでパスキーを登録するダイアログが表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/2zfCMhzS3wRBzAbKBh93dW/4af813482c7561c013fc1a7cfc8ebcc1/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-02-08_13.06.05.png)

macOS では iCloud キーチェーンを使ってパスキーを登録できます。キャンセルボタンをクリックするとスマートフォンを使用する方法など別の手段を選択できます。

いくつかパスキーを登録した後に、先ほど作成した認証画面を開いてみましょう。`localhost` に登録したパスキーが表示され、利用するパスキーを選択できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/1cAtE9hRUHzPfN0FLAJprh/4e372ebce89c43713ffce79230087f20/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-02-08_16.16.25.png)

## サーバーサイドの実装

ここまでは WebAuthn API の概観を把握するためにクライアント側だけで実装を行いました。実際の認証処理の流れを確認するために、サーバーサイドでの処理を追加し、ユーザーの登録・認証を行えるようにしましょう。

まずはバックエンドのプロジェクトを作成します。ここでは Hono を使って簡単にサーバーサイドの実装を行います。

```bash
npm create hono@latest backend
```

バックエンドでの公開鍵の検証処理はライブラリを使うことが一般的です。`@simplewebauthn/server` というライブラリを使って処理を実装していきます。

https://simplewebauthn.dev/docs/packages/server

```bash
cd backend
npm install @simplewebauthn/server
```

### テーブルの作成

はじめにユーザー情報を保存するためのデータベースを作成します。ここでは SQLite を使ってデータベースを作成します。以下のスキーマを持つ `users` テーブルと `passkeys` テーブルを作成します。

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE
);

# パスキーは複数登録できるため、ユーザー ID と 1 対多の関係を持つ
CREATE TABLE passkeys (
  credential_id TEXT PRIMARY KEY,
  webauthn_user_id TEXT NOT NULL, # WebAuthn の user.id
  public_key TEXT NOT NULL, # 公開鍵
  deviceType TEXT NOT NULL, # デバイスの種類（'singleDevice' | 'multiDevice'）
  counter INTEGER NOT NULL, # 認証回数。認証ごとにインクリメントされる
  backup boolean NOT NULL,
  transports TEXT NOT NULL, # カンマ区切りで複数指定
  #  ['ble' | 'cable' | 'hybrid' | 'internal' | 'nfc' | 'smart-card' | 'usb']

  user_id INTEGER NOT NULL,
  foreign key (user_id) references users(id)
);
```

テーブルを作成するスクリプトを `src/db/init.js` として保存します。

```ts:backend/src/db/init.js
// Node.js v22 以降が必要
import { DatabaseSync } = from('node:sqlite');
const database = new DatabaseSync(':memory:');

database.exec(`
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE
);

CREATE TABLE passkeys (
  credential_id TEXT PRIMARY KEY,
  webauthn_user_id TEXT NOT NULL,
  public_key TEXT NOT NULL,
  deviceType TEXT NOT NULL,
  counter INTEGER NOT NULL,
  backup boolean NOT NULL,
  transports TEXT NOT NULL,

  user_id INTEGER NOT NULL,
  foreign key (user_id) references users(id)
);
`);
```

`init.js` を実行してテーブルを作成します。

```bash
node src/db/init.js
```

### ユーザーの登録

`/register-request` エンドポイントを作成し、`generateRegistrationOptions` 関数を呼び出すようにします。このエンドポイントではユーザーがパスキーを登録する前に取得するオプションを生成します。

はじめにユーザーが登録しているパスキーの一覧を DB から取得します。取得したパスキーの一覧はオプションの `excludeCredentials` に渡すために変換します。`excludeCredentials` にはすでに登録されているパスキーの情報を渡すことで、同じパスキーを複数登録することを防ぎます。

```ts:backend/src/index.ts
import {
  type AuthenticatorTransportFuture,
  type CredentialDeviceType,
} from "@simplewebauthn/server";
import { DatabaseSync } from "node:sqlite";
const database = new DatabaseSync("./db.sqlite");

type Passkey = {
  id: Base64URLString;
  publicKey: Uint8Array;
  username: string;
  webauthnUserID: Base64URLString;
  counter: number;
  deviceType: CredentialDeviceType;
  backedUp: boolean;
  transports: AuthenticatorTransportFuture[];
};

function getUserPasskeys(username: string): readonly Passkey[] {
  const dbPasskeys = database
    .prepare(
      "SELECT * from passkeys join users on passkeys.user_id = users.id where users.username = ?",
    )
    .all(username);

  const passkeys: readonly Passkey[] = dbPasskeys.map((passkey) => ({
    id: passkey.credential_id,
    publicKey: passkey.public_key,
    username: passkey.username,
    webauthnUserID: passkey.webauthn_user_id,
    counter: passkey.counter,
    deviceType: passkey.device_type,
    backedUp: passkey.backup === 1,
    transports: passkey.transports.split(","),
  }));

  return passkeys;
}
```

`generateRegistrationOptions` 関数を呼び出してパスキーの登録に必要なオプションを生成します。`challenge` と `user.id` は省略した場合自動で生成されます。生成された `challenge` はセッションに保存しておき、後から検証する際に使用します。

```ts:backend/src/index.ts
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();
// cors を有効にする
app.use("*", cors({
  origin: "*",
  credentials: true,
}));
const secret = "super-secret";

app.get("/register-request", async (c) => {
  // クエリパラメータからユーザー名を取得
  const username = c.req.query("username");

  if (!username) {
    return c.json({ error: "Username is required" }, 400);
  }

  // ユーザーが登録しているパスキーの一覧を取得
  const passkeys = getUserPasskeys(username);

  const option = await generateRegistrationOptions({
    rpID: "localhost",
    rpName: "Example RP",
    userName: username,
    timeout: 60000,
    excludeCredentials: passkeys.map((passkey) => ({
      id: passkey.id,
      transports: passkey.transports,
    })),
    authenticatorSelection: {
      userVerification: "preferred",
    },
  });

  // cookie に challenge を保存
  await setSignedCookie(c, "challenge", option.challenge, secret);

  // オプションをフロントエンドに返却
  return c.json(option);
});
```

ここまでの実装が完了したら、`/register-request` エンドポイントにアクセスして確認してみましょう。以下のコマンドでサーバーを起動します。

```bash
cd backend
npm run dev
```

http://localhost:3000/register-request?username=test にアクセスするとパスキー登録のためのオプションが返却されます。

```sh
curl "http://localhost:3000/register-request?username=test"

{"challenge":"xxxx","rp":{"name":"Example RP","id":"localhost"}, ...}
```

続いて、`/register-response` エンドポイントを作成します。このエンドポイントではクライアントから送信されたデータを検証し、公開鍵を登録します。

検証を行うためには `verifyRegistrationResponse` 関数を呼び出します。セッションに保存しておいた `challenge` を取得し、クライアントから送信されたデータを検証します。

```ts:backend/src/index.ts
app.post("/register-response", async (c) => {
  const body = await c.req.json();
  const { response, username, userId } = body;
  // cookie から challenge を取得
  const { challenge } = await getSignedCookie(c, secret);

  if (!challenge) {
    return c.json({ error: "Challenge not found" }, 400);
  }

  const verification = await verifyRegistrationResponse({
    response,
    expectedChallenge: challenge,
    // このオリジンからのリクエストのみ許可
    expectedOrigin: "http://localhost:3001",
    expectedRPID: "localhost",
    // userVerification: 'required' の場合には true を指定
    // パスキーは十分なフィッシング対策を備えているため、多くのウェブサイトでは
    // false を指定していても問題ない
    requireUserVerification: false,
  });

  // 検証に失敗した場合はエラーを返却
  if (!verification.verified) {
    return c.json({ error: "Verification failed" }, 400);
  }

  const { registrationInfo } = verification;

  const user = database
    .prepare("INSERT INTO users (username) VALUES (?)")
    .run(username);
  database
    .prepare(
      "INSERT INTO passkeys (user_id, credential_id, public_key, webauthn_user_id, counter, device_type, backup, transports) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .run(
      user.lastInsertRowid,
      registrationInfo?.credential.id,
      registrationInfo?.credential.publicKey,
      userId,
      registrationInfo?.credential.counter,
      registrationInfo?.credentialDeviceType,
      registrationInfo?.credentialBackedUp ? 1 : 0,
      registrationInfo?.credential.transports?.join(",") ?? "",
    );

  // ログイン処理（省略）

  return c.json({ success: true });
});
```

クライアント側の実装をバックエンドにアクセスするように修正します。まずはクライアント側で直接作成していた `publicKeyCredentialCreationOptions` をサーバーサイドから取得するように修正します。

```js:frontend/register.html
async function getAuthenticationOptions(username) {
  const response = await fetch(
    `http://localhost:3000/register-request?username=${username}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  return await response.json();
}
```

サーバーサイドから取得したオプションは JSON 文字列としてクライアント側に渡されますが、`navigator.credentials.create()` に渡す際には `challenge` と `user.id` は `ArrayBuffer` に変換する必要があります。

`PublicKeyCredential.parseRequestOptionsFromJSON()` メソッドは base64URL エンコードされた文字列を ArrayBuffer に変換して返却してくれます。

`navigator.credentials.create()` から返却された値はサーバーサイドに送信して検証します。サーバーサイドの検証が完了した場合には、ログイン後の画面に遷移するといった処理が行われることが一般的です。

```js:frontend/register.html
async function create(username) {
  const options = await getAuthenticationOptions(username);
  try {
  const webAuthnResponse = await navigator.credentials.create({
    publicKey: PublicKeyCredential.parseRequestOptionsFromJSON(options),
  });

  const body = {
    response: webAuthnResponse,
    username,
    userId: options.user.id,
  };
  const result = await fetch("http://localhost:3000/register-response", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // リクエストに cookie を含める
    body: JSON.stringify(body),
  });

  const data = await result.json();

  if (data.success) {
    // ログイン後の画面に遷移
  }
  } catch (error) {
    console.error(error);
  }
}
```

以上でパスキーの登録処理が完了しました。実際にブラウザで試して見る場合には `verifyRegistrationResponse` 関数の `expectedOrigin` で指定した値でクライアント側をホストする必要があります。HTML ファイルを開発サーバーでホストする場合には `npx serve` が便利です。

```bash
npx serve frontend --port 3001
```

### ユーザーの認証

ユーザーの認証処理も同様に実装します。`/signin-request` エンドポイントを作成し `challenge` を生成して返却します。登録処理とは異なり、このタイミングでは `username` は渡されないので `allowCredentials` には空の配列を渡します。

```ts:backend/src/index.ts
import { generateAuthenticationOptions } from "@simplewebauthn/server";
app.get("/signin-request", async (c) => {
  const option = await generateAuthenticationOptions({
    rpID: "localhost",
    timeout: 60000,
    allowCredentials: [],
    userVerification: "preferred",
  });

  // cookie に challenge 保存
  await setSignedCookie(c, "challenge", option.challenge, secret);

  return c.json(option);
});
```

続いて `/signin-response` エンドポイントを作成します。ここでは認証処理を実装します。クライアントから送信された `credentialId` が DB に存在するかどうかを確認し、存在する場合にはデータベースの値を元に `verifyAuthenticationResponse` 関数を呼び出して検証します。

検証結果が有効である場合、認証回数を最新の値に更新してデータベースに保存します。

```ts:backend/src/index.ts
/**
 * credentialId からデータベースに保存したパスキーを取得
 */
function findPasskeyByCredentialId(
  credentialId: Base64URLString
): Passkey | null {
  const passkey = database
    .prepare(
      "SELECT * from passkeys join users on passkeys.user_id = users.id where passkeys.credential_id = ?"
    )
    .get(credentialId);

  if (!passkey) {
    return null;
  }

  return {
    id: passkey.credential_id,
    publicKey: passkey.public_key,
    username: passkey.username,
    webauthnUserID: passkey.webauthn_user_id,
    counter: passkey.counter,
    deviceType: passkey.device_type,
    backedUp: passkey.backup === 1,
    transports: passkey.transports.split(","),
  };
}

/**
 * passkeys テーブルの counter を更新
 */
function updatePasskeyCounter(credentialId: Base64URLString, counter: number) {
  database
    .prepare("UPDATE passkeys set counter = ? where credential_id = ?")
    .run(counter, credentialId);
}

app.post("/signin-response", async (c) => {
  const body = await c.req.json();
  const { challenge } = await getSignedCookie(c, secret);

  if (!challenge) {
    return c.json({ error: "Challenge not found" }, 400);
  }

  const passkey = findPasskeyByCredentialId(body.id);

  if (!passkey) {
    return c.json({ error: "Passkey not found" }, 400);
  }

  const verification = await verifyAuthenticationResponse({
    response: body,
    expectedChallenge: challenge,
    expectedOrigin: "http://localhost:3001",
    expectedRPID: "localhost",
    credential: {
      counter: passkey.counter,
      id: passkey.id,
      publicKey: passkey.publicKey,
      transports: passkey.transports,
    },
    requireUserVerification: false,
  });

  if (!verification.verified) {
    return c.json({ error: "Verification failed" }, 400);
  }

  updatePasskeyCounter(passkey.id, verification.authenticationInfo.newCounter);

  return c.json({ success: true });
});
```

クライアント側の実装を修正しましょう。`/signin-request` エンドポイントにアクセスして認証のためのオプションを取得し、`navigator.credentials.get()` に渡すようにします。

```js:frontend/signin.html
async function getAuthenticationOptions(username) {
  const response = await fetch(`http://localhost:3000/signin-request`, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  return await response.json();
}
```

`navigator.credentials.get()` から返却された値をサーバーサイドに送信して検証します。`navigator.credentials.get()` に渡すオプションは base64URL エンコードされた文字列から ArrayBuffer に変換するため ` PublicKeyCredential.parseRequestOptionsFromJSON()` を使います。

```js:frontend/signin.html
(async () => {
  const available = await isCMA();

  if (available) {
    try {
      const options = await getAuthenticationOptions();
      const webAuthnResponse = await navigator.credentials.get({
        mediation: "conditional",
        publicKey: PublicKeyCredential.parseRequestOptionsFromJSON(options),
      });

      const res = await fetch("http://localhost:3000/signin-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(webAuthnResponse),
      });
      const result = await res.json();

      if (result.success) {
        // ログイン後の画面に遷移
      }
    } catch (err) {
      console.error("Error with conditional UI:", err);
    }
  }
})();
```

バックエンドから成功レスポンスが返却された場合にはログイン後の画面に遷移することになるでしょう。これで簡単なパスキーの登録・認証処理が完了しました。

## まとめ

- パスキーはパスワードに代わる認証手法。ユーザーがパスワードを覚える必要がない、フィッシング攻撃に強いといったメリットがあり普及が進んでいる
- ブラウザでは WebAuthn API を使ってパスキーの登録・認証を行うことができる
- input 要素の `autocomplete` 属性に `webauthn` を指定することでブラウザに保存されているパスキーの情報を表示する必要があることを示し
- `navigator.credentials.get()` メソッドを使ってパスキーを使った認証を行う際には `mediation: "conditional"` を指定することで条件付き UI を使うことができる
- `navigator.credentials.create()` メソッドを使ってパスキーを登録する
- パスキーの認証・生成ときに渡すオプションは `challenge` の値をランダムに生成するためサーバーサイドで生成する必要がある
- サーバーサイドでは `@simplewebauthn/server` ライブラリを使って公開鍵の検証を行った

## 参考

- [passkeys.dev - Passkeys Developer Resources](https://passkeys.dev/)
- [ウェブ認証 API - Web API | MDN](https://developer.mozilla.org/ja/docs/Web/API/Web_Authentication_API)
- [Passkey autofillを利用したパスワードレスログイン導入で得たものと、得られなかったもの - Money Forward Developers Blog](https://moneyforward-dev.jp/entry/2023/04/05/134721)
- [パスキーのすべて ── 導入・UX設計・実装 WEB+DB PRESS](https://www.amazon.co.jp/dp/B0D7RNFQD2)
- [パスキー実践ガイド](https://www.amazon.co.jp/dp/B0DSMJDBJ8)
