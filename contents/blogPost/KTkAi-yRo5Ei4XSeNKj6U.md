---
id: KTkAi-yRo5Ei4XSeNKj6U
title: "サンドボックス環境を MCP サーバーで提供する Container Use"
slug: "mcp-server-container-use"
about: "AI コーディングエージェントは便利ですが、任意の Bash コマンドを実行できるため、ユーザーのシステムに影響を与える可能性があります。Container Use は MCP サーバーとして動作し、AI コーディングエージェントにサンドボックス環境を提供します。この記事では Container Use の利用方法について紹介します。"
createdAt: "2025-07-13T19:44+09:00"
updatedAt: "2025-07-13T19:44+09:00"
tags: ["AI", "MCP", "Container Use"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4LKags2fw26zTBoEIE43vE/c3449ac762f157ebaef49c217c1dc277/sunaba_asobi_9206-768x574.png"
  title: "砂遊びのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "サンドボックス環境内でコマンドを実行する MCP ツールはどれですか？"
      answers:
        - text: "environment_run_cmd"
          correct: true
          explanation: "environment_run_cmd はサンドボックス環境内でコマンドを実行するための MCP ツールです。"
        - text: "env_run_cmd"
          correct: false
          explanation: ""
        - text: "environment_exec_cmd"
          correct: false
          explanation: ""
        - text: "run_cmd"
          correct: false
          explanation: ""
    - question: "AI コーディングエージェントの実行ログを確認するコマンドはどれですか？"
      answers:
        - text: "container-use log <env_id>"
          correct: true
          explanation: "container-use log <env_id> コマンドで、サンドボックス環境内で実行されたコマンドのログを確認できます。"
        - text: "container-use checkout <env_id>"
          correct: false
          explanation: "container-use checkout <env_id> は git ブランチに切り替えて作業内容を確認するためのコマンドです。"
        - text: "container-use diff <env_id>"
          correct: false
          explanation: "container-use diff <env_id> はファイルの差分を確認するためのコマンドです。"
        - text: "container-use terminal <env_id>"
          correct: false
          explanation: "container-use terminal <env_id> はサンドボックス環境内のシェルに接続するためのコマンドです。"


published: false
---

Claude Code, Cline, Cursor といった AI コーディングエージェントは多くの開発者に受け入れられており、生産性の向上に大きく貢献しています。他方で安全のために AI コーディングエージェントの実行には注意を払う必要があることを忘れてはいけません。基本的にはユーザーに都度許可を求めるように設計されているものの、AI コーディングエージェントは任意の Bash コマンドを実行できます。例えば `rm -rf ~/` のようなコマンドを実行されると、ユーザーのホームディレクトリが意図せず削除されてしまいますし、`curl` コマンドで悪意のあるコードをダウンロードして実行されると、ユーザーのシステムに深刻な被害を与える可能性があります。

はじめのうちは AI コーディングエージェントがこれから実行しようとするコマンドを、注意深く確認してから許可を与えるように扱っていたユーザーも多いでしょう。ですが Bash コマンドの許可システムは利便性とのトレードオフです。多くの許可を求められていくうちに、ユーザーは次第に許可を出すことに対して無頓着になっていくことがあります。これにより、意図しないコマンドが実行されるリスクが高まります。

また AI コーディングエージェントの種類によっては一切の許可を求めないで実行するオプションを提供しているものもあります。このオプションを使用すると AI コーディングエージェントの自律性や実行速度は向上しますが、ユーザーは AI コーディングエージェントが実行するコマンドを一切確認できなくなります。

このようなリスクを軽減するために、サンドボックス環境で AI コーディングエージェントを実行する機運が高まっています。サンドボックス環境では AI コーディングエージェントが実行するコマンドは、ユーザーのシステムに影響を与えないように制限されます。また、複数の AI コーディングエージェントを並行して実行したとしても、サンドボックス環境ではそれぞれのエージェントが独立した環境で実行されるため、互いのコードの変更に干渉を受けずに進められるという利点もあります。

サンドボックス環境を提供する方法の 1 つとして、[Container Use](https://github.com/dagger/container-use) が挙げられます。Container Use は Dagger が開発したツールで、コーディングエージェントにサンドボックス環境を提供する目的で開発されました。[MCP サーバー](https://modelcontextprotocol.org/) として動作するのが特徴であり、MCP サーバーをサポートしている AI コーディングエージェントであれば、Container Use を介してサンドボックス環境を利用できます。

この記事では Container Use の利用方法について紹介します。

## Container Use のインストール

Container Use はシェルスクリプトによるインストールが提供されています。以下のコマンドを実行することで、Container Use をインストールできます。

```bash
curl -fsSL https://raw.githubusercontent.com/dagger/container-use/main/install.sh | bash
```

もしくは Homebrew を使用してインストールすることもできます。Homebrew を使用してインストールした場合は自動でシェルの補完が有効になります。

```bash
brew install dagger/tap/container-use
```

以下のコマンドで Container Use が正しくインストールされているか確認できます。

```bash
container-use version

container-use version 0.2.0
commit: 387bfbefa991848697beeeac58b165a875b67da6
built: 2025-07-08T20:07:16Z
```

## Container Use の使い方

Container Use は MCP サーバーとして動作します。使用している AI コーディングエージェントごとに MCP サーバーの使用方法は異なりますが、基本的な流れは同じです。ここでは Claude Code を例に Container Use の使い方を紹介します。

以下のコマンドで MCP サーバーの設定を Claude Code に登録します。

```bash
claude mcp add container-use -- container-use stdio
```

`claude mcp list` コマンドで登録されている MCP サーバーの一覧を確認できます。

```bash
claude mcp list
container-use: container-use stdio
```

オプショナルとして AI コーディングエージェントに Container Use のサンドボックス環境を使用するように指示するプロンプトを `CLAUDE.md` ファイルに追記できます。

```bash
curl https://raw.githubusercontent.com/dagger/container-use/main/rules/agent.md >> CLAUDE.md
```

指示の内容は以下のようになります。

```md:CLAUDE.md
ALWAYS use ONLY Environments for ANY and ALL file, code, or shell operations—NO EXCEPTIONS—even for simple or generic requests.

DO NOT install or use the git cli with the environment_run_cmd tool. All environment tools will handle git operations for you. Changing ".git" yourself will compromise the integrity of your environment.

You MUST inform the user how to view your work using `container-use log <env_id>` AND `container-use checkout <env_id>`. Failure to do this will make your work inaccessible to others.
```

## Container Use のサンドボックス環境を利用する

実際に Claude Code で Container Use のサンドボックス環境を利用してみます。Container Use を使用するためには以下の要件があります。

1. Docker が起動されていること
2. git レポジトリであること

まずは新しいディレクトリを作成して、git レポジトリを初期化します。

```bash
mkdir todo-app
cd todo-app
git init
```

以下のプロンプトを入力してアプリケーションを生成してもらいましょう。

```sh
claude "React, TypeScript, Tailwind CSS を使用して、TODO アプリケーションを作成してください。アプリケーションは以下の機能を持つ必要があります。
- タスクの追加、削除、完了の管理
- タスクのフィルタリング（すべて、未完了、完了）
- タスクの保存と読み込み（ローカルストレージを使用）"
```
 
Claude Code は Container Use の MCP サーバーが提供されているツールを利用することで、サンドボックス環境でコマンドを実行できます。Container Use の MCP サーバーは 10 個のツールを提供しています。

- `environment_add_service`: サンドボックス環境にデータベースやキャッシュなどのサービスをコンテナイメージから追加する
- `environment_checkpoint`: 現在のコンテナの状態をイメージとして保存する
- `environment_create`: 新しいサンドボックス環境を作成する
- `environment_file_delete`: パスを指定してファイルを削除する
- `environment_file_list`: カレントディレクトリのファイル一覧を取得する
- `environment_file_read`: ファイルの内容を読み込む
- `environment_file_write`: ファイルに内容を書き込む
- `environment_open`: 既存のサンドボックス環境を開く
- `environment_run_cmd`: サンドボックス環境内でコマンドを実行する
- `environment_update`: 新しい instructions と toolchains でサンドボックス環境を更新する

最初に指示を受けたタイミングで `environment_create` ツールを使用し、サンドボックス環境を作成します。ツールの許可を求められるので承認しましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/3AZVIynSvYKRYmwCFiimOt/5d455720ae18d4910d59bee2b8624b29/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-12_21.29.15.png)

`container-use list` コマンドを実行すると、作成されたサンドボックス環境の一覧を確認できます。

```bash
container-use list
ID               TITLE                                  CREATED         UPDATED
pleased-buzzard  React TypeScript TODO App Development  39 seconds ago  36 seconds ago
```

続いて Claude Code は React プロジェクトを作成するために `npm create vite@latest todo-app -- --template react-ts` コマンドを実行します。シェルコマンドは `environment_run_cmd` ツールを通じて実行されます。`environment_run_cmd` はコマンドを実行する環境、実行するコマンド、コマンドを実行する理由を引数に受け取り呼び出されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/1xcDq2j8I74xNAzU0d0Z0E/0f829538b0f10b0026bfe641bac0fccc/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-12_21.36.31.png)

