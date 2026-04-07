---
id: 1accil6j4zOilN2EE3GDW
title: "Using Figma MCP to Provide a Design System and Have AI Coding Agents Write Consistent Frontend Code"
slug: "using-figma-mcp-to-provide-design-system-for-ai-coding-agents"
about: "This article introduces how to use Figma MCP to provide design context and design tokens when AI coding agents generate frontend code, so they can follow consistent design guidelines."
createdAt: "2026-01-03T10:27:00+09:00"
updatedAt: "2026-01-03T10:27:00+09:00"
tags: ["AI", "figma", "MCP", "claude-code"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4l94jJLmBwLhEVfbEUhHKl/53bc961ff90a64b588ba7c788b77e641/koucha_tea_5898-768x656.png"
  title: "紅茶のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Which of the following correctly describes the role of the `get_variable_defs` tool introduced in the article?"
      answers:
        - text: "It retrieves design tokens from a Figma file in the form of CSS variables"
          correct: true
          explanation: "The article explains that by looking at the response from the `get_variable_defs` tool, you can confirm that design tokens are retrieved in the form of CSS variables."
        - text: "It captures screenshots of a Figma file"
          correct: false
          explanation: "Capturing screenshots is the role of the `get_screenshot` tool."
        - text: "It retrieves the design context of a Figma file"
          correct: false
          explanation: "Retrieving design context is the role of the `get_design_context` tool."
        - text: "It retrieves variant information for Figma components"
          correct: false
          explanation: "Variant information is retrieved by the `get_design_context` tool."
published: true
---
One of the challenges when having AI coding agents write frontend code is providing them with accurate design context. If you ask them to write frontend code without much guidance, they tend to overuse purple color schemes and gradients, or repeatedly choose fonts like Inter and Roboto. This is likely because popular UI frameworks such as Tailwind UI use Indigo as a default color, and those patterns appear frequently in model training data.

While AI now enables almost anyone to produce frontend code at a reasonable level, there is also a growing concern that the resulting designs become overly uniform and formulaic. To move beyond that, precise human direction and design skill are becoming more important than ever. The resources below are helpful for understanding this issue in more detail.

- [The AI Purple Problem - YouTube](https://www.youtube.com/watch?v=AG_791Y-vs4)
- [Improving frontend design through Skills | Claude](https://claude.com/blog/improving-frontend-design-through-skills)

In particular, getting AI to write code based on a design system or style guide is attracting a lot of attention. By providing information such as colors, typography, and spacing as design tokens, you can make AI follow consistent design guidelines. One way to provide those design guidelines to AI is to use Figma MCP. Figma MCP allows you to provide design data from Figma to an AI coding agent. In addition, using Storybook MCP lets the agent reference components in Storybook, reuse existing components, and create a feedback loop through component-level testing.

In this article, I will show how to do frontend development using Figma MCP and Storybook MCP.

## Provide Design Context with Figma MCP

The [Figma MCP server](https://developers.figma.com/docs/figma-mcp-server/) is a tool that helps developers implement designs quickly and accurately by giving AI agents important context from Figma Design, FigJam, and Make files when generating code. With the Figma MCP server, you can do the following:

- Access specific design elements in a Figma file using node IDs
- Retrieve design context such as layout, typography, colors, and component structure
- Capture visual references by taking screenshots
- Download assets such as images and icons

There are two ways to connect to the Figma MCP server:

- Remote server: connect to Figma's hosted endpoint, available on all seats and plans
- Desktop server: host it locally using the Figma desktop application, available on paid Dev or full seats

Here I will explain how to use Figma MCP with a Next.js + Tailwind CSS project via the remote server and Claude Code. As the design data, I used [Simple Design System](https://www.figma.com/community/file/1380235722331273046/simple-design-system), which is published in Figma Community.

### Set Up the Figma MCP Server

To use Figma MCP with Claude Code, run the following command. This installs the Figma MCP server at the project level.

```bash
claude mcp add --transport http figma https://mcp.figma.com/mcp -s project
```

If the MCP server is added successfully, a `.mcp.json` file will be created with the following contents:

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

Launch Claude Code and run the `/mcp` command to make sure the Figma MCP server appears in the list.

```bash
/mcp
```

![](https://images.ctfassets.net/in6v9lxmm5c8/2AUqwlU5FDzvzGAD2tLMbZ/df0f0e97a82bcaf11fe6969d20ac2324/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-03_11.12.57.png)

You can see the message "needs authentication · Enter to login," which means the server cannot be used until authentication is complete. Select `figma`, press Enter, and choose `1. Authenticate`. This opens the Figma authentication page in your browser.

![](https://images.ctfassets.net/in6v9lxmm5c8/23yYtTTnZ8GoWxwSwWHQ05/655e5f6a58614ef87763e6ead66bb9f9/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-03_11.15.06.png)

If everything looks fine, click the button to grant consent and complete authentication. Once authentication succeeds, you should see the message "Authentication successful. Connected to figma."

To help Claude Code use the Figma MCP server more effectively, it is also worth adding the official [Skills](https://code.claude.com/docs/ja/skills) provided by Figma. Skills are modules that give AI agents specialized knowledge or capabilities. The Skill for the Figma MCP server provides Markdown guidelines on how to use the Figma MCP server effectively.

https://github.com/figma/mcp-server-guide/blob/main/skills/implement-design/SKILL.md

Because Figma Skills are distributed as [plugins](https://code.claude.com/docs/ja/plugins), you can install them by launching Claude Code and running the `/plugin` command.

```bash
/plugin
```

Type `figma` into the search form and select the `Figma` plugin. Since this plugin is provided through the `claude-plugins-official` marketplace, it should already appear in the list. If it does not, make sure the `claude-plugins-official` marketplace is enabled in the `Marketplaces` tab.

![](https://images.ctfassets.net/in6v9lxmm5c8/2RqiiIUse7L762ZoiEoq21/9197da2cd73b941753325aa21e517069/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-03_11.07.21.png)

Choose `Install for all collaborators on this repository (project scope)` to finish the installation.

![](https://images.ctfassets.net/in6v9lxmm5c8/10f97jylKDD6L0opvSf8hp/1c74c1f466bbcba085f6f9aaccfabb22/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-03_11.09.15.png)

After restarting Claude Code, you can confirm on the `Installed` tab that the `Figma` plugin is present. The three Skills `code-connect-components`, `create-design-system-rules`, and `implement-design` should have been installed automatically.

![](https://images.ctfassets.net/in6v9lxmm5c8/6wmFhp2zznw8o2AIZRn4b2/596ec54bfc70de5c46693c00f3b8c219/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-03_11.10.30.png)

### Retrieve Design Tokens with Figma MCP

Now let's actually use Figma MCP to generate code. First, we will use the Figma MCP server to extract design tokens from a Figma file and convert them into a Tailwind CSS configuration.

Get the link to the `Color` layer in the Figma file, then include that link in your prompt to Claude Code. To copy the layer link, open the Figma file, select the `Color` layer, right-click, and choose `Copy/Paste as` > `Copy link to selection`.

![](https://images.ctfassets.net/in6v9lxmm5c8/7itPFtxxyc6AYs6gAfjtsC/59b4f062608feea3c140b4b28a8037bc/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-03_11.49.28.png)

Here is an example prompt:

```
Here is a link to the Color layer in the Figma design file:
  https://www.figma.com/design/02mZfULtR6WitQ5tNv3qQm/Simple-Design-System--Community-?node-id=226-13679&t=ya00BKdw48mU98Hn-4

  Extract the color, typography, and spacing design tokens from this page and convert them into
  Tailwind CSS v4 design tokens using the CSS-first configuration format. Write the design tokens
  in the `globals.css` file.
```

You can see that the Figma MCP server called the `get_screenshot`, `get_variable_defs`, and `get_design_context` tools to retrieve the design context of the `Color` layer.

![](https://images.ctfassets.net/in6v9lxmm5c8/483jSKtkDFObYjEkISZxUo/98c455f4e7bf8cf1afe09c72c49b1de8/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-03_11.51.42.png)

If you look at the response from `get_variable_defs`, you can see that the design tokens are returned in the form of CSS variables.

![](https://images.ctfassets.net/in6v9lxmm5c8/NFFi0McgOvgUnuWjItuvG/3903964de6f382788cbb418dd32617c5/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-03_11.52.54.png)

Using the response from `get_variable_defs`, I was able to have it convert those values into Tailwind CSS v4 format and write the design tokens into `globals.css`.

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

  /* Omitted... */
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

  /* Omitted... */
}
```

### Create Components with Storybook MCP

Next, let's have the components provided in the Figma design implemented as Storybook stories. If you want an AI agent to implement Storybook code, the [Storybook MCP Addon](https://github.com/storybookjs/mcp) is especially useful. With the Storybook MCP Addon, the AI agent can implement stories following Storybook best practices, reuse existing components, and establish a feedback loop through component-level testing.

To install the Storybook MCP Addon, run the following command:

```bash
npm install @storybook/addon-mcp
```

Then enable the Storybook MCP Addon in your Storybook config file. Open `.storybook/main.ts` and update it like this:

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

Start Storybook. You can see that `http://localhost:6006/mcp` has been added as the MCP server endpoint.

```bash
npm run storybook
```

![](https://images.ctfassets.net/in6v9lxmm5c8/5lW2DZAf3eSU2hR3aReeng/3a89f5bf9cda3c43b29c8ff44c869d6a/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-03_12.50.09.png)

After that, just like when adding a normal MCP server, run the following command in Claude Code to add the Storybook MCP server at the project level:

```bash
claude mcp add --transport http storybook http://localhost:6006/mcp -s project
```

Get the link to the `Button` component in the Figma design file and include it in your prompt to Claude Code. Here is an example prompt:

```text
Here is a link to the Button component in the Figma design file:
https://www.figma.com/design/02mZfULtR6WitQ5tNv3qQm/Simple-Design-System--Community-?node-id=4185-3778&t=jxNNSXWAjoYWC19h-4

Please implement this design as a Storybook v10 Button component and story.

- Implement the component in `/components/Button/Button.tsx`
- Implement the story in `/components/Button.stories.tsx` (place it in the same directory as the component)
- Utility classes defined with Tailwind CSS v4 CSS-first configuration are available
- Use the storybook MCP `get-ui-building-instructions` tool and follow best practices
```

You can see that the component was implemented after retrieving the Figma design context and understanding the variants of the `Button` component.

```sh
I was able to retrieve the Figma design. The Button component has three variants: Primary, Neutral, and Subtle; three states: Default, Hover, and Disabled; and two sizes: Medium and Small.
```

The generated `Button` component and story looked like this:

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

The benefits of Storybook MCP are a little subtle, but compared with not using MCP, you can see that it uses the `fn()` helper from `storybook/test` and that the story metadata is more complete. You can also use the `get-story-urls` tool to understand which component corresponds to which Storybook URL. Once you have many stories, it becomes hard to keep track of that mapping, so this is a quietly useful feature.

![](https://images.ctfassets.net/in6v9lxmm5c8/4YUI3Rf3kAjkaooEiFsHuM/bbb486114190e8aab521df7097d650f1/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-03_13.18.56.png)

When you compare the actual Figma design with the component in Storybook, you can see that the implementation reproduces the design quite faithfully.

![](https://images.ctfassets.net/in6v9lxmm5c8/4ykHSE8bJfhSw9khdehZqZ/da655fa93905418e18eb56ae5301d3d3/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-03_13.20.24.png)

### Build a Page

Finally, let's have it implement an entire page based on a Figma design. The components needed for the page should be implemented in Storybook beforehand. If you try to implement the whole page at once, the task becomes too complex, so the key is to break it down into the components that make up the page. It is even more effective if the Figma design is also split up into components.

> To achieve faster and more reliable results, break the screen down into smaller parts, such as components or logical chunks. If the selection is too large, tools may become slow, produce errors, or return incomplete responses, especially when the model has too much context to process.

https://developers.figma.com/docs/figma-mcp-server/avoid-large-frames/

I had the following components implemented from the Figma design in the same way as the `Button` component:

- `Header` component
- `Footer` component
- `Card` component
- `Avatar` component

Get the link to the `Examples/About Page` frame in the Figma design file and include it in your prompt to Claude Code.

```text
Implement the home page for the `/about` path based on `Examples/About Page` in the Figma design file.

  https://www.figma.com/design/02mZfULtR6WitQ5tNv3qQm/Simple-Design-System--Community-?node-id=562-9044&t=jxNNSXW
  AjoYWC19h-4

  - Reuse the components in the `components/` directory
```

If you try to retrieve the layers for the whole page at once, the response from `get_design_context` often becomes too large and causes errors.

```sh
⏺ I’ll inspect the contents of the Figma design.

⏺ Read(~/.claude/projects/-Users-asai-sandbox-figma-mcp-example/ed0448aa-ee42-4430-a6c6-87e68bf71e9b/tool-results/m
      cp-figma-get_design_context-1767420751342.txt)
  ⎿  Error: File content (34202 tokens) exceeds maximum allowed tokens (25000). Please use offset and limit
     parameters to read specific portions of the file, or use the GrepTool to search for specific content.
```

In cases like this, it is better to split the implementation into the component-level sections that make up the page. For example, the `Examples/About Page` frame is divided into six sections: `Header`, `Hero Basic`, `Panel Image Double`, `Card Grid Content List`, `Card Grid Image`, and `Footer`. Splitting the work by those sections makes it easier for the agent to understand the context accurately. This is also something worth keeping in mind when creating designs in Figma. If layers are separated appropriately, they become easier not only for AI agents to work with, but also for humans to understand and implement.

![](https://images.ctfassets.net/in6v9lxmm5c8/1FJzBqgXjlmiyRk3pCH2KX/ba8b6d48853d740f33a037c684147db3/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-03_15.21.45.png)

Once again, create prompts after splitting the page into sections.

```text
Implement Header and Footer as a shared layout in app/layout.tsx
```

```text
Implement the Hero section of the /about page based on Hero Basic in Examples/About Page from the Figma design file.

https://www.figma.com/design/02mZfULtR6WitQ5tNv3qQm/Simple-Design-System--Community-?node-id=175-4836&t=jxNNSXWAjoYWC19h-4

- Reuse the components in the `components/` directory
- Implement it in the `app/about/HeroBasic.tsx` component, then import and use it from `app/about/page.tsx`
```

The final result looks like this. Even when compared with the Figma design, the implementation reproduces it with high fidelity.

![](https://images.ctfassets.net/in6v9lxmm5c8/643g938h9wjwWLyE8pxpsD/364fe6697090e063f90209b6eff87f10/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-03_15.59.02.png)

After actually using the Figma MCP server to go all the way from building a design system to implementing pages, my impression was that, when used properly, it can dramatically improve the efficiency of the design-to-code process. At the same time, it also reinforces how important it is to structure the design in Figma itself according to best practices.

In particular, if you try to implement an entire page at once, the context becomes too large, so you need to split layers appropriately. Also, if layers and components do not have the right names, the AI agent cannot tell which components it should use during implementation.

It is also important to design your system by taking advantage of Figma's powerful features such as Auto Layout, Variants, and Variables. Without Auto Layout, it becomes difficult to generate responsive code. Without Variants, it becomes harder to understand component variations accurately. In the age of AI, code implementation itself can be automated to some extent, so the design stage is likely where the biggest differences will emerge. To generate high-quality code more quickly, I think it will become increasingly important to invest in design work in Figma and to maintain design guidelines properly.

## Summary

- This article introduced how to combine the Figma MCP server with Claude Code to extract design tokens from Figma designs, implement components, and build pages.
- The Figma MCP server can be connected either through a remote server or a desktop server.
- When using the remote server approach, you need to authenticate with your Figma account after adding the MCP server.
- The `get_variable_defs` tool was used to extract design tokens from a Figma file and convert them into a Tailwind CSS configuration.
- By copying links to Figma layers and passing them to Claude Code, it was possible to implement components and pages using the Figma MCP server.
- Since implementing an entire page at once can make the context too large, it is important to split the design into appropriate layers and implement it in smaller parts.

## References

- [Figma MCP Server | Developer Docs](https://developers.figma.com/docs/figma-mcp-server/)
- [Guide to the Figma MCP Server – Figma Learn Help Center](https://help.figma.com/hc/ja/articles/32132100833559-Figma-MCP%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC%E3%81%AE%E3%82%AC%E3%82%A4%E3%83%89)
- [figma/mcp-server-guide: A guide on how to use the Figma MCP server](https://github.com/figma/mcp-server-guide/tree/main)
- [An Explanation of Storybook's Official MCP and Beyond: Proposing Design Systems with Agents](https://zenn.dev/cybozu_frontend/articles/e17267112d7816)
