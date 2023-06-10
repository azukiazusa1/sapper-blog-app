import { gql } from "@urql/core";

export const tagsQuery = gql`
  query Tags {
    tagCollection {
      items {
        linkedFrom {
          entryCollection {
            total
          }
        }
        name
        slug
      }
    }
  }
`;
