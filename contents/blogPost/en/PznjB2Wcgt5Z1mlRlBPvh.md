---
id: PznjB2Wcgt5Z1mlRlBPvh
title: "Trying Out OpenAI's Secure MCP Tunnel"
slug: "openai-secure-mcp-tunnel"
about: "OpenAI's Secure MCP Tunnel lets you connect a private MCP server to OpenAI products without exposing it to the public internet. In this article, I walk through what it looks like to actually try out Secure MCP Tunnel."
createdAt: "2026-05-31T19:04+09:00"
updatedAt: "2026-05-31T19:04+09:00"
tags: ["openai", "mcp"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2iO58AAEE03fT33QcfIKQF/e69d9a34fcb985fad5d8749f1c1fc61f/traffic_tunnel_18400-768x591.png"
  title: "Illustration of a tunnel"
audio: null
selfAssessment:
  quizzes:
    - question: "Which of the following correctly describes the main role of OpenAI's Secure MCP Tunnel as explained in the article?"
      answers:
        - text: "A CDN service for exposing an MCP server as a public web server"
          correct: false
          explanation: "Secure MCP Tunnel is not for publishing the server publicly — it is precisely the mechanism that connects without exposing it to the public internet."
        - text: "An installer that registers a stdio-transport MCP server with ChatGPT from your local machine"
          correct: false
          explanation: "tunnel-client is not an installer. It runs locally as a client that relays traffic between OpenAI products and your private MCP server."
        - text: "A tunneling service that connects a private MCP server to OpenAI products without exposing it to the public internet"
          correct: true
          explanation: "This is exactly what the article describes in the introduction and the summary. It lets you call MCP servers that live on-premises or behind a firewall from ChatGPT, Codex, and other OpenAI products."
        - text: "A new transport specification that makes the MCP protocol itself faster"
          correct: false
          explanation: "The article does not describe it as a new transport. It is a mechanism for safely connecting existing MCP servers to OpenAI products."

    - question: "Following the steps in the article, where is the profile file generated when you run tunnel-client init?"
      answers:
        - text: "/etc/tunnel-client/config.yaml"
          correct: false
          explanation: "The article describes the file as being created under the user's home directory, not under system paths."
        - text: "~/.openai/tunnels.yaml"
          correct: false
          explanation: "This path does not appear in the article. tunnel-client uses its own dedicated directory."
        - text: "~/tunnel-client/local-stdio.yaml"
          correct: true
          explanation: "The article shows that running init with --profile local-stdio creates a profile at ~/tunnel-client/local-stdio.yaml."
        - text: "tunnel.yaml in the current directory"
          correct: false
          explanation: "The article specifies that the file is generated under ~/tunnel-client/, not in the current working directory."

published: true
---

MCP (Model Context Protocol) defines two transports: the stdio transport, which runs locally, and the Streamable HTTP transport, which runs remotely. When MCP first appeared, the stdio transport was the main one in use, but the Streamable HTTP transport has been gaining traction for reasons such as:

- It is easy to set up and accessible even to non-engineers
- It can be used from cloud-hosted clients
- The OAuth authentication story is in place

On the other hand, the Streamable HTTP transport comes with its own challenges compared to stdio: you have to stand up a server to accept HTTP requests, and the options for distributing it privately are limited.

OpenAI's Secure MCP Tunnel is a tunneling service that lets you connect a private MCP server to OpenAI products without exposing it to the public internet. This makes it possible to call MCP servers from ChatGPT, Codex, and other OpenAI products even when those servers live on-premises or behind a firewall.

In this article, I will walk through what it looks like to actually try out OpenAI's Secure MCP Tunnel.

## Prerequisites for Secure MCP Tunnel

As a prerequisite, head over to the [Tunnels page in the OpenAI platform](https://platform.openai.com/settings/organization/tunnels) to obtain a `tunnel_id`. The default Owner role does not allow creating tunnels, so you need to create a new role. From [People & Permissions > Roles](https://platform.openai.com/settings/organization/people/roles), click "Create role" to create a new role, and under "Permissions" enable "Manage" and "Use" for "Tunnels".

![](https://images.ctfassets.net/in6v9lxmm5c8/6DbnmcTHhOt32R5cEqY6Yd/11d995cbbf11d327fef04ad8bb667e42/image.png)

You can then assign this new role to a user from the [Members tab](https://platform.openai.com/settings/organization/people/members). Log in as a user with the role assigned and visit the [Tunnels page](https://platform.openai.com/settings/organization/tunnels) — the "Create Tunnel" button should now be enabled.

![](https://images.ctfassets.net/in6v9lxmm5c8/4Uh1qCMxcsowo7ienngd88/8a38b6dc7d5fd0e50ae8188c9600c80f/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-05-28_19.28.26.png)

A dialog for creating a tunnel appears. Fill in the "Name" and "Description" and click "Create". The "Organization Ids" field is pre-populated, so you can leave it as-is.

![](https://images.ctfassets.net/in6v9lxmm5c8/7f1kCHUdrfjQOM29QyEReK/baf565dac7c2ba9fc0940565e88b04a8/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-05-28_19.32.12.png)

Once the tunnel is created, an ID is issued. Make a note of it.

![](https://images.ctfassets.net/in6v9lxmm5c8/6QaLVJ6IWiYmpiIIS9OoBK/2b273d27590c27893f6c7aa68d34a810/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-05-31_9.28.11.png)

Next, create an API key. From [API Keys](https://platform.openai.com/api-keys), click "Create new secret key" to issue one. The API key needs the "Read" and "Use" permissions for "Tunnels".

![](https://images.ctfassets.net/in6v9lxmm5c8/28b4BadX9vW7RrHH6ZfnWp/5c5320f9ad984c9748be47efbcae4d38/image.png)

## Setting Up the Tunnel Client

Secure MCP Tunnel uses a CLI called `tunnel-client` to bridge the MCP server running on your machine and the OpenAI products. You can install `tunnel-client` from the URL below — check the latest version as needed.

https://github.com/openai/tunnel-client/releases/tag/v0.0.9--context-conduit-topaz

Once the download is done, put `tunnel-client` on your `PATH` so the command is executable. Run the following in your terminal to confirm that `tunnel-client` is installed correctly.

```bash
tunnel-client --version
```

Before going further, prepare a stdio-transport MCP server. Here I implemented a small MCP server in TypeScript that does nothing more than basic arithmetic.

<details>
<summary>Example of an MCP server running over the stdio transport</summary>

```ts:server.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "calculator",
  version: "1.0.0",
});

server.registerTool(
  "add",
  {
    description: "Adds two numbers",
    inputSchema: {
      a: z.number().describe("First number"),
      b: z.number().describe("Second number"),
    },
  },
  async ({ a, b }) => ({
    content: [{ type: "text", text: `${a} + ${b} = ${a + b}` }],
  }),
);

// ... other tools

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Calculator MCP server started");
}

main().catch((err) => {
  console.error("Server error:", err);
  process.exit(1);
});

```

</details>

Set the API key you just created to the `CONTROL_PLANE_API_KEY` environment variable, then run `tunnel-client init`. Pass the tunnel ID you noted earlier with `--tunnel-id`. The command to launch the local MCP server is specified via `--mcp-command`. If you want to point at a remote MCP server instead, specify it like `--mcp-server-url https://example.com/mcp`.

```bash
export CONTROL_PLANE_API_KEY="sk-xxxxxx" # The API key you created earlier

tunnel-client init \
  --sample sample_mcp_stdio_local \
  --profile local-stdio \
  --tunnel-id tunnel_xxxx \
  --mcp-command "bun /path/to/server.ts"
```

Running `tunnel-client init` generates a profile file at `~/tunnel-client/local-stdio.yaml`. From now on, you can specify this profile when running `tunnel-client`, which saves you from passing the same command-line arguments every time.

```yaml:~/tunnel-client/local-stdio.yaml
config_version: 1
control_plane:
  base_url: "https://api.openai.com"

  tunnel_id: "tunnel_xxxx"
  api_key: "env:CONTROL_PLANE_API_KEY"
health:
  # Keep a fixed port when you want a stable local admin URL.
  # For concurrent or clean-room runs, switch listen_addr to "127.0.0.1:0" and
  # set url_file so another process can discover the resolved /healthz, /readyz,
  # /metrics, and /ui base URL.
  listen_addr: "127.0.0.1:8080"
  # url_file: "/tmp/tunnel-client-health.url"
admin_ui:
  open_browser: false
log:
  level: info
  format: json
mcp:
  commands:
    - channel: main
      command: "bun /path/to/server.ts"
```

## Starting the Tunnel Client

Once the profile is set up, run `tunnel-client run` to start the tunnel. Pass the profile you just created as an argument.

```bash
tunnel-client run --profile local-stdio
```

If you see "🟢 tunnel-client started" in the log, you are good to go. Visiting http://localhost:8080 will bring up the admin UI.

![](https://images.ctfassets.net/in6v9lxmm5c8/1R2WC17lYajOO5gIbqu5FZ/ad9fdaca21dee3db7292cf6a55c2af06/image.png)

## Calling the MCP Server from ChatGPT

Open ChatGPT's [Connector settings](https://chatgpt.com/#settings/Connectors) and add a custom connector. To add a custom connector, you first need to enable "Developer mode" under "Advanced settings".

![](https://images.ctfassets.net/in6v9lxmm5c8/1n35emFSq7A4zHC9JwhN7S/b24399c4bf856b031f86a0ebf5fac8e3/image.png)

![](https://images.ctfassets.net/in6v9lxmm5c8/1RAjINxhHkzKsJtrFwZsj0/339c0fc0332203568adbebd50932e876/image.png)

Once "Developer mode" is on, a "Create app" button appears in the connector settings. Click it to create a new connector.

![](https://images.ctfassets.net/in6v9lxmm5c8/3Id4dV0z8jFjfnyKQZXuQr/77557addeb5c0a86efd5c5a14e49b4da/image.png)

Under "Connection", choose "Tunnel". The available tunnels will appear in a dropdown. The tunnel you created may not always show up there — when that happens, click "Enter tunnel ID instead" and type in the tunnel ID you noted earlier. For "Authentication", select "No authentication".

![](https://images.ctfassets.net/in6v9lxmm5c8/4m71Ss8kX75FTe228vW5u4/767341d920380c25954b47a45ff400b5/image.png)

Click the "Create" button and a new app is added — let's connect it to ChatGPT. If you open the app's details, you can see that the tool list of the MCP server running locally is displayed.

![](https://images.ctfassets.net/in6v9lxmm5c8/16FLUGDH05DMfDo3ZtTgHf/fd24da60926e790bf2b813ccca34ca67/image.png)

Now let's actually try calling a tool from a chat. Before starting the chat, click the "+" button and pick the app you just created. From there, you can invoke the MCP server's tools straight from the chat.

![](https://images.ctfassets.net/in6v9lxmm5c8/Hf4Y93BFfonXfnVePIFET/4e05e1694a2546794d5847a5c86870c3/image.png)

Try entering a prompt like the following.

```text
Use the calculator tool to compute 5 + 3.
```

You can see that the `add` tool of the "tunnel-test" app we created is invoked and the correct result is returned.

![](https://images.ctfassets.net/in6v9lxmm5c8/1Q9a2ySAaI5cbpBguUxkeQ/5beeabe0d5a8a3de814784bd568ea758/image.png)

In this example, I connected a local MCP server to a tunnel, but `tunnel-client` needs to run inside the same trust boundary that can reach the private MCP server. For production use, you might run `tunnel-client` as a Pod inside a Kubernetes cluster, or run it on a VM that sits in the same network as the MCP server.

## Summary

- OpenAI's Secure MCP Tunnel lets you connect a private MCP server to OpenAI products without exposing it to the public internet
- To use Secure MCP Tunnel, you need to create a tunnel on the OpenAI platform, issue an API key, and set up the `tunnel-client` CLI. Note that creating a tunnel requires assigning the appropriate role to the user
- The `tunnel-client` CLI is used to connect a locally running MCP server to OpenAI products
- With a ChatGPT custom connector, you can invoke the MCP server's tools straight from ChatGPT

## References

- [Secure MCP Tunnel | OpenAI API](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels)
- [openai/tunnel-client](https://github.com/openai/tunnel-client)
