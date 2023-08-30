<script lang="ts">
  import "../app.css";
  import "nprogress/nprogress.css";
  import NProgress from "nprogress";
  import { navigating } from "$app/stores";
  import Header from "../components/Header/Header.svelte";
  import Footer from "../components/Footer/Footer.svelte";
  import { page } from "$app/stores";
  import GoogleAnalytics from "../components/GoogleAnalytics.svelte";
  import Visual from "../components/Visual.svelte";
  import image from "../assets/images/road-984251_1280.jpg";
  import { removeTrailingSlash } from "$lib/utils";
  import { onNavigate } from "$app/navigation";

  onNavigate(() => {
    if (!document.startViewTransition) return;

    return new Promise((fulfil) => {
      document.startViewTransition(() => new Promise(fulfil));
    });
  });

  preparePageTransition();

  NProgress.configure({
    showSpinner: false,
  });

  $: {
    if ($navigating) {
      NProgress.start();
    }
    if (!$navigating) {
      NProgress.done();
    }
  }
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
<Header segment={$page.url.pathname} />
<GoogleAnalytics />

<main>
  {#if removeTrailingSlash($page.url.pathname) === "/about"}
    <Visual title="about" {image} />
  {/if}
  <div class="container mx-auto my-4 px-1 md:px-6">
    <slot />
  </div>
</main>
<Footer />
