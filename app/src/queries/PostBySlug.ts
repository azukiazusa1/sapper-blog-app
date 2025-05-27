import { gql } from "@urql/core";

export const postBySlugQuery = gql`
  query postBySlug($slug: String!) {
    blogPostCollection(where: { slug: $slug }, limit: 1) {
      items {
        title
        slug
        about
        article
        audio
        sys {
          createdAt
          updatedAt
        }
        relatedArticleCollection(limit: 5) {
          items {
            title
            slug
            sys {
              createdAt
            }
            thumbnail {
              title
              url(transform: { format: WEBP, quality: 50 })
            }
          }
        }
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
