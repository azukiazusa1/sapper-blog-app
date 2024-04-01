<script lang="ts">
  import Timeline from "./Timeline/Timeline.svelte";
</script>

<ol class="relative border-s border-gray-200 dark:border-gray-700">
  <Timeline
    eventTitle="アプリケーション開発エンジニア勉強会〜各社の取り組みや課題から学ぶ会〜"
    eventDate="2024-04-01"
    presentationTitle="React フレームワークの 動向と選定基準"
    presentationLink="https://speakerdeck.com/azukiazusa1/react-huremuwakuno-dong-xiang-toxuan-ding-ji-zhun"
    description="まずはじめ React に焦点を置き、昨今のフロントエンドでどのようなフレームワークが選択肢にあげられるのかについて紹介します。続いて、技術選定を行う際に、どのようなことを考えるべきかについて話します。最後にこれまで話した点を踏まえて、私が実際に技術選定を行った際にどのような選択をしたのか実践的な内容について触れたいと思います。"
  />
  <Timeline
    eventTitle="OpenTelemetry Casual Talk - コンセプトのおさらいと実践入門！"
    eventDate="2024-03-25"
    presentationTitle="OpenTelemetry のサービスという概念について"
    presentationLink="https://speakerdeck.com/azukiazusa1/opentelemetry-nosabisutoiugai-nian-nituite"
    description="OpenTelemetry には Semantic Conventions と呼ばれる規約で service という属性が定義されています。service はメトリックが計装されたアプリケーションの名前やバージョンを表します。特に、service.name と呼ばれる属性の重要性について話します。"
  />
  <Timeline
    eventTitle="JSConf JP 2023"
    eventDate="2023-11-18"
    presentationTitle="JavaScript なしで動作するモダンなコードの書き方"
    presentationLink="https://speakerdeck.com/azukiazusa1/javascript-nasitedong-zuo-surumotannakotonoshu-kifang"
    description="Next.js、Remix、SvelteKit といった近年のフレームワークは、JavaScript がなくても動作することを一つの価値として提供しています。例えばSvelteKit のフォームではプログレッシブエンハンスメントとして、JavaScript が利用できる環境ではリッチなユーザー体験を提供しつつ、JavaScript が使えない環境においては HTML のフォームとして振る舞うことでアプリケーションの機能を変わらず提供できます。 React Server Component はサーバー側で HTML に変換されるため、クライアントに JavaScript のコードが配信されることはありません。React Server Component では useState() を使用できないといった制約がありますので、我々開発者は React Server Component の利点を十分に発揮するために、JavaScript を用いた状態管理を行う範囲を狭めることが求められています。このトークでは、CSS の :has() セレクターや、Popover API といった、従来は JavaScript を用いなければ提供できなかった機能を代替する方法を紹介します。"
  />
  <Timeline
    eventTitle="Hatena Engineer Seminar #25「アクセシビリティ編」"
    eventDate="2023-06-06"
    presentationTitle="Mackerel のアクセシビリティ改善事例"
    presentationLink="https://speakerdeck.com/azukiazusa1/mackerel-noakusesibiriteigai-shan-shi-li"
    description="アクセシビリティの改善が正しい行いであることがわかっていたとしても、はじめからチームのタスクとして進めていくことはなかなか難しいでしょう。なぜなら、プロジェクトには他にも新規機能の開発などやるべきことがたくさんあり、優先度がつけられて入念に計画されているはずだからです。この発表では、azukiazusa が Mackerel チームにおいて具体的にどのような手法でアクセシビリティの改善を進めていったかについて話します。"
  />
</ol>
