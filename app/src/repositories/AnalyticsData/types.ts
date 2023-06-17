export type PopularPost = {
  title: string;
  path: string;
  views: number;
};

export interface AnalyticsDataRepositoryInterface {
  /**
   * PV が多い記事を取得する
   */
  getPopularPosts(): Promise<PopularPost[]>;
}
