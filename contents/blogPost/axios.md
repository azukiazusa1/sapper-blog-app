---
id: 1jpYc1E3cWfVB7IvhKHbrh
title: "あの日見たaxiosの機能を僕達はまだ知らない。"
slug: "axios"
about: "axiosは、JavaScriptにおけるHTTPクライアントのデファクトスタンダードといえるでしょう。  Promiseベースで非同期通信を行えるHTTPクライアントとして、ブラウザ標準のfatchやjQuery.ajaxなどがありますが、特にaxiosがよく使われているのには豊富なオプションや設定に理由付けられるでしょう。  axiosの機能について私のように詳しくなくても直感的にHTTPリクエストを送れるのも良い点の1つですが、せっかくなのでaxiosでどのようなことができるのがを見ていきましょう。"
createdAt: "2021-08-29T00:00+09:00"
updatedAt: "2021-08-29T00:00+09:00"
tags: [""]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/7aQAosNLTF1lP6MiXWayqO/c6afbeeb9ed62e05e7491c884438807b/javascript.png"
  title: "JavaScript"
selfAssessment: null
published: true
---
[axios](https://github.com/axios/axios)は、JavaScript における HTTP クライアントのデファクトスタンダードといえるでしょう。

Promise ベースで非同期通信を行える HTTP クライアントとして、ブラウザ標準の[fatch](https://developer.mozilla.org/ja/docs/Web/API/Fetch_API)や[jQuery.ajax](https://api.jquery.com/jquery.ajax/)などがありますが、特に axios がよく使われているのには豊富なオプションや設定に理由付けられるでしょう。

axios の機能について私のように詳しくなくても直感的に HTTP リクエストを送れるのも良い点の 1 つですが、せっかくなので axios でどのようなことができるのがを見ていきましょう。

# 共通の設定を使用する

## axios.create

`axios.create()` は axios の設定を引数に受け取り axios のインスタンスを作成します。
このとき `axios.create()` に渡された設定はすべてのインスタンスでデフォルトの設定として引き継がれて使用されます。

```ts
import axios  from "axios";

const instance = axios.create({
  baseURL: 'https://localhost:8080/api',
  timeout: 5000
})

// https://localhost:8080/api/users/12345 にリクエストが送られる
instance.get('/users/12345/') 

// https://localhost:8080/api/users/ にリクエストが送られる
instance.post('/users', { username })
```

よくある使用法としては、マイクロサービスなどで複数のエンドポイントを持つときエンドポイントごとにインスタンスを作成しておくと便利です。

```ts
import axios  from "axios";

export const userApi = axios.create({
  baseURL: 'https://user-service/api'
})

export const paymentApi = axios.create({
  baseURL: 'https://payment-servive/api'
})
```

## axios.defaults

`axios.defaults` に対して特定の設定に対する値を設定しておけば、同様にインスタンスのすべてのリクエストに対して設定が適用されます。

```ts
import axios  from "axios";

const userApi = axios.create({
  baseURL: 'https://user-service/api'
})

userApi.defaults.withCredentials = true
```

このデフォルトの設定は `import` した `axios` に対して設定することで、すべてのリクエストに対するグローバルなデフォルト設定として利用できます。

```ts
import axios  from "axios";

axios.defaults.withCredentials = true

export const userApi = axios.create({
  baseURL: 'https://user-service/api'
})

export const paymentApi = axios.create({
  baseURL: 'https://payment-servive/api'
})

console.log(userApi.defaults.withCredentials) // true
console.log(paymentApi.defaults.withCredentials) // true
```

# リクエストとレスポンスに処理を挟み込む

## Interceptors

`axios.interceptors` を使えば、リクエストの送信前とレスポンスの取得後にそれぞれ文字通り処理を挟むこむことができます。

```ts
import axios from "axios";

// リクエストの前に処理を挟み込む
// 第1引数としてコールバック関数を受け取り、コールバック関数の引数には
// axiosの設定を受け取りここで設定を変更できる
// 第2引数にはリクエストときにエラーが発生したときに呼ばれるコールバック関数を受け取る
axios.interceptors.request.use(config => {
  config.timeout = 5000
  // 必ずconfigをreturnすること！
  return config
}, err => {
  // do something...
  return Promise.reject(err)
})

// こちらはレスポンスに処理を挟み込む
// 第1引数には正常終了時(デフォルトでは200系を受け取ったとき)に呼ばれるコールバック関数を受け取る
// 第2引数にはエラー発生時に呼ばれるコールバック関数を受け取る
axios.interceptors.request.use(response => {
  console.log(response.data)
  // 同様にresponseをreturnする必要がある
  return response
}, err => {
  // 何らかのエラー処理
  return Promise.reject(err)
})
```

よくある使い方としては、リクエスト前にログイン済でアクセストークンが保存されていればヘッダーにアクセストークンを追加し、そうでないなら何もしないといった処理を挟むことができます。

```ts
import axios from "axios";
import { getAccessToken } from '../auth'

axios.interceptors.request.use(config => {
  // getAccessTokenはローカルに保存してあるアクセストークンを取得する架空の関数
  const accessToken = getAccessToken()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
})
```

`axios.interceptors` は `axios.defaults` と同様に `axios.create()` で作成したインスタンスに対して設定するとそのインスタンスのみ適用させることができます。

```ts
import axios from "axios";
import { getAccessToken } from '../auth'

const userApi = axios.create({
  baseURL: 'https://user.service/api'
})

userApi.interceptors.request.use(config => {
  const accessToken = getAccessToken()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
})
```

# リクエストをキャンセルする

## CancelToken

axios の `CancelToken` を使用すれば、HTTP リクエストをキャンセルする処理を簡単に実装できます。

### キャンセルトークンを作成する

キャンセルトークンは、`CancelToken.source` によって生成されたソースにプロパティとして生成されます。生成したキャンセルトークンは axios の設定の `cancelToken` に対して渡します。生成したキャンセルトークンは処理をキャンセルする際に後々使用するのでどこかに保持しておく必要があります。

```ts
import axios from "axios";

// キャンセルトークンのソースを生成
const source = axios.CancelToken.source()

const fakeApi = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  // source.tokenでキャンセルトークンを取得
  cancelToken: source.token
})
```

### リクエストをキャンセルする

実際にリクエストをキャンセルする処理を実装していきましょう。
単純に「リクエスト」ボタンをクリックしたらリクエストを送信し「キャンセル」ボタンをクリックしたら処理をキャンセルするようにしました。

```ts
import axios from "axios";

// キャンセルトークンのソースを生成
const source = axios.CancelToken.source()

const fakeApi = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  // source.tokenでキャンセルトークンを取得
  cancelToken: source.token
})

const reqestBtn = document.getElementById('request')!
const cancelBtn = document.getElementById('cancel')!

reqestBtn.addEventListener('click', async () => {
  try {
    const { data } = await fakeApi.get('/photos')
    console.log(data)
  } catch (e) {
    // axios.isCancelでキャンセルトークンによるキャンセルであることを判定
    if (axios.isCancel(e)) {
      alert(e.message)
    } else {
      // キャンセル以外のエラー
    }
  }
})

cancelBtn.addEventListener('click', () => {
  // source.cancelでリクエストをキャンセルする
  // 引数にはエラーメッセージを渡せる
  source.cancel('リクエストを中断しました。')
})
```

`source.cancel()` メソッドを呼び出すことによってリクエストをキャンセルできます。
リクエストがキャンセルされた場合にはエラーとして扱われるので、`catch` ブロックへ入ることになります。

`catch` ブロックにおいて `source.cancel()` によって意図的に発生させたエラーかどうか判定するために、`axios.isCancel()` を使用します。

`axios.isCancel()` が `true` を返すのであればリクエストをキャンセルしたことによる例外なのでキャンセルときの処理を記載しましょう。

実際に処理がキャンセルされているのは devtool のネットワークタブを見ればわかります。

![スクリーンショット 2021-08-29 19.05.06](//images.contentful.com/in6v9lxmm5c8/2rHoeHDXFje8WHYN3CQLxO/12be33562e927dbefaa1d94b266f93c4/____________________________2021-08-29_19.05.06.png)

### コンストラクタでトークンを生成する

上記の方法によるキャンセル方法には 1 つ問題があります。

1 つのキャンセルトークンをすべてのリクエストで使用しているため一度リクエストをキャンセルした場合それ以降のリクエストはすべてキャンセルされてしまいます。（キャンセルのキャンセルはできません）。

問題の解決方法はいろいろありますが。ここではコンストラクタによる方法でキャンセルトークンを生成する方法を使用します。

axios の設定にキャンセルトークンを渡す際に毎回コンストラクタによりキャンセルトークンを生成するようにします。コンストラクタの引数にはコールバック関数を受け取り。コールバック関数の引数として処理をキャンセルする関数を受け取ります。

受け取ったキャンセルする関数を変数として保持し、それをキャンセル時に使用します。

このようにすれば、リクエスト毎にキャンセルトークンが生成されるため、上記の問題を解決できます。

```ts
import axios, { Canceler } from "axios";

const CancelToken = axios.CancelToken

const fakeApi = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
})

const reqestBtn = document.getElementById('request')!
const cancelBtn =document.getElementById('cancel')!

let c: Canceler

reqestBtn.addEventListener('click', async () => {
  try {
    const { data } = await fakeApi.get('/photos', {
      cancelToken: new CancelToken(cancel => {
        c = cancel
      })
    })
    console.log(data)
  } catch (e) {
    // axios.isCancelでキャンセルトークンによるキャンセルであることを判定
    if (axios.isCancel(e)) {
      alert(e.message)
    } else {
      // キャンセル以外のエラー
    }
  }
})

cancelBtn.addEventListener('click', () => {
  c()
})
```

# リクエストとレスポンスの進行状況を取得する

## onUploadProgress・onDownloadProgress

axios の設定に渡せる項目として onUploadProgress・onDownloadProgress があります。
コールバック関数を受け取りそれぞれファイルのアップロード時とダウンロード時の進捗状況を取得できます。

適当にファイルをアップロードする処理を書きます。

```html
<form id="form">
   <input type="file" name="" id="file" />
   <button id="submit">submit</button>
</form>
```

```ts
import axios from "axios";

const fakeApi = axios.create({
  baseURL: 'http://localhost:8080',
  onUploadProgress: (progressEvent) => {
    console.log(progressEvent)
  },
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})

const submitBtn = document.getElementById('submit')!

submitBtn.addEventListener('click', async (e) => {
  e.preventDefault()
  try {
    const formData = new FormData();
    const imagefile = document.querySelector<HTMLInputElement>('#file');
    formData.append("image", imagefile!.files![0])
    fakeApi.post('upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  } catch (e) {
    console.log(e)
  }
})
```

`progressEvent` は進捗状況が変化するたびにいかのような形式のオブジェクトを受け取ります。

```js
{
  isTrusted: true, 
  lengthComputable: true,
  loaded: 409303,
  total: 477316, 
  type: "progress", 
  // and more...
}
```

`total` がアップロードするファイルサイズで、`loaded` が現在アップロードできているファイルサイズです。

後はプログレスバーを表示させ、`progressEvent` を受け取るたびに現在の進捗割合を割り当てて上げればそれっぽいものができます。

```html
<progress id="progress" value="0">
``

```ts
const progress = document.querySelector<HTMLInputElement>('#progress');
const fakeApi = axios.create({
  baseURL: 'http://localhost:8080',
  onUploadProgress: (progressEvent) => {
    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
    progress!.value = String(percentCompleted)
  },
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})
```

# エラーハンドリング

## isAxiosError

例えば、次のようなコードを想定します。
以下のコードは `catch` によって axios のリクエストエラーだけではなく、それ以外のエラーを取得する可能性があります。

このように、複数のエラーがキャッチされる可能性があるときには `axios.isAxiosError()` を使うと、axios によるエラーかどうか判定して処理を書けます。

```js
import axios from "axios";

const commentApi = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com/comment'
})

const getComments = async (postId?:  number) => {
  try {
    if (!postId) {
      throw new Error('ポストIDが入力されていません。')
    }

    const { data } = await commentApi.get('/', {
      params: { postId }
    })
    return data
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log('status:', err.response?.status)
      console.log('error code:', err.response?.data.errorCode)
    }
    console.log(err.message)
  }
}
getComments()
```

`axios.isAxiosError` は Type Guard 関数なのでついでのインテリセンスも得られます。

![スクリーンショット 2021-08-29 23.28.37](//images.contentful.com/in6v9lxmm5c8/2dsXlWZGtCIbvLuSqTN7BR/6fa6b0786f6feb77224867717abfb389/____________________________2021-08-29_23.28.37.png)

## toJSON

axios のエラーに対して `toJSON()` メソッドを呼ぶとエラーの詳細情報が得られます。

```json
{
    "message": "Request failed with status code 404",
    "name": "Error",
    "stack": "Error: Request failed with status code 404\n    at createError (http://localhost:3000/node_modules/.vite/axios.js?v=efd7d361:333:19)\n    at settle (http://localhost:3000/node_modules/.vite/axios.js?v=efd7d361:349:16)\n    at XMLHttpRequest.handleLoad (http://localhost:3000/node_modules/.vite/axios.js?v=efd7d361:573:11)",
    "config": {
        "url": "/",
        "method": "get",
        "headers": {
            "Accept": "application/json, text/plain, */*"
        },
        "params": {
            "postId": "1"
        },
        "baseURL": "https://jsonplaceholder.typicode.com/comment",
        "transformRequest": [
            null
        ],
        "transformResponse": [
            null
        ],
        "timeout": 0,
        "xsrfCookieName": "XSRF-TOKEN",
        "xsrfHeaderName": "X-XSRF-TOKEN",
        "maxContentLength": -1,
        "maxBodyLength": -1
    }
}
```

# クエリパラメータを変換する

axios で get リクエストを送信する際に `params` に配列を渡すと次のようにクエリパラメータに `[]` を付与したものが生成されます。余計なお世話ですのでどうにか外したいところです。

```ts
import axios from "axios";
import qs from 'qs'

