<script lang="ts">
  interface Props {
    active: boolean;
    children?: import("svelte").Snippet;
  }

  let { active, children }: Props = $props();
</script>

<div
  class=" data-active:block hidden h-full w-full"
  data-active={active ? true : undefined}
>
  {@render children?.()}
</div>
