import secrets from "$lib/server/secrets";
import type { AnalyticsDataRepositoryInterface, PopularPost } from "./types";
import { analyticsDataClient } from "./client";

export class AnalyticsDataRepository
  implements AnalyticsDataRepositoryInterface
{
  async getPopularPosts(): Promise<PopularPost[]> {
    const response = await analyticsDataClient.runReport({
      property: "properties/" + secrets.propertyId,
      dimensions: [
        {
          name: "pagePath",
        },
        {
          name: "pageTitle",
        },
      ],
      metrics: [
        {
          name: "screenPageViews",
        },
      ],
      dateRanges: [
        {
          startDate: "7daysAgo",
          endDate: "today",
        },
      ],
      limit: 10,
    });

    const rows = response[0].rows ?? [];
    const popularPosts: PopularPost[] = rows
      .map((row) => {
        const [path, title] = row.dimensionValues;
        const [views] = row.metricValues;
        return {
          title: title.value || "",
          path: path.value || "",
          views: Number(views.value ?? 0),
        };
      })
      // /blog 以下の記事のみを取得する
      .filter((post) => {
        return post.path.startsWith("/blog/") && post.path !== "/blog/";
      });

    return popularPosts;
  }
}
