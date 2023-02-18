---
id: 6PJwVyCBYkVcL0Yeerg69k
title: "AngularJS のチュートリアルを React にリプレイスしてみた②"
slug: "angularjs-react-2"
about: "AngularJS のチュートリアルを React にリプレイスします。今回の記事では AngularJS のコンポーネントをすべてリプレイスして、angular-resorce の代わりに API クライアントを実装します。"
createdAt: "2022-08-07T00:00+09:00"
updatedAt: "2022-08-07T00:00+09:00"
tags: ["AngularJS", "React"]
published: true
---
## 詳細ページを React コンポーネントにする

電話の詳細を表示するページを React へ移行しましょう。まずは `PhoneDetail` の型定義を作成します。`app/phone-detail/types.ts` ファイルを作成しましょう。

```ts
export type Android = {
  os: string;
  ui: string;
};

export type Battery = {
  standbyTime: string;
  talkTime: string;
  type: string;
};

export type Camera = {
  features: string[];
  primary: string;
};

export type Connectivity = {
  bluetooth: string;
  cell: string;
  gps: boolean;
  infrared: boolean;
  wifi: string;
};

export type Display = {
  screenResolution: string;
  screenSize: string;
  touchScreen: boolean;
};

export type Hardware = {
  accelerometer: boolean;
  audioJack: string;
  cpu: string;
  fmRadio: boolean;
  physicalKeyboard: boolean;
  usb: string;
};

export type SizeAndWeight = {
  dimensions: string[];
  weight: string;
};

export type Storage = {
  flash: string;
  ram: string;
};

export type PhoneDetail = {
  additionalFeatures: string;
  android: Android;
  availability: string[];
  battery: Battery;
  camera: Camera;
  connectivity: Connectivity;
  description: string;
  display: Display;
  hardware: Hardware;
  id: string;
  images: string[];
  name: string;
  sizeAndWeight: SizeAndWeight;
  storage: Storage;
};
```

さて、対象の詳細ページの以下のとおりになっています。サムネイルを表示する部分と、スペックを表示する部分でコンポーネントを分割して実装しましょう。

