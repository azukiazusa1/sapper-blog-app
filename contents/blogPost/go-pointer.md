---
id: 3340uCV4EdenSX2Z7lGJm7
title: "Go言語 ポインター"
slug: "go-pointer"
about: "Go言語には、ポインタがあります。 ポインタとは、メモリのアドレスのことです。アドレスは`0xc0000b4008`のような16進数で表されます。"
createdAt: "2020-11-01T00:00+09:00"
updatedAt: "2020-11-01T00:00+09:00"
tags: ["Go"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2JzEE4h7Xe5SHRr9iCPv4s/ac8cdc859f3af3a4c53cb7e5ba7af455/chounouryoku_woman.png"
  title: "pointer"
audio: null
selfAssessment: null
published: true
---
# ポインタ

Go 言語には、ポインタがあります。
ポインタとは、メモリのアドレスのことです。アドレスは `0xc0000b4008` のような 16 進数で表されます。

ポインタを正確に理解するためには、先に変数とメモリの関係を知っておく必要があるでしょう。この記事では詳しく触れませんが、以下の記事が参考になります。

[変数とメモリの関係 - 苦しんで覚えるC言語](https://9cguide.appspot.com/15-02.html)

Go 言語のポインタの構文は、主に `&`（アンパサンド）と `*`（アスタリスク）を使用します。

## & アドレス演算子

1 個の `&` によって表現される「アドレス演算子」は、変数のメモリ内アドレスを決定するものです。変数の値はコンピュータの RAM（ランダムアクセスメモリ）とは、に保存（ストア）されます。値がストアされる場所を、その変数の「メモリアドレス」と呼びます。以下のように、メモリアドレスを 16 進数で表示します。

```go
age := 24
fmt.Println(&age) // 0xc000136008
```

このように、アドレス演算子 `&` はその値のメモリアドレスを提供します。

## デリファレンス

アドレス演算子の逆を行う演算が「デリファレンス」（逆参照、間接参照）です。メモリアドレスで参照される値を求めます。デリファレンスを行うために、`*` を使用しています。

```go
age := 24
address := &age

fmt.Println(*address) // 24
```

なお C 言語と異なり、メモリアドレスをポインタ演算によって操作できません、Go 言語は安全でない演算を許可しないためです。

```go
age := 24
address := &age

address++ // invalid operation: address++ (non-numeric type *int)
```

## ポインタの型

前述の例のように、アドレス演算子で取得したメモリアドレスはポインタ型となります。
例えば、`address` 変数は `*int` という型を持っていることがわかります。

```go
age := 24
address := &age

fmt.Printf("addressの型は %T　です。\n", address)
// addressの型は *int　です。
```

このポインタ型は、変数宣言・関数パラメータ・戻り地の型・構造体のフィールド型など型が使える場所ならあらゆる場所で使用できます。

```go
var name *string

joe := "Joe"

name = &joe

fmt.Println(name) // 0xc00008e1e0
fmt.Println(*name) // Joe
```

## 構造体へのポインタ

ポインタは、しばしば構造体に対して使われます。そのため、構造体へのポインタを快適に使う工夫をいくつか提供しています。

文字列や数と違って、複合リテラルにはアドレス演算子を前置できます。

```go
type person struct {
	name string
	age  int
}

joe := &person{
	name: "Joe",
	age:  24,
}
fmt.Println(joe) // &{Joe 24}
```

また構造体のフィールドにアクセスするためにわざわざその構造体をデリファレンスする必要がありません。

```go
// 以下の2つは同じ
fmt.Println(joe.name) // Joe
fmt.Println((*joe).name) // Joe
```

## 配列へのポインタ

配列へのポインタも構造体と同様です。

```go
array := &[3]int{1, 2, 3}

fmt.Println(array[1]) // 2
fmt.Println((*array)[1]) // 2
```

## 隠れたポインタ

ポインタを使用する際に、常に明示的に指定しているわけはありません。
例えば、マップやスライスは宣言していなくても舞台裏でポインタが使用されています。
