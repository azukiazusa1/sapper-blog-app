import { gql } from '@urql/core'

export const PreviewPosts = gql`
  query PreviewPosts {
    blogPostCollection(preview: true, where: { sys: { firstPublishedAt_exists: false } }) {
      items {
        sys {
          id
        }
        title
        about
        thumbnail {
          title
          url(transform: { format: WEBP, quality: 50 })
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
