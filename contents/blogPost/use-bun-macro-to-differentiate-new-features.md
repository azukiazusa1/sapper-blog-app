---
id: vST_alXnQzCmjNSLBXduK
title: "Bun のマクロを使ってフィーチャートグルを実装する"
slug: "use-bun-macro-to-differentiate-new-features"
about: "Bun にはマクロはビルド時に実行される関数です。関数が返す値がインラインにバンドルファイルに埋め込まれます。マクロには、実行してインライン化した後に、デッドコードを削除するという特徴があります。この機能を使ってフィーチャートグルを実装してみましょう。"
createdAt: "2023-09-14T20:50+09:00"
updatedAt: "2023-09-14T20:50+09:00"
tags: ["Bun"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/qiJn07vZLe0gRr3flFimZ/9f5b5256457aba8db75ccbb44348e6b3/food_nikuman_illust_1755.png"
  title: "ほかほかの肉まんのイラスト"
audio: null
selfAssessment: null
published: true
---
Bun には[マクロ](https://bun.sh/docs/bundler/macros)と呼ばれる機能があります。マクロはビルド時に実行される関数です。関数が返す値がインラインにバンドルファイルに埋め込まれます。

例として、ランダムな値を返す関数をマクロとして使用してみましょう。関数の定義は通常の関数と全く同じです。

```ts:random.ts
export const random = () => Math.random();
```

関数を使用する際に、[import attributes](https://github.com/tc39/proposal-import-attributes) を使用して、import する関数がマクロであることを指定します。

```ts:index.ts
import { random } from "./random" with { type: "macro" };

console.log(random());
```

このコードをビルドすると、`random` 関数を実行した結果がインラインに埋め込まれます。

```sh
bun build index.ts --outfile=dist/index.js
```

```js:dist/index.js
// index.ts
console.log(0.6952389499101538);
```

確かに、バンドル後のファイルには `random` 関数が存在しません。

## ユースケース

マクロの使い所を考えてみましょう。マクロは実行してインライン化した後に、デッドコードを削除するという特徴があります。この機能を使ってフィーチャートグルを実現ができます。フィーチャートグルとは、新機能をリリースする際に、新機能を有効にするかどうかを切り替えるフラグのことです。フィーチャートグルを利用することで、開発中の未完成の機能であっても、どんどんメインブランチにマージしていくことができます。

素朴に条件分岐で機能を出し分けると、新機能を有効にしない場合でも、新機能のコードがバンドルされてしまうので、バンドルサイズが大きくなってしまいます。マクロを使うことで、新機能を有効にしない場合は、新機能のコードがバンドルされないようにできます。

まずは、フィーチャートグルを実現するためのマクロを実装してみましょう。この実装は通常の関数の定義方法と何ら変わりません。

```ts:features.ts
import { aiSuggestion } from "./features.json"

export const isEnableAiSuggestion = () => aiSuggestion;
```

有効にする機能のフラグを定義するための JSON ファイルで用意されていることを想定しています。Bun では JSON ファイルを直接 import して JavaScript のオブジェクトとして扱うことができます。以下のような JSON ファイルを用意しておきましょう。

```json:features.json
{
  "aiSuggestion": false
}
```

次に、フィーチャートグルを利用する側のコードの実装です。`import` する際に、`type: "macro"` を指定して、マクロとして import します。

```ts:TitleInput.tsx
import { isEnableAiSuggestion } from "./features" with { type: "macro" };

export const TitleInput = () => {
  return (
    <div>
      <label>Title</label>
      <input type="text" />
      {isEnableAiSuggestion() && <button>AI Suggestion</button>}
    </div>
  );
};
```

このコードでは、`isEnableAiSuggestion` 関数が `true` を返す場合に、`<button>AI Suggestion</button>` がレンダリングされます。Bun で jsx をビルドする時、`tsconfig.json` または `jsconfig.json` の設定を読み取ります。`"jsx": "react"` と設定しておきましょう。

```json:tsconfig.json
{
  "compilerOptions": {
    "jsx": "react"
  }
}
```

それでは、ビルドしてみましょう。

```sh
bun build TitleInput.tsx --outfile=dist/TitleInput.js
```

ビルド後のファイルを見ると、確かに `<button>AI Suggestion</button>` が含まれていません。

```js:dist/TitleInput.js
// TitleInput.tsx
var TitleInput = () => {
  return React.createElement("div", null, React.createElement("label", null, "Title"), React.createElement("input", {
    type: "text"
  }), false);
};
export {
  TitleInput
};
```

`type: "macro"` の指定を取り除いてビルドした結果と比較すると、確かに結果が異なることがわかります。

```js:dist/TitleInput.js
// features.json
var aiSuggestion = false;

// features.ts
var isEnableAiSuggestion = () => aiSuggestion;

// TitleInput.tsx
var TitleInput = () => {
  return React.createElement("div", null, React.createElement("label", null, "Title"), React.createElement("input", {
    type: "text"
  }), isEnableAiSuggestion() && React.createElement("button", null, "AI Suggestion"));
};
export {
  TitleInput
};
```

## まとめ

- Bun のマクロはビルド時に実行される関数で、関数の返り値がインラインにバンドルファイルに埋め込まれる
- マクロは実行してインライン化した後に、デッドコードを削除するという特徴がある
