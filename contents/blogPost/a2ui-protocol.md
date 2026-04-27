---
id: 0fRRfXk0kzrJ3yNChwJqk
title: "AI エージェントが UI を安全に生成して描画するためのプロトコル A2UI とは？"
slug: "a2ui-protocol"
about: "Google が提唱する A2UI（Agent-to-UI）プロトコルは、AI エージェントが安全に UI を生成してクライアントに送信し、クライアントがそれを描画するための標準的な方法を提供します。A2UI は、AI エージェントがテキストの応答を返す代わりに宣言的なコンポーネント定義を返すことにより、クライアントはネイティブなウィジェットを使用して安全に UI をレンダリングできます。"
createdAt: "2026-04-26T15:52+09:00"
updatedAt: "2026-04-26T15:52+09:00"
tags: ["A2UI", "AI"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1dooeCmQzaXhE2tdKdg3gh/42b0ef819dbd7f13b644f636e9cf0ea5/tiramisu_23455-768x591.png"
  title: "ティラミスのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "A2UI が AI エージェントによる UI 生成で解決しようとしている主な課題はどれですか?"
      answers:
        - text: "AI エージェントが任意の JavaScript コードを直接ブラウザで実行できるようにすること"
          correct: false
          explanation: "記事では、実行可能なコードを含まない宣言的なコンポーネント定義を使うことで安全性を高めると説明されています。"
        - text: "AI エージェントが生成した UI を、信頼境界を越えて安全にクライアントへ送信して描画すること"
          correct: true
          explanation: "記事では、A2UI は AI エージェントがリッチな UI を安全に送信し、クライアントがネイティブなウィジェットで描画するためのプロトコルだと説明されています。"
        - text: "AI エージェントが画像生成モデルを使わずにスクリーンショットを作成すること"
          correct: false
          explanation: "記事の主題は UI の宣言的な定義と描画であり、スクリーンショット生成の仕組みではありません。"
        - text: "AI エージェントがすべての UI を iframe 内で隔離して表示すること"
          correct: false
          explanation: "記事では、iframe ではなくネイティブなウィジェットを使用して描画すると説明されています。"
    - question: "A2UI v0.9 のサーバーからクライアントへのメッセージとして、記事で挙げられているものはどれですか?"
      answers:
        - text: "`surfaceUpdate`、`dataModelUpdate`、`userAction`、`renderComplete`"
          correct: false
          explanation: "記事では、v0.9 のサーバーからクライアントへのメッセージとしてこれらの名前は使っていません。"
        - text: "`createSurface`、`updateComponents`、`updateDataModel`、`deleteSurface`"
          correct: true
          explanation: "記事では、A2UI v0.9 のサーバーからクライアントへのメッセージはこの4種類だと説明されています。"
        - text: "`startRendering`、`patchComponent`、`syncModel`、`finishSurface`"
          correct: false
          explanation: "これらは記事で説明されている A2UI v0.9 のメッセージ名ではありません。"
        - text: "`mountSurface`、`renderWidget`、`sendAction`、`closeSession`"
          correct: false
          explanation: "記事では、サーフィス作成やコンポーネント更新には `createSurface` や `updateComponents` を使うと説明されています。"
    - question: "A2UI v0.9 のコンポーネント定義について、記事の説明として正しいものはどれですか?"
      answers:
        - text: "各コンポーネントは `id`、`component`、コンポーネント固有のプロパティを同じ階層に持つ"
          correct: true
          explanation: "記事では、各コンポーネントは flat list の要素として定義され、`child` や `children` で他のコンポーネント ID を参照すると説明されています。"
        - text: "各コンポーネントは `component` の中に `Text` や `Button` のオブジェクトをネストして定義する"
          correct: false
          explanation: "記事で修正後に説明されている v0.9 の形式では、コンポーネント種別と各プロパティは同じ階層に置かれます。"
        - text: "コンポーネントは HTML 文字列として生成し、クライアントがそのまま DOM に挿入する"
          correct: false
          explanation: "記事では、A2UI は実行可能なコードや HTML 文字列ではなく、カタログに基づく宣言的なコンポーネント定義を使うと説明されています。"
        - text: "コンポーネントの親子関係は JSON Pointer だけで表現する"
          correct: false
          explanation: "JSON Pointer はデータモデルの値を参照するために使われます。親子関係は `child` や `children` にコンポーネント ID を指定して表現します。"
published: true
---
AI エージェントが UI を生成する手法として「Generative UI」というアプローチが注目されています。これは、AI とユーザーの対話の中で動的に UI を生成して回答することです。これはテキストだけでは伝えきれない情報を視覚的に表現したり、ユーザーが操作できるインターフェイスを提供するための方法として有望です。例えば料理を注文する際に、AI が料理の写真や注文ボタンを含む UI を生成して提供できます。テキストで料理の特徴を説明されるよりもよっぽどわかりやすいですし、選択肢を回答する際もテキストで返答するよりもカードをタッチして選択するほうが直感的です。

しかし、AI が生成した UI を安全に描画するためには、いくつかの課題があります。例えば、AI が生成した UI に悪意のある `<script>` が含まれている可能性があるため、セキュリティ上のリスクを考慮する必要があります。また、AI が生成する UI の品質や一貫性を保つためのガイドラインも必要です。

Google が提唱する「A2UI」は、AI エージェントが信頼境界を越えてリッチな UI を安全に送信できるかどうかという問題を解決します。AI エージェントがテキストの応答を返す代わりに宣言的なコンポーネント定義を返すことにより、クライアントはネイティブなウィジェットを使用して安全に UI をレンダリングできます。このコンポーネント定義自身は実行可能なコードを含まず、単に仕様に従った JSON 形式のデータです。エージェントはこの JSON を生成する際に事前に定義された「カタログ」からコンポーネントを選択して使用するため、セキュリティ上のリスクを減らすことができます。

A2UI は、AI エージェントが生成する UI を安全に描画するためのプロトコルであり、特定のプラットフォームに依存しません。Web ブラウザだけでなく、モバイルアプリやデスクトップアプリなど、さまざまな環境で利用できます。

この記事では実際に A2UI を使用して AI エージェントが UI を生成し、クライアントがそれを安全に描画する方法について解説します。

## A2UI の基本的な仕組み

A2UI は以下の概念に基づいています。

- サーフィス: コンポーネントを表示するためのキャンバス
- コンポーネント: UI の構成要素。例えばボタン、テキスト、カードなど
- データモデル: アプリケーションの状態を表す。コンポーネントはこの状態にバインドされる
- カタログ: 使用可能なコンポーネントの定義
- メッセージ: `createSurface` や `updateComponents`、`updateDataModel` といった命令を含む JSON オブジェクト

典型的なワークフローは以下の通りです。

1. ユーザーが AI エージェントに質問やリクエストを送る: 例「カレーライスを注文したいので、おすすめのレストランを教えて」
2. AI エージェントがリクエストを処理し、UI をレンダリングするためのコンポーネント定義を含むメッセージを生成する: 事前に承認されたカタログからコンポーネントを選択して、JSON 形式で返却する
3. メッセージはクライアントにストリーミングされる: ストリーミング時には JSON Lines 形式で送られるため、クライアントは部分的に受け取った段階で UI を更新できる
4. クライアントはフレームワーク（React, Angular, Flutter など）に対応したレンダラーを使用して、受け取ったコンポーネント定義に基づいて UI を描画する: iframe ではなく、ネイティブなウィジェットを使用して描画する
5. ユーザーが UI を操作すると、クライアント側のデータモデルが更新される。ボタンのクリックなどのアクションが発火したタイミングで、必要な値がサーバーに送信される
6. AI エージェントは必要に応じて新しい JSON メッセージを生成してクライアントに送る

例えばカレーライスの注文カードを生成する場合、AI エージェントは以下のような JSONL を生成してクライアントに送ります。A2UI v0.9 のサーバーからクライアントへのメッセージは `createSurface`、`updateComponents`、`updateDataModel`、`deleteSurface` の 4 種類です。

```json
{"version":"v0.9","createSurface":{"surfaceId":"main","catalogId":"https://a2ui.org/specification/v0_9/basic_catalog.json"}}
{"version":"v0.9","updateDataModel":{"surfaceId":"main","path":"/order","value":{"quantity":1}}}
{"version":"v0.9","updateComponents":{"surfaceId":"main","components":[{"id":"root","component":"Card","child":"content"},{"id":"content","component":"Column","children":["header","quantity","submit"]},{"id":"header","component":"Text","text":"美味しいカレー屋さん","variant":"h2"},{"id":"quantity","component":"TextField","label":"注文数","value":{"path":"/order/quantity"},"variant":"number"},{"id":"submitLabel","component":"Text","text":"注文する"},{"id":"submit","component":"Button","child":"submitLabel","variant":"primary","action":{"event":{"name":"confirm","context":{"details":{"path":"/order"}}}}}]}}
```

`createSurface` メッセージは、`surfaceId` で指定されたサーフィスを作成します。`updateDataModel` メッセージはサーフィスのデータモデルを初期化・更新します。`updateComponents` メッセージは、どのコンポーネントをどのように配置するかを定義します。ここでは、カードコンポーネントの中にテキストフィールドとボタンを配置する構造になっています。

各コンポーネントは `id`、`component`、コンポーネント固有のプロパティを同じ階層に持つオブジェクトとして定義されます。カードやカラムの子コンポーネントは `child` や `children` にコンポーネント ID を指定して参照します。これはネストされた構造は LLM により段階的にストリーミングするのが難しいため、フラットな構造で定義されているためです。

テキストフィールドの値はデータモデルの `/order/quantity` にバインドされています。このように特定の値へのパスを指定する形式は JSON Pointer と呼ばれ [RFC 6901](https://www.rfc-editor.org/rfc/rfc6901.html) で定義されています。ユーザーがテキストフィールドに入力すると、クライアント側のローカルデータモデルが即座に更新されます。この入力だけではサーバーへの通信は発生せず、ボタンのクリックなどのアクションが発火したときに、`action.event.context` で参照した値がサーバーに送られます。

`submit` のボタンコンポーネントには `confirm` というアクションが定義されており、ユーザーがこのボタンをクリックすると、データモデルの `/order` にある現在の注文内容が送られるようになっています。クライアントからサーバーに送られるアクションは以下のような形式になります。

```json
{
  "action": {
    "name": "confirm",
    "surfaceId": "main",
    "sourceComponentId": "submit",
    "timestamp": "2026-04-26T15:52:00+09:00",
    "context": {
      "details": {
        "quantity": 1
      }
    }
  }
}
```

## CopilotKit を使って A2UI を試してみる

それでは実際に A2UI を実装して UI がリアルタイムに更新される様子を試してみましょう。A2UI を実装する方法はいくつかありますが、ここでは [CopilotKit](https://docs.copilotkit.ai/generative-ui/a2ui) を使用して、Node.js 環境で簡単に試せる方法を紹介します。CopilotKit は [AG-UI](https://github.com/ag-ui-protocol/ag-ui) と A2UI をサポートしており、Google の公式 A2UI リリースにおけるローンチパートナーです。CopilotKit は A2UI メッセージを React コンポーネントとして描画します。

以下のコマンドで Next.js プロジェクトを作成します。

```bash
npx create-next-app@latest my-copilot-app
```

プロジェクトが作成されたら、CopilotKit のパッケージをインストールします。

```bash
npm install @copilotkit/react-core @copilotkit/react-ui @copilotkit/runtime
```

`.env` ファイルを作成して、使用する LLM に応じた API キーを設定します。Claude を使用する場合は以下のように設定します。

```:.env
ANTHROPIC_API_KEY=your_anthropic_api_key
```

AI エージェントを呼び出すバックエンドのために API ルートを作成します。`app/api/copilotkit/route.ts` というファイルを作成して、以下のコードを追加します。`CopilotRuntime` のオプションに `a2ui: { injectA2UITool: true }` を指定することで、A2UI の機能が有効になります。

```typescript
import {
  CopilotRuntime,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { BuiltInAgent } from "@copilotkit/runtime/v2";
import { NextRequest } from "next/server";

const builtInAgent = new BuiltInAgent({
  model: "anthropic:claude-sonnet-4-5",
});

const runtime = new CopilotRuntime({
  agents: { default: builtInAgent },
  a2ui: {
    injectA2UITool: true,
  },
});

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
```

`app/layout.tsx` を編集して `<CopilotKit>` プロバイダーでアプリ全体をラップします。`runtimeUrl` には先ほど作成した API ルートのエンドポイントを指定します。

```tsx
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/v2/styles.css";
import "./globals.css";
// ...
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CopilotKit runtimeUrl="/api/copilotkit">{children}</CopilotKit>
      </body>
    </html>
  );
}
```

最後に、`app/page.tsx` を編集して、AI エージェントからの応答を表示するためのコンポーネントを追加します。

```tsx
import { CopilotChat } from "@copilotkit/react-core/v2";

export default function Page() {
  return (
    <main>
      <h1>Your App</h1>
      <CopilotChat />
    </main>
  );
}
```

この段階でチャットインターフェースが表示されるようになっています。「こんにちは」というメッセージを送信してみると「視覚的なインターフェースを作成できます」と応答が返ってきました。これはサーバー側で A2UI を有効にしているため、AI が UI を生成するためのシステムプロンプトが含まれているためですね。

![](https://images.ctfassets.net/in6v9lxmm5c8/6W3dxuG7UleLI8RZmeFzkB/fe7c83ba0de6ade0c72e115ec0fa6a2a/image.png)

例として「予約システムを表示して」と入力してみましょう。デフォルトでは A2UI に[あらかじめ用意されているカタログ](https://github.com/google/A2UI/blob/main/specification/v0_9/json/basic_catalog.json) からコンポーネントを選択して使用するようになっています。AI エージェントはこのカタログからコンポーネントを選んで、予約フォームを生成してくれました。

![](https://images.ctfassets.net/in6v9lxmm5c8/73BkMfASfFohVnzQcjTPil/8210a3a0a9ed07b6959090a789e2a40e/image.png)

CopilotKit のインスペクター（画面右上にある黒いアイコン）を使用することで、AI エージェントが生成した A2UI メッセージの内容を確認できます。

```json
{
  "surfaceId": "reservation-system",
  "catalogId": "https://a2ui.org/specification/v0_9/basic_catalog.json",
  "components": [
    {
      "id": "root",
      "component": "Column",
      "children": [
        "header",
        "divider1",
        "form-content",
        "divider2",
        "submit-section"
      ]
    },
    ...
        {
      "id": "service-picker",
      "component": "ChoicePicker",
      "label": "ご希望のサービスを選択してください",
      "variant": "mutuallyExclusive",
      "displayStyle": "chips",
      "options": [
        {
          "label": "スタンダードプラン (60分)",
          "value": "standard"
        },
        {
          "label": "プレミアムプラン (90分)",
          "value": "premium"
        },
        {
          "label": "デラックスプラン (120分)",
          "value": "deluxe"
        },
        {
          "label": "コンサルテーション (30分)",
          "value": "consultation"
        }
      ],
      "value": {
        "path": "/reservation/service"
      }
    },
  ]
}
```

予約を確定するボタンをクリックすると、AI エージェントにユーザーの選択内容が送られ AI からの応答が返ってきます。

## `@a2ui/react` パッケージを使用した A2UI の実装

CopilotKit を使用すると簡単に A2UI の実装を試すことができますが、実装の詳細は隠されたままになっています。ここでは学習のために、Google が提供する `@a2ui/react` パッケージを使用して、より低レベルな実装を試してみましょう。`@a2ui/react` は A2UI の React 向けのレンダラーで、A2UI メッセージを受け取って React コンポーネントとして描画するためのライブラリです。

### カタログの作成

CopilotKit を使用した実装ではあらかじめ用意されたカタログを使用しましたが、実際のプロジェクトではプロダクトのデザインシステムに合わせた独自のカタログを作成することが多いでしょう。カタログは JSON スキーマで定義され、使用可能なコンポーネントとそのプロパティを宣言します。以下は A2 UI の基本カタログの一部を抜粋した例です。

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://a2ui.org/specification/v0_9/basic_catalog.json",
  "title": "A2UI Basic Catalog",
  "description": "Unified catalog of basic A2UI components and functions.",
  "catalogId": "https://a2ui.org/specification/v0_9/basic_catalog.json",
  "components": {
    "Button": {
      "type": "object",
      "allOf": [
        {
          "type": "object",
          "properties": {
            "component": {
              "const": "Button"
            },
            "child": {
              "$ref": "common_types.json#/$defs/ComponentId",
              "description": "The ID of the child component. Use a 'Text' component for a labeled button. Only use an 'Icon' if the requirements explicitly ask for an icon-only button. Do NOT define the child component inline."
            },
            "variant": {
              "type": "string",
              "description": "A hint for the button style. If omitted, a default button style is used. 'primary' indicates this is the main call-to-action button. 'borderless' means the button has no visual border or background, making its child content appear like a clickable link.",
              "enum": ["default", "primary", "borderless"],
              "default": "default"
            },
            "action": {
              "$ref": "common_types.json#/$defs/Action"
            }
          },
          "required": ["component", "child", "action"]
        }
      ],
      "unevaluatedProperties": false
    }
  }
}
```

カタログは、コンポーネントの種類やプロパティを定義するだけでなく、使用に関するガイドラインも提供します。例えば、上記の `Button` コンポーネントの定義では、子コンポーネントは必ず `Text` であるべきで、アイコンのみのボタンは要件が明示的に求めている場合を除いて使用しないように指示しています。

JSON Schema を直接作成できますが、コードを元にカタログを生成する方法が一般的でしょう。TypeScript では Zod スキーマを使用してカタログを定義できるので、より型安全にカタログを作成できます。

まずは必要なパッケージをインストールしましょう。引き続き Next.js のプロジェクトを使用します。

```bash
# zod は @a2ui/web_core に合わせて v4 ではなく v3 をインストールする
npm install @a2ui/web_core @a2ui/react zod@3
```

`ComponentApi` 型を満たすオブジェクトを定義して、カタログを作成します。`lib/catalog.ts` というファイルを作成して、以下のコードを追加します。ここでは MyColumn, Text, Button, TextField という 4 つのコンポーネントを定義しています。

```typescript:lib/catalog.ts
import { z } from "zod";
import {
  ComponentApi,
  ChildListSchema,
  ActionSchema,
  ComponentIdSchema,
  CheckableSchema,
  DynamicStringSchema,
} from "@a2ui/web_core/v0_9";

/**
 * コンポーネントツリーには必ず id: "root" を持つルートコンポーネントが必要。
 * 典型的には複数の子要素を持つ Column / Row / Card のようなコンテナコンポーネントが使用される。
 */
export const MyColumnApi = {
  name: "MyColumn",
  schema: z
    .object({
      children: ChildListSchema.describe(
        "An array of child component IDs to render vertically. Children must be referenced by ID only — do NOT define components inline.",
      ),
      gap: z
        .enum(["none", "small", "medium", "large"])
        .default("medium")
        .describe(
          "The spacing between children. 'none' for no gap, 'small'/'medium'/'large' for predefined spacings.",
        )
        .optional(),
    })
    .strict()
    .describe(
      "A vertical layout container. Use this as the root component when displaying multiple elements (e.g., a form with several fields).",
    ),
} satisfies ComponentApi;


export const MyTextApi = {
  name: "MyText",
  schema: z
    .object({
      text: DynamicStringSchema.describe(
        "The text content to display. Simple Markdown formatting is supported, but prefer dedicated UI components for richer presentation.",
      ),
      variant: z
        .enum(["h1", "h2", "h3", "h4", "h5", "caption", "body"])
        .default("body")
        .describe(
          "A hint for the base text style. Use 'h1'–'h5' for headings, 'caption' for small supplementary text, and 'body' for regular content.",
        )
        .optional(),
    })
    .strict(),
} satisfies ComponentApi;

export const MyButtonApi = {
  name: "MyButton",
  schema: z
    .object({
      child: ComponentIdSchema.describe(
        "The ID of the child component. Use a 'Text' component for a labeled button. Do NOT define the child component inline.",
      ),
      variant: z
        .enum(["primary", "secondary", "tertiary"])
        .default("primary")
        .describe(
          "The visual style of the button. 'primary' is used for the main action, 'secondary' for less important actions, and 'tertiary' for the least important actions.",
        ),
      action: ActionSchema,
      checks: CheckableSchema.shape.checks,
    })
    .strict(),
} satisfies ComponentApi;

export const MyTextFieldApi = {
  name: "MyTextField",
  schema: z
    .object({
      label: DynamicStringSchema.describe(
        "The text label for the input field.",
      ),
      value: DynamicStringSchema.describe(
        "The current value of the text field. Bind this to a string in the data model.",
      ).optional(),
      variant: z
        .enum(["longText", "number", "shortText", "obscured"])
        .default("shortText")
        .describe(
          "The type of input field to display. 'shortText' is for single-line text, 'longText' for multi-line, 'number' for numeric input, and 'obscured' for passwords.",
        )
        .optional(),
      validationRegexp: z
        .string()
        .describe(
          "A regular expression used for client-side validation of the input.",
        )
        .optional(),
      checks: CheckableSchema.shape.checks,
    })
    .strict(),
} satisfies ComponentApi;
```

`schema` プロパティには、コンポーネントのプロパティのスキーマを Zod の `z.object` で定義します。それぞれのプロパティには `describe` メソッドで説明を追加できます。これらの説明は、AI エージェントがコンポーネントをどのように使用すればいいかを理解するのに役立ちます。また一部の箇所では `@a2ui/web_core` で定義されている共通のスキーマを使用しています。

`DynamicStringSchema` は、単純な文字列リテラルだけでなく、データモデルの値へのパスや条件式なども表現できる特殊なスキーマです。以下のように文字列リテラル、データモデルの値へのパス、条件式などを表現できます。

```
// 1. リテラル — そのまま表示される固定値
"text": "こんにちは"

// 2. DataBinding — データモデルの値を参照する
"text": { "path": "/user/name" }

// 3. FunctionCall — クライアント関数の戻り値を使う
"text": { "call": "formatString", "args": { "template": "Hello {0}", "values": { "path": "/user/name" } }, "returnType": "string" }
```

`ComponentIdSchema` は単なる文字列ですが、他のコンポーネントを ID として参照すべきであることを示すために使用されます。例えば `child` や `children` のプロパティは、他のコンポーネントを参照するために `ComponentIdSchema` を使用して定義されることが多いです。

`ActionSchema` は、ユーザーの操作に対して AI エージェントがどのようなアクションを受け取るかを定義するためのスキーマです。アクションには名前とコンテキストが含まれます。

`CheckableSchema` は、コンポーネントがユーザーの操作に対してどのようなチェックを行うべきかを定義するためのスキーマです。例えば、入力値の検証や、特定の条件が満たされているかどうかのチェックがクライアント側で行われるように定義できます。メールアドレスの形式を検証したい場合は、以下のように AI エージェントによってバリデーションチェックが定義されるようになります。

```json
{
  "id": "email-field",
  "component": "TextField",
  "label": "メールアドレス",
  "value": { "path": "/form/email" },
  "checks": [
    {
      "condition": {
        "call": "isNotEmpty",
        "args": { "value": { "path": "/form/email" } },
        "returnType": "boolean"
      },
      "message": "メールアドレスを入力してください"
    }
  ]
}
```

### カタログとコンポーネントのマッピング

作成したカタログに対して、実際の React コンポーネントをマッピングする必要があります。カタログとコンポーネントマッピングは `createComponentImplementation` 関数を使用して行います。ここでは `Button` コンポーネントの実装例を示します。Props は型安全に取得できます。

```tsx:components/MyButton.tsx
import { createComponentImplementation } from "@a2ui/react/v0_9";
import { MyButtonApi } from "../lib/catalog";

export const Button = createComponentImplementation(
  MyButtonApi,
  ({ props, buildChild }) => {
    const primary = "bg-blue-500 text-white";
    const secondary = "bg-gray-500 text-white";
    const tertiary = "bg-transparent text-gray-500 border border-gray-500";

    const variantClass =
      props.variant === "secondary"
        ? secondary
        : props.variant === "tertiary"
          ? tertiary
          : primary;

    return (
      <button
        className={`px-4 py-2 rounded ${variantClass} disabled:opacity-50`}
        onClick={props.action}
        disabled={props.isValid === false}
      >
        {props.child ? buildChild(props.child) : null}
      </button>
    );
  },
);
```

スキーマに `action` プロパティが定義されている場合、`props` には `action` 関数が含まれています。ユーザーがこのボタンをクリックすると、`action` 関数が呼び出され、AI エージェントにアクションが送信されるようになります。また、スキーマに `checks` が定義されている場合は、`props` に `isValid` と `validationErrors` が含まれます。`Button` コンポーネントに `checks` を定義したことにより、フォーム全体のバリデーションが失敗している場合にはボタンを無効化する、といったことができるようになります。

`buildChild` 関数は、子コンポーネントを描画するための関数です。

### カタログを組み立てる

作成したコンポーネントをカタログに組み込みます。カタログの組み立ては `Catalog` クラスを使用して行います。`Catalog` クラスのコンストラクタには以下の要素を渡します。

- `catalogId`: カタログの ID。一意となる文字列を指定するために、URL を使用することが推奨される
- `components`: カタログに含まれるコンポーネントの定義。コンポーネントの定義は、先ほど作成した `ComponentApi` を満たすオブジェクトである必要がある
- `functions`（オプショナル）: JSON スキーマで定義される関数。メールアドレスの形式を検証する `isValidEmail` 関数などを定義できる。サーバーはこのクライアント関数を名前で参照できるため、実行可能なコードの送信を避けることができる
- `themeSchema`（オプショナル）: テーマの定義

`lib/catalog.ts` に以下のコードを追加して、カタログを組み立てます。

```typescript:lib/catalog.ts
import {
  Catalog,
  createFunctionImplementation,
} from "@a2ui/web_core/v0_9";

export const CATALOG_ID = "urn:a2ui:my-catalog:v1";

// カタログの functions に渡す関数のスキーマ例
const EmailApi = {
  name: "email" as const,
  returnType: "boolean" as const,
  schema: z.object({
    value: z.preprocess(
      (v) => (v === undefined ? undefined : String(v)),
      z.string(),
    ),
  }),
};

// functions の実装例
const EmailImplementation = createFunctionImplementation(
  EmailApi,
  (args) => {
    // バリデーションロジックは適当
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(args.value);
  },
);

export const MyCatalog = new Catalog(
  CATALOG_ID,
  [MyColumnApi, MyTextApi, MyButtonApi, MyTextFieldApi],
  [EmailImplementation],
);
```

ここで作成した `MyCatalog` は後ほどサーバーとクライアントの両方で使用します。

### バックエンドサーバーの実装

A2UI メッセージを生成するバックエンドサーバーを実装しましょう。AI エージェントの SDK として [Vercel AI SDK](https://vercel.com/docs/ai-sdk) を使用します。以下のコマンドでインストールします。`@ai-sdk/anthropic` は使用している AI モデルに応じて適宜変更してください。

```bash
npm install ai @ai-sdk/anthropic
```

API ルートを `app/api/a2ui/route.ts` というファイルで作成して、以下のコードを追加します。ここでは、AI エージェントのシステムプロンプトに A2UI の仕様に従い JSON 形式で応答するように指示しています。また、先ほど作成したカタログを AI エージェントに渡すことで、AI エージェントがどのようなコンポーネントを使用できるかを理解できるようにしています。

JSON Schema 形式でカタログを渡すために `MessageProcessor` クラスにカタログを渡してインスタンス化し、`processor.getClientCapabilities({includeInlineCatalogs: true})` を呼び出します。これにより、Zod スキーマを JSON Schema に変換します。

```typescript:app/api/a2ui/route.ts
import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { MessageProcessor } from "@a2ui/web_core/v0_9";
import { MyCatalog } from "@/lib/catalog";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const processor = new MessageProcessor([MyCatalog]);

  // inlineCatalogs 付き capabilities を取得
  // Zod スキーマが自動で JSON Schema に変換される
  const capabilities = processor.getClientCapabilities({
    includeInlineCatalogs: true,
  });

  const result = streamText({
    model: anthropic("claude-haiku-4-5"),
    system: buildSystemPrompt(capabilities),
    messages,
  });

  // application/x-ndjson は JSONの値を改行文字で区切ったデータのこと
  return result.toTextStreamResponse({
    headers: { "Content-Type": "application/x-ndjson" },
  });
}
```

:::info
A2UI v0.9 は LLM に JSON を生成させる prompt-first な設計です。そのため実際のアプリケーションでは、LLM が生成した JSONL をそのままクライアントへ流すのではなく、A2UI のスキーマとカタログに照らして検証する必要があります。検証に失敗した場合は、エラー内容を LLM に返して再生成させる `prompt → generate → validate` のループを挟むと、存在しないコンポーネントや誤ったプロパティを含む UI が描画されることを防げます。この記事の実装例では流れを理解しやすくするために検証処理を簡略化しています。
:::

`buildSystemPrompt` 関数は以下のように定義します。

```typescript
function buildSystemPrompt(caps: A2uiClientCapabilities): string {
  const v09 = caps["v0.9"];
  const catalogId = v09.supportedCatalogIds[0];
  const catalog = v09.inlineCatalogs?.[0];

  // コンポーネント名と required プロパティを読みやすく整形
  const componentDocs = catalog?.components
    ? Object.entries(catalog.components)
        .map(([name, schema]: [string, any]) => {
          const inner = schema.allOf?.[1] ?? schema;
          const props = inner.properties ?? {};
          const required: string[] = inner.required ?? [];
          const propLines = Object.entries(props)
            .filter(([k]) => k !== "component")
            .map(([k, v]: [string, any]) => {
              const req = required.includes(k) ? "(required)" : "(optional)";
              const type = v.type ?? (v.enum ? v.enum.join("|") : "any");
              return `  - ${k} ${req}: ${type}`;
            })
            .join("\n");
          return `### ${name}\n${propLines}`;
        })
        .join("\n\n")
    : "";

  return `
You are an AI agent generating A2UI v0.9 JSONL messages.
Output ONLY raw JSONL — one JSON object per line, no markdown.
Every message MUST include "version": "v0.9".

## Catalog ID (use this in createSurface)
${catalogId}

## Available Components
${componentDocs}

## Component object format (CRITICAL)
Every component object MUST include BOTH:
  - "id": a unique string identifier
  - "component": the component type name (one of those listed above)
NEVER emit a component object without a "component" field. A component without a type will be rejected.

## Root component rules (CRITICAL)
- Exactly one component MUST have "id":"root".
- The "root" component MUST also have a valid "component" type.
- If the UI has multiple top-level elements (e.g., a form with several fields and a button), the root MUST be a container component (use "MyColumn") that lists the children by ID.
- If the UI has a single element, the root MAY be that element directly (e.g., a single MyText).

## Children references
- "children" is an array of component ID strings: ["id1","id2","id3"]
- "child" is a single component ID string: "id1"
- Children are referenced by ID only — NEVER define child components inline. Each child must be a separate entry in the components array with its own "id" and "component".

## Data binding (CRITICAL — required for any user input)
Any property whose value the user can change at runtime (e.g., MyTextField.value) MUST be a data binding object, NOT a literal string.
A data binding looks like: {"path": "/data/<key>"}
- A literal string for "value" makes the field read-only — typed characters are silently dropped.
- The path MUST point inside the surface's data model (typically under "/data").

You MUST also send an updateDataModel message that initializes every bound path BEFORE the user can interact with the component (initialize with empty string, 0, false, etc., as appropriate). The recommended order is:
  createSurface → updateDataModel(initial values) → updateComponents

When the form is submitted, reference the same paths inside the button's action so the server receives the current values.

## Action format
"action" uses one of these two shapes:
- Server-side event: {"event":{"name":"<eventName>","context":{"<key>":{"path":"/data/<key>"}, ...}}}
- Client-side function call: {"functionCall":{"call":"<fnName>","args":{...},"returnType":"void"}}
Do NOT invent other action shapes (no "type":"deferredAction").

## Message sequence
1. {"version":"v0.9","createSurface":{"surfaceId":"main","catalogId":"${catalogId}"}}
2. {"version":"v0.9","updateDataModel":{"surfaceId":"main","path":"/data","value":{<initial values for every bound field>}}}
3. {"version":"v0.9","updateComponents":{"surfaceId":"main","components":[...]}}
   - Use ONLY the components listed above.
   - Every component object includes "id" AND "component".
   - One of them has "id":"root" (with a valid "component" type, typically "MyColumn" for multi-element UIs).
   - Every input field's "value" is a data binding object (see above).

## Example (sign-up form with working state)
{"version":"v0.9","createSurface":{"surfaceId":"main","catalogId":"${catalogId}"}}
{"version":"v0.9","updateDataModel":{"surfaceId":"main","path":"/data","value":{"email":"","password":""}}}
{"version":"v0.9","updateComponents":{"surfaceId":"main","components":[{"id":"root","component":"MyColumn","children":["title","email","password","submit"]},{"id":"title","component":"MyText","text":"Sign up","variant":"h2"},{"id":"email","component":"MyTextField","label":"Email","value":{"path":"/data/email"}},{"id":"password","component":"MyTextField","label":"Password","variant":"obscured","value":{"path":"/data/password"}},{"id":"submitLabel","component":"MyText","text":"Submit"},{"id":"submit","component":"MyButton","child":"submitLabel","variant":"primary","action":{"event":{"name":"submit","context":{"email":{"path":"/data/email"},"password":{"path":"/data/password"}}}}}]}}
`;
}
```

### フロントエンドクライアントの実装

最後に、フロントエンドクライアントを実装して、AI エージェントが生成した A2UI メッセージを受け取って描画できるようにしましょう。はじめに `lib/catalog.ts` を編集して、React 実装との対応付けを持たせたカタログを作成します。サーバー側で使用するカタログはコンポーネントの API 定義のみを持たせるようにしています。余分なバンドルサイズの増加を避けるためです。

```ts:lib/catalog.ts
export const MyReactCatalog: Catalog<ReactComponentImplementation> =
  new Catalog(CATALOG_ID, [Column, Text, Button, TextField]);
```

`app/page.tsx` を編集して、Surface の状態を管理し、AI エージェントからのメッセージを処理して UI を描画するためのコードを追加します。`MessageProcessor` クラスにカタログを渡してインスタンス化し `processor` インスタンスを作成します。サーバーからメッセージを受け取ったら `processor.processMessages` を呼び出してメッセージを処理します。

`createSurface`, `deleteSurface` メッセージを受け取ると `processor.onSurfaceCreated`, `processor.onSurfaceDeleted` イベントハンドラーが呼び出されるので、これらのイベントハンドラー内で `processor.getSurfaceState` を呼び出して現在の Surface の状態を取得し、React の状態に保存します。

React コンポーネントの描画部分では、保存した Surface の状態を `<A2uiSurface>` コンポーネントに渡して描画します。

アクションが実行された場合は `processor.model.onAction.subscribe` で購読しているイベントハンドラーが呼び出されるので、ここでアクションの内容を確認して必要に応じてサーバーにリクエストを送るなどの処理を行います。

```tsx:app/routes.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MessageProcessor } from "@a2ui/web_core/v0_9";
import type { SurfaceModel, A2uiMessage } from "@a2ui/web_core/v0_9";
import {
  A2uiSurface,
  type ReactComponentImplementation,
} from "@a2ui/react/v0_9";
import { MyReactCatalog } from "@/lib/catalog-react";

type Turn = {
  role: "user" | "assistant";
  content: string;
};

export default function Page() {
  // turns は左右に振り分けて吹き出し表示するチャット履歴。
  const [turns, setTurns] = useState<Turn[]>([]);
  const [surface, setSurface] =
    useState<SurfaceModel<ReactComponentImplementation> | null>(null);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  // MessageProcessor は useState でマウント時に 1 度だけ生成する。
  const [processor] = useState(() => {
    const p = new MessageProcessor([MyReactCatalog]);
    return p;
  });

  // ユーザー入力 / アクション結果のいずれもこの関数からサーバーに送る。
  // 役割は (1) UI 状態更新、(2) 既存 surface のクリーンアップ、(3) fetch の発行、
  // (4) NDJSON ストリームをパースして MessageProcessor に渡す、の 4 段階。
  const sendToBackend = useCallback(
    async (userText: string, role: "user" | "action" = "user") => {
      setIsStreaming(true);
      if (role === "user") {
        setTurns((prev) => [...prev, { role: "user", content: userText }]);
      }

      // A2UI 仕様上、同じ surfaceId に対して createSurface を 2 回送ると state error になる。
      // 新しいターンに入る前に旧 surface を明示的に削除しておく。
      // deleteSurface を processMessages で流すと onSurfaceDeleted も発火し、上の useEffect が
      // setSurface(null) するため、画面からも一旦消える。
      if (processor.model.getSurface("main")) {
        processor.processMessages([
          { version: "v0.9", deleteSurface: { surfaceId: "main" } },
        ]);
      }

      try {
        const res = await fetch("/api/a2ui", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              ...turns.map((t) => ({ role: t.role, content: t.content })),
              { role: "user", content: userText },
            ],
          }),
        });

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let buf = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() ?? "";
          const batch: A2uiMessage[] = [];
          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              batch.push(JSON.parse(line));
            } catch {}
          }
          // processor 側で createSurface → updateDataModel → updateComponents の順序で適用される。
          if (batch.length > 0) processor.processMessages(batch);
        }
      } finally {
        setIsStreaming(false);
      }
    },
    [processor, turns],
  );

  // processor → React state へのブリッジ。
  // createSurface メッセージが届くと SurfaceModel が生まれて onSurfaceCreated が発火するので、
  // それを setSurface に流して <A2uiSurface> を再描画させる。
  // deleteSurface 受信時はクリアして、入力受付前の空状態に戻す。
  useEffect(() => {
    const createdSub = processor.onSurfaceCreated((s) => setSurface(s));
    const deletedSub = processor.onSurfaceDeleted(() => setSurface(null));
    return () => {
      createdSub.unsubscribe();
      deletedSub.unsubscribe();
    };
  }, [processor]);

  // A2UI のアクションを購読
  useEffect(() => {
    const sub = processor.model.onAction.subscribe((action) => {
      console.log("Received action:", action);
      // 本来はバックエンドサーバーに POST として送るべきだが、ここでは省略する
    });
    return () => sub.unsubscribe();
  }, [processor]);

  // 入力欄からの送信。空入力やストリーム中はガードしてからサーバーに投げる。
  const handleSubmit = () => {
    if (!input.trim() || isStreaming) return;
    sendToBackend(input.trim());
    setInput("");
  };

  console.log("Current surface:", surface);

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {turns.map((turn, i) => (
          <div
            key={i}
            className={`flex ${turn.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`rounded-2xl px-4 py-2 max-w-sm text-sm ${
                turn.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {turn.content}
            </div>
          </div>
        ))}

        {surface && (
          <div className="w-full">
            <A2uiSurface surface={surface} />
          </div>
        )}

        {isStreaming && !surface && (
          <p className="text-sm text-gray-400 animate-pulse">生成中...</p>
        )}
      </div>

      <form
        className="border-t p-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          className="flex-1 rounded-xl border px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="メッセージを入力..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isStreaming}
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm disabled:opacity-40"
          disabled={isStreaming || !input.trim()}
        >
          送信
        </button>
      </form>
    </div>
  );
}
```

「ログインフォームを表示して」というメッセージを送信してみましょう。サーバーからは以下のような A2UI メッセージが送られてきました。

````json
```json
{"version":"v0.9","createSurface":{"surfaceId":"main","catalogId":"urn:a2ui:my-catalog:v1"}}
{"version":"v0.9","updateDataModel":{"surfaceId":"main","path":"/data","value":{"username":"","password":""}}}
{"version":"v0.9","updateComponents":{"surfaceId":"main","components":[{"id":"root","component":"MyColumn","children":["title","username","password","submit"],"gap":"16px"},{"id":"title","component":"MyText","text":"ログイン","variant":"h2"},{"id":"username","component":"MyTextField","label":"ユーザー名","value":{"path":"/data/username"}},{"id":"password","component":"MyTextField","label":"パスワード","variant":"obscured","value":{"path":"/data/password"}},{"id":"submitLabel","component":"MyText","text":"ログイン"},{"id":"submit","component":"MyButton","child":"submitLabel","variant":"primary","action":{"event":{"name":"login","context":{"username":{"path":"/data/username"},"password":{"path":"/data/password"}}}}}]}}
````

