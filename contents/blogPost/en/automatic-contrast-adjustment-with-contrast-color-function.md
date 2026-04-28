---
id: ApAJY5BzlnqFfMMnGSkB6
title: "Automatic Contrast Adjustment with the `contrast-color()` Function"
slug: "automatic-contrast-adjustment-with-contrast-color-function"
about: "The `contrast-color()` function returns either `white` or `black`, whichever has a higher contrast ratio against a given color. It helps when colors change dynamically or users apply custom themes."
createdAt: "2026-04-28T20:58+09:00"
updatedAt: "2026-04-28T20:58+09:00"
tags: ["CSS", "アクセシビリティ"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/10j9bepBZ34HUkLxtsSLfz/4ac28382b1c7f186e89baa4864b10322/pirate-ship_13574-768x729.png"
  title: "海賊船のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Which of the following best describes the basic role of the `contrast-color()` function as explained in the article?"
      answers:
        - text: "It returns either `white` or `black`, whichever has a higher contrast ratio against the specified color"
          correct: true
          explanation: "The article explains that `contrast-color()` determines whether `white` or `black` has a higher contrast ratio against the specified color and returns the appropriate value."
        - text: "It calculates the lightness of the specified color from its HSL value and returns a new background color"
          correct: false
          explanation: "Adjusting text lightness using HSL values is introduced as an example from GitHub labels, but it is not the basic role of `contrast-color()`."
        - text: "It automatically generates both the background color and foreground color, then locks the color scheme"
          correct: false
          explanation: "The article describes `contrast-color()` as a function that returns `white` or `black` for a given color. It does not generate and lock both the background and foreground colors."
        - text: "It returns a browser-selected color from an arbitrary list of candidate colors"
          correct: false
          explanation: "Early versions of the specification proposed candidate color lists and configurable algorithms, but the implementation described in the article returns either `black` or `white`."
published: true
---
Contrast ratio is a numerical representation of the difference in brightness between the foreground color and background color of text or an element. From the perspective of web accessibility, ensuring sufficient contrast is important. For users with visual impairments or older users, low-contrast text can be difficult to read and harder to understand. The importance of contrast also increases under environmental conditions such as strong outdoor sunlight.

The WCAG (Web Content Accessibility Guidelines) criteria define minimum contrast ratios as follows.

| Level | Normal text | Large text (18pt or larger, or 14pt or larger and bold) |
| ----- | ----------- | ------------------------------------------------------- |
| AA    | 4.5:1       | 3:1                                                     |
| AAA   | 7:1         | 4.5:1                                                   |

When colors are specified statically, you are expected to choose colors that meet these criteria in advance. However, it can be difficult to always maintain sufficient contrast when colors change dynamically or when users use custom themes. For example, GitHub labels allow users to choose colors freely, so if the same text color is always used, the contrast ratio may not be sufficient.

![](https://images.ctfassets.net/in6v9lxmm5c8/7qXfHJzQpJeCNKJEGZx37h/e915809b6a5538f4bfadcde8d57d4258/image.png)

In situations like this, you can use the `hsl()` function to dynamically generate a text color that has sufficient contrast against the background color. In the GitHub label example, the HSL values of the background color are used to adjust the text color's lightness, ensuring a sufficient contrast ratio.

```css
.label {
  color: hsl(
    var(--label-h),
    calc(var(--label-s) * 1%),
    calc((var(--label-l) + var(--lighten-by)) * 1%)
  );
}
```

However, this approach can make the implementation more complex because you need to know the background color's HSL values accurately and perform the appropriate calculations. As a native CSS way to automatically adjust contrast, there is the `contrast-color()` function.

b> contrast-color

## Overview of the contrast-color() Function

The `contrast-color()` function determines whether `white` or `black` has a higher contrast ratio against the specified color and returns the appropriate color. For example, `contrast-color(blue)` returns the color with the higher contrast ratio against blue, which is `white` in this case. On the other hand, `contrast-color(yellow)` returns the color with the higher contrast ratio against yellow, which is `black` in this case. If `white` and `black` have the same contrast ratio, `white` is returned. The algorithm may differ depending on the browser implementation.

```css
.element {
  /* Get the background color from a data-* attribute */
  --bg-color: attr(data-bg-color type(<color>));
  background-color: var(--bg-color);
  /* Automatically choose whether white or black has a higher contrast ratio against bg-color */
  color: contrast-color(var(--bg-color));
}
```

Because it is not yet supported in every browser, it is a good idea to provide a fallback with `@supports` when using it in practice.

```css
.element {
  background-color: var(--bg-color);
  color: white;
}

@supports (color: contrast-color(red)) {
  .element {
    color: contrast-color(var(--bg-color));
  }
}
```

You can confirm that the `contrast-color()` function works in Chrome v147 and later.

![](https://images.ctfassets.net/in6v9lxmm5c8/1njhymBrYz7ItPqz4RJSx4/bb41b53517cf6b687440a72843bd9095/image.png)

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/XJNryEp?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/XJNryEp">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

:::info
In earlier versions of the `contrast-color()` specification, a more flexible feature was proposed that allowed authors to specify a list of candidate colors and the algorithm ([CSSWG issue #7954](https://github.com/w3c/csswg-drafts/issues/7954)). However, because the specification remained unresolved for a long time, it was eventually implemented as a minimal function that simply returns either `black` or `white` ([CSSWG issue #9166](https://github.com/w3c/csswg-drafts/issues/9166)). There are still discussions that black and white alone are not enough in real-world use cases, so future extensions to the specification are worth watching.
:::

You can also use `contrast-color()` when the background color changes in response to a dark mode switch such as `prefers-color-scheme: dark`, ensuring that sufficient contrast is always maintained.

```css
:root {
  --bg-color: white;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: black;
  }
}

.element {
  background-color: var(--bg-color);
  color: contrast-color(var(--bg-color));
}
```

To work around the limitation that only `black` or `white` can be returned, you can combine it with the `color-mix()` function to generate more varied contrast colors. For example, by mixing the color returned by `contrast-color()` with the background color using `color-mix()`, you can generate a color that is not simply black or white.

```css
.element {
  --bg-color: oklch(50% 0.1 270);
  background-color: var(--bg-color);
  /* Mix the color returned by contrast-color() with the background color */
  color: color-mix(
    in srgb,
    contrast-color(var(--bg-color)) 80%,
    var(--bg-color) 20%
  );
}
```

<iframe height="300" style="width: 100%;" scrolling="no" title="contract-color" src="https://codepen.io/azukiazusa1/embed/GgNKPOg?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/GgNKPOg">
  contract-color</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

However, increasing the proportion of the original background color (20% in this example) may lower the contrast ratio. When using this approach, I recommend testing with a WCAG contrast checker or a similar tool to confirm that the contrast ratio is sufficient.

Alternatively, you can use the `if()` function to return different colors depending on whether the result is `black` or `white`. In this case as well, it is important to test and confirm that the contrast ratio is sufficient.

```css
/**
* When using a style() query, specify syntax: "<color>" on the
* --contrast-color custom property so the browser can correctly
* determine that the value is of the <color> type.
*/
@property --contrast-color {
  syntax: "<color>";
  initial-value: white;
  inherits: true;
}

.element {
  --bg-color: attr(data-bg-color type(<color>));
  background-color: var(--bg-color);
  --contrast-color: contrast-color(var(--bg-color));
  /** if returns first when the condition is true, and second when it is false */
  color: if(
    style(--contrast-color: black): oklch(43.5% 0.029 321.78) ;
      else: oklch(86.9% 0.005 56.366)
  );
  padding: 1rem;
}
```

<iframe height="300" style="width: 100%;" scrolling="no" title="contrast-color" src="https://codepen.io/azukiazusa1/embed/YPpKdoX?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/YPpKdoX">
  contrast-color</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Known Limitations and Caveats

Even when using the `contrast-color()` function, the resulting color combination is not always accessible. For example, if you pass a mid-tone color such as `#2277d3` to `contrast-color()`, it returns `black` as the contrast color. Indeed, when checked with the [WCAG 2 contrast checker](https://webaim.org/resources/contrastchecker/), `black` has a contrast ratio of `4.64:1`, while `white` has `4.51:1`, so numerically `black` has the higher contrast ratio. However, in terms of actual visual perception, many people may feel that `white` is easier to read. This is because readability depends not only on the contrast ratio number, but also on color characteristics and human visual perception.

![](https://images.ctfassets.net/in6v9lxmm5c8/3p33uSBzVRTz2fozR3t99/98add399b60170977b1720cecca8c6ac/image.png)

APCA (Advanced Perceptual Contrast Algorithm), which is being considered for WCAG 3, changes how contrast is calculated and is expected to provide evaluations closer to human visual perception. If `contrast-color()` supports APCA in the future, it may return more appropriate contrast colors. For now, it is worth remembering that you should avoid passing mid-tone colors to `contrast-color()`.

Even if the algorithm used by `contrast-color()` improves, it still will not fully guarantee accessibility. Contrast ratio is also affected by text size, weight, font, and other factors, so when using `contrast-color()`, it is important to consider other accessibility best practices as well.

It is also worth considering flexible approaches based on users' accessibility needs, such as applying different styles when the `prefers-contrast: more` media query is specified.

## Summary

- The `contrast-color()` function determines whether `white` or `black` has a higher contrast ratio against a specified color and returns the appropriate color
- It is useful in situations where maintaining contrast is difficult, such as when colors change dynamically or users use custom themes
- To work around the limitation that only `white` or `black` can be returned, you can combine it with `color-mix()` or `if()` to generate more varied contrast colors
- However, even when using `contrast-color()`, the resulting color combination is not always accessible, so it is important to consider other accessibility best practices as well

## References

- [contrast-color() - CSS | MDN](https://developer.mozilla.org/ja/docs/Web/CSS/Reference/Values/color_value/contrast-color)
- [CSS Color Module Level 5](https://drafts.csswg.org/css-color-5/#contrast-color)
- [Success Criterion 1.4.3 Contrast (Minimum)](https://w3c.github.io/wcag/guidelines/22/#contrast-minimum)
- [How to have the browser pick a contrasting color in CSS | WebKit](https://webkit.org/blog/16929/contrast-color/)
- [una.im | Automated accessible text with contrast-color()](https://una.im/contrast-color)
- [una.im | contrast-color() beyond black & white](https://una.im/advanced-contrast-color)
