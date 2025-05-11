---
id: eS7jEk3GdxmVk9PYGiruu
title: "Vercel で MCP サーバーを構築する"
slug: "vercel-mcp-server"
about: "Model Context Protocol (MCP) の 2025-03-26 の仕様では新たに Streamable HTTP が追加され、リモート MCP サーバーへの注目が集まっています。この記事では Next.js を使用して Vercel 上に MCP サーバーを構築する方法を紹介します。"
createdAt: "2025-05-11T17:50+09:00"
updatedAt: "2025-05-11T17:50+09:00"
tags: ["Vercel", "MCP", "Next.js"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1LBdbkHzPPUKbS7oceHuxZ/6eb391e6aa08ce8e1ff7fd40b2630b7b/game_dice_illust_2692-768x550.png"
  title: "黒いサイコロの"
audio: "https://downloads.ctfassets.net/in6v9lxmm5c8/kBtynR6oTVoOinnIqpNzo/345a629058e022f154151105e0c83ccc/Vercel%E4%B8%8A%E3%81%AEMCP%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC%E6%A7%8B%E7%AF%89.wav"
selfAssessment:
  quizzes:
    - question: "この記事内で使用されている HTTP Streamable 形式の MCP サーバーのエンドポイントはどれですか？"
      answers:
        - text: "/mcp"
          correct: true
          explanation: "HTTP Streamable 形式の MCP サーバーのエンドポイントはデフォルトで /mcp です。これは createMcpHandler() のオプションで変更することもできます。"
        - text: "/streamable"
          correct: false
          explanation: null
        - text: "/api/mcp"
          correct: false
          explanation: null
        - text: "/api/streamable"
          correct: false
          explanation: null
published: true
---
[Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) の 2025-03-26 の仕様では新たに Streamable HTTP が追加され、リモート MCP サーバーへの注目が集まっています。従来の MCP サーバーは stdio を使用してローカルで実行されることが一般的であったため、デスクトップアプリケーションや CLI ツールのみで利用されるなど、利用シーンが限られていました。

Streamable HTTP を使用することで、リモートの MCP サーバーを Web アプリケーションから利用されることが期待されます。Claude の Web 版ではリモート MCP サーバー経由で MCP サーバーにアクセスできるようになったことが発表されています。

https://www.anthropic.com/news/integrations

この記事では Next.js を使用して Vercel 上に MCP サーバーを構築する方法を紹介します。完成したコードは以下のリポジトリで確認できます。

## Next.js プロジェクトを作成する

まずは以下のコマンドを実行して Next.js プロジェクトを作成します。

```bash
npx create-next-app@latest my-mcp-server
```

続いて以下のパッケージをインストールします。

- `@vercel/mcp-adapter`: Vercel 上で MCP サーバーを構築するためのアダプター。HTTP Streamable と従来の方式である SSE の両方に対応している
- `zod`: バリデーションライブラリ。ツールのインターフェイスを定義するために使用する

```bash
npm install @vercel/mcp-adapter zod
```

## API ルートを作成する

続いて Next.js の [API Routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) を使用して MCP サーバーのエンドポイントを作成します。`app/[transport]/route.ts` に以下のコードを追加します。

```ts:app/[transport]/route.ts
import { createMcpHandler } from "@vercel/mcp-adapter";
import { z } from "zod";

const handler = createMcpHandler((server) => {
  server.tool(
    // ツールの名前
    "dice_roll",
    // ツールの説明
    "サイコロを振った結果を返します",
    // ツールの引数のスキーマ
    {
      sides: z.number().min(1).max(100).default(6).describe("サイコロの面の数"),
    },
    // ツールの実行関数
    async ({ sides }) => {
      // サイコロを振る
      const result = Math.floor(Math.random() * sides) + 1;
      // 結果を返す
      return {
        content: [{ type: "text", text: result.toString() }],
      };
    }
  );
});

export { handler as GET, handler as POST, handler as DELETE };
```

`createMcpHandler` 関数を使用して MCP サーバーのハンドラーを作成します。引数のコールバック関数で `server` オブジェクトを受け取り、`tool` メソッドを使用してツールを定義します。

`handler` は `GET`、`POST`、`DELETE` メソッドのエンドポイントとしてエクスポートします。これにより、HTTP ストリーミングと従来の SSE の両方に対応した MCP サーバーが作成されます。



## ローカルで実行する

まずはローカル環境で試してみましょう。SSE トランスポートに必要な状態を管理するために Redis が必要です。`docker-compose.yml` を使用して Redis を起動します。

```yaml:docker-compose.yml
version: "3.8"
services:
  redis:
    image: redis:latest
    ports:
      - "6379:6379"
```

```bash
docker compose up -d
```

Redis が起動したら、以下のコマンドを実行して Next.js アプリケーションを起動します。

```bash
REDIS_URL=redis://localhost:6379 npm run dev
```

正しく MCP サーバーを構築できているか確認するために [MCP Inspector](https://github.com/modelcontextprotocol/inspector) を使用しましょう。これは GUI ベースで MCP サーバーのデバッグを行うためのツールです。

```bash
npx @modelcontextprotocol/inspector
```

http://127.0.0.1:6274 にアクセスして MCP Inspector を開きます。「Transport Type」で「Streamable HTTP」を選択し、URL 欄に `http://localhost:3000/mcp` を入力して「Connect」ボタンをクリックします。

![](https://images.ctfassets.net/in6v9lxmm5c8/5tzUWfUpaViC37h4i3RPua/af93fdda3340aaf35987e08321e0c97b/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-05-11_18.34.21.png)

「List Tools」ボタンをクリックすると、実装した `dice_roll` ツールが表示されます。「Run Tool」ボタンをクリックすると、ツールを実行できます。結果が表示されていることを確認してください。

![](https://images.ctfassets.net/in6v9lxmm5c8/6Qlm9gedAp9SgOk21PCmWj/713412846b3763ffc4248db06d9af726/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-05-11_18.36.03.png)

同様に `/sse` エンドポイントでも動作することを確認します。「Transport Type」を「SSE」に変更し、URL 欄に ` http://localhost:3000/sse` を入力して「Connect」ボタンをクリックします。

![](https://images.ctfassets.net/in6v9lxmm5c8/2jrGBxCMCaoWzUdiByke60/000e4c56c7159b1908162869be778346/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-05-11_18.37.38.png)

## デプロイする

Vercel にデプロイするために GitHub リポジトリとの連携を行います。あらかじめ GitHub リポジトリを作成しておきましょう。https://vercel.com/new から GitHub リポジトリを選択します。

![](https://images.ctfassets.net/in6v9lxmm5c8/3HhSrfOqNccfAzbxJblS06/f10e72437b803bc59e5bb4fde6e8d285/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-05-11_18.44.59.png)

デプロイボタンをクリックしてデプロイを開始します。

![](https://images.ctfassets.net/in6v9lxmm5c8/6Vr1OmcukZt5tk0N63qQKm/c36fec55c273dd5649c5a20381521c8e/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-05-11_18.47.04.png)

SSE トランスポートをサポートするために Redis が必要です。デプロイ後のダッシュボード画面で「Storage」タブをクリックし、「Create Database」ボタンをクリックします。

![](https://images.ctfassets.net/in6v9lxmm5c8/3Dy7mHA07KTvxo2GX0XHDs/bc704b690a622f86bc45bf0c91f14613/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-05-11_18.51.18.png)

ダイアログが表示されるので、「Marketplace Database Providers」から「Redis」を選択します。

![](https://images.ctfassets.net/in6v9lxmm5c8/6EKwtomVXtfkdXYI6tgTOZ/0fe800340eff6bbf124f13f60dedcfb0/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-05-11_18.52.39.png)

その後リージョンとプランを選択するとデータベースが作成されます。作成されたら「Settings」タブをクリックし、接続情報を確認します。環境変数 `REDIS_URL` は自動で設定されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5DNo3f8ii7G2NP7cHGnmPW/1007310fb120dac56ce381eba7334ad9/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-05-11_18.54.52.png)

Redis の作成が完了したら再度デプロイを行っておきましょう。デプロイが完了したら、MCP Inspector を使用して MCP サーバーに接続します。URL 欄には `https://<your-deployment-url>/mcp` を入力します。

![](https://images.ctfassets.net/in6v9lxmm5c8/7pw81Nz1ZsPVBh59u2Th8G/e970a48d7989383ea117de04b5790711/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-05-11_19.06.45.png)

## まとめ

- `@vercel/mcp-adapter` を使用することで、Vercel 上に MCP サーバーを構築できる
- Vercel 上に構築した MCP サーバーは HTTP ストリーミングと従来の SSE の両方に対応している
- SSE トランスポートを使用するためには Redis が必要
- MCP サーバーは MCP Inspector を使用してデバッグできる

## 参考

- [MCP server support on Vercel](https://vercel.com/changelog/mcp-server-support-on-vercel)
- [Vercelで始めるMCPサーバー構築入門 | DevelopersIO](https://dev.classmethod.jp/articles/mcp-server-on-vercel/)
