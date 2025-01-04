---
id: XcAKcuBj04ftqMw4pXeY7
title: "GitHub Actions で再利用可能なワークフローを作成する"
slug: "github-actions-reusable-workflow"
about: "GitHub Actions で CI/CD 環境を構築する際に、同じような処理を複数のファイルで記述するようなことがよくあります。この記事では、GitHub Actions で再利用可能なワークフローを作成する方法と、実際に再利用可能なワークフローを作成する手順を紹介します。"
createdAt: "2025-01-04T11:30+09:00"
updatedAt: "2025-01-04T11:30+09:00"
tags: ["GitHub Actions"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1BnO7xzpLIkHQYeR0QssrZ/18db8d8010f0205033a704d5a35af522/canned-snow-crab_14713-768x729.png"
  title: "蟹の缶詰のイラスト"
selfAssessment:
  quizzes:
    - question: "再利用可能なワークフローを作成するためにはどのキーを使用するか？"
      answers:
        - text: "`on.workflow_call`"
          correct: true
          explanation: ""
        - text: "`on.workflow_dispatch`"
          correct: false
          explanation: "workflow_dispatch イベントは手動でワークフローをトリガーするためのイベントです。"
        - text: "`reusable-workflow`"
          correct: false
          explanation: ""
        - text: "`module`"
          correct: false
          explanation: ""

published: true
---

GitHub Actions を使って CI/CD 環境を構築する際に、同じような処理を複数のファイルで記述するようなことがよくあります。例えばデプロイを行うワークフローでは、staging 環境と production 環境とで異なるタイミングでデプロイを行う必要があるため、それぞれのワークフローを別々のファイルに記述することでしょう。このような場合記述される処理は環境に依存する部分以外の多くの部分は共通していることが多いです。

ワークフローの再利用を使用することで、処理の共通を回避し容易なワークフローの管理が可能になります。また適切な設計がされたワークフローを使い回すことでベストプラクティスに従ったワークフローを簡単に導入することができます。Organizations で共通のワークフローを使い回すことで、組織全体でベストプラクティスを共有することができるでしょう。

この記事では、GitHub Actions で再利用可能なワークフローを作成する方法と、実際に再利用可能なワークフローを作成する手順を紹介します。

## 再利用可能なワークフローを作成する

再利用可能なワークフローは通常のワークフローと同様に `.github/workflows` ディレクトリに配置します。再利用可能なワークフローとして他のワークフローから呼び出されるようにするためには、`on` の値に `workflow_call` を指定します。

```yaml:.github/workflows/wf-reusable-example.yaml
name: Reusable Workflow Example

on:
  workflow_call:
```

-> GitHub Actions では `.github/workflows` ディレクトリのサブディレクトリは許可されていません。そのため、再利用可能なワークフローとその読み出し元のワークフローを区別するためにファイルの名前に接頭辞をつけることをお勧めします。この記事では再利用可能なワークフローのファイル名に `wf-` を、読み出し元のワークフローのファイル名に `on-` を付けることにします。

ワークフローの一連のステップは通常のワークフローと同様に `jobs` キーの下に記述します。ここでは簡単に `echo` コマンドを実行するジョブを定義します。

```yaml:.github/workflows/wf-reusable-example.yaml
name: Reusable Workflow Example

on:
  workflow_call:

jobs:
  echo-job:
    runs-on: ubuntu-latest
    steps:
      - name: Echo Hello
        run: echo "Hello"
```

## 再利用可能なワークフローを呼び出す

再利用可能なワークフローを呼び出すには、`jobs` キーの下に `uses` キーを使用します。ワークフローファイルを参照する際には以下のいずれかの構文を使用します。

- 同じリポジトリ内のワークフローファイルを参照する場合：`./.github/workflows/{filename}`
- 他のリポジトリ内のワークフローファイルを参照する場合：`{owner}/{repo}/.github/workflows/{filename}@{ref}`

他のレポジトリを参照する際に指定する `{ref}` は SHA、リリースタグ、またはブランチ名を指定できます。同じレポジトリのファイルを参照する場合には、呼び出し元のワークフローと同じコミットから取得されます。

それでは先ほど作成した `wf-reusable-example.yaml` を呼び出すワークフローを作成してみましょう。ここでは Issue が作成された際に呼ばれるワークフローを作成します。

```yaml:.github/workflows/on-issue-created.yaml
name: On Issue Created

on:
  issues:
    types: [opened]

jobs:
  call-workflow:
    uses: ./.github/workflows/wf-reusable-example.yaml
```

ワークフローファイルを作成したら実際に Issue を作成して試してみましょう。「Issues」タブから「New issue」ボタンをクリックして Issue を作成します。

![](https://images.ctfassets.net/in6v9lxmm5c8/1pnVo6a4cI2kO1xLiiYkq4/3318d1f3ea47fb3ca7b090535733c178/__________2025-01-04_12.12.31.png)

Issue を作成した後に Actions タブを開くと、`On Issue Created` ワークフローが実行されていることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/6uPp2iacwFl9lPOUhv6BnZ/053f72aa1d144d2cc60edb2ab84ee003/__________2025-01-04_12.33.08.png)

実行されたワークフローをクリックしてログを確認すると、確かに `Reusable Workflow Example` ワークフロー内で定義した `echo-job` が実行されていることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/6laM783ojyHb9pXhF3CML6/ba8329b47811a0b8cea70dbeca3c072a/__________2025-01-04_12.34.33.png)

