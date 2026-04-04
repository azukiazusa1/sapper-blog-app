<script lang="ts">
  import { localizeHref } from "$paraglide/runtime";
  import variables from "$lib/variables";
  import Ogp from "../../../../components/Ogp.svelte";
  import ShortBlog from "../../../../components/ShortBlog/ShortBlog.svelte";
  import type { PageData } from "./$types";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let { short, htmlThreadItems } = $derived(data);
  let url = $derived(
    `${variables.baseURL}${localizeHref(`/blog/shorts/${short.sys.id}`)}`,
  );
</script>

<svelte:head>
  <title>{short.title}</title>
  <meta name="description" content={short.content1} />
  <link rel="canonical" href={url} />
</svelte:head>

<Ogp
  title={short.title}
  description={short.content1}
  {url}
  image={`${variables.ogpBaseURL}/blog/shorts/ogp/${short.sys.id}.png`}
/>

<div class="container mx-auto py-4">
  <ShortBlog
    title={short.title}
    backHref="/blog/shorts"
    createdAt={short.createdAt}
    shareUrl={url}
    {htmlThreadItems}
  />
</div>
