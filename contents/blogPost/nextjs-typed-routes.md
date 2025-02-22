---
id: 9Y3zrupuk7C0gzNJ9KLuT
title: "Next.js 型安全なルーティングを使う"
slug: "nextjs-typed-routes"
about: "Next.js では実験的な機能として、型安全なルーティングを利用できます。この機能を使うことでリンク先のパス名を静的に検査できるため、typo などのエラーを事前に防ぐことができます。"
createdAt: "2024-04-28T15:46+09:00"
updatedAt: "2024-04-28T15:46+09:00"
tags: ["Next.js", ""]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2f5DWYmpUm8NH4pVgXZefW/7503480fd589bfe618383b8020ffdacb/bike_goggles-helmet_15989-768x768.png"
  title: "ゴーグル付きのヘルメットのイラスト"
selfAssessment:
  quizzes:
    - question: "Next.js で型安全なルーティングを有効にするため必要な条件として、当てはまらないものはどれか？"
      answers:
        - text: "App Router と TypeScript を使用している"
          correct: false
          explanation: null
        - text: "`experimental.typedRoutes` フラグを有効にする"
          correct: false
          explanation: null
        - text: "Next.js のバージョンが 13.2 以上である"
          correct: false
          explanation: null
        - text: "npm run generate-types コマンドを実行して、型定義ファイルを生成する"
          correct: true
          explanation: "型定義ファイルは `npm run dev` や `npm run build` を実行することで自動生成されます。"
published: true
---
!> この記事における「型安全」とは、静的な型検査によりランタイムで起こり得るエラーを事前に検知することを指します。

Next.js では Next.js 13.2　より実験的な機能として、型安全なルーティングを利用できます。この機能を使うことでリンク先のパス名を静的に検査できるため、typo などのエラーを事前に防ぐことができます。

なお、型安全なルーティングを利用するためには App Router と TypeScript を使用している必要があります。

## 型安全なルーティングの利用方法

型安全なルーティングを有効にするためには、`experimental.typedRoutes` フラグを有効にする必要があります。`next.config.mjs` に以下のように設定します。

```js:next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
```

ルーティングの型情報は `.next/types/link.d.ts` ファイルに自動的に生成されます。`next dev` や `next build` を実行して `.next/types` ディレクトリが生成されるようにしておきましょう。

```sh
next dev
```

<details>
<summary>`.next/types/link.d.ts` の型定義</summary>

`/`, `/about`, `/blog/[slug]`, `/shop/[...slug]` などのルートを作成した場合以下のような型定義が生成されます。

```ts:.next/types/link.d.ts
// Type definitions for Next.js routes

/**
 * Internal types used by the Next.js router and Link component.
 * These types are not meant to be used directly.
 * @internal
 */
declare namespace __next_route_internal_types__ {
  type SearchOrHash = `?${string}` | `#${string}`
  type WithProtocol = `${string}:${string}`

  type Suffix = '' | SearchOrHash

  type SafeSlug<S extends string> = S extends `${string}/${string}`
    ? never
    : S extends `${string}${SearchOrHash}`
    ? never
    : S extends ''
    ? never
    : S

  type CatchAllSlug<S extends string> = S extends `${string}${SearchOrHash}`
    ? never
    : S extends ''
    ? never
    : S

  type OptionalCatchAllSlug<S extends string> =
    S extends `${string}${SearchOrHash}` ? never : S

  type StaticRoutes =
    | `/`
    | `/about`
  type DynamicRoutes<T extends string = string> =
    | `/blog/${SafeSlug<T>}`
    | `/shop/${CatchAllSlug<T>}`

  type RouteImpl<T> =
    | StaticRoutes
    | SearchOrHash
    | WithProtocol
    | `${StaticRoutes}${SearchOrHash}`
    | (T extends `${DynamicRoutes<infer _>}${Suffix}` ? T : never)

}

declare module 'next' {
  export { default } from 'next/types/index.js'
  export * from 'next/types/index.js'

  export type Route<T extends string = string> =
    __next_route_internal_types__.RouteImpl<T>
}

declare module 'next/link' {
  import type { LinkProps as OriginalLinkProps } from 'next/dist/client/link.js'
  import type { AnchorHTMLAttributes, DetailedHTMLProps } from 'react'
  import type { UrlObject } from 'url'

  type LinkRestProps = Omit<
    Omit<
      DetailedHTMLProps<
        AnchorHTMLAttributes<HTMLAnchorElement>,
        HTMLAnchorElement
      >,
      keyof OriginalLinkProps
    > &
      OriginalLinkProps,
    'href'
  >

  export type LinkProps<RouteInferType> = LinkRestProps & {
    /**
     * The path or URL to navigate to. This is the only required prop. It can also be an object.
     * @see https://nextjs.org/docs/api-reference/next/link
     */
    href: __next_route_internal_types__.RouteImpl<RouteInferType> | UrlObject
  }

  export default function Link<RouteType>(props: LinkProps<RouteType>): JSX.Element
}

declare module 'next/navigation' {
  export * from 'next/dist/client/components/navigation.js'

