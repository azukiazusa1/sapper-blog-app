<script lang="ts">
  export let value = ''
</script>

<div class="flex border-2 border-gray-300 dark:border-gray-600 rounded-lg">
  <input class="bg-white h-10 px-5 pr-16 text-sm rounded-l-lg focus:outline-none dark:bg-gray-800"
            type="search" name="search" placeholder="Search" />
  <button type="submit" class="flex justify-end p-2 rounded-r-lg dark:bg-gray-700">
    <svg class="text-gray-600 dark:text-gray-50 h-6 w-6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
    </svg>
  </button>
</div>

<style>
::-webkit-search-cancel-button {
   -webkit-appearance: none;
}
</style>