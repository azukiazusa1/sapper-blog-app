---
id: SFkjbZauw5zbjYePQ6IM5
title: "Fetch API の textStream() でレスポンスをテキストとしてストリーミングする"
slug: "fetch-text-stream"
about: "Fetch API に textStream() メソッドが追加されました。レスポンスボディを UTF-8 のテキストとして読み出すストリームを返すメソッドで、これまで TextDecoderStream を自分で繋いでいた処理を 1 つの呼び出しに置き換えられます。この記事では従来の書き方との違いを紹介します。"
createdAt: "2026-08-08T12:18+09:00"
updatedAt: "2026-08-08T12:18+09:00"
tags: ["JavaScript", "Fetch"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/75id3RbJaqR0pisOTXogVO/a8784780b6703c7cb96565f056930963/grey-heron_23888.png"
  title: "アオサギのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "ステータスコード 204 のようにボディを持たないレスポンスに対して textStream() を呼び出すとどうなりますか?"
      answers:
        - text: "空のストリームが返る"
          correct: true
          explanation: "ボディが null の場合は空のストリームが返るため、呼び出し側でボディの有無を分岐する必要がありません。"
        - text: "null が返る"
          correct: false
          explanation: "null が返るのは response.body の方です。textStream() は常にストリームを返します。"
        - text: "TypeError が投げられる"
          correct: false
          explanation: "例外は投げられません。"
        - text: "1 度だけ空文字列を流してから閉じる"
          correct: false
          explanation: "チャンクは 1 つも流れず、そのまま閉じられます。"
published: false
---

!> Fetch API の `textStream()` メソッドは現時点で Chrome v 151 以降でのみ利用可能です。

fetch で取得したレスポンスを、最後まで待たずに届いた分から順に画面へ描画することで、ユーザーは待ち時間を短く感じられます。生成 AI のチャット UI のように、テキストが少しずつ表示されていく体験がその代表例で、普段から見慣れているのではないでしょうか。

このときレスポンスボディをそのまま読むと、流れてくるチャンクは `Uint8Array` です。バイト列を文字列にするには `getReader()` でチャンクを逐次読み出し、[TextDecoder](https://developer.mozilla.org/ja/docs/Web/API/TextDecoder) によるデコード処理が必要でした。

```js
const res = await fetch("/api/chat");
const reader = res.body.getReader();
const decoder = new TextDecoder();

for (;;) {
  const { done, value } = await reader.read();
  if (done) break;
  output.textContent += decoder.decode(value, { stream: true });
}

output.textContent += decoder.decode();
```

`decode()` に渡している `{ stream: true }` は、文字として完成していない末尾のバイトをデコーダーの内部に残し、次の呼び出しで先頭に結合させるオプションです。ネットワークから届くバイト列は文字の境界とは無関係に区切られるため、これを指定せずにチャンクごとに独立してデコードすると文字化けが発生します。

この状態管理をストリームとして利用できるようになったのが [TextDecoderStream](https://developer.mozilla.org/ja/docs/Web/API/TextDecoderStream) です。これは `Uint8Array` を受け取って文字列を流す変換ストリームで、`pipeThrough()` で接続することで、チャンクが文字列になった `ReadableStream` を得られます。

```js
const res = await fetch("/api/chat");
if (!res.body) return;

for await (const chunk of res.body.pipeThrough(new TextDecoderStream())) {
  output.textContent += chunk;
}
```

この定型処理を 1 つのメソッドにまとめた `textStream()` が、[whatwg/fetch#1862](https://github.com/whatwg/fetch/pull/1862) で Fetch の仕様に追加されました。上記のようなストリーミングの処理をさらに簡潔に書けるようになるヘルパーメソッドという位置付けです。この記事では `textStream()` の使い方について紹介します。

## textStream()

`textStream()` は [Body mixin](https://fetch.spec.whatwg.org/#body-mixin) に追加されたメソッドで、ボディを UTF-8 の `TextDecoderStream` に通したストリームを返します。先ほどのコードは次のように書き換えられます。

```diff
 const res = await fetch("/api/chat");
-if (!res.body) return;
 
-for await (const chunk of res.body.pipeThrough(new TextDecoderStream())) {
+for await (const chunk of res.textStream()) {
   output.textContent += chunk;
 }
```

返り値は `ReadableStream` なので、`for await...of` でそのまま反復できます。`TextDecoderStream` で行っていたデコード処理はブラウザの内部へ移っています。仕様上の `textStream()` は、新しい `TextDecoderStream` を UTF-8 でセットアップし、ボディのストリームをそこに通した結果を返すと定義されています。

::::info
`textStream()` は、レスポンスの `Content-Type` ヘッダーに指定された `charset` の値にかかわらず、常に UTF-8 でデコードします。UTF-8 以外でエンコードされたレスポンスを読み取る場合には、`TextDecoderStream` を使用して文字コードを明示する必要があります。
::::

`if (!res.body)` の分岐が要らなくなるのも、仕様で定められた挙動によるものです。`res.body` は 204 のレスポンスや HEAD リクエストへのレスポンスなど、ボディを持たない場合に `null` になります。`null` に対して `pipeThrough()` は呼び出せないため、これまでは事前の分岐が必要でした。一方、`textStream()` は、ボディが `null` の場合に空のストリームを作って即座に閉じたうえで返します。そのため分岐せずに `for await...of` へ渡せます。単にループが 1 回も回らないだけで、例外は投げられません。

:::warning
ボディがすでに読み取られている場合や、ボディのストリームが `getReader()` などでロックされている場合には、`textStream()` を呼び出すと `TypeError` が投げられます。
:::

`textStream()` は `Response` だけでなく `Request` と `Blob` にも実装されています。

```js
const request = new Request("https://example.com", {
  method: "POST",
  body: "リクエストボディ",
});

for await (const chunk of request.textStream()) {
  console.log(chunk);
}

const blob = new Blob(["Blob の内容"]);

for await (const chunk of blob.textStream()) {
  console.log(chunk);
}
```

## 動かしてみる

実際にストリーミングレンダリングを試してみましょう。まずは生成 AI の応答を模したダミーサーバーを [Hono](https://hono.dev/) で用意します。

```sh
npm install hono @hono/node-server
```

`streamText()` ヘルパーを使い、メッセージを UTF-8 のバイト列に変換してから 12 バイトずつ送信します。

```js:server.js
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { streamText } from "hono/streaming";

const app = new Hono();

const message =
  "textStream() は Fetch の Body mixin に追加されたメソッドです。" +
  "レスポンスのバイト列を UTF-8 のテキストとして読み出すストリームを返すため、" +
  "TextDecoderStream を自分で組み立てる必要がなくなります。";

const CHUNK_SIZE = 12;

app.get("/api/chat", (c) => {
  return streamText(c, async (stream) => {
    const bytes = new TextEncoder().encode(message);
    for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
      await stream.write(bytes.subarray(i, i + CHUNK_SIZE));
      await stream.sleep(50);
    }
  });
});

app.use("/*", serveStatic({ root: "./public" }));

serve({ fetch: app.fetch, port: 8787 }, (info) => {
  console.log(`Listening on http://localhost:${info.port}`);
});
```

クライアント側のコードは `public/index.html` に配置します。ボタンを押すとエンドポイントへ fetch し、届いたチャンクを段落に追記していくだけの内容です。

```html:public/index.html
<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <title>textStream() でストリーミングレンダリング</title>
  </head>
  <body>
    <button id="send" type="button">送信</button>
    <p id="output" aria-live="polite"></p>

    <script type="module">
      const output = document.getElementById("output");

      document.getElementById("send").addEventListener("click", async () => {
        output.textContent = "";
        const res = await fetch("/api/chat");

        for await (const chunk of res.textStream()) {
          output.textContent += chunk;
        }
      });
    </script>
  </body>
</html>
```

サーバーを起動し `http://localhost:8787/index.html` を開いて送信ボタンを押すと、テキストが少しずつ表示されていく様子が確認できます。デコードの途中でチャンクが分割されても文字化けせず、正しく表示されることも確認できます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/50Syb0RUg5U2CdB9Waqw7v/5a14985b0077b43bd6c3ee106e1fd26b/b1ab9796-2fd9-4d70-b05c-205afda43599.mov" controls></video>

## まとめ

- `textStream()` は `response.body.pipeThrough(new TextDecoderStream())` を置き換えるメソッド
- 定型のパイプ処理とボディの `null` チェックがなくなり、コードが簡潔になるというメリットがある

## 参考

- [Add a textStream() method to the Body mixin by foolip · Pull Request #1862 · whatwg/fetch](https://github.com/whatwg/fetch/pull/1862)
- [Convenience method to stream a response as text · Issue #1861 · whatwg/fetch](https://github.com/whatwg/fetch/issues/1861)
- [textStream() for response/request/blob | Chrome Platform Status](https://chromestatus.com/feature/5146752165478400)
- [TextDecoderStream - Web API | MDN](https://developer.mozilla.org/ja/docs/Web/API/TextDecoderStream)
- [Fetch Standard](https://fetch.spec.whatwg.org/#dom-body-textstream)
