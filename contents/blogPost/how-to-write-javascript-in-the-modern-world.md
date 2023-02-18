---
id: 4ePqJgag35xssZvzsSNFT8
title: "イマドキのJavaScriptの書き方"
slug: "how-to-write-javascript-in-the-modern-world"
about: "JavaScriptはES2015以降から言語自体が大きく変化しました。 ES2015以降も、毎年JavaScriptはアップデートが行われており、最新の使用はES2020となっています。  このように、JavaScriptという言語は日々進化を遂げています。ES2015より前の書き方の多くが非推奨となっており、過去のWebや本の情報は現在ではあまり役に立たなくなっています。 そんなJavaScriptのイマドキの書き方を見ていきましょう。"
createdAt: "2020-12-05T00:00+09:00"
updatedAt: "2021-02-05T00:00+09:00"
tags: ["JavaScript"]
published: true
---
JavaScriptはES2015以降から言語自体が大きく変化しました。
ES2015以降も、毎年JavaScriptはアップデートが行われており、最新の使用はES2020となっています。

このように、JavaScriptという言語は日々進化を遂げています。ES2015より前の書き方の多くが非推奨となっており、過去のWebや本の情報は現在ではあまり役に立たなくなっています。
そんなJavaScriptのイマドキの書き方を見ていきましょう。

# 変数宣言はconst

JavaScriptの変数宣言は、常に`const`で行います。
`const`で宣言された変数は、再代入ができなくなります。

```js
cosnt name = 'Joe'
console.log(name) // Joe

// Cannot assign to 'a' because it is a constant.
name = 'alice' 
```

どうしても上書きが必要な変数を定義する場合`let`を使用するようにします。あくまで`let`を使うのは最終手段だと考えてください。実際に`const`のみでコードを書いてみると気がつくのですが、意外と宣言された変数に再代入されることはあまり多くないと思います。

それでもなお`let`を使いたくなってしまう場面に遭遇してしまいがちですが、いかに`let`を使わずに`const`のみで変数宣言をしてコードを書けるかどうか常に考えながらコーディングをします。

例えば、次のように`for`文でループを書く際には`const`で宣言すると再代入できないのでループカウンタの変数は`let`を使わざるを得ないように思いえます。

```js
const arr = [1, 2, 3, 4, 5]

const odd = []
for (let i = 0; i < arr.length; i++) {
  if (arr[i] % 2 !== 0) {
    odd.push(arr[i])
  }
}

console.log(odd)
```

しかし、これと同じ仕事を行うには`array.prototype.filter`を使用することができます。これならば、`let`を使う必要はありません。

```js
const arr = [1, 2, 3, 4, 5]

const odd = arr.filter(v => v % 2 === 0)
```

この例のように、純粋な`for`文は配列のメソッドやloadashを使用すれば置き換えることが多いです。私は最後に`for`文を書いたのはいつだったか忘れてしまいました。

他にも、例えば`if`文の条件によって変数に代入する値を変えなければいけないことはよくありますが、

```js
let color

if (mode === 'dark') {
  color = 'black'
else {
  color = 'white'
}
```

このような代入が必要な箇所は三項演算子の使用が推奨されます。こうすれば、また`const`を使用することができました。

```js
const color = mode === 'dark' ? 'black' : 'white'
```

## なぜconstにこだわるのか

JavaScriptという言語はなぜここまでも`const`の使用にこだわるのでしょうか？

理由としては、JavaScriptがListやSchemeといった関数型言語から強く影響を受けているからだと考えます。実際に、JavaScriptや関数を値として使用できたり完全とは言えないですが関数型プログラミングの資質を持っていますし、人気フレームワークであるReactもクラスベースのコンポーネントから関数ベースのコンポーネントが主流となっています。

