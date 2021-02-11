import { createDummyPosts, createDummyPost } from "../../utils/createDummyPosts";
import type { PostRepositoryInterFace } from "./types";

export class MockPostRepository implements PostRepositoryInterFace {
  get() {
    return Promise.resolve(createDummyPosts(15))
  }
  find(id: string) {
    return Promise.resolve(createDummyPost(id))
  }
}