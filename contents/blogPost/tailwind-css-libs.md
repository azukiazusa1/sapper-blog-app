---
id: AHpfaZjdTYXkKjRx-t-fk
title: "Tailwind CSS を使う時に一緒に入れたいライブラリ"
slug: "tailwind-css-libs"
about: "Tailwind CSS を使う上でクラス名をスッキリと書くために一緒に入れたいライブラリを紹介します"
createdAt: "2024-02-03T19:26+09:00"
updatedAt: "2024-02-03T19:26+09:00"
tags: ["Tailwind CSS", "CSS"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/gh9XgOuZkUdQY8ebsYHZi/b26c4bd4704ab402ac37f212bf95286c/handy-fan_15841.png"
  title: "ハンディファンのイラスト"
selfAssessment: null
published: true
---
Tailwind CSS はすべてをユティリティクラスで書くという特性上、HTML にはクラスがたくさん書かれることになります。1 つの要素に対してクラスがたくさん並んでいると、視覚的にどのようなスタイルが適用されているのかを把握するのが難しくなります。条件によってクラス名を付け替える処理を行っていると更に複雑になります。

```tsx
<button
  className={`
    ${variant === "primary" && "border border-blue-500 bg-blue-500 text-white"}
    ${
      variant === "secondary" && "border border-gray-500 bg-gray-500 text-white"
    }
    ${variant === "default" && "border border-gray-500 bg-white text-gray-500"}
    ${disabled && "cursor-not-allowed opacity-50"}
    ${rounded && "rounded"}
    flex cursor-pointer items-center justify-center px-4 py-2 text-sm font-medium hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  `}
>
  ...
</button>
```

この記事ではこのような問題を解決するために、スッキリとした記述を可能にするライブラリを紹介します。コード例として React を使用しますが、ここで紹介するライブラリは React に限らず、フレームワークを問わず使用できます。

## classnames, clsx

[classnames](https://github.com/JedWatson/classnames) と [clsx](https://github.com/lukeed/clsx) は、複数のクラス名を結合するための軽量ライブラリです。2 つのライブラリに大きな機能の差はありません。ここでは `clsx` を例に紹介します。

`clsx` は任意の数の引数を受け取り、それらを結合して返します。

```tsx
import clsx from "clsx";

const className = clsx("text-white", "bg-blue-500", "rounded");
// => "text-white bg-blue-500 rounded"
```

`clsx` は `undefined` や `null` などの falsy な値を無視します。これにより条件によってクラス名を付け替える処理を書くことができます。

```tsx
const type = "primary";
const className = clsx(
  variant === "primary" && "border border-blue-500 bg-blue-500 text-white",
  variant === "secondary" && "border border-gray-500 bg-gray-500 text-white",
  variant === "default" && "border border-gray-500 bg-white text-gray-500",
);

// => "border border-blue-500 bg-blue-500 text-white"
```

オブジェクト形式でクラス名を渡すこともできます。この場合、値が truthy なプロパティのキーがクラス名として追加されます。

```tsx
const className = clsx({
  "border border-blue-500 bg-blue-500 text-white": variant === "primary",
  "border border-gray-500 bg-gray-500 text-white": variant === "secondary",
  "border border-gray-500 bg-white text-gray-500": variant === "default",
});
```

引数を配列として渡すこともできます。この形式でクラス名を渡すことで、例えば text や bg などのプレフィックスごとにグルーピングできるので、よりみとおしが良くなります。

```tsx
<button className={clsx(
  ["text-white", "dark:text-black"],
  ["bg-blue-500", "dark:bg-blue-900"],
  ["border", "border-blue-500", "dark:border-blue-900"],
  ["rounded"],
  ["px-4", "py-2"],
  ["text-sm", "font-medium"],
  ["hover:bg-opacity-80"],
  ["focus:outline-none", "focus:ring-2", "focus:ring-blue-500", "focus:ring-offset-2"],
)}>
```

## tailwind-variants, Class Variance Authority（cva）

[tailwind-variants](https://www.tailwind-variants.org/)、[Class Variance Authority（cva）](https://cva.style/docs) は UI コンポーネントのバリエーションを定義するためのライブラリです。例えばボタンコンポーネントを作る場合には、ボタンの種類（primary, secondary, default）やサイズ（small, medium, large）などのバリエーションを Props で渡して、それに応じてクラス名を付け替える処理を書くことになります。

```tsx:Button.tsx
import clsx from "clsx";

type Props = {
  variant?: "primary" | "secondary" | "default";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  rounded?: boolean;
};

export const Button: React.FC<Props> = ({
  variant = "default",
  size = "medium",
  disabled = false,
  rounded = false,
  children,
}) => {
  const className = clsx(
    variant === "primary" && "border border-blue-500 bg-blue-500 text-white",
    variant === "secondary" && "border border-gray-500 bg-gray-500 text-white",
    variant === "default" && "border border-gray-500 bg-white text-gray-500",
    disabled && "cursor-not-allowed opacity-50",
    rounded && "rounded",
    size === "small" && "px-2 py-1 text-xs",
    size === "medium" && "px-4 py-2 text-sm",
    size === "large" && "px-6 py-3 text-lg",
    "flex cursor-pointer items-center justify-center font-medium hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
  );

  return (
    <button className={className} disabled={disabled}>
      {children}
    </button>
  );
};
```

この処理をもう少し記述しやすくするためのライブラリが `tailwind-variants` と `cva` です。`cva` は Tailwind CSS 以外とも組み合わせて使用するために設計されていますが、`tailwind-variants` は始めから Tailwind CSS との組み合わせを想定しているという違いがあります。

ここでは `cva` を使った例を紹介します。

```tsx:Button.tsx
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

const button = cva(["cursor-pointer", "hover:bg-opacity-80"], // 共通のクラス名
  {
    variants: { // バリエーションを定義
      variant: {
        // variant が primary の時に適用されるクラス名
        primary: ["border", "border-blue-500", "bg-blue-500", "text-white"],
        secondary: ["border", "border-gray-500", "bg-gray-500", "text-white"],
        default: ["border", "border-gray-500", "bg-white", "text-gray-500"],
      },
      size: {
        small: ["px-2", "py-1", "text-xs"],
        medium: ["px-4", "py-2", "text-sm"],
        large: ["px-6", "py-3", "text-lg"],
      },
      disabled: {
        true: ["cursor-not-allowed", "opacity-50"],
      },
      rounded: {
        true: ["rounded"],
      },
    },
    // 複数のバリエーションを組み合わせた場合のみ適用されるクラス名
    compoundVariants: [
      {
        // <Button variant="primary" size="large"> の場合のみ uppercase クラスが適用される
        variant: "primary",
        size: "large",
        className: ["uppercase"],
      }
    ],
    // デフォルトのバリエーション
    defaultVariants: {
      variant: "default",
      size: "medium",
    },
  },
)

button() // 共通のクラス名とデフォルトのバリエーションが適用される
// => "cursor-pointer hover:bg-opacity-80 border border-gray-500 bg-white text-gray-500 px-4 py-2 text-sm flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"

button({ variant: "secondary", size: "sm" }) // variant と size のバリエーションが適用される
// => "cursor-pointer hover:bg-opacity-80 border border-gray-500 bg-gray-500 text-white px-2 py-1 text-xs flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"

// variants の型を取得
type ButtonProps = VariantProps<typeof button>;
```

React のコンポーネントとして使用する場合には、以下のように `className` に `button` を呼び出した結果を渡します。

```tsx:Button.tsx
import React from "react";
import clsx from "clsx";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

const button = cva("...");

export type ButtonProps = React.ComponentPropsWithRef<"button"> &
  VariantProps<typeof button> & {
    children?: React.ReactNode;
  }

export const Button: React.FC<ButtonProps> = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    const buttonClassName = clsx(button(props), className);

    return (
      <button className={buttonClassName} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);
```

## tailwind-merge

[tailwind-merge](https://github.com/dcastil/tailwind-merge) はコンフリクトした Tailwind CSS のクラス名を取り除きつつ結合するライブラリです。

先の例で見た通り UI コンポーネントとしてボタンを作る場合、親からスタイルの調整をする目的で追加のクラス名を渡すことがあります。この時、親で渡されたクラス名とコンポーネント内で定義したクラス名でコンフリクトが生じる恐れがあります。例えば、デフォルトでは `px-4` というクラスが付与されているボタンに対して、親から `p-6` というクラスを渡した場合です。

```tsx
<Button className="p-6" size="medium">
// px-4 py-2 p-6 という文字列が返される
```

このとき、CSS のカスケードの仕組みにより `p-6` というクラスのスタイルは無視されてしまいます。この挙動はコンポーネントを抽象化する上で望ましくありません。この問題を解決するために `tailwind-merge` を使用します。

この例では後から指定された `p-6` により、`px-4 py-2` というクラスが結果から取り除かれています。

```tsx
import { twMerge } from "tailwind-merge";

twMerge("px-4 py-2", "p-6"); // => "p-6"
```

先ほどのボタンコンポーネントの例では、`tailwind-merge` を使用して以下のように実装することができます。

```tsx:Button.tsx
import { twMerge } from "tailwind-merge";
import { cva } from "class-variance-authority";

const button = cva("...");

export const Button: React.FC<ButtonProps> = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    const buttonClassName = twMerge(button(props), className);

    return (
      <button className={buttonClassName} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);
```

## prettier-plugin-tailwindcss

[prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) は Tailwind CSS の公式として配布されている Prettier プラグインです。このプラグインは Tailwind CSS のクラス名を [推奨された順番](https://tailwindcss.com/blog/automatic-class-sorting-with-prettier#how-classes-are-sorted) でソートします。

クラス名の順序をフォーマットすることで、人によるクラス名の順序の揺れをなくすことができるので、チーム内での些細な議論を減らすことができます。

このプラグインのソートの対象となる文字列はデフォルトで `class`, `className`, `:class`, `[ngClass]` となっています。上記で紹介した `clsx` に渡す引数の文字列もソートしたい場合には `prettier.config.js` の `tailwindFunctions` に `clsx` を追加します。

```js:prettier.config.js
module.exports = {
  tailwindcss: {
    tailwindFunctions: ["clsx"],
  },
};
```

## 参考

- [Tailwind CSS実践入門：書籍案内｜技術評論社](https://gihyo.jp/book/2024/978-4-297-13943-8)
- [tailwind-variants](https://www.tailwind-variants.org/)
- [classnames](https://github.com/JedWatson/classnames)
- [clsx](https://github.com/lukeed/clsx)
- [Class Variance Authority（cva）](https://cva.style/docs)
- [tailwind-merge](https://github.com/dcastil/tailwind-merge)
- [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)
