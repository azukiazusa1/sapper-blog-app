---
id: LbwgsjTAG4Wb2l6ll3XdV
title: "Have the agent comment on its own changes with the difit-review skill"
slug: "difit-review-agent-comment"
about: "difit is a CLI tool for reviewing local git diffs in a GitHub-style interface. With the difit-review skill, an agent can launch difit with comments attached to code changes. This article shows how to use it."
createdAt: "2026-04-02T19:20+09:00"
updatedAt: "2026-04-02T19:20+09:00"
tags: ["difit", "agent skills"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/6IxkYer4azMRxPmCi3M43i/08e5110afe8102cbc6958b9cea208194/mushroom_kinoko_illust_1037-768x558.png"
  title: "キノコのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Which of the following best matches the article's explanation of the main benefit of using the difit-review skill?"
      answers:
        - text: "You can review local diffs in a familiar interface with agent comments attached, without pushing changes to a remote repository."
          correct: true
          explanation: "The article highlights the ability to stay entirely local while reviewing diffs in a GitHub-style UI with comments from the agent."
        - text: "It automatically creates a Pull Request on GitHub and sends review requests for you."
          correct: false
          explanation: "The article is about reviewing local diffs, not automatically creating Pull Requests."
        - text: "It automatically deploys changed files to production."
          correct: false
          explanation: "difit is a diff review tool, and deployment is outside the scope of the article."
        - text: "It automatically fixes code changes and commits them for you."
          correct: false
          explanation: "The article explains how comments can be attached to diffs, not automatic fixing or committing."
    - question: "What does the article specifically warn you to pay attention to when installing Agent Skills created by a third party?"
      answers:
        - text: "Installing a skill might prevent the local difit viewer from launching."
          correct: false
          explanation: "The warning is about security risks, not whether the viewer launches."
        - text: "A skill might only work on an older version of Node.js, so you should check runtime requirements first."
          correct: false
          explanation: "That could be a practical concern in general, but it is not the main warning in the article."
        - text: "There are security risks such as prompt injection and arbitrary script execution, so you should review the skill's contents carefully."
          correct: true
          explanation: "The warning section explicitly mentions risks like prompt injection and arbitrary script execution, and recommends checking the skill contents carefully."
        - text: "Installing a new skill disables all existing skills, so you should make a backup first."
          correct: false
          explanation: "The article does not describe that behavior."
    - question: "Following the article's workflow, which action is appropriate if you want to launch difit after implementation with the agent's explanation of the changes attached?"
      answers:
        - text: "Run `npx skills add https://github.com/yoshiko-pg/difit --skill difit-review` every time before reviewing the diff."
          correct: false
          explanation: "That is the installation step, not the command you run each time after implementation."
        - text: "Run `npx difit staged --comment` directly and do not use the skill."
          correct: false
          explanation: "The article focuses on using the skill so the agent can launch difit with comments attached."
        - text: "Use the `/difit-review` command so difit is launched according to the rules defined in `SKILL.md`."
          correct: true
          explanation: "The article explains that after implementation, `/difit-review` leads to launching difit with `--comment`."
        - text: "Launch `/difit` and write the review comments manually in a separate file afterward."
          correct: false
          explanation: "The point of `difit-review` in the article is to launch difit with comments already attached."
published: true
---
[difit](https://github.com/yoshiko-pg/difit) is a CLI tool for reviewing local git diffs in a GitHub-style viewer. In an era where AI agents often spend more time reviewing code than writing it, one of its biggest strengths is that you can inspect code diffs in a familiar interface without pushing changes to a remote repository. With the `npx difit <target>` command, you can inspect the diff for a specific commit, and you can also use keywords like `staged` and `working` to inspect diffs in the staging area or working tree.

```bash
# Review the diff for a specific commit
npx difit abcd1234
# Review the staged diff
npx difit staged
# Review the diff against the main branch
npx difit @ main
```

When you run the command, the diff becomes available at http://localhost:4966. You can leave line-by-line comments there and feed them back to the agent as prompts.

![](https://images.ctfassets.net/in6v9lxmm5c8/3Lro8AcuZSO3X0jbc6f502/61939c20f279afd43037c065287e09a9/image.png)

`difit` is available as a CLI tool, but you can also invoke it from an agent by using the officially provided Skills. At the moment, there are two skills related to `difit`.

- [difit](https://skills.sh/yoshiko-pg/difit/difit): Ask the user for a code review
- [difit-review](https://skills.sh/yoshiko-pg/difit/difit-review): Launch difit with comments left by the agent

How you invoke a skill depends on the agent. For example, in Claude Code you can call it with a slash command such as `/difit-review`, while in Codex you call it explicitly through a skill reference. This article mainly uses Claude Code for the execution examples, while also showing an example of using it with Codex.

Launching `difit` through a skill means people no longer need to remember the fine details of the command-line arguments. It also enables workflows such as asking the agent to leave review results or explanations of code it wrote. Let's try using the `difit-review` skill to have an agent explain a code change.

## Install the difit-review skill

If you want to install a specific skill, the `npx skills` command is handy. Run the following command, select the agent you are currently using in the interactive prompt, and install the `difit-review` skill.

```bash
npx skills add https://github.com/yoshiko-pg/difit --skill difit-review
```

:::warning
Agent Skills can come with security risks, such as prompt injection that attempts to steal sensitive information from the user, or abuse of a mechanism that allows arbitrary scripts to run. If you install an Agent Skill from a third party, you should carefully inspect the contents of the skill first.
:::

After the installation finishes, make sure the agent can use the `difit-review` skill. For example, in Claude Code, if `/difit-review` appears as a suggestion when you type it, the skill has been recognized correctly.

![](https://images.ctfassets.net/in6v9lxmm5c8/GjgRsj9Ru1Qz21u5efBSE/53ac4761296999ac85e9ef8144a841ec/image.png)

## Use the difit-review skill to have the agent explain the code

Now let's ask the agent to launch `difit` after adding its own explanation of the code changes. To begin with, we will ask it to implement the UI for a fictional household budgeting app.

![](https://images.ctfassets.net/in6v9lxmm5c8/5Ey772CvvSkyXJ32wNfDMN/ad665eefe45032c9c4dbc9c0740f549f/image.png)

<details>
<summary>Prompt</summary>

```txt
# Transaction Input Form UI

## Overview

Implement an input form for registering income and expenses. Design it as a shared component that can be used for both creating and editing entries.

## Page Structure

- New entry: `/transactions/new` (or a modal within the list page)

## Form Fields

| Field | Input Method | Validation |
|-----------|---------|--------------|
| Type | Toggle switch for income / expense | Required |
| Date | Date picker (default: today) | Required, future dates only trigger a warning |
| Amount | Numeric input (show yen symbol) | Required, integer of 1 or more |
| Category | Select box (filtered based on `type`) | Required |
| Memo | Text area (single line) | Optional, up to 200 characters |

## UI Behavior

- Switching the type (income/expense) also switches the category choices
- Show the amount with thousands separators while typing (example: ¥1,500)
- After submission, navigate to the list page (or close the modal and refresh the list)
- While submitting, put the button into a loading state to prevent duplicate submissions

## Additional Requirements

- Implement it so it sends a POST request to the `/api/transactions` endpoint
- Write component tests using Vitest + Testing Library
- Keep accessibility in mind
- Reuse the existing UI component library
```

</details>

Once the implementation is done, in Claude Code you can use the `/difit-review` command to have it launch `difit`. As defined in [SKILL.md](https://github.com/yoshiko-pg/difit/blob/main/skills/difit-review/SKILL.md), the key point is that it launches the `difit` command with the `--comment` option. The `difit-review` skill itself defines how `difit` is launched and how comments are passed along, while the actual quality and content of those comments depends on how the agent investigated the diff.

```bash
/difit-review
```

In this example, the agent leaves comments on changes that are hard to understand from the diff alone, such as why the `<Select>` component is mocked in the tests. For example, a note like "In the test environment, we want to verify the form behavior rather than the internal implementation of a complex UI component, so `<Select>` is replaced with a simple mock" makes the intent of the change much easier to grasp quickly.

![](https://images.ctfassets.net/in6v9lxmm5c8/7c7XcmQNEwwzeind1iZi3q/ccf31b160baf34e253f8bef36056eb5c/image.png)

You can also use the `difit-review` skill in the same way when you want to ask an agent for a code review. Let's have Codex review an implementation created with Claude Code. In Codex, you explicitly invoke `difit-review` through a skill reference.

![](https://images.ctfassets.net/in6v9lxmm5c8/23jitRaz97qwX7RqvJ10N7/90979d92c5fdb7660b19fd8da680b10c/image.png)

After examining the diffs in the key files and the surrounding code, the agent can launch `difit` with comments attached that point out important issues or explain the intent behind the changes. The quality of the review still depends on the depth of the agent's investigation, but it is convenient to keep the whole review experience local.

![](https://images.ctfassets.net/in6v9lxmm5c8/2L5FenvquKmLASAEgxq5va/9c317ea1385c455787c1675eb4653cc5/image.png)

## Summary

- `difit` is a CLI tool for reviewing local git diffs in a GitHub-style interface
- With the `difit-review` skill, an agent can launch `difit` with comments attached to code changes
- In Claude Code, you can invoke it with a command like `/difit-review` to launch `difit` with the agent's comments attached
- You can also use the `difit-review` skill when asking an agent to review code

## References

- [difit-review by yoshiko-pg/difit](https://skills.sh/yoshiko-pg/difit/difit-review)
- [difit/skills at main · yoshiko-pg/difit](https://github.com/yoshiko-pg/difit/tree/main/skills)
