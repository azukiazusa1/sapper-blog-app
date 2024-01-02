<script lang="ts">
  import HeroSection from "../HeroSection.svelte";
  import PrevIcon from "../../../components/Icons/Prev.svelte";
  import AllowDown from "../../../components/Icons/AllowDown.svelte";

  const handleClick = () => {
    document.getElementById("article-info").scrollIntoView({
      block: "center",
      behavior: "smooth",
    });
  };
</script>

<HeroSection>
  <div class="absolute left-0 top-0 p-4">
    <a href="/recap">
      <div class="sr-only">戻る</div>
      <PrevIcon className="h-6 w-6" />
    </a>
  </div>
  <div class="hero">
    <h1 class="text-cente mb-8 text-3xl font-bold md:text-8xl">
      azukiazusa.dev 2023 Recap
    </h1>
    <p class="text-lg md:text-xl">
      2023 年の
      <a class="underline" href="https://azukiazusa.dev">azukiazusa.dev</a> の記録を振り返りましょう。
    </p>

    <div class="mt-16 text-center">
      <button
        type="button"
        on:click={handleClick}
        class="mr-3 inline-flex items-center justify-center rounded-lg bg-indigo-700 px-5 py-3 text-center text-base font-medium text-white hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-900"
      >
        はじめる <AllowDown className="h-4 w-4" />
      </button>
    </div>
  </div>
</HeroSection>

<style>
  p {
    word-break: auto-phrase;
  }

  @supports (animation-timeline: view()) {
    .hero {
      position: relative;
      top: 40%;
      width: 100%;
      text-align: center;
      animation: scale-down linear both;
      animation-timeline: view();
      animation-range: contain 70% contain 100%;
    }
  }

  @supports not (animation-timeline: view()) {
    .hero {
      position: relative;
      top: 30%;
      width: 100%;
      text-align: center;
    }
  }

  @keyframes scale-down {
    to {
      scale: 0.7;
      opacity: 0;
    }
  }
</style>
