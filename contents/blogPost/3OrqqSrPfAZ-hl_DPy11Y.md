---
id: 3OrqqSrPfAZ-hl_DPy11Y
title: "Safari MCP サーバーでエージェントが Safari ブラウザを操作できるようにする"
slug: "safari-mcp-server"
about: "Web アプリケーションの開発においては、実ブラウザでの動作確認やデバッグが必要不可欠です。そのために Playwright CLI, agent-browser, chrome-devtools-mcp などエージェントにブラウザを操作させるためのツールが数多く提供されています。Safari Technology Preview 247 で導入された MCP サーバーはエージェントが Safari ブラウザに接続することができるようにするための MCP ツールを提供しており、ユーザー操作のエミュレートやページ内容の取得、ネットワークリクエストの取得などを行うことができます。"
createdAt: "2026-07-04T20:36+09:00"
updatedAt: "2026-07-04T20:36+09:00"
tags: ["MCP", "safari"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4U7FcNQbqpUDcqJlUOJ0VA/f40a29edc0e67100247a2e7e102bb5b0/houi-jishaku_compass_8771.png"
  title: "コンパスのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Safari MCP サーバーの起動に利用されている、macOS に標準搭載されている CLI ツールとして記事で説明されているのはどれですか?"
      answers:
        - text: "chromedriver"
          correct: false
          explanation: "chromedriver は Chrome 系ブラウザ向けの WebDriver 実装であり、記事で紹介されている Safari 用のツールではありません。"
        - text: "webkitdriver"
          correct: false
          explanation: "記事にそのような名前のツールは登場しません。紹介されているのは safaridriver です。"
        - text: "safaridriver"
          correct: true
          explanation: "記事の通り、safaridriver は macOS に標準でインストールされている WebDriver 実装で、`--mcp` オプション付きで起動することで WebDriver プロトコルではなく MCP サーバーとして起動されます。"
        - text: "safari-mcp-cli"
          correct: false
          explanation: "これは `claude mcp add` コマンドで指定する MCP サーバー名（safari-mcp-stp）と紛らわしいですが、実際に起動される CLI ツールは safaridriver です。"

published: true
---

コーディングエージェントの開発ワークフローにおいて、適切にフィードバックを得られる環境を提供することの重要性は十分に語られ尽くされているかと思います。特に Web アプリケーションの開発においては、実ブラウザでの動作確認やデバッグが必要不可欠です。そのために [Playwright CLI](https://github.com/microsoft/playwright-cli), [agent-browser](https://github.com/vercel-labs/agent-browser), [chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) などエージェントにブラウザを操作させるためのツールが数多く提供されています。

しかしながら、現時点で提供されているツールの多くは、Google Chrome や Chromium ベースのブラウザに依存しているという課題があります。ブラウザによっては、Web 標準の実装や挙動が異なる場合があったり、特定のブラウザでしか利用できない API が存在する場合があるため、サポート対象としているすべてのブラウザで動作確認を行うことが従来の開発手順における常識でした。そのためたとえエージェントがブラウザ自動化ツールを使用して動作確認を行ったとしても、実際のユーザーが使用するブラウザでの挙動を正確に把握することは困難でした。

Safari Technology Preview 247 で導入された MCP サーバーはこの課題を解決することが期待されています。Safari MCP サーバーはエージェントが Safari ブラウザに接続することができるようにするための MCP ツールを提供しており、ユーザー操作のエミュレートやページ内容の取得、ネットワークリクエストの取得などを行うことができます。これにより、Safari ブラウザでの動作確認やデバッグをエージェントが自動で行えるようになり、エージェントが自律的に動作するための環境を提供することが可能になります。

この記事では、Safari MCP サーバーを有効にする手順と、エージェントが Safari ブラウザを操作するためのツールの使い方について解説します。

## Safari MCP サーバーを有効にする

:::info
Safari MCP サーバーは macOS 上の Safari Technology Preview でのみ動作する機能です。Windows や Linux など他の OS でも利用できません。
:::

Safari MCP サーバーを使用するためには、Safari Technology Preview 247 以降をインストールする必要があります。Safari Technology Preview は、Apple が提供する Safari の開発者向けプレビュー版であり、新しい機能や改善点をテストするために使用されます。以下のリンクから OS バージョンに応じた Safari Technology Preview をインストールしてください。アイコンが紫色になっている点が目印です。

https://developer.apple.com/safari/resources/

インストール後 Settings > Advanced > Show features for web developer を有効にする必要があります。

![](https://images.ctfassets.net/in6v9lxmm5c8/1uG4k78kmmiQ6JVpFZlg3W/dd59959d7725d4038ebc2c99762ee991/image.png)

Show features for web developer を有効にすると、Safari のメニューに Develop メニューが表示されます。Settings > Developer > Enable remote automation and external agents も同様に有効にします。

![](https://images.ctfassets.net/in6v9lxmm5c8/2PBAafozbREelsxmfELi3f/05177f591835cb7db72a90d721f1a2be/image.png)

Claude Code を使用している場合には以下のコマンドで Safari MCP サーバーを追加できます。

```bash
claude mcp add safari-mcp-stp -- "/Applications/Safari Technology Preview.app/Contents/MacOS/safaridriver" --mcp
```

`safaridriver` は macOS に標準でインストールされている WebDriver 実装であり、Safari を WebDriver プロトコル（ブラウザの自動操作を行うための標準化されたプロトコル）で操作するための CLI ツールです。Safari MCP サーバーは、`safaridriver` を `--mcp` オプション付きで起動することで WebDriver プロトコルではなく MCP サーバーとして起動されます。なお、単に `safaridriver` を起動した場合は通常の Safari を操作するように動作するため、`"/Applications/Safari Technology Preview.app/Contents/MacOS/safaridriver"` のように Safari Technology Preview のパスを指定する必要があります。

`/mcp` コマンドで Safari MCP サーバーが追加されていることを確認してみましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/5QJoQktmRpfLcwQK61Aoax/1ef3e9b843ab9e9c7ef0fc80fa712e31/image.png)

Safari MCP サーバーが提供するツールの一覧は以下の通りです。

### タブ操作
- list_tabs — 開いているタブの一覧を取得
- create_tab — 新しいタブを作成（URL を指定して開くことも可能）
- switch_tab — 指定した `handle`（各タブ固有の識別子）のタブに切り替え
- close_tab — 指定した `handle` のタブを閉じる

### ナビゲーション
- navigate_to_url — URL に遷移し、読み込み後のページ内容を取得
- wait_for_navigation — ページの読み込み完了を待機
- page_info — 現在のページの URL・タイトル・読み込み状態を取得

### ページ内容の取得
- get_page_content — WebKit のテキスト抽出でページ内容を取得（スクリーンショットや DOM スクレイピングより推奨）
- screenshot — ページのスクリーンショットを PNG で保存（見た目自体の確認が必要な場合のみ推奨）

### 操作・実行
- page_interactions — クリック・入力・スクロール・ホバーなどの DOM 操作をまとめて実行
- evaluate_javascript — ページ内で JavaScript を実行（get_page_content で対応できない処理向け）

### デバッグ・診断
- browser_console_messages — コンソールログを取得
- list_network_requests / get_network_request — ネットワークリクエストの一覧・詳細を取得
- browser_dialogs — ブラウザのダイアログ（alert/confirm/prompt など）の状態を確認し、必要に応じて閉じる

### 表示設定
- set_viewport_size — ビューポートサイズ（CSS ピクセル）を設定
- set_emulated_media — CSS メディアタイプ（screen/print など）をエミュレート

## Safari MCP サーバーを使用してエージェントが Safari ブラウザを操作する

エージェントが Safari ブラウザを操作する例として、例えば「azukiazusa.dev は safari でアクセシブルな実装になっていますか？」というプロンプトを Claude に送信してみましょう。まずは `safari-mcp-stp` の `navigate_to_url` コマンドを使用して、Safari Technology Preview で azukiazusa.dev にアクセスします。

![](https://images.ctfassets.net/in6v9lxmm5c8/1XiUedoOFjaFJUtFSQz57b/a1109cb2c4c4af009664e7a8c8ad36c9/image.png)

エージェントにより Safari ブラウザが自動で開かれ、azukiazusa.dev にアクセスされています。

![](https://images.ctfassets.net/in6v9lxmm5c8/1XSpiMQl8xRONrNHIAXnuM/f98610429b0575c584a99b05a6cbb369/8bf1865e-50ee-434d-ae7f-7f13582cffef.png)

その後 `get_page_content` ツールと `evaluate_javascript` ツールを使用して、ページのコンテンツを取得します。また `page_interactions` ツールで特定の要素にフォーカスができるかどうかなども確認しています。

もう 1 つの例として、エージェントに適当な Web アプリケーションを作成させ、Safari ブラウザでの動作確認を行わせてみます。React で単純なフライト運航リカバリーダッシュボードを作ってもらいました。

![](https://images.ctfassets.net/in6v9lxmm5c8/4MkyFYEl8QdJcnyBR64dbG/bd6b4b76e7fa5b050b4e6119d98a7a06/image.png)

アプリケーションを作成してもらった後に、「Safari MCP サーバーを使用してこのアプリケーションが Safari で正しく動作するか確認してください」といったプロンプトを送信してみます。以下のような手順でエージェントが Safari ブラウザを操作して動作確認を行います。

はじめに `navigate_to_url` ツールで 127.0.0.1:5173 にアクセスし、`page_info` ツールでページタイトルと URL を取得します。次に `get_page_content` ツールでページ内容を取得し、フォームの入力欄やボタンなどの要素が正しくレンダリングされているかを確認します。

```
mcp_tool_call safari-mcp-stp.navigate_to_url
arguments: { "url": "http://127.0.0.1:5173/" }

mcp_tool_call safari-mcp-stp.page_info
arguments: {}
result: { "title": "SkyDesk Ops", "url": "http://127.0.0.1:5173/" }

mcp_tool_call safari-mcp-stp.get_page_content
arguments: {
  "format": "textTree",
  "region": "entire_page",
  "nodeIds": "interactive",
  "includeAccessibilityAttributes": true,
  "includeSelectOptions": true,
  "maxWordsPerParagraph": 50
}
```

続いて取得した ID を使用して、`page_interactions` ツールでフォームの入力欄に自動で値を入力させます。以下の例では、フライト番号 WK181 を選択し、遅延マークを付け、次の乗客のケースを解決する操作を行っています。

```
mcp_tool_call safari-mcp-stp.page_interactions
arguments: {
  "interactions": [
    { "type": "click", "node": "57", "purpose": "Select flight WK181 from Active Departures" },
    { "type": "click", "node": "61", "purpose": "Mark the selected WK181 flight delayed" },
    { "type": "click", "node": "228", "purpose": "Resolve the next passenger case for the selected flight" }
  ],
  "fullText": true
}
result:
- requested: 3
- successful: 3
- WK181 row changed to Delayed
- Open service cases changed from 3 to 2
```

操作の内容はツールの引数 `interactions` の配列にまとめて指定しています。1 つ目の操作は `node` 57 の要素をクリックする操作です。`node` は `get_page_content` ツールで取得したページ要素の ID です。これを使用して正確な要素を指定してインタラクションを行っています。`purpose` は操作の目的を説明する文字列で、エージェントが操作の意図を理解するために使用されます。

実際にフォームに自動で入力されていく様子も確認できますね。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/Mycr6hR8vsnehSOHdbaDf/d8ad143bdac9179ee572ca0ece7a7e3d/63b219f7-143a-405b-9afb-8fdb62c443ad.mov" controls></video>

その他にも、`browser_console_messages` ツールでコンソールログを取得したり、ブラウザのスクリーンショットを取得するといった操作も行っていました。

```
mcp_tool_call safari-mcp-stp.browser_console_messages
result included:
- flight-selected
- flight-status-change
- passenger-resolution
```

```
mcp_tool_call safari-mcp-stp.screenshot
arguments: {
  "savePath": "/Users/xxx/Documents/mcp-test/safari-mcp-project-mcp.png",
  "full_page": true
}
result:
Saved screenshot to '/Users/xxx/Documents/mcp-test/safari-mcp-project-mcp.png' (99.3 kB)
```

## まとめ

- Safari Technology Preview 247 で導入された Safari MCP サーバーにより、エージェントが Chromium ベースのツールに頼らず Safari ブラウザを直接操作できるようになった
- `"/Applications/Safari Technology Preview.app/Contents/MacOS/safaridriver" --mcp` コマンドで `safaridriver` を MCP サーバーとして起動することで、エージェントが Safari ブラウザに接続できるようになる
- タブ操作・ナビゲーション・ページ内容の取得・DOM 操作・デバッグ診断・表示設定など、実際のブラウザ自動化に必要な一通りの MCP ツールが提供されている
- 実際に azukiazusa.dev のアクセシビリティ確認や、自作 Web アプリケーションの Safari での動作確認をエージェントに行わせることができた

## 参考

- [Introducing the Safari MCP server for web developers | WebKit](https://webkit.org/blog/18136/introducing-the-safari-mcp-server-for-web-developers/)
