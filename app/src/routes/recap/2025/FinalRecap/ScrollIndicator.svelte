<script lang="ts">
  import { fade } from "svelte/transition";
  import AllowDown from "../../../../components/Icons/AllowDown.svelte";
  import { themes, defaultTheme, type ThemeId } from "../themes";

  interface Props {
    theme?: ThemeId;
  }

  let { theme = defaultTheme }: Props = $props();

  const handleClick = () => {
    const element = document.getElementById("blog-stats");
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };
</script>

<div
  class="scroll-indicator {themes[theme].colors.focusRing}"
  role="button"
  aria-label="今年書いた記事セクションにスクロール"
  tabindex="0"
  onclick={handleClick}
  onkeydown={handleKeydown}
  in:fade={{ delay: 1000, duration: 500 }}
>
  <div class="arrow-container">
    <div class="arrow-icon">
      <AllowDown />
    </div>
    <p class="scroll-text">スクロールして続きを見る</p>
  </div>
</div>

<style>
  .scroll-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    margin-top: 3rem;
    margin-bottom: 1rem;
    cursor: pointer;
    transition: opacity 0.3s;
  }

  .scroll-indicator:hover {
    opacity: 0.8;
  }

  /* Focus outline handled inline with data attribute */

  .arrow-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    animation: bounce 2s infinite;
    will-change: transform;
  }

  .arrow-icon {
    width: 32px;
    height: 32px;
    color: #6b7280;
  }

  .scroll-text {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
    margin: 0;
    white-space: nowrap;
  }

  @keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }

  @media (max-width: 640px) {
    .scroll-indicator {
      margin-top: 2rem;
    }

    .arrow-icon {
      width: 28px;
      height: 28px;
    }

    .scroll-text {
      font-size: 0.75rem;
    }
  }
</style>
