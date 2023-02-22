<script lang="ts">
  export let alt: string
  export let src: string
  export let size: 'sm' | 'md' | 'lg' = 'md'

  $: className = `object-cover rounded-full ${size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-24 h-24'}`

  $: pixel = size === 'sm' ? '24' : size === 'md' ? '32' : '96'
</script>

<img class={className} width={pixel} height={pixel} {alt} {src} loading="lazy" decoding="async" />
