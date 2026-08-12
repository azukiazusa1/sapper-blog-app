<script lang="ts">
  import variables from "$lib/variables";
  import { getLocale } from "$paraglide/runtime";
  import { m } from "$paraglide/messages";

  // Google の優先ソース設定ツールは対象サイトをドメインで受け取る
  // https://developers.google.com/search/docs/appearance/preferred-sources
  let domain = $derived.by(() => {
    try {
      return new URL(variables.baseURL).hostname;
    } catch {
      return variables.baseURL;
    }
  });

  let href = $derived(
    `https://www.google.com/preferences/source?q=${encodeURIComponent(domain)}`,
  );

  // Google が配布している公式バッジアセット（ライト / ダークの 2 種類）
  let locale = $derived(getLocale() === "en" ? "en" : "ja");
  const width = 338;
  let height = $derived(locale === "en" ? 107 : 106);
</script>

<a
  {href}
  target="_blank"
  rel="noopener noreferrer"
  class="inline-flex w-fit rounded-lg transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2"
  style="outline-color: var(--color-accent)"
>
  <img
    src="/images/preferred-source/badge-light-{locale}.png"
    srcset="/images/preferred-source/badge-light-{locale}.png 1x, /images/preferred-source/badge-light-{locale}@2x.png 2x"
    alt={m.setAsPreferredSource()}
    {width}
    {height}
    class="block h-11 w-auto dark:hidden"
    loading="lazy"
    decoding="async"
  />
  <img
    src="/images/preferred-source/badge-dark-{locale}.png"
    srcset="/images/preferred-source/badge-dark-{locale}.png 1x, /images/preferred-source/badge-dark-{locale}@2x.png 2x"
    alt={m.setAsPreferredSource()}
    {width}
    {height}
    class="hidden h-11 w-auto dark:block"
    loading="lazy"
    decoding="async"
  />
</a>
