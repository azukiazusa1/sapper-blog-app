---
id: 6CVLhghaW28Qe7jG3VuDM9
title: "アクセシビリティに考慮したツールチップを実装する"
slug: "accessible-tooltip"
about: "ツールチップとは、ある要素に対する補足情報を与える UI です。通常ある要素に対してマウスホバーまたはキーボードでフォーカスした時少しのディレイの後に、ユーザーの操作によらず自動的にポップアップして表示されます。このポップアップはユーザーの操作をブロッキングするものではありません。ユーザーがマウスのホバー外すかフォーカスが外れた場合にツールチップは非表示となります。"
createdAt: "2023-02-05T00:00+09:00"
updatedAt: "2023-02-05T00:00+09:00"
tags: ["アクセシビリティ", "React"]
published: true
---
ツールチップとは、ある要素に対する補足情報を与える UI です。通常ある要素に対してマウスホバーまたはキーボードでフォーカスした時少しのディレイの後に、ユーザーの操作によらず自動的にポップアップして表示されます。このポップアップはユーザーの操作をブロッキングするものではありません。ユーザーがマウスのホバー外すかフォーカスが外れた場合にツールチップは非表示となります。

ツールチップに表示する説明はあくまで補足的なものであり、重要な情報を含んではいけません。ユーザーはツールチップの情報なしに操作を完了できる必要があります。

ツールチップは以下の要素から構成されます。

