---
id: 4IATSCQoJ5XQrpi7jh6NjT
title: "Firebase Functions https.onCall()トリガーでアプリから簡単に呼び出す"
slug: "firebase-functions-https-oncall"
about: "Firebase Functionsとは、Firebaseの提供するサーバレスフレームワークです。HTTPSリクエストによって関数を実行したり、FireStore・Cloud Storage・AuthenticationのCRUDイベントをトリガーに関数を実行することができます。使用できる言語はJavaScript・TypeScriptに限られているというデメリットはあるものの、手軽にデプロイでき簡単にプロジェクトの他のFirebaseの機能と統合できるメリットがあります。"
createdAt: "2021-01-10T00:00+09:00"
updatedAt: "2021-01-10T00:00+09:00"
tags: [""]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/44W4bTCfa2vT60k8cr4bpy/bbc60b09e00fa77e02cea2012006e896/firebase-cloud-functions.jpeg"
  title: "firebase-cloud-functions"
selfAssessment: null
published: true
---
# Firebase Fuctionsとは

Firebase Functions とは、Firebase の提供するサーバーレスフレームワークです。HTTPS リクエストによって関数を実行したり、FireStore・Cloud Storage・Authentication の CRUD イベントをトリガーに関数を実行できます。（残念ながら、無料プランでは利用することはできません・・・）AWS Lambda に近い機能だと言えます。使用できる言語は JavaScript・TypeScript に限られているというデメリットはあるものの、手軽にデプロイでき簡単にプロジェクトの他の Firebase の機能と統合できるメリットがあります。

# 環境構築

## firebase CLIのインストール

Node.js がインストールされていることが前提です。
まずは、firebase CLI をインストールします。

```sh
npm install -g firebase-tools
```

インストールが完了したらバージョンを確認します。

```sh
firebase --version
9.1.0
```

## プロジェクトの初期化

まずははじめに、下記コマンドで firebase ツールを認証する必要があります。

```sh
firebase login
```

ブラウザに遷移するのでログインします。

次に、プロジェクトを作成します。コマンドを実行したディレクトリに作成されるので、あらかじめディレクトリをほっておきましょう。

```sh
firebase init functions
```

# 通常のHTTPリクエスト

HTTP リクエストを処理する場合には、`firebase.https` を使用します。この関数は、[Express](https://expressjs.com/ja/)と統合することも可能です。

```ts
import { https } from 'firebase-functions'

export const hello = https.onRequest((req, res) => {
  res.status(200).json('Hello!')
})
```

`npm run serve` コマンドで、ローカル環境で実行できます。
エンドポイントは `http://localhost:5001/<project-id>/us-central1/<exoprtした関数名>(hello)` です。

アプリから呼び出すときは、通常の REST API 同様 axios などを用いてリクエストを送ることになるでしょう。この例では省略をしていますが実際にはサーバー側で[CORS](https://developer.mozilla.org/ja/docs/Web/HTTP/CORS)の設定をする必要があるでしょう。

```ts
const { data } = axios.get('http://localhost:5001/<project-id>/us-central1/hello`
```

# onCallを利用する

これだけでもサーバーレスとしての機能として申し分ないですが、`https.onCall` 関数を利用することでさらに簡単に処理を行うことができます。

`onCall` 関数は次のようになります。

```ts
import { https } from 'firebase-functions'

export const hello = https.onCall((data, context) => {
  return 'Hello!'
})
```

`onCall` 関数は、2 つの引数を受け取ります。`data` には送信されたパラメータが、`context` には Firebase Authentication による認証情報が含まれています。

```ts
import { https } from 'firebase-functions'

export const hello = https.onCall((data, context) => {
  const { id, name } = data
  const { auth, instanceIdToken, rawRequest} = context

  auth?.token
  auth?.uid
})
```

簡単に認証情報が利用できるのが `onCall` 関数の特徴です。通常認証情報を付与して HTTP リクエストを送信するには、Authentication Header に bearer token といった形で付与して検証するのが一般的ですが、このようなめんどくさい決まりきった処理をすべて行ってくれます。

レスポンスを返すには、JSON エンコード可能なデータを return すれば OK です。

```ts
import { https } from 'firebase-functions'

export const user = https.onCall(async (data, context) => {
  const user = await User.find(context.auth.uid)

  return {
    firstName: user.firstName,
    lastName: user.lastName,
    age: user.age
   }
})
```

エラーを処理するには、`https.HttpsError` をスローします。`https.HttpsError` の第一引数にエラーコードを、第二引数にエラーメッセージを渡します。
第一引数に渡せるエラーコードは以下のとおりです。

>FunctionsErrorCode: "ok" | "cancelled" | "unknown" | "invalid-argument" | "deadline-exceeded" | "not-found" | "already-exists" | "permission-denied" | "resource-exhausted" | "failed-precondition" | "aborted" | "out-of-range" | "unimplemented" | "internal" | "unavailable" | "data-loss" | "unauthenticated"

[https://firebase.google.com/docs/reference/functions/providers_https_?hl=ja#functionserrorcode](https://firebase.google.com/docs/reference/functions/providers_https_?hl=ja#functionserrorcode)

```ts
import { https } from 'firebase-functions'

export const user = https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new https.HttpsError('unauthenticated', 'auth error')
  }
  const user = await User.find(context.auth.uid)

  return {
    firstName: user.firstName,
    lastName: user.lastName,
    age: user.age
   }
})
```

## アプリから呼び出す

`onCall` で作成した関数をアプリから呼び出してみましょう。

```ts
import firebase from 'firebase'
import 'firebase/functions'

firebase.initializeApp({
  apiKey: '### FIREBASE API KEY ###',
  authDomain: '### FIREBASE AUTH DOMAIN ###',
  projectId: '### CLOUD FUNCTIONS PROJECT ID ###'
  databaseURL: 'https://### YOUR DATABASE NAME ###.firebaseio.com',
})

const functions = firebase.functions()

if (process.env.NODE_ENV === 'development') {
  functions.useEmulator('localhost', 5001)
}
const func = functions.httpsCallable('user')

const result = func({ id: 'id', name: 'name' })
```

`firebase.functions().httpCallable()` で、`onCall()` で作成した関数を呼び出すことができます。デフォルトの呼び出しですと、デプロイされた Firebase Functions の URL を見に行きますので、ローカル環境で Firebase Functions を利用している際には `firebase.functions().useEmulator()` でリクエストを送る URL を指定します。

`firebase.functions().httpsCallable()` の返り値の関数を呼び出すことで、実際にリクエストが送られます。 この引数に渡した値は、`onCall` の第一引数の `data` から受け取ることができます。

見てのとおり、認証情報に関する処理は全くありません。Firebase Authentication でログインしていれば自動的に Authentication Header にトークンを付与してくれます。
