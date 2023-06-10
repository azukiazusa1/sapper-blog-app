import type { Meta, StoryObj } from "@storybook/svelte";
import Tag from "./Tag.svelte";
import TagWithBadge from "./TagWithBadge.svelte";

const meta: Meta<Tag> = {
  title: "Tag",
  component: Tag,
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: { type: "text" },
      describe: "タグ名",
    },
    slug: {
      control: { type: "text" },
      describe: "スラッグ",
    },
  },
};

export default meta;
type Story = StoryObj<Tag>;

export const Default: Story = {
  args: {
    name: "tag",
    slug: "tag",
  },
};

export const WithBadge: Story = {
  render: (args) => ({
    Component: TagWithBadge,
    props: args,
  }),
  args: {
    name: "tag",
    slug: "tag",
  },
};
