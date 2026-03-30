<script lang="ts">
  import { m } from "$paraglide/messages";
  import Tag from "../../components/Tag/Tag.svelte";
  import type { PageData } from "./$types";
  import variables from "$lib/variables";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{m.tagsTitle()}</title>
  <meta name="description" content={m.tagsDescription()} />
  <link rel="canonical" href={`${variables.baseURL}/tags`} />
</svelte:head>

<div class="min-h-[calc(100vh-3.5rem-6rem-2rem)]">
  <h1 class="px-4 text-2xl font-bold">{m.tagsTitle()}</h1>

  <div class="container my-8 md:mx-auto md:px-12">
    {#each data.tagCollection.items as tag (tag.slug)}
      <Tag name={tag.name} slug={tag.slug}></Tag>
    {/each}
  </div>
</div>
