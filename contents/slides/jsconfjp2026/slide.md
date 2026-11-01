---
marp: true
theme: azukiazusa
size: 16:9
description: ワークフローからハーネスへ — Web フレームワークの作者たちが AI エージェントに向かう理由
style: |
  .flow {
    justify-content: center;
    gap: 12px;
    margin: 0.4em 0 1em;
  }

  .flow > div:last-child {
    flex: none;
  }

  .flow .node {
    border: 1px solid var(--stone-600);
    background: var(--stone-900);
    border-radius: 8px;
    padding: 10px 16px;
    font-size: 24px;
    white-space: nowrap;
  }

  .flow .arrow {
    font-size: 28px;
  }
---

<div class="hero">
  <div class="eyebrow">JSConf JP 2026</div>
  <h1 class="title">ワークフローからハーネスへ</h1>
  <div class="lead">Web フレームワークの作者たちが AI エージェントに向かう理由</div>
  <div class="mono muted">azukiazusa</div>
</div>

<!--
「ワークフローからハーネスへ — Web フレームワークの作者たちが AI エージェントに向かう理由」というタイトルでお話しします。
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
azukiazusa です。ブログで毎週 Web と AI の記事を書いています。
-->

---

## Web の作り手たちが、エージェントを作り始めた

- Gatsby のチーム: **Mastra**
- Next.js（Vercel）: **eve**
- Astro（Fred K. Schott）: **Flue**

<!--
最近は TypeScript 製の AI エージェントフレームワークが次々と発表されています。その中で特徴的だと思うのは、Gatsby、Next.js、Astro といった著名な Web フレームワークの作者・開発元が、相次いでエージェントフレームワークを作っていることです。
-->

---

## Web と AI、一見つながりがなさそうなのに？

<div class="statement">この疑問が今日の発表のきっかけとなった</div>

<!--
Web 技術と AI 技術って一見つながりが無さそうに見えますよね。なぜ Web フレームワークの作者たちが、AI エージェントフレームワークを作るか、疑問に思ったのが今日の発表のきっかけです。
-->

---

<div class="hero">
  <div class="huge">AI エージェントは<br />いまが<span class="accent">抽象化のタイミング</span></div>
</div>

<!--
その答えは、エージェント開発の「抽象化のタイミング」を迎えたことにあると考えています。まず一昔前に比べて、モデルが賢くなり、処理の流れはモデル自身が組むようになりました。エージェント開発において、今重点となっているのは、エージェントが安全に走り続けるための足場を用意することです。これをハーネスという言葉で呼ばれていたりしますね。
-->

---

<div class="hero">
  <div class="huge">エージェントの課題が<br /><span class="accent">「フレームワークの課題」</span>になった</div>
</div>

<!--
モデルが賢くなると、エージェント開発の課題はモデルの扱い方だけではなく、実行環境をどう支えるかにも広がります。つまり抽象化の重心が、処理の流れからその周辺のハーネスにも移り始めました。
Web フレームワークの作者たちは、認証やルーティング、状態管理、ビルド、デプロイなどの複雑さを引き受けて、アプリ開発者が機能に集中できる環境を設計してきました。この経験が、エージェントの実行基盤にも活きるのではないか、というのが今日の仮説です。
-->

---

## エージェントは「フレームワーク以前の Web」

<div class="quote">

"Agents today are where the web was before frameworks"

</div>

- 開発者はみな、同じ土台を手作りしている
- 手作りした土台は、次のプロジェクトに持ち越されない

<div class="small muted">出典: Vercel, "Introducing eve" (2026) https://vercel.com/blog/introducing-eve</div>

<!--
eve の発表ブログにこういう一文があります。"Agents today are where the web was before frameworks"、つまり「今のエージェントは、フレームワーク以前の Web の段階にある」という意味です。
フレームワークがなかった頃の Web では、ルーティングもセッションも認証も、サイトごとに手作りしていました。エージェントも同じで、状態の永続化、サンドボックス、承認フロー、Slack などとの連携を、みんな毎回作り直しています。

