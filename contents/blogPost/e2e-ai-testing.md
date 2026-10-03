---
id: 4mkYbGo4iDwa423R9EnnO
title: "自然言語で操作し、結果を検証するテストフレームワーク e2e"
slug: "e2e-ai-testing"
about: "e2e は自然言語による操作と、要素を指定した操作・アサーションを組み合わせられるテストフレームワークです。この記事では Todo アプリを対象に、AI に操作を任せて結果をコードで検証するテストを作成します。"
createdAt: "2026-10-02T12:52+09:00"
updatedAt: "2026-10-03T17:26+09:00"
tags: ["テスト", "AI", "playwright"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/6DHX1P0mHD80xtFeWeg8Iz/5d78f033da991439fa40f87fd513e9c9/food_katsudon_7648-768x576.png"
  title: "food katsudon 7648-768x576"
audio: null
selfAssessment:
  quizzes:
    - question: "e2e で自然言語で操作を指示するメソッドはどれですか？"
      answers:
        - text: "agent.act()"
          correct: true
          explanation: "agent.act() に操作の目標を渡すと、AI エージェントが画面を確認して操作を実行します。"
        - text: "agent.action()"
          correct: false
          explanation: "agent.action() というメソッドは存在しません。"
        - text: "agent.assert()"
          correct: false
          explanation: "agent.assert() は、操作の結果を検証するためのメソッドです。"
        - text: "agent.prompt()"
          correct: false
          explanation: "agent.prompt() というメソッドは存在しません。"
    - question: "実行ごとに名前を変えるテストで、params の値に unique() を使う目的はどれですか？"
      answers:
        - text: "入力する名前としてランダムな文字列を自動生成する"
          correct: false
          explanation: "unique() 自体は値を生成しません。"
        - text: "名前の値を秘密情報としてモデルから隠す"
          correct: false
          explanation: "unique() は値を実行ごとに差し替え可能にするための指定で、秘密情報として隠すためのものではありません。"
        - text: "キャッシュミスを防ぐために、実行ごとに変わる値を指定する"
          correct: true
          explanation: "通常の params は値が変わるとキャッシュミスになります。unique() は実行ごとに変わるデータを指定し、再生時に今回の値を使えるようにします。"
        - text: "以前のテストが作成したデータを自動的に削除する"
          correct: false
          explanation: "異なる名前を使っても、データの削除や環境の分離は別途必要です。"
published: true
---
E2E（End-to-End）テストでは、ユーザーがアプリケーションを操作する一連の流れを検証します。Playwright などを使えば操作を自動化できますが、入力欄やボタンを指定して手順を書く必要があります。これは画面の構成が変わったときには、その手順の修正も必要になることを意味します。そのため、効果は高いものの、テストの作成や保守に手間がかかるという見方が一般的でした。

[e2e](https://tester.army/e2e) は、操作の目標を自然言語で記述できるテストフレームワークです。「Todo を追加する」といった目標を渡すと、AI エージェントが画面を確認し、必要な操作を選びます。そのため、特定のボタンをクリックするという具体的な手順に依存せずに、特定の機能が正しく動作するかという観点でテストを作成できるという特徴があります。また同じテストの中で、要素を指定した操作や通常のアサーションも使用できます。

この記事では、シンプルな Todo アプリを使って、自然言語で操作し、結果をコードで検証するテストを作成します。さらに、検証済みの操作をキャッシュして再実行する仕組みを確認します。

:::warning
2026 年 10 月 2 日時点で、e2e は 1.0 に向けて開発中です。マイナーバージョンでも API や設定が変更される可能性があります。
:::

## e2e でテストを書く

e2e のテストは TypeScript で記述します。e2e は自然言語による操作と要素を指定する操作の両方を提供しています（[公式ドキュメント](https://e2e.tester.army/docs)）。まずはテストの完成形を見てみましょう。

```ts:tests/todo.e2e.ts
import { test, expect } from "e2e";

test("自然言語で Todo を追加する", async ({ app, agent, screen }) => {
  await app.open("/");

  await agent.act("Todo に「牛乳を買う」を追加してください");

  await expect(screen.getByRole("listitem")).toHaveText("牛乳を買う");
  await expect(screen.getByRole("status")).toHaveText("1 件の Todo");
});
```

`app.open()` でテスト対象のページを開き、`agent.act()` に操作の目標を渡しています。操作の指示は通常の文字列で記述できます。この例では、入力欄への入力と追加ボタンの操作をエージェントに任せています。

操作の結果は `expect()` によるアサーションで検証しています。`screen.getByRole()` は、ボタンやリスト項目などの役割で要素を特定するロケーターを返します。ロケーターとは、操作・検証対象の要素を指定するオブジェクトです。`toHaveText()` では、その要素のテキストが期待する値になるかを確認します。要素の検証の書き方は Playwright と同じですね。

なお、検証も自然言語で記述できます。期待する状態を自然言語で `agent.assert()` に渡すと、モデルが画面を確認して目標が達成されているかを判定します。

```ts
await agent.assert("Todo に「牛乳を買う」が追加されていることを確認してください");
```

### エージェントは何を見て操作するのか

[エージェントの動作の解説](https://e2e.tester.army/docs/agent-steps)によると、モデルは画面の情報を読み、「次に何を操作するか」「目標を達成できたか」を判断します。実際のテストの実行を担当するのは、`npx e2e run` で起動する e2e のテスト実行プログラム（ランナー）です。

たとえば、`agent.act()` に Todo の追加を指示すると、モデルには要素の役割・名前・テキスト・状態などを含む画面のスナップショットが渡されます。モデルはその情報から「この入力欄に『牛乳を買う』と入力する」と判断し、操作を要求します。ランナーはその要求を検証し、Web 用エンジンを通じてブラウザに入力します。Web 用エンジンの `@e2e-dev/web` は、内部で Playwright を使ってブラウザを操作します。モバイル用の `@e2e-dev/mobile` もあり、こちらは agent-device を使って iOS シミュレーターや Android エミュレーターを操作します。

操作後の画面の情報は再びモデルに渡されます。モデルが「次は追加ボタンを押す」と判断すると、ランナーが Web 用エンジンを通じてボタンを押します。このように、モデルによる判断とランナーによる実行を繰り返して、目標の達成を目指します。テストに記述した `expect()` によるアサーションも、ランナーが実行します。

テキストの情報だけでは足りない場合、エージェントはスクリーンショットを要求できます。

## テスト環境の準備

e2e を使用したテストをセットアップしてみましょう。Node.js 22.12 以上が必要です。依存パッケージと Chromium をインストールします。

```bash
npm init -y
npm install --save-dev --save-exact e2e@0.15.1 @e2e-dev/web@0.11.1 playwright@1.63.0 ai@7.0.127 @ai-sdk/openai@4.0.71
npx playwright install chromium
```

`e2e` がテストランナー、`@e2e-dev/web` が Web 用エンジンです。`ai` と `@ai-sdk/openai` は、エージェントがモデルを呼び出すために使用します。公式には対話形式の `npx e2e init` も用意されていますが、ここでは学習のために手動で設定します。

テスト対象として、入力した文字列をリストに追加する HTML を作成します。

![](https://images.ctfassets.net/in6v9lxmm5c8/GgSRmxK1mPD5zbJAOmI0o/1070dd89a6254196808a1f7fcc4ad8fc/e2e-ai-testing-1.png)

<details>

<summary>index.html</summary>

```html:index.html
<!doctype html>
<html lang="ja">
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Todo</title>
  <main>
    <h1>Todo</h1>
    <form>
      <label for="title">やること</label>
      <input id="title" name="title" required />
      <button type="submit">追加</button>
    </form>
    <ul aria-label="Todo 一覧"></ul>
    <p role="status">0 件の Todo</p>
  </main>
  <script type="module">
    const form = document.querySelector("form");
    const input = document.querySelector("input");
    const list = document.querySelector("ul");
    const status = document.querySelector('[role="status"]');

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const title = input.value.trim();
      if (!title) return;

      const item = document.createElement("li");
      item.textContent = title;
      list.append(item);
      status.textContent = `${list.children.length} 件の Todo`;
      form.reset();
    });
  </script>
</html>
```

</details>

続いて、HTML を配信するサーバーを作成します。このサーバーは `node server.mjs` で起動します。

<details>

<summary>server.mjs</summary>

```js:server.mjs
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("./index.html", import.meta.url));
const server = createServer((request, response) => {
  if (request.url !== "/") {
    response.writeHead(404).end("Not found");
    return;
  }
  response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  response.end(html);
});

server.listen(4317, "127.0.0.1", () => {
  console.log("Todo app: http://127.0.0.1:4317");
});
```

</details>

`http://127.0.0.1:4317` で Todo アプリを配信します。サーバーの起動と停止は、次に設定する e2e のランナーに任せます。

## e2e の設定とモデルの接続

`e2e.config.ts` に、実行するエンジン、テスト対象アプリ、モデルを設定します。

```ts:e2e.config.ts
import type { E2EConfig } from "e2e";
import { web } from "@e2e-dev/web";
import { openai } from "@ai-sdk/openai";

export default {
  workers: 1,
  retries: 0,
  agents: {
    default: {
      model: openai(process.env.E2E_MODEL ?? "gpt-6-luna"),
    },
  },
  targets: [
    {
      name: "chromium",
      engine: web({ browser: "chromium" }),
      app: {
        url: "http://127.0.0.1:4317",
        command: { executable: "node", args: ["server.mjs"] },
      },
    },
  ],
} satisfies E2EConfig;
```

`targets` はテストの実行先です。ここでは `chromium` という名前で Web 用エンジンを 1 つ設定しています。`app.command` を指定すると、ランナーがサーバーを起動し、`app.url` が応答してからテストを開始します。実行後にはサーバーを停止します。

`agents.default.model` は、エージェントが使用するモデルです。ここでは AI SDK の OpenAI プロバイダーを使います。OpenAI の API キーを使用する方法以外にも[モデルの設定](https://e2e.tester.army/docs/models)では、Vercel AI Gateway、OpenRouter、もしくは API キーを使用せずにモデルプロバイダーのサブスクリプションを使う方法もあります。

今回は実行するターミナルに `OPENAI_API_KEY` を設定します。次の `your-api-key` は自身の API キーに置き換えてください。

```bash
export OPENAI_API_KEY="your-api-key"
```

:::note
e2e は `.env` ファイルを自動で読み込みません。環境変数をターミナルで設定するか、設定ファイル内で `process.loadEnvFile(".env")` を呼び出します。API キーをテストコードへ直接書き込まないようにしてください。モデルの呼び出しには利用料金が発生します。
:::

## 自然言語による操作を実行する

冒頭のテストを `tests/todo.e2e.ts` に保存して実行します。e2e はデフォルトで `tests/` 以下の `*.e2e.ts` をテストとして探索します。ここではファイルを指定して、1 つのテストだけを実行します。

```bash
npx e2e run tests/todo.e2e.ts
```

操作を画面で確認したい場合は `--headed` を付けます。実行結果はデフォルトで `.e2e/report.json` に保存されます。

この JSON には、テストごとの成否、各ステップの処理時間、モデルの呼び出し回数、キャッシュの利用状況などが記録されます。動画やトレースを記録した場合は、それらのファイルへの参照も含まれます。`run.results` から対象のテストを探すと、`attempts` に実行ごとの結果があり、その中の `steps` で `app.open()`、`agent.act()`、アサーションの結果を確認できます。

```json
{
  "api": "agent.act",
  "status": "passed",
  "durationMs": 6901,
  "cache": {
    "mode": "missed",
    "reason": "no-entry",
    "replayedActions": 0,
    "totalActions": 0
  },
  "turns": [
    {
      "index": 1,
      "calls": [
        "type({\"target\":\"n5\",\"value\":\"牛乳を買う\",\"replace\":false})"
      ]
    },
    {
      "index": 2,
      "calls": [
        "tap({\"target\":\"n6\"})"
      ]
    },
    {
      "index": 3,
      "calls": [
        "complete_step({\"status\":\"passed\",\"summary\":\"「牛乳を買う」を Todo に追加しました。リストに表示され、Todo 件数が「1 件の Todo」になっています。\"})"
      ]
    }
  ]
}
```

`agent.act()` のステップにある `turns` を読むと、実際には次の順序で進んだことがわかります。

1. モデルが「やること」という入力欄を選び、`type` で「牛乳を買う」の入力を要求。ランナーが入力し、入力欄の値が変わったという画面の情報をモデルへ返す
2. モデルが「追加」ボタンを選び、`tap` を要求。ランナーがボタンを押すと、リストに「牛乳を買う」が追加され、件数が「0 件の Todo」から「1 件の Todo」に変わった
3. モデルが更新後の画面を確認し、`complete_step` で成功を報告。ここで `agent.act()` のステップが終了した

実際の操作の様子は、次の動画で確認できます。

!v(https://videos.ctfassets.net/in6v9lxmm5c8/7vZ7JgjoPgOwY0ukNa1dJn/2b098e557a2327048ab4e04e4bd6d8a5/e2e-ai-testing-2.mp4 640x320)

リストに「牛乳を買う」が表示され、件数が「1 件の Todo」になりました。画面上の変化に加え、テストのアサーションも成功しています。

### 要素を指定するテストと組み合わせる

AI に任せる必要のない操作は、`screen` の API で記述できます。同じ Todo の追加を、入力欄とボタンを指定して実行する例です。

```ts:tests/todo-deterministic.e2e.ts
import { test, expect } from "e2e";

test("要素を指定して Todo を追加する", async ({ app, screen }) => {
  await app.open("/");

  await screen.getByRole("textbox", { name: "やること" }).fill("牛乳を買う");
  await screen.getByRole("button", { name: "追加" }).tap();

  await expect(screen.getByRole("listitem")).toHaveText("牛乳を買う");
  await expect(screen.getByRole("status")).toHaveText("1 件の Todo");
});
```

このテストはモデルを呼び出さないため、API キーなしでも実行できます。

```bash
npx e2e run tests/todo-deterministic.e2e.ts
```

e2e では、1 つのテストの中でこのような操作と `agent.act()` を混在させられます。操作手順が固定されている箇所は要素を指定し、複数の操作を目標として表現したい箇所は自然言語にする、といった使い分けができます。

## 検証済みの操作をキャッシュして再実行する

自然言語で操作するたびにモデルを呼び出すと、応答を待つ時間と利用料金がかかります。e2e は[リプレイキャッシュ](https://e2e.tester.army/docs/cache)と呼ばれる仕組みを採用しています。リプレイキャッシュは、`agent.act()` で実行した操作を記録し、次の実行で再利用することで、モデルの呼び出しを省略します。期待される結果が確認できなくなった場合は、キャッシュを使わずにモデルを呼び出して操作を補います。

記録には、`agent.act()` の後に結果の検証が成功する必要があります。今回の `expect(screen.getByRole("listitem")).toHaveText(...)` のような、ロケーターに対するアサーションが該当します。エージェントが操作を成功と判断しただけでは記録されません。

同じテストをもう一度実行してみましょう。

```bash
npx e2e run tests/todo.e2e.ts
```

今回の実行では、再実行時に入力と追加の 2 操作が再生され、モデル呼び出しは 0 回になりました。2 つのアサーションも再び成功しています。

| 実行 | `agent.act()` の処理時間 | モデル呼び出し | キャッシュの結果 |
| --- | --- | --- | --- |
| 初回 | 6.90 秒 | 3 回 | `1 missed` |
| 再実行 | 169 ミリ秒 | 0 回 | `1 replayed` |

### キャッシュが使われる条件と注意点

テスト名、ターゲット名、指示などがキャッシュの識別に使われます。これらが変わるとキャッシュに一致しなくなります。今回の Todo は、ページを開くたびに空のリストから始まり、毎回同じ入力値を使うため、再実行を確認しやすい構成です。

具体的には、次のような変更でキャッシュミスになります。

- `test()` の名前を「自然言語で Todo を追加する」から「Todo を登録する」に変更する。
- `agent.act()` の指示に含める Todo の名前を「牛乳を買う」から「パンを買う」に変更する。
- `params` に、実行のたびに異なるメールアドレスや日時を渡す。
- 設定のターゲット名を変更する、または Web 用エンジンのマイナー・メジャーバージョンを更新する。

一致する記録が存在しても、現在の画面では再生できなくなる場合もあります。たとえば、次のような状況です。

- 記録時に押した「追加」ボタンがなくなり、待っても表示されない
- 同じ特徴のボタンが増え、記録時の操作対象を区別できない
- 入力とクリックは完了したが、記録時には現れたリスト項目が表示されない

再利用できなかった理由は、レポートの該当ステップにある `cache.reason` で確認できます。たとえば識別に一致する記録がなければ `no-entry`、画面の状態が変わって記録時の操作対象が見つからなければ `target-not-found` になります。キャッシュが使えなかった場合は、モデルを呼び出して操作を補います。

ローカルでは、保存済みの操作を再生し、新しく検証できた操作もキャッシュに保存します。一方、CI のデフォルト動作では保存済みのキャッシュを再利用するだけで、新しい記録は保存しません。

キャッシュを使わずにモデルの操作を確認する場合は、`--no-cache` を指定します。

```bash
npx e2e run tests/todo.e2e.ts --no-cache
```

また、既存の記録が画面の変更で再生できなくなったことを検出したい場合は `--strict-cache` を指定できます。UI の変更後もエージェントが補ってテストを通すため、モデル呼び出しの増加に気付きにくいという問題に対応するためのオプションです。

## 毎回異なるテストデータで操作を再利用する

ここまでの Todo アプリは、ページを開くたびにデータが消えるため、固定の「牛乳を買う」でテストできます。一方、実際の E2E テストでは、操作した結果がサーバーのデータベースに保存されることが多くあります。前回のテストで作成したデータが残っていると、同じメールアドレスでのユーザー登録が重複エラーになったり、以前作った同名の項目を今回の結果と取り違えたりする可能性があります。複数のテストを並列で実行すると、同じ名前のデータが互いに干渉することもあります。

このような状況を避けるため、テストごとにランダムに生成した異なる値を使うプラクティスがよく使われています。

e2e では `agent.act()` の `params` を使うと、操作の指示と、そこに渡すデータを分けて記述できます。たとえば、次のように毎回異なる Todo の名前を渡せます。

```ts
const title = `牛乳を買う ${randomUUID()}`;

await agent.act("Todo に「{title}」を追加してください", {
  params: { title },
});
```

### unique() で再実行時に値を差し替える

ただし、`params` の値もキャッシュの識別に含まれます。毎回異なる値を渡すと、テストの実行のたびにキャッシュミスになり、モデルを呼び出すことになります。そこで [`unique()`](https://e2e.tester.army/docs/cache#what-must-match) を使うと、実行ごとに変わる値を指定できます。`unique()` でラップした値は、キャッシュを再生するときに前回の値ではなく、今回渡された値に差し替えられます。

先ほどの Todo アプリで、名前を実行ごとに変える例を試してみましょう。`tests/todo-unique.e2e.ts` を作成します。

```ts:tests/todo-unique.e2e.ts
import { randomUUID } from "node:crypto";
import { test, expect, unique } from "e2e";

test("実行ごとに異なる名前の Todo を追加する", async ({ app, agent, screen }) => {
  const title = `牛乳を買う ${randomUUID()}`;
  await app.open("/");

  await agent.act("Todo に「{title}」を追加してください", {
    params: { title: unique(title) },
  });

  await expect(screen.getByRole("listitem")).toHaveText(title);
  await expect(screen.getByRole("status")).toHaveText("1 件の Todo");
});
```

`unique(title)` がその値を e2e のキャッシュで差し替え可能にします。`unique()` 自体がランダムな値を生成するわけではありません。

次のコマンドを 2 回実行すると、異なる名前を入力しながら、同じ操作の記録を再利用できるか確認できます。

```bash
npx e2e run tests/todo-unique.e2e.ts
npx e2e run tests/todo-unique.e2e.ts
```

初回の記録は次のとおりです。`cache.reason` が `no-entry` で、まだ記録がないためモデルを 3 回呼び出しています。入力した名前には `de83e6af-` で始まる UUID が含まれています。

```json
{
  "api": "agent.act",
  "status": "passed",
  "events": [
    {
      "kind": "engine",
      "name": "type",
      "detail": "type \"牛乳を買う de83e6af-e1a9-4229-9ab5-730649afe…\" into textbox \"やること\""
    }
  ],
  "metrics": {
    "modelCalls": 3,
    "actionSteps": 2
  },
  "cache": {
    "mode": "missed",
    "reason": "no-entry",
    "replayedActions": 0,
    "totalActions": 0
  }
}
```

続いて、再実行時の記録を確認します。

```json
{
  "api": "agent.act",
  "status": "passed",
  "events": [
    {
      "kind": "engine",
      "name": "type",
      "detail": "type \"牛乳を買う 82974bbd-514b-43fa-9d1f-e284fa4e2…\" into textbox \"やること\""
    }
  ],
  "metrics": {
    "modelCalls": 0,
    "actionSteps": 2
  },
  "cache": {
    "mode": "self-finalized",
    "replayedActions": 2,
    "totalActions": 2
  }
}
```

入力した名前の UUID は `82974bbd-` で始まる別の値に変わっています。それでも `cache.mode` は `self-finalized`、`replayedActions` は `2` となり、入力と追加の 2 操作が再生されました。`metrics.modelCalls` が `0` であることから、モデルを呼び出さずに今回の値へ差し替えたことがわかります。

:::warning
`unique()` は、入力する名前やメールアドレスなど、値が変わっても同じ操作の流れで扱うデータに使います。「無料プラン」と「有料プラン」のように、選択によって操作の流れが変わる値には通常の `params` を使ってください。これにより、別の操作が必要なケースまで同じ記録として扱うことを避けられます。
:::

## まとめ

- e2e は、自然言語による操作と要素を指定した操作・アサーションを、同じテストで組み合わせられるフレームワーク
- `agent.act()` に操作の目標を渡すと、モデルが画面を確認して操作を選ぶ。結果は `expect()` でコードとして検証でき、`agent.assert()` で自然言語による検証も可能
- 後続の検証が成功した `agent.act()` の操作は、リプレイキャッシュとして再利用できる。キャッシュが使えない場合は、モデルを呼び出して操作を補う
- `unique()` を使うと、実行ごとに変わるテストデータを差し替えながら、同じ操作のキャッシュを再利用できる

## 参考

- [e2e](https://tester.army/e2e)
- [tester-army/e2e](https://github.com/tester-army/e2e)
- [Quickstart](https://e2e.tester.army/docs/quickstart)
- [Writing tests](https://e2e.tester.army/docs/writing-tests)
- [Models](https://e2e.tester.army/docs/models)
- [How agent steps work](https://e2e.tester.army/docs/agent-steps)
- [Caching agent steps](https://e2e.tester.army/docs/cache)
