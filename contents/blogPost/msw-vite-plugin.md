---
id: o2FTE7OVdt7dCHbDlzkN2
title: "MSW v3 の Vite プラグインでモックのセットアップを簡単にする"
slug: "msw-vite-plugin"
about: "MSW v3 で公式の Vite プラグインが追加されました。Worker ファイルのコピーや更新が不要になり、virtual:msw からモックを設定できます。この記事では、Vite と TypeScript の小さなアプリケーションにプラグインを導入する方法を試してみます。"
createdAt: "2026-10-04T00:00+09:00"
updatedAt: "2026-10-04T00:00+09:00"
tags: ["msw", "Vite"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/15S8hLG8pmJYGaFGtBxbU3/865ab43b2695b0813717bc4224b60e75/kamatama-udon_16454-768x630.png"
  title: "釜玉うどんのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Vite プラグインにおいて `network` を import する仮想モジュールの名前はどれですか？"
      answers:
        - text: "msw/vite/client"
          correct: false
          explanation: "msw/vite/client は型宣言のためのモジュールです。"
        - text: "virtual:msw"
          correct: true
          explanation: "virtual:msw は Vite プラグインが提供する仮想モジュールで、network を import できます。"
        - text: "msw/vite"
          correct: false
          explanation: "msw/vite は Vite プラグイン本体のモジュールです。network は提供されません。"
        - text: "msw/worker"
          correct: false
          explanation: "従来のブラウザ向け設定では msw/browser を使います。network を提供する仮想モジュールは virtual:msw です。"
published: true
---
[Mock Service Worker（MSW）](https://mswjs.io/) は、ネットワークリクエストを横取りしてモックのレスポンスを返すライブラリです。バックエンドの API が完成する前にフロントエンドを開発したり、テストで特定のレスポンスを再現したりするために利用します。

従来のブラウザ向けセットアップでは、`msw init` コマンドで `mockServiceWorker.js` を公開ディレクトリに配置し、アプリケーションから `setupWorker()` で Worker を設定していました。このファイルは MSW のバージョンに対応するため、ライブラリの更新に合わせて管理する必要があります。

[MSW v3.0.0](https://github.com/mswjs/msw/releases/tag/v3.0.0) では、公式の Vite プラグインが追加されました。インストール済みの MSW から Worker ファイルを配信するため、ファイルのコピーが不要になります。また、`virtual:msw` モジュールから設定済みの `network` を利用できます。

この記事では、Vite と TypeScript の小さなアプリケーションにプラグインを導入する方法を試してみます。

## 従来のセットアップと Vite プラグインの違い

ブラウザ版の MSW は [Service Worker](https://developer.mozilla.org/ja/docs/Web/API/Service_Worker_API) を使ってリクエストを横取りします。Service Worker はページとは別に動作するスクリプトで、ブラウザがリクエストを送信する前に応答を返すことができます。従来のセットアップでは、Worker ファイル `mockServiceWorker.js` を公開ディレクトリに配置し、アプリケーション側で `setupWorker()` を呼び出して設定していました。

`mockServiceWorker.js` は MSW のバージョンが変わるたびに更新する必要があるため、毎度 `msw init` を実行してコピーする必要がありました。Vite プラグインを使うと、Worker ファイルのコピーや更新が不要になります。プラグインが開発サーバーから配信するため、`msw init` の実行や `public/mockServiceWorker.js` の管理は不要です。

## Vite プラグインを導入する

MSW の Vite プラグインを試してみましょう。Vite プロジェクトを作成し、MSW をインストールします。

```bash
npm install msw --save-dev
```

`vite.config.ts` で `msw/vite` の `msw()` をプラグインとして登録します。

```ts:vite.config.ts
import { defineConfig } from "vite";
import { msw } from "msw/vite";

export default defineConfig({
  plugins: [msw()],
});
```

これにより、開発サーバーが `/mockServiceWorker.js` を配信します。`public/mockServiceWorker.js` の作成や `msw init` の実行は不要です。既存の Vite プロジェクトに導入する場合は、フレームワーク用プラグインと並べて追加してください。

続いて TypeScript を設定します。MSW v3 では `virtual:msw` という仮想モジュールが追加され、`network` を提供します。この仮想モジュールのための型宣言 `msw/vite/client` を追加します。

```ts:src/vite-env.d.ts
/// <reference types="vite/client" />
/// <reference types="msw/vite/client" />
```

## virtual:msw でモックを有効にする

まず、`GET /api/user` にユーザー情報を返すハンドラーを作成します。

```ts:src/mocks/handlers.ts
import { http, HttpResponse } from "msw/http";

export const handlers = [
  http.get("/api/user", () => {
    return HttpResponse.json({ id: "1", name: "azukiazusa" });
  }),
];
```

`http.get()` で対象の HTTP メソッドと URL を指定し、`HttpResponse.json()` で JSON のレスポンスを返します。

続いて、アプリケーションの起動前にモックを準備します。

```ts:src/main.ts
if (import.meta.env.DEV) {
  const { network } = await import("virtual:msw");
  const { handlers } = await import("./mocks/handlers");

  network.configure({ handlers });
  await network.enable();
}

await import("./app");
```

`network` は、MSW v3 で追加された `defineNetwork()` をもとにプラグインが作成するオブジェクトです。プラグインは Vite の環境ごとに `network` の中身を切り替えます。ブラウザ向けの環境では Service Worker を使い、SSR などのサーバー向けの環境では `msw/node` と同じ Interceptor を使います。そのため、`msw/browser` と `msw/node` のどちらを import するかを意識せずに、同じ `virtual:msw` からモックを設定できます。

`network.configure()` でハンドラーを登録し、`network.enable()` でリクエストの横取りを開始します。`enable()` は Promise を返すため、完了を待ってからアプリケーションを読み込みます。待たずに起動すると、モックの準備より先に初回のリクエストが送信される可能性があります。

`import.meta.env.DEV` は Vite が提供する開発環境の判定用フラグです。`virtual:msw` とハンドラーの動的インポートも条件の内側に置くことで、通常の本番ビルドではこの分岐が除去されるため、モックのコードを含めずに済みます。

### API を呼び出して画面に表示する

実際に `fetch()` で API を呼び出し、取得したユーザー名を画面に表示するコードを試してみましょう。この API は存在しませんが、モックのハンドラーが応答するため、ユーザー名を取得できるはずです。

```ts:src/app.ts
const output = document.querySelector<HTMLParagraphElement>("#user")!;

try {
  const response = await fetch("/api/user");
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const user: { id: string; name: string } = await response.json();
  output.textContent = user.name;
} catch (error) {
  output.textContent = "ユーザーを取得できませんでした";
  console.error(error);
}

export {};
```

画面に `azukiazusa` と表示されており、DevTools の Network タブで `/api/user` のリクエストがモックのレスポンスで返っていることを確認しました。

![](https://images.ctfassets.net/in6v9lxmm5c8/53imGLMsjV2cSETJx2Ouds/05c11cffe275c104a4b1ac4b8797f867/msw-vite-plugin-1.png)

## worker-only で既存の setupWorker を使う

既存の `setupWorker()` を使い続けたい場合は、Vite プラグインの `msw()` に `mode: "worker-only"` を指定します。このモードでは Worker ファイルの配信をプラグインに任せつつ、Worker の設定と開始は自分で行います。`virtual:msw` は利用できません。

`worker-only` モードを使用するため、`vite.config.ts` を以下のように変更します。

```ts:vite.config.ts
import { defineConfig } from "vite";
import { msw } from "msw/vite";

export default defineConfig(({ command }) => ({
  plugins: command === "serve" ? [msw({ mode: "worker-only" })] : [],
}));
```

ここでは開発サーバーを起動するときだけプラグインを登録しています。MSW 3.0.0 の `worker-only` モードは、ビルドにも登録すると Worker ファイルを出力するためです。

Worker の設定には、先ほどと同じハンドラーを使います。`virtual:msw` を使用する方法と異なり、`msw/browser` から `setupWorker()` を呼び出して Worker を作成する必要があります。

```ts:src/mocks/browser.ts
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);
```

`src/main.ts` も、`virtual:msw` を使う処理から、`setupWorker()` で作成した Worker を起動する処理に置き換えます。

```ts:src/main.ts
if (import.meta.env.DEV) {
  const { worker } = await import("./mocks/browser");
  await worker.start();
}

await import("./app");
```

この構成でも、初回の `/api/user` に対してモックのレスポンスが返り、ユーザー名が表示されることを確認しました。

## まとめ

- MSW v3 の Vite プラグインは、インストール済みの MSW から Worker ファイルを配信するため、手動のコピーや更新が不要になる
- デフォルトの `auto` モードでは、`virtual:msw` の `network` にハンドラーを登録してモックを開始する
- 初回の通信を確実にモックするには、`network.enable()` の完了を待ってからアプリケーションを起動する
- `worker-only` モードでは、既存の `setupWorker()` を維持しながら Worker ファイルの配信をプラグインに任せられる

## 参考

- [MSW v3.0.0 リリースノート](https://github.com/mswjs/msw/releases/tag/v3.0.0)
- [Vite integration - Mock Service Worker](https://mswjs.io/guides/integrations/vite)
- [vite API - Mock Service Worker](https://mswjs.io/api/vite)
- [Vite プラグインの導入 PR](https://github.com/mswjs/msw/pull/2781)
- [MSW v3.0.0 の Vite プラグイン実装](https://github.com/mswjs/msw/blob/v3.0.0/src/vite/plugin.ts)
- [Env Variables and Modes - Vite](https://vite.dev/guide/env-and-mode)
