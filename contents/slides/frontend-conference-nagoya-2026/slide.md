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
    display: flex;
    justify-content: center;
    align-items: center;
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
  <div class="lead">人間と AI が協業する UI へ</div>
  <div class="mono muted">azukiazusa</div>
</div>

<!--
それでは、「フロントエンドの相手が変わった。AIが加わったWebの新しいインターフェース設計」というタイトルでお話しします。
今回の発表のテーマの一言でいうと、「人間と AI が協業する UI へ」です。
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
最近は特に、AI 周りの技術を扱っていることが多いです。
今日はその中で見えてきた変化を共有できればと思います。
-->

---

## あなたのフロントエンドの "相手" は誰ですか？

- 従来のフロントエンドの仕事は、**人間とシステムの間のインターフェース**を作ることだった
- ところが 2023 年以降、AI が Web のコンテンツを**読んで、生成して、操作する**ようになった
- つまり Web の相手に **AI が加わった**

<!--
最初に、1 つ問いです。
あなたのフロントエンドの相手は誰でしょうか。従来のフロントエンドの仕事は、人間とシステムの間のインターフェースを作ることでした。ですが今その前提が変わりつつあります。AI がコンテンツを読むし、AI が UI を生成するし、AI が操作もするようになっています。つまり、Web の相手に AI が加わったということです。
-->

---

## 2つの AI

<div class="columns">

<div class="card">
  <div class="label">Producer</div>
  <h3>出力者の AI</h3>

- チャットで応答を生成する
- ユーザーが理解・操作しやすいような UI を返す
- コンテンツを生成する

</div>

<div class="card">
  <div class="label">Consumer</div>
  <h3>消費者の AI</h3>

- 正確な応答を生成するために、Web の情報にアクセスする
- ユーザーのタスクを完了するために、Web アプリを操作する

</div>

</div>

<!--
今回の発表では、AI を大きく 2 つに分けて考えます。
大きく 2 つに分けると、出力者としての AI と、消費者としての AI です。
出力者の AI はチャットで応答を生成したり、ユーザーが理解しやすい UI を返したりします。時にはブログ記事のようなコンテンツを生成し、web ページを作ることもあるでしょう。
一方、消費者の AI は、正確な応答を生成するために Web の情報にアクセスしたり、ユーザーのタスクを完了するために Web アプリを操作したりします。

それぞれの視点からみた AI について、これから詳しく見ていきましょう。
-->

---

<div class="hero">
  <div class="eyebrow">Part 1</div>
  <div class="huge">AI は Web の<br /><span class="accent">「出力者」</span>になった</div>
</div>

<!--
まずは、AI は Web の「出力者」になった、という話からです。
-->

---

## チャット型 UI の台頭

<div class="columns">

<div>

AI の普及により、チャット型の UI を設計する機会が増えた

- ストリーミング処理が日常になった
- 待機状態の UX
- 入力フォームの設計（IME の確定で送信しない、など）

→ これまでの「リクエストを送って完成したレスポンスを受け取る」UI から「途中経過をリアルタイムに描画し続ける」UI へ

</div>

<div class="center">
  <img src="./images/chat-ui.png" alt="チャット型 UI の例" />
</div>

</div>

<!--
AI が普及したことで、チャット型の UI を設計する機会が増えたかと思います。ChatGPT, Claude, Gemini などどのプラットフォームも似たようなチャット型のインターフェースを提供していますよね。もしかしたら今発表を聞いている皆さんの中にも、チャット型の UI を作ったことがある人もいるかもしれません。
大きな変化は、ストリーミング処理が日常になったことです。これまではリクエストを送って、完成したレスポンスを受け取るという UI が一般的でしたが、LLM の応答は生成に時間がかかるため、途中経過をリアルタイムに描画し続ける UI へと変わってきています。とりわけチャット型の UI に限らずとも、ストリーミングを処理するという仕事が増えてきたのではないでしょうか。
-->

---

## ストリーミング UI は何を変えたか

- 途中経過をどう見せるかの体験設計が必要になった
  - 応答をそのまま出力すると機械的に見えるので、バッファリングしたり、表示のアニメーションをつけたりする工夫が必要
  - マークダウンを素朴にパースすると、不完全な構文で表示が崩れる恐れがある
  - 自動スクロールの挙動（ユーザーが過去のメッセージを読んでいるときは自動スクロールを止める、など）
  - アクセシビリティ上の観点（ストリーミングで逐次追加されるメッセージをスクリーンリーダーにどう伝えるか）

