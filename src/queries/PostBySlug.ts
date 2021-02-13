import { gql } from "@urql/core"

export const postBySlugQuery = gql`query postBySlug($slug: String!) {
  blogPostCollection(where: {slug: $slug}){
    items{
      title
      slug
      about
      article
      relatedArticleCollection(limit: 5) {
        items {
          title
          slug
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