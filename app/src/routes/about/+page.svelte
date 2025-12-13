<script>
  import variables from "$lib/variables";
  import author from "../../assets/images/azukiazusa.jpeg";
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
  let chatContainer = $state();

  // Function to scroll to bottom of chat
  async function scrollToBottom() {
    await tick(); // Wait for DOM update
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  // Simulate typing effect
  let visibleMessages = $state(0);
  let typingInterval = $state();
  let currentTypingIndex = $state(0);
  let displayedTexts = $state(messages.map(() => ""));
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

  let visible = $state(false);

  onMount(() => {
    visible = true;
    setTimeout(() => {
      startTypingEffect();
    }, 1000);
  });

  // Watch for changes in messages length and scroll to bottom
  $effect(() => {
    if (visibleMessages) {
      scrollToBottom();
    }
  });

  // For meta tag
  const content = content1 + content2 + content3;
</script>

<svelte:head>
  <title>About</title>
  <meta name="description" {content} />
  <link rel="canonical" href={`${variables.baseURL}/about`} />
</svelte:head>

<section
  class="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 dark:bg-gradient-to-br dark:from-black dark:to-black relative overflow-hidden"
>
  <!-- Cyberpunk Grid Background -->
  <div class="absolute inset-0 opacity-20 dark:opacity-20 opacity-10">
    <div
      class="absolute inset-0"
      style="background-image: linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px); background-size: 50px 50px;"
    ></div>
  </div>

  <!-- Neon Glow Effects -->
  <div
    class="absolute top-0 left-1/4 w-96 h-96 bg-cyan-300/30 dark:bg-cyan-500/20 rounded-full filter blur-3xl animate-pulse"
  ></div>
  <div
    class="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-300/30 dark:bg-pink-500/20 rounded-full filter blur-3xl animate-pulse"
    style="animation-delay: 1s;"
  ></div>
  <div
    class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-300/30 dark:bg-purple-500/20 rounded-full filter blur-3xl animate-pulse"
    style="animation-delay: 2s;"
  ></div>
  <div class="container mx-auto px-4 lg:px-8 max-w-6xl relative z-10">
    {#if visible}
      <!-- Cyberpunk Hero Section -->
      <div
        class="pt-16 pb-8 text-center relative z-10"
        in:fade={{ delay: 100, duration: 1000 }}
      >
        <div class="relative inline-block">
          <h1
            class="text-6xl lg:text-8xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 bg-clip-text text-transparent leading-tight font-mono tracking-wider"
            in:fly={{ y: -30, duration: 1000, delay: 200 }}
            style="text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);"
          >
            ABOUT.APP
          </h1>
          <div
            class="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 to-pink-500/20 blur-xl -z-10"
          ></div>
        </div>
        <div
          class="border border-cyan-600/50 dark:border-cyan-500/30 bg-white/95 dark:bg-black/80 backdrop-blur-sm rounded-lg p-4 max-w-2xl mx-auto mb-8"
          in:fly={{ y: 20, duration: 800, delay: 400 }}
        >
          <p class="text-lg text-cyan-800 dark:text-cyan-300 font-mono">
            > SYSTEM_USER: <span
              class="text-pink-700 dark:text-pink-400 animate-pulse"
              >azukiazusa1</span
            ><br />
            > STATUS:
            <span class="text-green-700 dark:text-green-400">ONLINE</span><br />
            > ROLE:
            <span class="text-yellow-700 dark:text-yellow-400"
              >FRONTEND_ENGINEER | TECH_BLOGGER | SPEAKER</span
            >
          </p>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div
        class="grid lg:grid-cols-12 gap-8 lg:gap-12"
        in:fade={{ delay: 600, duration: 1000 }}
      >
        <!-- Cyberpunk Profile Terminal -->
        <div class="lg:col-span-4">
          <div
            class="bg-white/95 dark:bg-black/90 backdrop-blur-xl rounded-lg p-8 shadow-2xl border border-cyan-600/60 dark:border-cyan-500/50 sticky top-8 relative overflow-hidden"
          >
            <!-- Terminal Header -->
            <div
              class="flex items-center mb-6 border-b border-cyan-500/30 pb-4"
            >
              <div class="flex space-x-2">
                <div
                  class="w-3 h-3 rounded-full bg-red-500 animate-pulse"
                ></div>
                <div
                  class="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"
                  style="animation-delay: 0.5s;"
                ></div>
                <div
                  class="w-3 h-3 rounded-full bg-green-500 animate-pulse"
                  style="animation-delay: 1s;"
                ></div>
              </div>
              <span
                class="ml-4 text-cyan-800 dark:text-cyan-400 font-mono text-sm"
                >user@terminal:~$</span
              >
            </div>
            <!-- Holographic Profile Image -->
            <div class="relative mb-8">
              <div
                class="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-400/20 to-pink-500/20 blur-xl animate-pulse"
              ></div>
              <div
                class="relative mx-auto w-32 h-32 lg:w-40 lg:h-40 border-2 border-cyan-500/50 rounded-lg overflow-hidden"
              >
                <!-- Scanning Lines -->
                <div
                  class="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent h-8 animate-scan"
                ></div>
                <div
                  class="absolute inset-0 border border-pink-500/30 rounded-lg animate-pulse"
                ></div>
                <img
                  src={author}
                  alt="azukiazusa1"
                  class="w-full h-full object-cover filter brightness-110 contrast-125"
                  style="filter: brightness(1.1) contrast(1.25) hue-rotate(180deg)"
                />
                <!-- Hologram effect overlay -->
                <div
                  class="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-pink-500/10 mix-blend-screen"
                ></div>
              </div>
              <!-- Corner brackets -->
              <div
                class="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-cyan-400"
              ></div>
              <div
                class="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-cyan-400"
              ></div>
              <div
                class="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-cyan-400"
              ></div>
              <div
                class="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-cyan-400"
              ></div>
            </div>

            <!-- Terminal User Info -->
            <div class="text-center mb-8">
              <div class="font-mono text-cyan-800 dark:text-cyan-400 mb-4">
                <div class="text-sm opacity-60">$ whoami</div>
                <div
                  class="text-2xl font-bold text-pink-700 dark:text-pink-400 tracking-wider glitch-text"
                >
                  azukiazusa1
                </div>
              </div>
              <div
                class="w-full h-px bg-gradient-to-r from-transparent via-cyan-600 dark:via-cyan-500 to-transparent mb-4"
              ></div>
              <div class="font-mono text-green-700 dark:text-green-400">
                <div class="text-sm opacity-60">$ cat role.txt</div>
                <div class="text-lg">Frontend_Engineer.app</div>
              </div>
            </div>

            <!-- System Stats -->
            <div class="grid grid-cols-2 gap-4 mb-8">
              <div
                class="bg-white/80 dark:bg-black/50 border border-cyan-600/50 dark:border-cyan-500/30 rounded-lg p-4 text-center relative overflow-hidden"
              >
                <div
                  class="absolute inset-0 bg-gradient-to-r from-cyan-600/20 dark:from-cyan-500/10 to-transparent"
                ></div>
                <div class="relative z-10">
                  <div
                    class="text-2xl font-bold text-cyan-800 dark:text-cyan-400 font-mono"
                  >
                    WEEKLY
                  </div>
                  <div
                    class="text-xs text-cyan-700/80 dark:text-cyan-300/70 font-mono"
                  >
                    BLOG_UPDATE
                  </div>
                </div>
              </div>
              <div
                class="bg-white/80 dark:bg-black/50 border border-pink-600/50 dark:border-pink-500/30 rounded-lg p-4 text-center relative overflow-hidden"
              >
                <div
                  class="absolute inset-0 bg-gradient-to-r from-pink-600/20 dark:from-pink-500/10 to-transparent"
                ></div>
                <div class="relative z-10">
                  <div
                    class="text-2xl font-bold text-pink-800 dark:text-pink-400 font-mono"
                  >
                    ACTIVE
                  </div>
                  <div
                    class="text-xs text-pink-700/80 dark:text-pink-300/70 font-mono"
                  >
                    SPEAKER_MODE
                  </div>
                </div>
              </div>
            </div>

            <!-- Network Connections -->
            <div class="font-mono text-sm mb-6">
              <div class="text-yellow-700 dark:text-yellow-400 mb-2">
                $ netstat -connections
              </div>
              <div class="space-y-1 text-xs">
                <div class="text-cyan-700 dark:text-cyan-300">
                  tcp://x.com <span class="text-green-700 dark:text-green-400"
                    >[CONNECTED]</span
                  >
                </div>
                <div class="text-cyan-700 dark:text-cyan-300">
                  tcp://github.com <span
                    class="text-green-700 dark:text-green-400">[CONNECTED]</span
                  >
                </div>
              </div>
            </div>

            <div class="flex justify-center space-x-4">
              <a
                href="https://x.com/azukiazusa9"
                target="_blank"
                rel="noreferrer noopener"
                class="group relative p-3 bg-white dark:bg-black border border-cyan-600/60 dark:border-cyan-500/50 hover:border-cyan-700 dark:hover:border-cyan-400 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-cyan-500/25 hover:shadow-lg"
                aria-label="X"
              >
                <TwitterIcon
                  className="h-6 w-6 text-cyan-800 dark:text-cyan-400 group-hover:text-cyan-900 dark:group-hover:text-cyan-300 transition-colors"
                />
                <div
                  class="absolute inset-0 bg-cyan-600/20 dark:bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                ></div>
              </a>
              <a
                href="https://github.com/azukiazusa1"
                target="_blank"
                rel="noreferrer noopener"
                class="group relative p-3 bg-white dark:bg-black border border-pink-600/60 dark:border-pink-500/50 hover:border-pink-700 dark:hover:border-pink-400 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-pink-500/25 hover:shadow-lg"
                aria-label="GitHub"
              >
                <GitHub
                  className="h-6 w-6 text-pink-800 dark:text-pink-400 group-hover:text-pink-900 dark:group-hover:text-pink-300 transition-colors"
                />
                <div
                  class="absolute inset-0 bg-pink-600/20 dark:bg-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                ></div>
              </a>
            </div>
          </div>
        </div>

        <!-- Neural Interface Section -->
        <div class="lg:col-span-8">
          <div class="space-y-8 relative z-10">
            <!-- Neural Chat Interface -->
            <div
              class="bg-white/95 dark:bg-black/90 backdrop-blur-xl rounded-lg shadow-2xl border border-purple-600/60 dark:border-purple-500/50 overflow-hidden relative"
            >
              <!-- Matrix-style header -->
              <div
                class="bg-gradient-to-r from-purple-200/80 dark:from-purple-900/80 to-pink-200/80 dark:to-pink-900/80 p-6 relative overflow-hidden"
              >
                <div class="absolute inset-0 opacity-20">
                  <div class="matrix-rain"></div>
                </div>
                <div class="relative z-10">
                  <h3
                    class="text-2xl font-bold text-cyan-800 dark:text-cyan-400 mb-2 font-mono"
                  >
                    ⚡ NEURAL_INTERFACE.APP
                  </h3>
                  <p
                    class="text-purple-800 dark:text-purple-300 font-mono text-sm"
                  >
                    // Initialize quantum communication protocol
                  </p>
                  <div class="flex items-center mt-2">
                    <div
                      class="w-2 h-2 bg-green-600 dark:bg-green-500 rounded-full animate-pulse mr-2"
                    ></div>
                    <span
                      class="text-green-800 dark:text-green-400 text-xs font-mono"
                      >CONNECTION_ESTABLISHED</span
                    >
                  </div>
                </div>
              </div>
              <div
                class="p-6 h-[500px] overflow-y-auto chat-container relative"
                bind:this={chatContainer}
              >
                <!-- Scanlines effect -->
                <div class="absolute inset-0 pointer-events-none">
                  <div class="scanlines"></div>
                </div>
                <div class="space-y-6 relative z-10">
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
                              class="bg-gradient-to-r from-cyan-200/40 dark:from-cyan-500/20 to-blue-200/40 dark:to-blue-500/20 border border-cyan-600/60 dark:border-cyan-500/50 text-cyan-900 dark:text-cyan-100 p-4 rounded-lg backdrop-blur-sm font-mono text-sm relative"
                            >
                              <div
                                class="absolute top-2 right-2 w-2 h-2 bg-cyan-600 dark:bg-cyan-400 rounded-full animate-pulse"
                              ></div>
                              {message.text}
                            </div>
                            <div
                              class="text-xs text-cyan-700/80 dark:text-cyan-400/70 mt-2 text-right font-mono"
                            >
                              USER://
                            </div>
                          </div>
                        </div>
                      {:else}
                        <div
                          class="flex items-start space-x-3"
                          in:fly={{ y: 20, duration: 400 }}
                        >
                          <div
                            class="w-10 h-10 border border-pink-500/50 overflow-hidden flex-shrink-0 bg-black relative"
                          >
                            <img
                              src={author}
                              alt="azukiazusa1"
                              class="w-full h-full object-cover filter brightness-110 contrast-125"
                              style="filter: brightness(1.1) contrast(1.25) hue-rotate(180deg)"
                            />
                            <div
                              class="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 mix-blend-screen"
                            ></div>
                          </div>
                          <div class="max-w-[80%]">
                            <div
                              class="bg-gradient-to-r from-purple-200/40 dark:from-purple-500/20 to-pink-200/40 dark:to-pink-500/20 border border-purple-600/60 dark:border-purple-500/50 text-purple-900 dark:text-purple-100 p-4 rounded-lg backdrop-blur-sm font-mono text-sm relative"
                            >
                              <div
                                class="absolute top-2 right-2 w-2 h-2 bg-pink-600 dark:bg-pink-400 rounded-full animate-pulse"
                              ></div>
                              {message.text}
                            </div>
                            <div
                              class="text-xs text-pink-700/80 dark:text-pink-400/70 mt-2 font-mono"
                            >
                              AI://azukiazusa1
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
                              class="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 text-cyan-900 dark:text-cyan-100 p-4 rounded-lg backdrop-blur-sm font-mono text-sm relative"
                            >
                              <div
                                class="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"
                              ></div>
                              {displayedTexts[i]}
                              {#if displayedTexts[i].length === message.text.length}
                                <span class="cyber-cursor"></span>
                              {/if}
                            </div>
                            <div
                              class="text-xs text-cyan-700/70 dark:text-cyan-400/70 mt-2 text-right font-mono"
                            >
                              USER://
                            </div>
                          </div>
                        </div>
                      {:else}
                        <div
                          class="flex items-start space-x-3"
                          in:fly={{ y: 20, duration: 400 }}
                        >
                          <div
                            class="w-10 h-10 border border-pink-500/50 overflow-hidden flex-shrink-0 bg-black relative"
                          >
                            <img
                              src={author}
                              alt="azukiazusa1"
                              class="w-full h-full object-cover filter brightness-110 contrast-125"
                              style="filter: brightness(1.1) contrast(1.25) hue-rotate(180deg)"
                            />
                            <div
                              class="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 mix-blend-screen"
                            ></div>
                          </div>
                          <div class="max-w-[80%]">
                            <div
                              class="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 text-purple-900 dark:text-purple-100 p-4 rounded-lg backdrop-blur-sm font-mono text-sm relative"
                            >
                              <div
                                class="absolute top-2 right-2 w-2 h-2 bg-pink-400 rounded-full animate-pulse"
                              ></div>
                              {displayedTexts[i]}
                              {#if displayedTexts[i].length < message.text.length}
                                <span class="cyber-cursor"></span>
                              {/if}
                            </div>
                            <div
                              class="text-xs text-pink-700/70 dark:text-pink-400/70 mt-2 font-mono"
                            >
                              AI://azukiazusa1
                            </div>
                          </div>
                        </div>
                      {/if}
                    {/if}
                  {/each}

                  {#if visibleMessages < messages.length && displayedTexts[visibleMessages]?.length === messages[visibleMessages]?.text.length}
                    <div class="flex items-center space-x-3 pl-12">
                      <div
                        class="w-1 h-4 bg-cyan-500 animate-pulse"
                        style="animation-delay: 0ms"
                      ></div>
                      <div
                        class="w-1 h-4 bg-pink-500 animate-pulse"
                        style="animation-delay: 200ms"
                      ></div>
                      <div
                        class="w-1 h-4 bg-purple-500 animate-pulse"
                        style="animation-delay: 400ms"
                      ></div>
                      <span
                        class="text-sm text-cyan-700/80 dark:text-cyan-400/70 ml-4 font-mono"
                        >PROCESSING_DATA...</span
                      >
                    </div>
                  {/if}
                </div>
              </div>
            </div>

            <!-- Data Modules -->
            <div class="grid md:grid-cols-2 gap-6">
              <!-- Skills Module -->
              <div
                class="bg-white/95 dark:bg-black/90 backdrop-blur-xl rounded-lg p-8 shadow-2xl border border-cyan-600/60 dark:border-cyan-500/50 relative overflow-hidden"
              >
                <div
                  class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-cyan-500/20 to-transparent"
                ></div>
                <div class="flex items-center mb-6">
                  <div
                    class="p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 rounded-lg"
                  >
                    <svg
                      class="w-6 h-6 text-cyan-400"
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
                    class="text-xl font-bold text-cyan-800 dark:text-cyan-400 ml-4 font-mono"
                  >
                    TECH_SKILLS.JSON
                  </h3>
                </div>
                <div class="space-y-3 font-mono text-sm">
                  <div
                    class="flex items-center text-cyan-700 dark:text-cyan-300 hover:text-cyan-900 dark:hover:text-cyan-100 transition-colors cursor-pointer"
                  >
                    <span class="text-pink-700 dark:text-pink-400 mr-2">></span>
                    <span class="text-yellow-700 dark:text-yellow-400"
                      >"frontend":</span
                    >
                    <span class="text-green-700 dark:text-green-400"
                      >"expert"</span
                    >
                  </div>
                  <div
                    class="flex items-center text-cyan-700 dark:text-cyan-300 hover:text-cyan-900 dark:hover:text-cyan-100 transition-colors cursor-pointer"
                  >
                    <span class="text-pink-700 dark:text-pink-400 mr-2">></span>
                    <span class="text-yellow-700 dark:text-yellow-400"
                      >"ai_engineering":</span
                    >
                    <span class="text-green-700 dark:text-green-400"
                      >"cutting_edge"</span
                    >
                  </div>
                  <div
                    class="flex items-center text-cyan-700 dark:text-cyan-300 hover:text-cyan-900 dark:hover:text-cyan-100 transition-colors cursor-pointer"
                  >
                    <span class="text-pink-700 dark:text-pink-400 mr-2">></span>
                    <span class="text-yellow-700 dark:text-yellow-400"
                      >"blogging":</span
                    >
                    <span class="text-green-700 dark:text-green-400"
                      >"active"</span
                    >
                  </div>
                </div>
              </div>

              <!-- Personal Module -->
              <div
                class="bg-white/95 dark:bg-black/90 backdrop-blur-xl rounded-lg p-8 shadow-2xl border border-pink-600/60 dark:border-pink-500/50 relative overflow-hidden"
              >
                <div
                  class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-pink-500/20 to-transparent"
                ></div>
                <div class="flex items-center mb-6">
                  <div
                    class="p-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/50 rounded-lg"
                  >
                    <svg
                      class="w-6 h-6 text-pink-400"
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
                    class="text-xl font-bold text-pink-800 dark:text-pink-400 ml-4 font-mono"
                  >
                    PERSONAL.CFG
                  </h3>
                </div>
                <div class="space-y-3 font-mono text-sm">
                  <div
                    class="flex items-center text-pink-700 dark:text-pink-300 hover:text-pink-900 dark:hover:text-pink-100 transition-colors cursor-pointer"
                  >
                    <span class="text-cyan-800 dark:text-cyan-400 mr-2">$</span>
                    <span class="text-yellow-700 dark:text-yellow-400"
                      >mahjong:</span
                    >
                    <span class="text-green-700 dark:text-green-400"
                      >enabled</span
                    >
                  </div>
                  <div
                    class="flex items-center text-pink-700 dark:text-pink-300 hover:text-pink-900 dark:hover:text-pink-100 transition-colors cursor-pointer"
                  >
                    <span class="text-cyan-800 dark:text-cyan-400 mr-2">$</span>
                    <span class="text-yellow-700 dark:text-yellow-400"
                      >poker:</span
                    >
                    <span class="text-green-700 dark:text-green-400"
                      >active</span
                    >
                  </div>
                  <div
                    class="flex items-center text-pink-700 dark:text-pink-300 hover:text-pink-900 dark:hover:text-pink-100 transition-colors cursor-pointer"
                  >
                    <span class="text-cyan-800 dark:text-cyan-400 mr-2">$</span>
                    <span class="text-yellow-700 dark:text-yellow-400"
                      >reading:</span
                    >
                    <span class="text-green-700 dark:text-green-400"
                      >continuous</span
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Quantum Portal -->
            <div
              class="bg-gradient-to-r from-purple-200/80 dark:from-purple-900/80 to-pink-200/80 dark:to-pink-900/80 rounded-lg p-8 shadow-2xl border border-purple-600/60 dark:border-purple-500/50 relative overflow-hidden mb-8"
            >
              <div
                class="absolute inset-0 bg-gradient-to-r from-cyan-600/15 dark:from-cyan-500/5 via-purple-600/20 dark:via-purple-500/10 to-pink-600/15 dark:to-pink-500/5 animate-pulse"
              ></div>
              <div class="relative z-10">
                <div class="text-center">
                  <div
                    class="font-mono text-lg text-cyan-800 dark:text-cyan-400 mb-4"
                  >
                    <span class="animate-pulse">></span> QUANTUM_PORTAL_INITIALIZED
                  </div>
                  <h3
                    class="text-2xl font-bold mb-4 text-purple-800 dark:text-purple-300 font-mono"
                  >
                    ACCESS_GRANTED
                  </h3>
                  <p
                    class="text-purple-700 dark:text-purple-200 mb-8 font-mono text-sm"
                  >
                    // Navigate through the digital matrix
                  </p>
                  <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="/blog"
                      class="inline-flex items-center justify-center rounded-lg px-4 py-2 text-center text-base font-medium bg-white/80 dark:bg-black/50 hover:bg-white/90 dark:hover:bg-black/70 text-cyan-800 dark:text-cyan-400 border border-cyan-600/60 dark:border-cyan-500/50 hover:border-cyan-700 dark:hover:border-cyan-400 hover:shadow-cyan-500/25 hover:shadow-lg transition-all duration-300 font-mono"
                    >
                      <span class="mr-2">></span> BLOG.APP
                    </a>
                    <a
                      href="/talks"
                      class="inline-flex items-center justify-center rounded-lg px-4 py-2 text-center text-base font-medium bg-white/80 dark:bg-black/50 hover:bg-white/90 dark:hover:bg-black/70 text-pink-800 dark:text-pink-400 border border-pink-600/60 dark:border-pink-500/50 hover:border-pink-700 dark:hover:border-pink-400 hover:shadow-pink-500/25 hover:shadow-lg transition-all duration-300 font-mono"
                    >
                      <span class="mr-2">></span> TALKS.SH
                    </a>
                  </div>
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
  /* Cyberpunk Animations */
  @keyframes scan {
    0% {
      top: 0;
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
    100% {
      top: 100%;
      opacity: 0;
    }
  }

  @keyframes animate-scan {
    0%,
    100% {
      transform: translateY(-100%);
    }
    50% {
      transform: translateY(200%);
    }
  }

  .animate-scan {
    animation: animate-scan 3s ease-in-out infinite;
  }

  /* Matrix Rain Effect */
  .matrix-rain {
    background: linear-gradient(
      0deg,
      transparent 24%,
      rgba(0, 255, 255, 0.05) 25%,
      rgba(0, 255, 255, 0.05) 26%,
      transparent 27%,
      transparent 74%,
      rgba(0, 255, 255, 0.05) 75%,
      rgba(0, 255, 255, 0.05) 76%,
      transparent 77%,
      transparent
    );
    background-size: 1px 8px;
    animation: matrix-fall 0.5s linear infinite;
  }

  @keyframes matrix-fall {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 0 8px;
    }
  }

  /* Scanlines Effect */
  .scanlines {
    background: linear-gradient(
      to bottom,
      transparent 50%,
      rgba(0, 255, 255, 0.03) 51%
    );
    background-size: 100% 4px;
    animation: scanlines-move 0.1s linear infinite;
  }

  @keyframes scanlines-move {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 0 4px;
    }
  }

  /* Glitch Text Effect */
  .glitch-text {
    position: relative;
  }

  .glitch-text::before,
  .glitch-text::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .glitch-text::before {
    animation: glitch-1 0.5s infinite;
    color: #ff0040;
    z-index: -1;
  }

  .glitch-text::after {
    animation: glitch-2 0.5s infinite;
    color: #00ffff;
    z-index: -2;
  }

  @keyframes glitch-1 {
    0%,
    14%,
    16%,
    18%,
    20%,
    22%,
    100% {
      transform: translate(0);
    }
    15% {
      transform: translate(-2px, 0);
    }
    17% {
      transform: translate(2px, 0);
    }
    19% {
      transform: translate(-1px, 0);
    }
    21% {
      transform: translate(1px, 0);
    }
  }

  @keyframes glitch-2 {
    0%,
    14%,
    16%,
    18%,
    20%,
    22%,
    100% {
      transform: translate(0);
    }
    15% {
      transform: translate(1px, 0);
    }
    17% {
      transform: translate(-1px, 0);
    }
    19% {
      transform: translate(2px, 0);
    }
    21% {
      transform: translate(-2px, 0);
    }
  }

  /* Cyberpunk Scrollbar */
  .chat-container {
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 255, 255, 0.5) transparent;
  }

  .chat-container::-webkit-scrollbar {
    width: 8px;
  }

  .chat-container::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
  }

  .chat-container::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #00ffff, #ff0080);
    border-radius: 4px;
    border: 1px solid rgba(0, 255, 255, 0.3);
  }

  .chat-container::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #00ffff, #ff0080);
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  }

  /* Cyberpunk Cursor */
  .cyber-cursor {
    display: inline-block;
    width: 2px;
    height: 1.2em;
    background: linear-gradient(to bottom, #00ffff, #ff0080);
    margin-left: 3px;
    vertical-align: text-bottom;
    border-radius: 1px;
    animation: cyber-blink 1s infinite;
    box-shadow: 0 0 5px currentColor;
  }

  @keyframes cyber-blink {
    0%,
    50% {
      opacity: 1;
    }
    51%,
    100% {
      opacity: 0;
    }
  }

  /* Backdrop blur with cyberpunk tint */
  @supports (backdrop-filter: blur(10px)) {
    .backdrop-blur-xl {
      backdrop-filter: blur(16px) hue-rotate(180deg) contrast(1.2);
    }
  }
</style>
