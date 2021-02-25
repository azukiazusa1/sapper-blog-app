import type { PostsQueryVariables } from "../../generated/graphql";
import { createDummyPosts, createDummyPost, createDummyPostBySlugQuery } from "../../utils/createDummyPosts";
import type { PostRepositoryInterFace } from "./types";

export class MockPostRepository implements PostRepositoryInterFace {
  get(queryVariables: PostsQueryVariables) {
    return Promise.resolve(createDummyPosts(100, queryVariables.limit, queryVariables.skip)())
  }
  search(queryVariables: PostsQueryVariables) {
    return Promise.resolve(createDummyPosts(100, queryVariables.limit, queryVariables.skip)())
  }
  find(slug: string) {
    return Promise.resolve(createDummyPostBySlugQuery(slug))
  }
}