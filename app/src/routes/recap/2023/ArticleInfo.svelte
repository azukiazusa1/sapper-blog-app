<script lang="ts">
  import CountUp from "../CountUp.svelte";
  import Section from "../Section.svelte";
</script>

<Section>
  <div id="article-info">
    <p class="text-2xl font-bold md:text-6xl">
      2023 年には <span class="count text-indigo-600 dark:text-indigo-400">
        <CountUp initial={0} value={64} duration={1000} />
      </span> 本の記事を書きました。
    </p>
  </div>
</Section>

<Section>
  <p class="text-2xl font-bold md:text-6xl">
    文字数に換算するとなんと <span
      class="count text-indigo-600 dark:text-indigo-400"
      ><CountUp initial={0} value={434535} duration={1000} />
    </span> 文字です。
  </p>
</Section>

<style>
  .count {
    font-variant: tabular-nums;
    font-feature-settings: "tnum";
  }
</style>
