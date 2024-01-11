import type { PageServerLoad } from "./$types";
import RepositoryFactory, {
  ANALYTICS_DATA,
  SHORT,
  POST,
} from "../repositories/RepositoryFactory";
const PostRepository = RepositoryFactory[POST];
const ShortRepository = RepositoryFactory[SHORT];
const AnalyticsDataRepository = RepositoryFactory[ANALYTICS_DATA];

export const load: PageServerLoad = async () => {
  const [latestPosts, shorts, popularPosts] = await Promise.all([
    PostRepository.get({
      limit: 3,
    }),
    ShortRepository.get({}),
    AnalyticsDataRepository.getPopularPosts(),
  ]);

  return {
    latestPosts,
    shorts,
    popularPosts,
  };
};
