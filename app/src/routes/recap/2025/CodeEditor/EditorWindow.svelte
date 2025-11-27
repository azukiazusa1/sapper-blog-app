<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { onMount, onDestroy } from "svelte";
  import { highlightCode, getLanguageForTab } from "./syntaxHighlight";
  import { dataCode, statsCode, tagsCode, postsCode } from "./codeTemplates";
  import BlogStats from "../FinalRecap/BlogStats.svelte";
  import PopularTags from "../FinalRecap/PopularTags.svelte";
  import PopularPosts from "../FinalRecap/PopularPosts.svelte";

  interface Props {
    onComplete: () => void;
  }

  let { onComplete }: Props = $props();

  type Stage = {
    tab: string;
    code: string;
    preview: any;
    terminal: string;
    duration: number;
  };

  const progressMessages = {
    0: [
      // Data2025.ts
      "$ ts-node analyze 2025",
      "→ さっそく2025年のデータを見てみますね",
      "→ おお、78記事も書いてますね！すごい",
      "→ 合計779,239語...これは読み応えありそう",
      "→ トップタグ3件もチェックしておきます",
    ],
    1: [
      // BlogStats.svelte
      "$ svelte compile stats-component",
      "→ 年間成果を表示するコンポーネント作りましょう",
      "→ CountUpアニメーション、これいい感じになりますよ",
      "→ 78記事の数字が動くとカッコよくなります",
      "→ スタイル調整中...もうすぐです",
    ],
    2: [
      // PopularTags.svelte
      "$ svelte compile tags-component",
      "→ タグクラウドを生成してみます",
      "→ AI、MCP、TypeScript...技術記事が多いですね",
      "→ scaleアニメーションでタグを浮かび上がらせます",
      "→ レスポンシブ対応も忘れずに完了",
    ],
    3: [
      // PopularPosts.svelte
      "$ svelte compile posts-component",
      "→ アクセス数でランキングを作っていきます",
      "→ トップ記事は47K閲覧...人気ですね！",
      "→ flyアニメーションで記事が飛び込んでくる感じに",
      "→ ホバーエフェクト追加して完成です",
    ],
  } as const;

  function getProgressMessagesForStage(index: number): readonly string[] {
    return progressMessages[index as keyof typeof progressMessages] || [];
  }

  const stages: Stage[] = [
    {
      tab: "Data2025.ts",
      code: dataCode,
      preview: null,
      terminal: "✓ 2025年ブログデータを解析: 78記事・779,239語を認識",
      duration: 3000,
    },
    {
      tab: "BlogStats.svelte",
      code: statsCode,
      preview: BlogStats,
      terminal:
        "✓ BlogStats コンポーネント最適化: 年間成果(78記事)の可視化完了",
      duration: 3000,
    },
    {
      tab: "PopularTags.svelte",
      code: tagsCode,
      preview: PopularTags,
      terminal:
        "✓ タグクラウド生成: 主要トピック(AI×33, MCP×20, TypeScript×13)を認識",
      duration: 3000,
    },
    {
      tab: "PopularPosts.svelte",
      code: postsCode,
      preview: PopularPosts,
      terminal:
        "✓ トレンド分析完了: アクセス数でランキング集計(47K, 32K, 27K閲覧)",
      duration: 3000,
    },
  ];

  let currentStageIndex = $state(0);
  let currentTab = $state("Data2025.ts");
  let displayedCode = $state("");
  let terminalLines = $state<string[]>([]);
  let previewComponent = $state<any>(null);
  let isBuilding = $state(false);
  let buildComplete = $state(false);
  let isTyping = $state(false);
  let autoAdvanceTimer: ReturnType<typeof setTimeout> | null = $state(null);
  let showBuildPrompt: boolean = $state(false);
  let isAutoAdvancing: boolean = $state(false);
  let terminalElement: HTMLDivElement;

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  function clearAutoAdvanceTimer() {
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      autoAdvanceTimer = null;
      isAutoAdvancing = false;
    }
  }

  async function startAutoAdvanceTimer() {
    // 最後のタブの場合：ビルド促進メッセージを表示
    if (currentStageIndex >= stages.length - 1) {
      isAutoAdvancing = true;
      autoAdvanceTimer = setTimeout(async () => {
        showBuildPrompt = true;
        await addTerminalLine("✓ 全部のコンポーネント準備できました！");
        await addTerminalLine(
          "$ さあ、ビルドボタンを押して完成させましょう 🎉",
        );
        autoAdvanceTimer = null;
        isAutoAdvancing = false;
      }, 1500);
      return;
    }

    // それ以外：次のタブに自動遷移
    isAutoAdvancing = true;
    autoAdvanceTimer = setTimeout(() => {
      autoAdvanceTimer = null;
      isAutoAdvancing = false;
      handleTabClick(currentStageIndex + 1);
    }, 1500);
  }

  async function typeCode(
    code: string,
    stageIndex: number,
    speed: number = 150,
  ) {
    displayedCode = "";
    const delay = 1000 / speed;
    const messages = getProgressMessagesForStage(stageIndex);

    // 0.5秒間隔でメッセージをスケジュール
    messages.forEach((msg, idx) => {
      setTimeout(
        () => {
          terminalLines = [...terminalLines, msg];
        },
        500 * (idx + 1),
      );
    });

    // コードを文字ごとにタイプ
    for (let i = 0; i < code.length; i++) {
      displayedCode = code.substring(0, i + 1);
      await sleep(delay);
    }

    // 最後のメッセージが表示されるまで待機
    if (messages.length > 0) {
      await sleep(500);
    }
  }

  async function addTerminalLine(line: string) {
    terminalLines = [...terminalLines, line];
    await sleep(300);
  }

  const handleTabClick = async (index: number) => {
    if (isTyping) return; // タイピング中は無視

    // 既存の自動遷移タイマーをクリア（手動クリック時）
    clearAutoAdvanceTimer();

    isTyping = true;
    const stage = stages[index];
    currentStageIndex = index;
    currentTab = stage.tab;

    // ビルドプロンプトをリセット
    showBuildPrompt = false;

    // 進捗メッセージ付きでコードをタイプ
    await typeCode(stage.code, index, 150);

    // ハイライトを適用
    const lang = getLanguageForTab(stage.tab);
    highlightedCode = await highlightCode(stage.code, lang);

    // プレビュー表示
    previewComponent = stage.preview;

    // ターミナル出力追加
    if (!terminalLines.includes(stage.terminal)) {
      terminalLines = [...terminalLines, stage.terminal];
    }

    isTyping = false;

    // 次のタブへの自動遷移、またはビルドプロンプトを開始
    await startAutoAdvanceTimer();
  };

  async function runBuildAnimation() {
    isBuilding = true;
    await addTerminalLine("$ npm run build -- analyze-2025-recap");
    await sleep(500);
    await addTerminalLine(
      "✓ 全4ステージを検査中: データ・統計・タグ・トレンド記事の確認...",
    );
    await sleep(800);
    await addTerminalLine(
      "✓ バンドル統合完了 (1.2s) | 最適化レベル: 高 | ファイルサイズ: 最小化",
    );
    await sleep(500);
    await addTerminalLine("✓ ビルド成功! 2025年の成果レポート準備完了 🎉");
    await sleep(1000);

    buildComplete = true;
    await sleep(1000);

    onComplete();
  }

  let highlightedCode = $state("");

  onMount(() => {
    // 最初のタブを自動表示
    handleTabClick(0);
  });

  onDestroy(() => {
    clearAutoAdvanceTimer();
  });

  // 新しい行が追加されたときに自動的に最下部にスクロール
  $effect(() => {
    if (terminalElement && terminalLines.length > 0) {
      terminalElement.scrollTop = terminalElement.scrollHeight;
    }
  });
