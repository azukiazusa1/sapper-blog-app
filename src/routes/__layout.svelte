<script lang="ts">
  import '../app.css'
  import Header from '../components/Header.svelte'
  import { onMount } from 'svelte'
  import { page } from '$app/stores';
  import GoogleAnalytics from '../components/GoogleAnalytics.svelte'
  import Visual from '../components/Visual.svelte'
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

<Header segment={$page.url.pathname} {darkMode} on:clickMoon={toggleDarkMode} />
<GoogleAnalytics />
<main class="pt-16">
  {#if $page.url.pathname === '/about'}
    <Visual title="about" image="images/road-984251_1280.jpg" />
  {/if}
  <div class="container mx-auto px-6 my-4">
    <slot />
  </div>
</main>
