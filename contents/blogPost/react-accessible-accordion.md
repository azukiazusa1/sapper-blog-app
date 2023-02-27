---
id: UxAWEOi6kjIuxbvg7JcAR
title: "【React】アクセシビリティに考慮したアコーディオンを実装する"
slug: "react-accessible-accordion"
about: "アコーディオンは見出しであるヘッダーとコンテンツであるパネルから構成された UI が垂直に積み重ねられたセットです。ユーザーはヘッダーをクリックすることで、ヘッダーに関連付けられたパネルの表示・非表示を切り替えることができます。  アコーディオンは1つのページ内で複数のセクションのコンテンツを表示する際に、スクロールを減らすためによく　使用されます。例えば、「よくある質問」のようなページで使われていることを見たことがあるかと思います"
createdAt: "2022-10-29T00:00+09:00"
updatedAt: "2022-10-29T00:00+09:00"
tags: ["React", "アクセシビリティ"]
published: true
---
アコーディオンは見出しである**ヘッダー**とコンテンツである**パネル**から構成された UI が垂直に積み重ねられたセットです。ユーザーはヘッダーをクリックすることで、ヘッダーに関連付けられたパネルの表示・非表示を切り替えることができます。

アコーディオンは 1 つのページ内で複数のセクションのコンテンツを表示する際に、スクロールを減らすためによく　使用されます。例えば「よくある質問」のようなページで使われていることを見たことがあるかと思います。

## アコーディオンの要件

アコーディオンをアクセシブルにするためには、以下の実装を行う必要があります。

### ロール・ステート・プロパティ

