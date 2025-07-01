---
id: JzcMQiTd8IE-3nyQrObjx
title: "Claude Code の Hooks で作業が終わった後にフォーマッターを実行する"
slug: "claude-code-hooks-run-formatter"
about: "Claude Code hooks は Claude Code のライフサイクルの特定のタイミングで実行されるユーザー定義のシェルスクリプトです。hooks を使用することで、コードのフォーマットを常に実行することができます。この記事では hooks を使用してコードの変更後に prettier が実行されるように設定してみましょう。"
createdAt: "2025-07-01T11:03+09:00"
updatedAt: "2025-07-01T11:03+09:00"
tags: ["claude-code"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1IZ67RjTaWdAfsgRzM9QXO/d9ae6718c313a13a4b582fc6bf45b137/correction-tape_17136.png"
  title: "correction-tape 17136"
audio: null
selfAssessment:
  quizzes:
    - question: "ファイルの編集時にコードのフォーマットを実行するために適切なhooks eventはどれですか？"
      answers:
        - text: "PreToolUse"
          correct: false
          explanation: "PreToolUseはツール実行前のイベントです"
        - text: "PostToolUse"
          correct: true
          explanation: "PostToolUseはツール実行後のイベントで、ファイル変更後にフォーマッターを実行するのに適しています"
        - text: "Notification"
          correct: false
          explanation: "Notificationは通知が送信されるときのイベントです"
        - text: "Stop"
          correct: false
          explanation: "StopはClaudeが応答を終了する直前のイベントです"
published: true
---
Claude Code hooks は Claude Code のライフサイクルの特定のタイミングで実行されるユーザー定義のシェルスクリプトです。hooks は LLM の実行判断に依存せずに特定のアクションが常に実行されることを保証します。

よくある例としては、コードのフォーマッターを実行することです。人間がコードを書いていた頃はエディタの自動フォーマット機能を使用していたため、フォーマットを実行するタイミングを意識することはなかったと思います。しかし LLM がコードを書く場合、フォーマットを実行するかどうかを LLM が判断するため、フォーマットが実行されずにコードがコミットされることが多々あります。hooks を使用することで、コードのフォーマットを常に実行できます。

:::warning
hooks で実行されるシェルコマンドはユーザーの確認なしに実行されるため、予期せぬコマンドが実行される可能性があります。hooks の仕様ではユーザー自身が全責任を負うことが明記されています。https://docs.anthropic.com/en/docs/claude-code/hooks#security-considerations
:::

この記事では hooks を使用してコードの変更後に prettier が実行されるように設定してみましょう。

## hooks の設定

hooks を設定するために `/hooks` カスタムスラッシュコマンドを使用できます。もしくは Claude Code の設定ファイル（`.claude/settings.json`）を直接編集することも可能です。ここでは `/hooks` コマンドを使用して設定してみましょう。

### hooks のイベントを選択する

始めにどのタイミングで hooks が実行されるのかを選択します。以下の 4 つの hooks event が用意されています。コードのフォーマットはファイルの編集が完了した後に実行したいので、`PostToolUse` を選択します。

1. PreToolUse - Before tool execution
2. PostToolUse - After tool execution
3. Notification - When notifications are sent
4. Stop - Right before Claude concludes its response

![](https://images.ctfassets.net/in6v9lxmm5c8/5YIRj2mjHVRjsGXBsKTa8N/a260db1dcfddb9a8d11e0fd345a097b2/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-01_11.27.48.png)

### hooks の matcher を追加する

hooks のイベントを選択した後、matcher を追加します。matcher はどのツールが呼び出された後に hooks が実行されるかを指定します。Claude Code によってファイルが変更された場合に prettier を実行してもらいたいので、`Write|Edit|MultiEdit` を入力します。`|` で区切ることで複数の matcher を指定できます。これにより、ファイルの書き込み、編集、複数のファイルの編集が行われた場合に hooks が実行されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/4R4C1nZW4IoQcW4h68PBKW/05e71f02232fa254dbed11ba094599db/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-01_12.44.49.png)

### hooks のコマンドを入力する

続いて hooks が呼び出されたときに実行されるコマンドを入力します。hooks は stdin 経由で JSON 形式のデータを受け取ります。受け取るデータの形式は hooks のイベントによって異なります。PostToolUse の場合は以下のような形式になります。

```json
{
  "session_id": "abc123",
  "transcript_path": "~/.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "tool_name": "Write",
  "tool_input": {
    "file_path": "/path/to/file.txt",
    "content": "file content"
  },
  "tool_response": {
    "filePath": "/path/to/file.txt",
    "success": true
  }
}
```

この JSON データを受け取って、ファイルのパスを取得し、prettier を実行するコマンドを入力します。JSON データをコマンドラインで扱うために [jq](https://stedolan.github.io/jq/) コマンドを使用します。以下のようなコマンドを入力してみましょう。

```bash
jq -r '.tool_input.file_path | select(endswith(".js") or endswith(".ts") or endswith(".jsx") or endswith(".tsx"))' | xargs -r prettier --write
```

stdin から受け取った JSON データから `tool_input.file_path` を抽出し、JavaScript や TypeScript のファイルパスであれば、`prettier --write` コマンドを実行します。`xargs -r` は引数がない場合にコマンドを実行しないようにするためのオプションです。

最後に hooks をどの場所に保存するかを選択します。

- `.claude/settings.local.json`: プロジェクト単位（ローカル）
- `.claude/settings.json`: プロジェクト単位
- `~/.claude/settings.json`: ユーザー単位（グローバル）

![](https://images.ctfassets.net/in6v9lxmm5c8/KCxHhhg7t7VXswQTdl1cF/ab6ef2dcc4629e6dcee6fda51eb0d82a/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-01_12.54.08.png)

設定が完了したら以下のような設定が保存されます。

```json:.claude/settings.json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path | select(endswith(\".js\") or endswith(\".ts\") or endswith(\".jsx\") or endswith(\".tsx\"))' | xargs -r npx prettier --write"
          }
        ]
      }
    ]
  }
}
```

実際に Claude Code を使用してファイルを変更してみましょう。確かに hooks が実行されたログが表示されていることが確認できます。終了コードが 0 であれば結果は折りたたまれて表示され、`ctrl + r` で展開できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3U5giewvakuLXoliSc8EPA/a8c7e4d3a0febf3a4fbc8271059d4dfd/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-01_13.25.48.png)

## まとめ

- hooks を使用すると Claude Code のライフサイクルの特定のタイミングでユーザー定義のコマンドを実行できる
- `/hooks` カスタムスラッシュコマンドを使用して hooks を設定できる
- hooks のイベントには PreToolUse, PostToolUse, Notification, Stop がある
- PostToolUse イベントを使用してツールの実行後にコマンドを実行する
- matcher を使用して特定のツールが呼び出されたときに hooks を実行する
- hooks のコマンドは stdin 経由で JSON データを受け取る

## 参考

- [Hooks - Anthropic](https://docs.anthropic.com/en/docs/claude-code/hooks)
