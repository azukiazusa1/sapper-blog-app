---
marp: true
theme: gaia
class: 
  - invert
  - lead
colo: "#c2c2c2"
backgroundColor: "#181818"

style: |
  .cloudflare {
    color: #f8821f;
  }
  h1 {
    color: #fff;
    font-size: 56px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 40px;
  }
  h2 {
    color: #fff;
    font-size: 40px;
    font-weight: bold;
    margin-bottom: 30px;
  }
  h3 {
    color: #fff;
  }
  p, li {
    text-align: left;
  }
  li {
    margin: 0.5rem 0 !important;
  }
  a {
    color: #f8821f;
    text-decoration: underline;
  }
---

# バイブコーディング超えてバイブデプロイ

### 〜<span class="cloudflare">Cloudflare</span> MCPで実現する、未来のアプリケーションデリバリー〜

Workers Tech Talks in Kyoto #1

---

# 自己紹介

- azukiazusa
- https://azukiazusa.dev
- FE（フロントエンド|ファイアーエムブレム）が好き

![bg right:40% w:300px](./images/azukiazusa.png)

<!-- はじめに簡単に自己紹介です。普段 azukiazusa という名前で活動していています。azukiazusa.dev というブログを運営してフロントエンドや AI 関連の記事を書いています。
好きなものはフロントエンドとファイアーエムブレムです。 -->
---

# バイブコーディング

---

# バイブコーディングとは？

AIエージェントが自律的にコードを生成・実行する技術

- AI に自然言語で指示を出す 
- AI エージェントが主体になってアプリケーションの開発を進める
- 雰囲気・フィーリング・ノリ

---

# Cloudflareの特徴

---

# Cloudflareの特徴

## <span class="cloudflare">驚異的なデプロイの簡単さ</span>

---

ドキュメントのボタンをクリックするだけでデプロイを開始

![bg right:60% w:700px](./images/deploy-button.png)

---

# もっと気軽にデプロイしたい

バイブコーディングのようなノリで...

---

# Cloudflare MCP

13の新しいMCPサーバーを提供

![bg right:60% w:700px](./images/mcp-servers.png)

https://blog.cloudflare.com/ja-jp/thirteen-new-mcp-servers-from-cloudflare/

---

# MCPとは？

- LLMが外部システムと連携するためのプロトコル
- AIエージェントが様々なサービスを直接操作可能

---

# Workers Bindings Server

## LLMから直接Cloudflare Workerへデプロイ

- AIエージェントがWorkerを作成
- 設定もデプロイも自動化
- **真の「バイブデプロイ」**

---

# 実際にやってみよう！

## ライブコーディングデモ

AIエージェントと一緒に
Cloudflare Workerをデプロイしてみます

---

# Claude Code に MCP サーバーを追加

```sh
claude mcp add --transport sse --name "Cloudflare Workers" --url "https://bindings.mcp.cloudflare.com/sse"
```
---

# まとめ

- バイブコーディングはAIエージェントが主体となる開発スタイル
- Cloudflare MCP は LLM から Cloudflare のリソースにアクセスしたり、作成・削除するためのツールを提供
- Cloudflare MCP の Workers Bindings Server により、AIエージェントが直接Workerをデプロイ可能

---
