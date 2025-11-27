<script lang="ts">
  import { themes, type ThemeId } from "../themes";

  interface Props {
    onSelectTheme: (theme: ThemeId) => void;
  }

  let { onSelectTheme }: Props = $props();

  const themeOrder: ThemeId[] = ["orange", "blue", "purple", "green", "pink"];

  // Color indicators for each theme (visual preview)
  const themeIndicators: Record<ThemeId, string> = {
    orange: "bg-gradient-to-r from-orange-500 to-red-500",
    blue: "bg-gradient-to-r from-blue-500 to-cyan-500",
    purple: "bg-gradient-to-r from-purple-500 to-pink-500",
    green: "bg-gradient-to-r from-green-500 to-emerald-500",
    pink: "bg-gradient-to-r from-pink-500 to-rose-500",
  };

  const handleKeydown = (event: KeyboardEvent, themeId: ThemeId) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelectTheme(themeId);
    }
  };
</script>

<div class="theme-selector-container">
  <p class="theme-selector-prompt">お好みのカラーテーマを選んでください：</p>

  <div class="theme-selector-grid">
    {#each themeOrder as themeId}
      {@const theme = themes[themeId]}
      <button
        type="button"
        class="theme-button"
        onclick={() => onSelectTheme(themeId)}
        onkeydown={(e) => handleKeydown(e, themeId)}
        aria-label={`${theme.name}テーマを選択`}
      >
        <!-- Color indicator -->
        <div class="theme-indicator {themeIndicators[themeId]}"></div>

        <!-- Theme name -->
        <span class="theme-name">{theme.name}</span>

        <span class="theme-description">{theme.description}</span>
      </button>
    {/each}
  </div>
</div>

<style>
  .theme-selector-container {
    padding: 1.5rem;
    background: white;
    border-radius: 1rem;
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  .theme-selector-prompt {
    margin-bottom: 1.25rem;
    text-align: center;
    font-size: 1rem;
    font-weight: 500;
    color: #374151; /* gray-700 */
  }

  .theme-selector-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  @media (min-width: 640px) {
    .theme-selector-grid {
      grid-template-columns: repeat(5, 1fr);
    }
  }

  .theme-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 0.75rem;
    background: white;
    border: 2px solid #e5e7eb; /* gray-200 */
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .theme-button:hover {
    transform: scale(1.05);
    border-color: #d1d5db; /* gray-300 */
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  .theme-button:focus {
    outline: none;
    border-color: #9ca3af; /* gray-400 */
    box-shadow: 0 0 0 3px rgba(156, 163, 175, 0.2);
  }

  .theme-button:active {
    transform: scale(0.98);
  }

  .theme-indicator {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  .theme-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1f2937; /* gray-800 */
    text-align: center;
  }

  .theme-description {
    font-size: 0.75rem;
    color: #6b7280; /* gray-500 */
    text-align: center;
  }
</style>