- それぞれのアコーディオンヘッダーには [button](https://w3c.github.io/aria/#button) ロールを含める
- それぞれのアコーディオンヘッダーのボタンはページ内で適切な値が設定された [aria-level](https://w3c.github.io/aria/#aria-level) 属性を持つ [heading](https://w3c.github.io/aria/#heading) ロール（`<h1>`,`<h2>`,`<h3>`,`<h4>`,`<h5>`,`<h6>` のいずれかのこと）でラップされていること
- `heading` ロールを持つ要素の中身には `button` 要素のみが存在していること
- アコーディオンヘッダーに関連するアコーディオンパネルが表示されている場合、`button` 要素の [aria-expaneded](https://w3c.github.io/aria/#aria-expanded) に `true` を設定すること。アコーディオンパネルが閉じている場合 `aria-expanede` に `false` を設定する
- アコーディオンヘッダーの `button` 要素の [aria-controls](https://w3c.github.io/aria/#aria-controls) に関連するアコーディオンパネルの ID を指定する
- アコーディオンヘッダーに関連するアコーディオンパネルが表示されており、かつアコーディオンパネルを閉じることを許可していない場合、`button` 要素の [aria-disabled](https://w3c.github.io/aria/#aria-disabled) を `true` に設定すること

### キーボード操作

- `Enter` または `Space`：
  - アコーディオンパネルが非表示の場合：アコーディオンヘッダーにフォーカスがあるとき、関連するアコーディオンパネルを表示する。もし実装が 1 つのパネルのみを表示することを許可している場合、他に表示されているパネルがあれば非表示にする
  - アコーディオンパネルが表示されている場合：関連するアコーディオンパネルを非表示にする。もし実装で常に 1 つにパネルを展開する必要がある場合、パネルの非表示機能はサポートされない
- `Tab`：次のフォーカス可能な要素にフォーカスする
- `Shift + Tab`：前のフォーカス可能な要素にフォーカスする

## 実装

それでは、前述の要件を満たしたアコーディオンの実装を考えてみます。

### ベースとなるアコーディオンの実装

以下のアクセシビリティに関する機能が実装されていないアコーディオンをベースとして考えてみます。

```tsx
import React, { useState, createContext, useContext } from "react";

type AccordionContextType = {
  isOpen: boolean;
  toggle: () => void;
};

const AccordionContext = createContext({} as AccordionContextType);

const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("AccordionContext is not defined");
  }
  return context;
};

const AccordionHeader: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { toggle } = useAccordionContext();
  return <div onClick={() => toggle()}>{children}</div>;
};

const AccordionPanel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isOpen } = useAccordionContext();

  return <div>{isOpen && children}</div>;
};

type AccordionProps = {
  children: (args: {
    isOpen: boolean;
    AccordionHeader: React.FC<{ children: React.ReactNode }>;
    AccordionPanel: React.FC<{ children: React.ReactNode }>;
  }) => React.ReactNode;
};

const Accordion: React.FC<AccordionProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  return (
    <AccordionContext.Provider value={{ isOpen, toggle }}>
      {children({ isOpen, AccordionHeader, AccordionPanel })}
    </AccordionContext.Provider>
  );
};

export default Accordion;
```

アコーディオンの開閉状態と開閉状態を操作する関数をコンテキストを利用して共有するようにしています。コンテキストの値は `AccordionHeader` と `AccordionPanel` のそれぞれのコンポーネントから利用されます。

アコーディオンコンテキストの Provider となる `Accordion` コンポーネントでは `children` を関数として利用しています。アコーディオンヘッダーとアコーディオンパネルは関数の非キスとして提供することになります。

実際に使用例は以下のようになります。

```tsx
function App() {
  return (
    <div className="App">
      <Accordion>
        {({ isOpen, AccordionHeader, AccordionPanel }) => (
          <>
            <AccordionHeader>
              Accordion Header {isOpen ? "▼" : "▲"}
            </AccordionHeader>
            <AccordionPanel>Accordion Panel</AccordionPanel>
          </>
        )}
      </Accordion>
    </div>
  );
}
```

### ロール・ステート・プロパティを付与する

それではベースとなるアコーディオンコンポーネントに適切なロールを付与します。変更が必要なのは大半がアコーディオンヘッダーとなります。まずはアコーディオンヘッダーを `button` 要素にしたうえで `heading` タグでラップします。

```tsx
const AccordionHeader: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { toggle } = useAccordionContext();
  return (
    <h2>
      <button onClick={toggle}>{children}</button>
    </h2>
  );
};
```

ここでは `heading` 要素を固定で `<h2>` としましたが、この実装には問題があります。要件にもあるとおり、`heading` 要素はページの中で適切な構造となっていなければいけません。これは例えば `<h3>` の後に `<h2>` を使うようなど見出しレベルの順番が逆転していたり、`<h2>` の後に `<h4>` を使うなど見出しレベルを飛ばすような実装になっていてはいけないということです。

React のようなコンポーネントベースのライブラリではそのコンポーネントがどこで使用されるかあらかじめ決定されていないので、`heading` を適切な構造で使用するためには一工夫必要です。アコーディオンコンポーネントのヘッダーが `<h2>` タグで固定されていると `<h2>` より下の見出しレベルのセクションでは正しくアコーディオンコンポーネントが使用できないことになってしまいます。

!> React における `heading` 要素の使い分けについては [React で h1-h6 を正しく使い分ける](https://zenn.dev/neet/articles/f25abb616ec105) が参考になります。

この問題を解決する方法はいくつかありますが、ここでは見出しレベルを Props として受け取るように実装してみましょう。アコーディオンコンポーネントの Props として `level` を受け取るように変更し、受け取った `level` はコンテキストの Provider として提供します。

```tsx
type AccordionContextType = {
  isOpen: boolean;
  toggle: () => void;
  level: 1 | 2 | 3 | 4 | 5 | 6;
};

// 省略

type AccordionProps = {
  children: (args: {
    isOpen: boolean;
    AccordionHeader: React.FC<{ children: React.ReactNode }>;
    AccordionPanel: React.FC<{ children: React.ReactNode }>;
  }) => React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
};

const Accordion: React.FC<AccordionProps> = ({ children, level = 2 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  return (
    <AccordionContext.Provider value={{ isOpen, toggle, level }}>
      {children({ isOpen, AccordionHeader, AccordionPanel })}
    </AccordionContext.Provider>
  );
};
```

続いていかのように `Heading` コンポーネントを作成します。このコンポーネントはアコーディオンコンテキストから見出しレベルを取得して、適切な見出しタグを返却します。`AccordingHeader` からはこの `Heading` コンポーネントを利用するように修正します。

```tsx
const Heading = ({ children }: { children: React.ReactNode }) => {
  const { level } = useAccordionContext();

  return React.createElement(`h${level}`, {}, children);
};

const AccordionHeader: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { toggle } = useAccordionContext();
  return (
    <Heading>
      <button onClick={toggle}>{children}</button>
    </Heading>
  );
};
```

これにより、アコーディオンコンポーネントを利用する際にその構造に合った見出しレベルとして利用できます。

続いてアコーディオンパネルの開閉状態に応じて `button` 要素に `aria-expanded` を設定するように修正します。これは単純にアコーディオンコンテキストから開閉状態を取得して設定すればよいでしょう。

```tsx
const AccordionHeader: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { toggle, isOpen } = useAccordionContext();
  return (
    <Heading>
      <button onClick={toggle} aria-expanded={isOpen}>
        {children}
      </button>
    </Heading>
  );
};
```

最後に関連するアコーディオンパネルを示すために `aria-controls` を設定しましょう。アコーディオンパネルの ID は React 18 から使用できる `useId` フックを使用して生成してアコーディオンコンテキストから取得するようにします。

```tsx
type AccordionContextType = {
  isOpen: boolean;
  toggle: () => void;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  panelId: string;
};

// 省略

const AccordionHeader: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { toggle, isOpen, panelId } = useAccordionContext();
  return (
    <Heading>
      <button onClick={toggle} aria-expanded={isOpen} aria-controls={panelId}>
        {children}
      </button>
    </Heading>
  );
};

const AccordionPanel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isOpen, panelId } = useAccordionContext();

  return <div id={panelId}>{isOpen && children}</div>;
};

// 省略

const Accordion: React.FC<AccordionProps> = ({ children, level = 2 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const panelId = useId();
  return (
    <AccordionContext.Provider value={{ isOpen, toggle, level, panelId }}>
      {children({ isOpen, AccordionHeader, AccordionPanel })}
    </AccordionContext.Provider>
  );
};
```

### キーボード操作

キーボード操作ですが、実はアコーディオンヘッダーを `button` 要素にした時点で要件は満たしています。そのため追加の実装は必要ありません。

コードの全体像は以下のようになります。実際に触ってみて正しく動作するか確かめてみてください。

<iframe
  width="100%"
  height="500px"
  src="https://stackblitz.com/edit/react-ts-zjjmb5?embed=1&file=Accordion.tsx"
></iframe>

## 参考

- [Accordion (Sections With Show/Hide Functionality)](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)
- [アクセシブルなアコーディオンの実装について考える](https://zenn.dev/yend724/articles/20220710-y5c9rgsmah5j78n3)

