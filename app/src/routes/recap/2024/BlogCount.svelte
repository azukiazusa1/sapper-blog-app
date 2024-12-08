<script lang="ts">
  import { scale } from "svelte/transition";
  import CountUp from "../CountUp.svelte";
</script>

<div in:scale class="mt-8 space-y-4 text-center">
  <div class="mb-4 text-4xl font-bold md:text-6xl">
    <CountUp initial={0} value={56} duration={700} />
    <span class="text-xl">Posts</span>
  </div>

  <p class="text-lg md:text-xl">文字数に換算すると</p>

  <div class="count text-4xl font-bold md:text-6xl">
    <CountUp initial={0} value={420686} duration={700} />
    <span class="text-2xl"> Words </span>
  </div>
  <p class="text-lg md:text-xl">📚これは本 5 冊分に相当します！</p>
</div>
