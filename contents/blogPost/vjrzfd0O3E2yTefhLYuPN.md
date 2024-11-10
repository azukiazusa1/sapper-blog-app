---
id: vjrzfd0O3E2yTefhLYuPN
title: "Next.js で OpenTelemetry を使用した計装を行う"
slug: "instrumentation-with-opentelemetry-in-nextjs"
about: "この記事では Next.js で OpenTelemetry を使用した計装を行う方法について紹介します。Next.js では `instrumentation.ts` ファイルを使用して監視ツールやログツールの計装を設定できます。"
createdAt: "2024-11-10T17:53+09:00"
updatedAt: "2024-11-10T17:53+09:00"
tags: ["Next.js", "OpenTelemetry"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/5ToSDYLHmQXAx4yXgzqhzd/6ce67aa462ff0f282bc3babb59f69e8d/marron_igaguri_illust_4409-768x632.png"
  title: "いがぐりのイラスト"
selfAssessment:
  quizzes:
    - question: "instrumentation.ts ファイルで export する関数は次のうちどれか？"
      answers:
        - text: "register()"
          correct: true
          explanation: ""
        - text: "initialize()"
          correct: false
          explanation: ""
        - text: "setup()"
          correct: false
          explanation: ""
        - text: "configure()"
          correct: false
          explanation: ""

published: false
---

OpenTelemetry は Observability のフレームワークであり、トレース・メトリクス・ログなどのテレメトリーデータを作成、管理するためのツールキットです。OpenTelemetry はベンダーに依存しない形で標準化されたプロトコルとツールを提供していることが特徴です。

https://opentelemetry.io/

Next.js では `instrumentation.ts` ファイルを使用することで、監視やログツールの計装を設定できます。また、Next.js ではアプケーションのパフォーマンスを計測できるように、`render route`, `fetch`, `resolve page component` といったいくつかのスパンが自動で計装されるようになっています。

この記事では、Next.js で OpenTelemetry を使用した計装を行う方法について紹介します。

## OpenTelemetry パッケージのインストール

初めに Next.js のプロジェクトを作成しましょう。以下のコマンドを実行します。

```sh
npx create-next-app@latest next-otel
```

続いて OpenTelemetry で計装を行うために必要なパッケージをインストールします。いくつかの Node.js 向けの SDK が提供されていますが、 Next.js 向けにすぐに利用できるように [@vercel/otel](https://github.com/vercel/otel/tree/main/packages/otel) パッケージが用意されているので、これを使用します。

```sh
npm install @vercel/otel
```

プロジェクトのルートディレクトリに `instrumentation.ts` ファイルを作成します。`instrumentation.ts` ファイルで `register` 関数を export すると、Next.js のサーバーインスタンスが初期化される際に 1 度だけ呼び出されます。

```ts:instrumentation.ts
import { registerOTel } from '@vercel/otel';

export function register() {
  registerOTel({ serviceName: "next-otel" });
}
```

`register` 関数では `registerOtel` 関数を呼び出すことで、OpenTelemetry の計装を設定が完了します。オプションの `serviceName` は OpenTelemetry の Resource Semantic Conventions で定義されている [service.name](https://opentelemetry.io/docs/specs/semconv/resource/#service) 属性に対応しています。`service.name` 属性はテレメトリデータの送信元のサービス名を表す元として規約で定義されています。

## 監視バックエンドへの送信

Next.js 側で軽装されたテレメトリデータを収集するために、OpenTelemetry Collector を使用できます。OpenTelemetry Collector は、複数のバックエンドに送信するためのミドルウェアです。アプリケーションから直接バックエンドに送信するのではなく、OpenTelemetry Collector を経由して送信することで、アプリケーションはバックエンドのことを意識する必要がなくなります。

https://opentelemetry.io/docs/collector/

テレメトリデータを収集するための監視バックエンドとして、[Jaeger](https://www.jaegertracing.io/) と [Prometheus](https://prometheus.io/) を使用します。 Jaeger はトレースデータを、Prometheus はメトリクスデータをそれぞれ収集します。

`docker-compose.yml` Otel Collector, Jaeger, Prometheus を起動するための設定ファイルを作成します。構成ファイルは以下のレポジトリを参考にしています。

https://github.com/vercel/opentelemetry-collector-dev-setup/tree/main

```yml:docker-compose.yml
version: "2"
services:
  # Jaeger
  jaeger-all-in-one:
    image: jaegertracing/all-in-one:latest
    restart: always
    ports:
      - "16686:16686"
      - "14268"
      - "14250"

  # Zipkin
  zipkin-all-in-one:
    image: openzipkin/zipkin:latest
    restart: always
    ports:
      - "9411:9411"

  # Collector
  otel-collector:
    image: otel-collector-config.yaml
    restart: always
    command: ["--config=/etc/otel-collector-config.yaml"]
    volumes:
      - ./otel-collector-config.yaml:/etc/otel-collector-config.yaml
    ports:
      - "1888:1888" # pprof extension
      - "8888:8888" # Prometheus metrics exposed by the collector
      - "8889:8889" # Prometheus exporter metrics
      - "13133:13133" # health_check extension
      - "4317:4317" # OTLP gRPC receiver
      - "4318:4318" # OTLP HTTP receiver
      - "55679:55679" # zpages extension
    depends_on:
      - jaeger-all-in-one
      - zipkin-all-in-one

  prometheus:
    container_name: prometheus
    image: prom/prometheus:latest
    restart: always
    volumes:
      - ./prometheus.yaml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

```

続いて `otel-collector-config.yaml` ファイルを作成します。このファイルでは、OpenTelemetry Collector の設定を記述します。

```yaml:otel-collector-config.yaml
receivers:
  otlp:
    protocols:
      grpc:
      http:

exporters:
  prometheus:
    endpoint: "0.0.0.0:8889"
    const_labels:
      label1: value1

  logging:

  zipkin:
    endpoint: "http://zipkin-all-in-one:9411/api/v2/spans"
    format: proto

  jaeger:
    endpoint: jaeger-all-in-one:14250
    tls:
      insecure: true

processors:
  batch:

extensions:
  health_check:
  pprof:
    endpoint: :1888
  zpages:
    endpoint: :55679

service:
  extensions: [pprof, zpages, health_check]
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [logging, zipkin, jaeger]
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [logging, prometheus]

```

最後に Prometheus の設定ファイル `prometheus.yml` を作成します。

```yml:prometheus.yml
scrape_configs:
  - job_name: 'otel-collector'
    scrape_interval: 10s
    static_configs:
      - targets: ['otel-collector:8889']
      - targets: ['otel-collector:8888']
```

以下のコマンドで Docker コンテナを起動します。

```sh
docker compose up -d
```

監視バックエンドにはそれぞれ以下の URL でアクセスできます。

- Jaeger: http://localhost:16686
- Prometheus: http://localhost:9090

## リクエストの計装

Next.js アプリケーションを起動し http://localhost:3000 にアクセスし、サーバーにリクエストが来た際に OpenTelemetry で計装されたデータが監視バックエンドに送信されることを確認します。

```sh
npm run dev
```

Jeager の UI にアクセスし、トレースデータが表示されていることを確認しましょう。Service のセレクトボックスで `registerOTel` で指定した `serviceName` が選択できます。この `next-otel` を選択すると、Next.js アプリケーションのトレースデータが表示されます。正常に動作している場合には、`GET /{pathname}` のようなラベルがついたルートサーバースパンが表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/33Q2L7p5dOFz9v4ER4IMCM/ecac26e465af890852f92a4350f36899/__________2024-11-10_19.29.11.png)

それぞれのトレースデータをクリックすると、リクエストの詳細情報を確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3uhsbMhkKCZflSQtLsPOcN/0195cc964e292f87e3bc1d4e6570c28a/__________2024-11-10_19.35.52.png)

Next.js でデフォルトで提供されている各スパンについては、以下のドキュメントを参照してください。

https://nextjs.org/docs/pages/building-your-application/optimizing/open-telemetry#default-spans-in-nextjs

## まとめ

- Next.js では `instrumentation.ts` ファイルを使用して監視ツールやログツールの計装を設定できる
  - `register()` 関数を export することで、サーバーインスタンスが初期化される際に 1 度だけ呼び出される
- Next.js ではデフォルトでいくつかのスパンが自動で計装される
- `@vercel/otel` パッケージを使用の `registerOTel` 関数を使用することで、細かな設定をせずとも OpenTelemetry の計装を開始できる
- OpenTelemetry Collector を使用することで、複数のバックエンドにテレメトリデータを送信できる
- Jaeger と Prometheus を使用して、トレースデータとメトリクスデータを収集する

## 参考

- [Optimizing: Instrumentation | Next.js](https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation)
- [Optimizing: OpenTelemetry | Next.js](https://nextjs.org/docs/app/building-your-application/optimizing/open-telemetry)
