import type { PostBySlugQuery, PostsQuery } from "../generated/graphql"

export const createDummyPost = (id = '1') => {
  return {
    __typename: 'BlogPost' as const,
    title: `title${id}`,
    slug: id,
    aboug: 'lorem ipsum',
    createdAt: '2021-01-31T15:00:00.000Z',
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

export const createDummyPostBySlugQuery = (slug: string) => {
  return {
    __typename: 'Query',
    blogPostCollection: {
      items: [
        {
          title: 'title',
          about: 'lorem ipsum',
          slug,
          relatedArticleCollection: {
            items: createDummyPosts(4)
          },
          article: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illo sequi esse asperiores quaerat, est ex? Eaque totam nostrum iure, quod cum dolor asperiores. Deleniti, ab unde? Magni, voluptate velit. Neque!',
          createdAt: '2021-01-31T15:00:00.000Z',
          tagsCollection: {
            __typename: 'BlogPostTagsCollection',
            items: [{
              __typename: 'Tag',
              name: 'tag1'
            }]
          }
        }
      ]
    }
  } as PostBySlugQuery
}