import { gql } from "@urql/core"

export const searchPostsQuery = gql`
  query SearchPosts(
    $order: BlogPostOrder = createdAt_DESC,
    $limit: Int = 12,
    $skip: Int = 0,
    $q: String!
  ) {
    blogPostCollection(
      limit: $limit,
      skip: $skip,
      order: [$order], 
      where: {
        OR: [
          { about_contains: $q },
          { article_contains: $q },
          { title_contains: $q }
        ]}
    ) {
      total
      skip
      limit
      items {
        ...BlogPostItem
      }
    }
  }
`