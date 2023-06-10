import RepositoryFactory, {
  POST,
  GITHUB,
} from "../../../repositories/RepositoryFactory";
const PostRepository = RepositoryFactory[POST];
const GitHubRepository = RepositoryFactory[GITHUB];

import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { markdownToHtml } from "$lib/server/markdownToHtml";

export const load: PageServerLoad = async ({ params }) => {
  const { slug } = params;

  const data = await PostRepository.find(slug);
  const contributors = await GitHubRepository.getContributorsByFile(slug);
  if (data.blogPostCollection.items.length === 0) {
    throw error(404, "Not Found");
  }
  const input = data.blogPostCollection.items[0].article;
  const contents = await markdownToHtml(input);
  return {
    contents,
    post: data.blogPostCollection.items[0],
    contributors,
  };
};
