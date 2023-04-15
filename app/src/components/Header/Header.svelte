<script lang="ts">
  import SearchBar from '../SearchBar.svelte'
  import Nav from './Nav.svelte'
  import Title from './Title.svelte'
  import ToggleDarkMode from './ToggleDarkMode.svelte'
  import SearchIcon from '../Icons/Search.svelte'
  import MenuIcon from '../Icons/Menu.svelte'
  import RssIcon from '../Icons/Rss.svelte'
  import { onMount } from 'svelte'
  import SideMenu from './SideMenu.svelte'
  import GitHub from '../Icons/GitHub.svelte'

  let routes = ['/blog', '/about', '/tags', '/drafts']
  let html: HTMLElement
  let lastScrollY = 0
  let hideHeader = false

  onMount(() => {
    html = document.documentElement
    if (window.screenY > 0) {
      hideHeader = true
    }
  })

  export let segment: string
  let isOpen = false

  const handleScroll = () => {
    // 上にスクロールしたらヘッダーを表示する
    if (window.scrollY < lastScrollY) {
      hideHeader = false
    } else {
      hideHeader = true
    }
    lastScrollY = window.scrollY
  }

  const openSideMenu = () => {
    isOpen = true
    html.classList.add('overflow-hidden')
  }

  const closeSideMenu = () => {
    isOpen = false
    html.classList.remove('overflow-hidden')
  }
</script>

<svelte:window on:scroll={handleScroll} />

<SideMenu {isOpen} {segment} {routes} on:close={closeSideMenu} />
<header
  class={`sticky md:static left-0 w-full backdrop-blur border-b border-gray-200 dark:border-zinc-700 transition-all ease-in-out duration-300 z-10
    ${hideHeader ? '-top-14 md:top-0' : 'top-0'}
  `}
>
  <div class="px-6 h-12 md:h-14 flex justify-between items-center">
    <button class="lg:invisible lg:hidden" on:click={openSideMenu} aria-label="サイドメニューを開く">
      <MenuIcon className="h-6 w-6" />
    </button>
    <Title />
    <div class="invisible hidden md:visible md:block">
      <SearchBar />
    </div>
    <div class="invisible hidden lg:visible lg:block">
      <Nav {segment} {routes} />
    </div>
    <div class="flex items-center">
      <a href="/blog/search" class="md:invisible md:hidden mx-2" aria-label="検索ページ">
        <SearchIcon className="h-6 w-6" />
      </a>
      <div class="mx-2 invisible hidden md:visible md:block">
        <ToggleDarkMode />
      </div>
      <a
        href="/rss.xml"
        target="_blank"
        class="mx-2 invisible hidden lg:visible lg:block"
        rel="noopener noreferrer"
        aria-label="RSS"
      >
        <RssIcon className="h-6 w-6" />
      </a>
      <a
        href="https://github.com/azukiazusa1/sapper-blog-app"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        class="mx-2 invisible hidden lg:visible lg:block"
      >
        <GitHub className="h-6 w-6" />
      </a>
    </div>
  </div>
</header>
