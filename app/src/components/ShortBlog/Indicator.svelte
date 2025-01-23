<script lang="ts">
  export let active: boolean;
</script>

<div
  class="data-active:bg-white w-4 flex-1 rounded-md bg-slate-700 duration-150 ease-linear"
  data-active={active ? true : undefined}
/>
