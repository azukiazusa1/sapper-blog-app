---
id: jNgXwawhB9_GXJGcIfCjM
title: "v0 の SDK を試してみる"
slug: "try-v0-sdk"
about: "v0 は Vercel が開発した AI ベースの Web アプリケーション・UI 生成ツールです。v0 のプラットフォーム API を使用すると、v0 の機能を自身のコードから利用できます。この記事では v0 TypeScript SDK を使用して、v0 のプラットフォーム API を試してみます。"
createdAt: "2025-07-12T09:32+09:00"
updatedAt: "2025-07-12T09:32+09:00"
tags: ["AI", "TypeScript", "v0"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/232SDq8E0verH6cy7PJMdI/b7f21d50b43b21efeb63e0a226cc5770/electronic-piano_19476-768x630.png"
  title: "キーボード（鍵盤）のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "v0.chats.create メソッドで新しいチャットを作成した時、生成されたコードのファイル一覧を取得するプロパティはどれですか？"
      answers:
        - text: "chat.files"
          correct: true
          explanation: "chat.files プロパティには v0 が生成したファイルの一覧が含まれています"
        - text: "chat.code"
          correct: false
          explanation: null
        - text: "chat.sources"
          correct: false
          explanation: null
        - text: "chat.components"
          correct: false
          explanation: null
    - question: "既存のチャットに追加のメッセージを送信するために使用するメソッドはどれですか？"
      answers:
        - text: "v0.chats.createMessage"
          correct: true
          explanation: "createMessage メソッドはチャットの ID とメッセージを引数に取り、チャットにメッセージを追加します"
        - text: "v0.chats.addMessage"
          correct: false
          explanation: null
        - text: "v0.chats.sendMessage"
          correct: false
          explanation: null
        - text: "v0.chats.append"
          correct: false
          explanation: null
    - question: "v0 で生成されたアプリケーションのプレビューURLを取得するプロパティはどれですか？"
      answers:
        - text: "chat.demo"
          correct: true
          explanation: "chat.demo プロパティで生成されたWebアプリケーションのプレビューURLを取得できます"
        - text: "chat.preview"
          correct: false
          explanation: null
        - text: "chat.deploy"
          correct: false
          explanation: null
        - text: "chat.view"
          correct: false
          explanation: null
published: true
---
[v0](https://v0.dev/) は Vercel が開発した AI ベースの Web アプリケーション・UI 生成ツールです。

自然言語でアプリケーションの要件を v0 に伝えることで React, Next.js, Tailwind CSS を使用した Web アプリケーションのコードを自動生成します。生成したコードは Web ブラウザ上で実行でき、さらにワンクリックで Vercel 上のインフラストラクチャにデプロイが可能です。デザインのモックアップやプロトタイプを迅速に作成するためのツールとして非常に便利です。

v0 は Web ブラウザ上で動作するため Vercel のアカウントがあればすぐに試すことができます。またプログラム上から v0 の機能を利用するための v0 プラットフォーム API がパブリックベータ版として公開されました。プラットフォーム API を使用することで、v0 の以下の機能を自身のコードから利用できます。

- プロンプトから Web アプリケーションのコードを生成
- プレビューへのリンク

この記事では v0 の TypeScript SDK を使用して、v0 のプラットフォーム API を試してみます。

## v0 SDK のインストール

はじめに TypeScript プロジェクトを作成します。以下のコマンドを実行して新しいプロジェクトを作成し、必要なパッケージをインストールします。

```bash
mkdir v0-sdk-example
cd v0-sdk-example
npm init -y
npm install v0-sdk
npm install typescript tsx @types/node --save-dev
```

v0 SDK を使用するためには v0 の API キーが必要です。あらかじめ Vercel のアカウントを作成しておく必要があります。

https://v0.dev/chat/settings/keys にアクセスして API キーを生成してください。「+ New Key」ボタンをクリックすると API キーを生成するためのダイアログが表示されます。適当な名前を入力して「Create」ボタンをクリックすると API キーが生成されます。API キーは一度しか表示されないため、必ずコピーして安全な場所に保存してください。

![](https://images.ctfassets.net/in6v9lxmm5c8/5eYSqi7uZm7iECTUguYeok/a2cfd2dc33298dacb6c4ee98901ec7ef/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-12_9.50.06.png)


API キーは環境変数 `V0_API_KEY` として設定します。この環境変数は v0 SDK により自動で読み込まれます。

```bash
export V0_API_KEY=your_api_key_here
```

## チャットを使用して Web アプリケーションを生成する

はじめに、v0 SDK を使用してチャットを開始し、Web アプリケーションのコードを生成します。以下のコードを `src/index.ts` ファイルに保存してください。

```typescript:src/index.ts
import { v0 } from "v0-sdk";

const chat = await v0.chats.create({
  message:
    "ブログ記事の一覧を表示する Web アプリケーションを作成してください。記事はタイトルと作成日・サムネイル画像を含みます。",
  system: "あなたは React のエキスパートです。",
  // 追加の添付ファイルがあれば指定可能
  attachments: [{ url: "https://example.com/sample-image.png" }],
  // モデルの指定（省略可能）
  modelConfiguration: {
    modelId: "v0-1.5-sm",
    thinking: false,
    imageGeneration: false,
  },
});

console.log("Chat ID:", chat.id);
console.log("Response:", chat.text);

console.log("\n\n");

console.log("Chat URL:", chat.url);
console.log("Preview URL:", chat.demo);
```

`v0.chats.create` メソッドを使用してチャットを開始し、メッセージを送信します。チャットの応答は `chat.text` プロパティに格納されます。また、チャットの URL とプレビュー URL も取得できます。チャットの URL は v0 の Web インターフェースでチャットを確認するために使用できます。プレビュー URL は生成された Web アプリケーションのプレビューを表示するために使用できます。実際のアプリケーションでは `<iframe>` タグを使用してプレビューを表示する使い方ができるでしょう。

以下のコマンドを実行してコードを実行します。

```bash
npx tsx src/index.ts
```

実行結果は以下のようになります。

```
Chat ID: jEMVcvEdTIB
Response: <Thinking>
ユーザーはブログ記事の一覧を表示するWebアプリケーションを作成したいと言っています。記事にはタイトル、作成日、サムネイル画像が含まれるとのことです。

Next.jsのApp Routerを使用して、レスポンシブなデザインでブログ記事一覧を作成します。shadcn/uiコンポーネントを使用してモダンなUIを構築し、サンプルデータを含めます。

# 省略...

Chat URL: https://v0.dev/chat/jEMVcvEdTIB
Preview URL: https://preview-kzmqeaoycx9y4tgr4sas.vusercontent.net
```

チャットの URL をブラウザで開くと、v0 の Web インターフェースでチャットの内容を確認できます。Web ブラウザ上からチャットの続きを送信できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/1cfSLFZFYhwZEPRqy7ntFg/f639e2e615837ea98478c0ac5c491e66/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-12_10.17.11.png)

## 生成されたコードを確認する

生成されたコードをプログラム上から確認するためには `chat.files` プロパティを使用します。このプロパティには v0 が生成したファイルの一覧が含まれています。各ファイルは `meta`, `lang`, `source` のプロパティを持っています。
```typescript:src/index.ts
import { v0 } from "v0-sdk";

const chat = await v0.chats.create({
  message:
    "ブロック崩しゲームを作成してください。ゲームのルールは、ボールを操作してブロックを壊すことです。",
});
console.log("Generated Files:");

chat.files?.forEach((file) => {
  // ファイル名は file.meta.file で取得できる
  console.log("Meta:", file.meta);
  // ファイルの言語 typescriptreact, javascript, python など
  console.log("Language:", file.lang);
  // 生成されたコード
  console.log("Source Code:\n", file.source);
  console.log("\n\n");
});
```

レスポンスは以下のようになります。

```sh
Generated Files:
Meta: { file: 'breakout-game.tsx' }
Language: typescriptreact
Source Code:
 "use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"

interface Ball {
  x: number
  y: number
  dx: number
  dy: number
}

# ...省略
```

## チャットの続きのメッセージを送信する

一度開始されたチャットに対して、続きのメッセージを送信するためには `v0.chats.createMessage` メソッドを使用します。`createMessage` メソッドはチャットの ID とメッセージを引数に取り、チャットにメッセージを追加します。

```typescript:src/index.ts
import { v0 } from "v0-sdk";

const chatId = "jEMVcvEdTIB"; // 先ほどのチャット ID を使用

const chat = await v0.chats.createMessage({
  chatId,
  message: "ダークモードに切り替えできるようにしてください。",
});

console.log("Response:", chat.text);
```

チャットの Web インターフェースでメッセージが追加され、応答が表示されていることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5jEeoYT479dTV1AZa3nonN/6eaf2d4a993e44fa7994adce5038860f/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-12_10.23.46.png)

その他チャット関連のメソッドは以下のものがあります。

- `v0.chats.find()`: チャットの一覧を取得
- `v0.chats.getById({ chatId: string })`: ID でチャットを取得
- `v0.chats.favorite({ chatId: string })`: チャットをお気に入りに追加
- `v0.chats.unfavorite({ chatId: string })`: チャットのお気に入りを解除
- `v0.chats.delete({ chatId: string })`: チャットを削除
- `v0.chats.update({ chatId: string })`: チャットの privacy を更新
- `v0.chats.fork({ chatId: string })`: チャットをフォーク
- `v0.chats.getMetadata({ chatId: string })`: チャットのメタデータを取得
- `v0.chats.resume({ chatId: string })`: チャットを再開

## その他の操作

v0 SDK ではチャット以外にも以下の操作が可能です。

```typescript
import { v0 } from "v0-sdk";

// プロジェクトの一覧を取得
const projects = await v0.projects.find();
// プロジェクトを作成
const project = await v0.projects.create({
  name: "My New Project",
  description: "This is a new project created using v0 SDK.",
});
// chatID を指定してプロジェクトを取得
const projectById = await v0.projects.getByChatId({ chatId: "..." });

// rate limit の情報を取得
const rateLimits = await v0.rateLimits.find();

// ユーザーの情報を取得
const user = await v0.users.get();
// プランの情報を取得
const plan = await v0.users.getPlan();
// ユーザーのスコープ
const scopes = await v0.users.getScopes();

// deployments のログを取得
const deployments = await v0.deployments.findLogs({ deploymentId: "..." });

// Vercel のプロジェクトを取得
const projects = await v0.integrations.vercel.projects.find();
// Vercel のプロジェクトを作成
const vercelProject = await v0.integrations.vercel.projects.create({
  name: "My Vercel Project",
  projectId: "your-vercel-project-id",
});
```

## まとめ

- v0 は自然言語から Web アプリケーションのコードを生成するツール
- v0 のプラットフォーム API を使用することで、プログラムから v0 の機能を利用できる
- v0 SDK を使用して TypeScript から v0 の機能を簡単に利用できる
- `v0.chats.create` メソッドでチャットを開始し、Web アプリケーションのコードを生成できる
  - `chat.url` プロパティでチャットの URL を取得でき、Web ブラウザ上でチャットを確認できる
  - `chat.demo` プロパティで生成された Web アプリケーションのプレビュー URL を取得できる
  - `chat.files` プロパティで生成されたコードのファイル一覧を取得
- `v0.chats.createMessage` メソッドでチャットに続きのメッセージを送信できる

## 参考

- [v0 Platform API | v0 Docs](https://v0.dev/docs/v0-platform-api)
- [v0-sdk - npm](https://www.npmjs.com/package/v0-sdk)