</script>

<div
  id="code-editor"
  class="flex min-h-screen items-center justify-center bg-linear-to-b from-gray-900 to-gray-800 p-4"
>
  <div class="editor-window w-full max-w-7xl">
    <!-- Window Controls -->
    <div class="window-controls">
      <div class="window-dot bg-red-500"></div>
      <div class="window-dot bg-yellow-500"></div>
      <div class="window-dot bg-green-500"></div>
      <span class="ml-4 text-sm text-gray-400">recap-2025/</span>
    </div>

    <!-- File Tabs -->
    <div class="file-tabs flex overflow-x-auto border-b border-gray-700">
      {#each stages as stage, i}
        <button
          class={`file-tab ${currentTab === stage.tab ? "active" : ""}`}
          onclick={() => handleTabClick(i)}
          disabled={isTyping}
        >
          {stage.tab}
        </button>
      {/each}
      {#if !buildComplete && !isBuilding}
        <button
          class="file-tab build-tab"
          onclick={runBuildAnimation}
          disabled={isTyping}
        >
          ▶ Build
        </button>
      {/if}
    </div>

    <!-- Editor Body -->
    <div class="editor-body grid md:grid-cols-2">
      <!-- Code Pane -->
      <div class="code-pane">
        <div class="code-content">
          {#if isTyping}
            <!-- タイピング中 -->
            <pre>{displayedCode}</pre>
            <span class="typing-cursor">|</span>
          {:else}
            <!-- タイピング完了後 -->
            {@html highlightedCode}
          {/if}
        </div>
      </div>

      <!-- Preview Pane -->
      <div class="preview-pane max-h-[500px]">
        {#if previewComponent}
          {@const Component = previewComponent}
          <div in:fade={{ duration: 300 }}>
            <Component />
          </div>
        {:else if isBuilding}
          <div class="flex h-full items-center justify-center">
            <div class="text-center">
              <div
                class="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"
              ></div>
              <p class="text-lg text-gray-700">Building...</p>
            </div>
          </div>
        {:else}
          <div class="flex h-full items-center justify-center text-gray-400">
            <svg
              class="h-24 w-24"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        {/if}
      </div>
    </div>

    <!-- Terminal -->
    <div class="terminal" bind:this={terminalElement}>
      {#each terminalLines as line}
        <div in:fly={{ x: -20, duration: 200 }} class="terminal-line">
          {#if line.startsWith("$")}
            <span class="terminal-prompt">{line}</span>
          {:else if line.startsWith("✓")}
            <span class="terminal-success">{line}</span>
          {:else}
            {line}
          {/if}
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .editor-window {
    background: #1e1e1e;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    max-height: 90vh;
  }

  .window-controls {
    background: #2d2d30;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .window-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  .file-tabs {
    background: #2d2d30;
  }

  .file-tab {
    background: #2d2d30;
    color: #808080;
    padding: 10px 20px;
    border-right: 1px solid #1e1e1e;
    cursor: pointer;
    transition:
      background-color 0.2s,
      transform 0.1s,
      color 0.2s;
    white-space: nowrap;
    font-size: 13px;
  }

  .file-tab:hover:not(.active) {
    background: #3e3e42;
    transform: translateY(-1px);
  }

  .file-tab:active {
    transform: translateY(0);
  }

  .file-tab.active {
    background: #1e1e1e;
    color: #ffffff;
  }

  .file-tab:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .build-tab {
    background: linear-gradient(to right, #7c3aed, #ec4899);
    color: white;
    font-weight: 600;
  }

  .build-tab:hover:not(:disabled) {
    background: linear-gradient(to right, #6d28d9, #db2777);
    transform: translateY(-1px);
  }

  .build-tab:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .editor-body {
    min-height: 500px;
    max-height: 60vh;
  }

  .code-pane {
    background: #1e1e1e;
    color: #d4d4d4;
    padding: 20px;
    font-family: "Menlo", "Monaco", "Courier New", monospace;
    font-size: 14px;
    line-height: 1.6;
    overflow: auto;
  }

  .code-content {
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .preview-pane {
    background: #ffffff;
    padding: 32px;
    overflow: auto;
    border-left: 2px solid #2d2d30;
  }

  .terminal {
    background: #000000;
    color: #00ff00;
    padding: 16px;
    font-family: "Menlo", "Monaco", "Courier New", monospace;
    font-size: 13px;
    height: 150px;
    overflow-y: scroll;
    border-top: 2px solid #2d2d30;
  }

  .terminal-line {
    margin-bottom: 4px;
  }

  .terminal-prompt {
    color: #ffff00;
  }

  .terminal-success {
    color: #00ff00;
  }

  .typing-cursor {
    animation: blink 1s infinite;
    color: #ffffff;
  }

  @keyframes blink {
    0%,
    50% {
      opacity: 1;
    }
    51%,
    100% {
      opacity: 0;
    }
  }

  /* Shikiのスタイルを調整 */
  .code-content :global(.shiki) {
    background: transparent !important;
    padding: 0;
    margin: 0;
  }

  .code-content :global(pre) {
    background: transparent;
    margin: 0;
    padding: 0;
  }

  .code-content :global(code) {
    background: transparent;
  }
</style>
