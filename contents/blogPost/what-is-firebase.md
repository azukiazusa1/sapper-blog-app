---
id: 2Ygw9B1UCh6R2G9BpCiQRW
title: "firebaseとは"
slug: "what-is-firebase"
about: "Firebaseは、Googleが提供するバックエンドサービスです。 Firebaseは、バックエンドのサービスを担ってくれるので、開発者はアプリケーションの開発に専念することができ、バックエンドで動くサービスを作成、管理する必要はありません。 そのため、素早くアプリケーションをリリースるることができます。 Firebaseは、iOS/AndroidアプリからWebサービスまで幅広く使えます。 認証、データベース、ストレージなどたくさんの機能が使用できます。"
createdAt: "2020-04-12T00:00+09:00"
updatedAt: "2020-04-12T00:00+09:00"
tags: ["firebase", "JavaScript", "Vue.js"]
published: true
---
# Firebaseとは
![firebase.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2Fgr6RsHqtjuEd40b68r9u%2F5017a38035f48029213844b30ee39d76.png?alt=media&token=b338c943-2119-481a-9e2e-0d9bca87b324)

Firebaseは、Googleが提供するバックエンドサービスです。いわゆる、**BaaS**(Backend as a Service)です。
Firebaseは、バックエンドのサービスを担ってくれるので、開発者はアプリケーションの開発に専念することができ、バックエンドで動くサービスを作成、管理する必要はありません。
そのため、素早くアプリケーションをリリースるることができます。
Firebaseは、iOS/AndroidアプリからWebサービスまで幅広く使えます。

Firebaseには、以下のような様々な機能が提供されています。

- Firebase Authentication
アカウント機能を提供します。メールアドレスとパスワードを使用した一般的な認証の他に、電話番号、匿名認証、TwitterやGoogleアカウント、FacebookなどのSNS認証を使用できます。

- Realtime Database 
 オブジェクト型のNoSQLデータベースです。その名の通り、リアルタイムでクライアント全体の情報を同期することができます。データベースの状態を監視して変更があった場合、自動で更新してくれるので、簡単にチャット機能を実装することができます。

- Cloud Firestore
上記のRealtime Databaseの性能をさらに向上させた、新しいデータベースです。基本的に特別な事情がない限りこちらがおすすめされています。Realtime Databaseと異なり、データをドキュメントで保存します。

- Cloud Storage
写真や動画など、バイナリーデータを保存するストレージです。

- Firebase Hosting
HTML、CSS、JavaScriptで構成されたWebアプリケーションなど、静的なページを公開するためのホスティングサービスです。CDNを利用して、コンテンツを高速に配信することができます。

- Firebase Analytics
アプリの使用状況や、ユーザーの行動などを把握することができます。
500以上のイベントに関するレポートを無制限に生成できます。

- Firebase Crashlytics
アプリケーションのクラッシュレポートを送信します。

