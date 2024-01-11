import type { ShortRepositoryInterFace } from "./types";
import type {
  AllShortsQuery,
  ShortByIdQuery,
  ShortsQuery,
  ShortsQueryVariables,
} from "../../generated/graphql";
import { request } from "../client";
import { shortsQuery } from "../../queries/Shorts";
import { shortByIdQuery } from "../../queries/ShortById";
import { allShortsQuery } from "../../queries/AllShorts";

export class ShortRepository implements ShortRepositoryInterFace {
  async get(queryVariables: ShortsQueryVariables): Promise<ShortsQuery> {
    const shorts = await request(shortsQuery, queryVariables);
    return shorts as ShortsQuery;
  }

  async getAll(): Promise<AllShortsQuery> {
    const shorts = await request(allShortsQuery);
    return shorts as AllShortsQuery;
  }

  async findById(id: string): Promise<ShortByIdQuery> {
    const short = await request(shortByIdQuery, { id });
    return short as ShortByIdQuery;
  }
}
