---
id: 3SdTUGtfovPcB_2xgui54
title: "Building UIs That Scroll Diagonally with CSS scroll-axis-lock"
slug: "css-scroll-axis-lock"
about: "Browsers sometimes lock scrolling to a single axis, either vertical or horizontal. The scroll-axis-lock property lets you disable this axis locking. This article covers the basics of using scroll-axis-lock."
createdAt: "2026-09-26T14:12+09:00"
updatedAt: "2026-09-26T14:12+09:00"
tags: ["CSS"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/01odA2iSnszkFjVUwzGqb0/0aa55a1a401a16d81e5c20d2d807a40a/ei_13954-768x630.png"
  title: "かわいいエイのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "What does the initial value auto of scroll-axis-lock mean?"
      answers:
        - text: "It allows the browser to apply axis locking"
          correct: true
          explanation: "auto leaves axis locking up to the browser. Axis locking does not happen for every gesture."
        - text: "It forces scrolling to lock to either the vertical or horizontal axis"
          correct: false
          explanation: "auto does not force axis locking. The current specification defines no value that forces it."
        - text: "It moves the scroll diagonally regardless of input"
          correct: false
          explanation: "scroll-axis-lock does not transform the direction of input. auto allows axis locking."
        - text: "It disables axis locking only for the vertical axis"
          correct: false
          explanation: "auto does not disable locking for a specific axis. The value that disables axis locking is none."
published: true
---

Have you ever tried to scroll a map or spreadsheet diagonally with a trackpad, only to find it moving straight up and down? Browsers infer the user's intent from the initial direction of a gesture and sometimes lock scrolling to a single axis, either vertical or horizontal. This behavior is called "axis locking."

Axis locking keeps content from drifting sideways unintentionally while you read down a page. On the other hand, it can get in the way of UIs like maps, where users want to move freely in both directions.

The CSS [scroll-axis-lock](https://drafts.csswg.org/css-overflow-5/#scroll-axis-lock) property lets you disable axis locking on a per-scroll-container basis. This article walks through the basics of how to use it.

!> As of September 22, 2026, `scroll-axis-lock` is available as a [new feature in Chrome 153](https://developer.chrome.com/release-notes/153#the_scroll-axis-lock_property). The specification is an Editor's Draft of CSS Overflow Module Level 5.

## What Is Scroll Axis Locking?

Even when you move your finger almost straight up or down, the gesture includes a small amount of horizontal movement. If the browser faithfully applied that horizontal movement to scrolling, the result could differ from what the user intended. So once the browser decides that the user "wants to scroll vertically," it may ignore the horizontal delta. This is called axis locking.

[The specification](https://drafts.csswg.org/css-overflow-5/#scroll-axis-locking) gives an example in which a gesture produces 500px of vertical movement and 3px of horizontal movement. If the browser locks scrolling to the vertical axis, the 3px of horizontal movement is not reflected in the scroll.

This is convenient when reading down a page, but in UIs such as maps, spreadsheets, and canvases, where users want to move freely in both directions, axis locking can get in the way. When axis locking restricts the movement, users have to lift their finger and try again from a different angle.

`scroll-axis-lock: none` disables this process of locking input to a single axis. When input has both vertical and horizontal components, it prevents the horizontal component from being discarded by axis locking.

## How to Use `scroll-axis-lock`

Specify `scroll-axis-lock: none` on the element that scrolls.

```css
.table-container {
  width: 420px;
  height: 360px;
  overflow: auto;
  scroll-axis-lock: none;
}
```

`overflow: auto` creates a scrollable area when the content overflows. Adding `scroll-axis-lock: none` to that element disables the browser's axis locking. For the element to scroll in both directions, its content must overflow both vertically and horizontally.

The property accepts the following two values.

| Value | Meaning |
| --- | --- |
| `auto` | The browser may lock scrolling to one axis. This is the initial value |
| `none` | The browser must not lock scrolling to one axis |

:::info
`auto` does not force axis locking. Which gestures get locked depends on the browser and the input device.
:::

:::warning
Setting `scroll-axis-lock: none` on a parent element does not automatically apply it to child elements, because the property is not inherited. You need to specify it on the element that actually scrolls.
:::

### Why Do We Need a New Property?

[The original proposal](https://github.com/w3c/csswg-drafts/issues/13207) identifies the problem that axis locking prevents free movement in two-dimensional UIs such as maps and large diagrams.

[The explainer](https://github.com/explainers-by-googlers/scroll-axis-lock#current-workarounds) describes an existing workaround: tracking the finger's movement in JavaScript and updating the scroll position manually. However, this approach requires you to handle the gestures yourself. And if the main thread that runs JavaScript is busy with other work, the response to user input can lag.

```js
const container = document.querySelector(".table-container");
let previous = null;

container.addEventListener("touchstart", (event) => {
  const touch = event.touches[0];
  // Only handle single-finger gestures, recording the starting coordinates used to compute movement
  previous =
    event.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : null;
});

container.addEventListener(
  "touchmove",
  (event) => {
    if (!previous || event.touches.length !== 1) return;
    // Disable the browser's default scrolling and update the scroll position ourselves
    event.preventDefault();

    const touch = event.touches[0];
    container.scrollLeft += previous.x - touch.clientX;
    container.scrollTop += previous.y - touch.clientY;
    previous = { x: touch.clientX, y: touch.clientY };
  },
  { passive: false },
);

const reset = () => {
  previous = null;
};
container.addEventListener("touchend", reset);
container.addEventListener("touchcancel", reset);
```

To address the problems with these JavaScript workarounds, the `scroll-axis-lock` property was proposed as a standard CSS way to control axis-locking behavior.

:::info
The initial proposal used the name and values `overflow-axis-lock: proximity | none`. In [the CSSWG discussion in January 2026](https://github.com/w3c/csswg-drafts/issues/13207#issuecomment-3808193000), the values were changed to `auto`, which leaves the default behavior up to the browser, and the name was changed to use the `scroll-` prefix to indicate that it controls scrolling.
:::

## Comparing the Behavior with a Large Table

Let's see how the behavior actually differs. The demo below places two identical tables side by side, with `scroll-axis-lock: none` applied to only one of them.

<iframe height="300" style="width: 100%;" scrolling="no" title="scroll-axis-lock comparison" src="https://codepen.io/azukiazusa1/embed/gbmRMWp?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/gbmRMWp">
  scroll-axis-lock comparison</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

The easiest way to see the difference is to scroll vertically with a trackpad. The table without `scroll-axis-lock: none` scrolls straight down, while the table with `scroll-axis-lock: none` drifts slightly sideways as it scrolls.

!v(https://videos.ctfassets.net/in6v9lxmm5c8/h1HC3QOcqBw75KeTkLGod/54b5600ff22b75879d2f9b33f0785600/css-scroll-axis-lock-1.mp4 938x522)

## Summary

- `scroll-axis-lock: none` disables axis locking, which is when the browser locks scrolling to either the vertical or horizontal axis
- The initial value `auto` leaves the decision to the browser and does not force axis locking
- `scroll-axis-lock` is not inherited, so specify it on the element that actually scrolls

## References

- [CSS Overflow Module Level 5 — Scroll Axis Locking](https://drafts.csswg.org/css-overflow-5/#scroll-axis-locking)
- [Explainer for scroll-axis-lock](https://github.com/explainers-by-googlers/scroll-axis-lock)
- [CSSWG Issue #13207: Allow controlling scroll axis locking behavior](https://github.com/w3c/csswg-drafts/issues/13207)
- [CSSWG PR #14152: Introduce scroll-axis-lock](https://github.com/w3c/csswg-drafts/pull/14152)
- [Chrome 153 Release notes](https://developer.chrome.com/release-notes/153)
- [Intent to Prototype and Ship: scroll-axis-lock](https://groups.google.com/a/chromium.org/g/blink-dev/c/hKqC91rcSG0)
