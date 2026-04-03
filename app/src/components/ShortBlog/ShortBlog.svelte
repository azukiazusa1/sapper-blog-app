<script lang="ts">
  import { m } from "$paraglide/messages";
  import avatarImage from "../../assets/images/azukiazusa.jpeg";
  import CopyLinkButton from "../CopyLinkButton.svelte";
  import Link from "../Link/Link.svelte";
  import Time from "../Time/Time.svelte";

  interface Props {
    title: string;
    htmlThreadItems: string[];
    backHref: string;
    shareUrl: string;
    createdAt?: string | null;
  }

  let {
    title,
    htmlThreadItems,
    backHref,
    shareUrl,
    createdAt = null,
  }: Props = $props();
</script>

<!-- eslint-disable svelte/no-at-html-tags -->
<div class="mx-auto max-w-[600px] px-4 py-6">
  <div class="mb-5">
    <Link href={backHref}>{m.shortBack()}</Link>
  </div>

  <article
    class="overflow-hidden rounded-[32px] border border-zinc-200/80 bg-white/95 shadow-[0_20px_64px_-32px_rgba(15,23,42,0.45)] dark:border-zinc-800 dark:bg-zinc-950/90"
  >
    <div class="flex gap-4 p-5 sm:p-7">
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
        {#if htmlThreadItems.length > 1}
          <div class="mt-3 w-px flex-1 bg-zinc-200 dark:bg-zinc-700"></div>
        {/if}
      </div>

      <div class="min-w-0 flex-1">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              azukiazusa
            </p>
            <h1
              class="mt-1 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
            >
              {title}
            </h1>
          </div>

          {#if createdAt}
            <div class="shrink-0 pt-1">
              <Time date={createdAt} />
            </div>
          {/if}
        </div>

        <div
          class="short-thread-content prose prose-zinc mt-5 max-w-none break-words dark:prose-invert"
        >
          {@html htmlThreadItems[0]}
        </div>

        <div class="mt-5">
          <CopyLinkButton url={shareUrl} label={m.shortCopyLink()} />
        </div>
      </div>
    </div>

    {#each htmlThreadItems.slice(1) as threadItem, index}
      <div class="flex gap-4 p-5 sm:p-7">
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
          {#if index !== htmlThreadItems.length - 2}
            <div class="mt-3 w-px flex-1 bg-zinc-200 dark:bg-zinc-700"></div>
          {/if}
        </div>

        <div class="min-w-0 flex-1 rounded-2xl bg-zinc-50 p-5 dark:bg-zinc-900">
          <p class="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            azukiazusa
          </p>
          <div
            class="short-thread-content prose prose-zinc mt-3 max-w-none break-words dark:prose-invert"
          >
            {@html threadItem}
          </div>
        </div>
      </div>
    {/each}
  </article>
</div>
