<script lang="ts">
  export let src: string
  export let alt: string
  export let width: number
  export let height: number
  export let lazy = true
  export let slug: string
</script>

<img
  {src}
  {alt}
  style:--tag="image-{slug}"
  srcset={`${src}&w=100 100w,
    ${src}&w=200 200w,
    ${src}&w=300 300w,
    ${src}&w=400 400w,
    ${src}&w=500 500w,
    ${src}&w=600 600w,
    ${src}&w=700 700w,
    ${src}&w=800 800w,
    ${src}&w=900 900w,
    ${src}&w=1000 1000w,
    ${src}&w=1100 1100w,
    ${src}&w=1200 1200w`}
  sizes="(max-width: 600px) 100vw, 600px"
  loading={lazy ? 'lazy' : 'eager'}
  decoding={lazy ? 'async' : 'auto'}
  height={width}
  width={height}
/>

<style>
  img {
    height: 12rem;
    display: block;
    margin: 0 auto;
    object-fit: contain;
  }

  @media (min-width: 768px) {
    img {
      height: 18rem;
    }
  }
</style>
