<script lang="ts">
  import SearchBar from '../SearchBar.svelte'
  import Nav from './Nav.svelte'
  import Title from './Title.svelte'
  import MoonIcon from '../Icons/Moon.svelte'
  import SunIcon from '../Icons/Sun.svelte'
  import SearchIcon from '../Icons/Search.svelte'
  import MenuIcon from '../Icons/Menu.svelte'
  import RsssIcon from '../Icons/Rss.svelte'
  import { createEventDispatcher } from 'svelte'
  import SideMenu from './SideMenu.svelte'
  import GitHub from '../Icons/GitHub.svelte'

  let routes = ['/blog', '/about', '/tags']

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

<header class="top-0 left-0 w-full bg-white dark:bg-gray-700 shadow border-b border-gray-200 dark:border-gray-600">
  <SideMenu {isOpen} {segment} {routes} on:close={closeSideMenu} />
  <div class="px-6 h-16 flex justify-between items-center">
    <div class="md:invisible md:hidden">
      <button on:click={openSideMenu} aria-label="サイドメニューを開く">
        <MenuIcon className="h-6 w-6" />
      </button>
    </div>
    <Title />
    <div class="invisible hidden md:visible md:block">
      <SearchBar />
    </div>
    <div class="invisible hidden md:visible md:block">
      <Nav {segment} {routes} />
    </div>
    <div class="flex">
      <a href="/blog/search" class="md:invisible md:hidden mx-2" aria-label="検索ページ">
        <SearchIcon className="h-6 w-6" />
      </a>
      <button
        on:click={handleMoonClick}
        aria-label={`${darkMode ? 'ライトモードに切り替える' : 'ダークモードに切り替える'}`}
        class="mx-2"
      >
        {#if darkMode}
          <SunIcon className="h-6 w-6" />
        {:else}
          <MoonIcon className="h-6 w-6" />
        {/if}
      </button>
      <a href="/rss.xml" target="_blank" class="mx-2" rel="noopener noreferrer" aria-label="RSS">
        <RsssIcon className="h-6 w-6" />
      </a>
      <a
        href="https://github.com/azukiazusa1/sapper-blog-app"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        class="mx-2"
      >
        <GitHub className="h-6 w-6" />
      </a>
    </div>
  </div>
</header>
