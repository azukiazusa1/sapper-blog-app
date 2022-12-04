<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import Title from './Title.svelte'
  const dispatch = createEventDispatcher()

  const close = () => {
    dispatch('close')
  }

  function handleWindowKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      close()
    }
  }

  export let isOpen = false
  export let segment: string
  export let routes: string[]
</script>

<svelte:window on:keydown={handleWindowKeyDown} />
{#if isOpen}
  <!-- eslint-disable-next-line svelte/valid-compile -->
  <div on:click|self={close} class="fixed z-10 inset-0 overflow-y-auto bg-gray-900 opacity-50" />
{/if}
<aside
  class={`transform top-0 left-0 w-64 bg-white dark:bg-gray-700 fixed h-full overflow-auto ease-in-out transition-all duration-300 z-30 ${
    isOpen ? 'translate-x-0 visible ' : '-translate-x-full invisible'
  }`}
>
  <button on:click={close} class="flex w-full items-center p-4 border-b border-gray-200 dark:border-gray-600">
    <Title />
  </button>
  <ul>
    {#each routes as route}
      <li class="flex items-center p-4">
        <a
          on:click={close}
          aria-current={segment === route ? 'page' : undefined}
          href={route}
          data-sveltekit-preload-data="hover"
          class="capitalize px-3 hover:opacity-75"
          target={route === '/rss.xml' ? '_blank' : ''}
        >
          {route.slice(1)}
        </a>
      </li>
    {/each}
  </ul>
</aside>

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
    background-color: #df3600;
    display: block;
    bottom: -8px;
  }
</style>