これは「まだ抽象化されていない」状態です。では、なぜ今になって抽象化が活発になっているのか、見ていきたいと思います。
-->

---

<div class="hero">
  <div class="eyebrow">Step 1</div>
  <div class="huge">ワークフローから<span class="accent">ハーネス</span>へ</div>
</div>

<!--
ステップ 1、ワークフローからハーネスへ、という変化です。
-->

---

## ワークフロー中心: 流れを明示的に組み立てる

<div class="flow">
  <div class="node">入力</div><div class="arrow">→</div>
  <div class="node">プロンプト</div><div class="arrow">→</div>
  <div class="node">LLM</div><div class="arrow">→</div>
  <div class="node">パース</div><div class="arrow">→</div>
  <div class="node">次のステップ</div>
</div>

- 初期の LLM アプリでは、手順を開発者が明示する設計が有効だった
- モデルに任せる範囲を限定し、**処理の流れ**を組み立てた
- ワークフローは今も、再現性が必要な処理で重要

<!--
初期の LLM アプリケーションでは、開発者がプロンプトやツール呼び出しの順番を決める設計が自然でした。モデルだけで複雑なタスクを安定して進めるのは難しかったからです。
ただし、ワークフローが古くなったわけではありません。今も決まった手順を確実に実行するには重要で、LangGraph のようにエージェントの状態管理や永続化も扱う基盤があります。ここで話したいのは置き換えではなく、開発者が意識する課題の重心の変化です。
-->

---

## ハーネス中心: 抽象化の重心が外側に移った

<div class="quote">

"Agent = Model + Harness"

</div>

- モデルがツール選択や次の行動を判断できる場面が増えた
- **処理の流れだけでなく、実行環境を支える抽象化が重要に**
- 状態・権限・安全性・継続実行を支える足場 = **ハーネス**

<div class="small muted">出典: Vivek Trivedy, "The Anatomy of an Agent Harness", LangChain Blog</div>

<!--
モデルの進化によって、次にどのツールを呼ぶか、どう情報を集めるかなどをモデルが判断する場面が増えました。それに伴い、失敗からどう再開するか、どこまでの権限を与えるか、実行の様子をどう観測するかといった外側の設計が重要になります。
これを支える仕組みをハーネスと呼びます。「Agent = Model + Harness」は、この役割分担を捉える表現です。ワークフローがハーネスに完全に置き換わったのではありません。実際、eve でも会話の永続化には Workflow SDK が使われています。抽象化の重心が外側にも広がったのです。
-->

---


---

## Mastra：エージェントループだけでは足りない

- Mastra Code の開発から得られた教訓
- 単純なエージェントループでは、長時間の実行に耐えられない
- **コンテキスト管理・永続化・承認**などをハーネスで担う

<div class="small muted">
出典: Sam Bhagwat, "Anatomy of a harness" (2026)
</div>

<!--
Mastra の作者たちも、エージェントを開発する中で抽象化する対象を広げてきました。

決められたワークフローだけでは、実行経路がわからない複雑なタスクに対応しきれないことを説明しています。

そのため Mastra は、モデルの判断そのものではなく、モデルが継続して動くための実行環境もフレームワーク側で引き受けるようになりました。

その知見を抽象化したのが Agent Controller です。

これは、抽象化の重心が処理の流れから
実行環境へ広がっていることを示す例だと思います。
-->

---

## ハーネスに必要なものが見えてきた

- ツール
- スキル
- サブエージェント
- サンドボックス
- Human-in-the-loop
- 耐久性
- メモリ
- 観測・評価
- チャンネル

<!--
ハーネスに何が必要かは、ここ数年で見えてきました。ツールやスキルでエージェントの能力を拡張すること、サンドボックスや Human-in-the-loop で安全性を確保すること、耐久性やメモリで状態を保持すること、観測・評価でエージェントの挙動を監視すること、チャンネルで Slack や Discord と連携すること、などです。
-->

---

<div class="hero">
  <div class="huge">
    共通パターンが見えてきた<br />↓<br />
    フレームワークの出番
  </div>
</div>

