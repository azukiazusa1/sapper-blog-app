---
id: iOIakqb_QXPTBWsw9macH
title: "Automatically Restoring Vitest Mocks with using"
slug: "vitest-using-mock"
about: "Forgetting to restore a spy in Vitest lets mock state leak into other tests. Since Vitest 3.2.0, assigning the return value of `vi.spyOn()` to a `using` declaration restores the original implementation automatically when the scope exits."
createdAt: "2026-08-23T15:55+09:00"
updatedAt: "2026-08-23T15:55+09:00"
tags: ["Vitest", "JavaScript"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1pE2cdhmrrjTHCr3ukvqap/acc5334983d977d765969aa27e51b952/yakitori_liver_16126-768x591.png"
  title: "焼き鳥のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "According to the article, what happens when you declare the return value of `vi.spyOn()` with `using` instead of `const`?"
      answers:
        - text: "The spy stays in place even after the block exits"
          correct: false
          explanation: "The spy staying in place is what happens with a `const` declaration. With `using`, `mockRestore()` is called automatically when the scope exits and the original implementation comes back."
        - text: "`mockRestore()` is called automatically when the declaring scope exits"
          correct: true
          explanation: "As the article explains, a spy declared with `using` has `mockRestore()` called as its disposal step, so the original implementation is back as soon as the scope exits."
        - text: "The variable can no longer be reassigned"
          correct: false
          explanation: "Being unable to reassign the variable is equally true of a `const` declaration."
        - text: "It becomes possible to detect that the variable is unused"
          correct: false
          explanation: "A `using` declaration does not detect whether a variable is used. It is a mechanism for calling disposal logic automatically."
    - question: "According to the article, what must an object satisfy to be assignable to `using`?"
      answers:
        - text: "It must have a method keyed by `Symbol.iterator`"
          correct: false
          explanation: "`Symbol.iterator` is the symbol used for iteration and has nothing to do with Explicit Resource Management."
        - text: "It must have an ordinary method named `dispose`"
          correct: false
          explanation: "The article explains that the key must be the well-known symbol `Symbol.dispose`, not the string key `dispose`."
        - text: "It must extend a `Disposable` class"
          correct: false
          explanation: "There is no need to extend any particular class. The article's own example shows that a plain object literal can be assigned to `using`."
        - text: "It must have a method keyed by `Symbol.dispose`"
          correct: true
          explanation: "This matches the article. In Vitest 3.2.0, mock functions implement this `Symbol.dispose`, and it calls `mockRestore()` internally."
published: true
---
When a Vitest test deals with code that depends on an external API or the current time, you often reach for `vi.spyOn()` to mock a method on an object temporarily. Because a spy overwrites the target method, you have to put the original implementation back once the test finishes. Forget to restore it, and another test ends up calling the mocked implementation, which makes your results depend on the order the tests happen to run in.

```ts
describe("Test suite A", () => {
  test("Test A1", () => {
    const logSpy = vi.spyOn(logger, "log").mockReturnValue("mocked message");
     // ...the body of the test
     // You must remember to call mockRestore()!
     logSpy.mockRestore();
  });
});
```

Calling `mockRestore()` in every single test block is a bit of a chore, though. There is also a subtler problem: if a failed assertion or an unexpected exception ends the test before `mockRestore()` is reached, the restoration never happens.

Since Vitest 3.2.0, you can assign the return value of `vi.spyOn()` to JavaScript's [`using` declaration](https://github.com/tc39/proposal-explicit-resource-management). A spy declared with `using` has `mockRestore()` called automatically when the scope exits.

```ts
describe("Test suite A", () => {
  test("Test A1", () => {
    using logSpy = vi.spyOn(logger, "log").mockReturnValue("mocked message");
    // ...the body of the test
    // mockRestore() is called automatically when the scope exits
  });
});
```

This article looks at how to use `using` to restore Vitest spies automatically.

## Putting the original implementation back

Let's start by reviewing how to restore a spy created with `vi.spyOn()` by hand. As the target of our spy, we'll use a `logger.log()` method that formats a message.

```ts:logger.ts
export const logger = {
  log(message: string) {
    return `[info] ${message}`;
  },
};
```

The test below spies on `logger.log()` and changes its return value to `"mocked message"`. Calling `mockRestore()` at the end of the test puts the original `logger.log()` back.

```ts:logger.test.ts
import { expect, test, vi } from "vitest";
import { logger } from "./logger";

test("logs a message", () => {
  const logSpy = vi
    .spyOn(logger, "log")
    .mockReturnValue("mocked message");

  expect(logger.log("hello")).toBe("mocked message");
  expect(logSpy).toHaveBeenCalledOnce();

  logSpy.mockRestore();
});
```

This code restores correctly as long as the test runs to completion. But if a failed assertion or an unexpected exception ends the test before `mockRestore()` is reached, the restoration never runs.

One reliable way to restore spies is to call [`vi.restoreAllMocks()`](https://vitest.dev/api/vi#vi-restoreallmocks) from `afterEach()`.

```ts
import { afterEach, vi } from "vitest";

afterEach(() => {
  vi.restoreAllMocks();
});
```

The drawback is that the `afterEach()` block is usually defined far away from the test block itself, which makes the relationship — "where does the spy I created in this test get restored?" — a little harder to follow.

Alternatively, setting [`restoreMocks: true`](https://vitest.dev/config/#restoremocks) in your Vitest config restores spies before each test. Both of these are a good fit when you want blanket restoration across the whole test suite. That said, you may not always be in a position to change a global setting so casually. When you want to control restoration on a per-test basis, a `using` declaration is a handy option.

## Restoring spies automatically with a `using` declaration

A `using` declaration lets you have `mockRestore()` called automatically at the end of a block. Let's declare the return value of `vi.spyOn()` with `using` instead of `const`.

```ts:logger.test.ts {5-7}
import { expect, test, vi } from "vitest";
import { logger } from "./logger";

test("logs a message", () => {
  using logSpy = vi
    .spyOn(logger, "log")
    .mockReturnValue("mocked message");

  expect(logger.log("hello")).toBe("mocked message");
  expect(logSpy).toHaveBeenCalledOnce();
});
```

When the scope of the test function exits, `mockRestore()` is called automatically as `logSpy`'s disposal step. Unlike restoring in `afterEach()`, the declaration sits right next to the test block that needs it, which makes the relationship much easier to see.

`using` is a new piece of JavaScript syntax that comes from a proposal called [Explicit Resource Management](https://github.com/tc39/proposal-explicit-resource-management). The specification work is finished, and it is on track to land in ES2027. It was proposed as a way to tie resources that need explicit cleanup — file handles, streams, and the like — to the scope of a variable.

An object assigned to `using` must have a method keyed by `Symbol.dispose`.

```ts
const resource = {
  [Symbol.dispose]() {
    console.log("Disposed the resource");
  },
};
```

Once the block containing `using value = resource` finishes, `resource[Symbol.dispose]()` is called. Just like `try` / `finally`, the disposal step still runs even if an exception is thrown inside the block.

```ts
{
  using value = resource;

  //...the body of the block
  // resource[Symbol.dispose]() is called on the way out of the block
}
```

In Vitest 3.2.0, the mock functions returned by `vi.spyOn()` and `vi.fn()` implement `Symbol.dispose`, and `[Symbol.dispose]()` calls `mockRestore()`. That is what makes a spy declared with `using` restore itself automatically when the scope exits.

:::warning
`using` is still relatively new syntax. Type checking requires TypeScript 5.2, and running it requires Node.js 24.0 or later.
:::

## Summary

- Since Vitest 3.2.0, declaring the return value of `vi.spyOn()` with `using` causes `mockRestore()` to be called automatically when the scope ends
- The disposal step of `using` runs not only on normal completion but also when the scope is left via an exception or an early return

## References

- [Auto-Cleanup with using | Vitest](https://main.vitest.dev/guide/recipes/explicit-resources)
- [Vitest 3.2 is out! | Vitest](https://vitest.dev/blog/vitest-3-2.html)
- [Vi | Vitest](https://vitest.dev/api/vi)
- [TypeScript 5.2 | TypeScript](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html)
- [ECMAScript Explicit Resource Management | TC39](https://github.com/tc39/proposal-explicit-resource-management)
- [Finished Proposals | TC39](https://github.com/tc39/proposals/blob/main/finished-proposals.md)
- [Node.js 24.0.0 | Node.js](https://nodejs.org/en/blog/release/v24.0.0)
