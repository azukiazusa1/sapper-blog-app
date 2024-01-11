<script lang="ts">
  export let active: boolean;
</script>

<div
  class=" hidden h-full w-full data-[active]:block"
  data-active={active ? true : undefined}
>
  <slot />
</div>
