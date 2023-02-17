---
title: "【mongoose】Cannot overwrite 'Model' model once compiled. エラーの直し方"
about: "mongooseで遭遇するCannot overwrite 'Model' model once compiled. エラーの解消方法です"
createdAt: "2021-07-11T00:00+09:00"
updatedAt: "2021-07-11T00:00+09:00"
tags: ["TypeScript", "Node.js", "MongoDB"]
published: true
---
[mongoose](https://mongoosejs.com/docs/guide.html)でモデルを定義したあと、ホットリロードなどをすると、次のようなエラーに遭遇します。

```
Cannot overwrite 'Model' model once compiled. 
```

モデルは次のように定義しています。

```ts
import mongoose, { Schema, Document, Model } from 'mongoose'

export interface UserDoc extends Document, {
  username: string
  email: string
  password: string
}

const userSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
  }
)

interface UserModel extends Model<UserDoc> {}

export default mongoose.model<UserDoc, UserModel>('User', userSchema)
```
`mongoose`では、同じスキーマを使用して`mongoose.model()`で2度以上インスタンスを作成することができません。

次のように修正することでエラーを解消できます。

```diff
- import mongoose, { Schema, Document, Model } from 'mongoose'
+ import mongoose, { Schema, Document, Model, models } from 'mongoose'

export interface UserDoc extends Document, {
  username: string
  email: string
  password: string
}

const userSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
  }
)

interface UserModel extends Model<UserDoc> {}

- export default mongoose.model<UserDoc, UserModel>('User', userSchema)
+ export default models.User
+   ? (models.User as UserModel)
+   : mongoose.model<UserDoc, UserModel>('User', userSchema)
```

`mongoose`も`models`は、すでに登録済のモデル名をキーとして取得できます。

`models`にすでに存在するには、それを`export`することによって、同じモデルを再登録することによる生じるエラーを解消することができます。

TypeScriptを使用している場合、`models`に登録されているモデルは`statics`などをモデルに追加している場合正しい型が得られないので型アサーションをする必要があるでしょう。

`models`に登録されていなかった場合、通常通りモデルを作成して`export`します。
