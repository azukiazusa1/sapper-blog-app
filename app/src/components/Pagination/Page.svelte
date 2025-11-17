<script lang="ts">
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
    } rounded-full justify-center items-center cursor-pointer leading-5 font-medium transition-all duration-200 ${
      current && !sm
        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white dark:from-indigo-500 dark:to-purple-500"
        : "bg-white hover:bg-indigo-50 hover:text-indigo-600 dark:bg-zinc-900 dark:hover:bg-indigo-900/50 dark:hover:text-indigo-400"
    }`,
  );
</script>

{#if href}
  <a {href} class={className} aria-current={current ? "page" : undefined}>
    {@render children?.()}
  </a>
{:else}
  <div class={className} aria-current={current ? "page" : undefined}>
    {@render children?.()}
  </div>
{/if}
