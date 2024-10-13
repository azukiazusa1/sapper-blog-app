---
id: ZD6xk9KHLjRymWDRt-T1z
title: "Chrome の組み込み AI の Summarization API を試してみる"
slug: "try-chrome-internal-ai-summarization-api"
about: "Google では大規模言語モデル（LLM）などの AI モデルをブラウザに直接統合するように設計された、Web プラットフォーム API とブラウザ機能を開発しています。これには Gimini Nano という AI モデルが含まれており、デスクトップパソコンにおいてローカルで実行されるように設計されています。この記事では Summarization API を使用して、文章を要約してみます。"
createdAt: "2024-10-13T13:27+09:00"
updatedAt: "2024-10-13T13:27+09:00"
tags: ["AI", "JavaScript"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/8jYj0zIygRVhqc8IhKuHD/489b061cfdd9715b05d079057e65c301/desert_sundae_16897.png"
  title: "デザートのサンデーのイラスト"
selfAssessment:
  quizzes:
    - question: "Summarization API を使用してストリーミングで要約を取得するためにはどのメソッドを使用するか？"
      answers:
        - text: "summarizer.summarize()"
          correct: false
          explanation: ""
        - text: "summarizer.summarize({ streaming: true })"
          correct: false
          explanation: ""
        - text: "summarizer.summarizeStreaming()"
          correct: true
          explanation: ""
        - text: "summarizer.summarizeStream()"
          correct: false
          explanation: ""

published: true
---

Google では大規模言語モデル（LLM）などの AI モデルをブラウザに直接統合するように設計された、Web プラットフォーム API とブラウザ機能を開発しています。これには Gimini Nano という AI モデルが含まれており、デスクトップパソコンにおいてローカルで実行されるように設計されています。

ブラウザに直接 AI が組み込まることにより、開発者は独自の AI モデルをサーバーにデプロイすることなく、AI を活用した機能を提供できます。ユーザーにとっても、サーバーへのリクエストが不要なため、AI を利用した機能が高速に動作することが期待できますし、オフラインでも AI 機能を利用できるといった利点があります。

2024 年 10 月 13 日現在、Chrome の Canary ビルドにおいて、プレビューリリースとして以下の API が提供されています。

- プロンプト API：自然言語を使用してユーザーと対話する
- Summarization API：テキストの要約を生成する
- Language Detection API：テキストの言語を検出する
- Writer, Rewriter API：テキストの書き込み、書き換えを行う

この記事では、Summarization API を使用して、文章の要約の生成を試してみます。

## Chrome で AI モデルを使用するためのセットアップ

Chrome のビルドイン AI は現在デスクトップパソコンにフォーカスして提供されているため、以下の Chrome ではサポートされていません。

- Chrome for Android
- Chrome for iOS
- Chrome for ChromeOS

また、Chrome Profile に少なくとも 22GB の空き容量が必要です。以上の要件を満たしている場合、以下の手順でセットアップを行います。

### AI モデルのダウンロード

1. Google の [生成 AI の使用禁止に関するポリシー](https://policies.google.com/terms/generative-ai/use-policy) を確認
2. [Chrome Canary](https://www.google.com/chrome/canary/) をインストール。バージョンが v129.0.6639.0 以上であることを確認
3. インストールが完了したらアドレスバーに `chrome://flags` と入力して設定画面を開く。以下の 2 つのフラグを設定して再起動する

- Enables optimization guide on device: Enabled BypassPerfRequirement
- Prompt API for Gemini Nano: Enabled

![](https://images.ctfassets.net/in6v9lxmm5c8/1XmoKJPwpK6ynXLnDYNzzW/ebbba17f86bf6cce5ad28d763faa138b/__________2024-06-11_19.28.20.png)

4. Devloper Tools を開き、Console タブに以下のコードを貼り付けて実行する

```js
(await ai.assistant.capabilities()).available;
```

`"readily"` と表示されれば、AI モデルが利用可能です。それ以外の場合は、以下の手順を実行してください。

1. `await ai.assistant.create();` を実行する。この時点では失敗するが、AI モデルのダウンロードが開始される
2. Chrome を再起動する
3. `chrome://components` にアクセスして、`Optimization Guide On Device Model` のステータスを確認する。「ステータス - ダウンロードしています」が表示されていれば正常に AI モデルのダウンロードが行われているので、ダウンロードが完了するまで待機する「ステータス　- 更新完了」が表示されたら、AI モデルが利用可能

### Summarization API を有効にする

各 API は個別にフラグを有効にする必要があります。Summarization API を有効にするには、以下の手順を実行します。

1. Chrome のアドレスバーに `chrome://flags/#summarization-api-for-gemini-nano` と入力して、`Summarization API for Gemini Nano` を `Enabled` に設定し、Chrome を再起動する
2. Developer Tools を開き、Console タブで以下のコードを実行して、API が利用可能か確認する

```js
(await ai.summarizer.capabilities()).available;
// "readily" が表示されれば利用可能
// "after-download" が表示されればダウンロードが完了するまで待機
// "no" が表示されれば利用不可
```

## Summarization API を試してみる

Summarization API を使用して、文章を要約してみます。以下のコードを Developer Tools の Console タブに貼り付けて実行します。

```js
const summarizer = await ai.summarizer.create();
const text =
  "JavaScript (JS) is a lightweight interpreted (or just-in-time compiled) programming language with first-class functions. While it is most well-known as the scripting language for Web pages, many non-browser environments also use it, such as Node.js, Apache CouchDB and Adobe Acrobat. JavaScript is a prototype-based, multi-paradigm, single-threaded, dynamic language, supporting object-oriented, imperative, and declarative (e.g. functional programming) styles.";

const result = await summarizer.summarize(text);
console.log(result);
```

-> テキストの要約は現在英語の入力/出力のみサポートされています。日本語の入力を試してみたところ、`Uncaught NotSupportedError:` というエラーが発生しました。

このコードを実行すると、以下のような結果が返ってきました。実行するたびに異なる結果が返ってくることがあります。

```sh
* JavaScript is a scripting language known for its lightweight nature and interpreter/just-in-time compiler capabilities.
* Widely used on websites, JavaScript is also employed in environments like Node.js, Apache CouchDB, and Adobe Acrobat.
* JavaScript is a prototype-based, multiparadigm, single-threaded, dynamic language supporting object-oriented, imperative, and declarative programming styles.
```

### コンテキストを指定して要約する

`await ai.summarizer.create()` にオプションを渡すことで、テキストを要約する際のコンテキストや要約の長さを指定できます。例として、技術ブログの記事を要約してタイトルを生成するコードを以下に示します。

```js
const summarizer = await ai.summarizer.create({
  sharedContext: "An article from Web front-end development blog",
  // "tl;dr", "key-points", "teaser", "headline"
  type: "headline",
  // "plain-text", "markdown"
  format: "plan-text",
  // "short", "medium", "long"
  length: "short",
});
```

先程実行したコードのテキストで再度要約を行うと、より短い要約が生成されることわかります。

```js
const summarizer = await ai.summarizer.create({
  sharedContext: "An article from Web front-end development blog",
  type: "headline",
  length: "short",
});
const text =
  "JavaScript (JS) is a lightweight interpreted (or just-in-time compiled) programming language with first-class functions. While it is most well-known as the scripting language for Web pages, many non-browser environments also use it, such as Node.js, Apache CouchDB and Adobe Acrobat. JavaScript is a prototype-based, multi-paradigm, single-threaded, dynamic language, supporting object-oriented, imperative, and declarative (e.g. functional programming) styles.";

const result = await summarizer.summarize(text);
console.log(result);
// JavaScript is a versatile programming language used for web development and beyond.
```

`summarizer.summarize()` を呼び出す際に個別のコンテキストを指定することもできます。

```js
const summarizer = await ai.summarizer.create({
  sharedContext: "An article from Web front-end development blog",
  type: "headline",
  length: "short",
});

const result = await summarizer.summarize(text, {
  context: "This article was written by a web developer.",
});
```

### ダウンロードの進行状況を表示する

`ai.summarizer.create()` を実行したとき、AI モデルがダウンロードされていない場合には `ai.summarizer.capabilities()` の `available` プロパティが `"after-download"` となります。この場合には、AI モデルのダウンロードが開始され、完了するまで AI の機能を利用できません。

AI モデルのダウンロードの進行状況は `downloadprogress` イベントを使用して監視できます。以下のコードでは `available` プロパティが `"readily"` の場合は即座に実行し、それ以外の場合はダウンロードの進行状況を表示します。`summarizer.ready` プロパティを使用することで、ダウンロードが完了したかどうかを確認できます。

```js
const canSummarize = await ai.summarizer.capabilities();

// "no" の場合は利用不可
if (canSummarize.available === "no") {
  console.log("Summarization API is not available.");
  return;
}

const summarizer = await ai.summarizer.create();
if (canSummarize.available === "after-download") {
  summarizer.addEventListener("downloadprogress", (event) => {
    console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
    const progressbar = document.querySelector("progress");
    progressbar.value = e.loaded;
    progressbar.max = e.total;
  });

  await summarizer.ready;
}

const result = await summarizer.summarize(text);
```

### AI の実行の中断

[AbortController](https://developer.mozilla.org/ja/docs/Web/API/AbortController) を使用することで、テキストの要約を中断できます。`summarizer.summarize()` のオプションに `signal` プロパティに `AbortController` のインスタンスを渡したうえで、`AbortController` の `abort()` メソッドを呼び出すことで中断できます。

```js
const controller = new AbortController();

const button = document.querySelector(".cancel-button");
button.addEventListener("click", () => {
  controller.abort();
});

const summarizer = await ai.summarizer.create();

try {
  const result = await summarizer.summarize(text, {
    signal: controller.signal,
  });
  console.log(result);
} catch (error) {
  console.error("Summarization was aborted.");
}
```

### ストリーミングで要約を取得する

`await summarizer.summarize()` は要約をすべて完了してから結果を返すため、大きなテキストを要約する際には時間がかかることがあります。この場合、`summarizer.summarize()` の代わりに `summarizer.summarizeStreaming()` を使用することで、ストリーミングで要約を取得できるため、テキストの生成が完了したチャンクごとに結果を取得できます。

```js
const summarizer = await ai.summarizer.create();
const text =
  "JavaScript (JS) is a lightweight interpreted (or just-in-time compiled) programming language with first-class functions. While it is most well-known as the scripting language for Web pages, many non-browser environments also use it, such as Node.js, Apache CouchDB and Adobe Acrobat. JavaScript is a prototype-based, multi-paradigm, single-threaded, dynamic language, supporting object-oriented, imperative, and declarative (e.g. functional programming) styles.";

const textbox = document.querySelector("#textbox");
const stream = summarizer.summarizeStreaming(text);
for await (const chunk of stream) {
  textbox.value = chunk;
}
```

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/2lWPh0Q24hctRnPQkW81ny/e8ac920cb615d48d6a50b066f8432f2c/_____2024-10-13_17.25.39.mov" controls></video>

## まとめ

- Chrome Canary には AI モデルを使用するための Web プラットフォーム API が提供されている
- Summarization API を使用して、文章の要約を生成できる
- 要約を生成する際には、コンテキストや要約の長さを指定できる
- AI モデルがダウンロードされていない場合は、AI モデルのダウンロードが開始され、完了するまで AI の機能を利用できない。`downloadprogress` イベントを使用してダウンロードの進行状況を表示できる
- `AbortController` を使用することで、要約を中断できる
- `summarizer.summarizeStreaming()` を使用することで、ストリーミングで要約を取得できる

## 参考

- [WICG/writing-assistance-apis: A proposal for writing assistance web APIs: summarizer, writer, and rewriter](https://github.com/WICG/writing-assistance-apis)
- [web-ai-demos/summarization-api-playground/src/main.ts at main · GoogleChromeLabs/web-ai-demos](https://github.com/GoogleChromeLabs/web-ai-demos/blob/main/summarization-api-playground/src/main.ts)
- [Summarization API の早期プレビュー版が利用可能に  |  Blog  |  Chrome for Developers](https://developer.chrome.com/blog/august2024-summarization-ai?hl=ja)
- [Summarizer API - Chrome Platform Status](https://chromestatus.com/feature/5193953788559360)
- [組み込みの AI  |  AI on Chrome  |  Chrome for Developers](https://developer.chrome.com/docs/ai/built-in?hl=ja)
