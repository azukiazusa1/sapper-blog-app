import type { TagBySlugQuery, TagBySlugQueryVariables, TagsQuery } from "../../generated/graphql";

export interface TagsRepositoryInterFace {
  get(): Promise<TagsQuery>
  find(queryVariables: TagBySlugQueryVariables): Promise<TagBySlugQuery>
}
