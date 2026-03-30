import { gql } from "@urql/core";

export const postBySlugQuery = gql`
  query postBySlug($slug: String!, $locale: String) {
    blogPostCollection(where: { slug: $slug }, limit: 1, locale: $locale) {
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
