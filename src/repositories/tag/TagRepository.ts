import type { TagsQuery } from "../../generated/graphql";
import { tagsQuery } from "../../queries/Tags";
import { request } from "../client";
import type { TagsRepositoryInterFace } from "./types";

export class TagRepository implements TagsRepositoryInterFace {
  async get() {
    const posts = await request(tagsQuery, {})
    return posts as TagsQuery
  }

  async find(slug: string) {
    return Promise.resolve()
  }
}