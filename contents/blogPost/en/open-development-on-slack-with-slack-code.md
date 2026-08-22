---
id: TAty7kpIl7GVMmwB6UWPS
title: "Trying Out Slack Code: Open Development on Slack"
slug: "open-development-on-slack-with-slack-code"
about: "Slack Code brings open, team-wide development into Slack. Instead of DMs and threads, you create a special channel called a code channel and work with a coding agent as a whole team. Here is what it was like to actually try it out."
createdAt: "2026-08-22T10:35+09:00"
updatedAt: "2026-08-22T10:35+09:00"
tags: ["Slack", "AI"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3QejWtvpZ4ob6yptrQneDG/3d5aa3363f4de978d1ad86c8a156c8da/bird_cute_komadori_10920-768x640.png"
  title: "コマドリのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "What limitation of Slack's HTML preview feature does the article mention?"
      answers:
        - text: "It cannot display anything until the content is converted into a Canvas"
          correct: false
          explanation: "The article mentions Canvas in a different context, noting that Devin's tooling did not support it yet. It is not a prerequisite for the HTML preview."
        - text: "It is only available on the Enterprise plan"
          correct: false
          explanation: "The plan restriction in the article applies to Claude Tag, not to the HTML preview."
        - text: "It only works with static content"
          correct: true
          explanation: "As the article states, the preview is limited to static content, but it still looks useful for sharing a prototype and gathering feedback."
        - text: "It can only be opened from the \"Artifacts\" tab in the sidebar"
          correct: false
          explanation: "The article says you can run the artifact right there once the HTML file is shared, and says nothing about where it can be opened from."
published: true
---
In software development today, it has become routine to build things quickly and easily with coding agents like Claude Code, Codex, and Devin. These agents run in a terminal on an individual's machine, though, which means the conversation stays confined to that person's environment and makes sharing information across a team difficult.

For example, an exchange with a coding agent holds a wealth of context about why a particular design was chosen, or why another one was not. By the time the work reaches review, most of that context is gone, and reviewers can struggle to understand the intent behind the design. And even when an individual has figured out more effective ways to work with an agent, there has rarely been an opportunity to share that knowledge with the rest of the team.

Some teams have tried to address this by using coding agents in open spaces like Slack or Discord. I have tried the approach of mentioning an agent in Slack to kick off a session a number of times myself. There are real benefits: sessions are easy to start, and the whole team can see what is currently being worked on. But there were downsides too. Thread activity easily turns into noise, code diffs are hard to read inside Slack, and there is no good way for a team to review the resulting artifacts.

Slack Code offers a way to develop openly on Slack. Rather than working through DMs or threads, you create a special channel called a code channel and interact with a coding agent there. A code channel is not a one-on-one conversation with the agent; the whole team can work with it together. Slack-specific views such as code, Canvas, and HTML views also let the team review diffs and artifacts. You can check what the agent is currently working on from the sidebar.

This article covers my impressions from actually trying out Slack Code.

## Installing an agent in Slack

To use Slack Code, you need to install a supported AI app or agent in Slack. Slack Code appears to support the following agents today.

- [Claude](https://slack.com/marketplace/A08SF47R6P4-claude) (this required [Claude Tag](https://www.anthropic.com/news/introducing-claude-tag), which is only available on the Enterprise or Team plan)
- [Devin](https://slack.com/marketplace/A06A3TU8H39-devin)
- [GitHub Copilot](https://slack.com/marketplace/A01BP7R4KNY-github)
- [Vercel](https://slack.com/marketplace/A024HTHQZ47-vercel)

For this article I tried Slack Code with Devin. From the link above, click the "Add to Slack" button to install it into your Slack workspace.

![The screen for installing Devin into a Slack workspace](https://images.ctfassets.net/in6v9lxmm5c8/6y98a10rTnnMPnl86WD4a5/4bddfd4a06563572122ebf26ef7f05a1/image.png)

## Creating a code channel

Now let's actually create a code channel and try working with an agent. The documented way to create one is to "mention the agent with a specific request and the channel will be created automatically," but no matter how many times I tried, the agent never created a code channel for me. So I created one manually instead.

To create one manually, select "Agents and tools" in the sidebar and click the "+" button at the top.

![The "Agents and tools" section in the sidebar with the "+" button displayed at the top](https://images.ctfassets.net/in6v9lxmm5c8/6Lp6tOqLhETCkPstnLc1Ce/c366151c8ab489451c34bc5528426ada/image.png)

A modal for creating a code channel appears. Choose the agent and workspace, enter a prompt, and click the "Create" button.

![The code channel creation modal with fields for the agent, workspace, and prompt](https://images.ctfassets.net/in6v9lxmm5c8/01IfvHx0u0kRpmu9IuMYgB/fd833dbcd2633e451617c665fede5d7a/image.png)

The moment the channel was created, a session with Devin began. The new channel shows up under the "Code channels" section in the sidebar, with a loading icon while Devin is working. The channel name appears to be generated automatically from the contents of the prompt, and the prompt you entered when creating the channel is posted as the channel's first message.

![The created channel listed under the "Code channels" section in the sidebar, with the prompt posted as the first message](https://images.ctfassets.net/in6v9lxmm5c8/2rW6WGjDDVE46McIjNUhn9/f6824fd4e55c53fc44b6e5e6839cf6d9/image.png)

The first thing it did was attach its design approach as a Markdown file. Files created during a session seem to be added to an "Artifacts" tab. (I had hoped it would share them through Slack's Canvas feature, but Devin's tooling does not appear to support that yet.)

![The Markdown design document attached by Devin, shown in the "Artifacts" tab](https://images.ctfassets.net/in6v9lxmm5c8/2GFmKmRSGZM7j8EgsQDTc0/49de5acbfeeb90dddb47541524a660af/image.png)

After a quick glance at the design file, I had it go straight to implementation. Once the work was done and a PR was created, the code diff was shared in the channel. You can read the code from within Slack and leave comments on the spot to give feedback.

![The diff of the created PR displayed inside Slack](https://images.ctfassets.net/in6v9lxmm5c8/7DMmecdu8ZVw422LZdmClW/2080d499786d009bb13cc6a0cf0d253a/image.png)

When I submitted a line comment, the surrounding lines and my comment were added to the message input box. It seems the idea is to start a new exchange from that state. Compared to a PR discussion on GitHub, comments are not persisted, so you cannot go back and revisit them later, which felt a little inconvenient.

![A line comment submitted, with the surrounding lines and the comment added to the message input box](https://images.ctfassets.net/in6v9lxmm5c8/3O5uUNEcCBh0mr7U74EM9C/0bf115f3a83a8aa0193f72238c34565c/image.png)

If you send a request like "make the artifact viewable as an HTML preview" and have it share an HTML file, you can use Slack's HTML preview feature to run the artifact right there. It is limited to static content, but you could imagine having an agent build an HTML prototype and using it to gather feedback from teammates.

![An artifact rendered in place with Slack's HTML preview feature](https://images.ctfassets.net/in6v9lxmm5c8/2u5diPbrLhrN2qzkeU9Pvj/fedfced59b29bc7dd634e480e92dc0c3/image.png)

Once a session is finished, you can hide it by clicking the "×" button in the sidebar, or archive the channel.

## Summary

- Slack Code is a feature that provides a way to develop openly on Slack: you create a special channel called a code channel and the whole team can work with a coding agent there
- It supports agents such as Claude, Devin, GitHub Copilot, and Vercel
- Slack-specific views such as code, Canvas, and HTML views let a code channel double as a place for the team to review diffs and artifacts
- You can check what the agent is working on from the sidebar

## References

- [Agentic coding is now multiplayer: Introducing Slack Code](https://x.com/SlackHQ/status/2090415566351659267)
- [Build with AI as a team using Slack Code | Slack](https://slack.com/intl/en-gb/help/articles/54310833022355-Build-with-AI-as-a-team-using-Slack-Code)
- [Turning conversation into knowledge: how Slack builds human-agent teams | Claude by Anthropic](https://claude.com/blog/turning-conversation-into-knowledge-how-slack-builds-human-agent-teams)
