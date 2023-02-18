---
id: 2fEkvrrwB4SSJ4rBBcOtKk
title: "はじめてのGraphQL"
slug: "what-is-graphql"
about: "GraphQLとは、Facebookが開発したAPI向けのクエリ言語です。RESTに変わるサーバーとクライアントの通信手段として注目を集めています。 リクエスト・レスポンスの型の定義ができる、フロント側から取得するデータを選択することができるなどの特徴があります。 GraphQL自体はSQLのようなクエリ言語としての位置づけなので、Java、Node.js、Ruby、JavaScript、Pythonなど様々な言語で利用することができます。"
createdAt: "2021-02-17T00:00+09:00"
updatedAt: "2021-02-17T00:00+09:00"
tags: ["graphQL"]
published: true
---
# GraphQLとは

GraphQLとは、Facebookが開発したAPI向けのクエリ言語です。RESTに変わるサーバーとクライアントの通信手段として注目を集めています。
リクエスト・レスポンスの型の定義ができる、フロント側から取得するデータを選択することができるなどの特徴があります。

GraphQL自体はSQLのようなクエリ言語としての位置づけなので、Java、Node.js、Ruby、JavaScript、Pythonなど様々な言語で利用することができます。

最近では、NetFlixがRESTをやめてGraphQLに乗り換えた事例が記憶に新しいです。

# なぜRESTではなくGraphQLを使うのか

GraphQLは、当時RESTfulなAPIサーバーを利用していたFacebookがクライアント/サーバーアプリケーションの性能上の課題とデータ構造の要件を満たす解決策として開発されました。

RESTにどのような課題があって、それをGraphQLはどのように解決するのかという視点で見ていきます。

## RESTの課題

### 大きすぎるレスポンス

RESTの課題の一つは、レスポンスが大きすぎることです。

