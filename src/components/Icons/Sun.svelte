<script lang="ts">
  export let className = ''
  import { fly } from 'svelte/transition'
</script>

<svg
  class={className}
  on:click
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
  out:fly={{ x: 100, y: 50, duration: 800 }}
  in:fly={{ x: -100, y: 50, duration: 800 }}
>
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
  />
</svg>
