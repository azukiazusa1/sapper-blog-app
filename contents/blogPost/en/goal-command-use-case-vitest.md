---
id: VZPnDNw_g6KuDzl-y8u2l
title: "A `/goal` Command Use Case: How I Sped Up Vitest by 6x"
slug: "goal-command-use-case-vitest"
about: "Enabling Vitest's `isolate: false` slashed our test execution time but required large-scale code changes. Claude Code's `/goal` command lets the agent autonomously work toward the final goal. This article shares the experience."
createdAt: "2026-06-06T10:43+09:00"
updatedAt: "2026-06-06T10:43+09:00"
tags: ["Vitest", "claude-code"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/6D0dbF2QzIgTnnPyageVVM/aa99fbdb3a355db004e02a7511482426/fruit_gold-kiwi_11118-768x542.png"
  title: "ゴールドキウイのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "According to the article, why does setting `isolate: false` in Vitest significantly reduce the Import time?"
      answers:
        - text: "Because the compilation of TypeScript and JSX is skipped"
          correct: false
          explanation: "Compilation falls under the Transform phase. What `isolate: false` reduces is the Import phase."
        - text: "Because modules evaluated once are cached within the worker and are not re-evaluated for each test file"
          correct: true
          explanation: "As explained in the article, with `isolate: false` module evaluation is shared within a worker, and modules that have been evaluated once are reused — which cuts Import time."
        - text: "Because each test file runs in its own independent process, increasing parallelism"
          correct: false
          explanation: "Running each test file in a separate process is the default `isolate: true` behavior. `isolate: false` does the opposite — it shares modules within a worker."
        - text: "Because it automatically tree-shakes dependent modules to reduce the amount of code loaded"
          correct: false
          explanation: "The article does not mention tree shaking. The reduction comes from sharing cached module evaluation results."
    - question: "According to the article, how does the `/goal` command work?"
      answers:
        - text: "It evaluates the goal condition at session start, and if it judges that the goal is unattainable, it immediately ends the session"
          correct: false
          explanation: "Evaluation happens at session end, not session start. And `/goal` does not end a session immediately on the grounds that the goal seems unattainable."
        - text: "It hooks the moment Claude Code is about to end the session, and a lightweight model evaluates the goal condition and automatically continues if the goal has not been met"
          correct: true
          explanation: "As explained in the article, `/goal` hooks the end-of-session moment, lets a lightweight model such as Haiku evaluate the goal, and continues automatically when the goal is not yet met."
        - text: "It requires the user to explicitly tell it to \"continue\" each turn, looping until the goal is achieved"
          correct: false
          explanation: "A core trait of `/goal` is that it keeps running toward the goal with no additional prompts — no per-turn instruction is required."
        - text: "It runs a fixed number of loops without evaluating the goal condition, and asks the user for a completion check at the end"
          correct: false
          explanation: "It does not run a fixed-count loop. Behavior is governed by evaluating whether the goal has been met."
    - question: "According to the article, which of the following is a tip for using the `/goal` command effectively?"
      answers:
        - text: "Keep the goal condition as abstract as possible to give Claude Code maximum interpretive freedom"
          correct: false
          explanation: "The article suggests the opposite: vague conditions make goal evaluation ambiguous and should be avoided."
        - text: "Specify the goal condition in a form that can be evaluated quantitatively"
          correct: true
          explanation: "As explained in the article, to avoid ambiguous goal judgment, the tip is to phrase the goal so it can be evaluated with concrete numbers or pass/fail criteria."
        - text: "Rewrite the goal condition for every session, gradually raising its difficulty"
          correct: false
          explanation: "The article does not recommend rewriting the condition per session. You keep a single condition until the goal is achieved."
        - text: "Set a hard cap on token consumption to shorten total runtime"
          correct: false
          explanation: "The article notes high token consumption as a caveat, but does not present setting a cap as a tip."
published: true
---
A certain project had a very long frontend test execution time, which was significantly hurting development productivity. Long test times mean longer CI waits and slower feedback loops between writing code and seeing results — a particularly serious bottleneck when you're letting an AI agent write the code. To describe the project in broad strokes: the frontend is built with React, and tests are written using Vitest and Testing Library. There were roughly 10,000 tests in total, and running them all took more than 12 minutes.

In this effort, enabling Vitest's `isolate: false` option cut test execution time from 12 minutes to 2 minutes — a roughly 6x speedup. Setting up `isolate: false` required large-scale code changes, and most of that work was done with Claude Code. Normally, however, handing a large-scale task to Claude Code and expecting it to be completed end-to-end is difficult. You typically need a human to step in, break the task into small chunks, and drive it forward incrementally. This time, though, by leveraging Claude Code's `/goal` command, I was able to have it autonomously decide and execute the steps needed to reach the final goal.

In this article, I'll walk through how I used Vitest's `isolate: false` option to dramatically shorten test execution time, and share my experience using Claude Code's `/goal` command to autonomously drive a large-scale task to completion.

## Why does Vitest get faster with `isolate: false`?

When you're improving performance, the single most important thing is to measure and accurately identify where the bottleneck lies. Trying to optimize parts that aren't actually the bottleneck contributes almost nothing to overall performance and tends to waste time and effort. Vitest reports the following time metrics when you run tests. Based on these metrics, you can have Claude Code analyze where the bottleneck is and pinpoint the most effective improvement. The snippet below is an example of an actual Vitest run.

```sh
✓ src/index.test.ts (12)
...

Test Files  1500 passed (1500)
     Tests  10000 passed (10000)
  Start at  11:42:05
  Duration  720s (transform 60s, setup 123s, import 600s, tests 250s, environment 510s)
```

- Transform: time spent transforming source code — compiling TypeScript or JSX into an executable form.
- Setup: time spent executing files specified in `setupFiles`. Files specified in `setupFiles` run before each test file and are typically used for project-wide setup, defining global variables, and so on.
- Import: time spent importing test files — loading and initializing the modules each test file depends on.
- Tests: time spent actually running the tests.
- Environment: time spent setting up the test environment (e.g. `jsdom`).

Looking at the results above, you can see that Import at `600s` is far and away the largest. Next is Environment at `510s` — the cost of setting up the `jsdom` test environment, which is not a number you can ignore either. On the other hand, the actual test execution itself is only 250s, which is fairly short, so trying to optimize that portion isn't going to move the needle much. The main reason Import takes so long is typically that the module dependency graph is very large and complex. In a React app, just importing a single component under test pulls in React/ReactDOM, UI libraries, shared modules, and more in a cascade. Heavy use of barrel files (files like `index.ts` that re-export multiple modules) also tends to make the dependency graph more tangled.

In Vitest's default behavior (`isolate: true`), each test file runs in its own independent process. Running each test file in an independent process is desirable from the standpoint of test isolation, but it also means that every test file pays the cost of importing its dependent modules and setting up the test environment over and over again. This is the main reason the Import and Environment times become so large.

By contrast, setting `isolate: false` makes module evaluation shared within a worker. Modules evaluated once are cached and reused within the same worker without re-evaluation, which dramatically reduces Import time. Likewise, the test environment (`jsdom`) setup is also shared within the worker, so the Environment time is reduced as well. In practice, after I set `isolate: false`, Import dropped to `50s`, and the test process overall saw a substantial performance improvement. You can enable `isolate: false` in Vitest's config file (`vitest.config.ts`) like so:

```ts:vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    isolate: false,
  },
});
```

You can also specify it via the CLI:

```bash
vitest run --no-isolate
```

You can also apply `isolate: false` only to specific test files. In the example below, only test files matching the pattern `**.non-isolated.test.ts` use `isolate: false`, while everything else keeps the default `isolate: true`.

```ts:vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'Isolated',
          isolate: true,
          exclude: ['**.non-isolated.test.ts'],
        },
      },
      {
        test: {
          name: 'Non-isolated',
          isolate: false,
          include: ['**.non-isolated.test.ts'],
        },
      },
    ],
  },
})
```

## Things to watch out for when setting `isolate: false`

`isolate: false` gives you a big performance win, but there are trade-offs. When you set `isolate: false`, test files run in the same process, which means state ends up being shared between test files. As a result, changes made by one test file can affect another. For example, defining global variables in one test file or leaving leaks behind (forgotten cleanup of mocks, timers, etc.) can interfere with the execution of other test files. Test IDs that are assigned in a randomized manner are also shared within the same process, so tests can fail depending on the execution order.

In my own project, I ran into the following problems:

- `localStorage` state was not being cleaned up at the end of each test, causing other tests that depend on `localStorage` values to fail.
- Testing Library's DOM cleanup (`cleanup()`) wasn't being performed, causing snapshot tests to fail. `@testing-library/react` registers `afterEach(() => cleanup())` at the top level when imported, but with `isolate: false` the module is cached within the worker, so `afterEach` ends up being registered only in the first test file that loads it (see also [vitest-dev/vitest#1430](https://github.com/vitest-dev/vitest/issues/1430)). As a result, automatic cleanup does not run in any test file loaded after that.
- For globals defined on `globalThis` (such as `ResizeObserver`, which is not provided by `jsdom`) that we were mocking, the mock state ended up being shared across test files, and tests would fail depending on execution order.
- IDs assigned by libraries such as `react-aria` are kept in module-level counters and continue to increment across tests, so snapshot tests would fail depending on test execution order.
- A problem in the application code itself: there was code that asynchronously updated state after a component had unmounted, which triggered console warnings that in turn caused tests to fail.

The consistent solution is to assume up front that state is shared between test files, and to perform appropriate cleanup in each test file. By centralizing teardown logic in a file specified in `setupFiles`, you can apply the same cleanup across every test file and avoid the risk of forgetting cleanup steps.

```ts:setupFiles.ts
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  // Testing Library cleanup
  cleanup();
  // localStorage cleanup
  localStorage.clear();
  // other global state and mock cleanup
  // ...
});
```

For the issue of generated IDs, the answer is to normalize the IDs when running snapshot tests. With Vitest, you can pass the path of a serializer file to the `test.snapshotSerializers` option to customize snapshot output. The example below defines a serializer that normalizes randomly-assigned IDs in snapshot output.

```ts:snapshotSerializer.ts
import type { SnapshotSerializer } from 'vitest';

const idNormalizer: SnapshotSerializer = {
  test(value) {
    // Match values containing randomly-assigned IDs
    return typeof value === 'string' && /id-\d+/.test(value);
  },
  serialize(value) {
    // Normalize the randomly-assigned IDs in the output
    return `"${(value as string).replace(/id-\d+/g, 'id-<normalized>')}"`;
  },
};

export default idNormalizer;
```

By pointing `test.snapshotSerializers` in `vitest.config.ts` at the serializer file, you can apply it to all snapshot tests.

```ts:vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    snapshotSerializers: ['./snapshotSerializer.ts'],
  },
});
```

The fixes themselves look simple enough, but pinpointing the problem and arriving at the right solution required repeated runs and analysis. A single test run produced close to 100 failures, and the set of failing tests changed randomly every time. I let Claude Code take on this large-scale task, but at first it couldn't quite carry it through to completion. You've probably seen this yourself: when you give Claude Code something like "set `isolate: false`, fix the failing tests, and get every test passing," it tends to stop partway and ask for direction, like this:

> Getting every test to pass isn't going to fit within "fix a few dozen individually" — the scope is bigger than expected. How would you like to proceed?

Once it stops to confirm direction like this, the proposals Claude Code offers tend to be ones aimed at just closing out the task:

- Relax the test conditions (e.g. comment out failing tests) so that the tests at least pass.
- Leave the failing tests as they are and mark the task complete for now.
- Setting `isolate: false` isn't realistically achievable, so improve performance through some other means (such as `pool: 'vmThreads'`).

I suspect Claude Code itself is designed — via its system prompt — to avoid making big, high-risk changes in one swing and instead agree on direction step by step and err on the side of safety. And if we assume the model is rewarded for completing tasks per se, it makes sense that it ends up proposing "complete the task by ignoring the failing tests." But the actual end goal is "set `isolate: false` with every test passing," and I've already accepted that this is going to take a long time. Being asked for confirmation each time, on the grounds that the task is going to take a while, is not efficient — I'm only going to give the same instruction again until the goal is reached.

When this happened, I tried changing the instruction to "fix every failure, one by one, no matter how long it takes," but the same direction-checking kept happening. The ideal behavior is: don't ask the user for confirmation until the goal is met, and autonomously decide and execute the steps needed. This kind of problem can be addressed with the `/goal` command. Let's look at how `/goal` actually works.

## Driving large-scale tasks to completion with the `/goal` command

`/goal` is a command that, once you specify a goal condition, keeps running until that condition is met — without any additional prompts. It hooks the moment Claude Code is about to end a session: a lightweight model (something like Haiku) evaluates whether the goal condition has been met. If the goal is not yet met, the session does not end and execution continues automatically; only when the model judges that the goal has been met does the session actually end. This prevents Claude Code from cheating its way to "task complete" without having actually finished the work, and from ending the session just because it wants the user to confirm something.

You specify the goal condition for `/goal` in natural language, like so:

```sh
/goal Set Vitest's `isolate: false` option and get all tests passing.
```

The trick to using `/goal` well is to specify the goal condition in a form that can be evaluated quantitatively. For example, "get all tests passing" can be judged as met by running Vitest and confirming that the number of failing tests is zero. On the other hand, a goal like "shorten test execution time" is ambiguous — how much shorter counts as met? Phrasing it instead as something like "shorten Vitest execution time to under 6 minutes" makes a big difference. Always ask yourself "can I express this goal as a number?" Also note that because `/goal` keeps running until the goal is reached, it can consume a lot of tokens. For one-off fixes, sending a regular prompt may be more efficient.

In my actual session, I went through the following loop and ultimately reached the goal. The time it took to get there was around 10 hours.

1. Use `--sequence.shuffle` to randomize the order in which test files run, and try several different seeds with `--seed=N` to surface tests that fail nondeterministically.
2. Categorize the failures (missing cleanup, generated-ID problems, application-code problems, and so on).
3. Spawn a subagent per category and have them fix things in parallel.
4. Once the fixes are in, run the tests again with shuffle to confirm there are no remaining failures.

The `/goal` command also exists in Codex, and both lineages trace back to the [Ralph loop](https://ghuntley.com/ralph/). The shared idea is "keep running until the goal is met," and conceptually it can be expressed as a simple Bash loop like this:

```bash
while :; do cat PROMPT.md | claude-code ; done
```

If you're curious, the original Ralph loop is worth looking at:

- https://github.com/ghuntley/how-to-ralph-wiggum
- https://ghuntley.com/ralph/

## Summary

- Enabling Vitest's `isolate: false` option can dramatically reduce test execution time.
- When using `isolate: false`, assume state will be shared between test files and make sure to perform appropriate cleanup.
- When you hand Claude Code a large-scale task, it can stop midway for direction checks or cheat its way to "task complete" even though the task isn't actually done.
- Claude Code's `/goal` command lets the agent autonomously decide and execute the steps needed to reach the final goal.
- `/goal` is a command that keeps running until the natural-language goal condition you specified is met. The key tip is to phrase the goal so it can be evaluated quantitatively.

## References

- [Profiling Test Performance | Vitest](https://vitest.dev/guide/profiling-test-performance.html)
- [Improving Performance | Vitest](https://vitest.dev/guide/improving-performance.html)
- [Keep Claude working toward a goal — Claude Code Docs](https://code.claude.com/docs/en/goal)
- [Using Goals in Codex](https://developers.openai.com/cookbook/examples/codex/using_goals_in_codex)
