---
id: 1accil6j4zOilN2EE3GDW
title: "Figma MCP でデザインシステムを提供して AI コーディングエージェントに一貫したフロントエンドコードを書かせる"
slug: "using-figma-mcp-to-provide-design-system-for-ai-coding-agents"
about: "AI コーディングエージェントにフロントエンドのコードを書かせる際、Figma MCP を使用してデザインコンテキストやデザイントークンを提供することで、一貫したデザインガイドラインを遵守させる方法を紹介します。"
createdAt: "2026-01-03T10:27:00+09:00"
updatedAt: "2026-01-03T10:27:00+09:00"
tags: ["AI", "figma", "MCP", "claude-code"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4l94jJLmBwLhEVfbEUhHKl/53bc961ff90a64b588ba7c788b77e641/koucha_tea_5898-768x656.png"
  title: "紅茶のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "記事で紹介されている `get_variable_defs` ツールの役割として正しいものはどれか？"
      answers:
        - text: "Figma ファイルからデザイントークンを CSS 変数の形式で取得する"
          correct: true
          explanation: "記事では、`get_variable_defs` ツールのレスポンスを見ると CSS 変数の形式でデザイントークンが取得できていることが確認できると説明されています。"
        - text: "Figma ファイルのスクリーンショットを取得する"
          correct: false
          explanation: "スクリーンショットの取得は `get_screenshot` ツールの役割です。"
        - text: "Figma ファイルのデザインコンテキストを取得する"
          correct: false
          explanation: "デザインコンテキストの取得は `get_design_context` ツールの役割です。"
        - text: "Figma コンポーネントの Variants 情報を取得する"
          correct: false
          explanation: "Variants 情報は `get_design_context` ツールで取得されます。"
published: true
---
AI コーディングエージェントにフロントエンドのコードを書かせる際、デザインの正確なコンテキストを提供することが課題の 1 つです。特に何も指定せずにフロントエンドのコードを書かせると、紫色の配色やグラデーションに偏りすぎたり、Inter や Roboto など特定のフォントばかり使用する傾向があります。これは Tailwind UI のような人気の UI フレームワークの初期設定に Indigo（紫色）を採用しており、それが AI モデルの学習データに多く含まれていることが原因と考えられます。

AI によって誰でも一定水準のフロントエンドコードを書けるようになる一方で、画一的な安易なデザインになりがちという問題が指摘されています。このような問題を脱却するためには人間による細かな指示やデザインスキルの重要性がこれまで以上に高まっています。このような問題をより詳細に理解するために以下のリソースが参考になります。

- [The AI Purple Problem - YouTube](https://www.youtube.com/watch?v=AG_791Y-vs4)
- [Improving frontend design through Skills | Claude](https://claude.com/blog/improving-frontend-design-through-skills)

特にデザインシステムやスタイルガイドを元に AI にコードを書かせる手法が注目されています。デザイントークンとしてカラー、タイポグラフィ、スペーシングなどの情報を提供することで、AI に一貫したデザインガイドラインを遵守させることが可能になります。AI にデザインガイドラインを提供する手法として、Figma MCP を使用する方法があります。Figma MCP を使用することで、Figma 上のデザインデータを AI コーディングエージェントに提供できます。また、Storybook MCP を使用することで、AI コーディングエージェントが Storybook 上のコンポーネントを参照して既存のコンポーネントを再利用したり、コンポーネント単位のテストでフィードバックループを実現できます。

この記事では Figma MCP と Storybook MCP を使用してフロントエンド開発する方法を紹介します。

## Figma MCP を使用してデザインコンテキストを提供する

[Figma MCP サーバー](https://developers.figma.com/docs/figma-mcp-server/) は Figma Design、FigJam および Make ファイルからコードを生成する AI エージェントに重要なコンテキストを提供することで、開発者がデザインを迅速かつ正確に実装できるよう支援するツールです。Figma MCP サーバーを使用することで以下のことが可能になります。

- ノード ID を使用して Figma ファイル内の特定のデザイン要素にアクセス
- デザインコンテキストの取得: レイアウト、タイポグラフィ、カラー、コンポーネント構造など
- 視覚的参照のキャプチャ: スクリーンショットを取得
- アセットのダウンロード: 画像やアイコンなどのアセットを取得

Figma MCP サーバーの接続方法には以下の 2 つの方法があります。

- リモートサーバー: Figma のホストエンドポイントに接続（すべてのシートとプランで利用可能）
- デスクトップサーバー: ローカルマシンで Figma デスクトップアプリケーションを使用してホスト（全ての有料プランの Dev またはフルシートで利用可能）

ここではリモートサーバー + Claude Code を使って Next.js + Tailwind CSS のプロジェクトで Figma MCP を使用する手順を説明します。また Figma のデザインデータとして Figma Community で公開されている [Simple Design System](https://www.figma.com/community/file/1380235722331273046/simple-design-system) を使用しています。

### Figma MCP サーバーのセットアップ

Claude Code で Figma MCP を使用するには以下のコマンドを実行します。このコマンドは Figma MCP サーバーをプロジェクト単位でインストールします。

```bash
claude mcp add --transport http figma https://mcp.figma.com/mcp -s project
```

MCP サーバーが正しく追加されれば、`.mcp.json` ファイルが作成され、以下のように記述されます。

```json:.mcp.json
{
  "mcpServers": {
    "figma": {
      "type": "http",
      "url": "https://mcp.figma.com/mcp"
    }
  }
}
```

Claude Code を起動して `/mcp` コマンドを実行し、Figma MCP サーバーがリストに表示されていることを確認しましょう。

```bash
/mcp
```

![](https://images.ctfassets.net/in6v9lxmm5c8/2AUqwlU5FDzvzGAD2tLMbZ/df0f0e97a82bcaf11fe6969d20ac2324/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-03_11.12.57.png)

「needs authentication · Enter to login」というメッセージが表示されていて、認証が完了するまで機能が利用できないことがわかります。figma を選択して Enter キーを押して「1. Authenticate」を選択すると、Figma の認証ページがブラウザで開きます。

![](https://images.ctfassets.net/in6v9lxmm5c8/23yYtTTnZ8GoWxwSwWHQ05/655e5f6a58614ef87763e6ead66bb9f9/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-03_11.15.06.png)

問題がなければ「同意してアクセスを許可する」ボタンをクリックして認証を完了させましょう。認証が正常に完了すると「Authentication successful. Connected to figma.」メッセージが表示されます。

さらに Claude Code がより有効に Figma MCP サーバーを使用できるように Figma 公式で提供されている [Skills](https://code.claude.com/docs/ja/skills) を追加してみましょう。Skills は AI エージェントに特定の知識や能力を提供するためのモジュールです。Figma MCP サーバー用の Skill では Figma MCP サーバーを効果的に使用するためのガイドラインがマークダウン形式で提供されています。

https://github.com/figma/mcp-server-guide/blob/main/skills/implement-design/SKILL.md

Figma の Skills は[プラグイン](https://code.claude.com/docs/ja/plugins) として提供されているため、Claude Code を起動して `/plugin` コマンドを実行することでインストールできます。

```bash
/plugin
```

検索フォームに `figma` と入力し、`Figma` プラグインを選択しましょう。このプラグインは `claude-plugins-official` マーケットプレイスで提供されているため、初めからリストに表示されているはずです。もし表示されていない場合は `Marketplaces` タブで `claude-plugins-official` マーケットプレイスが有効になっていることを確認してください。

![](https://images.ctfassets.net/in6v9lxmm5c8/2RqiiIUse7L762ZoiEoq21/9197da2cd73b941753325aa21e517069/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-03_11.07.21.png)

`Install for all collaborators on this repository (project scope)` を選択してインストールを完了させましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/10f97jylKDD6L0opvSf8hp/1c74c1f466bbcba085f6f9aaccfabb22/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-03_11.09.15.png)

Claude Code を再起動して `Installed` タブで `Figma` プラグインが表示されていることが確認できます。code-connect-components, create-design-system-rules, implement-design の 3 つの Skill が自動的にインストールされているはずです。

![](https://images.ctfassets.net/in6v9lxmm5c8/6wmFhp2zznw8o2AIZRn4b2/596ec54bfc70de5c46693c00f3b8c219/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-03_11.10.30.png)

### Figma MCP を使用してデザイントークンを取得する

それでは実際に Figma MCP を使用してコードを生成してもらいましょう。まずは Figma MCP サーバーを使用して Figma ファイルからデザイントークンを取得し、Tailwind CSS の設定ファイルに変換する作業をしてもらいます。

Figma ファイルの Color レイヤーのリンクを取得し、そのリンクを Claude Code へのプロンプトに含めて指示を出します。レイヤーのリンクを取得するには、Figma ファイルを開き、Color レイヤーを選択した状態で右クリックし、「コピー/貼り付けオプション」>「選択範囲へのリンクをコピー」を選択します。

![](https://images.ctfassets.net/in6v9lxmm5c8/7itPFtxxyc6AYs6gAfjtsC/59b4f062608feea3c140b4b28a8037bc/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-03_11.49.28.png)

プロンプトの例は以下の通りです。

```
Figma のデザインファイルの Color レイヤーへのリンクを以下に示します
  https://www.figma.com/design/02mZfULtR6WitQ5tNv3qQm/Simple-Design-System--Community-?node-id=226-13679&t=ya00BKdw48mU98Hn-4

  このページからカラー、タイポグラフィ、スペーシングのデザイントークンを抽出し、Tailwind CSS
  v4のCSS-first configuration形式でデザイントークンに変換してください。デザイントークンは `globals.css` ファイルに記述してください。
```

Figma MCP サーバーの `get_screenshot`, `get_variable_defs`, `get_design_context` ツールが呼び出され、Color レイヤーのデザインコンテキストの取得が試みられていることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/483jSKtkDFObYjEkISZxUo/98c455f4e7bf8cf1afe09c72c49b1de8/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-03_11.51.42.png)

`get_variable_defs` ツールのレスポンスを見てみると、CSS 変数の形式でデザイントークンが取得できていることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/NFFi0McgOvgUnuWjItuvG/3903964de6f382788cbb418dd32617c5/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-03_11.52.54.png)

`get_variable_defs` ツールのレスポンスを元に、Tailwind CSS v4 の形式でデザイントークンに変換し、`globals.css` ファイルに記述してもらうことができました。

```css:globals.css
@import "tailwindcss";

:root {
  /* Base Colors */
  --sds-color-background-default-default: #ffffff;
  --sds-color-background-default-default-hover: #f5f5f5;
  --sds-color-background-default-secondary: #f5f5f5;
  --sds-color-background-default-secondary-hover: #e6e6e6;
  --sds-color-background-default-tertiary: #d9d9d9;
  --sds-color-background-default-tertiary-hover: #b3b3b3;
  --sds-color-background-disabled-default: #d9d9d9;

  /* 省略... */
}

@theme {
  /* Colors - Background */
  --color-bg-default: var(--sds-color-background-default-default);
  --color-bg-default-hover: var(--sds-color-background-default-default-hover);
  --color-bg-secondary: var(--sds-color-background-default-secondary);
  --color-bg-secondary-hover: var(--sds-color-background-default-secondary-hover);
  --color-bg-tertiary: var(--sds-color-background-default-tertiary);
  --color-bg-tertiary-hover: var(--sds-color-background-default-tertiary-hover);
  --color-bg-disabled: var(--sds-color-background-disabled-default);

  /* 省略... */
}
```

### Storybook MCP を使用してコンポーネントを作成

続いて Figma のデザインとして提供されたコンポーネントを Storybook の Story として実装してもらいましょう。AI エージェントに Storybook の実装をしてもらう場合は [Storybook MCP Addon](https://github.com/storybookjs/mcp) を使用するとより効果的です。Storybook MCP Addon を使用することで、AI エージェントが Storybook のベストプラクティスに従って Story を実装したり、既存のコンポーネントを再利用したり、コンポーネント単位のテストでフィードバックループを実現できます。

Storybook MCP Addon をインストールするには以下のコマンドを実行します。

```bash
npm install @storybook/addon-mcp
```

続いて Storybook の設定ファイルで Storybook MCP Addon を有効にします。`.storybook/main.ts` ファイルを開き、以下のように記述します。

```ts:.storybook/main.ts {13}
import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-mcp",
  ],
  framework: "@storybook/nextjs-vite",
  staticDirs: ["../public"],
};
export default config;
```

Storybook を起動します。http://localhost:6006/mcp が MCP サーバーのエンドポイントとして追加されていることがわかります。

```bash
npm run storybook
```

![](https://images.ctfassets.net/in6v9lxmm5c8/5lW2DZAf3eSU2hR3aReeng/3a89f5bf9cda3c43b29c8ff44c869d6a/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-03_12.50.09.png)

後は通常の MCP サーバーを追加するフローと同様に、Claude Code で以下のコマンドを実行して Storybook MCP サーバーをプロジェクト単位で追加します。

```bash
claude mcp add --transport http storybook http://localhost:6006/mcp -s project
```

Figma のデザインファイルの Button コンポーネントのリンクを取得し、そのリンクを Claude Code へのプロンプトに含めて指示を出します。プロンプトの例は以下の通りです。

```text
Figma のデザインファイルの Button コンポーネントへのリンクを以下に示します
https://www.figma.com/design/02mZfULtR6WitQ5tNv3qQm/Simple-Design-System--Community-?node-id=4185-3778&t=jxNNSXWAjoYWC19h-4

このデザインを元に Storybook v10 の Story として Button コンポーネントを実装してください。

- コンポーネントは `/components/Button/Button.tsx` に実装してください
- Story は `/components/Button.stories.tsx` に実装してください（コンポーネントと同じディレクトリに配置してください）
- tailwind CSS v4 の CSS-first configuration で定義されたユティリティクラスが使用可能です
- storybook MCP get-ui-building-instructions ツールを使用してベストプラクティスに従って実装してください
```

Figma デザインコンテキストを取得して、Button コンポーネントの Variants を理解したうえでコンポーネントの実装が行われていることがわかります。

```sh
Figma のデザインを取得できました。Button コンポーネントには Primary、Neutral、Subtle の3つのバリエーションと、Default、Hover、Disabled の3つの状態、そして Medium と Small の2つのサイズがあります。
```

実際に作成された Button コンポーネントと Story は以下の通りです。

```tsx:components/Button/Button.tsx
import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "neutral" | "subtle";
  size?: "medium" | "small";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "medium",
      disabled = false,
      leftIcon,
      rightIcon,
      children,
      className = "",
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 rounded-sm border transition-colors";

    const variantStyles = {
      primary: {
        default: "bg-brand border-brand text-on-brand",
        hover: "hover:bg-brand-hover hover:border-brand",
        disabled: "bg-disabled border-disabled text-on-disabled",
      },
      neutral: {
        default: "bg-neutral-tertiary border-neutral-secondary text-on-surface",
        hover: "hover:bg-neutral-tertiary-hover hover:border-neutral-secondary",
        disabled: "bg-disabled border-disabled text-on-disabled",
      },
      subtle: {
        default: "bg-transparent border-transparent text-on-surface",
        hover: "hover:border",
        disabled: "bg-disabled border-disabled text-on-disabled",
      },
    };

    const sizeStyles = {
      medium: "p-3 text-base",
      small: "p-2 text-base",
    };

    const iconSize = "w-4 h-4 shrink-0";

    const styles = [
      baseStyles,
      variantStyles[variant].default,
      !disabled && variantStyles[variant].hover,
      disabled && variantStyles[variant].disabled,
      sizeStyles[size],
      disabled && "cursor-not-allowed",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        className={styles}
        disabled={disabled}
        type="button"
        {...props}
      >
        {leftIcon && <span className={iconSize}>{leftIcon}</span>}
        <span className="font-normal leading-none">{children}</span>
        {rightIcon && <span className={iconSize}>{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = "Button";
```

```tsx:components/Button.stories.tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { Button } from "./Button";

// Simple icon components for demonstration
const StarIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 1L10.163 5.39L15 6.12L11.5 9.53L12.326 14.34L8 12.06L3.674 14.34L4.5 9.53L1 6.12L5.837 5.39L8 1Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const XIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 4L4 12M4 4L12 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "neutral", "subtle"],
      description: "Visual style variant of the button",
    },
    size: {
      control: "select",
      options: ["medium", "small"],
      description: "Size of the button",
    },
    disabled: {
      control: "boolean",
      description: "Whether the button is disabled",
    },
    leftIcon: {
      control: false,
      description: "Icon to display on the left side",
    },
    rightIcon: {
      control: false,
      description: "Icon to display on the right side",
    },
    children: {
      control: "text",
      description: "Button label text",
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Primary Variants
export const PrimaryMedium: Story = {
  args: {
    variant: "primary",
    size: "medium",
    children: "Button",
  },
};

export const PrimarySmall: Story = {
  args: {
    variant: "primary",
    size: "small",
    children: "Button",
  },
};

export const PrimaryDisabled: Story = {
  args: {
    variant: "primary",
    size: "medium",
    disabled: true,
    children: "Button",
  },
};

export const PrimaryWithLeftIcon: Story = {
  args: {
    variant: "primary",
    size: "medium",
    leftIcon: <StarIcon />,
    children: "Button",
  },
};

export const PrimaryWithRightIcon: Story = {
  args: {
    variant: "primary",
    size: "medium",
    rightIcon: <XIcon />,
    children: "Button",
  },
};

export const PrimaryWithBothIcons: Story = {
  args: {
    variant: "primary",
    size: "medium",
    leftIcon: <StarIcon />,
    rightIcon: <XIcon />,
    children: "Button",
  },
};

// Neutral Variants
export const NeutralMedium: Story = {
  args: {
    variant: "neutral",
    size: "medium",
    children: "Button",
  },
};

export const NeutralSmall: Story = {
  args: {
    variant: "neutral",
    size: "small",
    children: "Button",
  },
};

export const NeutralDisabled: Story = {
  args: {
    variant: "neutral",
    size: "medium",
    disabled: true,
    children: "Button",
  },
};

export const NeutralWithLeftIcon: Story = {
  args: {
    variant: "neutral",
    size: "medium",
    leftIcon: <StarIcon />,
    children: "Button",
  },
};

export const NeutralWithRightIcon: Story = {
  args: {
    variant: "neutral",
    size: "medium",
    rightIcon: <XIcon />,
    children: "Button",
  },
};

// Subtle Variants
export const SubtleMedium: Story = {
  args: {
    variant: "subtle",
    size: "medium",
    children: "Button",
  },
};

export const SubtleSmall: Story = {
  args: {
    variant: "subtle",
    size: "small",
    children: "Button",
  },
};

export const SubtleDisabled: Story = {
  args: {
    variant: "subtle",
    size: "medium",
    disabled: true,
    children: "Button",
  },
};

export const SubtleWithLeftIcon: Story = {
  args: {
    variant: "subtle",
    size: "medium",
    leftIcon: <StarIcon />,
    children: "Button",
  },
};

export const SubtleWithRightIcon: Story = {
  args: {
    variant: "subtle",
    size: "medium",
    rightIcon: <XIcon />,
    children: "Button",
  },
};

// Interactive Playground
export const Playground: Story = {
  args: {
    variant: "primary",
    size: "medium",
    children: "Button",
  },
};
```

Storybook MCP の効果は少し分かりづらいですが、MCP を使用していない場合と比較して `storybook/test` の `fn()` ヘルパーが使用されていることや、Story のメタデータが充実していることがわかります。またどのコンポーネントがどの Storybook の URL に対応しているかどうかも `get-story-urls` ツールを使用して把握できます。Story の数が多くなってくるとどのコンポーネントがどの Story に対応しているか把握するのが難しくなるため、地味に便利な機能です。

![](https://images.ctfassets.net/in6v9lxmm5c8/4YUI3Rf3kAjkaooEiFsHuM/bbb486114190e8aab521df7097d650f1/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-03_13.18.56.png)

実際に Figma のデザインと Storybook 上のコンポーネントを比較してみると、再現度の高いコンポーネントが実装されていることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/4ykHSE8bJfhSw9khdehZqZ/da655fa93905418e18eb56ae5301d3d3/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-03_13.20.24.png)

### ページを作成する

最後に Figma のデザインを元にページ単位での実装をしてもらいましょう。ページの実装に必要なコンポーネントはあらかじめ Storybook 上で実装しておきます。ページ全体を一度に実装しようとすると複雑になりすぎるため、ページを構成するコンポーネント単位で分割して実装してもらうのがポイントです。この際に Figma のデザイン上でもコンポーネント単位で分割しておくとより効果的です。

> より高速で信頼性の高い結果を得るために、画面を小さな部分 (コンポーネントや論理チャンクなど) に分割します。選択範囲が広いと、特にモデルが処理できるコンテキストが多すぎる場合、ツールの動作が遅くなったり、エラーが発生したり、不完全な応答が返される可能性があります。

https://developers.figma.com/docs/figma-mcp-server/avoid-large-frames/

以下のコンポーネントを Button コンポーネントと同様に Figma のデザインを元に実装してもらいました。

- Header コンポーネント
- Footer コンポーネント
- Card コンポーネント
- Avatar コンポーネント

Figma のデザインファイルに含まれる `Examples/About Page` フレームのリンクを取得し、そのリンクを Claude Code へのプロンプトに含めて指示を出します。

```text
Figma のデザインファイルの Examples/About Page を元に `/about` パスに対応するホームページを実装してください。

  https://www.figma.com/design/02mZfULtR6WitQ5tNv3qQm/Simple-Design-System--Community-?node-id=562-9044&t=jxNNSXW
  AjoYWC19h-4

  - components/ ディレクトリに存在するコンポーネントを再利用してください
```

ページ全体のレイヤーを取得しようとすると、`get_design_context` ツールのレスポンスが大きすぎてエラーになることがしばしばあります。

```sh
⏺ Figma デザインの内容を確認します。

⏺ Read(~/.claude/projects/-Users-asai-sandbox-figma-mcp-example/ed0448aa-ee42-4430-a6c6-87e68bf71e9b/tool-results/m
      cp-figma-get_design_context-1767420751342.txt)
  ⎿  Error: File content (34202 tokens) exceeds maximum allowed tokens (25000). Please use offset and limit
     parameters to read specific portions of the file, or use the GrepTool to search for specific content.
```

この場合はページを構成するコンポーネント単位で分割して実装してもらうようにしましょう。例えば `Examples/About Page` フレームは `Header`, `Hero Basic`, `Panel Image Double`, `Card Grid Content List`, `Card Grid Image`, `Footer` の 6 つのセクションに分割されているため、これらのセクション単位で分割して実装してもらうとより正確にコンテキストを把握してもらいやすくなるでしょう。このことは Figma でデザインを作成するときも意識しておくと良いでしょう。適切にレイヤーが分割されていれば AI エージェントに指示を出しやすいだけでなく、人間が実装する場合も理解しやすくなるはずです。

![](https://images.ctfassets.net/in6v9lxmm5c8/1FJzBqgXjlmiyRk3pCH2KX/ba8b6d48853d740f33a037c684147db3/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-03_15.21.45.png)

あらためてセクションに分割した上でプロンプトを作成します。

```text
Header と Footer を app/layout.tsx に共通レイアウトとして実装してください
```

```text
Figma のデザインファイルの Examples/About Page の Hero Basic を元に /about ページの Hero セクションを実装してください。

https://www.figma.com/design/02mZfULtR6WitQ5tNv3qQm/Simple-Design-System--Community-?node-id=175-4836&t=jxNNSXWAjoYWC19h-4

- components/ ディレクトリに存在するコンポーネントを再利用してください
- app/about/HeroBasic.tsx コンポーネントに実装し、 app/about/page.tsx からインポートして使用してください
```

最終的な成果物は以下のようになります。Figma デザインと比較しても高い再現度で実装されていることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/643g938h9wjwWLyE8pxpsD/364fe6697090e063f90209b6eff87f10/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-03_15.59.02.png)

実際に Figma MCP サーバーを使用してデザインシステムの構築からページの実装までを行ってみた感想としては、Figma MCP サーバーを適切に使用すればデザインからコードへの変換プロセスを大幅に効率化できると感じました。一方で Figma 自体のデザインの構造をベストプラクティスに従って設計しておくことが改めて重要になるでしょう。

特にページ全体を一度に実装しようとするとコンテキストが大きくなりすぎてしまうため、適切にレイヤーを分割しておく必要があります。またレイヤーやコンポーネントに正しい名前がつけられていなければ、AI エージェントが実装に当たってどのコンポーネントを使用すれば良いのか判断できなくなってしまいます。

Auto Layout や Variants, Variables など Figma の強力な機能を活用してデザインシステムを設計することも重要です。Auto Layout が使用されていなければレスポンシブ対応のコードを生成することが難しくなりますし、Variants が使用されていなければコンポーネントのバリエーションを正確に把握できなくなってしまいます。AI 時代にはコードの実装自体はある程度自動化できるため、差が出やすいのはデザインの設計部分になるでしょう。より素早く高品質なコードを生成するためにも、Figma でのデザイン設計に注力したり、デザインガイドラインを整備したりすることが重要になると考えられます。

## まとめ

- Figma MCP サーバーと Claude Code を組み合わせることで、Figma のデザインからデザイントークンの抽出、コンポーネントの実装、ページの作成まで行う方法を紹介した
- Figma MCP サーバーの接続方法にはリモートサーバー方式とデスクトップサーバー方式がある
- リモートサーバー方式では MCP サーバーを追加した後に Figma アカウントで認証する必要がある
- `get_variable_defs` ツールを使用して Figma ファイルからデザイントークンを抽出し、Tailwind CSS の設定ファイルに変換した
- Figma のレイヤーのリンクを取得して Claude Code に渡すことで、Figma MCP サーバーを使用してコンポーネントやページの実装をした
- ページ全体を一度に実装しようとするとコンテキストが大きくなりすぎてしまうため、適切にレイヤーを分割して実装することが重要である

## 参考

- [Figma MCP Server | Developer Docs](https://developers.figma.com/docs/figma-mcp-server/)
- [Figma MCPサーバーのガイド – Figma Learn - ヘルプセンター](https://help.figma.com/hc/ja/articles/32132100833559-Figma-MCP%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC%E3%81%AE%E3%82%AC%E3%82%A4%E3%83%89)
- [figma/mcp-server-guide: A guide on how to use the Figma MCP server](https://github.com/figma/mcp-server-guide/tree/main)
- [Storybook公式MCPの解説とその先 - Design Systems with Agentsの提案について -](https://zenn.dev/cybozu_frontend/articles/e17267112d7816)
