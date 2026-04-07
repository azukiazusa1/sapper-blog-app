<script lang="ts">
  interface Props {
    children?: import("svelte").Snippet;
    click: (e: MouseEvent) => void;
  }

  let { children, click }: Props = $props();
</script>

<button
  class="mouse focus:outline-hidden absolute bottom-4 right-4 z-50 flex h-16 w-16 items-center justify-center rounded-lg p-0 text-white shadow-lg transition duration-200 ease-in hover:opacity-80"
  style="background-color: var(--color-accent)"
  onclick={(e) => {
    e.stopPropagation();
    click(e);
  }}
>
  {@render children?.()}
</button>
