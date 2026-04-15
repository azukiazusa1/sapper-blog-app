---
marp: true
theme: default
size: 16:9
class: invert
description: フロントエンドの相手が変わった - AIが加わったWebの新しいインターフェース設計
style: |
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Noto+Sans+JP:wght@300;400;500;600;700;800;900&display=swap');

  :root {
    --stone-50: #fafaf9;
    --stone-100: #f5f5f4;
    --stone-200: #e7e5e4;
    --stone-300: #d6d3d1;
    --stone-400: #a8a29e;
    --stone-500: #78716c;
    --stone-600: #57534e;
    --stone-700: #44403c;
    --stone-800: #292524;
    --stone-900: #1c1917;
    --stone-950: #0c0a09;
    --accent: #5eead4;
    --accent-dim: #2dd4bf;
    --accent-muted: rgba(94, 234, 212, 0.15);
  }

  section {
    background: var(--stone-950);
    color: var(--stone-200);
    font-family: 'Noto Sans JP', 'Inter', sans-serif;
    font-weight: 400;
    font-size: 30px;
    line-height: 1.6;
    padding: 56px 64px 52px;
    position: relative;
  }

  section::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background:
      radial-gradient(ellipse at 10% 90%, rgba(94, 234, 212, 0.06) 0%, transparent 50%),
      radial-gradient(ellipse at 90% 10%, rgba(94, 234, 212, 0.04) 0%, transparent 50%);
    pointer-events: none;
  }

  section::after {
    content: "";
    position: absolute;
    inset: 24px;
    border: 1px solid rgba(245, 245, 244, 0.06);
    pointer-events: none;
  }

  h1, h2, h3 {
    margin: 0 0 0.6em;
    line-height: 1.2;
    letter-spacing: -0.02em;
    color: #ffffff;
  }

  h1 {
    font-size: 58px;
    font-weight: 800;
  }

  h2 {
    font-size: 46px;
    font-weight: 700;
    border-bottom: 2px solid var(--accent-muted);
    padding-bottom: 0.3rem;
  }

  h3 {
    font-size: 34px;
    font-weight: 700;
    color: var(--accent);
  }

  p, li {
    color: var(--stone-300);
  }

  strong {
    color: #ffffff;
    font-weight: 700;
  }

  em {
    color: var(--accent);
    font-style: normal;
  }

  a {
    color: var(--accent-dim);
    text-decoration: underline;
    text-underline-offset: 0.14em;
  }

  code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.82em;
    background: var(--stone-800);
    color: var(--accent);
    border: 1px solid var(--stone-700);
    border-radius: 6px;
    padding: 0.14em 0.32em;
  }

  pre {
    margin: 0.8em 0;
    padding: 18px 20px;
    border-radius: 10px;
    border: 1px solid var(--stone-700);
    background: linear-gradient(135deg, var(--stone-900), var(--stone-800));
    font-size: 20px;
    line-height: 1.45;
  }

  pre code {
    background: transparent;
    border: 0;
    color: var(--stone-200);
    padding: 0;
  }

  ul, ol {
    margin: 0.4em 0 0;
    padding-left: 0;
  }

  li {
    list-style: none;
    position: relative;
    padding-left: 1.8rem;
    margin: 0.32em 0;
  }

  li::before {
    content: '▸';
    position: absolute;
    left: 0;
    color: var(--accent);
    font-weight: bold;
    font-size: 1.1em;
  }

  blockquote {
    margin: 1em 0;
    padding: 0.9em 1em;
    border-left: 4px solid var(--accent);
    background: var(--accent-muted);
    border-radius: 0 8px 8px 0;
    color: var(--stone-100);
  }

  blockquote p {
    color: var(--stone-200);
    font-size: 1.0rem;
    margin: 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 24px;
  }

  th, td {
    border: 1px solid var(--stone-700);
    padding: 12px 14px;
    text-align: left;
  }

  th {
    color: #ffffff;
    background: var(--stone-800);
  }

  img {
    border-radius: 8px;
  }

  .eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 17px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--stone-400);
    margin-bottom: 18px;
  }

  .lead {
    font-size: 34px;
    line-height: 1.5;
    color: var(--stone-100);
  }

  .muted {
    color: var(--stone-400);
  }

  .accent {
    color: var(--accent);
  }

  .center {
    text-align: center;
  }

  .hero {
    display: grid;
    place-items: center;
    text-align: center;
    height: 100%;
    align-content: center;
    gap: 18px;
  }

  .title {
    max-width: 16em;
  }

  .mono {
    font-family: 'JetBrains Mono', monospace;
  }

  .columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px;
    align-items: start;
  }

  .columns-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    align-items: stretch;
  }

  .card {
    background: var(--accent-muted);
    border: 1px solid rgba(94, 234, 212, 0.2);
    border-radius: 10px;
    padding: 18px 20px;
  }

  .card h3, .card h4 {
    margin-top: 0;
  }

  .label {
    display: inline-block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 15px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 10px;
  }

  .big {
    font-size: 44px;
    line-height: 1.35;
    color: var(--stone-100);
  }

  .statement {
    font-size: 40px;
    line-height: 1.5;
    color: var(--stone-100);
    text-align: center;
    margin: 1.2em 0;
  }

  .statement strong {
    color: #ffffff;
  }

  .huge {
    font-size: 64px;
    line-height: 1.1;
    color: #ffffff;
  }

  .quote {
    font-size: 40px;
    line-height: 1.4;
    color: var(--stone-100);
  }

  .fit {
    font-size: 24px;
  }

  .small {
    font-size: 20px;
  }

  .tiny {
    font-size: 16px;
  }

  .divider {
    height: 1px;
    background: var(--stone-700);
    margin: 18px 0;
  }

  video {
    max-width: 100%;
    border-radius: 10px;
    border: 1px solid var(--stone-700);
  }