- [tooltip](https://w3c.github.io/aria/#tooltip) ロール：マウスホバーや、キーボードでフォーカスした際に表示されるポップアップ。
- ツールチップをトリガーする要素。フォーカス可能である必要がある。

## ツールチップの要件

ツールチップをアクセシブルにするためには、以下の実装を行う必要があります。

### ロール・ステート・プロパティ

- ツールチップのコンテナとなる要素に [tooltip](https://w3c.github.io/aria/#tooltip) ロールを指定する
- ツールチップをトリガーする要素に [aria-describedby](https://w3c.github.io/aria/#aria-describedby) でツールチップの内容を

### キーボード操作

- `Escape`：ツールチップを閉じる

### その他考慮事項

- ツールチップそのものはフォーカスを受け取らない。
- ツールチップはポップアップのように表示されるが、[aria-haspopup](https://w3c.github.io/aria/#aria-haspopup) プロパティにおけるポップアップとみなされない。そのため、ツールチップをトリガーする要素に `aria-haspopup` 属性は与えてはならない。
- ツールチップはユーザーの操作によらずマウスホバーまたはフォーカスを受け取った時点で自動的に表示されるため、[aria-expanded](https://w3c.github.io/aria/#aria-expanded) 属性はサポートされない
- ツールチップを使用して情報を隠す前に、常に見える説明を表示することを検討すること。

## 実装

それでは、前述した要件を満たしたツールチップの実装を考えてみます。ツールチップの親要素となる `<Tooltip.Root>`、ツールチップのトリガー要素となる `<Tooltip.Trigger>`、ツールチップ自体である `<Toopltip.Content>` から構成します。

```tsx:Tooltip.tsx
export const Tooltip = {
  Root,
  Trigger,
  Content,
};
```

### `<Tooltip.Root>`

トリガーとなる要素にマウスホバーやフォーカスした時に状態を変更し、その状態を元にツールチップ自体の表示非表示を行います。そのため、トリガー要素とツールチップ要素の共通の親要素が必要だと考えられます。これを `<Tooltip.Root>` としてここから `Context` を使用して状態を提供しようと思います。また、トリガー要素とツールチップは `aria-describedby` で紐付ける必要があるので、`useId` で生成した ID を `contentId` として渡します。

```tsx:Tooltip.tsx
const DELAY_MS = 500;

type ToolTipContextProps = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  contentId: string;
};

const TooltipContext = React.createContext<ToolTipContextProps | null>(null);

const useTooltipContext = () => {
  const context = React.useContext(TooltipContext);
  if (context === null) {
    throw new Error("useTooltipContext must be used within a TooltipProvider");
  }
  return context;
};

const Root = ({ children }: { children: React.ReactNode }) => {
  const contentId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const timerId = useRef<number | null>(null);

  const open = useCallback(() => {
    timerId.current = setTimeout(() => {
      setIsOpen(true);
    }, DELAY_MS);
  }, []);

  const close = useCallback(() => {
    if (timerId.current) {
      clearTimeout(timerId.current);
      timerId.current = null;
    }
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      if (timerId.current) {
        clearTimeout(timerId.current);
        timerId.current = null;
      }
    };
  }, [close]);

  return (
    <TooltipContext.Provider value={{ isOpen, open, close, contentId }}>
      <div className="tooltip-root">{children}</div>
    </TooltipContext.Provider>
  );
};
```

`open` 関数でツールチップの表示状態を `true` にします。ここではマウスオーバーやフォーカスした際にツールチップが表示されるまでディレイを設けたいので、`setTimeout` で `setIsOpen` を呼ぶタイミングを遅らせています。`close` 関数が呼ばれた際に `setTimeout` がまだ解決していない場合、`setIsOpen(false)` が呼ばれた後に `setIsOpen(true)` が呼ばれてしまします。そのため、`clearTimeout` で `setTimeout` がキャンセルされるようにしています。

```ts::Tooltip.tsx
const [isOpen, setIsOpen] = useState(false);
const timerId = useRef<number | null>(null);

const open = useCallback(() => {
  timerId.current = setTimeout(() => {
    setIsOpen(true);
  }, DELAY_MS);
}, []);

const close = useCallback(() => {
  if (timerId.current) {
    clearTimeout(timerId.current);
    timerId.current = null;
  }
  setIsOpen(false);
}, []);
```

ツールチップの要件の１つに、`Escape` キーを入力した際にツールチップが閉じることがあります。ここも忘れずに実装しておきましょう。`keydown` イベントを購読して、`event.key` が `"Escape"` だった場合に `close()` 関数を呼び出します。

```tsx:Tooltip.tsx
useEffect(() => {
  const closeOnEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      close();
    }
  };
  document.addEventListener("keydown", closeOnEscape);
  return () => {
    document.removeEventListener("keydown", closeOnEscape);
    if (timerId.current) {
      clearTimeout(timerId.current);
      timerId.current = null;
    }
  };
}, [close]);
```

最後に `<TooltipProvider>` を渡して要素を返します。

```tsx:Tooltip.tsx
return (
  <TooltipContext.Provider value={{ isOpen, open, close, contentId }}>
    <div className="tooltip-root">{children}</div>
  </TooltipContext.Provider>
);
```

`.tooltip-root` クラスは、ツールチップで `position: absolute` を使用するために `position: relative` を設定します。

```css:tooltip.css
.tooltip-root {
  position: relative;
  width: fit-content
}
```

### `<Tooltip.Trigger>`

トリガー要素となる `<Tooltip.Trigger>` です。この要素では `onMouseEnter`,`onFocus` でツールチップが開くように、`onMouseLeave`,`onBlur` でツールチップが閉じるように実装します。

```tsx:Tooltip.tsx
const Trigger: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { open, close, contentId } = useTooltipContext();
  const clonedChildren = React.cloneElement(children as React.ReactElement, {
    "aria-describedby": contentId,
  });

  return (
    <div
      onMouseEnter={() => open()}
      onMouseLeave={() => close()}
      onFocus={() => open()}
      onBlur={() => close()}
    >
      {clonedChildren}
    </div>
  );
};
```

`React.cloneElement` は `children` に Props を渡すために使用しています。ここでは `aria-describedby` を `children` の Props として渡しています。 ツールチップのトリガーとなる要素そのものとツールチップを紐付けたいためです。

### `<Tooltip.Content>`

`<Tooltip.Content>` はツールチップ自体となる要素です。コンテナとなる要素には `role="tooltip"` を与えます。また、トリガー要素となる要素と紐付けるために `id` として `contentId` を設定しています。

簡単な実装として、`isOpen` が `true` である場合には `.open` クラスを与えてツールチップを表示させます。

```tsx:Toottip.tsx
const Content: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOpen, contentId } = useTooltipContext();
  return (
    <div
      id={contentId}
      role="tooltip"
      className={`tooltip ${isOpen ? "open" : ""}`}
    >
      {children}
    </div>
  );
};
```

`.tooltip` と `.open` クラスのスタイルは以下のようになります。`

```css:tooltip.css
.tooltip {
  opacity: 0;
  min-width: 200px;
  position: absolute;
  z-index: 1;
  background-color: black;
  top:50%;
  transform:translateY(-50%);
  left:100%;
  margin-left:15px;
  color: white;
  padding: 5px;
  border-radius: 5px;
}

.tooltip.open {
  opacity: 1;
}
```

`Tooltip.tsx` 全体のコードは以下のようになります。

```tsx:Tooltip.tsx
import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import "./tooltip.css";

const DELAY_MS = 500;

type ToolTipContextProps = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  contentId: string;
};

const TooltipContext = React.createContext<ToolTipContextProps | null>(null);

const useTooltipContext = () => {
  const context = React.useContext(TooltipContext);
  if (context === null) {
    throw new Error("useTooltipContext must be used within a TooltipProvider");
  }
  return context;
};

const Root = ({ children }: { children: React.ReactNode }) => {
  const contentId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const timerId = useRef<number | null>(null);

  const open = useCallback(() => {
    timerId.current = setTimeout(() => {
      setIsOpen(true);
    }, DELAY_MS);
  }, []);

  const close = useCallback(() => {
    if (timerId.current) {
      clearTimeout(timerId.current);
      timerId.current = null;
    }
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      if (timerId.current) {
        clearTimeout(timerId.current);
        timerId.current = null;
      }
    };
  }, [close]);

  return (
    <TooltipContext.Provider value={{ isOpen, open, close, contentId }}>
      <div className="tooltip-root">{children}</div>
    </TooltipContext.Provider>
  );
};

const Trigger: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { open, close, contentId } = useTooltipContext();
  const clonedChildren = React.cloneElement(children as React.ReactElement, {
    "aria-describedby": contentId,
  });

  return (
    <div
      onMouseEnter={() => open()}
      onMouseLeave={() => close()}
      onFocus={() => open()}
      onBlur={() => close()}
    >
      {clonedChildren}
    </div>
  );
};

const Content: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOpen, contentId } = useTooltipContext();
  return (
    <div
      id={contentId}
      role="tooltip"
      className={`tooltip ${isOpen ? "open" : ""}`}
    >
      {children}
    </div>
  );
};

