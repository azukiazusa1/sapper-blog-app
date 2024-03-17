---
id: wPdgYm5bu6Y751Ud0fNMD
title: "ChatGPT3 で出力の形式を固定したい場合には例を提示してあげるとよさそう"
slug: "it-may-be-helpful-to-provide-an-example-when-you-want-to-fix-the-output-format-in-chatgpt3"
about: "ChatGPT は毎回異なる出力を返すことがあるため、APIやアプリ開発にとって不都合が生じる。そこで、出力の例を提示することで固定した形式の回答を得やすくすることができる。提示するためのプロンプトは区切り文字を使用して区切ることが推奨され、回答は通常、「例」に基づいた形式で得られる。"
createdAt: "2023-03-19T13:13+09:00"
updatedAt: "2023-03-19T13:13+09:00"
tags: ["ChatGPT"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1BQhtWPxcrcgJ8yXSaSX6s/2db2b19fd059a3fc0618e70174d4d8ac/_Pngtree_vector_map_and_treasure_chest_946585.png"
  title: "—Pngtree—vector map and treasure chest_946585.png"
selfAssessment: null
published: true
---
## TL;DR

ChatGPT で出力の形式を固定したい場合には、出力の例を提示すると決まった形式で回答を得やすい。

![inputを英訳してからスラッグに変換してください。例input:こんにちは、世界output:hello-worldinput:TypeScript で網羅性をチェックするoutput:typescript-check-code-coverage](https://images.ctfassets.net/in6v9lxmm5c8/1zJHs4hawyoNOMKh0m7WxB/e7b779c94bdef94b089574bb3dfeebfb/__________2023-03-19_13.52.31.png)

## ChatGPT の出力は都度異なる

ChatGPT は与えられたテキストの指示に対して自然言語を生成するのが特徴です。同じ入力を行ったとしても、出力の形式は毎回異なります。ChatGPT になぜ同じ入力に対して異なる回答をするのか尋ねると、以下のような回答が返ってきました。

> ChatGPTは自然言語処理のためのニューラルネットワークモデルであり、ランダムな初期化を行うため、同じ入力に対してもランダムな初期値から学習を開始し、学習プロセス中に用いられる確率的勾配降下法（Stochastic Gradient Descent、SGD）やドロップアウト（Dropout）などの手法によっても、学習が進むにつれて異なる結果が得られるため、同じ入力に対して異なる回答が返ってくることがあります。また、ChatGPTの応答は、入力されたテキストの前後の文脈やニュアンス、生成されたトークンの順序やランダム性などによっても異なる可能性があります。

例として、与えられたテキストからスラッグを生成するように ChatGPT に指示を出してみましょう。与えられるテキストは日本語であることが想定されるので、一度英訳してもらってからスラッグを生成するように指示を出します。

```text
input を英訳してからスラッグに変換してください。

input:TypeScript で網羅性をチェックする
output:
```

このプロンプトに対する ChatGPT の回答は以下のようにいくつかのパターンが存在します。

![Convert input to English and then to a slug. input:Check for completeness with TypeScript Output:Check-for-comp](https://images.ctfassets.net/in6v9lxmm5c8/72PslQKObe8Hkaj7PWiaPu/1938d5d986a15754231ae2cdc010bd3c/__________2023-03-19_13.01.43.png)

![convert input to English: Check for comprehensiveness with TypeScript convert to slug: check-for-comprehensiveness-with-typescript](https://images.ctfassets.net/in6v9lxmm5c8/5UtO5DMCUGnKTqMYnLhD7N/d80519456ee249c66156d4f01af9f405/__________2023-03-19_13.39.50.png)

![typescript-to-check-code-coverage](https://images.ctfassets.net/in6v9lxmm5c8/6F0yJcbh3PbihPAbz54Y0l/674623d38d5a29d2328ff63c63132912/__________2023-03-19_13.00.30.png)

回答の形式は以下の 3 つのパターンが観測できました。

1. 入力を復唱し、入力値と出力どちらも回答する
2. 入力を英訳した結果を出力した後、スラッグに変換した結果を出力する
3. スラッグに変換した結果のみを出力する

人間の目によって回答を処理する場合には、このような形式の違いは気にしなくても良いかもしれません。しかし、ChatGPT の API を用いてアプリ開発を行うといった用途など、プログラムで処理する場合にはこのような形式の違いが生じるのは不都合があるでしょう。

おそらくプログラムで処理する時にほしい結果は 3 の形式であると思います。得られた結果を次のタスクに渡しやすいからです。出力に回答結果以外が含まれてる場合、正規表現などで結果を抽出するといった後処理が必要となるでしょう。この後処理も、毎回決まった形式で返却しれくれない場合は困難を極めます。

## 出力の例を提示する

ChatGPT で出力の形式を固定したい場合には、出力の例を提示すると決まった形式で回答を得られやすいです。プロンプトは以下のようになります。

```text
inputを英訳してからスラッグに変換してください。

例"""
input:こんにちは、世界
output:hello-world
"""

input:TypeScript で網羅性をチェックする
output:
```

プロンプト中の「例」の後に `"""` を使用しているのは、出力例の始まりと終わりを明確にするためです。

GPT-3 は `"""`,`<>`,`{}`,`##` のような記号を区切り記号として認識できます。文章のある部分が終わり、次の部分を始めることを明確にするために、何らかの区切り記号を使用することが推奨されています。

> The triple quotation marks `"""` used in these example prompts aren't special; GPT-3 can recognize most delimiters, including `<>`, `{}`, or `###`. For long pieces of text, we recommend using some kind of delimiter to help disambiguate where one section of text ends and the next begins.

https://github.com/openai/openai-cookbook/blob/main/text_explanation_examples.md#summarization

このプロンプトを使用して ChatGPT に何度か回答を求めました。その結果、高い確率で以下のような形式で回答を得られることが確認できました。

![typescript-check-code-coverage](https://images.ctfassets.net/in6v9lxmm5c8/1zJHs4hawyoNOMKh0m7WxB/e7b779c94bdef94b089574bb3dfeebfb/__________2023-03-19_13.52.31.png)

x> ある程度の形式のブレは生じます。例えば、回答の前に空行が含まれるなどが確認できました。

例として、TypeScript で API を利用する例は以下のようになります。

```typescript
const configuration = new Configuration({
  apiKey: process.env.API_KEY,
})
const openai = new OpenAIApi(configuration)

export async function getSlug(text: string): Promise<string> {
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: `inputを英訳してからスラッグに変換してください。

例"""
input:こんにちは、世界
output:hello-world
"""

input:${text}
output:
`,
      },
    ],
  })
  const slug = completion.data.choices[0]?.message?.content || ''
  return slug
}
```
