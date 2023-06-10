<script lang="ts">
  import { isMatchPath } from "$lib/utils";
  import { createEventDispatcher } from "svelte";
  import Title from "./Title.svelte";
  import ToggleDarkMode from "./ToggleDarkMode.svelte";
  import GitHub from "../Icons/GitHub.svelte";
  import RssIcon from "../Icons/Rss.svelte";

  const dispatch = createEventDispatcher<{
    close: void;
    clickMoon: void;
  }>();

  const close = () => {
    dispatch("close");
  };

  function handleWindowKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      close();
    }
  }

  export let isOpen = false;
  export let segment: string;
  export let routes: string[];
</script>

<svelte:window on:keydown={handleWindowKeyDown} />
{#if isOpen}
  <!-- eslint-disable-next-line svelte/valid-compile -->
  <div
    on:click|self={close}
    class="fixed inset-0 z-10 overflow-y-auto bg-zinc-900 opacity-50"
  />
{/if}
<aside
  class={`fixed left-0 top-0 z-30 flex h-full w-64 transform flex-col justify-between overflow-auto border-r border-gray-200 bg-white transition-all duration-300 ease-in-out dark:border-zinc-700 dark:bg-zinc-800 ${
    isOpen ? "visible translate-x-0 " : "invisible -translate-x-full"
  }`}
>
  <div>
    <div
      class="flex h-12 w-full items-center justify-between border-b border-gray-200 p-2 dark:border-zinc-700"
    >
      <Title />
      <ToggleDarkMode right={true} />
    </div>
    <ul>
      {#each routes as route}
        <li class="py-4">
          <a
            on:click={close}
            aria-current={isMatchPath(route, segment) ? "page" : undefined}
            href={route}
            class="block px-7 capitalize hover:opacity-75"
          >
            {route.slice(1)}
          </a>
        </li>
      {/each}
    </ul>
  </div>
  <div
    class="flex w-full items-center border-t border-gray-200 p-4 dark:border-zinc-700"
  >
    <a
      href="/rss.xml"
      target="_blank"
      class="mr-2"
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
      class="mx-2"
    >
      <GitHub className="h-6 w-6" />
    </a>
  </div>
</aside>

<style>
  [aria-current="page"] {
    position: relative;
  }

  [aria-current="page"]::after {
    position: absolute;
    content: "";
    width: 2.5rem;
    height: 2px;
    background-color: #df3600;
    display: block;
    bottom: -8px;
  }
</style>
