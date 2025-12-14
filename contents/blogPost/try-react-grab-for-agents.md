---
id: xS9IFk_4Cb_Solf8nvsIx
title: "ブラウザから要素を選択してエージェントにコンテキストを提供する React Grab を試してみた"
slug: "try-react-grab-for-agents"
about: "React Grab はブラウザ上で要素を選択し、その要素に対応するコードコンテキストをコーディングエージェントに提供するライブラリです。この記事では React Grab のセットアップ方法と使用方法を紹介します。"
createdAt: "2025-12-14T10:47+09:00"
updatedAt: "2025-12-14T10:47+09:00"
tags: ["AI", "claude-code", "react-grab"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/5b74BH8LnmSdnIrchExmLR/a27828355e02731923fb558045afc123/toyama-black-ramen_22871.png"
  title: "富山のブラックラーメンのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "React Grab で要素を選択できる状態にするためのキーボード操作（インプットMac）は何ですか？"
      answers:
        - text: "`command + c`"
          correct: true
          explanation: "`command + c` を 1 秒間押し続けることで、画面上にピンクの枠線が表示され、要素を選択できる状態になります。"
        - text: "`command + shift + c` を押す"
          correct: false
          explanation: null
        - text: "`command + option + c` を押す"
          correct: false
          explanation: null
        - text: "`command + c` を 2 回押す"
          correct: false
          explanation: null
published: true
---
コーディングエージェントに期待したコードを生成してもらうためには、適切なコンテキストを提供することが重要です。しかし Web フロントエンドの分野ではコーディングエージェントの出力結果を元に修正を依頼する、という一般的なワークフローが困難な場合があります。

例えば実装したコードに対してテストを実行するのであれば、コーディングエージェントはターミナルの出力結果を元に修正できます。しかし UI の見た目や動作に関するフィードバックを提供する場合、コーディングエージェントはブラウザ上で実際に動作している UI を直接確認できません。

そのため、UI のスクリーンショットや DOM ツリーの情報を追加で提供する必要がありますが、これらの情報はしばしば冗長であり、エージェントが必要とする情報（ボタン要素がどのコードに対応しているかなど）を正確に伝えることが難しい場合があります。

[React Grab for Agents](https://github.com/aidenybai/react-grab) はこのような問題を解決するためのライブラリです。ブラウザ上で要素を選択すると、プロンプトを入力するフォームが表示されます。このフォームにコーディングエージェントに対する指示を入力すると、選択した要素に対応するコードコンテキスト（ファイルパス、行番号、コンポーネント）が自動的に抽出され、エージェントに提供されます。これにより、エージェントは正確なコンテキストを元にコードを生成または修正できます。

また、React Grab は特定のコーディングエージェントに依存せずに動作します。この記事では React Grab を Claude Code と組み合わせて使用する方法を紹介します。

## React Grab のセットアップ

ここでは Next.js プロジェクトに React Grab をセットアップする手順を説明します。以下のコマンドを実行すると、React Grab CLI がフレームワークを自動的に検出し、必要なスクリプトをプロジェクトに追加します。

```bash
npx grab@latest init
```

`? Would you like to add an agent integration?` という質問が表示されるので、`Claude Code` を選択しました。

```bash
$ npx grab@latest init

✿ React Grab 0.0.88

✔ Preflight checks.
✔ Verifying framework. Found Next.js.
✔ Detecting router type. Found App Router.
✔ Detecting package manager. Found npm.

? Would you like to add an agent integration? › - Use arrow-keys. Return to submit.
    None
❯   Claude Code
    Cursor
    OpenCode
    Codex
    Gemini
    Amp
    Visual Edit
```

セットアップの最後に以下のコード差分が表示されるので、内容を確認してから `Y` を入力して適用します。

- `app/layout.tsx` へのスクリプトの追加
- `package.json` で `next dev` スクリプトの実行前に Claude Code 用のコマンドを実行するように変更

```diff:app/layout.tsx
  import type { Metadata } from "next";
+ import Script from "next/script";
  import { Geist, Geist_Mono } from "next/font/google";
  import "./globals.css";

  ...
  }>) {
    return (
      <html lang="en">
+       <head>
+         {process.env.NODE_ENV === "development" && (
+           <>
+             <Script
+               src="//unpkg.com/react-grab/dist/index.global.js"
+               strategy="beforeInteractive"
+             />
+             <Script
+               src="//unpkg.com/@react-grab/claude-code/dist/client.global.js"
+               strategy="lazyOnload"
+             />
+           </>
+         )}
+       </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
```

```diff:package.json
    "version": "0.1.0",
    "private": true,
    "scripts": {
-     "dev": "next dev",
+     "dev": "npx @react-grab/claude-code@latest && next dev",
      "build": "next build",
      "start": "next start",
      "lint": "next lint"
```

## React Grab の使用方法

React Grab を使用するには、開発サーバーを起動してブラウザでアプリケーションを開きます。

```bash
npm run dev
```

要素を選択できるようにするには、`command + c`（Mac）を 1 秒間押し続けます。すると画面上にピンクの上下左右の枠線が表示され、要素を選択できるようになります。選択したい要素にカーソルを合わせると `Textarea > textarea` のように要素の情報が表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5KqhLAPzAEImo5on4Bwt4j/5fefda06102bcb643c8ecbeaa423eb7f/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-12-14_11.27.10.png)

要素をクリックすると、選択した要素がどのコードに対応するかの情報がクリップボードにコピーされます。

```txt
<textarea data-slot="textarea" class="border-input placeho..." id="description" name="description" placeholder="タスクの説明を入力（任意）" rows="3" />
  in Textarea (at ./components/ui/textarea.tsx:13:11)
  in DialogContent (at ./components/ui/dialog.tsx:87:11)
  in TaskCreationDialog (at ./components/task-creation-dialog.tsx:58:11)
```

選択中の要素をダブルクリックすることで、プロンプトを入力するフォームが表示されます。試しに「キャンセルボタンの背景色を赤に変更してください」と入力して送信してみます。音声入力もサポートされています。

![](https://images.ctfassets.net/in6v9lxmm5c8/39HTRT1b1qTuct9oyNvXCC/2f151cf2ae6af9c8a21108f3fde0099f/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-12-14_11.33.12.png)

プロンプトを送信すると、ブラウザ上で Claude Code エージェントが起動し、選択した要素に対応するコードコンテキストを元にコードの修正が行われます。そして修正が完了すると即座にブラウザ上に変更が反映される様子が確認できます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/3k0BqAY8tHf9xUdZE4o5Dk/b53466ff842d9263a5d7268fb408a70d/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2025-12-14_11.38.28.mov" controls></video>

Claude Code の実行ログを確認すると、以下のようなプロンプトが送信されていることがわかります。

```txt
> ボタンの背景色を赤色にして

<button data-slot="button" class="inline-flex items-ce..."
type="button">
  キャンセル
</button>
  in Button (at ./components/ui/button.tsx:40:11)
  in DialogContent (at ./components/ui/dialog.tsx:87:11)
  in TaskCreationDialog (at
./components/task-creation-dialog.tsx:58:11)
  in DroppableColumn (at ./components/droppable-column.tsx:19:11)
  in DragDropBoard (at ./components/drag-drop-board.tsx:22:18)
  in BoardPage (at Server)
  in RootLayout (at Server)
```

普段 Claude Code を使用している場合と比較すると、Claude がコードがどこで定義されているか調査する手順がスキップされている分、迅速にコードの修正が行われていることがわかります。特にコードベースが大きくなればなるほど、React Grab のように正確なコンテキストを提供できるツールの価値が高まるでしょう。

一方で単純なコードベースの質問の用途だとあまり適していないようにも感じました。例えばダイアログの閉じるボタンを選択しつつ、「この要素にアクセシブルな名前は設定されていますか？」と質問した場合、回答結果はブラウザ上では確認できないようです（実行ログを見ると適切な回答をしていることが確認できました）。このあたりは今後の改善に期待したいところです。

![](https://images.ctfassets.net/in6v9lxmm5c8/7KCwG4V6AzTtpRiumx9aCD/11f7bd137b5ca4bbc40abc2151b36056/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-12-14_11.46.30.png)

## 参考

- [aidenybai/react-grab: Select context for coding agents directly from your website](https://github.com/aidenybai/react-grab)
- [React Grab for Agents](https://www.react-grab.com/blog/agent)
- [I made your coding agent 3× faster at frontend](https://www.react-grab.com/blog/intro)
