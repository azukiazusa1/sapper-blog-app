<script lang="ts">
  export let active: boolean;
</script>

<div
  class=" data-active:block hidden h-full w-full"
  data-active={active ? true : undefined}
>
  <slot />
</div>
