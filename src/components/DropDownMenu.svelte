<script lang="ts">
  import DropDownItem from './DropDownItem.svelte'

  export let items: any[]
  export let itemHref = 'href'
  export let itemImage = 'image'
  export let itemText = 'text'
  export let loading = false
</script>

<div class="absolute z-20 overflow-hidden bg-white rounded-md shadow-lg w-80 dark:bg-gray-700">
  {#if loading}
    <div class="py-2">loading...</div>
  {:else}
    <div class="py-2">
        <DropDownItem href="#" 
        image="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=398&q=80" 
        text="test" />
    </div>
  {/if}
</div>