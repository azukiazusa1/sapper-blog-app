import { gql } from "@urql/core"

export const postBySlugQuery = gql`
query postBySlug($slug: String!) {
  blogPostCollection(where: {slug: $slug}, limit: 1) {
    items{
      title
      slug
      about
      article
      relatedArticleCollection(limit: 5) {
        items {
          title
          slug
          createdAt
          thumbnail {
            title
            url
          }
        }
      }
      createdAt
      tagsCollection(limit: 5) {
        items {
          name
          slug
        }
      }
    }
  }
}`