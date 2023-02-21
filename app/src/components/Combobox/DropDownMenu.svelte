<script lang="ts">
  import DropDownItem from './DropDownItem.svelte'
  import Loading from '../Icons/Loading.svelte'
  import type { Item } from './types'
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher<{
    select: Item
  }>()

  export let items: Item[]
  export let loading = false
  export let listboxId: string
  export let optionId: string
  export let activeIndex: number | null = null
</script>

<div
  on:keydown
  class="absolute z-20 overflow-hidden bg-white rounded-br-md rounded-bl-md shadow-lg w-72 max-h-60 overflow-y-scroll dark:bg-gray-700 border-2 border-t-0 border-gray-300 dark:border-gray-600"
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
            dispatch('select', item)
          }}
        />
      {/each}
    </ul>
  {/if}
</div>
