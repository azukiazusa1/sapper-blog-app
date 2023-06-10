import { gql } from "@urql/core";

export const tagBySlugQuery = gql`
  query TagBySlug($slug: String!, $skip: Int = 0) {
    tagCollection(where: { slug: $slug }, limit: 1) {
      items {
        name
        slug
        linkedFrom {
          blogPostCollection(limit: 12, skip: $skip) {
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
      }
    }
  }
`;
