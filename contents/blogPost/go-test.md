---
id: 3K0lOB532f4J63GaLMnqUO
title: "Go言語 テスト"
slug: "go-test"
about: "Go言語の提供するテストはシンプルです。テストのために覚えることは多くはありません。 Go言語の単体テスト用の機能は`testing`という標準パッケージとして提供されています。ベンチマークやカバレッジ、標準出力のテストなどをカバーしています。 また、テストは`go test`コマンドによって実行されます。サードパーティのツールなどは必要ありません。まずはこの`testing`パッケージの内容を見ていきます。"
createdAt: "2020-11-15T00:00+09:00"
updatedAt: "2020-11-15T00:00+09:00"
tags: ["Go"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1D7xedE6EH0DDEbsL2eWlM/52e352d672de9f157c0e2b260e201db2/go-language-icon.png"
  title: "go-http"
audio: null
selfAssessment: null
published: true
---
# Go言語におけるテスト

Go 言語の提供するテストはシンプルです。テストのために覚えることは多くはありません。
Go 言語の単体テスト用の機能は `testing` という標準パッケージとして提供されています。ベンチマークやカバレッジ、標準出力のテストなどをカバーしています。
またテストは `go test` コマンドによって実行されます。サードパーティのツールなどは必要ありません。まずはこの `testing` パッケージの内容を見ていきます。

# testingパッケージによるテスト

## テストを実行するためのルール

- xxx_test.go というファイル名で作成する
この命名規則により、`go build` のときは無視され、`go test` のときのみビルドされます。
- 関数名は `TestXxx` とし、`testing` パッケージを引数で受ける。
つまり、つぎのようになります。
`Test` の後の単語もキャメルケースとする必要があります。この命名規則を守らない場合、テストが実行されません。

```go
func TestXxx(*testing.T)
```

- テストファイルはテスト対象ファイルと同一パッケージとする

## はじめてのテスト

まずは簡単なテストを書いてみましょう。テスト対象は以下の関数です。

```go
package main

func sum(a, b int) int {
	return a + b
}
```

テストコードは以下のとおりです。

```go
package main

import (
	"testing"
)

func TestSum(t *testing.T) {
	got := sum(1, 2)
	if got != 3 {
		// t.Errorfはテストの失敗を告げるメソッドです。
		t.Errorf("sum(1, 2) want 3 but got %d", got)
	}
}
```

それではテストを実行してみましょう。コンソール上で `go test` でカレントディレクトリのテストを実行するか、`go test 相対パス` でテストを実行できます。

```sh
go test
PASS
ok      src/test        0.007s
```

無事テストが成功しました。試しに sum 関数の実装を修正してわざとテストが失敗する状態にしてみましょう。

```diff
package main

func sum(a, b int) int {
--	return a + b
++	return a - b
}
```

```sh
go test
--- FAIL: TestSum (0.00s)
    main_test.go:10: sum(1, 2) want 3 but got -1
FAIL
exit status 1
FAIL    src/test        0.007s
```

`t.Errorf` メソッドによってテストの失敗が告げられ、メッセージが出力されました。

### 詳細なテスト結果の表示

`-v` オプションを指定すると、詳細な結果を表示できます。

```sh
go test -v
=== RUN   TestSum
--- PASS: TestSum (0.00s)
PASS
ok      srco/test        0.007s
```

### カバレッジの取得

`-cover` オプションでカバレッジを取得できます。

```sh
go test -cover
PASS
coverage: 100.0% of statements
ok      src/test        0.007s
```

## testing.Tの主な関数

引数として受け取る構造体 `testing.T` 有用な関数が多くあります。

### T.Error/T.Errorf

これらの関数はテストの失敗を記録しますが、処理はそのまま実行されます。
なお `f` がついているものとそうでないものの違いは、出力をフォーマットできるかどうかです。

### T.Fatal/T.Fatalf

こちらは `T.Error/T.Errorf` と同じようにテストの失敗を記録しますが、呼び出された時点で処理を抜けます。

### T.Log

エラーログをテキストに記録します。

### T.LogF

引数に与えられたフォーマットに従って整形しエラーログに記録します。

### T.Fail

テストに失敗した記録を残しますが、処理を継続します。

### T.FailNow

テストに失敗した記録を残し、呼び出された時点で処理を抜けます。

--- 
すでに気づいたほうもいるかもしれないですが、`T.Error/T.Errorf` と `T.Fatal/T.Fatalf` は上記 4 つの関数を組み合わせたものです。

関係性は以下のとおりになっています。

||Log|Logf|
|-|-|-|
|**Fail**|Error|Erorrf|
|**FailNow**|Fatal|Fatalf|

### T.Skip

`T.Skip` を使うと、今は実行したくないテストをスキップできます。例えば、テスト駆動開発を実践していて、また未実装の関数がある場合や、非常に時間のかかるテストを実行したくないときに有効です。

```go
package main

import (
	"testing"
)

func TestSum(t *testing.T) {
	got := sum(1, 2)
	if got != 3 {
		t.Errorf("sum(1, 2) want 3 but got %d", got)
	}
}

func TestMulti(t *testing.T) {
	t.Skip("not implemented")
}
```

```sh
go test -v
=== RUN   TestSum
--- PASS: TestSum (0.00s)
=== RUN   TestMulti
    TestMulti: main_test.go:15: not implemented
--- SKIP: TestMulti (0.00s)
PASS
ok      src/test        0.013s
```

`go test` コマンドに、`-short` オプションを渡してテストケースに条件式を組み込むことでテストの実行をスキップできます。
次のように時間がかかるテストがあるとしましょう。

```go
package main

import (
	"testing"
	"time"
)

func TestSomeLongRunningTest(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping long-running test in short mode")
	}
	time.Sleep(5 * time.Second)
}
```

オプションを渡さずに実行した場合、5 秒かかってテストが実行されました。

```sh
go test -v
=== RUN   TestSomeLongRunningTest
--- PASS: TestSomeLongRunningTest (5.00s)
PASS
ok      src/test        5.007s
```

`-short` オプションを渡して実行してみると、次のようになります。

```sh
go test -v -short
=== RUN   TestSomeLongRunningTest
    TestSomeLongRunningTest: main_test.go:10: Skipping long-running test in short mode
--- SKIP: TestSomeLongRunningTest (0.00s)
PASS
ok      src/test        0.014s
```

時間のかかるテストがスキップされていることがわかりました。

### T.Parallel

Go 言語のテストは通常逐次実行されますが、並列実行させることによってテスト時間を短縮できます。
テストを並列実行させることができる条件は、それぞれのテストケースが独立して実行可能であることです。
テストケース内で、`T.Parallel()` が呼ばれているテストのみが並列実行されます。

```go
package main

import (
	"testing"
	"time"
)

func TestPrallel_1(t *testing.T) {
	t.Parallel()
	time.Sleep(1 * time.Second)
}
func TestPrallel_2(t *testing.T) {
	t.Parallel()
	time.Sleep(2 * time.Second)
}
func TestPrallel_3(t *testing.T) {
	t.Parallel()
	time.Sleep(3 * time.Second)
}
```

実行結果は以下のとおりです。

```sh
go test -v
=== RUN   TestPrallel_1
=== PAUSE TestPrallel_1
=== RUN   TestPrallel_2
=== PAUSE TestPrallel_2
=== RUN   TestPrallel_3
=== PAUSE TestPrallel_3
=== CONT  TestPrallel_3
=== CONT  TestPrallel_1
=== CONT  TestPrallel_2
--- PASS: TestPrallel_1 (1.00s)
--- PASS: TestPrallel_2 (2.01s)
--- PASS: TestPrallel_3 (3.01s)
PASS
ok      src/test        3.013s
```

またコマンド実行時に `-parallel` オプションを渡すことで、並列実行されるテストケースの数を指定できます。
例えば、`-parallel 1` とオプションを渡すと、1 つのテストケースしか並列実行しなくなるため、結果的には逐次実行しているのと変わらなくなります。

```go
go test -v -parallel 1
=== RUN   TestPrallel_1
=== PAUSE TestPrallel_1
=== RUN   TestPrallel_2
=== PAUSE TestPrallel_2
=== RUN   TestPrallel_3
=== PAUSE TestPrallel_3
=== CONT  TestPrallel_1
--- PASS: TestPrallel_1 (1.00s)
=== CONT  TestPrallel_2
--- PASS: TestPrallel_2 (2.00s)
=== CONT  TestPrallel_3
--- PASS: TestPrallel_3 (3.00s)
PASS
ok      src/test        6.019s
```

## Examples

`testing` パッケージには、Examples という機能があります。これは、実行例をそのままテストコードとして記述する機能で、標準出力の内容をテストできます。
テストするためには、`// Output:` から始まるコメントを記述します。

```go
package main

import "fmt"

func ExampleHello() {
	fmt.Println("Hello")
	// Output: Hello
}
```

通常通り `go test` で実行できます。

```go
go test -v
=== RUN   ExampleHello
--- PASS: ExampleHello (0.00s)
PASS
ok      src/test        0.008s
```

テストの失敗時には `got` と `want` が表示されます。

```go
go test -v
=== RUN   ExampleHello
--- FAIL: ExampleHello (0.00s)
got:
World
want:
Hello
FAIL
exit status 1
FAIL    src/test        0.009s
```

## ベンチマーク

`testing` パッケージでベンチマークを実行できます。
ベンチマークの実行は以下の形式で関数を記述します。

```go
func BenchmarkXxx(*testing.B)
```

基本的な部分は通常のテストとあまり変わりありません。
ベンチマークをとりたい関数を `b.N` 回繰り返しベンチマークの精度をあげます。

```go
package main

import "testing"

func BenchmarkSum(b *testing.B) {
	for i := 0; i < b.N; i++ {
		sum(1, 2)
	}
}
```

ベンチマークを実行する際には、`-bench` オプションで実行したいベンチマークファイルを指定します。すべてのベンチマークファイルを実行するには `.` を指定します。

```go
go test -bench .
goos: darwin
goarch: amd64
BenchmarkSum-4          1000000000               0.612 ns/op
PASS
ok      src/test        0.701s
```

1000000000 回ループが繰り返されて実行されていることを表しています。1 回あたりの処理時間は 0.612 ナノ秒のようです。
機能テストも同時に実行されていることに注意してください。
機能テストを無視したい場合には、オプション `-run` を指定します。このオプションはどの機能テストを実行するか指定するので、どの機能テストとも一致しない名前を指定すればすべてのテストを無視できます。

## TestMainで共通処理を実行

テストデータの投入など、しばしばテストのなかで常に実行したい前処理や後処理を実装したいときがあります。
そのような場合のために、`testing` パッケージは `TestMain` 関数を提供しています。典型的な `TestMain` 関数は次のようになります。

```go
func TestMain(m *testing.M) {
	setUp()
	code := m.Run()
	tearDown()
	os.Exit(code)
}

func setUp() {
	fmt.Println("Set up function")
}

func tearDown() {
	fmt.Println("Tear down function")
} 
```

`setUp` と `tearDown` は慣例的な名前ですので、特に決まりはありません。`setUp` と `tearDown` はすべてのテストケースで 1 回だけ実行されます。個々のテストケースは `m.Run()` によって呼び出されています。関数 `Run` を呼び出すと終了コードが返されるので、関数 `os.Exit` に渡しています。
