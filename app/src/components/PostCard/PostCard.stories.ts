import type { Meta, StoryObj } from "@storybook/svelte";
import PostCard from "./PostCard.svelte";
import Decorator from "./Decorator.svelte";

const meta: Meta<PostCard> = {
  title: "PostCard",
  component: PostCard,
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: { type: "text" },
      description: "タイトル",
    },
    slug: {
      control: { type: "text" },
      description: "スラッグ",
    },
    about: {
      control: { type: "text" },
      description: "概要",
    },
    createdAt: {
      control: { type: "date" },
      description: "作成日",
    },
    tags: {
      control: { type: "array" },
      description: "タグ",
    },
    thumbnail: {
      control: { type: "object" },
      description: "サムネイル",
    },
    small: {
      control: { type: "boolean" },
      description: "フッターを表示するか",
      default: false,
    },
    lazy: {
      control: { type: "boolean" },
      description: "画像を遅延読み込みするか",
      default: true,
    },
  },
  decorators: [() => Decorator as any],
};

export default meta;
type Story = StoryObj<PostCard>;

export const Default: Story = {
  args: {
    title: "title",
    slug: "slug",
    about: "about",
    createdAt: new Date().toString(),

    tags: [
      {
        name: "tag1",
        slug: "tag1",
      },
      {
        name: "tag2",
        slug: "tag2",
      },
    ],
    thumbnail: {
      url: "https://picsum.photos/200/300",
      title: "title",
    },
  },
};

export const Small: Story = {
  args: {
    title: "title",
    slug: "slug",
    about: "about",
    createdAt: new Date().toString(),

    tags: [
      {
        name: "tag1",
        slug: "tag1",
      },
      {
        name: "tag2",
        slug: "tag2",
      },
    ],
    thumbnail: {
      url: "https://picsum.photos/200/300",
      title: "title",
    },
    small: true,
  },
};
