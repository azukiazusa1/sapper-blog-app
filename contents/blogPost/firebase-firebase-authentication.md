---
id: 5H7SveWBGTSvJzS1zkkjJj
title: "Firebase② Firebase Authentication"
slug: "firebase-firebase-authentication"
about: "Firebase第二弾です。 Firebase Authenticationのメールアドレスによるログインと、FireStorageについて説明していきます。"
createdAt: "2020-04-19T00:00+09:00"
updatedAt: "2020-04-19T00:00+09:00"
tags: ["firebase", "JavaScript", "Vue.js"]
published: true
---
先週は、Firebase Authentication による、Google アカウントでのログインについて取り上げました。今回は、メールアドレスとパスワードによるログインについて取り上げます。

# メールアドレスとパスワードによる認証
## メールアドレスとパスワードによる認証を有効にする
まずはじめに、前回同様認証を利用するには、その認証方法をコンソール上で有効にする必要があります。`メール/パスワード` プロパイダを有効にします。

![スクリーンショット 20200419 17.20.55.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2Fa51lPE293EOY2F6iaXjM%2F45f61101c61bf4b11f4b265af703c466.png?alt=media&token=1e2424b5-147e-4b28-b500-3af480745260)

![スクリーンショット 20200419 17.24.05.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2Fa51lPE293EOY2F6iaXjM%2Fbfc6c29e5429dfefe9e59a5caf4bd838.png?alt=media&token=327350ea-22b5-4906-bc3f-60e9169783a4)

`メール/パスワード` プロパイダを有効にすると、コンソール上でユーザーを追加できます。

`Users` タグをクリックして `ユーザーを追加` ボタンをクリックします。

![スクリーンショット 20200419 17.25.08.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2Fa51lPE293EOY2F6iaXjM%2F9b5eb143393ff38f596283e1bb8ad617.png?alt=media&token=aef1747f-7966-4d1c-853f-766c842feabb)

適当なメールアドレスとパスワードを入力して、`ユーザーを追加` ボタンをクリックします。
ユーザーの一意となる `UID` が付与され、今後このユーザーを利用してログインができるようになります。

## ログインフォームを構築する
### あらかじめ用意されたUIを利用する
ログインフォームには、`Firebase` にあらかじめ用意されている UI を利用できます。
UI を利用するためには追加で以下の CDN を読み込みます。

```html
<script src="https://cdn.firebase.com/libs/firebaseui/3.5.2/firebaseui.js"></script>
<link type="text/css" rel="stylesheet" href="https://cdn.firebase.com/libs/firebaseui/3.5.2/firebaseui.css" />
```

js ファイルに、次のように UI を初期化するコードを書きます。
ログイン方法には、メールアドレスとパスワードによる認証を指定します。

```js
const ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', {
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  // Other config options...
})
```

ログインウィジェットがレンダリングされる DOM を用意します。`ui.start` の第一引数に指定されているセレクターに描画されます。（この例では `#firebaseui-auth-container`）

最終的な HTML は次のようになります。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <script src="https://www.gstatic.com/firebasejs/7.14.0/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/7.14.0/firebase-auth.js"></script>
  <script src="https://cdn.firebase.com/libs/firebaseui/3.5.2/firebaseui.js"></script>
  <link type="text/css" rel="stylesheet" href="https://cdn.firebase.com/libs/firebaseui/3.5.2/firebaseui.css" />  
  <title>Firebase Auth</title>
