---
id: 5jHdComiCglVEkBkOeQANu
title: "モノレポで GitHub Actions の jest coverage report を動かす"
slug: "monorepo-github-actions-jest-coverage-report-action"
about: "jest coverage reportは GitHuba Actions のワークフローの1つで Jest で実行したテストのコードカバレッジをプルリクエスト上にコメントしてくれます。  この記事では yarn workspaces 使用して作成したモノレポ構築のレポジトリで jest coverage report を動かしてみます。"
createdAt: "2022-11-27T00:00+09:00"
updatedAt: "2022-11-27T00:00+09:00"
tags: ["GitHub Actions"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/56MNfpVr3IVjfC5j2vdoMJ/1df017aa704c67b06b1742f3595abbcc/hb-sun-3q5qSKpyXGQ-unsplash.jpg"
  title: "hb-sun-3q5qSKpyXGQ-unsplash"
selfAssessment: null
published: true
---
[jest coverage report](https://github.com/ArtiomTr/jest-coverage-report-action) は GitHuba Actions のワークフローの 1 つで Jest で実行したテストのコードカバレッジをプルリクエスト上にコメントしてくれます。

この記事では [yarn workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/) を使用して作成したモノレポ構築のレポジトリで jest coverage report を動かしてみます。

実際の構成は以下のレポジトリを参照してください。

https://github.com/azukiazusa1/monorepo-jest-actions-example

## .github/workflows の設定

モノレポのレポジトリに対するワークフローを記述したファイルは以下のとおりになります。

```yaml
name: Coverage Report
on:
  pull_request:
    branches: [main]
  workflow_dispatch:
jobs:
  # マトリックス戦略を使用するために、変更された packages を取得する
  generate_matrix:
    name: Get changed packages
    runs-on: ubuntu-latest
    outputs:
      names: ${{ steps.changed_packages.outputs.names }}
      paths: ${{ steps.changed_packages.outputs.paths }}
      empty: ${{ steps.changed_packages.outputs.empty }}
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Find changed packages
        id: changed_packages
        uses: alexshukel/get-changed-workspaces-action@v1.0.0
  coverage:
    name: Coverage report
    # このジョブを実行するためには generate_matrix が正常に完了している必要がある
    needs: [generate_matrix]
    if: ${{ !fromJson(needs.generate_matrix.outputs.empty) }}
    runs-on: ubuntu-latest
    strategy:
      matrix:
        # 変更された packages をマトリックス戦略に渡す
        path: ${{ fromJson(needs.generate_matrix.outputs.paths) }}
    steps:
      - uses: actions/checkout@v3

      - name: Use Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: yarn

      - name: Installing dependencies
        run: yarn install

      - uses: artiomtr/jest-coverage-report-action@v2
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          # モノレポのルートで install してるのでそれぞれのディレクトリではインストール不要
          skip-step: install
          # ワークフローを実行するディレクトリを指定する
          working-directory: ${{ matrix.path }}
          test-script: yarn test
          package-manager: yarn

```

各ステップごとに細かく見てきましょう。

## 変更されたファイルを検出する

`generate_matrix` ジョブでは GitHub Actions の[マトリックス戦略](https://docs.github.com/ja/actions/using-jobs/using-a-matrix-for-your-jobs) を使用するために必要なデータを取得します。マトリックス戦略を使用すると変数を用いて、変数の組み居合わせに基づいて複数のジョブを作成できます。

例えば、以下のようにモノレポのパッケージの一覧のパスを変数として宣言しておくことで、パッケージごとにジョブを実行できます。

```yaml
jobs:
  coverage:
    strategy:
      matrix:
        path:
          - ./packages/front
          - ./packages/server
 ```

しかし、上記のようにマトリックスの変数をハードコーディングしていると、新たにパッケージを追加したときに修正を忘れる可能性があります。なによりファイルが変更されているかどうかに関わらず、すべてのテストが実行されてしまいます。モノレポ構成のレポジトリで GitHub Actions を実行する場合、変更のないディレクトリに対する無駄な実行は避けたいところでしょう。

そこで、`generate_matrix` ジョブ変更されたモノレポのパッケージの一覧を取得して、その値を後続のジョブでマトリックスの変数として使用できるように準備を行います。

モノレポのパッケージが変更されたかどうか取得するために [Get changed workspaces action](https://github.com/AlexShukel/get-changed-workspaces-action) ワークフローを使用します。このワークフローは `workspaces@ の中で変更されたファイルを検出して以下のような JSON で `outputs` として出力してくれます。

```json
[{"name":"@monorepo/core","path":"packages/core"},{"name":"@monorepo/react","path":"packages/react"}]
```

`outputs` キーでは後続のジョブで使える値をマップ形式で定義しています。Get changed workspaces action ワークフローで出力された値を後続のジョブで使用できるようにしています。

```yaml
outputs:
  names: ${{ steps.changed_packages.outputs.names }}
  paths: ${{ steps.changed_packages.outputs.paths }}
  empty: ${{ steps.changed_packages.outputs.empty }}
```

## テストの実行

それでは前述のジョブで取得した値をもとにテストを実行してカバレッジを取得します。[neets](https://docs.github.com/ja/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idneeds) キーはこのジョブを実行する間に正常に完了するジョブを文字列または文字列の配列で指定します。今回の例では `coverage` ジョブが `generate_matrix` ジョブに依存していることを示しています。

```yaml
needs: [generate_matrix]
```

[if](https://docs.github.com/ja/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idif) キーは条件文を使って条件を満たした場合のみジョブが実行されるようにします。`needs.generate_matrix.outputs.empty` は前の `generate_matrix` ジョブから取得した値で `true` の場合には workspaces のパッケージの中で変更されたファイルが存在しないことを示しています。[fromJSON](https://docs.github.com/ja/actions/learn-github-actions/expressions#fromjson) は GitHub Actions で使用できる式であり、 JSON オブジェクトから値を取得します。 

```yaml
if: ${{ !fromJson(needs.generate_matrix.outputs.empty) }}
```

前のジョブで説明したとおり、マトリックス戦略で変更されたパッケージのみテストされるようにしています。

```yaml
strategy:
  matrix:
    # 変更された packages をマトリックス戦略に渡す
    path: ${{ fromJson(needs.generate_matrix.outputs.paths) }}
 ```

 jest coverage report はデフォルトの設定では `npm/yarn` によるパッケージのインストールまで実行してくれるのですが、モノレポ構成の場合には各ディレクトリでパッケージをインストールするのではなく、ルートディレクトリでパッケージをインストールするのが一般的です。そのため、個別のステップで `yarn install` を実行しています。

```yaml
- name: Installing dependencies
  run: yarn install
```

さらに、jest coverage report ワークフローを使用する際にもいくつかのオプションを設定しています。

```yaml
- uses: artiomtr/jest-coverage-report-action@v2
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    skip-step: install
    working-directory: ${{ matrix.path }}
    test-script: yarn test
    package-manager: yarn
```

ルートディレクトリで `yarn install` を実行しているので `skip-step: install` を指定してそれぞれのディレクトリではパッケージのインストールを実行しないようにしています。`working-directory` ではテストを実行するディレクトリを指定しています。この値はマトリックス戦略で定義した変数から取得するので `matrix.path` のように `matrix` コンテキストから取得しています。

## GitHub Actions の実行

これでワークフローの準備は整いました。実際にプルリクエストを作成してみると、変更の合ったファイルに対してのみカバレッジレポートが出力されていることがわかります。

![スクリーンショット 2022-11-27 18.13.44](//images.ctfassets.net/in6v9lxmm5c8/3MMR0nhhukR4fSrGR0mq3I/130a6dd77893a9d361f57324a46f9b41/____________________________2022-11-27_18.13.44.png)

https://github.com/azukiazusa1/monorepo-jest-actions-example/pull/1

![スクリーンショット 2022-11-27 18.15.48](//images.ctfassets.net/in6v9lxmm5c8/4lAgKcZDpwz5NUbhZ2sTsW/e79b01782741e4af76ba4ad132146f4b/____________________________2022-11-27_18.15.48.png)

https://github.com/azukiazusa1/monorepo-jest-actions-example/pull/2

## 参考

[Monorepo or yarnWorkspaces support? #260](https://github.com/ArtiomTr/jest-coverage-report-action/discussions/260)
