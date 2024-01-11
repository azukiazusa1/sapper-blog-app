import { gql } from "@urql/core";

export const allShortsQuery = gql`
  query AllShorts($order: ShortOrder = createdAt_DESC) {
    shortCollection(order: [$order], limit: 10000) {
      items {
        sys {
          id
        }
        title
        content1
        content2
        content3
        content4
        createdAt
      }
    }
  }
`;
