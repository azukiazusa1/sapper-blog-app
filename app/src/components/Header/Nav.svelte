<script lang="ts">
  import { isMatchPath } from "$lib/utils";

  export let segment: string;
  export let routes: string[];
</script>

<nav>
  <ul class="flex space-x-4">
    {#each routes as route}
      <li>
        <a
          aria-current={isMatchPath(route, segment) ? "page" : undefined}
          href={route}
          class="px-3 capitalize hover:opacity-75"
        >
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
    width: calc(100% - 1.5rem);
    height: 2px;
    background-color: #df3600;
    display: block;
    bottom: -8px;
  }
</style>
