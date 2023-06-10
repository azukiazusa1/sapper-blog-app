import { expect } from "@storybook/jest";
import type { Meta, StoryObj } from "@storybook/svelte";
import { within } from "@storybook/testing-library";
import Pagination from "./Pagination.svelte";

const meta: Meta<Pagination> = {
  title: "Pagination",
  component: Pagination,
  tags: ["autodocs"],
  argTypes: {
    page: {
      control: { type: "number" },
      description: "現在のページ",
      default: 1,
    },
    total: {
      control: { type: "number" },
      description: "総アイテム数",
    },
    limit: {
      control: { type: "number" },
      description: "1ページあたりのアイテム数",
    },
    href: {
      control: { type: "text" },
      description: "ページネーションのリンク先",
      default: "/blog/page/",
    },
  },
};

export default meta;
type Story = StoryObj<Pagination>;

export const Default: Story = {
  args: {
    page: 1,
    total: 100,
    limit: 10,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const prev = canvas.queryByRole("link", { name: "前のページ" });
    const next = canvas.queryByRole("link", { name: "次のページ" });
    const page1 = canvas.queryByRole("link", { name: "1" });

    expect(prev).not.toBeInTheDocument();
    expect(next).toHaveAttribute("href", "/blog/page/2");
    expect(page1).toHaveAttribute("aria-current", "page");
  },
};

export const Page2: Story = {
  args: {
    page: 2,
    total: 100,
    limit: 10,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page2 = canvas.queryByRole("link", { name: "2" });
    const prev = canvas.queryByRole("link", { name: "前のページ" });
    const next = canvas.queryByRole("link", { name: "次のページ" });

    expect(prev).toHaveAttribute("href", "/blog/page/1");
    expect(next).toHaveAttribute("href", "/blog/page/3");
    expect(page2).toHaveAttribute("aria-current", "page");
  },
};

export const NoMorePage: Story = {
  args: {
    page: 10,
    total: 100,
    limit: 10,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const prev = canvas.queryByRole("link", { name: "前のページ" });
    const next = canvas.queryByRole("link", { name: "次のページ" });

    expect(prev).toBeInTheDocument();
    expect(next).not.toBeInTheDocument();
  },
};

export const OnlyOnePage: Story = {
  args: {
    page: 1,
    total: 10,
    limit: 10,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const prev = canvas.queryByRole("link", { name: "前のページ" });
    const next = canvas.queryByRole("link", { name: "次のページ" });

    expect(prev).not.toBeInTheDocument();
    expect(next).not.toBeInTheDocument();
  },
};
