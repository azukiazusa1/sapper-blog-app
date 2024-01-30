---
id: MOuhCgktqU-hgBOtk63X0
title: "Hono で Server Send Event によるストリーミングを実装する"
slug: "hono-streaming-response"
about: "Serve Send Event（SSE）は、サーバーからクライアントに向けてイベントをストリーミングするための仕組みです。WebSocket と比較すると、サーバーからの単方向の通信、HTTP で通信するという特徴があります。この記事では Hono を使って OpenAI API を使ったテキスト生成をストリーミングする方法を紹介します。"
createdAt: "2024-02-01T20:43+09:00"
updatedAt: "2024-02-01T20:43+09:00"
tags: ["Hono", "OpenAI", "JavaScript"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3KIAnqvoojslYIa5b1babv/2a1a5729b81bde5fb21422c1f7a00be7/pellet-stove_illust_1774.png"
  title: "ストーブのイラスト"
published: true
---

[Serve Send Event（SSE）](https://developer.mozilla.org/ja/docs/Web/API/Server-sent_events) は、サーバーからクライアントに向けてイベントをストリーミングするための仕組みです。WebSocket と比較すると、クライアントからサーバーへの送信は行わないサーバーからの単方向の通信になるという特徴があります。また HTTP で通信するため、WebSocket のように専用のポートを開ける必要がなく、HTTP で通信できる環境であれば利用できます。

SSE が使われる例として、生成 AI によるチャットサービスがあげられます。Chat GPT のようなサービスを利用したことがあるならば、テキストが徐々に表示されていく様子を見たことがあるかもしれません。

AI によるメッセージの生成が最後まで完了するまでに時間がかかります。生成が完了した箇所から順にユーザーに表示することで、ユーザーへのフィードバックが早くなるため、UX の向上につながります。

この記事では [Hono](https://hono.dev/) を使って SSE を実装する方法を紹介します。

## Hono による SSE の実装

Hono は v3.7.0 から SSE をサポートしています。まずは以下のコマンドで Hono のプロジェクトを作成します。

```sh
npm create hono@latest hono-app
```

`src/index.ts` に以下のコードを追加します。`hono/streaming` より import した[steamText()](https://hono.dev/helpers/streaming#streamtext) 関数を使って、テキストをストリーミングができます。

```ts:src/index.ts
import { Hono } from "hono";
import { streamText } from "hono/streaming";

const app = new Hono();

app.get("/streamText", (c) => {
  return streamText(c, async (stream) => {
    // Write a text with a new line ('\n').
    await stream.writeln("Hello");
    // Wait 1 second.
    await stream.sleep(1000);
    // Write a text without a new line.
    await stream.write(`Hono!`);
  });
});
```

`curl` コマンドでリクエストを送ると、以下のようにレスポンスが返ってきます。

```sh
$ curl http://localhost:3000/streamText
Hello
Hono!
```

最初に `Hello` というテキストが返ってきた後、1 秒待ってから `Hono!` というテキストが返ってくることがわかります。

## OpenAI のレスポンスをストリーミングする

ただテキストをストリーミングして返すだけでは面白くないので、OpenAI の API を使ってテキストを生成してストリーミングして返し、チャットサービスの UI 上に表示してみることにします。

### OpenAI API の準備

OpenAI API を使うためには、OpenAI のアカウントが必要です。アカウントを作成したら、[API Keys](https://beta.openai.com/account/api-keys) から API キーを取得します。

x> 取得した API キーは外部に漏れないように注意してください。また、OpenAI API の利用にはクレジットカードの登録が必要であり、課金が発生することに十分注意してください。

取得した API キーを環境変数に設定します。

```sh
export OPENAI_API_KEY=sk-...
```

### OpenAI API を使ったテキスト生成

OpenAI API を使ってテキストを生成するには、Node.js 用の [openai](https://github.com/openai/openai-node) ライブラリを使うのが便利です。

```sh
$ npm install openai
```

`src/chat.ts` というファイルを作成して以下のコードを書いてみましょう。

```ts:src/chat.ts
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// コマンドライン引数からメッセージを取得
const message = process.argv[2];

const main = async () => {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "user", content: "Say this is a test" }],
    model: "gpt-3.5-turbo",
  });

  console.log(chatCompletion.choices[0].message);
};

main();
```

まずは `new OpenAI()` で OpenAI クライアントを作成します。`apiKey` には環境変数から取得した API キーを渡します。AI によるテキスト生成は `openai.chat.completions.create()` で行います。`messages` にはプロンプトを配列で渡します。

`role` とは誰が発言したかを表すもので、`user` はユーザーからの発言です。`user` の他にも `role` には `system` や `assistant` などを指定できます。

`role` に `system` を渡すと AI アシスタントの人格を指定できます。例えば文章の添削を依頼したい場合にはプロの編集者としての人格を指定することで、より適切な文章を生成してくれる可能性があります。

生成されたテキストは `chatCompletion.choices[0].message` に格納されています。実際に実行してみましょう。

```sh
npx ts-node src/chat.ts "こんにちは、お元気ですか？"

{ role: 'assistant', content: 'はい、元気です。お返事ありがとうございます。お元気ですか？' }
```

実行した結果は一度に返ってきます。今回は SSE を利用してテキストを徐々に生成して返すようにしたいので、OpenAI の API からのレスポンスをストリーミングして返すようにします。

ストリーミングして返すようにするには `streaming: true` オプションを指定する方法と、`openai.beta.chat.completions.stream()` メソッドを使う方法があります。後者の方法では、Streaming のイベントハンドラや、チャットが完了された時に返される Promise が使えます。

https://github.com/openai/openai-node/blob/master/helpers.md#events

前者の方法ではストリーム内のチャンクの非同期イテラブルのみを返すので、使用するメモリが少なくなるという利点があります。

今回は `openai.beta.chat.completions.stream()` メソッドを使って実装してみます。

```ts:src/chat.ts
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// コマンドライン引数からメッセージを取得
const message = process.argv[2];

const main = async () => {
  const chatStream = openai.beta.chat.completions.stream({
    messages: [{ role: "user", content: message }],
    model: "gpt-3.5-turbo",
    stream: true,
  });

  for await (const message of chatStream) {
    console.log(message.choices[0].delta.content);
  }

  // チャットが完了した
  const chatCompletion = await chatStream.finalChatCompletion();
  console.log(chatCompletion.choices[0].message);
};

main();
```

前回のコードとは異なり、レスポンスを [for await...of](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/for-await...of) でイテレートしています。OpenAI の API よりレスポンスが返されるたびに `for` ループが回り、生成された文章がコンソールに出力されます。

API からのレスポンスが完了した場合には `chatStream.finalChatCompletion()` が呼ばれます。このメソッド `openai.beta.chat.completions.stream()` を使わなければ使用できないメソッドです。

それでは実行してみましょう。文章が徐々に生成されていく様子がわかります。

```sh
$ npx ts-node src/chat.ts "鎌倉幕府はなぜ滅びたのか？"

鎌
倉
幕
府
が
滅
び
た
理
# 以下省略
```

### Hono で OpenAI API を使ったテキスト生成をストリーミングする

それでは先ほど作成した OpenAI API を使ったテキスト生成を Hono で実装してみましょう。`src/index.ts` を以下のように書き換えます。

```ts:src/index.ts
import { Hono } from "hono";
import { streamText } from "hono/streaming";
import OpenAi from "openai";

const app = new Hono();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (c) => {
  const body = await c.req.json<{ message: string }>();
  return streamText(c, async (stream) => {
    const chatStream = openai.beta.chat.completions.stream({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: body.message }],
      stream: true,
    });

    for await (const message of chatStream) {
      await stream.write(message.choices[0].delta.content || "");
    }

    await chatStream.finalChatCompletion();

    stream.close();
  });
});
```

ユーザーの入力はボディリクエストとして `c.req.json<{ message: string }>()` で取得できます。`streamText()` 関数内で OpenAI API からのストリーミングレスポンスを受け取り、`stream.write()` でそのままレスポンスをストリーミングして返却しています。

`for await...of` 文を抜けてチャットが完了したことが確認できたら、`stream.end()` でストリーミングを終了します。

`curl` コマンドでリクエストを送ってみましょう。`-N` オプションを指定することでバッファリングをせずに、レスポンスを受け取った時点で出力するようになります。

```sh
curl -N -X POST -H "Content-Type: application/json" -d '{"message":"Hello, world!とはどういう意味ですか？"}' http://localhost:3000/chat
```

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/1wWXGVdx6LiqG2ZtcsYni2/07a2847c7f1c70e2eb3f60d0922f119c/_____2024-01-29_19.42.43.mov" controls></video>

### チャットサービスの UI を作成する

バックエンドの実装ができたので、チャットサービスの UI を作成してみましょう。React を使って実装します。

```sh
npm create vite@latest react-app -- --template react-ts
```

`src/App.tsx` を以下のように書き換えます。

```tsx:src/App.tsx
import { useState } from "react";
import "./App.css";

type Message = {
  role: "user" | "assistant";
  content: string;
};

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message === "") return;
    setIsGenerating(true);
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);
    setMessage("");

    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        setIsGenerating(false);
        return;
      }
      if (!value) continue;
      const lines = decoder.decode(value);
      const chunks = lines
        .split("data: ") // 各行は data: というキーワードで始まる
        .map((line) => line.trim())
        .filter((s) => s); // 余計な空行を取り除く
      for (const chunk of chunks) {
        setMessages((messages) => {
          const content = messages[messages.length - 1].content;
          return [
            ...messages.slice(0, -1),
            { role: "assistant", content: content + chunk },
          ];
        });
      }
    }
  };

  return (
    <div id="chat-container">
      <div className="messages-container">
        {messages.map((message, i) => {
          if (message.role === "user") {
            return (
              <div key={i} className="chat-message user-message">
                {message.content}
              </div>
            );
          }
          return (
            <div key={i} className="chat-message ai-message">
              {message.content}
            </div>
          );
        })}
      </div>
      <form id="input-area" onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button className="button" disabled={isGenerating} type="submit">
          {isGenerating ? "Generating..." : "Send"}
        </button>
      </form>
    </div>
  );
}

export default App;
```

`messages` はチャットの履歴を表す配列です。ユーザーがメッセージを送信したり、API からのレスポンスを受け取ったりするたびに、`messages` に新しいメッセージが追加し画面上に表示されます。

`handleSubmit` 関数内ではユーザーがメッセージを送信した時の処理を行っています。まずは `messages` にユーザーのメッセージを追加します。次に Fetch API を使って先ほど作成した Hono の `/chat` エンドポイントにリクエストを送ります。

レスポンスはストリーミングで返却されるので、`response.body?.getReader()` でレスポンスのストリームを取得します。そして無限ループ内で `{ done, value } = await reader.read()` でストリームからデータを読み込みます。`done` が `true` になったらストリーミングが完了したことを意味するので、ループを抜けます。

メッセージがレスポンスから返ってくるたびに `messages` の最後の要素（`role` が `assistant` のメッセージ）の `content` に追加していきます。これにより、画面上にメッセージが徐々に表示されていく様子を見ることができます。

Fetch API を使用した SSE の処理の方法は以下の記事を参考にさせていただきました。この記事では EventSource, Fetch API を使う際のそれぞれのデメリットについても触れられています。

https://zenn.dev/teramotodaiki/scraps/f016ed832d6f0d

ちなみに CSS は ChatGPT に生成してもらいました。ここでは省略しますが、以下のレポジトリのコードを参考にしてください。

https://github.com/azukiazusa1/ai-chat/blob/main/react-app/src/App.css

Hono のバックエンドのリクエストはクロスオリジンであるため、CORS を許可する必要があります。Hono のコードに以下のコードを追加してください。

```ts:src/index.ts {1, 5}
import { cors } from "hono/cors";

const app = new Hono();

app.use("*", cors());
```

それではここまでのコードを実行してみましょう。`npm run dev` でサーバーを起動します。

```sh
npm run dev
```

http://localhost:5173 にアクセスすると、チャットサービスの UI が表示されます。フォームにメッセージを入力して送信すると、ChatGPT のような感じでテキストが表示されるのがわかります。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/44OPtvmodutwUt5KnCOvFn/613673408589083718df3803a49ab6cd/_____2024-01-29_20.44.51.mov" controls></video>

### リクエストをキャンセルできるようにする

チャットサービスの UX のため、ユーザーが期待に沿わないテキストが生成された時点でレスポンスのストリーミングをキャンセルできることは重要です。さもなければ、長い時間ユーザーは待機しなければいけません。

まずはフロントエンド側からリクエストをキャンセルできるようにします。AI が文章を生成している時（`isGenerating` が `true` の時）にリクエストをキャンセルするボタンを追加します。

```tsx:src/App.tsx {23-30}
import { useState, useRef } from "react";

function App() {
  // ...

  const handleClickCancel = () => {
    // TODO: リクエストをキャンセルする
  };

  return (
    <div id="chat-container">
      { /* ... */ }
      <form id="input-area" onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button className="button" disabled={isGenerating} type="submit">
          {isGenerating ? "Generating..." : "Send"}
        </button>
        {isGenerating && (
          <button className="button" onClick={handleClickCancel}>
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}
```

キャンセルボタンを押した時にリクエストをキャンセルするには、Fetch API の [AbortController](https://developer.mozilla.org/ja/docs/Web/API/AbortController) を使います。`new AbortController()` でコントローラーを作成し、`signal` プロパティをリクエストのオプションに渡します。`AbortController` の `abort()` メソッドを呼ぶことで `signal` を渡したリクエストをキャンセルできます。

```tsx:src/App.tsx {1, 4-5, 12, 20, 27-29}
import { useState, useRef } from "react";

function App() {
  // useRef で AbortController を保持する
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ...

    abortControllerRef.current = new AbortController();

    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
      signal: abortControllerRef.current.signal,
    });

    // ...
  };

  const handleClickCancel = () => {
    // リクエストをキャンセル
    abortControllerRef.current?.abort();
    setIsGenerating(false);
  };
}
```

続いてバックエンド側で、クライアントからリクエストのキャンセルが要求された時に文章の生成をキャンセルするようにします。`stream.onAbort()` メソッドはリクエストがキャンセルされた際に呼び出されるコールバック関数を渡せます。

コールバック関数内で `chatStream.abort()` を呼ぶことで、OpenAI API からのレスポンスのストリーミングをキャンセルできます。

```ts:src/index.ts {10-16}
app.post("/chat", async (c) => {
  const body = await c.req.json<{ message: string }>();
  return streamText(c, async (stream) => {
    const chatStream = openai.beta.chat.completions.stream({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: body.message }],
      stream: true,
    });

    stream.onAbort(() => {
      chatStream.abort();
    });

    chatStream.on("abort", () => {
      console.log("abort");
    });

    for await (const message of chatStream) {
      await stream.write(message.choices[0].delta.content || "");
    }

    stream.close();
  });
});
```

ここまでの実装が完了したら実際に試してみましょう。確かに、キャンセルボタンを押すと AI による文章の生成がキャンセルされることがわかります。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/15RmLMQB2EqbAZCVcWy4dd/92a07979cbcd5b12c16b785f7106e4ed/_____2024-01-30_19.15.54.mov" controls></video>

### チャットの履歴に応じたテキストを生成する

最後に AI が生成する文章の精度を上げるための実装をしましょう。

現状の実装では、ユーザーが送信したメッセージのみをプロンプトとして OpenAI API に渡しています。これでは AI アシスタントは前後の会話の内容を知りえないので、チャットとしては不自然な文章を生成してしまう可能性があります。

下記の画像のメッセージのやり取りでは、ユーザーが「こんにちは、私の名前はジョンです」というメッセージを送信した後に「私の名前を覚えていますか？」というメッセージを送信しています。

チャットのようなサービスでは前後の文脈に応じた文章を生成してくれることが期待されますが、現状の実装では「私の名前を覚えていますか？」というメッセージのみをプロンプトとして渡しているため、「すみません、私は名前を覚える機能を持っていないため、あなたの名前を覚えているわけではありません。申し訳ありません。」という不自然な文章を生成してしまいます。

![](https://images.ctfassets.net/in6v9lxmm5c8/2Uv7eCOA7yKaDdQi8ocIyl/c4124b6f46bcc6753ee390d247c02f84/__________2024-01-29_21.52.19.png)

`openai` クライアントの `messages` の配列には、プロンプトとして渡したメッセージの他にも、過去の会話の内容を含めることができます。一般的に生成 AI は過去の会話の内容もプロンプトに含めることで、まるで前後の文脈を理解しているかのように振る舞うのです。

!> すべての会話の内容をプロンプトに含めると、いずれトークンの制限に引っかかってしまう可能性があります。この問題を解決するために、以前までの会話の内容を切り捨てたり、会話の内容を要約する方法があります。ChatGPT で長い会話をしている時に突然 AI アシスタントが会話の内容を忘れてしまうことがあるのはこのためです。

`system: assistant` は AI アシスタントによる発言を表します。下記のコードのように `system: user` と `system: assistant` の発言を交互に配列に追加していくことで、前後の会話の内容を含めた文章を生成することができます。

```ts
const chatCompletion = await openai.chat.completions.create({
  messages: [
    { system: "user": content: "こんにちは、私はジョンです"},
    { system: "assistant": content: "こんにちは、ジョンさん！お会いできて嬉しいです。何か質問やお手伝いできることはありますか？"},
    { system: "user": content: "私の名前を覚えていますか?"}
  ],
  model: "gpt-3.5-turbo",
});

console.log(chatCompletion.choices[0].message);
// はい、覚えています。おっしゃった通り、あなたの名前はジョンさんですね。
```

バックエンドでの実装でも、テキストを生成する際に過去の会話の内容を `messages` に渡すようにしてみましょう。リクエストボディの JSON に `messages` というキーで配列を渡すようにします。

```ts:src/index.ts {1-4, 9, 14}
type Message = {
  role: "user" | "system";
  content: string;
};

app.post("/chat", async (c) => {
  const body = await c.req.json<{
    message: string;
    messages: Message[];
  }>();
  return streamText(c, async (stream) => {
    const chatStream = openai.beta.chat.completions.stream({
      model: "gpt-3.5-turbo",
      messages: [...body.messages, { role: "user", content: body.message }],
      stream: true,
    });

    // ...
  })
})
```

フロントエンドからリクエストを送信する際に、`messages` を渡すように修正します。

```tsx:src/App.tsx {11}
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // ...

    abortControllerRef.current = new AbortController();

    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, messages }),
      signal: abortControllerRef.current.signal,
    });

    // ...
  };
```

これで、前後の会話の内容を含めた文章が生成されるようになりました。実際に試してみましょう。

![上司宛に「今日は風邪で休む」と伝える丁寧なメールを100文字以内書いて 上司様、本日は風邪のためお休みさせていただきます。申し訳ございませんが了承いただきますようお願い申し上げます。さっきのメールの件名もつけて 【重要】風邪のため本日休みの連絡致します](https://images.ctfassets.net/in6v9lxmm5c8/7M8OSATd4UH9DpUit236ST/0b9569ed493f72c275241263d87904fc/__________2024-01-30_20.08.18.png)

### まとめ

Hono の Streaming Helper を使用して、OpenAI API のレスポンスをストリーミングして返す API を実装しました。また、フロントエンド側で Fetch API を使ってストリーミングレスポンスを受け取る方法や、リクエストをキャンセルする方法についても学びました。

簡単なら AI チャットサービスであれば　Hono で用意に実装が可能です。プロダクションレディな AI チャットサービスを作りたい場合には以下のような課題があげられます。興味がある場合には、ぜひ挑戦してみてください。

- チャットの履歴をデータベースに保存する
- 異なるチャットルームを作成して、AI アシスタントにそれぞれ異なる人格を与えられるようにする
- AI が生成した文章を再生成する（temperature を変えたりすると良いでしょう）
- プロンプトインジェクションを防ぐためにユーザーの入力を検証したり、不適切な文章が生成されていないかチェックする
- API が大量に呼ばれないように、API のアクセス制限を設ける

この記事で使用したコードは以下のレポジトリにあります。

https://github.com/azukiazusa1/ai-chat-example

### 参考

- [hono.jsでOpenAI APIのStreamを受け流すAPIをつくる。｜さいぴ](https://note.com/sa1p/n/n17c8ac18d44e)
- [ChatGPTをぬるぬるにする🐌Server-Sent Eventsの基礎知識](https://zenn.dev/chot/articles/a089c203adad74)
- [サーバー送信イベントの使用 - Web API | MDN](https://developer.mozilla.org/ja/docs/Web/API/Server-sent_events/Using_server-sent_events)
- [openai/openai-node: The official Node.js / Typescript library for the OpenAI API](https://github.com/openai/openai-node)
- [リアル業務でChatGPT APIを使うコツ](https://zenn.dev/teramotodaiki/scraps/f016ed832d6f0d)
