<script lang="ts">
  import { m } from "$paraglide/messages";
</script>

<footer
  class="border-t border-gray-300 text-sm text-gray-600 md:h-24 dark:border-zinc-700 dark:text-gray-400"
>
  <div class="container mx-auto flex h-full flex-col justify-center gap-4 p-4">
    <p>
      © {new Date().getFullYear()} - Copyright azukiazusa, All Rights Reserved.
    </p>
    <p>
      {m.googleAnalyticsDescriptionPrefix()}
      <a
        class="underline hover:opacity-75"
        href="https://policies.google.com/technologies/partner-sites"
        >{m.googleAnalyticsPrivacyPolicy()}</a
      >
      {m.googleAnalyticsDescriptionSuffix()}
    </p>
  </div>
</footer>
