import { useRepositories } from "../../../repositories/useRepositories";

const { post, github } = useRepositories();

import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { markdownToHtml } from "$lib/server/markdownToHtml";

export const load: PageServerLoad = async ({ params }) => {
  const { slug } = params;

  const data = await post.find(slug);
  const contributors = await github.getContributorsByFile(slug);
  if (data.blogPostCollection.items.length === 0) {
    error(404, "Not Found");
  }
  const input = data.blogPostCollection.items[0].article;
  const contents = await markdownToHtml(input);
  return {
    contents,
    rawMarkdown: input,
    post: data.blogPostCollection.items[0],
    contributors,
  };
};
