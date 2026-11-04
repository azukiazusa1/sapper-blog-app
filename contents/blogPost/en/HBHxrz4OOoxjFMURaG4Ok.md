---
id: HBHxrz4OOoxjFMURaG4Ok
title: "Defining Media Query Presets with @custom-media"
slug: "custom-media-presets"
about: "Repeating a media query across CSS files means editing every copy when a breakpoint changes. @custom-media names a media query like --md so input and breakpoint presets live in one place. This article covers its syntax and specified behavior."
createdAt: "2026-11-04T17:17+09:00"
updatedAt: "2026-11-04T17:17+09:00"
tags: ["CSS"]
thumbnail:
  url: ""
  title: ""
audio: null
selfAssessment:
  quizzes:
    - question: "Given @custom-media --modern (color), (hover);, which condition is equivalent to @media (--modern) and (width > 1024px)?"
      answers:
        - text: "(color), (hover) and (width > 1024px)"
          correct: false
          explanation: "This interprets the definition as a textual substitution. Under that reading, (color) alone would be enough to match. The spec evaluates the name logically as a single condition."
        - text: "(color) and (hover) and (width > 1024px)"
          correct: false
          explanation: "A comma-separated list means \"any of these matches,\" so it does not become an and that requires both (color) and (hover)."
        - text: "((color) or (hover)) and (width > 1024px)"
          correct: true
          explanation: "@custom-media names are evaluated logically, and the list is treated as a single or group. The spec includes this same example."
        - text: "(color) or (hover) or (width > 1024px)"
          correct: false
          explanation: "Because the conditions are combined with and, the width condition must always be satisfied. Matching just one of them is not enough."

    - question: "How is @media not (--undefined) evaluated when --undefined has never been defined?"
      answers:
        - text: "An undefined name is treated as false, so not makes it match"
          correct: false
          explanation: "That is the behavior of not (--off) after defining @custom-media --off false;. An undefined name is treated as unknown, not false."
        - text: "An undefined name is treated as unknown, and not leaves it unknown, so it does not match"
          correct: true
          explanation: "As the note in the spec says, an undefined media feature is distinct from one that evaluates to false. not unknown remains unknown, so the rule is not applied."
        - text: "An undefined name is treated as true, so not makes it not match"
          correct: false
          explanation: "An undefined name is never treated as true. It is treated as unknown, so adding not still does not make it match."
        - text: "The entire stylesheet becomes a syntax error and every rule is dropped"
          correct: false
          explanation: "Referencing an undefined name only makes that condition unknown. It has no effect on other rules."
published: true
---

b> custom-media-queries

Responsive sites usually share a common set of breakpoints. For example, a project might decide that phones are below 48rem, tablets are 48rem and up, and desktops are 64rem and up. If you write a breakpoint like `(width >= 48rem)` directly in each component's CSS, changing that rule means hunting down and rewriting every occurrence. Miss just one, and you end up with a hard-to-find bug where the layout breaks only at certain widths.

Preprocessors such as Sass have traditionally solved this problem. The following example stores the breakpoint value in a Sass variable and wraps the media query in a mixin.

```scss
$bp-md: 48rem;

@mixin md {
  @media (width >= $bp-md) {
    @content;
  }
}

.cards {
  display: grid;

  @include md {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

Every `@include md` is expanded to `@media (width >= 48rem)` at build time. You can change the breakpoint in one place, but the downside is that you have to use Sass-specific syntax.

[`@custom-media`](https://drafts.csswg.org/mediaqueries-5/#custom-mq) is an at-rule that brings this to CSS itself, letting you give a media query a name like `--md`. If you collect your named media queries in a single file, you can treat them as presets shared across the whole project.

This article explains the syntax of `@custom-media` and how it behaves according to the spec.

!> As of November 4, 2026, Firefox is the only browser that implements `@custom-media`, and it works only when `layout.css.custom-media.enabled` is set to `true` in `about:config`. Chrome and Safari do not support it. The spec, Media Queries Level 5, is a Working Draft, and some points, such as how definition order is handled, are still undecided.

## Custom properties don't work in media queries

When you want to manage breakpoints in one place, custom properties are the first thing that comes to mind. However, you can't use `var()` inside a media query. [CSS Custom Properties for Cascading Variables Module Level 1](https://www.w3.org/TR/css-variables-1/#using-variables) specifies that `var()` can only be used in the values of properties on elements, so it can't appear anywhere other than a property value, such as in property names or selectors.

In fact, the following media query, which tries to share the breakpoint through a custom property, does not match even when the viewport is `48rem` or wider.

```css
:root {
  --bp-md: 48rem;
}

