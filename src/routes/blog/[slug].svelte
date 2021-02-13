<script context="module" lang="ts">
  import RepositoryFactory, { POST } from '../../repositories/RepositoryFactory'
  const PostRepository = RepositoryFactory[POST]

  import  unified from 'unified'
  import  markdown from 'remark-parse';
  import remark2rehype from 'remark-rehype';
  import html from 'rehype-stringify';

  export async function preload({ params }) {
    try {
      const res = await PostRepository.find(params.slug)
      if (res.blogPostCollection.items.length === 0) {
        this.error(404, 'Not Found')
      }
      const processor = unified()
        .use(markdown)
        .use(remark2rehype)
        .use(html)
      const input = res.blogPostCollection.items[0].article
      const { contents } = await processor.process(input)
      return { post: res.blogPostCollection.items[0], contents }
    } catch (err) {
      this.error(err.status, err.message)
    }
  }
</script>

<script lang="ts">
  import Card from '../../components/Card.svelte';
import type { BlogPost } from '../../generated/graphql';

  export let post: Pick<BlogPost, 'title' | 'slug' | 'about' | 'article' | 'createdAt' | 'tagsCollection'>
  export let contents: string
</script>

<svelte:head>
  <title>{post.title}</title>
  <meta name="description" content={post.about}>
</svelte:head>

<div class="my-12">
  <Card title={post.title} tags={post.tagsCollection.items} createdAt={post.createdAt} {contents} />
</div>