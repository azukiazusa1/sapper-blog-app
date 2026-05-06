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
今回の発表では、Web の相手としての AI を、出力者の AI と消費者の AI の 2 つの視点から見ていきたいと思います。
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
大きな変化は、ストリーミング処理が日常になったことです。これまではリクエストを送って、完成したレスポンスを受け取るという UI が一般的でしたが、LLM の応答は生成に時間がかかるため、途中経過をリアルタイムに描画し続ける UI へと変わってきています。その他我々日本語話者の観点でもっぱら増えてきた話題といえば、IME を確定するために Enter キーを押したら途中で送信されてしまった、というような入力フォームの設計の話などもありますね。
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

また、マークダウンを素朴にパースして表示しようとすると、不完全な構文のせいで表示が崩れる恐れがあります。これを防ぐためには、ブロックレベルのマークダウンが完全に届いてからパースして表示するなどの工夫が必要になります。

他にも自動スクロールの挙動という観点があります。最新のメッセージが届いたときは自動で下までスクロールしてそのコンテンツを表示させるという体験が必要ですが、ユーザーが過去のメッセージを読んでいるときに勝手にスクロールしてしまうと煩わしい体験になってしまいます。
加えて、ストリーミングで逐次追加されるメッセージをスクリーンリーダーにどう伝えるかなど、アクセシビリティ上の観点も考慮する必要があります。

こう整理してみると、何気なく使っているサービスが実はかなり細かい工夫の上に成り立っていることがわかりますね。
-->

---

## Generative UI という潮流

- AI が会話の中で*テキスト*ではなく*UI*を返す設計
- チャット応答が「読むもの」から「操作するもの」へ
- 実装は一つではない — **MCP Apps / A2UI** など複数の規格が並行
- まずは Anthropic が提案した **MCP Apps** から見ていく

<!--
チャット型 UI はさらに進化していて、AI がテキストだけでなく操作可能な UI そのものを返す世界、いわゆる Generative UI と呼ばれる潮流が広がってきました。AI の応答が「読むもの」から「操作するもの」に変わってきている、と言い換えてもいいかもしれません。
実装方法は一つではなく、MCP Apps、A2UI など複数の規格が並行して提案されています。まずは MCP Apps から見ていきましょう。
 -->

---

## MCP Apps の登場

<div class="columns">

<div>

