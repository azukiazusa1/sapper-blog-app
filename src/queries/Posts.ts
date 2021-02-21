import { gql } from "@urql/core"

export const postsQuery = gql`
  query Posts($order: BlogPostOrder = createdAt_DESC) {
    blogPostCollection(limit: 10, order: [$order]){
      items{
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