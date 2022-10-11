<script lang="ts">
  import SearchBar from './SearchBar.svelte'
  import Nav from './Nav.svelte'
  import Title from './Title.svelte'
  import MoonIcon from './Icons/Moon.svelte'
  import SunIcon from './Icons/Sun.svelte'
  import SearchIcon from './Icons/Search.svelte'
  import MenuIcon from './Icons/Menu.svelte'
  import { createEventDispatcher } from 'svelte'
  import SideMenu from './SideMenu.svelte'

  let routes = ['/blog', '/about', '/tags', '/rss.xml']

  export let segment: string
  export let darkMode: boolean

  let isOpen = false

  const openSideMenu = () => {
    isOpen = true
  }

  const closeSideMenu = () => {
    isOpen = false
  }

  const dispatch = createEventDispatcher()
  const handleMoonClick = () => {
    dispatch('clickMoon')
  }
</script>

<header
  class="top-0 lef-0 w-full z-40 bg-white dark:bg-gray-700 shadow fixed border-b border-gray-200 dark:border-gray-600"
>
  <SideMenu {isOpen} {segment} {routes} on:click={closeSideMenu} />
  <div class="px-6 h-16 flex justify-between items-center">
    <div class="md:hidden">
      <MenuIcon className="h-6 w-6 cursor-pointer" on:click={openSideMenu} />
    </div>
    <Title />
    <div class="hidden md:block">
      <SearchBar />
    </div>
    <div class="hidden md:block">
      <Nav {segment} {routes} />
    </div>
    <div class="flex">
      <a href="/blog/search">
        <SearchIcon className="h-6 w-6 cursor-pointer md:hidden mr-3" />
      </a>
      {#if darkMode}
        <SunIcon className="h-6 w-6 cursor-pointer" on:click={handleMoonClick} />
      {:else}
        <MoonIcon className="h-6 w-6 cursor-pointer" on:click={handleMoonClick} />
      {/if}
    </div>
  </div>
</header>
