---
id: Ad4yNkb37AZq-3TzpRpdO
title: "ワンクリックで MCP サーバーをインストールする .dxt ファイル"
slug: "one-click-mcp-server-installation-dxt-file"
about: "Model Context Protocol (MCP) サーバーは LLM が外部のツールと対話するための標準的な方法ですが、インストールが複雑でハードル高いという課題があります。`.dxt` ファイルは MCP サーバーを簡単にインストールできるパッケージ形式です。これを使用することでユーザーはターミナルを操作したり JSON ファイルを編集することなく MCP サーバーを利用できるようになります。"
createdAt: "2025-06-29T08:17+09:00"
updatedAt: "2025-06-29T08:17+09:00"
tags: ["MCP"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/kKUXz4aZRUJSxsvdfm54k/89899e6adcc20c3e5c20708f7a699add/rice-cooker_22142.png"
  title: "rice-cooker 22142"
audio: null
selfAssessment:
  quizzes:
    - question: ".dxt ファイルに含める MCP サーバーの機能を記述するファイルの名前は？"
      answers:
        - text: "manifest.json"
          correct: true
          explanation: null
        - text: "settings.json"
          correct: false
          explanation: null
        - text: "config.json"
          correct: false
          explanation: null
        - text: "package.json"
          correct: false
          explanation: null
    - question: ".dxt ファイルを作成するために使用する CLI ツールは何ですか？"
      answers:
        - text: "@anthropics/dxt-cli"
          correct: true
          explanation: null
        - text: "@modelcontextprotocol/dxt-cli"
          correct: false
          explanation: null
        - text: "@mcp/dxt-cli"
          correct: false
          explanation: null
        - text: "dxt-cli"
          correct: false
          explanation: null
published: true
---
[Model Context Protocol (MCP)](https://modelcontextprotocol.org/) LLM が外部のツールと対話する方法として標準的な地位を確立しつつあります。現在では MCP の仕様を提案した Anthropic 社が提供する Claude のみならず、OpenAI の GPT-4o や Google の Gemini Pro など、主要な LLM が MCP をサポートしています。

MCP の抱える課題の 1 つにインストールの複雑さがあります。[stdio](https://modelcontextprotocol.io/docs/concepts/transports#standard-input%2Foutput-stdio) トランスポートで実行される MCP サーバーはツールを利用するユーザー自身が MCP サーバーのパッケージをローカルにインストールして実行する必要があります。多くの MCP パッケージは Node.js の npm や Python の uv といったパッケージ管理ツールを利用してインストールされますが、これらのツールは開発者向けのツールであり、一般のユーザーにとってはハードルが高いものです。

また MCP サーバーの設定は JSON 形式の設定ファイルを手動で編集する必要があり、これもまたハードルを高くしています。他にも依存関係の管理やバージョンの互換性など、MCP サーバーのインストールと設定は複雑な作業となることが多く、開発者以外のユーザーにとってはハードルが高くなっています。

このような課題を解決するためにデスクトップ拡張機能（`.dxt` ファイル）が導入されました。`.dxt` ファイルは依存関係を含む MCP サーバー全体を単一のアーカイブファイルとしてパッケージ化し、ユーザーがワンクリックで MCP サーバーをインストールできるようにします。MCP サーバーを利用するためにターミナルを操作したり、JSON ファイルを編集する必要はありません。また企業のセキュリティ管理者にとっても、安全であることが保証された MCP サーバーの一覧をパッケージ化して配布することが可能になるという利点もあります。

この記事では、`.dxt` ファイルの仕組みとその利用方法について解説します。

## `.dxt` ファイルを作成する

`.dxt` ファイルはローカルの MCP サーバーと、サーバーの機能を記述した `manifest.json` ファイルを含む ZIP アーカイブです。この形式は Chrome の拡張機能や VS Code の拡張機能とよく似ています。`.dxt` ファイルの `manifest.json` の仕様については [MANIFEST.md](https://github.com/anthropics/dxt/blob/main/MANIFEST.md) を参照してください。

`.dxt` ファイルを作成するプロセスを簡易的にするための CLI ツールが提供されています。以下のコマンドで CLI ツールをインストールできます。

```bash
npm install -g @anthropic-ai/dxt
```

まずは、MCP サーバーのコードを含むディレクトリを作成します。以下の例では `my-mcp-servers` というディレクトリを作成し、[Playwright MCP](https://github.com/microsoft/playwright-mcp) をインストールします。

```bash
mkdir my-mcp-servers
cd my-mcp-servers
npm init -y
npm install playwright-mcp
```

続いて `dxt init` コマンドを実行して対話形式で `manifest.json` ファイルを作成します。

```bash
dxt init

This utility will help you create a manifest.json file for your DXT extension.
Press ^C at any time to quit.

✔ Extension name: my-mcp-servers
✔ Author name: azukiazusa
✔ Display name (optional): my-mcp-servers
✔ Version: 0.0.1
✔ Description: example dxt
✔ Add a detailed long description? no
✔ Author email (optional): 
✔ Author URL (optional): 
✔ Homepage URL (optional): 
✔ Documentation URL (optional): 
✔ Support URL (optional): 
✔ Icon file path (optional, relative to manifest): 
✔ Add screenshots? no
✔ Server type: Node.js
✔ Entry point: node_modules/playwright-mcp
✔ Does your MCP Server provide tools you want to advertise (optional)? yes
✔ Tool name: playwright
✔ Tool description (optional): 
✔ Add another tool? no
✔ Does your server generate additional tools at runtime? no
✔ Does your MCP Server provide prompts you want to advertise (optional)? no
✔ Add compatibility constraints? no
✔ Add user-configurable options? no
✔ Keywords (comma-separated, optional): 
✔ License: ISC
✔ Add repository information? no

Created manifest.json at /manifest.json
```

このコマンドを実行すると、以下のような `manifest.json` ファイルが作成されます。

```json
{
  "dxt_version": "0.1",
  "name": "my-mcp-servers",
  "version": "0.0.1",
  "description": "example dxt",
  "author": {
    "name": "azukiazusa"
  },
  "server": {
    "type": "node",
    "entry_point": "node_modules/playwright-mcp",
    "mcp_config": {
      "command": "node",
      "args": [
        "${__dirname}/node_modules/playwright-mcp"
      ],
      "env": {}
    }
  },
  "tools": [
    {
      "name": "playwright"
    }
  ],
  "license": "ISC"
}
```

`dxt validate` コマンドを実行して `manifest.json` ファイルが正しい形式であることを確認します。

```bash
dxt validate
Manifest is valid!
```

依存関係がディレクトリに含まれていることが確認できたら、`dxt pack` コマンドを実行します。

```bash
dxt pack
```

このコマンドでは `manifest.json` を検証し、問題がなければ `.dxt` ファイルを作成します。例えば、上記の例では `my-mcp-servers.dxt` というファイルが作成されます。

`dxt sign` コマンドを使用して `.dxt` ファイルに署名できます `--cert` オプションで署名に使用する証明書を、`--key` オプションで秘密鍵を指定します。`--self-signed` オプションを指定すると自己署名の証明書を生成して署名できます。

```bash
dxt sign my-mcp-servers.dxt --cert path/to/cert.pem --key path/to/key.pem
```

## `.dxt` ファイルをテストする

作成した `.dxt` ファイルをテストするには、[Claude for Desktop](https://claude.ai/download) をインストールする必要があります。お使いの OS に応じて、インストールしてください。

「Claude Desktop」を起動し、メニュー「Settings → Extensions」を開きます。この画面に `.dxt` ファイルをドラッグ＆ドロップすることで、MCP サーバーをインストールできます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/5lKB2xPGD7DbFX7GtjN1EY/0649445b13bfec334a376c5a8280c34f/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2025-06-29_9.43.29.mov" controls></video>

`.dxt` ファイルのドラッグ＆ドロップが成功すると、`manifest.json` に記載した情報が表示されます。この `.dxt` ファイルでは playwright ツールが利用可能であることが示されています。

![](https://images.ctfassets.net/in6v9lxmm5c8/3hKtNShrEdMLtborlogHWl/50165ecf5f7812744330cb98ef1ec3a1/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-06-29_9.45.52.png)

「Install」ボタンをクリックすると playwright ツールが利用可能になります。

![](https://images.ctfassets.net/in6v9lxmm5c8/3hYjowS3WbC6uMFOS3l7Za/0906d622277040291eb617d15439288e/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-06-29_9.49.57.png)

「azukiazusa.dev の人気記事を取得してください」というプロンプトを入力し、playwright ツールが実行されるか確認してみましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/2oT6V9NtwcE3nd9G9rLeqn/2a8f2d45e704d18d1794a4c79f471a57/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-06-29_10.13.41.png)

##  まとめ

- MCP サーバーは LLM が外部のツールと対話するための標準的な方法。インストールの方法が複雑で開発者以外のユーザーにとってはハードルが高いという課題がある
- `.dxt` ファイルは MCP サーバーを簡単にインストールできるパッケージ形式
- `.dxt` ファイルは MCP サーバーのコードと `manifest.json` ファイルを含む ZIP アーカイブ
- `@anthropic-ai/dxt` を使用して `.dxt` ファイルを作成できる
- `.dxt` ファイルを Claude Desktop にドラッグ＆ドロップすることで MCP サーバーをインストールできる

## 参考

- [Claude Desktop Extensions: One-click MCP server installation for Claude Desktop \ Anthropic](https://www.anthropic.com/engineering/desktop-extensions)
- [anthropics/dxt: Desktop Extensions: One-click local MCP server installation in desktop apps](https://github.com/anthropics/dxt)
- [dxt/MANIFEST.md at main · anthropics/dxt](https://github.com/anthropics/dxt/blob/main/MANIFEST.md)

