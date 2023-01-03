<script lang="ts">
  import { goto } from '$app/navigation'
  import SearchInput from './SearchInput/SearchInput.svelte'
  import DropDownMenu from './DropDown/DropDownMenu.svelte'
  import type { SearchPostsQuery } from '../generated/graphql'

  let value = ''
  let posts: SearchPostsQuery
  let isFocus = false
  let loading = true
  $: showDropDownMenu = isFocus && value.trim()

  const search = async () => {
    loading = true
    posts = await fetch(`/api/search?q=${value}`).then((res) => res.json())
    loading = false
  }

  $: params = new URLSearchParams({ q: value })

  $: {
    if (value.trim()) {
      search()
    }
  }

  $: items = posts
    ? posts.blogPostCollection.items.map((item) => {
        return {
          href: `/blog/${item.slug}`,
          imageUrl: item.thumbnail.url,
          text: item.title,
        }
      })
    : []

  const handleBlur = () => {
    setTimeout(() => {
      isFocus = false
    }, 100)
  }

  const handleSubmit = () => {
    if (!value.trim()) return
    goto(`/blog/search?${params}`)
  }
</script>

<form role="search" on:submit|preventDefault={handleSubmit}>
  <SearchInput bind:value on:focus={() => (isFocus = true)} on:blur={handleBlur} />
</form>
{#if showDropDownMenu}
  <DropDownMenu {items} {loading} />
{/if}
