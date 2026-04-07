<script lang="ts">
  import { m } from "$paraglide/messages";
  import LinkButton from "../LinkButton/LinkButton.svelte";
</script>

<section
  class="border-b border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-950"
>
  <div
    class="relative mx-auto flex min-h-[34rem] max-w-(--breakpoint-xl) items-center px-4 py-20 md:min-h-[38rem]"
  >
    <div class="mx-auto max-w-3xl text-center">
      <div>
        <p
          class="mb-3 font-mono text-xs tracking-[0.2em] uppercase text-stone-700 dark:text-stone-200"
          style="color: var(--color-accent)"
        >
          Web Developer
        </p>
        <h1
          class="mb-4 text-4xl leading-tight font-bold text-stone-950 dark:text-white md:text-5xl xl:text-6xl"
          style="font-family: var(--font-display)"
        >
          Hey, I'm azukiazusa<span class="waving-hand">👋</span>
        </h1>
        <p
          class="mb-6 leading-relaxed text-stone-700 dark:text-stone-200 md:text-lg lg:mb-8 lg:text-xl"
        >
          {m.heroDescription()}
        </p>
        <div class="flex justify-center gap-3">
          <LinkButton variant="primary" href="/blog">
            {m.heroReadBlog()}
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
          <LinkButton href="/about" variant="secondary"
            >{m.heroAboutMe()}</LinkButton
          >
        </div>
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
