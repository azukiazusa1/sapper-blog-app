<script lang="ts">
  import { self } from "svelte/legacy";

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

  interface Props {
    isOpen?: boolean;
    segment: string;
    routes: string[];
  }

  let { isOpen = false, segment, routes }: Props = $props();
</script>

<svelte:window onkeydown={handleWindowKeyDown} />
{#if isOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    onclick={self(close)}
    class="fixed inset-0 z-10 overflow-y-auto bg-zinc-900 opacity-50"
  ></div>
{/if}
<aside
  class={`fixed top-0 left-0 z-30 flex h-full w-64 transform flex-col justify-between overflow-auto border-r border-gray-200 bg-white transition-all duration-300 ease-in-out dark:border-zinc-700 dark:bg-zinc-800 ${
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
            onclick={close}
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
