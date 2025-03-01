<script lang="ts">
  interface Props {
    children?: import("svelte").Snippet;
  }

  let { children }: Props = $props();
</script>

<div class="p-2" style="height: 100vh;">
  <div
    class="bg-linear-to-r absolute left-0 top-0 z-20 h-full w-full from-blue-400 via-purple-500 to-pink-500 text-white"
  >
    {@render children?.()}
  </div>
</div>
