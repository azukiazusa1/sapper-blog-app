---
id: 2s9S9Rau3ciTZqS4Xrj72V
title: "Go言語　型・関数・メソッド"
slug: "go-type-function-method"
about: " Go言語は静的型付け言語であり、全ての変数は何らかの型に属し、異なる型同士の演算といった問題点の多くはコンパイル時に検出されます。 関数の宣言にはfuncキーワードを使用します。関数の引数と戻り値には型を指定します。戻り値を複数持たせられる、戻り値に名前をつけることができるといった特徴があります。 クラスやオブジェクトはないですが、メソッドはあります。メソッドは型に紐付けられます。"
createdAt: "2020-10-04T00:00+09:00"
updatedAt: "2020-10-04T00:00+09:00"
tags: ["Go"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/7J6X29QCpCjoReVMQFOC1D/f091383d411092eaa4487bad33560ca6/golang.png"
  title: "go"
selfAssessment: null
published: true
---
# 型

Go 言語は静的型付け言語であり、すべての変数は何らかの型に属し、異なる型同士の演算といった問題点の多くはコンパイル時に検出されます。

Go 言語の組み込み型一覧は以下のとおりです。

- 真偽値
  - boole
- 数値
  - int
  - int8
  - int16
  - int32
  - int64
  - byte
  - uint
  - uint8
  - uint16
  - uint32
  - uint64
  - float32
  - float64
  - complex64
  - complex128
- ポインタ
  - uintptr
- 文字・文字列
  - rune
  - string
- エラー用インタフェース
  - error

## 型推論

例えば、浮動小数点方の変数を宣言する場合には、次のようにできます。

```go
var lat float64 = 35.7115823
```

しかし、わざわざこのように明示的に型を指定して宣言することは手間です。なぜなら、私たちが 35.7115823 という値を代入して宣言すると、それは float64 になるということを知っているように Go コンパイラもまた右辺の値を見て推論できるからです。

```go
package main

import (
	"fmt"
)

func main() {
	var lat float64 = 35.7115823
	fmt.Printf("%T\n", lat) // float64

	var lat2 = 35.7115823
	fmt.Printf("%T\n", lat2) // float64

	lat3 := 35.7115823
	fmt.Printf("%T\n", lat2) // float64
}
```

`fmt.Pringf()` の書式指定子 `%T` は変数の型情報を出力します。どの宣言方法を使用しても、同じ型の変数が宣言されていることがわかります。
推論によって型が得られる場合には余分な型指定を省くのが一般的なスタイルです。

明示的な型指定は、例えば float32 型の変数を宣言したいときに役に立ちます。
基本的に小数の値を代入すると、Go コンパイラは float64 型と推論するので、あえて float32 型を使いたいような場合には、型指定をして Go コンパイラに教えてあげる必要があります。

```go
package main

import (
	"fmt"
)

func main() {
	var temperature = 23.5 // float64
	fmt.Printf("%T\n", temperature)

	var temperature2 float32 = 23.5 // float32
	fmt.Printf("%T\n", temperature2)
}
```

## 型変換

普段、型静的型付け言語に使い慣れている人にとってはありきたりの出来事ですが、違う形同士を混ぜて使用できません。

```go
package main

import (
	"fmt"
)

func main() {
	num1 := "10"
	num2 := 1
	fmt.Println(num1 - num2) // invalid operation: num1 - num2 (mismatched types untyped string and untyped int)

	num3 := 10
	num4 := 1.5

	fmt.Println(num3 - num4) // invalid operation: num3 - num4 (mismatched types int and float64)
}

```

異なる型同士を混ぜて使用する場合には、明示的な型変換が必要です。

```go
package main

import (
	"fmt"
	"strconv"
)

func main() {
	num1 := "10"
	num2 := 1
	toInt, err := strconv.Atoi(num1) // string => intの変換
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(toInt - num2)

	num3 := 10
	num4 := 1.5

	tofloat64 := float64(num3) // int => float64の変換
	fmt.Println(tofloat64 - num4)
}
```

int 型　=> float64 型のような単純な変換は型をキャストするだけでうまくいきます。
文字列を型数値型に変換するような場合には、`strconv` パッケージにある `Atoi` 関数を使用する必要があります。これは文字列に有効な数が含まれていない場合エラーを返します。
エラーが返された場合 `toInt` にはゼロ値が返されます。

## Named type

Go 言語にはすでにたくさんの組み込み方が存在しますが、それでもなお満足できずに新たなほうを欲するかもしれません。
例えば、温度を扱う型には float64 を使うよりも celsius（摂氏）という型を利用するほうが意味が明白になります。
celsius という型を新たに宣言して使ってみます。

```go
package main

import (
	"fmt"
)

func main() {
	type celsius float64

	var temperature celsius = 23.5
	fmt.Printf("%T\n", temperature) // main.celsius
}
```

重要なのは、float64 という方と celsius という型は全くの別物だということです。したがって次のように混ぜて使用できません。

```go
package main

import (
	"fmt"
)

func main() {
	type celsius float64

	var temperature celsius = 23.5
	var num = 40.3

	fmt.Println(temperature + num) // invalid operation: temperature + num (mismatched types celsius and float64)
}

これも明示的にキャストする必要があります。

package main

import (
	"fmt"
)

func main() {
	type celsius float64

	var temperature celsius = 23.5
	var num = 40.3

	fmt.Println(temperature + celsius(num)) // 63.8
}
```

また新しい型には後述するメソッドを追記できます。

## 型エイリアス（Type alias）

 Named type と似たような機能に型エイリアスがあります。型の別名を宣言するという点は同一ですが、以下のような違いがあります。

- キャストせずに同じ型として利用できる
- エイリアスに新しいメソッドは定義できない

```go
package main

import (
	"fmt"
)

func main() {
	type celsius = float64 // 宣言方法が異なる

	var temperature celsius = 23.5
	var num = 40.3

	fmt.Println(temperature + num) // キャスト不要
}
```

# 関数

以下のように関数を宣言できます。

```go
func addOne(n int) int {
	return n + 1
}
```

関数の宣言には `func` キーワードを使用します。関数の引数と戻り値には型を指定します。関数の引数に異なる型を使用できません。
また関数の返り値を変数に代入するとそれは推論されます。

```go
package main

import "fmt"

func addOne(n int) int {
	return n + 1
}

func main() {
	var num1 = 1
	added := addOne(num1)

	fmt.Printf("%T", added) // int

	var num2 = 1.1
	fmt.Println(addOne(num2)) // cannot use num2 (type float64) as type int in argument to addOne
}

```

## 戻り値なしの関数

関数に戻り値がない場合には、Java のように `void` を記述必要はありません。

```go
func hello() {
	fmg.Pringln("Hello!")
}
```

## 複数の引数の型指定

同じ型の引数が複数存在する場合、省略できます。

```go
func add(num1, num2 int) int {
	return num1 + num2
}
```

## 可変長引数

引数を固定ではなく、任意の個数として渡すことができます。
可変長引数は引数の一番最後に定義し、引数の方の前に `...` を付与します。

```go
package main

import "fmt"

func addAll(numbers ...int) int {
	sum := 0
	for _, num := range numbers {
		sum += num
	}

	return sum
}

func main() {
	fmt.Println(addAll(1, 2, 3, 4, 5, 6, 7, 8, 9, 10))
}
```

## 複数の返り値

驚くべきことに、Go 言語では関数の戻り値に複数の値を持たせることができます。
これは関数のエラー処理によく使われます。
第一返り値に通常返したい値を、第二返り値にエラーの判定用の値（エラーがあった場合には erorr 型を、なかった場合には nil を返す）もたせます。
呼び出し側で、返り値をチェックしてエラー処理を行います。

```go
package main

import (
	"errors"
	"fmt"
)

func addThreeTimes(num int) (int, error) {
	if num == 6 {
		return 0, errors.New("666は悪魔の数字！")
	}

	sum := num + num + num
	return sum, nil
}

func main() {
	result, err := addThreeTimes(6)
	if err != nil {
		fmt.Println(err) // 666は悪魔の数字！
		return
	}

	fmt.Println(result)
}
```

## 返り値の破棄

もしかしたら結果は必要なく、エラーが発生したかどうかだけが気になるかもしれません。
しかしその場合変数を不使用のままだとコンパイルエラーが発生します。

```go
result, err := addThreeTimes(6) // result declared but not used
fmt.Println(err)
```

そのような場合には、不必要な変数に `_` を利用して変数を破棄します。

```go
_, err := addThreeTimes(6)
fmt.Println(err)
```

## 名前付き結果パラメータ

返り値の変数の値に、名前をつけることができ引数パラメータのように通常の変数として利用できます。名前が付けられていると、関数が呼び出されたときにその型のゼロ値で初期化されます。引数を持たない return ステートメントを実行したときは、その時点で結果パラメータに格納されている値が、戻り値として使われます。

```go
package main

import (
	"fmt"
)

func analyze(numbers ...float64) (sum float64, avg float64) {
	fmt.Println(sum, avg) // 0 0
	for _, num := range numbers {
		sum += num
	}

	avg = sum / float64(len(numbers))
	return
}

func main() {
	sum, avg := analyze(24, 23, 18, 21, 20, 22, 25, 26, 21)

	fmt.Println(sum, avg) // 200 22.22222222222222

}
```

# メソッド

Go 言語にクラスもオブジェクトもないですが、メソッドは存在します。
メソッドは方に紐付けられます。

温度の計測のために fahrenheit（華氏）と celsius（摂氏）という型を作成して、メソッドを生やしてみます。

```go
type fahrenheit float64
type celsius float64

func (f fahrenheit)　toCelsius() celsius {
	return celsius((f - 32) / 1.8)
}
```

このメソッドはパラメータを受け取りませんが、代わりにレシーバを受け取ります。レシーバの後がメソッド名、結果の型と続きます。

メソッドは次のように、型に対してドット表記で呼び出します。

```go
package main

import (
	"fmt"
)

type fahrenheit float64

func (f fahrenheit) toCelsius() celsius {
	return celsius((f - 32.0) / 1.8)
}

type celsius float64

func (c celsius) toFahrenheit() fahrenheit {
	return fahrenheit(c*1.8 + 32.0)
}

func main() {
	var f fahrenheit = 75.2
	fmt.Println(f.toCelsius()) // 24

	var c celsius = 20
	fmt.Println(c.toFahrenheit()) // 68
}
```

レシーバとして渡される値は、メソッド呼び出した元の値が使用されます。
当然ですが、他の型のメソッドは使えません。

```go
c.toCelsius() // c.toCelsius undefined (type celsius has no field or method toCelsius)
```
