---
id: 5ACtPt8kTcKUmsuY1XIE08
title: "AngularJS のチュートリアルを React にリプレイスしてみた①"
slug: "angularjs-react"
about: "AngularJS のチュートリアルを React にリプレイスします。"
createdAt: "2022-07-31T00:00+09:00"
updatedAt: "2022-07-31T00:00+09:00"
tags: ["React", "AngularJS", "", "Webpack"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2c9EyCXfherkq4ICwfDHaM/13bcad3dd62573b050eb8ad25dce4275/1200px-React-icon.svg.png"
  title: "React"
selfAssessment: null
published: true
---
この記事は、AngularJS の公式が提供している[チュートリアル](https://docs.angularjs.org/tutorial) を React にリプレイスすることで、フロントエンドのフレームワークの移行作業を体験することを目的としています。この記事内には以下の要素が存在します。

- Webpack の導入
- JavaScript → TypeScript
- angular2React を利用した段階的なコンポーネントの置き換え
- Jasmine + Karma → Jest
- Protractor → Playwright

またレポジトリは以下に存在します。作業のはじめから行いたい場合には `01.start` のタグにチェックアウトしてください。

https://github.com/azukiazusa1/angular-phonecat/tree/01.start

## E2E テストを導入する

大規模なリファクタリングを行ううえで、何かが壊れていないことを保証してくれるのが、自動化されたテストです。特に E2E（エンドツーエンド）テストは内部の構造を気にせず、ユーザーの目線からアプリケーションが期待通りに動作することを検証します。そのため、今回のようにフレームワークをリプレイスする場合でも。テストコード自体を修正せずに前後で動作が変わらないことを確認できます。

今回の対象のコードには E2E テストが含まれているのですが、使用されているテスティングフレームワークである [Protractor](https://www.protractortest.org/#/) が Angular に依存してしまっています。このままですと React に置き換えた際にテストコードが動かなくなってしまうので、特定のフレームワークに依存しないテストコードに書き換えることとします。

今回はテスティングフレームワークとして [Playwright](https://playwright.dev/) を使用します。以下のコマンドで Playwright をインストールします。

```sh
npm init playwright@latest

✔ Do you want to use TypeScript or JavaScript? · TypeScript
✔ Where to put your end-to-end tests? · tests
✔ Add a GitHub Actions workflow? (y/N) · false
```

デモ用のテストファイルが生成されるのですが、削除してしまって問題ありません。

```sh
rm -rf tests-examples
rm tests/example.spec.ts
```

デフォルトの設定では、Chrome・Firefox・webkit の 3 つのブラウザでテストが実行されますが、もともとのテストは Chrome のみで実行されていたので合わせて Chrome のみで十分でしょう。`playwright.config.ts` ファイルを修正します。

```ts diff
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
-     {
-       name: 'firefox',
-       use: {
-         ...devices['Desktop Firefox'],
-       },
-     },

-     {
-       name: 'webkit',
-       use: {
-         ...devices['Desktop Safari'],
-       },
-     },
```

またテストが失敗したときにスクリーンショットを撮影するように設定しておきましょう。

```ts diff
  use: {
    actionTimeout: 0,
    trace: 'on-first-retry',
+   screenshot: 'only-on-failure'
  },
```

それでは初めのテストを記述しましょう。基本的に、`e2e-tests/scenarios.js` の内容になぞって記述していくこととします。初めは 'index.html' にアクセスしたとき、`index.html#!/phones` にリダイレクトすることを確認するテストです。

`tests/intergration.spec.ts` ファイルを作成します。

```ts
import { test, expect } from '@playwright/test';

test.describe('PhoneCat Application', () => {

  test('should redirect `index.html` to `index.html#!/phones', async ({ page }) => {
    await page.goto('http://localhost:8000/');

    await expect(page).toHaveURL('http://localhost:8000/#!/phones');
  });
})
```

`page.goto()` メソッドは引数で指定した URL へ移動します。その後、`expect(page).toHaveURL('http://localhost:8000/#!phones')` で現在の URL のパスを検証します。

テストを実行する前に開発サーバーを起動する必要があります。

```sh
npm run start
```

E2E テストを実行するためにコマンドを `package.json` に追加します。

```json
  "scripts": {
    "e2e": "playwright test"
  }
```

開発サーバーを起動し続けたまま、テストを実行しましょう。

```
npm run e2e
```

ここまでうまくいっていれば、テストは成功しているはずです。

```
> angular-phonecat@0.0.0 e2e
> playwright test

Running 1 test using 1 worker

  1 passed (2s)

To open last HTML report run:

  npx playwright show-report
```

さらにテストを追加していきましょう。電話一覧のページのテストです。
「should filter the phone list as a user types into the search box」はサーチボックスにテキストを入力したとき、フィルタリングが行われるか確認するテストです。

```ts
test.describe('View: Phone list', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:8000/#!/phones');
    });

    test('should filter the phone list as a user types into the search box', async ({ page }) => {
      const phoneList = page.locator('role=listitem');
      const input = page.locator("input");

      expect(phoneList).toHaveCount(20);

      await input.fill('nexus');
      await page.waitForTimeout(1000);
      expect(phoneList).toHaveCount(1);

      await input.fill('motorola');
      await page.waitForTimeout(1000);
      expect(phoneList).toHaveCount(8);
    })
  })
