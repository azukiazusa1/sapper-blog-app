<script lang="ts">
  import PrevIcon from "../Icons/Prev.svelte";
  import NextIcon from "../Icons/Next.svelte";
  import Page from "./Page.svelte";

  export let page = 1;
  export let total: number;
  export let limit: number;
  export let href = "/blog/page/";

  $: totalPage = Math.ceil(total / limit);
  $: hasPrev = page !== 1;
  $: hasNext = page !== totalPage && totalPage !== 0;
  $: prevPage = page - 1;
  $: nextPage = page + 1;
</script>

<nav class="my-12 flex flex-col items-center" aria-label="ページネーション">
  <div class="flex -space-x-px">
    {#if hasPrev}
      <a
        class="flex h-12 w-12 items-center justify-center rounded-l-lg border border-gray-200 dark:border-zinc-600"
        href={`${href}${prevPage}`}
        data-sveltekit-preload-data
      >
        <div class="sr-only">前のページ</div>
        <PrevIcon />
      </a>
    {/if}
    <div class="flex -space-x-px rounded-full font-medium">
      {#each Array(totalPage) as _, i (i)}
        <Page href={`${href}${i + 1}`} current={page === i + 1}>
          {i + 1}
        </Page>
      {/each}
      <Page current sm>Page {page} of {totalPage}</Page>
    </div>
    {#if hasNext}
      <a
        class="ml-1 flex h-12 w-12 items-center justify-center rounded-r-lg border border-gray-200 dark:border-zinc-600"
        href={`${href}${nextPage}`}
        data-sveltekit-preload-data
      >
        <div class="sr-only">次のページ</div>
        <NextIcon />
      </a>
    {/if}
  </div>
</nav>
