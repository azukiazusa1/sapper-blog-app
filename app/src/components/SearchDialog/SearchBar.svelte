<script lang="ts">
  import SearchIcon from "../Icons/Search.svelte";
</script>

<div
  class="flex w-full rounded border-2 border-stone-200 dark:border-stone-700 dark:bg-stone-900"
>
  <span class="flex items-center justify-end rounded-r-lg p-2">
    <SearchIcon className="text-stone-600 dark:text-stone-50 h-4 w-4" />
  </span>
  <div
    class="flex h-10 w-60 items-center justify-between rounded-l-lg pr-4 opacity-80 focus:outline-hidden"
  >
    Search

    <div>
      <kbd class="font-sans">⌘</kbd>
      <kbd class="font-sans">K</kbd>
    </div>
  </div>
</div>
