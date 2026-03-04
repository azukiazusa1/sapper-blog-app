---
id: H3BeR1QmVXAQgp7l7qWdi
title: "iOS Safari で触覚フィードバックを実現する WebHaptics"
slug: "ios-safari-web-haptics"
about: "WebHaptics は、Web アプリケーションで触覚フィードバックを実装するための JavaScript ライブラリです。iOS Safari でも触覚フィードバックを提供することができます。この記事では、WebHaptics ライブラリの概要と、どのようにして iOS Safari で触覚フィードバックを実現しているのかについて解説します。"
createdAt: "2026-03-04T18:52+09:00"
updatedAt: "2026-03-04T18:52+09:00"
tags: ["WebHaptics", "触覚フィードバック"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3FaxTpOhxWoytk1Hbn7vFP/61c2098f9f00a317b1dd0fdc930a5ca1/spring_sanshoku_dango_6767-768x623.png"
  title: "桜と三色団子のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "WebHaptics が iOS Safari で触覚フィードバックを実現するために利用している仕組みはどれですか？"
      answers:
        - text: "`navigator.vibrate()` のポリフィルを使用する"
          correct: false
          explanation: null
        - text: "Web Audio API を用いて振動を音波で模倣する"
          correct: false
          explanation: null
        - text: "`<input type=\"checkbox\" switch>` 要素のタップ時に発生するデフォルトの触覚フィードバックを活用する"
          correct: true
          explanation: "iOS Safari では `navigator.vibrate()` が使えないため、タップ時に触覚フィードバックが発生する `<input type=\"checkbox\" switch>` 要素を動的に生成し、プログラムからクリックすることで実現しています。"
        - text: "ネイティブの iOS アプリと連携して触覚フィードバックを実現する"
          correct: false
          explanation: null
    - question: "WebKit チームが Vibration API に反対している理由として、記事で挙げられていないものはどれですか？"
      answers:
        - text: "既存の API で十分な触覚フィードバックが提供できるから"
          correct: true
          explanation: null
        - text: "機能が悪用されるおそれがあるから"
          correct: false
          explanation: null
        - text: "デバイスへの依存性があるから"
          correct: false
          explanation: null
        - text: "API の機能が制限されすぎていて開発者が必要とする触覚機能を提供できないから"
          correct: false
          explanation: null
published: true
---
触覚フィードバック（haptic feedback）とは、デバイスが振動や力の変化などを通じて、ユーザーの皮膚や筋肉に物理的な感覚を伝える技術のことです。これにより、視覚や聴覚だけでは伝えられないリアリティのある体験を提供できます。例えばボタンを押した時に振動が発生することで、ユーザーは操作が成功したことを感じ取れます。

今日のモバイルデバイス（iPhone や Android スマートフォンなど）には、触覚フィードバックを提供するためのハードウェアが組み込まれており、ネイティブアプリの実装では簡単に利用できます。例えば iOS では `UIFeedbackGenerator` クラスを使用して、様々な種類の触覚フィードバックを生成できます。

```swift
let generator = UIImpactFeedbackGenerator(style: .medium)
generator.impactOccurred()
```

一方で、Web アプリケーションで触覚フィードバックを実装するための標準的な API は限定的です。現在のところ、Web API では `navigator.vibrate()` メソッドが仕様として提供されているものの、Safari では長らくサポートされていない状況が続いています。

```javascript
navigator.vibrate(200); // 200ms の振動を発生させる
// パターンを指定することも可能
navigator.vibrate([100, 50, 100]); // 100ms 振動、50ms 休止、100ms 振動
```

[WebHaptics](https://haptics.lochie.me/) は、Web アプリケーションで触覚フィードバックを実装するための JavaScript ライブラリです。このライブラリは、一種のハックを利用して、iOS Safari でも触覚フィードバックを提供できます。この記事では、WebHaptics ライブラリの概要と、どのようにして iOS Safari で触覚フィードバックを実現しているのかについて解説します。

## WebHaptics の使い方

WebHaptics を使用するために、`web-haptics` パッケージをインストールします。

```bash
npm install web-haptics
```

`WebHaptics` クラスをインポートしてインスタンスを作成し、`.trigger()` メソッドを呼び出すことで触覚フィードバックを発生させることができます。

```javascript
import { WebHaptics, defaultPatterns } from "web-haptics";

const haptics = new WebHaptics();
haptics.trigger();
haptics.trigger(defaultPatterns.success);
// defaultPatterns.success は以下と同等です
haptics.trigger([{ duration: 30 }, { delay: 60, duration: 40, intensity: 1 }]);
```

`.trigger()` メソッドは、配列形式で振動のパターンを指定できます。各オブジェクトは、振動の継続時間（`duration`）、次の振動までの遅延（`delay`）、振動の強さ（`intensity`）を定義します。`defaultPatterns` オブジェクトには、成功や失敗などの一般的なパターンがあらかじめ定義されており、簡単に利用できます。

React, Vue, Svelte などのフレームワークでも、WebHaptics を簡単に統合することができます。例えば React では `useHaptics` フックを使用して、コンポーネント内で触覚フィードバックを呼び出せます。

```tsx
import { useWebHaptics } from "web-haptics/react";

function MyButton() {
  const { trigger } = useWebHaptics();

  return <button onClick={() => trigger()}>Tap me</button>;
}
```

実際に触覚フィードバックを体験するには、モバイルデバイスで以下のデモページにアクセスしてみてください。

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/pvEgVZL?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/pvEgVZL">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

![](https://images.ctfassets.net/in6v9lxmm5c8/02yykmFH6pFDjF57VtPld/e51f06c7b4274e49e49e6d30331b745d/qrcode_codepen.io.png)

## どのように iOS Safari で触覚フィードバックを実現しているのか

iOS Safari では `navigator.vibrate()` メソッドがサポートされていない状況で WebHaptics はどのようにして触覚フィードバックを実現しているのでしょうか？WebHaptics は iOS Safari 環境では、`<input type="checkbox" switch>` 要素を利用して、ユーザーがタップした際に発生するデフォルトの触覚フィードバックを活用しています。

`<input type="checkbox" switch>` は通常のチェックボックスを描画するのではなく、オンとオフの状態を持つスイッチコントロールとして表示されます。単に見た目が変わるだけでなく、`role="switch"` が付与されたり、中間状態（`indeterminate`）がサポートされたりするなど、アクセシビリティの観点からも特別な扱いがされます。まだ標準化されていない仕様であるためブラウザのサポートも限定的であり、現在 `switch` 属性は Safari のみでサポートされています。

`<input type="checkbox" switch>` 要素の最大の特徴は、ユーザーがタップした際に iOS の触覚フィードバックが発生することです。iPhone から以下の URL にアクセスして、スイッチをタップして触覚フィードバックを体験してみてください。

![](https://images.ctfassets.net/in6v9lxmm5c8/3EynVKAajgJYnKabFNj3JA/e2445c9dfb4d58d1d05989f0d92375d0/qrcode_codepen.io__1_.png)

WebHaptics では、触覚フィードバックを発生させるために、必要に応じて `<input type="checkbox" switch>` 要素を動的に生成し、ユーザーがタップすることで触覚フィードバックが発生するようにしています。以下は、WebHaptics の実装の一部抜粋です。

```javascript
// コードは省略しつつ抜粋
class WebHaptics {
  private ensureDOM(): void {
    const id = `web-haptics-${this.instanceId}`;
    // ラベルとチェックボックスを視覚的に表示されないように配置
    const hapticLabel = document.createElement("label");
    hapticLabel.setAttribute("for", id);
    hapticLabel.style.position = "fixed";
    this.hapticLabel = hapticLabel;
    // ...
    const hapticCheckbox = document.createElement("input");
    hapticCheckbox.type = "checkbox";
    hapticCheckbox.setAttribute("switch", "");
    hapticCheckbox.id = id;

    document.body.appendChild(hapticLabel);
    document.body.appendChild(hapticCheckbox);
  }

  async trigger(
    input: HapticInput = [{ duration: 25, intensity: 0.7 }],
    options?: TriggerOptions,
  ): Promise<void> {
    // navigator.vibrate() が利用可能な場合はそちらを使用
    if (WebHaptics.isSupported) {
      navigator.vibrate(toVibratePattern(vibrations, defaultIntensity));
    }

    // navigator.vibrate() が利用できない場合は、iOS Safari でスイッチをタップして触覚フィードバックを発生させる
    if (!WebHaptics.isSupported || this.debug) {
      this.ensureDOM();
      // ...
      this.hapticLabel.click();
      // ... クリックはパターンに従って複数回呼び出す
       await this.runPattern(vibrations, defaultIntensity, firstClickFired);
    }
  }
}
```

https://github.com/lochie/web-haptics/blob/66d436661fe05768520c8d7f60c585fe85249f3c/packages/web-haptics/src/lib/web-haptics/index.ts

ただし、この方法はハックに頼ったものであり、将来的に機能が使えなくなる可能性があるため注意が必要です。そもそも WebKit チームは Vibration API に対して反対の立場を取っているということを忘れてはいけません。機能の悪用やデバイスへの依存性であったり、API の機能が制限されすぎていて開発者が必要とする触覚機能を提供できないことなどを理由に挙げています。iOS の `UIImpactFeedbackGenerator` は細かな振動のパターンを指定できるのに対して、Vibration API は振動のオンオフを切り替えられるだけに機能が制限されています。

https://github.com/WebKit/standards-positions/issues/267

https://github.com/web-platform-tests/interop/issues/718#issuecomment-2400895316

つまり `<input type="checkbox" switch>` がハックされて利用されていることが問題視されれば、Safari でスイッチ要素の触覚フィードバックが提供されなくなる可能性も十分考えられるでしょう。とはいえ現状 Vibration API が Safari でサポートされる見込みもなく、Firefox でも一度はサポートされたものの、後に削除されていることを考えると、触覚フィードバックの標準化はまだまだ先の話になりそうです。Vibration API の欠点を補う WebHaptics API のような新しい API の提案も行われており、今後の触覚フィードバックの標準化の動向にも注目していきたいところです。

https://github.com/WICG/proposals/issues/262

## 参考

- [WebHaptics – Haptic feedback for the mobileweb.](https://haptics.lochie.me/)
- [lochie/web-haptics: Haptic feedback for the mobile web](https://github.com/lochie/web-haptics)
- [触覚フィードバックの提供 | Apple Developer Documentation](https://developer.apple.com/jp/design/human-interface-guidelines/playing-haptics)
- [ハプティクス設計の原則  |  Views  |  Android Developers](https://developer.android.com/develop/ui/views/haptics/haptics-principles?hl=ja)
- [Navigator: vibrate() メソッド - Web API | MDN](https://developer.mozilla.org/ja/docs/Web/API/Navigator/vibrate)
- [Vibration API - Web API | MDN](https://developer.mozilla.org/ja/docs/Web/API/Vibration_API)
- [Vibration API · Issue #718 · web-platform-tests/interop](https://github.com/web-platform-tests/interop/issues/718)
- [Add switch attribute to the input element to allow for a two-state switch control. by lilyspiniolas · Pull Request #9546 · whatwg/html](https://github.com/whatwg/html/pull/9546)