export const Tooltip = {
  Root,
  Trigger,
  Content,
};
```

### `<Tooltip>` コンポーネントを使用する

`<Tooltip>` コンポーネントを使用方法は以下のとおりです。必ず各要素を `<Tooltip.Root>` で囲むようにして、トリガー要素となる要素を `<Tooltip.Trigger>` で、ツールチップに表示したい内容を `<Tooltip.Content>` でラップします。`<Tooltip.Trigger>` はフォーカスした時もツールチップを表示できるように `<button>` や `<input>` のようなフォーカス可能な要素である必要があるでしょう。

```tsx
<Tooltip.Root>
  <Tooltip.Trigger>
    <button onClick={() => setCount((count) => count + 1)}>
      count is {count}
    </button>
  </Tooltip.Trigger>
  <Tooltip.Content>
    <p>when you click the button, the count will increase by 1.</p>
  </Tooltip.Content>
</Tooltip.Root>
```

![ツールチップを操作している様子。tab キーでフォーカスした時にツールチップが表示され、Escape キーを入力した時にツールチップが非表示となっている。その後、マウスホバーするとツールチップが表示され、マウスオーバーするとツールチップが非表示となっている。](//images.ctfassets.net/in6v9lxmm5c8/1jZS6mypNONwUjVH1T5FZo/b393a5e16e115ddf288917e38eb0c7d4/tooltip-example.gif)

## 参考

- [Accessible Rich Internet Applications (WAI-ARIA) 1.3](https://w3c.github.io/aria/#tooltip)
- [ARIA: tooltip role - Accessibility | MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tooltip_role)
