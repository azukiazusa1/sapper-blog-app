<script lang="ts">
  import Tag from '../../components/Tag.svelte'
  import Badge from '../../components/Badge.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<svelte:head>
  <title>タグ一覧</title>
</svelte:head>

<h1 class="text-2xl">タグ一覧</h1>

<div class="container my-8 md:mx-auto md:px-12">
  {#each data.tagCollection.items as tag (tag.slug)}
    <Tag name={tag.name} slug={tag.slug}>
      <Badge>{tag.linkedFrom.entryCollection.total}</Badge>
    </Tag>
  {/each}
</div>
