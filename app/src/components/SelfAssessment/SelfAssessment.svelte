<script lang="ts">
  import type { Quiz } from "./types";
  import Question from "./Question.svelte";

  interface Props {
    quizzes: Quiz[];
  }

  let { quizzes }: Props = $props();
</script>

<h2
  class="flex items-center gap-2 border-b border-gray-300 dark:border-zinc-700"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="h-6 w-6"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
    />
  </svg>

  記事の理解度チェック
</h2>

<p class="mb-8">以下の問題に答えて、記事の理解を深めましょう。</p>

<div class="flex flex-col gap-8">
  {#each quizzes as quiz}
    <Question {quiz} />
  {/each}
</div>

<style>
  h2 {
    font-size: 1.6em;
    font-weight: 700;
    padding-bottom: 0.1rem;
    margin-bottom: 2.1rem;
    padding-top: 1.5rem;
  }
</style>
