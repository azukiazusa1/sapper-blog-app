<script lang="ts">
  import PrevIcon from "../Icons/Prev.svelte";
  import NextIcon from "../Icons/Next.svelte";
  import Page from "./Page.svelte";
  import Ellipsis from "./Ellipsis.svelte";
  import { getPages } from "./getPages";

  interface Props {
    page?: number;
    total: number;
    limit: number;
    href?: string;
  }

  let { page = 1, total, limit, href = "/blog/page/" }: Props = $props();

  let totalPage = $derived(Math.ceil(total / limit));
  let hasPrev = $derived(page !== 1);
  let hasNext = $derived(page !== totalPage && totalPage !== 0);
  let prevPage = $derived(page - 1);
  let nextPage = $derived(page + 1);
</script>

<nav class="my-20 flex flex-col items-center" aria-label="ページネーション">
  <div class="flex items-center gap-2">
    {#if hasPrev}
      <a
        class="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-zinc-800 dark:hover:bg-indigo-900/50 dark:hover:text-indigo-400"
        href={`${href}${prevPage}`}
      >
        <div class="sr-only">前のページ</div>
        <PrevIcon className="h-6 w-6" />
      </a>
    {/if}
    <div class="hidden gap-2 font-medium md:flex">
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
    <div class="flex md:hidden">
      <div
        class="flex h-12 items-center justify-center rounded-full bg-white px-4 shadow-md dark:bg-zinc-800"
      >
        <span class="font-medium">Page {page} of {totalPage}</span>
      </div>
    </div>
    {#if hasNext}
      <a
        class="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-zinc-800 dark:hover:bg-indigo-900/50 dark:hover:text-indigo-400"
        href={`${href}${nextPage}`}
      >
        <div class="sr-only">次のページ</div>
        <NextIcon />
      </a>
    {/if}
  </div>
</nav>
