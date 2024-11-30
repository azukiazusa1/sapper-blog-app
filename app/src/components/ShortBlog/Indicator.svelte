<script lang="ts">
  interface Props {
    active: boolean;
  }

  let { active }: Props = $props();
</script>

<div
  class="w-4 flex-1 rounded-md bg-slate-700 duration-150 ease-linear data-[active]:bg-white"
  data-active={active ? true : undefined}
></div>