/* var() is not resolved inside media queries */
@media (width >= var(--bp-md)) {
  p {
    color: green;
  }
}
```

This is why breakpoints can't be shared with CSS alone, and why build-time expansion like the Sass approach shown in the introduction has been the go-to solution.

## Basic syntax of `@custom-media`

The syntax of `@custom-media` is as follows. After the name, you write either a media query list, `true`, or `false`.

```css
@custom-media <extension-name> [ <media-query-list> | true | false ];
```

Like a custom property, `<extension-name>` is a name that starts with `--`. The following example gives `(width >= 48rem)` the name `--md`.

```css
@custom-media --md (width >= 48rem);

@media (--md) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

When you wrap a defined name in parentheses and put it where a media feature would go, as in `@media (--md)`, the rule applies whenever the media query associated with `--md` matches. Names can only be used in this boolean form, like `(--md)`. Comparing them against a value, as in `(--md: 1)` or `(--md > 1)`, is a syntax error.

Just like regular media features, you can combine them with `and`, `or`, and `not`.

```css
@media (--md) and (--mouse) {
  /* When the width is 48rem or more and the user is using a mouse */
}

@media not (--md) {
  /* When the width is less than 48rem */
}
```

A `@custom-media` definition can reference other `@custom-media` names. However, cycles where a name refers to itself directly or indirectly are forbidden, and every name involved in a cycle is treated as undefined.

## Behavior defined by the spec

This section covers behaviors worth knowing when you use `@custom-media`.

### Evaluated logically, not by textual substitution

A `@custom-media` name is not replaced with the text of its media query. Instead, it is evaluated as a single condition. The spec gives the following example.

```css
/* --modern targets devices that support color or hover */
@custom-media --modern (color), (hover);

@media (--modern) and (width > 1024px) {
  .a {
    color: green;
  }
}
```

A comma-separated media query list means "any of these matches." Therefore, `(--modern) and (width > 1024px)` is equivalent to `((color) or (hover)) and (width > 1024px)`.

### Toggling definitions with `true` and `false`

If you write `true` or `false` instead of a media query, the name becomes a condition that always matches or never matches.

```css
@custom-media --md true;
```

By temporarily switching a preset's definition to `true` or `false`, you can check the styles that apply when that condition matches without changing the viewport width or device.

### An undefined name is not the same as `false`

When you reference a name that hasn't been defined, the condition is treated as "unknown." [A note in Media Queries Level 5](https://drafts.csswg.org/mediaqueries-5/#custom-mq) explains that, for error handling purposes, an undefined media feature is different from a media feature that evaluates to `false`. The details are defined in [Media Queries Level 4, 3.2. Error Handling](https://drafts.csswg.org/mediaqueries-4/#error-handling). The difference shows up when you combine the name with `not`.

```css
@custom-media --off false;

/* Matches: not false is true */
@media not (--off) {
}

/* Does not match: not unknown is still unknown */
@media not (--undefined) {
}
```

### Redefining a name uses the last definition

When there are multiple `@custom-media` rules with the same name, the spec says only the last one is used.

```css
@custom-media --md (width >= 48rem);
@custom-media --md (width >= 50rem); /* This one is used */
```

### Definitions written after a reference are still undecided

One point still under discussion in the spec is how to handle a case where a name is referenced, as in `@media (--late)`, before `@custom-media --late` is defined.

```css
@media (--late) {
  .a {
    color: green;
  }
}

@custom-media --late true;
```

