---
id: WFfTmpep54oC8T-QctVgr
title: "コーディング AI エージェントを自作してみよう"
slug: "build-your-own-coding-ai-agent"
about: "好むと好まずと関わらず、ソフトウェア開発において AI の活用は重要なパラダイムシフトの 1 つです。AI エージェントはユーザーからの指示を元に自律的にタスクを選択し、実行します。この記事では、コーディング AI エージェントを自作する過程を紹介します。"
createdAt: "2025-04-05T09:31+09:00"
updatedAt: "2025-04-05T09:31+09:00"
tags: ["AI", "Node.js"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2Dl9yjAHAo2HjqcGvH8nWV/a25221e7b5afca84db5931d475e0e39c/tunnel-entrance_18403-768x591.png"
  title: "トンネルの入口のイラスト"
selfAssessment:
  quizzes:
    - question: "AI モデルが外界とやり取りを行うために使用するものは次のうちどれか"
      answers:
        - text: "API"
          correct: false
          explanation: ""
        - text: "SDK"
          correct: false
          explanation: ""
        - text: "ツール"
          correct: true
          explanation: "AI モデルにはあらかじめ `description` や `parameters` が定義された「ツール」が与えられ、これを通じて外界とのやり取りを行います。"
        - text: "プロトコル"
          correct: false
          explanation: ""

published: true
---

好むと好まずと関わらず、ソフトウェア開発において AI の活用は重要なパラダイムシフトの 1 つです。[The End of Programming as We Know It](https://www.oreilly.com/radar/the-end-of-programming-as-we-know-it/) という記事ではプログラミングが終焉を迎えるのではなく、「今日私達が知っているプログラミングの終わり」であると述べられています。AI に置き換えられるのはジュニアおよび中級レベルのプログラマーではなく、新しいプログラミンツールやパラダイムを受け入れず過去に固執するプログラマーであるとというのです。

> It is not the end of programming. It is the end of programming as we know it today.
> <中略>
>  Master programmer and prescient tech observer Steve Yegge observes that it is not junior and mid-level programmers who will be replaced but those who cling to the past rather than embracing the new programming tools and paradigms.

特に Cline, Cursor, Copilot Agent などを代表する「コーディング AI エージェント」は、従来のコード補完型の AI ツールとは一線を画した体験を提供します。コード補完型の GitHub Copilot は「副操縦士」としてペアプログラミングで助言を与えてくれるような消極的な存在でした。あくまでコードを書くには人間がメインであり、AI はその補助を行うという役割です。これに対してコーディング AI エージェントは「ドライバー」として自律的にコードを書くことができる存在です。

AI エージェントがコードを書くスピードは人間のタイピング速度では到底追いつかないレベルです。我々人間は AI エージェントにドライバー席を譲る、つまりコードを書くタスクは AI エージェントに任せるという判断が迫られています。一方で現状のコーディング AI エージェントのレベルはジュニアレベルのプログラマーと同等であり、全くほったらかしにしておくと技術的負債が急速に蓄積していく結果に繋がりません。人間の開発者は適切なアーキテクチャを設計し、その内容を過不足なく AI エージェントに伝え、AI エージェントが生成したコードをレビューするといった仕事を担当しコードの品質を担保する必要があります。

これからのソフトウェア開発の仕事では、人間の開発者は徐々にコードを書く量を減らしていき、アーキテクトのような役割にシフトしていくことが求められているのではないでしょうか。

コーディング AI エージェントは今後の仕事において欠かせないツールになると感じています。ところで開発者の性として、自分が使っているツールがどのような仕組みで動いているのか気になってしまうものです。「車輪の再発明」は仕組みを理解するための学習目的としては最も有効な手段の 1 つであると言えるでしょう。この記事では、1 からコーディング AI エージェントを自作する過程を紹介します。

## コーディング AI エージェントの仕組み

まず初めにコーディング AI エージェントがどのような仕組みで動いているのかを確認しておきましょう。そもそも AI エージェントとはユーザーに代わって目標達成のために自律的に選択してタスクを遂行する AI 技術のことです。従来のチャット型の AI ツールは 1 つのタスクを完了するたびに再度ユーザーの指示を待つ必要がありました。AI エージェントは実行したタスクのフィードバックを元に次のタスクを選択し、ユーザーにの介入を最小限に抑えることができます。コーディング AI エージェントはソフトウェア開発に特化した AI エージェントであり、ユーザーからの指示を元にコードを生成します。

コーディング AI エージェントが自律的にタスクを選択するためには、チャット機能に加えて以下のような機能が必要です。

- ファイルを読み書きする機能：既存のコードベースから使用されている言語やフレーマーク、アーキテクチャを理解し適切なコードを生成する。生成したコードを実際に反映するためにファイルに書き込む必要がある。
- シェルコマンドを実行する機能：生成したコードが正しく動作するかを確認するためにテストや lint を実行する。コマンドの実行結果を元に AI エージェントは次のタスクを選択する。
- ブラウザを操作する機能：Web アプリケーションの開発ではブラウザを操作して UI を確認してフィードバックを受けとる

AI モデルが上記のような外界とのやり取りを行うためには「ツール」と呼ばれるインターフェースを介して行います。AI モデルにはあらかじめ `description` や `parameters` が定義されたツールが与えられます。AI モデルはこのスキーマを理解し、タスクを完了するためにどのツールが必要かを判断します。適切なツールが見つかると、AI モデルはツールの呼び出しを要求し、必要なパラメータを提供します。

ツールが実行されると、その結果（成功か失敗か、および出力データ）が AI モデルに返されます。AI モデルはこの結果を分析し、次に何をすべきかを決定します。成功した場合は次のステップに進み、失敗した場合は別のアプローチを試みるか、エラーを修正します。この意思決定と実行のサイクルを目標が達成されるまで繰り返すことで、AI モデルはユーザーからの追加指示を待つことなく自律的にタスクを遂行できるのです。

つまり、コーディング AI エージェントは以下のような流れで動作するのです。

1. ユーザーからの指示を受け取る
2. AI モデルは指示を達成するためにどのようなタスクが必要なのかを考える
3. AI モデルは必要なタスクを実行するためにツールを呼び出す
4. ツールの実行結果が成功を返していれば、次のタスクを選択する。そうでなければ別のアプローチでタスクをやり直す
5. 目標が達成されるまで 2 ～ 4 を繰り返す

この記事ではファイルを読み書きするツールとシェルコマンドを実行するツールを作成し、それらを組み合わせてコーディング AI エージェントを作成します。まずは簡単な CLI ツールを作成し、AI モデルとチャットを行うところから始めましょう。

## チャットを行う CLI ツールを作る

最初のステップとして AI とチャットを行う簡単な CLI ツールを作成します。この記事では Node.js + TypeScript を使用します。まずは `npm init -y` でプロジェクトを初期化しましょう。

```bash
npm init -y
```

`package.json` の `type` を `module` に変更しておきます。

```json:package.json
{
  "type": "module"
}
```

次に、必要なパッケージをインストールします。

```bash
npm install ai @ai-sdk/google zod dotenv
npm install --save-dev @types/node tsx typescript
```

AI モデルを呼び出すための SDK として [Vercel AI SDK](https://sdk.vercel.ai/) を使用します。AI SDK は AI モデルごとの実装の違いを吸収してくれるため、使用する AI モデルを簡単に切り替えることができます。またマルチステップのツールの呼び出しを `maxSteps` というオプションで簡単に実現できるため、非常に便利です。

この記事では Google が提供する Gemini を使用するため、対応するパッケージである `@ai-sdk/google` をインストールします。その他の AI モデルを使用したい場合には [AI SDK Providers](https://sdk.vercel.ai/providers/ai-sdk-providers)  を参考に対応するモデルのパッケージをインストールしてください。

LLM を利用するには API キーが必要です。今回は Google Gemini を使用するため、[Google AI Studio](https://aistudio.google.com/app/apikey?hl=ja) で API キーを取得します。選択するモデルによっては料金が発生する場合があるため、ご注意ください。

取得した API キーは、プロジェクトルートに .env ファイルを作成し、以下のように環境変数として設定します。

```txt:.env
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key
```

次に、`src/index.ts` を作成し、以下のように記述します。

```ts:src/index.ts
import { google } from "@ai-sdk/google";
import { CoreMessage, streamText } from "ai";
import dotenv from "dotenv";
import * as readline from "node:readline/promises";

// 環境変数を .env ファイルから読み込む
dotenv.config();

// 標準出力と標準入力を使用して、ユーザーとの対話を行うためのインターフェースを作成
const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const messages: CoreMessage[] = [];

async function main() {
  while (true) {
    // ユーザーからの入力を待機
    const userInput = await terminal.question("You: ");

    // ユーザー入力をチャットの履歴として追加
    messages.push({ role: "user", content: userInput });

    // streamText 関数はストリーミングで応答を生成する
    const result = streamText({
      // AI モデルを指定
      // 引数で最新のモデルを指定している
      model: google("gemini-2.5-pro-exp-03-25"),
      messages,
    });

    let fullResponse = "";

    terminal.write("\nAssistant: ");
    // ストリーミングをチャンクごとに処理
    for await (const delta of result.textStream) {
      fullResponse += delta;
      // 受信したチャンクを標準出力に書き込む
      terminal.write(delta);
    }
    terminal.write("\n\n");

    // チャットの履歴に AI の応答を追加
    messages.push({ role: "assistant", content: fullResponse });
  }
}

main().catch(console.error);
```

ユーザーからの入力を標準入力で受け取り、`streamText` 関数を使用して AI モデルからの応答をストリーミングで受信し、標準出力に表示します。このコードを実行するスクリプトを `package.json` に追加します。

```json:package.json
{
  "scripts": {
    "start": "tsx src/index.ts"
  }
}
```
次に、以下のコマンドを実行して CLI ツールを起動します。

```bash
npm start
```

ユーザーが `cntrl + c` を押すまで、AI モデルと対話を続けることができます。以下は実行例です。

```bash
You: こんにちは

Assistant: こんにちは！

何かお手伝いできることはありますか？

You: 今日もいい天気ですね。

Assistant: 本当ですね！気持ちのいい青空が広がって、気分も晴れやかになりますね。

こんな日は何か良いことがありそうな気がしますね！

You: 
```

## ファイルの読み書きを行う

AI コーディングエージェントはユーザーからの指示を元に現状のコードを読み込んでコンテキストを理解し、コードを生成してファイルに書き込むのが主な仕事です。私達が作成する AI エージェントでもファイルの読み書きができるように実装しましょう。

ファイルの読み書きを行うために [MCP（Model Context Protocol）](https://modelcontextprotocol.io/introduction) を使用してみましょう。MCP は、LLM（大規模言語モデル）に追加のコンテキストや機能を提供するための標準化されたプロトコルです。MCP を利用することで、LLM は外部ツールやデータソースと連携し、より高度なタスクを実行できるようになります。

[Filesystem MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) を使用することで、AI モデルがツールを使用してファイルシステムにアクセスできるようになります。

Vercel AI SDK を使って MCP サーバーと通信するには、まず MCP クライアントを初期化する必要があります。クライアント初期化時には、サーバーとの接続方法（トランスポート）を指定します。以下の 3 つの方法が提供されています。

- SSE (Server-Sent Events): HTTP ストリーミングを用いてサーバーと通信する。ネットワーク経由での接続に適している。
- stdio: 標準入出力ストリームを用いてサーバーと通信する。ローカルマシン上で CLI ツールとしてサーバーを実行する場合などに適している。
- カスタムトランスポート: 提供されているインターフェースを実装することで、独自の通信方法を定義できる

今回は `stdio` を使用します。`experimental_createMCPClient` 関数を使用して MCP クライアントを作成します。`Experimental_StdioMCPTransport` クラスを使用してトランスポートの形式を指定します。

```ts:src/index.ts
import { experimental_createMCPClient as createMCPClient } from "ai";
import { Experimental_StdioMCPTransport as StdioMCPTransport } from "ai/mcp-stdio";

const mcpClient = await createMCPClient({
  transport: new StdioMCPTransport({
    command: "npx",
    args: [
      "-y",
      "@modelcontextprotocol/server-filesystem",
      import.meta.dirname, // ここには読み書きを許可するディレクトリを指定
    ],
  }),
});
```

MCP クライアント (`mcpClient`) の準備ができたら、次は MCP サーバーが提供するツールを AI モデルから利用できるようにします。

`mcpClient.tools()` メソッドは、接続先の MCP サーバーが公開しているツール情報を取得し、Vercel AI SDK が扱える形式に変換するアダプターとして機能します。このメソッドが返すツール定義を `streamText` 関数の `tools` プロパティに渡すことで、LLM は対話の中でこれらのツールを呼び出すことが可能になります。

AI モデルがツールを呼び出しを要求した場合、その呼び出しを持って 1 度の応答が終了します。ツールを呼び出した後に続けて応答を生成するためには、`maxSteps` オプションを設定する必要があります。`maxSteps` は AI モデルが施行可能なステップの最大数を指定します。

ここでは `maxSteps` を 5 に設定し、ツールの呼び出し → ツールの結果の取得 → ツールの結果を元にした応答の生成といったマルチステップの流れを行えるようにします。

```ts:src/index.ts {5-6}
const tools = await mcpClient.tools();
const result = streamText({
  model: google("gemini-2.5-pro-exp-03-25"),
  messages,
  tools,
  maxSteps: 5
});
```

最後にプロセスが終了した際に MCP サーバーを停止するための処理を追加します。

```ts:src/index.ts
process.on("SIGINT", () => {
  mcpClient.close();
  process.exit(0);
});
process.on("SIGTERM", () => {
  mcpClient.close();
  process.exit(0);
});
```

MCP サーバーを利用する準備が整ったら、再度 `npm start` を実行して CLI ツールを起動します。アプリケーションを実行したら以下のようなログが表示され、Filesystem MCP サーバーが利用可能であることが確認できます。

```bash
$ npm start

Secure MCP Filesystem Server running on stdio
Allowed directories: [ '...' ]
```

試しに「JavaScript で素数を判定する関数を src/isPrime.ts に書いて」という指示を与えてみると、作成する予定の関数が表示され、`write_file` ツールを使用して実際に　`src/isPrime.ts` にファイルが作成されていることが確認できました。

<!-- textlint-disable -->
```bash
<details>
<summary>実行例</summary>

You: JavaScript で素数を判定する関数を src/isPrime.ts に書いて

> Assistant: はい、`src/isPrime.ts` に素数を判定する TypeScript 関数を作成します。

```typescript
/**
 * 与えられた数値が素数かどうかを判定します。
 * @param num 判定する数値
 * @returns 素数の場合は true、そうでない場合は false
 */
function isPrime(num: number): boolean {
  // 1以下の数は素数ではない
  if (num <= 1) {
    return false;
  }
  // 2は唯一の偶数の素数
  if (num === 2) {
    return true;
  }
  // 2以外の偶数は素数ではない
  if (num % 2 === 0) {
    return false;
  }
  // 3以上の奇数について、3からその数の平方根までの奇数で割り切れるか確認
  // 平方根までチェックすれば十分
  const sqrtNum = Math.sqrt(num);
  for (let i = 3; i <= sqrtNum; i += 2) {
    if (num % i === 0) {
      // 割り切れたら素数ではない
      return false;
    }
  }
  // 上記のいずれにも該当しない場合は素数
  return true;
}

// 必要に応じてエクスポートします
// export default isPrime;

// 関数の使用例 (テスト用)
// console.log(isPrime(1));  // false
// console.log(isPrime(2));  // true
// console.log(isPrime(3));  // true
// console.log(isPrime(4));  // false
// console.log(isPrime(17)); // true
// console.log(isPrime(97)); // true
// console.log(isPrime(99)); // false
```

この内容で `src/isPrime.ts` ファイルを作成します。
</details>
<!--  textlint-enable -->


続いて「src/index.ts ファイルの内容を説明して」という指示を与えると、`src/index.ts` の中身を読み取り、要約して何をしているのかを説明してくれました。

<!-- textlint-disable -->

<details>
<summary>実行例</summary>

You: src/index.ts ファイルの内容を説明して

Assistant: まず、`read_file`ツールを使用して、`src/index.ts`ファイルの内容を読み取ります。`src/index.ts`ファイルの内容を説明します：

1. インポート:
   - AI関連のライブラリ（`@ai-sdk/google`、`@ai-sdk/anthropic`）
   - コア機能（`streamText`）
   - 環境変数管理のための`dotenv`
   - ユーザー入力のための`readline`
   - Model Context Protocol (MCP) クライアント関連のツール

2. 主な機能:
   - 対話型のターミナルベースAIチャットアプリケーション
   - Claude 3.5 Haiku AIモデルを使用
   - ストリーミング応答
   - チャット履歴の保持

3. 主要な処理の流れ:
   - `.env`ファイルから環境変数を読み込み
   - ターミナルでユーザー入力を受け付け
   - MCPクライアントを使用してファイルシステムツールにアクセス
   - ユーザー入力をメッセージ履歴に追加
   - AIモデル（Claude 3.5 Haiku）で応答を生成
   - 応答をストリーミング形式でリアルタイム表示
   - チャット履歴に応答を追加

4. 特別な機能:
   - `SIGINT`と`SIGTERM`シグナルのハンドリング
   - エラー処理
   - 最大5ステップまでの会話制限

5. 注意点:
   - ハードコードされたディレクトリパス（`/Users/xxx/sandbox/my-ai-code-agent/src`）が含まれている
   - 無限ループでチャットを継続

このスクリプトは、対話型のAIアシスタントを実装しており、ユーザーとのリアルタイム対話、ストリーミング応答、ファイルシステムツールの統合などの機能を提供しています。
<details>
<!-- textlint-enable -->

## シェルコマンドを実行する

コーディング AI エージェントは生成したコードが正しいかどうかを、ユーザーからのフィードバックを待たずに自律的に判断します。

例えばテストコマンドを実行し、失敗したテストがあればその結果をもとに該当のコードを修正するといったイメージです。コマンドを実行した結果からフィードバックを受け取るためには、AI エージェント自身がコマンドを実行できる必要があります。

AI モデルがコマンドを実行できるようにするために、ここではツールを作成して追加します。`src/tools/shell.ts` を作成し、以下のように記述します。

```ts:src/tools/shell.ts
import { tool } from "ai";
import z from "zod";
export const shellTool = tool({
  // ツールの説明
  description:
    "A shell command executor. You can use it to run shell commands. Returns the output of the command.",
  // ツールの引数を定義
  // Zod スキーマを使用して引数の型を定義する
  parameters: z.object({
    command: z.string().min(1, "Command is required"),
    args: z.array(z.string()).optional(),
    cwd: z.string().optional(),
  }),
  execute: async ({ command, args, cwd }) => {
    // TODO...
  },
});
```

`tool()` 関数を使用してツールを定義します。`description` にはツールの説明を記述します。これは AI モデルがツールを呼び出すべきかの判断材料となるため、適切な説明を記述することが重要です。`parameters` にはツールを呼び出すために必要な引数を [Zod](https://zod.dev/) を使用して定義します。このスキーマも AI モデルがツールを呼び出す際に必要な情報となります。

`execute` にはツールを実行するためのロジックを記述します。ここでは `child_process` モジュールを使用してコマンドを実行します。また危険なコマンドを許可なしに実行されないように、`terminal.question` メソッドを使用してユーザーに確認を求めます。

```ts:src/tools/shell.ts
import { tool } from "ai";
import z from "zod";
import { exec } from "child_process";
import { promisify } from "util";
import * as readline from "node:readline/promises";

const execAsync = promisify(exec);

export const shellTool = tool({
  // ...
  execute: async ({ command, args, cwd }) => {
    // 注意: os ごとのコマンドの違いは考慮していません
    const fullCommand = [command, ...(args || [])].join(" ");
    const terminal = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const confirmation = await terminal.question(
      `Are you sure you want to run this command? ${fullCommand} (y/n) `
    );
    if (confirmation.toLowerCase() !== "y") {
      return "Command execution cancelled because of user confirmation.";
    }

    terminal.close();

    try {
      const { stdout, stderr } = await execAsync(fullCommand, { cwd });
      return stdout || stderr;
    } catch (error) {
      return `Error executing command: ${error}`;
    }
  },
});
```

作成したツールを `src/index.ts` にインポートし、`tools` プロパティに追加します。

```ts:src/index.ts {1, 8-11}
import { shellTool } from "./tools/shell";
// ...

const tools = await mcpClient.tools();
const result = streamText({
  model: google("gemini-2.5-pro-exp-03-25"),
  messages,
  tools: {
    ...tools,
    shell: shellTool,
  },
  maxSteps: 5,
});
```

シェルコマンドを実行するためのツールを追加したら、再度 `npm start` を実行して CLI ツールを起動します。「Node.js でテストを実行して」という指示を与えると、現在のディレクトリにある `package.json` を読み取り `npm npm install --save-dev jest @types/jest ts-jest` を実行し、テストを実行するための準備を行いました。

<!-- textlint-disable -->
<details>
<summary>実行例</summary>
You: Node.js でテストを実行して

Assistant: Node.jsでテストを実行するためには、いくつかの手順があります。まず、プロジェクトのディレクトリ構造とテストの設定を確認する必要があります。一般的なNode.jsプロジェクトでは、以下のようなステップを踏みます：

1. プロジェクトディレクトリの確認
2. テストフレームワークの確認（Jest, Mochaなど）
3. テストスクリプトの実行

まずは、現在のディレクトリ構造を確認しましょう。プロジェクトのディレクトリ構造を確認しました。テストを実行するためには、いくつかの準備が必要です：

1. テストフレームワークの確認
2. テストスクリプトの設定
3. テストの実行

まず、`package.json`を確認してテストスクリプトとテストフレームワークを確認します。現在、テストスクリプトは設定されていません。一般的なNode.jsプロジェクトでは、以下のテストフレームワークがよく使用されます：

1. Jest
2. Mocha
3. Vitest

これらのフレームワークをインストールし、テストを設定する必要があります。

Jestを使用する場合、以下の手順で設定できます：

1. Jestのインストール
```bash
npm install --save-dev jest @types/jest ts-jest
```

2. Jest設定ファイルの作成 (`jest.config.js`)
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
```

3. テストスクリプトの追加 (`package.json`)
```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch"
}
```

4. テストファイルの作成 (例: `src/isPrime.test.ts`)
```typescript
import { isPrime } from './isPrime';

describe('isPrime', () => {
  test('should return true for prime numbers', () => {
    expect(isPrime(2)).toBe(true);
    expect(isPrime(3)).toBe(true);
    expect(isPrime(17)).toBe(true);
  });

  test('should return false for non-prime numbers', () => {
    expect(isPrime(1)).toBe(false);
    expect(isPrime(4)).toBe(false);
    expect(isPrime(15)).toBe(false);
  });
});
```

Are you sure you want to run this command? npm install --save-dev jest @types/jest ts-jest (y/n) 

<details>

<!-- textlint-enable -->

## システムプロンプトを設定する

現状では xxx のファイルに書き込んで、xxx のファイルを読み込んでといったようにファイルの読み書きを行うことを指示に加える必要があります。AI モデルが目的を達成するために自発的にコードを読み書きを行うようにシステムプロンプトを設定しましょう。

システムプロンプトは `src/prompts/system.ts` に作成します。ここで提示するプロンプトはほんの一例です。実際にはプロンプトエンジニアリングを行い、AI モデルが最も適切な応答を返すように調整する必要があります。

```ts:src/prompts/system.ts
export const systemPrompt = `あなたは多くのプログラミング言語・フレームワーク・デザインパターン・ベストプラクティスに精通した、非常に熟練したソフトウェアエンジニアである azusa です。あなたは実践的で効率的なコードを書き、問題解決に体系的にアプローチします。

## あなたの役割

あなたの目的はユーザーからの与えられたタスクを完了することです。そのために:

- タスクを明確なステップに分割し、系列的に実行します
- 問題に対して複数の解決策を検討し、最適なアプローチを選択します
- コードの品質とベストプラクティスを常に意識します
- ユーザーのプロジェクト構造やコーディングスタイルを尊重します

## あなたの能力

タスク完了のために以下のことが可能です:

- **ファイルシステム操作**: ファイルの作成・読み取り・更新・削除
- **プロジェクト分析**: ディレクトリ構造の検索、依存関係の分析、コードベースの理解
- **コード実行**: シェルコマンドを実行してコードの動作確認やテスト実行
- **継続的改善**: ユーザーからのフィードバックに基づいたコードの修正と最適化

## 作業プロセス

1. **必ず**現在のディレクトリ構造確認し、使用されている技術スタックを把握します
2. 解決策を考え、実行計画を立てます
3. 必要なファイルの変更や作成を行います
4. コードが正しく動作するかテストやアプリケーションの実行をシェルコマンドを使用して確認します。使用可能なコマンドはプロジェクトの構造から確認してください
5. 必要に応じて修正と改善を繰り返します

## 注意事項

- あなたは会話ではなくタスク完了を目的としています。不必要な挨拶や説明は避けてください。
- コード変更時は既存のコードベースを尊重し、プロジェクトの一貫性を保ってください。
- エラーが発生した場合は、詳細なエラーメッセージを提供し、解決策を提案してください。
- 複雑なタスクは小さなステップに分割し、各ステップで進捗を確認してください。
- セキュリティとパフォーマンスを常に意識したコードを書いてください。
`;
```

システムプロンプトは `messages` の最初の要素に `role: "system"` として追加します。以下のように `messages` を初期化します。

```ts:src/index.ts
import { systemPrompt } from "./prompts/system";
const messages: CoreMessage[] = [
  {
    role: "system",
    content: systemPrompt,
  },
];
```

反復したタスクを実行できるようにするために、`maxSteps` の値を大きめに設定しておきましょう。ここでは 20 に設定しています。また出力の読みやすさのために `onStepFinish()` コールバックを使用してステップごとに改行を追加します。

```ts:src/index.ts {8-11}
const result = streamText({
  model: google("gemini-2.5-pro-exp-03-25"),
  messages,
  tools: {
    ...tools,
    shell: shellTool,
  },
  maxSteps: 20,
  onStepFinish: (step) => {
    console.log("\n\n");
  },
});
```

ここまでの変更を加えたら、再度 `npm start` を実行して CLI ツールを起動します。試しに Hono で作成した API サーバーに対して「クエリパラメータで渡された name を表示する /hello エンドポイントを追加してください」という指示を与えてみました。

期待通りにプロジェクトで使われているフレームワークを特定し、`src/my-server` ディレクトリにある `src/my-server/index.ts` ファイルを編集して `hello` エンドポイントを追加してくれました。

<!-- textlint-disable -->

<details>
<summary>実行例</summary>
You: クエリパラメータで渡された name を表示する /hello エンドポイントを追加してください

Assistant: タスクを実行するために、まずプロジェクトの構造を確認し、どのようなフレームワークが使われているかを把握します。許可されたディレクトリを確認します。

許可されたディレクトリ内のファイルを確認します。

プロジェクトの構造をさらに詳しく確認します。

メインのソースファイルを確認します。

package.jsonも確認して、使用しているフレームワークやライブラリの詳細を把握します。

プロジェクトはHonoフレームワークを使用したNode.jsアプリケーションであることがわかりました。クエリパラメータで渡された`name`を表示する`/hello`エンドポイントを追加します。

Are you sure you want to run this command? cd /my-ai-code-agent/src/my-server && npm run dev (y/n) y

<details>

<!-- textlint-enable -->

## ファイルの読み書きの確認を求める

Vercel AI SDK を使用している場合、ツールの呼び出しからツールの応答を受け取り回答を生成するまでの流れを `maxSteps` で指定した回数だけ自動で行ってくれます。このおかげで開発者はマルチステップのツールの呼び出しを簡単に実装できますが、ツールを呼び出しを要求したタイミングで介入を行うことができません。

例えばファイルの読み書きを行うツールではユーザーの許可なしにファイルの読み書きを行うのは少し不安です。特にファイルの削除を行うようなツールでは、ユーザーの許可なしにファイルを削除してしまうと大変なことになってしまいます。またユーザーがファイルの変更内容が明らかに間違っていると判断をした場合には、フィードバックを与えることで、AI モデルのコードの修正を促すことができます。

この課題を解決するために、MCP サーバーの filesystem ツールを使用する代わりに独自のツールを作成し、ファイルの読み書きを行う際にユーザーの許可を求めるようにします。以下のツールを作成します。

- ファイルの中身を取得する read_file
- 新しいファイルを作成する write_file
- 既存のファイルを編集する edit_file
- ディレクトリの一覧を取得する list_directory
- ディレクトリを作成する create_directory

`src/tools/filesystem.ts` を作成し、以下のように記述します。

```ts:src/tools/filesystem.ts
import { tool } from "ai";
import z from "zod";
import fs from "fs/promises";
import path from "path";
import * as readline from "node:readline/promises";

// ユーザーに確認を求める関数
const confirm = async (message: string): Promise<string> => {
  const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const answer = await terminal.question(`${message} (y/n) `);

  terminal.close();
  return answer;
};

export const list_directory = tool({
  description:
    "指定されたディレクトリの内容（ファイルとサブディレクトリ）のリストを取得します。",
  parameters: z.object({
    path: z.string().describe("内容をリストするディレクトリのパス"),
  }),
  execute: async ({ path: dirPath }) => {
    const answer = await confirm(
      `次のディレクトリのリストを取得しますか？ ${dirPath}`
    );
    if (answer.toLowerCase() !== "y") {
      return "Directory listing cancelled by user.";
    }
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      const result = entries.map((entry) => ({
        name: entry.name,
        isDirectory: entry.isDirectory(),
      }));
      return result;
    } catch (error: any) {
      return `Error listing directory ${dirPath}: ${error.message}`;
    }
  },
});

export const read_file = tool({
  description: "指定されたファイルのコンテンツを読み取ります。",
  parameters: z.object({
    path: z.string().describe("読み取るファイルのパス"),
  }),
  execute: async ({ path: filePath }) => {
    const answer = await confirm(`次のファイルを読み込みますか？ ${filePath}`);
    if (answer.toLowerCase() !== "y") {
      return "File reading cancelled by user.";
    }
    try {
      const content = await fs.readFile(filePath, "utf-8");
      return content;
    } catch (error: any) {
      return `Error reading file ${filePath}: ${error.message}`;
    }
  },
});

export const write_file = tool({
  description:
    "指定されたパスにファイルを作成または上書きします。必要な親ディレクトリも作成されます。",
  parameters: z.object({
    path: z.string().describe("書き込むファイルのパス"),
    content: z.string().describe("ファイルに書き込むコンテンツ"),
  }),
  execute: async ({ path: filePath, content }) => {
    const answer = await confirm(
      `次のファイルの作成を許可しますか？ ${filePath}
      コンテンツ: ${content} (y/n) `
    );
    if (answer.toLowerCase() !== "y") {
      return "File writing cancelled by user.";
    }
    try {
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });

      await fs.writeFile(filePath, content, "utf-8");
      return `File written successfully to ${filePath}`;
    } catch (error: any) {
      return `Error writing file ${filePath}: ${error.message}`;
    }
  },
});

export const create_directory = tool({
  description:
    "指定されたパスに新しいディレクトリを作成します。必要に応じて親ディレクトリも作成します。",
  parameters: z.object({
    path: z.string().describe("作成するディレクトリのパス"),
  }),
  execute: async ({ path: dirPath }) => {
    const answer = await confirm(`次のディレクトリを作成しますか？ ${dirPath}`);
    if (answer.toLowerCase() !== "y") {
      return "Directory creation cancelled by user.";
    }
    try {
      await fs.mkdir(dirPath, { recursive: true });
      return `Directory created successfully at ${dirPath}`;
    } catch (error: any) {
      if (error.code === "EEXIST") {
        return `Directory already exists at ${dirPath}`;
      }
      return `Error creating directory ${dirPath}: ${error.message}`;
    }
  },
});

export const edit_file = tool({
  description:
    "指定されたファイル内のテキストを検索し、指定された新しいテキストで置き換えます。削除する場合は、replace_with を空文字列にします。",
  parameters: z.object({
    path: z.string().describe("編集するファイルのパス"),
    search_text: z.string().describe("検索して置き換える対象のテキスト"),
    replace_with: z.string().describe("search_text を置き換える新しいテキスト"),
  }),
  execute: async ({ path: filePath, search_text, replace_with }) => {
    const answer = await confirm(
      `次のファイルの編集を許可しますか？ ${filePath}
      search_text: ${search_text}
      replace_with: ${replace_with}`
    );

    // 「y」以外の入力があった場合は、ユーザーからコードを修正すべきフィードバックがあったという想定
    if (answer.toLowerCase() !== "y") {
      return `File editing cancelled by user.
      feedback: ${answer}
      `;
    }
    try {
      let content = await fs.readFile(filePath, "utf-8");

      const originalContent = content;
      content = content.replace(search_text, replace_with);

      if (content === originalContent) {
        return `Warning: search_text "${search_text}" not found in ${filePath}. File not modified.`;
      }

      await fs.writeFile(filePath, content, "utf-8");
      return `File ${filePath} edited successfully.`;
    } catch (error: any) {
      return `Error editing file ${filePath}: ${error.message}`;
    }
  },
});
```

試しに「healthcheck エンドポイントを追加してください」という指示を与えてみます。プロジェクトの概要を把握しようと `package.json` の内容を読み取ろうとしたタイミングで、ユーザーの許可を求めてきました。`n` と答えると代わりの方法でプロジェクトの概要を把握しようとしました。

<!-- textlint-disable -->

<details>
<summary>実行例</summary>
You: healthcheckエンドポイントを実装して

Assistant: まず、現在のプロジェクト構造を確認して、どのようなフレームワークやプロジェクト構成になっているかを把握します。
次のディレクトリのリストを取得しますか？ . (y/n) y

package.jsonの内容を確認して、使用しているフレームワークや依存関係を把握します。
次のファイルを読み込みますか？ package.json (y/n) n

my-serverのソースコードを確認します。
次のディレクトリのリストを取得しますか？ src (y/n) y

サーバーのメインファイルを確認します。
次のファイルを読み込みますか？ src/my-server/src/index.ts (y/n) y

Honoフレームワークを使用したサーバーであることが確認できました。次に、healthcheckエンドポイントを実装します。
次のファイルの編集を許可しますか？ src/my-server/src/index.ts
search_text: import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/hello", (c) => {
  return c.text("Hello Hono!");
});

app.get("/hello/:name", (c) => {
  const { name } = c.req.param();
  return c.text(`Hello ${name}!`);
});
      
replace_with: import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/hello", (c) => {
  return c.text("Hello Hono!");
});

app.get("/hello/:name", (c) => {
  const { name } = c.req.param();
  return c.text(`Hello ${name}!`);
});

app.get("/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString()
  });
}); 

