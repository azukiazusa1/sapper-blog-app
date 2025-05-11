<script lang="ts">
  import variables from "$lib/variables";
  import Ogp from "../../../../components/Ogp.svelte";
  import ShortBlog from "../../../../components/ShortBlog/ShortBlog.svelte";
  import type { PageData } from "./$types";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let { short, contents, allShortsIds } = $derived(data);
  let url = $derived(`${variables.baseURL}/blog/shorts/${short.sys.id}`);
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
  image={`${variables.baseURL}/blog/shorts/ogp/${short.sys.id}.png`}
/>

<div class="container mx-auto py-4">
  <ShortBlog
    id={short.sys.id}
    title={short.title}
    ids={allShortsIds}
    {contents}
  />
</div>
<!-- ogp を静的に生成するために空のリンクを設置している -->
<a
  href={`/blog/shorts/ogp/${encodeURIComponent(short.sys.id)}.png`}
  aria-hidden="true"
  tabindex="-1"
></a>
