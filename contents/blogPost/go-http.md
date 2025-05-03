---
id: 1T0JPTxjWrIfjqC9m5hXjC
title: "Go 言語　標準パッケージでHTTPサーバー"
slug: "go-http"
about: "Go言語は、標準パッケージでHTTPサーバーと基本的なHTTPクライアントを提供します。 使用するのは、net/httpというパッケージです。"
createdAt: "2020-11-08T00:00+09:00"
updatedAt: "2020-11-08T00:00+09:00"
tags: ["Go"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1D7xedE6EH0DDEbsL2eWlM/52e352d672de9f157c0e2b260e201db2/go-language-icon.png"
  title: "go-http"
audio: null
selfAssessment: null
published: true
---
# はじめに

Go 言語は、標準パッケージで HTTP サーバーと基本的な HTTP クライアントを提供します。
使用するのは、[net/http](https://golang.org/pkg/net/http/)というパッケージです。以下は、もっとも簡単な Web アプリケーションの実装例です。

```go
package main

import (
	"fmt"
	"net/http"
)

func hello(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello")
}

func main() {
	server := http.Server{
		Addr: "127.0.0.1:8080",
	}
	http.HandleFunc("/hello", log(hello))
	server.ListenAndServe()
}
```

個々の関数が、具体的にどのような役割を担っているのか、見ていきましょう。

# `net/http` パッケージの概要

`net/http` は、クライアントとサーバーの両方の実装を提供するパッケージです。各種の構造体や関数がその一方または両方で使用されます。

- クライアント
	- Client
	- Response
	- Header
	- Request
	- Cookie
- サーバー
	- Server
	- ServeMux
	- Handler/HandlerFunc
	- ResponseWriter
	- Header
	- Request
	- Cookie

クライアントの実装は例えば次のように簡単な GET リクエストを送信できます。

```go
package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
)

func main() {
	resp, err := http.Get("http://example.com/")
	if err != nil {
		return
	}

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return
	}
	fmt.Println(string(body))
}
```

しかし、今回はクライアント機能よりもサーバー機能に焦点を合わせているので、これ以上は深くは関わりません。

# Server構造体

Server 構造体を用いて、サーバーの設定を変更できます。
はじめの例においては、`Addr` というフィールドを用いてホスト名とポート番号を設定していました。

```go
server := http.Server{
	Addr: "127.0.0.1:8080",
}
```

Server 構造体の構成は以下のとおりです。

```go
type Server struct {
	Addr string

	Handler Handler

	TLSConfig *tls.Config

	ReadTimeout time.Duration

	ReadHeaderTimeout time.Duration

	WriteTimeout time.Duration

	IdleTimeout time.Duration

	MaxHeaderBytes int

	TLSNextProto map[string]func(*Server, *tls.Conn, Handler)

	ConnState func(net.Conn, ConnState)

	ErrorLog *log.Logger

	BaseContext func(net.Listener) context.Context

	ConnContext func(ctx context.Context, c net.Conn) context.Context
}
```

設定内容はタイムアウトの設定やエラー出力、後に出てくるハンドラの設定などです。

## Server.ListenAndServe

```go
func (srv *Server) ListenAndServe() error
```

HTTP リクエストを受け取るには、Server 構造体の `ListenAndServe` メソッドを使用します。
ListenAndServe は常に `nil` 以外のエラーを返します。シャットダウンまたは終了後,返されるエラーは `ErrServerClosed` です。

## Server.ListenAndServeTLS

`ListenAndServeTLS` メソッドは、HTTPS によるサーバー間の通信の暗号化を提供します。それ以外の機能は `ListenAndServe` と変わりありません。

サーバー構造体の `TLSConfig.Certificates` と `TLSConfig.GetCertificate` が入力されていない場合は、サーバーの証明書と一致する秘密鍵を含むファイル名を指定する必要があります。

```go
server := http.Server{
	Addr:    "127.0.0.1:8080",
}
server.ListenAndServeTLS("cert.pem", "key.pem") 
// cert.pemとkey.pemを同一ディレクトリ内に設置
```

# ListenAndServe関数

```go
func ListenAndServe(addr string, handler Handler) error
```

Sever に細かい設定が必要ないのなら単純に `http.ListenAndServe` 関数を用いることができます。
`ListenAndServe` はサーバーのアドレスとハンドラを受け取ります。
ハンドラに `nil` を渡した場合には、デフォルトのハンドラである `DefaultServeMux` が使用されます。

```go
package main

import (
	"io"
	"net/http"
)

func main() {
	helloHandler := func(w http.ResponseWriter, r *http.Request) {
		io.WriteString(w, "Hello, world!\n")
	}

	http.HandleFunc("/hello", helloHandler)
	http.ListenAndServe(":8080", nil)
}
```

# Handler構造体

しばしば説明の中で出てきたハンドラとはなんでしょうか。
ハンドラとはずばり、`ServeHTTP` というメソッドを持ったインターフェースです。このメソッドはインターフェース `HTTPResponseWriter` と構造体 `Request` へのポインタという 2 つにの引数を取ります。

```go
type Handler interface {
    ServeHTTP(ResponseWriter, *Request)
}
```

この `ServeHTTP` というメソッドを実装してさえいれば、ハンドラとなることができます。当然ながら、ハンドラのデフォルト値として使用される `DefaultServeMux` も `ServeHTTP` メソッドを実装しています。ただし、これは特殊なタイプのハンドラで、与えられた URL に応じてリクエストを各種ハンドラに転送できます。

`ServeHTTP` メソッド内では、ヘッダとデータを `ResponseWriter` に書き込み return する必要があります。

以下の例は、独自のハンドラを用いて実装しています。

```go
package main

import (
	"fmt"
	"net/http"
)

type MyHandler struct{}

func (h *MyHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello world")
}

func main() {
	handler := MyHandler{}
	server := http.Server{
		Addr:    "127.0.0.1:8080",
		Handler: &handler,
	}
	server.ListenAndServe()
}
```

しかし、この場合にはどの URL にアクセスしたとしても（例えば `http://localhost:8080/` や `http://localhost:8080/hello`）常におなじ結果が返されることでしょう。大抵の場合には URL に応じた結果を返したいはずなので、通常はデフォルトの `DefaultServeMux` を使用することになります。

# HandleFunc関数

ハンドラは `ServeHTTP` を持つインターフェースですが、ハンドラ関数はハンドラのように振る舞い関数です。第一引数にはリクエストを処理するパス名を受け取り、第 2 引数はハンドラ関数は `ServeHTTP` と同じく `ResponseWriter` と `Request` を引数に受け取る関数を受け取ります。

```go
func HandleFunc(pattern string, handler func(ResponseWriter, *Request))
```

次の例はハンドラ関数でリクエストを処理します。

```go
package main

import (
	"fmt"
	"net/http"
)

func hello(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello")
}

func main() {
	server := http.Server{
		Addr: "127.0.0.1:8080",
	}
	http.HandleFunc("/hello", hello)
	server.ListenAndServe()
}
```

# HandlerFunc

`HandlerFunc` は、`HandleFunc` と名前がよく似ていて間際らしいですが、こちらは関数の**型**です。

```go
type HandlerFunc func(ResponseWriter, *Request)
```

`HandlerFunc` という型は、メソッド `ServeHTTP` を実装しています。
そのメソッドないでは、自身の関数 `f` をただ呼び出しているだけです。

```go
func (f HandlerFunc) ServeHTTP(w ResponseWriter, r *Request) {
    f(w, r)
}
```

ですので、さきほど使用したハンドラ関数を `HandlerFunc` 型にキャストすればそれ自身をハンドラとして使用することも可能です。

```go
package main

import (
	"fmt"
	"net/http"
)

func hello(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello")
}

func main() {
	handler := http.HandlerFunc(hello)
	server := http.Server{
		Addr:    "127.0.0.1:8080",
		Handler: handler,
	}
	server.ListenAndServe()
}
```

## HandleFuncをもっと詳しく知る

このことは、`HandlerFunc` 関数が実際になにをしているか知ることの手がかりになります。
`HandleFunc` の実装は以下のとおりです。

```go
func HandleFunc(pattern string, handler func(ResponseWriter, *Request)) {
	DefaultServeMux.HandleFunc(pattern, handler)
}
```

`DefaultServeMux` はデフォルトで使用される `ServeMux` です。`HandleFunc` は `ServeMux` がもつ `HandleFunc` のラッパー関数であることがわかりました。さらに処理を追ってきます。

```go
func (mux *ServeMux) HandleFunc(pattern string, handler func(ResponseWriter, *Request)) {
	if handler == nil {
		panic("http: nil handler")
	}
	mux.Handle(pattern, HandlerFunc(handler))
}
```

`ServeMux` がもつ `HandleFunc` もまた `ServeMux.Handle` のラッパーです。注目すべき箇所は、`HandlerFunc(handler)` と渡されたハンドラ関数が `HandlerFunc` への型変換によってハンドラとして登録されていることです。つまり、ハンドラ関数も結局は実際のハンドラに変換されて使用されているのです。

ちなみに、`ServeMux.Handle` の実装は以下のとおりです。
パスとハンドラーを受け取り、マッピングを登録しています。
すでに同じパスが登録されていた場合には `panic` をおこします。

```go
func (mux *ServeMux) Handle(pattern string, handler Handler) {
	mux.mu.Lock()
	defer mux.mu.Unlock()

	if pattern == "" {
		panic("http: invalid pattern")
	}
	if handler == nil {
		panic("http: nil handler")
	}
	if _, exist := mux.m[pattern]; exist {
		panic("http: multiple registrations for " + pattern)
	}

	if mux.m == nil {
		mux.m = make(map[string]muxEntry)
	}
	e := muxEntry{h: handler, pattern: pattern}
	mux.m[pattern] = e
	if pattern[len(pattern)-1] == '/' {
		mux.es = appendSorted(mux.es, e)
	}

	if pattern[0] != '/' {
		mux.hosts = true
	}
}
```

# 参考
[Package http](https://golang.org/pkg/net/http/)
[GoのHTTPサーバーの実装](https://tutuz-tech.hatenablog.com/entry/2020/03/23/162831)
[Goのhttp.Handlerやhttp.HandlerFuncをちゃんと理解する](https://journal.lampetty.net/entry/understanding-http-handler-in-go)
