<script lang="ts">
  export let title = ''
  export let url = ''
  export let image = ''
  export let description = ''
  export let card = 'summary'
</script>

<svelte:head>
  <meta property="og:site_name" content="azukiazusaのテックブログ2" />
  <meta property="og:title" content={title} />
  <meta property="og:url" content={url} />
  <meta property="og:image" content={image} />
  <meta property="og:description" content={description} />
  <meta name="twitter:card" content={card} />
</svelte:head>