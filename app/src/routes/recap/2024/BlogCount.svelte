<script lang="ts">
  import { scale } from "svelte/transition";
  import CountUp from "../CountUp.svelte";
</script>

<div in:scale class="mt-8 space-y-4 text-center">
  <div class="mb-4 text-6xl font-bold">
    <CountUp initial={0} value={56} duration={700} />
    <span class="text-xl">Posts</span>
  </div>

  <p class="text-xl">文字数に換算すると</p>

  <div class="count text-6xl font-bold">
    <CountUp initial={0} value={420686} duration={700} />
    <span class="text-2xl"> Words </span>
  </div>
  <p class="text-xl">📚これは本 5 冊分に相当します！</p>
</div>
