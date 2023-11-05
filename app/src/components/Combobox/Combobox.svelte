<script lang="ts">
  import DropDownMenu from "./DropDownMenu.svelte";
  import Input from "./Input.svelte";
  import type { Item } from "./types";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher<{
    select: Item;
  }>();

  export let value = "";
  export let required = false;
  export let loading = false;
  export let items: Item[] = [];

  let inputElement: { focus: () => void };
  let activeIndex: number | null = null;
  let isOpen = false;

  const inputId = "combobox";
  const listboxId = "listbox";
  const optionId = "option";

  $: itemCount = items.length;
  $: {
    if (!isOpen) {
      activeIndex = null;
    }
  }

  const handleInput = () => {
    if (!value.trim()) {
      isOpen = false;
    } else {
      isOpen = true;
    }
  };

  const handleFocus = () => {
    if (value.trim()) {
      isOpen = true;
    }
  };

  const handleBlur = () => {
    isOpen = false;
  };

  const handleSelect = (e: CustomEvent<Item>) => {
    value = e.detail.text;
    dispatch("select", e.detail);
  };
  /**
   * 選択された要素が見えるようにスクロール
   */
  const scrollToOption = (index: number) => {
    const listboxNode = document.getElementById(listboxId);
    const opt = document.getElementById(`${optionId}-${index}`);
    if (!listboxNode || !opt) return;

    opt.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const navigateList = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (activeIndex === null) {
        isOpen = true;
        activeIndex = 0;
      } else if (activeIndex < itemCount - 1) {
        activeIndex++;
      } else {
        activeIndex = 0;
      }
      scrollToOption(activeIndex);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (activeIndex === null) {
        isOpen = true;
        activeIndex = 0;
      } else if (activeIndex > 0) {
        activeIndex--;
      } else {
        activeIndex = itemCount - 1;
      }
      scrollToOption(activeIndex);
    } else if (e.key === "Enter") {
      isOpen = false;
      if (activeIndex !== null) {
        e.preventDefault();
        handleSelect({ detail: items[activeIndex] } as CustomEvent<Item>);
        activeIndex = null;
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      inputElement.focus();

      if (isOpen) {
        isOpen = false;
        activeIndex = null;
      } else {
        value = "";
      }
    }
  };
</script>

<Input
  bind:this={inputElement}
  bind:value
  on:focus={handleFocus}
  on:blur={handleBlur}
  on:keydown={navigateList}
  on:input={handleInput}
  {inputId}
  {listboxId}
  {optionId}
  {activeIndex}
  {required}
  name="q"
  placeholder="Search"
/>
{#if isOpen}
  <DropDownMenu
    {items}
    {loading}
    {listboxId}
    {optionId}
    {activeIndex}
    on:select={handleSelect}
  />
{/if}
