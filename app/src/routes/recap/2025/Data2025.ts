export interface RecapData {
  totalPosts: number;
  totalWords: number;
  topTags: Array<{ name: string; count: number }>;
  popularPosts: Array<{
    title: string;
    views: number;
    url: string;
  }>;
  talks: Array<{
    eventTitle: string;
    eventDate: string;
    presentationTitle: string;
    presentationLink: string;
    description: string;
  }>;
}

export const recap2025: RecapData = {
  totalPosts: 81,
  totalWords: 800846,
  topTags: [
    { name: "AI", count: 35 },
    { name: "MCP", count: 21 },
    { name: "TypeScript", count: 13 },
    { name: "claude-code", count: 13 },
    { name: "CSS", count: 7 },
  ],
  popularPosts: [
    {
      title:
        "コーディングエージェントの現状の整理とエンジニアの仕事の変化について",
      views: 47084,
      url: "/blog/coding-agents-and-developers-work/",
    },
    {
      title: "コーディングエージェントの能力を拡張する Serena を試してみた",
      views: 33768,
      url: "/blog/serena-coding-agent/",
    },
    {
      title: "私のキャリアに影響を与えたコンピューター・IT の定番書籍",
      views: 27457,
      url: "/blog/computer-it-books/",
    },
  ],
  talks: [
    {
      eventTitle: "開発組織でアクセシビリティを進める技術 by SmartHR",
      eventDate: "2025-11-19",
      presentationTitle: "持続可能なアクセシビリティ開発",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/chi-sok-ke-neng-naakusesibiriteikai-fa",
      description:
        "持続可能なアクセシビリティ開発は「誰が書いても 80%の要件を満たす状態を目指す」ことです。なぜ私たちのチームではこの目標を設定したのか、持続可能なアクセシビリティ開発を達成するためにどのようなアプローチを取っているのかについて発表します。",
    },
    {
      eventTitle: "YAPC::Fukuoka 2025",
      eventDate: "2025-11-15",
      presentationTitle: "探求の技術",
      presentationLink: "https://speakerdeck.com/azukiazusa1/tan-qiu-noji-shu",
      description:
        "本発表では、急速に進化する技術の世界において、いかに効果的に新しい技術を探求し、その知見を価値あるアウトプットに変換していくかについて、実践的な方法論を共有します。私は毎週技術ブログを執筆し、年間 300 冊の本を読むという活動を続けています。この継続的な探求活動から得られた知見を基に、技術者として成長し続けるための具体的なテクニックをお伝えします。技術探求の原動力について、効果的な技術記事の書き方に、AI 時代における技術探求の在り方について話します。",
    },
    {
      eventTitle: "ないなら作る MCP サーバー構築ハンズオン",
      eventDate: "2025-11-06",
      presentationTitle: "MCP サーバーの基礎から実践レベルの知識まで",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/mcp-sabanoji-chu-karashi-jian-reberunozhi-shi-made",
      description:
        "この発表では MCP サーバーの基礎的な知識から入り、ハンズオン形式で実施に MCP サーバーを自分の手で構築する体験を通じて理解を深めていきます。後半パートでは実際に本番レベルで MCP サーバーを開発した経験を元に、実践的な知識や失敗談などを共有します。",
    },
    {
      eventTitle: "Claude Code で開発と学習を両立する方法",
      eventDate: "2025-09-11",
      presentationTitle:
        "AI と私たちの学習の変化を考える - Claude Code の学習モードを例に",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/aitosi-tatinoxue-xi-nobian-hua-wokao-eru-claude-codenoxue-xi-modowoli-ni",
      description:
        "生成 AI の登場は私たちの仕事の進め方に大きな変化をもたらしました。より多くの仕事をこなせるようになった一方で、「自分の頭で考える」時間が減り、思考力や問題解決能力の低下が懸念されています。このような課題に対応するため、多くの AI サービスは、単に答えを提供するのではなく、ユーザー自身の思考を促す「学習モード」を実装しています。本発表では、Claude Code の学習モードを例に、AI を学習パートナーとして効果的に活用する方法を探ります。",
    },
    {
      eventTitle: "大吉祥寺.pm 2025",
      eventDate: "2025-09-06",
      presentationTitle:
        "2025 年のコーディングエージェントの現在地とエンジニアの仕事の変化について",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/2025-nian-nokodeinguezientonoxian-zai-di-toenzinianoshi-shi-nobian-hua-nituite",
      description:
        "2025 年現在、開発現場では「コードを書く」から「AI と協働する」への大転換が起きています。GitHub Copilot のような補完型から始まった AI 支援は、今や自律的にタスクを遂行するエージェントへと進化しました。2025 年時点ではどのような類型のコーディングエージェントが存在しているか、コーディングエージェントの登場により私達エンジニアの仕事がどのように変化しているのか、急速な変化に伴いどのような課題が発生しているのかについて話します。そして数年後に、「2025 年は確かに時代の転換点だったね」と振り返ってその瞬間に立ち会えたことを楽しめるようにしましょう。",
    },
    {
      eventTitle: "はてなインターン 2025",
      eventDate: "2025-08-19",
      presentationTitle: "AI エージェント活用",
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
        "バイブコーディングとは、AI エージェントが自律的にコードを生成・実行する技術です。Cloudflare Workers MCP を使って、AI エージェントが Cloudflare のリソースを操作し、アプリケーションをデプロイする方法を実践します。",
    },
    {
      eventTitle: "#さくらの AI Meetup vol.11「Agent2Agent（A2A）」",
      eventDate: "2025-06-25",
      presentationTitle: "A2A プロトコルを試してみる",
      presentationLink:
        "https://speakerdeck.com/azukiazusa1/a2a-purotokoruwoshi-sitemiru",
      description:
        "Google が開発し Linux Foundation に寄贈された Agent2Agent（A2A）プロトコルについて、TypeScript での実装を通じて学ぶプレゼンテーションです。AI エージェント間の標準的な連携を可能にする A2A プロト コルの基本概念から、エージェントカードの定義、タスク管理、JSON-RPC 2.0 通信、そして公式 JavaScript SDK や Mastra フレームワークを使った実装例まで、包括的に解説します。",
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
  ],
};
