---
id: 3QWC5zR3Awp1Hk8RypqYd6
title: "【React】アクセシビリティに考慮したタブを実装する"
slug: "react-accessible-tab"
about: "タブとは、ページ内でコンテンツを切り替えるために使用する UI です。タブ初期表示ではいずれか一つのタブパネルが表示されており、関連するタブがアクティブなスタイルで表示されます。それぞれのタブには関連するタブパネルがあり、タブを選択することで表示されるタブパネルがタブに関連するものに切り替わります。"
createdAt: "2022-11-06T00:00+09:00"
updatedAt: "2022-11-06T00:00+09:00"
tags: ["React", "アクセシビリティ"]
published: true
---
タブとは、ページ内でコンテンツを切り替えるために使用する UI です。タブ初期表示ではいずれか 1 つのタブパネルが表示されており、関連するタブがアクティブなスタイルで表示されます。それぞれのタブには関連するタブパネルがあり、タブを選択することで表示されるタブパネルがタブに関連するものに切り替わります。

タブは以下の要素から構成されています。

- [tab](https://w3c.github.io/aria/#tab)：関連するタブパネルの表示・非表示を切り替える機能を持つ要素
- [tablist](https://w3c.github.io/aria/#tablist)：`tab` 要素の集まり
- [tabpanel](https://w3c.github.io/aria/#tabpanel)：`tab` と関連するコンテンツを持つ要素

## タブの要件

タブをアクセシブルにするうためには、以下の実装を行う必要があります。

### ロール・ステート・プロパティ

- タブの集まりのコンテナ要素に `tablist` 要素を付与する
- タブとして機能する要素に `tab` ロールを付与する。すべての `tab` 要素は `tablist` の中に存在する必要がある
- タブに関連してコンテンツを表示する要素に `tabpanel` ロールを付与する
- `tablist` 要素に [aria-labelledby](https://w3c.github.io/aria/#aria-labelledby) または [aria-label](https://w3c.github.io/aria/#aria-label) 属性でアクセシブルな名前を付与する
- `tab` に対して関連する `tabpanel` の ID を [aria-controls](https://w3c.github.io/aria/#aria-controls) 属性で指定する
- 現在アクティブなタブの [aria-selected](https://w3c.github.io/aria/#aria-selected) に `true` を設定する。それ以外のタブは `aria-selected` に `false` を設定する
- `tabpanel` に対して関連する `tab` の ID を `aria-labelledby` 属性で指定する
- もしタブが垂直に表示される場合、`tablist` ロールを付与した要素に `aria-orientation` 属性に `vertical` を設定する（デフォルトは `horizontal` 水平）

### キーボード操作

- `Tab`
  - フォーカスが `tablist` の外にある場合、フォーカスをアクティブなタブに移動する
  - フォーカスがアクティブなタブにある場合、フォーカスをキーボードフォーカスの順序の次の要素（理想的にはアクティブなタブに関連付けられた `tabpanel` に移動する）
- タブリストの次の要素にフォーカスし、アクティブ化する。現在のタブがタブリストの最後のタブである場合、最初のタブにフォーカスする
- タブリストの前のタブにフォーカスし、アクティブ化する。現在のタブがタブリストの最初のタブである場合、最後のタブをアクティブ化する 

## 実装

それでは、前述した要件を満たしたリストボックスの実装を考えてみます。以下のように `Tab` コンポーネントとして実装しました。

```tsx
import React, {
  createContext,
  useContext,
  useId,
  useState,
  Children,
  useEffect,
  useRef,
} from "react";

type TabContextType = {
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  titleId: string;
  tabIdPrefix: string;
  panelIdPrefix: string;
};

const TabContext = createContext<TabContextType | null>(null);

const useTabContext = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error("TabContext must be used within a TabProvider");
  }
  return context;
};

type GroupProps = {
  children: React.ReactNode;
  activeIndex?: number;
};

const Group = ({
  activeIndex: defaultActiveIndex = 0,
  children,
}: GroupProps) => {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  const titleId = `tab-title-${useId()}`;
  const tabIdPrefix = `tab-${useId()}`;
  const panelIdPrefix = `panel-${useId()}`;

  return (
    <TabContext.Provider
      value={{
        activeIndex,
        setActiveIndex,
        titleId,
        tabIdPrefix,
        panelIdPrefix,
      }}
    >
      {children}
    </TabContext.Provider>
  );
};

const Title = ({ children }: { children: React.ReactNode }) => {
  const { titleId } = useTabContext();

  return <div id={titleId}>{children}</div>;
};

const useKeyboardNavigation = (
  tabListRef: React.RefObject<HTMLDivElement>,
  TabCount: number
) => {
  const { setActiveIndex, tabIdPrefix } = useTabContext();
  const focusTab = (index: number) => {
    const tab = tabListRef.current?.querySelector(
      `[id="${tabIdPrefix}-${index}"]`
    );
    if (tab) {
      (tab as HTMLElement).focus();
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        setActiveIndex((prevIndex: number) => {
          if (prevIndex === 0) {
            const nextIndex = TabCount - 1;
            focusTab(nextIndex);
            return nextIndex;
          } else {
            const nextIndex = prevIndex - 1;
            focusTab(nextIndex);
            return nextIndex;
          }
        });

        break;
      case "ArrowRight":
        event.preventDefault();
        setActiveIndex((prevIndex: number) => {
          if (prevIndex === TabCount - 1) {
            const nextIndex = 0;
            focusTab(nextIndex);
            return nextIndex;
          } else {
            const nextIndex = prevIndex + 1;
            focusTab(nextIndex);
            return nextIndex;
          }
        });
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    const tabList = tabListRef.current;
    tabList?.addEventListener("keydown", handleKeyDown);

    return () => {
      tabList?.removeEventListener("keydown", handleKeyDown);
    };
  }, [tabListRef, handleKeyDown]);
};

const List = ({ children }: { children: React.ReactNode }) => {
  const { titleId } = useTabContext();
  const tabListRef = useRef<HTMLDivElement>(null);
  useKeyboardNavigation(tabListRef, Children.count(children));

  return (
    <div role="tablist" aria-labelledby={titleId} ref={tabListRef}>
      {Children.map(children, (child, index) => {
        return React.cloneElement(child as React.ReactElement, { index });
      })}
    </div>
  );
};

const PanelList = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {Children.map(children, (child, index) => {
        return React.cloneElement(child as React.ReactElement, { index });
      })}
    </div>
  );
};

type TabProps = {
  children: React.ReactNode;
  index?: number;
};

const Pabel = ({ children, index }: TabProps) => {
  const { activeIndex, tabIdPrefix, panelIdPrefix } = useTabContext();
  if (index === undefined) {
    throw new Error("Tab must have an index prop");
  }

  return (
    <div
      role="tabpanel"
      aria-labelledby={`${tabIdPrefix}-${index}`}
      id={`${panelIdPrefix}-${index}`}
      className={index === activeIndex ? "" : "hidden"}
      tabIndex={0}
    >
      {children}
    </div>
  );
};

const Tab = ({ children, index }: TabProps) => {
  const { activeIndex, setActiveIndex, tabIdPrefix, panelIdPrefix } =
    useTabContext();

  if (index === undefined) {
    throw new Error("Tab must have an index prop");
  }

  return (
    <button
      role="tab"
      aria-controls={`${panelIdPrefix}-${index}`}
      aria-selected={index === activeIndex}
      id={`${tabIdPrefix}-${index}`}
      onClick={() => setActiveIndex(index)}
      tabIndex={index === activeIndex ? 0 : -1}
    >
      {children}
    </button>
  );
};

Tab.Group = Group;
Tab.Title = Title;
Tab.List = List;
Tab.Pabel = Pabel;
Tab.PanelList = PanelList;

export default Tab;
```

`Tab` コンポーネントは Compound Components として実装しています。Compound Components とはコンポーネントが肘する状態を暗黙的に子のコンポーネントに共有するパターンです。コンポーネントを利用する側は次のように使用します。

```tsx
function App() {
  return (
    <Tab.Group>
      <Tab.Title>タブテスト</Tab.Title>
      <Tab.List>
        <Tab>タブ1</Tab>
        <Tab>タブ2</Tab>
        <Tab>タブ3</Tab>
      </Tab.List>
      <Tab.PanelList>
        <Tab.Pabel>タブ1の内容</Tab.Pabel>
        <Tab.Pabel>タブ2の内容</Tab.Pabel>
        <Tab.Pabel>タブ3の内容</Tab.Pabel>
      </Tab.PanelList>
    </Tab.Group>
  );
}
```

### `<Tab.Group>`

それではそれぞれの要素にフォーカスして実装を確認してみましょう。`<Tab.Group>` コンポーネントはすべてのコンポーネント親要素として使われ、主に `Context` を `Provide` する目的で使用されます。

```tsx
type TabContextType = {
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  titleId: string;
  tabIdPrefix: string;
  panelIdPrefix: string;
};

const TabContext = createContext<TabContextType | null>(null);

const useTabContext = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error("TabContext must be used within a TabProvider");
  }
  return context;
};

type GroupProps = {
  children: React.ReactNode;
  activeIndex?: number;
};

const Group = ({
  activeIndex: defaultActiveIndex = 0,
  children,
}: GroupProps) => {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  const titleId = `tab-title-${useId()}`;
  const tabIdPrefix = `tab-${useId()}`;
  const panelIdPrefix = `panel-${useId()}`;

  return (
    <TabContext.Provider
      value={{
        activeIndex,
        setActiveIndex,
        titleId,
        tabIdPrefix,
        panelIdPrefix,
      }}
    >
      {children}
    </TabContext.Provider>
  );
};
```

現在アクティブなタブを設定するために、タブのインデックスを使用して管理しています。またアクセシビリティ上の要件から `tab` 要素と `tabpanel` 要素にはユニークな ID を付与する必要があるので、ここで `useId()` でユニークな ID となるように生成しています。

`titleId` は `tablist` 要素に `aria-labelledby` でアクセシブルな名前を付与するために使用しています。

### `<Tab.Title>` 

`<Tab.Title>` は前述のとおり `tablist` にアクセシブルな名前を付与するための要素で、特別な実装はありません。

```tsx
const Title = ({ children }: { children: React.ReactNode }) => {
  const { titleId } = useTabContext();

  return <div id={titleId}>{children}</div>;
};
```

### `<Tab.List>`

`<Tab.List>` はタブの一覧をまとめる要素です。この要素には `tablist` ロールを付与するのと、`aria-labelledby` でアクセシブルな名前を付与する必要があります。

```tsx
const List = ({ children }: { children: React.ReactNode }) => {
  const { titleId } = useTabContext();
  const tabListRef = useRef<HTMLDivElement>(null);
  useKeyboardNavigation(tabListRef, Children.count(children));

  return (
    <div role="tablist" aria-labelledby={titleId} ref={tabListRef}>
      {Children.map(children, (child, index) => {
        return React.cloneElement(child as React.ReactElement, { index });
      })}
    </div>
  );
};
```

また `<Tab.List>` の直近の子要素に `<Tab>` 要素が来る想定で実装しています。`<Tab>` 要素は自身のインデックスを知る必要があるので、[Children.map](https://reactjs.org/docs/react-api.html#reactchildrenmap) で子要素を配列として扱いインデックスを振り分けるようにしています。

タブリストではキーボード操作を制御する必要があるので、`useKeyboardNavigation` フックでキーボード操作を制御しています。

```tsx
const useKeyboardNavigation = (
  tabListRef: React.RefObject<HTMLDivElement>,
  TabCount: number
) => {
  const { setActiveIndex, tabIdPrefix } = useTabContext();
  const focusTab = (index: number) => {
    const tab = tabListRef.current?.querySelector(
      `[id="${tabIdPrefix}-${index}"]`
    );
    if (tab) {
      (tab as HTMLElement).focus();
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        setActiveIndex((prevIndex: number) => {
          if (prevIndex === 0) {
            const nextIndex = TabCount - 1;
            focusTab(nextIndex);
            return nextIndex;
          } else {
            const nextIndex = prevIndex - 1;
            focusTab(nextIndex);
            return nextIndex;
          }
        });

        break;
      case "ArrowRight":
        event.preventDefault();
        setActiveIndex((prevIndex: number) => {
          if (prevIndex === TabCount - 1) {
            const nextIndex = 0;
            focusTab(nextIndex);
            return nextIndex;
          } else {
            const nextIndex = prevIndex + 1;
            focusTab(nextIndex);
            return nextIndex;
          }
        });
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    const tabList = tabListRef.current;
    tabList?.addEventListener("keydown", handleKeyDown);

    return () => {
      tabList?.removeEventListener("keydown", handleKeyDown);
    };
  }, [tabListRef, handleKeyDown]);
};
```

`handleKeyDown` 関数でキーボード操作をハンドリングしています。`←` キーがクリックされたときは `case "ArrowLeft` です。前回のインデックスが `0` の場合にはタブリストの最初のタブなので、`TabCount - 1` つまり最後のタブのインデックスをアクティブにし、`focusTab` 関数で対象のタブにフォーカスしています。それ以外の場合は `-　1` して同様のことを行います。

`→` キーがクリックされたときは `case "ArrowRight` です。ここで行っていることは `←` キーがクリックされたときとほぼ変わりません。前回のインデックスが `TabCount - 1` の時はタブリストの最後のタブなので最初のタブのインデックス `=0` に移動します。

### `<Tab.PanelList>`

`<Tab.PanelList>` は `tablist` の一覧をまとめる要素です。`<Tab.List>` と同様に `<Tab.Panel>` 要素にインデックスを振り分ける目的で存在します。

```tsx
const PanelList = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {Children.map(children, (child, index) => {
        return React.cloneElement(child as React.ReactElement, { index });
      })}
    </div>
  );
};
```

### `<Tab>`

`<Tab>` はタブ要素を担当します。Props の `index` は `<Tab.TabList>` から与えられる想定です。

```tsx
const Tab = ({ children, index }: TabProps) => {
  const { activeIndex, setActiveIndex, tabIdPrefix, panelIdPrefix } =
    useTabContext();

  if (index === undefined) {
    throw new Error("Tab must have an index prop");
  }

  return (
    <button
      role="tab"
      aria-controls={`${panelIdPrefix}-${index}`}
      aria-selected={index === activeIndex}
      id={`${tabIdPrefix}-${index}`}
      onClick={() => setActiveIndex(index)}
      tabIndex={index === activeIndex ? 0 : -1}
    >
      {children}
    </button>
  );
};
```

タブがクリックされたときの動作を簡単に処理するためにタブには `<button>` 要素を使用しています。アクセシビリティの要件通りに `role="tab"`,`aria-controls`,`aria-selected` 属性を付与します。自身の ID は `${tabIdPrefix}-${index}` という形式で割り当てます。

現在アクティブなタブを視覚的に表示するために、次のような CSS を定義しています。

```css
[role="tab"][aria-selected="true"] {
  background-color: snow;
  border-bottom-color: snow;
}
```

また現在アクティブなタブ以外のはフォーカスが当たらないようにする必要があります。そのため、現在アクティブなタブ以外には `tabIndex="-1"` になるように設定してキーボード操作からはフォーカスが当たらないようにしています。

### `<Tab.Panel>`

`<Tab.Panel>` は `tabpanel` 要素を担当します。Props のインデックスは `<Tab.PanelList>` から割り当てられる想定です。

```tsx
const Pabel = ({ children, index }: TabProps) => {
  const { activeIndex, tabIdPrefix, panelIdPrefix } = useTabContext();
  if (index === undefined) {
    throw new Error("Tab must have an index prop");
  }

  return (
    <div
      role="tabpanel"
      aria-labelledby={`${tabIdPrefix}-${index}`}
      id={`${panelIdPrefix}-${index}`}
      className={index === activeIndex ? "" : "hidden"}
      tabIndex={0}
    >
      {children}
    </div>
  );
};
```

アクセシビリティの要件通りに `role="tabpanel"`,`aria-labelledby` を設定しています。現在アクティブなではない場合コンテンツを非表示にするため `hidden` クラスを付与しています。このクラスは次のように CSS で定義されています。

```css
.hidden {
  display: none;
}
```

またそれぞれのタブパネルは現在アクティブなタブにおいて　`Tab` キーが押されたときにフォーカスが移るように実装する必要があります。そのため、`tabpanel` 要素には `tabIndex="0"` を付与しています。

## 参考

- [Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabpanel/)
- [Example of Tabs with Automatic Activation](https://www.w3.org/WAI/ARIA/apg/example-index/tabs/tabs-automatic.html)
- [ARIA: tab ロール](https://developer.mozilla.org/ja/docs/Web/Accessibility/ARIA/Roles/Tab_Role)
- [Tabs - Headless UI](https://headlessui.com/react/tabs)

