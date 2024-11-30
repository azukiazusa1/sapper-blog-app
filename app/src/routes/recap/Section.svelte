<script lang="ts">
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<div class="flex items-center justify-center p-2" style="height: 100vh;">
  {@render children?.()}
</div>
