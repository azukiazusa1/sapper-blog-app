<script lang="ts">
  import '../app.css'
  import 'nprogress/nprogress.css'
  import NProgress from 'nprogress'
  import { navigating } from '$app/stores'
  import Header from '../components/Header/Header.svelte'
  import Footer from '../components/Footer/Footer.svelte'
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
  import GoogleAnalytics from '../components/GoogleAnalytics.svelte'
  import Visual from '../components/Visual.svelte'
  import image from '../assets/images/road-984251_1280.jpg'
  import { removeTrailingSlash } from '$lib/utils'
  let html: HTMLElement
  let darkMode = false
  export const prerender = true

  NProgress.configure({
    showSpinner: false,
  })

  $: {
    if ($navigating) {
      NProgress.start()
    }
    if (!$navigating) {
      NProgress.done()
    }
  }

  onMount(() => {
    html = document.documentElement
    if (html.classList.contains('dark')) {
      darkMode = true
    }
  })
  const toggleDarkMode = () => {
    darkMode = !darkMode
    if (!html) return
    if (darkMode) {
      html.classList.add('dark')
      localStorage.theme = 'dark'
    } else {
      html.classList.remove('dark')
      localStorage.theme = 'light'
    }
  }
</script>

<svelte:head>
  <script>
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  </script>
</svelte:head>
<Header segment={$page.url.pathname} {darkMode} on:clickMoon={toggleDarkMode} />
<GoogleAnalytics />

<main>
  {#if removeTrailingSlash($page.url.pathname) === '/about'}
    <Visual title="about" {image} />
  {/if}
  <div class="container mx-auto px-1 md:px-6 my-4">
    <slot />
  </div>
</main>
<Footer />
