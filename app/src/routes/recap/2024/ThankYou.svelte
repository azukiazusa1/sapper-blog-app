<script lang="ts">
  import { run } from "svelte/legacy";

  import { blur, scale } from "svelte/transition";
  import TwitterShareButton from "../../../components/TwitterShareButton.svelte";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import avatarImage from "../../../assets/images/azukiazusa.jpeg";
  import { localizeHref } from "$paraglide/runtime";
  import { m } from "$paraglide/messages";
  let inView = $state(false);
  let el = $state(null);
  let dance = $state(false);
  let timerId = $state(null);

  run(() => {
    // この画面で 10 秒待ったらアバターが踊りだす
    if (inView) {
      timerId = setTimeout(() => {
        dance = true;
      }, 10000);
    } else {
      clearTimeout(timerId);
      dance = false;
    }
  });

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
      },
      { threshold: 0.5 },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  });
</script>

<div
  bind:this={el}
  class="flex h-screen w-screen items-center justify-center"
  id="thank-you"
>
  {#if inView}
    <div class="flex flex-col">
      <p
        in:blur={{
          delay: 500,
          opacity: 0.2,
        }}
        class="text-center text-6xl font-bold md:text-8xl"
      >
        Thank you for reading!
      </p>

      <!-- avatar -->
      <div class="mt-16 flex justify-center space-x-4">
        {#if dance}
          <img
            in:fade={{
              delay: 3000,
            }}
            src={avatarImage}
            alt="azusa"
            class="h-32 w-32 rounded-full"
            class:dance
          />
        {/if}
        <img
          in:fade={{
            delay: 1500,
          }}
          src={avatarImage}
          alt="azusa"
          class="h-32 w-32 rounded-full"
          class:dance
        />
        {#if dance}
          <img
            in:fade={{
              delay: 6000,
            }}
            src={avatarImage}
            alt="azusa"
            class="h-32 w-32 rounded-full"
            class:dance
          />
        {/if}
      </div>

      <div class="mt-8 flex items-center justify-center gap-4">
        <p
          in:fade={{
            delay: 1500,
          }}
          class="max-w-2xl px-4 text-xl"
        >
          2024年の振り返りを楽しんでいただけたでしょうか？読者の皆様のいいねやコメントが励みになります。2025年もよろしくお願いします👋
        </p>
      </div>

      <div
        class="mt-16 flex items-center justify-center gap-4"
        in:scale={{
          delay: 2500,
          duration: 500,
        }}
      >
        <a
          href={localizeHref("/")}
          class="mr-3 inline-flex items-center justify-center rounded-lg bg-indigo-700 px-5 py-3 text-center text-base font-medium text-white hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-900"
        >
          {m.backToHome()}
        </a>
        <TwitterShareButton
          url="https://azukiazusa.dev/recap/2024"
          text="2024年のazukiazusa.devの記録を振り返りましょう🤚"
        />
      </div>
    </div>
  {/if}
</div>

<style>
  .dance {
    animation: dance 3s linear infinite;
  }

  @keyframes dance {
    0% {
      transform: rotate3d(0, 1, 0, 0deg);
    }

    100% {
      transform: rotate3d(0, 1, 0, 360deg);
    }
  }
</style>
