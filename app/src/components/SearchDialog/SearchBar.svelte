<script lang="ts">
  import SearchIcon from "../Icons/Search.svelte";
</script>

<div
  class="flex w-full rounded-lg border-2 border-gray-300 dark:border-zinc-700 dark:bg-zinc-900"
>
  <span class="flex items-center justify-end rounded-r-lg p-2">
    <SearchIcon className="text-gray-600 dark:text-gray-50 h-4 w-4" />
  </span>
  <div
    class="flex h-10 w-60 items-center rounded-l-lg pr-5 opacity-60 focus:outline-none"
  >
    検索
  </div>
</div>
