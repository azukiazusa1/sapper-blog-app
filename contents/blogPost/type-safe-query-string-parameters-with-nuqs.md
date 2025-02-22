---
id: lLLAd-O-tJIMVQOpiEO2G
title: "型安全にクエリパラメーターを扱う nuqs"
slug: "type-safe-query-string-parameters-with-nuqs"
about: "フロントエンドの状態管理のパターンとしてクエリパラメータを信頼できる唯一の情報源(single source of truth)として扱うことがあります。ですが、クエリパラメーターの型が文字列であるため、型安全性が保証されないという課題があります。この記事では `nuqs` というライブラリを使用してクエリパラメーターを型安全に扱う方法について解説します。"
createdAt: "2025-01-25T10:33+09:00"
updatedAt: "2025-01-25T10:33+09:00"
tags: ["Next.js", "React", ""]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3UybJ6ZWSiiy4t2YQtrbUN/13eb7f0a4f5e33358768121d728d1982/squid_octopus_illust_1680-768x750.png"
  title: "イカとタコのイラスト"
selfAssessment:
  quizzes:
    - question: "nuqs においてクエリパラメーターを状態として扱うためのフックはどれか？"
      answers:
        - text: "useExternalState"
          correct: false
          explanation: null
        - text: "useQueryParams"
          correct: false
          explanation: null
        - text: "useQueryState"
          correct: true
          explanation: null
        - text: "useUrlState"
          correct: false
          explanation: null
    - question: "クエリパラメーターの型を `Integer` として扱う方法として正しいものはどれか？"
      answers:
        - text: "const [count, setCount] = useQueryState('count', parseAsInteger);"
          correct: true
          explanation: null
        - text: "const [count, setCount] = useQueryState('count', parseAsInteger());"
          correct: false
          explanation: null
        - text: "const [count, setCount] = parseAsInteger(() => useQueryState('count'));"
          correct: false
          explanation: null
        - text: "const [count, setCount] = useQueryState<number>('count');"
          correct: false
          explanation: null
published: true
---
フロントエンドの状態管理のパターンとしてクエリパラメータを信頼できる唯一の情報源(single source of truth)として扱うことがあります。つまり、`useState` などの React の状態管理フックを使用してメモリ上に保持した状態を使用するのではなく、`location.search` などでクエリパラメーターを取得し、それの情報を元に画面を描画するということです。ユーザーの操作により状態が更新される場合には必ずクエリパラメータも更新することで、状態とクエリパラメータが常に一致することが保証します。

クエリパラメータを状態の情報源として使用するメリットとして以下のようなものがあります。

- ブラウザの履歴に状態を保存できるため、ブラウザの戻る・進むボタンで状態を戻すことができる
- ブックマークや URL を共有することで状態を再現できる。例えばタブの状態を URL に含めることで特定のタブを開いた状態を共有できる
- アプリケーションの操作に慣れているパワーユーザーは UI を使わずに URL を直接操作することで状態を変更できる

一方で、クエリパラメータを状態の情報源として使用する際には以下のような課題があります。

- クエリパラメーターの型が文字列であるため、型安全性が保証されない
- クエリパラメーターのパースやシリアライズやクエリパラメーターの操作などの処理が煩雑になる

このような課題を解決するために `nuqs` というライブラリが登場しました。`nuqs` はクエリパラメーターを型安全に扱うためのライブラリです。クエリパラメーターを `useState` とよく似た API で扱うことができます。

https://nuqs.47ng.com/

!> `nuqs` はもともと `next-usequerystate` という名前で呼ばれていましたが、タイピングするのに長過ぎるという理由で `nuqs` に変更されたようです。

この記事では Next.js で `nuqs` を使用してクエリパラメーターを型安全に扱う方法について解説します。

## インストール

`nuqs@^2` は以下のフレームワークをサポートしています。

- Next.js: 14.2.0 and above (including Next.js 15)
- React SPA: 18.3.0 & 19 RC
- Remix: 2 and above
- React Router v6: react-router-dom@^6
- React Router v7: react-router@^7

