<style>
  img {
    height: 18rem;
    display: block;
    margin: 0 auto;
    object-fit: contain;
  }
</style>

<script>
  export let src
  export let alt
  export let width
  export let height
</script>

<img {src} {alt} loading="lazy" height={width} width={height}/>
