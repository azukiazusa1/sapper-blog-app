<script lang="ts">
  import DropDownItem from './DropDownItem.svelte'
  import Loading from '../Icons/Loading.svelte'

  export let items: any[]
  export let itemHref = 'href'
  export let itemImageUrl = 'imageUrl'
  export let itemText = 'text'
  export let loading = false
</script>

<div
  class="absolute z-20 overflow-hidden bg-white rounded-md shadow-lg w-80 max-h-60 overflow-y-scroll dark:bg-gray-700"
>
  {#if loading}
    <div class="py-2 text-center">
      <Loading />
    </div>
  {:else}
    <div class="py-2">
      {#each items as item, index (index)}
        <DropDownItem href={item[itemHref]} imageUrl={item[itemImageUrl]} text={item[itemText]} />
      {/each}
    </div>
  {/if}
</div>
