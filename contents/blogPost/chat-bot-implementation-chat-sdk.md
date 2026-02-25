---
id: rDTwDo19ZGd3_hDdR0csI
title: "プラットフォームごとの Chat ボットの実装を抽象化する Chat SDK"
slug: "chat-bot-implementation-chat-sdk"
about: "Chat SDK は TypeScript で記述されたライブラリで、1 つのコードベースで複数のチャットプラットフォームに対応するチャットボットを開発できるようになります。イベント型アーキテクチャを採用しており、メンション, メッセージ, リアクション, スラッシュコマンドなどのイベントに型安全なハンドラーを定義できます。この記事では実際に Chat SDK を使用して、Slack 向けのチャットボットを実装する方法を紹介します。"
createdAt: "2026-02-25T19:15+09:00"
updatedAt: "2026-02-25T19:15+09:00"
tags: ["chat-sdk"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/6p5V4btlZquJ1OKKy0fgtP/60c50da42be3606ea4c9ec3273dbb921/bird_kakapo_23035.png"
  title: "カカポのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Chat SDK でスレッドを購読し、新しいメッセージに反応するために使用するメソッドの組み合わせはどれか？"
      answers:
        - text: "thread.subscribe() と bot.onSubscribedMessage"
          correct: true
          explanation: "thread.subscribe() でスレッドを購読し、購読したスレッドに新しいメッセージが投稿されたときに bot.onSubscribedMessage ハンドラーが呼び出されます。"
        - text: "thread.watch() と bot.onNewMessage"
          correct: false
          explanation: null
        - text: "thread.listen() と bot.onThreadMessage"
          correct: false
          explanation: null
        - text: "thread.follow() と bot.onFollowedMessage"
          correct: false
          explanation: null
    - question: "ストリーミング処理の更新間隔を設定するオプション名として正しいのはどれか？"
      answers:
        - text: "streamingRefreshIntervalMs"
          correct: false
          explanation: null
        - text: "streamingRateLimitMs"
          correct: false
          explanation: null
        - text: "streamingThrottleIntervalMs"
          correct: false
          explanation: null
        - text: "streamingUpdateIntervalMs"
          correct: true
          explanation: "Chat クラスのインスタンスを作成するときに streamingUpdateIntervalMs オプションでストリーミングの更新間隔を指定できます。"
published: true
---
生成 AI の普及に伴い、チャット型 UI を構築する機会が増えた開発者も多いのではないでしょうか。Slack や Microsoft Teams、Discord などのチャットコミュニケーションツールは AI と対話するインターフェイスとしても優れており、これらのプラットフォーム向けにチャットボットを開発するケースも増えています。しかし、各プラットフォームはそれぞれ独自の API を提供しているため、複数のプラットフォームに対応するチャットボットを開発するには、API ごとに個別の実装が必要になります。

この問題を解決するために、Vercel から Chat SDK がリリースされました。Chat SDK は TypeScript で記述されたライブラリで、1 つのコードベースで複数のチャットプラットフォームに対応するチャットボットを開発できるようになります。イベント型アーキテクチャを採用しており、メンション, メッセージ, リアクション, スラッシュコマンドなどのイベントに型安全なハンドラーを定義できます。

この記事では実際に Chat SDK を使用して、Slack 向けのチャットボットを実装する方法を紹介します。

## Chat ボットプロジェクトの作成

Slack 向けのチャットボットのために POST リクエストを受け取るエンドポイントを提供する必要があります。ここでは [Hono](https://hono.dev/) を使用して、簡単なサーバーを構築します。

```bash
npm init hono@latest chat-bot-example
```

次に、Chat SDK と Slack アダプター, インメモリに状態を保存するためのアダプターをインストールします。

```bash
npm install chat @chat-adapter/slack  @chat-adapter/state-memory
```

### Slack アプリを作成する

Slack へのメッセージの送受信を行うためには、Slack アプリを作成して、必要な権限を付与する必要があります。https://api.slack.com/apps にアクセスして「Create An App」ボタンをクリックして Slack アプリを作成しましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/5A1vnAjjCjsK9pMRMVoxwX/ad8a6d1fed02028d45a0d85ca64cad05/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-25_19.42.57.png)

ダイアログが表示されたら「From a manifest」を選択します。

![](https://images.ctfassets.net/in6v9lxmm5c8/2zfWfSzUZDss1NoDRK9OeP/51815c90459a7b3b3e83bc3c35469a32/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-25_19.43.53.png)

ワークスペースを選択した後、マニフェストを入力する画面が表示されるので、上記のタブから「YAML」を選択して、以下の内容を入力します。

```yaml
display_information:
  name: My Bot
  description: A bot built with Chat SDK
features:
  bot_user:
    display_name: My Bot
    always_online: true
oauth_config:
  scopes:
    bot:
      - app_mentions:read
      - channels:history
      - channels:read
      - chat:write
      - groups:history
      - groups:read
      - im:history
      - im:read
      - mpim:history
      - mpim:read
      - reactions:read
      - reactions:write
      - users:read
settings:
  event_subscriptions:
    request_url: https://your-domain.com/api/webhooks/slack
    bot_events:
      - app_mention
      - message.channels
      - message.groups
      - message.im
      - message.mpim
  interactivity:
    is_enabled: true
    request_url: https://your-domain.com/api/webhooks/slack
  org_deploy_enabled: false
  socket_mode_enabled: false
  token_rotation_enabled: false
```

`https://your-domain.com` の部分は後から作成するサーバーの URL に置き換えるので、今は適当な URL で問題ありません。

![](https://images.ctfassets.net/in6v9lxmm5c8/27N0hqoKI8PKPEWW9bx7G3/d535b0e7cdc5408daee8679815f67cc3/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-25_19.48.43.png)

最後に bot の権限を確認した後「Create」ボタンをクリックすると Slack アプリが作成されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3Fq9JyYOHs8BzC25SnUsBA/3c63fab9ed4c3c60aed066c1cc2e990f/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-25_19.49.53.png)

Slack アプリが作成されたら、左側のメニューから「OAuth & Permissions」を選択して、「Install to <ワークスペース名>」ボタンをクリックして Slack アプリをワークスペースにインストールします。ワークスペースにインストールした後 `xoxb-` で始まる Bot User OAuth Token を控えておきましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/4m2ZLsVsfZ2RPKhtWuKHli/656a588703c87825c519a5b1699da6af/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-25_19.52.15.png)

続いて、左側のメニューから「Basic Information」を選択して Signing Secret を控えておきます。

![](https://images.ctfassets.net/in6v9lxmm5c8/6pnmCrbDNaTzJNDHkOUEWu/c1cd466699725c465bcd45a04aa5355b/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-25_19.55.48.png)

取得した Bot User OAuth Token と Signing Secret は `.env` ファイルに保存しておきます。

```txt:.env
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_SIGNING_SECRET=your-signing-secret
```

## Chat SDK を使用してチャットボットを実装する

それでは Chat SDK を使用して、初めての Slack チャットボットを実装してみましょう。まずは `src/bot.ts` ファイルを作成して、以下のコードを追加します。

```ts:src/bot.ts
import { Chat } from "chat";
import { createSlackAdapter } from "@chat-adapter/slack";
import { createMemoryState } from "@chat-adapter/state-memory";
export const bot = new Chat({
  userName: "mybot",
  adapters: {
    // 環境変数 SLACK_BOT_TOKEN と SLACK_SIGNING_SECRET を自動で読み込む
    slack: createSlackAdapter(),
  },
  state: createMemoryState(),
});

// メンションに反応する
bot.onNewMention(async (thread) => {
  await thread.subscribe();
  await thread.post("Hello! I am a bot.");
});

// 購読したスレッドに新しいメッセージが投稿されたときに反応する
bot.onSubscribedMessage(async (thread, message) => {
  await thread.post(`You said: ${message.text}`);
});
```

`Chat` クラスのインスタンスを作成し、そのインスタンスに対してイベントハンドラーを定義するというシンプルな構造になっています。`createSlackAdapter` 関数は環境変数から Slack の認証情報を自動で読み込むため、`.env` ファイルに保存した認証情報をそのまま使用できます。

`bot.onNewMention` ハンドラーは `@My Bot` とメンションされたときに呼び出され、`thread.post` メソッドを使用して返信を投稿します。このとき `thread.subscribe()` を呼び出してスレッドを購読することで、そのスレッドに新しいメッセージが投稿されたときに `bot.onSubscribedMessage` ハンドラーが呼び出されるようになります。

次に、`src/index.ts` ファイルに Webhook エンドポイントを追加します。

```ts:src/index.ts
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { bot } from "./bot.js";

const app = new Hono();

// bot が対応しているプラットフォームを型として定義
type Platform = keyof typeof bot.webhooks;

app.post("/api/webhooks/:platform", async (c) => {
  // パスパラメータからプラットフォームを取得
  const platform = c.req.param("platform");
  // プラットフォームごとのハンドラを取得
  const handler = bot.webhooks[platform as Platform];
  if (!handler) {
    return c.text("Unsupported platform", 400);
  }
  // ハンドラにリクエストを渡して処理してもらう
  return handler(c.req.raw);
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
```

`/api/webhooks/:platform` エンドポイントを定義し、パスパラメータからプラットフォームを取得して、対応するハンドラーにリクエストを渡しています。これで Slack からのリクエストを処理できるようになりました。

ローカルでテストを行うためには、ngrok などのツールを使用してローカルサーバーをインターネットに公開する必要があります。ngrok をインストールして、以下のコマンドでローカルサーバーを公開しましょう。

```bash
npm run dev
```

```bash
ngrok http 3000
```

ngrok を起動すると、`https://your-domain.com` の部分に置き換えるべき URL が表示されるので、その URL を Slack アプリのイベントサブスクリプションとインタラクティビティのリクエスト URL に設定します。左メニューの「Event Subscriptions」を選択して、Request URL を ngrok の URL に置き換えた後に「Verified ✔」と表示されれば設定は完了です。

![](https://images.ctfassets.net/in6v9lxmm5c8/73FjbL5ipL4ueMEuXYM9dS/aabc6eadbf8696aa269ca4d7d7d93d3c/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-25_20.22.29.png)

実際に Slack 上で `@My Bot hello` とメンションしてみましょう。すると、ボットが「Hello! I am a bot.」と返信し、そのスレッドに新しいメッセージを投稿すると「You said: <投稿したメッセージ>」と返信することが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/76JMz48ChoEDUQODm0kehN/ba1ddf25a91a75da663ac7e3f2e98aee/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-25_20.24.46.png)

## インタラクティブな UI で返答する

Chat SDK では JSX を使用してボタンやカードといったインタラクティブな UI を返すこともできます。JSX を扱えるように `src/bot.ts` を `src/bot.tsx` にリネームしておきましょう。

```bash
mv src/bot.ts src/bot.tsx
```

また `tsconfig.json` ファイルの `compilerOptions` に以下の設定を追加して、JSX を有効にします。

```json:tsconfig.json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "chat"
  }
}
```

`<Card>` コンポーネントを使用してインタラクティブなメッセージを構築していきます。`<Card>` コンポーネントはプラットフォームごとにそれぞれ以下のような UI に変換されます。

| プラットフォーム | 変換後の UI                                                                            |
| ---------------- | -------------------------------------------------------------------------------------- |
| Slack            | [Block Kit](https://api.slack.com/block-kit)                                           |
| Microsoft Teams  | [Adaptive Cards](https://adaptivecards.io/)                                            |
| Discord          | [Embeds](https://discord.com/developers/docs/resources/channel#embed-object)           |
| Google Chat      | [Card](https://developers.google.com/workspace/chat/api/reference/rest/v1/cards?hl=ja) |

```tsx:src/bot.tsx
import { Chat, Card, CardText, Button, Actions, Select, SelectOption, Divider } from "chat";

// 省略...
bot.onNewMention(async (thread) => {
  await thread.subscribe();
  await thread.post(
    <Card title="Welcome to my bot!">
      {/* CardText はマークダウンをサポート */}
      <CardText>
        Hello! I am a **bot**. I can respond to your _messages_ and button
        clicks.
      </CardText>
      <Divider />
      <Actions>
        <Button id="primary" style="primary">
          Click me
        </Button>
        <Select
          id="select-fruit"
          label="Your favorite fruit"
          onChange={async (value) =>
            await thread.post(`You selected: ${value}`)
          }
        >
          <SelectOption label="🍎" value="apple" />
          <SelectOption label="🍌" value="banana" />
          <SelectOption label="🍊" value="orange" />
        </Select>
      </Actions>
    </Card>,
  );
});

// 対応する id のアクションが実行されたときに反応する
bot.onAction("primary", async (event) => {
  await event.thread.post("You clicked the button!");
});

bot.onAction("select-fruit", async (event) => {
  await event.thread.post(`You selected: ${event.value}`);
});
```

`thread.post()` に JSX を渡すことで、Slack の Block Kit に変換されてリッチな UI を構築できます。`<Button>` や `<Select>` といったインタラクティブなコンポーネントでは一意の `id` を指定し、その `id` に対応するアクションが実行されたときに `bot.onAction` で定義したハンドラーが呼び出されるようになっています。

実際に Slack 上で `@My Bot` を呼び出してみると、カード形式のリッチなメッセージが返され、ボタンをクリックしたりセレクトボックスから選択したりすると、それぞれに対応する返信が返されることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/7zILECj1rDetOf7HkvjJhh/6df983c2a6df8d1aca84b4b7a56df84d/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-25_21.01.23.png)

## ストリーミング処理

AI とのやり取りはレスポンスの生成に時間がかかることが多いため、ユーザーの体験を向上させるためにストリーミングでレスポンスを返すのが一般的です。Chat SDK はあらゆるものが `AsyncIterable` で扱えるように設計されているため、ストリーミング処理も簡単に実装できます。Slack の場合はネイティブのストリーミング API を使用してリアルタイム更新を実現できますが、ストリーミング API をサポートしていない他のプラットフォームの場合では投稿と編集を繰り返すことでストリーミングのような体験を実現しています。このフォールバックを使用している場合はレート制限に注意が必要です。`Chat` クラスのインスタンスを作成するときに `streamingUpdateIntervalMs` オプションでストリーミングの更新間隔を指定できます。

```ts
export const bot = new Chat({
  streamingUpdateIntervalMs: 500, // ストリーミングの更新間隔を指定（ミリ秒）
});
```

[AI SDK](https://ai-sdk.dev/docs/introduction) を使用して、AI のレスポンスをストリーミングで返す例を見てみましょう。AI SDK とプロバイダーをインストールします。

```bash
npm install ai @ai-sdk/anthropic
```

Claude の API キーを環境変数 `ANTHROPIC_API_KEY` に保存しておきましょう。

```txt:.env
ANTHROPIC_API_KEY=your-anthropic-api-key
```

AI SDK の `streamText` 関数で AI のレスポンスをストリーミングで受け取りながら、`thread.post()` に渡すことで、ユーザーは AI のレスポンスが生成される過程をリアルタイムで見ることができます。

```tsx:src/bot.tsx
import { anthropic } from '@ai-sdk/anthropic';

// メンションに反応する
bot.onNewMention(async (thread, message) => {
  const result = streamText({
    model: anthropic("claude-haiku-4-5"),
    prompt: message.text,
  });
  await thread.post(result.textStream);
});
```

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/Xj4gLBp5lGxRUwkf6ZQbe/843a49db6a8cdb1c6539a17656964722/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2026-02-25_21.17.48.mov" controls></video>

スレッドの会話履歴を元に AI と対話したい場合には、`thread.adapter.fetchMessages()` メソッドで過去のメッセージを取得して、その内容をプロンプトに渡すことができます。

```tsx:src/bot.tsx
bot.onSubscribedMessage(async (thread) => {
  const fetchResult = await thread.adapter.fetchMessages(thread.id, {
    limit: 20,
  });
  const history = fetchResult.messages
    .filter((msg) => msg.text.trim())
    .map((msg) => ({
      role: msg.author.isMe ? ("assistant" as const) : ("user" as const),
      content: msg.text,
    }));
  const result = streamText({
    model: anthropic("claude-haiku-4-5"),
    prompt: [...history],
  });
  await thread.post(result.textStream);
});
```

![](https://images.ctfassets.net/in6v9lxmm5c8/60FKFgsemJeWU4n70x0UMX/fdc64bc4b19d82dc0b0f3ac5bf16c294/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-25_21.25.40.png)

## まとめ

- Chat SDK を使用することで、1 つのコードベースで複数のチャットプラットフォームに対応するチャットボットを開発できる。
- Chat SDK はイベント型アーキテクチャを採用しており、メンション, メッセージ, リアクション, スラッシュコマンドなどのイベントに型安全なハンドラーを定義できる。
- `bot.onNewMention` ハンドラーで bot がメンションされたときの処理を定義し、`thread.subscribe()` を呼び出すことで、そのスレッドに新しいメッセージが投稿されたときに `bot.onSubscribedMessage` ハンドラーが呼び出されるようになる。`thread.post()` メソッドを使用して返信を投稿できる。
- `thread.post()` に JSX を渡すことで、プラットフォームごとに適切なリッチ UI を構築できる。
- Chat SDK はあらゆるものが `AsyncIterable` で扱えるように設計されているため、AI のレスポンスをストリーミングで返すことも簡単に実装できる。ストリーミング API をサポートしていないプラットフォームの場合では投稿と編集を繰り返すことでストリーミングのような体験を実現している。

## 参考

- [Introducing npm i chat – One codebase, every chat platform - Vercel](https://vercel.com/changelog/chat-sdk)
- [Chat SDK Documentation](https://www.chat-sdk.dev/docs)
- [vercel/chat: A unified TypeScript SDK for building chat bots across Slack, Microsoft Teams, Google Chat, Discord, and more.](https://github.com/vercel/chat/)
