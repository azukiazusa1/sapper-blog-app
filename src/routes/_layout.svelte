<script lang="ts">
  import Header from '../components/Header.svelte'
  import { onMount } from 'svelte'

  export let segment: string
  let html: HTMLElement
  let darkMode = false

  onMount(() => {
    html = document.documentElement
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      darkMode = true
      html.classList.add('dark')
    } else {
      darkMode = false
      html.classList.remove('dark')
    }
  })
  $: {
    if (html) {
      if (darkMode) {
        html.classList.add('dark')
        localStorage.theme = 'dark'
      } else {
        html.classList.remove('dark')
        localStorage.theme = 'light'
      }
    }
  }

  const toggleDarkMode = () => {
    darkMode = !darkMode
  }
</script>

<Header {segment} on:clickMoon={toggleDarkMode} />

<main class="pt-16">
  <div class="container mx-auto px-6 my-4">
    <slot />
  </div>
</main>
