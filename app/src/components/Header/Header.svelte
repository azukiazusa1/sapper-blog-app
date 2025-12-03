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
  import { SHOW_RECAP_INDICATOR } from "$lib/config";
  import type { Route } from "$lib/types";

  let routes: Route[] = [
    { path: "/blog" },
    { path: "/about" },
    { path: "/talks" },
    { path: "/recap", showIndicator: SHOW_RECAP_INDICATOR }
  ];
  let html: HTMLElement;
  let lastScrollY = 0;
  let hideHeader = $state(false);
  let isScrolled = $state(false);

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
    // ガラス効果の制御
    isScrolled = window.scrollY > 0;

    // 上にスクロールしたらヘッダーを表示する
    if (window.scrollY < lastScrollY) {
      hideHeader = false;
    } else if (window.scrollY > 100) {
      // 少しスクロールしたら隠す
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
  class={`sticky left-0 z-50 w-full transition-all duration-300 ease-in-out
    ${hideHeader ? "-top-20" : "top-0"}
  `}
>
  <div class="mx-auto px-4 py-3 transition-all duration-500 ease-in-out">
    <div
      class={`flex mx-auto items-center justify-between rounded-full px-4 py-2 transition-all duration-300 lg:w-max
        ${
          isScrolled
            ? "bg-white/40 dark:bg-zinc-800/40 backdrop-blur-2xl shadow-lg border border-gray-300/50 dark:border-zinc-600/50 dark:shadow-zinc-900/40"
            : "bg-white/95 dark:bg-zinc-800/95 backdrop-blur-lg shadow-md border border-gray-200 dark:border-zinc-700 dark:shadow-zinc-900/20"
        }
      `}
    >
      <div class="flex items-center">
        <button
          class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 lg:invisible lg:hidden dark:bg-zinc-700 dark:hover:bg-zinc-600 transition-all duration-300"
          onclick={openSideMenu}
          aria-label="サイドメニューを開く"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
      </div>

      <div class="ml-2">
        <Title />
      </div>

      <div class="invisible hidden lg:visible lg:block">
        <Nav {segment} {routes} />
      </div>

      <div class="flex items-center gap-1">
        <div>
          <SearchDialog>
            <div class={`invisible hidden md:visible md:block`}>
              <SearchBar />
            </div>
            <div class="md:invisible md:hidden">
              <SearchIcon className="h-5 w-5" />
            </div>
          </SearchDialog>
        </div>

        <div class="invisible hidden items-center md:visible md:flex">
          <div class="mx-2">
            <ToggleDarkMode />
          </div>
          <a
            href="/rss.xml"
            target="_blank"
            class={`invisible mx-1 hidden rounded-full p-2 hover:bg-gray-100 lg:visible lg:block dark:hover:bg-zinc-700 transition-all duration-300 p-2`}
            rel="noopener noreferrer"
            aria-label="RSS"
          >
            <RssIcon className="h-5 w-5" />
          </a>
          <a
            href="/llms.txt"
            target="_blank"
            class={`invisible mx-1 hidden rounded-full hover:bg-gray-100 lg:visible lg:block dark:hover:bg-zinc-700 transition-all duration-300 p-2`}
            rel="noopener noreferrer"
            aria-label="LLMS"
          >
            <Robot className="h-5 w-5" />
          </a>
          <a
            href="https://github.com/azukiazusa1/sapper-blog-app"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            class={`invisible mx-1 hidden rounded-full hover:bg-gray-100 lg:visible lg:block dark:hover:bg-zinc-700 transition-all duration-300 p-2`}
          >
            <GitHub className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  </div>
</header>