<!--
フロントエンドエンジニアにチャット型 UI の普及がどう影響を与えたかというと、途中経過をどう見せるかの体験設計が必要になったことが大きいと思います。ストリーミング UI をユーザー体験を保ったまま提供するのって結構難しいんですよね。

前提としてLLMの出力はトークン単位で届くのですが、トークンは必ずしも単語の単位を表すわけではないので、この不規則なデータをそのまま画面に反映すると、テキストがカクカクと塊で現れたり、間隔がばらついて不自然に見えたりします。そのため、ある程度バッファリングしてから表示したり、表示のアニメーションでフェードインして柔らかく見せるなど、工夫が必要になります。

また、マークダウンを素朴にパースして表示しようとすると、不完全な構文のせいで表示が崩れる恐れがあります。例えば、コードブロックの開始トークンだけが届いている状態だと、以降のテキストがすべてコードブロックの中に入ってしまうなどです。これを防ぐためには、ブロックレベルのマークダウンが完全に届いてからパースして表示するなどの工夫が必要になります。

さらに、ユーザーが過去のメッセージを読んでいるときに新しいメッセージが届いても自動スクロールしないようにするなど、細かい挙動の設計も必要になります。加えて、ストリーミングで逐次追加されるメッセージをスクリーンリーダーにどう伝えるかなど、アクセシビリティ上の観点も考慮する必要があります。

こう整理してみると、何気なく使っているサービスが実はかなり細かい工夫の上に成り立っていることがわかりますね。
-->

---

## さらに MCP Apps へ

<!--
チャット型の UI はさらに進化していて、MCP Apps という仕組みも出てきています。
 -->

---

## MCP Apps の登場

<div class="columns">

<div>

- [MCP Apps](https://modelcontextprotocol.io/extensions/apps/overview) は、AI が**テキストだけでなくインタラクティブな UI** 会話の中で返せるようにする仕組み
- 右の例では、ホテルの一覧がチャットの中にカード形式で表示されていて、そのまま予約の操作もできる
- ポイントは、UI が入口ではなく、必要な瞬間に差し込まれる部品になったこと

</div>

<div class="center">
  <img src="./images/mcp-apps.png" alt="MCP Apps のイメージ" />
</div>

</div>

<!--
MCP Apps は、AI がテキストだけでなくインタラクティブな UI を会話の中で返せるようにする仕組みです。右の例では、ホテルの一覧がチャットの中にカード形式で表示されていて、そのまま予約の操作もできるようになっています。

MCP Apps のポイントは、UI が入口ではなく、必要な瞬間に差し込まれる部品になったことです。
-->

---

## なぜテキストだけでは足りないのか

- チャットは説明には強いが、比較や選択や確認には向かない場面がある
- テキストのチャットは一方向の情報伝達であった
- 会話から離れずに操作する体験が求められている

→ 人間の判断や操作が必要な場合、テキストだけで全部やろうとすると認知負荷が上がる。会話の中に差し込まれた UI が、そのまま次の行動の起点になる体験が求められている

<!--
ここが MCP Apps に入る理由です。
チャットは説明には強いですが、比較や選択や確認には向かない場面があります。単にデータを眺めるよりも、グラフで推移を眺めたほうがわかりやすいのは一目瞭然ですよね。チャットだけで全部やろうとすると、比較や確認のたびに人間の認知負荷が上がります。

また、テキストのチャットは一方向の情報伝達であったのに対して、MCP Apps では会話から離れずに操作する体験が求められています。会話している場から離れずに、コンテキストを保ったまま操作できる UI を差し込めるのが MCP Apps の強みです。
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
コード例を交えて MCP Apps の実装のイメージを掴んでみましょう。
まず、MCP Apps で UI を返すためには、UI のリソースを登録する必要があります。上のコードはその例です。 `registerAppResource` で `ui://dashboard` というリソースを登録しています。これが MCP Apps の UI を表すリソースになります。
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
    // ツールのレスポンスは UI に渡されるので、UI 上でデータを表示できる
    return { data: await fetchSalesData(params) };
  },
);
```

<!--
そのうえで、ツール側からどの UI を使うかを参照します。ツール定義の `_meta.ui.resourceUri` から先ほど登録した `ui://dashboard` を参照していますね。これで、AI がこのツールを呼び出すと、クライアントが MCP Apps に対応していればレスポンスに `ui://dashboard` の UI が差し込まれることになります。

