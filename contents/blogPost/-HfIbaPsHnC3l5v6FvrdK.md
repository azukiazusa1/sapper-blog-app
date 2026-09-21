---
id: -HfIbaPsHnC3l5v6FvrdK
title: "MCP サーバーからエージェントスキルを配布する Skills Extension"
slug: "mcp-skills-extension"
about: "MCP サーバーが提供するツールを使いこなすには、複数のツールを組み合わせる手順や判断基準も必要です。Skills Extension は、こうした知識を記した Agent Skills を MCP 経由で発見・取得するための拡張です。この記事では設計の背景、スキルを段階的に読み込む仕組み、Node.js での実装例と対応状況を紹介します。"
createdAt: "2026-09-21T15:10+09:00"
updatedAt: "2026-09-21T15:10+09:00"
tags: ["MCP", "agent skills"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/7fMneNvqhQLyku8JQXOSni/a90221d41a05d14d25ce7b9ef324d471/sweets_strawberry-short-cake_illust_3603-768x703.png"
  title: "いちごのショートケーキのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "SKILL.md を MCP サーバーから取得する際に使用するメソッドはどれですか？"
      answers:
        - text: "skills/get"
          correct: false
          explanation: "skills/get はスキルのメタデータを返すメソッドであり、SKILL.md の内容を返すものではありません。"
        - text: "skills/list"
          correct: false
          explanation: "skills/list はスキルの一覧を返すメソッドであり、SKILL.md の内容を返すものではありません。"
        - text: "resources/read"
          correct: true
          explanation: "SKILL.md は MCP のリソースとして公開されるため、resources/read で取得します。"
        - text: "resources/get"
          correct: false
          explanation: "resources/get は存在しないメソッドです。SKILL.md の取得には resources/read を使用します。"

published: true
---

MCP（Model Context Protocol）サーバーに接続すると、AI エージェントから外部サービスのツールを呼び出せます。しかし、ツールの説明だけで業務の手順まで伝えられるとは限りません。例えば返金処理では、注文の検索、返金条件の確認、返金の実行といった操作に加えて、どの条件で処理を中断するかという判断も必要です。

こうした手順や判断基準をまとめる方法が [Agent Skills](https://agentskills.io/specification) です。`SKILL.md` に指示を書き、必要な資料やスクリプトとともにディレクトリとして管理します。最近ではプラグインといった仕組みを使用して、スキルと関連するツールを同梱して配布するケースもあります。ツールを提供する MCP サーバーから、そのツールを使うためのスキルも取得できれば、利用者が別々に探して導入する手間を減らせます。

[Skills Extension](https://modelcontextprotocol.io/extensions/skills/overview) は、Agent Skills を MCP 経由で発見・取得するための拡張です。スキルのファイル形式は Agent Skills の仕様をそのまま使い、MCP 側ではメタデータの取得とファイルの読み込みを扱います。2026 年 9 月 21 日時点で [SEP-2640](https://modelcontextprotocol.io/seps/2640-skills-extension) は Final となり、公式の拡張として仕様が公開されています。

この記事では、Skills Extension の設計の背景と通信の仕組みを紹介します。後半ではコードレビュー用のスキルを配布し、クライアントから本文とチェックリストを取得する例を実装します。

## MCP でスキルを配布する理由

Agent Skills では、エージェントが必要な情報を段階的に読み込みます。この仕組みは Progressive disclosure（段階的開示）と呼ばれます。

1. スキルの名前と説明から、今のタスクに使えるかを判断する
2. スキルを使うときに `SKILL.md` の本文を読む
3. 本文から参照される資料やスクリプトを必要に応じて読む

MCP サーバーの `instructions` に長い手順をすべて書く方法では、タスクに関係しない説明まで最初から渡してしまいます。スキルとして分けておけば、必要になった手順だけを読み込めます。また、複数のツールをどの順序で使うかといった知識を、個々のツールの説明とは別に管理できます。[Working Group の問題整理](https://github.com/modelcontextprotocol/ext-skills/blob/main/docs/archive/problem-statement.md)でも、長いワークフロー、スキルの発見、複数サーバーにまたがる手順が課題として挙げられていました。

MCP を配布経路に使うと、サーバーは自分の機能と、その使い方を記したファイルの両方を提供できます。

## スキルを MCP のリソースとして扱う

Skills Extension では、スキルの各ファイルを MCP のリソースとして公開します。リソースとは、URI を指定して内容を読み出せるデータです。ファイルの取得には既存の `resources/read` を使います。

例えば、次のような構成のスキルを考えてみましょう。

```text
code-review/
├── SKILL.md
└── references/
    └── checklist.md
```

このスキルのファイルは、以下の URI に対応付けられます。

| ファイル       | リソースの URI                                |
| -------------- | --------------------------------------------- |
| スキル本文     | `skill://code-review/SKILL.md`                |
| チェックリスト | `skill://code-review/references/checklist.md` |

`SKILL.md` の冒頭には、YAML 形式のメタデータである frontmatter を書きます。親ディレクトリ名は、この frontmatter の `name` と一致させます。

```yaml
---
name: code-review
description: Review code changes using the team's checklist.
metadata:
  version: "1.0"
---
```

チームや用途によって整理したければ、`skill://acme/backend/code-review/SKILL.md` のように前方へパスを追加できます。`SKILL.md` 内の `references/checklist.md` という相対参照は、そのスキルのルートディレクトリを基準に解決します。

`skill://` は推奨される URI スキームですが、必須ではありません。また、`skill://` で始まることだけを理由に、そのリソースをスキルと判断してはいけないことに注意してください。

スキルを識別する際には、配布元サーバーと URI の組み合わせを使います。別々のサーバーが同じ `skill://code-review/SKILL.md` を提供していても、それぞれ異なるスキルです。

### なぜ既存の Resources を使うのか

[設計理由の文書](https://github.com/modelcontextprotocol/ext-skills/blob/main/docs/rationale.md#why-resources-instead-of-a-new-primitive)では、スキルは単なるファイルであり、ファイルを公開するために存在している Resources を使うのが自然であると説明されています。Resources を使えば、URI による指定や `resources/read` を再利用できます。参照ファイルも同じ方法で取得できるため、`SKILL.md` だけを特別扱いする必要がありません。

仕様策定の途中では、一覧を `skill://index.json` というリソースで返す方式や、スキルをアーカイブとしてまとめて配布する方式も検討されていました。[2026 年 6 月 24 日の会議](https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2976)では、独自の一覧形式、アーカイブ展開の複雑さ、スクリプトの実行などを理由に、採決が延期されています。

その後、一覧取得は `skills/list` に変更され、アーカイブ配布は現行仕様から外れました。`skills/list` なら、ほかの一覧取得 API と同じようにページネーションやキャッシュの仕組みを使えます。ファイルを個別のリソースとして取得すれば、必要なファイルだけを読み込めます。

## スキルを発見して内容を読み込む

Skills Extension が追加するメソッドは次の 3 つです。本文の取得には、既存の `resources/read` を組み合わせます。

- `skills/list`:スキルのメタデータを一覧で取得する
- `skills/get`: URI で指定したスキルのメタデータを取得する
- `resources/directory/read`: ディレクトリ直下のファイルやサブディレクトリを取得する

### サーバーが拡張への対応を宣言する

まず、クライアントはサーバーの capabilities（対応機能の宣言）を確認します。リビジョン `2026-07-28` では、[`server/discover`](https://modelcontextprotocol.io/specification/2026-07-28/server/discover) で対応プロトコルや機能を取得します。

Skills Extension に対応するサーバーは、`resources` と `extensions` の `io.modelcontextprotocol/skills` を宣言します。以下は応答の `capabilities` 部分です。

```json
{
  "resources": {},
  "extensions": {
    "io.modelcontextprotocol/skills": {}
  }
}
```

`io.modelcontextprotocol/skills` の値が空のオブジェクトであることは、任意の機能なしで拡張に対応していることを表します。`resources/directory/read` を実装するサーバーは、ここで `directoryRead: true` を宣言します。

### `skills/list` でメタデータを一覧取得する

拡張への対応を確認したら、クライアントは `skills/list` を呼び出します。レスポンスの `skills` 配列には、スキルごとに以下の情報が含まれます。

| フィールド    | 内容                                                                          |
| ------------- | ----------------------------------------------------------------------------- |
| `uri`         | `SKILL.md` の URI                                                             |
| `frontmatter` | `SKILL.md` の YAML frontmatter を JSON オブジェクトにしたもの                 |
| `resources`   | スキルに含まれる全ファイルの URI・SHA-256・バイト数の一覧、または `"dynamic"` |

`frontmatter` は `name` と `description` だけでなく、ほかのフィールドも保持します。これにより、ホストは各ファイルを取得しなくても、メタデータからスキルのカタログを作れます。

`resources` の配列はファイルのマニフェストです。マニフェストとは、ここでは配布するファイルとその内容を照合するための一覧を指します。`SKILL.md` 自体を含め、すべてのファイルを過不足なく列挙します。SHA-256 は、内容の違いを照合するためのハッシュ値を計算する方式です。各ファイルの `digest` は `sha256:` に続く 64 桁の小文字の 16 進数、`size` は生のファイル内容のバイト数です。

マニフェストがあるのは、ホストが受け取った内容を検証するためです。ホストは `resources` に載っているファイルを取得したら、`digest` と `size` を照合します。一致しなければ、内容が壊れているか、改変されたか、エントリーを取得した後にスキルが更新されたかのいずれかなので、その内容を使ってはいけません。`SKILL.md` については、取得した frontmatter をエントリーの `frontmatter` とフィールド単位で比較し、食い違えば読み込みを中止します。

一覧のレスポンスには、処理の完了を表す `resultType: "complete"` と、キャッシュの有効期間・共有範囲を示す `ttlMs`・`cacheScope` も必要です。`nextCursor` が返された場合は、次のリクエストの `cursor` に渡して続きを取得します。1 つのスキルのマニフェストが複数ページに分かれることはありません。

### `skills/get` で 1 つのスキルのメタデータを取得する

`skills/get` は、指定した URI に対応するスキルのメタデータを返します。返される `skill` は `skills/list` の各要素と同じ形です。

`skills/get` が必要になるのは、例えばユーザーやサーバーの `instructions` からスキルの URI を直接渡された場合です。サーバーは空または一部だけの一覧を返してよいため、一覧にないスキルでも、URI を指定すればメタデータを取得できるようにします。ファイルが更新されたとき、1 つのスキルの最新のマニフェストだけを取り直す用途にも使います。

### 本文と参照ファイルを取得する

本文や参照ファイルは `resources/read` で取得します。基本的な流れは次のようになります。

1. `server/discover` を送り、サーバーが Skills Extension に対応しているか確認する
2. `skills/list` を送り frontmatter とファイルのマニフェストを取得する
3. 利用するスキルを選び、ユーザーの承認やホストのポリシーに従って、そのスキルを読み込んでよいか確認する
4. `resources/read` で `SKILL.md` を取得する
5. 必要になった参照ファイルを `resources/read` で取得する

`resources/read` で `SKILL.md` を取得するだけでは、スキルは有効になりません。スキルとして有効にするには、ホストのスキル読み込み処理を通し、内容を検証し、必要なユーザー承認を得ます。

## Node.js でスキルの配布と取得を試す

それでは、コードレビュー用のスキルを提供するサーバーと、読み取り用のクライアントを実装してみましょう。サーバーは Node.js の標準入出力で JSON-RPC を処理し、クライアントには公式 TypeScript SDK を使います。

作業用のディレクトリを作成し、依存関係をインストールします。

```bash
mkdir mcp-skills-demo
cd mcp-skills-demo
npm init -y
npm install --save-exact @modelcontextprotocol/client@2.0.0 @modelcontextprotocol/core@2.0.0 yaml@2.8.3
mkdir -p skills/code-review/references
```

`skills/code-review/SKILL.md` を作成します。本文から `references/checklist.md` を参照する構成です。

```markdown:skills/code-review/SKILL.md
---
name: code-review
description: Review code changes using the team's checklist.
metadata:
  version: "1.0"
---

# Code review

Read [the checklist](references/checklist.md), then review the provided diff.
Report findings with the affected lines, the reason, and a suggested fix.
```

続いて、レビュー時に参照するチェックリストを作成します。

```markdown:skills/code-review/references/checklist.md
# Review checklist

- Does the change handle empty input?
- Does the change preserve existing behavior?
- Do the tests cover the intended behavior?
```

ここまでの 2 ファイルは通常の Agent Skills と同じ形式です。MCP 用のフィールドを `SKILL.md` に追加する必要はありません。

### スキルを配布するサーバーを作成する

次に `server.mjs` を作成します。ファイルを起動時に読み込み、その同じバイト列からマニフェストと読み取り応答を作ります。

```js:server.mjs
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { createInterface } from "node:readline";
import { parse } from "yaml";

// SKILL.md の YAML frontmatter からメタデータを抽出する
function frontmatter(markdown) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(markdown);
  if (!match) throw new Error("YAML frontmatter is required");
  return parse(match[1]);
}

const extension = "io.modelcontextprotocol/skills";
const root = "skill://code-review";
const uri = `${root}/SKILL.md`;
const paths = ["SKILL.md", "references/checklist.md"];
const files = new Map();
// ローカルのファイルを読み込み、URI に対応付ける
for (const path of paths) {
  const bytes = await readFile(
    new URL(`./skills/code-review/${path}`, import.meta.url),
  );
  files.set(`${root}/${path}`, bytes);
}
// skills/list, skills/get で返すスキルの情報を作る
const skill = {
  uri,
  frontmatter: frontmatter(files.get(uri).toString("utf8")),
  resources: [...files].map(([uri, bytes]) => ({
    uri,
    digest: `sha256:${createHash("sha256").update(bytes).digest("hex")}`,
    size: bytes.length,
  })),
};

// キャッシュの有効期間と共有範囲を指定して返すヘルパー関数
// ttlMs: 0 は、応答を使い回さずその都度取得してよいという指定
const cached = (value) => ({
  resultType: "complete",
  ...value,
  ttlMs: 0,
  cacheScope: "public",
});
const invalid = (message) => {
  throw { code: -32602, message };
};

function dispatch(method, params = {}) {
  switch (method) {
    // skills extension に対応していることを宣言する
    case "server/discover":
      return cached({
        supportedVersions: ["2026-07-28"],
        capabilities: {
          resources: {},
          extensions: { [extension]: {} },
        },
        _meta: {
          "io.modelcontextprotocol/serverInfo": {
            name: "skills-example",
            version: "1.0.0",
          },
        },
      });
    case "ping":
      return { resultType: "complete" };
    // スキルのメタデータ一覧を返す
    case "skills/list":
      return cached({ skills: [skill] });
    // URI で指定したスキルのメタデータを返す
    case "skills/get":
      if (params.uri !== uri) invalid("Unknown skill");
      return cached({ skill });
    case "resources/list":
      return cached({
        resources: [...files.keys()].map((uri) => ({
          uri,
          name:
            uri === skill.uri ? skill.frontmatter.name : uri.split("/").at(-1),
          mimeType: "text/markdown",
          ...(uri === skill.uri
            ? { description: skill.frontmatter.description }
            : {}),
        })),
      });
    case "resources/templates/list":
      return cached({ resourceTemplates: [] });
    // URI で指定したリソースの内容を返す。SKILL.md も参照ファイルもここで返す
    case "resources/read": {
      const bytes = files.get(params.uri);
      if (!bytes) invalid("Unknown resource");
      return cached({
        contents: [
          {
            uri: params.uri,
            mimeType: "text/markdown",
            text: bytes.toString("utf8"),
          },
        ],
      });
    }
    default:
      throw { code: -32601, message: "Method not found" };
  }
}

// stdio では、1 行につき 1 つの JSON-RPC メッセージを送受信する。
const lines = createInterface({ input: process.stdin });
for await (const line of lines) {
  let request;
  let response;
  try {
    request = JSON.parse(line);
    if (!("id" in request)) continue;
    const result = dispatch(request.method, request.params);
    response = { jsonrpc: "2.0", id: request.id, result };
  } catch (error) {
    response = {
      jsonrpc: "2.0",
      ...(request?.id != null ? { id: request.id } : {}),
      error: {
        code: error.code ?? (error instanceof SyntaxError ? -32700 : -32603),
        message: error.message ?? "Internal error",
      },
    };
  }
  process.stdout.write(`${JSON.stringify(response)}\n`);
}
```

この実装の中心は、`skill` オブジェクトと `dispatch()` の `switch` 文です。クライアントのリクエストのメソッド名に応じて、処理を分岐します。

- `server/discover`: Skills Extension に対応していることを宣言する
- `skills/list`: スキルのメタデータ一覧を返す
- `skills/get`: URI で指定したスキルのメタデータを返す
- `resources/read`: URI で指定したリソースの内容を返す。`SKILL.md` も参照ファイルもここで返す

なお、標準出力は JSON-RPC メッセージ専用です。サーバー側でデバッグログを出す場合は `console.error()` などで標準エラー出力へ送ってください。

### クライアントから読み込む

最後に `client.mjs` を作成します。`skills/list` でスキルを探し、`resources/read` で `SKILL.md` を取得して表示する動作確認用のクライアントです。SDK の `StdioClientTransport` がサーバーを子プロセスとして起動します。

```js:client.mjs
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";
import { ResultSchema } from "@modelcontextprotocol/core";

const extension = "io.modelcontextprotocol/skills";
const client = new Client(
  { name: "skills-reader", version: "1.0.0" },
  {
    // クライアントが Skills Extension を扱うことを宣言する。
    capabilities: { extensions: { [extension]: {} } },
    // サンプルで使う MCP のプロトコルバージョンを指定する。
    versionNegotiation: { mode: { pin: "2026-07-28" } },
  },
);
// 同じディレクトリの server.mjs を Node.js で起動するための設定。
const transport = new StdioClientTransport({
  command: process.execPath,
  args: [fileURLToPath(new URL("./server.mjs", import.meta.url))],
});

try {
  // サーバーを起動し、標準入出力を使って接続する。
  await client.connect(transport);
  // スキルのメタデータ一覧を取得する。本文はまだ取得しない。
  const { skills } = await client.request(
    { method: "skills/list", params: {} },
    ResultSchema,
  );
  // frontmatter の name を使って、今回読みたいスキルを選ぶ。
  const skill = skills.find(
    (entry) => entry.frontmatter.name === "code-review",
  );
  if (!skill) throw new Error("code-review skill was not found");
  console.log(`Discovered: ${skill.uri}`);

  // 一覧で得た URI を指定して、SKILL.md の本文を取得する。
  const { contents } = await client.readResource({ uri: skill.uri });
  // 応答に含まれるテキストを表示する。
  for (const content of contents) {
    if ("text" in content) console.log(content.text);
  }
} finally {
  // エラーが起きた場合も接続を閉じ、子プロセスを終了する。
  await client.close();
}
```

`versionNegotiation` で `2026-07-28` を指定すると、このバージョンへの対応を確認して接続します。SDK はリクエストごとに必要なプロトコルバージョンやクライアント情報を `params._meta` へ付与します。

`skills/list` は汎用の `client.request()`、`resources/read` は SDK の `client.readResource()` で呼び出します。一覧に含まれる URI を使って、そのスキルの本文を取得できます。

### 実行結果を確認する

以下のコマンドで実行します。

```bash
node client.mjs
```

実行すると、スキルの URI と `SKILL.md` の内容が表示されます。

```text
Discovered: skill://code-review/SKILL.md
---
name: code-review
description: Review code changes using the team's checklist.
metadata:
  version: "1.0"
---

# Code review

Read [the checklist](references/checklist.md), then review the provided diff.
Report findings with the affected lines, the reason, and a suggested fix.
```

これで、サーバーが公開したスキルを一覧から探し、本文を取得できることを確認できました。

## MCP Inspector の画面で確認する

[MCP Inspector](https://github.com/modelcontextprotocol/inspector) は、MCP サーバーの動作を確認するための開発者ツールです。v2.6.0 以降では、Skills Extension に対応しています。Inspector を使うと、一覧の取得・本文の表示に加えて、配布したファイルの整合性も画面上で確認できます。

### サーバーへ接続する

`server.mjs` を作成したディレクトリで、次のコマンドを実行します。

```bash
npx --yes @modelcontextprotocol/inspector@2.7.0 --web --protocol-era modern node server.mjs
```

`--web` はブラウザーの画面を起動する指定です。`--protocol-era modern` は、このサンプルが使う `server/discover` による接続方式を指定します。2.7.0 の既定値は `legacy` なので、このオプションを付けてください。

ブラウザーが開いたら、Servers 画面の `node` のスイッチをオンにします。ブラウザーが自動で開かない場合は、ターミナルに表示された URL を開いてください。Inspector がサーバーを起動するため、別のターミナルで `node server.mjs` を実行する必要はありません。

接続に成功すると、`Connected` とプロトコルバージョン `MCP 2026-07-28` が表示され、上部に Skills タブが現れます。

![MCP Inspector の Servers 画面。node server.mjs が Connected になり、MCP 2026-07-28 と表示されている](https://images.ctfassets.net/in6v9lxmm5c8/2I23iCyAB9eCBhYWKn6Hva/03834412fad54fb904f43f68627202eb/mcp-skills-extension-1.png)

### スキルの一覧と本文を確認する

Skills タブを開き、左側の一覧から `code-review` を選びます。スキルの説明や frontmatter、配布するファイルの一覧が表示されます。Skill Resource 欄には、取得した `SKILL.md` の本文が Markdown として表示されます。

![Skills タブで code-review を選択し、Skill Resource 欄に Code review の本文が表示されている](https://images.ctfassets.net/in6v9lxmm5c8/1cWO5r4ycgvRMrxa2EUTFx/9db289a58ec0f1d1cde36520e0c47338/mcp-skills-extension-2.png)

### ファイルの内容を検証する

`Fetch with skills/get` を押すと、選択した URI でメタデータを再取得できます。今回のサーバーでは、Conformance 欄に `skills/get matches skills/list` と表示され、一覧と同じスキル情報を返していることを確認できました。

続いて `Verify all` を押し、Resources 欄を開きます。これはマニフェストに含まれる全ファイルを取得して検証する操作です。今回の例では、`SKILL.md` と `references/checklist.md` の両方が `VERIFIED` になりました。

![Resources 欄に SKILL.md と checklist.md が並び、両方の Verification が VERIFIED になっている](https://images.ctfassets.net/in6v9lxmm5c8/kduVOjrvtS2wP9Ie3PHJE/697d1b849296321e83c319d8fdda1aed/mcp-skills-extension-3.png)

このように、Inspector を使えば、一覧の取得・本文の表示に加えて、配布したファイルの整合性も画面上で確認できます。

## まとめ

- Skills Extension は、Agent Skills のファイル形式を使い、MCP サーバーからスキルのメタデータと内容を提供する拡張
- `skills/list` と `skills/get` はメタデータを取得し、`resources/read` は本文や参照ファイルを取得する
- スキルは配布元サーバーと URI の組み合わせで識別し、本文と参照ファイルは必要になったときに取得する

## 参考

- [Skills - Model Context Protocol](https://modelcontextprotocol.io/extensions/skills/overview)
- [modelcontextprotocol/ext-skills](https://github.com/modelcontextprotocol/ext-skills)
- [Skills Extension の stable 仕様](https://github.com/modelcontextprotocol/ext-skills/blob/main/specification/stable/skills.mdx)
- [SEP-2640: Skills Extension](https://modelcontextprotocol.io/seps/2640-skills-extension)
- [Agent Skills specification](https://agentskills.io/specification)
- [Skills Over MCP の設計理由](https://github.com/modelcontextprotocol/ext-skills/blob/main/docs/rationale.md)
- [Skills Over MCP の決定記録](https://github.com/modelcontextprotocol/ext-skills/blob/main/docs/decisions.md)
- [MCP Core Maintainer Meeting - June 24, 2026](https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2976)
- [Extension Support Matrix](https://modelcontextprotocol.io/extensions/client-matrix)
- [Skills Extension の実装一覧](https://github.com/modelcontextprotocol/ext-skills/blob/main/docs/implementations.md)
  