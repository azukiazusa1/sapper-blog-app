<script lang="ts">
  import { run } from "svelte/legacy";

  import "../app.css";
  import "nprogress/nprogress.css";
  import NProgress from "nprogress";
  import { navigating } from "$app/stores";
  import Header from "../components/Header/Header.svelte";
  import Footer from "../components/Footer/Footer.svelte";
  import { page } from "$app/stores";
  import GoogleAnalytics from "../components/GoogleAnalytics.svelte";
  import { removeTrailingSlash } from "$lib/utils";
  import { onNavigate } from "$app/navigation";
  interface Props {
    children?: import("svelte").Snippet;
  }

  let { children }: Props = $props();

  onNavigate(() => {
    if (!document.startViewTransition) return;

    return new Promise((fulfil) => {
      document.startViewTransition(() => new Promise(fulfil));
    });
  });

  NProgress.configure({
    showSpinner: false,
  });

  run(() => {
    if ($navigating) {
      NProgress.start();
    }
    if (!$navigating) {
      NProgress.done();
    }
  });
</script>

<svelte:head>
  <script>
    if (!("theme" in localStorage) || localStorage.theme === "system") {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      }
      localStorage.setItem("theme", "system");
    } else if (localStorage.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    const mediaQueryLlistener = (e) => {
      if (localStorage.theme === "system") {
        if (e.matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", mediaQueryLlistener);
  </script>
</svelte:head>

<GoogleAnalytics />
<div
  class="min-h-screen bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-50"
>
  {#if removeTrailingSlash($page.url.pathname) !== "/recap/2024"}
    <Header segment={$page.url.pathname} />
  {/if}

  <main>
    {@render children?.()}
  </main>

  {#if removeTrailingSlash($page.url.pathname) !== "/recap/2024"}
    <Footer />
  {/if}
</div>
