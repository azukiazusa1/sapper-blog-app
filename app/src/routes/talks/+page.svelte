<script lang="ts">
  import TalkTimelines from "../../components/TalkTimelines.svelte";
</script>

<svelte:head>
  <title>登壇資料 | azukiazusaのテックブログ2</title>
  <meta
    name="description"
    content="azukiaausa が登壇したイベントの資料をまとめています。"
  />
</svelte:head>

<div
  class="w-full bg-gradient-to-r from-indigo-900 to-purple-900 py-16 dark:from-indigo-950 dark:to-purple-950 mb-16"
>
  <div class="container mx-auto px-4">
    <h1 class="text-center text-4xl font-extrabold text-white mb-6">登壇資料</h1>
    <p class="text-center text-lg text-indigo-100 max-w-2xl mx-auto mb-10">
      azukiazusa が登壇したイベントの資料をまとめています。
    </p>
  </div>
</div>

<div class="container mx-auto px-4 max-w-7xl">
  <div class="max-w-5xl mx-auto">
    <TalkTimelines />
  </div>
</div>
