import type { Meta, StoryObj } from "@storybook/svelte";

import Link from "./LinkView.svelte";

const meta: Meta<Link> = {
  title: "Link",
  component: Link,
  tags: ["autodocs"],
  argTypes: {
    slot: {
      control: { type: "text" },
    },
    href: {
      control: { type: "text" },
    },
    target: {
      control: { type: "text" },
    },
  },
};

export default meta;
type Story = StoryObj<Link>;

export const Primary: Story = {
  args: {
    slot: "リンク",
  },
};
