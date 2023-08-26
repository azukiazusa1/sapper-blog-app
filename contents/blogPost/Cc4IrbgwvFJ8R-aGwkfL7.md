---
id: Cc4IrbgwvFJ8R-aGwkfL7
title: "OpenTelemetry を使用して Node.js アプリケーションを計装する"
slug: "instrumenting-Node-js-applications-with-open-telemetry"
about: "OpenTelemetry は Observability のフレームワークであり、トレース・メトリクス・ログなどのテレメトリーデータを作成、管理するためのツールキットです。OpenTelemetry はベンダーに依存しない形で標準化されたプロトコルとツールを提供していることが特徴です。この記事では Node.js アプリケーションを計装して Prometheus にデータを送信する方法を紹介します。"
createdAt: "2023-08-26T17:38+09:00"
updatedAt: "2023-08-26T17:38+09:00"
tags: ["Node.js", "express", "OpenTelemetry", "Prometheus"]
thumbnail:
  url: "田植えのイラスト"
  title: "https://images.ctfassets.net/in6v9lxmm5c8/1qlV5YaQMXGezxdLlDOL2A/de11f74cbe267a54645fae315f27eae2/taue_18898-768x768.png"
published: true
---

OpenTelemetry は Observability のフレームワークであり、トレース・メトリクス・ログなどのテレメトリーデータを作成、管理するためのツールキットです。OpenTelemetry はベンダーに依存しない形で標準化されたプロトコルとツールを提供していることが特徴です。

https://opentelemetry.io/

従来は特定の監視ツールごとに異なるツールが提供されていたため、監視バックエンドを変更する場合にはアプリケーションのコードを書き換える必要がある、計装のためのライブラリなどもベンダーごとに別々に提供されているなど、互換性が低いという問題がありました。OpenTelemetry の仕様に準拠したライブラリを使用することで、アプリケーションのコードを書き換えることなく、監視バックエンドを変更することができます。

例えば 1 つのアプリケーションのメトリクスを収集するツールから、Prometheus, Jaeger, Datadog など複数のバックエンドに同時にテレメトリーデータを送信することが可能です。

また OpenTelemetry は現在活発に開発が進められているプロジェクトであり、様々な言語やフレームワークに対応したライブラリが提供されています。このように、この記事では、OpenTelemetry の Node.js 向けのライブラリを使用して、Node.js アプリケーションを計装する方法を紹介します。

## Node.js のアプリケーション

