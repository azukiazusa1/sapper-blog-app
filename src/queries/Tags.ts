import { gql } from "@urql/core"

export const TagsQuery = gql`
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
`
