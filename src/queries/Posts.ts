import { gql } from '@urql/core'

export const postsQuery = gql`
  query Posts($order: BlogPostOrder = createdAt_DESC, $limit: Int = 12, $skip: Int = 0) {
    blogPostCollection(limit: $limit, skip: $skip, order: [$order]) {
      total
      skip
      limit
      items {
        title
        slug
        about
        createdAt
        thumbnail {
          title
          url
        }
        tagsCollection(limit: 5) {
          items {
            name
            slug
          }
        }
      }
    }
  }
`
