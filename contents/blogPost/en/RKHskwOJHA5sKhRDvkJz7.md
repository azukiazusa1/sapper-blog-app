---
id: RKHskwOJHA5sKhRDvkJz7
title: "Testing Code That Uses the AWS SDK Locally with AWS Emulator"
slug: "aws-emulator-local-testing"
about: "AWS Emulator is AWS's official local emulator of the AWS APIs, built by AI agents from the AWS API models. This article runs it in Docker and tests DynamoDB code written with the AWS SDK for JavaScript v3 using Vitest."
createdAt: "2026-11-14T12:50+09:00"
updatedAt: "2026-11-14T12:50+09:00"
tags: ["AWS", "testing"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1Uu8XZxx2YzdS7ciS8WHTi/5260f1a5e019e4bedf616ca7f6af3931/mille-crepe_23495-768x591.png"
  title: "ミルクレープケーキのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "What response do you get when you call an operation that AWS Emulator doesn't implement yet?"
      answers:
        - text: "HTTP 200 with dummy values, and the request succeeds"
          correct: false
          explanation: "The article explains that instead of returning plausible values and succeeding, the test fails right away."
        - text: "HTTP 400 with a ValidationException"
          correct: false
          explanation: "ValidationException is introduced as the error returned when input doesn't satisfy a constraint, such as creating a DynamoDB table with a name that's too short."
        - text: "HTTP 501 with a NotImplemented error"
          correct: true
          explanation: "As the article explains, unimplemented operations return HTTP 501 with a NotImplemented error, so the test fails right away."
        - text: "The request is forwarded to real AWS, and the AWS response is returned"
          correct: false
          explanation: "AWS Emulator doesn't need an AWS account, and requests are handled by the local emulator. Unimplemented operations aren't forwarded to AWS; they return an error."
    - question: "What is an AWS Emulator fidelity test?"
      answers:
        - text: "A load test that measures how fast the emulator responds"
          correct: false
          explanation: "Fidelity tests don't measure response speed. They check whether the results and errors match AWS."
        - text: "A test that checks whether the results and errors of API calls match real AWS"
          correct: true
          explanation: "As the article explains, a fidelity test calls a series of APIs with an AWS SDK and checks that the results, the created resources, and even the error codes and messages match AWS."
        - text: "A security test that checks whether IAM policies are configured correctly"
          correct: false
          explanation: "Fidelity tests don't check permission settings. They check whether the results and errors of API calls match AWS."
        - text: "A test that checks whether AI agents can use the AWS emulator correctly"
          correct: false
          explanation: "It isn't a test that measures an agent's abilities."

published: true
---

There are several ways to test code that calls the AWS SDK. Mocking the SDK client keeps tests fast, but it doesn't reproduce errors that happen on the AWS side, such as table name length constraints or access to resources that don't exist. Testing against real AWS resources gives accurate behavior, but you pay for the resources, wait for them to be created, and have to pass credentials to CI. LocalStack, which has been widely used to reproduce AWS locally, [was consolidated into a single image on March 23, 2026, and now requires an auth token to use the latest version](https://blog.localstack.cloud/localstack-single-image-next-steps/).

On November 11, 2026, AWS made [AWS Emulator](https://docs.aws.amazon.com/emulator/latest/userguide/what-is-service.html), its official local emulator, generally available. AWS Emulator doesn't require an AWS account and has no additional charge. You switch the SDK endpoint with environment variables, so you can use it without changing your application code.

This article walks through starting AWS Emulator in Docker and testing code that uses DynamoDB with the AWS SDK for JavaScript v3 from Vitest.

## What is AWS Emulator?

AWS Emulator is a CLI that serves AWS API endpoints locally. Once started, it listens for HTTPS requests on `https://127.0.0.1:9297` and responds to requests from the AWS CLI and AWS SDKs in the same format as AWS. It covers the services that have an API model in the [AWS API models repository](https://github.com/aws/api-models-aws). Both the AWS SDKs and AWS Emulator are built from these API models. According to the [AWS News Blog](https://aws.amazon.com/blogs/aws/test-your-applications-against-aws-locally-with-aws-emulator/), AI agents implement and maintain AWS Emulator based on the API models, and agents also write the tests and review the changes.

<details>
<summary>An SDK and an emulator built from the same API model</summary>

AWS describes each service's API in [Smithy](https://smithy.io/), an interface definition language. These descriptions are called API models, and AWS publishes them in JSON in the AWS API models repository. An API model defines the operations a service provides, the input and output of each operation, field types and constraints, the errors an operation can return, and the communication protocol.

For example, the DynamoDB API model defines the `CreateTable` operation as follows.

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

The `CreateTableCommand` and `ResourceInUseException` classes in the AWS SDK for JavaScript v3 are code generated from this model. The SDK builds requests and parses responses according to the model. AWS Emulator is also built using the same API model as its specification.

```text
              API model (Smithy)
    generated ↙              ↘ implemented as spec
  AWS SDK / AWS CLI ── request →  AWS Emulator
                    ← response ──
```

Because the SDK and the emulator share the same definition, request formats, field names, and error types line up. For example, the `ResourceInUseException` that the emulator returns when you try to create a table that already exists is an error defined in the model. So the SDK can handle it as the same exception class it would use for a response from AWS.

However, an API model defines the shape of an API, not everything AWS does. Fidelity tests exist to align the behavior that doesn't appear in the model with AWS.

</details>

The [Getting started](https://docs.aws.amazon.com/emulator/latest/userguide/getting-started.html) guide describes four ways to use AWS Emulator. This article uses Docker.

- Linux package: Install the RPM or Debian package on x86_64 or aarch64 Linux and run the `aws-emulator` command
- Docker: Build an image from a Dockerfile and run it in a container. Use this method on macOS and Windows
- Embedded mode: Run the emulator inside the process of tests that use the AWS SDK for Rust. Each test gets its own state
- AI coding agent: An agent with the `aws-emulator` skill installs and starts the emulator and connects your SDK to it

### Fidelity tests and scores

[Fidelity in AWS Emulator](https://docs.aws.amazon.com/emulator/latest/userguide/fidelity.html) uses the term fidelity for how closely the emulator behaves like AWS. A fidelity test is a small program that calls a series of APIs with an AWS SDK and checks that the results, the created resources, and, for errors, even the error codes and messages match AWS.

For example, if you create a DynamoDB table with a name that's too short, AWS returns a `ValidationException`. However, this behavior isn't defined in the API model. Fidelity tests check that the emulator returns the same error for the same input, aligning even behavior that doesn't appear in the API model with AWS. The tests are published in [aws-emulator-evaluation-suite](https://github.com/aws/aws-emulator-evaluation-suite), including the ones the emulator doesn't pass yet. Operations that the emulator doesn't implement yet return HTTP 501 with a `NotImplemented` error.

The number of passing tests for each service (the fidelity score) is attached to each GitHub release as `scores.json.gz`. The scores for 1.0.353, the version used in this article, are as follows.

| Service | Passed | Failed | Skipped |
| --- | ---: | ---: | ---: |
| Total (355 services, 43,548 tests) | 27,591 | 15,874 | 83 |
| Amazon DynamoDB | 1,499 | 635 | 8 |
| Amazon S3 | 2,021 | 807 | 17 |
| Amazon SQS | 1,154 | 372 | 10 |
| AWS Lambda | 1,853 | 1,144 | 24 |
| AWS CloudFormation | 916 | 3,345 | 21 |

According to the [user guide](https://docs.aws.amazon.com/emulator/latest/userguide/fidelity.html), the emulator currently matches AWS most closely for control plane APIs, which create, read, update, delete, and list resources. Fidelity for data plane APIs, which provide a service's primary function such as reading and writing S3 objects, and support for IaC (Infrastructure as Code) tools such as CloudFormation, the AWS CDK, and Terraform, varies by service. The table above reflects this too: CloudFormation passes 916 of 4,282 tests (about 21%), lower than DynamoDB's 1,499 of 2,142 (about 70%).

## Starting AWS Emulator in Docker

On macOS and Windows, you run the emulator in Docker. AWS doesn't publish a prebuilt image, so following [Getting started with Docker](https://docs.aws.amazon.com/emulator/latest/userguide/getting-started-docker.html), you build an image yourself that installs the Linux package.

Create a `Dockerfile` in an empty directory. On a Mac with Apple silicon, specify the Arm package `aws-emulator-aarch64.rpm`. On x86_64, replace it with `aws-emulator-x86_64.rpm`.

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

`-b 0.0.0.0` makes the emulator listen on all addresses inside the container. Docker needs this to forward the port.

Build the image and check the version.

```bash
docker build -t aws-emulator .
docker run --rm aws-emulator -v
```

The version, release date, and the commit it was built from are displayed as follows.

```text
Version: 1.0.353
Release date: 2026.11.14
Commit: ca8a89dedfa8e4b5e67a3c90dc736f921ba409a1
```

Next, start the container. The emulator writes its credentials and certificate to `~/.aws/emulator/`, so create this directory first and share it with the container.

```bash
mkdir -p ~/.aws/emulator
PORT=9297
# --memory, --memory-swap: limit memory to 2 GiB with no swap
# -p 127.0.0.1:...: expose the port only to your own machine (-p 9297:9297 exposes it to your whole network)
# -e HOME: use the same paths in the container as on the host, so the paths written to config also work on the host
# -v: let the host read the credentials and certificate that the emulator generates
docker run --rm --memory=2g --memory-swap=2g -p 127.0.0.1:$PORT:$PORT \
  -e HOME="$HOME" -v "$HOME/.aws/emulator:$HOME/.aws/emulator" \
  aws-emulator -p $PORT
```

Options written after the image name `aws-emulator` are passed to the emulator. For example, to stop sending telemetry, add `--telemetry off`.

Once started, the emulator writes its log as JSON, one object per line.

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

The following files are created in `~/.aws/emulator/9297/`. All of them are deleted when the emulator stops cleanly.

| File | Contents |
| --- | --- |
| `emulator_credentials` | The access key ID and secret access key that the emulator generated for this run |
| `config` | A `[default]` profile that sets `region`, `endpoint_url`, and `ca_bundle` |
| `ca.pem` | The self-signed certificate that the emulator uses for HTTPS |
| `truststore.p12` | A trust store for Java containing the same certificate |

In another terminal, call the health check URL. If it returns `ok`, the emulator is ready.

```bash
curl --cacert ~/.aws/emulator/9297/ca.pem https://127.0.0.1:9297/__admin/health
```

## Pointing the AWS SDK at AWS Emulator

AWS Emulator generates a new access key and certificate each time it starts, and by default accepts only requests signed with SigV4 (Signature Version 4). SigV4 is the scheme for signing requests to AWS APIs with an access key. [Pointing your AWS SDK at AWS Emulator](https://docs.aws.amazon.com/emulator/latest/userguide/point-sdk-to-emulator.html) gives the reason for checking signatures: it prevents web pages or other local programs from sending requests to the emulator without your knowledge.

To point the SDK at the emulator, specify the endpoint, credentials, and certificate with environment variables. Create `emulator.env.sh` with the following content.

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
# The AWS SDK for JavaScript v3 doesn't read AWS_CA_BUNDLE, so add the certificate to Node.js
export NODE_EXTRA_CA_CERTS=~/.aws/emulator/$PORT/ca.pem
unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN AWS_PROFILE
```

Here's what the main environment variables do.

- `AWS_ENDPOINT_URL`: Sends requests for every service to the emulator
- `AWS_SHARED_CREDENTIALS_FILE` and `AWS_CONFIG_FILE`: Load the credentials and config file that the emulator generated. The settings in your usual `~/.aws/config` no longer apply in this shell
- `AWS_EC2_METADATA_DISABLED`: Prevents the SDK from getting real credentials from instance metadata when you run tests on an EC2 instance
- `AWS_DISABLE_HOST_PREFIX_INJECTION`: Stops the AWS CLI and the AWS SDK for Python (Boto3) from adding prefixes such as `data-` to the host name for some operations. With a prefix, requests go to a host that doesn't exist, such as `data-127.0.0.1`
- `NODE_EXTRA_CA_CERTS`: Adds the emulator's `ca.pem` to the certificates that Node.js trusts

The final `unset` removes real AWS credentials from the environment. Credentials in environment variables take precedence over the credentials file, so if they remain, the SDK signs requests with your real credentials.

### Creating a project and checking the connection

Create a Node.js project and install the AWS SDK and Vitest.

```bash
npm init -y
npm pkg set type=module scripts.test="vitest run"
npm install @aws-sdk/client-dynamodb@3.1166.0 @aws-sdk/lib-dynamodb@3.1166.0 @aws-sdk/client-sts@3.1166.0
npm install -D vitest@5.1.0 typescript
```

You can check whether you're connected to the emulator with AWS STS `GetCallerIdentity`. The emulator acts as account `000000000000`, so the returned account ID tells you where you're connected.

```bash
source ./emulator.env.sh
node -e '
const { STSClient, GetCallerIdentityCommand } = require("@aws-sdk/client-sts");
new STSClient({}).send(new GetCallerIdentityCommand({})).then((r) => console.log(r.Account, r.Arn));
'
```

If you see the following output, the SDK is connected to the emulator.

```text
000000000000 arn:aws:iam::000000000000:user/emulator
```

## Testing code that uses DynamoDB

Create a module that saves and retrieves Todos in DynamoDB. The code itself can be written the same way whether or not you use the emulator.

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

// The endpoint comes from environment variables and the config file, so pass neither endpoint nor credentials
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

Next, write the tests. `beforeAll` creates the table, and the tests check saving and retrieving a Todo and the return value for an ID that doesn't exist. The table gets a unique name for each run, and `afterAll` deletes it.

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
// The emulator keeps resources while it runs, so use a unique table name for each run
const tableName = `todos-${randomUUID()}`;

beforeAll(async () => {
  // Check for the emulator's fixed account so the tests never run against a real AWS account by mistake
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
  test("retrieves a saved Todo", async () => {
    await saveTodo(tableName, { id: "1", title: "Buy milk", done: false });

    await expect(findTodo(tableName, "1")).resolves.toEqual({
      id: "1",
      title: "Buy milk",
      done: false,
    });
  });

  test("returns undefined for an ID that doesn't exist", async () => {
    await expect(findTodo(tableName, "not-found")).resolves.toBeUndefined();
  });
});
```

The account ID check at the start of `beforeAll` prevents you from creating a table in real AWS when an environment variable is missing.

Load the environment variables, then run the tests.

```bash
source ./emulator.env.sh
npm test -- --reporter=verbose
```

You can see that the tests pass.

```text
 ✓ src/todo-repository.test.ts > todo-repository > retrieves a saved Todo 60ms
 ✓ src/todo-repository.test.ts > todo-repository > returns undefined for an ID that doesn't exist 3ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
```

The emulator's log records the table creation as JSON. Here are the main fields.

```json
{
  "message": "table created",
  "operation": "CreateTable",
  "table_name": "todos-fb46292b-391c-46e9-bf58-cebeb7f42a1c",
  "billing_mode": "PAY_PER_REQUEST",
  "outcome": "created"
}
```

## Summary

- AWS Emulator is a local emulator that AWS made generally available in November 2026. It serves AWS APIs at `https://127.0.0.1:9297` with no AWS account and no additional charge
- AWS Emulator is built from the same API models as the AWS SDKs, and AI agents implement and maintain it
- Fidelity tests measure whether it returns the same results and errors as AWS, and the number of passing tests per service is published with each release. In 1.0.353, 27,591 of 43,548 tests pass, while CloudFormation passes only 916 of 4,282
- Unimplemented operations return HTTP 501 `NotImplemented`, so tests fail right away
- On macOS, you build a Docker image that installs the Linux package yourself and start it with the port exposed only on `127.0.0.1`
- Each time the emulator starts, it generates an access key and certificate in `~/.aws/emulator/<port>/`, and by default it accepts only requests signed with SigV4
- With environment variables such as `AWS_ENDPOINT_URL` set, SDK code that doesn't specify an endpoint or credentials connects to the emulator as is. With the AWS SDK for JavaScript v3, add the certificate with `NODE_EXTRA_CA_CERTS`
- Fidelity tests also align behavior that isn't defined in the API model, such as the DynamoDB table name length constraint, with AWS
- The emulator keeps the resources you create while it runs, so tests use a unique table name for each run and check the account ID to make sure they aren't connected to real AWS by mistake

## References

- [What is AWS Emulator? - AWS Emulator](https://docs.aws.amazon.com/emulator/latest/userguide/what-is-service.html)
- [Test your applications against AWS locally with AWS Emulator | AWS News Blog](https://aws.amazon.com/blogs/aws/test-your-applications-against-aws-locally-with-aws-emulator/)
- [aws/aws-emulator - GitHub](https://github.com/aws/aws-emulator)