実際にメールアドレスとパスワードが入力できるテキストフォームと、ログインボタンを持つ UI が描画されました。フォームに入力できることも確認できます。ログインボタンをクリックするとアクションが呼び出され、コンソールにログが出力されました。

![](https://images.ctfassets.net/in6v9lxmm5c8/3T7f09l0r2xZD0SNKTY3DU/c6da05eda5e02edda8d489a040a20dce/image.png)

## まとめ

- A2UI は、AI エージェントが生成する UI を定義するための仕様で、コンポーネントのカタログを JSON Schema 形式で定義できる。これにより、安全で予測可能な方法で AI エージェントが UI を生成できるようになる
- カタログを作成したら、実際の React コンポーネントをマッピングする
- バックエンドサーバーではカタログと A2UI の仕様をシステムプロンプトに渡して、AI エージェントが正しい形式でメッセージを生成するように指示する
- フロントエンドクライアントでは、AI エージェントからのメッセージを `processor.processMessages` に渡して処理し、Surface の状態を React の状態に保存して描画する

## 参考

- [A2UI](https://a2ui.org/)
- [google/A2UI](https://github.com/google/a2ui)
- [A2UI v0.9: The New Standard for Portable, Framework-Agnostic Generative UI - Google Developers Blog](https://developers.googleblog.com/a2ui-v0-9-generative-ui/)
- [Declarative Gen-UI (A2UI)](https://docs.copilotkit.ai/generative-ui/a2ui)
- [AG-UI and A2UI: Understanding the Differences | CopilotKit](https://www.copilotkit.ai/ag-ui-and-a2ui)
- [A2UI/renderers/react at main · google/A2UI](https://github.com/google/A2UI/tree/main/renderers/react)
