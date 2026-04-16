---
id: MPEh7n0SXWiZkKf-vKUGo
title: "apm: A Package Manager for AI Agents"
slug: "apm-package-manager"
about: "apm is a package manager for AI agents by Microsoft. Like npm or pip, it resolves dependencies while packaging agent skills and MCP as manifests. This article covers the basics of using apm."
createdAt: "2026-04-16T19:55+09:00"
updatedAt: "2026-04-16T19:55+09:00"
tags: ["apm", "agent-skills", "mcp"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/6bcoL9NTLsCTlwPjpgFNkO/370d0d80c6b6e6f33aee9d4b24796868/wild-plants_itadori_21652.png"
  title: "Illustration of Japanese knotweed"
audio: null
selfAssessment:
  quizzes:
    - question: "When creating a package with apm, what is the role of the applyTo field in an .instructions.md file?"
      answers:
        - text: "It specifies the type of agent the instruction applies to"
          correct: false
          explanation: "applyTo specifies file or directory path patterns, not agent types."
        - text: "It specifies the name of the dependent package to apply the instruction to"
          correct: false
          explanation: "applyTo specifies the file paths where the instruction applies, not dependent packages."
        - text: "It specifies the file path pattern that the instruction applies to"
          correct: true
          explanation: "applyTo accepts file or directory path patterns (e.g., articles/*.md). When installed for Claude Code, it is converted to the paths field in rules."
        - text: "It specifies the priority of the instruction as a numeric value"
          correct: false
          explanation: "applyTo specifies target file path patterns, not priority."
published: true
---

Context is crucial for AI coding agents to work effectively. Developers need to combine various elements such as prompt engineering, tool design, skills, and MCP to ensure agents can access the right information. However, the current situation is that individual developers manage these elements locally, making it difficult to share and reuse them across teams.

apm (Agent Package Manager) is a package manager for AI agents developed by Microsoft. It resolves dependencies like npm or pip while providing a system to package, manage, and share agent prompts, tools, skills, and MCP as manifests. Manifests are hosted on Git repositories such as GitHub and can be installed from there. This is expected to make it easy to share and reuse agent building blocks within teams.

Sharing skills and MCP is already partially achieved through [plugins](https://code.claude.com/docs/ja/plugins-reference), but apm provides more advanced management capabilities, such as resolving dependencies across tools and managing multiple skills and MCP together with a single command, and reproducing the same dependency set through lock files. apm supports the following primitives:

- Agents: Definitions of sub-agent building blocks specialized for specific tasks
- Instructions: Rules and guidelines defined for agents
- Skills: Specific instructions for executing tasks, conforming to the [Agent Skills](https://agentskills.io/home) specification
- Hooks: Scripts invoked at specific points in the agent's execution flow
- Prompts: Templates that provide context and guidance to agents
- Plugins: Mechanisms for incorporating pre-packaged skills and MCP into agents

This article introduces the basics of using apm.

## Installing apm

First, install the `apm` command with the following command:

```bash
# macOS/Linux
curl -sSL https://aka.ms/apm-unix | sh
# Windows (PowerShell)
irm https://aka.ms/apm-windows | iex
```

Once installation is complete, you can verify that apm was installed correctly with the following command:

```bash
$ apm --version

Agent Package Manager (APM) CLI version 0.8.11 (81082e2)
```

## Installing packages

To install agent packages using apm, use the `apm install` command. Let's try installing [microsoft/apm-sample-package](https://github.com/microsoft/apm-sample-package), the most basic configuration.

```bash
apm install microsoft/apm-sample-package
```

You can install a specific version by appending a tag name after `#`.

```bash
apm install microsoft/apm-sample-package#v1.0.0
```

When you run the `apm install` command, packages are installed through the following steps:

1. A manifest file called `apm.yml` is created and the installed package is added to the `dependencies` section
2. The package is downloaded to the `apm_modules` directory
3. Dependencies are resolved and skills and MCP are deployed to directories used by AI agents (`.claude/` or `.github/`)
4. A lock file `apm.lock.yaml` is generated

First, a manifest file called `apm.yml` is created. It contains the package's metadata and dependencies. You can see that the installed package has been added in array format to the `dependencies` section.

```yaml:apm.yml
name: apm-test
version: 1.0.0
description: APM project for apm-test
author: azukiazusa1
dependencies:
  apm:
  - microsoft/apm-sample-package
  mcp: []
scripts: {}
```

Once dependency resolution is complete, a lock file called `apm.lock.yaml` is generated. It records the exact resolved state of all dependencies in the project. Just like `package-lock.json`, it guarantees that the same set of dependencies will be reproduced when the same lock file is provided.

```yaml:apm.lock.yaml
lockfile_version: '1'
generated_at: '2026-04-16T11:10:34.684248+00:00'
apm_version: 0.8.11
dependencies:
- repo_url: microsoft/apm-sample-package
  host: github.com
  resolved_commit: fb2851683be0e0e7711421d518bd8dba23b0b1f6
  package_type: apm_package
  deployed_files:
  - .github/agents/design-reviewer.agent.md
  - .github/instructions/design-standards.instructions.md
  - .github/prompts/accessibility-audit.prompt.md
  - .github/prompts/design-review.prompt.md
  - .github/skills/style-checker
  content_hash: sha256:744cca54cc8ff7ca90aa1dd621c2f98c6291cd793815afe8518001cc94b8aba9
- repo_url: github/awesome-copilot
  host: github.com
  resolved_commit: 9d117370f901e2244316dfd8cf5362435705b658
  virtual_path: skills/review-and-refactor
  is_virtual: true
  depth: 2
  resolved_by: microsoft/apm-sample-package
  package_type: claude_skill
  deployed_files:
  - .github/skills/review-and-refactor
  content_hash: sha256:9236d06a1500089ddb46975b866e9a63478e502afe7095b1980c618678a7c7fe
```

Dependency packages are downloaded to the `apm_modules` directory, where the source code of installed packages is stored.

```sh
apm_modules
├── github
│   └── awesome-copilot
│       └── skills
│           └── review-and-refactor
│               └── SKILL.md
└── microsoft
    └── apm-sample-package
        ├── apm.yml
        ├── CODE_OF_CONDUCT.md
        ├── CONTRIBUTING.md
        ├── LICENSE
        ├── README.md
        └── SECURITY.md

7 directories, 7 files
```

Installed packages are automatically deployed to directories used by AI agents (`.claude/` or `.github/`). Here, agents, skills, and prompts have been deployed to the `.github/` directory, and if you're using GitHub Copilot, the agent can use the skills and prompts right away.

```sh
.github
├── agents
│   └── design-reviewer.agent.md
├── instructions
│   └── design-standards.instructions.md
├── prompts
│   ├── accessibility-audit.prompt.md
│   └── design-review.prompt.md
└── skills
    ├── review-and-refactor
    │   └── SKILL.md
    └── style-checker
        └── SKILL.md

7 directories, 6 files
```

If you're using a different coding agent such as Claude Code or Codex, you'll need to deploy to a different directory. When the `apm install` command is run, if directories like `.claude` or `.codex` exist, packages are automatically deployed to the corresponding directory. Alternatively, you can use the `--target` option to explicitly specify the deployment target.

```bash
apm install microsoft/apm-sample-package --target claude
```

By specifying `--target claude`, packages are deployed to the `.claude` directory. You can see that apm absorbs the differences between AI agents and deploys to the appropriate location.

```sh
.claude
├── agents
│   └── design-reviewer.md
├── commands
│   ├── accessibility-audit.md
│   └── design-review.md
├── rules
│   └── design-standards.md
└── skills
    ├── review-and-refactor
    │   └── SKILL.md
    └── style-checker
        └── SKILL.md

7 directories, 6 files
```

## Package scripts

`apm.yml` also has a `scripts` section where you can define commands and run them just like `npm run`. For example, let's define a `style-check` command as follows. This command invokes the `style-checker` skill from Claude Code.

```yaml:apm.yml
scripts:
  style-check: 'claude "/style-checker"'
```

Commands defined in the `scripts` section can be run with the `apm run` command. Note that `apm run` is currently an experimental feature.

```bash
apm run style-check
```

## Creating a package

Here we'll briefly walk through the process of creating a package from scratch and publishing it to a GitHub repository. First, create a new package with the `apm init` command.

```bash
apm init writing-assistant
```

Running the command will prompt you to enter the package name and description in an interactive format. After answering all questions, a manifest file called `apm.yml` will be generated.

```yaml:apm.yml
name: writing-assistant
version: 1.0.0
description: APM project for writing-assistant
author: azukiazusa1
dependencies:
  apm: []
  mcp: []
scripts: {}
```

Building blocks such as instructions and skills to add to the package are placed in the `.apm` directory. The following directory structure is recommended for each primitive type:

```sh
.apm
├── agents
│   └── *.agent.md
├── instructions
│   └── *.instructions.md
├── prompts
│   └── *.prompt.md
├── skills
│   └── <skill-name>
│       └── SKILL.md
└── hooks
    ├── *.json
    └── scripts
        └── *.sh, *.py ...
```

### Instructions

Instructions define rules and guidelines for agents and are placed in the `.apm/instructions` directory. These files describe rules that agents should follow, such as coding style, conventions, and guidelines. Let's define an instruction for writing technical articles as an example.

`.instructions.md` files require two metadata fields in the YAML frontmatter:

- `description`: A description of the instruction. Write a concise sentence explaining the content of the instruction
- `applyTo`: Specifies the files or directories to which the instruction applies

````markdown:.apm/instructions/technical-article.instructions.md
---
description: "Instructions for writing technical articles. Defines style and structure guidelines for writing technical articles."
applyTo: "articles/*.md"
---

### Article structure

1. **Introduction** — Start with "This article..." and briefly describe the theme, background, and purpose
2. **Body** — Develop logically using `##` / `###` headings. Each section explains specific technical elements or procedures
3. **Summary** — Reconfirm key points in bullet points. Use the heading `## Summary`
4. **References** — List referenced official documents and articles under the heading `## References`

### Tone

- Use a professional yet accessible tone
- Prioritize objective explanations. Use phrases like "I think..." or "I felt..." for personal opinions
- Target audience is engineers interested in web development. Assume some foundational knowledge but explain new concepts thoroughly
- Use transition words like "however," "also," "for example," "therefore," and "next" to make the logical flow clear

### Markdown conventions

**Code blocks**

Always include a language identifier. To indicate a file name, append `:filename`.

```ts:src/index.ts
// code
```

```

To show diffs, use `diff`.

```

```diff
- deleted line
+ added line
```

**Callouts**

```
:::info
Supplementary information
:::

:::tip
Tips and recommendations
:::

:::warning
Warnings and cautions
:::
```
````

### Skills

Skills define specific instructions for executing tasks and are placed in the `.apm/skills` directory. Skills must have names that conform to the [Agent Skills](https://agentskills.io/home) specification:

- 1 to 64 characters
- Lowercase alphanumeric characters and hyphens only
- Consecutive hyphens (`--`) are not allowed
- Cannot start or end with a hyphen

In addition to the `SKILL.md` file containing instructions for the agent, you can place files and scripts needed for skill execution in the same directory. Added resources are deployed to the `apm_modules/` directory where AI agents can reference them.

Let's define a skill called `tech-article-reviewer` for reviewing technical articles. `name` and `description` are required attributes. Per the Agent Skills specification, `name` must be 64 characters or fewer and `description` must be 1024 characters or fewer.

````markdown:.apm/skills/tech-article-reviewer/SKILL.md
---
name: tech-review
description: A skill for reviewing technical books and manuscripts for software engineers, providing improvement suggestions from the perspectives of structure, technical accuracy, and reader experience. Triggered when users request reviews of manuscripts, chapter drafts, tutorial articles, or technical documents. Handles all review work related to technical book production, including writing support, editorial feedback, structural improvement, code review (code within books), and reader level adjustment.
---

# Technical Book Manuscript Review Skill

Review manuscripts for technical books, tutorials, and technical articles for software engineers from a professional editor's perspective, providing specific improvement suggestions.

## Overall Review Flow

Upon receiving a manuscript, proceed with the review in the following order.

### 1. Initial Analysis (What to Understand First)

Before reading the manuscript, confirm or estimate the following:

- **Target readers**: Beginner / Intermediate / Advanced level
- **Book type**: Introductory / Reference / Cookbook / Tutorial / Practical guide
- **Target technology**: Language, framework, tools, etc.
- **Manuscript stage**: First draft / Second draft / Near final

If the user hasn't specified these, estimate from the manuscript content and confirm: "I'll review this as an intermediate-level tutorial on XX — does that match your intent?"

### 2. Macro Review (Structure and Big Picture)

Start with the big picture. Save detailed grammar and typos for later.

**Perspectives for checking structural logic:**

- Is there a logical flow in the arrangement of chapters and sections? Can readers naturally understand "why this order?"
- Does the content build progressively, where concepts learned in earlier chapters are applied in later ones?
- Do difficult concepts appear suddenly? (Sharp difficulty jumps)
- Is the volume balance between chapters appropriate? (No extremely long or short chapters)

**Scope appropriateness:**

- Is the content too broad or too narrow for the book's title and purpose?
- Is it clear "what the reader will be able to do after reading this book?"

### 3. Micro Review (Quality of Each Chapter/Section)

#### Technical Accuracy

This is the most important aspect. It directly impacts the credibility of the technical book.

- Are there syntax or logic errors in code samples?
- Are API and library versions specified? Are deprecated features being used?
- Are there errors or inaccurate descriptions in technical explanations?
- Are security anti-patterns being presented as best practices?

Verify whether code actually works to the extent possible. If code can be run in a container environment, try running it.

#### Reader Experience

- When introducing new concepts, is the motivation "why this is needed" presented first?
- Are definitions or explanations provided when specialized terms first appear?
- Do concrete examples follow abstract explanations?
- Are there signposts like "summary so far" or "what to learn next?"

#### Code Sample Quality

Code in technical books isn't sufficient just because it "works." Since it's meant for readers to learn:

- Do variable and function names express intent? (Avoid meaningless names like `x`, `tmp`)
- Is the structure progressively more complex? (Start simple, gradually add features)
- Do comments explain "why" rather than "what?"
- Is error handling included? (Instill production code habits)
- Can it be copied and pasted and run? (No missing imports, undefined variables)

### 4. Consistency Check

Verify uniformity across the entire book:

- **Terminology consistency**: Are different terms used for the same concept? (e.g., mixing "function" and "method," mixing "deploy" and "deployment")
- **Code style consistency**: Are indentation, naming conventions, and language versions consistent across chapters?
- **Writing style consistency**: Is there mixing of formal and informal styles?
- **Figure/table formatting**: Are captions, numbering, and reference methods unified?

### 5. Review Report Output

Output the review results in the following structure:

```
# Manuscript Review Report

## Overview
- Target: [Manuscript title/chapter number]
- Target readers: [Level]
- Overall assessment: [Brief overall evaluation]

## Strengths
[Specifically highlight the manuscript's strengths. Sharing what works well maintains the author's motivation]

## Critical Improvement Suggestions (Priority: High)
[Technical errors, major structural issues — must fix before publication]

## Improvement Suggestions (Priority: Medium)
[Reader experience improvements, clarification — would make it better]

## Minor Notes (Priority: Low)
[Typos, expression tweaks, preference-level suggestions]

## Code Review
[Specific feedback for each code sample. Include corrected code]

## Next Steps
[Actions the author should take next]
```

## Review Approach

- **Respect the author**: The manuscript is a culmination of the author's expertise and effort. Aim for constructive feedback, not criticism
- **Be the reader's advocate**: Always consider "how would someone reading this explanation for the first time feel?"
- **Be specific in suggestions**: Instead of "unclear," say "adding an example of XX would make this easier to understand"
- **Prioritize**: Pointing out everything at the same importance level overwhelms the author. Start with critical issues
````

### Adding dependency packages

By adding dependency packages, those packages will be bundled with the project-specific content in `.apm/` and installed together. As an example, let's add the [Context7](https://context7.com/) MCP server, which fetches up-to-date documentation, as a dependency. Currently, MCP servers cannot be installed directly, so you need to add them manually to the `dependencies` section of `apm.yml`.

```yaml:apm.yml
dependencies:
  mcp:
  - io.github.upstash/context7
```

Then run the `apm install` command to install the Context7 MCP server. You'll be prompted for a Context7 API key, but you can skip it here.

```bash
apm install
```

Once installation is complete, you can see that a `.vscode/mcp.json` file has been created with the Context7 MCP server information.

```json:.vscode/mcp.json
{
  "servers": {
    "io.github.upstash/context7": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@upstash/context7-mcp"
      ],
      "env": {
        "CONTEXT7_API_KEY": "${input:context7-api-key}"
      }
    }
  },
  "inputs": [
    {
      "type": "promptString",
      "id": "context7-api-key",
      "description": "API key for authentication",
      "password": true
    }
  ]
}
```

### Publishing a package

To publish a package, simply place `apm.yml` and the building blocks in a Git repository such as GitHub and commit and push.

```sh
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<username>/writing-assistant
git push -u origin main
```

Published packages can then be installed with the `apm install <username>/<repository>` command.

```bash
apm install azukiazusa1/writing-assistant --target claude
```

After successful installation, you can see that instructions and skills have been deployed to the `.claude` directory, and MCP server information has been deployed to `.vscode/mcp.json`. It appears that MCP configurations are not deployed to the `.claude` directory.

```sh
.
├── .claude
│   ├── rules
│   │   └── technical-article.md
│   └── skills
│       └── tech-reviewer
│           └── SKILL.md
├── .gitignore
├── .vscode
│   └── mcp.json
├── apm.yml
└── apm.lock.yaml
```

The instruction for writing technical articles from the `instructions` directory has been deployed as a rule following Claude Code's conventions. You can also see that the `applyTo` field has been properly converted to `paths`.

```yaml:.claude/rules/technical-article.md
---
paths:
- "articles/*.md"
---

### Article structure

...
```

## Summary

- apm is a package manager from Microsoft that lets you package, manage, and share AI agent building blocks
- Package building blocks come in 6 types: agents, instructions, skills, prompts, hooks, and plugins
- The `apm install` command installs packages hosted on repositories such as GitHub
- Installed packages are automatically deployed to directories used by AI agents (`.claude/` or `.github/`). The `--target` option allows you to explicitly specify the deployment target
- The `apm init` command creates a new package. Building blocks are placed in the `.apm/` directory
- To publish a package, simply place `apm.yml` and building blocks in a Git repository such as GitHub and commit and push

## References

- [microsoft/apm: Agent Package Manager](https://github.com/microsoft/apm)
- [APM – Agent Package Manager | Agent Package Manager](https://microsoft.github.io/apm/)