![スクリーンショット 2022-08-04 8.29.34](//images.ctfassets.net/in6v9lxmm5c8/5PO0MOjDVVk2Ub4ndD3qIW/482c8710cead7e6ee1f567330f211f67/____________________________2022-08-04_8.29.34.png)

### Specification コンポーネント

まずはスペックを表示する部分のコンポーネントです。元のテンプレートは以下のようになっています。

```html
<ul class="specs">
  <li>
    <span>Availability and Networks</span>
    <dl>
      <dt>Availability</dt>
      <dd ng-repeat="availability in $ctrl.phone.availability">{{availability}}</dd>
    </dl>
  </li>
  <li>
    <span>Battery</span>
    <dl>
      <dt>Type</dt>
      <dd>{{$ctrl.phone.battery.type}}</dd>
      <dt>Talk Time</dt>
      <dd>{{$ctrl.phone.battery.talkTime}}</dd>
      <dt>Standby time (max)</dt>
      <dd>{{$ctrl.phone.battery.standbyTime}}</dd>
    </dl>
  </li>
  <li>
    <span>Storage and Memory</span>
    <dl>
      <dt>RAM</dt>
      <dd>{{$ctrl.phone.storage.ram}}</dd>
      <dt>Internal Storage</dt>
      <dd>{{$ctrl.phone.storage.flash}}</dd>
    </dl>
  </li>
  <li>
    <span>Connectivity</span>
    <dl>
      <dt>Network Support</dt>
      <dd>{{$ctrl.phone.connectivity.cell}}</dd>
      <dt>WiFi</dt>
      <dd>{{$ctrl.phone.connectivity.wifi}}</dd>
      <dt>Bluetooth</dt>
      <dd>{{$ctrl.phone.connectivity.bluetooth}}</dd>
      <dt>Infrared</dt>
      <dd>{{$ctrl.phone.connectivity.infrared | checkmark}}</dd>
      <dt>GPS</dt>
      <dd>{{$ctrl.phone.connectivity.gps | checkmark}}</dd>
    </dl>
  </li>
  <li>
    <span>Android</span>
    <dl>
      <dt>OS Version</dt>
      <dd>{{$ctrl.phone.android.os}}</dd>
      <dt>UI</dt>
      <dd>{{$ctrl.phone.android.ui}}</dd>
    </dl>
  </li>
  <li>
    <span>Size and Weight</span>
    <dl>
      <dt>Dimensions</dt>
      <dd ng-repeat="dim in $ctrl.phone.sizeAndWeight.dimensions">{{dim}}</dd>
      <dt>Weight</dt>
      <dd>{{$ctrl.phone.sizeAndWeight.weight}}</dd>
    </dl>
  </li>
  <li>
    <span>Display</span>
    <dl>
      <dt>Screen size</dt>
      <dd>{{$ctrl.phone.display.screenSize}}</dd>
      <dt>Screen resolution</dt>
      <dd>{{$ctrl.phone.display.screenResolution}}</dd>
      <dt>Touch screen</dt>
      <dd>{{$ctrl.phone.display.touchScreen | checkmark}}</dd>
    </dl>
  </li>
  <li>
    <span>Hardware</span>
    <dl>
      <dt>CPU</dt>
      <dd>{{$ctrl.phone.hardware.cpu}}</dd>
      <dt>USB</dt>
      <dd>{{$ctrl.phone.hardware.usb}}</dd>
      <dt>Audio / headphone jack</dt>
      <dd>{{$ctrl.phone.hardware.audioJack}}</dd>
      <dt>FM Radio</dt>
      <dd>{{$ctrl.phone.hardware.fmRadio | checkmark}}</dd>
      <dt>Accelerometer</dt>
      <dd>{{$ctrl.phone.hardware.accelerometer | checkmark}}</dd>
    </dl>
  </li>
  <li>
    <span>Camera</span>
    <dl>
      <dt>Primary</dt>
      <dd>{{$ctrl.phone.camera.primary}}</dd>
      <dt>Features</dt>
      <dd>{{$ctrl.phone.camera.features.join(', ')}}</dd>
    </dl>
  </li>
  <li>
    <span>Additional Features</span>
    <dd>{{$ctrl.phone.additionalFeatures}}</dd>
  </li>
</ul>
```

`ng-reapeat` でループ処理をしている部分は `Array#map` に置き換えれば問題ないでしょう。少しやっかいなのは `{{$ctrl.phone.connectivity.infrared | checkmark}}` のように `checkmark` フィルターを使用しているところです。AngularJS のフィルタ自体は通常の関数呼び出しで置き換えできますが、`checkmark` フィルターはユーザーによって定義されたカスタムフィルタです（`app/core/checkmark/checkmark.filter.js` に実装があります）。

`checkmark` フィルタ自体は単純な実装なのでそのまま関数に置き換えることも可能ですが、練習のためカスタムフィルタを React コンポーネントに注入する形で実装してみましょう。

`app/phone-detail/Specitfication.tsx` ファイルを作成します。

```tsx
import angular from 'angular';
import React from 'react';
import { react2angular } from 'react2angular';
import { PhoneDetail } from './types';

type Props = {
  phone: PhoneDetail;
  $filter: ng.IFilterService;
};

const Specifiction: React.FC<Props> = ({ phone, $filter }) => {
  const checkmark = $filter('checkmark') as (input: boolean) => string;

  return (
    <ul className="specs">
      <li>
        <span>Availability and Networks</span>
        <dl>
          <dt>Availability</dt>
          {phone.availability.map((availability) => (
            <dd key={availability}>{availability}</dd>
          ))}
        </dl>
      </li>
      <li>
        <span>Battery</span>
        <dl>
          <dt>Type</dt>
          <dd>{phone.battery.type}</dd>
          <dt>Talk Time</dt>
          <dd>{phone.battery.talkTime}</dd>
          <dt>Standby time (max)</dt>
          <dd>{phone.battery.standbyTime}</dd>
        </dl>
      </li>
      <li>
        <span>Storage and Memory</span>
        <dl>
          <dt>RAM</dt>
          <dd>{phone.storage.ram}</dd>
          <dt>Internal Storage</dt>
          <dd>{phone.storage.flash}</dd>
        </dl>
      </li>
      <li>
        <span>Connectivity</span>
        <dl>
          <dt>Network Support</dt>
          <dd>{phone.connectivity.cell}</dd>
          <dt>WiFi</dt>
          <dd>{phone.connectivity.wifi}</dd>
          <dt>Bluetooth</dt>
          <dd>{phone.connectivity.bluetooth}</dd>
          <dt>Infrared</dt>
          <dd>{phone.connectivity.infrared}</dd>
          <dt>GPS</dt>
          <dd>{checkmark(phone.connectivity.gps)}</dd>
        </dl>
      </li>
      <li>
        <span>Android</span>
        <dl>
          <dt>OS Version</dt>
          <dd>{phone.android.os}</dd>
          <dt>UI</dt>
          <dd>{phone.android.ui}</dd>
        </dl>
      </li>
      <li>
        <span>Size and Weight</span>
        <dl>
          <dt>Dimensions</dt>
          {phone.sizeAndWeight.dimensions.map((dim) => (
            <dd key={dim}>{dim}</dd>
          ))}
          <dt>Weight</dt>
          <dd>{phone.sizeAndWeight.weight}</dd>
        </dl>
      </li>
      <li>
        <span>Display</span>
        <dl>
          <dt>Screen size</dt>
          <dd>{phone.display.screenSize}</dd>
          <dt>Screen resolution</dt>
          <dd>{phone.display.screenResolution}</dd>
          <dt>Touch screen</dt>
          <dd>{checkmark(phone.display.touchScreen)}</dd>
        </dl>
      </li>
      <li>
        <span>Hardware</span>
        <dl>
          <dt>CPU</dt>
          <dd>{phone.hardware.cpu}</dd>
          <dt>USB</dt>
          <dd>{phone.hardware.usb}</dd>
          <dt>Audio / headphone jack</dt>
          <dd>{phone.hardware.audioJack}</dd>
          <dt>FM Radio</dt>
          <dd>{checkmark(phone.hardware.fmRadio)}</dd>
          <dt>Accelerometer</dt>
          <dd>{checkmark(phone.hardware.accelerometer)}</dd>
        </dl>
      </li>
      <li>
        <span>Camera</span>
        <dl>
          <dt>Primary</dt>
          <dd>{phone.camera.primary}</dd>
          <dt>Features</dt>
          <dd>{phone.camera.features.join(', ')}</dd>
        </dl>
      </li>
      <li>
        <span>Additional Features</span>
        <dd>{phone.additionalFeatures}</dd>
      </li>
    </ul>
  );
};
```

Props には API から種取得した電話詳細情報と `$filter` を受け取ります。`$filter` は AngularJS のサービスで、フィルターをテンプレート内以外のコントローラーやサービスなどの場所で使用するために Dependency Ingection されるサービスです。フィルターを React コンポーネント内で使用するために Props として渡しています。

```ts
type Props = {
  phone: PhoneDetail;
  $filter: ng.IFilterService;
};
```

`$filter(フィルター名)` のように呼び出すと引数で指定したフィルター名の関数が返されます。ここでは `charkmark` フィルターを呼び出し結果を変数に代入して後ほど jsx 内で使用しています。

```ts
const checkmark = $filter('checkmark') as (input: boolean) => string;
```

テンプレート内の変更部分としては、`ng-repeat` は `AArray#map` に置き換えるのと

```diff
  <dl>
    <dt>Availability</dt>
-    <dd ng-repeat="availability in $ctrl.phone.availability">{{availability}}</dd>
+    {phone.availability.map((availability) => (
+      <dd key={availability}>{availability}</dd>
+    ))}
  </dl>
```

`checmark` フィルターを呼び出していた箇所を通常の関数呼び出しに変更しています。

```diff
  <dt>GPS</dt>
- <dd>{{$ctrl.phone.connectivity.gps | checkmark}}</dd>  
+ <dd>{checkmark(phone.connectivity.gps)}</dd>
```

最後に、react2angular で AngularJS のコンポーネントに変換します。Props として第2引数に `phone` を渡すのと、注入 するために第3引数に `$filter` 渡す必要があります。

```ts
angular
  .module('phoneDetail')
  .component('specification', react2angular(Specifiction, ['phone'], ['$filter']));
```

export default Specifiction;

angular
  .module('phoneDetail')
  .component('specification', react2angular(Specifiction, ['phone'], ['$filter']));
```

`app/main.ts` で追加したモジュールを import しましょう。

```diff
+ import './phone-detail/Specifiction';
```

`app/phone-detail/phone-detail.template.html` では元の HTML を　`Specification` コンポーネントを使用するように置き換えます。

```html
<specification ng-if="$ctrl.phone.$resolved" phone="$ctrl.phone"></specification> 
```

`$ctrl.phone` は AngularJS の resource による　API コールが完了するまで期待して `Phone` 型が代入されていないので、`$ctrl.phone.$resolved` が `true` になり API コールが完了するまで `ng-if` で表示を制御しています。

ここまで完了したら、E2E テストを実行して何かを壊してしまっていないか確認してみましょう。

```sh
npm run e2e
```

ここまでのコミットは以下のとおりです。

https://github.com/azukiazusa1/angular-phonecat/commit/ad27b1efd643e5c453c1cac6524eb8cc970318da

### `checkmark` サービスを置き換える

React コンポーネントに移行したものの、依然として `$filter` という AngularJS への依存が残っています。この箇所を AngularJS に依存しない形に置き換えていきましょう。

`app/core/checkmark/checkmark.ts` ファイルを作成します。

```ts
export const checkmark = (input: boolean) => {
  return input ? '\u2713' : '\u2718';
};
```

ファイルの中身としては、単純に `app/core/checkmark/checkmark.filter.js` の関数を抜粋したものとなっています。AngularJS のフィルターサービスとして関数を登録する代わりにモジュールとして関数を公開するようにしました。

テストコードも飽きましょう。`app/core/checkmark/checmark.spec.ts` ファイル作成します。

```ts
import { checkmark } from './checkmark';

describe('checkmark', () => {
  it('should convert boolean values to unicode checkmark or cross', () => {
    expect(checkmark(true)).toBe('\u2713');
    expect(checkmark(false)).toBe('\u2718');
  });
});
```

`checkmark` は純粋な関数ですので、難しいことを考える必要なくテストが書けますね。

それでは、`app/phone-details/Specification.tsx` で `filter` を注入する代わりに、作成した `checkmark` 関数を import して利用するように修正しましょう。

```diff
  import angular from 'angular';
  import React from 'react';
  import { react2angular } from 'react2angular';
  import { PhoneDetail } from './types';
+ import { checkmark } from '../core/checkmark/checkmark';

  type Props = {
    phone: PhoneDetail;
-   $filter: ng.IFilterService;
  };

- const Specifiction: React.FC<Props> = ({ phone, $filter }) => {
+ const Specifiction: React.FC<Props> = ({ phone, $filter }) => {

-   const checkmark = $filter('checkmark') as (input: boolean) => string;

    return (
      <ul className="specs">
        {/* ... */}
      </ul>
    )
  };

  export default Specifiction;

  angular
    .module('phoneDetail')
-   .component('specification', react2angular(Specifiction, ['phone'], ['$filter']));
+   .component('specification', react2angular(Specifiction, ['phone']));
```

修正前後で見た目に変化はないか確認しておきましょう。さらに、`checkmark` ファイルターが他の場所でも使われていないかどうか確認し、もう使われないことがわかったらファイルを削除してしまいましょう。

```sh
rm app/core/checkmark/checkmark.filter.js
rm app/core/checkmark/checkmark.filter.spec.js
```

`app/main.ts` の import も削除します。

```diff
- import './core/checkmark/checkmark.filter';
```

最後に e2e テストを実行して確認しましょう。

```sh
npm run e2e
```

ここまでのコミットログは以下のとおりです。

https://github.com/azukiazusa1/angular-phonecat/commit/863506cc586385c66264af473860201bd76661a7

### PhoneImages コンポーネント

続いて、サムネイル一覧を表示している箇所を React コンポーネントに置き換えます。テンプレートでは以下の部分です。

```html
<div class="phone-images">
  <img ng-src="{{img}}" class="phone"
      ng-class="{selected: img === $ctrl.mainImageUrl}"
      ng-repeat="img in $ctrl.phone.images" />
</div>

<h1>{{$ctrl.phone.name}}</h1>

<p>{{$ctrl.phone.description}}</p>

<ul class="phone-thumbs">
  <li ng-repeat="img in $ctrl.phone.images">
    <img ng-src="{{img}}" ng-click="$ctrl.setImage(img)" />
  </li>
</ul>
```

`<div class="phone-images">` はメインとなる画像を表示している箇所です。ここでは `ng-repeat` のループ処理で電話の画像をすべて表示し、現在選択されている画像（`$ctrl.mainImageUrl`）と一致する場合には `.selected` クラスを付与して表示されるようにしています。

すべての画像を表示しているにはアニメーション処理を行うためです。`.selected` クラスが要素に追加されると、AngularJS にアニメーションを起動するよう合図します。`.selected` クラスが要素から削除されるとクラスが要素に適用され、別のアニメーションが開始されます。

アニメーションを実現しているコードは `app/app.animations.js` にあります。ここでは `ngAnimate` モジュールによる `animation()` メソッドでアニメーションを登録しています。React コンポーネントに置き換えるとこの `animation()` メソッドは使えなくなるので他の方法でアニメーションを実現する必要があります。

```js
'use strict';

angular.module('phonecatApp').animation('.phone', function phoneAnimationFactory() {
  return {
    addClass: animateIn,
    removeClass: animateOut
  };

  function animateIn(element, className, done) {
    if (className !== 'selected') return;

    element
      .css({
        display: 'block',
        position: 'absolute',
        top: 500,
        left: 0
      })
      .animate(
        {
          top: 0
        },
        done
      );

    return function animateInEnd(wasCanceled) {
      if (wasCanceled) element.stop();
    };
  }

  function animateOut(element, className, done) {
    if (className !== 'selected') return;

    element
      .css({
        position: 'absolute',
        top: 0,
        left: 0
      })
      .animate(
        {
          top: -500
        },
        done
      );

    return function animateOutEnd(wasCanceled) {
      if (wasCanceled) element.stop();
    };
  }
});
```

詳しい説明は省きますが、`animateIn` 関数は `.selected` クラスが付与された際のアニメーションを、`animateOut` 関数は `.selected` クラスが削除された時のアニメーションを jQuery の `animate()` メソッドで定義しています。

続いて `<ul class="phone-thumbs">` はサムネイル画像の一覧を `ng-repeat` で表示しています。サムネイル画像がクリックされた時 AngularJS のイベントハンドラである `ng-click` が発火し、`$ctrl.setImage` 関数で現在選択されている画像を更新します。

概要を把握したところで React コンポーネントを作成しましょう。まずはアニメーションを再現するために使用するライブラリをインストールします。[Framer Motion](https://www.framer.com/motion/) はたくさんの API が提供されており、基本的なアニメーションを簡単に実装できます。

```sh
npm i framer-motion@^6.5.1
```

続いて `app/phone-detail/PhoneImages.tsx` ファイルを作成します。

```tsx
import angular from 'angular';
import React from 'react';
import { react2angular } from 'react2angular';
import { PhoneDetail } from './types';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  phone: PhoneDetail;
  mainImageUrl: string;
  setImage: (imageUrl: string) => void;
};

const PhoneImages: React.FC<Props> = ({ phone, mainImageUrl, setImage }) => {
  return (
    <>
      <div className="phone-images">
        <AnimatePresence initial={false}>
          <motion.img
            src={mainImageUrl}
            key={mainImageUrl}
            className="phone selected"
            data-testid="main-image"
            transition={{ duration: 0.5 }}
            style={{ display: 'block', position: 'absolute', top: 500, left: 0 }}
            animate={{ top: 0 }}
            exit={{
              top: -500
            }}
          />
        </AnimatePresence>
      </div>

      <h1>{phone.name}</h1>

      <p>{phone.description}</p>

      <ul className="phone-thumbs">
        {phone.images.map((image) => (
          <li key={image}>
            <img key={image} src={image} onClick={() => setImage(image)} />
          </li>
        ))}
      </ul>
    </>
  );
};

export default PhoneImages;

angular
  .module('phoneDetail')
  .component('phoneImages', react2angular(PhoneImages, ['phone', 'mainImageUrl', 'setImage']));

```

メイン画像を表示している箇所は大きく変更しています。`ng-repeat` すべての画像を表示する代わりに [AnimatePresence](https://www.framer.com/docs/animate-presence/) コンポーネントでアニメーション対象の要素をラップしています。`AnimatePresence` はコンポーネントがReact ツリーから取り除かれる時にアニメーションを有効にします。React ではコンポーネントのキーを変更すると全く新しいコンポーネントとして扱われるため、`AnimatePresence` の子要素のキーを変更することで、元のスライドショーのようなアニメーションを簡単に作ることができます。`initial` Props に `false` を渡すことで初回のみアニメーションを無効にすることができます。

アニメーション対象の要素は `<motion>` コンポーネントを使用します。`<motion>` コンポーネントにアニメーション用の Props を渡すことでアニメーションを実装できます。

- `animate`：アニメーション
- `transition`：トランジションのプロパティ
- `exit`：コンポーネントが取り除かれる時のアニメーション

```tsx
<div className="phone-images">
  <AnimatePresence initial={false}>
    <motion.img
      src={mainImageUrl}
      key={mainImageUrl}
      className="phone selected"
      data-testid="main-image"
      style={{ display: 'block', position: 'absolute', top: 500, left: 0 }}
      animate={{ top: 0 }}
      exit={{
        top: -500
      }}
      transition={{ duration: 0.5 }}
    />
  </AnimatePresence>
</div>
```

サムネイル一覧では Props` の `setImage` 関数を呼び出すようにしています。`setImage` Props は AngularJS のコントローラーの関数が渡される想定です。

```tsx
<ul className="phone-thumbs">
  {phone.images.map((image) => (
    <li key={image}>
      <img key={image} src={image} onClick={() => setImage(image)} />
    </li>
  ))}
</ul>
```

最後に、いつものとおり `react2angular` で AngularJS のコンポーネントに変換します。

```ts
angular
  .module('phoneDetail')
  .component('phoneImages', react2angular(PhoneImages, ['phone', 'mainImageUrl', 'setImage']));
```

`app/main.ts` に import を追加してこのコンポーネントを使用できるようにしましょう。

```diff
+ import './phone-detail/PhoneImags';
```

テンプレートも `phoneImages` コンポーネントを使用するように置き換えます。

```diff
- <div class="phone-images">
-   <img ng-src="{{img}}" class="phone"
-       ng-class="{selected: img === $ctrl.mainImageUrl}"
-       ng-repeat="img in $ctrl.phone.images" />
- </div>
- 
- <h1>{{$ctrl.phone.name}}</h1>
- 
- <p>{{$ctrl.phone.description}}</p>
- 
- <ul class="phone-thumbs">
-   <li ng-repeat="img in $ctrl.phone.images">
-     <img ng-src="{{img}}" ng-click="$ctrl.setImage(img)" />
-   </li>
- </ul>

+ <phone-images ng-if="$ctrl.phone.$resolved" phone="$ctrl.phone" main-image-url="$ctrl.mainImageUrl"
+   set-image="$ctrl.setImage">
+ </phone-images>
```

ここまでの作業が完了したら一度動作を確認してみましょう。実際に試してみると正しく描画はされているのですが、サムネイルをクリックしてみても画像が切り替わりません。`setImage` 関数に `console.log` を仕込んでみると正しく呼ばれているはずなのですが、なぜ画像が切り替わらないのでしょうか？

![setImage not working](//images.ctfassets.net/in6v9lxmm5c8/1vAT5yw47yN2Ig3xGRdFxS/44683290b8d381cb46436cf38a4111b0/setImage_not_working.gif)

これは、AngularJS の管轄外で `mainImageUrl` を更新したためです。AngularJS は内部でコントローラーの保持する変数を監視して、その変更に応じてビューを更新する手続きをとっていましたが、`setImage` 関数は React コンポーネント内で呼ばれているため AngularJS はその変更を監視できていませんでした。

これを修正するためには、`setImage` 関数を呼び出した時にビューを強制的に更新する必要があります。強制的にビューを変更するにはよく `$timeout` サービスが使われます。`$timeout` サービスは `setTimeout` のラッパーなのですが、コールバック関数内で行われた変更は AngularJS に伝えられます。

`app/phone-detail/phone-detail-component.js` を修正して `$timeout` サービスを使うように修正しましょう。

```diff
  angular.module('phoneDetail').component('phoneDetail', {
    template,
     controller: [
+     '$timeout',
      '$routeParams',
      'Phone',
-     function PhoneDetailController($routeParams, Phone) {
+     function PhoneDetailController($timeout, $routeParams, Phone) {
        var self = this;
        self.phone = Phone.get({ phoneId: $routeParams.phoneId }, function (phone) {
+         self.setImage(phone.images[0]);          
-         self.mainImageUrl = phone.images[0];
        });

        self.setImage = function setImage(imageUrl) {
-         self.mainImageUrl = imageUrl;
+         $timeout(function () {
+           self.mainImageUrl = imageUrl;
+         });
        };
      }
    ]
  });
```

アノテーションに `$timeout` サービスを追加して、`$timeout` サービスを使用することを伝えます。コントローラーの引数で `$timeout` サービスを受け取りましょう。後は `setImage` 関数内で `self.mainImageUrl` に代入する箇所を `$timeout` でラップするだけど OK です。なお、API コールが完了した後に `setImage` 関数を呼び出す箇所がありますが、ここでは即座に変更を反映してほしいので `setImage` 関数を使わないように修正しています。

実際に動かして確認してみましょう。正しく画像の選択とアニメーションが機能しているはずです。

![setImage](//images.ctfassets.net/in6v9lxmm5c8/4psbzraC8ttRpxr9Yni29R/8b60d39bfd4a602c878d8cad4c1b925f/setImage.gif)

e2e テストを実行する前にテストの内容を少し修正します。サムネイルをクリックした時のテストにおいてアニメーションが完了するまでの間 `.selected` が付与される要素が、新たに追加される要素と削除される要素の2つになってしまったので、クリックしてからアニメーションの完了を待つようにします。

```diff
  test('should swap main image if a thumbnail is clicked', async ({ page }) => {
    const mainImage = page.locator('img.selected');
    const thumbnails = page.locator('role=listitem').locator('role=img');

    await thumbnails.nth(2).click();
+   await page.waitForTimeout(1000);
    expect(mainImage).toHaveAttribute('src', 'img/phones/nexus-s.2.jpg');

    await thumbnails.first().click();
+   await page.waitForTimeout(1000);
    expect(mainImage).toHaveAttribute('src', 'img/phones/nexus-s.0.jpg');
  });
```

修正が完了したら、e2e テストを実行して問題がないか確認しましょう。

 ```sh
 npm run e2e
 ```

#### PhoneImags コンポーネントのテスト

コンポーネントのテストも作成しましょう。メイン画像に `mainImageUrl` Props で渡した値を使用しているか、サムネイル画像がクリックした時 `setImage` Props が正しく呼ばれるかをテストします。

`app/phone-detail/PhoneImages.spec.tsx` ファイルを作成します。

```tsx
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import 'angular';
import './phone-detail.module';
import PhoneImages from './PhoneImags';
import nexusS from '../phones/nexus-s.json';
import userEvent from '@testing-library/user-event';

describe('PhoneImages', () => {
  it('should display the `mainImageUrl` props as the main phone image', () => {
    const setImage = jest.fn();
    render(
      <PhoneImages phone={nexusS} mainImageUrl="img/phones/nexus-s.0.jpg" setImage={setImage} />
    );

    expect(screen.getByTestId('main-image')).toHaveAttribute('src', 'img/phones/nexus-s.0.jpg');
  });

  it('should call `setImage` when an image is clicked', () => {
    const setImage = jest.fn();
    render(
      <PhoneImages phone={nexusS} mainImageUrl="img/phones/nexus-s.1.jpg" setImage={setImage} />
    );

    const thumbnails = screen.getAllByRole('listitem');
    userEvent.click(within(thumbnails[1]).getByRole('img'));

    expect(setImage).toHaveBeenCalledWith('img/phones/nexus-s.1.jpg');
  });
});
```

1つ目のテストでは `data-testid` 属性を指定してメイン画像要素を取得しています。取得した要素に対して `toHaveAttribute` で `src` 属性に Props で渡した `mainImageUrl` が設定されているか確認しています。

```ts
expect(screen.getByTestId('main-image')).toHaveAttribute('src', 'img/phones/nexus-s.0.jpg');
```

1つ目のテストは `listitem` ロールからサムネイル一覧を取得しています。`within(thumbnails[1]).getByRole('img')` で2つ目のリスト要素の子要素となる画像を取得して、` userEvent.click()` でクリックしています。画像をクリックした後 `setImage` Props がクリックした画像の URL を引数に呼ばれるかを検証しています。

```ts
const thumbnails = screen.getAllByRole('listitem');
userEvent.click(within(thumbnails[1]).getByRole('img'));

expect(setImage).toHaveBeenCalledWith('img/phones/nexus-s.1.jpg');
```

テストコードの作成に完了したら、単体テストを実行しましょう。

```sh
npm run test
```

すべてのテストが問題なく PASS しているかと思います。

ここまでのコミットログは以下のとおりです。

https://github.com/angular/angular-phonecat/commit/5ee9579112e631d9d15c9551f3b393cc10f4301c

### PhoneDetail コンポーネント

AngularJS の `phoneDetail` コンポーネントのテンプレートの2箇所を React コンポーネントに置き換えてきました。最後に `phoneDetail` コンポーネント自体を React コンポーネントに置き換えましょう。

まずは `$routeParams` サービスをコンポーネントに注入する必要があるので、型定義をインストールしておきます。

```sh
npm install --save-dev @types/angular-route
```

`app/phone-detail/PhoneDetail.tsx` ファイルを作成します。

```tsx
import angular from 'angular';
import React, { useEffect, useState } from 'react';
import { react2angular } from 'react2angular';
import PhoneImages from './PhoneImags';
import Specifiction from './Specifiction';
import { PhoneDetail } from './types';

type Props = {
  Phone: ng.resource.IResourceClass<PhoneDetail>;
  $routeParams: ng.route.IRouteParamsService;
};

const PhoneDetail: React.FC<Props> = ({ Phone, $routeParams }) => {
  const [phone, setPhone] = useState<PhoneDetail | null>(null);
  const [mainImageUrl, setMainImageUrl] = useState('');

  useEffect(() => {
    let igonre = false;
    Phone.get({ phoneId: $routeParams.phoneId }, (result: PhoneDetail) => {
      console.log({ result });
      if (!igonre) {
        setPhone(result);
        setMainImageUrl(result.images[0]);
      }
    });
    return () => {
      igonre = true;
    };
  }, [Phone, setPhone, $routeParams, setMainImageUrl]);

  if (!phone || !mainImageUrl) {
    return null;
  }

  return (
    <>
      <PhoneImages phone={phone} mainImageUrl={mainImageUrl} setImage={setMainImageUrl} />

      <Specifiction phone={phone} />
    </>
  );
};

export default PhoneDetail;

angular
  .module('phoneDetail')
  .component('phoneDetail', react2angular(PhoneDetail, [], ['Phone', '$routeParams']));
```

Props で `Phone` resource サービスと `$routeParams` サービスを注入します。

```tsx
type Props = {
  Phone: ng.resource.IResourceClass<PhoneDetail>;
  $routeParams: ng.route.IRouteParamsService;
};
```

`this.phone` と `this.mainImageUrl` の代わりに `useState` で `phone` と `mainImageUrl` を状態として保持します。`useEffect` 内で `Phone` resource サービスを利用して電話詳細情報を取得します。API コールが完了したら `Phone.get` の第2引数のコールバック関数が呼ばれるので、電話詳細情報と1つ目の画像をセットします。

```tsx
const [phone, setPhone] = useState<PhoneDetail | null>(null);
const [mainImageUrl, setMainImageUrl] = useState('');

useEffect(() => {
  let igonre = false;
  Phone.get({ phoneId: $routeParams.phoneId }, (result: PhoneDetail) => {
    if (!igonre) {
      setPhone(result);
      setMainImageUrl(result.images[0]);
    }
  });
  return () => {
    igonre = true;
  };
}, [Phone, setPhone, $routeParams, setMainImageUrl]);
```

API コールが完了して電話詳細情報とメイン画像が設定されるまでは `null` を返却して何も描画されないようにしています。

```tsx
if (!phone || !mainImageUrl) {
  return null;
}
```

最後に今まで作成したコンポーネントを描画しています。AngularJS のコンポーネントではケパブケース `main-image-url` でしたが、React　コンポーネントではキャメルケース `mainImageUrl` を使用することに注意してください。

```tsx
return (
  <>
    <PhoneImages phone={phone} mainImageUrl={mainImageUrl} setImage={setMainImageUrl} />

    <Specifiction phone={phone} />
  </>
);
```

いつものとおり、作成した React コンポーネントを `react2angular` で AngularJS のコンポーネントに変換します。第3引数で `Phone` サービスと `$routeParams` サービスを注入しています。

```tsx
angular
  .module('phoneDetail')
  .component('phoneDetail', react2angular(PhoneDetail, [], ['Phone', '$routeParams']));
```

`app/main.ts` で `PhoneDetail` コンポーネントを import します。AnguarJS の `phoneDetail` コンポーネントの import は削除しておきましょう。

```diff
+ import './phone-detail/PhoneDetail';
- import './phone-detail/phone-detail.component';
- import './phone-detail/Specifiction';
- import './phone-detail/PhoneImags';
```

不要なファイルも削除しましょう。

```sh
rm app/phone-detail/phone-detail.compoment.js
rm app/phone-detail/phone-detail.compoment.spec.js
rm app/phone-detail/phone-detail.template.html
```

`phoneList` コンポーネントのときと同じく、`app/app.config.js` のルーティングは同じなめのコンポーネントで作成しているので修正は不要です。開発サーバーで問題なく動作しているか確認しましょう。

![phone-detail](//images.ctfassets.net/in6v9lxmm5c8/dgx7vCkqHxpneF4Nyzlg1/d268f7b6c68adb9c988161ce6c60a0b3/phone-detail.gif)

e2e テストも実行します。

```sh
npm run e2e
```

### PhoneDetail コンポーネントのテスト

いつもどおり、コンポーネントのテストも作成しておきましょう。以下の観点のテストを作成します。

- `$routeParams` の `phoneId` の値を利用して電話詳細情報を取得できる
- メイン画像に電話詳細情報の1番目の画像が設定される
- サムネイル画像をクリックしたらメイン画像が置き換わる

`app/phone-detail/PhoneDetail.spec.tsx` ファイルを作成します。

```tsx
import React from 'react';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import angular from 'angular';
import 'angular-resource';
import 'angular-route';
import 'angular-mocks';
import './phone-detail.module';
import '../core/phone/phone.module';
import PhoneDetail from './PhoneDetail';
import nexusS from '../phones/nexus-s.json';
import { PhoneDetail as PhoneDetailType } from './types';

describe('PhoneList', () => {
  let Phone: ng.resource.IResourceClass<PhoneDetailType>;
  let $httpBackend: ng.IHttpBackendService;
  let $routeParams: ng.route.IRouteParamsService;

  beforeEach(() => {
    angular.mock.module('phoneDetail');
    angular.mock.inject(($resource, _$httpBackend_, _$routeParams_) => {
      Phone = $resource(
        'phones/:phoneId.json',
        {},
        {
          query: {
            method: 'GET',
            params: { phoneId: 'phones' },
            isArray: true
          }
        }
      );

      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('phones/nexus-s.json').respond(nexusS);

      $routeParams = _$routeParams_;
      $routeParams.phoneId = 'nexus-s';
    });
  });

  it('should fetch the `nexus-s`', async () => {
    render(<PhoneDetail Phone={Phone} $routeParams={$routeParams} />);

    act(() => {
      $httpBackend.flush();
    });

    expect(screen.getByRole('heading')).toHaveTextContent('Nexus S');
  });

  it('should display the first phone image as the main phone image', async () => {
    render(<PhoneDetail Phone={Phone} $routeParams={$routeParams} />);

    act(() => {
      $httpBackend.flush();
    });

    expect(screen.getByTestId('main-image')).toHaveAttribute('src', 'img/phones/nexus-s.0.jpg');
  });

  it('should swap main image if a thumbnail is clicked', () => {
    render(<PhoneDetail Phone={Phone} $routeParams={$routeParams} />);

    act(() => {
      $httpBackend.flush();
    });

    const thumbnails = screen.getAllByRole('listitem');
    userEvent.click(within(thumbnails[2]).getByRole('img'));

    waitFor(() =>
      expect(screen.getByTestId('main-image')).toHaveAttribute('src', 'img/phones/nexus-s.2.jpg')
    );
  });
});
```

`PhoneList` コンポーネン同様に Props として `Phone` resource サービス を渡す必要があるので、`anguar-mocks` を利用し `beforeEach` 内で作成しています。API をモックするために `$httpBackend` も用意しています。

ルーティングのパラメータのモックである `$routeParams` も用意して、`phoneId` パラメータを `'nexus-s'` で固定しています。

```tsx
describe('PhoneList', () => {
  let Phone: ng.resource.IResourceClass<PhoneDetailType>;
  let $httpBackend: ng.IHttpBackendService;
  let $routeParams: ng.route.IRouteParamsService;

  beforeEach(() => {
    angular.mock.module('phoneDetail');
    angular.mock.inject(($resource, _$httpBackend_, _$routeParams_) => {
      Phone = $resource(
        'phones/:phoneId.json',
        {},
        {
          query: {
            method: 'GET',
            params: { phoneId: 'phones' },
            isArray: true
          }
        }
      );

      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('phones/nexus-s.json').respond(nexusS);

      $routeParams = _$routeParams_;
      $routeParams.phoneId = 'nexus-s';
    });
  });
```

1つ目のテストでは、ルートパラメータが `'nexus-s'` であるため、「Nexus S」の情報が取得されるかどうかを検証します。正しく「Nexus S」をフェッチできていれば、ヘディング要素に `'Nexus S`' と表示されるはずです。

`$httpBackend` でモックしたレスポンスを返却するために `act` 内で `$httpBackend.flush()` メソッドを呼び出します。

```tsx

it('should fetch the `nexus-s`', async () => {
  render(<PhoneDetail Phone={Phone} $routeParams={$routeParams} />);

  act(() => {
    $httpBackend.flush();
  });

  expect(screen.getByRole('heading')).toHaveTextContent('Nexus S');
});
```

2つ目のテストはメイン画像に1つ目の画像が設定されているか確認します。1つ目のテストと大きく変わりません。モックしたレスポンスを返却した後、`data-testid` 属性からメイン画像要素を取得して `src` 属性を検証します。

```tsx
it('should display the first phone image as the main phone image', async () => {
  render(<PhoneDetail Phone={Phone} $routeParams={$routeParams} />);

  act(() => {
    $httpBackend.flush();
  });

  expect(screen.getByTestId('main-image')).toHaveAttribute('src', 'img/phones/nexus-s.0.jpg');
});
```

3つ目のテストではサムネイルをクリックした時、メイン画像が置き換わるかどうかの検証です。3つ目のサムネイル画像を `useEvent.click()` でクリックした後、`waitFor` でアニメーションの完了を待ってからメイン画像の `src` 属性を検証しています。

```tsx
it('should swap main image if a thumbnail is clicked', () => {
  render(<PhoneDetail Phone={Phone} $routeParams={$routeParams} />);

  act(() => {
    $httpBackend.flush();
  });

  const thumbnails = screen.getAllByRole('listitem');
  userEvent.click(within(thumbnails[2]).getByRole('img'));

  waitFor(() =>
    expect(screen.getByTestId('main-image')).toHaveAttribute('src', 'img/phones/nexus-s.2.jpg')
  );
});
```

テストコードの作成に完了したら、テストを実行して確認しましょう。

```sh
npm run test
```

ここまでのコミットログは以下のとおりです。

https://github.com/azukiazusa1/angular-phonecat/commit/3f680da6c1a71d98993b4cce75d9bcebba24f563

## Phone サービスを置き換える

実は今までの作業で AngularJS のコンポーネントはすべて React コンポーネントへのリプレイスが完了していました！残りの AngularJS のコードはもう少しです！

ここからは API クライアントである `angular-resource` を置き換えていきます。まずはじめに `fetch` をラップして使いやすくする `fetcher` 関数を作成します。`fetcher` 関数はそれぞれの　API クライアントで使用されます。`app/core/fetcher/index.ts` ファイルを作成します。

```ts
export const fetcher = async <T>(input: RequestInfo, init?: RequestInit): Promise<T> => {
  const response = await fetch(input, init);

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return response.json();
};
```

API クライアントのライブラリとして [SWR](https://swr.vercel.app/ja) を使用します。SWR はデータフェッチのための React Hooks ライブラリです。“SWR” という名前は、 HTTP [RFC 5861](https://www.rfc-editor.org/rfc/rfc5861.html) で提唱された HTTP キャッシュ無効化戦略である stale-while-revalidate に由来しています。

SWR は `useSWR` フックに `key` 文字列と `fetcher` 関数を受け取ります。`key` はデータの一意な識別子で、`fetcher` はデータを返す非同期関数です。このフックはリクエストの状態に応じで以下のように `data` と `error` の2つの値を返します。

```tsx
import useSWR from 'swr'

function Profile() {
  const { data, error } = useSWR('/api/user', fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  return <div>hello {data.name}!</div>
}
```

このように React におけるデータ取得ロジックを単純化して書くことができるのが特徴です。今回は各ディレクトリ配下に `useSWR` をラップした API クライアントを定義して使用する方針で利用します。

### PhoneList コンポーネントの修正

`app/phone-list/userPhones.ts` ファイルを作成します。

```ts
import useSWR from 'swr';
import { Phone } from './types';
import { fetcher } from '../core/fetcher';

const getPhones = async (): Promise<Phone[]> => {
  return await fetcher<Phone[]>('phones/phones.json');
};

type UsePhonesReturn = {
  phones: Phone[];
  isLoading: boolean;
  error: Error | undefined;
}

const usePhones = (): UsePhonesReturn => {
  const { data, error } = useSWR<Phone[]>('phones/phones.json', getPhones);
  return {
    phones: data ?? [],
    isLoading: !error && !data,
    error
  };
};

export default usePhones;
```

`getPhones` 関数は `useSWR` に渡す fetchr 関数です。ここは `fetch` を利用すると大きくやることは変わりません。`usePhones` 関数内で `useSWR` をラップして再利用可能なフックを作成しています。

作成した `usePhones` 関数をコンポーネント内で使用するように修正しましょう。

```diff
  import angular from 'angular';
- import React, { useState } from 'react';
+ import React, { useStaet, useEffect } from 'react'
  import { react2angular } from 'react2angular';
+ import usePhones from './usePhones';
  import PhoneItems from './PhoneItems';

- type Props = {
-   Phone: ng.resource.IResourceClass<Phone>;
- };

- const PhoneList: React.FC<Props> => ({ Phone }) => {
+ const PhoneList: React.FC = () => {
-   const [phones, setPhones] = useState<Phone[]>([]);
+   const { phones } = usePhones();
    const [query, setQuery] = useState('');
    const [orderProp, setOrderProp] = useState<'name' | 'age'>('age');

-  useEffect(() => {
-   let igonre = false;
-   Phone.query().$promise.then((result) => {
-     if (!igonre) {
-       setPhones(result);
-     }
-   });
-   return () => {
-     igonre = true;
-   };
- }, [Phone, setPhones]);

    return (
      {/* ... */}
    );
  };

  export default PhoneList;

- angular.module('phoneList').component('phoneList', react2angular(PhoneList, [], ['Phone']));
+ angular.module('phoneList').component('phoneList', react2angular(PhoneList, []));
```

`Phone` resource サービスをもはや注入する必要がなくなったので、Props を削除しています。`phones` の状態管理は `const { phones } = usePhones()` の1行だけになり、煩雑な `useEffect` のコードが不要になったことが見てわかるかと思います。`react2angular` で AngularJS コンポーネントに変換する際に、`Phone` resource サービスを注入しないよう第3引数を削除しました。

テストコードである `app/phone-list/PhoneList.spec.tsx` ファイル内で `Phone` を Props で渡しているのでこの箇所が肩エラーとなってしまい、これが原因で開発サーバーを起動時にエラーとなってしまいます。後ほどテストコードを修正するので、ここは一旦 `Phone` を Props として渡している箇所を削除しておきましょう。

```diff
- render(<PhoneList Phone={Phone} />);
+ render(<PhoneList />);
```

開発サーバーで確認してみると、変わらず動作していることが確認できるかと思います。E2E テストでも確認してみましょう。

```sh
npm run e2e
```

E2E テストも問題なく PASS していることが確認できるかと思います。

### PhoneList コンポーネントのテストの修正

E2E テストは問題なかったのですが、残念なことに `PhoneList` コンポーネントのテストは失敗していまいます。

```sh
npm run test

Test Suites: 1 failed, 5 passed, 6 total
Tests:       3 failed, 10 passed, 13 total
Snapshots:   0 total
Time:        23.607 s
```

このテストコードは `Phone` resource サービスを注入するために AngularJS に依存していたところがあったので、ある程度仕方のないことでしょう。ここは、特定のライブラリ・HTTP クライアントに依存しないテストコードに修正して、より安定したテストコードにしましょう。

特定のライブラリ・HTTP クライアントに依存しない方法として、[Mock Service Worker](https://mswjs.io/)（msw） が最適です。msw はサービスワーカーレベルでリクエストをインターセプトしてリクエストを返却するという特徴があります。例えば `fetch` や `axios` など特定の HTTP クライアントに対してモックしないので、抽象度の高いテストコードを作成することができます。まずはパッケージをインストールしましょう。

```sh
npm install --save-dev msw
```

`app/mocks` ディレクトリを作成して、その中にモックサーバーの実装を行います。`app/mocks/resolvers/phones.ts` では実際にモックサーバーがどのような値を返すのかを実装します。

```ts
import { ResponseResolver, RestContext, RestRequest } from 'msw';
import phones from '../../phones/phones.json';
import { Phone } from '../../phone-list/types';

export const phoneList: ResponseResolver<RestRequest, RestContext> = (req, res, ctx) => {
  return res(ctx.status(200), ctx.json<Phone[]>(phones));
};
```

モックサーバーの実装は Express に近い書き方ができます。引数で `req`, `res`, `ctx` を受け取り、`res` を `return` して値を返却します。JSON をレスポンスとして返却する場合には `ctx.json()` メソッドを使用します。

`app/mocks/handlers.ts` ではリクエストメソッド・パスをモックサーバーの実装に紐付けます。

```ts
import { rest } from 'msw'
import { phoneList } from './resolvers/phones'

export const handlers = [
  rest.get('phones/phones.json', phoneList),
]
```

`app/mocks/server.ts` で `setupServer` を呼び出してテスト用のモックサーバーを作成します。

```ts
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers)
```

Jest のセットアップを行う `jest-setup.js` でテスト時にモックサーバーが起動するようにしましょう。

```js
import '@testing-library/jest-dom';
import { server } from './app/mocks/server.ts';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

global.jasmine = true;
```

これで msw の準備は整いました。もう一つ、SWR をテストで使うために修正が必要です。SWR はリクエストをキャッシュするので、各テスト間で独立したテストでなくなってしまいます。そのため、`SWRConfig` コンポーネントでキャッシュをさせない処理を入れます。この修正のために、`render` 関数ですべてのコンポーネントを `SWRConfig` でラップする必要があるのでカスタムレンダーを使用するようにします。

`app/test-utils.tsx` ファイルを作成します。

```tsx
import React, { ReactNode, ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { SWRConfig } from 'swr';

const Wrapper = ({ children }: { children: ReactNode }) => {
  return <SWRConfig value={{ dedupingInterval: 0 }}>{children}</SWRConfig>;
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: Wrapper, ...options });

export * from '@testing-library/react';

export { customRender as render };
```

テストコードでは `@testing-libary/react` の代わりに `test-utils` を import するようにします。

```diff
- import { render, screen, waitFor } from '@testing-library/react';
+ import { render, screen, waitFor } from '../test-utils';
```

```js
import { cache } from "swr";

afterEach(() => {
  cache.clear();
});
```

また、テストが実行される環境は Node.js なのですが `fetch` が使用できるのは Node.js 18 以降に限ります。そのため、`fetch` の polyfill が必要となります。

```sh
npm install --save-dev whatwg-fetch
```

`whatwg-fetch` を `jest.setup.js` 内で import することで `fetch` が使えるようになります。

```js
import 'whatwg-fetch';
```

テストコードを修正しましょう。

はじめに、`beforeEach` で行っていたモック処理はすべて削除してしまいましょう。

```diff
- import 'angular-resource';
- import 'angular-mocks';
- import '../core/phone/phone.module';
- import phones from '../phones/phones.json
- import { Phone } from './types';

  describe('PhoneList', () => {
-   let Phone: ng.resource.IResourceClass<Phone>;
-   let $httpBackend: ng.IHttpBackendService;
-
-   beforeEach(() => {
-     angular.mock.module('phoneList');
-     angular.mock.inject(($resource, _$httpBackend_) => {
-       Phone = $resource(
-         'phones/:phoneId.json',
-         {},
-         {
-           query: {
-             method: 'GET',
-             params: { phoneId: 'phones' },
-             isArray: true
-           }
-         }
-       );
-
-       $httpBackend = _$httpBackend_;
-       $httpBackend.expectGET('phones/phones.json').respond(phones);
-     });
-   });
```

各テストに存在するモックリクエストを返却するための `$httpBackend.flush()` メソッドも削除します。

```diff
  it('should render phone items', async () => {
    render(<PhoneList Phone={Phone} />);

-   act(() => {
-     $httpBackend.flush();
-   });
    const phoneList = await screen.findAllByRole('listitem');
    expect(phoneList).toHaveLength(20);
    expect(phoneList[0]).toHaveTextContent('Motorola XOOM™ with Wi-Fi');
  });
```

修正箇所の大部分ははモックしている箇所の削除で、テストコード自体の修正はほとんど必要ありません。再度テストを実行してみましょう。

```sh
npm run test

Test Suites: 6 passed, 6 total
Tests:       13 passed, 13 total
Snapshots:   0 total
Time:        18.863 s, estimated 19 s
```

問題なくテストが PASS しているかと思います。

ここまでのコミットログは以下のとおりです。

https://github.com/azukiazusa1/angular-phonecat/commit/9242efb876dc0d9249ee423ee22014c3a762c9fb

### PhoneDetail コンポーネントの修正

同じような流れで、`PhoneDetail` コンポーネントも `usePhone` 関数利用するように修正しましょう。

`app/phone-detail/usePhone.ts` ファイルを作成します。

```ts
import useSWR from 'swr';
import { fetcher } from '../core/fetcher';
import { PhoneDetail } from './types';

const getPhoneById = async (url: string) => {
  return await fetcher<PhoneDetail>(url);
};

type UsePhonesReturn = {
  phone: PhoneDetail | undefined;
  isLoading: boolean;
  error: Error | undefined;
};

type UsePhoneParams = {
  id: string;
};

const usePhone = ({ id }: UsePhoneParams): UsePhonesReturn => {
  const { data, error } = useSWR<PhoneDetail>(`phones/${id}.json`, getPhoneById);

  return {
    phone: data,
    isLoading: !error && !data,
    error
  };
};

export default usePhone;
```

`usePhone` 関数は引数に `phoneId` を受け取ります。`useSWR` の引数に渡す `fetcher` 関数は引数に `useSWR` の第1引数である `key` を受け取ります。そのため `key` を API のパスに設定することで、`fetcher` 関数では引数で受けとった値をそのまま `url` として利用できます。

```ts
const getPhoneById = async (url: string) => {
  return await fetcher<PhoneDetail>(url);
};
```

`PhoneDetail` コンポーネント内で `usePhone` 関数を使用します。まずは Props から `Phone` resorce サービスを削除しましょう。

```diff
  type Props = {
-   Phone: ng.resource.IResourceClass<PhoneDetail>;
    $routeParams: ng.route.IRouteParamsService;
  };

- const PhoneDetail: React.FC<Props> = ({ Phone, $routeParams }) => {
+ const PhoneDetail: React.FC<Props> = ({ $routeParams }) => {
```

`useState` で `phone` の状態で管理していた箇所を `usePhone` に置き換えます。

```diff
- const [phone, setPhone] = useState<PhoneDetail | null>(null);
+ const { phone } = usePhone({
+   phoneId: $routeParams.phoneId
+ });

- useEffect(() => {
-   let igonre = false;
-   Phone.get({ phoneId: $routeParams.phoneId }, (result: PhoneDetail) => {
-     if (!igonre) {
-       setPhone(result);
-       setMainImageUrl(result.images[0]);
-     }
-   });
-   return () => {
-     igonre = true;
-   };
- }, [Phone, setPhone, $routeParams, setMainImageUrl]);
```

API のコールが完了したらメイン画像をセットする必要があるので、`useEffect` で `phone` が取得されたタイミングに `setMainImageUrl` を呼び出すようにします。

```ts
  useEffect(() => {
    if (phone) {
      setMainImageUrl(phone.images[0]);
    }
  }, [phone]);
```

`react2angular` の第3引数から `Phone` resource サービスを取り除きましょう。

```diff
  angular
    .module('phoneDetail')
-   .component('phoneDetail', react2angular(PhoneDetail, [], 'Phone', '$routeParams']));
+  .component('phoneDetail', react2angular(PhoneDetail, [], ['$routeParams']));
```

コンポーネントの修正はこれで完了です。`PhoneList` コンポーネントを修正したときと同じく、テストコードで型エラーが発生しているので `Phone` を Props で渡している箇所を取り除きます。

```diff
- render(<PhoneDetail Phone={Phone} $routeParams={$routeParams} />);
+ render(<PhoneDetail $routeParams={$routeParams} />);
```

開発サーバーで詳細画面へ遷移して正しく動作しているかどうか確認してみましょう。E2E テストも実行します。

```sh
npm run e2e
```

E2E テストも PASS することが確認できるかと思います。

### PhoneDetail コンポーネントのテストの修正

`PhoneDetail` コンポーネントのテストも同様に、`$httpBackend` モックを使わないように修正しましょう。まずはモックサーバーに 詳細取得用のハンドラを用意します。`app/mocks/resolvers/phone.ts` ファイルを作成します。

```ts
import { ResponseResolver, RestContext, RestRequest } from 'msw';
import { PhoneDetail } from '../../phone-detail/types';

export const phoneDetail: ResponseResolver<RestRequest, RestContext> = async (req, res, ctx) => {
  const phone = await import(`../../phones/${req.params.phoneId}.json`);
  if (!phone) {
    return res(ctx.status(404));
  }

  return res(ctx.status(200), ctx.json<PhoneDetail>(phone));
};
```

パスパラメータは `req.params.phoneId` で取得できます。パスパラメータの `phoneId` 元に JSON ファイルを取得し、もし存在しない `phoneId` であった場合には 404 を返すようにしています。

`app/mocks/handlers/ts` で API を登録しましょう。

```diff
  import { rest } from 'msw';
+ import { phoneDetail } from './resolvers/phone';
  import { phoneList } from './resolvers/phones';

  export const handlers = [
    rest.get('phones/phones.json', phoneList),
+   rest.get('phones/:phoneId.json', phoneDetail)
  ];
```

テストコードである `app/phone-detail/PhoneDetail.spec.tsx` ファイルを修正します。まずは `@testing-library/react` の代わりに先程作成した `test-utils` を import します。

```diff
- import { act, render, screen, waitFor, within } from '@testing-library/react';
+ import { render, screen, waitFor, within } from '../test-utils';
```

`$httpBackend` 関連のモックも削除します。まだ `$routeParams` を利用しているので、モックを完全に取り除くことはできません。

```diff
  describe('PhoneList', () => {
-   let Phone: ng.resource.IResourceClass<PhoneDetailType>;
-   let $httpBackend: ng.IHttpBackendService;
    let $routeParams: ng.route.IRouteParamsService;

    beforeEach(() => {
      angular.mock.module('phoneDetail');
 -    angular.mock.inject(($resource, _$httpBackend_, _$routeParams_) => {
 +    angular.mock.inject((_$routeParams_) => {
 -      Phone = $resource(
 -        'phones/:phoneId.json',
 -        {},
 -        {
 -          query: {
 -            method: 'GET',
 -            params: { phoneId: 'phones' },
 -            isArray: true
 -          }
 -        }
 -      );

 -      $httpBackend = _$httpBackend_;
 -      $httpBackend.expectGET('phones/nexus-s.json').respond(nexusS);

        $routeParams = _$routeParams_;
        $routeParams.phoneId = 'nexus-s';
      });
    });
```

各テストでは `$httpBackend.flush()` を削除するとともに、API コールの完了を待つために `getBy...` クエリの代わりに `await findBy...` を使用するように修正します。Testing Library の `getBy...` クエリは要素が見つからなかったバイア即座に Error を返しますが、`findBy...` クエリは Promise を返し、要素が見つかったタイミングで解決します。

```diff
  it('should fetch the `nexus-s`', async () => {
    render(<PhoneDetail Phone={Phone} $routeParams={$routeParams} />);

-   act(() => {
-     $httpBackend.flush();
-    });

-   expect(screen.getByRole('heading')).toHaveTextContent('Nexus S');
+   expect(await screen.findByRole('heading')).toHaveTextContent('Nexus S');
  });

    it('should display the first phone image as the main phone image', async () => {
    render(<PhoneDetail Phone={Phone} $routeParams={$routeParams} />);

-   act(() => {
-     $httpBackend.flush();
-    });

-    expect(screen.getByTestId('main-image')).toHaveAttribute('src', 'img/phones/nexus-s.0.jpg');
+    expect(await screen.findByTestId('main-image')).toHaveAttribute('src', 'img/phones/nexus-s.0.jpg');
  });

  it('should swap main image if a thumbnail is clicked', () => {
    render(<PhoneDetail Phone={Phone} $routeParams={$routeParams} />);

-   act(() => {
-      $httpBackend.flush();
-    });

-   const thumbnails = screen.getAllByRole('listitem');
+   const thumbnails = await screen.findAllByRole('listitem');
    userEvent.click(within(thumbnails[2]).getByRole('img'));

    waitFor(() =>
      expect(screen.getByTestId('main-image')).toHaveAttribute('src', 'img/phones/nexus-s.2.jpg')
    );
  });
```

テストを実行して PASS することを確認しましょう。

```sh
npm run test
```

これで、`Phone` resource サービスへの依存は完全になくなったので、関連するファイルを削除しましょう。

```sh
rm -rf app/core/phone
rm -rf app/core/core.module.js
```

`angular.module` で `'core'` または `'core.phone'` サービスを登録していた以下のファイルもすべてのファイルも修正します。

- `app/phone-detail/phone-detail.module.js`
- `app/phone-list/phone-list.module.js`
- `app/app.module.js`

```diff
- angular.module('phoneDetail', ['ngRoute', 'core.phone']);
+ angular.module('phoneDetail', ['ngRoute']);
```

また、`main.ts` と `app/phone-detail/PhoneDetail.spec.tsx` 内の import も削除しましょう。

```diff
  // main.ts
- import 'angular-resource';
- import './core/core.module';
- import './core/phone/phone.module';
- import './core/phone/phone.service';
```

```diff
  // app/phone-detail/PhoneDetail.spec.tsx
- import '../core/phone/phone.module';
```

`angular-resource` パッケージもアンイストールします。

```sh
npm uninstall angular-resource @types/angular-resource
```

テストを実行してパッケージをアンイストールした後も正しく動作をするか確認します。

```sh
npm run test
npm run e2e
```

ここまでのコミットログは以下のとおりです。

https://github.com/azukiazusa1/angular-phonecat/commit/8d630bb13fb41729ade842aaf8c6d09415435541
