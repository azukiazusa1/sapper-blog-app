<script lang="ts">
  import { m } from "$paraglide/messages";
  import type { Quiz } from "./types";

  interface Props {
    quiz: Quiz;
  }

  let { quiz }: Props = $props();
</script>

<div class="flex flex-col justify-center">
  <h3
    class="rounded-ss-md bg-stone-100 px-4 py-8 text-lg font-medium dark:bg-stone-700"
  >
    {quiz.question}
  </h3>
  <ul class="flex flex-col justify-center">
    {#each quiz.answers as answer}
      <li role="listitem">
        <details
          class="border border-t-0 border-stone-200 font-medium text-stone-900 dark:border-stone-700 dark:text-stone-100"
        >
          <summary
            class="cursor-pointer p-4 text-lg hover:bg-stone-100 dark:hover:bg-stone-700"
          >
            {answer.text}
          </summary>
          <div class="p-4">
            <p>
              {#if answer.correct}
                <span class="flex items-center gap-1 text-green-500">
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

                  {m.selfAssessmentCorrect()}
                </span>
              {:else}
                <span class="flex items-center gap-2 text-red-500">
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

                  {m.selfAssessmentTryAgain()}
                </span>
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