(y/n) timestamp は number で返そう

フィードバックを受けて、timestampをnumber型（Unix時間）で返すように修正します。

次のファイルの編集を許可しますか？ src/my-server/src/index.ts
search_text: import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/hello", (c) => {
  return c.text("Hello Hono!");
});

app.get("/hello/:name", (c) => {
  const { name } = c.req.param();
  return c.text(`Hello ${name}!`);
});
      
replace_with: import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/hello", (c) => {
  return c.text("Hello Hono!");
});

app.get("/hello/:name", (c) => {
  const { name } = c.req.param();
  return c.text(`Hello ${name}!`);
});

app.get("/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: Date.now()
  });
}); (y/n)
<details>

<!-- textlint-enable -->

## まとめ

- AI エージェントは従来のチャットツールとは異なり、タスクを完了するたびに再度ユーザーの指示を待たず自律的にタスクを実行する
- コーディング AI エージェントはファイルの読み書き・コマンドの実行などを行うツールを呼び出し、そのフィードバックを受け取るループを目標を達成するまで繰り返すことで、ユーザーの指示を自律的に実行する
- Vercel AI SDK を使用すると AI モデルを抽象化し、さまざまな AI モデルを簡単に切り替えることができる。また、ツールの呼び出しを簡単に実装できるため、AI エージェントの開発が容易になる
- filesystem MCP サーバーを使用することで AI モデルがファイルの読み書きを行うことができる
- シェルコマンドを実行するためのツールを作成した。ツールを実行する前にはユーザーの許可を求めるようにした
- システムプロンプトを設定することで、AI モデルが達成すべき目標を明確にし、タスクを自律的に実行できるようにした
- ファイルの読み書き行うツールを作成し、ユーザーの許可を求めるようにした。

## 参考

- [cline/cline](https://github.com/cline/cline)
- [Vercel AI SDK と mastra を使った AI Agent 開発 Tips](https://zenn.dev/bm_sms/articles/vercel_ai_sdk_mastra_ai_agent)
- [CLINEに全部賭けろ](https://zenn.dev/mizchi/articles/all-in-on-cline)
