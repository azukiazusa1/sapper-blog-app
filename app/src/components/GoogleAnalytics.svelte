<script>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-nocheck

  import { page } from '$app/stores'
  import variables from '$lib/variables'

  const id = variables.analyticsId
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() {
      window.dataLayer.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', id, { send_page_view: false })
  }

  $: {
    if (typeof gtag !== 'undefined') {
      window.gtag('config', id, {
        page_path: $page.url.pathname,
      })
    }
  }
</script>

<svelte:head>
  <script async src="https://www.googletagmanager.com/gtag/js?id={id}"></script>
</svelte:head>
