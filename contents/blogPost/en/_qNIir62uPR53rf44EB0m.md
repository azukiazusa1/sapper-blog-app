---
id: _qNIir62uPR53rf44EB0m
title: "Decorating CSS Grid Layout gaps with `column-rule` and `row-rule`"
slug: "css-grid-gap-decoration"
about: "CSS Gap Decorations let you draw lines between rows and columns in flexbox and grid layouts with `column-rule` and `row-rule`, avoiding border, background, and pseudo-element workarounds."
createdAt: "2026-05-08T20:34+09:00"
updatedAt: "2026-05-08T20:34+09:00"
tags: ["css"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4M8U2MzWbXPSm546ch1Am/e59afed7052907ffd32bf643e27ae694/tempura_omusubi_18424-768x768.png"
  title: "天むすのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Which explanation of `rule-break` matches the article?"
      answers:
        - text: "It is a property that increases or decreases the gap width itself, and its default value is `none`."
          correct: false
          explanation: "`rule-break` is not a property for changing the gap width. The article explains it as a property that controls whether decoration lines break at intersections."
        - text: "It controls whether row decorations break at intersections, and with the default value `normal`, lines break at T-shaped intersections."
          correct: true
          explanation: "The article explains that the default value of `rule-break` is `normal`; with T-shaped intersections, the line breaks, while with cross intersections, it does not."
        - text: "It switches the line color at each intersection, and `intersection` alternates between red and blue."
          correct: false
          explanation: "Color patterns are covered in the explanation of `rule-color` and `repeat()`. `intersection` is introduced as a value that adjusts overlaps at intersections."
        - text: "It cannot be used with flexbox and applies only to CSS Multi-column Layout."
          correct: false
          explanation: "The article explains CSS Gap Decorations as a proposal that extends the formerly multicol-only `column-rule` concept so it can also apply to flexbox and grid."

published: true
---

Decorations such as "drawing a line between columns" are needed in many grid layout use cases. CSS has [`column-rule-width`](https://developer.mozilla.org/ja/docs/Web/CSS/Reference/Properties/column-rule-width), [`column-rule-style`](https://developer.mozilla.org/ja/docs/Web/CSS/Reference/Properties/column-rule-style), and [`column-rule-color`](https://developer.mozilla.org/ja/docs/Web/CSS/Reference/Properties/column-rule-color) as properties for drawing separators between columns, but these were defined in the CSS Multi-column Layout Module and did not apply to flexbox or grid.

There has long been demand for drawing lines between columns in flexbox and grid, but there was no direct way to do it. As a result, developers have used workarounds such as adding borders only to specific columns, using background colors to make gaps look like lines, or drawing lines with `::before` pseudo-elements.

```css
/* Method 1: Use border-right / border-bottom on each item, then remove them from the last column and row */
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
  /* Fill the cells with a background color */
  background-color: white;
}
```

However, these workarounds are not intuitive. They require extra code purely for visual presentation, which also goes against the principle of semantic HTML. The border-based approach also has a maintainability problem: when the column width changes, the line position changes too, so you need to keep adjusting selectors such as `nth-child`.

To solve this kind of problem, a proposal was made to allow the existing `column-rule` property, which had been limited to multicol, to apply to flexbox and grid as well. A complementary `row-rule` property was also added for drawing lines between rows. By using these properties, you can draw lines between columns and rows in flexbox and grid more easily.

b> gap-decorations

!> CSS Gap Decorations are still experimental. In Chrome and Edge 139, they are available as a Developer Trial, and you need to enable Experimental Web Platform Features from `chrome://flags` or `edge://flags` to use them.

This article explains `column-rule` and `row-rule`, which decorate gaps in CSS Grid Layout.

## How to use `column-rule` and `row-rule`

The code for drawing lines between columns with `column-rule` and `row-rule` is very simple. For a flexbox or grid container, reserve spacing with `gap`, then decorate it with `column-rule` / `row-rule`.

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

## Drawing complex line patterns with `repeat()` values

The `rule-color` property specifies the color of gap decorations. Because it can be combined with the `repeat()` function, you can also define complex color patterns. In the following example, the lines between columns alternate between red and blue.

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

The `rule-width` property can also be combined with the `repeat()` function. For a Sudoku-like grid, for example, you can easily make some of the lines between columns thicker so that the sections are easier to distinguish.

```css
.sudoku {
  --cell: 48px;

  display: grid;
  grid-template-columns: repeat(9, var(--cell));
  grid-template-rows: repeat(9, var(--cell));
  gap: 8px;
  padding: 8px;
  width: max-content;

  /* Draw a thicker line every 3 columns */
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

## Breaking lines at intersections with `rule-break`

`rule-break` is a property that controls whether row decorations break at intersections. The default value is `normal`; lines break at T-shaped intersections, while cross intersections remain unbroken.

A spreadsheet-like tabular layout is a good way to understand this. When there is a heading that spans multiple columns, like a merged cell, a T-shaped intersection occurs. With `rule-break: normal`, you can see that the line between the columns spanned by the merged cell is interrupted.

![](https://images.ctfassets.net/in6v9lxmm5c8/36ivGxgUcPVTFlQZ1rYa3v/86fb4d7e59ed076a9e4d054da822e07d/image.png)

<iframe height="300" style="width: 100%;" scrolling="no" title="sheet" src="https://codepen.io/azukiazusa1/embed/NPbxeYE?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/NPbxeYE">
  sheet</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

In addition to `normal`, `rule-break` has the following values.

- `none`: Ignores all intersections and always draws the line from end to end
- `intersection`: Adjusts overlaps at intersections

When you set `rule-break` to `intersection`, table-like layouts get a more natural appearance where lines do not overlap at intersections.

![](https://images.ctfassets.net/in6v9lxmm5c8/4o5SBHzqtsKeAQztDQKJbz/8fad5cbc8a61b9394d905de5e1b640d6/image.png)

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/myOVaYL?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/myOVaYL">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Summary

- To solve the problem that drawing lines between columns in grid layouts required workarounds, `column-rule` became applicable to flexbox and grid, and `row-rule` was added for drawing lines between rows
- With `column-rule` and `row-rule`, you can draw lines between columns and rows in a simple way
- By using `repeat()` in the value, you can also draw complex line patterns
- With the `rule-break` property, you can specify whether lines break at intersections. The default value is `normal`, where T-shaped intersections break the line and cross intersections do not. Setting it to `intersection` creates a natural table-like appearance where lines do not overlap at intersections

## References

- [CSS Gaps Module Level 1](https://drafts.csswg.org/css-gaps-1/)
- [Proposal: CSS Gap Decorations Level 1 · Issue #10393 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/10393)
- [MSEdgeExplainers/CSSGapDecorations/explainer.md at main · MicrosoftEdge/MSEdgeExplainers](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/CSSGapDecorations/explainer.md)
- [A new way to style gaps in CSS | Blog | Chrome for Developers](https://developer.chrome.com/blog/gap-decorations)
- [The Gap Strikes Back: Now Stylable | CSS-Tricks](https://css-tricks.com/the-gap-strikes-back-now-stylable/)
