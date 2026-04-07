<script lang="ts">
  import { localizeHref } from "$paraglide/runtime";

  interface Props {
    href?: string;
    current: boolean;
    sm?: boolean;
    children?: import("svelte").Snippet;
  }

  let { href = "", current, sm = false, children }: Props = $props();

  let className = $derived(
    `h-12 flex ${
      sm ? "px-4" : "w-12"
    } rounded-lg justify-center items-center cursor-pointer leading-5 font-medium transition-colors border ${
      current && !sm
        ? "bg-stone-800 text-white border-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:border-stone-100"
        : "bg-white border-stone-200 hover:bg-stone-100 dark:bg-stone-900 dark:border-stone-800 dark:hover:bg-stone-800"
    }`,
  );
</script>

{#if href}
  <a
    href={localizeHref(href)}
    class={className}
    aria-current={current ? "page" : undefined}
  >
    {@render children?.()}
  </a>
{:else}
  <div class={className} aria-current={current ? "page" : undefined}>
    {@render children?.()}
  </div>
{/if}
