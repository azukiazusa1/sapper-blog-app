---
id: hpZ5Wd88diSSPyDxABD-t
title: Vitest のブラウザテスト
slug: vitest-browser-test
about: "Vitest は実験的な機能として、ブラウザモードをサポートしています。ブラウザテストは Node.js 上で jsdom を用いてテストを実効するよりも信頼性の高い方法ですが、テストのセットアップに時間がかかるといったデメリットも存在します。"
createdAt: "2023-05-14T14:04+09:00"
updatedAt: "2023-05-14T14:04+09:00"
tags: ["Vitest", "test"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/5jIecuXE6KmUTSMGdvPWqz/5e1f1eefd7af16f915054d0aa29be50c/___Pngtree___summer_iced_lemon_tea_9054209.png"
  title: "summer_iced_lemon_tea"
published: true
---

Vitest は実験的な機能として、ブラウザモードをサポートしています。この記事では、Vitest のブラウザモードをどのように使用するかを説明します。

## ブラウザテストとは？

ブラウザテストとは、その名の通りブラウザ上でテストを実行することです。現在、Jest や Vitest を用いた多くのテストは Node.js 上で [jsdom](https://github.com/jsdom/jsdom) のようなブラウザの環境を模した環境でテストを実行しています。これはテストのセットアップを簡略化して、テストの実行速度を向上させるためです。

多くの場合は jsdom でのテストで十分ですが、本番のアプリケーションが実行される環境とは異なる環境でテストが実行されるため、テストの信頼性が失われるおそれがあります。例えば Node.js の環境では LocalStorage が存在しません。そのため、多くの場合では LocalStorage をモックしてテストを実行する必要があるため、結合的なテストを実行できません。

また複数のブラウザでテストを実行する、いわゆるクロスブラウザテストを実行することもできません。ある特定のブラウザのみで発生しうるバグを見過ごすおそれがあります。

このような問題を解決するために、ブラウザ上でテストを実行するためには [WebdriverIO](https://webdriver.io/)、[Cypress](https://www.cypress.io/) や [Playwright](https://playwright.dev/) などのブラウザ自動化ツールが用いられていました。

## Vitest のブラウザモード

Vitest のブラウザモードを使用することで、ネイティブなブラウザの環境でテストを実行することができます。前述した Cypress や Playwright などのツールは単体レベルのテストの実行が難しいなどの問題があります。Vitest のブラウザモードでは、より手軽にブラウザでテストを実行可能です。

Vitest のブラウザモードではより正確で信頼性の高いテストを提供してくれますが、その反面テストのセットアップではプロバイダとブラウザを起動する必要があり、時間がかかるという欠点があります。実際にブラウザモードを使用する場合には、テストの信頼性と実行速度のトレードオフを考慮してください。例えば Web API に依存しないようなテストでは、ブラウザモードを使用する必要はありません。

!> ブラウザモードは現在開発初期段階の機能です。そのため、未解決のバグが存在したり、API が変更される可能性があります。

## ブラウザモードの使用方法

ブラウザモードを使用するには、Vitest の設定ファイルである `vitest.config.js` の `browser.enabled` を `true` に設定するか、`--browser` オプションを使用してください。

```js:vitest.config.js
export default defineConfig({
  test: {
    browser: {
      enabled: true,
      name: 'chrome', // browser name is required
    },
  }
})
```

| オプション | 説明 | 必須 |
| --- | --- | --- |
| `browser.enabled` | ブラウザモードを有効にするかどうか | `false` |
| `browser.name` | テストで使用するブラウザの名前 | `true` |
| `browser.provider` | ブラウザのプロバイダ | `false` |
| `browser.headless` | ブラウザをヘッドレスモードで起動するかどうか | `false` |

Vitest はブラウザのプロバイダに依存しているため、`brower.name` プロパティは必須属性です、以下の選択肢から選択できます。

- webdriverIO（デフォルト）
  - `chrome`
  - `firefox`
  - `chrome`
  - `edge`
  - `safari`
- playwright
  - `chromium`
  - `firefox`
  - `webkit`

ブラウザのプロバイダはデフォルトでは WebdriverIO が使用されます。その他のプロバイダを使用する場合は、`browser.provider` プロパティを使用してください。

さらに、`@vitest/browser` パッケージと、ブラウザのプロバイダをインストールする必要があります。

```sh
npm install -D @vitest/browser webdriverio
```

## ブラウザモードを試してみる

それでは実際に Vitest のブラウザモードを試してみましょう。以下のように、LocalStorage を使用するコンポーネントをテストするコードを書いてみます。

```tsx
import { useEffect, useState } from "react";

const Counter: React.FC = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // LocalStorage に値があれば取得
    localStorage.getItem("count") &&
      setCount(Number(localStorage.getItem("count")));
  }, []);

  const increment = () => {
    setCount((count) => count + 1);
    // 値が変更されるときに LocalStorage に保存
    localStorage.setItem("count", String(count + 1));
  };

  return (
    <>
      <button onClick={increment}>count is {count}</button>
    </>
  );
};

export default Counter;
```

よくあるカウンターアプリです。値の初期値には LocalStorage の値を使用し、値が変更されると LocalStorage に保存するというものです。テストは次のように、普段のテストと同じように書くことができます。（`@testing-library/jsdom` はブラウザモードでは使用できません。）

```tsx
import Counter from "./Counter";
import { describe, test, beforeEach, expect } from "vitest";
import { fireEvent, render, screen, cleanup } from "@testing-library/react";

describe("Counter", () => {
  beforeEach(() => {
    // テストごとに LocalStorage をクリア
    localStorage.clear();
    // jsdom のテストとは異なり、明示的に cleanup を呼び出す必要がある
    cleanup();
  });

  test("LocalStorage に値が保存されている場合、初期値として表示される。", async () => {
    // LocalStorage に値を保存
    localStorage.setItem("count", "10");

    render(<Counter />);

    // ボタンのテキストが "count is 10" であることを確認
    expect(screen.getByRole("button").textContent).toBe("count is 10");
  });

  test("ボタンをクリックすると、カウントアップし、LocalStorage に値が保存される", () => {
    render(<Counter />);

    fireEvent.click(screen.getByRole("button"));

    // ボタンのテキストが "count is 1" であることを確認
    expect(screen.getByRole("button").textContent).toBe("count is 1");

    // LocalStorage に値が保存されていることを確認
    expect(localStorage.getItem("count")).toBe("1");
  });
});
```

上記のように、LocalStorage をモックすることなくテストの中で使用できます。`npx vitest` コマンドでテストを実行すると、Vitest の UI が表示され、テストが実行されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3RfAcWadn4NHKygtk0ii9L/959556d1e9eeedd912f530304b57a089/____________________________2023-05-14_15.04.20.png)

## 感想

Vitst のブラウザモードについて紹介しました。Vitest の API をそのまま使用でき、コンポーネント単位でブラウザのテストを実行できる点がメリットに感じました。ただし、実際にブラウザにどのように描画されているかまでは確認できない、`viewport` を指定できない、複数のブラウザを同時に実行できないなど、ブラウザのテストとしては不十分な点があります。

その点では Cypress や Playwright のコンポーネントテストに分があるように感じました。