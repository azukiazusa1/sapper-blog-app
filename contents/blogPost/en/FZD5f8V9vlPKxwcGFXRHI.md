---
id: FZD5f8V9vlPKxwcGFXRHI
title: "Trying TypeSafe AI's Jev with TypeScript"
slug: "jev-support-routing"
about: "Jev is a model that takes a state and returns choice decisions, graded scores, and the probability that something is true. This article evaluates support inquiries in TypeScript and routes them to departments or human review based on actual outputs."
createdAt: "2026-09-19T10:17+09:00"
updatedAt: "2026-09-19T10:17+09:00"
tags: ["AI", "TypeScript", "Jev"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/6IFwwMv5OWP97a1KHCoetH/3edb786ffe156aff5befc0ba9b1513d9/food_chuuka-chimaki_9876-768x640.png"
  title: "ちまきのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "What does the `confidence` field in a Jev Choice answer represent?"
      answers:
        - text: "How concentrated the probability distribution over the candidates is on a single candidate"
          correct: true
          explanation: "confidence is a 0–1 metric computed from the shape of the probabilities distribution. The more the probability is concentrated on one candidate, the higher it is."
        - text: "The degree to which the selected candidate is guaranteed to be correct"
          correct: false
          explanation: "A high confidence does not guarantee the decision is correct. It is a measure of how concentrated the probability distribution is."
        - text: "The sum of the probabilities of all candidates"
          correct: false
          explanation: "The probabilities always sum to 1. confidence represents how concentrated the distribution is."
        - text: "The time the model took to generate the answer"
          correct: false
          explanation: "confidence has nothing to do with processing time."
    - question: "Which of the following correctly describes the answer to a Noul question?"
      answers:
        - text: "A boolean `true` or `false` along with its confidence"
          correct: false
          explanation: "Noul does not return a boolean, and it has no separate confidence field."
        - text: "A number between 0 and 1 representing the probability that the answer is \"yes\""
          correct: true
          explanation: "For a yes/no question, Noul returns the probability that the answer is \"yes.\" A value around 0.5 means the judgment is split."
        - text: "A score along ordered levels"
          correct: false
          explanation: "Use Score for evaluations along ordered levels."
        - text: "A probability distribution over candidates"
          correct: false
          explanation: "Choice is the question type that returns a probability distribution over candidates."
published: true
---

Large language models (LLMs) are designed to generate text for humans to read. They are well suited to everyday chat, document generation, and summarization, but because it is hard to get deterministic results from them, they are difficult to wire into application control flow such as conditional branching. Common workarounds include designing prompts that make the LLM return structured decisions, or parsing the generated output and converting it into a form that can drive a branch.

[Jev](https://docs.typesafe.ai/introduction), provided by [TypeSafe AI](https://typesafe.ai/), is a model that evaluates typed questions against a given state. TypeSafe calls this class of model System One. System One models are designed to make fast, structured decisions that software can consume directly.

:::info
The name System One comes from "System 1," introduced in Daniel Kahneman's book _Thinking, Fast and Slow_. System 1 is the part of the mind that makes intuitive, fast judgments, while System 2 makes slower, more deliberate and logical ones. Like System 1, Jev is designed to return intuitive judgments that take the meaning of the text into account.
:::

For example, suppose a customer sends the following inquiry, and you need to determine which department should handle it and how urgent it is. (In practice, the text is passed to Jev inside the `state` described later, but here only the text is shown for simplicity.)

```text
今月の利用料金が二重に引き落とされています。困っているので、本日中に確認して返金してください。
```

(Translation: "I've been charged twice for this month's usage fee. This is a problem, so please look into it and refund me today.")

When you give this inquiry to Jev, it returns a JSON result like the following.

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "department": {
      "type": "choice",
      "choice": "billing",
      "confidence": 1,
      "probabilities": {
        "sales": 0,
        "technical": 0,
        "other": 0,
        "billing": 1
      }
    },
    "isUrgent": {
      "type": "noul",
      "noul": 0.97
    }
  }
}
```

`department.choice` is `billing`, which represents the billing team. `confidence` indicates how concentrated the probability distribution over the candidates is on a single candidate, and a value of `1` shows that the model has narrowed the candidates down to `billing` alone. `isUrgent.noul`, which represents urgency, is `0.97`. `noul` is a question type that returns the probability that the answer to a yes/no question is "yes." The high value of `0.97` tells us the inquiry is strongly judged to be urgent.

Based on this result, you can write code that routes the inquiry to the billing team as a high-priority item.

In this article, we'll actually call Jev from TypeScript and implement logic that routes support inquiries.

## Three Types of Questions

Let's start with the basic concepts of Jev. Jev lets you choose among the following three types of questions.

- [Choice](https://docs.typesafe.ai/primitives/choice): the selected candidate, the probability of each candidate, and a confidence value
- [Noul](https://docs.typesafe.ai/primitives/noul): a number from 0 to 1 representing the probability that something is true
- [Score](https://docs.typesafe.ai/primitives/score): a score along ordered levels, the probability of each level, and a confidence value

Choice picks one option from a set of unordered candidates. For example, for the question "Which department should handle this: billing, technical, sales, or other?", it returns `billing` if it picks the billing team. The answer includes `confidence` and `probabilities`. `confidence` measures how concentrated the probability is on a particular candidate. For example, a probability distribution of `0 0 0 1` leaves no room for doubt, so the confidence is `1`. `probabilities` is the probability distribution over the candidates, and it sums to 1.

The value Noul returns is not `true` or `false` but the probability that the statement is true. For example, for the question "Does this inquiry contain an explicit request for a quick response or a deadline?", you would read `0.97` as a strong judgment that it is urgent, and a value around `0.5` as a split judgment. Noul does not have a separate `confidence` field.

Score is used for evaluations along ordered levels. For example, for the question "How much frustration does the customer who wrote this inquiry express?", you might define levels such as 0 for "calm," 1 for "frustrated but polite," and 2 for "strong anger or blame." The score is the average of the level numbers weighted by their probabilities, so it can be a fractional value. In addition to `score`, the answer includes `probabilities` for each level, `confidence`, and `legend`, which maps each level number to its description.

## State: Providing Context

[State](https://docs.typesafe.ai/concepts/state) bundles what Jev is judging together with the background information it needs to make that judgment. When routing inquiries as in this example, the conversation history, order information, and the current state of the application can all be inputs to the decision, in addition to the inquiry text itself.

`state` accepts a string, a JSON object, or an array. If you only need to evaluate text, a string is enough. When passing multiple pieces of information, using an object with named keys such as `ticket` and `order` makes it clear what each one represents. For example, when deciding on a refund, including the order information and refund policy in the same `state` along with the inquiry gives Jev the context it needs to cross-check them.

As a concrete example, here is the request body that was sent to get the result shown at the beginning. The inquiry text is placed in `state.ticket`, and `questions` defines three questions that evaluate the department, urgency, and level of frustration.

```json
{
  "model": "jev-latest",
  "state": {
    "ticket": "今月の利用料金が二重に引き落とされています。困っているので、本日中に確認して返金してください。"
  },
  "questions": {
    "department": {
      "type": "choice",
      "instructions": "この問い合わせを最初に担当する部署はどこですか？",
      "criteria": {
        "billing": "請求、二重請求、支払い、返金の問題",
        "technical": "ログイン、エラー、不具合、外部サービスとの連携の問題",
        "sales": "購入前の料金プラン、機能、導入についての相談",
        "other": "どの部署にも当てはまらない、または判断に必要な情報がない"
      }
    },
    "isUrgent": {
      "type": "noul",
      "instructions": "この問い合わせには、急いで対応してほしいという明示的な要求や期限がありますか？"
    },
    "frustration": {
      "type": "score",
      "instructions": "問い合わせを書いた顧客はどの程度の不満を表していますか？",
      "criteria": [
        "不満を表さず、落ち着いて質問や事実を述べている",
        "不満や困惑を表しているが、丁寧に対応を求めている",
        "強い怒りや非難を表している、または不満を理由に解約すると述べている"
      ]
    }
  }
}
```

The questions and criteria are written in Japanese here. In English, they read as follows:

- `department`: "Which department should handle this inquiry first?" — `billing`: billing, double charges, payments, and refunds; `technical`: login, errors, bugs, and integrations with external services; `sales`: pre-purchase questions about pricing plans, features, and adoption; `other`: doesn't fit any department, or there isn't enough information to decide
- `isUrgent`: "Does this inquiry contain an explicit request for a quick response or a deadline?"
- `frustration`: "How much frustration does the customer who wrote this inquiry express?" — 0: calmly asks a question or states facts without expressing frustration; 1: expresses frustration or confusion but politely asks for help; 2: expresses strong anger or blame, or says they will cancel because of their dissatisfaction

## Evaluating Inquiries with TypeScript

From here on, we'll implement the logic using the [official JavaScript SDK](https://docs.typesafe.ai/sdk/javascript). Set up a Node.js environment and run the following commands in an empty project.

```bash
npm init -y
npm pkg set type=module
npm install --save-exact @typesafe-ai/sdk@0.6.0
npm install --save-dev --save-exact typescript@7.0.2 tsx@4.23.13 @types/node@22.20.4
```

Save the API key you obtained from the [TypeSafe dashboard](https://console.typesafe.ai/keys) in a `.env` file.

```dotenv:.env
TYPESAFE_API_KEY=your_api_key
```

:::warning
The Jev API is billed on a pay-as-you-go basis according to factors such as the number of input tokens. The [TypeSafe website](https://typesafe.ai/) lists the price as "$42 per billion input tokens." You can check your usage in the [TypeSafe console](https://console.typesafe.ai/usage).
:::

### Asking About Department, Urgency, and Frustration

Create `src/triage.ts` and define the questions to evaluate and the API client. The API key is read from the `TYPESAFE_API_KEY` environment variable.

```ts:src/triage.ts
import { choice, noul, score, TypeSafeClient } from "@typesafe-ai/sdk";

