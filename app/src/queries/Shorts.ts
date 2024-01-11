import { gql } from "@urql/core";

export const shortsQuery = gql`
  query Shorts(
    $order: ShortOrder = createdAt_DESC
    $limit: Int = 20
    $skip: Int = 0
  ) {
    shortCollection(limit: $limit, skip: $skip, order: [$order]) {
      total
      skip
      limit
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
