<script lang="ts">
  import Timeline from "./Timeline/Timeline.svelte";
  interface Props {
    limit?: number;
  }

  let { limit }: Props = $props();

  const slides = [
    {
      eventTitle: "#さくらのAI Meetup vol.11「Agent2Agent（A2A）」",
      eventDate: "2025-06-25",
      presentationTitle: "A2A プロトコルを試してみる",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/a2a-purotokoruwoshi-sitemiru",
      description:
        "Google が開発しLinux Foundationに寄贈されたAgent2Agent（A2A）プロトコルについて、TypeScriptでの実装を通じて学ぶプレゼンテーションです。AIエージェント間の標準的な連携を可能にするA2Aプロト コルの基本概念から、エージェントカードの定義、タスク管理、JSON-RPC 2.0通信、そして公式JavaScript SDKやMastraフレームワークを使った実装例まで、包括的に解説します。",
    },
    {
      eventTitle: "Svelte Japan Online Meetup #6",
      eventDate: "2025-02-07",
      presentationTitle:
        "依存関係があるコンポーネントは Barrel ファイルでまとめよう",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/yi-cun-guan-xi-gaarukonponentoha-barrel-huairudematomeyou",
      description:
        "依存関係があるコンポーネントとは、`<select>` と `<option>` のような関係性を指します。このようなコンポーネントは同時に使われることが前提であるため、利用者にそのことが伝わるようにする必要があります。この発表では Barrel ファイルを使って依存関係があるコンポーネントをまとめる方法について話します。",
    },
    {
      eventTitle: "JSConf JP 2024",
      eventDate: "2024-11-23",
      presentationTitle:
        "UI 開発におけるヘッドレス UI ライブラリの重要性とデザインシステムへの取り入れ方",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/ui-kai-fa-niokeru-hetudoresu-ui-raiburarinozhong-yao-xing-todezainsisutemuhenoqu-riru-refang",
      description:
        "昨今の Web 開発における UI はますます複雑化し、アクセシビリティの重要性が高まっています。ブラウザの標準機能だけでは実現できない複雑な UI を実装する際、アクセシビリティに関する誤った実装が原因で、ユーザー体験を損なう可能性があります。ヘッドレス UI ライブラリは、あらかじめアクセシビリティに配慮されたコンポーネントを提供することで、開発者がこれらの問題に悩まされることなく、高品質な UI を構築できるようになります。本セッションでは、ヘッドレス UI ライブラリを活用し、デザインシステムの一部として、アクセシブルでカスタマイズ可能な UI を構築する方法を紹介します。",
    },
    {
      eventTitle:
        "各社の事例から学ぶウェブアクセシビリティ 〜フロントエンドの最前線〜",
      eventDate: "2024-08-23",
      presentationTitle: "チームで開発する際にアクセシビリティを保つ施策",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/timudekai-fa-suruji-niakusesibiriteiwobao-tushi-ce",
      description:
        "この発表はすでにアクセシビリティに興味を持っていて、ソフトウェア開発の現場にアクセシビリティを取り入れたい人を対象としています。開発チーム全体でアクセシビリティに意識を持つ状態が理想ですが、全員が詳細な実装を行うのは実際には難しいでしょう。そこで、特に意識をせずともある程度のアクセシビリティを保つ状態にするための施策について紹介いたします。",
    },
    {
      eventTitle: "Svelte Japan Online Meetup #3",
      eventDate: "2024-05-24",
      presentationTitle: "よりシンプルになる Svelte の世界",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/yorisinpuruninaru-svelte-noshi-jie",
      description:
        "Svelte は記述量が少なくシンプルなコードで書けることが特徴の 1 つでした。しかし、アプリケーションの規模が大きくなるにつれて学習コストや認知負荷が増加していくという課題が浮上してきました。Svelte v5 で導入される Rune は今までの Svelte のコンセプトを覆し、よりシンプルになることを目指しています。このトークでは Svelte v5 の新機能を通じて Svelte の書き方がどのように変わるのかについて話します。",
    },
    {
      eventTitle:
        "アプリケーション開発エンジニア勉強会〜各社の取り組みや課題から学ぶ会〜",
      eventDate: "2024-04-01",
      presentationTitle: "React フレームワークの 動向と選定基準",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/react-huremuwakuno-dong-xiang-toxuan-ding-ji-zhun",
      description:
        "まずはじめ React に焦点を置き、昨今のフロントエンドでどのようなフレームワークが選択肢にあげられるのかについて紹介します。続いて、技術選定を行う際に、どのようなことを考えるべきかについて話します。最後にこれまで話した点を踏まえて、私が実際に技術選定を行った際にどのような選択をしたのか実践的な内容について触れたいと思います。",
    },
    {
      eventTitle:
        "OpenTelemetry Casual Talk - コンセプトのおさらいと実践入門！",
      eventDate: "2024-03-25",
      presentationTitle: "OpenTelemetry のサービスという概念について",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/opentelemetry-nosabisutoiugai-nian-nituite",
      description:
        "OpenTelemetry には Semantic Conventions と呼ばれる規約で service という属性が定義されています。service はメトリックが計装されたアプリケーションの名前やバージョンを表します。特に、service.name と呼ばれる属性の重要性について話します。",
    },
    {
      eventTitle: "JSConf JP 2023",
      eventDate: "2023-11-18",
      presentationTitle: "JavaScript なしで動作するモダンなコードの書き方",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/javascript-nasitedong-zuo-surumotannakotonoshu-kifang",
      description:
        "Next.js、Remix、SvelteKit といった近年のフレームワークは、JavaScript がなくても動作することを一つの価値として提供しています。例えばSvelteKit のフォームではプログレッシブエンハンスメントとして、JavaScript が利用できる環境ではリッチなユーザー体験を提供しつつ、JavaScript が使えない環境においては HTML のフォームとして振る舞うことでアプリケーションの機能を変わらず提供できます。 React Server Component はサーバー側で HTML に変換されるため、クライアントに JavaScript のコードが配信されることはありません。React Server Component では useState() を使用できないといった制約がありますので、我々開発者は React Server Component の利点を十分に発揮するために、JavaScript を用いた状態管理を行う範囲を狭めることが求められています。このトークでは、CSS の :has() セレクターや、Popover API といった、従来は JavaScript を用いなければ提供できなかった機能を代替する方法を紹介します。",
    },
    {
      eventTitle: "Hatena Engineer Seminar #25「アクセシビリティ編」",
      eventDate: "2023-06-06",
      presentationTitle: "Mackerel のアクセシビリティ改善事例",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/mackerel-noakusesibiriteigai-shan-shi-li",
      description:
        "アクセシビリティの改善が正しい行いであることがわかっていたとしても、はじめからチームのタスクとして進めていくことはなかなか難しいでしょう。なぜなら、プロジェクトには他にも新規機能の開発などやるべきことがたくさんあり、優先度がつけられて入念に計画されているはずだからです。この発表では、azukiazusa が Mackerel チームにおいて具体的にどのような手法でアクセシビリティの改善を進めていったかについて話します。",
    },
  ];

  const displaySlides = limit ? slides.slice(0, limit) : slides;

  // Pre-process slides to determine which ones should show year headers
  const slidesWithYearHeaders = displaySlides.map((slide, index) => {
    const year = new Date(slide.eventDate).getFullYear();
    const prevYear =
      index > 0
        ? new Date(displaySlides[index - 1].eventDate).getFullYear()
        : null;
    const showYearHeader = year !== prevYear;

    return {
      ...slide,
      year,
      showYearHeader,
    };
  });
</script>

<ol class="relative border-s border-gray-200 dark:border-gray-700 ml-32">
  {#each slidesWithYearHeaders as slide}
    {#if slide.showYearHeader}
      <li class="mb-6 mt-10 -ml-32">
        <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-200">
          {slide.year}
        </h2>
      </li>
    {/if}
    <Timeline
      eventTitle={slide.eventTitle}
      eventDate={slide.eventDate}
      presentationTitle={slide.presentationTitle}
      presentationLink={slide.presentationLink}
      description={slide.description}
    />
  {/each}
</ol>