上記よりも古い Next.js のバージョンを使用している場合には `nuqs@^1` を使用する必要があります。

以下のコマンドで `nuqs` をインストールします。

```bash
npm install nuqs
```

続いて `nuqs` をフレームワークに統合するために `<NuqsAdapter>` Context Provider を使用します。Next.js App Router の場合には `src/app/layout.tsx` に以下のように記述します。

```tsx:src/app/layout.tsx
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { type ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
```

## 基本的な使い方

`nuqs` は `useQueryState` というフックを使用して状態を管理します。`useQueryState` の第 1 引数にはクエリパラメーターのキーを指定します。`useQueryState` の返り値は `useState` と同じように `[state, setState]` のタプルです。デフォルトの型は `string | null` です。

以下の例では `name` というクエリパラメーターを管理しています。`useQueryState` フックはクライアントコンポーネントのみで使用可能なため、`"use client"` ディレクティブを宣言しています。

```tsx:app/page.tsx
"use client";
import { useQueryState } from "nuqs";

export default function Home() {
  const [name, setName] = useQueryState("name");

  return (
    <div>
      <label htmlFor="name">Name:</label>
      <input
        id="name"
        type="text"
        value={name ?? ""}
        onChange={(e) => setName(e.target.value)}
      />
      <p>Hello, {name}!</p>
    </div>
  );
}
```

以下のように input 要素の入力するたびにクエリパラメーターが更新されることが確認できます。またブラウザの URL を直接操作して状態を変更することもできます。なお、デフォルトでは状態を更新してもブラウザの履歴に追加されることはありません。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/3mik4TCbC271Fw9L1k2E1M/d1838266c18add5dd25bdc22dbad12eb/_____2025-01-25_11.21.47.mov" controls></video>

## デフォルト値の指定

`useQueryState` で指定したキーに対応するクエリパラメーターが存在しない場合にはデフォルトでは `null` が返ります。デフォルト値を指定する場合には `useQueryState` の第 2 引数のオブジェクトの `defaultValue` プロパティにデフォルトに指定します。`defaultValue` を指定した場合、返り値の型は `string` になります。

```tsx
const [name, setName] = useQueryState("name", { defaultValue: "world" });
```

## パーサーを指定する

`useQueryState` で指定したクエリパラメーターの値はデフォルトでは `string` 型になります。実際のプロダクトでは `number`, `boolean`, `Date`, `array`, `object` など様々な型を状態として扱いことでしょう。`string` 以外の型を状態として扱いたい場合にはパーサーを `useQueryState` の第 2 引数に指定します。

よく使われる型については `nuqs` ビルドインのパーサーが用意されています。より複雑な型を扱う場合にはカスタムパーサーを指定することもできます。

ビルドインのパーサーとしては以下のものが用意されています。

- String: `parseAsString`
- Integer: `parseAsInteger`
- Float: `parseAsFloat`
- Hexadecimal: `parseAsHex`
- Boolean: `parseAsBoolean`
- String [Literal Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types): `parseAsStringLiteral`
- Number [Literal Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types): `parseAsNumberLiteral`
- Enum: `parseAsEnum`
- ISO 8601 Datetime: `parseAsIsoDateTime`
- ISO 8601 Date: `parseAsIsoDate`
- timestamp: `parseAsTimestamp`
- Array: `parseAsArray`
- JSON: `parseAsJson`

例としてカウンターアプリケーションを作成する場合を考えます。クエリパラメーター `count` は数値を表すため、`parseAsInteger` を指定します。`parseAsInteger` は数値にパースできる場合には数値を返し、パースに失敗するような値（`?name=foo`）が指定された場合にはデフォルト値（`null`）が返ります。

```tsx
"use client";
import { parseAsInteger, useQueryState } from "nuqs";

export default function Counter() {
  const [count, setCount] = useQueryState("count", parseAsInteger);
  // ^? number|null

  return (
    <div>
      <button onClick={() => setCount((c => c+1))>Increment</button>
      <p>Count: {count ?? 0}</p>
    </div>
  );
}
```

