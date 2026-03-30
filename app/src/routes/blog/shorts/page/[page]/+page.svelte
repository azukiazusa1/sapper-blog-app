<script lang="ts">
  import { m } from "$paraglide/messages";
  import Pagination from "../../../../../components/Pagination/Pagination.svelte";
  import type { PageData } from "./$types";
  import variables from "$lib/variables";
  import ShortCard from "../../../../../components/ShortCard/ShortCard.svelte";
  import Breadcrumb from "../../../../../components/Breadcrumb/Breadcrumb.svelte";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const breadcrumbItems = $derived([
    { label: "Home", url: "/" },
    { label: "Shorts", url: "/blog/shorts" },
    { label: m.pageNumberLabel({ page: String(data.page) }) },
  ]);
</script>

<svelte:head>
  <title>{m.shortsTitle()} | {m.siteTitle()}</title>
  <link rel="canonical" href={`${variables.baseURL}/blog/page/${data.page}`} />
  <meta name="description" content={m.shortsDescription()} />
</svelte:head>

<div class="container mx-auto mt-16">
  <Breadcrumb items={breadcrumbItems} />
  <div class="grid gap-y-16 px-6">
    {#each data.shorts.shortCollection.items as short (short.sys.id)}
      <ShortCard id={short.sys.id} title={short.title}>
        {short.content1}
      </ShortCard>
    {/each}
  </div>

  <Pagination
    page={data.page}
    total={data.shorts.shortCollection.total}
    limit={data.shorts.shortCollection.limit}
    href="/blog/shorts/page/"
  />
</div>

<style>
  .grid {
    grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  }
</style>