</head>
<body>
  <_div id="firebaseui-auth-container"></_div>
  <script>
    // Your web app's Firebase configuration
    var firebaseConfig = {
      apiKey: "AIzaSyDPOIelluKaZv8--wAksjl9CZrrOdqYJ40",
      authDomain: "awesome-wares-264812.firebaseapp.com",
      databaseURL: "https://awesome-wares-264812.firebaseio.com",
      projectId: "awesome-wares-264812",
      storageBucket: "awesome-wares-264812.appspot.com",
      messagingSenderId: "850229978924",
      appId: "1:850229978924:web:8c88bd3497c24449766e89"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    // const provider = new firebase.auth.GoogleAuthProvider()
  </script>
  <script src="./firebase.js"></script>
</body>
</html>
```

次のようなログイン画面が表示されました。
さきほど作成したユーザーのメールアドレスを入力してみましょう。

![スクリーンショット 20200419 18.08.34.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2Fa51lPE293EOY2F6iaXjM%2F394985f65760bea17dafcb7bf3193e21.png?alt=media&token=671e8011-70d8-4c0d-8fb3-8668994554e0) 

このままパスワードを入力すれば、ログインが完了します。
（ログイン後の処理を書いていないため、とくになにもおきませんが）
![スクリーンショット 20200419 18.11.08.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2Fa51lPE293EOY2F6iaXjM%2F5e0488099bf013b9bb2b4b69df55c685.png?alt=media&token=39171719-f9da-4ca1-b794-ac7bc5367f3e)

また存在しないユーザーのメールアドレスを入力した場合、そのまま新しいユーザーを作成できます。

![スクリーンショット 20200419 18.13.15.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2Fa51lPE293EOY2F6iaXjM%2Fd7e13649510cce8d14edf4e2e84aae0f.png?alt=media&token=f70ec2bd-7a4d-47bb-99f3-7e22f08e2e2b)

## 独自のUIコンポーネントを利用する

Firebase の UI を利用して、簡単にログイン機能を利用できました。
しかし、独自の UI コンポーネントを利用したいことでしょう。
またここからは `Vue.js` を利用した Web アプリケーションを例にして説明します。（すでに作ったものを利用したいので）

### Vue CLIアプリ作成
いつもどおり `Vue CLI` により Vue アプリを作成します。

```
vue create firebase-app
```

どうせ使うので `Router` と `Vuex` も入れておきましょう。
```
? Please pick a preset: 
  default (babel, eslint) 
❯ Manually select features
```

```
? Check the features needed for your project: 
 ◉ Babel
 ◯ TypeScript
 ◯ Progressive Web App (PWA) Support
 ◉ Router
❯◉ Vuex
 ◯ CSS Pre-processors
 ◉ Linter / Formatter
 ◯ Unit Testing
 ◯ E2E Testing
```

#### firebase初期化

FireStore モジュールを npm でインストールします。

```
npm install firebase
```

`src/plugins/firebase.js` ファイルを作成して初期化コードを作成して、`export defaut` してアプリケーションで `firebase` を利用できるようにします。

```js
import firebase from 'firebase'

if (!firebase.apps.length) {
  firebase.initializeApp(
    {
      apiKey: process.env.VUE_APP_APIKEY,
      authDomain: process.env.VUE_APP_AUTHDOMAIN,
      databaseURL: process.env.VUE_APP_DATABASEURL,
      projectId: process.env.VUE_APP_PROJECTID,
      storageBucket: process.env.VUE_APP_STORAGEBUCKET,
      messagingSenderId: process.env.VUE_APP_MESSAGINGSENDERID,
      appId: process.env.VUE_APP_APPID,
      measurementId: process.env.VUE_APP_MEASUREMENTID,
    }
  )
}

export default firebase
```

API キーはクライアントアプリケーションで利用される前提なので、そのまま書いても構いませんが、なんとなく `.env.local` から読み込みます。

```.env.local
VUE_APP_APIKEY=MY_API_KEY
VUE_APP_AUTHDOMAIN=MY_AUTHDOMAIN
VUE_APP_DATABASEURL=MY_DATABASEURL
VUE_APP_PROJECTID=MY_PROJECT_ID
VUE_APP_STORAGEBUCKET=MY_STORAGE
VUE_APP_MESSAGINGSENDERID=MY_MESSAGER
VUE_APP_APPID=MY_APPID
VUE_APP_MEASUREMENTID=MY_MEMEASUREMENTID
```

`Firebase` の認証機能を提供するモジュールを `src/plugins/auth.js` に書きましょう。

```js
import firebase from '@/plugins/firebase'

export function login (email, password) {
   return firebase.auth().signInWithEmailAndPassword(email, password)
}

export function logout() {
  return firebase.auth().signOut()
}

export function reAuth(email, password) {
  return firebase.auth.EmailAuthProvider.credential(email, password)
}

export function auth () {
  return new Promise(resolve => {
    firebase.auth().onAuthStateChanged(user => {
      resolve(user || false)
    })
  })
}
```

メールアドレスとパスワードによるログインを利用するには、`firebase.auth().signInWithEmailAndPassword` を利用するので、これをラップした関数を `export` します。

ログアウトは前回と同じく、`firebase.auth().signOut` を利用します。これもラップします。
`reAuth` 関数は後ほど使用します。

#### ログイン画面
[ここから](https://github.com/vuetifyjs/vuetify/blob/master/packages/docs/src/layouts/layouts/demos/centered.vue)コピペしたログインフォームをちょっといじって利用します。

こんな感じです。
![スクリーンショット 20200419 19.01.43.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2Fa51lPE293EOY2F6iaXjM%2Fd4d523a8ddcc042fbe0fcff6181c93dc.png?alt=media&token=95bed646-e357-428e-9fc6-c640243124b2)
スクリプト部分このようになっています。
なおバリデーションやエラー処理などは省いています。

```js
<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import { login } from '@/plugins/auth'

export default {
  data() {
    return {
      email: '',
      password: '',
      redirect: '' // ログイン後にリダイレクトさせたいurl
    }
  },
  // Vuelidateによるバリデーション
  mixins: [validationMixin],
  validations: {
    email: { required, email },
    password: { required },
  },
  methods: {
    onSubmit () {
      this.$v.$touch(
      if (this.$v.$invalid) return
      login(this.email, this.password)
        .then(() => this.$router.push(this.redirect))
        .catch(() => {
          // エラー処理を個々で行う
        })
    },
  },
}
</script>
```

はじめにインポートしている。
```js
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
```
これらは、[Vuelidate](https://vuelidate.js.org/)という軽量バリデーションライブラリです。ここでは詳細は割愛します。

またさきほど作成した `authモジュール` から `login` 関数をインポートしましょう。
```
import { login } from '@/plugins/auth'
```

`data` プロパティの `email` と `password` は `v-model` によってフォーム入力とバインディングされます。

`methods` プロパティの `onSubmit` メソッドは、`submitイベント` によって呼び出されます。

バリデーションが通過したなら、`login` 関数を呼び出しましょう。
さきほど見たとおり、`login` 関数は `firebase.auth().signInWithEmailAndPassword` のラッパー関数です。
`firebase.auth().signInWithEmailAndPassword` は、メールアドレスとパスワードを渡すこによって、ログインをできます。

`firebase.auth().signInWithEmailAndPassword` は、`Promise` を返すので、ログインが成功していることを確認できたなら、ログイン後リダイレクトをさせます。

なんらかの理由でログインに失敗しているのなら、（メールアドレスかパスワードが間違っている、ネットワークエラーなど）エラーをキャッチしてエラー処理を行います。

#### ログインユーザーの取得
現在ログインしているユーザーは、先週と同じく `firebase.auth().onAuthStateChanged` で取得します。
これも、`authモジュール` の `auth` 関数によって `Promise` を返すようにラップしています。

ユーザープロフィールを取得できます。

```js
import { auth } from `@/plugins/auth`

async () => {
  const user = await auth()
  if (!user) return 
  user.displayName
  user.email
  user.emailVarified
  user.photoURL
  user.uid 
}
```

#### ユーザーのプロフィールを更新する
`updateProfile` メソッドを利用すれば、ユーザーのプロフィールを更新できます。

```js
import { auth } from `@/plugins/auth`

async () => {
  const user = await auth()
  if (!user) return 
  user.updateProfile({
    displayName: '新しい名前',
    photoURL: 'newPhoto.jpg'
  })
}
```

#### メールアドレスを更新する
ユーザーのメールアドレスを更新するには、`updateEmail` を利用します。
注意しなければいけないところは、メールアドレスやパスワードの更新など、セキュリティ上重要な操作はユーザーが再認証する必要があるところです。

再認証をするためには、まずは新しい認証情報を取得します。

そのためには、`firebase.auth.EmailAuthProvider.credential` に `email` と `password` を渡します。
取得した認証情報を `user` メソッドの `reauthenticateWithCredential` にわたすことで、再認証が完了します。

これは `authモジュール` の `reAuth` 関数でラップしてるので、次のように新しい認証情報を取得できます。

```js
import { reAuth } from '@/src/plugins/auth'

export default {
methods: {
  async onSubmit() {
      try {
        this.loading = true
　　　　　// 再認証のためのメールアドレスは、ログインユーザーから取得します。
　　　　　// パスワードはフォーム入力から取得します。
        const credential = await reAuth(this.user.email, this.password)
        await this.user.reauthenticateWithCredential(credential)
        await this.user.updateEmail(this.email)
     } catch {
       // エラー処理
　　　} finnaly { 
       this.loading = false
     }
  }
}
```

#### ユーザーのパスワードを更新する

パスワードの更新も、同じく再認証をする必要があります。
`user` メソッドの `updatePassword` を利用します。

# Cloud Storage
次は Storage を利用します。
`Cloud Storage` は写真や動画など、ユーザーが作成したコンテンツを保管、提供します。
AWS の S3 のように使用できます。

## Storageの設定を初期化する
`storage` も `auth` と同じようにモジュールで初期化して利用します。
`src/plugins/storage.js` に以下のようにかきます。

```js
import firebase from '@/plugins/firebase'

export const storage = firebase.storage()
```

## Cloud Storageを利用する
実際に Storage を利用してみます。
例として、ブログ作成 CMS でサムネイルを設定する機能を作成します。

![スクリーンショット 20200419 22.44.31.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2Fa51lPE293EOY2F6iaXjM%2Fe30d4d855cf5553bed1264930d7a12b0.png?alt=media&token=7ff157a1-10d0-4184-98c8-9f494e30329c)

機能として、新しい画像を新たにアップロードしてサムネイルを設定するか、ブログ内で使用した画像をサムネイルに設定できるようにします。

## 画像をアップロードする
まずは、画像をアップロードしてサムネイルを設定する機能を作成します。

`<template>` は次のようになっています。

```html
<template>
    <v-dialog v-model="dialog" scrollable max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" class="ma-5" v-on="on">
          <v-icon>fas fa-image</v-icon>
          サムネイルの設定
        </v-btn>
      </template>
      <v-card>
        <v-card-title>サムネイルの設定</v-card-title>
        <v-divider></v-divider>
        <v-progress-linear
          v-model="fileLoading"
          stream
        ></v-progress-linear>
        <v-card-text style="height: 600px;">
          <v-card-subtitle>現在のサムネイル</v-card-subtitle>
          <v-row>
            <v-col cols=4>
              <v-img
                :src="thumbnail"
                alr="サムネイル"
                width=200
                height=200
              ></v-img>
            </v-col>
            <v-col cols=8>
              <v-file-input accept="image/*" label="画像をアップロードして設定する。" @change="onFileUpload"></v-file-input>
              <v-btn color="error" @click="deleteThumbnail">サムネイルを削除する</v-btn>
            </v-col>
          </v-row>
```

注目すべき点は、`<v-file-input>` によってファイルがアップロードされたら、`onFileUpload` イベントが発火するところです。
（`<v-file-input>` は `<input type="file">` を提供する `Vuetify` のコンポーネントです）

`onFileUpload` イベントを見ていきます。

```js
onFileUpload(file) {
    const fileType = this.getFileType(file)
      if (!fileType) {
        this['flash/setFlash']({
          message: 'ファイルタイプが不正です。',
          type: 'error'
        })
      }
      const storageRef = storage.ref(`articles/${this.article.id}/thumbnail.${fileType}`)
      const uploadTask = storageRef.put(file)
      uploadTask.on('state_changed', 
          snapshot => {
            const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            this.fileLoading = percentage
          },
          err => {
            console.log(err)
            this['flash/setFlash']({
              message: 'ファイルのアップロードに失敗しました。',
              type: 'error'
            })
          },
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
              this.fileLoading = 0
              this.thumbnail = downloadURL
            })
          }
        )
    },
