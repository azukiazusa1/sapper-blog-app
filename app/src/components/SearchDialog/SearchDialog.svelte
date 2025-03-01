<script lang="ts">
  import { Dialog } from "bits-ui";
  import { PagefindUI } from "@pagefind/default-ui";
  import "@pagefind/default-ui/css/ui.css";
  interface Props {
    children?: import("svelte").Snippet;
  }

  let { children }: Props = $props();

  function handleKeyDown(e: KeyboardEvent) {
    // command + k でダイアログを開く
    if (e.metaKey && e.key === "k") {
      handleOpenChange(true);
    }
  }

  let open = $state(false);

  /**
   * リンクをクリックしたときにダイアログを閉じる
   */
  function handleClick(e: MouseEvent) {
    const isLink = (e.target as HTMLElement).tagName === "A";

    if (isLink) {
      open = false;
      window.removeEventListener("click", handleClick);
    }
  }

  function handleOpenChange(o: boolean) {
    open = o;
    if (o) {
      // ダイアログが開いてから <div id="search" /> が表示されるまでちょっと待つ
      setTimeout(() => {
        new PagefindUI({
          element: "#search",
          showSubResults: true,
          translations: {
            clear_search: "クリア",
            zero_results:
              "[SEARCH_TERM] に一致する記事は見つかりませんでした。",
            many_results: "[SEARCH_TERM] の検索結果（[COUNT] 件）",
            one_result: "[SEARCH_TERM] の検索結果（[COUNT] 件）",
          },
          processResult: (result) => {
            // 何故か &amp; が含まれているので置換する
            // https://github.com/CloudCannon/pagefind/issues/459
            result.meta.image = result.meta.image.replaceAll("&amp;", "&");
            return result;
          },
        });
        document
          .querySelector<HTMLElement>(".pagefind-ui__search-input")
          ?.focus();
      }, 100);

      window.addEventListener("click", handleClick);
    } else {
      window.removeEventListener("click", handleClick);
    }
  }
</script>

<svelte:document onkeydown={handleKeyDown} />

<Dialog.Root onOpenChange={handleOpenChange} bind:open>
  <Dialog.Trigger>
    {@render children?.()}
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay class="backdrop-blur-xs fixed inset-0 z-50 bg-black/80" />
    <Dialog.Content
      class="outline-hidden fixed left-0 right-0 top-0 z-50 mx-auto mt-8 flex max-h-[90%] min-h-[15rem] max-w-2xl overflow-y-scroll rounded-lg border bg-white p-5 text-neutral-800 md:mt-16 md:max-h-[80%] dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-50"
    >
      <div id="search" class="w-full"></div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<style>
  :global(html) {
    --pagefind-ui-primary: rgb(79 70 229);
    --pagefind-ui-text: rgb(38 38 38);
    --pagefind-ui-background: #ffffff;
    --pagefind-ui-border: rgb(209 213 219);
  }

  :global(html.dark) {
    --pagefind-ui-primary: rgb(129 140 248);
    --pagefind-ui-text: rgb(249 250 251);
    --pagefind-ui-background: rgb(24 24 27);
    --pagefind-ui-border: rgb(63 63 70);
  }
</style>
