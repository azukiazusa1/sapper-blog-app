---
id: wDKRjOsVMyygjHOuEnVfE
title: "Storybook MCP を試してみた"
slug: "storybook-mcp"
about: "Storybook MCP は Storybook と AI エージェントを接続し、エージェントがコンポーネントドキュメントを参照しつつコードを生成したり、ストーリーを作成して UI コンポーネントをテストしたりできるようにする機能です。この記事では、Storybook MCP を実際に試してみた内容を紹介します。"
createdAt: "2026-03-25T19:52+09:00"
updatedAt: "2026-03-25T19:52+09:00"
tags: ["storybook", "MCP", "AI"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3WIohHZlckIUcjEZXUuVfq/2daf2a87d8ef17fc6f01242402d16963/datemaki_16498-768x591.png"
  title: "伊達巻のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Storybook MCP を使用するために必要なアドオンはどれか？"
      answers:
        - text: "@storybook/addon-mcp"
          correct: true
          explanation: "@storybook/addon-mcp をインストールして .storybook/main.ts に追加することで、Storybook MCP が利用可能になります"
        - text: "@storybook/addon-ai"
          correct: false
          explanation: null
        - text: "@storybook/addon-agent"
          correct: false
          explanation: null
        - text: "@storybook/addon-llm"
          correct: false
          explanation: null
    - question: "Storybook MCP で、コンポーネントの詳細ドキュメント（props、使用例、ストーリー）を取得するためのツールはどれか？"
      answers:
        - text: "list-all-documentation"
          correct: false
          explanation: "list-all-documentation は利用可能なコンポーネント・ドキュメントの ID 一覧を取得するツールです"
        - text: "get-documentation"
          correct: true
          explanation: "get-documentation は ID を指定してコンポーネントの詳細ドキュメント（props、使用例、ストーリー）を取得するツールです"
        - text: "preview-stories"
          correct: false
          explanation: "preview-stories はコンポーネントやストーリーの変更後にプレビュー URL を返すツールです"
        - text: "run-story-tests"
          correct: false
          explanation: "run-story-tests はストーリーのテストを実行するツールです"
published: true
---
AI エージェントに UI の生成を任せる際、せっかく用意した UI コンポーネントを使ってもらえず、デザインシステムと一貫しない UI が生成されてしまうことがあります。また UI のインタラクションテストを実行する環境が整っていないと、人間が実際に試してみて初めて問題に気づき、AI にフィードバックを送るという非効率なやり取りが発生しがちです。Storybook MCP はこうした課題を解決するために、エージェントが Storybook のドキュメントを直接参照しながらコードを生成し、ストーリーのテストまで自律的に実行できる仕組みを提供します。

この記事では、Storybook MCP を実際に試してみた内容を紹介します。

:::note
Storybook MCP は 2026 年 3 月 25 日現在、React 向けの Storybook でのみ利用可能な機能です。
:::

## Storybook MCP のセットアップ

Storybook MCP を使用するには [`@storybook/addon-mcp`](https://storybook.js.org/addons/@storybook/addon-mcp) アドオンが必要です。以下のコマンドでインストールします。

```bash
npm install @storybook/addon-mcp
```

`.storybook/main.ts` ファイルを開いて、`@storybook/addon-mcp` をアドオンに追加します。

```diff:.storybook/main.ts
  export default {
    "stories": [
      "../src/**/*.stories.mdx",
      "../src/**/*.stories.@(js|jsx|ts|tsx)"
    ],
    "addons": [
     "@chromatic-com/storybook",
     "@storybook/addon-vitest",
     "@storybook/addon-a11y",
-    "@storybook/addon-docs"
+    "@storybook/addon-docs",
+    "@storybook/addon-mcp"
   ],
   "framework": "@storybook/react-vite"
 };
```

`@storybook/addon-mcp` を追加したら、Storybook を起動します。

```bash
npm run storybook
```

http://localhost:6006/mcp エンドポイントが利用可能になっていることを確認してください。

![](https://images.ctfassets.net/in6v9lxmm5c8/2mhH8oK2SEItDk5NZaLzFJ/14ab130ba8cf0434a9e18af8458118f9/image.png)

AI エージェントに http トランスポート形式で MCP サーバーを接続します。コーディングエージェントの種類に応じて MCP サーバーの接続方法は異なりますが、ここでは Claude Code を例に説明します。以下のコマンドでプロジェクト単位で MCP サーバーを Claude Code に接続します。Chromatic などに Storybook をデプロイしている場合は、デプロイ先の URL を指定できます。

```bash
claude mcp add --transport http storybook http://localhost:6006/mcp --scope project
```

プロジェクトのルートディレクトリに `.mcp.json` ファイルが作成され、MCP サーバーの接続情報が保存されます。

```json:.mcp.json
{
  "mcpServers": {
    "storybook": {
      "type": "http",
      "url": "http://localhost:6006/mcp"
    }
  }
}
```

Storybook を起動したまま Claude Code を起動し、`/mcp` コマンドを使用して Storybook が接続されていることを確認します。

![](https://images.ctfassets.net/in6v9lxmm5c8/5vh36mLPJkG7fQpocHJ2Oa/b36df5e744a97e739d46172df7ff1180/image.png)

Storybook MCP は以下の 6 つのツールを提供しています。

- `list-all-documentation`: 利用可能なコンポーネント・ドキュメントの ID 一覧を取得する。`withStoryIds: true` を指定するとストーリー ID も取得できる
- `get-documentation`: ID を指定してコンポーネントの詳細ドキュメント（props、使用例、ストーリー）を取得する
- `get-documentation-for-story`: 特定のストーリーバリアントの追加ドキュメントを取得する
- `get-storybook-story-instructions`: ストーリーの作成・更新・テスト修正に関する包括的なガイドラインを取得する。ストーリーファイルを操作する前に呼び出すことで、正しいパターンやインポートパスに従える
- `preview-stories`: コンポーネントやストーリーの変更後にプレビュー URL を返す。変更のたびに呼び出し、結果 URL をユーザーに提示する
- `run-story-tests`: ストーリーのテストを実行する。失敗があれば修正してから完了報告する

「ドキュメント化されたすべてのコンポーネントを一覧表示」といったプロンプトを Claude Code に投げてみて、実際に Storybook MCP が動作していることを確認してみましょう。`list-all-documentation` ツールを使用してコンポーネントの一覧を取得してくれていることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/6Urs7cgidGHpVlMpmOPNN0/75715b683b0efe8b3ea0f4901fe248c3/image.png)

必要に応じて `AGENTS.md` や `CLAUDE.md` などのエージェント向けのドキュメントにツールの使用方法を記載しておくと、エージェントがツールを正しく使用するのに役立ちます。

```markdown:AGENTS.md
When working on UI components, always use the `your-project-sb-mcp` MCP tools to access Storybook's component and documentation knowledge before answering or taking any action.

- **CRITICAL: Never hallucinate component properties!** Before using ANY property on a component from a design system (including common-sounding ones like `shadow`, etc.), you MUST use the MCP tools to check if the property is actually documented for that component.
- Query `list-all-documentation` to get a list of all components
- Query `get-documentation` for that component to see all available properties and examples
- Only use properties that are explicitly documented or shown in example stories
- If a property isn't documented, do not assume properties based on naming conventions or common patterns from other libraries. Check back with the user in these cases.
- Use the `get-storybook-story-instructions` tool to fetch the latest instructions for creating or updating stories. This will ensure you follow current conventions and recommendations.
- Check your work by running `run-story-tests`.

Remember: A story name might not reflect the property name correctly, so always verify properties through documentation or example stories before using them.
```

次は具体的なユースケースとして、Storybook MCP を使用してみます。

## 既存の UI コンポーネントを再利用して UI を生成する

Storybook MCP を使用すると、UI コンポーネントのドキュメントを参照しながらコードを生成できます。「ログインフォームを作成してみて」といったプロンプトを渡して UI を生成してもらいましょう。

実装計画を立てるために `list-all-documentation` ツールや `get-documentation` ツールを使用して、ログインフォームに必要なコンポーネント（テキストフィールド、ボタンなど）のドキュメントを参照していることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/22LvcsinoaIDylfwQkQIog/68b5005a1fafafc4e7fc1f608aae2f06/image.png)

`get-documentation` ツールでは `<Button>` コンポーネントのドキュメントや Story のバリアント（Primary、Secondary、Disabled）、Props 仕様などを確認しています。[Best practices for using Storybook with AI](https://storybook.js.org/docs/ai/best-practices) でも記載されているように、コンポーネントがどの目的でなぜ使用されるのか（Primary はフォーム送信などのメインアクションで使用する、Danger は削除・リセット操作で使用するなど）についてドキュメント化されていることが重要です。Props の各属性はどのように使用するのかも含め、どれだけ詳細にコンポーネントがドキュメント化されているかに AI エージェントが生成するコードの品質が大きく依存することでしょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/5QZpyEBMWXIO1WmsKWU6VC/b097a60553ae3306a05f93af1423f716/image.png)

![](https://images.ctfassets.net/in6v9lxmm5c8/3L9xZG0mLsIvVo6iWSHsOo/0579a29d7cd213c47e61c6596d14eaed/image.png)

コンポーネントの仕様をあらかじめ詳細に確認していることもあり、計画時点でどの Props を使用するかも明確に指定してくれています。

![](https://images.ctfassets.net/in6v9lxmm5c8/16DDTKIEllYbWdP3x9AITR/b8246be0bc473c31989821fc6551a07a/image.png)

上記で参照したコンポーネントを使用して `LoginForm` コンポーネントとその Story を生成し、インタラクションテストの計画も含めて提案してくれています。

![](https://images.ctfassets.net/in6v9lxmm5c8/7MSsf0ybLyo0uBABetgI5L/90f03bc02d408bdbc6ed37e9bba2f23c/image.png)

![](https://images.ctfassets.net/in6v9lxmm5c8/1z7HxRys570UC3XUIFfKfz/cb808e0f196eb8edaa79902db4f53567/image.png)

UI の実装が完了すると `run-story-tests` ツールを使用して Story のインタラクションテストを実行し、テストが失敗したので自律的に修正して再度テストを実行していることがわかります。カラーコントラスト比のようにアクセシビリティの問題もしっかり検知してくれていますね。

![](https://images.ctfassets.net/in6v9lxmm5c8/1mQNRzr9ScMWEvEdQTsGUI/ce3a14c5689d92c6ccb0d52c9cf5a6f6/image.png)

すべてのテストが成功した後 `preview-stories` ツールを使用して Storybook 上のプレビュー画面の URL を返してくれています。生成されたコードが Storybook 上でどのように表示されているかも確認してみましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/74p6wlhiTFExKEdwdTEV8i/930e09586bbf8b5fcbd2af156434e6ee/image.png)

![](https://images.ctfassets.net/in6v9lxmm5c8/2JtbaX0pIdyjNcAQkSBXot/5677331b45e499a9574b3215edc381d4/image.png)

VSCode の Copilot Agent のように [MCP Apps](https://blog.modelcontextprotocol.io/posts/2025-11-21-mcp-apps/) に対応しているエージェントであれば、その場で生成された Story をプレビューできるようです。

![](https://images.ctfassets.net/in6v9lxmm5c8/1iAaQ4c0ZEvo8P2FitNl1Y/d0ee0067c3d7538d17f43398e4eeeee1/image.png)

実際に生成されたコードは以下のようになりました。Story の Variant ごとのドキュメントをもう少し書いておいてもらいたいところですが、主要なテストケースはしっかりカバーできていることがわかります。

```tsx:LoginForm.stories.tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { LoginForm } from "./LoginForm";

const meta: Meta<typeof LoginForm> = {
  component: LoginForm,
  title: "Components/LoginForm",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof LoginForm>;

export const Default: Story = {
  name: "Default",
  args: {
    onSubmit: fn(),
  },
};

export const Loading: Story = {
  name: "Loading",
  args: {
    isLoading: true,
    onSubmit: fn(),
  },
};

export const WithError: Story = {
  name: "With Error",
  args: {
    error: "メールアドレスまたはパスワードが正しくありません",
    onSubmit: fn(),
  },
};

export const SuccessfulSubmit: Story = {
  name: "Successful Submit",
  args: {
    onSubmit: fn(),
  },
  play: async ({ canvas, args }) => {
    await userEvent.type(
      canvas.getByLabelText("メールアドレス"),
      "user@example.com",
    );
    await userEvent.type(canvas.getByLabelText("パスワード"), "password123");
    await userEvent.click(canvas.getByRole("button", { name: "ログイン" }));
    await expect(args.onSubmit).toHaveBeenCalledWith(
      "user@example.com",
      "password123",
    );
  },
};

export const ValidationError: Story = {
  name: "Validation Error",
  args: {
    onSubmit: fn(),
  },
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole("button", { name: "ログイン" }));
    await expect(
      canvas.getByText("メールアドレスを入力してください"),
    ).toBeVisible();
    await expect(
      canvas.getByText("パスワードを入力してください"),
    ).toBeVisible();
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};
```

## まとめ

- Storybook MCP を使用すると、Storybook と AI エージェントを接続し、エージェントがコンポーネントドキュメントを参照しつつコードを生成したり、ストーリーを作成して UI コンポーネントをテストしたりできるようになる
- `@storybook/addon-mcp` アドオンをインストールして Storybook MCP をセットアップする。Storybook を起動すると `http://localhost:6006/mcp` エンドポイントが利用可能になる
- AI エージェントに http トランスポート形式で MCP サーバーを接続する
- Storybook MCP は `list-all-documentation`、`get-documentation`、`get-documentation-for-story`、`get-storybook-story-instructions`、`preview-stories`、`run-story-tests` の 6 つのツールを提供している
- Storybook MCP を使用して、コンポーネントのドキュメントを参照しながらコードを生成したり、ストーリーを作成して UI コンポーネントをテストしたりできる
- 生成されたコードの品質は、UI をどれだけ詳細にドキュメント化しているかに大きく依存する。コンポーネントの目的や使用方法、Props の仕様などを詳細にドキュメント化しておくことが重要

## 参考

- [Storybook MCP for React](https://storybook.js.org/blog/storybook-mcp-for-react/)
- [MCP server | Storybook docs](https://storybook.js.org/docs/ai/mcp/overview)
- [Best practices for using Storybook with AI | Storybook docs](https://storybook.js.org/docs/ai/best-practices)
