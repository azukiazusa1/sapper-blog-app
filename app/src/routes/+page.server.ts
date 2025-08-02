import type { PageServerLoad } from "./$types";
import { useRepositories } from "../repositories/useRepositories";

const { post, short, analyticsData, tag } = useRepositories();

export const load: PageServerLoad = async () => {
  const [latestPosts, shorts, popularPosts, tags] = await Promise.all([
    post.get({
      limit: 3,
    }),
    short.get({}),
    analyticsData.getPopularPosts(),
    tag.get(),
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
