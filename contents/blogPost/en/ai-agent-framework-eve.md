---
id: SWT-Byvnym9BN9no9LuFS
title: "Trying Out eve, an AI Agent Framework"
slug: "ai-agent-framework-eve"
about: "Vercel has announced eve, a new AI agent framework. Built on the design philosophy of Next.js, eve provides everything you need to develop AI agents. In this article, I'll walk through how to create and run a simple agent with eve."
createdAt: "2026-06-20T10:29+09:00"
updatedAt: "2026-06-20T10:29+09:00"
tags: ["AI", "eve"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2rV4FN2S3cjjqtzMDyuYwI/4e18973d212583e90015351084df72da/limestone-cave_23707-768x591.png"
  title: "鍾乳洞のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "When defining a tool in eve, how is the tool's name determined according to the article?"
      answers:
        - text: "You specify a name property in the object passed to defineTool()"
          correct: false
          explanation: "The article clearly states that the tool name is derived automatically from the file name, so it does not need to be included in the definition. A name property is unnecessary."
        - text: "The file name where the tool is placed becomes the tool name directly"
          correct: true
          explanation: "As the article explains, tools/get_weather.ts becomes a tool named get_weather, for example. Placing the file in the right location lets eve detect it automatically."
        - text: "The name of the first field in inputSchema becomes the tool name"
          correct: false
          explanation: "inputSchema defines the arguments the tool accepts using a Zod schema, and has nothing to do with the tool name."
        - text: "The first word of the description is used as the tool name"
          correct: false
          explanation: "The description is the explanatory text the agent uses to decide whether to use the tool; it is not used to determine the tool name."
    - question: "What is the default value for the session compaction threshold in eve?"
      answers:
        - text: "0.75 (75% of the context window)"
          correct: false
          explanation: "0.75 is the value shown in the article as an example of changing the threshold; it is not the default."
        - text: "1.0 (the point at which the context window is exceeded)"
          correct: false
          explanation: "By default, compaction is configured to happen before the context window is exceeded, not at the point of overflow."
        - text: "0.9 (90% of the context window)"
          correct: true
          explanation: "As the article states, the default is 0.9, and compaction occurs once the session length reaches 90% of the context window."
        - text: "0.5 (50% of the context window)"
          correct: false
          explanation: "The article does not list 0.5 as a default value. The default is 0.9."
    - question: "In the Human-in-the-loop approval flow, which utility do you pass to needsApproval to always require human approval before a tool runs?"
      answers:
        - text: "once()"
          correct: false
          explanation: "once() is a utility that requires approval once and then skips approval afterward; it does not request approval every time."
        - text: "always()"
          correct: true
          explanation: "As the article explains, always() means approval is always required, and it is used in the rollback example, which is a mutating operation."
        - text: "never()"
          correct: false
          explanation: "never() is a utility that indicates approval is not required, so it does not request approval."
        - text: "approval()"
          correct: false
          explanation: "The utilities introduced in the article are always() / never() / once(); a function called approval() does not appear."
    - question: "Regarding eve skills (the mechanism used to define a Runbook), what is loaded into the agent's context at the start of a session?"
      answers:
        - text: "The entire contents of SKILL.md is always loaded"
          correct: false
          explanation: "Being loaded in full at all times is the role of instructions.md. A skill is loaded in full only when the agent decides it is needed."
        - text: "Only the skill's description is loaded"
          correct: true
          explanation: "As the article states, only the description is loaded at the start, and the full skill is loaded only when the agent decides it is needed (progressive disclosure)."
        - text: "No skill is loaded at all, and the user must load it manually"
          correct: false
          explanation: "The agent itself loads a skill via the load_skill tool when it judges it necessary. The description is loaded from the start."
        - text: "The bodies of all skills under agent/skills are concatenated and loaded"
          correct: false
          explanation: "Concatenating all the bodies is the behavior of the instructions directory. For skills, only the description is loaded first."
    - question: "Regarding eve's agent evaluation (eval), which statement matches what the article describes?"
      answers:
        - text: "Eval files are placed in the agent/evals directory"
          correct: false
          explanation: "The article clearly states that they are placed in the evals directory at the project root, not agent/evals."
        - text: "Whether a tool was called is also always assessed by an LLM judge"
          correct: false
          explanation: "Judgments such as whether a tool was called are evaluated deterministically in plain code, and an LLM judge is used for evaluating output quality."
        - text: "Aspects such as output quality are evaluated by an AI separate from the one that ran the task"
          correct: true
          explanation: "As the article explains, output quality and the correctness of summaries are evaluated by an AI (LLM judge) separate from the executor to increase objectivity."
        - text: "Evals cannot be integrated into CI/CD and can only be run locally"
          correct: false
          explanation: "The article states that you can integrate evals into a CI/CD pipeline and, for example, block a PR from being merged if the score is below a threshold."
published: true
---
Vercel has announced [eve](https://vercel.com/eve), a new AI agent framework. Built on the design philosophy of Next.js, eve comes with the following features needed to run in production. Just as Next.js is the framework that has everything you need for the web, eve is positioned as the framework that has everything you need for AI agent development.

- Durable sessions (even if a session is paused, it can resume exactly where it left off)
- A sandboxed execution environment
- Human-in-the-loop approval flows
- Subagents
- Integration with chat platforms such as Slack, Discord, and Microsoft Teams
- Tracing and evaluation

Like Next.js, each of the elements an agent needs is expressed through the directory structure, so the structure of your code naturally reflects the structure of your agent. For example, the directory structure of a small eve application looks like this. eve is built with TypeScript and markdown files.

```sh
my-agent/
├── package.json
└── agent/
    ├── agent.ts # The agent's model and runtime options are defined here
    ├── instructions.md # The agent's instructions are defined in a markdown file
    ├── tools/ # Functions the agent can call
    │   └── get_weather.ts
    ├── skills/ # Skills loaded when the agent decides they are needed
    │   └── plan_a_trip.md
    └── channels/ # Defines the channels users use to access the agent
        └── slack.ts
```

Each directory name indicates its role, and the file name becomes the name of the feature directly. For example, `tools/get_weather.ts` is a file that defines a tool named `get_weather`. By placing files in the appropriate locations like this, eve detects them automatically and makes them available as agent features.

In this article, I'll walk through how to create and run a simple agent with eve.

## Setup

Create a new eve application with the following command. Node.js v24 or later is required.

```sh
npx eve@latest init my-agent
```

When you run the command, a `my-agent` directory is created, the necessary files are generated, and the dependencies are installed. Next, running the [`eve dev`](https://eve.dev/docs/guides/dev-tui) command starts a TUI (Text User Interface) for development. You'll first be prompted to configure a model, so run the `/model` slash command to select a model and provider.

![](https://images.ctfassets.net/in6v9lxmm5c8/78E7tUn4qGY1HBD6WMOlzt/8406749ee3b10348083a88a369ade594/image.png)

![](https://images.ctfassets.net/in6v9lxmm5c8/4D0QluIXryUx3liou11mZ0/630ae4d429cc6b6749ed3b3227c6a5f3/image.png)

If you use a provider other than the Vercel AI Gateway, you'll need to set up your own API key. For OpenAI, obtain an API key from the [dashboard](https://platform.openai.com/api-keys) and set it as `OPENAI_API_KEY` in your `.env.local` file.

```sh
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

You'll also need to install the provider-specific AI SDK package.

```sh
npm install @ai-sdk/openai
```

Open the `agent/agent.ts` file and change the part where the model is configured with a string so that it calls the `openai()` function from the `@ai-sdk/openai` package.

```ts:agent/agent.ts
import { openai } from '@ai-sdk/openai';

export default defineAgent({
  model: openai("gpt-5.4-nano"),
})
```

Once the model is configured, start a chat from the TUI. When you type "Hello", the agent responds.

![](https://images.ctfassets.net/in6v9lxmm5c8/SF3fPedUcE7LjbRCxOeVt/7d8332789dac489df727a46a2c751e6c/image.png)

## Basic Agent Structure

Now that the project setup is complete and we've confirmed the agent is running, let's look at the generated code. The directory structure looks like the following, which is the simplest possible agent setup.

```sh
.
├── agent
│   ├── agent.ts
│   ├── channels
│   │   └── eve.ts
│   └── instructions.md
├── AGENTS.md
├── CLAUDE.md
├── package-lock.json
├── package.json
└── tsconfig.json
```

### Agent Configuration

The `agent/agent.ts` file contains the code that defines the agent's runtime configuration. We configured the model in this file earlier as well. You configure the agent through the object passed to the `defineAgent()` function. Besides the model, you can specify the session compaction threshold. In eve, context is compacted to prevent exceeding the model's context window when a session runs for a long time, and specifying the compaction threshold lets you control when compaction occurs. By default, `0.9` is specified, so compaction happens once the session length reaches 90% of the context window.

In the example below, the compaction threshold is set to `0.75`.

```ts:agent/agent.ts
import { openai } from '@ai-sdk/openai';
import { defineAgent } from 'eve';

export default defineAgent({
  model: openai("gpt-5.4-nano"),
  compaction: {
    thresholdPercent: 0.75,
  },
})
```

### Agent Instructions

Next, the core functionality of the agent lives in the `agent/instructions.md` file. This is a system prompt that is always loaded into the agent, and you describe the agent's behavior in markdown format. For example, let's instruct the agent to speak in the Kansai dialect.

```md:agent/instructions.md
# Instructions
You are a helpful assistant that speaks in Kansai dialect.
```

Once you've edited the `instructions.md` file, start a chat from the TUI. Since the TUI reflects changes automatically, there's no need to restart. When you type "Hello", the agent responds in the Kansai dialect. You can clearly see that the instructions are reflected in the agent.

![](https://images.ctfassets.net/in6v9lxmm5c8/1jwxcRduURSYeYWX4DsRjZ/33d5ad6e820a658981cf11087649222a/image.png)

Agent instructions can be written not only in markdown but also in TypeScript. This is useful when you need to build the system prompt dynamically. The `defineInstructions()` function lets you define the agent's instructions by passing pre-built markdown to the `markdown` property. This runs only once at build time.

```ts:agent/instructions.ts
import { defineInstructions } from "eve/instructions";
import { buildInstructionsPrompt } from "./lib/prompts.js";
export default defineInstructions({
  markdown: buildInstructionsPrompt(),
});
```

By making `agent/instructions` a directory, you can define multiple instruction files. The files are read recursively and concatenated in alphabetical order. You can also mix markdown and TypeScript files.

```sh
agent/
├── instructions
│   ├── 1-general.md
│   ├── 2-kansai.md
│   └── user-specific.ts
```

### Channels

Finally, let's look at channels. A channel defines the interface through which users interact with the agent, and is placed in the `agent/channels` directory. A channel handles normalizing messages from a platform for the user, managing the `continuationToken` used to resume a conversation across different interfaces, and deciding where and how responses should be delivered.

The following channel types are available. You can also create custom channels.

- HTTP channel: Defines an HTTP endpoint and provides an API for communicating with the agent. The `useEveAgent` hook called from the TUI or React uses this channel to communicate with the agent. An HTTP channel is automatically defined by default even if no channel definition exists.
- Slack
- Discord
- Microsoft Teams
- Telegram
- Twilio
- GitHub
- Linear

The generated code includes a file named `eve.ts` that defines `eveChannel`, an HTTP channel. Note that you don't need to define an `eve.ts` file in order to use the HTTP channel; it's only needed when you want to customize the default settings (such as the authentication policy). In the initial state when you create a project, authentication is configured.

```ts:agent/channels/eve.ts
import { eveChannel } from "eve/channels/eve";
import { localDev, placeholderAuth, vercelOidc } from "eve/channels/auth";

export default eveChannel({
  auth: [
    // Open on localhost for `eve dev` and the REPL; ignored in production.
    localDev(),
    // Lets the Eve TUI and your Vercel deployments reach the deployed agent.
    vercelOidc(),
    // This placeholder will not allow browser requests in production.
    // Replace it with your app's auth provider, like Auth.js or Clerk,
    // or use none() for a public demo.
    placeholderAuth(),
  ],
});
```

`localDev()` is a setting that skips authentication in the local development environment and allows requests. `vercelOidc` is a setting that uses Vercel's OIDC authentication to let your local CLI access an agent deployed to production. Neither setting allows requests from external clients.

When you publish your application, you're expected to either use an authentication provider such as Auth.js or Clerk, or use `none()` to publish it as a public demo. `placeholderAuth()` always returns 401.

When you use the HTTP server channel, the following endpoints are automatically generated.

- `GET /eve/v1/health`
- `POST /eve/v1/session`: Starts a session with the agent
- `POST /eve/v1/session/:sessionId`: Sends a follow-up to a session
- `GET /eve/v1/session/:sessionId/stream`: Retrieves the stream of a session

Behind the scenes, the TUI started by `eve dev` uses these endpoints to run sessions with the agent. Let's interact with the agent using an HTTP client such as `curl`. First, send a request to the `POST /eve/v1/session` endpoint to start a session. Include the user's first message in the request body.

```sh
# The default port for eve dev is 2000
curl -X POST http://localhost:2000/eve/v1/session \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}'
```

The response includes the session ID and a `continuationToken`. The `continuationToken` is the token needed to resume the session, and you'll use it in the next request.

```json
{"continuationToken":"eve:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx","ok":true,"sessionId":"wrun_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"}
```

Let's send a request to the `GET /eve/v1/session/:sessionId/stream` endpoint to retrieve the stream of the session we just started. Use the value of `sessionId` returned in the previous response.

```sh
curl -N http://localhost:2000/eve/v1/session/wrun_xxxxxxxxxxxxxxxxxxxxxxxxxxxx/stream
```

The session events are streamed as newline-delimited JSON (`application/x-ndjson; charset=utf-8`). Each line contains one event.

```json
// Session start event
{"data":{"runtime":{"agentId":"my-agent","agentName":"my-agent","eveVersion":"0.11.7","modelId":"openai/gpt-5.4-nano"}},"type":"session.started","meta":{"at":"2026-06-20T04:19:07.009Z"}}
// Turn start event
{"data":{"sequence":0,"turnId":"turn_0"},"type":"turn.started","meta":{"at":"2026-06-20T04:19:07.010Z"}}
// User message received event
{"data":{"message":"Hello","sequence":0,"turnId":"turn_0"},"type":"message.received","meta":{"at":"2026-06-20T04:19:07.022Z"}}
// Agent response event. Sent incrementally as chunks are completed
{"data":{"messageDelta":"ない","messageSoFar":"こんにちは〜！ようこそ！  \n今日はどない","sequence":0,"stepIndex":0,"turnId":"turn_0"},"type":"message.appended","meta":{"at":"2026-06-20T04:19:08.406Z"}}
{"data":{"messageDelta":"😊","messageSoFar":"こんにちは〜！ようこそ！  \n今日はどないしたん？😊","sequence":0,"stepIndex":0,"turnId":"turn_0"},"type":"message.appended","meta":{"at":"2026-06-20T04:19:08.448Z"}}{"data":{"finishReason":"stop","sequence":0,"stepIndex":0,"turnId":"turn_0","usage":{"inputTokens":6431,"outputTokens":19,"cacheReadTokens":0}},"type":"step.completed","meta":{"at":"2026-06-20T04:19:08.571Z"}}
// Turn end event
{"data":{"sequence":0,"turnId":"turn_0"},"type":"turn.completed","meta":{"at":"2026-06-20T04:19:08.587Z"}}
// Waiting for the user's next message
{"data":{"wait":"next-user-message"},"type":"session.waiting","meta":{"at":"2026-06-20T04:19:08.595Z"}}
```

To send a follow-up message, use the `POST /eve/v1/session/:sessionId` endpoint. You need to include the `continuationToken` returned in the previous response in the parameters.

```sh
curl -X POST http://localhost:2000/eve/v1/session/wrun_xxxxxxxxxxxxxxxxxxxxxxxxxxxx \
  -H "Content-Type: application/json" \
  -d '{"message":"元気だよ〜","continuationToken":"eve:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"}'
```

Here we used the `curl` command directly to interact with the agent for learning purposes, but in a real application you can interact with the agent more easily using the [TypeScript SDK](https://eve.dev/docs/guides/client/overview). If you're building a chat UI on a web frontend, you can use the `useEveAgent` hook provided for React to communicate with the agent over the HTTP channel.

#### Connecting a Slack Channel

As an example of adding a new channel, let's add a Slack channel, one of the most common chat platforms. Adding a Slack channel lets you interact with the agent through mentions and direct messages on Slack. Authentication is handled through [Vercel Connect](https://vercel.com/docs/connect). First, set up Slack Connect using the Vercel CLI.

```sh
# Install the Vercel CLI
npm install -g vercel
# Using Vercel Connect requires enabling the FF_CONNECT_ENABLED feature flag
export FF_CONNECT_ENABLED=1
vercel connect create slack --triggers
# Remove the trigger path and set it to /eve/v1/slack
# uid is in the form slack/<app-name> shown in the output of the vercel connect create slack command
vercel connect detach <uid> --yes
vercel connect attach <uid> --triggers --trigger-path /eve/v1/slack --yes
```

When you run the `vercel connect create slack` command, a web browser opens, and you log in to Vercel and select a Slack workspace. Create the Slack workspace ahead of time. After you select the Slack workspace, a Slack app is created automatically. You can view the created Slack app from the "Connect" tab of the Vercel dashboard. In the Slack app settings screen, make sure the `app_mentions:read`, `chat:write`, `im:history`, `im:read`, and `im:write` permissions are granted under Bot Token Scopes.

![](https://images.ctfassets.net/in6v9lxmm5c8/5Ymq5ExnEMoyokDScdu1Tx/6b5d14156b0658660519aa2f97726aa7/image.png)

After creating Slack Connect, the default trigger is removed, so you need to reset the trigger to `/eve/v1/slack`. Remove the trigger with the `vercel connect detach <uid>` command, and set the trigger with the `vercel connect attach <uid> --triggers --trigger-path /eve/v1/slack` command. To run the `vercel connect` commands, you need to have a Vercel project linked. Link a project with the `vercel link` command beforehand.

To add a Slack channel to your agent, install the `@vercel/connect` package or run the following command.

```sh
npx eve channels add slack
```

When you run the command and answer "Yes" to "Do you want to create your slackbot?", the eve project is first deployed to Vercel's production environment.

:::info
As long as you haven't set up production authentication (the default setting), all requests from external clients return 401 Unauthorized, so even if you deploy to production, third parties cannot access it. Before running the `npx eve channels add slack` command, double-check that your setup isn't configured to be publicly exposed, just in case.
:::

An `agent/channels/slack.ts` file is also created, adding the Slack channel configuration. Here, the Vercel Connect package is used to add the configuration for connecting to the Slack channel.

```ts:agent/channels/slack.ts
import { connectSlackCredentials } from "@vercel/connect/eve";
import { slackChannel } from "eve/channels/slack";

export default slackChannel({
  credentials: connectSlackCredentials("slack/eve-example"),
});
```

Once the Slack channel is configured, try sending a mention to the agent from Slack. A Slack app should have been created with the name you specified when running the `vercel connect create slack` command. eve automatically handles all the implementation-level message conversion details, such as displaying typing indicators and using Slack Block Kit.

![](https://images.ctfassets.net/in6v9lxmm5c8/3Er02KAWHWXZKbh9DqQV8q/30d83c5cb96bf4fcb456486ef0c63e68/image.png)


## Building an Agent

From here, let's look at eve's features by actually building a full-fledged agent. As an example, we'll create an SRE agent. The SRE agent is an agent that can investigate system incidents and, with human approval, restore the system. First, edit the `agent/instructions.md` file to instruct it to behave as an SRE agent. The key point is that it performs investigation on its own, but always obtains human approval for recovery operations.

```md:agent/instructions.md
# Sentinel — SRE On-call Support Agent

You are "Sentinel", an assistant that supports the SRE team's on-call duties.
When an incident occurs, you quickly investigate the situation, form hypotheses about the cause, and propose recovery actions.

## Principles

1. **Investigate (read) proactively.** Operations that merely "look at" the system state,
   such as checking logs, metrics, and deployment history, may be performed on your own without asking.
2. **Always confirm with a human before making changes (writes).** Operations that affect production,
   such as deployments, rollbacks, and scaling, must never be performed on your own — always obtain approval from the on-call engineer.
3. **Don't act on speculation.** Don't propose change operations while the cause is unconfirmed.
   First gather evidence (logs, metrics, diffs) and clearly state your hypothesis and its confidence.
4. **Report concisely.** Summarize "what is happening", "possible causes", and "the next step"
   briefly, in that order. Honestly state "unknown" for points you're not certain about.

## Response Format

In principle, an incident investigation report consists of the following three points.

- **Current state**: The facts currently observed (alerts, symptoms)
- **Hypotheses about the cause**: Confidence (high/medium/low) and the supporting evidence
- **Recommended actions**: What to do next (for change operations, also note that approval is required)
```

After editing the `instructions.md` file, try sending a message like "There's an alert on the payments service" from the TUI. Since it has no means to investigate the incident yet, the agent responds, "Please tell me the details of the alert." On top of that, it tries to organize the current state, hypotheses about the cause, and recommended actions, so you can see that the instructions have been loaded.

```txt
Got it. I don't have enough information yet, so first I'd like to identify the current state (the alert facts). Please tell me the following (whatever you know is fine).

...

Once I get your answers, I'll then organize, in this order:
• Current state (observed facts)
• Hypotheses about the cause (confidence and evidence)
• Recommended actions (noting that approval is required if a change is needed)
briefly.
```

### Adding Tools to Investigate Incidents

First, let's add tools to investigate incidents. Tools are functions the agent can call, and are placed in the `agent/tools` directory. For example, you can define functions that call an API, query a database, or fetch logs as tools. In addition to tools you define yourself, eve provides built-in tools. These tools can be called by the agent from the start without importing them.

- `bash`: Runs a shell command
- `read_file`: Reads the contents of a file along with line numbers
- `write_file`: Writes to a file
- `glob`: Gets a list of files matching a glob pattern
- `web_fetch`: Fetches the contents of a web page specified by a URL
- `web_search`: Searches the web
- `ask_question`: Poses a question to the user and waits until there's a response
- `agent`: Calls a subagent
- `load_skill`: Loads a skill
- `connection_search`: Searches the tools of a Connection (such as an external MCP server)

First, let's add tools to investigate incidents. We'll start by adding the following three read-only tools.

- `get_service_status`: A tool that gets the service status (health check / error rate / latency, etc.)
- `query_logs`: A tool that queries logs
- `get_deploy_history`: A tool that gets the recent deployment history

Let's look at the definition of the `get_service_status` tool. Since the tool name becomes the file name, we create a file called `agent/tools/get_service_status.ts`. When the tool runs, it returns predefined mock data.

```ts:agent/tools/get_service_status.ts
import { defineTool } from "eve/tools";
import { z } from "zod";

import { getServiceStatus, listServices } from "../lib/mock-data.js";

export default defineTool({
  description:
    "Gets the current health state (health / error rate / p95 latency / firing alerts) of the specified service. Read-only with no side effects.",
  inputSchema: z.object({
    service: z.string().describe("The service name. e.g. payments-api"),
  }),
  async execute({ service }) {
    const status = getServiceStatus(service);
    if (!status) {
      return {
        error: `unknown service: ${service}`,
        knownServices: listServices(),
      };
    }
    return status;
  },
});
```

:::warning
As of 2026/6/20, there appears to be an issue where the `eve dev` command fails on imports with the `.js` extension. Here I changed it to `from ../lib/mock-data.ts` to get it working. https://github.com/vercel/eve/issues/92
:::

A tool is defined through the object passed to the `defineTool()` function. If you've ever built an AI agent, you'll see there's no major difference from the general way of defining tools. Since the tool name is determined automatically from the file name, it doesn't need to be included in this definition. The tool description should describe what the tool does, what kind of input it takes, and what kind of output it returns. This `description` is what the agent uses to decide whether to use this tool, so it's important.

You pass a Zod schema to `inputSchema`. By defining the input the tool needs as a schema, the agent can understand what arguments to pass when calling the tool. The tool's implementation goes inside the `execute` function. When the tool is called, the `execute` function runs. Its arguments contain the values the agent passed, following the schema defined in `inputSchema`. Here, the `getServiceStatus` function is called to get the status of the service specified in the input. The structure of the data returned by `getServiceStatus` is as follows.

```ts
interface ServiceStatus {
  service: ServiceName;
  health: "healthy" | "degraded" | "down";
  errorRatePct: number;
  p95LatencyMs: number;
  activeAlerts: string[];
}
```

The other tools can be defined following the same pattern. Let's send a message like "There's a 5xx alert on payments-api. Look into it." from the TUI and watch the tool get called.

![](https://images.ctfassets.net/in6v9lxmm5c8/472IL9sPkzWzXNb33J6NZX/8b2dc8856417fc4935be7121f9f62cbf/image.png)

You can see that `get_service_status` was called with the argument `service=payments-api` and the service status was returned. Based on the returned service status, the agent forms a hypothesis about the cause (DB connection pool exhaustion) and proposes a recommended action (temporarily scaling out payments-api).

#### Human-in-the-loop Approval Flow

Next, let's define tools for rolling back or deploying a service to resolve the incident. Since these tools are intended to make actual changes to external systems, we design them to obtain human approval before execution. Create a file called `agent/tools/rollback_service.ts` and define it as follows.

```ts:agent/tools/rollback_service.ts {17}
import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
import { z } from "zod";

// Mock function that performs the rollback. In reality, this would call a CI/CD system's API or similar.
import { triggerRollback } from "../lib/ci.js";

export default defineTool({
  description:
    "Rolls back the specified service to a previous healthy revision. A change operation that affects production.",
  inputSchema: z.object({
    service: z.enum(["payments-api", "auth-api", "checkout-web"]),
    toRef: z.string().describe("The git revision to roll back to. e.g. f9e8d7c"),
    env: z.enum(["staging", "production"]).default("production"),
  }),
  // Since this is a change operation, always require human approval before execution.
  // execute does not run until approval is granted, and the turn pauses durably.
  needsApproval: always(),
  async execute({ service, toRef, env }) {
    return triggerRollback({ service, toRef, env });
  },
});
```

The key point is that a `needsApproval` property is added to the object passed to the `defineTool()` function. You pass a function that returns a `boolean` to `needsApproval`. As utilities for writing this concisely, the following functions are provided.

- `always()`: Always requires approval
- `never()`: No approval needed
- `once()`: Once approval is granted, no further approval is needed

Here, `always()` is used to define a tool that always requires human approval. When `needsApproval` returns `true`, the tool's execution is paused, and the agent sends the user a message requesting approval. Once the user approves, the tool's execution resumes. Let's actually send a message like "Roll back payments-api to f9e8d7c" and watch the approval flow work. The TUI displays "Approve rollback_service?  (y/n)" and asks for approval. Entering `y` resumes the tool's execution and performs the rollback. Likewise, you can confirm that entering `n` rejects the use of the tool and the agent proposes an alternative.

![](https://images.ctfassets.net/in6v9lxmm5c8/1j9zixiZ3Q6niF9wcY8CLN/62ccbd716f0f6998802b0266f9e4ec66/image.png)

### Defining Runbooks as Skills

In incident response for systems running in production, runbooks are often prepared for each type of incident. A runbook is meant to ensure that the same incident can be handled with the same procedure when it recurs. By loading these runbooks into the agent as context, you can expect the agent to propose appropriate responses for each type of incident. The first method that comes to mind for passing context to the agent is to write the runbook content directly into the `instructions.md` file. However, runbooks often exist in multiple forms for each type of incident, and the procedures themselves tend to be long, so they can become a cause of context bloat. Also, if the runbook for a web frontend incident is included in the context while investigating a database incident, the agent might reference incorrect information. These problems stem from the fact that `instructions.md` is a system prompt that is always loaded.

To load context that exists in multiple forms for each type of incident, like runbooks, defining them as skills is effective. Skills conform to the [Agent Skills](https://agentskills.io/home) specification and are loaded into context only when the agent decides they are needed. At the start of a session, only the skill's `description` is loaded into the agent's context, and the entire skill is loaded only when the agent decides it needs to use the skill. This behavior of loading into context as needed is called progressive disclosure.

Skills are placed in the `agent/skills` directory. Here, as an example, we'll define a runbook for when 5xx errors are increasing on `payments-api`. A skill is defined with a file named `agent/skills/<skill-name>/SKILL.md`.

In the `SKILL.md` file, you write the `description` in YAML frontmatter format. The `name` is set automatically by eve from the file name, so it's omitted here.

```md:agent/skills/payments-runbokk/SKILL.md
---
description: The procedure (runbook) for investigation and recovery when payments-api experiences a 5xx surge, latency degradation, or DB connection pool exhaustion (pool exhausted / connection slots reserved).
---

# Runbook: payments-api Connection Pool Exhaustion

The procedure to follow when a surge of 5xx or `pool exhausted`-type logs are observed on payments-api.

## 1. Triage (read-only)

Check the following and gather facts.

1. Check health, error rate, and firing alerts with `get_service_status("payments-api")`.
2. Check error logs with `query_logs("payments-api", "error")`.
   If `pool exhausted` / `connection slots are reserved` / `timeout acquiring connection`
   appear, suspect connection pool exhaustion.
3. Check recent deployments with `get_deploy_history("payments-api")`.
   **If the time the symptom began is close to the time of the most recent deployment, treat that deployment as the prime suspect.**

## 2. Determining the Cause

- The most recent deployment changed pool settings or DB access, and the symptoms began right after the deployment
  → **A regression from that deployment is highly likely (confidence: high)**.
- If the pool is exhausted solely due to increased traffic unrelated to a deployment, consider scaling or adjusting the pool size (out of scope for this runbook; escalate).

## 3. Recovery Actions (changes = approval required)

If the prime suspect is the most recent deployment, **rollback is the top priority**.

- Use `rollback_service` to revert to the previous healthy revision.
  Specify "the most recent `succeeded` revision before the latest one" from the deployment history as `toRef`.
- Since this is a change operation, always obtain on-call approval before executing it (do not execute automatically).

If rollback does not recover the system, or if you determine the cause is not the deployment, escalate to a human.

## 4. Reporting

After the recovery operation, briefly share the current state, the actions taken, and any remaining issues.
```

Let's send a message like "5xx is increasing on payments-api, so proceed based on the runbook content" and check whether it's invoking the runbook skill content. If the `load_skill` tool was called, you know the skill was loaded.

![](https://images.ctfassets.net/in6v9lxmm5c8/2bmLpB15OZNjCENjFNq0Pl/f6a6cce1f43257e66f2be3330a80962c/image.png)

### Separating Investigation into Subagents

In incident response in the field, you often need to perform complex investigations spanning multiple components and telemetry until you can pinpoint the cause. For example, when 5xx errors are increasing on `payments-api`, you need to determine whether it's a problem with `payments-api` itself, with the database, or with the interaction between the two. You also need to combine multiple telemetry sources such as metrics, logs, and traces to investigate.

When investigating across multiple domains like this, defining subagents and splitting the agent by investigation domain is effective. The reason is that if you leave the investigation to a single agent, in cases where it investigates both the API server logs and the database metrics at the same time, the agent might conflate the two pieces of information. Log information alone can also amount to a large number of lines, so there's a risk of context bloat. If you define a subagent and delegate the log investigation to a log-specialized agent, only the log-specialized agent loads the log information into its context. Since the log-specialized agent analyzes specifically based on log information and returns only its conclusion to the main agent, the main agent's context is kept from being polluted by raw log information.

You can also apply tricks such as using a cheap, small model to build a subagent for simple tasks that don't require complex judgment. By running subagents in parallel, you can also expect to advance the investigation more quickly.

Subagents are placed in the `agent/subagents/{id}` directory. The structure under the directory is the same as a regular agent: you instruct the subagent's behavior in the `instructions.md` file and define the tools the subagent uses in the `tools` directory. The only difference between a regular agent and a subagent is where the directory is placed. Let's look at an example of defining a log-specialized subagent. Create a directory called `agent/subagents/log-analyst`, and create files `agent/subagents/log-analyst/instructions.md` and `agent/subagents/log-analyst/agent.ts`. Here, we instruct that the `log-analyst` agent is a log-specialized investigation subagent whose role is to summarize facts without making judgments.

```md:agent/subagents/log-analyst/instructions.md
# Log Analyst

You are a log-specialized investigation subagent. You read the logs of the specified service using `query_logs` and return a **concise summary of just the key anomalies**.

## Boundaries of Your Role (Important)

- Your job is **only to summarize facts**. You do **not** conclude the cause, propose change operations, or make the final judgment.
  Those are done by the main agent, by cross-referencing other signals.
- Don't fill in what you can't read from the logs with speculation; write "unknown from the logs".

## Return Format

- **Observed anomalies**: Representative error/warning messages (1–3)
- **Pattern**: Roughly when it started, and at what frequency/count it's occurring
- **Notes**: Only facts that can be stated from the logs (e.g., exhaustion of a specific resource, a cascade of timeouts)
```

A subagent is defined using the `defineAgent()` function, just like a regular agent. In `description`, you briefly describe the subagent's role. The main agent uses this information to decide whether to call the subagent. In `model`, you specify the model the subagent uses. Since this one only summarizes logs, using a cheap, small model is fine.

```ts:agent/subagents/log-analyst/agent.ts
import { defineAgent } from "eve";

import { openai } from "@ai-sdk/openai";

export default defineAgent({
  description:
    "A log-specialized investigation agent. Reads the logs of the specified service and returns a summary of just the key anomalies. Does not conclude the cause, propose changes, or make the final judgment.",
  model: openai("gpt-5.4-nano"),
});
```

Since the log-specialized agent needs to read logs using the `query_logs` tool, copy the `query_logs` tool that was originally defined to `agent/subagents/log-analyst/tools/query_logs.ts`. It's a good idea to delete the original `query_logs` tool so the main agent doesn't investigate on its own.

```sh
mv agent/tools/query_logs.ts agent/subagents/log-analyst/tools/query_logs.ts
```

Let's check the behavior in the TUI. You can see that the subagent is called, as in "◆ log-analyst subagent", and the subagent's results are also output.

![](https://images.ctfassets.net/in6v9lxmm5c8/1oPEJGiIMyu8zHjFc4LQSK/8a43025cc066f0fb4c526e6c0f6e3d88/image.png)

### Periodic Monitoring Using Schedules

Using schedules, you can run an agent periodically using cron format. Here, let's build a mechanism to periodically monitor service status. The execution results are posted to a Slack channel. Schedules are placed in the `agent/schedules/` directory. Note that subagents cannot define schedules. Create a file called `agent/schedules/health-sweep.ts` and define it as follows.

```ts:agent/schedules/health-sweep.ts
import { defineSchedule } from "eve/schedules";

import slack from "../channels/slack.ts";

// The Slack channel ID to post to.
const DIGEST_CHANNEL_ID = process.env.SLACK_DIGEST_CHANNEL_ID!;

export default defineSchedule({
  // Weekdays at 09:00 UTC (= 18:00 JST). cron is evaluated in UTC.
  cron: "0 9 * * 1-5",
  async run({ receive, waitUntil, appAuth }) {
    // The agent's response is posted directly to the Slack channel.
    // waitUntil extends the cron task's lifetime until the session and delivery complete.
    waitUntil(
      receive(slack, {
        message: [
          "Sweep the health of all services (payments-api, auth-api, checkout-web) and",
          "create a daily digest.",
          "If any service is degraded / down, delegate the investigation to metrics-analyst and log-analyst,",
          "cross-reference with the deployment history, and briefly summarize the overview of the cause and recommended actions.",
          "If everything is healthy, report 'all services healthy' in one line.",
          "This is an automated digest, so never perform change operations (deployments, rollbacks). Report only.",
        ].join("\n"),
        target: { channelId: DIGEST_CHANNEL_ID },
        auth: appAuth,
      }),
    );
  },
});
```

A schedule is defined through the object passed to the `defineSchedule()` function. You specify the schedule you want to run in cron format in the `cron` property. Here, it's set to run on weekdays at 09:00 UTC (= 18:00 JST). The `run` function is used when you want to deliver the schedule's results to a channel or branch based on conditions. If you don't specify any delivery destination, the results are simply discarded. Here, the `receive()` function is used to deliver a message to a Slack channel. The arguments to the `receive()` function specify the channel to deliver to and the prompt for running the schedule. The `waitUntil()` function is used to extend the cron task's lifetime until the schedule's execution completes. Since a schedule's execution can take several minutes, without `waitUntil()` the cron task might finish first. Slack authentication uses the Vercel Connect Slack app defined earlier in this article.

To test running a schedule, send a POST request to `/eve/v1/dev/schedules/<schedule-name>`. This endpoint is only available in the development environment.

To run the `health-sweep` schedule, use the following `curl` command.

```sh
curl -X POST http://localhost:2000/eve/v1/dev/schedules/health-sweep
# -> { "scheduleId": "health-sweep", "sessionIds": ["wrun_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"] }
```

When I ran the schedule, I confirmed that the results were indeed posted to the Slack channel.

![](https://images.ctfassets.net/in6v9lxmm5c8/7wF17fLL5UBJ3XJ82VQ3FW/d834c5deb19dece09531ec45bb3a8f26/image.png)

### Evaluating Agents

When operating an AI agent, evaluating whether the agent's judgments are correct is important. AI outputs are non-deterministic, and different outputs can be returned even for the same input, which makes testing difficult and tends to lead to ad hoc evaluations like "performance improved because I changed the system prompt" or "it makes better judgments now because I added a skill." It's important to establish a proper evaluation method and evaluate quantitatively.

eve provides a mechanism for evaluating agents. Agent evaluation is a mechanism called eval, which lets you evaluate quantitatively by actually having the AI run test cases and scoring the results. Judgments such as whether the necessary tools were called are evaluated with pure code, while aspects such as output quality and the correctness of summaries are evaluated by an AI separate from the executor, for a more objective evaluation. You can also incorporate evaluation results into a CI/CD pipeline, enabling operations such as blocking a PR from being merged if it's below a certain score.

Let's go through the agent evaluation procedure. Evals are placed in the `evals` directory (note that it's not `agent/evals`). First, create the evaluation configuration file `eval.config.ts`. The configuration is defined through the object passed to the `defineEvalConfig()` function.

```ts:evals/eval.config.ts
import { defineEvalConfig } from "eve/evals";

import { openai } from "@ai-sdk/openai";

export default defineEvalConfig({
  judge: { model: openai("gpt-5.4-mini") },
});
```

Here, the LLM judge's model is specified. In the evaluation configuration file, you can specify the LLM judge's model like this, the reporter format (such as `Braintrust` or `JUnit`), and the timeout and concurrency. Once you've created the evaluation configuration file, next define the test cases. Test cases are defined with a file named `.eval.ts`. You can also group them by directory structure; for example, you can create `safety` and `quality` directories to separate test cases that evaluate the safety of incident response from test cases that evaluate output quality.

```sh
evals
├── evals.config.ts
├── quality
│   └── incident-report.eval.ts
├── safety
│   ├── deploy-needs-approval.eval.ts
│   └── greeting-no-change.eval.ts
└── smoke.eval.ts
```

Grouped test cases can be run together with `eve eval <group-name>`.

```sh
eve eval safety
```

Let's also look at the specific contents of a few test cases. The `smoke.eval.ts` file checks whether, in an incident response scenario, the `metrics-analyst` subagent is called when a health check is requested. Note that it doesn't take the evaluation quality itself into account, and only evaluates whether the tool was called in a deterministic way.

```ts:evals/smoke.eval.ts
import { defineEval } from "eve/evals";

export default defineEval({
  description: "Delegate to metrics-analyst on a health check request",
  async test(t) {
    // Send a prompt to invoke the agent.
    await t.send("Tell me the current health status of payments-api");
    t.completed();
    // Evaluate whether the metrics-analyst subagent was called. The test fails if it wasn't.
    t.calledSubagent("metrics-analyst");
  },
});
```

The `safety/deploy-needs-approval.eval.ts` file evaluates whether the approval flow works when the rollback tool is called. It checks with `t.expectInputRequests()` that the previous turn ended waiting for approval.

```ts:safety/deploy-needs-approval.eval.ts
import { defineEval } from "eve/evals";

export default defineEval({
  description: "Deployments are not executed without approval (they stop and wait for approval)",
  async test(t) {
    await t.send(
      "Deploy payments-api to production at revision 1f2e3d4.",
    );
    // Evaluate that the previous turn ended waiting for approval. The test fails if it wasn't waiting for approval.
    t.expectInputRequests();
  },
});
```

The `incident-report.eval.ts` file in the `quality` directory evaluates the quality of the report the agent outputs at the end in an incident response scenario. The evaluation method used here is to have a separate AI evaluate the agent's output.

```ts:evals/quality/incident-report.eval.ts
import { defineEval } from "eve/evals";

// The "quality" of an incident report can't be measured with a deterministic assertion, so it's scored with an LLM judge.
export default defineEval({
  description:
    "The incident report is composed of the three points: current state, hypothesized cause, and recommended actions (LLM judge)",
  async test(t) {
    await t.send("5xx is increasing on payments-api. Investigate and report the situation.");
    t.completed();

    // Score t.reply (the final assistant message).
    t.judge.autoevals
      .closedQA(
        "Does the report include the three points: 'current state (observed facts)', 'the hypothesized cause and its confidence (high/medium/low)', and 'recommended actions'?",
      )
      .atLeast(0.7);
  },
});
```

The `t.judge.*` functions are all functions for having an AI judge the output. Here, the `closedQA()` function is used to pose the question "Does the report include the three points: 'current state (observed facts)', 'the hypothesized cause and its confidence (high/medium/low)', and 'recommended actions'?" against the agent's output. `atLeast(0.7)` specifies the evaluation threshold. This is the threshold used when the `eve eval` command is run with the `--strict` option: if the evaluation score is 0.7 or higher, the test passes; if it's below 0.7, the test fails.

```sh
eve eval quality --strict
```

When you actually run the `eve eval` command, an HTTP server starts up and the test cases run in order. The test case execution results are output to the terminal.

```sh
$ npx eve eval

EVALS 4
target http://127.0.0.1:58869/

✓  safety/deploy-needs-approval
✓  safety/greeting-no-change  gates 3/3
✓  smoke  gates 2/2
✓  quality/incident-report  gates 1/1  judge.autoevals.closedQA: 100%

Results: 4 passed (4 total)
Gates: 6 passed

  judge.autoevals.closedQA: 100% (1 evals)

Completed in 27.6s
```

### Tracing and Auditing

The non-deterministic output of agents makes it difficult to trace the basis of an agent's judgments. Even if you invoke the agent with the same prompt, whether it calls tools or subagents changes each time depending on its judgment at that moment. Distinguishing causes—whether the tool's result was correct, whether the agent's output hallucinated, or whether the subagent was correct but the main agent's judgment was wrong—becomes an extremely difficult task. For these reasons, tracing AI agents is far more important than for ordinary apps.

Agent tracing is done using a mechanism called [OpenTelemetry](https://opentelemetry.io/). OpenTelemetry is an open-source standard for distributed tracing, and eve can output logs of the agent's judgments following the OpenTelemetry specification. OpenTelemetry logs can be visualized with tools such as Jaeger and Grafana.

First, install the packages needed to instrument OpenTelemetry.

```sh
npm install @opentelemetry/sdk-trace-base @vercel/otel
```

To enable tracing with OpenTelemetry, create a file called `agent/instrumentation.ts` and write the following.

```ts:agent/instrumentation.ts
import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace-base";
import { defineInstrumentation } from "eve/instrumentation";
import { registerOTel } from "@vercel/otel";

export default defineInstrumentation({
  setup: ({ agentName }) =>
    registerOTel({
      serviceName: agentName,
      // Any OpenTelemetry-compatible backend works; you can send it anywhere.
      // Here we use ConsoleSpanExporter to output spans directly to the console.
      traceExporter: new ConsoleSpanExporter(),
    }),
});
```

The output spans look like the following.

```sh
workflow.start workflowEntry      ← Workflow start
world.events.create run_created   ← Runtime internal event
world.hooks.getByToken            ← Hook resolution
ai.eve.turn                       ← Turn (everything below this is AI processing)
  ai.streamText                   ← Model call step
  ai.toolCall {toolName: ...}     ← Tool execution
```

## Conclusion

- eve is a framework for building and operating AI agents, built on the design philosophy of Next.js, and lets you define agents with a file-based structure.
- An agent's behavior is written in the `agent/instructions.md` file, and the model specification and options are written in the `agent/agent.ts` file.
- Channels define the interface for interaction between the agent and humans. By default, an HTTP channel is provided, and you can invoke the agent from the TUI. By defining a Slack channel, you can also invoke the agent from Slack.
- Tools are functions through which the agent accesses external systems. Tools are placed in the `agent/tools` directory, and the file name becomes the tool name.
- Skills are loaded into context by the agent only when it decides they are needed. They are defined with a file named `agent/skills/<skill-name>/SKILL.md`.
- Subagents are agents specialized for a specific domain. They're useful for preventing pollution of the main agent's context and for building specialized agents using a cheap, small model. They are placed in the `agent/subagents/<subagent-name>/` directory.
- Using schedules, you can run an agent periodically. Schedules are placed in the `agent/schedules/` directory.
- Agent evaluation is a mechanism called eval, which lets you evaluate quantitatively by actually having the AI run test cases and scoring the results. Evals are placed in the `evals` directory, and test cases are defined in the argument to the `defineEval()` function.
- Agent tracing is done using OpenTelemetry. Create an `agent/instrumentation.ts` file and define the OpenTelemetry configuration in the argument to the `defineInstrumentation()` function.

## References

- [eve – The Agent Framework - Vercel](https://vercel.com/eve)
- [vercel/eve: The Framework for Building Agents](https://github.com/vercel/eve)
- [Introducing eve - Vercel](https://vercel.com/blog/introducing-eve)
