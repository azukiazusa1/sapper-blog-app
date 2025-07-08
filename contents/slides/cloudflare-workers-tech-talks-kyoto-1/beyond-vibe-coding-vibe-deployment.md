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
  pre {
    background-color: #313131;
    border: 1px solid #494949;
    border-radius: 4px;
  }
  .blur-content {
    filter: blur(3px);
    opacity: 0.4;
  }
  .cloudflare-arrow {
    position: absolute;
    top: 65%;
    left: 30%;
    transform: translateY(-50%);
    color: #f8821f;
    font-size: 32px;
    font-weight: bold;
    z-index: 10;
    background-color: rgba(24, 24, 24, 0.9);
    padding: 10px 15px;
    border-radius: 8px;
    border: 2px solid #f8821f;
  }
  .cloudflare-arrow::before {
    content: "↖ ";
    margin-left: 5px;
  }
---

# バイブコーディング超えてバイブデプロイ

### 〜<span class="cloudflare">Cloudflare</span> MCPで実現する、未来のアプリケーションデリバリー〜

Workers Tech Talks in Kyoto #1

---


<h1 class="blur-content">自己紹介</h1>

<ul>
  <li class="blur-content">azukiazusa</li>
  <li>https://azukiazusa.dev</li>
  <li class="blur-content">FE（フロントエンド|ファイアーエムブレム）が好き</li>
</ul>

![bg right:40% w:300px blur opacity](./images/azukiazusa.png)


<div class="cloudflare-arrow">Cloudflare Workers</div>

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
claude mcp add --transport sse -s project  "Cloudflare Workers" "https://bindings.mcp.cloudflare.com/sse"
```
---

# .mcp.json ファイルが生成される

```json
{
  "mcpServers": {
    "Cloudflare Workers": {
      "type": "sse",
      "url": "https://bindings.mcp.cloudflare.com/sse"
    }
  }
}
```

# 認証

`/mcp` コマンドで認証が必要

![bg right:60% w:700px](./images/mcp-auth.png)

# Cloudflare の認証画面

![bg right:60% w:700px](./images/cloudflare-auth.png)

# プロンプト

```plaintext
Claude Codeを使って、URL短縮サービスをCloudflare Workers + KVストレージで実装してデプロイしてください。

要件：
- Hono を使ってHTTPサーバーを実装
- web UI で短縮URLを生成
- Cloudflare KVを使ってURL情報を保存
- 短縮コードは6文字のランダムな英数字
```

---

![](./images/prompt.png)

---

# KV が MCP を通じて生成される

![](./images/kv-created.png)

---

# wrangler deploy で Worker をデプロイ

![](./images/worker-deploy.png)

---

# Worker のデプロイが完了

![](./images/worker-deployed-success.png)

---

# URL短縮サービスの完成

![](./images/short-url-service.png)

---

# まとめ

- バイブコーディングはAIエージェントが主体となる開発スタイル
- Cloudflare MCP は LLM から Cloudflare のリソースにアクセスしたり、作成・削除するためのツールを提供
- Cloudflare MCP の Workers Bindings Server により、AIエージェントが直接Workerをデプロイ可能

---
