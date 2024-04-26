<script lang="ts">
  import { isMatchPath } from "$lib/utils";
    import clsx from "clsx";

  export let segment: string;
  export let routes: string[];
</script>

<nav>
  <ul class="flex space-x-4 items-center">
    {#each routes as route}
      <li>
        <a
          aria-current={isMatchPath(route, segment) ? "page" : undefined}
          href={route}
          class="px-4 py-2 capitalize hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors duration-300 ease-in-out">
          {route.slice(1)}
        </a>
      </li>
    {/each}
  </ul>
</nav>

<style>
  [aria-current] {
    position: relative;
    display: inline-block;
  }

  [aria-current]::after {
    position: absolute;
    content: "";
    width: calc(100% - 2rem);
    height: 2px;
    background-color: #df3600;
    display: block;
    bottom: -4px;
  }
</style>
