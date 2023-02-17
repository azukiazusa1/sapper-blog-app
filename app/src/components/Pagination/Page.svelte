<script lang="ts">
  export let href = ''
  export let current: boolean
  export let sm = false

  const className = `w-12 ${
    sm ? 'md:hidden flex' : 'md:flex hidden'
  } justify-center items-center cursor-pointer leading-5 transition duration-150 ease-in rounded-full`
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

<style>
  [aria-current] {
    background-color: #df3600;
    color: white;
  }
</style>
