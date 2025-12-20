---
id: puFgMBeo6ol2FYOIVSdua
title: "Claude Code の LSP サポート"
slug: "claude-code-lsp-support"
about: "Claude Code のバージョン 2.0.74 から LSP（Language Server Protocol）サポートが追加されました。LSP サポートにより、Claude Code はコードベースに対してシンボルの定義検索、参照検索、ホバー情報の取得などの操作が可能になります。この記事では Claude Code の LSP サポートの概要と使用方法を紹介します。"
createdAt: "2025-12-20T15:12+09:00"
updatedAt: "2025-12-20T15:12+09:00"
tags: ["AI", "claude-code", "lsp"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/499HDM5u5aEs1zkU8t5t4l/8490ad14c32e0c88f064bf08ddec49d5/fish_houbou_14105-768x591.png"
  title: "ホウボウのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Claude Code の LSP サポートで利用できる操作として、正しくないものはどれですか？"
      answers:
        - text: "goToDefinition: シンボルが定義されている場所を検索"
          correct: false
          explanation: null
        - text: "findReferences: シンボルへのすべての参照を検索"
          correct: false
          explanation: null
        - text: "autoComplete: コード補完の候補を取得"
          correct: true
          explanation: "Claude Code の LSP サポートで提供されている操作には autoComplete は含まれていません。記事で紹介されている操作は goToDefinition、findReferences、hover、documentSymbol、workspaceSymbol、goToImplementation、prepareCallHierarchy、incomingCalls、outgoingCalls です。"
        - text: "hover: シンボルのホバー情報（ドキュメント、型情報）を取得"
          correct: false
          explanation: null
    - question: "自作の LSP プラグインを作成する際にプラグインのルートに追加する必要がある設定ファイルはどれですか？"
      answers:
        - text: ".lsp.json"
          correct: true
          explanation: ""
        - text: ".lsp.yaml"
          correct: false
          explanation: null
        - text: "/lsp ディレクトリ"
          correct: false
          explanation: null
        - text: "lsp.config.js"
          correct: false
          explanation: null

published: true
---

コーディングエージェントが LSP（Language Server Protocol）を扱えるようになることで、エージェントがより効率的にタスクを遂行できるようになります。文字列でコードベース全体を検索するのではなく、LSP を通じてコードの構造やシンボル情報にアクセスできるため、正確な情報を迅速に取得・編集できるためトークンと時間を大きく節約できます。このことはコーディングエージェントにセマンティックなコード検索・編集ツールを提供する [Serena](https://github.com/oraios/serena) を試したことがある方には特に理解しやすいでしょう。

Claude Code の v2.0.74 から LSP サポートが追加されました。LSP サポートは Claude Code の[プラグイン機能](https://code.claude.com/docs/en/plugins-reference)の一部として提供されています。LSP 機能を有効化することで、Claude Code はコードベースに対して以下のような操作が可能になります。

- goToDefinition: シンボルが定義されている場所を検索
- findReferences: シンボルへのすべての参照を検索
- hover: シンボルのホバー情報（ドキュメント、型情報）を取得
- documentSymbol: ドキュメント内のすべてのシンボル（関数、クラス、変数）を取得
- workspaceSymbol: ワークスペース全体でシンボルを検索
- goToImplementation: インターフェースや抽象メソッドの実装を検索
- prepareCallHierarchy: 指定位置の呼び出し階層アイテム（関数/メソッド）を取得
- incomingCalls: 指定位置の関数を呼び出しているすべての関数/メソッドを検索
- outgoingCalls: 指定位置の関数が呼び出しているすべての関数/メソッドを検索

この記事では Claude Code の LSP サポートの概要と使用方法を紹介します。

## LSP 機能を有効化する

LSP 機能を有効化するには、Claude Code を起動して `/plugin` コマンドを実行して対話形式でプラグインを有効化します。プラグインをインストールするためには対象のプラグインを提供しているマーケットプレイスの追加が必要です。LSP プラグインは Claude Code 公式のマーケットプレイス（claude-plugins-official）で提供されています。公式マーケットプレイスは何も設定しなくてもデフォルトで利用できるはずです。「Marketplaces」タブで公式マーケットプレイスが有効化されていることを確認してください。

![](https://images.ctfassets.net/in6v9lxmm5c8/joIMAKUY95x8O8MStRcpx/0088c1c7da3694f6267715ea9d2c177c/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-12-20_15.30.05.png)

次に「Discover」タブに移動すると、利用可能なプラグインの一覧が表示されます。検索ボックスに「LSP」と入力して検索すると、LSP プラグインの一覧が言語別に表示されます。利用可能な言語は以下の通りです。

- C/C++
- C#
- Go
- Java
- Lua
- PHP
- Python
- Rust
- Swift

使用したい言語の LSP プラグインを `Space` キーで選択して `i` キーを押すとインストールが開始されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3Y8PminQyLfSYTjqgk9aaz/f1efc19d89f4b040856098e20b40db33/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-12-20_15.40.55.png)

インストール済のプラグインは「Installed」タブで確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/37C174Atrm8Gpb6HmIDHDk/406a12aa3d0b91e81b1154129d4f45d4/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-12-20_15.44.33.png)

さらに LSP プラグインの言語に対応する LSP サーバーをインストールする必要があります。例えば TypeScript の LSP 機能を利用したい場合は、[typescript-language-server](https://www.npmjs.com/package/typescript-language-server) をインストールします。

```bash
npm install -g typescript-language-server typescript
```

:::warning
実際に TypeScript LSP プラグインを有効にして TypeScript のコードベースで試してみましたが、現時点では正しく動作しないようです。LSP サーバーのプラグインには `.lsp.json` という設定ファイルが必要なようですが、現時点では `README.md` しか提供されていないようです。今後のアップデートに期待しましょう。
:::

## 自作の LSP サーバーを使用する

Claude Code 公式マーケットプレイスでサポートされていない言語の LSP サーバーを使用したい場合は、自作のプラグインを作成して LSP プラグインを提供できます。プラグインを作成するためには新しいディレクトリを作成し、`/.claude-plugin` サブディレクトリを作成します。

```sh
mkdir -p my-lsp-plugin/.claude-plugin
```

`.claude-plugin/plugin.json` ファイルを作成し、以下のように記述します。

```json:.claude-plugin/plugin.json
{
  "name": "my-typescript-lsp-plugin",
  "description": "TypeScript/JavaScript language server for Claude Code, providing code intelligence features like go-to-definition, find references, and error checking.",
  "version": "1.0.0",
  "author": {
    "name": "Your Name"
  }
}
```

プラグインに LSP サポートを追加するために、プラグインディレクトリのルートに `.lsp.json` ファイルを作成し、以下のように記述します。TypeScript の LSP サーバーを使用する例を示します。

```json:.lsp.json
{
  "typescript": {
    "command": "typescript-language-server",
    "args": ["--stdio"],
    "extensionToLanguage": {
      ".ts": "typescript",
      ".tsx": "typescript",
      ".js": "javascript",
      ".jsx": "javascript"
    }
  }
}
```

作成したプラグインをテストするには `--plugin-dir` オプションを使用して Claude Code を起動します。

```bash
claude-code --plugin-dir ./my-lsp-plugin
```

`/plugin` コマンドを実行してプラグインが正しく認識されていることを確認します。`--plugin-dir` で指定したプラグインは `inline` マーケットプレイスとして認識されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/2k4vfRliDsTB2iXe7sHh3K/7a50a30fe5b0ef06599d2212463cbb6a/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-12-20_16.35.44.png)

:::warning
v2.0.74 ではプラグインと LSP サーバーの競合が発生する問題があるため、正しく動作しないようです。 https://github.com/anthropics/claude-code/issues/13952
:::

上記の問題を回避して LSP 機能をテストするには、Claude Code のバージョンを v2.0.67 に落として環境変数 `ENABLE_LSP_TOOL` を `true` に設定して起動します。

```bash
ENABLE_LSP_TOOL=true npx @anthropic-ai/claude-code@2.0.67 --plugin-dir ./my-lsp-plugin
```

Claude Code が LSP 機能を使用する場合には `LSP(...)` ツールが利用されます。ここでは `<Button>` コンポーネントをリネームする作業をするため、`findReferences` コマンドを使用して `Button` シンボルが定義されている箇所を検索しています。

![](https://images.ctfassets.net/in6v9lxmm5c8/6xQK0x5qLCcHQkPy0QGJwk/645f6b52baf932fcdac90ee8e5b9f7c8/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-12-20_17.12.41.png)

## まとめ

- Claude Code の v2.0.74 から LSP サポートが追加された
- LSP 機能を有効化するには公式マーケットプレイスから対応する言語の LSP プラグインをインストールする
- 自作の LSP サーバーを使用するにはプラグインを作成して `.lsp.json` ファイルを追加する
- LSP 機能は v2.0.74 でプラグインと競合する問題があるため、v2.0.67 を使用して環境変数 `ENABLE_LSP_TOOL` を `true` に設定して起動することで回避できる

## 参考

- [Plugins reference - LSP servers](https://code.claude.com/docs/en/plugins-reference#lsp-servers)
- [Create plugins - Claude Code Docs](https://code.claude.com/docs/en/plugins)
- [claude-code/CHANGELOG.md at main · anthropics/claude-code](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)
- [\[BUG\] LSP servers not loading due to race condition between LSP Manager initialization and plugin loading · Issue #13952 · anthropics/claude-code](https://github.com/anthropics/claude-code/issues/13952)
