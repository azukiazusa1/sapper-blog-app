import type { TagsQuery } from "../../generated/graphql";

export interface TagsRepositoryInterFace {
  get(): Promise<TagsQuery>
  find(slug: string): Promise<void>
}
