---
id: GIBK8_CdcnoKSpJ4EkjZc
title: "Focusing Inputs Inside Child Components with Fragment Refs in React 19.3"
slug: "react-fragment-refs"
about: "Fragment Refs in React 19.3 let you work with multiple DOM elements without adding a wrapper element. Using a shipping address form as an example, this article shows how to use Fragment Refs."
createdAt: "2026-09-13T11:53+09:00"
updatedAt: "2026-09-13T11:53+09:00"
tags: ["React"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/c8dMGeOpSReuKimWBgL59/93337b644c8597a3df155447acb72d4b/grocery-shopping_12590.png"
  title: "食料品の買い物のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "When you pass a ref to a Fragment, what do you receive as the ref value?"
      answers:
        - text: "The DOM element of the first child"
          correct: false
          explanation: "You don't receive the first child itself. You receive a FragmentInstance that provides operations on the group."
        - text: "A FragmentInstance for operating on the group"
          correct: true
          explanation: "A FragmentInstance has methods such as focus() that operate on the DOM elements inside the Fragment."
        - text: "An array of DOM nodes holding all children"
          correct: false
          explanation: "The API does not give you an array of DOM elements. You interact with them through the exposed methods."
        - text: "An automatically added wrapper DOM element"
          correct: false
          explanation: "A Fragment does not add any DOM elements, so no wrapper element is created."
    - question: "In the conditionally rendered shipping address form, why is focus() called from a ref callback?"
      answers:
        - text: "To sync the input values being edited to state"
          correct: false
          explanation: "In this example, the values being edited aren't synced to state; they're kept in inputs initialized with defaultValue. The ref callback is used for the timing of focus."
        - text: "To prevent the parent component from re-rendering"
          correct: false
          explanation: "A ref callback is not a mechanism to prevent re-renders. State is used to toggle the display."
        - text: "To create a DOM node for the Fragment to receive focus"
          correct: false
          explanation: "No DOM node is created for the Fragment itself. It searches for focusable elements inside it."
        - text: "To operate on the inputs after their DOM has been attached"
          correct: true
          explanation: "Right after setEditing(true), the new inputs don't exist yet. The operation runs when the ref is attached."
published: true
---
Imagine an order confirmation screen where clicking an "Edit shipping address" button shows an edit form and moves focus to the first input.

!v(https://videos.ctfassets.net/in6v9lxmm5c8/6UrB92FhUipJ25D76GKYwV/32fde6046cdf6de2e71e8961a3ed4dfb/react-fragment-refs-1.mp4 622x514)

In React, if the input lives in the same component, you can pass a `ref` to the `<input>` and call `focus()` on it.

```jsx
import { useRef, useState } from "react";
import { flushSync } from "react-dom";

export default function ShippingAddress() {
  const [editing, setEditing] = useState(false);
  const postalCodeRef = useRef(null);

  function handleEdit() {
    // Update state synchronously with flushSync so the form is rendered before focusing
    flushSync(() => {
      setEditing(true);
    });
    postalCodeRef.current?.focus();
  }

  return (
    <>
      <button type="button" onClick={handleEdit}>
        配送先を編集
      </button>
      {editing && (
        <form onSubmit={(event) => event.preventDefault()}>
          <label>
            郵便番号
            <input name="postalCode" ref={postalCodeRef} />
          </label>
        </form>
      )}
    </>
  );
}
```

However, when the input lives in a separate component, the parent needs some way to reach the DOM element inside it. You could have the child forward a ref, or search for the target from a wrapper element's ref, but both approaches depend on the child's implementation or DOM structure.

For example, as more fields are added besides the postal code, you'll probably want to split the form into its own component. If you extract it into `AddressFields`, the child passes the ref it receives from the parent down to its `input`.

```jsx
import { useRef, useState } from "react";
import { flushSync } from "react-dom";

function AddressFields({ ref }) {
  return (
    <>
      <label>
        郵便番号
        <input
          name="postalCode"
          autoComplete="shipping postal-code"
          required
          ref={ref}
        />
      </label>
      <label>
        住所
        <input
          name="street"
          autoComplete="shipping address-line1"
          required
        />
      </label>
      <label>
        建物名・部屋番号
        <input
          name="building"
          autoComplete="shipping address-line2"
        />
      </label>
    </>
  );
}

export default function ShippingAddress() {
  const [editing, setEditing] = useState(false);
  const postalCodeRef = useRef(null);

  function handleEdit() {
    flushSync(() => {
      setEditing(true);
    });
    postalCodeRef.current?.focus();
  }

  return (
    <>
      <button type="button" onClick={handleEdit}>
        配送先を編集
      </button>
      {editing && (
        <form onSubmit={(event) => event.preventDefault()}>
          <AddressFields ref={postalCodeRef} />
        </form>
      )}
    </>
  );
}
```

The parent's `handleEdit` can still show the form and move focus, but it relies on `AddressFields` correctly accepting the `ref`. For example, if a new field is added before the postal code and someone forgets to move the `ref`, focus will no longer land on the first field of the form. And if you're using a component from a library, it may not expose an API that accepts a `ref` at all.

With [Fragment Refs](https://react.dev/blog/2026/09/09/react-19-3#fragment-refs), added in React 19.3, you can operate on the elements wrapped in a Fragment as a group without adding a wrapper element. For the shipping address form, this means you can move focus to the first focusable element even if the child component doesn't expose refs for individual inputs.

Using shipping address editing as an example, this article introduces the basics of Fragment Refs.

## What Are Fragment Refs?

[`Fragment`](https://react.dev/reference/react/Fragment) is a React component that groups multiple elements without adding a DOM element. Many of you have probably used it through the `<>...</>` shorthand.

Fragment Refs let you pass a `ref` to this `Fragment`. The value you receive is an object called `FragmentInstance`, which has methods for operating on the DOM elements inside the Fragment.

In the following example, clicking the "Start typing" button calls `focus()` on `fragmentRef`.

```jsx
import { Fragment, useRef } from "react";

export default function FormFields() {
  const fragmentRef = useRef(null);

  return (
    <>
      <button type="button" onClick={() => fragmentRef.current?.focus()}>
        入力を始める
      </button>
      <Fragment ref={fragmentRef}>
        <label>
          郵便番号
          <input name="postalCode" />
        </label>
        <label>
          住所
          <input name="street" />
        </label>
      </Fragment>
    </>
  );
}
```

Calling `fragmentRef.current.focus()` searches inside the Fragment for a focusable element. In this example, the postal code input at the top is the one that receives focus.

You can't use the `<>...</>` shorthand when specifying a `ref`. You need to import `Fragment` and write `<Fragment ref={fragmentRef}>`.

The [React 19.3 release post](https://react.dev/blog/2026/09/09/react-19-3#fragment-refs) explains that the motivation comes from the difficulty of working with components that return multiple sibling elements or that don't forward refs internally. It also points out that adding a wrapper `div` just to attach a ref can affect styling and layout.

In the shipping address example, too, the parent is responsible for "starting input in this group," while the child decides which elements render the postal code and address.

## Building the Shipping Address Edit Form

Let's rewrite the shipping address example from the beginning using Fragment Refs.

First, define the shipping address fields in `AddressFields.jsx`.

```jsx:src/AddressFields.jsx
export default function AddressFields({ address }) {
  return (
    <>
      <label>
        郵便番号
        <input
          name="postalCode"
          autoComplete="shipping postal-code"
          defaultValue={address.postalCode}
          required
        />
      </label>
      <label>
        住所
        <input
          name="street"
          autoComplete="shipping address-line1"
          defaultValue={address.street}
          required
        />
      </label>
      <label>
        建物名・部屋番号
        <input
          name="building"
          autoComplete="shipping address-line2"
          defaultValue={address.building}
        />
      </label>
    </>
  );
}
```

`AddressFields` doesn't accept a ref. This way, it doesn't need to care about how the parent component will use it.

Next, create the parent component that toggles between displaying and editing the shipping address. Update `App.jsx` as follows.

```jsx:src/App.jsx
import { Fragment, useCallback, useRef, useState } from "react";
import AddressFields from "./AddressFields.jsx";

export default function App() {
  const [editing, setEditing] = useState(false);
  const [address, setAddress] = useState({
    postalCode: "100-0001",
    street: "東京都千代田区千代田 1-1",
    building: "サンプルビル 101",
  });
  const editButtonRef = useRef(null);
  const focusAddress = useCallback((instance) => {
    instance?.focus();
  }, []);

  function finishEditing() {
    setEditing(false);
    editButtonRef.current?.focus();
  }

  return (
    <main>
      <h1>配送先</h1>
      <button
        type="button"
        ref={editButtonRef}
        onClick={() => setEditing(true)}
      >
        配送先を編集
      </button>
      {editing ? (
        <form>
          <fieldset>
            <legend>配送先の住所</legend>
            <Fragment ref={focusAddress}>
              <AddressFields address={address} />
            </Fragment>
          </fieldset>
          <button type="submit">保存</button>
          <button type="button" onClick={finishEditing}>
            キャンセル
          </button>
        </form>
      ) : (
        <p>
          〒{address.postalCode}
          <br />
          {address.street}
          <br />
          {address.building}
        </p>
      )}
    </main>
  );
}
```

The code related to Fragment Refs is in these two places.

```jsx
const focusAddress = useCallback((instance) => {
  instance?.focus();
}, []);

<Fragment ref={focusAddress}>
  <AddressFields address={address} />
</Fragment>;
```

In addition to an object created with `useRef`, you can pass a function to `ref`. This function is called a ref callback. By using a ref callback, you can call `focus()` at the moment the DOM inside the `Fragment` has been rendered.

:::info
The ref callback is wrapped in `useCallback` to keep the function's identity stable. When a different function is passed to `ref` on each render, React cleans up the previous ref callback and then calls the new one. If you write `<Fragment ref={(instance) => instance?.focus()}>` without `useCallback`, `focus()` runs every time `App` re-renders, which could move focus back to the postal code input even while the user is in the middle of editing the address field.
:::

`AddressFields`, directly under `<Fragment>`, is a React component, but the DOM elements inside it are what get operated on. The parent component can move focus to the first focusable element in the group without knowing which inputs exist or in what order they appear.

## Understanding Where Focus Searches

When using Fragment Refs, it helps to understand what "the Fragment's children" refers to. A simplified view of the JSX and DOM relationship in this example looks like this:

```text
Fragment
└─ AddressFields (React component)
   ├─ label
   │  └─ input (postal code)
   ├─ label
   │  └─ input (address)
   └─ label
      └─ input (building / room number)
```

`focus()` performs a depth-first search inside the Fragment for the first focusable DOM element. Depth-first means traversing into an element before moving on to its next sibling. In this example, it finds the postal code input inside the first `label`. It can also focus inputs inside nested elements or a `fieldset`.

Other focus-related methods include `focusLast()` and `blur()`. `focusLast()` searches for the last focusable element, and `blur()` removes focus from the active element inside the Fragment.

## Measuring Product Card Impressions

Beyond focus, Fragment Refs can also be used for registering events on multiple elements and for measurement.

Consider a product listing on an e-commerce site where you want to measure which products entered the user's viewport. Counting products just because they were rendered would include products the user can't see without scrolling. So in this example, an impression—a record that the product was displayed—is reported only once, when at least 50% of a product card's area intersects the viewport.

Even if the product card doesn't expose a ref, Fragment Refs let the parent observe its DOM element. First, create `ImpressionTracker.jsx`, which handles the measurement.

```jsx:src/ImpressionTracker.jsx
import { Fragment, useCallback, useRef } from "react";

export default function ImpressionTracker({ children, onImpression }) {
  const reportedRef = useRef(false);
  const observeImpression = useCallback((instance) => {
    if (instance === null || reportedRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      const reachedThreshold = entries.some(
        (entry) => entry.isIntersecting && entry.intersectionRatio >= 0.5,
      );
      if (!reachedThreshold || reportedRef.current) return;

      reportedRef.current = true;
      instance.unobserveUsing(observer);
      observer.disconnect();
      onImpression();
    }, { threshold: 0.5 });

    instance.observeUsing(observer);
    return () => {
      instance.unobserveUsing(observer);
      observer.disconnect();
    };
  }, [onImpression]);

  return <Fragment ref={observeImpression}>{children}</Fragment>;
}
```

`observeUsing(observer)` registers the Fragment's top-level DOM children as observation targets. Here, it wraps a product card that returns a single `article` and checks how much of that element is visible.

Once the condition is met, it stores the reported state in `reportedRef.current`, stops observing, and calls `onImpression()`. Because the state is stored in a ref, duplicate reports won't occur while the same component stays mounted, even if the ref callback is reattached due to a parent re-render. If the component unmounts before the condition is met, the cleanup function returned from the ref callback calls `unobserveUsing(observer)` and stops observing.

Next, implement the product listing. The measurement handler just calls `console.log()` so you can see which product IDs are reported.

```jsx:src/VisibilityExample.jsx
import ImpressionTracker from "./ImpressionTracker.jsx";

const products = [
  { id: "p1", name: "コットンシャツ", price: "4,900 円" },
  { id: "p2", name: "リネンシャツ", price: "5,900 円" },
  { id: "p3", name: "デニムパンツ", price: "8,900 円" },
  { id: "p4", name: "チノパンツ", price: "6,900 円" },
  { id: "p5", name: "トートバッグ", price: "3,900 円" },
  { id: "p6", name: "バックパック", price: "9,900 円" },
];

function ProductCard({ product }) {
  return (
    <article style={{ minHeight: "16rem", padding: "1rem", border: "1px solid #ccc" }}>
      <h2>{product.name}</h2>
      <p>{product.price}</p>
      <button type="button">お気に入りに追加</button>
    </article>
  );
}

export default function VisibilityExample() {
  return (
    <main>
      <h1>商品一覧</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
        {products.map((product) => (
          <ImpressionTracker
            key={product.id}
            onImpression={() => {
              console.log("product_impression", { productId: product.id });
            }}
          >
            <ProductCard product={product} />
          </ImpressionTracker>
        ))}
      </div>
    </main>
  );
}
```

`ProductCard` only renders the product and has no ref forwarding or measurement logic. By wrapping it in `ImpressionTracker`, the parent associates product IDs with impressions. Also, since `ImpressionTracker` doesn't add any DOM elements, it doesn't affect the Grid layout, unlike approaches that use a wrapper element such as a `<div>`.

Open the developer tools console and scroll down to the products in the lower rows, and you'll see a log for each product ID.

```text
product_impression { productId: "p6" }
```

## Registering Event Listeners on Multiple Input Components

Consider a profile edit screen where you want to show "Unsaved changes" as soon as any field is modified. Even when each input is rendered by a different component, grouping them with Fragment Refs lets you receive the events that occur inside the group all at once.

First, create `InputGroup.jsx`, which registers an `input` event listener.

```jsx:src/InputGroup.jsx
import { Fragment, useCallback } from "react";

export default function InputGroup({ children, onInput }) {
  const attachListener = useCallback((instance) => {
    if (instance === null) return;

    instance.addEventListener("input", onInput);
    return () => {
      instance.removeEventListener("input", onInput);
    };
  }, [onInput]);

  return <Fragment ref={attachListener}>{children}</Fragment>;
}
```

`addEventListener("input", onInput)` registers the listener on the Fragment's top-level DOM children. The cleanup function returned from the ref callback removes it by passing the same event name and function to `removeEventListener()`.

Next, wrap the display name and bio input components in `InputGroup`.

```jsx:src/EventExample.jsx
import { useCallback, useState } from "react";
import InputGroup from "./InputGroup.jsx";

function DisplayNameField({ defaultValue }) {
  return (
    <label>
      表示名
      <input name="displayName" defaultValue={defaultValue} />
    </label>
  );
}

function BioField({ defaultValue }) {
  return (
    <label>
      自己紹介
      <textarea name="bio" defaultValue={defaultValue} rows={4} />
    </label>
  );
}

export default function EventExample() {
  const [profile, setProfile] = useState({ displayName: "サンプル", bio: "" });
  const [dirty, setDirty] = useState(false);
  const markDirty = useCallback(() => setDirty(true), []);

  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setProfile({
      displayName: String(data.get("displayName")),
      bio: String(data.get("bio")),
    });
    setDirty(false);
  }

  return (
    <main>
      <h1>プロフィールの編集</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gap: "1rem", maxWidth: "32rem" }}>
          <InputGroup onInput={markDirty}>
            <DisplayNameField defaultValue={profile.displayName} />
            <BioField defaultValue={profile.bio} />
          </InputGroup>
        </div>
        <p role="status">{dirty ? "未保存の変更あり" : "変更なし"}</p>
        <button type="submit" disabled={!dirty}>保存</button>
      </form>
    </main>
  );
}
```

Through the `markDirty` function passed to `InputGroup`, the parent is notified when either input changes. This removes the need to register a separate `onInput` on every input.

## Summary

- A Fragment's `addEventListener()` registers a listener on its top-level DOM children, and `removeEventListener()` removes it
- Fragment Refs in React 19.3 provide a `FragmentInstance` that operates on the elements inside a Fragment without adding DOM elements
- `focus()` searches inside child components and DOM elements and moves focus to the first focusable element
- In a conditionally rendered shipping address form, a Fragment ref callback lets you focus after the DOM has been attached

## References

- [React 19.3](https://react.dev/blog/2026/09/09/react-19-3)
- [Fragment — React](https://react.dev/reference/react/Fragment)
- [Add ref to Fragment (alternative) — react/react #32465](https://github.com/react/react/pull/32465)
- [Manipulating the DOM with Refs — React](https://react.dev/learn/manipulating-the-dom-with-refs)
- [Common components: ref callback function — React](https://react.dev/reference/react-dom/components/common#ref-callback)