ツールのレスポンスで返したデータは UI に渡されるので、UI 上でデータを表示することもできます。
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
さらに UI の中でユーザー操作を受けて再度ツールを呼び出すこともできます。上のコードは、ボタンがクリックされたときに `purchase-product` というツールを呼び出す例です。これによって、ユーザーがチャットの中で UI を操作して、そのまま次の行動の起点になる体験が実現できます。
-->

---

## 設計思想の変化

- UI は入口ではなく、必要な瞬間に差し込まれる部品になる
  - チャットの中でデザインを統一しつつ、破綻しないような UI を提供する必要がある
- 人間の判断が必要な瞬間には UI が必要
- **人間と AI の協業を前提とした UI 設計** が重要になる

<!--
Mcp Apps の登場は、UI の設計思想にどのような変化をもたらすでしょうか。
まず、UI は入口ではなく、必要な瞬間に差し込まれる部品になるということです。これまでは、ユーザーが最初にアクセスする入り口としての UI を設計することが多かったと思いますが、MCP Apps ではチャットの中でデザインを統一しつつ、破綻しないような UI を提供する必要があります。
さらに、人間の判断が必要な瞬間には UI が必要になるという思想は、これから人間と AI の協業を前提とした UI 設計が重要になることを示しています。
 -->

---

## ホストごとにテーマが違う、でも統一できる

MCP Apps は**標準化された CSS カスタムプロパティ**を用意している

```css
/* 仕様が定める CSS 変数をそのまま使う */
.card {
  background: var(--mcp-color-surface);
  color: var(--mcp-color-text);
  border: 1px solid var(--mcp-color-border);
  font-family: var(--mcp-font-family-sans);
}
```

- ホストが light / dark / ブランドごとの値を注入する
- App 側は変数を参照するだけで、ChatGPT でも Claude でも「その場に馴染む」UI になる
- 仕様は意図的に**色・タイポグラフィ・境界線に限定**し、spacing は含めない
  → spacing までホスト任せにするとレイアウトが破綻するため

<!--
これは MCP Apps の仕様書で私が一番面白いと思った設計判断なのですが、UI が会話の中に自然に馴染むために、標準化された CSS カスタムプロパティが用意されています。ホストは自分の light / dark / ブランドカラーをこの変数に流し込み、App 側は変数を参照するだけでテーマが統一されます。さらに面白いのは、spacing、つまり余白の変数は意図的に含められていないことです。余白までホストごとに変えられるとレイアウトが破綻するから、というのが理由で、設計としてどこまでホストに委ねてどこは App 側で固定するか、という線引きがよく考えられていると思います。
-->

---

## サンドボックスの制約

MCP Apps は**二重 iframe** で動く

- 外側: ホストが信頼する固定ドメインのサンドボックスプロキシ
- 内側: App の HTML (異なるオリジン)
- 通信は `postMessage` 経由の JSON-RPC に限定される

App 側が意識すべき制約

- `localStorage` などホストの cookie / ストレージにはアクセス不可
- ファイルダウンロードは `ui/download-file` 経由でホストに依頼
- 外部リソース読み込みは `_meta.ui.csp` で明示した origin のみ
- テーマ変更や表示モード変更は `ui/host-context-change` 通知で受け取る

<!--
セキュリティモデルも興味深くて、MCP Apps は二重 iframe 構造で動いています。ホスト側が固定ドメインのサンドボックスプロキシを用意して、その中に App の HTML を埋め込む、という形ですね。これは CSP の制約の中で任意の第三者 App を安全に動かすための苦肉の策でもあり、同時に強い隔離を保証する仕組みでもあります。App 開発者は、普段使っている localStorage や直接のファイルダウンロードが使えないことを意識する必要があります。ファイルを保存したいときはホストに依頼する専用の API を使います。つまり、普通の Web アプリを書くのとは少し違う作法が求められる。とはいえこれは、会話の中にサードパーティの UI を埋め込むための当然の代償だとも言えます。
 -->

---

## Agent が UI を返す方法は MCP Apps だけではない

MCP Apps は **HTML を iframe に埋め込む** アプローチ
→ ホスト側のサンドボックス前提で表現力を確保している

一方で、**「宣言的な JSON を返す」** という別解もある

