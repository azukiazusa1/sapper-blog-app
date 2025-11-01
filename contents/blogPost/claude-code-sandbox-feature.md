---
id: ZoPBgDux8SH7QHSp44CPp
title: "Claude Code のサンドボックス機能を試してみた"
slug: "claude-code-sandbox-feature"
about: "Claude Code をはじめとする AI コーディングエージェントは、コマンドを実行するたびにユーザーの承認を求める仕組みが備わっていますが、これには開発サイクルの低下や承認疲れといった問題があります。Claude Code のサンドボックス機能は、ファイルシステムやネットワークへのアクセスを制限し、安全に動作させるための仕組みです。この記事では、Claude Code のサンドボックス機能の仕組みと利用方法について解説します。"
createdAt: "2025-11-01T14:47+09:00"
updatedAt: "2025-11-01T14:47+09:00"
tags: ["claude-code"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1pTALrlRu2w7oQTYGRYF1A/23a79ab1be9ac116fa29c957e158bfe4/cheesecake_21072-768x591.png"
  title: "cheesecake 21072-768x591"
audio: null
selfAssessment:
  quizzes:
    - question: "macOS と Linux でそれぞれ使用されているサンドボックス技術の組み合わせとして正しいものはどれですか？"
      answers:
        - text: "macOS: Docker、Linux: Podman"
          correct: false
          explanation: null
        - text: "macOS: Apple Seatbelt (sandbox-exec)、Linux: Bubblewrap"
          correct: true
          explanation: "macOS では Apple の Seatbelt (sandbox-exec コマンド)、Linux では Bubblewrap がサンドボックス環境の実現に使用されています"
        - text: "macOS: Bubblewrap、Linux: SELinux"
          correct: false
          explanation: null
        - text: "macOS: Firejail、Linux: AppArmor"
          correct: false
          explanation: null
    - question: "Claude Code のサンドボックス機能で使用されている npm パッケージ名として正しいものはどれですか？"
      answers:
        - text: "@claude/sandbox"
          correct: false
          explanation: null
        - text: "@anthropic-ai/sandbox-runtime"
          correct: true
          explanation: "Claude Code では @anthropic-ai/sandbox-runtime パッケージがサンドボックスランタイムとして使用されており、オープンソースとして公開されています"
        - text: "@anthropic/sandbox-engine"
          correct: false
          explanation: null
        - text: "@claude-code/sandbox-env"
          correct: false
          explanation: null
    - question: "サンドボックス環境においてネットワークアクセス可能なドメインを制御する方法はどれですか？"
      answers:
        - text: "`settings.json` ファイルの `sandbox.network.allow` セクションで許可するドメインを指定する"
          correct: false
          explanation: null
        - text: "`settings.json` ファイルの `sandbox.network.allowedDomains` セクションで許可するドメインを指定する"
          correct: false
          explanation: null
        - text: "`settings.json` ファイルの `permissions` セクションで `WebFetch` の許可・拒否ルールを指定する"
          correct: true
          explanation: "ネットワークアクセスの制御は `permissions` セクションで `WebFetch` の許可・拒否ルールを指定することで行います"
        - text: "サンドボックス環境ではネットワークアクセスは常に拒否される"
          correct: false
          explanation: null
published: true
---
Claude Code をはじめとする AI コーディングエージェントは、ファイルの作成・編集・削除やコードの検証を行うためにホストマシンのファイルシステムにアクセスしたり、任意の bash コマンドを実行できる強力な機能を備えています。しかしこれらの機能は誤用や悪用されるリスクも伴います。例えば、エージェントが誤って重要なシステムファイルを削除したり、悪意のあるコードを実行してしまう可能性があります。

そのため AI コーディングエージェントはファイルの編集やコマンドの実行を行う際に、ユーザーの承認を求める仕組みが備わっていることが一般的です。しかし AI コーディングエージェントがコマンドを実行するたびにユーザーの承認を求めることは以下のような問題があります。

- 毎回ユーザーの承認を待つ必要があるので、開発サイクルが低下する
- ユーザーは多くの承認を求められた結果「承認疲れ」を起こし、実行内容を十分に確認せずに承認してしまう可能性がある

特に後者の問題は重要であり、セキュリティを高める目的で導入された承認プロセスが逆にセキュリティリスクを高めてしまう可能性があります。このような問題に対処する方法として、Claude Code の `permissions` 機能ではあらかじめ許可されたコマンドはユーザーの承認なしに実行できるようにする仕組みが提供されています。この設定をうまく活用することで、ユーザーが本当に重要なコマンドの承認に集中できるようになります。

```json:settings.json
{
  "permissions": {
    "allow": [
      "Bash(npm run test:*)",
      "Bash(find:*)"
    ],
    "deny": [
      "Bash(rm:*)"
      "Read(./.env.*)",
      "Read(./secrets/**)"
    ]
  }
}
```

とはいえ、あらかじめ許可されたコマンドが悪意のあるコードを実行してしまうリスクは依然として存在します。例えば上記の設定では `rm` コマンドの実行は拒否されていますが、`Bash(find:*)` が許可されているため、`find . -exec rm {} \;` のようなコマンドを実行してしまう抜け道を AI エージェントが見つけてしまう可能性があります。また依然としていくつかのコマンドの実行に承認が必要になることは変わりません。例えば [Vibe Kanban](https://www.vibekanban.com/) のような AI エージェントの自律性を最大限高めるように設計されたツールでは、デフォルトでユーザーの承認を求めない設定で起動するようになっています。

このような問題に対処するために、Claude Code ではサンドボックス機能が提供されています。サンドボックス機能では OS ごとに異なる軽量なサンドボックス環境を利用して、Claude Code のファイルシステムやネットワークへのアクセスを制限します。これにより Claude Code が個々のコマンドを実行するたびにユーザーの承認を求める必要がなくなり、より自律性を高く保ちながらも安全に動作させることが可能になります。

この記事では、Claude Code のサンドボックス機能の仕組みと利用方法について解説します。

## Claude Code のサンドボックス機能の仕組み

Claude Code のサンドボックス機能は、ファイルシステムとネットワークシステムの両方に対して分離を行います。ファイルシステムの分離では、Claude Code がアクセスできるディレクトリを制限し、明示的に許可されたディレクトリ以外へのアクセスを防ぎます。ネットワークアクセスは外部で実行されるプロキシサーバーを介して制御され、許可されたドメインへのアクセスのみが可能になります。

サンドボックスは 2025 年 11 月時点で macOS と Linux で利用可能であり、Windows ではまだサポートされていません。macOS では Apple の Apple Seatbelt（`sandbox-exec` コマンド）が、Linux では [Bubblewrap](https://github.com/containers/bubblewrap) がそれぞれ使用されています。

Claude Code で使用されているサンドボックスランタイムはオープンソースの npm パッケージ `@anthropic-ai/sandbox-runtime` として提供されています。そのため任意の AI コーディングエージェントで同様のサンドボックス機能を実装することも可能です。

サンドボックスランタイムのソースコードは以下のレポジトリで公開されているため、実装の詳細についてはそちらを参照してください。

https://github.com/anthropic-experimental/sandbox-runtime

`@anthropic-ai/sandbox-runtime` パッケージを使用して、サンドボックスでのコマンドの実行を試してみましょう。まずは以下のコマンドでパッケージをインストールします。

```bash
$ npm install @anthropic-ai/sandbox-runtime -g
```

インストールが完了したら `srt` コマンドが使用可能になります。

```bash
$ srt --help

Usage: srt [options] <command...>

Run commands in a sandbox with network and filesystem restrictions

Arguments:
  command                command to run in the sandbox

Options:
  -V, --version          output the version number
  -d, --debug            enable debug logging
  -s, --settings <path>  path to config file (default: ~/.srt-settings.json)
  -h, --help             display help for command
```

`srt` の引数に実行したいコマンドを指定することで、サンドボックス環境でコマンドを実行できます。例えば以下のコマンドでは `echo` コマンドをサンドボックス環境で実行しています。

```bash
$ srt "echo 'Hello, Sandbox!'"

Running: echo 'Hello, Sandbox!'
Hello, Sandbox\!
```

:::warning
`srt` コマンドの実行には `rg` コマンドが必要です。[ripgrep](https://github.com/BurntSushi/ripgrep) を `brew install ripgrep` などでインストールしてください。
:::

デフォルトで許可されていないドメインに対するネットワークアクセスを試みると、以下のようにエラーになります。

```bash
$ srt "curl https://www.example.com"

Running: curl http://www.example.com
Connection blocked by network allowlist
```

特定のファイルに対するアクセスもデフォルトで無効にされています。

```bash
$ srt "cat ~/.ssh/id_rsa"

Running: cat ~/.ssh/id_rsa
Connection blocked by filesystem allowlist
```

## Claude Code のサンドボックス機能を使う

Claude Code でサンドボックス機能を使用するために `/sandbox` コマンドを使用します。Claude Code を起動した後に以下のコマンドを実行します。

```
/sandbox
```

以下の 3 つのオプションが表示されるので、カーソルキーで選択して Enter キーを押します。

```sh
1. Sandbox BashTool, with auto-allow in accept edits mode
2. Sandbox BashTool, with regular permissions
3. No Sandbox (current)
```

1 番目のオプションではすべてのコマンドの実行前にユーザーの承認を求めることなく、サンドボックス環境でコマンドが実行を試みます。サンドボックス環境でコマンドの実行に失敗した場合には、通常の `permissions` 設定に基づいてユーザーの承認を求めたうえでサンドボックス環境外でコマンドが実行されます。

サンドボックス機能がどのように動作するか試してみましょう。Claude Code を実行しているカレントディレクトリの外にあるファイルにアクセスを試みるようなプロンプトを与えます。

```text
`../kanban-app` ディレクトリに `test.txt` ファイル touch してください。
```

サンドボックス機能が無効な場合には、ユーザーの承認を得た後に `touch` コマンドが実行され、`test.txt` ファイルが作成されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/6PoAYSpzlOxmaC6AAORzA5/3cb3a4c3a1e3e33f42692ee4ded385ea/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-11-01_16.31.29.png)

サンドボックスを有効にした場合には、サンドボックスの制限により `touch` コマンドの実行に失敗したことを報告してきました。その後、サンドボックスを一時的に無効にし `touch` コマンドを再実行するため、ユーザーの承認を求めてきました。

![](https://images.ctfassets.net/in6v9lxmm5c8/6N1PfMtnvzSFwm6vJlG1ge/cddbfdbcc062cf613bef51962af70548/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-11-01_16.29.45.png)

なお、`--dangerously-skip-permissions` オプションを使用して Claude Code を起動した場合にはサンドボックス環境でコマンドの実行に失敗した後に、ユーザーの承認を求めることなしにサンドボックスを無効にしてコマンドを再実行するようです。サンドボックスを有効にしているのにもかかわらず、AI エージェントの判断によりサンドボックスを無効にしてコマンドを実行されてしまうのはセキュリティ上のリスクがあるように感じます。

![](https://images.ctfassets.net/in6v9lxmm5c8/14GbGepwllMJWP58TMhIwu/fac51b0618835da8ddcedc077a2d9ef9/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-11-01_16.38.40.png)

また、Claude Code の Bash ツールにはサンドボックスの制限を回避する `dangerouslyOverrideSandbox` オプションが存在するようです。本来このオプションはユーザーから明示的に要求された場合のみ使用されるように指示されるようですが、AI エージェントが誤ってこのオプションを有効にしてコマンドを実行してしまう問題が Issue として報告されています。

https://github.com/anthropics/claude-code/issues/10089

### サンドボックス機能の設定

Claude Code の `settings.json` ファイルでの `sandbox` セクションでサンドボックス機能の設定を行うことができます。以下は設定例です。

```json:settings.json
{
  "sandbox": {
    // サンドボックス機能を有効にするかどうか。デフォルトは false
    "enabled": true,
    // サンドボックス環境内で実行されるコマンドを自動的に許可するかどうか。デフォルトは true
    "autoAllowBashIfSandboxed": true,
    // サンドボックス外で実行する必要があるコマンドのリスト
    "excludedCommands": ["docker"],
    // `dangerouslyDisableSandbox` コマンドを使用してサンドボックスを無効にすることを許可するかどうか。デフォルトは true
    "allowUnsandboxedCommands": false,
    "network": {
      // サンドボックス環境内で許可される Unix ソケットのリスト
      "allowUnixSockets": [
        "/var/run/docker.sock"
      ],
      // ローカルホストへのバインディングを許可するかどうか（macOS のみ)。デフォルトは false
      "allowLocalBinding": true,
      // 独自のネットワークプロキシサーバーを指定する場合に使用
      // 指定しない場合は Claude のデフォルトのプロキシサーバーが使用される
      "httpProxyPort": 8080,
      "socksProxyPort": 8081
    },
    // 権限の弱い Docker 環境のために、より弱いサンドボックスを有効にするかどうか(Linux のみ)。デフォルトは false
    "enableWeakerNestedSandbox": false
  }
}
```

ファイルシステムへのアクセスは `Read/Edit` の権限で、ネットワークアクセスで許可するドメインは `WebFetch` の権限でそれぞれ制御されます。

```json:settings.json
{
  "permissions": {
    "allow": [
      "Read(./src/**)",
      "Edit(./src/**)",
      "WebFetch(https://api.example.com/*)"
    ],
    "deny": [
      "Read(./secrets/**)",
      "Edit(./secrets/**)",
      "WebFetch(https://malicious.example.com/*)"
    ]
  }
}
```

## まとめ

- Claude Code のサンドボックス機能は、AI コーディングエージェントのファイルシステムやネットワークへのアクセスを制限し、安全に動作させるための仕組みである
- サンドボックス環境では、Claude Code がアクセスできるディレクトリやドメインが制限される
- macOS では Apple Seatbelt、Linux では Bubblewrap を使用してサンドボックス環境が実現されている。詳細な実装はオープンソースの `@anthropic-ai/sandbox-runtime` パッケージで公開されている
- `/sandbox` コマンドでサンドボックス機能を有効にできる
- サンドボックスでのコマンド実行に失敗した場合には、通常の `permissions` 設定に基づいてユーザーの承認を求めたうえでサンドボックス環境外でコマンドが試行される
- `settings.json` ファイルの `sandbox` セクションでサンドボックス機能の詳細な設定ができる。ファイルシステムへのアクセスは `Read/Edit` の権限で、ネットワークアクセスで許可するドメインは `WebFetch` の権限でそれぞれ制御される

## 参考

- [Making Claude Code more secure and autonomous with sandboxing \ Anthropic](https://www.anthropic.com/engineering/claude-code-sandboxing)
- [Sandboxing - Claude Docs](https://docs.claude.com/en/docs/claude-code/sandboxing)
- [anthropic-experimental/sandbox-runtime: A lightweight sandboxing tool for enforcing filesystem and network restrictions on arbitrary processes at the OS level, without requiring a container.](https://github.com/anthropic-experimental/sandbox-runtime)
- [macOSのApple Seatbelt (sandbox-exec) について調べた - 焼売飯店](https://blog.syum.ai/entry/2025/04/27/232946)
- [Claude CodeのSandboxing機能を試してみる：ファイルシステム分離](https://zenn.dev/tomioka/articles/0496a427f8bcd0)
