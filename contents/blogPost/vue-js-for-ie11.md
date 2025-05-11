---
id: 1NbuJVgzRuXUHUIfJaylv3
title: "Vue.jsでIE11対応"
slug: "vue-js-for-ie11"
about: "人生でときにはIE11に対応させなければいけない時があるでしょう。Vue.jsでIE11に対応しなけらばいけなくなったときに読むものを記載しておきます。"
createdAt: "2021-04-18T00:00+09:00"
updatedAt: "2021-04-18T00:00+09:00"
tags: ["", "", "", "IE11"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/7dTaK0hk8bKcWr83rNUSEl/5d70107c16241398b941a7c05e035d9f/IE_symbol_Cyan_rgb.png"
  title: "ie11"
audio: null
selfAssessment: null
published: true
---
Vue CLI3 の使用を前提としています。

# browserslist

`package.json` の `browerlist` を修正します。

```json
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not dead",
    "ie 11"
  ]
```

`browserlist` とは、`Babel` や `Autoprefixer` などのツールがどのブラウザを対象にするか決定する設定です。複数のツールに対して開発対象ブラウザを共有できるのが特徴です。
`package.json` に記載する代わりに `.browserslistrc` ファイルを作成して記載することもできます。

- `> 1%`
  -  これは世界の使用状況統計で 1%より上のブラウザを対象とする設定。
- `last 2 versions`
  - `設定によって対象になったブラウザの 2 バージョン前までを対象とする設定。
- `not dead`
  - 24 ヶ月以内に公式のサポートがされていないブラウザを対象から外す設定。例えば、IE 10`など
- `ie 11`
  - このように特定のブラウザを対象とすることもできます。`> 1%` と `last 2 versions` で O`IE 11` は対象となるはずですが、念のため記載しておきます。

設定ファイルによって実際にどのブラウザが対象とされるのかを確認できます。

```sh
$ npx browserslist
and_chr 87
and_ff 83
and_qq 10.4
and_uc 12.12
android 81
baidu 7.12
chrome 87
chrome 86
edge 87
edge 86
firefox 84
firefox 83
firefox 82
ie 11
ios_saf 14.0-14.2
ios_saf 13.4-13.7
ios_saf 12.2-12.4
kaios 2.5
op_mini all
op_mob 59
opera 72
opera 71
safari 14
safari 13.1
samsung 13.0
samsung 12.0
```

すべての設定方法は公式の README から確認してください。

https://github.com/browserslist/browserslist

### 小ネタ 本当に1%のシェアのブラウザを対象とする必要があるの？

`browserlist` はデフォルトで `"> 1%", "last 2 versions","not dead"` と設定されているので大抵のブラウザで JavaScript を動作させることが可能です。

しかし、常にトランスパイル後のファイルサイズが増大するという欠点があります。
例えば、`async/await` を利用した簡単なコード例でも、上記の設定だとファイルサイズが大きく膨れ上がっていることがわかります。

- before
```js
const api = async () => {
  const res = await fetch('https://example.com')
  const data = await res.json()
  return data
}

console.log(api())
```

- after

```js
"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var api = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var res, data;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return fetch('https://example.com');

          case 2:
            res = _context.sent;
            _context.next = 5;
            return res.json();

          case 5:
            data = _context.sent;
            return _context.abrupt("return", data);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function api() {
    return _ref.apply(this, arguments);
  };
}();

console.log(api());
```

`async/await` 構文が利用できるのは、ES2017 からですが実は**95%**のブラウザではすでに対応済です。つまり、ほとんどのブラウザに対しても対応している構文であるにも関わらず、不要なトランスパイルによってファイルサイズを増大させてしまっているとも言えます。

実際に、対象ブラウザをシェア 98%から 95%にすることによって、**9%**パフォーマンスが改善したという結果が報告されている興味深い記事があります。

https://web.dev/publish-modern-javascript/

# babel.config.js

次に `babel.config.js` の設定を変更します。

```js
module.exports = {
  presets: [
    [
      '@vue/cli-plugin-babel/preset',
      {
        useBuitIns: 'entry',
        corejs: { version: 3 } 
      }
  ],
}
```

`"useBuiltIns": "entry"` の設定にすると、**すべてのpolyfill**を読み込むようになります。この場合、エントリーファイルの先頭で手動で polyfill を import する必要があります。
`main.{j,t}s` ファイルが実際の記述箇所となるでしょう。

- main.ts

```js
import "core-js/stable";
import "regenerator-runtime/runtime";
```

`@babel/polyfil` を import するように書いてある記事もありますが、これは Babel 7.4.0 から非推奨となっています。
`core-js` はさまざまな polifill を含んでいるライブラリです。`regenerator-runtime/runtime` では yield 構文、つまりは `async/await` をサポートします。

# vue.config.js

`vue.config.js` ファイルで `transpileDependencies` オプションを設定します。デフォルトでは Babel は `node_modules` 配下のファイルをトランスパイル対象に含みません。依存関係を明示的にトランスパイルするためには、このオプションのリストに追加する必要があります。

例えば、[Vuetiry](https://vuetifyjs.com/en/getting-started/browser-support/#vue-cli)を利用している場合には以下のように追加します。

- vue.config.js

```js
// vue.config.js

module.exports = {
  transpileDependencies: ['vuetify']
}
```

# AutoPrefixer

IE 11 を完全に攻略するためには JavaScript だけでなく CSS も気にかける必要があるでしょう。
例えば、[grid](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout)はとても強力な機能ですが、IE 11 には対応していません。

IE 11 で grid を適用させるためにはベンダープレフィックスを付与する必要がありますが、それを自動的に行なってくれるのが AutoPrefixer です。

https://github.com/postcss/autoprefixer

Vue CLI3 ではルートディレクトリに `postcss.config.js` か `.postcssrc` を設置すればよしなに読みこでくれます。

```sh
$ npm install --save-dev autoprefixer
```

- postcss.config.js

```js
module.exports = {
  plugins: {
    'autoprefixer': {
      grid: 'autoplace'
    },
  }
};
```

# IE 11に対応しているけど表示がおかしくなるCSS

表題のとおり、[position: absolte](https://stackoverflow.com/questions/30335052/absolute-positioning-error-in-internet-explorer-11)や[display: flex](https://qiita.com/hashrock/items/189db03021b0f565ae27)や[calc](https://anote.work/2978)など IE 11 で表示したときだけ表示が崩れる涙を流したくなるような現実があります。

これはもはやツールではどうしようもないので手動で確認しながら対応していく必要があります。辛い。

# 参考

[Is your Vue app not working in IE 11? Here’s how to fix it.](https://jacklyons.me/how-to-fix-vuejs-not-working-in-ie11/)
[Babel7.4で非推奨になったbabel/polyfillの代替手段と設定方法](https://aloerina01.github.io/blog/2019-06-21-1)
