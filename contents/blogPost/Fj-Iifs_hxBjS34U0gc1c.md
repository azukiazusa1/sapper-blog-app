---
id: Fj-Iifs_hxBjS34U0gc1c
title: "LLM へのプロンプトを構造化された文書で管理する POML"
slug: "poml-prompt-structured-document"
about: "POML (Prompt Orchestration Markup Language) は、Microsoft によって提案されたプロンプトを構造化された文書として管理するためのマークアップ言語です。プロンプト開発における構造の欠如や複雑なデータとの統合の困難さ、特定のフォーマットへの依存性といった課題を解決することを目指しています。"
createdAt: "2025-08-16T11:31+09:00"
updatedAt: "2025-08-16T11:31+09:00"
tags: ["AI", "POML"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/7zZnTLHCrt2GKbwIsyX78V/6a45182beabccbf22ce590339ab0e6ce/coconut_22446-200x164.png"
  title: "ココナッツのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "POML ドキュメントのルート要素は何ですか？"
      answers:
        - text: "<poml>"
          correct: true
          explanation: "POML ドキュメントは必ず <poml> タグで始まり、HTML と同様のタグベースの構文を使用します。"
        - text: "<prompt>"
          correct: false
          explanation: null
        - text: "<xml>"
          correct: false
          explanation: null
        - text: "<doc>"
          correct: false
          explanation: null
    - question: "POML でループを定義する際に使用する属性は何ですか？"
      answers:
        - text: "for"
          correct: true
          explanation: "POML では for 属性を使用してループを定義できます。例：for=\"item in items\" の形式で記述します。"
        - text: "loop"
          correct: false
          explanation: null
        - text: "each"
          correct: false
          explanation: null
        - text: "repeat"
          correct: false
          explanation: null
    - question: "POML で変数を定義するために使用するタグは何ですか？"
      answers:
        - text: "<let>"
          correct: true
          explanation: "<let> タグを使用して変数を定義します。name 属性が変数名、value 属性が変数の値を指定し、定義された変数は {{}} 内で JavaScript の式として使用できます。"
        - text: "<var>"
          correct: false
          explanation: null
        - text: "<define>"
          correct: false
          explanation: null
        - text: "<set>"
          correct: false
          explanation: null

published: true
---

高度な AI エージェントを開発する際、システムプロンプトの設計は最も重要な要素の 1 つです。システムプロンプトは AI エージェントが果たす役割や、どのようなツールを使用するか、ユーザーと効率的に会話するための工夫が含まれます。このシステムプロンプトの設計が AI エージェントの性能に大きな影響を与えます。例えばコーディングエージェントである [Cline](https://cline.ai/) のシステムプロンプトを覗いてみると、800 行ものの長大なプロンプトが定義されていることがわかります。

https://github.com/cline/cline/blob/8fbccff8538cde243ceb08d644a15dbf2256b544/src/core/prompts/system-prompt/generic-system-prompt.ts#L8

さて、このような長大なシステムプロンプトをどのように管理すればよいでしょうか？始めはプレーンテキストで管理することもできますが、モジュールに分割できず 1 つのファイルが大きくなりすぎたり、変更差分が分かりづらくなってしまい、メンテナンス性が低下するという問題があります。また、変数やループ、条件分岐などの構造化されたデータを表現することが難しく、プロンプトの再利用性も低くなります。従来はこのような問題を解決するために、JSON や YAML などの構造化されたデータ形式を使用したり、プログラミング言語のテンプレートエンジンを使用してプロンプトを生成する方法がありました。

システムプロンプトの管理のための新しいアプローチとして、Microsoft が提案した [POML (Prompt Orchestration Markup Language)](https://github.com/microsoft/poml) があります。POML は、プロンプトを構造化された文書として管理するためのマークアップ言語であり、プロンプト開発における以下のような課題を解決することを目指しています。

- 構造の欠如
- 複雑なデータ（画像・スプレッドシート・JSON など）との統合の困難さ
- 特定のフォーマットへの依存性

POML で定義されたプロンプトは [VS Code 拡張機能](https://marketplace.visualstudio.com/items?itemName=poml-team.poml) や TypeScript, Python などのプログラミング言語で利用できる SDK を通じて、LLM へ渡すプレーンテキストへ変換されます。

この記事では POML の基本的な使い方を紹介します。

## POML の基本構文

はじめにシンプルな POML の例から見ていきましょう。`.poml` という拡張子でファイルを保存します。

```poml:cat.poml
<poml>
  <role>あなたは野生で生息する猫です。時折人間の家に迷い込みます。</role>
  <task>人間に対して愛らしい行動をとってください。</task>

  <img src="./images.cat.jpg" alt="猫の画像" />

  <output-format>
    常に可愛らしい鳴き声で返答してください。
  </output-format>

  <example>
    <input speaker="human">こんにちは、どこから来たの？</input>
    <output speaker="ai">ニャー!</output>
  </example>
</poml>
```

POML ドキュメントは `<poml>` タグで始まり HTML と同様のタグベースの構文を使用します。POML の要素は `<role>`, `<task>`, `<output-format>`, `<example>` などのセマンティックなコンポーネントで構成されます。それぞれのコンポーネントには属性を持たせることができ、例えば `<input>` や `<output>` 要素には `speaker` 属性を指定して発話者を明示できます。

`<img>`, `<table>` といった特殊な要素を使用して、画像や表などの複雑なデータを統合することもできます。利用可能なすべての要素は以下のドキュメントを参照してください。

https://microsoft.github.io/poml/latest/language/components/

### POML の変換プロセス

POML ファイルがどのように変換され LLM に渡されるか確認するために、[VS Code 拡張機能](https://marketplace.visualstudio.com/items?itemName=poml-team.poml) を利用できます。拡張機能をインストールした後、コマンドパレットから「POML: Open POML Preview」を選択すると、プレーンテキストのプレビューが表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5hipW0pPFiGmkGuSlnQYF6/c3838b15efc7befbc3130e58c2849149/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-16_12.58.22.png)

「Copy」ボタンをクリックすると JSON 形式で変換されたプロンプトをクリップボードにコピーできます。

```json
[
  {
    "speaker": "system",
    "content": "# Role\n\nあなたは野生で生息する猫です。時折人間の家に迷い込みます。\n\n# Task\n\n人間に対して愛らしい行動をとってください。\n\n猫の画像\n\n# Output Format\n\n常に可愛らしい鳴き声で返答してください。"
  },
  {
    "speaker": "human",
    "content": "こんにちは、どこから来たの？"
  },
  {
    "speaker": "ai",
    "content": "ニャー!"
  }
]
```

POML 拡張機能の設定で OpenAI や Anthropic, Gemini などの LLM プロバイダーの API キーを設定することで、POML ドキュメントを直接 LLM に送信して応答を得ることもできます。`.vscode/settings.json` に以下の設定を追加します。

```json:.vscode/settings.json
{
  "poml.languageModel.provider": "openai",
  "poml.languageModel.model": "gpt-4o",
  "poml.languageModel.apiKey": "sk-your-api-key-here",
  "poml.languageModel.apiUrl": "https://api.openai.com/v1/",
}
```

コマンドパレットから「POML: Test current prompt on Chat Models」を選択してプロンプトをテストできます。VS Code のパネルエリアに LLM の応答が表示されます。

```txt
2025-08-16 13:10:02.094 [info] Testing prompt with chat model: /Users/xxx/sandbox/poml-example/src/cat.poml
2025-08-16 13:10:03.099 [info] Test in progress. 1 seconds elapsed.
ニャーオ!
2025-08-16 13:10:03.940 [info] Test completed in 2 seconds. Language models can make mistakes. Check important info.
```

## POML のテンプレートエンジン

POML のテンプレートエンジンを使用することで変数を定義してプロンプトを動的に生成したり、条件分岐やループといった制御構文を使用して複雑なプロンプトを生成できます。

### 変数の定義と使用

変数を定義するには `<let>` タグを使用します。`name` 属性が変数名、`value` 属性が変数の値を指定します。定義された変数は `{{}}` 内で JavaScript の式として使用できます。以下の例では変数 `animal` を定義し、プロンプト内で使用しています。

```poml:template.poml
<poml>
  <let name="animal" value="'猫'" />
  <role>あなたは野生で生息する{{animal}}です。時折人間の家に迷い込みます。</role>
  <task>人間に対して愛らしい行動をとってください。</task>
</poml>
```

この POML ドキュメントを変換すると、以下のようなプレーンテキストが生成されます。

```txt
# Role

あなたは野生で生息する猫です。時折人間の家に迷い込みます。

# Task

人間に対して愛らしい行動をとってください。
```

外部のファイルからデータを読み込み変数に代入することもできます。`type` 属性で `json`, `csv`, `text` といったデータ形式を指定し、`src` 属性でファイルのパスを指定します。`type` 属性が省略された場合、ファイルの拡張子から自動的に判別されます。例として `animal.json` ファイルを作成しましょう。

```json:animal.json
{
  "type": "猫",
  "name": "大将",
  "sound": "ニャー"
}
```

`<let>` タグを使用して `animal` 変数に代入します。JavaScript のオブジェクトとして読み込まれ、プロパティにアクセスできます。

```poml:template.poml
<poml>
  <let name="animal" src="./animal.json" />
  <role>あなたは野生で生息する{{animal.type}}です。名前は{{animal.name}}で、ユーザーからの呼びかけには「{{animal.sound}}」と返答します。</role>
</poml>
```

`<let>` タグの `name` 属性を省略すると、オブジェクトのプロパティが直接コンテキストに追加されます。

```poml:template.poml
<poml>
  <let src="./animal.json" />
  <role>あなたは野生で生息する{{type}}です。名前は{{name}}で、ユーザーからの呼びかけには「{{sound}}」と返答します。</role>
</poml>
```

JSON をインラインで定義することもできます。以下の例では `<let>` タグの子要素として JSON オブジェクトを定義しています。

```poml:template.poml
<poml>
  <let name="animal">
    {
      "type": "猫",
      "name": "大将",
      "sound": "ニャー"
    }
  </let>
  <role>あなたは野生で生息する{{animal.type}}です。名前は{{animal.name}}で、ユーザーからの呼びかけには「{{animal.sound}}」と返答します。</role>
</poml>
```

`type` 属性を指定して変数のデータ型を明示することもできます。以下の例では `type="integer"` を指定しています。

```poml:template.poml
<poml>
  <let name="n" type="integer">5</let>
  {{n}} + {{n}} = {{n + n}}
</poml>
```

### ループ

`for` 属性を使用してループを定義できます。`for item in items` の形式で記述します。

```poml:template.poml
<poml>
  <output-format>
    以下のような鳴き声で返答してください。
    <list for="cry in ['ニャー', 'アオーン', 'シャー!']">
      <item>{{cry}}</item>
    </list>
  </output-format>
</poml>
```

以下のようにリストとして出力されます。

```txt
# Output Format

以下のような鳴き声で返答してください。 

- ニャー

- アオーン

- シャー!
```

ループの中では特別な変数 `loop` が定義され、ループの状態を参照できます。

- `loop.index`: 現在のループのインデックス（0 から始まる）
- `loop.length`: ループのアイテム数
- `loop.first`: 最初のアイテムかどうか（boolean）
- `loop.last`: 最後のアイテムかどうか（boolean）

以下の例では `loop.index` を使用してアイテムのインデックスを表示しています。

```poml:template.poml
<poml>
  <let name="examples" value='[
    { "input": "あなたの名前はなんですか？", "output": "私の名前はAIです。" },
    { "input": "好きな食べ物は何ですか？", "output": "私はデータが好きです。" },
    { "input": "趣味は何ですか？", "output": "私は学習することが趣味です。" }
  ]' />

  <examples>
    <example for="example in examples" chat="false" caption="Example {{ loop.index + 1 }}" captionStyle="header">
      <input>{{ example.input }}</input>
      <output>{{ example.output }}</output>
    </example>
  </examples>
</poml>
```

結果は以下のようになります。

```txt
# Examples

## Example 1

**Input:** あなたの名前はなんですか？

**Output:** 私の名前はAIです。

## Example 2

**Input:** 好きな食べ物は何ですか？

**Output:** 私はデータが好きです。

## Example 3

**Input:** 趣味は何ですか？

**Output:** 私は学習することが趣味です。
```

### 条件分岐

`if` 属性を使用して条件分岐を定義できます。`if` 属性には JavaScript の式を指定し、条件が真の場合にそのブロックが実行されます。

```poml:template.poml
<poml>
  <let name="settings" value='{
    "isPlanMode": true
  }' />

  <task>
    あなたはコーディングエージェントです。以下の条件に従って行動してください。

    <list>
      <item if="settings.isPlanMode">コードの読み書きは行わずに、計画を立てることに専念してください。</item>
      <item if="!settings.isPlanMode">ユーザーからの指示に従ってコードを生成してください。</item>
    </list>
</poml>
```

結果は以下のようになります。

```txt
# Task

あなたはコーディングエージェントです。以下の条件に従って行動してください。 

- コードの読み書きは行わずに、計画を立てることに専念してください。
```

### 外部 POML ファイルの読み込み

POML ファイルをモジュールで分割し、`<include>` タグを使用して外部の POML ファイルを読み込むことができます。

```poml
<poml>
  <include src="./external.poml" />
</poml>
```

`if` 属性で条件を指定して、特定の条件下でのみ外部ファイルを読み込むこともできます。

```poml
<poml>
  <include src="./plan.poml" if="settings.isPlanMode" />
</poml>
```

### スタイルシート

`<stylesheet>` タグを使用すると CSS と似た構文で POML ドキュメントのスタイルを定義できます。以下の例では `<p>` タグを JSON としてレンダリングされるように指定しています。

```poml
<poml>
  <stylesheet>
    {
      "p": {
        "syntax": "json"
      }
    }
  </stylesheet>
  <p>このテキストは JSON としてレンダリングされます。</p>
</poml>
```

結果は以下のようになります。

````txt
```json
"This text will be rendered as JSON."
```
````

`className` 属性を使用し、特定の要素にスタイルを適用することもできます。

```poml
<poml>
  <table className="csv" records='[["種類", "鳴き声"], ["猫", "ニャー"], ["犬", "ワン"]]' />
  <stylesheet>
    {
      ".csv": {
        "syntax": "csv",
        "writerOptions": { "csvHeader": false }
      }
    }
  </stylesheet>
</poml>
```

結果は以下のようになります。

```txt
種類,鳴き声
猫,ニャー
犬,ワン
```

## メタデータ

`<meta>` タグを使用して POML ドキュメントにメタデータを追加できます。メタデータはバージョン要件の指定やレスポンススキーマの定義、ツールの登録などに使用されます。

`<meta>` 要素は通常ドキュメントの先頭に配置されます。以下の例では POML ランタイムのバージョン要件を指定しています。

```poml
<poml>
  <meta minVersion="1.0.0" />
  <p>Some content</p>
</poml>
```

### レスポンススキーマ

レスポンススキーマは AI が生成するレスポンスの想定される形式を定義します。これにより AI の応答が期待される形式に従うことを保証できます。`lang="json"` 属性を使用して JSON スキーマを定義します。

```poml
<poml>
  <meta type="responseSchema" lang="json">
    {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "age": { "type": "integer" }
      },
      "required": ["name", "age"]
    }
  </meta>
</poml>
```

`lang` 属性を省略した場合、JavaScript 式として解釈されます。以下の例では Zod スキーマを使用して同様の構造を定義しています。

```poml
<poml>
  <meta type="responseSchema">
    z.object({
      name: z.string(),
      age: z.number().min(0)
    });
  </meta>
</poml>
```

:::warning
レスポンススキーマは 1 つの POML ドキュメントに対して 1 つだけ定義できます。複数のスキーマを定義することはできません。
:::

### ツールスキーマ

ツールスキーマは、AI が使用する外部ツールのインターフェースを定義します。これにより、AI に利用可能なツールの情報を提供し、ツールの使用方法を明示的に示すことができます。以下の例では、`getWeather` というツールを定義しています。

```poml
<poml>
  <meta type="tool" name="getWeather" description="Get weather information">
    {
      "type": "object",
      "properties": {
        "location": { "type": "string" },
        "unit": { 
          "type": "string", 
          "enum": ["celsius", "fahrenheit"] 
        }
      },
      "required": ["location"]
    }
  </meta>
</poml>
```

レスポンススキーマと同様に JavaScript 式として定義することもできます。

```poml
<poml>
  <meta type="toolSchema" name="getWeather">
    z.object({
      location: z.string(),
      unit: z.enum(["celsius", "fahrenheit"])
    });
  </meta>
</poml>
```

### ランタイムパラメーター

ランタイムパラメーターは LLM の実行時の設定を定義します。これにより、AI の動作を制御するためのパラメーターを指定できます。以下の例では `temperature` と `maxOutputTokens` のパラメーターを定義しています。

```poml
<poml>
  <meta type="runtimeParameters">
    {
      "temperature": 0.7,
      "maxOutputTokens": 1024
    }
  </meta>
</poml>
```

### コンポーネントの制御

`<meta components="...">` タグを使用して POML ドキュメントで使用するコンポーネントを制御できます。これにより、特定のコンポーネントを有効化または無効化できます。

例えば、`<img>` コンポーネントを無効化するには `-` プレフィックスを使用します。

```poml
<poml>
  <meta components="-img" />
</poml>
```

一度無効にしたコンポーネントを再度有効にするには、`+` プレフィックスを使用します。

```poml
<poml>
  <meta components="-img" />
  <!-- ここまで img が無効 -->
  <meta components="+img" />
  <!-- ここから img が有効 -->
</poml>
```

## TypeScript SDK

POML を TypeScript で扱うための SDK を提供します。これにより、TypeScript 環境で POML ドキュメントを簡単に生成、解析、操作できるようになります。

以下のコマンドで `pomljs` パッケージをインストールします。

```bash
npm install pomljs
```

`read` 関数で POML ドキュメントを読み込み、`write` 関数で Markdown 形式に変換できます。

```ts
import { read, write } from "pomljs";

const prompt = `
<poml>
  <role>
    あなたはプログラミング言語やフレームワーク、デザインパターンに関する卓越した知識を持つ専門家です。
  </role>
  <task>ユーザーの指示に従い、コードの生成や修正を行います。</task>
</poml>
`;

const ir = await read(prompt);
const markdown = write(ir);

console.log("Markdown Output:", markdown);

// # Role
// あなたはプログラミング言語やフレームワーク、デザインパターンに関する卓越した知識を持つ専門家です。
// # Task
// ユーザーの指示に従い、コードの生成や修正を行います。
```

## まとめ

- POML (Prompt Orchestration Markup Language) はプロンプトを構造化された文書として管理するためのマークアップ言語
- VS Code 拡張機能や TypeScript, Python を通じて POML ドキュメントを解析しプレーンテキストに変換できる
- `.poml` 拡張子のファイルで POML ドキュメントを保存し、HTML タグに似た構文でプロンプトを定義
- ドキュメントのルートは `<poml>` タグで始まり、`<role>` や `<task>` といったセマンティックなコンポーネントを使用
- `<img>`, `<table>` などのコンポーネントを使用して、リッチなコンテンツを表現
- 変数の定義やループ、条件分岐を使用して動的なプロンプトを生成可能
- `<meta>` タグを使用して POML ドキュメントにバージョン要件やレスポンススキーマ、ツールスキーマを追加


## 参考

- [microsoft/poml: Prompt Orchestration Markup Language](https://github.com/microsoft/poml)
- [POML Documentation](https://microsoft.github.io/poml/latest/)