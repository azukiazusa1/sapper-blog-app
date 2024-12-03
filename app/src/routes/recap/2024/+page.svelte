<script lang="ts">
  import HeroSection from "./HeroSection.svelte";
  import { fade, fly, slide } from "svelte/transition";
  import { bounceInOut } from "svelte/easing";
  import Start from "./Start.svelte";
  import PopularTag from "./PopularTag.svelte";
  import BlogCount from "./BlogCount.svelte";
  import WordCount from "./WordCount.svelte";
  import PopularArticle from "./PopularArticle.svelte";
  import AvatarComment from "./AvatarComment.svelte";
  import Ogp from "../../../components/Ogp.svelte";

  let currentSlide = 0;
  let direction: "forward" | "backward" = "forward";
  const setNextSlide = () => {
    direction = "forward";
    currentSlide += 1;
  };
  const setPreviousSlide = () => {
    direction = "backward";
    currentSlide -= 1;
  };
  const slides = [
    {
      title: "ふりかえりの準備はできていますか？",
      content: Start,
    },
    {
      title: "2024年に書いた記事の数は...？",
      content: BlogCount,
    },
    {
      title: "文字数に換算すると...？",
      content: WordCount,
    },
    {
      title: "よく使われたタグは...？",
      content: PopularTag,
    },
    {
      title: "人気があった記事は...？",
      content: PopularArticle,
    },
  ];
</script>

<Ogp
  title="azukiazusa.dev 2024 Recap"
  description="2024 年の azukiazusa.dev の記録を振り返りましょう。"
  url="https://azukiazusa.dev/recap/2024"
  image="https://azukiazusa.dev/recap/2024/ogp.png"
/>

<div
  class="h-screen snap-y snap-mandatory overflow-x-hidden overflow-y-scroll scroll-smooth"
>
  <HeroSection />

  <div
    id="article-info"
    class="flex min-h-screen snap-start snap-always items-center justify-center scroll-smooth bg-gradient-to-b from-purple-900 to-indigo-900 text-white"
  >
    <div class="mx-auto w-full max-w-2xl p-8">
      {#key currentSlide}
        <div
          in:fly={{
            y: direction === "forward" ? 50 : -50,
            duration: 700,
          }}
          class={`w-full max-w-2xl rounded-lg bg-white p-8 text-black shadow-lg`}
        >
          <h2 class="mb-6 text-center text-3xl font-bold">
            {slides[currentSlide].title}
          </h2>
          <div class="flex min-h-80 flex-col content-center justify-between">
            <svelte:component this={slides[currentSlide].content} />
            <AvatarComment />
          </div>
        </div>
      {/key}

      <div class="mt-8 flex max-w-2xl justify-between">
        <button
          on:click={() => setPreviousSlide()}
          disabled={currentSlide === 0}
        >
          Previous
        </button>
        <div class="flex justify-center">
          {#each slides as slide, i}
            <button
              class={`mx-1 h-4 w-4 rounded-full bg-white ${
                i === currentSlide ? "opacity-100" : "opacity-50"
              }`}
              on:click={() => (currentSlide = i)}
            ></button>
          {/each}
        </div>
        <button
          on:click={() => setNextSlide()}
          disabled={currentSlide === slides.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  </div>

  <div class="bg-gradient h-screen w-screen snap-start snap-always"></div>
</div>
