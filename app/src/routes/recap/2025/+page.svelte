<script lang="ts">
  import { fade } from "svelte/transition";
  import HeroSection from "./HeroSection.svelte";
  import ChatInterface from "./ChatInterface.svelte";
  import EditorWindow from "./CodeEditor/EditorWindow.svelte";
  import BlogStats from "./FinalRecap/BlogStats.svelte";
  import PopularTags from "./FinalRecap/PopularTags.svelte";
  import PopularPosts from "./FinalRecap/PopularPosts.svelte";
  import TalksTimeline from "./FinalRecap/TalksTimeline.svelte";
  import ThankYou from "./FinalRecap/ThankYou.svelte";
  import ScrollIndicator from "./FinalRecap/ScrollIndicator.svelte";

  type Section = "hero" | "chat" | "editor" | "recap";
  let currentSection = $state<Section>("hero");
  let showSkipButton = $state(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleGetStarted = () => {
    currentSection = "chat";
    setTimeout(() => {
      scrollToSection("chat-interface");
    }, 100);
  };

  const handleChatSubmit = () => {
    currentSection = "editor";
    showSkipButton = true;
    setTimeout(() => {
      scrollToSection("code-editor");
    }, 100);
  };

  const handleEditorComplete = () => {
    currentSection = "recap";
    showSkipButton = false;
    setTimeout(() => {
      scrollToSection("final-recap");
    }, 500);
  };

  const handleSkipToResults = () => {
    currentSection = "recap";
    showSkipButton = false;
    setTimeout(() => {
      scrollToSection("final-recap");
    }, 100);
  };

  // Check for prefers-reduced-motion
  let prefersReducedMotion = $state(false);
  $effect(() => {
    if (typeof window !== "undefined") {
      prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
    }
  });
</script>

<svelte:head>
  <title>azukiazusa.dev 2025 Recap</title>
  <meta
    name="description"
    content="AI エージェントが作成する、azukiazusa.dev の 2025 年の振り返り"
  />
</svelte:head>

<!-- Skip Animation Button -->
{#if showSkipButton}
  <button
    in:fade
    onclick={handleSkipToResults}
    class="fixed top-4 right-4 z-50 rounded-lg bg-white px-4 py-2 shadow-lg transition-transform duration-200 hover:scale-105 focus:scale-105 focus:outline-hidden focus:ring-4 focus:ring-purple-300"
    aria-label="アニメーションをスキップして結果を表示"
  >
    結果を見る →
  </button>
{/if}

<!-- Hero Section -->
<div id="hero">
  <HeroSection onGetStarted={handleGetStarted} />
</div>

<!-- Chat Interface -->
{#if currentSection !== "hero"}
  <ChatInterface onSubmit={handleChatSubmit} />
{/if}

<!-- Code Editor Animation -->
{#if currentSection === "editor" || currentSection === "recap"}
  {#if prefersReducedMotion}
    <!-- Skip animation for reduced motion preference -->
    <div class="flex min-h-screen items-center justify-center">
      <div class="text-center">
        <p class="mb-4 text-xl">読み込み中...</p>
        <button
          onclick={handleSkipToResults}
          class="rounded-lg bg-purple-600 px-6 py-3 text-white hover:bg-purple-700"
        >
          結果を表示
        </button>
      </div>
    </div>
  {:else}
    <EditorWindow onComplete={handleEditorComplete} />
  {/if}
{/if}

<!-- Final Recap Sections -->
{#if currentSection === "recap"}
  <div id="final-recap" class="scroll-mt-8">
    <!-- Intro Section -->
    <section
      class="recap-section bg-gray-50"
      in:fade={{ delay: 300 }}
    >
      <div class="mx-auto max-w-4xl text-center">
        <h2 class="section-title text-gray-900">
          azukiazusa.dev<br />2025 Recap
        </h2>
        <p class="text-xl text-gray-600 md:text-2xl">
          AI エージェント時代の幕開けとともに歩んだ、<br />2025年の技術探求の旅を振り返ります
        </p>
      </div>

      <!-- Scroll Indicator -->
      <ScrollIndicator />
    </section>

    <!-- Blog Statistics -->
    <section id="blog-stats" class="recap-section bg-white">
      <div class="mx-auto max-w-4xl">
        <h2 class="section-title text-gray-900">今年書いた記事</h2>
        <BlogStats />
        <p class="mt-8 text-center text-lg text-gray-600">
          文庫本約8冊分の文字数を執筆しました
        </p>
      </div>
    </section>

    <!-- Popular Tags -->
    <section class="recap-section bg-gray-50">
      <div class="mx-auto max-w-4xl">
        <h2 class="section-title text-gray-900">人気のタグ</h2>
        <PopularTags />
        <p class="mt-8 text-center text-lg text-gray-600">
          AI と MCP の記事が特に多く読まれました
        </p>
      </div>
    </section>

    <!-- Popular Posts -->
    <section class="recap-section bg-white">
      <div class="mx-auto max-w-4xl">
        <h2 class="section-title text-gray-900">人気の記事 Top 3</h2>
        <PopularPosts />
      </div>
    </section>

    <!-- Talks & Presentations -->
    <section class="recap-section bg-gray-50">
      <div class="mx-auto max-w-4xl">
        <h2 class="section-title text-gray-900">登壇したイベント</h2>
        <p class="mb-8 text-center text-xl text-gray-600">
          今年は9つのイベントで発表しました
        </p>
        <TalksTimeline />
      </div>
    </section>

    <!-- Thank You -->
    <section class="recap-section bg-white">
      <div class="mx-auto max-w-4xl">
        <ThankYou />
      </div>
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
