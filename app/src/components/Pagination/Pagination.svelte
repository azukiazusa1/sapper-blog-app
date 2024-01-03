<script lang="ts">
  import PrevIcon from "../Icons/Prev.svelte";
  import NextIcon from "../Icons/Next.svelte";
  import Page from "./Page.svelte";
  import Ellipsis from "./Ellipsis.svelte";
  import { getPages } from "./getPages";

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
      >
        <div class="sr-only">前のページ</div>
        <PrevIcon className="h-6 w-6" />
      </a>
    {/if}
    <div class="flex -space-x-px rounded-full font-medium">
      {#each getPages({ page, totalPage }) as p}
        {#if p.type === "page"}
          <Page href={`${href}${p.value}`} current={p.current}>
            {p.value}
          </Page>
        {:else}
          <Ellipsis />
        {/if}
      {/each}
    </div>
    {#if hasNext}
      <a
        class="ml-1 flex h-12 w-12 items-center justify-center rounded-r-lg border border-gray-200 dark:border-zinc-600"
        href={`${href}${nextPage}`}
      >
        <div class="sr-only">次のページ</div>
        <NextIcon />
      </a>
    {/if}
  </div>
</nav>
