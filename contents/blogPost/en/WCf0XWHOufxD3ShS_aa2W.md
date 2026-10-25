---
id: WCf0XWHOufxD3ShS_aa2W
title: "Classifying and Grading Support Inquiries with the OpenAI Decisions API"
slug: "openai-decisions-api"
about: "The OpenAI Decisions API returns condition checks, classifications, and graded ratings for an input. Using an example that evaluates support inquiries from TypeScript, this article explains when to use predicate, choice, and score."
createdAt: "2026-10-25T22:00+09:00"
updatedAt: "2026-10-25T22:00+09:00"
tags: ["OpenAI", "AI"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/5hWgJ38MGXNHDSQspIF2XF/2fa6a459b730a79fe35e10c9cbe3eee0/spaceshuttle_flying_13577-768x591.png"
  title: "スペースシャトルのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "When you use a predicate to check whether an inquiry asks for a refund, what is the main value returned?"
      answers:
        - text: "A boolean indicating whether a refund was requested"
          correct: false
          explanation: "A predicate does not return a boolean. It returns the probability, as estimated by the model, that the condition is true."
        - text: "The probability, as estimated by the model, that a refund was requested"
          correct: true
          explanation: "probability is a number between 0 and 1. Your application decides from which value to treat the inquiry as a refund request."
        - text: "Permission indicating whether the refund may actually be issued"
          correct: false
          explanation: "Whether a refund was requested and whether the customer is eligible for one are separate decisions."
        - text: "A sentence explaining why the model concluded a refund was requested"
          correct: false
          explanation: "The main value returned by a predicate is probability. To generate explanations, use something else such as Structured Outputs."
    - question: "If a score question has levels 0, 1, and 2 with probabilities 0.2, 0.6, and 0.2 respectively, what does the returned score represent?"
      answers:
        - text: "0.6, the probability of the most likely level"
          correct: false
          explanation: "The score is not a probability itself. It is the probability-weighted average of the level indices."
        - text: "2, the index of the most severe level"
          correct: false
          explanation: "It does not always pick the most severe level. It is calculated from the probability of each level."
        - text: "3, the number of levels with a non-zero probability"
          correct: false
          explanation: "It does not count levels. It multiplies each level index by its probability and sums the results."
        - text: "1.0, the probability-weighted average of the level indices"
          correct: true
          explanation: "0 × 0.2 + 1 × 0.6 + 2 × 0.2 = 1.0. Note that the same average can come from different probability distributions."
    - question: "How should you implement changing the next question depending on the department chosen first?"
      answers:
        - text: "Split the requests and branch in code using the earlier answer"
          correct: true
          explanation: "Later questions in the same questions array do not receive the answers to earlier questions."
        - text: "List the questions in the same array, and earlier answers are passed along automatically"
          correct: false
          explanation: "Group questions that can be evaluated independently from the same input. Send questions that depend on an answer in a separate request."
        - text: "Give both questions the same name so they share the answer"
          correct: false
          explanation: "name identifies an answer. It is not a mechanism for passing results between questions."
        - text: "Change the choice to a score so the questions are processed in order"
          correct: false
          explanation: "score is a question type for graded ratings. It does not specify the execution order or dependencies between questions."
    - question: "How does the article handle an answer whose type is refusal?"
      answers:
        - text: "Treat it as if the condition were false and replace it with a probability of 0"
          correct: false
          explanation: "A refusal is different from an evaluation that the condition is false."
        - text: "Treat every answer in the same request as refused"
          correct: false
          explanation: "Refusals are returned per question, and other questions may still receive normal answers."
        - text: "Treat it as undecided and handle it separately from normal answers"
          correct: true
          explanation: "Check the type so that a refusal is never read as the result of a condition check or classification."
        - text: "Conclude that the HTTP request itself failed"
          correct: false
          explanation: "A refusal can appear inside a successful response, so distinguish it from HTTP errors."
published: true
---

When integrating an LLM into an application, you often want to automate decisions whose shape is known in advance. For example, when routing inquiries that arrive at a support desk, you need to check whether the customer is requesting a refund, classify which department should handle it, and rate how severe the issue is. Each decision may be simple on its own, but as volume grows, the latency and cost add up.

The OpenAI [Decisions API](https://developers.openai.com/api/docs/guides/decisions) returns condition checks, classifications, and graded ratings for an input. It accepts questions with a constrained set of possible answers and responds quickly at low cost. OpenAI states that it is about 10 times faster than the Responses API.

In this article, we'll use an example that evaluates support inquiries from TypeScript to show how to choose between the three question types and how to read the returned probabilities and scores.

:::info
The Decisions API [became generally available on October 22](https://developers.openai.com/api/docs/changelog). The model currently available is `gpt-6-luna`.
:::

## What the Decisions API Can Do

With the Decisions API, you send the content to evaluate and your questions to `POST /v1/decisions`, and receive an answer for each question. There are three question types:

| Question type | Example in inquiry handling | Main value returned |
| --- | --- | --- |
| `predicate` | Is the customer requesting a refund? | The probability, as estimated by the model, that the condition is true |
| `choice` | Should this go to billing, technical support, or other? | One of the options you provide |
| `score` | How much is the customer's use of the service affected? | A rating against ordered levels |

In the request, you pass the model name in `model`, the content to evaluate in `input`, and an array of questions in `questions`. Answers are returned in the `answers` array in the same order as the questions. If you give each question a `name`, you can also identify answers by the returned name. For questions without a `name`, the answer's `name` is `null`. A single request can contain between 1 and 400 questions. For more details, see the [API reference](https://developers.openai.com/api/reference/resources/decisions/methods/create).

## Evaluating Inquiries from TypeScript

Here we'll use Node.js and the OpenAI JavaScript SDK. Create a new directory and install the packages.

```bash
mkdir decisions-demo
cd decisions-demo
npm init -y
npm pkg set type=module
npm install --save-exact openai@7.39.0 tsx@4.21.0
```

Create an [OpenAI API key](https://platform.openai.com/api-keys) and save it to `.env` in this directory. Running the examples incurs API usage charges.

:::info
Regarding pricing, the [official guide](https://developers.openai.com/api/docs/guides/decisions#pricing-and-availability) lists uncached input at $0.10 per 1 million tokens and states that output tokens are not charged. Check the latest pricing before adopting it.
:::

```dotenv:.env
OPENAI_API_KEY=your-api-key
```

### Start by Checking for a Refund Request

Let's use a `predicate` to evaluate whether an inquiry is asking for a refund. In `instructions`, describe what you want the model to decide about the input.

```ts:predicate.ts
import OpenAI from "openai";

const client = new OpenAI({ maxRetries: 0, timeout: 30_000 });
const decision = await client.decisions.create({
  model: "gpt-6-luna",
  input: "今月の利用料が二重に請求されました。重複分を返金してください。",
  questions: [
    {
      type: "predicate",
      name: "refund_requested",
      instructions: "利用者は返金を求めていますか？",
    },
  ],
});

const answer = decision.answers[0];
if (answer?.type === "predicate") {
  console.log(answer.probability);
} else if (answer?.type === "refusal") {
  console.log("回答が拒否されました");
}
```

The input says "I was charged twice for this month's fee. Please refund the duplicate charge." and the instructions ask "Is the customer requesting a refund?". Run it with the following command.

```bash
node --env-file=.env --import tsx predicate.ts
```

Running it printed the following value.

```text
1
```

`probability` is a number between 0 and 1. For this input, the model estimated the probability that the condition "the customer is requesting a refund" is true to be `1`. It's safe to treat this input as a refund request. When you integrate this into a real application, you need to decide from which value to treat an inquiry as a refund request—for example, a rule such as "treat it as a refund request if the probability is 0.7 or higher."

### Checking the Department and Service Impact at the Same Time

Next, in addition to whether a refund was requested, let's check which department should handle the inquiry and how much the customer's use of the service is affected. These two use question types other than `predicate`, which returns the probability that a condition is true.

To pick a department, use `choice`. A `choice` question selects one option from a set you provide. List the options in the `choices` array, specifying the value used in your code as `value` and the criteria for selecting that option as `description`. Here we prepare `billing` for the billing team, `technical` for technical support, and `other` for inquiries that fit neither.

```ts
{
  type: "choice",
  name: "department",
  instructions: "この問い合わせを担当する部署を選んでください。",
  choices: [
    { value: "billing", description: "請求、支払い、返金に関する問い合わせ" },
    { value: "technical", description: "サービスの不具合や操作に関する問い合わせ" },
    { value: "other", description: "どの部署にも当てはまらない問い合わせ" },
  ],
},
```

To rate the impact on service usage, use `score`. A `score` question rates the input against ordered levels. List the levels in the `levels` array from lowest to highest, specifying each level's name as `label` and its criteria as `description`. Here we use three levels—"no impact" (`支障なし`), "partially affected" (`一部に支障`), and "unusable" (`利用できない`)—distinguished by whether features work and whether a workaround exists. You can specify 2 to 10 levels in `levels`, and level indices start at 0 for the first level. The returned score is the probability-weighted average of the level indices, so it can be a decimal between 0 and "number of levels − 1".

```ts
{
  type: "score",
  name: "service_impact",
  instructions: "問い合わせに記載された、サービス利用への支障を評価してください。",
  levels: [
    { label: "支障なし", description: "サービスの機能は通常どおり使える" },
    { label: "一部に支障", description: "一部の機能が使えないが代替手段がある" },
    { label: "利用できない", description: "必要な機能が使えず代替手段もない" },
  ],
},
```

Because these questions can be evaluated independently from the same inquiry, you can send them together in `questions`. The following `index.ts` evaluates whether a refund was requested, the department, and the service impact in a single request.

```ts:index.ts
import OpenAI from "openai";

const client = new OpenAI({ maxRetries: 0, timeout: 30_000 });
const decision = await client.decisions.create({
  model: "gpt-6-luna",
  input:
    "今月の利用料が二重に請求されました。重複分を返金してください。サービス自体は通常どおり使えています。",
  questions: [
    {
      type: "predicate",
      name: "refund_requested",
      instructions: "利用者は返金を求めていますか？",
    },
    {
      type: "choice",
      name: "department",
      instructions: "この問い合わせを担当する部署を選んでください。",
      choices: [
        { value: "billing", description: "請求、支払い、返金に関する問い合わせ" },
        { value: "technical", description: "サービスの不具合や操作に関する問い合わせ" },
        { value: "other", description: "どの部署にも当てはまらない問い合わせ" },
      ],
    },
    {
      type: "score",
      name: "service_impact",
      instructions: "問い合わせに記載された、サービス利用への支障を評価してください。",
      levels: [
        { label: "支障なし", description: "サービスの機能は通常どおり使える" },
        { label: "一部に支障", description: "一部の機能が使えないが代替手段がある" },
        { label: "利用できない", description: "必要な機能が使えず代替手段もない" },
      ],
    },
  ],
});

console.log(JSON.stringify(decision, null, 2));

for (const answer of decision.answers) {
  switch (answer.type) {
    case "refusal":
      console.log(`${answer.name}: 回答が拒否されました`);
      break;
    case "predicate":
      console.log(`${answer.name}: ${answer.probability}`);
      break;
    case "choice":
      console.log(`${answer.name}: ${answer.choice}`);
      break;
    case "score":
      console.log(`${answer.name}: ${answer.score}`);
      break;
  }
}
```

Running it returned answers to all three questions in `answers`. Below is the `answers` array extracted from the response JSON.

```json
[
  {
    "type": "predicate",
    "name": "refund_requested",
    "probability": 1
  },
  {
    "type": "choice",
    "name": "department",
    "choice": "billing",
    "probabilities": [
      { "value": "billing", "probability": 1 },
      { "value": "technical", "probability": 0 },
      { "value": "other", "probability": 0 }
    ],
    "confidence": 1
  },
  {
    "type": "score",
    "name": "service_impact",
    "score": 0.01,
    "probabilities": [
      { "value": 0, "label": "支障なし", "probability": 0.99 },
      { "value": 1, "label": "一部に支障", "probability": 0.01 },
      { "value": 2, "label": "利用できない", "probability": 0 }
    ],
    "confidence": 0.99
  }
]
```

After the JSON, the `for` loop prints one line per answer.

```text
refund_requested: 1
department: billing
service_impact: 0.01
```

The refund request probability was `1`, the department was `billing`, and the service impact score was `0.01`. The `value` in the score's `probabilities` is the level index: here "no impact" is 0, "partially affected" is 1, and "unusable" is 2. The returned probabilities were `0.99` for "no impact," `0.01` for "partially affected," and `0` for "unusable," and their weighted average is `0.01`. In other words, the input was rated as almost entirely "no impact."

In addition to the selected value or score, `choice` and `score` answers include `probabilities` and `confidence`. We'll look at these two in more detail in the next section.

### Examining the Probability Distribution and confidence

`probabilities` is the probability distribution over the options or levels. For `choice`, the `choice` field is the option with the highest probability in this distribution. For `score`, the `score` field is the weighted average calculated from this distribution. The other field, `confidence`, is a value between 0 and 1 that indicates how certain the answer is. The [official guide](https://developers.openai.com/api/docs/guides/decisions) describes `confidence` as a field separate from the probability distribution, but does not disclose how it is calculated.

The previous inquiry was purely about billing, so the probability was concentrated on a single option. Let's send an inquiry that could be read as either a billing issue or a bug, and see how the distribution and `confidence` change. The following `confidence.ts` uses the same `choice` and `score` questions as `index.ts` and changes only the input.

```ts:confidence.ts
import OpenAI from "openai";

const client = new OpenAI({ maxRetries: 0, timeout: 30_000 });
const decision = await client.decisions.create({
  model: "gpt-6-luna",
  input:
    "有料プランに変更してから、ダッシュボードが開けなくなりました。料金は引き落とされています。",
  questions: [
    {
      type: "choice",
      name: "department",
      instructions: "この問い合わせを担当する部署を選んでください。",
      choices: [
        { value: "billing", description: "請求、支払い、返金に関する問い合わせ" },
        { value: "technical", description: "サービスの不具合や操作に関する問い合わせ" },
        { value: "other", description: "どの部署にも当てはまらない問い合わせ" },
      ],
    },
    {
      type: "score",
      name: "service_impact",
      instructions: "問い合わせに記載された、サービス利用への支障を評価してください。",
      levels: [
        { label: "支障なし", description: "サービスの機能は通常どおり使える" },
        { label: "一部に支障", description: "一部の機能が使えないが代替手段がある" },
        { label: "利用できない", description: "必要な機能が使えず代替手段もない" },
      ],
    },
  ],
});

for (const answer of decision.answers) {
  if (answer.type === "choice" || answer.type === "score") {
    const result = answer.type === "choice" ? answer.choice : answer.score;
    console.log(`${answer.name}: ${result} (confidence: ${answer.confidence})`);
    for (const { value, probability } of answer.probabilities) {
      console.log(`  ${value}: ${probability}`);
    }
  } else if (answer.type === "refusal") {
    console.log(`${answer.name}: 回答が拒否されました`);
  }
}
```

The input says "Since switching to the paid plan, I can't open the dashboard. The fee has been charged." Run it with the following command.

```bash
node --env-file=.env --import tsx confidence.ts
```

Running it printed the following values.

```text
department: technical (confidence: 0.69)
  billing: 0.2
  technical: 0.79
  other: 0.01
service_impact: 1.67 (confidence: 0.5)
  0: 0.08
  1: 0.17
  2: 0.75
```

`technical` was chosen as the department, but `billing` still has a probability of `0.2`. `confidence` is `0.69`, lower than the `1` we saw earlier. For service impact, "unusable" has the highest probability at `0.75`, but probabilities of `0.08` and `0.17` remain on the other levels, resulting in a score of `1.67` and a `confidence` of `0.5`.

This result shows that `confidence` is not simply the highest probability. The probability of `technical` is `0.79`, while `confidence` is `0.69`. Looking only at the `choice` result, both inquiries look the same in the sense that a single department was chosen. By also checking `probabilities` and `confidence`, you can identify inquiries where the decision is split, as in this case. For example, you could avoid routing inquiries automatically when `confidence` falls below a certain value and have a staff member review them instead.

### Changing the Next Question Based on an Earlier Answer

In the examples so far, every question in `questions` could be evaluated independently from the same inquiry. However, there are cases where you want to change the next question depending on an earlier answer—for example, checking the type of bug only when the inquiry is routed to technical support.

Each question in the `questions` array is evaluated against the same `input`. Later questions in the array do not receive the answers to earlier ones. So for questions that depend on an earlier answer, split the requests and branch in code after looking at the first answer.

The following `dependent.ts` chooses the department in the first request and, only when it is `technical`, checks the type of bug in a second request.

```ts:dependent.ts
import OpenAI from "openai";

const client = new OpenAI({ maxRetries: 0, timeout: 30_000 });
const input =
  "有料プランに変更してから、ダッシュボードが開けなくなりました。料金は引き落とされています。";

// Decide the department in the first request
const routing = await client.decisions.create({
  model: "gpt-6-luna",
  input,
  questions: [
    {
      type: "choice",
      name: "department",
      instructions: "この問い合わせを担当する部署を選んでください。",
      choices: [
        { value: "billing", description: "請求、支払い、返金に関する問い合わせ" },
        { value: "technical", description: "サービスの不具合や操作に関する問い合わせ" },
        { value: "other", description: "どの部署にも当てはまらない問い合わせ" },
      ],
    },
  ],
});

const department = routing.answers[0];
if (department?.type !== "choice") {
  throw new Error("担当部署を判定できませんでした");
}
console.log(`department: ${department.choice}`);

// Only for technical support, check the type of bug in a second request
if (department.choice === "technical") {
  const detail = await client.decisions.create({
    model: "gpt-6-luna",
    input,
    questions: [
      {
        type: "choice",
        name: "technical_category",
        instructions: "問い合わせに記載された不具合の種類を選んでください。",
        choices: [
          { value: "login", description: "ログインや認証に関する不具合" },
          { value: "page_load", description: "画面が表示されない、読み込みが終わらない不具合" },
          { value: "data", description: "データが消えた、正しく保存されない不具合" },
          { value: "other", description: "どの種類にも当てはまらない不具合" },
        ],
      },
    ],
  });

  const category = detail.answers[0];
  if (category?.type === "choice") {
    console.log(`technical_category: ${category.choice}`);
  } else {
    console.log("technical_category: 回答が拒否されました");
  }
}
```

Run it with the following command.

```bash
node --env-file=.env --import tsx dependent.ts
```

Running it printed the following values.

```text
department: technical
technical_category: page_load
```

Because the first request classified the department as `technical`, the second request was sent, and `page_load` was chosen as the type of bug. If the department is `billing` or `other`, the second request is not sent.

Splitting dependent questions adds latency for each extra request. Put the questions that every department needs into the first request, and defer only the questions that cannot be decided without an earlier answer to later requests.

### Refusals

Any question may return `type: "refusal"` instead of the expected type. Refusals are returned per question, and other questions in the same request may still receive normal answers. We could not reproduce a refusal in our testing, so the following is a hypothetical example based on the SDK's type definitions. If the department question is refused, you might receive answers like this:

```json
{
  "answers": [
    {
      "type": "predicate",
      "name": "refund_requested",
      "probability": 0.98
    },
    {
      "type": "refusal",
      "name": "department"
    }
  ]
}
```

A refused answer does not include `probability` or `choice`. If you read values without checking `type`, you might mistake a refusal for "probability 0" or "no match." Treat refused questions as undecided and handle them separately from normal answers, for example by sending them to a staff member for review.

## Summary

- The Decisions API returns condition checks, classifications, and graded ratings for an input, and currently uses `gpt-6-luna`
- `predicate` returns the probability, as estimated by the model, that a condition is true; `choice` returns one of the options you provide; and `score` returns the probability-weighted average of the level indices
- `choice` and `score` also return `probabilities`, the probability distribution, and `confidence`, which indicates how certain the answer is. `confidence` is not necessarily equal to the highest probability
- Independent questions about the same input can be sent together, but questions that depend on an earlier answer should go in separate requests
- Evaluate thresholds for probabilities and `confidence` against real data, and distinguish a `refusal` from a condition evaluated as false

## References

- [Decisions | OpenAI API](https://developers.openai.com/api/docs/guides/decisions)
- [Create a decision | OpenAI API Reference](https://developers.openai.com/api/reference/resources/decisions/methods/create)
- [Changelog | OpenAI API](https://developers.openai.com/api/docs/changelog)
- [Structured Outputs | OpenAI API](https://developers.openai.com/api/docs/guides/structured-outputs)
- [OpenAI JavaScript SDK](https://github.com/openai/openai-node)
