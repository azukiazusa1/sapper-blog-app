---
id: Y0l8nwBLSxTfkbICYqZ3a
title: "About the HTML in Canvas API for Rendering HTML Directly Inside Canvas"
slug: "html-in-canvas-api"
about: "HTML in Canvas API is an experimental API proposed at WICG for rendering HTML directly inside a canvas. This article explains how it works, what problems it solves, and the kinds of use cases it enables."
createdAt: "2026-04-10T19:17+09:00"
updatedAt: "2026-04-10T19:17+09:00"
tags: ["Web API", "canvas"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2XFLFPVE4flo0iwpx3MCmS/c32d6999b93000d4a7cbbb44e10a2cec/chess_14477-768x768.png"
  title: "チェスの駒のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Which of the following best matches the article's explanation of how HTML in Canvas API improves on drawing text with `fillText()`?"
      answers:
        - text: "It automatically converts text on a canvas into vector graphics for higher print quality."
          correct: false
          explanation: "The article does not discuss print quality or vector conversion. Its main focus is layout and accessibility."
        - text: "It lets you transfer HTML layout results onto a canvas, enabling richer presentation while still aiming to preserve text selection and assistive technology support."
          correct: true
          explanation: "This is the core benefit described in the article. It uses the browser's layout engine while making canvas-based presentation possible, with accessibility benefits as well."
        - text: "It is available as a built-in `<canvas>` feature in every browser without any extra setup."
          correct: false
          explanation: "The article explains that this is an experimental API at the WICG proposal stage and currently requires a Chrome Canary flag."
        - text: "It makes it possible to get the same rendering result using only CSS without relying on the Canvas API."
          correct: false
          explanation: "HTML in Canvas API is still an API for drawing into canvas. It is not a CSS-only replacement."
    - question: "When using HTML in Canvas API, which attribute do you add to the canvas element to define the HTML content to be rendered?"
      answers:
        - text: "`paintsubtree`"
          correct: false
          explanation: "This is not the attribute introduced in the article. `paint` appears as an event name instead."
        - text: "`renderhtml`"
          correct: false
          explanation: "No such attribute appears in the HTML in Canvas API described in the article."
        - text: "`layoutsubtree`"
          correct: true
          explanation: "The article explains that you add the `layoutsubtree` attribute to the canvas element to define the HTML you want to render."
        - text: "`drawElementImage`"
          correct: false
          explanation: "This is not an attribute. It is the name of the method used to draw child elements."
published: true
---
HTML in Canvas API is an experimental API proposed at WICG that enables rendering HTML directly inside a canvas. Today's `<canvas>` element has no standard way to render rich text or HTML content, which creates a real limitation. The `fillText()` method provides basic text rendering, but layout and styling control are limited, so developers have had to rely on third-party libraries or custom implementations to build more complex text rendering. As a result, accessibility issues and performance drawbacks can arise.

For reference, a simple example of drawing text with `fillText()` looks like this:

```javascript
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.font = "16px sans-serif";
ctx.fillStyle = "#333";
// The second argument specifies the x coordinate, and the third specifies the y coordinate
// To render practical text, you need to measure text width and implement line wrapping yourself
ctx.fillText("こんにちは", 10, 30);
```

When you use `fillText()` to draw text like this, line breaks are not handled automatically, so you cannot apply inline styling such as bolding part of the text, and you need to implement text wrapping and layout control yourself. It also raises accessibility concerns. Because the text is not included in the accessibility tree, assistive technologies such as screen readers cannot recognize it. In addition, users cannot select or copy the text, which can hurt the user experience.

With HTML in Canvas API, the browser's layout engine can lay out and render HTML, then transfer it into the canvas like an image, addressing these problems. Example use cases include chart labels and legends, in-game UI text, and interactive content.

This article explains how to use the HTML in Canvas API.

:::note
HTML in Canvas API is an experimental API still at the WICG proposal stage. At the moment, you can use it by enabling the `chrome://flags/#canvas-draw-element` flag in Chrome Canary.
:::

## How to Use the HTML in Canvas API

HTML in Canvas API consists of the following three pieces:

- The `layoutsubtree` attribute
- The `drawElementImage()` method
- The `paint` event

By adding the `layoutsubtree` attribute to a canvas element, you can define the HTML you want to render inside the canvas. At this stage, nothing is drawn into the canvas yet.

```html
<canvas id="canvas" width="400" height="300" layoutsubtree>
  <div id="content">
    <h2>こんにちは</h2>
    <p>Canvas 内の HTML です</p>

    <input type="text" placeholder="入力もできます" />
  </div>
</canvas>
```

Next, you can call the `drawElementImage()` method to draw the canvas element's children. Its usage is similar to `drawImage()`. You can use the returned `DOMMatrix` object to get the position and size of the rendered HTML. You can also apply that return value as a transform so that the DOM position matches the rendered position. This is important for solving hit testing and accessibility issues.

```javascript
const canvas = document.getElementById("canvas");
const content = document.getElementById("content");
const ctx = canvas.getContext("2d");

// Draw the content element at coordinates (100, 0)
const transform = ctx.drawElementImage(content, 100, 0);
// Apply the transform so the DOM position matches the rendered position
content.style.transform = transform.toString();
```

If you run the code above, you can confirm that the HTML is rendered as shown below. Interactions such as typing into the `<input>` element also work.

![](https://images.ctfassets.net/in6v9lxmm5c8/UIah4qCytG43jtYrAgANc/881045270fb52b12b046258705814c71/image.png)

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/dPpgVRX?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/dPpgVRX">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

When the rendering of a canvas child element changes, the `paint` event fires. By subscribing to this event, you can redraw the HTML in the canvas when it changes. For example, suppose you have code like the following that changes text inside the canvas when a button is clicked.

```html
<canvas id="canvas" width="400" height="300" layoutsubtree>
  <div id="content">
    <h2>こんにちは</h2>
    <p>Canvas 内の HTML です</p>
  </div>
</canvas>

<button id="button">テキストを変更</button>

<script>
  const content = document.getElementById("content");
  const button = document.getElementById("button");
  button.addEventListener("click", () => {
    content.querySelector("h2").textContent = "こんにちは、世界！";
  });
</script>
```

As written, the change will not be reflected even if the text inside the canvas changes, because canvas does not automatically stay in sync with DOM re-rendering. Subscribe to the `paint` event so the canvas redraws when the HTML inside it changes. The changed elements are passed in `event.changedElements`, which you can then pass to `drawElementImage()`.

```javascript
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.addEventListener("paint", (event) => {
  ctx.reset();

  ctx.drawElementImage(event.changedElements[0], 100, 0);
});
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/vEXVejm?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/vEXVejm">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

For use cases such as games that need to redraw every frame, you can use `requestPaint()` to trigger a `paint` event on the next frame. This makes it possible to redraw the HTML inside the canvas every frame when needed.

```javascript
let t = 0;
function gameLoop() {
  t += 0.01;
  canvas.requestPaint();
  requestAnimationFrame(gameLoop);
}
```

## Combining It with WebGL

If you are using a WebGL context, you can also render HTML in 3D space. In that case, you use the `texElementImage2D()` method instead of `drawElementImage()`. Its usage is similar to `texImage2D()`. Unlike `drawElementImage()`, `texElementImage2D()` does not return a value for obtaining the position and size of the rendered HTML. Because of that, if you want the rendered HTML position to match the DOM position, you need to separately obtain a transform with `canvas.getElementTransform()`.

```javascript
const canvas = document.getElementById("c");
const el = document.getElementById("el");
const gl = canvas.getContext("webgl");

canvas.onpaint = () => {
  gl.texElementImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    el,
  );

  // Reproduce the same rotation as the shader with DOMMatrix
  const drawTransform = new DOMMatrix([
    // ...
  ]);

  const cssTransform = canvas.getElementTransform(el, drawTransform);
  el.style.transform = cssTransform.toString();
};
```

<video controls src="https://videos.ctfassets.net/in6v9lxmm5c8/1ZWGnXom8yXlM4uZxzKLOV/0e0e9a553418b5b9760579f174b1196a/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2026-04-10_20.50.28.mov"></video>

## Main Use Cases

Here are a few examples that use HTML in Canvas. The examples shown here were created for me by Codex.

The first sample applies a fog-like effect over an entire block of HTML content. When you hover with the mouse, it redraws the HTML only inside the circle so that the content appears through the fog. Because the content itself is still normal HTML, users can still select text and click links. Doing this with ordinary HTML/CSS alone makes partial redraw-style effects across the whole content difficult, while Canvas alone cannot preserve text selection or link interaction. HTML in Canvas makes it possible to combine visual effects with normal HTML interaction.

<video controls src="https://videos.ctfassets.net/in6v9lxmm5c8/1saP1SNYQQKBwkyV4I69yS/4c7587e041293fbe07d181a41cc71717/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2026-04-10_21.55.17.mov"></video>

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/JoRmOQv?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/JoRmOQv">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

The second sample applies a wave-like effect when switching between light mode and dark mode. The UI itself remains normal HTML, while only the animation effect is delegated to canvas, which makes more complex animation effects possible. Theme switching can be implemented with ordinary CSS animation too, but effects that distort the whole screen are much harder to achieve. On the other hand, if you render the whole UI with Canvas alone, you need to implement things like forms and focus management yourself. HTML in Canvas lets you keep the UI as HTML while adding flexible transition effects.

<video controls src="https://videos.ctfassets.net/in6v9lxmm5c8/5OXlOT6aaoFWtVG48PvmPL/6fc9f0bfaa05d9f908fe7f4f0cb0d7fe/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2026-04-10_22.00.06.mov"></video>

<iframe height="300" style="width: 100%;" scrolling="no" title="Theme Wave Wipe" src="https://codepen.io/azukiazusa1/embed/jEMeYNr?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/jEMeYNr">
  Theme Wave Wipe</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

The final sample is a game implemented on canvas. The game logic itself stays inside the canvas, while the name input form is implemented in HTML so you can take advantage of both the game UI and HTML. If you implement the input form with Canvas alone, you have to build things like Japanese text input, focus control, and accessibility support yourself. With HTML in Canvas, you can leave game rendering to Canvas while using standard HTML features for the input UI as-is.

<video controls src="https://videos.ctfassets.net/in6v9lxmm5c8/4NEEMXapeU1J23gfcEQChl/6604102a4739a1e942429b60149dd90f/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2026-04-10_22.03.23.mov"></video>

<iframe height="300" style="width: 100%;" scrolling="no" title="canvas game" src="https://codepen.io/azukiazusa1/embed/GgjYygb?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/GgjYygb">
  canvas game</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Summary

- HTML in Canvas API makes it possible to render HTML directly inside a canvas
- This removes the need to rely on third-party libraries or custom implementations just to place text inside a canvas, which can improve accessibility and performance
- HTML in Canvas API consists of three pieces: the `layoutsubtree` attribute, the `drawElementImage()` method, and the `paint` event
- When using a WebGL context, you can render HTML in 3D space with the `texElementImage2D()` method
- HTML in Canvas API can be used to apply effects to an entire block of HTML content
- It can also be used for wave-like transitions between light and dark mode, or to implement HTML-based UI inside a canvas game

## References

- [WICG/html-in-canvas](https://github.com/WICG/html-in-canvas)
