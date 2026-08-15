---
id: gDg1Jh0b_FYNDM2qotiXe
title: "Preventing Custom Element Name Collisions with Scoped Custom Element Registries"
slug: "scoped-custom-element-registries"
about: "When you build with Web Components, name collisions happen if two libraries define custom elements with the same name. Scoped Custom Element Registries let you register different implementations under the same name in separate scopes on one page."
createdAt: "2026-08-15T15:46+09:00"
updatedAt: "2026-08-15T15:46+09:00"
tags: ["JavaScript", "Web Components", "HTML"]
audio: null
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1uG010TUCDlIiMzvVhkMUF/4c6312183326e9121297be3c9343a430/shark-fin_21263-768x591.png"
  title: "フカヒレのイラスト"
selfAssessment:
  quizzes:
    - question: "Which of the following correctly assigns different implementations to custom elements with the same name on a single page?"
      answers:
        - text: "Register the same name multiple times in the global customElements"
          correct: false
          explanation: "Registering a name that is already registered in the same registry throws a NotSupportedError."
        - text: "Create multiple CustomElementRegistry instances and register the same name in each of them"
          correct: true
          explanation: "As long as the registries differ, you can register separate constructors under the same custom element name."
        - text: "Pass a namespace as the third argument to customElements.define()"
          correct: false
          explanation: "customElements.define() has no argument for specifying a registry namespace."
        - text: "Create a new Document every time you register a custom element"
          correct: false
          explanation: "Scoped Custom Element Registries are a mechanism for using multiple registries within the same Document."
    - question: "Which option associates a CustomElementRegistry you created with a Shadow Root?"
      answers:
        - text: "registryName"
          correct: false
          explanation: "attachShadow() has no registryName option."
        - text: "customElements"
          correct: false
          explanation: "customElements is a property that refers to the global registry, not an option of attachShadow()."
        - text: "customElementRegistry"
          correct: true
          explanation: "You pass the registry you want to use to the customElementRegistry option of attachShadow()."
        - text: "elementRegistry"
          correct: false
          explanation: "attachShadow() has no elementRegistry option."
published: true
---

b> scoped-custom-element-registries

[Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) is an umbrella term for the technologies used to build reusable, custom HTML elements. It consists mainly of Custom Elements, which define your own element names and behavior; Shadow DOM, which encapsulates DOM structure and styles; and the `<template>` and `<slot>` elements, which declare reusable markup. These are standard APIs provided by the browser, and their defining trait is that you can use them without depending on a framework such as React or Vue.js.

