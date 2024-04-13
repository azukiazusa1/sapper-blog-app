import type { Meta, StoryObj } from "@storybook/svelte";
import LinkButton from "./LinkButtonView.svelte";

const meta: Meta<LinkButton> = {
  title: "LinkButton",
  component: LinkButton,
  tags: ["autodocs"],
  argTypes: {},
};

export default meta;
type Story = StoryObj<LinkButton>;

export const Primary: Story = {
  args: {
    variant: "primary",
    slot: "もっと見る",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    slot: "もっと見る",
  },
};
