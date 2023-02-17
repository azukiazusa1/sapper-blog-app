import { gql } from '@urql/core'

export const allPostsQuery = gql`
  query AllPosts($order: BlogPostOrder = createdAt_DESC) {
    blogPostCollection(order: [$order], limit: 10000) {
      items {
        title
        slug
        about
        createdAt
      }
    }
  }
`
