<script lang="ts">
  import HeroSection from "./HeroSection.svelte";
  import Ogp from "../../../components/Ogp.svelte";
  import ThankYou from "./ThankYou.svelte";
  import Slides from "./slides.svelte";
</script>

<Ogp
  title="azukiazusa.dev 2024 Recap"
  description="2024 年の azukiazusa.dev の記録を振り返りましょう。"
  url="https://azukiazusa.dev/recap/2024"
  image="https://azukiazusa.dev/recap/2024/ogp.png"
/>

<div class="overflow-x-hidden">
  <HeroSection />

  <Slides />

  <ThankYou />
</div>
