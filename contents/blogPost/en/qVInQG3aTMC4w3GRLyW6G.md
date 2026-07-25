---
id: qVInQG3aTMC4w3GRLyW6G
title: "Canvas UI: an HTML-in-Canvas component library"
slug: "html-in-canvas-component-library-canvasui"
about: "Canvas UI is a component library that uses the HTML-in-Canvas API to build creative interfaces with effects such as fluid simulations and shaders."
createdAt: "2026-07-25T20:00+09:00"
updatedAt: "2026-07-25T20:00+09:00"
tags: ["Web API", "canvas"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1ZO9sgxQcsw5cdIQdqmygG/06211c426a7b149121005f86a55e5c46/coffee-jelly_21116.png"
  title: "コーヒーゼリーのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Which statement correctly describes how the Canvas UI components introduced in this article are distributed and managed after installation?"
      answers:
        - text: "They are distributed as npm packages and managed as dependencies in node_modules"
          correct: false
          explanation: "The article explains that the components are distributed through a shadcn registry and managed as part of your own source code after installation."
        - text: "They are loaded from a CDN, with versions selected through the URL path"
          correct: false
          explanation: "The article does not mention distribution through a CDN."
        - text: "You must clone and build the repository, and individual components cannot be installed separately"
          correct: false
          explanation: "The article explains that components are installed individually."
        - text: "They are distributed through a shadcn registry and managed as part of your own source code after installation"
          correct: true
          explanation: "That is correct. The article explains that treating the components as your own source code makes them easy to customize and extend."
    - question: "According to the article, what effect is added when you set the blur prop on the Droplets component?"
      answers:
        - text: "The droplets fall more slowly and run down the screen at a reduced speed"
          correct: false
          explanation: "The fallSpeed prop shown in the article controls the falling speed; this is not the effect of blur."
        - text: "The background becomes blurred like a fogged-up window, while the area wiped with the pointer becomes clear"
          correct: true
          explanation: "That is correct. The article shows the entire view becoming foggy while the wiped area appears clear."
        - text: "The corners of the canvas become darker, drawing attention to the center"
          correct: false
          explanation: "The vignette prop shown in the article darkens the edges."
        - text: "A color is layered over the entire screen, tinting it with the specified hue"
          correct: false
          explanation: "The tint and tintStrength props shown in the article apply a color overlay to the content."

published: true
---

Canvas UI is a component library that uses the [HTML-in-Canvas](https://github.com/WICG/html-in-canvas) API to build creative interfaces with effects such as fluid simulations and shaders. HTML-in-Canvas is an experimental API that makes the rendered output of HTML elements placed inside a `<canvas>` element available to 2D Canvas, WebGL, and WebGPU. Because the original HTML remains in the DOM, WebGL effects can be applied while preserving pointer and keyboard interaction and participation in the accessibility tree, provided that the canvas rendering and DOM positions are synchronized correctly.

:::info
As of July 2026, the HTML-in-Canvas API is available as an Origin Trial in Chrome 148–150. To try it locally, enable the `chrome://flags/#canvas-draw-element` flag in Chrome Canary 149 or later. Making the feature available to general users requires registering for the Origin Trial and configuring a trial token.
:::

The components support a variety of frameworks, including React, Solid, Vue, and Svelte. They are distributed through a [shadcn/ui](https://ui.shadcn.com/docs/directory) registry and become part of your own source code after installation. This makes the components easy to customize and extend.

Browsers that do not support the HTML-in-Canvas API fall back to rendering regular HTML. Some effects, including `Droplets` and `Glass`, continue to work as WebGL overlays, but the full experience of transforming rendered HTML as a texture requires the HTML-in-Canvas API.

In this article, I will walk through my experience trying Canvas UI.

## Installing Canvas UI

This example uses Canvas UI with React. Because the components are distributed through a shadcn registry, you install them individually. You must also run `shadcn init` beforehand.

```bash
npx shadcn@latest init
```

Browse the [Canvas UI component catalog](https://canvasui.dev/components) and find a component that interests you.

![](https://images.ctfassets.net/in6v9lxmm5c8/6JhJ5nqEQJPS3i0sD453wy/d0fc608915689cf4329342610a29a78e/image.png)

As an example, let's install the `Droplets` component. This component creates an animation of liquid droplets running down the screen. Install it using the `shadcn` CLI.

```bash
npx shadcn@latest add @canvas-ui/droplets-react
```

After installation, the `src/components/canvasui/Droplets.tsx` file is created. Add it to your application to start using the Canvas UI component.

```tsx:src/components/canvasui/Droplets.tsx
"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export interface DropletsOptions {
  /** How much rain falls, from a light drizzle to a downpour (0 to 1.25). */
  intensity?: number;
  /** Animation speed multiplier. */
  speed?: number;
  /** Size of the droplet pattern. Higher means smaller drops. */
  scale?: number;
  /** Width of the droplets and their trails. */
  dropWidth?: number;
  /** How elongated the falling droplets are. */
  dropLength?: number;
  /** How strongly droplets refract the content behind them. */
  refraction?: number;
  /** Background blur outside the droplets, like a fogged up window. */
  blur?: number;
  /** Darkens the edges of the canvas (0 to 1). */
  vignette?: number;
  /** How fast the running drops slide down. */
  fallSpeed?: number;
  /** Horizontal wiggle of the running drops. */
  wiggle?: number;
  /** Multiplier for the small static droplets. */
  staticDrops?: number;
  /** Wipe drops off the glass with the pointer. */
  interactive?: boolean;
  /** Radius of the cursor wipe, relative to the screen height. */
  interactionRadius?: number;
  /** How strongly the cursor wipes drops off the glass (0 to 1). */
  interactionStrength?: number;
  /** How much the wipe distorts the content behind it. */
  interactionDistortion?: number;
  /** Tint color layered over the content as [r, g, b] in 0-1 range. */
  tint?: [number, number, number];
  /** Strength of the tint (0 to 1). */
  tintStrength?: number;
}

// ...
```

Wrapping the entire application in the `<Droplets>` component applies an animation of liquid droplets running across the whole screen.

```tsx:src/App.tsx
import { TodoApp } from "@/components/TodoApp";
import Droplets from "@/components/canvasui/Droplets";

function App() {
  return (
    <Droplets className="flex min-h-svh items-center justify-center bg-background p-6">
      <TodoApp />
    </Droplets>
  );
}

export default App;
```

Even with the animation applied, the Todo application remains fully interactive.

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/SQOvtHAUkCnZ5aerlQQy2/6280d3c0ce33e053e00f2563026a0aba/6980b5c5-28dd-493f-a209-b174c04dc168.mov" controls></video>

In browsers that do not support the HTML-in-Canvas API, the droplet animation is rendered as a WebGL overlay. Although this fallback cannot transform the rendered HTML as a texture, the interface remains fully interactive.

![](https://images.ctfassets.net/in6v9lxmm5c8/2Nzoo04LimKZJ0OyuVWUZc/8d09b90abdc4c0b06e0146c97f4dc547/image.png)

By adjusting the props, you can change the speed and amount of rainfall, the droplet size, and more. For example, changing `blur` adds a fogged-window effect that blurs the background.

```tsx:src/App.tsx {6}
import { TodoApp } from "@/components/TodoApp";
import Droplets from "@/components/canvasui/Droplets";

function App() {
  return (
    <Droplets blur={5} className="flex min-h-svh items-center justify-center bg-background p-6">
      <TodoApp />
    </Droplets>
  );
}

export default App;
```

The entire view takes on a foggy appearance, while only the areas wiped with the pointer become clear—a delightful effect.

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/5rbqNW9nilNmIGPfgiVcEy/8047b8a3d5b09069006dbdc138c4b95a/7077ff29-e4c5-4206-a5f8-13caef42ef15.mov" controls></video>

Let's look at a few more components. The `HexFloat` component divides the screen into glossy hexagonal tiles, adding perspective that makes the page appear tilted backward along with a floating effect. As you move the cursor, nearby tiles flatten to reveal a readable area of the content.

```bash
npx shadcn@latest add @canvas-ui/hex-float-react
```

Typing directly on the tilted screen feels delightfully strange.

![](https://images.ctfassets.net/in6v9lxmm5c8/3LFjQwck72iZ2HFF72R9MM/174ad5a9d877ef7e23b8d054ea5c3119/image.png)

The `Glass` component creates a glass lens that follows the cursor.

```bash
npx shadcn@latest add @canvas-ui/glass-react
```

![](https://images.ctfassets.net/in6v9lxmm5c8/5fIX39Tgjkb3YUDH44Yeje/1054bd584e6d0c686574c50d15143a52/image.png)

The `Shatter` component creates an effect that makes the area around the cursor break into glass-like shards.

```bash
npx shadcn@latest add @canvas-ui/shatter-react
```

![](https://images.ctfassets.net/in6v9lxmm5c8/32AHkFwGN3hyYPw6VpYWe3/48edb53748614de5cffe3bdd6a1b179b/image.png)

## Summary

- Canvas UI is a component library that uses the HTML-in-Canvas API to apply WebGL effects to the rendered output of HTML elements
- The original HTML remains in the DOM and is designed to preserve interactivity and accessibility when implemented correctly
- HTML-in-Canvas is an experimental Chrome feature; trying it locally requires enabling the `chrome://flags/#canvas-draw-element` flag in a supported version of Chrome Canary
- Browsers that do not support HTML-in-Canvas fall back to regular HTML rendering, while some effects continue to work as WebGL overlays
- Canvas UI supports a variety of frameworks, including React, Solid, Vue, and Svelte
- Components are distributed through a shadcn registry and can be installed with `npx shadcn@latest add @canvas-ui/<component-name>`
- Props make it easy to create a wide range of effects, including rain with `Droplets`, a tilted screen with `HexFloat`, a cursor-following glass lens with `Glass`, and a shattered area around the cursor with `Shatter`

## References

- [Canvas UI](https://canvasui.dev/)
- [DavidHDev/canvas-ui: A library of creative canvas components. Real HTML with WebGL effects running over it. React, Vue, Svelte, vanilla.](https://github.com/DavidHDev/canvas-ui)
