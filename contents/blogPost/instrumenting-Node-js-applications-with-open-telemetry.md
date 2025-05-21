---
id: Cc4IrbgwvFJ8R-aGwkfL7
title: "OpenTelemetry を使用して Node.js アプリケーションを計装する"
slug: "instrumenting-Node-js-applications-with-open-telemetry"
about: "OpenTelemetry は Observability のフレームワークであり、トレース・メトリクス・ログなどのテレメトリーデータを作成、管理するためのツールキットです。OpenTelemetry はベンダーに依存しない形で標準化されたプロトコルとツールを提供していることが特徴です。この記事では Node.js アプリケーションを計装して Prometheus にデータを送信する方法を紹介します。"
createdAt: "2023-08-26T17:38+09:00"
updatedAt: "2023-08-26T17:38+09:00"
tags: ["", "", "OpenTelemetry", "Prometheus"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1qlV5YaQMXGezxdLlDOL2A/de11f74cbe267a54645fae315f27eae2/taue_18898-768x768.png"
  title: "田植えのイラスト"
audio: null
selfAssessment: null
published: true
---
OpenTelemetry は Observability のフレームワークであり、トレース・メトリクス・ログなどのテレメトリーデータを作成、管理するためのツールキットです。OpenTelemetry はベンダーに依存しない形で標準化されたプロトコルとツールを提供していることが特徴です。

https://opentelemetry.io/

従来は特定の監視ツールごとに異なるツールが提供されていたため、監視バックエンドを変更する場合にはアプリケーションのコードを書き換える必要がある、計装のためのライブラリなどもベンダーごとに別々に提供されているなど、互換性が低いという問題がありました。OpenTelemetry の仕様に準拠したライブラリを使用することで、アプリケーションのコードを書き換えることなく、監視バックエンドを変更できます。

例えば 1 つのアプリケーションのメトリクスを収集するツールから、Prometheus, Jaeger, Zipkin など複数のバックエンドに同時にテレメトリーデータの送信が可能です。

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

ESModule を使用しているため、`package.json` に `"type": "module"` を追加します。

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

- 自動計測：[@opentelemetry/sdk-trace-base](https://github.com/open-telemetry/opentelemetry-js/tree/main/packages/opentelemetry-sdk-trace-base) SDK を使用して、アプリケーションの計装を自動的に行う方法
- 手動トレース：必要なトレース情報を開発者が明示的に記述する方法

まずは自動計測の方法を使用してアプリケーションの計装を行います。以下のライブラリをインストールします。

```sh
npm install @opentelemetry/sdk-node @opentelemetry/api @opentelemetry/auto-instrumentations-node @opentelemetry/sdk-metrics @opentelemetry/instrumentation-http @opentelemetry/instrumentation-express
```

`instrumentation.js` というファイルを作成して、以下のコードを記述します。

```js:instrumentation.js
import { NodeSDK } from "@opentelemetry/sdk-node";
import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace-base";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
} from "@opentelemetry/sdk-metrics";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";

// OpenTelemetry の SDK を初期化する
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

// SDK を起動することで自動で計装が開始される
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

OpenTelemetry Collector は、複数のアプリケーションから収集したデータを一元的に管理するためのプロセスです。OpenTelemetry Collector をしようすることで、受け取ったデータを加工したり、複数の監視バックエンドにデータを送信できます。

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

新たにインストールしたエクスポーターを使用するように `instrumentation.js` を修正します。`ConsoleExporter` はもう使わないので削除します。

```diff:instrumentation.js
  import { NodeSDK } from "@opentelemetry/sdk-node";
- import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace-base";
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

### カスタムメトリクスを計測する

さらに、わかりやすいメトリクスを計測するために、手動でメトリクスを計測するコードを追加してみましょう。`/dice` エンドポイントにアクセスすると、1 から 6 までのランダムな数値が返ってくるようになっています。サイコロの目が何回出たかをカウントするメトリクスを計測してみましょう。

独自のカウンタを生成するために、以下のコードを `counter.js` というファイルに記述します。

```js:counter.js
import {
  PeriodicExportingMetricReader,
  MeterProvider,
} from "@opentelemetry/sdk-metrics";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-grpc";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { Resource } from "@opentelemetry/resources";

// MeterProvider は Meter を生成するためのエントリーポイント
const meterProvider = new MeterProvider({
  // resource は必須
  // ここではサービス名を指定している
  resource: new Resource({
    // OpenTelemetry では SemanticConventions として予め語彙が定義されている。
    // https://opentelemetry.io/docs/concepts/semantic-conventions/
    [SemanticResourceAttributes.SERVICE_NAME]: "basic-metric-service",
  }),
});

// MeterProvider は設定を保持する役割を担う
meterProvider.addMetricReader(
  new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter(),
    exportIntervalMillis: 1000,
  })
);

// MeterProvider から Meter を生成する
const meter = meterProvider.getMeter("example-exporter-collector");

// Meter から Instrument を生成する
// ここでは Instrument の種類として Counter を使用する
export const diceRollCounter = meter.createCounter("dice", {
  description: "Dice roll counter",
});
```

OpenTelemetry におけるメトリクスの API は以下の 3 つのコンポーネントから構成されています。

- MeterProvider
- Meter
- Instrument

https://opentelemetry.io/docs/specs/otel/metrics/api/

MeterProvider API のエントリーポイントとなり、Meter へのアクセスを提供します。MeterProvider はステートフルなオブジェクトとして、設定を保持するのが役割です。MeterProvider は複数の Meter を生成できます。

```js:counter.js
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
```

Meter は Instrument の作成を担当します。MeterProvider より `meterProvider.getMeter()` メソッドを呼び出すことで Meter を生成します。`meterProvider.getMeter()` の引数として渡す名前は、[Instrumentation Scope](https://opentelemetry.io/docs/specs/otel/glossary/#instrumentation-scope) を表します。

```js:counter.js
const meter = meterProvider.getMeter("example-exporter-collector");
```

Meter は Instrument を生成する役割を担っています。Instrument は実際にメトリクスのレポートを行います。Meter は以下の種類の Instrument を生成できます。

- Counter
- Asynchronous Counter
- Histogram
- Asynchronous Gauge
- UpDownCounter
- Asynchronous UpDownCounter

ここでは `meter.createCounter()` メソッドを使用して Counter を生成しています。Counter は例えばリクエストが完了した数、5xx HTTP エラーの数といった非負のインクリメントを計測するために使用します。

```js:counter.js
export const diceRollCounter = meter.createCounter("dice", {
  description: "Dice roll counter",
});
```

ここでは Instrument として `diceRollCounter` を使用します。`diceRollCounter.add()` メソッドを呼び出すことで、引数に渡した数値の文だけカウントが増えます。

`main.js` を修正して、`app.get("/dice")` 内で `diceRollCounter.add()` を呼び出すように修正します。`diceRollCounter.add()` を呼び出すたびに任意の数だけカウントが増えていきます。また、第 2 引数でラベルを指定できます。ここでは、サイコロの目と環境をラベルとして指定しています。

サイクロの目をラベルとして指定することで、サイクロの目ごとに集計を行えます。例えば Prometheus で `sum(dice{diceRoll="1"})` というクエリを実行することで、サイコロの目が 1 の回数を取得できます。

```diff:main.js
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
```

コードの編集が完了したら、アプリケーションを再起動します。

```sh
node main.js
```

### OpenTelemetry Collector の設定

OpenTelemetry Collector を使用するための設定をしましょう。ここでは OpenTelemetry Collector のディストリビューションとして [opentelemetry-collector-contrib](https://github.com/open-telemetry/opentelemetry-collector-contrib) を使用します。これは公式が提供しているディストリビューションで、多くのプラグインがはじめから同梱されているのが特徴です。

そのため、テスト用のアプリケーションでとりあえず試してみるのであれば、このディストリビューションを使用するのが便利です。しかし、本番環境で使用する場合は、必要なプラグインだけを選択してカスタマイズしたディストリビューションを作成することを推奨します。使わないプラグインが多く含まれているとイメージのサイズが大きくなりますし、セキュリティ上のリスクも高まるためです。

OpenTelemetry Collector は YAML 形式の設定ファイルを使用して設定を行います。OpenTelemetry Collector の設定は以下の 4 つのコンポーネントから構成されています。

- Receivers：データを受け取る
- Processors：データを加工する
- Exporters：データを送信する
- Connectors：2 つのパイプラインを接続する

上記のコンポーネントを定義した後に、`service` セクションの `pipelines` でパイプラインを構築することで設定が有効になります。上記の 4 つのコンポーネントの他に、コレクタ自身に機能を追加する `extensions` というセクションもあります。

`otel-collector-config.yaml` ファイルを作成して、下記のような設定を記述します。

```yaml:otel-collector-config.yaml
receivers:
  otlp:
    protocols:
      grpc:

processors:
  batch:

exporters:
  prometheus:
    endpoint: "0.0.0.0:8889"

extensions:
  health_check:

service:
  extensions: ["health_check"]
  pipelines:
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [prometheus]
```

それぞれのセクションについて詳しく見ていきましょう。

#### receivers

receivers はデータを受け取るためのコンポーネントです。典型的には、ポートを開放してデータを待ち受けることになります。ここでは [OTLP Receiver](https://github.com/open-telemetry/opentelemetry-collector/blob/main/receiver/otlpreceiver/README.md) を使用しています。これは [OTLP](https://github.com/open-telemetry/opentelemetry-proto/blob/main/docs/specification.md) と呼ばれるプロトコルに則っとりデータを受け取り Reciever です。データの受診方法として HTTP または gRPC を選択できます。

Node.js のアプリケーションでは Exporter に gRPC を使用してデータを送信する `@opentelemetry/exporter-metrics-otlp-grpc` を指定しているので、ここでは gRPC を使用してデータを受け取るように設定します。gPRC のデフォルトのエンドポイントは `0.0.0.0:4317` となります。

```yaml
receivers:
  otlp:
    protocols:
      grpc:
```

#### processors

processors はデータを受信してからエクスポートされるまでの間に実行されます。processors ではセンシティブなデータをフィルタリングする、新たな属性を追加する、外部へのデータの送信をバッチで行うなどの処理を行います。

デフォルトでは有効となっているプロセッサーはありませんが、データソースによって[推奨されるプロセッサー](https://github.com/open-telemetry/opentelemetry-collector/tree/main/processor#recommended-processors)があります。

今回の例では [batch プロセッサー](https://github.com/open-telemetry/opentelemetry-collector/tree/main/processor#recommended-processors)を指定しています。batch プロセッサーは、指定した時間ごとにデータをバッチ処理してエクスポートするプロセッサーです。バッチ処理により、データがより適切に圧縮されデータの送信に必要な発信接続の数が削減されます。batch プロセッサーはすべてのコレクターで有効にすることが強く推奨されています。

```yaml
processors:
  batch:
```

#### exporters

exporters は複数の監視バックエンドにデータを送信する方法を定義します。例えば Prometheus, Jaeger などのシステムに対して設定を記述し service セクションのパイプラインで指定することで、1 つのコレクターから複数のバックエンドにデータを送信できます。多くの場合、エクスポーターにはエンドポイントと認証情報の設定を記述することになります。

今回は Prometheus にデータを送信するために、`prometheus` を指定しています。ここで指定するキー名は後ほど service セクションの pipeline で指定するために使用するものです。そのため、ユニークな名前であれば任意の名前を指定できます。

```yaml
exporters:
  prometheus:
    endpoint: "0.0.0.0:8889"
```

#### extensions

extensions はコレクターに機能を追加するためのコンポーネントです。例えば、[health_check](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/extension/healthcheckextension/README.md) という拡張機能を使用すると、コレクターのヘルスチェックのためのエンドポイントを作成します。このエンドポイントは Kubernetes での liveness または readiness probe として使用できます。

```yaml
extensions:
  health_check:
```

#### service

上記のコンポーネントで定義した設定はパイプラインとして構築することで初めて有効となります。service セクションの pipelines でパイプラインを構築します。パイプラインは以下の 3 つのコンポーネントから構成されます。

- receivers
- processors
- exporters

ここでは、`metrics` の 2 つのパイプラインを構築しています。このパイプラインは、`otlp` からデータを受け取り、`batch` でデータを加工して、`prometheus` にデータを送信するという処理を行います。

`service` セクションではパイプラインの他に、`extensions` も有効にできます。

```yaml
service:
  extensions: ["health_check"]
  pipelines:
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [prometheus]
```

### OpenTelemetry Collector を起動する

ここでは Docker Compose を使用して、OpenTelemetry Collector と Prometheus を起動します。otel-collector では先程作成した `otel-collector-config.yaml` ファイルを `/etc/otel-collector-config.yaml` にマウントします。collector の起動時に `--config=/etc/otel-collector-config.yaml` というオプションを指定することで、設定ファイルを読み込みます。

また、Receiver や Exporter のエンドポイントをホストマシンからアクセスできるように、いくつかのポートを開放しています。

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

Prometheus も同様に設定ファイルをマウントするので、`prometheus.yaml` を作成しておきましょう。

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

## まとめ

この記事では、OpenTelemetry の Node.js 向けのライブラリを使用して、Node.js アプリケーションを計装する方法を紹介しました。また、計装したデータを OpenTelemetry Collector Prometheus に送信する方法も紹介しました。OpenTelemetry Collector を使用したおかげで、この後 Jaeger などを新たな監視バックエンドを追加する際にも、OpenTelemetry Collector の設定ファイルのみを修正するだけで、すぐにデータを送信できます。

この記事で紹介したコードは以下のリポジトリで公開しています。

https://github.com/azukiazusa1/nodejs-opentelemetry

また OpenTelemetry コミュニティにより、JavaScript で OpenTelemetry を使用したサンプルが以下のリポジトリで多く公開されています。OpenTelemetry に興味を持った方は、ぜひこちらも参考にしてみてください。

https://github.com/open-telemetry/opentelemetry-js/tree/main/examples

## 参考

- [Node.js | OpenTelemetry](https://opentelemetry.io/docs/instrumentation/js/getting-started/nodejs/)
- [Node.js と OpenTelemetry  |  Cloud Trace  |  Google Cloud](https://cloud.google.com/trace/docs/setup/nodejs-ot?hl=ja)
- [Node.jsをOpenTelemetryでメトリック収集してみる - Qiita](https://qiita.com/raichi/items/d371bf3fe6ddec168725)
