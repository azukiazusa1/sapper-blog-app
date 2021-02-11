<script lang="ts">
  import SearchIcon from './Icons/Search.svelte'
  export let value = ''
</script>

<div class="flex border-2 border-gray-300 dark:border-gray-600 rounded-lg">
  <input class="bg-white h-10 px-5 pr-16 text-sm rounded-l-lg focus:outline-none dark:bg-gray-800"
            type="search" name="search" placeholder="Search" />
  <button type="submit" class="flex justify-end p-2 rounded-r-lg dark:bg-gray-700">
    <SearchIcon className="text-gray-600 dark:text-gray-50 h-6 w-6" />
  </button>
</div>

<style>
::-webkit-search-cancel-button {
   -webkit-appearance: none;
}
</style>