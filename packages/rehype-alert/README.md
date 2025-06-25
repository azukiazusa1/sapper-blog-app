# rehype-alert

[rehype](https://github.com/rehypejs/rehype) plugin to transform alert syntax into styled `<div>` elements.

## Installation

```bash
npm install rehype-alert
```

## Usage

This package is a [rehype](https://github.com/rehypejs/rehype) plugin. It can be used with `unified` and `remark-rehype` to process Markdown files.

```javascript
import { unified } from "unified";
import markdown from "remark-parse";
import remark2rehype from "remark-rehype";
import rehypeAlert from "rehype-alert";
import html from "rehype-stringify";

const processor = unified()
  .use(markdown)
  .use(remark2rehype)
  .use(rehypeAlert)
  .use(html);
```

## Supported Syntax

This plugin supports two types of syntax for creating alerts:

### Block Syntax

Use `:::` blocks for multi-line alerts.

**Note**

```markdown
:::note
This is a note.
:::
```

**Alert**

```markdown
:::alert
This is an alert.
:::
```

**Tip**

```markdown
:::tip
This is a tip.
:::
```

**Warning**

```markdown
:::warning
This is a warning.
:::
```

### Inline Syntax

Use the following prefixes for single-line alerts.

- `!>` for Note
- `x>` for Alert (Error/Caution)
- `->` for Tip
- `?>` for Warning

**Example**

```markdown
!> This is a note.
x> This is an alert.
-> This is a tip.
?> This is a warning.
```
