<script lang="ts">
  export let darkMode: boolean
  import MoonIcon from '../Icons/Moon.svelte'
  import SunIcon from '../Icons/Sun.svelte'
</script>

<button on:click aria-label={`${darkMode ? 'ライトモードに切り替える' : 'ダークモードに切り替える'}`}>
  {#if darkMode}
    <SunIcon className="h-6 w-6" />
  {:else}
    <MoonIcon className="h-6 w-6" />
  {/if}
</button>
