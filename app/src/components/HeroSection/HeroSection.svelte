<script lang="ts">
  import { m } from "$paraglide/messages";
  import LinkButton from "../LinkButton/LinkButton.svelte";
</script>

<section class="hero-section border-b border-stone-200 dark:border-stone-800">
  <div
    class="hero-shell relative mx-auto flex min-h-[34rem] max-w-(--breakpoint-xl) items-center px-4 py-20 md:min-h-[38rem]"
  >
    <div class="mx-auto max-w-3xl text-center">
      <div class="hero-content">
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
          Hey, I'm <span class="hero-accent">azukiazusa</span><span
            class="waving-hand">👋</span
          >
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
  .hero-section {
    background: var(--color-stone-50);
  }

  .hero-shell::after {
    content: "";
    position: absolute;
    top: 12%;
    right: 8%;
    width: 13rem;
    height: 13rem;
    border-radius: 9999px;
    background: radial-gradient(
      circle,
      color-mix(in oklch, var(--color-accent-light) 48%, white) 0%,
      color-mix(in oklch, var(--color-accent) 12%, transparent) 48%,
      transparent 74%
    );
    opacity: 0.7;
    filter: blur(10px);
    pointer-events: none;
  }

  .hero-content {
    position: relative;
    z-index: 1;
    padding: 2.5rem 2rem;
  }

  .hero-accent {
    position: relative;
    display: inline-block;
    background: linear-gradient(
      135deg,
      color-mix(in oklch, var(--color-accent) 88%, white) 0%,
      color-mix(
          in oklch,
          var(--color-accent-light) 70%,
          var(--color-accent) 30%
        )
        100%
    );
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
  }

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

  :global(.dark) .hero-section {
    background: var(--color-stone-950);
  }

  :global(.dark) .hero-shell::after {
    background: radial-gradient(
      circle,
      color-mix(in oklch, var(--color-accent-light) 82%, white) 0%,
      color-mix(in oklch, var(--color-accent) 48%, transparent) 44%,
      transparent 76%
    );
    opacity: 0.9;
    filter: blur(16px);
  }

  :global(.dark) .hero-content {
    padding: 2.5rem 2rem;
  }

  :global(.dark) .hero-accent {
    background: linear-gradient(
      135deg,
      color-mix(in oklch, var(--color-accent-light) 92%, white) 0%,
      color-mix(
          in oklch,
          var(--color-accent-light) 58%,
          var(--color-accent) 42%
        )
        52%,
      color-mix(in oklch, var(--color-accent) 84%, white) 100%
    );
    filter: drop-shadow(
      0 0.55rem 1.2rem
        color-mix(in oklch, var(--color-accent-light) 42%, transparent)
    );
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: 640px) {
    .hero-shell::after {
      top: 8%;
      right: -1rem;
      width: 9rem;
      height: 9rem;
    }

    .hero-content {
      padding: 2rem 1.25rem;
    }
  }
</style>