export const client = new TypeSafeClient({
  baseURL: "https://api.typesafe.ai",
  logLevel: "off",
  retry: { maxRetries: 0 },
});

export const questions = {
  department: choice("この問い合わせを最初に担当する部署はどこですか？", {
    billing: "請求、二重請求、支払い、返金の問題",
    technical: "ログイン、エラー、不具合、外部サービスとの連携の問題",
    sales: "購入前の料金プラン、機能、導入についての相談",
    other: "どの部署にも当てはまらない、または判断に必要な情報がない",
  }),
  isUrgent: noul("この問い合わせには、急いで対応してほしいという明示的な要求や期限がありますか？"),
  frustration: score("問い合わせを書いた顧客はどの程度の不満を表していますか？", [
    "不満を表さず、落ち着いて質問や事実を述べている",
    "不満や困惑を表しているが、丁寧に対応を求めている",
    "強い怒りや非難を表している、または不満を理由に解約すると述べている",
  ]),
};

export async function evaluateTicket(ticket: string) {
  return client.systemOne({ model: "jev-latest", state: { ticket }, questions });
}
```

`TypeSafeClient` is the client for calling the Jev API. You can pass options like the following to its constructor.

- `apiKey`: The API key. If omitted, the value of the `TYPESAFE_API_KEY` environment variable is used
- `baseURL`: The API endpoint. Defaults to `https://api.typesafe.ai` (the `TYPESAFE_BASE_URL` environment variable takes precedence if set)
- `logLevel`: The level of logs the SDK outputs. Defaults to `warn`. Here we set it to `off` so that only the execution results are printed to the console
- `retry`: Retry settings. By default, the SDK retries up to 2 times on status codes 408, 429, and 500–599. Here we disable retries with `maxRetries: 0` so that the API isn't called repeatedly by accident during testing. In production, it's a good idea to keep retries enabled to handle transient failures
- `timeout`: The timeout for a single request, in milliseconds. Defaults to `10000`