```

`test.beforeEach` でこの `describe` ブロック内のテストの実行前に毎回電話一覧ページへ遷移するようにしています。

始めに `pge.locator()` メソッドでテストに必要な要素を取得します。`locator` で要素を取得する際には、テキスト・CSS・ARIA ロール・id・XPath のセレクターを使用できます。`listitem` ロールからすべての電話一覧の、`input` 要素からサーチボックスを取得しています。

`locator` で要素を取得する際のベストプラクティスは、ARIA ロールやラベルのようにのようにユーザー目線のセレクターを使用し、詳細なセレクターを控えることです。例えば `class` 属性などは CSS のリファクタリングにより、仕様と関係ない理由で変更される可能性がありますが、ユーザー目線の属性が変更されることは稀です。そのため、メンテナンス性の高いテストコードをとなります。

初めに、`expect(phoneList).toHaveCount(20)` を使用しサーチボックスに何も入力していない場合（初期状態に）には 20 個のリストが存在することを検証しています。 

続いて `input.fill('nexus')` でサーチボックスに「nexus」という文字列を入力します。ここで文字列を入力したことによりリストの数が変化することを確認したいのですが、リストの数の増減に応じてアニメーションが始まるので、完了するまで正しいリストの数を取得できません。そのため、`page.waitForTimeout(1000)` を入れてアニメーションの完了を待機しています。

「nexus」という文字列によりリストは 1 つにフィルタリングされるはずです。さらに、今後は「motorola」という文字列を入力し 8 つのリストにフィルタリングされることを検証しています。

次に、セレクトボックスによりリストが並べ替えらることをテストします。このテストも同様に `  describe('View: Phone list)` ブロック内に記述します。

```ts
  test.describe('View: Phone list', () => {
    // ...

    test('should be possible to control phone order via the drop-down menu', async ({ page }) => {
      const dropdown = page.locator('select');
      const input = page.locator("input");
      const phoneList = page.locator('role=listitem').locator('role=link');

      const getNames = async () => {
        const names = await phoneList.allInnerTexts();
        return names.filter((name) => !!name);
      }

      await input.fill('tablet');
      await page.waitForTimeout(1000);

      expect(await getNames()).toEqual([
        'Motorola XOOM\u2122 with Wi-Fi',
        'MOTOROLA XOOM\u2122'
      ])

      await dropdown.selectOption('name');
      await page.waitForTimeout(1000);

      expect(await getNames()).toEqual([
        'MOTOROLA XOOM\u2122',
        'Motorola XOOM\u2122 with Wi-Fi'
      ])
    })
  })
```

まずはセレクトボックスとサーチボックス要素を取得します。`page.locator('role=listitem').locator('role=link')` のように `locator` を連鎖することでリスト要素の中のリンク要素（電話の名前）を取得しています。

`getNames` 関数では、`allInnerTexts()` メソッドにより電話の名前の一覧を取得しています。その文字列も一緒に取得してしまうため `filter` で弾いています。

検証する要素を短くするために、サーチボックスに「tablet」と入力してリスト一覧をフィルタリングしておきます。`expect(await getNames()).toEqual()` で初期値は新しい順に並んでいることを検証しています。

続いて `dropdown.selectOption('name')` でセレクトボックスの要素を選択しています。フィルタリング時と同様にアニメーションが始めるので、完了するまで待機しています。

セレクトボックスで `name` を選択した場合、アルファベット順で並べ替えされるはずですので、そのことを再度 `expect(await getNames()).toEqual()` で検証しています。

最後に、電話ごとに正しいリンクが設定されているかどうか検証するテストです。

```ts
  test.describe('View: Phone list', () => {
    // ...

    test('should render phone specific links', async ({ page }) => {
      const input = page.locator("input");

      await input.fill('nexus');
      await page.waitForTimeout(1000);

      const firstPhoneLink = page.locator('role=listitem').locator('role=link').first();

      await firstPhoneLink.click();

      expect(page).toHaveURL('http://localhost:8000/#!/phones/nexus-s');
    })
  })
```

サーチボックスに「nexus」と入力した後、`page.locator('role=listitem').locator('role=link').first()` で 1 番目のリスト要素を取得します。

リンク要素をクリックした後、` expect(page).toHaveURL()` 現在の URL が期待しているものであるか検証しています。

次は電話の詳細ページのテストで。まとめて実装していきましょう。

```ts
test.describe('View: Phone detail', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8000/#!/phones/nexus-s');
  })

  test('should display the `nexus-s` page', async ({ page }) => {
    expect(page.locator('role=heading').first()).toHaveText('Nexus S');
  })

  test('should display the first phone image as the main phone image', async ({ page }) => {
    const mainImage = page.locator('img.selected');
    expect(mainImage).toHaveAttribute('src', 'img/phones/nexus-s.0.jpg');
  })

  test('should swap main image if a thumbnail is clicked', async ({ page }) => {
    const mainImage = page.locator('img.selected');
    const thumbnails = page.locator('role=listitem').locator('role=img');

    await thumbnails.nth(2).click();
    expect(mainImage).toHaveAttribute('src', 'img/phones/nexus-s.2.jpg');

    await thumbnails.first().click();
    expect(mainImage).toHaveAttribute('src', 'img/phones/nexus-s.0.jpg');
  })
})
```

電話一覧ページと同様に `test.beforeEach` で毎回詳細ページへ遷移するようにしています。

1 つ目のテストは「nexus-s」のページが正しく描画されているかどうか、ヘディング要素のテキストで検証しています。

2 つ目テストではメインイメージに 1 番初めの画像が使用されているかどうかを検証しています。

3 つ目のテストはサムネイル画像をクリックしたとき、メインイメージの画像がクリックしたサムネイル画像に変更されるかどうかの検証です。

ここまでの流れでなんとなく何をやっているかつかめれば大丈夫です。もともとあった `e2e-tests/scenarios.js` とも比較してみてください。

E2E テストを書き直しましたので、もともとファイルは削除してしまってよいでしょう。

```sh
rm -rf e2e-tests
npm uninstall protractor
```

ここまでのコミットは以下となります。

https://github.com/azukiazusa1/angular-phonecat/commit/9e24bc55685e3890fc954a75c8af20047f6f7484

## Webpack を導入する

React を導入する前段階として、まずは [Webpack](https://webpack.js.org/) を導入してファイルをバンドルできるようにしましょう。

まずは必要なパッケージをインストールします。

```sh
npm install --save-dev webpack webpack-cli webpack-dev-server babel-loader @babel/core @babel/preset-env @babel/preset-react ts-loader raw-loader html-webpack-plugin style-loader css-loader copy-webpack-plugin
```

TypeScript を使うため、TypeScript に必要なパッケージもインストールします。

```sh
npm install --save-dev @tsconfig/create-react-app typescript @types/react @types/react-dom @types/jquery
```

tsconfig ファイルも作成します。[tsconfig/bases](https://github.com/tsconfig/bases) から `extends` することで手軽に React 用の設定を行えます。

```json
{
  "extends": "@tsconfig/create-react-app/tsconfig.json",
  "compilerOptions": {
    "noEmit": false,
  }
}
```

続いて Webpack の設定ファイルである `webpack.config.js` を作成します。

```js
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: "./app/main.ts",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "main.js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: "babel-loader",
          },
          {
            loader: "ts-loader",
            options: {
              configFile: path.resolve(__dirname, "tsconfig.json"),
            },
          },
        ],
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/,
        use: ["raw-loader"],
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    port: 8000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./app/index.html",
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "./",
          to: "./phones",
          context: "./app/phones",
        },
        {
          from: "./",
          to: "./img",
          context: "./app/img",
        },
      ],
    }),
  ],
};
```

簡単に、各プロパティの設定を説明します。

### `mode`

改行やインデントを取り除いた本番用のビルドとするか、開発用のビルドとするか設定します。今回は本番用のビルドは行わないので `development` としています。

### `devtool`

開発用の `source-map` をどのように出力するかどうかを設定します。

### `entry`

アプリケーションのバンドル処理を開始するポイントです。

### `output`

コンパイルされたファイルをどのディレクトリに書き出すかを webpack に伝えます。

### `resolve`

モジュールがどのように解決されるかどうかを設定します。`resolve.extensions` で拡張子を指定した場合、`import` 時に拡張子を省略できます。

### `module`

このオプションはモジュールのタイプごとにどのように扱われるかどうかを設定します。

`module.rules[].test` でターゲットとなる拡張子を指定し、その拡張子のファイルに対して `module.rules[].use` で使用する loader を指定します。

例えば `.ts.,tsx` 拡張子には `babel-loader` と `ts-loader` を使用することを宣言しています。`babel-loader` は [Babel](https://github.com/babel/babel) により JavaScript をトランスパイルし、最新の構文をブラウザで動く形式に変換します。`ts-loarder` は TypeScript を JavaScript にトランスパイルします。

`.css` 拡張子に対しては `css-loader` と `style-loader` を使用します。`css-loader` は CSS を文字列として　JavaScript ファイルに `import` するための loader です。`style-loader` は JavaScript 内の CSS 文字列を DOM に挿入するために使用されます。

`.html` 拡張子は  AngularJS の [template](https://docs.angularjs.org/guide/templates) を読み込むために `raw-loader` を使用しています。

### `devServer`

[webpack-dev-server](https://github.com/webpack/webpack-dev-server) を使用するための設定です。`webpack-dev-server` は開発用サーバーを立ち上げ、にホットリロードなどを提供してくれます。

`static.directory` にサーバーの起点となるディレクトリを指定します。この値の `output` と同様で構いません。`port` にはポート番号を指定します。

### `plugins`

Webpack のプラグインを設定します。[HtmlWebpackPlugin](https://webpack.js.org/plugins/html-webpack-plugin/) は Webpack が `index.html` ファイルを生成する代わりにテンプレート用の HTML ファイルを指定します。

[ProvidePlugin](https://webpack.js.org/plugins/provide-plugin/) はあるモジュールを `import` する代わりに自動的にロードするために使用されます。AngularJS はグローバルに存在する `window.jQuery` に依存しているため、このプラグインを使用する必要があります。

[CopyPlugin](https://webpack.js.org/plugins/copy-webpack-plugin/) は画像や JSON ファイルなどの静的コンテンツをバンドルせずにそのままコピーするために使用します。

続いて、`babel-loader` 用の設定ファイルである `.babelrc` を作成します。 

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

`@babel/preset-env` は `babel` プラグインのプリセットです。必要なプラグインを自動で選択して動く状態にしてくれます。`@babel/preset-react` は React 用のプリセットです。

`package.json` の `scripts` を修正して、開発環境の起動に Webpack を使用するようにします。

```json diff
  "scripts": {
-     "postinstall": "npm run copy-libs",
    "update-deps": "npm update",
-    "postupdate-deps": "npm run copy-libs",
-    "copy-libs": "cpx \"node_modules/{angular,angular-*,bootstrap/dist,jquery/dist}/**/*\" app/lib -C",
-    "prestart": "npm install",
-    "start": "http-server ./app -a localhost -p 8000 -c-1",
+    "start": "http-server ./dist -a localhost -p 8000 -c-1",
-    "pretest": "npm install",
    "test": "karma start karma.conf.js",
    "test-single-run": "npm test -- --single-run",
    "e2e": "playwright test",
+    "build": "webpack",
+    "dev": "webpack-dev-server"
  }
```

さらに、バンドルファイルを git 管理下に含めないように `.gitignore` を修正します。

```diff
+ dist
```

`webpack` のエントリーファイルを作成しましょう。`app/main.ts` ファイルを作成して、必要なモジュールをインポートします。

```ts
import "jquery"
import 'angular'
import 'angular-resource'
import 'angular-route'
import 'angular-animate/angular-animate'

import 'bootstrap/dist/css/bootstrap.css'
import './app.css'
import sh'./app.animations.css'

import './app.module'
import './app.config'
import './app.animations'
import './phone-list/phone-list.module'
import './phone-list/phone-list.component'
import './phone-detail/phone-detail.module'
import './phone-detail/phone-detail.component'
import './core/core.module'
import './core/checkmark/checkmark.filter'
import './core/phone/phone.module'
import './core/phone/phone.service'
```

`app/main.ts` でモジュールを読み込むように修正しましたので、`app/index.html` において `<script>` や `<linl>` タグで個別に読み込む必要はありません。すべて削除しましょう。

```html diff
-  <link rel="stylesheet" href="lib/bootstrap/dist/css/bootstrap.css" />
-  <link rel="stylesheet" href="app.css" />
-  <link rel="stylesheet" href="app.animations.css" />

-  <script src="lib/jquery/dist/jquery.js"></script>
-  <script src="lib/angular/angular.js"></script>
-  <script src="lib/angular-animate/angular-animate.js"></script>
-  <script src="lib/angular-resource/angular-resource.js"></script>
-  <script src="lib/angular-route/angular-route.js"></script>
-  <script src="app.module.js"></script>
-  <script src="app.config.js"></script>
-  <script src="app.animations.js"></script>
-  <script src="core/core.module.js"></script>
-  <script src="core/checkmark/checkmark.filter.js"></script>
-  <script src="core/phone/phone.module.js"></script>
-  <script src="core/phone/phone.service.js"></script>
-  <script src="phone-list/phone-list.module.js"></script>
-  <script src="phone-list/phone-list.component.js"></script>
-  <script src="phone-detail/phone-detail.module.js"></script>
-  <script src="phone-detail/phone-detail.component.js"></script>
```

`app/lib` ディレクトリももはや必要ないので削除しておきましょう。

```sh
rm -rf app/lib
```

最後に、アプリケーションコードを修正する必要があります。AngularJS のコンポーネントでは `templateUrl` により外部の HTML ファイルを HTTP リクエストで読み込んでいます。Webpack では 1 つのファイルにバンドルする必要があるので、`templateUrl` を指定している箇所をインポートするように変更します。

以下の 2 つのファイルを変更します。

- `app/phone-list/phone-list.component.js`
- `app/phone-detail/phone-detail.component.js`

```js diff
  'use strict';
+ import template from './phone-list.template.html';

  // Register `phoneList` component, along with its associated controller and template
  angular.
    module('phoneList').
    component('phoneList', {
-     templateUrl: 'phone-list/phone-list.template.html',
+     template,
      controller: ['Phone',
        function PhoneListController(Phone) {
          this.phones = Phone.query();
          this.orderProp = 'age';
        }
      ]
    });
```

```js diff
  'use strict';
+ import template from './phone-detail.template.html';
  // Register `phoneDetail` component, along with its associated controller and template
  angular.
    module('phoneDetail').
    component('phoneDetail', {
-     templateUrl: 'phone-detail/phone-detail.template.html',
+     template,
      controller: ['$routeParams', 'Phone',
        function PhoneDetailController($routeParams, Phone) {
          var self = this;
          self.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
            self.setImage(phone.images[0]);
          });

          self.setImage = function setImage(imageUrl) {
            self.mainImageUrl = imageUrl;
          };
        }
      ]
    });
```

ここまで完了したら、以下のコマンドで開発サーバーを起動してみましょう。問題がなければ、以前と変わらない画面が表示されているはずです。

```sh
npm run dev
```

Webpack の導入でなにか壊してしまっていないか確認するために、前回作成して E2E テストを実行しましょう。開発サーバーを立ち上げたままテストを実行します。

```sh
npm run e2e
```

テストが無事通っていれば、安心ですね。このように、なにか変更を加えるたびに E2E テストを実行して安全に進めていきましょう。

ここまでのコミットは以下のとおりです。

https://github.com/azukiazusa1/angular-phonecat/commit/46de1b33687b8657b732d5279334789c60f49557

## リンターの導入

続いて、リンターとして [ESLint](https://eslint.org/) と [Prettier](https://prettier.io/) を導入します。以下のコマンドで ESLint の初期設定を実行します。

```sh
npx eslint --init
```

対話形式で設定内容を聞かれるので、以下のように回答しました。

```sh
? How would you like to use ESLint? … 
  To check syntax only
❯ To check syntax and find problems
  To check syntax, find problems, and enforce code style
? What type of modules does your project use? … 
❯ JavaScript modules (import/export)
  CommonJS (require/exports)
  None of these
? Which framework does your project use? … 
❯ React
  Vue.js
  None of these
? Does your project use TypeScript? › Yes
? Where does your code run? …  (Press <space> to select, <a> to toggle all, <i> to invert selection)
✔ Browser
✔ Node
? What format do you want your config file to be in? … 
❯ JavaScript
  YAML
  JSON
Local ESLint installation not found.
The config that you've selected requires the following dependencies:

eslint-plugin-react@latest @typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest eslint@latest
? Would you like to install them now? › Yes
? Which package manager do you want to use? … 
❯ npm
  yarn
  pnpm
```

パッケージのインストールが完了したら、`.eslintrc.js` ファイルが生成されています。デフォルトの設定に加えて [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks) を導入することをおすすめします。このプラグインは [React の Hooks のルール](https://reactjs.org/docs/hooks-rules.html) に沿っているかどうか確認してくれます。

```sh
npm install eslint-plugin-react-hooks --save-dev
```

`.eslintrc.js` ファイルを修正してこのプラグインを使用するようにします。

```js
{
  "extends": [
    // ...
    "plugin:react-hooks/recommended"
  ]
}
```

AngularJS・Jasmine を使用しているので、グローバル変数に対して警告が出てしまいます。以下の設定を追加しましょう。

```diff
  "env": {
    "browser": true,
    "es2021": true,
    "node": true,
+   "jasmine": true
  },
+ "globals": {
+   "angular": true,
+   "module": true,
+   "inject": true
+ },
```

また現状のルールですとリントを成功させることができないので、少しルールを緩和します。

```js
"rules": {
  "@typescript-eslint/no-this-alias": "off",
},
```

続けて Prittier のパッケージをインストールします。

```sh
npm i --save-dev prettier eslint-config-prettier
```

インストール後、`eslintrc.js` ファイルの `extended` に `"prettier"` を追加します。

```js diff
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
+   "prettier"
  ],
```

`.prettierrc` ファイルを作成して、Prittier の設定を行いましょう。

```json
{
  "semi": true,
  "tabWidth": 2,
  "printWidth": 100,
  "singleQuote": true,
  "trailingComma": "none",
  "jsxBracketSameLine": true
}
```

最後に、`package.json` にリントコマンドを追加しましょう。

```json
"scripts": {
  "lint": "eslint app --ext .js,jsx,.ts,.tsx",
  "lint:fix": "eslint app --ext .js,jsx,.ts,.tsx --fix",
  "format": "prettier --write --ignore-path .gitignore './**/*.{js,jsx,ts,tsx}'"
}
```

最後にリントとフォーマットを実行して既存のコードのフォーマットを修正しましょう。

```sh
npm run lint:fix
npm run format
```

前回と同じく E2E テストを実行して誤って何かを壊していないか確認しましょう。

```sh
npm run 2e2
```

ここまでのコミットは以下のとおりです。

https://github.com/azukiazusa1/angular-phonecat/commit/de1ccb60a32dc0d182368d351efefa807d6f6bd6

## React の導入

いよいよ React を導入します。react と関連するパッケージをインストールします。

```sh
npm install --save react2angular react@17.0.1 react-dom@17.0.2
```

[react2angular](https://github.com/coatue-oss/react2angular) というライブラリを使用することで React のコンポーネントを AngularJS のコンポーネントに変換して画面に埋め込むことができます。そのため、React への以降を段階的に進めていくことができます。

### PhoneItmes コンポーネントの作成

まずは始めに、電話一覧の部分を React コンポーネントへ変換してみましょう。

![スクリーンショット 2022-07-30 15.22.09](//images.ctfassets.net/in6v9lxmm5c8/3eD49NDQl4yCbMpdlPbEIY/150085b442180e1d115dc0c529adb2c4/____________________________2022-07-30_15.22.09.png)

ソースコードでは以下の部分となります。

```html
<ul class="phones">
  <li ng-repeat="phone in $ctrl.phones | filter:$ctrl.query | orderBy:$ctrl.orderProp"
      class="thumbnail phone-list-item">
    <a href="#!/phones/{{phone.id}}" class="thumb">
      <img ng-src="{{phone.imageUrl}}" alt="{{phone.name}}" />
    </a>
    <a href="#!/phones/{{phone.id}}">{{phone.name}}</a>
    <p>{{phone.snippet}}</p>
  </li>
</ul>
```

始めに `Phone` の型定義を作成しましょう。`app/phone-list/types.ts` ファイルを作成します。

```ts
export type Phone = {
  age: number;
  id: string;
  imageUrl: string;
  name: string;
  snippet: string;
};
```

`app/phone-list/PhoneItems.tsx` ファイルを作成して React コンポーネントを実装します。

```tsx
import angular from 'angular';
import React from 'react';
import { react2angular } from 'react2angular';
import { Phone } from './types';

type Props = {
  phones: Phone[];
  query?: string;
  orderProp: 'name' | 'age';
};

const PhoneItems: React.FC<Props> = ({ phones, query, orderProp }) => {
  const filteredPhones = phones.filter((phone) => {
    if (!query) {
      return true;
    }
    return Object.values(phone).some((value) => {
      return String(value).toLowerCase().includes(query.toLowerCase());
    });
  });
  const sortedPhones = filteredPhones.sort((a, b) => {
    if (a[orderProp] < b[orderProp]) {
      return -1;
    }
    if (a[orderProp] > b[orderProp]) {
      return 1;
    }
    return 0;
  });

  return (
    <ul className="phones">
      {sortedPhones.map((phone) => (
        <li key={phone.id} className="thumbnail phone-list-item">
          <a href={`#!/phones/${phone.id}`} className="thumb">
            <img src={phone.imageUrl} alt={phone.name} />
          </a>
          <a href={`#!/phones/${phone.id}`}>{phone.name}</a>
          <p>{phone.snippet}</p>
        </li>
      ))}
    </ul>
  );
};

export default PhoneItems;

angular
  .module('phoneList')
  .component('phoneItems', react2angular(PhoneItems, ['phones', 'query', 'orderProp']));
```

`Props` で React コンポーネントの props の型を定義します。`react2Angular` を利用することで AngularJS の bindings を props として受け取ることができます。

`filteredPhones` では AngularJS の [filter](https://docs.angularjs.org/api/ng/filter/filter) フィルター（`| filter:$ctrl.query`）の挙動を再現しています。`filter` フィルターは配列内のオブジェクトを部分一致検索し、合致するものを返します。

`sortedPhones` は AngularJS の [orderBy](https://docs.angularjs.org/api/ng/filter/orderBy) フィルター（`| orderBy:$ctrl.orderProp"`）の再現です。`orderBy` フィルターは配列の内容を指定されたプロパティをキーにソートします。

レンダリング部分では以下の修正が必要です。

- `ng-repeat` でリストレンダリングする代わり `sortedPhones.map()` 
- `ng-src` → `src`
- `class` → `className`
- 変数の展開 `{{ }}` → `{}`

特に、`class` から `className` の変換は頻出するので [converter](https://transform.tools/html-to-jsx) を利用して機械的に行うのが良いでしょう。

作成した React コンポーネントは `react2angular` で AngularJS のコンポーネントに変換して登録します。渡す予定の Props は第 2 引数で明示する必要があります。

```ts
angular
  .module('phoneList')
  .component('phoneItems', react2angular(PhoneItems, ['phones', 'query', 'orderProp']));
```

`main.ts` で作成したファイルをインポートして、作成した React コンポーネントを使用できるようにします。

```ts
import './phone-list/PhoneItems';
```

`phone-list.template.html` を修正して、もとのコードの代わりに React コンポーネントを使うように修正しましょう。

```html diff
- <ul class="phones">
-   <li ng-repeat="phone in $ctrl.phones | filter:$ctrl.query | orderBy:$ctrl.orderProp"
-     class="thumbnail phone-list-item">
-     <a href="#!/phones/{{phone.id}}" class="thumb">
-       <img ng-src="{{phone.imageUrl}}" alt="{{phone.name}}" />
-     </a>
-     <a href="#!/phones/{{phone.id}}">{{phone.name}}</a>
-     <p>{{phone.snippet}}</p>
-   </li>
- </ul>
+ <phone-items phones="$ctrl.phones" query="$ctrl.query" order-prop="$ctrl.orderProp"></phone-items>
```

さらにもう一点、`app/phone-list/phone-list-component` も修正する必要があります。

```js
  'use strict';
  import template from './phone-list.template.html';

  // Register `phoneList` component, along with its associated controller and template
  angular.module('phoneList').component('phoneList', {
    template,
    controller: [
      'Phone',
      function PhoneListController(Phone) {
-       this.phones = Phone.query()
+        this.phones = [];
+        Phone.query().$promise.then((phones) => {
+          this.phones = phones;
+        });
        this.orderProp = 'age';
      }
    ]
  });
```

`this.phoens = Phone.query()` は[$resource サービス](https://docs.angularjs.org/api/ngResource/service/$resource) を使用しているのですが、`resouce` オブジェクトの各メソッド（`query`, `get`）は変数に空の参照を返し、サーバーから応答を得たタイミングで参照先に実データが格納されるという実装となっています。

サーバーからデータ取得後も参照は変わらないため、React で変更を検知できません。そのため、データ取得後は新しいオブジェクトを再代入する方法に修正しています。

ここまで完了したら、開発サーバーで確認してみましょう。一見問題ないように見えますが、アニメーションが行われなくなってしまっています。

![phone-list-no-animation](//images.ctfassets.net/in6v9lxmm5c8/4GvoQ1tI3pvGcE0M7YAvOt/d059b016ad7f56dabca007ce686e27dd/phone-list-no-animation.gif)

### アニメーションの実装

これは、AngularJS から React コンポーネントに変換したことにより [ngAnimate](https://docs.angularjs.org/api/ngAnimate) モジュールによるアニメーションが有効でなくなってしまったためです。アニメーションを再現するために [react-transition-group](https://reactcommunity.org/react-transition-group/p) を使用します。このライブラリは `ngAnimate` ライブラリに影響を受けているので、移行がしやすいです。

```sh
npm install react-transition-group
npm i --save-dev @types/react-transition-group
```

`app/phone-list/PhoneItem.tsx` を以下のように修正します。

```tsx
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const PhoneItems: React.FC<Props> = ({ phones, query, orderProp }) => {
return (
    <TransitionGroup component="ul" className="phones">
      {sortedPhones.map((phone) => (
        <CSSTransition
          key={phone.id}
          timeout={500}
          classNames={{
            appear: 'ng-appear',
            appearActive: 'ng-appear-active',
            appearDone: 'ng-appear-done',
            enter: 'ng-enter',
            enterActive: 'ng-enter-active',
            enterDone: 'ng-enter-done',
            exit: 'ng-leave',
            exitActive: 'ng-leave-active',
            exitDone: 'ng-leave-done'
          }}>
          <li className="thumbnail phone-list-item">
            <a href={`#!/phones/${phone.id}`} className="thumb">
              <img src={phone.imageUrl} alt={phone.name} />
            </a>
            <a href={`#!/phones/${phone.id}`}>{phone.name}</a>
            <p>{phone.snippet}</p>
          </li>
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
}
```

`<ul>` タグの代わりに [TransitionGroup](http://reactcommunity.org/react-transition-group/transition-group) を使うように変更しています。`<TransitionGroup>` は `<Transition>` や `<CSSTransition>` のようなトランジショングループのリストを管理し、リストのアイテムの追加や削除によりトランジションが発生するようにします。

リストアイテム内では [CSSTransiton](http://reactcommunity.org/react-transition-group/css-transition) を使用しています。このコンポーネントは `ng-animate` と同様にクラスを付与することで CSS トランジションでアニメーションを制御します。

また `classNames` プロパティにより `ng-animate` と同様のクラス名が付与されるようにしています。

```js
classNames={{
  appear: 'ng-appear',
  appearActive: 'ng-appear-active',
  appearDone: 'ng-appear-done',
  enter: 'ng-enter',
  enterActive: 'ng-enter-active',
  enterDone: 'ng-enter-done',
  exit: 'ng-leave',
  exitActive: 'ng-leave-active',
  exitDone: 'ng-leave-done'
}}>
```

再度開発サーバーで確認してみましょう。今度は適切にアニメーションが付与されているはずです。

![phone-list-animation](//images.ctfassets.net/in6v9lxmm5c8/5xua4ClnjWP2NbmlKEy0jv/52c1d89d642db7fa75987f247bf48920/phone-list-animation.gif)

しかしながら、要素の並べ替えを行った際のアニメーションが適用されておりません。`ng-animate` ではリストのアイテムの位置が変わるときに `ng-move` クラスが付与されていたのですが、 `TransitionGroup` ではそのようなクラスが提供されていないためです。

並べ替えのアニメーションを適用するために [react-flip-toolkit](https://www.npmjs.com/package/react-flip-toolkit) と呼ばれるライブラリを使用します。[FLIP](https://aerotwist.com/blog/flip-your-animations/) とは、First、Last、Invert、Play の頭文字からなる造語で、複雑なアニメーションをスムーズに実行する手順のことです。

```sh
npm i react-flip-toolkit
```

まずはすべてのアニメーション対象の要素を `<Flipper>` コンポーネントでラップします。`<Flipper>` コンポーネントは `flipKey` prop を受け取り、このキーの値が変更されるたびにアニメーションが発生します。ここでは、`orderProp` をキーに指定して、並び順対象のプロパティが変更されるたびにアニメーションが発生するようにします。

次にアニメーションされるべき要素を `<Flipped>` コンポーネントでラップしますこのコンポーネントは一意となる `flipId` prop を受け取ります。

```tsx
import { Flipper, Flipped } from 'react-flip-toolkit';

const PhoneItems: React.FC<Props> = ({ phones, query, orderProp }) => {

  return (
    <Flipper flipKey={orderProp}>
      <TransitionGroup component="ul" className="phones">
        {sortedPhones.map((phone) => (
          <CSSTransition
            key={phone.id}
            timeout={500}
            classNames={{
              appear: 'ng-appear',
              appearActive: 'ng-appear-active',
              appearDone: 'ng-appear-done',
              enter: 'ng-enter',
              enterActive: 'ng-enter-active',
              enterDone: 'ng-enter-done',
              exit: 'ng-leave',
              exitActive: 'ng-leave-active',
              exitDone: 'ng-leave-done'
            }}>
            <Flipped flipId={phone.id}>
              <li className="thumbnail phone-list-item">
                <a href={`#!/phones/${phone.id}`} className="thumb">
                  <img src={phone.imageUrl} alt={phone.name} />
                </a>
                <a href={`#!/phones/${phone.id}`}>{phone.name}</a>
                <p>{phone.snippet}</p>
              </li>
            </Flipped>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </Flipper>
  );
}
```

これで、並べ替え時のアニメーションも適用されるようになりました。確認してみましょう。

![phone-list-reorder-animation](//images.ctfassets.net/in6v9lxmm5c8/4ze4mdSAB4xyyNBArzYkuz/4e4bd9055a4a555d812570dedd80832c/phone-list-reorder-animation.gif)

いいですね！いつもどおり、E2E テストを実行しておきましょう。

```sh
npm run 2e2
```

ここまでのコミットログは以下のとおりです。

https://github.com/azukiazusa1/angular-phonecat/commit/53f2d403c38f9a8e880c1ab69790d9464f3a2f4e

## コンポーネントのテスト

新たに作成した React コンポーネントについてもテストコードを実装するようにしましょう。

### Jset のセットアップ

コンポーネントのテストには [Jest](https://jestjs.io/) と [Testing Library](https://testing-library.com/) を使用します。React コンポーネントをテストするためのライブラリをインストールします。

```sh
npm install --save-dev jest @types/jest ts-jest babel-jest @testing-library/react@12 @testing-library/user-event@12 testing-library/jest-dom jest-environment-jsdom
```

`jest.config.js` ファイルを作成して Jest の設定を記述します。

```js
module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  testPathIgnorePatterns: ['/node_modules/', '/tests/'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|html)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js'
  },
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js']
};
```

- `testEnviroment`：jest の実行環境を指定します。
- `transform`：jest の実行時に babel や TypeScript でコードを変換します。
- `tesetPathIgnorePatterns`：テストの実行を除外するディレクトリを指定します。`/tests/` は E2E テストのためのディレクトリなので除外しています。
- `moduleNameMapper`：CSS やその他静的アセットファイルを jest で import できないのでモックします。[静的アセットの管理](https://jestjs.io/ja/docs/webpack#%E9%9D%99%E7%9A%84%E3%82%A2%E3%82%BB%E3%83%83%E3%83%88%E3%81%AE%E7%AE%A1%E7%90%86)
- `setupFilesAfterEnv`：テスト実行前のセットアップに必要な記述を行ったファイルのパスを指定します。

`moduleNameMapper` で指定したモックファイルも作成しましょう。

```js
// __mocks__/styleMock.js
module.exports = {}
```

```js
// __mocks__/fileMock.js
module.exports = 'test-file-stub';
```

続いて `setupFilesAfterEnv` で指定した、テスト実行前のセットアップの記述を行ったファイルです。

```js
// jest.setup.js
import '@testing-library/jest-dom';

global.jasmine = true;
```

ここでは、DOM テストのために便利なカスタムマッチャーである [testing-libary/jest-dom](https://github.com/testing-library/jest-dom) をインポートしています。

もう 1 つ、`global.jasmine = true;` という記述は見慣れないほうも多いでしょう。これは `angular-mocks` を使用するために必要な記述です。`angular-mocks` の実装では、以下のように `Jasmine` または `Mocha` がフレームワークに使われている場合のみに必要なロジックを読み込むようになっています。

```js
(function(jasmineOrMocha) {

  if (!jasmineOrMocha) {
    return;
  }

...

})(window.jasmine || window.mocha);
```

この問題を解決するために、`global.jasmine = true` の記述を入れています。

https://dev.to/elpddev/using-jest-with-angularjs-4lcm

最後に、`package.json` のテストコマンドで `jest` を利用するように修正しましょう。

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
  }
}
```

### 既存のテストコードを修正する

既存の単体テストコードでは [Jasmine](https://jasmine.github.io/) と [Karma](https://karma-runner.github.io/latest/index.html) を使用されていますので、これを Jest で動くように修正しましょう。Jasmine の API（`describe`,`it`）は Jest とよく似ているので、大きな修正は必要ありません。

まずは、`app/core/checkmark/checkmark.filter.spec.js` を修正します。修正する箇所は 2 つです。

1 つ目は、`karma.conf.js` 依存ファイルをまとめて読み込んでいたのを各ファイルで `import` するように修正します。

```js diff
- 'use strict';
+ import 'angular';
+ import 'angular-resource';
+ import 'angular-mocks';

+ import '../core.module';
+ import '../phone/phone.module';
+ import './checkmark.filter';
```

2 つ目の修正では、AngularJS のモジュールをモックするための記述を `module('core')` から `angular.mock.module('core')` に修正します。

```js diff
  describe('checkmark', function () {
-   beforeEach(module('core'));
+   beroreEach(angular.mock.module('core'));
```

ここまで修正したらテストを実行して確認してみましょう。

```sh
npm run test checkmark
```

テストが PASS していれば問題ないはずです。

```sh
 PASS  app/core/checkmark/checkmark.filter.spec.js
  checkmark
    ✓ should convert boolean values to unicode checkmark or cross (16 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.982 s
Ran all test suites matching /checkmark/i.
```

この調子で `app/core/phone/phone.service.spec.js` も修正していきましょう。依存ファイルを import するのと、`angular.mock.module()` に修正するのは共通です。

```js diff
- 'use strict';
+ import 'angular';
+ import 'angular-resource';
+ import 'angular-mocks';

+ import '../phone/phone.module';
+ import './phone.service';

  describe('Phone', function () {
    var $httpBackend;
    var Phone;
    var phonesData = [{ name: 'Phone X' }, { name: 'Phone Y' }, { name: 'Phone Z' }];

    // Load the module that contains the `Phone` service before each test
-   beforeEach(module('core.phone'));
+   beforeEach(angular.mock.module('core.phone'));
```

さらにもう一点修正が必要な箇所があります。`jasmine.addCustomEqualityTester(angular.equals)` のように Jasmine のカスタムマッチャーを定義している箇所があるので、Jest のカスタムマッチャーを定義する記述に修正ます。

```js diff
  // Add a custom equality tester before each test
  beforeEach(function () {
-   jasmine.addCustomEqualityTester(angular.equals);
+   expect.extend({
+     toEqual: (actual, expected) => {
+       return {
+         pass: angular.equals(actual, expected),
+         message: `Expected ${actual} to equal ${expected}`
+       };
+     }
+    });
  })
```

テストが正しくとおるかどうか確認しましょう。

```sh
npm run test phone.service
```

最後に、`app/phone-list/phone-list.component.spec.js` の修正と `app/phone-detail/phone-detail.component.spec.js` の修正をまとめていってしまいましょう。ここまで出てきたことと同じ修正を行えば大丈夫です。

```js diff
  // app/phone-list/phone-list.component.spec.js
- 'use strict';

+ import 'angular';
+ import 'angular-resource';
+ import 'angular-route';
+ import 'angular-mocks';

+ import '../core/phone/phone.module';
+ import '../core/phone/phone.service';
+ import './phone-list.module';
+ import './phone-list.component';

  describe('phoneList', function () {
    // Load the module that contains the `phoneList` component before each test
-   beforeEach(module('phoneList'));
+   beforeEach(angular.mock.module('phoneList'));

    it('should create a `phones` property with 2 phones fetched with `$http`', function () {
-      jasmine.addCustomEqualityTester(angular.equals);
+      expect.extend({
+        toEqual: (actual, expected) => {
+          return {
+            pass: angular.equals(actual, expected),
+            message: `Expected ${actual} to equal ${expected}`
+          };
+        }
+       });
```

```js diff
  // app/phone-detail/phone-detail.component.spec.js
- 'use strict';

+ import 'angular';
+ import 'angular-resource';
+ import 'angular-route';
+ import 'angular-mocks';

+ import '../core/phone/phone.module';
+ import '../core/phone/phone.service';
+ import './phone-detail.module';
+ import './phone-detail.component';

  describe('phoneDetail', function () {
    // Load the module that contains the `phoneList` component before each test
-   beforeEach(module('phoneDetail'));
+   beforeEach(angular.mock.module('phoneDetail'));

    it('should fetch the phone details', function () {
-      jasmine.addCustomEqualityTester(angular.equals);
+      expect.extend({
+        toEqual: (actual, expected) => {
+          return {
+            pass: angular.equals(actual, expected),
+            message: `Expected ${actual} to equal ${expected}`
+          };
+        }
+       });
```

すべてのテストを実行して確認しましょう。

```sh
npm run test

 PASS  app/core/checkmark/checkmark.filter.spec.js
 PASS  app/phone-list/phone-list.component.spec.js
 PASS  app/core/phone/phone.service.spec.js
 PASS  app/phone-detail/phone-detail.component.spec.js

Test Suites: 4 passed, 4 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        4.355 s
Ran all test suites.
```

すべてのテストが PASS していれば、正しく Jest に移行できていますね！Jasmine、Karma 関連のパッケージやファイルは削除してしまってよいでしょう。

```sh
rm karma.conf.js

npm uninstall ---save-dev karma karma-chrome-launcher karma-firefox-launcher karma-jasmine jasmine-core
```

### PhoneItems コンポーネントのテスト

下準備も済みましたので、React のコンポーネントのテストを実装しましょう。正しくデータがフィルタリング、ソートされて描画されるかどうかをテストします。`app/phone-list/PhoneItems.spec.tsx` ファイルを作成しましょう。

```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import 'angular';
import '../phone-list/phone-list.module';
import PhoneItems from './PhoneItems';
import phones from '../phones/phones.json';

describe('PhoneItems', () => {
  it('should render phone items', () => {
    render(<PhoneItems phones={phones} orderProp="age" />);

    const phoneList = screen.getAllByRole('listitem');

    expect(phoneList).toHaveLength(20);
    expect(phoneList[0]).toHaveTextContent('Motorola XOOM™ with Wi-Fi');
  });

  it('should render phone items with query', () => {
    render(<PhoneItems phones={phones} query="motorola" orderProp="age" />);

    expect(screen.getAllByRole('listitem')).toHaveLength(8);
  });

  it('should render phone items with query and orderProp', () => {
    render(<PhoneItems phones={phones} query="motorola" orderProp="name" />);

    const phoneList = screen.getAllByRole('listitem');

    expect(phoneList).toHaveLength(8);
    expect(phoneList[0]).toHaveTextContent('DROID™ 2 Global by Motorola');
  });
});
```

`app/phone-list/PhoneItems.tsx` ファイル内では AngularJS もモジュールにコンポーネントを登録しているので、`angular` と `../phone-list/phone-list.module` を import する必要があることに注意してください。

1 つ目のテストは `query` prop が存在しない場合（=フィルタリングされない場合）すべてのアイテムが描画されることを検証しています。`@testing-library/react` の `render` 関数によりコンポーネントが描画されます。要素を取得するために `screen.getAllByRole('listitem')` を使用しています。Testing Library はこのようにユーザー目線のロールやラベルを使用して要素を取得するのが特徴です。

クエリを指定していないのでリストアイテムの要素数は 20、並び順は「age」なので最初の要素は「Motorola XOOM™ with Wi-Fi」であるはずです。

2 つ目のテストでは `query` props として「motorola」を渡して正しくフィルタリングされるかどうかを検証しています。

3 つ目のテストは `orderProp` に「name」を渡して並び順がアルファベット順となっているかどうかを検証します。

それではテストを実行してみましょう。

```sh
npm run test
 PASS  app/core/phone/phone.service.spec.js
 PASS  app/phone-list/phone-list.component.spec.js
 PASS  app/core/checkmark/checkmark.filter.spec.js
 PASS  app/phone-detail/phone-detail.component.spec.js
 PASS  app/phone-list/PhoneItems.spec.tsx (8.924 s)

Test Suites: 5 passed, 5 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        10.809 s
Ran all test suites.
```

問題なくテストが PASS していますね！アプリケーションのコードは変更していないですが、念のため E2E テストも実行しておくと安全です。

```sh
npm run e2e
```

ここまでのコミットは以下のとおりです。

https://github.com/azukiazusa1/angular-phonecat/commit/5581eb4329bedd4b949bd580ba80becb53a88581

## 電話一覧画面を React コンポーネントにする

それでは、電話一覧画面を React コンポーネントに移行しましょう。AngularJS の `$resource` は引き続き利用するので、型定義ファイルをインストールしておきます。

```sh
npm install --save @types/angular-resource
```

### PhoneList コンポーネントの作成

`app/phone-list/PhoneList.tsx` ファイルを作成します。

```ts
import angular from 'angular';
import React, { useEffect, useState } from 'react';
import { react2angular } from 'react2angular';
import PhoneItems from './PhoneItems';
import { Phone } from './types';

type Props = {
  Phone: ng.resource.IResourceClass<Phone>;
};

const PhoneList: React.FC<Props> = ({ Phone }) => {
  const [phones, setPhones] = useState<Phone[]>([]);
  const [query, setQuery] = useState('');
  const [orderProp, setOrderProp] = useState<'name' | 'age'>('name');
  useEffect(() => {
    Phone.query().$promise.then((result) => {
      setPhones(result);
    });
  }, [Phone, setPhones]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <p>
            Search: <input value={query} onChange={(e) => setQuery(e.target.value)} />
          </p>

          <p>
            Sort by:{' '}
            <select
              value={orderProp}
              onChange={(e) => setOrderProp(e.target.value as 'name' | 'age')}>
              <option value="name">Alphabetical</option>
              <option value="age">Newest</option>
            </select>
          </p>
        </div>
        <div className="col-md-10">
          <PhoneItems phones={phones} query={query} orderProp={orderProp} />
        </div>
      </div>
    </div>
  );
};

export default PhoneList;

angular.module('phoneList').component('phoneList', react2angular(PhoneList, [], ['Phone']));
```

まずは、Props の型として `Phone` を定義しています。`Phone` は `phone-list.component.js` でコントローラーに DI されていた AngularJS の Resource クラスです。後ほど出てきますが、`react2angular` では AngularJS のサービスなどを簡単に引き渡すことができます。

```ts
type Props = {
  Phone: ng.resource.IResourceClass<Phone>;
};
```

続いて `Phone` resource を利用して API からデータを取得します。コントローラー内で `this.hoge` に代入していたデータは `useState` に置き換えることになります。

```ts
const [phones, setPhones] = useState<Phone[]>([]);

useEffect(() => {
  let igonre = false;
  Phone.query().$promise.then((result) => {
    if (!igonre) {
      setPhones(result);
    }
  });

  return () => {
    igonre = true;
  };
}, [Phone, setPhones]);
```

フォーム入力では、`ng-model` による双方向バインディングを `useState` に置き換えます。

```tsx
const [query, setQuery] = useState('');
const [orderProp, setOrderProp] = useState<'name' | 'age'>('age');

return (
        <p>
          Search: <input value={query} onChange={(e) => setQuery(e.target.value)} />
        </p>

        <p>
          Sort by:{' '}
          <select
            value={orderProp}
            onChange={(e) => setOrderProp(e.target.value as 'name' | 'age')}>
            <option value="name">Alphabetical</option>
            <option value="age">Newest</option>
          </select>
        </p>
```

`<PhoneItems />` コンポーネントは React の中ですので、いつもどおり使用できますね。

```html
<PhoneItems phones={phones} query={query} orderProp={orderProp} />
```

最後に `angular2react` でコンポーネントを AngularJS のコンポーネントに変換します。Props のところで述べたとおり、`angular2react` では第 3 引数に AngularJS のサービス名を指定することで、Dependency Injection を行え、React では props として受け取ることができます。

```ts
angular.module('phoneList').component('phoneList', react2angular(PhoneList, [], ['Phone']));
```

`main.ts` で作成したコンポーネントを読み込むように修正します。`./phone-list/phone-list.component` と `./phone-list/PhoneItems` はもう必要ないので削除してしまいましょう。

```ts
- import './phone-list/phone-list.component';
- import './phone-list/PhoneItems';
+ import './phone-list/PhoneList';
```

不要となるファイルも削除します。

```sh
rm app/phone-list/phone-list.compoment.js
rm app/phone-list/phone-list.compoment.spec.js
rm app/phone-list/phone-list.template.html
```

`app/app.config.js` で `<phone-list>` コンポーネントが使用されています。AngularJS のコンポーネントと同じ名前で作成したので、ここは修正する必要はありません。開発サーバーで確認してみましょう。問題がなけらば、前と変わらないことが確認できるはずです。

![スクリーンショット 2022-07-31 20.43.04](//images.ctfassets.net/in6v9lxmm5c8/6osJRVGYUqxZIXpNuSu8VM/3d9d3cf0353b55660d4db4dfaf080fe7/____________________________2022-07-31_20.43.04.png)

E2E テストでも確認してみましょう。

```sh
npm run e2e
```

### PhoneList コンポーネントのテスト

コンポーネントのテストも作成していきましょう。AngularJS の PhoneList コンポーネントのテストである `app/phone-list/phone.list.component.spec.js` ではバックエンドの API をモックするために `$httpBackend` を使用していました。`PhoneList` コンポーネントでは Phone resource を注入しているので同様の方法でバックエンドをモックします。

`app/phone-list/phoneList.spec.tsx` ファイルを作成します。

```ts
import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import angular from 'angular';
import 'angular-resource';
import 'angular-mocks';
import '../phone-list/phone-list.module';
import '../core/phone/phone.module';
import PhoneList from './PhoneList';
import phones from '../phones/phones.json';
import { Phone } from './types';

describe('PhoneList', () => {
  let Phone: ng.resource.IResourceClass<Phone>;
  let $httpBackend: ng.IHttpBackendService;

  beforeEach(() => {
    angular.mock.module('phoneList');
    angular.mock.inject(($resource, _$httpBackend_) => {
      Phone = $resource(
        'phones/:phoneId.json',
        {},
        {
          query: {
            method: 'GET',
            params: { phoneId: 'phones' },
            isArray: true
          }
        }
      );

      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('phones/phones.json').respond(phones);
    });
  });

  it('should render phone items', async () => {
    render(<PhoneList Phone={Phone} />);

    act(() => {
      $httpBackend.flush();
    });
    const phoneList = await screen.findAllByRole('listitem');
    expect(phoneList).toHaveLength(20);
    expect(phoneList[0]).toHaveTextContent('Motorola XOOM™ with Wi-Fi');
  });

  it('should filter phone items', async () => {
    render(<PhoneList Phone={Phone} />);

    act(() => {
      $httpBackend.flush();
    });
    const input = screen.getByRole('textbox');
    userEvent.type(input, 'motorola');
    await waitFor(() => {
      expect(screen.getAllByRole('listitem')).toHaveLength(8);
    });
  });

  it('should sort phone items', async () => {
    render(<PhoneList Phone={Phone} />);

    act(() => {
      $httpBackend.flush();
    });
    expect((await screen.findAllByRole('listitem'))[0]).toHaveTextContent(
      'Motorola XOOM™ with Wi-Fi'
    );

    const select = screen.getByRole('combobox');
    userEvent.selectOptions(select, 'name');
    await waitFor(() => {
      expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('DROID™ 2 Global by Motorola');
    });
  });
});
```

`PhhoneList` コンポーネントは props として Phone resource を渡す必要があるので、`anguar-mocks` を利用し beforeEach 内で作成しています。API をモックするために `$httpBackend` も用意しています。

`$httpBackend.expectGET` メソッドで `phones/phones.json` パスに対する GET リクエストを待ち受けます。`.respond` メソッドでは返却する値を指定します。

```ts
describe('PhoneList', () => {
  let Phone: ng.resource.IResourceClass<Phone>;
  let $httpBackend: ng.IHttpBackendService;

  beforeEach(() => {
    angular.mock.module('phoneList');
    angular.mock.inject(($resource, _$httpBackend_) => {
      Phone = $resource(
        'phones/:phoneId.json',
        {},
        {
          query: {
            method: 'GET',
            params: { phoneId: 'phones' },
            isArray: true
          }
        }
      );

      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('phones/phones.json').respond(phones);
    });
  });
```

1 つ目のテストでは電話一覧を正常に取得でき、並べ替えの初期値が「新しい順」であることを検証しています。もともとのテストでは ` expect(ctrl.phones).toEqual([{ name: 'Nexus S' }, { name: 'Motorola DROID' }])` や `expect(ctrl.orderProp).toBe('age')` のようにコントローラー内に変数を直接参照して検証していました。

しかし、このように実装の詳細をテストするのは好ましくありません。例えば、内部の構造をリファクタリングして、外部の仕様が変更されていないに場合でもテストが fail していまうため、壊れやすテストとなってしまいます。ソートの値にどのような値を設定した結果、どのように描画されるかのように、外部から見た振る舞いをテストすると壊れにくいテストコードになります。

```ts
  it('should render phone items', async () => {
    render(<PhoneList Phone={Phone} />);

    act(() => {
      $httpBackend.flush();
    });
    const phoneList = await screen.findAllByRole('listitem');
    expect(phoneList).toHaveLength(20);
    expect(phoneList[0]).toHaveTextContent('Motorola XOOM™ with Wi-Fi');
  });
```

`$httpBackend` でモックしたレスポンスを返却するためには `$httpBackend.flush()` メソッドを呼び出します。また描画内容を更新する関数を呼び出す場合には、`act` でラッピングします。

2 つ目のテストはサーチボックスにテキストを入力したとき要素がフィルタリングされるかどうかを検証します。フォームの入力や、クリックなどのイベントを発生させる場合には `@testing-library/user-event` を使用します。このパッケージは、よりユーザーの実際の操作に近い書き方でイベントを発生させることができます。

`userEvent.type` でサーチボックスに「motorola」と入力した後、`waitFor` で `expect` をラップして、期待した描画の更新があるまで待機する必要があります。

```ts
  it('should filter phone items', async () => {
    render(<PhoneList Phone={Phone} />);

    act(() => {
      $httpBackend.flush();
    });
    const input = screen.getByRole('textbox');
    userEvent.type(input, 'motorola');
    await waitFor(() => {
      expect(screen.getAllByRole('listitem')).toHaveLength(8);
    });
  });
```

最後 3 爪のテストは、セレクトボックスを操作して並べ替えされるかテストしています。セレクトボックスの操作は `userEvent.selectOptions` を呼び出します。

```ts
  it('should sort phone items', async () => {
    render(<PhoneList Phone={Phone} />);

    act(() => {
      $httpBackend.flush();
    });
    expect((await screen.findAllByRole('listitem'))[0]).toHaveTextContent(
      'Motorola XOOM™ with Wi-Fi'
    );

    const select = screen.getByRole('combobox');
    userEvent.selectOptions(select, 'name');
    await waitFor(() => {
      expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('DROID™ 2 Global by Motorola');
    });
  });
```

ここまでのコミットログは以下のとおりです。

https://github.com/azukiazusa1/angular-phonecat/commit/b8ba2be4f1c7dadd65265b89c5fc6398b50ea815
