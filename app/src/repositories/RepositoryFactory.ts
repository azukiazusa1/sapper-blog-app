import { PostRepository } from "./post";
import type { PostRepositoryInterFace } from "./post";
import { TagRepository } from "./tag";
import type { TagsRepositoryInterFace } from "./tag";
import type { GitHubRepositoryInterface } from "./GitHub/types";
import { GitHubRepository } from "./GitHub/GitHubRepository";
import { MockGitHubRepository } from "./GitHub";
import {
  AnalyticsDataRepository,
  MockAnalyticsDataRepository,
  type AnalyticsDataRepositoryInterface,
} from "./AnalyticsData";

export const POST = Symbol("post");
export const TAG = Symbol("tag");
export const GITHUB = Symbol("github");
export const ANALYTICS_DATA = Symbol("analyticsData");

export interface Repositories {
  [POST]: PostRepositoryInterFace;
  [TAG]: TagsRepositoryInterFace;
  [GITHUB]: GitHubRepositoryInterface;
  [ANALYTICS_DATA]: AnalyticsDataRepositoryInterface;
}

export default {
  [POST]: new PostRepository(),
  [TAG]: new TagRepository(),
  [GITHUB]:
    process.env.VERCEL_ENV === "production"
      ? new GitHubRepository()
      : new MockGitHubRepository(),
  [ANALYTICS_DATA]:
    process.env.VERCEL_ENV === "production"
      ? new AnalyticsDataRepository()
      : new MockAnalyticsDataRepository(),
} satisfies Repositories;