---

<div class="hero">
  <div class="eyebrow">Frontend Conference Nagoya 2026</div>
  <h1 class="title">フロントエンドの相手が変わった<br />AIが加わったWebの新しいインターフェース設計</h1>
  <div class="lead">人間だけの UI から、人間と AI が協業する UI へ</div>
  <div class="mono muted">azukiazusa</div>
</div>

<!--
今日は「フロントエンドの相手が変わった」という話をします。
ここでいう相手というのは、私たちがインターフェースを設計するときに誰を見ているのか、という意味です。
これまでは基本的に人間でした。
でもここ 2〜3 年で、その前提が崩れ始めています。
AI が Web を読むようになり、書くようになり、操作するようになりました。
つまり、フロントエンドの相手に AI が加わったということです。
今日はこの変化を 30 分で整理していきます。
-->

---

## 自己紹介

<div class="columns">

<div class="card">

- **azukiazusa**
- Frontend Engineer
- https://azukiazusa.dev
- 週に 1 回、Web 開発と AI の記事を書いています
- FE（フロントエンド | ファイアーエムブレム）が好き

</div>

<div class="center">

![w:280](../mcp-server/images/azukiazusa.png)

</div>

</div>

<!--
簡単に自己紹介です。
azukiazusa という名前で活動していて、フロントエンド中心に情報発信をしています。
最近は特に、AI と Web の接点について書くことが多いです。
今日はその中で見えてきた変化を共有できればと思います。
-->

---

## あなたのフロントエンドの "相手" は誰ですか？

- 従来のフロントエンドの仕事は、**人間とシステムの間のインターフェース**を作ることだった
- ところが 2023 年以降、AI が Web のコンテンツを**読んで、生成して、操作する**ようになった
- つまり Web の相手に **AI が加わった**

<!--
最初に、1 つ問いです。
あなたのフロントエンドの相手は誰でしょうか。
多くの人は、ユーザー体験と言うと人間の体験を思い浮かべると思います。
でも今は違います。
AI がコンテンツを読むし、AI が UI を生成するし、AI が操作もする。
つまり、相手が増えています。
これを前提にすると、設計の見方が大きく変わります。
-->

---

## 2つの AI

<div class="columns">

<div class="card">
  <div class="label">Producer</div>
  <h3>出力者の AI</h3>

- チャットで応答を生成する
- UI コンポーネントを返す
- 処理の流れを組み立てる

</div>

<div class="card">
  <div class="label">Consumer</div>
  <h3>消費者の AI</h3>

- コンテンツを読む
- 意味を理解して判断する
- Web アプリをツールとして使う

</div>

</div>

