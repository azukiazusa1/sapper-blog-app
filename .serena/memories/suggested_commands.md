# Suggested Commands

## Development Commands

### Setup
```bash
npm i                           # Install dependencies
npm run dev                     # Start development server
```

### Main Application (from root)
```bash
npm run dev                     # Start development server (all workspaces)
npm run build                   # Build all packages
npm run lint                    # Lint all packages
npm run typecheck               # Type check all packages  
npm run format                  # Format code in all packages
npm run test                    # Run unit tests
npm run new:article             # Create new blog article
```

### App-specific Commands (from app/ directory)
```bash
npm run dev                     # Start SvelteKit dev server
npm run mock                    # Start dev server with mock data (NODE_MOCK=true)
npm run build                   # Build for production
npm run preview                 # Preview production build
npm run serve                   # Serve built application
npm run test:e2e                # Run E2E tests with Playwright
npm run test:e2e:update         # Update E2E test snapshots
npm run storybook               # Start Storybook dev server
npm run gen                     # Generate GraphQL types from schema
```

## System Commands (Darwin/macOS)
- `ls` - List directory contents
- `find` - Find files and directories
- `grep` - Search text patterns
- `git` - Version control
- `cd` - Change directory
- `cat` - Display file contents
- `head`, `tail` - Display file parts