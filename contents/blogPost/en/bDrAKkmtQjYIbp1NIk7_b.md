---
id: bDrAKkmtQjYIbp1NIk7_b
title: "The `/grill-me` Skill for Thoroughly Interviewing a Design and Clarifying Requirements Before Implementation"
slug: "before-implementation-interview-design-requirements-grill-me"
about: "As coding agents grow more autonomous and parallel agent work becomes normal, shared understanding before implementation matters more than ever. This article introduces `/grill-me`, a skill for clarifying requirements and aligning humans and AI."
createdAt: "2026-06-14T11:14+09:00"
updatedAt: "2026-06-14T11:14+09:00"
tags: ["AI", "design", "Agent Skills"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4xowL5JOKPL0QSGA5o0YEb/47a6e43fbc2f52773641116fa8619d46/image.png"
  title: "An illustration of pudding a la mode"
audio: null
selfAssessment:
  quizzes:
    - question: "Which drawback of plan mode is pointed out in the article?"
      answers:
        - text: "Because it creates a plan without inspecting the codebase, the plan tends to ignore the existing design"
          correct: false
          explanation: "The article explains that plan mode presents a plan after thoroughly inspecting the codebase, so the issue is not that it skips investigation."
        - text: "Because the full design is presented all at once, users tend to approve it too quickly and lose control over the plan"
          correct: true
          explanation: "As the article explains, when the full picture is presented at once, users tend to approve it with a quick \"OK\" without breaking it down, making it harder for humans and AI to proceed through discussion."
        - text: "Because it creates a plan while changing code, unintended changes can slip in"
          correct: false
          explanation: "The article explains that plan mode never changes code and only performs investigation."
        - text: "Because it never asks questions, ambiguities in the requirements remain unresolved"
          correct: false
          explanation: "The article says that plan mode asks the user questions when something is unclear, so it is not true that no questions are asked."

    - question: "According to the article, what interaction format does the `/grill-me` skill use to keep control of the design on the human side?"
      answers:
        - text: "AI asks questions, and the user answers them"
          correct: true
          explanation: "As the article explains, a major characteristic is that control over the design stays on the human side because AI asks questions and the user answers them."
        - text: "The user writes out all requirements, and AI summarizes them"
          correct: false
          explanation: "The article describes a format where the user proceeds by answering AI's questions, not by writing out all requirements at once."
        - text: "AI presents a completed design proposal, and the user approves it"
          correct: false
          explanation: "This is closer to the plan mode format that the article describes as a drawback. `/grill-me` repeats questions and answers."
        - text: "AI and the user take turns writing code while refining the design"
          correct: false
          explanation: "`/grill-me` is a skill for asking repeated questions during the design phase before implementation, not for proceeding while writing code."

    - question: "Which statement correctly describes the difference between \"low-fidelity questions\" and \"high-fidelity questions\" in the article?"
      answers:
        - text: "Low-fidelity questions are less important questions, while high-fidelity questions are more important questions"
          correct: false
          explanation: "Fidelity is not about importance. It is a distinction based on whether the question can be answered without a prototype or image."
        - text: "Low-fidelity questions can be answered without a prototype or image, while high-fidelity questions require one"
          correct: true
          explanation: "As the article explains, a question such as the URL of a screen is low-fidelity, while a question such as the layout of a screen is high-fidelity because it may require building a prototype to judge properly."
        - text: "Low-fidelity questions are about code, while high-fidelity questions are about design"
          correct: false
          explanation: "The distinction is not whether the question is about code or design, but whether it can be answered without a prototype or image."
        - text: "Low-fidelity questions are for beginners, while high-fidelity questions are for experienced users"
          correct: false
          explanation: "The article does not distinguish them by reader level. It distinguishes them by whether a prototype is needed."

published: true
---

When coding agents first appeared, I remember that the common way to use them was to approve every command execution and every code generation step, while watching closely enough to intervene whenever they seemed likely to head in the wrong direction. Recently, however, improvements in AI models themselves and advances in harness engineering have made it possible for agents to complete tasks autonomously. Greater agent autonomy leads to further productivity gains because users no longer need to monitor every single action the agent takes. Today, it has become normal to run multiple tasks in parallel or to build large-scale workflows around agents.

Now that running multiple agents in parallel is becoming normal, monitoring every action each agent takes is no longer realistic. In the past, even if an instruction remained somewhat ambiguous, you could often detect a gap in understanding early by watching what happened during implementation. Now that we can no longer physically monitor agent behavior in the same way, gaps in understanding may only become visible after the agent has completed its task. If you do not notice that gap until the task is done, and the original requirement has not been met, everything may need to be redone. Even when the requirement has technically been met, if the code architecture is inappropriate or the code quality is low, major revisions may still be needed during code review. For that reason, in today's development workflows it is increasingly important to clarify requirements during the design phase before implementation and to build shared understanding between humans and AI.

To build shared understanding between humans and AI, the initial prompt needs to communicate requirements and design intent without omissions. In practice, this is harder than it sounds. First, there is the problem of tacit knowledge. Humans tend to think under the assumption that a certain amount of background knowledge is already shared, so when communicating requirements or design intent, they may unconsciously omit important information. Between people on the same team, tacit knowledge may not be such a serious problem because some shared context already exists. But AI must rebuild its understanding from scratch every time it receives a new prompt, even if memory features such as `AGENTS.md` exist, so tacit knowledge becomes a much larger problem.

Second, verbalizing requirements or design intent can itself be difficult. This is especially true when dealing with complex systems or abstract concepts, where words alone may not be enough to convey the idea accurately. Third, requirements may not yet be settled. You might have a rough image in your head, only to realize once you put it into words that the design has gaps or contradictions.

As a technique for clarifying a design before implementation, many harnesses provide a feature such as "plan mode." In plan mode, the agent never changes code. Instead, it thoroughly investigates the codebase, understands the codebase and the design of the existing code, and then presents the user with a plan that summarizes the direction and procedure for the change. If any points are unclear while preparing the plan, the agent asks the user questions and revises the plan based on the answers. Because plan mode lets you align intent before actual implementation begins, it can help detect gaps in understanding early. Even when requirements are not yet settled, plan mode can serve as a thinking partner for design. It also often presents multiple options, making it possible to compare and discuss those options while shaping the design.

![](https://images.ctfassets.net/in6v9lxmm5c8/5yavHfY3EQLDy0yX75hMmQ/10042919330b433a3988cc256d9fa8eb/image.png)

However, plan mode also has drawbacks. The core issue is that the entire design is presented all at once. Because the proposed plan can look plausible as a whole, it is easy to approve it with a quick "OK" without breaking it down. The resulting problem is that control over the plan is taken away from the human. When thinking through a design, AI can push straight through until the full picture is complete, which makes it difficult for humans and AI to proceed through discussion.

Matt Pocock created the `/grill-me` skill to overcome these drawbacks of plan mode. `/grill-me` is a skill that thoroughly interviews the user about a plan or design, continuing to ask questions until shared understanding is reached while resolving each branch of the design tree. A major characteristic of this skill is that the human side retains control over the design because the interaction takes the form of AI asking questions and the user answering them. By resolving each branch of the design tree one by one, the user can work through design details down to the level of leaf nodes in the tree.

:::note
The English word `grill` means not only "to cook food over heat," but also "to question someone intensely."
:::

This article introduces the overview of the `/grill-me` skill and how to use it in practice.

## What Is the `/grill-me` Skill?

`/grill-me` is provided as an [Agent Skills](https://agentskills.io/home) skill. If you want to use the `/grill-me` skill in practice, explicitly invoking it as a command is probably the most common approach.

```txt
/grill-me [design topic]
``` 

One notable point about the `grill-me` skill is that the skill content itself is only three lines long. The skill content is as follows.

```txt
Ask me questions about every aspect of this plan until we have reached a shared understanding. Follow every branch of the design tree and resolve the dependencies between decisions one by one. For each question, include your recommended answer.

Ask one question at a time.

If a question can be answered by inspecting the codebase, inspect the codebase.
```

[https://github.com/mattpocock/skills/blob/733d312884b3878a9a9cff693c5886943753a741/skills/productivity/grill-me/SKILL.md](https://github.com/mattpocock/skills/blob/733d312884b3878a9a9cff693c5886943753a741/skills/productivity/grill-me/SKILL.md).

The key sentence is: "Ask me questions about every aspect of this plan until we have reached a shared understanding. Follow every branch of the design tree and resolve the dependencies between decisions one by one." The exact number depends on the design topic, but the agent will usually ask somewhere around 10 to 50 questions and dig deeply into the topic. Compared with using plan mode, this takes much more time and is also more mentally demanding for the human. However, because the design can be worked out in detail beforehand, it can greatly reduce gaps in understanding during implementation and ultimately make it possible to complete implementation faster.

The design tree is a concept that comes from the book [The Design of Design](https://amzn.asia/d/09Hf6G8u). When a designer makes a single design decision, that decision creates the need to make multiple dependent design decisions. What matters even more is that each node could have taken a different path. By exploring the design space as a tree structure, you can understand the overall design while refining the details.

![](https://images.ctfassets.net/in6v9lxmm5c8/1P5xr37mVQLp6zV29L00Pq/d2063ca9e3e47f7dcd6377baf6cf1feb/alarm_clock_design_tree.svg)

The most important thing when making good use of the `/grill-me` skill is not to leave the design entirely to AI, but to have some understanding on the human side of the components that make up the design. It is said that the most common failure pattern when using `/grill-me` is that the human becomes too passive in response to the questions. You should avoid answering "OK" without thinking deeply about the agent's questions. If the human is too passive, extreme failure cases may involve being hit with as many as 540 questions, or the discussion may expand into requirements for low-importance details. The human is expected to respond actively to the agent's questions: deciding where the conversation should go, adjusting its direction, and otherwise leading the discussion. This is not an interview. It is a conversation.

Treat it as a tool for verbalizing the design image in your head in collaboration with AI. In the end, a design will not magically appear out of nothing if you have no ideas of your own.

> The music is already all in my head. Writing it down is just copying it out. - Mozart's line in the film *Amadeus* (1984)

:::info
Matt recommends using `/grill-with-docs`, an evolved version of the `/grill-me` skill. `/grill-with-docs` is a skill for validating a plan against existing documentation. Its approach is to update documents such as `CONTEXT.md` and `ADR` on the spot whenever a decision is finalized. `CONTEXT.md` comes from domain-driven development and is a document used to define the shared language used within the boundary area of an application, that is, within its context.
:::

## Trying the `/grill-me` Skill in Practice

Now let's try using the `/grill-me` skill in practice. Because the `/grill-me` skill is published in a GitHub repository, you can either copy it directly or install it using the `npx skills` command.

```bash
npx skills add https://github.com/mattpocock/skills --skill grill-me
```

When thinking through a design with the `/grill-me` skill, the key points are question fidelity and scope. The questions that can be answered through `/grill-me` are limited to low-fidelity questions. Low-fidelity questions are questions that can be answered without a detailed prototype or image, such as "What should the URL for this screen be?" High-fidelity questions are questions that require a detailed prototype or image, such as "What should the layout of this screen be?" That is because appropriate judgments for such questions often cannot be made until you actually build a prototype. You should prompt the agent in a way that encourages low-fidelity questions as much as possible, but high-fidelity questions may still come up. In that case, the recommended approach is to use the handoff pattern. This means ending the `/grill-me` skill for the moment when a high-fidelity question appears and moving into a prototype session. After creating the prototype, you invoke `/grill-me` again and continue the questions based on that prototype.

The design scope is also important. If the design scope is too broad, high-fidelity questions tend to increase. It also becomes easier to hit the context window limit. Once the context window limit is reached, the agent may miss important information or make less accurate judgments. When dealing with a large scope, it is better to first decompose the task together with the agent, then use the `/grill-me` skill for each decomposed task.

Here, let's use the `/grill-me` skill with the theme of implementing a feature for a Kanban application that displays task completion rate, average completion time, and bottlenecks on a dashboard to measure development productivity. First, we pass the following prompt.

```txt
/grill-me I want to implement a feature that displays task completion rate, average completion time, and bottlenecks on a dashboard to measure development productivity.
```

In the initial prompt, I intentionally give a rough instruction and avoid going into design details. It can be tempting to provide already-concretized parts of the design so that the agent does not drift too far away from the design image you have in mind. For example, if you already have a database table design or API endpoint design in your head, you may want to include them in the initial prompt. But doing so removes room for AI to find a better solution. If you include an instruction like "design the API endpoints," the AI may fixate on designing API endpoints even if there was an option that would have been more appropriate, such as fetching data with Next.js Server Components before introducing endpoints.

> When specifying something to be designed, tell what properties it needs, not how to achieve them. If the implementation method is given as a constraint, better solutions may be excluded. - *The Design of Design* by Frederick P. Brooks Jr.

When you invoke the `/grill-me` skill, it first starts by investigating the codebase. It understands the database schema and the structure of the existing code before beginning to ask the user questions. The first question was: "How should data be recorded for measurement?" To calculate "average completion time" and "bottlenecks," task state transitions need to be recorded over time. However, the existing database schema did not have a table for that. The reason behind the question was that the data recording method needed to be decided.

![](https://images.ctfassets.net/in6v9lxmm5c8/tYz4ddM8mIzQjwWKfiN2L/333636afc080aff826acd70027a0ecc0/image.png)

The agent presents three options along with a recommended answer. The AI's recommended answer was "add a column movement history table." The reason it provides a recommended answer is to speed up the conversation by allowing the user to answer "yes" if they agree with the change. However, as I have said repeatedly, you should not simply accept the recommended answer as-is. Respond actively to the question and avoid handing control of the design over to AI.

In the end, the agent conducted a thorough interview consisting of 18 questions. The questions included the following.

- How should "complete" be defined?
- How should "bottleneck" be calculated and displayed?
- What should the aggregation scope of the dashboard be? Board-level or project-level?
- What should the target time range filter be?
- What should be used to render graphs?
- How should tasks moved back from the completion column to another column be handled?

Once all questions are complete, the final overall design is presented. You review the proposed specification, and if there are no issues, move into the implementation phase.

![](https://images.ctfassets.net/in6v9lxmm5c8/6snQSCcBpuNafAByXS8kOg/98cf4b4ff8bdb6f28b2295ed5e73e3aa/image.png)

Resetting the context when entering the implementation phase is defined as a failure pattern. The questions and answers exchanged during the design phase should be carried forward as context for the implementation phase. Context packed with many design decisions is an extremely valuable asset. If there is enough context remaining, you can move directly into implementation. If context is tight or the implementation itself is large, it is a good idea to save the design-phase discussion as documentation under a directory such as `/docs`. Later sessions can then refer back to the design. A [`/to-prd`](https://github.com/mattpocock/skills/blob/main/skills/engineering/to-prd/SKILL.md) skill is also available for summarizing the design into a PRD (Product Requirements Document), so using that is another option.


## Summary

- As coding agents become more autonomous and running multiple agents in parallel becomes normal, monitoring every action an agent takes is no longer realistic.
- If you do not notice a gap in understanding until the agent's task is complete, the task may need to be redone or major revisions may be required during code review. This makes it important to clarify requirements in the design phase before implementation and build shared understanding between humans and AI.
- To build shared understanding between humans and AI, the initial prompt needs to communicate requirements and design intent without omissions. However, tacit knowledge, the difficulty of verbalizing ideas, and unsettled requirements make this harder than it may seem.
- Many harnesses provide features such as "plan mode" as a technique for clarifying design before implementation, but plan mode has a problem: because the full design is presented all at once, control over the design can be taken away from the human.
- The `/grill-me` skill, created by Matt Pocock, overcomes the drawbacks of plan mode. `/grill-me` thoroughly interviews the user about a plan or design and keeps asking questions until shared understanding is reached while resolving each branch of the design tree. Because AI asks questions and the user answers them, a major characteristic is that control over the design remains on the human side.
- The most important thing when making use of `/grill-me` is not to leave the design entirely to AI, but to have some grasp of the design components on the human side. You should avoid answering "OK" without thinking deeply about the agent's questions. The human needs to actively lead the discussion by deciding where it should go and adjusting the direction of the conversation.

## References
- [skills/skills/productivity/grill-me/SKILL.md · mattpocock/skills](https://github.com/mattpocock/skills/blob/733d312884b3878a9a9cff693c5886943753a741/skills/productivity/grill-me/SKILL.md)
- [9 Things People Get Wrong With /grill-me and /grill-with-docs](https://www.aihero.dev/things-people-get-wrong-with-grill-me-and-grill-with-docs)
- [5 Agent Skills I Use Every Day](https://www.aihero.dev/5-agent-skills-i-use-every-day)
- [grill-with-docs: Align Before You Build](https://www.aihero.dev/grill-with-docs)
