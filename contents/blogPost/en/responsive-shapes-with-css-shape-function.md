---
id: d-JdUjEty7czv5hrakgpj
title: "Building Responsive Shapes with the CSS shape() Function"
slug: "responsive-shapes-with-css-shape-function"
about: "Shapes built with clip-path's path() are hard to make responsive because its coordinates are fixed pixels. shape() defines curves with percentages, CSS units, and custom properties. This article builds a resizable speech bubble and a motion path."
createdAt: "2026-08-29T19:12+09:00"
updatedAt: "2026-08-29T19:12+09:00"
tags: ["CSS"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3ChGpc9iTszV7sstYi199/b4feb7a7447466f88aebee90c4fb4834/grand-piano_19497.png"
  title: "グランドピアノのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Which of the following describes `shape()` compared with `path()`, as explained in this article?"
      answers:
        - text: "It takes an SVG path string as-is and implicitly treats every coordinate as `px`"
          correct: false
          explanation: "That describes `path()`, which the article covers separately. `shape()` writes its drawing commands in CSS syntax."
        - text: "It uses percentages, CSS units, and math functions to generate a path based on the reference box"
          correct: true
          explanation: "The article explains that `shape()` can use `%`, CSS units, `calc()`, and custom properties."
        - text: "It can only draw straight lines, so any curve requires referencing an SVG file"
          correct: false
          explanation: "`shape()` can describe curves with commands such as `curve`, `smooth`, and `arc`."
        - text: "It reshapes the element's layout box itself to match the specified outline"
          correct: false
          explanation: "`clip-path` changes only the painted area; the layout box remains rectangular."
    - question: "Which statement correctly describes the difference between `to` and `by` in `shape()` drawing commands?"
      answers:
        - text: "`to` is a position relative to the current point, while `by` is an absolute position based on the reference box"
          correct: false
          explanation: "The two are the other way around. The article explains that `to` is absolute and `by` is relative to the current point."
        - text: "`to` can only be used for curves, and `by` only for straight lines"
          correct: false
          explanation: "Commands such as `line` and `curve` accept either `to` or `by` for their end point."
        - text: "`to` is an absolute position based on the reference box, while `by` is a position relative to the current point"
          correct: true
          explanation: "As the article explains, `line to 100% 100%` is an absolute position, while `line by 20px 10px` is relative to the current point."
        - text: "There is no difference between `to` and `by`; you can pick either one for readability"
          correct: false
          explanation: "The two keywords use different origins for their coordinates, so swapping one for the other normally produces a different path."
    - question: "If you pass two control points separated by `/` to the `with` of a `curve` command, what kind of curve do you get?"
      answers:
        - text: "A quadratic Bézier curve"
          correct: false
          explanation: "The article explains that a single control point produces a quadratic Bézier curve."
        - text: "A cubic Bézier curve"
          correct: true
          explanation: "In the article's complex shape example, two control points separated by `/` create cubic Bézier curves."
        - text: "An elliptical arc"
          correct: false
          explanation: "Elliptical arcs are drawn with `arc`, not `curve`."
        - text: "A horizontal line"
          correct: false
          explanation: "Horizontal lines are drawn with `hline`, which plays a different role from `curve` and its control points."
published: true
---
b> shape-function

When you want to clip a card or an image into a shape such as a speech bubble, you can use the CSS [`clip-path`](https://www.w3.org/TR/css-masking-1/#the-clip-path) property. For example, applying `circle(50%)` to a square image clips it into a circle centered on the image.

```css
.avatar {
  inline-size: 160px;
  aspect-ratio: 1;
  object-fit: cover;
  clip-path: circle(50%);
}
```

As this shows, `clip-path` leaves the size of the element itself unchanged and simply stops anything outside the given shape from being painted. Circles and polygons can be expressed with `circle()` and `polygon()`, but complex outlines that combine rounded corners and curves used to require the `path()` function.

The coordinates inside `path()`, however, are implicitly treated as CSS pixels. That means you cannot use `%` or custom properties to make the outline follow the size of the element. Because the coordinates of the path stay the same when the element's width changes, responsive components end up with an outline that no longer matches the element.

The CSS [`shape()` function](https://drafts.csswg.org/css-shapes/#shape-function) lets you describe lines and curves much like an SVG path, but using CSS values such as `%`, `rem`, `calc()`, and custom properties. Instead of the fixed coordinates of `path()`, you get an outline that follows the size of the element. This article walks through the syntax of `shape()` and shows how to build a speech bubble that can be resized, as well as an organic shape made of several curves.

## Clipping elements with `clip-path`

`clip-path` is a property that specifies which region of an element gets painted, using a clipping path. For example, the following code clips an element into a triangle.

```css
.triangle {
  inline-size: 240px;
  block-size: 160px;
  background: #6750a4;
  clip-path: polygon(50% 0, 100% 100%, 0 100%);
}
```

<iframe height="300" style="width: 100%;" scrolling="no" title="click-path-triangle" src="https://codepen.io/azukiazusa1/embed/qErdmNV?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/qErdmNV">
  click-path-triangle</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

Because the coordinates of `polygon()` accept `%`, the three vertices stay at the top center, the bottom right, and the bottom left even when the element is resized. On the other hand, `polygon()` can only draw straight lines, so it cannot handle shapes with rounded corners or curves. For outlines with arbitrary curves, `path()` — which takes SVG path data — has been the tool of choice.

The following is a speech bubble with rounded corners and a downward tail. `M` moves to the starting point, `H` and `V` draw horizontal and vertical lines, `Q` draws a quadratic Bézier curve, `L` draws a straight line, and `Z` closes the path — all standard SVG path commands.

```css
.bubble {
  inline-size: 320px;
  block-size: 180px;
  background: #6750a4;
  clip-path: path(
    "M 20 0 H 300 Q 320 0 320 20 V 140 Q 320 160 300 160 H 190 L 170 180 L 150 160 H 20 Q 0 160 0 140 V 20 Q 0 0 20 0 Z"
  );
}
```

This path produces the intended bubble on a 320 × 180px element. Every coordinate in it is a fixed value, though, so the outline does not follow along when the element is resized.

## `path()` does not follow the size of the element

Take the bubble above and change only the width of the element to 560px. The coordinate of the right edge stays at `320`. The box of the element itself grows, but the painted outline stays locked inside its original 320px range. Make the element narrower than 320px and the opposite happens: the right side of the path spills outside the element. Since the part that spills out is never painted, the rounded corners on the right are lost and the shape ends up squared off.

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/6FIIGCvT4gAJAfPaARFSk5/c3e34549689dbba5bc5f6c4f97bf9300/13710e97-6c84-4eed-b385-9c7ff6901a67.mov" controls></video>

<iframe height="300" style="width: 100%;" scrolling="no" title="A fixed-coordinate speech bubble built with CSS path()" src="https://codepen.io/azukiazusa1/embed/ByWNRzE?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/ByWNRzE">
  A fixed-coordinate speech bubble built with CSS path()</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

The reason comes down to the value `path()` accepts. `path()` takes an [SVG path data string](https://www.w3.org/TR/SVG2/paths.html#PathData). Per the [CSS Shapes specification](https://drafts.csswg.org/css-shapes/#funcdef-basic-shape-path), the numbers inside that string are implicitly treated as `px` units. Ratios such as `50%`, or expressions such as `calc(100% - 20px)`, cannot be written at all.

The other limitation is that the whole path is a single string. You cannot drop a `var()` into the middle of that string, as shown below, to make just the corner radius configurable.

```css
/* var() is not expanded as part of the path() string */
.bubble {
  --radius: 20px;
  clip-path: path("M var(--radius) 0 ...");
}
```

`shape()` solves this by assembling the path data out of CSS syntax. The specification describes each command as being converted into a path segment at paint time. In other words, `shape()` is not a fixed path but a recipe that produces the final path from the reference box and the CSS values around it.

:::note
The CSSWG also discussed not introducing `shape()` at all, and instead adding CSS-flavored syntax to `path()`. The argument was that extending an existing function makes it easier to discover, and that it would be consistent with how CSS's `circle()` and `polygon()` relate to SVG elements. On the other hand, `shape()` generates its path in combination with the CSS environment: the reference box, custom properties, font size, and so on. Since the same declaration can yield a different path in a different environment, it plays a different role from `path()`, which stays close to SVG. In February 2025 the CSSWG resolved that [`shape()` keeps its current name and design, while a more tightly scoped CSS-flavored syntax would be considered separately for `path()`](https://www.w3.org/2025/02/12-css-minutes.html#t06).
:::

## The syntax of the `shape()` function

`shape()` takes a starting point followed by one or more drawing commands separated by commas. A simple triangle can be written like this.

```css
.triangle {
  clip-path: shape(from 50% 0, line to 100% 100%, line to 0 100%, close);
}
```

<iframe height="300" style="width: 100%;" scrolling="no" title="shape-triangle" src="https://codepen.io/azukiazusa1/embed/jEBPmrE?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/jEBPmrE">
  shape-triangle</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

`from` is the first point. The `line to` that follows draws a straight line from the current point to the given coordinate. Coordinates after `to` are absolute positions, with the origin at the top-left corner of the reference box. Using `by` instead, as in `line by 20px 10px`, makes the coordinate relative to the current point. A `%` in a coordinate resolves against the width of the reference box horizontally and its height vertically.

The main commands are as follows.

| Command           | Role                                                            |
| ----------------- | --------------------------------------------------------------- |
| `move`            | Moves to another point without drawing a line                    |
| `line`            | Draws a straight line from the current point                     |
| `hline` / `vline` | Draws a horizontal or vertical line                              |
| `curve`           | Draws a quadratic or cubic Bézier curve                          |
| `smooth`          | Draws a Bézier curve that continues smoothly from the previous one |
| `arc`             | Draws an elliptical arc                                          |
| `close`           | Closes the current subpath                                       |

With `curve`, the control points are given by a `with` that follows the end point. A single control point produces a quadratic Bézier curve; two control points separated by `/` produce a cubic Bézier curve.

```css
.quadratic {
  clip-path: shape(from 0 100%, curve to 100% 100% with 50% 0, close);
}

.cubic {
  clip-path: shape(from 0 100%, curve to 100% 100% with 25% 0 / 75% 0, close);
}
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Quadratic and cubic Bézier curves with CSS shape()" src="https://codepen.io/azukiazusa1/embed/PwpqmbL?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/PwpqmbL">
  Quadratic and cubic Bézier curves with CSS shape()</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

For the complete syntax, see [Shape Commands in the specification](https://drafts.csswg.org/css-shapes/#typedef-shape-command).

## Building a speech bubble that can be resized

Let's rebuild the speech bubble from the previous section with the `shape()` function. Where the `path()` version was stuck with fixed coordinates, the `shape()` version specifies the horizontal edges with `%` and `calc()`. The corner radius and the height of the tail stay at `20px`.

```css:styles.css
.bubble-shape {
  clip-path: shape(
    from 20px 0,
    hline to calc(100% - 20px),
    curve to 100% 20px with 100% 0,
    vline to calc(100% - 40px),
    curve to calc(100% - 20px) calc(100% - 20px)
      with 100% calc(100% - 20px),
    hline to 60%,
    line to calc(60% - 20px) 100%,
    line to calc(60% - 40px) calc(100% - 20px),
    hline to 20px,
    curve to 0 calc(100% - 40px) with 0 calc(100% - 20px),
    vline to 20px,
    curve to 20px 0 with 0 0,
    close
  );
}
```

The top-right corner and the right edge that follows it, for example, are built from these three commands.

1. `hline to calc(100% - 20px)` draws a horizontal line up to 20px short of the right edge
2. `curve to 100% 20px with 100% 0` draws a quadratic Bézier curve whose control point is the top-right corner
3. `vline to calc(100% - 40px)` draws the right edge downward

The tail of the bubble is positioned relative to `60%`. Its horizontal position follows the width of the element, while the tail itself keeps a height of 20px and a base 40px wide. Being able to pick `%` for coordinates that should follow the element and `px` for dimensions that should stay constant is exactly what makes `shape()` useful.

No matter how you change the width, the outline of the bubble follows the width of the element while the rounded corners and the tail keep their size.

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/7xv1JzNGLPStYupnS5pYQa/dd909ce31f5befed02d5d761d6f19a2d/dfda2c6b-6807-42a4-86bd-c63f0893c526.mov" controls></video>

<iframe height="300" style="width: 100%;" scrolling="no" title="A responsive speech bubble built with CSS shape()" src="https://codepen.io/azukiazusa1/embed/jEBPmVE?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/jEBPmVE">
  A responsive speech bubble built with CSS shape()</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Combining several curves into one shape

As a more complex example than the bubble, let's build an organic card out of six connected cubic Bézier curves. Rather than trying to express the entire outline with a single curve, splitting the top, right, bottom, and left sides into several curves lets you tune each bulge independently.

Here is the outline defined with `shape()`. Each `curve` has an end point and two control points, with `/` separating the two control points.

```css:styles.css
.organic-card {
  box-sizing: border-box;
  inline-size: var(--demo-width, 320px);
  block-size: 240px;
  padding: 4rem;
  color: #1d192b;
  background: #f2b8b5;
  clip-path: shape(
    from 8% 12%,
    curve to 45% 5% with 20% -5% / 32% 15%,
    curve to 92% 15% with 65% -2% / 78% 25%,
    curve to 95% 78% with 105% 35% / 86% 58%,
    curve to 55% 95% with 82% 108% / 68% 80%,
    curve to 10% 88% with 38% 110% / 22% 75%,
    curve to 8% 12% with -3% 65% / 18% 40%,
    close
  );
}
```

The outline goes around in the following order.

1. `from 8% 12%` starts near the top-left corner
2. The first two `curve` commands draw the top edge with a shallow dip in the middle
3. The third bulges the right side outward while heading toward the bottom right
4. The fourth and fifth draw the right and left halves of the bottom edge
5. The sixth draws the left side and returns to the starting point
6. `close` closes the outline and finalizes the clipped region

Control points can be placed outside the reference box as well. `105% 35%`, for instance, pulls the right side outward, and `-3% 65%` does the same for the left side. A control point is not itself a point on the outline: it acts as a handle that determines the direction in which the curve enters and leaves its end points. Placing one outside the reference box is therefore what lets you create smooth curves that bulge past the edge of the element.

Every coordinate in this example is given in `%`. When you change the width in the demo, the horizontal coordinates of each end point and control point are recalculated as ratios of the reference box, so the whole six-curve outline follows the width of the element. This is the approach to take when you want an organic outline to stretch as a whole, rather than pinning down certain dimensions the way the speech bubble does.

<iframe height="300" style="width: 100%;" scrolling="no" title="Combining several curves with CSS shape()" src="https://codepen.io/azukiazusa1/embed/GgWJmEz?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/GgWJmEz">
  Combining several curves with CSS shape()</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Applying `shape()` to motion paths with `offset-path`

[CSS Motion Path](https://www.w3.org/TR/motion-1/) is the CSS mechanism for placing an element on a path — a line, a curve, and so on — and moving it along that path. It does not change the element's normal layout position; it applies an offset transform at paint time, so moving the element has no effect on the layout of its surroundings.

Motion paths are controlled mainly through a combination of these properties.

- [`offset-path`](https://www.w3.org/TR/motion-1/#offset-path-property): defines the path the element travels along
- [`offset-distance`](https://www.w3.org/TR/motion-1/#offset-distance-property): specifies the position along the path as a length or a percentage
- [`offset-rotate`](https://www.w3.org/TR/motion-1/#offset-rotate-property): rotates the element to match the direction of the path
- [`offset-anchor`](https://www.w3.org/TR/motion-1/#offset-anchor-property): specifies which point of the element is placed on the path

Passing `shape()` to `offset-path` lets you define the path an element travels along using CSS coordinates.

In the example below, a red dot travels along a cubic Bézier curve. The path leaves `10px` of room at its start and end points, and setting the horizontal coordinate of the end point to `calc(100% - 10px)` makes it follow the width of the container.

```css:styles.css
.motion-stage {
  position: relative;
  inline-size: 320px;
  block-size: 10rem;
}

.traveler {
  position: absolute;
  inline-size: 1.25rem;
  block-size: 1.25rem;
  border-radius: 50%;
  background: #e64553;
  offset-path: shape(
    from 10px 80%,
    curve to calc(100% - 10px) 20% with 35% 0 / 65% 100%
  );
  animation: travel 3s ease-in-out infinite alternate;
}

@keyframes travel {
  from {
    offset-distance: 0%;
  }
  to {
    offset-distance: 100%;
  }
}
```

`offset-distance` represents where along the path the element sits. Animating it from `0%` to `100%` moves the red dot along the curve, and changing the width of the container keeps the start and end points 10px from either edge as they follow along.

To respect the user's OS settings, the animation is stopped when `prefers-reduced-motion: reduce` is set.

```css
@media (prefers-reduced-motion: reduce) {
  .traveler {
    animation: none;
    offset-distance: 50%;
  }
}
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Animating with CSS offset-path: shape()" src="https://codepen.io/azukiazusa1/embed/pveJPpb?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/pveJPpb">
  Animating with CSS offset-path: shape()</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Summary

- `clip-path` with `path()` can express complex curves, but the coordinates inside the path string are implicitly `px`, which makes them hard to keep in sync with the element's size
- `shape()` uses percentages, CSS units, math functions, and custom properties to generate a path from the reference box at paint time
- Specifying `%` for coordinates that should follow along and `px` for corner radii and tails that should stay fixed gives you a speech bubble whose width stretches while its rounded corners and tail keep their size
- Combining several `curve` commands with two control points each lets you describe complex organic shapes that bulge outside the element using nothing but CSS
- `shape()` also works with `offset-path`, letting you define motion paths that follow the width of their container

## References

- [shape() - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/basic-shape/shape)
- [CSS Shapes Module Level 1](https://drafts.csswg.org/css-shapes/)
- [CSS Masking Module Level 1 - Clipping Paths](https://www.w3.org/TR/css-masking-1/#clipping-paths)
- [Motion Path Module Level 1](https://www.w3.org/TR/motion-1/)
- [CSSWG issue #10647: Overload `path()` for CSS-y SVG path syntax instead of taking up `shape()`](https://github.com/w3c/csswg-drafts/issues/10647)