In August 2025, the CSS Working Group (CSSWG) resolved in [Issue #12536](https://github.com/w3c/csswg-drafts/issues/12536) that "`@custom-media` needs to be declared before use." Because `@custom-media` can also be written inside `@media`, cycles can occur, such as defining `--a` inside `@media (--a)`. If the stylesheet is read from the top and each reference uses whatever definitions have been found so far, these cycles can be resolved without multiple passes.

However, in CSS it is normal for definitions written after a reference to take effect, as with `@font-face`. Rules that depend on declaration order would force authors to learn a model that differs from the rest of CSS, so this resolution was reverted in [Issue #13041](https://github.com/w3c/csswg-drafts/issues/13041) in January 2026. Instead, the group decided to collect all definitions first and then resolve name collisions, bringing the behavior closer to "the last definition wins." In July 2026, however, examples were reported where this approach still produces different results depending on evaluation order, so the details have yet to be settled.

## Expanding with PostCSS

[`postcss-custom-media`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-custom-media) is a PostCSS plugin that expands `@custom-media` names into the media queries they define. Since `@custom-media` isn't widely supported yet, this is a good way to start using it today. Install the required packages.

```bash
npm install -D postcss postcss-cli postcss-custom-media @csstools/postcss-global-data
```

By passing `presets.css` to [`@csstools/postcss-global-data`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-global-data), you can provide the definitions needed for the transformation without including them in the output.

```js:postcss.config.mjs
import postcssGlobalData from "@csstools/postcss-global-data";
import postcssCustomMedia from "postcss-custom-media";

export default {
  plugins: [
    // Place this before postcss-custom-media
    postcssGlobalData({ files: ["./presets.css"] }),
    postcssCustomMedia(),
  ],
};
```

`presets.css` defines presets for input methods, breakpoints, and user preferences in one place, as shown below.

```css:presets.css
/* Input methods */
@custom-media --mouse (hover: hover) and (pointer: fine);
@custom-media --touch (hover: none) and (pointer: coarse);

/* Breakpoints */
@custom-media --md (width >= 48rem);
@custom-media --lg (width >= 64rem);

/* User preferences */
@custom-media --motion-ok (prefers-reduced-motion: no-preference);
@custom-media --high-contrast (prefers-contrast: more), (forced-colors: active);
```

In `app.css`, reference them like `@media (--md)`.

```css:app.css
.cards {
  display: grid;
  gap: 1rem;
}

@media (--md) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (--lg) {
  .cards {
    grid-template-columns: repeat(3, 1fr);
  }
}

.button {
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  background-color: rebeccapurple;
  color: white;
}

@media (--touch) {
  .button {
    min-block-size: 48px;
  }
}

@media (--mouse) {
  .button:hover {
    background-color: indigo;
  }
}

@media (--motion-ok) {
  .button {
    transition: background-color 0.2s;
  }
}

@media (--high-contrast) {
  .button {
    border-color: currentColor;
  }
}
```

Transform `app.css` with `postcss-cli`. The `postcss` command automatically loads `postcss.config.mjs` from the current directory.

```bash
npx postcss app.css -o dist/app.css
```

In the generated `dist/app.css`, references like `@media (--md)` are replaced with the media queries they define. The following is an excerpt of the output.

```css:dist/app.css
@media (width >= 48rem) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (hover: none) and (pointer: coarse) {
  .button {
    min-block-size: 48px;
  }
}

@media (prefers-contrast: more),(forced-colors: active) {
  .button {
    border-color: currentColor;
  }
}
```

If you use [`postcss-preset-env`](https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-preset-env), `postcss-custom-media` is enabled in its default configuration.

## Summary

- `@custom-media` is an at-rule that gives a media query a name like `--md`, and the name can only be referenced in boolean form, as in `@media (--md)`
- Because `var()` can only be used in property values, you can't share media query breakpoints through custom properties
- A `@custom-media` name is evaluated as a single condition rather than by textual substitution, so combining a name defined as a list with `and` doesn't change its meaning
- You can toggle a definition with `true` and `false`, and an undefined name is treated as unknown rather than `false`, so adding `not` still doesn't make it match
- When a name is redefined, the last definition is used. As for definitions written after a reference, the August 2025 "declare before use" resolution was reverted in January 2026, and the CSSWG is still discussing it
- Collecting presets for input methods, breakpoints, and user preferences in a single file means there is only one place to edit when a condition changes
- As of November 2026, the only implementation of `@custom-media` is Firefox behind a flag, so if you want to use it today, expand it into regular `@media` rules with `postcss-custom-media` and `@csstools/postcss-global-data`

## References

- [Media Queries Level 5 - 10. Custom Media Queries](https://drafts.csswg.org/mediaqueries-5/#custom-mq)
- [Media Queries Level 4 - 2.5. Media Features](https://drafts.csswg.org/mediaqueries-4/#mq-features)
- [CSS Custom Properties for Cascading Variables Module Level 1](https://www.w3.org/TR/css-variables-1/)
- [@custom-media - MDN Web Docs](https://developer.mozilla.org/docs/Web/CSS/Reference/At-rules/@custom-media)
- [postcss-custom-media](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-custom-media)
- [Useful @custom-media Presets](https://blog.master.dev/useful-custom-media-presets/)
