---
id: 7G5mpy816fuAcyOWJ2mOUQ
title: "Node.js(Express)でcsvを生成してダウンロード"
slug: "node-js-express-csv"
about: "Node.js(Express)でCSVファイルを生成してダウンロードさせます。"
createdAt: "2021-05-30T00:00+09:00"
updatedAt: "2021-05-30T00:00+09:00"
tags: ["Express", "", "Node.js"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2Lpar83pMJR1yGyxUUiDQP/dbf365e89432b966f827cacfc4d5891e/articles_2FRshdHD6LGzEVXnbjoL6p_2Fthumbnail_7D.png"
  title: "express"
selfAssessment: null
published: true
---
# json2csvのインストール

json2csv というパッケージを使用します。

https://www.npmjs.com/package/json2csv

```sh
$ npm i json2csv
$ npm i --save-dev @types/json2csv // typescriptの場合
```

# オブジェクトをCSVに変換

適当に実装します。

```ts
type Data = {
  id: number
  name: string
  price: number
  someSecret: string
  date: Date
}

const data: Data[] = [
  {
    id: 1,
    name: 'りんご',
    price: 200,
    someSecret: 'xxx',
    date: new Date('2021-05-01')
  },
  {
    id: 2,
    name: 'バナナ',
    price: 150,
    someSecret: 'xxx',
    date: new Date('2021-05-02')
  },
  {
    id: 3,
    name: 'もも',
    price: 300,
    someSecret: 'xxx',
    date: new Date('2021-05-03')
  },
]

const fields = ['id', 'name', 'price', 'date']

const output = parse(data, {
  fields,
  withBOM: true
})
console.log(output)
```

変換処理は、json2csv の `parse` が行います。
`parse` の第一引数には処理するオブジェクトを、第二引数にはオプションが渡せます。

今回渡しているオプションは以下のとおりです。

| オプション  | 説明 |
| ---------- | ---------- |
| fields     | CSVで出力するフィールドをオブジェクトのキーで指定できます。 | 
| withBOM    | `true` を指定するとBOMヘッダを付与します。BOMヘッダを付与するとExcelで開く際にUTF-8が使われていることを認識させることができます。つまりは文字化け対策です。 |

他の使用可能なオプションは[公式ドキュメント](https://github.com/zemirco/json2csv#javascript-module)を参照してください。

ログを確認すると、期待どおり CSV で出力されています。

```sh
"id","name","price","date"
1,"りんご",200,"2021-05-01T00:00:00.000Z"
2,"バナナ",150,"2021-05-02T00:00:00.000Z"
3,"もも",300,"2021-05-03T00:00:00.000Z"
```

# ExpressでCSVをダウンロード

CSV に変換したものをダウンロードさせるようにします。
そのためには、以下ヘッダーを設定する必要があります。

```ts
res.setHeader('Content-disposition', 'attachment; filename=data.csv');
res.setHeader('Content-Type', 'text/csv; charset=UTF-8');
```

以下が実装になります。

```ts
import express from 'express'
import { parse } from 'json2csv'

const app = express()

type Data = {
  id: number
  name: string
  price: number
  someSecret: string
  date: Date
}

const data: Data[] = [
  {
    id: 1,
    name: 'りんご',
    price: 200,
    someSecret: 'xxx',
    date: new Date('2021-05-01')
  },
  {
    id: 2,
    name: 'バナナ',
    price: 150,
    someSecret: 'xxx',
    date: new Date('2021-05-02')
  },
  {
    id: 3,
    name: 'もも',
    price: 300,
    someSecret: 'xxx',
    date: new Date('2021-05-03')
  },
]

const fields = ['id', 'name', 'price', 'date']

app.get('/csv', (_, res) => {
  res.setHeader('Content-disposition', 'attachment; filename=data.csv');
  res.setHeader('Content-Type', 'text/csv; charset=UTF-8');
  const output = parse(data, {
    fields
  })
  console.log(output)
  res.send(output)
})

app.listen(3000, () => {
  console.log('start server on port 3000')
})
```

http://localhost:3000/csv にアクセスすると、CSV ファイルがダウンロードされます。

# 参考

[expressでCSVファイルをダウンロードさせる](https://blog.kozakana.net/2018/04/express-csv-download/)
[【Node.js】JSON文字列をCSVファイルとして吐き出す](https://qiita.com/kum44/items/d11f97ecee3e46d3195d)
