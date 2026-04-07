<script lang="ts">
  import { goto } from "$app/navigation";
  import { localizeHref } from "$paraglide/runtime";
  import Tag from "../Tag/Tag.svelte";
  import type { PreviewPostsQuery } from "../../generated/graphql";

  interface Props {
    data: PreviewPostsQuery;
  }

  let { data }: Props = $props();
</script>

<div class="relative overflow-x-auto rounded-lg">
  <table class="w-full text-left text-sm">
    <thead class="bg-stone-100 text-xs uppercase dark:bg-stone-700">
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
          class="cursor-pointer border-b border-stone-100 hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-800"
          onclick={() => goto(localizeHref(`/drafts/${draft.sys.id}`))}
        >
          <th scope="row" class="px-6 py-4 whitespace-nowrap">
            <a href={localizeHref(`/drafts/${draft.sys.id}`)}>
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
