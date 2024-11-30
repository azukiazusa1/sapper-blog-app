<script lang="ts">
  interface Props {
    href?: string;
    current: boolean;
    sm?: boolean;
    children?: import('svelte').Snippet;
  }

  let {
    href = "",
    current,
    sm = false,
    children
  }: Props = $props();

  let className = $derived(`h-12 flex ${sm ? "px-4" : "w-12"} 
  ${
    current && !sm
      ? "bg-gray-200 dark:bg-zinc-600"
      : "hover:bg-gray-100 dark:hover:bg-zinc-700"
  }
  border border-gray-200 dark:border-zinc-600 justify-center items-center cursor-pointer leading-5`);
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
