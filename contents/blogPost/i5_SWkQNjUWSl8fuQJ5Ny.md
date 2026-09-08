---
id: i5_SWkQNjUWSl8fuQJ5Ny
title: "React の browser() API でブラウザ専用のコンポーネントを描画する"
slug: "react-browser-api"
about: "SSR を使う React アプリで localStorage を読む場合、従来は useEffect と state を使って初回表示を管理していました。browser() API では、ブラウザでのみ描画する意図を use(browser()) で表現し、待機中の表示を Suspense に任せられます。この記事では `browser()` API の使い方と、従来の `useEffect` と state を使った方法との違いを解説します。"
createdAt: "2026-09-08T20:05+09:00"
updatedAt: "2026-09-08T20:05+09:00"
tags: ["React"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4BrxUmBFr509uTsABXJm7N/436750624d87f22782cd82e5e2f46b2d/hamburger_fried-potato_illust_3406.png"
  title: "ハンバーガーとフライドポテトのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "SSR で localStorage を読むとき、typeof window の分岐だけでは防げない問題はどれですか？"
      answers:
        - text: "useEffect がサーバーで実行されること"
          correct: false
          explanation: "useEffect はサーバーでは実行されません。問題はサーバーとブラウザで初回描画が異なる可能性があることです。"
        - text: "サーバーとブラウザの初回描画が一致しないこと"
          correct: true
          explanation: "サーバーでは空文字列、ブラウザでは保存内容を表示すると、参照エラーを避けてもハイドレーションの不一致が起こり得ます。"
        - text: "ブラウザで保存内容を読み取れなくなること"
          correct: false
          explanation: "分岐してもブラウザ側では保存内容を読めます。その内容がサーバーの初回表示と異なることが問題です。"
        - text: "保存した文章がサーバーへ自動送信されること"
          correct: false
          explanation: "この分岐に保存内容を送信する処理はありません。サーバーからブラウザの保存内容を読むこともできません。"
    - question: "親に Suspense があるコンポーネントで use(browser()) を呼んだ場合、SSR ではどうなりますか？"
      answers:
        - text: "ブラウザから保存内容が届くまでサーバーで待つ"
          correct: false
          explanation: "サーバーがブラウザの保存内容を待つ仕組みではなく、その部分の描画をブラウザへ任せます。"
        - text: "use() が undefined を返し、後続の描画を続ける"
          correct: false
          explanation: "undefined を返して後続のコードへ進むのはブラウザでの動作です。"
        - text: "呼び出したコンポーネントの Effect だけを省く"
          correct: false
          explanation: "Effect だけでなく、その位置から先のコンポーネントのサーバーでの描画を止めます。"
        - text: "描画を中断し、最も近い Suspense の fallback を残す"
          correct: true
          explanation: "SSR では親の Suspense に fallback を残し、コンポーネントの内容はブラウザで描画します。"
    - question: "browser() による切り替えで Suspense の fallback を残せた場合、専用の通知先はどれですか？"
      answers:
        - text: "サーバーレンダラーの onBrowserBailout"
          correct: true
          explanation: "onBrowserBailout には理由を cause に持つ Error と、コンポーネントスタックが渡されます。"
        - text: "サーバーレンダラーの onError"
          correct: false
          explanation: "意図した切り替えで fallback を残せた場合は onError を呼びません。Suspense がなく SSR が失敗する場合とは区別します。"
        - text: "hydrateRoot の onRecoverableError"
          correct: false
          explanation: "browser() による意図した切り替えでは、ブラウザ側の onRecoverableError も呼ばれません。"
        - text: "サーバーレンダラーの onShellReady"
          correct: false
          explanation: "onShellReady は最初に送れる HTML の準備ができたときの通知であり、ブラウザへ任せた理由の通知先ではありません。"
published: true
---

フォームの下書きを `localStorage` に保存しておき、ページを開き直したときに復元したい場面を考えてみましょう。ブラウザでのみ動くアプリなら、コンポーネントの初期化時に保存内容を安全に読み取れます。しかし、サーバーで HTML を生成する SSR（サーバーサイドレンダリング）を使っている場合、サーバーからユーザーのブラウザの `localStorage` を読むことはできないため、コンポーネントがサーバーで実行されているかブラウザで実行されているかを判定して、保存内容を読み取るタイミングを制御する必要があります。

従来は `useEffect` の中で保存内容を読み取り、state を更新して表示を切り替える方法が使われていました。これは `useEffect` がサーバーでは実行されず、ブラウザでマウントされた後に実行されることを利用した方法です。

```jsx
function SavedDraft() {
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    setDraft(localStorage.getItem("draft") ?? "");
  }, []);

  if (draft === null) return <p>下書きを読み込み中...</p>;
  return <p>保存した下書き: {draft}</p>;
}
```

しかし、`useEffect` を使う方法では、初回表示を一致させるために読み取り前の状態を表す `null` の state を用意したり、Effect から追加の再描画を起こしたりする必要がありました。また、待機中の表示もコンポーネントで管理するという課題がありました。

React DOM の新しい [`browser()` API](https://react.dev/reference/react-dom/browser) は、コンポーネントの描画をブラウザに任せるための API です。`use(browser())` と書くと、そのコンポーネントのサーバーでの描画を止め、待機中の表示を `<Suspense>` に任せられます。

この記事では `browser()` の基本的な使い方について紹介します。

!> 2026 年 9 月 6 日時点で `browser()` は Canary／Experimental チャンネル限定の API です。安定版の React 19.2 では利用できません。この記事では `react` と `react-dom` の `19.3.0-canary-8425b691-20260904` を使って検証しています。今後 API や挙動が変わる可能性があります。

## 従来は `useEffect` で `localStorage` を読み取っていた

まず、SSR を使うときに `localStorage` の読み取りが問題になる理由を確認しましょう。次のコードでは、`useState` の初期値を決める関数の中で保存内容を読み取っています。

```jsx
import { useState } from "react";

function SavedDraft() {
  const [draft] = useState(() => localStorage.getItem("draft") ?? "");

  return <p>保存した下書き: {draft}</p>;
}
```

このとき問題になるのは、このコンポーネントがサーバーとブラウザの両方で実行される可能性があることです。上記のコードは `localStorage` を提供していないサーバー環境で参照エラーになります。仮にサーバー環境に同名の API があっても、そこにユーザーのブラウザの保存内容があるわけではないため、ブラウザでの初回描画とサーバーでの初回描画が一致しないハイドレーションの不一致が起こります。

### 初回表示をそろえてから保存内容を読み取る

SSR には、サーバーで作った HTML をブラウザ側の React に引き継ぐ「ハイドレーション」という処理があります。React は既存の HTML にイベント処理などを接続するため、サーバーとブラウザで初回の描画結果が一致している必要があります。[`hydrateRoot` の公式ドキュメント](https://react.dev/reference/react-dom/client/hydrateRoot#caveats)でも、不一致は修正すべきバグとして扱われています。

この条件を満たすため、まずは共通の表示を出し、ハイドレーション後に保存内容を読み取る方法が使われます。

```jsx
import { useEffect, useState } from "react";

function SavedDraft() {
  // null は読み取り前、空文字列は保存内容がない状態
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    setDraft(localStorage.getItem("draft") ?? "");
  }, []);

  if (draft === null) {
    return <p>下書きを読み込み中...</p>;
  }

  return <p>保存した下書き: {draft}</p>;
}
```

`useEffect` はサーバーでは実行されません。そのため、次の順序で表示が切り替わります。

1. サーバーでは `draft` が `null` のままなので「下書きを読み込み中...」を出力する。
2. ブラウザの初回描画でも `draft` は `null` なので、サーバーと同じ表示になる。
3. ハイドレーション後に Effect が実行され、`localStorage` の保存内容で state を更新する。
4. 更新された state を使って再描画し、保存内容を表示する。

React の公式ドキュメントでも、[サーバーとクライアントで異なる内容を表示する方法](https://react.dev/reference/react/useEffect#displaying-different-content-on-the-server-and-the-client)として、Effect でマウント済みの状態へ切り替えるパターンが紹介されています。

### 従来の方法の課題

この実装は初回表示を一致させる有効な方法ですが、ブラウザ専用の内容を表示するために、いくつかの処理を自分で管理する必要がありました。

- 読み取り前の状態を表す必要がある: この例では `null` を使い、保存データがない状態の `""` と区別している。
- Effect が追加の再描画を起こす: ブラウザで最初の表示を確定した後、保存内容を読むために Effect を実行し、state の更新で表示を切り替えるため、
  本来不要な 2 回目の描画が発生する。
- 待機中の表示もコンポーネントで管理する: 保存内容を表示する処理に加えて、読み取り前に返す JSX とその分岐が必要

共通の Hook やラッパーへ切り出せば重複は減らせるものの、マウントを待ち、状態を更新して描画し直すという課題は残ります。

また、サーバーでの参照エラーを避けようとして、次のように `typeof window` だけで分岐する場合にも注意が必要です。`typeof window` による分岐はサーバー側には `window` オブジェクトが無いことを利用した参照エラーの回避策として従来はよく使われていました。

```jsx
import { useState } from "react";

function SavedDraft() {
  const [draft] = useState(() =>
    typeof window === "undefined"
      ? ""
      : localStorage.getItem("draft") ?? "",
  );

  return <p>保存した下書き: {draft}</p>;
}
```

サーバーでは空文字列、ブラウザでは保存された文章になると、初回描画が一致しません。`typeof window` による分岐は、サーバーでの参照エラーを防いでも、ハイドレーションの不一致まで防ぐものではないのです。[React はこの分岐を不一致のよくある原因として挙げています](https://react.dev/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html)。

## `browser()` API の基本的な使い方

`browser()` は `react-dom` からインポートします。戻り値を React の [`use()`](https://react.dev/reference/react/use) に渡すことで、その場所から先の描画をブラウザに任せます。`use()` は、Promise やコンテキストなどのリソースをレンダリング中に読み取る API です。

```jsx
import { Suspense, use } from "react";
import { browser } from "react-dom";

function BrowserOnly() {
  use(browser());

  return <p>この内容はブラウザで描画されます。</p>;
}

export default function App() {
  return (
    <Suspense fallback={<p>読み込み中...</p>}>
      <BrowserOnly />
    </Suspense>
  );
}
```

`<Suspense>` は、子の描画が中断されたときに、代わりに `fallback` を表示するコンポーネントです。`use(browser())` をサーバーで処理すると、React は最も近い親の Suspense 境界に fallback を残します。ブラウザで処理すると `undefined` が返るため、`<Suspense>` にキャッチされずに描画が行われるという仕組みです。


:::warning
`<Suspense>` がない場合、サーバーで `use(browser())` を呼ぶと、React は例外を投げて SSR を失敗させます。ブラウザでの描画に任せる意図がある場合は、必ず `<Suspense>` で囲む必要があります。
:::

### なぜ `useBrowser()` という Hook ではないのか

[2026 年 7 月の導入 PR](https://github.com/react/react/pull/37143)では、通常の Hook とする代替案も検討されています。しかし Hook では呼び出し順序を守る必要があり、条件付きで呼べません。`use()` はコンポーネントや Hook の中で条件付きでも呼べるため、props に応じて SSR を続けるか判断できます。

例えば、サーバーに下書きがあればそのデータを、なければブラウザの `localStorage` から復元するケースです。以下のコードでは、`initialDraft` が渡されなかった場合だけ `use(browser())` を呼び出します。

```jsx
import { Suspense, use, useState } from "react";
import { browser } from "react-dom";

// initialDraft はサーバーで DB などから取得する想定
function DraftEditor({ initialDraft }) {
  if (initialDraft === undefined) {
    use(browser("初期データがないため localStorage から復元します。"));
  }

  const [draft, setDraft] = useState(() =>
    initialDraft !== undefined
      ? initialDraft
      : localStorage.getItem("draft") ?? "",
  );

  return (
    <label>
      下書き
      <textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
      />
    </label>
  );
}
```

また `use()` を使わずに単に `browser()` 自体が例外を投げる案についても、任意の場所から呼べてしまい、途中の `catch` によって意図せず処理が妨げられる懸念が説明されています。

このように、`browser()` と `use()` を組み合わせる形には、条件付きの利用を許しつつ、レンダリングに関わる場所で使うという意図があります。

## `localStorage` を使うコンポーネントを描画する

それでは冒頭にあげた下書きを編集し、再読み込み後に復元できる入力欄を実装しましょう。ここでは JSX を利用できる React の SSR 環境を前提とします。検証に使用した React と React DOM のバージョンは以下のとおりです。

:::warning
React Server Components を使うアプリでは、`use(browser())` は Client Component から呼ぶ必要があります。`browser()` は `react-server` 環境では提供されていないため、Server Component からは呼び出せません。
:::

```bash
npm install --save-exact react@19.3.0-canary-8425b691-20260904 react-dom@19.3.0-canary-8425b691-20260904
```

以下のコードでは、`useState` で保存内容を読み取る前に `use(browser())` を呼びます。`browser()` の第 1 引数にはコンテンツをブラウザでレンダリングする必要がある理由を説明する文字列または関数を渡せます。

```jsx:App.jsx
import { Suspense, use, useState } from "react";
import { browser } from "react-dom";

export function SavedDraft() {
  use(browser("下書きは localStorage に保存されています。"));
  const [draft, setDraft] = useState(
    () => localStorage.getItem("draft") ?? "",
  );

  function handleChange(event) {
    const nextDraft = event.target.value;
    setDraft(nextDraft);
    localStorage.setItem("draft", nextDraft);
  }

  return (
    <label>
      下書き
      <textarea value={draft} onChange={handleChange} rows={4} />
    </label>
  );
}

export default function App() {
  return (
    <main>
      <h1>下書きメモ</h1>
      <Suspense fallback={<p>下書きを読み込み中...</p>}>
        <SavedDraft />
      </Suspense>
    </main>
  );
}
```

サーバーでは `use(browser(...))` で描画が止まるため、後続の `localStorage.getItem()` は実行されません。`<Suspense>` の fallback のコンテンツが表示されます。

ブラウザではその先へ進み、`localStorage` の値を state の初期値として使います。従来の例にあった読み取り前の `null` と Effect による state 更新が不要になりました。またフォールバックの表示も `<Suspense>` に任せられるようになっているため、表示の出し分けという責務が呼び出し側に移るという React の思想に沿った形になっています。

## `onBrowserBailout` で描画の切り替えを観測する

SSR を避ける従来の手法には、サーバーで意図的に例外を投げ、Suspense の fallback を返してブラウザで描画し直す方法もありました。

```jsx
import { Suspense, useState } from "react";

function SavedDraft() {
  if (typeof window === "undefined") {
    throw new Error("下書きはブラウザでのみ描画します。");
  }

  const [draft] = useState(
    () => localStorage.getItem("draft") ?? "",
  );

  return <p>保存した下書き: {draft}</p>;
}

export default function App() {
  return (
    <main>
      <h1>下書きメモ</h1>
      <Suspense fallback={<p>下書きを読み込み中...</p>}>
        <SavedDraft />
      </Suspense>
    </main>
  );
}
```

しかしこの手法には、意図的な中断でも通常のエラーとして報告されるという課題があります。

`use(browser())` による描画の中断では、React が識別できる形で表すため通常のエラーと区別されます。サーバーレンダラーの `onError` や、ブラウザ側の `hydrateRoot` の `onRecoverableError` は呼ばれません。代わりに、サーバー側で [`onBrowserBailout`](https://github.com/react/react/pull/37193) を指定すると、ブラウザでのみ描画するために中断したことを捕捉できます。

```jsx
import { renderToPipeableStream } from "react-dom/server";
import App from "./App.jsx";

export function renderApp(response) {
  const { pipe } = renderToPipeableStream(<App />, {
    onShellReady() {
      response.setHeader("Content-Type", "text/html; charset=utf-8");
      pipe(response);
    },
    // ブラウザでのみ描画するために中断したときの通知
    onBrowserBailout(error, errorInfo) {
      // error.cause には `browser()` の第 1 引数の文字列または関数の戻り値が入る
      console.log(error.cause);
      console.log(errorInfo.componentStack);
    },
  });
}
```

:::warning
`onBrowserBailout` が呼ばれるのは、`<Suspense>` があって描画をブラウザへ引き継げた場合だけです。`<Suspense>` がなく SSR が失敗する場合は `onBrowserBailout` ではなく `onError` に通知され、`browser()` に渡した理由はそのエラーの `cause` に入ります。
:::

`onShellReady` は最初に送れる HTML の準備ができたときの通知です。`onBrowserBailout` には、理由を `cause` に持つ Error と、発生箇所のコンポーネントスタックが渡されます。先ほどのサンプルでは「下書きは localStorage に保存されています。」と、`SavedDraft` を含むスタックを受け取れました。

```
下書きは localStorage に保存されています。

    at SavedDraft (/dist/App.js:6:3)
    at Suspense (<anonymous>)
    at main (<anonymous>)
    at App (<anonymous>)
    at div (<anonymous>)
    at body (<anonymous>)
    at html (<anonymous>)
```

## まとめ

- 従来の Effect を使う方法では、SSR とブラウザの初回表示をそろえてから保存内容を読み取り、state の更新で再描画する必要があった
- `typeof window` の分岐だけでは、サーバーとブラウザの初回描画が異なる場合のハイドレーション不一致を防げない
- `use(browser())` はサーバーでの描画を中断し、最も近い Suspense 境界に fallback を残す。ブラウザでは後続のコードを実行する
- 意図した描画の切り替えは `onBrowserBailout` で捕捉できる

## 参考

- [browser – React](https://react.dev/reference/react-dom/browser)
- [use – React](https://react.dev/reference/react/use)
- [useEffect: Displaying different content on the server and the client – React](https://react.dev/reference/react/useEffect#displaying-different-content-on-the-server-and-the-client)
- [hydrateRoot – React](https://react.dev/reference/react-dom/client/hydrateRoot)
- [Add ReactDOM browser() API #37143](https://github.com/react/react/pull/37143)
- [Add onBrowserBailout Fizz option #37193](https://github.com/react/react/pull/37193)
