---
id: 1shxi03C_Q2Uwo7t6kkaJ
title: "Trying Out Pencil, a New Design Tool"
slug: "new-design-tool-pencil"
about: "Pencil is a UI design tool with a Figma-like feel. By using the Pencil MCP server, it can work bidirectionally with AI coding tools to export code from designs and generate designs from prompts."
createdAt: "2026-01-24T14:09+09:00"
updatedAt: "2026-01-24T14:09+09:00"
tags: ["AI", "Pencil", "MCP"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/24M87rJdt7ZyWWZYynxEDM/fc362ed03c3234a8b02d532527d95476/image.png"
  title: "ノートと鉛筆のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Which file format does Pencil use for design files?"
      answers:
        - text: ".pen files"
          correct: true
          explanation: "Pencil uses the open `.pen` format, which is saved as JSON. That means you can inspect it in a text editor and manage it with a version control system."
        - text: ".fig files"
          correct: false
          explanation: "`.fig` files are used by Figma. Pencil uses `.pen` files."
        - text: ".sketch files"
          correct: false
          explanation: "`.sketch` files are used by Sketch. Pencil uses `.pen` files."
        - text: ".xd files"
          correct: false
          explanation: "`.xd` files are used by Adobe XD. Pencil uses `.pen` files."
    - question: "Which of the following can you get with the `get_editor_state` tool in Pencil MCP?"
      answers:
        - text: "The current editor state, selected elements, and available components"
          correct: true
          explanation: "`get_editor_state` retrieves the current editor state, the selected elements, and information about available components. This helps AI coding tools understand the design context."
        - text: "The design file's version history"
          correct: false
          explanation: null
        - text: "The editing status of other users"
          correct: false
          explanation: null
        - text: "The sync status of cloud storage"
          correct: false
          explanation: null
published: true
---
[Pencil](https://www.pencil.dev/) is a UI design tool with a Figma-like feel. By using the Pencil MCP server, it can work bidirectionally with AI coding tools, exporting code from designs and generating designs from prompts. It uses the open `.pen` file format, so you can inspect the contents in a text editor or manage the files in a version control system. It also supports importing from Figma.

In this article, I will share my impressions after actually trying Pencil.

## Installation and Setup

You can download Pencil from the link below. At the moment, it only supports macOS and Linux.

https://www.pencil.dev/downloads

:::note
Pencil is free to use for now, but paid plans are expected to be introduced in the future.
:::

After installation, launch the application and enter your email address when prompted. A verification code will be sent to the registered address, and you can activate the app by entering that code.

![](https://images.ctfassets.net/in6v9lxmm5c8/1TiOiPcITIR429vEMadTAN/ce3a722aa33a9bf182bd4c4d6406fca2/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-24_14.12.06.png)

The canvas feels very similar to Figma. The toolbar on the left shows the list of layers, while the property panel on the right lets you configure the selected object in detail. It includes the standard set of features such as components, design themes and variables, and Flex Layout.

![](https://images.ctfassets.net/in6v9lxmm5c8/7Go5Qk3zvKHyYW9QGXBH3m/334d730710b5432feb4151cc0024db7b/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-24_14.39.24.png)

## Generate Designs from Prompts

Let's try generating a design with AI. First, create a new `.pen` file. You could start with an empty file, but here I will use one of the prepared design system components. Click the second icon from the left in the top toolbar, labeled "Design Kits & Style Guides."

![](https://images.ctfassets.net/in6v9lxmm5c8/4xIfOuC6fDgPqJf3btYvjm/f555946616f59adafe7e4ecbf0640e8d/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-24_14.45.46.png)

The dialog displays the available component kits. Here, I chose "Shadcn UI."

![](https://images.ctfassets.net/in6v9lxmm5c8/6UjzSfUJz7gejfMzbvD9La/97f87acec4b000aa16f435b845813c66/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-24_14.48.06.png)

The Shadcn UI components were added to the canvas.

![](https://images.ctfassets.net/in6v9lxmm5c8/baBEDTzSJElzeeflBxih2/a944f741ba608f8e9740a0c0ec257a67/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-24_14.49.40.png)

The file you create is saved locally as a `.pen` file. Since `.pen` files are stored in JSON format, you can also open them in a text editor and inspect their contents.

```json:new-file.pen
{
  "version": "2.6",
  "children": [
    {
      "type": "frame",
      "id": "MzSDs",
      "x": 0,
      "y": 0,
      "name": "shadcn: design system components",
      "theme": {
        "Mode": "Light",
        "Base": "Neutral",
        "Accent": "Default"
      },
      "clip": true,
      "width": 2800,
      "height": 3586,
      "fill": "$--background",
      "layout": "none",
      "children": [
        /* ... */
      ]
    }
  ],
}
```

There is a chat panel labeled "Design with Claude Code" in the lower-left corner of the canvas, so try entering a design instruction there. It appears that installing Pencil automatically integrates it with Claude Code, and this chat panel uses Claude Code to generate designs. For example, type "Create a login form with email and password fields, and a submit button." and press Enter.

![](https://images.ctfassets.net/in6v9lxmm5c8/1SEEMrOxTgtRrH2TWHRQJu/21cdfb6bfdf10318c3a7ba6283fcb436/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-24_14.51.13.png)

After checking the design guidelines and the list of available components, a login form was generated in an empty area on the canvas.

<video controls src="https://videos.ctfassets.net/in6v9lxmm5c8/6WZ96En6qxuaQM0HWzHWV0/3039752de18a532cc89c99e9cbd8cf18/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2026-01-24_14.51.46.mov"></video>

You can see that the generated login form was indeed built using the existing components.

![](https://images.ctfassets.net/in6v9lxmm5c8/1tVWadXzeotwF3FvbIu1Ta/56930412b4cde69e304d296cc90c7cc2/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-24_14.58.39.png)

## Export Code with Pencil MCP

By using Pencil MCP together with an AI coding tool, you can export code from a design. First, prepare a project created with Next.js and install the Shadcn UI components.

```bash
npx create-next-app@latest my-penciled-app
cd my-penciled-app
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add label
```

It seems Pencil MCP is automatically added to Claude Code when you install Pencil. The following configuration had been added to the `~/.claude.json` file.

```json:~/.claude.json
{
  "mcpServers": {
    "pencil": {
      "command": "/Applications/Pencil.app/Contents/Resources/app.asar.unpacked/out/mcp-server-darwin-arm64",
      "args": [
        "--ws-port",
        "52036"
      ],
      "env": {},
      "type": "stdio"
    }
  }
}
```

Start Claude Code and run the `/mcp` command to confirm that Pencil MCP is available.

```sh
/mcp
```

The main tools are listed below.

| Tool name                         | Description                                                              |
| --------------------------------- | ------------------------------------------------------------------------ |
| `get_editor_state`                | Retrieves the current editor state, selected elements, and available components |
| `open_document`                   | Creates a new document or opens an existing `.pen` file                  |
| `get_guidelines`                  | Retrieves the design guidelines                                           |
| `get_style_guide_tags`            | Retrieves the list of style guide tags                                    |
| `get_style_guide`                 | Retrieves the style guide based on tags                                   |
| `batch_get`                       | Searches for and reads nodes                                              |
| `batch_design`                    | Performs bulk insert/copy/update/replace/move/delete/image operations     |
| `snapshot_layout`                 | Inspects the layout structure                                             |
| `get_screenshot`                  | Retrieves a screenshot of a node                                          |
| `get_variables`                   | Retrieves variables and themes                                            |
| `set_variables`                   | Adds or updates variables                                                 |
| `find_empty_space_on_canvas`      | Searches for empty space on the canvas                                    |
| `search_all_unique_properties`    | Searches for unique property values                                       |
| `replace_all_matching_properties` | Replaces matching properties in bulk                                      |

Enter a prompt like the following to export the login form code using Pencil MCP.

```text
Using Pencil MCP, export the login form from the current design to `/app/login/page.tsx` using Shadcn UI.
```

First, the `get_editor_state` tool is called to retrieve the current editor state. At this point, make sure the login form layer is selected in Pencil. Then the `batch_get` tool retrieves the details of the selected node, and the `get_guidelines` tool fetches the Shadcn UI style guide.

![](https://images.ctfassets.net/in6v9lxmm5c8/7Ay6Awt38MBnREFYQsX0aD/d551151a5dcbbd066486a5ba5493a878/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-24_15.22.03.png)

It looks like the design specification was parsed correctly. Based on that information, it started generating the login form.

![](https://images.ctfassets.net/in6v9lxmm5c8/5qvzxmR1FrpDujz49sIWVG/e378206126d5d2bdf40dfd641d2987e2/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-24_15.26.08.png)

Once the implementation is complete, the `get_screenshot` tool retrieves a screenshot from Pencil and compares it with the code. Here it is adjusting the structure of the title and subtitle.

If you actually visit http://localhost:3000/login, you can see that the login form is displayed with almost the same appearance as the design in Pencil.

![](https://images.ctfassets.net/in6v9lxmm5c8/4kpCrxyxKmHwa0x73zx0F5/6e848730939ae873ae63ebd806e1c1a6/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-24_15.30.20.png)

## Use It from the Terminal and Combine It with MCP Tools

Because Pencil works together with a locally installed Claude Code, you can register MCP servers in Claude Code ahead of time and then use those servers to bring designs into Pencil.

For example, if you register the Playwright MCP server, you can capture a screenshot of a specific website and import that design into Pencil. Register the Playwright MCP server in Claude Code with the following command.

```sh
claude mcp add playwright npx @playwright/mcp@latest
```

It did not look like MCP servers could be used from the chat panel inside Pencil, so let's launch Claude Code from the terminal and ask it to create a design with Pencil MCP.

```sh
claude "Using Playwright MCP, capture the design of azukiazusa.dev and import it into Pencil."
```

The `take_screenshot` tool in Playwright MCP is called to capture a screenshot of the specified website. Then the `batch_design` tool creates a design on the currently open Pencil canvas. The fidelity of the generated design is not very high, but it is interesting that you can combine different tools from the terminal like this.

![](https://images.ctfassets.net/in6v9lxmm5c8/7h5S4Y2xTt7qrpGJuCdeWB/d68f9f417783d9a1be91896fe3c31cd5/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-24_15.45.50.png)

You could also imagine other workflows, such as analyzing code in a repository and importing the resulting design. For example, prompts like the following:

```sh
claude "Using Pencil MCP, analyze the code in the app/ directory and recreate the design of the top page in Pencil."
```

```sh
claude "Using Pencil MCP, analyze the code for the Button component in the components/ directory and import it as a Pencil component."
```

Because you can build designs with Claude Code using the same workflow as AI coding, I found it particularly appealing that you can directly reuse the know-how you have built up from AI coding. This time I did not get especially good output when trying to turn a screenshot directly into a design, but I think better results could come from using Plan mode and designing interactively with AI, just as you would in regular AI coding.

## Summary

- Pencil is a UI design tool with a Figma-like feel. It can run AI in parallel on the canvas to generate designs, and it can also work with AI coding tools such as Claude Code and Cursor to export code.
- By using Pencil MCP with Claude Code, it is possible to export code from a design. It was able to analyze the selected node in Pencil and generate code using Shadcn UI components.
- You can also launch Claude Code from the terminal and combine Pencil MCP with other MCP servers. I tried using Playwright MCP to capture the design of a website and reproduce it in Pencil.

## References

- [Pencil – Design on canvas. Land in code.](https://www.pencil.dev/)
