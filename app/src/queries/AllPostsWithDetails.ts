import { gql } from "@urql/core";

export const allPostsWithDetailsQuery = gql`
  query AllPostsWithDetails(
    $order: BlogPostOrder = createdAt_DESC
    $locale: String
  ) {
    blogPostCollection(order: [$order], limit: 10000, locale: $locale) {
      total
      skip
      limit
      items {
        title
        slug
        about
        article
        audio
        relatedArticleCollection(limit: 5) {
          items {
            title
            slug
            createdAt
            thumbnail {
              title
              url(transform: { format: WEBP, quality: 50 })
            }
          }
        }
        createdAt
        updatedAt
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
        selfAssessment
      }
    }
  }
`;
