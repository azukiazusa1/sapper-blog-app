---
id: aU3AJ8y-gPMSvWfAfMh2y
title: "新しいグラフライブラリ TanStack Charts の設計思想と使い方"
slug: "tanstack-charts-design-and-usage"
about: "多くのグラフライブラリがある中、TanStack Charts はなぜ作られたのでしょうか。この記事では、TanStack Charts の設計思想を整理し、React で売上の折れ線にキャンペーンの注釈を重ねるサンプルを紹介します。"
createdAt: "2026-09-05T13:33+09:00"
updatedAt: "2026-09-05T13:33+09:00"
tags: ["React", "TanStack Charts"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3joxjBZgXoDYsOfbsjLmh0/a8d5efb61a82ebac2ce391dc24e348e5/white-board_graph_9947-768x768.png"
  title: "ホワイトボードに描かれたグラフのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "TanStack Charts が Observable Plot から受け継ぎ、アプリケーション向けに発展させた設計はどれですか？"
      answers:
        - text: "グラフの種類ごとに専用コンポーネントを用意する設計"
          correct: false
          explanation: "TanStack Charts は mark、channel、scale などを組み合わせてグラフを記述します。"
        - text: "描画要素の合成を、サイズ調整や更新などの共通処理と組み合わせる設計"
          correct: true
          explanation: "Observable Plot の合成の考え方を参考にしながら、アプリケーションで必要なライフサイクルや操作との連携を扱います。"
        - text: "独自のデータ形式へ変換してから、React 内だけで描画する設計"
          correct: false
          explanation: "元のデータを mark ごとに渡せます。グラフ定義は React から独立しています。"
        - text: "ブラウザ内の AI がデータを調べ、適切なグラフを選ぶ設計"
          correct: false
          explanation: "AI によるデータ探索やグラフの選択はランタイムの責務ではありません。"
    - question: "売上とキャンペーンを同じグラフに表示するサンプルでは、2 つの配列をどのように扱っていますか？"
      answers:
        - text: "売上の配列へキャンペーン名を結合して、すべての mark に渡す"
          correct: false
          explanation: "サンプルでは配列を結合していません。売上と注釈の mark にそれぞれ元の配列を渡しています。"
        - text: "キャンペーンの行を売上の配列に追加して、同じ折れ線で結ぶ"
          correct: false
          explanation: "キャンペーンは売上金額を持たない別のデータです。ruleX と text で表現しています。"
        - text: "別々のグラフを作り、CSS で 4 月の位置をそろえて重ねる"
          correct: false
          explanation: "1 つの定義の中で横軸を共有しており、CSS で位置を合わせる処理はありません。"
        - text: "各 mark に対応する配列を渡し、month を共通の横軸へ対応付ける"
          correct: true
          explanation: "lineY と dot は売上、ruleX と text はキャンペーンを使います。どちらも month を横軸に対応付けるため、同じ月の横位置がそろいます。"
    - question: "異なるデータ型の mark を組み合わせた例で、onSelect の point.datum を扱う方法はどれですか？"
      answers:
        - text: "常に Sale 型として扱い、revenue を読む"
          correct: false
          explanation: "注釈の元データである Campaign が渡る場合もあるため、Sale だと決め付けることはできません。"
        - text: "ピクセル座標を month に戻して、元の配列から検索する"
          correct: false
          explanation: "point.datum に元のデータが入るため、この例では座標から検索し直す必要はありません。"
        - text: "kind で種類を判定して、revenue または label を読む"
          correct: true
          explanation: "point.datum は Sale | Campaign として推論されます。kind で型を絞り込むと、それぞれのプロパティを参照できます。"
        - text: "共通の x と y だけを持つデータ型として扱う"
          correct: false
          explanation: "point.datum は座標だけの共通形式ではなく、元の Sale または Campaign のデータを保持します。"
published: true
---

Web アプリケーションにグラフを表示するためのライブラリには、Chart.js、Recharts、D3、Observable Plot など、すでに多くの選択肢があります。基本的な折れ線や棒グラフであれば、いずれかを使って実装した経験がある人も多いのではないでしょうか。

一方、グラフをアプリケーションの機能として使い続けるには、データを線や棒として描くだけでは足りません。サイドバーの開閉に合わせたサイズ変更、選択したデータを使った画面遷移、異なるデータを使った注釈などを、アプリケーションの状態やライフサイクルと連携させる必要があります。こうした処理をどの API で記述し、どこまでライブラリに任せるかは、ライブラリごとに異なります。

[TanStack Charts](https://tanstack.com/charts)は、柔軟なグラフ表現とアプリケーションへの組み込みを 1 つの設計で扱うライブラリです。線、点、文字などを mark（描画要素）として組み合わせます。また、コンテナーに応じたサイズ変更、画面への取り付け・更新・取り外しといった React などのライフサイクル、選択イベントから元のデータを受け取る仕組みも提供します。

たとえば EC サイトの管理画面で、月別売上の点を選択し、その月の売上詳細画面へ移動する機能を考えてみましょう。TanStack Charts では選択した点の元データを `onSelect` で受け取り、アプリケーションのルーターへ渡せます。

```tsx
<Chart
  definition={salesChart}
  ariaLabel="月別売上"
  onSelect={(point) => {
    if (point?.datum.kind !== "sale") return;

    navigate(`/sales/${point.datum.month}`);
  }}
/>
```

また、売上データとは別に管理されているキャンペーンを、開始月の縦線とラベルとして重ねることもできます。売上、縦線、ラベルにそれぞれ異なるデータを渡し、共通の座標上へ描画する仕組みが mark の組み合わせです。

この記事では、TanStack Charts の設計思想を整理し、React で売上の折れ線にキャンペーンの注釈を重ねるサンプルを紹介します。

:::warning
2026 年 9 月 5 日時点の TanStack Charts は Alpha です。この記事のサンプルは npm で公開されている `@tanstack/charts@0.16.0` を使って検証しています。
:::

## TanStack Charts はなぜ作られたのか

開発の背景を知る手がかりとして、公式リポジトリに[PLAN.md](https://github.com/TanStack/charts/blob/v0.16.0/PLAN.md)が公開されています。

具体的な出発点の 1 つは、TanStack.com のグラフです。開発計画の「TanStack.com findings and migration」では、npm パッケージの統計を表示するグラフに、データ変換、コンテナーのサイズ測定、テーマ、ツールチップ、操作、アニメーション、エクスポート、製品固有の状態などが集まっていたことが記されています。

このうち、サイズ調整や描画の更新、フレームワークとの連携は、ほかのアプリケーションでも繰り返し必要になる処理です。一方、npm のデータ取得や、ダウンロード数をどのように集計するかは、そのアプリケーションの責務です。TanStack Charts は、この境界を整理してグラフに共通する処理を引き受ける方針を取っています。

### Observable Plot のラッパーでは足りなかったのか

TanStack Charts が強く影響を受けたのは[Observable Plot](https://observablehq.com/plot/)です。Observable Plot は、線、点、棒などの描画要素を組み合わせて可視化を記述します。データを探索しながら表現を変えていく使い方を重視しており、TanStack Charts はこの表現方法を受け継いでいます。

https://github.com/TanStack/charts/blob/v0.16.0/docs/overview.md

開発過程では、Observable Plot を React などのアプリケーションから使いやすくする実験も行われました。しかし、折れ線など必要な機能だけを import しても、未使用の機能をバンドルから十分に除去できないことが確認されました。必要な機能だけを含む小さな構成を実現するには、import の書き方だけでなく、描画エンジン内部の依存関係を分割する必要があったのです。

そこで検討されたのは、Observable Plot 本体のモジュール分割に協力する方法、互換性を保った fork を維持する方法、独自エンジンを作る方法です。最終的に TanStack Charts は、Plot の考え方を参考にしながら独自のエンジンを採用しました。これは現在のあらゆるグラフで速いという比較結果ではなく、当時の設計判断の背景です。

## 描画要素を組み合わせる

TanStack Charts では、「折れ線グラフ」という完成済みの部品へ注釈オプションを追加するのではなく、折れ線、縦線、文字を独立した描画要素として扱います。

以下は折れ線グラフを中心に考える API を単純化した擬似コードです。`annotations` は折れ線グラフに付属する設定として記述されています。

```ts
const chart = createLineChart({
  data: sales,
  x: "month",
  y: "revenue",
  annotations: [
    {
      type: "vertical-line",
      data: campaigns,
      x: "month",
      label: "label",
    },
  ],
});
```

続いて同じ表現を TanStack Charts の mark で組み立てたコードです。売上の折れ線を表す `lineY`、キャンペーン開始月の縦線を表す `ruleX`、キャンペーン名を表す `text` を `marks` に並べています。

```ts
const chart = defineChart({
  marks: [
    lineY(sales, { x: "month", y: "revenue" }),
    ruleX(campaigns, { x: "month" }),
    text(campaigns, { x: "month", y: () => 200, text: "label" }),
  ],
  scales: {
    x: { scale: scaleLinear().domain([1, 6]) },
    y: { scale: scaleLinear().domain([0, 220]) },
  },
});
```

後者のコードには、折れ線専用の `annotations` という設定がありません。3 種類の mark は共通の x と y のスケールを使うため、売上の点とキャンペーンの縦線が同じ月の横位置に描かれます。つまり「注釈を持つ折れ線グラフ」ではなく、「折れ線、縦線、文字を同じ座標上へ重ねたグラフ」として表現しています。

このコードに登場する概念を整理すると、次のようになります。

| 概念    | 意味                                         | 売上グラフでの例                             |
| ------- | -------------------------------------------- | -------------------------------------------- |
| Data    | 描画に使うデータ                             | 売上の配列、キャンペーンの配列               |
| Mark    | 線、点、文字などの描画要素                   | 売上の折れ線、開始月の縦線                   |
| Channel | データを位置や色などへ対応付ける指定         | `month` を横位置、`revenue` を縦位置に使う   |
| Scale   | データの値を画面上の座標などへ変換する仕組み | 売上の 0〜220 万円をグラフの高さへ対応付ける |
| Guide   | 対応付けを読み取るための目印                 | 軸、目盛り、グリッド                         |

これらの要素を組み合わせる考え方を、[Grammar of Graphics](https://github.com/TanStack/charts/blob/v0.16.0/docs/concepts/grammar-of-graphics.md)と呼びます。TanStack Charts が新しく発明したものではなく、ggplot2、Vega-Lite、Observable Plot などにもつながる考え方です。

今回なら、売上の配列は折れ線と点の mark に渡し、キャンペーンの配列は縦線と文字の mark に渡します。同じグラフでも、すべての mark が同じ配列や同じ型を使う必要はありません。

そのため「売上が存在する行にだけキャンペーン名を追加する」といった、表示の都合に合わせたデータの加工が不要になります。どの値をどの座標に使うかは、各 mark の channel で明示します。

## React で売上の折れ線を表示する

ここからは TanStack Charts を実際に使ってみましょう。React と TypeScript のプロジェクトで、月別売上をグラフで表示します。

### プロジェクトを用意する

Vite を使う最小のプロジェクトを用意し、TanStack Charts をインストールします。以下は検証時に使ったバージョンです。

```bash
mkdir charts-example
cd charts-example
npm init -y
npm pkg set type=module scripts.dev=vite
npm install --save-exact @tanstack/charts@0.16.0 react@19.2.3 react-dom@19.2.3
npm install --save-dev --save-exact vite@7.3.1 typescript@5.9.3 @types/react@19.2.7 @types/react-dom@19.2.3
```

`index.html`、`src/main.tsx`、`tsconfig.json` を作成します。

<details>
<summary>index.html、src/main.tsx、tsconfig.json</summary>

```html:index.html
<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>月別売上とキャンペーン</title>
    <style>
      body {
        margin: 24px;
        font-family: sans-serif;
      }
      main {
        max-width: 880px;
        margin: auto;
      }
      h1 {
        font-size: clamp(1.25rem, 4vw, 2rem);
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

```tsx:src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

```json:tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["src"]
}
```

</details>

### 元のデータを定義する

`src/data.ts` に、売上とキャンペーンのデータを用意します。`kind` は後で選択したデータの種類を判定するためのプロパティです。

```ts:src/data.ts
export interface Sale {
  kind: "sale";
  month: number;
  revenue: number;
}

export interface Campaign {
  kind: "campaign";
  month: number;
  label: string;
}

export const sales: Sale[] = [
  { kind: "sale", month: 1, revenue: 80 },
  { kind: "sale", month: 2, revenue: 95 },
  { kind: "sale", month: 3, revenue: 90 },
  { kind: "sale", month: 4, revenue: 140 },
  { kind: "sale", month: 5, revenue: 160 },
  { kind: "sale", month: 6, revenue: 175 },
];

export const campaigns: Campaign[] = [
  { kind: "campaign", month: 4, label: "春のキャンペーン" },
];
```

`Sale` は売上金額を持ち、`Campaign` はキャンペーン名を持ちます。両方とも `month` を持ちますが、同じデータ型へ変換する処理は追加していません。

### mark と scale を定義する

まずは折れ線だけを作ります。`src/basic.ts` を作成してください。

```ts:src/basic.ts
import { defineChart, lineY } from "@tanstack/charts";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { sales } from "./data";

export const basicChart = defineChart({
  marks: [lineY(sales, { x: "month", y: "revenue" })],
  scales: {
    x: {
      scale: scaleLinear().domain([1, 6]),
      axis: {
        label: "月",
        ticks: { values: [1, 2, 3, 4, 5, 6], format: (value) => `${value}月` },
      },
    },
    y: {
      scale: scaleLinear().domain([0, 220]),
      grid: true,
      axis: { label: "売上（万円）" },
    },
  },
});
```

`defineChart` はグラフ定義を作る関数です。`marks` に描画要素の配列を渡します。今回は売上の配列を `lineY` に渡し、月ごとの売上を折れ線で結びます。グラフ定義は後ほど React コンポーネントに渡します。グラフ定義単体は React から独立して作ることができ、特定の UI ライブラリであったり描画方法（Canvas、SVG、WebGL）に依存しないという特徴があります。

`lineY` に渡した `x: "month"` と `y: "revenue"` が channel に相当します。各行のどの値を横位置と縦位置へ対応付けるかを指定しています。`lineY` は入力順に点を結ぶため、ここでは月の順に並べた配列を渡しています。外部から取得した配列の順序が保証されない場合は、先に並べ替える必要があるでしょう。

`scaleLinear` は数値を線形に対応付けるスケールです。`domain([0, 220])` はデータの範囲を表します。コンテナーの幅や高さに応じた座標への変換は TanStack Charts が担当します。

`scales` の中に書いた `axis` と `grid` が、先ほど mark や channel と並べて挙げた guide にあたります。`axis.ticks.values` は目盛りを打つ値、`grid: true` は横方向の補助線を有効にする指定です。scale がデータの値と座標の対応付けそのものであるのに対し、guide はその対応付けを読者が目で読み取るための目印です。両者は同じ軸に属するので、`scales.x` や `scales.y` の中にまとめて書きます。

### React の Chart に渡す

`src/App.tsx` を次のように作成します。ここでは `@tanstack/charts/react` から `Chart` を import しグラフを描画します。

```tsx:src/App.tsx
import { Chart } from "@tanstack/charts/react";
import { basicChart } from "./basic";

export default function App() {
  return (
    <main>
      <h1>月別売上</h1>
      <Chart
        definition={basicChart}
        height={360}
        ariaLabel="1 月から 6 月の売上"
      />
    </main>
  );
}
```

`definition` にグラフ定義を渡し、`height` に高さを指定します。`width` を省略すると、グラフの横幅はコンテナーに追従します。つまり、サイドバーの開閉などで横幅が変わる場合も、グラフは自動的に追従するようになります。`ariaLabel` は支援技術向けのラベルで、必須のプロパティです。

`npm run dev` で起動して確認してみましょう。この段階で、1 月の 80 万円から 6 月の 175 万円までを結ぶ折れ線が表示されます。画面幅を変えても折れ線は追従して描画されることもわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/2wg7w4nA5cQo9Ut4je5G1G/6f28b9279656ea3d26650d601fa2aa83/image.png)

## 別のデータから注釈を重ねる

次に、キャンペーンが始まった 4 月に縦線とラベルを表示します。`src/chart.ts` を作成してください。

```ts:src/chart.ts {8-15}
import { defineChart, dot, lineY, ruleX, text } from "@tanstack/charts";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { campaigns, sales } from "./data";

export const salesChart = defineChart({
  marks: [
    ruleX(campaigns, { x: "month", stroke: "#b45309" }),
    lineY(sales, { x: "month", y: "revenue", stroke: "#2563eb" }),
    dot(sales, { x: "month", y: "revenue", fill: "#2563eb", r: 4 }),
    text(campaigns, {
      x: "month",
      y: () => 200,
      text: "label",
      fill: "#92400e",
    }),
  ],
  scales: {
    x: {
      scale: scaleLinear().domain([1, 6]),
      axis: {
        label: "月",
        ticks: { values: [1, 2, 3, 4, 5, 6], format: (value) => `${value}月` },
      },
    },
    y: {
      scale: scaleLinear().domain([0, 220]),
      grid: true,
      axis: { label: "売上（万円）" },
    },
  },
});
```

主な変更点は、`marks` に注釈の要素を追加したことです。`marks` の配列に以下の要素を追加しています。

- `ruleX`：第 1 引数に渡した `campaigns` の各行について、`x` に指定した `month` の位置へ縦線を描く。今回の `campaigns` は `month: 4` の行が 1 件だけなので、縦線も 4 月に 1 本だけ描かれる
- `dot`：各月の売上を点で描く。`lineY` と同じ `sales` の配列を使うので、折れ線の上に点が重なる
- `text`：縦線の上にキャンペーン名を表示する。`y: () => 200` で縦軸の 200 万円に対応する高さへラベルを置く

`App.tsx` の import を `salesChart` に変更し、`definition` に渡す変数も変更すると、注釈付きのグラフになります。

```diff:src/App.tsx
-import { basicChart } from "./basic";
+import { salesChart } from "./chart";

-        definition={basicChart}
+        definition={salesChart}
```

4 月の位置に縦線が入り、その上にキャンペーン名が表示されます。売上の点が折れ線の上に重なっていることも確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/6eT4Hz4ENhDcxgD07NV40z/7553083b4ec3aee4796a6af047ab0870/image.png)

## ツールチップと選択したデータを扱う

グラフ定義に、`@tanstack/charts/tooltip` から読み込んだ `tooltip` を指定すると、点へポインターを重ねたときに組み込みのツールチップが表示されます。

```ts:src/chart.ts {3, 32}
import { defineChart, dot, lineY, ruleX, text } from "@tanstack/charts";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { tooltip } from "@tanstack/charts/tooltip";
import { campaigns, sales } from "./data";

export const salesChart = defineChart({
  marks: [
    ruleX(campaigns, { x: "month", stroke: "#b45309" }),
    lineY(sales, { x: "month", y: "revenue", stroke: "#2563eb" }),
    dot(sales, { x: "month", y: "revenue", fill: "#2563eb", r: 4 }),
    text(campaigns, {
      x: "month",
      y: () => 200,
      text: "label",
      fill: "#92400e",
    }),
  ],
  scales: {
    x: {
      scale: scaleLinear().domain([1, 6]),
      axis: {
        label: "月",
        ticks: { values: [1, 2, 3, 4, 5, 6], format: (value) => `${value}月` },
      },
    },
    y: {
      scale: scaleLinear().domain([0, 220]),
      grid: true,
      axis: { label: "売上（万円）" },
    },
  },
  tooltip,
});
```

ツールチップの内容は、デフォルトでは `x.axis` と `y.axis` のラベルと値を並べた表になります。つまり `月 4`、`売上（万円） 140` といった内容です。

さらに、点を選択したときに元のデータを取り出してみましょう。`src/App.tsx` を次のように置き換えます。

```tsx:src/App.tsx
import { Chart } from "@tanstack/charts/react";
import { salesChart } from "./chart";

export default function App() {
  return (
    <main>
      <h1>月別売上とキャンペーン</h1>
      <Chart
        definition={salesChart}
        height={360}
        ariaLabel="1 月から 6 月の売上と、4 月のキャンペーン開始時点"
        onSelect={(point) => {
          if (!point) return;
          const row = point.datum;
          if (row.kind === "sale") {
            console.log(`${row.month}月の売上: ${row.revenue}万円`);
          } else {
            console.log(row.label);
          }
        }}
      />
    </main>
  );
}
```

`onSelect` へ渡される `point` は、対象がない場合には `null` になるため、最初に確認しています。`point.datum` には選択された元のデータが入ります。この例では売上とキャンペーンの両方があるため、TypeScript は `Sale | Campaign` として扱います。そのため `row.kind` で種類を判定し、売上なら月と金額を、キャンペーンならラベルをコンソールに出力するようにしています。

実際に 4 月の点をクリックすると、開発者ツールのコンソールには `4月の売上: 140万円` と表示されました。ツールチップでも対応する売上の値を確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3VjZ0xMRjXCvQima9gLcBr/8236d9f6d6df1bfaae00c948df3e2eba/image.png)

## ツールチップの表示を調整する

ツールチップのデフォルトの表示は `月 4`、`売上（万円） 140` でした。横軸の目盛りは `axis.ticks.format` で `4月` と表示しているにもかかわらず、ツールチップ側は「4」のままです。目盛りの `format` はツールチップには適用されないため、軸とツールチップで表記がずれます。

表示を整えるには、`tooltip` を単体で渡す代わりに、`use` に `tooltip` を置いたオブジェクトを渡します。こうするとオプションを一緒に指定できます。

```diff:src/chart.ts
-  tooltip,
+  tooltip: {
+    use: tooltip,
+    items: [
+      { channel: "x", label: "月", text: (point) => `${point.xValue}月` },
+      {
+        channel: "y",
+        label: "売上",
+        text: (point) =>
+          point.datum.kind === "sale" ? `${point.datum.revenue}万円` : null,
+      },
+    ],
+  },
 });
```

`items` は、1 つの点について表示する行を上から順に並べた配列です。各行では次を指定しています。

- `channel`：その行が `x` と `y` のどちらの値を表すかを指定する。関数の中では `point.xValue`、`point.yValue` で対応する値を参照できる
- `label`：行の見出しとして表示する文字列。省略すると軸のラベルが使われる
- `text`：行に表示する文字列を組み立てる関数

`text` の中では `point.datum` を参照できます。`onSelect` のときと同じく、ここでも元のデータ型が保たれるため、型は `Sale | Campaign` です。そのため `revenue` を読むには `kind` で絞り込む必要があります。

絞り込みで `null` を返している点にも意味があります。`text` が `null` や `undefined` を返した行は表示されません。売上を持たないキャンペーンの点が対象になったときに、「売上」の行だけを消すことができるのです。

この状態で 4 月の点にポインターを重ねると、ツールチップは `月 4月` と `売上 140万円` の 2 行になり、横軸の目盛りと表記がそろいます。

![](https://images.ctfassets.net/in6v9lxmm5c8/18PQO693ADYAhYBkx4iWms/3878dd8b490ef93d77d0d780a004d517/image.png)

見た目はカスタムプロパティで変更できます。ツールチップは祖先要素から次の変数を継承するため、グラフを囲む要素に指定すれば適用されます。

```css
main {
  --ts-chart-tooltip-background: #1f2937;
  --ts-chart-tooltip-color: #f9fafb;
  --ts-chart-tooltip-border-radius: 8px;
}
```

https://github.com/TanStack/charts/blob/v0.16.0/docs/reference/focus-and-interaction.md

## まとめ

- TanStack Charts は、Observable Plot の表現方法を参考にしながら、アプリケーション内で必要なサイズ調整、更新、操作、フレームワーク連携を扱うライブラリ
- グラフは mark、channel、scale などの組み合わせで記述し、mark ごとに異なる配列とデータ型を渡せる
- React では `Chart` に定義を渡し、`ruleX` や `text` を追加することで、売上データと別のイベントデータを同じ座標上に描画できる
- `tooltip` を追加すると、点にポインターを重ねたときに組み込みのツールチップが表示される。`items` を指定すれば行の見出しと文字列を自分で組み立てられ、見た目はカスタムプロパティで調整できる
- `onSelect` で選択した点の元データを受け取り、種類を判定して売上やキャンペーン名を扱える

## 参考

- [TanStack Charts](https://tanstack.com/charts)
- [TanStack Charts Plan](https://github.com/TanStack/charts/blob/v0.16.0/PLAN.md)
- [Overview](https://github.com/TanStack/charts/blob/v0.16.0/docs/overview.md)
- [Grammar of Graphics](https://github.com/TanStack/charts/blob/v0.16.0/docs/concepts/grammar-of-graphics.md)
- [React Quick Start](https://github.com/TanStack/charts/blob/v0.16.0/docs/framework/react/quick-start.md)
- [Scales, Guides, and Color](https://github.com/TanStack/charts/blob/v0.16.0/docs/reference/scales-guides-and-color.md)
- [Focus and Interaction](https://github.com/TanStack/charts/blob/v0.16.0/docs/reference/focus-and-interaction.md)
- [TypeScript](https://github.com/TanStack/charts/blob/v0.16.0/docs/guides/typescript.md)
- [Alpha Stability](https://github.com/TanStack/charts/blob/v0.16.0/docs/stability.md)
- [Observable Plot: Getting started](https://observablehq.com/plot/getting-started)
- [Chart.js: Data structures](https://www.chartjs.org/docs/latest/general/data-structures.html)
- [Recharts: Getting Started](https://recharts.github.io/en-US/guide/getting-started/)
- [What is D3?](https://d3js.org/what-is-d3)