Web Components are often used to ship UI components — buttons, dialogs, input forms — as a library, and projects such as [Material Web Components](https://github.com/material-components/material-web) and [Shoelace](https://shoelace.style/) are publicly available. Beyond that, Web Components are also used to distribute UI components that follow a product's design system for internal use, or to share a common set of UI components across several projects in a micro-frontend architecture.

Users of these libraries load a JavaScript module and then write custom elements such as `<my-button>` just like ordinary HTML. Because a library built on Web Components can be used without depending on a framework, it is especially convenient when several internal projects need to share the same UI components.

One of the barriers to using Web Components libraries, however, is name collisions. When multiple libraries define a custom element with the same name, only one of the definitions can be used. For example, if one library defines `<my-card>` and another library tries to define the same `<my-card>`, whichever registers second fails with an exception. Today we rely on prefix naming conventions (`md-`, `sl-`, and so on) to avoid collisions — an approach that is far from foolproof.

Scoped Custom Element Registries solve this problem, allowing custom elements to be encapsulated. You can create multiple `CustomElementRegistry` instances on the same page and register a custom element with the same name in each of them.

```js
// Create a registry
const registry = new CustomElementRegistry();

// Register a custom element in the registry
class MyCard extends HTMLElement {}
registry.define("my-card", MyCard);

// Create a Shadow Root and associate the registry with it
const host = document.querySelector("#host");
const shadowRoot = host.attachShadow({
  mode: "open",
  customElementRegistry: registry,
});
// Use <my-card> inside the Shadow Root
shadowRoot.innerHTML = `<my-card></my-card>`;
```

This article gives an overview of Scoped Custom Element Registries.

## The conventional way to register a custom element

Let's start by reviewing how custom elements are created the conventional way. The behavior of a custom element is defined as a class that extends `HTMLElement`.

```js
class MyCard extends HTMLElement {
  connectedCallback() {
    this.textContent = "My Card";
  }
}
```

`connectedCallback()` is a lifecycle callback invoked when the custom element is connected to the document. In this example, it sets the element's text to `My Card`.

Creating the class alone does not tell the browser which HTML element the behavior applies to. You register the custom element with a registry by passing the element name and the class to the `customElements.define()` method. A registry is the mechanism that manages the mapping between a custom element's name and the JavaScript class implementing that element's behavior. The registry is exposed globally as `window.customElements`.

```js
customElements.define("my-card", MyCard);
```

A custom element name must contain a hyphen so that it is distinguishable from a standard HTML element. Once registered, it can be used just like any other HTML element.

```html
<my-card></my-card>
```

When `customElements.define()` is called, the `MyCard` definition is applied to any `<my-card>` already present in the document. Applying a custom element definition to existing elements as a result of registering it with a registry is called an upgrade.

`window.customElements` is a global `CustomElementRegistry` shared across the entire document. If you try to register a different class under the same name, as shown below, a `NotSupportedError` is thrown.

```js
class AnotherCard extends HTMLElement {}

customElements.define("my-card", AnotherCard);
// Uncaught NotSupportedError
// Failed to execute 'define' on 'CustomElementRegistry': the name "my-card" has already been used with this registry
```

That is why you have to pay attention to custom element names when combining multiple libraries on the same page.

If the only components involved are the ones your application owns, a naming convention such as a prefix may be enough to avoid collisions. But when different versions of a library are pulled in as transitive dependencies, or when you combine plugins, browser extensions, and third-party widgets, coordinating names across the whole page becomes difficult.

## Creating a Scoped Custom Element Registry

Unlike the global registry, a Scoped Custom Element Registry is created from the `CustomElementRegistry` constructor. The constructor takes no arguments.

```js
class DemoCard extends HTMLElement {}

const registry = new CustomElementRegistry();
registry.define("demo-card", DemoCard);
```

Registering a custom element with the registry's `define()` method is not enough to use the element in HTML. A Scoped Custom Element Registry requires you to explicitly specify which DOM tree it applies to. The custom element only takes effect within the scope of that DOM tree.

To associate the registry with a Shadow Root, pass it to the `customElementRegistry` option of the `attachShadow()` method.

```js
const host = document.querySelector("#host");
const shadowRoot = host.attachShadow({
  mode: "open",
  customElementRegistry: registry,
});

shadowRoot.innerHTML = `<demo-card></demo-card>`;
```

:::note
A [Shadow Root](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot) is the root node of a subtree that is rendered separately from the document's DOM tree. An element that has a Shadow Root is called a Shadow Host, and the Shadow Root together with its descendants is called the Shadow DOM. A Shadow Root lets you isolate a component's internal HTML structure and styles from the outside.
:::

A registry can be associated not only with a Shadow Root but also with an ordinary `Element`. Using the `registry` created above, let's pass `customElementRegistry` as the second argument to `document.createElement()`. This scopes the registry to the created element and its descendants without using Shadow DOM.

```js
const card = document.createElement("demo-card", {
  customElementRegistry: registry,
});

document.body.append(card);
```

:::warning
Within a tree associated with a Scoped Custom Element Registry, definitions registered in the global `customElements` become invisible. Looking up a custom element definition consults only the single registry associated with the node, and there is no fallback to the global registry. As a result, any custom element used in that scope has to be registered with the registry again, even if it is already registered globally.
:::

## Registering different implementations under the same element name

Now let's create two Scoped Custom Element Registries and register the same name, `demo-card`, in each of them. Using two registries lets you assign different implementations to custom elements with the same name on a single page.

First, prepare two host elements for creating Shadow Roots.

```html
<div id="host-a"></div>
<div id="host-b"></div>
```

Next, define two custom elements, `BlueCard` and `OrangeCard`, that render different content.

```js
class BlueCard extends HTMLElement {
  connectedCallback() {
    this.textContent = "BlueCard";
  }
}

class OrangeCard extends HTMLElement {
  connectedCallback() {
    this.textContent = "OrangeCard";
  }
}
```

Then create the two registries. Both use the same name, `demo-card`, but because the registries differ, both registrations succeed without a problem.

```js
const registryA = new CustomElementRegistry();
const registryB = new CustomElementRegistry();

registryA.define("demo-card", BlueCard);
registryB.define("demo-card", OrangeCard);
```

Create a Shadow Root on each of the two host elements and associate a different registry with each one. Then insert the same `<demo-card>` into both Shadow Roots.

```js
const shadowRootA = document.querySelector("#host-a").attachShadow({
  mode: "open",
  customElementRegistry: registryA,
});
const shadowRootB = document.querySelector("#host-b").attachShadow({
  mode: "open",
  customElementRegistry: registryB,
});

shadowRootA.innerHTML = `
  <style>
    demo-card {
      display: block;
      padding: 16px;
      color: blue;
      border: 2px solid blue;
    }
  </style>
  <demo-card></demo-card>
`;

shadowRootB.innerHTML = `
  <style>
    demo-card {
      display: block;
      padding: 16px;
      color: orange;
      border: 2px solid orange;
    }
  </style>
  <demo-card></demo-card>
`;
```

When this code runs, the `<demo-card>` in `registryA` is upgraded to `BlueCard` and the one in `registryB` to `OrangeCard`. The CSS selector is `demo-card` in both cases, but because the custom element definitions and the styles are scoped to their own Shadow Root, the two render with different content and different colors. The `demo-card` styles written in one Shadow Root never apply to the `<demo-card>` in the other.

<iframe height="300" style="width: 100%;" scrolling="no" title="Scoped Custom Element Registries demo" src="https://codepen.io/azukiazusa1/embed/myRYaaP?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/myRYaaP">
  Scoped Custom Element Registries demo</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Associating a registry after the Shadow Root has been created

When you cannot pass the registry at the time `attachShadow()` is called, you can use the `CustomElementRegistry.prototype.initialize()` method. It associates the registry with an `Element` or `ShadowRoot` that does not have a registry yet.

```js
const registry = new CustomElementRegistry();
registry.define("demo-card", DemoCard);

registry.initialize(shadowRoot);
```

One of its main use cases is declarative Shadow DOM. Specifying the `shadowrootcustomelementregistry` attribute on a `<template>` element creates a Shadow Root with no registry set. You can associate a registry with this Shadow Root — created earlier by the HTML parser — once your JavaScript runs.

```html
<div id="host">
  <template shadowrootmode="open" shadowrootcustomelementregistry>
    <style>
      demo-card {
        display: block;
        padding: 16px;
        color: purple;
        border: 2px solid purple;
      }
    </style>
    <demo-card></demo-card>
  </template>
</div>
```

```js
registry.initialize(document.querySelector("#host").shadowRoot);
```

`initialize()` initializes the target and any of its descendants that do not have a registry set, and it also attempts to upgrade custom elements using the definitions already registered.

<iframe height="300" style="width: 100%;" scrolling="no" title="Declarative Shadow DOM with a scoped custom element registry" src="https://codepen.io/azukiazusa1/embed/jEyodyv?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/jEyodyv">
  Declarative Shadow DOM with a scoped custom element registry</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Summary

- When building an application with Web Components, a name collision occurs if different component libraries define custom elements with the same name
- Scoped Custom Element Registries let you assign separate implementations to custom elements with the same name in different scopes on the same page
- By associating a registry with an `Element` or a `ShadowRoot`, you can choose which custom element definitions to use per DOM-creation context

## References

- [HTML Standard - Custom elements](https://html.spec.whatwg.org/multipage/custom-elements.html)
- [DOM Standard - Shadow trees](https://dom.spec.whatwg.org/#shadow-trees)
- [Scoped Custom Element Registries](https://github.com/WICG/webcomponents/blob/gh-pages/proposals/Scoped-Custom-Element-Registries.md)
- [Revamped Scoped Custom Element Registries](https://github.com/whatwg/html/issues/10854)
- [W3C TAG Design Review](https://github.com/w3ctag/design-reviews/issues/1070)
- [Intent to Ship: Scoped Custom Element Registry](https://groups.google.com/a/chromium.org/g/blink-dev/c/mAteNymnc_s)
- [Make custom elements behave with scoped registries  |  Blog  |  Chrome for Developers](https://developer.chrome.com/blog/scoped-registries)
