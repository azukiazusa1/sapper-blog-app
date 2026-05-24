---
id: -2URyJ2st2EssgACXErg4
title: "The 2026-07-28 MCP Specification Becomes Stateless-First"
slug: "mcp-stateless"
about: "The biggest change in the 2026-07-28 MCP specification release candidate is that MCP servers become stateless-first. This lets MCP servers scale behind simple load balancers. It also enables traffic routing based on the `Mcp-Method` header and caching of server responses. This article introduces the stateless protocol changes in the 2026-07-28 MCP specification release candidate."
createdAt: "2026-05-24T11:05+09:00"
updatedAt: "2026-05-24T11:05+09:00"
tags: ["mcp"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/8Ar8kIwLUSLeUpiBkezry/ed1efe8fdb63319bed61b3c475596a17/cafe_ice-coffee_illust_3515.png"
  title: "Illustration of iced coffee"
audio: null
selfAssessment:
  quizzes:
    - question: "Which benefit does the article mention for making MCP servers stateless in the 2026-07-28 MCP specification release candidate?"
      answers:
        - text: "It completely removes the stdio transport and unifies MCP around remote execution only"
          correct: false
          explanation: "The article mentions the evolution from stdio to Streamable HTTP, but it does not say that stdio is being removed."
        - text: "Servers can scale behind simple load balancers, route traffic based on the `Mcp-Method` header, and cache server responses"
          correct: true
          explanation: "As explained at the beginning of the article, the main benefits are scaling behind load balancers, header-based routing, and response caching."
        - text: "It enables bidirectional communication between clients and servers over WebSocket"
          correct: false
          explanation: "The article does not describe a move to WebSocket. Instead, it describes evolving the existing transports."
        - text: "Each client runs in a separate server process, preventing failures from affecting other clients"
          correct: false
          explanation: "Process isolation is not the topic of the article. The focus of statelessness is removing the need for servers to retain session state."
    - question: "After the `initialize` handshake is removed in the new specification, how does the article say clients declare their supported capabilities?"
      answers:
        - text: "By sending a `server/discover` method at the start of the connection and registering capabilities with the server"
          correct: false
          explanation: "`server/discover` is a method for clients to retrieve server capabilities, and it is optional. It is not used to register the client's own capabilities."
        - text: "By attaching a `notifications/initialized` notification only to the first request and having the server store it"
          correct: false
          explanation: "`notifications/initialized` is used by the current handshake and is removed in the new specification. A stateless server also cannot retain it as session state."
        - text: "By declaring protocol version, client information, and capabilities through the `_meta` field and HTTP headers on every request"
          correct: true
          explanation: "As the article explains, stateless servers cannot retain capabilities in a session, so client capabilities are sent on every request through `_meta` and headers."
        - text: "By attaching JSON-encoded capabilities to the `Mcp-Session-Id` header and having the server retain them as session state"
          correct: false
          explanation: "`Mcp-Session-Id` identifies stateful sessions in the current specification. In the new specification, the session itself is removed."
published: true
---

In the early stages of MCP (Model Context Protocol), MCP servers were used as a way to provide tools to AI agents through local stdio. However, MCP servers that run locally depend on the environment where the AI agent is running. This creates problems when the AI agent runs in the cloud, where local servers may not be available or setup can become complicated.

Streamable HTTP made it possible to run MCP servers remotely, which greatly accelerated adoption in production environments. But as MCP servers started to be operated at larger scale, new challenges became visible. The first challenge is that Streamable HTTP is a stateful protocol. Here, a session means connection-level state identified by the `Mcp-Session-Id` header. The server uses this ID as a key to retain the client's capability declarations and in-progress operations, so later requests from the same client must be routed to the same server instance. This kind of stateful session makes load balancer configuration more complex and limits scaling flexibility. The second challenge is that there is no standard way for crawlers and similar clients to learn what capabilities an MCP server provides without connecting to the server.

To solve these problems, the MCP working group is revising the MCP specification to make it a stateless-first protocol. Based on the [MCP design principle](https://modelcontextprotocol.io/community/design-principles) of keeping the number of transports small, the goal is not to add a new transport, but to evolve the existing transports toward a stateless protocol.

The biggest change in the 2026-07-28 MCP specification release candidate is that MCP servers become stateless-first. This lets MCP servers scale behind simple load balancers. It also enables traffic routing based on the `Mcp-Method` header and caching of server responses. This article walks through these changes.

## Removal of the `initialize` handshake

In the current 2025-11-25 MCP specification, communication always starts with the `initialize` and `initialized` handshake. The `initialize`/`initialized` handshake plays an important role in agreeing on the protocol version and exchanging which capabilities the client and server each provide. Let's look at the concrete flow. The client sends an `initialize` request to the server. This request includes the client's protocol version, supported capabilities, and client information.

For example, `capabilities.roots.listChanged` indicates that the client can receive `roots/list_changed` notifications from the server.

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-11-25",
    "capabilities": {
      "roots": {
        "listChanged": true
      },
      "sampling": {},
      "elicitation": {}
    },
    "clientInfo": {
      "name": "ExampleClient",
      "version": "1.0.0"
    }
  }
}
```

When the server receives the client's `initialize` request, it returns an `initialized` response. The response `id` must match the `id` from the client request. The `initialized` response includes the capabilities supported by the server, server information, and other data.

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2025-11-25",
    "capabilities": {
      "logging": {},
      "prompts": {
        "listChanged": true
      },
      "resources": {
        "subscribe": true,
        "listChanged": true
      },
      "tools": {
        "listChanged": true
      }
    },
    "serverInfo": {
      "name": "ExampleServer",
      "version": "1.0.0"
    },
    "instructions": "Optional usage hints for the client/LLM."
  }
}
```

