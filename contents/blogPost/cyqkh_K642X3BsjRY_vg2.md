---
id: cyqkh_K642X3BsjRY_vg2
title: "Prisma で OpenTelemetry のトレースデータを計装する"
slug: "prisma-opentelemetry-trace"
about: "Prisma は OpenTelemetry の仕様に準拠したトレースデータを計装するためのパッケージを提供しています。この記事では、Prisma で OpenTelemetry のトレースデータを計装する方法について紹介します。"
createdAt: "2025-02-21T20:14+09:00"
updatedAt: "2025-02-21T20:14+09:00"
tags: ["Prisma", "OpenTelemetry"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1bhny7mIs4MAIFOEvRy5SY/dee304e4571c088ef2a8872be69aae73/shellfish_hamaguri_20905-768x709.png"
  title: "はまぐりのイラスト"
selfAssessment:
  quizzes:
    - question: "データベースに対して実行された DB クエリの実行時間"
      answers:
        - text: "`prisma:client:operation`"
          correct: false
          explanation: ""
        - text: "`prisma:engine:db_query`"
          correct: true
          explanation: ""
        - text: "`prisma:engine:query`"
          correct: false
          explanation: ""
        - text: "`prisma:engine:serialize`"
          correct: false
          explanation: ""

published: true
---

Prisma は [OpenTelemetry](https://opentelemetry.io/) の仕様に準拠したトレースデータを計装するためのパッケージを提供しています。OpenTelemetry は分散トレーシングのためのオープンソースの規格です。OpenTelemetry の規格に従うことで、トレース・メトリクス・ログなどのテレメトリーデータをベンダーやツールにとらわれずに収集・エクスポートできるようになります。

この記事では、Prisma で OpenTelemetry のトレースデータを計装する方法について紹介します。

## トレースとは

トレースとは、リクエストがアプリケーションに投げられたとき何が起こっているのか全体の流れを可視化するための手法です。

例えば HTTP リクエストを受け取りデータベースからデータを取得し、そのデータを加工してレスポンスを返すというシンプルなリクエストの例を考えて見ましょう。このリクエストの一連の流れは「スパン」と呼ばれる単位で表現され、それぞれのスパンは「HTTP リクエスト」「データベースクエリ」「外部 API コール」といった処理を表します。これらのスパンはトレースとしてまとめられ、リクエスト全体の流れを可視化することができます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3kccciDw0Dd8Kr0VORSvPe/8e44875ccb4dd3c25cd681df6ded55da/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-02-22_14.32.15.png)

スパン単位で処理時間やエラーの発生有無などの情報を収集することで、どの部分がボトルネックとなっているかを特定することができます。

## Prisma を使用したプロジェクトを作成する

ここからは実際に Prisma で OpenTelemetry のトレースデータを計装する手順を紹介します。まずは Prisma と Hono を使用した簡単な HTTP API を作成します。以下のコマンドで Hono のプロジェクトを作成します。

```sh
npm create hono@latest trace-example
cd trace-example
```

次に Prisma を使用してデータベースをセットアップします。まずは Prisma をインストールします。

```sh
npm install prisma @prisma/client
```

以下のコマンドで Prisma の初期化を行います。データベースプロバイダーには SQLite を使用します。

```sh
npx prisma init --datasource-provider sqlite
```

`prisma/schema.prisma` ファイルをにデータベースのスキーマを定義します。ここでは簡単に `Post` というテーブルを作成します。

```prisma:prisma/schema.prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

`npx prisma migrate dev` コマンドを実行してデータベースにテーブルを作成します。

```sh
npx prisma migrate dev --name init
```

`prisma/seed.ts` ファイルを作成してデータベースに初期データを投入するスクリプトを作成します。

```ts:prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.post.createMany({
    data: Array.from({ length: 10 }).map((_, i) => ({
      title: `Post ${i}`,
      content: `Content ${i}`,
    })),
  });
}

