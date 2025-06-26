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

<div class="container mx-auto px-4 max-w-5xl">
  <h1
    class="my-8 relative text-3xl font-extrabold dark:text-white after:content-[''] after:absolute after:-bottom-3 after:left-0 after:w-20 after:h-1 after:bg-indigo-500"
  >
    登壇資料
  </h1>
  <TalkTimelines />
</div>
