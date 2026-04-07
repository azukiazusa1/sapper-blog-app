<script lang="ts">
  import { m } from "$paraglide/messages";
  import { localizeHref } from "$paraglide/runtime";

  interface Props {
    name?: string;
    slug?: string;
    count?: number;
    children?: import("svelte").Snippet;
  }

  let { name = "", slug = "", count, children }: Props = $props();
</script>

{#if count !== undefined}
  <!-- タグ一覧ページでの大きなタグカード -->
  <a href={localizeHref(`/tags/${slug}`)} class="block h-full w-full">
    <div
      class="h-full rounded-lg bg-stone-50 transition-colors hover:bg-stone-100 overflow-hidden flex flex-col dark:bg-stone-950 dark:hover:bg-stone-900 border border-stone-200 dark:border-stone-700"
    >
      <div
        class="p-3 flex items-center justify-center border-b border-stone-200 dark:border-stone-800"
        style="background-color: color-mix(in srgb, var(--color-accent) 10%, transparent)"
      >
        <span
          class="font-mono text-sm font-medium"
          style="color: var(--color-accent)">#{name}</span
        >
      </div>
      <div class="p-4 flex-1 flex items-center justify-center">
        <div class="text-center">
          <span
            class="block text-xl font-bold text-stone-700 dark:text-stone-200"
            >{count}</span
          >
          <span class="text-xs text-stone-500 dark:text-stone-400"
            >{m.tagArticlesCountLabel()}</span
          >
        </div>
      </div>
    </div>
  </a>
{:else}
  <!-- 記事内の小さなタグ -->
  <a
    href={localizeHref(`/tags/${slug}`)}
    class="inline-flex items-center rounded bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 px-2 py-0.5 font-mono text-xs font-medium text-stone-700 dark:text-stone-300 transition-colors"
  >
    #{name}
    {@render children?.()}
  </a>
{/if}
