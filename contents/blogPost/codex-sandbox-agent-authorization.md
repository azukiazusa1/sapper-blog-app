---
id: HKSTfs_Heuq5RKDfdECNN
title: "Codex の Sandbox とエージェントの承認について"
slug: "codex-sandbox-agent-authorization"
about: "コーディングエージェントの自動承認の範囲をどこまで許可するかは、ユーザー体験とセキュリティのバランスを取る上で重要な設計指針の1つです。Codex ではサンドボックス機能を提供することで、エージェントが安全に自律的に動作できる環境を実現しています。この記事では、Codex のサンドボックスの仕組みと、サンドボックス外でコマンドを実行する際の承認プロセスについて説明します。"
createdAt: "2026-04-05T11:29+09:00"
updatedAt: "2026-04-05T11:29+09:00"
tags: ["codex"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/6F37q3sUBNcslGybG5Jj4/a78d727bb3ccbf53bd06831408b95fe0/omelette_21156-768x591.png"
  title: "omelette 21156-768x591"
audio: null
selfAssessment:
  quizzes:
    - question: "コーディングエージェントのコマンド実行において、危険性の低いコマンドは自動承認し、破壊的なコマンドのみ承認を求める設計が重要とされる主な理由は何ですか？"
      answers:
        - text: "すべてのコマンドを自動承認すると、サンドボックスの設定が無効になるため"
          correct: false
          explanation: "自動承認の有無とサンドボックス自体の有効性は別です。記事では、主に安全性と運用負荷のバランスが論点でした。"
        - text: "承認プロンプトを減らすことで、ユーザーが内容を確認しやすくなり、承認疲れを避けやすくなるため"
          correct: true
          explanation: "記事では、承認プロンプトが多すぎると反射的に承認してしまう「承認疲れ」が起き、かえって危険になると説明しています。"
        - text: "ユーザーの承認が不要になれば、ネットワークアクセスが常に安全になるため"
          correct: false
          explanation: "承認が不要になってもネットワークアクセスのリスクは残ります。記事でも別のリスクとして扱われています。"
        - text: "ファイルシステムへの変更を完全に防げるようになるため"
          correct: false
          explanation: "自動承認ルールだけで変更を完全に防げるわけではありません。どのコマンドを許可するかの設計が重要です。"
    - question: "読み取りは許可しつつ、ファイル編集を承認なしでは行わせたくない状況で、最も適した設定はどれですか？"
      answers:
        - text: "`danger-full-access` と `never`"
          correct: false
          explanation: "これは制限をほぼ外す設定であり、読み取り専用の要件には合いません。"
        - text: "`workspace-write` と `on-request`"
          correct: false
          explanation: "`workspace-write` ではワークスペース内の書き込みが許可されるため、編集を抑止したい要件には強すぎません。"
        - text: "`read-only` と `on-request`"
          correct: true
          explanation: "記事では `read-only` がワークスペース内の読み取りのみを許可するモードとして説明されており、この要件に最も適しています。"
        - text: "`workspace-write` と `never`"
          correct: false
          explanation: "承認なしで編集ができてしまうため、条件に反します。"
    - question: "`guardian_approval` を有効にしたときの効果として、記事の説明に最も合っているものはどれですか？"
      answers:
        - text: "サンドボックス外でのコマンド実行がすべて自動的に許可され、審査自体がなくなる"
          correct: false
          explanation: "記事では審査がなくなるのではなく、承認判断をサブエージェントに委譲できると説明しています。"
        - text: "Web Search Tool の検索結果が常にリアルタイムに切り替わる"
          correct: false
          explanation: "`guardian_approval` は承認プロセスに関する機能であり、Web Search Tool の検索モードとは無関係です。"
        - text: "承認が必要な場面では、サブエージェントが必ず実行を拒否するようになる"
          correct: false
          explanation: "記事では拒否専用になるのではなく、ユーザーの代わりに承認可否を判断すると説明しています。"
        - text: "承認が必要なとき、ユーザーへの確認の代わりにサブエージェントへ判断を委譲し、承認回数を減らせる"
          correct: true
          explanation: "記事では、ユーザーに毎回尋ねる代わりにサブエージェントへ承認判断を委譲し、承認疲れを減らせる点が利点として説明されています。"
published: true
---
コーディングエージェントを使用する際の重要な設計指針の 1 つとして、コマンドの自動承認をどこまで許可するかという問題があります。すべてのコマンドで承認を求めずに自律的に動作させると、ワークフローの効率は向上しますが、誤ったコマンドの実行や悪意のあるコードの実行などのリスクも伴います。実際にコーディングエージェントが誤って `rm -rf ~/` のような危険なコマンドを実行してしまったという事例も報告されています。

一方ですべてのコマンドの実行の前にユーザーの承認を求めればセキュリティ上の安全性が高まるかといえば、必ずしもそうとは限りません。承認プロンプトが頻繁に表示されると、だんだんとユーザーが承認を安易に行うようになり、特に実行内容を確認せずに反射的に承認してしまうリスクがあります。このことは「承認疲れ（authorization fatigue）」とも呼ばれ、セキュリティの観点からはむしろ危険な状態を生み出す可能性があります。`ls` や `cat` のような危険性が低いコマンドは自動承認を許可し、`rm` や `mv` のようなファイルシステムに影響を与えるコマンドは承認を求めるなど、コマンドの種類やリスクレベルに応じた柔軟な承認ルールを設けることが重要です。

コマンドの自動承認を許可する範囲を広げて、エージェントの自律性を高めることは、ユーザー体験の向上やワークフローの効率化にもつながります。セキュリティを確保しつつエージェントがより多くのタスクを自律的に実行できるようにするための手段として、多くのコーディングエージェントでは「サンドボックス（sandbox）」という概念が採用されています。サンドボックスは、エージェントが実行できるコマンドやアクセスできるリソースを制限する仮想的な環境を提供する仕組みです。これにより、エージェントが誤って危険なコマンドを実行してしまったとしても、その影響を最小限に抑えることができます。

Codex のサンドボックスではワークスペース内のファイルを読み書きしたり、その範囲内のコマンド（`ls` や `find` など）を実行することがあらかじめ許可されています。それ以外の破壊的な変更を含むコマンドであったり、ネットワークアクセスを伴うコマンドはサンドボックス内では許可されておらず、エージェントがサンドボックス外でコマンドを実行するためにはユーザーの承認が必要になります。

この記事では、Codex のサンドボックスの仕組みと、サンドボックス外でコマンドを実行する際の承認プロセスについて説明します。

## Codex のサンドボックスをはじめる

Codex のサンドボックスでは各 OS のネイティブなサンドボックス機能を使用します。前提条件として、以下の OS ごとの要件を満たす必要があります。

- macOS: 組み込みの Seatbelt
- Windows: PowerShell で実行する場合は Windows Sandbox、WSL で実行する場合は Linux のサンドボックス機能
- Linux または WSL: [bubblewrap](https://github.com/containers/bubblewrap) をあらかじめインストールしておく必要がある

Codex ではデフォルトでサンドボックスが有効になっています。Codex はサンドボックス内で何が行えるかを制御する「サンドボックスモード」と、コマンドを実行する際の承認プロセスを制御する「承認ポリシー」の組み合わせによって、エージェントの自律性とセキュリティのバランスを取っています。

サンドボックスには以下の 3 つのモードがあり、デフォルトは `workspace-write` ですが、ワークスペースがバージョン管理されていない場合は `read-only` になります。

- `workspace-write`: ワークスペース（Codex が起動されたディレクトリや `tmp/` ディレクトリなど）内のファイルへの読み書きと、ルーチン的なコマンド（`ls` や `find` など）が許可されるモード
- `read-only`: ワークスペース内のファイルへの読み取りのみが許可されるモード。承認なしにファイルの編集や作成はできない
- `danger-full-access`: サンドボックスの制限が完全に解除されるモード。エージェントはシステム上のすべてのファイルにアクセスでき、ネットワークアクセスも可能になる。

`workspace-write` モードであったとしても、以下のパスは読み取り専用として保護されています。

- `<writable-root>/.git`
- `<writable-root>/.agents`
- `<writable-root>/.codex`

また承認ポリシーとして以下の 3 つが用意されています。デフォルトは `on-request` です。

- `untrusted`: 信頼できるコマンドセットに含まれないコマンドを実行する前にユーザーの承認を求める
- `on-request`: サンドボックス外でコマンドを実行する前にユーザーの承認を求める
- `never`: 承認プロセスのために停止することはない

サンドボックスのモードや承認ポリシーは、Codex を起動する際のオプションで指定できます。例えば、サンドボックスを `read-only` モードに設定し、承認ポリシーを `untrusted` に設定するには、以下のようにします。

```bash
codex --sandbox read-only --ask-for-approval untrusted
```

`~/.codex/config.toml`（ユーザー設定）やプロジェクトのルートディレクトリに配置された `.codex/config.toml`（プロジェクト設定）に同様の設定を記述できます。プロジェクト設定はユーザー設定よりも優先されます。

```toml:.codex/config.toml
sandbox_mode = "read-only"
approval_policy = "untrusted"
```

アクセス制御の設定をプリセットとして保存しておくこともできます。ここで保存したプリセットは `codex --profile <profile-name>` で呼び出すことができます。

```toml:.codex/config.toml
[profiles.full-access]
sandbox_mode = "danger-full-access"
ask_for_approval = "never"

[profiles.read-only]
sandbox_mode = "read-only"
ask_for_approval = "never"
```

Codex App では「設定」→「構成」から UI 上でサンドボックスのモードや承認ポリシーを切り替えることもできます。ここで行った変更は `config.toml` に保存されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/28mjI08ajC4eOrB2JMWdZA/6a982497871049c01c049d0bf8a8cc5e/image.png)

実際に Codex のサンドボックス内でコマンドを実行したとき何が起こるか確認するためには `codex sandbox` コマンドを使用できます。`codex sandbox` の引数にはどのサンドボックス環境でコマンドを実行するかを指定します。

```bash
# macOS
codex sandbox macos [command]
# Linux
codex sandbox linux [command]
```

例えば `ls` コマンドをサンドボックス内で実行してみましょう。このコマンドは問題なく実行できます。

```bash
$ codex sandbox macos ls
README.md　app/　...
```

一方で、`git add .` のような操作は失敗することがわかります。`<writable-root>/.git` ディレクトリは読み取り専用として保護されているためですね。

```bash
$ codex sandbox macos git add .
fatal: Unable to create '/sapper-blog-app/.git/index.lock': Operation not permitted
```

その他 `curl` コマンドのようなネットワークアクセスを伴うコマンドもサンドボックス内では失敗します。

```bash
$ codex sandbox macos curl https://www.google.com
curl: (6) Could not resolve host: www.google.com
```

## ネットワークアクセス

Codex はデフォルトでサンドボックス内でのネットワークアクセスを許可していません。エージェントのインターネットアクセスを有効にすると、以下のようなセキュリティリスクが伴うためです。

- 信頼できないウェブコンテンツによるプロンプトインジェクション攻撃
- コードや機密情報の漏洩
- マルウェアや脆弱なライブラリのダウンロード
- ライセンス違反のあるコンテンツを取り込む

実際にウェブサイトに不可視のテキストを埋め込み、エージェントにのみ悪意のある指示を与えるプロンプトインジェクション攻撃の事例も報告されています。対策として、信頼できないウェブサイトにそもそもアクセスさせないことが重要になります。

https://www.keysight.com/blogs/en/tech/nwvs/2025/05/16/invisible-prompt-injection-attack

`config.toml` の `sandbox_workspace_write.network_access` を `true` に設定することで、サンドボックス内でのネットワークアクセスを許可できますが、セキュリティ上の観点で推奨されていません。

```toml
[sandbox_workspace_write]
network_access = true
```

ネットワークアクセスを許可する代わりに、組み込みの [Web Search Tool](https://developers.openai.com/api/docs/guides/tools-web-search) をエージェントに使用してもらうのが安全な選択肢になります。Codex はデフォルトでキャッシュされた検索結果を使用します。キャッシュは OpenAI により管理されていますが、完全にプロンプトインジェクションのリスクを排除できないため、Web の検索結果は依然として信頼できないものとして扱う必要があります。

リアルタイムの検索結果を使用したい場合は `--search` オプションもしくは `config.toml` の `web_search` セクションで `live` を指定します。`disable` を指定すると、Web Search Tool を完全に無効化できます。

```toml
web_search = "cached" # デフォルト

# web_search = "live" # リアルタイムの検索結果を使用
# web_search = "disable"
```

## サンドボックス外で実行するコマンドの制御

Rules を使用すると、サンドボックス外で実行するコマンドを制御できます。例えば `npm install` コマンドはネットワークアクセスを伴うため、サンドボックス外で実行する必要がありますが、あらかじめ安全であることがわかっているため実行前にユーザーの承認を求める必要はないといったケースがあるでしょう。

Rules は `~/.codex/rules/` もしくはプロジェクトのルートディレクトリに配置された `.codex/rules/` に定義します。`default.rules` ファイルを作成しましょう。このファイルは `Starlark` 形式で記述され、ルールを定義します。以下は `npm install` コマンドをサンドボックス外で自動的に許可するルールの例です。

```starlark:~/.codex/rules/default.rules
prefix_rule(
    pattern = ["npm", "install"],
    decision = "allow",
    justification = "通常の npm install 実行",
    match = ["npm install", "npm install react", "npm install --save-dev vitest"],
)
```

`pattern` は必須のフィールドで、一致させるコマンドのプレフィックスを指定します。`decision` はルールが一致したときの動作を指定し、以下の 3 つのいずれかを指定できます。

- `allow`: 承認プロンプトを表示せずにコマンドを実行する
- `prompt`: コマンドの実行前にユーザーの承認を求める
- `forbidden`: プロンプトを表示せずにコマンドの実行をブロックする

`justification` はルールの説明を記述するフィールドで、承認プロンプトに表示されます。`match` はルールを読み込む際に検証する例です。ルールが適用される前に間違いを検出するために使用されます。

`codex execpolicy check` コマンドを使用してルールの定義を検証できます。

```bash
$ codex execpolicy check --pretty \
 --rules ~/.codex/rules/default.rules \
 -- npm install react

{
  "matchedRules": [
    {
      "prefixRuleMatch": {
        "matchedPrefix": [
          "npm",
          "install"
        ],
        "decision": "allow",
        "justification": "通常の npm install 実行"
      }
    }
  ],
  "decision": "allow"
}
```

Rules はユーザーが手動で設定するほか、エージェントに承認を求められた際に「2. はい、先頭が次で始まるコマンドを今後尋ねないでください `<command>`」を選択することにより `~/.codex/rules/` に自動的に保存されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/2Ks32eUzKEfO6Lkn8g5ddC/90347577e9632732dcc460abf5adcd55/image.png)

上記のスクリーンショットの例では `git add` コマンドの実行を許可するルールが自動的に保存されていることがわかります。

```starlark:~/.codex/rules/default.rules
prefix_rule(pattern=["git", "add"], decision="allow")
```

## サブエージェントに承認を委譲する `guardian_approval`

Codex では、サンドボックス外でのコマンド実行の承認をサブエージェントに委譲する `guardian_approval` という機能も提供しています。これを使用すると、承認が必要になったときに、ユーザーに承認を求める代わりに、サブエージェントに承認の判断を任せられます。これによりユーザーが承認する回数を減らし、承認疲れのリスクを軽減できます。

`guardian_approval` を有効にするには、`config.toml` の `features.guardian_approval` を `true` に設定します。

```toml:~/.codex/config.toml
[features]
guardian_approval = true
```

もしくは `codex` を起動した後に `/experimental` コマンドを使用して有効にもできます。

```
/experimental
```

![](https://images.ctfassets.net/in6v9lxmm5c8/24OMnqMNyT3xXAM0XEN3iN/1c7fb9d61b81c94d760b3e6c3f84f899/image.png)

`guardian_approval` を有効にした状態でテストを実行してもらうようにエージェントに指示してみましょう。このプロジェクトでは [turborepo](https://turborepo.dev/) を使用しています。サンドボックス内で `npm run test` コマンドの実行を試みると、TLS 初期化に必要なネットワークアクセスが制限されているため失敗します。

Codex のエージェントは `npm run test` コマンドが TLS 初期化で失敗したことを受けて、サンドボックス外での実行が必要であると判断しました。このとき承認プロンプトは表示されずに、サブエージェントに承認を求めていることがわかります。最終的に「✔ Auto-reviewer approved codex to run npm run test this time」というログが表示され、ユーザーの承認を待たずして `npm run test` コマンドがサンドボックス外で実行されていることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/76NiL9Mo1qgMboTg8GVXCT/7faa9195509eb9e7ae6828de9a55e669/image.png)

## まとめ

- コマンドの自動承認をどこまで許可するかは、エージェントの自律性とセキュリティのバランスを取るための重要な設計指針である
- サンドボックスは、エージェントが実行できるコマンドやアクセスできるリソースを制限する仮想的な環境を提供する仕組みであり、エージェントの自律性を高めつつセキュリティを確保するための有効な手段である
- Codex はサンドボックスのモードと承認ポリシーの組み合わせによって、エージェントの自律性とセキュリティのバランスを取っている
- Codex のサンドボックス内はデフォルトで `workspace-write` モードで、承認ポリシーは `on-request` に設定されている。この設定では、ワークスペース内のファイルへの読み書きとルーチン的なコマンドが許可される一方で、サンドボックス外でコマンドを実行する前にユーザーの承認が必要になる
- Codex ではサンドボックス内でのネットワークアクセスはデフォルトで許可されていない。ネットワークアクセスを伴うコマンドをサンドボックス内で実行する必要がある場合は、Web Search Tool を使用するのが安全な選択肢になる。Web Search Tool ではキャッシュされた検索結果を使用するため、プロンプトインジェクションのリスクを軽減できる
- Rules を使用すると、サンドボックス外で実行するコマンドを制御できる。
- Codex では、サンドボックス外でのコマンド実行の承認をサブエージェントに委譲する `guardian_approval` という機能も提供している。これにより、ユーザーが承認する回数を減らし、承認疲れのリスクを軽減できる

## 参考

- [Sandboxing – Codex | OpenAI Developers](https://developers.openai.com/codex/concepts/sandboxing)
- [Agent approvals & security – Codex | OpenAI Developers](https://developers.openai.com/codex/agent-approvals-security)
- [Agent internet access – Codex web | OpenAI Developers](https://developers.openai.com/codex/cloud/internet-access)
- [Web search | OpenAI API](https://developers.openai.com/api/docs/guides/tools-web-search)
- [Rules – Codex | OpenAI Developers](https://developers.openai.com/codex/rules)
