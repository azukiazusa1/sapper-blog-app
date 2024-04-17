---
id: afaeQaUqVI8SPvYQW-SMq
title: "単体テストでスクリーンリーダーをシミュレートする Virtual Screen Reader"
slug: "unit-test-visual-screen-reader"
about: "Virtual Screen Reader は単体テストのためにスクリーンリーダをシミュレートするライブラリです。このライブラリを使うことでマウスやキボードの操作をテストするように、スクリーンリーダーにより期待する読み上げが行われるかどうかをテストできます。なお、Virtual Screen Reader はあくまでスクリーンリーダーの挙動を模倣したものであり、現実で使われているスクリーンリーダーによるテストを代替するものではないことに注意してください。"
createdAt: "2024-03-16T13:20+09:00"
updatedAt: "2024-03-16T13:20+09:00"
tags: ["テスト", "アクセシビリティ", "Jest"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/dHFPUP6FQS45HG2BkEWxP/5642c156a87dcc33bc94772896483c57/lamb-chops_9767-768x591.png"
  title: "ラムチョップのイラスト"
selfAssessment: null
published: true
---
Virtual Screen Reader は単体テストのためにスクリーンリーダをシミュレートするライブラリです。このライブラリを使うことでマウスやキーボードの操作をテストするように、スクリーンリーダーにより期待する読み上げが行われるかどうかをテストできます。

https://github.com/guidepup/virtual-screen-reader

Virtual Screen Reader は React, Vue.js, Angular などの UI フレームワークを問わず動作するように設計されています。同様に、Jest, Vitest, Storybook などテストフレームワークを問わず利用できます。

## Virtual Screen Reader の仕様

現在、スクリーンリーダーが従うべき明確な仕様は存在しません。ですが、スクリーンリーダーに期待する振る舞いを定めた要件がいくつかの仕様によって定義されています。Virtual Screen Reader はできる限りこれらの仕様に従うように設計されています。

- [Accessible Rich Internet Applications (WAI-ARIA) 1.2](https://www.w3.org/TR/wai-aria-1.2/)
- [Accessible Name and Description Computation (ACCNAME) 1.2](https://www.w3.org/TR/accname-1.2/)
- [ARIA in HTML (HTML-ARIA)](https://www.w3.org/TR/html-aria/)
- [Core Accessibility API Mappings (CORE-AAM) 1.2](https://arc.net/l/quote/rtxzbgea)
- [HTML Accessibility API Mappings (HTML-AAM) 1.0](https://arc.net/l/quote/ympjioyx)

上記の仕様から抽出された要件は [docs/requirements.md](https://github.com/guidepup/virtual-screen-reader/blob/main/docs/requirements.md) にまとめられています。

W3C の仕様の他に、以下のガイドが正式なテストケースが存在しない場合に使われています。

- [web-platform-tests dashboard](https://wpt.fyi/results/?label=master&label=experimental&aligned&view=interop&q=label%3Aaccessibility)
- [Accessibility Support](https://a11ysupport.io/)

将来には [ARIA and Assistive Technologies (ARIA-AT) community group](https://github.com/w3c/aria-at) によって作成されたテストケースに準拠することが予定されています。

なお、Virtual Screen Reader はあくまでスクリーンリーダーの挙動を模倣したものであり、現実で使われているスクリーンリーダーによるテストを代替するものではないことに注意してください。Virtual Screen Reader で読み上げられる内容は、実際に国内でよく使われている [PC-Talker](https://www.aok-net.com/screenreader/)、[NVDA](https://www.nvaccess.org/) や [VoiceOver](https://support.apple.com/ja-jp/guide/iphone/iph3e2e415f/ios) などのスクリーンリーダーとは異なることがあります。

Virtual Screen Reader の目的はあくまで単体テストで素早いフィードバックを得ることにあります。現実のスクリーンリーダーを用いたアクセシビリティテストは引き続き必要です。

現実のスクリーンリーダーを用いて自動化されたテストを実行したい場合には、[guidepup/playwright](https://www.npmjs.com/package/@guidepup/playwright) のようなライブラリを利用できます。E2E テストフレームワークである [Playwright](https://playwright.dev/) と統合し、実際のブラウザ上で NVDA または VoiceOver を用いて操作できます。

## インストール

それでは実際に Virtual Screen Reader を使ってみましょう。この記事では React + Jest を使った例を紹介します。

まずは関連するライブラリをインストールします。

```bash
npm install -D @guidepup/jest @guidepup/virtual-screen-reader
```

`@guidepup/jest` は Jest のテストのワークフローと統合して、 Virtual Screen Reader の結果をスナップショットとして保存するためのライブラリです。Jest のセットアップファイル（`setupFilesAfterEnv` で指定したファイル）に以下のように設定を追加します。

```js:jest.setup.js
import "@guidepup/jest";
```

## テストの書き方

次に Virtual Screen Reader を使ったテストを書いてみましょう。以下のようなフォームコンポーネントがあるとします。

```tsx:src/Form.tsx
import React, { useId } from "react";

export const Form: React.FC = () => {
  const formTitleId = useId();
  return (
    <form aria-labelledby={formTitleId}>
      <h2 id={formTitleId}>Sign up for our newsletter</h2>
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" required />
      </div>

      <div>
        <label htmlFor="agree">I agree to the terms and conditions</label>
        <input type="checkbox" id="agree" name="agree" required />
      </div>

      <div>
        <button type="submit">Sign up</button>
      </div>
    </form>
  );
};
```

このフォームコンポーネントに対して、以下のようなテストを書きます。

```tsx:src/Form.spec.tsx
import { Form } from "./Form";
import { render } from "@testing-library/react";
import { virtual } from "@guidepup/virtual-screen-reader";

describe("Form", () => {
  it("should traverse the page announcing the expected roles and content", async () => {
    const { container } = render(<Form />);

    // スクリーンリーダーを起動
    await virtual.start({ container });

    // スクリーンリーダーのカーソルを次の要素に移動
    await virtual.next();
    await virtual.next();
    await virtual.next();

    // 読み上げられた内容を確認
    expect(await virtual.spokenPhraseLog()).toEqual([
      "form, Sign up for our newsletter", // <form> 要素と `aria-labelledby` によるアクセシブルな名前
      "heading, Sign up for our newsletter, level 2", // <h2> 要素とその内容
      "textbox, Email, required", // 入力欄、`<label>` 属性によるアクセシブルな名前と `required` 属性で必須入力であることが読み上げられる
    ]);

    // スクリーンリーダーを終了
    await virtual.stop();
  });
});
```

まずは Testing Library の `render()` 関数でフォームコンポーネントをレンダリングします。次に `@guidepup/virtual-screen-reader` の `virtual.start()` 関数でスクリーンリーダーを起動します。このとき、`render()` で返された `container` を渡すことで、スクリーンリーダーが読み上げる対象の要素を指定します。

`virtual.next()` 関数を呼び出すたびに、スクリーンリーダーのカーソルが次の要素に移動します。`virtual.spokenPhraseLog()` 関数でスクリーンリーダーによって読み上げられた内容が取得で入るので、この結果を `expect()` で検証します。

最後に `virtual.stop()` 関数でスクリーンリーダーを終了します。`next()` 関数を呼び出してページ全体のコンテンツの読み上げを確認するのが一般的な例になるでしょう。

## スナップショットテスト

`@guidepup/jest` によりスクリーンリーダーによって読み上げられた結果をスナップショットとして保存し、すでに保存されたスナップショットと比較すしてテストを行うことができます。スナップショットテストは、コードの変更により、スクリーンリーダーの読み上げが予期せず変更されたことを検知するために役立ちます。

スナップショットテストを実行するためには、`toMatchScreenReaderSnapshot()` 関数を使います。

```tsx:src/Form.spec.tsx
import { Form } from "./Form";
import { render } from "@testing-library/react";
import { virtual } from "@guidepup/virtual-screen-reader";

describe("Form", () => {
  test("should match the snapshot of expected screen reader spoken phrases", async () => {
    render(<Form />);

    await expect(document.body).toMatchScreenReaderSnapshot();
  });
});
```

`toMatchScreenReaderSnapshot()` 関数の結果として、以下のようなスナップショットが保存されます。

```txt:Form.spec.tsx.snap
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`Form should match the snapshot of expected screen reader spoken phrases: toMatchScreenReaderSnapshot 1`] = `
Array [
  "document",
  "form, Sign up for our newsletter",
  "heading, Sign up for our newsletter, level 2",
  "Email",
  "textbox, Email, required",
  "I agree to the terms and conditions",
  "checkbox, I agree to the terms and conditions, not checked, required",
  "button, Sign up",
  "end of form, Sign up for our newsletter",
  "end of document",
]
`;
```

## スクリーンリーダーの操作

`virtual` オブジェクトには要素間を移動する以外にも、いくつかのスクリーンリーダーの操作を行うための関数が用意されています。

### フォームの入力、クリック

`virtual.type()`, `virtual.press()`, `virtual.click()` 関数を使ってフォームの入力やクリックをシミュレートできます。以下の例では、Invalid なメールアドレスを入力した後に、フォームの読み上げが変わることを検証しています。

```tsx:src/Form.spec.tsx
import { Form } from "./Form";
import { render } from "@testing-library/react";
import { virtual } from "@guidepup/virtual-screen-reader";

test("メールアドレスの入力に不正な値を入力した場合、不正なメールアドレスである旨が読み上げられる", async () => {
  const { container } = render(<Form />);

  await virtual.start({ container });

  // メールアドレスの入力欄まで移動

  await virtual.next();
  await virtual.next();
  await virtual.next();

  // 現在の読み上げ内容を確認
  expect(await virtual.lastSpokenPhrase()).toBe("textbox, Email, required");

  // メールアドレスの入力欄に不正な値を入力
  // virtual.type() は現在のフォーカス位置に入力を行う
  await virtual.type("invalid-email");

  // エラーメッセージが読み上げられる
  expect(await virtual.lastSpokenPhrase()).toBe(
    "textbox, Email, invalid-email, required"
  );
});
```

### スクリーンリーダーのコマンドの実行

`virtual.perform()` 関数により、あらかじめ定義されているスクリーンリーダーのコマンドを実行できます。実行可能なコマンドの一覧は [VirtualCommands](https://www.guidepup.dev/docs/api/class-virtual-commands) を参照してください。

ここでは、ランドマーク間を移動する例を示します。ランドマークとは、ページの構造を表す要素で、具体的には以下の 8 つのロールがあり、それぞれ対応する HTML 要素があります。

- banner：`<header>`
- contentinfo：`<footer>`
- main」：`<main>`
- region：`<section>`（アクセシブルな名前がある場合）
- navigation：`<nav>`
- complementary： `<aside>`
- form： `<form>`（アクセシブルな名前がある場合）
- search：`<search>`（ブラウザの互換性のため、`role="search"` と併用することが望ましい）

多くのスクリーンリーダーは、特定のランドマークへジャンプする機能が備わっています。この機能を使って、例えば各ページごとに存在するナビゲーションバーをスキップして本文のコンテンツに移動できます。

このランドマークへジャンプする機能をテストしてみましょう。以下のようなコンポーネントがあるとします。

```tsx:src/App.tsx
import React from "react";

export const App: React.FC = () => {
  return (
    <div>
      <header>
        <h1>My Site</h1>
        <nav aria-label="site navigation">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </nav>
        <search aria-label="site search">
          <label htmlFor="search">Search</label>
          <input type="search" id="search" name="search" />
          <button type="submit">Search</button>
        </search>
      </header>
      <main>
        <h2>About</h2>
        <p>...</p>
      </main>
      <footer>
        <p>© 2024 My Site</p>
      </footer>
    </div>
  );
};
```

ランドマーク間を移動するテストは以下のように書けます。`virtualCommands.moveToNextLandmark` は、次のランドマークへ移動するコマンドです。

```tsx:src/App.spec.tsx
test("ランドマーク間を移動する", async () => {
  const { container } = render(<App />);

  await virtual.start({ container });

  await virtual.perform(virtual.commands.moveToNextLandmark);
  expect(await virtual.lastSpokenPhrase()).toBe("navigation, site navigation");

  await virtual.perform(virtual.commands.moveToNextLandmark);
  expect(await virtual.lastSpokenPhrase()).toBe("main");

  await virtual.perform(virtual.commands.moveToNextLandmark);
  expect(await virtual.lastSpokenPhrase()).toBe("contentinfo");

  await virtual.stop();
});
```

また、本文にジャンプするための `moveToNextMain`、ナビゲーションバーにジャンプするための `moveToNextNavigation` などの特定のランドマークにジャンプするコマンドも用意されています。

```tsx:src/App.spec.tsx
test("本文にジャンプする", async () => {
  const { container } = render(<App />);

  await virtual.start({ container });

  await virtual.perform(virtual.commands.moveToNextMain);
  expect(await virtual.lastSpokenPhrase()).toBe("main");

  await virtual.stop();
});
```

## まとめ

- Virtual Screen Reader はテストのためにスクリーンリーダをシミュレートするライブラリで
- UI フレームワーク、テストフレームワークを問わず利用できる
- W3C の仕様に従い、スクリーンリーダーの挙動を模倣している
  - 本物のスクリーンリーダーを再現しているわけではないことに注意。あくまで単体テストで素早いフィードバックを得ることが目的であり、実際のスクリーンリーダーを用いたアクセシビリティテストは引き続き必要
- 前後の要素に移動して、読み上げられた内容を検証できる
- スナップショットテストにより、スクリーンリーダーによって読み上げられた内容を保存し、変更がないかを検証できる
- フォームの入力、クリック、スクリーンリーダーのコマンドの実行など、スクリーンリーダーの操作をシミュレートできる

## 参考

- [guidepup/virtual-screen-reader: Virtual Screen Reader is a screen reader simulator for unit tests.](https://github.com/guidepup/virtual-screen-reader)
- [guidepup/jest: Screen reader accessibility matchers for jest](https://github.com/guidepup/jest)
- [Virtual Screen Reader API Reference](https://www.guidepup.dev/docs/api/class-virtual)
