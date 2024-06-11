---
id: k9tkO8wYTrvRkF3BOP5q9
title: "Chrome の 組み込み AI Gemini Nano を試してみる"
slug: "try-chrome-internal-ai-gemini-nano"
about: "Chrome 126 から Gemini Nano という AI がデスクトップクライアントに組み込まれる予定です。Gemini Nano は Google の AI モデルの中で最も小さいモデルです。デスクトップクライアントに直接組み込まれることで、ユーザーの手元の環境で AI を利用できることが特徴です。開発者は JavaScript から Chrome に組み込まれた Gemini Nano にアクセスして生成 AI の機能を実装することができます。"
createdAt: "2024-06-11T19:19+09:00"
updatedAt: "2024-06-11T19:19+09:00"
tags: ["JavaScript", "Chrome", "AI"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1l2sqXdm4Hrfmzo7c57px2/1f3ea88590d92e50838343c17fe50545/electric-guitar_monochrome_8878.png"
  title: "白黒のエレキギターのイラスト"
selfAssessment:
  quizzes:
    - question: "Gemini Nano が利用可能かどうかを確認する方法はどれか？"
      answers:
        - text: "window.gemini.canCreateTextSession() の戻り値を確認する"
          correct: false
          explanation: null
        - text: "window.ai.canCreateTextSession() の戻り値を確認する"
          correct: true
          explanation: null
        - text: "window.gemini.createTextSession() が例外をスローするか確認する"
          correct: false
          explanation: null
        - text: "window.ai.createTextSession() が例外をスローするか確認する"
          correct: false
          explanation: null
published: true
---
Chrome 126 から Gemini Nano という AI がデスクトップクライアントに組み込まれる予定です。Gemini Nano は Google の AI モデルの中で最も小さいモデルです。デスクトップクライアントに直接組み込まれることで、ユーザーの手元の環境で AI を利用できることが特徴です。

開発者は JavaScript から Chrome に組み込まれた Gemini Nano にアクセスして生成 AI の機能を実装することができます。

## Gemini Nano を有効にする

2024 年 6 月 11 日時点では、Chrome の dev chanel で Gemini Nano を有効にすることができます。以下のリンクから Chrome の dev chanel をダウンロードしてください。

https://www.google.com/intl/ja/chrome/dev/

インストールが完了したらアドレスバーに `chrome://flags` と入力して設定画面を開きます。以下の 2 つのフラグを設定します。

- Enables optimization guide on device: Enabled BypassPerfRequirement
- Prompt API for Gemini Nano: Enabled

![](https://images.ctfassets.net/in6v9lxmm5c8/1XmoKJPwpK6ynXLnDYNzzW/ebbba17f86bf6cce5ad28d763faa138b/__________2024-06-11_19.28.20.png)

また、あらかじめ Gemini Nano のモデルをダウンロードしておく必要があります。アドレスバーに `chrome://components/` と入力して `Optimization Guide On Device Model` の「アップデートを確認」をクリックします。

![](https://images.ctfassets.net/in6v9lxmm5c8/3OIAqEyD6Ez0fIFT30kkwR/0cf5f18268f9867b739aec3d9a8eb8eb/__________2024-06-10_19.14.21.png)

## Gemini Nano を使ってみる

それでは、Gemini Nano を使ってみましょう。以下のコードをコンソールに貼り付けて実行します。

```js
const canCreate = await window.ai.canCreateTextSession();

// canCreate は 以下のいずれかの値を取る
// - "readily"：モデルがダウンロードされており、利用可能
// - "after-download"：モデルがダウンロードされていないが、デバイスに能力があるのでダウンロードプロセスを実行後に利用可能
// - "no"：モデルがダウンロードされていないため、利用できない
if (canCreate === "no") {
  console.log("Gemini Nano は利用できません");
} else {
  const session = await window.ai.createTextSession();

  const result = await session.prompt("父の日に何をプレゼントしようかな？");

  console.log(result);
}
```

Gemni Nano の機能には `window.ai` オブジェクトからアクセスできます。`window.ai` のインターフェースは以下のようになっています。

- `canCreateTextSession(): Promise<"readily" | "after-download" | "no">`：モデルが利用可能かどうかの値を返す
- `canCreateTextSession(): Promise<"readily" | "after-download" | "no">`：`canCreateTextSession` と同じ
- `createTextSession(): Promise<AITextSession>`：プロンプトを実行するオブジェクトを生成する
- `createGenericSession(): Promise<AITextSession>`：`createTextSession` と同じ
- `defaultTextSessionOptions(): Promise<{temperature: number, topK: number}>`：モデルのパラメータを返す
- `defaultGenericSessionOptions(): Promise<{temperature: number, topK: number}>`：`defaultTextSessionOptions` と同じ

`window.ai.createTextSession()` を実行すると `AITextSession` オブジェクトが返されます。`AITextSession` オブジェクトの `prompt()` メソッドをの引数にプロンプトを渡すことで、AI による回答を取得できます。

`AITextSession` オブジェクトのインターフェースは以下のようになっています。

- `prompt(text: string): Promise<string>`：プロンプトを渡し、AI による回答を取得する
- `promptStreaming(text: string): AsyncIterable<string>`：結果全体を待つのではなく、ストリーミング形式で結果を取得する
- `execute(text: string): Promise<string>`：`prompt` と同じ
- `executeStreaming(text: string): AsyncIterable<string>`：`promptStreaming` と同じ
- `destroy(): void`：セッションを破棄する？

コードを実行すると、以下のように結果が表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/4brWLjVzVwgDAGvbrGpBi9/ce73aa1d3b26644cfea85ee13b63b83e/__________2024-06-11_19.41.56.png)

やはりより高性能なモデルと比べると精度は低いものの、クライアントに直接組み込まれているため結果を返すのが早い、ユーザーのデータを送信する必要がない、API の利用制限がないといった点が利点であると言えるでしょう。

## より実践的な例

より実践的な例として、簡単なチャットボットを実装してみましょう。 React を使って以下のようなコードを書くことができます。

```jsx
import { useState, useEffect } from "react";
import "./App.css";

// メッセージの型
// role: user はユーザーが入力したメッセージ、robot は AI が返したメッセージ
type Message = {
  role: "user" | "robot";
  content: string;
};

function App() {
  // チャットの履歴を保持しておく
  const [messages, setMessages] = useState<Message[]>([]);
  // input に入力された内容
  const [content, setContent] = useState<string>("");
  // AI が利用可能かどうか
  const [enableAi, setEnableAi] = useState<boolean>(false);

  useEffect(() => {
    // canCreate が "no" でない場合は AI が利用可能
    const checkAi = async () => {
      const canCreate = await window.ai.canCreateTextSession();
      setEnableAi(canCreate !== "no");
    };
    checkAi();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() === "") return;
    setContent("");

    // ユーザーのメッセージを追加
    setMessages((prev) => [...prev, { role: "user", content: content.trim() }]);

    // AI による回答を取得
    const session = await window.ai.createTextSession();
    // プロンプトに過去のメッセージの履歴を渡すことで、記憶を保持しているかのように振る舞わせる
    // session.promptStreaming はストリーミング形式で結果を取得する
    const response =
      session.promptStreaming(`以下のやり取りに続いて回答してください。
${messages.map((message) => `${message.role}: ${message.content}`).join("\n")}
user: ${content.trim()}
robot: `);
    setMessages((prev) => [...prev, { role: "robot", content: "..." }]);
    // for await を使って徐々に結果を表示
    for await (const chunk of response) {
      setMessages((prev) => [
        ...prev.slice(0, prev.length - 1),
        { role: "robot", content: chunk },
      ]);
    }
    // セッションを破棄
    session.destroy();
  };

  return (
    <div>
      <h1>Chatbot</h1>

      {enableAi ? (
        <>
          <div className="chat">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.role}`}>
                {message.content}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="form">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type a message..."
            />
            <button type="submit">Send</button>
          </form>
        </>
      ) : (
        <p>AI は利用できません</p>
      )}
    </div>
  );
}

export default App;
```

以下のようにチャットでやり取りできていることが確認できます。

## まとめ

- Chrome 126 から Gemini Nano がデスクトップクライアントに組み込まれる予定
- 開発者は JavaScript から Chrome に組み込まれた Gemini Nano にアクセスして生成 AI の機能を実装することができる
- `window.ai` オブジェクトから AI の機能にアクセスできる
- `window.ai.canCreateTextSession()` でモデルが利用可能かどうかを確認できる
- `window.ai.createTextSession()` で `AITextSession` オブジェクトを生成し、`prompt()` メソッドで AI による回答を取得できる
- `promptStreaming()` メソッドを使うことですべての結果の完了を待たずに、ストリーミング形式で結果を取得できる

## 参考

- [Chrome内蔵LLM Gemini Nanoを使ってみた](https://zenn.dev/the_exile/articles/chrome-gemini-nano)
- [a7ec44eae33ad12694ae80e2444949339d807642 - chromium/src - Git at Google](https://chromium.googlesource.com/chromium/src/+/a7ec44eae33ad12694ae80e2444949339d807642)
