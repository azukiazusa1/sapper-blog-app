---
id: gTOU4j3CRSJejWEQUu0XS
title: "Receiving MCP Server Events via Webhooks with AI SDK's MCP Events Support"
slug: "ai-sdk-mcp-events"
about: "MCP Events is an experimental extension that lets MCP servers notify subscribers of events via poll, push, or webhook delivery. This article gives an overview, then uses AI SDK's webhook support to subscribe, receive events, refresh, and unsubscribe."
createdAt: "2026-10-24T21:50+09:00"
updatedAt: "2026-10-24T21:50+09:00"
tags: ["MCP", "AI SDK"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/K4CKh0jgHGQH8eXXqADmU/3fa90cffef6dc212bd1efcc0c7f754e4/fish_aji_osashimi_15754-768x591.png"
  title: "アジのお刺身のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "In the article's sample, why does the webhook endpoint use express.raw() instead of express.json()?"
      answers:
        - text: "Signature verification needs the raw bytes as received, and parsing the body as JSON and re-serializing it no longer matches them"
          correct: true
          explanation: "As the article explains, the Standard Webhooks signature is computed over the received body bytes, so verification fails against a re-serialized string."
        - text: "MCP Events sends events in a binary format rather than JSON"
          correct: false
          explanation: "Events and control messages are POSTed as JSON with content-type: application/json."
        - text: "express.json() strips the mcp_event_subscription query parameter"
          correct: false
          explanation: "Body parsers don't touch query parameters. The sample passes req.originalUrl so the handler receives the query parameter as is."
        - text: "express.raw() automatically responds to the challenge"
          correct: false
          explanation: "The handler created by experimental_createMCPEventWebhook responds to the challenge. express.raw() only hands over the body as a Buffer."

published: true
---

Model Context Protocol (MCP) tools let a client ask a server to do something. The opposite direction has been harder: for a client to learn that something happened on the server side, it had to call a tool periodically or keep a connection open and wait for notifications. That isn't enough for agents that need to react to events such as a new Slack message or a PagerDuty incident.

To address this, the MCP Triggers & Events Working Group has proposed an extension called MCP Events. Vercel's AI SDK (`@ai-sdk/mcp`) added experimental support for the webhook mode of MCP Events in October 2026.

This article gives an overview of MCP Events and then uses AI SDK to subscribe to events, receive them through a webhook, and refresh and remove the subscription.

:::warning
As of October 23, 2026, MCP Events is not an official specification. [SEP-3415](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/3415), which turns the design draft into an SEP (Specification Enhancement Proposal), is still under review. The AI SDK APIs are also experimental, prefixed with `experimental_`, and may change in the future.
:::

## What Is MCP Events?

[MCP Events](https://github.com/modelcontextprotocol/experimental-ext-triggers-events/blob/main/docs/design-sketch-proposal.md) is an extension that lets an MCP client subscribe to things that happen in upstream systems and receive notifications from the server when they occur. The design draft states its goal as letting agents react to events even when the user isn't around.

The server exposes the event types it offers through `events/list`. Each event has the following fields:

- `name`: An event name such as `incident.created`
- `inputSchema`: The JSON Schema for the arguments passed when subscribing. It has the same shape as a tool's `inputSchema`
- `payloadSchema`: The JSON Schema for the `data` of delivered events
- `delivery`: An array of supported delivery modes

The client subscribes with a pair of `name` and `arguments` and receives events shaped like `{ eventId, name, timestamp, data, cursor }`.

### Three Delivery Modes

MCP Events defines three delivery modes. The server declares which modes each event supports.

| Mode    | Method             | How it works                                                                                                  |
| ------- | ------------------ | ------------------------------------------------------------------------------------------------------------- |
| poll    | `events/poll`      | The client passes a cursor and queries periodically. The server tells it when to poll next with `nextPollMs` |
| push    | `events/stream`    | The server sends `notifications/events/event` over a long-lived request                                       |
| webhook | `events/subscribe` | The client registers a callback URL, and the server POSTs signed events to it                                 |

The client stores the last cursor it received. When it passes that cursor on reconnect or when refreshing a subscription, the server resumes delivery from that position.

### The Webhook Mode Flow

AI SDK only supports webhook mode, so let's look at its flow in detail.

1. The client sends the event name, arguments, callback URL, and a signing secret with `events/subscribe`
2. If the pair of authenticated principal and callback URL hasn't been verified yet, the server POSTs `{"type":"verification","challenge":"..."}`. The receiver echoes the `challenge` back to show it agrees to receive deliveries
3. Once verification succeeds, the server returns a subscription ID, `refreshBefore` (the subscription's expiry), `cursor`, and `truncated`
4. Each time an event occurs, the server POSTs a signed request to the callback URL
5. Before `refreshBefore`, the client resends the same `events/subscribe` to extend the subscription. When it's no longer needed, the client removes it with `events/unsubscribe`. A subscription that isn't extended expires and disappears

Besides events, the callback URL also receives two kinds of control messages. `{"type":"gap"}` indicates that some events couldn't be replayed and were lost. `{"type":"terminated"}` indicates that the server ended the subscription, for example because permissions were revoked.

## Subscribing to MCP Events with AI SDK

AI SDK added support for the webhook mode of MCP Events in [vercel/ai#22155](https://github.com/vercel/ai/pull/22155). The pull request description cites OpenAI [adding MCP Events support to ChatGPT](https://developers.openai.com/plugins/build/mcp-events) as background.

AI SDK's MCP Events support consists of three parts:

- `client.experimental_events`: Call `list()`, `subscribe()`, `refresh()`, and `unsubscribe()` on a client created with `createMCPClient`
- `experimental_createMCPEventWebhook`: Creates a webhook handler that responds to challenges, verifies signatures, and passes verified events to your callbacks
- `Experimental_MCPEventStore`: A store that holds the subscription ID, callback URL, secret, and cursor. The MCP client and the webhook handler share the same store

The store is an AI SDK concept that doesn't exist in the MCP specification. The webhook handler needs to read the secret generated by the client to verify signatures, so the two need a shared place to keep it.

### Sample Structure

From here, we'll build an MCP server that offers a `comment.created` event and a client that subscribes to it with AI SDK. As of October 23, 2026, I couldn't find a public MCP server that supports MCP Events, so we'll write the server ourselves as well. The server is based on [AI SDK's official example](https://github.com/vercel/ai/tree/main/examples/mcp/src/events).

Create a project and install the dependencies.

```bash
mkdir ai-sdk-mcp-events && cd ai-sdk-mcp-events
npm init -y
npm pkg set type=module
npm install @ai-sdk/mcp@2.0.80 @modelcontextprotocol/server@2.3.1 @modelcontextprotocol/node@2.1.1 express@5.3.0 zod@4.6.7
npm install -D tsx @types/express @types/node
```

We'll create the following three files:

```
src/
├── server.ts  # MCP server that delivers comment.created via webhook
├── store.ts   # Subscription store for AI SDK
└── client.ts  # Application that subscribes and receives webhooks
```

### Implementing the MCP Server

First, let's build an MCP server that supports MCP Events. We use the TypeScript SDK's `setRequestHandler` to register `events/*` as custom request handlers.

```ts:src/server.ts
import {
  McpServer,
  createMcpHandler,
  ProtocolError,
  type ServerCapabilities,
} from "@modelcontextprotocol/server";
import { toNodeHandler } from "@modelcontextprotocol/node";
import {
  createHash,
  createHmac,
  randomUUID,
  timingSafeEqual,
} from "node:crypto";
import express from "express";
import * as z from "zod/v4";

const token = process.env.MCP_EVENTS_TOKEN ?? "local-events-demo";
const RECEIVER_ORIGIN = "http://127.0.0.1:3003";
const MAX_TTL_MS = 60_000;
// Prefix used by Standard Webhooks signing secrets
const SECRET_PREFIX = "whsec" + "_";

type Subscription = {
  id: string;
  documentId: string;
  url: string;
  secret: string;
  expiresAt: number;
};
const subscriptions = new Map<string, Subscription>();

const argumentsSchema = z.object({ document_id: z.string() }).strict();
const eventDefinition = {
  name: "comment.created",
  description: "ドキュメントに新しいコメントが投稿されたときに発生します",
  delivery: ["webhook"],
  inputSchema: z.toJSONSchema(argumentsSchema),
  payloadSchema: {
    type: "object",
    properties: {
      document_id: { type: "string" },
      text: { type: "string" },
    },
    required: ["document_id", "text"],
  },
};

// POST with a Standard Webhooks signature
async function deliver(
  subscription: Subscription,
  webhookId: string,
  body: unknown,
) {
  // This demo only delivers to the loopback receiver (a real server needs SSRF protection at delivery time)
  const url = new URL(subscription.url);
  if (url.origin !== RECEIVER_ORIGIN) {
    throw new Error(`This demo only delivers to ${RECEIVER_ORIGIN}`);
  }
  const payload = JSON.stringify(body);
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = createHmac(
    "sha256",
    Buffer.from(subscription.secret.slice(SECRET_PREFIX.length), "base64"),
  )
    .update(`${webhookId}.${timestamp}.${payload}`)
    .digest("base64");
  return fetch(url, {
    method: "POST",
    redirect: "error",
    signal: AbortSignal.timeout(5000),
    headers: {
      "content-type": "application/json",
      "webhook-id": webhookId,
      "webhook-timestamp": timestamp,
      "webhook-signature": `v1,${signature}`,
      "X-MCP-Subscription-Id": subscription.id,
    },
    body: payload,
  });
}

function createServer() {
  // Add an empty events capability to advertise MCP Events support
  const capabilities: ServerCapabilities & { events: Record<string, never> } =
    { events: {} };
  const server = new McpServer(
    { name: "mcp-events-sample", version: "1.0.0" },
    { capabilities },
  );

  // events/list returns the comment.created event definition
  server.server.setRequestHandler(
    "events/list",
    { params: z.object({}) },
    async () => ({ events: [eventDefinition] }),
  );

  // events/subscribe registers the subscription and sends a challenge
  server.server.setRequestHandler(
    "events/subscribe",
    {
      params: z.object({
        name: z.literal("comment.created"),
        arguments: argumentsSchema,
        delivery: z.object({
          mode: z.literal("webhook"),
          url: z.url(),
          secret: z
            .string()
            .regex(new RegExp(`^${SECRET_PREFIX}[A-Za-z0-9+/]+={0,2}$`)),
        }),
        cursor: z.string().nullish(),
        ttlMs: z.number().int().positive().nullish(),
      }),
    },
    async (input) => {
      const secretBytes = Buffer.from(
        input.delivery.secret.slice(SECRET_PREFIX.length),
        "base64",
      );
      if (secretBytes.length < 24 || secretBytes.length > 64) {
        throw new ProtocolError(-32602, "Invalid signing secret");
      }

      // Derive the ID deterministically from (principal, url, name, arguments)
      const id = `sub_${createHash("sha256")
        .update(
          JSON.stringify([
            token,
            input.delivery.url,
            input.name,
            input.arguments,
          ]),
        )
        .digest("hex")
        .slice(0, 24)}`;
      const subscription: Subscription = {
        id,
        documentId: input.arguments.document_id,
        url: input.delivery.url,
        secret: input.delivery.secret,
        // Cap the client's requested ttlMs at 60 seconds
        expiresAt:
          Date.now() + Math.min(input.ttlMs ?? MAX_TTL_MS, MAX_TTL_MS),
      };

      // Send a challenge to an unverified receiver to confirm consent before delivering
      if (!subscriptions.has(id)) {
        const challenge = randomUUID();
        const response = await deliver(
          subscription,
          `msg_verification_${randomUUID()}`,
          { type: "verification", challenge },
        );
        const verificationFailed = () =>
          new ProtocolError(-32027, "Callback verification failed", {
            reason: "challenge_failed",
          });
        // Check the status first because a failed response may not have a JSON body
        if (!response.ok) throw verificationFailed();
        const echoed = Buffer.from(
          z.object({ challenge: z.string() }).parse(await response.json())
            .challenge,
        );
        const expected = Buffer.from(challenge);
        if (
          echoed.length !== expected.length ||
          !timingSafeEqual(echoed, expected)
        ) {
          throw verificationFailed();
        }
        console.log("[server] challenge verified:", id);
      }

      subscriptions.set(id, subscription);
      console.log(
        "[server] subscription active until",
        new Date(subscription.expiresAt).toISOString(),
      );
      return {
        id,
        refreshBefore: new Date(subscription.expiresAt).toISOString(),
        cursor: null, // This server does not support replay
        truncated: false,
      };
    },
  );

  // events/unsubscribe removes the subscription
  server.server.setRequestHandler(
    "events/unsubscribe",
    {
      params: z.object({
        name: z.literal("comment.created"),
        arguments: argumentsSchema,
        delivery: z.object({ mode: z.literal("webhook"), url: z.string() }),
      }),
    },
    async (input) => {
      const subscription = [...subscriptions.values()].find(
        (s) =>
          s.url === input.delivery.url &&
          s.documentId === input.arguments.document_id,
      );
      if (!subscription) {
        throw new ProtocolError(-32023, "Subscription not found", {
          kind: "subscription",
        });
      }
      subscriptions.delete(subscription.id);
      console.log("[server] unsubscribed:", subscription.id);
      return {};
    },
  );

  return server;
}

// Emulates an event occurring
async function publishComment(documentId: string, text: string) {
  const event = {
    eventId: `evt_${randomUUID()}`,
    name: "comment.created",
    timestamp: new Date().toISOString(),
    data: { document_id: documentId, text },
    cursor: null,
  };
  for (const subscription of subscriptions.values()) {
    if (
      subscription.expiresAt <= Date.now() ||
      subscription.documentId !== documentId
    )
      continue;
    const response = await deliver(subscription, event.eventId, event);
    console.log("[server] delivered", event.eventId, "->", response.status);
  }
}

const handler = toNodeHandler(createMcpHandler(createServer));
const app = express();

app.all("/mcp", async (req, res) => {
  if (req.get("authorization") !== `Bearer ${token}`) {
    res.status(401).end();
    return;
  }
  await handler(req, res);
});

// Calling this endpoint simulates a comment.created event and delivers it to subscribers
app.post("/admin/comments", express.json(), async (req, res) => {
  await publishComment(req.body.document_id, req.body.text);
  res.status(202).end();
});

app.listen(3002, "127.0.0.1", () => {
  console.log("[server] MCP server: http://127.0.0.1:3002/mcp");
});
```

Here are the key points:

- The server declares `events` in its `capabilities`. AI SDK's `list()` throws a `Server does not support events` error if the server's capabilities don't include `events`
- In `events/subscribe`, the server POSTs a challenge to a new receiver and accepts the subscription only if the same value comes back
- The subscription ID is derived deterministically from the token, callback URL, event name, and arguments. The design draft treats subscriptions with the same authenticated principal, callback URL, event name, and arguments as the same subscription. Resending `events/subscribe` with the same four values doesn't create a new subscription; it extends the existing one

:::warning
Because this is a demo, the server only allows HTTP delivery to a loopback address. The design draft requires callback URLs to use HTTPS, and to prevent SSRF (Server-Side Request Forgery), it also requires servers to validate the resolved IP address on every delivery and not to follow redirects.
:::

### Implementing the Subscription Store

The handler needs to read the secret the client generated in order to verify signatures, so the two need a shared store. The store implements the `Experimental_MCPEventStore` interface.

`Experimental_MCPEventStore` is an interface with five methods: `get`, `getById`, `set`, `update`, and `delete`. Here the client and the webhook handler run in the same process, so we use an in-memory store backed by a `Map`.

```ts:src/store.ts
import type {
  Experimental_MCPEventStore as MCPEventStore,
  Experimental_MCPEventSubscription as MCPEventSubscription,
} from "@ai-sdk/mcp";

// Use shared, persistent storage in production
export class InMemoryEventStore implements MCPEventStore {
  private records = new Map<string, MCPEventSubscription>();

  async get(key: string) {
    return this.records.get(key);
  }

  async getById(id: string) {
    return [...this.records.values()].find((record) => record.id === id);
  }

  async set(subscription: MCPEventSubscription) {
    this.records.set(subscription.key, subscription);
  }

  async update(key: string, patch: Partial<MCPEventSubscription>) {
    const current = this.records.get(key);
    if (!current) throw new Error(`Unknown subscription: ${key}`);
    this.records.set(key, { ...current, ...patch });
  }

  async delete(key: string) {
    this.records.delete(key);
  }
}
```

The stored `MCPEventSubscription` includes the signing secret. Be careful not to expose these records.

### Creating the Webhook Handler and Subscribing

Finally, let's implement the client side. It registers the subscription, receives events through the webhook, and then refreshes and removes the subscription.

```ts:src/client.ts
import {
  createMCPClient,
  experimental_createMCPEventWebhook,
} from "@ai-sdk/mcp";
import express from "express";
import { InMemoryEventStore } from "./store.ts";

const MCP_URL = "http://127.0.0.1:3002/mcp";
const CALLBACK_URL = "http://127.0.0.1:3003/mcp-events";

const eventStore = new InMemoryEventStore();
const createClient = () =>
  createMCPClient({
    transport: {
      type: "http",
      url: MCP_URL,
      headers: { Authorization: "Bearer local-events-demo" },
    },
    experimental_events: { store: eventStore },
  });

// 1. Create the webhook handler
let resolveReceived: () => void;
const received = new Promise<void>((resolve) => (resolveReceived = resolve));

const webhook = experimental_createMCPEventWebhook({
  store: eventStore,
  async onEvent({ subscription, event }) {
    console.log(
      "[client] onEvent:",
      subscription.id,
      event.eventId,
      event.data,
    );
    resolveReceived();
  },
  async onGap({ subscription, gap }) {
    console.log("[client] onGap:", subscription.id, gap.cursor);
  },
  async onTerminated({ subscription, termination }) {
    console.log("[client] onTerminated:", subscription.id, termination.error);
  },
});

// 2. Expose the receiving endpoint before subscribing
const app = express();
app.post(
  "/mcp-events",
  // Don't parse as JSON: signature verification needs the raw bytes as received
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const response = await webhook(
      new Request(`http://127.0.0.1:3003${req.originalUrl}`, {
        method: "POST",
        headers: req.headers as Record<string, string>,
        body: new Uint8Array(req.body),
      }),
    );
    console.log(
      "[client] webhook",
      req.originalUrl,
      req.body.includes('"challenge"') ? "challenge" : "event",
      "->",
      response.status,
    );
    res.status(response.status);
    response.headers.forEach((value, name) => res.setHeader(name, value));
    res.send(Buffer.from(await response.arrayBuffer()));
  },
);
const receiver = app.listen(3003, "127.0.0.1");

