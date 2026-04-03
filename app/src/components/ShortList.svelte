<script lang="ts">
  import { m } from "$paraglide/messages";
  import { localizeHref } from "$paraglide/runtime";
  import variables from "$lib/variables";
  import avatarImage from "../assets/images/azukiazusa.jpeg";
  import CopyLinkButton from "./CopyLinkButton.svelte";
  import Link from "./Link/Link.svelte";
  import Time from "./Time/Time.svelte";
  import type { ShortListSource } from "$lib/shorts";
  import { toShortListEntry } from "$lib/shorts";

  interface Props {
    shorts?: ShortListSource[];
    expandedId?: string | null;
    showMoreHref?: string;
  }

  let {
    shorts = [],
    expandedId = null,
    showMoreHref = undefined,
  }: Props = $props();

  let items = $derived(
    shorts.map(toShortListEntry).filter((short) => short.threadCount > 0),
  );
  let currentExpandedId = $state<string | null>(null);

  const isValidId = (id: string | null): id is string =>
    !!id && items.some((item) => item.id === id);

  const getDetailPath = (id: string) => localizeHref(`/blog/shorts/${id}`);
  const getDetailUrl = (id: string) => `${variables.baseURL}/blog/shorts/${id}`;

  $effect(() => {
    currentExpandedId = isValidId(expandedId) ? expandedId : null;
  });

  const toggleThread = (id: string) => {
    currentExpandedId = currentExpandedId === id ? null : id;
  };
</script>

<!-- eslint-disable svelte/no-at-html-tags -->
<div
  class="mx-auto w-full max-w-[600px] overflow-hidden rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
>
  {#each items as item, itemIndex (item.id)}
    {@const expanded = currentExpandedId === item.id}
    <article
      class:border-t={itemIndex !== 0}
      class="overflow-hidden border-zinc-200 transition-colors dark:border-zinc-800"
    >
      <div class="flex gap-4 px-4 py-5 sm:px-5">
        <div class="flex w-12 shrink-0 flex-col items-center">
          <img
            src={avatarImage}
            alt="azukiazusa"
            class="mt-1 h-10 w-10 rounded-full object-cover"
            width="40"
            height="40"
            loading="lazy"
            decoding="async"
          />
          {#if expanded && item.threadCount > 1}
            <div class="mt-3 w-px flex-1 bg-zinc-200 dark:bg-zinc-700"></div>
          {/if}
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                azukiazusa
              </p>
              <h2 class="mt-1 min-w-0">
                <a
                  href={getDetailPath(item.id)}
                  class="text-lg font-semibold tracking-tight text-zinc-950 transition-colors hover:text-indigo-600 dark:text-zinc-50 dark:hover:text-indigo-400"
                >
                  {item.title}
                </a>
              </h2>
            </div>

            {#if item.createdAt}
              <div class="shrink-0 pt-0.5">
                <Time date={item.createdAt} />
              </div>
            {/if}
          </div>

          <button
            type="button"
            class="mt-4 w-full text-left"
            aria-controls={"thread-" + item.id}
            aria-expanded={expanded}
            aria-label={item.title}
            onclick={() => toggleThread(item.id)}
          >
            <div
              class="prose prose-zinc max-w-none break-words text-[15px] leading-7 dark:prose-invert"
            >
              {@html item.htmlThreadItems[0]}
            </div>
          </button>

          <div
            class="mt-4 flex items-center gap-3 text-xs font-medium text-zinc-500 dark:text-zinc-400"
          >
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-3 py-1.5 transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
              aria-controls={"thread-" + item.id}
              aria-expanded={expanded}
              onclick={() => toggleThread(item.id)}
            >
              <span
                >{expanded ? m.shortCloseThread() : m.shortOpenThread()}</span
              >
              <span>{item.threadCount}</span>
            </button>
            <CopyLinkButton url={getDetailUrl(item.id)} />
          </div>

          {#if expanded && item.threadCount > 1}
            <div id={"thread-" + item.id} class="mt-4">
              {#each item.htmlThreadItems.slice(1) as threadItem, index}
                <div class="flex gap-4 py-4">
                  <div class="flex w-12 shrink-0 flex-col items-center">
                    <img
                      src={avatarImage}
                      alt="azukiazusa"
                      class="mt-1 h-8 w-8 rounded-full object-cover"
                      width="32"
                      height="32"
                      loading="lazy"
                      decoding="async"
                    />
                    {#if index !== item.threadCount - 2}
                      <div
                        class="mt-3 w-px flex-1 bg-zinc-200 dark:bg-zinc-700"
                      ></div>
                    {/if}
                  </div>

                  <div class="min-w-0 flex-1">
                    <p
                      class="text-sm font-semibold text-zinc-950 dark:text-zinc-50"
                    >
                      azukiazusa
                    </p>
                    <div
                      class="prose prose-zinc mt-2 max-w-none break-words text-[15px] leading-7 dark:prose-invert"
                    >
                      {@html threadItem}
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    </article>
  {/each}

  {#if showMoreHref}
    <div class="border-t border-zinc-200 px-4 py-4 dark:border-zinc-800">
      <Link href={showMoreHref}>もっと見る</Link>
    </div>
  {/if}
</div>