## 再利用可能なワークフローにパラメータを渡す

例えばデプロイ環境ごとに異なる設定を渡すような場合、再利用可能なワークフローを呼び出す際にパラメータを渡すことでワークフローを柔軟に使い回すことがｄけいます。再利用可能なワークフローにわたすパラメータは `on.workflow_call.inputs` キーに定義します。

```yaml:.github/workflows/wf-reusable-example.yaml
name: Reusable Workflow Example

on:
  workflow_call:
    inputs:
      environment:
        description: 'デプロイ先の環境'
        required: true
        type: string
      timeout:
        description: 'デプロイがタイムアウトされるまでの時間（ミリ秒）'
        required: false
        default: 10000
        type: number
```

`inputs` の下のキー名がパラメータの名前に対応します。パラメータには以下のプロパティを指定できます。

- `description`：パラメータの説明
- `required`：パラメータが必須かどうか
- `default`：パラメータのデフォルト値。指定されていない場合 `false`（真偽値）、`0`（数値）、`''`（文字列）がデフォルト値として使用される
- `type`：パラメータの型。`string`、`number`、`boolean` のいずれかを指定できる

-> 上記のプロパティはすべて省略可能ですが、他の人が理解しやすいようにできる限り詳細に使用用途を記述することは良い習慣です。これらのプロパティはドキュメントとしての役割を果たします。もし新たなワークフローを作成する際にこれらのプロパティを必ず指定されるようにしてもらいたい場合には、[actionlint](https://github.com/rhysd/actionlint) のようなツールを使うとよいでしょう。actionlint はファイルの静的解析により構文ミスやベストプラクティスに反する箇所を検出することができます。

定義されたパラメータはワークフロー内で `${{ inputs.パラメータ名 }}` の形式で参照できます。

```yaml:.github/workflows/wf-reusable-example.yaml
name: Reusable Workflow Example

on:
  workflow_call:
    inputs:
      environment:
        description: 'デプロイ先の環境'
        required: true
        type: string
      timeout:
        description: 'デプロイがタイムアウトされるまでの時間（ミリ秒）'
        required: false
        default: 10000
        type: number

jobs:
  echo-job:
    runs-on: ubuntu-latest
    env:
      ENVIRONMENT: ${{ inputs.environment }}]
      # toJSON は数値を文字列に変換するために使用
      TIMEOUT: ${{ toJSON(inputs.timeout) }}
    steps:
      - name: Echo Environment
        run: echo "Deploy to $ENVIRONMENT"
      - name: Echo Timeout
        run: echo "Timeout $TIMEOUT"
```

?> セキュリティ上の利用から `inputs` の値を直接参照するのではなく、一度環境変数に設定することが推奨されています。メモリに保存される値として使用されるため、コードのインジェクション防止につながります（ https://docs.github.com/ja/enterprise-cloud@latest/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions#using-an-intermediate-environment-variable ）。

再利用可能なワークフローを呼び出す際にパラメータを渡すには、`with` キーを使用します。

```yaml:.github/workflows/on-issue-created.yaml
name: On Issue Created

on:
  issues:
    types: [opened]

jobs:
  call-workflow:
    uses: ./.github/workflows/wf-reusable-example.yaml
    with:
      environment: 'staging'
```

ファイルを変更してコミットしたら、もう一度 Issue を作成してワークフローが実行されることを確認しましょう。

![](https)

`$ENVIRONMENT` には `with` で指定した値が、`$TIMEOUT` にはデフォルト値が設定されていることが確認できます。

## シークレットの値を再利用可能なワークフローに渡す

データベースの接続情報や API キーなどの機密情報を GitHub Actions で扱う場合、シークレットを使用します。シークレットは Organization もしくはレポジトリ単位で設定できます。シークレットに設定した値はログに出力される際にマスキングされるという特徴があります。

通常シークレットの値を GitHub Actions から参照する際には `${{ secrets.シークレット名 }}` の形式で参照します。しかし、再利用可能なワークフローの中で扱う場合にはたとえ同じレポジトリないであっても直接参照することはできません。`workflow_call.secrets` キーを使用して明示的にシークレットを渡す必要があるのです。

一度シークレットの値を参照する実験をしてみましょう。再利用可能なワークフロー内で `${{ secrets.SUPERSECRET }}` の値を参照しようと試みています。

```yaml:.github/workflows/wf-echo-secrets.yaml
name: echo secrets

on:
  workflow_call:

jobs:
  echo-job:
    runs-on: ubuntu-latest
    steps:
      - name: Echo super secret
        # ここでは実験のために echo コマンドを使ってシークレットの値を出力していますが、
        # 実際にはシークレットの値はログに出力されるべきではありません
        run: echo ${{ secrets.SUPERSECRET }}
```

先ほど作成したワークフローと同じように、Issue が作成された場合に呼び出されるようにします。

```yaml:.github/workflows/on-issue-created.yaml
name: On Issue Created

on:
  issues:
    types: [opened]

jobs:
  call-workflow2:
    uses: ./.github/workflows/wf-echo-secrets.yaml
```

ワークフローを実行する前に、シークレットを設定する必要があります。GitHub のレポジトリページから「Settings」をクリックし、「Secrets and Variables > Actions」を選択します。この画面で「Repository secrets」の「New repository secret」ボタンをクリックすると、シークレットを設定する画面が表示されます。ここで `SUPERSECRET` という名前のシークレットを任意の値で設定しましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/4HFNHbTq7eiiCfKgb5vVIa/d8f052f7a566ccfdbea146c1b7665290/__________2025-01-04_13.24.01.png)

