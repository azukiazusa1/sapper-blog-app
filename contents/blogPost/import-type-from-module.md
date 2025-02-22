---
id: F3MVIQdFjGFZov1TNwywH
title: "import type { ... } from \"./module\" とは何者何か"
slug: "import-type-from-module"
about: "TypeScript のプロジェクトにおいて `import type { ... } from \"./module\"` という記述を見たことはないでしょうか？  これは Type-Only imports and export と呼ばれる機能で TypeScript3.8 より導入されました。これは名前の通りモジュールから型情報のみをインポートするために使用されます。これは通常の利用用途ではあまり考慮する必要はないのですが、特定の問題に立ち向かうために利用されることがあります。"
createdAt: "2022-03-27T00:00+09:00"
updatedAt: "2022-03-27T00:00+09:00"
tags: [""]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/6zTzB66mCu7Oi65BeJO0Nh/c9a64c4494dde084026cbfa28fa0d044/__________________________3_.png"
  title: "typescript"
selfAssessment: null
published: true
---
TypeScript のプロジェクトにおいて `import type { ... } from "./module"` という記述を見たことはないでしょうか？

これは [Type-Only imports and export](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export) と呼ばれる機能で TypeScript3.8 より導入されました。これは名前のとおりモジュールから型情報のみをインポートするために使用されます。これは通常の利用用途ではあまり考慮する必要はないのですが、特定の問題に立ち向かうために利用されることがあります。

## 型情報のみのインポートステートメントは削除される

まず、前提の知識として TypeScript から JavaScript へトランスパイル際に型情報は使われているかどうか問わずすべて削除されます。

```ts
// user/types.ts
export interface User {
  firstName: string
  lastName: string
}
```

```ts
// user/user.ts
import { User } from "./types"

export const getFullName = (user: User): string => {
  return `${user.firstName} ${user.lastName}`
}
```

```ts
// main.ts
import { User } from "./user/types";
import { getFullName } from "./user/user";

const user: User = {
  firstName: "John",
  lastName: "Doe"
}

const fullName = getFullName(user);

console.log(fullName);
```

`user/types.ts` ファイルではインターフェイス（型情報）のみをエクスポートしており、`user/user.ts` ファイルでは関数（値）をエクスポートしています。

そして `main.ts` ファイルにおいてそれぞれのファイルからインポートしています。これをトランスパイルすると以下のようなファイルが出力されます。

```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = require("./user/user");
var user = {
    firstName: "John",
    lastName: "Doe"
};
var fullName = (0, user_1.getFullName)(user);
console.log(fullName);
```

要点としては、関数という値をインポートしている場合には `var user_1 = require("./user/user");` としてトランスパイル後も残ったままですが、型情報をインポートしている部分はインポートステートメントごとまるごと削除されています。基本的に JavaScript の最終的なバンドルサイズは小さければ小さいほど不要なインポートステートメントを削除してくれるのは合理的です。

## Type-Only imports and export が解決する問題

前述のとおり型情報のみをインポートしている場合にはインポートステートメントごとまるごと削除されるのですが、これが特定の状況下において問題になることがあります。例えば。`isolatedModules` フラグをオンにしている、`transpileModuleAPI` または Babel を使用しているなどの状況があげられます。

### isolatedModules フラグによるエラー

