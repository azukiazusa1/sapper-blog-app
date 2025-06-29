<script>
  import variables from "$lib/variables";
  import Avatar from "../../components/Avatar/Avatar.svelte";
  import author from "../../assets/images/azukiazusa.jpeg";
  import LinkButton from "../../components/LinkButton/LinkButton.svelte";
  import TwitterIcon from "../../components/Icons/Twitter.svelte";
  import { fly, fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { tick } from "svelte"; // Import tick for handling DOM updates
  import GitHub from "../../components/Icons/GitHub.svelte";

  const content1 =
    "azukiazusaさんは、主にフロントエンド分野に焦点を当てたWeb開発に関する記事を執筆している技術ブロガーです。彼のブログ「azukiazusaのテックブログ2」では、週に1回のペースで最新の技術情報やトレンドを紹介しています。";
  const content2 =
    "登壇活動も積極的に行っており、2024年11月23日のJSConf JP 2024では、ヘッドレスUIライブラリの重要性とデザインシステムへの取り入れ方について講演しています。";
  const content3 =
    "全体的に、azukiazusaさんはWeb開発、特にフロントエンド技術に精通し、ブログ執筆や講演を通じて情報発信を行っているエンジニアであると考えられます。また、趣味は麻雀・ポーカー・読書であると公言しています。";

  // Chat messages
  const messages = [
    {
      type: "question",
      text: "こんにちは！azukiazusa について教えてください。",
    },
    {
      type: "answer",
      text: content1,
    },
    {
      type: "question",
      text: "最近の活動について教えてください。",
    },
    {
      type: "answer",
      text: content2,
    },
    {
      type: "question",
      text: "他に何か知っておくべきことはありますか？",
    },
    {
      type: "answer",
      text: content3,
    },
  ];

  // Add reference to chat container
  let chatContainer;

  // Function to scroll to bottom of chat
  async function scrollToBottom() {
    await tick(); // Wait for DOM update
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  // Simulate typing effect
  let visibleMessages = 0;
  let typingInterval;
  let currentTypingIndex = 0;
  let displayedTexts = messages.map(() => "");
  let typingSpeed = 30; // ms per character

  function startTypingEffect() {
    let messageComplete = false;

    typingInterval = setInterval(() => {
      if (visibleMessages < messages.length) {
        const currentMessage = messages[visibleMessages];
        const fullText = currentMessage.text;

        if (currentTypingIndex < fullText.length) {
          // Add one character at a time
          displayedTexts[visibleMessages] += fullText[currentTypingIndex];
          currentTypingIndex++;
          messageComplete = false;

          // Scroll after each character is added
          scrollToBottom();
        } else {
          // Message is complete, prepare for next message
          messageComplete = true;
        }

        if (messageComplete) {
          // Show next message after a delay
          setTimeout(() => {
            visibleMessages++;
            currentTypingIndex = 0;
            // Scroll when new message appears
            scrollToBottom();
          }, 500);
          clearInterval(typingInterval);

          // Start typing next message if there are more
          if (visibleMessages < messages.length) {
            setTimeout(startTypingEffect, 800);
          }
        }
      }
    }, typingSpeed);
  }

  let visible = false;

  onMount(() => {
    visible = true;
    setTimeout(() => {
      startTypingEffect();
    }, 1000);
  });

  // Watch for changes in messages length and scroll to bottom
  $: {
    if (visibleMessages) {
      scrollToBottom();
    }
  }

  // For meta tag
  const content = content1 + content2 + content3;
</script>

<svelte:head>
  <title>About</title>
  <meta name="description" {content} />
  <link rel="canonical" href={`${variables.baseURL}/about`} />
</svelte:head>

<section
  class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900"
>
  <div class="container mx-auto px-4 lg:px-8 max-w-6xl">
    {#if visible}
      <!-- Hero Section -->
      <div
        class="pt-16 pb-8 text-center"
        in:fade={{ delay: 100, duration: 1000 }}
      >
        <h1
          class="text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight"
          in:fly={{ y: -30, duration: 1000, delay: 200 }}
        >
          About Me
        </h1>
        <p
          class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          in:fly={{ y: 20, duration: 800, delay: 400 }}
        >
          フロントエンドエンジニア・技術ブロガー・登壇者
        </p>
      </div>

      <!-- Main Content Grid -->
      <div
        class="grid lg:grid-cols-12 gap-8 lg:gap-12"
        in:fade={{ delay: 600, duration: 1000 }}
      >
        <!-- Profile Card -->
        <div class="lg:col-span-4">
          <div
            class="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-slate-700/50 sticky top-8"
          >
            <!-- Profile Image with Floating Animation -->
            <div class="relative mb-8">
              <div
                class="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 blur-xl animate-pulse"
              ></div>
              <div class="relative mx-auto w-32 h-32 lg:w-40 lg:h-40">
                <div
                  class="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-spin"
                  style="animation-duration: 8s;"
                ></div>
                <div
                  class="absolute inset-1 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center"
                >
                  <img
                    src={author}
                    alt="azukiazusa1"
                    class="w-28 h-28 lg:w-36 lg:h-36 rounded-full object-cover"
                  />
                </div>
              </div>
            </div>

            <!-- Name and Title -->
            <div class="text-center mb-8">
              <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                azukiazusa1
              </h2>
              <div
                class="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4"
              ></div>
              <p class="text-gray-600 dark:text-gray-300 font-medium">
                Frontend Engineer
              </p>
            </div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-2 gap-4 mb-8">
              <div
                class="bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-400/20 dark:to-purple-400/20 rounded-2xl p-4 text-center border border-blue-200/50 dark:border-blue-400/30"
              >
                <div
                  class="text-2xl font-bold text-blue-600 dark:text-blue-400"
                >
                  週1回
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-300">
                  ブログ更新
                </div>
              </div>
              <div
                class="bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-400/20 dark:to-pink-400/20 rounded-2xl p-4 text-center border border-purple-200/50 dark:border-purple-400/30"
              >
                <div
                  class="text-2xl font-bold text-purple-600 dark:text-purple-400"
                >
                  登壇
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-300">
                  積極的
                </div>
              </div>
            </div>

            <!-- Social Links -->
            <div class="flex justify-center space-x-4">
              <a
                href="https://x.com/azukiazusa9"
                target="_blank"
                rel="noreferrer noopener"
                class="group p-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                aria-label="X"
              >
                <TwitterIcon
                  className="h-6 w-6 text-white group-hover:scale-110 transition-transform"
                />
              </a>
              <a
                href="https://github.com/azukiazusa1"
                target="_blank"
                rel="noreferrer noopener"
                class="group p-3 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                aria-label="GitHub"
              >
                <GitHub
                  className="h-6 w-6 text-white group-hover:scale-110 transition-transform"
                />
              </a>
            </div>
          </div>
        </div>

        <!-- Content Section -->
        <div class="lg:col-span-8">
          <div class="space-y-8">
            <!-- Interactive Chat Interface -->
            <div
              class="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden"
            >
              <div class="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                <h3 class="text-2xl font-bold text-white mb-2">
                  💬 Chat with azukiazusa
                </h3>
                <p class="text-blue-100">私について質問してみてください</p>
              </div>
              <div
                class="p-6 h-[500px] overflow-y-auto chat-container"
                bind:this={chatContainer}
              >
                <div class="space-y-6">
                  {#each messages.slice(0, visibleMessages + 1) as message, i}
                    {#if i < visibleMessages}
                      <!-- Fully displayed message -->
                      {#if message.type === "question"}
                        <div
                          class="flex justify-end"
                          in:fly={{ y: 20, duration: 400 }}
                        >
                          <div class="max-w-[80%]">
                            <div
                              class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-2xl rounded-tr-md shadow-lg"
                            >
                              {message.text}
                            </div>
                            <div
                              class="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right font-medium"
                            >
                              あなた
                            </div>
                          </div>
                        </div>
                      {:else}
                        <div
                          class="flex items-start space-x-3"
                          in:fly={{ y: 20, duration: 400 }}
                        >
                          <div
                            class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-blue-200 dark:ring-blue-800"
                          >
                            <img
                              src={author}
                              alt="azukiazusa1"
                              class="w-full h-full object-cover"
                            />
                          </div>
                          <div class="max-w-[80%]">
                            <div
                              class="bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100 p-4 rounded-2xl rounded-tl-md shadow-lg"
                            >
                              {message.text}
                            </div>
                            <div
                              class="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium"
                            >
                              azukiazusa1
                            </div>
                          </div>
                        </div>
                      {/if}
                    {:else if i === visibleMessages}
                      <!-- Currently typing message -->
                      {#if message.type === "question"}
                        <div
                          class="flex justify-end"
                          in:fly={{ y: 20, duration: 400 }}
                        >
                          <div class="max-w-[80%]">
                            <div
                              class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-2xl rounded-tr-md shadow-lg"
                            >
                              {displayedTexts[i]}
                              {#if displayedTexts[i].length === message.text.length}
                                <span class="typing-cursor"></span>
                              {/if}
                            </div>
                            <div
                              class="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right font-medium"
                            >
                              あなた
                            </div>
                          </div>
                        </div>
                      {:else}
                        <div
                          class="flex items-start space-x-3"
                          in:fly={{ y: 20, duration: 400 }}
                        >
                          <div
                            class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-blue-200 dark:ring-blue-800"
                          >
                            <img
                              src={author}
                              alt="azukiazusa1"
                              class="w-full h-full object-cover"
                            />
                          </div>
                          <div class="max-w-[80%]">
                            <div
                              class="bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100 p-4 rounded-2xl rounded-tl-md shadow-lg"
                            >
                              {displayedTexts[i]}
                              {#if displayedTexts[i].length < message.text.length}
                                <span class="typing-cursor bg-blue-500"></span>
                              {/if}
                            </div>
                            <div
                              class="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium"
                            >
                              azukiazusa1
                            </div>
                          </div>
                        </div>
                      {/if}
                    {/if}
                  {/each}

                  {#if visibleMessages < messages.length && displayedTexts[visibleMessages]?.length === messages[visibleMessages]?.text.length}
                    <div class="flex items-center space-x-3 pl-12">
                      <div
                        class="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style="animation-delay: 0ms"
                      ></div>
                      <div
                        class="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                        style="animation-delay: 150ms"
                      ></div>
                      <div
                        class="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                        style="animation-delay: 300ms"
                      ></div>
                      <span
                        class="text-sm text-gray-500 dark:text-gray-400 ml-2"
                        >入力中...</span
                      >
                    </div>
                  {/if}
                </div>
              </div>
            </div>

            <!-- Feature Cards -->
            <div class="grid md:grid-cols-2 gap-6">
              <!-- Skills Card -->
              <div
                class="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-slate-700/50"
              >
                <div class="flex items-center mb-6">
                  <div
                    class="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl"
                  >
                    <svg
                      class="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      ></path>
                    </svg>
                  </div>
                  <h3
                    class="text-xl font-bold text-gray-900 dark:text-white ml-4"
                  >
                    技術スキル
                  </h3>
                </div>
                <div class="space-y-3">
                  <div
                    class="flex items-center text-gray-700 dark:text-gray-300"
                  >
                    <div class="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    フロントエンド開発
                  </div>
                  <div
                    class="flex items-center text-gray-700 dark:text-gray-300"
                  >
                    <div class="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    最新技術トレンド
                  </div>
                  <div
                    class="flex items-center text-gray-700 dark:text-gray-300"
                  >
                    <div class="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    ヘッドレスUI
                  </div>
                </div>
              </div>

              <!-- Hobbies Card -->
              <div
                class="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-slate-700/50"
              >
                <div class="flex items-center mb-6">
                  <div
                    class="p-3 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl"
                  >
                    <svg
                      class="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      ></path>
                    </svg>
                  </div>
                  <h3
                    class="text-xl font-bold text-gray-900 dark:text-white ml-4"
                  >
                    趣味
                  </h3>
                </div>
                <div class="space-y-3">
                  <div
                    class="flex items-center text-gray-700 dark:text-gray-300"
                  >
                    <div class="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    麻雀
                  </div>
                  <div
                    class="flex items-center text-gray-700 dark:text-gray-300"
                  >
                    <div class="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    ポーカー
                  </div>
                  <div
                    class="flex items-center text-gray-700 dark:text-gray-300"
                  >
                    <div class="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                    読書
                  </div>
                </div>
              </div>
            </div>

            <!-- Call to Action -->
            <div
              class="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl"
            >
              <div class="text-center">
                <h3 class="text-2xl font-bold mb-4">
                  もっと詳しく知りたい方へ
                </h3>
                <p class="text-blue-100 mb-8">
                  技術ブログで最新の記事をチェックしてみてください
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                  <LinkButton
                    variant="secondary"
                    href="/blog"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    📚 ブログを読む
                  </LinkButton>
                  <LinkButton
                    variant="secondary"
                    href="/talks"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    🎤 登壇資料を見る
                  </LinkButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</section>

<style>
  /* Custom gradient animations */
  @keyframes gradient-x {
    0%,
    100% {
      transform: translateX(-100%);
    }
    50% {
      transform: translateX(100%);
    }
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }

  @keyframes pulse-glow {
    0%,
    100% {
      box-shadow: 0 0 20px rgba(79, 70, 229, 0.3);
    }
    50% {
      box-shadow: 0 0 40px rgba(79, 70, 229, 0.6);
    }
  }

  /* Smooth scrollbar styling */
  .chat-container {
    scrollbar-width: thin;
    scrollbar-color: rgba(99, 102, 241, 0.3) transparent;
  }

  .chat-container::-webkit-scrollbar {
    width: 6px;
  }

  .chat-container::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 10px;
  }

  .chat-container::-webkit-scrollbar-thumb {
    background: linear-gradient(
      to bottom,
      rgba(99, 102, 241, 0.3),
      rgba(139, 92, 246, 0.3)
    );
    border-radius: 10px;
    transition: all 0.3s ease;
  }

  .chat-container::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(
      to bottom,
      rgba(99, 102, 241, 0.5),
      rgba(139, 92, 246, 0.5)
    );
  }

  /* Enhanced typing cursor */
  .typing-cursor {
    display: inline-block;
    width: 2px;
    height: 1.2em;
    background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
    margin-left: 3px;
    vertical-align: text-bottom;
    border-radius: 1px;
    animation: cursor-blink 1.2s infinite;
  }

  @keyframes cursor-blink {
    0%,
    50% {
      opacity: 1;
    }
    51%,
    100% {
      opacity: 0;
    }
  }

  /* Backdrop blur support */
  @supports (backdrop-filter: blur(10px)) {
    .backdrop-blur-xl {
      backdrop-filter: blur(16px);
    }
  }

  /* Smooth animations */
  * {
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }

  /* Hover effects */
  .hover\:scale-105:hover {
    transform: scale(1.05);
  }

  .group:hover .group-hover\:scale-110 {
    transform: scale(1.1);
  }
</style>
