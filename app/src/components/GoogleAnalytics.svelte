<script>
  import { run } from "svelte/legacy";
  import { page } from "$app/stores";
  import variables from "$lib/variables";

  const id = variables.analyticsId;
  if (typeof window !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window.dataLayer = window.dataLayer || [];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window.gtag = function gtag() {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      window.dataLayer.push(arguments);
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window.gtag("js", new Date());
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window.gtag("config", id, { send_page_view: false });
  }

  run(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (typeof gtag !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      window.gtag("config", id, {
        page_path: $page.url.pathname,
      });
    }
  });
</script>

<svelte:head>
  <script async src="https://www.googletagmanager.com/gtag/js?id={id}"></script>
</svelte:head>
