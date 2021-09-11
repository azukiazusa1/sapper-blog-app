import { gql } from "@urql/core"

export const allPostsQuery = gql`
  query AllPosts(
    $order: BlogPostOrder = createdAt_DESC,
  ) {
    blogPostCollection(
      order: [$order]
    ) {
      items {
        title
        slug
        about
        createdAt
      }
    }
  }
`