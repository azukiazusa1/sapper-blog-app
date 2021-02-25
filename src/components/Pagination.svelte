<script lang="ts">
  import PrevIcon from "./Icons/Prev.svelte"
  import NextIcon from "./Icons/Next.svelte"
import Page from "./Page.svelte"

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

<nav class="flex flex-col items-center my-12">
  <div class="flex">
    {#if hasPrev}
      <div class="h-12 w-12 mr-1 flex justify-center items-center rounded-full cursor-pointer bg-white dark:bg-gray-700">
        <a href={`/blog/page/${prevPage}`}>
          <PrevIcon />
        </a>
      </div>
    {/if}
    <div class="flex h-12 font-medium rounded-full bg-white dark:bg-gray-700">
      {#each Array(totalPage) as _, i (i)}
        <Page current={page === i + 1}>
          <a href={`/blog/page/${i +1}`}>{i + 1}</a>
        </Page>
      {/each}
      <Page current sm>{page}</Page>
    </div>
    {#if hasNext}
      <div class="h-12 w-12 ml-1 flex justify-center items-center rounded-full cursor-pointer bg-white dark:bg-gray-700">
        <a href={`/blog/page/${nextPage}`}>
          <NextIcon />
        </a>
      </div>
    {/if}
  </div>
</nav>