<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { m } from "$paraglide/messages";
  import HeroSection from "./HeroSection.svelte";
  import ChatInterface from "./ChatInterface.svelte";
  import EditorWindow from "./CodeEditor/EditorWindow.svelte";
  import BlogStats from "./FinalRecap/BlogStats.svelte";
  import PopularTags from "./FinalRecap/PopularTags.svelte";
  import PopularPosts from "./FinalRecap/PopularPosts.svelte";
  import TalksTimeline from "./FinalRecap/TalksTimeline.svelte";
  import ThankYou from "./FinalRecap/ThankYou.svelte";
  import ScrollIndicator from "./FinalRecap/ScrollIndicator.svelte";
  import { defaultTheme, type ThemeId } from "./themes";
  import Ogp from "../../../components/Ogp.svelte";

  type Section = "hero" | "chat" | "editor" | "recap";
  let currentSection = $state<Section>("hero");
  let selectedTheme = $state<ThemeId>(defaultTheme);

  // Auto-dismiss the recap banner when visiting the recap page
  onMount(() => {
    localStorage.setItem("recap-2025-banner-dismissed", "true");
  });

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleGetStarted = async () => {
    currentSection = "chat";
    setTimeout(() => {
      scrollToSection("chat-interface");
    }, 100);
  };

  const handleChatSubmit = () => {
    currentSection = "editor";
    setTimeout(() => {
      scrollToSection("code-editor");
    }, 100);
  };

  const handleEditorComplete = () => {
    currentSection = "recap";
    setTimeout(() => {
      scrollToSection("final-recap");
    }, 500);
  };

  const handleSkipToResults = () => {
    currentSection = "recap";
    setTimeout(() => {
      scrollToSection("final-recap");
    }, 100);
  };

  const handleThemeSelected = (theme: ThemeId) => {
    selectedTheme = theme;
  };

  // Check for prefers-reduced-motion
  let prefersReducedMotion = $state(false);
  $effect(() => {
    if (typeof window !== "undefined") {
      prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
    }
  });
</script>

<svelte:head>
  <title>azukiazusa.dev 2025 Recap</title>
  <meta name="description" content={m.recap2025MetaDescription()} />
</svelte:head>

<Ogp
  title="azukiazusa.dev 2025 Recap"
  description={m.recap2025MetaDescription()}
  url="https://azukiazusa.dev/recap/2025"
  image="https://azukiazusa.dev/recap/2025/ogp.png"
/>

<!-- Hero Section -->
<div id="hero">
  <HeroSection onGetStarted={handleGetStarted} />
</div>

<!-- Chat Interface -->
{#if currentSection !== "hero"}
  <ChatInterface
    onSubmit={handleChatSubmit}
    onThemeSelected={handleThemeSelected}
    onSkip={handleSkipToResults}
    {currentSection}
  />
{/if}

<!-- Code Editor Animation -->
{#if currentSection === "editor" || currentSection === "recap"}
  {#if prefersReducedMotion}
    <!-- Skip animation for reduced motion preference -->
    <div class="flex min-h-screen items-center justify-center">
      <div class="text-center">
        <p class="mb-4 text-xl">{m.recap2025Loading()}</p>
        <button
          onclick={handleSkipToResults}
          class="rounded-lg bg-orange-600 px-6 py-3 text-white hover:bg-orange-700"
        >
          {m.recap2025ShowResults()}
        </button>
      </div>
    </div>
  {:else}
    <EditorWindow onComplete={handleEditorComplete} theme={selectedTheme} />
  {/if}
{/if}

<!-- Final Recap Sections -->
{#if currentSection === "recap"}
  <div id="final-recap" class="scroll-mt-8">
    <!-- Intro Section -->
    <section class="recap-section bg-stone-50" in:fade={{ delay: 300 }}>
      <div class="mx-auto max-w-4xl text-center">
        <h2 class="section-title text-stone-900">
          azukiazusa.dev<br />2025 Recap
        </h2>
        <p class="text-xl text-stone-600 md:text-2xl">
          {m.recap2025IntroSubtitle()}
        </p>
      </div>

      <!-- Scroll Indicator -->
      <ScrollIndicator theme={selectedTheme} />
    </section>

    <!-- Blog Statistics -->
    <section id="blog-stats" class="recap-section bg-white">
      <div class="mx-auto max-w-full">
        <h2 class="section-title text-stone-900">
          {m.recap2025ArticlesSection()}
        </h2>
        <BlogStats theme={selectedTheme} />
        <p class="mt-8 text-center text-lg text-stone-600">
          {m.recap2025WordsWritten()}
        </p>
      </div>
    </section>

    <!-- Popular Tags -->
    <section class="recap-section bg-stone-50">
      <div class="mx-auto max-w-4xl">
        <h2 class="section-title text-stone-900">
          {m.recap2025PopularTagsSection()}
        </h2>
        <PopularTags theme={selectedTheme} />
        <p class="mt-8 text-center text-lg text-stone-600">
          {m.recap2025PopularTagsDescription()}
        </p>
      </div>
    </section>

    <!-- Popular Posts -->
    <section class="recap-section bg-white">
      <div class="mx-auto max-w-4xl">
        <h2 class="section-title text-stone-900">
          {m.recap2025PopularPostsSection()}
        </h2>
        <PopularPosts theme={selectedTheme} />
        <p class="mt-8 text-center text-lg text-stone-600">
          {m.recap2025PopularPostsDescription()}
        </p>
      </div>
    </section>

    <!-- Talks & Presentations -->
    <section class="recap-section bg-stone-50">
      <div class="mx-auto max-w-4xl">
        <h2 class="section-title text-stone-900">
          {m.recap2025TalksSection()}
        </h2>
        <p class="mb-8 text-center text-xl text-stone-600">
          {m.recap2025TalksDescription()}
        </p>
        <TalksTimeline theme={selectedTheme} />
      </div>
    </section>

    <!-- Thank You -->
    <section class="thank-you-section bg-stone-50">
      <ThankYou theme={selectedTheme} />
    </section>
  </div>
{/if}

<style>
  .recap-section {
    min-height: 100vh;
    padding: 120px 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .thank-you-section {
    min-height: 100vh;
    padding-top: 64px;
  }

  .section-title {
    font-size: 3rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 64px;
    line-height: 1.2;
  }

  @media (max-width: 768px) {
    .section-title {
      font-size: 2rem;
    }

    .recap-section {
      padding: 80px 20px;
    }
  }
</style>
