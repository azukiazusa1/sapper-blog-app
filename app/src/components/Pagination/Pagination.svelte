<script lang="ts">
  import { m } from "$paraglide/messages";
  import PrevIcon from "../Icons/Prev.svelte";
  import NextIcon from "../Icons/Next.svelte";
  import Page from "./Page.svelte";
  import Ellipsis from "./Ellipsis.svelte";
  import { getPages } from "./getPages";
  import { localizeHref } from "$paraglide/runtime";

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

<nav
  class="my-20 flex flex-col items-center"
  aria-label={m.paginationNavLabel()}
>
  <div class="flex items-center gap-2">
    {#if hasPrev}
      <a
        class="flex h-12 w-12 items-center justify-center rounded-lg bg-white border border-stone-200 transition-colors hover:bg-stone-100 dark:bg-stone-900 dark:border-stone-800 dark:hover:bg-stone-800"
        href={localizeHref(`${href}${prevPage}`)}
      >
        <div class="sr-only">{m.paginationPrev()}</div>
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
        class="flex h-12 items-center justify-center rounded-lg bg-white border border-stone-200 px-4 dark:bg-stone-900 dark:border-stone-800"
      >
        <span class="font-medium"
          >{m.paginationMobileLabel({
            page: String(page),
            totalPage: String(totalPage),
          })}</span
        >
      </div>
    </div>
    {#if hasNext}
      <a
        class="flex h-12 w-12 items-center justify-center rounded-lg bg-white border border-stone-200 transition-colors hover:bg-stone-100 dark:bg-stone-900 dark:border-stone-800 dark:hover:bg-stone-800"
        href={localizeHref(`${href}${nextPage}`)}
      >
        <div class="sr-only">{m.paginationNext()}</div>
        <NextIcon />
      </a>
    {/if}
  </div>
</nav>
