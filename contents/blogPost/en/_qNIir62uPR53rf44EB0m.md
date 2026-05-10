---
id: _qNIir62uPR53rf44EB0m
title: "Decorating CSS Grid Layout Gaps with `column-rule` and `row-rule`"
slug: "css-grid-gap-decoration"
about: "CSS Gap Decorations introduces `column-rule` and `row-rule` properties that work with flexbox and grid, enabling decorative lines between columns and rows — no more border or background-color workarounds."
createdAt: "2026-05-08T20:34+09:00"
updatedAt: "2026-05-08T20:34+09:00"
tags: ["css"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4M8U2MzWbXPSm546ch1Am/e59afed7052907ffd32bf643e27ae694/tempura_omusubi_18424-768x768.png"
  title: "天むすのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Which of the following best describes `rule-break` based on the article?"
      answers:
        - text: "A property that increases or decreases the gap width itself, with a default of `none`"
          correct: false
          explanation: "`rule-break` is not a property that changes gap width, but one that controls whether decoration lines break at intersections."
        - text: "Specifies whether row decorations break at intersections; with the default `normal`, lines break at T-intersections"
          correct: true
          explanation: "The article explains that `rule-break` defaults to `normal`, where lines break at T-intersections but continue through cross-intersections."
        - text: "A property that switches line colors at each intersection, where `intersection` alternates between red and blue"
          correct: false
          explanation: "Color pattern specification is covered in the `rule-color` and `repeat()` section. `intersection` is introduced as a value that adjusts rendering at cross-intersection points."
        - text: "Not applicable to flexbox, only works with CSS Multi-column Layout"
          correct: false
          explanation: "The entire article describes CSS Gap Decorations as a proposal to extend the formerly multicol-only `column-rule` to flexbox and grid as well."

published: true
---

Decorating grid layouts with dividing lines between columns is a common requirement. CSS has the [`column-rule`](https://developer.mozilla.org/ja/docs/Web/CSS/Reference/Properties/column-rule) property for drawing dividing lines between columns, but it is exclusive to [multi-column layout](https://developer.mozilla.org/ja/docs/Learn_web_development/Core/CSS_layout/Multiple-column_Layout) (multicol) and does not apply to flexbox or grid.

Despite widespread demand for drawing lines between columns in flexbox or grid layouts, no dedicated CSS mechanism existed. Developers resorted to workarounds such as applying borders to specific items, using background colors to simulate dividers, or using `::before` pseudo-elements to draw lines.

```css
/* Method 1: Add border-right / border-bottom to each item, then remove them from the last column/row */
.card {
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}
.card:nth-child(3n) {
  border-right: none;
}
.card:nth-last-child(-n + 3) {
  border-bottom: none;
}
```

```css
/* Method 2: Fill the gap with a background color */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background-color: #ccc;
}

.card {
  /* Fill each cell with a background color */
  background-color: white;
}
```

However, these workarounds are unintuitive and require extra code solely for visual presentation, which conflicts with the principle of semantic HTML. The border approach also has a maintainability problem: when column widths change, the line positions shift as well, requiring `nth-child` selectors to be updated every time.

To solve these issues, a proposal was made to extend the existing `column-rule` (formerly limited to multicol) to flexbox and grid layouts, while adding a complementary `row-rule` property for drawing lines between rows. With these properties, it becomes easy to draw lines between columns and rows in flexbox or grid.

b> gap-decorations

!> CSS Gap Decorations is currently an experimental feature. It is available as a Developer Trial in Chrome and Edge 139. To use it, enable **Experimental Web Platform Features** at `chrome://flags/#enable-experimental-web-platform-features` (or `edge://flags/#enable-experimental-web-platform-features` for Edge).

This article explains how to use `column-rule` and `row-rule` to decorate gaps in CSS Grid Layout.

## Using `column-rule` and `row-rule`

The code for drawing lines between columns using `column-rule` and `row-rule` is very simple. Add `gap` to a flexbox or grid container for spacing, then apply `column-rule` / `row-rule` for decoration.

`column-rule` is a shorthand for three sub-properties: `column-rule-width` (line thickness), `column-rule-style` (line style), and `column-rule-color` (line color). Similarly, `row-rule` is a shorthand for `row-rule-width`, `row-rule-style`, and `row-rule-color`.

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  column-rule: 1px solid #ccc;
  row-rule: 1px solid #ccc;
}
```

![](https://images.ctfassets.net/in6v9lxmm5c8/6DDupw2vxKdRLfwrHtqSm0/75790b812fbc9415156ed86f13862fd3/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-05-08_20.59.57.png)

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/wBoMQQq?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/wBoMQQq">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

It also works with flexbox. Even when combined with `display: flex` and `flex-wrap: wrap`, `column-rule` and `row-rule` apply decorations to the gaps.

```css
.flex {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  column-rule: 1px solid #ccc;
  row-rule: 1px solid #ccc;
}
```

![](https://images.ctfassets.net/in6v9lxmm5c8/2Fbw6zOXvhT9BNtSBlfv7I/803c6e2f588e56158f1fcac4dae270ca/image.png)

<iframe height="300" style="width: 100%;" scrolling="no" title="column-decorations" src="https://codepen.io/azukiazusa1/embed/XJNdzjE?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/XJNdzjE">
  column-decorations</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Drawing Complex Patterns with `repeat()`

The `rule-color` property specifies the color of gap decorations. It can be combined with the `repeat()` function to define complex color patterns. The following example alternates the column rule color between red and blue.

```css
.grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
  column-rule-width: 4px;
  column-rule-style: solid;

  /* Alternate between red and blue */
  column-rule-color: repeat(auto, red, blue);
}
```

![](https://images.ctfassets.net/in6v9lxmm5c8/46AAoZ7uQVRNfVqenCrOdg/6734c4f01cc81c1e3637fdf4af0218db/image.png)

<iframe height="300" style="width: 100%;" scrolling="no" title="rule-color" src="https://codepen.io/azukiazusa1/embed/pvNgGvv?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/pvNgGvv">
  rule-color</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

The `rule-width` property can also be combined with `repeat()`. This makes it easy to draw thicker lines every three columns in a sudoku-like grid to clearly delineate sections.

```css
.sudoku {
  --cell: 48px;

  display: grid;
  grid-template-columns: repeat(9, var(--cell));
  grid-template-rows: repeat(9, var(--cell));
  gap: 8px;
  padding: 8px;
  width: max-content;

  /* Draw thicker lines every 3 columns */
  column-rule:
    repeat(2, 1px solid #bbb),
    4px solid #111,
    repeat(2, 1px solid #bbb),
    4px solid #111,
    repeat(2, 1px solid #bbb);

  row-rule:
    repeat(2, 1px solid #bbb),
    4px solid #111,
    repeat(2, 1px solid #bbb),
    4px solid #111,
    repeat(2, 1px solid #bbb);
}
```

![](https://images.ctfassets.net/in6v9lxmm5c8/5MBJM86I6XHCzhEaDKxymt/7b2a2f723414bb705fee891d3194213d/image.png)

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/NPbxoxZ?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/NPbxoxZ">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Controlling How Lines Break at Intersections with `rule-break`

`rule-break` is a property that specifies whether decoration lines break at intersections. The default is `normal`, where lines break at T-intersections but continue through cross-intersections.

Think of a spreadsheet-style table layout. When a cell spans multiple columns, a T-intersection occurs. With `rule-break: normal`, you can see that the line between the merged columns is interrupted.

![](https://images.ctfassets.net/in6v9lxmm5c8/36ivGxgUcPVTFlQZ1rYa3v/86fb4d7e59ed076a9e4d054da822e07d/image.png)

<iframe height="300" style="width: 100%;" scrolling="no" title="sheet" src="https://codepen.io/azukiazusa1/embed/NPbxeYE?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/NPbxeYE">
  sheet</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

The other values for `rule-break` are:

- `none`: Ignores cell span and always draws lines from end to end of the gap. Lines pass through even when cells are merged.
- `intersection`: Adjusts rendering at cross-intersection points where `column-rule` and `row-rule` meet, so they do not overlap. Produces a clean finish at grid intersections.

In the cell-span example above, setting `rule-break: none` causes the line between merged columns to be drawn without interruption.

![](https://images.ctfassets.net/in6v9lxmm5c8/5gCrS8xyC7bPZrQUdMgvjA/807cfff046e78055c56462041de6ea65/image.png)

The difference between `rule-break: intersection` and `rule-break: normal` shows up at cross-intersection points. With `normal`, `column-rule` and `row-rule` are drawn overlapping each other, whereas with `intersection`, the rendering at the intersection is adjusted so the lines appear as a uniform grid. For table-like layouts where rows and columns are equally important, `intersection` is the better choice.

![](https://images.ctfassets.net/in6v9lxmm5c8/4o5SBHzqtsKeAQztDQKJbz/8fad5cbc8a61b9394d905de5e1b640d6/image.png)

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/myOVaYL?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/myOVaYL">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Summary

- To address the problem of needing workarounds to draw lines between columns in grid layouts, `column-rule` can now be applied to flexbox and grid, and a new `row-rule` property has been added for drawing lines between rows
- Using `column-rule` and `row-rule`, you can easily draw lines between columns and rows
- Using `repeat()` in value specifications allows you to create complex line patterns
- The `rule-break` property controls whether lines break at intersections. The default is `normal`, where lines break at T-intersections but continue through cross-intersections. Setting it to `intersection` produces a natural look in table-like layouts where lines do not overlap at intersection points

## References

- [CSS Gaps Module Level 1](https://drafts.csswg.org/css-gaps-1/)
- [Proposal: CSS Gap Decorations Level 1 · Issue #10393 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/10393)
- [MSEdgeExplainers/CSSGapDecorations/explainer.md at main · MicrosoftEdge/MSEdgeExplainers](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/CSSGapDecorations/explainer.md)
- [A new way to style gaps in CSS | Blog | Chrome for Developers](https://developer.chrome.com/blog/gap-decorations)
- [The Gap Strikes Back: Now Stylable | CSS-Tricks](https://css-tricks.com/the-gap-strikes-back-now-stylable/)
