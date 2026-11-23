# jsconfjp 2026 プロポーザル

## タイトル

Web フレームワークの作者たちはなぜ AI エージェントフレームワークを作るのか

### 別案

- ワークフローからハーネスへ — Web フレームワークの作者たちが AI エージェントに向かう理由
- ワークフローからハーネスへ — TypeScript AI エージェントフレームワークの現在地
- AI エージェントフレームワークはワークフローからハーネスへ、主役は TypeScript へ

## 枠

10分

## 想定聴衆

- AI エージェントを「使う」経験はあるが「作る」側は未経験の JS/TS エンジニア

## Talk Overview

Gatsby、Next.js、Astro といった著名な Web フレームワークの作者・開発元が、相次いで AI エージェントフレームワークを発表しています。なぜ Web フレームワークを作ってきた人たちが、いまエージェントに向かうのでしょうか？

LLM 活用の初期、フレームワークの役割は、LangChain / LangGraph に代表されるように「処理の流れ（ワークフロー）を組み立てる」ことでした。しかしモデルが長時間自律的に動けるようになった今、重心は「エージェントが安全に走り続けるためのハーネスを用意する」ことへ移っています。この転換を経て、エージェントに必要なもの（AI ツール、スキル、サンドボックス、Human-in-the-loop、耐久性）が見えてきたことで、各フレームワークは似た構成要素へと収斂しつつあります。

そして、これらの構成要素を作るうえでは、Web フレームワークが培ってきた知見がそのまま活きます。ファイルを 1 つ置けばツールが定義されるファイルベースの規約や、開発者体験を作る技術、そして抽象化のタイミングを見極める嗅覚などです。加えて、人間と UI（Web、チャット）で対話するというエージェントの仕事には、TypeScript エコシステムがそのまま使えます。Python が強かったこの領域で TypeScript が有力になりつつある理由もここにあります。

このトークでは、複数のフレームワークを実際に検証してきた経験をもとに、この収斂の流れを 10 分で紹介します。

## 構成メモ（10分）

1. フック（約1分）: Web フレームワーク周辺の作り手たちの系譜 — Gatsby のチーム→Mastra（2024）、Vercel / Next.js 文脈→eve（2026）、Astro creators→Flue（2026）
   - 本人たちの言葉を引用: eve "Agents today are where the web was before frameworks" / Mastra（Sam Bhagwat）「エージェント開発は 1996 年の Web サイト制作に似ている」
2. 本編（約6分）:
   - ワークフロー時代 — LangChain 模倣の TS フレームワーク。Mastra（2024）はこの時代の参入者（ワークフロー / エージェント / RAG / evals がプリミティブ、サンドボックスは持ち込み）
   - ハーネス時代への転換 — モデルの長時間自律動作が前提に。eve / Flue（2026）はハーネスを製品の中心に据える。用語の出典: Vivek Trivedy "The Anatomy of an Agent Harness"（LangChain ブログ、2026-03-10）"Agent = Model + Harness. If you're not the model, you're the harness."（Flue は OSS ハーネス Pi を採用 — ハーネスが共有レイヤーになりつつある証拠）
   - 収斂する構成要素は3群に束ねて紹介（深掘りは各群1つに絞る）:
     - 能力を与える: ツール / スキル / サブエージェント → 深掘り: スキル（eve も Flue も SKILL.md に収斂）
     - 安全に走らせる: サンドボックス / Human-in-the-loop / 耐久性 → 深掘り: サンドボックス（Flue は第一級プリミティブ、eve は Vercel Sandbox + プラガブル）
     - 改善し続ける: メモリ / オブザーバビリティ / 評価 / チャンネル
   - 収斂しつつ分岐もある（1行だけ）: 耐久性は eve（Vercel Workflow のチェックポイント）と Flue（Durable Streams の append-only ログ）で実装哲学が分かれる。デプロイ哲学も eve（Vercel 統合）と Flue（write once, deploy anywhere）で正反対
   - コードはスニペット1つまで（第一候補: Flue の `import triage from '../skills/triage/SKILL.md' with { type: 'skill' }` — Web 標準の import attributes の上にスキル規約が乗る。次点: ファイルベースのツール定義 `tools/<tool_name>.ts`）
