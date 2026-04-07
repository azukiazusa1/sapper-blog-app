<script lang="ts">
  import { m } from "$paraglide/messages";
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
  import {
    localizeHref,
    deLocalizeHref,
    getLocale,
    locales,
    localStorageKey,
  } from "$paraglide/runtime";

  let routes = ["/blog", "/about", "/talks", "/recap"];
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
  let baseHref = $derived(deLocalizeHref(segment));
  let currentLocale = $derived(getLocale());

  const handleScroll = () => {
    if (window.scrollY < lastScrollY) {
      hideHeader = false;
    } else if (window.scrollY > 100) {
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
  class={`sticky left-0 z-50 w-full transition-all duration-300 ease-in-out bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800
    ${hideHeader ? "-top-20" : "top-0"}
  `}
>
  <div class="mx-auto px-4 py-3">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <button
          class="flex h-9 w-9 items-center justify-center rounded bg-stone-100 hover:bg-stone-200 lg:invisible lg:hidden dark:bg-stone-800 dark:hover:bg-stone-700 transition-colors"
          onclick={openSideMenu}
          aria-label={m.openSideMenu()}
        >
          <MenuIcon className="h-5 w-5" />
        </button>
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
          <div
            class="mx-1 flex items-center overflow-hidden rounded border border-stone-200 dark:border-stone-700"
          >
            {#each locales as locale}
              <a
                href={localizeHref(baseHref, { locale })}
                data-sveltekit-reload
                onclick={() => localStorage.setItem(localStorageKey, locale)}
                class={`px-2 py-1 text-xs font-mono font-medium uppercase transition-colors ${
                  currentLocale === locale
                    ? "bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900"
                    : "hover:bg-stone-100 dark:hover:bg-stone-800"
                }`}
                aria-label={`Switch to ${locale}`}>{locale}</a
              >
            {/each}
          </div>
          <a
            href={localizeHref("/rss.xml")}
            target="_blank"
            class={`invisible mx-1 hidden rounded p-2 hover:bg-stone-100 lg:visible lg:block dark:hover:bg-stone-800 transition-colors`}
            rel="noopener noreferrer"
            aria-label="RSS"
          >
            <RssIcon className="h-5 w-5" />
          </a>
          <a
            href={localizeHref("/llms.txt")}
            target="_blank"
            class={`invisible mx-1 hidden rounded hover:bg-stone-100 lg:visible lg:block dark:hover:bg-stone-800 transition-colors p-2`}
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
            class={`invisible mx-1 hidden rounded hover:bg-stone-100 lg:visible lg:block dark:hover:bg-stone-800 transition-colors p-2`}
          >
            <GitHub className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  </div>
</header>
