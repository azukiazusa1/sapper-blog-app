---
id: YBD6pAGrE7Mto0bOmlu_s
title: "OpenTelemetry Collector の Connector を使ってログをメトリックに変換する"
slug: "convert-logs-to-metrics-with-opentelemetry-collector-connector"
about: "OpenTelemetry には、メトリック、トレース、ログの 3 つの形式があります。これらの形式はそれぞれ別のパイプラインで処理されます。ある形式のデータを別の形式に変換し、あたかも 1 つのパイプライン上でデータを処理したい場合に Connector を使用します。例えば、あるパイプラインはログのパイプラインのエクスポーターとメトリックのパイプラインのレシーバーとして動作します。このような場合、Connector はログをメトリックに変換する役割を担います。"
createdAt: "2023-09-09T12:51+09:00"
updatedAt: "2023-09-09T12:51+09:00"
tags: ["OpenTelemetry", "Prometheus"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2w4IUrjLnMKo5ZhYvDhhM1/00fe23cbc66ad28e3e47a37ab41b06e7/jyuugoya_tsukimi_11155.png"
  title: "お月見のイラスト"
published: true
---

OpenTelemetry Collector における Connector は異なるパイプラインを接続する役割を担います。Connector はパイプラインのレシーバーとエクスポーターとして動作します。

OpenTelemetry には、メトリック、トレース、ログの 3 つの形式があります。これらの形式はそれぞれ別のパイプラインで処理されます。ある形式のデータを別の形式に変換し、あたかも 1 つのパイプライン上でデータを処理したい場合に Connector を使用します。例えば、あるパイプラインはログのパイプラインのエクスポーターとメトリックのパイプラインのレシーバーとして動作します。このような場合、Connector はログをメトリックに変換する役割を担います。

![Traces pipeline の図と Metrics pipeline の図が上下に並んでいる。Traces pipeline では receiver から processor に矢印が接続されており、processor からは connector と exporter の 2 つに矢印が接続されている。Metrics pipeline では connector と receiver の 2 つから processor に矢印が接続されている。processor からは exporter に矢印が接続されている。](https://images.ctfassets.net/in6v9lxmm5c8/20OJQbWRjXpznUd18ydTry/74b6b6e096c8c7cefb2c500fa3c506d7/otel-collector-after-connector.png)

https://opentelemetry.io/docs/collector/build-connector/#new-architecture-using-a-connector より引用。

この記事では、Connector を使用してログをメトリックに変換してから Prometheus にエクスポートする方法を紹介します。

## OpenTelemetry のおけるログの概要

まずは、アプリケーションのログを OpenTelemetry Collector に送信する必要があります。OpenTelemetry においてアプリケーションのログを収集する方法として、以下の 3 つの方法があります。

- 標準出力に書き込まれているログを OpenTelemetry Collector が読み取る
- Fluentd などのログ収集エージェントを使用して OpenTelemetry Collector にログを送信する
- OTLP（OpenTelemetry Protocol）を使用してアプリケーションから直接 OpenTelemetry Collector にログを送信する

1 番目と 2 番目の方法は現状のアプリケーションの構造変更せずに OpenTelemetry Collector にログを送信できるため、推奨されています。ただし、ログの形式は [filelog receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/filelogreceiver) がサポートする形式であることが必要です。

3 番目の方法は [Logs SDK](https://opentelemetry.io/docs/specs/otel/logs/sdk/) を使用してアプリケーションから直接ログを送信します。そのため、アプリケーションのコードに変更を加える必要があります。このアプローチの利点は、OpenTelemetry により明確に定義された構造でログを出力できることです。また、標準出力にログを出力する際に生じるログローテーションなどの複雑な処理を回避できます。

この記事ではログにまつわる処理を簡単にするため、3 番目の方法を採用します。まずは必要なパッケージをインストールします。

```sh
npm i @opentelemetry/api-logs @opentelemetry/sdk-logs @opentelemetry/semantic-conventions @opentelemetry/resources @opentelemetry/exporter-logs-otlp-grpc
```

`logger.js` ファイルを作成して、以下のようにログを出力する処理を実装します。

```js:logger.js
import api, { SeverityNumber } from "@opentelemetry/api-logs";
import {
  LoggerProvider,
  ConsoleLogRecordExporter,
  SimpleLogRecordProcessor,
} from "@opentelemetry/sdk-logs";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { Resource } from "@opentelemetry/resources";

const loggerProvider = new LoggerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "express-app",
  }),
});

loggerProvider.addLogRecordProcessor(
  new SimpleLogRecordProcessor(new ConsoleLogRecordExporter())
);

export const logger = loggerProvider.getLogger("default");

logger.emit({
  severityNumber: SeverityNumber.INFO,
  severityText: "INFO",
  body: "this is a log record body",
  attributes: {
    env: "development",
  }
});
```

OpenTelemetry におけるログの API は以下の 2 つのクラスから構成されています。

- `LoggerProvider`：API のエントリーポイントとなるクラス。Logger へのアクセスを提供する。
- `Logger`：ログを出力するためのクラス。`emit` メソッドを使用 `LogRecord` としてログを出力する。

![LoggerProvider から Get の矢印が Logger に接続されている。Logger から Emit の矢印が LogRecord に接続されている。](https://images.ctfassets.net/in6v9lxmm5c8/1F9DWwsgXxkGBhTL3970tj/39df1df9d4595656b453e32be89fa2a4/__________2023-09-09_13.34.29.png)

### LoggerProvider

LoggerProvider は設定を保持する役割を担います。LoggerProvider のコンストラクタとして `Resource` を渡しています。`Resource` はアプリケーションが実行される環境の属性の集合です。ここでは一意となるサービスの名前を `express-app` として設定しています。また、`addLogRecordProcessor()` メソッドでログがどのようにエクスポーターされるかを設定しています。ここでは `ConsoleLogRecordExporter` を使用して標準出力にログを出力するように設定しています。

`getLogger()` メソッドを呼び出すことで Logger を取得できます。`getLogger()` メソッドの引数には Logger の名前を渡します。ここで渡す名前は [Instrument Scope](https://opentelemetry.io/docs/specs/otel/glossary/#instrumentation-scope) として識別されます。

### Logger

Logger の `emit()` メソッを呼び出すことで LogRecord としてログを出力します。`emit()` メソッドは以下のパラメータを受け取ります。

- Timestamp：ログのタイムスタンプ。
- Observed Timestamp：イベントが観測された時刻。通常、Timestamp と同じ値が設定される。
- SeverityNumber：ログの重要度を表す数値。TRACE, DEBUG, INFO, WARN, ERROR, FATAL の 6 つのレベルごとに 4 つづつ数値が割り当てられている。つまり、24 段階の重要度を表すことができる。
- SeverityText：ログの重要度を表す文字列。省略した場合、SeverityNumber を短縮した文字列が設定される可能性がある。
- Body：ログの本文。
- Attributes：ログに付与する属性の集合。
- Context: TraceId や SpanId などのコンテキスト情報。

ログが正しく動作するか、`logger.js` を実行して確認してみましょう。

!> ES Modules を使用しているため、`package.json` の `type` フィールドに `module` を設定する必要があります。

```sh
node logger.js
```

以下のようなログが標準出力に出力されます。

```sh
{
  timestamp: 1694235281910000,
  traceId: undefined,
  spanId: undefined,
  traceFlags: undefined,
  severityText: 'INFO',
  severityNumber: 9,
  body: 'this is a log record body',
  attributes: { env: 'development' }
}
```

## アプリケーションのログを OpenTelemetry Collector に送信する

ログの出力ができたので、次は OpenTelemetry Collector にログを送信します。OpenTelemetry Collector にログを送信するためには、OTLP（OpenTelemetry Protocol）を使用してログを送信する必要があります。`logger.js` において `ConsoleLogRecordExporter` を指定している箇所を、`OTLPLogExporter` に変更します。

```diff:logger.js
  import {
    LoggerProvider,
-   ConsoleLogRecordExporter,
    SimpleLogRecordProcessor,
  } from "@opentelemetry/sdk-logs";
+ import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-grpc";

// ...

loggerProvider.addLogRecordProcessor(
-   new SimpleLogRecordProcessor(new ConsoleLogRecordExporter())
+   new SimpleLogRecordProcessor(new OTLPLogExporter())
);
```

`OTLPLogExporter` はデフォルトで `localhost:4317` に接続します。OpenTelemetry Collector にログを送信するためには、OpenTelemetry Collector において `otlp` レシーバーを有効化する必要があります。`otlp` レシーバーはデフォルトで `localhost:4317` で起動します。そのため、特に設定を変更する必要はありません。

さらに `diag.setLogger()` を呼び出すことで、OpenTelemetry の処理に関するログを出力できます。これにより、正しくログを OpenTelemetry Collector に送信できているかを確認できます。

```js:logger.js
import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
```

実際のアプリケーションでログを出力することを想定するために、Express アプリケーションを作成します。`express` をインストールします。

```sh
npm i express
```

`server.js` ファイルを作成して、簡単な Express アプリケーションを実装します。

```js:server.js
import express from "express";
import { logger } from "./logger.js";
import { SeverityNumber } from "@opentelemetry/api-logs";

const app = express();
const env = process.env.NODE_ENV || "development";

app.get("/info", (req, res) => {
  logger.emit({
    severityNumber: SeverityNumber.INFO,
    severityText: "INFO",
    body: "path: '/info'",
    attributes: {
      env,
    },
  });

  res.send("Hello World!");
});

app.get("/warn", (req, res) => {
  logger.emit({
    severityNumber: SeverityNumber.WARN,
    severityText: "WARN",
    body: "path: '/warn'",
    attributes: {
      env,
    },
  });

  res.send("Hello World!");
});

app.get("/error", (req, res) => {
  logger.emit({
    severityNumber: SeverityNumber.ERROR,
    severityText: "ERROR",
    body: "path: '/error'",
    attributes: {
      env,
    },
  });

  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log("app listening on port 3000!");
});
```

`/info`、`/warn`、`/error` の 3 つのパスに対して、それぞれ INFO、WARN、ERROR のログを出力するようにしています。アプリケーションを起動して、`/info` にアクセスしてみましょう。

```sh
node server.js
curl localhost:3000/info
```

diag により、以下のようなログが出力されます。

```sh
items to be sent [
  LogRecord {
    attributes: { env: 'development' },
    _isReadonly: false,
    hrTime: [ 1694236157, 353000000 ],
    hrTimeObserved: [ 1694236157, 353000000 ],
    _severityNumber: 9,
    _severityText: 'INFO',
    _body: "path: '/info'",
    resource: Resource {
      _attributes: [Object],
      asyncAttributesPending: false,
      _syncAttributes: [Object],
      _asyncAttributesPromise: undefined
    },
    instrumentationScope: { name: 'default', version: undefined, schemaUrl: undefined },
    _logRecordLimits: { attributeValueLengthLimit: Infinity, attributeCountLimit: 128 }
  }
]
Service request {
  resourceLogs: [ { resource: [Object], scopeLogs: [Array], schemaUrl: undefined } ]
}
{"stack":"Error: 14 UNAVAILABLE: No connection established\n ...
```

`items to be sent` で OTLP Exporter により送信される予定の LogRecord が表示されています。最後に出力されているログでは、OTLP Exporter がエラーを出力しています。これは、OpenTelemetry Collector が起動していないため、接続ができないことが原因です。続いて、OpenTelemetry Collector を起動してみましょう。

## OpenTelemetry Collector を起動する

まずは OpenTelemetry Collector の設定ファイルを作成します。`otel-collector-conf.yaml` ファイルを作成して、以下のように設定を記述します。

```yaml:otel-collector-conf.yaml
receivers:
  otlp:
    protocols:
      grpc:

exporters:
  prometheus:
    endpoint: "0.0.0.0:8889"

connectors:
  count:
    logs:
      error_log_count:
        description: Error log count
        conditions:
          - severity_number >= SEVERITY_NUMBER_ERROR
        attributes:
          - key: env
            default_value: "unknown"

service:
  pipelines:
    logs:
      receivers: [otlp]
      exporters: [count]
    metrics:
      receivers: [count]
      exporters: [prometheus]
```

`receivers` には OpenTelemetry Collector が受け取るデータの形式を設定します。ここでは [otlp レシーバー](https://github.com/open-telemetry/opentelemetry-collector/blob/main/receiver/otlpreceiver/README.md) を使用して、OTLP で送信されるデータを受け取るように設定しています。先程のアプリケーションでは、 `OTLPLogExporter` を使用して OTLP でデータを送信するように設定していました。

`exporters` には OpenTelemetry Collector がデータを送信する先を設定します。ここでは prometheus エクスポーターを設定していて、Prometheus のエンドポイントを指定しています。

`connectors` が今回の構成の肝です。ここでは [Count Connector](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/connector/countconnector/README.md) を使用しています。これは、トレース・メトリック・ログそれぞれの形式のデータを受け取り、その数をメトリックに変換して別のパイプラインに受け渡すために使用します。

今回はログを受け取る厚生とするので、`logs` の設定を行います。`error_log_count` はパイプラインにより新たに生成されるメトリックの名前です。`conditions` により、ログの重要度が ERROR 以上のもののみをカウントするように設定しています。`attributes` に設定したキー名の属性を、元のログが持つ属性が引き継ぐように設定しています。ここでは `env` というキー名の属性を設定しています。もし元のログで `env` というキー名の属性が存在しない場合は、`default_value` で指定した値が設定されます。

`service` にはパイプラインの設定を行います。ここでは `logs` と `metrics` の 2 つのパイプラインを設定しています。冒頭でも説明した通り、Connector を使用して `logs` と `metrics` の 2 つのパイプラインを接続しています。これにより、最終的にメトリックの形式として Prometheus に送信されます。

OpenTelemetry と Prometheus を起動するために、`docker-compose.yaml` ファイルを作成します。

```yaml:docker-compose.yaml
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

Prometheus の設定ファイルとして、`prometheus.yaml` ファイルを作成します。

```yaml:prometheus.yaml
scrape_configs:
  - job_name: "otel-collector"
    scrape_interval: 10s
    static_configs:
      - targets: ["otel-collector:8889"]
      - targets: ["otel-collector:8888"]
```

OpenTelemetry のイメージとして、[opentelemetry-collector-contrib](https://github.com/open-telemetry/opentelemetry-collector-contrib) を使用します。これは公式が提供しているディストリビューションで、多くのプラグインがはじめから同梱されているのが特徴です。

そのため、テスト用のアプリケーションでとりあえず試してみるのであれば、このディストリビューションを使用するのが便利です。しかし、本番環境で使用する場合は、必要なプラグインだけを選択してカスタマイズしたディストリビューションを作成することを推奨します。使わないプラグインが多く含まれているとイメージのサイズが大きくなりますし、セキュリティ上のリスクも高まるためです。

準備が完了したので、`docker-compose up` コマンドを実行して、OpenTelemetry Collector と Prometheus を起動しましょう。

```sh
docker-compose up -d
```

## Prometheus 上でメトリックを確認する

OpenTelemetry Collector を起動したら、一度アプリケーションのサーバーを起動し直してから、`/error` のパスに何度かアクセスしてみてください。`Objects sent` とログが出力されていれば、OpenTelemetry Collector に正しくデータが送信されていることがわかります。

```sh
items to be sent [
  LogRecord {
    attributes: { env: 'development' },
    _isReadonly: false,
    hrTime: [ 1694237990, 86000000 ],
    hrTimeObserved: [ 1694237990, 86000000 ],
    _severityNumber: 17,
    _severityText: 'ERROR',
    _body: "path: '/error'",
    resource: Resource {
      _attributes: [Object],
      asyncAttributesPending: false,
      _syncAttributes: [Object],
      _asyncAttributesPromise: undefined
    },
    instrumentationScope: { name: 'default', version: undefined, schemaUrl: undefined },
    _logRecordLimits: { attributeValueLengthLimit: Infinity, attributeCountLimit: 128 }
  }
]
Objects sent
```

正しくログが送信できていることが確認できたら、以下の URL にアクセスして、Prometheus 上でメトリックを確認してみましょう。

http://localhost:9090/

Count Connector で設定した `error_log_count` という名前のメトリックが表示されているはずです。以下のようにグラフで表示されていれば、正しくメトリックが出力されていることがわかります。

![Prometheus のスクリーンショット。クエリのインプットには error_log_count と入力されている。グラフ上には点が 1 つ表示されていて、error_log_count: 1 というラベルが表示されている。](https://images.ctfassets.net/in6v9lxmm5c8/5d0Hsgd7gAgdruc4cmDsYQ/0f1c9eba3eacfd131b6e2750935f3bd7/__________2023-09-09_14.41.06.png)

## まとめ

- OpenTelemetry Collector における Connector は異なるパイプラインを接続する役割を担う。
- OpenTelemetry には、メトリック、トレース、ログの 3 つの形式がある。これらの形式はそれぞれ別のパイプラインで処理される。Connector を使うことで、別の形式に変換してから別のパイプラインにデータを渡すことができる。
- OpenTelemetry におけるログでは、大きく分けて 2 つの方法でログを収集できる。1 つは標準出力にログを出力する方法、もう 1 つは OTLP を使用してアプリケーションから直接ログを送信する方法。
