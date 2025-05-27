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
    error(404, "Not Found");
  }
  const input = data.blogPostCollection.items[0].article;
  const contents = await markdownToHtml(input);

  const originalPost = data.blogPostCollection.items[0];
  const post = {
    ...originalPost,
    publishedDate: originalPost.sys.createdAt,
    updatedDate: originalPost.sys.updatedAt,
    relatedArticleCollection: {
      ...originalPost.relatedArticleCollection,
      items: originalPost.relatedArticleCollection.items.map(item => ({
        ...item,
        createdAt: item.sys.createdAt,
      }))
    }
  };

  return {
    contents,
    post: post,
    contributors,
  };
};
