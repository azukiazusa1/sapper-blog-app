<script lang="ts">
  import SearchIcon from "../Icons/Search.svelte";
  export let value = "";
  export let placeholder = "";
  export let name = "";
  export let isOpen = false;
  export let inputId = "";
  export let listboxId = "";
  export let optionId = "";
  export let activeIndex: number | null;

  export const focus = () => {
    input.focus();
  };

  let input: HTMLInputElement;
</script>

<div
  class="flex w-full rounded-lg border-2 border-gray-300 dark:border-zinc-700"
>
  <input
    bind:value
    bind:this={input}
    on:focus
    on:blur
    on:keydown
    on:input
    class="h-10 w-60 rounded-l-lg px-5 focus:outline-none dark:bg-zinc-900"
    type="text"
    id={inputId}
    {name}
    {placeholder}
    role="combobox"
    aria-autocomplete="both"
    aria-expanded={isOpen}
    aria-controls={listboxId}
    aria-activedescendant={activeIndex !== null
      ? `${optionId}-${activeIndex}`
      : undefined}
  />
  <button class="flex justify-end rounded-r-lg p-2" aria-label="検索">
    <SearchIcon className="text-gray-600 dark:text-gray-50 h-6 w-6" />
  </button>
</div>
