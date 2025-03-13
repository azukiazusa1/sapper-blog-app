<script lang="ts">
  import Heroimage from "../../assets/images/heroImage.png";
  import LinkButton from "../LinkButton/LinkButton.svelte";
</script>

<section
  class="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 dark:from-indigo-950 dark:via-indigo-900 dark:to-purple-950"
>
  <div
    class="mx-auto grid max-w-(--breakpoint-xl) px-4 py-12 lg:grid-cols-12 lg:gap-8 xl:gap-0"
  >
    <div class="mr-auto place-self-center lg:col-span-7">
      <div class="animate-[fade-in_0.6s_ease-out]">
        <h1
          class="mb-4 max-w-2xl text-4xl leading-none font-extrabold md:text-5xl xl:text-6xl text-white"
        >
          Hey, I'm <span
            class="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-indigo-400"
            >azukiazusa</span
          ><span class="waving-hand">👋</span>
        </h1>
        <p
          class="mb-6 max-w-2xl leading-relaxed font-light text-indigo-100 md:text-lg lg:mb-8 lg:text-xl"
        >
          週に1回 Web
          開発に関する記事をお届けします。フロントエンドに関する分野の記事が中心です。
        </p>
        <div class="flex gap-3">
          <LinkButton variant="primary" href="/blog">
            ブログを読む
            <svg
              class="-mr-1 ml-2 h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              ><path
                fill-rule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clip-rule="evenodd"
              /></svg
            >
          </LinkButton>
          <LinkButton href="/about" variant="transparent">About me</LinkButton>
        </div>
      </div>
    </div>
    <div class="hidden lg:col-span-5 lg:mt-0 lg:flex lg:justify-center">
      <div
        class="relative overflow-hidden rounded-full border-4 border-indigo-300/30 p-2 shadow-2xl animate-[fade-in_0.8s_ease-out]"
      >
        <div
          class="absolute inset-0 bg-gradient-to-br from-pink-400/20 to-indigo-400/20 animate-[rotate_30s_ease-in-out_infinite]"
        ></div>
        <picture>
          <source
            media="(min-width: 1024px)"
            srcset={Heroimage}
            width="400"
            height="400"
          />
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
            alt=""
            width="1"
            height="1"
            class="relative rounded-full"
          />
        </picture>
      </div>
    </div>
  </div>
</section>

<style>
  @keyframes wave {
    0% {
      transform: rotate(0deg);
    }
    10% {
      transform: rotate(14deg);
    }
    20% {
      transform: rotate(-8deg);
    }
    30% {
      transform: rotate(14deg);
    }
    40% {
      transform: rotate(-4deg);
    }
    50% {
      transform: rotate(10deg);
    }
    60% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  .waving-hand {
    display: inline-block;
    transform-origin: 70% 70%; /* Pivot point at the bottom of the hand */
    animation: wave 2.5s ease-in-out 1; /* Changed to play only once */
  }
</style>
