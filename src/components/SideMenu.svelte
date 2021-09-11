<style>
  [aria-current] {
    position: relative;
    display: inline-block;
  }

  [aria-current]::after {
    position: absolute;
    content: '';
    width: calc(100% - 1.5rem);
    height: 2px;
    background-color: rgb(255, 62, 0);
    display: block;
    bottom: -8px;
  }
</style>

<script lang="ts">
  import Title from './Title.svelte'

  export let isOpen = false
  export let segment: string
  export let routes: string[]
</script>

{#if isOpen}
  <div on:click|self class="fixed z-10 inset-0 overflow-y-auto bg-gray-900 opacity-50" />
{/if}
<aside
  class={`transform top-0 left-0 w-64 bg-white dark:bg-gray-700 fixed h-full overflow-auto ease-in-out transition-all duration-300 z-30 ${
    isOpen ? 'translate-x-0' : '-translate-x-full'
  }`}
>
  <span on:click class="flex w-full items-center p-4 border-b border-gray-200 dark:border-gray-600">
    <Title />
  </span>
  <ul>
    {#each routes as route}
      <li class="flex items-center p-4" on:click>
        <a
          aria-current={segment === route ? 'page' : undefined}
          href={route}
          rel="prefetch"
          class="capitalize px-3 hover:opacity-75"
        >
          {route}
        </a>
      </li>
    {/each}
  </ul>
</aside>
