---
id: BEFc8vN6FeKPKCtkiKdY3
title: "ローカル開発中に現れる GET /.well-known/appspecific/com.chrome.devtools.json とは何か"
slug: "chrome-devtools-automatic-workspaces"
about: "Chrome でローカル開発をしていると、開発サーバーへ GET /.well-known/appspecific/com.chrome.devtools.json という見慣れないリクエストが送られることがあります。これは Chrome DevTools がローカルプロジェクトを Workspace として自動検出するためのリクエストです。この記事では、実際にどのように動作するの確認します"
createdAt: "2026-08-29T09:32+09:00"
updatedAt: "2026-08-29T10:50+09:00"
tags: ["Chrome", "DevTools"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4MqDCc2qbX4PNGjJ3ty0HI/6990617bf0452de67c52838ee61c9b13/mountain-hawk-eagle_23969.png"
  title: "クマタカのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "ローカル開発中に com.chrome.devtools.json へのリクエストが 404 になった場合、記事で説明されている判断として正しいものはどれですか？"
      answers:
        - text: "Workspace を利用しないなら、通常は無害なので対応する必要はない"
          correct: true
          explanation: "このリクエストは Chrome DevTools による Workspace の自動検出です。機能を利用しない開発サーバーが 404 を返すのは正しい応答です。"
        - text: "Chrome がマルウェアに感染しているため、直ちにブラウザを削除する"
          correct: false
          explanation: "記事では Chrome DevTools 自身が送る正規のリクエストだと説明しています。404 だけを根拠にマルウェアとは判断できません。"
        - text: "空の JSON を 200 で返し、必ずエラーを隠す"
          correct: false
          explanation: "Workspace を利用しない場合、200 や空の JSON を返す必要はありません。記事では 404 が正しい応答だと説明しています。"
        - text: "本番サーバーにも同じ JSON を配置する"
          correct: false
          explanation: "JSON にはローカルの絶対パスが含まれるため、本番環境では配信しないよう記事で注意しています。"
    - question: "workspace.uuid を開発サーバーの起動ごとに変更してはいけない主な理由は何ですか？"
      answers:
        - text: "UUID が変わると HTTP キャッシュを一切利用できなくなるため"
          correct: false
          explanation: "記事で問題としているのは HTTP キャッシュではなく、Chrome に保存された Workspace の接続許可との対応です。"
        - text: "UUID が変わると CSS の source map を生成できなくなるため"
          correct: false
          explanation: "UUID は Workspace の識別に使われます。source map の生成を制御する値ではありません。"
        - text: "Chrome が保存済みの接続許可を別のプロジェクト設定として扱うため"
          correct: true
          explanation: "Chrome は root と UUID の組み合わせを保存します。UUID が変わると保存済みの許可を使って再接続できません。"
        - text: "UUID を変更すると localhost へアクセスできなくなるため"
          correct: false
          explanation: "UUID は localhost へのネットワーク接続を制御しません。Workspace のプロジェクト識別に使われます。"
    - question: "Vite で Automatic Workspace Folders を利用する方法として、記事で紹介されているものはどれですか？"
      answers:
        - text: "Vite の server.fs.strict を false にする"
          correct: false
          explanation: "記事では server.fs.strict の変更を紹介していません。これは Workspace の JSON を生成する設定ではありません。"
        - text: "特に対応する必要はなく、Vite は既定で JSON を返す"
          correct: false
          explanation: "記事では Vite 本体は JSON を返さないと説明しています。専用プラグインを追加する必要があります。"
        - text: "public に空の com.chrome.devtools.json を置く"
          correct: false
          explanation: "空の JSON には必要な root と UUID がありません。記事では専用プラグインを使う方法を紹介しています。"
        - text: "vite-plugin-devtools-json を Vite の plugins に追加する"
          correct: true
          explanation: "記事では Chrome DevTools チームの vite-plugin-devtools-json をインストールし、Vite 設定へ追加する方法を紹介しています。"

published: true
---

フロントエンドの開発をしているとき、開発サーバーのログで以下のような覚えのないリクエストが記録されているのを見たことがあるのではないでしょうか？

```txt
GET /.well-known/appspecific/com.chrome.devtools.json 404
```

これは Chrome DevTools がローカルプロジェクトを [Workspace](https://developer.chrome.com/docs/devtools/workspaces/) として自動検出するためのリクエストです。
このリクエストは DevTools を開いたときだけ送られ、開発サーバーが 404 を返すのは正しい挙動でこのリクエスト自体は無害です。

開発サーバーで `/.well-known/appspecific/com.chrome.devtools.json` から有効な JSON を返すと Chrome DevTools の Sources パネルとローカルのプロジェクトを簡単に関連付けられます。関連付けた後は、DevTools で編集した HTML、CSS、JavaScript をローカルファイルへ自動で反映できるようになります。

この記事では、このリクエストが送られる理由を確認し、実際に Node.js の開発サーバーから JSON を返して、Chrome DevTools で編集した CSS がローカルファイルへ保存されるところまでを紹介します。さらに Vite と Next.js の React コンポーネントを DevTools から変更し、開発サーバーの画面へ反映されることも確認します。

:::info
Automatic Workspace Folders は Chrome 固有の開発者向け機能であり、Web 標準の API ではありません。
:::

## Chrome DevTools の Workspace 自動検出とは

[Automatic Workspace Folders](https://chromium.googlesource.com/devtools/devtools-frontend/+/main/docs/ecosystem/automatic_workspace_folders.md) は、Chrome DevTools がローカル開発サーバーからプロジェクトの情報を取得し、Workspace の接続候補を自動的に表示する機能です。

DevTools を開いた状態で `localhost` のページを表示すると、Chrome DevTools は同じオリジンの以下の URL へリクエストを送ります。

```txt
/.well-known/appspecific/com.chrome.devtools.json
```

DevTools がこの JSON を取得しようとするのは、検証しているページのオリジンが `localhost` の場合だけです。ローカル開発のための機能であり、`localhost` 以外のページを開いても Chrome がこのリクエストを送ることはありません。

開発サーバーがこの URL を処理しなければ、通常の存在しないパスと同じように 404 が返ります。Chrome DevTools の[トラブルシューティング](https://developer.chrome.com/docs/devtools/automatic-workspaces?hl=ja#ignore_404_errors_on_server)でも、機能を使わない場合、この 404 は無視できると説明されています。

`/.well-known/` は、あるオリジンについて決められたメタデータを取得するための共通の場所です。[RFC 8615](https://datatracker.ietf.org/doc/html/rfc8615) により、HTTP や HTTPS の URL では `/.well-known/` から始まるパスがこの用途のために予約されています。アプリケーションごとに URL を推測する必要がなく、名前の衝突も避けられます。

`appspecific` は、個々のアプリケーションが専用のファイルを置くために [IANA の Well-Known URI レジストリ](https://www.iana.org/assignments/well-known-uris)へ provisional（暫定）登録されている接尾辞です。[`appspecific` の登録文書](https://github.com/Vroo/well-known-uri-appspecific/blob/main/well-known-uri-for-application-specific-purposes.txt)では、ファイル名をアプリケーションが管理するドメイン名に基づいて決めるよう要求しています。

`com.chrome.devtools.json` は `chrome.com` を逆順にした名前空間を使っています。これにより、同じ `appspecific` ディレクトリを使う別のアプリケーションと衝突しにくくなります。

Automatic Workspace Folders は Chrome 135 で追加されました。当初は試験運用のためフラグが必要でしたが、プロジェクト設定の取得は Chrome 136、自動的なファイルシステム接続は Chrome 137 から既定で有効になりました。古い記事にある `chrome://flags` の変更は、現在の Chrome では不要です。

この機能が解決するのは、従来の Workspace 設定が見つけづらく、プロジェクトや別の checkout を開くたびにフォルダを手動で追加・削除する必要があったという問題です。開発サーバーが現在のプロジェクトを通知することで、DevTools はページを開いている間だけ対応するフォルダを接続できます。

## `com.chrome.devtools.json` の内容

開発サーバーは、対象の URL へ次の形式の JSON を返します。

```json
{
  "workspace": {
    "root": "/Users/yourname/path/to/project",
    "uuid": "9a78c0dd-00ed-4b52-8e49-19a8e5cd1543"
  }
}
```

`workspace.root` は、Chrome が動いているコンピューター上のプロジェクトルートを表す絶対パスです。相対パスでは動作しません。開発サーバーがコンテナーや WSL で動いている場合は、サーバー内のパスではなく、Chrome から到達できるパスへ変換する必要があります。

`workspace.uuid` はプロジェクトを識別する有効な UUID です。Chrome のドキュメントではランダムな UUID v4 が推奨されています。

この UUID はリクエストごとに生成してはいけません。Chromium の実装では、ユーザーが許可した `root` と UUID の組み合わせを Chrome のプロファイルへ保存します。同じ組み合わせが再び返されたときは、保存済みの許可を使って Workspace を再接続します。UUID が毎回変わると別のプロジェクト設定として扱われ、再接続できません。

プロジェクトごとにランダムな値を 1 度生成し、開発サーバーのキャッシュなどへ永続化するのが想定された使い方です。

## Node.js の開発サーバーから JSON を返す

ここからは Node.js の標準 API だけを使って動作を確認します。次の例では、HTML と CSS に加えて `com.chrome.devtools.json` を返す開発サーバーを作成します。

```js:server.mjs
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// プロジェクトルートの絶対パスを取得する
const projectRoot = dirname(fileURLToPath(import.meta.url));
// UUID は開発サーバーの起動ごとに変わらないよう固定値を使う
const workspaceUuid = "9a78c0dd-00ed-4b52-8e49-19a8e5cd1543";

const files = new Map([
  ["/", { path: "index.html", type: "text/html; charset=utf-8" }],
  ["/styles.css", { path: "styles.css", type: "text/css; charset=utf-8" }],
]);

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host}`);

  console.log(`${request.method} ${url.pathname}`);

  // URL が /.well-known/appspecific/com.chrome.devtools.json の場合は JSON を返す
  if (
    url.pathname === "/.well-known/appspecific/com.chrome.devtools.json"
  ) {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(
      JSON.stringify({
        workspace: {
          root: projectRoot,
          uuid: workspaceUuid,
        },
      }),
    );
    return;
  }

  // 存在しないパスの場合は 404 を返す
  const file = files.get(url.pathname);
  if (!file) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not Found");
    return;
  }

  // 通常のリクエストの場合は index.html や styles.css を返す
  const content = await readFile(join(projectRoot, file.path));
  response.writeHead(200, { "Content-Type": file.type });
  response.end(content);
});

server.listen(8000, "localhost", () => {
  console.log("Server running at http://localhost:8000");
});
```

`url.pathname` が `/.well-known/appspecific/com.chrome.devtools.json` の場合、開発サーバーは JSON を返すようにしています。JSON の `workspace.root` には、開発サーバーが動作しているコンピューター上のプロジェクトルートの絶対パスを返します。`workspace.uuid` には、開発サーバーの起動ごとに変わらない固定値を使っています。

```js
if (
  url.pathname === "/.well-known/appspecific/com.chrome.devtools.json"
) {
  response.writeHead(200, { "Content-Type": "application/json" });
  response.end(
    JSON.stringify({
      workspace: {
        root: projectRoot,
        uuid: workspaceUuid,
      },
    }),
  );
  return;
}
```

:::warning
このエンドポイントはローカル開発時だけ提供するべきです。DevTools が JSON を取得するのは `localhost` のページに限られるため本番環境でこの機能が働くことはありませんが、配置したファイル自体は誰でも取得できます。本番で公開すると、開発者のユーザー名を含む絶対パスなど、不要な環境情報を外部へ公開するおそれがあります。
:::

## DevTools からローカルファイルを編集する

サーバーを起動し、Chrome で `http://localhost:8000` を開いてから DevTools を開きます。

```bash
node server.mjs
```

このとき、開発サーバーには次のリクエストが記録されました。最後のリクエストが Chrome DevTools による Workspace の自動検出です。

```txt
GET /
GET /styles.css
GET /.well-known/appspecific/com.chrome.devtools.json
```

DevTools の Sources > Workspaces を開くと、`chrome-devtools-automatic-workspaces` という接続候補と「ワークスペースに接続」ボタンが表示されました。

![](https://images.ctfassets.net/in6v9lxmm5c8/6hUJ3KWXyHIaAyMRKqZqys/cabd700acfe0857a135c571feb715de5/image.png)

`chrome-devtools-automatic-workspaces` の「ワークスペースに接続」をクリックすると、「DevTools にファイルの編集を許可しますか？」というダイアログが表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/2akvEU7GVQWRhWZanH5sBz/d9f9fd97781babf7839610d0985fc258/image.png)

「許可する」をクリックすると、Workspace にプロジェクト内のファイルが表示されます。`index.html` と `styles.css` にはネットワーク上のリソースへ対応付けられたことを示す緑色のマークも表示されました。

![](https://images.ctfassets.net/in6v9lxmm5c8/3b2VxtOnn5PfBnxQmK60uD/f63299fd41d8cc87b15597520d9c2887/image.png)

Workspace で `styles.css` を開き、`royalblue` を `tomato` に変更して `Cmd + S` で保存します。その後ファイルを確認すると、`styles.css` の内容が DevTools で変更した通りに更新されていることが確認できました。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/4RnSGfsdZJiSfY8LrEKR2K/41de8363fbe76a8e3239a77c64b4c96d/e974b021-e55d-4d2e-aca2-7f2f0d6bca3a.mov" controls></video>

なお、保存されるのは Workspace にマッピングされたソースファイルへの変更です。Elements パネルで DOM を直接書き換えただけでは、HTML ファイルへ変更は保存されません。ビルドツールが変換したコードを表示している場合は、source map があれば DevTools が元のソースへのマッピングを試みます。

許可している Workspace の一覧は、DevTools の Settings > Workspace で確認できます。不要になった場合は、一覧から削除して接続を解除できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/6SOg9KNSFq5OeWiY9pC2JR/95db0d4ac6fe3691e0b35170de68e0f4/image.png)

## Vite ではプラグインを追加する

2026 年 8 月 29 日時点では、Vite 本体は `com.chrome.devtools.json` のエンドポイントを提供していません。Chrome DevTools チームのリポジトリで公開されている [`vite-plugin-devtools-json`](https://github.com/ChromeDevTools/vite-plugin-devtools-json) を利用できます。

```bash
npm install -D vite-plugin-devtools-json
```

Vite の設定へプラグインを追加します。

```ts:vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import devtoolsJson from "vite-plugin-devtools-json";

export default defineConfig({
  plugins: [react(), devtoolsJson()],
});
```

プラグインは既定で Vite の `config.root` を `workspace.root` として返します。UUID は初回起動時に生成され、その後は Vite のキャッシュへ保存されます。モノレポなどで Vite のルートと Workspace にしたいディレクトリが異なる場合は、`projectRoot` オプションで絶対パスを指定できます。

先に触れたコンテナーや WSL のパスの問題にも対応しており、既定で有効な `normalizeForWindowsContainer` オプションが Linux 側のパスを Chrome から到達できる UNC 形式へ変換します。

Vite 本体へ組み込む案も[議論されました](https://github.com/vitejs/vite/discussions/19623)。しかし Chrome 固有の機能を本体へ含めることや、今後 JSON の用途が増えた場合の変更を Chrome 側で管理しやすくすることから、独立したプラグインを支持する意見が出ています。現時点でも Vite 本体ではなくプラグインとして提供されています。

実際に動作を確認してみましょう。`npm run dev` で開発サーバーを起動し、Sources > Workspaces から `vite-react` へ接続します。Workspace で `src/App.jsx` を開き、`<p>` の文言を変更して保存すると、実際の `src/App.jsx` が更新され、手動でページを再読み込みせずに表示も切り替わりました。このように React のソースコードであっても変更が反映されるのは面白いところですね。

![](https://images.ctfassets.net/in6v9lxmm5c8/1WJyzGQh3uLTB94gvuw4Zx/0616ad04f835dc032b3244f5ece9d5d2/image.png)

## Next.js は開発サーバーが既定で応答する

Next.js は [PR #80260](https://github.com/vercel/next.js/pull/80260) で、開発サーバーが `com.chrome.devtools.json` を返す処理を追加しました。この変更は `15.4.0-canary.76` から入り、安定版では `15.4.1` 以降に含まれています。`15.4.0` は PR がマージされる前に公開されているため、このエンドポイントを持っていない点に注意してください。

`next dev` では追加設定なしで、プロジェクトルートと UUID を含む JSON が返ります。UUID は `.next` 配下のキャッシュへ保存され、ページを再読み込みしても同じ値が使われます。一方、`next build` 後の本番サーバーではこの URL は 404 になります。

独自の挙動に変更したい場合は、`public` ディレクトリや Route Handler から同じパスへレスポンスを返すことで既定の処理を上書きできます。

Next.js の場合も同様に、DevTools で React コンポーネントを編集して保存すると、変更を検知して画面へ反映されることが確認できました。

![](https://images.ctfassets.net/in6v9lxmm5c8/6e64ZO0MILHGWrvRpwnHk1/27053901a2787fdb541d61fe6869456b/image.png)

## まとめ

- `GET /.well-known/appspecific/com.chrome.devtools.json` は、Chrome DevTools がローカルプロジェクトの Workspace を自動検出するために送るリクエストである
- Workspace を利用しない開発サーバーが 404 を返しても、通常は無害であり対応する必要はない
- 有効な `root` と安定した UUID を返すと、Workspace の接続候補が DevTools に表示される
- ユーザーの許可後に DevTools から HTML、CSS、JavaScript をローカルファイルへ保存できる
- Vite では `vite-plugin-devtools-json` を追加でき、Next.js 15.4.1 以降の開発サーバーは既定でエンドポイントを提供する
- 絶対パスの漏えいを防ぐため、`com.chrome.devtools.json` はローカル開発時だけ配信する

## 参考

- [Automatic Workspace connection in Chrome DevTools](https://developer.chrome.com/docs/devtools/automatic-workspaces)
- [Set up workspaces to save changes to source files](https://developer.chrome.com/docs/devtools/workspaces/)
- [Chromium DevTools Ecosystem Guide - Automatic Workspace Folders](https://chromium.googlesource.com/devtools/devtools-frontend/+/main/docs/ecosystem/automatic_workspace_folders.md)
- [Chromium `devtools_file_helper.cc`](https://chromium.googlesource.com/chromium/src/+/main/chrome/browser/devtools/devtools_file_helper.cc)
- [ChromeDevTools/vite-plugin-devtools-json](https://github.com/ChromeDevTools/vite-plugin-devtools-json)
- [[devtools] Implement default `/.well-known/appspecific/com.chrome.devtools.json` endpoint in dev - vercel/next.js](https://github.com/vercel/next.js/pull/80260)
