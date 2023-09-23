<script lang="ts">
  import { onMount } from "svelte";
  import { type Theme, getTheme, changeTheme } from "../../utils/darkTheme";
  import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
  } from "@rgossiaux/svelte-headlessui";
  import Moon from "../Icons/Moon.svelte";
  import Sun from "../Icons/Sun.svelte";
  import System from "../Icons/system.svelte";
  let theme: Theme = "system";
  export let right = false;

  onMount(() => {
    theme = getTheme();
  });
  const items = [
    { value: "system", label: "System" },
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
  ] as const satisfies readonly {
    value: Theme;
    label: string;
  }[];

  const handleChange = (e: CustomEvent<Theme>) => {
    theme = e.detail;
    changeTheme(theme);
  };
</script>

<Listbox on:change={handleChange} value={theme}>
  <ListboxButton
    class="flex items-center rounded-lg border border-gray-300 p-2 dark:border-zinc-600"
    aria-label="カラーテーマを選択する"
  >
    <Moon className="h-6 w-6 hidden dark:block" />
    <Sun className="h-6 w-6 block dark:hidden" />
  </ListboxButton>
  <ListboxOptions
    class={`absolute z-20 w-24 overflow-hidden overflow-y-scroll rounded-bl-md rounded-br-md border-2 border-t-0 border-gray-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-700 md:w-28 ${
      right ? "right-2" : ""
    }`}
  >
    {#each items as item}
      <ListboxOption
        value={item.value}
        class={({ active }) =>
          `-mx-2 flex transform cursor-pointer items-center border-b px-4 py-3 transition-colors duration-200 last:border-0 hover:bg-gray-100 dark:border-zinc-700 dark:hover:bg-zinc-500 ${
            active ? "bg-gray-100 dark:bg-zinc-500" : ""
          }`}
      >
        {#if item.value === "system"}
          <System className="h-5 w-5" />
        {:else if item.value === "light"}
          <Sun className="h-5 w-5" />
        {:else if item.value === "dark"}
          <Moon className="h-5 w-5" />
        {/if}
        <span class="ml-2 text-sm">
          {item.label}
        </span>
      </ListboxOption>
    {/each}
  </ListboxOptions>
</Listbox>
