import { useRepositories } from "../../../repositories/useRepositories";

const { post, github } = useRepositories();

import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { markdownToHtml } from "$lib/server/markdownToHtml";
import { getLocale } from "$paraglide/runtime";

const toContentfulLocale = (locale: string): string | undefined =>
  locale === "en" ? "en-GB" : undefined;

export const load: PageServerLoad = async ({ params }) => {
  const { slug } = params;
  const contentfulLocale = toContentfulLocale(getLocale());

  const data = await post.find(slug, contentfulLocale);
  const contributors = await github.getContributorsByFile(slug);
  if (data.blogPostCollection.items.length === 0) {
    error(404, "Not Found");
  }
  const input = data.blogPostCollection.items[0].article;
  const { html: contents, toc } = await markdownToHtml(input);
  return {
    contents,
    toc,
    rawMarkdown: input,
    post: data.blogPostCollection.items[0],
    contributors,
  };
};