デフォルト値を指定しつつパーサーを指定する場合には `.withDefault` メソッドを使用します。

```tsx
const [count, setCount] = useQueryState("count", parseAsInteger.withDefault(0));
```

### JSON パーサーを使用する

オブジェクト型として状態を管理する場合には `parseAsJson` パーサーを使用します。JSON オブジェクトのスキーマやバリデーションを行うためには [Zod](https://zod.dev/) や [Yup](https://github.com/jquense/yup), [Valibot](https://valibot.dev/) などのスキーマバリデーションライブラリを使用します。

```tsx
"use client";
import { z } from "zod";
import { parseAsJson, useQueryState } from "nuqs";

// zod のスキーマを定義
const schema = z.object({
  query: z.string(),
  page: z.number(),
  sort: z.enum(["price", "date", "rating"]),
  primeDelivery: z.boolean(),
  tags: z.array(z.string()),
});

export default function Search() {
  // zod で定義したスキーマ | null 型に推論される
  const [search, setSearch] = useQueryState(
    "search",
    parseAsJson(schema.parse),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    // クエリパラメーターを更新
    setSearch({
      query: String(formData.get("query") ?? ""),
      page: Number(formData.get("page")) ?? 1,
      sort: (formData.get("sort") ?? "price") as "price" | "date" | "rating",
      primeDelivery: formData.get("primeDelivery") === "on",
      tags: String(formData.get("tags") ?? "")
        .split(",")
        .map((tag) => tag.trim()),
    });
  };

  return {
    /* ... */
  };
}
```

`setSearch` を呼び出して状態を更新すると、以下のようなクエリパラメーターが URL に追加されます。

```plaintext
?search={"query":"react","page":1,"sort":"price","primeDelivery":true,"tags":["book","development"]}
```

クエリパラメータのパースに失敗（`schema.parse` でエラーが発生）した場合にはデフォルト値（`null`）が返ります。

## オプション

`nuqs` のいくつかの挙動は以下のオプションを使用してカスタマイズできます。

- `history`：ブラウザの履歴に状態を追加するかどうかを指定する。デフォルトは `history.replace()` が使われるためクエリパラメーターが更新されてもブラウザの履歴に追加されない
- `shallow`：デフォルトではクライアントサイドのみでクエリパラメータが更新され、サーバーサイドへのリクエストは行われない。`shallow` オプションを `true` にすることでサーバーサイドへ更新が通知される。Next.js App Router の場合は `shallow` オプションを `true` に設定すると RSC ツリーが再レンダリングされる
- `scroll`：デフォルトではクエリパラメーターが更新されてもスクロール位置が維持される。`scroll` オプションを `true` にすることでクエリパラメーターが更新された際にスクロール位置がトップに戻る
- `throttleMs`：ブラウザによる History API の呼び出し制限を回避するためクエリパラメータの更新はキューに追加され、指定した時間（ミリ秒）ごとに処理される。デフォルトは `50` ミリ秒でこの値は設定により変更できる（Safari では厳しい制限が設定されていて `120` ミリ秒以上の間隔で更新する必要がある）
- `startTransition`：React の `useTransition` フックと組み合わせてクエリパラメーターを更新する
- `clearOnDefault`：デフォルトでは状態がデフォルト値に更新された場合、クエリパラメーターが削除される。`clearOnDefault` オプションを `false` にすることでデフォルト値に更新されてもクエリパラメーターが削除されない

オプションを指定する方法は 2 つあります。1 つ目は `useQueryState` の第 2 引数にオプションを指定する方法です。

```tsx
const [name, setName] = useQueryState("name": { history: "push" });
```

この方法は状態を更新する関数を呼び出す場合にも使用できます。この場合 `useQueryState()` で指定したオプションは上書きされます。

```tsx
setName("Alice", { scroll: true });
```

2 つ目の方法はパーサーの builder パターンを使用する方法です。

```tsx
const [name, setName] = useQueryState(
  "name",
  parseAsString.withDefault("Alice").withOptions({ scroll: true }),
);
```

-> `parseAsString` パーサーはデフォルトと同じ `string` 型を返すパーサーであり一見何も行わないように見えます。`parseAsString` は上記のように他のパーサーを使用した場合と同じインターフェイスである builder パターンを使用してオプションを指定したい場合に便利です。

## サーバーサイドでの使用

サーバーサイドでクエリパラメータをパースする場合には `loader` 関数を使用します。`loader` 関数は `createLoader` 関数を使用して作成します。サーバーサイドで使用する API は `nuqs/server` からインポートします。

```tsx
import { parseAsString, parseAsInteger, createLoader } from "nuqs/server";

const parser = {
  name: parseAsString.withDefault("world"),
  count: parseAsInteger.withDefault(0),
};
const loadSearchParams = createLoader(parser);
```

`loadSearchParams` 関数はパース済みのクエリパラメーターを返します。`loadSearchParams` 関数は `req` オブジェクトを受け取り、クエリパラメーターをパースして返します。

```tsx
import type { SearchParams } from "nuqs/server";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: PageProps) {
  const { name, count } = await searchParams;

  return (
    <div>
      <p>Hello, {name}!</p>
      <p>Count: {count}</p>
    </div>
  );
}
```

?> `loader` 関数はデータの検証を行わないことに注意してください。データの検証を行う場合には `zod` のようなスキーマバリデーションライブラリを使用する必要があるでしょう。組み込みのデータ検証を行う [REC](https://github.com/47ng/nuqs/discussions/446) が提案されていますが、まだ実装されていません。

`searchParams` に直接アクセスできない子サーバーコンポーネントからクエリパラメーターを取得したい場合には `createSearchParamsCache` 関数を使用します。この関数は内部で React の [cache()](https://react.dev/reference/react/cache) 関数を使用してクエリパラメーターをキャッシュします。なお、この関数は現在 Next.js でのみ使用可能です。

```tsx
import {
  createSearchParamsCache,
  parseAsString,
  parseAsInteger,
  type SearchParams,
} from "nuqs/server";

const parser = {
  name: parseAsString.withDefault("world"),
  count: parseAsInteger.withDefault(0),
};
const searchParamsCache = createSearchParamsCache(parser);

type PageProps = {
  searchParams: SearchParams;
};

export default function Page({ searchParams }: PageProps) {
  // .parse() メソッドは必ず呼び出す必要があることに注意
  const { name } = await searchParamsCache.parse(searchParams);

  return (
    <div>
      <p>Hello, {name}!</p>
      <ChildComponent />
    </div>
  );
}

function ChildComponent() {
  const count = searchParamsCache.get("count");

  return <p>Count: {count}</p>;
}
```

`createSearchParamsCache` で作成したキャッシュは `get` メソッドを使用してクエリパラメーターを取得します。`.parse()` メソッドの結果を使用しない場合でも、必ず呼び出す必要がある点に注意してください。`.parse()` メソッドを呼び出さずに `.get()` メソッドを使用するランタイムエラーが発生します。

キャッシュされた値を呼び出せるのはサーバーコンポーネントに限られます。`"use client"` ディレクティブを宣言したクライアントコンポーネントからはアクセスできません。

## 複数のクエリパラメーターをバッチで更新する

いくつかの状態は一体不可分なことがあります。例えば緯度と経度を表す `lat` と `lng` は一緒に更新されるべきです。このような同時に更新されるべき状態を扱う場合には `useQueryStates` フックを使用します。

```tsx
"use client";
import { useQueryStates, parseAsFloat } from "nuqs";

const [{ lat, lang }, setCoordinates] = useQueryStates(
  {
    lat: parseAsFloat.withDefault(35.6895),
    lng: parseAsFloat.withDefault(139.6917),
  },
  {
    history: "push",
  },
);

const moveToKyoto = () => {
  setCoordinates({
    lat: 35.0116,
    lng: 135.7681,
  });
};
```

### URL 用のクエリパラメーターの名前を指定する

プログラミングにおける命名は重要です。後からコードを読む人や他の開発者が理解しやすいように意味がある名前をオブジェクトのキーとして指定するべきでしょう。しかし、クエリパラメーターとして状態を管理する場合には命名規則との間にトレードオフが存在します。

ほとんどのブラウザでは URL の文字列には制限があり、おおよそ 2,000 文字程度までしか URL に含めることができません。そのため、複雑な状態を URL に収めたい場合にはキー名をできる限り短くするといった工夫が必要です。ですが短いキー名を採用すると、コードの可読性が低下する可能性があります。

この問題を解決するために `useQueryStates` フックのオプションで `urlKeys` を指定できます。`urlKeys` はオブジェクトのキーと URL 用のクエリパラメーターの名前をマッピングするオブジェクトです。

```tsx
import { useQueryStates, parseAsFloat } from "nuqs";

const [{ latitude, longitude }, setCoordinates] = useQueryStates(
  {
    latitude: parseAsFloat.withDefault(35.6895),
    longitude: parseAsFloat.withDefault(139.6917),
  },
  {
    history: "push",
    urlKeys: {
      latitude: "lat",
      longitude: "lng",
    },
  },
);

const moveToKyoto = () => {
  setCoordinates({
    latitude: 35.0116,
    longitude: 135.7681,
  });
};
```

## テスト

`jsdom` や `happy-dom` のような一般的なテスト環境では URL が保存されません。そのためクエリパラメーターの取得や更新といったテストを行う場合には大抵の場合、モックを使用するといった工夫が必要です。

`nuqs` では `withNuqsTestingAdapter` をラッパーとして使用することでテスト環境でのクエリパラメーターのテストを容易にします。下記の例では Vitest と React Testing Library を使用してカウンターアプリケーションのテストを行っています。

```tsx
import React from "react";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  withNuqsTestingAdapter,
  type OnUrlUpdateFunction,
} from "nuqs/adapters/testing";
import { describe, expect, it, vi } from "vitest";
import Counter from "./Counter";

describe("Counter", () => {
  it("increment ボタンをクリックすると count が増える", async () => {
    // URL が更新される場合に呼ばれる spy 関数を用意
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
    render(<Counter />, {
      wrapper: withNuqsTestingAdapter({
        // クエリパラメーターの初期値を指定
        searchParams: "?count=42",
        onUrlUpdate,
      }),
    });

    // count が 42 であることを確認
    expect(screen.getByText("Count: 42")).toBeInTheDocument();

    const incrementButton = screen.getByRole("button", { name: "Increment" });

    await userEvent.click(incrementButton);

    // count が 43 に増えたことを確認
    expect(screen.getByText("Count: 43")).toBeInTheDocument();

    // URL が更新されたことを確認
    const event = onUrlUpdate.mock.calls[0][0]!;
    expect(event.queryString).toBe("?count=43");
    expect(event.searchParams.get("count")).toBe("43");
    expect(event.options.history).toBe("replace");
  });
});
```

## まとめ

- `nuqs` はクエリパラメーターを型安全に扱うためのライブラリ
- `useQueryState` フックを使用してクエリパラメーターを状態として扱う
- ビルドインのパーサーを使用してクエリパラメーターの型を指定する
- サーバーサイドでの使用には `createLoader` 関数を使用する
- 複数のクエリパラメーターをバッチで更新する場合には `useQueryStates` フックを使用する
- URL 用のクエリパラメーターの名前を指定する場合には `urlKeys` オプションを使用する
- テスト環境でのクエリパラメーターのテストには `withNuqsTestingAdapter` を使用する

## 参考

- [nuqs - Type-safe query string parameters for TypeScript](https://nuqs.47ng.com/)