まずは計装の対象となるアプリケーションを作成します。ここでは、[Express](https://expressjs.com/) を使用して簡単な API サーバーを作成します。

```sh
npm init -y
npm install express
```

`main.js` というファイルを作成して、下記のようなコードを記述します。

```js:main.js
import express from "express";
await import("./instrumentation.js");

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.get("/dice", (req, res) => {
  const diceRoll = Math.floor(Math.random() * 6) + 1;
  res.json({ diceRoll });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
```

ESModule を使用しているため、`package.json` に下記のような設定を追加します。

```json
{
  "type": "module"
}
```

以下のコマンドでアプリケーションを起動します。

```sh
node main.js
```

`http://localhost:3000` にアクセスすると、`{ message: "Hello World" }` という JSON が返ってくることが確認できます。

```
curl localhost:3000
{"message":"Hello World"}
```

### OpenTelemetry のライブラリをインストールする

OpenTelemetry の Node.js 向けのライブラリをインストールします。OpenTelemetry ではアプリケーションの計装を行う方法として次の 2 つの方法が提供されています。

- 自動計測：[@opentelemetry/sdk-trace-node](https://github.com/open-telemetry/opentelemetry-js/tree/main/packages/opentelemetry-sdk-trace-node) SDK を使用して、アプリケーションの計装を自動的に行う方法
- 手動トレース：必要なトレース情報を開発者が明示的に記述する方法

この記事では、自動計測の方法を使用してアプリケーションの計装を行います。以下のライブラリをインストールします。

```sh
npm install @opentelemetry/sdk-node @opentelemetry/api @opentelemetry/auto-instrumentations-node @opentelemetry/sdk-metrics @opentelemetry/instrumentation-http @opentelemetry/instrumentation-express
```

`instrumentation.js` というファイルを作成して、下記のようなコードを記述します。

```js:instrumentation.js
import { NodeSDK } from "@opentelemetry/sdk-node";
import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
} from "@opentelemetry/sdk-metrics";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";

const sdk = new NodeSDK({
  traceExporter: new ConsoleSpanExporter(),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new ConsoleMetricExporter(),
  }),
  instrumentations: [
    getNodeAutoInstrumentations(),
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
  ],
});

sdk.start();
```

instrumentation をセットアップするコードは必ずアプリケーションが起動する前に実行される必要があります。そのため、`main.js` では `dynamic import` でモジュールを読み込んで確実に `instrumentation.js` が実行されてからアプリケーションを起動するようにします。

```diff:main.js
  import express from "express";
+ await import("./instrumentation.js");

  const app = express();
```

一度アプリケーションを終了してから、以下のコマンドでアプリケーションを起動します。

```sh
node main.js
```

`http://localhost:3000` にアクセスしてみると、ターミナルに下記のようなログが出力されていることが確認できます。

```sh
{
  descriptor: {
    name: 'http.server.duration',
    type: 'HISTOGRAM',
    description: 'Measures the duration of inbound HTTP requests.',
    unit: 'ms',
    valueType: 1
  },
  dataPointType: 0,
  dataPoints: []
}
{
  descriptor: {
    name: 'http.client.duration',
    type: 'HISTOGRAM',
    description: 'Measures the duration of outbound HTTP requests.',
    unit: 'ms',
    valueType: 1
  },
  dataPointType: 0,
  dataPoints: []
}
```

OpenTelemetry により、HTTP リクエストの処理時間を計測するメトリクスが自動的に計測されていることが確認できます。

## テレメトリーデータをエクスポートする

上記の例ではエクスポーターとして `ConsoleMetricExporter` を使用したので、計測したメトリクスはターミナルに出力されます。しかし、実際には計装したデータは Prometheus や Jaeger などの監視バックエンドに送信する必要があるでしょう。ここでは、[Prometheus](https://prometheus.io/) にデータを送信する方法を紹介します。

### エクスポーターのインストール

[@opentelemetry/exporter-prometheus](https://www.npmjs.com/package/@opentelemetry/exporter-prometheus) と呼ばれるエクスポーターを使用すると、Node.js のアプリケーションから直接 Prometheus にデータを送信できます。しかし、OpenTelemetry のプラクティスでは、アプリケーションから直接監視バックエンドにデータを送信するのではなく、[OpenTelemetry Collector](https://opentelemetry.io/docs/collector/) というプロセスを介してデータを送信することを推奨しています。

OpenTelemetry Collector は、複数のアプリケーションから収集したデータを一元的に管理するためのプロセスです。OpenTelemetry Collector は、受け取ったデータを加工して、複数の監視バックエンドにデータを送信することができます。

![Collector の流れを表した図形。OTLP から Receivers に線が引かれている。Receivers からは Batch, ..., Attributes または Batch, ..., Filter の経路で Exporters に線が引かれている。Receivers と Exporters の間には Extensions: health, pprof, zpages と Processors がある。Exporters からは OTLP, Jaeger, Prometheus に線が引かれている。](https://images.ctfassets.net/in6v9lxmm5c8/3mLjNbLV5TA5NvdVP9Ltip/d0ccc55d719f2ac633f2ec64d763bec5/otel-collector.svg)

OpenTelemetry Collector を使用することで、以下のメリットがあります。

> - 使いやすさ：適度なデフォルト設定、一般的なプロトコルをサポート、箱から出してすぐに実行、収集できる。
> - パフォーマンス：様々な負荷や設定の下で高い安定性とパフォーマンス。
> - 観測可能性：観測可能なサービスの模範。
> - 拡張性：コアコードに触れることなくカスタマイズ可能。
> - 統一性：単一のコードベース、エージェントまたはコレクターとしてデプロイ可能、トレース、メトリクス、ログをサポート（将来）。

https://opentelemetry.io/docs/collector/#objectives を翻訳。

OpenTelemetry Collector を使用するため、OTLP というプロトコルでデータを送信するためのエクスポーターをインストールします。

```sh
npm install --save @opentelemetry/exporter-metrics-otlp-grpc @opentelemetry/exporter-trace-otlp-grpc
```

新たにインストールしたエクスポーターを使用するように `instrumentation.js` を修正します。`ConsoleExporter` はもう使わないので削除しましょう。

```diff:instrumentation.js
  import { NodeSDK } from "@opentelemetry/sdk-node";
- import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace-node";
  import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
  import {
    PeriodicExportingMetricReader,
-   ConsoleMetricExporter,
  } from "@opentelemetry/sdk-metrics";
  import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
  import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";
+ import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
+ import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-grpc";

  const sdk = new NodeSDK({
-   traceExporter: new ConsoleSpanExporter(),
+   traceExporter: new OTLPTraceExporter(),
    metricReader: new PeriodicExportingMetricReader({
-     exporter: new ConsoleMetricExporter(),
+     exporter: new OTLPMetricExporter(),
    }),
    instrumentations: [
      getNodeAutoInstrumentations(),
      new HttpInstrumentation(),
      new ExpressInstrumentation(),
    ],
  });

  sdk.start();
```

さらに、わかりやすいメトリクスを計測するために、手動でメトリクスを計測するコードを追加してみましょう。`/dice` エンドポイントにアクセスすると、1 から 6 までのランダムな数値が返ってくるようになっています。、サイコロの目が何回出たかをカウントするメトリクスを計測してみましょう。

独自のカウンタを生成するために、以下のコードを `counter.js` というファイルに記述します。

```js:counter.js
import {
  PeriodicExportingMetricReader,
  MeterProvider,
} from "@opentelemetry/sdk-metrics";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-grpc";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { Resource } from "@opentelemetry/resources";

const meterProvider = new MeterProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "basic-metric-service",
  }),
});

meterProvider.addMetricReader(
  new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter(),
    exportIntervalMillis: 1000,
  })
);

const meter = meterProvider.getMeter("example-exporter-collector");

export const diceRollCounter = meter.createCounter("dice", {
  description: "Dice roll counter",
});
```

`app.get("/dice")` 内で `diceRollCounter.add()` を呼び出すように修正します。`diceRollCounter.add()` を呼び出すたびに任意の数だけカウントが増えていきます。また、第 2 引数でラベルを指定することができます。ここでは、サイコロの目と環境をラベルとして指定しています。

````diff:main.js
  import express from "express";
  await import("./instrumentation.js");
+ import { diceRollCounter } from "./counter.js";

  const app = express();

  // ...

  app.get("/dice", (req, res) => {
    const diceRoll = Math.floor(Math.random() * 6) + 1;
+   diceRollCounter.add(1, {
+     environment: "staging",
+     diceRoll,
    });

    res.json({ diceRoll });
  });


コードの編集が完了したら、アプリケーションを再起動します。

```sh
node main.js
````

### OpenTelemetry Collector の設定

先程述べた通り OpenTelemetry Collector を使用するので、OpenTelemetry Collector を起動します。ここでは [opentelemetry-collector-contrib](https://github.com/open-telemetry/opentelemetry-collector-contrib) を使用します。これは公式が提供しているディストリビューションで、多くのプラグインがはじめから同梱されているのが特徴です。

そのため、テスト用のアプリケーションでとりあえず試してみるのであれば、このディストリビューションを使用するのが便利です。しかし、本番環境で使用する場合は、必要なプラグインだけを選択してカスタマイズしたディストリビューションを作成することを推奨します。使わないプラグインが多く含まれているとイメージのサイズが大きくなりますし、セキュリティ上のリスクも高まるためです。

OpenTelemetry Collector は YAML 形式の設定ファイルを使用して設定を行います。OpenTelemetry Collector の設定は以下の 4 つのコンポーネントから構成されています。

- Receivers：データを受け取る
- Processors：データを加工する
- Exporters：データを送信する
- Connectors：2 つのパイプラインを接続する

上記のコンポーネントを定義した後に、`service` セクションの `pipelines` でパイプラインを構築することで設定が有効になります。上記の 4 つのコンポーネントの他に、コレクタに機能を追加する `extensions` というセクションもあります。

`otel-collector-config.yaml` というファイルを作成して、下記のような設定を記述します。

```yaml:config.yaml
receivers:
  otlp:
    protocols:
      grpc:

processors:
  batch:

exporters:
  prometheus:
    endpoint: "0.0.0.0:8889"

service:
  pipelines:
    extensions: ["health_check"]
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [prometheus]
```

### OpenTelemetry Collector を起動する

OpenTelemetry Collector を起動します。ここでは、[Docker Compose](https://docs.docker.com/compose/) を使用して、OpenTelemetry Collector と Prometheus を起動します。

```yaml
version: "2"
services:
  # Collector
  otel-collector:
    image: otel/opentelemetry-collector-contrib
    restart: always
    command: ["--config=/etc/otel-collector-config.yaml"]
    volumes:
      - ./otel-collector-config.yaml:/etc/otel-collector-config.yaml
    ports:
      - "8888:8888" # Prometheus metrics exposed by the collector
      - "8889:8889" # Prometheus exporter metrics
      - "13133:13133" # health_check extension
      - "4317:4317" # OTLP gRPC receiver
      - "4318:4318" # OTLP HTTP receiver

  prometheus:
    container_name: prometheus
    image: prom/prometheus:latest
    restart: always
    volumes:
      - ./prometheus.yaml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"
```

Prometheus の設定ファイルである `prometheus.yaml` ファイルを作成しておきましょう。

```yaml:prometheus.yml
scrape_configs:
  - job_name: 'otel-collector'
    scrape_interval: 10s
    static_configs:
      - targets: ['otel-collector:8889']
      - targets: ['otel-collector:8888']
```

以下のコマンドで OpenTelemetry Collector と Prometheus を起動します。

```sh
docker-compose up -d
```

http://localhost:9090 にアクセスすると、Prometheus のダッシュボードが表示されます。はじめは OpenTelemetry Collector 自身のメトリクスがいくつか表示されるはずです。アプリケーションのメトリクスを計測するために、http://localhost:3000/dice に何度かアクセスしてみましょう。

少し待ってから再度 Prometheus のダッシュボードを確認すると `dice` というメトリクスが存在することがわかります。

![Prometheus のダッシュボードのスクリーンショット。検索欄には「dice」と入力されている。](https://images.ctfassets.net/in6v9lxmm5c8/4RHldXFMAQ5weposVDYGpJ/688bcd4297f37c5478fb673856eb94fa/__________2023-08-26_22.41.19.png)

## 参考

- [Node.js | OpenTelemetry](https://opentelemetry.io/docs/instrumentation/js/getting-started/nodejs/)
- [Node.js と OpenTelemetry  |  Cloud Trace  |  Google Cloud](https://cloud.google.com/trace/docs/setup/nodejs-ot?hl=ja)
  [Node.jsをOpenTelemetryでメトリック収集してみる - Qiita](https://qiita.com/raichi/items/d371bf3fe6ddec168725)
