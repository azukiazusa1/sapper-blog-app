<script context="module" lang="ts">
  export async function load({ fetch }) {
    const res = await fetch(`/tags.json`)
    const { tags } = await res.json()
    return {
      props: {
        tags
      }
    }
  }
</script>

<script lang="ts">
  import Tag from '../../components/Tag.svelte'
  import Badge from '../../components/Badge.svelte'
  import type { TagsQuery } from '../../generated/graphql'

  export let tags: TagsQuery
</script>

<svelte:head>
  <title>タグ一覧</title>
</svelte:head>

<h1 class="text-2xl">タグ一覧</h1>

<div class="container my-8 md:mx-auto md:px-12">
  {#each tags.tagCollection.items as tag (tag.slug)}
    <Tag name={tag.name} slug={tag.slug}>
      <Badge>{tag.linkedFrom.entryCollection.total}</Badge>
    </Tag>
  {/each}
</div>
