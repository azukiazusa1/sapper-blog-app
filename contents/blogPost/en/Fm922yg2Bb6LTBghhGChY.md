---
id: Fm922yg2Bb6LTBghhGChY
title: "pstack, an Agent Skill Collection: Its Development Principles and How to Use It"
slug: "pstack-agent-skills"
about: "Trusting AI-generated code requires understanding before implementation and verification after it. pstack is an agent skill collection that combines investigation, design, implementation, and review. This article covers its principles and usage."
createdAt: "2026-10-18T15:00+09:00"
updatedAt: "2026-10-18T22:30+09:00"
tags: ["AI", "agent skills", "Claude Code"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3gxhnXlxBP1Qoru9upLO7L/90d75c784119a10424b1ff49c6fd352d/potato-chips_15269-768x689.png"
  title: "ポテトチップスのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "When you start a task with pstack, what role does poteto-mode play?"
      answers:
        - text: "It passes the request as-is to a subagent and returns only the result"
          correct: false
          explanation: "poteto-mode does not simply hand off the request. It picks a procedure that fits the type of request and calls the skills it needs along the way."
        - text: "It picks a playbook for the request and calls the skills each step needs"
          correct: true
          explanation: "As the article explains, poteto-mode picks a playbook prepared for each type of task, such as bug fixes or new features, and calls the skills it needs within that procedure."
        - text: "It detects the available models and decides the model and reasoning budget for each role"
          correct: false
          explanation: "The article describes this as the role of setup-pstack."
        - text: "It lists playbook commands such as /bug-fix and lets the user choose one"
          correct: false
          explanation: "The article explains that playbooks are procedures contained in poteto-mode, and there are no commands like /bug-fix to call them directly."

    - question: "According to the Prove It Works principle, which of the following is insufficient evidence for a bug fix?"
      answers:
        - text: "Retrying the operation that originally failed and confirming it now behaves as expected"
          correct: false
          explanation: "This is the verification method the article recommends. Confirming the fix with the operation that originally reproduced the bug is important."
        - text: "Leaving a re-runnable verification script and checking its output"
          correct: false
          explanation: "The article states that leaving a re-runnable verification script is also emphasized."
        - text: "Confirming the test captures the original bug, then confirming the test passes"
          correct: false
          explanation: "The article names whether the test captures the original bug as an important point."
        - text: "A test that would pass even before the fix still passes after the fix"
          correct: true
          explanation: "As the article explains, a test that passes even before the fix does not capture the original bug, so it is not sufficient evidence for the fix."

    - question: "When you run setup-pstack in Claude Code, where does the article say the model settings are saved?"
      answers:
        - text: ".claude/settings.json at the repository root"
          correct: false
          explanation: "The article explains that the settings are saved under the user's home directory, not in the repository."
        - text: "~/.claude/rules/pstack-models.md"
          correct: true
          explanation: "As the article explains, the model settings are saved to ~/.claude/rules/pstack-models.md, and you run setup-pstack again to change them."
        - text: "The playbooks directory of poteto-mode"
          correct: false
          explanation: "The playbooks directory holds the procedures for each type of task. It is not where model settings are saved."
        - text: "~/.claude/skills/setup-pstack/SKILL.md"
          correct: false
          explanation: "SKILL.md is the setup-pstack procedure itself. The models you choose are not written there."
published: true
---

To trust AI-generated code, you need to understand the system before implementing and verify the result afterward. [pstack](https://github.com/cursor/plugins/tree/main/pstack) is an agent skill collection by poteto. The author says it values the quality of generated code over its quantity, with the goal of getting things done with less code. This article introduces pstack's development principles and how to use it.

## How pstack drives development

In pstack, you start a task with `/poteto-mode`. `poteto-mode` picks a playbook based on the user's request. A playbook is a procedure prepared for each type of task, such as fixing a bug or adding a feature. The playbook then calls the skills it needs along the way. The [official guide](https://github.com/cursor/plugins/blob/main/pstack/docs/guide/README.md) recommends telling the agent your goal and how to confirm it is done, rather than spelling out every step.

For example, for a bug fix request, the agent selects the [Bug fix playbook](https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/playbooks/bug-fix.md). Roughly speaking, the Bug fix playbook instructs the agent to proceed in the following order:

1. Actually reproduce the bug
2. Form hypotheses and narrow down the cause using runtime evidence
3. Design the fix and delegate the implementation
4. Verify the fix with the operation that originally reproduced the bug

## pstack's development principles

pstack collects principles for producing high-quality code, drawn from poteto's experience working with millions of lines of code at Meta, Netflix, and Cursor. pstack helps you write less code, but of higher quality. The principles are defined as skills named `principle-*`, and skills such as `how` and `architect` turn those principles into concrete work procedures. This section introduces the main principles and the skills related to them.

### Understand the existing system before implementing

[`how`](https://github.com/cursor/plugins/blob/main/pstack/skills/how/SKILL.md) is a skill that investigates how existing code works and explains its structure and execution flow. Rather than just listing related files, it aims to build an understanding of the system you are about to change.

For a caching bug, for example, it looks into where the data is stored and when it is read. It also traces who holds the value and how a failed result affects the next call. Without this understanding, you might end up adding retry conditionals on the caller side when the real problem is how the cache is managed.

By making investigation a separate step, pstack encourages the agent to understand the cause before making changes, rather than deciding where to fix based only on the first symptom it finds.

### Decide the shape of data and boundaries first

[`Model the Domain`](https://github.com/cursor/plugins/blob/main/pstack/skills/principle-model-the-domain/SKILL.md) is the principle of expressing business rules and state as data structures. One example it gives is representing the possible states as a state machine instead of managing several booleans separately. At the same time, it asks you not to force abstractions and to keep code simple when its shape is already clear.

[`architect`](https://github.com/cursor/plugins/blob/main/pstack/skills/architect/SKILL.md) is the skill that turns this principle into a design procedure. It sketches types, function signatures, and module boundaries first, compares several structurally different options, and then moves on to implementation. By default, `architect` proceeds to implementation once it has synthesized a design. If you want to review the design along the way, explicitly ask for a checkpoint like this:

```text
/architect Review the cache design. Before implementing, stop at a checkpoint and show me the public functions and how state is held.
```

### Keep the change as small as necessary

[`Laziness Protocol`](https://github.com/cursor/plugins/blob/main/pstack/skills/principle-laziness-protocol/SKILL.md) is the principle of consolidating duplicated decisions and choosing the smallest diff that solves the problem. Before adding code, consider whether the existing structure can be simplified.

This does not mean shorter code is always better. For example, adding an abstraction unrelated to a bug fix widens the scope reviewers have to check. Keeping the change to what is necessary makes it easier to follow what caused the problem and which change resolves it.

### Prove completion with real behavior

[`Prove It Works`](https://github.com/cursor/plugins/blob/main/pstack/skills/principle-prove-it-works/SKILL.md) is the principle of checking the actual artifact instead of judging a task complete based only on a successful compile or the agent's own report. It also emphasizes leaving a verification script that can be re-run.

For a bug fix, you retry the operation that originally failed and confirm it now behaves as expected. Beyond passing tests, what matters is whether those tests capture the original bug. A test that would pass even before the fix is not sufficient evidence for it.

### Don't leave multi-model feedback to humans

[`interrogate`](https://github.com/cursor/plugins/blob/main/pstack/skills/interrogate/SKILL.md) is a skill that consolidates reviews from multiple models. It does not just collect each model's findings. It sorts them into issues to fix, suggestions to consider, findings to note, and findings to dismiss. It is not a procedure that automatically applies the findings to the code.

The fact that multiple models flagged the same issue is useful input, but it does not prove the finding is correct. In the end, each finding is evaluated against the target code and the requirements.

## Getting started with Claude Code

pstack works with either Cursor or Claude Code. This section walks through installing it in Claude Code.

### Add the plugin

The [official README](https://github.com/cursor/plugins/blob/main/pstack/README.md) explains how to install it in Claude Code with the following commands:

```text
/plugin marketplace add cursor/plugins
/plugin install pstack@cursor-plugins
```

### Configure models and reasoning budget

Next, run the following skill for initial setup:

```text
/setup-pstack
```

[`setup-pstack`](https://github.com/cursor/plugins/blob/main/pstack/skills/setup-pstack/SKILL.md) is a procedure that detects the available models and lets you choose a model and reasoning budget for each role. When I tried it, it suggested Opus for the roles that require judgment, and for other implementation and investigation work, inheriting the model used in the current session.

![](https://images.ctfassets.net/in6v9lxmm5c8/3HqYi5lELYCv7m9TJuboWV/edc53af480383776df76834a5a3b702e/pstack-agent-skills-1.png)

The model settings are saved to `~/.claude/rules/pstack-models.md`. To change them, run `setup-pstack` again.

If you get stuck using pstack or aren't sure which skill fits, you can ask the `/poteto-help` skill. For example, you can ask it for tips on using pstack like this:

![](https://images.ctfassets.net/in6v9lxmm5c8/642blyut9MUQLuno6QmFQZ/955b9ea32338a09e8d07cbda42cd1f18/pstack-agent-skills-2.png)

## Trying it out

Once you're set up, choose `poteto-mode` from the `/` menu and enter your request. Playbooks are procedures contained in `poteto-mode`, and there are no commands like `/bug-fix` to call them directly. `poteto-mode` picks the right playbook for your request. The key when using `/poteto-mode` is not to specify how to fix things, but to state the goal and how to verify it.

For example, my tag list page had a problem where it returned a 500 error, so I made the following request:

```text
/pstack:poteto-mode https://azukiazusa.dev/tags returns a 500 in production. Reproduce it first, find the root cause, then fix it. It doesn't reproduce with curl, only when you open the page directly in a browser. Done means /tags returns a 200 on a local preview build and the tag list is displayed. As evidence, show me the actual responses (status and error logs) before and after the fix. Note that production uses the real repositories with CF_ENV=production, while development uses mocks.
```

You can see that it loaded the `bug-fix` playbook and proceeded in order: first confirming the reproduction steps, then gathering evidence to identify the cause, and finally designing and implementing the fix.

![](https://images.ctfassets.net/in6v9lxmm5c8/2IPTAZcc7etNQmyIy3sIo2/c98e61a4a0b1efefb8432a0e4450a70c/pstack-agent-skills-3.png)

The cause was that when a slug was an empty string, `key` values were duplicated and hydration failed. The server response itself was a 200, and the 500 error page was shown in the browser because of the hydration failure, which is why curl could not reproduce it. You could patch the code as a stopgap, but the real fix is to prevent slugs from becoming empty strings. Following the [Fix Root Causes](https://github.com/cursor/plugins/blob/main/pstack/skills/principle-fix-root-causes/SKILL.md) principle, the agent did not jump to a code fix and instead proposed a way to correct the tags whose slug was set to an empty string. It also pointed out a bug in the code that generates tags when an article is created, and laid out a plan to fix the problem at its root.

![](https://images.ctfassets.net/in6v9lxmm5c8/29Tq2aE8BnVNB9UMh7mRq9/c71356d9c47e95cd53e304e8ecfbdfa4/pstack-agent-skills-4.png)

Finally, following the [`Prove It Works`](https://github.com/cursor/plugins/blob/main/pstack/skills/principle-prove-it-works/SKILL.md) principle, it checked the responses before and after the fix on the development server and used them as evidence for the fix.

Let's try another playbook. For example, if you want an explanation of a repository's design and code structure, make a request like this:

```text
/pstack:poteto-mode Explain the design and code structure of this repository. I also want to know the design intent and the rules the code is written by. Done means an overview of the design and a diagram of the code structure.
```

It loaded the [investigation](https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/playbooks/investigation.md) playbook and answered the request. The `investigation` playbook is for answering questions without changing code. Its output is a cited explanation or a recommendation. As shown below, it drew diagrams of the repository structure and of the flow until an article is published, and explained the design intent in prose.

![](https://images.ctfassets.net/in6v9lxmm5c8/6j4tO4VwV20KEzy3cDajhr/390b1fe6b2275295f5b776ac02bf8717/pstack-agent-skills-5.png)

## Summary

- pstack is a skill collection that shares a way of working through investigation, design, implementation, and verification, and `poteto-mode` picks a playbook based on the request
- pstack emphasizes keeping diffs small and judging completion by checking the actual artifact
- Trying a bug fix task shows that it proceeds through investigation and design to find the root cause before implementing the fix
- Asking for an explanation of the code selects the investigation playbook, which returns a cited explanation without changing any code

## References

- [pstack](https://github.com/cursor/plugins/tree/main/pstack)
- [The pstack guide](https://github.com/cursor/plugins/blob/main/pstack/docs/guide/README.md)
- [poteto-mode](https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/SKILL.md)
- [setup-pstack](https://github.com/cursor/plugins/blob/main/pstack/skills/setup-pstack/SKILL.md)
- [architect](https://github.com/cursor/plugins/blob/main/pstack/skills/architect/SKILL.md)
- [Bug fix playbook](https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/playbooks/bug-fix.md)
- [Investigation playbook](https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/playbooks/investigation.md)
- [how](https://github.com/cursor/plugins/blob/main/pstack/skills/how/SKILL.md)
- [interrogate](https://github.com/cursor/plugins/blob/main/pstack/skills/interrogate/SKILL.md)
- [Fix Root Causes](https://github.com/cursor/plugins/blob/main/pstack/skills/principle-fix-root-causes/SKILL.md)
