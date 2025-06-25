<script lang="ts">
  import TalkTimelines from "../../components/TalkTimelines.svelte";
</script>

<svelte:head>
  <title>Slides</title>
  <meta name="description" content="A list of all the slides." />
</svelte:head>

<div class="container mx-auto px-4">
  <h1
    class="mt-16 mb-8 relative text-3xl font-extrabold dark:text-white after:content-[''] after:absolute after:-bottom-3 after:left-0 after:w-20 after:h-1 after:bg-indigo-500"
  >
    Slides
  </h1>
  <TalkTimelines />
</div>
