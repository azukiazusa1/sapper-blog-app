---
id: 2yzIlyRm9xm2ovQQMuKYfU
title: "【mongoose】Cannot overwrite 'Model' model once compiled. エラーの直し方"
slug: "mongoose-cannot-overwrite-model-model-once-compiled-error-handling"
about: "mongooseで遭遇するCannot overwrite 'Model' model once compiled. エラーの解消方法です"
createdAt: "2021-07-11T00:00+09:00"
updatedAt: "2021-07-11T00:00+09:00"
tags: ["", "Node.js", "MongoDB"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4z6cPW6RU0f0O22jxIVINl/7c4bc80d99a5ad11e02d1cc83b42a2b5/articles_2FmDVbWFeXeln9BJXqBa76_2F027ab8d7dc7cdb4ab9c09c0a057af2e7.png"
  title: "Node.js"
audio: null
selfAssessment: null
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
`mongoose` では、同じスキーマを使用して `mongoose.model()` で 2 度以上インスタンスを作成できません。

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

`mongoose` も `models` は、すでに登録済のモデル名をキーとして取得できます。

`models` にすでに存在するには、それを `export` することによって、同じモデルを再登録することによる生じるエラーを解消できます。

TypeScript を使用している場合、`models` に登録されているモデルは `statics` などをモデルに追加している場合正しい型が得られないので型アサーションをする必要があるでしょう。

`models` に登録されていなかった場合、通常通りモデルを作成して `export` します。
