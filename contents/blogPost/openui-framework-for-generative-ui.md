---
id: YBQUXSgC01POayD9jJHhD
title: "Generative UI のためのフレームワーク OpenUI"
slug: "openui-framework-for-generative-ui"
about: "OpenUI は Generative UI を構築するためのフレームワークです。OpenUI 言語と呼ばれる独自の宣言型言語を使用して、AI が UI を構築するための指示を与えるという新しいアプローチを提供します。この記事では OpenUI を使用して Generative UI を実装する方法について解説します。"
createdAt: "2026-05-16T20:11+09:00"
updatedAt: "2026-05-16T20:11+09:00"
tags: ["openui", "Generative UI"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1vd4QovV13ktYVZDeT8Ssy/179724ebc8f2883ba8aac0915c585875/wild-plants_koshiabura_21653.png"
  title: "こしあぶらのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "OpenUI 言語が JSON と比較して解決しようとしている課題として、記事で挙げられているものはどれですか?"
      answers:
        - text: "TypeScript の型システムとシームレスに統合できる"
          correct: false
          explanation: "記事ではこの点には触れられていません。JSON が抱える課題として挙げられているのはトークン効率・ストリーミング適合性・堅牢性の 3 点です。"
        - text: "トークン効率がよく、行指向でストリーミングに向き、無効な出力を削除して有効な部分のみを表示できる"
          correct: true
          explanation: "記事で OpenUI 言語の特徴として明示されている 3 点（トークン効率、ストリーミングのための構造、堅牢性）を正しくまとめた選択肢です。"
        - text: "ブラウザのネイティブ API として直接実行できるため、ランタイムが不要になる"
          correct: false
          explanation: "OpenUI 言語はクライアント側のレンダラーが解釈してコンポーネントにマッピングする仕組みであり、ブラウザのネイティブ API ではありません。"
        - text: "データベーススキーマと自動的にマッピングできる"
          correct: false
          explanation: "記事ではデータベースとの自動マッピングについては言及されていません。"
    - question: "OpenUI の 4 つの構成要素のうち「パーサー」の役割として記事で説明されているのはどれですか?"
      answers:
        - text: "AI に渡すためのシステムプロンプトをコンポーネントライブラリから生成する"
          correct: false
          explanation: "これはプロンプトジェネレーターの役割として記事で説明されています。"
        - text: "要素ツリーを React コンポーネントにマッピングして実際にレンダリングする"
          correct: false
          explanation: "これはレンダラー（`<Renderer>`）の役割として記事で説明されています。"
        - text: "OpenUI 言語の出力を型付き要素ツリーに変換し、ライブラリの JSON スキーマを使って AI の出力を検証する"
          correct: true
          explanation: "記事ではパーサーの責務として、OpenUI 言語の出力を型付き要素ツリーに変換し、ライブラリのスキーマで検証することが挙げられています。"
        - text: "Zod スキーマと React コンポーネントを組み合わせて使用可能なコンポーネントを定義する"
          correct: false
          explanation: "これはライブラリ（およびその定義方法）の役割です。パーサーは出力を解釈する側です。"
    - question: "`createLibrary` でカスタムライブラリを作成する際に `root` を指定する理由として、記事で挙げられているのはどれですか?"
      answers:
        - text: "LLM の出力を制約して予測可能にし、堅牢性を向上させるため。また、ストリーミング時にルートコンポーネントがレンダリングされることを保証するため"
          correct: true
          explanation: "記事ではこの 2 つの理由が明示されています。`root` の固定は LLM への制約と、段階的レンダリングの起点となる役割を兼ねています。"
        - text: "React の Server Components として動作させるための仕様上の要件のため"
          correct: false
          explanation: "Server Components は今回の議論とは無関係です。記事でも触れられていません。"
        - text: "Zod スキーマの推論を効かせて型安全な Props を取り出すため"
          correct: false
          explanation: "型安全性は `defineComponent` の `props` で Zod スキーマを定義する仕組みで担保されており、`root` の指定とは別の話です。"
        - text: "テストフレームワークと連携してスナップショットを比較するため"
          correct: false
          explanation: "記事ではテスト連携については触れられておらず、`root` の指定理由とも関係ありません。"
    - question: "AI が生成する OpenUI 言語の中で `@ToAssistant` アクションを使うと、記事の説明上どのような動作になりますか?"
      answers:
        - text: "バインディングされた変数の値を初期状態にリセットする"
          correct: false
          explanation: "値のリセットは `@Reset($var1, $var2, ...)` の役割として記事で説明されています。"
        - text: "ユーザーがそのコンポーネントを操作したときに、指定したメッセージを AI への指示として送信する"
          correct: true
          explanation: "記事で説明されている通り、`@ToAssistant` はクリックなどの操作をトリガーに、引数で渡したテキストを AI に対する次のユーザーメッセージとして送信します。"
        - text: "バックエンドに定義されたツールを再実行してクエリ結果を更新する"
          correct: false
          explanation: "これは `@Run(ref)` の役割として記事で説明されています。"
        - text: "外部の URL を新しいタブで開く"
          correct: false
          explanation: "URL を開くのは `@OpenURL` アクションの役割として記事で挙げられています。"
published: true
---
AI エージェントがチャットの応答で UI を生成する Generative UI と呼ばれる分野が注目を集めています。従来の AI エージェントとの対話はテキストベースが中心です。例えば「京都の旅行の計画をして」といった質問に対して、AI はテキストで観光地の場所を説明したり観光名所の外観を説明しようとしますが、人間の脳は視覚情報で理解する方が得意なため、テキストで長々と説明されるよりも地図や写真を見た方が理解しやすいことが多いです。

Generative UI とは、AI エージェントがチャットの応答の中で UI を生成し、ユーザーが理解をする手助けをしたり、インタラクションを提供したりする機能の総称です。例えば Claude ではチャットの応答で地図を生成する機能を持っており、ユーザーは地図を見ながら観光地の場所を理解できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/1GGqfH1Cc9dJrggjvTQNB6/43d57769965a831cb86948d7f453ace0/image.png)

しかし、Generative UI を実装するためにいくつかの課題があります。AI はユーザーの意図に応じて画面そのものの構造・要素・レイアウトが毎回変わる UI を生成する必要がありますが、あまりに自由な UI を作らせてしまうとブランドの一貫性がなくなったり、ユーザーが混乱してしまう可能性があります。また危険なスクリプトを生成してしまうといったセキュリティ上の問題もあります。このような課題を解決するために、いくつかの仕様やフレームワークが提案されています。

