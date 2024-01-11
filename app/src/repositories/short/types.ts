import type {
  AllShortsQuery,
  ShortByIdQuery,
  ShortsQuery,
  ShortsQueryVariables,
} from "../../generated/graphql";

export interface ShortRepositoryInterFace {
  get(queryVariables: ShortsQueryVariables): Promise<ShortsQuery>;
  getAll(): Promise<AllShortsQuery>;
  findById(id: string): Promise<ShortByIdQuery>;
}
