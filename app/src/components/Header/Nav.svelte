<script lang="ts">
  import { isMatchPath } from "$lib/utils";

  interface Props {
    segment: string;
    routes: string[];
  }

  let { segment, routes }: Props = $props();
</script>

<nav class="px-1">
  <ul class="flex items-center space-x-1">
    {#each routes as route}
      <li>
        <a
          aria-current={isMatchPath(route, segment) ? "page" : undefined}
          href={route}
          class={`rounded-full capitalize font-medium transition-all duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-zinc-700 px-3 py-1.5 ${
            isMatchPath(route, segment)
              ? "text-indigo-600 dark:text-indigo-400 bg-indigo-600/10 dark:bg-indigo-400/10"
              : ""
          }`}
        >
          {route.slice(1)}
        </a>
      </li>
    {/each}
  </ul>
</nav>
