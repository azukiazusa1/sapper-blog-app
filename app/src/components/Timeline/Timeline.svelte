<script lang="ts">
  import Time from "../Time/Time.svelte";
  interface Props {
    eventTitle: string;
    eventDate: string;
    description: string;
    presentationTitle: string;
    presentationLink: string;
  }

  let {
    eventTitle,
    eventDate,
    description,
    presentationTitle,
    presentationLink,
  }: Props = $props();
</script>

<li class="mb-10 relative">
  <div class="ml-[-16px] md:ml-0 mb-2 md:mb-0 md:absolute -left-32 top-[12px]">
    <Time date={eventDate} />
  </div>

  <span
    class="absolute -left-[7px] md:top-[18px] top-[42px] flex h-[13px] w-[13px] items-center justify-center rounded-full bg-indigo-400 dark:bg-indigo-700 ring-zinc-300 dark:ring-zinc-500 ring-4"
  >
  </span>
  <div class="ml-6 md:ml-12 bg-white dark:bg-zinc-900 p-4 md:p-6 rounded-lg">
    <h3
      class="mb-1 flex items-center text-xl font-semibold text-gray-900 dark:text-white"
    >
      {eventTitle}
    </h3>
    <p
      class="mt-2 flex items-center gap-2 text-lg font-bold text-indigo-700 underline dark:text-indigo-400"
    >
      <a
        class="no-underline hover:underline"
        href={presentationLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        {presentationTitle}
      </a>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="h-6 w-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
        />
      </svg>
    </p>
    <p class="my-2 text-sm font-normal text-gray-500 dark:text-gray-400">
      {description}
    </p>
  </div>
</li>
