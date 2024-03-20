<script lang="ts">
  import Pagination from "../../../../../components/Pagination/Pagination.svelte";
  import type { PageData } from "./$types";
  import variables from "$lib/variables";
  import ShortCard from "../../../../../components/ShortCard/ShortCard.svelte";

  export let data: PageData;
</script>

<svelte:head>
  <title>ショート | azukiazusaのテックブログ2</title>
  <link rel="canonical" href={`${variables.baseURL}/blog/page/${data.page}`} />
  <meta
    name="description"
    content="サクサク読める短い記事をショートとして投稿しています。"
  />
</svelte:head>

<div class="mt-16 grid gap-y-16 px-6">
  {#each data.shorts.shortCollection.items as short (short.sys.id)}
    <ShortCard id={short.sys.id} title={short.title}>
      {short.content1}
    </ShortCard>
  {/each}
</div>

<Pagination
  page={data.page}
  total={data.shorts.shortCollection.total}
  limit={data.shorts.shortCollection.limit}
  href="/blog/shorts/page/"
/>

<style>
  .grid {
    grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  }
</style>
