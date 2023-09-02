import type { AnalyticsDataRepositoryInterface, PopularPost } from "./types";

export class MockAnalyticsDataRepository
  implements AnalyticsDataRepositoryInterface
{
  getPopularPosts(): Promise<PopularPost[]> {
    return Promise.resolve([
      
    ]);
  }
}
