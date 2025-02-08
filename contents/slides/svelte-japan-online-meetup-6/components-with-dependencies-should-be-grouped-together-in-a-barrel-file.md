---
marp: true
title: 依存関係があるコンポーネントは Barrel ファイルでまとめよう
description: 依存関係があるコンポーネントとは、`<select>` と `<option>` のような関係性を指します。このようなコンポーネントは同時に使われることが前提であるため、利用者にそのことが伝わるようにする必要があります。この発表では Barrel ファイルを使って依存関係があるコンポーネントをまとめる方法について話します。
author: azukiazusa
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

  li {
    margin: 0.5rem 0 !important;
  }
---

# 依存関係があるコンポーネントは Barrel ファイルでまとめよう

azukiazusa

<!-- それでは、依存関係があるコンポーネントは Barrel ファイルでまとめようというタイトルで発表いたします。 -->

---

# 自己紹介

- azukiazusa
- https://azukiazusa.dev
- FE（フロントエンド|ファイアーエムブレム）が好き

![bg right:40% w:300px](./images/azukiazusa.png)

<!-- はじめに簡単に自己紹介です。普段 azukiazusa という名前で活動していています。azukiazusa.dev というブログを運営して、このブログSvelte で作っていて、Svelte 歴は 4 年ほどになります。好きなものはフロントエンドとファイアーエムブレムです。 -->

---

# <span class="svelte">依存関係があるコンポーネント</span>は Barrel ファイルでまとめよう

<!-- さて、タイトルは「依存関係があるコンポーネントは Barrel ファイルでまとめよう」ということでした。まずは依存関係があるコンポーネントとは何かについて話していきたいと思います。 -->

---

# 依存関係があるコンポーネント

- `<select>` と `<option>` のような関係
  - `<option>` は必ず `<select>` の子要素として使う必要がある
- 共有状態を相互に依存していて `Context` でデータを受け渡されることが多い

<!-- 依存関係のあるコンポーネントの代表例として、`<select>` と `<option>` の関係があります。`<option>` は必ず `<select>` の子要素として使う必要があります。また `<select>` 要素自身も自身だけだと役割を果たせないため、`<option>` 要素が存在することを前提としています。 -->

<!-- このような関係性は UI コンポーネントを作る際にも時折見られて、`Context` を通じで状態た相互に依存しているという設計になることが多いです。-->

---

# コンポーネントに依存関係があることがわかるようにしたい

<!-- このような依存関係があるコンポーネントを作る際には、その使用者が依存関係があることを理解しやすいようにしたいところです。 -->

---

# Compound Components パターン

```tsx
import { Tab } from "./Tab";

function App() {
  return (
    <Tab.Root>
      <Tab.List>
        <Tab.Trigger>Tab 1</Tab.Trigger>
        <Tab.Trigger>Tab 2</Tab.Trigger>
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel>Panel 1</Tab.Panel>
        <Tab.Panel>Panel 2</Tab.Panel>
      </Tab.Panels>
    </Tab.Root>
  );
}
```

<!-- React の世界では Compound Components パターンが使われることがあります。コンポーネントのオブジェクトのプロパティとして子コンポーネントを持たせることで、依存関係があることを明示的に示すことができます。 -->

---

# しかし Svelte では...

- 1 つのファイルにつき 1 つのコンポーネント
- `default` エクスポートしかできない

<!-- しかし Svelte では 1 つのファイルにつき 1 つのコンポーネントしか書けないため、Compound Components パターンをそのまま使うことはできません。 -->

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

<!-- そのため、依存関係があるコンポーネントを使う際には、import が多くなりがちで、import する側で任意の名前がつけられるため、依存関係があることがわかりにくいという問題があります。 -->

---

# 依存関係があるコンポーネントは <span class="svelte">Barrel ファイル</span>でまとめよう

<!-- そこでタイトルにある Barrel ファイルが有効に働きます。 -->

