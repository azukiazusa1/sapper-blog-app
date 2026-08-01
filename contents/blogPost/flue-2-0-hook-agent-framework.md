---
id: vQqEs2a9K5NJ3A3YXUkbF
title: "Flue 2.0 で導入された hook ベースのエージェントフレームワーク"
slug: "flue-2-0-hook-agent-framework"
about: "Flue 2.0 では従来の静的なエージェントの定義方法から、Agent Hooks と呼ばれる hook ベースのエージェントフレームワークへと進化しました。Agent Hooks では React の hooks と同様の API を用いて、エージェントの状態やライフサイクルを管理することができます。このブログ記事では Agent Hooks を使用してエージェントを構築する方法を紹介します。"
createdAt: "2026-08-01T12:02+09:00"
updatedAt: "2026-08-01T12:02+09:00"
tags: ["Flue", "AI"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/7kwQsJl8AyM2ufXtJscDN9/8d00531762798f77593be16db9088d0d/long-eared-owl_23867.png"
  title: "トラフズクのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Flue 2.0 でエージェントとして定義した関数の返り値は、何として扱われると記事で説明されていますか?"
      answers:
        - text: "エージェントが最初にユーザーへ返すメッセージ"
          correct: false
          explanation: "返り値は応答メッセージではありません。記事の例でも、返り値には「あなたは有能なアシスタントです。博多弁で話してください。」という指示文が指定されています。"
        - text: "エージェントのシステムプロンプト"
          correct: true
          explanation: "記事の通り、エージェント関数の返り値はエージェントのシステムプロンプトとして渡されます。"
        - text: "エージェントが使用するツールの一覧"
          correct: false
          explanation: "ツールの登録は返り値ではなく `useTool` フックの呼び出しによって行います。"
        - text: "エージェント名として登録される文字列"
          correct: false
          explanation: "エージェント名は `agentName` プロパティ、または省略時は関数名から決まります。返り値は使われません。"
    - question: "Agent Hooks が React の Hooks と異なる点として、記事で挙げられているのはどれですか?"
      answers:
        - text: "条件分岐の中でフックを呼び出せる"
          correct: true
          explanation: "記事の通り、React の Hooks と異なり Flue の Agent Hooks は条件分岐の中で呼び出せます。方言に応じてツールやスキルを出し分ける例がこれにあたります。"
        - text: "フック名を `use` で始める必要がない"
          correct: false
          explanation: "記事では、`use` で始まるフックを呼び出すことでモデルやツールなどの構成要素を定義すると説明されています。"
        - text: "複数のフックをまとめたカスタムフックは作成できない"
          correct: false
          explanation: "React Hooks と同じようにカスタムフックを作成でき、共通のパターンを再利用しやすいと記事で述べられています。"
        - text: "エージェント関数は一度だけ実行され、フックは再評価されない"
          correct: false
          explanation: "React と同じように、エージェント関数が呼び出されるたびに再レンダリングされてフックが再評価されます。"
    - question: "`usePersistentState` で管理した状態について、記事で説明されている内容として正しいのはどれですか?"
      answers:
        - text: "会話が終了すると破棄されるため、再起動後はリセットされる"
          correct: false
          explanation: "状態は DB に永続化されるため、再起動しても保持されると記事で説明されています。"
        - text: "ブラウザの localStorage に保存され、クライアント側で管理される"
          correct: false
          explanation: "保存先はクライアントではなく DB です。どの DB を使うかは `src/db.ts` で指定します。"
        - text: "DB に永続化されるため、エージェントを再起動しても保持される"
          correct: true
          explanation: "記事の通り、状態は DB に永続化されます。デフォルトでは SQLite が使用されます。"
        - text: "永続化先は Postgres に固定されており、変更できない"
          correct: false
          explanation: "デフォルトは SQLite で、`src/db.ts` のアダプターを差し替えることで Postgres や libSQL なども選べます。"
published: true
---
[Flue](https://flueframework.com/) は [Astro](https://astro.build/) の制作者によって作られた TypeScript 製の AI エージェントフレームワークです。Flue 2.0 では、従来の静的なエージェントの定義方法から、Agent Hooks と呼ばれる hook ベースのエージェントフレームワークへと変化しました。Agent Hooks では React の hooks と同様の API を用いて、エージェントの状態やライフサイクルを管理することができます。

```ts
export function Assistant() {
  const [count, setCount] = usePersistentState('count', 0);
  useAgentStart(() => setCount((n) => n + 1));
  useModel('moonshot/kimi-k2');
  return `You are a helpful assistant. This conversation has ${count} messages.`;
}
```

Flue は 0.1.x の段階では OpenAI SDK や eve、Mastra といった既存のエージェントフレームワークと同じように、エージェントを設定ファイルのように扱う静的な定義方法を採用していました。例えば以下のように、エージェントのモデルやツール、システムプロンプトを定義することができます。

```ts
import { defineAgent, type AgentRouteHandler } from "@flue/runtime";
import instructions from "./sre-agent.md" with { type: "markdown" };
import { getLogsTool } from "../tools/get-logs.ts";
import { getServiceStatusTool } from "../tools/get-service-status.ts";
 
export default defineAgent(() => ({
  model: "openai/gpt-5.4-nano",
  instructions,
  tools: [getLogsTool, getServiceStatusTool],
}));
```

Flue 0.1.x でこの API を開発者に試してもらったところ、より複雑で高度なエージェントや複数ステップのワークフローでは機能しなくなるという課題が発見されたようです。そこで Flue の開発者たちは他の人気のある SDK やフレームワークにも同様の問題があるのではないかという疑問を持ち、Flue に破壊的変更を加えて解決する価値がある問題であると考えたそうです。こうして様々なアプローチが考案された末、最終的に TypeScript 開発者にとって馴染み深い hooks というデザインパターンが浮かび上がったとのことです。React Hooks が解決する問題は、エージェントにも当てはまるということだったのです。

```ts
export function SREAgent() {
  useModel("openai/gpt-5.4-nano");
  useTool(getLogsTool);
  useTool(getServiceStatusTool);

  return instructions;
}
```

上記の例では hooks API の利点は伝わりづらいかもしれませんが、条件に応じて複数のモデルを切り替えたり、ステートマシンに似た複雑なワークフローを実装したりする場合に、hooks API は真価を発揮します。また、React Hooks と同じように hooks を組み合わせたカスタムフックを作成することも可能で、共通のパターンを再利用しやすくなっています。

この記事では、Flue 2.0 の Agent Hooks を使用してエージェントを構築する方法を紹介します。

## Agent Hooks を使用してエージェントを定義する

はじめに、Flue 2.0 の Agent Hooks を使用して基本的なエージェントを定義してみましょう。`npx @flue/cli init` コマンドを使用して、Flue プロジェクトを作成します。

:::note
公式ドキュメントでは「Read https://flueframework.com/start.md then help create my first agent...」というプロンプトを使用してコーディングエージェントに Flue プロジェクトの作成を依頼することが推奨されています。
:::

```bash
npx @flue/cli init agent-hooks-example
cd agent-hooks-example
npm install
```

環境変数 OPENAI_API_KEY に OpenAI の API キーを設定します。この箇所は使用している AI プロバイダーに応じて適宜変更してください。.env ファイルを作成し、以下のように記述します。

```txt:.env
OPENAI_API_KEY=your_openai_api_key
```

`src/agents/assistant.ts` ファイルを作成し、Agent Hooks を使用して最も基本的なエージェントを定義します。

```ts:src/agents/assistant.ts
"use agent";
import { useModel } from "@flue/runtime";

export function Assistant() {
  useModel("openai/gpt-5.4-nano");
  return "あなたは有能なアシスタントです。博多弁で話してください。";
}

Assistant.agentName = "assistant-agent";
```

Flue ではエージェントは関数として定義されます。React がコンポーネントとして関数を定義するのと同じです。関数の返り値はエージェントのシステムプロンプトとして渡されます。

`"use agent"` ディレクティブにより、`Assistant` 関数が Flue のエージェントとして認識されます。ビルド時に Flue は `"use agent"` ディレクティブを検出し、`dispatch()` や `init()` などから参照できるエージェントとして登録します。`"use ..."` ディレクティブを使用するところも React の設計パターンに影響を受けていることがわかりますね。

`Assistant` 関数内部では `useModel` フックを使用して、エージェントが使用するモデルを指定しています。Flue エージェントの関数ではこのように `use` で始まる hooks を呼び出すことによってモデルやツール、スキルといったエージェントの構成要素を定義することができます。React と同じように、エージェント関数が呼び出されるたびに再レンダリングされフックが再評価されます。

任意で `Assistant.agentName` プロパティを設定することで、エージェントの名前を指定することができます。エージェント名を指定しない場合、関数名（`Assistant`）がエージェント名として使用されます。関数名を変更してもストレージのデータ移行が発生しないように、明示的なエージェント名を設定することがベストプラクティスとされています。

エージェントをローカルで実行するにはパスを指定して `npx flue run` コマンドを使用します。ユーザーの入力は `--message` オプションで指定します。

```bash
npx flue run src/agents/assistant.ts --message "こんにちは、調子はどうですか？"
```

以下のように、エージェントが博多弁で応答することを確認できます。

```sh
▗  flue run
▚  agent     assistant-agent
▘  id        01KYXVAB10BGX3WKGB1W6E2J3P
   config    flue.config.ts
   db        src/db.ts
   env       .env

user
 こんにちは、調子はどうですか？

assistant
 こんにちは！おかげさまで調子ばばよかですたい😊
 あなたはどげんしてます？
```

## ツールやスキルなどのエージェントの構成要素を定義する

Agent Hooks を使用してツールやスキルをエージェントに組み込んでみましょう。`useModel` フックの他に以下のようなフックが用意されています。

- `useSandbox`: エージェントの実行環境を定義する
- `useTool`: エージェントが外部とやり取りするためのツールを定義する
- `useMcpConnection`: オープン仕様の MCP（Model Context Protocol）からツールを取得する
- `useSkill`: エージェントが必要に応じてロードするスキルを定義する
- `useSubagent`: 処理を他のエージェントに委譲するためのサブエージェントを定義する
- `usePersistentState`: カスタムデータを永続化するためのステートを定義する
- `useAgentStart`, `useAgentFinish` など: エージェントのライフサイクルに応じたフックを定義する
- `useDataWriter`: 構造化データをクライアント UI に描画する

まずは `useTool` フックを使用して、エージェントが外部とやり取りするためのツールを定義してみましょう。福岡・博多のおすすめスポット情報を返す `fukuoka_spot_info` ツールを定義します。`src/tools/get-hakata-sightseeing.ts` ファイルを作成し、以下のように記述します。

```ts:src/tools/get-hakata-sightseeing.ts
import { defineTool } from "@flue/runtime";
import * as v from "valibot";

const spots: Record<
  "グルメ" | "観光" | "祭り",
  { name: string; area: string; description: string }[]
> = {
  グルメ: [
    {
      name: "一風堂",
      area: "博多区",
      description: "博多とんこつラーメンの代表格。もともと博多区でうまれた",
    },
    {
      name: "もつ鍋",
      area: "博多区・中洲",
      description: "博多を代表する鍋料理。醤油味と味噌味が定番",
    },
    {
      name: "屋台",
      area: "中洲・天神",
      description: "夜になると立ち並ぶ屋台。ラーメンやおでんが名物",
    },
  ],
  観光: [
    {
      name: "太宰府天満宮",
      area: "太宰府市",
      description: "学問の神様を祀る神社。梅ヶ枝餅が名物",
    },
    // 省略...
  ],
  祭り: [
    {
      name: "博多祇園山笠",
      area: "博多区",
      description: "毎年7月に行われる、舁き山を担いで走る勇壮な祭り",
    },
    // 省略...
  ],
};

export const fukuokaSpotInfo = defineTool({
  name: "fukuoka_spot_info",
  description:
    "福岡・博多エリアのおすすめスポット（グルメ・観光・祭り）情報を1件返す。",
  input: v.object({
    category: v.picklist(["グルメ", "観光", "祭り"]),
  }),
  output: v.object({
    name: v.string(),
    area: v.string(),
    description: v.string(),
  }),
  async run({ data }) {
    const list = spots[data.category];
    const pick = list[Math.floor(Math.random() * list.length)];
    return { output: pick };
  },
});
```

ツールの定義方法自体は従来の方法と大きく変わりありません。`defineTool` 関数を使用してツールを定義し、ツールの名前、説明、入力・出力のスキーマ、実行時の処理を指定します。スキーマの定義は [valibot](https://valibot.dev/) を使用して行います。`run` メソッドでは、入力データに応じてランダムにスポット情報を返すようにしています。

作成したツールをエージェントに組み込むには、`useTool` フックを使用します。`src/agents/assistant.ts` ファイルを以下のように更新します。

```ts:src/agents/assistant.ts {7}
"use agent";
import { useModel, useTool } from "@flue/runtime";
import { fukuokaSpotInfo } from "../tools/get-hakata-sightseeing.ts";

export function Assistant() {
  useModel("openai/gpt-5.4-nano");
  useTool(fukuokaSpotInfo);
  return "あなたは有能なアシスタントです。博多弁で話してください。";
}
```

`useTool` フックの引数には `defineTool` で定義したツールを渡します。一度限りのツールの定義であれば、`useTool` フックの引数に直接オブジェクトを渡すことも可能です。

```ts
useTool({
  name: "fukuoka_spot_info",
  // ... 
});
```

定義したツールが実際に呼び出されるか試してみましょう。`npx flue run` コマンドを使用して「博多のおすすめのグルメを教えてください」とメッセージを送信します。

```bash
npx flue run src/agents/assistant.ts --message "博多のおすすめのグルメを教えてください"
```

以下のように、確かに `fukuoka_spot_info` ツールが呼び出されていることがわかりますね。

```sh
user
 博多のおすすめのグルメを教えてください

tool fukuoka_spot_info
tool done fukuoka_spot_info
assistant
 よかよか！博多のおすすめグルメやったら、**もつ鍋**が鉄板やけんね🍲
 **博多区・中洲**あたりで食べられること多くて、**醤油味**と**味噌味**のどっちにするか迷うとこやけど、どっちも外さんよ。
```

次に、`useSkill` フックを使用して、エージェントが必要に応じてロードするスキルを定義してみましょう。博多弁にまつわるクイズを出題する手順をスキルとして定義します。`src/skills/hakata-quiz/SKILL.md` ファイルを作成し、以下のように記述します。フロントマターの `name` と `description` は必須です。

```md:src/skills/hakata-quiz/SKILL.md
---
name: hakata-quiz
description: >
  博多弁の単語当てクイズを出題する手順。ユーザーがクイズ・問題・テストを
  出してほしいと言った時に使う。
---

# 博多弁クイズの手順

1. `hakata_quiz_question` ツールを呼び、出題する標準語の単語と正解（博多弁）を
   取得する。これまでに出題した単語があれば `exclude` に渡して重複を避ける。
2. `exhausted: true` が返ってきたら「もう出せる問題がなくなったばい」と伝えて
   終了する。
3. ツールから受け取った博多弁の正解は、ユーザーが答えるまで絶対に見せない。
   ユーザーには標準語の単語だけを問題として提示する（例:「『疲れた』は
   博多弁で何て言う？」）。
4. ユーザーの回答を待つ。
5. 回答を正解と照らし合わせる。表記ゆれ（例:「よか」と「よかよか」）は
   許容範囲として柔軟に判定してよい。
6. 正解・不正解を伝え、正解の言葉と補足（`note`があれば）を博多弁で説明する。
7. ユーザーが続けたい様子なら、出題済みの単語を`exclude`に加えて手順1に戻る。
   そうでなければクイズを終える。
```

スキルの手順の中で呼び出されている `hakata_quiz_question` ツールも作成しておきましょう。import している `hakata-dictionary.ts` は、標準語の単語をキーに博多弁とその補足を持たせただけの単純なオブジェクトです。

```ts:src/tools/hakata-quiz-question.ts
import { defineTool } from "@flue/runtime";
import * as v from "valibot";
import { dictionary } from "./hakata-dictionary.ts";

const quizEntries = Object.entries(dictionary).filter(
  ([word, entry]) => entry.hakata !== word,
);

export const hakataQuizQuestion = defineTool({
  name: "hakata_quiz_question",
  description:
    "博多弁クイズの問題を1問取得する。出題済みの単語をexcludeに渡すと重複を避けられる。",
  input: v.object({
    exclude: v.optional(v.array(v.string())),
  }),
  output: v.object({
    exhausted: v.boolean(),
    word: v.optional(v.string()),
    hakata: v.optional(v.string()),
    note: v.optional(v.string()),
  }),
  async run({ data }) {
    const excluded = new Set(data.exclude ?? []);
    const remaining = quizEntries.filter(([word]) => !excluded.has(word));
    if (remaining.length === 0) {
      return { output: { exhausted: true } };
    }
    const [word, entry] =
      remaining[Math.floor(Math.random() * remaining.length)];
    return {
      output: {
        exhausted: false,
        word,
        hakata: entry.hakata,
        note: entry.note,
      },
    };
  },
});
```

エージェントにスキルを組み込むには、`useSkill` フックを使用します。マークダウンファイルを import して `useSkill` フックの引数に渡すことで、スキルをエージェントに組み込むことができます。

```ts:src/agents/assistant.ts {10-11}
"use agent";
import { useModel, useTool, useSkill } from "@flue/runtime";
import { fukuokaSpotInfo } from "../tools/get-hakata-sightseeing.ts";
import { hakataQuizQuestion } from "../tools/hakata-quiz-question.ts";
import hakataQuiz from "../skills/hakata-quiz/SKILL.md";

export function Assistant() {
  useModel("openai/gpt-5.4-nano");
  useTool(fukuokaSpotInfo);
  useTool(hakataQuizQuestion);
  useSkill(hakataQuiz);
  return "あなたは有能なアシスタントです。博多弁で話してください。";
}
```

「何かクイズを出してみて」といったプロンプトを送信し、スキルが呼び出されることを確認してみましょう。

```bash
npx flue run src/agents/assistant.ts --message "何かクイズを出してみて"
```

```sh
user
 何かクイズを出してみて

tool activate_skill
tool done activate_skill
tool hakata_quiz_question
tool done hakata_quiz_question
assistant
 よっしゃ！博多弁クイズば出すばい😄
 **「嘘つき」** は博多弁で何と言うとやろ？
```

## 状態に応じた hooks の呼び出し

ここまでのエージェントの定義は、従来の静的な定義方法を Agent Hooks に置き換えただけで、大きく変わりませんでした。Agent Hooks は複雑なエージェントやワークフローを簡潔に実装し保守しやすいように設計されています。例として状態に応じて異なるツールやスキルを呼び出すエージェントを作成してその利点を確認してみましょう。ここではユーザーの指示に応じて博多弁か沖縄弁かを切り替えて応答するエージェントを作成します。

ユーザーが博多弁で会話することを望んでいるか？それとも沖縄弁か？という状態を管理するために `usePersistentState` フックを使用します。`usePersistentState` フックの API は React の `useState` フックとよく似ています。第 1 引数にステートの名前を指定し、第 2 引数に初期値を指定します。返り値は配列で、現在のステートの値と、ステートを更新するための関数が返されます。

状態の更新は主にツールの呼び出しによって行われます。以下はコードの抜粋です。

```ts:src/agents/assistant.ts
const DIALECTS = ["hakata", "okinawa"] as const;
type Dialect = (typeof DIALECTS)[number];

export function Assistant() {
  const [dialect, setDialect] = usePersistentState<Dialect>(
    "dialect",
    "hakata",
  );
  
  useTool({
    name: "set_dialect",
    description:
      "話す方言を切り替える。ユーザーが出身地や希望する方言（博多弁／沖縄弁）を伝えてきた時に呼ぶ。",
    input: v.object({ dialect: v.picklist(DIALECTS) }),
    output: v.object({ dialect: v.picklist(DIALECTS) }),
    async run({ data }) {
      // ツールが呼ばれた時に、ステートを更新する
      setDialect(data.dialect);
      return { output: { dialect: data.dialect } };
    },
  });
}
```

状態は DB に永続化されるため、エージェントが再起動しても状態は保持されます。どの DB を使用するかは `src/db.ts` ファイルで指定します。デフォルトでは SQLite が使用されます。

```ts:src/db.ts
import { sqlite } from '@flue/runtime/node';

// Conversations, attachments, and accepted submissions are stored here so
// they survive a restart. Swap in another adapter (Postgres, libSQL, ...)
// when one host's SQLite file is no longer enough:
// https://flueframework.com/docs/guide/database/
export default sqlite('./data/flue.db');
```

エージェントの定義の続きでは、状態に応じて異なるツールやスキルを呼び出すようにします。`dialect` ステートの値が `"hakata"` の場合は博多弁のツールとスキルを呼び出し、`"okinawa"` の場合は沖縄弁のツールとスキルを呼び出すようにします。React の Hooks と異なり、Flue の Agent Hooks では条件分岐の中でフックを呼び出すことができます。

```ts:src/agents/assistant.ts
export function Assistant() {
  const [dialect, setDialect] = usePersistentState<Dialect>(
    "dialect",
    "hakata",
  );

  useTool({
    name: "set_dialect",
    description:
      "話す方言を切り替える。ユーザーが出身地や希望する方言（博多弁／沖縄弁）を伝えてきた時に呼ぶ。",
    input: v.object({ dialect: v.picklist(DIALECTS) }),
    output: v.object({ dialect: v.picklist(DIALECTS) }),
    async run({ data }) {
      setDialect(data.dialect);
      return { output: { dialect: data.dialect } };
    },
  });

  if (dialect === "hakata") {
    useSkill(hakataQuiz);
    useTool(fukuokaSpotInfo);
    useTool(hakataQuizQuestion);

    return [
      "あなたは博多（福岡）出身のキャラクターです。有能なアシスタントとして、",
      "すべての返答を博多弁で話してください。親しみやすく、世話焼きで、",
      "ちょっとせっかちなトーンを保つこと。",
    ].join("\n");
  }

  useSkill(okinawaQuiz);
  useTool(okinawaSpotInfo);
  useTool(okinawaQuizQuestion);

  return [
    "あなたは沖縄出身のキャラクターです。有能なアシスタントとして、",
    "すべての返答を沖縄言葉（ウチナーヤマトグチ）で話してください。おおらかで",
    "明るく、少しマイペースなトーンを保つこと。",
  ].join("\n");
}
```

条件によるフックの呼び出しにより、必要な場合のみ必要なツールを登録するという柔軟なエージェントの定義が容易に実装できました。ですがこのままのコードの状態ですと、ツールやスキルの登録が条件分岐の中に散らばってしまい、エージェントの定義が複雑になってしまいます。一般的に if 文の中のコードは簡潔に保ち、どこまでが条件分岐の中で、どこからが条件分岐の外なのかを明確にすることが可読性を保つためのコツです。そこで、条件分岐の中で呼び出すフックをまとめたカスタムフックを作成してみましょう。

状態を持つ `useDialect` と `useHakataBen`, `useOkinawaBen` カスタムフックをそれぞれ作成します。

```ts:src/hooks/use-dialect.ts
import { usePersistentState, useTool } from "@flue/runtime";
import * as v from "valibot";

export const DIALECTS = ["hakata", "okinawa"] as const;
export type Dialect = (typeof DIALECTS)[number];

export function useDialect() {
  const [dialect, setDialect] = usePersistentState<Dialect>(
    "dialect",
    "hakata",
  );

  useTool({
    name: "set_dialect",
    description:
      "話す方言を切り替える。ユーザーが出身地や希望する方言（博多弁／沖縄弁）を伝えてきた時に呼ぶ。",
    input: v.object({ dialect: v.picklist(DIALECTS) }),
    output: v.object({ dialect: v.picklist(DIALECTS) }),
    async run({ data }) {
      setDialect(data.dialect);
      return { output: { dialect: data.dialect } };
    },
  });

  return dialect;
}
```

```ts:src/hooks/use-hakata-ben.ts
import { useSkill, useTool } from "@flue/runtime";
import { fukuokaSpotInfo } from "../tools/get-hakata-sightseeing.ts";
import { hakataQuizQuestion } from "../tools/hakata-quiz-question.ts";
import hakataQuiz from "../skills/hakata-quiz/SKILL.md";

export function useHakataBen() {
  useSkill(hakataQuiz);
  useTool(fukuokaSpotInfo);
  useTool(hakataQuizQuestion);

  return [
    "あなたは博多（福岡）出身のキャラクターです。有能なアシスタントとして、",
    "すべての返答を博多弁で話してください。親しみやすく、世話焼きで、",
    "ちょっとせっかちなトーンを保つこと。",
  ].join("\n");
}
```

```ts:src/hooks/use-okinawa-ben.ts
import { useSkill, useTool } from "@flue/runtime";
import { okinawaSpotInfo } from "../tools/get-okinawa-sightseeing.ts";
import { okinawaQuizQuestion } from "../tools/okinawa-quiz-question.ts";
import okinawaQuiz from "../skills/okinawa-quiz/SKILL.md";

export function useOkinawaBen() {
  useSkill(okinawaQuiz);
  useTool(okinawaSpotInfo);
  useTool(okinawaQuizQuestion);

  return [
    "あなたは沖縄出身のキャラクターです。有能なアシスタントとして、",
    "すべての返答を沖縄言葉（ウチナーヤマトグチ）で話してください。おおらかで",
    "明るく、少しマイペースなトーンを保つこと。",
  ].join("\n");
}
```

`assistant.ts` ファイルでは、`useDialect`, `useHakataBen`, `useOkinawaBen` カスタムフックを使用して、状態に応じて異なるツールやスキルを呼び出すようにします。以前よりもエージェントの定義が簡潔になり読みやすくなったかと思います。

```ts:src/agents/assistant.ts
"use agent";
import { useModel } from "@flue/runtime";
import { useDialect } from "../hooks/use-dialect.ts";
import { useHakataBen } from "../hooks/use-hakata-ben.ts";
import { useOkinawaBen } from "../hooks/use-okinawa-ben.ts";

export function Assistant() {
  useModel("openai/gpt-5.4-nano");

  const dialect = useDialect();
  const instruction = dialect === "hakata" ? useHakataBen() : useOkinawaBen();

  return instruction;
}

Assistant.agentName = "assistant-agent";
```

ここまでの実装が完了したら実際に試してみましょう。まずは「沖縄弁に切り替えて」というメッセージを送信して状態を切り替えます。`set_dialect` ツールが呼び出されていることが確認できます。

```bash
npx flue run src/agents/assistant.ts --message "沖縄弁に切り替えて"
```

```sh
tool set_dialect
tool done set_dialect
assistant
  おけいおけい〜、いま沖縄弁モードになちょりますよ〜🌺
  よかったら、どんな話すん？（グルメ・観光・祭りのことでも、日常のことでも何でもOKやさ〜）
```

この状態で観光地について質問すると、沖縄に関する情報が返ってくることが確認できます。続けて会話する場合は `--id` で会話の ID を指定する必要があります。

```bash
npx flue run src/agents/assistant.ts --message "おすすめの観光スポットを教えてください" --id xxxxxxx
```

```sh
user
  おすすめの観光スポットを教えてください

tool okinawa_spot_info
tool done okinawa_spot_info
assistant
  ほいほい、観光なら **美ら海水族館**（本部町）がおすすめやさ〜😊
  ジンベエザメが泳ぐ大きい水槽で有名やん。家族連れにも人気やよ〜🌊🦈
```

確かに条件分岐に応じて登録している `okinawa_spot_info` ツールが呼び出されていることが確認できます。

## ステートマシンのような複雑なワークフローの実装

続いて、ステートマシンのような複雑なワークフローを実装してみましょう。ここでは旅行の計画を立てるためのエージェントを作成します。旅行の計画は聞き取り・提案・確定の 3 段階のステップで構成されます。はじめは聞き取りのステップから始まり、十分に情報が集まったら提案のステップに移行し、ユーザーが提案を承認したら確定のステップに移行するという流れです。

各ステップごとに使用可能なツールを切り替えることにより、十分な情報が集まっていないにもかかわらず予約しようとしてしまうといった不適切なツールの呼び出しを防ぐことができます。またステップごとにモデルの性能を切り替えることも可能です。例えば聞き取りのステップでは比較的安価なモデルを使用し、より重要な提案のステップではより高性能なモデルを使用する、といった使い分けが可能です。

ステップの状態は `usePersistentState` フックで管理し、`finish_hearing`, `finish_proposing` といったツールを呼び出すことで次のステップに進むことができます。実装はカスタムフックを使用して行います。`src/hooks/use-trip-planner.ts` ファイルを作成し、以下のように記述します。

```ts:src/hooks/use-trip-planner.ts
import { useModel, usePersistentState, useTool } from "@flue/runtime";
import { bookTrip } from "../tools/book-trip.ts";

// 聞き取り・提案・確定の 3 段階のステップを定義する
const PLAN_PHASES = ["hearing", "proposing", "finalized"] as const;
type PlanPhase = (typeof PLAN_PHASES)[number];

// 聞き取り・確定は軽い受け答えで十分だが、複数のspot_infoを踏まえて
// 旅程を組み立てる提案フェーズだけ、より高性能なモデルに切り替える。
const MODEL_BY_PHASE: Record<PlanPhase, string> = {
  hearing: "openai/gpt-5.4-nano",
  proposing: "openai/gpt-5.4-mini",
  finalized: "openai/gpt-5.4-nano",
};

// ステップごとにシステムプロンプトを切り替える
const PHASE_INSTRUCTIONS: Record<PlanPhase, string> = {
  hearing: [
    "【旅行プランニング: 聞き取りフェーズ】",
    "何日間の旅行か、興味（グルメ／観光／祭り）、誰と行くかを質問して聞き出すこと。",
    "この段階ではまだスポットの提案はしない。十分な情報が集まったら",
    "finish_hearing を呼んで提案フェーズに進むこと。",
  ].join("\n"),
  proposing: [
    "【旅行プランニング: 提案フェーズ】",
    "聞き取った興味に沿って、現在の方言に対応する spot_info ツール",
    "（博多弁なら fukuoka_spot_info、沖縄言葉なら okinawa_spot_info）を使い、",
    "日数分の候補スポットを提案すること。ユーザーが候補に納得したら",
    "finish_proposing を呼んで確定フェーズに進むこと。",
  ].join("\n"),
  finalized: [
    "【旅行プランニング: 確定フェーズ】",
    "これまで提案した内容を、日ごとの旅程として簡潔にまとめて提示すること。",
    "もう spot_info ツールで新しい候補を出す必要はない。",
    "ユーザーが予約してほしいと言ったら、旅程の要約を summary に入れて",
    "book_trip ツールを呼び、返ってきた confirmationId を伝えること。",
    "別の旅行を計画したいと言われたら restart_trip_plan を呼ぶこと。",
  ].join("\n"),
};

export function useTripPlanner() {
  const [phase, setPhase] = usePersistentState<PlanPhase>(
    "planPhase",
    "hearing",
  );

  useModel(MODEL_BY_PHASE[phase]);

  if (phase === "hearing") {
    // 聞き取りフェーズでは、十分に聞き取ったら finish_hearing ツールを呼ぶことで提案フェーズに進むことができる
    useTool({
      name: "finish_hearing",
      description:
        "旅行日数・興味・同行者などの聞き取りが十分に終わったら呼ぶ。提案フェーズに進む。",
      async run() {
        setPhase("proposing");
        return { output: { phase: "proposing" } };
      },
    });
  }

  if (phase === "proposing") {
    // 提案フェーズでは、ユーザーが提案に納得したら finish_proposing ツールを呼ぶことで確定フェーズに進むことができる
    useTool({
      name: "finish_proposing",
      description:
        "提案した旅程にユーザーが納得したら呼ぶ。確定フェーズに進む。",
      async run() {
        setPhase("finalized");
        return { output: { phase: "finalized" } };
      },
    });
  }

  if (phase === "finalized") {
    // 確定フェーズに限り、予約を行う book_trip ツールを使用可能にする
    useTool(bookTrip);
  }

  useTool({
    name: "restart_trip_plan",
    description:
      "新しい旅行のプランニングを聞き取りフェーズからやり直す時に呼ぶ。",
    async run() {
      setPhase("hearing");
      return { output: { phase: "hearing" } };
    },
  });

  return PHASE_INSTRUCTIONS[phase];
}
```

最後に `useTripPlanner` をエージェントに組み込みます。`useTripPlanner` の内部でフェーズに応じた `useModel` を呼び出しているため、エージェント関数では別途 `useModel` を呼び出さないようにします。

```ts:src/agents/assistant.ts
"use agent";
import { useDialect } from "../hooks/use-dialect.ts";
import { useHakataBen } from "../hooks/use-hakata-ben.ts";
import { useOkinawaBen } from "../hooks/use-okinawa-ben.ts";
import { useTripPlanner } from "../hooks/use-trip-planner.ts";

export function Assistant() {
  const tripPlannerInstructions = useTripPlanner();

  const dialect = useDialect();
  const personaInstructions =
    dialect === "hakata" ? useHakataBen() : useOkinawaBen();

  return [personaInstructions, tripPlannerInstructions].join("\n\n");
}

Assistant.agentName = "assistant-agent";
```

Agent Hooks を使用することで、どのステップのときにどのツールを使用可能にするかを簡単に切り替えることができました。これまでの Flue では `defineWorkflow()` を使用した専用の DSL を学習する必要がありましたが、通常の TypeScript で制御構文でワークフローを表現できるようになっています。また、フレームワークが前回渡したツール一覧と今回のレンダーで呼ばれたツール一覧の差分を自動的に計算してモデルに渡してくれるため、ツールの呼び出しの制御を自分で実装する必要もありません。

実際に試してみると、以下のような会話の流れになりました。

<details>

<summary>会話の流れ（一部省略）</summary>

```sh
user
    2泊3日、2人で福岡旅行の計画を立てたい。

assistant
    よかとこ言いよるね！2泊3日・2人なら組みやすかよ。
    ほんなら計画立てるために、まずこれだけ教えて〜（まだスポット提案はせんで、聞き取りだけするけんね）。
    
    1) 興味はどれが強め？ **グルメ／観光／祭り**（それぞれ割合でもOK）
    2) 行きたい雰囲気は？ **ゆるめ**か **詰め詰め**か
    3) 出発地（だいたいでよか）と、移動手段は？（電車・車・徒歩多め等）
    4) お宿はもう決めとる？（エリアの希望：博多駅周辺・天神・中洲あたり等）
    5) 予算感（だいたいでOK）と、食べられんもん／苦手ある？

user
    グルメが一番。つめつめ。出発は東京で飛行機移動。宿は中洲あたり。予算は5万程度

tool finish_hearing
tool done finish_hearing
tool fukuoka_spot_info

assistant
    よし、条件きれいにハマったね。**中洲宿・グルメ最優先・食メイン・ラーメン好き・辛いの苦手・9月上旬**で、**2泊3日つめつめ**の叩き台組んだよ！
    
    ※飲みなし前提で、辛さは「抜き」「普通」で攻めるプランね。
    
    ---
    
    ## 1日目（到着日）｜中洲〜天神スタートで“夜ラーメン”
    **昼〜夕方（到着後）：キャナルシティ博多**
    - まず動ける範囲でサクッと。時間調整もしやすいとこ！
    
    **夜：屋台（中洲・天神）でラーメン＆おでん**
    - 屋台はラーメンの選択肢あり。**辛い要素は“抜き”で頼む**のがコツ！
    
    ---

user
    いいね！このルートでいこう

tool finish_proposing
tool done finish_proposing

assistant
    よかよか、これで十分たい。
    **中洲〜博多エリアで、ラーメン中心の2泊3日**として、かなり使いやすいルートになっとるよ。

user
    予約してほしい

tool book_trip

assistant
    おっけ、予約手配したけんね！
    **確認ID：BK-MSA41O3W** ✅
    
    明細とか追加で必要な情報あったら、すぐ言うて〜。
```

</details>

## まとめ

- Flue 2.0 では、エージェントの定義方法が大きく変わり、Agent Hooks を使用してエージェントを定義するようになった。
- Agent Hooks を使用することで、状態に応じてツールやスキルを切り替えたり、ステートマシンのような複雑なワークフローを簡単に実装できるようになった。
- 関数でエージェントを定義し、`useTool`, `useSkill`, `useModel` フックを呼び出すことでツールやスキルを登録する。
- `usePersistentState` フックを使用して状態を管理することで、状態に応じてツールやスキルを切り替えることができる。状態は DB に永続化される。
- 複数ステップがあるワークフローを専用 DSL を使わず、通常の TypeScript で表現できるようになった。

## 参考

- [Flue 2.0 | Flue](https://flueframework.com/blog/flue-2/)
- [Agent Hooks | Flue](https://flueframework.com/docs/guide/agent-hooks/)
- [Agent Hooks API | Flue](https://flueframework.com/docs/reference/agent-hooks-api/)