// 3. List events and subscribe
const client = await createClient();
const { events } = await client.experimental_events.list();
console.log(
  "[client] events/list:",
  events.map((e) => ({ name: e.name, delivery: e.delivery })),
);

const subscription = await client.experimental_events.subscribe({
  name: "comment.created",
  arguments: { document_id: "doc_123" },
  delivery: {
    mode: "webhook",
    url: CALLBACK_URL,
    allowInsecureLocalhost: true, // For local testing only. Use HTTPS in production
  },
  ttlMs: 5 * 60 * 1000,
});
console.log("[client] subscribed:", subscription);

// 4. The subscription survives closing the MCP client
await client.close();
console.log("[client] MCP client closed");

// 5. Trigger an event
await fetch("http://127.0.0.1:3002/admin/comments", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    document_id: "doc_123",
    text: "レビューお願いします",
  }),
});
await received;

// 6. Refresh and unsubscribe from a new client (using what the store saved)
const client2 = await createClient();
const refreshed = await client2.experimental_events.refresh({
  id: subscription.id,
});
console.log("[client] refreshed refreshBefore:", refreshed.refreshBefore);
await client2.experimental_events.unsubscribe({ id: subscription.id });
console.log(
  "[client] unsubscribed. store:",
  await eventStore.getById(subscription.id),
);
await client2.close();
receiver.close();
```

`experimental_createMCPEventWebhook` creates a function that takes a web-standard `Request` and returns a `Response`. If you parse the body with `express.json()` and turn it back into a string, it no longer matches the received bytes and signature verification fails. That's why the sample receives the body with `express.raw()`.

Before sending `events/subscribe`, `subscribe()` does the following:

- Generates a Standard Webhooks secret starting with `whsec` and saves it to the store as a record with `status: 'pending'`
- Adds a query parameter named `mcp_event_subscription` to the callback URL

When the server sends the challenge, the `events/subscribe` response hasn't come back yet, so the subscription ID isn't known. The webhook handler uses this query parameter to look up the secret in the store and verify the challenge's signature. This means the receiver must pass the query parameter through to the handler without stripping it.

## Running the Sample

Open two terminals and start the MCP server and then the client.

```bash
npx tsx src/server.ts
```

```bash
npx tsx src/client.ts
```

The client printed the following logs:

```text
[client] events/list: [ { name: 'comment.created', delivery: [ 'webhook' ] } ]
[client] webhook /mcp-events?mcp_event_subscription=0372055a-2fd8-44e9-b0fb-b061f4d60219 challenge -> 200
[client] subscribed: {
  _meta: {
    'io.modelcontextprotocol/serverInfo': { name: 'mcp-events-sample', version: '1.0.0' }
  },
  resultType: 'complete',
  id: 'sub_2655a0119fa679bb74954405',
  refreshBefore: '2026-10-23T12:51:31.990Z',
  cursor: null,
  truncated: false
}
[client] MCP client closed
[client] onEvent: sub_2655a0119fa679bb74954405 evt_92b2465d-db46-49db-a841-7f8644a85136 { document_id: 'doc_123', text: 'レビューお願いします' }
[client] webhook /mcp-events?mcp_event_subscription=0372055a-2fd8-44e9-b0fb-b061f4d60219 event -> 204
[client] refreshed refreshBefore: 2026-10-23T12:51:32.045Z
[client] unsubscribed. store: undefined
```

The server logs look like this:

```text
[server] MCP server: http://127.0.0.1:3002/mcp
[server] challenge verified: sub_2655a0119fa679bb74954405
[server] subscription active until 2026-10-23T12:51:31.990Z
[server] delivered evt_92b2465d-db46-49db-a841-7f8644a85136 -> 204
[server] subscription active until 2026-10-23T12:51:32.045Z
[server] unsubscribed: sub_2655a0119fa679bb74954405
```

The logs show the following:

- The challenge arrives before the `subscribe()` response, and the webhook handler answers it with 200. The URL includes `mcp_event_subscription`
- The client asked for a 5-minute subscription, but the server returned a `refreshBefore` capped at its 60-second limit. The expiry the server returns is what takes effect
- Even after `client.close()` closes the MCP connection, the event still reaches the webhook and `onEvent` is called. The webhook handler returns 204 after `onEvent` succeeds
- A different client instance (`client2`) can call `refresh()` and `unsubscribe()` with only the subscription ID. The callback URL, arguments, and secret are read from the store. Unsubscribing also deletes the record from the store

The second `events/subscribe` didn't trigger a challenge. In the design draft, verification only needs to happen once per pair of authenticated principal and callback URL, and doesn't have to be repeated on every refresh. This server simplifies that by deciding whether to skip verification based on whether the same subscription ID is already registered. Because AI SDK adds a new `mcp_event_subscription` to the URL on every `subscribe()` call, subscribing again from scratch changes the callback URL, and the server sends a challenge again.

Also, this server never sends gap or terminated control messages, so `onGap` and `onTerminated` weren't called in this run.

## Summary

- MCP Events is an extension that lets MCP servers notify subscribers about things that happen in upstream systems. As of October 23, 2026, it is an experimental specification under review as SEP-3415
- MCP Events defines three delivery modes: poll, push, and webhook
- In webhook mode, the server signs deliveries in the Standard Webhooks format using a secret generated by the client, and confirms the receiver's consent with a challenge before starting delivery
- AI SDK's `@ai-sdk/mcp` supports only webhook mode. You subscribe with `client.experimental_events` and receive events with `experimental_createMCPEventWebhook`
- The MCP client and the webhook handler share an `Experimental_MCPEventStore`. Using the secret saved in the store and the `mcp_event_subscription` query parameter, the handler can verify the challenge even before the subscription ID is known
- Calling `close()` on the MCP client doesn't stop webhook delivery, so you need to remove the subscription explicitly with `unsubscribe()` or wait for it to expire

## References

- [MCP Events — Design Sketch](https://github.com/modelcontextprotocol/experimental-ext-triggers-events/blob/main/docs/design-sketch-proposal.md)
- [modelcontextprotocol/experimental-ext-triggers-events](https://github.com/modelcontextprotocol/experimental-ext-triggers-events)
- [SEP-3415: Events Extension](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/3415)
- [Standard Webhooks](https://github.com/standard-webhooks/standard-webhooks/blob/main/spec/standard-webhooks.md)
- [MCP Events | AI SDK](https://ai-sdk.dev/docs/ai-sdk-core/mcp-events)
- [MCP Events Reference | AI SDK](https://ai-sdk.dev/docs/reference/ai-sdk-core/mcp-events)
- [Receive MCP Webhook Events | AI SDK](https://ai-sdk.dev/cookbook/node/mcp-events)
- [feat(mcp): add compatibility for webhook based mcp events · vercel/ai#22155](https://github.com/vercel/ai/pull/22155)
- [vercel/ai examples/mcp/src/events](https://github.com/vercel/ai/tree/main/examples/mcp/src/events)
- [MCP events | OpenAI Developers](https://developers.openai.com/plugins/build/mcp-events)
