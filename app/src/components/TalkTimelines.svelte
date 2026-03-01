<script lang="ts">
  import Timeline from "./Timeline/Timeline.svelte";
  interface Props {
    limit?: number;
  }

  let { limit }: Props = $props();

  const slides = [
    {
      eventTitle: "React Tokyo Fes 2025",
      eventDate: "2026-02-28",
      presentationTitle:
        "コーディングエージェントにフロントエンドを書かせるとき、フィードバックはどのように与えるか？",
      presentationLink:
        "https://azukiazusa.dev/slides/react-tokyo-fes-2025.pdf",
      description:
        "LLMベースのコーディングエージェント(Claude Code、Codexなど)が普及しているが、LLMの反復改善プロセスにおいて、コード実行結果のフィードバックがなぜ不可欠です。バックエンド開発では実行結果やテストを通じて即座にフィードバックを得られる一方、フロントエンド開発では独特の課題が存在します。本発表では、コーディングエージェントがフロントエンドコードを生成する際の「フィードバックループの問題」に焦点を当て、実践的な解決策とそのトレードオフについて議論します。",
    },
    {
      eventTitle: "KMC交流会 LT",
      eventDate: "2026-02-26",
      presentationTitle: "学生時代に熱中したことが、社会人の今も生きている話",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/xue-sheng-shi-dai-nire-zhong-sitakotoga-she-hui-ren-nojin-mosheng-kiteiruhua",
      description:
        "学生時代に麻雀に熱中した経験から得た「上達のスキーマ」が、社会人になってからのプログラミング学習にも通じるという話。書籍での体系的な学習、プラトーの乗り越え方、生涯学習の大切さについて紹介します。",
    },
    {
      eventTitle: "技育CAMPアカデミア",
      eventDate: "2026-02-12",
      presentationTitle: "探求の技術 なぜ新しい技術を学び続けるのか",
      presentationLink: "https://speakerdeck.com/azukiazusa1/tan-qiu-noji-shu",
      description:
        "急速に進化する技術の世界において、いかに効果的に新しい技術を探求し、その知見を価値あるアウトプットに変換していくかについて、実践的な方法論を共有します。毎週の技術ブログ執筆と年間300冊の読書から得た知見を基に、技術者として成長し続けるための具体的なテクニックをお伝えします。",
    },
    {
      eventTitle: "Hatena Engineer Seminar #36 プロダクトを支えるAI編",
      eventDate: "2026-01-22",
      presentationTitle:
        "AI によるインシデント初動調査の自動化を行う AI インシデントコマンダーを作った話",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/ai-niyoruinsidentochu-dong-diao-cha-nozi-dong-hua-woxing-u-ai-insidentokomandawozuo-tutahua",
      description:
        "サーバー監視ツール Mackerel の障害対応を効率化するために開発した AI インシデントコマンダーについて紹介します。Mastra フレームワークを活用し、アラート発生時のログ分析やメトリクス確認などの初動調査を、複数の専門 AI エージェントが協調して自動で実行する仕組みを構築しました。最後に AI エージェントを構築した上で得られた品質を保証する実装についても触れたいと思います。",
    },
    {
      eventTitle:
        "登壇前夜 「技術に取り残される」 不安への処方箋 -エキスパートとしてのキャリア-",
      eventDate: "2026-01-18",
      presentationTitle: "習慣とAIと環境 — 技術探求を続ける3つの鍵",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/xi-guan-toaitohuan-jing-ji-shu-tan-qiu-wosok-keru3tunojian",
      description:
        "技術探求を続けるための3つの鍵について解説します。習慣化の仕組み、AIを補助ツールとして活用した技術記事執筆法、そして自己ラベリングからの脱却と環境の重要性について、実践例を交えながら説明します。",
    },
    {
      eventTitle: "開発組織でアクセシビリティを進める技術 by SmartHR",
      eventDate: "2025-11-19",
      presentationTitle: "持続可能なアクセシビリティ開発",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/chi-sok-ke-neng-naakusesibiriteikai-fa",
      description:
        "持続可能なアクセシビリティ開発は「誰が書いても80%の要件を満たす状態を目指す」ことです。なぜ私たちのチームではこの目標を設定したのか、持続可能なアクセシビリティ開発を達成するためにどのようなアプローチを取っているのかについて発表します。",
    },
    {
      eventTitle: "YAPC::Fukuoka 2025",
      eventDate: "2025-11-15",
      presentationTitle: "探求の技術",
      presentationLink: "https://speakerdeck.com/azukiazusa1/tan-qiu-noji-shu",
      description:
        "本発表では、急速に進化する技術の世界において、いかに効果的に新しい技術を探求し、その知見を価値あるアウトプットに変換していくかについて、実践的な方法論を共有します。私は毎週技術ブログを執筆し、年間300冊の本を読むという活動を続けています。この継続的な探求活動から得られた知見を基に、技術者として成長し続けるための具体的なテクニックをお伝えします。技術探求の原動力について、効果的な技術記事の書き方に、AI時代における技術探求の在り方について話します。",
    },
    {
      eventTitle: "ないなら作るMCPサーバー構築ハンズオン",
      eventDate: "2025-11-06",
      presentationTitle: "MCP サーバーの基礎から実践レベルの知識まで",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/mcp-sabanoji-chu-karashi-jian-reberunozhi-shi-made",
      description:
        "この発表では MCP サーバーの基礎的な知識から入り、ハンズオン形式で実施に MCP サーバーを自分の手で構築する体験を通じて理解を深めていきます。後半パートでは実際に本番レベルで MCP サーバーを開発した経験を元に、実践的な知識や失敗談などを共有します。",
    },
    {
      eventTitle: "Claude Codeで開発と学習を両立する方法",
      eventDate: "2025-09-11",
      presentationTitle:
        "AIと私たちの学習の変化を考える - Claude Codeの学習モードを例に",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/aitosi-tatinoxue-xi-nobian-hua-wokao-eru-claude-codenoxue-xi-modowoli-ni",
      description:
        "生成AIの登場は私たちの仕事の進め方に大きな変化をもたらしました。より多くの仕事をこなせるようになった一方で、「自分の頭で考える」時間が減り、思考力や問題解決能力の低下が懸念されています。このような課題に対応するため、多くのAIサービスは、単に答えを提供するのではなく、ユーザー自身の思考を促す「学習モード」を実装しています。本発表では、Claude Codeの学習モードを例に、AIを学習パートナーとして効果的に活用する方法を探ります。",
    },
    {
      eventTitle: "大吉祥寺.pm 2025",
      eventDate: "2025-09-06",
      presentationTitle:
        "2025 年のコーディングエージェントの現在地とエンジニアの仕事の変化について",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/2025-nian-nokodeinguezientonoxian-zai-di-toenzinianoshi-shi-nobian-hua-nituite",
      description:
        "2025年現在、開発現場では「コードを書く」から「AIと協働する」への大転換が起きています。GitHub Copilotのような補完型から始まったAI支援は、今や自律的にタスクを遂行するエージェントへと進化しました。2025 年時点ではどのような類型のコーディングエージェントが存在しているか、コーディングエージェントの登場により私達エンジニアの仕事がどのように変化しているのか、急速な変化に伴いどのような課題が発生しているのかについて話します。そして数年後に、「2025年は確かに時代の転換点だったね」と振り返ってその瞬間に立ち会えたことを楽しめるようにしましょう。",
    },
    {
      eventTitle: "はてなインターン2025",
      eventDate: "2025-08-19",
      presentationTitle: "AIエージェント活用",
      presentationLink:
        "https://speakerdeck.com/hatena/internship-2025-ai-agent",
      description:
        "この講義の目的は、現状のコーディングと AI の関係を整理し、AI エージェントを使いこなす方法を学ぶことです。これからの時代、AI エージェントを開発に活用することはもはや避けられない流れとなっています。開発スタイルの変化を理解し、実際の開発に役立ててもらうことを目指しています。",
    },
    {
      eventTitle: "Cloudflare Workers Tech Talks in Kyoto #1",
      eventDate: "2025-07-18",
      presentationTitle:
        "バイブコーディング超えてバイブデプロイ〜Cloudflare MCP 実現する、未来のアプリケーションデリバリー",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/baibukodeinguchao-etebaibudepuroi-cloudflaremcpdeshi-xian-suru-wei-lai-noapurikesiyonderibari",
      description:
        "バイブコーディングとは、AIエージェントが自律的にコードを生成・実行する技術です。Cloudflare Workers MCPを使って、AIエージェントがCloudflareのリソースを操作し、アプリケーションをデプロイする方法を実践します。",
    },
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

  const displaySlides = $derived(limit ? slides.slice(0, limit) : slides);

  // Pre-process slides to determine which ones should show year headers
  const slidesWithYearHeaders = $derived(
    displaySlides.map((slide, index) => {
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
    }),
  );
</script>

<ol
  class="relative border-s border-gray-200 dark:border-gray-700 ml-6 md:ml-32"
>
  {#each slidesWithYearHeaders as slide}
    {#if slide.showYearHeader}
      <li class="mb-6 mt-10 -ml-6 md:-ml-32">
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
