# Project Overview

## Purpose
This is azukiazusa's personal blog application (https://azukiazusa.dev) built as a Turborepo monorepo using npm workspaces. The blog is deployed to Cloudflare Pages and uses Contentful as a CMS for managing blog posts and content.

## Tech Stack
- **Framework**: SvelteKit 2.x with Svelte 5 runes
- **Deployment**: Cloudflare Pages with SPA fallback
- **Content Management**: Contentful CMS with GraphQL
- **Styling**: TailwindCSS 4.x
- **Build System**: Turborepo with npm workspaces
- **Testing**: Vitest (unit tests), Playwright (E2E tests)
- **Development Tools**: Storybook for component development
- **Content Processing**: Unified ecosystem with custom remark/rehype plugins

## Project Structure
- `app/` - Main SvelteKit application
- `contents/` - Blog post markdown files and content
- `packages/` - Shared packages including custom remark/rehype plugins and ESLint configs
  - `remark-link-card/` - Custom plugin for link cards
  - `remark-video/` - Custom plugin for video embeds
  - `remark-contentful-image/` - Custom plugin for Contentful images
  - `rehype-alert/` - Custom plugin for alerts
  - `eslint-config-custom/` - Shared ESLint configuration
  - `content-management/` - Content management utilities

## Architecture
- **Repository Pattern**: Uses dependency injection via `RepositoryFactory.ts`
- **Environment-aware**: Production uses real implementations (GitHub API, Google Analytics), Development/Preview uses mock implementations
- **Content Pipeline**: Unified markdown processing pipeline in `markdownToHtml.ts`
- **Static Generation**: Prerendering enabled with SvelteKit