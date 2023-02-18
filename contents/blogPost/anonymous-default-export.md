---
id: 6kkmzviZdAiur4VRaHuvjV
title: "anonymous default export はやめたほうがいいかもね"
slug: "anonymous-default-export"
about: "`anonymous default export` とは名前の通り匿名でデフォルトエクスポートを宣言することです。必ず名前を付与しなければいけない名前付きエクスポートと異なり、以下はすべて有効な構文です。"
createdAt: "2022-03-20T00:00+09:00"
updatedAt: "2022-03-20T00:00+09:00"
tags: ["JavaScript"]
published: true
---
## anonymous default export?

`anonymous default export` とは名前の通り匿名でデフォルトエクスポートを宣言することです。必ず名前を付与しなければいけない名前付きエクスポートと異なり、以下はすべて有効な構文です。

```js
export default class {
  constructor(options) {
    this.options = options;
  }
}

export default function () { }

export default 1

export default { a: 1 }

export default [1, 2, 3]
```

名前付きエクスポートで名前を省略するとエラーとなります。

```js
// A class declaration without the 'default' modifier must have a name.
export class {
  constructor(options) {
    this.options = options;
  }
}
```

## anonymous default export は自動インポートが効かない

anonymous default export を使う最も重大な欠点はエディタにようる自動インポートが効かないことです。

たまに「名前付きエクスポート自動インポートでき、デフォルトエクスポートはできない」と思われていますがこれは誤りです。デフォルトエクスポートも名前を付けることで自動インポート可能です。

```js
// login.js
const login = () => {
  console.log("login");
};

export default login;
```

![auto import](//images.ctfassets.net/in6v9lxmm5c8/AoaLxbV9LV2gGXNjHNcLF/1d864a3a28cb09cc65b8524d636e3451/auto_import.gif)

このようにデフォルトエクスポートに名前を付けることは自動インポートを可能にして開発体験を向上させることができます。副次的な効果として、モジュールのインポート側とエクスポート側とでなるたけ同じ名前を使わせることができます。両者で同じ名前を使うことで、そのモジュールがどこで使われているのか検索(`grep`)しやすくなります。

ただし、名前付きエクスポートと異なりエクスポート側で関数の名前を変更してもコンパイルエラーを発生させることはできないので、エクスポート側で関数名を強制したいような場合には名前付きエクスポートを使うとよいでしょう。

## anonymous default export を禁止する

anonymous default export は Eslint の import plugin のルールの `no-anonymous-default-export` により使用を禁止することができます。

https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-anonymous-default-export.md

