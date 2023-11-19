import type { Meta, StoryObj } from "@storybook/svelte";
import Timeline from "./Timeline.svelte";

const meta: Meta<Timeline> = {
  title: "Time",
  component: Timeline,
  tags: ["autodocs"],
  argTypes: {
    eventTitle: {
      control: { type: "text" },
      describe: "登壇したイベント名",
    },
    eventDate: {
      control: { type: "text" },
      describe: "登壇したイベントの日付",
    },
    presentationTitle: {
      control: { type: "text" },
      describe: "登壇資料のタイトル",
    },
    presentationLink: {
      control: { type: "text" },
      describe: "登壇資料のURL",
    },
    description: {
      control: { type: "text" },
      describe: "発表内容の概要",
    },
  },
};

export default meta;
type Story = StoryObj<Timeline>;

export const Default: Story = {
  args: {
    eventTitle: "JSConf JP 2023",
    eventDate: "2023-11-19",
    presentationTitle: "JavaScript なしで動作するモダンなコードの書き方",
    presentationLink: "https://example.com/",
    description:
      "Next.js、Remix、SvelteKit といった近年のフレームワークは、JavaScript がなくても動作することを一つの価値として提供しています。例えばSvelteKit のフォームではプログレッシブエンハンスメントとして、JavaScript が利用できる環境ではリッチなユーザー体験を提供しつつ、JavaScript が使えない環境においては HTML のフォームとして振る舞うことでアプリケーションの機能を変わらず提供できます。 React Server Component はサーバー側で HTML に変換されるため、クライアントに JavaScript のコードが配信されることはありません。React Server Component では useState() を使用できないといった制約がありますので、我々開発者は React Server Component の利点を十分に発揮するために、JavaScript を用いた状態管理を行う範囲を狭めることが求められています。このトークでは、CSS の :has() セレクターや、Popover API といった、従来は JavaScript を用いなければ提供できなかった機能を代替する方法を紹介します。",
  },
};