関数型プログラミングについてここでは詳細に説明しませんが、その特徴の一つに**参照透過性**というものがあります。参照透過性とは、式の構成要素がすべて同じなら、式の値は常に同じになるということ。参照透過性を保持するには、変数の値が不変(イミュータブル）である必要があります。実際、Haskelなどの関数型プログラミング言語はすべての変数が再代入することができません。

参照透過性について、次の例をご覧ください。

```js
let x = 1

const fn = (y) => x * y

console.log(fn(2)) // 2

x = 2

console.log(fn(2)) // 4
```

これは、変数宣言に`let`を使用したがために参照透過性が失われた例です。一度目の呼び出しと二度目の呼び出しを全く同じ引数でおこなっているのにも関わらず、返却される値が変化してしまっています。

実際、これは少々極端な例なのですが、実際のコードでも変数宣言`let`が使用されている場合、**その変数が本当に正しく使えるかコードをすべて読む必要が生じ**ます。実際にその変数には再代入がされていなかったとしてもです。

`const`が使われていた場合、「もう変わらない」と宣言しているので、安心してその値を使用することができるのです。

#  アロー関数

関数宣言は、基本的にはアロー関数を使用します。

```js
// 引数が1つの場合()を省略できる
// また、関数内部が1行のみの場合はreturnも省略できる
const add = num => num + 1

console.log(add(1)) // 2

// 引数がない場合()は省略できない
const greet = () => console.log('Hello'!)

// 関数内部が複数行に渡る場合
const div = (a, b) {
  if (b === 0) return
  return a / b
}
```

アロー関数は、関数を省略して書くことができるだけでなく、`this`について今までの関数宣言と重要な違いを持っています。

アロー関数は`this`を束縛しません。何を言っているのかよくわからないと思うので、次の例を見てください。

```js
var person = {
  name: 'Joe',

  getName: function () {
    setTimeout(function () {
      console.log(this.name)
    }, 3000)
  }
}

person.getName() // undefined
```

オブジェクト`person`の持つ`getName`は、3秒後に自分の名前を返す関数です。しかし、思いがけず結果は`undefined`になってしまいました。

これは、`this`が実行時の呼び出し元オブジェクトに左右されてしまうからです。`setTimeout`関数に渡された関数は実行時の呼び出し元はグローバルオブジェクトになります。グローバルオブジェクトに`name`など定義されていないため、`undefined`が出力されたのです。このように、JavaScriptの`this`は関数が定義されたときに決まらずに、実行さらた時に呼び出したオブジェクトによって左右されるので多くの開発者を困らせてきました。

そのため、`this`の使用を禁止して一時変数に代入してから使用するなどの方法が取られていました。

```js
var person = {
  name: 'Joe',

  getName: function () {
    var that = this
    setTimeout(function () {
      console.log(that.name)
    }, 3000)
  }
}

person.getName() // Joe
```

アロー関数が生まれた理由の一つがこのような複雑な`this`の問題を解決するためです。
アロー関数自体は、`this`を持ちません。アロー関数の`this`通常の変数検索ルールと同じくはひとつ上のスコープの値を参照します。

```js
const person = {
  name: 'Joe',

  getName: function () {
    setTimeout(() => {
      console.log(this.name)
    }, 3000)
  }
}

person.getName() // Joe
```

つまりは、アロー関数の`this`の内容は関数が定義された時点で確定するのです。

# オブジェクトの省略記法

## プロパティ名の省略

オブジェクトのキーと値の変数が一致するとき、`{ name }`のように省略して書くことができます。

```js
const name = 'Joe'
const age = 24

// 今までの書き方
const person = {
  id: 1,
  name: name,
  age: age,
}

// 省略した書き方
const person = {
  id: 1,
  name,
  age
}
```

## 関数プロパティの省略

オブジェクトのプロパティに関数を設定する場合も省略することができます。

```js
 // 今までの書き方
const person = {
  name: 'Joe',
  greet: function() {
    console.log('Hello!')
  }
}

// 省略した書き方
const person = {
  name: 'Joe',
  greet() {
    console.log('Hello!')
  }
}
```

# 動的なオブジェクトプロパティの宣言

オブジェクトを初期化する際に角括弧`[]`を使うことで変数などをキーとして使用することができます。

```js
const INCREMENT = 'increment'
const DECREMENT = 'decrement'

const state = {
  count: 0,
  [INCREMENT]() {
    this.count++
  },
  [DECREMENT]() {
    this.count--
  }
}

console.log(state.count) // 0
state[INCREMENT]()
console.log(state.count) // 1
state[DECREMENT]()
console.log(state.count) // 0
```

# 分割代入

分割代入とは、配列の値またはオブジェクトのプロパティを個別の値として変数に代入することができるJavaScriptの式です。それぞれの例を見てみます。

## 配列の分割代入

配列の分割代入は、PHPの`list()`とよく似ています。配列のインデックスの小さな値から順に代入されます。

```js
const arr = [1, 2, 3, 4, 5]

const [a, b] = arr

console.log(a) // 1
console.log(b) // 2
```

必要の内値が混ざっている場合には、無視することができます。

```js
const arr = [1, 2, 3, 4, 5]

const [a, , b, , c] = arr

console.log(a) // 1
console.log(b) // 3
console.log(c) // 5
```

配列の分割代入は、変数の入れ替えをする手段として活用することができます。

```js
let a = 1;
let b = 3;

[a, b] = [b, a];
console.log(a); // 3
console.log(b); // 1
```

## オブジェクトの分割代入

オブジェクトの分割代入は、プロパティと同じ名前の変数の値で取り出すことができます。順序は関係ありません。

```js
const user = {
  id: 1,
  name: 'Joe',
  age: 25
}

const { age, name } = user

console.log(age) // 25
console.log(name) // Joe
```

オブジェクトのプロパティ名と異なる名前で取り出すことも可能です。

```js
const user = {
  id: 1,
  name: 'Joe',
  age: 25
}

const { age: joeAge, name } = user

console.log(joeAge) // 25
```

オブジェクトにプロパティが存在しない時のために、デフォルト値を設定できます。

```js
const user = {
  id: 1,
  name: 'Joe',
}

const { age = 30, name = 'suzuki' } = user

console.log(age) // 30
console.log(name) // Joe
```

ネストしたオブジェクトは、以下のように取り出せます。

```js
const user = {
  id: 1,
  name: 'Joe',
  age: 25,
  address: {
    prefecture: 'Kanagawa',
    city: 'Yokohama'
  }
}

const { address: { prefecture, city } } = user

console.log(prefecture) // Kanagawa
console.log(city) // Yokohama
```

オブジェクトの分割代入は、関数の引数にも利用できます。
例えば、擬似的に名前付き引数にすることが可能です。

```js
// スナックバーの設定を引数にして呼び出す関数

const snackbar = ({
    message = '',
    type = 'info',
    escape = false,
    top = false,
    right = false,
    left = false,
    bottom = false,
    timeout = 3000
  }) {
  // 何らかの処理
}

// メッセージとタイプだけオプションとして指定
snackbar({
  message: 'エラー!',
  type: 'error',
})

// メッセージと出現位置をオプションとして指定
snackbar({
  massege: 'Hello!',
  top: true,
  left: true
})
```

# スプレッド構文

スプレッド構文は、配列やオブジェクトをの要素を展開する構文です。例を見てみましょう。

## 配列のスプレッド構文

```js
const arr1 = [1, 2, 3]
const arr2 = [4, 5, 6]

// 配列のマージ
const mergedArray = [...arr1, ...arr2]

console.log(mergedArray) // [1, 2, 3, 4, 5, 6]

// 配列のコピー
const copy = [...arr1] 

console.log(copy) // [1, 2, 3]
```

## オブジェクトのスプレッド構文

```js
const user = {
  id: 1,
  name: 'Joe',
  age: 25
}

const address = {
  prefecture: 'Kanagawa',
  city: 'Yokohama'
}

const merge = { ...user,  ...address}

console.log(merge) // { id: 1, name: "Joe", age: 25, prefecture: "Kanagawa", city: "Yokohama" }

const copy = { ...user }

console.log(copy) // { id: 1, name: "Joe", age: 25 }
```

オブジェクトのスプレッド構文のコピーはシャローコピー（浅い複製）しか提供しないことに注意してください。

また、次のようにオブジェクトをスプレッド構文で展開した後に同じプロパティ名を定義すると後の値で上書きすることができます。
これは、デフォルトの設定を用意してモードによって少しだけ変えたいときなどに役に立ちます。

```js
const brands = {
  github: '#211F1F',
  facebook: '#3B5998',
  twitter: '#1DA1F2',
  qiita: '#4cb10d'
}

export default new Vuetify({
  theme: {
    themes: {
      light: brands,
      dark: {
        ...brands,
        github: '#fff' // スプレッド演算子で渡した後に上書き
      }
    }
  }
})
```

## 残余引数

スプレッド構文の似たような構文として、関数の残余引数があります。
これは、不特定の引数を配列として受け取ります。

```js
const sum = (...args) => args.reduce((prev, current) => prev + current, 0)

console.log(sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)) // 55
```
# テンプレートリテラル

**テンプレートリテラル**によって、複数行文字列や文字列補間は驚くほど簡単に実現できるようになりました。

例えば、従来のJavaScriptの構文でHTMLを組み立てようとした場合、おそらく次のようになるでしょう。

```js
var user = {
  name: 'Joe',
  age: 25,
  image: 'exapmle.jpg'
}

var html = ''
html += '<div class="user">'
html += '<div class="name">名前：' + user.name + '</div>'
html += '<div class="age">年齢：' + user.age + '</div>'
html += '<div class="image">'
html += '<img src="' + user.image + '"alt="' + user.name + '" />'
html += '</div>'
html += '</div>'
```

いくつもの文字列の連結により、何がどのようになっているのか推測するには困難な状況です。しかし、この書き方よりほかに方法はありませんでした。
次に、テンプレートリテラルを用いた書き方を見てみましょう。テンプレートリテラルは、シングルクォートやダブルクォートの代わりに、**バッククォート**`を用います

```js
const user = {
  name: 'Joe',
  age: 25,
  image: 'exapmle.jpg'
}

const html = `
<div class="user">
  <div class="name">名前：${user.name}</div>
  <div class="age">年齢：${user.age}</div>
  <div class="image">
    <img src="${user.image}" alt="${user.name}" />
  </div>
</div>`
```

以前の構文に比べて、かなり読みやすくなったのではないでしょうか。テンプレートリテラルでは、`\n`のような表現に頼らずに改行をすることができます。
また、文字列の補間として、ドル記号と波括弧で`${}`表すことができます。`${}`のなかで変数を展開したい計算をすることができます

# 配列の重複削除

最後に、`Set`を使った配列重複削除のテクニックです。
`Set`オブジェクトは、あらゆる型で一意の値を格納できます。

次のように、`Set`オブジェクトにすでにある値を追加しようとしても無視されます。

```js
const set = new Set()
set.add(1)
set.add(2)
set.add(1)

console.log(set) // Set { 1, 2 }
```

`Set`をnewするときに、Iteratorオブジェクト（例えば配列）を初期値として渡すことができます。このとき、初期値に重複する値が含まれている場合それは削除されます。さらに、新しく作成した`Set`オブジェクトを配列に戻してあげれば、重複削除された配列が帰ってきます。

```js
const arr = [1, 2, 3, 1, 1, 3]

const outputArr = Array.from(new Set(arr))

console.log(outputArr) // [1, 2, 3]
```

# オブジェクトを配列に変換する

これで本当に最後です。オブジェクトに生まれたことがある人なら誰しも、配列に生まれ変わって華麗なメソッドを使いたいと思うことでしょう。
`Object.entries()`がそれを可能にします。これは、`[key, value]`の配列のペアを返します。

```js
const user = {
  id: 1,
  name: 'Joe',
  age: 25,
  address: {
    prefecture: 'Kanagawa',
    city: 'Yokohama'
  }
}

console.log(Object.entries(user))

// [
//  [ "id", 1 ],
//  [ "name", "Joe" ],
//  [ "age", 25 ],
//  [ "address", { prefecture: "Kanagawa", city: "Yokohama" } ]
// ]
```

これで、`forEach()`はあなたのものになりました。

```js
const user = {
  id: 1,
  name: 'Joe',
  age: 25,
  address: {
    prefecture: 'Kanagawa',
    city: 'Yokohama'
  }
}

Object.entries(user).forEach(([k, v]) => {
  console.log('key:', k)
  console.log('value:', v)
})

// key: id
// value: 1
// key: name
// value: Joe
// key: age
// value: 25
// key: address
// value: { prefecture: "Kanagawa", city: "Yokohama" }
```

# Null合体演算子

[Null合体演算子](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator)は、演算子の一種で左辺が`null`または`undefined`のときに右辺の値を返し、それ以外のときには左辺を返します。
C#、Swift、PHPなどにも採用されているため見覚えがある人も多いかもしれません。

## 構文

```js
A ?? B
```

```js
let text;

const title = text ?? "タイトル";
console.log(title);　// タイトル
```

これは以下の構文と同意義で、シンタックスシュガーといえます。

```js
let text;

const title = text != null ? text : "タイトル";
console.log(title);　// タイトル
```

## OR(||)演算子との違い

Null合体演算子導入前までは、同じような機能を提供するために、OR(||)演算子が使われていました。

```js
let text;

const title = text || "タイトル";
console.log(title); // タイトル
```

この結果を見ると、Null合体演算子とOR演算子どちらを使っても変わらないように思わます。

しかし、OR演算子は`null`や`undefined`に限らず**falsyな値0, '', NaN, null, undefined**のときに左辺の値を返すという特徴があります。

これは、例えば0をを正しい値として扱いたいときに思わぬ結果を返す可能性があります。

```js
const value = 0;

const a = value ?? "記録がありません。";
const b = value || "記録がありません。";

console.log(a); // 0
console.log(b); // 記録がありません。
```

## 短絡評価

Null合体演算子は、AND演算子やOR演算子のように短絡評価されます。
右辺の値が`null`または`undefined`でないことが証明されたとき、右辺の値は評価されません。

```js
const a = "a" ?? console.log("a");
const b = null ?? console.log("b"); // b
```

## AND演算子やOR演算子と同時に使えない

Null合体演算子を、AND演算子やOR演算子と直接同時に使おうとすると`syntax error`が発生します。

```js
const a = 0 || null ?? 'a'
const b = 1 && null ?? 'b'

// error: Uncaught SyntaxError: Unexpected token '??'
// const a = 0 || null ?? 'a'
```

Null合体演算子をAND演算子やOR演算子と使用したいときには、カッコをつけて明示的に優先順位をつける必要があります。

```js
const a = (0 || null) ?? "a";
const b = (1 && null) ?? "b";

console.log(a); // a
console.log(b); // b
```

## 使用例

Null合体演算子は、nullableな要素を使用する際に初期値を代入したいときに役に立ちます。

例えば、次の例はクエリパラメータに`username`が存在すればそれをページのタイトルとし、存在しないときには初期値を代入します。

```js
const params = (new URL(document.location)).searchParams;
document.title = params.get('username') ?? 'Default Title';
```

# オプショナルチェイニング演算子

[オプショナルチェイニング演算子(?.)](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Optional_chaining)は、ググりづらい上に名前まで長くて覚えづらいという厄介な演算子ですが(?)なかなか役にたちます。

オプショナルチェイニング演算子は、nullableなオブジェクトに対して安全にアクセスするための演算子です。これは、プロパティにアクセスするときに`.`の代わりに`?.`を使用して、オブジェクトが`null`または`undefiend`だった場合、実行時エラーを吐く代わりに`undefined`を返します。

```js
let user;

console.log(user.name);
// error: Uncaught SyntaxError: Unexpected token '?'
// console.log(user?.name)

console.log(user?.name);
// undefined

```

## オプショナルチェイニング演算子をネストした演算子に使う

オプショナルチェイニング演算子は、何個でも使用できるため次のようにネストしたプロパティに対しても使用することができます。

```js
const obj {
  first: {
    second: {
      third: 'hey!'
    }
  }
}

obj?.first?.secont?.third
```

## オプショナルチェイニング演算子を使用した関数呼び出し

オプショナルチェイニング演算子は安全に関数を呼び出すために使用することができます。
関数呼び出しには次のような構文に従います。

```js
obj.someFunction?.() 
```

しかし、この構文が有効に働くのは`someFunction()`が存在したいときだけです。以下の例のように、存在はするがメソッドではないプロパティに対して使用すると例外をスローします。

```js
const obj = {
  someFunction: "1",
};

obj.someFunction?.();
// error: Uncaught TypeError: obj.someFunction is not a function
// obj.someFunction?.();
```

## ブラケット表記法に使用する

```js
const obj = { 
   first: 1,
   second: 2
}

const page = 'first'

const content = obj?.[page]
```

## 配列の要素にアクセスするときに使用する

```js
const array = ["first", "second"];
const notArray = "1";

console.log(array?.[0]); // first
console.log(array?.[3]); // undefined
console.log(notArray?.[0]); // undefined
console.log(notArray?.[1]); // undefined
```

## 使用例

オプショナルチェイニング演算子は、APIから取得した要素や、DOMから取得した要素など、`null`や`undefined`で返されるオブジェクトにアクセスするときに役に立ちます。

例えば、次の例は`User型`のオブジェクトの配列からidをもとに特定のユーザーを見つけ出し名前を表示しようとしますが`find()`メソッドは`undefined`を返す可能性があります。

`if (user == null)`のように存在確認してからプロパティにアクセスすることもできますが、オプショナルチェイニング演算子を使えば簡潔に記述することができます。

```js
const users = [
  {
    id: 1,
    name: "Aron",
  },
  {
    id: 2,
    name: "Abel",
  },
  {
    id: 3,
    name: "Michael",
  },
];

const user = users.find((user) => user.id === 4);
console.log(user?.name);
```

