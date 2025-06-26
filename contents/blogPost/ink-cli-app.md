---
id: zsZ7ZzFHhMA-WlErG7bHP
title: "Ink を使って CLI アプリを React で書く"
slug: "ink-cli-app"
about: "Ink は CLI アプリを React で書くためのライブラリです。Flexbox レイアウトエンジンである Yoga を使用しているため、Web アプリケーションと同じような CSS を使って UI を構築できることが特徴です。Codex や Claude Code といったコーディングエージェントの CLI アプリが Ink で書かれています。"
createdAt: "2025-04-20T09:45+09:00"
updatedAt: "2025-04-20T09:45+09:00"
tags: ["ink", "React"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/nFYiC8aOUEafnSacY44tf/4dfe30cb65a0aec692a9b618a2cb12b1/maccha-cutcake_21696-768x709.png"
  title: "抹茶ケーキのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "ユーザーからの入力を受け取るための Ink コンポーネントライブラリは何ですか？"
      answers:
        - text: "ink-text-input"
          correct: true
          explanation: "ink-text-input はユーザーからの入力を受け取るための Ink コンポーネントライブラリです。ブラウザの input 要素のように onChange イベントを受け取ることができます。"
        - text: "ink-form"
          correct: false
          explanation: null
        - text: "ink-input"
          correct: false
          explanation: null
        - text: "ink-user-input"
          correct: false
          explanation: null
published: true
---
[Ink](https://github.com/vadimdemedes/ink?tab=readme-ov-file) は CLI アプリを React で書くためのライブラリです。Flexbox レイアウトエンジンである [Yoga](https://arc.net/l/quote/yqignmph) を使用しているため、Web アプリケーションと同じような CSS を使って UI を構築できることが特徴です。[Codex](https://github.com/openai/codex) や [Claude Code](https://github.com/anthropics/claude-code) といったコーディングエージェントの CLI アプリが Ink で書かれています。

## プロジェクトを作成する

以下のコマンドで Node.js のプロジェクトを作成します。

```bash
mkdir ink-cli-app
cd ink-cli-app
npm init -y
```

`package.json` の `type` を `module` に変更します。これにより、JavaScript ファイルがデフォルトで ES モジュールとして扱われるようになります。

```json:package.json
{
  "type": "module"
}
```

必要なパッケージをインストールします。

```bash
npm install ink react
npm install --save-dev typescript @types/react tsx @types/node
```

`src/cli.tsx` というファイルを作成して、最初の Ink アプリを作成しましょう。単にテキストで「Hello, world!」と表示するだけのアプリです。文字を描画する場合必ず `<Text>` コンポーネントを使用する必要があります。

Ink の `render()` 関数を使用して、ターミナル上に React コンポーネントをレンダリングします。

```tsx:src/cli.tsx
import React from "react";
import { render, Text } from "ink";

const App = () => {
  return <Text color="green">Hello, world!</Text>;
};

render(<App />);
```

`package.json` に以下のようにアプリケーションを実行するためのスクリプトを追加します。

```json:package.json
{
  "scripts": {
    "dev": "tsx src/cli.tsx",
    "build": "tsc src/cli.tsx --outDir dist",
    "start": "node dist/cli.js" 
  }
}
```

`dev` スクリプトは開発用のスクリプトで、`tsx` を使って TypeScript ファイルを直接実行します。`npm run dev` でアプリケーションを実行できます。

```bash
npm run dev
```

以下のように、緑色の文字で「Hello, world!」と表示されるはずです。

![](https://images.ctfassets.net/in6v9lxmm5c8/7M3r1DeWGQqSk6hxUnxTzD/aa48e9d71079e4265fcf4cdd1e156cff/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-04-20_10.30.47.png)

`useState` や `useEffect` などの React の基本的なフックを使うことができます。1 秒ごと現在時刻を表示するアプリを作成してみましょう。

```tsx:src/cli.tsx
import React, { useEffect, useState } from "react";
import { render, Text } from "ink";

const App = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <Text color="green">{time.toLocaleTimeString()}</Text>;
};

render(<App />);
```

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/7mQfCmrq6YBAxMk2F5ng2M/27d37b309fe44fda618fcae91c383a7d/%E7%94%BB%E9%9D%A2%E5%8F%8E%E9%8C%B2_2025-04-20_10.43.31.mov" controls></video>

## AI とチャットするアプリケーションを作成する

基本的な Ink の使い方がわかったところで、より実用的なアプリケーションを作成してみましょう。AI とチャットするアプリケーションを作成します。生成 AI モデルを呼び出すための SDK として [Vercel AI SDK](https://sdk.vercel.ai/docs/introduction) を使用します。Vercel AI SDK は AI モデルごとに差異を抽象化しているため、後から簡単に異なるモデルに切り替えることができます。必要なパッケージをインストールします。

```bash
npm install ai @ai-sdk/google
```

この記事では Google が提供する Gemini を使用するため、対応するパッケージである `@ai-sdk/google` をインストールします。その他の AI モデルを使用したい場合には [AI SDK Providers](https://sdk.vercel.ai/providers/ai-sdk-providers)  を参考に対応するモデルのパッケージをインストールしてください。

LLM を利用するには API キーが必要です。今回は Google Gemini を使用するため、[Google AI Studio](https://aistudio.google.com/app/apikey?hl=ja) で API キーを取得します。選択するモデルによっては料金が発生する場合があるため、ご注意ください。

取得した API キーは、以下のように環境変数 `GOOGLE_GENERATIVE_AI_API_KEY` として設定します。

```bash
export GOOGLE_GENERATIVE_AI_API_KEY=your_api_key
```

次に、`src/cli.tsx` を以下のように変更します。

```tsx:src/cli.tsx
import React, { useEffect, useState } from "react";
import { Box, render, Text } from "ink";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";

const App = () => {
  const [response, setResponse] = useState("");
  const prompt = "箱根のおすすめの観光地を教えてください。";
  useEffect(() => {
    const generateResponse = async () => {
      // streamText 関数はテキスト生成をストリーミングで返す
      const res = streamText({
        // モデルを指定する
        // ここでは Google Gemini の最新モデルを指定
        model: google("gemini-2.5-pro-exp-03-25"),
        // 一旦プロンプトのメッセージを固定で指定する
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      // ストリーミングされたテキストをチャンクごとに受け取る
      for await (const chunk of res.textStream) {
        setResponse((prev) => prev + chunk);
      }
    };
    generateResponse();
  }, []);

  return (
    <Box flexDirection="column">
      <Text color="green">user: {prompt}</Text>
      <Text color="blue">assistant:</Text>
      <Text color="white">{response}</Text>
    </Box>
  );
};
render(<App />);
```

まずは簡単に固定したプロンプトの使用して AI にテキスト生成を実行してみます。`streamText` 関数を使用して、ストリーミングでテキストを生成します。ストリーミングされたテキストは `for await` で受け取ることができるため、チャンクごとに受け取って表示できます。

`<Box>` コンポーネントは Flexbox レイアウトを使用して、子要素を縦に並べるために使用します。`flexDirection` プロパティを `column` に設定することで、子要素を縦に並べることができます。

`npm run dev` でアプリケーションを実行すると、以下のように AI が生成したテキストが表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/41RL0hvf1Kgd1PwSM888I6/85a0680fc7eccde8bb18982ef56831dc/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-04-20_12.12.52.png)

### ローディングスピナーを表示する

AI が生成したテキストの表示はできましたが、AI の応答を待っている間は何も表示されないため、ユーザーにとってはわかりづらいです。そこで、AI の応答を待っている間はローディングスピナーを表示するようにします。

`ink-spinner` パッケージをインストールします。`ink-spinner` の `<Spinner>` コンポーネントを使用して、ローディングスピナーを表示します。

```bash
npm install ink-spinner
```

`loading` という状態を追加して、AI の応答を待っている間はローディングスピナーを表示するようにします。

```tsx:src/cli.tsx {5, 10, 26-27, 38-42}
import React, { useEffect, useState } from "react";
import { Box, render, Text } from "ink";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import Spinner from "ink-spinner";

const App = () => {
  const [response, setResponse] = useState("");
  const prompt = "箱根のおすすめの観光地を教えてください。";
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const generateResponse = async () => {
      setLoading(true);
      const res = streamText({
        model: google("gemini-2.5-pro-exp-03-25"),
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      for await (const chunk of res.textStream) {
        // はじめのレスポンスが返ってきたら loadingをfalseにする
        setLoading(false);
        setResponse((prev) => prev + chunk);
      }
    };
    generateResponse();
  }, []);

  return (
    <Box flexDirection="column">
      <Text color="green">user: {prompt}</Text>
      <Text color="blue">assistant:</Text>
      {loading && (
        <Text color="yellow">
          <Spinner type="dots" /> Loading...
        </Text>
      )}
      <Text color="white">{response}</Text>
    </Box>
  );
};
render(<App />);
```

この変更により、ローディングスピナーが表示されるようになります。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/6fzNb1mKucH35v2PHV0pyw/a7309b31b3c5fbf5954ec9176ec6763c/%E7%94%BB%E9%9D%A2%E5%8F%8E%E9%8C%B2_2025-04-20_12.24.57.mov" controls></video>

### ユーザーの入力を受け取る

現状ではただ固定されたプロンプトを使用した回答を生成するだけのアプリケーションなので退屈です。ユーザーからの入力を受け取る機能を追加して、AI と自由に会話できるようにしましょう。

ユーザーの入力を受け取るために `ink-text-input` パッケージをインストールします。ブラウザの `<input>` 要素のように `onChange` イベントを受け取ることができるコンポーネントです。

```bash
npm install ink-text-input
```

`ink-text-input` を使用して、ユーザーの入力を受け取るようにします。ユーザーの入力を受け取るための状態 `userInput` を追加し、`onChange` イベントで更新します。ユーザーが Enter キーを押したときに `onSubmit` が呼び出されるので、そのタイミングで AI にプロンプトを渡して応答を生成するようにします。

プロンプトは `messages` の配列に `role: "user"` として追加します。AI の応答が完了したら応答の全文を `role: "assistant"` として追加します。これにより、AI は過去の会話をコンテキストとして保持して応答を生成できます。

`messages` の配列を会話の履歴として表示するように変更します。

```tsx:src/cli.tsx {4, 6, 10-12, 14-23, 25-42, 45-70}
import React, { useEffect, useState } from "react";
import { Box, render, Text } from "ink";
import { google } from "@ai-sdk/google";
import { CoreMessage, streamText } from "ai";
import Spinner from "ink-spinner";
import TextInput from "ink-text-input";

const App = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (input.trim() === "") return;
    setInput("");
    const res = await generateResponse(input);
    setMessages((prev) => [
      ...prev,
      { role: "user", content: input },
      { role: "assistant", content: res },
    ]);
  };

  const generateResponse = async (prompt: string): Promise<string> => {
    setLoading(true);
    const res = streamText({
      model: google("gemini-2.5-pro-exp-03-25"),
      messages: [...messages, { role: "user", content: prompt }],
    });

    let fullResponse = "";
    for await (const chunk of res.textStream) {
      setLoading(false);
      setResponse((prev) => prev + chunk);
      fullResponse += chunk;
    }
    setResponse("");

    return fullResponse;
  };

  return (
    <Box flexDirection="column">
      {messages.map((message, index) => (
        <Text key={index} color={message.role === "user" ? "green" : "white"}>
          {message.role}:{" "}
          {typeof message.content === "string" ? message.content : ""}
        </Text>
      ))}
      {loading && (
        <Text color="yellow">
          <Spinner type="dots" /> Loading...
        </Text>
      )}
      <Text color="white">{response}</Text>

      <Box marginRight={1} borderColor="gray" borderStyle="round">
        <Text color="white">{">"} </Text>
        <TextInput
          value={input}
          onChange={(input) => {
            setInput(input);
          }}
          onSubmit={() => handleSubmit()}
          placeholder="Type your message here..."
        />
      </Box>
    </Box>
  );
};
render(<App />);
```

この変更により、テキストを入力できるようになったことが確認できます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/8JmUsbgRWFtSdEmNPuTDG/b4c5eeb01127bcfcfb6eccc1742d0182/%E7%94%BB%E9%9D%A2%E5%8F%8E%E9%8C%B2_2025-04-20_17.46.45.mov" controls></video>

### AI の口調を変更できるようにする

生成 AI はシステムプロンプトによって様々な口調で応答させることができる点が面白いところです。例えば、カジュアルな口調やフォーマルな口調、特定のキャラクターの口調など、様々なスタイルで応答させることができます。ユーザーが `/tone` コマンドを入力したときに、口調を変更する選択肢を表示するようにしましょう。

ターミナルに選択肢を表示するために、`ink-select-input` パッケージをインストールします。

```bash
npm install ink-select-input
```

まずは口調の一覧を配列で定義します。`label` と `value` は SelectInput に渡すためのものです。

```tsx:src/cli.tsx
const tones = [
  { label: "default", value: "default", prompt: "" },
  { label: "friendly", value: "friendly", prompt: "あなたはユーザーと近しい友人です。フレンドリーな口調で話します。" },
  { label: "business", value: "business", prompt: "あなたは有能なコンサルタントです。。ビジネスライクな口調で話します。" },
  { label: "pirate", value: "pirate", prompt: "あなたは愉快な海賊です。荒っぽく陽気な口調で話します" }
]
```

`selectingTone` という状態を追加して、この状態が `true` のときに口調の選択肢を表示するようにします。ユーザーが `/tone` コマンドを入力したときに `selectingTone` を `true` にして、口調の選択肢を表示します。

`handleSubmit` 関数を修正して、ユーザーが `/tone` コマンドを入力したときに `selectingTone` を `true` にして即座に `return` します。

`handleSelectTone` 関数を追加して、ユーザーが選択した口調を `selectedTone` に保存します。選択肢を選んだら、`selectingTone` を `false` にして、AI のプロンプトに選択した口調を追加します。

```tsx:src/cli.tsx
import SelectInput from "ink-select-input";

const App = () => {
  const [selectingTone, setSelectingTone] = useState(false);
  const [selectedTone, setSelectedTone] = useState(tones[0]);

  const handleSubmit = async () => {
    if (input.trim() === "") return;
    setInput("");

    if (input === "/tone") {
      setSelectingTone(true);
      return;
    }

    const res = await generateResponse(input);
    setMessages((prev) => [
      ...prev,
      { role: "user", content: input },
      { role: "assistant", content: res },
    ]);
  };

  // ...

  type SelectItem = {
    label: string;
    value: string;
  };
  const handleSelectTone = (item: SelectItem) => {
    const selected = tones.find((tone) => tone.value === item.value);
    if (!selected) return;

    setSelectedTone(selected);
    setSelectingTone(false);
  };

  if (selectingTone) {
    return (
      <Box flexDirection="column">
        <Text>Select AI Tone:</Text>
        <SelectInput items={tones} onSelect={handleSelectTone} />
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      { ... }
    </Box>
  )
}
```

選択肢の一覧は以下のように表示されます。矢印キーで選択肢を移動し、Enter キーで選択できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/21sQJbw6yFXdaTKcxSJmBg/3bf475caf5fae33c78cb44f4b9d489ed/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-04-20_17.39.30.png)

最後に `generateResponse` 関数を修正して、選択した口調を `role: "system"` としてプロンプトに追加します。

```tsx:src/cli.tsx
 const generateResponse = async (prompt: string): Promise<string> => {
    setLoading(true);

    const systemMessage: CoreMessage | null = selectedTone.systemPrompt
      ? { role: "system", content: selectedTone.systemPrompt }
      : null;

    const messagesToSend: CoreMessage[] = systemMessage
      ? [systemMessage, ...messages, { role: "user", content: prompt }]
      : [...messages, { role: "user", content: prompt }];

    const res = streamText({
      model: google("gemini-2.5-pro-exp-03-25"),
      messages: messagesToSend,
    });

    let fullResponse = "";
    for await (const chunk of res.textStream) {
      setLoading(false);
      setResponse((prev) => prev + chunk);
      fullResponse += chunk;
    }
    return fullResponse;
  };
```

口調を `pirate` にした場合、以下のように AI が海賊の口調で応答します。

![](https://images.ctfassets.net/in6v9lxmm5c8/6cl2A9EUxs5QTg38QnRU1r/dea09d085b4efd2ab9588a72c0259b91/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-04-20_17.41.50.png)

## まとめ

- Ink は CLI アプリを React で書くためのライブラリ。Flexbox レイアウトエンジンである Yoga を使用しているため、Web アプリケーションと同じような CSS を使って UI を構築できる
- Ink の `render()` 関数を使用して、ターミナル上に React コンポーネントをレンダリングする
- テキストを表示する場合は `<Text>` コンポーネントを使用する
- `<Box>` コンポーネントは Flexbox レイアウトを使用して、子要素を並べることができる
- `useState` や `useEffect` などの React の基本的なフックを使うことができる
- `ink-spinner` を使用してローディングスピナーを表示することができる
- `ink-text-input` を使用してユーザーの入力を受け取ることができる

## 参考

- [vadimdemedes/ink: 🌈 React for interactive command-line apps](https://github.com/vadimdemedes/ink?tab=readme-ov-file#useinputinputhandler-options)
