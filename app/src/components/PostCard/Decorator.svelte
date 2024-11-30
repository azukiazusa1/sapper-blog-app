<script lang="ts">
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<div class="mb-4 mt-1 w-full px-1 md:w-1/2 lg:my-4 lg:w-1/3 lg:px-4">
  {@render children?.()}
</div>
