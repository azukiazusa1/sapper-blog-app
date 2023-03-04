---
id: 4jtCLN3uaTewFCLqHtFXHa
title: "AngularJS のチュートリアルを React にリプレイスしてみた③"
slug: "angularjs-react-3"
about: "それではいよいよ、AnguarJS のルーティングモジュールである `ngRoute` を置き換えましょう。この置き換えが完了したら AngularJS を完全に取り除くことができます。"
createdAt: "2022-08-14T00:00+09:00"
updatedAt: "2022-08-14T00:00+09:00"
tags: ["AngularJS", "React"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2c9EyCXfherkq4ICwfDHaM/13bcad3dd62573b050eb8ad25dce4275/1200px-React-icon.svg.png"
  title: "React"
published: true
---
## ルーティングを置き換える

それではいよいよ、AnguarJS のルーティングモジュールである `ngRoute` を置き換えましょう。この置き換えが完了したら AngularJS を完全に取り除くことができます。

React のルーティングライブラリである [React Router](https://reactrouter.com/) をインストールします。現在の React Router の最新バージョンは v6 なのですが、hashbang（`#!`）形式のルーティングを使用したいため、v5 をインストールします。

```sh 
npm install react-router-dom@5
npm install --save-dev @types/react-router-dom@5
```

### ルーティングの設定

`app/App.tsx` ファイルを作成し、ルーティングの設定を行います。

```tsx
import React from 'react';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import PhoneList from './phone-list/PhoneList';
import PhoneDetail from './phone-detail/PhoneDetail';

const App: React.FC = () => {
  const location = useLocation();

  return (
    <TransitionGroup>
      <CSSTransition
        key={location.pathname}
        timeout={1000}
        classNames={{
          appear: 'ng-appear',
          appearActive: 'ng-appear-active',
          appearDone: 'ng-appear-done',
          enter: 'ng-enter',
          enterActive: 'ng-enter-active',
          enterDone: 'ng-enter-done',
          exit: 'ng-leave',
          exitActive: 'ng-leave-active',
          exitDone: 'ng-leave-done'
        }}>
        <div className="view-frame">
          <Switch>
            <Route path="/phones" component={PhoneList} exact />
            <Route path="/phones/:phoneId" component={PhoneDetail} exact />
            <Redirect to="/phones" />
          </Switch>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default App;
```

`<TransitionGroup>` と `<CSSTransition>` は `PhoneItem.tsx` コンポーネントにおいても t ランジションアニメーションを実現するために使用しました。`<TransitionGroup>` は `<Transition>` や `<CSSTransition>` のようなトランジショングループのリストを管理し、複数の要素の追加や削除によりトランジションが発生するようにします。`<CSSTransiton>` コンポーネントは ng-animate と同様にクラスを付与することで CSS トランジションでアニメーションを制御します。これにより AnguarJS のルーティングが変化したときのアニメーションを再現しています。

`<TransitionGroup>` の子要素を識別するための `key` には `location.pathname` で現在ページ URL のパス名を使用しています。`location` は React Router の `useLocation` フックから取得しています。

実際のルーティングの定義は `<Switch>` コンポーネント配下で行っています。`<Switch>` コンポーネントは子要素のルートの中の 1 つのみにマッチするように制御しています。

`<Route>` コンポーネントは `path` で指定したパスにマッチしたときに、`component` で指定したコンポーネントを表示します。通常 `<Route>` コンポーネントはパスに部分一致した場合にも表示されますが、`exact` を指定した場合パスに完全一致した場合のみ表示されるようになります。

最後に `<Redirect>` コンポーネントを配置することで、どのパスにも一致しなかった場合 `/phones` にリダイレクトするようにしています。

作成したコンポーネントは `app/index.tsx` ファイルで使用します。

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import './app.css';
import './app.animations.css';
import { HashRouter } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter hashType="hashbang">
      <App />
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
```

`app/index.tsx` は新たにエントリーポイントとなるファイルです。`ReactDOM.render()` メソッドで React を指定された DOM 要素にマウントしています。さきほどルーティングを設定した `<App>` コンポーネントを `<HashRouter>` でラップしています。`<HashRouter>` は URL Hash を利用したルーティングを提供します。`hashType` に `"hashbang"` を指定することで以前と変わらない形式のルーティング `http://localhost:80000/#!` を使用できます。

続いて、`app/index.html` を修正します。

```diff
  <!doctype html>
- <html lang="en" ng-app="phonecatApp">
+ <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Google Phone Gallery</title>
    </head>
    <body>

      <div id="root" class="view-container">
-       <div ng-view class="view-frame"></div>        
      </div>

    </body>
  </html>
```

`app/index.tsx` でマウント対象の DOM を `document.getElementById('root')` で取得しているので `id="root"` 属性を付与した要素を用意します。また `ng-app` と `ng-view` は AngularJS のための記述なのでこちらも削除します。

エントリーポイントを変更したので、`webpack.config.js` の `entry` を修正します。

```diff
  module.exports = {
    mode: 'development',
    devtool: 'source-map',
-   entry: './app/main.ts',
+   entry: './app/index.tsx',
```

### PhoneList コンポーネントの修正

ルーティングの変更と、ルート要素に AngularJS ではなく React を使うように変更したのでコンポーネントの修正も必要です。まず `PhoneList` コンポーネントでは `react2angular` で AngularJS コンポーネントに変換していた箇所を削除します。

```diff
- import angular from 'angular';
  import React, { useState } from 'react';
- import { react2angular } from 'react2angular';

- angular.module('phoneList').component('phoneList', react2angular(PhoneList, []));
```

テストコードの import も削除しましょう。

```diff
- import 'angular';
- import '../phone-list/phone-list.module';
```

`PhoneItems` コンポーネントでは `<a>` タグを使用していた箇所を React Router の `<Link>` コンポーネントに置き換えます。`<Link>` コンポーネントは `href` の代わりに `to` を使用し、パスにハッシュ（`!#`）を含めないようにします。

```diff
+ import { Link } from 'react-router-dom';

  <li className="thumbnail phone-list-item">
-   <a href={`#!/phones/${phone.id}`} className="thumb">
+   <Link href={`/phones/${phone.id}`} className="thumb">
      <img src={phone.imageUrl} alt={phone.name} />
-   </a>      
+   </Link>
-   <a href={`#!/phones/${phone.id}`}>{phone.name}</a>
+   <Link to={`/phones/${phone.id}`}>{phone.name}</Link>
    <p>{phone.snippet}</p>
  </li>
```

`<Link>` コンポーネントは `<Router>` コンポーネントの配下でしか使用できないので、`PhoneItems` コンポーネントのテストが失敗するようになってしまいます。

```sh
  ● PhoneItems › should render phone items

    Invariant failed: You should not use <Link> outside a <Router>

       6 | describe('PhoneItems', () => {
       7 |   it('should render phone items', () => {
    >  8 |     render(<PhoneItems phones={phones} orderProp="age" />);
         |           ^
       9 |
      10 |     const phoneList = screen.getAllByRole('listitem');
      11 |
```

これを修正するために、`test-utils.tsx` ファイルを修正します。`customRender` に使用する `Wrapper` に `<MemoryRouter>` を追加します。またテストごとに異なるルーティングの設定を行えるように `customRender` で `routeOptions` を受け取るように修正します。

```tsx
import { MemoryRouter, MemoryRouterProps, Route } from 'react-router-dom';

type RouterOptions = {
  initialEntries?: MemoryRouterProps['initialEntries'];
  path?: string;
};

const Wrapper = ({ initialEntries, path = '/' }: RouterOptions = {}) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={initialEntries}>
        <SWRConfig value={{ dedupingInterval: 0 }}>
          <Route path={path}>{children}</Route>
        </SWRConfig>
      </MemoryRouter>
    );
  };

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { routeOptions?: RouterOptions },
  routeOptions?: RouterOptions
) => render(ui, { wrapper: Wrapper(routeOptions), ...options });
```

`app/phone-list/PhoneItmes.spec.tsx` においても `@testing-library/react` の代わりに `test-utils` から import するように修正します。

```diff
- import { render, screen } from '@testing-library>raect':
+ import { render, screen } from '../test-utils';
```

これで PhoneItems コンポーネントについてはテストが PASS するようになったはずです。

### PhoneDetail コンポーネントの修正

まずは `PhoneList` コンポーネントと同様に `react2angular` で AngularJS コンポーネントに変換していた箇所を削除します。

```diff
- import angular from 'angular';
  import React, { useEffect, useState } from 'react';
- import { react2angular } from 'react2angular';

- angular
-  .module('phoneDetail')
-  .component('phoneDetail', react2angular(PhoneDetail, [], ['$routeParams']));
```

`PhoneDetail` コンポーネントではパスパラメータを受け取るために `ngRoute` の `$routeParams` を注入していました。`ngRoute` は使用しないように変更したので Props で `$routeParams` を受け取らないように修正します。React Router において同様にパスパラメータを受け取るためには [useParams](https://v5.reactrouter.com/web/api/Hooks/useparams) フックを使用します。`useParams` はオブジェクトの形式で現在の URL のパスパラメータを返します。

```diff
- type Props = {
-   $routeParams: ng.route.IRouteParamsService;
- };

-  const PhoneDetail: React.FC<Props> = ({ $routeParams }) => {
+  const PhoneDetail: React.FC<Props> = () => {
+   const { phoneId } = useParams<{ phoneId: string }>();
    const [mainImageUrl, setMainImageUrl] = useState('');
    const { phone } = usePhone({
-     phoneId: $routeParams.phoneId
+     phoneId
    });
```

`PhoneDetail` コンポーネントの修正箇所は以上です。続いてテストコードも修正しましょう。`$routeParams` をモックする必要はなくなったので、関連するコードをすべて削除します。

```diff
- import angular from 'angular';
- import 'angular-route';
- import 'angular-mocks';
- import './phone-detail.module';
  import PhoneDetail from './PhoneDetail';

  describe('PhoneList', () => {
-   let $routeParams: ng.route.IRouteParamsService;

-   beforeEach(() => {
-     angular.mock.module('phoneDetail');
-     angular.mock.inject((_$routeParams_) => {
-       $routeParams = _$routeParams_;
-       $routeParams.phoneId = 'nexus-s';
-     });
-   });
```

各テストの `render` 関数では Props で渡していた `$routeParams` を削除します。さらに、`PhoneItems` コンポーネントのテストの修正時に現在のルーティングの設定を渡せるようにしておいたのでこれを利用します。`path` はコンポーネントが描画されるべきルートのパスを指定します。`initialEntries` には [history](https://developer.mozilla.org/ja/docs/Web/API/History) のスタックが渡せるので、現在のパスとして `'phones/nexus-s` を渡しています。

```diff
- render(<PhoneDetail $routeParams={$routeParams} />);
+ render(<PhoneDetail />, undefined, {
+   path: '/phones/:phoneId',
+   initialEntries: ['/phones/nexus-s']
+ });
```

これにより、現在 `/phones/:phoneId` のルートが描画されており、`/phones/neuxs-s` のパスに存在することを表現できるので、`useParams` フックが `{ phoneId: 'nexus-s` }` を返すように固定できます。

すべてのテストケースの修正が完了したら、テストを実行して確認してみましょう。

```sh
npm run test PhoneDetail
```

### 動作の確認

ここまでの修正が完了したら準備 OK です。実際に動作を確認してみましょう。Wepack の設定ファイルを更新したので、すでに `npm run dev` コマンドを実行済の場合には一度停止してから再度コマンドを実行して開発サーバーを立ち上げましょう。

```sh
npm run dev
```

もう AngularJS に依存するコードは存在しないですが、以前と変わりなく動作するはずです。ここで真っ白な画面が表示される場合、`react2angular` のコードどこかに残っている可能性があるので、すべて取り除いてください。

![phoneCatApp](//images.ctfassets.net/in6v9lxmm5c8/7Fp5FBtHUNflNKJBmcGTOV/045fdcde1761eba6e4e3b4cbc2ea42a0/phoneCatApp.gif)

E2E テストも実行してテストが PASS することを確認しましょう。

```sh
npm run e2e
```

テストも PASS することを確認できるかと思います！最後に不要になったパッケージ・ファイルもすべて削除してしまいましょう。

```sh
npm uninstall angular angular-animate jquery react2angular @types/angular-mocks @types/angular-route @types/jquery angular-mocks
```

以下のファイルもすべて削除します。

- `app/main.ts`
- `app/app.animations.js`
- `app/app.config.js`
- `app/phone-list/phone-list.module.js`
- `app/phone-detail/phone-detail.module.js`

パッケージ・ファイルの削除跡には念のためテストを実行しておきましょう。

```sh
npm run test
npm run e2e
```

このテストが PASS すればリプレイス作業はすべて完了です！お疲れさまでした！

ここまでのコミットログは以下のとおりです。

https://github.com/azukiazusa1/angular-phonecat/commit/86c6de50218205702c6e7e839489bd284ddb35f6
