import type {
  TagBySlugQuery,
  TagBySlugQueryVariables,
  TagsQuery,
} from "../../generated/graphql";
import { tagBySlugQuery } from "../../queries/TagBySlug";
import { tagsQuery } from "../../queries/Tags";
import { request } from "../client";
import type { TagsRepositoryInterFace } from "./types";

export class TagRepository implements TagsRepositoryInterFace {
  async get() {
    const tags = await request(tagsQuery, {});
    return tags as TagsQuery;
  }

  async find(queryVariables: TagBySlugQueryVariables) {
    const tag = await request(tagBySlugQuery, queryVariables);
    return tag as TagBySlugQuery;
  }
}
