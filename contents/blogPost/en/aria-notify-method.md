---
id: W0Mn026m0wJ_FAnrkxf7T
title: "Imperatively Notify Assistive Technologies with the `ariaNotify()` Method"
slug: "aria-notify-method"
about: "The `ariaNotify()` method is a Web API for notifying assistive technologies about dynamic content updates. Unlike traditional WAI-ARIA patterns based on declarative attributes, it lets JavaScript send notifications at the exact timing you intend."
createdAt: "2026-04-21T20:04+09:00"
updatedAt: "2026-04-21T20:04+09:00"
tags: ["Web API", "アクセシビリティ"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1z5Uwhp5WNxRofatcykwXT/70e20696e3e65d27879cc64d6552f9d8/egg-tart_23461-768x591.png"
  title: "エッグタルトのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "According to the article, why was `ariaNotify()` intentionally designed as a write-only API with no return value?"
      answers:
        - text: "To prevent notification conflicts when the method is called multiple times"
          correct: false
          explanation: "The article explains that multiple calls may result in only the latest notification being read, but that is not why the API has no return value."
        - text: "To prevent it from being abused as a fingerprint for detecting whether assistive technology is installed"
          correct: true
          explanation: "As the article states, the lack of a return value is a deliberate design choice to avoid the API being misused for fingerprinting."
        - text: "To avoid performance overhead in the browser's JavaScript engine"
          correct: false
          explanation: "The article does not mention JavaScript engine performance as the reason."
        - text: "To preserve backward compatibility with older assistive technologies"
          correct: false
          explanation: "Backward compatibility is not given as the reason in the article."
    - question: "According to the article, `document.ariaNotify(message, { priority: \"normal\" })` is roughly equivalent to which traditional `aria-live` value?"
      answers:
        - text: "`aria-live=\"assertive\"`"
          correct: false
          explanation: "`priority: \"high\"` is the one that roughly corresponds to `aria-live=\"assertive\"`."
        - text: "`aria-live=\"off\"`"
          correct: false
          explanation: "`aria-live=\"off\"` disables announcements and does not match `priority: \"normal\"`."
        - text: "`aria-live=\"polite\"`"
          correct: true
          explanation: "The article explains that `priority: \"normal\"` roughly maps to `aria-live=\"polite\"`, while `priority: \"high\"` maps to `aria-live=\"assertive\"`."
        - text: "`aria-atomic=\"true\"`"
          correct: false
          explanation: "`aria-atomic` controls whether the whole live region is read as a unit, so it is not equivalent to `priority`."
    - question: "How does the article explain language selection when assistive technology reads a notification sent with `ariaNotify()`?"
      answers:
        - text: "The language is inferred automatically from the notification text itself"
          correct: false
          explanation: "The article does not say the language is inferred from the text content."
        - text: "It checks the `<html>` element's `lang` attribute first, and if that is missing, falls back to the browser's language settings"
          correct: true
          explanation: "The article explicitly says the `<html>` element's `lang` attribute is used first, with the browser language as a fallback."
        - text: "You must explicitly pass a `lang` option as the second argument to `ariaNotify()`"
          correct: false
          explanation: "The only option introduced in the article is `priority`; it does not describe a `lang` option."
        - text: "The operating system language setting is always used in preference to everything else"
          correct: false
          explanation: "The article does not say the OS language always takes priority. It says the `<html>` `lang` attribute is checked first."
    - question: "According to the article, what usually happens if `ariaNotify()` is called several times in quick succession?"
      answers:
        - text: "Every notification is guaranteed to be queued and read in order"
          correct: false
          explanation: "The article notes that some assistive technologies may read them in order, but this is not guaranteed by the specification."
        - text: "Only the most recent notification is likely to be read, so combining the message into one call is more reliable"
          correct: true
          explanation: "This matches the article's explanation that usually only the latest notification is read, so one combined call is more reliable."
        - text: "The second and later calls throw an exception, so the notifications are not sent"
          correct: false
          explanation: "The article does not say repeated calls throw an exception."
        - text: "Only the first notification is read and all later ones are ignored"
          correct: false
          explanation: "The article says the opposite is more likely: only the latest notification may be read."
published: true
---
The `ariaNotify()` method is a Web API that provides an imperative way to notify users of assistive technologies about dynamic content updates. Traditional WAI-ARIA patterns usually conveyed information to assistive technologies through declarative attributes such as `aria-label="xxx"` or `aria-checked="true"`. In contrast, `ariaNotify()` is notable because it lets JavaScript send a notification at a specific moment.

The `ariaNotify()` method is intended for scenarios such as the following.

- Announcing when a new message arrives in a chat app, especially when you want to notify the user only after AI-generated output is complete
- Announcing when a participant joins or leaves a video conferencing app
- Announcing that an item was added to a shopping cart, because a user without a visual impairment may notice the cart icon changing while a user relying on assistive technology needs an explicit notification
- Events not tied to a DOM change, such as formatting changes like making text bold with `Ctrl+B`
- Announcing the contents of a new page after navigation in an SPA (Single Page Application)

Traditionally, for use cases like these, developers often created a DOM element with the `aria-live` attribute and used it to send notifications to assistive technologies. For example, when adding an item to a shopping cart, the code might look like this.

```html
<!-- aria-live="polite" instructs assistive technologies to notify the user when the content changes -->
<!-- If the notification must interrupt the user's current action, prepare a separate aria-live="assertive" element -->
<div
  id="live-region"
  role="status"
  aria-live="polite"
  aria-atomic="true"
  class="visually-hidden"
></div>

<button id="add-btn">Add to cart</button>

<style>
  /* visually-hidden hides content visually */
  /* display: none; also hides it from assistive technologies, so positioning it off-screen is a common approach */
  .visually-hidden {
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
</style>

<script>
  const liveRegion = document.getElementById("live-region");

  function announce(message) {
    // A common hack: clear the text once and set it again with setTimeout
    // so the same string can still be re-announced
    liveRegion.textContent = "";
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 100);
  }

  document.getElementById("add-btn").addEventListener("click", () => {
    // ...process for adding the item to the cart...
    announce("Item added to cart. 3 items.");
  });
</script>
```

In the example above, an element with `aria-live="polite"` is prepared, and the JavaScript `announce` function updates its content so assistive technologies can announce it. However, this approach had several problems.

- It increases implementation complexity because you need visually hidden elements and sometimes hacks like clearing and re-setting text
- Even when the DOM is updated, the change may not be conveyed correctly to assistive technologies. For example, if a shared live region is placed at the end of the DOM and managed as a singleton across the whole site, notifications may fail while a modal dialog is open. Live region implementations also differ across browsers and screen readers, so the same code may behave differently depending on the environment (for details, see [Improving Notification Handling with AriaNotify](https://www.w3.org/2025/Talks/aria-notify-breakouts-2025.pdf))
- The timing of `polite` and `assertive` announcements depends on the assistive technology implementation, so notifications do not always occur exactly when intended

The `ariaNotify()` method was designed to solve these problems. Because it lets JavaScript send a notification at a specific time, it provides a more flexible and reliable way to communicate dynamic content changes.

This article explains how to use the `ariaNotify()` method, including implementation examples and important caveats.

## How to use the `ariaNotify()` method

The `ariaNotify()` method is defined on `Element.prototype`, so it can be called from any element. Because `Document` also shares the same interface as a `ParentNode`, calling it on `document` is the simplest approach.

```javascript
document.ariaNotify("Ibuki has joined the room.");
```

Running this code sends the notification "Ibuki has joined the room." to users of assistive technologies. The `ariaNotify()` method was intentionally designed as a write-only API, so there is no way to determine from a return value whether the notification was actually delivered. This is a design decision intended to prevent it from being abused for fingerprinting.

Depending on the assistive technology, multiple `ariaNotify()` calls may sometimes be read in order, but that behavior is not guaranteed by the specification. In general, only the latest notification is likely to be read, so one combined call is more reliable than multiple separate calls.

```javascript
// If called consecutively, only the final notification is likely to be read
document.ariaNotify("Item added to cart");
document.ariaNotify("3 items.");

// Combining it into one call is more reliable
document.ariaNotify("Item added to cart. 3 items.");
```

:::warning
Be careful not to call `ariaNotify()` excessively, because that can create an annoying experience for people using assistive technologies.
:::

### Specify notification priority

You can specify the priority of the notification using the options object in the second argument. There are two values: `priority: "high"` and `priority: "normal"` (the default). These are roughly equivalent to `aria-live="assertive"` and `aria-live="polite"` respectively.

```javascript
// Example of sending a high-priority notification
document.ariaNotify("An error occurred, so the data could not be saved.", {
  priority: "high",
});
```

:::warning
If you use `priority: "high"`, the announcement may interrupt the user's current activity. Use it only for information that is genuinely important. Frequent interruptions can be stressful for people using assistive technologies.
:::

### Language selection

When assistive technologies read a notification sent with `ariaNotify()`, they refer to the `<html>` element's `lang` attribute, which affects things like pronunciation and accent. If the `lang` attribute is not present, they fall back to the user's browser language settings. Therefore, if you want a notification to be read in a specific language, you should make sure the `lang` attribute is set appropriately.

```html
<!-- If you want the notification to be read in Japanese -->
<html lang="ja">
  ...
</html>

<script>
  // It will be read with Japanese pronunciation and accent
  document.ariaNotify("商品をカートに追加しました。3点。");
</script>
```

## Example: adding an item to a shopping cart

Let's look at a concrete example using the `ariaNotify()` method. We will implement the shopping cart example described earlier with `ariaNotify()`. Compared with the traditional `aria-live` approach, the code becomes much simpler.

```html
<button id="add-btn">Add to cart</button>

<script>
  document.getElementById("add-btn").addEventListener("click", () => {
    // ...process for adding the item to the cart...
    document.ariaNotify("Item added to cart. 3 items.");
  });
</script>
```

When I tried this with VoiceOver on macOS, I confirmed that clicking the "Add to cart" button caused VoiceOver to announce, "Item added to cart. 3 items." (tested in Chrome Canary 149).

<video controls src="https://videos.ctfassets.net/in6v9lxmm5c8/62IQHgq9ENFdPQHbphcHsH/f6f1475158cafbcae81b083bc272afd4/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2026-04-23_21.12.17.mov"></video>

## Summary

- The `ariaNotify()` method is a Web API that provides an imperative way to notify users of assistive technologies about dynamic content updates
- The traditional approach was to add a DOM element with `aria-live`, but that came with problems such as implementation complexity and uncertainty around notification timing
- Because `ariaNotify()` lets JavaScript send notifications at the exact moment you choose, it can communicate updates with simpler code
- You can control notification priority, but excessive use can create an annoying experience for users, so it should be used carefully

## References

- [Accessible Rich Internet Applications (WAI-ARIA) 1.3](https://w3c.github.io/aria/#ARIANotifyMixin)
- [Element: ariaNotify() method - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/ariaNotify)
- [WICG/accessible-notifications: ARIA Accessible Notifications](https://github.com/WICG/accessible-notifications)
- [Improving Notification Handling with AriaNotify](https://www.w3.org/2025/Talks/aria-notify-breakouts-2025.pdf)
- [Understanding Success Criterion 4.1.3: Status Messages | WAI | W3C](https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html)
- [aria-live - ARIA | MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-live)
- [ARIA Notifyについて - Speaker Deck](https://speakerdeck.com/ryokatsuse/aria-notifynituite)
