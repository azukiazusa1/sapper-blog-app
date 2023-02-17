---
title: "【TypeScript】型定義をする際にもDRY原則を守る"
about: "DRY原則は非常に有名な原則ですし、普段から特に考えずとも自然と重複をさけるようなコードを書いている方も多いことでしょう。  とはいえ、TypeScriptにおいて`interface`や`type`などを用いて型定義を行う際に重複した型定義を行ってしまうことはないでしょうか？ TypeScriptには型定義をする際に重複を抑える手段は確かに存在します。そのようないくつかの方法を紹介します。"
createdAt: "2021-08-08T00:00+09:00"
updatedAt: "2021-08-08T00:00+09:00"
tags: ["TypeScript"]
published: true
---
DRY原則とは、「Don't repeat yourself」の略でコードの重複をさけるというな原則の一つです。DRY原則は非常に有名な原則ですし、普段から特に考えずとも自然と重複をさけるようなコードを書いている方も多いことでしょう。

とはいえ、TypeScriptにおいて`interface`や`type`などを用いて型定義を行う際に重複した型定義を行ってしまうことはないでしょうか？

確かに、型定義を行う際には普段コードを書くときのように関数で同じ表現のロジックをまとめたり、抽象化を行って重複をを避けるようなことはできません。

ですが、TypeScriptには型定義をする際に重複を抑える手段は確かに存在します。そのようないくつかの方法を紹介します。

# Utility Types

Utility Typesとは、TypeScriptに標準で用意されている便利な型表現で、いわば便利な関数群のようなものです。Utility Typesを利用するとベースとなる型を変換して新しい型を定義できます。

いくつかよく使う例を見ていきましょう。

## `Partial<Type>`

例えば、一般的なCRUD操作を考えてみてください。あるオブジェクトを作成する際にはすべてのプロパティを必須項目とするけれど、更新処理を行う際には更新を行うプロパティだけ項目として渡したといことでしょう。

単純に考えれば、元の型をすべてオプショナルなプロパティにすればこの要件は満たすことができます。

```ts
type Todo = {
    id: number
    title: string
    done: boolean
    createdAt: string
    updatedAt: string
}

type UpdateTodo = {
    id?: number
    title?: string
    done?: boolean
    createdAt?: string
    updateAt?: string
}

const todos: Todo[] = [{
    id: 1,
    title: 'some todo',
    done: false,
    createdAt: '2021-01-01',
    updatedAt: '2021-01-01'
}]

const updateTodo = (id: number, payload: UpdateTodo) => {
    const index = todos.findIndex(t => t.id === id)
    if (index === -1) throw new Error('not found')
    todos[index] = { ...todos[index], ...payload}
}

updateTodo(1, { done: true })
```

確かに上手くいきますが、`Todo`型の持つプロパティを再度列挙しているので重複が生じています。

再度同じプロパティを書くのも面倒ですし、何よりこの状態ですと元の`Todo`型のプロパティに変更が生じた際に`UpdateTodo`側を更新し忘れて不具合が生じる可能性があります。

（それから、`updateAt`とタイポしていることには気が付きましたか？）

```ts
type Todo = {
    id: number
    title: string
    done: boolean
    createdAt: Date
    updatedAt: Date
}

type UpdateTodo = {
    id?: number
    title?: string
    done?: boolean
    createdAt?: string // Date型に変更し忘れている！！
    updatedAt?: string
}
```

このような場合には、`Partial`が使えます。`Partial`は型を1つ受け取りすべてをオプショナルにしたものを返します。

```ts
type Todo = {
    id: number
    title: string
    done: boolean
    createdAt: string
    updatedAt: string
}

type UpdateTodo = Partial<Todo>

// type UpdateTodo = {
//    id?: number | undefined;
//    title?: string | undefined;
//    done?: boolean | undefined;
//    createdAt?: string | undefined;
//    updatedAt?: string | undefined;
// }
```

## `Required<Type>`

`Required`は`Partial`とは反対に、すべて必須の型にしたものを返します。

```ts
type UpdateTodo = {
    id?: number
    title?: string
    done?: boolean
    createdAt?: string
    updatedAt?: string
}

type Todo = Required<UpdateTodo>
// type Todo = {
//     id: number;
//     title: string;
//     done: boolean;
//     createdAt: string;
//     updatedAt: string;
}
```

## Pick<Type, Keys>

もう一つ別の例を考えてみましょう。

