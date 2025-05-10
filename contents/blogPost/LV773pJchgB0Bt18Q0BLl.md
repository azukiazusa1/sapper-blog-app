---
id: LV773pJchgB0Bt18Q0BLl
title: "Docker の MCP Toolkit を試してみる"
slug: "docker-mcp-toolkit"
about: "Docker の MCP Toolkit はコンテナ化された MCP サーバーを AI エージェントと統合するための Docker Desktop の拡張機能です。コンテナ化された環境で MCP サーバーを実行することができ、信頼された Docker MCP カタログから MCP ツールを簡単にインストールできる点が特徴です。"
createdAt: "2025-05-10T10:10+09:00"
updatedAt: "2025-05-10T10:10+09:00"
tags: ["Docker", "MCP"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/QahuXD6UYMZ6846tZWCk5/9649462058c020fc385e99b95e5c686d/flower_ajisai_illust_3204.png"
  title: "アジサイのイラスト"
audio: "https://downloads.ctfassets.net/in6v9lxmm5c8/5ZYmQlO6xowLavV5nENDS7/6ddec432ffc9e2e52c735654e4bb877e/Docker_MCP_Toolkit_%E5%85%A5%E9%96%80.wav"
selfAssessment:
  quizzes:
    - question: "Docker の MCP Toolkit を使用した場合にクライアントに追加される設定は何ですか？"
      answers:
        - text: "MCP_DOCKER"
          correct: true
          explanation: "Docker の MCP Toolkit を使用すると、クライアントに MCP_DOCKER という設定が追加されます。"
        - text: "MCP_TOOLKIT"
          correct: false
          explanation: ""
        - text: "PLAYWRIGHT"
          correct: false
          explanation: ""
        - text: "DOCKER"
          correct: false
          explanation: ""

published: true
---

Docker の MCP Toolkit はコンテナ化された MCP サーバーを AI エージェントと統合するための Docker Desktop の拡張機能です。従来ローカルで MCP サーバーを実行するためには JavaScript の `npm` や Python の `uv` といったパッケージ管理ツールを使用して直接コマンドを実行する方法が一般的でした。サンドボックス化されていない環境での実行はセキュリティ上のリスクがあり、また配布されている MCP サーバーは信頼できないものも多く存在しています。

Docker の MCP Toolkit を使用することでコンテナ化された環境で MCP サーバーを実行することができ、信頼された [Docker MCP カタログ](https://hub.docker.com/catalogs/mcp) から MCP ツールを簡単にインストールできます。また Claude Desktop や VS Code、Cursor といったクライアントとの統合も簡単に行えます。

この記事では Docker Desktop の MCP Toolkit を使用して、MCP サーバーをローカルで実行する方法を紹介します。

## MCP Toolkit 拡張機能のインストール

MCP Toolkit を使用するためには前提として Docker Desktop が必要です。Docker Desktop をインストールしていない場合は下記のリンクからインストールしてください。

https://www.docker.com/ja-jp/products/docker-desktop/

Docker Desktop をインストールしたら、MCP Toolkit 拡張機能をインストールします。Docker Desktop のメニューから「Extensions」を選択し、「MCP Toolkit」を検索してインストールします。

![](https://images.ctfassets.net/in6v9lxmm5c8/6FYTJ7wPhlHpDlLPVbBnOx/67d96ae7a8bf474ac5dc2c23ede879fa/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-05-10_10.57.21.png)

「Extensions」の下に「MCP Toolkit」が表示されていればインストールは成功です。これをクリックするとインストール可能な MCP サーバーの一覧が表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/7j9nEZ0Lvcf2Sl4n0eGk6W/410db81114bda854652dd9fa4cd7a420/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-05-10_10.59.58.png)

ここでは「Playwright」をインストールしてみましょう。これは Playwright を使用してブラウザを操作するためのツールです。トグルスイッチをオンにすると MCP サーバーが提供するツールが利用可能になります。

## MCP クライアントとの統合

Claude Desktop や VS Code、Cursor などのクライアントとの統合も Docker Desktop の GUI 上から簡単に行えます。上部の「MCP Clients」タブをクリックすると、MCP クライアントの一覧が表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/1gvVZ3RFLFMmGbKHLJFHKl/51368cf485b8431170d32ecd0613972a/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-05-10_11.04.54.png)

「Claude Desktop」を選択してみましょう。「Connect」ボタンをクリックするだけで接続が完了します。Claude Desktop の「Settings」→「Developer」を開くと、「MCP_DOCKER」が MCP サーバーとして追加されていることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/4ekYzO6D3jInUYq45odgsb/c1fb2b7bd91aaee6226fbd0c966ed93f/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-05-10_11.14.45.png)

`claude_desktop_config.json` を確認すると以下の設定が追加されています。

```json
{
  "mcpServers": {
    "MCP_DOCKER": {
      "command": "docker",
      "args": [
        "run",
        "-l",
        "mcp.client=claude-desktop",
        "--rm",
        "-i",
        "alpine/socat",
        "STDIO",
        "TCP:host.docker.internal:8811"
      ]
    }
  }
}
```

実際に Playwright のツールが使用できるか確認してみましょう。「azukiazusa.dev の人気記事を取得して」とプロンプトを入力してみます。Playwright の `browser_navigate` ツールを使用して azukiazusa.dev にアクセスし情報を取得していることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/6r4kA11Pt7Ckxrmns1D6gk/fffc75eaa89f59fbbc03bd62b023435e/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-05-10_11.18.59.png)

## まとめ

- Docker Desktop の MCP Toolkit を使用することで、コンテナ化された環境で MCP サーバーを実行することができる
- MCP ツールのインストールやクライアントとの統合が簡単に行える

## 参考

- [MCP Toolkit | Docker Docs](https://docs.docker.com/ai/mcp-catalog-and-toolkit/toolkit/)
- [MCP カタログとツールキットのご紹介 | Docker](https://www.docker.com/ja-jp/blog/introducing-docker-mcp-catalog-and-toolkit/)
