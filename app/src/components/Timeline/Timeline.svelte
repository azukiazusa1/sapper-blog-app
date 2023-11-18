<script lang="ts">
  import Time from "./Time/Time.svelte";
  export let eventTitle: string;
  export let eventDate: string;
  export let description: string;
  export let presentationTitle: string;
  export let presentationLink: string;
</script>

<li class="mb-10 ms-6">
  <span
    class="absolute -start-1.5 mt-2 flex h-3 w-3 items-center justify-center rounded-full bg-indigo-700 ring-2 ring-white dark:ring-gray-900"
  >
  </span>
  <h3
    class="mb-1 flex items-center text-xl font-semibold text-gray-900 dark:text-white"
  >
    {eventTitle}
  </h3>
  <Time date={eventDate} />
  <p class="mt-2 text-lg font-bold text-indigo-700 dark:text-indigo-400">
    <a class="no-underline hover:underline" href={presentationLink}>
      {presentationTitle}
    </a>
  </p>
  <p class="my-2 text-sm font-normal text-gray-500 dark:text-gray-400">
    {description}
  </p>
</li>