main()
  .then(async () => {
    console.log("Seed data has been created.")
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
```

以下のコマンドを実行してスクリプトを実行します。

```sh
npx tsx prisma/seed.ts
```

ここまでのセットアップが完了したら以下のコマンドでデータベースが正しく作成されているか確認します。

```sh
npx prisma studio
```

![](https://images.ctfassets.net/in6v9lxmm5c8/ux0lc0GfxnmdsdJkh4Vqs/fdd5cf0baa21834397170c81847bc588/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-02-22_11.29.09.png)

続いて Hono を使用して記事の一覧を取得するエンドポイントと、記事を作成するエンドポイントを作成します。`src/index.ts` ファイルを以下のように編集します。

```ts:src/index.ts
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";

const app = new Hono();
const prisma = new PrismaClient();

app.get("/posts", async (c) => {
  const posts = await prisma.post.findMany();
  return c.json(posts);
});

app.post("/posts", async (c) => {
  const { title, content } = await c.req.json();
  const post = await prisma.post.create({
    data: {
      title,
      content,
    },
  });
  return c.json(post, {
    status: 201,
  });
});

serve(
  {
    fetch: app.fetch,
    port: 3001,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
```

`npm run dev` コマンドを実行してサーバーを起動します。

```sh
npm run dev
```

`/posts` エンドポイントに GET リクエストを送信すると記事の一覧が取得できることを確認します。

```sh
curl http://localhost:3001/posts

[{"id":1,"title":"Post 0","content":"Content 0","createdAt":"2025-02-22T02:28:28.242Z", ...
```

## OpenTelemetry Collector を使用してトレースデータを収集する

プロジェクトのセットアップが完了したので、ここからは OpenTelemetry の計装を行う設定を実装していきます。まずは [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/) を使用してトレースデータを収集するための設定を行います。

OpenTelemetry のテレメトリーデータを Jaeger や Prometheus などの監視バックエンドに送信する際にアプリケーションのコードから直接送信することはできますが、この方法は柔軟性に欠けるため OpenTelemetry Collector を仲介して送信することが一般的です。

OpenTelemetry Collector は複数のアプリケーションからのテレメトリーデータを収集し、処理して、監視バックエンドに送信します。OpenTelemetry Collector を使用するとアプリケーションのコードを直接変更することなく、テレメトリーデータの送信先や処理方法を柔軟に変更することができます。

ここでは Docker で [local LGTM スタック](https://github.com/grafana/docker-otel-lgtm/tree/main?tab=readme-ov-file)（Prometheus, Grafana, Loki, Tempo）を使用して OpenTelemetry Collector と監視バックエンドサービスを立ち上げます。

```bash
docker run --name lgtm -p 3000:3000 -p 4317:4317 -p 4318:4318 --rm -ti \
	-v "$PWD"/lgtm/grafana:/data/grafana \
	-v "$PWD"/lgtm/prometheus:/data/prometheus \
	-v "$PWD"/lgtm/loki:/data/loki \
	-e GF_PATHS_DATA=/data/grafana \
	docker.io/grafana/otel-lgtm:0.8.1
```

http://localhost:3000 にアクセスすると Grafana のダッシュボードが表示されます。まだトレースデータを計装していないため何も表示されていません。トレースデータが表示できるようにアプリケーションのコードを変更していきます。

## Node.js アプリケーションに OpenTelemetry を導入する

OpenTelemetry ではプログラミング言語ごとに提供されている SDK を使用することで自動でテレメトリーデータを計装することができます。

まずは Node.js アプリケーションの計装に必要なパッケージをインストールします。

```sh
npm install @opentelemetry/sdk-node \
  @opentelemetry/auto-instrumentations-node \
  @opentelemetry/resources \
  @opentelemetry/exporter-trace-otlp-grpc \
  @opentelemetry/semantic-conventions \
  @prisma/instrumentation
```

以下のコードを `src/instrumentation.ts` ファイルに追加します。

```ts:src/instrumentation.ts
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter as GrpcTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import prisma from "@prisma/instrumentation";
import { Resource } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

const sdk = new NodeSDK({
  // resource はアプリケーションが実行されている環境に関する情報を提供する
  // ここではサービス名を指定している
  // 属性名は規約で定義されており、@opentelemetry/semantic-conventions パッケージの定数を使用する
  // https://opentelemetry.io/docs/languages/js/resources/
  resource: new Resource({
    [ATTR_SERVICE_NAME]: "hono-app",
  }),
  // トレースデータをエクスポートする宛先を指定する
  // 先ほど設定して OpenTelemetry Collector のエンドポイントを指定している
  traceExporter: new GrpcTraceExporter(),
  instrumentations: [
    // Node.js に関するテレメトリーデータを自動計装する
    getNodeAutoInstrumentations(),
    // Prisma に関するテレメトリーデータを計装する
    new prisma.PrismaInstrumentation(),
  ],
});

sdk.start();
```

`@prisma/instrumentation` パッケージは Prisma のクエリに関するテレメトリーデータを計装するためのパッケージです。Prisma のクエリに関するテレメトリーデータを計装するためには、Prisma クライアントの初期化時に Prisma の計装パッケージを使用する必要があります。`@prisma/instrumentation` パッケージを使用することで Prisma クライアントがデータベースに接続する時間やクエリの実行時間などのテレメトリーデータを計装することができます。

`@prisma/instrumentation` パッケージの `PrismaInstrumentation` を `instrumentations` に追加することで Prisma のクエリも計装されます。例として以下のような一連のスパンが軽装されます。

- `prisma:client:operation`：Prisma クライアントからデータベースへの操作全体を表す。以下の span がこのスパンの子スパンとして生成される。
  - `prisma:client:connect`：Prisma クライアントがデータベースに接続する時間
  - `prisma:client:serialize`：Prisma クライアントのオペレーションを DB クエリに変換する時間
  - `prisma:engine:query`：クエリエンジンによるクエリの実行時間
    - `prisma:engine:connection`：Prisma クライアントがデータベースに接続する時間
    - `prisma:engine:db_query`：データベースに対して実行された DB クエリの実行時間
    - `prisma:engine:serialize`：データベースから生の応答を Prisma クライアントのモデルに変換する時間
    - `prisma:engine:response_json_serialization`：データベースクエリの結果を Prisma クライアントへの JSON 応答に変換する時間

`instrumentation.ts` ファイルを `src/index.ts` ファイルでインポートして初期化します。計装の設定を初期化するコードはアプリケーションコードが実行される前に呼び出される必要があります。そのため、`instrumentation.ts` ファイルを `src/index.ts` ファイルの先頭でインポートします。

```ts:src/index.ts
import "./instrumentation";

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";

const app = new Hono();
```

アプリケーションコードの変更が完了したら、以下のコマンドでアプリケーションを再起動します。

```sh
npm run dev
```

`/posts` エンドポイントにいくつかリクエストを送信してみましょう。

```sh
curl http://localhost:3001/posts
```

## トレースデータを確認する

Grafana の [Explore](http://localhost:3000/explore) 画面でトレースデータが計装されているか確認しましょう。データソースに `Tempo` を選択します。

![](https://images.ctfassets.net/in6v9lxmm5c8/2n8ttpDiRCiHas4zAJLevy/055b2411ba53f4e4efd8532e81516711/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-02-22_14.19.22.png)

「Query type」の「Search」タブを選択すると、トレース一覧が表示されます。「Service」が `hono-app` であるトレースが今回のアプリケーションのトレースデータです。

![](https://images.ctfassets.net/in6v9lxmm5c8/14oMPgd1tRKcVuFwisLfxv/14c1c8c9040fb0f24b345cf04e3ce198/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-02-22_14.22.30.png)

トレース ID をクリックするとトレースの詳細を確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5qaBYbidQPBNEDvw6LIyhB/6515578819db9ef3e3849a87bd5db51d/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-02-22_14.23.40.png)

親スパン名や属性の情報から `/posts` エンドポイントに `GET` リクエストが送信され、`200` ステータスコードでレスポンスが返されたことがわかります。また Prisma のそれぞれのスパンでどれくらいの時間がかかったかも確認できます。このようなトレースデータを活用すれば、アプリケーションのパフォーマンスを可視化し、ボトルネックを特定することができます。

## まとめ

## 参考

- [OpenTelemetry tracing | Prisma Documentation](https://www.prisma.io/docs/orm/prisma-client/observability-and-logging/opentelemetry-tracing)
[Monitor Your Server with Tracing Using OpenTelemetry & Prisma](https://www.prisma.io/blog/tracing-tutorial-prisma-pmkddgq1lm2)