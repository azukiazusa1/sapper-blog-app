<script lang="ts">
  export let page = 1
  export let total: number
  export let limit: number

  const totalPage = Math.ceil(total / limit)
  const hasPrev = page !== 1
  const hasNext = page !== totalPage
  const prevPage = page - 1
  const nextPage = page + 1

  console.log(total)
  console.log(limit)
  console.log('totalPage', totalPage)
  console.log('hasPrev', hasPrev)
  console.log('hasNext', hasNext)
</script>

<style>
  [aria-current] {
    background-color:rgb(255, 62, 0);
    color: white;
  }
</style>

<nav class="flex flex-col items-center my-12">
  <div class="flex">
    {#if hasPrev}
      <div class="h-12 w-12 mr-1 flex justify-center items-center rounded-full cursor-pointer bg-white dark:bg-gray-700">
        <a href={`/blog/page/${prevPage}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-left w-6 h-6">
              <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </a>
      </div>
    {/if}
    <div class="flex h-12 font-medium rounded-full bg-white dark:bg-gray-700">
      {#each Array(totalPage) as _, i (i)}
        <div class="w-12 md:flex justify-center items-center hidden cursor-pointer leading-5 transition duration-150 ease-in rounded-full" aria-current={page === i + 1 ? 'page' : undefined}>
          <a href={`/blog/page/${i + 1}`}>{i + 1}</a>
        </div>
      {/each}
      <div class="w-12 h-12 md:hidden flex justify-center items-center cursor-pointer leading-5 transition duration-150 ease-in rounded-full" aria-current="page">{page}</div>
    </div>
    {#if hasNext}
      <div class="h-12 w-12 ml-1 flex justify-center items-center rounded-full cursor-pointer bg-white dark:bg-gray-700">
        <a href={`/blog/page/${nextPage}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right w-6 h-6">
              <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </a>
      </div>
    {/if}
  </div>
</nav>