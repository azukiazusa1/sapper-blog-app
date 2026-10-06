import type { AnalyticsDataRepositoryInterface, PopularPost } from "./types";

export class MockAnalyticsDataRepository implements AnalyticsDataRepositoryInterface {
  getPopularPosts(): Promise<PopularPost[]> {
    return Promise.resolve([
      {
        title: "はじめての GraphQL",
        path: "/blog/what-is-graphql",
        views: 100,
      },
      {
        title: "JavaScriptライブラリSvelteとは",
        path: "/blog/what-is-svelte",
        views: 50,
      },
      {
        title:
          "SvelteKit の remote functions でコンポーネント内で非同期にデータを取得する",
        path: "/blog/sveltekit-remote-functions",
        views: 10,
      },
    ]);
  }
}
