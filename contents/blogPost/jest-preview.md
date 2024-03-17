---
id: 3IPQMXCi1PmQroEGShwB9J
title: "Jest Preview がけっこーすごい"
slug: "jest-preview"
about: "Jest Preview とは Jest で実行中のテストに debug() 関数を仕込むことで、実行中のテストが作成した HTML をブラウザでプレビューしながらデバッグできるライブラリです。"
createdAt: "2022-05-29T00:00+09:00"
updatedAt: "2022-05-29T00:00+09:00"
tags: ["Jest"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/6XGdxMPQ12Pu17IomOIN2p/36659845da975d239492a5a08210d8e9/0b854a8294c3f93903ceb507a26ac214.webp"
  title: "jest-preview"
selfAssessment: null
published: true
---
テスト駆動開発（TDD）と呼ばれる開発手法は、開発者が仕様を理解できる、安全にリファクタリングのサイクルを回すことが得られるといったメリットを享受できます。

ことフロントエンド開発においても TDD を実践することが可能なのですが、1 点課題が存在します。それは、`jsdom` を使用している場合にはテストを書いてる最中に実際の描画内容を確認できないという点です。

どのようなスタイルが適用されどのように描画されるかまでをテストすることはできないため、TDD でコンポーネントの仕様をテストしながら進めつつも、最終的に Storybook や実際のブラウザで確認した後に全然想定通りの描画内容にならなかった・・・という事象に陥りがちです。

つまり、コンポーネントの仕様（機能）については TDD のサイクルに沿って開発することはできても、描画内容については同じサイクルで回すことができないため結局早いリファクタリングのサイクルを回すことが難しいのです。

描画内容もテストの中で確認できないのかなーと思っていたら、Jest Preview と呼ばれるまさに欲しかったライブラリが発表されました。

https://www.jest-preview.com/

## Jest Preview とは？

Jest Preview とは Jest で実行中のテストに debug() 関数を仕込むことで、実行中のテストが作成した HTML をブラウザでプレビューしながらデバッグできるライブラリです。これに関しては実際に実行しているところを見るのがわかりやすいでしょう。

![jest-preview](//images.ctfassets.net/in6v9lxmm5c8/2MXUgxToZ7ityh40abXqjL/8d271655e28b7ac17ea04ca20dbdb6da/jest-preview.gif)

`jest-preview` コマンドを実行すると http://localhost:3336 でサーバーが立ち上がります。この状態でテストを実行し `preview.debug()` メソッドを呼び出すことでその時点での描画内容をブラウザに表示します。

`jest` を watch モードで実行している場合、テストの内容やコンポーネントの実装を変更するたびにテストが再実行され `preview.debug()` が呼び出されるので、実装やテストを変更するたびに描画内容もまた確認できます。

## インストール

Jest Preview は現在 [Jest](https://jestjs.io/) と [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) の組み合わせのみをサポートしています。`create-react-app` など React プロジェクトを作成しておきましょう。

次のコマンドで Jest Preview をインストールします。

```sh
$ npm install --save-dev jest-preview
```

続いて、CSS トランスフォームや外部の CSS を読み込むための設定を行います。この設定は `create-react-app` を使用してプロジェクトを作成している場合、以下のコマンドで実行できます。

```sh
$ npx jest-preview config-cra
```

それ以外の場合には以下の内容を Jest の設定ファイルに記載します。

```js
// jest.config.js
transform: {
  "^.+\\.(css|scss|sass)$": "jest-preview/transforms/css",
  "^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)": "jest-preview/transforms/file",
}
```

最後に、`package.json` に `jest-preview` コマンドを追加します。

```json
{
  "scripts": {
    "jest-preview": "jest-preview"
  }
}
```

## テストを実行する

インストールが完了したので実際にテストを実行してみましょう。`jest-preview` コマンドを実行して　http://localhost:3336 にサーバーを立ち上げます。

```sh
$ npm run jest-preview
```

この段階ではまだ何も表示されません。

![スクリーンショット 2022-05-29 21.57.48](//images.ctfassets.net/in6v9lxmm5c8/3OqvMxXXJy2FJidSJWRNho/5b1264ec344186a632743cbb238ec39a/____________________________2022-05-29_21.57.48.png)

続いてテストファイルを作成して、その中で `preview.debug()` メソッドを呼び出すようにします。

```jsx
/* eslint-disable testing-library/no-debugging-utils */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import preview from "jest-preview";
import Counter from "./Counter";

describe("Couter", () => {
  it("increments the count", () => {
    render(<Counter />);
    const button = screen.getByRole("button", { name: /click me/i });
    userEvent.click(button);
    userEvent.click(button);

    preview.debug();

    const heading = screen.getByRole("heading");
    expect(heading).toHaveTextContent("You clicked 2 times");
  });
});
```

`jest-preview` でサーバーを立ち上げ状態のまま、別ターミナルを開いて以下コマンドでテストを実行します。

```sh
$ npm run test
```

結果、次のようにブラウザに `jest.preview()` を呼び出した時点での描画内容が表示されるようになります。

![スクリーンショット 2022-05-29 22.03.27](//images.ctfassets.net/in6v9lxmm5c8/7vzUDlNzawSRRHZWzYP7hw/699550d722195a99fddacdaac11c2768/____________________________2022-05-29_22.03.27.png)

## Jest Preview の設定

[jestPreviewConfigure](https://www.jest-preview.com/docs/api/jestPreviewConfigure) によりいくつかの設定を行うことができます。この設定は `setupTests.{js,ts}` ファイル内で行うのが良いでしょう。

まずは `jest.config.js` ファイル内で `setupTests.ts` ファイルの場所を指定します。

```js
// jest.config.js
"setupFilesAfterEnv": [
  "<rootDir>/src/setupTests.ts"
],
```

`src/setupTests.ts` ファイルを作成して以下の内容を記載します。

```ts

import { jestPreviewConfigure } from 'jest-preview'

jestPreviewConfigure({
  autoPreview: true,
  externalCss: ['src/index.css'],
  publicFolder: 'static'
})
```

`jest-preview` からインポートしている `jestPrewviewConfigure` が設定を行うためのメソッドです。
  - `autoPreviwe`：`true` に設定した場合にはテストが失敗した場合 `preview.debug()` を呼び出さない場合にも自動でブラウザに UI を描画します。
  - `externalCss`：`src/index.css` のように Jest 内では呼び出されない外部の CSS ファイルを指定します。（大抵の場合、`main.ts` で呼び出される CSS ファイルが該当するでしょう）
  - `publicFolder`：プロジェクトの `public` フォルダの配置場所を指定します。デフォルトではルートディレクトリの `public` フォルダが使用されます。

## 感想

気づいたら私が欲しいものが来てた。もともと Jest で実行されるテストは `jsdom` で実行される都合上テストがあっても多少の不安要素があったのですが、実際にブラウザで描画を確認できるのは安心ですね。

まだまだ対応範囲は狭いのですが、将来は Jest Preview に使用がスタンダードになったりするのでしょうか。とりあえず Vitest で使えるようになってほしいです。
