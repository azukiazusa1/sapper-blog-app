import type { PageServerLoad } from "./$types";
import RepositoryFactory, {
  ANALYTICS_DATA,
  SHORT,
  POST,
  TAG,
} from "../repositories/RepositoryFactory";
const PostRepository = RepositoryFactory[POST];
const ShortRepository = RepositoryFactory[SHORT];
const AnalyticsDataRepository = RepositoryFactory[ANALYTICS_DATA];
const TagRepository = RepositoryFactory[TAG];

export const load: PageServerLoad = async () => {
  const [latestPosts, shorts, popularPosts, tags] = await Promise.all([
    PostRepository.get({
      limit: 3,
    }),
    ShortRepository.get({}),
    AnalyticsDataRepository.getPopularPosts(),
    TagRepository.get(),
  ]);

  tags.tagCollection.items.sort((a, b) => {
    return (
      b.linkedFrom.entryCollection.total - a.linkedFrom.entryCollection.total
    );
  });

  return {
    latestPosts,
    shorts,
    popularPosts,
    tags,
  };
};
