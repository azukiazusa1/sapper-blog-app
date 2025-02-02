---
marp: true
theme: gaia
class:
  - invert
  - lead
backgroundColor: rgb(28, 30, 34)
color: rgb(229, 229, 230)
style: |
  .svelte {
    color: #f96743;
  }
  a {
    color: rgb(203, 203, 206);
    text-decoration: underline;
  }
  code {
    background-color: rgb(46, 51, 62);
    color: rgb(202, 203, 206);
    font-family: 'Fira Code', monospace;
  }

  pre {
    background-color: rgb(31, 34, 40);
    border: rgb(48, 53, 65) 1px solid;
  }
---

# 依存関係があるコンポーネントは Barrel ファイルでまとめよう

azukiazusa

---

# 自己紹介

- azukiazusa
- https://azukiazusa.dev
- FE（フロントエンド|ファイアーエムブレム）が好き

![bg right:40% w:300px](./images/azukiazusa.png)

---

# <span class="svelte">依存関係があるコンポーネント</span>は Barrel ファイルでまとめよう

---

# 依存関係があるコンポーネント

- `<select>` と `<option>` のような関係
  - `<option>` は必ず `<select>` の子要素として使う必要がある
- 共有状態を相互に依存していて `Context` でデータを受け渡されることが多い

---

# コンポーネントに依存関係があることがわかるようにしたい

---

# Compound Components パターン

```tsx
import { Tab } from "./Tab";

function App() {
  return (
    <Tab.Root>
      <Tab.List>
        <Tab>Tab 1</Tab>
        <Tab>Tab 2</Tab>
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel>Panel 1</Tab.Panel>
        <Tab.Panel>Panel 2</Tab.Panel>
      </Tab.Panels>
    </Tab.Root>
  );
}
```

---

# しかし Svelte では...

- 1 つのファイルにつき 1 つのコンポーネント
- `default` エクスポートしかできない

---

```html
<script lang="ts">
  import TabRoot from "./Tab/TabRoot.svelte";
  import Tab from "./Tab/Tab.svelte";
  import TabList from "./Tab/TabList.svelte";
  import TabPanel from "./Tab/TabPanel.svelte";
</script>
```

- import が多くなりがち
- import する側で任意の名前がつけられる

---

# 依存関係があるコンポーネントは <span class="svelte">Barrel ファイル</span>でまとめよう

---

## Barrel ファイルとは

# ディレクトリ構造

```plaintext
components/
  Tab/
    index.ts
    TabRoot.svelte
    Tab.svelte
    TabList.svelte
    TabPanel.svelte
```

---

# Tab/index.ts

```ts
import Tab from "./Tab.svelte";

Tab.Root = TabRoot;
Tab.List = TabList;
Tab.Panels = TabPanels;
Tab.Panel = TabPanel;

export { Tab };
```

---

# `.` でアクセスしたくない場合

```ts
export { default as Tab } from "./Tab.svelte";
export { default as TabRoot } from "./TabRoot.svelte";
export { default as TabList } from "./TabList.svelte";
export { default as TabPanels } from "./TabPanels.svelte";
export { default as TabPanel } from "./TabPanel.svelte";
```

---

# Svelte コンポーネントでもまとめて import できる

```html
<script lang="ts">
  import { Tab } from "./components/Tab";
</script>

<Tab.Root>
  <Tab.List>
    <Tab>Tab 1</Tab>
    <Tab>Tab 2</Tab>
  </Tab.List>
  <Tab.Panels>
    <Tab.Panel>Panel 1</Tab.Panel>
    <Tab.Panel>Panel 2</Tab.Panel>
  </Tab.Panels>
</Tab.Root>
```

---

# Barrel ファイルのデメリット

- 循環 import が発生しやすい
- バンドルサイズが大きくなる
- Barrel ファイルから import しれもらえないかもしれない
  - module はプライベートにならない
- Barrel ファイルを禁止する ESLint ルールもある
  - `eslint-plugin-no-barrel-files`

https://tkdodo.eu/blog/please-stop-using-barrel-files

---

# まとめ

- UI コンポーネントには依存関係が生まれることがある
- React では Compound Components パターンが使われるが、Svelte では 1 つのファイルに 1 つのコンポーネントしか書けない
- Barrel ファイルを使えば依存関係のあるコンポーネントをまとめることができる
- Barrel ファイルのデメリットもあるので注意が必要
