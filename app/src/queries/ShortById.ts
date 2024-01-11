import { gql } from "@urql/core";

export const shortByIdQuery = gql`
  query shortById($id: String!) {
    short(id: $id) {
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
`;
