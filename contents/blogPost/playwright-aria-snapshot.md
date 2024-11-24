---
id: LurcOV_rls4fFxH5l0GQo
title: "アクセシビリティツリーを比較する Playwright の Aria snapshots がよさそう"
slug: "playwright-aria-snapshot"
about: "Playwright の Aria snapshots はアクセシビリティツリーを比較することでテストする手法です。アクセシビリティツリーは DOM のスナップショットテストと比較して、外部から見た振る舞いが変わりづらいという利点があります。`.toMatchAriaSnapshot()` メソッドを使ってアクセシビリティツリーのスナップショットテストを行うことができます。"
createdAt: "2024-11-24T09:23+09:00"
updatedAt: "2024-11-24T09:23+09:00"
tags: ["playwright"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/tiNLsC5W4FyTSVop1ipSt/d952f01bf57e9d08592540dd08aa4049/toudai_sea_9886-768x630.png"
  title: "灯台と海の風景のイラスト"
selfAssessment:
  quizzes:
    - question: "Playwright でアクセシビリティツリーのスナップショットテストを行うメソッドは次のうちどれか？"
      answers:
        - text: "toMatchAriaSnapshot"
          correct: true
          explanation: null
        - text: "toMatchSnapshot"
          correct: false
          explanation: null
        - text: "toMatchAccessibilitySnapshot"
          correct: false
          explanation: null
        - text: "toMatchA11ySnapshot"
          correct: false
          explanation: null
published: true
---
ソフトウェアテストの手法の 1 つに、スナップショットテストがあります。スナップショットテストは、テスト対象の出力を保存しておき、次回のテスト時に保存した出力と比較することで、テストが通ったかどうかを判断する手法です。フロントエンドのテストでは、特に UI のテストにおいてスナップショットテストがよく使われます。

コンポーネントのレンダリング結果の DOM 構造を保存しておき、次回のテスト時に保存した DOM 構造と比較することで、コンポーネントのレンダリング結果が変わっていないかを確認できます。このように、スナップショットテストは予期せぬ変更を検知するのに役立ちます。

## DOM のスナップショットの課題

一方で DOM の構造を比較するテストはリファクタリングに対する耐性が低くなるという欠点があります。リファクタリングを行う際には前後で外から見た振る舞いが変わらないことを確認するために、自動化されたテストが必要です。しかし、DOM の構造を比較するテストは内部の構造のみを変化させた場合でも、リファクタリングの度にテストを修正する必要があります。

具体的な例を見てみましょう。例えば、以下のコンポーネントでクラス名を修正するリファクタリングを行ったとしましょう。CSS ファイルの変更も同時に行われていれば、外部から見た振る舞いは変わらないはずです。

```diff:Button.tsx
export const Button = ({ children }) => {
- return <button className="btn">{children}</button>
+ return <button className="button">{children}</button>
}
```

しかし、スナップショットテストではクラス名の変更によりテストが失敗することになります。このように、スナップショットテストは外部から見た振る舞いが変わらないことを確認するのには向いていません。コンポーネントの内部実装に変更を加えるたびにスナップショットの更新が求められるため、そのうちにスナップショットテストの結果が軽んじられてしまうことがあります。

## Playwright の Aria snapshots

Playwright の Aria snapshots はコンポーネントのスナップショットを DOM の構造ではなく、アクセシビリティツリーを比較することでテストする手法です。アクセシビリティツリーとは DOM ツリーに含まれれるマークアップの要素、属性、テキストノードなどの情報を元に生成される情報で以下のような情報を含みます。

- name: 要素の名前
- description: 要素の説明
- role: 要素の役割。ボタン・リンク・ナビゲーションなど
- state: 要素の状態。フォーカスされているか、チェックボックスがチェックされているかなど

このアクセシビリティツリーはスクリーンリーダーといった支援技術によって利用されます。Chrome の検証ツールでアクセシビリティタブを開き、「アクセシビリティツリーの全ページ表示を有効にする」にチェックをいれると、ページ全体のアクセシビリティツリーを確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3Tk2dfE6MoyPhb3KO3y3rU/221bda948e27022e618b3436871fca35/__________2024-11-24_10.52.31.png)

