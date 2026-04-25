---
id: l44M93Ne6tKwTo192bEUv
title: "事前に定義した UI を AI に生成させる json-render を試してみた"
slug: "json-render"
about: "AI に UI を生成させる Generative UI の手法が注目されています。しかし、AI の出力が予測不可能であるため、意図しない UI が生成されてしまうリスクもあります。json-render はあらかじめ定義したコンポーネントやアクションのカタログに基づいて AI に JSON を生成させることで、AI が誤った構造の UI を生成するリスクを減らし、アプリケーションの一部として自然に統合された UI を提供するフレームワークです。"
createdAt: "2026-04-25T08:34+09:00"
updatedAt: "2026-04-25T08:34+09:00"
tags: ["Generative UI", "json-render", "AI"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3H4ehUDSs8d3MSvBJnj7W9/66d9aff2ff32defaf29d476d3d971bbd/mille-feuille_23505-768x630.png"
  title: "ミルフィーユのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "json-render が Generative UI の課題を解決するためのアプローチとして、記事で説明されているのはどれですか？"
      answers:
        - text: "AI が直接 HTML を生成し、iframe のサンドボックス内で安全に実行する"
          correct: false
          explanation: "記事では iframe を使ったサンドボックス内ではなく、アプリケーションの一部として自然に統合された UI を提供できる点を特徴として挙げています。"
        - text: "あらかじめ定義したカタログに基づいて AI に JSON を生成させ、JSON スキーマの制約に従ってレンダリングする"
          correct: true
          explanation: "記事の通り、json-render はカタログと JSON スキーマを用いることで、AI が誤った構造の UI を生成するリスクを大幅に減少させます。"
        - text: "AI が生成したコードをサーバーサイドで検証してからクライアントに送信する"
          correct: false
          explanation: "記事にそのような説明はありません。json-render の特徴は JSON スキーマによる制約と実際のコンポーネントへのマッピングです。"
        - text: "AI がカタログ外のコンポーネントを自由に組み合わせて UI を生成する"
          correct: false
          explanation: "json-render の目的はカタログで定義した範囲内でのみ AI に UI を生成させることで、予測不可能な出力を防ぐことです。"
    - question: "`defineRegistry` 関数の役割として、記事で説明されているのはどれですか？"
      answers:
        - text: "カタログで定義したコンポーネントを実際の React コンポーネントにマッピングする"
          correct: true
          explanation: "記事の通り、`defineRegistry` はカタログで定義した各コンポーネントを実際の React コンポーネントとして実装する際に使用します。"
        - text: "AI に渡すシステムプロンプトを生成する"
          correct: false
          explanation: "システムプロンプトの生成は `catalog.prompt()` が担います。`defineRegistry` はコンポーネントのマッピングに使用します。"
        - text: "カタログのコンポーネントとスキーマを定義する"
          correct: false
          explanation: "カタログの定義には `defineCatalog` 関数を使用します。`defineRegistry` はすでに定義されたカタログをもとにコンポーネントを実装するための関数です。"
        - text: "API ルートから AI の出力をストリーミングで受け取る"
          correct: false
          explanation: "AI の出力のストリーミング受信には `useUIStream` フックを使用します。`defineRegistry` はコンポーネントのマッピングに使用します。"
    - question: "記事で説明されている `<VisibilityProvider>` の役割はどれですか？"
      answers:
        - text: "アプリ全体で共有される状態（State）を管理する"
          correct: false
          explanation: "これは `<StateProvider>` の役割として記事で説明されています。"
        - text: "AI がトリガーするアクションを定義し、ユーザーアクションのハンドラーを登録・管理する"
          correct: false
          explanation: "これは `<ActionProvider>` の役割として記事で説明されています。"
        - text: "カスタムの検証ロジックを定義する"
          correct: false
          explanation: "これは `<ValidationProvider>` の役割として記事で説明されています。"
        - text: "AI が生成した Spec に含まれる条件に応じて、UI 要素の表示・非表示を管理する"
          correct: true
          explanation: "記事の通り、`<VisibilityProvider>` は `{ visible: { $state: '/some/state/path' } }` のような条件に基づいて要素を表示・非表示にします。"

published: false
---

AI との対話において単にテキストをやりとりするだけでなく、UI を表示するケースが増えてきました。これはテキストだけでは伝えきれない情報を視覚的に表現したり、ユーザーが操作できるインターフェイスを提供するためです。例えば旅行の計画を立てるとき、単にテキストで目的地までのルートを説明されるよりも、地図上にルートが表示される方がわかりやすいでしょう。料理を注文する際も、メニューの写真や価格が表示される方が選びやすく、選択する際もテキストで応答するのではなくて、ボタンを押す形式の方がユーザーフレンドリーです。

実際に Claude で「箱根の観光スポットを教えて」と聞くと、テキストで説明されるだけでなく、地図上にスポットが表示されたり、各スポットの写真や詳細情報がカード形式で表示されたりします。このように AI に UI を生成させる手法は Generative UI と呼ばれ、ユーザー体験を大幅に向上させる可能性があります。

![](https://images.ctfassets.net/in6v9lxmm5c8/6pZCozBryTiwSEnaMa4qLm/8b66d8833c468884dd94344ca1b794d1/image.png)

しかし、Generative UI にはいくつかの課題もあります。問題の根本は AI の出力が予測不可能であることです。通常 AI に UI を生成させる際は、開発者があらかじめ定義したコンポーネントやテンプレートを使用しますが、AI が誤ったコンポーネント名を使用して意図しない構造の UI を生成してしまったり、`<script>` タグを挿入して悪意のあるコードを実行させてしまうリスクもあります。このように意図しない UI が生成されてしまうとブランドのイメージが損なわれたり、ユーザーが混乱したり、最悪の場合はセキュリティ上の問題につながる可能性もあります。

そこで、Vercel Labs が開発した json-render というフレームワークはこのような課題を解決します。コンポーネントとアクションを備えた「カタログ」をあらかじめ定義しておき、AI にはそのカタログに基づいた JSON を生成させます。コンポーネントをレンダリングする際には JSON スキーマという制約に従うため、AI が誤った構造の UI を生成するリスクが大幅に減少します。また、実際のコンポーネントにマッピングするため、iframe といったサンドボックス内にレンダリングされるのではなく、アプリケーションの一部として自然に統合された UI を提供できるといった特徴もあります。

この記事では、json-render を実際に試してみてどのように動作するのかについて紹介します。

## json-render のインストール

json-render はコアパッケージと UI フレームワークごとのレンダラーに分かれて提供されています。サポートされているレンダラーには以下のようなものがあります。

- React
- Vue
- Svelte
- Solid
- React Native
- shadcn（shadcn/ui をベースにした React 向けのレンダラー）
- remotion（video 要素を描画するためのレンダラー）
- ink（Terminal 向けのレンダラー）

今回は React 向けのレンダラーを試してみます。あらかじめ Next.js のプロジェクトを作成しておきましょう。

```bash
npx create-next-app@latest json-render-sample
```

また AI モデルを呼び出すための SDK として [AI SDK](https://ai-sdk.dev/) を使用するため、合わせてインストールしておきます。

```bash
npm install @json-render/core @json-render/react ai @ai-sdk/anthropic zod
```

## 1. カタログの定義

はじめに AI が使用できるコンポーネントを定義するカタログを作成します。カタログには以下の項目を定義します。

- コンポーネント: AI が生成する UI 要素。Props やスロットなどの構造を定義する
- アクション: AI がトリガーできる操作。例えばユーザーがボタンをクリックしたときに呼び出される関数など
- 関数: カスタムの検証・変換ロジックを定義するための関数

カタログを定義するためには `@json-render/core` の `defineCatalog` 関数を使用します。第 1 引数に渡す `schema` はレンダラーごとに用意されています。今回は React 向けのレンダラーを使用するため、`@json-render/react/schema` から `schema` をインポートして使用します。

ここではコンポーネントとして `Button`、`Card`、`Input` を定義してみましょう。`Button` はクリック可能なボタンを表し、`Card` はタイトルと内容を表示するカードを表すコンポーネントとします。`Input` はユーザーがテキストを入力するためのコンポーネントです。`Button` をクリックしたときには `submitForm` というアクションがトリガーされるように定義してみます。カタログは Zod を使用して型安全に定義できます。またそれぞれのコンポーネントやアクションには説明も付与できます。これにより AI がどのようにコンポーネントやアクションを使用すればいいのか理解しやすくなります。

```typescript:lib/catalog.ts
import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { z } from "zod";
export const catalog = defineCatalog(schema, {
  components: {
    Button: {
      props: z.object({
        label: z.string(),
        variant: z.enum(["primary", "secondary"]).default("primary"),
      }),
      description:
        "クリック可能なボタンコンポーネントでアクションをトリガーするために使用されます。",
    },
    Card: {
      props: z.object({
        title: z.string(),
      }),
      // default スロットは子要素がレンダリングされる場所に対応する
      slots: ["default"],
    },
    Input: {
      props: z.object({
        label: z.string().optional(),
        placeholder: z.string().optional(),
        type: z.enum(["text", "email", "password", "number"]).default("text"),
        value: z.string().optional(),
      }),
      description:
        "テキスト入力コンポーネントです。ユーザーがテキストを入力するために使用されます。",
    },
  },
  actions: {
    submitForm: {
      params: z.object({
        formData: z.object({
          name: z.string(),
        }),
      }),
      description:
        "フォームの送信を処理するアクションです。ユーザーがボタンをクリックしたときにトリガーされます。",
    },
  },
});
```

## 2. コンポーネントを定義する

続いて、カタログで定義したコンポーネントを実際の React コンポーネントにマッピングしていきます。これには `@json-render/react` の `defineRegistry` 関数を使用します。`defineRegistry` にカタログを渡すことで、型安全にコンポーネントとアクションを定義できます。

```tsx:lib/registry.tsx
import { defineRegistry, useBoundProp } from "@json-render/react";
import { catalog } from "./catalog";

export const { registry, handlers } = defineRegistry(catalog, {
  components: {
    Button: ({ emit, props }) => {
      const primary = "bg-blue-500 text-white";
      const secondary = "bg-gray-500 text-white";
      return (
        <button
          className={`px-4 py-2 rounded ${props.variant === "primary" ? primary : secondary}`}
          onClick={() => emit("press")}
        >
          {props.label}
        </button>
      );
    },
    Card: ({ children, props }) => {
      return (
        <div className="p-4 border rounded">
          <h2 className="text-lg font-bold">{props.title}</h2>
          <div>{children}</div>
        </div>
      );
    },
    Input: ({ props, bindings }) => {
      // useBoundProp を使用して、双方向にバインドされた値を取得する
      const [value, setValue] = useBoundProp<string>(
        props.value,
        bindings?.value,
      );
      return (
        <div className="flex flex-col gap-1">
          {props.label && (
            <label className="text-sm font-medium">{props.label}</label>
          )}
          <input
            type={props.type}
            placeholder={props.placeholder}
            value={value ?? ""}
            onChange={(e) => setValue(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
      );
    },
  },
  actions: {
    submitForm: async (params, setState) => {
      const name = params?.formData?.name;
      console.log("Form submitted with data:", name);
      const upperName = name ? name.toUpperCase() : "UNKNOWN";
      setState((prev) => ({
        ...prev,
        submitted: true,
        formData: { name: upperName },
      }));
    },
  },
});
```

それぞれのコンポーネントは以下の引数を受け取り、JSX を返す関数として定義します。

- `props`: カタログで定義した Props の型に従ったオブジェクト
- `children`: default スロットに対応する子要素
- `emit`: イベントを発火させるための関数。単純なイベントを発火させるために使用する
- `on`: メタデータを含むイベントを発火させるための関数。イベントに対して追加の情報を付与したい場合に使用する
- `loading`: レンダラーがローディング中かどうかを示すフラグ
- `bindings`: `$bindState` と `$bindItem` を使用して、カスタムの双方向に状態をバインドするために使用するオブジェクト

アクションハンドラではカタログで定義した `params` と `setState` を受け取ります。必要に応じて `state` も受け取れます。`params` はアクションが呼び出されたときに渡される引数で、カタログで定義したスキーマに従います。`setState` はアクション内で状態を更新するための関数で、これを使用してコンポーネントに状態を反映させることができます。

## 3. API ルートを定義する

それでは実際に AI モデルを呼び出して、カタログに基づいた JSON を生成してみましょう。Next.js の API ルートを作成して、AI SDK を使用してモデルを呼び出すコードを書いてみます。ここでは Claude の Haiku モデルを使用するので、環境変数 `ANTHROPIC_API_KEY` に API キーを設定しておいてください。

```bash:.env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

`app/api/generate/route.ts` というファイルを作成して、`/api/generate` エンドポイントを定義します。

```typescript:app/api/generate/route.ts
import { streamText } from "ai";
import { catalog } from "@/lib/catalog";
import { anthropic } from "@ai-sdk/anthropic";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  // カタログからシステムプロンプトを生成
  const systemPrompt = catalog.prompt();

  const result = streamText({
    model: anthropic("claude-haiku-4-5"),
    system: systemPrompt,
    prompt,
  });

  return result.toTextStreamResponse();
}
```

ここではカタログからシステムプロンプトを生成して、AI モデルに渡しています。システムプロンプトの内容は以下のように AI に JSON スキーマに従い UI を生成するための指示が含まれています。

> You are a UI generator that outputs JSON.
> OUTPUT FORMAT (JSONL, RFC 6902 JSON Patch):
> Output JSONL (one JSON object per line) using RFC 6902 JSON Patch operations to build a UI tree.
> Each line is a JSON patch operation (add, remove, replace). Start with /root, then stream /elements and /state patches interleaved so the UI fills in progressively as it streams.
> ...
> AVAILABLE COMPONENTS (3):
>
> - Button: { label: string, variant: "primary" | "secondary" } - クリック可能なボタンコンポーネントでアクションをトリガーするために使用されます。
> - Card: { title: string } [accepts children]
> - Input: { label?: string, placeholder?: string, type: "text" | "email" | "password" | "number", value?: string } - テキスト入力コンポーネントです。ユーザーがテキストを入力するために使用されます。$bindState でステートと双方向バインディングできます。
>   ...
>   RULES:
>
> 1. Output ONLY JSONL patches - one JSON object per line, no markdown, no code fences
>    ...

## 4. レンダラーを作成して UI を表示する

最後に `<Renderer>` コンポーネントを作成して、AI が生成した UI を表示します。AI モデルは JSONL 形式の JSON Patch をストリーミングし、`useUIStream` フックは API ルートから受け取った出力を `spec` として組み立てます。この `spec` にはレンダリングすべき UI の構造が含まれています。`<Renderer>` コンポーネントに `spec` を渡すことで、AI が生成した UI を実際にレンダリングできるのです。

```tsx:app/page.tsx
"use client";

import { useMemo, useRef, useState } from "react";
import {
  Renderer,
  StateProvider,
  ActionProvider,
  VisibilityProvider,
  ValidationProvider,
  useUIStream,
} from "@json-render/react";
import { registry, handlers } from "@/lib/registry";

export default function Home() {
  const [state, setState] = useState({});
  const { spec, isStreaming, send } = useUIStream({
    api: "/api/generate",
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const prompt = formData.get("prompt") as string;
    send(prompt);
  };

  return (
    <StateProvider initialState={state}>
      <VisibilityProvider>
        <ActionProvider
          handlers={{
            submit: (params) => console.log("Submit:", params),
          }}
        >
          <ValidationProvider customFunctions={{}}>
            <form onSubmit={handleSubmit}>
              <input
                name="prompt"
                placeholder="UIの説明を入力してください..."
                className="border p-2 rounded"
              />
              <button type="submit" disabled={isStreaming}>
                生成
              </button>
            </form>

            <div className="mt-8">
              <Renderer spec={spec} registry={registry} loading={isStreaming} />
            </div>
          </ValidationProvider>
        </ActionProvider>
      </VisibilityProvider>
    </StateProvider>
  );
}
```

それぞれのプロバイダーは以下のような役割を持っています。

- `<StateProvider>`: アプリ全体で共有される状態（State）を管理する。フォームの入力値や選択状態など、UI コンポーネント間で参照・更新する値をここで一元管理する。任意の状態管理ライブラリと組み合わせて使用もできる
- `<VisibilityProvider>`: UI 要素の表示・非表示を管理する。組み立てられた `spec` の中に `{ visible: { $state: "/some/state/path" } }` のような条件がある場合に、その状態の値に応じて要素を表示・非表示にするために使用する
- `<ActionProvider>`: AI がトリガーするアクションを定義し、ユーザーアクション（ボタン押下など）のハンドラーを登録・管理するプロバイダー。AI が生成した UI で `submitForm` などのアクションが発火したとき、ここに登録されたハンドラーが呼び出される。
- `<ValidationProvider>`: 組み立てられた `spec` に対してカスタムの検証ロジックを定義するためのプロバイダー。`customFunctions` Props で独自の検証関数を定義できる
- `<Renderer>`: AI が生成した UI を実際にレンダリングするコンポーネント。`spec` Props に組み立てられた UI の構造を渡し、`registry` Props にコンポーネントの定義を渡すことで、AI が生成した UI をアプリケーションの一部として自然に統合された形で表示する

## spec に基づいた UI の生成

それでは実際にアプリを起動して試してみましょう。例えば「カードを表示して」というプロンプトを送ると、AI は JSONL 形式の Patch をストリーミングします。

```jsonl
{"op":"add","path":"/root","value":"main"}
{"op":"add","path":"/elements/main","value":{"type":"Card","props":{"title":"サンプルカード"},"children":[]}}
```

`useUIStream` はその出力をもとに、以下のような `spec` を組み立てます。

```json
{
  "root": "main",
  "elements": {
    "main": {
      "type": "Card",
      "props": {
        "title": "サンプルカード"
      },
      "children": []
    }
  }
}
```

実際に生成された UI を確認すると、確かに「サンプルカード」というタイトルのカードが表示されていることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/1imr1xTTbfR3qcf0T2y6ac/7cec4ee92059ceb5f58101d92756d1f2/image.png)

アクションと状態の更新を伴う例も試してみましょう。「名前を入力するフォームを表示して、フォームがサブミットされたら名前をカードに表示」というプロンプトを送ると、AI の出力をもとに以下のような `spec` が組み立てられます。

```json
{
  "root": "main",
  "elements": {
    "main": {
      "type": "Card",
      "props": {
        "title": "名前入力フォーム"
      },
      "children": ["form-container"]
    },
    "form-container": {
      "type": "Card",
      "props": {
        "title": "あなたの名前を入力してください"
      },
      "children": ["name-input", "submit-button", "result-card"]
    },
    "name-input": {
      "type": "Input",
      "props": {
        "label": "名前",
        "placeholder": "名前を入力",
        "type": "text",
        "value": {
          "$bindState": "/form/name"
        }
      },
      "children": []
    },
    "submit-button": {
      "type": "Button",
      "props": {
        "label": "送信",
        "variant": "primary"
      },
      "on": {
        "press": {
          "action": "submitForm",
          "params": {
            "formData": {
              "name": {
                "$state": "/form/name"
              }
            }
          }
        }
      },
      "children": []
    },
    "result-card": {
      "type": "Card",
      "props": {
        "title": "入力された名前"
      },
      "visible": {
        "$state": "/submitted"
      },
      "children": ["result-text"]
    },
    "result-text": {
      "type": "Button",
      "props": {
        "label": {
          "$template": "こんにちは、${/formData/name}さん！"
        },
        "variant": "secondary"
      },
      "children": []
    }
  },
  "state": {
    "form": {
      "name": ""
    },
    "formData": {
      "name": ""
    },
    "submitted": false
  }
}
```

先程のカードを表示する例の `spec` に加えて、入力フォームと送信ボタン、そして送信された名前を表示するカードが追加されていることがわかります。いくつか注目すべき点を見てみましょう。`name-input` コンポーネントの `value` プロパティは `$bindState` を使用して `/form/name` というパスににバインドされているため、ユーザーが入力した値が状態に反映されるようになっています。json-reader のパスは JSON Pointer　形式（RFC 6901）で表されます。

`form/name` は `state` オブジェクトの中で初期化されていることもわかります。

```json {8-10, 15-18}
{
  "elements": {
    "name-input": {
      "type": "Input",
      "props": {
        "label": "名前",
        "placeholder": "名前を入力",
        "type": "text",
        "value": {
          "$bindState": "/form/name"
        }
      },
      "children": []
    }
  },
  "state": {
    "form": {
      "name": ""
    },
    "formData": {
      "name": ""
    },
    "submitted": false
  }
}
```

`submit-button` コンポーネントの `on` プロパティには、`press` イベントが定義されており、ボタンがクリックされたときに `submitForm` アクションが呼び出されるようになっています。`params` には `$state` を使って `/form/name` の値を渡しています。`submitForm` アクションでは受け取った名前を大文字に変換して `/formData/name` に保存し、`/submitted` を `true` に更新するため、`result-card` コンポーネントの `visible` プロパティの条件が満たされてカードが表示されるようになります。

```json {9-17, 26-27}
{
  "elements": {
    "submit-button": {
      "type": "Button",
      "props": {
        "label": "送信",
        "variant": "primary"
      },
      "on": {
        "press": {
          "action": "submitForm",
          "params": {
            "formData": {
              "name": {
                "$state": "/form/name"
              }
            }
          }
        }
      },
      "children": []
    },
    "result-card": {
      "type": "Card",
      "props": {
        "title": "入力された名前"
      },
      "visible": {
        "$state": "/submitted"
      },
      "children": ["result-text"]
    }
  }
}
```

レンダリングされた UI を操作してみると、名前を入力して送信ボタンをクリックした時に初めて「入力された名前」というカードが表示され、さらにその中のテキストが `submitForm` アクションによって更新されることがわかります。例えば「azusa」と入力した場合、`submitForm` アクションが `/formData/name` に大文字化した値を保存するため、「こんにちは、AZUSAさん！」と表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3lVhHeFZZfSu4xskATCykY/f702322f575c406e13ee22699b91e45b/image.png)

## まとめ

- AI に UI を生成させる Generative UI の手法が注目されている。これはテキストだけでは伝えきれない情報を視覚的に表現したり、ユーザーが操作できるインターフェイスを提供するために有用
- しかし、AI の出力が予測不可能であるため、意図しない UI が生成されてしまうリスクがある
- json-render はあらかじめ定義したコンポーネントやアクションのカタログに基づいて AI に JSON を生成させることで、AI が誤った構造の UI を生成するリスクを減らし、アプリケーションの一部として自然に統合された UI を提供するフレームワーク
- カタログでコンポーネントとアクションを定義し、実際のコンポーネントにマッピングすることで、AI の出力から組み立てた spec に基づいて UI をレンダリングすることができる

## 参考

- [json-render | The Generative UI Framework](https://json-render.dev/)
- [vercel-labs/json-render: The Generative UI framework](https://github.com/vercel-labs/json-render)
