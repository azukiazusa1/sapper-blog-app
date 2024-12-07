<script lang="ts">
  import { fly } from "svelte/transition";
  import Start from "./Start.svelte";
  import PopularTag from "./PopularTag.svelte";
  import BlogCount from "./BlogCount.svelte";
  import PopularArticle from "./PopularArticle.svelte";
  import AvatarComment from "./AvatarComment.svelte";
  import Speak from "./Speak.svelte";
  import Short from "./Short.svelte";
  import End from "./End.svelte";

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
      comment: null,
    },
    {
      title: "2024年に書いた記事の数は...？",
      content: BlogCount,
      comment: {
        avatarUrl: "https://avatars.githubusercontent.com/u/1396951",
        name: "azukiazusa",
        comment: "こんにちは、かわいい犬ですね！",
        snsLink: "https://twitter.com/azukiazusa",
      },
    },
    {
      title: "よく使われたタグは...？",
      content: PopularTag,
      comment: {
        avatarUrl: "https://avatars.githubusercontent.com/u/1396951",
        name: "azukiazusa",
        comment: "こんにちは、かわいい犬ですね！",
        snsLink: "https://twitter.com/azukiazusa",
      },
    },
    {
      title: "人気があった記事は...？",
      content: PopularArticle,
      comment: {
        avatarUrl: "https://avatars.githubusercontent.com/u/1396951",
        name: "azukiazusa",
        comment: "こんにちは、かわいい犬ですね！",
        snsLink: "https://twitter.com/azukiazusa",
      },
    },
    {
      title: "新たな取り組みとして、ショート記事の投稿を開始しました。",
      content: Short,
      comment: {
        avatarUrl:
          "https://lh3.googleusercontent.com/c-z7BK6NYcQIruZJd9A4KI1m8YrBauXH0VRglPudmj9Fgr5yzgJCsnaZ5W_nxZnB2hazA9hsg05uX1djFYPbMS-DsbYXp6UtVKFfdicBfF8klhVshJ8",
        name: "Gemini",
        comment:
          "短い時間で気軽に学べるので、通勤時間にも役立っています。特に、普段あまり使わない機能の紹介は、新しい発見があって嬉しいです。",
        snsLink: "https://gemini.google.com/app?hl=ja",
      },
    },
    {
      title: "今年は5つのイベントで登壇しました🎤",
      content: Speak,
    },
    {
      title: "2024年の振り返りは以上です✍️",
      content: End,
    },
  ];
</script>

<div
  id="article-info"
  class="flex h-screen items-center justify-center bg-gradient-to-b from-purple-900 to-indigo-900 text-white"
>
  <div class="mx-auto w-full max-w-2xl p-8">
    {#key currentSlide}
      <div
        in:fly={{
          y: direction === "forward" ? -50 : 50,
          duration: 700,
        }}
        class={`w-full max-w-2xl rounded-lg bg-white p-8 text-black shadow-lg`}
      >
        <h2 class="mb-6 text-center text-3xl font-bold">
          {slides[currentSlide].title}
        </h2>
        <div class="flex min-h-96 flex-col content-center justify-between">
          <svelte:component this={slides[currentSlide].content} />
          {#if slides[currentSlide].comment}
            <AvatarComment
              avatarUrl={slides[currentSlide].comment.avatarUrl}
              name={slides[currentSlide].comment.name}
              comment={slides[currentSlide].comment.comment}
              snsLink={slides[currentSlide].comment.snsLink}
            />
          {/if}
        </div>
      </div>
    {/key}

    <div class="mt-8 flex max-w-2xl justify-between">
      <button
        on:click={() => setPreviousSlide()}
        disabled={currentSlide === 0}
        class="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-black px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      >
        Previous
      </button>
      <div class="flex items-center justify-center">
        {#each slides as _, i}
          <button
            class={`mx-1 h-4 w-4 rounded-full bg-white ${
              i === currentSlide ? "opacity-100" : "opacity-50"
            }`}
            aria-label={`Slide ${i + 1}`}
            on:click={() => (currentSlide = i)}
          ></button>
        {/each}
      </div>
      <button
        on:click={() => setNextSlide()}
        disabled={currentSlide === slides.length - 1}
        class="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-black px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</div>