const commentApi = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com/comments'
})

const getComments = async (postIds: number[]) => {
  try {
    // https://jsonplaceholder.typicode.com/comments/?postId[]=1&postId[]=2&postId[]=3
    const { data } = await commentApi.get('/', {
      params: { postId: postIds }
    })
    return data
  } catch (err) {
    // erorr handling...
  }
}

getComments([1, 2, 3])
```

このような場合には `paramsSerializer` の設定を追加します。

```sh
npm i qs # クエリパラメータをパースするライブラリ
```

```diff
import axios from "axios";
+ import qs from 'qs'

const commentApi = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com/comments',
+  paramsSerializer: (params => qs.stringify(params, { arrayFormat: 'repeat' }))
})

const getComments = async (postIds: number[]) => {
  try {
    // https://jsonplaceholder.typicode.com/comments/?postId=1&postId=2&postId=3
    const { data } = await commentApi.get('/', {
      params: { postId: postIds }
    })
    return data
  } catch (err) {
    // erorr handling...
  }
}

getComments([1, 2, 3])
```

望んだ形でクエリパラメータを送信できます。

# レスポンス結果をキャッシュする

## axios-extensions

axios 本体の機能ではないですが、[axios-extensions](https://github.com/kuitos/axios-extensions)を利用すると GET リクエストの結果をキャッシュすることが可能です。

簡単な使い方を紹介します。

```sh
npm i axios-extensions
```

```ts
import axios, { AxiosAdapter } from "axios";
import { cacheAdapterEnhancer } from 'axios-extensions';

// enhance the original axios adapter with throttle and cache enhancer 
const postApi = axios.create({
	baseURL: 'https://jsonplaceholder.typicode.com/posts',
	headers: { 'Cache-Control': 'no-cache' },
	adapter: (cacheAdapterEnhancer(axios.defaults.adapter as AxiosAdapter))
});

const getPostById = async (postId: number) => {
  try {
    const { data } = await postApi.get('/', {
      params: { postId }
    })
    return data
  } catch (err) {
    // erorr handling...
  }
}

getPostById(1) // 最初のリクエストなので送信される
getPostById(1) // 2度目以降のリクエストはキャッシュから取得するのでリクエストを行わない
getPostById(2) // クエリパラメータが異なるので送信される
```
