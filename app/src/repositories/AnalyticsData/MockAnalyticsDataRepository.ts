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
        title: "Go 言語のパッケージ管理ツール Go Modules",
        path: "/blog/go-modules-go-1-11-go-gopath-go-usdgopath-src",
        views: 10,
      },
    ]);
  }
}