`Todo`型は`id`・`createdAt`・`updatedAt`というプロパティを持っていますが、これらはおそらくデータベースで自動生成されるものでしょう。であれば、ユーザーの入力させる型としてはこれらのプロパティを除いたものを定義したいでしょう。

```ts
type Todo = {
    id: number
    title: string
    done: boolean
    createdAt: string
    updatedAt: string
}

type TodoPayload = {
    title: string
    done: boolean
}
```

この例でも同じく重複が生じてしまっています。

これは、`Pick`を使うことで解決します。
`Pick`はある型から必要な部分だけを抽出します。

```ts
type Todo = {
    id: number
    title: string
    done: boolean
    createdAt: string
    updatedAt: string
}

type TodoPayload = Pick<Todo, 'title' | 'done'>

// type TodoPayload = {
//     title: string;
//     done: boolean;
// }
```

こうしておけば、元の型が変更されたときに追従することができます。また、`Pick`を定義する際にインテリセンスが効くのでプロパティ名のタイポを防げる点もメリットの一つでしょう。

## Omit<Type, Keys>

`Omit`は`Pick`とは逆に除外するべきプロパティを選択します。

```ts
ype Todo = {
    id: number
    title: string
    done: boolean
    createdAt: string
    updatedAt: string
}

type TodoPayload = Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>

// type TodoPayload = {
//     title: string;
//     id: number;
// }
```

`Omit`は`Pick`とは異なり`Keys`に存在しないプロパティ名を指定できてしまうことに注意してください。つまり、インテリセンスは効きませんしタイポを警告してくれません。

この他にも、たくさんのUtility Typesが存在しますがこの記事の趣旨からは少しそれるので残りは省略します。

気になる方は、以下のリンクをご参照ください。

