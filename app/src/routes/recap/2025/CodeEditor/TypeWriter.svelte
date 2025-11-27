<script lang="ts">
  import { onMount } from "svelte";

  interface Props {
    text: string;
    speed?: number; // characters per second
    onComplete?: () => void;
    showCursor?: boolean;
  }

  let { text, speed = 100, onComplete, showCursor = true }: Props = $props();

  let displayedText = $state("");
  let currentIndex = $state(0);
  let isComplete = $state(false);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  async function typeText() {
    const delay = 1000 / speed;

    for (let i = 0; i < text.length; i++) {
      displayedText = text.substring(0, i + 1);
      currentIndex = i + 1;
      await sleep(delay);
    }

    isComplete = true;
    onComplete?.();
  }

  onMount(() => {
    typeText();
  });
</script>

<span class="relative">
  {@html displayedText}
  {#if showCursor && !isComplete}
    <span class="typing-cursor">|</span>
  {/if}
</span>

<style>
  .typing-cursor {
    animation: blink 1s infinite;
  }

  @keyframes blink {
    0%,
    50% {
      opacity: 1;
    }
    51%,
    100% {
      opacity: 0;
    }
  }
</style>
