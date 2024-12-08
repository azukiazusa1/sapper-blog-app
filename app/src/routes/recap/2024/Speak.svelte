<script lang="ts">
  interface TimelineItem {
    date: string;
    title: string;
    description: string;
  }

  const timelineData: TimelineItem[] = [
    {
      date: "2024.11.23",
      title: "JSConf JP 2024",
      description:
        "UI 開発におけるヘッドレス UI ライブラリの重要性とデザインシステムへの取り入れ方",
    },
    {
      date: "2024.08.23",
      title:
        "各社の事例から学ぶウェブアクセシビリティ 〜フロントエンドの最前線〜",
      description: "チームで開発する際にアクセシビリティを保つ施策",
    },
    {
      date: "2024.05.24",
      title: "Svelte Japan Online Meetup #3",
      description: "よりシンプルになる Svelte の世界",
    },
    {
      date: "2024.04.01",
      title:
        "アプリケーション開発エンジニア勉強会〜各社の取り組みや課題から学ぶ会〜",
      description: "React フレームワークの動向と選定基準",
    },
    {
      date: "2024.03.25",
      title: "OpenTelemetry Casual Talk - コンセプトのおさらいと実践入門！",
      description: "OpenTelemetry のサービスという概念について",
    },
  ];
</script>

<div class="relative h-80 overflow-y-hidden px-2">
  <ol class="animate-scroll mt-28 border-l border-gray-200">
    {#each timelineData as item}
      <li class="ml-4">
        <div
          class="border-gray absolute -left-1.5 z-10 mt-1.5 h-3 w-3 rounded-full border bg-gray-200"
        ></div>
        <time class="mb-1 text-sm font-normal leading-none text-gray-400"
          >{item.date}</time
        >
        <h3 class="text-lg font-semibold text-gray-900">
          {item.title}
        </h3>
        <p class="mb-4 text-base font-normal text-gray-500">
          {item.description}
        </p>
      </li>
    {/each}
  </ol>
</div>

<style>
  .animate-scroll {
    animation: scroll 30s linear;
    animation-fill-mode: forwards;
  }

  .animate-scroll:hover {
    animation-play-state: paused;
  }

  @keyframes scroll {
    0% {
      transform: translateY(0%);
    }
    100% {
      transform: translateY(-720px);
    }
  }
</style>