See [TypeSafeClientConfig](https://docs.typesafe.ai/sdk/javascript/api/interfaces/TypeSafeClientConfig) for other options.

The `questions` object defines the questions. `choice()`, `noul()`, and `score()` are functions that define each type of question.

The second argument of `choice()` maps candidate names to their descriptions. Because the SDK infers the answer type from this definition, `response.answers.department.choice` is typed as `"billing" | "technical" | "sales" | "other"`.

The second argument of `score()` is an array ordered from the lowest level to the highest. Since the array indices correspond to the score levels, the range in this example is 0–2.

To actually evaluate an inquiry, pass the inquiry text to `evaluateTicket()`. Inside the function, it calls `client.systemOne()`, puts the inquiry text in `state`, and passes the questions defined in `questions`. The answer types are inferred from the `questions` definition.

### Using the Answers in Code

Next, let's use the result of `evaluateTicket` in code. Here, based on the result of calling Jev, we return which department should handle the inquiry in `queue` and its priority in `priority`.

```ts:src/triage.ts
type Answers = Awaited<ReturnType<typeof evaluateTicket>>["answers"];

export function decideRoute(answers: Answers) {
  const { department, isUrgent, frustration } = answers;
  // Send to human review if confidence is low or the department is "other"
  if (department.choice === "other" || department.confidence < 0.8) {
    return { queue: "manual_review", priority: "needs_review" } as const;
  }

  if (isUrgent.noul >= 0.8 ||
      (frustration.confidence >= 0.8 && frustration.score >= 1.5)) {
    return { queue: department.choice, priority: "high" } as const;
  }

  if (isUrgent.noul > 0.2 || frustration.confidence < 0.8) {
    return { queue: department.choice, priority: "needs_review" } as const;
  }

  return { queue: department.choice, priority: "normal" } as const;
}
```

First, if the department is `other` or the department confidence is below `0.8`, the function returns `queue: "manual_review"` so that a human reviews the inquiry. Next, it checks the urgency probability and the frustration score to decide whether the priority should be `high` or `needs_review`.

### Running the Code

Create the entry point `src/run.ts`, which prints the evaluation result and the routing destination for an inquiry.

```ts:src/run.ts
import { evaluateTicket, decideRoute } from "./triage.ts";

const ticket =
  "今月の利用料金が二重に引き落とされています。困っているので、本日中に確認して返金してください。";

try {
  const response = await evaluateTicket(ticket);
  console.log(JSON.stringify(response, null, 2));
  console.log(JSON.stringify(decideRoute(response.answers)));
} catch {
  console.error("問い合わせを評価できませんでした。未分類として確認してください。");
  process.exitCode = 1;
}
```

Run the following command to load `.env` and execute the TypeScript code.

```bash
node --env-file=.env --import tsx src/run.ts
```

After the API response shown at the beginning of the article, the routing result is printed.

```json
{"queue":"billing","priority":"high"}
```

The department is `billing` and the priority is `high`. Based on the content of the inquiry, it can be routed to the billing team as a high-priority item.

I also tried a few other inquiries. The results are shown in the table below.

| Inquiry | Selected department | Department confidence | Urgency probability | Frustration score | Queue / Priority |
| --- | --- | --- | --- | --- | --- |
| Double charge; wants it checked and refunded today | `billing` | 1 | 0.97 | 1 | `billing` / `high` |
| 500 error on login; not urgent | `technical` | 1 | 0.04 | 0.05 | `technical` / `normal` |
| Paid plan features don't work; unsure whether it's a billing issue or a bug | `technical` | 0.57 | 0.08 | 0.99 | `manual_review` / `needs_review` |
| Wants to follow up on "the matter from the other day" | `other` | 1 | 0.06 | 0 | `manual_review` / `needs_review` |

## Summary

- Jev is a model that takes a state and typed questions as input and returns candidate choices, graded scores, and the probability that something is true
- The `confidence` of Choice and Score represents how concentrated the probability distribution is; using it as a threshold lets you send hard-to-judge inputs to human review
- By combining the three question types—Choice, Noul, and Score—you can evaluate the department, urgency, and level of frustration of an inquiry
- We called Jev from TypeScript and walked through an example that decides the routing destination and priority based on the confidence and scores in the answers

## References

- [Introducing System One Models & Jev - TypeSafe AI](https://typesafe.ai/blog/introducing-system-one-models-and-jev)
- [Introduction - TypeSafe AI](https://docs.typesafe.ai/introduction)
- [Example use cases - TypeSafe AI](https://docs.typesafe.ai/concepts/use-case-map)
- [Choice - TypeSafe AI](https://docs.typesafe.ai/primitives/choice)
- [Noul - TypeSafe AI](https://docs.typesafe.ai/primitives/noul)
- [Score - TypeSafe AI](https://docs.typesafe.ai/primitives/score)
- [Confidence - TypeSafe AI](https://docs.typesafe.ai/confidence)
- [JavaScript SDK - TypeSafe AI](https://docs.typesafe.ai/sdk/javascript)
- [typesafe-ai/typesafe-sdk-js](https://github.com/typesafe-ai/typesafe-sdk-js)
