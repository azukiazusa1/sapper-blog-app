import secrets from "$lib/server/secrets";
import type { AnalyticsDataRepositoryInterface, PopularPost } from "./types";
import { analyticsDataClient } from "./client";

export class AnalyticsDataRepository implements AnalyticsDataRepositoryInterface {
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
      dimensionFilter: {
        andGroup: {
          expressions: [
            {
              filter: {
                fieldName: "pagePath",
                stringFilter: {
                  value: "^/blog/.+$",
                  matchType: "FULL_REGEXP",
                },
              },
            },
            {
              notExpression: {
                filter: {
                  fieldName: "pagePath",
                  stringFilter: {
                    value: "/blog/shorts/",
                    matchType: "EXACT",
                  },
                },
              },
            },
          ],
        },
      },
      limit: 10,
    });

    const rows = response[0].rows ?? [];
    const popularPosts: PopularPost[] = rows.map((row) => {
      const [path, title] = row.dimensionValues;
      const [views] = row.metricValues;
      return {
        title: title.value || "",
        path: path.value || "",
        views: Number(views.value ?? 0),
      };
    });

    return popularPosts;
  }
}
