import type {
  PostsQueryVariables,
  PreviewPostQuery,
  PreviewPostsQuery,
} from "../../generated/graphql";
import {
  createDummyPosts,
  createDummyPostBySlugQuery,
} from "../../utils/createDummyPosts";
import type { PostRepositoryInterFace } from "./types";

export class MockPostRepository implements PostRepositoryInterFace {
  get(queryVariables: PostsQueryVariables) {
    return Promise.resolve(
      createDummyPosts(100, queryVariables.limit, queryVariables.skip)(),
    );
  }
  search(queryVariables: PostsQueryVariables) {
    return Promise.resolve(
      createDummyPosts(100, queryVariables.limit, queryVariables.skip)(),
    );
  }
  find(slug: string) {
    return Promise.resolve(createDummyPostBySlugQuery(slug));
  }
  findAll() {
    return Promise.resolve(createDummyPosts(100)());
  }
  getAllPreview(): Promise<PreviewPostsQuery> {
    return Promise.resolve(null);
  }

  getPreview(): Promise<PreviewPostQuery> {
    return Promise.resolve(null);
  }
}