例えば、[PokeAPI](https://pokeapi.co/)からピカチュウのデータを取得するGETリクエストを発行すると次のようなレスポンスが返されます。

[https://pokeapi.co/api/v2/pokemon/pikachu](https://pokeapi.co/api/v2/pokemon/pikachu)

```json
{"abilities":[{"ability":{"name":"static","url":"https://pokeapi.co/api/v2/ability/9/"},"is_hidden":false,"slot":1},{"ability":{"name":"lightning-rod","url":"https://pokeapi.co/api/v2/ability/31/"},"is_hidden":true,"slot":3}],"base_experience":112,"forms":[{"name":"pikachu","url":"https://pokeapi.co/api/v2/pokemon-form/25/"}],"game_indices":[{"game_index":84,"version":{"name":"red","url":"https://pokeapi.co/api/v2/version/1/"}},{"game_index":84,"version":{"name":"blue","url":"https://pokeapi.co/api/v2/version/2/"}},{"game_index":84,"version":{"name":"yellow","url":"https://pokeapi.co/api/v2/version/3/"}},{"game_index":25,"version":{"name":"gold","url":"https://pokeapi.co/api/v2/version/4/"}},{"game_index":25,"version":{"name":"silver","url":"https://pokeapi.co/api/v2/version/5/"}},{"game_index":25,"version":{"name":"crystal","url":"https://pokeapi.co/api/v2/version/6/"}},{"game_index":25,"version":{"name":"ruby","url":"https://pokeapi.co/api/v2/version/7/"}},{"game_index":25,"version":{"name":"sapphire","url":"https://pokeapi.co/api/v2/version/8/"}},{"game_index":25,"version":{"name":"emerald","url":"https://pokeapi.co/api/v2/version/9/"}},{"game_index":25,"version":{"name":"firered","url":"https://pokeapi.co/api/v2/version/10/"}},{"game_index":25,"version":{"name":"leafgreen","url":"https://pokeapi.co/api/v2/version/11/"}},{"game_index":25,"version":{"name":"diamond","url":"https://pokeapi.co/api/v2/version/12/"}},{"game_index":25,"version":{"name":"pearl","url":"https://pokeapi.co/api/v2/version/13/"}},{"game_index":25,"version":{"name":"platinum","url":"https://pokeapi.co/api/v2/version/14/"}},{"game_index":25,"version":{"name":"heartgold","url":"https://pokeapi.co/api/v2/version/15/"}},{"game_index":25,"version":{"name":"soulsilver","url":"https://pokeapi.co/api/v2/version/16/"}},{"game_index":25,"version":{"name":"black","url":"https://pokeapi.co/api/v2/version/17/"}},{"game_index":25,"version":{"name":"white","url":"https://pokeapi.co/api/v2/version/18/"}},{"game_index":25,"version":{"name":"black-2","url":"https://pokeapi.co/api/v2/version/21/"}},{"game_index":25,"version":{"name":"white-2","url":"https://pokeapi.co/api/v2/version/22/"}}],"height":4,"held_items":[{"item":{"name":"oran-berry","url":"https://pokeapi.co/api/v2/item/132/"},"version_details":[{"rarity":50,"version":{"name":"ruby","url":"https://pokeapi.co/api/v2/version/7/"}},{"rarity":50,"version":{"name":"sapphire","url":"https://pokeapi.co/api/v2/version/8/"}},{"rarity":50,"version":{"name":"emerald","url":"https://pokeapi.co/api/v2/version/9/"}},{"rarity":50,"version":{"name":"diamond","url":"https://pokeapi.co/api/v2/version/12/"}},{"rarity":50,"version":{"name":"pearl","url":"https://pokeapi.co/api/v2/version/13/"}},{"rarity":50,"version":{"name":"platinum","url":"https://pokeapi.co/api/v2/version/14/"}},{"rarity":50,"version":{"name":"heartgold","url":"https://pokeapi.co/api/v2/version/15/"}},{"rarity":50,"version":{"name":"soulsilver","url":"https://pokeapi.co/api/v2/version/16/"}},{"rarity":50,"version":{"name":"black","url":"https://pokeapi.co/api/v2/version/17/"}},{"rarity":50,"version":{"name":"white","url":"https://pokeapi.co/api/v2/version/18/"}}]},{"item":{"name":"light-ball","url":"https://pokeapi.co/api/v2/item/213/"},"version_details":[{"rarity":5,"version":{"name":"ruby","url":"https://pokeapi.co/api/v2/version/7/"}},{"rarity":5,"version":{"name":"sapphire","url":"https://pokeapi.co/api/v2/version/8/"}},{"rarity":5,"version":{"name":"emerald","url":"https://pokeapi.co/api/v2/version/9/"}},{"rarity":5,"version":{"name":"diamond","url":"https://pokeapi.co/api/v2/version/12/"}},{"rarity":5,"version":{"name":"pearl","url":"https://pokeapi.co/api/v2/version/13/"}},{"rarity":5,"version":{"name":"platinum","url":"https://pokeapi.co/api/v2/version/14/"}},{"rarity":5,"version":{"name":"heartgold","url":"https://pokeapi.co/api/v2/version/15/"}},{"rarity":5,"version":{"name":"soulsilver","url":"https://pokeapi.co/api/v2/version/16/"}},{"rarity":1,"version":{"name":"black","url":"https://pokeapi.co/api/v2/version/17/"}},{"rarity":1,"version":{"name":"white","url":"https://pokeapi.co/api/v2/version/18/"}},{"rarity":5,"version":{"name":"black-2","url":"https://pokeapi.co/api/v2/version/21/"}},{"rarity":5,"version":{"name":"white-2","url":"https://pokeapi.co/api/v2/version/22/"}},{"rarity":5,"version":{"name":"x","url":"https://pokeapi.co/api/v2/version/23/"}},{"rarity":5,"version":{"name":"y","url":"https://pokeapi.co/api/v2/version/24/"}},{"rarity":5,"version":{"name":"omega-ruby","url":"https://pokeapi.co/api/v2/version/25/"}},{"rarity":5,"version":{"name":"alpha-sapphire","url":"https://pokeapi.co/api/v2/version/26/"}},{"rarity":5,"version":{"name":"sun","url":"https://pokeapi.co/api/v2/version/27/"}},{"rarity":5,"version":{"name":"moon","url":"https://pokeapi.co/api/v2/version/28/"}},{"rarity":5,"version":{"name":"ultra-sun","url":"https://pokeapi.co/api/v2/version/29/"}},{"rarity":5,"version":{"name":"ultra-moon","url":"https://pokeapi.co/api/v2/version/30/"}}]}],"id":25,"}
# 省略
```

これは実際のレスポンスの本の一部であり、実際にはもっと巨大です。本体クライアントが必要なデータは名前、タイプだけだったかもしれませんが、大量の必要のないデータを受け取る必要があります。

```json
{
  "name": "pikachu",
  "types": ["electric"]
}
``` 

### 少なすぎるレスポンス

今度は逆にレスポンスが少なすぎるという問題が起こる可能性があります。
例えば、ピカチュウがどのような進化をするのかデータを取得したくなるかもしれません。

PokeAPIで進化に関する情報を取得するにはまず[https://pokeapi.co/api/v2/pokemon/pikachu](https://pokeapi.co/api/v2/pokemon/pikachu)のデータを取得した上で、speciesに関する情報を取得します。

```json
 "species": {
    "name": "pikachu",
    "url": "https://pokeapi.co/api/v2/pokemon-species/25/"
  },
```

取得したspeciesの情報からさらにAPIリクエストを送る必要があります。evolution_chainという情報からピカチュウの進化情報が取得できるので、さらにAPIリクエストを送ります。

```json
 "evolution_chain": {
    "url": "https://pokeapi.co/api/v2/evolution-chain/10/"
  },
```

ようやくここでピカチュウはピチューから進化してさらにライチュウに進化するという情報が得られました。ピチューとライチュウの詳細情報を得るには、さらに2回APIリクエストを送る必要があるでしょう。

```json
"is_baby": false,
 "species": {
   "name": "raichu",
   "url": "https://pokeapi.co/api/v2/pokemon-species/26/"
},
"is_baby": true,
"species": {
  "name": "pichu",
  "url": "https://pokeapi.co/api/v2/pokemon-species/172/"
}
```

このように1回で十分な情報が取得できないために、いくつもの余分なリクエストを送信しなければなりません。また、それぞれの実際のレスポンスには当然不必要な情報もたくさん含まれています。

### エンドポイント、ドキュメントの管理

最後の問題点として、エンドポイント、ドキュメントの管理の煩雑さが挙げられます。REST APIはクライアントに変更が加わるたびに新しいエンドポイントを作成する必要があり、エンドポイントの数が膨れ上がってきます。

また、適切にドキュメントが更新されていればよいですが、エンドポイントの数が多くなるに釣れスキーマなどを管理・保守することは大変になってきます。

## GraphQLはどのように解決するのか

これらのREST APIの問題点について、GraphQLがどのように解決するのかを見ていきましょう。
Poke APIの代わりに[GraphQL Pokemon](https://github.com/lucasbento/graphql-pokemon)を使っていきます。

クエリの発行は、[プレイグラウンド](https://graphql-pokemon2.vercel.app/)からブラウザで試すことができます。

![スクリーンショット 20210117 22.03.46.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2FlSuZhRyzmCa3Ez9TGjFS%2F327d2a9b6d23dcf282da011972a1cdd2.png?alt=media&token=d8b52919-5a69-4190-bd74-faa9ecff0571)

### ピカチュウのタイプを取得

それでは、REST APIの例と同様にピカチュウの名前とタイプを取得してみましょう。
GraphQLには、`Query`・`Mutation`・`Subscription`の3つのクエリが存在します。GETリクエストに相当するものが`Query`です。

`Query`を使ってデータを取得しましょう。

```js
query {
  pokemon(name: "Pikachu") {
    name
    types
  }
}
```

`query`コマンドによって、`pokemon`というスキーマのデータを取得しようとしています。`(name: "Pikachu")`によって、特定のデータを取得するように指示します。
さらに、取得するフィールドを宣言しています。ここでは、`name`（名前)と`types`(タイプ)フィールドを宣言しています。これはSQLのSELECT文とよく似ており、宣言したフィールド以外はレスポンスに含まれません。

レスポンスは次のようになります。

```json
{
  "data": {
    "pokemon": {
      "name": "Pikachu",
      "types": [
        "Electric"
      ]
    }
  }
}
```

### ピカチュウの進化情報を取得

取得する情報に`evolutions`を含めると、進化情報を`pokemon`型で取得できます。

```js
{
  pokemon(name: "Pikachu") {
    name
    types
    weight {
      minimum
      maximum
    }
    height {
      minimum
      maximum
    }
    image
    evolutions {
      name
      types
      weight {
        minimum
        maximum
      }
      height {
        minimum
        maximum
      }
      image
    }
  }
}

```

レスポンスは次のとおりです。（Poke APIと異なりGraphQL Pokemonは第一世代の情報しか含まれていないのでレスポンスにピチューは含まれていません・・・）

一度のリクエストだけで、必要なすべての情報が取得できていることがわかります。

```json
{
  "data": {
    "pokemon": {
      "name": "Pikachu",
      "types": [
        "Electric"
      ],
      "weight": {
        "minimum": "5.25kg",
        "maximum": "6.75kg"
      },
      "height": {
        "minimum": "0.35m",
        "maximum": "0.45m"
      },
      "image": "https://img.pokemondb.net/artwork/pikachu.jpg",
      "evolutions": [
        {
          "name": "Raichu",
          "types": [
            "Electric"
          ],
          "weight": {
            "minimum": "26.25kg",
            "maximum": "33.75kg"
          },
          "height": {
            "minimum": "0.7m",
            "maximum": "0.9m"
          },
          "image": "https://img.pokemondb.net/artwork/raichu.jpg"
        }
      ]
    }
  }
}
```

### エンドポイントとドキュメントの管理

GraphQLには、常に1つのエンドポイントしか存在しません。つまり、エンドポイントの管理の問題は考える必要はありません。

また、GraphQLのドキュメントはスキーマに応じて自動で作成されます。プレイグラウンドの右上にあるDocをクリックしてみてください。

![スクリーンショット 20210117 22.17.48.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2FlSuZhRyzmCa3Ez9TGjFS%2Fa069f50ae2ec6187c3e45e3ecfb631eb.png?alt=media&token=200a745f-4ffa-42fd-962d-5a8d92b5cc42)

