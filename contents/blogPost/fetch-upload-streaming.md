---
id: 6ZB8hpKB1F4uIsc46YGuuM
title: "Fetch Upload Streaming でチャットアプリを作ってみる"
slug: "fetch-upload-streaming"
about: "Fetch Upload Streaming とは、ブラウザの JavaScript の POST リクエストで HTTP のストリーミングを行える機能です。より具体的には、Fetch API の `body` に ReadableStream を渡せるようになります。"
createdAt: "2022-08-21T00:00+09:00"
updatedAt: "2022-08-21T00:00+09:00"
tags: ["JavaScript", "Fetch"]
published: true
---
## Fetch Upload Streaming とは

Fetch Upload Streaming とは、ブラウザの JavaScript の POST リクエストで HTTP のストリーミングを行える機能です。より具体的には、[Fetch API](https://developer.mozilla.org/ja/docs/Web/API/Fetch_API) の `body` に [ReadableStream](https://developer.mozilla.org/ja/docs/Web/API/ReadableStream) を渡せるようになります。

```js
const stream = new ReadableStream({})

fetch(`/send?room=${roomId}`, {
  method: "POST",
  body: stream,
  duplex: "half",
});
```

かねてより Fetch API ではレスポンスを `ReadableStream` で取得することはできたのですが、反対にリクエスト時に `body` に Stream データを渡すことはできませんでしたが、[Chrome 105](https://blog.chromium.org/2022/08/chrome-105-beta-custom-highlighting.html) から有効となります。Fetch Upload Streaming を使用すれば、WebSocket のようなリアルタイムなデータのやり取りも `Fetch API` だけで可能となります。今回は `Fetch API` を利用してリアルタイムなチャットアプリを作成してみます。

![fetch-chat](//images.ctfassets.net/in6v9lxmm5c8/4DWp1ZqYKVbksjMQVPCygc/0b8d20373649396268a51e207dd6bf53/fetch-chat.gif)

コードの内容は以下を参照してください。

https://github.com/azukiazusa1/fetch-upload-streaming-chat-app

## クライアントサイド

まずはクライアント側のコードから見ていきましょう。クライアント側のコードは `static` 配下に作成します。はじめに `input` の入力値やフォームの `submit` イベントを捕捉するために `document.querySelector` で DOM 要素を取得しています。チャットアプリなので `roomId` も必要です。`roomId` はクエリパラーメタから取得して存在しない場合にはアラートを出して処理を終了しています。

```js
const input = document.querySelector("#input");
const form = document.querySelector("#form");
const messages = document.querySelector("#messages");
const quit = document.querySelector("#quit");

const roomId = new URLSearchParams(window.location.search).get("roomId");
if (!roomId) {
  alert("No roomId given");
  return;
}
```

### stream をアップロード

stream をアップロードするために `ReadableStream` インスタンスを作成します。[ReadableStream() コンストラクター](https://developer.mozilla.org/ja/docs/Web/API/ReadableStream/ReadableStream) の `start` メソッドを利用して stream を生成します。

```js
const stream = new ReadableStream({
  start(controller) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const message = input.value;
      input.value = "";

      controller.enqueue(message);
    });

    quit.addEventListener("click", () => controller.close());
  },
}).pipeThrough(new TextEncoderStream());
```

`form` が submit された時、`input` の入力値を取得します。`controller.enqueue` メソッドで stream に文字列を追加します。stream の生成を停止するためには　`controller.close()` を呼び出します。これは「quit」ボタンをクリックした時に呼び出すようにしています。

stream は最終的に [ReadableStream.pipeThrough()](https://developer.mozilla.org/ja/docs/Web/API/ReadableStream/pipeThrough) により別の形式に変換されます。ここでは [TextEncoderStream()](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoderStream/TextEncoderStream) により文字列の stream を UTF=8 エンコーディングでバイトに変換されます。

作成した `ReadableStream` インスタンスは `fetch` の `body` パラメータとして設定されます。

```js
fetch(`/send?room=${roomId}`, {
  method: "POST",
  headers: { "Content-Type": "text/plain" },
  body: stream,
  duplex: "half",
});
```

stream を 使用するためには `duplex: "half"` を設定する必要があります。HTTP の機能では「リクエストを送信している間にレスポンスを受信し始めることができるかどうか」というものがあります。`duplex: "half"` はリクエストボディが完全に送信されるまでレスポンスは受信することができません。これはブラウザのデフォルトのパターンです。

しかし、例えば [Deno の Fetch](https://doc.deno.land/deno/stable/~/fetch) などの実装はリクエストが庵寮する間にレスポンスが利用可能となる `deplex: "full"` がデフォルトとなっています。

このような互換性の問題を回避するために `duplex: "half"` をリクエストに必ず設定する必要があるのです。

### stream を読み込む

Fetch API で `res.body` を `ReadableStream` として取得します。

```js
fetch(`/receive?room=${roomId}`).then(async (res) => {
  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) return;
    const newMessage = document.createElement("li");
    messages.appendChild(newMessage);
    newMessage.innerText = `${newMessage.innerText}${value}`;
  }
});
```

stream を読むためにはリーダーを取り付ける必要があります。はじめに `res.body.pipeThrough(new TextDecoderStream())` で文字列の stream を UTF=8 エンコーディングでバイトに変換します。変換後のデータは `getReader()` を呼び出す音でリーダーが作成され、stream にロックされます。このリーダーが開放されるまで、他のリーダーはこの stream を読み取ることができません。

リーダーを取り付けたら [ReadableStreamDefaultReader.read()](https://developer.mozilla.org/ja/docs/Web/API/ReadableStreamDefaultReader/read) メソッドを使用して stream から chunk を読み取ることができます。chunk は `value` プロパティから取得できます。`done` が `true` を返した場合には、stream が閉じられたことを意味します。

取得した　chunk を元に `li` 要素を作成して新たに DOM に追加することで取得したメッセージを表示できます。

### Fetch Upload Streaming が有効かどうかの判定

Fetch Upload Streamig をブラウザがサポートしているかどうか判定するために、ちょっぴり奇妙なコードを使用します。

```js
const supportsRequestStreams = (() => {
  let duplexAccessed = false;

  const hasContentType = new Request('', {
    body: new ReadableStream(),
    method: 'POST',
    get duplex() {
      duplexAccessed = true;
      return 'half';
    },
  }).headers.has('Content-Type');

  return duplexAccessed && !hasContentType;
})();

if (!supportsRequestStreams) {
  // …
}
```

もしブラウザが Fetch Upload Streaming をサポートしていない場合、`body` に `ReadableStream` のインスタンスを渡した際に `ReadableStream` のインスタンスの `toString()` メソッドが呼ばれます。その結果 `body` には `'[object ReadableStream]'` という `string` 型が指定されることになります。`body` に `string` 型が渡された場合には、`Content-Type` ヘッダーに `text/plain;charset=UTF-8` という値が自動的に設定されます。つまりは、`Content-Type` ヘッダーが設定されている（`headers.has('Content-Type')` が `true`）ときにはブラウザが Fetch Upload Streaming をサポートしていないと判定できます。

Safari は少々やっかいで、`body` に stream をを指定することをサポートしているものの、Fetch API において使用することは許可されていません。そのため、現在 Safari がサポートしていない `duplex` オプションが有効かどうかで判定しています。

### HTML

HTML コードはシンプルなので、特に説明する必要もないでしょう。

```html
<h1>Chat via fetch upload streaming</h1>
<form id="form">
  <input type="text" id="input" placeholder="Message">
  <button type="submit" id="send">Send</button>
</form>
<ul id="messages"></ul>
<button id="quit">Quit</button>
```

## サーバーサイド

Fetch Upload Streaming には制限があり HTTP/1.x で利用しようとすると `ERR_H2_OR_QUIC_REQUIRED` というエラーで失敗します。これは HTTP/1.1 の規則ではリクエストとレスポンスのボディは `Content-Length` ヘッダーを送信して相手側が受け取るデータの量を知るか、メッセージのフォーマットを変更して chunked エンコードを使用する必要があるためです。

!> HTTP/1x での利用を有効にする `allowHTTP1ForStreamingUpload` フラグは Chrome の実験的なバージョンでのみ利用可能です。

https://web.dev/i18n/zh/fetch-upload-streaming/#%E9%BB%98%E8%AE%A4%E4%BB%85%E9%99%90-http2

つまりはサーバーのコードは HTTP/2 または HTTP/3 で実装する必要があります。

### プロジェクトのセットアップ

サーバー側のコードは [Express](https://expressjs.com/) で実装します。[spdy](https://github.com/spdy-http2/node-spdy) は Node.js で HTTP/2 サーバーを実装するためのモジュールです。

```sh
npm install express spdy
```

`spdy` を使用するためにはサーバー証明書が必要なので `openssl` コマンドで作成します。

```sh
openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.crt
```

`package.json` にサーバーを起動するコマンドを追加します。

```json
{
  "scripts": {
    "start": "node server.js"
  },
}
```

### サーバーコードの実装

`server.js` ファイルを作成して次のようにコードを実装します。

```js
import express from "express";
import spdy from "spdy";
import fs from "fs";

const app = express();
const receivers = new Map();

app.post("/send", (req, res) => {
  const room = req.query.room;
  if (!room) {
    res.status(400).send("No room given");
    return;
  }

  res.status(200);

  req.on("data", (chunk) => {
    const set = receivers.get(room);
    if (!set) return;
    for (const res of set) res.write(chunk);
  });

  req.on("end", (chunk) => {
    if (res.writableEnded) return;
    res.send("Ended");
  });
});

app.get("/receive", (req, res) => {
  const room = req.query.room;
  if (!room) {
    res.status(400).send("No room given");
    return;
  }

  if (!receivers.has(room)) {
    receivers.set(room, new Set());
  }

  receivers.get(room).add(res);

  res.on("close", () => {
    const set = receivers.get(room);
    set.delete(res);
    if (set.size === 0) receivers.delete(room);
  });

  res.status(200);
  res.set("Content-Type", "text/plain");
});

app.use(express.static("static"));

const port = process.env.PORT || 3000;
spdy
  .createServer(
    {
      key: fs.readFileSync("./server.key"),
      cert: fs.readFileSync("./server.crt"),
    },
    app
  )
  .listen(port, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Listening on port ${port}`);
  });
```

#### リクエストの送信

まずはリクエストを送信する `/send` パスのコードを見ていきます。クエリパラメータから `room` ID を取得します。

```js
const room = req.query.room;
if (!room) {
  res.status(400).send("No room given");
  return;
}

res.status(200);
```

`req.on("data")` で stream data イベントを購読します。クライアントから `controller.close()` で接続が閉じられた場合には `req.on("end")` イベントがコールされます。

stream data を受信した時、`receivers` Map オブジェクトから `room` ID を使用して対応する `/revice` パスの `res` オブジェクトに対して受信した chunk データを送信します。

```js
req.on("data", (chunk) => {
  const set = receivers.get(room);
  if (!set) return;
  for (const res of set) res.write(chunk);
});

req.on("end", (chunk) => {
  if (res.writableEnded) return;
  res.send("Ended");
});
```

#### リクエストの受信

`/receive` パスにクライアントから接続してリクエストの受信を実施します。`/send` パスと同様にクエリパラメータから `room` ID を取得します。

```js
const room = req.query.room;
if (!room) {
  res.status(400).send("No room given");
  return;
}
```

`receivers` Map オブジェクトの対応する `room` ID に `res` オブジェクトをセットします。`res` オブジェクトは `/send` パスから chunk データを送信するために使用されます。

```js
if (!receivers.has(room)) {
  receivers.set(room, new Set());
}

receivers.get(room).add(res);
```

#### HTTP/2 サーバーの作成

最後に `spdy` モジュールを使用して HTTP/2 サーバーを作成します。`createServer` メソッドにはプロジェクトのセットアップ時に作成したサーバー証明書と `Express` の　`app` オブジェクトを設定します。後は `listen` メソッドで 3000 ポートを指定しています。

```js
spdy
  .createServer(
    {
      key: fs.readFileSync("./server.key"),
      cert: fs.readFileSync("./server.crt"),
    },
    app
  )
 .listen(port, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Listening on port ${port}`);
  });
```

## 感想

やっている事自体は WebSocket で実現できることとほとんど変わらないのですが、HTTP の技術のみで実装でいるのが嬉しいですね。WebSocket 用のサーバー建てるのって結構面倒だったりしますしね。

## 参考

- [Streaming requests with the fetch API](https://developer.chrome.com/articles/fetch-streaming-requests/)
- [fetch() upload streaming は WebSocket の代替になるのか。Fetch を使ってカメラから取得した映像をストリーミングで送信する](https://shisama.hatenablog.com/entry/2020/07/28/090000)
- [Webブラウザ上で純粋なHTTPだけで単方向リアルタイム通信を可能にするHTTPのストリーミングアップロードが遂にやってくる](https://scrapbox.io/nwtgck/Web%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E4%B8%8A%E3%81%A7%E7%B4%94%E7%B2%8B%E3%81%AAHTTP%E3%81%A0%E3%81%91%E3%81%A7%E5%8D%98%E6%96%B9%E5%90%91%E3%83%AA%E3%82%A2%E3%83%AB%E3%82%BF%E3%82%A4%E3%83%A0%E9%80%9A%E4%BF%A1%E3%82%92%E5%8F%AF%E8%83%BD%E3%81%AB%E3%81%99%E3%82%8BHTTP%E3%81%AE%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%9F%E3%83%B3%E3%82%B0%E3%82%A2%E3%83%83%E3%83%97%E3%83%AD%E3%83%BC%E3%83%89%E3%81%8C%E9%81%82%E3%81%AB%E3%82%84%E3%81%A3%E3%81%A6%E3%81%8F%E3%82%8B)
- [Getting Started with HTTP/2 in Node.js](https://www.section.io/engineering-education/http2-in-nodejs/)

