<script lang="ts">
  import SearchIcon from "../Icons/Search.svelte";
  export let value = "";
  export let required = false;
</script>

<div
  class="flex w-full rounded-lg border-2 border-gray-300 dark:border-zinc-700"
>
  <input
    bind:value
    on:focus
    on:blur
    class="h-10 w-full rounded-l-lg px-5 pr-16 focus:outline-none dark:bg-zinc-900"
    type="search"
    name="q"
    placeholder="Search"
    autocomplete="off"
    aria-label="search"
    enterkeyhint="search"
    {required}
  />
  <button
    type="submit"
    class="flex justify-end rounded-r-lg p-2"
    aria-label="検索"
  >
    <SearchIcon className="text-gray-600 dark:text-gray-50 h-6 w-6" />
  </button>
</div>

<style>
  ::-webkit-search-cancel-button {
    -webkit-appearance: none;
  }
</style>
