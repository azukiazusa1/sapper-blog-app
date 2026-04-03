import type { Meta, StoryObj } from "@storybook/svelte";

import ShortBlog from "./ShortBlog.svelte";
import { shortThreadHtmlFixture } from "../Shorts.fixtures";

const meta = {
  title: "ShortBlog",
  component: ShortBlog,
  tags: ["autodocs"],
} satisfies Meta<ShortBlog>;

export default meta;
type Story = StoryObj<ShortBlog>;

export const Default: Story = {
  args: {
    title: "Tailwind CSS の data 属性",
    htmlThreadItems: shortThreadHtmlFixture,
    backHref: "/blog/shorts",
    shareUrl: "https://azukiazusa.dev/blog/shorts/tailwind-data-attribute",
    createdAt: "2026-03-18T10:00:00.000Z",
  },
};
