---
id: GIBK8_CdcnoKSpJ4EkjZc
title: "React 19.3 の Fragment Refs で子コンポーネント内の入力欄にフォーカスする"
slug: "react-fragment-refs"
about: "React 19.3 の Fragment Refs は、ラッパー要素を追加せずに複数の DOM 要素を操作する機能です。この記事では配送先フォームを例に、Fragment Refs の使い方を紹介します。"
createdAt: "2026-09-13T11:53+09:00"
updatedAt: "2026-09-13T11:53+09:00"
tags: ["React"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/c8dMGeOpSReuKimWBgL59/93337b644c8597a3df155447acb72d4b/grocery-shopping_12590.png"
  title: "食料品の買い物のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Fragment に ref を渡したとき、ref の値として受け取るものはどれですか？"
      answers:
        - text: "最初の子要素を表す DOM 要素"
          correct: false
          explanation: "最初の子要素そのものではなく、グループへの操作を提供する FragmentInstance を受け取ります。"
        - text: "グループを操作する FragmentInstance"
          correct: true
          explanation: "FragmentInstance は focus() などのメソッドを持ち、Fragment 内の DOM 要素を操作します。"
        - text: "すべての子要素を保持する DOM 配列"
          correct: false
          explanation: "DOM 要素の配列を受け取る API ではありません。公開されたメソッドを通じて操作します。"
        - text: "自動で追加されたラッパーの DOM 要素"
          correct: false
          explanation: "Fragment は DOM 要素を追加しないため、ラッパー要素も作られません。"
    - question: "条件付きで表示する配送先フォームで、ref コールバックから focus() を呼ぶ理由はどれですか？"
      answers:
        - text: "編集中の入力値を state に同期するため"
          correct: false
          explanation: "この例では編集中の値を state に同期せず、defaultValue を指定した入力欄に保持しています。ref コールバックはフォーカスのタイミングに使います。"
        - text: "親コンポーネントの再描画を防ぐため"
          correct: false
          explanation: "ref コールバックは再描画を防ぐ仕組みではありません。表示の切り替えには state を使います。"
        - text: "Fragment にフォーカス用の DOM を作るため"
          correct: false
          explanation: "Fragment 自体の DOM は作られません。内側のフォーカス可能な要素を探索します。"
        - text: "入力欄の DOM が配置された後に操作するため"
          correct: true
          explanation: "setEditing(true) の直後には新しい入力欄がまだありません。ref が設定されるタイミングで操作します。"
published: true
---

注文内容の確認画面で「配送先を編集」ボタンを押したら、編集フォームを表示し、最初の入力欄へフォーカスを移したい場面を考えてみましょう。

!v(https://videos.ctfassets.net/in6v9lxmm5c8/6UrB92FhUipJ25D76GKYwV/32fde6046cdf6de2e71e8961a3ed4dfb/react-fragment-refs-1.mp4 622x514)

React においては入力欄が同じコンポーネント内にあれば、`<input>` に `ref` を渡して `focus()` を呼び出す方法が使えます。

```jsx
import { useRef, useState } from "react";
import { flushSync } from "react-dom";

export default function ShippingAddress() {
  const [editing, setEditing] = useState(false);
  const postalCodeRef = useRef(null);

  function handleEdit() {
    // フォームを表示してからフォーカスするために flushSync で同期的に state を更新する
    flushSync(() => {
      setEditing(true);
    });
    postalCodeRef.current?.focus();
  }

  return (
    <>
      <button type="button" onClick={handleEdit}>
        配送先を編集
      </button>
      {editing && (
        <form onSubmit={(event) => event.preventDefault()}>
          <label>
            郵便番号
            <input name="postalCode" ref={postalCodeRef} />
          </label>
        </form>
      )}
    </>
  );
}
```

しかし、入力欄が別のコンポーネントに分かれている場合、親から内部の DOM 要素へアクセスするための仕組みが必要です。子コンポーネントに ref を受け渡す処理を追加したり、ラッパー要素の ref から対象を検索したりする方法がありますが、子の実装や DOM 構造に依存することになります。

例えば、郵便番号以外の入力欄が増えてきた場合、フォームのコンポーネントを分割したくなることでしょう。`AddressFields` に分ける場合は、親から受け取った ref を子の `input` へ渡します。

```jsx
import { useRef, useState } from "react";
import { flushSync } from "react-dom";

function AddressFields({ ref }) {
  return (
    <>
      <label>
        郵便番号
        <input
          name="postalCode"
          autoComplete="shipping postal-code"
          required
          ref={ref}
        />
      </label>
      <label>
        住所
        <input
          name="street"
          autoComplete="shipping address-line1"
          required
        />
      </label>
      <label>
        建物名・部屋番号
        <input
          name="building"
          autoComplete="shipping address-line2"
        />
      </label>
    </>
  );
}

export default function ShippingAddress() {
  const [editing, setEditing] = useState(false);
  const postalCodeRef = useRef(null);

  function handleEdit() {
    flushSync(() => {
      setEditing(true);
    });
    postalCodeRef.current?.focus();
  }

  return (
    <>
      <button type="button" onClick={handleEdit}>
        配送先を編集
      </button>
      {editing && (
        <form onSubmit={(event) => event.preventDefault()}>
          <AddressFields ref={postalCodeRef} />
        </form>
      )}
    </>
  );
}
```

この場合も親の `handleEdit` でフォームの表示とフォーカスを処理できますが、`AddressFields` で正しく `ref` が受け取られることを前提とする必要があります。例えば郵便番号の前に新しい入力フォームが追加されたとしても、`ref` の渡し先の変更を忘れると、フォームの先頭の入力欄にフォーカスされるという挙動が崩れてしまいます。さらにライブラリのコンポーネントを使う場合は、そもそも `ref` を受け取る API が用意されていないこともあります。

React 19.3 で追加された [Fragment Refs](https://react.dev/blog/2026/09/09/react-19-3#fragment-refs) を使うと、ラッパー要素を追加せずに、Fragment で囲んだ要素をまとめて操作できます。配送先フォームであれば、子コンポーネントが個別の入力欄の ref を公開していなくても、最初のフォーカス可能な要素にフォーカスを移せます。

この記事では配送先の編集を例に、Fragment Refs の基本的な使い方を紹介します。

## Fragment Refs とは

[`Fragment`](https://react.dev/reference/react/Fragment) は、DOM 要素を追加せずに複数の要素をグループ化する React のコンポーネントです。`<>...</>` という省略記法で使ったことがある方も多いのではないでしょうか。

Fragment Refs では、この `Fragment` に `ref` を渡せます。受け取る値は `FragmentInstance` というオブジェクトで、Fragment 内の DOM 要素を操作するためのメソッドを持っています。

例えば、以下の例では「入力を始める」ボタンを押したときに、`fragmentRef` の `focus()` を呼び出しています。

```jsx
import { Fragment, useRef } from "react";

export default function FormFields() {
  const fragmentRef = useRef(null);

  return (
    <>
      <button type="button" onClick={() => fragmentRef.current?.focus()}>
        入力を始める
      </button>
      <Fragment ref={fragmentRef}>
        <label>
          郵便番号
          <input name="postalCode" />
        </label>
        <label>
          住所
          <input name="street" />
        </label>
      </Fragment>
    </>
  );
}
```

`fragmentRef.current.focus()` を呼ぶと、Fragment の内側からフォーカス可能な要素を探します。この例では先頭の郵便番号の入力欄が対象になります。

`ref` を指定する場合は、`<>...</>` という省略記法は使えません。`Fragment` をインポートして、`<Fragment ref={fragmentRef}>` と書く必要があります。

[React 19.3 のリリース記事](https://react.dev/blog/2026/09/09/react-19-3#fragment-refs)では、複数の兄弟要素を返すコンポーネントや、ref を内部へ受け渡さないコンポーネントを操作する難しさが、導入の背景として説明されています。また、ref を付けるためだけにラッパー要素の `div` を追加すると、スタイルやレイアウトに影響することもあるという指摘もあります。

## 配送先の編集フォームを作る

冒頭の配送先のコード例を Fragment Refs を使って書き換えてみましょう。

まずは `AddressFields.jsx` に配送先の入力欄を定義します。

```jsx:src/AddressFields.jsx
export default function AddressFields({ address }) {
  return (
    <>
      <label>
        郵便番号
        <input
          name="postalCode"
          autoComplete="shipping postal-code"
          defaultValue={address.postalCode}
          required
        />
      </label>
      <label>
        住所
        <input
          name="street"
          autoComplete="shipping address-line1"
          defaultValue={address.street}
          required
        />
      </label>
      <label>
        建物名・部屋番号
        <input
          name="building"
          autoComplete="shipping address-line2"
          defaultValue={address.building}
        />
      </label>
    </>
  );
}
```

`AddressFields` は ref を受け取っていません。これにより、親コンポーネントからどのように扱われるかを意識しないで済むようになっています。

続いて、配送先の表示と編集を切り替える親コンポーネントを作ります。`App.jsx` を次の内容にします。

```jsx:src/App.jsx {12-14, 35-37}
import { Fragment, useCallback, useRef, useState } from "react";
import AddressFields from "./AddressFields.jsx";

export default function App() {
  const [editing, setEditing] = useState(false);
  const [address, setAddress] = useState({
    postalCode: "100-0001",
    street: "東京都千代田区千代田 1-1",
    building: "サンプルビル 101",
  });
  const editButtonRef = useRef(null);
  const focusAddress = useCallback((instance) => {
    instance?.focus();
  }, []);

  function finishEditing() {
    setEditing(false);
    editButtonRef.current?.focus();
  }

  return (
    <main>
      <h1>配送先</h1>
      <button
        type="button"
        ref={editButtonRef}
        onClick={() => setEditing(true)}
      >
        配送先を編集
      </button>
      {editing ? (
        <form>
          <fieldset>
            <legend>配送先の住所</legend>
            <Fragment ref={focusAddress}>
              <AddressFields address={address} />
            </Fragment>
          </fieldset>
          <button type="submit">保存</button>
          <button type="button" onClick={finishEditing}>
            キャンセル
          </button>
        </form>
      ) : (
        <p>
          〒{address.postalCode}
          <br />
          {address.street}
          <br />
          {address.building}
        </p>
      )}
    </main>
  );
}
```

Fragment Refs に関係する処理は、次の 2 か所です。

```jsx
const focusAddress = useCallback((instance) => {
  instance?.focus();
}, []);

<Fragment ref={focusAddress}>
  <AddressFields address={address} />
</Fragment>;
```

`ref` には `useRef` で作ったオブジェクトのほかに、関数を渡せます。この関数を ref コールバックと呼びます。ref コールバックを使用することにより、`Fragment` の内側の DOM が描画されたタイミングで `focus()` を呼び出すことができます。

:::info
ref コールバックを `useCallback` で包んでいるのは、関数の同一性を保つためです。React はレンダーごとに異なる関数が `ref` に渡されると、前の ref コールバックをクリーンアップしてから新しい関数を呼び出します。`useCallback` を使わずに `<Fragment ref={(instance) => instance?.focus()}>` と書くと、`App` が再描画されるたびに `focus()` が実行され、ユーザーが住所の入力欄を編集している途中でも郵便番号の入力欄へフォーカスが戻ってしまう可能性があります。
:::

`<Fragment>` 直下の `AddressFields` は React コンポーネントですが、その内側にある DOM 要素が操作対象になります。親コンポーネントは、どの入力欄がどの順番で配置されているかを知らなくても、グループ内で最初のフォーカス可能な要素にフォーカスを移せます。

## フォーカスの探索範囲を理解する

Fragment Refs を使うときは、「Fragment の子」が何を指すかを押さえておきましょう。今回の JSX と DOM の関係を簡略化すると、以下のようになります。

```text
Fragment
└─ AddressFields（React コンポーネント）
   ├─ label
   │  └─ input（郵便番号）
   ├─ label
   │  └─ input（住所）
   └─ label
      └─ input（建物名・部屋番号）
```

`focus()` は内側を深さ優先で探索し、最初のフォーカス可能な DOM 要素を探します。深さ優先とは、次の兄弟要素へ進む前に、その要素の内側をたどることです。この例では最初の `label` の内側にある郵便番号の入力欄が見つかります。また入れ子になった要素や直接の子要素ではない `fieldset` 内の入力欄へのフォーカスも可能です。

フォーカス関連のメソッドには、ほかに `focusLast()` と `blur()` があります。`focusLast()` は末尾側のフォーカス可能な要素を探し、`blur()` は Fragment の内側にあるアクティブな要素からフォーカスを外します。

## 商品カードのインプレッションを計測する

Fragment Refs はフォーカス以外にも、複数の要素へのイベント登録や計測に利用できます。

EC サイトの商品一覧で、どの商品がユーザーの表示範囲に入ったかを計測したい場面を考えてみましょう。ページに描画しただけでは、スクロールしないと見えない商品まで計測してしまいます。そこで今回は、商品カードの面積の 50% 以上が表示領域と交差したときに、表示の記録であるインプレッションを 1 回だけ通知します。

商品カードが ref を公開していなくても、Fragment Refs を使えば親からその DOM 要素を監視できます。まずは、計測処理を担当する `ImpressionTracker.jsx` を作ります。

```jsx:src/ImpressionTracker.jsx {15, 17}
import { Fragment, useCallback, useRef } from "react";

export default function ImpressionTracker({ children, onImpression }) {
  const reportedRef = useRef(false);
  const observeImpression = useCallback((instance) => {
    if (instance === null || reportedRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      const reachedThreshold = entries.some(
        (entry) => entry.isIntersecting && entry.intersectionRatio >= 0.5,
      );
      if (!reachedThreshold || reportedRef.current) return;

      reportedRef.current = true;
      instance.unobserveUsing(observer);
      observer.disconnect();
      onImpression();
    }, { threshold: 0.5 });

    instance.observeUsing(observer);
    return () => {
      instance.unobserveUsing(observer);
      observer.disconnect();
    };
  }, [onImpression]);

  return <Fragment ref={observeImpression}>{children}</Fragment>;
}
```

ポイントは FragmentRef のメソッド `instance.observeUsing(observer)` です。`observeUsing(observer)` で Fragment の最上位の DOM 子要素を監視対象に登録します。今回は 1 つの `article` を返す商品カードを囲み、その要素の表示率を調べます。

条件を満たしたら `reportedRef.current` に記録済みの状態を保存し、監視を解除して `onImpression()` を呼び出します。アンマウントされた場合、ref コールバックから返したクリーンアップ関数 `unobserveUsing(observer)` が呼ばれ、監視が解除されます。

次に、商品一覧を実装します。計測時の処理は `console.log()` とし、通知される商品 ID を確認できるようにしています。

```jsx:src/VisibilityExample.jsx
import ImpressionTracker from "./ImpressionTracker.jsx";

const products = [
  { id: "p1", name: "コットンシャツ", price: "4,900 円" },
  { id: "p2", name: "リネンシャツ", price: "5,900 円" },
  { id: "p3", name: "デニムパンツ", price: "8,900 円" },
  { id: "p4", name: "チノパンツ", price: "6,900 円" },
  { id: "p5", name: "トートバッグ", price: "3,900 円" },
  { id: "p6", name: "バックパック", price: "9,900 円" },
];

function ProductCard({ product }) {
  return (
    <article style={{ minHeight: "16rem", padding: "1rem", border: "1px solid #ccc" }}>
      <h2>{product.name}</h2>
      <p>{product.price}</p>
      <button type="button">お気に入りに追加</button>
    </article>
  );
}

export default function VisibilityExample() {
  return (
    <main>
      <h1>商品一覧</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
        {products.map((product) => (
          <ImpressionTracker
            key={product.id}
            onImpression={() => {
              console.log("product_impression", { productId: product.id });
            }}
          >
            <ProductCard product={product} />
          </ImpressionTracker>
        ))}
      </div>
    </main>
  );
}
```

`ProductCard` は商品を描画するだけで、ref の受け渡しや計測処理を持ちません。親が `ImpressionTracker` で囲むことで、商品 ID とインプレッションを対応付けています。また、`ImpressionTracker` は DOM 要素を追加しないため、`<div>` などのラッパー要素を使用する方法と比較して、Grid のレイアウトに影響を与えません。

開発者ツールのコンソールを開き、下の行の商品までスクロールすると、その商品 ID のログが出力されます。

```text
product_impression { productId: "p6" }
```

## 複数の入力フォームにイベントリスナーを登録する

プロフィールの編集画面で、1 つでも項目が変更されたら「未保存の変更あり」と表示したい場面を考えてみましょう。それぞれの入力欄を別のコンポーネントが描画している場合も、Fragment Refs でグループ化すると、その内側で発生したイベントをまとめて受け取れます。

まずは、`input` イベントを登録する `InputGroup.jsx` を作ります。

```jsx:src/InputGroup.jsx {7, 9}
import { Fragment, useCallback } from "react";

export default function InputGroup({ children, onInput }) {
  const attachListener = useCallback((instance) => {
    if (instance === null) return;

    instance.addEventListener("input", onInput);
    return () => {
      instance.removeEventListener("input", onInput);
    };
  }, [onInput]);

  return <Fragment ref={attachListener}>{children}</Fragment>;
}
```

`addEventListener("input", onInput)` は、Fragment の最上位の DOM 子要素にリスナーを登録します。ref コールバックから返すクリーンアップ関数では、同じイベント名と関数を `removeEventListener()` に渡して解除します。

続いて、表示名と自己紹介の入力フォームを `InputGroup` で囲みます。

```jsx:src/EventExample.jsx
import { useCallback, useState } from "react";
import InputGroup from "./InputGroup.jsx";

function DisplayNameField({ defaultValue }) {
  return (
    <label>
      表示名
      <input name="displayName" defaultValue={defaultValue} />
    </label>
  );
}

function BioField({ defaultValue }) {
  return (
    <label>
      自己紹介
      <textarea name="bio" defaultValue={defaultValue} rows={4} />
    </label>
  );
}

export default function EventExample() {
  const [profile, setProfile] = useState({ displayName: "サンプル", bio: "" });
  const [dirty, setDirty] = useState(false);
  const markDirty = useCallback(() => setDirty(true), []);

  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setProfile({
      displayName: String(data.get("displayName")),
      bio: String(data.get("bio")),
    });
    setDirty(false);
  }

  return (
    <main>
      <h1>プロフィールの編集</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gap: "1rem", maxWidth: "32rem" }}>
          <InputGroup onInput={markDirty}>
            <DisplayNameField defaultValue={profile.displayName} />
            <BioField defaultValue={profile.bio} />
          </InputGroup>
        </div>
        <p role="status">{dirty ? "未保存の変更あり" : "変更なし"}</p>
        <button type="submit" disabled={!dirty}>保存</button>
      </form>
    </main>
  );
}
```

親は `InputGroup` に渡した `markDirty` で、どちらかの入力欄が変更されたことを受け取ります。これによりすべての入力欄に個別の `onInput` を登録する必要がなくなります。

## まとめ

- Fragment の `addEventListener()` で最上位の DOM 子要素にリスナーを登録し、`removeEventListener()` で解除できる
- React 19.3 の Fragment Refs は、DOM 要素を追加せずに、Fragment 内の要素を操作する `FragmentInstance` を提供する
- `focus()` は子コンポーネントや DOM 要素の内側を探索し、最初のフォーカス可能な要素へフォーカスを移す
- 条件付きで表示する配送先フォームでは、Fragment の ref コールバックで DOM が配置された後にフォーカスできる

## 参考

- [React 19.3](https://react.dev/blog/2026/09/09/react-19-3)
- [Fragment — React](https://react.dev/reference/react/Fragment)
- [Add ref to Fragment (alternative) — react/react #32465](https://github.com/react/react/pull/32465)
- [Manipulating the DOM with Refs — React](https://react.dev/learn/manipulating-the-dom-with-refs)
- [Common components: ref callback function — React](https://react.dev/reference/react-dom/components/common#ref-callback)
