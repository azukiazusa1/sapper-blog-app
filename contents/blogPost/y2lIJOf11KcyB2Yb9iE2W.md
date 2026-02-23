---
id: y2lIJOf11KcyB2Yb9iE2W
title: "Claude Code デスクトップで Worktree を作成するとき .worktreeinclude で .gitignore で除外されているファイルを含める"
slug: "claude-code-worktree-worktreeinclude-gitignore"
about: "Git Worktree を作成するとき、.gitignore に指定している .env ファイルなどがコピーされないという問題があります。この問題を解決するために Claude Code のデスクトップバージョンでは .worktreeinclude で .gitignore で除外されているファイルを含めることができます。"
createdAt: "2026-02-23T11:42+09:00"
updatedAt: "2026-02-23T11:42+09:00"
tags: ["claude-code"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/lSTKt8AnW1KN4UPy78UlX/ae08d0c055492adedaa0d8f5131119cf/matsu_bonsai_12254-768x768.png"
  title: "松の盆栽のイラスト"
audio: null
selfAssessment:
  quizzes:
      answers:
        - text: "`.worktreeinclude` に記述されているファイルはすべてコピーされる"
          correct: false
          explanation: "`.worktreeinclude` への記述だけでは不十分です。`.gitignore` にも一致しているファイルのみがコピーされます。"
        - text: "`.worktreeinclude` と `.gitignore` の両方に一致するファイルのみコピーされる"
          correct: true
          explanation: "Worktree にコピーされるのは `.worktreeinclude` と `.gitignore` の両方に一致するファイルのみです。これにより誤ったファイルの混入を防止できます。"
        - text: "`.gitignore` に記述されていないファイルのみコピーされる"
          correct: false
          explanation: "`.gitignore` で除外されていないファイルは通常の git 管理下にあるため、Worktree にコピーする必要はありません。"
        - text: "プロジェクトルート直下のファイルのみコピーされる"
          correct: false
          explanation: "ディレクトリの深さは関係ありません。`.gitignore` と同じパターン構文でサブディレクトリのファイルも指定できます。"

published: true
---

AI コーディングエージェントを使用して複数のセッションを同時に開発する場合、[Git Worktree](https://git-scm.com/docs/git-worktree) を使用するプラクティスが一般的です。Git Worktree を使用すると、同じリポジトリの複数のブランチを同時にチェックアウトでき、互いの変更を干渉させることなく作業できます。Claude Code では Git Worktree をネイティブサポートしており、CLI では `--worktree` オプションを使用して、デスクトップ版では「Worktree」チェックボックスをオンにすることで、Worktree を作成しつつ新しいセッションを開始できます。

しかし、Git Worktree を使用していると、`.gitignore` で除外されているファイルが新しい Worktree に引き継がれないという問題が発生することがあります。特に `.env` ファイルなど、開発環境に必要なファイルが除外されている場合、Worktree で開発環境をセットアップするのが困難になります。Worktree を作成するたびに都度 `.env` ファイルをコピーするというワークアラウンドが必要になりますが、これは手間がかかります。

この問題を解決するために、Claude Code デスクトップバージョンでは `.worktreeinclude` というファイルがサポートされています。`.worktreeinclude` ファイルに、Worktree に含めたいファイルやディレクトリのパスを記述することで、`.gitignore` で除外されているファイルも Worktree に含めることができます。

## `.worktreeinclude` ファイルの使用方法

プロジェクトのルートディレクトリに `.worktreeinclude` ファイルを作成し、Worktree に含めたいファイルやディレクトリのパスを記述します。例えば、`.env` ファイルを Worktree に含めたい場合は、以下のように記述します。`.gitignore` と同じパターンで記述できます。

```plain:.worktreeinclude
.env
.env.*
**/.claude/settings.local.json
```

:::note
Worktree にコピーされるファイルは `.worktreeinclude` と `.gitignore` の両方に一致するファイルのみです。これにより、誤ったファイルが Worktree に含まれるのを防止できます。
:::

### Claude Code デスクトップ

Claude Code のデスクトップ版で新しいセッションを開始するとき Worktree を作成するのは簡単です。セッションの作成画面で「Worktree」チェックボックスをオンにするだけです。

![](https://images.ctfassets.net/in6v9lxmm5c8/6bX0SjZ91Df7DThnIRGwes/9276edeea99ac5c277e5797da54d9e3b/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-23_11.57.19.png)

Claude Code によって作成された Worktree は `git worktree list` コマンドで確認できます。

```sh
$ git worktree list
/Users/xxx/sandbox/kanban-app                                449a11e [main]
/Users/xxx/sandbox/kanban-app/.claude/worktrees/quirky-kare  449a11e [claude/quirky-kare]
```

Worktree のフォルダを開くと、`.env` ファイルなど、`.worktreeinclude` に記述されたファイルがコピーされていることが確認できます。

```sh
$ ls -a .claude/worktrees/quirky-kare
.  ..  .claude  .env  .git  .gitignore  README.md
```

### Claude Code CLI

CLI バージョンの Claude Code では `-w` もしくは `--worktree` オプションを使用して Worktree を作成して新しいセッションを開始できます。

```sh
$ claude --worktree filtering-task

$ git worktree list
/Users/xxx/sandbox/kanban-app                                   449a11e [main]
/Users/xxx/sandbox/kanban-app/.claude/worktrees/filtering-task  449a11e [worktree-filtering-task]
```

しかし、v2.1.50 時点では `.worktreeinclude` ファイルは CLI ではサポートされていません。この問題に対する Issue は 2026/02/22 にクローズされているため、近いうちにリリースが期待できそうです。

https://github.com/anthropics/claude-code/issues/15327

代替案として `hooks` の `WorktreeCreate` フックで `.env` ファイルをコピーする方法が考えられます。`.claude/settings.json` ファイルに以下の設定を追加します。

```json:.claude/settings.json
  {
    "hooks": {
      "WorktreeCreate": [
        {
          "hooks": [
            {
              "type": "command",
              "command": "bash -c 'NAME=$(jq -r .name); DIR=\"$HOME/.claude/worktrees/$NAME\"; git worktree add \"$DIR\" HEAD >&2 && cp \"$CLAUDE_PROJECT_DIR/.env\" \"$DIR/.env\" >&2 && echo \"$DIR\"'"
            }
          ]
        }
      ]
    }
  }
```

`WorktreeCreate` フックを設定するとデフォルトの `git worktree` 動作が置き換わるため、git worktree の作成自体もフック内で行う必要があります。`WorktreeCreate` フックの入力ではユーザーが `--worktree` コマンドで指定した値が `name` フィールドとして受け取れます。環境変数 `CLAUDE_PROJECT_DIR` はプロジェクトのルートパスを示します。最後の `echo \"$DIR\"` で作成した worktree の絶対パスを標準出力で Claude Code に伝える必要があります。この出力がない場合はワークツリーの作成はエラーとして扱われます。

`cp \"$CLAUDE_PROJECT_DIR/.env\"` で元のプロジェクトディレクトリから `.env` ファイルをコピーする設定を入れている点がポイントです。

フックを設定した後に `--worktree` オプションでワークツリーを作成すると、`.env` ファイルがコピーされていることが確認できます。

```sh
$ claude -w bar
```

```sh
$ ls -a .claude/worktrees/bar
.  ..  .claude  .env  .git  .gitignore  README.md
```

## まとめ

- Git Worktree には開発環境を起動するために必要な `.env` ファイルなどがコピーされないという問題があった
- Claude Code のデスクトップバージョンでは `.gitignore` ファイルで除外されているファイルを `.worktreeinclude` ファイルで Worktree に含める機能がサポートされている
- Claude Code CLI ではまだ `.worktreeinclude` ファイルがサポートされていないが、`WorktreeCreate` フックで `.env` ファイルをコピーすることが可能

## 参考

- [デスクトップ上の Claude Code - Claude Code Docs](https://code.claude.com/docs/ja/desktop)
