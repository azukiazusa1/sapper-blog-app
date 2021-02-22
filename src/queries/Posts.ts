import { gql } from "@urql/core"

export const postsQuery = gql`
  query Posts($order: BlogPostOrder = createdAt_DESC, $limit: Int = 12) {
    blogPostCollection(limit: $limit, order: [$order]) {
      items {
        ...BlogPostItem
      }
    }
  }
`