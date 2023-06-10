import { gql } from "@urql/core";

export const blogPostItem = gql`
  fragment BlogPostItem on BlogPost {
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
`;
