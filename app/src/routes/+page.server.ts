import type { PageServerLoad } from "./$types";
import { useRepositories } from "../repositories/useRepositories";
import { getLocale } from "$paraglide/runtime";

const { post, short, analyticsData, tag } = useRepositories();

const toContentfulLocale = (locale: string): string | undefined =>
  locale === "en" ? "en-GB" : undefined;

export const load: PageServerLoad = async () => {
  const locale = toContentfulLocale(getLocale());
  const [latestPosts, shorts, popularPosts, tags] = await Promise.all([
    post.get({
      limit: 3,
      locale,
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
