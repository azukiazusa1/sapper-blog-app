---
id: Xhl_dG90kik_pURguhBPC
title: "デスクトップ Claude Code の Preview 機能で UI を直接確認する"
slug: "claude-code-preview"
about: "Claude Code のデスクトップアプリに新しい Preview 機能がリリースされました。これを使用すると、コードから起動したアプリケーションの UI を直接確認しながら、同時にログやコードも確認して問題を解決できます。この記事では Preview 機能の使い方を紹介します。"
createdAt: "2026-02-21T11:13+09:00"
updatedAt: "2026-02-21T11:13+09:00"
tags: ["claude-code"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/5ItP2HbBhBx9ceNC0MtqM8/cf7f1ed77ee5c81ec4f2a00fdfc226af/take_banboo_12131-150x150.png"
  title: "竹のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Claude Code の Preview 機能でアプリケーションの起動方法を定義するファイルはどれか？"
      answers:
        - text: ".claude/launch.json"
          correct: true
          explanation: ".claude/launch.json ファイルにビルドに必要なコマンドや環境変数などを定義します"
        - text: ".claude/preview.json"
          correct: false
          explanation: null
        - text: ".vscode/launch.json"
          correct: false
          explanation: ".vscode/launch.json は Visual Studio Code の起動設定ファイルです。"
        - text: ".claude/config.json"
          correct: false
          explanation: null

published: true
---

Claude Code のデスクトップアプリに新しい Preview 機能がリリースされました。これを使用すると、コードから起動したアプリケーションの UI を直接確認しながら、同時にログやコードも確認して問題を解決できます。この記事では Preview 機能の使い方を紹介します。

## Preview 機能を使用する

まずは Claude Code のデスクトップアプリをインストールしましょう。[Claude Code のドキュメント](https://code.claude.com/docs/ja/desktop) からお使いの OS に対応したインストーラーをダウンロードして、インストールを完了させてください。既にインストールされている場合は、アプリを起動して最新バージョンにアップデートされていることを確認してください。

![](https://images.ctfassets.net/in6v9lxmm5c8/4GEbagSQ5HHnEKkxaIeCfZ/d492bfcc86e5c4970f37f1f002efb5b1/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-21_11.18.53.png)

インストールが完了したら上部のタブから「Code」を選択します。コードが存在するディレクトリとブランチを選択し、チャット欄に「アプリケーションを起動し、新しいボードとタスクを作成できるかテスト」などと入力してみましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/5ns25m20tFBVUhJXeZZbLs/d605158764fb38371d0cc55b2f8da3e4/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-21_11.23.02.png)

チャット画面の右上に「Preview」ボタンが表示されるので、これをクリックしてみましょう。ポップアップの「Set up」ボタンをクリックすると、画面右側にプレビュー画面が表示され、`.claude/launch.json` ファイルの作成を試みます。

![](https://images.ctfassets.net/in6v9lxmm5c8/7B83AH8ShaVMT8b1zZa6gL/b5ca28e1741aeb263ed873db43bbd7d1/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-21_11.43.32.png)

![](https://images.ctfassets.net/in6v9lxmm5c8/4S0FiWkUSUPHV4nEMBobQj/25bd2486786928ad0c387d6319851d98/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-21_11.47.22.png)

`.claude/launch.json` ファイルは Claude Code がどのようにアプリケーションを起動するかを定義するためのファイルです。ビルドに必要なコマンドや環境変数などを定義できます。概念的には Visual Studio Code で使用される `.vscode/launch.json` ファイルとよく似ています。

```json:.claude/launch.json
{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "kanban-app",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "port": 3000,
      // Claude がファイルを変更した後に UI を自動で検証するかどうか。デフォルトは true
      "autoVerify": true,
      // 環境変数
      "env": {
        "NODE_ENV": "development"
      },
      // ポート番号が競合したとき、自動的に次の空いているポートを使用するかどうか。
      // デフォルトは未設定で、Claude がポートの競合を検知したときにユーザーに確認する挙動になる。
      "autoPort": true
    },
    // 別にサーバーや DB を起動する必要がある場合は、別の設定を追加することもできる
    {
      "name": "db",
      "runtimeExecutable": "docker-compose",
      "runtimeArgs": ["up", "db"]
    }
  ]
}
```

`.claude/launch.json` ファイルが存在する場合、Claude がアプリケーションをテストする必要があると判断したときに、自動で Preview 画面を起動してアプリケーションの UI を操作しながらテストを行うようになります。

もしくは「Preview」ボタンをクリックした時に表示されるポップアップの「kanban-app ▶️」をクリックすると、すぐにプレビュー画面が起動してアプリケーションの UI を確認することもできます。「Persist sessions」オプションを有効にしておくと、Cookie などのセッション情報が保持されるため、ログインが必要なアプリケーションなどもスムーズにテストできます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3CwM6krdJ95lRfQVehslKx/9aa2405818567d374b2e714a24025b5e/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-21_11.53.29.png)

実際にユーザーの指示通り、プレビュー画面の UI を操作して新しいボードの作成を試みていることがわかりますね。「新規ボード作成」ボタンをクリックしてダイアログを表示し、タイトルと説明をフォームに入力する流れはスムーズに行われています。

![](https://images.ctfassets.net/in6v9lxmm5c8/6NHuY4rTyFqQFfMjks7xZL/c8650c75667f24590c7c0e915965340e/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-21_11.55.54.png)

タスクを作成する際に、意図的にエラーが発生するコードを仕込んでおきました。エラーが発生したことを検知して、サーバーのログを確認している様子もわかりますね。その後関連ファイルを調査してからエラーの原因を特定し、修正している様子もわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/5FGTrGZaCxOtN0TnkHJ0kz/1d6d0689ed0f64117e7753f825f7393a/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-21_11.57.18.png)

![](https://images.ctfassets.net/in6v9lxmm5c8/6AVaUbCkdnQDP3zqqM6bFT/c213109f11d5269b1c1a4f3e77796d6a/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-21_11.57.30.png)

最終的にテスト結果を報告し、どのようにバグを修正したかも説明してくれていますね。UI を視覚的に確認しつつ、同時にログやコードを読みながら問題を解決していくことができ、従来のようにユーザーがブラウザで操作して結果を報告するというやりとりよりも、はるかにスムーズにコミュニケーションが取れていることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/5x96zBhZWhKqFsrcvnPPcM/c2566a0ff8f086770bdc057e43be7544/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-21_12.04.47.png)

## 要素を選択してプロンプトを渡す

Preview 機能では、プレビュー画面の UI 要素を選択して、その要素に対してプロンプトを渡すこともできます。プレビュー画面の右上にあるアイコンの「Select element」をクリックすると、ブラウザの開発者ツールのようなインターフェースに切り替わります。

![](https://images.ctfassets.net/in6v9lxmm5c8/5uUdXjr0N05BSiZ8UG6ZxU/83ff52da8c19df6d3805abfec6273196/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-21_12.12.20.png)

![](https://images.ctfassets.net/in6v9lxmm5c8/1UJe2zDipjN899epiRcJ6i/af1213853d0b3ced708ea2c14939ab7d/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-21_12.12.33.png)

タイトル要素を選択してクリックすると `<h1>.text-2xl.font-bold` のような要素のセレクタと、その要素のスクリーンショットがプロンプトに添付された状態になります。これをもとに「タイトルの色を赤色に変更してください」といった指示を出すことができます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3CO50VgpCmr6J6ONTo5OLP/d19fd2c6bbe755b4c3d45f8e0ced2c19/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-21_12.36.51.png)

![](https://images.ctfassets.net/in6v9lxmm5c8/2dCoRCTedfgYDOXyEwRwS9/d35eb3025afe60acf11bc0b77cc498cb/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-21_12.37.05.png)

## まとめ

- Claude Code のデスクトップアプリの Preview 機能を使用すると、コードから起動したアプリケーションの UI を直接確認しながら、同時にログやコードも確認して問題を解決することができる
- `.claude/launch.json` ファイルを使用して、アプリケーションの起動方法を定義する
- プレビュー画面の UI 要素を選択して、その要素に対してプロンプトを渡すこともできるため、UI を視覚的に確認しながら、細かい修正指示を出すことも可能

## 参考

- [Use Claude Code Desktop - Claude Code Docs](https://code.claude.com/docs/en/desktop)
- [Preview, review, and merge with Claude Code | Claude](https://claude.com/blog/preview-review-and-merge-with-claude-code?utm_content=inline_link&utm_source=it&utm_medium=email&utm_campaign=2026_Q1_RET_MKTG_Claude_Code_Newsletter_Feb_2026_Active&utm_term=claude_code&utm_campaignId=16968816)