Finally, the client sends a `notifications/initialized` notification to the server, completing the handshake. After that, normal interactions such as tool calls and resource subscriptions take place.

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/initialized"
}
```

In the 2026-07-28 MCP specification release candidate, the `initialize` handshake is removed, and the multiple responsibilities that used to belong to the `initialize` request are split into other roles. This is because sessions are removed from the protocol, so the assumption of "exchange this once at connection time and keep it in the session" no longer holds.

### Client capabilities are declared through `_meta` and headers

Client capabilities are now declared on every request through the `_meta` field and headers. In a stateless session, the server cannot store client capabilities after a one-time declaration, so the client must declare its capabilities on every request. The following example adds an `_meta` field to a `tools/list` request.

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list",
  "params": {
    "_meta": {
      // Protocol version
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      // Client information
      "io.modelcontextprotocol/clientInfo": {
        "name": "ExampleClient",
        "version": "1.0.0"
      },
      // Capabilities supported by the client
      "io.modelcontextprotocol/clientCapabilities": {
        "elicitation": {
          "form": {}
        }
      }
    }
  }
}
```

The protocol version must also be included in an HTTP header. If the header value and the request body value do not match, the server must return an error.

```http
POST /mcp HTTP/1.1
MCP-Protocol-Version: 2026-07-28
Content-Type: application/json
Mcp-Method: tools/list
```

### Server capabilities are retrieved with `server/discover`

Retrieving server capabilities is consolidated into the `server/discover` method. By calling `server/discover`, clients can retrieve server capabilities, server information, and related data. Another difference is that the old `initialize` handshake was mandatory, while `server/discover` is an optional method that clients can call when needed.

A client can call the `server/discover` method as follows.

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "server/discover",
  "params": {
    "_meta": {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientInfo": {
        "name": "ExampleClient",
        "version": "1.0.0"
      },
      "io.modelcontextprotocol/clientCapabilities": {
        "elicitation": {
          "form": {}
        }
      }
    }
  }
}
```

The server returns a response like this.

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "resultType": "complete",
    "supportedVersions": ["2026-07-28"],
    "capabilities": {
      "resources": {},
      "tools": {}
    },
    "serverInfo": {
      "name": "ExampleServer",
      "version": "1.0.0"
    },
    "instructions": "Optional usage hints for the client/LLM."
  }
}
```