<!--
AI は一枚岩ではありません。
大きく 2 つに分けると、出力する側の AI と、読む・使う側の AI です。
出力者の AI はチャットで応答を生成したり、UI を返したりします。
一方、消費者の AI はコンテンツを読んで理解し、判断し、操作します。
この 2 つを分けて考えると、フロントエンドの変化がかなり整理しやすくなります。
今日はこの 2 つの視点で話します。
-->

---

<div class="hero">
  <div class="eyebrow">Part 1</div>
  <div class="huge">AI は Web の<br /><span class="accent">「出力者」</span>になった</div>
</div>

<!--
まずは出力者の AI です。
一番わかりやすい変化は、チャット型 UI の普及です。
ここでは、生成する UI をどう設計するかに注目します。
-->

---

## チャット型 UI の台頭

AI の普及により、チャット型の UI を設計する機会が増えた

- テキストの逐次生成（ストリーミング）
- マルチモーダルな入出力（画像・音声・コード）
- ツール呼び出しの結果表示

→ これまでの「確定したデータを表示する」UI とは性質が違う

<!--
ChatGPT や Claude のような UI を設計する機会が増えました。
ここで重要なのは、これまでの UI と性質が違うという点です。
従来は、確定したデータを表示する UI でした。
でも今は、生成中の状態を扱う UI になっています。
-->

---

## ストリーミング UI は何を変えたか

- 途中経過をどう見せるかの体験設計が必要になった
  - 一定間隔で文字を出すと機械的に見えるので、表示間隔にランダムな揺らぎを加える
  - 1 文字ずつ出すのではなく、単語や文節ごとにまとめて出すと自然に見える
  - フェードインしつつ出すと、パッと出現するよりも柔らかい印象になる
  - マークダウンを素朴にパースすると、途中経過が不完全な状態で表示されてしまう。`**太字` のような未完のマークアップをどう扱うかも工夫が必要

<!--
ここがかなり重要な変化です。
ストリーミング UI では、途中経過が主役になります。
単純に 1 文字ずつ出すと、すごく機械的に見えます。
なので実際には、単語単位で出したり、少しランダムな揺らぎを入れたりします。
フェードインさせるだけでも、かなり印象が変わります。
重要なのは、ローディングをどう見せるかではなく、生成中の体験をどう設計するかに変わったことです。
-->

---

## なぜテキストだけでは足りないのか

- チャットは説明には強いが、**比較・選択・確認** には向かない場面がある
- 選択肢が増えるほど、ユーザーは会話ログを読み返して判断しなければならない
- 金額・日程・候補差分のような情報は、並べて見せたほうが早く正確に判断できる

→ AI が流れを作っても、**人間の判断が必要な瞬間には UI が必要**

<!--
ここが MCP Apps に入る理由です。
チャットは説明には強いですが、比較や選択や確認には向かない場面があります。
チャットだけで全部やろうとすると、比較や確認のたびに人間の認知負荷が上がります。
だから会話の流れを壊さずに、必要な瞬間だけ UI を差し込める価値が出てきます。
-->

---

## MCP Apps の登場

