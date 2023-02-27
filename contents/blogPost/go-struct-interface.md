---
id: 5t19jmwWmG3Agp9H8Lrikv
title: "Go言語 構造体・インターフェース"
slug: "go-struct-interface"
about: "構造体(Struct)とは、フィールドの集まりです。JavaScriptのオブジェクトよく似ており、データをまとめて1つの集まりの値として表現します。  例えば、座標を表すには緯度と経度がフィールドとして必要になるでしょう。緯度と経度をそれぞれ別の変数として宣言することはできますが、間違いが生じやすく面倒な処理になってしまいます。"
createdAt: "2020-10-25T00:00+09:00"
updatedAt: "2020-10-25T00:00+09:00"
tags: ["Go"]
published: true
---
# 構造体(Struct)

構造体（Struct）とは、フィールドの集まりです。JavaScript のオブジェクトよく似ており、データをまとめて 1 つの集まりの値として表現します。

例えば、座標を表すには緯度と経度がフィールドとして必要になるでしょう。緯度と経度をそれぞれ別の変数として宣言できますが、間違いが生じやすく面倒な処理になってしまいます。

以下のように、`lat` と `lng` というフィールドを持った `coordinate` 構造体を宣言します。

```go
var coordinate struct {
	lat float64
	lng float32
}
```

フィールドの値にアクセスするときや、フィールドに値を代入するときには、ドット `.` を使用します。

```go
coordinate.lat = 35.658517
coordinate.lng = 139.70133399999997
fmt.Println(coordinate.lat, coordinate.lng) // 35.658517 139.70134
fmt.Println(coordinate)                     // {35.658517 139.70134}
```

## 型で構造体を宣言する

構造体は、再利用するために使われるので以下のように型として宣言して使用する方法が一般的です。

```go
type coordinate struct {
	lat float64
	lng float64
}

var shibuya coordinate
shibuya.lat = 35.658517
shibuya.lng = 139.70133399999997
```

## 構造体の初期化

複合リテラルを用いて、構造体を初期化できます。
複合リテラル用いた構造体の初期可能方法には、フィールド名を用いる方法と、フィールド名を省略する方法の 2 つの方法があります。

### フィールド名を指定

以下の例では、明示的にフィールドを指定して構造体を初期化しています。
このとき、フィールドの指定する順序は問題になりません。
例えば、`shinjuku` の初期化には型定義と異なる順序でフィールドを指定していますが、それぞれのフィールドに正しい値として代入されています。
また `ikebukuro` のように欠けているフィールドが存在する場合、その型のゼロ値となります。

```go
type coordinate struct {
	lat, lng float64
}

shibuya := coordinate{lat: 35.658517, lng: 139.70133399999997}
fmt.Println(shibuya)
// {35.658517 139.70134}

shinjuku := coordinate{lng: 139.700258, lat: 35.690921}
fmt.Println(shinjuku)
// {35.690921 139.70026}

ikebukuro := coordinate{lat: 35.728926}
fmt.Println(ikebukuro)
// {35.728926 0}
```

### フィールド名を省略

次に、フィールド名を省略する初期化の方法です。
フィールド名を指定しない代わりに、必ず構造体定義のリストと同じ順序で各フィールドの値を提供します。
うっかり順序を間違えて指定してしまうと、思わぬバグにつながるかもしれません。
`shinjuku` の例は明らかに `lat` と `lng` の値を誤って代入してしまっています。（ちなみのこの地点はトルコの Kocaş Pond と呼ばれる池の辺りです）
さらに、フィールドが欠けている場合には、コンパイルエラーが発生します。

```go
type coordinate struct {
	lat,lng float64
}

shibuya := coordinate{35.658517, 139.70133399999997}
fmt.Println(shibuya)
// {35.658517 139.70134}

shinjuku := coordinate{139.700258, 35.690921}
fmt.Println(shinjuku)
// {139.70026, 35.690921}

ikebukuro := coordinate{35.728926}
// too few values in coordinate literal
```

基本的には、フィールドを指定して初期化する方法が好ましいでしょう。

## コンストラクタ関数

構造体を初期化する方法として、コンストラクタ関数を書くという方法があります。
コンストラクタ関数と呼ばれているものの他の言語のように特別な言語機能として提供されているわけではなく、通常の関数です。
規約として、`new + 構造体名` という名前が使用されます。
そして、作成された構造体を必ず return して返します。

```go
package main

import "fmt"

type coordinate struct {
	lat, lng float64
}

func newCoordinate(lat, lng float64) coordinate {
	return coordinate{lat: lat, lng: lng}
}

func main() {
	shibuya := newCoordinate(35.658517, 139.701333)
	fmt.Println(shibuya)
	// {35.658517 139.70134}
}
```

## 構造体は値渡し

構造体は通常値渡しとしてコピーが作成されます。

```go
type coordinate struct {
	lat, lng float64
}

shibuya := coordinate{lat: 35.658517, lng: 139.701333}
shibuya2 := shibuya
shibuya2.lng += 1
fmt.Println(shibuya, shibuya2)
// {35.658517 139.701333} {35.658517 140.701333}
```

