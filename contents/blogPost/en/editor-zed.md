---
id: Rqc7eUXoUYZWDtAdvoKnW
title: "Switching My Editor to Zed"
slug: "editor-zed"
about: "Zed is a native application written in Rust, known for its blazing-fast performance and lightweight design. In this article, I walk through how to install Zed and share the key features and impressions from my hands-on experience."
createdAt: "2026-06-05T19:04+09:00"
updatedAt: "2026-06-05T19:04+09:00"
tags: ["Zed"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1DDmqwLCQ9zLvAeD9L3TAS/67c62eb1f005b326521c428080c0d05d/kuma_sake_13180-768x610.png"
  title: "鮭を咥えるクマのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Which of the following correctly describes ACP, as explained in the article?"
      answers:
        - text: "A protocol developed by Anthropic for communication between AI models and applications"
          correct: false
          explanation: "The article states that ACP was developed by Zed, not Anthropic."
        - text: "A communication specification for editor extensions provided by GitHub"
          correct: false
          explanation: "ACP was developed by Zed, not GitHub."
        - text: "An open protocol developed by Zed that standardizes communication between agents and editors"
          correct: true
          explanation: "As described in the article, ACP (Agent Client Protocol) is an open protocol developed by Zed to standardize communication between agents and editors."
        - text: "An industry standard used as an alias for MCP (Model Context Protocol)"
          correct: false
          explanation: "ACP and MCP are different protocols. The article introduces ACP as a protocol independently developed by Zed."
    - question: "Regarding how usage is counted when calling the Claude Agent from Zed, which option does the article describe?"
      answers:
        - text: "It is consumed from the monthly credit balance"
          correct: true
          explanation: "As the article explains, calling Claude from Zed counts as third-party tool usage, and usage is consumed from the monthly credit balance."
        - text: "It is treated the same as first-party usage and can be used freely within the subscription limits"
          correct: false
          explanation: "The article distinguishes between first-party tool usage (within subscription limits) and third-party usage via Zed, which consumes from the credit balance."
        - text: "It is included in the Zed subscription fee with no additional cost"
          correct: false
          explanation: "The article makes no such statement; it explains that usage is consumed from Claude's monthly credit balance."
        - text: "It is charged on a pay-per-use basis only when a separate API key is configured"
          correct: false
          explanation: "The article describes installing Claude via the ACP registry, not via an API key, and states that usage is consumed from the credit balance."
published: true
---
Looking back, since I started my career as an engineer, I spent the vast majority of my time writing code with Visual Studio Code as my companion. My first encounter with VS Code was nothing short of a shock — the impact was immeasurable. At the time, editors like Sublime Text and Atom were mainstream, yet VS Code occupied a perfect sweet spot between a full IDE and a lightweight editor, with snappy performance and a rich ecosystem of extensions — the very embodiment of what engineers had always wanted. Since then, VS Code became my home for writing code, and I spent countless hours customizing themes, keybindings, and trying out extension after extension to craft exactly the environment I wanted.

For engineers, an editor is something that goes beyond being called a mere tool. It's fair to say that I spent the majority of my day inside it. But in recent years, I've started to sense a shift in that dynamic. The catalyst is, without doubt, the rise of AI coding agents. Around 2026, as agent capabilities improved dramatically, the role of human developers seemed to shift away from writing code directly toward making judgments and giving instructions — activities like requirements definition, design, code review, and validation. The terminal and desktop apps used to direct agents are becoming the new home for coding time, and the editor is transforming from a place to write code into a place to read and understand it.

In this context, what's demanded of an editor has also changed. Rather than needing advanced features, what matters most is being lightweight and fast. VS Code is an excellent editor, but as an Electron-based application, I sometimes found startup and overall performance to be sluggish. That's when Zed started attracting attention as a new alternative. Zed is a native application written in Rust, boasting extremely fast performance and a lightweight design. I've recently made the switch to Zed, and I've been completely won over by its speed and clean interface.

In this article, I'll walk through how to install Zed and introduce the key features and impressions I gathered from using it.

## Installation

On macOS, you can install Zed by downloading the installer from the [download page](https://zed.dev/download) or by using Homebrew.

```bash
brew install --cask zed
```

To install the preview version, run the following command.

```bash
brew install --cask zed@preview
```

After installing via Homebrew, the `zed` command becomes available. If you've been using `code .` with VS Code or similar editors, you can likewise use `zed .` to open Zed.

```bash
zed .
```

If you installed via the installer, you can launch Zed from the Applications folder. To make the `zed` command available, open Zed, press `cmd + shift + p` to open the command palette, and select `Install cli binary`.

![](https://images.ctfassets.net/in6v9lxmm5c8/5NUXWgD6MCxfynCbSKT44o/d46e534403c09c16225fd69c326900a9/image.png)

When opening a project for the first time, Zed displays a warning that it is starting in restricted mode for safety. In restricted mode, project settings aren't loaded and features like LSP and MCP servers are unavailable. If you trust the project, select "Trust and continue" to disable restricted mode and open the project.

## Key Features

By selecting `import vscode settings` from the command palette, you can import your main VS Code settings into Zed. Keybindings are also configured to VS Code style, which made the transition from VS Code quite smooth.

![](https://images.ctfassets.net/in6v9lxmm5c8/5Q2zZyLqBfsAZNdQVDdiGL/038735c383418d14f0f26cc79ac20af4/image.png)

By default, the file explorer is displayed in the right sidebar. To get a layout closer to what I was used to in VS Code, I moved the file explorer to the left sidebar. You can do this by right-clicking the file explorer icon in the bottom bar (the one highlighted in blue) and selecting "Dock Left".

![](https://images.ctfassets.net/in6v9lxmm5c8/1cANfArE60YQofun9b7PGu/b806e10ffc1ffa521da3e023df4dc649/image.png)

I also moved the Git Panel to the left sidebar. The Git Panel provides functionality similar to VS Code's Source Control panel, allowing you to view changed files, inspect diffs, and create commits.

![](https://images.ctfassets.net/in6v9lxmm5c8/2PLbYyGaSaHYpy7Uu5QX6R/0b726bbee7da5f5a413dff69060309d6/image.png)

The current branch name is shown at the top of the screen. Clicking it lets you switch branches or create new ones.

![](https://images.ctfassets.net/in6v9lxmm5c8/1xSbJb8imRBLzJM4vBstG2/fcea79d487d127f39defed7638622759/image.png)

`cmd + shift + f` opens a project-wide search. Results aren't shown until you confirm the search — unlike VS Code's real-time results — but the display is remarkably fast, returning results instantly even on projects with thousands of files. You can also click "Toggle Replace" to perform a find-and-replace.

![](https://images.ctfassets.net/in6v9lxmm5c8/3GsoHW8jfIojUBTIaHo2nm/d4ce21edbb1a5d0d57434fa69ae68d6d/image.png)

You can open a terminal with `control + shift + @` or by clicking the icon in the bottom bar. The terminal appears at the bottom of the editor, and you can open multiple terminals and switch between them. The feel is quite similar to VS Code's integrated terminal.

![](https://images.ctfassets.net/in6v9lxmm5c8/65SJOisocmfHdxcC9uKaSW/0464ee3d0796dfef4d0b4faf9433629b/image.png)

Even without installing any extensions, I was able to run Vitest tests directly from the code. A play icon appears to the left of the line numbers, and clicking it runs the test. Results are displayed in the terminal. Major test frameworks including Jest, Vitest, Bun, and Node appear to be supported.

![](https://images.ctfassets.net/in6v9lxmm5c8/5AnOUkQFsZNUYOtdZ4ErSz/c2c36681e31c325163371d4a18d64c9d/image.png)

![](https://images.ctfassets.net/in6v9lxmm5c8/EeHWfAsdMPjLsnKJGCf4E/380d5592203a578c974c1269786b151c/image.png)

File formatting on save also appears to be supported out of the box. By default, TypeScript's built-in formatter is used, but many projects use formatters like Prettier or Oxlint. In those cases, add the following configuration to Zed's settings file. Project-specific settings are best placed in `.zed/settings.json` at the project root. You can open this file from the command palette by selecting `zed: open project settings file`.

```json:.zed/settings.json
{
  "languages": {
    "JavaScript": {
      "formatter": {
        "external": {
          "command": "prettier",
          "arguments": ["--stdin-filepath", "{buffer_path}"]
        }
      }
    }
  }
}
```

To run ESLint when saving a file, add the following configuration.

```json:.zed/settings.json
{
  "languages": {
    "JavaScript": {
      "code_actions_on_format": {
        "source.fixAll.eslint": true
      }
    }
  }
}
```

## Zed and AI Agents

Zed appears to have built-in AI functionality, allowing you to issue instructions to agents that can read and write your project code from the agent panel, and to enable code completion. To use AI features, you can either use Zed's native [Zed Agent](https://zed.dev/docs/ai/zed-agent) or leverage third-party AI agents such as Claude Code, Codex, or GitHub Copilot. The ability to interact directly with third-party AI agents appears to be enabled by a protocol called [ACP (Agent Client Protocol)](https://agentclientprotocol.com/get-started/introduction). ACP is an open protocol developed by Zed to standardize communication between agents and editors.

https://zed.dev/blog/bring-your-own-agent-to-zed

As a test, let's set up Claude to be callable from Zed's agent panel. Note that for Claude subscriptions, usage is counted differently depending on whether you use it through Anthropic's first-party tools or through third-party tools (`claude -p`). The former can be used freely within subscription limits, while the latter consumes from the monthly credit balance. Calling the Claude agent from Zed falls under the third-party usage category.
https://zed.dev/blog/anthropic-subscription-changes

To install third-party AI agents, using the ACP registry is the standard approach. Open the command palette and select `zed: acp registry`. From the list, select "Claude Agent" and click "Install".

![](https://images.ctfassets.net/in6v9lxmm5c8/7IznkSwOy7BgARNBNv2h7F/4e6bc3a00b4924f679e7791a261847f5/image.png)

Once installation is complete, you can select "Claude Agent" from the top menu in the agent panel.

![](https://images.ctfassets.net/in6v9lxmm5c8/5UtflbMCuD05pks5KP19Ol/a2b0163b0b752f81d9eed2922b438a45/image.png)

If you're already authenticated with Claude Code, you can immediately start interacting with Claude from Zed. The project's `CLAUDE.md` file is loaded, and skills and commands are available as well. You can also reference files using `@` while giving instructions.

![](https://images.ctfassets.net/in6v9lxmm5c8/37dfSoCgSawgnY3mrKxjzi/2e52a24734d7dd50206091e292df05a3/image.png)

## Enabling GitHub Copilot for Code Completion

Next, let's enable GitHub Copilot for code completion. First, open Zed's global settings file by running `zed: open settings file` from the command palette. This opens `~/.config/zed/settings.json`. Add the following configuration and save.

```json:.config/zed/settings.json
{
  "edit_predictions": {
    "provider": "copilot"
  }
}
```

After adding this setting, the GitHub Copilot icon will appear in the bottom bar. Click the icon and select "Sign in to Copilot".

![](https://images.ctfassets.net/in6v9lxmm5c8/3ykgsjksLV8jW8pWGuvTWB/2a9bde28ae8854c83f0c44c65bbae865/image.png)

A dialog will display an authentication code. Copy the code and click "Connect to GitHub".

![](https://images.ctfassets.net/in6v9lxmm5c8/4NWwbwbYRSz9GB2xio3Hkd/a3d7aa250d30f630ad9f1bee3f684ee9/431a72af-478a-4c34-be8b-4e43a9394e17.png)

Your browser will open to GitHub's authentication page. Sign in with your GitHub account and proceed. When prompted to enter the authentication code, paste the code you copied earlier and click "Continue". Once authentication is complete, if you see "Copilot Enabled!" back in Zed, GitHub Copilot is now active.

Try writing some code in the editor and GitHub Copilot will start showing completion suggestions. Just like GitHub Copilot in VS Code, you can accept suggestions with the `tab` key.

![](https://images.ctfassets.net/in6v9lxmm5c8/W8nSvUo8sWiaFGwqbJ4EF/a88e99026c5a62e0276568f331fb36fa/image.png)

## Installing Extensions

Like VS Code, Zed lets you add functionality by installing extensions. That said, I personally find that I need fewer advanced editor features these days, and given the growing trend of supply chain attacks, I feel it's best not to install too many extensions. You can browse available extensions by selecting `zed: extensions` from the command palette, and click "Install" to install one.

![](https://images.ctfassets.net/in6v9lxmm5c8/4T7rfnguSJd1FafmGFqQMW/5c03c5133d66d53e1d84e7e46bca5834/image.png)

If you want to build your own extension, you'll need to develop it in Rust and publish it to a GitHub repository. The repository must be linked as a submodule of [zed-industries/extensions](https://github.com/zed-industries/extensions). For more details, refer to the [Developing Extensions](https://zed.dev/docs/extensions/developing-extensions) documentation.

## References

- [Getting Started | Getting Started with Zed](https://zed.dev/docs/getting-started)
- [Zed — From The Blog](https://zed.dev/blog)
