# rehype-alert

A [rehype](https://github.com/rehypejs/rehype) plugin that transforms markdown text into styled alert components with icons.

## Features

- 🎨 Multiple alert types with distinct styling
- 🔄 Support for both legacy and modern syntax
- 📱 Responsive design with Heroicons
- 🧪 Fully tested with TypeScript support
- ⚡ Zero runtime dependencies

## Installation

```bash
npm install rehype-alert
```

## Usage

```javascript
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeAlert from 'rehype-alert';

const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeAlert)
  .use(rehypeStringify);

const result = await processor.process(`
:::note
This is a note with the new syntax
:::

!> This is a note with legacy syntax
`);

console.log(result.toString());
```

## Syntax

### Modern Syntax (Recommended)

Use fenced blocks with `:::type` syntax:

```markdown
:::note
This is a note alert
:::

:::alert
This is a caution alert
:::

:::tip
This is a tip alert
:::

:::warning
This is a warning alert
:::
```

### Legacy Syntax

Single-line alerts with prefix syntax:

```markdown
!> This is a note
x> This is a caution/error
-> This is a tip
?> This is a warning
b> feature-id (baseline status)
```

## Alert Types

| Type | Modern Syntax | Legacy Syntax | Icon | Description |
|------|---------------|---------------|------|-------------|
| Note | `:::note` | `!>` | ℹ️ | Informational content |
| Alert/Caution | `:::alert` | `x>` | ⚠️ | Important warnings |
| Tip | `:::tip` | `->` | 📖 | Helpful suggestions |
| Warning | `:::warning` | `?>` | ⚠️ | Critical warnings |
| Baseline Status | N/A | `b>` | N/A | Browser feature status |

## Generated HTML

Both syntaxes generate consistent HTML structure:

```html
<div class="alert alert-note">
  <p class="alert-title">
    <svg class="alert-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="..."/>
    </svg>
    <text>Note</text>
  </p>
  <div class="alert-content">
    <p>Your alert content here</p>
  </div>
</div>
```

## CSS Classes

The plugin generates the following CSS classes that you can style:

- `.alert` - Base alert container
- `.alert-note` - Note-specific styling
- `.alert-error` - Error/caution-specific styling  
- `.alert-tip` - Tip-specific styling
- `.alert-warning` - Warning-specific styling
- `.alert-title` - Alert title container
- `.alert-icon` - SVG icon
- `.alert-content` - Alert content container

## Example CSS

```css
.alert {
  border-radius: 0.375rem;
  padding: 1rem;
  margin: 1rem 0;
  border-left: 4px solid;
}

.alert-note {
  background-color: #eff6ff;
  border-color: #3b82f6;
  color: #1e40af;
}

.alert-error {
  background-color: #fef2f2;
  border-color: #ef4444;
  color: #dc2626;
}

.alert-tip {
  background-color: #f0fdf4;
  border-color: #22c55e;
  color: #16a34a;
}

.alert-warning {
  background-color: #fffbeb;
  border-color: #f59e0b;
  color: #d97706;
}

.alert-title {
  display: flex;
  align-items: center;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.alert-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
}

.alert-content p {
  margin: 0;
}
```

## Advanced Features

### Multi-line Content

The modern syntax supports multi-line content:

```markdown
:::tip
This is the first line of the tip.

This is the second paragraph with **bold** and *italic* text.
:::
```

### Markdown Support

Content inside alerts supports full markdown formatting:

```markdown
:::note
You can use **bold**, *italic*, `code`, and [links](https://example.com).
:::
```

## API

### `rehypeAlert()`

The plugin function that can be used with unified/rehype processor.

**Returns:** `Plugin` - A rehype plugin function

## TypeScript

This package includes TypeScript definitions and is written in TypeScript.

```typescript
import rehypeAlert from 'rehype-alert';
// Full type support available
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for your changes
5. Ensure tests pass (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Type checking
npm run typecheck

# Linting
npm run lint

# Build
npm run build
```

## License

MIT

## Changelog

### v1.0.0
- Added support for modern `:::type` syntax
- Maintained backward compatibility with legacy syntax
- Unified HTML output structure
- Added comprehensive TypeScript support
- Improved code organization and reduced duplication

---

Made with ❤️ for better markdown authoring experience.