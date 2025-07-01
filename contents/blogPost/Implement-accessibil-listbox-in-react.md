---
id: 1FMUhOBAbzyXSkF0mcqJBh
title: "【React】アクセシビリティに考慮したリストボックスを実装する"
slug: "Implement-accessibil-listbox-in-react"
about: "リストボックスにアクセシビリティ上求められる要件を確認した後に、React で実際に要件に従った実装をおこないます。"
createdAt: "2022-10-23T00:00+09:00"
updatedAt: "2022-10-23T00:00+09:00"
tags: ["React", "アクセシビリティ"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2c9EyCXfherkq4ICwfDHaM/13bcad3dd62573b050eb8ad25dce4275/1200px-React-icon.svg.png"
  title: "React"
audio: null
selfAssessment: null
published: true
---
[リストボックス](https://developer.mozilla.org/ja/docs/Web/Accessibility/ARIA/Roles/listbox_role) は 1 つまたは複数の静的な項目をユーザーが選択できるリストです。役割は `<select>` 要素と同等ですが、`<select>` は CSS による装飾が困難であるため、独自にリストボックスを作成することが多いでしょう。

## アクセシブルなリストボックスの要件

リストボックスをアクセシブルにするためには以下の実装を行う必要があります。

### ロール・ステート・プロパティ

- オプションを持つ要素に [listbox](https://w3c.github.io/aria/#listbox) ロールを付与する
- リストボックスの子要素には 1 つ以上の[option](https://w3c.github.io/aria/#option) ロールが必要
- listbox ロールを付与した要素には [aria-labelledby](https://w3c.github.io/aria/#aria-labelledby) または [aria-label](https://w3c.github.io/aria/#aria-label) 属性を付与してアクセシブルな名前をつける（画面上で可視化されるため、`aria-labelledby` がより良い）
- もしリストボックスが複数選択可能であるならば、`listbox` ロールを持った要素に対して [aria-multiselectable="true"](https://w3c.github.io/aria/#aria-multiselectable) を設定する（デフォルトでは `false`）
- option ロールを付与した要素の中で、現在アクティブな要素には [aria-selected="true"](https://w3c.github.io/aria/#aria-selected) を付与する。アクティブでない要素には aria-selected="false" を付与する（もしくは [aria-checked](https://w3c.github.io/aria/#aria-checked)）
- ドロップダウンメニューを表示させる要素（コンボボックス）には以下を付与する
  - [combobox](https://w3c.github.io/aria/#combobox) ロール 
  - [aria-controls](https://w3c.github.io/aria/#aria-controls)：listbox ロールの id
  - [aria-expanded](https://w3c.github.io/aria/#aria-expanded)：現在リストボックスが開いているなら true、そうでないなら false
  - [aria-haspopup="listbox"](https://w3c.github.io/aria/#aria-haspopup)
  - 現在アクティブな option ロールがある場合 [aria-activedescendant](https://w3c.github.io/aria/#aria-activedescendant) 属性でアクティブな要素を `id` で指定する
- もしオプションが水平に表示される場合、listbox ロールを付与した要素に[aria-orientation](https://w3c.github.io/aria/#aria-orientation) 属性に `horizontal` を設定する（デフォルトは `vertical` 垂直）

### キーボード操作

##### 単一選択リストボックスの場合

- フォーカスを受け取ったとき
  - どのオプションも選択されていない場合、最初のオプションがフォーカスを受け取る。任意で最初のオプションを自動選択することもできる
  - フォーカスを受け取る前にオプションが選択されていた場合、フォーカスは選択されているオプションに設定される
- `↓`：次のオプションにフォーカスを移動する
- `↑`：前のオプションにフォーカスを移動する
- `Space`：フォーカスされたオプションの選択状態を変更する
- `Esc`：リストボックスが開いている場合、閉じてコンボボックスにフォーカスを戻す
- `Tab`：リストボックスが開いている場合、通常の `Tab` キーが押されたときの動作（次の要素にフォーカスを移す）を実行します。

#### 複数選択リストボックスの場合

- フォーカスを受け取ったとき
  - どのオプションも選択されていない場合、最初のオプションがフォーカスを受け取る
  - フォーカスを受け取る前に 1 つ以上のオプションが選択されていた場合、リストの中で最初に選択されているオプションがフォーカスを受け取る
- `Shift + ↓`：現在の選択状態を変更しつつ、次のオプションにフォーカスを移動する
- `Shift + ↑`：現在の選択状態を変更しつつ、前のオプションにフォーカスを移動する
- `Control + ↓`：現在の選択状態を変更せずに次のオプションにフォーカスを移動する
- `Control + ↑`：現在の選択状態を変更せずに前のオプションにフォーカスを移動する
- `Control + Space`：フォーカスされたオプションの選択状態を変更する

#### ポップアップが閉じているとき

- `↑`,`↓`,`Space`,`Enter`：ポップアップを表示する。フォーカスはコンボボックスに残したまま。

## 実装

それでは、前述した要件を満たしたリストボックスの実装を考えてみます。

### ベースとなるリストボックス

以下のアクセシビリティに関する機能が実装されていないリストボックスコンポーネントをベースとして考えてみます。

```tsx
import React, { RefObject, useEffect, useRef, useState } from "react";

const useClickOutside = (
  ref: RefObject<HTMLElement>,
  handler: (event: MouseEvent) => void
) => {
  const listener = (event: MouseEvent) => {
    if (!ref.current || ref.current.contains(event.target as Node)) {
      return;
    }
    handler(event);
  };

  useEffect(() => {
    document.addEventListener("mousedown", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [ref, handler]);
};

type ListBoxProps = {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
};

export const ListBox: React.FC<ListBoxProps> = ({
  label,
  options,
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (value: string) => {
    onChange(value);
    setOpen(false);
  };
  const toggleOpen = () => setOpen((open) => !open);
  const close = () => setOpen(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  useClickOutside(wrapperRef, close);

  return (
    <div ref={wrapperRef}>
      <h3>{label}</h3>
      <button onClick={toggleOpen}>
        {selectedOption ? selectedOption.label : "選択してください"}
      </button>
      {open && (
        <ul>
          {options.map((option) => (
            <li key={option.value}>
              <button onClick={() => handleSelect(option.value)}>
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

### ロール・ステート・プロパティの付与

まずはそれぞれの要素に適切なロールなどを付与します。ステートやプロパティは通常 JavaScript を用いて適宜更新する必要があるのですが、React の宣言的なスタイルのおかげでさほど難しいものではありません。

まずはリストボックスを表示させる要素に付与します。

```tsx
const labelId = useId();
const listboxId = useId();

return (
    <h3 id={labelId}>{label}</h3>
    <button
      onClick={toggleOpen}
      role="combobox"
      aria-haspopup="listbox"
      aria-controls={listboxId}
      aria-labelledby={labelId}
      aria-expanded={open}
      aria-activedescendant={/** TODO 現在アクティブなオプションの ID */}
    >
      {selectedOption ? selectedOption.label : "選択してください"}
    </button>
```

`combobox` はユーザーが複数の項目から値を選択できるように関連するポップアップを備えている入力ウィジェットです。`aria-haspopup="listbox"` を指定することでこのコンボボックスはリストボックスをポップアップすることを伝えます。`aria-controls` でこのコンボボックスと関連するリストボックスを `id` で指定します。アクセシビリティ対応のため要素同士を関連付けるには `id` 属性が多く用いられますが、React18 で追加された [useId](https://reactjs.org/docs/hooks-reference.html#useid) フックを使うのが適しています。このフックで生成された ID を使用すれば、ページ内で一意であることが担保されます。

同様に `aria-labbeledby` を使用してコンボボックスとラベルを紐付けています。`aria-expanded` はコンボボックスがコントロールする要素（`aria-controls` で指定した要素）が現在表示されているかどうかを指定します。`aria-activedescendant` はリストボックスのオプションの中で現在アクティブな要素を `id` で指定します。

続いてリストボックス要素です。

```tsx
<ul
  role="listbox"
  id={listboxId}
  aria-labelledby={labelId}
  tabIndex={-1}
>
```

リストボックスであることをユーザーに示すために `listbox` ロールを付与しています。コンボボックスとの関連付けのために `id` を指定する必要があるのは前述のとおりです。コンボボックスと同様に `aria-labelledby` でラベルを紐付けします。さらに、`tabIndex={-1}` を指定して JavaScript からフォーカスが可能であるように指定します。

さらにもう 1 つ、リストボックスの表示制御についてやるべきことがあります。ベースとなるリストボックスでは下記のように jsx の制御構文を用いて表示・非表示を切り替えていました。

```tsx
{open && (
  <ul
    role="listbox"
    id={listboxId}
    aria-labelledby={labelId}
    tabIndex={-1}
  >
```

jsx の条件分岐を用いて表示を切り替えた場合、その要素は DOM ツリーから削除されるのですが、これは要素の関連付けを行っている場合には好ましくありません。なぜなら、コンボボックスにおいて `aria-controls` で指定した要素が存在しないことになってしまうためです。

これを修正するためには、jsx の制御構文ではなく CSS のスタイルで表示・非表示を切り替えるようにします。

```css
button:not([aria-expanded=true]) + ul {
  width: 0;
  height: 0;
  overflow: hidden;
}
```

最後にオプション要素です。

```tsx
<li
  key={option.value}
  role="option"
  aria-selected={option.value === value}
  id={`${listboxId}-${option.value}`}
>
```

`option` ロールを付与してオプション要素であることを伝えます。現在選択されている要素かどうか、`aria-selected` で表現をしています。またコンボボックスの `aria_activedescendant` 属性から指定するために `id` を付与する必要があります。

### キーボード操作

次に要件に従ったキーボード操作を実装しましょう。リストボックスの操作を行う `useListBox` フックを作成します。

```tsx
type UseListBoxProps = {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  comboBoxRef: RefObject<HTMLElement>;
};

const useListBox = ({
  onChange,
  value,
  options,
  comboBoxRef,
}: UseListBoxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const selectedOption = options.find((option) => option.value === value);

  const open = () => {
    setIsOpen(true);
    setActiveIndex(selectedOption ? options.indexOf(selectedOption) : 0);
  };
  const close = () => {
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleSelect = (value: string) => {
    onChange(value);
    close();
  };

  useEffect(() => {
    let listener: (event: KeyboardEvent) => void = () => {};
    if (isOpen) {
      listener = openedKeydownHandler({
        close,
        activeIndex,
        setActiveIndex,
        options,
        handleSelect,
      });
    } else if (document.activeElement === comboBoxRef.current) {
      listener = closedKeydownHandler({
        open,
      });
    }
    document.addEventListener("keydown", listener);

    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [isOpen, activeIndex, options, handleSelect, open, close, comboBoxRef]);

  return {
    isOpen,
    open,
    selectedOption,
    close,
    handleSelect,
    activeIndex,
  };
};
```

`isOpen` はポップアップが表示されているかどうかの状態です。`activeIndex` では現在アクティブなオプション（カーソル操作で選択された）のインデックスを保持します。

`open` 関数でポップアップが表示されたとき、どのオプションがアクティブとなるかを決定します。キーボード操作の要件より、現在なにかしらのオプションが選択されている場合にはそのオプションのインデックスをアクティブとします。オプションが選択されていない場合、最初のオプション（＝インデックスは 0）をアクティブとします。`close` 関数でポップアップを戻す際にはアクティブなオプションのインデックスを `-1` に設定しておきます。

`useEffect` 内では `keydown` イベントを購読してユーザーのキーボード操作を受け付けます。ポップアップが開いているときと閉じているときでそれぞれ別のイベントをハンドリングする必要があるため、`openedKeydownHandler` と `closedKeydownHandler` でそれぞれイベントのリスナーを取得しています。またポップアップが閉じている場合のイベントはコンボボックスにアクティブがある場合のみ受け付ける必要があるので、`isFocused` でコンボボックスにフォーカスがあるかどうかを判定します。（フォーカスの状態の操作は後ほどコンポーネントで実装します）

まずは簡単な `closedKeydownHandler` から見てきましょう。`↑`,`↓`,`Space`,`Enter` いずれかのキーが押された場合、ポップアップを表示します。

```tsx
const closedKeydownHandler = ({ open }: any) => {
  const listener = (event: KeyboardEvent) => {
    switch (event.key) {
      case "Up":
      case "ArrowUp":
      case "Down":
      case "ArrowDown":
      case " ":
      case "Enter":
        event.preventDefault();
        open();
    }
  };
  return listener;
};
```

続いて `openedKeydownHandler` です。`Escape` または `Tab` キーが押された場合はポップアップを閉じます。`↑` はアクティブなオプションを1つ前に戻します。先頭のオプションがアクティブな場合には、最後のオプションをアクティブにします。`↓` はアクティブなオプションを1つ後にします。最後のオプションがアクティブな場合、先頭のオプションをアクティブにします。`Enter` または `Space` キーが押された場合は現在アクティブなオプションを選択します。 

```tsx
const openedKeydownHandler = ({
  close,
  activeIndex,
  setActiveIndex,
  options,
  handleSelect,
}: {
  close: () => void;
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  options: { value: string; label: string }[];
  handleSelect: (value: string) => void;
}) => {
  const listener = (event: KeyboardEvent) => {
    switch (event.key) {
      case "Escape":
      case "Tab":
        close();
        break;
      case "ArrowDown":
        setActiveIndex((i) => (i + 1 >= options.length ? 0 : i + 1));
        break;
      case "ArrowUp":
        setActiveIndex((i) => (i - 1 < 0 ? options.length - 1 : i - 1));
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        handleSelect(options[activeIndex].value);
        break;
    }
  };
  return listener;
};
```

それでは作成した `useListBox` フックを使用してコンポーネントを修正しましょう。

```tsx
const { open, close, isOpen, handleSelect, activeIndex, selectedOption } =
  useListBox({
    options,
    value,
    onChange,
  });
```

コンボボックスの `aria-activedescendant` は現在アクティブなインデックスが `-1` の場合は `undefined` を、それ以外の場合は現在アクティブなオプションの `value` を利用してオプションの `id` を指定します。またコンボボックスがフォーカスしたときのフォーカスが離れたときの処理も追加します。

```tsx
<button
  aria-activedescendant={
    activeIndex !== -1
      ? `${listboxId}-${options[activeIndex].value}`
      : undefined
  }
  onFocus={() => setIsFocused(true)}
  onBlur={() => setIsFocused(false)}
>
```

現在アクティブなオプションが視覚的に表示されるように、アクティブなインデックスが一致する場合には `active` クラスを付与するようにします。

```tsx
{options.map((option, i) => (
  <li
    key={option.value}
    role="option"
    aria-selected={option.value === value}
    id={`${listboxId}-${option.value}`}
    onClick={() => handleSelect(option.value)}
    className={i === activeIndex ? "active" : ""}
  >
```

```css
.active {
  border: 2px solid navy;
} 
```

コードの全体像は以下のようになります。実際に触ってみて正しく動作するか確かめてみてください。

<iframe
  src="https://stackblitz.com/edit/react-ts-lm3tts?embed=1&file=components/ListBox.tsx"
  width="100%"
  height="500"
  ></iframe>

## 参考

- [ARIA: listbox ロール](https://developer.mozilla.org/ja/docs/Web/Accessibility/ARIA/Roles/listbox_role)
- [Listbox](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/)
- [Select-Only Combobox Example](https://www.w3.org/WAI/ARIA/apg/example-index/combobox/combobox-select-only.html)
- [Building accessible Select component in React](https://medium.com/lego-engineering/building-accessible-select-component-in-react-b61dbdf5122f)
