---
id: z49V2qSJR2A5CfkLs81Je
title: "Trying Out Cloudflare OS, a Workspace for Running AI Agents and Apps"
slug: "cloudflare-os"
about: "Using AI agents at work requires access to internal knowledge and systems, plus a way to share what they produce. Cloudflare OS is a workspace for running agents and small apps. This article covers running it locally, the runtime, and permissions."
createdAt: "2026-09-12T20:04+09:00"
updatedAt: "2026-09-12T20:00+09:00"
tags: ["Cloudflare", "AI"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1yl63wJhyMQwjQggIS5j8t/8949b9d91d3d1fe2a8a28bceb5b6408c/sanma_nitsuke_15755-768x591.png"
  title: "秋刀魚の煮付けのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "In the notes app built in this article, what keeps notes around after a page reload?"
      answers:
        - text: "Notes are held in a browser variable"
          correct: false
          explanation: "Notes are stored on the server, not in a variable that disappears when the page reloads."
        - text: "Notes are saved to Durable Object storage"
          correct: true
          explanation: "server.js saves and reads notes with ctx.storage.put() and ctx.storage.get()."
        - text: "Notes are regenerated each time from the chat history with the AI"
          correct: false
          explanation: "Notes are redisplayed by reading the saved data back."
        - text: "Notes are embedded in the Blueprint"
          correct: false
          explanation: "A Blueprint is a way to reuse code; it does not carry saved data."
    - question: "What does a Blueprint include when you share it?"
      answers:
        - text: "The code and the definitions of the connections it needs"
          correct: true
          explanation: "A Blueprint contains the code, connection definitions, and metadata, and is used to create an independent app."
        - text: "The notes stored in the original app's SQLite database"
          correct: false
          explanation: "The contents of the SQLite database are not part of a Blueprint."
        - text: "The author's credentials for external services"
          correct: false
          explanation: "Credentials and the actual connections are not copied."
        - text: "The chat history from when the app was built"
          correct: false
          explanation: "Chat history is not shared as part of a Blueprint."
published: true
---
When you hand work over to an AI agent, the hard part is giving it access to your organization's knowledge and systems. Explaining company-specific terms and procedures every time, or handing over the documents it needs, quickly becomes tedious. And if you want to share an app the agent built with your colleagues, you also have to think about who is allowed to see the internal data that app reads.

[Cloudflare OS](https://github.com/cloudflare/cloudflare-os) is a workspace for running agents and apps while drawing on your organization's knowledge and external services. You give instructions from the browser to produce documents and apps, and your team can keep using what comes out of it.

This article walks through running Cloudflare OS locally, and then looks at how apps are executed and how permissions are managed.

:::warning
Cloudflare OS v2 is an early access release, so the details may change in future updates.
:::

## What is Cloudflare OS?

Cloudflare OS is an AI workspace you use from the browser. Built on Cloudflare Workers, it manages agent conversations, app code, stored data, and connections to external services.

:::note
"OS" here does not mean a general-purpose operating system you install on a PC. It is used in the sense of an OS for AI workloads — one that lets companies use AI to be more productive while getting their work done safely.
:::

The [official blog post](https://blog.cloudflare.com/cloudflare-os/#an-agent-workspace-for-everyone-in-your-company) states that the design goal is for everyone in an organization to be able to use it, developers included. Day-to-day use happens in the browser, and nothing assumes you are comfortable in a terminal. Agents can draw on the knowledge and skills a team has accumulated, and an app one person builds can be useful in someone else's work.

Cloudflare OS is made up of the following concepts.

| Concept | Role |
| --- | --- |
| Workspace | The place that ties together agent conversations, apps, and connected resources. A single workspace can hold multiple Gadgets |
| Gadget | A small app that runs inside Cloudflare OS |
| Blueprint | A template that reuses a Gadget's code so you can create another app from it |
| Gatekeeper | The mechanism that mediates access to external services and controls which resources and operations are available |

For example, if you ask an agent to build a notes app, that app is a Gadget. Let's actually build a Gadget and share it with other members of an organization.

## Running it locally

Let's start by running Cloudflare OS locally, following the [instructions in the official repository](https://github.com/cloudflare/cloudflare-os#run-locally). You will need Node.js and the [pnpm](https://pnpm.io/installation) package manager.

```bash
git clone https://github.com/cloudflare/cloudflare-os.git
cd cloudflare-os
git checkout 54d5d8b0beaec96500ed6fd19281a282702a82f4
pnpm run-local
```

Once the startup log prints `Ready on http://localhost:8787`, open `http://localhost:8787/` in your browser. A sign-in screen appears; the first time through, choose "Create one" to go to the screen for creating a local account.

![](https://images.ctfassets.net/in6v9lxmm5c8/3Zx5wZWv3Nsfom7unYGWH8/4e9bc4c88e8b494e1df003ff3424cf98/cloudflare-os-1.png)

After setting a username and password, the initial setup screen appears. You configure a display name, the AI model to use, and the external services to connect, in that order. Here I picked OpenAI's `gpt-5.6-luna` and entered an API key under "API Token". You can create an OpenAI API key on the [OpenAI account page](https://platform.openai.com/api-keys).

![](https://images.ctfassets.net/in6v9lxmm5c8/40SpACed2IyxhoXMqA3U9l/7edd38a5270c1e25bf0521c5f6d01576/cloudflare-os-2.png)

Skipping the external services and clicking through "Next" and "Let's build" brings up the conversation screen with the agent. This is where you tell the agent to build an app.

![](https://images.ctfassets.net/in6v9lxmm5c8/7i4xQ9B55bn60kgJYonZxq/de8846a569eb85df1d07c6c3beca93e1/cloudflare-os-3.png)

## Building a small notes app

Let's try building a notes app. Confirm that the model on the home screen is "GPT 5.6 Luna", then send the following prompt.

```text
Build a small notes app where I can enter a title and body and save them.
Let me pick a saved note from a list and display it.
Store the data on the server so it survives a page reload.
No connection to external services is needed.
```

Sending it creates a workspace, and the agent starts writing code. In this run, it generated `client.js`, `server.js`, and `README.md`. `client.js` is the list and editor screen, and `server.js` handles saving and retrieving notes.

![](https://images.ctfassets.net/in6v9lxmm5c8/54yxShYtD9GBazaeKH3M5C/9976cff7e009b65afe92029aa30c4b0d/cloudflare-os-4.png)

The generated app can be previewed as a Draft. Let's check that the notes app works. Enter a title and body, press "Save", and the saved note shows up in the list.

![](https://images.ctfassets.net/in6v9lxmm5c8/1SHtFb0IrwLwU2vfEXf9ju/b07600e01d7b8ca1cad789fd18fb9f95/cloudflare-os-5.png)


### Each app gets its own runtime and storage

A Gadget's server-side code runs in a unit of execution called a [Dynamic Worker Facet](https://developers.cloudflare.com/dynamic-workers/usage/durable-object-facets/). A Dynamic Worker is a Worker that loads its code at runtime, a Durable Object is the Workers primitive that holds state, and a Facet sets up an independent unit of execution with its own storage inside that Durable Object. Together, they give each Gadget its own dedicated SQLite database.

Gadgets run inside a sandbox. The server-side Dynamic Worker has internet access disabled and can only talk to external resources you have explicitly designated. The client-side code runs in a sandboxed iframe, and its communication with the server is limited to RPC through the parent frame. To use an external service, you have to allow the connection through a Gatekeeper, which we will get to later.

The `server.js` generated here defines a `Gadget` class extending `DurableObject`. Here is the part that reads saved notes.

```js:server.js
import { DurableObject } from "cloudflare:workers";

const NOTES_KEY = "notes";

export class Gadget extends DurableObject {
  async listNotes() {
    const notes = (await this.ctx.storage.get(NOTES_KEY)) || [];
    return [...notes].sort((a, b) => b.updatedAt - a.updatedAt);
  }

  // Methods such as getting and saving a note are omitted
}
```

`this.ctx.storage.get()` reads a value from the storage assigned to this Gadget. The [SQLite-backed Durable Object storage API](https://developers.cloudflare.com/durable-objects/api/storage-api/) offers key-value methods such as `get()` and `put()` alongside the methods for running SQL. Instead of writing SQL statements, this app keeps an array of notes under a single `notes` key.

The `saveNote()` method runs the following after adding or updating a note.

```js
await this.ctx.storage.put(NOTES_KEY, notes);
return note;
```

On the client side, the app calls `gadget.saveNote()` and then re-reads the list with `gadget.listNotes()`. `gadget` is the object Cloudflare OS hands to the client for calling into the server-side Gadget. The communication uses [Cap'n Web](https://github.com/cloudflare/capnweb), an RPC (Remote Procedure Call) mechanism for invoking methods that live in a separate runtime.

```js
const notes = await gadget.listNotes();
```

## Sharing the app with another user

Let's share the notes app we built with another user. Two users appear here: `test`, who created the app, and `test1`, who it is shared with.

Before sharing, opening the same workspace URL as `test1` shows "You don't have access to this workspace". Knowing the URL is not enough to see the list of notes or their contents.

![](https://images.ctfassets.net/in6v9lxmm5c8/xMSirgYga7yUTEhkLBTqy/1b547fc5f97bfdf9e0b64d64183cbcf1/cloudflare-os-6.png)

To give `test1` access to the workspace, the creator clicks the share link icon in the menu bar.

![](https://images.ctfassets.net/in6v9lxmm5c8/4q0wIRkvUTH64hWzNYe58U/022600efb61473a9c93e6e47d003880a/cloudflare-os-7.png)

In the dialog that appears, enter `test1` under "Username or email", set the permission to "Gadget only", and click "Invite".

![The sharing screen after granting test1 Gadget only permission](https://images.ctfassets.net/in6v9lxmm5c8/25932msTae5kypww9804or/85ade041a028f9fcda8abaf46cc1e20f/cloudflare-os-8.png)

Once "People with access" lists `test1` with "Gadget only", try opening the notes app as `test1` again. This time the existing notes are displayed. The recipient's screen has no AI chat or code editing tabs — just the screen for using the notes app. If you want to allow code editing as well, you need to set the permission to "Workspace".

Clicking "＋ New note" as `test1` also worked, confirming that the recipient can create notes.

![The screen after test1, with Gadget only permission, saved a note](https://images.ctfassets.net/in6v9lxmm5c8/2xtbrYkjHfhwmLc5V1HnX0/95af93c2b76b04aa63c8fbacacbd794a/cloudflare-os-9.png)

Reloading the page on the creator's side shows that note's title and body. Both users are working against the same stored data in the same app.

## Managing permissions with Gatekeepers

Apps you have agents build start out small and personal, like the one above. But once you think about using them across an organization, they grow into larger apps that connect to internal data and are used by everyone. That is where permissions become the hard problem: who is allowed to see the internal data an app reads, and who is allowed to update it.

Cloudflare says that running the first version internally is what made it clear that permissions are a central problem for collaboration. MCP (Model Context Protocol) is a protocol for letting AI applications use external tools and data. But controlling which tools can be called does not cover whether the information an agent has read is safe to show to the person you share with.

Cloudflare OS addresses this with Gatekeepers, which verify a recipient's permissions for the external resources an app has accessed.

A Gatekeeper mediates connections to external services. Instead of handing credentials to an app, it grants permission to operate on a specific resource. A reference that represents such a permission is called a capability. The server-side Gadget uses external resources through the connections it has been allowed.

### Reading from and writing to GitHub with the GitHub Gatekeeper

Let's try the GitHub Gatekeeper as an example of connecting to an external service. In a local environment, follow the [GitHub Gatekeeper setup instructions](https://github.com/cloudflare/cloudflare-os/blob/54d5d8b0beaec96500ed6fd19281a282702a82f4/packages/gatekeeper-github/README.md) to configure the Client ID and Client Secret of a GitHub OAuth App, then restart the dev server. The Callback URL is `http://localhost:8787/gatekeeper/github/oauth`.

![](https://images.ctfassets.net/in6v9lxmm5c8/1yc8PfMLr5srBVxiSYnrbe/2a6815ce0abf944eca6ef211a013b437/cloudflare-os-10.png)

Clicking the "Connect resource" button on the "Connections" tab lists the available external services; choose "GitHub" → "GitHub Repository".

![](https://images.ctfassets.net/in6v9lxmm5c8/7IBPxWY6pBwlTwf5NmKrDe/a666e507fda15fca8dbc930d7b736cbe/cloudflare-os-11.png)

Authorize with "Connect GitHub". A GitHub App permission screen appears, where you grant access to your repositories. Once authorization completes and you are back in the workspace, pick the repository the app will connect to from the "Repository" field. I selected `azukiazusa1/benkyo` for this test.

![The screen after selecting benkyo as the GitHub Gatekeeper connection](https://images.ctfassets.net/in6v9lxmm5c8/635V7VQAGVWr8W8OYqpCdP/f8b87f0cb55d9961538a929138b2561f/cloudflare-os-12.png)

Click "Add connection" and GitHub appears in the list of connections. From code, it becomes available as `this.env.GITHUB_REPO`.

![](https://images.ctfassets.net/in6v9lxmm5c8/7eWy50649YqYga8hs4UAoC/f28714c0d5250eed668e700567db5cc8/cloudflare-os-13.png)

Let's check whether the workspace can reach the connected GitHub repository. Send the following message in the chat.

```text
Using the connected GITHUB_REPO, fetch the open issues in azukiazusa1/benkyo and list their numbers and titles. Do not write anything to GitHub, and do not modify the code of the existing notes app.
```

The agent's execution log shows it fetching issues through the `GITHUB_REPO` binding.

![](https://images.ctfassets.net/in6v9lxmm5c8/5zQJhUpxMp0wzjBIjB1NGo/44db24445d7dd48f3531cd7022ec701a/cloudflare-os-14.png)

Next, I asked it to use `createIssue` to open one test issue titled `[Gatekeeper 検証] 承認前の Issue 作成`. A "Create issue" request appeared with "Approve" and "Deny" buttons, and "NEEDS REVIEW" showed up in Activity.

![The screen showing the GitHub issue creation waiting for approval](https://images.ctfassets.net/in6v9lxmm5c8/2yqxhscBG9ZoT0io8zbAUV/cfe72ed2f04d28420a12668e09a93ca8/cloudflare-os-15.png)

Write operations require approval, and nothing reaches GitHub until the workspace owner approves. Pressing "Approve" in Activity created issue #14 on GitHub, with the body I specified.

### Can a user the app is shared with write to GitHub?

Next, let's check whether `test1` — who has "Gadget only" access — can also request a write, not just the owner. Since `test1` cannot use the workspace chat, I added a button to load GitHub issues and a button to send a creation request to the existing notes app screen.

After the GitHub connection was added, the sharing screen showed "Recipient verification", which requires confirming that the recipient can access `azukiazusa1/benkyo` with their own account.

![The screen for verifying the recipient's own access to the original repository](https://images.ctfassets.net/in6v9lxmm5c8/38RpP9ObmXciOnYuJrW51k/fea04a529e5055fcd5117fa72e3da132/cloudflare-os-16.png)

This is how permissions are controlled: by making the recipient name an account of their own. The recipient specifies their own account for each Gatekeeper the Gadget uses, and the Gatekeeper verifies whether they could read everything the Gadget has read so far directly, with their own permissions. If it includes anything they cannot read directly, they are denied access to the Gadget altogether. Even after sharing, if the Gadget tries to read something new that the recipient cannot read directly, that read is blocked. Rather than writing access control rules, the design decides based on whether the recipient could have read the information in the first place.

Pressing "Load GitHub issues" as `test1` returned 14 issues, including the test issue created earlier. Pressing "Request creation of a GitHub test issue" then reported that the request had been sent. There is no approval button on `test1`'s screen, so they cannot approve it themselves.

![The screen after test1 requested the creation of a GitHub issue](https://images.ctfassets.net/in6v9lxmm5c8/70VGwrZjWfKp1ZyNfT0AQb/c55952c81a7011f6c3bcdca7205c0f4d/cloudflare-os-17.png)

On the owner's side, `test` sees "a creation request from test1" in Activity, waiting for approval. Pressing "Approve" as the owner created the issue `[Gatekeeper 検証] test1 からの作成要求` as #15 on GitHub. So a recipient can request a write to an external service, but the approval control only ever appears on the owner's side.

![](https://images.ctfassets.net/in6v9lxmm5c8/6cN3uLmRaOFKwDOy6j0e1K/ae2934f7477394df54d5aad3b8179594/cloudflare-os-18.png)

## Blueprints: distributing how an app works

So far we have granted other users access to the notes app and shared the same stored data. Blueprints are the way to distribute only how an app works. A Blueprint shares a Gadget's source code so that other users can build their own app from it.

Let's turn the notes app into a Blueprint and use it as the other user, `test1`. Selecting "Blueprints" at the top of the workspace opens a dialog.

![](https://images.ctfassets.net/in6v9lxmm5c8/5BKEbagtmPk5F23Akkimsd/faf89b18c7026cad157ffc392d67e786/cloudflare-os-19.png)

Choose "Create blueprint" and fill in a title and description. For connections to external services, you can add a user-facing name and a description shown during setup.

![The screen for setting a Blueprint's title, description, and required connections](https://images.ctfassets.net/in6v9lxmm5c8/4LBENNpQCRuJT1yce2sl9p/f8e35fecd359647b9271566b520b2d6b/cloudflare-os-20.png)

After creating it, I opened the Blueprint's detail page URL as `test1`. When a Blueprint connects to an external service, that connection has to be configured. "Required connections" shows the GitHub connection as "Needs setup". From "Configure", pick the GitHub account already connected for `test1`, specify the repository to use, and press "Save connection". I chose the same `azukiazusa1/benkyo` here.

![Opening the Blueprint as test1 requires configuring the GitHub connection](https://images.ctfassets.net/in6v9lxmm5c8/5oGhRgjQR3pMYVRik5L9Xf/c2aacddca07b30c0a22a88db2071995d/cloudflare-os-21.png)

Once the connection is "Ready", press "Create Gadget". A workspace with a different URL is created, running the same notes app. The three notes saved in the original app are not carried over, though — the new app starts with zero. The chat history does not come along either.

![The app created from the Blueprint has none of the original notes or chat history](https://images.ctfassets.net/in6v9lxmm5c8/1LWhWPDY5n10PDXlbwan2G/e6a6e7c060aac23b8fb46a409796b45b/cloudflare-os-22.png)

So you can pick between the two: share the Gadget when you want to work on the same stored data together, and use a Blueprint when each member should use the app with their own data.

### Creating slides with a built-in Blueprint

Cloudflare OS also ships with built-in Blueprints for Docs, Slides, and Sheets. Designating them as standard output formats lets the agent use them when producing deliverables.

![](https://images.ctfassets.net/in6v9lxmm5c8/3kRV5dJNXaXZqgpWUET295/6cf04883c06ff8dbb8ec0140b4b2ab23/cloudflare-os-23.png)

With the Slides Blueprint, you can create slides that match your company's style in natural language.

Let's request a slide deck with GitHub connected. You can leave the steps for creating a Gadget from a Blueprint to the agent as well.

```text
Read the bodies of issues #1 through #13 in the connected GITHUB_REPO (azukiazusa1/benkyo), organize the planned features and the open questions, and turn them into five slides in Japanese.
Find and use the built-in Slides Blueprint from the list, and add a new Slides Gadget to this workspace.
Structure it as: cover, purpose of the service, main features, development approach, and points to confirm.
Cite the issue number behind each point, and clearly mark anything that is unstated or is your own suggestion.
```

The agent fetched the list of Blueprints and the list of GitHub issues, and a "Study group service development plan" deck built with the built-in Slides was added as another Gadget in the same workspace. Confirming with "Accept changes" displays the five slides.

![A slide about the main features, generated from GitHub issues](https://images.ctfassets.net/in6v9lxmm5c8/6sUlgc7fhOt77YjpoCd7zQ/13ac774e4babda2c61664b374e364fa2/cloudflare-os-24.png)

The pencil "Edit" icon at the bottom of the slide switches to edit mode. Being able to make the fine adjustments that chat alone cannot quite control is genuinely handy.

![The edit screen of the built-in Slides](https://images.ctfassets.net/in6v9lxmm5c8/51Weo65WOPqVyCnNJPz58n/2b9ce39ee1aa115a529aceb422000d03/cloudflare-os-25.png)

The slides you create are also available from "Outputs" → "Slides".

![](https://images.ctfassets.net/in6v9lxmm5c8/5U15N8nituGi1DQWw1KZvZ/f5abcf1adaa36fd4acd2d010527fd698/image.png)

## Summary

- Cloudflare OS is a workspace that combines conversations with an agent and the execution of small apps
- The notes app built here keeps its data using Durable Object storage
- A Gadget is the app itself, while a Blueprint reuses its code to create an independent app
- Connections to external services go through a Gatekeeper, which handles the permissions needed to use and share a resource

## References

- [Cloudflare OS: an open platform for agents, apps, and work](https://blog.cloudflare.com/cloudflare-os/)
- [cloudflare/cloudflare-os](https://github.com/cloudflare/cloudflare-os)
- [Blueprints](https://github.com/cloudflare/cloudflare-os/blob/54d5d8b0beaec96500ed6fd19281a282702a82f4/docs/blueprints.md)
- [Sharing](https://github.com/cloudflare/cloudflare-os/blob/54d5d8b0beaec96500ed6fd19281a282702a82f4/docs/sharing.md)
- [Observer Tracking & Read-Through Sharing Permissions](https://github.com/cloudflare/cloudflare-os/blob/54d5d8b0beaec96500ed6fd19281a282702a82f4/docs/observers.md)
- [SQLite-backed Durable Object Storage](https://developers.cloudflare.com/durable-objects/api/storage-api/)
