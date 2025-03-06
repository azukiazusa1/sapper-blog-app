<script lang="ts">
  import Nav from "./Nav.svelte";
  import Title from "./Title.svelte";
  import ToggleDarkMode from "./ToggleDarkMode.svelte";
  import SearchIcon from "../Icons/Search.svelte";
  import MenuIcon from "../Icons/Menu.svelte";
  import RssIcon from "../Icons/Rss.svelte";
  import { onMount } from "svelte";
  import SideMenu from "./SideMenu.svelte";
  import GitHub from "../Icons/GitHub.svelte";
  import Robot from "../Icons/Robot.svelte";
  import SearchDialog from "../SearchDialog/SearchDialog.svelte";
  import SearchBar from "../SearchDialog/SearchBar.svelte";

  let routes = ["/blog", "/about", "/tags", "/recap"];
  let html: HTMLElement;
  let lastScrollY = 0;
  let hideHeader = $state(false);

  onMount(() => {
    html = document.documentElement;
    if (window.screenY > 0) {
      hideHeader = true;
    }
  });

  interface Props {
    segment: string;
  }

  let { segment }: Props = $props();
  let isOpen = $state(false);

  const handleScroll = () => {
    // 上にスクロールしたらヘッダーを表示する
    if (window.scrollY < lastScrollY) {
      hideHeader = false;
    } else {
      hideHeader = true;
    }
    lastScrollY = window.scrollY;
  };

  const openSideMenu = () => {
    isOpen = true;
    html.classList.add("overflow-hidden");
  };

  const closeSideMenu = () => {
    isOpen = false;
    html.classList.remove("overflow-hidden");
  };
</script>

<svelte:window onscroll={handleScroll} />

<SideMenu {isOpen} {segment} {routes} on:close={closeSideMenu} />
<header
  class={`sticky left-0 z-10 w-full border-b border-gray-200 backdrop-blur transition-all duration-300 ease-in-out md:static dark:border-zinc-700
    ${hideHeader ? "-top-14 md:top-0" : "top-0"}
  `}
>
  <div class="flex h-12 items-center justify-between px-6 md:h-14">
    <button
      class="lg:invisible lg:hidden"
      onclick={openSideMenu}
      aria-label="サイドメニューを開く"
    >
      <MenuIcon className="h-6 w-6" />
    </button>
    <Title />
    <div>
      <SearchDialog>
        <div class="invisible hidden md:visible md:block">
          <SearchBar />
        </div>
        <div class="md:invisible md:hidden">
          <SearchIcon className="h-6 w-6" />
        </div>
      </SearchDialog>
    </div>
    <div class="invisible hidden lg:visible lg:block">
      <Nav {segment} {routes} />
    </div>
    <div class="invisible hidden items-center md:visible md:flex">
      <div class="mx-2">
        <ToggleDarkMode />
      </div>
      <a
        href="/rss.xml"
        target="_blank"
        class="invisible mx-2 hidden lg:visible lg:block"
        rel="noopener noreferrer"
        aria-label="RSS"
      >
        <RssIcon className="h-6 w-6" />
      </a>
      <a
        href="/llms.txt"
        target="_blank"
        class="invisible mx-2 hidden lg:visible lg:block"
        rel="noopener noreferrer"
        aria-label="LLMS"
      >
        <Robot className="h-6 w-6" />
      </a>
      <a
        href="https://github.com/azukiazusa1/sapper-blog-app"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        class="invisible mx-2 hidden lg:visible lg:block"
      >
        <GitHub className="h-6 w-6" />
      </a>
    </div>
  </div>
</header>
