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

<section class="py-4 lg:py-8 min-h-screen bg-gradient-to-br">
  <div class="container mx-auto flex flex-col px-1 lg:px-5 max-w-5xl">
    {#if visible}
      <h1
        class="text-5xl font-bold mb-12 text-center italic"
        in:fly={{ y: -20, duration: 800 }}
      >
        About Me
      </h1>

      <div class="overflow-hidden" in:fade={{ delay: 300, duration: 800 }}>
        <div class="flex flex-col lg:flex-row h-full">
          <!-- Profile Section - Added h-full to maintain full height -->
          <div
            class="lg:w-1/3 bg-gradient-to-br from-orange-500 to-red-600 p-4 lg:p-8 flex flex-col items-center justify-center text-white lg:h-full rounded-lg"
          >
            <div class="relative">
              <div
                class="absolute inset-0 rounded-full bg-white opacity-20 transform scale-110 animate-pulse"
              ></div>
              <div class="relative">
                <Avatar alt="azukiazusa1" src={author} size="lg" />
              </div>
            </div>

            <h2 class="mt-6 text-2xl font-bold">azukiazusa1</h2>
            <div class="bg-white my-4 h-1 w-16 rounded-full"></div>

            <div class="flex space-x-4 mt-4">
              <a
                href="https://x.com/azukiazusa9"
                target="_blank"
                rel="noreferrer noopener"
                class="transition-transform hover:scale-110"
                aria-label="X"
              >
                <TwitterIcon className="h-6 w-6 text-white" />
              </a>
              <a
                href="https://github.com/azukiazusa1"
                target="_blank"
                rel="noreferrer noopener"
                class="transition-transform hover:scale-110"
                aria-label="GitHub"
              >
                <GitHub className="h-6 w-6 text-white" />
              </a>
            </div>
          </div>

          <!-- Content Section - Added fixed height and flex column structure -->
          <div
            class="lg:w-2/3 px-2 py-4 lg:p-12 flex flex-col h-[400px] lg:h-[600px]"
          >
            <!-- Chat UI - Changed to flex-grow to fill available space -->
            <div
              class="space-y-4 overflow-y-auto chat-container pr-2 flex-grow"
              bind:this={chatContainer}
            >
              {#each messages.slice(0, visibleMessages + 1) as message, i}
                {#if i < visibleMessages}
                  <!-- Fully displayed message -->
                  {#if message.type === "question"}
                    <div
                      class="chat-message question"
                      in:fly={{ y: 20, duration: 300 }}
                    >
                      <div
                        class="bg-blue-100 dark:bg-blue-900 text-gray-800 dark:text-gray-200 p-3 rounded-lg rounded-tr-none inline-block max-w-[80%]"
                      >
                        {message.text}
                      </div>
                      <div class="text-xs text-gray-500 mt-1 text-right">
                        あなた
                      </div>
                    </div>
                  {:else}
                    <div
                      class="chat-message answer"
                      in:fly={{ y: 20, duration: 300 }}
                    >
                      <div class="flex items-start">
                        <div
                          class="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0"
                        >
                          <img
                            src={author}
                            alt="azukiazusa1"
                            class="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div
                            class="bg-white dark:bg-zinc-700 p-3 rounded-lg rounded-tl-none shadow-sm inline-block max-w-[80%]"
                          >
                            {message.text}
                          </div>
                          <div class="text-xs text-gray-500 mt-1">
                            azukiazusa1
                          </div>
                        </div>
                      </div>
                    </div>
                  {/if}
                {:else if i === visibleMessages}
                  <!-- Currently typing message -->
                  {#if message.type === "question"}
                    <div
                      class="chat-message question"
                      in:fly={{ y: 20, duration: 300 }}
                    >
                      <div
                        class="bg-blue-100 dark:bg-blue-900 text-gray-800 dark:text-gray-200 p-3 rounded-lg rounded-tr-none inline-block max-w-[80%]"
                      >
                        {displayedTexts[i]}
                        {#if displayedTexts[i].length === message.text.length}
                          <span class="typing-cursor"></span>
                        {/if}
                      </div>
                      <div class="text-xs text-gray-500 mt-1 text-right">
                        あなた
                      </div>
                    </div>
                  {:else}
                    <div
                      class="chat-message answer"
                      in:fly={{ y: 20, duration: 300 }}
                    >
                      <div class="flex items-start">
                        <div
                          class="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0"
                        >
                          <img
                            src={author}
                            alt="azukiazusa1"
                            class="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div
                            class="bg-white dark:bg-zinc-700 p-3 rounded-lg rounded-tl-none shadow-sm inline-block max-w-[80%]"
                          >
                            {displayedTexts[i]}
                            {#if displayedTexts[i].length < message.text.length}
                              <span class="typing-cursor"></span>
                            {/if}
                          </div>
                          <div class="text-xs text-gray-500 mt-1">
                            azukiazusa1
                          </div>
                        </div>
                      </div>
                    </div>
                  {/if}
                {/if}
              {/each}

              {#if visibleMessages < messages.length && displayedTexts[visibleMessages]?.length === messages[visibleMessages]?.text.length}
                <div class="flex items-center space-x-2 pl-10 mt-2">
                  <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              {/if}
            </div>

            <!-- Added bottom actions container -->
            <div class="flex flex-col sm:flex-row gap-4 mt-8">
              <LinkButton variant="primary" href="/blog">
                ブログを読む
                <svg
                  class="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </LinkButton>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</section>

<style>
  @keyframes pulse {
    0%,
    100% {
      opacity: 0.2;
      transform: scale(1.05);
    }
    50% {
      opacity: 0.3;
      transform: scale(1.1);
    }
  }

  .animate-pulse {
    animation: pulse 3s infinite;
  }

  .chat-message.question {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .chat-message.answer {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .chat-container {
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
  }

  .chat-container::-webkit-scrollbar {
    width: 5px;
  }

  .chat-container::-webkit-scrollbar-track {
    background: transparent;
  }

  .chat-container::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 20px;
  }

  .typing-indicator {
    display: flex;
    align-items: center;
  }

  .typing-indicator span {
    height: 8px;
    width: 8px;
    margin: 0 1px;
    background-color: #9ca3af;
    border-radius: 50%;
    display: block;
    opacity: 0.4;
  }

  .typing-indicator span:nth-of-type(1) {
    animation: blink 1s infinite 0.3s;
  }

  .typing-indicator span:nth-of-type(2) {
    animation: blink 1s infinite 0.5s;
  }

  .typing-indicator span:nth-of-type(3) {
    animation: blink 1s infinite 0.7s;
  }

  @keyframes blink {
    50% {
      opacity: 1;
    }
  }

  .typing-cursor {
    display: inline-block;
    width: 2px;
    height: 1em;
    background-color: currentColor;
    margin-left: 2px;
    vertical-align: middle;
    animation: cursor-blink 1s infinite;
  }

  @keyframes cursor-blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
</style>
