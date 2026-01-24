---
id: 1shxi03C_Q2Uwo7t6kkaJ
title: "新しいデザインツール Pencil を試してみた"
slug: "new-design-tool-pencil"
about: "Pencil は Figma のような使用感で UI デザインができるツールです。Pencil MCP サーバーを利用して双方向に AI コーディングツールと連携し、デザインからコードを書き出したり、プロンプトでデザインを生成したりすることができます。"
createdAt: "2026-01-24T14:09+09:00"
updatedAt: "2026-01-24T14:09+09:00"
tags: ["AI", "Pencil", "MCP"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/24M87rJdt7ZyWWZYynxEDM/fc362ed03c3234a8b02d532527d95476/image.png"
  title: "ノートと鉛筆のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Pencil で使用されるデザインファイルの形式として正しいものはどれですか?"
      answers:
        - text: ".pen ファイル"
          correct: true
          explanation: "Pencil はオープン形式の .pen ファイルを使用しており、JSON 形式で保存されるためテキストエディタで内容を確認したり、バージョン管理システムで管理したりすることができます。"
        - text: ".fig ファイル"
          correct: false
          explanation: ".fig ファイルは Figma で使用される形式です。Pencil は .pen ファイルを使用します。"
        - text: ".sketch ファイル"
          correct: false
          explanation: ".sketch ファイルは Sketch で使用される形式です。Pencil は .pen ファイルを使用します。"
        - text: ".xd ファイル"
          correct: false
          explanation: ".xd ファイルは Adobe XD で使用される形式です。Pencil は .pen ファイルを使用します。"

published: true
---

[Pencil](https://www.pencil.dev/) は、Figma のような使用感で UI デザインができるツールです。Pencil MCP サーバーを利用して双方向に AI コーディングツールと連携し、デザインからコードを書き出したり、プロンプトでデザインを生成したりすることができます。オープン形式の `.pen` ファイルを使用しており、テキストエディタで内容を確認したり、バージョン管理システムで管理したりすることも可能です。また Figma からのインポートにも対応しています。

この記事では Pencil を実際に試してみた感想を共有します。

## インストールとセットアップ

Pencil は以下のリンクからダウンロードできます。現時点では MacOS と Linux のみ対応しています。

https://www.pencil.dev/downloads

:::info
当面の間 Pencil は無料で利用できますが、将来的には有料プランが導入される予定です。
:::

インストール後アプリケーションを起動したらメールアドレスの入力を求められます。登録したメールアドレスに確認コードが送信されるので、コードを入力してアクティベートします。

![](https://images.ctfassets.net/in6v9lxmm5c8/1TiOiPcITIR429vEMadTAN/ce3a722aa33a9bf182bd4c4d6406fca2/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-24_14.12.06.png)

キャンバスの使用感は Figma によく似ています。左側のツールバーではレイヤーの一覧が表示され、右側のプロパティパネルでは選択したオブジェクトの詳細設定が可能です。コンポーネント, デザインテーマと変数, Flex Layout といった基本的な機能は一通り揃っています。

![](https://images.ctfassets.net/in6v9lxmm5c8/7Go5Qk3zvKHyYW9QGXBH3m/334d730710b5432feb4151cc0024db7b/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-24_14.39.24.png)

## プロンプトでデザインを生成

AI を使用してデザインを生成する方法を試してみましょう。まずは新しい `.pen` ファイルを作成します。空のファイルで作成しても良いのですが、ここではあらかじめ用意されたデザインシステムコンポーネントを使用してみましょう。上部のツールバーの左から 2 番目のアイコンの「Design Kits & Style Guides」をクリックします。

![](https://images.ctfassets.net/in6v9lxmm5c8/4xIfOuC6fDgPqJf3btYvjm/f555946616f59adafe7e4ecbf0640e8d/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-24_14.45.46.png)

ダイアログで使用可能なコンポーネントキットが表示されます。ここでは「Shadcn UI」を選択します。

![](https://images.ctfassets.net/in6v9lxmm5c8/6UjzSfUJz7gejfMzbvD9La/97f87acec4b000aa16f435b845813c66/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-24_14.48.06.png)

Shadcn UI のコンポーネントがキャンバスに追加されました。

![](https://images.ctfassets.net/in6v9lxmm5c8/baBEDTzSJElzeeflBxih2/a944f741ba608f8e9740a0c0ec257a67/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-24_14.49.40.png)

作成したファイルは `.pen` ファイルとしてローカルに保存されます。`.pen` ファイルは JSON 形式で保存されており、テキストエディタで開いて内容を確認することも可能です。

```json:new-file.pen
{
  "version": "2.6",
  "children": [
    {
      "type": "frame",
      "id": "MzSDs",
      "x": 0,
      "y": 0,
      "name": "shadcn: design system components",
      "theme": {
        "Mode": "Light",
        "Base": "Neutral",
        "Accent": "Default"
      },
      "clip": true,
      "width": 2800,
      "height": 3586,
      "fill": "$--background",
      "layout": "none",
      "children": [
        /* ... */
      ]
    }
  ],
}
```

キャンバスの左下に「Design with Claude Code」というチャット欄が表示されているので、ここにデザインの指示を入力してみます。Pencil をインストールした際に Claude Code と自動で連携されているようであり、このチャット欄から Claude Code を使用してデザインを生成します。例えば「Create a login form with email and password fields, and a submit button.」と入力して Enter キーを押してみましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/1SEEMrOxTgtRrH2TWHRQJu/21cdfb6bfdf10318c3a7ba6283fcb436/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-24_14.51.13.png)

デザインのガイドラインと利用可能なコンポーネントの一覧を確認したうえで、キャンバス上の空いているスペースにログインフォームが生成されました。

<video controls src="https://videos.ctfassets.net/in6v9lxmm5c8/6WZ96En6qxuaQM0HWzHWV0/3039752de18a532cc89c99e9cbd8cf18/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2026-01-24_14.51.46.mov"></video>

生成されたログインフォームは確かに既存のコンポーネントを使用して作成されていることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/1tVWadXzeotwF3FvbIu1Ta/56930412b4cde69e304d296cc90c7cc2/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-24_14.58.39.png)

## Pencil MCP でコードを書き出す

Pencil MCP を使用して AI コーディングツールと連携し、デザインからコードを書き出すことができます。あらかじめ Next.js で作成したプロジェクトを用意しておき、Shadcn UI のコンポーネントをインストールしておきます。

```bash
npx create-next-app@latest my-penciled-app
cd my-penciled-app
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add label
```

Pencil をインストールしたタイミングで Claude Code に自動で Pencil MCP が追加されるようです。`~/.claude.json` ファイルには以下の設定が追加されていました。

```json:~/.claude.json
{
  "mcpServers": {
    "pencil": {
      "command": "/Applications/Pencil.app/Contents/Resources/app.asar.unpacked/out/mcp-server-darwin-arm64",
      "args": [
        "--ws-port",
        "52036"
      ],
      "env": {},
      "type": "stdio"
    }
  }
}
```

Claude Code を起動して `/mcp` コマンドを実行し、Pencil MCP が利用可能になっていることを確認します。

```sh
/mcp
```

主なツールは以下の通りです。

| ツール名                          | 説明                                                         |
| --------------------------------- | ------------------------------------------------------------ |
| `get_editor_state`                | 現在のエディタ状態、選択要素、利用可能なコンポーネントを取得 |
| `open_document`                   | 新規ドキュメント作成または既存の.penファイルを開く           |
| `get_guidelines`                  | デザインガイドラインを取得                                   |
| `get_style_guide_tags`            | スタイルガイドのタグ一覧を取得                               |
| `get_style_guide`                 | タグに基づいたスタイルガイドを取得                           |
| `batch_get`                       | ノードの検索・読み取り                                       |
| `batch_design`                    | 挿入/コピー/更新/置換/移動/削除/画像操作を一括実行           |
| `snapshot_layout`                 | レイアウト構造を確認                                         |
| `get_screenshot`                  | ノードのスクリーンショットを取得                             |
| `get_variables`                   | 変数とテーマを取得                                           |
| `set_variables`                   | 変数を追加・更新                                             |
| `find_empty_space_on_canvas`      | キャンバス上の空きスペースを検索                             |
| `search_all_unique_properties`    | プロパティの一意な値を検索                                   |
| `replace_all_matching_properties` | プロパティを一括置換                                         |

以下のようなプロンプトを入力して、Pencil MCP を使用してログインフォームのコードを書き出してみます。

```text
Pencil MCP を使用して、現在のデザインからログインフォームを `/app/login/page.tsx` に Shadcn UI を使用してコードを書き出してください。
```

はじめに `get_editor_state` ツールが呼び出され、現在のエディタ状態が取得されます。このとき Pencil 上ではログインフォームのレイヤーを選択している状態にしておいてください。その後 `batch_get` ツールで選択中のノードの詳細が取得され、`get_guidelines` ツールで Shadcn UI のスタイルガイドが取得されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/7Ay6Awt38MBnREFYQsX0aD/d551151a5dcbbd066486a5ba5493a878/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-24_15.22.03.png)

正しくデザイン仕様を解析できているようですね。この情報をもとにログインフォームを作成し始めました。

![](https://images.ctfassets.net/in6v9lxmm5c8/5qvzxmR1FrpDujz49sIWVG/e378206126d5d2bdf40dfd641d2987e2/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-24_15.26.08.png)

実装が完了したら `get_screenshot` ツールで Pencil 上のスクリーンショットを取得し、コードと比較しています。ここではタイトルとサブタイトルの構造の修正を行っていますね。

実際に http://localhost:3000/login にアクセスしてみると、Pencil 上のデザインとほぼ同じ見た目でログインフォームが表示されていることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/4kpCrxyxKmHwa0x73zx0F5/6e848730939ae873ae63ebd806e1c1a6/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-24_15.30.20.png)

## ターミナルから動かして MCP ツールと連携する

Pencil ではローカルでインストールされている Claude Code と連携して動いているため、Claude Code にあらかじめ MCP サーバーを登録しておくことで、その MCP サーバーを利用して Pencil にデザインを取り込むことが可能です。

例えば Playwright MCP サーバーを登録しておくと、特定のウェブサイトのスクリーンショットを取得して、そのデザインを Pencil にインポートすることができます。
以下のコマンドで Claude Code に Playwright MCP サーバーを登録します。

```sh
claude mcp add playwright npx @playwright/mcp@latest
```

Pencil 上のチャット欄からは MCP サーバーを使用できないようだったので、ターミナルから Claude Code を起動して Pencil MCP を使用してデザインを作成してもらいましょう。

```sh
claude "Playwright MCP を使用して、azukiazusa.dev のデザインを取得し、Pencil 上にデザインをインポートしてください。"
```

Playwright MCP の `take_screenshot` ツールが呼び出され、指定されたウェブサイトのスクリーンショットが取得されます。その後 `batch_design` ツールで現在開いている Pencil のキャンバスにデザインが作成されます。作成されたデザインの再現度はあまり高くありませんが、ターミナルから様々なツールを組み合わせて利用できる点は面白いですね。

![](https://images.ctfassets.net/in6v9lxmm5c8/7h5S4Y2xTt7qrpGJuCdeWB/d68f9f417783d9a1be91896fe3c31cd5/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-24_15.45.50.png)

他にもレポジトリのコードを解析してデザインを取り込むといった使い方も考えられるでしょう。例えば以下のようなプロンプトです。

```sh
claude "Pencil MCP を使用して、app/ ディレクトリ内のコードを解析し、トップページのデザインを再現してください。"
```

```sh
claude "Pencil MCP を使用して、components/ ディレクトリ内の Button コンポーネントのコードを解析し、Pencil のコンポーネントとして取り込んでください。"
```

Claude Code を使用し AI コーディングと同じ手順でデザインを構築できるので、AI コーディングで培ったノウハウをそのまま活用できる点が魅力的だと感じました。今回はスクリーンショットをそのままデザインに変換しようとした結果あまり良い出力を得ることができませんでしたが、普段の AI コーディングと同じように Plan モードを活用し AI とともに対話しながらデザインを設計していくことで、より良い結果が得られるのではないかと思います。

## まとめ

- Pencil は Figma のような使用感で UI デザインができるツール。キャンバス上で AI を並列で動かしてデザインを生成したり、Claude Code や Cursor などの AI コーディングツールと連携してコードを書き出したりできるという特徴がある
- Pencil MCP を使用して Claude Code と連携し、デザインからコードを書き出すことが可能。Pencil 上で選択中のノードを解析し、Shadcn UI のコンポーネントを使用してコードを書き出すことができた
- ターミナルから Claude Code を起動して Pencil MCP と他の MCP サーバーを組み合わせて利用することも可能。Playwright MCP を使用して特定のウェブサイトのデザインを取得し、Pencil 上でデザインの再現を試みた

## 参考

- [Pencil – Design on canvas. Land in code.](https://www.pencil.dev/)
