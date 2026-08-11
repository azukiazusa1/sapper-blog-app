---
id: sFCY3FhT_OTSlTZpFV1J
title: "How Should a Streaming Chat UI Announce Its Response to Screen Readers?"
slug: "accessible-streaming-chat-ui"
about: "Generative AI chat UIs reveal answers a few characters at a time. Piping those updates into a live region makes screen readers read the response in fragments. I survey ChatGPT, Claude, and four chat UI libraries, then build an accessible sample."
createdAt: "2026-08-11T10:42+09:00"
updatedAt: "2026-08-11T10:42+09:00"
tags: ["アクセシビリティ", "HTML"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/690k8v3n0hHk9XhusHAYoC/0a23f8cfdbe244e286053550bb867ee3/bird-osprey_23912-768x748.png"
  title: "ミサゴのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "What effect does adding `aria-atomic=\"true\"` to a live region have on announcements?"
      answers:
        - text: "It narrows down which kinds of changes are announced, such as element additions or text changes"
          correct: false
          explanation: "That describes `aria-relevant`. `aria-atomic` controls how much of the region is announced, not which kinds of changes qualify."
        - text: "It announces the region as a single unit, even when only part of it changed"
          correct: true
          explanation: "As the article explains, when a result count changes from 1 to 2, `aria-atomic=\"true\"` makes the screen reader announce the whole region: \"2 results found.\""
        - text: "It signals that updates to the element are not finished yet, holding announcements until they are"
          correct: false
          explanation: "That describes `aria-busy`. `aria-busy` indicates whether updates are complete and has nothing to do with how much of the region is announced."
        - text: "It interrupts whatever is currently being read and announces immediately"
          correct: false
          explanation: "Interrupting is what `aria-live=\"assertive\"` does. The article notes it should be reserved for a small number of cases, such as important warnings."
    - question: "Why does the sample's `announce()` function clear `textContent` first and then set the message after a short delay?"
      answers:
        - text: "Because an element with `role=\"status\"` is not announced right after it is inserted into the DOM"
          correct: false
          explanation: "It is true that a dynamically inserted `role=\"status\"` may not be announced, but the article handles that separately by placing the element in the DOM from the start. That is a different concern from clearing the text."
        - text: "Because assigning exactly the same text as before may not register as a change, leaving it unannounced"
          correct: true
          explanation: "As the article explains, screen readers announce live regions by detecting changes, so clearing the text first makes a repeated message more likely to be picked up as a change."
        - text: "Because an element with `aria-atomic=\"true\"` will not announce the whole region unless it is emptied first"
          correct: false
          explanation: "`aria-atomic=\"true\"` announces the region as a single unit whenever it changes. There is no need to empty it beforehand."
        - text: "Because `polite` announcements must always be delayed by 100 milliseconds so they do not interrupt speech"
          correct: false
          explanation: "`polite` already waits for a moment that does not interrupt the user. You do not need to add a delay yourself; the article presents the 100 milliseconds as a way to make the change detectable."
published: true
---
Since generative AI arrived, chat UIs that let you talk to an AI through a text box have become part of everyday life. Traditional chat apps typically appended each message once it was complete, but an LLM (large language model) reveals its response gradually, over several seconds to tens of seconds.

Sighted users can tell that generation has started, and that it is still going, simply by watching the text grow. Screen readers, on the other hand, do not announce content just because the DOM changed. Without any extra work, users never learn that a response has started, and they are not told when it finishes.

The usual way to tell assistive technology that content has been added dynamically is an [ARIA live region](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions). Implement it the wrong way, though, and you risk the opposite problem: the half-finished text gets announced over and over in fragments. In the video below, the screen reader repeats the first few characters every time a new chunk arrives, stuttering endlessly.

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/52VhYuarp0pOwGI9uJOL7C/44ca28d47b9927349124a83313425b45/8057bdae-e934-4ec9-92ae-732ba6d8cf53.mov" controls></video>

In this article I look at how existing services and libraries announce streaming responses to screen readers, then build a sample that puts those findings into practice.

The core practice is this: **do not make the streaming response body itself an automatic announcement target. Instead, announce only short status messages such as "Generating a response" or "Response complete" from a separate element.** Separating the response body from the status announcement prevents the in-progress text from being read out in fragments, while still communicating when generation starts and finishes.

The screen reader behavior described in this article was verified in the following environment.

- macOS 26.5.1
- Google Chrome 151.0.7922.77
- VoiceOver bundled with macOS

## What Is an ARIA Live Region?

When the content of a page changes while the user is not interacting with it — as in a chat UI — you need some way to communicate that change. ARIA live regions are the mechanism for telling screen readers about dynamic changes. When the content of an element carrying `aria-live` changes, the browser passes that change to assistive technology through the accessibility API. Let's start with the basics.

```html
<!-- Content is expected to be updated dynamically with JavaScript -->
<div aria-live="polite"></div>
```

These are the `aria-live` values you will mostly use.

- `polite`: announce at a moment that does not interrupt what the user is currently listening to
- `assertive`: interrupt the current announcement
- `off`: do not announce changes automatically, except in cases such as when the element has focus

Frequent interruptions get in the user's way, so use `polite` for ordinary status announcements. Reserve `assertive` for the small number of cases that genuinely need immediate attention, such as important warnings.

Some ARIA roles carry an implicit `aria-live`. For example, the [`status` role](https://www.w3.org/TR/wai-aria-1.2/#status) implies `aria-live="polite"` and `aria-atomic="true"`, and the [`log` role](https://www.w3.org/TR/wai-aria-1.2/#log) implies `aria-live="polite"`.

`aria-atomic="true"` says that even when only part of the live region changes, the region should be announced as a single unit. Say a result count changes from 1 to 2: with `aria-atomic="true"`, the screen reader announces the whole thing — "2 results found." Without it, the user hears just "2" and has no idea what the 2 refers to.

```html
<div role="status" aria-atomic="true">
  <span id="result-count">1</span> results found
</div>

<button id="search">Search</button>

<script>
  const count = document.querySelector("#result-count");
  const search = document.querySelector("#search");

  search.addEventListener("click", () => {
    count.textContent = "2";
  });
</script>
```

## `role="log"` Is the Role for Chat History

The `log` role represents a region where old information is not removed and new information is appended to the end in a meaningful order. Chat history, error logs, and game logs are typical examples.

The W3C's WCAG Techniques even use a [chat conversation history as its example of `role="log"`](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA23). In other words, applying `role="log"` to chat history is itself a standard approach.

```html
<div role="log" aria-label="Chat history">
  <!-- New messages are appended to the end -->
</div>
```

In chat UIs from before LLMs, a message the user sent was typically appended to the DOM in its finished state. Just specifying `role="log"` was enough for a screen reader to announce a new message once. Since LLMs arrived, though, the response is generated bit by bit: an element is added for the response, and then its text is rewritten many times over. Repeating those updates inside a `role="log"` — which is implicitly `aria-live="polite"` — risks assistive technology announcing the half-finished text on every single change.

So in the post-LLM era, `role="log"` alone is not enough. The way streaming responses get announced needs careful design. Let's look at how real services and libraries handle it.

## ChatGPT's HTML Structure

First, let's see what DOM ChatGPT builds while a conversation is being generated.

ChatGPT does not wrap the conversation in any particular `role`. Each turn from the user and from ChatGPT is expressed as a `<section>` element, with a visually hidden `<h4>` identifying the sender. On screen you can tell a user message from an AI response by which side the bubble sits on, but a screen reader cannot perceive that visual difference — which is presumably why the sender is spelled out in visually hidden text.

```html
<section data-turn="user">
  <h4 class="sr-only">You:</h4>
  <!-- User's message -->
</section>

<section data-turn="assistant">
  <h4 class="sr-only">ChatGPT:</h4>
  <!-- ChatGPT's response -->
</section>
```

:::note
`sr-only` is a CSS class that hides content visually while keeping it readable by screen readers. Using `display: none` or `hidden` would remove it from the accessibility tree as well, so techniques such as clipping the element down to a 1px area are used instead.
:::

ChatGPT's response body carries neither `aria-live` nor `aria-busy`. In other words, the dynamically updated response text is never announced automatically. Separately from the response, there is a visually hidden element with `role="status" aria-live="polite" aria-atomic="true"`. That element is updated with text such as "Thinking" while generating and "Response complete" once generation ends, announcing the state of the response.

```html
<div role="status" aria-live="polite" aria-atomic="true" class="sr-only"></div>

<script>
  const status = document.querySelector('[role="status"]');

  // When response generation starts
  status.textContent = "Thinking";

  // When response generation completes
  status.textContent = "Response complete";
</script>
```

Checking this with a screen reader confirms it: after submitting the form you hear "Thinking," and when generation finishes you hear "Response complete."

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/6pikr3spDt8RcsmFSBKmon/c9c495b81ee64d44fba1707105fe97fc/94613c83-ad1e-469f-bb38-38d153c1884b.mov" controls></video>

So ChatGPT never makes the body itself an announcement target; it communicates state through short text instead. Screen reader users learn that the response is complete, and can then read through the response body whenever they choose.

## Claude's HTML Structure

Claude's conversation history uses the [ARIA `feed` pattern](https://www.w3.org/WAI/ARIA/apg/patterns/feed/). A `feed` represents a collection of content added in a meaningful order, of the kind users scroll through to review earlier messages.

```html
<div role="feed" aria-label="Chat messages">
  <div
    role="article"
    aria-posinset="1"
    aria-setsize="2"
    aria-label="Message 1 of 2"
  >
    <!-- Message -->
  </div>
</div>
```

Each message is a `role="article"`, and `aria-posinset` and `aria-setsize` express its position within the history and the total count.

- `aria-posinset`: which position the element occupies in the set. In the example above, the first message
- `aria-setsize`: how many elements the whole set contains. In the example above, two messages in total

You use these attributes when the position and total cannot be inferred from the number of elements present in the DOM. In a UI like chat history, where older messages are lazily loaded, only some of the messages may exist in the DOM — so these attributes let you convey something like "item 15 of 20" to assistive technology correctly.

While a response is being generated it carries `aria-label="Currently streaming message"`, and once generation completes the name changes to something like `aria-label="Message 2 of 2"`.

Like ChatGPT, Claude places an `sr-only` heading at the start of each message to identify the sender. User messages use "You said," and Claude's responses use "Claude responded."

```html
<div role="article" aria-label="Message 1 of 2">
  <h2 class="sr-only">You said: What day is it today?</h2>
  <!-- User's message -->
</div>

<div role="article" aria-label="Message 2 of 2">
  <h2 class="sr-only">Claude responded: August 11 is Mountain Day in Japan</h2>
  <!-- Claude's response -->
</div>
```

On screen you can distinguish senders by message position and styling, but none of that visual difference reaches a screen reader. Spelling out the sender as a heading not only tells users who said what, it also lets them jump between messages using heading navigation.

`feed` is not a role you simply slap on any scrollable list. Claude includes screen-reader-only instructions saying that the up and down arrow keys move between messages, and each `article` is focusable. If you adopt `feed`, you need to implement its conventions for focus movement and content loading too.

Claude also keeps the streaming response body out of any live region. A separate `role="status"` announces "Claude is responding" when generation starts and "Claude finished the response" when it ends. Focus stayed in the input field even after the response completed.

ChatGPT and Claude structure their history differently, but they share these three traits.

- The streaming response body is never announced as a live region
- Short status text is announced from a `role="status"` separate from the response body
- `sr-only` headings distinguish the user's messages from the AI's

## How Chat UI Libraries Implement This

Next I looked at how front-end libraries for building chat UIs handle it. I checked these four.

- assistant-ui
- Vercel AI Elements
- CopilotKit
- shadcn/ui Chat Components

After reading their implementations, I verified the screen reader output for each one with VoiceOver and Chrome.

### assistant-ui

assistant-ui's [default Thread component](https://github.com/assistant-ui/assistant-ui/blob/8bba3aaadcae042b4750436e6aa62bbba4815dde/packages/ui/src/components/assistant-ui/thread.tsx) renders the history and each message as plain `<div>` elements. The response body in the default template carries neither `role="log"` nor `aria-live`.

The dot indicator shown during generation has `aria-label="Assistant is working"`, but that element is not a live region. The separately provided [TypingIndicator component](https://github.com/assistant-ui/assistant-ui/blob/8bba3aaadcae042b4750436e6aa62bbba4815dde/packages/ui/src/components/elements/typing-indicator.tsx), on the other hand, does use `role="status"` with `aria-label="Assistant is typing"`.

So screen readers are told that a response is being generated, but there is no mechanism to announce that it finished. As a result, screen reader users have no way to notice that generation is done.

### Vercel AI Elements

Vercel AI Elements' [Conversation component](https://github.com/vercel/ai-elements/blob/0c1f5e8c75273f0e95c8faa031544a8aa2bb1a5b/packages/elements/src/conversation.tsx) carries `role="log"`. That means the conversation history becomes an implicitly `polite` live region even if you never add `aria-live` yourself.

Consequently, when the response body streams in, the screen reader may read the in-progress text out in fragments.

### CopilotKit

For CopilotKit I checked the current [v1 Messages component](https://github.com/CopilotKit/CopilotKit/blob/bee39139bdaf5184b3590506edc66b8e68738e06/packages/react-ui/src/components/chat/Messages.tsx) and [v2 CopilotChatMessageView](https://github.com/CopilotKit/CopilotKit/blob/bee39139bdaf5184b3590506edc66b8e68738e06/packages/react-core/src/v2/components/chat/CopilotChatMessageView.tsx).

Both build the message list out of ordinary `<div>` elements. I found no `role="log"`, `aria-live`, or `role="status"` covering the streaming response.

Any mechanism for announcing the start and completion of a response has to be added by the application.

### shadcn/ui Chat Components

shadcn/ui shipped [official Chat Components](https://ui.shadcn.com/docs/changelog/2026-06-chat-components) in June 2026.

Its central [MessageScrollerContent](https://github.com/shadcn-ui/ui/blob/d14b6e69a91f0fc99e31a7adb26a48d661df9911/packages/react/src/message-scroller/components.tsx#L221) sets `role="log"` and `aria-relevant="additions"` by default. `aria-relevant` specifies which kinds of changes inside a live region should be announced. These are the values you can use.

- `additions`: changes where an element node is added inside the live region
- `text`: changes where text content or a text node is added
- `removals`: changes where text or an element node is removed
- `all`: equivalent to `additions removals text`

If you do not specify `aria-relevant`, the default is `additions text`. That is, both element additions and text changes are announced.

shadcn/ui deliberately specifies only `additions` in order to drop `text` from that default. As a result, adding a new message element is announced, while rewriting the contents of an existing element via streaming falls outside the scope. It is precisely a way to avoid streaming responses being read out in fragments.

That said, assistive technologies interpret `aria-relevant` differently. According to the test results on [Accessibility Support](https://a11ysupport.io/tests/tech__aria__aria-relevant), the default `additions text` is supported across all screen readers, whereas specifying `additions` on its own is unsupported in NVDA and only partially supported in VoiceOver and JAWS.

The [streaming example](https://github.com/shadcn-ui/ui/blob/d14b6e69a91f0fc99e31a7adb26a48d661df9911/apps/v4/examples/base/message-scroller-streaming.tsx#L144) also sets `aria-busy="true"` on `MessageScrollerContent` while a response is in flight.

`aria-busy` indicates that updates to an element are not yet complete. Per the specification, assistive technology may hold changes while `aria-busy="true"` and process them together once it becomes `false`. But the [WAI-ARIA specification](https://www.w3.org/TR/wai-aria-1.2/#aria-busy) frames holding those announcements as a "MAY" requirement, so different screen reader and browser combinations will not necessarily produce the same output.

Testing with VoiceOver and Chrome, I confirmed that announcements were held while the response was generating and only read out, all at once, after generation completed. That does avoid the fragmented-announcement problem, but a long response being read out in one go after completion can get in the user's way. Excessive announcements are not a good experience. See also [Understanding Success Criterion 4.1.3: Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages).

### Summary of the Library Survey

Here is what the four libraries do, side by side.

| Library | History role | Announced during generation | Announced on completion | What you need to add |
| --- | --- | --- | --- | --- |
| assistant-ui | None (`<div>`) | `role="status"` (TypingIndicator) | None | A mechanism to announce completion |
| Vercel AI Elements | `role="log"` | Response body announced implicitly | None | `aria-live="off"` on the history, plus a separate status announcement |
| CopilotKit | None (`<div>`) | None | None | Announcements for both start and completion |
| shadcn/ui Chat Components | `role="log"` + `aria-relevant="additions"` | Held via `aria-busy="true"` | Body read out in full after completion | Replacing this with status announcements, plus per-AT testing |

As you can see, there is not much consistency between libraries. What they do have in common is that whichever one you pick, the mechanism for announcing the start and completion of a response as short text is something your application has to provide. Testing with an actual screen reader matters too, since behavior can differ between assistive technologies.

## A Real Issue Where Every Token Was Announced

There is a real-world case where updating a streaming response inside a live region caused problems. OpenClaw streamed responses inside a chat history carrying `role="log"` and `aria-live="polite"`. The result was an [issue reporting that responses were announced token by token, or chunk by chunk](https://github.com/openclaw/openclaw/issues/65538), in the NVDA and Firefox combination. Silencing the speech did not help, because the next update started it again, leaving the UI nearly unusable while a response was in flight.

The issue proposed switching to `aria-live="off"` only during generation, and holding updates with `aria-busy`. But because testing with real assistive technology was lacking and cross-screen-reader compatibility was unclear, the proposed PRs were not merged as-is.

OpenClaw today uses [`role="log" aria-live="off"`](https://github.com/openclaw/openclaw/blob/c7b7fe4c328b/ui/src/pages/chat/components/chat-thread.ts#L1927) for the history and announces the completed response from a separate, visually hidden [`role="status" aria-live="polite" aria-atomic="true"`](https://github.com/openclaw/openclaw/blob/c7b7fe4c328b/ui/src/pages/chat/components/chat-thread.ts#L1962). With this setup the response body itself is never announced to screen readers; only short text such as "Response complete" is.

This case reinforces how important it is to design the streaming body and the automatically announced content as two separate things.

## Building an Accessible Chat UI

With all of that in hand, let's pin down what a chat UI needs in accessibility terms. Three things matter most.

- The response body is not announced to screen readers automatically
- The start, completion, cancellation, and failure of a response are announced to screen readers
- The sender of each message is discoverable by screen readers, without relying on visual presentation

Let's build a sample chat UI that satisfies these. First, give the chat history container `role="log"` along with `aria-live="off"`.

```html
<div
  id="messages"
  role="log"
  aria-live="off"
  aria-label="Chat history"
  tabindex="0"
>
  <!-- Streaming messages -->
</div>
```

Specifying `aria-live="off"` disables the implicit live region that comes with `role="log"`, so the streaming response body is no longer read out automatically.

You might wonder whether there is any point in specifying `role="log"` at all, then. But even with `aria-live` disabled, the role and the accessible name remain in the accessibility tree. Inspecting Chrome's accessibility tree confirms it: even with `aria-live="off"`, the element is still exposed as a `log` named "Chat history."

In other words, silencing automatic announcements and describing what the region is are two separate concerns. `role="log"` stays to tell assistive technology that this region is "a history where old information is not removed and new information is appended in order."

`tabindex="0"` is there because the history region is scrollable. If the user cannot put focus on a scrollable region, keyboard users who do not use a mouse cannot scroll back to older messages. Since `aria-label` is set, focusing it announces "Chat history."

That alone, though, still leaves screen reader users unaware of when a response starts or finishes.

So alongside the history, prepare an empty `role="status"`. Updating its text when a response starts, completes, is cancelled, or fails is what announces those events to screen readers. Because the contents of a `role="status"` element inserted into the DOM dynamically may not be announced, you need to place it in the DOM from the start.

```html
<div
  id="chat-status"
  class="sr-only"
  role="status"
  aria-live="polite"
  aria-atomic="true"
></div>
```

`role="status"` implies `aria-live="polite"` and `aria-atomic="true"`, so omitting those attributes would mean the same thing — they are spelled out here for clarity.

This content should never appear on screen; only screen readers should read it. As mentioned earlier, `display: none` and `hidden` would strip it from the accessibility tree too, so we define an `.sr-only` class to hide it visually instead.

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

Then update only the `status` text as the response moves through its lifecycle.

```javascript
function announce(message) {
  const status = document.querySelector("#chat-status");

  status.textContent = "";
  setTimeout(() => {
    status.textContent = message;
  }, 100);
}

announce("Generating a response");

// Only the response body is updated while streaming

announce("Response complete");
```

Note that `textContent` is cleared first and then set after a short `setTimeout`. Screen readers announce live regions by detecting changes, so assigning exactly the same text as before may not count as a change and may go unannounced. Clearing it to an empty string first is an implementation trick that makes a repeated message more likely to be detected as a change. Bear in mind that the actual result depends on the browser and assistive technology combination.

Cancellation and failure are announced politely from the same `status`.

```javascript
announce("Response generation cancelled");
announce("Could not generate a response. Please try again");
```

A generation failure is not usually an emergency that must interrupt whatever the user is doing, so I do not use `role="alert"` or `aria-live="assertive"`.

### Don't Convey the Sender Visually Only

Chat UIs typically indicate the sender by putting user messages on the right and AI responses on the left, or by changing the bubble color. But position and color alone tell a screen reader nothing about who sent what.

In the sample, each message is an `<article>` with an `sr-only` heading identifying the sender.

```html
<article aria-labelledby="message-2-author">
  <h2 id="message-2-author" class="sr-only">AI response</h2>
  <div>Response body</div>
</article>
```

This way, users reading back through the history can still tell who said what.

### Keep Focus in the Input After Submitting

Never force focus onto the response when generation starts or completes. The user may lose what they were typing, or their place in what they were reading. The [specification for the `status` role](https://www.w3.org/TR/wai-aria-1.2/#status) likewise asks that focus not be moved to a `status` merely because its state changed.

In the sample, focus stays in the input field after submitting. The "Stop" button shown during generation is a regular `<button>`, so users who need it can reach it with the `Tab` key. When the "Stop" button is pressed, focus returns to the input field the moment the button disappears, so the user can go straight on to the next question.

## Verifying with VoiceOver and Chrome

Checking the sample with VoiceOver and Chrome confirms the following behavior.

1. After the form is submitted, "Generating a response" is announced once
2. The response body streaming in is not read out automatically
3. On completion, "Response complete" is announced once
4. Focus stays in the input field both after submitting and after completion
5. Reading back through the history reveals "Your message" and "AI response" headings

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/5pxk9zdR9SudNGkylPM4Tq/c239781b83af31a01b27d1a69a8aec08/539a1882-7210-4429-8cf2-084e1e8b7dcc.mov" controls></video>

You can see the full code in the CodePen below.

<iframe height="300" style="width: 100%;" scrolling="no" title="Demo of a streaming chat UI with separated status announcements" src="https://codepen.io/azukiazusa1/embed/YPNMZRG?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/YPNMZRG">
  A streaming chat UI with separated status announcements</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Summary

- `role="log"` is the standard role for chat history, and it implies `aria-live="polite"`
- Streaming an LLM response directly inside a `role="log"` can announce the half-finished text in fragments
- ChatGPT and Claude announce generation state from a `role="status"` separate from the streaming response body
- Chat UI libraries are not consistent about this; whichever one you pick, your application has to provide the mechanism that announces the start and completion of a response as short text
- The sample gives the history `role="log" aria-live="off"` and announces start, completion, cancellation, and failure briefly from a separate `role="status"`
- Do not rely on `aria-busy` alone to control announcements; test with the screen readers and browsers you target

## References

- [WAI-ARIA 1.2: log role](https://www.w3.org/TR/wai-aria-1.2/#log)
- [WAI-ARIA 1.2: status role](https://www.w3.org/TR/wai-aria-1.2/#status)
- [WAI-ARIA 1.2: aria-busy](https://www.w3.org/TR/wai-aria-1.2/#aria-busy)
- [ARIA23: Using role=log to identify sequential information updates](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA23)
- [Understanding Success Criterion 4.1.3: Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages)
- [Feed Pattern | APG | WAI | W3C](https://www.w3.org/WAI/ARIA/apg/patterns/feed/)
- [Test: aria-relevant attribute | Accessibility Support](https://a11ysupport.io/tests/tech__aria__aria-relevant)
- [OpenClaw: Screen readers announce every token during streaming](https://github.com/openclaw/openclaw/issues/65538)
- [assistant-ui](https://github.com/assistant-ui/assistant-ui)
- [Vercel AI Elements](https://github.com/vercel/ai-elements)
- [CopilotKit](https://github.com/CopilotKit/CopilotKit)
- [shadcn/ui Chat Components](https://ui.shadcn.com/docs/changelog/2026-06-chat-components)
