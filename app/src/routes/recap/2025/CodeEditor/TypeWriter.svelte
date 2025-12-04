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
  let isComplete = $state(false);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  async function typeText() {
    // Batch update: update multiple characters at once for better performance
    const charsPerUpdate = 3; // Update 3 characters at a time
    const delay = (1000 / speed) * charsPerUpdate;

    for (let i = 0; i < text.length; i += charsPerUpdate) {
      const endIndex = Math.min(i + charsPerUpdate, text.length);
      displayedText = text.substring(0, endIndex);
      currentIndex = endIndex;
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
  {displayedText}
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
