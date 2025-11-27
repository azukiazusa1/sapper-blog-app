<script lang="ts">
  import { fade } from "svelte/transition";
  import { recap2025 } from "../Data2025";
  import { themes, defaultTheme, type ThemeId } from "../themes";

  interface Props {
    theme?: ThemeId;
  }

  let { theme = defaultTheme }: Props = $props();
</script>

<div
  class="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
>
  {#each recap2025.talks as talk, i}
    <div
      in:fade={{ delay: i * 100, duration: 300 }}
      class="rounded-xl border border-gray-200 bg-white p-6 transition-all duration-200 {themes[
        theme
      ].colors.cardHoverBorder} hover:shadow-lg"
    >
      <div class="mb-2 text-xs text-gray-500">{talk.eventDate}</div>
      <h4 class="mb-2 text-base font-semibold text-gray-900">
        {talk.eventTitle}
      </h4>
      <p class="text-sm text-gray-600">
        <a
          href={talk.presentationLink}
          target="_blank"
          rel="noopener noreferrer"
          class="font-semibold {themes[theme].colors.textAccentColor} {themes[
            theme
          ].colors.hoverTextAccentColor} hover:underline"
        >
          {talk.presentationTitle}
        </a>
      </p>
      {#if talk.description}
        <p class="mt-2 text-sm text-gray-500">
          {talk.description}
        </p>
      {/if}
    </div>
  {/each}
</div>
