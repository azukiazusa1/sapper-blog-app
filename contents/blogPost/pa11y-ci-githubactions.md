---
id: 79f3mj1zk0bKneHYXScGQD
title: "Pa11y CI でアクセシビリティテストを GitHub Actions で実行する"
slug: "pa11y-ci-githubactions"
about: "Pa11y とは Web Content Accessibility Guidelines (WCAG) をベースに HTML のアクセシビリティを検査するツールです。適合レベル AA を対象にテストします。Pa11y にはいくつかの種類がありますが、その中でも Pa11y CI は CI 上で実行することにフォーカスしています。"
createdAt: "2022-12-04T00:00+09:00"
updatedAt: "2022-12-04T00:00+09:00"
tags: ["GitHub Actions", "アクセシビリティ"]
published: true
---
[Pa11y](https://pa11y.org/) とは [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG2AA-Conformance) をベースに HTML のアクセシビリティを検査するツールです。適合レベル AA を対象にテストします。Pa11y にはいくつかの種類がありますが、その中でも [Pa11y CI](https://github.com/pa11y/pa11y-ci) は CI 上で実行することにフォーカスしています。

## 基本的な使い方

まずは `Pa11y` をインストールして使ってみましょう。前提条件として Node.js v12 以降が必要です。

```sh
npm install -g pa11y-ci
```

インストールが完了したら `pa11y-ci` コマンドが使えるようになります。アクセシビリティテストを実行したい URL を引数にコマンドを実行します。

```sh
pa11y-ci https://pa11y.org/
Running Pa11y on 1 URLs:
 > https://pa11y.org/ - 0 errors

✔ 1/1 URLs passed
```

アクセシビリティ上問題がある箇所が発見された場合、以下のようなエラーが報告されます。

```sh
pa11y-ci http://localhost:3000/blog/markdown-test
Running Pa11y on 1 URLs:
 > http://localhost:3000/blog/markdown-test - 27 errors

Errors in http://localhost:3000/blog/markdown-test:

 • This checkboxinput element does not have a name available to an accessibility API. Valid names are: label element, title
   undefined, aria-label undefined, aria-labelledby undefined.

   (#contents > ul:nth-child(39) > li:nth-child(1) > input)

   <input type="checkbox" disabled="">

✘ 0/1 URLs passed
```

## 設定ファイルを利用する

デフォルトでは `pa11y-ci` を実行する際に現在の作業ディレクトリに `.pa11yci` または `.pa11yci.json` ファイルが存在する場合そのファイルの設定が使用されます。設定ファイルは `JSON` 形式で記載します。例えば、以下のようにテストしたい URL を配列で指定できます。

```json:.pa11yci.json
{
  "urls": [
    "http://localhost:3000",
    "http://localhost:3000/blog",
    "http://localhost:3000/about",
    "http://localhost:3000/tags",
    "http://localhost:3000/blog/markdown-test"
  ]
}
```

すべての設定は以下から確認できます。

https://github.com/pa11y/pa11y#configuration

## 特定のルールを無視する

`pa11y-ci` を実行する際に特定のエラーの報告を無視したいこともあるでしょう。例えば、`http://localhost:3000/blog/markdown-test` という URL はマークダウンを HTML に変換してレンダリングしているので、ひとまずエラーが報告されても無視したいとします。

`urls` の配列の要素を文字列ではなくオブジェクトで指定すると、特定の URL に対してのみオプションを設定できます。特定のルールを無視するためには `ignore` の配列でルールのコードを指定します。

```json
{
  "urls": [
    "http://localhost:3000",
    "http://localhost:3000/blog",
    "http://localhost:3000/about",
    "http://localhost:3000/tags",
    {
      "url": "http://localhost:3000/blog/markdown-test",
      "ignore": [
        "WCAG2AA.Principle2.Guideline2_4.2_4_1.H64.1",
        "WCAG2AA.Principle4.Guideline4_1.4_1_2.H91.InputCheckbox.Name",
        "WCAG2AA.Principle1.Guideline1_3.1_3_1.F68",
        "WCAG2AA.Principle1.Guideline1_3.1_3_1.H49.AlignAttr",
        "WCAG2AA.Principle4.Guideline4_1.4_1_2.H91.A.EmptyNoId"
      ]
    }
  ]
}
```

ところで、`ignore` に指定するルールは https://squizlabs.github.io/HTML_CodeSniffer/Standards/WCAG2/ から探して指定するのですが、ターミナルの出力に対応するエラーをここから探すのは一苦労です。この場合には結果をターミナルに出力するのではなく、JSON 形式で出力すると細かい結果まで出力してくれます。

```sh
pa11y-ci --json > pa11y-ci-results.json
```

以下のように `code` と共にエラーを出力してくれます。

```json
{
  "total": 5,
  "passes": 4,
  "errors": 27,
  "results": {
    "http://localhost:3000/": [],
    "http://localhost:3000/blog": [],
    "http://localhost:3000/about": [],
    "http://localhost:3000/tags": [],
    "http://localhost:3000/blog/markdown-test": [
      {
        "code": "WCAG2AA.Principle4.Guideline4_1.4_1_2.H91.InputCheckbox.Name",
        "type": "error",
        "typeCode": 1,
        "message": "This checkboxinput element does not have a name available to an accessibility API. Valid names are: label element, title undefined, aria-label undefined, aria-labelledby undefined.",
        "context": "<input type=\"checkbox\" disabled=\"\">",
        "selector": "#contents > ul:nth-child(39) > li:nth-child(1) > input",
        "runner": "htmlcs",
        "runnerExtras": {}
      }
    ]
  }
}
```

## テストの実行前にブラウザ操作を実行する

`pa11y` によるテストを実行する前にブラウザの操作を実行したい場合があるでしょう。例えば、ボタンをクリックしてダイアログを表示してからテストを実行するなどが考えられます。ブラウザ操作を実行する場合には `actios` の配列で指定します。`click`,`input` などのイベントを実行したり、`wait for` で特定の要素が出現するまで待機できます。要素を指定するためにのセレクタは [document.querySelector](https://developer.mozilla.org/ja/docs/Web/API/Document/querySelector) で使用できるものと同等です。

下記の例ではダークモードに切り替えるボタンをクリックし、外見がダークモードに切り替えるのを待機してからアクセシビリティテストを実行しています。

```json
{
  "urls": [
    "http://localhost:3000",
    {
      "url": "http://localhost:3000/",
      "actions": [
        "click button[aria-label='ダークモードに切り替える']",
        "wait for button[aria-label='ライトモードに切り替える'] to be visible"
      ]
    },
  ]
}
```

その他実行可能な `actions` は以下から確認できます。

https://github.com/pa11y/pa11y#actions

## GitHub Actions で実行する

ローカルで `pa11y-ci` の実行が確認できたので、それでは実際に CI 上で実行してみましょう。ここではコードを変更したときにアクセシビリティに違反していないかどうか PR で確認できるように GitHub Actions で実行する例を考えてみます。

ビルド → ローカルで起動 → `pa11y-ci` の流れで実行しています。`npm run build` と `npm run preview` コマンドは各自のビルド、ローカル起動コマンドに置き換えてください。ローカルで起動が完了する前に `pa11y-ci` コマンドが実行されてしまうと失敗してしまうので、念の為 `sleep 3` で 3s 待機してから実行しています。

```yaml
name: CI
on:
  pull_request:

jobs:
  a11y:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: npm
      - name: Install dependencies
        run: npm ci && npm install -g pa11y-ci
      - name: Build
        run: npm run build
      - name: pa11y-ci
        run: npm run preview & sleep 3; pa11y-ci
```

## 参考

- [Pa11y CI でアクセシビリティテストを自動化し日本語のレポートを HTML 形式で生成する](https://hyper-text.org/archives/2019/12/auto_accessibility_testing_pa11y_ci.shtml)
