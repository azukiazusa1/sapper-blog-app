<script lang="ts">
  import { inview } from "svelte-inview";
  import { defaultTheme, type ThemeId } from "../themes";

  interface Props {
    theme?: ThemeId;
  }

  let { theme = defaultTheme }: Props = $props();

  let isInView = $state(false);

  const url = "https://azukiazusa.dev/recap/2025";
  const text = "2025年のazukiazusa.devの記録を振り返りましょう🙏";
  const escapedText = encodeURIComponent(text);

  // Get gradient colors based on theme
  const gradients: Record<ThemeId, {
    bg: { from: string; via: string; to: string };
    orb1: { from: string; to: string };
    orb2: { from: string; to: string };
    title: { from: string; via: string; to: string };
    ctaPrimary: { from: string; to: string };
    ctaSecondary: string;
    backLink: string;
  }> = {
    orange: {
      bg: { from: 'from-orange-900', via: 'via-red-900', to: 'to-gray-900' },
      orb1: { from: 'from-orange-500', to: 'to-red-600' },
      orb2: { from: 'from-red-500', to: 'to-orange-600' },
      title: { from: 'from-white', via: 'via-orange-200', to: 'to-white' },
      ctaPrimary: { from: 'from-orange-500', to: 'to-red-600' },
      ctaSecondary: 'border-orange-400 text-orange-300 hover:bg-orange-400/10',
      backLink: 'text-gray-400 hover:text-orange-300'
    },
    blue: {
      bg: { from: 'from-blue-900', via: 'via-cyan-900', to: 'to-gray-900' },
      orb1: { from: 'from-blue-500', to: 'to-cyan-600' },
      orb2: { from: 'from-cyan-500', to: 'to-blue-600' },
      title: { from: 'from-white', via: 'via-blue-200', to: 'to-white' },
      ctaPrimary: { from: 'from-blue-500', to: 'to-cyan-600' },
      ctaSecondary: 'border-blue-400 text-blue-300 hover:bg-blue-400/10',
      backLink: 'text-gray-400 hover:text-blue-300'
    },
    purple: {
      bg: { from: 'from-purple-900', via: 'via-pink-900', to: 'to-gray-900' },
      orb1: { from: 'from-purple-500', to: 'to-pink-600' },
      orb2: { from: 'from-pink-500', to: 'to-purple-600' },
      title: { from: 'from-white', via: 'via-purple-200', to: 'to-white' },
      ctaPrimary: { from: 'from-purple-500', to: 'to-pink-600' },
      ctaSecondary: 'border-purple-400 text-purple-300 hover:bg-purple-400/10',
      backLink: 'text-gray-400 hover:text-purple-300'
    },
    green: {
      bg: { from: 'from-green-900', via: 'via-emerald-900', to: 'to-gray-900' },
      orb1: { from: 'from-green-500', to: 'to-emerald-600' },
      orb2: { from: 'from-emerald-500', to: 'to-green-600' },
      title: { from: 'from-white', via: 'via-green-200', to: 'to-white' },
      ctaPrimary: { from: 'from-green-500', to: 'to-emerald-600' },
      ctaSecondary: 'border-green-400 text-green-300 hover:bg-green-400/10',
      backLink: 'text-gray-400 hover:text-green-300'
    },
    pink: {
      bg: { from: 'from-pink-900', via: 'via-rose-900', to: 'to-gray-900' },
      orb1: { from: 'from-pink-500', to: 'to-rose-600' },
      orb2: { from: 'from-rose-500', to: 'to-pink-600' },
      title: { from: 'from-white', via: 'via-pink-200', to: 'to-white' },
      ctaPrimary: { from: 'from-pink-500', to: 'to-rose-600' },
      ctaSecondary: 'border-pink-400 text-pink-300 hover:bg-pink-400/10',
      backLink: 'text-gray-400 hover:text-pink-300'
    },
  };

  const gradient = $derived(gradients[theme]);
</script>

<div
  use:inview
  oninview_change={(e) => { isInView = e.detail.inView; }}
  class="relative overflow-hidden min-h-screen w-full
         bg-gradient-to-br {gradient.bg.from} {gradient.bg.via} {gradient.bg.to}"
>
  <!-- Decorative blur orbs -->
  <div class="absolute top-0 left-0 w-72 h-72 md:w-96 md:h-96 rounded-full
              bg-gradient-to-br {gradient.orb1.from} {gradient.orb1.to}
              opacity-10 blur-3xl"></div>
  <div class="absolute bottom-0 right-0 w-72 h-72 md:w-96 md:h-96 rounded-full
              bg-gradient-to-br {gradient.orb2.from} {gradient.orb2.to}
              opacity-10 blur-3xl"></div>

  <div
    class="relative z-10 text-center py-20 md:py-24 px-6 md:px-8
           transform transition-all duration-1000 ease-out min-h-screen flex flex-col justify-center"
    class:translate-y-0={isInView}
    class:opacity-100={isInView}
    class:translate-y-12={!isInView}
    class:opacity-0={!isInView}
  >
    <!-- Massive gradient heading -->
    <h2 class="text-5xl md:text-6xl lg:text-8xl font-black mb-8 md:mb-10
               bg-gradient-to-r {gradient.title.from} {gradient.title.via} {gradient.title.to}
               bg-clip-text text-transparent leading-tight px-4">
      2025年も<br class="md:hidden">ありがとう<br class="hidden md:inline">ございました！
    </h2>

    <!-- Body text (white) -->
    <p class="text-base md:text-lg lg:text-xl text-gray-100 max-w-3xl mx-auto mb-10 md:mb-12 leading-relaxed px-4">
      今年は AI エージェント時代の幕開けとともに、新たな技術探求の旅が始まりました。
      78 本の記事、9 回の登壇を通じて、多くの方々と知見を共有できたことを嬉しく思います。
      2026年も、変化し続ける技術の世界で、みなさんと一緒に学び、成長していきたいと思います。
    </p>

    <!-- CTA buttons -->
    <div class="flex flex-wrap justify-center gap-4 md:gap-6 px-4">
      <!-- Primary CTA (gradient background) -->
      <a
        href="https://azukiazusa.dev"
        class="group relative px-6 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg font-bold
               transform transition-all duration-300 hover:scale-105"
      >
        <div class="absolute inset-0 bg-gradient-to-r {gradient.ctaPrimary.from} {gradient.ctaPrimary.to}
                    rounded-xl group-hover:shadow-2xl transition-shadow duration-300"></div>
        <div class="absolute inset-0 bg-gradient-to-r {gradient.ctaPrimary.from} {gradient.ctaPrimary.to}
                    rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
        <span class="relative text-white">ブログを見る</span>
      </a>

      <!-- Secondary CTA (outline) -->
      <a
        href={`https://x.com/share?url=${url}&text=${escapedText}`}
        target="_blank"
        rel="noopener noreferrer"
        class="px-6 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg font-bold
               border-2 {gradient.ctaSecondary}
               transition-all duration-300 hover:scale-105"
      >
        Xで共有
      </a>
    </div>

    <!-- Back to top link -->
    <div class="mt-12 md:mt-16">
      <a
        href="#hero"
        class="{gradient.backLink} transition-colors duration-200 text-sm md:text-base"
      >
        ↑ トップに戻る
      </a>
    </div>
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