## Multi round-trip requests with `requestState`

The 2025-11-25 MCP specification includes a feature called `elicitation`, which lets a server ask the user for additional input through the client while a tool is running. A typical use case is asking the user for confirmation before calling a tool that makes a destructive change. The flow works like this.

- The client calls a tool with `tools/call`
- The server starts executing the tool. If additional user input becomes necessary, the server pauses processing and sends an `elicitation/create` request to the client through the established connection
- The client displays UI asking the user for input, receives that input, and sends a response back to the server
- The server receives the response, resumes tool execution, and eventually returns the response for the original `tools/call` request

An `elicitation/create` request has the following structure.

```json
{
  "jsonrpc": "2.0",
  "id": 42,
  "method": "elicitation/create",
  "params": {
    "mode": "form",
    "message": "Delete 3 files?",
    "requestedSchema": {
      "type": "object",
      "properties": {
        "confirm": {
          "type": "boolean",
          "description": "Confirm deletion"
        }
      },
      "required": ["confirm"]
    }
  }
}
```

The client response looks like this.

```json
{
  "result": {
    "action": "accept",
    "content": {
      "confirm": true
    }
  }
}
```

In this way, `elicitation` in the 2025-11-25 MCP specification assumes a stateful session. In Streamable HTTP, bidirectional interaction happened over an open SSE stream.

In the 2026-07-28 MCP specification release candidate, `elicitation` is replaced by a multi round-trip request flow using an `InputRequiredResult` response. Instead of keeping a session, the server returns a unique identifier called `requestState` to the client. After receiving input from the user, the client sends a new request to the server that includes the original request's `id` and the `requestState` received from the server. When the server receives this request, it uses `requestState` to identify which operation needs user input and resumes processing.

When the server receives a `tools/call` request and determines that user confirmation is needed to execute the tool, it pauses processing and returns an `InputRequiredResult` response. The response includes `requestState`.

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "resultType": "input_required",
    "inputRequests": {
      // Elicitation request.
      "delete_file": {
        "method": "elicitation/create",
        "params": {
          "mode": "confirm",
          "message": "Delete 3 files?",
          "requestedSchema": {
            "type": "object",
            "properties": {
              "confirm": { "type": "boolean" }
            },
            "required": ["confirm"]
          }
        }
      }
    },
    "requestState": "eyxxxxxx"
  }
}
```

After showing UI to request input from the user and receiving that input, the client sends a new request to the server that includes `inputResponses` and the `requestState` received from the server.

```json
{
  "jsonrpc": "2.0",
  // The id must be different from the original request.
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "delete-files",
    "arguments": { "files": ["a", "b", "c"] },
    "inputResponses": {
      "delete_file": {
        "action": "accept",
        "content": {
          "confirm": true
        }
      }
    },
    "requestState": "eyxxxxxx"
  }
}
```

When the server receives this request, it decodes `requestState` and identifies how far the operation had progressed. Since it can see that the user entered `confirm` as `true`, the server resumes tool execution and eventually returns a response to the `tools/call` request.

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "status": "success"
  }
}
```

## The `Mcp-Method` and `Mcp-Name` headers

The 2026-07-28 MCP specification release candidate adds the HTTP headers `Mcp-Method` and `Mcp-Name`. The `Mcp-Method` header declares the MCP method targeted by the request and is required on every request. The `Mcp-Name` header declares which resource, tool, or similar target the operation applies to. It is required for `tools/call`, `resources/read`, and `prompts/get` requests, but it is not required for requests like `server/discover` where no target name is needed. As with the `MCP-Protocol-Version` header mentioned earlier, if the header value and request body value do not match, the server must return an error.

For example, a request to call a tool named `search` looks like this.

