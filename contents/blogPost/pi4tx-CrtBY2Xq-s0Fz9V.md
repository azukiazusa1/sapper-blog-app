---
id: pi4tx-CrtBY2Xq-s0Fz9V
title: "Deno v2.2 で追加されたビルドイン OpenTelemetry サポートを試してみる"
slug: "deno-v2-2-opentelemetry"
about: "Deno v2.2 でビルドインの OpenTelemetry サポートが追加されました。アプリケーションのコードに変更を加えることなく、Deno のビルトイン API から自動的にテレメトリーデータを計装できるようになります。"
createdAt: "2025-02-22T15:42+09:00"
updatedAt: "2025-02-22T15:42+09:00"
tags: ["Deno", "OpenTelemetry"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/hmAh1y5HuIL0a3m4C7Kdz/dbc016aeb3125aa3c81c5994bc92d7a8/cute_brachiosaurus_8065.png"
  title: "ブラキオサウルスのイラスト"
selfAssessment:
  quizzes:
    - question: "OpenTelemetry の自動計装を有効にするにはどのような環境変数を設定する必要があるか？"
      answers:
        - text: "OTEL_AUTO_INSTRUMENT=true"
          correct: false
          explanation: ""
        - text: "OTEL_DENO=true"
          correct: true
          explanation: ""
        - text: "OTEL_DENO_AUTO_INSTRUMENT=true"
          correct: false
          explanation: ""
        - text: "OTEL_ENABLE=true"
          correct: false
          explanation: ""

published: true
---

Deno v2.2 でビルドインの [OpenTelemetry](https://opentelemetry.io/) サポートが追加されました。OpenTelemetry は分散トレーシングのためのオープンソースの規格です。OpenTelemetry の規格に従うことで、トレース・メトリクス・ログなどのテレメトリーデータをベンダーやツールにとらわれずに収集・エクスポートできるようになります。

一般的に OpenTelemetry を使用してテレメトリーデータを計装するにはプログラミング言語ごとに用意されている SDK を使用します。Deno のビルドイン OpenTelemetry サポートは、追加の SDK のインストールや設定を行わずに Deno アプリケーションから OpenTelemetry を利用できるようにするものです。`console.log`, `Deno.serve`, `fetch` などの Deno のビルトイン API から自動的にテレメトリーデータを計装します。

## テレメトリーデータを計装する

OpenTelemetry のテレメトリーデータを計装するにあたってソースコードに変更を加える必要はありません。多くのテレメトリーデータは Deno によって自動で計装されます。独自のメトリックやトレースを計装したい場合には `npm:@opentelemetry/api` パッケージを使用することもできます。

以下のコードは Deno で HTTP サーバーを立ち上げ、リクエストを受け取るサンプルコードです。このコードを実行すると、HTTP リクエストのトレースが自動的に計装されます。

```ts:server.ts
Deno.serve(async (req) => {
  console.log("Incoming request", req.url);
  const res = await fetch("https://jsonplaceholder.typicode.com/todos");

  const todos = await res.json();

  if (!res.ok) {
    console.error("Failed to fetch todos:", res.statusText);
    return new Response("Error fetching todos", { status: 500 });
  }

  console.log("fetch todos", todos);

  return new Response(JSON.stringify(todos), {
    headers: { "content-type": "application/json" },
  });
});
```

自動計装されたテレメトリーデータはデフォルトで `http/protobuf` プロトコルを使用して `localhost:4318` にエクスポートされます。Deno アプリケーションからエクスポートされたテレメトリーデータは [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/) で受け取り、データを加工してから外部の監視バックエンドサービスに送信するのが一般的です。

ここでは Docker で [local LGTM スタック](https://github.com/grafana/docker-otel-lgtm/tree/main?tab=readme-ov-file)（Prometheus, Grafana, Loki, Tempo）を使用して OpenTelemetry Collector と監視バックエンドサービスを立ち上げます。

```bash
docker run --name lgtm -p 3000:3000 -p 4317:4317 -p 4318:4318 --rm -ti \
	-v "$PWD"/lgtm/grafana:/data/grafana \
	-v "$PWD"/lgtm/prometheus:/data/prometheus \
	-v "$PWD"/lgtm/loki:/data/loki \
	-e GF_PATHS_DATA=/data/grafana \
	docker.io/grafana/otel-lgtm:0.8.1
``` 

OpenTelemetry の自動計装を有効にして Deno アプリケーションを実行するには、環境変数 `OTEL_DENO` を `true` に設定した上で
 `--unstable-otel` フラグを付けて Deno を実行します。

```bash
OTEL_DENO=true deno run --unstable-otel --allow-net server.ts
```

`curl` コマンドを使用して HTTP リクエストを何度か送信してみましょう。

```bash
curl http://localhost:8000
```

http://localhost:3000 にアクセスして Grafana にログインして Explore 画面を開きます。以下のクエリを入力して Tempo で受け取ったトレースを表示します。`Deno.serve()` を起点としたトレースが表示されるはずです。

![](https://images.ctfassets.net/in6v9lxmm5c8/2j2uBI1hcf8yt21TF8HjNb/8bb51f2ac63a09f92c1c629457d03fcd/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-02-21_19.18.07.png)


一番長い親スパンがリクエスト全体が処理される時間であり、その下にある子スパンは `fetch()` で外部にリクエストを送信する時間を示しています。

また、`console.log()` で出力したログも Loki に送信され、Grafana でログを確認することができます。

![](https://images.ctfassets.net/in6v9lxmm5c8/17PIiU0hxBqdimAZ8KC6Qd/c5d26130d1bb1a01cbb5f2ede55a25c2/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-02-21_19.22.00.png)

## メトリックやトレースをカスタマイズする

自動計装されたテレメトリーデータのみでは不十分な場合があります。例えば `Deno.serve()` で計装されるトレースには以下の属性が含まれます。

- `http.request.method`：HTTP リクエストのメソッド
- `url.full`：リクエストされた URL
- `url.scheme`：リクエストされた URL のスキーム
- `url.path`：リクエストされた URL のパス
- `url.query`：リクエストされた URL のクエリパラメータ
- `http.status_code`：HTTP レスポンスのステータスコード

上記の属性に加えて HTTP リクエストのトレースを計装する際には `http.route` 属性が含まれているべきです。この属性は `users/:id` のようなサーバーフレームワークで使われているテンプレート書式を表します。この属性は正規化された状態でエンドポイントのパフォーマンスを分析するのに役立ちます。

しかし、Deno の自動計装ではこの属性は含まれません。`deno.serve()` メソッドはルーティング機能を提供していないためです。このような場合には `npm:@opentelemetry/api` パッケージを使用してスパンに新しい属性を追加します。以下のコマンドでパッケージを追加します。

```bash
deno add npm:@opentelemetry/api
```

ルーティングのロジックを追加して `http.route` 属性をスパンに追加するようにしましょう。この場合ルート名を含めるようにスパン名も更新する必要があります。

-> メトリックやトレースに付与する属性の名前は多くの場合 [Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/) という規約に定められています。カスタム属性を追加する際にはこの規約に対応する属性がないか確認するようにしましょう。

```ts:server.ts
import { trace } from "npm:@opentelemetry/api@1";

const TODO_LIST_ROUTE = new URLPattern({ pathname: "/" });
const TODO_ROUTE = new URLPattern({ pathname: "/todos/:id" });

Deno.serve(async (req) => {
  // 現在のスパンを取得
  const span = trace.getActiveSpan();

  if (TODO_LIST_ROUTE.test(req.url)) {
    // スパン名が {method} {target} になるように更新
    // これは OpenTelemetry の Semantic Conventions に従った命名である
    // https://opentelemetry.io/docs/specs/semconv/http/http-spans/#name
    span?.updateName(`${req.method} /`);
    span?.setAttribute("http.route", "GET /todos");

    // TODO リストを取得する処理
  } else if (TODO_ROUTE.test(req.url)) {
    span?.updateName(`GET /todos/:id`);
    span?.setAttribute("http.route", `GET /todos/:id`);

    // id に応じて TODO を取得する処理
  } else {
    return new Response("Not Found", { status: 404 });
  }
});
```

## まとめ

- Deno v2.2 でビルドインの OpenTelemetry サポートが追加された
- `Deno.serve()`, `fetch()`, `console.*()` などのビルトイン API から自動的にテレメトリーデータを計装できる
- デフォルトで `http/protobuf` プロトコルを使用して `localhost:4318` にエクスポートされるので、OpenTelemetry Collector で受け取り、データを加工してから外部の監視バックエンドサービスに送信するのが一般的
- OpenTelemetry の自動計装を有効にするには、環境変数 `OTEL_DENO` を `true` に設定して `--unstable-otel` フラグを付けて Deno を実行する

## 参考

- [OpenTelemetry](https://docs.deno.com/runtime/fundamentals/open_telemetry/)
- [Deno 2.2: OpenTelemetry, Lint Plugins, node:sqlite](https://deno.com/blog/v2.2)
