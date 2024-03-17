---
id: 4YH0uqUhb81CKcPTOsfoYI
title: "Go言語　コレクション（配列・スライス・マップ）"
slug: "go-collection"
about: "配列は決まった長さを持つ要素を並べた順序のあるコレクションです。 Go言語の配列は固定長になっており、宣言時に長さと要素型を指定します。 長さは後から変更することはできません。 Go言語の配列は柔軟性に欠けるため、実際にはあまり使用されません。可変長であるスライスがよく使われます。 マップはキーと値によって宣言されます。これは、連想配列のようなものです。"
createdAt: "2020-10-18T00:00+09:00"
updatedAt: "2020-10-18T00:00+09:00"
tags: ["Go"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/7J6X29QCpCjoReVMQFOC1D/f091383d411092eaa4487bad33560ca6/golang.png"
  title: "go"
selfAssessment: null
published: true
---
# 配列

## 配列の宣言と使用

配列は決まった長さを持つ要素を並べた順序のあるコレクションです。
Go 言語の配列は固定長になっており、宣言時に長さと要素型を指定します。
長さは後から変更することはできません。

配列の要素には 0 から始まるインデックスを用いてアクセスします。

```go
package main

import "fmt"

func main() {
	var fruits [5]string // 長さが5、型がstringの配列を宣言

	fruits[0] = "apple" // インデックス0の位置に代入
	fruits[1] = "banana"
	fruits[2] = "melon"

	fmt.Println(fruits[1]) // インデックス1の要素を取り出す。
}
```

配列に代入していないその他の要素には、その型のゼロ値が含まれています。

```go
fmt.Println(fruits[3]) // ""
```

配列の長さを取得するために、組み込み関数の `len` が使えます。

```go
fmt.Println(len(fruits)) // 5
```

もしも範囲外の要素にアクセスしようとした場合、コンパイラはエラーを吐きます。

```go
fmt.Println(fruits[5]) // Invalid array index 5 (out of bounds for 5-element array)
```

しかし、次のようにコンパイラがこのエラーを検出できない場合、プログラムは panic を起こす可能性があります。

```go
index := 5
fmt.Println(fruits[index])

// panic: runtime error: index out of range [5] with length 5
// goroutine 1 [running]:
// main.main()
//    main.go:16 +0x1da
// exit status 2
```

## 複合リテラルにより配列の初期化

Go 言語に複合リテラルに構文を使用することで、配列の宣言と初期化を簡潔に行うことができます。

```go
fruits := [5]string{
	"apple",
	"banana",
	"melon",
	"lemon",
	"cherry",
}
```

配列をの要素を複数行に分けて宣言する場合、最後の要素にもカンマが必要です。さもなければコンパイラはエラーを吐きます。

また要素の数に `...` を使用して配列の要素の数をコンパイラに数えさせることができます。

```go
fruits := [...]string{
	"apple",
	"banana",
	"melon",
	"lemon",
	"cherry",
}

fmt.Println(len(fruits)) // 5
```

## 配列の反復処理

配列の要素を反復処理をするために、`range` キーワードを使用します。これは他言語における foreach によく似ています。

```go
fruits := [...]string{
	"apple",
	"banana",
	"melon",
	"lemon",
	"cherry",
}

for i, fruit := range fruits {
	fmt.Println(i, fruit)
}

// 0 apple
// 1 banana
// 2 melon
// 3 lemon
// 4 cherry
```

インデックスまたは要素のどちらかが不要な場合には、`_` を使用します。

```go
for _, fruit := range fruits {
	fmt.Println(fruit)
}

// apple
// banana
// melon
// lemon
// cherry
```

## Goの配列は値である

Go 言語の配列は値であり、これは C 言語のように最初の配列要素へのポインターではありません。そのため、配列を新しい変数に代入したり、関数に渡したりするとコピーが渡されます。

```go
package main

import "fmt"

func main() {
	fruits := [...]string{
		"apple",
		"banana",
		"melon",
		"lemon",
		"cherry",
	}

	newFruits := fruits

	newFruits[0] = "bad-apple"
	fmt.Println(fruits) // [apple banana melon lemon cherry]
	fmt.Println(newFruits) // [bad-apple banana melon lemon cherry]
}
```

# スライス

Go 言語の配列は柔軟性に欠けるため、実際にはあまり使用されません。

例えば、次のように includes 関数を実装する例を見てください。

```go
package main

import "fmt"

func includes(array [5]string, value string) bool {
	find := false
	for _, v := range array {
		if v == value {
			find = true
		}
	}
	return find
}

func main() {
	fruits := [...]string{
		"apple",
		"banana",
		"melon",
		"lemon",
		"cherry",
	}

	fmt.Println(includes(fruits, "banana"))
	fmt.Println(includes(fruits, "kiwi"))
}
```

うまくいっているように見えますか？しかしこの関数は、要素が 5 つの配列しか受け取れないため、要素の数が変更されたとたんに世界は崩壊します。

```go
package main

import "fmt"

func includes(array [5]string, value string) bool {
	find := false
	for _, v := range array {
		if v == value {
			find = true
		}
	}
	return find
}

func main() {
	fruits := [...]string{
		"apple",
		"banana",
		"melon",
		"lemon",
		"cherry",
		"kiwi",
	}

	fmt.Println(includes(fruits, "banana")) // cannot use fruits (type [6]string) as type [5]string in argument to includes
}
```

それでは今度は長さが 6 つの配列のための includes 関数を・・・というわけにもいかないので、長さの指定されないスライスが用意されています。

## 配列を「スライス」する

スライスの本質は、配列を「スライス」することです。
「スライス」するといっても実際に配列を切り分けているわけではなく、ビューを作成しているようなものです。
fruits 配列から、melon と lemon をスライスしてみましょう。

```go
fruits := [...]string{
	"apple",
	"banana",
	"melon",
	"lemon",
	"cherry",
}

slicedFruits := fruits[2:4]
fmt.Println(slicedFruits) // [melon lemon]
```

スライスの要素を変更すると、元の配列もまた変更されます。

```go
fruits := [...]string{
	"apple",
	"banana",
	"melon",
	"lemon",
	"cherry",
}

slicedFruits := fruits[2:4]
slicedFruits[1] = "muskmelon"
fmt.Println(slicedFruits) // [melon muskmelon]
fmt.Println(fruits) // [apple banana melon muskmelon cherry]
```

配列をスライスするとき、最初のインデックスを省略すると、デフォルトで 0 になります。最後のインデックスを省略したときのデフォルト値は配列の長さです。

両方のインデックスを省略したならば、もとの要素をすべて含むスライスが作成されます。

```go
fruits := [...]string{
	"apple",
	"banana",
	"melon",
	"lemon",
	"cherry",
}

slicedFruits := fruits[:]

fmt.Println(slicedFruits) // [apple banana melon lemon cherry]
fmt.Println(fruits) // [apple banana melon lemon cherry]
```

## スライスを宣言する

ただ配列から「スライス」するだけではあまり意味をなさないので、スライスを直接宣言できます。
要素数を省略していることを除いて、配列と同じように宣言されます。

```go
fruits := []string{
	"apple",
	"banana",
	"melon",
	"lemon",
	"cherry",
}
```

しかし、このようにスライスを直接宣言した場合でも舞台裏では 5 つの要素をもつ配列が宣言され、その全部の要素を持つスライスが作成されています。

され、冒頭の includes 関数をスライスで書き換えて見ましょう。引数 array の型にはスライスを指定します。スライスは可変長なので、どのような要素長さを持つスライスでも受け付けます。

```go
package main

import "fmt"

func includes(array []string, value string) bool {
	find := false
	for _, v := range array {
		if v == value {
			find = true
		}
	}
	return find
}

func main() {
	fruits := []string{
		"apple",
		"banana",
		"melon",
		"lemon",
		"cherry",
	}

	fmt.Println(includes(fruits, "banana")) // true

	vegetables := []string{
		"garlic",
		"cabbage",
		"ginger",
	}

	fmt.Println(includes(vegetables, "eggplant")) // false
}
```

## append

スライスに要素を追加するためには、append 関数を利用します。

```go
package main

import "fmt"

func main() {
	fruits := []string{
		"apple",
		"banana",
		"melon",
		"lemon",
		"cherry",
	}

	newFruits := append(fruits, "kiwi")

	fmt.Println(fruits)    // [apple banana melon lemon cherry]
	fmt.Println(newFruits) // [apple banana melon lemon cherry kiwi]
}
```

## スライスは参照が渡し

スライスは配列と違って値がコピーされずに参照渡しされます。

```go
package main

import "fmt"

func main() {
	fruits := []string{
		"apple",
		"banana",
		"melon",
		"lemon",
		"cherry",
	}

	newFruits := fruits

	newFruits[0] = "bad-apple"

	fmt.Println(fruits)    // [bad-apple banana melon lemon cherry]
	fmt.Println(newFruits) // [bad-apple banana melon lemon cherry]
}
```

# マップ

マップはキーと値によって宣言されます。これは、連想配列のようなものです。

## マップの宣言と使用

マップのキーには大抵の型を使用できます。
Go 言語では、キーと値に型を指定する必要があります。string 型のキーと int 型の値を使用する場合には次のようになります。

```go
map[string]int
```

マップは以下のように宣言できます。

```go
package main

import "fmt"

func main() {
	fruits := map[string]int{
		"apple":  150,
		"banana": 200,
		"melon":  500,
	}

	fmt.Println(fruits["apple"]) // 150
}
```

## キーの存在確認

マップに存在しないキーにアクセス使用とした場合、値の型のゼロ値が返されます。

```go
package main

import "fmt"

func main() {
	fruits := map[string]int{
		"apple":  150,
		"banana": 200,
		"melon":  500,
	}

	fmt.Println(fruits["kiwi"])
}
```

しかし、これでは元から 0 が入っていたパターンとキーが存在しないパターンの区別ができません。
そこで「カンマ、ok の構文」を使用します。

```go
package main

import "fmt"

func main() {
	fruits := map[string]int{
		"apple":  150,
		"banana": 200,
		"melon":  500,
	}

	if price, ok := fruits["kiwi"]; ok {
		fmt.Printf("キウイは%v円です。", price)
	} else {
		fmt.Println("キウイは販売されていません！")
	}
}
```

追加の変数 ok には、キーが存在する場合には true が、存在しない場合には false が返されます。

## 要素の削除

delete 関数を用いて、マップの要素を削除できます。

```go
package main

import "fmt"

func main() {
	fruits := map[string]int{
		"apple":  150,
		"banana": 200,
		"melon":  500,
	}

	delete(fruits, "banana")

	fmt.Println(fruits) // map[apple:150 melon:500]
}
```

## マップは参照渡し

マップの値はコピーされずに、参照が渡されます。
ですので、新しい変数に代入したり関数に渡したものを変更すると元のマップも変更されます。

```go
package main

import "fmt"

func main() {
	fruits := map[string]int{
		"apple":  150,
		"banana": 200,
		"melon":  500,
	}

	newFruits := fruits

	newFruits["banana"] = 20000 // すごく高い！！

	fmt.Println(fruits) // map[apple:150 banana:20000 melon:500]
	fmt.Println(newFruits) // map[apple:150 banana:20000 melon:500]
}
```
