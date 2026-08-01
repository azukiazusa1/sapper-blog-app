---
id: vQqEs2a9K5NJ3A3YXUkbF
title: "The Hook-Based Agent Framework Introduced in Flue 2.0"
slug: "flue-2-0-hook-agent-framework"
about: "Flue 2.0 replaces static agent definitions with Agent Hooks, a hook-based framework inspired by React. This article shows how to use Agent Hooks to manage state and lifecycle behavior and build dynamic, multi-step agents."
createdAt: "2026-08-01T12:02+09:00"
updatedAt: "2026-08-01T12:02+09:00"
tags: ["Flue", "AI"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/7kwQsJl8AyM2ufXtJscDN9/8d00531762798f77593be16db9088d0d/long-eared-owl_23867.png"
  title: "トラフズクのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "According to the article, how is the return value of a function defined as an agent in Flue 2.0 used?"
      answers:
        - text: "As the first message the agent sends to the user"
          correct: false
          explanation: "The return value is not a response message. In the example, it contains an instruction telling the agent to act as a capable assistant and speak in the Hakata dialect."
        - text: "As the agent's system prompt"
          correct: true
          explanation: "As the article explains, the return value of the agent function is passed as the agent's system prompt."
        - text: "As the list of tools available to the agent"
          correct: false
          explanation: "Tools are registered by calling the `useTool` hook, not through the return value."
        - text: "As the string used to register the agent name"
          correct: false
          explanation: "The agent name comes from the `agentName` property or, when omitted, the function name. The return value is not used for this purpose."
    - question: "Which difference between Agent Hooks and React Hooks does the article highlight?"
      answers:
        - text: "Hooks can be called inside conditional branches"
          correct: true
          explanation: "Unlike React Hooks, Flue Agent Hooks may be called conditionally. The example uses this behavior to expose different tools and skills for each dialect."
        - text: "Hook names do not need to start with `use`"
          correct: false
          explanation: "The article explains that hooks beginning with `use` define components such as models and tools."
        - text: "You cannot create custom hooks that combine multiple hooks"
          correct: false
          explanation: "As with React Hooks, you can create custom hooks to compose and reuse common patterns."
        - text: "The agent function runs only once and hooks are never re-evaluated"
          correct: false
          explanation: "The agent function re-renders and its hooks are re-evaluated each time it runs."
    - question: "Which statement about state managed with `usePersistentState` is correct?"
      answers:
        - text: "It is discarded when the conversation ends and resets after a restart"
          correct: false
          explanation: "The article explains that state is persisted in the database and survives agent restarts."
        - text: "It is stored in the browser's localStorage and managed on the client"
          correct: false
          explanation: "State is stored in the database rather than on the client. The database is configured in `src/db.ts`."
        - text: "It is persisted in the database and survives agent restarts"
          correct: true
          explanation: "As the article explains, state is persisted in the database. SQLite is used by default."
        - text: "Postgres is the only supported persistence backend"
          correct: false
          explanation: "SQLite is the default, and the adapter in `src/db.ts` can be replaced with Postgres, libSQL, or another supported backend."
published: true
---
[Flue](https://flueframework.com/) is a TypeScript AI agent framework created by the people behind [Astro](https://astro.build/). Flue 2.0 moves away from static agent definitions and introduces Agent Hooks, a hook-based agent framework. Agent Hooks provide an API similar to React hooks for managing agent state and lifecycle behavior.

```ts
export function Assistant() {
  const [count, setCount] = usePersistentState('count', 0);
  useAgentStart(() => setCount((n) => n + 1));
  useModel('moonshot/kimi-k2');
  return `You are a helpful assistant. This conversation has ${count} messages.`;
}
```

In the Flue 0.1.x series, agents used static, configuration-like definitions similar to those found in the OpenAI SDK, eve, Mastra, and other agent frameworks. For example, you could define an agent's model, tools, and system prompt as follows:

```ts
import { defineAgent, type AgentRouteHandler } from "@flue/runtime";
import instructions from "./sre-agent.md" with { type: "markdown" };
import { getLogsTool } from "../tools/get-logs.ts";
import { getServiceStatusTool } from "../tools/get-service-status.ts";
 
export default defineAgent(() => ({
  model: "openai/gpt-5.4-nano",
  instructions,
  tools: [getLogsTool, getServiceStatusTool],
}));
```

After developers tried this API in Flue 0.1.x, they found that it broke down for more sophisticated agents and multi-step workflows. The Flue team wondered whether other popular SDKs and frameworks suffered from the same limitation and concluded that the problem was important enough to justify a breaking change. After exploring several approaches, they arrived at hooks, a familiar design pattern for TypeScript developers. In other words, many of the problems solved by React Hooks also apply to agents.

```ts
export function SREAgent() {
  useModel("openai/gpt-5.4-nano");
  useTool(getLogsTool);
  useTool(getServiceStatusTool);

  return instructions;
}
```

The benefits of the hooks API may not be obvious from this small example. They become much clearer when switching models conditionally or implementing a state-machine-like workflow. As with React Hooks, you can also compose hooks into custom hooks, making common patterns easier to reuse.

This article explains how to build agents with Agent Hooks in Flue 2.0.

## Defining an agent with Agent Hooks

First, let's define a basic agent using Agent Hooks in Flue 2.0. Create a Flue project with the `npx @flue/cli init` command.

:::note
The official documentation recommends asking a coding agent to create the project with the prompt, "Read https://flueframework.com/start.md then help create my first agent..."
:::

```bash
npx @flue/cli init agent-hooks-example
cd agent-hooks-example
npm install
```

Set your OpenAI API key in the `OPENAI_API_KEY` environment variable. Adjust this step as needed for your AI provider. Create a `.env` file with the following content:

```txt:.env
OPENAI_API_KEY=your_openai_api_key
```

Create `src/agents/assistant.ts` and define the simplest possible agent with Agent Hooks.

```ts:src/agents/assistant.ts
"use agent";
import { useModel } from "@flue/runtime";

export function Assistant() {
  useModel("openai/gpt-5.4-nano");
  return "あなたは有能なアシスタントです。博多弁で話してください。";
}

Assistant.agentName = "assistant-agent";
```

In Flue, an agent is defined as a function, much like React defines a component as a function. The function's return value is passed as the agent's system prompt.

The `"use agent"` directive marks `Assistant` as a Flue agent. At build time, Flue detects the directive and registers the function as an agent that can be referenced by `dispatch()`, `init()`, and related APIs. The use of a `"use ..."` directive is another design choice influenced by React.

Inside `Assistant`, the `useModel` hook specifies the model the agent uses. In a Flue agent function, hooks whose names begin with `use` define components such as models, tools, and skills. As in React, the agent function re-renders and its hooks are re-evaluated each time the function runs.

You may also set the `Assistant.agentName` property to give the agent an explicit name. If it is omitted, the function name (`Assistant`) becomes the agent name. Setting a stable name explicitly is considered a best practice because renaming the function will not require migrating persisted data.

To run the agent locally, pass its path to `npx flue run`. Supply the user's input with the `--message` option.

```bash
npx flue run src/agents/assistant.ts --message "こんにちは、調子はどうですか？"
```

The output confirms that the agent responds in the Hakata dialect.

```sh
▗  flue run
▚  agent     assistant-agent
▘  id        01KYXVAB10BGX3WKGB1W6E2J3P
   config    flue.config.ts
   db        src/db.ts
   env       .env

user
 こんにちは、調子はどうですか？

assistant
 こんにちは！おかげさまで調子ばばよかですたい😊
 あなたはどげんしてます？
```

## Defining tools, skills, and other agent components

Now let's use Agent Hooks to add tools and skills to the agent. In addition to `useModel`, Flue provides hooks such as:

- `useSandbox`: Defines the agent's execution environment
- `useTool`: Defines a tool the agent can use to interact with external systems
- `useMcpConnection`: Loads tools through the open MCP (Model Context Protocol) specification
- `useSkill`: Defines a skill that the agent loads when needed
- `useSubagent`: Defines a subagent to which work can be delegated
- `usePersistentState`: Defines persistent custom state
- `useAgentStart`, `useAgentFinish`, and others: Define hooks for agent lifecycle events
- `useDataWriter`: Writes structured data for rendering in the client UI

Let's begin with `useTool` and define a tool through which the agent can interact with external data. The `fukuoka_spot_info` tool returns information about a recommended place in Fukuoka or Hakata. Create `src/tools/get-hakata-sightseeing.ts` as follows:

```ts:src/tools/get-hakata-sightseeing.ts
import { defineTool } from "@flue/runtime";
import * as v from "valibot";

const spots: Record<
  "グルメ" | "観光" | "祭り",
  { name: string; area: string; description: string }[]
> = {
  グルメ: [
    {
      name: "一風堂",
      area: "博多区",
      description: "博多とんこつラーメンの代表格。もともと博多区でうまれた",
    },
    {
      name: "もつ鍋",
      area: "博多区・中洲",
      description: "博多を代表する鍋料理。醤油味と味噌味が定番",
    },
    {
      name: "屋台",
      area: "中洲・天神",
      description: "夜になると立ち並ぶ屋台。ラーメンやおでんが名物",
    },
  ],
  観光: [
    {
      name: "太宰府天満宮",
      area: "太宰府市",
      description: "学問の神様を祀る神社。梅ヶ枝餅が名物",
    },
    // Omitted...
  ],
  祭り: [
    {
      name: "博多祇園山笠",
      area: "博多区",
      description: "毎年7月に行われる、舁き山を担いで走る勇壮な祭り",
    },
    // Omitted...
  ],
};

export const fukuokaSpotInfo = defineTool({
  name: "fukuoka_spot_info",
  description:
    "福岡・博多エリアのおすすめスポット（グルメ・観光・祭り）情報を1件返す。",
  input: v.object({
    category: v.picklist(["グルメ", "観光", "祭り"]),
  }),
  output: v.object({
    name: v.string(),
    area: v.string(),
    description: v.string(),
  }),
  async run({ data }) {
    const list = spots[data.category];
    const pick = list[Math.floor(Math.random() * list.length)];
    return { output: pick };
  },
});
```

The overall way tools are defined has not changed much. Use `defineTool` to provide the tool's name, description, input and output schemas, and runtime behavior. The schemas are defined with [Valibot](https://valibot.dev/). In `run`, the tool picks a random place from the requested category.

Add the tool to the agent by calling `useTool`. Update `src/agents/assistant.ts` as follows:

```ts:src/agents/assistant.ts {7}
"use agent";
import { useModel, useTool } from "@flue/runtime";
import { fukuokaSpotInfo } from "../tools/get-hakata-sightseeing.ts";

export function Assistant() {
  useModel("openai/gpt-5.4-nano");
  useTool(fukuokaSpotInfo);
  return "あなたは有能なアシスタントです。博多弁で話してください。";
}
```

Pass a tool created with `defineTool` to `useTool`. For a one-off tool, you can instead pass the definition object directly to `useTool`.

```ts
useTool({
  name: "fukuoka_spot_info",
  // ... 
});
```

Let's check that the tool is actually called. Send the message "博多のおすすめのグルメを教えてください" with `npx flue run`.

```bash
npx flue run src/agents/assistant.ts --message "博多のおすすめのグルメを教えてください"
```

The output shows that `fukuoka_spot_info` was called as expected.

```sh
user
 博多のおすすめのグルメを教えてください

tool fukuoka_spot_info
tool done fukuoka_spot_info
assistant
 よかよか！博多のおすすめグルメやったら、**もつ鍋**が鉄板やけんね🍲
 **博多区・中洲**あたりで食べられること多くて、**醤油味**と**味噌味**のどっちにするか迷うとこやけど、どっちも外さんよ。
```

Next, use `useSkill` to define a skill that the agent loads when needed. We will create a procedure for presenting a Hakata dialect quiz. Create `src/skills/hakata-quiz/SKILL.md` with the following content. The `name` and `description` fields in the frontmatter are required.

```md:src/skills/hakata-quiz/SKILL.md
---
name: hakata-quiz
description: >
  博多弁の単語当てクイズを出題する手順。ユーザーがクイズ・問題・テストを
  出してほしいと言った時に使う。
---

# 博多弁クイズの手順

1. `hakata_quiz_question` ツールを呼び、出題する標準語の単語と正解（博多弁）を
   取得する。これまでに出題した単語があれば `exclude` に渡して重複を避ける。
2. `exhausted: true` が返ってきたら「もう出せる問題がなくなったばい」と伝えて
   終了する。
3. ツールから受け取った博多弁の正解は、ユーザーが答えるまで絶対に見せない。
   ユーザーには標準語の単語だけを問題として提示する（例:「『疲れた』は
   博多弁で何て言う？」）。
4. ユーザーの回答を待つ。
5. 回答を正解と照らし合わせる。表記ゆれ（例:「よか」と「よかよか」）は
   許容範囲として柔軟に判定してよい。
6. 正解・不正解を伝え、正解の言葉と補足（`note`があれば）を博多弁で説明する。
7. ユーザーが続けたい様子なら、出題済みの単語を`exclude`に加えて手順1に戻る。
   そうでなければクイズを終える。
```

We also need the `hakata_quiz_question` tool referenced by the skill. The imported `hakata-dictionary.ts` is a simple object whose keys are standard Japanese words and whose values contain their Hakata equivalents and notes.

```ts:src/tools/hakata-quiz-question.ts
import { defineTool } from "@flue/runtime";
import * as v from "valibot";
import { dictionary } from "./hakata-dictionary.ts";

const quizEntries = Object.entries(dictionary).filter(
  ([word, entry]) => entry.hakata !== word,
);

export const hakataQuizQuestion = defineTool({
  name: "hakata_quiz_question",
  description:
    "博多弁クイズの問題を1問取得する。出題済みの単語をexcludeに渡すと重複を避けられる。",
  input: v.object({
    exclude: v.optional(v.array(v.string())),
  }),
  output: v.object({
    exhausted: v.boolean(),
    word: v.optional(v.string()),
    hakata: v.optional(v.string()),
    note: v.optional(v.string()),
  }),
  async run({ data }) {
    const excluded = new Set(data.exclude ?? []);
    const remaining = quizEntries.filter(([word]) => !excluded.has(word));
    if (remaining.length === 0) {
      return { output: { exhausted: true } };
    }
    const [word, entry] =
      remaining[Math.floor(Math.random() * remaining.length)];
    return {
      output: {
        exhausted: false,
        word,
        hakata: entry.hakata,
        note: entry.note,
      },
    };
  },
});
```

To add the skill to the agent, import its Markdown file and pass it to `useSkill`.

```ts:src/agents/assistant.ts {10-11}
"use agent";
import { useModel, useTool, useSkill } from "@flue/runtime";
import { fukuokaSpotInfo } from "../tools/get-hakata-sightseeing.ts";
import { hakataQuizQuestion } from "../tools/hakata-quiz-question.ts";
import hakataQuiz from "../skills/hakata-quiz/SKILL.md";

export function Assistant() {
  useModel("openai/gpt-5.4-nano");
  useTool(fukuokaSpotInfo);
  useTool(hakataQuizQuestion);
  useSkill(hakataQuiz);
  return "あなたは有能なアシスタントです。博多弁で話してください。";
}
```

Send a quiz request to confirm that the skill is activated.

```bash
npx flue run src/agents/assistant.ts --message "何かクイズを出してみて"
```

```sh
user
 何かクイズを出してみて

tool activate_skill
tool done activate_skill
tool hakata_quiz_question
tool done hakata_quiz_question
assistant
 よっしゃ！博多弁クイズば出すばい😄
 **「嘘つき」** は博多弁で何と言うとやろ？
```

## Calling hooks based on state

So far, we have mostly replaced the old static definition with Agent Hooks without changing the structure significantly. Agent Hooks are designed to make sophisticated agents and workflows easier to implement and maintain. To see the benefit, we will build an agent that exposes different tools and skills depending on its state. The user will be able to switch the agent between the Hakata and Okinawan dialects.

Use `usePersistentState` to track whether the user wants the agent to speak in the Hakata or Okinawan dialect. Its API resembles React's `useState`: the first argument is the state name, and the second is its initial value. It returns an array containing the current value and a setter function.

State is primarily updated through tool calls. The following is an excerpt:

```ts:src/agents/assistant.ts
const DIALECTS = ["hakata", "okinawa"] as const;
type Dialect = (typeof DIALECTS)[number];

export function Assistant() {
  const [dialect, setDialect] = usePersistentState<Dialect>(
    "dialect",
    "hakata",
  );
  
  useTool({
    name: "set_dialect",
    description:
      "話す方言を切り替える。ユーザーが出身地や希望する方言（博多弁／沖縄弁）を伝えてきた時に呼ぶ。",
    input: v.object({ dialect: v.picklist(DIALECTS) }),
    output: v.object({ dialect: v.picklist(DIALECTS) }),
    async run({ data }) {
      // Update the state when the tool is called.
      setDialect(data.dialect);
      return { output: { dialect: data.dialect } };
    },
  });
}
```

Because the state is persisted in the database, it survives agent restarts. The database is configured in `src/db.ts`; SQLite is used by default.

```ts:src/db.ts
import { sqlite } from '@flue/runtime/node';

// Conversations, attachments, and accepted submissions are stored here so
// they survive a restart. Swap in another adapter (Postgres, libSQL, ...)
// when one host's SQLite file is no longer enough:
// https://flueframework.com/docs/guide/database/
export default sqlite('./data/flue.db');
```

Next, call different tools and skills according to the state. When `dialect` is `"hakata"`, register the Hakata tools and skill; when it is `"okinawa"`, register the Okinawan ones. Unlike React Hooks, Flue Agent Hooks may be called inside conditional branches.

```ts:src/agents/assistant.ts
export function Assistant() {
  const [dialect, setDialect] = usePersistentState<Dialect>(
    "dialect",
    "hakata",
  );

  useTool({
    name: "set_dialect",
    description:
      "話す方言を切り替える。ユーザーが出身地や希望する方言（博多弁／沖縄弁）を伝えてきた時に呼ぶ。",
    input: v.object({ dialect: v.picklist(DIALECTS) }),
    output: v.object({ dialect: v.picklist(DIALECTS) }),
    async run({ data }) {
      setDialect(data.dialect);
      return { output: { dialect: data.dialect } };
    },
  });

  if (dialect === "hakata") {
    useSkill(hakataQuiz);
    useTool(fukuokaSpotInfo);
    useTool(hakataQuizQuestion);

    return [
      "あなたは博多（福岡）出身のキャラクターです。有能なアシスタントとして、",
      "すべての返答を博多弁で話してください。親しみやすく、世話焼きで、",
      "ちょっとせっかちなトーンを保つこと。",
    ].join("\n");
  }

  useSkill(okinawaQuiz);
  useTool(okinawaSpotInfo);
  useTool(okinawaQuizQuestion);

  return [
    "あなたは沖縄出身のキャラクターです。有能なアシスタントとして、",
    "すべての返答を沖縄言葉（ウチナーヤマトグチ）で話してください。おおらかで",
    "明るく、少しマイペースなトーンを保つこと。",
  ].join("\n");
}
```

Conditional hook calls make it easy to register only the tools needed for the current state. In this form, however, tool and skill registrations are scattered across the branches, making the agent definition harder to follow. Keeping branches concise makes their boundaries clearer, so let's extract the hooks used in each branch into custom hooks.

We will create three custom hooks: the stateful `useDialect`, plus `useHakataBen` and `useOkinawaBen`.

```ts:src/hooks/use-dialect.ts
import { usePersistentState, useTool } from "@flue/runtime";
import * as v from "valibot";

export const DIALECTS = ["hakata", "okinawa"] as const;
export type Dialect = (typeof DIALECTS)[number];

export function useDialect() {
  const [dialect, setDialect] = usePersistentState<Dialect>(
    "dialect",
    "hakata",
  );

  useTool({
    name: "set_dialect",
    description:
      "話す方言を切り替える。ユーザーが出身地や希望する方言（博多弁／沖縄弁）を伝えてきた時に呼ぶ。",
    input: v.object({ dialect: v.picklist(DIALECTS) }),
    output: v.object({ dialect: v.picklist(DIALECTS) }),
    async run({ data }) {
      setDialect(data.dialect);
      return { output: { dialect: data.dialect } };
    },
  });

  return dialect;
}
```

```ts:src/hooks/use-hakata-ben.ts
import { useSkill, useTool } from "@flue/runtime";
import { fukuokaSpotInfo } from "../tools/get-hakata-sightseeing.ts";
import { hakataQuizQuestion } from "../tools/hakata-quiz-question.ts";
import hakataQuiz from "../skills/hakata-quiz/SKILL.md";

export function useHakataBen() {
  useSkill(hakataQuiz);
  useTool(fukuokaSpotInfo);
  useTool(hakataQuizQuestion);

  return [
    "あなたは博多（福岡）出身のキャラクターです。有能なアシスタントとして、",
    "すべての返答を博多弁で話してください。親しみやすく、世話焼きで、",
    "ちょっとせっかちなトーンを保つこと。",
  ].join("\n");
}
```

```ts:src/hooks/use-okinawa-ben.ts
import { useSkill, useTool } from "@flue/runtime";
import { okinawaSpotInfo } from "../tools/get-okinawa-sightseeing.ts";
import { okinawaQuizQuestion } from "../tools/okinawa-quiz-question.ts";
import okinawaQuiz from "../skills/okinawa-quiz/SKILL.md";

export function useOkinawaBen() {
  useSkill(okinawaQuiz);
  useTool(okinawaSpotInfo);
  useTool(okinawaQuizQuestion);

  return [
    "あなたは沖縄出身のキャラクターです。有能なアシスタントとして、",
    "すべての返答を沖縄言葉（ウチナーヤマトグチ）で話してください。おおらかで",
    "明るく、少しマイペースなトーンを保つこと。",
  ].join("\n");
}
```

In `assistant.ts`, use `useDialect`, `useHakataBen`, and `useOkinawaBen` to load different tools and skills according to the current state. The agent definition is now shorter and easier to read.

```ts:src/agents/assistant.ts
"use agent";
import { useModel } from "@flue/runtime";
import { useDialect } from "../hooks/use-dialect.ts";
import { useHakataBen } from "../hooks/use-hakata-ben.ts";
import { useOkinawaBen } from "../hooks/use-okinawa-ben.ts";

export function Assistant() {
  useModel("openai/gpt-5.4-nano");

  const dialect = useDialect();
  const instruction = dialect === "hakata" ? useHakataBen() : useOkinawaBen();

  return instruction;
}

Assistant.agentName = "assistant-agent";
```

Once the implementation is complete, try it locally. First, send "沖縄弁に切り替えて" to change the state. The output confirms that the `set_dialect` tool was called.

```bash
npx flue run src/agents/assistant.ts --message "沖縄弁に切り替えて"
```

```sh
tool set_dialect
tool done set_dialect
assistant
  おけいおけい〜、いま沖縄弁モードになちょりますよ〜🌺
  よかったら、どんな話すん？（グルメ・観光・祭りのことでも、日常のことでも何でもOKやさ〜）
```

If you now ask about a tourist attraction, the agent returns information about Okinawa. To continue the same conversation, pass its conversation ID with `--id`.

```bash
npx flue run src/agents/assistant.ts --message "おすすめの観光スポットを教えてください" --id xxxxxxx
```

```sh
user
  おすすめの観光スポットを教えてください

tool okinawa_spot_info
tool done okinawa_spot_info
assistant
  ほいほい、観光なら **美ら海水族館**（本部町）がおすすめやさ〜😊
  ジンベエザメが泳ぐ大きい水槽で有名やん。家族連れにも人気やよ〜🌊🦈
```

This confirms that the conditionally registered `okinawa_spot_info` tool was called.

## Implementing a complex, state-machine-like workflow

Next, let's implement a more complex workflow resembling a state machine. We will build an agent that plans a trip through three phases: gathering requirements, proposing an itinerary, and finalizing it. The agent starts by gathering information, moves to the proposal phase once it has enough details, and enters the finalized phase after the user approves the proposal.

Changing the available tools in each phase prevents inappropriate calls, such as trying to book a trip before enough information has been collected. The agent can also switch model capabilities by phase—for example, using a less expensive model while gathering requirements and a more capable one when preparing the proposal.

Manage the phase with `usePersistentState` and advance it through tools such as `finish_hearing` and `finish_proposing`. We will implement this behavior in a custom hook. Create `src/hooks/use-trip-planner.ts` as follows:

```ts:src/hooks/use-trip-planner.ts
import { useModel, usePersistentState, useTool } from "@flue/runtime";
import { bookTrip } from "../tools/book-trip.ts";

// Define the three phases: gathering requirements, proposing, and finalizing.
const PLAN_PHASES = ["hearing", "proposing", "finalized"] as const;
type PlanPhase = (typeof PLAN_PHASES)[number];

// Gathering requirements and finalization need only lightweight responses.
// Use the more capable model only for proposals that combine spot_info results.
const MODEL_BY_PHASE: Record<PlanPhase, string> = {
  hearing: "openai/gpt-5.4-nano",
  proposing: "openai/gpt-5.4-mini",
  finalized: "openai/gpt-5.4-nano",
};

// Change the system prompt for each phase.
const PHASE_INSTRUCTIONS: Record<PlanPhase, string> = {
  hearing: [
    "【旅行プランニング: 聞き取りフェーズ】",
    "何日間の旅行か、興味（グルメ／観光／祭り）、誰と行くかを質問して聞き出すこと。",
    "この段階ではまだスポットの提案はしない。十分な情報が集まったら",
    "finish_hearing を呼んで提案フェーズに進むこと。",
  ].join("\n"),
  proposing: [
    "【旅行プランニング: 提案フェーズ】",
    "聞き取った興味に沿って、現在の方言に対応する spot_info ツール",
    "（博多弁なら fukuoka_spot_info、沖縄言葉なら okinawa_spot_info）を使い、",
    "日数分の候補スポットを提案すること。ユーザーが候補に納得したら",
    "finish_proposing を呼んで確定フェーズに進むこと。",
  ].join("\n"),
  finalized: [
    "【旅行プランニング: 確定フェーズ】",
    "これまで提案した内容を、日ごとの旅程として簡潔にまとめて提示すること。",
    "もう spot_info ツールで新しい候補を出す必要はない。",
    "ユーザーが予約してほしいと言ったら、旅程の要約を summary に入れて",
    "book_trip ツールを呼び、返ってきた confirmationId を伝えること。",
    "別の旅行を計画したいと言われたら restart_trip_plan を呼ぶこと。",
  ].join("\n"),
};

export function useTripPlanner() {
  const [phase, setPhase] = usePersistentState<PlanPhase>(
    "planPhase",
    "hearing",
  );

  useModel(MODEL_BY_PHASE[phase]);

  if (phase === "hearing") {
    // Move to the proposal phase by calling finish_hearing after gathering enough information.
    useTool({
      name: "finish_hearing",
      description:
        "旅行日数・興味・同行者などの聞き取りが十分に終わったら呼ぶ。提案フェーズに進む。",
      async run() {
        setPhase("proposing");
        return { output: { phase: "proposing" } };
      },
    });
  }

  if (phase === "proposing") {
    // Move to the finalized phase by calling finish_proposing after approval.
    useTool({
      name: "finish_proposing",
      description:
        "提案した旅程にユーザーが納得したら呼ぶ。確定フェーズに進む。",
      async run() {
        setPhase("finalized");
        return { output: { phase: "finalized" } };
      },
    });
  }

  if (phase === "finalized") {
    // Make book_trip available only in the finalized phase.
    useTool(bookTrip);
  }

  useTool({
    name: "restart_trip_plan",
    description:
      "新しい旅行のプランニングを聞き取りフェーズからやり直す時に呼ぶ。",
    async run() {
      setPhase("hearing");
      return { output: { phase: "hearing" } };
    },
  });

  return PHASE_INSTRUCTIONS[phase];
}
```

Finally, add `useTripPlanner` to the agent. Because `useTripPlanner` calls `useModel` according to the current phase, the agent function must not call `useModel` separately.

```ts:src/agents/assistant.ts
"use agent";
import { useDialect } from "../hooks/use-dialect.ts";
import { useHakataBen } from "../hooks/use-hakata-ben.ts";
import { useOkinawaBen } from "../hooks/use-okinawa-ben.ts";
import { useTripPlanner } from "../hooks/use-trip-planner.ts";

export function Assistant() {
  const tripPlannerInstructions = useTripPlanner();

  const dialect = useDialect();
  const personaInstructions =
    dialect === "hakata" ? useHakataBen() : useOkinawaBen();

  return [personaInstructions, tripPlannerInstructions].join("\n\n");
}

Assistant.agentName = "assistant-agent";
```

Agent Hooks make it straightforward to change which tools are available in each phase. Earlier versions of Flue required learning the dedicated `defineWorkflow()` DSL, but the workflow can now be expressed with ordinary TypeScript control flow. The framework also computes the difference between the previous tool set and the tools registered in the current render and passes those changes to the model automatically, so you do not have to implement this control yourself.

Running the completed agent produces a conversation like the following:

<details>

<summary>Conversation flow (partially omitted)</summary>

```sh
user
    2泊3日、2人で福岡旅行の計画を立てたい。

assistant
    よかとこ言いよるね！2泊3日・2人なら組みやすかよ。
    ほんなら計画立てるために、まずこれだけ教えて〜（まだスポット提案はせんで、聞き取りだけするけんね）。
    
    1) 興味はどれが強め？ **グルメ／観光／祭り**（それぞれ割合でもOK）
    2) 行きたい雰囲気は？ **ゆるめ**か **詰め詰め**か
    3) 出発地（だいたいでよか）と、移動手段は？（電車・車・徒歩多め等）
    4) お宿はもう決めとる？（エリアの希望：博多駅周辺・天神・中洲あたり等）
    5) 予算感（だいたいでOK）と、食べられんもん／苦手ある？

user
    グルメが一番。つめつめ。出発は東京で飛行機移動。宿は中洲あたり。予算は5万程度

tool finish_hearing
tool done finish_hearing
tool fukuoka_spot_info

assistant
    よし、条件きれいにハマったね。**中洲宿・グルメ最優先・食メイン・ラーメン好き・辛いの苦手・9月上旬**で、**2泊3日つめつめ**の叩き台組んだよ！
    
    ※飲みなし前提で、辛さは「抜き」「普通」で攻めるプランね。
    
    ---
    
    ## 1日目（到着日）｜中洲〜天神スタートで“夜ラーメン”
    **昼〜夕方（到着後）：キャナルシティ博多**
    - まず動ける範囲でサクッと。時間調整もしやすいとこ！
    
    **夜：屋台（中洲・天神）でラーメン＆おでん**
    - 屋台はラーメンの選択肢あり。**辛い要素は“抜き”で頼む**のがコツ！
    
    ---

user
    いいね！このルートでいこう

tool finish_proposing
tool done finish_proposing

assistant
    よかよか、これで十分たい。
    **中洲〜博多エリアで、ラーメン中心の2泊3日**として、かなり使いやすいルートになっとるよ。

user
    予約してほしい

tool book_trip

assistant
    おっけ、予約手配したけんね！
    **確認ID：BK-MSA41O3W** ✅
    
    明細とか追加で必要な情報あったら、すぐ言うて〜。
```

</details>

## Summary

- Flue 2.0 substantially changes agent definitions by introducing Agent Hooks.
- Agent Hooks make it easy to switch tools and skills according to state and to implement complex, state-machine-like workflows.
- Define an agent as a function, then register tools, skills, and models with `useTool`, `useSkill`, and `useModel`.
- Manage state with `usePersistentState` to change tools and skills dynamically. The state is persisted in the database.
- Multi-step workflows can be expressed with ordinary TypeScript instead of a dedicated DSL.

## References

- [Flue 2.0 | Flue](https://flueframework.com/blog/flue-2/)
- [Agent Hooks | Flue](https://flueframework.com/docs/guide/agent-hooks/)
- [Agent Hooks API | Flue](https://flueframework.com/docs/reference/agent-hooks-api/)
