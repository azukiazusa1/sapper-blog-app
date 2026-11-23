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

  /* 出典は投影時に読めるよう 18pt（24px）以上にする */
  .small {
    font-size: 24px;
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

## Web の作り手たちがエージェントを作り始めた

- Gatsby のチーム: **Mastra**
- Next.js（Vercel）: **eve**
- Astro（Fred K. Schott）: **Flue**

<!--
2026年に入って、TypeScript 製の AI エージェントフレームワークが次々と発表されています。その中で特徴的だと思うのは、Gatsby、Next.js、Astro といった著名な Web フレームワークの作者・開発元が、相次いでエージェントフレームワークを作っていることです。
-->

---

## Web と AI は一見つながりがなさそうなのに？

<div class="statement">この疑問が今日の発表のきっかけとなった</div>

<!--
Web 技術と AI 技術って一見つながりが無さそうに見えますよね。なぜ Web フレームワークの作者たちが、AI エージェントフレームワークを作るか、疑問に思ったのが今日の発表のきっかけです。
-->

---

<div class="hero">
  <div class="huge">AI エージェントは<br />いまが<span class="accent">抽象化のタイミング</span></div>
</div>

<!--
その答えは、エージェント開発の「抽象化のタイミング」を迎えたことにあると考えています。まず一昔前に比べて、モデルが賢くなり、処理の流れはモデル自身が組むようになりました。
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

<div class="small muted">出典: <a href="https://vercel.com/blog/introducing-eve">Vercel, "Introducing eve" (2026)</a></div>

<!--
eve の発表ブログにこういう一文があります。"Agents today are where the web was before frameworks"、つまり「今のエージェントは、フレームワーク以前の Web の段階にある」という意味です。
フレームワークがなかった頃の Web では、ルーティングもセッションも認証も、サイトごとに手作りしていました。エージェントも同じで、状態の永続化、サンドボックス、承認フロー、Slack などとの連携を、みんな毎回作り直しています。

これは「まだ抽象化されていない」状態です。では、なぜ今になって抽象化が活発になっているのか、見ていきたいと思います。
-->

---

<div class="hero">
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

<!--
初期の LLM アプリケーションでは、開発者がプロンプトやツール呼び出しの順番を決める設計が自然でした。モデルだけで複雑なタスクを安定して進めるのは難しかったからです。ワークフローはグラウフのように、処理の流れを明示的に組み立てる設計です。決定的な手順はコードに任せることにより、安定した処理の流れを作ることができました。
-->

---

## ハーネス中心: 抽象化の重心が外側に移った

<div class="quote">

"Agent = Model + Harness"

</div>

- モデルがツール選択や次の行動を判断できる場面が増えた
- **処理の流れだけでなく、実行環境を支える抽象化が重要に**
- 状態・権限・安全性・継続実行を支える足場 = **ハーネス**

<div class="small muted">出典: <a href="https://langchain.com/blog/the-anatomy-of-an-agent-harness">Vivek Trivedy, "The Anatomy of an Agent Harness", LangChain Blog (2026)</a></div>

<!--
モデルの進化によって、次にどのツールを呼ぶか、どう情報を集めるかなどをモデルが判断する場面が増えました。それに伴い、失敗からどう再開するか、どこまでの権限を与えるか、実行の様子をどう観測するかといった外側の設計が重要になります。
これを支える仕組みをハーネスと呼びます。「Agent = Model + Harness」は、この役割分担を捉える表現が LangChain のブログにも登場しています。
-->

---

## Mastra：エージェントループだけでは足りない

- Mastra は元々ワークフロー中心の設計だった
- 単純なエージェントループでは、長時間の実行に耐えられない
  - Mastra Code の開発から得られた教訓
- **コンテキスト管理・永続化・承認**などをハーネスで担う

<div class="small muted">出典: <a href="https://mastra.ai/blog/the-next-million-ai-developers">Sam Bhagwat, "A framework for the next million AI developers", Mastra Blog (2024)</a><br /><a href="https://mastra.ai/blog/anatomy-of-a-coding-agent">Sam Bhagwat, "Anatomy of a harness", Mastra Blog (2026)</a></div>

<!--
Mastra もコーディングエージェント Mastra Code の開発を通じて同じ結論に至っています。Mastra は元々ワークフロー中心の設計でしたが、単純なエージェントループでは長時間の実行に耐えられないことが分かりました。そこでコンテキスト管理、永続化、承認などをハーネスで担う設計に変えて、これを Agent Controller として提供しています。
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
ハーネスに何が必要かは、ここ数年で見えてきました。ここであげている要素は一定の共通理解を得ているように思います。
-->

---

<div class="hero">
  <div class="huge">
    共通パターンが見えてきた<br />↓<br />
    フレームワークの出番
  </div>
</div>

<!--
こうしたきょうつパターンが見てたタイミングが、フレームワークの出番です。
-->

---

<div class="hero">
  <div class="huge">実績のある Web の設計を<br /><span class="accent">持ち込む</span></div>
</div>

<!--
ステップ 2 として、実績のある Web の設計を持ち込む、という話です。フレームワークとして抽象化するというプラクティスは、Web の世界で何度も繰り返されてきて、その知見が蓄積されています。
-->

---

## 複雑さを引き受けること

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
Web フレームワークの作者たちは、ルーティング、認証、ビルドやデプロイを一つの開発体験として統合してきました。複雑な場所ををフレームワーク側で引き受け、開発者にはアプリの本質を記述してもらうという設計が Agent フレームワークのハーネスにも共通しています。

これによって、開発者は「どう動かすか」よりも、「何を作るか」に集中できるようになります。
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

<div class="quote" style="font-size: 32px;">
"Just as Next.js turns a folder into a route by owning the routing, eve turns a file into an ability by owning the agent loop."
</div>

<div class="small muted">出典: <a href="https://vercel.com/blog/introducing-eve">Vercel, "Introducing eve" (2026)</a></div>

<!--
例として eve のファイルベースの規約を紹介します。
Next.js では app ディレクトリにフォルダを置くとそれがルートになります。eve でも同じように、 tools ディレクトリに get_weather.ts を置くと、get_weather という名前のツールが自動で登録されます。

eve のブログには「Next.jsが「フォルダ構成だけでURLルートを自動生成する」ように、eveは「ファイルを置くだけでエージェントの能力として機能させる」というふうに説明されています。

このようにフレームワークに何を任せて、何を開発者に任せるかという設計は、Web フレームワークの知見が活かされているように感じます。
-->

---

## Flue 2.0: Hooks で状態に応じて能力を組み立てる

```ts
export function SupportAgent() {
  const [verified, setVerified] = usePersistentState("verified", false);

  useTool({ name: "verify", description: "...",
    run: () => setVerified(true) });

  if (verified) useTool(refundOrder);
  return instructions;
}
```

<div class="small muted">参考: <a href="https://flueframework.com/blog/flue-2/">Flue, "Flue 2.0"</a></div>

<!--
Flue 2.0 では、React から着想を受けて、エージェントの定義が設定オブジェクトから、Hooks を呼ぶ関数に変わりました。

React の Hooks が便利なのは、UI を状態の関数として書けることでした。Flue はこの着想を得て、エージェントの設定を関数として書けるようにしました。現在の状態からエージェントがどのツールを使えるか？という能力の組み立てを hooks で表現したことにより、宣言的な方法でエージェントの設定ができるというのが特徴です。

もう 1 つ React のカスタムフックのように、関心のある部分を切り出して再利用できるというのも特徴です。
-->

---

## Hooks を採用した理由

- 実行時の動的な振る舞いと能力の切り替えを自然に記述できた
- カスタムフックによるロジックの再利用と合成
- 学習コストの低さ

<!--
Hooks を採用した最大の目的は、実行時の動的な振る舞いと能力の切り替えを自然に記述できることでした。複雑なエージェントでは「状況に応じてツールを出し入れしたい」「タスクの難易度に応じて途中でより高性能なモデル」という要望が出てきます。このような動的な振る舞いは hooks を使うことで自然に記述できると気づいたようです。

React が長年かけて培った設計思想を活かしているという点が面白いところだと思います。
-->

---

<div class="hero">
  <div class="huge">なぜ <span class="accent">TypeScript</span> なのか</div>
</div>

<!--
最後のステップとして、なぜ TypeScript なのか、という話です。
-->

---

## TypeScript の活躍する領域が広がっている

<div class="compare">

<div class="side">
  <div class="label">モデルの中を補う</div>
  <h3>Python が強い</h3>

- 学習・ファインチューニング
- データ分析・RAG の精度改善
- モデルの実験・検証

</div>

<div class="side">
  <div class="label">モデルの外を整える</div>
  <h3 class="accent">TypeScript が活きる</h3>

- ツール・権限・承認（ハーネス）
- UI とのリアルタイム対話
- 既存 Web プロダクトへの組み込み

</div>

</div>

<div class="statement" style="font-size: 32px; margin: 0.7em 0;">差がつく場所が、モデルの外に移った</div>

<!--
従来は、AI エージェントのフレームワークといえば Python が中心でした。同じ名称のフレームワークでも、Python 製のものが先に新しい機能が追加されることも多かったです。

それでもいま TypeScript が有力になってきた 1 つ目の理由は、エージェントの出来を決める場所が変わったからです。以前は、RAG やファインチューニングでモデルに足りない知識を補う、データと機械学習の仕事が中心でした。ここは今も Python の領域です。
でもモデルが賢くなり、差がつく場所がモデルの外に移りました。ハーネスや UI とのリアルタイムな対話、既存 Web プロダクトへの組み込みなど、モデルの外側を整えることが重要になったのです。ここで TypeScript が活きる領域が広がっています。
-->

---

## エージェントの実行と UI は密接に結合する

- エージェントの内部状態がそのまま UI の状態になる
  - 思考やツール実行の状態
  - UI での承認を受けて再開
  - Generative UI
- 実際、`useEveAgent`（eve）や `@flue/react`（Flue）のように UI 連携もセットで提供されている

<div class="statement" style="font-size: 30px; margin: 0.6em 0;">同じ TypeScript で扱う強みが活きる</div>

<!--
TypeScript の強みとしては、やはりフロントエンドの UI とバックエンドの実行を同じ言語で扱えることが挙げられます。
エージェントは、リクエストを送って完了した結果を 1 回返すだけでは終わりません。思考やツール実行の途中経過をリアルタイムに画面へ同期したり、危険なツールを実行する前に一度止めて UI でユーザーの承認を受けて再開したり、天気カードや Diff 表示のようにツールの出力に応じて UI を出し分ける Generative UI を描画したりと、エージェントの内部状態がそのまま UI の状態になります。
このようにバックエンドの実行とフロントエンドの UI が密接に絡み合うからこそ、ツールの型定義から状態管理、UI の描画までを同じ TypeScript で一貫して扱える強みが活きます。実際、eve の `useEveAgent` や Flue の `@flue/react` のように、フレームワーク側もフロントエンド連携をセットで提供しています。
-->

---

## Web のエコシステムをそのまま活かせる

- Hooks や型システムなど、Web で磨かれた抽象化をそのまま持ち込める
- Zod や外部連携の SDK（Slack, Discord）など、npm のパッケージが豊富に揃っている
- Web 開発の延長線上で、エージェントの開発ができる

<!--
もう 1 つ大きな理由が、Web のエコシステムをそのまま活かせることです。
先ほど Hooks や型システムのように、Web 開発で長年磨かれてきた設計の資産がそのまま持ち込めます。また、npm には Zod や各種 API の SDK など、エージェントに外部と連携させるためのパッケージが豊富に揃っています。
そして何より JS/TS は利用者が多く、Web 開発者が新しい言語を一から学び直さずに、普段の延長線上でエージェントの作り手になれるのが大きな強みです。
-->

---

## まとめ

- モデルの進化により、**抽象化の重心がハーネスにも広がった**
- Web フレームワークの作者は、共通の複雑さを引き受ける**開発体験の設計**をしてきた
- 差がつく場所がモデルの外に移り、**UI 連携や Web のエコシステムを活かせる TypeScript** が強みになる

<!--
まとめです。
1 つ目、モデルの進化で、抽象化の重心がハーネスにも広がりました。
2 つ目、Web フレームワークの作り手は、認証や状態管理といった複雑さを引き受け、開発者が機能に集中できる環境を設計してきました。その経験がエージェントの実行基盤にも活きています。
3 つ目、差がつく場所がモデルの外に移ったことで、UI との密な連携や、設計資産・npm といった Web のエコシステムをそのまま活かせる TypeScript の強みが活きる場面が広がっています。ぜひ普段の Web 開発の延長線上で、エージェントを作る側にも踏み出してみてください。
-->

---

## 参考資料

- Vercel, [&quot;Introducing eve&quot;](https://vercel.com/blog/introducing-eve) (2026)
- Vivek Trivedy, [&quot;The Anatomy of an Agent Harness&quot;](https://langchain.com/blog/the-anatomy-of-an-agent-harness), LangChain Blog (2026)
- Sam Bhagwat, [&quot;A framework for the next million AI developers&quot;](https://mastra.ai/blog/the-next-million-ai-developers), Mastra Blog (2024)
- Sam Bhagwat, [&quot;Anatomy of a harness: building a coding agent that can run for hours&quot;](https://mastra.ai/blog/anatomy-of-a-coding-agent), Mastra Blog (2026)
- Sam Bhagwat, [&quot;Announcing Agent Controller&quot;](https://mastra.ai/blog/announcing-agent-harness), Mastra Blog (2026)
- Flue, [&quot;Flue 2.0&quot;](https://flueframework.com/blog/flue-2/)

<!--
参考資料です。今日紹介したフレームワークは、それぞれブログで詳しく試しているので、気になった方はぜひ読んでみてください。
-->
