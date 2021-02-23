<script lang="ts">
  import SearchInput from './SearchInput.svelte'
  import DropDownMenu from './DropDownMenu.svelte'
  import type { SearchPostsQuery } from '../generated/graphql';

  export let value = ''
  let posts: SearchPostsQuery
  let isFocus = false
  let loading = true
  $: showDropDownMenu = isFocus && value.trim()

  const search = async (params: URLSearchParams) => {
    loading = true
    const res = await fetch(`blog.json?${params}`,)
    const data = await res.json()
    loading = false
    posts = data.posts
  }

  $: {
    if (value.trim()) {
      const params = new URLSearchParams({q: value})
      search(params)
    }
  }

  $: items = posts ? posts.blogPostCollection.items.map(item => {
    return {
      href: `/blog/${item.slug}`,
      imageUrl: item.thumbnail.url,
      text: item.title
    }
  }) : []

  const handleBlur = () => {
    setTimeout(() => {
      isFocus = false
    }, 100)
  }
</script>

<SearchInput 
  bind:value
  on:focus={() => isFocus = true}
  on:blur={handleBlur}
/>
{#if showDropDownMenu}
  <DropDownMenu {items} {loading} />
{/if}