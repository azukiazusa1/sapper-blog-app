---
id: i5_SWkQNjUWSl8fuQJ5Ny
title: "Rendering Browser-Only Components with React's browser() API"
slug: "react-browser-api"
about: "In React apps with SSR, reading localStorage has meant managing the first render with useEffect and state. The browser() API lets you express browser-only rendering with use(browser()) and hand the pending UI to Suspense. Here is how it works."
createdAt: "2026-09-08T20:05+09:00"
updatedAt: "2026-09-08T20:05+09:00"
tags: ["React"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4BrxUmBFr509uTsABXJm7N/436750624d87f22782cd82e5e2f46b2d/hamburger_fried-potato_illust_3406.png"
  title: "ハンバーガーとフライドポテトのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "When reading localStorage under SSR, which problem does a typeof window check alone fail to prevent?"
      answers:
        - text: "useEffect running on the server"
          correct: false
          explanation: "useEffect never runs on the server. The problem is that the server and the browser may produce different first renders."
        - text: "The server and browser first renders not matching"
          correct: true
          explanation: "Rendering an empty string on the server and the saved content in the browser avoids the reference error but can still cause a hydration mismatch."
        - text: "Being unable to read the saved content in the browser"
          correct: false
          explanation: "The browser branch can still read the saved content. The problem is that it differs from what the server rendered first."
        - text: "The saved text being sent to the server automatically"
          correct: false
          explanation: "Nothing in this branch sends the saved content anywhere, and the server cannot read the browser's storage either."
    - question: "What happens during SSR when a component with a parent Suspense boundary calls use(browser())?"
      answers:
        - text: "The server waits until the saved content arrives from the browser"
          correct: false
          explanation: "The server does not wait for the browser's storage. It hands rendering of that part over to the browser."
        - text: "use() returns undefined and rendering continues"
          correct: false
          explanation: "Returning undefined and continuing into the following code is what happens in the browser."
        - text: "Only the Effects of the calling component are skipped"
          correct: false
          explanation: "It is not just Effects. Server rendering stops at that point for everything below it."
        - text: "Rendering stops and the closest Suspense fallback is left in place"
          correct: true
          explanation: "During SSR the fallback of the parent Suspense boundary is left in the HTML, and the component's content is rendered in the browser."
    - question: "When browser() successfully leaves a Suspense fallback in place, which callback is notified?"
      answers:
        - text: "onBrowserBailout on the server renderer"
          correct: true
          explanation: "onBrowserBailout receives an Error whose cause is the reason, along with the component stack."
        - text: "onError on the server renderer"
          correct: false
          explanation: "onError is not called when the intentional bailout succeeds in leaving a fallback. That case is distinct from an SSR failure with no Suspense boundary."
        - text: "onRecoverableError on hydrateRoot"
          correct: false
          explanation: "An intentional bailout via browser() does not trigger onRecoverableError in the browser either."
        - text: "onShellReady on the server renderer"
          correct: false
          explanation: "onShellReady signals that the initial HTML is ready to send. It is not where the reason for deferring to the browser is reported."
published: true
---

Imagine saving a form draft to `localStorage` so it can be restored when the user reopens the page. In a browser-only app, you can safely read the saved content when the component initializes. With SSR (server-side rendering), however, the server cannot read the user's `localStorage`, so you have to work out whether the component is running on the server or in the browser and control when the saved content is read.

The traditional approach reads the saved content inside `useEffect` and updates state to switch what is displayed. It relies on the fact that `useEffect` does not run on the server and only runs after the component has mounted in the browser.

```jsx
function SavedDraft() {
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    setDraft(localStorage.getItem("draft") ?? "");
  }, []);

  if (draft === null) return <p>Loading draft...</p>;
  return <p>Saved draft: {draft}</p>;
}
```

But this approach requires a `null` state to represent "not read yet" so that the first render matches, and it triggers an extra re-render from the Effect. On top of that, the pending UI has to be managed inside the component itself.

React DOM's new [`browser()` API](https://react.dev/reference/react-dom/browser) is designed to hand rendering of a component over to the browser. Writing `use(browser())` stops the component from rendering on the server and lets `<Suspense>` take care of the pending UI.

This article walks through the basics of `browser()`.

!> As of September 6, 2026, `browser()` is only available in the Canary and Experimental channels. It is not available in the stable React 19.2 release. The examples in this article were verified with `react` and `react-dom` at `19.3.0-canary-8425b691-20260904`. The API and its behavior may change.

## The traditional approach: reading `localStorage` in `useEffect`

First, let's look at why reading `localStorage` becomes a problem under SSR. The following code reads the saved content inside the initializer function that determines the initial `useState` value.

```jsx
import { useState } from "react";

function SavedDraft() {
  const [draft] = useState(() => localStorage.getItem("draft") ?? "");

  return <p>Saved draft: {draft}</p>;
}
```

The problem here is that this component may run both on the server and in the browser. The code above throws a reference error in a server environment that does not provide `localStorage`. And even if the server environment happened to expose an API with the same name, it would not hold the user's saved content, so the first render in the browser would differ from the first render on the server, causing a hydration mismatch.

### Aligning the first render before reading the saved content

SSR includes a step called "hydration" that hands the HTML produced on the server over to React in the browser. Because React attaches event handling and other behavior to the existing HTML, the first render must match between the server and the browser. The [official `hydrateRoot` documentation](https://react.dev/reference/react-dom/client/hydrateRoot#caveats) also treats mismatches as bugs that should be fixed.

To satisfy that requirement, the common approach is to render shared content first and read the saved content after hydration.

```jsx
import { useEffect, useState } from "react";

function SavedDraft() {
  // null means "not read yet", an empty string means "nothing saved"
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    setDraft(localStorage.getItem("draft") ?? "");
  }, []);

  if (draft === null) {
    return <p>Loading draft...</p>;
  }

  return <p>Saved draft: {draft}</p>;
}
```

`useEffect` does not run on the server, so the display changes in the following order.

1. On the server, `draft` stays `null`, so "Loading draft..." is emitted.
2. On the browser's first render, `draft` is also `null`, producing the same output as the server.
3. After hydration, the Effect runs and updates state with the content from `localStorage`.
4. The component re-renders with the updated state and shows the saved content.

React's official documentation also presents this pattern of switching to a "mounted" state inside an Effect as the way to [display different content on the server and the client](https://react.dev/reference/react/useEffect#displaying-different-content-on-the-server-and-the-client).

### Drawbacks of the traditional approach

This implementation is an effective way to align the first render, but showing browser-only content means managing several things yourself.

- You need a state that represents "not read yet": this example uses `null` to distinguish it from `""`, which means there is no saved data.
- The Effect causes an extra render: after the browser settles on the first output, the Effect runs to read the saved content and the state update switches the display, producing a second render that is not really necessary.
- The pending UI is managed inside the component: on top of displaying the saved content, you need the JSX to return before the read and the branch that selects it.

Extracting this into a shared Hook or wrapper reduces the duplication, but you are still waiting for mount, updating state, and rendering again.

You also need to be careful when you branch solely on `typeof window` to avoid the reference error on the server, as in the code below. Branching on `typeof window` has long been a common workaround for reference errors, taking advantage of the fact that the server has no `window` object.

```jsx
import { useState } from "react";

function SavedDraft() {
  const [draft] = useState(() =>
    typeof window === "undefined"
      ? ""
      : localStorage.getItem("draft") ?? "",
  );

  return <p>Saved draft: {draft}</p>;
}
```

When the server renders an empty string and the browser renders the saved text, the first renders do not match. Branching on `typeof window` prevents the reference error on the server, but it does not prevent a hydration mismatch. [React lists this branch as a common cause of mismatches](https://react.dev/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html).

## The basics of the `browser()` API

`browser()` is imported from `react-dom`. Passing its return value to React's [`use()`](https://react.dev/reference/react/use) hands rendering from that point onward over to the browser. `use()` is the API for reading resources such as Promises and context during rendering.

```jsx
import { Suspense, use } from "react";
import { browser } from "react-dom";

function BrowserOnly() {
  use(browser());

  return <p>This content is rendered in the browser.</p>;
}

export default function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <BrowserOnly />
    </Suspense>
  );
}
```

`<Suspense>` is the component that displays its `fallback` when a child's rendering is suspended. When `use(browser())` is processed on the server, React leaves the fallback of the closest parent Suspense boundary in its place. In the browser it returns `undefined`, so nothing suspends and rendering continues as usual.


:::warning
Without a `<Suspense>` boundary, calling `use(browser())` on the server makes React throw and the server render fails. Whenever you intend to defer rendering to the browser, you must wrap the component in `<Suspense>`.
:::

### Why isn't it a `useBrowser()` Hook?

The [PR that introduced it in July 2026](https://github.com/react/react/pull/37143) also considered making it a regular Hook. Hooks, however, must be called in a consistent order, so they cannot be called conditionally. `use()` can be called conditionally inside a component or a Hook, which means you can decide whether to continue SSR based on props.

Consider a case where you use the draft from the server if there is one, and otherwise restore it from `localStorage` in the browser. In the code below, `use(browser())` is called only when `initialDraft` was not provided.

```jsx
import { Suspense, use, useState } from "react";
import { browser } from "react-dom";

// initialDraft is expected to come from a database on the server
function DraftEditor({ initialDraft }) {
  if (initialDraft === undefined) {
    use(browser("No initial data, restoring from localStorage."));
  }

  const [draft, setDraft] = useState(() =>
    initialDraft !== undefined
      ? initialDraft
      : localStorage.getItem("draft") ?? "",
  );

  return (
    <label>
      Draft
      <textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
      />
    </label>
  );
}
```

The PR also explains the concern with an alternative where `browser()` itself throws without `use()`: it could be called from anywhere, and a `catch` somewhere along the way could unintentionally swallow it.

Combining `browser()` with `use()` is therefore deliberate: it allows conditional usage while keeping the call in a place that is tied to rendering.

## Rendering a component that uses `localStorage`

Now let's build the input from the introduction: a field you can edit and that restores its content after a reload. This assumes a React SSR environment where you can use JSX. The React and React DOM versions used for verification are shown below.

:::warning
In apps that use React Server Components, `use(browser())` must be called from a Client Component. `browser()` is not provided in the `react-server` environment, so it cannot be called from a Server Component.
:::

```bash
npm install --save-exact react@19.3.0-canary-8425b691-20260904 react-dom@19.3.0-canary-8425b691-20260904
```

In the code below, `use(browser())` is called before `useState` reads the saved content. The first argument to `browser()` accepts a string or a function explaining why the content needs to be rendered in the browser.

```jsx:App.jsx
import { Suspense, use, useState } from "react";
import { browser } from "react-dom";

export function SavedDraft() {
  use(browser("The draft is stored in localStorage."));
  const [draft, setDraft] = useState(
    () => localStorage.getItem("draft") ?? "",
  );

  function handleChange(event) {
    const nextDraft = event.target.value;
    setDraft(nextDraft);
    localStorage.setItem("draft", nextDraft);
  }

  return (
    <label>
      Draft
      <textarea value={draft} onChange={handleChange} rows={4} />
    </label>
  );
}

export default function App() {
  return (
    <main>
      <h1>Draft Memo</h1>
      <Suspense fallback={<p>Loading draft...</p>}>
        <SavedDraft />
      </Suspense>
    </main>
  );
}
```

On the server, rendering stops at `use(browser(...))`, so the `localStorage.getItem()` call that follows never runs, and the content of the `<Suspense>` fallback is displayed instead.

In the browser, rendering continues past that point and the value from `localStorage` becomes the initial state. The `null` placeholder and the Effect-driven state update from the earlier example are both gone. The fallback is now handled by `<Suspense>` as well, which moves the responsibility for choosing what to display up to the caller, in line with how React is designed.

## Observing the switch with `onBrowserBailout`

One traditional way to avoid SSR was to throw deliberately on the server so that the Suspense fallback is returned and the content is rendered again in the browser.

```jsx
import { Suspense, useState } from "react";

function SavedDraft() {
  if (typeof window === "undefined") {
    throw new Error("The draft is rendered in the browser only.");
  }

  const [draft] = useState(
    () => localStorage.getItem("draft") ?? "",
  );

  return <p>Saved draft: {draft}</p>;
}

export default function App() {
  return (
    <main>
      <h1>Draft Memo</h1>
      <Suspense fallback={<p>Loading draft...</p>}>
        <SavedDraft />
      </Suspense>
    </main>
  );
}
```

The drawback of this technique is that an intentional interruption is still reported as an ordinary error.

An interruption caused by `use(browser())` is expressed in a form React can recognize, so it is distinguished from ordinary errors. Neither the server renderer's `onError` nor the browser's `hydrateRoot` `onRecoverableError` is called. Instead, specifying [`onBrowserBailout`](https://github.com/react/react/pull/37193) on the server lets you observe that rendering was interrupted in order to render in the browser only.

```jsx
import { renderToPipeableStream } from "react-dom/server";
import App from "./App.jsx";

export function renderApp(response) {
  const { pipe } = renderToPipeableStream(<App />, {
    onShellReady() {
      response.setHeader("Content-Type", "text/html; charset=utf-8");
      pipe(response);
    },
    // Notified when rendering is interrupted to render in the browser only
    onBrowserBailout(error, errorInfo) {
      // error.cause holds the string, or the function's return value,
      // passed as the first argument to `browser()`
      console.log(error.cause);
      console.log(errorInfo.componentStack);
    },
  });
}
```

:::warning
`onBrowserBailout` is called only when a `<Suspense>` boundary exists and rendering could be handed over to the browser. When there is no `<Suspense>` boundary and the server render fails, the failure is reported through `onError` rather than `onBrowserBailout`, and the reason passed to `browser()` is preserved as that error's `cause`.
:::

`onShellReady` signals that the initial HTML is ready to send. `onBrowserBailout` receives an Error whose `cause` is the reason, along with the component stack of where it happened. With the sample above, it received "The draft is stored in localStorage." and a stack containing `SavedDraft`.

```
The draft is stored in localStorage.

    at SavedDraft (/dist/App.js:6:3)
    at Suspense (<anonymous>)
    at main (<anonymous>)
    at App (<anonymous>)
    at div (<anonymous>)
    at body (<anonymous>)
    at html (<anonymous>)
```

## Summary

- The traditional Effect-based approach had to align the first render between SSR and the browser, then read the saved content and re-render via a state update
- Branching on `typeof window` alone does not prevent a hydration mismatch when the server and browser first renders differ
- `use(browser())` interrupts rendering on the server and leaves the fallback of the closest Suspense boundary in place; in the browser it runs the code that follows
- Intentional switches to browser rendering can be observed with `onBrowserBailout`

## References

- [browser – React](https://react.dev/reference/react-dom/browser)
- [use – React](https://react.dev/reference/react/use)
- [useEffect: Displaying different content on the server and the client – React](https://react.dev/reference/react/useEffect#displaying-different-content-on-the-server-and-the-client)
- [hydrateRoot – React](https://react.dev/reference/react-dom/client/hydrateRoot)
- [Add ReactDOM browser() API #37143](https://github.com/react/react/pull/37143)
- [Add onBrowserBailout Fizz option #37193](https://github.com/react/react/pull/37193)
