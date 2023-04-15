<script lang="ts">
  import { onMount } from 'svelte'
  import { type Theme, getTheme, changeTheme } from '../../utils/darkTheme'
  import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@rgossiaux/svelte-headlessui'
  import Moon from '../Icons/Moon.svelte'
  import Sun from '../Icons/Sun.svelte'
  import System from '../Icons/system.svelte'
  let theme: Theme = 'system'
  let isDark: boolean
  export let right = false

  onMount(() => {
    theme = getTheme()
    isDark = document.documentElement.classList.contains('dark')
  })
  const items = [
    { value: 'system', label: 'System' },
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
  ] as const satisfies readonly {
    value: Theme
    label: string
  }[]

  const handleChange = (e: CustomEvent<Theme>) => {
    theme = e.detail
    changeTheme(theme)
    isDark = document.documentElement.classList.contains('dark')
  }
</script>

<Listbox on:change={handleChange} value={theme}>
  <ListboxButton class="flex items-center p-2 border border-gray-300 dark:border-zinc-600 rounded-lg">
    {#if isDark}
      <Moon className="h-6 w-6" />
    {:else}
      <Sun className="h-6 w-6" />
    {/if}
  </ListboxButton>
  <ListboxOptions
    class={`absolute z-20 overflow-hidden rounded-br-md rounded-bl-md shadow-lg w-24 md:w-28 overflow-y-scroll bg-white dark:bg-zinc-700 border-2 border-t-0 border-gray-200 dark:border-zinc-700 ${
      right ? 'right-2' : ''
    }`}
  >
    {#each items as item}
      <ListboxOption
        value={item.value}
        class={({ active }) =>
          `cursor-pointer flex items-center px-4 py-3 -mx-2 transition-colors duration-200 transform border-b last:border-0 hover:bg-gray-100 dark:hover:bg-zinc-500 dark:border-zinc-700 ${
            active ? 'bg-gray-100 dark:bg-zinc-500' : ''
          }`}
      >
        {#if item.value === 'system'}
          <System className="h-5 w-5" />
        {:else if item.value === 'light'}
          <Sun className="h-5 w-5" />
        {:else if item.value === 'dark'}
          <Moon className="h-5 w-5" />
        {/if}
        <span class="ml-2 text-sm">
          {item.label}
        </span>
      </ListboxOption>
    {/each}
  </ListboxOptions>
</Listbox>
