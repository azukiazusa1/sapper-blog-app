import type { PostsQuery } from "../generated/graphql"

export const createDummyPost = (id = '1') => {
  return {
    __typename: 'BlogPost' as const,
    title: `title${id}`,
    slug: id,
    aboug: 'lorem ipsum',
    tagsCollection: {
      __typename: 'BlogPostTagsCollection' as const,
      items: [{
        __typename: 'Tag' as const,
        name: 'tag'
      }]
    }
  }
}

export const createDummyPosts = (num: number) => {
  const dummyPosts: PostsQuery = {
    __typename: 'Query',
    blogPostCollection: {
      items: []
    }
  }
  for (let i = 0; i < num; i++) {
    dummyPosts.blogPostCollection.items.push(createDummyPost(String(i)))
  }
  return dummyPosts
}
