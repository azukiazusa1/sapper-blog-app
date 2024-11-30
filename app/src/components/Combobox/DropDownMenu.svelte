<script lang="ts">
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();
  import DropDownItem from "./DropDownItem.svelte";
  import Loading from "../Icons/Loading.svelte";
  import type { Item } from "./types";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher<{
    select: Item;
  }>();

  interface Props {
    items: Item[];
    loading?: boolean;
    listboxId: string;
    optionId: string;
    activeIndex?: number | null;
  }

  let {
    items,
    loading = false,
    listboxId,
    optionId,
    activeIndex = null
  }: Props = $props();
</script>

<!-- eslint-disable-next-line svelte/valid-compile -->
<div
  onkeydown={bubble('keydown')}
  class="absolute z-20 max-h-96 w-72 overflow-hidden overflow-y-scroll rounded-bl-md rounded-br-md border-2 border-t-0 border-gray-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-700"
>
  {#if loading}
    <div class="py-2 text-center" aria-live="polite" aria-atomic="true">
      <div class="sr-only">検索中</div>
      <Loading />
    </div>
  {:else if items.length === 0}
    <div class="py-2 text-center" aria-live="polite" aria-atomic="true">
      <p class="text-gray-500 dark:text-gray-300">検索結果がありません</p>
    </div>
  {:else}
    <ul class="py-2" role="listbox" aria-label="検索結果" id={listboxId}>
      {#each items as item, index (item.key)}
        <DropDownItem
          imageUrl={item.imageUrl}
          text={item.text}
          selected={index === activeIndex}
          id={`${optionId}-${index}`}
          on:mousedown={() => {
            dispatch("select", item);
          }}
        />
      {/each}
    </ul>
  {/if}
</div>
