<script lang="ts">
  import SearchIcon from '../Icons/Search.svelte'
  export let value = ''
  export let placeholder = ''
  export let name = ''
  export let isOpen = false
  export let inputId = ''
  export let listboxId = ''
  export let optionId = ''
  export let activeIndex: number | null

  export const focus = () => {
    input.focus()
  }

  let input: HTMLInputElement
</script>

<div class="flex border-2 border-gray-300 dark:border-zinc-700 rounded-lg w-full">
  <input
    bind:value
    bind:this={input}
    on:focus
    on:blur
    on:keydown
    on:input
    class="h-10 px-5 rounded-l-lg focus:outline-none w-60 dark:bg-zinc-900"
    type="text"
    id={inputId}
    {name}
    {placeholder}
    role="combobox"
    aria-autocomplete="both"
    aria-expanded={isOpen}
    aria-controls={listboxId}
    aria-activedescendant={activeIndex !== null ? `${optionId}-${activeIndex}` : undefined}
  />
  <button class="flex justify-end p-2 rounded-r-lg" aria-label="検索">
    <SearchIcon className="text-gray-600 dark:text-gray-50 h-6 w-6" />
  </button>
</div>
