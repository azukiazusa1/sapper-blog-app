<script>
  import variables from "$lib/variables";
  import author from "../../assets/images/azukiazusa.jpeg";
  import TwitterIcon from "../../components/Icons/Twitter.svelte";
  import { fly, fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { tick } from "svelte";
  import GitHub from "../../components/Icons/GitHub.svelte";
  import { localizeHref } from "$paraglide/runtime";
  import { m } from "$paraglide/messages";

  const content1 = m.aboutContent1();
  const content2 = m.aboutContent2();
  const content3 = m.aboutContent3();

  const messages = [
    { type: "question", text: m.aboutChatQuestion1() },
    { type: "answer", text: content1 },
    { type: "question", text: m.aboutChatQuestion2() },
    { type: "answer", text: content2 },
    { type: "question", text: m.aboutChatQuestion3() },
    { type: "answer", text: content3 },
  ];

  let chatContainer = $state();

  async function scrollToBottom() {
    await tick();
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  let visibleMessages = $state(0);
  let typingInterval = $state();
  let currentTypingIndex = $state(0);
  let displayedTexts = $state(messages.map(() => ""));
  let typingSpeed = 30;

  function startTypingEffect() {
    let messageComplete = false;

    typingInterval = setInterval(() => {
      if (visibleMessages < messages.length) {
        const currentMessage = messages[visibleMessages];
        const fullText = currentMessage.text;

        if (currentTypingIndex < fullText.length) {
          displayedTexts[visibleMessages] += fullText[currentTypingIndex];
          currentTypingIndex++;
          messageComplete = false;
          scrollToBottom();
        } else {
          messageComplete = true;
        }

        if (messageComplete) {
          setTimeout(() => {
            visibleMessages++;
            currentTypingIndex = 0;
            scrollToBottom();
          }, 500);
          clearInterval(typingInterval);

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
    }, 600);
  });

  $effect(() => {
    if (visibleMessages) {
      scrollToBottom();
    }
  });

  const content = m.aboutMetaDescription();
</script>

<svelte:head>
  <title>{m.aboutTitle()} | {m.siteTitle()}</title>
  <meta name="description" {content} />
  <link rel="canonical" href={`${variables.baseURL}/about`} />
</svelte:head>

<div
  class="border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 py-12"
>
  <div class="container mx-auto px-4 max-w-6xl">
    <p
      class="mb-3 font-mono text-xs tracking-[0.2em] uppercase"
      style="color: var(--color-accent)"
    >
      About
    </p>
    <h1
      class="text-4xl font-bold text-stone-900 dark:text-stone-100 md:text-5xl"
      style="font-family: var(--font-display)"
    >
      azukiazusa1
    </h1>
  </div>
</div>

<div class="container mx-auto px-4 max-w-6xl py-12">
  {#if visible}
    <div
      class="grid lg:grid-cols-12 gap-8 lg:gap-12"
      in:fade={{ delay: 100, duration: 600 }}
    >
      <!-- Profile sidebar -->
      <div class="lg:col-span-4">
        <div
          class="rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 p-8 sticky top-24"
        >
          <!-- Avatar -->
          <div class="mb-6 flex justify-center">
            <img
              src={author}
              alt="azukiazusa1"
              class="h-32 w-32 rounded-full object-cover border-2 border-stone-200 dark:border-stone-700"
              width="128"
              height="128"
            />
          </div>

          <!-- Name & Role -->
          <div class="mb-6 text-center">
            <div
              class="font-mono text-xl font-bold text-stone-900 dark:text-stone-100"
            >
              azukiazusa1
            </div>
            <div
              class="mt-1 font-mono text-sm"
              style="color: var(--color-accent)"
            >
              Frontend Engineer
            </div>
          </div>

          <!-- Divider -->
          <div
            class="mb-6 border-t border-stone-200 dark:border-stone-800"
          ></div>

          <!-- Meta info -->
          <div
            class="mb-6 space-y-3 font-mono text-sm text-stone-600 dark:text-stone-400"
          >
            <div class="flex items-center gap-2">
              <span class="text-stone-400 dark:text-stone-500">frontend</span>
              <span class="ml-auto text-stone-800 dark:text-stone-200"
                >expert</span
              >
            </div>
            <div class="flex items-center gap-2">
              <span class="text-stone-400 dark:text-stone-500">blogging</span>
              <span class="ml-auto text-stone-800 dark:text-stone-200"
                >weekly</span
              >
            </div>
            <div class="flex items-center gap-2">
              <span class="text-stone-400 dark:text-stone-500">mahjong</span>
              <span
                class="ml-auto font-medium"
                style="color: var(--color-accent)">enabled</span
              >
            </div>
            <div class="flex items-center gap-2">
              <span class="text-stone-400 dark:text-stone-500">poker</span>
              <span
                class="ml-auto font-medium"
                style="color: var(--color-accent)">active</span
              >
            </div>
          </div>

          <!-- Divider -->
          <div
            class="mb-6 border-t border-stone-200 dark:border-stone-800"
          ></div>

          <!-- Social links -->
          <div class="flex justify-center gap-3">
            <a
              href="https://x.com/azukiazusa9"
              target="_blank"
              rel="noreferrer noopener"
              class="flex h-10 w-10 items-center justify-center rounded border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
              aria-label="X"
            >
              <TwitterIcon className="h-5 w-5" />
            </a>
            <a
              href="https://github.com/azukiazusa1"
              target="_blank"
              rel="noreferrer noopener"
              class="flex h-10 w-10 items-center justify-center rounded border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
              aria-label="GitHub"
            >
              <GitHub className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <!-- Chat interface -->
      <div class="lg:col-span-8 space-y-6">
        <div
          class="rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 overflow-hidden"
        >
          <!-- Chat header -->
          <div
            class="border-b border-stone-200 dark:border-stone-800 px-6 py-4 flex items-center gap-3"
          >
            <div class="flex gap-1.5">
              <div
                class="h-3 w-3 rounded-full bg-stone-200 dark:bg-stone-700"
              ></div>
              <div
                class="h-3 w-3 rounded-full bg-stone-200 dark:bg-stone-700"
              ></div>
              <div
                class="h-3 w-3 rounded-full bg-stone-200 dark:bg-stone-700"
              ></div>
            </div>
            <span class="font-mono text-xs text-stone-400 dark:text-stone-500">
              azukiazusa1 — interview
            </span>
          </div>

          <!-- Messages -->
          <div
            class="p-6 h-[520px] overflow-y-auto space-y-6"
            bind:this={chatContainer}
          >
            {#each messages.slice(0, visibleMessages + 1) as message, i}
              {#if i < visibleMessages}
                {#if message.type === "question"}
                  <div
                    class="flex justify-end"
                    in:fly={{ y: 10, duration: 300 }}
                  >
                    <div class="max-w-[80%]">
                      <div
                        class="rounded-lg rounded-br-sm bg-stone-800 dark:bg-stone-100 px-4 py-3 text-sm text-white dark:text-stone-900 leading-relaxed"
                      >
                        {message.text}
                      </div>
                      <div
                        class="mt-1 text-right font-mono text-xs text-stone-400 dark:text-stone-500"
                      >
                        you
                      </div>
                    </div>
                  </div>
                {:else}
                  <div
                    class="flex items-start gap-3"
                    in:fly={{ y: 10, duration: 300 }}
                  >
                    <img
                      src={author}
                      alt="azukiazusa1"
                      class="mt-0.5 h-8 w-8 flex-shrink-0 rounded-full object-cover border border-stone-200 dark:border-stone-700"
                      width="32"
                      height="32"
                    />
                    <div class="max-w-[80%]">
                      <div
                        class="rounded-lg rounded-bl-sm border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 px-4 py-3 text-sm text-stone-800 dark:text-stone-200 leading-relaxed"
                      >
                        {message.text}
                      </div>
                      <div
                        class="mt-1 font-mono text-xs text-stone-400 dark:text-stone-500"
                      >
                        azukiazusa1
                      </div>
                    </div>
                  </div>
                {/if}
              {:else if i === visibleMessages}
                {#if message.type === "question"}
                  <div
                    class="flex justify-end"
                    in:fly={{ y: 10, duration: 300 }}
                  >
                    <div class="max-w-[80%]">
                      <div
                        class="rounded-lg rounded-br-sm bg-stone-800 dark:bg-stone-100 px-4 py-3 text-sm text-white dark:text-stone-900 leading-relaxed"
                      >
                        {displayedTexts[i]}<span class="typing-cursor"></span>
                      </div>
                      <div
                        class="mt-1 text-right font-mono text-xs text-stone-400 dark:text-stone-500"
                      >
                        you
                      </div>
                    </div>
                  </div>
                {:else}
                  <div
                    class="flex items-start gap-3"
                    in:fly={{ y: 10, duration: 300 }}
                  >
                    <img
                      src={author}
                      alt="azukiazusa1"
                      class="mt-0.5 h-8 w-8 flex-shrink-0 rounded-full object-cover border border-stone-200 dark:border-stone-700"
                      width="32"
                      height="32"
                    />
                    <div class="max-w-[80%]">
                      <div
                        class="rounded-lg rounded-bl-sm border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 px-4 py-3 text-sm text-stone-800 dark:text-stone-200 leading-relaxed"
                      >
                        {displayedTexts[i]}<span class="typing-cursor"></span>
                      </div>
                      <div
                        class="mt-1 font-mono text-xs text-stone-400 dark:text-stone-500"
                      >
                        azukiazusa1
                      </div>
                    </div>
                  </div>
                {/if}
              {/if}
            {/each}

            {#if visibleMessages < messages.length && displayedTexts[visibleMessages]?.length === messages[visibleMessages]?.text.length}
              <div class="flex items-center gap-1 pl-11">
                <div class="typing-dot" style="animation-delay: 0ms"></div>
                <div class="typing-dot" style="animation-delay: 150ms"></div>
                <div class="typing-dot" style="animation-delay: 300ms"></div>
                <span
                  class="ml-2 font-mono text-xs text-stone-400 dark:text-stone-500"
                >
                  {m.aboutProcessingData()}
                </span>
              </div>
            {/if}
          </div>
        </div>

        <!-- CTA -->
        <div
          class="rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 px-8 py-6"
          in:fade={{ delay: 800, duration: 600 }}
        >
          <h2
            class="mb-4 border-b border-stone-200 pb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-stone-500 dark:border-stone-700 dark:text-stone-400"
          >
            Navigate
          </h2>
          <div class="flex flex-col sm:flex-row gap-3">
            <a
              href={localizeHref("/blog")}
              class="inline-flex items-center justify-center rounded border border-stone-300 dark:border-stone-600 px-5 py-2.5 text-sm font-medium text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors font-mono"
            >
              → blog
            </a>
            <a
              href={localizeHref("/talks")}
              class="inline-flex items-center justify-center rounded border border-stone-300 dark:border-stone-600 px-5 py-2.5 text-sm font-medium text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors font-mono"
            >
              → talks
            </a>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .typing-cursor {
    display: inline-block;
    width: 2px;
    height: 1em;
    background-color: currentColor;
    margin-left: 1px;
    vertical-align: text-bottom;
    animation: blink 1s step-end infinite;
  }

  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }

  .typing-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--color-stone-400, #a8a29e);
    animation: bounce 1s ease-in-out infinite;
  }

  @keyframes bounce {
    0%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-4px);
    }
  }
</style>
