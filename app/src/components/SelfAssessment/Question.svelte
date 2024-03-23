<script lang="ts">
  import type { Quiz } from "./types";

  export let quiz: Quiz;
</script>

<div class="flex flex-col justify-center">
  <h3
    class="rounded-ss-md bg-gray-200 px-4 py-8 text-lg font-medium dark:bg-zinc-600"
  >
    {quiz.question}
  </h3>
  <ul class="flex flex-col justify-center">
    {#each quiz.answers as answer}
      <li role="listitem">
        <details
          class="border border-t-0 border-gray-300 font-medium text-gray-900 dark:border-zinc-600 dark:text-gray-50"
        >
          <summary
            class="cursor-pointer p-4 text-lg hover:bg-gray-100 dark:hover:bg-zinc-700"
          >
            {answer.text}
          </summary>
          <div class="p-4">
            <p>
              {#if answer.correct}
                <div class="flex items-center gap-1 text-green-500">
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
                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>

                  正解！
                </div>
              {:else}
                <div class="flex items-center gap-2 text-red-500">
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>

                  もう一度考えてみましょう
                </div>
              {/if}
            </p>
            {#if answer.explanation}
              <p class="mt-4">{answer.explanation}</p>
            {/if}
          </div>
        </details>
      </li>
    {/each}
  </ul>
</div>
