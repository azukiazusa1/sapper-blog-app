---
id: lErH11T6pu7xIRYLIuf_N
title: "MSW v2 で `HttpResponse.json()` の型がおかしいときの対処法"
slug: "msw-v2-httpresponse-json-type-error"
about: "MSW v2 の `HttpResponse.json()` の第 2 引数の型は `Response` オブジェクトの初期化時に渡すオプションを指定できます。しかし、tsconfig.json の設定によっては、この型がおかしくなることがあります。その場合には、`tsconfig.json` の `compilerOptions.lib` に `dom` を追加するのが一時的な対処法です。"
createdAt: "2023-12-02T17:42+09:00"
updatedAt: "2023-12-02T17:42+09:00"
tags: ["TypeScript", "MSW"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/KtXARcFuPKOL6yOQYO21K/f34d366a5d51109a298e37ce305408be/wood_maki_illust_4174.png"
  title: "薪のイラスト"
published: true
---

## TL;DR

`tsconfig.json` の `compilerOptions.lib` に `dom` を追加する。

```json
{
  "compilerOptions": {
    "lib": ["dom"]
  }
}
```

また、[\[node\] Expose global ResponseInit; remove NodeJS.fetch namespace by thw0rted · Pull Request #67341 · DefinitelyTyped/DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/67341) で問題が修正される予定です。

## MSW の `HttpResponse` クラス

MSW の v2 では、モックのレスポンスは Fetch API の [Response](https://developer.mozilla.org/ja/docs/Web/API/Response) オブジェクトを返すようになりました。`Response` オブジェクトを返すクラスとして [HttpResponse](https://mswjs.io/docs/api/http-response/) が用意されていますので、普段のモックの実装はこれを使うことになります。

```ts
import { http, HttpResponse } from "msw";

const handler = http.post("/user", (req, res: HttpResponse) => {
  return HttpResponse.json(
    {
      name: "John",
      age: 32,
    },
    { status: 201 },
  );
});
```

この `HttpResponse.json` の第 2 引数には、`Response` オブジェクトの初期化時に渡すオプションを指定できます。このオプションには `status`、`statusText`、`headers` があります。

https://developer.mozilla.org/ja/docs/Web/API/Response/Response#%E5%BC%95%E6%95%B0

## `ResponseInit` 型がおかしい問題

しかしながら、`tsconfig.json` の設定によっては、`HttpResponse.json` の第 2 引数の型がおかしくなることがあります。以下のように、`{ type: any }` 型としてサジェストされてしまっています。

![](https://images.ctfassets.net/in6v9lxmm5c8/6fFBBAH4m2GWQu8R9Xl71c/9bd76e0be54b7d599d06aedadd346009/__________2023-12-02_17.54.25.png)

なぜこのようなことが起きてしまっているのでしょうか？型定義を見てみましょう。`HttpResponse.json` の第 2 引数の型は `HttpResponseInit` となっています。

```ts
declare class HttpResponse extends Response {
    /**
     * Create a `Response` with a `Content-Type: "application/json"` body.
     * @example
     * HttpResponse.json({ firstName: 'John' })
     * HttpResponse.json({ error: 'Not Authorized' }, { status: 401 })
     */
    static json<BodyType extends JsonBodyType>(body?: BodyType | null, init?: HttpResponseInit): StrictResponse<BodyType>;
```

`HttpResponseInit` は `ResponseInit` を継承しています。

```ts
interface HttpResponseInit extends ResponseInit {
  type?: ResponseType;
}
```

この `ResponseInit` は `lib.dom.d.ts` で定義されているため、もし `tsconfig.json` が Node.js アプリケーション向けに設定されていて `compilerOptions.lib` に `dom` が含まれていない場合、`ResponseInit` が見つからず正しい型情報が得られないということになります。

この問題を修正するには、`tsconfig.json` の `compilerOptions.lib` に `dom` を追加する必要があります。

```json
{
  "compilerOptions": {
    "lib": ["dom"]
  }
}
```

この問題は Node.js に fetch API が提供されているのにも関わらず、`@types/node` に `ResponseInit` が定義されていないことに起因しています。この問題は [\[node\] Expose global ResponseInit; remove NodeJS.fetch namespace by thw0rted · Pull Request #67341 · DefinitelyTyped/DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/67341) がマージされることで解決される予定です。

## 参考

- [Argument of type { status: 500 } is not assignable to parameter of type 'HttpResponseInit' #1819](https://github.com/mswjs/msw/issues/1819#issuecomment-1789364174)
