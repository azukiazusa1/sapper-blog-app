import type { Meta, StoryObj } from "@storybook/svelte";

import ShortBlog from "./ShortBlog.svelte";

const meta = {
  title: "ShortBlog",
  component: ShortBlog,
  tags: ["autodocs"],
} satisfies Meta<ShortBlog>;

export default meta;
type Story = StoryObj<ShortBlog>;

export const Default: Story = {
  args: {
    id: "tailwind-css-data-attribute",
    contents: [
      "TailwindCSS v3.2 からは data 属性を使って、条件付きでスタイルを適用できます。",
      "例えば、`data-active=true` 属性を持つ要素のみにスタイルを適用する場合には、以下のようなクラスを書きます。\n\n```css\n[data-active=true] {\n  background-color: blue;\n}\n```",
      "JavaScript で data 属性を操作することで、動的にスタイルを変更する用途でよく使われます。",
      "Radix UI や React Aria Components などの多くのヘッドレス UI コンポーネントライブラリの実装では `data` 属性が公開されています。data 属性を使って、例えばアコーディオンが開いている場合のみ `data-state=open` に設定されるので、アコーディオンの状態に応じてスタイルを適用するといったことが可能です。",
    ],
  },
};
