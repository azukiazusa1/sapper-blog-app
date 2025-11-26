<script lang="ts">
  import { fade, fly } from "svelte/transition";

  interface Props {
    onSubmit: () => void;
  }

  let { onSubmit }: Props = $props();
  let showInput = $state(false);

  $effect(() => {
    const timer = setTimeout(() => {
      showInput = true;
    }, 1000);
    return () => clearTimeout(timer);
  });
</script>

<div
  id="chat-interface"
  class="flex min-h-screen items-center justify-center bg-linear-to-b from-purple-900 to-indigo-900 p-8"
>
  <div class="w-full max-w-2xl space-y-6">
    <!-- AI Message -->
    <div in:fly={{ y: 50, duration: 500 }} class="flex items-start gap-4">
      <div
        class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500"
      >
        <svg
          class="h-6 w-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>
      <div
        class="max-w-md rounded-2xl rounded-tl-none bg-white p-6 shadow-lg"
      >
        <p class="text-gray-900">
          こんにちは！2025年の振り返りを作成しますか？
        </p>
        <p class="mt-2 text-sm text-gray-600">
          AI
          エージェントがリアルタイムでコードを書きながら、あなたの一年をまとめます。
        </p>
      </div>
    </div>

    <!-- User Input -->
    {#if showInput}
      <div in:fly={{ y: 50, duration: 500, delay: 300 }} class="flex justify-end">
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
          <form
            onsubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
            class="space-y-4"
          >
            <input
              type="text"
              value="azukiazusa.dev の 2025 年の振り返りを教えて"
              readonly
              class="w-full rounded-lg border-2 border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-purple-500 focus:outline-hidden focus:ring-2 focus:ring-purple-200"
            />
            <button
              type="submit"
              class="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg focus:scale-105 focus:outline-hidden focus:ring-4 focus:ring-purple-300"
            >
              送信 →
            </button>
          </form>
        </div>
      </div>
    {/if}
  </div>
</div>
