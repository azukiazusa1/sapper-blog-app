<script lang="ts">
  import { self } from "svelte/legacy";

  import { isMatchPath } from "$lib/utils";
  import { createEventDispatcher } from "svelte";
  import Title from "./Title.svelte";
  import ToggleDarkMode from "./ToggleDarkMode.svelte";
  import GitHub from "../Icons/GitHub.svelte";
  import RssIcon from "../Icons/Rss.svelte";
  import Robot from "../Icons/Robot.svelte";
  import type { Route } from "$lib/types";

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
    routes: Route[];
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
  class={`fixed top-0 left-0 z-60 flex h-full w-72 transform flex-col justify-between overflow-auto bg-white transition-all duration-300 ease-in-out shadow-xl dark:bg-zinc-800 ${
    isOpen ? "visible translate-x-0 " : "invisible -translate-x-full"
  }`}
>
  <div>
    <div class="flex w-full items-center justify-between p-4">
      <Title />
      <ToggleDarkMode right={true} />
    </div>
    <div class="mt-6 px-3">
      <ul class="space-y-2">
        {#each routes as route}
          <li>
            <a
              onclick={close}
              aria-current={isMatchPath(route.path, segment) ? "page" : undefined}
              href={route.path}
              class={`relative flex items-center rounded-xl px-4 py-3 capitalize font-medium transition-all duration-300 hover:bg-gray-100 dark:hover:bg-zinc-700 ${
                isMatchPath(route.path, segment)
                  ? "text-indigo-600 dark:text-indigo-300 bg-gray-100 dark:bg-zinc-700"
                  : ""
              }`}
            >
              {route.path.slice(1)}
              {#if route.showIndicator}
                <span
                  class="ml-2 inline-flex items-center rounded-full bg-indigo-600 dark:bg-indigo-500 px-2 py-0.5 text-xs font-semibold text-white"
                  aria-label="新しいコンテンツがあります"
                  role="status"
                >
                  NEW
                </span>
              {/if}
            </a>
          </li>
        {/each}
      </ul>
    </div>
  </div>
  <div class="flex w-full items-center justify-center gap-2 p-6">
    <a
      href="/rss.xml"
      target="_blank"
      class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-zinc-700 dark:hover:bg-zinc-600"
      rel="noopener noreferrer"
      aria-label="RSS"
    >
      <RssIcon className="h-5 w-5" />
    </a>
    <a
      href="/llms.txt"
      target="_blank"
      class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-zinc-700 dark:hover:bg-zinc-600"
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
      class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-zinc-700 dark:hover:bg-zinc-600"
    >
      <GitHub className="h-5 w-5" />
    </a>
  </div>
</aside>
