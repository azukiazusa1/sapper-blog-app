---
id: ospAlutKoInu94tKj9lTX
title: "What Is TanStack Redact, a Lightweight React-Compatible Runtime?"
slug: "what-is-tanstack-redact"
about: "TanStack Redact is a lightweight runtime that keeps React's component and Hooks model but renders synchronously, so some APIs behave differently. This article covers setup and design, and compares startTransition in React and Redact."
createdAt: "2026-09-15T22:08+09:00"
updatedAt: "2026-09-15T21:19+09:00"
tags: ["React", "TanStack Redact"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/6oHYwjjGV1qqBSA53vZ5zI/96361195210549f60699e66d97144463/food_cheese-hamburger_6974.png"
  title: "チーズバーガーのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "When you use Redact with Vite, what happens to the React imports in your existing code?"
      answers:
        - text: "You rewrite every component using TanStack Start APIs"
          correct: false
          explanation: "TanStack Start is not required. Redact keeps the basic way of writing code with components and Hooks."
        - text: "The import statements stay the same, and the plugin resolves them to Redact's implementation"
          correct: true
          explanation: "redact() replaces the import targets such as react and react-dom/client."
        - text: "You manually rewrite every import to @tanstack/redact"
          correct: false
          explanation: "With the Vite plugin, the React imports in your application code stay as they are."
        - text: "React and Redact take turns rendering into the same DOM"
          correct: false
          explanation: "Redact works by swapping the import targets. The two runtimes do not take turns rendering."
    - question: "By omitting interruptible rendering, which work does Redact no longer need to implement?"
      answers:
        - text: "Applying elements written in JSX to the DOM"
          correct: false
          explanation: "Redact still renders the product list to the DOM. It does not skip rendering itself."
        - text: "Holding the typed string as state"
          correct: false
          explanation: "The same product search example uses useState to hold the input value."
        - text: "Calling components with props"
          correct: false
          explanation: "Redact also inherits React's component model and passes props."
        - text: "Interrupting rendering based on priority and resuming the unfinished work"
          correct: true
          explanation: "Redact does not provide concurrent scheduling, and it omits or simplifies the implementation that supports interrupting and resuming."
    - question: "Which statement about Redact's nano preset is correct?"
      answers:
        - text: "It only improves compression while preserving all of React's behavior"
          correct: false
          explanation: "nano disables optional features all at once, which also changes behavior."
        - text: "It detects the features you use at runtime and adds the required implementation automatically"
          correct: false
          explanation: "You choose features through configuration. For example, if context is disabled, Provider values are not passed down."
        - text: "It disables optional features all at once, and you enable the ones you need in the configuration"
          correct: true
          explanation: "Disabling a feature removes its behavior, so you need to weigh the features you need against bundle size."
        - text: "It stops synchronous rendering and uses the same rendering priority control as React"
          correct: false
          explanation: "nano does not add concurrent scheduling."
published: true
---

[TanStack Redact](https://github.com/TanStack/redact) is a lightweight runtime that supports React's APIs. It replaces the React implementation used at runtime while letting you keep your existing code written with JSX and Hooks.

[Preact](https://preactjs.com/guide/v10/differences-to-react/) is another lightweight alternative to React. Preact itself does not aim to be a reimplementation of React. Instead, it lets you use React code and libraries through a compatibility layer called `preact/compat`.

In [Projecting React](https://tannerlinsley.com/posts/projecting-react), Tanner Linsley, the author of Redact, recalls that he first tried adopting `preact/compat`. According to the post, his application at the time ran into a pile of compatibility issues around the behavior of `use()`, React 19's Server Actions-related APIs, Portals, Error Boundaries, and the finer details of hydration, and the extra compatibility code kept growing.

So Redact took a different approach: start from React's public API and build an implementation scoped to what TanStack Start needs. Whereas Preact stacks a compatibility layer on top of itself, Redact builds its implementation from the React APIs and behaviors that are actually needed.

That said, sharing the same API names does not mean that all of React's behavior is reproduced. Redact uses synchronous rendering and omits the mechanism that interrupts and resumes rendering based on priority. This difference affects how `useDeferredValue` and `startTransition` behave.

In this article, I'll explain what TanStack Redact does and how it differs from React's design philosophy.

## Getting Started with TanStack Redact

In a typical React application, you import things like `useState` from `react` and `createRoot` from `react-dom/client`. Redact uses your build tool to swap these import targets for its own implementation.

For example, the imports you write in your application code are exactly the same as with regular React:

```jsx
import { startTransition, useState } from "react";
import { createRoot } from "react-dom/client";
```

With Redact's Vite plugin, `react` resolves to `@tanstack/redact`, and `react-dom/client` resolves to `@tanstack/redact/dom-client`. Modules used to run JSX, such as `react/jsx-runtime`, are replaced in the same way.

### Adding Redact to Vite

Let's use Redact in a Vite + React project. First, install the `@tanstack/redact` package.

```bash
npm install --save-exact @tanstack/redact@0.1.2
```

Next, add `redact()` to your Vite plugins. If you use Vite's built-in JSX transform, you also need to specify `esbuild: { jsx: 'automatic' }` explicitly. If you use the React Vite plugin, the automatic JSX runtime is enabled by default, so you don't need to specify it.

```js:vite.config.js
import { defineConfig } from 'vite';
import { redact } from '@tanstack/redact/vite';

export default defineConfig({
  plugins: [redact()],
  esbuild: { jsx: 'automatic' },
});
```

Redact's plugin handles client and SSR builds. Note, however, that it does not swap imports in the React Server Components (RSC) environment, where the original React is used as is.

## How Redact Differs from React's Design Philosophy

To understand Redact's design, let's first look at what React prioritizes. React places a few constraints on components so that it can control when rendering happens.

One of React's core ideas is keeping components pure. A component should return the same result for the same props, state, and context, and it should not modify external state during rendering. Side effects run outside of rendering, in places like event handlers and Effects.

These constraints make it easier for React to control when components are evaluated. [React's official documentation](https://react.dev/reference/rules/components-and-hooks-must-be-pure) also explains how purity relates to prioritizing rendering.

### Prioritizing Input over Heavy UI Updates

One reason to control when rendering happens is to keep the UI responsive to user interactions. For example, imagine a screen that updates a huge list as the user types into a search field. If updating the input field has to wait until the list finishes rendering, typing feels sluggish.

!v(https://videos.ctfassets.net/in6v9lxmm5c8/2SxpI8AVCi513LQcEoS4GK/af3ebd5fec2a7bfb2789ade5e5627fc3/what-is-tanstack-redact-1.mp4 466x332)

React introduced concurrent rendering, a mechanism that controls rendering priority so that updates to the input field come first. With concurrent rendering, React can pause rendering midway and handle higher-priority updates first. The [React 18 announcement](https://react.dev/blog/2022/03/29/react-v18#what-is-concurrent-react) explains how this differs from the previous, uninterruptible rendering.

Developers use the following APIs to tell React how to treat updates:

- `startTransition`: Treats the state updates inside the callback as a Transition that doesn't block other updates
- `useDeferredValue`: Defers reflecting a value and attempts to update the UI that uses it later

Let's look at an example. We separate `text`, the value of the input field, from `query`, the value used to filter the list. By applying the input field update as a regular state update and wrapping only the list update in `startTransition`, we can prioritize updates to the input field.

To make the behavior easier to observe, the `ProductList` component that renders the list intentionally runs a heavy calculation for each of its 5,000 product rows before deciding whether to display the row. Because it is wrapped in `memo`, updates that only affect the input field, where the `query` passed to the list hasn't changed, can skip re-rendering the list.

```jsx:src/concurrent.jsx
import { startTransition, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { ProductList } from './ProductList.jsx';

function App() {
  const [text, setText] = useState('');
  const [query, setQuery] = useState('');

  return (
    <main>
      <label>
        商品を検索
        <input
          value={text}
          onChange={(event) => {
            const nextText = event.target.value;
            setText(nextText); // Don't make the input field update a Transition
            startTransition(() => {
              setQuery(nextText); // Make the list update a Transition
            });
          }}
        />
      </label>
      <p>{text !== query ? '一覧を更新しています' : ''}</p>
      {/* The ProductList component intentionally includes a heavy calculation */}
      <ProductList query={query} />
    </main>
  );
}
```

Because the list update triggered by `setQuery(nextText)` is treated as a Transition, if another keystroke arrives while the list is rendering, React can interrupt the list rendering and prioritize the input field update. It then re-renders the list with the latest search term. In the demo below, you can see that typing is not blocked.

!v(https://videos.ctfassets.net/in6v9lxmm5c8/4VRdcRt6DuP43OaRkCGjly/99581b1545f9016363ca43bbd22169f4/what-is-tanstack-redact-2.mp4 466x332)

## Redact's Choice: Synchronous Rendering

Redact aims to provide React's APIs and everyday behavior without concurrent scheduling. Here, scheduling means managing the priority and timing of rendering work. The [size analysis](https://github.com/TanStack/redact/blob/ae632f06d9ca785da78d57bc4d5a88e1f79b6c47/docs/SAVINGS_ANALYSIS.md) for the initial 0.0.1 release describes a strategy of keeping the implementation small by omitting features such as priority-based interruptible rendering.

Later, [PR #24](https://github.com/TanStack/redact/pull/24), merged on September 11, 2026, expanded compatibility with React's APIs, the DOM, and SSR. Even with this change, it explicitly keeps synchronous rendering and continues to omit the behavior of Hooks related to Actions and optimistic updates.

In other words, the design inherits React's component model while narrowing the runtime's responsibilities. Like React, it assumes pure components, but it reduces the work the runtime takes on.

### The Impact of Omitting Interrupt-and-Resume Support

In the earlier search example, React needs its own machinery to interrupt list rendering and prioritize input. It has to manage update priorities, remember how far rendering has progressed, and decide when to yield. When new input arrives, it also needs to restart the in-progress rendering.

React's [rendering implementation](https://github.com/react/react/blob/v19.3.0/packages/react-reconciler/src/ReactFiberWorkLoop.js) includes `workInProgress`, which tracks the component currently being worked on; lanes, which classify things like update priorities; and `shouldYield`, which decides whether to yield. The JavaScript that manages and updates these is also shipped as part of the runtime.

Redact reduces bundle size by omitting or simplifying the following work:

| Work              | What interruptible rendering requires                                                       | Redact's approach                                  |
| ----------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| Choosing updates  | Distinguish input updates from Transition updates and choose which work to do first         | Does not implement React's lane-based priorities   |
| Rendering progress | Split work, decide whether to yield, and resume from where it left off                     | Does not implement yielding in the middle of rendering |
| Deferring values  | Manage showing the old value while attempting a render with the new value                   | `useDeferredValue` returns the given value as is   |

The difference in `useDeferredValue` is obvious when you look at Redact's [Hooks implementation](https://github.com/TanStack/redact/blob/ae632f06d9ca785da78d57bc4d5a88e1f79b6c47/packages/redact/src/dom/dispatcher.ts).

```ts
useDeferredValue<T>(v: T): T {
  return v
}
```

This method returns the value it receives as is. There is none of React's logic for holding on to the previous value and rendering at a different priority.

### Other Ways Redact Stays Small

Beyond synchronous rendering, Redact also simplifies event handling. Its [DOM event handling](https://github.com/TanStack/redact/blob/ae632f06d9ca785da78d57bc4d5a88e1f79b6c47/packages/redact/src/dom/dom.ts) registers handlers on elements with `addEventListener` and adds compatibility properties such as `nativeEvent` to native events, rather than reproducing React's entire synthetic event system.

In addition, when you disable a feature flag, the [Vite plugin](https://github.com/TanStack/redact/blob/ae632f06d9ca785da78d57bc4d5a88e1f79b6c47/packages/redact/src/vite/index.ts) swaps that feature's import target for a simplified implementation. Instead of shipping the real implementation to the browser and turning it off at runtime, the implementation is excluded at build time. The `nano` preset uses this mechanism to disable optional features all at once, letting you opt in to the ones you need.

```ts
import { redact } from "@tanstack/redact/vite";

export default defineConfig({
  plugins: [
    redact({
      preset: "nano",
      features: { context: true },
    }),
  ],
});
```

The [feature flag documentation](https://github.com/TanStack/redact/blob/ae632f06d9ca785da78d57bc4d5a88e1f79b6c47/README.md#feature-flags) states, for example, that disabling `context` means Provider values are not passed down, and disabling `hydration` makes `hydrateRoot` throw an error.

## Comparing the Same Product List in React and Redact

Let's run the same product list with Redact. The code stays the same; simply enabling the Vite plugin replaces the React imports with Redact's implementation.

In Redact, even if you call `startTransition`, the input field update and the list update are treated with the same priority, just as if you hadn't used it. In the demo below, you can see that typing into the input field lags.

!v(https://videos.ctfassets.net/in6v9lxmm5c8/3S7VT6vA943y13qZX2MTcD/94b41736b699a8dcd4e60a35875694ac/what-is-tanstack-redact-3.mp4 466x332)

On the other hand, Redact (with the `full` preset) produces a smaller build. When I built this product list for production with Vite, the gzip size of all generated JavaScript was 69,714 bytes with React and 20,112 bytes with Redact.

## Summary

- TanStack Redact is a lightweight runtime that swaps React's import targets at build time. It keeps the basic way of writing code with components and Hooks and supports React's APIs, but it does not reproduce all of React's behavior.
- Redact uses synchronous rendering and omits concurrent scheduling. `useDeferredValue` and `startTransition` exist as APIs, but they do not provide the same priority control as React.
- Redact's `nano` preset disables optional features all at once and can reduce bundle size even further.

## References

- [Projecting React — Tanner Linsley](https://tannerlinsley.com/posts/projecting-react)
- [Differences to React — Preact](https://preactjs.com/guide/v10/differences-to-react/)
- [TanStack Redact](https://github.com/TanStack/redact)
- [Components and Hooks must be pure – React](https://react.dev/reference/rules/components-and-hooks-must-be-pure)
- [React v18.0](https://react.dev/blog/2022/03/29/react-v18)
- [startTransition – React](https://react.dev/reference/react/startTransition)
- [useDeferredValue – React](https://react.dev/reference/react/useDeferredValue)
