<script lang="ts">
  import { m } from "$paraglide/messages";
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
            clear_search: m.searchClear(),
            zero_results: m.searchZeroResults(),
            many_results: m.searchManyResults(),
            one_result: m.searchOneResult(),
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
      class="outline-hidden fixed left-0 right-0 top-0 z-50 mx-auto mt-8 flex max-h-[90%] min-h-[15rem] max-w-2xl overflow-y-scroll rounded-lg border border-stone-200 bg-white p-5 text-stone-800 md:mt-16 md:max-h-[80%] dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
    >
      <div id="search" class="w-full"></div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<style>
  :global(html) {
    --pagefind-ui-primary: #1a7a6d;
    --pagefind-ui-text: rgb(41 37 36);
    --pagefind-ui-background: #ffffff;
    --pagefind-ui-border: rgb(214 211 209);
  }

  :global(html.dark) {
    --pagefind-ui-primary: #2dd4bf;
    --pagefind-ui-text: rgb(245 245 244);
    --pagefind-ui-background: rgb(28 25 23);
    --pagefind-ui-border: rgb(68 64 60);
  }
</style>
