<style>
  img {
    height: 18rem;
    width: auto;
    display: block;
    margin: 0 auto;
    aspect-ratio: 4 / 3;
  }
</style>

<script>
  export let src
  export let alt
  export let width
  export let height
</script>

<img {src} {alt} loading="lazy" height={width} width={height}/>
