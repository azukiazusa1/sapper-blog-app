---
id: ZZ9piCw17Q7WEAsB56j2c
title: "ReactのErrorBoundaryで内部のエラーをキャッチする"
slug: "react-errorboundary"
about: "Error Boundaryとは、自身の子コンポーネントツリーで発生したJavaScriptのエラーをキャッチ・記録しフォールバックのUIを表示するコンポーネントです。  例えるなら、`try/catch`構文を行うコンポーネントのようなものと言えます。"
createdAt: "2021-06-20T00:00+09:00"
updatedAt: "2021-06-20T00:00+09:00"
tags: ["", "React"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2c9EyCXfherkq4ICwfDHaM/13bcad3dd62573b050eb8ad25dce4275/1200px-React-icon.svg.png"
  title: "React"
selfAssessment: null
published: true
---
Error Boundary とは、自身の子コンポーネントツリーで発生した JavaScript のエラーをキャッチ・記録しフォールバックの UI を表示するコンポーネントです。

例えるなら、`try/catch` 構文を行うコンポーネントのようなものと言えます。

!> ErrorBoundary は次のエラーをキャッチできないことに中止してください。

- イベントハンドラ
- 非同期コード（例：setTimeout や requestAnimationFrame のコールバック）
- サーバーサイドレンダリング
- （子コンポーネントではなく）error boundary 自身がスローしたエラー

# エラーがキャッチされない場合の動作

ErrorBoundary の詳細を見る前に、エラーがキャッチされない場合の動作を確認しておきましょう。

React16 からコンポーネントツリー全体がアンマウントされます。

下記の簡単なコードを使って確認してみます。

```js
const Red = () => {
  return (
    <div style={{backgroundColor: "red", flex: 1, height: 100 }}>Red Area</div>
  )
}

const Green = () => {
  return (
    <div style={{backgroundColor: "green", flex: 1 ,height: 100 }}>Green Area</div>
  )
}
const Blue = () => {
  return (
    <div style={{backgroundColor: "blue", flex: 1 ,height: 100}}>Blue Area</div>
  )
}

function App() {
  return (
    <div style={{ display: "flex" }}>
      <Red />
      <Green />
      <Blue />
    </div>
  )
}

export default App;
```

![スクリーンショット 2021-06-20 20.16.22](//images.ctfassets.net/in6v9lxmm5c8/3xZO0rROt5FoBQaKuZ95Vq/8b39663c9543ec4631c8a60fc1416027/____________________________2021-06-20_20.16.22.png)

Red コンポーネント内で恣意的にエラーを発生させます。

```js
const BadComponent = () => { throw new Error("something went wrong") }

const Red = () => {
  return (
    <div style={{backgroundColor: "red", flex: 1, height: 100 }}>
      Red Area
      <BadComponent />
    </div>
  )
}
```

画面が真っ白になってしまいました。

![スクリーンショット 2021-06-20 20.18.33](//images.ctfassets.net/in6v9lxmm5c8/7KMu0PTYqAYx31ijHdGU1x/40fe7eba795371ff3d41e3578b8f2939/____________________________2021-06-20_20.18.33.png)

# Error Boundaryコンポーネントの作成

真っ白な画面が表示されてしまうのはユーザーにとってあまりにも不便ですので、Error Boundary コンポーネントを作成してエラーが発生した際の UI を用意しましょう。

以下いずれかのライフサイクルメソッドを実装したクラスコンポーネントは Error Boundary コンポーネントとして扱われます。

- [static getDerivedStateFromError()](https://ja.reactjs.org/docs/react-component.html#static-getderivedstatefromerror)
- [componentDidCatch()]()

[公式](https://ja.reactjs.org/docs/error-boundaries.html)の Error Boundary コンポーネントの例をそのまま掲載します。

```js
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}
```

### static getDerivedStateFromError

このライフサイクルはフォールバック UI を描画するために使用されます。

`getDerivedStateFromError()` は子孫コンポーネントによってエラーがスローされた際に呼び出されます。パラメーターとしてスローされたエラー受け取り、state を更新するための値を返す必要があります。

### componentDidCatch

このライフサイクルは主にロギングなどの処理に使用されます。

`componentDidCatch` は同じく子孫コンポーネントによってエラーがスローされた際に呼び出されます。
パラメーターとしてスローされたエラーとスタックトレース情報を受け取ります。

### render

`render` メソッドでは、`getDerivedStateFromError` によってエラーをキャッチした状態であるならば、フォールバック UI を描画するようにします。

それ以外の場合には、子要素をそのまま描画します。

# Error Boundaryコンポーネントの配置

## トップレベルに配置

作成した Error Boundary コンポーネントを配置します。
まずはトップレベルに配置してみましょう。その場合には、すべての子孫コンポーネントのエラーをキャッチしてアプリケーション全体にフォールバックの UI が描画されます。

`index.js` を編集します。

```js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ErrorBoundary from './components/ErrorBoundary'

ReactDOM.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
  document.getElementById('root')
);
```

![スクリーンショット 2021-06-20 20.42.12](//images.ctfassets.net/in6v9lxmm5c8/3v1skEolrl9gqA4XWlz6i/0071f510c5c68a6e557cdda77a7dfa82/____________________________2021-06-20_20.42.12.png)

## 個別のコンポーネントに配置

Error Boundary コンポーネントは、個別のコンポーネントずつラップして配置できます。
その場合、エラーが発生したコンポーネント以外の箇所はフォールバックの UI を表示せずにそのままの状態を維持することになります。

```js
const Red = () => {
  return (
    <ErrorBoundary>
      <div style={{backgroundColor: "red", flex: 1, height: 100 }}>
        Red Area
        <BadComponent />
      </div>
    </ErrorBoundary>
  )
}

const Green = () => {
  return (
    <ErrorBoundary>
      <div style={{backgroundColor: "green", flex: 1 ,height: 100 }}>Green Area</div>
    </ErrorBoundary>
  )
}
const Blue = () => {
  return (
    <ErrorBoundary>
      <div style={{backgroundColor: "blue", flex: 1 ,height: 100}}>Blue Area</div>
    </ErrorBoundary>
  )
}
```

今度は Red コンポーネントのみにフォールバック UI が描画されました。

![スクリーンショット 2021-06-20 20.55.32](//images.ctfassets.net/in6v9lxmm5c8/6CMIDmoRcH0sVLiL4zqAsE/e66656278e0f042fd86aa3ecf6f15149/____________________________2021-06-20_20.55.32.png)
