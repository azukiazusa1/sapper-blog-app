import type { PageServerLoad } from "./$types";
import { renderShortList } from "$lib/server/shorts";
import { useRepositories } from "../../../repositories/useRepositories";
import { getLocale } from "$paraglide/runtime";

const { post, short } = useRepositories();

const toContentfulLocale = (locale: string): string | undefined =>
  locale === "en" ? "en-GB" : undefined;

export const load: PageServerLoad = async () => {
  const locale = toContentfulLocale(getLocale());
  const promises = [post.get({ locale }), short.getAll()] as const;

  const [posts, shorts] = await Promise.all(promises);
  return {
    posts,
    shorts: {
      ...shorts,
      shortCollection: {
        ...shorts.shortCollection,
        items: await renderShortList(shorts.shortCollection.items),
      },
    },
  };
};
