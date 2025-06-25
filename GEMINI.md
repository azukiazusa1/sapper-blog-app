# GEMINI.md

このドキュメントは、AI開発アシスタント（Geminiなど）がこのプロジェクトを理解し、効果的に貢献するためのガイドです。

## プロジェクト概要

このプロジェクトは、[azukiazusa.dev](https://azukiazusa.dev) で公開されている個人のブログサイトです。SvelteKitをベースに構築されており、Turborepoとnpm workspacesを利用したモノレポ構成を採用しています。ブログ記事はMarkdown形式で管理されています。

## プロジェクト構造

モノレポは、アプリケーション、ブログコンテンツ、および複数の共有パッケージで構成されています。

- `app`: メインのSvelteKitアプリケーションです。UIコンポーネント、ルーティング、およびブログのフロントエンドロジックが含まれています。
- `contents`: ブログ記事のMarkdownファイルが格納されています。
- `packages`: アプリケーション全体で共有される再利用可能なパッケージです。
    - `content-management`: ContentfulとローカルのMarkdownファイルを同期するためのスクリプトです。
    - `rehype-alert`: Markdownのアラート構文をHTMLに変換するrehypeプラグインです。
    - `remark-link-card`: URLをリッチなリンクカードに変換するremarkプラグインです。
    - `remark-contentful-image`: Contentfulの画像を最適化するremarkプラグインです。
    - `eslint-config-custom`: 共有のESLint設定です。
    - `tsconfig`: 共有のTypeScript設定です。

## 主要技術スタック

- **フレームワーク**: [SvelteKit](https://kit.svelte.dev/)
- **UI**: [Tailwind CSS](https://tailwindcss.com/)
- **言語**: [TypeScript](https://www.typescriptlang.org/)
- **ビルドツール**: [Vite](https://vitejs.dev/)
- **モノレポ管理**: [Turborepo](https://turbo.build/), [npm workspaces](https://docs.npmjs.com/cli/v9/using-npm/workspaces)
- **テスト**: [Playwright](https://playwright.dev/) (E2E), [Vitest](https://vitest.dev/) (ユニット)
- **コンポーネント開発**: [Storybook](https://storybook.js.org/)
- **静的サイトジェネレーター**: [Pagefind](https://pagefind.app/)
- **リンティング/フォーマット**: [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)

## 開発コマンド

### セットアップ

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

### ビルド

```bash
npm run build
```

### リンティングと型チェック

```bash
npm run lint
npm run typecheck
```

### テスト

```bash
# 全てのテストを実行
npm run test

# E2Eテストのみ実行
npm run test:e2e -w=app
```
