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

  let currentSlide = $state(0);
  let direction: "forward" | "backward" = $state("forward");
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
        avatarUrl:
          "https://images.ctfassets.net/in6v9lxmm5c8/3MKUQDtbluLrDFJ8klu6nw/565e903103f679538f34b2de2e8c91ac/AsrXPzSl_400x400.jpg?fm=webp",
        name: "Arthur",
        comment:
          "今年1年間の記事の合計文字数である420686文字を素因数分解すると2*7*151*199になります。RSAチャレンジ失敗ですね。来年は頑張ってください。というのはさておき、この文字数は文庫本4冊分に相当するようですよ。",
        snsLink: "https://x.com/Arthur1__",
      },
    },
    {
      title: "よく使われたタグは...？",
      content: PopularTag,
      comment: {
        avatarUrl: "https://avatars.githubusercontent.com/u/76464810?v=4",
        name: "rmatsuoka",
        comment:
          "CSSやアクセシビリティの記事はよく参考にしています。CSSやHTMLはいいかげんに書いてもそれっぽい見た目のページは作れますが、それでは使いづらいユーザーがいることがわかりました。azukiazusa.dev を参考に幅広いユーザーが利用しやすいページを作っていきたいですね。",
        snsLink: "https://rmatsuoka.org/",
      },
    },
    {
      title: "人気があった記事は...？",
      content: PopularArticle,
      comment: {
        avatarUrl: "https://i.gyazo.com/1257e2d39295306a5f0c5e6c85e7dc2f.png",
        name: "mizdra",
        comment:
          "Remix の SPA モードは create-react-app の代わりとして注目を浴びましたね。HonoX はミニマムな Web アプリケーションサーバーを作りたい時に重宝しそうですね。",
        snsLink: "https://x.com/mizdra",
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
      comment: {
        avatarUrl: "https://avatars.githubusercontent.com/u/1784379?v=4",
        name: "lufia",
        comment:
          "過去の発表をみた人から登壇依頼されるなど、2024年は好循環しているように思いました。どれも面白いけれど推しはJSConf JP 2024のLTです。",
        snsLink: "https://x.com/plan9user",
      },
    },
    {
      title: "2024年の振り返りは以上です✍️",
      content: End,
    },
  ];

  const SvelteComponent = $derived(slides[currentSlide].content);
</script>

<div
  id="article-info"
  class="flex h-screen items-center justify-center bg-linear-to-b from-purple-900 to-indigo-900 text-white"
>
  <div class="mx-auto w-full max-w-2xl p-4 md:p-8">
    {#key currentSlide}
      <div
        in:fly={{
          y: direction === "forward" ? -50 : 50,
          duration: 700,
        }}
        class={`max-h-[520px] w-full max-w-2xl rounded-lg bg-white p-4 text-black shadow-lg md:p-8`}
      >
        <h2 class="mb-6 text-center text-2xl font-bold md:text-3xl">
          {slides[currentSlide].title}
        </h2>
        <div class="flex min-h-96 flex-col content-center justify-between">
          <SvelteComponent />
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
        onclick={() => setPreviousSlide()}
        disabled={currentSlide === 0}
        class="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors hover:bg-stone-800 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
      >
        Previous
      </button>
      <div class="flex items-center justify-center">
        {#each slides as slide, i}
          <button
            class={`mx-1 h-4 w-4 rounded-full bg-white ${
              i === currentSlide ? "opacity-100" : "opacity-50"
            }`}
            aria-label={slide.title}
            onclick={() => (currentSlide = i)}
          ></button>
        {/each}
      </div>
      <button
        onclick={() => setNextSlide()}
        disabled={currentSlide === slides.length - 1}
        class="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors hover:bg-stone-800 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</div>