- [MCP Apps](https://modelcontextprotocol.io/extensions/apps/overview) は、AI が**テキストだけでなくインタラクティブな UI** を返すための拡張
- チャットの中でインタラクティブな体験を提供
- テキスト応答の限界を超えた UI を AI が返す

AI プラットフォーム各社が「テキスト以上の UI」を志向している
→ フロントエンド技術の需要は増している

<!--
そこで出てきたのが MCP Apps です。
AI がテキストではなく、インタラクティブな UI を返す仕組みです。
チャットの中にダッシュボードやカードが出てきて、そのまま操作できる。
ここで重要なのは、UI が入口ではなく、必要な瞬間に差し込まれる部品になったことです。
-->

---

## MCP Apps の使用例

<div class="columns">

<div class="card">
  <div class="label">Visualize</div>
  <h3>情報を見せる</h3>

- ダッシュボード
- グラフ / チャート
- テーブル
- 地図やタイムライン

</div>

<div class="card">
  <div class="label">Decide</div>
  <h3>人間に選ばせる</h3>

- 商品比較カード
- 予約プランの選択
- 承認 / 確認 UI
- 候補の絞り込み

</div>

</div>

テキストだけでは判断しづらい場面で、会話の中でそのまま操作できる UI を差し込めるのが `MCP Apps` の強み

<!--
全部を UI にする必要はありません。
でも比較、選択、確認のように人間の判断を挟みたい場面では、テキストだけよりも UI の方がずっと伝わりやすいです。
ここが MCP Apps の実務的な価値です。
-->

---

## MCP Apps のコード例

まず `ui://` リソースを登録する

```ts
registerAppResource(
  server,
  "ui://dashboard",
  "Sales Dashboard",
  { mimeType: RESOURCE_MIME_TYPE },
  async () => ({
    contents: [
      /* built HTML */
    ],
  }),
);
```

<!--
実装イメージとしては、まず UI リソースを登録します。
ここでは HTML を 1 つの表示部品としてホストに渡しています。
ポイントは、ツール本体と UI を分けて扱うことです。
-->

---

## MCP Apps のコード例

そのうえで、ツール定義の `_meta.ui.resourceUri` からそのリソースを参照する

```ts
server.tool(
  "show_dashboard",
  {
    description: "売上ダッシュボードを表示",
    _meta: {
      ui: {
        resourceUri: "ui://dashboard",
        // 外部リソースの読み込み許可
        csp: { allowOrigins: ["https://cdn.example.com"] },
      },
    },
  },
  async (params) => {
    return { data: await fetchSalesData(params) };
  },
);
```

<!--
そのうえで、ツール側からどの UI を使うかを参照します。
つまり AI がツールを呼ぶと、結果に応じた UI が一緒に表示される構造です。
-->

---

## MCP Apps でインタラクションを実行する

- App はユーザー操作を受けて再度ツールを呼び出せる
- `app.callServerTool(...)` で商品を購入するツールを呼び出す例

```ts
import { App } from "@modelcontextprotocol/ext-apps";
const app = new App();

button.addEventListener("click", async () => {
  const response = await app.callServerTool({
    name: "purchase-product",
    arguments: {
      productId: "sku_123",
      quantity: 1,
    },
  });
  const message = response.content?.find((c) => c.type === "text")?.text;
  if (message) status.textContent = message;
});
```

<!--
このコードのポイントは、UI が受け身ではないことです。
商品カードの購入ボタンを押すと、その場で次のツール実行が始まり、結果が UI に反映されます。
つまり、会話の中に差し込まれた UI が、そのまま次の行動の起点になります。
-->

---

## 設計思想の変化

<div class="columns-3">

<div class="card">
  <div class="label">入口</div>
  <h3>従来</h3>
  <p class="fit">UI が操作の入口だった</p>
</div>

<div class="card">
  <div class="label">補助</div>
  <h3>いま</h3>
  <p class="fit">AI が流れを作り、UI は必要な瞬間に差し込まれる</p>
</div>

<div class="card">
  <div class="label">基盤</div>
  <h3>これから</h3>
  <p class="fit">Web は AI が呼び出す実行基盤にもなる</p>
</div>

</div>

UI が _"入口"_ から _"部品"_ へ — Web は **「AI が制御する実行基盤」** にもなる

しかし、インタラクションと実行体験を設計する
**フロントエンドエンジニアのやるべきことは変わらない**

<!--
ここまでをまとめます。
これまでは、UI がすべての入口でした。
でも今は違います。
AI が流れを作り、UI は必要なときだけ出てくる。
つまり UI は、主役から部品に変わりつつあります。
ただし、インタラクションを設計するという本質は変わっていません。
-->

---

<div class="hero">
  <div class="eyebrow">Part 2</div>
  <div class="huge">AI は Web の<br /><span class="accent">「消費者」</span>にもなった</div>
</div>

<!--
次に消費者の AI です。
こちらは、AI が Web を読む側、使う側に回った変化です。
ここからは情報の届け方と、操作のされ方の話をします。
-->

---

## クローラと AI エージェントの違い

Web には以前からクローラという「人間以外の消費者」がいた
しかし AI エージェントは振る舞いが違う

|      | クローラ         | AI エージェント            |
| ---- | ---------------- | -------------------------- |
| 目的 | インデックス作成 | タスク遂行                 |
| 行動 | 読み取り         | 読み取り + **判断 + 行動** |
| 理解 | 構造的           | **意味的**                 |
| 対話 | 一方向           | **双方向**                 |

→ AI は Web コンテンツを **理解し、判断し、行動する**

<!--
実は Web には昔から人間以外の消費者がいました。クローラです。
でも AI エージェントはこれとは全く違います。
クローラは読むだけですが、AI は違います。
読むだけでなく、理解して、判断して、行動します。
ここが決定的な違いです。
つまり、Web は使われるものになりました。
-->

---

## コンテキスト効率の良い配信が重視される

- AI にとっては、複雑な装飾付き HTML より **Markdown のほうが読みやすい** 場面が多い
- Web サイトが Markdown 版を返す動きが出てきた
- Cloudflare も [Markdown for agents](https://blog.cloudflare.com/ja-jp/markdown-for-agents/) を公開し、エージェント向けの配信を提案している

<!--
この変化で何が起きるか。
読みやすさの対象が、人間だけでなく AI にも広がります。
例えば Markdown は HTML よりシンプルで、意味構造が取りやすい。
これは SEO の延長というより、AI とのインターフェース設計だと捉えたほうが分かりやすいです。
-->

---

## WebMCP は Web アプリをツール化する

- [WebMCP](https://github.com/webmachinelearning/webmcp) は、Web アプリがブラウザ上で **AI から呼び出せるツール** を公開する仕組み
- AI はスクリーンショット解析やコードによる DOM 操作ではなく、**意味を持った関数** を通じて操作できる
- 前提は **human-in-the-loop**
- ただし、現時点では **提案段階の仕様** として捉えるのが適切

<!--
さらに面白い動きが WebMCP です。
これは何かというと、Web アプリを AI から呼び出せるツールにする仕組みです。
重要なのは、スクリーン操作ではないという点です。
DOM をいじるのではなく、意味を持った関数として操作します。
例えば「タスクを追加する」のような操作を直接呼び出せます。
-->

---

## WebMCP のコード例

- `window.navigator.modelContext.provideContext` でツールを提供する
- 例えば、Todo アプリが「タスクを追加する」ツールを提供するコード例

```js
window.navigator.modelContext.provideContext({
  tools: [
    {
      name: "add-todo",
      description: "Add a new todo item to the list",
      inputSchema: { type: "object", properties: { text: { type: "string" } } },
      execute: async ({ text }) => {
        addTask(text);
        return { content: [{ type: "text", text: `Added todo: ${text}` }] };
      },
    },
  ],
});
```

<!--
これは API を別途用意して AI だけに公開する発想と少し違います。
既存の Web アプリの文脈、状態、ユーザー操作の近くでツールを提供する、という点が肝です。
人間が見ている画面と近い場所で、AI にも意味のある操作を渡せるのが面白いところです。
-->

---

## 宣言的にツール化できる

- WebMCP ではフォームに属性を付けるだけでツール登録できる提案もある
- 既存の HTML 資産をそのまま活かしやすい
- 属性名や構文は **今後変わりうる**

```html
<form
  toolname="add-todo-item"
  tooldescription="Add a new todo item to the list"
>
  <input name="text" required />
  <button type="submit">Add Todo</button>
</form>
```

- これは「AI 用に別 UI を作る」のではなく、**同じ UI を人間にも AI にも開く** 発想

<!--
個人的にはここがすごく Web らしいと思っています。
特別な AI 専用インターフェースを増やすのではなく、HTML の意味やフォームの制約を再利用しているからです。
同じ UI を人間にも AI にも開くという発想です。
-->

---

## 従来の MCP ツールや API と何が違うのか

- 単に AI にツールを使わせるだけなら MCP ツールでいい
- それでも WebMCP が必要なのは、**人間と AI が同じインターフェース上で協業する**から
- 既に多くの企業が Web を通じてサービスを提供しており、既存の資産を再利用できるというメリットも大きい

<!--
API だけでいいのでは、と思うかもしれませんが違います。
違いは機能提供ではなく、体験共有にあります。
人間と AI が同じインターフェース上で協業することに意味があります。
これが Web らしいポイントです。
-->

---

## AI が消費する時代の説明責任

- AI が生成したコンテンツは、**誤情報や偏見を含む可能性がある**
- AI はコンテンツを大量に生成できるため、よく検証されていない情報が大量に投稿されるという問題も出てきた
- Web コンテンツの制作者として、AI の関与を明示することが求められている

<!--
AI が消費者になるだけでなく、生成者にもなる以上、説明責任の論点も出てきます。
誤情報や偏見を含む可能性があるし、大量生成によって未検証の情報も増えます。
なので、AI の関与をどう明示するかが実務上のテーマになります。
削るならここは短めに流せるパートです。
-->

---

## ai-disclosure 属性の提案

- AI の関与度を HTML で宣言
- ただし、これは **標準化済みの属性ではなく提案段階の explainer**
- 例えばニュースサイトでは、人間が書いた調査報道と AI 生成のサマリーが混在する可能性がある

```html
<article>
  <section ai-disclosure="none">
    <p>本誌の独自調査では...</p>
  </section>

  <aside ai-disclosure="ai-generated" ai-model="gpt-4o">
    <h3>AI要約</h3>
    <p>レポートの結論は...</p>
  </aside>
</article>
```

<!--
例えばこういう形で、どこが人間由来で、どこが AI 生成かを機械可読に示す案があります。
まだ提案段階ですが、こうした透明性の議論が始まっていること自体が重要です。
-->

---

<div class="hero">
  <div class="eyebrow">Conclusion</div>
  <div class="huge">「The Web is for everyone」の再解釈</div>
</div>

---

## everyone に AI が含まれた

> "The Web is for everyone"
> — Tim Berners-Lee

この理念は変わっていない
**「everyone」の範囲が拡張された**

スクリーンリーダーに情報を伝えたように、AI にも情報を届ける
→ アクセシビリティと同じ考え方

<!--
最後にまとめです。
The Web is for everyone という言葉があります。
この理念は変わっていません。
ただ、「everyone」の範囲が広がりました。
そこに AI が含まれるようになった。
スクリーンリーダーに情報を届けたように、AI にも情報を届ける。
これはアクセシビリティと同じ発想です。
-->

---

## 我々の役割は変わらない

<div class="statement">

すべての人（と AI）にWeb というインターフェースを介して**体験を届ける**

これまで培った**HTML・CSS・JavaScript の知識は無駄にならない**

</div>

- AI と人間が協業できるように Web が進化しているだけ

<!--
最後に一番伝えたいことです。
フロントエンドの相手は増えました。
でも、私たちの仕事の本質は変わっていません。
インタラクションを設計し、実行体験を作ること。
それはこれからも同じです。
UI はなくならないし、むしろ重要になります。
ただし、誰のために作るのかが広がっただけです。
-->

---

## まとめ

1. AI は Web の **出力者** になり、UI は入口から補助へ変わりつつある
2. AI は Web の **消費者** にもなり、Web アプリは人間向け UI と AI 向けツールの両方の顔を持つようになった
3. それでもフロントエンドの本質は、**インタラクションと実行体験を設計すること** のまま

<div class="center lead">
フロントエンドの相手は増えた。<br />
でも、私たちの仕事の核は変わっていない。
</div>

<!--
最後のまとめです。
1 つ目。AI は Web の出力者になり、UI は入口から補助へ変わりつつあります。
2 つ目。AI は Web の消費者にもなり、Web アプリは人間向け UI と AI 向けツールの両方の顔を持つようになりました。
3 つ目。それでもフロントエンドの本質は、インタラクションと実行体験を設計することのままです。
相手が変わったことを脅威として語るのではなく、設計対象が広がったこととして捉えるのが今日のメッセージです。
-->

---

## References

- MCP Apps: https://modelcontextprotocol.io/extensions/apps/overview
- Introducing apps in ChatGPT: https://openai.com/ja-JP/index/introducing-apps-in-chatgpt/
- AI Content Disclosure: https://github.com/dweekly/ai-content-disclosure
- Markdown for agents: https://blog.cloudflare.com/ja-jp/markdown-for-agents/
- WebMCP: https://github.com/webmachinelearning/webmcp
- azukiazusa.dev
  - https://azukiazusa.dev/blog/ai-interactive-ui-with-mcp-apps/
  - https://azukiazusa.dev/blog/webmcp-for-web-applications/

<!--
参考リンクです。
質疑応答で気になった方はここから辿れるようにしています。
発表中は読み上げず、そのまま次に進みます。
-->

---

<div class="hero">
  <div class="eyebrow">Thank You</div>
  <div class="huge">ご清聴ありがとうございました</div>
  <div class="lead">azukiazusa.dev</div>
</div>

<!--
ご清聴ありがとうございました。
フロントエンドの相手は増えた。
でも、やるべきことは変わっていない。
これが今日の結論です。
-->