シークレットの作成が完了したら、`SUPERSECRET` のが一覧に表示されていることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/1BW2dgc1Bmi2WBgAO47zts/45337df8bdff4e180b77397805b304fc/__________2025-01-04_13.25.16.png)

シークレットの設定が完了したら Issue を作成してワークフローが実行されることを確認しましょう。前述した通り再利用可能なワークフローではシークレットの値を直接参照できないため、ログには何も出力されないはずです。

![](https://images.ctfassets.net/in6v9lxmm5c8/4HcEESJgkcHvHh20Y9zqrp/3147d62f184d1f4a4affb3c6e061537d/__________2025-01-04_13.45.06.png)

実験が終わったので、正しくシークレットの値を参照できるようにワークフローを修正しましょう。`wf-echo-secrets.yaml` に `workflow_call.secrets` キーを追加します。

```yaml:.github/workflows/wf-echo-secrets.yaml {3-7}
name: echo secrets

on:
  workflow_call:
    secrets:
      SUPERSECRET:
        required: true

jobs:
  echo-job:
    runs-on: ubuntu-latest
    steps:
      - name: Echo super secret
        # ここでは実験のために echo コマンドを使ってシークレットの値を出力していますが、
        # 実際にはシークレットの値はログに出力されるべきではありません
        run: echo ${{ secrets.SUPERSECRET }}
```

`secrets` キーの下にシークレット名をキーとして設定します。`required` プロパティを `true` に設定することで、シークレットが必須であることを示しています。シークレットの値は変わらず `${{ secrets.SUPERSECRET }}` の形式で参照できます。

呼び出し元のワークフローでは、`with` キーと同様に `secrets` キーを使用してシークレットを渡します。

```yaml:.github/workflows/on-issue-created.yaml {12-13}
name: On Issue Created

on:
  issues:
    types: [opened]

jobs:
  call-workflow2:
    uses: ./.github/workflows/wf-echo-secrets.yaml
    with:
      environment: 'staging'
    secrets:
      SUPERSECRET: ${{ secrets.SUPERSECRET }}
```

個別のキーを指定する代わりに、`inherit` キーワードを使用して暗黙的にすべてのシークレットを渡すこともできます。ただし、予期せぬシークレットを渡してしまうことを防ぐため、常に明示的にシークレットを渡すことをお勧めします。また明示的にシークレットを渡す方法では、呼び出し対象のワークフローで指定されていないシークレットが呼び出し元ワークフローによって渡されると、エラーが発生するという利点もあります。

```yaml
jobs:
  call-workflow2:
    uses: ./.github/workflows/wf-echo-secrets.yaml
    secrets: inherit
```

ファイルを修正したら再度ワークフローを実行してみましょう。`SUPERSECRET` の値がマスキングして表示されることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/18Q3PyWiMwzqeTDqzu56px/3cf8fdd7f8f2c410aa4e51c8fa86f73e/__________2025-01-04_14.01.30.png)

