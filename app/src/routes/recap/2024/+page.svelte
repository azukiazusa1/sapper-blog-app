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
  import ThankYou from "./ThankYou.svelte";
  import Slides from "./slides.svelte";

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

<div>
  <HeroSection />

  <Slides />

  <ThankYou />
</div>