```

`@change` イベントは[file API](https://developer.mozilla.org/ja/docs/Web/API/File)を受け取ります。
`getFileType` と `this['flash/setFlash']` は独自で作成したメソッドです。
ファイルの拡張子を取得する機能と、フラッシュメッセージ機能を提供します。

### ファイルの参照を作成
ファイルを `Cloud Storage` にアップロードするには、まずファイル名を含むファイルの完全パスへの参照を作成します。

ファイルの参照を作成するために、`storage.ref()` メソッドを利用します。

```js
const storageRef = storage.ref(`articles/${this.article.id}/thumbnail.${fileType}`)
```

### ファイルをアップロード
参照を作成したら、`storageRef.put()` メソッドでファイルをアップロードします。

`put()` はさきほど取得した[file API](https://developer.mozilla.org/ja/docs/Web/API/File)や[Blob API](https://developer.mozilla.org/ja/docs/Web/API/Blob)経由でファイルを取得し、`Cloud Storage` にアップロードします。

```js
const uploadTask = storageRef.put(file)
```

### ファイルのアップロード状況を監視する
`Cloud Storage` でファイルをアップロードしている最中には、アップロード状況を監視できます。

```js
uploadTask.on('state_changed', 
          snapshot => {
            const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            this.fileLoading = percentage
          },
          err => {
            console.log(err)
            this['flash/setFlash']({
              message: 'ファイルのアップロードに失敗しました。',
              type: 'error'
            })
          },
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
              this.fileLoading = 0
              this.thumbnail = downloadURL
            })
          }
        )