Playwright の Aria snapshots では、アクセシビリティツリーを YAML 形式として保存し、次回のテスト時に保存したアクセシビリティツリーと比較します。アクセシビリティツリーは DOM の内部的な構造が変化したとしても、外部から見た振る舞いが変わりづらいという利点があります。例えば、以下の 2 つの要素は DOM の構造が異なっていても、アクセシビリティツリーでは同じ要素であると判断できます。

```html
<div role="navigation">
  <a href="/home">Home</a>
  <a href="/about">About</a>
</div>

<!-- nav 要素は暗黙のロールとして navigation を持つ -->
<!-- role 属性を使用するよりも、暗黙のロールを持つ要素があればそれを使用することが推奨されている -->
<nav>
  <a href="/home">Home</a>
  <a href="/about">About</a>
</nav>
```

Aria snapshots を利用することで、外部からページ構造が一貫しているか確認できることが期待できます。

## Aria snapshots の使い方

それでは実際に Playwright の Aria snapshots を使ってみましょう。アクセシビリティツリーのスナップショットテストを実行する `toMatchAriaSnapshot` メソッドは v1.49 から利用可能です。

今回は React コンポーネントテストとして Playwright を使用するため、以下のコマンドで Playwright をインストールします。

```bash
npm init playwright@latest -- --ct
```

テスト対象のコンポーネントとして、以下のようなコンポーネントを用意します。

```tsx:Layout.tsx
import React from "react";

export const Layout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div>
      <header>
        <h1>My-App</h1>
        <nav>
          <a href="/home">Home</a>
          <a href="/about">About</a>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <p>&copy; 2024 My-App</p>
      </footer>
    </div>
  );
};
```

テストファイルとして `Layout.test.ts` を作成し、以下のようにテストを記述します。

```ts:Layout.test.ts
import { test, expect } from "@playwright/experimental-ct-react";
import { Layout } from "./Layout";

test("アクセシビリティツリーをチェックする", async ({ mount }) => {
  const page = await mount(<Layout>Hello</Layout>);
  await expect(page).toMatchAriaSnapshot("");
});
```

