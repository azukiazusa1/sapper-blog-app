<script>
  export let src
  export let alt

  import IntersectionObserver from './InterSectionObserver.svelte'
  import Image from './Image.svelte'
  
</script>

<IntersectionObserver once={true} let:intersecting={intersecting}>
  {#if intersecting}
    <Image {alt} {src} />
  {/if}
</IntersectionObserver>