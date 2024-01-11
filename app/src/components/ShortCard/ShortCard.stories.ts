import type { Meta, StoryObj } from "@storybook/svelte";

import Box from "./ShortCardView.svelte";

const meta = {
  title: "Box",
  component: Box,
  tags: ["autodocs"],
} satisfies Meta<Box>;

export default meta;
type Story = StoryObj<Box>;

export const Default: Story = {
  args: {
    title: "Tailwind CSS の data 属性",
    slot: "Tailwind CSS では、data 属性を使って、動的にスタイルを変更することができます。",
    id: "tailwind-css-data-attribute",
  },
};