これらの機能はFirebaseの提供するすべての機能のほんの一部にしかすぎません。すべての機能を知りたい場合には、ぜひ[公式サイト](https://firebase.google.com/?hl=ja)を確認してみてください。

# プロジェクトを作成する
実際にFirebaseのプロジェクトを作成します。Googleアカウントがない場合には先に作成しておく必要があります。

## プロジェクトの追加
まずは[Firebaseのコンソール](https://console.firebase.google.com/?hl=ja)へ移動します。
プロジェクトの作成をクリックしましょう。

![スクリーンショット 20200412 21.45.15.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2Fgr6RsHqtjuEd40b68r9u%2F41870ca4fdc539638256facdcd701675.png?alt=media&token=6d58304b-ea23-467f-a3df-b5e324f361cb)

適当にプロジェクトの名前を付けます。
![スクリーンショット 20200412 21.47.39.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2Fgr6RsHqtjuEd40b68r9u%2Fccf60d20a09db3bfc67b47f2d6506a15.png?alt=media&token=9dfc0fd0-babf-4968-81c0-cbdb24a47190)

いくつかの項目を聞かれるので(Google Analticsの使用の有無など)確認したら続行をクリックします。

以下のような画面になったらプロジェクトの作成は完了です。
![スクリーンショット 20200412 21.48.28.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2Fgr6RsHqtjuEd40b68r9u%2F7645011104b0258e89adf3f284b68f87.png?alt=media&token=636d757f-6dad-4182-9b26-96ee58083e6f)

Firebaseを利用するためのAPIキーを取得しましょう。今回は`JavaScript`使用するので、Webアプリケーションのアイコンをクリックします。

![スクリーンショット 20200412 21.55.10.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2Fgr6RsHqtjuEd40b68r9u%2Ff0a4eeb6fd2c296026e62144636ef7f2.png?alt=media&token=5671b4ac-cfce-4e54-8153-c5941697bc25)

適当なアプリケーションの名前を付けましょう。
![スクリーンショット 20200412 21.51.43.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2Fgr6RsHqtjuEd40b68r9u%2F1a1336faf83f188d5fcecc60e4be0d24.png?alt=media&token=b15f9a41-78da-4d2b-9de7-6e097a703f9c)

JavaSriptのコードが出てくるので、コピペして使用します。
![スクリーンショット 20200412 21.52.12.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2Fgr6RsHqtjuEd40b68r9u%2F6b065d4471796ff9dea3e7cbb7dd837f.png?alt=media&token=a0c37c0d-3b7d-4ffe-becb-365e93864e1f)

これで基本的なFirebaseの設定は完了です。

# Firebase Authentication
実際にFirebase Authenticationを試してみます。
ログイン認証に様々な方法が使えますが、今回はGoogleアカウントを用いた認証を行います。
理由はAPIキー等の入手の必要がなく、とても簡単だからです。(ちなみにTwitter APIはAPIの利用に審査が必要で、審査の申請を出すために利用理由を英語で200文字以上入力する必要があるなどかなり面倒です)

次のような簡単なログインボタンとログアウトボタンだけが表示されるHTMLファイルを用意しました。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <style>
    .hide {
      display: none;
    }
  </style>
  <title>Document</title>
</head>
<body>
  <button id="login">ログイン</button>
  <button id="logout" class="hide"></button>

  <script src="https://www.gstatic.com/firebasejs/7.14.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/7.14.0/firebase-auth.js"></script>

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
  </script>
  <script src="./firebase.js"></script>
</body>
</html>
````

これをもとに`firebase.js`にコーディングしていきましょう。

## Googleプロバイダオブジェクトのインスタンスを作成
Firebase Authentication機能を利用するためには、基本的には`firebase.auth()`の名前空間で作業をします。
auth用のCDNも忘れずに`firebase-app.js`の後に読み込むようにします。
`<script src="https://www.gstatic.com/firebasejs/7.14.0/firebase-auth.js"></script>`
Firebase Auth 自体は多くのサービスプロバイダのOAuthのラッパーとなっています。
Googleアカウントを利用するので、Googleサービスプロバイダを呼び出しましょう。

```js
const provider = new firebase.auth.GoogleAuthProvider()
```

## ログインボタンがクリックされたときに認証を行う
早速認証を行いましょう。ログインボタンが押されたときに認証がされるようにしたいので、ログインボタンのDOMを取得して`click`イベントを購読しましょう。

```js
const loginBtn = document.getElementById('login')

loginBtn.addEventListener('click', () => {
  // この中に認証コードを書く
})
```

認証するさいには、ポップアップウィンドウを表示するか、ログインページにリダイレクトするか選択できます。

- ポップアップでログイン
`signInWithPopup`を呼び出す。

- ログインページにリダイレクトでログイン
`signInWithRedirect`を呼び出す。

今回はポップアップをでログインをしましょう。以下のように呼び出します。

```js
loginBtn.addEventListener('click', () => {
  firebase.auth().signInWithPopup(provider).then(result => {
    // GoogleプロパイダのOAuthトークンを取得します。
    const token = result.credential.accessToken
    // ログインしたユーザーの情報を取得します。
    const user = result.user
  }).catch(function(err) {
    console.error(err)
    // エラー処理
  })
})
```
ここまでできたら早速ログインボタンをクリックしてみましょう！

## 認証方法をプロジェクトで有効化する
おっと！エラーが発生してしまいました！コンソールには次のように書いてあります。
![スクリーンショット 20200412 23.08.41.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2Fgr6RsHqtjuEd40b68r9u%2F7d21c1643f59789360a577dffed82bea.png?alt=media&token=202bb39e-ec3b-4f0c-9943-fce4973a99b7)

この認証方法は使えない、みたいなことが書いてあります。
そうです、うっかりしてましたFirebase Authenticationによる認証を利用するにはコンソールから利用する認証方法を有効化する必要があります。一度コンソールへ戻りましょう。

左のメニューバーから「Authentication」を選択します。
次に、上のタブから「Sign-in method」を選択しましょう。
プロパイダの一覧から「Google」を選択します。

![スクリーンショット 20200412 23.14.18.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2Fgr6RsHqtjuEd40b68r9u%2Fe91639089e5f1ea804d0946d3d8ed455.png?alt=media&token=de72b929-e6d3-42c0-9573-b52c544e2ddc)

右上にある「有効にする」をオンにします。
さらに、プロジェクトのサポートメールを選択してください。
オンになっていることが確認できたら「保存する」をクリックしましょう。

![スクリーンショット 20200412 23.17.37.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2Fgr6RsHqtjuEd40b68r9u%2Fbf5ab6971f7d34efa9a5cf93aa061ab6.png?alt=media&token=68593e81-6fd6-4547-b569-2ab95e56ec1e)

これで、Googleプロパイダが有効になりました。

![スクリーンショット 20200412 23.20.52.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2Fgr6RsHqtjuEd40b68r9u%2F7c384c395379a237126f9bd60e2b36af.png?alt=media&token=b2f4c489-9df6-48d6-9a14-e3859523c01a)

もう一度ログインボタンをクリックしてみましょう。
Googleアカウントの選択画面がでてきて、ログインができるはずです。

## 現在ログインしているユーザーを取得する
通常、ログイン機能が必要なアプリケーションの場合、ユーザーが現在ログインしているかどうか、またログインしているユーザーの情報を知りたいはずです。

そのような場合、Authオブジェクトでオブザーバーを設定します。

```js
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    // ユーザーがログインしています。
  } else {
    // ユーザーはログインしていません。
  }
})
```

`onAuthStateChanged`はユーザーのログイン状態を監視します。
どうやらログイン情報は`IndexedDB`に保存されているようです。
[firebase.auth().onAuthStateChangedはどうやってログイン中であることを判定しているんでしょうか？](https://teratail.com/questions/193911)

`firebase.auth().currentUser`でも現在ログインしているユーザーが取得できるみたいですが、ログインしているはずなのに`currentUser`が`null`になることがあるのでおすすめはしません。

ユーザーインスタンスからはユーザーの情報が取得できます。

```js
// uid
user.uid

// 名前
user.displayName

// プロフィール画像
user.photoURL

// メール
user.email

// 認証済みのメールアドレス化
user.emailVerified

// 電話番号
user.phoneNumber

// 匿名認証かどうか
user.isAnonymous
```

さらに、ユーザープロフィールなど、これ以上のユーザーの情報をもたせたいと思うかもしれません。
そのような場合には、`Realtime DB`かCloud Firestore`を利用します。
`user`コレクションを作成して、`uid`をキーにドキュメントを追加すれば、ログインユーザーのさらなる情報を取得することができます。

## ログアウト
ログインしたなら当然ログアウトもしたはずです。
ログアウトは`singOut`を呼び出すだけです。

```js
const logoutBtn = document.getElementById('logout')

logoutBtn.addEventListener('click', () => {
  firebase.auth().signOut().then(() => {
    // 成功
  }).catch(err => {
    // 失敗
  })
})
```

以上のように、普通に実装したらまあまあめんどくさい認証機能も簡単に実装することができました。

ここまででまあまあ長くなったのでFire StrageとFirestoreは来週に回します。
