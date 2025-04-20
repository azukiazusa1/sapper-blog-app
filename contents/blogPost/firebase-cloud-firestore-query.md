---
id: 2vS3sf8fbapQLeWorCGLSh
title: "Firebase④ Cloud FireStore - クエリ"
slug: "firebase-cloud-firestore-query"
about: "Firebase4回目の記事です。 前回は、Firebaseにおける単一のドキュメントに対するCRUD操作までを取り扱いました。 今回は複数のコレクションから取得するためのクエリについて説明していきます。"
createdAt: "2020-05-24T00:00+09:00"
updatedAt: "2020-05-24T00:00+09:00"
tags: ["", ""]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2kQrXA9Amina8TOc9oC4PF/9033b78047d09b10c90b126439e33287/firestore.png"
  title: "firestore"
selfAssessment: null
published: true
---
### クエリを発行する

[前回](https://app-blog-1ef41.web.app/article/1LURVCJRFfVWbaWzdB2M)（もう 3 週間前ですね！）の記事では、単一のドキュメントに対する CRUD 操作を見てきました。
しかし、一般的なアプリケーションでは複数のデータを条件によって取得する欲求があるはずです。`Firestore` がどのようばクエリを発行できるか見ていきましょう。

#### 単純なクエリ

次の例は、すべての記事を返します。

```javascript
cosnt db = firebase.firestore()
// 記事一覧への参照を作成
const articleRef = db.collection('articles')

const result = []
articleRef.get()
  .then(querySnapshot => {
    if (querySnapshot.empty) { // querySnapshot.emptyがtrueの場合コレクションにデータが存在しません。
        console.log('結果は空です')
    } else {
      // querySnapshotをループしてデータを取り出します。
      querySnapshot.forEach(doc => {
         // 単一のドキュメントの操作と同じです。
      　　result.push({ id: doc.id, ...doc.data() })
      })
    }
   })
  .catch(e => // エラーが発生したとき　)
````

コレクションの参照に `get()` メソッドを利用して、すべてのコレクションを取得できます。
また一般的な NoSQL 系データベースと異なり `Firestore` のクエリ結果はすべて**強い整合性**をもつことが特徴です。サーバーからドキュメントを取得する場合は
常に最新のデータにアクセスすることが保証されています。

#### フィルタを利用する

`Firestore` では、SQL データベースのように `where()` メソッドを利用することでクエリをフィルタリングできます。
`where()` メソッドは、3 つの引数を受け取り、フィルタリングするフィールド、比較演算、値の順に受け入れます。
比較演算子には、以下の 8 つが利用できます。

- `=`
- `<`
- `<=`
- `>`
- `>=`
- `in`
- `array-contains`
- `array-contains-any`

##### =（など価演算子）

次の例は、ログイン中のユーザーの記事を取得します。

```javascript
cosnt db = firebase.firestore()

// ログインしているユーザーの情報を取得します。
const user = firebase.auth().currentUser()
// ユーザードキュメントへの参照を取得
const userRef = db.collection('user').doc(user.uid)

// 記事一覧への参照を作成
const articleRef = db.collection('articles')

const result = []
articleRef
  // auhtorフィールドは参照型です
  .where('auhtor', '==', userRef)
  .get()
  .then(querySnapshot => {
    if (querySnapshot.empty) {
        console.log('結果は空です')
    } else {
      querySnapshot.forEach(doc => {
      　　result.push({ id: doc.id, ...doc.data() })
      })
    }
   })
  .catch(e => // エラーが発生したとき　)
```

クエリに `.where('auhtor', '==', userRef)` が追加されています。これが基本的な `where()` メソッドの使用方法です。

##### < <= > >=(比較演算子)

比較演算子も同じように利用できます。
次の例は、2020 年 4 月以降の記事を取得します。

```javascript
cosnt db = firebase.firestore()

// 起点となる日付を作成
// firestoreの日付型はDateオブジェクトで比較できます。
const date = new Date('2020-04')

// 記事一覧への参照を作成
const articleRef = db.collection('articles')

const result = []
articleRef
  // createdAtフィールドは日付型です
  .where('createdAt', '>=', date)
  .get()
  .then(querySnapshot => {
    if (querySnapshot.empty) {
        console.log('結果は空です')
    } else {
      querySnapshot.forEach(doc => {
      　　result.push({ id: doc.id, ...doc.data() })
      })
    }
   })
  .catch(e => // エラーが発生したとき　)
```

##### inクエリ

`in` クエリはフィールドがいくつかの値のいずれかになどしいドキュメントを取得します。
`in` クエリは、`Firestore` で単純な OR クエリを実行するのに適した方法です。

次の例は、記事のタイトルが「Deno とはなにか - 実際につかってみる」「FireBase①」「JavaScript ES2015」の記事を取得します。

```javascript
cosnt db = firebase.firestore()

// 記事一覧への参照を作成
const articleRef = db.collection('articles')

const result = []
articleRef
  // 配列で値を渡します
  .where('title', 'in', ['Denoとはなにか - 実際につかってみる', 'FireBase①', 'JavaScript ES2015'])
  .get()
  .then(querySnapshot => {
    if (querySnapshot.empty) {
        console.log('結果は空です')
    } else {
      querySnapshot.forEach(doc => {
      　　result.push({ id: doc.id, ...doc.data() })
      })
    }
   })
  .catch(e => // エラーが発生したとき　)
```

なお in クエリに渡せる値は 10 個までという制約があります。

##### array-contains（配列メンバーシップ)

`array_contains` は配列型のフィードに対して使用します。
フィールドの配列に値が含まれていた場合、そのドキュメントを返します。
次の例は、`JavaScript` というタグが使用されている記事を取得します。

```javascript
cosnt db = firebase.firestore()

// 記事一覧への参照を作成
const articleRef = db.collection('articles')

const result = []
articleRef
  .where('tags', 'array-contains', 'JavaScript')
  .get()
  .then(querySnapshot => {
    if (querySnapshot.empty) {
        console.log('結果は空です')
    } else {
      querySnapshot.forEach(doc => {
      　　result.push({ id: doc.id, ...doc.data() })
      })
    }
   })
  .catch(e => // エラーが発生したとき　)
```

クエリ対象の値が配列内に複数存在する場合でも、ドキュメントは結果に 1 回だけ含まれます。

##### array-contains-any（配列メンバーシップ)

`array-contains-any` は、配列型に対する `in` クエリです。

```javascript
cosnt db = firebase.firestore()

// 記事一覧への参照を作成
const articleRef = db.collection('articles')

const result = []
articleRef
  .where('tags', 'array-contains-any', ['JavaScript', 'PHP', 'Firebase'])
  .get()
  .then(querySnapshot => {
    if (querySnapshot.empty) {
        console.log('結果は空です')
    } else {
      querySnapshot.forEach(doc => {
      　　result.push({ id: doc.id, ...doc.data() })
      })
    }
   })
  .catch(e => // エラーが発生したとき　)
```

`in` クエリと同様、渡せる値は 10 までの制約があります。

#### 複合クエリ

1 回のクエリの中で、複数の `where()` メソッドを呼び出して作成できます。複合クエリは `AND` 条件として扱われます。

##### など価演算子=に対する複合クエリ

など価演算子 `==` に対する複合クエリには制限がなく、複数回フィルタをかけることができます。

```javascript
cosnt db = firebase.firestore()

// 記事一覧への参照を作成
const articleRef = db.collection('articles')

const result = []
articleRef
  .where('auhtor', '==', userRef)
  .where('createdAt', '==', new Date())
  .get()
  .then(querySnapshot => {
    if (querySnapshot.empty) {
        console.log('結果は空です')
    } else {
      querySnapshot.forEach(doc => {
      　　result.push({ id: doc.id, ...doc.data() })
      })
    }
   })
  .catch(e => // エラーが発生したとき　)
```

##### 比較演算子に対する複合クエリ

比較演算子に対して複合クエリを使用する場合、1 つのフィールドに対するクエリは有効です。

```javascript
cosnt db = firebase.firestore()

// 記事一覧への参照を作成
const articleRef = db.collection('articles')

const result = []
articleRef
  .where('createdAt', '>=', new Date('2019-04'))
  .where('createdAt', '<', new Date('2020-04'))
  .get()
  .then(querySnapshot => {
    if (querySnapshot.empty) {
        console.log('結果は空です')
    } else {
      querySnapshot.forEach(doc => {
      　　result.push({ id: doc.id, ...doc.data() })
      })
    }
   })
  .catch(e => // エラーが発生したとき　)
```

しかし、複数のフィールドに対して同時に比較演算子を使用することはできません。次のようなクエリはエラーになります。

```javascript
cosnt db = firebase.firestore()

// 記事一覧への参照を作成
const articleRef = db.collection('articles')

const result = []
articleRef
  // 複数のフィールドに対する比較演算子はエラー！
  .where('createdAt', '>=', new Date('2019-04'))
  .where('rating', '<', 5)
  .get()
  .then(querySnapshot => {
    if (querySnapshot.empty) {
        console.log('結果は空です')
    } else {
      querySnapshot.forEach(doc => {
      　　result.push({ id: doc.id, ...doc.data() })
      })
    }
   })
  .catch(e => // エラーが発生したとき　)
```

##### など価演算子と比較演算子、配列メンバーシップを同時に利用する

など価演算子と比較演算子、配列メンバーシップを同時に利用するクエリでは、**複合インデックスを作成する必要があります。
例えば、複合インデックスを作成していない状態で次のようなクエリを発行しようとしてみます。

```javascript
cosnt db = firebase.firestore()

// 記事一覧への参照を作成
const articleRef = db.collection('articles')

const result = []
articleRef
  // 等価演算子と比較演算子を同時に利用する
  .where('createdAt', '>=', new Date('2019-04'))
  .where('published', '==', true)
  .get()
  .then(querySnapshot => {
    if (querySnapshot.empty) {
        console.log('結果は空です')
    } else {
      querySnapshot.forEach(doc => {
      　　result.push({ id: doc.id, ...doc.data() })
      })
    }
   })
  .catch(e => // エラーが発生したとき　)
```

次のようなエラーが発生してしまいました。

![スクリーンショット 20200524 16.39.11.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2FZdgmFqj5WHciKMSBbWd6%2F5f56098e416b332e89fe2ec3f09a96b5.png?alt=media&token=18f4fff9-74c6-48a6-b91d-c7d43a548ecb)

このクエリにはインデックスが必要ですという旨のエラーです。
メッセージに示された URL をクリックすると、コンソールへ移動して自動的に複合インデックスを作成してくれます。

![スクリーンショット 20200524 16.42.56.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2FZdgmFqj5WHciKMSBbWd6%2F13574909b61714be726163e4415032d5.png?alt=media&token=5c01c169-8f68-4a8c-b12d-330eb83513f1)

##### inクエリ、配列メンバーシップ

`in`、`array-contains`、`array-contains-any` は、複合クエリの中で一度だけ使用できます。

### クエリのソート

`orderBy()` メソッドを使用すると、クエリ結果を並べ替えることができます。1 回のクエリで複数のフィールドに対してソートをできます。
次の例では、作成日の降順、評価の昇順で並べ替えます。

```javascript
cosnt db = firebase.firestore()

// 記事一覧への参照を作成
const articleRef = db.collection('articles')

const result = []
articleRef
  .order('createdAt', 'desc')
  // ソート順を指定しなかった場合、昇順になります。
  .order('rating')
  .get()
  .then(querySnapshot => {
    if (querySnapshot.empty) {
        console.log('結果は空です')
    } else {
      querySnapshot.forEach(doc => {
      　　result.push({ id: doc.id, ...doc.data() })
      })
    }
   })
  .catch(e => // エラーが発生したとき　)
```

なお `orderBy()` メソッドは、指定したフィールドの有無によるフィルタも行います。 指定したフィールドがないドキュメントは結果セットには含まれません。

`orderBy()` メソッドは `where()` メソッドと組み合わせて使用できますが、比較演算子を利用する場合には最初の並べ替えは同じフィールドである必要があります。
次のクエリはエラーになります。

```javascript
cosnt db = firebase.firestore()

// 記事一覧への参照を作成
const articleRef = db.collection('articles')

const result = []
articleRef
  .where('createdAt', '>=', new Date('2019-04'))
  // 比較演算子と異なるフィールドでソートしようとするとエラー
  .order('rating')
  .get()
  .then(querySnapshot => {
    if (querySnapshot.empty) {
        console.log('結果は空です')
    } else {
      querySnapshot.forEach(doc => {
      　　result.push({ id: doc.id, ...doc.data() })
      })
    }
   })
  .catch(e => // エラーが発生したとき　)
```

さらに、など価演算子を利用して異なるフィールドでソートする際には複合インデックスを作成する必要があります。

```javascript
cosnt db = firebase.firestore()

// 記事一覧への参照を作成
const articleRef = db.collection('articles')

const result = []
articleRef
  .where('published', '==', true)
  // 複合インデックスの作成が必要
  .order('createdAt', 'desc')
  .get()
  .then(querySnapshot => {
    if (querySnapshot.empty) {
        console.log('結果は空です')
    } else {
      querySnapshot.forEach(doc => {
      　　result.push({ id: doc.id, ...doc.data() })
      })
    }
   })
  .catch(e => // エラーが発生したとき　)
```

#### データの取得数の制限

`limit()` メソッドを利用すると、データを取得した数だけ取得します。
次の例では、最新の記事上位 10 件に限って取得をします。

```javascript
cosnt db = firebase.firestore()

// 記事一覧への参照を作成
const articleRef = db.collection('articles')

const result = []
articleRef
  .order('createdAt', 'desc')
  // 10件だけ取得
  .limit(10)
  .get()
  .then(querySnapshot => {
    if (querySnapshot.empty) {
        console.log('結果は空です')
    } else {
      querySnapshot.forEach(doc => {
      　　result.push({ id: doc.id, ...doc.data() })
      })
    }
   })
  .catch(e => // エラーが発生したとき　)
```

#### ページネーション

`Firestore` のクエリを用いてページネーションを行ってみましょう。
`limit` 句はさきほど紹介しましたが、`offset` 句はサポートしておりません。その代わりには、`startAfter()` を利用してクエリの開始点を指定することでページネーションを実現します。

`startAfter()` には、パラメータドキュメントを渡すことができます。つまり、前回実施したクエリの最後のドキュメントを指定すれば、次のページを取得できます。

```javascript
cosnt db = firebase.firestore()

// 記事一覧への参照を作成
const articleRef = db.collection('articles')

const result = []
const limit = 10
// 最後のドキュメントを保持しておきます。
let lastDoc
// すべてのドキュメントを取得したかの判定に使用します。
let isFinish = false

articleRef
  .order('createdAt', 'desc')
  .limit(limit)
  .startAfter(lastDoc)
  .get()
  .then(querySnapshot => {
    if (querySnapshot.empty) {
        // 取得したコレクションが空だったらすべてのドキュメントを取得したと判定
        isFinish = true
    } else {
      if (querySnapshot.size < limit) {
          // 取得したコレクションの数がlimitよりも少なければこれ以上データはない
          isFinish = true
      }
      // 最後のドキュメントを取得
      lastdoc = querySnapshot.docs[querySnapshot.docs.length - 1]
      querySnapshot.forEach(doc => {
      　　result.push({ id: doc.id, ...doc.data() })
      })
    }
   })
  .catch(e => // エラーが発生したとき　)

```

2 ページ以降も、最初のページと同じ条件のクエリを発行する必要があります。
また明確にページ数を指定するタイプのページネーションは推奨されていません。（3 ページ目を取得しようとしても、2 ページ目の終わりがわからない）
無限スクロールによるページネーションの実装が推奨されています。

#### リアルタイムリスナー

`Firestore` の大きな特徴の 1 つとして、リアルタイムリスナーがあります。リアルタイムリスナーは、クライアント側で Firestore の最新の状態を監視し、変化があった場合には直ちに状態を同期できます。
リアルタイムリスナーを利用するには `get()` メソッドの代わりに `onSnapshot()` メソッドを利用します。

```javascript
cosnt db = firebase.firestore()
const articleRef = db.collection('articles')

const result = []
articleRef
  .getonSnapshot()
  .then(querySnapshot => {
    if (querySnapshot.empty) { 
        console.log('結果は空です')
    } else {
      querySnapshot.forEach(doc => {
      　　result.push({ id: doc.id, ...doc.data() })
      })
    }
   })
  .catch(e => // エラーが発生したとき　)
````

リアルタイムリスナーは、例えばチャットのような機能も簡単に実装できます。

またドキュメントがどのような変更がされたか確認することもできます。

```javascript
cosnt db = firebase.firestore()
const articleRef = db.collection('articles')

const result = []
articleRef
  .getonSnapshot()
  .then(querySnapshot => {
    snapshot.docChanges().forEach(change {
      if (change.type === "added") {
        console.log('追加されたドキュメント', change.doc.data());
      }
      if (change.type === "modified") {
        console.log('変更されたドキュメント', change.doc.data());
      }
      if (change.type === "removed") {
        console.log('削除されたドキュメント', change.doc.data());
      }
     })
  }
```

リアルタイムリスナーはユーザー体験を向上させますが、単純なクエリのほうが適している場合もあります。
例えば、ブログなどで記事を見ている最中に（今この瞬間ですね）突然本文の内容が変わったり削除されたりすることを好ましいと思う人は少ないでしょう。

またさきほどのページネーションと組み合わせたりするときも注意が必要です。ページ送りをしている最中にデータの並び順が変わった場合、再度同じドキュメント取得してしまったりなどページ付がおかしくなったりすることがあります。

さらに、データが頻繁に更新されるような場合、データが次々と追加されたり入れ替わるさまを眺めるのは楽しいかもしれませんが、バッテリーや通信量の面でユーザーからは不評を得るかもしれません。
