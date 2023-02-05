<script lang="ts">
  import { goto } from '$app/navigation'
  import Tag from '../Tag/Tag.svelte'
  import type { PreviewPostsQuery } from '../../generated/graphql'

  export let data: PreviewPostsQuery
</script>

<div class="relative overflow-x-auto rounded-lg">
  <table class="w-full text-sm text-left">
    <thead class="text-xs uppercase bg-gray-200 dark:bg-gray-600">
      <tr>
        <th scope="col" class="px-6 py-3">Title</th>
        <th scope="col" class="px-6 py-3 text-center">Thumbnail</th>
        <th scope="col" class="px-6 py-3">About</th>
        <th scope="col" class="px-6 py-3">Tag</th>
      </tr>
    </thead>
    <tbody>
      {#each data.blogPostCollection?.items as draft (draft.sys.id)}
        <tr
          class="bg-white border-b dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-500 dark:border-gray-600 cursor-pointer"
          on:click={() => goto(`/drafts/${draft.sys.id}`)}
        >
          <th scope="row" class="px-6 py-4 whitespace-nowrap">
            <a href={`/drafts/${draft.sys.id}`}>
              {draft.title || 'No title'}
            </a>
          </th>
          <td class="px-6 py-4">
            {#if draft.thumbnail}
              <div class="flex justify-center">
                <img src={draft.thumbnail.url} alt={draft.thumbnail.title} width="32" height="32" />
              </div>
            {/if}
          </td>
          <td class="px-6 py-4 max-w-18">{draft.about || ''}</td>
          <td class="px-6 py-4">
            {#each draft.tagsCollection?.items as tag (tag.slug)}
              <Tag name={tag.name} slug={tag.slug} />
            {/each}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
