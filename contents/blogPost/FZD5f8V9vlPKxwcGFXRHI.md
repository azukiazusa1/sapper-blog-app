---
id: FZD5f8V9vlPKxwcGFXRHI
title: "TypeSafe AI の Jev を TypeScript で試してみた"
slug: "jev-support-routing"
about: "Jev は入力された状態に対して、選択肢の判定や段階評価、真である確率を返すモデルです。この記事では TypeScript で問い合わせを評価し、実際の出力をもとに担当部署や人の確認へ振り分ける処理を紹介します。"
createdAt: "2026-09-19T10:17+09:00"
updatedAt: "2026-09-19T10:17+09:00"
tags: ["AI", "TypeScript", "Jev"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/6IFwwMv5OWP97a1KHCoetH/3edb786ffe156aff5befc0ba9b1513d9/food_chuuka-chimaki_9876-768x640.png"
  title: "ちまきのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Jev の Choice の回答に含まれる `confidence` は何を表しますか？"
      answers:
        - text: "候補に対する確率分布が 1 つの候補にどれだけ集中しているか"
          correct: true
          explanation: "confidence は probabilities の分布の形から計算される 0〜1 の指標です。1 つの候補に集中しているほど高くなります。"
        - text: "選ばれた候補が正解である保証の度合い"
          correct: false
          explanation: "confidence が高くても判断が正しいとは限りません。確率分布の集中度を表す指標です。"
        - text: "各候補の確率を合計した値"
          correct: false
          explanation: "probabilities の合計は常に 1 です。confidence は分布の集中度を表します。"
        - text: "モデルが回答を生成するまでにかかった時間"
          correct: false
          explanation: "confidence は処理時間とは関係ありません。"
    - question: "Noul の質問に対する回答として正しいものはどれですか？"
      answers:
        - text: "`true` または `false` の真偽値と、その確信度"
          correct: false
          explanation: "Noul は真偽値を返しません。また、別の confidence フィールドもありません。"
        - text: "「はい」である確率を表す 0〜1 の数値"
          correct: true
          explanation: "Noul は「はい／いいえ」で答えられる質問に対して、「はい」である確率を返します。0.5 付近は判断が分かれていることを表します。"
        - text: "順序のある段階に沿ったスコア"
          correct: false
          explanation: "段階に沿った評価には Score を使います。"
        - text: "候補ごとの確率分布"
          correct: false
          explanation: "候補ごとの確率分布を返すのは Choice です。"
published: true
---

大規模言語モデル（LLM）は人間が読むためのテキストを生成するように設計されています。日常的なチャットや文書生成、要約といった用途には適していますが、ソフトウェアの条件分岐に使うには、決定的な結果を返すことの難しさから、アプリケーションの制御に組み込みにくいという課題があります。一般的な解法として、LLM に構造化された判断を返させるためのプロンプト設計や、生成結果を解析して条件分岐に使える形に変換する方法が使われてきました。

[TypeSafe AI](https://typesafe.ai/) 社が提供する [Jev](https://docs.typesafe.ai/introduction) は、入力された状態に対して型の決まった質問を評価するモデルです。TypeSafe はこの種類のモデルを System One と呼んでいます。System One はソフトウェアが直接利用できる、高速で構造化された意思決定を行うように設計されています。

:::info
System One はダニエル・カーネマンの著書『ファスト＆スロー』で紹介される「システム 1」に由来します。システム 1 は直感的で素早い判断を行う脳の働きで、システム 2 はより慎重で論理的な判断を行う働きです。Jev はシステム 1 のように、文章の意味を踏まえた直感的な判断を返すモデルとして設計されています。
:::

例えば顧客からの問い合わせがあり、次のような文章が送られてきたとします。この文章から、担当部署と緊急性を判断する必要があります。（実際には後述する `state` に入れて Jev に渡しますが、ここでは簡略化して文章だけを示します）。

```text
今月の利用料金が二重に引き落とされています。困っているので、本日中に確認して返金してください。
```

この問い合わせ文を Jev に入力すると、次のような JSON 形式の結果が返ってきます。

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

`department.choice` には請求担当を表す `billing` が返されています。`confidence` は候補に対する確率分布が 1 つの候補にどれだけ集中しているかを表す値で、`1` はモデルが候補を `billing` の 1 つに絞り込んでいることを示します。緊急性を表す `isUrgent.noul` は `0.97` となっています。`noul` は「はい／いいえ」で答えられる質問に対して、「はい」である確率を返す質問の種類です。`0.97` という高い値が出ているので、緊急性があると強く評価されていることがわかります。

この結果を元に、請求担当の優先対応へ振り分けるという処理をコードで組み立てられます。

この記事では Jev を実際に TypeScript で呼び出し、問い合わせの振り分けを行う処理を実装してみます。

## 3 種類の質問

はじめに Jev の基本的な概念について確認しておきましょう。Jev では、次の 3 種類の質問を使い分けます。

- [Choice](https://docs.typesafe.ai/primitives/choice): 選択された候補、候補ごとの確率、確信度
- [Noul](https://docs.typesafe.ai/primitives/noul): 真である確率を表す 0〜1 の数値
- [Score](https://docs.typesafe.ai/primitives/score): 段階に沿ったスコア、段階ごとの確率、確信度

Choice は、順序のない候補から 1 つを選びます。例えば「担当部署は請求、技術、営業、その他のどれか？」という質問に対して、請求担当を選ぶと `billing` が返るという具合です。回答には `confidence` と `probabilities` が含まれます。`confidence` は、確率が特定の候補にどれだけ集中しているかを表す指標です。`0 0 0 1` のように 1 つの候補に確率が集中した分布であれば文句のつけようがなく `1` となるわけです。`probabilities` は各候補に対する確率分布で、合計は 1 になります。

Noul が返す値は `true` や `false` ではなく、真である確率です。例えば「この問い合わせには、急いで対応してほしいという明示的な要求や期限がありますか？」という質問に対して、`0.97` なら緊急性があると強く評価している、`0.5` 付近なら判断が分かれている、と読み取ります。Noul には別の `confidence` フィールドはありません。

Score は順序のある段階に沿った評価に使います。例えば「問い合わせを書いた顧客はどの程度の不満を表していますか？」という質問に対して、0 は「落ち着いている」、1 は「不満はあるが丁寧」、2 は「強い怒りや非難がある」といったように段階付けします。スコアは各段階の番号を確率で重み付けした平均なので、小数になることもあります。回答には `score` のほか、段階ごとの確率を表す `probabilities`、確信度を表す `confidence`、段階の番号と説明の対応を表す `legend` が含まれます。

## コンテキストを与える State

[State](https://docs.typesafe.ai/concepts/state) は、Jev が判断する対象と、その判断に必要な背景情報をまとめたものです。今回のような問い合わせの振り分けでは、問い合わせ文のほか、会話履歴や注文情報、アプリケーションの現在の状態なども判断材料になります。

`state` には文字列、JSON オブジェクト、配列を指定できます。文章だけを評価するなら文字列で十分です。複数の情報を渡す場合は、`ticket` や `order` のように名前を付けたオブジェクトにすると、それぞれが何を表すかを明確にできます。例えば返金について判断する場合、問い合わせ文に加えて注文情報や返金ポリシーを同じ `state` に含めると、それらを照合するためのコンテキストを与えられます。

具体例として、冒頭の実行結果を得るために送信したリクエストボディを示します。`state.ticket` に問い合わせ文を入れ、`questions` に担当部署・緊急性・不満の程度を評価する 3 つの質問を定義しています。

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

## TypeScript で問い合わせを評価する

ここからは [公式 JavaScript SDK](https://docs.typesafe.ai/sdk/javascript) を使って実装します。Node.js の実行環境を用意し、空のプロジェクトで以下のコマンドを実行してください。

```bash
npm init -y
npm pkg set type=module
npm install --save-exact @typesafe-ai/sdk@0.6.0
npm install --save-dev --save-exact typescript@7.0.2 tsx@4.23.13 @types/node@22.20.4
```

[TypeSafe のダッシュボード](https://console.typesafe.ai/keys)で取得した API キーを `.env` ファイルに保存します。

```dotenv:.env
TYPESAFE_API_KEY=your_api_key
```

:::warning
Jev の API は入力トークン数などに応じた従量課金です。[TypeSafe の公式サイト](https://typesafe.ai/) では「$42 per billion input tokens」と説明されています。利用状況は [TypeSafe のコンソール](https://console.typesafe.ai/usage)で確認できます。今回試したコード例では $0.0002 でした。
:::

### 担当部署・緊急性・不満の程度を尋ねる

`src/triage.ts` を作成し、評価する質問と API クライアントを定義します。API キーは環境変数 `TYPESAFE_API_KEY` から読み込まれます。

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

`TypeSafeClient` は Jev の API を呼び出すためのクライアントです。コンストラクタには次のようなオプションを渡せます。

- `apiKey`: API キー。省略すると環境変数 `TYPESAFE_API_KEY` の値が使われる
- `baseURL`: API のエンドポイント。既定値は `https://api.typesafe.ai`（環境変数 `TYPESAFE_BASE_URL` があればそちらが優先される）
- `logLevel`: SDK が出力するログのレベル。既定値は `warn`。ここではコンソールに実行結果だけを表示するため `off` を指定している
- `retry`: リトライの設定。既定では 408、429、500〜599 のステータスコードに対して最大 2 回リトライする。ここでは検証中に意図せず API を繰り返し呼び出さないよう、`maxRetries: 0` でリトライを無効にしている。本番環境では一時的な障害に備えてリトライを有効にしておくとよい
- `timeout`: 1 回のリクエストのタイムアウト（ミリ秒）。既定値は `10000`

その他のオプションは [TypeSafeClientConfig](https://docs.typesafe.ai/sdk/javascript/api/interfaces/TypeSafeClientConfig) を参照してください。

`questions` オブジェクトで質問を定義しています。`choice()`、`noul()`、`score()` はそれぞれ質問の種類を定義する関数です。

`choice()` の第 2 引数は、候補名とその説明の対応です。SDK はこの定義から回答の型を推論するため、`response.answers.department.choice` は `"billing" | "technical" | "sales" | "other"` として扱えます。

`score()` の第 2 引数は、低い段階から高い段階へ並べた配列です。配列のインデックスがスコアの段階に対応するため、今回の値域は 0〜2 になります。

実際に問い合わせを評価するには、`evaluateTicket()` に問い合わせ文を渡します。関数内では `client.systemOne()` を呼び出し、`state` に問い合わせ文を含め、`questions` で定義した質問を渡します。回答の型は `questions` の定義から推論されます。

### 回答をコードから呼び出す

続いて `evaluateTicket` をコードから呼び出してみましょう。ここでは Jev を呼び出した結果を使用して、`queue` にどの部署で対応するか、`priority` に優先度を返します。

```ts:src/triage.ts
type Answers = Awaited<ReturnType<typeof evaluateTicket>>["answers"];

export function decideRoute(answers: Answers) {
  const { department, isUrgent, frustration } = answers;
  // confidence が低い、または other の場合は人の確認に回す
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

最初に、担当部署が `other` であるか、部署の確信度が `0.8` 未満なら人の確認に回すように `queue: "manual_review"` にして返却します。次に緊急性の確率や不満のスコアを確認し、優先度を `high` にするか `needs_review` にするかを判断しています。

### コードを実行する

エントリーポイントである `src/run.ts` を作成し、問い合わせの評価結果と振り分け先を表示します。

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

以下のコマンドで `.env` を読み込み、TypeScript のコードを実行します。

```bash
node --env-file=.env --import tsx src/run.ts
```

冒頭の API レスポンスに続いて、振り分け結果が表示されます。

```json
{"queue":"billing","priority":"high"}
```

担当部署は `billing`、優先度は `high` となりました。問い合わせ文の内容から、請求担当の優先対応へ振り分けることができます。

その他いくつか問い合わせ文を変更して試してみました。結果は以下の表のとおりです。

| 問い合わせ | 選択された部署 | 部署の確信度 | 緊急性の確率 | 不満のスコア | 振り分け先 / 優先度 |
| --- | --- | --- | --- | --- | --- |
| 二重請求。本日中に確認・返金してほしい | `billing` | 1 | 0.97 | 1 | `billing` / `high` |
| ログイン時に 500 エラー。急ぎではない | `technical` | 1 | 0.04 | 0.05 | `technical` / `normal` |
| 有料プランの機能が使えず、請求か不具合かわからない | `technical` | 0.57 | 0.08 | 0.99 | `manual_review` / `needs_review` |
| 先日の件について確認したい | `other` | 1 | 0.06 | 0 | `manual_review` / `needs_review` |

## まとめ

- Jev は状態と型の決まった質問を入力し、候補の選択、段階評価、真である確率を返すモデル
- Choice と Score の `confidence` は確率分布の集中度を表し、しきい値として使うことで判断が難しい入力を人の確認に回せる
- Choice、Noul、Score の 3 種類の質問を使い分けることで、問い合わせの担当部署や緊急性、不満の程度を評価できる
- TypeScript で Jev を呼び出し、回答の確信度やスコアをもとに振り分け先や優先度を決定する例を紹介した

## 参考

- [Introducing System One Models & Jev - TypeSafe AI](https://typesafe.ai/blog/introducing-system-one-models-and-jev)
- [Introduction - TypeSafe AI](https://docs.typesafe.ai/introduction)
- [Example use cases - TypeSafe AI](https://docs.typesafe.ai/concepts/use-case-map)
- [Choice - TypeSafe AI](https://docs.typesafe.ai/primitives/choice)
- [Noul - TypeSafe AI](https://docs.typesafe.ai/primitives/noul)
- [Score - TypeSafe AI](https://docs.typesafe.ai/primitives/score)
- [Confidence - TypeSafe AI](https://docs.typesafe.ai/confidence)
- [JavaScript SDK - TypeSafe AI](https://docs.typesafe.ai/sdk/javascript)
- [typesafe-ai/typesafe-sdk-js](https://github.com/typesafe-ai/typesafe-sdk-js)
