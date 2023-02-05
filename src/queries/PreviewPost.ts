import { gql } from '@urql/core'

export const previewPost = gql`
  query PreviewPost($id: String!) {
    blogPostCollection(where: { sys: { id: $id } }, limit: 1, preview: true) {
      items {
        sys {
          id
          firstPublishedAt
        }
        title
        slug
        about
        article
        createdAt
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