[isolatedModules](https://www.typescriptlang.org/tsconfig#isolatedModules) フラグは TypeScript のコンパイラオプションの 1 つであり、これをオンにするとすべてのファイルを独立したモジュールとしてトランスパイルします。言い換えると、すべての ts ファイルが単独でトランスパイルできる必要があります。`isolatedModules` フラグは、曖昧に解決された import を含むことを防ぎます。

`isolatedModules` をオンにしている場合には、`export` ステートメントをが含まれないファイルはコンパイルエラーとなります。

この挙動は [Babel のデフォルトの挙動であり](https://babeljs.io/docs/en/babel-plugin-transform-typescript#:~:text=%2D%2DisolatedModules%20This%20is%20the%20default%20Babel%20behavior%2C%20and%20it%20can%27t%20be%20turned%20off%20because%20Babel%20doesn%27t%20support%20cross%2Dfile%20analysis.) `isolatedModules` フラグをオンにすることで Babel を安全に動作させることができます。

ところで、TypeScript では複数のモジュールのエクスポートを 1 つにまとめる手法が使われることがあります。（これは Barrel エクスポートと呼ばれます）具体例として前述のコードを使用しましょう。

`/user` ディレクトリ配下に `/user/index.ts` ファイルを追加します。このファイルでは `/user` ディレクトリのモジュールをそれぞれ再エクスポートする役割を担います。

```ts
// user/index.ts
export { User } from './types'
export { getFullName } from './user'
```

これにより、`main.ts` ファイルからは 1 つのファイルからのみインポートするようにまとめることができます。

```diff
// main.ts
-  import { User } from './user/types
-  import { getFullName } from './user/user
+  import { User, getFullName } from "./user";
```

しかし、`isolatedModules` フラグをオンにしている場合に、型情報のみを再エクスポートするとコンパイルエラーとなってしまいます。

```ts
export { User } from './types' // Re-exporting a type when the '--isolatedModules' flag is provided requires using 'export type'.
export { getFullName } from './user' // これはOK
```

`./types` ファイルには型情報のみが含まれており、トランスパイル時にこのファイルは取り除かれるのですがコンパイラはその情報を知ることができないので、何も存在しないモジュールをエクスポートしようとしているためコンパイルエラーとなるわけです。

この挙動は `Type-Only imports and export` により解決できます。`import` または `export` に `type` キーワードを付与することによりコンパイラにそのモジュールには型情報のみが含まれておりビルド時に不要なことを教えることができます。さきほどの型情報のみの再エクスポートは以下のように修正することでできます。

```diff
- export { User } from './types'
+ export type { User } from './types'
  export { getFullName } from './user'
```

### 循環依存

他にも、循環依存を解決する目的でも使用できます。以下の例をご参照ください。

```ts
// Foo.ts
import Bar from './Bar'

class Foo {
  constructor(
    public name: string,
  ) { }
}

const bar = new Bar(new Foo("name"))

export default Foo
```

```ts
// Bar.ts
import Foo from "./Foo";

class Bar {
  constructor(public foo: Foo) { }
}

export default Bar
```

上記例のようにファイル同士で互いにインポート・エクスポートをしている場合循環依存としてエラーとなる場合があります。この例においては、`Bar.ts` ファイル内ではクラス `Foo` をただ単に型情報として扱いたいだけで実際にランタイム上では循環依存は発生しえないです。

このような場合には `import type` を使用することで問題を解決できます。

```diff
// Bar.ts
- import Foo from "./Foo";
+ import type Foo from "./Foo";

  class Bar {
    constructor(public foo: Foo) { }
  }

  export default Bar
```

## クラスから型情報のみを利用する場合

TypeScript におけるクラスの例について考えてみましょう。クラスは設計時には「型情報」として扱われ、ランタイムでは「値」として扱われる性質を持ちます。

```ts
// User.ts
class User {
  constructor(
    public firstName: string,
    public lastName: string,
  ) { }
}

export default User
```

```ts
// main.ts
import User from './User'

// ここでは型情報として User が使用される
const user1: User = {
  firstName: 'John',
  lastName: 'Doe',
}

// ここでは値(クラス)として User が使用される
const user2: User = new User('John', 'Doe')
```

ここで、`import type` の注釈を使用した場合には `User` クラスは型情報としてのみ使用されるため `User` クラスを値として使用できなくなります。つまり、new 演算子でインスタンスを作成したりクラスを拡張して使用できなくなります。

```ts
import type User from './User'

const user1: User = {
  firstName: 'John',
  lastName: 'Doe',
}

// 'User' cannot be used as a value because it was imported using 'import type'.ts(1361)
const user2: User = new User('John', 'Doe')

// 'User' cannot be used as a value because it was imported using 'import type'.ts(1361)
class Admin extends User {
  // ..
}
```

## type Modifiers on Import Names

`import type` 構文には制限があり、値のインポートと同時に使用することはできず、1 つのモジュールから型情報と値どちらもインポートする場合にはそれぞれインポートを別に書かなくてはいけませんでした。

```ts
import type { User } from './User';
import { getFullName } from './User';
```

TypeScript 4.5 ではこれが解消され [type Modifiers on Import Names](https://devblogs.microsoft.com/typescript/announcing-typescript-4-5-beta/#type-on-import-names) により次のように書くことができるようになります。

```ts
import { getFullName, type User } from './user';
```

## まとめ

`import type { ... } from` は主にコンパイラに対してヒントを与える目的で利用されます。我々一般的な開発者にとって直接利益を与える機能ではないですが、とりあえず `type` キーワードを付与しておくのがよいでしょう。

## 参考

- [Announcing TypeScript 3.8 RC](https://devblogs.microsoft.com/typescript/announcing-typescript-3-8-rc/#type-only-imports-exports)
- [type-only imports — A new TypeScript feature that benefits Babel users](https://levelup.gitconnected.com/improving-babel-support-for-typescript-with-type-only-imports-28cb209d9460)
- [Do I need to use the "import type" feature of TypeScript 3.8 if all of my imports are from my own file?](https://stackoverflow.com/questions/61412000/do-i-need-to-use-the-import-type-feature-of-typescript-3-8-if-all-of-my-import)
