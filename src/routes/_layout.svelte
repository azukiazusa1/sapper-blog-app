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

<Header {segment} {darkMode} on:clickMoon={toggleDarkMode} />

<main class="pt-16">
  {#if segment === 'about'}
    <div class="w-full bg-center bg-cover h-72 md:h-96 rounded-lg" style="background-image: url(images/road-984251_1280.jpg);">
      <div class="flex items-center justify-center w-full h-full">
          <div class="text-center">
              <h1 class="text-2xl italic tracking-wider font-semibold text-white uppercase md:text-3xl">About</h1>
          </div>
      </div>
    </div>
    <div class="text-right mt-2">
      <span class="text-sm">
        <a 
          class="underline hover:opacity-75" 
          href="https://pixabay.com/photos/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=984251"
          target="_blank"
        >
          Free-Photos
        </a>による
        <a
          class="underline hover:opacity-75" 
          href="https://pixabay.com/ja/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=984251"
          target="_blank"
        >
          Pixabay
        </a>からの画像
      </span>
    </div>
  {/if}
  <div class="container mx-auto px-6 my-4">
    <slot />
  </div>
</main>