<!--
状態管理、承認、サンドボックスなど、複数のエージェントに共通する課題が見え始めました。こうした繰り返しが抽象化されると、フレームワークの出番です。ただし抽象化自体もまだ発展途上で、後で紹介する Flue 2.0 はその良い例です。
-->

---

<div class="hero">
  <div class="eyebrow">Step 2</div>
  <div class="huge">実績のある Web の設計を<br /><span class="accent">持ち込む</span></div>
</div>

<!--
ステップ 2 として、実績のある Web の設計を持ち込む、という話です。フレームワークとして抽象化するというプラクティスは、Web の世界で何度も繰り返されてきて、その知見が蓄積されています。
-->

---

## Web の作者が得意なのは「複雑さを引き受ける」こと

<div class="compare">

<div class="side">
  <div class="label">Web フレームワーク</div>

- ルーティング・認証・状態管理
- ビルド・デプロイ・監視
- 規約によって共通処理を隠す

</div>

<div class="side">
  <div class="label">Agent フレームワーク</div>

- ツール接続・権限・承認
- 永続化・サンドボックス・監視
- 実行基盤の共通処理を隠す

</div>

</div>

<div class="statement" style="font-size: 30px; margin: 0.6em 0;">開発者は「どう動かすか」より、<strong>「何を作るか」</strong>に集中できる</div>

<!--
なぜ Web の作者たちなのか。抽象化をするだけなら他分野の開発者にもできます。しかし Web フレームワークの作者たちは、ルーティング、認証、ビルドやデプロイを一つの開発体験として統合してきました。複雑な配線をフレームワーク側で引き受け、開発者にはアプリの本質を記述してもらう。この姿勢が、ハーネスにも共通しています。例えば eve はツールの登録だけでなく、サンドボックス、承認、永続実行までまとめて扱います。次のファイルベース規約は、その設計思想が現れる具体例です。
-->

---

## ファイルベースの規約

<div class="columns">

<div>
  <div class="label">Next.js</div>

```txt
app/
├── page.tsx
├── blog/
│   └── page.tsx
└── api/
    └── route.ts
```

</div>

<div>
  <div class="label">eve</div>

```txt
agent/
├── agent.ts
├── instructions.md
├── tools/
│   └── get_weather.ts
├── skills/
│   └── plan_a_trip.md
└── channels/
    └── slack.ts
```

</div>

</div>

<div class="quote">
"Just as Next.js turns a folder into a route by owning the routing, eve turns a file into an ability by owning the agent loop."
</div>

<!--
例えばファイルベースの規約です。
Next.js では app ディレクトリにフォルダを置くとそれがルートになります。eve でも同じように、 tools ディレクトリに get_weather.ts を置くと、get_weather という名前のツールが自動で登録されます。

eve のブログでは「Next.js がルーティングを引き受けてフォルダをルートに変えたように、eve はエージェントループを引き受けてファイルを能力に変える」と説明しています。Next.js で慣れ親しんだ形が、そのままエージェントの世界に持ち込まれています。ここで重要なのは見た目が似ていることよりも、登録や接続の仕組みをフレームワークが引き受け、開発者は「何ができるか」の定義に集中できることです。
-->

---

## Flue 2.0: Hooks で状態に応じて能力を組み立てる

```ts
export function SupportAgent() {
  const [verified, setVerified] =
    usePersistentState("verified", false);

  useTool({ name: "verify", description: "...",
    run: () => setVerified(true) });

  if (verified) useTool(refundOrder);
  return instructions;
}
```

<!--
Flue 2.0 は、静的な設定オブジェクトから Hooks ベースの API に変更しました。ここでは公式記事にある永続状態と条件付きツール登録の仕組みを使い、サポートエージェントの例にしています。verified は会話をまたいで保持され、verify ツールの実行で true になります。すると次の実行から返金ツールを使用可能にできます。

React に着想を得たのは、名前が use で始まることだけではありません。状態、ライフサイクル、能力を小さな部品として合成できることです。
-->

---

## 抽象化は、使われてから見直される

