---
id: 3DlJcuelhusvXM5Da2y8Z
title: "lodash-es lodash 違い"
slug: "lodash-es-lodash"
about: "[lodash-es](https://www.npmjs.com/package/lodash-es) とは [lodash](https://lodash.com/) を `ES module` 形式で提供しているライブラリです。"
createdAt: "2021-10-10T00:00+09:00"
updatedAt: "2021-10-10T00:00+09:00"
tags: ["JavaScript"]
published: true
---
# lodash-es?

[lodash-es](https://www.npmjs.com/package/lodash-es) とは [lodash](https://lodash.com/) を `ES module` 形式で提供しているライブラリです。

## lodash

念のために説明しておくと lodash とは JavaScript における便利な関数群を提供しているライブラリです。大抵の JavaScript のプロジェクトに導入されていたり、普段から JavaScript を使って開発されている方なら一度は使ったことがあるほどの超有名なライブラリです。

`Array#map` や　`Array#filter` など ES2015 以降では JavaScript の標準メソッドで事足りる関数も多いですが、それでもなお有用な関数が多く使えるのでまだまだ利用価値はあるでしょう。

よく使う関数群としては以下のようなものがあります。

- [cloneDeep](https://lodash.com/docs/4.17.15#cloneDeep)：オブジェクトの**深い* *コピーを返す
- [isEmpty](https://lodash.com/docs/4.17.15#isEmpty)：プロパティを持たないオブジェクトや空の配列も `falsy` として返す
- [debounce](https://lodash.com/docs/4.17.15#debounce)：最後に関数を呼び出してから指定したミリ秒だけ関数の呼び出しを遅延させる

## ES Module

`ES Module` とは ES2015 によって策定されたモジュール構文です。 JavaScript では歴史的にモジュールに関する構文がいくつか存在しており `ES Module` はその中の一つです。 `ES Module` は　`import/export` によりモジュール機能を提供しています。

他によく使われているモジュール構文としては `Commonjs` があります。　`Commonjs` は `require/module.export` によりモジュール機能を提供します。

他にもモジュール構文としては `AMD` や `RequireJS` や　`UMD` だったり色々乱立しているのですがこれは元来 JavaScript には標準のモジュール構文が存在していなかったことが原因です。現在では一般的には標準の仕様として策定されている `ES Module` がよく使われています。

そしてこの話をどこに着地させたいかといえば通常 lodash は `Commonjs` で書かれているので `require/module.export` が使われているのに対して lodash-es は `ES Module` で書かれているので `import/export` が使われているという違いがある、ということです。

参考までの `cloneDeep` のコードを比較してみましょう。

- lodash 版

```js
var baseClone = require('./_baseClone');

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_SYMBOLS_FLAG = 4;

/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */
function cloneDeep(value) {
  return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
}

module.exports = cloneDeep;
```

https://github.com/lodash/lodash/blob/4.17.21-npm/cloneDeep.js

- lodash-es 版

```javascript
import baseClone from './_baseClone.js';

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_SYMBOLS_FLAG = 4;

/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */
function cloneDeep(value) {
  return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
}

export default cloneDeep;
```

https://github.com/lodash/lodash/blob/4.17.21-es/cloneDeep.js

# ES Module で書かれていると何が嬉しいのか？

ここまででざっくりと lodash と lodash-es の違いを述べていたのですが、結局 `ES Module` で書かれているものを使用すると何が嬉しいのでしょう。

我々ライブラリの利用者にとっては通常どのような実装で書かれていようが提供される API が同じであれば何ら関係ないはずです。

その答えは `Tree Shaking` にあります。

## Tree Shaking

Tree Shaking とは、デッドコード（利用されていない不要なコード）を除去する機能のことです。通常 [webpack](https://webpack.js.org/guides/tree-shaking/) や [Rollup](https://rollupjs.org/guide/en/#tree-shaking) のようなモジュールバンドラによりファイルをバンドルされる際に使用されます。

Tree Shaking の目的はデッドコードを除去することによって最終的にバンドルされるファイルのサイズを削減することです。

ご存知の通り、ブラウザでページを表示させる際においては JavaScript や CSS などの外部ファイルサイズは小さけば小さいほどファイルの読み込みにかかる速度が改善しますので、一般的にパフォーマンスは向上します。なので通常モジュールバンドラなどはファイルを minify するなどファイルサイズの削減を図っています。

その　Tree Shaking と ES Module の関係なのですが、実は Webpack 等の比較的よく使われているモジュールバンドラは **Commonjs を tree Shaking** することができません。CommonJS は静的に解析することができない困難または不可能なためです。

だから、lodash を Tree Shaking するために `ES Module` で書かれた lodash-es を使う必要があったんですね。

# やってみる

それでは、 lodash と lodash-es を利用してそれぞれのバンドルファイルを比較してみましょう。モジュールバンドラは webpack を使います。

| ライブラリ   | バージョン | 
| ---------- |---------- |
| webpack       | 5.58.1 |
| webpack-cli       | 4.9.0 |
| lodash    | 4.17.21 |
| lodash-es       | 4.17.21 |

設定ファイルは普通です。

```js
// webpack.config.js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
};
```

まずは通常の lodash のバージョンです。

```js
import { isEmpty } from "lodash";

console.log(isEmpty([]));
```

```
npm run build

> webpack-demo@1.0.0 build webpack-demo
> webpack

asset main.js 69.4 KiB [emitted] [minimized] (name: main) 1 related asset
runtime modules 1010 bytes 5 modules
cacheable modules 531 KiB
  ./src/index.js 61 bytes [built] [code generated]
  ./node_modules/lodash/lodash.js 531 KiB [built] [code generated]
```

バンドルファイルのサイズは **69.4 Kib** とまずまずのサイズです。 import しているのは `isEmpty` 関数だけなのですが、適切に Tree Shaking がされていないため lodash のすべてのファイルを読み込んでしまった結果ですね。

続いて lodash-es 版です。

```js
import { isEmpty } from "lodash-es";

console.log(isEmpty([]));
```

```
$ npm run build

> webpack-demo@1.0.0 build /Users/asaiippei/webpack-demo
> webpack

asset main.js 4.26 KiB [emitted] [minimized] (name: main)
orphan modules 613 KiB [orphan] 640 modules
./src/index.js + 37 modules 24.3 KiB [built] [code generated]
```

バンドルファイルのサイズは **4.26 Kib** でした。確かにファイルサイズが削減されていることがわかります。

# 参考

- [JavaScript モジュール](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)
- [Tree Shaking | webpack](https://webpack.js.org/guides/tree-shaking/)
- [2018 年の tree shaking](https://www.kabuku.co.jp/developers/tree-shaking-in-2018)
- [webpackのTree Shakingを理解して不要なコードがバンドルされるのを防ぐ](https://qiita.com/soarflat/items/755bbbcd6eb81bd128c4)

