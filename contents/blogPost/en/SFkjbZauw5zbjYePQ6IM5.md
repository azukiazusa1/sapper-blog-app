---
id: SFkjbZauw5zbjYePQ6IM5
title: "Stream a Fetch API Response as Text with textStream()"
slug: "fetch-text-stream"
about: "The Fetch API now includes textStream(), which reads response bodies as UTF-8 text. It replaces manually piping through TextDecoderStream with a single call. This article compares it with the previous approach."
createdAt: "2026-08-08T12:18+09:00"
updatedAt: "2026-08-08T12:18+09:00"
tags: ["JavaScript", "Fetch"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/75id3RbJaqR0pisOTXogVO/a8784780b6703c7cb96565f056930963/grey-heron_23888.png"
  title: "アオサギのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "What happens when you call textStream() on a response with no body, such as one with status code 204?"
      answers:
        - text: "It returns an empty stream"
          correct: true
          explanation: "When the body is null, it returns an empty stream, so callers do not need to branch based on whether a body is present."
        - text: "It returns null"
          correct: false
          explanation: "response.body returns null. textStream() always returns a stream."
        - text: "It throws a TypeError"
          correct: false
          explanation: "It does not throw an exception."
        - text: "It emits an empty string once and then closes"
          correct: false
          explanation: "It closes without emitting any chunks."
published: false
---

!> At the time of writing, the Fetch API's `textStream()` method is available only in Chrome 151 and later.

Rendering a response as data arrives, rather than waiting for the entire response, can make the wait feel shorter for users. A familiar example is a generative AI chat UI, where text appears a little at a time.

When you read a response body directly, the chunks it yields are `Uint8Array` values. Converting those byte sequences into strings required reading each chunk with `getReader()` and decoding it with [TextDecoder](https://developer.mozilla.org/ja/docs/Web/API/TextDecoder).

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

The `{ stream: true }` option passed to `decode()` keeps trailing bytes that do not yet form a complete character inside the decoder and combines them with the beginning of the next input. Because byte sequences received over the network are split independently of character boundaries, decoding each chunk separately without this option can produce garbled text.

[TextDecoderStream](https://developer.mozilla.org/ja/docs/Web/API/TextDecoderStream) makes this stateful decoding available as a stream. It is a transform stream that accepts `Uint8Array` values and emits strings. Connecting it with `pipeThrough()` gives you a `ReadableStream` whose chunks are strings.

```js
const res = await fetch("/api/chat");
if (!res.body) return;

for await (const chunk of res.body.pipeThrough(new TextDecoderStream())) {
  output.textContent += chunk;
}
```

The `textStream()` method, added to the Fetch Standard in [whatwg/fetch#1862](https://github.com/whatwg/fetch/pull/1862), wraps this boilerplate in a single method. It is a helper that makes streaming code like the example above even more concise. This article explains how to use `textStream()`.

## textStream()

`textStream()` is a method added to the [Body mixin](https://fetch.spec.whatwg.org/#body-mixin). It returns a stream that passes the body through a UTF-8 `TextDecoderStream`. The previous example can be rewritten as follows:

```diff
 const res = await fetch("/api/chat");
-if (!res.body) return;
 
-for await (const chunk of res.body.pipeThrough(new TextDecoderStream())) {
+for await (const chunk of res.textStream()) {
   output.textContent += chunk;
 }
```

The return value is a `ReadableStream`, so you can iterate over it directly with `for await...of`. The decoding previously performed by `TextDecoderStream` now happens inside the browser. The specification defines `textStream()` as setting up a new UTF-8 `TextDecoderStream` and returning the result of piping the body stream through it.

::::info
`textStream()` always decodes as UTF-8, regardless of the `charset` value specified in the response's `Content-Type` header. To read a response encoded in a character encoding other than UTF-8, use `TextDecoderStream` and specify the encoding explicitly.
::::

The fact that you no longer need the `if (!res.body)` branch also follows from behavior defined by the specification. `res.body` is `null` when a response has no body, such as a 204 response or a response to a HEAD request. Because you cannot call `pipeThrough()` on `null`, the previous approach required a guard. In contrast, when the body is `null`, `textStream()` creates an empty stream, closes it immediately, and returns it. You can therefore pass it to `for await...of` without branching. The loop simply does not run, and no exception is thrown.

However, calling `textStream()` throws a `TypeError` if the body has already been read or if its stream has been locked by `getReader()` or a similar operation.

`textStream()` is implemented not only on `Response`, but also on `Request` and `Blob`.

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

## Trying it out

Let's try streaming text to the page. First, we will use [Hono](https://hono.dev/) to create a mock server that simulates a generative AI response.

```sh
npm install hono @hono/node-server
```

Using the `streamText()` helper, the server encodes the message as a UTF-8 byte sequence and sends it 12 bytes at a time.

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

Place the client-side code in `public/index.html`. When the button is clicked, it fetches the endpoint and appends each incoming chunk to a paragraph.

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

Start the server, open `http://localhost:8787/index.html`, and click the send button. You will see the text appear a little at a time. Even when a character's bytes are split across chunks during decoding, the text is displayed correctly without garbled characters.

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/50Syb0RUg5U2CdB9Waqw7v/5a14985b0077b43bd6c3ee106e1fd26b/b1ab9796-2fd9-4d70-b05c-205afda43599.mov" controls></video>

## Summary

- `textStream()` replaces `response.body.pipeThrough(new TextDecoderStream())`
- It eliminates boilerplate piping and the need to check whether the body is `null`, making the code more concise

## References

- [Add a textStream() method to the Body mixin by foolip · Pull Request #1862 · whatwg/fetch](https://github.com/whatwg/fetch/pull/1862)
- [Convenience method to stream a response as text · Issue #1861 · whatwg/fetch](https://github.com/whatwg/fetch/issues/1861)
- [textStream() for response/request/blob | Chrome Platform Status](https://chromestatus.com/feature/5146752165478400)
- [TextDecoderStream - Web API | MDN](https://developer.mozilla.org/ja/docs/Web/API/TextDecoderStream)
- [Fetch Standard](https://fetch.spec.whatwg.org/#dom-body-textstream)