## 再利用可能なワークフローの出力を読み取る

再利用可能なワークフローで生成されるデータを呼び出し元から参照したいような場合もあります。例えばデプロイが成功したかどうかで後続の処理を分岐させたい場合などです。再利用可能なワークフローで出力を返すには、`workflow_call.outputs` キーを使用します。`outputs` キーの下に出力の名前をキーとして設定します。`input` キーと同様に `description` プロパティで出力される値の説明を記述することができます。

下記のワークフローでは、`output-job` というジョブを定義し、このジョブで出力された値を `workflow_call.outputs` キーに引き渡しています。各ジョブで出力される値は `$GITHUB_OUTPUT` という特別な環境変数に `{key}={value}` の形式で設定します。

```yaml:.github/workflows/wf-output-example.yaml
name: Output Example

on:
  workflow_call:
    outputs:
      build:
        description: 'ビルドの成否'
        value: ${{ jobs.output-job.outputs.build }}
      test:
        description: 'テストの成否'
        value: ${{ jobs.output-job.outputs.test }}
jobs:
  output-job:
    runs-on: ubuntu-latest
    steps:
      - name: Step 1
        id: step1
        run: echo "build=succeeded" >> $GITHUB_OUTPUT
      - name: Step 2
        id: step2
        run: echo "test=failure" >> $GITHUB_OUTPUT
    outputs:
      build: ${{ steps.step1.outputs.build }}
      test: ${{ steps.step2.outputs.test }}
```

ここでは `build` と `test` という 2 つの出力を定義しています。呼び出し元のワークフローから参照する場合には、同じワークフロー内の job を参照するのと同じように `${{ steps.{job_id}.outputs.{key} }}` の形式で参照します。

```yaml:.github/workflows/on-issue-created.yaml
name: On Issue Created

on:
  issues:
    types: [opened]

jobs:
  call-workflow3:
    uses: ./.github/workflows/wf-output-example.yaml

  check-output:
    runs-on: ubuntu-latest
    # needs で call-workflow3 のジョブが完了するまで待つ
    needs: call-workflow3
    steps:
      - name: Check build output
        run: echo ${{ needs.call-workflow3.outputs.build }}
      - name: Check test output
        run: echo ${{ needs.call-workflow3.outputs.test }}
```

実際にワークフローを十個すうると、`check-output` ジョブで `build` と `test` の出力が表示されることが確認できます。

## まとめ

- 再利用可能なワークフローを作成するには、`on` の値に `workflow_call` を指定する
- 再利用可能なワークフローを呼び出すには、`uses` キーを使用する。ファイルを参照する際には以下のいずれかの構文を使用する
  - 同じリポジトリ内のワークフローファイルを参照する場合：`./.github/workflows/{filename}`
  - 他のリポジトリ内のワークフローファイルを参照する場合：`{owner}/{repo}/.github/workflows/{filename}@{ref}`
- 再利用可能なワークフローにパラメータを渡すには、`on.workflow_call.inputs` キーを使用する。呼び出し元のワークフローで `with` キーを使用してパラメータを渡す
- 再利用可能なワークフローにシークレットを渡すには、`on.workflow_call.secrets` キーを使用する。呼び出し元のワークフローで `secrets` キーを使用して明示的にシークレットを渡すか、`inherit` キーワードを使用して暗黙的にすべてのシークレットを渡す
- 再利用可能なワークフローで出力を返すには、`on.workflow_call.outputs` キーを使用する。出力された値は呼び出し元のワークフローで `${{ needs.{job_id}.outputs.{key} }}` の形式で参照する

## 参考

- [ワークフローの再利用 - GitHub Docs](https://docs.github.com/ja/actions/sharing-automations/reusing-workflows)
- [GitHub Actions　のワークフロー構文 - GitHub Enterprise Cloud Docs](https://docs.github.com/ja/enterprise-cloud@latest/actions/writing-workflows/workflow-syntax-for-github-actions)
