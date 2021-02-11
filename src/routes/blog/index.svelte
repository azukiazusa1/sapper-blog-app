<script context="module" lang="ts">
  import RepositoryFactory, {POST} from '../../repositories/RepositoryFactory'
  const PostRepository = RepositoryFactory[POST]
  
  export async function preload() {
    const posts = await PostRepository.get()
    return { posts }
  }
</script>

<script lang="ts">
import PostList from '../../components/PostList.svelte';
import type { Post } from '../../repositories/post';  

  export let posts: Post[]
</script>

<svelte:head>
  <title>Blog</title>
</svelte:head>

<PostList {posts} />