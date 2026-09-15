---
id: ospAlutKoInu94tKj9lTX
title: "React 互換の軽量ランタイム TanStack Redact とは"
slug: "what-is-tanstack-redact"
about: "TanStack Redact は、React のコンポーネントや Hooks の書き方を引き継ぐ軽量ランタイムです。同期描画を採用しており、React と同じ API があっても動作が異なる部分があります。この記事では基本的な導入方法と設計思想を説明し、同じ商品一覧を React と Redact で動かし、startTransition の動作の違いを確かめます。"
createdAt: "2026-09-15T22:08+09:00"
updatedAt: "2026-09-15T21:19+09:00"
tags: ["React", "TanStack Redact"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/6oHYwjjGV1qqBSA53vZ5zI/96361195210549f60699e66d97144463/food_cheese-hamburger_6974.png"
  title: "チーズバーガーのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Vite で Redact を使うと、既存コードの React の import はどのように扱われますか？"
      answers:
        - text: "すべてのコンポーネントを TanStack Start の API で書き直す"
          correct: false
          explanation: "TanStack Start は必須ではなく、コンポーネントや Hooks を使う基本的な書き方を引き継ぎます。"
        - text: "import の記述を維持し、プラグインが Redact の実装へ解決する"
          correct: true
          explanation: "redact() が react や react-dom/client などの import 先を置き換えます。"
        - text: "すべての import を開発者が @tanstack/redact へ書き換える"
          correct: false
          explanation: "Vite プラグインを使う場合、アプリケーション側の React の import はそのままです。"
        - text: "React と Redact が同じ DOM に対して順番に描画する"
          correct: false
          explanation: "対象の import 先を Redact へ差し替える仕組みであり、両者が順番に描画する方式ではありません。"
    - question: "Redact が中断可能な描画を省くことで、実装しなくてよくなる処理はどれですか？"
      answers:
        - text: "JSX で書かれた要素を DOM に反映する処理"
          correct: false
          explanation: "Redact も商品一覧を DOM に反映します。描画そのものを省くわけではありません。"
        - text: "入力された文字列を状態として保持する処理"
          correct: false
          explanation: "同じ商品の検索例で useState を使って入力値を保持しています。"
        - text: "コンポーネントへ props を渡して呼び出す処理"
          correct: false
          explanation: "Redact も React のコンポーネントモデルを引き継ぎ、props を渡します。"
        - text: "描画を優先順位に応じて中断し、途中の作業を再開する処理"
          correct: true
          explanation: "Redact は concurrent scheduling を提供せず、中断・再開を支える実装を省略・簡略化しています。"
    - question: "Redact の nano プリセットについて、正しい説明はどれですか？"
      answers:
        - text: "React のすべての動作を維持したまま、圧縮率だけを上げる"
          correct: false
          explanation: "nano はオプション機能をまとめて無効にする設定で、動作も変わります。"
        - text: "使った機能を実行時に検出し、必要な実装を自動で追加する"
          correct: false
          explanation: "機能は設定で選びます。たとえば無効にした context は Provider の値を伝えません。"
        - text: "オプション機能をまとめて無効にし、必要なものを設定で選ぶ"
          correct: true
          explanation: "機能を無効にすると振る舞いが省かれるため、必要な機能とサイズを合わせて判断します。"
        - text: "同期描画をやめて、React と同じ描画の優先順位制御を使う"
          correct: false
          explanation: "nano は concurrent scheduling を追加する設定ではありません。"
published: true
---

[TanStack Redact](https://github.com/TanStack/redact) は、React の API に対応する軽量なランタイムです。既存の JSX や Hooks を使ったコードを維持しながら、実行時に使われる React の実装を置き換えます。

React の軽量な代替としては [Preact](https://preactjs.com/guide/v10/differences-to-react/) もあります。Preact 自体は React の再実装を目的としておらず、`preact/compat` という互換レイヤーを通じて React のコードやライブラリを利用できるようにしています。

Redact の作者 Tanner Linsley 氏は [Projecting React](https://tannerlinsley.com/posts/projecting-react) で、最初は `preact/compat` の導入を試したと振り返っています。同記事によると、当時の自身のアプリケーションでは `use()` の挙動や React 19 の Server Actions 関連 API、Portal、Error Boundary、hydration の細部で互換性の問題が重なり、追加の互換処理が増えていったとのことです。

そこで Redact では、React の公開 API を出発点に、TanStack Start で必要とする範囲へ絞った実装を作る方針を選びました。Preact に互換レイヤーを重ねる方法に対し、必要な React の API と動作から実装を組み立てる、という違いがあります。

ただし、API の名前が同じでも、React のすべての動作が再現されるわけではありません。Redact は同期描画を採用し、描画を優先順位に応じて中断・再開する仕組みを省いています。この違いは `useDeferredValue` や `startTransition` の動作に影響します。

この記事では TanStack Redact が何をするライブラリなのか、React の設計思想とどこが異なるのかを説明します。

## TanStack Redact の導入

通常の React アプリケーションでは、`react` から `useState` などを、`react-dom/client` から `createRoot` などを読み込みます。Redact はこれらの import 先を、ビルドツールを通じて自身の実装へ差し替えます。

たとえば、アプリケーションのコードに書く import は以下のように通常の React と同じです。

```jsx
import { startTransition, useState } from "react";
import { createRoot } from "react-dom/client";
```

Redact の Vite プラグインを使うと、`react` は `@tanstack/redact`、`react-dom/client` は `@tanstack/redact/dom-client` の実装へ解決されます。JSX を実行するための `react/jsx-runtime` なども同様に置き換わります。

### Vite へ組み込む

Vite + React のプロジェクトで Redact を使用してみましょう。まず `@tanstack/redact` パッケージをインストールします。

```bash
npm install --save-exact @tanstack/redact@0.1.2
```

続いて、Vite のプラグインに `redact()` を追加します。また、Vite 内蔵の JSX 変換を使う場合は `esbuild: { jsx: 'automatic' }` を明示する必要があります。React の Vite プラグインを使う場合は、automatic JSX runtime がデフォルトで有効になるため、明示する必要はありません。

```js:vite.config.js
import { defineConfig } from 'vite';
import { redact } from '@tanstack/redact/vite';

export default defineConfig({
  plugins: [redact()],
  esbuild: { jsx: 'automatic' },
});
```

Redact のプラグインはクライアントと SSR のビルドを扱います。一方、React Server Components（RSC）の環境では import を差し替えず、本家 React がそのまま使われることに注意してください。

## React の設計思想と Redact の違い

Redact の設計を理解するために、まず React が何を重視しているかを整理しましょう。React は、コンポーネントの描画をいつ実行するかを制御するために、いくつかの制約を設けています。

React の重要な考え方の 1 つは、コンポーネントを純粋に保つことです。同じ props・state・context に対して同じ結果を返し、レンダリング中には外部の状態を変更しないようにします。副作用はイベントハンドラーや Effect など、レンダリングとは別の場所で実行します。

この制約によって React は、コンポーネントをいつ評価するかを制御しやすくなります。[React の公式ドキュメント](https://react.dev/reference/rules/components-and-hooks-must-be-pure)でも、純粋性と描画の優先順位付けの関係が説明されています。

### 重い画面更新より入力を優先する

描画の実行タイミングを制御する理由の 1 つは、ユーザーの操作に対して応答性を維持するためです。たとえば、検索欄への入力に合わせて巨大なリストを更新する画面を考えましょう。一覧の描画が終わるまで入力欄の更新も待たせると、文字を入力する操作が重く感じられます。

!v(https://videos.ctfassets.net/in6v9lxmm5c8/2SxpI8AVCi513LQcEoS4GK/af3ebd5fec2a7bfb2789ade5e5627fc3/what-is-tanstack-redact-1.mp4 466x332)

React は、描画の優先順位を制御して、入力欄の更新を優先する仕組みである concurrent rendering を導入しました。concurrent rendering では、描画の途中で中断して、より優先度の高い更新を先に処理できます。[React 18 の発表](https://react.dev/blog/2022/03/29/react-v18#what-is-concurrent-react)では、従来の中断できない描画との違いが説明されています。

開発者は以下の API を使って、更新の扱いを React に伝えます。

- `startTransition`：コールバック関数内で指定した状態更新を、ほかの更新を妨げない Transition として扱う
- `useDeferredValue`：値の反映を遅らせ、その値を使う UI の更新を後から試みる

実際の使用例も見てみましょう。入力欄の値 `text` と、一覧の絞り込みに使う値 `query` を分けます。入力欄は通常の状態更新で反映し、一覧の更新だけを `startTransition` で囲むことにより、入力欄の更新を優先できます。

一覧を表示する `ProductList` コンポーネントは、挙動を観察しやすいように、5,000 件の商品の各行で意図的に重い計算をしてから表示するかを判定します。

```jsx:src/concurrent.jsx
import { startTransition, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { ProductList } from './ProductList.jsx';

function App() {
  const [text, setText] = useState('');
  const [query, setQuery] = useState('');

  return (
    <main>
      <label>
        商品を検索
        <input
          value={text}
          onChange={(event) => {
            const nextText = event.target.value;
            setText(nextText); // 入力欄の更新は Transition にしない
            startTransition(() => {
              setQuery(nextText); // 一覧の更新を Transition にする
            });
          }}
        />
      </label>
      <p>{text !== query ? '一覧を更新しています' : ''}</p>
      {/* ProductList コンポーネントは意図的に計算負荷を入れている */}
      <ProductList query={query} />
    </main>
  );
}
```

`setQuery(nextText)` による一覧の更新は Transition として扱われるため、その描画中に次の入力が届くと、React は一覧の描画を中断して入力欄の更新を優先できます。その後、最新の検索語で一覧の描画をやり直します。以下のデモでは、入力が妨げられないことが確認できます。

!v(https://videos.ctfassets.net/in6v9lxmm5c8/4VRdcRt6DuP43OaRkCGjly/99581b1545f9016363ca43bbd22169f4/what-is-tanstack-redact-2.mp4 466x332)

## Redact が選んだ同期描画

Redact は、React の API と日常的な動作を提供しながら、concurrent scheduling を持たないことを目標にしています。ここでいう scheduling は、描画する仕事の優先順位や実行タイミングを管理することです。初期版 0.0.1 の[サイズ分析](https://github.com/TanStack/redact/blob/ae632f06d9ca785da78d57bc4d5a88e1f79b6c47/docs/SAVINGS_ANALYSIS.md)には、優先順位に基づく中断可能な描画などを省くことで、実装を小さくする方針が記されています。

その後、2026 年 9 月 11 日にマージされた [PR #24](https://github.com/TanStack/redact/pull/24) では、React の API や DOM・SSR の互換性を拡張しています。この変更でも、同期描画と Action・楽観的更新に関する Hooks の動作省略を維持する方針が明記されています。

つまり、React のコンポーネントモデルを引き継ぎつつ、実行時の責務を絞るという設計です。React と同じく純粋なコンポーネントを前提にしつつ、ランタイムが引き受ける処理を減らしています。

### 中断・再開を支える実装を省くことによる影響

先ほどの検索例で、一覧の描画を中断して入力を優先するには、React 側にもそのための仕組みが必要です。更新の優先順位を管理し、どこまで描画したかを保持し、処理を譲るタイミングを判断しなければなりません。新しい入力が届いた場合には、途中の描画をやり直す処理も必要になります。

React の[描画処理の実装](https://github.com/react/react/blob/v19.3.0/packages/react-reconciler/src/ReactFiberWorkLoop.js)には、作業中のコンポーネントを管理する `workInProgress` や、更新の優先順位などを分類する lane、処理を譲るか判断する `shouldYield` が登場します。これらを管理・更新する JavaScript も、ランタイムの一部として配信されます。

Redact では、次の処理を省略・簡略化することにより、バンドルサイズの削減を図っています。

| 処理       | 中断可能な描画で必要になること                                   | Redact の方針                                  |
| ---------- | ---------------------------------------------------------------- | ---------------------------------------------- |
| 更新の選択 | 入力などの更新と Transition の更新を区別して、優先する仕事を選ぶ | React の lane に基づく優先順位管理を実装しない |
| 描画の進行 | 作業を分割し、処理を譲るか判断して、途中から再開する             | 描画の途中で処理を譲る仕組みを実装しない       |
| 値の遅延   | 古い値を使う表示と、新しい値で試みる描画を管理する               | `useDeferredValue` は渡された値をそのまま返す  |

`useDeferredValue` の違いは、Redact の[Hooks の実装](https://github.com/TanStack/redact/blob/ae632f06d9ca785da78d57bc4d5a88e1f79b6c47/packages/redact/src/dom/dispatcher.ts)を見ると一目瞭然です。

```ts
useDeferredValue<T>(v: T): T {
  return v
}
```

このメソッドは、受け取った値をそのまま返します。以前の値を保持して、別の優先順位で描画する React の処理はありません。

### 同期描画以外にも実装を小さくしている

同期描画以外にも、Redact はイベント処理を簡略化しています。[DOM イベント処理](https://github.com/TanStack/redact/blob/ae632f06d9ca785da78d57bc4d5a88e1f79b6c47/packages/redact/src/dom/dom.ts)では、要素へ `addEventListener` でハンドラーを登録し、ネイティブイベントに `nativeEvent` などの互換性を補っており、React の合成イベントの仕組み全体を再現することは避けています。

さらに、機能フラグを無効にした場合は、[Vite プラグイン](https://github.com/TanStack/redact/blob/ae632f06d9ca785da78d57bc4d5a88e1f79b6c47/packages/redact/src/vite/index.ts)が対象機能の import 先を簡略化した実装へ差し替えます。ブラウザに本来の実装を配信してから実行を止める方式ではなく、ビルド時にその実装を除外する方式です。`nano` プリセットは、この仕組みでオプション機能をまとめて無効にし、必要な機能を選ぶ設定です。

```ts
import { redact } from "@tanstack/redact/vite";

export default defineConfig({
  plugins: [
    redact({
      preset: "nano",
      features: { context: true },
    }),
  ],
});
```

[機能フラグの説明](https://github.com/TanStack/redact/blob/ae632f06d9ca785da78d57bc4d5a88e1f79b6c47/README.md#feature-flags)では、たとえば `context` を無効にすると Provider の値は伝わらず、`hydration` を無効にすると `hydrateRoot` は例外を投げると明記されています。

## 同じ商品一覧を React と Redact で比較する

先ほどの商品一覧を、そのまま Redact でも動かしてみましょう。コードはそのままで、Vite のプラグインを有効にするだけで、React の import が Redact の実装へ置き換わります。

Redact では `startTransition` を呼んでも、使わなかった場合と同じように入力欄の更新と一覧の更新が同じ優先順位で扱われます。以下のデモでは入力欄への入力が遅延していることが確認できます。

!v(https://videos.ctfassets.net/in6v9lxmm5c8/3S7VT6vA943y13qZX2MTcD/94b41736b699a8dcd4e60a35875694ac/what-is-tanstack-redact-3.mp4 466x332)

一方ビルドサイズは、Redact（`full` プリセット）の方が小さくなります。今回の商品一覧を Vite で production build すると、生成された JavaScript 全体の gzip サイズは React が 69,714 bytes、Redact が 20,112 bytes でした。

## まとめ

- TanStack Redact は、React の import 先をビルド時に差し替える軽量ランタイム。コンポーネントや Hooks を使う基本的な書き方を引き継ぎ、React の API に対応するが、すべての動作を再現するわけではない。
- Redact は同期描画を採用し、concurrent scheduling を省いている。`useDeferredValue` や `startTransition` は API として存在するが、React と同じ優先順位制御は行われない。
- Redact の `nano` プリセットは、オプション機能をまとめて無効にする設定で、さらにバンドルサイズを小さくできる。

## 参考

- [Projecting React — Tanner Linsley](https://tannerlinsley.com/posts/projecting-react)
- [Differences to React — Preact](https://preactjs.com/guide/v10/differences-to-react/)
- [TanStack Redact](https://github.com/TanStack/redact)
- [Components and Hooks must be pure – React](https://react.dev/reference/rules/components-and-hooks-must-be-pure)
- [React v18.0](https://react.dev/blog/2022/03/29/react-v18)
- [startTransition – React](https://react.dev/reference/react/startTransition)
- [useDeferredValue – React](https://react.dev/reference/react/useDeferredValue)
