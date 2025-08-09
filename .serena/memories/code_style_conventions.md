# Code Style and Conventions

## Formatting and Linting
- **Prettier**: Used for code formatting with plugins:
  - `@prettier/plugin-oxc` - High-performance formatter
  - `prettier-plugin-svelte` - Svelte file formatting
  - `prettier-plugin-tailwindcss` - TailwindCSS class sorting
- **ESLint**: TypeScript ESLint with Svelte plugin
- **Configuration**: Shared ESLint config via `eslint-config-custom` package

## Language/Framework Conventions
- **TypeScript**: Strict type checking enabled
- **Svelte 5**: Uses new runes API
- **File Extensions**: `.ts` for TypeScript, `.svelte` for components
- **Import Style**: ESM imports throughout

## Project Patterns
- **Repository Pattern**: All data access through repository interfaces with dependency injection
- **Environment Switching**: Mock vs real implementations based on `CF_ENV` and `NODE_MOCK` variables
- **Component Stories**: Storybook stories for all UI components
- **Testing**: Unit tests with Vitest, E2E tests with Playwright

## Directory Structure
- Components in `src/components/` with co-located `.stories.ts` files
- Repositories in `src/repositories/` with interface/implementation separation
- Shared utilities in `src/lib/`
- Route handlers follow SvelteKit conventions in `src/routes/`

## Naming Conventions
- PascalCase for components and classes
- camelCase for functions and variables
- kebab-case for file names and routes
- Interface names end with "Interface" (e.g., `PostRepositoryInterface`)