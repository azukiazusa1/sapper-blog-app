---
id: 4GRnmS3mna9g1GTVhgY5SD
title: "Node.js - サーバーサイドのJavaScript"
slug: "node-js"
about: "Node.jsは、V8 Javascriptエンジン上に構築されたJavaScriptの実行環境です。サーバーサイドのJavaScript環境であり、非同期、イベント駆動といった特徴があります。"
createdAt: "2020-06-07T00:00+09:00"
updatedAt: "2021-02-07T00:00+09:00"
tags: ["Node.js", "JavaScript"]
published: true
---
# Node.jsとは

Node.jsは、[V8 Javascriptエンジン](https://ja.wikipedia.org/wiki/V8_(JavaScript%E3%82%A8%E3%83%B3%E3%82%B8%E3%83%B3))上に構築されたJavaScriptの実行環境です。**サーバーサイド**のJavaScript環境であり、**非同期**、**イベント駆動**といった特徴があります。

![node.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2FmDVbWFeXeln9BJXqBa76%2F027ab8d7dc7cdb4ab9c09c0a057af2e7.png?alt=media&token=f5b5ceea-a420-4f3e-9d25-eef821d45145)
## シングルスレッド
Node.jsはシングルスレッドで動作します。つまりは、一度に一つの処理しかできないということです。しかし、それでは困るので（商品一覧ページを閲覧するために、他の誰かが商品の購入が完了するのを待ちたいですか？）ノンブロッキングI/Oがそれを解決します。
ノンブロッキングI/Oは、データの送受信(I/O)の完了を待たず(ブロックせず)に、次の処理を受け付け、並列に実行します。前の処理が終わったら、その結果はコールバックで受け取ります。

## イベント駆動
イベント駆動とは、イベントや状態の変化によって決定されるアプリケーションのフロー制御です。例えば、フロントエンドで使用されるJavaScriptはユーザーの「クリック」や「マウスオーバー」といったイベントによって動作します。イベントを監視して、イベントを検知したらコールバックを呼び出します。

Node.jsのイベントループは無限に繰り返し実行されています。サーバーによってトリガされるイベント(httpリクエストなど)を監視し、イベントを検知した場合にはイベントループのキューへ入れられます。キューに入ったタスク(コールバック)が順番に実行されます。

## Node.jsを使用する利点

Node.jsをサーバーサイドの言語として採用する利点として、以下の点が上げられます。

- チャット機能や連続的なストリーミングを実装する際に有利。WebSocket通信を簡単に記述できるSocket.ioというライブラリがあります。
- 大量のリクエストを処理することができる
- ライブラリ/エコシステムが(npm)が充実している
- フロントエンド/サーバーサイドで同じ言語を使用できるため、学習コストが低い

# Node.jsのインストール

Node.jsをインストールするにはいくつか方法がありますが、全て下記URLから確認できます。

[https://nodejs.org/ja/download/](https://nodejs.org/ja/download/)

最も簡単な方法はダウンロードページのインストーラーをクリックするだけです。

![スクリーンショット 20200607 22.08.07.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2FmDVbWFeXeln9BJXqBa76%2F1189630ef8e4a00a1b8a39387b6239ba.png?alt=media&token=54e01b54-231a-4e16-a459-8f35fa521311)

Node.jsのバージョンにはLTS(推奨版)と最新版があります。
LTSはLong Term Supportということで、長期のサポートを約束します。
最新版はその名の通り一番新しいバージョンを利用できますが、バグが入り込んでいる可能性があります。
無難にLTS版を選ぶべきでしょう。

Node.jsのインストールが完了したら、以下のコマンドで正しくインストールされたか確認してみましょう。

```sh
node -v
v12.14.1
```

Node.jsをインストールすると、同時にnpmも入手できます。ついでに確認してみましょう。

```sh
npm -v
6.14.4
```

# Node.jsを実際に使用する

それでは実際にNode.jsを使用してみます。手始めに、簡単なサーバーを立ててHello Worldと表示させてみましょう。

## Node.jsでHello World

```javascript
// httpモジュールをロード
const http = require('http')
const port = 3000

http.createServer((req, res) => {
  // レスポンスヘッダー
  res.writeHead(200, {
    'Content-Type': 'text/html'
  })
  // レスポンスボディ
  res.end('<h1>Hello World</h1>')
}).listen(port) // ポート3000で待ち受ける
```

HTTPを使ってWebで通信を行うには、`http`モジュールを利用します。`http`モジュールは、Node.jsもコアライブラリの一つであるため、Node.jsをインストールした際に同時にインストールされています。

Node.jsでモジュールをインストールする際には、CommonJS仕様に従います。モジュールをインポートするには`require()`でパスを指定します。`require()`のパスが`./`、`../`、`/`のいずれでも始まらない場合には、コアライブラリ、`node_modules`の順に捜索します。

次の行は、このアプリケーションで仕様するポート番号3000を代入しています。
開発のWebサーバーでは一般にポート番号3000が使われます。

`http`モジュールの`createServer()`関数は、`http.Server`のインスタスを生成します。サーバーのインスタンスを作成したら、アプリケーションはHTTPリクエストを受信しHTTPレスポンスを送信する準備が完了します。

`createServer()`はコールバックを引数に受け取ります。

コールバックはリクエストとレスポンスをを引数として受け取り、慣例的に`req`,`res`と表されます。
この`res`パラメータを使用して、リクエストをしたユーザーにレスポンスを送り返します。

`writeHead()`メソッドでは、リクエストのヘッダを記述します。ここではリクエストの成功を表す「200」ステータスコードとコンテンツをHTML形式で送るということを表す`Content-Type`を記述します。

`end()`メソッドでレスポンスのボディを送るとともにレスポンスが終了したことをクライアントに伝えます。ボディを送るだけなら`write()`メソッドを仕様することもできますが、その場合でも必ず`end()`メソッドを読んでレスポンスの終了を伝える必要があります。

最後に、作成されたサーバーのインスタンスの`listen()`メソッドで使用するポート番号を伝えます。

このコードを実行するには、ファイルに保存して(ここでは`main.js`という名前にしました)ターミナル上で`node <ファイル名>`で実行します。ファイル名の`.js`は省略しても構いません。

```sh
node main 
```

無事実行できたら、ブラウザで[http://localhost:3000/](http://localhost:3000/)をアクセスしてみましょう。Hello Worldと表示されているはずです。

![スクリーンショット 20200607 23.11.52.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2FmDVbWFeXeln9BJXqBa76%2F9c55d38d7eef65fc08be2248b6d5d328.png?alt=media&token=acfda26c-85f7-4c23-a58b-df088dd5fbc9)

## リクエストを表示する

`req`パラメータでは、クライアントからのリクエストを受け取ることができます。
リクエストのログを出力してみましょう。

```javascript
const http = require('http')
const port = 3000

http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html'
  })
  console.log(req.method)
  console.log(req.url)
  console.log(req.headers)
  res.end('<h1>Hello World</h1>')
}).listen(port)
```

`req.method`はリクエストメソッド、`req.url`はリクエストしたURL、`req.headers`はリクエストヘッダーです。

コードを変更したのなら、サーバーを再起動する必要があります。一度 `Cnrl + cで`終了したあとに、再度`node <ファイル名>`で起動してください。

(このめんどくさいタスクは[nodemon](https://www.npmjs.com/package/nodemon)というパッケージを利用すれば削減されます。一般的には必ずといっていいほど使用されるべきですが、今回は小さなアプリケーションのためスキップします。)

[http://localhost:3000/](http://localhost:3000/)に訪れたら、ターミナル上で次のようなログが出力されます。

```sh
GET
/
{
  host: 'localhost:3000',
  connection: 'keep-alive',
  'cache-control': 'max-age=0',
  'upgrade-insecure-requests': '1',
  'user-agent': 'Mozilla/5.0 ... 以下略
}
```

見事に出力されましたね。試しに[http://localhost:3000/users](http://localhost:3000/users)というパスを訪れてみると、出力結果は変わるはずです。

```sh
GET
/users
{
  host: 'localhost:3000',
  connection: 'keep-alive',
  'cache-control': 'max-age=0',
  'upgrade-insecure-requests': '1',
  'user-agent': 'Mozilla/5.0 ... 以下略
}
```

## ルーティングを追加する

今度は、アプリケーションにルーティングを加えてみます。
`req.url`を使用すれば、ユーザーがどのURLに対してアクセスしてきたのかわかるので、それを使用して条件分岐をしましょう。

どのルートにもあてはまらなかった場合には、コンテンツが見つからなかったことを表すエラーコド「404」を返します。

```javascript
const http = require('http')
const port = 3000

http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    })
    res.end('<h1>Hello World</h1>')
  } else if (req.url === '/users') {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    })
    res.end(`
      <h1>Users</h1>
      <ul>
        <li>Jone</li>
        <li>Aaron</li>
        <li>Abel</li>
      </ul>
    `)
  } else {
    res.writeHead(400, {
      'Content-Type': 'text/html'
    })
    res.end('<h1>Not Found!</h1>')
  }
}).listen(port)
```

サーバーを再起動して、`/users`や存在しないルートを訪問してみてください。

![スクリーンショット 20200607 23.37.45.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2FmDVbWFeXeln9BJXqBa76%2Feb30d6313cf006da6d4fef9134e100fa.png?alt=media&token=15108e74-f59e-482c-8606-3f991a90fb0f)

![スクリーンショット 20200607 23.39.38.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2FmDVbWFeXeln9BJXqBa76%2F2b26e7863a3aeb66d3864c3d0be7a6dc.png?alt=media&token=7c44d921-601d-47fb-b693-37303279e4b0)

開発者ツールのネットワークログから、404が返されていることが確認できます。

## 外部からからHTMLファイルを読み込む

ルートも増えてきたので、レスポンスボディのコンテンツは別のフォルダに保存して読み取りましょう。`viwes`フォルダを作成して、そこに`index.html`と`user.html`を作成します。
構成は次のようになります。

```sh
- main.js
- views - index.html
        - users.html
```

例として、`index.html`を次のように作成しました。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Home Page</title>
</head>
<body>
  <h1>Welcome!</h1>
</body>
</html>
```

Node.jsでファイルを読み込むには`fs`モジュールが必要です。このモジュールも`http`モジュールと同じくNode.jsのコアライブラリです。`main.js`ファイルの先頭にこのモジュールを使用できるように`const fs = require('fs')を追加します。

ファイルの読み込みは`readFile()`関数を使用します。`readFile()`関数は第1引数にファイル名、第2引数にコールバックを受け取ります。

```javascript
fs.readFile('views/index.html`, (err, data) => {})
```

コールバックの第1引数にはエラーを受け取ります。何らかの理由でファイルが読み込まれなかったときには、このパラメータに値が渡されエラーが有ったことを通知します。
`readFile()`関数に限らず、Node.jsでは非同期処理の例外の取り扱いとして、処理が失敗した場合は、コールバック関数の1番目の引数にエラーオブジェクトを渡して呼び出す**エラーファーストコールバック**が広く使われていました。
ECMAScript 2015（ES2015）で`Promise`が仕様に入るまで、非同期処理中に発生した例外を扱う仕様がなかったためです。

現在では、`Promise`を使うことが推奨されています。

最終的なコードは次のようになります。

```javascript
const http = require('http')
const port = 3000
const fs = require('fs')

http.createServer((req, res) => {
  if (req.url === '/') {
    fs.readFile('views/index.html', (error, data) => {
      console.log(error)
      if (!error) {
        res.writeHead(200, {
          'Content-Type': 'text/html'
        })
        res.end(data)
      } else {
        res.writeHead(404, {
          'Content-Type': 'text/html'
        })
        res.end('<h1>Not Found!</h1>')
      }
    })
  } else if (req.url === '/users') {
    fs.readFile('./views/users.html', (error, data) => {
      if (!error) {
        res.writeHead(200, {
          'Content-Type': 'text/html'
        })
        res.end(data)
      } else {
        res.writeHead(404, {
          'Content-Type': 'text/html'
        })
        res.end('<h1>Not Found!</h1>')
      }
    })
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html'
    })
    res.end('<h1>Not Found!</h1>')
  }
}).listen(port)
```

`fs.readFile()`のコールバックのエラーが存在しないときには通常のレスポンスを送り、エラーがあったときには404を返します。

## express.jsを使用する

一通り簡単なアプリケーションを作成しましたが、このまま進めていったらコードは見るも耐えないものになるのは間違いないです。

そこで、次からはNode.jsのフレームワークとして有名なExpress.jsを使用してアプリケーションを構築していきます。

また来週へ。
