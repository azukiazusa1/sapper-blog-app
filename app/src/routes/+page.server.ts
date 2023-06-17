import type { PageServerLoad } from "./$types";
import RepositoryFactory, {
  ANALYTICS_DATA,
  POST,
} from "../repositories/RepositoryFactory";
const PostRepository = RepositoryFactory[POST];
const AnalyticsDataRepository = RepositoryFactory[ANALYTICS_DATA];

export const load: PageServerLoad = async () => {
  const [latestPosts, popularPosts] = await Promise.all([
    PostRepository.get({
      limit: 3,
    }),
    AnalyticsDataRepository.getPopularPosts(),
  ]);

  return {
    latestPosts,
    popularPosts,
  };
};
