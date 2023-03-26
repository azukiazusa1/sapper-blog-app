<script lang="ts">
  import SearchIcon from '../Icons/Search.svelte'
  export let value = ''
</script>

<div class="flex border-2 border-gray-300 dark:border-zinc-700 rounded-lg w-full">
  <input
    bind:value
    on:focus
    on:blur
    class="h-10 px-5 pr-16 rounded-l-lg focus:outline-none w-full dark:bg-zinc-900"
    type="search"
    name="search"
    placeholder="Search"
    autocomplete="off"
    aria-label="search"
    enterkeyhint="search"
  />
  <button type="submit" class="flex justify-end p-2 rounded-r-lg" aria-label="検索">
    <SearchIcon className="text-gray-600 dark:text-gray-50 h-6 w-6" />
  </button>
</div>

<style>
  ::-webkit-search-cancel-button {
    -webkit-appearance: none;
  }
</style>
