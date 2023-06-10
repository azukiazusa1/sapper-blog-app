import type { Meta, StoryObj } from "@storybook/svelte";
import Footer from "./Footer.svelte";

const meta: Meta<Footer> = {
  title: "Footer",
  component: Footer,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Footer>;

export const Default: Story = {};