3. 結論（約2分）: なぜ TypeScript か — 型によるツール定義、ファイルベースの規約、Web との接続性。eve 公式の類比「Next.js がフォルダをルートに変えたように、eve はファイルを能力に変える」で締める

## Biography

### 日本語

azukiazusa。フロントエンドエンジニア。ブログ「azukiazusa のテックブログ2」（https://azukiazusa.dev）にて、フロントエンドや AI エージェント開発に関する記事を毎週発信している。近年は MCP サーバー構築やコーディングエージェントの活用など、AI エージェントを「作る」側の登壇を多数行っており、JSConf JP には 2023・2024 に続き3度目の登壇となる。FE（フロントエンド | ファイアーエムブレム）が好き。

### English

azukiazusa is a frontend engineer who publishes weekly articles on frontend development and AI agents at https://azukiazusa.dev. Recently, they have given many talks on the "building" side of AI agents, including MCP server development and coding agent workflows. This will be their third appearance at JSConf JP, following talks in 2023 and 2024. They love FE — both FrontEnd and Fire Emblem.

## TODO

- [ ] jsconfjp 2026 CFP 要項の確認（文字数制限、日英併記の要否、枠の正式名称）
- [x] 「ハーネス」という言い換えが CFP レビュアーに通じるか → 出典付きで使う方針に解決（Flue 自身が "The First Agent Harness Framework" を名乗る。概念の出典は Vivek Trivedy "The Anatomy of an Agent Harness"（LangChain ブログ、2026-03-10、https://langchain.com/blog/the-anatomy-of-an-agent-harness）。※当初 Mario Zechner の言葉としていたが誤り（2026-10-12 確認）
- [x] eve / Flue の名称・作者の対応関係の再検証（eve: Vercel が 2026-06-17 の Ship 26 で発表、Apache-2.0 公開ベータ、リポジトリは vercel/eve。Flue: Astro 共同創作者 Fred K. Schott が 2026-05-01 公開・06-16 に 1.0 Beta、リポジトリは withastro/flue。※eve は特定の Next.js 作者個人ではなく Vercel 社の発表 — スライドでは「作者・開発元」と表記する）
- [ ] VoltaAgent の最新状況の再検証
- [ ] 必要なら overview の英訳

## 調査メモ（2026-07-06 増強材料）

- eve 公式: "Just as Next.js turns a folder into a route by owning the routing, eve turns a file into an ability by owning the agent loop." / "Agents today are where the web was before frameworks"（https://vercel.com/blog/introducing-eve）
- eve のファイル規約: `agent/` 配下に `agent.ts` / `instructions.md` / `tools/` / `skills/` / `channels/` / `schedules/`。「ツールは TS ファイル1つ、スキルは Markdown ファイル1つ」（https://github.com/vercel/eve）
- Flue: OSS ハーネス Pi（OpenClaw でも使用）を採用。サンドボックスが第一級プリミティブ（local / virtual / Daytona / Cloudflare）。Durable Streams（append-only ログが真実の源）。チャンネル（@flue/slack 等）。起点は Astro リポジトリの issue トリアージ自動化 — 実装先行で抽象化（https://flueframework.com, https://www.thedeepfeed.ai/posts/2026-05-02-flue-agent-harness-framework/）
- Flue のスキル取り込み: `import triage from '../skills/triage/SKILL.md' with { type: 'skill' }` — ビルド時に型検証
- Mastra: Gatsby 共同創業者 Sam Bhagwat（CEO）・Abhi Aiyer・Shane Thomas が 2024 年創業。TypeScript ファースト、プリミティブはワークフロー / エージェント / RAG / evals。サンドボックスは持ち込み → 「ワークフロー時代の参入者」として時系列に置くのが正確（https://mastra.ai/about, https://www.ycombinator.com/companies/mastra）
- Bhagwat の類比「AI エージェント開発は 1996 年の Web サイト制作」（https://thehomebase.beehiiv.com/p/why-building-ai-agents-today-feels-like-coding-websites-in-1996-40e46d080c1c10ff）