```http
POST /mcp HTTP/1.1
MCP-Protocol-Version: 2026-07-28
Mcp-Method: tools/call
Mcp-Name: search
Content-Type: application/json
```

The purpose of the `Mcp-Method` and `Mcp-Name` headers is to let infrastructure such as load balancers and CDNs route requests to the appropriate server based on these headers. For example, calls to a specific tool can be handled by higher-performance servers or given stricter rate limits.

With traditional stateful servers, all requests needed to be routed to the same server using techniques such as sticky sessions, so routing based on request content was not possible in the first place. Once servers become stateless, routing becomes possible, but parsing the request body on the server side for routing is inefficient. `Mcp-Method` and `Mcp-Name` make routing possible without parsing the request body.

## Caching server list responses

In stateful servers under the 2025-11-25 MCP specification, after calling list responses such as `tools/list` or `resources/list` once, clients received updates through server-side notifications. When the tool list changed, the server sent a `listChanged` notification to the client over the SSE stream, and the client could then retrieve the new tool list.

In a stateless server, there is no established connection for the client to receive notifications from the server, so the server cannot notify the client of updates. To reduce reliance on SSE push notifications, the specification adds a mechanism where clients cache list responses and refetch them after the cache expires.

`listChanged` notifications and caching are complementary, and using both together is fine. If a server supports both `listChanged` notifications and caching, it can make the client refetch the list immediately without waiting for the remaining TTL to expire.

The responses for the following list-style calls now require `ttlMs` and `cacheScope` fields.

- `tools/list`
- `resources/list`
- `prompts/list`
- `resources/templates/list`
- `resources/read`

The `ttlMs` field specifies, in milliseconds, how long the client may cache the response. Functionally, it is similar to the HTTP `Cache-Control: max-age` header. For example, if `ttlMs` is 60000, the client can treat the cache as valid for 60 seconds after receiving the response. If the cache is still valid, the client can use the cached list response without refetching it. If the cache has expired, it must fetch the list response from the server again.

The `cacheScope` field specifies the cache scope. Its value is either `public` or `private`. `public` means the cache is shared across all users. `private` means the response contains private data that should not be shared between callers, so the cache must not be shared across callers.

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "search",
        "title": "Search the web",
        "description": "Search the web",
        "inputSchema": { ... }
      }
    ],
    "ttlMs": 60000,
    "cacheScope": "public"
  }
}
```

When retrieving the list of tools, a client would write code like this.

```typescript
async listTools(): Promise<unknown[]> {
  // Return the cache if it is still valid.
  if (this.toolsCache && Date.now() < this.toolsCache.expiresAt) {
    return this.toolsCache.tools;
  }
  const result = await this.send('tools/list');
  let ttlMs = result.ttlMs || 0;
  if (ttlMs < 0) {
    ttlMs = 0;
  }
  this.toolsCache = {
    tools: result.tools,
    expiresAt: Date.now() + ttlMs,
  };
  return result.tools;
}
```

## Summary

- In the 2026-07-28 MCP specification release candidate, MCP servers become stateless
- The `initialize` handshake is removed. Client capabilities are declared through `_meta` and headers, and server capabilities are retrieved through `server/discover`
- `elicitation` is replaced by a multi round-trip request flow using `InputRequiredResult` responses
- The HTTP headers `Mcp-Method` and `Mcp-Name` are added. Infrastructure such as load balancers and CDNs can route requests appropriately based on these headers
- To reduce reliance on SSE push notifications, caching of list responses is added as a complement to `listChanged` notifications. Responses for list-style calls now require `ttlMs` and `cacheScope` fields

## References

- [The 2026-07-28 MCP Specification Release Candidate | Model Context Protocol Blog](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)
- [The 2026 MCP Roadmap | Model Context Protocol Blog](https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/)
- [Specification - Model Context Protocol](https://modelcontextprotocol.io/specification/draft)
- [SEP-2575: Make MCP Stateless](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/seps/2575-stateless-mcp.md)
