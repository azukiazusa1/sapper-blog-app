<script lang="ts">
  export let locale = "ja_JP";
  export let type = "article";
  export let title = "";
  export let url = "";
  export let image = "";
  export let description = "";
  export let card = "summary_large_image";
</script>

<svelte:head>
  <meta property="og:site_name" content="azukiazusaのテックブログ2" />
  <meta property="og:locale" content={locale} />
  <meta property="og:type" content={type} />
  <meta property="og:title" content={title} />
  <meta property="og:url" content={url} />
  <meta property="og:image" content={image} />
  <meta property="og:description" content={description} />
  <meta name="twitter:card" content={card} />
</svelte:head>
