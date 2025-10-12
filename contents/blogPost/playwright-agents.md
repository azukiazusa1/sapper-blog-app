---
id: Q76odKP5wENlgpEjBSsD8
title: "Playwright Agents によるテストの自動生成を試してみた"
slug: "playwright-agents"
about: "Playwright v1.56 で導入された Playwright Agents は、Planner、Generator、Healer の 3 つのエージェントで構成されており、アプリケーションコードを解析してテストケースの計画、テストコードの生成、失敗したテストの修正を自動化できます。この記事では、Claude Code から Playwright Agents を呼び出して、シンプルなカンバンアプリのテストコードを自動生成する手順を紹介します。"
createdAt: "2025-10-12T11:39+09:00"
updatedAt: "2025-10-12T11:39+09:00"
tags: ["playwright", "claude-code", "MCP"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/41JUiCkrDUUGIfPkFl8dMW/3b0467ea99d187d07b242ea761891c32/fruit-babaco_22705-768x591.png"
  title: "ババコのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Playwright Agents を構成する 3 つのエージェントのうち、存在しないものはどれですか？"
      answers:
        - text: "Analyzer"
          correct: true
          explanation: "Playwright Agents は Planner、Generator、Healer の 3 つのエージェントで構成されています。Analyzer は存在しません。"
        - text: "Planner"
          correct: false
          explanation: null
        - text: "Generator"
          correct: false
          explanation: null
        - text: "Healer"
          correct: false
          explanation: null
    - question: "Claude Code で Playwright Agents をセットアップする際に実行するコマンドはどれですか？"
      answers:
        - text: "npx playwright init-agents --loop=claude"
          correct: true
          explanation: "このコマンドで Claude Code 用の Playwright Agents の定義ファイルと MCP 設定が生成されます。--loop オプションで使用する AI エージェントの種類を指定します。"
        - text: "npx playwright install-agents --ai=claude"
          correct: false
          explanation: null
        - text: "npm install @playwright/agents"
          correct: false
          explanation: null
        - text: "npx create-playwright-agents"
          correct: false
          explanation: null
published: true
---
Playwright v1.56 ではアプリのコードを解析し、テストコードを自動生成する 3 つのエージェントが導入されました。以下の 3 つのエージェントは順番に実行されることが想定されていますが、それぞれこれ単体で利用できます。

- Planner: アプリのコードを解析し、テストケースの計画を Markdown 形式で生成する
- Generator: Planner が生成したテストケースの計画をもとに、Playwright のテストコードを生成する
- Healer: テストを実行し、失敗した場合にテストコードを修正する

これらのエージェントは VS Code や Claude Code といった任意の AI エージェントから呼び出すことができます。この記事では、Playwright のエージェントを Claude Code から呼び出して、Next.js で作成したシンプルなカンバンアプリのテストコードを自動生成する手順を紹介します。

テスト対象のアプリケーションのコードは以下のレポジトリを参照してください。

https://github.com/azukiazusa1/vibe-kanban-app

## Playwright Agents のセットアップ

Playwright Agents は Playwright v1.56 以降で利用可能です。以下のコマンドで Playwright のエージェントの定義を追加します。`--loop` オプションは使用している AI エージェントの種類に応じて変更してください。

```bash
npx playwright init-agents --loop=claude
```

コマンドを実行すると以下のファイルが生成されます。

- `.claude/agents/playwright-test-generator.md`: Claude Code の [SubAgents](https://docs.claude.com/ja/docs/claude-code/sub-agents) として Playwright Generator エージェントを定義
- `.claude/agents/playwright-test-healer.md`
- `.claude/agents/playwright-test-planner.md`
- `.mcp.json`: Claude Code におけるプロジェクト単位の MCP 設定ファイル。[playwright-test](https://github.com/microsoft/playwright-mcp) MCP サーバーが設定されている
- `seed.spec.ts`: アプリを操作するために必要な環境を設定するファイル。初めは空の状態

```typescript:tests/seed.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Test group', () => {
  test('seed', async ({ page }) => {
    // generate code here.
  });
});
```

## テストシナリオを計画する

セットアップが完了したら Claude Code を起動してテストシナリオを作成してもらいましょう。できる限り明確なユーザーストーリーを提供することで、より適切なテストシナリオが生成されます。カンバンボードの作成、タスクの追加、タスクの移動、タスクの完了といった一連の操作をするシナリオを以下のようなプロンプトで提供します。

`@agent-playwright-test-planner` を使用して明示的に Planner エージェントを呼び出します。

```text
@agent-playwright-test-planner
カンバンボードアプリの基本的な機能をテストするためのテストケースを計画してください。以下のユーザーストーリーに基づいて、主要な機能を網羅するテストケースをいくつか提案してください。

1. ユーザーはトップページにアクセスして、新しいカンバンボードを作成できる。
2. ユーザーは作成したカンバンボードのページに移動できる。
3. ユーザーはカンバンボード上で新しいタスクを追加できる。
4. ユーザーはタスクをドラッグアンドドロップで別のカラムに移動できる。
```

`playwright-test-planner` サブエージェントを呼び出し、テストケースの計画を作成している様子が確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5H51aLuCoXhFRZoOHCvMkL/f85101c13e25129f822d0ef8a1be810c/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-10-12_12.20.32.png)

成果物として `TEST_PLAN.md` ファイルが生成されます。以下は生成されたテストケースの計画の一部です。

```markdown
# Kanban Board Application - Comprehensive Test Plan

## Application Overview

The Kanban Board Application is a Next.js 15-based task management system built with React 19, TypeScript, and PostgreSQL. The application provides comprehensive project management capabilities through an intuitive kanban-style interface.

...

## Test Scenarios

### 1. Board Creation and Management

**Seed:** `tests/seed.spec.ts` (default seed)

#### 1.1 Create New Board with Valid Data

**Objective:** Verify that users can successfully create a new board with complete information

**Steps:**

1. Navigate to `http://localhost:3000`
2. Verify the homepage displays with header "Kanban Board"
3. Verify the page title shows "マイボード" (My Boards)
4. Click the "新規ボード作成" (New Board Creation) button with Plus icon
5. Verify the dialog opens with title "新規ボード作成"
6. Locate the "タイトル \*" (Title) input field (id: "title")
7. Type "Project Alpha" in the title field
8. Locate the "説明" (Description) textarea field (id: "description")
9. Type "Main project board for tracking development tasks" in the description field
10. Click the "作成" (Create) button

...
```

ボードの作成時に特殊文字を入力した際のハンドリングや、プロンプトでは指定しなかったタスクの優先度の設定のテストなど、アプリケーションコードを元により詳細なテストケースが生成されていることがわかります。

## テストコードを生成する

続いて、`@agent-playwright-test-generator` を使用して Generator エージェントを呼び出し、テストコードを生成します。`TEST_PLAN.md` ファイルを参照して、テストコードを生成するように指示します。

```text
@agent-playwright-test-generator
### 1. Board Creation and Management のテストコードを生成してください。
```

`playwright-test` MCP の `Setup generator page` ツールを使用してテストコードの生成が開始されます。最終的に以下のようなテストケースが作成されました。

![](https://images.ctfassets.net/in6v9lxmm5c8/6P6HjhcQpOzzwN4eLBaJFu/ae68a902bfcfcc233974752e463c2fb5/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-10-12_12.39.42.png)

生成されたテストコードの一部を以下に示します。

```typescript:tests/board-creation.spec.ts
import { test, expect } from "@playwright/test";
import { resetDatabase, disconnectDatabase } from "./helpers/db-reset";

test.describe("Board Creation and Management", () => {
  // 各テストの前にデータベースをリセット
  test.beforeEach(async ({ page }) => {
    await resetDatabase();
    await page.goto("/");
  });

  test.afterAll(async () => {
    await disconnectDatabase();
  });

  test("TC-BC-001: タイトルと説明を含む有効なボード作成", async ({ page }) => {
    // 1. トップページに移動（beforeEachで実行済み）

    // 2. "新規ボード作成" ボタンをクリック
    await page.getByRole("button", { name: "新規ボード作成" }).click();

    // 3. タイトルに "プロジェクトA" と入力
    await page.getByLabel("タイトル *").fill("プロジェクトA");

    // 4. 説明に "これは最初のカンバンボードです" と入力
    await page.getByLabel("説明").fill("これは最初のカンバンボードです");

    // 5. "作成" ボタンをクリック
    await page.getByRole("button", { name: "作成" }).click();

    // 6. ボード詳細ページにリダイレクトされることを確認
    await expect(page).toHaveURL(/\/boards\/[a-zA-Z0-9-]+/);

    // トップページに戻る
    await page.goto("/");

    // 7. ボードがグリッドに表示されることを確認
    await expect(
      page.getByRole("heading", { name: "プロジェクトA" }),
    ).toBeVisible();

    // 8. 説明が表示されることを確認
    await expect(
      page.getByText("これは最初のカンバンボードです"),
    ).toBeVisible();
  });

  // 他のテストケースも同様に生成される...
});
```

以下のコマンドを実行して、生成されたテストコードを実行してみましょう。

```bash
npx playwright test tests/board-creation-management.spec.ts
```

テストを実行した結果、いくつかのテストケースが失敗しているようです。

```bash
Running 9 tests using 1 worker
  1) [chromium] › tests/board-creation-management.spec.ts:15:7 › Board Creation and Management › TC-BC-001: タイトルと説明を含む有効なボード作成

    Error: expect(locator).toBeVisible() failed

    Locator: getByRole('heading', { name: 'プロジェクトA' })
    Expected: visible
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
      - Expect "toBeVisible" with timeout 5000ms
      - waiting for getByRole('heading', { name: 'プロジェクトA' })


      37 |     await expect(
      38 |       page.getByRole("heading", { name: "プロジェクトA" }),
    > 39 |     ).toBeVisible();
         |       ^
      40 |
      41 |     // 8. 説明が表示されることを確認
      42 |     await expect(
        at /kanban-app/tests/board-creation-management.spec.ts:39:7
```

## 失敗したテストを修正する

失敗したテストを修正するには、`@agent-playwright-test-healer` を使用して Healer エージェントを呼び出します。失敗したテストケースの修正を依頼するプロンプトを以下のように作成します。

```text
@agent-playwright-test-healer
TC-BC-001: タイトルと説明を含む有効なボード作成 のテストが失敗するので、修正してください。
```

Playwright MCP を使用して、実際にテストを実行し、テストのエラー内容を確認している様子が確認できます。以下のように問題の解決策を導き出し、コードを修正しました。

```text
⏺ テスト TC-BC-001 の修正が完了しました！

  修正内容

  主な問題と解決策

  1. CardTitle コンポーネントの HTML 要素の修正

  - ファイル: components/ui/card.tsx:21
  - 問題: CardTitle コンポーネントが <div> 要素でレンダリングされており、テストが getByRole("heading")
  で見出しを探せなかった
  - 修正: <div> を <h3> に変更してセマンティックな HTML とアクセシビリティを改善

  2. Next.js キャッシュによる問題の解決

  - ファイル: tests/board-creation-management.spec.ts:56-83
  - 問題: ボード作成後にホームページに戻った際、Next.js App Router
  がキャッシュされたページを表示し、新しく作成されたボードが即座に表示されなかった
  - 修正: await page.goto("/") の後に await page.reload() を追加して、キャッシュをバイパス
```

## まとめ

- Playwright v1.56 で導入された Playwright Agents は、Planner、Generator、Healer の 3 つのエージェントで構成されており、アプリケーションコードを解析してテストケースの計画、テストコードの生成、失敗したテストの修正を自動化できる
- VS Code や Claude Code などの任意の AI エージェントから Playwright Agents を呼び出して利用できる
- Claude Code では SubAgents として Playwright Agents を定義し、MCP サーバーとして playwright-test MCP を設定することで、テストコードの自動生成が可能になる
- Planner エージェントはアプリケーションコードを解析し、テストケースの計画を Markdown 形式で生成する
- Generator エージェントは Planner が生成したテストケースをもとに、実際のテストコードを生成する
- Healer エージェントは失敗したテストを分析し、修正案を提案する

## 参考

- [Agents | Playwright](https://playwright.dev/docs/test-agents)
