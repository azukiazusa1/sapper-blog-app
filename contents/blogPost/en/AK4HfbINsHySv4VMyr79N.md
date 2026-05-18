---
id: AK4HfbINsHySv4VMyr79N
title: "Trying Out the Hermes Agent and Grok Integration"
slug: "hermes-agent-grok-integration"
about: "Hermes Agent v0.14.0 adds integration with xAI's Grok. Grok's `x_search` tool can search posts on X (formerly Twitter), making it great for tracking real-time trends. This article walks through the Hermes Agent and Grok integration."
createdAt: "2026-05-18T19:10+09:00"
updatedAt: "2026-05-18T19:10+09:00"
tags: ["hermes-agent", "grok"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/NxiM8may9dWy0pwGBJDh4/1ce347657e363d7eb40705629f676431/image.png"
  title: "Illustration of a matcha cream and azuki bean parfait"
audio: null
selfAssessment:
  quizzes:
    - question: "Which of the following is NOT listed in the article as one of the tools that automatically becomes available with the same token when you log in to Grok via OAuth?"
      answers:
        - text: "x_search (a tool for searching posts on X)"
          correct: false
          explanation: "x_search is explicitly listed in the article as one of the four tools that become available with the same token after OAuth login."
        - text: "image_generate (a tool for generating images from text)"
          correct: false
          explanation: "image_generate is also listed in the article as one of the four tools that become available with the same token after OAuth login."
        - text: "code_execute (a tool for executing code)"
          correct: true
          explanation: "The four tools mentioned in the article are x_search, text_to_speech, image_generate, and video_generate. code_execute is not included."
        - text: "text_to_speech (a tool for converting text to speech)"
          correct: false
          explanation: "text_to_speech is also listed in the article as one of the four tools that become available with the same token after OAuth login."

published: true
---

[Hermes Agent](https://hermes-agent.nousresearch.com/) is an AI agent developed by Nous Research. It is designed as an autonomous agent that remembers what it has learned and grows more capable the longer it operates. It can be accessed from a variety of platforms—CLI, Slack, Discord, and others—and is built to be model-agnostic, not tied to any specific AI model.

In v0.14.0, full-fledged integration with xAI's Grok model was announced. A standout feature of Grok is the `x_search` tool, which can search posts on X (formerly Twitter), making it well suited for tracking real-time trends and pulling in the latest information. The newly announced Hermes Agent and Grok integration is notable because it lets you use Grok from your SuperGrok subscription via OAuth authentication, without an API key. In other words, if you already have an X account with SuperGrok enabled, you can search and make use of X posts from an AI agent without any additional charges.

:::info
Even without a SuperGrok subscription, I was able to use Grok with an account subscribed to the [X Premium](https://help.x.com/en/using-x/x-premium) Basic plan (980 yen / month).
:::

This article walks through what it's like to use the Hermes Agent and Grok integration.

## Installing Hermes Agent

First, install Hermes Agent. You can install it by running the following command.

```bash
# macOS/Linux
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
# Windows (PowerShell)
irm https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.ps1 | iex
```

Once the installation is complete, verify that the `hermes` command is available.

```bash
$ hermes --version
Hermes Agent v0.14.0 (2026.5.16)
```

## Setting Up the Grok Integration

Running the `hermes model` command displays a list of available providers. To use Grok, select "xAI Grok OAuth (SuperGrok Subscription)".

```bash
hermes model
```

![](https://images.ctfassets.net/in6v9lxmm5c8/7moDulC83kvSQtX8jjAiK4/9647c42fa5046adcf93f0ad3a8c5a4b0/image.png)

Once selected, your browser opens and the X OAuth flow begins. First, log in to your X account at accounts.x.ai.

![](https://images.ctfassets.net/in6v9lxmm5c8/uZE74Vt7qGbulOJjwev2M/4757d73c9929c0cf4b8cc4878be731d3/image.png)

After logging in, an "Authorize Grok Build" screen appears, so click "Allow".

![](https://images.ctfassets.net/in6v9lxmm5c8/30RoBw6BwuSwBo0jh8Z1ro/0dac2f582b3b24799328be8160ed6e8e/image.png)

Once authentication succeeds, the token is saved to `~/.hermes/auth.json`, Grok becomes available from Hermes Agent, and a model selection screen appears. Here I selected `grok-4.3`.

![](https://images.ctfassets.net/in6v9lxmm5c8/5Ge7xbNS9VcDejLIjnd5LV/fdf0db143b5ce639eefb63f41bea56d4/image.png)

Alternatively, you can configure the model directly from the CLI.

```bash
hermes config set model.default grok-4.3
hermes config set model.provider xai-oauth
```

When you log in via OAuth, the following four tools also become automatically available using the same token.

- `x_search`: A tool for searching posts on X
- `text_to_speech`: A tool for converting text to speech
- `image_generate`: A tool for generating images from text
- `video_generate`: A tool for generating videos from text

The `x_search` and `video_generate` tools are disabled by default. Before launching the agent, you need to enable them in advance by running the `hermes tools` command.

```bash
hermes tools
```

When "Select an option:" appears, choose "Configure 🖥️ CLI".

![](https://images.ctfassets.net/in6v9lxmm5c8/6GHybInDFlLeJovxKI5d8T/00271831fc8871105516704d6dba4db0/image.png)

After selecting "Configure 🖥️ CLI", a list of available tools is displayed. Select `🐦 X (Twitter) Search  (x_search (requires xAI OAuth or XAI_API_KEY))`.

![](https://images.ctfassets.net/in6v9lxmm5c8/1IlhWQ4qEutl4UzxyXog7c/5302fdd0454bca27f62cf4b2bd5f34b8/image.png)

## Searching Posts with Grok

Let's launch Hermes Agent and try out Grok. Run the following command to start the agent.

```bash
hermes
```

An interactive interface appears in the terminal.

![](https://images.ctfassets.net/in6v9lxmm5c8/2QiN4xl9fkEVE0aMeRDvmj/46ff83c1a7c7e2a0b9e41d37d41092cd/image.png)

Type the `/tools` command to check the list of available tools. You can see that the `x_search` tool for searching posts on X is listed.

![](https://images.ctfassets.net/in6v9lxmm5c8/3KJr5zwSZyvEHUrW76FaoY/c1d310d63c393fdc0435fa868be1d261/image.png)

Now let's use the `x_search` tool to search for the latest information. For example, try a prompt like "What was that UNIQLO backpack that's been going viral lately?".

```txt
What was that UNIQLO backpack that's been going viral lately?
```

A 🐦️ emoji appears, showing that the `x_search` tool is searching with keywords like "UNIQLO backpack" and "UNIQLO backpack new OR viral OR amazing OR best". In the end, it told me that the one going viral is UNIQLO's "Utility Backpack". Being able to get information from such a loose, casual question is one of Grok's strengths.

![](https://images.ctfassets.net/in6v9lxmm5c8/7hlPMsSfoOe8wC5YDCPXlW/d017e9d5f73d8c44eb7b351773564954/image.png)

Let's also ask which specific posts the information came from.

```txt
Which posts did you get that information from?
```

It gave me URLs of several posts it had referenced. Opening those URLs in a browser confirms that UNIQLO's Utility Backpack is indeed going viral.

![](https://images.ctfassets.net/in6v9lxmm5c8/2Z6Nq0O4BdBUkrIvgyahik/1e9090d499b41f77df7d15cd07678b7b/image.png)

You can also search by specifying a particular account. Let's search for the recent viral posts among [@azukiazusa9](https://x.com/azukiazusa9)'s posts.

```txt
[@azukiazusa9] Which posts have been going viral lately?
```

It searched using a query like `from:azukiazusa9 min_faves:50 since:2026-04-01`. It looks like the post sharing the `#fec_nagoya` talk slides is going viral.

![](https://images.ctfassets.net/in6v9lxmm5c8/2qZQueNecnyqxHSevLEPS1/6658258ace38c721b4bb6c7e1f15761e/image.png)

## Image Generation with Grok

Let's also try image generation with Grok. Using Hermes Agent's `image_generate` tool, you can generate images from text. The default provider is [FAL.ai](https://fal.ai/), so you need to switch the backend to `xAI Grok Imagine (image)` via the `hermes tools` command.

```bash
hermes tools
```

When "Select an option:" appears, choose "Reconfigure an existing tool's provider or API key".

![](https://images.ctfassets.net/in6v9lxmm5c8/0NnOgbClmBxwcV9ksA4cE/a3dab10c8347f69169bb87ccc829e878/image.png)

When the list of tools is displayed, select "🖼️ Image Generation (image_generate)".

![](https://images.ctfassets.net/in6v9lxmm5c8/3bRFCqeNORTRc8LKtiOFDH/f99fd326bfc221ef50aa83c601051ca7/image.png)

When the list of providers is displayed, select "xAI Grok Imagine (image)". If you are already logged in to Grok via OAuth, you won't be prompted for an API key. You can choose between `grok-imagine-image` and `grok-imagine-image-quality` as the model. The latter produces higher quality images, but takes longer to generate.

![](https://images.ctfassets.net/in6v9lxmm5c8/72FKtwcEJ45wBP1IHThsRp/0e0cedb932135299340b7d4a6c74f1ea/image.png)

Once the setup is complete, relaunch Hermes Agent and try a prompt like "Generate a sunset Mt. Fuji in ukiyo-e style".

```txt
Generate a sunset Mt. Fuji in ukiyo-e style
```

Image generation was performed with Grok Imagine as the backend, and the image was generated within a few seconds. The generated image is shown as a URL (`imgen.x.ai`).

![](https://images.ctfassets.net/in6v9lxmm5c8/1Aq2BnmkMyP51wmPTBA2vJ/037e7a4628c639e7c4b0263a58d2744c/image.png)

Opening the URL in a browser, you can see a stunning Mt. Fuji rendered in ukiyo-e style.

![](https://images.ctfassets.net/in6v9lxmm5c8/3bQM7XRN2jB16vTsbQK280/d2d13c20f83f4eb7cf6ac5e488ee8a20/xai-tmp-imgen-2448e689-50e8-48aa-9557-a9b754602ce1.jpeg)

## Summary

- The Hermes Agent and Grok integration lets you use Grok from your SuperGrok subscription via OAuth authentication, without an API key.
- Using the `x_search` tool, you can search posts on X (formerly Twitter).
- With Grok, your AI agent can track real-time trends and pull in the latest information.
- By switching the `image_generate` tool's provider to Grok Imagine, you can also do image generation with Grok.

## References

- [Hermes Agent — The Agent That Grows With You | Nous Research](https://hermes-agent.nousresearch.com/)
- [Connect Grok to Hermes Agent | xAI](https://x.ai/news/grok-hermes)
- [xAI Grok OAuth (SuperGrok Subscription) | Hermes Agent](https://hermes-agent.nousresearch.com/docs/guides/xai-grok-oauth)
- [X (Twitter) Search | Hermes Agent](https://hermes-agent.nousresearch.com/docs/user-guide/features/x-search)
