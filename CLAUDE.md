# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a Turborepo monorepo using npm workspaces for azukiazusa's blog (https://azukiazusa.dev):

- `app/` - Main SvelteKit application deployed to Cloudflare Pages
- `contents/` - Blog post markdown files and content
- `packages/` - Shared packages including custom remark/rehype plugins and ESLint configs

## Development Commands

### Setup
```bash
npm i
npm run dev
```

### Build and Validation
```bash
npm run build
npm run lint
npm run typecheck
```

### Testing
```bash
npm run test                    # Unit tests (vitest)
npm run test:e2e -w=app        # E2E tests (playwright)
```

### Content Management
```bash
npm run new:article             # Create new blog article
```

## Architecture Overview

### Repository Pattern
The app uses a repository pattern with dependency injection via `RepositoryFactory.ts`. Repositories are environment-aware:
- Production: Real implementations (GitHub API, Google Analytics)
- Development/Preview: Mock implementations

### Content Processing Pipeline
Markdown content is processed through a unified pipeline in `markdownToHtml.ts`:
1. Custom remark plugins (link cards, video embeds, Contentful images)
2. Standard plugins (GFM, syntax highlighting)
3. Rehype plugins (alerts, TOC generation, auto-linking)

### SvelteKit Configuration
- Uses Cloudflare Pages adapter with SPA fallback
- Static site generation with prerendering enabled
- Custom rehype/remark plugins built as workspace packages

### Key Dependencies
- SvelteKit 2.x with Svelte 5 runes
- TailwindCSS 4.x for styling
- Storybook for component development
- GraphQL with code generation for CMS integration
- Unified ecosystem for markdown processing

### Environment Variables
- `CF_ENV=production` switches between real and mock repositories
- `NODE_MOCK=true` enables mock mode in development

## Turbo Pipeline
Dependencies are managed via turbo.json - the app's typecheck depends on building custom remark/rehype packages first.