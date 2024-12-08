<script lang="ts">
  import CountUp from "../CountUp.svelte";
</script>

<div class="space-y-4 text-center">
  <div class="count text-6xl font-bold">
    <CountUp initial={0} value={420686} duration={500} />
    <span class="text-2xl"> Words </span>
  </div>
  <p class="text-xl">📚これは本 5 冊分の文字数に相当します！</p>
</div>

<style>
  .count {
    font-variant: tabular-nums;
    font-feature-settings: "tnum";
  }
</style>
