import type { Meta, StoryObj } from "@storybook/svelte";
import { within } from "@storybook/test";
import { expect } from "@storybook/test";
import Time from "./Time.svelte";

const meta: Meta<Time> = {
  title: "Time",
  component: Time,
  tags: ["autodocs"],
  argTypes: {
    date: {
      control: { type: "text" },
      describe: "日付",
    },
  },
};

export default meta;
type Story = StoryObj<Time>;

export const Default: Story = {
  args: {
    date: "2021-01-01T00:00:00.000Z",
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const time = canvas.getByText("2021.01.01");

    expect(time).toHaveAttribute("datetime", "2021-01-01T00:00:00.000Z");
  },
};
