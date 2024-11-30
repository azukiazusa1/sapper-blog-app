<script lang="ts">
  interface Props {
    src: string;
    alt: string;
    width: number;
    height: number;
    lazy?: boolean;
    slug: string;
    small?: boolean;
    main?: boolean;
  }

  let {
    src,
    alt,
    width,
    height,
    lazy = true,
    slug,
    small = false,
    main = false
  }: Props = $props();
</script>

<img
  {src}
  {alt}
  class={main ? "main" : undefined}
  style:--tag={small ? null : `image-${slug}`}
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
  loading={lazy ? "lazy" : "eager"}
  decoding={lazy ? "async" : "auto"}
  height={width}
  width={height}
  data-pagefind-meta={main ? "image[src], image_alt[alt]" : undefined}
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
      height: 14rem;
    }
    img.main {
      height: 18rem;
    }
  }
</style>
