<script lang="ts">
  import Time from "../Time/Time.svelte";
  export let eventTitle: string;
  export let eventDate: string;
  export let description: string;
  export let presentationTitle: string;
  export let presentationLink: string;
</script>

<li class="mb-10 ms-6">
  <span
    class="ring-3 absolute -start-1.5 mt-2 flex h-3 w-3 items-center justify-center rounded-full bg-indigo-700 ring-white dark:ring-gray-900"
  >
  </span>
  <h3
    class="mb-1 flex items-center text-xl font-semibold text-gray-900 dark:text-white"
  >
    {eventTitle}
  </h3>
  <Time date={eventDate} />
  <p class="mt-2 text-lg font-bold text-indigo-700 dark:text-indigo-400 underline flex items-center gap-2">
    <a class="no-underline hover:underline" href={presentationLink} target="_blank" rel="noopener noreferrer">
      {presentationTitle}
    </a>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
  </p>
  <p class="my-2 text-sm font-normal text-gray-500 dark:text-gray-400">
    {description}
  </p>
</li>
