---
id: WCf0XWHOufxD3ShS_aa2W
title: "OpenAI の Decisions API で問い合わせの分類と段階評価をする"
slug: "openai-decisions-api"
about: "OpenAI の Decisions API は、入力に対する条件判定・分類・段階評価を返す API です。TypeScript から問い合わせを評価する例を使い、predicate・choice・score の使い分けについて紹介します。"
createdAt: "2026-10-25T22:00+09:00"
updatedAt: "2026-10-25T22:00+09:00"
tags: ["OpenAI", "AI"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/5hWgJ38MGXNHDSQspIF2XF/2fa6a459b730a79fe35e10c9cbe3eee0/spaceshuttle_flying_13577-768x591.png"
  title: "スペースシャトルのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "問い合わせが返金を求めているかを predicate で調べた場合、主な返却値はどれですか？"
      answers:
        - text: "返金要求があるかを表す真偽値"
          correct: false
          explanation: "predicate は真偽値ではなく、条件が真であるとモデルが推定した確率を返します。"
        - text: "返金要求があるとモデルが推定した確率"
          correct: true
          explanation: "probability は 0〜1 の数値です。どの値から返金要求として扱うかはアプリケーションが決めます。"
        - text: "実際に返金してよいかを示す許可"
          correct: false
          explanation: "返金要求があることと、返金する資格があることは別の判断です。"
        - text: "返金要求があると判断した理由の文章"
          correct: false
          explanation: "predicate の主な返却値は probability です。説明文の生成には Structured Outputs などを使い分けます。"
    - question: "score の段階番号が 0、1、2 で、確率がそれぞれ 0.2、0.6、0.2 の場合、返るスコアの意味はどれですか？"
      answers:
        - text: "最も確率が高い段階の確率である 0.6"
          correct: false
          explanation: "score は確率そのものではなく、段階番号の確率加重平均です。"
        - text: "最も深刻な段階の番号である 2"
          correct: false
          explanation: "最も深刻な段階を必ず選ぶのではなく、各段階の確率を使って計算します。"
        - text: "確率が 0 ではない段階の数である 3"
          correct: false
          explanation: "段階数を数える値ではありません。段階番号と確率を掛けて足します。"
        - text: "段階番号の確率加重平均である 1.0"
          correct: true
          explanation: "0 × 0.2 + 1 × 0.6 + 2 × 0.2 = 1.0 です。同じ平均でも確率の分布が違う場合があります。"
    - question: "最初に選んだ担当部署に応じて次の質問を変えたい場合、どのように実装しますか？"
      answers:
        - text: "リクエストを分け、先の回答を使ってコードで分岐する"
          correct: true
          explanation: "同じ questions 配列の後ろの質問が、前の質問の回答を受け取る仕組みではありません。"
        - text: "同じ配列で質問を並べれば、前の回答が自動で渡される"
          correct: false
          explanation: "同じ入力から独立して評価できる質問をまとめます。回答に依存する質問はリクエストを分けます。"
        - text: "両方の質問に同じ name を付けて回答を共有する"
          correct: false
          explanation: "name は回答を識別するための名前であり、質問間で結果を受け渡す仕組みではありません。"
        - text: "choice を score に変えて、質問を順番に処理させる"
          correct: false
          explanation: "score は段階評価のための質問形式です。質問間の実行順序や依存関係を指定するものではありません。"
    - question: "回答の type が refusal だった場合、記事ではどう扱いますか？"
      answers:
        - text: "条件が偽だったものとして確率 0 に置き換える"
          correct: false
          explanation: "回答の拒否は、条件が偽だと評価した結果とは異なります。"
        - text: "同じリクエストの回答をすべて拒否として扱う"
          correct: false
          explanation: "拒否は質問単位で返り、別の質問には通常の回答が返る場合もあります。"
        - text: "未判定として、通常の回答と区別する"
          correct: true
          explanation: "type を確認し、回答の拒否を条件判定や分類の結果として読み替えないようにします。"
        - text: "HTTP リクエストそのものが失敗したと判断する"
          correct: false
          explanation: "refusal は正常なレスポンスの中に含まれる場合があり、HTTP エラーとは区別します。"
published: true
---

アプリケーションに LLM を組み込む際に、あらかじめ決まった判断を自動化したい場面があります。例えばサポート窓口に届いた問い合わせを振り分ける際には、返金要求があるかの判定、担当部署の分類、問い合わせ内容の深刻度の段階評価といった処理が必要です。1 つ 1 つの判断は単純であっても、規模が大きくなるにつれてレイテンシやコストが積み重なってしまいます。

OpenAI の [Decisions API](https://developers.openai.com/api/docs/guides/decisions) は、入力に対する条件判定・分類・段階評価を返す API です。Decisions API は回答の範囲が限定された質問を受け取り、低コストかつ高速に回答します。その速度は、Responses API と比べて約 10 倍と OpenAI が公表しています。

この記事では TypeScript から問い合わせを評価する例を使い、3 種類の質問の使い分けと、確率やスコアの読み方を紹介します。

:::info
Decisions API は [10 月 22 日に一般提供へ移行](https://developers.openai.com/api/docs/changelog)しました。現在利用できるモデルは `gpt-6-luna` です。
:::

## Decisions API でできること

Decisions API は `POST /v1/decisions` に判断対象と質問を送り、質問ごとの回答を受け取ります。質問の種類は次の 3 つです。

| 質問の種類 | 問い合わせ処理での例 | 主な返却値 |
| --- | --- | --- |
| `predicate` | 利用者は返金を求めているか | 条件が真であるとモデルが推定した確率 |
| `choice` | 請求担当・技術担当・その他のどれに送るか | 用意した選択肢のうち 1 つ |
| `score` | サービスの利用にどの程度支障があるか | 順序を持つ段階に対する評価値 |

リクエストでは `model` にモデル名、`input` に判断対象、`questions` に質問の配列を渡します。回答は `answers` 配列に質問と同じ順序で返ります。各質問に `name` を付けておくと、返却された名前でも回答を識別できます。`name` を省略した質問の回答では、`name` が `null` になります。1 回のリクエストで送れる質問は 1〜400 個です。より詳しい情報を知りたい場合は [API リファレンス](https://developers.openai.com/api/reference/resources/decisions/methods/create)を参照してください。

## TypeScript から問い合わせを評価する

ここでは Node.js と OpenAI の JavaScript SDK を使います。新しいディレクトリを作り、パッケージをインストールします。

```bash
mkdir decisions-demo
cd decisions-demo
npm init -y
npm pkg set type=module
npm install --save-exact openai@7.39.0 tsx@4.21.0
```

[OpenAI の API キー](https://platform.openai.com/api-keys)を発行し、このディレクトリの `.env` に保存してください。この実行には API 利用料金がかかります。

:::info
料金について、[公式ガイド](https://developers.openai.com/api/docs/guides/decisions#pricing-and-availability)は、キャッシュされていない入力を 100 万トークンあたり 0.10 ドル、出力トークンを課金対象外としています。導入時には最新の料金を確認してください。
:::

```dotenv:.env
OPENAI_API_KEY=発行したキー
```

### まずは返金要求の有無を調べる

`predicate` を使って、問い合わせが返金を求めているかを評価します。`instructions` には、入力に対して何を判断してほしいかを書きます。

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

次のコマンドで実行します。

```bash
node --env-file=.env --import tsx predicate.ts
```

実行すると、次の値が表示されました。

```text
1
```

`probability` は 0〜1 の数値です。今回の入力では、モデルは「返金を求めている」という条件が真である確率を `1` と推定しました。今回の入力は、返金要求として扱ってよいでしょう。実際にアプリケーションに組み込む場合は、どの値から返金要求として扱うかを決める必要があります。例えば 0.7 以上なら返金要求ありとする、といったルールです。

### 担当部署とサービスへの支障も一緒に調べる

続いて、返金要求の有無に加えて、担当部署とサービス利用への支障も調べてみましょう。この 2 つには、条件が真である確率を返す `predicate` とは別の質問タイプを使います。

担当部署を選ぶには `choice` を使います。`choice` は、あらかじめ用意した候補から 1 つを選ぶ質問タイプです。`choices` 配列に候補を並べ、コードで使う値を `value`、その候補を選ぶ基準を `description` に指定します。今回は請求担当の `billing`、技術担当の `technical`、どちらにも当てはまらない場合の `other` を用意します。

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

サービス利用への支障を評価するには `score` を使います。`score` は、順序を持つ段階に沿って入力を評価する質問タイプです。`levels` 配列に低い段階から高い段階へ基準を並べ、各段階の名前を `label`、判断基準を `description` に指定します。今回は「支障なし」「一部に支障」「利用できない」の 3 段階とし、機能が使えるか、代替手段があるかで区別します。`levels` には 2〜10 個の段階を指定でき、段階番号は先頭の段階を 0 として数えます。返されるスコアは段階番号の確率加重平均で、0 から「段階数 − 1」までの小数になる場合があります。

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

これらは同じ問い合わせから独立して評価できるため、`questions` にまとめて送れます。次の `index.ts` は、返金要求の有無、担当部署、サービス利用への支障を 1 回のリクエストで評価する例です。

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

実行すると、`answers` に 3 つの質問への回答が返りました。以下はレスポンスの JSON から `answers` 配列を抜き出したものです。

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

JSON の後には、`for` 文で回答を 1 行ずつ表示した結果が続きます。

```text
refund_requested: 1
department: billing
service_impact: 0.01
```

返金要求の確率は `1`、担当部署は `billing`、サービス利用への支障のスコアは `0.01` でした。`score` の `probabilities` の `value` が段階番号で、今回は「支障なし」が 0、「一部に支障」が 1、「利用できない」が 2 です。返された確率は「支障なし」が `0.99`、「一部に支障」が `0.01`、「利用できない」が `0` で、その加重平均が `0.01` になっています。つまり、この入力はほぼ「支障なし」と評価されました。

`choice` と `score` の回答には、選んだ値やスコアに加えて `probabilities` と `confidence` も含まれています。この 2 つは次の節で詳しく見ていきます。

### 確率の分布と confidence を確認する

`probabilities` は、選択肢や段階ごとの確率の分布です。`choice` の `choice` は、この分布で最も確率が高い候補です。`score` の `score` は、この分布から計算した加重平均です。もう 1 つの `confidence` は、回答がどの程度確かかを表す 0〜1 の値です。[公式ガイド](https://developers.openai.com/api/docs/guides/decisions)は `confidence` を確率の分布とは別のフィールドとして説明していますが、具体的な計算方法は公開していません。

先ほどの問い合わせは請求に関する内容だけだったため、確率が 1 つの候補に集中していました。そこで、請求と不具合のどちらとも読める問い合わせを送り、分布と `confidence` がどう変わるかを試してみましょう。次の `confidence.ts` は、`index.ts` と同じ `choice` と `score` の質問を使い、入力だけを変えた例です。

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

次のコマンドで実行します。

```bash
node --env-file=.env --import tsx confidence.ts
```

実行すると、次の値が表示されました。

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

担当部署は `technical` が選ばれましたが、`billing` にも `0.2` の確率が残っています。`confidence` も `0.69` で、先ほどの `1` より低くなりました。サービス利用への支障は「利用できない」の確率が `0.75` で最も高い一方、`0.08` と `0.17` の確率が残っており、スコアは `1.67`、`confidence` は `0.5` でした。

この結果から、`confidence` は最も高い確率をそのまま返した値ではないことがわかります。`technical` の確率は `0.79` ですが、`confidence` は `0.69` です。`choice` の結果だけを見ると、どちらの問い合わせも「1 つの部署を選んだ」という点では同じです。`probabilities` と `confidence` も確認すれば、今回のように判断が分かれる問い合わせを見分けられます。例えば `confidence` が一定の値を下回る問い合わせは自動で振り分けず、担当者が確認する、といった使い方ができます。

### 前の回答によって次の質問を変える

ここまでの例では、`questions` に並べた質問はどれも同じ問い合わせから独立して評価できるものでした。一方で、担当部署が技術担当に決まった場合だけ不具合の種類を調べたい、というように、前の回答によって次の質問を変えたい場面もあります。

`questions` 配列の質問は、それぞれ同じ `input` に対して評価されます。配列の後ろの質問が前の質問の回答を受け取るわけではありません。そのため、前の回答に依存する質問はリクエストを分け、1 回目の回答を見てからコードで分岐します。

次の `dependent.ts` は、1 回目のリクエストで担当部署を選び、`technical` の場合だけ 2 回目のリクエストで不具合の種類を調べる例です。

```ts:dependent.ts
import OpenAI from "openai";

const client = new OpenAI({ maxRetries: 0, timeout: 30_000 });
const input =
  "有料プランに変更してから、ダッシュボードが開けなくなりました。料金は引き落とされています。";

// 1 回目のリクエストで担当部署を決める
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

// 技術担当の場合だけ、2 回目のリクエストで不具合の種類を調べる
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

次のコマンドで実行します。

```bash
node --env-file=.env --import tsx dependent.ts
```

実行すると、次の値が表示されました。

```text
department: technical
technical_category: page_load
```

1 回目のリクエストで担当部署が `technical` と判定されたため、2 回目のリクエストが送られ、不具合の種類として `page_load` が選ばれました。担当部署が `billing` や `other` の場合は、2 回目のリクエストは送られません。

依存する質問を分けると、リクエストの回数が増える分だけレイテンシも増えます。どの部署でも必要な質問は 1 回目のリクエストにまとめ、前の回答がないと決められない質問だけを後のリクエストに回しましょう。

### 回答の拒否

どの質問も、期待する型の代わりに `type: "refusal"` を返す場合があります。拒否は質問単位で返り、同じリクエストの別の質問には通常の回答が返る場合もあります。今回の検証では拒否を再現できなかったため、以下は SDK の型定義をもとにした仮の例です。担当部署の質問が拒否された場合には、例えば次のような回答が返ります。

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

拒否された回答には `probability` や `choice` が含まれません。そのため、`type` を確認せずに値を読むと、拒否を「確率 0」や「該当なし」と取り違えてしまいます。拒否された質問は未判定として扱い、担当者の確認に回すなど、通常の回答とは別の処理にしましょう。

## まとめ

- Decisions API は、入力に対する条件判定・分類・段階評価を返す API で、現在は `gpt-6-luna` を使用する
- `predicate` は条件が真であるとモデルが推定した確率、`choice` は用意した選択肢、`score` は段階番号の確率加重平均を返す
- `choice` と `score` は確率の分布である `probabilities` と、回答の確かさを表す `confidence` も返す。`confidence` は最も高い確率と同じ値とは限らない
- 同じ入力に対する独立した質問はまとめて送れるが、先の回答に依存する質問はリクエストを分ける
- 確率や `confidence` のしきい値は実際のデータで評価し、`refusal` は条件が偽だった場合と区別する

## 参考

- [Decisions | OpenAI API](https://developers.openai.com/api/docs/guides/decisions)
- [Create a decision | OpenAI API Reference](https://developers.openai.com/api/reference/resources/decisions/methods/create)
- [Changelog | OpenAI API](https://developers.openai.com/api/docs/changelog)
- [Structured Outputs | OpenAI API](https://developers.openai.com/api/docs/guides/structured-outputs)
- [OpenAI JavaScript SDK](https://github.com/openai/openai-node)
