<script lang="ts">
  import { inview } from "svelte-inview";
  import { recap2025 } from "../Data2025";
  import { defaultTheme, type ThemeId } from "../themes";

  interface Props {
    theme?: ThemeId;
  }

  let { theme = defaultTheme }: Props = $props();

  let talkInView = $state<boolean[]>(new Array(recap2025.talks.length).fill(false));

  // Get gradient colors based on theme
  const gradients: Record<ThemeId, {
    line: { from: string; via: string; to: string };
    border: { from: string; to: string };
    node: { from: string; to: string };
    date: string;
    link: { from: string; to: string };
    pulse: string;
  }> = {
    orange: {
      line: { from: 'from-orange-300', via: 'via-orange-500', to: 'to-orange-700' },
      border: { from: 'from-orange-400', to: 'to-red-600' },
      node: { from: 'from-orange-500', to: 'to-red-700' },
      date: 'text-orange-600',
      link: { from: 'from-orange-600', to: 'to-red-700' },
      pulse: 'bg-orange-500'
    },
    blue: {
      line: { from: 'from-blue-300', via: 'via-blue-500', to: 'to-blue-700' },
      border: { from: 'from-blue-400', to: 'to-cyan-600' },
      node: { from: 'from-blue-500', to: 'to-cyan-700' },
      date: 'text-blue-600',
      link: { from: 'from-blue-600', to: 'to-cyan-700' },
      pulse: 'bg-blue-500'
    },
    purple: {
      line: { from: 'from-purple-300', via: 'via-purple-500', to: 'to-purple-700' },
      border: { from: 'from-purple-400', to: 'to-pink-600' },
      node: { from: 'from-purple-500', to: 'to-pink-700' },
      date: 'text-purple-600',
      link: { from: 'from-purple-600', to: 'to-pink-700' },
      pulse: 'bg-purple-500'
    },
    green: {
      line: { from: 'from-green-300', via: 'via-green-500', to: 'to-green-700' },
      border: { from: 'from-green-400', to: 'to-emerald-600' },
      node: { from: 'from-green-500', to: 'to-emerald-700' },
      date: 'text-green-600',
      link: { from: 'from-green-600', to: 'to-emerald-700' },
      pulse: 'bg-green-500'
    },
    pink: {
      line: { from: 'from-pink-300', via: 'via-pink-500', to: 'to-pink-700' },
      border: { from: 'from-pink-400', to: 'to-rose-600' },
      node: { from: 'from-pink-500', to: 'to-rose-700' },
      date: 'text-pink-600',
      link: { from: 'from-pink-600', to: 'to-rose-700' },
      pulse: 'bg-pink-500'
    },
  };

  const gradient = $derived(gradients[theme]);
</script>

<div class="relative max-w-4xl mx-auto px-4">
  <!-- Central vertical gradient line (desktop only) -->
  <div class="absolute left-1/2 top-0 bottom-0 w-1
              bg-gradient-to-b {gradient.line.from} {gradient.line.via} {gradient.line.to}
              -translate-x-1/2 hidden md:block"></div>

  <div class="space-y-12 md:space-y-16">
    {#each recap2025.talks as talk, i}
      <div
        use:inview
        on:inview_change={(e) => { talkInView[i] = e.detail.inView; }}
        class="relative transform transition-all duration-500 ease-out"
        class:translate-y-0={talkInView[i]}
        class:opacity-100={talkInView[i]}
        class:translate-y-8={!talkInView[i]}
        class:opacity-0={!talkInView[i]}
        style="transition-delay: {i * 100}ms;"
      >
        <!-- Desktop: Timeline layout with alternating sides -->
        <div class="hidden md:flex items-center gap-8" class:flex-row-reverse={i % 2 === 1}>
          <!-- Card content (left or right side) -->
          <div class="w-[calc(50%-2rem)]">
            <!-- Gradient border card -->
            <div class="bg-gradient-to-br {gradient.border.from} {gradient.border.to} p-[2px] rounded-xl
                        transform transition-all duration-300 hover:shadow-2xl">
              <div class="bg-white rounded-xl p-5 md:p-6">
                <div class="text-xs font-bold uppercase tracking-wider {gradient.date} mb-2">
                  {talk.eventDate}
                </div>
                <h4 class="text-base md:text-lg font-bold text-gray-900 mb-2">
                  {talk.eventTitle}
                </h4>
                <a
                  href={talk.presentationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-sm font-semibold bg-gradient-to-r {gradient.link.from} {gradient.link.to}
                         bg-clip-text text-transparent hover:underline inline-block">
                  {talk.presentationTitle}
                </a>
                {#if talk.description}
                  <p class="text-sm text-gray-600 mt-2">
                    {talk.description}
                  </p>
                {/if}
              </div>
            </div>
          </div>

          <!-- Spacer for the other side -->
          <div class="w-[calc(50%-2rem)]"></div>
        </div>

        <!-- Mobile: Simple stacked layout -->
        <div class="md:hidden">
          <div class="bg-gradient-to-br {gradient.border.from} {gradient.border.to} p-[2px] rounded-xl
                      transform transition-all duration-300 hover:shadow-2xl">
            <div class="bg-white rounded-xl p-5">
              <div class="text-xs font-bold uppercase tracking-wider {gradient.date} mb-2">
                {talk.eventDate}
              </div>
              <h4 class="text-base font-bold text-gray-900 mb-2">
                {talk.eventTitle}
              </h4>
              <a
                href={talk.presentationLink}
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm font-semibold bg-gradient-to-r {gradient.link.from} {gradient.link.to}
                       bg-clip-text text-transparent hover:underline inline-block">
                {talk.presentationTitle}
              </a>
              {#if talk.description}
                <p class="text-sm text-gray-600 mt-2">
                  {talk.description}
                </p>
              {/if}
            </div>
          </div>
        </div>

        <!-- Central node (circle) - desktop only -->
        <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block z-10">
          <div class="relative">
            <div class="w-6 h-6 rounded-full bg-gradient-to-br {gradient.node.from} {gradient.node.to}
                        border-4 border-white shadow-lg"></div>
            <!-- Pulse animation -->
            <div class="absolute inset-0 w-6 h-6 rounded-full {gradient.pulse} animate-ping opacity-20"></div>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
</style>
