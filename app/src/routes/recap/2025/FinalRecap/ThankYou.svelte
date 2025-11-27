<script lang="ts">
  import { fade } from "svelte/transition";
  import TwitterShareButton from "../../../../components/TwitterShareButton.svelte";

  const url = "https://azukiazusa.dev/recap/2025";
  const text = "2025年のazukiazusa.devの記録を振り返りましょう🙏";
  const escapedText = encodeURIComponent(text);
</script>

<div in:fade class="text-center">
  <h2 class="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
    2025年もありがとうございました！
  </h2>
  <p class="mx-auto mb-8 max-w-2xl text-lg text-gray-700 md:text-xl">
    今年は AI
    エージェント時代の幕開けとともに、新たな技術探求の旅が始まりました。 78
    本の記事、9
    回の登壇を通じて、多くの方々と知見を共有できたことを嬉しく思います。
    2026年も、変化し続ける技術の世界で、みなさんと一緒に学び、成長していきたいと思います。
  </p>

  <div class="flex flex-wrap justify-center gap-4">
    <a
      href="https://azukiazusa.dev"
      class="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-white transition-transform duration-200 hover:scale-105 hover:bg-purple-700"
    >
      ブログを見る
    </a>
    <a
      href={`https://x.com/share?url=${url}&text=${escapedText}`}
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-2 rounded-lg px-6 py-3 transition-transform duration-200 hover:scale-105 border border-gray-300 hover:border-purple-600 text-gray-800 hover:text-purple-600"
    >
      Xで共有
    </a>
  </div>

  <div class="mt-12">
    <a href="#hero" class="text-gray-600 hover:text-purple-600 hover:underline">
      ↑ トップに戻る
    </a>
  </div>
</div>
