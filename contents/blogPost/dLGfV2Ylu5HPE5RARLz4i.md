---
id: dLGfV2Ylu5HPE5RARLz4i
title: "@axe-core/playwright によるアクセシビリティテストの自動化"
slug: "axe-core-playwright"
about: "axe-core は axe というアクセシビリティテストツールのコアエンジンで、オープンソースとして提供されています。この記事では、E2E テストフレームワークの Playwright と axe-core を組み合わせて使用して、アクセシビリティテストを自動化する方法について紹介します。"
createdAt: "2024-08-18T12:53+09:00"
updatedAt: "2024-08-18T12:53+09:00"
tags: ["アクセシビリティ", "Playwright", "axe-core"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3pfSP2fqMVe8dBFrSr6nb3/61460327030e9f0431049f4794cfa43c/pudding_illust_3656.png"
  title: "プリンのイラスト"
selfAssessment:
  quizzes:
    - question: "特定のルールにおる違反を無視してアクセシビリティテストを実行するためのメソッドはどれか？"
      answers:
        - text: "AxeBuilder.ignore()"
          correct: false
          explanation: ""
        - text: "AxeBuilder.exclude()"
          correct: false
          explanation: "exclude() メソッドは特定の要素を除外するためのメソッドです。"
        - text: "AxeBuilder.disableRules()"
          correct: true
          explanation: ""
        - text: "AxeBuilder.ignoreRules()"
          correct: false
          explanation: ""

published: true
---

今書いているコードがアクセシビリティ上の問題を持っていないかどうかを確認するために、Lint ツールによる機械チェックが有効です。[eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y) や [Markuplint](https://markuplint.dev/ja/) といったツールを導入することで、コンポーネント単位で静的にコードを解析してアクセシビリティの問題を検出できます。このような Lint ツールは、codeを書いている最中に即座にフィードバックを受けることができる点が大きなメリットです。

しかし、静的なコードの解析では検出できない問題もいくつか存在します。例えば、コントラスト比の低い色の組み合わせはコード上からは検出できず、実際にブラウザで表示してみないと気づくことができません。また、コンポーネント単位では問題はないものの、複数のコンポーネントを組み合わせて画面全体を見たときに問題が発生することもあります。コンポーネント内では一意であった id が、画面全体を見たときに重複していたり、見出しのレベルがスキップされていたりする場合などです。

このように、コードの静的な解析だけでは検出できない問題を発見するためには、実際にブラウザで表示して動作を確認することが必要です。個の記事では [@axe-core/playwright](https://www.npmjs.com/package/@axe-core/playwright) を使ってブラウザでのテストを自動化する方法について紹介します。

[axe-core](https://github.com/dequelabs/axe-core) は [axe](https://www.deque.com/axe/) というアクセシビリティテストツールのコアエンジンで、オープンソースとして提供されています。axe-core は様々なテストツールと連携することにより、ウェブサイトのアクセシビリティを自動的にテストすることができます。この記事では、E2E テストフレームワークの [Playwright](https://playwright.dev/) と axe-core を組み合わせて使用します。

## Playwright のセットアップ

始めに Playwright をインストールしてテストを実行するための環境をセットアップします。以下のコマンドを実行します。

```bash
npm init playwright@latest
```

`playwright.config.(js|ts)` というファイルが生成されます。これは Playwright の設定ファイルです。このファイルにはテストを実行するためのコマンドや、テスト対象のブラウザの設定などが記述されています。参考に私のプロジェクトで設定したファイルを以下に示します。自分のプロジェクトに合わせて設定を変更してください。

```js
import { PlaywrightTestConfig, devices } from '@playwright/test'

const config: PlaywrightTestConfig = {
  // テストファイルのディレクトリ
  testDir: 'tests',
  // すべてのファイルのすべてのテストを同時に実行する
  fullyParallel: true,
  // テスト対象の開発サーバーの設定
  webServer: {
    // 開発サーバーを起動するコマンド
    command: 'npm run serve',
    port: 3000,
    reuseExistingServer: true,
  },
  expect: {
    timeout: 15000,
  },
  // テスト対象のブラウザの設定
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
}

export default config
```

設定が完了したら、`tests/example.spec.ts` ファイルを編集して簡単なテストを書いてみましょう。

```ts
import { test, expect } from "@playwright/test";

test("basic test", async ({ page }) => {
  // テスト対象のページにアクセス
  await page.goto("http://localhost:3000");

  // ページの　 h1 要素を取得
  const title = page.getByRole("heading", { level: 1 });
  // h1 要素が存在することを確認
  expect(title).not.toBeNull();
});
```

このテストでは、`http://localhost:3000` にアクセスして h1 要素が存在することを確認しています。テストを実行するには以下のコマンドを実行します。

```bash
npx playwright test
```

テストが正常に実行されると、以下のような結果が表示されます。

```
$ npx playwright test

Running 1 test using 1 worker

  ✓  1 [chromium] › example.spec.ts:6:1 › basic test (637ms)

  1 passed (2.2s)
```

## axe-core を使ったアクセシビリティテスト

それでは `@axe-core/playwright` を使ってアクセシビリティテストを自動化してみましょう。まずは `@axe-core/playwright` をインストールします。

```bash
npm install -D @axe-core/playwright
```

次に、`tests/example.spec.ts` ファイルを以下のように編集します。

```ts
import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";

test("accessibility test", async ({ page }) => {
  await page.goto("http://localhost:3000");

  // axe-core を使ってアクセシビリティテストを実行
  const results = await AxeBuilder({ page }).analyze();

  // アクセシビリティテストの結果を出力
  results.violations.forEach((violation) => {
    console.log(violation);
  });

  // アクセシビリティテストの結果がエラーがないことを確認
  expect(results.violations.length).toBe(0);
});
```

`AxeBuilder` に Playwright の `page` オブジェクトを渡して `analyze` メソッドを実行することで、ページ内のアクセシビリティテストを実行します。問題が検出された場合には、`results.violations` にエラーの詳細が格納されます。この例では、エラーが検出されないことを確認するために、`results.violations.length` が `0` であることをアサーションしています。

実際に私のプロジェクトでテストを実行してみると、以下のような結果が表示されました。

```js
{
  id: 'color-contrast',
  impact: 'serious',
  tags: [
    'cat.color',
    'wcag2aa',
    'wcag143',
    'TTv5',
    'TT13.c',
    'EN-301-549',
    'EN-9.1.4.3',
    'ACT'
  ],
  description: 'Ensures the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds',
  help: 'Elements must meet minimum color contrast ratio thresholds',
  helpUrl: 'https://dequeuniversity.com/rules/axe/4.9/color-contrast?application=playwright',
  nodes: [
    {
      any: [Array],
      all: [],
      none: [],
      impact: 'serious',
      html: '<text>Note</text>',
      target: [Array],
      failureSummary: 'Fix any of the following:\n' +
        '  Element has insufficient color contrast of 2.33 (foreground color: #60a5fa, background color: #eff6ff, font size: 13.5pt (18px), font weight: bold). Expected contrast ratio of 4.5:1'
    },
  ]
}
```

`id: 'color-contrast'` から、コンストラクト比の問題が検出されたことがわかります。

`tags` はどのルールに基づいて問題が検出されたかを示しています。タグがどのルールに対応しているかは [Axe API Documentation | Deque Systems](https://www.deque.com/axe/core-documentation/api-documentation/) を参照してください。例えば `wcag2aa` は WCAG 2.0 AA に準拠しているかどうかを示しています。

さらに詳細な情報を確認するためには、`helpUrl` にアクセスしてください。`nodes` プロパティを見ると、問題が発生している要素の情報が表示されています。この情報を元に問題を修正していきます。

## 特定のルールタグ付けされたルールのみを実行する

axe はデフォルトでは非常に多くのルールに基づいてアクセシビリティテストを実行します。多くのルールで問題を検出できればより堅牢なアプリケーションを作ることはできるものの、その対応に多くの労力が必要になります。

デフォルトで用意されているルールにの中には WCAG で要求されていないいわゆる「ベストプラクティス」なルールも含まれています。特定の WCAG レベルに対応するルールのみを実行するためには、`AxeBuilder.withTags()` メソッドを使って特定のタグを持つルールのみを実行するように設定します。

以下の例では、WCAG A および AA 成功基準の違反をテストする axe ルールのみが含まれます。サポートされるすべてのタグの一覧は [Axe API Documentation | Deque Systems](https://www.deque.com/axe/core-documentation/api-documentation/#axe-core-tags) を参照してください。

```ts
import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";

test("accessibility test", async ({ page }) => {
  await page.goto("http://localhost:3000");

  // WCAG 2.1 AA に対応するルールのみを実行
  const results = await AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  expect(results.violations.length).toBe(0);
});
```

## 特定のルールによる違反を無視する

すでに既知の問題がある場合には、テストを実行する際に抑制したい場合があります。ルールの違反を無視する場合には、以下の 2 つの方法があります。

- 特定の要素を除外する
- 特定のルールを無視する

例として、フォーム要素には必ず label を指定するという「Form elements must have labels」ルールに違反している場合を考えます。

```js
path:  /blog/markdown-test
{
  id: 'label',
  impact: 'critical',
  tags: [
    'cat.forms',
    'wcag2a',
    'wcag412',
    'section508',
    'section508.22.n',
    'TTv5',
    'TT5.c',
    'EN-301-549',
    'EN-9.4.1.2',
    'ACT'
  ],
  description: 'Ensures every form element has a label',
  help: 'Form elements must have labels',
  helpUrl: 'https://dequeuniversity.com/rules/axe/4.9/label?application=playwright',
  nodes: [
    {
      any: [Array],
      all: [],
      none: [],
      impact: 'critical',
      html: '<input type="checkbox" disabled="">',
      target: [Array],
      failureSummary: 'Fix any of the following:\n' +
        '  Form element does not have an implicit (wrapped) <label>\n' +
        '  Form element does not have an explicit <label>\n' +
        '  aria-label attribute does not exist or is empty\n' +
        '  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty\n' +
        '  Element has no title attribute\n' +
        '  Element has no placeholder attribute\n' +
        `  Element's default semantics were not overridden with role="none" or role="presentation"`
    },
  ]
}
```

この例ではチェックボックス要素に label が指定されていない問題が検出されているのですが、このチェックボックスはマークダウンを変換するライブラリにより生成されたものであるため、すぐに修正を行うのが難しいのです。まずは特定の要素を除外する方法を試してみましょう。

```ts {9}
import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";

test("accessibility test", async ({ page }) => {
  await page.goto("http://localhost:3000");

  const results = await AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .exclude("input[type='checkbox']")
    .analyze();

  expect(filteredResults.length).toBe(0);
});
```

`AxeBuilder` の `exclude` メソッドに CSS セレクタを渡すことで、特定の要素をテスト対象から除外しています。この方法は確かにうまくいきますが、いくつかの欠点が存在します。

- 指定した要素の子孫要素も除外されてしまう
- 既知の問題に対応するルールだけではなく、すべてのルールによる問題も検出されなくなってしまう

2 つ目の方法である特定のルールを無視する方法を試してみましょう。`disableRules` メソッドに無視したいルールの ID を渡すことで、特定のルールによる違反を無視することができます。

```ts {9}
import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";

test("accessibility test", async ({ page }) => {
  await page.goto("http://localhost:3000");

  const results = await AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .disableRules(["label"])
    .analyze();

  expect(filteredResults.length).toBe(0);
});
```

## HTML レポートを出力する

`results.violations` オブジェクトをコンソールに出力することで問題を確認できますが、結果が多い場合には見づらくなってしまいます。`axe-html-reporter` パッケージを使うことで、HTML 形式で見やすいレポートを出力できます。まずは `axe-html-reporter` をインストールします。

```bash
npm install -D axe-html-reporter
```

`createHtmlReport` メソッドを使って HTML レポートを生成します。

```ts
import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { createHtmlReport } from "axe-html-reporter";
import fs from "fs";

test("accessibility test", async ({ page }) => {
  await page.goto("http://localhost:3000");

  const results = await AxeBuilder({ page }).analyze();

  if (results.violations.length > 0) {
    createHtmlReport({ results });
  }

  expect(results.violations.length).toBe(0);
});
```

デフォルトでは `artifacts/accessibilityReport.html` にレポートが出力されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/8YT6v1unQcInvL1ZGVpCb/11985296906933c1dc4018a992ac9201/__________2024-08-18_15.09.37.png)

## まとめ

- `@axe-core/playwright` は Playwright と axe-core を組み合わせてアクセシビリティテストを自動化するためのパッケージ
- `AxeBuilder.analyze()` メソッドを使ってアクセシビリティテストを実行する
- 問題が検出された場合には `results.violations` にエラーの詳細が格納される
- `AxeBuilder.withTags()` メソッドを使って特定のルールのみを実行する
- `AxeBuilder.exclude()` メソッドを使って特定の要素を除外する
- `AxeBuilder.disableRules()` メソッドを使って特定のルールによる違反を無視する
- `axe-html-reporter` パッケージを使って HTML レポートを出力する

## 参考

- [Accessibility testing | Playwright](https://playwright.dev/docs/accessibility-testing)
- [axe-core/playwrightとmarkuplintを導入しアクセシビリティの自動テストをできるようにした | Hirotaka Miyagi](https://mh4gf.dev/articles/axe-core-playwright-and-markuplint)
