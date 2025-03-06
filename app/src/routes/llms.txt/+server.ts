import type { RequestHandler } from "@sveltejs/kit";
import RepositoryFactory, { POST } from "../../repositories/RepositoryFactory";
import variables from "$lib/variables";
const PostRepository = RepositoryFactory[POST];
export const prerender = true;

const siteUrl = variables.baseURL;

type Item = {
  title: string;
  slug: string;
  about: string;
};

const renderLlmsTxt = (items: Item[]) => `# azukiazusa のテックブログ2

> このブログは [azukiazusa](https://github.com/azukiazusa1) によって運営されている技術ブログです。主に Web フロントエンド周辺の技術について書いています。

## Blog Posts

${items
  .map(
    (item) =>
      `- [${item.title}](${siteUrl}/blog/${item.slug}.md) - ${item.about}`,
  )
  .join("")}
  `;
export const GET: RequestHandler = async () => {
  const posts = await PostRepository.findAll();
  const items = posts.blogPostCollection.items
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .filter((a): a is Item => !!a.title && !!a.slug && !!a.about);

  const feed = renderLlmsTxt(items);

  const headers = {
    "Content-Type": "text/markdown; charset=utf-8",
    "Cache-Control": "max-age=0, s-max-age=3600",
  };

  return new Response(feed, {
    headers,
  });
};