test メソッドのコールバック関数の引数では現在の playwright の設定を受け取ります。この引数には mount メソッドが含まれているので、これを使用してテスト対象のコンポーネントをマウントします。mount メソッドは [Locator](https://playwright.dev/docs/locators) オブジェクトを返すので、これを使ってアクセシビリティツリーのスナップショットテストを行います。

`toMatchAriaSnapshot()` メソッドの引数は期待するスナップショットの結果を渡します。ここに空文字列を渡すと即座に新しいスナップショットを作成します。テストを実行するには以下のコマンドを実行します。

```bash
npm run test-ct
```

テストが成功すると、`test-results/rebaselines.patch` ファイルが作成されます。

```diff:test-results/rebaselines.patch
diff --git a/src/Layout.test.tsx b/src/Layout.test.tsx
--- a/src/Layout.test.tsx
+++ b/src/Layout.test.tsx
@@ -3,5 +3,14 @@

 test("アクセシビリティツリーをチェックする", async ({ mount }) => {
   const page = await mount(<Layout>Hello</Layout>);
-  await expect(page).toMatchAriaSnapshot("");
+  await expect(page).toMatchAriaSnapshot(`
+    - banner:
+      - heading "My-App" [level=1]
+      - navigation:
+        - link "Home"
+        - link "About"
+    - main: Hello
+    - contentinfo:
+      - paragraph: /© \\d+ My-App/
+  `);
 });
```

`git apply` コマンドを使ってこのパッチファイルを適用することで、スナップショットを更新できます。

```bash
git apply test-results/rebaselines.patch
```

```ts:Layout.test.ts
import { test, expect } from "@playwright/experimental-ct-react";
import { Layout } from "./Layout";

test("アクセシビリティツリーをチェックする", async ({ mount }) => {
  const page = await mount(<Layout>Hello</Layout>);
  await expect(page).toMatchAriaSnapshot(`
    - banner:
      - heading "My-App" [level=1]
      - navigation:
        - link "Home"
        - link "About"
    - main: Hello
    - contentinfo:
      - paragraph: /© \\d+ My-App/
  `);
});
```

スナップショットの変更が正しく検知されるかどうか確認するために、あえてテストが失敗するようにコンポーネントを修正してみましょう。`main` 要素を `div` 要素に変更してみます。`<main>` 要素は暗黙のロール `main` を持っているのですが、`<div>` 要素は暗黙のロールを持っていないため、スナップショットテストが失敗するはずです。

```diff:Layout.tsx
export const Layout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div>
      <header>
        <h1>My-App</h1>
        <nav>
          <a href="/home">Home</a>
          <a href="/about">About</a>
        </nav>
      </header>
-      <main>{children}</main>
+      <div>{children}</div>
      <footer>
        <p>&copy; 2024 My-App</p>
      </footer>
    </div>
  );
};
```

それではテストを実行してみましょう。Praywright はスナップショットを取得する際にページが安定することを確認するため、オプションで指定された timeout が経過するまで待機します。

```bash
npm run test-ct
```

テストが失敗し、以下のようなエラーメッセージが表示されるはずです。

```diff
  1) [chromium] › src/Layout.test.tsx:4:1 › アクセシビリティツリーをチェックする ─────────────────────────────────────

    Error: Timed out 5000ms waiting for expect(locator).toMatchAriaSnapshot(expected)

    Locator: locator('#root').locator('internal:control=component')
    - Expected  - 2
    + Received  + 2

      - banner:
        - heading "My-App" [level=1]
        - navigation:
          - link "Home"
          - link "About"
    - - main: Hello
    + - text: Hello
      - contentinfo:
    -   - paragraph: /© \d+ My-App/
    +   - paragraph: © 2024 My-App
```

後からスナップショットを更新する場合には、`--update-snapshots` オプションを使ってスナップショットを更新できます。

```bash
npm run test-ct -- --update-snapshots
```

### 部分的な比較

`.toMatchAriaSnapshot()` メソッドに渡すスナップショットは完全なアクセシビリティツリーである必要はありません。例えば、先程のコンポーネントの例では、要素が持つ name を省いてチェックすることもできます。

```ts:Layout.test.ts
import { test, expect } from "@playwright/experimental-ct-react";
import { Layout } from "./Layout";

test("アクセシビリティツリーをチェックする", async ({ mount }) => {
  const page = await mount(<Layout>Hello</Layout>);
  await expect(page).toMatchAriaSnapshot(`
    - banner:
      - navigation:
        - link
        - link
    - main
    - contentinfo
  `);
});
```

部分的なアクセシビリティツリーの比較は変更されやすい部分を除外し、重要な構造に焦点を当ててテストするのに役立ちます。

正規表現を使ってテキストを比較することもできます。

```ts:Layout.test.ts
import { test, expect } from "@playwright/experimental-ct-react";
import { Layout } from "./Layout";

test("アクセシビリティツリーをチェックする", async ({ mount }) => {
  const page = await mount(<Layout>Hello</Layout>);
  await expect(page).toMatchAriaSnapshot(`
    - contentinfo :
      - paragraph: /© \\d+ My-App/
  `);
});
```

## まとめ

- DOM の構造を比較するスナップショットテストはリファクタリングに対する耐性が低いという欠点がある
- Playwright の Aria snapshots はアクセシビリティツリーを比較することでテストする手法
- アクセシビリティツリーは外部から見た振る舞いが変わりづらいという利点がある
- `.toMatchAriaSnapshot()` メソッドを使ってアクセシビリティツリーのスナップショットテストを行うことができる
- `.toMatchAriaSnapshot()` の引数に空文字列を渡すと即座に新しいスナップショットを作成する
- 新しく作成されたスナップショットは `git apply` コマンドを使って適用できる
- 部分的なアクセシビリティツリーの比較や正規表現を使ったテキストの比較も可能

## 参考

- [Aria snapshots | Playwright](https://playwright.dev/docs/aria-snapshots)
- [Accessibility tree (アクセシビリティツリー) - MDN Web Docs 用語集: ウェブ関連用語の定義 | MDN](https://developer.mozilla.org/ja/docs/Glossary/Accessibility_tree)
