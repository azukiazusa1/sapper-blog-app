---
id: 5Bg7v78qD4H823jdEqV-o
title: "Speeding Up Validation with Zod's z.compile()"
slug: "zod-compile-validation"
about: "Zod 4.5 adds z.compile(), which turns a schema into JavaScript optimized at runtime. A compiled schema keeps the same API as a regular schema while validating complex data faster. This article covers the basics and how it works."
createdAt: "2026-08-30T11:18+09:00"
updatedAt: "2026-08-30T12:16+09:00"
tags: ["TypeScript", "Zod"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3LVmxpUE20tYnv3ZG2yBal/06160d874db638a31c5df26cd1b47867/jewelry_12191-768x768.png"
  title: "宝石のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "When invalid input is passed to a compiled schema, which behavior does the article describe?"
      answers:
        - text: "The generated function builds a detailed ZodError directly"
          correct: false
          explanation: "The generated function does not build detailed errors. When it detects invalid input, it returns the internal INVALID value."
        - text: "Validation stops and returns false with no error information"
          correct: false
          explanation: "A compiled schema keeps the same API and errors as regular parse() and safeParse(). It is not a feature that returns only a boolean."
        - text: "It falls back to the standard parser to generate detailed errors"
          correct: true
          explanation: "As the article explains, when the generated function detects invalid input, Zod parses it once more with the standard parser to produce the same detailed errors as before."
        - text: "It recompiles the schema and then validates the same input"
          correct: false
          explanation: "The schema is not recompiled on every invalid input. Processing is handed back to the existing standard parser."
    - question: "Which statement about automatic compilation via import \"zod/compile\" is correct?"
      answers:
        - text: "It compiles every schema at load time, including ones created before the import"
          correct: false
          explanation: "Only schemas created after the import are affected. They are also compiled lazily on first validation, not at load time."
        - text: "It generates a new validation function every time a schema is used"
          correct: false
          explanation: "Generation happens on the first validation. It is not a mechanism that recompiles on every parse() call."
        - text: "It emits a JavaScript file for validation at application build time"
          correct: false
          explanation: "Compilation happens inside the application process and does not produce a separate JavaScript file."
        - text: "It lazily compiles schemas created after the import, on their first validation"
          correct: true
          explanation: "As the article explains, schemas created after zod/compile are compiled when parse() or safeParse() is first called."
    - question: "When z.compile() is called in an environment that forbids generating code from dynamic strings, what result did the article confirm?"
      answers:
        - text: "It falls back to the standard parser and validation succeeds"
          correct: true
          explanation: "In a Node.js run with code generation disabled, validation still worked by falling back to the standard parser even though compilation was not possible."
        - text: "The CSP configuration automatically allows unsafe-eval"
          correct: false
          explanation: "Zod never modifies your CSP. When code generation is rejected, it falls back to the standard parser."
        - text: "All Zod schemas become unusable"
          correct: false
          explanation: "The optimization from compilation is unavailable, but validation through the standard parser continues to work."
        - text: "It automatically switches to build-time compilation"
          correct: false
          explanation: "z.compile() is not a feature that switches to another approach at build time. When in-process code generation is rejected, it falls back to the standard parser."
published: true
---
When you validate data received from a Web API request or an external file with Zod, it normally parses the input by walking the structure of your schema. This approach is easy to work with and gives you detailed errors, but in code that uses the same complex schema over and over, the execution time can become significant.

Zod 4.5 adds [`z.compile()`](https://zod.dev/compile), which generates a JavaScript function specialized for validating a given schema. A compiled schema keeps the same API, types, and errors as a regular schema while processing valid input faster.

This article walks through the basics of `z.compile()` and how it achieves its speedup, then covers measured performance, automatic compilation via `import "zod/compile"`, and caveats such as CSP and bundle size.

## The Overhead of Zod's Runtime Validation

Zod holds schemas as JavaScript objects. For example, the `ProductSchema` below is composed of several schemas: an object, a string, a number, and an integer.

```ts
const ProductSchema = z.object({
  name: z.string(),
  quantity: z.number().int().positive(),
});

ProductSchema.parse({ name: "Apple", quantity: 3 });
```

When `parse()` is called, Zod checks that the input is an object and passes `name` and `quantity` to their respective child schemas. For `quantity`, on top of confirming it is a number, it also runs checks for whether it is an integer and whether it is greater than zero.

Simplifying the idea behind the standard parser, it can be expressed as walking the schema tree like this. The code below is pseudocode for illustration.

```ts
function parseObject(
  shape: Record<string, Schema>,
  input: Record<string, unknown>,
) {
  const output: Record<string, unknown> = {};
  const issues: Issue[] = [];

  for (const key of Object.keys(shape)) {
    const result = parseNode(shape[key], input[key]);

    if (result.issues.length > 0) {
      issues.push(
        ...result.issues.map((issue) => ({
          ...issue,
          path: [key, ...issue.path],
        })),
      );
    } else {
      output[key] = result.value;
    }
  }

  return { value: output, issues };
}
```

`parseNode()` dispatches to the logic that corresponds to the kind of schema it was given. Child schemas return validation state shaped like `{ value, issues }`, and the parent object schema aggregates the results while prepending property names to each issue's path. In Zod's actual implementation as well, every schema has an internal `run` function, and they pass around a payload containing the input value and an array of issues.

On top of that, `z.object()` does not simply return the input object. By default it strips keys that are not defined in the schema and builds a new output object from the validated values. So even on the happy path, it needs to construct output rather than just check types.

When an object contains arrays or other objects, this process nests. In the order schema used later in this article, Zod walks the outer order, the customer, the array of items, each item within the array, and then each property of that item. With 10 items that have 4 properties each, the items alone require validating 40 values and returning each result to its parent.

The type check `typeof input.name === "string"` is simple in itself, but generic machinery is still needed both to reach that check and to return its result to the parent schema. The more complex the schema and the more often the same validation repeats, the more these costs add up.

On the other hand, once a schema is finished, the properties and types it validates never change. If you read the schema's structure ahead of time and generate a function optimized for exactly that structure just once, you no longer need to repeat the generic machinery on every validation. This is the basic idea behind `z.compile()`.

## Compiling a Schema with `z.compile()`

First, install Zod 4.5.0.

```bash
npm install zod@4.5.0
```

As an example, let's define a schema that validates order data. It is a nested object containing the customer, an array of items, and the order status.

```ts
import * as z from "zod";

const OrderSchema = z.object({
  id: z.uuid(),
  customer: z.object({
    name: z.string(),
    email: z.email(),
  }),
  items: z.array(
    z.object({
      productId: z.string(),
      name: z.string(),
      price: z.number().nonnegative(),
      quantity: z.number().int().positive(),
    }),
  ),
  status: z.enum(["pending", "paid", "shipped"]),
});
```

Passing a schema to `z.compile()` returns a compiled copy. The original `OrderSchema` is left unchanged.

```ts
const CompiledOrderSchema = z.compile(OrderSchema);

const order = CompiledOrderSchema.parse(input);
```

`CompiledOrderSchema` is a regular Zod schema too. You can call the same methods, such as `parse()` and `safeParse()`. The input and output types are unchanged as well. That means you can swap in compiled versions only for the schemas where performance matters, without changing any calling code.

If you want to confirm that you have not accidentally passed a schema that cannot be compiled, you can use the `strict` option.

```ts
const CompiledOrderSchema = z.compile(OrderSchema, { strict: true });
```

Plain `z.compile()` returns the original schema when compilation is not possible and keeps using the standard parser. With `strict: true`, it throws either `ZodCompileAsyncError` or `ZodCompileUnsupportedError` depending on why compilation failed. This is useful when you want to detect that you have mistakenly passed a schema that cannot be compiled.

For example, a schema containing an async refinement cannot be compiled. In the code below, `FallbackUserSchema` is not a compiled copy but the very `AsyncUserSchema` that was passed in.

```ts
const AsyncUserSchema = z
  .object({ username: z.string() })
  .refine(async ({ username }) => {
    return await isUsernameAvailable(username);
  });

// Not compilable, so AsyncUserSchema itself is returned
const FallbackUserSchema = z.compile(AsyncUserSchema);
```

Compiling the same schema with `strict: true` throws `ZodCompileAsyncError` instead of falling back to the original schema.

```ts
z.compile(AsyncUserSchema, { strict: true });
// ZodCompileAsyncError: z.compile: async .refine() predicates are not supported
```

:::info
`strict: true` throws only when the schema you passed to `z.compile()` is itself uncompilable. If an uncompilable schema sits at a nested position, such as an object property, Zod falls back to the standard parser for just that part and compiles the rest, so no exception is thrown.
:::

According to the official documentation for Zod 4.5.0, schemas containing the following features also cannot be compiled, or are not eligible for the speedup.

- Async refinements, transforms, and checks
- `z.xor()`
- Recursive schemas
- `z.coerce.*`
- Checks with a custom `when`
- `.catch()` given a callback

### Compile the Final Schema

If you call `.extend()`, `.refine()`, `.optional()`, and so on for a compiled schema, the newly derived schema is uncompiled. This is because Zod's schema operations do not modify the original schema; they return a new one.

```ts
// The schema returned by refine() is not compiled
const CompiledFirst = z.compile(OrderSchema).refine(
  (order) => order.items.length > 0,
);

// Finish building the schema first, then compile it
const CompiledLast = z.compile(
  OrderSchema.refine((order) => order.items.length > 0),
);
```

You need to call `z.compile()` after assembling the entire schema.

## How the Generated JavaScript Makes Validation Faster

Zod's [official documentation](https://zod.dev/compile#how-it-works) explains that `z.compile()` walks the whole schema once and generates flat JavaScript code with few loops. The generated code is turned into an executable function via `new Function()`.

For example, validating an object with `x` and `y` is converted into a function like this.

```js
const isPoint = new Function(
  "input",
  `
    if (typeof input !== "object" || input === null) return false;
    if (typeof input.x !== "number") return false;
    if (typeof input.y !== "number") return false;
    return true;
  `,
);
```

In the generated function, the `typeof` checks and property accesses required by the target schema are laid out in sequence. There is no need to determine each node's kind through a generic parser, and JavaScript engines can optimize the specialized code more easily.

The Zod team calls this mechanism AOT (Ahead-of-Time) compilation. "Ahead" here means that code is generated before the schema validates anything. It does not produce a separate file at build time; compilation runs inside your application's process.

### Falling Back to the Standard Parser When Input Doesn't Match the Schema

The generated function's job is to process valid input quickly. When the input does not match the schema, the generated function returns an internal value called `INVALID`, and Zod parses the input once more with the standard parser.

A single `parse()` call on a compiled schema conceptually performs the following steps internally. The code below is pseudocode that simplifies Zod's implementation.

```ts
function compiledParse(input: unknown) {
  // 1. Validate with the fast generated function
  const output = generatedParser(input);

  // 2. Not INVALID means valid input, so return the generated function's result
  if (output !== INVALID) {
    return output;
  }

  // 3. Only on a mismatch, re-validate with the original standard parser
  return originalParse(input);
}
```

For valid input, the result of `generatedParser()` is returned as is, so validation completes entirely on the fast path. For invalid input, `generatedParser()` first detects the mismatch, and then `originalParse()` validates the same input to produce detailed issues. In other words, `parse()` is called once, but internally the validation of invalid input runs in two stages.

Falling back to the standard parser means the compiled version does not have to duplicate the error-generation machinery, and it can return the same paths, error codes, and messages as before. This design is a trade-off that delivers a speedup for valid input while preserving the existing behavior for invalid input.

For invalid input, the two-stage validation also increases processing time slightly. Measuring the order schema above with invalid data, the standard version took 2961 ns while the compiled version took 3084 ns. In code where a high proportion of input is invalid, the benefit of compilation is smaller.

:::warning
Be careful with refinements and transforms that have side effects: they run twice when the input is invalid.
:::

## Measuring Performance and Compilation Cost

I validated the same order data 500,000 times and compared the processing time of the standard and compiled versions. Before measuring, each was run 20,000 times to warm up the JavaScript engine.

```ts
import { performance } from "node:perf_hooks";

const ITERATIONS = 500_000;
const WARMUP_ITERATIONS = 20_000;

function measureParse(schema: z.ZodType, iterations: number): number {
  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    schema.parse(validOrder);
  }

  return performance.now() - start;
}

const CompiledOrderSchema = z.compile(OrderSchema, { strict: true });

measureParse(OrderSchema, WARMUP_ITERATIONS);
measureParse(CompiledOrderSchema, WARMUP_ITERATIONS);

const uncompiledMs = measureParse(OrderSchema, ITERATIONS);
const compiledMs = measureParse(CompiledOrderSchema, ITERATIONS);
```

The medians across five runs of the same command are as follows.

| Schema     | Time per validation | Speed vs. standard |
| ---------- | ------------------: | -----------------: |
| Standard   |              970 ns |                  - |
| Compiled   |              209 ns |    4.64x faster    |

In this environment and with this schema, the compiled version was about 4.64 times faster. The [Zod 4.5.0 release notes](https://github.com/colinhacks/zod/releases/tag/v4.5.0) report roughly 3–7x improvements for objects, arrays, unions, and so on, with larger gains for more complex schemas. That said, compilation itself has a cost, since it has to walk the schema and generate a function, so unconditionally compiling even schemas that are used only once may offer little performance benefit.

## Automatic Compilation with `import "zod/compile"`

When you want to compile many schemas across your entire application, you can import `zod/compile` at the top of your entry point.

```ts
import "zod/compile";
import * as z from "zod";

const schema = z.object({ name: z.string() });

// Lazily compiled on the first parse()
schema.parse({ name: "Alice" });
```

Schemas created after this import are compiled when `parse()` or `safeParse()` is first called. Schemas that are never used are never compiled.

Depending on module evaluation order, another module may create schemas before `zod/compile` runs. In Node.js, you can specify it as a startup option so that it loads before your application's modules.

```bash
# ES Modules
node --import zod/compile app.js

# CommonJS
node --require zod/compile app.cjs
```

## Things to Watch Out for When Using `z.compile()`

### When CSP Forbids Dynamic Code Generation

`z.compile()` uses `new Function()` internally. In browsers where CSP's `script-src` does not allow `unsafe-eval`, or in runtimes that forbid generating code from dynamic strings, the generated function cannot be executed.

When you call `z.compile()` explicitly, Zod generates validation code from the schema and passes that code directly to `new Function()`. Simplified, the process looks like this.

```ts
function compile(schema, options) {
  const code = generateValidationCode(schema);

  try {
    // If CSP rejects new Function() here, an exception is thrown
    const factory = new Function(
      "INVALID",
      `return (input) => { ${code} }`,
    );
    const parser = factory(INVALID);

    return createCompiledCopy(schema, parser);
  } catch (error) {
    if (options?.strict) {
      throw error;
    }

    return schema;
  }
}
```

With plain `z.compile()`, if CSP rejects `new Function()`, the exception is caught and the schema you passed in is returned as is. As a result, you do not get the speedup from compilation, but validation through the standard parser continues to work. If you specify `strict: true`, there is no fallback and the error is thrown.

For automatic compilation via `import "zod/compile"`, the `jitless` setting is checked before invoking the compiler.

```ts
function autoCompile(schema) {
  if (globalConfig.jitless) {
    return schema;
  }

  return compile(schema);
}
```

When `jitless: true`, `compile()` is never called, so `new Function()` is never even attempted. In environments where you know up front that code generation is not possible, configure this before creating any schemas.

```ts
import * as z from "zod";
import "zod/compile";

z.config({ jitless: true });

const schema = z.object({ name: z.string() });
```

This setting disables automatic compilation via `import "zod/compile"`. Because it uses the standard parser from the start rather than falling back after detecting a CSP violation, it also avoids unnecessary `securitypolicyviolation` events and CSP reports.

Note that Zod's author, Colin McDonnell, has said in a [post on X](https://x.com/colinhacks/status/2093734950914896040) that compilation may become Zod's default in a future release.

### Bundle Size Increases in the Browser

The compiler includes the logic for generating code from a schema. According to the [official blog](https://zod.dev/blog/introducing-z-compile#tradeoffs), calling `z.compile()` or importing `zod/compile` is reported to add roughly 7 KB gzipped (about 28 KB minified) to your bundle from Zod's compiler.

When a schema is validated many times on the server, a sustained throughput improvement may matter more than bundle size. On the other hand, in browsers, short-lived CLIs, and environments where cold start matters, the extra code and compilation time may outweigh the performance improvement.

## Summary

- `z.compile()` generates a JavaScript function that quickly processes valid input from a finished Zod schema, and returns a copy of the schema with the same API, types, and detailed errors
- For invalid input, it falls back to the standard parser
- Importing `import "zod/compile"` at your application's entry point automatically compiles schemas created afterward on their first validation
- When CSP forbids dynamic code generation, Zod falls back to the standard parser, or you can set `jitless` to disable automatic compilation
- A compiled schema increases bundle size, so take care in browsers and short-lived CLIs

## References

- [Release v4.5.0 · colinhacks/zod](https://github.com/colinhacks/zod/releases/tag/v4.5.0)
- [AOT compilation | Zod](https://zod.dev/compile)
- [Introducing z.compile() | Zod](https://zod.dev/blog/introducing-z-compile)
- [A post on the possibility of compilation becoming the default in a future release](https://x.com/colinhacks/status/2093734950914896040)
- [feat(v4): make z.compile() fall back instead of throwing by colinhacks · Pull Request #6479 · colinhacks/zod](https://github.com/colinhacks/zod/pull/6479)
- [perf(v4): close the fastpass bindings into the compiled parser by colinhacks · Pull Request #6464 · colinhacks/zod](https://github.com/colinhacks/zod/pull/6464)
