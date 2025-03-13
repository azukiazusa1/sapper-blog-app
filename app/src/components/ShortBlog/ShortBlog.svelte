<script lang="ts">
  import { createBubbler, stopPropagation } from "svelte/legacy";

  const bubble = createBubbler();
  import PrevIcon from "../Icons/Prev.svelte";
  import ForwardIcon from "../Icons/Forward.svelte";
  import FloatingActionButton from "../FloatingActionButton/FloatingActionButton.svelte";
  import { Progress } from "bits-ui";
  import Slide from "./Slide.svelte";
  import Indicator from "./Indicator.svelte";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  interface Props {
    id: string;
    title: string;
    contents: string[];
    ids: string[];
  }

  let { id, title, contents, ids }: Props = $props();

  let active = $state(0);
  let slidesCount = $derived(contents.length);

  function nextSlide() {
    if (active === slidesCount - 1) {
      return;
    }
    active = (active + 1) % slidesCount;
  }

  function prevSlide() {
    if (active === 0) {
      return;
    }
    active = (active - 1) % slidesCount;
  }

  function handleClick(e: MouseEvent) {
    // テキストを選択しているときは何もしない
    if (window.getSelection()?.toString()) {
      return;
    }

    // 左半分をクリックしたら前のスライドへ、右半分をクリックしたら次のスライドへ
    if (e.clientX < window.innerWidth / 2) {
      prevSlide();
    } else {
      nextSlide();
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    } else if (e.shiftKey && e.key === "N") {
      handleClickNextButton();
    }
  }

  onMount(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });
  /**
   * 今表示しているショートのIDを除いたすべてのショートのIDからランダムに1つ選ぶ
   */
  function handleClickNextButton() {
    active = 0;

    const filteredIds = ids.filter((v) => id !== v);
    const randomIndex = Math.floor(Math.random() * filteredIds.length);
    const nextId = filteredIds[randomIndex];

    goto(`/blog/shorts/${nextId}`);
  }
</script>

<!-- eslint-disable svelte/no-at-html-tags -->
<!-- eslint-disable-next-line svelte/valid-compile -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="h-screen supports-[height:100svh]:h-[100svh] absolute top-0 left-0 z-20 mx-auto w-screen sm:static sm:z-0 sm:h-[700px] sm:w-[430px]"
  onclick={handleClick}
>
  <article
    class="relative flex h-full w-full flex-col items-center justify-center rounded-xl bg-black text-lg text-white"
  >
    <div class="absolute top-0 left-0 z-10 px-4 py-6">
      <a href="/blog/shorts" onclick={stopPropagation(bubble("click"))}>
        <div class="sr-only">戻る</div>
        <PrevIcon className="h-8 w-8" />
      </a>
    </div>
    <div class="flex w-full p-6 prose dark:prose-invert" id="contents">
      {#each contents as content, i}
        <Slide active={active === i}>
          {@html content}
        </Slide>
      {/each}
    </div>
    <div class="absolute right-0 bottom-24 left-0 mx-auto flex justify-center">
      <Progress.Root
        class="relative flex h-4 w-48 gap-4 overflow-hidden"
        value={active + 1}
        max={slidesCount}
      >
        {#each Array.from({ length: slidesCount }, (_, i) => i) as i}
          <Indicator active={active === i} />
        {/each}
      </Progress.Root>
    </div>
    <div class="absolute bottom-6 left-4 w-[70%]">
      <h2 class="font-sm line-clamp-2">
        {title}
      </h2>
    </div>
    <FloatingActionButton click={handleClickNextButton}>
      <div class="sr-only">次へ</div>
      <ForwardIcon className="h-8 w-8" />
    </FloatingActionButton>
  </article>
</div>