- AI は HTML ではなく、コンポーネント spec の JSON を生成する
- ホスト側がそれを **ネイティブ部品** として描画する

代表的な提案として、**json-render** (Vercel Labs) と **A2UI** (Google) を見ていく

<!--
ここまで MCP Apps の話をしてきましたが、Agent が UI を返す方法は MCP Apps だけではありません。MCP Apps が HTML を iframe に埋め込む路線なのに対して、AI には宣言的な JSON だけを返してもらって、ホスト側がそれをネイティブのコンポーネントとして描画する、というアプローチが並行して提案されています。代表的なものに、Vercel Labs の json-render と Google の A2UI があります。順に紹介していきます。
-->

---

## json-render — Vercel Labs

- AI は **HTML ではなく構造化された JSON** を返す
- 開発者が定義した **コンポーネントカタログ** にあるものだけを使える
- 出力はホスト側で React / Vue / Svelte などのネイティブ部品にマップされる

3 ステップの仕組み

1. 開発者が **カタログ** (Zod スキーマ) を定義
2. AI が **カタログ準拠の JSON** をストリーミング生成
3. クライアントが **React コンポーネント** として描画

→ "guardrails through constraints"。AI は決められた部品しか出力できない

<!--
まず json-render です。Vercel Labs が公開しているフレームワークで、AI に HTML ではなく JSON を返させる路線を取っています。ポイントは、開発者があらかじめコンポーネントのカタログを Zod で定義して、AI はそのカタログにあるものしか使えないようにすることです。AI が出した JSON はホスト側で React や Vue のネイティブ部品として描画されます。
guardrails through constraints と表現されているのですが、AI に自由に HTML を出させるのではなく、決められた部品の組み合わせだけを許す、という設計思想ですね。
-->

---

## json-render のコード例

カタログを Zod で定義する

```ts
export const catalog = defineCatalog(schema, {
  components: {
    Card:   { props: z.object({ title: z.string() }), slots: ["default"] },
    Metric: { props: z.object({ label: z.string(), value: z.string() }) },
  },
});
```

AI が生成する JSON はカタログに完全に拘束される

```json
{
  "root": "card-1",
  "elements": {
    "card-1": { "type": "Card",   "props": { "title": "Revenue" }, "children": ["m1"] },
    "m1":     { "type": "Metric", "props": { "label": "Total", "value": "$48,200" } }
  }
}
```

<!--
コード例を見てみましょう。上が開発者が定義するカタログです。Card と Metric というコンポーネントを Zod スキーマ付きで登録しています。
下が AI が実際に生成する JSON です。AI は Card や Metric を使った構造を返してきますが、カタログにない型は出せませんし、props のスキーマもバリデーションされます。仮に AI がハルシネーションしても、未定義のコンポーネントや不正な props は弾かれる、という安全網が機能します。
-->

---

## A2UI — Google

- 同じく **JSON でコンポーネントを宣言** するプロトコル
- 大きな違いは **フレームワーク非依存**
  - 同じ Agent レスポンスが React / Angular / **Flutter** / ネイティブで描画される
- LLM が **インクリメンタルに生成しやすい** フラットな構造
  - 完成 JSON を待たずにストリーミング描画できる
- A2A プロトコルをトランスポートとして利用できる

→ "How can AI agents safely send rich UIs across trust boundaries?" への解として提案されている

<!--
次に A2UI です。Google が公開しているプロトコルで、こちらも JSON でコンポーネントを宣言する路線です。json-render と違うのは、フレームワーク非依存を強く打ち出している点です。同じ Agent のレスポンスが React、Angular、Flutter、ネイティブモバイルでも同じように描画されます。
もう一つの特徴は、LLM がインクリメンタルに生成しやすいよう、フラットな構造になっていることです。完成した JSON を待つ必要がなくて、断片が届くたびに UI を更新できます。
ちなみに A2UI は MCP に依存しているわけではなくて、A2A プロトコルをトランスポートに使えるなど、独立した立ち位置を取っています。
-->

---

## A2UI のメッセージ例 (v0.9 draft)

Agent はフラットな JSON で UI を記述する

```json
{ "id": "header", "component": "Text",      "text": "# Book Your Table" }
{ "id": "date",   "component": "TextField", "label": "Date" }
{ "id": "submit", "component": "Button",    "label": "Reserve",
  "action": { "type": "submit", "target": "/reservation" } }
```

