---
id: RKHskwOJHA5sKhRDvkJz7
title: "AWS Emulator で AWS SDK を使うコードをローカルでテストする"
slug: "aws-emulator-local-testing"
about: "AWS Emulator は AWS が公開した、AWS の API をローカルで再現するエミュレーターです。AWS API モデルをもとに AI エージェントが実装し、実際の AWS で検証したテストで忠実度を測っています。この記事では、AWS Emulator を Docker で起動し、AWS SDK for JavaScript v3 で DynamoDB を使うコードを Vitest からテストする手順を紹介します。"
createdAt: "2026-11-14T12:50+09:00"
updatedAt: "2026-11-14T12:50+09:00"
tags: ["AWS", "テスト"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1Uu8XZxx2YzdS7ciS8WHTi/5260f1a5e019e4bedf616ca7f6af3931/mille-crepe_23495-768x591.png"
  title: "ミルクレープケーキのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "AWS Emulator がまだ実装していない操作を呼び出したとき、どのような応答が返りますか？"
      answers:
        - text: "HTTP 200 とダミーの値が返り、要求は成功する"
          correct: false
          explanation: "記事では、それらしい値を返して成功するのではなく、テストがその場で失敗すると説明されています。"
        - text: "HTTP 400 と ValidationException が返る"
          correct: false
          explanation: "ValidationException は、短すぎる名前で DynamoDB のテーブルを作成したときのように、入力が制約を満たさないときに返るエラーとして紹介されています。"
        - text: "HTTP 501 と NotImplemented エラーが返る"
          correct: true
          explanation: "記事のとおり、未実装の操作は HTTP 501 と NotImplemented エラーを返すため、テストはその場で失敗します。"
        - text: "要求が本物の AWS へ転送され、AWS の応答が返る"
          correct: false
          explanation: "AWS Emulator は AWS アカウントを必要とせず、要求はローカルのエミュレーターが処理します。未実装の操作は AWS へ転送されず、エラーになります。"
    - question: "AWS Emulator の fidelity テストはどのようなものですか？"
      answers:
        - text: "エミュレーターの応答が速いかを測る負荷試験"
          correct: false
          explanation: "fidelity テストは応答の速さではなく、結果やエラーが AWS と一致するかを確かめるテストです。"
        - text: "API を呼び出した結果やエラーが、本物の AWS と一致するかを確かめるテスト"
          correct: true
          explanation: "記事のとおり、fidelity テストは AWS SDK で一連の API を呼び出し、結果、作成されたリソース、エラーコードとメッセージまで AWS と一致するかを確かめます。"
        - text: "IAM ポリシーが正しく設定されているかを確かめるセキュリティテスト"
          correct: false
          explanation: "fidelity テストは権限の設定を確かめるものではなく、API を呼び出した結果やエラーが AWS と一致するかを確かめるものです。"
        - text: "AI エージェントが AWS エミュレーターを正しく使えるかを確かめるテスト"
          correct: false
          explanation: "エージェントの能力を測るテストではありません。"
published: true
---
AWS の SDK を呼び出すコードをテストする方法には、いくつかの選択肢があります。SDK のクライアントをモックすればテストは速くなりますが、テーブル名の長さの制約や存在しないリソースへのアクセスといった、AWS 側で起きるエラーは再現されません。実際の AWS リソースでテストすれば挙動は正確ですが、リソースの作成を待つ時間や料金がかかり、CI に認証情報を渡す必要もあります。ローカルで AWS を再現するツールとして広く使われてきた LocalStack は、2026 年 3 月 23 日から[単一のイメージに統合され、最新版の利用に auth token が必要になりました](https://blog.localstack.cloud/localstack-single-image-next-steps/)。

2026 年 11 月 11 日、AWS は公式のローカルエミュレーターである [AWS Emulator](https://docs.aws.amazon.com/emulator/latest/userguide/what-is-service.html) を一般提供として公開しました。AWS Emulator は AWS アカウントを必要とせず、追加の料金もかかりません。SDK のエンドポイントを環境変数で切り替えるため、アプリケーションのコードを変更せずに使えます。

この記事では、AWS Emulator を Docker で起動し、AWS SDK for JavaScript v3 で DynamoDB を使うコードを Vitest からテストするまでの手順を紹介します。

## AWS Emulator とは

AWS Emulator は、AWS の API エンドポイントをローカルで提供する CLI です。起動すると `https://127.0.0.1:9297` で HTTPS の要求を待ち受け、AWS CLI や AWS SDK からの要求に AWS と同じ形式で応答します。対象は、[AWS API models リポジトリ](https://github.com/aws/api-models-aws)に API モデルがあるサービスです。AWS SDK と AWS Emulator は、どちらもこの API モデルをもとに作られています。[AWS News Blog](https://aws.amazon.com/blogs/aws/test-your-applications-against-aws-locally-with-aws-emulator/) によると、AWS Emulator は API モデルをもとに AI エージェントが実装と保守を行っており、テストの作成や変更のレビューもエージェントが担っています。

<details>
<summary>1 つの API モデルから作られる SDK とエミュレーター</summary>

AWS は各サービスの API を、[Smithy](https://smithy.io/) というインターフェース定義言語で記述しています。この記述を API モデルと呼び、AWS API models リポジトリで JSON 形式で公開しています。API モデルには、サービスが提供する操作、各操作の入力と出力、フィールドの型と制約、操作が返しうるエラー、通信のプロトコルが定義されています。

たとえば DynamoDB の API モデルでは、`CreateTable` 操作が次のように定義されています。

```json
{
  "type": "operation",
  "input": { "target": "com.amazonaws.dynamodb#CreateTableInput" },
  "output": { "target": "com.amazonaws.dynamodb#CreateTableOutput" },
  "errors": [
    { "target": "com.amazonaws.dynamodb#InternalServerError" },
    { "target": "com.amazonaws.dynamodb#InvalidEndpointException" },
    { "target": "com.amazonaws.dynamodb#LimitExceededException" },
    { "target": "com.amazonaws.dynamodb#ResourceInUseException" }
  ]
}
```

AWS SDK for JavaScript v3 の `CreateTableCommand` や `ResourceInUseException` クラスも、このモデルから自動生成されたコードです。SDK はモデルに従ってリクエストを組み立て、レスポンスを解釈します。AWS Emulator も同じ API モデルを仕様として作られています。

```text
              API モデル（Smithy）
          生成 ↙              ↘ 仕様として実装
  AWS SDK・AWS CLI  ── 要求 →  AWS Emulator
                   ← 応答 ──
```

SDK とエミュレーターが同じ定義をもとにしているため、要求の形式、フィールド名、エラーの種類がそろいます。たとえば、既存のテーブルを作成しようとしたときにエミュレーターが返す `ResourceInUseException` は、モデルに定義されたエラーです。そのため SDK は、AWS から返ったときと同じクラスの例外として扱えます。

ただし、API モデルが定義しているのは API の形であり、AWS の動作のすべてではありません。モデルに現れない動作を AWS とそろえるために fidelity テストが用意されています。

</details>

[Getting started](https://docs.aws.amazon.com/emulator/latest/userguide/getting-started.html) では AWS Emulator を使うために、次の 4 つの方法が紹介されています。この記事では Docker での起動を使います。

- Linux パッケージ: x86_64 または aarch64 の Linux に RPM か Debian パッケージをインストールし、`aws-emulator` コマンドを起動する
- Docker: Dockerfile からイメージをビルドしてコンテナで起動する。macOS と Windows ではこの方法を使う
- 埋め込みモード: AWS SDK for Rust を使うテストのプロセス内でエミュレーターを動かす。テストごとに状態が分かれる
- AI コーディングエージェント: `aws-emulator` スキルを入れたエージェントが、エミュレーターをインストールして起動し、SDK を接続する

### fidelity テストとスコア

[Fidelity in AWS Emulator](https://docs.aws.amazon.com/emulator/latest/userguide/fidelity.html) では、エミュレーターが AWS とどれだけ同じように動くかを fidelity（忠実度）と呼んでいます。fidelity テストは、AWS SDK で一連の API を呼び出し、結果、作成されたリソース、エラーの場合はエラーコードとメッセージまで AWS と一致するかを確かめる小さなプログラムです。

たとえば短すぎる名前で DynamoDB のテーブルを作成すると、AWS では `ValidationException` が返ります。しかし、この挙動は API モデルには定義されていません。fidelity テストでは、エミュレーターが同じ入力で同じエラーを返すかを確認し、API モデルに現れない挙動も AWS とそろえるようにしています。テストはエミュレーターがまだ合格していないものも含めて [aws-emulator-evaluation-suite](https://github.com/aws/aws-emulator-evaluation-suite) で公開されています。エミュレーターがまだ実装していない操作は、HTTP 501 と `NotImplemented` エラーを返します。

サービスごとの合格数（fidelity スコア）は、GitHub のリリースに `scores.json.gz` として添付されています。この記事で使った 1.0.353 のスコアは次のとおりです。

| サービス | 合格 | 不合格 | スキップ |
| --- | ---: | ---: | ---: |
| 全体（355 サービス、テスト 43,548 件） | 27,591 | 15,874 | 83 |
| Amazon DynamoDB | 1,499 | 635 | 8 |
| Amazon S3 | 2,021 | 807 | 17 |
| Amazon SQS | 1,154 | 372 | 10 |
| AWS Lambda | 1,853 | 1,144 | 24 |
| AWS CloudFormation | 916 | 3,345 | 21 |

[ユーザーガイド](https://docs.aws.amazon.com/emulator/latest/userguide/fidelity.html)によると、現時点で最も AWS に近いのは、リソースの作成、取得、更新、削除、一覧取得を担うコントロールプレーンの API です。S3 のオブジェクトの読み書きのような、サービス本来の機能を提供するデータプレーンの API や、CloudFormation、AWS CDK、Terraform といった IaC（Infrastructure as Code）ツールへの対応は、サービスによって差があります。上の表でも、CloudFormation の合格は 4,282 件中 916 件（約 21%）で、DynamoDB の 2,142 件中 1,499 件（約 70%）より低くなっています。

## Docker で AWS Emulator を起動する

macOS と Windows では、Docker でエミュレーターを起動します。AWS はビルド済みのイメージを公開していないため、[Getting started with Docker](https://docs.aws.amazon.com/emulator/latest/userguide/getting-started-docker.html) に従って、Linux パッケージをインストールするイメージを自分でビルドします。

空のディレクトリに `Dockerfile` を作成します。Apple silicon の Mac では Arm 用の `aws-emulator-aarch64.rpm` を指定します。x86_64 の環境では `aws-emulator-x86_64.rpm` に置き換えてください。

```dockerfile:Dockerfile
FROM public.ecr.aws/amazonlinux/amazonlinux:2023-minimal
ADD https://downloads.aws.com/aws-emulator/packages/aws-emulator/LTS/latest/aws-emulator-aarch64.rpm /tmp/aws-emulator.rpm
RUN rpm -i /tmp/aws-emulator.rpm && rm /tmp/aws-emulator.rpm \
    && mkdir -p /home/emulator && chown 1000 /home/emulator
USER 1000
ENV HOME=/home/emulator
EXPOSE 9297
ENTRYPOINT ["aws-emulator", "-b", "0.0.0.0"]
```

`-b 0.0.0.0` は、コンテナ内のすべてのアドレスで待ち受けるオプションです。Docker がポートを転送するために必要です。

イメージをビルドし、バージョンを確認します。

```bash
docker build -t aws-emulator .
docker run --rm aws-emulator -v
```

次のようにバージョン、リリース日、ビルド元のコミットが表示されます。

```text
Version: 1.0.353
Release date: 2026.11.14
Commit: ca8a89dedfa8e4b5e67a3c90dc736f921ba409a1
```

続いてコンテナを起動します。エミュレーターは認証情報と証明書を `~/.aws/emulator/` に書き出すため、先にこのディレクトリを作成し、コンテナと共有します。

```bash
mkdir -p ~/.aws/emulator
PORT=9297
# --memory, --memory-swap: メモリを 2 GiB に制限し、スワップを使わない
# -p 127.0.0.1:...: 自分のマシンにだけ公開する（-p 9297:9297 ではネットワーク全体に公開される）
# -e HOME: コンテナ内でもホストと同じパスを使い、config に書かれるパスをホストでも有効にする
# -v: エミュレーターが生成した認証情報と証明書をホストから読めるようにする
docker run --rm --memory=2g --memory-swap=2g -p 127.0.0.1:$PORT:$PORT \
  -e HOME="$HOME" -v "$HOME/.aws/emulator:$HOME/.aws/emulator" \
  aws-emulator -p $PORT
```

イメージ名 `aws-emulator` より後ろに書いたオプションは、エミュレーターに渡されます。たとえばテレメトリーを送信しない場合は `--telemetry off` を追加します。

起動すると、ログが 1 行ずつ JSON で出力されます。

```json
{
  "message": "emulator server information",
  "endpoint_url": "https://127.0.0.1:9297",
  "health_check_url": "https://127.0.0.1:9297/__admin/health",
  "config_file": "/Users/you/.aws/emulator/9297/config",
  "ca_file": "/Users/you/.aws/emulator/9297/ca.pem",
  "java_truststore_file": "/Users/you/.aws/emulator/9297/truststore.p12"
}
```

`~/.aws/emulator/9297/` には次のファイルが作成されます。どれもエミュレーターを正常に停止すると削除されます。

| ファイル | 内容 |
| --- | --- |
| `emulator_credentials` | この起動のためにエミュレーターが生成したアクセスキー ID とシークレットアクセスキー |
| `config` | `region`、`endpoint_url`、`ca_bundle` を設定した `[default]` プロファイル |
| `ca.pem` | エミュレーターが HTTPS で使う自己署名証明書 |
| `truststore.p12` | Java 用に同じ証明書を格納したトラストストア |

別のターミナルでヘルスチェックの URL を呼び出し、`ok` が返れば起動は完了しています。

```bash
curl --cacert ~/.aws/emulator/9297/ca.pem https://127.0.0.1:9297/__admin/health
```

## AWS SDK を AWS Emulator に向ける

AWS Emulator は、起動するたびに新しいアクセスキーと証明書を生成し、デフォルトでは SigV4（Signature Version 4）で署名された要求だけを受け付けます。SigV4 は、AWS の API に送る要求をアクセスキーで署名する方式です。[Pointing your AWS SDK at AWS Emulator](https://docs.aws.amazon.com/emulator/latest/userguide/point-sdk-to-emulator.html) では、署名を確認する理由として、Web ページや他のローカルプログラムがユーザーの知らないうちにエミュレーターへ要求を送るのを防ぐことを挙げています。

SDK をエミュレーターへ向けるには、エンドポイント、認証情報、証明書を環境変数で指定します。次の内容で `emulator.env.sh` を作成します。

```bash:emulator.env.sh
PORT=9297
export AWS_ENDPOINT_URL=https://127.0.0.1:$PORT
export AWS_SHARED_CREDENTIALS_FILE=~/.aws/emulator/$PORT/emulator_credentials
export AWS_CONFIG_FILE=~/.aws/emulator/$PORT/config
export AWS_CA_BUNDLE=~/.aws/emulator/$PORT/ca.pem
export AWS_EC2_METADATA_DISABLED=true
export AWS_DISABLE_HOST_PREFIX_INJECTION=true
export AWS_REGION=us-east-1
export AWS_DEFAULT_REGION=us-east-1
# AWS SDK for JavaScript v3 は AWS_CA_BUNDLE を読まないため、Node.js に証明書を追加する
export NODE_EXTRA_CA_CERTS=~/.aws/emulator/$PORT/ca.pem
unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN AWS_PROFILE
```

主な環境変数の役割は次のとおりです。

- `AWS_ENDPOINT_URL`: すべてのサービスの要求をエミュレーターへ送る
- `AWS_SHARED_CREDENTIALS_FILE` と `AWS_CONFIG_FILE`: エミュレーターが生成した認証情報と設定ファイルを読み込ませる。普段使っている `~/.aws/config` の設定は、このシェルでは使われなくなる
- `AWS_EC2_METADATA_DISABLED`: EC2 インスタンス上でテストしたときに、インスタンスメタデータから本物の認証情報を取得しないようにする
- `AWS_DISABLE_HOST_PREFIX_INJECTION`: AWS CLI と Python 用 SDK（Boto3）が、一部の操作でホスト名に `data-` などの接頭辞を付けないようにする。接頭辞が付くと `data-127.0.0.1` のような存在しないホストへ要求が送られる
- `NODE_EXTRA_CA_CERTS`: Node.js が信頼する証明書にエミュレーターの `ca.pem` を追加する

最後の `unset` は、本物の AWS の認証情報を環境から取り除きます。環境変数の認証情報は認証情報ファイルより優先されるため、残っていると SDK は本物の認証情報で署名してしまいます。

### プロジェクトを作成して接続を確認する

Node.js のプロジェクトを作成し、AWS SDK と Vitest をインストールします。

```bash
npm init -y
npm pkg set type=module scripts.test="vitest run"
npm install @aws-sdk/client-dynamodb@3.1166.0 @aws-sdk/lib-dynamodb@3.1166.0 @aws-sdk/client-sts@3.1166.0
npm install -D vitest@5.1.0 typescript
```

接続先がエミュレーターかどうかは、AWS STS の `GetCallerIdentity` で確認できます。エミュレーターはアカウント `000000000000` として振る舞うため、返ってきたアカウント ID を見れば接続先がわかります。

```bash
source ./emulator.env.sh
node -e '
const { STSClient, GetCallerIdentityCommand } = require("@aws-sdk/client-sts");
new STSClient({}).send(new GetCallerIdentityCommand({})).then((r) => console.log(r.Account, r.Arn));
'
```

次のように表示されれば、SDK はエミュレーターに接続しています。

```text
000000000000 arn:aws:iam::000000000000:user/emulator
```

## DynamoDB を使うコードをテストする

DynamoDB に Todo を保存して取得するモジュールを作成します。コード自体はエミュレーターの有無に関係なく書けます。

```ts:src/todo-repository.ts
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

export type Todo = {
  id: string;
  title: string;
  done: boolean;
};

// 接続先は環境変数と設定ファイルから決まるため、endpoint も credentials も渡さない
const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export async function saveTodo(tableName: string, todo: Todo): Promise<void> {
  await client.send(new PutCommand({ TableName: tableName, Item: todo }));
}

export async function findTodo(
  tableName: string,
  id: string,
): Promise<Todo | undefined> {
  const { Item } = await client.send(
    new GetCommand({ TableName: tableName, Key: { id } }),
  );
  return Item as Todo | undefined;
}
```

続いてテストを作成します。`beforeAll` でテーブルを作成し、保存と取得、存在しない ID を取得したときの戻り値を確認します。テーブル名には実行ごとに一意な名前を使い、`afterAll` でテーブルを削除します。

```ts:src/todo-repository.test.ts
import { randomUUID } from "node:crypto";
import {
  CreateTableCommand,
  DeleteTableCommand,
  DynamoDBClient,
  waitUntilTableExists,
} from "@aws-sdk/client-dynamodb";
import { GetCallerIdentityCommand, STSClient } from "@aws-sdk/client-sts";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { findTodo, saveTodo } from "./todo-repository";

const dynamodb = new DynamoDBClient({});
// エミュレーターは起動中のリソースを保持するため、実行ごとに一意なテーブル名を使う
const tableName = `todos-${randomUUID()}`;

beforeAll(async () => {
  // 誤って本物の AWS アカウントでテストしないよう、エミュレーターの固定アカウントか確認する
  const identity = await new STSClient({}).send(new GetCallerIdentityCommand({}));
  expect(identity.Account).toBe("000000000000");

  await dynamodb.send(
    new CreateTableCommand({
      TableName: tableName,
      AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      BillingMode: "PAY_PER_REQUEST",
    }),
  );
  await waitUntilTableExists(
    { client: dynamodb, maxWaitTime: 30 },
    { TableName: tableName },
  );
});

afterAll(async () => {
  await dynamodb.send(new DeleteTableCommand({ TableName: tableName }));
});

describe("todo-repository", () => {
  test("保存した Todo を取得できる", async () => {
    await saveTodo(tableName, { id: "1", title: "牛乳を買う", done: false });

    await expect(findTodo(tableName, "1")).resolves.toEqual({
      id: "1",
      title: "牛乳を買う",
      done: false,
    });
  });

  test("存在しない ID では undefined を返す", async () => {
    await expect(findTodo(tableName, "not-found")).resolves.toBeUndefined();
  });
});
```

`beforeAll` の最初でアカウント ID を確認しているのは、環境変数の設定漏れで本物の AWS にテーブルを作成してしまうのを防ぐためです。

環境変数を読み込んでからテストを実行します。

```bash
source ./emulator.env.sh
npm test -- --reporter=verbose
```

テストが成功していることが確認できます。

```text
 ✓ src/todo-repository.test.ts > todo-repository > 保存した Todo を取得できる 60ms
 ✓ src/todo-repository.test.ts > todo-repository > 存在しない ID では undefined を返す 3ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
```

エミュレーターのログには、テーブルを作成した操作が JSON で記録されます。主な項目を抜き出すと次のとおりです。

```json
{
  "message": "table created",
  "operation": "CreateTable",
  "table_name": "todos-fb46292b-391c-46e9-bf58-cebeb7f42a1c",
  "billing_mode": "PAY_PER_REQUEST",
  "outcome": "created"
}
```

## まとめ

- AWS Emulator は AWS が 2026 年 11 月に一般提供を開始したローカルエミュレーターで、AWS アカウントと追加料金なしで AWS の API を `https://127.0.0.1:9297` から提供する
- AWS Emulator は AWS SDK と同じ API モデルをもとに作られており、AI エージェントが実装と保守を行っている
- AWS と同じ結果とエラーを返すかを fidelity テストで測り、サービスごとの合格数をリリースごとに公開している。1.0.353 では 43,548 件中 27,591 件が合格し、CloudFormation の合格は 4,282 件中 916 件にとどまる
- 未実装の操作は HTTP 501 の `NotImplemented` を返すため、テストはその場で失敗する
- macOS では、Linux パッケージをインストールする Docker イメージを自分でビルドし、ポートを `127.0.0.1` にだけ公開して起動する
- エミュレーターは起動のたびにアクセスキーと証明書を `~/.aws/emulator/<ポート>/` に生成し、デフォルトでは SigV4 で署名された要求だけを受け付ける
- `AWS_ENDPOINT_URL` などの環境変数を設定すれば、エンドポイントや認証情報を指定していない SDK のコードがそのままエミュレーターに接続する。AWS SDK for JavaScript v3 では `NODE_EXTRA_CA_CERTS` で証明書を追加する
- DynamoDB のテーブル名の長さの制約のように API モデルに定義されていない挙動も、fidelity テストで AWS とそろえられている
- エミュレーターは起動中に作成したリソースを保持するため、テストでは実行ごとに一意なテーブル名を使い、誤って本物の AWS に接続していないかをアカウント ID で確認する

## 参考

- [What is AWS Emulator? - AWS Emulator](https://docs.aws.amazon.com/emulator/latest/userguide/what-is-service.html)
- [Test your applications against AWS locally with AWS Emulator | AWS News Blog](https://aws.amazon.com/blogs/aws/test-your-applications-against-aws-locally-with-aws-emulator/)
- [aws/aws-emulator - GitHub](https://github.com/aws/aws-emulator)
