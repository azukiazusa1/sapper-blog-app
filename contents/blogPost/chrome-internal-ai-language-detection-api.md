---
id: iilieFffmvKjph-bBwKXr
title: "Chrome の組み込み AI の Language Detection API で言語を判定する"
slug: "chrome-internal-ai-language-detection-api"
about: "Language Detection API は Chrome に組み込まれた AI により、クライアントサイドで言語を判定するための提案です。この API を利用することで、テキストの言語を判定することが可能になります。"
createdAt: "2024-10-14T16:58+09:00"
updatedAt: "2024-10-14T16:58+09:00"
tags: ["JavaScript", "Chrome", "AI"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4HU2SvM3QCahNp1DeKtSdG/211aa4dde7f5ca4499f879c6c687d6d8/halloween-lanthanum-ghost_20763-768x729.png"
  title: "ハロウィンのランタンを持ったおばけのイラスト"
selfAssessment:
  quizzes:
    - question: "Language Detection API が利用可能かどうかを確認するためにはどの関数を呼び出すか？"
      answers:
        - text: "translation.canDetect()"
          correct: true
          explanation: null
        - text: "translation.isAvailable()"
          correct: false
          explanation: null
        - text: "ai.canDetect()"
          correct: false
          explanation: null
        - text: "ai.isAvailable()"
          correct: false
          explanation: null
published: true
---
!>　Language Detection API は標準化されていない提案です。2024 年 10 月 14 現在、Chrome Canary v129 以降で利用可能です。

ある言語を別の言語に翻訳する際には、まず元の言語を特定する必要があります。言語を特定するためにサーバーサイドに問い合わせる必要がありましたが、Language Detection API を利用することで Chrome に組み込まれた AI により、クライアントサイドで言語を判定することが可能になります。

Language Detection API は [Translation API](https://github.com/WICG/translation-api) の一部として提案されており、将来文章の翻訳のためにも利用されることが期待されています。

## Language Detection API が利用可能かどうかを確認する

Language Detection API を利用する場合、ユーザーのブラウザに AI モデルがダウンロードされている必要があります。モデルがダウンロードされていない状態で API を呼び出すと、モデルのダウンロードが開始されます。

モデルが使用可能かどうか判定する場合には、`translation.canDetect()` 関数を呼び出します。`translation.canDetect()` 関数は以下のいずれかの値を返します。

- `"readily"`：モデルがダウンロードされており、利用可能
- `"after-download"`：モデルがダウンロードされた後に利用可能
- `"no"`: デバイスに空き容量がないなどの理由で、モデルがダウンロードできず利用できない

以下のコード例では、`translation.canDetect()` 関数を呼び出して、モデルがダウンロードされているかどうかを確認しています。`"readily"` が返された場合には、`translation.detect()` 関数を呼び出して言語を判定します。`"after-download"` が返された場合には、モデルのダウンロードが完了するまで待機します。モデルのダウンロード状況は `downloadprogress` イベントで確認できます。

```js
async function getDetector() {
  const canDetect = await translation.canDetect();
  if (canDetect === "no") {
    throw new Error("モデルがダウンロードできません");
  }
  if (canDetect === "readily") {
    return await translation.createDetector();
  } else if (canDetect === "after-download") {
    const detector = await translation.createDetector();
    detector.addEventListener("downloadprogress", (event) => {
      console.log(event.loaded, event.total);
    });
    // モデルのダウンロードが完了するまで待機
    await detector.ready;
    return detector;
  }
}
```

## テキストの言語を判定する

`translation.createDetector();` で `detector` オブジェクトを取得した後に、`detector.detect()` 関数を呼び出すことで、テキストの言語を判定できます。

言語の判定の結果は配列となっており、検出された言語とその確信度を含んだオブジェクトとなっています。

```js
const detector = await translation.createDetector();
const results = await detector.detect("Hello, world!");

for (const { detectedLanguage, confidence } of results) {
  console.log(detectedLanguage, confidence);
  // en, 0.9950907230377197
  // pl, 0.00041951832827180624
  // sv, 0.00025001977337524295
  // ..
}
```

## まとめ

- Language Detection API を利用することで、ブラウザに組み込まれた AI によりクライアントサイドで言語を判定することが可能になる
- `translation.canDetect()` 関数でモデルがダウンロードされているかどうかを確認し、`translation.createDetector()` 関数で `detector` オブジェクトを取得する
- `detector.detect()` 関数でテキストの言語を判定する。結果は検出された言語とその確信度を含んだオブジェクトの配列となる

## 参考

- [Language detection in Chrome with built-in AI  |  AI on Chrome  |  Chrome for Developers](https://developer.chrome.com/docs/ai/language-detection)
- [Explainer for the Translator and Language Detector APIs](https://github.com/WICG/translation-api/blob/main/README.md)
