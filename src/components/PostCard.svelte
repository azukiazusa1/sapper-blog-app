<script lang="ts">
  export let title: string
  export let slug: string
  export let about: string
</script>

<!-- Article -->
<article class="overflow-hidden h-full bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg border dark:border-gray-600">
  <a href={`/blog/${slug}`}>
    <img alt="Placeholder" class="block h-auto w-full" src="https://picsum.photos/600/400/?random" />
  </a>

  <header class="flex-row items-center justify-between leading-tight p-2 md:p-4">
    <h1 class="text-2xl">
      <a class="no-underline hover:underline" href={`/blog/${slug}`}>{ title }</a>
    </h1>
    <p class="text-grey-darker text-sm mt-2">14/4/19</p>
  </header>

  <p class="mx-4 break-words text-sm">{about}</p>

  <footer class="flex items-center justify-between leading-none p-2 md:p-4">
    <a class="flex items-center no-underline hover:underline" href="#">
      <img alt="Placeholder" class="block rounded-full" src="https://picsum.photos/32/32/?random" />
      <p class="ml-2 text-sm">Author Name</p>
    </a>
    <a class="no-underline text-grey-darker hover:text-red-dark" href="#">
      <span class="hidden">Like</span>
      <i class="fa fa-heart" />
    </a>
  </footer>
</article>
<!-- END Article -->
