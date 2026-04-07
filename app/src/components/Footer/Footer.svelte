<script lang="ts">
  import { m } from "$paraglide/messages";

  const privacyPolicyUrl =
    "https://policies.google.com/technologies/partner-sites";
</script>

<footer
  class="border-t border-stone-200 text-sm text-stone-500 md:h-24 dark:border-stone-800 dark:text-stone-400"
>
  <div class="container mx-auto flex h-full flex-col justify-center gap-4 p-4">
    <p>
      © {new Date().getFullYear()} - Copyright azukiazusa, All Rights Reserved.
    </p>
    <p>
      {m.googleAnalyticsDescriptionPrefix()}
      <a class="underline hover:opacity-75" href={privacyPolicyUrl}
        >{m.googleAnalyticsPrivacyPolicy()}</a
      >
      {m.googleAnalyticsDescriptionSuffix()}
    </p>
  </div>
</footer>
