import type { PostsQuery } from "../../generated/graphql";

export interface Post {
  fields: {
    title: string
    about: string
    slug: string
  }
}

export interface PostRepositoryInterFace {
  get(): Promise<PostsQuery>
  find(id: string): Promise<any>
}