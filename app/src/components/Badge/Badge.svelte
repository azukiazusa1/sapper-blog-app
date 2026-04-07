<script lang="ts">
  interface Props {
    children?: import("svelte").Snippet;
  }

  let { children }: Props = $props();
</script>

<span
  class="ml-2 inline-flex items-center justify-center rounded bg-stone-700 px-2 py-0.5 font-mono text-xs font-bold leading-none text-white"
>
  {@render children?.()}
</span>
