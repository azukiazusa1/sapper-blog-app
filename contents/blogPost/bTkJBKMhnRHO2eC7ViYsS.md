---
id: bTkJBKMhnRHO2eC7ViYsS
title: "Claude Code to Figma を使ってコードから Figma デザインを生成する"
slug: "claude-code-to-figma"
about: "Claude Code to Figma はコードから Figma デザインを生成するための機能です。Figma MCP サーバーの `generate_figma_design` ツールを使用して、ローカルで開発したコードから Figma デザインを生成して、さらに Figma 上で編集した内容をコードに反映させるという双方向のワークフローが実現できるようになります。"
createdAt: "2026-02-18T19:22+09:00"
updatedAt: "2026-02-18T19:22+09:00"
tags: ["figma", "MCP", "claude-code"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1adtTg9EPyssxYYp0INYN3/e11509f623c5f059b056a5b8cbcf804a/okosama-lunch_shinkansen_11368-768x542.png"
  title: "新幹線のお子様ランチのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "ページをキャプチャして Figma デザインを作成する MCP ツールの名前として正しいものはどれか？"
      answers:
        - text: "create_figma_design"
          correct: false
          explanation: null
        - text: "capture_page_design"
          correct: false
          explanation: null
        - text: "figma_design_generator"
          correct: false
          explanation: null
        - text: "generate_figma_design"
          correct: true
          explanation: ""
    - question: "既存の Figma ファイルにデザインを生成する場合、`outputMode` に指定する値はどれか？"
      answers:
        - text: "existingFile"
          correct: true
          explanation: '既存の Figma ファイルに対してデザインを生成する場合は `outputMode="existingFile"` を指定し、引数に `fileKey` と `nodeId` を指定します。'
        - text: "newFile"
          correct: false
          explanation: "`newFile` は新しい Figma ファイルを作成する場合に使用します。"
        - text: "appendFile"
          correct: false
          explanation: null
        - text: "updateFile"
          correct: false
          explanation: null

published: true
---

[Figma MCP サーバー](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server) に新しいツールがリリースされ、ブラウザ上の UI からコードを Figma デザインに変換できるようになりました。これにより、ローカルで開発したコードから Figma デザインを生成して、さらに Figma 上で編集した内容をコードに反映させるという双方向のワークフローが実現できるようになります。この記事では実際のコードから Figma デザインを生成する方法を試してみます。

## Figma MCP サーバーのセットアップ

実際のコードから Figma デザインを生成する機能は Figma MCP サーバーの [generate_figma_design](https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/#generate_figma_design) ツールを使用して実現されます。Figma MCP サーバーは[リモートサーバー](https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/)と[デスクトップサーバー](https://developers.figma.com/docs/figma-mcp-server/local-server-installation/)の 2 種類が提供されていますが、`generate_figma_design` ツールはリモートサーバーでのみ利用可能です。また `generate_figma_design` ツールは Claude Code でのみ利用可能なツールとなっています。

Figma MCP サーバーのリモートサーバーをセットアップするには、以下のコマンドを実行します。

```bash
claude mcp add --transport http figma https://mcp.figma.com/mcp
```

セットアップが完了すると `~/.claude/settings.json` ファイルに以下のような設定が追加されます。

```json:~/.claude/settings.json
{
  "mcpServers": {
    "figma": {
      "type": "http",
      "url": "https://mcp.figma.com/mcp"
    }
  }
}
```

Claude Code を起動した後に `/mcp` コマンドを実行して Figma MCP サーバーが追加されていることを確認します。

![](https://images.ctfassets.net/in6v9lxmm5c8/6psiAQ4X4nsKyjIx34TsJn/d82cb6cd9aa8db8aaef2540d8aad595d/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-18_19.45.03.png)

「△ needs authentication」と表示されている場合は、Figma MCP サーバーへの認証が必要な状態です。`figma` を選択してから「1. Authenticate」を選択して認証します。

![](https://images.ctfassets.net/in6v9lxmm5c8/djpElsqqpwT3n9gEsUoF5/2ee4511175c693eaa6f6add2cea86d02/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-18_19.46.35.png)

ブラウザが開き、Claude Code へのアクセス許可を求められるので「同意してアクセスを許可する」をクリックします。

![](https://images.ctfassets.net/in6v9lxmm5c8/4iQv9Ro6uBhNONeJKmG9sS/f723f3c1a476adc57a6f5957e16da234/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-18_19.47.38.png)

認証が完了すると、Figma MCP サーバーのステータスが「✔ connected」に変わります。

## コードから Figma デザインを生成する

Figma MCP サーバーの `generate_figma_design` ツールを使用してコードから Figma デザインを生成するには、以下のようなプロンプトで Claude Code に指示します。

```text
アプリのローカルサーバーを起動して、新しい Figma ファイルにトップページのデザインを生成してください。
```

はじめに `generate_figma_design` ツールを使用して、新しい Figma ファイルを作成します。引数として `outputMode="newFile"`, `planKey`, `fileName` を指定しています。

```sh
⏺ figma - generate_figma_design (MCP)(outputMode: "newFile", planKey: "team::xxxxx", fileName: "azukiazusa Blog - Top Page Design")
```

新しい Figma ファイルが作成されると、capture ID が生成され返されます。この capture ID はブラウザで実行される JS スニペットをどの Figma ファイルと紐づけるかを識別するための ID です。

続いてトップページのデザインを生成するために、ローカルサーバーを起動して、トップページの URL を開きます。このとき `/#figmacapture=8782a0a8-a5b6-44d1-a1ab-85a1cbbdd380` のように capture ID が URL のハッシュに含まれた状態でページが開かれます。

その後 Figma がページの内容をキャプチャできるように JavaScript が一時的に挿入されます。ステージング環境のページのようにコードを編集してスクリプトを挿入できない場合は、Playwright のようなブラウザ自動化ツールを使用してスクリプトの挿入もできます。

```html
  <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>
</head>
```

キャプチャに成功すると、`generate_figma_design` ツールを `captureId` を引数にして呼び出します。その後、Figma ファイルの URL が返されます。

```sh
⏺ figma - generate_figma_design (MCP)(captureId: "xxxx")
  ⎿  Your Figma file has been generated:
     https://www.figma.com/integrations/claim/xxxx
```

生成された Figma ファイルを開くと、トップページのデザインが生成されていることがわかります。最低限のレイヤー名がつけられており、Auto Layout も適用されています。

![](https://images.ctfassets.net/in6v9lxmm5c8/2p9EvR6lOLQon6fuYsQ5D8/2cf217c24f351e37bc784b3d968ed817/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-18_20.14.55.png)

UI の特定の部分だけを選択してデザインも生成できます。既存の Figma ファイルの URL を指定しつつ、ブログ一覧のページネーションの部分だけを選択してデザインを生成してもらいましょう。

```txt
ブログ一覧 http://localhost:5173/blog にアクセスして、ページネーションの部分だけを選択して、Figma ファイル https://www.figma.com/design/xxxx/ にデザインを生成してください。
```

すでに存在する Figma ファイルに対してデザインを生成する場合は、`outputMode="existingFile"` を指定し、引数に `fileKey` と `nodeId` を指定します。その後 capture ID が生成される流れは同じです。

```sh
⏺ figma - generate_figma_design (MCP)(outputMode: "existingFile", fileKey: "xxx", nodeId: "0:3")
```

ページネーションの部分を取得するために、CSS セレクタ `nav[aria-label="ページネーション"]` を使用します。URL に `&figmaselector=nav%5Baria-label` といった形でセレクタを指定することで、特定の要素だけを選択してデザインを生成できます。

またキャプチャスクリプトによって挿入される上部のナビゲーションバーからも特定の要素を手動で選択してデザインを生成できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/6gKPnGTpofEb2bKZiZujqf/3d1e61f0ebdc0c7e24913c8f8fef7c28/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-18_20.44.37.png)

![](https://images.ctfassets.net/in6v9lxmm5c8/7DCPYzimiizkT7OHaVd56W/77acee102ff19368d9b674d742792fd3/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-18_20.44.47.png)

ページネーションコンポーネントと、手動で選択したヘッダーコンポーネントの両方が Figma 上に生成されました。

![](https://images.ctfassets.net/in6v9lxmm5c8/5B17vTD3x7YN6poCQ0bap9/24bb5793666ba7c25e214b416d83f1d1/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-18_20.46.17.png)

`generate_figma_design` ツールを使用して生成されるデザインはどれも再現度が高いものでした。ただし Figma 上で Variant や Component などの構造は生成されないため、自動生成されたデザインファイルをベースにデザインシステムを運用するといった使い方は想定されていないようです。1 つのセッションの中で素早く開発とデザインの修正を繰り返すといった使い方が想定されているのではないでしょうか。

例えば開発者がローカルでコードを修正した際に、デザイナーにローカルでアプリケーションをビルドして確認してもらうといった開発フローはよくあると思いますが、これは案外手間がかかるものです。コードから Figma デザインを生成する機能を使用すれば、ローカルでコードを修正した後に Figma 上でも素早く変更内容を確認できるようになります。デザイナーはコードを変更するよりも Figma 上でデザインを確認・修正する方が慣れているでしょうし、何より誰でも簡単にアクセスできる Figma のキャンバス上でコミュニケーションを取れるようになるのは大きなメリットだと思います。

## まとめ

- Figma MCP サーバーにコードから Figma デザインを生成するツール `generate_figma_design` が追加された
- `generate_figma_design` ツールはリモートサーバーかつ、Claude Code でのみ利用可能
- 開発サーバーを起動して URL を指定することで、コードから Figma デザインを生成できる
- ページ全体をキャプチャしてデザインを生成するほか、特定の要素だけを選択してデザインを生成することも可能
- コードから Figma デザインを生成することで、開発者とデザイナーの間で素早くデザインの確認や修正ができるようになる

## 参考

- [From Claude Code to Figma: Turning Production Code into Editable Figma Designs | Figma Blog](https://www.figma.com/blog/introducing-claude-code-to-figma/)
- [Tools and prompts - generate_figma_design](https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/#generate_figma_design)
- [Guide to the Figma MCP server](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server)
