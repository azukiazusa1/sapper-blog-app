<script lang="ts">
  import { isMatchPath } from "$lib/utils";
  import type { Route } from "$lib/types";

  interface Props {
    segment: string;
    routes: Route[];
  }

  let { segment, routes }: Props = $props();
</script>

<nav class="px-1">
  <ul class="flex items-center space-x-1">
    {#each routes as route}
      <li>
        <a
          aria-current={isMatchPath(route.path, segment) ? "page" : undefined}
          href={route.path}
          class={`relative rounded-full capitalize font-medium transition-all duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-zinc-700 px-3 py-1.5 ${
            isMatchPath(route.path, segment)
              ? "text-indigo-600 dark:text-indigo-300 bg-gray-100 dark:bg-zinc-700"
              : ""
          }`}
        >
          {route.path.slice(1)}
          {#if route.showIndicator}
            <span
              class="ml-1.5 inline-flex items-center rounded-full bg-indigo-600 dark:bg-indigo-500 px-2 py-0.5 text-xs font-semibold text-white"
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
</nav>
