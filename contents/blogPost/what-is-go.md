---
id: 7mGWdwkxi7xZNgNEhER8iV
title: "Go言語基礎文法"
slug: "what-is-go"
about: "Go言語(Golang）は、2009年にGoogleによって開発されたオープンソースの静的型付け、コンパイルされるプログラミング言語です。Go言語はコンパイルされるプログラミング言語です。 Go言語はシンプルで、信頼性が高く、効果的なソフトウェアを構築します。"
createdAt: "2020-09-27T00:00+09:00"
updatedAt: "2020-09-27T00:00+09:00"
tags: ["Go"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/7J6X29QCpCjoReVMQFOC1D/f091383d411092eaa4487bad33560ca6/golang.png"
  title: "go"
selfAssessment: null
published: true
---
# Go言語とは

Go 言語（Golang）は、2009 年に Google によって開発されたオープンソースの静的型付け、コンパイルされるプログラミング言語です。Go 言語はコンパイルされるプログラミング言語です。
Go 言語は、**シンプル**で、**信頼性が高く**、**効果的**なソフトウェアを構築します。

さらに、以下のような特徴を持っています。

- 実行速度が速い
- 並列処理に強い
- 拡張性（スケーラビリティ）が高い
- クロスプラットフォーム対応
- 消費リソースが少ない
- シンプルな言語構造
- 誰が書いたコードでも読みやすい

# まずはHello World！から

Go 言語で、Hello World!を実装すると、次のようになります。
なお Go 言語で書いたコードは[Go Playground](https://play.golang.org/)でプラウザから実行できます。

```go
package main // ①パッケージの宣言

import (
	"fmt" // ②fmtパッケージを使えるようにする
)

func main() { // ③mainという名前の関数を宣言
	fmt.Println("Hello World!") // ④Hello World!と画面に出力
}
```

## ①パッケージの宣言

Go 言語では、コードが属する**パッケージ**を必ず宣言する必要があります。パッケージとは、多言語における名前空間や、モジュールといった機能に該当するものです。
プログラミングを実行するパッケージには「main」パッケージを与えます。

パッケージの宣言には `package` キーワードを使用します。

## ②　fmtパッケージを使えるようにする

`import` キーワードを使って、このコードが使うパッケージを指定します。
パッケージの呼び出しには以下の種類があります。

- Go 言語で用意された標準パッケージ
- 独自パッケージ（相対パスで呼び出す）
- ワークスペースのパス（GitHub などで公開されている外部パッケージを呼び出す）

fmt パッケージは、標準パッケージに属しており、入出力の関数を提供します。

## ③mainという名前の関数を宣言

`func` キーワードは、関数を宣言します。
「main」という名前の関数は、特別な識別子で、プログラムを実行する際に必要になります。
Go 言語が実行されるときには、main パッケージの main 関数から処理が始まります。

### 波括弧 `({})` の位置が重要

すこし話が横にそれますが、大切なことです。Go 言語では、波括弧 `({})` の置き方について厳密です。

開き波括弧 `{(` は `func` キーワードと同じ行に置かれ、閉じ波括弧 `})` は独自の行に必ず置かれる必要があります。
試しに、PHP のように開き波括弧 `({` を次の行に書くと、コンパイルエラーが発生します。

```go
package main

import (
	"fmt"
)

func main() // missing function body
{ // syntax error: unexpected semicolon or newline before {
	fmt.Println("Hello World!")
}
```

この仕様は、Go 言語のセミコロンの省略によるものです。誕生当時の Go 言語では、文末に必ずセミコロンをつける必要がありましたが、2009 年の 12 月に JavaScript のようにセミコロンは自動で挿入されるようになりました。

その代償として、波括弧は正しく使う必要があります。

## ④Hello World!と画面に出力

テキストの行を表示するには、fmt パッケージの `Println` 関数を使用します。パッケージに属する関数を利用する場合には、[パッケージ名].[関数名]のように、ドッド `.` で挟んで使用します。

なお Go 言語において文字列を定義する場合にはシングルクォート `''` を使用できません。シングルクォートは 1 文字のときに使用でき、それは `Rune` という型を扱うことになります。
結果的に Unicode コードポイントの整数値が出力されます。

```go
package main

import (
	"fmt"
)

func main() {
	fmt.Println('Hello World!') // invalid character literal (more than one character)
	fmt.Println('A') // 65
}
```

# 変数宣言

変数宣言には、以下の 3 つの方法があげられます。

- const
- var
- 省略記法（:=）

## const 

`const` キーワードを使用して変数宣言をした場合、それは定数として扱われます。
新たな値を代入しようとした場合、コンパイルエラーが発生します。

```go
package main

import (
	"fmt"
)

func main() {
	const number = 100
	fmt.Println(number) // 100
	number = 90 // cannot assign to number
}
```

## var

`var` キーワードで変数を定義した場合、それは再代入可能ですが再宣言はできません。

```go
package main

import (
	"fmt"
)

func main() {
	var number = 100
	fmt.Println(number) // 100
	number = 90
	fmt.Println(number) // 90
	var number = 80 
	// number redeclared in this block
	// previous declaration at
}
```

## 省略記法(:=)

`var` キーワードによる変数宣言の代わりに、省略記法が使用できます。次の 2 つの行はなど価です。

```go
var number = 100
number := 100
```

省略記法の宣言が一般的ですが、`var` キーワードによる宣言と違いがあります。
`var` キーワードによる宣言は関数外でできますが、省略記法による宣言は関数内で使用する必要があります。

```go
package main

var a = 100
b := 200 // syntax error: non-declaration statement outside function body

func main() {
	var c = 300
	d := 400
}
```

## 変数のスコープ

変数のスコープは、以下のとおりです。

- if、for などのブロック内
- 関数内
- パッケージ内

当然、スコープ外の変数にはアクセスできません。

```go
package main

import (
	"fmt"
)

var a = 100

func main() {
	var b = 200
	fmt.Println(a + b)
}

func someFunc() {
	fmt.Println(a + b) // undefined b
}
```

# 条件分岐

## if文

if 文により条件分岐を提供します。
if 文の括弧 `()` は省略できます。

```go
package main

import (
	"fmt"
	"math/rand"
)

func main() {
	num := rand.Intn(100)

	if num > 90 {
		fmt.Println("当たり!")
	} else {
		fmt.Println("はずれ...")
	}
}
```

注意すべき点は、Go 言語において真の値は true だけ、偽の値は false だけという点です。if 文の条件式にはブール値を受け取るので次のような書き方はコンパイルエラーになります。

```go
package main

import (
	"fmt"
)

func main() {
	a := "lorem ipsm"

	if a { // non-bool a (type string) used as if condition
		fmt.Println(a)
	}
}
```
## 比較演算子

比較演算子には、次のようなものが提供されています。

| 比較演算子 | 説明 |
|-|-|
| == | などしい |
| < | より小さい（未満） |
| <= |  以下 |
| != | などしくない |
| > | より大きい |
| >= |　以上(大きいかなどしい） |

PHP や JavaScript に存在する厳密な比較演算子（===）は存在しません。
Go 言語は静的な型付け言語であり、異なる型同士の比較はコンパイルエラーとなるためです。

## 論理演算子

論理演算子 `||` は「OR」（a または b）「&&」は「AND」(a かつ b)を意味します。
論理演算子は短絡評価されるため、`||` の場合には左辺が true である場合右辺は評価されず、`&&` の場合には左辺が false である場合右辺は評価されません。

## switch文

ある 1 つの値を複数の値と比較するときのために、switch 文が提供されています。

```go
package main

import (
	"fmt"
)

func main() {
	num := 1

	switch num {
	case 1:
		fmt.Println("first")
	case 2:
		fmt.Println("second")
	case 3:
		fmt.Println("third")
	default:
		fmt.Println("oops!")
	}
}
```

多言語と比較した重要な違いは、1 つの case が実行されると自動的に switch 文を終了するところです。他言語のように、case ごとに break を記述する必要はありません。
明示的に次の case を実行したい場合には、`fallthrough` キーワードを使用します。

なお Go 言語では三項演算子に値する機能は提供されていません。

# ループ

## for文

for 文により、コードの繰り返しを提供します。
if 文と同じく、括弧 `()` は省略できます。

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	for i := 0; i < 10; i++ {
		fmt.Println(i)
		time.Sleep(time.Second)
	}
}
```

条件式の中で、省略記法にようる変数の宣言をしていることは重要です。
条件式の中では、`var = 0: i < 10; i++` という書き方ができないので、`var` を使用して宣言しようとすると変数がスコープの外に漏れだしてしまいます。

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	var i = 0
	for i < 10 {
		fmt.Println(i)
		time.Sleep(time.Second)
		i++
	}

	fmt.Println(i) // !!!
}
```

なお Go 言語では while または do while によるループを提供していません。
おそらく for 文で機能を代替できるからでしょう。シンプルさを目指した Go 言語らしさが出ています。
