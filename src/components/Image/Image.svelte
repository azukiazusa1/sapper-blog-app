<style>
  img {
    height: 18rem;
    width: auto;
    display: block;
    margin: 0 auto;
    opacity: 0;
    transition: opacity 1200ms ease-out;
  }
  img.loaded {
    opacity: 1;
  }
</style>

<script>
  export let src
  export let alt

  import { onMount } from 'svelte'

  let loaded = false
  let thisImage

  onMount(() => {
    thisImage.onload = () => {
      loaded = true
    }
  })
</script>

<img {src} {alt} class:loaded bind:this={thisImage} height="400" width="300" />
