---
id: 6ZwhVk3IzczxxyV97wUrv
title: "スナップショットテストとアサーションテスト"
slug: "snapshot-test-vs-assertion-test"
about: "この記事では、スナップショットテストとアサーションテストの違いを説明します。また、それぞれのアプローチでテストを書いたときのメリットとデメリットを見ていき、どちらのアプローチを採用すべきか考えていきます。"
createdAt: "2023-07-08T15:10+09:00"
updatedAt: "2023-07-08T15:10+09:00"
tags: ["React", "テスト", "Jest", "Vitest"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4QSQ886rsBxSfIkfa3thMB/3931e28a9a48a5a7080fc9e59a16185b/halloween_ghost_illust_1171.png"
  title: "おばけ"
published: true
---
フロントエンドのテストの種類には、スナップショットテストとアサーションテストの 2 種類があります。スナップショットテストは、テスト対象のコンポーネントのレンダリング結果をスナップショットとして保存しておき、テストの実行時にスナップショットとレンダリング結果を比較することでテストを行います。アサーションテストは、テスト対象の要素を取得して状態をアサーションすることでテストを行います。

この記事では、スナップショットテストとアサーションテストの違いを説明します。また、それぞれのアプローチでテストを書いたときのメリットとデメリットを見ていき、どちらのアプローチを採用すべきか考えていきます。

## テストの実装例

具体的なテストの実装例として、React で作成したフォームコンポーネントをテストすることを考えてみましょう。フォームコンポーネントは以下の要件を備えています。
- 名前の入力欄が空の場合、「送信」ボタンは無効になる
- 名前の入力欄があり、1 文字以上の文字列を入力すると「送信」ボタンが有効になる

実装例は以下のようになるでしょう。

```tsx:Form.tsx
import { useState } from "react";

export const Form: React.FC = () => {
  const [name, setName] = useState("");
  // 1 文字以上の名前が入力されているかどうかの判定
  const isNameValid = name.length > 0;

  return (
    <form>
      <label htmlFor="name" className="form-label">
        名前
      </label>
        <input
          type="text"
          className="form-control"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      {/* 名前が入力されていないなら、disabled が true になってボタンが有効 */}
      <button type="submit" disabled={!isNameValid} className="blue-button">
        送信
      </button>
    </form>
  );
};
```

このフォームコンポーネントをスナップショットテストとアサーションテストの両方のアプローチでテストを書いてみましょう。

### スナップショットテストの実装例

まずはスナップショットテストです。

```tsx:Form.test.tsx 
import { describe, test, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Form } from "./Form"

describe("form", () => {
  test("名前の入力欄に何も入力されていない場合、送信ボタンが押せないこと", () => {
    const { container } = render(<Form />)

    expect(container.childNodes).toMatchSnapshot()
  })

  test("名前の入力欄に 1 文字以上入力されている場合、送信ボタンが押せること", async () => {
    const { container } = render(<Form />)

    await userEvent.type(screen.getByLabelText("名前"), "a")

    expect(container.childNodes).toMatchSnapshot()
  })
})
```

Testing Library の `render` 関数を使ってフォームコンポーネントをレンダリングし、`container` プロパティを使ってレンダリング結果を取得しています。`container.childNodes` でレンダリングされた DOM ツリーを取得し、`toMatchSnapshot` 関数でスナップショットを作成しています。スナップショットは `__snapshots__` ディレクトリに保存されます。

作成されたスナップショットファイルは以下のようになります。

```tsx:__snapshots__/Form.test.tsx.snap
// Vitest Snapshot v1, https://vitest.dev/guide/snapshot.html

exports[`form > 名前の入力欄に 1 文字以上入力されている場合、送信ボタンが押せること 1`] = `
NodeList [
  <form>
    <label
      class="form-label"
      for="name"
    >
      名前
    </label>
    <input
      class="form-control"
      id="name"
      type="text"
      value="a"
    />
    <button
      class="blue-button"
      type="submit"
    >
      送信
    </button>
  </form>,
]
`;

exports[`form > 名前の入力欄に何も入力されていない場合、送信ボタンが押せないこと 1`] = `
NodeList [
  <form>
    <label
      class="form-label"
      for="name"
    >
      名前
    </label>
    <input
      class="form-control"
      id="name"
      type="text"
      value=""
    />
    <button
      class="blue-button"
      disabled=""
      type="submit"
    >
      送信
    </button>
  </form>,
]
`;
```

`test` に渡したテスト名の後に DOM ツリーが文字列として表示されています。「form > 名前の入力欄に 1 文字以上入力されている場合、送信ボタンが押せること 1」のテストでは、`<button>` 要素に `disabled` 属性が付与されていないことがわかります。一方、「form > 名前の入力欄に何も入力されていない場合、送信ボタンが押せないこと 1」のテストでは、`<button>` 要素に `disabled` 属性が付与されていることがわかります。

このように、スナップショットテストではテストを実行した後にスナップショットファイルを確認して期待した結果が得られているかどうかを確認します。

次にテストを実行したときには、このスナップショットファイルとテストの結果を比較します。テストの結果がスナップショットファイルと一致する場合にはテストがパスし、一致しない場合にはテストが失敗します。例えば、`<Form>` コンポーネントに機能を追加する際に誤って `isNameValid` を `<button>` に渡し忘れてしまったシナリオを考えてみましょう。

```diff:Form.tsx
- <button type="submit" disabled={!isNameValid} className="blue-button">
+ <button type="submit" className="blue-button">
   送信
 </button>
```

この場合「名前の入力欄に何も入力されていない場合、送信ボタンが押せないこと」のテストがスナップショットの結果と一致しなくなるため、テストが失敗します。テスト結果ではどこで差分が発生したのかを表示してくれており、`disabled` 属性が付与されていないことがわかります。

```sh
 FAIL  src/Form.test.tsx > form > 名前の入力欄に何も入力されていない場合、送信ボタンが押せないこと
Error: Snapshot `form > 名前の入力欄に何も入力されていない場合、送信ボタンが押せないこと 1` mismatched

- Expected
+ Received

  NodeList [
    <form>
      <label
        class="form-label"
        for="name"
      >
        名前
      </label>
      <input
        class="form-control"
        id="name"
        type="text"
        value=""
      />
      <button
        class="blue-button"
-       disabled=""
        type="submit"
      >
        送信
      </button>
    </form>,
  ]

 ❯ src/Form.test.tsx:10:34
      8|     const { container } = render(<Form />)
      9| 
     10|     expect(container.childNodes).toMatchSnapshot()
       |                                  ^
     11|   })
     12| 
```

このようにスナップショットテストはコンポーネントが変更が加えられた際に、既存の機能が壊れていないかどうか確認する「リグレッションテスト」の役割を担っていると言えます。

### アサーションテストの実装例

続いて、同じフォームコンポーネントをアサーションテストのアプローチで書いてみましょう。この記事ではアサーションテストを「コンポーネントをレンダリングした後に、テスト対象の要素を取得して状態を検査するテスト」と定義します。テストの方法としては一般的な単体テストの書き方に近いものとなります。次のように 1 + 1 の結果が 2 になるかどうかを検査するテストと同じ考え方と言えるでしょう。

```ts:sum.test.ts
import { sum } from "./sum"

test("1 + 1 = 2", () => {
  expect(sum(1, 1)).toBe(2)
})
```

アサーションテストでの実装例は以下のようになります。

```tsx:Form.test.tsx
describe("form", () => {
  test("名前の入力欄に何も入力されていない場合、送信ボタンが押せないこと", () => {
    render(<Form />)

    expect(screen.getByRole("button", { name: "送信" })).toBeDisabled()
  })

  test("名前の入力欄に 1 文字以上入力されている場合、送信ボタンが押せること", async () => {
    render(<Form />)

    await userEvent.type(screen.getByRole("textbox", { name: "名前" }), "a")

    expect(screen.getByRole("button", { name: "送信" })).toBeEnabled()
  })
})
```

テストの準備フェーズ、実行フェーズ（AAA パターンで言うところの Arrange, Act）はスナップショットテストを変わりません。変更点は `expect` を使用している確認フェーズ（Assert）です。スナップショットテストでは DOM ツリー全体をスナップショットとして保存していましたが、アサーションテストでは `screen.getByRole()` でテスト対象の要素のみを取得して、`toBeDisabled` でボタンの状態が無効かどうか検査しています。

## スナップショットテストとアサーションテストのメリットとデメリット

スナップショットテストアサーションテストのそれぞれの実装例を見てきました。実際の開発の現場ではどちらのアプローチのテストを採用すべきなのでしょうか？それぞれのアプローチのメリットとデメリットを見ていきましょう。

### スナップショットテストのメリット

スナップショットのメリットは**実装のコスト小さい**ことでしょう。多くのコードを書かずとも、ただ 1 つのアサーション文（`toMatchSnapshot()`）で簡単にテストを書くことができます。

実装例で上げた `<Form>` コンポーネントでは、`<button>` 要素の `disabled` 属性の有無を検査するだけでテストを完結させることができたので、アサーションテストの場合とコード量はさほど変わりありませんでした。しかし、実際の開発ではテスト対象のコンポーネントが複雑になることが多いです。名前の入力欄に入力した結果多くの要素が変更される場合もあるでしょう。このような場合にスナップショットテストではそれぞれの要素を個別に取得して検査する必要があります。

```tsx:Form.test.tsx
render(<Form />)

// 名前の入力欄に文字を入力したら
await userEvent.type(screen.getByRole("textbox", { name: "名前" }), "a")

// ボタンが有効になって...
expect(screen.getByRole("button", { name: "送信" })).toBeEnabled()
// エラーメッセージが非表示になって...
expect(screen.queryByRole("alert")).not.toBeInTheDocument()
// ウェルカムメッセージの内容も更新されて...
expect(screen.getByText("ようこそ、a さん")).toBeInTheDocument()
// もっとあるかもしれない...
```

スナップショットテストはもう少し手軽に書くことができます。

```tsx:Form.test.tsx
render(<Form />)

// 名前の入力欄に文字を入力したら
await userEvent.type(screen.getByRole("textbox", { name: "名前" }), "a")

expect(container.childNodes).toMatchSnapshot()
```

### スナップショットテストのデメリット

テストの実装コストが低い反面、スナップショットテストには以下のデメリットがあると考えられます。

- テストが壊れやすい
- アサーションから期待する結果を読み取れない

#### テストが壊れやすい

スナップショットテストはファイルの内容を変更するたびにテストの失敗を報告してきます。テストが失敗するとき、その変更内容がコンポーネントの仕様の変更によるものであれば正当な理由だと言えます。例えば、名前が入力されたときに初めて「送信」ボタンを有効とするのではなく、常にボタンは有効にしておき、名前が入力されていない場合に送信しようとした場合にはエラーメッセージでフィードバックを返すように仕様変更したとします。

この場合には当然テストが失敗することが期待されます。もはや「送信」ボタンが `disabled` であって欲しくないからです。アサーションテストのアプローチでも同様にテストが失敗することが期待されます。

問題となるのはコードのリファクタリングを行ったときでもテストが失敗してしまうことです。例えば `<button>` 要素の `className` には `"blue-button"` という値が設定されていますが、CSS の構造をよりわかりやすくするため `"primary-button"` という値に変更したとします。クラス名が変更されたとしても、最終的にユーザーの目に見える結果は変わりません。しかし、スナップショットテストではクラス名の変更によりテストが失敗してしまいます。

```sh
 FAIL  src/Form.test.tsx > form > 名前の入力欄に 1 文字以上入力されている場合、送信ボタンが押せること
Error: Snapshot `form > 名前の入力欄に 1 文字以上入力されている場合、送信ボタンが押せること 1` mismatched

- Expected
+ Received

  NodeList [
    <form>
      <label
        class="form-label"
        for="name"
      >
        名前
      </label>
      <input
        class="form-control"
        id="name"
        type="text"
        value="a"
      />
      <button
-       class="blue-button"
+       class="primary-button"
        type="submit"
      >
        送信
      </button>
    </form>,
  ]

 ❯ src/Form.test.tsx:18:34
     16|     await userEvent.type(screen.getByLabelText("名前"), "a")
     17| 
     18|     expect(container.childNodes).toMatchSnapshot()
       |                                  ^
     19|   })
     20| })
```

ここでの問題点は、**テストの関心事とは無関係の変更によりテストが失敗してしまう**ということです。このテストで検査したいことは「名前の入力欄に 1 文字以上入力されている場合、送信ボタンが押せること」というユーザーの目に見える結果です。`className` の変更といった実装の詳細が変更されたとしても、ユーザーの目に見える結果は変わりません。

単体テストの目的の 1 つにリファクタリングに対する耐性が上げられます。これは内部のコードを変更した前後でも、外部から見た振る舞いが壊れていないことを保証してくれる度合いです。この耐性が高ければ、開発者は安全にコードを変更できます。

厳密に述べると、スナップショットテストの失敗はテストそのものが壊れているわけではありません。開発者はスナップショットテストが失敗した場合には、diff を見比べて予想外の変更を確認することで外部から見た振る舞いが壊れていないかを確認できます。スナップショットを確認して問題なければ、スナップショットを更新するオプション（`-u`）とともにテストを実行することでテストをパスさせることができます。

理想的な運用方法を上げると、コードレビューのプロセスの一部としてスナップショットファイルの diff を確認すべきです。ですが、開発者が目視でスナップショットファイルの diff を確認することは大きな負担となりえます。はじめのうちはすべてのスナップショットの差分を確認するフローが確立されていたとしても、開発者はスナップショットテストの失敗を無視するようになってしまうでしょう。変更内容に関係なく、ファイルを変更すればいつもスナップショットテストが差分を報告してくるためです。

ファイルに 1 行でも変更が加えられるたびに変更が生じますし、コンポーネントが多くのコンポーネントから呼び出されている場合には、スナップショットファイルの diff が膨大なものになることもあります。


このデメリットを軽減する手法として、スナップショットをなるべく小さくする方法があげられます。スナップショットの範囲を狭めることで、スナップショットの変更が起きる頻度を下げることができます。スナップショットの範囲を狭めるために [snapshot-diff](https://github.com/jest-community/snapshot-diff) と呼ばれるライブラリが使えます。このライブラリは文字通り、差分をスナップショットとして保存します。

`<Form>` コンポーネントのスナップショットを `snapshot-diff` を使って書き換えてみましょう。「名前が入力されている状態」と「名前が入力されていない状態」の 2 つのスナップショットの差分を保存します。

```tsx:Form.test.tsx
describe("form", () => {
  test("名前の入力欄に何も入力されていない場合、送信ボタンが押せず、1 文字以上入力すると送信ボタンが押せる", async () => {
    const { container } = render(<Form />)
    // 名前を入力する前の DOM をコピーしておく
    const copy = container.cloneNode(true)

    await userEvent.type(screen.getByLabelText("名前"), "a")

    // 名前を入力した後の DOM とコピーした DOM を比較する
    expect(snapshotDiff(copy, container)).toMatchSnapshot()
  })
})
```

このテストで保存されるスナップショットは変化があった部分に限定されるので、元のスナップショットよりも小さくなります。スナップショットファイルを見ると、`<input>` 要素と `<button>` 要素のみが保存されていることがわかります。

```tsx:__snapshots__/Form.test.tsx.snap
exports[`form > 名前の入力欄に何も入力されていない場合、送信ボタンが押せず、1 文字以上入力すると送信ボタンが押せる 1`] = `
"Snapshot Diff:
- First value
+ Second value

@@ -8,15 +8,14 @@
      </label>
      <input
        class=\\"form-control\\"
        id=\\"name\\"
        type=\\"text\\"
-       value=\\"\\"
+       value=\\"a\\"
      />
      <button
        class=\\"blue-button\\"
-       disabled=\\"\\"
        type=\\"submit\\"
      >
        送信
      </button>
    </form>"
`;
```

これにより例えばこのテストにおいて無関係である `<label>` 要素が変更されたとしても、スナップショットの変更は発生しません。スナップショットの範囲を狭めることで、スナップショットの変更が起きる頻度を下げることができます。

ただしこの方法も万全ではなくスナップショット範囲外の変更でも差分が発生してしまうことがあります。たとえば `<form>` 要素のすぐ下に `<div>` 要素が追加された場合、インデントが変わることでスナップショットの変更が発生してしまいます。

#### アサーションから期待する結果を読み取れない

スナップショットテストによる確認フェーズのコードは常に `toMatchSnapshot()` という 1 行のみです。この 1 行のみのコードから、テストが期待する結果を読み取ることは難しいでしょう。アサーションテストの場合は `toBeDisabled()` という関数名から「ボタンが無効であること」をコードから読み取ることができます。

スナップショットテストから期待する結果を予測できるように、`test("...")` または `it("...")` において記述するテストのタイトルを明確にする工夫が必要です。ただし、これはコードに対応するコメントを書くときと同じ問題を招きます。コードが変更されたときに必ずしもテストのタイトルが変更される保証はありません。テストのタイトルが変更されないままコードが変更された場合には、テストのタイトルとコードの期待する結果が一致しなくなってしまいます。

また具体的にどのような出力が得られるのか確認するためには、スナップショットファイルを見に行く必要が愛あります。スナップショットファイルは別のディレクトリに保存されていますからひと手間かかります。

## アサーションテストのメリットとデメリット

アサーションテストのメリットとデメリットは、スナップショットテストのそれとは逆の側面を持っています。アサーションテストの良い点はテストが壊れにくく、信頼性が高い点と、アサーションから読み取れる結果が明確であるところです。

アサーションテストの信頼性が高くなる理由の 1 つとして、Testing Library がユーザーの目に見える結果を検査するための API を提供している点があげられます。Testing Library は実装の詳細をテストするのでなく、ユーザーの操作に近い形式でテストを書けるように設計されています。

例えば `getByRole` というクエリは、まさにユーザーが操作するときの要素の見つけ方に近い形式で要素を取得できます。ユーザーは「送信」という名前がつけられた「ボタン」をクリックすることでフォームを送信します。この操作をテストと同等になるのが `screen.getByRole("button", { name: "送信" })` です。`getByRole` では「送信」という名前と「ボタン」という役割のみに注目して要素を取得しているため、実装の詳細が変更されてもユーザーから見える結果が変わらないのであればテストが失敗することはありません。

`toBeDisabled` というアサーションも同様に、対象の要素が有効か無効化という観点のみを検査しています。スナップショットテストと比べて、テストの対象の範囲を明確に絞り込んでいる点も、テストの関心事と無関係な変更によるテストの失敗を防ぐために有効です。

## スナップショットテストとアサーションテストのどちらを採用すべきか

スナップショットテストとアサーションテストのそれぞれのメリットとデメリットを見てきました。私の意見としてはアサーションテストを採用することをおすすめします。実装の詳細に立ち入らないテストを書くことができるというメリットが、テストの信頼性に大きく影響すると考えているからです。

ただし、この決定は開発メンバーのスキルであったり、現状のコードに既にテストが書かれているかどうかといった環境といった変数によって左右されると考えています。

例えばフロントエンドのテスト事情に精通したメンバーがいるのであれば、アサーションテストを書くことに難しさを感じないかもしれません。1 人のメンバーがテストの書き方を知っていると手本となるテストコードがある状態となり、他のメンバーもテストを書きやすくなるでしょう。

また今までフロントエンドのテストが書かれていないような荒れ果てた状態であるなら、実装のコストが低いスナップショットテストが有利になると考えられます。往々にして現在テストが書かれていないのであれば、コンポーネントがテスト可能なインターフェースとなっていないことが多いでしょう。このような状態であれば、まずはスナップショットテストを導入してテストを書き始め、テストが書けるようになったら徐々にアサーションテストに移行するという方法もあります。

アサーションテストはスナップショットよりも好ましいが、全くテストがない状態よりも、スナップショットテストがある方がまだましといったイメージです。

他にも、テストの種類によってはスナップショットテストを使うべきという場合もあります。ここまでの議論では、「ユーザーが何か操作した後、要素の状態が変化することを検査するテスト」と元に行っていました。一方で「コンポーネントがレンダリングする UI が予期せぬ変更がないかどうかを検査するテスト」はスナップショットテストのアプローチが有利になるでしょう。

```tsx:Form.tsx
describe("form", () => {
  test("レンダリングが正しく行われていること", () => {
    const { container } = render(<Form />)

    expect(container.childNodes).toMatchSnapshot()
  })
})
```

アサーションテストのアプローチでは、誤って `className` が変更されてしまったり DOM の構造が変更されてしまったといった状況を検知できません。

## まとめ

- スナップショットテストは予期せぬ変更が生じていないか人間の目で見て確認するためのテスト
- アサーションテストはユーザーの操作に近い形式でテストを書けるため、テストの信頼性が高い
- 基本的にはより信頼性の高いアサーションテストを採用すべきだが、状況によってスナップショットが有利になる

## 参考

- [Snapshot Testing for Frontends. Test whether any characteristics of… | by Viduni Wickramarachchi | Bits and Pieces](https://blog.bitsrc.io/whats-snapshot-testing-and-can-we-use-it-for-frontend-f5a441cae27a)
- [When should I use Snapshot testing?](https://stackoverflow.com/questions/43771602/when-should-i-use-snapshot-testing)
- [Jest 14.0: React Tree Snapshot Testing · Jest](https://jestjs.io/blog/2016/07/27/jest-14)
- [Jest: When to use Snapshot tests versus when to use DOM matchers : r/reactjs](https://www.reddit.com/r/reactjs/comments/butgd8/jest_when_to_use_snapshot_tests_versus_when_to/)
