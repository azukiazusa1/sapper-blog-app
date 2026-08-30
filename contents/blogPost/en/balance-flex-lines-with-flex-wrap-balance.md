---
id: qZT6XmBzlfnuDwwCU0opf
title: "Balancing Flexbox Lines with flex-wrap: balance"
slug: "balance-flex-lines-with-flex-wrap-balance"
about: "With flex-wrap: wrap, the last line often holds just a few items, leaving the lines badly unbalanced. flex-wrap: balance keeps the line count that normal wrapping produces while redistributing flex items so each line comes out about the same length."
createdAt: "2026-08-30T19:06+09:00"
updatedAt: "2026-08-30T19:06+09:00"
tags: ["CSS"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3SN9mgUHBid0xGpl0bczaR/6c87c65fcca690c71ca4a0da033bda66/bread_bread-roll_5687-768x628.png"
  title: "ロールパンのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Which of the following describes how `flex-wrap: balance` behaves compared to a normal `flex-wrap: wrap`, according to the article?"
      answers:
        - text: "It shrinks every item until they all fit on a single line"
          correct: false
          explanation: "`balance` is not a value that forces everything onto one line. It still wraps items as a multi-line flexbox."
        - text: "It keeps the line count that normal wrapping produces and picks new break points so the lines end up close to the same length"
          correct: true
          explanation: "The article explains that `balance` first determines the line count from a normal `wrap`, then distributes the items evenly across that many lines."
        - text: "It automatically applies `justify-content: space-between` to the last line only"
          correct: false
          explanation: "What `balance` changes is where items are split across lines. It does not change the value of `justify-content`."
        - text: "It sorts the items from narrowest to widest before wrapping them"
          correct: false
          explanation: "The article explains that `balance` divides items into contiguous groups that preserve DOM order."
    - question: "What does `flex-line-count: 2` mean, according to the article?"
      answers:
        - text: "It sets the minimum number of lines used for balancing to 2"
          correct: true
          explanation: "`flex-line-count` specifies the minimum line count to use when `balance` distributes items."
        - text: "It caps the line count at 2 even when the items don't fit"
          correct: false
          explanation: "`flex-line-count` is not a maximum line count. Three or more lines are created if that's what it takes to fit the items."
        - text: "It places exactly 2 items on every line"
          correct: false
          explanation: "It specifies a minimum line count, not a number of items. How many items land on each line depends on the size of the items."
        - text: "It hides every flex item from the second line onward"
          correct: false
          explanation: "`flex-line-count` is not a property for truncating what's displayed; it is used when distributing flex items across lines."
published: true
---
b> flexbox-flex-wrap-balance

When you lay out tags or navigation items in a row with Flexbox, you reach for `flex-wrap: wrap` so that items which don't fit in the container move to the next line. Normal wrapping packs as many items as possible onto each preceding line, though, which can leave a single item stranded on the last line. And when that lone item stretches to fill the container thanks to `flex-grow`, the size difference against the items on the other lines becomes hard to miss.

![](https://images.ctfassets.net/in6v9lxmm5c8/5xcKUE9UyQCkcLXvpRNW94/e585c05a55061635d2854c3ae23b13df/image.png)

You could work around this imbalance by adding margins at specific widths with a container query, or by adjusting the container width with JavaScript. But both require recalculating every time the element's width changes, which makes the implementation more complicated.

```css
.tags {
  container-type: inline-size;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

/* Assumes that at this width exactly one item is left on the last line */
@container (400px <= width < 460px) {
  .tags li:last-child {
    flex-grow: 0; /* Don't let it consume the leftover space by growing */
    margin-inline: auto; /* Split the leftover space evenly on both sides to center it */
  }
}
```

[`flex-wrap: balance`](https://drafts.csswg.org/css-flexbox-2/#valdef-flex-wrap-balance) is a value that keeps the line count determined by normal wrapping while distributing flex items so that every line ends up close to the same length. This article covers how to use `flex-wrap: balance` and how flex items get distributed across lines.

!> As of August 2026, `flex-wrap: balance` is only available in Chrome and Edge 150 and later. Firefox and Safari do not support it. CSS Flexible Box Layout Module Level 2 is an Editor's Draft, so the specification may still change.

## `flex-wrap: wrap` leaves the last line unbalanced

Let's start by looking at how a normal `flex-wrap: wrap` distributes flex items across lines. The example below turns a list into a flex container and gives each item `flex: 1 1 80px`.

```html
<ul class="tags">
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
  <li>Web API</li>
</ul>
```

```css
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  max-inline-size: 430px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.tags li {
  flex: 1 1 80px;
  padding: 0.75rem 1rem;
  border: 1px solid #6d7fc6;
  border-radius: 0.5rem;
  background: #eef1ff;
  text-align: center;
}
```

The three values of `flex` are, in order, `flex-grow`, `flex-shrink`, and `flex-basis`. In this example each item gets a base width of `80px` and grows at the same rate whenever there is space left over on the line.

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/GgWJdxy?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/GgWJdxy">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

What the wrapping decision actually uses is `114px`: the `80px` `flex-basis` plus the horizontal `padding` and `border`. With a container width of `430px`, three items on the first line add up to `114px * 3 + 12px * 2 = 366px` and fit, while four come to `114px * 4 + 12px * 3 = 492px` and overflow the container. Since the normal wrapping algorithm keeps adding to the current line until the next item no longer fits, only the fourth item is pushed to the second line. `flex-grow` is then resolved per line, so the item on the second line stretches all the way across.

## Using `flex-wrap: balance`

Setting `flex-wrap` to `balance` evens out the lengths of the wrapped lines.

```diff
  .tags {
    display: flex;
-   flex-wrap: wrap;  
+   flex-wrap: balance;
    gap: 12px;
  }
```

With this change, the four items from before are placed two on the first line and two on the second. Because `flex-grow` is resolved per line, the items on both lines grow to roughly the same size.

<iframe height="300" style="width: 100%;" scrolling="no" title="flex-wrap: balance" src="https://codepen.io/azukiazusa1/embed/dPvoeev?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/dPvoeev">
  flex-wrap: wrap</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

When you specify `balance` on its own, it behaves as if `wrap` — which stacks lines in the normal direction — had been specified as well. To state the direction explicitly, you can combine the two keywords like this:

```css
.tags {
  flex-wrap: wrap balance;
}

.tags--reverse {
  flex-wrap: balance wrap-reverse;
}
```

## How flex items get distributed across lines

Normal `wrap` uses a greedy approach: it takes items from the start and keeps adding them to the current line until the next one no longer fits. Once an item has landed on the first line, it is never moved to the second line to improve the overall result.

The [`balance` algorithm](https://drafts.csswg.org/css-flexbox-2/#algo-balance), by contrast, picks the break points using the following steps:

1. Determine the number of lines a normal `wrap` would generate
2. Divide the items into that many contiguous groups, preserving DOM order
3. Assign at least one item to each line
4. Treat the difference between the container width and the sum of the items' pre-flex widths (including margins) on a line as that line's "error", then choose the division that minimizes the sum of the squared errors across all lines

For example, the four items above produce two lines under a normal `wrap`. `balance` keeps that count of two, but splitting them 2 + 2 rather than 3 + 1 brings the leftover space on each line closer together, so the third item moves to the second line.

:::info
`balance` is not simply a feature for equalizing the number of items per line. It takes each item's width before it flexes, adds the margins, and divides the items so that the width each line uses is as close as possible. That means when items have different widths, a division with a different number of items per line may well be the one that gets chosen.
:::

Once the items have been assigned to lines, the normal Flexbox flexing pass runs per line. That's why, in the example with `flex-grow`, the items on each of the 2 + 2 lines grow to roughly the same size.

## Setting a minimum line count with `flex-line-count`

b> flexbox-flex-wrap-balance

By default, the number of lines `balance` uses is the same as it would be if the items were laid out with `wrap`. If every item fits in the container, specifying `balance` still leaves you with a single line.

CSS Flexible Box Layout Module Level 2 also defines a [`flex-line-count`](https://drafts.csswg.org/css-flexbox-2/#flex-line-count-property) property for specifying the minimum line count to use for balancing.

```css
.tags {
  display: flex;
  flex-wrap: balance;
  flex-line-count: 5;
}

.tags li {
  flex: 1 1 0;
  min-inline-size: 0;
}
```

Since `flex-basis` is `0` the items would normally fit on a single line, but this example splits them across at least five lines and balances them there. The accepted values are integers of `1` or greater, and the initial value is `1`.

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/GgWJdXQ?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/GgWJdXQ">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

Note that `flex-line-count` is not a maximum line count. If six or more lines are needed to fit all the items, as many lines as necessary are created even with `flex-line-count: 5` in place.

Conversely, the value you specify is clamped from above by the number of items. With `flex-line-count: 5` but only two items, the minimum line count is treated as 2. Since `balance` assigns at least one item to every line, it never creates more lines than there are items.

## Why it was designed as a `flex-wrap` value

The desire to distribute flex items evenly across lines is nothing new. In a [2014 CSSWG discussion](https://lists.w3.org/Archives/Public/www-style/2014Oct/0293.html), the idea of `flex-wrap: balance` itself found support, but adding it to Flexbox Level 1 was deferred. It was then proposed again in 2018 as [CSSWG Issue #3070](https://github.com/w3c/csswg-drafts/issues/3070).

The [proposal's explainer](https://github.com/bfgeek/flex-wrap-balance) argued for `flex-wrap: balance` on the grounds that its meaning is easy to infer from the existing `text-wrap: balance`, and that it is a natural extension of `flex-wrap`, the property that controls how wrapping happens. There is also a competing view, however, that whether to wrap and how to place items are separate concerns.

In a [September 2025 CSSWG discussion](https://www.w3.org/2025/09/17-css-minutes.html), the group considered making balancing a standalone property such as `item-pack: balance`.

## Summary

- `flex-wrap: balance` keeps the line count determined by a normal `wrap` while picking new break points so that the sum of the items' pre-flex widths on each line comes out close to the same
- `flex-line-count` specifies, as an integer of `1` or greater, the minimum line count used when `balance` distributes items
- It was designed as a natural extension of `flex-wrap` — the property that controls how wrapping happens — with a meaning that's easy to infer from the existing `text-wrap: balance`, but making it a standalone property such as `item-pack: balance` has also been considered

## References

- [CSS Flexible Box Layout Module Level 2](https://drafts.csswg.org/css-flexbox-2/)
- [CSSWG Issue #3070: Add flex-wrap: balance](https://github.com/w3c/csswg-drafts/issues/3070)
- [flex-wrap: balance Explainer](https://github.com/bfgeek/flex-wrap-balance)
- [CSS Working Group Teleconference – 17 September 2025](https://www.w3.org/2025/09/17-css-minutes.html)
- [Chrome 150 release notes](https://developer.chrome.com/release-notes/150)
- [Web features explorer - flex-wrap: balance](https://web-platform-dx.github.io/web-features-explorer/features/flexbox-flex-wrap-balance/)
- [WG New Spec: flex-wrap: balance - W3C TAG Design Reviews](https://github.com/w3ctag/design-reviews/issues/1227)
- [flex-wrap: balance - Mozilla Standards Positions](https://github.com/mozilla/standards-positions/issues/1405)
- [flex-wrap: balance - WebKit Standards Positions](https://github.com/WebKit/standards-positions/issues/660)
