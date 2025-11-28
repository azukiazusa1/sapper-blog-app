<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import MessageBubble from "./ChatInterface/MessageBubble.svelte";
  import ThemeSelector from "./ChatInterface/ThemeSelector.svelte";
  import { themes, defaultTheme, type ThemeId } from "./themes";

  interface Props {
    onSubmit: () => void;
    onThemeSelected?: (theme: ThemeId) => void;
    onSkip?: () => void;
    currentSection?: "hero" | "chat" | "editor" | "recap";
  }

  let {
    onSubmit,
    onThemeSelected,
    onSkip,
    currentSection = "chat",
  }: Props = $props();

  // Message constants
  const AI_GREETING_MESSAGE = `こんにちは！なにかお手伝いできることはありますか？`;

  const PLAN_THINKING_MESSAGE = `了解しました！2025年のazukiazusa.devのRecap画面を構築するための実装プランを考えています...`;

  const THEME_QUESTION_MESSAGE = `実装に入る前に質問をさせてください。Recap画面のテーマカラーはどのような色がお好みですか？`;

  const USER_INPUT_TEXT =
    "azukiazusa.dev の 2025 年の振り返りを作成してください。";

  // Dynamic plan message based on selected theme
  let aiPlanMessage = $state("");

  // Generate AI plan message based on selected theme
  const getAIPlanMessage = (themeId: ThemeId) => {
    const themeNames: Record<ThemeId, string> = {
      orange: "オレンジ",
      blue: "ブルー",
      purple: "パープル",
      green: "グリーン",
      pink: "ピンク",
    };

    return `了解しました！${themeNames[themeId]}テーマで進めます。

以下の実装プランで2025年のRecap画面を構築します：

1. 統計情報の表示
   - 総記事数と総文字数をカウントアップアニメーションで表示
   - グラデーションテキストを使用した大きな数字
2. 人気タグの表示
   - トップ3のタグをグラデーション背景のバッジで表示
   - タグごとに記事数を表示
3. 人気記事ランキング
   - 閲覧数の多い記事TOP3を表示
   - グラデーション境界線とランクバッジ付きカード
それでは実装を開始します...`;
  };

  // State management
  let showAIGreeting = $state(false);
  let showGreetingTyping = $state(false);
  let showGreetingText = $state(false);
  let showInputForm = $state(false);
  let formSubmitted = $state(false);
  let showUserMessage = $state(false);
  let showAIPlan = $state(false);
  let showPlanTyping = $state(false);
  let showPlanText = $state(false);

  // Plan thinking states (shown first)
  let showPlanThinking = $state(false);
  let showPlanThinkingTyping = $state(false);
  let showPlanThinkingText = $state(false);

  // Theme question states (shown after plan thinking)
  let showThemeQuestion = $state(false);
  let showThemeQuestionTyping = $state(false);
  let showThemeQuestionText = $state(false);

  // Theme selection state
  let selectedTheme = $state<ThemeId | null>(null);
  let showThemeSelection = $state(false);

  // Initial animation timeline (on mount)
  $effect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Show AI greeting message bubble with typing indicator immediately
    timers.push(
      setTimeout(() => {
        showAIGreeting = true;
        showGreetingTyping = true;
      }, 0),
    );

    // Hide typing indicator and start greeting text typing after 1500ms
    timers.push(
      setTimeout(() => {
        showGreetingTyping = false;
        showGreetingText = true;
      }, 1500),
    );

    return () => timers.forEach(clearTimeout);
  });

  // Handle greeting typing complete
  const handleGreetingTypingComplete = () => {
    setTimeout(() => {
      showInputForm = true;
    }, 500);
  };

  // Handle plan thinking message typing complete
  const handlePlanThinkingComplete = () => {
    setTimeout(() => {
      showThemeQuestion = true;
      showThemeQuestionTyping = true;

      setTimeout(() => {
        showThemeQuestionTyping = false;
        showThemeQuestionText = true;
      }, 1000);
    }, 500);
  };

  // Handle theme question typing complete
  const handleThemeQuestionComplete = () => {
    setTimeout(() => {
      showThemeSelection = true;
      setTimeout(scrollToBottom, 100);
    }, 300);
  };

  // Scroll to bottom utility
  const scrollToBottom = () => {
    const messagesArea = document.querySelector(".messages-area");
    if (messagesArea) {
      messagesArea.scrollTo({
        top: messagesArea.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // Handle form submission
  const handleFormSubmit = (e: Event) => {
    e.preventDefault();
    formSubmitted = true;

    // Animation sequence after form submission
    setTimeout(() => {
      showUserMessage = true;
      setTimeout(scrollToBottom, 100);

      // Show plan thinking message
      setTimeout(() => {
        showPlanThinking = true;
        showPlanThinkingTyping = true;
        setTimeout(scrollToBottom, 100);

        // Hide typing indicator and show text animation
        setTimeout(() => {
          showPlanThinkingTyping = false;
          showPlanThinkingText = true;
        }, 1500);
      }, 300);
    }, 300);
  };

  // Handle theme selection
  const handleThemeSelect = (themeId: ThemeId) => {
    selectedTheme = themeId;
    showThemeSelection = false;

    // Generate plan message with selected theme
    aiPlanMessage = getAIPlanMessage(themeId);

    // Notify parent component
    onThemeSelected?.(themeId);

    // Show implementation plan directly
    setTimeout(() => {
      showAIPlan = true;
      showPlanTyping = false;
      showPlanText = true;
      setTimeout(scrollToBottom, 100);
    }, 300);
  };

  // Handle plan typing complete - transition to code editor
  const handlePlanTypingComplete = () => {
    // Transition to code editor
    setTimeout(() => {
      onSubmit();
    }, 1500);
  };
</script>

<div
  id="chat-interface"
  class="relative flex min-h-screen {themes[selectedTheme]?.colors
    .chatBackground}"
>
  <!-- スキップボタン（右上固定） -->
  {#if currentSection !== "recap"}
    <button
      onclick={() => onSkip?.()}
      class="fixed top-4 right-4 z-50 rounded-lg bg-white px-4 py-2 shadow-lg transition-transform duration-200 hover:scale-105 focus:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300 text-black font-semibold"
    >
      スキップする →
    </button>
  {/if}

  <!-- メッセージエリア（上部、スクロール可能） -->
  <div class="messages-area">
    <div class="messages-container" role="log">
      <!-- AI挨拶メッセージ -->
      {#if showAIGreeting}
        <div in:fly={{ y: 50, duration: 500 }}>
          <MessageBubble
            type="ai"
            sender="AI Agent"
            message={AI_GREETING_MESSAGE}
            showTypingIndicator={showGreetingTyping}
            isTyping={showGreetingText}
            onTypingComplete={handleGreetingTypingComplete}
          />
        </div>
      {/if}

      <!-- ユーザーメッセージ -->
      {#if showUserMessage}
        <div in:fly={{ y: 50, duration: 500 }}>
          <MessageBubble type="user" sender="You" message={USER_INPUT_TEXT} />
        </div>
      {/if}

      <!-- プラン作成中メッセージ -->
      {#if showPlanThinking}
        <div in:fly={{ y: 50, duration: 500 }}>
          <MessageBubble
            type="ai"
            sender="AI Agent"
            message={PLAN_THINKING_MESSAGE}
            showTypingIndicator={showPlanThinkingTyping}
            isTyping={showPlanThinkingText}
            onTypingComplete={handlePlanThinkingComplete}
          />
        </div>
      {/if}

      <!-- テーマ質問メッセージ -->
      {#if showThemeQuestion}
        <div in:fly={{ y: 50, duration: 500 }}>
          <MessageBubble
            type="ai"
            sender="AI Agent"
            message={THEME_QUESTION_MESSAGE}
            showTypingIndicator={showThemeQuestionTyping}
            isTyping={showThemeQuestionText}
            onTypingComplete={handleThemeQuestionComplete}
          />
        </div>
      {/if}

      <!-- テーマ選択UI -->
      {#if showThemeSelection}
        <div in:fly={{ y: 50, duration: 500 }}>
          <ThemeSelector onSelectTheme={handleThemeSelect} />
        </div>
      {/if}

      <!-- AI実装プランメッセージ -->
      {#if showAIPlan}
        <div in:fly={{ y: 50, duration: 500 }}>
          <MessageBubble
            type="ai"
            sender="AI Agent"
            message={aiPlanMessage}
            showTypingIndicator={showPlanTyping}
            isTyping={showPlanText}
            onTypingComplete={handlePlanTypingComplete}
          />
        </div>
      {/if}
    </div>
  </div>

  <!-- 入力フォームエリア（下部固定） -->
  {#if showInputForm && !formSubmitted && currentSection === "chat"}
    <div
      class="input-form-container"
      style="background: linear-gradient(to top, {selectedTheme === 'orange'
        ? 'rgba(124, 45, 18, 1) 0%, rgba(124, 45, 18, 0.95) 50%'
        : selectedTheme === 'blue'
          ? 'rgba(30, 58, 138, 1) 0%, rgba(30, 58, 138, 0.95) 50%'
          : selectedTheme === 'purple'
            ? 'rgba(88, 28, 135, 1) 0%, rgba(88, 28, 135, 0.95) 50%'
            : selectedTheme === 'green'
              ? 'rgba(20, 83, 45, 1) 0%, rgba(20, 83, 45, 0.95) 50%'
              : ''});'"
      in:fly={{ y: 100, duration: 500 }}
      out:fade={{ duration: 300 }}
    >
      <form onsubmit={handleFormSubmit}>
        <input
          type="text"
          value={USER_INPUT_TEXT}
          aria-label="メッセージ入力"
          class="input-field {themes[selectedTheme]?.colors
            .inputFocusBorder} focus:outline-none focus:shadow-lg {themes[
            selectedTheme
          ]?.colors.inputFocusRing}"
        />
        <button
          type="submit"
          class="submit-button {themes[selectedTheme]?.colors
            .buttonGradient} hover:scale-105 {themes[selectedTheme]?.colors
            .buttonHoverShadow} focus:outline-none {themes[selectedTheme]
            ?.colors.focusRing}"
        >
          ↑
        </button>
      </form>
    </div>
  {/if}
</div>

<style>
  .messages-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: calc(100vh - 120px);
    width: 100%;
    padding: 2rem;
    padding-bottom: 140px;
    overflow-y: auto;
  }

  .messages-container {
    width: 100%;
    max-width: 42rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .input-form-container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    backdrop-filter: blur(8px);
    padding: 1.5rem 2rem 2rem;
    z-index: 10;
  }

  .input-form-container form {
    max-width: 42rem;
    margin: 0 auto;
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  .input-field {
    flex: 1;
    padding: 0.875rem 1.25rem;
    border-radius: 0.75rem;
    background: white;
    border: 2px solid #d1d5db;
    font-size: 0.9375rem;
    color: #1f2937;
    transition: all 0.2s;
  }

  .submit-button {
    padding: 0.875rem 2rem;
    border-radius: 0.75rem;
    color: white;
    background: linear-gradient(
      90deg,
      #ff7e5f,
      #feb47b
    ); /* Default gradient, overridden by theme */
    font-weight: 600;
    white-space: nowrap;
    transition: all 0.2s;
    border: none;
    cursor: pointer;
  }

  @media (max-width: 640px) {
    .messages-area {
      padding: 1rem;
      padding-bottom: 160px;
    }

    .input-form-container {
      padding: 1rem;
    }

    .input-form-container form {
      flex-direction: column;
      gap: 0.5rem;
    }

    .input-field,
    .submit-button {
      width: 100%;
    }
  }
</style>
