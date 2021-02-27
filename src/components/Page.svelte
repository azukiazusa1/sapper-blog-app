<style>
  [aria-current] {
    background-color: rgb(255, 62, 0);
    color: white;
  }
</style>

<script lang="ts">
  export let current: boolean
  export let sm = false
</script>

<div
  class={`w-12 ${
    sm ? 'md:hidden flex' : 'md:flex hidden'
  } justify-center items-center cursor-pointer leading-5 transition duration-150 ease-in rounded-full`}
  aria-current={current ? 'page' : undefined}
>
  <slot />
</div>
