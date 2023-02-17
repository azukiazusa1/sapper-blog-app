---
title: "【mongoose】日付のカラムで時間ごとにグループ化してドキュメント数をカウントする"
about: "タイトルのとおりです"
createdAt: "2021-07-18T00:00+09:00"
updatedAt: "2021-07-18T00:00+09:00"
tags: ["JavaScript", "MongoDB"]
published: true
---
```js
model.aggregate()
    .project({
      h: { $hour: { createdAt } }
    })
    .group({
      _id: { hour: '$h' },
      count: { $sum: 1 }
    })
```

mongooseの`aggregate`メソッドは、MongoDBの[Aggregation Pipeline](https://docs.mongodb.com/manual/core/aggregation-pipeline/)と同一です。

Aggregation Pipelineでは合計やグループ化など様々な集計処理を行うことができます。

その中でも、[日付に関する演算](https://docs.mongodb.com/manual/reference/operator/aggregation/#date-expression-operators)を行うことで、日付型のカラムを年単位、時間単位、秒単位などで表現することができます。

`$hour`を使用することで、0〜23の時間単位に変換し、その次の処理で変換した結果に対してグループ化することで時間単位でグループ化することができます。

グループ別ドキュメント数を数えるために、`{ $sum : 1 }`とすることでカウントできます。

!> MongoDBのVersion 5.0からは[$count](https://docs.mongodb.com/manual/reference/operator/aggregation/count-accumulator/#mongodb-group-grp.-count)で同様のことが行なえます。

例として、以下のような結果が返されます。

```js
{
  {
    _id: {
      hour: 1
    },
    count: 11,
  },
  {
    _id: {
      hour: 2
    },
    count: 8,
  },
  {
    _id: {
      hour: 4
    },
    count: 30,
  },
}
```

該当する時間にドキュメントが存在しない場合には、結果自体が返されないので注意してください。

なお、タイムゾーンを変更したい場合には以下のようにします。

```js
      .project({
        h: { $hour: { $add: ['$createdAt', 9 * 60 * 60 * 1000] } }
      })
```