データはパス指定で別メッセージとして注入する

```json
{ "path": "/reservation",
  "value": { "date": "2025-12-15", "time": "19:00", "guests": 2 } }
```

ID 参照のフラット構造 → ストリーミングで部分更新が容易

<!--
A2UI のメッセージ例です。コンポーネントは ID を持ったフラットなレコードの並びで届きます。上の例では、Text のヘッダ、TextField の日付欄、Button の送信ボタンが、それぞれ独立したメッセージとして送られてきます。
データは UI の構造とは別に、パス指定で注入されます。これによって UI の構造とデータが疎結合になり、Agent はデータだけ部分更新することもできます。
ID 参照のフラット構造になっているおかげで、ストリーミングで届いた断片だけで UI を組み立てたり、後から差分だけ更新したりできるのが、A2UI が LLM フレンドリーと言われる理由です。
-->

---

## Agent が UI を返す 3 つのアプローチ

<div class="fit">

|             | MCP Apps           | json-render             | A2UI                          |
| ----------- | ------------------ | ----------------------- | ----------------------------- |
| 返すもの    | **HTML** リソース  | JSON spec               | JSON spec                     |
| 描画方式    | 二重 iframe        | ネイティブ React など   | 複数 FW (React / Flutter / …) |
| 安全性      | サンドボックス分離 | **カタログ制約**        | 宣言的・コード実行なし        |
| 強み        | 表現力・既存資産   | React エコシステム親和  | プラットフォーム横断          |

</div>

共通する設計思想

- **事前定義された部品カタログ** から AI に選ばせる (任意 UI を作らせない)
- **ストリーミング前提** でプログレッシブに描画する
- **人間と AI が同じ UI を共有** して協業する

<!--
3 つを並べて比べると、MCP Apps が HTML と iframe による表現力重視のアプローチであるのに対して、json-render と A2UI は JSON とカタログによる制約と安全性、そしてフレームワーク独立性を取っていることがわかります。
ただ重要なのは、これらは競合関係というよりは、自社のサービスをどの粒度で AI に開放したいか、で選ぶ選択肢が増えてきた、ということです。
そして 3 つに共通する設計思想があります。事前に定義された部品カタログから AI に選ばせる、ストリーミング前提でプログレッシブに描画する、そして人間と AI が同じ UI を共有して協業する、この 3 点です。Agent が UI を返す世界全体が、同じ方向に収束しつつあるとも言えるでしょう。
-->

---

<div class="hero">
  <div class="small">よく見られる言説</div>
  <div class="quote">
    UI は AI が全部作ってくれるから、フロントエンドエンジニアはもういらない。バックエンドエンジニアを目指そう。
  </div>
</div>

<!--
ところで、AI が普及してから、上のような言説を見かけることが増えたと思います。
AI が UI を全部作ってくれるから、フロントエンドエンジニアはもういらない。バックエンドエンジニアを目指そう、みたいなやつですね。

 -->

---

## AI が登場したことで考えるべきことが増えている

- ストリーミング UI のユーザー体験設計/MCP Apps の UI 設計など
- AI は技術的に UI を生成できるが、体験設計は依然として人間が担う領域
  - 人間と AI のブラウザの操作の仕方は大きく異なる
- フロントエンドは<span class="accent">ユーザー体験</span>を形作る役割がある

<!--
AI の登場によってコード生成の敷居が下がったのは事実ですが、その一方で AI の登場により考えるべきことが増えているのも事実です。ストリーミング UI のユーザー体験設計や MCP Apps の UI 設計など、AI が登場する前にはなかった設計課題が出てきています。AI は技術的に UI を生成できるようになりましたが、体験設計は依然として人間が担う領域です。特に、人間と AI のブラウザの操作の仕方は大きく異なるため、AI が生成した UI をそのままユーザーに提供すればいいというわけではありません。フロントエンドはユーザー体験を形作る役割があるため、我々にはAI が生成した UI をユーザーにとって使いやすい体験にする責任があると思います。
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

|                                | クローラ                                   | AI エージェント                                          |
| ------------------------------ | ------------------------------------------ | -------------------------------------------------------- |
| 目的                           | インデックス作成                           | タスク遂行                                               |
| 行動                           | 読み取り                                   | 読み取り + 操作                                          |
| 理解                           | 構造的（DOM をパースしてコンテンツを抽出） | 意味的（レンダリングされた内容を理解して判断）           |
| コンテンツの冗長性が与える影響 | 小さい                                     | 大きい（コンテキストウィンドウを圧迫すると性能が落ちる） |

