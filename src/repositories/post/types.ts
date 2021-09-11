import type { AllPostsQuery, PostBySlugQuery, PostsQuery, PostsQueryVariables, SearchPostsQuery, SearchPostsQueryVariables } from "../../generated/graphql";

export interface Post {
  fields: {
    title: string
    about: string
    slug: string
  }
}

export interface PostRepositoryInterFace {
  get(queryVariables: PostsQueryVariables): Promise<PostsQuery>
  search(queryVariables: SearchPostsQueryVariables): Promise<SearchPostsQuery>
  find(slug: string): Promise<PostBySlugQuery>
  findAll(): Promise<AllPostsQuery>
}