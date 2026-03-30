import { paginateParams } from "../../../../utils/paginateParams";
import { useRepositories } from "../../../../repositories/useRepositories";
import type { PageServerLoad } from "./$types";
import { getLocale } from "$paraglide/runtime";

const { post } = useRepositories();

const toContentfulLocale = (locale: string): string | undefined =>
  locale === "en" ? "en-GB" : undefined;

export const load: PageServerLoad = async ({ params }) => {
  const page = Number(params.page);
  const { limit, skip } = paginateParams(page);
  const locale = toContentfulLocale(getLocale());
  const posts = await post.get({ limit, skip, locale });
  return {
    page,
    posts,
  };
};