→ AI は Web コンテンツを **理解し、判断し、行動する**

<!--
実は Web には昔から人間以外の消費者がいました。クローラです。
ですがクローラはあくまでインデックス作成が目的で、DOM をパースして構造的にコンテンツを抽出することに特化していました。一方、AI エージェントはタスク遂行が目的で、レンダリングされた内容を意味的に理解して判断し、さらに操作もするという点で大きく異なります。
特に、AI はコンテキストウィンドウの制約の中で情報を処理するため、コンテンツの冗長性が性能に大きく影響します。
-->

---

## AI が Web を読むための工夫が必要に

- コンテンツの意味を理解する → セマンティック HTML の重要性
  - これは今までと変わらない
- コンテキストウィンドウを圧迫しない → 単に情報が欲しいだけであれば、装飾のための構造はノイズになる

<!--
我々に与える影響という観点で言えば、AI が Web を読むための工夫が必要になったことが大きいと思います。
AI が web を操作しようとするとき、まずはコンテンツを理解する必要があります。そのためには、セマンティック HTML を書いて意味構造を明確にすることが重要になります。
さらに、AI はコンテキストウィンドウの制約の中で情報を処理するため、単に情報が欲しいだけであれば、装飾のための構造はノイズになります。つまり、AI にとっては、意味を伝えるための構造と、装飾のための構造を分けて考える必要が出てきます。
 -->

---

## コンテキスト効率の良い配信が重視される