---

# Barrel ファイルとは

- 複数のモジュールのエクスポートを 1 つのファイルにまとめる
- Barrel ファイルでは単に他のモジュールをエクスポートするだけ
- 関連がある関数やコンポーネントを 1 つのモジュールから一括で import できる

![bg right:30% w:300px](./images/barrel.png)

<!-- Barrel ファイルとは、複数のモジュールのエクスポートを 1 つのファイルにまとめることです。モジュールの利用者は関連がある関数やコンポーネントを 1 つのモジュールから一括で import できるようになります。 -->

---

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

<!-- ディレクトリ構造はこのようになります。index.ts は import する際に省略できるため Barrel ファイルとしてよく使われます。 -->

---

# Tab/index.ts

```ts
import Tab from "./Tab.svelte";
import TabRoot from "./TabRoot.svelte";
import TabList from "./TabList.svelte";
import TabPanels from "./TabPanels.svelte";
import TabPanel from "./TabPanel.svelte";

Tab.Root = TabRoot;
Tab.List = TabList;
Tab.Panels = TabPanels;
Tab.Panel = TabPanel;

export { Tab };
```

<!-- Barrel ファイルの中身はこのようになります。Svelte コンポーネントをそれぞれ import して、`Tab` というオブジェクトにプロパティとして追加しています。最後に `Tab` をエクスポートしています。 -->

---

# `.` でアクセスしたくない場合

```ts
export { default as Tab } from "./Tab.svelte";
export { default as TabRoot } from "./TabRoot.svelte";
export { default as TabList } from "./TabList.svelte";
export { default as TabPanels } from "./TabPanels.svelte";
export { default as TabPanel } from "./TabPanel.svelte";
```

<!-- `.` でアクセスしたくない場合でも、このように 1 つのファイルに纏められるというメリットがあります。 -->

---

# まとめて import できる

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

<!-- 実際の使用例はこのようになります。`Tab` というオブジェクトを import して、それぞれのコンポーネントを使うことができます。 -->

---

# Barrel ファイルのデメリット

- 循環 import が発生しやすい
- パフォーマンスの低下
- Barrel ファイルではなく個別のモジュールから import されてしまう
  - 個々の module がプライベートになるわけではない
- Barrel ファイルを禁止する ESLint ルールもある
  - `eslint-plugin-no-barrel-files`

https://tkdodo.eu/blog/please-stop-using-barrel-files

<!-- しかし Barrel ファイルにはいくつかのデメリットがある点も注意が必要です。Barrel ファイルは循環 import が発生しやすくなったり、パフォーマンスの低下の原因にもなることがあります。また運用方針がうまく定まっていないと、Barrel ファイルを使わないで個別のモジュールから import されて、設計上の混乱を招く可能性があります。 -->

<!-- Barrel ファイルのデメリットは広く知られているため、ESLint プラグインには Barrel ファイルを禁止するルールも存在します。 -->

<!-- Barrel ファイルのデメリットを理解したうえで、それを上回るメリットがある場合に Barrel ファイルを使うことが重要でしょう。 -->

---

# まとめ

- UI コンポーネントには依存関係が生まれることがある
- React では Compound Components パターンが使われるが、Svelte では 1 つのファイルに 1 つのコンポーネントしか書けない
- Barrel ファイルを使えば依存関係のあるコンポーネントをまとめることができる
- Barrel ファイルのデメリットもあるので注意が必要

<!-- それではこの発表のまとめです。UI コンポーネントを作る際には依存関係が生まれることがあるため、その依存関係を明示的に示すことが重要です。React では Compound Components パターンが使われることがありますが、Svelte では 1 つのファイルに 1 つのコンポーネントしか書けないため、Barrel ファイルを使うことで依存関係のあるコンポーネントをまとめることができます。Barrel ファイルを使う際にはデメリットもあるため、よく理解した上で使うことが重要です。 -->
