---
id: EbGSyzJScr37bHvJ83lrz
title: "Using Claude's Advisor Strategy to Optimize the Balance Between Performance and Cost"
slug: "claude-advisor-tool"
about: "The new advisor tool in Claude lets you handle routine tasks with lightweight models while consulting a more capable model only when needed. This article explains how to use the advisor tool in Claude Code."
createdAt: "2026-04-11T17:15+09:00"
updatedAt: "2026-04-11T17:15+09:00"
tags: ["claude-code"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/45xu52pFThgYkbxW478soh/dde9493d0435fb29831338bbf2dfef4b/smoke-salmon_15757-768x591.png"
  title: "スモークサーモンのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "What problem is Claude's Advisor tool primarily designed to solve?"
      answers:
        - text: "Using only high-performance models at all times to finish every task as quickly as possible"
          correct: false
          explanation: "The goal of the Advisor tool is not to always use a high-performance model, but to balance cost and capability by consulting one only when needed."
        - text: "Using a lightweight model for routine work while consulting a high-performance model only for difficult parts"
          correct: true
          explanation: "This is the core value described in the article: let a lightweight model handle normal execution and bring in a stronger model only for complex problems."
        - text: "Running multiple high-performance models in parallel so lightweight models are unnecessary"
          correct: false
          explanation: "The Advisor tool is not about parallelizing high-performance models. It is built around using lightweight models as the default."
        - text: "Discarding conversation history and starting a fresh session each time to reduce mistakes"
          correct: false
          explanation: "The article explains that conversation history is used when consulting the advisor, so discarding history is not the point."
    - question: "According to the article, which statement about the `advisor` tool's arguments is correct?"
      answers:
        - text: "You must pass the model name as an argument to call the advisor"
          correct: false
          explanation: "The article says you choose the model after running `/advisor`, not by passing the model name as a tool argument."
        - text: "You can pass a file path so only that file is shared with the advisor"
          correct: false
          explanation: "The article does not describe any file path argument. It says the entire conversation history is shared."
        - text: "It takes no arguments, and the full conversation history is automatically transferred when you call it"
          correct: true
          explanation: "The article explicitly states that the `advisor` tool itself takes no arguments and automatically transfers the full conversation history."
        - text: "You need to package the consultation content as JSON arguments"
          correct: false
          explanation: "The article does not describe building JSON arguments. It says you simply call the tool."

published: true
---

Coding-agent-based development is no longer unusual, and as it becomes more common, the discussion around cost becomes impossible to ignore. More capable AI models can handle more complex tasks, but they also cost more. In principle, it would be ideal to use lightweight models such as Haiku or Sonnet for simple tasks and high-performance models such as Opus for more complex ones. In practice, though, designing how to assign each task to the right model is itself a complicated challenge.

The newly added [Advisor tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool) in Claude addresses that performance-versus-cost tradeoff. It allows routine work to be handled by lightweight models such as Haiku or Sonnet, while enabling the executor to "consult" a higher-performance model such as Opus when it encounters a complex problem it cannot resolve on its own. When Opus receives that consultation, it can access the shared context and return plans, revisions, or stop signals. In a sense, this inverts the usual idea of delegating work to a sub-agent in large-scale agent orchestration. Because the high-performance model is called only when needed, you can keep costs down while still making full use of its capabilities.

In Claude Code, the `/advisor` command is also available starting from v2.1.101. By using this command, you can apply the Advisor tool directly inside Claude Code. In this article, I will walk through how the Advisor tool can be used in Claude Code.

## Trying the Advisor Strategy in Claude Code

To try the Advisor tool in Claude Code, use the `/advisor` command. When you run it, Claude Code shows a set of options for which model to use as the advisor. In this example, we will choose Opus. Sonnet will handle the main task execution, and Opus will be consulted only when necessary.

![](https://images.ctfassets.net/in6v9lxmm5c8/PA1imzWLCDBjx9ogS52ZM/50387efebb71bea8dd585dff57499a5e/image.png)

Once you select an advisor, Claude Code can use the `advisor` tool. When I asked Claude Code itself to explain the `advisor` tool, it said the following usage rules applied:

> 1. Call it before doing substantial work - It is fine to do light investigation such as reading files first, but the best timing is before writing, editing, or declaring the answer.
> 2. Save deliverables before finishing - Make sure your work remains even if the session ends while the advisor call is in progress.
> 3. Take the advice seriously - If you followed the advice but it failed empirically, or if it conflicts with the evidence you have locally, call the advisor again to resolve the contradiction.
> 4. Call it multiple times for long tasks - A good rule of thumb is once before locking in the approach and once before declaring completion.

Let's try running a task as usual with the `advisor` tool enabled. In this example, `Card.svelte` has three responsibilities mixed into it, so we will run a task asking Claude Code to refactor it to follow the single-responsibility principle.

```txt
Card.svelte currently has three separate concerns packed into its onMount logic:
- inserting copy buttons for code blocks
- handling the image modal behavior
- loading baseline-status

Please fix the issue of mixed responsibilities in Card.svelte.
```

When this task runs, you can see Opus being consulted to help formulate an implementation plan. This is where the `advisor` tool is called.

![](https://images.ctfassets.net/in6v9lxmm5c8/1X3q32rnRC8to3UqP1LKCL/c82d867017d3462ebc4b998c09b0ed83/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-04-11_18.06.47.png)

The `advisor` tool takes no arguments. You simply call it. When it is invoked, the entire conversation history is automatically transferred, so Opus can return feedback on the implementation plan with the full context in mind. At the point where Sonnet had just received the task, its thinking appeared to look something like this (translated into Japanese in the original article):

> I understand the structure. There is no existing `actions` directory. I will create Svelte actions for the two more complex `onMount` blocks:
>
> 1. `app/src/lib/actions/codeBlockCopy.ts` - A Svelte action for code block copy buttons
> 2. `app/src/lib/actions/imageModal.ts` - A Svelte action for the modal used to enlarge images on click
>    The `baseline-status` import is only a simple one-liner, so I will keep it in `Card.svelte`.
>    About Svelte actions:
>
> - They receive the target node as the first argument
> - They can optionally return a `{ destroy() }` object for cleanup
> - The code block action will query `pre` elements inside the target node
> - The image modal action will query `img` elements inside the target node
>   Looking more closely at the current code:
> - Code blocks: `document.querySelectorAll("pre")` - queried globally
> - Images: `document.querySelectorAll("#contents img")` - queried inside `#contents`
>   Also, the `m` import from `$paraglide/messages` is used in the code block copy action. There are two possible approaches:
>
> 1. Import `m` directly inside the action file
> 2. Pass it as a parameter to the action
>    To keep the action simple, I will go with the direct import approach.

Opus then returns feedback on that implementation plan based on the conversation history. Its response is returned to the executor as an `advisor_tool_result` block. Because Opus's thought process is discarded while producing the result, only the result itself is returned.

> The plan is sound. There are three important points to keep in mind during implementation:
>
> **If you use `$paraglide/messages` in a `.ts` action file** - Confirm that this import resolves correctly outside a `.svelte` component. If it does not resolve because of SvelteKit aliases or Vite plugin behavior, it is safer to pass `{ copyLabel: string, copiedLabel: string }` as the second argument to the action instead of importing `m` inside the action. Parameterization is recommended.
>
> **Scope queries to `node`, not `document`** - The current code uses `document.querySelectorAll("pre")` and `document.querySelectorAll("#contents img")`, which perform global queries. Inside the action, use `node.querySelectorAll(...)` instead. This is the essence of the refactor, so be careful not to leave the global queries in place by mistake.
>
> **Clean up `codeBlockCopy` properly** - The current code inserts buttons and popups as siblings of `pre` by using `insertAdjacentElement`. In the `destroy` function, you need to remove not only event listeners but also the inserted elements. Otherwise, stale copy buttons may remain after HMR or SvelteKit navigation. Track them in an array during setup and remove them during `destroy`.
>
> Keep the one-line `baseline-status` logic inline in `Card.svelte` - Extracting a one-line `onMount` would just add unnecessary indirection.

Opus pointed out the following three risks that Sonnet had missed in its initial reasoning:

- Uncertainty around resolving the `$paraglide` alias in a `.ts` file -> switch to passing parameters
- Global `document` queries -> change them to `node.querySelector`
- Missing DOM cleanup in `destroy` -> track inserted elements in an `inserted` array and remove them

## Summary

- By using Claude's Advisor tool, you can optimize the balance between performance and cost. The idea is to let lightweight models handle routine tasks while consulting a high-performance model only when needed.
- By using the `/advisor` command in Claude Code, you can enable the `advisor` tool. This allows the executor to ask a high-performance model for feedback when necessary while working through a task.
- The rules for using the Advisor tool in Claude Code include calling it before substantial work, saving deliverables before completion, taking its advice seriously, and calling it multiple times during long tasks.
- The `advisor` tool itself takes no arguments. You simply call it, and the full conversation history is automatically transferred so Opus can return feedback with the prior context in mind.

## References

- [The advisor tool: Give Sonnet an intelligence boost with Opus | Claude](https://claude.com/blog/the-advisor-tool)
- [Advisor tool - Claude API Docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool)
