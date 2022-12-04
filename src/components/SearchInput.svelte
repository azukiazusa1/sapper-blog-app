<script lang="ts">
  import SearchIcon from './Icons/Search.svelte'
  export let value = ''
</script>

<div class="flex border-2 border-gray-300 dark:border-gray-600 rounded-lg w-full">
  <input
    bind:value
    on:focus
    on:blur
    class="bg-white h-10 px-5 pr-16 text-sm rounded-l-lg focus:outline-none dark:bg-gray-800 w-full"
    type="search"
    name="search"
    placeholder="Search"
    autocomplete="off"
    aria-label="search"
  />
  <button type="submit" class="flex justify-end p-2 rounded-r-lg dark:bg-gray-700" aria-label="検索">
    <SearchIcon className="text-gray-600 dark:text-gray-50 h-6 w-6" />
  </button>
</div>

<style>
  ::-webkit-search-cancel-button {
    -webkit-appearance: none;
  }
</style>
