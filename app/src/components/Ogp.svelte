<script lang="ts">
  interface Props {
    locale?: string;
    type?: string;
    title?: string;
    url?: string;
    image?: string;
    description?: string;
    card?: string;
  }

  let {
    locale = "ja_JP",
    type = "article",
    title = "",
    url = "",
    image = "",
    description = "",
    card = "summary_large_image",
  }: Props = $props();
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