- [MCP Apps](https://modelcontextprotocol.io/extensions/apps/overview) は、AI が**テキストだけでなくインタラクティブな UI** 会話の中で返せるようにする仕組み
- 右の例では、ホテルの一覧がチャットの中にカード形式で表示されていて、そのまま予約の操作もできる
- ポイントは、UI が入口ではなく、必要な瞬間に差し込まれる部品になったことと、チャット画面でそのまま操作できる体験が提供されること
</div>

<div class="center">
  <img src="./images/mcp-apps.png" alt="MCP Apps のイメージ" />
</div>

</div>

<!--
MCP Apps は、AI がテキストだけでなくインタラクティブな UI を会話の中で返せるようにする仕組みです。右の例では、「名古屋のホテルを探して」というユーザーの質問に対して、ホテルの一覧がチャットの中にカード形式で表示されています。そのまま予約の操作もできるようになっています。

MCP Apps のポイントは、UI が入口ではなく、必要な瞬間に差し込まれる部品になったことと、チャット画面でそのまま操作できる体験が提供されることです。
-->

---

## なぜテキストだけでは足りないのか

- チャットは説明には強いが、比較や選択や確認には向かない場面がある
  - 単にデータを眺めるよりも、グラフで推移を眺めたほうがわかりやすいことは一目瞭然
- テキストのチャットは一方向の情報伝達であった
  - MCP Apps ではユーザーのクリックや入力などの操作を受け付ける双方向のインターフェースが提供される
- 会話から離れずに操作する体験が求められている
  - コンテキストを保ったまま操作できる UI を差し込めるのが MCP Apps の強み

<!--
なぜ Generative UI が求められるようになったのでしょうか。

チャットは説明には強いですが、比較や選択や確認には向かない場面があります。単にデータを眺めるよりも、グラフで推移を眺めたほうがわかりやすいのは一目瞭然ですよね。チャットだけで全部やろうとすると、比較や確認のたびに人間の認知負荷が上がります。

また、テキストのチャットは一方向の情報伝達であったのに対して、MCP Apps ではユーザーのクリックや入力などの操作を受け付ける双方向のインターフェースが提供されます。会話している場から離れずに、コンテキストを保ったまま操作できる UI を差し込めるのが MCP Apps の強みです。
-->

---

## MCP Apps のコード例

まず `ui://` から始まる URI でリソースを登録する

```ts
registerAppResource(
  server,
  "ui://dashboard",
  "Sales Dashboard",
  {
    mimeType: RESOURCE_MIME_TYPE,
    _meta: {
      ui: {
        csp: {
          resourceDomains: ["https://cdn.example.com"],
          connectDomains: ["https://api.example.com"],
        },
      },
    },
  },
  async () => ({
    contents: [
      /* built HTML */
    ],
  }),
);
```

<!--
コード例を交えて MCP Apps の実装のイメージを掴んでみましょう。
まず、MCP Apps で UI を返すためには、UI のリソースを登録する必要があります。 ここでは　`registerAppResource` で `ui://dashboard` というリソースを登録しています。
外部リソースや API へのアクセスが必要な場合は、UI リソース側の `_meta.ui.csp` で `resourceDomains` や `connectDomains` を明示します。
-->

---

## MCP Apps のコード例

ツール定義の `_meta.ui.resourceUri` からそのリソースを参照する

```ts
server.tool(
  "show_dashboard",
  {
    description: "売上データをダッシュボードで表示する",
    _meta: {
      ui: {
        resourceUri: "ui://dashboard",
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
さらに UI の中でユーザー操作を受けて再度ツールを呼び出すこともできます。このコードは、ボタンがクリックされたときに `purchase-product` というツールを呼び出す例です。これによって、ユーザーがチャットの中で UI を操作して、そのまま次の行動の起点になる体験が実現できます。
-->

---

## 設計思想の変化

- UI は入口ではなく、必要な瞬間に差し込まれる部品になる
  - チャットの中でデザインを統一しつつ、破綻しないような UI を提供する必要がある
  - 既存のデザインシステムもこの文脈でどう活かせるかを考える必要がある
- 人間の判断が必要な瞬間にはテキストではなく UI が必要
- AI に UI を作らせたいが、その UI を安全に表示・操作するにはどう設計すべきか？
  - MCP Apps は HTML を iframe に埋め込むサンドボックスアプローチでこの問題に答えている
  <!--
  MCP Apps の登場は、UI の設計思想にどのような変化をもたらすでしょうか。
  まず、UI は入口ではなく、必要な瞬間に差し込まれる部品になるということです。MCP Apps ではチャットの中でデザインを統一しつつ、破綻しないような UI を提供する必要があります。また、既存のデザインシステムもこの文脈でどう活かせるかを考える必要があります。
  さらに、人間の判断が必要な瞬間には UI が必要になるという思想は、これから人間と AI の協業を前提とした UI 設計が重要になることを示しています。
  AI に UI を作らせたい。でも、その UI を安全に表示・操作するにはどう設計すべきかという問いもあります。MCP Apps は HTML を iframe に埋め込むアプローチでこの問題に答えています。
   -->

---

## ホストごとに異なるテーマへの対応

MCP Apps は**標準化された CSS カスタムプロパティ**を用意している

```css
/* 仕様が定める CSS 変数をそのまま使う */
.card {
  background: var(--color-background-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-primary);
  font-family: var(--font-sans);
}
```

- ホストが light / dark / ブランドごとの値を注入する
- App 側は変数を参照するだけで、ChatGPT でも Claude でも「その場に馴染む」UI になる
- 仕様は意図的に**色・タイポグラフィ・境界線に限定**し、spacing は含めない

<!--
MCP Apps が　UI が会話の中に自然に馴染むために、標準化された CSS カスタムプロパティが用意されています。ホストは自分の light / dark / ブランドカラーをこの変数に流し込み、App 側は変数を参照するだけでテーマが統一されます。さらに面白いのは、spacing、つまり余白の変数は意図的に含められていないことです。余白までホストごとに変えられるとレイアウトが破綻するから、というのが理由で、設計としてどこまでホストに委ねてどこは App 側で固定するか、という線引きがよく考えられていると思います。
-->

---

## Agent が UI を返す方法は MCP Apps だけではない

MCP Apps は **HTML を iframe に埋め込む** アプローチ
→ ホスト側のサンドボックス前提で表現力を確保する

一方で、**「宣言的な JSON を返す」** という別解もある

- AI は HTML ではなく、コンポーネント spec の JSON を生成する
- ホスト側がそれを **ネイティブ部品** として描画する

<!--
ここまで MCP Apps の話をしてきましたが、Agent が UI を返す方法は MCP Apps だけではありません。MCP Apps が HTML を iframe に埋め込む路線なのに対して、AI には宣言的な JSON だけを返してもらって、ホスト側がそれをネイティブのコンポーネントとして描画する、というアプローチが並行して提案されています。
このアプローチでは、AI は宣言だけを返し、実際の描画はホスト側の信頼済みコンポーネントが担います。
-->

---

## レイヤーが異なる 2 つの代表例

- **A2UI** (Google) — _プロトコル_。何を、どんな JSON で送るかの仕様
- **json-render** (Vercel Labs) — _フレームワーク_。schema-agnostic なので A2UI 形式にも適用可能

<!--
ここでは、この宣言的 JSON アプローチの代表例として、Google の A2UI と Vercel Labs の json-render というフレームワークを紹介します。Google の A2UI は「Agent と UI の間の通信プロトコル」、つまり MCP と同じレイヤーの仕様です。一方、Vercel Labs の json-render は「JSON spec を受け取って実際に描画する側のフレームワーク」で、schema-agnostic なので A2UI 形式にも適用できます。順番に見ていきます。
 -->

---

## A2UI — Google

**Agent と UI の間の通信プロトコル**

- AI が返す JSON の **メッセージ形式と意味論** を定義する
- 描画側の実装は問わない — React / Angular / Flutter / ネイティブで同じ JSON が動く
- LLM が **インクリメンタルに生成しやすい** フラットな構造
  - 完成 JSON を待たずにストリーミングで部分描画できる

<!--
まずプロトコル側、A2UI から見ていきます。A2UI 自体は、Agent と UI の間でやり取りされる JSON のメッセージ形式と意味論を定めた「仕様」です。
だからこそ、描画側の実装は何でもよくて、同じ JSON が React、Angular、Flutter、ネイティブモバイルでも同じように動きます。
もう一つの特徴は、LLM がインクリメンタルに生成しやすいよう、フラットな構造になっていることです。完成した JSON を待つ必要がなくて、断片が届くたびに UI を更新できます。
-->

---

## A2UI のメッセージ例 (v0.9 draft)

Agent はフラットな JSON で UI を記述する

```json
{ "version": "v0.9",
  "createSurface": { "surfaceId": "reservation", "catalogId": "basic" } }

{ "version": "v0.9",
  "updateComponents": {
    "surfaceId": "reservation",
    "components": [
      { "id": "root",   "component": "Column", "children": ["header", "submit"] },
      { "id": "header", "component": "Text",   "text": "Book Your Table" },
      { "id": "submit", "component": "Button", "label": "Reserve",
        "action": { "name": "submit_reservation" } }
    ]
  } }
```

<!--
A2UI のメッセージ例です。v0.9 では、UI の開始を表す `createSurface`、コンポーネントを追加・更新する `updateComponents`、データを更新する `updateDataModel` といった envelope 形式のメッセージがストリームで送られてきます。コンポーネントは ID を持ったフラットなレコードの並びで届き、親子関係は ID 参照で表現されます。
-->

---

## json-render — Vercel Labs (フレームワーク)

- JSON 形式の記述から、React / Vue / Svelte など様々な環境の UI を描画するフレームワーク
- LLM が JSON を出力するだけでアプリの UI を生成できるようにするのが狙い
- 開発者が **コンポーネントカタログ** (Zod スキーマ) を定義して AI を制約する

<!--
json-render です。Vercel Labs が公開しているフレームワークで、JSON 形式の記述から、React / Vue / Svelte など様々な環境の UI を描画するフレームワークです。
LLM が JSON を出力するだけでアプリの UI を生成できるようにするのが狙いで、開発者がコンポーネントカタログ (Zod スキーマ) を定義して AI を制約する、という設計思想が特徴的です。
-->

---

## json-render の 4 つのステップ

1. 開発者が **カタログ** (Zod スキーマ) を定義
2. カタログにマッピングするコンポーネントを実装
3. AI が **カタログ準拠の JSON** をストリーミング生成
4. JSON を元に React コンポーネントとして描画

<!--
json-render の実装のイメージを掴むために、4 つのステップに分けて見てみましょう。
まず、開発者がカタログを定義します。カタログは Zod スキーマで定義され、AI がどんな UI を出力できるかを制約する役割を持ちます。
次に、カタログにマッピングするコンポーネントを実装します。

ユーザーからプロンプトが渡されると、AI がカタログ準拠の JSON をストリーミング生成します。AI はカタログにない型は出せませんし、props のスキーマもバリデーションされるので、仮に AI がハルシネーションしても、未定義のコンポーネントや不正な props は弾かれる、という安全網が機能します。

最後に、AI からの JSON を元に React コンポーネントとして描画します。
 -->

---

## json-render のコード例

カタログを Zod で定義する

```ts
export const catalog = defineCatalog(schema, {
  components: {
    Card: { props: z.object({ title: z.string() }), slots: ["default"] },
    Metric: { props: z.object({ label: z.string(), value: z.string() }) },
  },
  actions: {},
});
```

<!--
コード例を見てみましょう。上が開発者が定義するカタログです。Card と Metric というコンポーネントを Zod スキーマ付きで登録しています。
 -->

---

## json-render のコード例

カタログにマッピングするコンポーネントを実装

```tsx
import { defineRegistry, Renderer } from "@json-render/react";

const { registry } = defineRegistry(catalog, {
  components: {
    Card: ({ props, children }) => (
      <div className="card">
        <h3>{props.title}</h3>
        {children}
      </div>
    ),
    Metric: ({ props }) => (
      <div className="metric">
        <span>{props.label}</span>
        <span>{props.value}</span>
      </div>
    ),
  },
});
```

<!--
続いて、カタログにマッピングするコンポーネントを実装します。Props の型はカタログの Zod スキーマから自動的に推論されるので、実装者は型安全にコンポーネントを実装できます。
 -->

---

## json-render のコード例

AI が生成する JSON はカタログに完全に拘束される

```json
{
  "root": "card-1",
  "elements": {
    "card-1": {
      "type": "Card",
      "props": { "title": "Revenue" },
      "children": ["m1"]
    },
    "m1": {
      "type": "Metric",
      "props": { "label": "Total", "value": "$48,200" }
    }
  }
}
```

<!--

続いて AI が実際に生成する JSON です。この JSON を見ればわかるように、AI はカタログに完全に拘束されます。
-->

---

## json-render のコード例

AI が生成する JSON を `<Renderer />` で描画する

```tsx
<Renderer registry={registry} spec={spec} />
```

<!--
最後に、AI が生成する JSON を `<Renderer />` で描画します。これで、AI が JSON を出力するだけで UI が生成される体験が実現できます。
 -->

---

<div class="hero">
  <div class="small">よく見られる言説</div>
  <div class="quote">
    UI は AI が全部作ってくれるから、フロントエンドエンジニアはもういらない。バックエンドエンジニアを目指そう。
  </div>
</div>

<!--
ところで、AI が普及してから、このような言説を見かけることが増えたと思います。
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

<!--
実は Web には昔から人間以外の消費者がいました。クローラです。
ですがクローラはあくまでインデックス作成が目的で、DOM をパースして構造的にコンテンツを抽出することに特化していました。一方、AI エージェントはタスク遂行が目的で、レンダリングされた内容を意味的に理解して判断し、さらに操作もするという点で大きく異なります。
特に、AI はコンテキストウィンドウの制約の中で情報を処理するため、コンテンツの冗長性が性能に大きく影響します。
-->

---

## AI が Web を読むための工夫が必要に

- AI はスクリーンショットや DOM、アクセシビリティツリーを利用してコンテンツの意味構造を理解する
  - セマンティック HTML の重要性
  - これは今までと変わらない
- コンテキストウィンドウを圧迫しない → 単に情報が欲しいだけであれば、装飾のための構造はノイズになる

<!--
我々に与える影響という観点で言えば、AI が Web を読むための工夫が必要になったことが大きいと思います。
AI が web の情報を取得したり操作するとき、アクセシビリティツリーを利用してコンテンツの意味構造を理解します。そのためには、セマンティック HTML を書いて意味構造を明確にすることは AI が操作しやすい環境を提供してあげるという意味で重要になります。

ですが、セマンティックな HTML を作るということは今までもその重要性が言われてきたことなので、AI の登場によって特に新しい話ではないと思います。


殊更に AI にとって重要になったのは、コンテキストウィンドウを圧迫しないことです。AI はコンテキストウィンドウの制約の中で情報を処理するため、単に情報が欲しいだけであれば、装飾のための構造はノイズになります。つまり、AI にとっては、意味を伝えるための構造と、装飾のための構造を分けて考える必要が出てきます。
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
  - AI が完全に自律的に動くのではなく、人間と協業することを前提とした設計

<!--
WebMCP を端的に説明すると、Web アプリがブラウザ上で AI から呼び出せるツールを公開する仕組みです。
AI にスクリーンショット解析やコードによる DOM 操作を行わせるのではなく、意味を持った関数を通じて操作できるようにすることが WebMCP のポイントです。AI が操作するために余分なコンテキストを与えず、AI にとって必要な情報だけを渡すことができる点が利点と言えるでしょう。
さらに、WebMCP の前提は human-in-the-loop であることも重要です。AI が完全に自律的に動くのではなく、人間と協業することを前提とした設計になっています。
-->

---

## WebMCP のコード例

- `window.navigator.modelContext.registerTool` でツールを提供する
- 例えば、Todo アプリが「タスクを追加する」ツールを提供するコード例

```js
window.navigator.modelContext.registerTool({
  name: "add-todo",
  title: "Add todo",
  description: "Add a new todo item to the list",
  inputSchema: { type: "object", properties: { text: { type: "string" } } },
  execute: async ({ text }) => {
    // addTask は JavaScript 関数で、UI 上のタスク追加と同じロジックが走ると想定
    addTask(text);
    return { content: [{ type: "text", text: `Added todo: ${text}` }] };
  },
});
```

<!--
簡単にコード例を見てみましょう。
WebMCP では、`window.navigator.modelContext.registerTool` でツールを提供します。例えば、Todo アプリが「タスクを追加する」ツールを提供するコード例は上のようになります。
-->

---

## 宣言的にツール化できる

- WebMCP ではフォームに属性を付けるだけでツール登録できる提案もある
- AI ツールを呼び出すとフォームに自動で値が入力される
- Submit ボタンを押すのは人間が担う

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
もしくは、WebMCP ではフォームに属性を付けて宣言的な方法でツール登録できる提案もあります。上のコードはその例です。
AI が宣言的な方法で公開されたツールを呼び出すと、フォームに自動で値が入力されるようになります。

ただし、Submit ボタンを押すのは人間が担う設計になっています。
-->

---

## 従来の MCP ツールや API と何が違うのか

- 単に AI にツールを使わせるだけなら MCP ツールでいい
- それでも WebMCP が必要なのは、**人間と AI が同じインターフェース上で協業する**から
- 既に多くの企業が Web を通じてサービスを提供しており、既存の資産を再利用できるというメリットも大きい
  - ブラウザに既にあるセッション Cookie / SSO の恩恵をそのまま利用できる

<!--
WebMCP は従来の MCP ツールや API と何が違うのでしょうか？単に AI に外部サービスを操作させたいならば、従来の MCP ツールで十分です。ですが、WebMCP が必要なのは、人間と AI が同じインターフェース上で協業するからです。フォームの例では、AI がフォームに値を入力して、その値を人間が確認したうえで送信するという流れが自然にできます。普段使っている Web アプリのインターフェースをそのまま AI と共有できるのは大きなメリットです。

さらに、既に多くの企業が Web を通じてサービスを提供しており、既存の資産を再利用できるというメリットも大きいでしょう。MCP の認証フローは新たに設計する必要がありますが、WebMCP であればブラウザに既にあるセッション Cookie や SSO の恩恵をそのまま利用できます。
-->

---

## AI 向け対応とアクセシビリティは地続き

- WebMCP の仕様書でも「much of the challenges faced by assistive technologies also apply to AI agents」と明記されている
- Web を視覚情報なしにどう理解し、操作するかという点で、AI エージェントとスクリーンリーダーは本質的に同じ問題を解いている
- 「支援技術のためのインターフェース」を考えるスキルセットが、そのまま「AI のためのインターフェース」に転用できる

→ 新しいスキルが必要なのではなく、アクセシビリティという Web の基本が生きてくる

<!--
実は WebMCP のドキュメントにも書かれているのですが、補助技術 (スクリーンリーダーなど) が直面してきた課題と、AI エージェントが直面している課題は非常に似通っています。人間向け UI を前提とした Web を、視覚情報なしで理解し、操作するという点で、本質的に同じ問題を解いているんですね。つまり、AI 対応のために新しいスキルが必要になったというよりは、アクセシビリティという Web の基本が生きてくる、という見方ができると思います。
 -->

---

## AI が生成する時代の説明責任

- AI が生成したコンテンツは、**誤情報や偏見を含む可能性がある**
- AI はコンテンツを大量に生成できるため、よく検証されていない情報が大量に投稿されるという問題も出てきた
- Web コンテンツの制作者として、AI の関与を明示することが求められている

<!--
AI が消費者になるだけでなく、生成者にもなる以上、説明責任の論点も出てきます。
誤情報や偏見を含む可能性があるし、大量生成によって未検証の情報も増えます。
なので、AI の関与をどう明示するかが実務上のテーマになります。
-->

---

## ai-disclosure 属性の提案

- AI の関与度を HTML で宣言
- 例えばニュースサイトでは、人間が書いた調査報道と AI 生成のサマリーが混在する可能性がある
- `ai-disclosure` 属性を使ってどの部分が AI 生成なのかを明示することができる

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
このような説明責任の観点から、AI の関与度を HTML で宣言するという提案もあります。例えばニュースサイトでは、人間が書いた調査報道と AI 生成のサマリーが混在する可能性がありますが、`ai-disclosure` 属性を使ってどの部分が AI 生成なのかを明示することができます。
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

- すべての人が自由かつ平等にアクセスし、利用できる開かれた基盤であるべきだという考え方

- この理念は変わっていない **「everyone」の範囲が拡張された**

スクリーンリーダーに情報を伝えたり、身体に障害がある人が操作できるようにするのと同じように、AI にも情報を届けたり、発信する基盤を作ることが求められるようになった
→ アクセシビリティと同じ考え方

<!--
The Web is for everyone という言葉は、Web の創始者である Tim Berners-Lee が提唱した理念で、Web はすべての人が自由かつ平等にアクセスし、利用できる開かれた基盤であるべきだという考え方を表しています。AI が Web の相手に加わった今、この理念は変わっていませんが、「everyone」の範囲が拡張されたと言えます。

これまではスクリーンリーダーに情報を伝えたり、身体に障害がある人が操作できるようにすることがアクセシビリティの範疇でしたが、AI にも情報を届けたり、AI 自身が UI を安全に提供できる基盤を作ることが求められるようになりました。つまり、AI 対応もアクセシビリティと同じ考え方で捉えることができます。
-->

---

## 人間と AI、どちらの体験を優先するか

- AI に最適化すると、人間にとって使いにくい UI になることがある
- 人間に最適化すると、AI にとって冗長になる (装飾 HTML、画像に埋め込まれたテキスト)
- モバイルデバイスが登場したとき、`m.example.com` を作り分離する動きがあったが、運用コストの高さや SEO への悪影響などから、レスポンシブデザインが主流になった
- 同じような観点で、AI 向けの**レスポンシブ**な設計が求められるだろう

<!--
もう一つ考えたいのが、人間と AI のどちらの体験を優先するか、という話です。AI に最適化しすぎると人間にとって使いにくくなるし、逆も然りです。なので、両方に届く設計を考える必要があります。

似たような例として、モバイルデバイスが登場したとき、`m.example.com` を作り分離する動きがありました。しかし、運用コストの高さや SEO への悪影響などから、レスポンシブデザインが主流になりました。同じような観点で、AI 向けのレスポンシブな設計が求められるだろうと思います。例えば、コンテンツヘッダーを利用したコンテンツの出しわけだったり、AI 向けのツールを公開するといった動きがそうですね。
 -->

---

## 新しい技術は協業のために作られている

これまで紹介した規格はどれも、AI にすべてを任せる仕組みではない
**人間と AI が同じ場所で働くこと**を前提に設計されている

- **MCP Apps/A2UI / json-render** — テキストで足りない瞬間に、人間が判断・操作するための UI を会話に差し込む
- **WebMCP** — 入力は AI に任せても、Submit を押すのは人間（human-in-the-loop が仕様の前提）。完全に AI に任せるなら API を作ればいい

<!--
ここで強調しておきたいのは、これまで紹介してきた MCP Apps、WebMCP、A2UIといった新しい技術は、どれも AI にすべてを任せるための仕組みではない、ということです。むしろ、人間と AI が同じ場所で働くことを前提にして設計されています。
MCP Apps は、テキストでは伝えきれない瞬間に、人間が判断・操作するための UI を会話に差し込みます。

WebMCP は、入力こそ AI に任せられますが、Submit ボタンを押すのは人間という設計が、仕様の前提として組み込まれています。そもそも、完全に AI に任せるのであれば API を作ればいいわけで、WebMCP のようなブラウザ上のツール化は必要ありません。
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
3 つ目。それでもフロントエンドエンジニアの役割は変わりません。ユーザー体験を形作ることが重要で、AI と人間の両方を考慮した設計が求められるようになりました。
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
