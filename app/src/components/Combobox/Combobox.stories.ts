import type { Meta, StoryObj } from "@storybook/svelte";
import Combobox from "./Combobox.svelte";
import type { Item } from "./types";

const meta = {
  title: "Combobox",
  component: Combobox,
  tags: ["autodocs"],
  argTypes: {
    items: {
      control: { type: "object" },
      describe:
        "選択肢の配列。各要素は { imageUrl: string, text: string, key: string } の形式である必要がある。",
    },
    loading: {
      control: { type: "boolean" },
      describe: "ローディング中かどうか",
    },
    value: {
      control: { type: "text" },
      describe: "入力されている値",
    },
  },
} satisfies Meta<Combobox>;

export default meta;
type Story = StoryObj<Combobox>;

const items: Item[] = [
  {
    imageUrl: "https://placehold.jp/24/cccccc/ffffff/150x150.png?text=1",
    text: "Item 1",
    key: "1",
  },
  {
    imageUrl: "https://placehold.jp/24/cccccc/ffffff/150x150.png?text=2",
    text: "Item 2",
    key: "2",
  },
  {
    imageUrl: "https://placehold.jp/24/cccccc/ffffff/150x150.png?text=3",
    text: "Item 3",
    key: "3",
  },
  {
    imageUrl: "https://placehold.jp/24/cccccc/ffffff/150x150.png?text=4",
    text: "Item 4",
    key: "4",
  },
  {
    imageUrl: "https://placehold.jp/24/cccccc/ffffff/150x150.png?text=5",
    text: "Item 5",
    key: "5",
  },
];

export const Default: Story = {
  args: {
    items,
    loading: false,
    value: "",
  },
};

export const Loading: Story = {
  args: {
    items,
    value: "hoge",
    loading: true,
  },
};

export const noResults: Story = {
  args: {
    items: [],
    loading: false,
    value: "hoge",
  },
};
