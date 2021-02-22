import { gql } from "@urql/core"

export const searchPostsQuery = gql`
  query SearchPosts($order: BlogPostOrder = createdAt_DESC, $limit: Int = 12, $q: String!) {
    blogPostCollection(limit: $limit, order: [$order], where: {
      OR: [
        { about_contains: $q },
        { article_contains: $q },
        { title_contains: $q }
      ]
    }) {
      items {
        ...BlogPostItem
      }
    }
  }
`