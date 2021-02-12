<script lang="ts">
  export let className = ''
  import { fly } from 'svelte/transition';
</script>

<svg 
  class={className} 
  on:click 
  xmlns="http://www.w3.org/2000/svg" 
  viewBox="0 0 20 20" 
  fill="currentColor" 
  out:fly={{x: 100,y: 50, duration: 800}} 
  in:fly={{x: -100, y: 50, duration: 800}}
>
  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
</svg>
