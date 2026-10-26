---
id: l28ZtF9fUxfCcP5UrzB7y
title: "Supporting Foldable Screens with the Device Posture API and Viewport Segments API"
slug: "device-posture-viewport-segments"
about: "Safari 27.1 ships the Device Posture API and Viewport Segments API behind feature flags for foldables like iPhone Duo. This article explains how both APIs work, how they evolved, and how to build layouts that avoid the fold."
createdAt: "2026-10-26T10:18+09:00"
updatedAt: "2026-10-26T10:18+09:00"
tags: ["CSS", "JavaScript"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/wrmn3Tjt5P0X0Jmo2rdqI/4d1a867176d9af2bf590fe044ef11f7a/side_oritatami_smartphone_10419.png"
  title: "折りたたみスマホのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "When a foldable device is fully closed and you are using its outer display, which posture does the Device Posture API return?"
      answers:
        - text: "continuous"
          correct: true
          explanation: "continuous represents a flat screen. It covers not only a fully opened foldable but also a fully closed one."
        - text: "folded"
          correct: false
          explanation: "folded represents a partially folded screen, such as the book or laptop posture. It does not include the fully closed state."
        - text: "closed"
          correct: false
          explanation: "The Device Posture API has only two values, continuous and folded. There is no closed value."
        - text: "The posture cannot be read and is null"
          correct: false
          explanation: "The posture is still available when the device is fully closed, and continuous is returned because the screen is flat."
    - question: "When a device is folded into the laptop posture and the screen is split into top and bottom segments, which reference gives the height of the bottom segment?"
      answers:
        - text: "env(viewport-segment-height 1 0)"
          correct: false
          explanation: "The first number is the column index. 1 0 refers to the right segment of a side-by-side split, which does not exist on a top-and-bottom split."
        - text: "env(viewport-segment-height 1 1)"
          correct: false
          explanation: "A top-and-bottom split has only one column, so there is no segment with a column index of 1."
        - text: "env(viewport-segment-height 0 1)"
          correct: true
          explanation: "env() takes the column and row indices, counted from 0. On a top-and-bottom split, the top segment is 0 0 and the bottom segment is 0 1."
        - text: "env(viewport-segment-height 0 0)"
          correct: false
          explanation: "0 0 is the top-left segment, which is the top segment on a top-and-bottom split."
    - question: "On a device that is not folded, what value does env(viewport-segment-width 0 0, 50vw) produce?"
      answers:
        - text: "The width of the entire viewport"
          correct: false
          explanation: "When there is only one segment, the fallback value is used instead of the width of the entire viewport."
        - text: "The fallback value, 50vw"
          correct: true
          explanation: "The viewport-segment-* environment variables are only defined when there are two or more segments, so the fallback value passed as the third argument is used."
        - text: "0px"
          correct: false
          explanation: "When the environment variable is undefined, the result is not 0px but the fallback value passed as the third argument to env()."
        - text: "Half the viewport width, calculated automatically"
          correct: false
          explanation: "The browser does not calculate half the width. The result is 50vw only because 50vw is specified as the fallback value."
    - question: "On a screen split into left and right segments, which is the correct way to calculate the width of the fold itself?"
      answers:
        - text: "Reference env(viewport-segment-hinge-width)"
          correct: false
          explanation: "There is no dedicated environment variable for the width of the fold."
        - text: "Subtract the width of the right segment from the width of the left segment"
          correct: false
          explanation: "The difference between the two segment widths is how much the segments differ in size, not the width of the fold."
        - text: "Read the fold angle from navigator.devicePosture and calculate it"
          correct: false
          explanation: "The Device Posture API only returns the continuous or folded posture. It does not expose the position or angle of the fold."
        - text: "Subtract the right edge of the left segment from the left edge of the right segment"
          correct: true
          explanation: "Since there is no dedicated variable, you calculate the distance between the two segments, as in calc(env(viewport-segment-left 1 0) - env(viewport-segment-right 0 0))."
    - question: "Why was the ability to read the fold angle removed from the Screen Fold API, the predecessor of the Device Posture API?"
      answers:
        - text: "For privacy reasons"
          correct: true
          explanation: "The angle was removed from the specification in March 2021, and at the Devices and Sensors Working Group meeting in October 2021 the removal was explained as a privacy matter."
        - text: "Because many devices lack an angle sensor"
          correct: false
          explanation: "The angle was not removed because of whether devices have sensors, but for privacy reasons."
        - text: "Because the angle information moved to the Viewport Segments API"
          correct: false
          explanation: "The Viewport Segments API provides the number, position, and size of segments. It does not deal with the angle."
        - text: "Because CSS media features could not express the angle"
          correct: false
          explanation: "It was removed for privacy reasons, not because of a limitation in how CSS can express values."

published: true
---

b> device-posture
b> viewport-segments

iPhone Duo is an iPhone with a foldable screen. When closed, it uses the outer display; when opened, it uses the larger inner display. According to [WebKit Features for Safari 27.1](https://webkit.org/blog/18486/webkit-features-for-safari-27-1/), Safari's viewport width ranges from 382px when holding the outer display in portrait to 951px when holding the inner display in landscape.

Changes in width can be handled with ordinary responsive design. However, when the screen is folded about halfway, there are problems that responsive design alone cannot solve. For example, if a button or a block of text placed in the middle of the screen ends up on top of the fold, the button becomes hard to tap and the text becomes hard to read. For a page to avoid the fold, it needs two pieces of information:

- Whether the device is folded
- The position and size of each area separated by the fold

These two pieces of information are provided by the [Device Posture API](https://w3c.github.io/device-posture/) and the [Viewport Segments API](https://drafts.csswg.org/css-viewport/#segments). This article explains how the two APIs work and how they came to be, and then implements a layout that splits a list and its details into left and right panes, and a layout that splits a video and its controls into top and bottom areas.

!> As of October 26, 2026, the Device Posture API and Viewport Segments API in Safari 27.1 are developer previews and only work when their feature flags are enabled. Chrome and Edge have supported the [Device Posture API since version 132](https://chromestatus.com/feature/5185813744975872) and the [Viewport Segments API since version 138](https://chromestatus.com/feature/5170498990243840). Firefox does not support them yet.

## How the Two APIs Came to Be

Both APIs originated from the [Foldables Explainer](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/Foldables/explainer.md) that Microsoft proposed in 2019 for dual-screen devices such as the Surface Duo. The [original explainer](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/38238af/Foldables/explainer.md) proposed a `spanning` media feature and `env(fold-*)` environment variables representing the position of the fold. These have since been replaced by today's `horizontal-viewport-segments` / `vertical-viewport-segments` media features and `env(viewport-segment-*)` environment variables.

The JavaScript API has also changed shape several times. It was first proposed as a `window.getWindowSegments()` method, and in October 2021 it moved to a `window.visualViewport.segments` property. Later, the CSS Working Group [discussed](https://github.com/w3c/csswg-drafts/issues/9237#issuecomment-2160730855) [Issue #9237](https://github.com/w3c/csswg-drafts/issues/9237) in June 2024 and resolved to create a new object on `window` representing the layout viewport and to define `segments` on it.

The Device Posture API was originally called the Screen Fold API and could report the angle of the fold. In March 2021, the angle was removed from the specification, and the API was renamed to the Device Posture API at the same time. At the [Devices and Sensors Working Group meeting in October 2021](https://www.w3.org/2021/10/28-dap-minutes.html), the angle was explained as having been removed for privacy reasons. Today, only two values remain: `continuous` and `folded`.

As this history shows, both APIs have been refined to expose only the minimum information needed for layout, rather than exposing the device's hardware in detail.

## Detecting the Device Posture with the Device Posture API

The Device Posture API represents the posture of a device with one of two values:

| Value        | State                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------ |
| `continuous` | The screen is flat. This includes regular smartphones, fully opened foldables, and fully closed devices |
| `folded`     | The screen is partially folded, such as in the book or laptop posture                                   |

Both the fully closed and the fully opened states are `continuous`. To tell whether the outer or inner display is in use, use a regular `width` media query rather than the Device Posture API.

In CSS, you can use the `device-posture` media feature to check whether the device is folded.

```css
@media (device-posture: folded) {
  .layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
```

In JavaScript, `navigator.devicePosture.type` returns the current posture, and the `change` event notifies you when the posture changes. `navigator.devicePosture` is only available in secure contexts (HTTPS or `localhost`).

```js
console.log(navigator.devicePosture.type); // "continuous" or "folded"

navigator.devicePosture.addEventListener("change", () => {
  console.log(navigator.devicePosture.type);
});
```

The Device Posture API only tells you whether the device is folded. It does not tell you where the fold is or which direction it runs. For that, you use the Viewport Segments API.

## Finding the Fold with the Viewport Segments API

When the viewport is divided by a fold or a hinge (the part that connects two screens), the Viewport Segments API exposes each area as a segment. It consists of three parts: CSS media features, CSS environment variables, and a JavaScript API.

### Media Features for Counting Segments

[`horizontal-viewport-segments`](https://drafts.csswg.org/mediaqueries-5/#mf-horizontal-viewport-segments) represents the number of segments along the horizontal axis, and `vertical-viewport-segments` represents the number along the vertical axis. When the screen is split into left and right halves, as in the book posture, `horizontal-viewport-segments: 2` matches. When it is split into top and bottom halves, as in the laptop posture, `vertical-viewport-segments: 2` matches.

```css
/* When there are two segments side by side */
@media (horizontal-viewport-segments: 2) {
}

/* When there are two segments stacked vertically */
@media (vertical-viewport-segments: 2) {
}
```

### Environment Variables for Segment Position and Size

[CSS Environment Variables](https://drafts.csswg.org/css-env-1/#viewport-segments) defines six environment variables that represent the position and size of a segment:

- `viewport-segment-width` / `viewport-segment-height`: The width and height of the segment
- `viewport-segment-top` / `viewport-segment-bottom`: The position of the top and bottom edges of the segment
- `viewport-segment-left` / `viewport-segment-right`: The position of the left and right edges of the segment

For each of them, you pass the segment's column and row indices, counted from 0, as arguments to `env()`. When the screen is split into left and right segments, the left one is `0 0` and the right one is `1 0`. When it is split into top and bottom segments, the top one is `0 0` and the bottom one is `0 1`.

![](https://images.ctfassets.net/in6v9lxmm5c8/39pDmjFVyumHd35aARenlW/3d370129a17085d03d1eb5d817db2519/device-posture-viewport-segments-1.png)

```css
.left-pane {
  width: env(viewport-segment-width 0 0, 50vw);
}
```

These environment variables are only defined when there are two or more segments. On devices that are not folded, or in browsers that do not support them, the fallback value passed as the third argument to `env()` is used.

There is no dedicated variable for the width of the fold itself, so you calculate it from the distance between the two segments. When the screen is split into left and right segments, the width of the fold is the left edge of the right segment minus the right edge of the left segment.

```css
.hinge {
  width: calc(env(viewport-segment-left 1 0) - env(viewport-segment-right 0 0));
}
```

### Getting Segments in JavaScript

`window.viewport.segments` returns an array of `DOMRect` objects, one for each segment. When the viewport is divided by a fold or a hinge, the array has two elements; otherwise, it has one. The posture (`device-posture`) and the number of segments are separate pieces of information, so some devices, such as dual-screen devices, have two segments while remaining `continuous`.

```js
for (const segment of window.viewport.segments) {
  console.log(segment.x, segment.y, segment.width, segment.height);
}
```

## Example 1: Splitting a List and Details into Left and Right Panes

Screens that show the details of an item selected on one side on the other side, such as mail apps or product listings, work well with the book posture. Here, we show the list in the left segment and the details in the right segment.

The HTML simply places the list and the details next to each other.

```html
<div class="layout">
  <ul class="list">
    <li><button type="button" aria-current="true">Message 1</button></li>
    <li><button type="button">Message 2</button></li>
    <li><button type="button">Message 3</button></li>
  </ul>
  <article class="detail">
    <h1>Message 1</h1>
    <p>This is the body of Message 1.</p>
  </article>
</div>
```

In the CSS, we first apply ordinary responsive design and switch to two panes when the width is 640px or more.

```css
body {
  margin: 0;
}

.layout {
  display: grid;
  grid-template-columns: 1fr;
  min-height: 100svh;
}

@media (min-width: 640px) {
  .layout {
    grid-template-columns: 280px 1fr;
  }
}
```

Because this is a plain two-column grid that ignores the position of the fold, the details may end up on top of the fold.

![](https://images.ctfassets.net/in6v9lxmm5c8/6ylUxJhvTNm5WlN5HWyoj8/e29c40aa75aaa1af498304401cab0823/device-posture-viewport-segments-2.png)

To fix this, switch to a three-column grid aligned with the segments, but only when there are two segments side by side.

```css
@media (horizontal-viewport-segments: 2) {
  .layout {
    grid-template-columns:
      env(viewport-segment-width 0 0)
      calc(env(viewport-segment-left 1 0) - env(viewport-segment-right 0 0))
      env(viewport-segment-width 1 0);
  }

  .list {
    grid-column: 1;
  }

  .detail {
    grid-column: 3;
  }
}
```

`@media (horizontal-viewport-segments: 2)` matches when there are two segments separated by the fold. In `grid-template-columns`, the first column is the width of the left segment, the second is the width of the fold, and the third is the width of the right segment. The list goes in the first column and the details in the third, and nothing is placed in the second column, which corresponds to the fold, so no content overlaps the fold.

In Chrome DevTools, select "Galaxy Z Fold 5" or "Asus Zenbook Fold" from the device list, then choose Folded from the posture toggle (Continuous / Folded) that appears in the toolbar to simulate a folded device. The first screenshot shows Continuous and the second shows Folded. You can see that the list and the details do not overlap the fold and are displayed without straddling it.

![](https://images.ctfassets.net/in6v9lxmm5c8/5haAiGjGHcxF9Qgddu9Ggk/cdcc8dfb8e21100e454d7b1d4bee83a6/device-posture-viewport-segments-3.png)

![](https://images.ctfassets.net/in6v9lxmm5c8/5EUtqRinypb8jm29g4bQ1x/533af204edeca286622fad408e7a9bbb/device-posture-viewport-segments-4.png)

## Example 2: Splitting a Video and Its Controls into Top and Bottom Areas

When you hold the device in landscape and fold it into the laptop posture, the top half acts like an upright screen and the bottom half sits like a keyboard on a desk. We'll build a layout where you watch the video on the top half and use the play button and seek bar on the bottom half.

```html
<div class="player">
  <video src="sample.mp4" playsinline muted loop></video>
  <div class="controls">
    <button type="button" id="toggle">Play</button>
    <input type="range" id="seek" min="0" max="100" value="0" aria-label="Playback position" />
  </div>
</div>
```

When the screen is split into top and bottom segments, `vertical-viewport-segments: 2` matches. The row heights are set with `viewport-segment-height`, and the height of the fold is calculated as the top edge of the bottom segment minus the bottom edge of the top segment.

```css
body {
  margin: 0;
}

.player {
  display: grid;
  grid-template-rows: auto auto;
}

video {
  width: 100%;
  height: 100%;
  background: #000;
}

@media (vertical-viewport-segments: 2) {
  .player {
    height: 100dvh;
    grid-template-rows:
      env(viewport-segment-height 0 0)
      calc(env(viewport-segment-top 0 1) - env(viewport-segment-bottom 0 0))
      env(viewport-segment-height 0 1);
  }

  video {
    grid-row: 1;
    object-fit: contain;
  }

  .controls {
    grid-row: 3;
  }
}
```

By placing the video in the first row and the controls in the third row, the video fills the top half and the controls move to the half closest to your hands.

![](https://images.ctfassets.net/in6v9lxmm5c8/7qFrbMuN5CrmUV2Q1cnzf0/33bfabe99c9e96529dfa6960da70aa41/device-posture-viewport-segments-5.png)

## Summary

- The Device Posture API tells you whether the device is partially folded (`folded`) or flat (`continuous`), through the CSS `device-posture` media feature and `navigator.devicePosture`
- Both the fully closed and fully opened states are `continuous`, so use `width` media queries to determine the size of the display in use
- The Viewport Segments API provides the number of areas separated by the fold through `horizontal-viewport-segments` / `vertical-viewport-segments`, and their position and size through `env(viewport-segment-*)` and `window.viewport.segments`
- The width of the fold is calculated with `calc()` from the difference between the edges of adjacent segments
- The fold angle was removed from the specification for privacy reasons, and the segments API settled on `window.viewport.segments` after going through `getWindowSegments()` and `visualViewport.segments`
- In Safari 27.1, the APIs only work when their feature flags are enabled. Chrome and Edge support both APIs

## References

- [WebKit Features for Safari 27.1 | WebKit](https://webkit.org/blog/18486/webkit-features-for-safari-27-1/)
- [Device Posture API](https://w3c.github.io/device-posture/)
- [CSS Viewport Module Level 1 - Segments](https://drafts.csswg.org/css-viewport/#segments)
- [CSS Environment Variables Module Level 1 - Viewport segment variables](https://drafts.csswg.org/css-env-1/#viewport-segments)
- [Media Queries Level 5 - horizontal-viewport-segments](https://drafts.csswg.org/mediaqueries-5/#mf-horizontal-viewport-segments)
- [Foldables Explainer | MicrosoftEdge/MSEdgeExplainers](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/Foldables/explainer.md)