- 静的な定義は、複雑なエージェントや複数ステップの処理で限界が見えた
- 破壊的変更をしてでも、直す価値があると判断した
- これは Web フレームワークの世界でも何度も見てきた光景

<div class="small muted">出典: Flue, "Flue 2.0" https://flueframework.com/blog/flue-2/</div>

<!--
Flue 1.0 Beta を実際の開発で使ったところ、複雑なエージェントや複数ステップのワークフローでは静的な定義に限界が見えてきたそうです。他の人気フレームワークにも同じ問題があるのではと考え、破壊的変更をしてでも直す価値があると判断しました。
これは Web フレームワークの世界で何度も見てきた光景です。React のクラスコンポーネントから Hooks へ、Next.js の Pages Router から App Router へ。抽象化は一度で決まらず、使われてから見直されるものです。その感覚を持っているのが、Web を作ってきた人たちなんです。
-->

---

<div class="hero">
  <div class="eyebrow">Step 3</div>
  <div class="huge">なぜ <span class="accent">TypeScript</span> なのか</div>
</div>

<!--
最後のステップとして、なぜ TypeScript なのか、という話です。
-->

---

## TypeScript の活躍する領域が広がっている

<div class="compare">

<div class="side weak">
  <div class="label">モデル・データに近い領域</div>
  <h3>Python が強い</h3>

- ML・データ処理・実験
- モデルや評価のエコシステム

</div>

<div class="side">
  <div class="label">プロダクトに近い領域</div>
  <h3 class="accent">TypeScript が活きる</h3>

- サーバー・ツール・Web UI
- npm 資産・デプロイとの統合

</div>

</div>

<div class="statement" style="font-size: 32px; margin: 0.7em 0;">エージェントがプロダクトに近づいた</div>

<!--
なぜ TypeScript のエージェントフレームワークが増えているのでしょうか。
エージェントを実際のプロダクトに組み込む仕事が増え、既存の Web サーバー、業務 API、npm パッケージ、UI と一体で作る場面が重要になったということです。そこで TypeScript のエコシステムという強みが生きるのです。
-->

---

## エージェントと人をつなぐ UI は、もともと Web の仕事

- エージェントは最終的に、UI を通して人と対話する
  - Slack との接続
  - Web UI への描画
- → UI からサーバー、ツールまで同じ JS/TS 資産を使える

<!--
プロダクトの近くの中でも特に分かりやすいのが、エージェントの出口です。エージェントは最終的に、Web のチャット画面や Slack などを通して人と対話します。
。
人と対話する UI を作るのは、もともと Web の仕事で、TypeScript の場合はエージェントのツールと UI を同じ言語で作れたり、エコシステムが充実しているという強みがあるのです。
-->

---

## まとめ

- ワークフローは今も重要。モデルの進化により、**抽象化の重心がハーネスにも広がった**
- Web の作者は、共通の複雑さを引き受ける**開発体験の設計**をしてきた
- エージェントがプロダクトに近づき、**TypeScript の活躍する領域が広がった**

<!--
まとめです。
1 つ目、ワークフローは今も必要ですが、モデルの進化で、抽象化の重心がハーネスにも広がりました。
2 つ目、Web フレームワークの作り手は、認証や状態管理、デプロイなどの配線を引き受け、開発体験を設計してきました。その経験がエージェントの実行基盤にも活きています。
3 つ目、Python を置き換えるという話ではなく、エージェントがプロダクトに近づいたことで TypeScript の強みが活きる場面が広がっていると考えています。
-->

---

## 参考資料

<div class="small">

- Vercel, "Introducing eve" https://vercel.com/blog/introducing-eve
- vercel/eve https://github.com/vercel/eve
- Flue https://flueframework.com
- Flue, "Flue 2.0" https://flueframework.com/blog/flue-2/
- Mastra Docs https://mastra.ai/docs
- Mastra About https://mastra.ai/about
- LangChain, "The Anatomy of an Agent Harness" https://langchain.com/blog/the-anatomy-of-an-agent-harness

</div>

<!--
参考資料です。今日紹介したフレームワークは、それぞれブログで詳しく試しているので、気になった方はぜひ読んでみてください。
-->