- AI にとっては、複雑な装飾付き HTML より **Markdown のほうが読みやすい** 場面が多い
- Web サイトが Markdown 版を返す動きが出てきた
- Cloudflare も [Markdown for agents](https://blog.cloudflare.com/ja-jp/markdown-for-agents/) を公開し、エージェント向けの配信を提案している
  - `Accept: text/markdown` ヘッダを送ると、AI にとってコンテキスト効率の良い Markdown 版が返る

  <!--
  AI が情報を取得するための工夫の一例が、コンテキスト効率の良い配信です。
  AI にとっては、複雑な装飾付き HTML より Markdown のほうが読みやすい場面が多いです。
  そのため、Web サイトが Markdown 版を返す動きが出てきています。
  Cloudflare も Markdown for agents を公開し、エージェント向けの配信を提案しています。
  -->

---

## llms.txt という慣習

Web サイトが AI 向けに「読むべき場所」を案内する Markdown ファイル

- サイトのルートに `/llms.txt` (目次) と `/llms-full.txt` (全文) を置く
- 採用が進む開発者向けドキュメント
  - Anthropic / Vercel / Cloudflare / Stripe / Cursor / Supabase

<!--
実例として面白いのが llms.txt という慣習です。これは Web サイトのルートに置く Markdown ファイルで、AI エージェントに対して「うちのサイトはここから読むのが効率的ですよ」と案内するものです。Anthropic、Vercel、Cloudflare、Stripe、Cursor といった開発者向けプラットフォームが次々と採用しています。
 -->

---

<div class="hero">
  <div class="quote">AI がコンテンツを効率よく理解するための工夫は早期から行われていたが、操作のためのインターフェースはまだ発展途上</div>
</div>

<!--
このように、AI がコンテンツを効率よく理解するための工夫は早期から行われていましたが、操作のためのインターフェースはまだ発展途上です。
 -->

---

<div class="hero">
  <div class="huge">WebMCP の提案</div>
</div>

<!--
AI が Web を操作するためのインターフェースの発展途上の中で、面白い動きが WebMCP です。
 -->

---

## WebMCP は Web アプリをツール化する

- [WebMCP](https://github.com/webmachinelearning/webmcp) は、Web アプリがブラウザ上で **AI から呼び出せるツール** を公開する仕組み
- AI はスクリーンショット解析やコードによる DOM 操作ではなく、**意味を持った関数** を通じて操作できる
  - 余分なコンテキストを与えず、AI にとって必要な情報だけを渡すことができる
- 前提は **human-in-the-loop**

<!--
WebMCP を端的に説明すると、Web アプリがブラウザ上で AI から呼び出せるツールを公開する仕組みです。
AI にスクリーンショット解析やコードによる DOM 操作を行わせるのではなく、意味を持った関数を通じて操作できるようにすることが WebMCP のポイントです。AI が操作するために余分なコンテキストを与えず、AI にとって必要な情報だけを渡すことができる点が利点と言えるでしょう。
さらに、WebMCP の前提は human-in-the-loop であることも重要です。AI が完全に自律的に動くのではなく、人間と協業することを前提とした設計になっています。
-->

---

<div class="hero">
  <div class="huge">WebMCP を動かしてみる</div>
</div>

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
簡単にコード例を見てみましょう。
WebMCP では、`window.navigator.modelContext.provideContext` でツールを提供します。例えば、Todo アプリが「タスクを追加する」ツールを提供するコード例は上のようになります。
-->

---

## 宣言的にツール化できる

- WebMCP ではフォームに属性を付けるだけでツール登録できる提案もある
- AI ツールを呼び出すとフォームに自動で値が入力される

```html
<form
  toolname="add-todo-item"
  tooldescription="Add a new todo item to the list"
>
  <input name="text" required />
  <button type="submit">Add Todo</button>
</form>
```

<!--
もしくは、WebMCP ではフォームに属性を付けるだけでツール登録できる提案もあります。上のコードはその例です。
AI が宣言的な方法で公開されたツールを呼び出すと、フォームに自動で値が入力されるようになります。
-->

---

## WebMCP を設計するときの論点

**どのツールを公開するか**

- ダッシュボードで提供されている機能
  - ユーザーはダッシュボードの UI に慣れている
  - ブラウザに既にあるセッション Cookie / SSO の恩恵をそのまま利用できる
  - 複雑化するインターフェースを AI と共に操作することに価値がある
- 人間が判断すべき操作 (購入確定、削除) → ツール化しつつ **human-in-the-loop** を挟む
  - フォームに値を自動入力して**人間が送信ボタンを押す**設計は自然に機能する

<!--

WebMCP を実際に導入しようとすると、いくつか設計判断が必要になります。まず、どのツールを公開するかという線引き。例えば SasS のダッシュボードであれば、ユーザーはダッシュボードの UI に慣れているので、ダッシュボードで提供されている機能をツール化して AI と共に操作することに価値があるでしょう。一方、購入確定や削除のような人間が判断すべき操作も、ツール化はしつつ、human-in-the-loop を前提にすべきです。逆に、フラットに全機能を公開するのはアンチパターンで、コンテキストを食い潰して性能が落ちるだけでなく、セキュリティ上も問題になります。
私が一番綺麗だと思う設計は、フォームに AI が値を自動入力して、人間が送信ボタンを押すという流れです。AI が下ごしらえをして、人間が最終判断をする、という役割分担が自然にできる。これが「人間と AI の協業」の具体像だと思います。
 -->

---

## 従来の MCP ツールや API と何が違うのか

- 単に AI にツールを使わせるだけなら MCP ツールでいい
- それでも WebMCP が必要なのは、**人間と AI が同じインターフェース上で協業する**から
- 既に多くの企業が Web を通じてサービスを提供しており、既存の資産を再利用できるというメリットも大きい

<!--
webMCP は従来の MCP ツールや API と何が違うのでしょうか？単に AI に外部サービスを操作させたいならば、従来の MCP ツールで十分です。ですが、WebMCP が必要なのは、人間と AI が同じインターフェース上で協業するからです。フォームの例でぇあ、AI がフォームに値を入力して、その値を人間が確認したうえで送信するという流れが自然にできます。普段使っている Web アプリのインターフェースをそのまま AI と共有できるのは大きなメリットです。

さらに、既に多くの企業が Web を通じてサービスを提供しており、既存の資産を再利用できるというメリットも大きいでしょう。
-->

---

## AI 向け対応とアクセシビリティは地続き

- セマンティック HTML は、スクリーンリーダーと AI エージェントの**両方**に意味構造を伝える
- WebMCP の仕様書でも「much of the challenges faced by assistive technologies also apply to AI agents」と明記されている
- 「補助技術のためのインターフェース」を考えるスキルセットが、そのまま「AI のためのインターフェース」に転用できる

→ 新しいスキルが必要なのではなく、**これまで軽視されがちだったスキルが中心に戻ってきた**

<!--
実は WebMCP のドキュメントにも書かれているのですが、補助技術 (スクリーンリーダーなど) が直面してきた課題と、AI エージェントが直面している課題は非常に似通っています。人間向け UI を前提とした Web を、視覚情報なしで理解し、操作するという点で、本質的に同じ問題を解いているんですね。つまり、AI 対応のために新しいスキルが必要になったというよりは、これまで軽視されがちだったアクセシビリティのスキルが、中心に戻ってきたと捉えることができます。
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
-->

---

## AI が出力者になった、ということは

これまで Web の発信者は「書いた人」が明確だった

- AI はテキスト・画像・コード・UI をすべて生成できる
- 生成速度は人間の比ではなく、検証されないまま流通する
- 読者は「これは誰が作ったのか」を判断する手がかりを失いつつある

→ **出力者が増えた以上、発信側には「誰が/何が作ったか」を明示する責任が生まれる**

<!--
少し話を広げると、AI が Web の出力者になったということは、発信側の責任も変わってきます。これまでは Web のコンテンツは人間が書いたものだと暗黙に前提されていました。でも AI がテキスト・画像・コード・UI の全部を生成できる今、しかも人間の比ではない速度で流通する今、読者はそれが誰によって作られたのかを判断する手がかりを失いつつあります。つまり、AI を使う側には「これは誰が、何が作ったものか」を明示する責任が生まれている、ということです。
 -->

---

## ai-disclosure 属性の提案

- AI の関与度を HTML で宣言
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

<!--
最後にこの発表の結論です。web の相手に AI が加わったという事実は、The Web is for everyone という理念の再解釈として捉えることができます。
 -->

---

## everyone に AI が含まれた

> "The Web is for everyone"
> — Tim Berners-Lee

この理念は変わっていない
**「everyone」の範囲が拡張された**

スクリーンリーダーに情報を伝えたように、AI にも情報を届け、参加できるようにする
→ アクセシビリティと同じ考え方

<!--
The Web is for everyone という言葉があります。これは Web の創始者である Tim Berners-Lee が提唱した理念で、Web はすべての人のためのものであるという意味です。

AI が Web の相手に加わった今、この理念は変わっていませんが、「everyone」の範囲が拡張されたと言えます。これまではスクリーンリーダーに情報を伝えることがアクセシビリティの観点から重要でしたが、これからは AI にも情報を届けることが同様に重要になります。つまり、AI を含めたすべての存在にとって Web がアクセス可能であることが求められるようになったということです。
-->

---

## 人間と AI、どちらの体験が先か

- AI に最適化すると、人間にとって使いにくい UI になることがある
- 人間に最適化すると、AI にとって冗長になる (装飾 HTML、画像に埋め込まれたテキスト)
- どちらかを選ぶのではなく、**両方に届く設計** を考える

→ 「人間向け UI」「AI 向けインターフェース」の**両方の顔**を持つ Web アプリへ

<!--
もう一つ考えたいのが、人間と AI のどちらの体験を優先するか、という話です。AI に最適化しすぎると人間にとって使いにくくなるし、逆も然りです。なので、両方に届く設計を考える必要があります。意味は HTML で、装飾は CSS で、重い情報は別ルートで、重要な操作は AI 向けツールとしても公開する。こういう多層的な設計ができるのが、これからのフロントエンドエンジニアだと思っています。


 -->

---

## 我々の役割は変わらない

<div class="statement">

すべての人（と AI）にWeb というインターフェースを介して
**体験を届ける**

これまで培った**HTML・CSS・JavaScript の知識は**
**無駄にならない**

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
3. それでもフロントエンドエンジニアの役割は変わらない。ユーザー体験を形作ることが重要で、AI と人間の両方を考慮した設計が求められるようになった

<!--
最後のまとめです。
1 つ目。AI は Web の出力者になり、UI は入口から補助へ変わりつつあります。
2 つ目。AI は Web の消費者にもなり、Web アプリは人間向け UI と AI 向けツールの両方の顔を持つようになりました。
-->

---

## References

- MCP Apps: https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx
- MCP Apps: Extending servers with interactive user interfaces: https://blog.modelcontextprotocol.io/posts/2025-11-21-mcp-apps/
- AI Content Disclosure: https://github.com/dweekly/ai-content-disclosure
- Markdown for agents: https://blog.cloudflare.com/ja-jp/markdown-for-agents/
- WebMCP: https://github.com/webmachinelearning/webmcp
- json-render: https://json-render.dev/
- A2UI: https://a2ui.org/

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
