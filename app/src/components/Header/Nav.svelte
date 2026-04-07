<script lang="ts">
  import { isMatchPath } from "$lib/utils";
  import { localizeHref } from "$paraglide/runtime";

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
          href={localizeHref(route)}
          class={`rounded capitalize font-medium transition-colors hover:bg-stone-100 dark:hover:bg-stone-800 px-3 py-1.5 ${
            isMatchPath(route, segment) ? "dark:bg-stone-800 bg-stone-100" : ""
          }`}
          style={isMatchPath(route, segment)
            ? "color: var(--color-accent)"
            : ""}
        >
          {route.slice(1)}
        </a>
      </li>
    {/each}
  </ul>
</nav>
