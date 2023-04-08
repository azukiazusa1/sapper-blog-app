<script lang="ts">
  export let href = ''
  export let current: boolean
  export let sm = false

  $: className = `h-12 ${sm ? 'px-4 md:hidden flex' : 'w-12 md:flex hidden'} 
  ${current && !sm ? 'bg-gray-200 dark:bg-zinc-600' : 'hover:bg-gray-100 dark:hover:bg-zinc-700'}
  border border-gray-200 dark:border-zinc-600 justify-center items-center cursor-pointer leading-5`
</script>

{#if href}
  <a {href} class={className} aria-current={current ? 'page' : undefined}>
    <slot />
  </a>
{:else}
  <div class={className} aria-current={current ? 'page' : undefined}>
    <slot />
  </div>
{/if}