[TypeScript: Documentation - Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

自分で型定義を行う際には、Utility Typesを思い出してまずは適用させられないか考えて見る癖をつけるのが良いでしょう。

# ライブラリの提供する型定義を利用する

もしコードの中でライブラリを使用している箇所があるなら、あなたは決してそのライブラリに関する型情報を自分で書いてはいけません。

あなたが利用しているライブラリの作者（またはコミュニティ）は大抵の場合そのライブラリに関する型情報をエクスポートしてくれているはずです。

それをわざわざ自分で再定義するというのは面倒な作業ですし、すでに用意されているものを使ったほうが安全です。

例として、[Vuetifyのv-data-table](https://vuetifyjs.com/ja/api/v-data-table/#api-props)を見てみましょう。

ヘッダーを定義するために、次のようなオブジェクトの配列を`header`プロパティに渡す必要があることが書かれています。

```ts
{
  text: string,
  value: string,
  align?: 'start' | 'center' | 'end',
  sortable?: boolean,
  filterable?: boolean,
  groupable?: boolean,
  divider?: boolean,
  class?: string | string[],
  cellClass?: string | string[],
  width?: string | number,
  filter?: (value: any, search: string, item: any) => boolean,
  sort?: (a: any, b: any) => number
}
```

このようなドキュメントに記載されている型定義は`vuetify`モジュールからインポートすることができるので、ありがたく使わせていただきましょう。

```ts
import { DataTableHeader } from 'vuetify'

const myHeaders = (): DataTableHeader[] => {
  return [
    {
      text: 'Dessert (100g serving)',
      align: 'start',
      sortable: false,
      value: 'name'
    },
    { text: 'Calories', value: 'calories' }
  ]
}
```

# 型定義を自動生成する

やはり、一番ベストな方法は自分で型定義を作成せずにすべて任せる方法です。

OpenAPIやGraphQLを利用してバックエンドの型情報を自動生成する方法を記載します。

## OpenAPI Generator

OpenAPIとはRest APIを記述するためのフォーマットのことで、以下のようにAPI全体を記述できます。
- 使用可能なエンドポイント（/users）と各エンドポイントでの操作（GET /users、POST /users）
- 操作パラメータ各操作の入力と出力
- 認証方法
- 連絡先情報、ライセンス、利用規約およびその他の情報。

OpenAPIは`JSON`か`YAML`で記述されるので、人間と機械どちらでも読むことができます。

例として以下のような構造を持ちます。

```yaml
openapi: 3.0.0
info:
  title: Sample API
  description: Optional multiline or single-line description in [CommonMark](http://commonmark.org/help/) or HTML.
  version: 0.1.9
servers:
  - url: http://api.example.com/v1
    description: Optional server description, e.g. Main (production) server
  - url: http://staging-api.example.com
    description: Optional server description, e.g. Internal staging server for testing
paths:
  /users:
    get:
      summary: Returns a list of users.
      description: Optional extended description in CommonMark or HTML.
      responses:
        '200':    # status code
          description: A JSON array of user names
          content:
            application/json:
              schema: 
                type: array
                items: 
                  type: string
```

https://swagger.io/docs/specification/basic-structure/

そして、このOpenAPIの使用にそって記述されたYAMLファイルを用いて型定義を自動生成することができます。その中でも、[openapi-genarator](https://github.com/OpenAPITools/openapi-generator)はデファクトスタンダードといえるでしょう。

実際に`openapi-generator`を元にTypeScriptの型定義を生成してみましょう。

### パッケージのインストール

今回はサンプルとして、以下のリンクのファイルを使用して型定義を生成します。

https://raw.githubusercontent.com/openapitools/openapi-generator/master/modules/openapi-generator/src/test/resources/3_0/petstore.yaml

型定義を生成するために必要なパッケージをインストールします。

```ts
npm install @openapitools/openapi-generator-cli -D
```

インストールが完了したら、`package.json`に以下スクリプトを追加します。

```json
  "scripts": {
    "generate": "openapi-generator-cli generate -i openapi.yaml -g typescript-axios -o src/model"
  },
```

コマンドのオプションはそれぞれ以下の通りです。

| オプション    | Header     |
| ---------- | ---------- |
| -i       | 生成元のOpenAPIのファイル      |
| -g       | 利用するジェネレーター。open-api-generatorは複数の言語の出力に対応しているのでTypeScript用のジェネレーターを指定する。今回は`axios`を選択しているが他にもTypeScirpt用のジェネレーターにはAnguar, AnguarJS, fetch, jqueryなどがある       |
| -o       | 生成した型定義の出力先      |

コマンドを実行します。

```sh
npm run generate
```

### 自動生成されたファイルを確認する

成功すると、アウトプット先に指定して`src/model`配下に以下のようなファイルが生成されます。

```sh
src/model/
├── api.ts
├── base.ts
├── common.ts
├── configuration.ts
├── git_push.sh
└── index.ts
```

`api.ts`ファイルを見てみるとリクエストとレスポンスの`interface`が生成されていることがわかります。

```ts
/**
 * Describes the result of uploading an image resource
 * @export
 * @interface ApiResponse
 */
export interface ApiResponse {
    /**
     * 
     * @type {number}
     * @memberof ApiResponse
     */
    code?: number;
    /**
     * 
     * @type {string}
     * @memberof ApiResponse
     */
    type?: string;
    /**
     * 
     * @type {string}
     * @memberof ApiResponse
     */
    message?: string;
}
/**
 * A category for a pet
 * @export
 * @interface Category
 */
export interface Category {
    /**
     * 
     * @type {number}
     * @memberof Category
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof Category
     */
    name?: string;
}

// 省略
```

### 生成されたクライアントを使用する

`openapi-generator`によって生成されるのは型定義だけではなく、APIクライアントも生成されます。

APIクライアントのクラスはグルーピングに使用される`tags`ごとに生成されます。

後は、インスタンスのエンドポイントに対応したメソッドを呼び出せばAPIリクエストを送信することができます。

```ts
import { PetApi } from "./model/api";

const petApi = new PetApi()
petApi.addPet({ name: 'pet', photoUrls: ['aaa.jpg'] })`
```

## GraphQL

つづいてGraphQLからTypeScriptの型定義を生成します。

GraphQLではOpenAPIのようにスキーマから型定義を生成するほか他にサーバーのエンドポイントからも型定義を生成することができます。

GraphQLから型定義を生成するライブラリはいくつかありますが、以下が有名どころです。

- graphql-codegen
- Apollo

今回は、[graphql-codegen](https://www.graphql-code-generator.com/)を使用してやってみます。

### パッケージのインストール

例として、`GraphQL Content API`から型定義を生成します。
これはHeadless CMSの一つである「Contentful」が提供するGraphQLのエンドポイントです。

ひとまず必要なパッケージをインストールしましょう。とりあえず`graphql`は必要です。

```sh
npm install --save graphql gql
```

型定義を生成するパッケージもインストールします。

```sh
npm install --save-dev @graphql-codegen/cli @graphql-codegen/typescript
```

### セットアップ

インストールが完了したら以下コマンドでセットアップします。

```sh
npx graphql-codegen init
```

`codegen.yaml`ファイルが生成されます。例として以下のように設定しました。

```yaml
overwrite: true
schema:
  - "https://graphql.contentful.com/content/v1/spaces/${SPACE}/environments/${ENVIRONMENTS}":
      headers:
        Authorization: Bearer ${API_KEY}
documents: "src/**/*.ts"
generates:
  src/generated/graphql.ts:
    plugins:
      - "typescript"
      - "typescript-operations"
  ./graphql.schema.json:
    plugins:
      - "introspection"
```

`package.json`にスクリプトを追加しましょう。

```json
{
  "scripts": {
    "generate": "graphql-codegen --config codegen.yml -r dotenv/config"
  }
}
```

`codegen.yaml`内で環境変数を使用している箇所があるので(`${}`で囲われているところ)`-r dotenv/config`オプションを付与します。

### Query・Mutationsを定義

GraphQLはQuery・Mutationsを定義してリソースを操作するのですが、`@graphql-codegen/typescript`パッケージによりそのような操作に対しても型を付与できます。

例として`src/queries`内に投稿(Post)一覧を取得する以下のようなクエリを定義します。

```ts
import { gql } from "@urql/core"

export const postsQuery = gql`
  query Posts(
    $order: BlogPostOrder = createdAt_DESC,
    $limit: Int = 12,
    $skip: Int = 0,
  ) {
    blogPostCollection(
      limit: $limit,
      skip: $skip,
      order: [$order]
    ) {
      total
      skip
      limit
      items {
        title
        slug
        about
        createdAt
        thumbnail {
          title
          url
        }
        tagsCollection(limit: 5) {
          items {
            name
            slug
          }
        }
      }
    }
  }
`

（GraphQLに馴染みがないと難解に思われると思いますが・・・）

クエリから型定義を生成するもう一つメリットとして、タイポなどで誤った記述をした際にエラーを報告してくれるところでしょう。

例えば存在しないフィールド指定してコマンドを実行すると以下のように怒られます。

```sg
$ npm run generate
 Found 2 errors

  ✖ ./graphql.schema.json
    AggregateError: 
        GraphQLDocumentError: Cannot query field "tota" on type "BlogPostCollecti
on". Did you mean "total"?
```

### コマンドを実行する

ここまで準備ができたらコマンドを実行してみましょう。

```sh
npm run generate
```

実行に成功すると、`src/generated/graphql.ts`に型定義ファイルが生成されています。

```ts
export type BlogPostCollection = {
  __typename?: 'BlogPostCollection';
  total: Scalars['Int'];
  skip: Scalars['Int'];
  limit: Scalars['Int'];
  items: Array<Maybe<BlogPost>>;
};

/** blog post [See type definition](https://app.contentful.com/spaces/in6v9lxmm5c8/content_types/blogPost) */
export type BlogPost = Entry & {
  __typename?: 'BlogPost';
  sys: Sys;
  linkedFrom?: Maybe<BlogPostLinkingCollections>;
  about?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  thumbnail?: Maybe<Asset>;
  title?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  article?: Maybe<Scalars['String']>;
  tagsCollection?: Maybe<BlogPostTagsCollection>;
  relatedArticleCollection?: Maybe<BlogPostRelatedArticleCollection>;
};

export type PostsQueryVariables = Exact<{
  order?: Maybe<BlogPostOrder>;
  limit?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
}>;

export type PostsQuery = (
  { __typename?: 'Query' }
  & { blogPostCollection?: Maybe<(
    { __typename?: 'BlogPostCollection' }
    & Pick<BlogPostCollection, 'total' | 'skip' | 'limit'>
    & { items: Array<Maybe<(
      { __typename?: 'BlogPost' }
      & Pick<BlogPost, 'title' | 'slug' | 'about' | 'createdAt'>
      & { thumbnail?: Maybe<(
        { __typename?: 'Asset' }
        & Pick<Asset, 'title' | 'url'>
      )>, tagsCollection?: Maybe<(
        { __typename?: 'BlogPostTagsCollection' }
        & { items: Array<Maybe<(
          { __typename?: 'Tag' }
          & Pick<Tag, 'name' | 'slug'>
        )>> }
      )> }
    )>> }
  )> }
);
```

以上のような型定義が生成さました。(Queryの方は難解すぎてよくわからんですが、しっかりと使えます）
