---
id: pma4VRGdlMPNXn1N_Wtnn
title: "Generate Accurate Skeleton Loaders with Boneyard"
slug: "skeleton-loader-boneyard"
about: "Skeleton loaders are placeholders shown before content finishes loading. Boneyard is a framework that removes the manual work of measuring and updating them. This article explains how to implement skeleton loaders easily with Boneyard."
createdAt: "2026-04-04T14:19+09:00"
updatedAt: "2026-04-04T14:19+09:00"
tags: ["react"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3YJGQefGSEYpWVSKrbtvid/e59f92783e295d74888f094965ca6ccd/fruit_grape_muscat_illust_120-768x778.png"
  title: "マスカットのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "According to the article, what makes skeleton loaders better than loading spinners?"
      answers:
        - text: "They are simpler to implement and do not require additional libraries"
          correct: false
          explanation: "Implementation simplicity is not presented as an advantage of skeleton loaders. In fact, the article explains that implementing them manually can be cumbersome."
        - text: "They prevent layout shifts and help users anticipate the structure of the content"
          correct: true
          explanation: "At the beginning of the article, skeleton loaders are described as providing a more concrete layout, which helps prevent layout shifts and lets users anticipate the content structure."
        - text: "They reduce network wait time until data fetching completes"
          correct: false
          explanation: "Skeleton loaders do not affect network speed. They improve visual feedback during loading."
        - text: "They can prefetch content in the background while the skeleton is displayed"
          correct: false
          explanation: "Prefetching is a separate concept from skeleton loaders and is not mentioned in the article."
    - question: "When generating a skeleton loader with Boneyard, what should you do if data fetching from an API takes too long and the skeleton is not generated correctly?"
      answers:
        - text: "Specify a sufficiently long wait time in milliseconds in the `loading` prop"
          correct: false
          explanation: "The `loading` prop controls whether the skeleton is shown. It is not used to specify a wait time."
        - text: "Set a minimum height with the `minHeight` prop on the `<Skeleton>` component"
          correct: false
          explanation: "`minHeight` is used to avoid the issue where the skeleton is hidden when the content is empty. It is not related to waiting for data fetching."
        - text: "Use the `--wait` option to specify a delay, or pass fixed data through the `fixture` prop"
          correct: true
          explanation: "As explained in the article, you can generate an accurate skeleton loader either by specifying a wait time with `--wait` or by providing fixed data for skeleton generation via the `fixture` prop."
        - text: "Restart the development server and run `npx boneyard-js build` again"
          correct: false
          explanation: "Restarting the development server is not a fundamental solution. You need to handle the fact that data fetching itself takes time."
    - question: "After generating skeleton loaders with the Boneyard CLI, what step is required to make them available in the application?"
      answers:
        - text: "Import each generated `.bones.json` file individually"
          correct: false
          explanation: "You do not need to import them individually. Importing `registry.js` is enough to register all generated skeleton loaders at once."
        - text: "Import the generated `src/bones/registry.js` in the application's entry point"
          correct: true
          explanation: "As the article explains, importing `src/bones/registry.js` in an entry point such as `app/layout.tsx` or `src/App.tsx` makes the generated skeleton loaders available."
        - text: "List and register skeleton names manually in a Boneyard configuration file"
          correct: false
          explanation: "No manual registration in such a configuration file is required. The CLI generates `registry.js` automatically."
        - text: "Pass the path to the JSON file through a `src` prop on the `<Skeleton>` component"
          correct: false
          explanation: "The `<Skeleton>` component does not have a `src` prop. The skeleton definitions are linked automatically by importing `registry.js`."

published: true
---

Skeleton loaders are placeholders shown before content finishes loading, giving users a visual cue that the page is still loading. Compared with a simple loading spinner, skeleton loaders have advantages such as preventing layout shifts by presenting a more concrete layout and helping users anticipate the structure of the content.

That said, implementing skeleton loaders is more work than it looks. To prevent layout shifts, you need a skeleton loader that matches the layout of the real content, which means manually measuring the height of the actual DOM and setting the skeleton loader's height accordingly. Since the skeleton also needs to be updated whenever the real UI changes, the maintenance cost can become quite high.

Boneyard is a framework designed to remove the manual work of measuring and updating skeleton loaders. With Boneyard, you can automatically generate pixel-perfect skeleton loaders simply by wrapping your real content. Boneyard watches the layout of the rendered content and updates the skeleton loader as needed, so it can adapt flexibly when the UI changes.

In this article, I'll explain how to implement skeleton loaders easily with Boneyard.

## How to Use Boneyard

First, install Boneyard in your project.

```bash
npm install boneyard-js
```

To display a skeleton loader with Boneyard, wrap the component that fetches data with the `Skeleton` component. When the `loading` prop of `<Skeleton>` is `true`, the skeleton loader is displayed. When it becomes `false`, the actual content is shown instead.

```tsx:src/components/Activity.tsx
import { Skeleton } from 'boneyard-js/react'
import { activityData, type Activity } from '../data/dashboard'
// Data fetching hook with an artificial delay for the demo
import { useDelayedQuery } from '../hooks/useDelayedQuery'

export function ActivityPanel() {
  const query = useDelayedQuery(['activity'], activityData, 1800)

  return (
    <article className="card panel-card">
      <SectionTitle />
      <Skeleton
        name="activity"
        loading={query.status !== 'success'}
      >
        {query.data && <ActivityContent data={query.data} />}
      </Skeleton>
    </article>
  )
}
```

Wrapping content with `<Skeleton>` alone is not enough for the skeleton loader to appear. To actually display it, you need to use the Boneyard CLI to generate the skeleton loader from the rendered content.

Before running the CLI, keep the following points in mind.

- You need to provide a unique name in the `name` prop of the `<Skeleton>` component. This value becomes the filename of the generated `json` file.
- You need to start the project's development server before running the command.

```bash
npx boneyard-js build
```

When you run this command, it identifies the URL of your development server, uses Playwright to render the actual content, and generates the skeleton loader from it. If Playwright is not installed, it will be installed automatically.

If your content is fetched from an API and rendering takes time, the skeleton loader may not be generated correctly. In that case, you can either specify a wait time with the `--wait` option or provide fixed data for skeleton generation through the `fixture` prop of the `<Skeleton>` component.

```tsx
<Skeleton
  name="activity"
  loading={query.status !== "success"}
  fixture={
    <ActivityContent
      data={[
        {
          id: 1,
          title: "New user registered",
          timestamp: "2026-04-04T12:00:00Z",
        },
        {
          id: 2,
          title: "Server restarted",
          timestamp: "2026-04-04T11:30:00Z",
        },
      ]}
    />
  }
>
  {query.data && <ActivityContent data={query.data} />}
</Skeleton>
```

By default, skeleton loaders are generated for three viewport widths, 375, 768, and 1280px, and saved as `json` files in the `src/bones` directory. You can change the breakpoints with the `--breakpoints` option.

```sh
src/bones
├── activity.bones.json
├── metric-churn.bones.json
├── metric-mrr.bones.json
├── metric-uptime.bones.json
├── registry.js
└── team.bones.json
```

The generated JSON files define different skeleton loader layouts for each breakpoint.

```json:src/bones/metric-mrr.bones.json
{
  "breakpoints": {
    "375": {
      "name": "metric-mrr",
      "viewportWidth": 309,
      "width": 309,
      "height": 136,
      "bones": [
        {
          "x": 0,
          "y": 32,
          "w": 43.5882,
          "h": 34,
          "r": 8
        },
        {
          "x": 43.5882,
          "y": 39,
          "w": 23.7611,
          "h": 33,
          "r": 999
        },
        {
          "x": 0,
          "y": 88,
          "w": 100,
          "h": 48,
          "r": 8
        }
      ]
    },
    "768": {
      ...
    },
    "1280": {
      ...
    }
  }
}
```

Finally, import `src/bones/registry.js` in your application's entry point, such as `app/layout.tsx` or `src/App.tsx`, to make the generated skeleton loaders available. `registry.js` is an automatically generated side-effect import file created by the CLI. It loads each `.bones.json` file and registers all skeleton definitions at once via the `registerBones` function.

```js:src/bones/registry.js
"use client"
// Auto-generated by `npx boneyard-js build` — do not edit
import { registerBones } from 'boneyard-js/react'

import _metric_mrr from './metric-mrr.bones.json'
import _activity from './activity.bones.json'
// ...

registerBones({
  "metric-mrr": _metric_mrr,
  "activity": _activity,
  // ...
})
```

By importing this file in the entry point, all skeletons are registered automatically.

```tsx:src/App.tsx
import "../bones/registry";
```

Once you run the code in this state, the automatically generated skeleton loader appears before the data finishes loading. You can see that layout shifts are indeed kept to a minimum.

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/39Z0N3XwvO1OVIn1rbO1v8/9db9089e22f35a42f93ea051081c8b89/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2026-04-04_15.54.38.mov" controls></video>

:::note
When I actually tried it, I ran into an issue: because no display area was reserved for the skeleton loader, if `data` was `undefined` and the child component rendered nothing, the wrapper element's height became 0, which meant the skeleton loader was not displayed either. You can avoid this issue by specifying a minimum height with the `minHeight` prop of the `<Skeleton>` component.
:::

## How Boneyard Works

In Boneyard, each individual rectangular block that makes up a skeleton loader is called a bone. A text line, avatar image, or button each corresponds to a single bone, with information such as position (`x`, `y`), size (`w`, `h`), and border radius (`r`). Combining these bones forms the full layout of the skeleton loader.

When you run `npx boneyard-js build`, Boneyard performs the following processing internally.

First, it opens the application page with Playwright and recursively traverses the DOM tree starting from the element wrapped in `<Skeleton>`. Elements with `display: none`, `visibility: hidden`, or `opacity: 0` are skipped.

During traversal, it determines whether each element is a leaf node. In addition to elements without children, media elements (`img`, `svg`, `video`, `canvas`), form elements (`input`, `button`, and so on), and certain block elements (`p`, `h1` through `h6`, `li`, `tr`) are treated as leaves.

For leaf elements, Boneyard gets the bounding box with `getBoundingClientRect()` and records the position relative to the root element. Horizontal position and width are stored as percentages relative to the root width, while vertical values are stored in pixels, which allows the generated skeleton to work with responsive layouts. `border-radius` is also detected automatically, so circular or pill-shaped elements get the appropriate rounding.

Even for non-leaf container elements, if they have a background color, background image, or rounded border, they are emitted as container bones. This makes it possible to represent layered skeletons such as a text bone sitting on top of a card background.

In other words, Boneyard generates accurate skeletons by reading the pixel coordinates of the actual DOM rendered in the browser, rather than relying on heuristics or trying to recreate the layout engine.

The generated JSON file and the `<Skeleton>` component are linked through the `name` prop. For example, if you specify `<Skeleton name="activity">`, then `activity.bones.json` becomes the corresponding skeleton definition. Since the `registerBones` function in `registry.js` maps each JSON file using that name as the key, the `<Skeleton>` component can look up the matching bone data and render the skeleton whenever `loading` is `true`.

For the actual implementation, see https://github.com/0xGF/boneyard/blob/main/packages/boneyard/src/extract.ts and https://github.com/0xGF/boneyard/blob/main/packages/boneyard/src/react.tsx.

## Summary

- Boneyard is a framework that automatically generates pixel-perfect skeleton loaders simply by wrapping real content.
- Wrap the target component with `<Skeleton>` and run `npx boneyard-js build` to generate the skeleton loader definition files.
- The generated files contain layouts for each breakpoint (375, 768, and 1280px), and you can update them simply by running the command again after UI changes.
- If data fetching takes time, you can use the `--wait` option or the `fixture` prop to generate an accurate skeleton loader.
- If the skeleton is hidden when the content is empty, you can avoid that by setting a minimum height with the `minHeight` prop.

## References

- [boneyard - skeleton screens for your UI](https://boneyard.vercel.app/features)
