---
id: qWmGDrsYXcgNf7POZK0ji
title: "Hono のログを Pino と OpenTelemetry で計装する"
slug: "instrument-hono-logs-with-opentelemetry"
about: "OpenTelemetry を使用すると、アプリケーションのログをベンダーに依存しない形式で収集し、トレースと関連付けることができます。この記事では Node.js で動作する Hono バックエンドの構造化ログを Pino で出力し、OpenTelemetry Collector を通じて Loki と Tempo に送信する方法を紹介します。"
createdAt: "2026-08-02T11:43+09:00"
updatedAt: "2026-08-02T11:43+09:00"
tags: ["Hono", "OpenTelemetry", "Node.js"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1Ra4GMG4ydHHw0PNq7zyuH/126e30649a6ed34fb8da14ac847069de/fast-food-takeout_15179-768x768.png"
  title: "ファストフードのテイクアウトのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Pino Instrumentation が行う処理として、記事の説明と一致するものはどれですか?"
      answers:
        - text: "Pino のログをメトリクスへ変換し、Prometheus に送信する"
          correct: false
          explanation: "記事ではメトリクスへの変換を扱っていません。Pino のログは OpenTelemetry LogRecord として Logs SDK に渡されます。"
        - text: "Pino のログを Logs SDK に渡し、アクティブなスパンの相関情報を追加する"
          correct: true
          explanation: "記事で説明している通り、Log sending と Log correlation の 2 つが Pino Instrumentation の主な役割です。"
        - text: "Pino の標準出力を無効にし、ログを Tempo だけに保存する"
          correct: false
          explanation: "Pino の JSON ログは標準出力に残ります。ログの監視バックエンドには Loki を使用しています。"
        - text: "Hono のルート定義を解析し、HTTP スパンを自動で作成する"
          correct: false
          explanation: "HTTP スパンを作成する役割は HttpInstrumentation です。Pino Instrumentation はログを対象とします。"
published: true
---

[OpenTelemetry](https://opentelemetry.io/) は、トレース・メトリクス・ログといったテレメトリーデータを作成、収集、エクスポートするためのオブザーバビリティフレームワークです。ベンダーに依存しない API、SDK、プロトコルを提供しており、アプリケーションの実装と監視バックエンドを分離できることが特徴です。

OpenTelemetry は分散トレーシングの文脈でよく知られていますが、ログを表現するための[データモデル](https://opentelemetry.io/docs/specs/otel/logs/data-model/)も定義されています。アプリケーションのログを OpenTelemetry の形式で送信すると、ログに現在のスパンの Trace ID と Span ID を付与できます。これにより、エラーログから関連するトレースを開き、どの処理で問題が発生したのか調査できます。

この記事では Node.js で動作する [Hono](https://hono.dev/) バックエンドで [Pino](https://getpino.io/) を使って構造化ログを出力します。ログとトレースは OTLP（OpenTelemetry Protocol）を使って OpenTelemetry Collector に送信し、ログを Grafana Loki、トレースを Grafana Tempo で確認します。

```txt
Hono + Pino
  ├── Logs   ── OTLP/HTTP ──┐
  └── Traces ── OTLP/HTTP ──┘
                            ▼
                 OpenTelemetry Collector
                   ├── Loki（ログ）
                   └── Tempo（トレース）
                            ▼
                         Grafana
```

:::info
2026 年 8 月現在、OpenTelemetry JavaScript では Traces と Metrics が Stable である一方、Logs は Development とされています。Logs に関する API は今後変更される可能性があるため、実際のプロダクトで利用する場合は[最新の対応状況](https://opentelemetry.io/docs/languages/js/)を確認してください。
:::

## 既存のライブラリを使用して OpenTelemetry へログを送信する

OpenTelemetry には、既存のライブラリやフレームワークからテレメトリを自動生成する [Instrumentation Library](https://opentelemetry.io/docs/languages/js/libraries/) があるため、既存のコードを大きく書き換えずに OpenTelemetry へログを送信できます。Pino では [`@opentelemetry/instrumentation-pino`](https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/packages/instrumentation-pino) パッケージが提供されており、以下の 2 つの機能を追加します。

- Log sending：Pino のログを OpenTelemetry Logs SDK に渡す
- Log correlation：アクティブなスパンの `trace_id`、`span_id`、`trace_flags` を Pino のログへ追加する

Pino はこれまでどおり JSON を標準出力へ書き出します。それに加えて Pino Instrumentation が同じログイベントを OpenTelemetry Logs SDK に渡し、エクスポーターが OpenTelemetry Collector へ送信します。

アプリケーションのコードでは、Trace ID や Span ID を `logger.info()` へ明示的に渡していません。HTTP Instrumentation がリクエストのスパンを作成し、処理中の OpenTelemetry Context へアクティブなスパンとして設定します。`Pino Instrumentation` は `logger.info()` などの呼び出しを計装し、その時点のアクティブなスパンから Trace ID と Span ID を取得します。

```ts
tracer.startActiveSpan("userRepository.findById", async (span) => {
  // この時点では span がアクティブ
  logger.info("finding user");
  // Pino Instrumentation が span の Trace ID・Span ID を自動付与
});
```

## Hono プロジェクトを作成する

ここからは実際にサンプルアプリケーションを実装していきます。`create-hono` コマンドで Node.js 向けのプロジェクトを作成します。

```bash
npm create hono@latest hono-otel-logs -- --template nodejs --install --pm npm
cd hono-otel-logs
```

続いて Pino と OpenTelemetry のパッケージをインストールします。すべての Node.js 向け計装を含む `@opentelemetry/auto-instrumentations-node` は使用せず、HTTP と Pino の計装のみを個別にインストールします。

```bash
npm install \
  pino@10.3.1 \
  @opentelemetry/api@1.9.1 \
  @opentelemetry/sdk-node@0.221.0 \
  @opentelemetry/sdk-logs@0.221.0 \
  @opentelemetry/instrumentation@0.221.0 \
  @opentelemetry/instrumentation-http@0.221.0 \
  @opentelemetry/instrumentation-pino@0.67.0 \
  @opentelemetry/exporter-trace-otlp-proto@0.221.0 \
  @opentelemetry/exporter-logs-otlp-proto@0.221.0
```

## OpenTelemetry SDK を設定する

`src/instrumentation.ts` ファイルを作成し、OpenTelemetry SDK を初期化します。

```ts:src/instrumentation.ts
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-proto";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { PinoInstrumentation } from "@opentelemetry/instrumentation-pino";
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { NodeSDK } from "@opentelemetry/sdk-node";

// トレースとログを OTLP/HTTP で Collector へ送信する
const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter(),
  logRecordProcessors: [
    new BatchLogRecordProcessor({
      exporter: new OTLPLogExporter(),
    }),
  ],
  // 必要なライブラリだけを個別に計装する
  instrumentations: [
    new HttpInstrumentation(),
    new PinoInstrumentation(),
  ],
});

sdk.start();

export const shutdownTelemetry = () => sdk.shutdown();
```

`OTLPTraceExporter` と `OTLPLogExporter` は、それぞれトレースとログを OTLP/HTTP で送信するエクスポーターです。送信先をコンストラクターへ直接指定していないため、後ほど設定する `OTEL_EXPORTER_OTLP_ENDPOINT` 環境変数が使用されます。シグナルごとのパスは自動で補われ、トレースは `/v1/traces`、ログは `/v1/logs` に送信されます。

`BatchLogRecordProcessor` はログをバッファリングし、一定数（既定では 512 件）に達したときか、一定時間（既定では 1 秒）が経過したときにまとめてエクスポートします。アプリケーションの処理をログの送信完了まで待たせないため、本番環境では通常 `SimpleLogRecordProcessor` ではなくバッチ処理を使用します。

`instrumentations` には `HttpInstrumentation` と `PinoInstrumentation` のみを登録しています。`HttpInstrumentation` は Hono の背後で動作する Node.js の HTTP サーバーを計装してリクエストごとのスパンを作成します。`PinoInstrumentation` は Pino のログを送信し、トレースコンテキストを注入します。

`PinoInstrumentation` は `disableLogSending` と `disableLogCorrelation` オプションで、Log sending と Log correlation を個別に無効化できます。既存のログ収集基盤をそのまま使い、トレースコンテキストの付与だけを追加するといった使い分けもできます。

## Pino で構造化ログを出力する

`src/logger.ts` ファイルで Pino のロガーを作成します。

```ts:src/logger.ts
import pino from "pino";

export const logger = pino({
  // 環境変数がなければ info 以上のログを出力する
  level: process.env.LOG_LEVEL ?? "info",
});
```

Pino ではログメッセージだけでなく、オブジェクトを第 1 引数に渡すことで任意の属性を JSON として出力できます。ここで渡した属性は OpenTelemetry の LogRecord の属性としても送信されます。たとえばユーザー ID を属性として渡す場合は以下のようにします。

```ts
logger.info({ "app.user.id": "1" }, "finding user");
```

標準化されている属性には、可能な限り [OpenTelemetry Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/) の名前を使用します。共通の名前と値を使うことで、言語やライブラリごとに異なる名前がつけられるのを避けられます。複数のサービスから集めたテレメトリーも同じ意味で検索・集計でき、クエリやダッシュボードを再利用しやすくなります。

たとえば HTTP メソッドには `http.request.method`、マッチしたルートには `http.route`、リクエストパスには `url.path`、レスポンスのステータスコードには `http.response.status_code`、サービス名には `service.name` を使用します。一方、ユーザー ID や処理時間など、アプリケーション固有の属性には `app.user.id` や `app.duration_ms` のように `app.*` という名前空間を使用します。

## アプリケーションログとカスタムスパンを実装する

データベースからユーザーを取得する処理を模した `findUserById()` 関数を `src/userRepository.ts` に実装します。データベースの取得前後に `finding user`、`user found`、`user not found` などのログを出力し、例外が発生した場合には `failed to find user` ログを出力します。それぞれのログにはユーザー ID を属性として渡します。

```ts:src/userRepository.ts
import { SpanStatusCode, trace } from "@opentelemetry/api";
import { setTimeout } from "node:timers/promises";
import { logger } from "./logger.js";

type User = {
  id: string;
  name: string;
};

const users = new Map<string, User>([
  ["1", { id: "1", name: "Alice" }],
]);
const tracer = trace.getTracer("user-repository");

export const findUserById = (id: string) =>
  // 現在アクティブな HTTP スパンが親として使用される
  tracer.startActiveSpan("userRepository.findById", async (span) => {
    span.setAttribute("app.user.id", id);

    try {
      logger.info({ "app.user.id": id }, "finding user");
      // データベースアクセスにかかる時間を再現する
      await setTimeout(50);

      if (id === "error") {
        throw new Error("database is unavailable");
      }

      const user = users.get(id);
      if (!user) {
        logger.warn({ "app.user.id": id }, "user not found");
        return undefined;
      }

      logger.info({ "app.user.id": id }, "user found");
      return user;
    } catch (error) {
      const exception =
        error instanceof Error ? error : new Error(String(error));

      // 例外の内容とエラーステータスをスパンに記録する
      span.recordException(exception);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: exception.message,
      });
      logger.error(
        { err: exception, "app.user.id": id },
        "failed to find user",
      );
      throw exception;
    } finally {
      span.end();
    }
  });
```

`trace.getTracer()` で Tracer を取得し、`startActiveSpan()` で `userRepository.findById` という子スパンを作成しています。親 Span は通常、現在の OpenTelemetry Context から決まります。ここでは HTTP Instrumentation が作成した HTTP リクエストのスパンが親として使用されます。親子スパンは子スパンの `parent_span_id` 属性で関連付けられます。

```sh
GET /users/:id              ← 親：HTTPスパン
└── userRepository.findById ← 子：アプリケーションスパン
```

このコールバック内で出力したログには、子スパンの Trace ID と Span ID が自動で追加されます。

例外が発生した場合には、`recordException()` でスパンに例外イベントを記録し、`setStatus()` でスパンのステータスをエラーに設定します。Pino に `err` プロパティとして `Error` オブジェクトを渡すと、エラーの種類、メッセージ、スタックトレースが構造化されて出力されます。

## Hono のリクエストログを実装する

続いて Hono のルーティングを実装し、HTTP リクエストのログを出力します。`src/index.ts` を以下のように書き換え、以下の GET エンドポイントを実装します。

- `/users/:id`：ユーザーを取得する。存在しない ID の場合は 404 を返し `warn` ログを出力する。
- `/users/error`：`error` という ID を指定した場合は例外を発生させる。500 を返し `error` ログを出力する。

```ts:src/index.ts
import { serve } from "@hono/node-server";
import { trace } from "@opentelemetry/api";
import { Hono } from "hono";
import { routePath } from "hono/route";
import { shutdownTelemetry } from "./instrumentation.js";
import { logger } from "./logger.js";
import { findUserById } from "./userRepository.js";

const app = new Hono();

// "*" はすべてのリクエストにマッチするワイルドカード
// レスポンスの完了後にリクエストログを 1 件出力する
app.use("*", async (c, next) => {
  const startedAt = performance.now();

  await next();

  // 最後にマッチしたエンドポイントのルートを取得する
  const route = routePath(c, -1);
  const span = trace.getActiveSpan();
  span?.setAttribute("http.route", route);
  span?.updateName(`${c.req.method} ${route}`);

  const attributes = {
    "http.request.method": c.req.method,
    "http.route": route,
    "url.path": c.req.path,
    "http.response.status_code": c.res.status,
    "app.duration_ms": performance.now() - startedAt,
  };

  // HTTP ステータスコードに応じてログレベルを切り替える
  if (c.res.status >= 500) {
    logger.error(attributes, "request completed");
  } else if (c.res.status >= 400) {
    logger.warn(attributes, "request completed");
  } else {
    logger.info(attributes, "request completed");
  }
});

app.get("/users/:id", async (c) => {
  const user = await findUserById(c.req.param("id"));

  if (!user) {
    return c.json({ message: "User not found" }, 404);
  }

  return c.json(user);
});

app.onError((_error, c) => {
  return c.json({ message: "Internal Server Error" }, 500);
});

const server = serve(
  {
    fetch: app.fetch,
    port: 3001,
  },
  (info) => {
    logger.info({ port: info.port }, "server started");
  },
);

// graceful shutdown
const shutdown = (signal: NodeJS.Signals) => {
  logger.info({ signal }, "shutting down");
  server.close(async () => {
    // バッファに残っているログとトレースを送信して終了する
    await shutdownTelemetry();
    process.exit(0);
  });
};

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
```

リクエストログはレスポンスが完了した時点で出力します。HTTP メソッド, ルート. URL パス, ステータスコード, 処理時間を個別の属性として渡しているため、Loki 上で値を使ってログを絞り込めます。例えば `app_duration_ms > 100` のように処理時間が 100ms を超えるリクエストのログだけを検索するといったことも可能です（Loki では属性名のピリオドがアンダースコアへ変換されます）。ログレベルは 2xx・3xx を `info`、4xx を `warn`、5xx を `error` としています。

なお Grafana が 3000 番ポートを使用するため、Hono のポートはテンプレートの既定値から 3001 へ変更しています。

HTTP Instrumentation は Hono のルーティングを認識しないため、自動計装だけではスパン名が `GET` のようになります。これでは異なる GET エンドポイントをスパン名で区別できません。[HTTP の Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/http/http-spans/#name) では、ルートのようなカーディナリティの低い対象が利用できる場合、HTTP サーバースパンの名前を `{method} {target}` とすることが推奨されています。

そこでミドルウェアの処理が完了した後に `routePath(c, -1)` を使って最後にマッチしたルートを取得し、`http.route` 属性を設定します。さらに `updateName()` でスパン名を `GET /users/:id` へ更新します。これにより `/users/1` と `/users/unknown` は同じルートの処理として集計でき、エンドポイントごとの検索や比較もしやすくなります。実際のパスをスパン名に使うと、ユーザー ID ごとに異なるスパン名が作られてしまいます。

終了時には HTTP サーバーを閉じてから `sdk.shutdown()` を呼び出します。`BatchLogRecordProcessor` やトレースエクスポーターのバッファに残っているデータを送信してからプロセスを終了するためです。

## OpenTelemetry SDK をアプリケーションより先に初期化する

Pino Instrumentation は、Pino モジュールが読み込まれるときに処理を差し込み、ログ送信とトレースコンテキストの注入を追加します。そのため、アプリケーションが Pino を読み込むより先に OpenTelemetry SDK を初期化し、Instrumentation を登録する必要があります。[OpenTelemetry の Node.js 向けガイド](https://opentelemetry.io/docs/languages/js/getting-started/nodejs/#instrumentation)でも、Instrumentation の設定をアプリケーションコードより先に実行するよう説明されています。

このサンプルは ES Modules を使用しているため、モジュールの読み込みへ処理を差し込む[ESM 用のローダーフック](https://github.com/open-telemetry/opentelemetry-js/blob/main/doc/esm-support.md)も必要です。

`package.json` のスクリプトを以下のように変更します。

```json:package.json
{
  "scripts": {
    "dev": "node --experimental-loader=@opentelemetry/instrumentation/hook.mjs --import tsx --import ./src/instrumentation.ts --watch src/index.ts",
    "build": "tsc",
    "start": "node --experimental-loader=@opentelemetry/instrumentation/hook.mjs --import ./dist/instrumentation.js dist/index.js"
  }
}
```

`--import ./src/instrumentation.ts` により、アプリケーション本体より先に OpenTelemetry SDK を初期化します。`--experimental-loader=@opentelemetry/instrumentation/hook.mjs` は ES Modules として読み込まれる HTTP や Pino を計装するためのフックです。

:::warning
Node.js 20.6 以降で `--experimental-loader` を使用すると、以下のように「将来削除される可能性がある」という警告が表示されます。動作に影響はありませんが、代わりに `node:module` の `register()` を使う方法も案内されています。

```
(node:12345) ExperimentalWarning: `--experimental-loader` may be removed in the future; instead use `register()`:
--import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("%40opentelemetry/instrumentation/hook.mjs", pathToFileURL("./"));'
```
:::

## OpenTelemetry Collector と監視バックエンドを起動する

ログとトレースを受信する環境を用意します。ここでは開発・デモ・テスト向けに OpenTelemetry Collector、Loki、Tempo、Grafana などを 1 つのコンテナにまとめた [`grafana/otel-lgtm`](https://github.com/grafana/docker-otel-lgtm) を使用します。

```bash
docker run --rm \
  --name otel-lgtm \
  -p 3000:3000 \
  -p 4317:4317 \
  -p 4318:4318 \
  grafana/otel-lgtm:0.29.2
```

:::info
`grafana/otel-lgtm` は開発・デモ・テスト向けのイメージです。本番環境向けの構成ではない点に注意してください。
:::

`grafana/otel-lgtm` に組み込まれている OpenTelemetry Collector の設定は以下のようになっています。OTLP Receiver が 4317（gRPC）と 4318（HTTP）で待ち受け、トレースを Tempo、ログを Loki へ送信します。

```yaml:otelcol-config.yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

processors:
  # データをまとめてバックエンドへ送信する
  batch:

exporters:
  # トレースを Tempo へ送信する
  otlphttp/traces:
    endpoint: http://127.0.0.1:4418
    tls:
      insecure: true

  # ログを Loki へ送信する
  otlphttp/logs:
    endpoint: http://127.0.0.1:3100/otlp
    tls:
      insecure: true

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlphttp/traces]

    logs:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlphttp/logs]
```

## Hono アプリケーションを起動してログを送信する

ここまでの準備が整ったら、実際に Hono アプリケーションにリクエストを送信してログとトレースを送信してみましょう。

OpenTelemetry の計装のために必要な環境変数を設定して Hono アプリケーションを起動します。

```bash
OTEL_SERVICE_NAME=hono-api \
OTEL_EXPORTER_OTLP_ENDPOINT=http://127.0.0.1:4318 \
OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf \
npm run dev
```

`OTEL_SERVICE_NAME` は、ログとトレースの Resource に共通の `service.name` を設定します。`OTEL_EXPORTER_OTLP_ENDPOINT` には OpenTelemetry Collector の OTLP/HTTP エンドポイントを指定します。

別のターミナルから、正常、404、例外の 3 種類のリクエストをいくつか送信してみましょう。

```bash
curl -i http://127.0.0.1:3001/users/1
curl -i http://127.0.0.1:3001/users/unknown
curl -i http://127.0.0.1:3001/users/error
```

標準出力では、以下のような Pino の JSON ログを確認できます。`/users/error` へのリクエストで出力される 2 件のログを、見やすいように整形して並べています。

```json
{
  "level": 50,
  "time": 1785644315215,
  "pid": 86258,
  "hostname": "localhost",
  "trace_id": "631f628fcedda17b3ddfdb209c5dbade",
  "span_id": "17e6f76c36eaf37a",
  "trace_flags": "01",
  "err": {
    "type": "Error",
    "message": "database is unavailable",
    "stack": "Error: database is unavailable\n    at <anonymous> (/app/src/userRepository.ts:19:15)\n    ..."
  },
  "app.user.id": "error",
  "msg": "failed to find user"
}
{
  "level": 50,
  "time": 1785644315215,
  "pid": 86258,
  "hostname": "localhost",
  "trace_id": "631f628fcedda17b3ddfdb209c5dbade",
  "span_id": "34e27910106cc378",
  "trace_flags": "01",
  "http.request.method": "GET",
  "http.route": "/users/:id",
  "url.path": "/users/error",
  "http.response.status_code": 500,
  "app.duration_ms": 53.476,
  "msg": "request completed"
}
```

`err` プロパティに渡した `Error` オブジェクトが、`type`・`message`・`stack` に分解されて出力されている点にも注目してください。

`failed to find user` ログの Span ID（`17e6f76c...`）は `userRepository.findById` の子スパンを指します。一方、同じリクエストの `request completed` ログには親となる HTTP スパンの Span ID（`34e27910...`）が設定されます。両者の Trace ID は共通（`631f628f...`）なので、1 つのリクエストで発生したログをまとめて検索できます。

## Grafana でログを確認する

送信されたログは Grafana から確認できます。Grafana ではログを UI 上で検索・絞り込み・集計できるほか、[Loki の LogQL](https://grafana.com/docs/loki/latest/logql/) を使ったクエリでも検索できます。

ブラウザで http://127.0.0.1:3000 にアクセスします。初期ユーザー名とパスワードはともに `admin` です。左側のメニューから「Drilldown」→「Logs」を開き、`service_name` が `hono-api` のログを選択します。

![](https://images.ctfassets.net/in6v9lxmm5c8/hGZr6tsdfLj1OrUEnRZcr/f76bcb8633b90acb872a7a2dcd721f17/image.png)

Pino に渡した `http.request.method` や `app.user.id` といった属性は、Loki では `http_request_method`、`app_user_id` のようにピリオドがアンダースコアへ変換されて表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/DqKJgueIIpIGAh5vxhsh9/a3a3947c3c6bffd3769c399f2b3d95e1/image.png)

LogQL でエラーログだけを表示するには、次のように `detected_level` で絞り込みます。

```logql
{service_name="hono-api"} | detected_level = "error"
```

![](https://images.ctfassets.net/in6v9lxmm5c8/4GRKHTrWqFzEjh2ue8RPr5/fd6012a262abad8202de94a5a8c3882c/image.png)

## ログからトレースを開く

OpenTelemetry でログを送信する利点の 1 つは、ログをトレースと関連付けられることです。Pino Instrumentation はログの出力時にアクティブなスパンの Trace ID と Span ID を付与します。ログとトレースを同じ Trace ID で結び付けることで、エラーメッセージを確認するだけでなく、そのエラーが発生するまでにどの処理を通り、どのスパンで失敗したのかを続けて調査できます。

`failed to find user` ログを展開すると、`trace_id` の横に Tempo のトレースを開くリンクが表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/2byng9V4BYmSYrKVqup4as/f973b3af4562514d82eeb934c95dd4db/c0ce2815-e163-4729-a3bb-f7b07537781a.png)

トレースを開くと、`GET /users/:id` という HTTP スパンの子として `userRepository.findById` スパンが表示されます。子スパンはエラーステータスで、`database is unavailable` という例外イベントも記録されています。

![](https://images.ctfassets.net/in6v9lxmm5c8/6f1iON3lXUfgVDUzMuCelj/c030a75fd3efbb255e2a567e89f41630/image.png)

反対に Tempo のトレースから「Logs for this span」を選択すると、同じ Trace ID を持つ Loki のログを検索できます。トレースでレイテンシーや失敗した処理を特定した後に、その処理中に出力されたアプリケーションログを確認するという調査も可能です。

![](https://images.ctfassets.net/in6v9lxmm5c8/7meaziTdJVJv1oQImjaIpv/f4e3f239036618791b31bc8902df8a91/image.png)

:::note
ログとトレースは別々のシグナルとして送信されるため、ログに Trace ID が記録されていても、対応するトレースが必ず保存されているとは限りません。本番環境ではコストを抑えるためにトレースをサンプリングすることが一般的で、サンプリングされなかったリクエストのトレースは Tempo に保存されません。この場合、ログからトレースを開こうとしても該当するトレースが見つからないことがあります。
:::

## まとめ

- `@opentelemetry/instrumentation-pino` は Pino のログを OpenTelemetry Logs SDK へ渡し、アクティブなスパンの Trace ID と Span ID をログに追加する
- `HttpInstrumentation` で Hono の HTTP リクエストを自動計装し、`trace.getTracer()` でアプリケーション固有の子スパンを作成できる
- ログとトレースを OTLP/HTTP で OpenTelemetry Collector へ送信し、Loki と Tempo に保存できる
- 共通の Trace ID により、Grafana でログからトレース、トレースから関連ログの両方向に移動できる

## 参考

- [OpenTelemetry Logs](https://opentelemetry.io/docs/concepts/signals/logs/)
- [OpenTelemetry JavaScript](https://opentelemetry.io/docs/languages/js/)
- [OpenTelemetry instrumentation for Pino](https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/packages/instrumentation-pino)
- [Using instrumentation libraries](https://opentelemetry.io/docs/languages/js/libraries/)
- [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/)
- [docker-otel-lgtm](https://github.com/grafana/docker-otel-lgtm)
