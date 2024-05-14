# remark-alert

This is a remark plugin that adds alert messages to your markdown files.

## Usage

You can use the following syntax to add alert messages to your markdown files:

```markdown
!> This is a note message.
?> This is a warning message.
x> This is an error message.
-> This is a tip message.
```

And then use the following code to process the markdown files:

```js
const remark = require("remark");
const alert = require("remark-alert");

const processor = remark().use(alert);
```

Now, you can see the following HTML output:

```html
<div class="alert alert-note">
  <p class="alert-title"><svg class="alert-icon">...</svg>Note</p>
  <p></p>
  <p class="alert-content">This is a note message.</p>
</div>

<div class="alert alert-warning">
  <p class="alert-title"><svg class="alert-icon">...</svg>Warning</p>
  <p></p>
  <p class="alert-content">This is a warning message.</p>
</div>

<div class="alert alert-error">
  <p class="alert-title"><svg class="alert-icon">...</svg>Error</p>
  <p></p>
  <p class="alert-content">This is an error message.</p>
</div>

<div class="alert alert-tip">
  <p class="alert-title"><svg class="alert-icon">...</svg>Tip</p>
  <p></p>
  <p class="alert-content">This is a tip message.</p>
</div>
```
