<script lang="ts">
  import { goto } from "$app/navigation";
  import Tag from "../Tag/Tag.svelte";
  import type { PreviewPostsQuery } from "../../generated/graphql";

  export let data: PreviewPostsQuery;
</script>

<div class="relative overflow-x-auto rounded-lg">
  <table class="w-full text-left text-sm">
    <thead class="bg-gray-200 text-xs uppercase dark:bg-zinc-600">
      <tr>
        <th scope="col" class="px-6 py-3">Title</th>
        <th scope="col" class="px-6 py-3 text-center">Thumbnail</th>
        <th scope="col" class="px-6 py-3">About</th>
        <th scope="col" class="px-6 py-3">Tag</th>
      </tr>
    </thead>
    <tbody>
      {#each data.blogPostCollection?.items ?? [] as draft (draft.sys.id)}
        <tr
          class="cursor-pointer border-b hover:bg-gray-50 dark:border-zinc-700 dark:hover:bg-zinc-700"
          on:click={() => goto(`/drafts/${draft.sys.id}`)}
        >
          <th scope="row" class="whitespace-nowrap px-6 py-4">
            <a href={`/drafts/${draft.sys.id}`}>
              {draft.title || "No title"}
            </a>
          </th>
          <td class="px-6 py-4">
            {#if draft.thumbnail}
              <div class="flex justify-center">
                <img
                  src={draft.thumbnail.url}
                  alt={draft.thumbnail.title}
                  width="32"
                  height="32"
                />
              </div>
            {/if}
          </td>
          <td class="max-w-18 px-6 py-4">{draft.about || ""}</td>
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
