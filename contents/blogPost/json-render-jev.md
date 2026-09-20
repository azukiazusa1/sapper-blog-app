---
id: sB229kdnDZshAZ3_OSsJ9
title: "json-render と Jev で UI を組み立ててみた"
slug: "json-render-jev"
about: "json-render の Jev 連携では、文言やデータを含むコンポーネントの候補を用意し、モデルに選択と配置を任せます。従来の json-render では、モデルが新しい Props を生成していました。この記事では Jev 連携の仕組みと、従来の json-render との違いを紹介します。"
createdAt: "2026-09-20T12:41+09:00"
updatedAt: "2026-09-20T18:30+09:00"
tags: ["json-render", "Jev", "Generative UI"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/77EZHkGzyIcfCCDbAFMqQY/e32fb6c93564d2ca0d5ad7f80d70bcfe/tamagodoufu_15876-768x630.png"
  title: "卵豆腐のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "json-render と Jev の連携で、アプリケーション側が事前に用意するのはどれですか？"
      answers:
        - text: "画面全体を完成させた HTML のテンプレート"
          correct: false
          explanation: "完成した画面全体を渡すのではなく、具体的な props やアクションを持つ部品の候補を渡します。"
        - text: "具体的な props やアクションを持つ部品の候補"
          correct: true
          explanation: "Jev は候補の採用と配置を判断し、その結果を使って composer が Spec を構築します。"
        - text: "コンポーネントの名前と props の型だけ"
          correct: false
          explanation: "カタログの型定義だけでは、表示する文言やデータが足りません。具体的な値や状態バインドを持つ候補が必要です。"
        - text: "モデルが新しい props を生成するための文章例"
          correct: false
          explanation: "この連携では、モデルが props の文章を新しく生成するのではなく、アプリケーションが設定済みの候補を用意します。"
    - question: "名前のテキストボックスを編集した値を状態に反映する組み合わせはどれですか？"
      answers:
        - text: "$bindState と useBoundProp()"
          correct: true
          explanation: "候補でバインド先を指定し、React 側では useBoundProp() が返す関数でその状態を更新します。"
        - text: "$state と catalog.prompt()"
          correct: false
          explanation: "$state は状態の読み取り、catalog.prompt() はモデルに渡すカタログの説明に使います。"
        - text: "root: false と emit()"
          correct: false
          explanation: "root: false はルート候補からの除外、emit() はイベントの発火に使います。"
        - text: "description と initialState"
          correct: false
          explanation: "description は候補の説明、initialState は初期状態です。この 2 つだけでは編集後の値を反映できません。"
published: true
---
[json-render](https://json-render.dev/) は AI が UI を生成する Generative UI のためのライブラリです。カタログに定義したコンポーネントとアクションを使って、AI が UI の構造を表す JSON を生成し、その JSON を元に React などのフレームワークで描画します。AI は事前に定義された部品の中から選択して JSON を組み立てます。とはいえ JSON 自体はモデルが生成するため、狙いどおりの JSON を出力させるプロンプトの設計が欠かせませんでした。

TypeSafe AI 社が新たに発表した AI モデル [Jev](https://docs.typesafe.ai/introduction) は、文章を生成するのではなく、あらかじめ定めた出力候補と形式に沿って結果を返します。TypeSafe AI はこのモデルを、低コストかつ高速に構造化された意思決定を行うものとして説明しています。構造化された JSON を生成する Generative UI の用途に向いていると言えるでしょう。

json-render の [Jev との連携](https://json-render.dev/docs/jev)では、具体的な値を設定したコンポーネントを候補として渡し、どの部品をどこに置くかをモデルに選ばせます。従来の json-render では、モデルに「名前のテキストボックスを作ってください」と文章で指示し、モデルが必要なラベルを判断し新しい Props を都度生成します。Jev では、アプリケーション側が「名前のテキストボックスはこの候補の中から選んでください」と事前に用意しておきます。

この記事では、実際に Jev と json-render を使用し UI を組み立てる様子を紹介し、OpenAI の GPT-4.1 mini を使用した従来の json-render の実装との違いを解説します。

:::warning
Jev 連携は実験的な API です。`experimental_` で始まる API は変更される可能性があるため、利用する際は注意してください。
:::

## JSON を生成させる方法と、候補から選ばせる方法

通常の json-render では、利用できるコンポーネントの名前や props のスキーマをカタログに定義します。LLM にカタログを説明し、UI の構造を表す `Spec` を生成させます。`Spec` にはルート要素の ID、各要素の props、子要素との関係などが含まれます。

例えば、テキストボックスを表す `Input` コンポーネントを登録するカタログは次のように定義します。

```ts
import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { z } from "zod";

const catalog = defineCatalog(schema, {
  components: {
    Input: {
      props: z.object({
        label: z.string(),
        type: z.enum(["text", "email"]),
        value: z.string(),
      }),
    },
  },
  actions: {},
});
```

このカタログでは、`Input` に渡せる props の名前と型を定義しています。`label` に「名前」を指定するか「メールアドレス」を指定するかといった具体的な値は、ここでは決めていません。`catalog.prompt()` でカタログの説明をプロンプトとして生成し、LLM に渡して `Spec` を生成させます。このプロンプトによりモデルが出力する JSON の構造をカタログの定義に従わせているのです。

```ts
import { streamText } from "ai";
import { buildUserPrompt } from "@json-render/core";
import { catalog, prompt } from "./catalog";

const result = streamText({
  model: "openai/gpt-4.1-mini",
  system: catalog.prompt(),
  prompt: buildUserPrompt({ prompt }),
});

return result.toTextStreamResponse();
```

一方、Jev は選択肢に対する判断を返すモデルです。今回使う `experimental_composeSpec()` は、その判断を受け取って `Spec` を構築します。例えば、名前のテキストボックスは次のような候補をあらかじめ用意しておきます。

```ts
import type { Experimental_CompositionCandidate } from "@json-render/core";

const nameCandidate = {
  id: "name",
  description: 'Editable name, label "名前", bound to /name',
  root: false,
  element: {
    type: "Input",
    props: {
      label: "名前",
      type: "text",
      value: { $bindState: "/name" },
    },
  },
} satisfies Experimental_CompositionCandidate;
```

モデルに任せるのは、この候補を採用するか、どの親要素のどの位置に置くかという判断に限られます。

## パッケージと API キーを準備する

それでは実際に動かして試してみましょう。React プロジェクトに、次のパッケージを追加します。

```bash
npm install --save-exact @json-render/core@0.21.0 @json-render/react@0.21.0 zod@4.3.6 ai@7.0.107
```

Vercel AI Gateway のキーを発行して `.env` に保存してください。

```dotenv
AI_GATEWAY_API_KEY=発行したキー
```

:::info
2026 年 9 月 25 日までは、[Vercel AI Gateway 経由で Jev を無料で使用できます](https://vercel.com/ai-gateway/models/jev)。
:::

Jev を使うには、Gateway のチームで `typesafe-ai` プロバイダーが許可されている必要があります。キーを発行しただけでは利用を開始できない場合もあるため、[Gateway の認証設定](https://vercel.com/docs/ai-gateway/authentication-and-byok)も確認してください。

## カタログと候補を定義する

まず、パネル、テキストボックス、ボタンの 3 種類をカタログに登録します。パネルの `slots` は子要素を置ける場所、ボタンの `events` は発火できるイベントを表します。

```ts:src/catalog.ts
import {
  defineCatalog,
  type Experimental_CompositionCandidate,
} from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { z } from "zod";

export const catalog = defineCatalog(schema, {
  components: {
    Panel: { props: z.object({ title: z.string() }), slots: ["default"] },
    Input: {
      props: z.object({
        label: z.string(),
        type: z.enum(["text", "email"]),
        value: z.string(),
      }),
    },
    Button: { props: z.object({ label: z.string() }), events: ["press"] },
  },
  actions: {
    savePreferences: {
      params: z.object({ name: z.string(), email: z.string() }),
    },
  },
});
```

`savePreferences` は名前とメールアドレスを受け取る操作です。後からこの定義に対するハンドラーを React 側で実装します。

続いて、同じファイルに初期状態と候補を追加します。名前のテキストボックスとメールアドレスのテキストボックスは同じ `Input` コンポーネントですが、props が異なるので別々の候補として定義します。

```ts:src/catalog.ts
export const initialState = { name: "Azuki", email: "azuki@example.com" };
export const candidates = [
  {
    id: "settings",
    description: 'Account settings panel, title "アカウント設定"',
    element: { type: "Panel", props: { title: "アカウント設定" } },
  },
  {
    id: "name",
    description: 'Editable name, label "名前", bound to /name',
    root: false,
    element: {
      type: "Input",
      props: { label: "名前", type: "text", value: { $bindState: "/name" } },
    },
  },
  {
    id: "email",
    description: 'Editable email, label "メールアドレス", bound to /email',
    root: false,
    element: {
      type: "Input",
      props: {
        label: "メールアドレス",
        type: "email",
        value: { $bindState: "/email" },
      },
    },
  },
  {
    id: "save",
    description:
      'Save preferences button, label "保存", save current name and email',
    root: false,
    element: {
      type: "Button",
      props: { label: "保存" },
      on: {
        press: {
          action: "savePreferences",
          params: { name: { $state: "/name" }, email: { $state: "/email" } },
        },
      },
    },
  },
] satisfies Experimental_CompositionCandidate[];
export const prompt =
  "アカウント設定のパネルを作ってください。名前、メールアドレス、保存ボタンの順に縦に並べてください。各テキストボックスは編集可能にし、保存ボタンで現在の名前とメールアドレスを保存してください。";
```

`$bindState` はテキストボックスと状態を結び付けるための式です。名前を編集すると `/name` の値が変わります。保存ボタンの引数に指定した `$state` は、その時点の状態を読み取ります。

`root: false` を付けた候補はルートとして選ばれません。ここでは `Panel` だけをルートの候補にしています。テキストボックスやボタンをパネルの内側に配置する判断は、モデルに任せます。

また、`description` には選択に必要な情報を書きます。今回なら、どの候補が名前やメールアドレスのテキストボックスなのかを説明します。候補の props は、初期状態を使って式を解決したうえでスキーマに照合されます。[公式ガイドの制約](https://json-render.dev/docs/jev#validation-and-v1-limits)を参照してください。

## Jev を呼び出して Spec を受け取る

`experimental_createEvaluator()` で Gateway に接続する評価関数を作り、`experimental_composeSpec()` に渡します。簡単なスクリプトで、生成中の `step` イベントがどのような `Spec` を返すかを確認してみましょう。

```ts:src/run-jev.ts
import { writeFile } from "node:fs/promises";
import {
  experimental_composeSpec,
  experimental_createEvaluator,
} from "@json-render/core";
import { catalog, candidates, initialState, prompt } from "./catalog";

const evaluate = experimental_createEvaluator({
  model: "typesafe-ai/jev",
  apiKey: process.env.AI_GATEWAY_API_KEY!,
});

try {
  for await (const event of experimental_composeSpec({
    catalog,
    candidates,
    initialState,
    prompt,
    evaluate,
    maxSteps: 4,
    maxElements: 4,
    signal: AbortSignal.timeout(30_000),
  })) {
    if (event.type === "step") {
      console.log(event.step.choice, event.spec);
    } else {
      console.log("stopReason:", event.stopReason);
      if (event.stopReason === "finish" && event.spec) {
        await writeFile("spec.json", JSON.stringify(event.spec, null, 2));
      }
    }
  }
} catch {
  console.error(
    "生成に失敗しました。Gateway の利用設定と通信状態を確認してください。",
  );
  process.exitCode = 1;
}
```

次のコマンドで `.env` を読み込んで実行します。

```bash
node --env-file=.env --import tsx src/run-jev.ts
```

実際に実行すると、次のように出力されました。

```txt
select {
  root: 'node_0',
  elements: {
    node_0: { type: 'Panel', props: [Object], children: [Array] },
    node_1: { type: 'Input', props: [Object], children: [] },
    node_2: { type: 'Input', props: [Object], children: [] },
    node_3: { type: 'Button', props: [Object], on: [Object], children: [] }
  },
  state: { name: 'Azuki', email: 'azuki@example.com' }
}
layout {
  root: 'node_0',
  elements: {
    node_0: { type: 'Panel', props: [Object], children: [Array] },
    node_1: { type: 'Input', props: [Object], children: [] },
    node_2: { type: 'Input', props: [Object], children: [] },
    node_3: { type: 'Button', props: [Object], on: [Object], children: [] }
  },
  state: { name: 'Azuki', email: 'azuki@example.com' }
}
stopReason: finish
```

先頭の `select` と `layout` は `step.choice` の値です。候補が 4 つあるのに `step` イベントは 2 回しか発生していません。これは `experimental_composeSpec()` の `strategy` が、新しい木を作る場合は既定で `"batch"` になっているためです。`"batch"` では、どの候補を採用するかをまとめて 1 回（`select`）、採用した部品をどの親のどの位置に置くかをまとめて 1 回（`layout`）評価します。部品ごとに評価を繰り返す `"sequential"` と違い、モデルへの問い合わせ回数が要素の数に左右されません。

書き出された `spec.json` から、ルートのパネルと名前のテキストボックスを抜き出すと、次のようになります。

```json
{
  "root": "node_0",
  "elements": {
    "node_0": {
      "type": "Panel",
      "props": {
        "title": "アカウント設定"
      },
      "children": [
        "node_1",
        "node_2",
        "node_3"
      ]
    },
    "node_1": {
      "type": "Input",
      "props": {
        "label": "名前",
        "type": "text",
        "value": {
          "$bindState": "/name"
        }
      },
      "children": []
    }
  },
  "state": {
    "name": "Azuki",
    "email": "azuki@example.com"
  }
}
```

`root` が示す `node_0` は `Panel` です。その `children` には、名前の `node_1`、メールアドレスの `node_2`、保存ボタンの `node_3` がこの順に並んでいます。また、名前の `value` は文字列に置き換わらず、`{ "$bindState": "/name" }` という状態へのバインドを保っています。初期値の `Azuki` は、別の `state.name` に入っています。

<details>
<summary>生成された spec.json の全体</summary>

```json
{
  "root": "node_0",
  "elements": {
    "node_0": {
      "type": "Panel",
      "props": {
        "title": "アカウント設定"
      },
      "children": [
        "node_1",
        "node_2",
        "node_3"
      ]
    },
    "node_1": {
      "type": "Input",
      "props": {
        "label": "名前",
        "type": "text",
        "value": {
          "$bindState": "/name"
        }
      },
      "children": []
    },
    "node_2": {
      "type": "Input",
      "props": {
        "label": "メールアドレス",
        "type": "email",
        "value": {
          "$bindState": "/email"
        }
      },
      "children": []
    },
    "node_3": {
      "type": "Button",
      "props": {
        "label": "保存"
      },
      "on": {
        "press": {
          "action": "savePreferences",
          "params": {
            "name": {
              "$state": "/name"
            },
            "email": {
              "$state": "/email"
            }
          }
        }
      },
      "children": []
    }
  },
  "state": {
    "name": "Azuki",
    "email": "azuki@example.com"
  }
}
```

</details>

`step` イベントが持つ `spec` は、その時点の UI 全体のスナップショットです。差分だけを足すのではなく、現在表示している `Spec` を置き換えるために使います。実際の Web アプリケーションでは、`step` イベントを受け取るたびに描画を更新することで、完成した部分から徐々に画面が表示されるようにできます。

## React で表示し、入力値を保存アクションに渡す

React で描画するには、`registry` にコンポーネントの実装を登録します。この `registry` により AI が出力する Spec と実際の React コンポーネントが結び付けられます。パネル、テキストボックス、ボタンの 3 種類を登録します。

```tsx:src/registry.tsx
import React, { useId } from "react";
import { useBoundProp, type ComponentRegistry } from "@json-render/react";
export const registry: ComponentRegistry = {
  Panel: ({ element: { props }, children }) => (
    <section className="panel">
      <h1>{props.title}</h1>
      {children}
    </section>
  ),
  Input: ({ element: { props }, bindings }) => {
    const id = useId();
    const [value, setValue] = useBoundProp<string>(
      props.value,
      bindings?.value,
    );
    return (
      <div className="field">
        <label htmlFor={id}>{props.label}</label>
        <input
          id={id}
          type={props.type}
          value={value ?? ""}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  },
  Button: ({ element: { props }, emit }) => (
    <button type="button" onClick={() => emit("press")}>
      {props.label}
    </button>
  ),
};
```

テキストボックスで重要なのは `useBoundProp()` です。解決済みの値とバインド先を渡し、返された関数で状態を更新します。ラベルとテキストボックスは `useId()` で結び付けています。ボタンは `emit("press")` で、`Spec` に記録されたアクションを発火させます。

受信した `spec` は、`JSONUIProvider` と `Renderer` に渡します。

```tsx
import { JSONUIProvider, Renderer } from "@json-render/react";
import { registry } from "./registry";

// バックエンドの API から spec を取得する処理がある...

<fieldset disabled={loading}>
  <JSONUIProvider
    registry={registry}
    initialState={spec.state}
    handlers={{
      savePreferences: (params) => {
        setStatus(`保存しました: ${params.name} / ${params.email}`);
      },
    }}
  >
    <Renderer spec={spec} registry={registry} loading={loading} />
  </JSONUIProvider>
</fieldset>;
```

実際に UI が以下のように描画されることが確認できました。

!v(https://videos.ctfassets.net/in6v9lxmm5c8/32pxlyboTtOx54jNQIymWN/4a3aa1eab45316076ea62dad139f0cd5/json-render-jev-1.mp4 728x642)

## まとめ

- json-render の Jev 連携では、具体的な props やアクションを持つ候補を用意し、部品の選択と配置をモデルに任せる。通常の json-render では、モデルに文章で指示して新しい props を生成させる
- `experimental_createEvaluator()` で Gateway に接続する評価関数を作り、`experimental_composeSpec()` に渡す
- `experimental_composeSpec()` では `Spec` を構築するために、候補の採用と配置をモデルに判断させる
- React で描画する際は、`registry` にコンポーネントの実装を登録し、`useBoundProp()` を使って状態をバインドする

## 参考

- [Jev (Experimental) | json-render](https://json-render.dev/docs/jev)
- [Release v0.21.0](https://github.com/vercel-labs/json-render/releases/tag/v0.21.0)
- [Add experimental composition APIs and playground model option #342](https://github.com/vercel-labs/json-render/pull/342)
