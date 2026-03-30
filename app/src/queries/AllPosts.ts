import { gql } from "@urql/core";

export const allPostsQuery = gql`
  query AllPosts($order: BlogPostOrder = createdAt_DESC, $locale: String) {
    blogPostCollection(order: [$order], limit: 10000, locale: $locale) {
      items {
        title
        slug
        about
        createdAt
      }
    }
  }
`;
