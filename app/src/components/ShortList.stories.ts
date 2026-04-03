import type { Meta, StoryObj } from "@storybook/svelte";
import ShortList from "./ShortList.svelte";
import { shortListHtmlFixtures } from "./Shorts.fixtures";

const meta = {
  title: "ShortList",
  component: ShortList,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<ShortList>;

export default meta;
type Story = StoryObj<ShortList>;

export const Collapsed: Story = {
  args: {
    shorts: shortListHtmlFixtures,
  },
};

export const Expanded: Story = {
  args: {
    shorts: shortListHtmlFixtures,
    expandedId: shortListHtmlFixtures[0].sys.id,
  },
};
