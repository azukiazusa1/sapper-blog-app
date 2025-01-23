<script lang="ts">
  import { onMount } from "svelte";
  import { fly, slide } from "svelte/transition";
  const scrollToThankYou = () => {
    const thankYou = document.getElementById("thank-you");
    thankYou?.scrollIntoView({ behavior: "smooth" });
  };

  let isMounted = false;
  onMount(() => {
    isMounted = true;
  });
</script>

{#if isMounted}
  <div class="mt-20 flex flex-col items-center md:mt-32">
    <p in:slide={{ delay: 500 }} class="text-lg font-bold">
      最後に感謝のメッセージを送ります。
    </p>

    <button
      in:fly={{ delay: 1200, y: 50, duration: 500 }}
      class="animate-gradient bg-linear-to-r focus:outline-hidden mt-4 transform rounded-md from-blue-500 to-purple-600 px-6 py-2 font-semibold text-white shadow-sm transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      on:click={() => scrollToThankYou()}
    >
      ここをクリック！
    </button>
  </div>
{/if}