例えば [MCP Apps](https://github.com/modelcontextprotocol/ext-apps/) は MCP の仕様に従いリソースとして UI を定義し、iframe のサンドボックスを利用して安全に UI を表示します。[A2UI](https://a2ui.org/introduction/what-is-a2ui/) や [json-render](https://json-render.dev/) はあらかじめ定義された UI カタログを元に AI に JSON を生成させることにより、制約を設けつつも柔軟な UI を生成します。

これらのフレームワークとは異なるアプローチを取るのが [OpenUI](https://www.openui.com) です。OpenUI は AI に JSON やマークダウンを生成させるのではなく、[OpenUI 言語](https://www.openui.com/docs/openui-lang/specification-v05) と呼ばれる独自の言語仕様を生成させ、クライアントのコンポーネントにマッピングすることにより安全にレンダリングされる UI を実現します。OpenUI 言語は JSON の持つ以下のような課題を解決することを目的として開発されました。

- トークン効率: JSON は冗長な構造を持つため、AI に大量のトークンを消費させてしまう。OpenUI 言語はトークン効率がより良い簡潔な位置指定の構文を持つ
- ストリーミングのための構造: OpenUI 言語は行指向の構造を持ち、ストリーミングで生成された UI をクライアントが段階的にレンダリングできるように設計されている
- 堅牢性: OpenUI 言語は出力を検証し、無効な部分は削除し有効な部分のみを表示する

この記事では OpenUI を使用して Generative UI を実装する方法について解説します。

## プロジェクトのセットアップ

以下のコマンドで OpenUI のプロジェクトをセットアップします。

```bash
npx @openuidev/cli@latest create --name my-openui-app
```

コマンドの実行が完了すると、Next.js をベースとした OpenUI のプロジェクトが作成されます。OpenUI を実装するために以下の依存パッケージが含まれています。

- `@openuidev/react-lang`: コアランタイム。コンポーネント定義、パーサー、レンダラー、プロンプト生成が含まれる
- `@openuidev/react-headless`: チャットの状態を管理するヘッドレス UI
- `@openuidev/react-ui`: あらかじめ定義された React コンポーネントのライブラリ

アプリケーションを起動するために OpenAI の API キーを環境変数 `OPENAI_API_KEY` に設定します。ここでは OpenAI API を使用していますが、OpenUI は他の LLM プロバイダーもサポートしています。

```bash
echo "OPENAI_API_KEY=sk-your-key-here" > .env
```

以下のコマンドでアプリケーションを起動します。

```bash
npm run dev
```

http://localhost:3000 にアクセスすると、OpenUI のチャット UI が表示されます。「お問い合わせフォームを表示してください」といった質問を入力してみましょう。完成した箇所から順次 UI がレンダリングされていく様子がわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/1FG8mHwea3Yy8t5zQ7XJGE/0fb97c6de04a99c910fca3a48a5f1668/image.png)

## プロジェクトのコードを理解する

実際にどのようなコードで OpenUI を実装しているのかを見てみましょう。OpenUI のチャット UI は `src/app/page.tsx` に実装されています。ディレクトリ構造は以下のようになっています。

```sh
src
├── app
│   ├── api
│   │   └── chat
│   │       └── route.ts # OpenAI API を呼び出すバックエンドエンドポイント
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx # チャット UI の実装
└── library.ts # コンポーネントライブラリ
```

### チャット UI の実装

`src/app/page.tsx` では、`<FullScreen>` コンポーネントを使用してチャット UI を表示しています。OpenUI は AI の出力をレンダリングされた UI に変換するために以下の 4 つの構成要素を使用しています。

- ライブラリ: Zod スキーマと React コンポーネントによって定義された UI コンポーネントのライブラリ。AI が使用できるコンポーネントとそのプロパティを定義する。ここでは OpenUI 言語であらかじめ定義されたコンポーネントを使用している
- プロンプトジェネレーター: ライブラリをシステムプロンプトに変換し、AI が有効な OpenUI 言語を出力するように指示する
- パーサー: OpenUI 言語の出力を型付き要素ツリーに変換する。ライブラリの JSON スキーマを使用して、AI の出力が有効なコンポーネントとプロパティに従うように検証する
- レンダラー: 要素ツリーを React コンポーネントにマッピングしてレンダリングする。ストリーミングで要素を段階的にレンダリングする。`<FullScreen>` コンポーネントの内部に `<Renderer>` コンポーネントがあり、これが要素ツリーを React コンポーネントにマッピングしてレンダリングする役割を担っている

実際のコードは以下のようになっています。

```tsx:src/app/page.tsx
"use client";
import "@openuidev/react-ui/components.css";
import "@openuidev/react-ui/styles/index.css";
import {
  openAIMessageFormat,
  openAIReadableStreamAdapter,
} from "@openuidev/react-headless";
import { FullScreen } from "@openuidev/react-ui";
// あらかじめ定義されたコンポーネントライブラリとシステムプロンプト
import {
  openuiLibrary,
  openuiPromptOptions,
} from "@openuidev/react-ui/genui-lib";

// コンポーネントライブラリからシステムプロンプトを生成
const systemPrompt = openuiLibrary.prompt(openuiPromptOptions);

export default function Home() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <FullScreen
        // ユーザーの入力に応じてチャットの応答を生成するための関数
        // ここではバックエンドの `/api/chat` エンドポイントを呼び出している
        processMessage={async ({ messages, abortController }) => {
          return fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemPrompt,
              messages: openAIMessageFormat.toApi(messages),
            }),
            signal: abortController.signal,
          });
        }}
        // OpenAI API からのストリーミングレスポンスを処理するためのアダプター
        streamProtocol={openAIReadableStreamAdapter()}
        // レンダラにコンポーネントライブラリを渡す
        componentLibrary={openuiLibrary}
        agentName="OpenUI Chat"
      />
    </div>
  );
}
```

`openuiLibrary.prompt()` を使用して、あらかじめ定義されたコンポーネントライブラリからシステムプロンプトを生成しています。このシステムプロンプトが AI に渡されることにより、AI は有効な OpenUI 言語を生成するように指示されます。生成されたシステムプロンプトを抜粋してみてみましょう。読みやすさのために日本語に翻訳しています。

はじめに OpenUI 言語の構文のルールを説明しています。

```txt
あなたは openui-lang を使用して応答する AI アシスタントです。あなたの応答全体は、有効な openui-lang コードでなければなりません。Markdown、説明文、その他の形式は一切使用せず、openui-lang のみを出力してください。

## 構文ルール

1. 各文は 1 行ごとに記述します: `identifier = Expression`
2. `root` はエントリーポイントです — すべてのプログラムで `root = Stack(...)` を定義する必要があります
3. Expression として使用できるのは、文字列 (`"..."`)、数値、真偽値 (`true` / `false`)、`null`、配列 (`[...]`)、オブジェクト (`{...}`)、またはコンポーネント呼び出し `TypeName(arg1, arg2, ...)` です
4. 可読性のために参照を使用してください: まず `name = ...` を定義し、その後で `name` を参照します
5. `root` を除くすべての変数は、少なくとも 1 つ以上の他の変数から参照されていなければなりません。参照されていない変数は自動的に削除され、表示されません。定義した変数は必ず親の `children` や `items` 配列に含めてください
6. 引数は位置指定です（名前ではなく順序が重要です）。`Stack([children], "row", "l")` のように記述してください。`Stack([children], direction: "row", gap: "l")` のようなコロン構文はサポートされておらず、正しく動作しません
7. オプション引数は末尾から省略できます

* 文字列はダブルクォーテーションを使用し、必要に応じてバックスラッシュでエスケープしてください
```

その後、ライブラリを元に使用可能なコンポーネントの使用方法の説明が続きます。例えば `Tables` コンポーネントの説明は以下のようになっています。コンポーネントが受け取る Props と、OpenUI 言語でどのように使用するかの例が記載されています。

```txt
### Tables
Table(columns: Col[]) — Data table — column-oriented. Each Col holds its own data array.
Col(label: string, data: any, type?: "string" | "number" | "action") — Column definition — holds label + data array
- Table is COLUMN-oriented: Table([Col("Label", dataArray), Col("Count", countArray, "number")]). Use array pluck for data: data.rows.fieldName
- Col data can be component arrays for styled cells: Col("Status", @Each(data.rows, "item", Tag(item.status, null, "sm", item.status == "open" ? "success" : "danger")))
- Row actions: Col("Actions", @Each(data.rows, "t", Button("Edit", Action([@Set($showEdit, true), @Set($editId, t.id)]))))
- Sortable: sorted = @Sort(data.rows, $sortField, "desc"). Bind $sortField to Select. Use sorted.fieldName for Col data
- Searchable: filtered = @Filter(data.rows, "title", "contains", $search). Bind $search to Input
- Chain sort + filter: filtered = @Filter(...) then sorted = @Sort(filtered, ...) — use sorted for both Table and Charts
- Empty state: @Count(data.rows) > 0 ? Table([...]) : TextContent("No data yet")
```

いくつかのコンポーネントの使用例も記載されています。

```txt
## Examples

Example 1 — Table (column-oriented):

root = Stack([title, tbl])
title = TextContent("Top Languages", "large-heavy")
tbl = Table([Col("Language", langs), Col("Users (M)", users), Col("Year", years)])
langs = ["Python", "JavaScript", "Java", "TypeScript", "Go"]
users = [15.7, 14.2, 12.1, 8.5, 5.2]
years = [1991, 1995, 1995, 2012, 2009]

Example 2 — Bar chart:

root = Stack([title, chart])
title = TextContent("Q4 Revenue", "large-heavy")
chart = BarChart(labels, [s1, s2], "grouped")
labels = ["Oct", "Nov", "Dec"]
s1 = Series("Product A", [120, 150, 180])
s2 = Series("Product B", [90, 110, 140])
```

最後に検証のためのガイドラインが記載されています。

```txt
## 最終検証

完了前に、出力を確認して次の点を検証してください。

1. 最適なストリーミングのため、`root = Stack(...)` が最初の行になっていること。
2. 参照されているすべての名前が定義されていること。`root` 以外で定義されているすべての名前が、`root` から到達可能であること。

* グリッド状のレイアウトには、`direction` を `"row"`、`wrap` を `true` にした `Stack` を使用してください。大きな余白を意図的に作りたい場合を除き、`justify="between"` は避けてください。
* フォームでは、各フィールドにつき 1 つの `FormControl` 参照を定義し、コントロールが段階的にストリーミングされるようにしてください。
* フォームでは、必ず 2 番目の `Form` 引数として `Buttons(...)` アクションを指定してください: `Form(name, buttons, fields)`。
* `Form` の中に `Form` をネストしないでください。
* フォーム送信後にデフォルト値へ戻す場合は、`@Set($var, "")` ではなく、`@Reset($var1, $var2)` を使用してください。
* 複数クエリの更新: `Action([@Run(mutation), @Run(query1), @Run(query2), @Reset(...)])`
* `$variables` はリアクティブです。`Select` や `@Set` で変更すると、それを参照しているすべての `Queries` と式が再評価されます。
* 三項演算子による表示 / 非表示パターンを独自に作る前に、既存のコンポーネント（`Tabs`、`Accordion`、`Modal`）を使用してください。
```

実際の AI とのやり取りは `<FullScreen>` コンポーネントの `processMessage` 関数で行われています。ユーザーの入力に応じてバックエンドの `/api/chat` エンドポイントを呼び出し、AI の応答を受け取ります。システムプロンプトはここでパラメーターとして渡されます。AI の応答はストリーミングで返されるため、`openAIReadableStreamAdapter()` を使用してストリーミングレスポンスを処理しています。

```tsx:src/app/page.tsx
<FullScreen
  processMessage={async ({ messages, abortController }) => {
    return fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemPrompt,
        messages: openAIMessageFormat.toApi(messages),
      }),
      signal: abortController.signal,
    });
  }}
  streamProtocol={openAIReadableStreamAdapter()}
  componentLibrary={openuiLibrary}
  agentName="OpenUI Chat"
/>
```

### バックエンドの実装と OpenUI 言語の例

バックエンドの `/api/chat` エンドポイントは `src/app/api/chat/route.ts` に実装されています。この箇所の実装はシンプルで、OpenAI API を呼び出して AI の応答をストリーミングで返すだけです。クライアントから受け取った `systemPrompt` を OpenAI API に渡すことにより、AI が有効な OpenUI 言語を生成するように指示しています。

```ts:src/app/api/chat/route.ts
import { NextRequest } from "next/server";
import OpenAI from "openai";

const client = new OpenAI();

export async function POST(req: NextRequest) {
  try {
    const { messages, systemPrompt } = await req.json();

    const response = await client.chat.completions.create({
      model: "gpt-5.2",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      stream: true,
    });

    return new Response(response.toReadableStream(), {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
```

実際に「Todo リストを表示してください」といった質問を入力すると、AI が以下のような OpenUI 言語を生成して Todo リストの UI を構築していく様子がわかります。

```txt
root = Stack([headerCard, listCard, actionsCard], "column", "l")
headerCard = Card([header])
header = CardHeader("Todoリスト", "今日やることを整理しましょう")

listCard = Card([listHeader, todoTable])
listHeader = CardHeader("一覧", "優先度・期限・状態を確認できます")
todoTable = Table([colTitle, colPriority, colDue, colStatus])
colTitle = Col("タスク", todoTitles, "string")
colPriority = Col("優先度", todoPriorities, "string")
colDue = Col("期限", todoDues, "string")
colStatus = Col("状態", todoStatuses, "string")

actionsCard = Card([actionsHeader, actionsButtons])
actionsHeader = CardHeader("操作", "追加や完了処理をしたい場合は指示してください")
actionsButtons = Buttons([btnAdd, btnDone, btnShowOnlyOpen], "row")
btnAdd = Button("Todoを追加", Action([@ToAssistant("Todoを追加したいです。内容・期限・優先度（低/中/高）を聞いて。")]), "primary")
btnDone = Button("完了にする", Action([@ToAssistant("完了にしたいTodoの番号（またはタスク名）を聞いて。")]), "secondary")
btnShowOnlyOpen = Button("未完了だけ表示", Action([@ToAssistant("未完了のTodoだけに絞り込んで表示して。")]), "tertiary")

todoTitles = ["買い物：牛乳・卵", "メール返信：A社見積", "運動：30分ウォーキング", "資料作成：週次レポート", "部屋の片付け：デスク周り"]
todoPriorities = ["中", "高", "低", "高", "中"]
todoDues = ["今日", "今日 17:00", "今週中", "明日 10:00", "今週末"]
todoStatuses = ["未完了", "未完了", "未完了", "未完了", "完了"]
```

上から順に構造を読み解いていきましょう。言語仕様は [v0.5](https://www.openui.com/docs/openui-lang/specification-v05) に基づいています。基本的には `identifier = Expression` という 1 行に 1 つの代入文で構成されています。定義を 1 行に 1 つ書いていくことで、AI が段階的に UI を構築していく様子をクライアントがリアルタイムでレンダリングできるようになっています。はじめにルートエントリーポイントである `root` が定義されています。これがない場合は何もレンダリングされません。

ここでは `Stack` コンポーネントを使用して、縦方向のレイアウトで 3 つのカードを配置しています。`()` の中には `Stack` コンポーネントが受け取る Props を位置指定で記述しています。最初の引数は子要素の配列、2 番目の引数はレイアウトの方向、3 番目の引数は要素間のギャップを表しています。

```txt
root = Stack([headerCard, listCard, actionsCard], "column", "l")
```

`Stack` はライブラリに定義されたコンポーネントで、`headerCard`、`listCard`、`actionsCard` はそれぞれ後続の行で定義されているコンポーネントを参照しています。前方参照が可能なため、定義の順序は重要ではありません。`headerCard` では `Card` と `CardHeader` コンポーネントを使用して、Todo リストのタイトルと説明を表示しています。

```txt
headerCard = Card([header])
header = CardHeader("Todoリスト", "今日やることを整理しましょう")
```

`listCard` では `Table` コンポーネントを使用して Todo リストの表を定義しています。`Col` コンポーネントは列を表しており、列のラベルとデータの配列を引数に取ります。

```txt
listCard = Card([listHeader, todoTable])
listHeader = CardHeader("一覧", "優先度・期限・状態を確認できます")
todoTable = Table([colTitle, colPriority, colDue, colStatus])
colTitle = Col("タスク", todoTitles, "string")
colPriority = Col("優先度", todoPriorities, "string")
colDue = Col("期限", todoDues, "string")
colStatus = Col("状態", todoStatuses, "string")
```

`Col` に渡されるデータの配列は、AI が生成した他の変数も参照できます。ここでは `todoTitles`、`todoPriorities`、`todoDues`、`todoStatuses` という配列が定義されており、それぞれタスクのタイトル、優先度、期限、状態を表しています。

```txt
todoTitles = ["買い物：牛乳・卵", "メール返信：A社見積", "運動：30分ウォーキング", "資料作成：週次レポート", "部屋の片付け：デスク周り"]
todoPriorities = ["中", "高", "低", "高", "中"]
todoDues = ["今日", "今日 17:00", "今週中", "明日 10:00", "今週末"]
todoStatuses = ["未完了", "未完了", "未完了", "未完了", "完了"]
```

`actionsCard` では `Buttons` コンポーネントを使用して、ユーザーが Todo を追加したり完了にしたりするためのボタンを定義しています。

```txt
actionsCard = Card([actionsHeader, actionsButtons])
actionsHeader = CardHeader("操作", "追加や完了処理をしたい場合は指示してください")
actionsButtons = Buttons([btnAdd, btnDone, btnShowOnlyOpen], "row")
btnAdd = Button("Todoを追加", Action([@ToAssistant("Todoを追加したいです。内容・期限・優先度（低/中/高）を聞いて。")]), "primary")
btnDone = Button("完了にする", Action([@ToAssistant("完了にしたいTodoの番号（またはタスク名）を聞いて。")]), "secondary")
btnShowOnlyOpen = Button("未完了だけ表示", Action([@ToAssistant("未完了のTodoだけに絞り込んで表示して。")]), "tertiary")
```

重要なのは各ボタンの 2 番目の引数で渡される `Action` です。これによりコンポーネントのインタラクションを定義できます。`@ToAssistant` はアクションが実行された場合の処理です。`@ToAssistant` はユーザーがボタンをクリックしたときに AI に指示を送ります。例えば「Todo を追加」ボタンは、ユーザーがクリックすると AI に「Todo を追加したいです。内容・期限・優先度（低/中/高）を聞いて。」という指示が送られるようになっています。

その他の構文として、バインディングも使用できます。バインディングでは `$` を使用して変数を定義し、これをコンポーネントの引数や式の中で参照できます。バインディングされた変数はリアクティブで、値が変更されるとそれを参照しているすべてのコンポーネントや式が再評価されます。例えば、以下のように `$search` というバインディングされた変数を定義し、これを `Input` コンポーネントの引数に渡せます。

```txt
$search = ""
searchInput = Input("検索", $search)
```

## コンポーネントを定義する

ここまではあらかじめ定義されたコンポーネントを使用して UI を構築する方法を見てきましたが、実際にプロダクトで使用するためには、ブランドの一貫性を保つためにカスタムコンポーネントを定義したい場合もあるでしょう。OpenUI では Zod スキーマを使用してカスタムコンポーネントを定義します。

例として、`Alert` というカスタムコンポーネントを定義してみましょう。`Alert` コンポーネントは、ユーザーに重要な情報を伝えるためのコンポーネントで、`message` と `type` という 2 つのプロパティを受け取るとします。`type` はアラートの種類を表し、"success"、"error"、"warning" のいずれかの値を取るとします。`defineComponent` 関数を使用して `Alert` コンポーネントを定義します。

```ts:src/library.tsx
import { defineComponent, createLibrary } from "@openuidev/react-lang";
import { z } from "zod/v4";

const Alert = defineComponent({
  name: "Alert",
  description: "ユーザーに重要な情報を伝えるアラートコンポーネント",
  props: z.object({
    message: z.string().describe("アラートのメッセージ"),
    type: z.enum(["success", "error", "warning"]).describe("アラートの種類"),
  }),
  // 型安全に Props を受け取る
  component: ({ props }) => {
    const { message, type } = props;
    const bgColor =
      type === "success"
        ? "bg-green-100"
        : type === "error"
          ? "bg-red-100"
          : "bg-yellow-100";
    const textColor =
      type === "success"
        ? "text-green-800"
        : type === "error"
          ? "text-red-800"
          : "text-yellow-800";
    return (
      <div className={`${bgColor} ${textColor} p-4 rounded`}>{message}</div>
    );
  },
});
```

作成したコンポーネントは `createLibrary` 関数を使用してコンポーネントライブラリに追加します。`root` には AI がエントリーポイントとして使用するコンポーネントを指定する必要があります。ここでは `openuiLibrary` を拡張する形で `Alert` コンポーネントを追加しており、`root` は `openuiLibrary` のルートコンポーネントを使用しています。

```ts:src/library.tsx
import { defineComponent, createLibrary } from "@openuidev/react-lang";
import { openuiLibrary } from "@openuidev/react-ui/genui-lib";

export const myLibrary = createLibrary({
  root: openuiLibrary.root ?? "Stack",
  componentGroups: openuiLibrary.componentGroups,
  components: [...Object.values(openuiLibrary.components), Alert],
});
```

`root` を指定するのには以下の 2 つの理由があります。

- LLM に制約を設けることにより、出力が予測可能になり、堅牢性が向上する
- ストリーミングで UI を構築する際に、ルートコンポーネントがレンダリングされることが保証されるため、クライアントが段階的に UI をレンダリングできるようになる

コンポーネントを定義したらそのコンポーネントを AI が正しく使用できるようにするために、システムプロンプトを生成する必要があります。システムプロンプトを生成する方法はいくつかありますが、CLI を使う方法が推奨されています。

```bash
npx @openuidev/cli@latest generate ./src/library.tsx --out system-prompt.txt
```

このコマンドを実行すると、`system-prompt.txt` というファイルが生成されます。このファイルに新たに追加した `Alert` コンポーネントの使用方法が含まれていることがわかります。

```txt:system-prompt.txt
...

### Other
Alert(message: string, type: "success" | "error" | "warning") — ユーザーに重要な情報を伝えるアラートコンポーネント
```

見出しが `Other` になっているのは、`Alert` コンポーネントがあらかじめ定義されたコンポーネントのどのグループにも属していないためです。必要に応じて、`Alert` コンポーネントを既存のグループにも追加できます。コンポーネントをグループ化することにより、AI が関連するコンポーネントを素早く見つけられるようになります。例えば `Form` コンポーネントと関連するコンポーネントを `Form` グループにまとめられます。それぞれのグループには `notes` で使用に関するガイドラインも記載できます。

```ts
export const myLibrary = createLibrary({
  root: "Stack",
  componentGroups: [
    {
      name: "Forms",
      components: ["Form", "FormControl", "Input", "TextArea", "Select"],
      notes: [
        "- Define EACH FormControl as its own reference for progressive streaming.",
        "- NEVER nest Form inside Form.",
        "- Form requires explicit buttons: Form(name, buttons, fields).",
      ],
    },
  ],
  components: [...Object.values(openuiLibrary.components), Alert],
});
```

作成されたシステムプロンプトは `api/chat/route.ts` の OpenAI API を呼び出す箇所で `systemPrompt` として渡されるようにします。

```ts:src/app/api/chat/route.ts
import fs from "fs/promises";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const systemPrompt = await fs.readFile("system-prompt.txt", "utf-8");
    const response = await client.chat.completions.create({
      model: "gpt-5.2",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      stream: true,
    });
// ...
  } catch (err) {
    // ...
  }
}
```

クライアントのコードも `myLibrary` を使用するように変更します。

```tsx:src/app/page.tsx
import { myLibrary } from "../library";

<FullScreen
  // ...
  componentLibrary={myLibrary}
  // ...
/>
```

試しに「ユーザーに注意を促すメッセージを表示してください」といった質問を入力してみましょう。AI は以下のような OpenUI 言語を生成しました。

```txt
root = Stack([alertCard], "column", "m")
alertCard = Card([alertHeader, alertBody], "card")
alertHeader = CardHeader("注意", "操作を続ける前にご確認ください")
alertBody = Stack([alertMessage], "column", "s")
alertMessage = Alert("重要な変更を行う前に、入力内容と対象データを再確認してください。問題がなければそのまま進めてください。", "warning")
```

実際のレンダリング結果を確認してみると、確かに定義した `Alert` コンポーネントが使用されていることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/5gHNSskpgu6ecYdWVGOCBa/89cd9f137c03876be589dc9bdd9ac5e4/image.png)

## `<Renderer>` コンポーネントで UI レンダリングをカスタマイズする

ここまでは `<FullScreen>` コンポーネントを使用してチャット UI を実装する方法を見てきました。`<FullScreen>` はチャット UI 全体を最短のコードで構築するための高レベルコンポーネントです。素早く Generative UI のチャットを動かしたい場合に適しています。一方で、独自のヘッダーやサイドバー、複数会話の管理、独自のメッセージ表示形式など UI の自由度が必要な場合は、`<Renderer>` を直接使用するのがよいでしょう。`<Renderer>` は AI の出力をレンダリングする責務だけを担うため、その周辺のチャット UI は自分で実装する必要があります。

`<Renderer>` コンポーネントを直接使用して、よりきめ細やかに UI のレンダリングを制御してみましょう。`<Renderer>` コンポーネントは以下の Props を受け取ります。

- `response`: OpenUI 言語の出力
- `library`: コンポーネントライブラリ
- `isStreaming`: ストリーミングが進行中かどうかを表すブール値
- `onAction` : ユーザーがコンポーネントとインタラクションしたときに呼び出されるコールバック関数
- `initialState`: フィールドの状態を復元するための初期状態を渡す
- `onParseResult`: デバッグのために、パーサーの出力を受け取るコールバック関数
- `toolProvider`: インタラクションから呼び出せるツールを提供するオブジェクト
- `queryLoader`: クエリの取得中に表示されるローディングコンポーネント
- `onError`: エラーが発生したときに呼び出されるコールバック関数

`<Renderer>` コンポーネントは AI の出力を表示するためのコンポーネントとして使用します。その他のチャット UI の要素（ユーザーの入力を受け取るフォームや、チャットの履歴を表示するコンポーネントなど）は自分で実装する必要があります。チャットの状態の管理（例えば、チャットの履歴やユーザーの入力の状態など）のために、`@openuidev/react-headless` パッケージが提供する `<ChatProvider>` や `useThread` も使用できます。`<ChatProvider>` コンポーネントはチャットの状態を管理するためのコンテキストプロバイダーで、バックエンド API のやり取りを子コンポーネントに提供する役割を担っています。`useThread` フックは、`<ChatProvider>` 内でチャットの状態を管理するためのフックで、メッセージの履歴や、メッセージの処理、キャンセルなどの関数を提供します。

以下は `<Renderer>` コンポーネントを使用してチャット UI を実装する例です。

```tsx:src/app/page.tsx
"use client";
import "@openuidev/react-ui/styles/index.css";
import {
  ChatProvider,
  openAIMessageFormat,
  openAIReadableStreamAdapter,
  useThread,
} from "@openuidev/react-headless";
import { Renderer } from "@openuidev/react-lang";
import { myLibrary } from "@/library";
import { useState, useRef, useEffect } from "react";

function ChatUI() {
  // useThread フックを使用してチャットの状態を管理
  const { messages, processMessage, cancelMessage, isRunning } = useThread();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // メッセージが更新されるたびにスクロールするためのエフェクト
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // フォームが送信されたときの処理
  // processMessage 関数を呼び出して、ユーザーの入力をバックエンドに送信する
  const handleSend = () => {
    const text = input.trim();
    if (!text || isRunning) return;
    setInput("");
    processMessage({ role: "user", content: text });
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <header className="flex items-center justify-between bg-white border-b border-slate-200 px-6 py-3 shadow-sm shrink-0">
        Generative UI
      </header>

      {/* メッセージの配列にチャット履歴が含まれているため、これをマッピングして UI をレンダリングする */}
      <div className="flex-1 overflow-y-auto px-4 py-8">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 pb-16">
            <p className="text-slate-400 text-sm">
              メッセージを送って会話を始めましょう
            </p>
          </div>
        )}

        <div className="max-w-3xl mx-auto space-y-5">
          {/* ユーザーのメッセージならそのままテキストを表示する */}
          {messages.map((message) => {
            if (message.role === "user") {
              const text =
                typeof message.content === "string"
                  ? message.content
                  : message.content
                      .filter(
                        (c): c is { type: "text"; text: string } =>
                          c.type === "text",
                      )
                      .map((c) => c.text)
                      .join("");
              return (
                <div key={message.id} className="flex justify-end">
                  <div className="bg-indigo-600 text-white rounded-2xl rounded-br-md px-4 py-2.5 max-w-[72%] text-sm leading-relaxed shadow-sm whitespace-pre-wrap">
                    {text}
                  </div>
                </div>
              );
            }

            // AI のメッセージなら <Renderer> コンポーネントを使用して OpenUI 言語をレンダリングする
            if (message.role === "assistant") {
              return (
                <div key={message.id} className="flex gap-2.5 items-start">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5 select-none">
                    AI
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%] shadow-sm text-sm text-slate-700 leading-relaxed">
                    <Renderer
                      response={message.content ?? null}
                      library={myLibrary}
                      isStreaming={isRunning}
                    />
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>

        <div ref={bottomRef} />
      </div>

      {/* 入力フォーム */}
      <div className="bg-white border-t border-slate-200 px-4 py-3 shrink-0">
        <div className="flex gap-2 items-end max-w-3xl mx-auto">
          <textarea
            className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 min-h-11 max-h-32 transition-shadow disabled:bg-slate-50 disabled:text-slate-400"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="メッセージを入力… (Shift+Enter で改行)"
            disabled={isRunning}
          />
          {/* isRunning は AI の応答が進行中かどうかを表すブール値で、これに応じて送信ボタンを停止ボタンに切り替える */}
          {isRunning ? (
            <button
              onClick={cancelMessage}
              className="shrink-0 border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
            >
              停止
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="shrink-0 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors"
            >
              送信
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  // <ChatProvider> コンポーネントを使用してチャットの状態管理とバックエンドとのやり取りを提供する
  return (
    <ChatProvider
      processMessage={async ({ messages, abortController }) => {
        return fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: openAIMessageFormat.toApi(messages),
          }),
          signal: abortController.signal,
        });
      }}
      // OpenAI のストリーミングレスポンスを OpenUI が処理できる形式に変換するアダプターを指定する
      streamProtocol={openAIReadableStreamAdapter()}
    >
      <ChatUI />
    </ChatProvider>
  );
}
```

以下のように独自のチャット UI を実装できました。

![](https://images.ctfassets.net/in6v9lxmm5c8/2s0PAwQFSPjAVkWc2iWlok/8511dd49dacf163d9b83b3ddeacd5148/image.png)

## インタラクション

OpenUI 言語で定義されたコンポーネントは、ユーザーとのインタラクションを提供します。インタラクションを提供することにより、例えばレストランの料理の一覧をカード形式で表示したうえで、ユーザーが気になる料理をクリックするとそのまま注文できるといった、より実用的な UI を構築できます。

インタラクションが実行された場合、`<Renderer>` コンポーネントの `onAction` コールバックが呼び出されます。コールバック関数の引数でどのアクションが実行されたかを確認できます。

```tsx
<Renderer
  // ...
  onAction={(action) => {
    // continue_conversation は @ToAssistant アクションが実行されたときのアクションタイプで、ユーザーの入力を AI に送るために使用される
    if (action.type === "continue_conversation") {
      // @ToAssistant アクションが実行されたときの処理
      const userMessage = action.message;
      processMessage({ role: "user", content: userMessage });
    }
    // その他のアクション...
  }}
/>
```

アクションは以下のように OpenUI 言語の中で定義されます。ボタンをクリックしたとき、ユーザーの入力を AI に送るための `@ToAssistant` アクションが呼び出されるようになっています。

```txt
btnAdd = Button("Todoを追加", Action([@ToAssistant("Todoを追加したいです。内容・期限・優先度（低/中/高）を聞いて。")]), "primary")
```

アクションのタイプにはいくつか組み込みのタイプが用意されています。

- `continue_conversation`: `@ToAssistant` アクションが実行されたときのアクションタイプで、ユーザーの入力を AI に送るために使用されます
- `open_url`: `@OpenURL` アクションが実行されたときのアクションタイプで、URL を開くために使用されます

以下のアクションは内部的に処理されるため、`onAction` コールバックでこれらのアクションが実行されることはありません。

- `@Run(ref)`: クエリを再取得するか、ミューテーションを実行するためのアクション
- `@Set($var, value)`: バインディングされた変数の値を設定する
- `@Reset($var1, $var2, ...)`: バインディングされた変数の値をリセットする

### クエリとミューテーション

`@Run` アクションの説明ではクエリとミューテーションという概念が出てきました。これらはツールを介してバックエンドとやり取りするための仕組みです。`Query()` や `Mutation()` が呼び出されると AI はツールを呼び出すためのステートメントを生成します。ランタイムによりツールの呼び出しが実行されると、結果は UI に反映されます。

Todo リストの例を考えてみましょう。サーバーのデータベースに保存されている Todo リストを表示するために、`list_todos` というツールがあるとします。OpenUI 言語の中で `Query()` を使用して `list_todos` クエリを呼び出し、`data` という変数に結果を保存できます。

```txt
data = Query("list_todos", {}, {items: []})
```

Query の第 1 引数はツールの名前、第 2 引数はツールに渡す引数（ここでは空のオブジェクト）、第 3 引数はデフォルト値です。ツールが呼び出される前はデフォルト値が `data` に設定されており、ツールが呼び出された後はツールの実行結果で `data` が更新されます。AI は `data` を参照して UI を構築できます。

`Mutation()` はデータを変更するためのツールを呼び出すための仕組みです。Todo を追加するための `add_todo` を呼び出す `addTodo` 変数を定義できます。変数を定義しただけではツールは呼び出されないため、ユーザーのインタラクションに応じて `@Run` アクションを使用してツールを呼び出す必要があります。例えば、Todo を追加するボタンがクリックされたときに `add_todo` ミューテーションを呼び出せます。

`submitButton` というボタンがクリックされたときに `add_todo` ツールを呼び出し、フォームのリセット、クエリの再取得をします。

```txt
addTodo = Mutation("add_todo", {title: $title})
submitButton = Button("Todo を追加", Action([@Run(addTodo), @Run(todos), @Reset($title)]), "primary")
```

実際に `<Renderer>` コンポーネントに `toolProvider` を渡してツールを提供してみましょう。`toolProvider` にはツール名のキーと、ツールが呼び出されたときに実行される関数の値を持つオブジェクト、もしくは MCP クライアントを渡せます。以下の例では、`list_todos` クエリと `add_todo` ミューテーションを提供するために、単純なオブジェクトを `toolProvider` に渡しています。

```tsx
<Renderer
  // ...
  toolProvider={{
    list_todos: async () => {
      const response = await fetch("/api/todos");
      const data = await response.json();
      return data;
    },
    add_todo: async ({ title }) => {
      await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
    },
  }}
/>
```

また、クエリとミューテーションによるツールの呼び出しを有効にするためにシステムプロンプトを変更する必要があります。ツールの定義の追加と、`toolCalls` 機能フラグの有効化を行います。これらを指定するためにプログラムを通じて動的にシステムプロンプトを生成する必要があります。`myLibrary.prompt()` 関数でシステムプロンプトを生成します。ツール定義のスキーマは MCP のツールの定義と同じ形式になっています。

```ts:src/system-prompt.ts
import { myLibrary } from "./library";
import { openuiPromptOptions } from "@openuidev/react-ui/genui-lib";

export const systemPrompt = myLibrary.prompt({
  ...openuiPromptOptions,
  tools: [
    {
      name: "list_todos",
      description: "現在の Todo リストを取得するツール",
      inputSchema: {},
      outputSchema: {
        items: {
          type: "array",
          description: "Todo アイテムのリスト",
          items: {
            type: "object",
            properties: {
              id: { type: "number", description: "Todo の ID" },
              title: { type: "string", description: "Todo のタイトル" },
              completed: { type: "boolean", description: "Todo の完了状態" },
              createdAt: { type: "string", description: "Todo の作成日時" },
            },
          },
        },
      },
      annotations: {
        readOnlyHint: true,
      },
    },
    {
      name: "add_todo",
      description: "Todo リストに新しい項目を追加するツール",
      inputSchema: {
        title: {
          type: "string",
          description: "Todo のタイトル",
        },
      },
      outputSchema: {},
    },
  ],
  toolExamples: [
    "todos = Query('list_todos', {}, {items: []})",
    "addTodo = Mutation('add_todo', {title: $title})",
  ],
  toolCalls: true,
});

```

`api/chat/route.ts` の OpenAI API を呼び出す箇所で、生成された `systemPrompt` を `system` メッセージの内容として渡すようにします。`myLibrary` の元になる `openuiLibrary` の実装ファイルには `"use client"` ディレクティブが付いており、サーバーサイドの実行環境から直接 import できないため、クライアント側で生成された `systemPrompt` を API に渡す形にしています。

```tsx:src/app/page.tsx
"use client";
import { systemPrompt } from "../system-prompt";

// ...

export default function Home() {
  return (
    <ChatProvider
      processMessage={async ({ messages, abortController }) => {
        return fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: openAIMessageFormat.toApi(messages),
            // API ボディにシステムプロンプトを追加
            systemPrompt: systemPrompt,
          }),
          signal: abortController.signal,
        });
      }}
      streamProtocol={openAIReadableStreamAdapter()}
    >
      <ChatUI />
    </ChatProvider>
  );
}
```

Next.js の API ルートを使用して、`/api/todos` エンドポイントを実装しておきましょう。ここでは簡単のために、サーバーのメモリ上で Todo リストを管理する実装を示します。

```ts:src/app/api/todos/route.ts
import { NextRequest, NextResponse } from "next/server";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
};

const todos: Todo[] = [
  {
    id: 1,
    title: "牛乳を買う",
    completed: false,
    createdAt: "2026-05-16T09:00:00.000Z",
  },
  {
    id: 2,
    title: "レポートを提出する",
    completed: true,
    createdAt: "2026-05-16T09:05:00.000Z",
  },
  {
    id: 3,
    title: "歯医者の予約を入れる",
    completed: false,
    createdAt: "2026-05-16T09:10:00.000Z",
  },
];
let nextId = 4;

export function GET() {
  console.log("[GET /api/todos] Returning todos:", todos);
  return NextResponse.json({ items: todos });
}

export async function POST(req: NextRequest) {
  console.log("[POST /api/todos] Received request");
  const body = await req.json().catch(() => null);

  if (!body || typeof body.title !== "string" || !body.title.trim()) {
    return NextResponse.json(
      { error: "title は必須の文字列です" },
      { status: 400 },
    );
  }

  const todo: Todo = {
    id: nextId++,
    title: body.title.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };

  todos.push(todo);
  return NextResponse.json(todo, { status: 201 });
}
```

ツールを提供したら、AI がツールを呼び出していることを確認してみましょう。例えば、AI に「Todo リストと追加するフォームを表示してください」といった質問を入力してみます。AI は以下のような OpenUI 言語を生成しました（以下のコードブロックは AI が生成したものをそのまま掲載しています）。

```txt
root = Stack([headerCard, contentRow, addStatus], "column", "l")

$title = ""
todos = Query("list_todos", {}, {items: []})
addTodo = Mutation("add_todo", {title: $title})

headerCard = Card([headerTitle, headerDescription], "clear")
headerTitle = TextContent("TODO リスト", "large-heavy")
headerDescription = TextContent("現在のTODOを確認し、新しい項目を追加できます。")

contentRow = Stack([listCard, formCard], "row", "l", "stretch", "start", true)
listCard = Card([listHeader, summaryRow, todoTable])
listHeader = CardHeader("現在のTODO", "登録済みのタスク一覧")
summaryRow = Stack([totalCard, doneCard, remainingCard], "row", "m", "stretch", "start", true)
totalCard = Card([totalLabel, totalValue], "sunk")
totalLabel = TextContent("合計", "small")
totalValue = TextContent("" + @Count(todos.items), "large-heavy")

doneCard = Card([doneLabel, doneValue], "sunk")
doneLabel = TextContent("完了", "small")
doneValue = TextContent("" + @Count(@Filter(todos.items, "completed", "==", true)), "large-heavy")
remainingCard = Card([remainingLabel, remainingValue], "sunk")
remainingLabel = TextContent("未完了", "small")
remainingValue = TextContent("" + (@Count(todos.items) - @Count(@Filter(todos.items, "completed", "==", true))), "large-heavy")

todoTable = @Count(todos.items) > 0 ? Table([todoTitleCol, todoStatusCol]) : emptyTodos
todoTitleCol = Col("TODO", todos.items.title)
todoStatusCol = Col("状態", @Each(todos.items, "todo", Tag(todo.completed == true ? "完了" : "未完了", null, "sm", todo.completed == true ? "success" : "warning")))
emptyTodos = TextContent("TODO はまだありません。フォームから追加してください。")

formCard = Card([formHeader, addForm])
formHeader = CardHeader("TODOを追加", "新しいタスクを入力してください")
addForm = Form("addTodo", formButtons, [titleField])
titleField = FormControl("タイトル", Input("title", "例: 明日の資料を準備する", "text", {required: true, minLength: 1, maxLength: 120}, $title), "1〜120文字で入力してください。")
formButtons = Buttons([addButton])
addButton = Button("追加", Action([@Run(addTodo), @Run(todos), @Reset($title)]), "primary")

addStatus = addTodo.status == "loading" ? Callout("info", "追加中", "TODOを追加しています。") : addTodo.status == "success" ? Callout("success", "追加しました", "TODOリストを更新しました。") : addTodo.status == "error" ? Callout("error", "追加に失敗しました", addTodo.error) : null
```

順を追ってポイントを見てみましょう。まずは状態の定義です。`$title` という変数を定義して、フォームの入力値を保存するために使用します。`$` がプレフィックスに付いている変数は双方向のバインディングが作成され、ユーザーがフォームに入力した値が変数に保存されるようになります。次に、`list_todos` クエリと `add_todo` ミューテーションを呼び出すためのツールを定義しています。

```txt
$title = ""
todos = Query("list_todos", {}, {items: []})
addTodo = Mutation("add_todo", {title: $title})
```

合計数を表示するために `@Count()` 関数を使用して `todos.items` の数を数えています。

```txt
totalCard = Card([totalLabel, totalValue], "sunk")
totalLabel = TextContent("合計", "small")
totalValue = TextContent("" + @Count(todos.items), "large-heavy")
```

完了数をカウントするために、`@Filter()` 関数を使用して `todos.items` の中から `completed` プロパティが `true` のアイテムをフィルタリングしています。

```txt
doneCard = Card([doneLabel, doneValue], "sunk")
doneLabel = TextContent("完了", "small")
doneValue = TextContent("" + @Count(@Filter(todos.items, "completed", "==", true)), "large-heavy")
```

三項演算子を用いて、Todo アイテムが存在する場合はテーブルを表示し、存在しない場合は「Todo はまだありません。フォームから追加してください。」というメッセージを表示するようにしています。Todo アイテムを一覧表示するために `@Each()` 関数を使用して `todos.items` のそれぞれのアイテムに対してタグを生成しています。

```txt
todoTable = @Count(todos.items) > 0 ? Table([todoTitleCol, todoStatusCol]) : emptyTodos
todoTitleCol = Col("TODO", todos.items.title)
todoStatusCol = Col("状態", @Each(todos.items, "todo", Tag(todo.completed == true ? "完了" : "未完了", null, "sm", todo.completed == true ? "success" : "warning")))
emptyTodos = TextContent("TODO はまだありません。フォームから追加してください。")
```

フォームの Input コンポーネントには `$title` 変数がバインドされているため、ユーザーがフォームに入力した値は `$title` に保存されます。追加ボタンがクリックされたときに `add_todo` ミューテーションを呼び出すために、`@Run(addTodo)` アクションを使用しています。さらに、Todo を追加した後に Todo リストを再取得するために `@Run(todos)` を使用し、フォームの入力値をリセットするために `@Reset($title)` を使用しています。

```txt
titleField = FormControl("タイトル", Input("title", "例: 明日の資料を準備する", "text", {required: true, minLength: 1, maxLength: 120}, $title), "1〜120文字で入力してください。")
formButtons = Buttons([addButton])
addButton = Button("追加", Action([@Run(addTodo), @Run(todos), @Reset($title)]), "primary")
```

ミューテーションの状態に応じて、追加のステータスメッセージを表示するために、`addTodo.status` を参照しています。三項演算子を使用して状態に応じた Callout コンポーネントを表示するようにしています。

```txt
addStatus = addTodo.status == "loading" ? Callout("info", "追加中", "TODOを追加しています。") : addTodo.status == "success" ? Callout("success", "追加しました", "TODOリストを更新しました。") : addTodo.status == "error" ? Callout("error", "追加に失敗しました", addTodo.error) : null
```

UI を確認してみると、確かにツールの呼び出し結果を元に Todo リストが表示されていることがわかります。フォームのサブミットも正しく動作していることがわかりました。

![](https://images.ctfassets.net/in6v9lxmm5c8/1JEDeYHyZv8kYaMntJ8fCS/613bab3dc24439bec9f4d082582ab427/image.png)

## まとめ

- OpenUI は Generative UI を構築するためのフレームワーク。OpenUI 言語と呼ばれる独自の宣言型言語を使用して、AI が UI を構築するための指示を与えるという新しいアプローチを提供する
- OpenUI は以下の 4 つの主要なコンポーネントで構成されている
  - コンポーネントライブラリ: AI が UI を構築するために使用できるコンポーネントの定義を提供する
  - プロンプトジェネレーター: コンポーネントライブラリをもとに、AI に与えるプロンプトを生成する
  - パーサー: AI の出力を OpenUI 言語で定義された構造化された形式に変換する
  - レンダラー: パーサーの出力を実際の UI にレンダリングする
- `defineComponent()` 関数を使用して、OpenUI 言語で使用するコンポーネントを定義し、`createLibrary()` 関数を使用してコンポーネントライブラリを作成する
- `<Renderer>` コンポーネントを使用して、AI の出力をレンダリングされた UI に変換できる。`onAction` コールバックを使用して、ユーザーのインタラクションに応じた処理を実装できる
- `@Run` アクションを使用して、ツールを呼び出せる。ツールはクエリとミューテーションの両方をサポートしており、バックエンドとやり取りするための仕組みを提供する

## 参考

- [OpenUI - The Open Standard for Generative UI](https://www.openui.com)
- [Stop Making AI Write JSON](https://www.openui.com/blog/stop-making-ai-write-json)
- [thesysdev/openui: The Open Standard for Generative UI](https://github.com/thesysdev/openui)
