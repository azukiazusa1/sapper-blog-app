<script lang="ts">
  import Hero from "./Hero.svelte";
  import ArticleInfo from "./ArticleInfo.svelte";
  import MostFrequentArticle from "./MostFrequentArticle.svelte";
  import MostFrequentTag from "./MostFrequentTag.svelte";
  import ThankYou from "./ThankYou.svelte";
  import Ogp from "../../../components/Ogp.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<Ogp
  title="azukiazusa.dev 2023 Recap"
  description="2023 年の azukiazusa.dev の記録を振り返りましょう。"
  url="https://azukiazusa.dev/recap/2023"
  image="https://azukiazusa.dev/recap/2023/ogp.png"
/>

<div>
  <Hero />
  <ArticleInfo />
  <MostFrequentArticle isTestBuild={data.isTestBuild} />
  <MostFrequentTag />
  <ThankYou />
</div>
