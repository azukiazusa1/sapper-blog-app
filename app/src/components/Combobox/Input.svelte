<script lang="ts">
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();
  import SearchIcon from "../Icons/Search.svelte";
  interface Props {
    value?: string;
    placeholder?: string;
    name?: string;
    required?: boolean;
    isOpen?: boolean;
    inputId?: string;
    listboxId?: string;
    optionId?: string;
    activeIndex: number | null;
  }

  let {
    value = $bindable(""),
    placeholder = "",
    name = "",
    required = false,
    isOpen = false,
    inputId = "",
    listboxId = "",
    optionId = "",
    activeIndex
  }: Props = $props();

  export const focus = () => {
    input.focus();
  };

  let input: HTMLInputElement = $state();
</script>

<div
  class="flex w-full rounded-lg border-2 border-gray-300 dark:border-zinc-700"
>
  <input
    bind:value
    bind:this={input}
    onfocus={bubble('focus')}
    onblur={bubble('blur')}
    onkeydown={bubble('keydown')}
    oninput={bubble('input')}
    class="h-10 w-60 rounded-l-lg px-5 focus:outline-none dark:bg-zinc-900"
    type="text"
    id={inputId}
    {name}
    {required}
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
