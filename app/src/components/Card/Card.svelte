<script lang="ts">
  import AppTag from '../Tag/Tag.svelte'
  import Time from '../Time/Time.svelte'
  import type { Tag } from '../../generated/graphql'
  import Image from '../Image/Image.svelte'

  export let title: string
  export let contents: string
  export let tags: Pick<Tag, 'name' | 'slug'>[]
  export let createdAt: string
  export let preview = false
  export let thumbnail: { title: string; url: string }
  export let slug: string
</script>

<article>
  <div class="p-4">
    <Image src={thumbnail.url} alt={thumbnail.title} width={480} height={270} {slug} />
    <h1 class="text-2xl md:text-4xl font-bold mb-8 mt-4" style:--tag="h-{slug}">{title}</h1>
    <div class="flex flex-wrap items-center leading-none mt-2 mb-2">
      {#each tags as tag (tag.slug)}
        <AppTag {...tag} />
      {/each}
    </div>
    <p class="my-2">
      <Time date={createdAt} />
    </p>
    {#if preview}
      <p class="hint error my-4">これは下書き記事のプレビューです。内容は不正確な恐れがあります。</p>
    {/if}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    <p id="contents" class="mt-6">{@html contents}</p>
  </div>
</article>