このコマンドはサンドボックス環境内で実行されるため、ユーザーのシステムに影響を与えることはありません。その証拠に `ls` コマンドを実行してみても、`package.json` ファイルなどはローカルのディレクトリには存在しないことがわかります。

```bash
ls
CLAUDE.md
```

ファイルの書き込みは `environment_write_file` ツールを使用して行われます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3usyNcFErrjcfSQfgOCo2I/e084cf6bb1b4b290649baadaa1ba4b74/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-12_21.43.57.png)

コードの生成が完了したら `npm run dev` コマンドを実行して開発サーバーでアプリケーションを起動します。`environment_run_cmd` ツールを `background: true` オプションを指定して呼び出しているため、バックグラウンドでコマンドを実行されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/9O8B0AgSDxT3RlODfwwtx/fca96a8301960fbfca2cbb5025828369/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-12_21.56.50.png)

コンテナ内でポート `5173` で開発サーバーが起動されたうえで、http://127.0.0.1:51121 を通じてアクセスできるように設定されます。実際にアクセスしてみると TODO アプリケーションが表示されます（今回はスタイリングに失敗しているようですが...）。

![](https://images.ctfassets.net/in6v9lxmm5c8/5dyMMMwSIM4F4x8aQCrv6z/a8aa97273bf9aae84c98a974b06b50bd/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-12_22.00.56.png)

## 作業内容を確認する

Claude Code は作業内容を確認するために `container-use log <env_id>` コマンドを実行します。これにより、サンドボックス環境内で実行されたコマンドのログを確認できます。`<env_id>` は `container-use list` コマンドで確認できるサンドボックス環境の ID です。

```bash
container-use log pleased-buzzard

35da9bd  Starting Vite development server with host binding for container access (12 hours ago) 
$ npm run dev -- --host 0.0.0.0 &
57bb8fd  Building the application with fixed PostCSS configuration (12 hours ago) 
$ npm run build

> workdir@0.0.0 build
> tsc -b && vite build
```

Claude Code が生成したコードを確認するためには `container-use checkout <env_id>` コマンドを実行します。Container Use が作業している git ブランチに切り替わり、作業内容を確認できます。

```bash
container-use checkout pleased-buzzard
Switched to branch 'cu-pleased-buzzard'

ls
eslint.config.js	postcss.config.js	tsconfig.app.json
index.html		README.md		tsconfig.json
package-lock.json	src			tsconfig.node.json
package.json		tailwind.config.js	vite.config.ts
```

`container-use terminal <env_id>` コマンドを実行すると、サンドボックス環境内のシェルに接続できます。これにより、サンドボックス環境内で直接コマンドを実行したり、ファイルを操作したりできます。このコマンドを実行するためには [Dagger](https://docs.dagger.io/install/) のインストールが必要です。

```bash
container-use terminal pleased-buzzard

● Attaching terminal
```

作成されたファイルの差分を確認するためには `container-use diff <env_id>` コマンドを実行します。

```bash
container-use diff pleased-buzzard

diff --git a/index.html b/index.html
new file mode 100644
index 0000000..e4b78ea
--- /dev/null
+++ b/index.html
@@ -0,0 +1,13 @@
+<!doctype html>
+<html lang="en">
+  <head>
+    <meta charset="UTF-8" />
+    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
+    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
+    <title>Vite + React + TS</title>
+  </head>
+  <body>
+    <div id="root"></div>
+    <script type="module" src="/src/main.tsx"></script>
+  </body>
+</html>
```

## 変更を適用する

Claude Code の作業が納得できるものであれば、main ブランチに変更を適用します。変更を適用するためには以下の 2 つのオプションがあります。

- `container-use merge <env_id>`: AI コーディングエージェントのコミット履歴を保持して変更を適用する
- `container-use apply <env_id>`: 元のコミット履歴を破棄して、手動でコミットする

`container-use merge <env_id>` コマンドを実行して変更を適用しましょう。

```bash
container-use merge pleased-buzzard

Updating 835a7f9..35da9bd
Fast-forward (no commit created; -m option ignored)
 .container-use/AGENT.md         |    1 +
 .container-use/environment.json |    8 +
 .gitignore                      |   24 +
 CLAUDE.md                       |    5 -
 README.md                       |   69 +
 eslint.config.js                |   23 +
 index.html                      |   13 +
```

最後に不要になったサンドボックス環境を削除しておきましょう。

```bash
container-use delete pleased-buzzard

Deleting worktree at /Users/.config/container-use/worktrees/pleased-buzzard
Environment 'pleased-buzzard' deleted successfully.
```

もし既存のサンドボックス環境を再利用したい場合には、AI コーディングエージェントに指示を出す際にプロンプトで環境 ID を指定できます。例えば以下のようにプロンプトを入力します。

```sh
claude "pleased-buzzard 環境を使用して、TODO アプリケーションにタスクの優先度を追加してください。優先度は高、中、低の 3 つのレベルで管理します。"
``` 

## まとめ

- Container Use は Dagger が開発した MCP サーバーで、AI コーディングエージェントにサンドボックス環境を提供する
- Container Use を使用することで、AI コーディングエージェントが実行するコマンドをユーザーのシステムに影響を与えずに実行できる
- AI コーディングエージェントは始めに `environment_create` ツールを使用して新しいサンドボックス環境を作成する
- サンドボックス環境内で実行されるコマンドは `environment_run_cmd` ツールを通じて実行される
- ファイルの読み書きは `environment_file_read` と `environment_file_write` ツールを使用して行われる
- サンドボックス環境の一覧は `container-use list` コマンドで確認できる
- 作業ログは `container-use log <env_id>` コマンドで確認できる
- `container-use checkout <env_id>` コマンドで作業中の git ブランチに切り替え、作業内容を確認できる
- `container-use diff <env_id>` コマンドで作業内容の差分を確認できる
- `container-use terminal <env_id>` コマンドでサンドボックス環境内のシェルに接続できる
- 変更を適用するためには `container-use merge <env_id>` もしくは `container-use apply <env_id>` コマンドを使用する

## 参考

- [Introduction - Container Use](https://container-use.com/introduction)
- [Dagger.io](https://dagger.io/)