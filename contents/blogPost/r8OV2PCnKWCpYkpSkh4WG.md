---
id: r8OV2PCnKWCpYkpSkh4WG
title: "OpenTelemetry Collector をカスタムビルドする"
slug: "custom-build-opentelemetry-collector"
about: "本番環境では OpenTelemetry Collector Contrib を使用せず、必要なコンポーネントのみを含むようにカスタムビルドすることが推奨されています。この記事では、OpenTelemetry Collector をカスタムビルドする方法について紹介します。"
createdAt: "2023-12-20T20:49+09:00"
updatedAt: "2023-12-20T20:49+09:00"
tags: ["OpenTelemetry"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4fVPrLbevOOFy41rHsdfvP/d568759fa60dd7713c9eef2327705b34/daruma-otoshi_12261.png"
  title: "だるま落としのイラスト"
published: true
---

OpenTelemetry Collector は、アプリケーションから収集したトレースやメトリクスを、複数のバックエンドに送信するためのミドルウェアです。アプリケーションから直接バックエンドに送信するのではなく、OpenTelemetry Collector を経由して送信することで、アプリケーションはバックエンドのことを意識する必要がなくなります。また、バッチ処理や機密データのフィルタリングなどデータを処理するコンポーネントを提供しているため、より拡張性の高いデータ収集基盤を構築できます。

開発やテスト目的で OpenTelemetry Collector を使用する場合には、公式に提供されている [OpenTelemetry Collector Contrib](https://github.com/open-telemetry/opentelemetry-collector-contrib) がよく使われています。OpenTelemetry Collector Contrib はほぼすべてのコンポーネントがあらかじめ含まれているため、簡単に試すことができます。

しかし、本番環境で使用する場合には、不要なコンポーネントが含まれていることによるオーバーヘッドやセキュリティ上のリスクが発生する可能性があります。そのため、本番環境で使用する場合には、必要なコンポーネントのみを含むようにカスタムビルドすることが推奨されています。

この記事では、OpenTelemetry Collector をカスタムビルドする方法について紹介します。

## OpenTelemetry Collector Builder（ocb）をインストールする

OpenTelemetry Collector をカスタムビルドするには、[OpenTelemetry Collector Builder](https://pkg.go.dev/go.opentelemetry.io/collector/cmd/builder#section-readme) と呼ばれるビルドツールを使用します。

```sh
go install go.opentelemetry.io/collector/cmd/builder@latest
```

インストールが完了したら、`builder` コマンドが使用できるようになります。

```sh
builder version
ocb version v0.91.0
```

## マニフェストファイルを作成する

マニフェストファイルを使用して、OpenTelemetry Collector にどのコンポーネントを含めるかを指定します。マニフェストファイルは YAML 形式で記述します。

```yaml:manifest.yaml
dist:
  name: otelcol-dev
  description: Basic OTel Collector distribution for Developers
  output_path: ./otelcol-dev
  otelcol_version: 0.91.0

exporters:
  - gomod: github.com/open-telemetry/opentelemetry-collector-contrib/exporter/prometheusexporter v0.91.0
  - gomod: go.opentelemetry.io/collector/exporter/debugexporter v0.91.0

processors:
  - gomod: go.opentelemetry.io/collector/processor/batchprocessor v0.91.0

receivers:
  - gomod: go.opentelemetry.io/collector/receiver/otlpreceiver v0.91.0
```

ここでは、以下の 4 つのコンポーネントを指定しています。

- [otlpreceiver](https://github.com/open-telemetry/opentelemetry-collector/tree/main/receiver/otlpreceiver): OpenTelemetry プロトコルで受信したトレースやメトリクスを処理する
- [batchprocessor](https://github.com/open-telemetry/opentelemetry-collector/tree/main/processor/batchprocessor): バッチ処理を行う
- [prometheusexporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/prometheusexporter)：Prometheus サーバーにメトリックを送信する
- [debugexporter](https://github.com/open-telemetry/opentelemetry-collector/tree/main/exporter/debugexporter): デバッグ用のエクスポーター

OpenTelmetry Collector に含められるコンポーネントは、[OpenTelemetry Collector](https://github.com/open-telemetry/opentelemetry-collector) または [OpenTelemetry Collector Contrib](https://github.com/open-telemetry/opentelemetry-collector-contrib) のリポジトリから探すことができます。

## OpenTelemetry Collector をビルドする

マニフェストファイルを作成したら、`builder` コマンドを使用して OpenTelemetry Collector をビルドします。

```sh
builder --config=manifest.yaml
```

ビルドが成功した場合、`otelcol-dev` というディレクトリが生成されます。

## OpenTelemetry Collector を起動する

それでは、ビルドした OpenTelemetry Collector を起動してみましょう。OpenTelemetry Collector の設定ファイルを作成して、先ほどのマニフェストファイルで指定したコンポーネントを使用するように設定します。

```yaml:otelcol-dev/config.yaml
receivers:
  otlp:
    protocols:
      grpc:

processors:
  batch:

exporters:
  prometheus:
    endpoint: "0.0.0.0:8889"
  debug:

service:
  pipelines:
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [prometheus, debug]
```

設定ファイルを作成したら、以下のコマンドで OpenTelemetry Collector を起動します。

```sh
cd otelcol-dev
./otelcol-dev --config=config.yaml
```

起動が成功した場合、以下のようなログが出力されます。

```sh
2023-12-20T21:22:37.350+0900    info    service@v0.91.0/telemetry.go:86 Setting up own telemetry...
2023-12-20T21:22:37.351+0900    info    service@v0.91.0/telemetry.go:203        Serving Prometheus metrics      {"address": ":8888", "level": "Basic"}
2023-12-20T21:22:37.352+0900    info    exporter@v0.91.0/exporter.go:275        Development component. May change in the future.       {"kind": "exporter", "data_type": "metrics", "name": "debug"}
2023-12-20T21:22:37.352+0900    info    service@v0.91.0/service.go:145  Starting otelcol-dev... {"Version": "1.0.0", "NumCPU": 8}
```

## まとめ

- OpenTelemetry Collector Contrib は、ほぼすべてのコンポーネントが含まれているため、開発やテスト目的で使用する場合には便利だが、本番環境で使用する場合には不要なコンポーネントが含まれていることによるオーバーヘッドやセキュリティ上のリスクが発生する可能性があるため推奨されていない
- 本番環境で使用する場合には、必要なコンポーネントのみを含むようにカスタムビルドすることが推奨されている
- OpenTelemetry Collector Builder を使用することで、必要なコンポーネントのみを含むようにカスタムビルドすることができる
- できるできるマニフェストファイルを使用して、OpenTelemetry Collector にどのコンポーネントを含めるかを指定する
