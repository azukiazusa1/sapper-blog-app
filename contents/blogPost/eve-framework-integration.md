---
id: Lwl_gA4H3JCjulXUKKBVs
title: "eve 1.0 のフレームワーク統合で Web アプリと AI エージェントを一体開発する"
slug: "eve-framework-integration"
about: "Vercel の AI エージェントフレームワーク eve 1.0 で、Next.js・Nuxt・SvelteKit・TanStack Start・Vite 向けのフレームワーク統合が拡充されました。この記事では Next.js と useEveAgent を使った最小構成で動作を確認します。"
createdAt: "2026-11-20T19:38+09:00"
updatedAt: "2026-11-20T20:10+09:00"
tags: ["AI", "eve", "Next.js"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/6MvKD2eNcauDqn2TTt03r/5f17dfde718e5bc1637c5a847e7d4be8/kouya-tofu_24070-768x610.png"
  title: "凍り豆腐のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "eve 1.0 のフレームワーク統合における、Web アプリのサーバーとエージェントの関係として正しいものはどれですか？"
      answers:
        - text: "フロントエンドとエージェントは別オリジンのまま動作し、フレームワーク統合が CORS の設定を自動で追加する"
          correct: false
          explanation: "記事では、フレームワーク統合によって同一オリジン（/eve/v1/*）で通信できるようになり、CORS の設定やベース URL の管理が不要になると説明しています。"
        - text: "エージェントはフレームワークのサーバー内部には埋め込まれず独立したサービスとして動作し、/eve/v1/* へのリクエストが同一オリジンでエージェントへ転送される"
          correct: true
          explanation: "記事の通り、ランタイムは分離したまま、開発時のプロキシやデプロイ時のサービス構成を自動化して同一オリジンに統合する仕組みです。"
        - text: "エージェントの実行ループを Next.js の Route Handler として実装し、Next.js のサーバープロセス内部で処理する"
          correct: false
          explanation: "公式ガイドで明記されているとおり、エージェントは Next.js のサーバー内部では動作せず、独立したサービスとして動作します。"
        - text: "ローカル開発では eve dev を常に手動で別プロセス起動する必要がある"
          correct: false
          explanation: "記事では、Next.js ホスティング方式なら next dev の起動時に eve の開発サーバーも自動で起動し、別々に立ち上げる手間を省けると説明しています。"
    - question: "Next.js と eve を統合する 2 つの方式のうち、next dev や next start だけでアプリとエージェントをまとめて起動できる方式はどれですか？"
      answers:
        - text: "next.config.ts を eve/next の withEve() でラップする Next.js ホスティング方式"
          correct: true
          explanation: "記事の通り、Next.js ホスティング方式では next.config.ts を withEve() でラップし、next dev や next start だけでアプリとエージェントをまとめて起動できます。"
        - text: "プロジェクトルートに vercel.ts を置いて vercel dev --local で起動する Vercel services 方式"
          correct: false
          explanation: "Vercel services 方式は vercel.ts を使い、vercel dev --local でアプリとエージェントを別サービスとして並行起動する方式です。"
        - text: "agent/channels/eve.ts に eveChannel() を定義するだけで自動統合されるチャンネル方式"
          correct: false
          explanation: "agent/channels/eve.ts は HTTP チャンネルの認証設定を定義するファイルであり、Next.js との統合方式を指すものではありません。"
        - text: "eve add channel/web を実行した後に、Next.js と eve dev を別ターミナルで立ち上げる方式"
          correct: false
          explanation: "eve add channel/web はチャットアプリ一式を自動生成するインストーラーであり、別ターミナルで手動起動する方式ではありません。"
    - question: "agent/channels/eve.ts の auth 配列に [vercelOidc(), localDev(), placeholderAuth()] を設定した場合の挙動として正しいものはどれですか？"
      answers:
        - text: "配列の末尾から順に評価され、開発環境でも placeholderAuth() が最初にすべてのリクエストを拒否する"
          correct: false
          explanation: "記事では、auth 配列は先頭から順に評価され、ローカル開発環境では localDev() がループバック通信を許可すると説明しています。"
        - text: "localDev() は本番環境でも有効なままになり、すべてのブラウザからのアクセスを許可する"
          correct: false
          explanation: "記事では、localDev() はローカル開発サーバー上のループバック通信だけを許可し、本番環境では無視されると説明しています。"
        - text: "先頭から順に評価され、本番環境で localDev() が無視された後、認証を通らないリクエストは placeholderAuth() により未認証として拒否される"
          correct: true
          explanation: "記事の通り、auth 配列は先頭から評価され、末尾の placeholderAuth() が常に未認証として拒否することで、本番認証を未設定のままデプロイしても外部から意図せず呼ばれない安全側の挙動になります。"
        - text: "placeholderAuth() が自動でログイン画面を生成し、Next.js アプリの Cookie 認証へ切り替える"
          correct: false
          explanation: "placeholderAuth() はログイン画面を生成する機能ではなく、常に未認証としてリクエストを拒否する安全策として説明されています。"
    - question: "useEveAgent を使ったチャット UI の実装で、status が busy のときに送信を無効化せず、resuming の間だけ入力を無効化している理由として正しいものはどれですか？"
      answers:
        - text: "busy はセッションが終了した状態を表すため、送信しても新しいセッションが自動で始まるから"
          correct: false
          explanation: "busy はエージェントが処理中の状態を表しており、セッション終了の状態ではありません。"
        - text: "resuming 中はサーバーとの接続が完全に切断されており、エラーが必ず発生するから"
          correct: false
          explanation: "記事では、resuming は保存済みセッションの復元中であり、その間は入力を無効化しておくのが推奨されていると説明しています。"
        - text: "busy 中に送ったメッセージは自動的に破棄され、UI 側で制御する必要がないから"
          correct: false
          explanation: "処理中に送ったメッセージは破棄されるのではなく、デフォルトでは進行中の作業へ追加指示として割り込まれます。"
        - text: "デフォルトでは処理中に追加メッセージを送ると進行中の作業へ追加指示を割り込ませられるため"
          correct: true
          explanation: "記事の通り、保存済みセッション復元中の resuming は入力を無効化する一方、処理中の busy はデフォルトで追加指示を割り込ませられるため送信を止めていません（完了後に処理したい場合は { turnPolicy: \"queue\" } を渡します）。"
published: true
---
Web アプリケーションに AI エージェントを組み込むとき、フロントエンドのアプリとエージェントのバックエンドを別々のプロジェクトとして管理するのが一般的でしょう。その場合、ローカル開発で 2 つのサーバーを別々に起動し、CORS の設定やアプリ側のログインセッションとエージェント側の認証をどう連携させるかまで自前で整備する必要があります。

Vercel が 2026 年 11 月に一般提供（GA）を開始した AI エージェントフレームワーク [eve 1.0](https://vercel.com/blog/eve-is-now-generally-available) では、この課題を解消するためにフレームワーク統合（framework integration）が拡充されました。Next.js、Nuxt、SvelteKit、TanStack Start、Vite の 5 つのフレームワークに対応し、Web アプリと eve エージェントを同一オリジン・単一プロジェクトとして開発・ビルド・デプロイできるようになっています。

この記事では Next.js と React フックを使った最小構成を動かして確認します。

## なぜフレームワーク統合が追加されたのか

eve は、ファイルシステムベースで AI エージェントを構築できるフレームワークです。エージェント単体で開発する構成では、Web フロントエンドから利用する際に次のような手間が発生していました。

- ローカル開発時に、Web アプリの開発サーバーと `eve dev` を別々のプロセスで立ち上げ、URL やポートを合わせる必要がある
- フロントエンドとエージェントが異なるオリジンになるため、CORS の設定やベース URL の環境変数管理が必要になる
- ブラウザの Cookie を使った既存アプリの認証セッションを、エージェント側のルートへそのまま渡せない
- デプロイ時にも、Web アプリとエージェントのルーティングを手動で繋ぎ合わせる必要がある

eve 1.0 のフレームワーク統合は、こうした環境設定やルーティングの手間をフレームワーク側のプラグインや設定ラッパーが肩代わりしてくれます。ランタイム自体は分離したまま、開発時のプロキシとデプロイ時のサービス構成を自動化して同一オリジンに統合する仕組みです。

:::info
[Next.js の公式ガイド](https://eve.dev/docs/guides/frontend/nextjs)で明記されているとおり、エージェントはフレームワークのサーバー内部には埋め込まれず、独立したサービスとして動作します。分離する理由は公式には説明されていませんが、eve は独自のビルド処理と Workflow ランタイムを持っているため、ホストアプリ側の `withWorkflow` やミドルウェアとの競合を避ける狙いがあると考えられます。また、独立したサービスにしておけば、Next.js 以外のフレームワークや Slack などの別チャンネルからも同じランタイムを統一的に扱えます。
:::

## 対応フレームワークと仕組み

eve 1.0 のフレームワーク統合は、次の 5 つの Web フレームワークに対応しています。

- [Next.js](https://eve.dev/docs/guides/frontend/nextjs)
- [Nuxt](https://eve.dev/docs/guides/frontend/nuxt)
- [SvelteKit](https://eve.dev/docs/guides/frontend/sveltekit)
- [TanStack Start](https://eve.dev/docs/guides/frontend/tanstack)
- [その他の Vite アプリ](https://eve.dev/docs/guides/frontend/vite)

新規の eve プロジェクトにチャット UI を丸ごと追加したい場合は、CLI のインストーラーを使う方法もあります。

```bash
eve add channel/web
```

このコマンドを実行すると、フレームワーク（Next.js または TanStack Start）、ホスティング方式、認証方式（Next.js のみ Sign in with Vercel を選択可能）を対話形式で選び、`apps/web/` に AI Elements ベースのチャットアプリ一式を自動生成できます。

クライアント側では React・Vue・Svelte 向けに共通のモデルを扱う `useEveAgent` フックが提供されています。

## Next.js で eve を統合する

Next.js と eve の統合には次の 2 つの方式があります。

- Vercel services 方式: プロジェクトルートに `vercel.ts` を置き、`vercel dev --local` でアプリとエージェントを別サービスとして並行起動する
- Next.js ホスティング方式: `next.config.ts` を `eve/next` の `withEve()` でラップし、`next dev` や `next start` だけでアプリとエージェントをまとめて起動する

ここでは既存の Next.js アプリにも組み込みやすい Next.js ホスティング方式を使い、最小構成でチャット UI を動かしてみましょう。完成するディレクトリ構成は次のとおりです。

```text
.
├── agent/
│   ├── agent.ts              # エージェントのモデル設定
│   ├── instructions.md       # システムプロンプト
│   └── channels/
│       └── eve.ts            # HTTP チャンネルの認証設定
├── app/
│   ├── _components/
│   │   └── chat.tsx          # useEveAgent を使ったチャット UI
│   ├── layout.tsx
│   └── page.tsx
├── next.config.ts            # withEve() で Next.js と eve を統合
└── package.json
```

### 依存パッケージのインストール

`eve/next` を利用するには、Node.js 24 以上、Next.js 16、React 19 が必要です。`package.json` を用意して必要なパッケージをインストールします。

```json:package.json
{
  "name": "eve-framework-integration-example",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "eve": "^1.0.0",
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/node": "^24.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.9.0"
  }
}
```

```bash
npm install
```

### `next.config.ts` で `withEve()` を適用する

Next.js の設定オブジェクトを `eve/next` の `withEve()` でラップします。`withEve()` はデフォルトで `next.config.ts` と同じディレクトリにある `agent/`（または `agents/` ワークスペース）を自動検出します。エージェントを別のディレクトリに置いている場合は、`withEve(nextConfig, { eveRoot: "../.." })` のように `eveRoot` オプションで指定できます。

```ts:next.config.ts
import type { NextConfig } from "next";
import { withEve } from "eve/next";

const nextConfig: NextConfig = {};

export default withEve(nextConfig);
```

`withEve()` は内部で Next.js の設定関数 `(phase, context) => config` を返します。開発フェーズ（`next dev`）ではエージェントサーバーを起動して `/eve/v1/*` のリライトを設定し、本番ビルド（`next build`）や本番起動（`next start`）ではそれぞれの環境に応じたルーティングとサーバー管理へ切り替わります。

### エージェントを定義する

プロジェクトルート直下に `agent/` ディレクトリを作り、モデル設定・システムプロンプト・HTTP チャンネルの認証ポリシーを配置します。

まず `agent/agent.ts` を作成します。ここでは、環境変数 `OPENAI_API_KEY` が設定されていれば OpenAI のモデルを使い、そうでない場合は `eve/evals` の `mockModel()` へフォールバックする構成にしました。

```ts:agent/agent.ts
import { defineAgent } from "eve";
import { mockModel } from "eve/evals";
import { openai } from "eve/models/openai";

const fallbackModel = mockModel(({ lastUserMessage }) => ({
  text: `「${lastUserMessage ?? ""}」を受け取りました。Next.js と同一オリジン（/eve/v1/*）経由で応答しています。`,
}));

export default defineAgent({
  model: process.env.OPENAI_API_KEY ? openai() : fallbackModel,
});
```

続いて、エージェントへの指示を `agent/instructions.md` に書きます。

```md:agent/instructions.md
# Instructions

You are a concise assistant that replies in Japanese.
```

次に、HTTP チャンネルの設定を `agent/channels/eve.ts` に定義します。eve では、Slack や Discord、HTTP など外部からエージェントへアクセスする入口を「チャンネル」として管理します。そのうち HTTP チャンネルは、`useEveAgent()` などのブラウザクライアントが `/eve/v1/*` 経由で通信するための API と、リクエストの認証チェックを担う入口です。

```ts:agent/channels/eve.ts
import { localDev, placeholderAuth, vercelOidc } from "eve/channels/auth";
import { eveChannel } from "eve/channels/eve";

export default eveChannel({
  auth: [vercelOidc(), localDev(), placeholderAuth()],
});
```

`auth` 配列は先頭から順に評価されます。`localDev()` はローカル開発サーバー（`eve dev` または `vercel dev`）上のループバック通信だけを許可し、本番環境では無視されます。末尾の `placeholderAuth()` は常に未認証として拒否するため、本番用の認証を設定しないままデプロイしても外部から意図せず呼び出されないように安全側に倒すことができます。

実は、`agent/channels/eve.ts` を置かない場合でも、eve は同じ `[vercelOidc(), localDev(), placeholderAuth()]` を既定の認証ポリシーとして使います。それでもあえてファイルを作成しておくのは、どのリクエストを受け付けるのかをコード上で明示しておくためです。また、本番環境へデプロイする前には `placeholderAuth()` を、アプリのログインセッションを検証する認証関数（`AuthFn`）へ差し替える必要があります。あらかじめファイルを用意しておけば、その差し替え先がはっきりします。

### `useEveAgent` で最小チャット UI を実装する

フロントエンド側では、Client Component から `eve/react` の `useEveAgent()` を呼び出します。`withEve()` によって `/eve/v1/*` が同一オリジンにマウントされているため、`baseUrl` を指定する必要はありません。

```tsx:app/_components/chat.tsx
"use client";

import { useState } from "react";
import { useEveAgent } from "eve/react";

export function Chat() {
  const agent = useEveAgent();
  const [draft, setDraft] = useState("");
  const isResuming = agent.status === "resuming";

  return (
    <section>
      <div>
        {agent.messages.map((message) => (
          <article key={message.id}>
            <header>{message.role}</header>
            {message.parts.map((part, index) =>
              part.type === "text" ? (
                <p key={part.id ?? index}>{part.text}</p>
              ) : null,
            )}
          </article>
        ))}
      </div>

      {agent.error ? <p>{agent.error.message}</p> : null}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          const text = draft.trim();
          if (text.length === 0 || isResuming) return;
          setDraft("");
          void agent.send(text);
        }}
      >
        <input
          aria-label="メッセージ"
          disabled={isResuming}
          onChange={(event) => setDraft(event.currentTarget.value)}
          placeholder="メッセージを入力..."
          value={draft}
        />
        <button disabled={isResuming} type="submit">
          送信
        </button>
      </form>
    </section>
  );
}
```

このコンポーネントでは、`useEveAgent()` から返される `messages`、`status`、`error`、`send` を使っています。

- `agent.send(text)` はサーバーへメッセージを送信する。`send()` はサーバーがメッセージを受け付けた時点で解決し、応答は NDJSON（改行区切りの JSON）ストリーム経由で `agent.messages` へ順次反映される。デフォルトでは楽観的更新が有効なため、送信直後にユーザーのメッセージが表示される
- `agent.status` は `"idle"`・`"busy"`・`"resuming"` の 3 つの状態を取る。保存済みセッションの復元中である `"resuming"` の間は入力を無効化しておくのが推奨されている。一方、エージェントが処理中の `"busy"` で送信を止めていないのは、デフォルトでは処理中に追加メッセージを送ると、進行中の作業へ追加指示を割り込ませられるため。完了後に次の依頼として処理したい場合は `{ turnPolicy: "queue" }` を渡す
- `agent.error` には、直近のエラー内容が格納される

最後に `app/layout.tsx` と `app/page.tsx` を作成して `<Chat />` を表示します。

```tsx:app/layout.tsx
import type { ReactNode } from "react";

export default function RootLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
```

```tsx:app/page.tsx
import { Chat } from "./_components/chat";

export default function HomePage() {
  return (
    <main>
      <Chat />
    </main>
  );
}
```

## 動かして確認する

まず `npm run dev` を実行します。ここでは開発サーバーのポートを 3123 に指定しています。

```bash
npm run dev -- --port 3123
```

起動ログには、Next.js の開発サーバーに続いて eve の開発サーバーが自動起動したことが出力されます。

```text
▲ Next.js 16.4.6 (Turbopack)
- Local:         http://localhost:3123
✓ Ready in 276ms
✓ Running next.config.ts took 1045ms
[eve:dev] server listening at http://127.0.0.1:52670/
```

Next.js のオリジンに対してヘルスチェックエンドポイントへリクエストを送ると、プロキシ経由でエージェントから応答が返ります。

```bash
curl -s http://localhost:3123/eve/v1/health
```

```json
{"ok":true,"status":"ready","workflowId":"workflow//eve//workflowEntry"}
```

続いてブラウザで `http://localhost:3123` を開き、チャットからメッセージを送信してみました。

![Next.js 上の useEveAgent チャット UI で 2 ターン分のやり取りが完了した画面](https://images.ctfassets.net/in6v9lxmm5c8/4hAQv68O5hXKLn45kuUGHA/ca042a612cd79f139648828d5b55736d/eve-framework-integration-1.png)

画面上では 2 ターン分のユーザーメッセージとアシスタント応答がエラーなく描画されました。DevTools の Network タブを見ると、次のとおりすべてのリクエストが同一オリジンに対して送信されています。

- 1 ターン目のセッション作成: `POST http://localhost:3123/eve/v1/session`
- ストリーム購読: `GET http://localhost:3123/eve/v1/session/<sessionId>/stream`
- 2 ターン目のフォローアップ送信: `POST http://localhost:3123/eve/v1/session/<sessionId>`

## まとめ

- eve 1.0 のフレームワーク統合は、エージェントを独立サービスのまま保ちつつ、開発時の自動起動・同一オリジンプロキシなどを自動化する仕組みである
- Next.js、Nuxt、SvelteKit、TanStack Start、Vite の 5 つのフレームワークに対応し、クライアント側は `useEveAgent`（React / Vue / Svelte）の共通モデルでストリーミング応答やセッション状態を扱える
- Next.js では `vercel.ts` を使う Vercel services 方式と `next.config.ts` を `withEve()` でラップする Next.js ホスティング方式の 2 つから選べる
- Next.js ホスティング方式では、`npm run dev` で Next.js の開発サーバーを起動すると eve の開発サーバーも自動で起動し、同一オリジンで通信できることを確認できた

## 参考

- [eve 1.0 is now generally available - Vercel Blog](https://vercel.com/blog/eve-is-now-generally-available)
- [Frontend Frameworks - eve Docs](https://eve.dev/docs/guides/frontend)
- [Next.js - eve Docs](https://eve.dev/docs/guides/frontend/nextjs)
- [Nuxt - eve Docs](https://eve.dev/docs/guides/frontend/nuxt)
- [SvelteKit - eve Docs](https://eve.dev/docs/guides/frontend/sveltekit)
- [TanStack Start - eve Docs](https://eve.dev/docs/guides/frontend/tanstack)
- [Vite - eve Docs](https://eve.dev/docs/guides/frontend/vite)
- [useEveAgent Reference - eve Docs](https://eve.dev/docs/guides/frontend/use-eve-agent)
