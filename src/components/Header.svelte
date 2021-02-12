<script lang="ts">
  import SearchBar from './SearchBar.svelte'
  import Nav from './Nav.svelte'
  import MoonIcon from './Icons/Moon.svelte'
  import SunIcon from './Icons/Sun.svelte'
  import SearchIcon from './Icons/Search.svelte'
  import { createEventDispatcher } from 'svelte'

  export let segment: string
  export let darkMode: boolean

  const dispatch = createEventDispatcher()

  const handleMoonClick = () => {
    dispatch('clickMoon')
  }
</script>

<header
  class="top-0 lef-0 w-full z-40 bg-white dark:bg-gray-700 shadow fixed border-b border-gray-200 dark:border-gray-600"
>
  <div class="px-6 h-16 flex justify-between items-center">
    <span class="font-semibold text-lg md:text-xl tracking-wide">
      <a href="/"> azukiazusaのテックブログ2 </a>
    </span>
    <div class="hidden md:block">
      <SearchBar />
    </div>
    <div class="hidden md:block">
      <Nav {segment} />
    </div>
    <div class="flex">
      <SearchIcon className="h-6 w-6 cursor-pointer md:hidden mr-3" />
      {#if darkMode}
        <SunIcon className="h-6 w-6 cursor-pointer" on:click={handleMoonClick} />
      {:else}
        <MoonIcon className="h-6 w-6 cursor-pointer" on:click={handleMoonClick} />
      {/if}
    </div>
  </div>
</header>
