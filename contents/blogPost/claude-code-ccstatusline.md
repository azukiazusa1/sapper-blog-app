---
id: LxK59n4_K6rrTHzEypLua
title: "Claude Code のステータスラインを TUI でカスタマイズできる ccstatusline"
slug: "claude-code-ccstatusline"
about: "Claude Code のステータスラインは oh-my-zsh のターミナルプロンプトのようにカスタマイズ可能です。これにより現在のブランチやトークンの使用量などを一目で確認できるようになります。この記事では TUI で簡単にステータスラインをカスタマイズできる ccstatusline の使い方を紹介します。"
createdAt: "2026-01-10T10:30+09:00"
updatedAt: "2026-01-10T10:30+09:00"
tags: ["claude-code"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/5yd5g9V6yx18ubJtC5sXE6/391348099d8fa9e49f0bc643f1837b3b/wood_maki_illust_4175-768x643.png"
  title: "積み上がった薪のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "ccstatusline でカスタマイズした設定は、デフォルトでどこに保存されますか？"
      answers:
        - text: "`~/.config/ccstatusline/settings.json`"
          correct: true
          explanation: "記事で説明されている通り、ステータスラインの設定はデフォルトでは `~/.config/ccstatusline/settings.json` に保存されます。"
        - text: "`~/.claude/settings.json`"
          correct: false
          explanation: "`~/.claude/settings.json` は Claude Code の設定ファイルであり、ccstatusline の設定を保存する場所ではありません。"
        - text: "`~/.ccstatusline/config.json`"
          correct: false
          explanation: null
        - text: "`~/.statusline/settings.json`"
          correct: false
          explanation: null
published: true
---
Claude Code の下部に表示されるステータスラインは自分好みにカスタマイズできます。これは oh-my-zsh のターミナルプロンプト（PS1）をカスタマイズするのと似ています。ステータスラインをカスタマイズすれば以下のように現在のブランチやコンテキストの使用量などを一目で確認できるようになります。

![](https://images.ctfassets.net/in6v9lxmm5c8/6DNpfmQMkAUVyRgSk2qHM8/d9cf30e717c793c54b3caf8b57acf1a6/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-10_10.55.53.png)

ステータスラインをカスタマイズする方法は以下の 2 つが用意されています。

- `/statusline` コマンド: Claude Code 自身にステータスラインの設定を支援してもらう。デフォルトでは `~/.zshrc` などを確認しターミナルのプロンプトを再現しようとする。コマンド引数で希望の動作を指示することも可能。
- `~/.claude/settings.json` の `statusline` 設定を直接編集する

```json:~/.claude/settings.json
{
  "statusline": {
    "type": "command",
    "command": "~/.claude/statusline.sh",
    "padding": 10
  }
}
```

公式に用意されている上記の方法でも十分にカスタマイズ可能ですが、Claude Code に生成させる方法は LLM の応答に依存するため、安定性に欠ける場合があります。また、直接編集する方法はシェルスクリプトの知識や Claude Code のトークンや AI API の知識が必要になるため、ハードルが高いです。

そこで、今回は Claude Code のステータスラインを TUI で簡単にカスタマイズできる `ccstatusline` を紹介します。このツールを使うとあらかじめ用意されたウィジェットを組み合わせてステータスラインを対話形式で作成できるため、シェルスクリプトの知識がなくても簡単にステータスラインをカスタマイズできます。この記事では `ccstatusline` の使い方を紹介します。

## `ccstatusline` のインストール

`ccstatusline` は npm パッケージで提供されているため、npx や bunx などで実行できます。

```bash
npx ccstatusline@latest
# または
bunx ccstatusline@latest
```

## ステータスラインのカスタマイズ

コマンドを実行すると TUI が起動します。現在のステータスラインの設定のプレビューが表示されるので、「Edit Lines」を選択して編集を開始します。

![](https://images.ctfassets.net/in6v9lxmm5c8/6moeJO7GZ4G8r0yWjc84XR/e90d2ab7d34e658255b24643ee84e7ab/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-10_10.57.51.png)

何行目を編集するかを選択します。`a` キーで行の追加、`d` キーで行の削除が可能です。1 行目を編集してみましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/18VVNwyWYh9gJTfw8Y7IJH/e727c02c1c7010f3dfaf3f72b01e99f3/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-10_10.59.32.png)

行の編集画面ではウィジェットの追加や削除、変更が可能です。上下キーで変更するウィジェットを選択し、`a` キーでウィジェットの追加、`d` キーでウィジェットの削除が可能です。カーソルがあるウィジェットに対して左右キーを押すとウィジェットの種類を変更できます。ウィジェットの種類は以下の通りです。

- Model Name: 現在使用しているモデル名（Claude 4.5 Sonnet など）を表示する
- Git Branch: 現在のブランチ名を表示する
- Git Changes: コミットされていない変更の数を表示する（`+42,-3`）
- Git Worktree: 現在の Git ワークツリーの名前を表示する
- Session Clock: 現在のセッションの経過時間を表示する（`2hr 15m`）
- Session Cost: 現在のセッションの合計コストを表示する（`$1.23`）
- Block Timer: 5 時間間隔のタイマー（Claude Code Max プランの制限時間）を表示する
- Current Working Directory: 現在の作業ディレクトリを表示する
- Version: Claude Code のバージョンを表示する
- Output Style: Claude Code の出力スタイルを表示する
- Tokens Input: input トークンの使用量
- Tokens Output: output トークンの使用量
- Tokens Cached: キャッシュされたトークンの使用量
- Tokens Total: 合計トークンの使用量
- Context Length: 現在のコンテキスト長をトークン数で表示する
- Context Percentage: rate limit に対するコンテキスト長の割合をパーセンテージで表示する
- Context Percentage (usable): 使用可能なコンテキストの割合をパーセンテージで表示する
- Terminal Width: ターミナルの幅を表示する（デバッグ用）
- Custom Text: 任意のテキストを表示する
- Custom Command: 任意のシェルコマンドの出力を表示する
- Separator: ウィジェット間の区切り文字を表示する。Enter キーを押すたびに `|`, `-`, `,`, `(space)` の順に切り替わる
- Flex Separator: 利用可能なスペースまで伸縮する

ウィジェットを変更・追加・削除するとリアルタイムにプレビューが更新されます。自分好みのステータスラインが完成したら `Esc` キーを押して行の編集画面を終了します。

![](https://images.ctfassets.net/in6v9lxmm5c8/103Oouvojiy6huhAG4aY31/320aec9bda174797fd12bf4f209c71a9/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-10_11.01.13.png)

表示される色を変更したい場合は「Edit Colors」を選択します。ここではステータスラインの行を選択した後、各ウィジェットに上下キーでカーソルを移動し、左右キーで色を変更できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/2hSYtquu5dO4XCYoBm23h1/bec2b10b370c0c3abadaf6fe4016564e/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-10_11.17.47.png)

ステータスラインのカスタマイズが完了したら、「Save & Exit」を選択して設定を保存します。

![](https://images.ctfassets.net/in6v9lxmm5c8/bBcHxJs3MZNvpNZSwRvLl/e2dc9ef6cad990d0601da1d9a101243b/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-10_11.19.20.png)

設定を Claude Code に反映するためには「Install to Claude Code」を選択します。これでカスタマイズしたステータスラインが Claude Code に反映されます。まずは `npx` と `bunx` のどちらで `ccstatusline` を起動するかを選択します。

![](https://images.ctfassets.net/in6v9lxmm5c8/5SSldKPrxhGkcxIaRzeT90/2938c398b77a5dfb1224f48c3f669bab/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-10_11.21.07.png)

設定のインストールが完了すると、`~/.claude/settings.json` の `statusline` 設定が自動的に更新されます。

```json:~/.claude/settings.json
{
  "statusLine": {
    "type": "command",
    "command": "npx -y ccstatusline@latest",
    "padding": 0
  }
}
```

`ccstatusline` は TTY モードで起動されたかどうかを判定し、TTY モードで起動された場合は対話形式の TUI を表示し、TTY モードでない場合はステータスラインの設定を読み取り、シェルスクリプトとしてステータスラインを出力します。ステータスラインの設定はデフォルトでは `~/.config/ccstatusline/settings.json` に保存されます。

```json:~/.config/ccstatusline/settings.json
{
  "version": 3,
  "lines": [
    [
      {
        "id": "1",
        "type": "custom-command",
        "color": "",
        "commandPath": "pwd | sed \"s|$HOME|~|\""
      },
      {
        "id": "2",
        "type": "separator"
      },
      {
        "id": "3",
        "type": "git-branch",
        "color": "magenta"
      },
      {
        "id": "4",
        "type": "separator"
      },
      {
        "id": "5",
        "type": "git-changes",
        "color": "yellow"
      }
    ],
    [
      {
        "id": "f19f0ac8-0e4a-4664-bd56-9a8ea15a89aa",
        "type": "model",
        "color": "brightRed"
      },
      {
        "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "type": "separator"
      },
      {
        "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "type": "context-percentage",
        "color": "green"
      },
      {
        "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "type": "separator"
      },
      {
        "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "type": "tokens-input",
        "color": ""
      },
      {
        "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "type": "separator"
      },
      {
        "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "type": "tokens-output",
        "color": ""
      },
      {
        "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "type": "separator"
      },
      {
        "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "type": "tokens-cached",
        "color": ""
      }
    ],
    []
  ],
  "flexMode": "full-minus-40",
  "compactThreshold": 60,
  "colorLevel": 2,
  "inheritSeparatorColors": false,
  "globalBold": false,
  "powerline": {
    "enabled": false,
    "separators": [""],
    "separatorInvertBackground": [false],
    "startCaps": [],
    "endCaps": [],
    "autoAlign": false
  }
}
```

正しく設定が反映されていれば、Claude Code のステータスラインがカスタマイズした内容に変更されているはずです。

## まとめ

- Claude Code のステータスラインはカスタマイズ可能で、ターミナルのプロンプトのように現在のブランチやトークンの使用量などを表示できる
- ステータスラインのカスタマイズ方法として `/statusline` コマンドや `~/.claude/settings.json` の直接編集があるが、どちらもハードルが高い
- `ccstatusline` を使うと TUI で簡単にステータスラインをカスタマイズできる
- `ccstatusline` は npm パッケージとして提供されており、npx や bunx で実行できる
- `ccstatusline` でカスタマイズした設定は `~/.config/ccstatusline/settings.json` に保存され、Claude Code の `~/.claude/settings.json` の `statusline` 設定で `npx -y ccstatusline@latest` や `bunx -y ccstatusline@latest` を指定することで反映される

## 参考

- [sirmalloc/ccstatusline: 🚀 Beautiful highly customizable statusline for Claude Code CLI with powerline support, themes, and more.](https://github.com/sirmalloc/ccstatusline)
- [ステータスラインの設定 - Claude Code Docs](https://code.claude.com/docs/ja/statusline)
