---
id: -EbSLH9el56yjKmYc44Nf
title: 'Displaying Capability Elements as Icons Only with `displaymode="icon-only"`'
slug: "capability-elements-icon-only"
about: 'Chrome has implemented a `displaymode="icon-only"` attribute that renders `<camera>`, `<microphone>`, and `<geolocation>` as icon buttons without text. This article explains how to use `displaymode="icon-only"`.'
createdAt: "2026-11-07T19:24+09:00"
updatedAt: "2026-11-07T19:24+09:00"
tags: ["HTML"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/M3IFAg1x3VbDSPHHXDe0g/ccffb9b798b2eb90c9258b65e8f21fbb/food_sasa-dango_10772-768x630.png"
  title: "笹団子のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: 'In Chrome''s implementation, which element is NOT rendered as an icon even when you add `displaymode="icon-only"`?'
      answers:
        - text: "`<camera>`"
          correct: false
          explanation: ""
        - text: "`<geolocation>`"
          correct: false
          explanation: ""
        - text: "`<usermedia>`"
          correct: true
          explanation: ""
        - text: "`<microphone>`"
          correct: false
          explanation: ""

published: true
---

!> As of November 6, 2026, `displaymode="icon-only"` is an experimental feature in Chrome. To try it, you need to launch Chrome with `--enable-blink-features=CapabilityElementIconOnlyMode`. It is not yet part of any specification, and the attribute name may change.

HTML elements such as `<camera>`, `<microphone>`, and `<geolocation>`, which request permissions through a button rendered by the browser, are called Capability Elements. Because the browser controls the button's appearance and label, they let you request permissions more safely than calling `getUserMedia()` from JavaScript. And even if a user accidentally blocks a permission they actually need, they can simply press the button again to re-request it.

However, these elements are rendered as wide buttons with an icon next to localized text, and the text cannot be removed. A "my location" button in the corner of a map, or the camera and microphone toggles lined up at the bottom of a video conferencing screen, are usually shown as icons only. Because Capability Elements require text, they don't fit into such tight spaces.

![](https://images.ctfassets.net/in6v9lxmm5c8/4zJ09jcgoBlTXLOQT1Npje/779d26d3fce27ef36c9c9c42c3047187/capability-elements-icon-only-1.png)

To address this, Chrome has implemented the `displaymode="icon-only"` attribute, which renders these elements as icons only. This article explains how to use `displaymode="icon-only"`.

## A Quick Recap of Capability Elements

Capability Elements let a page request permissions when the user clicks an element embedded in the page, instead of calling `getUserMedia()` or `navigator.geolocation.getCurrentPosition()` from JavaScript. The following elements are available in Chrome.

| Element         | What it provides                      |
| --------------- | ------------------------------------- |
| `<geolocation>` | Location (`GeolocationPosition`)      |
| `<usermedia>`   | A camera and microphone `MediaStream` |
| `<camera>`      | A camera `MediaStreamTrack`           |
| `<microphone>`  | A microphone `MediaStreamTrack`       |

To keep them trustworthy as browser-controlled buttons, Capability Elements come with styling constraints, such as the contrast ratio between text and background colors, font size, ranges for width and height, and `opacity`. The fact that calling `click()` from a script does not trigger a permission request, and what happens when the constraints are violated, are covered in [Declaratively Requesting Camera and Microphone Permissions with the `<usermedia>` Element](https://azukiazusa.dev/blog/usermedia-html-element).

The button label is decided by the browser and cannot be changed by the page. For example, in Chrome with English settings, `<camera>` reads "Use camera" and `<geolocation>` reads "Use location". The [PEPC Explainer](https://github.com/WICG/PEPC/blob/main/explainer.md) explains that the browser sets the label because, if pages could choose it, they could use misleading text like "Click here to proceed".

## Using `displaymode="icon-only"`

To display an element as an icon, add the `displaymode="icon-only"` attribute to it.

```html
<camera displaymode="icon-only"></camera>
<microphone displaymode="icon-only"></microphone>
<geolocation displaymode="icon-only"></geolocation>
```

Here is how it looked in Chrome Canary 159 with Japanese settings.

![](https://images.ctfassets.net/in6v9lxmm5c8/meloO6iSEtaUBhf9cmGSq/5f3740c8317c0e5882ae22763e7354a1/capability-elements-icon-only-2.png)

The text disappeared from `<camera>`, `<microphone>`, and `<geolocation>`, and they became square, icon-only buttons. However, `<usermedia>` kept its text and was not rendered as an icon.

:::info
Even when you switch to icon-only display with `displaymode="icon-only"`, the accessible name stays the same as the original label.
:::

As of November 2026, Chrome has no DOM property corresponding to the `displaymode` attribute, so use `setAttribute()` to switch it from JavaScript.

```js
const geolocation = document.querySelector("geolocation");
geolocation.setAttribute("displaymode", "icon-only");
```

## Summary

- By default, Capability Elements are rendered as buttons with an icon and browser-defined text, and the text cannot be removed, which made them hard to place in tight spaces such as map controls or video conferencing toolbars
- Chrome has implemented the `displaymode="icon-only"` attribute, which renders `<camera>`, `<microphone>`, and `<geolocation>` as icon-only buttons

## References

- [Capability Elements Icon-only mode - Chrome Platform Status](https://chromestatus.com/feature/5107682460696576)
- [Chrome 157 Release Notes - Chrome Platform Status](https://chromestatus.com/release-notes/157)
- [Media Capture and Streams Extensions - Media capture HTML elements](https://w3c.github.io/mediacapture-extensions/#media-capture-html-elements)
- [Permission Elements - WICG](https://wicg.github.io/PEPC/permission-elements.html)
- [PEPC Explainer · WICG/PEPC](https://github.com/WICG/PEPC/blob/main/explainer.md)