## 構造体の匿名フィールド

構造体のフィールドにさらに構造体を指定できます。
例えば、座標（coordinate）を表す構造体はさらに位置（location）を表す構造体のフィールドとして使用されるでしょう。

```go
package main

import "fmt"

type coordinate struct {
	lat, lng float64
}

type location struct {
	name, address string
	coordinate
}

func main() {
	inokashiraPark := location{
		name:       "Inokashira Park",
		address:    "1-18-31 Gotenyama, Musashino City, Tokyo",
		coordinate: coordinate{lat: 35.7001082, lng: 139.5738456},
	}

	fmt.Println(inokashiraPark)
	// {Inokashira Park 1-18-31 Gotenyama, Musashino City, Tokyo {35.7001082 139.5738456}}
}
```

### 匿名フィールドへのアクセス

`location` 構造体から、`coordinate` 構造体が持つ `lat`・`lng` フィールドに関して、`location` 構造体から以下のように直接アクセスできます。

```go
package main

import "fmt"

type coordinate struct {
	lat, lng float64
}

type location struct {
	name, address string
	coordinate
}

func main() {
	inokashiraPark := location{
		name:       "Inokashira Park",
		address:    "1-18-31 Gotenyama, Musashino City, Tokyo",
		coordinate: coordinate{lat: 35.7001082, lng: 139.5738456},
	}

	fmt.Println(inokashiraPark.lat)
}
```

しかし、複数の構造体の名前が競合するような場合には、明確に呼び出す必要があります。
例えば、`location` フィールドに新たに `route` という構造体を追加し、その構造対が `name` というフィールドを持っていたとしたら、`location` 構造体がもともと持っていた `name` フィールドとどっちにアクセスすればよいのか判断できません。

``` go
package main

import "fmt"

type book struct {
	title string
	author
	publisher
}

type author struct {
	name string
}

type publisher struct {
	name string
}

func main() {
	book1 := book{
		title:     "lorem",
		author:    author{name: "ipsum"},
		publisher: publisher{name: "dolor"},
	}

	fmt.Println(book1.name) // ambiguous selector book1.name
	fmt.Println(book1.author.name) // ipsum
	fmt.Println(book1.publisher.name) // dolor
}
```

##  構造体をJSONに変換する

構造体を JSON に変換するためには、`encoding/json` パッケージの `Mershal` メソッドを使用します。
GO の json パッケージではフィールド名の最初に大文字を使うことが要求され、さらに複数ワードのフィールド名にはキャメルケースを使うのが慣例です。
しかし、JSON のキーとして使用する際には通常小文字にしたいことでしょう。そのような場合には構造体タグが使用できます。

JSON に変換する際に構造体タグは `json:"[キー名]"` の形式で指定します。

```go
package main

import (
	"encoding/json"
	"fmt"
	"os"
)

type coordinate struct {
	Lat float64 `json:"lat"`
	Lng float64 `json:"lng"`
}

func main() {
	inokashiraPark := coordinate{Lat: 35.7001082, Lng: 139.5738456}
	bytes, err := json.Marshal(inokashiraPark)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	fmt.Println(string(bytes)) // {"lat":35.7001082,"lng":139.5738456}
}
```

# インターフェース

構造体はフィールドを定義していましたが、インターフェースは変わりに実装すべきメソッドを定義しています。
月並みな例ですが「鳴く」ことができる動物を宣言するには次のようになります。

```go
type animal interface {
	say() string
}
```

このインターフェースを満たすには、`say` という名前のメソッドを実装している型である必要があります。そして、それさえ満たしていれば、どんな型であっても使えます。
Java 言語のように、明示的に `implement` キーワードを使用してインターフェースを継承していることを表す必要はありません。
次の関数 `printSay` は引数として `animal` インターフェースを受け取りますが、やはり必要な要件は `say` メソッドを実装していることだけです。

```go
package main

import "fmt"

type animal interface {
	say() string
}

type human struct {
	name string
}

func (h human) say() string {
	return "Hello I'm " + h.name
}

type cat struct {
	name string
}

func (c cat) say() string {
	return "meow"
}

// ミジンコ(daphnia)は鳴くことができない
type daphnia struct {
	name string
}

func printSay(a animal) {
	fmt.Println(a.say())
}

func main() {
	h := human{name: "suzuki"}
	c := cat{name: "tama"}
	d := daphnia{name: "leo"}

	printSay(h) // Hello I'm suzukimeow
	printSay(c) // meow
	printSay(d) // daphnia does not implement animal (missing say method)
}
```

## 空のインターフェース

しばしば、何もメソッドを持たない空のインターフェース `interface{}` が使われます。
空のインターフェースはすべての型と互換性を持っており、どんな型の変数でも使用できます。

そのため、TypeScript の `any` 型のように使用できます。

```go
package main

import "fmt"

func someFunc(any interface{}) {
	fmt.Println(any)
}

func main() {
	someFunc("hello")
	someFunc(100) 
	someFunc([]int{1, 2, 3})
}
```