```

進行率を取得するには、転送済みのバイト数（`snapshot.bytesTransferred`）をアップロード予定のバイト数（`snapshot.totalBytes`）の合計で割って 100 をかけて算出します。

2 つ目の関数では、エラー処理を担当することになります。

最終的にアップロードが完了した場合には、3 つ目の関数が呼び出されます。
アップロードが完了したら `getDownloadURL` メソッドから、画像へアクセスするための URL を取得できます。

この URL を新たにサムネイルプロパティに設定して、データベースに保存したらサムネイルの設定は完了です。

## ブログ内で使用した画像をサムネイルに設定できるようにする
こんどは、ブログ内で使用した画像を取得して設定するよういします。

次のような `<template>` をです。

```html
          <v-card-subtitle>記事内の画像から設定する。</v-card-subtitle>
          <v-row>
            <v-col cols=12>
              <v-card>
                <.div v-if="loading">
                  画像データの取得中...
                  <v-progress-circular indeterminate color="red"></v-progress-circular>
                </div>
                <div>
                  この記事に画像は使われていません。
                </div>
                <v-container fluid v-else>
                  <v-row>
                    <v-col
                      v-for="(image, index) in images"
                      :key="index"
                      :index="index"
                      class="d-flex child-flex"
                      cols="4"
                    >
                      <v-card flat tile class="d-flex">
                        <v-img
                          :id="index"
                          :src="image"
                          aspect-ratio="1"
                          :class="{ selected: isSelected(index) }"
                          @click="onClick"
                        >
                          <template v-slot:placeholder>
                            <v-row
                              class="fill-height ma-0"
                              align="center"
                              justify="center"
                            >
                              <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                            </v-row>
                          </template>
                        </v-img>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-col>
          </v-row>
```

`images` 配列を `v-for` でループして、使用した画像一覧を表示します。
`images` 配列に画像を渡しましょう。

### 画像のリストをダウンロードする

日付が変わりそうなので今週はここまで。