  import type { NavigateOptions, AppRouterInstance as OriginalAppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime.js'
  interface AppRouterInstance extends OriginalAppRouterInstance {
    /**
     * Navigate to the provided href.
     * Pushes a new history entry.
     */
    push<RouteType>(href: __next_route_internal_types__.RouteImpl<RouteType>, options?: NavigateOptions): void
    /**
     * Navigate to the provided href.
     * Replaces the current history entry.
     */
    replace<RouteType>(href: __next_route_internal_types__.RouteImpl<RouteType>, options?: NavigateOptions): void
    /**
     * Prefetch the provided href.
     */
    prefetch<RouteType>(href: __next_route_internal_types__.RouteImpl<RouteType>): void
  }

  export declare function useRouter(): AppRouterInstance;
}
```

</details>

試しに新しいページを作成してみましょう。`app/about/page.tsx` というファイルを作成します。

```sh
mkdir app/about
touch app/about/page.tsx
```

`next/link` の `Link` コンポーネントの `href` プロパティの型が `string` から `UrlObject | RouteImpl<"">'` となっており、`/` もしくは `/about` という文字列のみを受け付けるようになります。

```tsx
import Link from "next/link";

<Link href="/"></Link>; // OK
<Link href="/about"></Link>; // OK
<Link href="/something"></Link>; // Type '"/something"' is not assignable to type 'UrlObject | RouteImpl<"/something">'.

// クエリパラメータやハッシュパラメーターを渡せる
<Link href="/about?foo=bar"></Link>;
<Link href="/about#baz"></Link>;
<Link href="/something#?foo=bar"></Link>; // Type '"/something#?foo=bar"' is not assignable to type 'UrlObject | RouteImpl<"/something#?foo=bar">'.

// 外部の URL 文字列を受け取る
<Link href="https://example.com/about"></Link>; // OK
<Link href="https://example.com/something"></Link>; // OK

// URL オブジェクトの引数の文字列は任意の文字列を渡せるが、エディタの補完が効く
<Link href={new URL("/about")}></Link>; // OK
```

![](https://images.ctfassets.net/in6v9lxmm5c8/QQWOhQtNYJdwNXW7rsgKY/bc343384f3b37689bb07b099a52543b8/__________2024-04-28_16.18.22.png)

`useRouter` フックでも同様に `push()`, `replace()`, `prefetch()` メソッドの引数の型が変更されます。

```tsx
import { useRouter } from "next/navigation";

const router = useRouter();

router.push("/"); // OK
router.push("/about"); // OK
router.push("/something"); // Type '"/something"' is not assignable to type 'UrlObject | RouteImpl<"/something">'.
```

パスパラメータを受け取るダイナミックなルートでは、パスパラメータの部分は任意の文字列として扱われます。`app/blog/[slug]/page.tsx` というファイルを作成すると、`/blog/${string}` 形式の型を受け取ることができます。また `app/shop/[...slug]/page.tsx` のような catch-all ルートにも対応しています。

```tsx
import Link from "next/link";

<Link href="/blog/hello"></Link>; // OK
<Link href="/blog/123"></Link>; // OK
<Link href="/blog/123/456"></Link>; // Type '"/blog/123/456"' is not assignable to type 'UrlObject | RouteImpl<"/blog/123/456">'
<Link href="/about/hello"></Link>; // Type '"/about/hello"' is not assignable to type 'UrlObject | RouteImpl<"/about/hello">'.
<Link href="/shop/aaa/bbb/ccc"></Link>; // OK
```

ルートパラメータを変数で渡す場合には、テンプレートリテラルを使っている場合には型エラーは発生しません。それ以外の方法で文字列を構築している場合、`as Route` で型をキャストする必要があります。

```tsx
import { Route } from "next";
import Link from "next/link";

const slug = "hello";

<Link href={`/blog/${slug}`}></Link>; // OK`
<Link href={"/blog/" + slug}></Link>; // Type 'string' is not assignable to type 'UrlObject | RouteImpl<string>'.
<Link href={("/blog/" + slug) as Route}></Link>; // OK
```

`<Link>` をラップしたコンポーネントを作成し、`href` Props を渡す場合にはジェネリックを使用します。ルーティングの型は `"next"` モジュールからインポートした `Route` を使用します。

```tsx
import type { Route } from "next";
import Link from "next/link";

function MyLink<T extends string>({
  href,
  label,
}: {
  href: Route<T> | URL;
  label: string;
}) {
  return <Link href={href}>{label}</Link>;
}
```

## まとめ

- Next.js では実験的な機能として、型安全なルーティングを利用できる
- `experimental.typedRoutes` フラグを有効にすることで、リンク先のパス名を静的に検査できる
- ルーティングの型情報は `npm run dev` や `npm run build` を実行することで `app/` ディレクトリのルーティング情報を元に自動生成される -`<Link>` コンポーネントの `href` プロパティの型が `string` から `UrlObject | RouteImpl<"">'` に変更され、`/` や `/about`, `/blog/foo` のようなルーティングに対応した文字列のみを受け付けるようになる

## 参考

- [Statically Typed Links | Next.js](https://nextjs.org/docs/app/building-your-application/configuring/typescript#statically-typed-links)
